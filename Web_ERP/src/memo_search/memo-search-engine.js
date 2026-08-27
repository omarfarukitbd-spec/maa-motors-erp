import { TransactionDAO, CustomerDAO } from '../dao.js';
import { safeRound } from '../utils.js';

/**
 * Clean and normalize memo/voucher query string
 * Strips '#', 'INV-', 'MEMO-', and leading/trailing whitespace
 */
export function normalizeMemoQuery(query = '') {
    return String(query || '')
        .trim()
        .replace(/^[#№\s]+/, '')
        .replace(/^(INV|MEMO|VOUCHER|BILL)[-_\s]*/i, '')
        .trim();
}

/**
 * Search memos by number/voucher string
 * Supports exact match, prefix match and fallback search
 */
export async function searchMemosByNumber(rawQuery) {
    const cleanQ = normalizeMemoQuery(rawQuery);
    if (!cleanQ || cleanQ.length < 1) return [];

    try {
        // 1. Direct query on voucherNo exact
        const exactSnap = await TransactionDAO.collection.where('voucherNo', '==', cleanQ).get();
        const results = [];
        exactSnap.forEach(doc => results.push({ id: doc.id, ...doc.data() }));

        // 2. Also try uppercase/lowercase variants if not matched
        if (results.length === 0 && cleanQ.toLowerCase() !== cleanQ.toUpperCase()) {
            const upperSnap = await TransactionDAO.collection.where('voucherNo', '==', cleanQ.toUpperCase()).get();
            upperSnap.forEach(doc => results.push({ id: doc.id, ...doc.data() }));
        }

        // 3. Prefix search / Range query if needed
        if (results.length === 0 && cleanQ.length >= 2) {
            const rangeSnap = await TransactionDAO.collection
                .where('voucherNo', '>=', cleanQ)
                .where('voucherNo', '<=', cleanQ + '\uf8ff')
                .limit(10)
                .get();
            rangeSnap.forEach(doc => {
                if (!results.some(r => r.id === doc.id)) {
                    results.push({ id: doc.id, ...doc.data() });
                }
            });
        }

        // 4. Enrich with customer details
        const enriched = await Promise.all(results.map(async (txn) => {
            return await enrichMemoData(txn);
        }));

        return enriched;
    } catch (e) {
        console.error("searchMemosByNumber error:", e);
        return [];
    }
}

/**
 * Enrich single memo transaction with customer profile & previous balance
 */
export async function enrichMemoData(txn) {
    if (!txn) return null;
    let customer = {};
    if (txn.customerId) {
        try {
            customer = (await CustomerDAO.getById(txn.customerId)) || {};
        } catch (e) {
            console.warn("Error fetching customer for memo:", e);
        }
    }

    // Determine previous and current due
    const bill = Number(txn.bill) || 0;
    const paid = Number(txn.paid) || 0;
    const prevDue = txn.prevDue !== undefined ? Number(txn.prevDue) : (Number(customer.totalDue || 0) - (bill - paid));
    const currentDue = txn.currentDue !== undefined ? Number(txn.currentDue) : safeRound(prevDue + (bill - paid));

    return {
        ...txn,
        customerName: txn.customerName || customer.name || 'Unknown Customer',
        customerPhone: customer.phone || '',
        customerAccountNo: customer.accountNo || '',
        customerAddress: customer.address || '',
        customerZone: customer.zone || '',
        customerTotalDue: customer.totalDue || 0,
        computedPrevDue: safeRound(prevDue),
        computedCurrentDue: safeRound(currentDue)
    };
}

/**
 * Fetch latest 10 recent memos for quick access chips
 */
export async function getRecentMemos(limitCount = 10) {
    try {
        const snap = await TransactionDAO.collection
            .orderBy('createdAt', 'desc')
            .limit(limitCount)
            .get();

        const list = [];
        snap.forEach(doc => {
            const data = doc.data();
            if (data.voucherNo && data.voucherNo !== 'OPENING') {
                list.push({ id: doc.id, ...data });
            }
        });
        return list;
    } catch (e) {
        console.error("getRecentMemos error:", e);
        return [];
    }
}

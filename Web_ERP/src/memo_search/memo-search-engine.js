import { TransactionDAO, CustomerDAO } from '../dao.js';
import { safeRound } from '../utils.js';

/**
 * Normalize memo/voucher query string
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
 */
export async function searchMemosByNumber(rawQuery) {
    const cleanQ = normalizeMemoQuery(rawQuery);
    if (!cleanQ || cleanQ.length < 1) return [];

    try {
        const exactSnap = await TransactionDAO.collection.where('voucherNo', '==', cleanQ).get();
        const results = [];
        exactSnap.forEach(doc => results.push({ id: doc.id, ...doc.data() }));

        if (results.length === 0 && cleanQ.toLowerCase() !== cleanQ.toUpperCase()) {
            const upperSnap = await TransactionDAO.collection.where('voucherNo', '==', cleanQ.toUpperCase()).get();
            upperSnap.forEach(doc => results.push({ id: doc.id, ...doc.data() }));
        }

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
        customerInitialDue: customer.initialDue || 0,
        computedPrevDue: safeRound(prevDue),
        computedCurrentDue: safeRound(currentDue)
    };
}

/**
 * Get adjacent previous and next memos for instant stepper navigation
 */
export async function getAdjacentMemos(currentVoucherNo) {
    try {
        const snap = await TransactionDAO.collection
            .orderBy('createdAt', 'desc')
            .limit(50)
            .get();

        const validMemos = [];
        snap.forEach(doc => {
            const data = doc.data();
            if (data.voucherNo && data.voucherNo !== 'OPENING' && !validMemos.some(m => m.voucherNo === data.voucherNo)) {
                validMemos.push({ id: doc.id, voucherNo: data.voucherNo, customerName: data.customerName });
            }
        });

        const currentIdx = validMemos.findIndex(m => m.voucherNo === currentVoucherNo);
        let prevMemo = null;
        let nextMemo = null;

        if (currentIdx !== -1) {
            if (currentIdx > 0) nextMemo = validMemos[currentIdx - 1]; // newer
            if (currentIdx < validMemos.length - 1) prevMemo = validMemos[currentIdx + 1]; // older
        }

        return { prevMemo, nextMemo };
    } catch (e) {
        console.error("getAdjacentMemos error:", e);
        return { prevMemo: null, nextMemo: null };
    }
}

/**
 * Fetch customer lifetime stats & full sorted statement
 */
export async function getCustomerLifetimeStats(customerId) {
    if (!customerId) return { totalBills: 0, totalPaid: 0, count: 0, transactions: [] };
    try {
        const txns = await TransactionDAO.getByCustomer(customerId);
        let totalBills = 0;
        let totalPaid = 0;

        txns.forEach(t => {
            totalBills += Number(t.bill) || 0;
            totalPaid += Number(t.paid) || 0;
        });

        const sorted = txns.sort((a, b) => {
            const da = new Date(a.date).getTime() || 0;
            const db = new Date(b.date).getTime() || 0;
            return da - db;
        });

        return {
            totalBills: safeRound(totalBills),
            totalPaid: safeRound(totalPaid),
            count: txns.length,
            transactions: sorted
        };
    } catch (e) {
        console.error("getCustomerLifetimeStats error:", e);
        return { totalBills: 0, totalPaid: 0, count: 0, transactions: [] };
    }
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

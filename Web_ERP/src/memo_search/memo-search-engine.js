import { TransactionDAO, CustomerDAO } from '../dao.js';
import { safeRound, toDBDate } from '../utils.js';
import { getCustomerCache } from '../customer/customer-state.js';
import { extractVoucherNumber } from './memo-book-audit-calc.js';

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
        const results = [];
        const seenIds = new Set();

        const addDocs = (snap) => {
            snap.forEach(doc => {
                if (!seenIds.has(doc.id)) {
                    seenIds.add(doc.id);
                    results.push({ id: doc.id, ...doc.data() });
                }
            });
        };

        // 1. Exact match on raw and cleaned query
        const exactSnap = await TransactionDAO.collection.where('voucherNo', '==', cleanQ).get();
        addDocs(exactSnap);

        // 2. Exact match with '#' prefix (e.g. '#146')
        const hashSnap = await TransactionDAO.collection.where('voucherNo', '==', '#' + cleanQ).get();
        addDocs(hashSnap);

        // 3. Match by refMemoNo (e.g. delayed Less linked to #146)
        const refSnap = await TransactionDAO.collection.where('refMemoNo', '==', cleanQ).get();
        addDocs(refSnap);

        // 4. Upper case match if different
        if (cleanQ.toLowerCase() !== cleanQ.toUpperCase()) {
            const upperSnap = await TransactionDAO.collection.where('voucherNo', '==', cleanQ.toUpperCase()).get();
            addDocs(upperSnap);
        }

        // 5. Prefix range search if still empty and length >= 2
        if (results.length === 0 && cleanQ.length >= 2) {
            const rangeSnap = await TransactionDAO.collection
                .where('voucherNo', '>=', cleanQ)
                .where('voucherNo', '<=', cleanQ + '\uf8ff')
                .limit(10)
                .get();
            addDocs(rangeSnap);
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
    if (!customer.name && txn.customerId) {
        const cached = (getCustomerCache() || []).find(c => c.id === txn.customerId);
        if (cached) customer = cached;
    }
    if (!customer.name && txn.customerName) {
        const cleanName = String(txn.customerName).replace(/^\[.*?\]\s*/, '').trim();
        const cached = (getCustomerCache() || []).find(c => c.name === txn.customerName || c.name === cleanName);
        if (cached) customer = cached;
    }

    const bill = Number(txn.bill) || 0;
    const paid = Number(txn.paid) || 0;
    const prevDue = txn.prevDue !== undefined ? Number(txn.prevDue) : safeRound(Number(customer.totalDue || 0) - (bill - paid));
    const currentDue = txn.currentDue !== undefined ? Number(txn.currentDue) : safeRound(prevDue + (bill - paid));

    // Fetch any later-date Less or Sales Return entries linked to this memo
    let linkedLessList = [];
    let totalLinkedLess = 0;
    const vNum = extractVoucherNumber(txn.voucherNo || txn.refMemoNo);
    if (vNum !== null) {
        try {
            const lessSnap = await TransactionDAO.collection
                .where('refMemoNo', '==', String(vNum))
                .get();
            lessSnap.forEach(doc => {
                const d = doc.data();
                if (doc.id !== txn.id && (d.receivedType === 'Less' || Number(d.paid) > 0)) {
                    linkedLessList.push({ id: doc.id, ...d });
                    totalLinkedLess = safeRound(totalLinkedLess + (Number(d.paid) || 0));
                }
            });
        } catch (e) {
            console.warn("Error fetching linked less entries:", e);
        }
    }

    return {
        ...txn,
        customerName: txn.customerName || customer.name || 'Unknown Customer',
        customerPhone: customer.phone || txn.customerPhone || txn.phone || '',
        customerAccountNo: customer.accountNo || txn.customerAccountNo || txn.accountNo || '',
        customerAddress: customer.address || txn.customerAddress || txn.address || '',
        customerZone: customer.zone || txn.customerZone || txn.zone || '',
        customerTotalDue: customer.totalDue || 0,
        customerInitialDue: customer.initialDue || 0,
        computedPrevDue: safeRound(prevDue),
        computedCurrentDue: safeRound(currentDue),
        linkedLessList,
        totalLinkedLess: safeRound(totalLinkedLess),
        netAdjustedBill: safeRound(bill - totalLinkedLess)
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
            totalBills = safeRound(totalBills + (Number(t.bill) || 0));
            totalPaid = safeRound(totalPaid + (Number(t.paid) || 0));
        });

        const sorted = txns.sort((a, b) => {
            const da = toDBDate(a.date);
            const db = toDBDate(b.date);
            if (da !== db) return da.localeCompare(db);
            const ta = a.createdAt?.toMillis?.() || 0;
            const tb = b.createdAt?.toMillis?.() || 0;
            return ta - tb;
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

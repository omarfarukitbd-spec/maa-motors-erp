import { CustomerDAO, TransactionDAO } from '../dao.js';
import { getCustomerCache } from '../customer/customer-state.js';
import { safeRound } from '../utils.js';

/**
 * Extract integer number from voucher string (e.g. "#101" -> 101, "MEMO-105" -> 105)
 */
export function extractVoucherNumber(voucherStr = '') {
    if (!voucherStr) return null;
    const match = String(voucherStr).match(/\d+/);
    return match ? parseInt(match[0], 10) : null;
}

/**
 * Fetch all transactions within a voucher number range
 * @param {number} startNo - Start voucher number (e.g. 101)
 * @param {number} endNo - End voucher number (e.g. 200)
 */
export async function fetchMemosByRange(startNo, endNo) {
    const min = Math.min(startNo, endNo);
    const max = Math.max(startNo, endNo);

    try {
        const snap = await TransactionDAO.collection.get();
        const allTxns = [];
        snap.forEach(doc => {
            allTxns.push({ id: doc.id, ...doc.data() });
        });

        const allCustomers = getCustomerCache() || [];
        const matchedMemos = [];

        allTxns.forEach(txn => {
            const vNum = extractVoucherNumber(txn.voucherNo);
            if (vNum !== null && vNum >= min && vNum <= max) {
                let cust = allCustomers.find(c => c.id === txn.customerId);
                if (!cust && txn.customerName) {
                    const cleanName = String(txn.customerName).replace(/^\[.*?\]\s*/, '').trim();
                    cust = allCustomers.find(c => c.name === txn.customerName || c.name === cleanName);
                }

                matchedMemos.push({
                    ...txn,
                    voucherNum: vNum,
                    customerName: txn.customerName || cust?.name || 'গ্রাহক',
                    customerPhone: cust?.phone || txn.customerPhone || '',
                    customerAddress: cust?.address || txn.customerAddress || '',
                    customerZone: cust?.zone || txn.customerZone || '',
                    customerAccountNo: cust?.accountNo || txn.customerAccountNo || ''
                });
            }
        });

        // Sort ascending by voucher number, then by date
        matchedMemos.sort((a, b) => {
            if (a.voucherNum !== b.voucherNum) return a.voucherNum - b.voucherNum;
            return (a.date || '').localeCompare(b.date || '');
        });

        return { success: true, memos: matchedMemos, min, max };
    } catch (e) {
        console.error("fetchMemosByRange error:", e);
        return { success: false, error: e.message, memos: [], min, max };
    }
}

/**
 * Calculate comprehensive book audit metrics, gap detection, and financial aggregation
 */
export function calculateBookAuditSummary(memos = [], startNo, endNo) {
    const min = Math.min(startNo, endNo);
    const max = Math.max(startNo, endNo);
    const totalExpected = (max - min) + 1;

    // Track present voucher numbers and duplicates
    const voucherCounts = {};
    memos.forEach(m => {
        const v = m.voucherNum;
        voucherCounts[v] = (voucherCounts[v] || 0) + 1;
    });

    const presentNumbers = new Set(Object.keys(voucherCounts).map(Number));
    const missingNumbers = [];
    const duplicateNumbers = [];

    for (let i = min; i <= max; i++) {
        if (!presentNumbers.has(i)) {
            missingNumbers.push(i);
        } else if (voucherCounts[i] > 1) {
            duplicateNumbers.push({ number: i, count: voucherCounts[i] });
        }
    }

    let totalBill = 0;
    let totalPaid = 0;
    let totalLess = 0;
    let cashPaid = 0;
    let bankPaid = 0;
    const bankBreakdown = {};

    memos.forEach(m => {
        const bill = Number(m.bill) || 0;
        const paid = Number(m.paid) || 0;
        const rType = String(m.receivedType || '').trim();
        const rFrom = String(m.receivedFrom || '').trim();

        totalBill += bill;

        if (paid > 0) {
            if (rType === 'Less' || /less|ছাড়|discount|কমিশন|সমন্বয়/i.test(rType) || /less|ছাড়|discount/i.test(rFrom)) {
                totalLess += paid;
            } else if (rType === 'Cash') {
                totalPaid += paid;
                cashPaid += paid;
            } else {
                // Default to Bank
                totalPaid += paid;
                bankPaid += paid;
                const bKey = rFrom || 'অনির্দিষ্ট ব্যাংক';
                bankBreakdown[bKey] = (bankBreakdown[bKey] || 0) + paid;
            }
        }
    });

    const totalCreditAll = safeRound(totalPaid + totalLess);
    const totalNetDue = safeRound(totalBill - totalCreditAll);
    const collectionRate = totalBill > 0 ? safeRound((totalCreditAll / totalBill) * 100) : 100;

    return {
        startNo: min,
        endNo: max,
        totalExpected,
        totalFound: memos.length,
        uniqueFound: presentNumbers.size,
        missingNumbers,
        duplicateNumbers,
        voucherCounts,
        totalBill: safeRound(totalBill),
        totalPaid: safeRound(totalPaid),
        totalLess: safeRound(totalLess),
        totalCreditAll,
        totalNetDue,
        collectionRate,
        paymentDistribution: {
            cash: safeRound(cashPaid),
            bank: safeRound(bankPaid),
            less: safeRound(totalLess),
            bankBreakdown
        }
    };
}

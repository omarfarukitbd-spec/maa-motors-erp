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
            const refNum = txn.refMemoNo ? extractVoucherNumber(txn.refMemoNo) : null;
            const targetVNum = vNum !== null ? vNum : refNum;

            if (targetVNum !== null && targetVNum >= min && targetVNum <= max) {
                let cust = allCustomers.find(c => c.id === txn.customerId);
                if (!cust && txn.customerName) {
                    const cleanName = String(txn.customerName).replace(/^\[.*?\]\s*/, '').trim();
                    cust = allCustomers.find(c => c.name === txn.customerName || c.name === cleanName);
                }

                matchedMemos.push({
                    ...txn,
                    voucherNum: targetVNum,
                    refMemoNum: refNum,
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
 * Calculate comprehensive book audit metrics, gap detection, split sales and financial aggregation
 */
export function calculateBookAuditSummary(memos = [], startNo, endNo) {
    const min = Math.min(startNo, endNo);
    const max = Math.max(startNo, endNo);
    const totalExpected = (max - min) + 1;

    // Track present voucher numbers and groups
    const voucherCounts = {};
    const voucherTxnsMap = {};
    memos.forEach(m => {
        const v = m.voucherNum;
        voucherCounts[v] = (voucherCounts[v] || 0) + 1;
        if (!voucherTxnsMap[v]) voucherTxnsMap[v] = [];
        voucherTxnsMap[v].push(m);
    });

    const presentNumbers = new Set(Object.keys(voucherCounts).map(Number));
    const missingNumbers = [];
    const exactDuplicates = [];
    const splitMemos = [];

    for (let i = min; i <= max; i++) {
        if (!presentNumbers.has(i)) {
            missingNumbers.push(i);
        } else if (voucherCounts[i] > 1) {
            const group = voucherTxnsMap[i] || [];
            // Check if there is an exact duplicate (same date, same customer, same bill, same paid)
            let isExactDup = false;
            for (let a = 0; a < group.length; a++) {
                for (let b = a + 1; b < group.length; b++) {
                    const t1 = group[a], t2 = group[b];
                    if (t1.date === t2.date && 
                        (t1.customerId === t2.customerId || t1.customerName === t2.customerName) &&
                        Number(t1.bill || 0) === Number(t2.bill || 0) &&
                        Number(t1.paid || 0) === Number(t2.paid || 0)) {
                        isExactDup = true;
                        break;
                    }
                }
                if (isExactDup) break;
            }

            if (isExactDup) {
                exactDuplicates.push({ number: i, count: voucherCounts[i] });
            } else {
                splitMemos.push({
                    number: i,
                    count: voucherCounts[i],
                    dates: [...new Set(group.map(g => g.date))],
                    hasLess: group.some(g => String(g.receivedType || '').toLowerCase() === 'less')
                });
            }
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

        totalBill = safeRound(totalBill + bill);

        if (paid > 0) {
            if (rType === 'Less' || /less|ছাড়|discount|কমিশন|সমন্বয়/i.test(rType) || /less|ছাড়|discount/i.test(rFrom)) {
                totalLess = safeRound(totalLess + paid);
            } else if (rType === 'Cash') {
                totalPaid = safeRound(totalPaid + paid);
                cashPaid = safeRound(cashPaid + paid);
            } else {
                // Default to Bank
                totalPaid = safeRound(totalPaid + paid);
                bankPaid = safeRound(bankPaid + paid);
                const bKey = rFrom || 'অনির্দিষ্ট ব্যাংক';
                bankBreakdown[bKey] = safeRound((bankBreakdown[bKey] || 0) + paid);
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
        exactDuplicates,
        duplicateNumbers: exactDuplicates, // backward compatibility
        splitMemos,
        voucherCounts,
        voucherTxnsMap,
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

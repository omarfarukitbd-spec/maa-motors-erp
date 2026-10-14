import { safeRound, formatAmountWithComma } from '../utils.js';
import { numberToBanglaWords } from '../utils/currency-words.js';

/**
 * Format currency strictly without abbreviations with Bengali Taka symbol
 * e.g. 268164672 -> "৳ ২৬,৮১,৬৪,৬৭২"
 * @param {number} amount
 * @returns {string}
 */
export function formatExactBengaliCurrency(amount) {
    const num = Math.round(Number(amount) || 0);
    return '৳ ' + formatAmountWithComma(num);
}

/**
 * Get amount in full Bengali words with suffix "মাত্র"
 * @param {number} amount
 * @returns {string}
 */
export function getBengaliWords(amount) {
    const num = Math.round(Number(amount) || 0);
    return numberToBanglaWords(num);
}

/**
 * Format missing memo voucher numbers for UI badges and print reports
 * @param {Array<number>} missingList
 * @param {boolean} isPrint
 * @returns {string}
 */
export function formatMissingMemos(missingList = [], isPrint = false) {
    if (!Array.isArray(missingList) || missingList.length === 0) {
        return isPrint ? 'সম্পূর্ণ' : 'নেই (১০০%)';
    }
    const count = missingList.length;
    if (count <= 3) {
        return `${count}টি (#${missingList.join(', #')})`;
    }
    const sample = missingList.slice(0, 3).join(', #');
    return `${count}টি (#${sample}...)`;
}

/**
 * Calculate master totals across all books obeying financial invariants
 * @param {Array<Object>} books
 */
export function calculateMasterTotals(books = []) {
    let totalGross = 0;
    let totalLess = 0;
    let totalNet = 0;
    let totalMemosCount = 0;

    // Sort books by bookSerial ascending
    const sorted = [...books].sort((a, b) => (Number(a.bookSerial) || 0) - (Number(b.bookSerial) || 0));

    let runningCumulativeNet = 0;
    let runningCumulativeMemos = 0;

    const enrichedBooks = sorted.map((b) => {
        const gross = Number(b.grossSales) || 0;
        const less = Number(b.totalLess) || 0;
        const net = safeRound(gross - less);
        runningCumulativeNet = safeRound(runningCumulativeNet + net);

        const bookMemos = Number(b.totalMemos || b.usedMemosCount || 0);
        runningCumulativeMemos += bookMemos;

        totalGross = safeRound(totalGross + gross);
        totalLess = safeRound(totalLess + less);
        totalNet = safeRound(totalNet + net);
        totalMemosCount += bookMemos;

        const missing = Array.isArray(b.missingMemos) ? b.missingMemos : [];

        return {
            ...b,
            bookMemos,
            calculatedNetSales: net,
            calculatedCumulative: runningCumulativeNet,
            calculatedCumulativeMemos: runningCumulativeMemos,
            missingMemosList: missing,
            missingMemoDisplay: formatMissingMemos(missing, false),
            missingMemoPrintDisplay: formatMissingMemos(missing, true)
        };
    });

    return {
        books: enrichedBooks,
        totalGross,
        totalLess,
        totalNet,
        totalBooksCount: sorted.length,
        totalMemosCount,
        grandCumulative: runningCumulativeNet,
        grandCumulativeMemos: runningCumulativeMemos,
        netInWords: getBengaliWords(totalNet)
    };
}

/**
 * Scan active running memo book progress from transactions
 * @param {Array<Object>} transactions
 * @param {number} startNo - Start voucher number (e.g. 201)
 * @param {number} endNo - End voucher number (e.g. 300)
 */
export function scanActiveBookProgress(transactions = [], startNo, endNo) {
    const min = Math.min(Number(startNo) || 1, Number(endNo) || 1);
    const max = Math.max(Number(startNo) || 1, Number(endNo) || 1);
    const totalExpected = (max - min) + 1;

    const presentSet = new Set();
    const matchedTxns = [];
    let grossSales = 0;
    let totalPaid = 0;
    let totalLess = 0;
    let earliestDate = null;
    let latestDate = null;

    transactions.forEach(t => {
        const match = String(t.voucherNo || '').match(/\d+/);
        if (!match) return;
        const vNum = parseInt(match[0], 10);
        if (vNum >= min && vNum <= max) {
            presentSet.add(vNum);
            matchedTxns.push({ ...t, vNum });

            const b = Number(t.bill) || 0;
            const p = Number(t.paid) || 0;
            const rType = String(t.receivedType || '').toLowerCase();
            const isLess = rType === 'less' || /less|ছাড়|discount/i.test(rType);

            grossSales = safeRound(grossSales + b);
            if (isLess) {
                totalLess = safeRound(totalLess + p);
            } else {
                totalPaid = safeRound(totalPaid + p);
            }

            if (t.date) {
                if (!earliestDate || t.date < earliestDate) earliestDate = t.date;
                if (!latestDate || t.date > latestDate) latestDate = t.date;
            }
        }
    });

    const usedCount = presentSet.size;
    const remainingCount = Math.max(0, totalExpected - usedCount);
    const percent = totalExpected > 0 ? Math.min(100, Math.round((usedCount / totalExpected) * 100)) : 0;
    const netSales = safeRound(grossSales - totalLess);
    const currentDue = safeRound(netSales - totalPaid);

    const missingVouchers = [];
    if (usedCount > 0) {
        for (let i = min; i <= max; i++) {
            if (!presentSet.has(i)) {
                missingVouchers.push(i);
            }
        }
    }

    return {
        startNo: min,
        endNo: max,
        totalExpected,
        usedCount,
        remainingCount,
        percent,
        grossSales,
        totalLess,
        netSales,
        totalPaid,
        currentDue,
        earliestDate,
        latestDate,
        missingVouchers,
        matchedTxnsCount: matchedTxns.length
    };
}

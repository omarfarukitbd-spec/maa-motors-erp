import { safeRound, toDBDate } from '../utils.js';

/**
 *  Treasury Calculations & Invariant Processing Engine
 */

/**
 * Chronologically sort transactions by date and creation time
 * @param {Array} list 
 * @returns {Array} Sorted array
 */
export function sortTreasuryChronologically(list = []) {
    return [...list].sort((a, b) => {
        const dDiff = (a.date || '').localeCompare(b.date || '');
        if (dDiff !== 0) return dDiff;
        const timeA = a.createdAt?.toMillis ? a.createdAt.toMillis() : (new Date(a.date).getTime() || 0);
        const timeB = b.createdAt?.toMillis ? b.createdAt.toMillis() : (new Date(b.date).getTime() || 0);
        return timeA - timeB;
    });
}

/**
 * Recalculate running balance across all transactions starting from opening fund
 * @param {Array} rawTxns 
 * @param {number} openingBalance 
 * @returns {Object} { transactions: Array, kpis: Object }
 */
export function calculateTreasuryLedger(rawTxns = [], openingBalance = 0) {
    const sorted = sortTreasuryChronologically(rawTxns);
    let running = safeRound(openingBalance);
    let totalInflow = 0;
    let totalOutflow = 0;

    const transactions = sorted.map((item, index) => {
        const amt = safeRound(item.amount || 0);
        const isInflow = item.type === 'inflow' || item.type === '+';
        if (isInflow) {
            totalInflow = safeRound(totalInflow + amt);
            running = safeRound(running + amt);
        } else {
            totalOutflow = safeRound(totalOutflow + amt);
            running = safeRound(running - amt);
        }

        // Check if this is a month-closing row (e.g. August 31)
        const isMonthEnd = checkIfMonthEnd(item, sorted[index + 1]);

        return {
            ...item,
            amount: amt,
            isInflow,
            runningBalance: running,
            isMonthEnd
        };
    });

    return {
        transactions,
        kpis: {
            openingBalance: safeRound(openingBalance),
            totalInflow: safeRound(totalInflow),
            totalOutflow: safeRound(totalOutflow),
            netChange: safeRound(totalInflow - totalOutflow),
            currentBalance: running,
            count: transactions.length
        }
    };
}

/**
 * Checks if current item is the last transaction of its calendar month
 */
function checkIfMonthEnd(current, next) {
    if (!current?.date) return false;
    if (!next?.date) {
        // Last item overall: check if date is month end
        const curDate = new Date(current.date);
        const tomorrow = new Date(curDate);
        tomorrow.setDate(tomorrow.getDate() + 1);
        return tomorrow.getMonth() !== curDate.getMonth();
    }
    const curMonth = current.date.substring(0, 7); // 'YYYY-MM'
    const nextMonth = next.date.substring(0, 7);
    return curMonth !== nextMonth;
}

/**
 * Checks if a daily collection or expense already exists on the given date
 * @param {Array} existingTxns 
 * @param {Object} query { date, category, title }
 * @returns {Object|null} Conflicting transaction if found
 */
export function findTreasuryDuplicate(existingTxns = [], { date, category, title }) {
    if (!date) return null;
    const targetDate = toDBDate(date);
    const cleanTitle = (title || '').trim().toLowerCase();

    return existingTxns.find(t => {
        if (t.date !== targetDate) return false;
        if (category && (category === 'daily_expense' || category === 'collection')) {
            return t.category === category;
        }
        return (t.title || '').trim().toLowerCase() === cleanTitle;
    }) || null;
}

/**
 * Filters calculated transactions by date range or preset
 * @param {Array} list 
 * @param {string} startDate YYYY-MM-DD
 * @param {string} endDate YYYY-MM-DD
 * @returns {Array}
 */
export function filterTreasuryByDateRange(list = [], startDate = '', endDate = '') {
    if (!startDate && !endDate) return list;
    return list.filter(t => {
        if (startDate && t.date < startDate) return false;
        if (endDate && t.date > endDate) return false;
        return true;
    });
}

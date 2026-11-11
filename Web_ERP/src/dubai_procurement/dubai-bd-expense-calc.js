/**
 * Dubai Procurement - Bangladesh Landed Expenses Calculation Engine
 * Pure mathematical engine for calculating, aggregating, and verifying Consignment 1 Bangladesh expenses.
 */

import { safeRound, formatAppDate } from '../utils.js';

function normalizeIsoDate(raw) {
    const str = String(raw || '').trim();
    if (/^\d{4}-\d{2}-\d{2}$/.test(str)) return str;
    const dmy = str.match(/^(\d{2})\/(\d{2})\/(\d{4})$/);
    if (dmy) return `${dmy[3]}-${dmy[2]}-${dmy[1]}`;
    return '';
}

export const DEFAULT_BD_BF = {
    amount: 30303773,
    startDate: '2025-11-01',
    endDate: '2026-08-06',
    description: 'B/F (পূর্ববর্তী স্থানান্তরিত কিউমুলেটিভ ব্যালেন্স)',
    category: 'প্রারম্ভিক ব্যালেন্স'
};

/**
 * Calculates Bangladesh expenses summary: B/F, running total, grand total, and category breakdown.
 * @param {Object} consignment
 * @param {Array} expenses
 * @returns {Object}
 */
export function calculateBDExpenseSummary(consignment, expenses = []) {
    const bfAmount = safeRound(Number(consignment?.initialBfAmount ?? DEFAULT_BD_BF.amount));
    
    let runningTotal = 0;
    const categoryBreakdown = {};
    const expIsoDates = [];

    for (const exp of expenses) {
        const amt = safeRound(Number(exp.amount) || 0);
        runningTotal = safeRound(runningTotal + amt);
        const normDt = normalizeIsoDate(exp.date);
        if (normDt) expIsoDates.push(normDt);

        const cat = (exp.category || 'অন্যান্য খরচ').trim();
        if (!categoryBreakdown[cat]) {
            categoryBreakdown[cat] = { count: 0, total: 0 };
        }
        categoryBreakdown[cat].count += 1;
        categoryBreakdown[cat].total = safeRound(categoryBreakdown[cat].total + amt);
    }

    expIsoDates.sort();
    const bfStartDate = consignment?.bfStartDate || DEFAULT_BD_BF.startDate;
    const bfEndDate = consignment?.bfEndDate || DEFAULT_BD_BF.endDate;
    const runningStartDate = expIsoDates[0] || '';
    const runningEndDate = expIsoDates[expIsoDates.length - 1] || '';
    const runningDates = runningStartDate
        ? (runningStartDate === runningEndDate ? formatAppDate(runningStartDate) : `${formatAppDate(runningStartDate)} - ${formatAppDate(runningEndDate)}`)
        : '';
    const overallEnd = runningEndDate || bfEndDate;
    const overallDates = `${formatAppDate(bfStartDate)} - ${formatAppDate(overallEnd)}`;

    const grandTotal = safeRound(bfAmount + runningTotal);

    return {
        bfAmount,
        bfStartDate,
        bfEndDate,
        runningStartDate,
        runningEndDate,
        runningDates,
        overallDates,
        runningTotal,
        grandTotal,
        count: expenses.length,
        categories: categoryBreakdown
    };
}

/**
 * Calculates Master Consolidated CapEx across Dubai (AED -> BDT) and Bangladesh (BDT).
 * @param {Object} dubaiSummary
 * @param {Object} bdSummary
 * @returns {Object}
 */
export function calculateConsolidatedCapEx(dubaiSummary, bdSummary) {
    const dubaiAED = safeRound(Number(dubaiSummary?.grandTotal?.aed) || 0);
    const dubaiBDT = safeRound(Number(dubaiSummary?.grandTotal?.bdt) || 0);
    const bdBDT = safeRound(Number(bdSummary?.grandTotal) || 0);
    const totalCapExBDT = safeRound(dubaiBDT + bdBDT);

    const dubaiSharePct = totalCapExBDT > 0 ? safeRound((dubaiBDT / totalCapExBDT) * 100, 2) : 0;
    const bdSharePct = totalCapExBDT > 0 ? safeRound((bdBDT / totalCapExBDT) * 100, 2) : 0;

    return {
        dubaiAED,
        dubaiBDT,
        bdBDT,
        totalCapExBDT,
        dubaiSharePct,
        bdSharePct
    };
}

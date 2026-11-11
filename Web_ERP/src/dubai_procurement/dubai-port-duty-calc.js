/**
 * Dubai Procurement - Container Port, Customs Duty & C&F Calculations Engine
 * Pure mathematical engine for calculating, aggregating, and verifying Consignment 1 container clearing bills.
 */

import { safeRound } from '../utils.js';

function normalizeSizeDigits(raw = '') {
    return String(raw || '').replace(/[০-৯]/g, d => String('০১২৩৪৫৬৭৮৯'.indexOf(d)));
}

/**
 * Calculates Container Port & Duty summary: total bills, count, 20ft vs 40ft vs Standard breakdown, and agent breakdown.
 * @param {Object} consignment
 * @param {Array} bills
 * @returns {Object}
 */
export function calculatePortDutySummary(consignment, bills = []) {
    let totalDuty = 0;
    let twentyFtCount = 0;
    let twentyFtTotal = 0;
    let fortyFtCount = 0;
    let fortyFtTotal = 0;
    let standardCount = 0;
    let standardTotal = 0;
    const agentBreakdown = {};

    for (const bill of bills) {
        const amt = safeRound(Number(bill.amount ?? bill.dutyAmount) || 0);
        totalDuty = safeRound(totalDuty + amt);

        const normSize = normalizeSizeDigits(bill.size || bill.containerSize || '').toLowerCase();
        const normDesc = normalizeSizeDigits(bill.description || '').toLowerCase();

        if (normSize.includes('20') || (!normSize && /(?:^|\s)20\s*(?:ft|ফুট)/.test(normDesc))) {
            twentyFtCount += 1;
            twentyFtTotal = safeRound(twentyFtTotal + amt);
        } else if (normSize.includes('40') || (!normSize && /(?:^|\s)40\s*(?:ft|ফুট)/.test(normDesc))) {
            fortyFtCount += 1;
            fortyFtTotal = safeRound(fortyFtTotal + amt);
        } else {
            standardCount += 1;
            standardTotal = safeRound(standardTotal + amt);
        }

        const agent = (bill.agent || bill.vendor || 'অনির্ধারিত এজেন্ট').trim();
        if (!agentBreakdown[agent]) {
            agentBreakdown[agent] = { count: 0, total: 0 };
        }
        agentBreakdown[agent].count += 1;
        agentBreakdown[agent].total = safeRound(agentBreakdown[agent].total + amt);
    }

    return {
        totalDuty,
        count: bills.length,
        twentyFtCount,
        twentyFtTotal,
        fortyFtCount,
        fortyFtTotal,
        standardCount,
        standardTotal,
        agentBreakdown
    };
}

/**
 * Calculates 3-Tier Master Project CapEx across Dubai (AED->BDT), Port Duty (BDT), and BD Expenses (BDT).
 * Strictly zero fallback defaults: missing or empty books evaluate to 0.
 * @param {Object} dubaiSummary
 * @param {Object} portDutySummary
 * @param {Object} bdExpenseSummary
 * @returns {Object}
 */
export function calculateMasterProjectCapEx(dubaiSummary, portDutySummary, bdExpenseSummary) {
    const dubaiAED = safeRound(Number(dubaiSummary?.grandTotal?.aed) || 0);
    const dubaiBDT = safeRound(Number(dubaiSummary?.grandTotal?.bdt) || 0);
    const portBDT = safeRound(Number(portDutySummary?.totalDuty) || 0);
    const bdBDT = safeRound(Number(bdExpenseSummary?.grandTotal) || 0);
    const totalCapExBDT = safeRound(dubaiBDT + portBDT + bdBDT);

    const dubaiSharePct = totalCapExBDT > 0 ? safeRound((dubaiBDT / totalCapExBDT) * 100, 2) : 0;
    const portSharePct = totalCapExBDT > 0 ? safeRound((portBDT / totalCapExBDT) * 100, 2) : 0;
    const bdSharePct = totalCapExBDT > 0 ? safeRound((bdBDT / totalCapExBDT) * 100, 2) : 0;

    return {
        dubaiAED,
        dubaiBDT,
        portBDT,
        bdBDT,
        totalCapExBDT,
        dubaiSharePct,
        portSharePct,
        bdSharePct
    };
}

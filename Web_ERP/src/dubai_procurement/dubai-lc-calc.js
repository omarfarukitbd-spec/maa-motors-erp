/**
 * Dubai Procurement - Container L/C Margin & Bank Expense Calculations Engine
 * Pure mathematical engine for Container-Based Multi-Date Sub-Ledger & 4-Tier Master Project CapEx.
 */

import { safeRound } from '../utils.js';

/**
 * Calculates sub-totals for a single container's multi-date payment lines.
 * @param {Array} payments
 * @returns {Object}
 */
export function calculateContainerLCTotals(payments = []) {
    let totalUSD = 0;
    let totalBDT = 0;

    for (const p of payments) {
        totalUSD = safeRound(totalUSD + (Number(p.amountUSD) || 0));
        totalBDT = safeRound(totalBDT + (Number(p.amountBDT) || 0));
    }

    return {
        totalUSD,
        totalBDT,
        paymentCount: payments.length
    };
}

/**
 * Pure helper to determine whether a container L/C cycle is closed/settled.
 * True when explicitly marked settled (`isSettled: true`) or a deliveryDate is set.
 * @param {Object} bill
 * @returns {boolean}
 */
export function isContainerClosed(bill) {
    if (!bill) return false;
    return Boolean(bill.isSettled) || Boolean(bill.deliveryDate && String(bill.deliveryDate).trim() !== '');
}

/**
 * Calculates overall Container L/C Summary across all containers in the consignment.
 * @param {Object} consignment
 * @param {Array} lcBills
 * @returns {Object}
 */
export function calculateLCSummary(consignment, lcBills = []) {
    let totalUSD = 0;
    let totalBDT = 0;
    let closedCount = 0;
    let openCount = 0;
    let closedTotalUSD = 0;
    let closedTotalBDT = 0;
    let openTotalUSD = 0;
    let openTotalBDT = 0;
    let deliveredCount = 0;
    let pendingDeliveryCount = 0;
    let totalPaymentsCount = 0;

    for (const bill of lcBills) {
        const payments = Array.isArray(bill.payments) ? bill.payments : [];
        const legacyUSD = safeRound(Number(bill.totalUSD ?? bill.amountUSD) || 0);
        const legacyBDT = safeRound(Number(bill.totalBDT ?? bill.amountBDT) || 0);
        const containerTotals = payments.length > 0
            ? calculateContainerLCTotals(payments)
            : {
                totalUSD: legacyUSD,
                totalBDT: legacyBDT,
                paymentCount: (legacyUSD > 0 || legacyBDT > 0) ? 1 : 0
            };

        totalUSD = safeRound(totalUSD + containerTotals.totalUSD);
        totalBDT = safeRound(totalBDT + containerTotals.totalBDT);
        totalPaymentsCount += containerTotals.paymentCount;

        if (isContainerClosed(bill)) {
            closedCount += 1;
            closedTotalUSD = safeRound(closedTotalUSD + containerTotals.totalUSD);
            closedTotalBDT = safeRound(closedTotalBDT + containerTotals.totalBDT);
        } else {
            openCount += 1;
            openTotalUSD = safeRound(openTotalUSD + containerTotals.totalUSD);
            openTotalBDT = safeRound(openTotalBDT + containerTotals.totalBDT);
        }

        if (bill.deliveryDate && String(bill.deliveryDate).trim() !== '') {
            deliveredCount += 1;
        } else {
            pendingDeliveryCount += 1;
        }
    }

    const containerCount = lcBills.length;
    const avgBDT = containerCount > 0 ? safeRound(totalBDT / containerCount) : 0;

    return {
        containerCount,
        totalUSD,
        totalBDT,
        closedCount,
        openCount,
        closedTotalUSD,
        closedTotalBDT,
        openTotalUSD,
        openTotalBDT,
        deliveredCount,
        pendingDeliveryCount,
        totalPaymentsCount,
        avgBDT
    };
}

/**
 * Calculates 4-Tier Master Project CapEx across Dubai FOB, Container L/C, Port Duty, and BD Landed Expenses.
 * Strictly zero fallback defaults: missing or empty books evaluate to 0.
 * @param {Object} dubaiSummary
 * @param {Object} lcSummary
 * @param {Object} portDutySummary
 * @param {Object} bdExpenseSummary
 * @returns {Object}
 */
export function calculateMaster4TierCapEx(dubaiSummary, lcSummary, portDutySummary, bdExpenseSummary) {
    const dubaiAED = safeRound(Number(dubaiSummary?.grandTotal?.aed) || 0);
    const dubaiBDT = safeRound(Number(dubaiSummary?.grandTotal?.bdt) || 0);
    const lcUSD = safeRound(Number(lcSummary?.totalUSD) || 0);
    const lcBDT = safeRound(Number(lcSummary?.totalBDT) || 0);
    const portBDT = safeRound(Number(portDutySummary?.totalDuty) || 0);
    const bdBDT = safeRound(Number(bdExpenseSummary?.grandTotal) || 0);

    const totalCapExBDT = safeRound(dubaiBDT + lcBDT + portBDT + bdBDT);

    const dubaiSharePct = totalCapExBDT > 0 ? safeRound((dubaiBDT / totalCapExBDT) * 100, 2) : 0;
    const lcSharePct = totalCapExBDT > 0 ? safeRound((lcBDT / totalCapExBDT) * 100, 2) : 0;
    const portSharePct = totalCapExBDT > 0 ? safeRound((portBDT / totalCapExBDT) * 100, 2) : 0;
    const bdSharePct = totalCapExBDT > 0 ? safeRound((bdBDT / totalCapExBDT) * 100, 2) : 0;

    return {
        dubaiAED,
        dubaiBDT,
        lcUSD,
        lcBDT,
        portBDT,
        bdBDT,
        totalCapExBDT,
        dubaiSharePct,
        lcSharePct,
        portSharePct,
        bdSharePct
    };
}

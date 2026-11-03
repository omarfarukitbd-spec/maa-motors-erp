import { safeRound, parseAmount } from '../utils.js';

/**
 * Pure calculation engine for Container Profit & Partnership Settlement
 */

/**
 * Calculate total sales, expenses, and net profit from items
 * @param {Array<{ op: string, amount: number|string }>} rows
 */
export function calcSalesAndCosts(rows = []) {
    let totalSales = 0;
    let totalExpenses = 0;

    (Array.isArray(rows) ? rows : []).forEach(row => {
        const amt = safeRound(parseAmount(row.amount || 0));
        if (row.op === '+') {
            totalSales = safeRound(totalSales + amt);
        } else if (row.op === '-') {
            totalExpenses = safeRound(totalExpenses + amt);
        }
    });

    const netProfit = safeRound(totalSales - totalExpenses);

    return {
        totalSales,
        totalExpenses,
        netProfit
    };
}

/**
 * Calculate profit distribution among partners based on percentage or fixed amounts
 * @param {number} netProfit Net profit of the container
 * @param {Array<{ percentage: number|string, amount?: number, manualOverride?: boolean }>} partners
 */
export function calcProfitSharing(netProfit = 0, partners = []) {
    let totalDistributed = 0;
    let totalPercentage = 0;

    const enriched = (Array.isArray(partners) ? partners : []).map(p => {
        const pct = Number(p.percentage) || 0;
        totalPercentage = safeRound(totalPercentage + pct);

        let amt = 0;
        if (p.manualOverride && p.calculatedAmount !== undefined) {
            amt = safeRound(parseAmount(p.calculatedAmount));
        } else {
            amt = safeRound((netProfit * pct) / 100);
        }

        totalDistributed = safeRound(totalDistributed + amt);

        return {
            ...p,
            percentage: pct,
            calculatedAmount: amt
        };
    });

    const isPercentageBalanced = Math.abs(totalPercentage - 100) < 0.01;

    return {
        partners: enriched,
        totalDistributed,
        totalPercentage: safeRound(totalPercentage),
        isPercentageBalanced,
        variance: safeRound(netProfit - totalDistributed)
    };
}

/**
 * Calculate Capital and Waterfall Settlements
 * @param {Array<{ op: string, amount: number|string }>} rows
 */
export function calcCapitalWaterfall(rows = []) {
    let runningBalance = 0;

    const enriched = (Array.isArray(rows) ? rows : []).map((row, idx) => {
        const amt = safeRound(parseAmount(row.amount || 0));
        if (row.op === '+') {
            runningBalance = safeRound(runningBalance + amt);
        } else if (row.op === '-') {
            runningBalance = safeRound(runningBalance - amt);
        }
        return {
            ...row,
            amount: amt,
            stepBalance: runningBalance
        };
    });

    return {
        rows: enriched,
        finalNetBalance: runningBalance
    };
}

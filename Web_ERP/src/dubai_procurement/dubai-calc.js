/**
 * Dubai Procurement & Weekly Audit - Financial Calculation Engine
 * Pure math and rolling reconciliation calculations adhering to universal accounting rules.
 */

import { safeRound, formatAmountWithComma, parseAmount } from '../utils.js';

/**
 * Format AED Currency with comma and suffix
 * @param {number|string} amount 
 * @returns {string} e.g. "1,14,790 AED"
 */
export function formatAED(amount) {
    const num = parseAmount(amount);
    return `${formatAmountWithComma(safeRound(num))} AED`;
}

/**
 * Calculate Theoretical Net Cash that should remain in hand
 * Formula: Cumulative Remittances - Cumulative Purchases - Cumulative Expenses
 */
export function calculateNetTheoreticalCash(cumulativeRemittance, cumulativePurchase, cumulativeExpense) {
    const rem = safeRound(parseAmount(cumulativeRemittance));
    const pur = safeRound(parseAmount(cumulativePurchase));
    const exp = safeRound(parseAmount(cumulativeExpense));
    return safeRound(rem - pur - exp);
}

/**
 * Calculate Total Physical Assets Declared
 * Formula: Cash in Hand + Market Advance (AD) + Personal Custody Holdings + Mess Balance
 * @param {number} cashInHand 
 * @param {number} marketAdvance 
 * @param {Array<{name: string, amount: number}>} personalHoldings 
 * @param {number} messBalance 
 */
export function calculateTotalPhysicalAssets(cashInHand, marketAdvance, personalHoldings = [], messBalance = 0) {
    const cash = safeRound(parseAmount(cashInHand));
    const ad = safeRound(parseAmount(marketAdvance));
    const mess = safeRound(parseAmount(messBalance));
    
    let holdingsTotal = 0;
    if (Array.isArray(personalHoldings)) {
        holdingsTotal = personalHoldings.reduce((sum, item) => {
            return safeRound(sum + safeRound(parseAmount(item.amount)));
        }, 0);
    }
    
    return safeRound(cash + ad + holdingsTotal + mess);
}

/**
 * Calculate Cash Variance (Surplus or Deficit)
 * Formula: Total Physical Assets - Theoretical Net Cash
 * If > 0: Surplus (ক্যাশ বাড়তি)
 * If < 0: Deficit (ক্যাশ ঘাটতি / শর্ট)
 * If === 0: Balanced (১০০% নির্ভুল মিল)
 */
export function calculateVariance(totalPhysicalAssets, calculatedCashBalance) {
    const physical = safeRound(parseAmount(totalPhysicalAssets));
    const theoretical = safeRound(parseAmount(calculatedCashBalance));
    return safeRound(physical - theoretical);
}

/**
 * Compute Roll-Forward Balances from Previous Audit
 * @param {Object|null} prevAudit 
 * @param {Object} currentInputs 
 */
export function computeRollForward(prevAudit, currentInputs) {
    const prevRem = prevAudit ? safeRound(parseAmount(prevAudit.cumulativeRemittance)) : 0;
    const prevPur = prevAudit ? safeRound(parseAmount(prevAudit.cumulativePurchaseTotal)) : 0;
    const prevExp = prevAudit ? safeRound(parseAmount(prevAudit.cumulativeExpenseTotal)) : 0;

    const weeklyRem = safeRound(parseAmount(currentInputs.weeklyRemittanceTotal || 0));
    const weeklyPur = safeRound(parseAmount(currentInputs.weeklyPurchaseTotal || 0));
    const weeklyExp = safeRound(parseAmount(currentInputs.weeklyExpenseTotal || 0));

    const cumRem = safeRound(prevRem + weeklyRem);
    const cumPur = safeRound(prevPur + weeklyPur);
    const cumExp = safeRound(prevExp + weeklyExp);

    const theoreticalCash = calculateNetTheoreticalCash(cumRem, cumPur, cumExp);
    const totalPhysical = calculateTotalPhysicalAssets(
        currentInputs.cashInHand || 0,
        currentInputs.marketAdvance || 0,
        currentInputs.personalHoldings || [],
        currentInputs.messBalance || 0
    );

    const variance = calculateVariance(totalPhysical, theoreticalCash);

    return {
        prevRemittance: prevRem,
        weeklyRemittanceTotal: weeklyRem,
        cumulativeRemittance: cumRem,

        prevPurchaseTotal: prevPur,
        weeklyPurchaseTotal: weeklyPur,
        cumulativePurchaseTotal: cumPur,

        prevExpenseTotal: prevExp,
        weeklyExpenseTotal: weeklyExp,
        cumulativeExpenseTotal: cumExp,

        calculatedCashBalance: theoreticalCash,
        totalPhysicalAssets: totalPhysical,
        varianceAmount: variance
    };
}

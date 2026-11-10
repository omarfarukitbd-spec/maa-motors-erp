/**
 * Dubai Remittance & Consignment - Financial Calculation Engine
 * Pure math calculations for cross-currency remittances and consignment lifecycle.
 */

import { safeRound, parseAmount, formatAmountWithComma } from '../utils.js';

/**
 * Format AED Currency with comma and suffix
 */
export function formatAED(amount) {
    const num = parseAmount(amount);
    return `${formatAmountWithComma(safeRound(num))} AED`;
}

/**
 * Format BDT Currency with comma and prefix
 */
export function formatBDT(amount) {
    const num = parseAmount(amount);
    return `৳ ${formatAmountWithComma(safeRound(num))}`;
}

/**
 * Calculate BDT from AED and exchange rate
 * BDT = round(AED * Rate)
 */
export function calcBDTfromAED(aed, rate) {
    const a = parseAmount(aed);
    const r = parseAmount(rate);
    if (!a || !r) return 0;
    return safeRound(Math.round(a * r));
}

/**
 * Calculate AED from BDT and exchange rate
 * AED = round(BDT / Rate)
 */
export function calcAEDfromBDT(bdt, rate) {
    const b = parseAmount(bdt);
    const r = parseAmount(rate);
    if (!b || !r) return 0;
    return safeRound(Math.round(b / r));
}

/**
 * Calculate Weighted Average Exchange Rate
 * Rate = Total BDT / Total AED
 */
export function calcWeightedRate(totalBDT, totalAED) {
    const b = parseAmount(totalBDT);
    const a = parseAmount(totalAED);
    if (!a || a <= 0) return 0;
    return safeRound(Math.round((b / a) * 100) / 100);
}

/**
 * Master Summary Calculation for Consignment 1 and Running Entries
 * @param {Object} consignment 
 * @param {Array<Object>} entries 
 */
export function calculateConsignmentSummary(consignment, entries = []) {
    // Stage 1: 2025 Historical Investment
    const s1Aed = consignment?.stage1?.aed || 4285350;
    const s1Bdt = consignment?.stage1?.bdt || 145802430;
    const s1Rate = consignment?.stage1?.rate || 34.02;

    // Stage 2: 2026 Early Former Balance
    const s2Aed = consignment?.stage2?.aed || 1692497;
    const s2Bdt = consignment?.stage2?.bdt || 58421109;
    const s2Rate = consignment?.stage2?.rate || 34.51;

    // Stage 3: Running Entries
    let s3Aed = 0;
    let s3Bdt = 0;

    if (Array.isArray(entries)) {
        entries.forEach(e => {
            const a = safeRound(parseAmount(e.aedAmount || 0));
            const b = safeRound(parseAmount(e.bdtAmount || 0));
            s3Aed = safeRound(s3Aed + a);
            s3Bdt = safeRound(s3Bdt + b);
        });
    }

    const s3Rate = calcWeightedRate(s3Bdt, s3Aed);

    // 2026 Session Cumulative (Stage 2 + Stage 3)
    const session2026Aed = safeRound(s2Aed + s3Aed);
    const session2026Bdt = safeRound(s2Bdt + s3Bdt);
    const session2026Rate = calcWeightedRate(session2026Bdt, session2026Aed);

    // Consignment 1 All-Time Grand Total (Stage 1 + Stage 2 + Stage 3)
    const grandAed = safeRound(s1Aed + s2Aed + s3Aed);
    const grandBdt = safeRound(s1Bdt + s2Bdt + s3Bdt);
    const grandRate = calcWeightedRate(grandBdt, grandAed);

    return {
        stage1: { aed: s1Aed, bdt: s1Bdt, rate: s1Rate },
        stage2: { aed: s2Aed, bdt: s2Bdt, rate: s2Rate },
        stage3: { aed: s3Aed, bdt: s3Bdt, rate: s3Rate, count: entries.length },
        session2026: { aed: session2026Aed, bdt: session2026Bdt, rate: session2026Rate },
        grandTotal: { aed: grandAed, bdt: grandBdt, rate: grandRate }
    };
}

/**
 * Dubai Remittance & Consignment - Financial Calculation Engine
 * Pure math calculations for cross-currency remittances and consignment lifecycle.
 */

import { safeRound, parseAmount, formatAmountWithComma, formatAppDate } from '../utils.js';

function normalizeComparableDate(raw) {
    const str = String(raw || '').trim();
    if (!str) return '';
    if (/^\d{4}-\d{2}-\d{2}$/.test(str)) return str;
    const dmy = str.match(/^(\d{2})\/(\d{2})\/(\d{4})$/);
    if (dmy) return `${dmy[3]}-${dmy[2]}-${dmy[1]}`;
    return str;
}

function splitDateRangeEnds(rangeStr = '') {
    const matches = String(rangeStr || '').match(/\d{2}\/\d{2}\/\d{4}/g);
    if (!matches || matches.length === 0) return { start: '', end: '' };
    return { start: matches[0], end: matches[matches.length - 1] };
}

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
    const isRolloverConsignment = Boolean(consignment?.openingBalance);

    let s1Aed = 0;
    let s1Bdt = 0;
    let s1Rate = 0;

    let s2Aed = 0;
    let s2Bdt = 0;
    let s2Rate = 0;

    let s1Dates = '—';
    let s2Dates = '';

    if (isRolloverConsignment) {
        // Next consignment: opening balance rolled forward from previous consignment
        s1Aed = 0;
        s1Bdt = 0;
        s1Rate = 0;
        s1Dates = '—';

        s2Aed = safeRound(parseAmount(consignment.openingBalance.aed || 0));
        s2Bdt = safeRound(parseAmount(consignment.openingBalance.bdt || 0));
        s2Rate = consignment.openingBalance.rate || calcWeightedRate(s2Bdt, s2Aed);
        s2Dates = String(consignment?.openingBalance?.dates || consignment?.stage2?.dates || 'পূর্ববর্তী সমাপ্তি হতে').trim();
    } else {
        // Stage 1: 2025 Historical Investment (Consignment 1)
        s1Aed = consignment?.stage1?.aed ?? 4285350;
        s1Bdt = consignment?.stage1?.bdt ?? 145802430;
        s1Rate = consignment?.stage1?.rate ?? 34.02;
        s1Dates = String(consignment?.stage1?.dates || '29/08/2025 - 18/12/2025').trim();

        // Stage 2: 2026 Early Former Balance (Consignment 1)
        s2Aed = consignment?.stage2?.aed ?? 1692497;
        s2Bdt = consignment?.stage2?.bdt ?? 58421109;
        s2Rate = consignment?.stage2?.rate ?? 34.51;
        s2Dates = String(consignment?.stage2?.dates || '16/04/2026 - 13/10/2026').trim();
    }

    // Stage 3: Running Entries & chronological date bounds
    let s3Aed = 0;
    let s3Bdt = 0;
    const entryIsoDates = [];

    if (Array.isArray(entries)) {
        entries.forEach(e => {
            const a = safeRound(parseAmount(e.aedAmount || 0));
            const b = safeRound(parseAmount(e.bdtAmount || 0));
            s3Aed = safeRound(s3Aed + a);
            s3Bdt = safeRound(s3Bdt + b);
            const normDt = normalizeComparableDate(e.date);
            if (normDt) entryIsoDates.push(normDt);
        });
    }

    entryIsoDates.sort();
    const s3Start = entryIsoDates.length > 0 ? formatAppDate(entryIsoDates[0]) : '';
    const s3End = entryIsoDates.length > 0 ? formatAppDate(entryIsoDates[entryIsoDates.length - 1]) : '';
    const s3Dates = s3Start
        ? (s3Start === s3End ? s3Start : `${s3Start} - ${s3End}`)
        : 'এন্ট্রি অপেক্ষমাণ';

    const s3Rate = calcWeightedRate(s3Bdt, s3Aed);

    // 2026 Session Cumulative (Stage 2 + Stage 3)
    const session2026Aed = safeRound(s2Aed + s3Aed);
    const session2026Bdt = safeRound(s2Bdt + s3Bdt);
    const session2026Rate = calcWeightedRate(session2026Bdt, session2026Aed);
    const s2Ends = splitDateRangeEnds(s2Dates);
    const s2Start = s2Ends.start || s3Start;
    const session2026End = s3End || s2Ends.end;
    const session2026Dates = (s2Start && session2026End)
        ? (s2Start === session2026End ? s2Start : `${s2Start} - ${session2026End}`)
        : (s2Dates || s3Dates);

    // Consignment All-Time Grand Total & Date Span
    const grandAed = safeRound(s1Aed + s2Aed + s3Aed);
    const grandBdt = safeRound(s1Bdt + s2Bdt + s3Bdt);
    const grandRate = calcWeightedRate(grandBdt, grandAed);
    const s1Ends = splitDateRangeEnds(s1Dates);
    const grandStart = (!isRolloverConsignment && s1Ends.start) ? s1Ends.start : (s2Ends.start || s3Start);
    const grandEnd = s3End || s2Ends.end || s1Ends.end;
    const grandDates = (grandStart && grandEnd)
        ? (grandStart === grandEnd ? grandStart : `${grandStart} - ${grandEnd}`)
        : 'চলমান সেশন';

    return {
        isRollover: isRolloverConsignment,
        stage1: { aed: s1Aed, bdt: s1Bdt, rate: s1Rate, dates: s1Dates },
        stage2: { aed: s2Aed, bdt: s2Bdt, rate: s2Rate, dates: s2Dates },
        stage3: { aed: s3Aed, bdt: s3Bdt, rate: s3Rate, count: entries.length, dates: s3Dates, startDate: s3Start, endDate: s3End },
        session2026: { aed: session2026Aed, bdt: session2026Bdt, rate: session2026Rate, dates: session2026Dates },
        grandTotal: { aed: grandAed, bdt: grandBdt, rate: grandRate, dates: grandDates, startDate: grandStart, endDate: grandEnd }
    };
}

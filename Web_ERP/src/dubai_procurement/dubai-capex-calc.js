/**
 * Single Source of Truth Consolidated CapEx & Liquidity Engine (নথি খাতা ০০০৬)
 * Central pure mathematical functions combining:
 *   - ০০০১: Dubai Remittance & FOB Capital
 *   - ০০০২: Bangladesh Expenses & Clearing
 *   - ০০০৩: Container L/C Margin & Bank Expenses
 *   - ০০০৪: Chittagong Port Duty & Assessment
 *   - ০০০৫: Weekly Cash & Memo Reconciliation (AED)
 */

import { safeRound } from '../utils.js';
import { calculateContainerLCTotals, isContainerClosed } from './dubai-lc-calc.js';

const BENGALI_TO_ENGLISH_DIGITS = {
    '০': '0',
    '১': '1',
    '২': '2',
    '৩': '3',
    '৪': '4',
    '৫': '5',
    '৬': '6',
    '৭': '7',
    '৮': '8',
    '৯': '9'
};

/**
 * Converts Bengali digits (০-৯) in a string to ASCII digits (0-9).
 * @param {string|number} raw
 * @returns {string}
 */
export function normalizeBengaliDigits(raw = '') {
    return String(raw ?? '').replace(/[০-৯]/g, ch => BENGALI_TO_ENGLISH_DIGITS[ch] || ch);
}

/**
 * Parses an explicit container number from strings like:
 *   "04", "৪", "৪ নং কন্টেইনার (40 FT)", "Container #12", "Container 40 FT - ০৩"
 * Ignores container dimension tokens like "20 FT" or "40 FT" unless paired with "নং"/"#".
 * @param {string|number} raw
 * @returns {number|null}
 */
export function parseContainerNumericNo(raw) {
    if (typeof raw === 'number' && Number.isFinite(raw) && raw > 0) {
        return Math.floor(raw);
    }
    const text = normalizeBengaliDigits(raw).trim();
    if (!text) return null;

    const pureMatch = text.match(/^(\d+)$/);
    if (pureMatch) {
        const val = parseInt(pureMatch[1], 10);
        return val > 0 ? val : null;
    }

    const ordinalMatch = text.match(/(\d+)\s*(?:নং|no\.?)(?![a-z])/i);
    if (ordinalMatch) {
        const val = parseInt(ordinalMatch[1], 10);
        return val > 0 ? val : null;
    }

    const hashMatch = text.match(/(?:#|no\.?|নং|কন্টেইনার)\s*[:-]?\s*(\d+)/i);
    if (hashMatch) {
        const val = parseInt(hashMatch[1], 10);
        return val > 0 ? val : null;
    }

    const withoutSizeTokens = text.replace(/\b(?:20|40)\s*(?:ft|ফুট)\b/gi, ' ');
    const genericMatch = withoutSizeTokens.match(/(\d+)/);
    if (genericMatch) {
        const val = parseInt(genericMatch[1], 10);
        return val > 0 ? val : null;
    }

    return null;
}

/**
 * Canonical 4-Tier Master Project CapEx calculation.
 * Strictly zero fallback defaults: missing or empty books evaluate to 0.
 *
 * @param {Object} dubaiSummary - Output of calculateConsignmentSummary()
 * @param {Object} lcSummary - Output of calculateLCSummary()
 * @param {Object} portDutySummary - Output of calculatePortDutySummary()
 * @param {Object} bdExpenseSummary - Output of calculateBDExpenseSummary()
 * @param {Object} [comboFlags] - Optional toggle flags for custom combination simulation
 * @returns {Object}
 */
export function calculateMaster4TierCapEx(
    dubaiSummary,
    lcSummary,
    portDutySummary,
    bdExpenseSummary,
    comboFlags = {}
) {
    const dubaiAED = safeRound(Number(dubaiSummary?.grandTotal?.aed) || 0);
    const dubaiBDT = safeRound(Number(dubaiSummary?.grandTotal?.bdt) || 0);
    const lcUSD = safeRound(Number(lcSummary?.totalUSD) || 0);
    const lcBDT = safeRound(Number(lcSummary?.totalBDT) || 0);
    const portBDT = safeRound(Number(portDutySummary?.totalDuty) || 0);
    const bdBDT = safeRound(Number(bdExpenseSummary?.grandTotal) || 0);

    const flags = {
        includeDubai: comboFlags?.includeDubai !== false,
        includeLC: comboFlags?.includeLC !== false,
        includePort: comboFlags?.includePort !== false,
        includeBD: comboFlags?.includeBD !== false
    };

    const totalCapExBDT = safeRound(dubaiBDT + lcBDT + portBDT + bdBDT);
    const twoTierBDT = safeRound(dubaiBDT + bdBDT);
    const threeTierBDT = safeRound(dubaiBDT + portBDT + bdBDT);
    const fourTierBDT = totalCapExBDT;

    const selectedDubaiBDT = flags.includeDubai ? dubaiBDT : 0;
    const selectedLCBDT = flags.includeLC ? lcBDT : 0;
    const selectedPortBDT = flags.includePort ? portBDT : 0;
    const selectedBDBDT = flags.includeBD ? bdBDT : 0;
    const selectedTotalBDT = safeRound(
        selectedDubaiBDT + selectedLCBDT + selectedPortBDT + selectedBDBDT
    );

    const dubaiSharePct = totalCapExBDT > 0 ? safeRound((dubaiBDT / totalCapExBDT) * 100, 2) : 0;
    const lcSharePct = totalCapExBDT > 0 ? safeRound((lcBDT / totalCapExBDT) * 100, 2) : 0;
    const portSharePct = totalCapExBDT > 0 ? safeRound((portBDT / totalCapExBDT) * 100, 2) : 0;
    const bdSharePct = totalCapExBDT > 0 ? safeRound((bdBDT / totalCapExBDT) * 100, 2) : 0;

    const remittanceAvgRate = dubaiAED > 0 ? safeRound(dubaiBDT / dubaiAED, 2) : 0;
    const landedEffectiveRate = dubaiAED > 0 ? safeRound(totalCapExBDT / dubaiAED, 2) : 0;

    return {
        dubaiAED,
        dubaiBDT,
        lcUSD,
        lcBDT,
        portBDT,
        bdBDT,
        totalCapExBDT,
        twoTierBDT,
        threeTierBDT,
        fourTierBDT,
        selectedDubaiBDT,
        selectedLCBDT,
        selectedPortBDT,
        selectedBDBDT,
        selectedTotalBDT,
        flags,
        dubaiSharePct,
        lcSharePct,
        portSharePct,
        bdSharePct,
        remittanceAvgRate,
        landedEffectiveRate
    };
}

/**
 * Matches Page 0003 (Container L/C Bills) and Page 0004 (Port Duty Bills) per container #.
 * Preserves unmatched port duty items cleanly so combined totals always reconcile 100%.
 *
 * @param {Array} lcBills
 * @param {Array} portBills
 * @returns {Object}
 */
export function buildContainerLandedCostMatrix(lcBills = [], portBills = []) {
    const containerMap = new Map();

    const ensureEntry = containerNum => {
        if (!containerMap.has(containerNum)) {
            containerMap.set(containerNum, {
                containerNum,
                lcId: '',
                lcNo: '',
                company: '',
                deliveryDate: '',
                isClosed: false,
                paymentCount: 0,
                lcUSD: 0,
                lcBDT: 0,
                portBillsCount: 0,
                portSizes: [],
                portDates: [],
                portBDT: 0,
                combinedBDT: 0
            });
        }
        return containerMap.get(containerNum);
    };

    for (const bill of lcBills) {
        const containerNum = parseContainerNumericNo(bill.containerNo ?? bill.orderIndex);
        if (containerNum === null) continue;

        const payments = Array.isArray(bill.payments) ? bill.payments : [];
        const hasFlatLegacy = payments.length === 0 && (Number(bill.totalBDT ?? bill.amountBDT) > 0 || Number(bill.totalUSD ?? bill.amountUSD) > 0);
        const lcTotals = payments.length > 0
            ? calculateContainerLCTotals(payments)
            : {
                totalUSD: safeRound(Number(bill.totalUSD ?? bill.amountUSD) || 0),
                totalBDT: safeRound(Number(bill.totalBDT ?? bill.amountBDT) || 0),
                paymentCount: hasFlatLegacy ? 1 : 0
            };

        const row = ensureEntry(containerNum);
        row.lcId = bill.id || row.lcId;
        row.lcNo = bill.lcNo || row.lcNo;
        row.company = bill.company || row.company;
        row.deliveryDate = bill.deliveryDate || row.deliveryDate;
        row.isClosed = row.isClosed || isContainerClosed(bill);
        row.paymentCount += lcTotals.paymentCount;
        row.lcUSD = safeRound(row.lcUSD + lcTotals.totalUSD);
        row.lcBDT = safeRound(row.lcBDT + lcTotals.totalBDT);
    }

    const unmatchedPortRows = [];
    let portMatchedBDT = 0;
    let portUnmatchedBDT = 0;

    for (const portBill of portBills) {
        const amt = safeRound(Number(portBill.amount ?? portBill.dutyAmount) || 0);
        const numFromField = parseContainerNumericNo(portBill.containerNo);
        const numFromDesc = numFromField !== null ? numFromField : parseContainerNumericNo(portBill.description);
        const sizeLabel = String(portBill.size || portBill.containerSize || '').trim();

        if (numFromDesc !== null) {
            const row = ensureEntry(numFromDesc);
            row.portBillsCount += 1;
            row.portBDT = safeRound(row.portBDT + amt);
            if (sizeLabel && !row.portSizes.includes(sizeLabel)) {
                row.portSizes.push(sizeLabel);
            }
            if (portBill.date && !row.portDates.includes(portBill.date)) {
                row.portDates.push(portBill.date);
            }
            portMatchedBDT = safeRound(portMatchedBDT + amt);
        } else {
            unmatchedPortRows.push({
                id: portBill.id || '',
                date: portBill.date || '',
                description: portBill.description || 'অন্যান্য পোর্ট বিল',
                size: sizeLabel || '—',
                portBDT: amt
            });
            portUnmatchedBDT = safeRound(portUnmatchedBDT + amt);
        }
    }

    const rows = Array.from(containerMap.values())
        .sort((a, b) => a.containerNum - b.containerNum)
        .map(row => ({
            ...row,
            combinedBDT: safeRound(row.lcBDT + row.portBDT)
        }));

    let lcUSD = 0;
    let lcBDT = 0;
    let combinedMatchedBDT = 0;
    for (const row of rows) {
        lcUSD = safeRound(lcUSD + row.lcUSD);
        lcBDT = safeRound(lcBDT + row.lcBDT);
        combinedMatchedBDT = safeRound(combinedMatchedBDT + row.combinedBDT);
    }

    const portTotalBDT = safeRound(portMatchedBDT + portUnmatchedBDT);
    const combinedAllBDT = safeRound(lcBDT + portTotalBDT);

    return {
        rows,
        unmatchedPortRows,
        totals: {
            containerCount: rows.length,
            lcUSD,
            lcBDT,
            portMatchedBDT,
            portUnmatchedBDT,
            portTotalBDT,
            combinedMatchedBDT,
            combinedAllBDT
        }
    };
}

/**
 * Canonical Audit Variance Engine (Rule 16 backward-compatible):
 *   variance = totalPhysicalAssets - calculatedCashBalance
 *   - variance > 0.01  => Surplus (ক্যাশ বাড়তি)
 *   - variance < -0.01 => Deficit (ক্যাশ ঘাটতি / বাকি)
 *   - |variance| <= 0.01 => Balanced (সম্পূর্ণ মিল)
 *
 * Recalculates from stored physical & theoretical balances so legacy inverted docs
 * display the mathematically truthful sign without requiring DB migration.
 *
 * @param {Object} audit
 * @returns {Object}
 */
export function computeAuditVarianceMetrics(audit = {}) {
    if (!audit || typeof audit !== 'object') {
        return {
            theoreticalCash: 0,
            totalPhysical: 0,
            variance: 0,
            absVariance: 0,
            statusKind: 'balanced',
            statusLabel: '(সম্পূর্ণ মিল)'
        };
    }

    const theoreticalCash = safeRound(
        Number(audit.calculatedCashBalance ?? audit.theoreticalCash) || 0
    );

    const hasPhysicalField =
        audit.totalPhysicalAssets !== undefined ||
        audit.physicalAssets?.totalPhysical !== undefined;

    const totalPhysical = hasPhysicalField
        ? safeRound(Number(audit.totalPhysicalAssets ?? audit.physicalAssets?.totalPhysical) || 0)
        : safeRound(theoreticalCash + (Number(audit.varianceAmount ?? audit.variance) || 0));

    const variance = hasPhysicalField
        ? safeRound(totalPhysical - theoreticalCash)
        : safeRound(Number(audit.varianceAmount ?? audit.variance) || 0);

    const absVariance = safeRound(Math.abs(variance));

    let statusKind = 'balanced';
    let statusLabel = '(সম্পূর্ণ মিল / সমান)';
    if (variance > 0.01) {
        statusKind = 'surplus';
        statusLabel = '(ক্যাশ বাড়তি)';
    } else if (variance < -0.01) {
        statusKind = 'deficit';
        statusLabel = '(ক্যাশ ঘাটতি / বাকি)';
    }

    return {
        theoreticalCash,
        totalPhysical,
        variance,
        absVariance,
        statusKind,
        statusLabel
    };
}

/**
 * Summarizes Dubai AED cash liquidity from Book 0001 Remittance and Book 0005 Latest Audit.
 * Strictly isolated from BDT customer/local ERP accounting.
 *
 * @param {Object} dubaiSummary
 * @param {Object|null} latestAudit
 * @returns {Object}
 */
export function calculateDubaiLiquiditySummary(dubaiSummary, latestAudit = null) {
    const remittedAED = safeRound(Number(dubaiSummary?.grandTotal?.aed) || 0);
    const avgRate = safeRound(Number(dubaiSummary?.grandTotal?.avgRate ?? dubaiSummary?.grandTotal?.rate) || 0);

    if (!latestAudit) {
        return {
            hasAudit: false,
            weekEndDate: '',
            remittedAED,
            auditCumSentAED: 0,
            remittanceAuditGapAED: remittedAED,
            cumPurchaseAED: 0,
            cumExpenseAED: 0,
            theoreticalCashAED: 0,
            totalPhysicalAED: 0,
            cashInHandAED: 0,
            marketAdvanceAED: 0,
            messBalanceAED: 0,
            holdingsTotalAED: 0,
            personalHoldings: [],
            varianceMetrics: computeAuditVarianceMetrics(null),
            estimatedCashBDT: 0
        };
    }

    const auditCumSentAED = safeRound(Number(latestAudit.cumulativeRemittance) || 0);
    const cumPurchaseAED = safeRound(Number(latestAudit.cumulativePurchaseTotal) || 0);
    const cumExpenseAED = safeRound(Number(latestAudit.cumulativeExpenseTotal) || 0);
    const cashInHandAED = safeRound(Number(latestAudit.cashInHand) || 0);
    const marketAdvanceAED = safeRound(Number(latestAudit.marketAdvance) || 0);
    const messBalanceAED = safeRound(Number(latestAudit.messBalance) || 0);

    const personalHoldings = Array.isArray(latestAudit.personalHoldings)
        ? latestAudit.personalHoldings.map(h => ({
            name: String(h.name || h.desc || '').trim() || 'কাস্টডিয়ান',
            amount: safeRound(Number(h.amount) || 0),
            op: h.op === '+' ? '+' : '-'
        }))
        : [];

    const holdingsTotalAED = safeRound(
        personalHoldings.reduce((acc, h) => safeRound(acc + h.amount), 0)
    );

    const varianceMetrics = computeAuditVarianceMetrics(latestAudit);
    const remittanceAuditGapAED = safeRound(remittedAED - auditCumSentAED);
    const estimatedCashBDT = avgRate > 0
        ? safeRound(Math.round(varianceMetrics.theoreticalCash * avgRate))
        : 0;

    return {
        hasAudit: true,
        weekEndDate: latestAudit.weekEndDate || '',
        remittedAED,
        auditCumSentAED,
        remittanceAuditGapAED,
        cumPurchaseAED,
        cumExpenseAED,
        theoreticalCashAED: varianceMetrics.theoreticalCash,
        totalPhysicalAED: varianceMetrics.totalPhysical,
        cashInHandAED,
        marketAdvanceAED,
        messBalanceAED,
        holdingsTotalAED,
        personalHoldings,
        varianceMetrics,
        estimatedCashBDT
    };
}

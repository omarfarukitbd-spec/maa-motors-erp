import { safeRound, formatAmountWithComma } from '../utils.js';
import { numberToBanglaWords } from '../utils/currency-words.js';

/**
 * Enhanced Precision Payroll Calculator
 * Obeying Financial Math Invariants & Ground Truth
 */

/**
 * Calculate net salary with base + bonus - deduction
 * @param {number} base
 * @param {number} bonus
 * @param {number} deduction
 * @returns {number}
 */
export function calculateNetSalary(base = 0, bonus = 0, deduction = 0) {
    const b = Number(base) || 0;
    const bon = Number(bonus) || 0;
    const ded = Number(deduction) || 0;
    return safeRound(b + bon - ded);
}

/**
 * Convert AED to BDT
 * @param {number} aed
 * @param {number} rate
 * @returns {number}
 */
export function convertAedToBdt(aed = 0, rate = 35) {
    const a = Number(aed) || 0;
    const r = Number(rate) || 35;
    return safeRound(a * r);
}

/**
 * Calculate complete mathematical summary across all sections
 * @param {Array<Object>} sections
 * @param {number} aedRate
 */
export function calculatePayrollSummary(sections = [], aedRate = 35) {
    let grandTotal = 0;
    let totalPaid = 0;
    let totalPending = 0;
    let totalSalaries = 0;
    let totalExpenses = 0;
    let totalItemsCount = 0;
    let paidCount = 0;
    let pendingCount = 0;

    const enrichedSections = (sections || []).map(section => {
        let subTotal = 0;
        let secPaid = 0;
        let secPending = 0;

        const enrichedItems = (section.items || []).map(item => {
            let amt = Number(item.amount) || 0;

            // Recalculate foreign currency if AED item
            if (item.foreignCurrency === 'AED' && item.foreignAmount) {
                amt = convertAedToBdt(item.foreignAmount, aedRate);
            }

            // Recalculate net salary if baseSalary present and not raw override
            if (item.type === 'salary' && item.baseSalary !== undefined && item.deduction !== undefined) {
                // If base is set, net = base + bonus - deduction
                if (item.baseSalary > 0) {
                    amt = calculateNetSalary(item.baseSalary, item.bonus, item.deduction);
                }
            }

            subTotal = safeRound(subTotal + amt);
            totalItemsCount += 1;

            const isPaid = item.status === 'paid';
            if (isPaid) {
                secPaid = safeRound(secPaid + amt);
                totalPaid = safeRound(totalPaid + amt);
                paidCount += 1;
            } else {
                secPending = safeRound(secPending + amt);
                totalPending = safeRound(totalPending + amt);
                pendingCount += 1;
            }

            if (item.type === 'salary') {
                totalSalaries = safeRound(totalSalaries + amt);
            } else {
                totalExpenses = safeRound(totalExpenses + amt);
            }

            return {
                ...item,
                amount: amt
            };
        });

        grandTotal = safeRound(grandTotal + subTotal);

        return {
            ...section,
            items: enrichedItems,
            subTotal,
            secPaid,
            secPending,
            itemsCount: enrichedItems.length
        };
    });

    const grandTotalInWords = numberToBanglaWords(grandTotal);

    return {
        sections: enrichedSections,
        grandTotal,
        totalPaid,
        totalPending,
        totalSalaries,
        totalExpenses,
        totalItemsCount,
        paidCount,
        pendingCount,
        grandTotalInWords,
        aedRate: Number(aedRate) || 35
    };
}

/**
 * Format currency with Taka symbol (e.g. ৳ ৪,৯৪,৭০০)
 * @param {number} amount
 * @returns {string}
 */
export function formatTaka(amount) {
    const num = Math.round(Number(amount) || 0);
    return '৳ ' + formatAmountWithComma(num);
}

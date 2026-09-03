import { getCustomerCache } from '../customer/customer-state.js';
import { TransactionDAO } from '../dao.js';
import { safeRound } from '../utils.js';

/**
 * Returns customer list sorted strictly by numeric account number
 * @returns {Array} Sorted customer array
 */
export function getSortedInspectorCustomers() {
    const raw = getCustomerCache() || [];
    return [...raw].sort((a, b) => {
        const accA = a.accountNo || '';
        const accB = b.accountNo || '';
        return accA.localeCompare(accB, undefined, { numeric: true });
    });
}

/**
 * Finds customer index in sorted list by search query (A/C no, phone, name)
 * @param {Array} customers 
 * @param {string} query 
 * @returns {number} Index found or -1
 */
export function findCustomerIndexByQuery(customers, query) {
    if (!customers || customers.length === 0 || !query) return -1;
    const clean = query.trim().toLowerCase();

    // 1. Exact Account Number Match
    const exactAccIdx = customers.findIndex(c => (c.accountNo || '').toLowerCase() === clean);
    if (exactAccIdx !== -1) return exactAccIdx;

    // 2. Numeric Account Match (e.g. typing "1" finds "000001")
    const cleanNum = parseInt(clean, 10);
    if (!isNaN(cleanNum) && cleanNum > 0) {
        const numAccIdx = customers.findIndex(c => {
            const accNum = parseInt(c.accountNo, 10);
            return !isNaN(accNum) && accNum === cleanNum;
        });
        if (numAccIdx !== -1) return numAccIdx;
    }

    // 3. Account Number Starts With
    const startsAccIdx = customers.findIndex(c => (c.accountNo || '').toLowerCase().startsWith(clean));
    if (startsAccIdx !== -1) return startsAccIdx;

    // 4. Exact Phone Match or Phone Contains
    const phoneIdx = customers.findIndex(c => {
        const p = (c.phone || '').replace(/\D/g, '');
        const qDigits = clean.replace(/\D/g, '');
        return qDigits.length >= 3 && (p.endsWith(qDigits) || p.includes(qDigits));
    });
    if (phoneIdx !== -1) return phoneIdx;

    // 5. Name match
    const nameIdx = customers.findIndex(c => (c.name || '').toLowerCase().includes(clean));
    if (nameIdx !== -1) return nameIdx;

    return -1;
}

/**
 * Extracts first valid 11-digit mobile number from phone string
 * @param {string} phoneStr 
 * @returns {string} 11-digit clean mobile number
 */
export function extractPrimaryPhone(phoneStr) {
    if (!phoneStr) return '';
    const match = phoneStr.match(/(?:^|[^\d])(01[3-9]\d{8})(?:[^\d]|$)/);
    if (match) return match[1];
    const digits = phoneStr.replace(/\D/g, '');
    return digits.length >= 11 ? digits.slice(0, 11) : digits;
}

export const customerStatsCache = new Map();

/**
 * Fetches real lifetime total bill and paid for customer from transactions
 * @param {string} customerId 
 * @returns {Promise<{totalBill: number, totalPaid: number}>}
 */
export async function fetchCustomerStats(customerId) {
    if (!customerId) return { totalBill: 0, totalPaid: 0 };
    if (customerStatsCache.has(customerId)) {
        return customerStatsCache.get(customerId);
    }
    try {
        const txns = await TransactionDAO.getByCustomer(customerId);
        let totalBill = 0;
        let totalPaid = 0;

        txns.forEach(t => {
            const v = String(t.voucherNo || '').trim().toUpperCase();
            if (v !== 'OPENING' && v !== 'OPEN' && v !== 'প্রারম্ভিক ব্যালেন্স' && v !== 'প্রারম্ভিক জের') {
                totalBill += Number(t.bill) || 0;
                totalPaid += Number(t.paid) || 0;
            }
        });

        const stats = {
            totalBill: safeRound(totalBill),
            totalPaid: safeRound(totalPaid)
        };
        customerStatsCache.set(customerId, stats);
        return stats;
    } catch (e) {
        console.error('fetchCustomerStats error:', e);
        return { totalBill: 0, totalPaid: 0 };
    }
}

/**
 * Formats customer details and financial statuses
 * @param {Object} cust 
 * @param {Object} [stats] Optional cached lifetime stats
 * @returns {Object} Formatted customer snapshot
 */
export function getCustomerSnapshot(cust, stats = null) {
    if (!cust) return null;

    // Database field is initialDue in Firestore (DATABASE_SCHEMA.md)
    const openingBalance = Number(cust.initialDue || 0);
    const totalDue = Number(cust.totalDue || 0);

    const totalBill = stats ? (Number(stats.totalBill) || 0) : 0;
    const totalPaid = stats ? (Number(stats.totalPaid) || 0) : 0;

    let dueStatus = {
        type: 'zero',
        label: 'মোট ব্যালেন্স (পরিশোধিত)',
        color: 'text-slate-300',
        borderColor: 'border-slate-700/60',
        bgGradient: 'from-slate-900 via-slate-900/90 to-slate-950',
        badge: 'পরিশোধিত'
    };

    if (totalDue > 0) {
        dueStatus = {
            type: 'due',
            label: 'বর্তমান অবশিষ্ট বকেয়া (Net Due)',
            color: 'text-red-400',
            borderColor: 'border-red-500/40',
            bgGradient: 'from-red-950/40 via-slate-900 to-slate-950',
            badge: 'বকেয়া'
        };
    } else if (totalDue < 0) {
        dueStatus = {
            type: 'adv',
            label: 'বর্তমান ব্যালেন্স (অগ্রিম জমা)',
            color: 'text-emerald-400',
            borderColor: 'border-emerald-500/40',
            bgGradient: 'from-emerald-950/40 via-slate-900 to-slate-950',
            badge: 'অগ্রিম জমা'
        };
    }

    return {
        id: cust.id,
        accountNo: cust.accountNo || '-',
        name: cust.name || 'নামবিহীন',
        phone: cust.phone || '-',
        primaryPhone: extractPrimaryPhone(cust.phone),
        address: cust.address || '-',
        zone: cust.zone || '-',
        openingBalance,
        totalBill,
        totalPaid,
        totalDue,
        dueStatus
    };
}

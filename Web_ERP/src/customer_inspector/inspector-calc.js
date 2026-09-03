import { getCustomerCache } from '../customer/customer-state.js';

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

    // 2. Account Number Starts With
    const startsAccIdx = customers.findIndex(c => (c.accountNo || '').toLowerCase().startsWith(clean));
    if (startsAccIdx !== -1) return startsAccIdx;

    // 3. Exact Phone Match or Phone Ends With (last 4/5 digits)
    const phoneIdx = customers.findIndex(c => {
        const p = (c.phone || '').replace(/\D/g, '');
        const qDigits = clean.replace(/\D/g, '');
        return qDigits.length >= 3 && (p.endsWith(qDigits) || p.includes(qDigits));
    });
    if (phoneIdx !== -1) return phoneIdx;

    // 4. Name match
    const nameIdx = customers.findIndex(c => (c.name || '').toLowerCase().includes(clean));
    if (nameIdx !== -1) return nameIdx;

    return -1;
}

/**
 * Formats customer details and financial statuses
 * @param {Object} cust 
 * @returns {Object} Formatted customer snapshot
 */
export function getCustomerSnapshot(cust) {
    if (!cust) return null;

    const totalBill = Number(cust.totalBill) || 0;
    const totalPaid = Number(cust.totalPaid) || 0;
    const totalDue = Number(cust.totalDue) || 0;

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
        address: cust.address || '-',
        zone: cust.zone || '-',
        totalBill,
        totalPaid,
        totalDue,
        dueStatus
    };
}

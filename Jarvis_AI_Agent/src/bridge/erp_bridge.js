import { db } from '../config.js';
import { 
    collection, 
    getDocs, 
    query, 
    where, 
    orderBy, 
    limit 
} from 'firebase/firestore';

/**
 * Mathematical Floating-Point Safe Rounder (Accounting Standard)
 */
export function safeRound(num) {
    if (typeof num !== 'number' || isNaN(num)) return 0;
    return Math.round((num + Number.EPSILON) * 100) / 100;
}

/**
 * Format amounts with Bangladeshi commas (e.g. 5,58,49,802)
 */
export function formatAmountWithComma(amount) {
    if (amount === null || amount === undefined || isNaN(amount)) return '০';
    const num = Math.round(Number(amount));
    const isNegative = num < 0;
    const absStr = Math.abs(num).toString();
    
    if (absStr.length <= 3) return (isNegative ? '-' : '') + absStr;
    
    let lastThree = absStr.substring(absStr.length - 3);
    let rest = absStr.substring(0, absStr.length - 3);
    let parts = [];
    
    while (rest.length > 2) {
        parts.unshift(rest.substring(rest.length - 2));
        rest = rest.substring(0, rest.length - 2);
    }
    if (rest.length > 0) parts.unshift(rest);
    
    const formatted = parts.join(',') + ',' + lastThree;
    return (isNegative ? '-' : '') + formatted;
}

/**
 * Number to spoken Bengali words (for natural voice responses)
 */
export function numberToSpokenBangla(number) {
    const num = Math.round(Number(number) || 0);
    if (num === 0) return 'শূন্য টাকা';
    
    const isNegative = num < 0;
    let n = Math.abs(num);
    
    let parts = [];
    if (n >= 10000000) {
        const cr = Math.floor(n / 10000000);
        parts.push(`${cr} কোটি`);
        n %= 10000000;
    }
    if (n >= 100000) {
        const lac = Math.floor(n / 100000);
        parts.push(`${lac} লক্ষ`);
        n %= 100000;
    }
    if (n >= 1000) {
        const th = Math.floor(n / 1000);
        parts.push(`${th} হাজার`);
        n %= 1000;
    }
    if (n >= 100) {
        const h = Math.floor(n / 100);
        parts.push(`${h} শত`);
        n %= 100;
    }
    if (n > 0) {
        parts.push(`${n}`);
    }
    
    const res = parts.join(' ') + ' টাকা';
    return isNegative ? `মাইনাস ${res}` : res;
}

/**
 * 🛡️ ERP Safe Read-Only Bridge
 * Directly reads Firestore collections without mutating or risking production records.
 */
export const ERPBridge = {
    /**
     * Search Customers by Name, Phone, or Code
     */
    async searchCustomers(searchTerm) {
        const term = String(searchTerm || '').trim().toLowerCase();
        if (!term) return [];

        const snap = await getDocs(collection(db, 'customers'));
        const list = [];

        snap.forEach(doc => {
            const data = doc.data();
            const name = (data.name || '').toLowerCase();
            const phone = (data.phone || '');
            const address = (data.address || '').toLowerCase();

            if (name.includes(term) || phone.includes(term) || address.includes(term)) {
                list.push({
                    id: doc.id,
                    name: data.name || 'নামহীন',
                    phone: data.phone || 'মোবাইল নেই',
                    address: data.address || '',
                    totalDue: safeRound(data.totalDue || 0), // Canonical Net Due
                    initialDue: safeRound(data.initialDue || 0) // Opening Balance
                });
            }
        });

        return list;
    },

    /**
     * Get Today's or Recent Financial Inflow, Bank Balances & Total Liquid Fund
     */
    async getFinancialSnapshot() {
        try {
            // 1. Get all active banks & cash collectors
            const [banksSnap, cashSnap] = await Promise.all([
                getDocs(collection(db, 'banks')),
                getDocs(collection(db, 'cash_collectors'))
            ]);

            const accounts = [];
            let totalLiquidFund = 0;

            banksSnap.forEach(d => {
                const data = d.data();
                if (data.status !== 'inactive') {
                    const bal = safeRound(data.currentBalance || data.balance || 0);
                    accounts.push({ name: data.name || 'Bank', balance: bal, isCash: false });
                    totalLiquidFund = safeRound(totalLiquidFund + bal);
                }
            });

            cashSnap.forEach(d => {
                const data = d.data();
                if (data.status !== 'inactive') {
                    const bal = safeRound(data.currentBalance || data.balance || 0);
                    accounts.push({ name: data.name || 'Cash', balance: bal, isCash: true });
                    totalLiquidFund = safeRound(totalLiquidFund + bal);
                }
            });

            // 2. Get customer count and total due across all customers
            const custSnap = await getDocs(collection(db, 'customers'));
            let totalMarketDue = 0;
            let activeCustomerCount = 0;

            custSnap.forEach(d => {
                const data = d.data();
                const due = Number(data.totalDue) || 0;
                if (due > 0) totalMarketDue = safeRound(totalMarketDue + due);
                activeCustomerCount++;
            });

            return {
                totalLiquidFund,
                accounts,
                totalMarketDue,
                activeCustomerCount
            };
        } catch (err) {
            console.error('ERPBridge getFinancialSnapshot error:', err);
            return null;
        }
    },

    /**
     * Get Latest Dubai Weekly Audit & Cash Holdings
     */
    async getLatestDubaiAudit() {
        try {
            const auditsCol = collection(db, 'dubai_weekly_audits');
            const q = query(auditsCol, orderBy('date', 'desc'), limit(1));
            const snap = await getDocs(q);

            if (snap.empty) return null;

            const doc = snap.docs[0];
            const data = doc.data();

            return {
                id: doc.id,
                date: data.date,
                cashInHand: safeRound(data.cashInHand || 0),
                marketAdvance: safeRound(data.marketAdvance || 0),
                messBalance: safeRound(data.messBalance || 0),
                calculatedCashBalance: safeRound(data.calculatedCashBalance || 0),
                totalPhysicalAssets: safeRound(data.totalPhysicalAssets || 0),
                variance: safeRound(data.variance || 0),
                personalHoldings: data.personalHoldings || []
            };
        } catch (err) {
            console.error('ERPBridge getLatestDubaiAudit error:', err);
            return null;
        }
    }
};

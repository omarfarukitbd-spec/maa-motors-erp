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

// Memory cache for fast customer searching
let cachedCustomers = null;
let lastCustomerFetchTime = 0;
const CACHE_TTL_MS = 60 * 1000; // 1 minute

/**
 * Extract meaningful search tokens with Bengali grammar stemming & speech recognition typo tolerance
 */
export function extractBengaliSearchTokens(searchTerm) {
    const rawTerm = String(searchTerm || '').trim().toLowerCase();
    if (!rawTerm) return [];

    const stopwords = [
        'কাস্টমার', 'সাহেব', 'সাহেবের', 'ভাই', 'ভাইয়ের', 'বকেয়া', 'বকে', 'বাকী',
        'হিসাব', 'ব্যালেন্স', 'কত', 'বলো', 'জানাও', 'টাকা', 'দেখা', 'দেখাও',
        'খাতা', 'রিপোর্ট', 'এর', 'দোকান', 'দোকানের'
    ];

    const words = rawTerm
        .replace(/[?.,!।:;'"()\/\\]/g, ' ')
        .split(/\s+/)
        .filter(w => w.length >= 2);

    const keywords = new Set();

    for (const w of words) {
        if (stopwords.includes(w)) continue;
        keywords.add(w);

        // Bengali grammatical suffixes: ের (e-kar + ra), এর, দের, র, কে
        let root = w;
        if (root.endsWith('ের')) {
            root = root.slice(0, -2);
        } else if (root.endsWith('এর')) {
            root = root.slice(0, -2);
        } else if (root.endsWith('দের')) {
            root = root.slice(0, -3);
        } else if (root.endsWith('র') && root.length >= 4) {
            root = root.slice(0, -1);
        } else if (root.endsWith('কে') && root.length >= 4) {
            root = root.slice(0, -2);
        }

        if (root.length >= 2 && !stopwords.includes(root)) {
            keywords.add(root);
        }

        // Voice-to-text / speech recognition typo tolerance (e.g. ডান্ডার -> ভান্ডার / ভাণ্ডার)
        if (w.includes('ডান্ডার') || root.includes('ডান্ডার')) {
            keywords.add('ভান্ডার');
            keywords.add('ভাণ্ডার');
        }
        if (w.includes('ভান্ডার') || root.includes('ভান্ডার')) {
            keywords.add('ভাণ্ডার');
        }
        if (w.includes('ভাণ্ডার') || root.includes('ভাণ্ডার')) {
            keywords.add('ভান্ডার');
        }
        if (w.includes('জাভেদ') || root.includes('জাভেদ')) {
            keywords.add('জাবেদ');
        }
        if (w.includes('জাবেদ') || root.includes('জাবেদ')) {
            keywords.add('জাভেদ');
        }
    }

    return Array.from(keywords);
}

/**
 * 🛡️ ERP Safe Read-Only Bridge
 * Directly reads Firestore collections without mutating or risking production records.
 */
export const ERPBridge = {
    /**
     * Search Customers by Name, Phone, Address, or Zone with Multi-Token Weighted Matching
     */
    async searchCustomers(searchTerm) {
        const searchKeywords = extractBengaliSearchTokens(searchTerm);
        if (searchKeywords.length === 0) {
            const fallback = String(searchTerm || '').trim().toLowerCase();
            if (fallback.length >= 2) searchKeywords.push(fallback);
            else return [];
        }

        try {
            let snapDocs = [];
            const now = Date.now();
            if (cachedCustomers && (now - lastCustomerFetchTime < CACHE_TTL_MS)) {
                snapDocs = cachedCustomers;
            } else {
                const snap = await getDocs(collection(db, 'customers'));
                snapDocs = [];
                snap.forEach(doc => {
                    snapDocs.push({ id: doc.id, ...doc.data() });
                });
                cachedCustomers = snapDocs;
                lastCustomerFetchTime = now;
            }

            const scoredList = [];

            for (const data of snapDocs) {
                const name = (data.name || '').toLowerCase();
                const phone = (data.phone || '');
                const address = (data.address || '').toLowerCase();
                const zone = (data.zone || '').toLowerCase();
                const accountNo = (data.accountNo || '').toLowerCase();

                let score = 0;
                for (const tok of searchKeywords) {
                    if (name.includes(tok)) score += 10;
                    if (phone.includes(tok)) score += 15;
                    if (accountNo.includes(tok)) score += 15;
                    if (address.includes(tok)) score += 6;
                    if (zone.includes(tok)) score += 4;
                }

                if (score > 0) {
                    scoredList.push({
                        score,
                        id: data.id,
                        name: data.name || 'নামহীন',
                        phone: data.phone || 'মোবাইল নেই',
                        address: data.address || '',
                        zone: data.zone || '',
                        accountNo: data.accountNo || '',
                        totalDue: safeRound(data.totalDue || 0), // Canonical Net Due
                        initialDue: safeRound(data.initialDue || 0) // Opening Balance
                    });
                }
            }

            // Sort by highest relevance match score first
            scoredList.sort((a, b) => b.score - a.score);
            return scoredList;
        } catch (err) {
            console.error('ERPBridge searchCustomers error:', err);
            if (err.code === 'permission-denied') {
                return { error: 'AUTH_REQUIRED' };
            }
            return [];
        }
    },

    /**
     * Get Today's or Recent Financial Inflow, Bank Balances & Total Liquid Fund
     */
    async getFinancialSnapshot() {
        try {
            // 1. Get all active banks & cash collectors
            const [banksSnap, cashSnap] = await Promise.all([
                getDocs(collection(db, 'bank_accounts')),
                getDocs(collection(db, 'cash_collectors'))
            ]);

            const accounts = [];
            let totalLiquidFund = 0;

            banksSnap.forEach(d => {
                const data = d.data();
                if (data.status !== 'inactive') {
                    const bal = safeRound(data.currentBalance ?? data.balance ?? 0);
                    const bName = data.name || data.bankName || 'ব্যাংক অ্যাকাউন্ট';
                    accounts.push({ name: bName, balance: bal, isCash: false });
                    totalLiquidFund = safeRound(totalLiquidFund + bal);
                }
            });

            cashSnap.forEach(d => {
                const data = d.data();
                if (data.status !== 'inactive') {
                    const bal = safeRound(data.currentBalance ?? data.balance ?? 0);
                    const cName = data.name || 'ক্যাশ কাউন্টার';
                    accounts.push({ name: cName, balance: bal, isCash: true });
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

            const snapshot = {
                totalLiquidFund,
                accounts,
                totalBankBalance: safeRound(accounts.filter(a => !a.isCash).reduce((sum, a) => sum + a.balance, 0)),
                totalPhysicalCash: safeRound(accounts.filter(a => a.isCash).reduce((sum, a) => sum + a.balance, 0)),
                totalHoldings: totalLiquidFund,
                totalMarketDue,
                activeCustomerCount
            };

            return snapshot;
        } catch (err) {
            console.error('ERPBridge getFinancialSnapshot error:', err);
            if (err.code === 'permission-denied') {
                return { error: 'AUTH_REQUIRED' };
            }
            return null;
        }
    },

    /**
     * Alias for getFinancialSnapshot to ensure seamless tool calling
     */
    async getCashAndBankSummary() {
        return await this.getFinancialSnapshot();
    },

    /**
     * Customer 360° Profile & Deep Ledger Analytics
     * Fetches complete customer profile, aggregate totals, last bill details, and last payment history
     */
    async getCustomer360Profile(searchTerm) {
        if (!searchTerm) return null;
        try {
            const matches = await this.searchCustomers(searchTerm);
            if (matches && matches.error === 'AUTH_REQUIRED') {
                return { error: 'AUTH_REQUIRED' };
            }
            if (!matches || matches.length === 0) {
                return { found: false, message: `"${searchTerm}" নামে কোনো কাস্টমার পাওয়া যায়নি।` };
            }

            const customer = matches[0];
            const txnsCol = collection(db, 'transactions');
            const q = query(
                txnsCol,
                where('customerId', '==', customer.id),
                orderBy('date', 'desc'),
                limit(50)
            );
            const snap = await getDocs(q);

            let totalPurchased = 0;
            let totalPaid = 0;
            let lastBill = null;
            let lastPayment = null;
            const history = [];

            snap.forEach(doc => {
                const d = doc.data();
                const bill = safeRound(d.bill || 0);
                const paid = safeRound(d.paid || 0);
                totalPurchased = safeRound(totalPurchased + bill);
                totalPaid = safeRound(totalPaid + paid);

                const item = {
                    id: doc.id,
                    date: d.date || '',
                    voucherNo: d.voucherNo || '',
                    bill,
                    paid,
                    prevDue: safeRound(d.prevDue || 0),
                    currentDue: safeRound(d.currentDue || 0),
                    receivedType: d.receivedType || 'Cash',
                    notes: d.notes || ''
                };

                if (!lastBill && bill > 0) {
                    lastBill = item;
                }
                if (!lastPayment && paid > 0) {
                    lastPayment = item;
                }
                if (history.length < 5) {
                    history.push(item);
                }
            });

            return {
                found: true,
                id: customer.id,
                accountNo: customer.accountNo || 'অ্যাকাউন্ট নম্বর নেই',
                name: customer.name || 'নামহীন',
                phone: customer.phone || 'মোবাইল নেই',
                address: customer.address || 'ঠিকানা দেওয়া নেই',
                zone: customer.zone || 'জোন নির্ধারিত নেই',
                initialDue: customer.initialDue || 0,
                totalDue: customer.totalDue || 0,
                totalPurchased,
                totalPaid,
                transactionCount: snap.size,
                lastBill,
                lastPayment,
                recentTransactions: history
            };
        } catch (err) {
            console.error('ERPBridge getCustomer360Profile error:', err);
            if (err.code === 'permission-denied') {
                return { error: 'AUTH_REQUIRED' };
            }
            return null;
        }
    },

    /**
     * Get Customer Ledger History: Last Invoice/Bill, Last Payment, and Recent Transactions
     */
    async getCustomerLedger(customerId, limitCount = 5) {
        if (!customerId) return null;
        try {
            const txnsCol = collection(db, 'transactions');
            const q = query(
                txnsCol, 
                where('customerId', '==', customerId),
                orderBy('date', 'desc'),
                limit(30)
            );
            const snap = await getDocs(q);

            let lastBill = null;
            let lastPayment = null;
            const history = [];

            snap.forEach(doc => {
                const d = doc.data();
                const item = {
                    id: doc.id,
                    date: d.date || '',
                    voucherNo: d.voucherNo || '',
                    bill: safeRound(d.bill || 0),
                    paid: safeRound(d.paid || 0),
                    prevDue: safeRound(d.prevDue || 0),
                    currentDue: safeRound(d.currentDue || 0),
                    receivedType: d.receivedType || 'Cash',
                    notes: d.notes || ''
                };

                if (!lastBill && item.bill > 0) {
                    lastBill = item;
                }
                if (!lastPayment && item.paid > 0) {
                    lastPayment = item;
                }
                if (history.length < limitCount) {
                    history.push(item);
                }
            });

            return {
                lastBill,
                lastPayment,
                history
            };
        } catch (err) {
            console.error('ERPBridge getCustomerLedger error:', err);
            if (err.code === 'permission-denied') {
                return { error: 'AUTH_REQUIRED' };
            }
            return null;
        }
    },

    /**
     * Executive Daily Business Pulse (Sales, Collections, Expenses, Net Cash Flow)
     */
    async getExecutiveBusinessPulse(targetDate = null) {
        const date = targetDate || new Date().toISOString().split('T')[0];
        try {
            // 1. Fetch Today's Transactions
            const txnsCol = collection(db, 'transactions');
            const txnsQuery = query(txnsCol, where('date', '==', date));
            const txnsSnap = await getDocs(txnsQuery);

            let todayTotalBills = 0;
            let todayTotalCollections = 0;
            let cashCollections = 0;
            let bankCollections = 0;
            const activeCustomerNames = new Set();

            txnsSnap.forEach(doc => {
                const d = doc.data();
                const bill = safeRound(d.bill || 0);
                const paid = safeRound(d.paid || 0);
                todayTotalBills = safeRound(todayTotalBills + bill);
                todayTotalCollections = safeRound(todayTotalCollections + paid);

                if ((d.receivedType || '').toLowerCase().includes('cash')) {
                    cashCollections = safeRound(cashCollections + paid);
                } else if (paid > 0) {
                    bankCollections = safeRound(bankCollections + paid);
                }

                if (d.customerName) activeCustomerNames.add(d.customerName);
            });

            // 2. Fetch Today's Expenses
            const expensesData = await this.getDailyExpenses(date);
            const todayTotalExpenses = expensesData?.totalExpense || 0;

            // Universal Invariant 3: Net Cash Flow = Total Collection - Total Expenses
            const todayNetCashFlow = safeRound(todayTotalCollections - todayTotalExpenses);

            return {
                date,
                todayTotalBills,
                todayTotalCollections,
                cashCollections,
                bankCollections,
                todayTotalExpenses,
                todayNetCashFlow,
                activeCustomersCount: activeCustomerNames.size,
                activeCustomers: Array.from(activeCustomerNames).slice(0, 5),
                expenseBreakdown: expensesData?.categoryBreakdown || {}
            };
        } catch (err) {
            console.error('ERPBridge getExecutiveBusinessPulse error:', err);
            return null;
        }
    },

    /**
     * Get Daily Expenses by Date (defaults to today)
     */
    async getDailyExpenses(targetDate = null) {
        const date = targetDate || new Date().toISOString().split('T')[0];
        try {
            const expCol = collection(db, 'expenses');
            const q = query(expCol, where('date', '==', date));
            const snap = await getDocs(q);

            let totalExpense = 0;
            const categoryBreakdown = {};
            const items = [];

            snap.forEach(doc => {
                const data = doc.data();
                const amount = safeRound(data.amount || 0);
                totalExpense = safeRound(totalExpense + amount);

                const cat = data.category || 'অন্যান্য খরচ';
                categoryBreakdown[cat] = safeRound((categoryBreakdown[cat] || 0) + amount);

                items.push({
                    id: doc.id,
                    category: cat,
                    amount,
                    description: data.description || '',
                    voucherNo: data.voucherNo || '',
                    paymentMethod: data.paymentMethod || 'Cash'
                });
            });

            return {
                date,
                totalExpense,
                categoryBreakdown,
                count: items.length,
                items
            };
        } catch (err) {
            console.error('ERPBridge getDailyExpenses error:', err);
            return null;
        }
    },

    /**
     * Get Master Treasury Fund Status (opening balance + TreasuryTransactions)
     */
    async getTreasuryFundStatus() {
        try {
            // Read settings/treasury
            let openingBalance = 0;
            try {
                const settingsSnap = await getDocs(collection(db, 'settings'));
                settingsSnap.forEach(d => {
                    if (d.id === 'treasury') {
                        openingBalance = safeRound(d.data().openingBalance || 0);
                    }
                });
            } catch (settingsErr) {
                console.warn('Treasury settings read error:', settingsErr);
            }

            // Read TreasuryTransactions
            const txnsCol = collection(db, 'TreasuryTransactions');
            const q = query(txnsCol, orderBy('date', 'desc'), limit(50));
            const snap = await getDocs(q);

            let totalInflows = 0;
            let totalOutflows = 0;
            const recentTxns = [];

            snap.forEach(doc => {
                const data = doc.data();
                const amt = safeRound(data.amount || 0);
                if (data.type === 'inflow') {
                    totalInflows = safeRound(totalInflows + amt);
                } else if (data.type === 'outflow') {
                    totalOutflows = safeRound(totalOutflows + amt);
                }
                if (recentTxns.length < 5) {
                    recentTxns.push({
                        id: doc.id,
                        date: data.date,
                        title: data.title || '',
                        type: data.type,
                        amount: amt,
                        note: data.note || ''
                    });
                }
            });

            const currentTreasuryBalance = safeRound(openingBalance + totalInflows - totalOutflows);

            return {
                openingBalance,
                currentTreasuryBalance,
                totalInflows,
                totalOutflows,
                recentTxns
            };
        } catch (err) {
            console.error('ERPBridge getTreasuryFundStatus error:', err);
            return null;
        }
    },

    /**
     * Get Top Debtors / Highest Market Dues
     */
    async getTopDebtors(limitCount = 5, targetZone = null) {
        try {
            const snap = await getDocs(collection(db, 'customers'));
            const list = [];
            let totalDueSum = 0;

            snap.forEach(doc => {
                const data = doc.data();
                const due = safeRound(data.totalDue || 0);
                const zone = data.zone || '';

                if (targetZone && !zone.toLowerCase().includes(targetZone.toLowerCase())) {
                    return;
                }

                if (due > 0) {
                    totalDueSum = safeRound(totalDueSum + due);
                    list.push({
                        id: doc.id,
                        accountNo: data.accountNo || '',
                        name: data.name || 'নামহীন',
                        phone: data.phone || '',
                        zone,
                        address: data.address || '',
                        totalDue: due
                    });
                }
            });

            list.sort((a, b) => b.totalDue - a.totalDue);
            const top = list.slice(0, limitCount);

            return {
                totalDebtorsCount: list.length,
                totalDueSum,
                topDebtors: top
            };
        } catch (err) {
            console.error('ERPBridge getTopDebtors error:', err);
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
    },

    /**
     * Alias for Dubai Audit to match function calling
     */
    async getDubaiWeeklyAuditSummary() {
        return await this.getLatestDubaiAudit();
    }
};

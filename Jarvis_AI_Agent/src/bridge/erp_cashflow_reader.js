import { db } from '../config.js';
import { collection, getDocs } from 'firebase/firestore';
import { safeRound, getTodayLocalDateString } from './erp_bridge.js';

/**
 * 💵 ERP Cashflow Reader — Net Operating Cashflow & Expense Spike Analysis
 */

/**
 * Get Net Operating Cashflow for a period
 * Answers: "এই মাসে খরচ বাদে আমাদের নিট কত ক্যাশ উদ্বৃত্ত রইলো?" / "এই মাসের নিট ক্যাশফ্লো কত?"
 */
export async function getMonthlyNetCashflow(days = 30) {
    try {
        const d = new Date();
        const endDate = getTodayLocalDateString();
        const startDateObj = new Date(d.getTime() - days * 24 * 60 * 60 * 1000);
        const startDate = startDateObj.toISOString().split('T')[0];

        const [txnsSnap, expensesSnap, banksSnap] = await Promise.all([
            getDocs(collection(db, 'transactions')),
            getDocs(collection(db, 'expenses')),
            getDocs(collection(db, 'bank_accounts'))
        ]);

        const activeBankNames = new Set();
        banksSnap.forEach(b => {
            const data = b.data();
            if (data.status !== 'inactive' && data.name) {
                activeBankNames.add(String(data.name).trim());
            }
        });

        let cashCollections = 0;
        let bankCollections = 0;
        let collectionCount = 0;

        txnsSnap.forEach(doc => {
            const t = doc.data();
            const date = t.date || '';
            if (date < startDate || date > endDate) return;

            const paid = Number(t.paid || 0);
            if (paid <= 0) return;

            const rType = String(t.receivedType || '').trim();
            const rFrom = String(t.receivedFrom || '').trim();

            if (rType === 'Less' || /less|ছাড়|discount|মওকুফ/i.test(rType)) return;

            const v = String(t.voucherNo || '').trim().toUpperCase();
            if (v === 'OPENING' || v === 'OPEN' || v === 'প্রারম্ভিক ব্যালেন্স' || v === 'প্রারম্ভিক জের') return;

            const isBank = rType === 'Bank' || activeBankNames.has(rFrom) || /bank/i.test(rType);

            if (isBank) {
                bankCollections = safeRound(bankCollections + paid);
            } else {
                cashCollections = safeRound(cashCollections + paid);
            }
            collectionCount += 1;
        });

        const totalInflows = safeRound(cashCollections + bankCollections);

        let totalExpenses = 0;
        let expenseCount = 0;
        let largestExpense = { amount: 0, category: '', description: '', date: '' };

        expensesSnap.forEach(doc => {
            const exp = doc.data();
            const date = exp.date || '';
            if (date < startDate || date > endDate) return;

            const amt = Number(exp.amount || 0);
            if (amt <= 0) return;

            totalExpenses = safeRound(totalExpenses + amt);
            expenseCount += 1;

            if (amt > largestExpense.amount) {
                largestExpense = {
                    amount: amt,
                    category: exp.category || 'সাধারণ খরচ',
                    description: exp.description || exp.title || '',
                    date
                };
            }
        });

        const netCashflow = safeRound(totalInflows - totalExpenses);
        const isSurplus = netCashflow >= 0;

        return {
            success: true,
            type: 'monthly_net_cashflow',
            days,
            startDate,
            endDate,
            cashCollections,
            bankCollections,
            totalInflows,
            collectionCount,
            totalExpenses,
            expenseCount,
            netCashflow,
            isSurplus,
            largestExpense
        };
    } catch (err) {
        console.error('[ERPCashflowReader] getMonthlyNetCashflow error:', err);
        return { success: false, error: err.message };
    }
}

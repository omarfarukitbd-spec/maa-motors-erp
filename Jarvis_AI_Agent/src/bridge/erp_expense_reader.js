import { db } from '../config.js';
import { collection, getDocs } from 'firebase/firestore';
import { safeRound, getTodayLocalDateString } from './erp_bridge.js';

/**
 * 💸 ERP Expense Reader — Category Breakdown & Cost Intelligence
 */

export async function getCategoryExpenseBreakdown(days = 30) {
    try {
        const snap = await getDocs(collection(db, 'expenses'));
        
        // Calculate date cutoff
        const now = new Date();
        const cutoffDate = new Date(now.getTime() - days * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

        const categoryMap = new Map();
        let totalExpenseSum = 0;
        let totalVouchersCount = 0;

        snap.forEach(doc => {
            const exp = doc.data();
            const date = exp.date || '';
            if (date < cutoffDate) return;

            const amt = Number(exp.amount || 0);
            if (isNaN(amt) || amt <= 0) return;

            const category = String(exp.category || 'অন্যান্য খরচ').trim() || 'অন্যান্য খরচ';
            totalExpenseSum = safeRound(totalExpenseSum + amt);
            totalVouchersCount += 1;

            let catData = categoryMap.get(category);
            if (!catData) {
                catData = { category, totalAmount: 0, count: 0, samples: [] };
                categoryMap.set(category, catData);
            }

            catData.totalAmount = safeRound(catData.totalAmount + amt);
            catData.count += 1;
            if (catData.samples.length < 3 && exp.description) {
                catData.samples.push(exp.description);
            }
        });

        const categoriesList = Array.from(categoryMap.values()).map(c => ({
            ...c,
            percentage: totalExpenseSum > 0 ? safeRound((c.totalAmount / totalExpenseSum) * 100) : 0
        })).sort((a, b) => b.totalAmount - a.totalAmount);

        return {
            success: true,
            type: 'category_expense_breakdown',
            days,
            startDate: cutoffDate,
            endDate: getTodayLocalDateString(),
            totalExpenseSum,
            totalVouchersCount,
            categoriesCount: categoriesList.length,
            categories: categoriesList,
            topCategory: categoriesList[0] || null
        };
    } catch (err) {
        console.error('[ERPExpenseReader] Error:', err);
        return { success: false, error: err.message };
    }
}

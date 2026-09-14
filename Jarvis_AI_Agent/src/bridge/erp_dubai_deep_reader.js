import { db } from '../config.js';
import { collection, getDocs, query, orderBy, limit } from 'firebase/firestore';

/**
 * 🇦🇪 ERP Dubai Deep Reader — Granular Overseas Procurement & Custodian Tracker
 * Strictly adheres to 100% Data Isolation & UAE Dirham (AED / د.إ) Currency standard.
 */

export async function getDubaiDeepCustodianHoldings() {
    try {
        const q = query(collection(db, 'dubai_weekly_audits'), orderBy('date', 'desc'), limit(1));
        const snap = await getDocs(q);

        if (snap.empty) {
            return {
                success: false,
                message: 'দুবাই সাপ্তাহিক অডিটের কোনো রেকর্ড পাওয়া যায়নি।'
            };
        }

        const doc = snap.docs[0];
        const d = doc.data();

        const auditDate = d.date || '';
        const cashInHand = Number(d.cashInHand || 0);
        const marketAdvance = Number(d.marketAdvance || 0);
        const messBalance = Number(d.messBalance || 0);
        const rawHoldings = Array.isArray(d.personalHoldings) ? d.personalHoldings : [];

        const personalHoldings = rawHoldings.map(h => ({
            name: String(h.name || 'অজ্ঞাত'),
            amount: Number(h.amount || 0)
        }));

        const holdingsTotal = personalHoldings.reduce((sum, h) => sum + h.amount, 0);
        const totalPhysicalAssets = Number(d.totalPhysicalAssets || (cashInHand + marketAdvance + messBalance + holdingsTotal));
        const calculatedCashBalance = Number(d.calculatedCashBalance || 0);
        const variance = Number(d.variance || (totalPhysicalAssets - calculatedCashBalance));

        return {
            success: true,
            type: 'dubai_deep_audit',
            auditDate,
            currency: 'AED',
            cashInHand,
            marketAdvance,
            messBalance,
            personalHoldings,
            holdingsTotal,
            totalPhysicalAssets,
            calculatedCashBalance,
            variance,
            isSurplus: variance >= 0
        };
    } catch (err) {
        console.error('[ERPDubaiDeepReader] Error:', err);
        return { success: false, error: err.message };
    }
}

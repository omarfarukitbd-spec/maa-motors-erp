import { db } from '../config.js';
import { collection, getDocs } from 'firebase/firestore';
import { safeRound, getTodayLocalDateString } from './erp_bridge.js';

/**
 * 📈 ERP Recovery Reader — Collection Efficiency & Advance Paying Customers
 */

/**
 * Get Collection Recovery Efficiency (% of sales collected)
 * Answers: "এই মাসে বিক্রির তুলনায় কত পারসেন্ট টাকা উঠেছে?" / "আমাদের কালেকশন রিকভারি রেট কেমন?"
 */
export async function getCollectionRecoveryEfficiency(days = 30) {
    try {
        const d = new Date();
        const endDate = getTodayLocalDateString();
        const startDateObj = new Date(d.getTime() - days * 24 * 60 * 60 * 1000);
        const startDate = startDateObj.toISOString().split('T')[0];

        const txnsSnap = await getDocs(collection(db, 'transactions'));
        let totalBilled = 0;
        let totalCollected = 0;
        let billCount = 0;
        let paymentCount = 0;

        txnsSnap.forEach(doc => {
            const t = doc.data();
            const date = t.date || '';
            if (date < startDate || date > endDate) return;

            const v = String(t.voucherNo || '').trim().toUpperCase();
            if (v === 'OPENING' || v === 'OPEN' || v === 'প্রারম্ভিক ব্যালেন্স' || v === 'প্রারম্ভিক জের') return;

            const bill = Number(t.bill || 0);
            const paid = Number(t.paid || 0);
            const rType = String(t.receivedType || '').trim();

            if (bill > 0) {
                totalBilled = safeRound(totalBilled + bill);
                billCount += 1;
            }

            // Exclude Less / Discount
            if (paid > 0 && rType !== 'Less' && !/less|ছাড়|discount|মওকুফ/i.test(rType)) {
                totalCollected = safeRound(totalCollected + paid);
                paymentCount += 1;
            }
        });

        const recoveryRate = totalBilled > 0 ? safeRound((totalCollected / totalBilled) * 100) : (totalCollected > 0 ? 100 : 0);
        const uncollectedGap = safeRound(totalBilled - totalCollected);

        return {
            success: true,
            type: 'recovery_efficiency',
            days,
            startDate,
            endDate,
            totalBilled,
            billCount,
            totalCollected,
            paymentCount,
            recoveryRate,
            uncollectedGap
        };
    } catch (err) {
        console.error('[ERPRecoveryReader] getCollectionRecoveryEfficiency error:', err);
        return { success: false, error: err.message };
    }
}

/**
 * Get Advance Paying Customers (Customers with credit/negative due balance)
 * Answers: "কাদের কাদের অতিরিক্ত টাকা অগ্রিম জমা আছে?" / "মার্কেটে মোট কত টাকা অগ্রিম জমা রয়েছে?"
 */
export async function getAdvancePayingCustomers(limitCount = 15) {
    try {
        const custSnap = await getDocs(collection(db, 'customers'));
        const advanceCustomers = [];
        let totalAdvanceSum = 0;

        custSnap.forEach(doc => {
            const c = doc.data();
            const due = Number(c.totalDue || 0);
            if (due < 0) {
                const advanceAmt = safeRound(Math.abs(due));
                totalAdvanceSum = safeRound(totalAdvanceSum + advanceAmt);
                advanceCustomers.push({
                    id: doc.id,
                    name: c.name || 'অজ্ঞাত',
                    phone: c.phone || '',
                    address: c.address || '',
                    zone: c.zone || '',
                    advanceAmount: advanceAmt
                });
            }
        });

        advanceCustomers.sort((a, b) => b.advanceAmount - a.advanceAmount);

        return {
            success: true,
            type: 'advance_customers',
            advanceCount: advanceCustomers.length,
            totalAdvanceSum,
            topAdvance: advanceCustomers.slice(0, limitCount)
        };
    } catch (err) {
        console.error('[ERPRecoveryReader] getAdvancePayingCustomers error:', err);
        return { success: false, error: err.message };
    }
}

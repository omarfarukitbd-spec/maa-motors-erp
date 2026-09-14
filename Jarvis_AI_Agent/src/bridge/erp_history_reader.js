import { db } from '../config.js';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { safeRound, getTodayLocalDateString } from './erp_bridge.js';

/**
 * 📅 ERP History Reader — Natural Relative Bengali Date Parser & Historical Lookups
 */

/**
 * Parses natural Bengali date expressions into YYYY-MM-DD
 */
export function parseRelativeBengaliDate(text) {
    if (!text) return null;
    const lower = text.toLowerCase();
    const today = new Date();

    // Convert Bengali numerals to ASCII
    const bengaliToAscii = str => str.replace(/[০-৯]/g, d => '০১২৩৪৫৬৭৮৯'.indexOf(d));
    const normalized = bengaliToAscii(lower);

    // 1. "আজকে" / "আজ"
    if (normalized.includes('আজকে') || normalized.includes('আজকের') || normalized.includes('আজ')) {
        return getTodayLocalDateString();
    }

    // 2. "গতকাল" / "কালকে" (past)
    if (normalized.includes('গতকাল') || normalized.includes('কালকের')) {
        const y = new Date(today.getTime() - 1 * 24 * 60 * 60 * 1000);
        return y.toISOString().split('T')[0];
    }

    // 3. "গত পরশু" / "পরশু"
    if (normalized.includes('পরশু')) {
        const p = new Date(today.getTime() - 2 * 24 * 60 * 60 * 1000);
        return p.toISOString().split('T')[0];
    }

    // 4. Weekdays in Bengali (গত রবিবার, গত সোমবার, ইত্যাদি)
    const weekdayMap = {
        'রবিবার': 0, 'রবি': 0,
        'সোমবার': 1, 'সোম': 1,
        'মঙ্গলবার': 2, 'মঙ্গল': 2,
        'বুধবার': 3, 'বুধ': 3,
        'বৃহস্পতিবার': 4, 'বৃহস্পতি': 4,
        'শুক্রবার': 5, 'শুক্র': 5,
        'শনিবার': 6, 'শনি': 6
    };

    for (const [dayName, targetDayNum] of Object.entries(weekdayMap)) {
        if (normalized.includes(dayName)) {
            const currentDayNum = today.getDay();
            let daysAgo = currentDayNum - targetDayNum;
            if (daysAgo <= 0) daysAgo += 7; // If today is Monday (1) and looking for Monday (1), daysAgo = 7 (last week)
            const targetDateObj = new Date(today.getTime() - daysAgo * 24 * 60 * 60 * 1000);
            return targetDateObj.toISOString().split('T')[0];
        }
    }

    // 5. Explicit Day of Month (যেমন: "১০ তারিখ", "২৫ তারিখ")
    const dateMatch = normalized.match(/(\d{1,2})\s*তারিখ/);
    if (dateMatch) {
        const targetDay = parseInt(dateMatch[1], 10);
        if (targetDay >= 1 && targetDay <= 31) {
            let year = today.getFullYear();
            let month = today.getMonth(); // 0-indexed
            // If targetDay is greater than current day of month, it refers to previous month
            if (targetDay > today.getDate()) {
                month -= 1;
                if (month < 0) {
                    month = 11;
                    year -= 1;
                }
            }
            const monthStr = String(month + 1).padStart(2, '0');
            const dayStr = String(targetDay).padStart(2, '0');
            return `${year}-${monthStr}-${dayStr}`;
        }
    }

    // 6. Direct YYYY-MM-DD
    const isoMatch = normalized.match(/(\d{4}-\d{2}-\d{2})/);
    if (isoMatch) return isoMatch[1];

    return null;
}

/**
 * Get Historical Date Full Summary (Sales, Collections, Expenses & Net)
 * Answers: "গত পরশু দিন কত কালেকশন হয়েছিল?" / "গত রবিবারে ব্যাংকে কত টাকা জমা পড়েছিল?"
 */
export async function getHistoricalDateSummary(targetDate) {
    if (!targetDate) return { success: false, message: 'নির্দিষ্ট তারিখ পাওয়া যায়নি।' };
    try {
        const txnsCol = collection(db, 'transactions');
        const q = query(txnsCol, where('date', '==', targetDate));

        const expCol = collection(db, 'expenses');
        const expQ = query(expCol, where('date', '==', targetDate));

        const [txnsSnap, expSnap, banksSnap] = await Promise.all([
            getDocs(q),
            getDocs(expQ),
            getDocs(collection(db, 'bank_accounts'))
        ]);

        const activeBankNames = new Set();
        banksSnap.forEach(b => {
            const data = b.data();
            if (data.status !== 'inactive' && data.name) {
                activeBankNames.add(String(data.name).trim());
            }
        });

        let totalBills = 0;
        let billCount = 0;
        let showroomCashCollections = 0;
        let bankCollections = 0;
        const customerPayments = [];

        txnsSnap.forEach(doc => {
            const t = doc.data();
            const bill = Number(t.bill || 0);
            const paid = Number(t.paid || 0);
            const rType = String(t.receivedType || '').trim();
            const rFrom = String(t.receivedFrom || '').trim();

            const v = String(t.voucherNo || '').trim().toUpperCase();
            if (v === 'OPENING' || v === 'OPEN' || v === 'প্রারম্ভিক ব্যালেন্স' || v === 'প্রারম্ভিক জের') return;

            if (bill > 0) {
                totalBills = safeRound(totalBills + bill);
                billCount += 1;
            }

            if (paid > 0 && rType !== 'Less' && !/less|ছাড়|discount|মওকুফ/i.test(rType)) {
                const isBank = rType === 'Bank' || activeBankNames.has(rFrom) || /bank/i.test(rType);
                if (isBank) {
                    bankCollections = safeRound(bankCollections + paid);
                } else {
                    showroomCashCollections = safeRound(showroomCashCollections + paid);
                }
                customerPayments.push({
                    customerName: t.customerName || 'অজানা কাস্টমার',
                    amount: paid,
                    channel: isBank ? (rFrom || 'ব্যাংক') : 'শোরুম ক্যাশ',
                    voucherNo: t.voucherNo || ''
                });
            }
        });

        const totalCollections = safeRound(showroomCashCollections + bankCollections);

        let totalExpenses = 0;
        let expenseCount = 0;
        expSnap.forEach(doc => {
            const exp = doc.data();
            const amt = Number(exp.amount || 0);
            if (amt > 0) {
                totalExpenses = safeRound(totalExpenses + amt);
                expenseCount += 1;
            }
        });

        const netCashflow = safeRound(totalCollections - totalExpenses);

        return {
            success: true,
            type: 'historical_date_summary',
            date: targetDate,
            totalBills,
            billCount,
            showroomCashCollections,
            bankCollections,
            totalCollections,
            paymentCount: customerPayments.length,
            customerPayments,
            totalExpenses,
            expenseCount,
            netCashflow
        };
    } catch (err) {
        console.error('[ERPHistoryReader] getHistoricalDateSummary error:', err);
        return { success: false, error: err.message };
    }
}

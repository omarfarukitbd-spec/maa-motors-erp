import { db, firebase } from '../firebase-config.js';

/**
 * Payroll & Monthly Expense DAO
 * Manages Firestore collection `monthly_payroll_sheets`
 */
export const PayrollDAO = new class {
    constructor() {
        this.collection = db.collection('monthly_payroll_sheets');
    }

    /**
     * Get payroll sheet document for a given month (YYYY-MM)
     * @param {string} monthYear e.g. "2026-10"
     */
    async getPayrollByMonth(monthYear) {
        if (!monthYear) return null;
        try {
            const doc = await this.collection.doc(monthYear).get();
            if (doc.exists) {
                return { id: doc.id, ...doc.data() };
            }
            return null;
        } catch (e) {
            console.error('PayrollDAO.getPayrollByMonth error:', e);
            throw e;
        }
    }

    /**
     * Save/Update payroll sheet document
     * @param {string} monthYear
     * @param {Object} data
     */
    async savePayroll(monthYear, data) {
        if (!monthYear) throw new Error('MonthYear is required');
        try {
            const payload = {
                ...data,
                monthYear,
                updatedAt: firebase.firestore.FieldValue.serverTimestamp()
            };
            await this.collection.doc(monthYear).set(payload, { merge: true });
            return true;
        } catch (e) {
            console.error('PayrollDAO.savePayroll error:', e);
            throw e;
        }
    }

    /**
     * Get all saved months list for history selector
     */
    async getAllSavedMonths() {
        try {
            const snap = await this.collection.orderBy('monthYear', 'desc').limit(24).get();
            const list = [];
            snap.forEach(doc => {
                list.push({ id: doc.id, ...doc.data() });
            });
            return list;
        } catch (e) {
            console.error('PayrollDAO.getAllSavedMonths error:', e);
            return [];
        }
    }

    /**
     * Default canonical template based on approved 6-section structure
     * @param {string} monthYear
     */
    getDefaultTemplate(monthYear = '2026-10') {
        return {
            monthYear,
            sheetTitle: 'মাসিক সামগ্রিক ব্যয় ও বেতন বিবরণী',
            status: 'draft',
            aedRate: 35,
            sections: [
                {
                    id: 'dubai',
                    title: '১. ডুবাই কর্মী বেতন ও বৈদেশিক খরচ (Dubai Operations)',
                    badgeColor: 'sky',
                    items: [
                        { id: 'd-1', sl: '১.১', name: 'হৃদয় (বেতন)', details: '৩০,০০০ টাকা – ১০,০০০ (কর্তন)', baseSalary: 30000, deduction: 10000, bonus: 0, amount: 20000, type: 'salary', status: 'pending', paymentMethod: 'Cash', paymentAccount: 'শোরুম ক্যাশ' },
                        { id: 'd-2', sl: '১.২', name: 'ফারুক (বেতন)', details: 'মাসিক নির্ধারিত বেতন', baseSalary: 25000, deduction: 0, bonus: 0, amount: 25000, type: 'salary', status: 'pending', paymentMethod: 'Cash', paymentAccount: 'শোরুম ক্যাশ' },
                        { id: 'd-3', sl: '১.৩', name: 'ফারুক ও হৃদয় রুম ভাড়া', details: '800 UED (@ ৩৫ টাকা)', foreignCurrency: 'AED', foreignAmount: 800, amount: 28000, type: 'expense', status: 'pending', paymentMethod: 'Dubai Fund', paymentAccount: 'দুবাই ক্যাশ' },
                        { id: 'd-4', sl: '১.৪', name: 'কন্টেনার লোডিং নং: ২', details: '4000 UED (@ ৩৫ টাকা)', foreignCurrency: 'AED', foreignAmount: 4000, amount: 140000, type: 'expense', status: 'pending', paymentMethod: 'Dubai Fund', paymentAccount: 'দুবাই ক্যাশ' }
                    ]
                },
                {
                    id: 'shop',
                    title: '২. রহমান টাওয়ার দোকান কর্মী বেতন ও অন্যান্য খরচ (Shop Expenses)',
                    badgeColor: 'cyan',
                    items: [
                        { id: 's-1', sl: '২.১', name: 'মেরাজ', details: 'দোকান কর্মী বেতন', baseSalary: 10000, deduction: 0, bonus: 0, amount: 10000, type: 'salary', status: 'pending', paymentMethod: 'Cash', paymentAccount: 'শোরুম ক্যাশ' },
                        { id: 's-2', sl: '২.২', name: 'আরাফাত', details: 'দোকান কর্মী বেতন', baseSalary: 8000, deduction: 0, bonus: 0, amount: 8000, type: 'salary', status: 'pending', paymentMethod: 'Cash', paymentAccount: 'শোরুম ক্যাশ' },
                        { id: 's-3', sl: '২.৩', name: 'আইয়ুব হুযুর', details: 'হাদিয়া / ধর্মীয় অনুদান', amount: 1000, type: 'expense', status: 'pending', paymentMethod: 'Cash', paymentAccount: 'শোরুম ক্যাশ' },
                        { id: 's-4', sl: '২.৪', name: 'দোকান ও গোডাউন ভাড়া', details: 'রহমান টাওয়ার দোকান ভাড়া', amount: 7700, type: 'expense', status: 'pending', paymentMethod: 'Bank', paymentAccount: 'ইসলামী ব্যাংক' }
                    ]
                },
                {
                    id: 'godown',
                    title: '৩. গোডাউন কর্মী বেতন ও গোডাউন ভাড়া (Godown Expenses)',
                    badgeColor: 'emerald',
                    items: [
                        { id: 'g-1', sl: '৩.১', name: 'রুবায়েত', details: 'গোডাউন কর্মী বেতন', baseSalary: 25000, deduction: 0, bonus: 0, amount: 25000, type: 'salary', status: 'pending', paymentMethod: 'Cash', paymentAccount: 'শোরুম ক্যাশ' },
                        { id: 'g-2', sl: '৩.২', name: 'ফারুক', details: 'গোডাউন কর্মী বেতন', baseSalary: 18000, deduction: 0, bonus: 0, amount: 18000, type: 'salary', status: 'pending', paymentMethod: 'Cash', paymentAccount: 'শোরুম ক্যাশ' },
                        { id: 'g-3', sl: '৩.৩', name: 'সামির', details: 'গোডাউন কর্মী বেতন', baseSalary: 7000, deduction: 0, bonus: 0, amount: 7000, type: 'salary', status: 'pending', paymentMethod: 'Cash', paymentAccount: 'শোরুম ক্যাশ' },
                        { id: 'g-4', sl: '৩.৪', name: 'নুরনবী', details: 'গোডাউন কর্মী বেতন', baseSalary: 10000, deduction: 0, bonus: 0, amount: 10000, type: 'salary', status: 'pending', paymentMethod: 'Cash', paymentAccount: 'শোরুম ক্যাশ' },
                        { id: 'g-5', sl: '৩.৫', name: 'গোডাউন ভাড়া', details: 'প্রধান গোডাউন মাসিক ভাড়া', amount: 50000, type: 'expense', status: 'pending', paymentMethod: 'Bank', paymentAccount: 'আল-আরাফাহ ব্যাংক' }
                    ]
                },
                {
                    id: 'home',
                    title: '৪. বাসার (নিজ বাড়ির খরচ) (House / Residence Expenses)',
                    badgeColor: 'purple',
                    items: [
                        { id: 'h-1', sl: '৪.১', name: 'কাশেম দাড়োয়ান', details: 'বাসার দারোয়ান বেতন', baseSalary: 14000, deduction: 0, bonus: 0, amount: 14000, type: 'salary', status: 'pending', paymentMethod: 'Cash', paymentAccount: 'শোরুম ক্যাশ' },
                        { id: 'h-2', sl: '৪.২', name: 'নাজমা', details: 'গৃহকর্মী বেতন', baseSalary: 5000, deduction: 0, bonus: 0, amount: 5000, type: 'salary', status: 'pending', paymentMethod: 'Cash', paymentAccount: 'শোরুম ক্যাশ' },
                        { id: 'h-3', sl: '৪.৩', name: 'ইফরাত স্যার', details: 'গৃহশিক্ষক বেতন', baseSalary: 6000, deduction: 0, bonus: 0, amount: 6000, type: 'salary', status: 'pending', paymentMethod: 'Cash', paymentAccount: 'শোরুম ক্যাশ' },
                        { id: 'h-4', sl: '৪.৪', name: 'ইশরাক স্যার', details: 'গৃহশিক্ষক বেতন', baseSalary: 6500, deduction: 0, bonus: 0, amount: 6500, type: 'salary', status: 'pending', paymentMethod: 'Cash', paymentAccount: 'শোরুম ক্যাশ' },
                        { id: 'h-5', sl: '৪.৫', name: 'ইশরাক কলেজ', details: 'কলেজ ফি ও খরচ', amount: 5000, type: 'expense', status: 'pending', paymentMethod: 'Cash', paymentAccount: 'শোরুম ক্যাশ' },
                        { id: 'h-6', sl: '৪.৬', name: 'ইফরাত স্কুল', details: 'স্কুল ফি ও খরচ', amount: 2500, type: 'expense', status: 'pending', paymentMethod: 'Cash', paymentAccount: 'শোরুম ক্যাশ' },
                        { id: 'h-7', sl: '৪.৭', name: 'গ্যাস বিল', details: 'বাসার গ্যাস বিল', amount: 2200, type: 'expense', status: 'pending', paymentMethod: 'Bank', paymentAccount: 'ইসলামী ব্যাংক' },
                        { id: 'h-8', sl: '৪.৮', name: 'বিদ্যুৎ বিল', details: 'বাসার বিদ্যুৎ বিল', amount: 30000, type: 'expense', status: 'pending', paymentMethod: 'Bank', paymentAccount: 'ইসলামী ব্যাংক' },
                        { id: 'h-9', sl: '৪.৯', name: 'ওয়াসা বিল', details: 'বাসার পানির বিল', amount: 1400, type: 'expense', status: 'pending', paymentMethod: 'Bank', paymentAccount: 'ইসলামী ব্যাংক' },
                        { id: 'h-10', sl: '৪.১০', name: 'লিফট সার্ভিস', details: 'মাসিক লিফট চার্জ', amount: 3000, type: 'expense', status: 'pending', paymentMethod: 'Cash', paymentAccount: 'শোরুম ক্যাশ' }
                    ]
                },
                {
                    id: 'new_home',
                    title: '৫. নতুন বাড়ির খরচ (New House Expenses)',
                    badgeColor: 'amber',
                    items: [
                        { id: 'nh-1', sl: '৫.১', name: 'টুনি', details: 'গৃহকর্মী / সহকারী বেতন', baseSalary: 3000, deduction: 0, bonus: 0, amount: 3000, type: 'salary', status: 'pending', paymentMethod: 'Cash', paymentAccount: 'শোরুম ক্যাশ' },
                        { id: 'nh-2', sl: '৫.২', name: 'ওয়াসা বিল (নতুন বাড়ি)', details: 'নতুন বাড়ির পানির বিল', amount: 1400, type: 'expense', status: 'pending', paymentMethod: 'Bank', paymentAccount: 'ইসলামী ব্যাংক' },
                        { id: 'nh-3', sl: '৫.৩', name: 'বিদ্যুৎ বিল (নতুন বাড়ি)', details: 'নতুন বাড়ির বিদ্যুৎ বিল', amount: 1200, type: 'expense', status: 'pending', paymentMethod: 'Bank', paymentAccount: 'ইসলামী ব্যাংক' },
                        { id: 'nh-4', sl: '৫.৪', name: 'গ্যাস বিল (নতুন বাড়ি)', details: 'নতুন বাড়ির গ্যাস বিল', amount: 6300, type: 'expense', status: 'pending', paymentMethod: 'Bank', paymentAccount: 'ইসলামী ব্যাংক' }
                    ]
                },
                {
                    id: 'other',
                    title: '৬. অন্যান্য খরচ (Other Expenses)',
                    badgeColor: 'rose',
                    items: [
                        { id: 'o-1', sl: '৬.১', name: 'ইকবালের মা', details: 'পারিবারিক অনুদান / সাহায্য', amount: 5000, type: 'expense', status: 'pending', paymentMethod: 'Cash', paymentAccount: 'শোরুম ক্যাশ' },
                        { id: 'o-2', sl: '৬.২', name: 'রুপার মা', details: 'পারিবারিক অনুদান / সাহায্য', amount: 5000, type: 'expense', status: 'pending', paymentMethod: 'Cash', paymentAccount: 'শোরুম ক্যাশ' },
                        { id: 'o-3', sl: '৬.৩', name: 'মেরাজের মা (লভ্যাংশ)', details: 'ব্যবসায়িক লভ্যাংশ প্রদান', amount: 20000, type: 'expense', status: 'pending', paymentMethod: 'Bank', paymentAccount: 'পূবালী ব্যাংক' },
                        { id: 'o-4', sl: '৬.৪', name: 'আইয়ুব সওদাগর নতুন গোডাউন ভাড়া', details: 'নতুন গোডাউন মাসিক ভাড়া', amount: 17500, type: 'expense', status: 'pending', paymentMethod: 'Bank', paymentAccount: 'ইসলামী ব্যাংক' }
                    ]
                }
            ]
        };
    }
}();

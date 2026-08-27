import { getCustomerCache } from '../customer/index.js';
import { formatAmountWithComma, formatAppDate, getTodayLocalDateString, safeRound, showToast } from '../utils.js';
import { sendSMS } from '../utils/messaging-service.js';

/**
 * Calculate Aging Buckets for all Due Customers
 */
export function calculateAgingDueData() {
    try {
        const customers = getCustomerCache() || [];
        const today = new Date();

        const dueCustomers = customers.filter(c => (Number(c.totalDue) || 0) > 0);

        const buckets = {
            tier0_30: { label: '০ - ৩০ দিন (স্বাভাবিক)', color: 'emerald', count: 0, totalDue: 0, list: [] },
            tier31_60: { label: '৩১ - ৬০ দিন (সতর্কতা)', color: 'amber', count: 0, totalDue: 0, list: [] },
            tier61_90: { label: '৬১ - ৯০ দিন (উচ্চ ঝুঁকি)', color: 'orange', count: 0, totalDue: 0, list: [] },
            tier90_plus: { label: '৯০+ দিন (ডেড বকেয়া)', color: 'rose', count: 0, totalDue: 0, list: [] }
        };

        let grandTotalDue = 0;

        dueCustomers.forEach(c => {
            const due = Number(c.totalDue) || 0;
            grandTotalDue = safeRound(grandTotalDue + due);

            // Safe parsing of last activity date
            let dateStr = '2026-01-01';
            if (typeof c.lastTxnDate === 'string' && c.lastTxnDate) {
                dateStr = c.lastTxnDate;
            } else if (typeof c.openingDate === 'string' && c.openingDate) {
                dateStr = c.openingDate;
            } else if (c.updatedAt) {
                if (typeof c.updatedAt === 'string') dateStr = c.updatedAt.split('T')[0];
                else if (c.updatedAt.toDate) dateStr = c.updatedAt.toDate().toISOString().split('T')[0];
            } else if (c.createdAt) {
                if (typeof c.createdAt === 'string') dateStr = c.createdAt.split('T')[0];
                else if (c.createdAt.toDate) dateStr = c.createdAt.toDate().toISOString().split('T')[0];
            }

            const lastDate = new Date(dateStr);
            const diffDays = isNaN(lastDate.getTime()) ? 0 : Math.max(0, Math.floor((today - lastDate) / (1000 * 60 * 60 * 24)));

            const record = {
                id: c.id,
                accountNo: c.accountNo || '-',
                name: c.name || 'Unknown',
                phone: c.phone || '-',
                zone: c.zone || '-',
                totalDue: due,
                inactiveDays: diffDays,
                lastDate: dateStr
            };

            if (diffDays <= 30) {
                buckets.tier0_30.count++;
                buckets.tier0_30.totalDue = safeRound(buckets.tier0_30.totalDue + due);
                buckets.tier0_30.list.push(record);
            } else if (diffDays <= 60) {
                buckets.tier31_60.count++;
                buckets.tier31_60.totalDue = safeRound(buckets.tier31_60.totalDue + due);
                buckets.tier31_60.list.push(record);
            } else if (diffDays <= 90) {
                buckets.tier61_90.count++;
                buckets.tier61_90.totalDue = safeRound(buckets.tier61_90.totalDue + due);
                buckets.tier61_90.list.push(record);
            } else {
                buckets.tier90_plus.count++;
                buckets.tier90_plus.totalDue = safeRound(buckets.tier90_plus.totalDue + due);
                buckets.tier90_plus.list.push(record);
            }
        });

        // Sort lists highest due first
        Object.values(buckets).forEach(b => {
            b.list.sort((x, y) => y.totalDue - x.totalDue);
        });

        return { buckets, grandTotalDue, totalDueCustomers: dueCustomers.length };
    } catch (err) {
        console.error('Error in calculateAgingDueData:', err);
        return {
            buckets: {
                tier0_30: { label: '০ - ৩০ দিন (স্বাভাবিক)', color: 'emerald', count: 0, totalDue: 0, list: [] },
                tier31_60: { label: '৩১ - ৬০ দিন (সতর্কতা)', color: 'amber', count: 0, totalDue: 0, list: [] },
                tier61_90: { label: '৬১ - ৯০ দিন (উচ্চ ঝুঁকি)', color: 'orange', count: 0, totalDue: 0, list: [] },
                tier90_plus: { label: '৯০+ দিন (ডেড বকেয়া)', color: 'rose', count: 0, totalDue: 0, list: [] }
            },
            grandTotalDue: 0,
            totalDueCustomers: 0
        };
    }
}

/**
 * Send WhatsApp Due Reminder to an Aging Customer
 */
export function sendAgingCustomerWhatsApp(name, phone, due) {
    if (!phone || phone === '-' || phone.length < 6) {
        return showToast(`"${name}"-এর কোনো সঠিক মোবাইল নম্বর পাওয়া যায়নি!`, 'warning', 'WhatsApp তাগাদা');
    }

    let cleanPhone = String(phone).replace(/[^0-9]/g, '');
    if (cleanPhone.startsWith('01') && cleanPhone.length === 11) cleanPhone = '88' + cleanPhone;

    const text = `শ্রদ্ধেয় ${name},\nমা মোটরস থেকে বিনীত অনুরোধ, আপনার বর্তমান মোট বকেয়া ৳ ${formatAmountWithComma(due)} টাকা। অনুগ্রহ করে দ্রুত হিসাবটি পরিশোধ করে সহায়তা করবেন। ধন্যবাদ।`;
    const url = `https://api.whatsapp.com/send?phone=${cleanPhone}&text=${encodeURIComponent(text)}`;
    window.open(url, '_blank');
    showToast(`"${name}"-এর জন্য WhatsApp ওপেন হচ্ছে...`, 'success', 'WhatsApp');
}

/**
 * Send SMS Due Reminder to an Aging Customer
 */
export async function sendAgingCustomerSMS(name, phone, due) {
    if (!phone || phone === '-' || phone.length < 11) {
        return showToast(`"${name}"-এর ১১ ডিজিটের সঠিক মোবাইল নম্বর পাওয়া যায়নি!`, 'warning', 'SMS তাগাদা');
    }
    const text = `Sroddheo ${name}, Maa Motors e apnar mot bokea Tk ${formatAmountWithComma(due)}. Onugroho kore jomadan. Dhonnobad.`;
    showToast(`"${name}"-কে SMS পাঠানো হচ্ছে...`, 'info', 'SMS তাগাদা');
    const res = await sendSMS(phone, text, false);
    if (res && res.success) {
        showToast(`"${name}"-কে SMS সফলভাবে পাঠানো হয়েছে!`, 'success', 'SMS তাগাদা');
    } else {
        showToast(`SMS পাঠানো সম্ভব হয়নি!`, 'error', 'SMS তাগাদা');
    }
}

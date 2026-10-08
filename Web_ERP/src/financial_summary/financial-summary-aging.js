import { getCustomerCache } from '../customer/index.js';
import { TransactionDAO } from '../dao.js';
import { formatAmountWithComma, formatAppDate, getTodayLocalDateString, toDBDate, safeRound, showToast } from '../utils.js';
import { sendSMS } from '../utils/messaging-service.js';

let _customerActivityMap = null;

/**
 * Invalidate in-memory activity cache when new transactions occur
 */
export function invalidateAgingActivityCache() {
    _customerActivityMap = null;
}
if (typeof window !== 'undefined') {
    window.invalidateAgingActivityCache = invalidateAgingActivityCache;
}

/**
 * Fetch and construct Customer Activity Map directly from Transactions Collection
 * Maps each customerId -> { latestTxnDate, latestPaymentDate, latestPaymentAmount }
 */
export async function buildCustomerActivityMap(forceRefresh = false) {
    if (_customerActivityMap && !forceRefresh) {
        return _customerActivityMap;
    }

    const activityMap = {};

    try {
        const snap = await TransactionDAO.collection.get();
        snap.forEach(doc => {
            const t = doc.data();
            const cid = t.customerId;
            if (!cid) return;

            const v = String(t.voucherNo || '').trim().toUpperCase();
            const isOpening = (v === 'OPENING' || v === 'OPEN' || v === 'প্রারম্ভিক ব্যালেন্স' || v === 'প্রারম্ভিক জের');
            if (isOpening) return;

            let tDate = '';
            if (typeof t.date === 'string' && t.date) {
                tDate = toDBDate(t.date.trim());
            } else if (t.createdAt) {
                if (t.createdAt.toDate) tDate = t.createdAt.toDate().toISOString().split('T')[0];
                else if (typeof t.createdAt === 'string') tDate = t.createdAt.split('T')[0];
            }
            if (!tDate) return;

            const paid = Number(t.paid) || 0;
            const bill = Number(t.bill) || 0;

            if (!activityMap[cid]) {
                activityMap[cid] = {
                    latestTxnDate: '',
                    latestPaymentDate: '',
                    latestPaymentAmount: 0
                };
            }

            const act = activityMap[cid];

            // 1. Track latest overall transaction date (bill or payment)
            if (!act.latestTxnDate || tDate > act.latestTxnDate) {
                act.latestTxnDate = tDate;
            }

            // 2. Track latest cash / bank payment date & amount
            if (paid > 0) {
                if (!act.latestPaymentDate || tDate > act.latestPaymentDate) {
                    act.latestPaymentDate = tDate;
                    act.latestPaymentAmount = paid;
                } else if (tDate === act.latestPaymentDate) {
                    act.latestPaymentAmount = Math.max(act.latestPaymentAmount, paid);
                }
            }
        });

        _customerActivityMap = activityMap;
    } catch (err) {
        console.error('Failed to load transaction activity map:', err);
        _customerActivityMap = _customerActivityMap || {};
    }

    return _customerActivityMap;
}

/**
 * Calculate accurate calendar days elapsed between targetDate and today
 */
export function calculateElapsedDays(targetDateStr, todayStr) {
    if (!targetDateStr) return 0;
    try {
        const cleanTarget = toDBDate(targetDateStr);
        const [y1, m1, d1] = cleanTarget.split('-').map(Number);
        const [y2, m2, d2] = todayStr.split('-').map(Number);
        const utc1 = Date.UTC(y1, m1 - 1, d1);
        const utc2 = Date.UTC(y2, m2 - 1, d2);
        const diffMs = utc2 - utc1;
        return Math.max(0, Math.floor(diffMs / (1000 * 60 * 60 * 24)));
    } catch (e) {
        console.error('Error calculating elapsed days:', e);
        return 0;
    }
}

/**
 * Calculate Aging Buckets for all Due Customers connected to Transaction & Payment History
 */
export async function calculateAgingDueData(forceRefresh = false) {
    try {
        const [customers, activityMap] = await Promise.all([
            Promise.resolve(getCustomerCache() || []),
            buildCustomerActivityMap(forceRefresh)
        ]);

        const todayStr = getTodayLocalDateString();
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

            const act = (activityMap && activityMap[c.id]) ? activityMap[c.id] : {};
            const lastPaymentDate = act.latestPaymentDate || (typeof c.lastPaymentDate === 'string' && c.lastPaymentDate ? c.lastPaymentDate : null);
            const lastPaymentAmount = act.latestPaymentAmount || (Number(c.lastPaymentAmount) || 0);
            const lastTxnDate = act.latestTxnDate || (typeof c.lastTxnDate === 'string' && c.lastTxnDate ? c.lastTxnDate : null);

            // Ground Truth Recency Law:
            // Priority 1: Latest cash / bank payment date (যদি কাস্টমার কখনো ক্যাশ জমা দিয়ে থাকে)
            // Priority 2: Latest transaction date (যদি কোনো জমা না থাকে কিন্তু বিল/চালান থাকে)
            // Priority 3: Account opening date / creation date (শুধুমাত্র যদি কোনো ট্রানজ্যাকশন রেকর্ডই না থাকে)
            let effectiveDate = '';
            let dateSource = 'none';

            if (lastPaymentDate) {
                effectiveDate = lastPaymentDate;
                dateSource = 'payment';
            } else if (lastTxnDate) {
                effectiveDate = lastTxnDate;
                dateSource = 'txn';
            } else if (typeof c.openingDate === 'string' && c.openingDate) {
                effectiveDate = c.openingDate;
                dateSource = 'opening';
            } else if (c.createdAt) {
                if (typeof c.createdAt === 'string') effectiveDate = c.createdAt.split('T')[0];
                else if (c.createdAt.toDate) effectiveDate = c.createdAt.toDate().toISOString().split('T')[0];
                dateSource = 'created';
            } else {
                effectiveDate = todayStr;
                dateSource = 'today';
            }

            const diffDays = calculateElapsedDays(effectiveDate, todayStr);

            const record = {
                id: c.id,
                accountNo: c.accountNo || '-',
                name: c.name || 'Unknown',
                phone: c.phone || '-',
                zone: c.zone || '-',
                totalDue: due,
                inactiveDays: diffDays,
                effectiveDate,
                lastPaymentDate,
                lastPaymentAmount,
                lastTxnDate,
                dateSource
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

/**
 * google-contact-groups.js
 * গুগল কন্টাক্টস স্মার্ট লেবেল (Contact Groups) ইঞ্জিন
 * ৪টি স্মার্ট লেবেল:
 * ১. M/S. MAA-MOTOR'S (সকল ERP কাস্টমার)
 * ২. MAA MOTORS - ১৫+ দিন বকেয়া (১৫-২৯ দিন ধরে জমা নেই)
 * ৩. MAA MOTORS - ৩০+ দিন বকেয়া (৩০-৫৯ দিন ধরে জমা নেই)
 * ৪. MAA MOTORS - হাই রিস্ক বকেয়া (৬০+ দিন বা কখনই জমা দেয়নি)
 */

import { CustomerDAO, TransactionDAO } from '../dao.js';
import { getCustomerCache } from './customer-state.js';
import { showToast, toDBDate } from '../utils.js';
import { getAllSilentAccessTokens } from './google-auth-client.js';
import {
    parsePhoneNumbers,
    normalizeBengaliNumbers,
    isDummyPhoneNumber
} from './customer-contact-export-helpers.js';
import {
    fetchWithRetry,
    calculateCallIntelligence
} from './google-contact-sync-service.js';

export const SMART_LABEL_NAMES = {
    MASTER: "M/S. MAA-MOTOR'S",
    REGULAR: "MAA MOTORS - নিয়মিত পেমেন্ট",
    LATE_15: "MAA MOTORS - ১৫+ দিন বকেয়া",
    LATE_30: "MAA MOTORS - ৩০+ দিন বকেয়া",
    HIGH_RISK: "MAA MOTORS - হাই রিস্ক বকেয়া",
    CLEARED: "MAA MOTORS - পরিশোধিত"
};

let isGroupSyncing = false;

/**
 * গুগলে স্মার্ট লেবেলগুলো বিদ্যমান থাকা নিশ্চিত করে এবং তাদের resourceName রিটার্ন করে
 * @param {string} accessToken
 * @returns {Promise<Object>} { MASTER, REGULAR, LATE_15, LATE_30, HIGH_RISK, CLEARED } resourceNames
 */
export async function ensureGoogleContactGroups(accessToken) {
    if (!accessToken) throw new Error('অ্যাক্সেস টোকেন প্রয়োজন');

    const gUrl = 'https://people.googleapis.com/v1/contactGroups';
    const gRes = await fetchWithRetry(gUrl, {
        headers: { Authorization: `Bearer ${accessToken}` }
    });

    if (!gRes || !gRes.ok) {
        throw new Error('গুগল কন্টাক্ট গ্রুপ তালিকা পাওয়া যায়নি');
    }

    const gData = await gRes.json();
    const existingMap = new Map();
    (gData.contactGroups || []).forEach(g => {
        if (g.name) existingMap.set(g.name, g.resourceName);
    });

    // অপ্রয়োজনীয় পুরোনো বা খালি লেবেল (যেমন Maa Motors Customers) স্বয়ংক্রিয়ভাবে মুছে ফেলা
    const oldDeprecateNames = ['Maa Motors Customers'];
    for (const oldName of oldDeprecateNames) {
        if (existingMap.has(oldName)) {
            const oldResName = existingMap.get(oldName);
            try {
                await fetchWithRetry(`https://people.googleapis.com/v1/${oldResName}?deleteContacts=false`, {
                    method: 'DELETE',
                    headers: { Authorization: `Bearer ${accessToken}` }
                });
                existingMap.delete(oldName);
            } catch (delErr) {
                console.error('Old group delete error:', delErr);
            }
        }
    }

    const result = {};

    for (const [key, labelName] of Object.entries(SMART_LABEL_NAMES)) {
        if (existingMap.has(labelName)) {
            result[key] = existingMap.get(labelName);
        } else {
            const createRes = await fetchWithRetry(gUrl, {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ contactGroup: { name: labelName } })
            });

            if (createRes && createRes.ok) {
                const createdData = await createRes.json();
                result[key] = createdData.resourceName;
            } else {
                console.error(`Group creation failed for ${labelName}`);
            }
        }
    }

    return result;
}

/**
 * নির্দিষ্ট কন্টাক্ট গ্রুপের বর্তমান মেম্বারদের resourceNames সংগ্রহ করে
 * @param {string} groupResourceName
 * @param {string} accessToken
 * @returns {Promise<Array<string>>}
 */
export async function getGroupMemberResourceNames(groupResourceName, accessToken) {
    if (!groupResourceName || !accessToken) return [];
    try {
        const url = `https://people.googleapis.com/v1/${groupResourceName}?maxMembers=1000`;
        const res = await fetchWithRetry(url, {
            headers: { Authorization: `Bearer ${accessToken}` }
        });
        if (res && res.ok) {
            const data = await res.json();
            return data.memberResourceNames || [];
        }
        return [];
    } catch (e) {
        console.error('getGroupMemberResourceNames error:', e);
        return [];
    }
}

/**
 * গুগল কন্টাক্ট গ্রুপে সদস্যদের ব্যাচ মডিফাই (যোগ / বিয়োগ) করে
 * @param {string} groupResourceName
 * @param {Array<string>} toAdd
 * @param {Array<string>} toRemove
 * @param {string} accessToken
 */
export async function modifyGroupMembers(groupResourceName, toAdd = [], toRemove = [], accessToken) {
    if (!groupResourceName || !accessToken) return false;
    if (toAdd.length === 0 && toRemove.length === 0) return true;

    try {
        const url = `https://people.googleapis.com/v1/${groupResourceName}/members:modify`;
        const payload = {};
        if (toAdd.length > 0) payload.resourceNamesToAdd = toAdd;
        if (toRemove.length > 0) payload.resourceNamesToRemove = toRemove;

        const res = await fetchWithRetry(url, {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${accessToken}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload)
        });

        return res && res.ok;
    } catch (e) {
        console.error('modifyGroupMembers error:', e);
        return false;
    }
}

/**
 * সকল কানেক্টেড ডিভাইসে ৪টি স্মার্ট লেবেল সিঙ্ক ও ডায়নামিক মেম্বারশিপ রিকনসিলিয়েশন ইঞ্জিন
 * @param {Function} onProgress
 * @param {Array|null} targetAccountIds
 * @returns {Promise<Object>}
 */
export async function executeSmartLabelSync(onProgress, targetAccountIds = null) {
    if (isGroupSyncing) {
        showToast('ইতিমধ্যে একটি লেবেল সিঙ্ক প্রসেস চলমান রয়েছে', 'warning');
        return { success: false, message: 'Already syncing' };
    }

    let activeTokens = await getAllSilentAccessTokens();
    if (activeTokens.length === 0) {
        throw new Error('কোনো সচল গুগল অ্যাকাউন্ট পাওয়া যায়নি।');
    }

    if (Array.isArray(targetAccountIds) && targetAccountIds.length > 0) {
        activeTokens = activeTokens.filter(acc => targetAccountIds.includes(acc.id));
        if (activeTokens.length === 0) {
            throw new Error('নির্বাচিত অ্যাকাউন্টের কোনো সচল কানেকশন পাওয়া যায়নি।');
        }
    }

    isGroupSyncing = true;

    try {
        if (onProgress) {
            onProgress({
                percent: 10,
                text: 'কাস্টমার ও লেনদেন তথ্য সংগ্রহ করা হচ্ছে...'
            });
        }

        let customers = getCustomerCache();
        if (!customers || customers.length === 0) {
            const snap = await CustomerDAO.collection.get();
            customers = [];
            snap.forEach(doc => customers.push({ id: doc.id, ...doc.data() }));
        }

        const validCustomers = customers.filter(c => {
            const phones = parsePhoneNumbers(c.phone);
            return phones.length > 0 && phones.some(p => {
                const digits = p.replace(/\D/g, '');
                return digits.length >= 10 && !isDummyPhoneNumber(digits);
            });
        });

        // লেনদেন ডাটা একবারে ফেচ (০ N+1 কুয়েরি)
        const txnsByCustomer = new Map();
        try {
            const allTxns = await TransactionDAO.getAll();
            allTxns.forEach(t => {
                if (!txnsByCustomer.has(t.customerId)) txnsByCustomer.set(t.customerId, []);
                txnsByCustomer.get(t.customerId).push(t);
            });
        } catch (txnErr) {
            console.warn('Transactions prefetch warning:', txnErr);
        }

        const stats = {
            master: 0,
            regular: 0,
            late15: 0,
            late30: 0,
            highRisk: 0,
            cleared: 0
        };

        const TODAY = new Date();
        const todayDateOnly = new Date(TODAY.getFullYear(), TODAY.getMonth(), TODAY.getDate());

        for (const acc of activeTokens) {
            if (onProgress) {
                onProgress({
                    percent: 25,
                    text: `ডিভাইস [${acc.label}]-এর কন্টাক্ট ও লেবেল লোড হচ্ছে...`
                });
            }

            // ১. গুগল থেকে কন্টাক্ট তালিকা ফেচ করে ইন-মেমোরি ফোন ম্যাপ তৈরি
            const googleContacts = [];
            let nextPageToken = '';
            do {
                const url = `https://people.googleapis.com/v1/people/me/connections?personFields=names,phoneNumbers&pageSize=1000${nextPageToken ? `&pageToken=${nextPageToken}` : ''}`;
                const res = await fetchWithRetry(url, { headers: { Authorization: `Bearer ${acc.accessToken}` } });
                if (!res.ok) break;
                const data = await res.json();
                if (data.connections) googleContacts.push(...data.connections);
                nextPageToken = data.nextPageToken || '';
            } while (nextPageToken);

            const phoneMap = new Map();
            googleContacts.forEach(gc => {
                if (gc.phoneNumbers) {
                    gc.phoneNumbers.forEach(pn => {
                        const clean = normalizeBengaliNumbers(pn.value).replace(/\D/g, '');
                        if (clean.length >= 10) {
                            phoneMap.set(clean.slice(-10), gc.resourceName);
                        }
                    });
                }
            });

            // ২. কাস্টমারদের ক্যাটাগরাইজেশন
            const masterList = [];
            const regularList = [];
            const late15List = [];
            const late30List = [];
            const highRiskList = [];
            const clearedList = [];

            for (const cust of validCustomers) {
                const phones = parsePhoneNumbers(cust.phone);
                let matchedResourceName = null;
                for (const p of phones) {
                    const digits = p.replace(/\D/g, '');
                    if (digits.length >= 10 && phoneMap.has(digits.slice(-10))) {
                        matchedResourceName = phoneMap.get(digits.slice(-10));
                        break;
                    }
                }

                if (!matchedResourceName) continue;

                masterList.push(matchedResourceName);

                const totalDue = Number(cust.totalDue) || 0;
                if (totalDue <= 0) {
                    // কোনো বকেয়া নেই (পরিশোধিত)
                    clearedList.push(matchedResourceName);
                } else {
                    const custTxns = txnsByCustomer.get(cust.id) || [];
                    calculateCallIntelligence(custTxns, totalDue);

                    // দিন পার্থক্য হিসাব
                    let diffDays = null;
                    const payments = custTxns.filter(t => Number(t.paid) > 0);
                    if (payments.length > 0) {
                        const sortedPayments = [...payments].sort((a, b) => toDBDate(b.date || '').localeCompare(toDBDate(a.date || '')));
                        const latestP = sortedPayments[0];
                        if (latestP && latestP.date) {
                            try {
                                const iso = toDBDate(latestP.date);
                                const [y, m, d] = iso.split('-').map(Number);
                                const payDate = new Date(y, m - 1, d);
                                diffDays = Math.max(0, Math.floor((todayDateOnly.getTime() - payDate.getTime()) / (1000 * 60 * 60 * 24)));
                            } catch (pErr) {
                                console.error('Date parse error:', pErr);
                            }
                        }
                    }

                    if (diffDays === null || diffDays >= 60) {
                        highRiskList.push(matchedResourceName);
                    } else if (diffDays >= 30) {
                        late30List.push(matchedResourceName);
                    } else if (diffDays >= 15) {
                        late15List.push(matchedResourceName);
                    } else {
                        // ০ থেকে ১৪ দিন: প্রতি সপ্তাহে বা নিয়মিত পেমেন্ট দেওয়া নির্ভরযোগ্য কাস্টমার
                        regularList.push(matchedResourceName);
                    }
                }
            }

            if (onProgress) {
                onProgress({
                    percent: 50,
                    text: `ডিভাইস [${acc.label}]-এ ৬টি স্মার্ট লেবেল তৈরি/যাচাই করা হচ্ছে...`
                });
            }

            // ৩. ৬টি স্মার্ট লেবেল নিশ্চিত করা
            const groupMap = await ensureGoogleContactGroups(acc.accessToken);

            // ৪. প্রতিটি লেবেলের মেম্বারশিপ আপডেট করা
            const groupTasks = [
                { key: 'MASTER', name: SMART_LABEL_NAMES.MASTER, targetList: masterList },
                { key: 'REGULAR', name: SMART_LABEL_NAMES.REGULAR, targetList: regularList },
                { key: 'LATE_15', name: SMART_LABEL_NAMES.LATE_15, targetList: late15List },
                { key: 'LATE_30', name: SMART_LABEL_NAMES.LATE_30, targetList: late30List },
                { key: 'HIGH_RISK', name: SMART_LABEL_NAMES.HIGH_RISK, targetList: highRiskList },
                { key: 'CLEARED', name: SMART_LABEL_NAMES.CLEARED, targetList: clearedList }
            ];

            let step = 0;
            for (const task of groupTasks) {
                step++;
                const gResName = groupMap[task.key];
                if (!gResName) continue;

                if (onProgress) {
                    const pct = Math.round(50 + (step / groupTasks.length) * 45);
                    onProgress({
                        percent: pct,
                        text: `লেবেল [${task.name}] সিঙ্ক হচ্ছে (${task.targetList.length} জন)...`
                    });
                }

                const currentMembers = await getGroupMemberResourceNames(gResName, acc.accessToken);
                const toAdd = task.targetList.filter(r => !currentMembers.includes(r));
                // মাস্টার গ্রুপ থেকে মেম্বার রিমুভ করব না, কিন্তু ডায়নামিক গ্রুপে (নিয়মিত, ১৫+, ৩০+, হাই রিস্ক, পরিশোধিত) আগের অনুপযুক্ত মেম্বার রিমুভ করব
                const toRemove = task.key === 'MASTER' ? [] : currentMembers.filter(r => !task.targetList.includes(r));

                await modifyGroupMembers(gResName, toAdd, toRemove, acc.accessToken);
            }

            stats.master = masterList.length;
            stats.regular = regularList.length;
            stats.late15 = late15List.length;
            stats.late30 = late30List.length;
            stats.highRisk = highRiskList.length;
            stats.cleared = clearedList.length;
        }

        if (onProgress) {
            onProgress({
                percent: 100,
                text: 'স্মার্ট লেবেল সিঙ্ক সম্পন্ন হয়েছে!'
            });
        }

        localStorage.setItem('mm_last_smart_label_sync_date', new Date().toISOString().slice(0, 10));

        return {
            success: true,
            stats,
            deviceCount: activeTokens.length
        };

    } finally {
        isGroupSyncing = false;
    }
}

/**
 * প্রতিদিন প্রথমবার অ্যাপ খোলার পর ব্যাকগ্রাউন্ডে সাইলেন্ট অটো-সিঙ্ক এক্সিকিউট করে
 */
export async function initDailyAutoLabelSync() {
    try {
        const todayStr = new Date().toISOString().slice(0, 10);
        const lastSync = localStorage.getItem('mm_last_smart_label_sync_date');
        if (lastSync === todayStr) {
            return;
        }

        setTimeout(async () => {
            try {
                const res = await executeSmartLabelSync(null);
                if (res && res.success) {
                    localStorage.setItem('mm_last_smart_label_sync_date', todayStr);
                    console.log('[Auto Sync] দৈনিক স্মার্ট লেবেল সফলভাবে আপডেট হয়েছে:', res.stats);
                }
            } catch (err) {
                console.warn('Daily auto label sync background notice:', err);
            }
        }, 5000);
    } catch (e) {
        console.warn('initDailyAutoLabelSync error:', e);
    }
}

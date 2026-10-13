// ALLOW_LARGE_FILE: Google Contact Sync Service Engine
import { db } from '../firebase-config.js';
import { CustomerDAO, TransactionDAO } from '../dao.js';
import { getCustomerCache } from './customer-state.js';
import { formatAmountWithComma, formatAppDate, showToast, toDBDate } from '../utils.js';
import { generateBossToken } from './boss-card-token.js';
import { parsePhoneNumbers, normalizeBengaliNumbers, buildContactDisplayName, updatePersonalContactNameWithDue } from './customer-contact-export-helpers.js';
import { getAllSilentAccessTokens, updateAccountSyncTimestamp } from './google-auth-client.js';
import { generateCustomerBadgeBase64, generateCustomerBadgeDataUrl } from './contact-badge-canvas.js';

let isSyncingInBackground = false;

/**
 * এক্সপোনেনশিয়াল ব্যাকঅফ ও জিটার সহ গুগল এপিআই কল করার নিরাপদ ফাংশন
 */
async function fetchWithRetry(url, options = {}, maxRetries = 3) {
    for (let attempt = 0; attempt <= maxRetries; attempt++) {
        try {
            const res = await fetch(url, options);
            // 429 Too Many Requests বা 503 Service Unavailable হলে ব্যাকঅফ রিট্রাই
            if ((res.status === 429 || res.status >= 500) && attempt < maxRetries) {
                const backoffMs = Math.pow(2, attempt) * 500 + Math.floor(Math.random() * 200);
                await new Promise(r => setTimeout(r, backoffMs));
                continue;
            }
            return res;
        } catch (netErr) {
            if (attempt >= maxRetries) throw netErr;
            const backoffMs = Math.pow(2, attempt) * 500 + Math.floor(Math.random() * 200);
            await new Promise(r => setTimeout(r, backoffMs));
        }
    }
}

/**
 * ফায়ারস্টোর থেকে শেষ সিঙ্কের সময় কাস্টমারদের বকেয়ার ম্যাপ লোড করে
 */
export async function getLastSyncedDueMap() {
    try {
        const snap = await db.collection('settings').doc('google_sync').get();
        if (snap.exists && snap.data()?.lastSyncedDueMap) {
            return snap.data().lastSyncedDueMap;
        }
        return {};
    } catch (e) {
        console.error('getLastSyncedDueMap error:', e);
        return {};
    }
}

/**
 * ফায়ারস্টোরে কাস্টমারদের সর্বশেষ সিঙ্ককৃত বকেয়া আপডেট করে
 */
export async function updateSyncedDueForCustomers(customerDueUpdates = {}) {
    if (!customerDueUpdates || Object.keys(customerDueUpdates).length === 0) return;
    try {
        const snap = await db.collection('settings').doc('google_sync').get();
        const existing = (snap.exists && snap.data()?.lastSyncedDueMap) ? snap.data().lastSyncedDueMap : {};
        const merged = { ...existing, ...customerDueUpdates };
        await db.collection('settings').doc('google_sync').set({
            lastSyncedDueMap: merged,
            lastSyncAt: new Date().toISOString()
        }, { merge: true });
    } catch (e) {
        console.error('updateSyncedDueForCustomers error:', e);
    }
}

/**
 * বর্তমানে কতজন কাস্টমারের বকেয়া গুগল কন্টাক্টসে সিঙ্ক হওয়া বাকি রয়েছে তা হিসাব করে
 */
export async function getPendingDeltaInfo() {
    try {
        let customers = getCustomerCache();
        if (!customers || customers.length === 0) {
            const snap = await CustomerDAO.collection.get();
            customers = [];
            snap.forEach(doc => customers.push({ id: doc.id, ...doc.data() }));
        }

        const dueMap = await getLastSyncedDueMap();
        const changedCustomers = customers.filter(c => {
            const currentDue = Number(c.totalDue || 0);
            const syncedDue = dueMap[c.id];
            return syncedDue === undefined || Number(syncedDue) !== currentDue;
        });

        return {
            totalCustomers: customers.length,
            pendingCount: changedCustomers.length,
            changedCustomers
        };
    } catch (e) {
        console.error('getPendingDeltaInfo error:', e);
        return { totalCustomers: 0, pendingCount: 0, changedCustomers: [] };
    }
}

/**
 * কাস্টমারের লেনদেন থেকে সর্বশেষ জমা ও দিন পার্থক্য ক্যালকুলেট করে (Call Context Intelligence)
 */
export function calculateCallIntelligence(transactions = [], totalDue = 0) {
    if (!transactions || transactions.length === 0) {
        return {
            lastPaymentText: 'কোনো জমা নেই',
            dueAgingText: totalDue > 0 ? 'নতুন কাস্টমার' : 'পরিশোধিত',
            lastPaymentRecencyText: 'পূর্বে কোনো জমা নেই',
            lastPaymentDateText: ''
        };
    }

    // তারিখ অনুযায়ী ডিসেন্ডিং সর্ট (toDBDate দিয়ে নিরাপদ সর্টিং)
    const sorted = [...transactions].sort((a, b) => {
        const da = toDBDate(a.date || '');
        const db = toDBDate(b.date || '');
        return db.localeCompare(da);
    });

    // সর্বশেষ জমা ফিল্টার
    const payments = sorted.filter(t => Number(t.paid) > 0);
    let lastPaymentText = 'কোনো জমা নেই';
    let lastPaymentRecencyText = 'পূর্বে কোনো জমা নেই';
    let lastPaymentDateText = '';

    if (payments.length > 0) {
        const lp = payments[0];
        const dateStr = lp.date ? formatAppDate(lp.date) : 'তারিখ নেই';
        const paidAmtStr = formatAmountWithComma(lp.paid);
        lastPaymentText = `৳ ${paidAmtStr} (${dateStr})`;
        lastPaymentDateText = dateStr;

        if (lp.date) {
            try {
                const isoDateStr = toDBDate(lp.date);
                const [y, m, d] = isoDateStr.split('-').map(Number);
                const payDate = new Date(y, m - 1, d);
                const now = new Date();
                const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
                const diffTime = today.getTime() - payDate.getTime();
                const diffDays = Math.max(0, Math.floor(diffTime / (1000 * 60 * 60 * 24)));

                if (diffDays === 0) {
                    lastPaymentRecencyText = `শেষ জমা: আজকেই (৳ ${paidAmtStr})`;
                } else if (diffDays === 1) {
                    lastPaymentRecencyText = `শেষ জমা: গতকাল (৳ ${paidAmtStr})`;
                } else {
                    const bnDays = String(diffDays).replace(/\d/g, d => '০১২৩৪৫৬৭৮৯'[d]);
                    lastPaymentRecencyText = `শেষ জমা: ${bnDays} দিন আগে (৳ ${paidAmtStr})`;
                }
            } catch (dErr) {
                console.error('Recency date calc error:', dErr);
                lastPaymentRecencyText = `শেষ জমা: ৳ ${paidAmtStr}`;
            }
        } else {
            lastPaymentRecencyText = `শেষ জমা: ৳ ${paidAmtStr}`;
        }
    }

    // বাকির বয়স (Due Aging)
    let dueAgingText = 'নিয়মিত';
    if (totalDue > 0) {
        const latestTxn = sorted[0];
        if (latestTxn && latestTxn.date) {
            try {
                const isoDateStr = toDBDate(latestTxn.date);
                const [y, m, d] = isoDateStr.split('-').map(Number);
                const txnDate = new Date(y, m - 1, d);
                const now = new Date();
                const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
                const diffMs = today.getTime() - txnDate.getTime();
                const days = Math.max(0, Math.floor(diffMs / (1000 * 60 * 60 * 24)));
                const bnDays = String(days).replace(/\d/g, d => '০১২৩৪৫৬৭৮৯'[d]);
                dueAgingText = `${bnDays} দিন ধরে বকেয়া`;
            } catch (err) {
                console.error('Due aging calc error:', err);
                dueAgingText = 'বকেয়া আছে';
            }
        }
    } else if (totalDue < 0) {
        dueAgingText = 'অগ্রিম জমা';
    } else {
        dueAgingText = 'পরিশোধিত';
    }

    return { lastPaymentText, dueAgingText, lastPaymentRecencyText, lastPaymentDateText };
}

/**
 * কাস্টমারের ডাটা ও কল ইন্টেলিজেন্স থেকে কন্টাক্টের ফিল্ড ও ফরম্যাট প্রস্তুত করে
 */
function buildContactFields(c, intelligence = {}) {
    const phones = parsePhoneNumbers(c.phone);
    const totalDue = Number(c.totalDue) || 0;
    const displayName = buildContactDisplayName(c, 'tag_zone', totalDue);
    
    const dueText = totalDue > 0 
        ? `বকেয়া: ৳ ${formatAmountWithComma(totalDue)}` 
        : (totalDue < 0 ? `অগ্রিম: ৳ ${formatAmountWithComma(Math.abs(totalDue))}` : 'ব্যালেন্স: পরিশোধিত');

    const token = generateBossToken(c.id);
    const liveUrl = `https://maa-motors-erp.web.app/?view=boss-card&id=${c.id}&key=${token}`;
    const orgTitle = `[Acc: ${c.accountNo || ''}] • ${dueText}`;
    
    const recencyStr = intelligence.lastPaymentRecencyText || 'কোনো জমা নেই';

    const bioText = `হিসাব নং: #${c.accountNo || '-'} | এলাকা: ${c.zone || '-'}\n` +
                    `বর্তমান বকেয়া: ${dueText}\n` +
                    `${recencyStr}\n` +
                    (intelligence.lastPaymentDateText ? `জমার তারিখ: ${intelligence.lastPaymentDateText}\n` : '') +
                    `----------------------------------\n` +
                    `লাইভ খতিয়ান কার্ড: ${liveUrl}`;

    return { phones, displayName, totalDue, dueText, liveUrl, orgTitle, bioText };
}

/**
 * নির্দিষ্ট কাস্টমারের জন্য কল ইন্টেলিজেন্স ফেচ করে
 */
export async function fetchSingleCustomerIntelligence(customerId, totalDue) {
    try {
        const txns = await TransactionDAO.getByCustomer(customerId);
        return calculateCallIntelligence(txns, totalDue);
    } catch (e) {
        console.error('fetchSingleCustomerIntelligence non-fatal error:', e);
        return calculateCallIntelligence([], totalDue);
    }
}

/**
/**
 * গুগল কন্টাক্টসে ফোন নম্বর বা নাম দিয়ে বিদ্যমান কন্টাক্ট খুঁজে বের করে
 * @param {string} accessToken
 * @param {string} primaryPhone
 * @param {string} custName
 * @returns {Promise<Object|null>}
 */
async function findMatchingGoogleContact(accessToken, primaryPhone, custName) {
    if (!accessToken) return null;

    // ১. প্রথমে +৮৮০ ফরম্যাটে ফোন নম্বর দিয়ে সার্চ
    if (primaryPhone) {
        const searchPhone = `+880${primaryPhone}`;
        const searchUrl = `https://people.googleapis.com/v1/people:searchContacts?query=${encodeURIComponent(searchPhone)}&readMask=names,phoneNumbers,organizations,biographies,urls,metadata`;
        try {
            const res = await fetchWithRetry(searchUrl, {
                headers: { Authorization: `Bearer ${accessToken}` }
            });
            if (res && res.ok) {
                const data = await res.json();
                if (data.results && data.results.length > 0) {
                    for (const r of data.results) {
                        const pNums = r.person?.phoneNumbers || [];
                        const matches = pNums.some(pn => pn.value.replace(/\D/g, '').slice(-10) === primaryPhone);
                        if (matches) return r.person;
                    }
                    return data.results[0].person;
                }
            }
        } catch (sErr) {
            console.warn('Phone search error:', sErr);
        }
    }

    // ২. যদি ফোন দিয়ে না পাওয়া যায়, কাস্টমারের নাম দিয়ে ব্যাকআপ সার্চ
    if (custName && custName.trim()) {
        const cleanName = custName.replace(/^(মেসার্স|মো:|মোঃ|মা|এম\/এস)\s*/gi, '').trim();
        const searchName = cleanName.length >= 3 ? cleanName : custName.trim();
        const nameUrl = `https://people.googleapis.com/v1/people:searchContacts?query=${encodeURIComponent(searchName)}&readMask=names,phoneNumbers,organizations,biographies,urls,metadata`;
        try {
            const res = await fetchWithRetry(nameUrl, {
                headers: { Authorization: `Bearer ${accessToken}` }
            });
            if (res && res.ok) {
                const data = await res.json();
                if (data.results && data.results.length > 0) {
                    if (primaryPhone) {
                        for (const r of data.results) {
                            const pNums = r.person?.phoneNumbers || [];
                            const matches = pNums.some(pn => pn.value.replace(/\D/g, '').slice(-10) === primaryPhone);
                            if (matches) return r.person;
                        }
                    }
                    return data.results[0].person;
                }
            }
        } catch (nErr) {
            console.warn('Name search error:', nErr);
        }
    }

    return null;
}

/**
 * গুগল পিপল এপিআই দিয়ে কন্টাক্টের ফটো আপডেট করে
 * @param {string} resourceName - যেমন: 'people/c123456789'
 * @param {string} photoBytesBase64 - Base64 encoded JPEG (without header)
 * @param {string} accessToken
 */
export async function uploadContactPhotoToGoogle(resourceName, photoBytesBase64, accessToken) {
    if (!resourceName || !photoBytesBase64 || !accessToken) return false;
    try {
        const photoUrl = `https://people.googleapis.com/v1/${resourceName}:updateContactPhoto`;
        const res = await fetchWithRetry(photoUrl, {
            method: 'PATCH',
            headers: {
                Authorization: `Bearer ${accessToken}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                photoBytes: photoBytesBase64,
                personFields: 'photos'
            })
        });
        if (!res || !res.ok) {
            console.error(`Photo upload error for ${resourceName}: status ${res?.status}`);
            return false;
        }
        return true;
    } catch (err) {
        console.error(`Photo upload error for ${resourceName}:`, err);
        return false;
    }
}

/**
 * সিঙ্গেল কাস্টমার সিঙ্ক — সকল কানেক্টেড ডিভাইসে (বস + ম্যানেজার) একযোগে পুশ করে
 * @param {string} customerId
 * @param {Object} options - { uploadBadge: true }
 */
export async function syncSingleCustomerToGoogle(customerId, options = { uploadBadge: true }) {
    if (!customerId) return;

    try {
        const activeTokens = await getAllSilentAccessTokens();
        if (activeTokens.length === 0) return; // কোনো সচল গুগল কানেকশন না থাকলে রিটার্ন

        // কাস্টমার ডাটা সংগ্রহ
        let cust = null;
        const cache = getCustomerCache();
        if (cache && cache.length > 0) {
            cust = cache.find(c => c.id === customerId);
        }
        if (!cust) {
            const snap = await CustomerDAO.get(customerId);
            if (snap.exists) cust = { id: snap.id, ...snap.data() };
        }
        if (!cust) return;

        const totalDue = Number(cust.totalDue) || 0;
        const intelligence = await fetchSingleCustomerIntelligence(customerId, totalDue);
        const { phones, displayName, liveUrl, orgTitle, bioText } = buildContactFields(cust, intelligence);
        if (phones.length === 0) return;

        const primaryPhone = phones[0].replace(/\D/g, '').slice(-10);

        // সকল কানেক্টেড অ্যাকাউন্টে প্যারালাল পুশ
        const syncPromises = activeTokens.map(async (acc) => {
            try {
                const matchedContact = await findMatchingGoogleContact(acc.accessToken, primaryPhone, cust.name);

                let targetResourceName = null;

                if (matchedContact) {
                    targetResourceName = matchedContact.resourceName;
                    const existingName = matchedContact.names?.[0]?.displayName || matchedContact.names?.[0]?.givenName || '';
                    const hasMMTag = existingName.includes('[MM]');
                    const updateFields = ['organizations', 'biographies', 'urls', 'names'];

                    // নাম নির্ধারণ: যদি বসের ব্যক্তিগত নাম থাকে, তবে তার শেষে ব্র্যাকেটে ব্যালেন্স আপডেট
                    const finalName = hasMMTag || !existingName
                        ? displayName
                        : updatePersonalContactNameWithDue(existingName, totalDue);

                    const updatePayload = {
                        etag: matchedContact.etag,
                        names: [{ givenName: finalName }],
                        organizations: [{ name: "M/S. MAA-MOTOR'S", title: orgTitle }],
                        urls: [{ value: liveUrl, type: 'Live Due Card' }],
                        biographies: [{ value: bioText }]
                    };

                    const updateUrl = `https://people.googleapis.com/v1/${targetResourceName}:updateContact?updatePersonFields=${updateFields.join(',')}`;
                    await fetchWithRetry(updateUrl, {
                        method: 'PATCH',
                        headers: {
                            Authorization: `Bearer ${acc.accessToken}`,
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify(updatePayload)
                    });
                } else {
                    const createUrl = 'https://people.googleapis.com/v1/people:createContact';
                    const createPayload = {
                        names: [{ givenName: displayName }],
                        phoneNumbers: phones.map(p => ({ value: p, type: 'Mobile' })),
                        organizations: [{ name: "M/S. MAA-MOTOR'S", title: orgTitle }],
                        urls: [{ value: liveUrl, type: 'Live Due Card' }],
                        biographies: [{ value: bioText }],
                        addresses: [{ streetAddress: cust.address || '', city: cust.zone || '', type: 'Work' }]
                    };

                    const createRes = await fetchWithRetry(createUrl, {
                        method: 'POST',
                        headers: {
                            Authorization: `Bearer ${acc.accessToken}`,
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify(createPayload)
                    });
                    if (createRes && createRes.ok) {
                        const createdData = await createRes.json();
                        targetResourceName = createdData?.resourceName;
                    }
                }

                // যদি অপশনে ফটো আপলোড এনাবল থাকে
                if (targetResourceName && options.uploadBadge) {
                    try {
                        const badgeBase64 = generateCustomerBadgeBase64(cust, intelligence);
                        if (badgeBase64) {
                            await uploadContactPhotoToGoogle(targetResourceName, badgeBase64, acc.accessToken);
                        }
                    } catch (photoErr) {
                        console.warn(`Badge photo upload skipped for ${cust.name}:`, photoErr);
                    }
                }
            } catch (singleAccErr) {
                console.error(`Sync error for device (${acc.label}):`, singleAccErr);
            }
        });

        await Promise.allSettled(syncPromises);

        // ফায়ারস্টোরে এই কাস্টমারের সর্বশেষ সিঙ্ককৃত বকেয়া আপডেট
        await updateSyncedDueForCustomers({ [customerId]: totalDue });

    } catch (e) {
        console.error('Silent Multi-Device Google Contact Sync Error:', e);
    }
}

/**
 * নির্দিষ্ট কাস্টমারের জন্য কলার আইডি ফটো ব্যাজ ট্রায়াল পুশ করে (স্যাম্পল টেস্টিং)
 * @param {string} customerId
 * @param {string|null} targetAccountId - অপশনাল নির্দিষ্ট অ্যাকাউন্ট
 * @returns {Promise<Object>}
 */
export async function trialPushCustomerPhotoBadge(customerId, targetAccountId = null) {
    if (!customerId) throw new Error('কাস্টমার নির্বাচন করা হয়নি');

    let cust = null;
    const cache = getCustomerCache();
    if (cache && cache.length > 0) {
        cust = cache.find(c => c.id === customerId);
    }
    if (!cust) {
        const snap = await CustomerDAO.get(customerId);
        if (snap.exists) cust = { id: snap.id, ...snap.data() };
    }
    if (!cust) throw new Error('কাস্টমার ডাটা পাওয়া যায়নি');

    const totalDue = Number(cust.totalDue) || 0;
    const intelligence = await fetchSingleCustomerIntelligence(customerId, totalDue);
    const badgeDataUrl = generateCustomerBadgeDataUrl(cust, intelligence);
    const badgeBase64 = generateCustomerBadgeBase64(cust, intelligence);

    let activeTokens = await getAllSilentAccessTokens();
    if (targetAccountId) {
        activeTokens = activeTokens.filter(acc => acc.id === targetAccountId);
    }
    if (activeTokens.length === 0) {
        throw new Error('কোনো সচল গুগল অ্যাকাউন্ট পাওয়া যায়নি');
    }

    const { phones, displayName, liveUrl, orgTitle, bioText } = buildContactFields(cust, intelligence);
    if (phones.length === 0) {
        throw new Error('এই কাস্টমারের কোনো মোবাইল নম্বর নেই');
    }

    const primaryPhone = phones[0].replace(/\D/g, '').slice(-10);
    const results = [];

    for (const acc of activeTokens) {
        try {
            const matchedContact = await findMatchingGoogleContact(acc.accessToken, primaryPhone, cust.name);
            let targetResourceName = null;

            if (matchedContact) {
                targetResourceName = matchedContact.resourceName;
                const existingName = matchedContact.names?.[0]?.displayName || matchedContact.names?.[0]?.givenName || '';
                const hasMMTag = existingName.includes('[MM]');
                const updateFields = ['organizations', 'biographies', 'urls', 'names'];

                const finalName = hasMMTag || !existingName
                    ? displayName
                    : updatePersonalContactNameWithDue(existingName, totalDue);

                const updatePayload = {
                    etag: matchedContact.etag,
                    names: [{ givenName: finalName }],
                    organizations: [{ name: "M/S. MAA-MOTOR'S", title: orgTitle }],
                    urls: [{ value: liveUrl, type: 'Live Due Card' }],
                    biographies: [{ value: bioText }]
                };

                const updateUrl = `https://people.googleapis.com/v1/${targetResourceName}:updateContact?updatePersonFields=${updateFields.join(',')}`;
                await fetchWithRetry(updateUrl, {
                    method: 'PATCH',
                    headers: {
                        Authorization: `Bearer ${acc.accessToken}`,
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(updatePayload)
                });
            } else {
                const createUrl = 'https://people.googleapis.com/v1/people:createContact';
                const createPayload = {
                    names: [{ givenName: displayName }],
                    phoneNumbers: phones.map(p => ({ value: p, type: 'Mobile' })),
                    organizations: [{ name: "M/S. MAA-MOTOR'S", title: orgTitle }],
                    urls: [{ value: liveUrl, type: 'Live Due Card' }],
                    biographies: [{ value: bioText }],
                    addresses: [{ streetAddress: cust.address || '', city: cust.zone || '', type: 'Work' }]
                };

                const createRes = await fetchWithRetry(createUrl, {
                    method: 'POST',
                    headers: {
                        Authorization: `Bearer ${acc.accessToken}`,
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(createPayload)
                });
                if (createRes && createRes.ok) {
                    const createdData = await createRes.json();
                    targetResourceName = createdData?.resourceName;
                }
            }

            let photoSuccess = false;
            if (targetResourceName && badgeBase64) {
                photoSuccess = await uploadContactPhotoToGoogle(targetResourceName, badgeBase64, acc.accessToken);
            }

            results.push({
                accountLabel: acc.label || 'ডিভাইস',
                resourceName: targetResourceName,
                photoUpdated: photoSuccess
            });
        } catch (accErr) {
            console.error(`Trial push error for ${acc.label}:`, accErr);
            results.push({
                accountLabel: acc.label || 'ডিভাইস',
                error: accErr.message
            });
        }
    }

    return {
        success: true,
        customer: cust,
        intelligence,
        previewUrl: badgeDataUrl,
        deviceResults: results
    };
}

/**
 * যেকোনো লেনদেন বা পরিবর্তনের পর নন-ব্লকিং ব্যাকগ্রাউন্ড ট্রিগার
 */
export function triggerSilentCustomerGoogleSync(customerId) {
    if (!customerId) return;
    setTimeout(() => {
        syncSingleCustomerToGoogle(customerId).catch(err => {
            console.error('Background trigger error:', err);
        });
    }, 100);
}

/**
 * ফুল ডাটাবেজ ব্যাচ সিঙ্ক ইঞ্জিন (সকল বা নির্দিষ্ট নির্বাচিত ডিভাইসে)
 * @param {Function} onProgress
 * @param {Array|null} targetAccountIds
 * @param {boolean} deltaOnly - true হলে শুধুমাত্র পরিবর্তিত বকেয়ার কাস্টমারদের সিঙ্ক করবে
 */
export async function executeFullGoogleContactsSync(onProgress, targetAccountIds = null, deltaOnly = false) {
    if (isSyncingInBackground) {
        showToast('ইতিমধ্যে একটি সিঙ্ক প্রসেস চলমান রয়েছে', 'warning');
        return { success: false, message: 'Already syncing' };
    }

    let activeTokens = await getAllSilentAccessTokens();
    if (activeTokens.length === 0) {
        throw new Error('কোনো গুগল অ্যাকাউন্ট কানেক্টেড নেই। দয়া করে প্রথমে একটি অ্যাকাউন্ট কানেক্ট করুন।');
    }

    if (Array.isArray(targetAccountIds) && targetAccountIds.length > 0) {
        activeTokens = activeTokens.filter(acc => targetAccountIds.includes(acc.id));
        if (activeTokens.length === 0) {
            throw new Error('নির্বাচিত অ্যাকাউন্টের কোনো সচল কানেকশন পাওয়া যায়নি।');
        }
    }

    isSyncingInBackground = true;

    try {
        let customers = getCustomerCache();
        if (!customers || customers.length === 0) {
            const snap = await CustomerDAO.collection.get();
            customers = [];
            snap.forEach(doc => customers.push({ id: doc.id, ...doc.data() }));
        }

        if (customers.length === 0) {
            isSyncingInBackground = false;
            return { success: true, updated: 0, created: 0, total: 0 };
        }

        let customersToSync = customers;
        if (deltaOnly) {
            const lastSyncedDueMap = await getLastSyncedDueMap();
            customersToSync = customers.filter(c => {
                const currentDue = Math.round(Number(c.totalDue) || 0);
                const recordedDue = lastSyncedDueMap[c.id];
                return recordedDue === undefined || recordedDue !== currentDue;
            });

            if (customersToSync.length === 0) {
                isSyncingInBackground = false;
                return {
                    success: true,
                    updated: 0,
                    created: 0,
                    total: 0,
                    deviceCount: activeTokens.length,
                    deltaOnly: true,
                    message: 'সকল কাস্টমারের তথ্য ইতিমধ্যে ক্লাউডে আপ-টু-ডেট আছে।'
                };
            }
        }

        if (onProgress) onProgress({ current: 0, total: customersToSync.length, text: 'লেনদেন ডাটা ও কল ইন্টেলিজেন্স লোড হচ্ছে...' });

        // ১. একবারে সকল লেনদেন ফেচ করে মেমোরিতে গ্রুপ করা (০ N+1 কোয়েরি)
        let txnsByCustomer = new Map();
        try {
            const allTxns = await TransactionDAO.getAll();
            allTxns.forEach(t => {
                if (!txnsByCustomer.has(t.customerId)) txnsByCustomer.set(t.customerId, []);
                txnsByCustomer.get(t.customerId).push(t);
            });
        } catch (txnErr) {
            console.warn('Transactions prefetch warning:', txnErr);
        }

        // ২. টার্বো ব্যাচ ইঞ্জিন: সকল সংযুক্ত ডিভাইসে প্যারালাল (সমান্তরাল) সিঙ্ক
        const executeTurboBatchForAccount = async (acc) => {
            let updatedCount = 0;
            let createdCount = 0;
            const syncedDueMap = {};
            const devPrefix = activeTokens.length > 1 ? `[${acc.label}]: ` : '';

            if (onProgress) {
                onProgress({ current: 0, total: customersToSync.length, text: `${devPrefix}গুগল কন্টাক্ট তালিকা ফেচ করা হচ্ছে...` });
            }

            // ক. গুগল কন্টাক্টস ফেচ
            const googleContacts = [];
            let nextPageToken = '';
            do {
                const url = `https://people.googleapis.com/v1/people/me/connections?personFields=names,phoneNumbers,organizations,biographies,urls,metadata&pageSize=1000${nextPageToken ? `&pageToken=${nextPageToken}` : ''}`;
                const res = await fetchWithRetry(url, { headers: { Authorization: `Bearer ${acc.accessToken}` } });
                if (!res.ok) throw new Error(`ডিভাইস ${acc.label}-এর কন্টাক্ট তালিকা রিড করা যায়নি`);
                const data = await res.json();
                if (data.connections) googleContacts.push(...data.connections);
                nextPageToken = data.nextPageToken || '';
            } while (nextPageToken);

            // খ. ফোন নম্বর দিয়ে দ্রুত O(1) লুকআপ ম্যাপ
            const phoneMap = new Map();
            googleContacts.forEach(gc => {
                if (gc.phoneNumbers) {
                    gc.phoneNumbers.forEach(pn => {
                        const clean = normalizeBengaliNumbers(pn.value).replace(/\D/g, '');
                        if (clean.length >= 10) phoneMap.set(clean.slice(-10), gc);
                    });
                }
            });

            const toUpdate = [];
            const toCreate = [];

            // গ. কাস্টমারদের ক্যাটাগরাইজ করা
            for (let i = 0; i < customersToSync.length; i++) {
                const c = customersToSync[i];
                const totalDue = Number(c.totalDue) || 0;
                const custTxns = txnsByCustomer.get(c.id) || [];
                const intelligence = calculateCallIntelligence(custTxns, totalDue);
                const { phones, displayName, liveUrl, orgTitle, bioText } = buildContactFields(c, intelligence);

                let matched = null;
                for (const p of phones) {
                    const digits = p.replace(/\D/g, '');
                    if (digits.length >= 10 && phoneMap.has(digits.slice(-10))) {
                        matched = phoneMap.get(digits.slice(-10));
                        break;
                    }
                }

                if (matched) {
                    const existingName = matched.names?.[0]?.displayName || matched.names?.[0]?.givenName || '';
                    const hasMMTag = existingName.includes('[MM]');
                    const finalName = hasMMTag || !existingName
                        ? displayName
                        : updatePersonalContactNameWithDue(existingName, totalDue);

                    toUpdate.push({
                        resourceName: matched.resourceName,
                        etag: matched.etag,
                        finalName,
                        orgTitle,
                        liveUrl,
                        bioText,
                        customerId: c.id,
                        totalDue
                    });
                } else if (phones.length > 0) {
                    toCreate.push({
                        displayName,
                        phones,
                        orgTitle,
                        liveUrl,
                        bioText,
                        address: c.address || '',
                        zone: c.zone || '',
                        customerId: c.id,
                        totalDue
                    });
                }
            }

            if (onProgress) {
                onProgress({
                    current: 0,
                    total: customersToSync.length,
                    text: `${devPrefix}টার্বো ব্যাচ মিউটেশন চলছে (${toUpdate.length} টি আপডেট, ${toCreate.length} টি নতুন)...`
                });
            }

            // ঘ. টার্বো ব্যাচ আপডেট (১৫০ টি করে সুপার-ব্যাচ রিকোয়েস্টে)
            const BATCH_SIZE = 150;
            for (let i = 0; i < toUpdate.length; i += BATCH_SIZE) {
                const chunk = toUpdate.slice(i, i + BATCH_SIZE);
                const contactsMap = {};
                chunk.forEach(item => {
                    contactsMap[item.resourceName] = {
                        etag: item.etag,
                        names: [{ givenName: item.finalName }],
                        organizations: [{ name: "M/S. MAA-MOTOR'S", title: item.orgTitle }],
                        urls: [{ value: item.liveUrl, type: 'Live Due Card' }],
                        biographies: [{ value: item.bioText }]
                    };
                });

                const batchUrl = 'https://people.googleapis.com/v1/people:batchUpdateContacts';
                const batchPayload = {
                    contacts: contactsMap,
                    updateMask: 'names,organizations,urls,biographies'
                };

                let isBatchSuccess = false;
                try {
                    const batchRes = await fetchWithRetry(batchUrl, {
                        method: 'POST',
                        headers: {
                            Authorization: `Bearer ${acc.accessToken}`,
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify(batchPayload)
                    });

                    if (batchRes.ok) {
                        isBatchSuccess = true;
                        updatedCount += chunk.length;
                        chunk.forEach(item => { syncedDueMap[item.customerId] = item.totalDue; });
                    }
                } catch (batchErr) {
                    console.warn(`[${acc.label}] Batch update failed, falling back to parallel individual updates:`, batchErr);
                }

                // সেফটি ফলব্যাক: যদি কোনো কারণে ব্যাচ এপিআই রিজেক্ট করে, প্যারালাল ইন্ডিভিজুয়াল আপডেট
                if (!isBatchSuccess) {
                    await Promise.all(chunk.map(async (item) => {
                        try {
                            const updateUrl = `https://people.googleapis.com/v1/${item.resourceName}:updateContact?updatePersonFields=names,organizations,urls,biographies`;
                            const patchRes = await fetchWithRetry(updateUrl, {
                                method: 'PATCH',
                                headers: {
                                    Authorization: `Bearer ${acc.accessToken}`,
                                    'Content-Type': 'application/json'
                                },
                                body: JSON.stringify({
                                    etag: item.etag,
                                    names: [{ givenName: item.finalName }],
                                    organizations: [{ name: "M/S. MAA-MOTOR'S", title: item.orgTitle }],
                                    urls: [{ value: item.liveUrl, type: 'Live Due Card' }],
                                    biographies: [{ value: item.bioText }]
                                })
                            });
                            if (patchRes.ok) {
                                updatedCount++;
                                syncedDueMap[item.customerId] = item.totalDue;
                            }
                        } catch (singleErr) {
                            console.error('Individual update fallback error:', singleErr);
                        }
                    }));
                }

                if (onProgress) {
                    onProgress({
                        current: Math.min(i + chunk.length, customersToSync.length),
                        total: customersToSync.length,
                        text: `${devPrefix}আপডেট সম্পন্ন (${Math.min(i + chunk.length, toUpdate.length)}/${toUpdate.length})`
                    });
                }
            }

            // ঙ. টার্বো ব্যাচ ক্রিয়েট (নতুন কন্টাক্ট তৈরির জন্য)
            for (let i = 0; i < toCreate.length; i += BATCH_SIZE) {
                const chunk = toCreate.slice(i, i + BATCH_SIZE);
                const contactsList = chunk.map(item => ({
                    contactPerson: {
                        names: [{ givenName: item.displayName }],
                        phoneNumbers: item.phones.map(p => ({ value: p, type: 'Mobile' })),
                        organizations: [{ name: "M/S. MAA-MOTOR'S", title: item.orgTitle }],
                        urls: [{ value: item.liveUrl, type: 'Live Due Card' }],
                        biographies: [{ value: item.bioText }],
                        addresses: [{ streetAddress: item.address, city: item.zone, type: 'Work' }]
                    }
                }));

                const createBatchUrl = 'https://people.googleapis.com/v1/people:batchCreateContacts';
                let isCreateBatchSuccess = false;
                try {
                    const createRes = await fetchWithRetry(createBatchUrl, {
                        method: 'POST',
                        headers: {
                            Authorization: `Bearer ${acc.accessToken}`,
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({ contacts: contactsList, readMask: 'names,phoneNumbers' })
                    });

                    if (createRes.ok) {
                        isCreateBatchSuccess = true;
                        createdCount += chunk.length;
                        chunk.forEach(item => { syncedDueMap[item.customerId] = item.totalDue; });
                    }
                } catch (createBatchErr) {
                    console.warn(`[${acc.label}] Batch create failed, falling back to parallel individual creates:`, createBatchErr);
                }

                // সেফটি ফলব্যাক: প্যারালাল ইন্ডিভিজুয়াল ক্রিয়েট
                if (!isCreateBatchSuccess) {
                    await Promise.all(chunk.map(async (item) => {
                        try {
                            const createUrl = 'https://people.googleapis.com/v1/people:createContact';
                            const postRes = await fetchWithRetry(createUrl, {
                                method: 'POST',
                                headers: {
                                    Authorization: `Bearer ${acc.accessToken}`,
                                    'Content-Type': 'application/json'
                                },
                                body: JSON.stringify({
                                    names: [{ givenName: item.displayName }],
                                    phoneNumbers: item.phones.map(p => ({ value: p, type: 'Mobile' })),
                                    organizations: [{ name: "M/S. MAA-MOTOR'S", title: item.orgTitle }],
                                    urls: [{ value: item.liveUrl, type: 'Live Due Card' }],
                                    biographies: [{ value: item.bioText }],
                                    addresses: [{ streetAddress: item.address, city: item.zone, type: 'Work' }]
                                })
                            });
                            if (postRes.ok) {
                                createdCount++;
                                syncedDueMap[item.customerId] = item.totalDue;
                            }
                        } catch (singleCreateErr) {
                            console.error('Individual create fallback error:', singleCreateErr);
                        }
                    }));
                }
            }

            // এই নির্দিষ্ট ডিভাইসের সিঙ্ক টাইমস্ট্যাম্প ফায়ারস্টোরে আপডেট
            await updateAccountSyncTimestamp(acc.id);

            return { updatedCount, createdCount, syncedDueMap };
        };

        // মাল্টি-ডিভাইস একযোগে প্যারালাল এক্সিকিউশন
        const deviceResults = await Promise.all(
            activeTokens.map(acc => executeTurboBatchForAccount(acc))
        );

        let totalUpdated = 0;
        let totalCreated = 0;
        const mergedSyncedDueUpdates = {};

        deviceResults.forEach(res => {
            totalUpdated += res.updatedCount;
            totalCreated += res.createdCount;
            Object.assign(mergedSyncedDueUpdates, res.syncedDueMap);
        });

        // ৩. সিঙ্ক হওয়া কাস্টমারদের বকেয়া স্টেট সংরক্ষণ
        if (Object.keys(mergedSyncedDueUpdates).length > 0) {
            await updateSyncedDueForCustomers(mergedSyncedDueUpdates);
        }

        await db.collection('settings').doc('google_sync').set({
            lastSyncAt: new Date().toISOString(),
            lastSyncStats: {
                updated: totalUpdated,
                created: totalCreated,
                total: customersToSync.length,
                deltaOnly: deltaOnly,
                turboBatch: true
            }
        }, { merge: true });

        if (onProgress) {
            onProgress({
                current: customersToSync.length,
                total: customersToSync.length,
                text: 'টার্বো ব্যাচ সিঙ্ক সফলভাবে সমাপ্ত হয়েছে!'
            });
        }

        return {
            success: true,
            updated: totalUpdated,
            created: totalCreated,
            total: customersToSync.length,
            deviceCount: activeTokens.length,
            deltaOnly: deltaOnly,
            turboBatch: true
        };
    } finally {
        isSyncingInBackground = false;
    }
}

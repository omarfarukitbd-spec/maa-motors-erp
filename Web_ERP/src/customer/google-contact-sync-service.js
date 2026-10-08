import { db } from '../firebase-config.js';
import { CustomerDAO, TransactionDAO } from '../dao.js';
import { getCustomerCache } from './customer-state.js';
import { formatAmountWithComma, formatAppDate, showToast } from '../utils.js';
import { generateBossToken } from './boss-card-token.js';
import { parsePhoneNumbers, normalizeBengaliNumbers, buildContactDisplayName, updatePersonalContactNameWithDue } from './customer-contact-export-helpers.js';
import { getAllSilentAccessTokens, updateAccountSyncTimestamp } from './google-auth-client.js';

let isSyncingInBackground = false;

/**
 * কাস্টমারের লেনদেন থেকে সর্বশেষ জমা ও বাকির বয়স ক্যালকুলেট করে (Call Context Intelligence)
 */
export function calculateCallIntelligence(transactions = [], totalDue = 0) {
    if (!transactions || transactions.length === 0) {
        return {
            lastPaymentText: 'কোনো জমা নেই',
            dueAgingText: totalDue > 0 ? 'নতুন কাস্টমার' : 'পরিশোধিত'
        };
    }

    // তারিখ অনুযায়ী ডিসেন্ডিং সর্ট
    const sorted = [...transactions].sort((a, b) => new Date(b.date || 0) - new Date(a.date || 0));

    // সর্বশেষ জমা ফিল্টার
    const payments = sorted.filter(t => Number(t.paid) > 0);
    let lastPaymentText = 'কোনো জমা নেই';
    if (payments.length > 0) {
        const lp = payments[0];
        const dateStr = lp.date ? formatAppDate(lp.date) : 'তারিখ নেই';
        lastPaymentText = `৳ ${formatAmountWithComma(lp.paid)} (${dateStr})`;
    }

    // বাকির বয়স (Due Aging)
    let dueAgingText = 'নিয়মিত';
    if (totalDue > 0) {
        const latestTxn = sorted[0];
        if (latestTxn && latestTxn.date) {
            const diffMs = Date.now() - new Date(latestTxn.date).getTime();
            const days = Math.max(0, Math.floor(diffMs / (1000 * 60 * 60 * 24)));
            dueAgingText = `${days} দিন ধরে বকেয়া`;
        }
    } else if (totalDue < 0) {
        dueAgingText = 'অগ্রিম জমা';
    } else {
        dueAgingText = 'পরিশোধিত';
    }

    return { lastPaymentText, dueAgingText };
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
    
    const lastPayStr = intelligence.lastPaymentText || 'কোনো জমা নেই';
    const agingStr = intelligence.dueAgingText || (totalDue > 0 ? 'বকেয়া' : 'পরিশোধিত');

    const bioText = `হিসাব নং: #${c.accountNo || '-'} | এলাকা: ${c.zone || '-'}\n` +
                    `বর্তমান বকেয়া: ${dueText}\n` +
                    `সর্বশেষ জমা: ${lastPayStr}\n` +
                    `বাকির বয়স: ${agingStr}\n` +
                    `----------------------------------\n` +
                    `লাইভ খতিয়ান কার্ড: ${liveUrl}`;

    return { phones, displayName, totalDue, dueText, liveUrl, orgTitle, bioText };
}

/**
 * নির্দিষ্ট কাস্টমারের জন্য কল ইন্টেলিজেন্স ফেচ করে
 */
async function fetchSingleCustomerIntelligence(customerId, totalDue) {
    try {
        const txns = await TransactionDAO.getByCustomer(customerId);
        return calculateCallIntelligence(txns, totalDue);
    } catch (e) {
        console.error('fetchSingleCustomerIntelligence non-fatal error:', e);
        return calculateCallIntelligence([], totalDue);
    }
}

/**
 * সিঙ্গেল কাস্টমার সিঙ্ক — সকল কানেক্টেড ডিভাইসে (বস + ম্যানেজার) একযোগে পুশ করে
 */
export async function syncSingleCustomerToGoogle(customerId) {
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
                let matchedContact = null;
                if (primaryPhone) {
                    const searchUrl = `https://people.googleapis.com/v1/people:searchContacts?query=${encodeURIComponent(primaryPhone)}&readMasks=names,phoneNumbers,organizations,biographies,urls,metadata`;
                    const searchRes = await fetch(searchUrl, {
                        headers: { Authorization: `Bearer ${acc.accessToken}` }
                    });
                    if (searchRes.ok) {
                        const searchData = await searchRes.json();
                        if (searchData.results && searchData.results.length > 0) {
                            matchedContact = searchData.results[0].person;
                        }
                    }
                }

                if (matchedContact) {
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

                    const updateUrl = `https://people.googleapis.com/v1/${matchedContact.resourceName}:updateContact?updatePersonFields=${updateFields.join(',')}`;
                    await fetch(updateUrl, {
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

                    await fetch(createUrl, {
                        method: 'POST',
                        headers: {
                            Authorization: `Bearer ${acc.accessToken}`,
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify(createPayload)
                    });
                }
            } catch (singleAccErr) {
                console.error(`Sync error for device (${acc.label}):`, singleAccErr);
            }
        });

        await Promise.allSettled(syncPromises);

        await db.collection('settings').doc('google_sync').set({
            lastSyncAt: new Date().toISOString()
        }, { merge: true });

    } catch (e) {
        console.error('Silent Multi-Device Google Contact Sync Error:', e);
    }
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
 */
export async function executeFullGoogleContactsSync(onProgress, targetAccountIds = null) {
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

        if (onProgress) onProgress({ current: 0, total: customers.length, text: 'লেনদেন ডাটা ও কল ইন্টেলিজেন্স লোড হচ্ছে...' });

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

        let totalUpdated = 0;
        let totalCreated = 0;

        // ২. প্রতিটি কানেক্টেড ডিভাইসের জন্য সিঙ্ক চালানো
        for (let devIdx = 0; devIdx < activeTokens.length; devIdx++) {
            const acc = activeTokens[devIdx];
            const devPrefix = activeTokens.length > 1
                ? `[ডিভাইস ${devIdx + 1}/${activeTokens.length} - ${acc.label}]: `
                : `[${acc.label}]: `;

            if (onProgress) onProgress({ current: 0, total: customers.length, text: `${devPrefix}গুগল কন্টাক্ট ফেচ করা হচ্ছে...` });

            const googleContacts = [];
            let nextPageToken = '';
            do {
                const url = `https://people.googleapis.com/v1/people/me/connections?personFields=names,phoneNumbers,organizations,biographies,urls,metadata&pageSize=1000${nextPageToken ? `&pageToken=${nextPageToken}` : ''}`;
                const res = await fetch(url, { headers: { Authorization: `Bearer ${acc.accessToken}` } });
                if (!res.ok) throw new Error(`ডিভাইস ${acc.label}-এর কন্টাক্ট তালিকা রিড করা যায়নি`);
                const data = await res.json();
                if (data.connections) googleContacts.push(...data.connections);
                nextPageToken = data.nextPageToken || '';
            } while (nextPageToken);

            const phoneMap = new Map();
            googleContacts.forEach(gc => {
                if (gc.phoneNumbers) {
                    gc.phoneNumbers.forEach(pn => {
                        const clean = normalizeBengaliNumbers(pn.value).replace(/\D/g, '');
                        if (clean.length >= 10) phoneMap.set(clean.slice(-10), gc);
                    });
                }
            });

            for (let i = 0; i < customers.length; i++) {
                const c = customers[i];
                const totalDue = Number(c.totalDue) || 0;
                const custTxns = txnsByCustomer.get(c.id) || [];
                const intelligence = calculateCallIntelligence(custTxns, totalDue);
                const { phones, displayName, liveUrl, orgTitle, bioText } = buildContactFields(c, intelligence);

                if (onProgress) {
                    onProgress({
                        current: i + 1,
                        total: customers.length,
                        text: `${devPrefix}${displayName}`
                    });
                }

                let matched = null;
                for (const p of phones) {
                    const digits = p.replace(/\D/g, '');
                    if (digits.length >= 10 && phoneMap.has(digits.slice(-10))) {
                        matched = phoneMap.get(digits.slice(-10));
                        break;
                    }
                }

                try {
                    if (matched) {
                        const existingName = matched.names?.[0]?.displayName || matched.names?.[0]?.givenName || '';
                        const hasMMTag = existingName.includes('[MM]');
                        const finalName = hasMMTag || !existingName
                            ? displayName
                            : updatePersonalContactNameWithDue(existingName, totalDue);

                        const updateFields = ['organizations', 'biographies', 'urls', 'names'];
                        const payload = {
                            etag: matched.etag,
                            names: [{ givenName: finalName }],
                            organizations: [{ name: "M/S. MAA-MOTOR'S", title: orgTitle }],
                            urls: [{ value: liveUrl, type: 'Live Due Card' }],
                            biographies: [{ value: bioText }]
                        };

                        const updateUrl = `https://people.googleapis.com/v1/${matched.resourceName}:updateContact?updatePersonFields=${updateFields.join(',')}`;
                        const patchRes = await fetch(updateUrl, {
                            method: 'PATCH',
                            headers: {
                                Authorization: `Bearer ${acc.accessToken}`,
                                'Content-Type': 'application/json'
                            },
                            body: JSON.stringify(payload)
                        });
                        if (patchRes.ok) totalUpdated++;
                    } else if (phones.length > 0) {
                        const createUrl = 'https://people.googleapis.com/v1/people:createContact';
                        const createPayload = {
                            names: [{ givenName: displayName }],
                            phoneNumbers: phones.map(p => ({ value: p, type: 'Mobile' })),
                            organizations: [{ name: "M/S. MAA-MOTOR'S", title: orgTitle }],
                            urls: [{ value: liveUrl, type: 'Live Due Card' }],
                            biographies: [{ value: bioText }],
                            addresses: [{ streetAddress: c.address || '', city: c.zone || '', type: 'Work' }]
                        };
                        const postRes = await fetch(createUrl, {
                            method: 'POST',
                            headers: {
                                Authorization: `Bearer ${acc.accessToken}`,
                                'Content-Type': 'application/json'
                            },
                            body: JSON.stringify(createPayload)
                        });
                        if (postRes.ok) totalCreated++;
                    }
                } catch (singleSyncErr) {
                    console.error('Error syncing contact for:', c.name, singleSyncErr);
                }

                if (i % 6 === 0) await new Promise(r => setTimeout(r, 60));
            }

            // এই নির্দিষ্ট ডিভাইসের সিঙ্ক টাইমস্ট্যাম্প ফায়ারস্টোরে আপডেট
            await updateAccountSyncTimestamp(acc.id);
        }

        await db.collection('settings').doc('google_sync').set({
            lastSyncAt: new Date().toISOString(),
            lastSyncStats: { updated: totalUpdated, created: totalCreated, total: customers.length }
        }, { merge: true });

        return { success: true, updated: totalUpdated, created: totalCreated, total: customers.length, deviceCount: activeTokens.length };
    } finally {
        isSyncingInBackground = false;
    }
}

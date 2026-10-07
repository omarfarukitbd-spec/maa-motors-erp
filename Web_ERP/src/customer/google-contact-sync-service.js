import { db } from '../firebase-config.js';
import { CustomerDAO } from '../dao.js';
import { getCustomerCache } from './customer-state.js';
import { formatAmountWithComma, showToast } from '../utils.js';
import { generateBossToken } from './boss-card-token.js';
import { parsePhoneNumbers, normalizeBengaliNumbers, buildContactDisplayName } from './customer-contact-export-helpers.js';
import { getSilentAccessToken } from './google-auth-client.js';

let isSyncingInBackground = false;

/**
 * কাস্টমারের ডাটা থেকে গুগল কন্টাক্টের ফিল্ড ও ফরম্যাট প্রস্তুত করে
 */
function buildContactFields(c) {
    const phones = parsePhoneNumbers(c.phone);
    const displayName = buildContactDisplayName(c, 'tag_zone');
    const totalDue = Number(c.totalDue) || 0;
    const dueText = totalDue > 0 
        ? `বকেয়া: ৳ ${formatAmountWithComma(totalDue)}` 
        : (totalDue < 0 ? `অগ্রিম: ৳ ${formatAmountWithComma(Math.abs(totalDue))}` : 'ব্যালেন্স: পরিশোধিত');

    const token = generateBossToken(c.id);
    const liveUrl = `https://maa-motors-erp.web.app/?view=boss-card&id=${c.id}&key=${token}`;
    const orgTitle = `[Acc: ${c.accountNo || ''}] • ${dueText}`;
    const bioText = `অ্যাকাউন্ট: ${c.accountNo || '-'} | জোন: ${c.zone || '-'} | ${dueText}\nলাইভ বর্তমান বকেয়া: ${liveUrl}`;

    return { phones, displayName, totalDue, dueText, liveUrl, orgTitle, bioText };
}

/**
 * সিঙ্গেল কাস্টমারের ব্যালেন্স গুগল কন্টাক্টসে সাইলেন্টলি পুশ করে (নন-ব্লকিং)
 */
export async function syncSingleCustomerToGoogle(customerId) {
    if (!customerId) return;

    try {
        const accessToken = await getSilentAccessToken();
        if (!accessToken) return; // গুগল সিঙ্ক সচল না থাকলে কোনো এরর না দিয়ে রিটার্ন

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

        const { phones, displayName, dueText, liveUrl, orgTitle, bioText } = buildContactFields(cust);
        if (phones.length === 0) return;

        // ফোনের প্রথম কার্যকর নম্বর দিয়ে গুগলে সার্চ
        const primaryPhone = phones[0].replace(/\D/g, '').slice(-10);
        let matchedContact = null;

        if (primaryPhone) {
            try {
                const searchUrl = `https://people.googleapis.com/v1/people:searchContacts?query=${encodeURIComponent(primaryPhone)}&readMasks=names,phoneNumbers,organizations,biographies,urls,metadata`;
                const searchRes = await fetch(searchUrl, {
                    headers: { Authorization: `Bearer ${accessToken}` }
                });
                if (searchRes.ok) {
                    const searchData = await searchRes.json();
                    if (searchData.results && searchData.results.length > 0) {
                        matchedContact = searchData.results[0].person;
                    }
                }
            } catch (searchErr) {
                console.error('Google searchContacts non-fatal error:', searchErr);
            }
        }

        if (matchedContact) {
            // বিদ্যমান কন্টাক্ট আপডেট (বসের ব্যক্তিগত নাম সংরক্ষণ নীতি)
            const existingName = matchedContact.names?.[0]?.displayName || matchedContact.names?.[0]?.givenName || '';
            const hasMMTag = existingName.includes('[MM]');

            const updateFields = ['organizations', 'biographies', 'urls'];
            const updatePayload = {
                etag: matchedContact.etag,
                organizations: [{ name: "M/S. MAA-MOTOR'S", title: orgTitle }],
                urls: [{ value: liveUrl, type: 'Live Due Card' }],
                biographies: [{ value: bioText }]
            };

            if (hasMMTag || !existingName) {
                updateFields.push('names');
                updatePayload.names = [{ givenName: displayName }];
            }

            const updateUrl = `https://people.googleapis.com/v1/${matchedContact.resourceName}:updateContact?updatePersonFields=${updateFields.join(',')}`;
            await fetch(updateUrl, {
                method: 'PATCH',
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(updatePayload)
            });
        } else {
            // নতুন কন্টাক্ট তৈরি
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
                    Authorization: `Bearer ${accessToken}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(createPayload)
            });
        }

        // লাস্ট সিঙ্ক টাইম আপডেট
        await db.collection('settings').doc('google_sync').set({
            lastSyncAt: new Date().toISOString()
        }, { merge: true });

    } catch (e) {
        console.error('Silent Google Contact Sync Error:', e);
    }
}

/**
 * যেকোনো লেনদেন বা পরিবর্তনের পর নন-ব্লকিং ব্যাকগ্রাউন্ড ট্রিগার
 */
export function triggerSilentCustomerGoogleSync(customerId) {
    if (!customerId) return;
    // মাইক্রোটাস্ক বা ব্যাকগ্রাউন্ড থ্রেডে এক্সিকিউট করে যাতে মূল ট্রানজেকশনে ১ মিলিসেকেন্ডও দেরি না হয়
    setTimeout(() => {
        syncSingleCustomerToGoogle(customerId).catch(err => {
            console.error('Background trigger error:', err);
        });
    }, 100);
}

/**
 * ফুল ডাটাবেজ ব্যাচ সিঙ্ক ইঞ্জিন
 */
export async function executeFullGoogleContactsSync(onProgress) {
    if (isSyncingInBackground) {
        showToast('ইতিমধ্যে একটি সিঙ্ক প্রসেস চলমান রয়েছে', 'warning');
        return { success: false, message: 'Already syncing' };
    }

    const accessToken = await getSilentAccessToken();
    if (!accessToken) {
        throw new Error('গুগল অ্যাকাউন্ট কানেক্টেড নেই বা রিফ্রেশ টোকেন অনুপস্থিত।');
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
            return { success: true, updated: 0, created: 0 };
        }

        if (onProgress) onProgress({ current: 0, total: customers.length, text: 'গুগল কন্টাক্ট ফেচ করা হচ্ছে...' });

        // ১. গুগলের কন্টাক্টগুলো ফেচ করা
        const googleContacts = [];
        let nextPageToken = '';
        do {
            const url = `https://people.googleapis.com/v1/people/me/connections?personFields=names,phoneNumbers,organizations,biographies,urls,metadata&pageSize=1000${nextPageToken ? `&pageToken=${nextPageToken}` : ''}`;
            const res = await fetch(url, { headers: { Authorization: `Bearer ${accessToken}` } });
            if (!res.ok) throw new Error('গুগল কন্টাক্ট তালিকা রিড করা যায়নি');
            const data = await res.json();
            if (data.connections) googleContacts.push(...data.connections);
            nextPageToken = data.nextPageToken || '';
        } while (nextPageToken);

        // ২. ফোন নম্বর ম্যাপ তৈরি
        const phoneMap = new Map();
        googleContacts.forEach(gc => {
            if (gc.phoneNumbers) {
                gc.phoneNumbers.forEach(pn => {
                    const clean = normalizeBengaliNumbers(pn.value).replace(/\D/g, '');
                    if (clean.length >= 10) {
                        phoneMap.set(clean.slice(-10), gc);
                    }
                });
            }
        });

        let updated = 0;
        let created = 0;
        let failed = 0;

        // ৩. লুপ চালিয়ে সিঙ্ক
        for (let i = 0; i < customers.length; i++) {
            const c = customers[i];
            const { phones, displayName, dueText, liveUrl, orgTitle, bioText } = buildContactFields(c);

            if (onProgress) {
                onProgress({
                    current: i + 1,
                    total: customers.length,
                    text: `সিঙ্ক হচ্ছে: ${c.name} (${dueText})`
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
                    const updateFields = ['organizations', 'biographies', 'urls'];
                    const payload = {
                        etag: matched.etag,
                        organizations: [{ name: "M/S. MAA-MOTOR'S", title: orgTitle }],
                        urls: [{ value: liveUrl, type: 'Live Due Card' }],
                        biographies: [{ value: bioText }]
                    };

                    if (hasMMTag || !existingName) {
                        updateFields.push('names');
                        payload.names = [{ givenName: displayName }];
                    }

                    const updateUrl = `https://people.googleapis.com/v1/${matched.resourceName}:updateContact?updatePersonFields=${updateFields.join(',')}`;
                    const patchRes = await fetch(updateUrl, {
                        method: 'PATCH',
                        headers: {
                            Authorization: `Bearer ${accessToken}`,
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify(payload)
                    });
                    if (patchRes.ok) updated++;
                    else failed++;
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
                            Authorization: `Bearer ${accessToken}`,
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify(createPayload)
                    });
                    if (postRes.ok) created++;
                    else failed++;
                }
            } catch (itemErr) {
                console.error('Error syncing contact:', c.name, itemErr);
                failed++;
            }

            // রেট লিমিট বাফার
            if (i % 5 === 0) await new Promise(r => setTimeout(r, 60));
        }

        await db.collection('settings').doc('google_sync').set({
            lastSyncAt: new Date().toISOString(),
            lastSyncStats: { updated, created, failed, total: customers.length }
        }, { merge: true });

        return { success: true, updated, created, failed, total: customers.length };
    } finally {
        isSyncingInBackground = false;
    }
}

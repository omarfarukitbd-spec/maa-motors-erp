/**
 * godown-google-sync.js
 * Google People API 2-Way Sync Engine for Godown Logistics & Support Contacts
 */

import { db } from '../firebase-config.js';
import { getAllSilentAccessTokens } from '../customer/google-auth-client.js';
import { fetchWithRetry } from '../customer/google-contact-sync-service.js';
import { normalizePhoneNumber, getCategoryMeta } from './godown-contact-calc.js';
import { showToast } from '../utils/ui-helpers.js';

export const GODOWN_GOOGLE_GROUP_NAME = "MAA MOTORS - গোডাউন লজিস্টিকস";

const _groupResourceMap = new Map(); // token -> groupResourceName

/**
 * Ensure the dedicated Google Contact Group exists on user's Google Account
 */
export async function ensureGodownContactGroup(accessToken) {
    if (!accessToken) return null;
    if (_groupResourceMap.has(accessToken)) {
        return _groupResourceMap.get(accessToken);
    }

    try {
        const listUrl = 'https://people.googleapis.com/v1/contactGroups';
        const res = await fetchWithRetry(listUrl, {
            headers: { Authorization: `Bearer ${accessToken}` }
        });

        if (res && res.ok) {
            const data = await res.json();
            const found = (data.contactGroups || []).find(g => g.name === GODOWN_GOOGLE_GROUP_NAME);
            if (found) {
                _groupResourceMap.set(accessToken, found.resourceName);
                return found.resourceName;
            }
        }

        // Create group if missing
        const createRes = await fetchWithRetry(listUrl, {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${accessToken}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ contactGroup: { name: GODOWN_GOOGLE_GROUP_NAME } })
        });

        if (createRes && createRes.ok) {
            const created = await createRes.json();
            _groupResourceMap.set(accessToken, created.resourceName);
            return created.resourceName;
        }
    } catch (e) {
        console.warn('Godown contact group check error:', e);
    }
    return null;
}

/**
 * Search existing contact in Google by phone number
 */
async function findMatchingContact(accessToken, phone, name) {
    if (!phone && !name) return null;
    try {
        const query = (phone || '').replace(/\D/g, '').slice(-10) || name;
        const searchUrl = `https://people.googleapis.com/v1/people:searchContacts?query=${encodeURIComponent(query)}&readMask=names,phoneNumbers,organizations,memberships,metadata`;
        const res = await fetchWithRetry(searchUrl, {
            headers: { Authorization: `Bearer ${accessToken}` }
        });
        if (res && res.ok) {
            const data = await res.json();
            if (data.results && data.results.length > 0) {
                return data.results[0].person;
            }
        }
    } catch (e) {
        console.warn('Find matching contact error:', e);
    }
    return null;
}

/**
 * Sync single godown contact to all active Google devices
 */
export async function syncSingleGodownContactToGoogle(contactId) {
    if (!contactId) return { success: false, error: 'No contact ID' };

    const doc = await db.collection('godown_contacts').doc(contactId).get();
    if (!doc.exists) return { success: false, error: 'Contact not found' };

    const c = doc.data();
    const activeTokens = await getAllSilentAccessTokens();
    if (activeTokens.length === 0) {
        return { success: false, error: 'কোনো সচল গুগল একাউন্ট সংযুক্ত নেই' };
    }

    const cleanPhone = normalizePhoneNumber(c.phone);
    if (!cleanPhone) {
        return { success: false, error: 'কোনো মোবাইল নম্বর নেই' };
    }

    const catMeta = getCategoryMeta(c.category);
    const displayName = `[MM-গোডাউন] ${c.name} (${c.role || catMeta.title})`;
    const bioText = [
        `ক্যাটাগরি: ${catMeta.title}`,
        `ভূমিকা: ${c.role || '-'}`,
        c.standardRate ? `ভাড়া/মজুরি: ${c.standardRate}` : '',
        c.vehicleNo ? `গাড়ির নম্বর: ${c.vehicleNo}` : '',
        c.location ? `স্ট্যান্ড/এলাকা: ${c.location}` : '',
        c.notes ? `নোট: ${c.notes}` : ''
    ].filter(Boolean).join('\n');

    const phoneList = [{ value: cleanPhone, type: 'Mobile' }];
    if (c.altPhone) {
        const altClean = normalizePhoneNumber(c.altPhone);
        if (altClean) phoneList.push({ value: altClean, type: 'Work' });
    }

    let syncedAny = false;

    for (const acc of activeTokens) {
        try {
            const groupResName = await ensureGodownContactGroup(acc.accessToken);
            const matched = await findMatchingContact(acc.accessToken, cleanPhone, c.name);

            if (matched) {
                // Update contact
                const updateUrl = `https://people.googleapis.com/v1/${matched.resourceName}:updateContact?updatePersonFields=names,phoneNumbers,organizations,biographies,addresses,memberships`;
                const updatePayload = {
                    etag: matched.etag,
                    names: [{ givenName: displayName }],
                    phoneNumbers: phoneList,
                    organizations: [{ name: "M/S. MAA-MOTOR'S", title: `গোডাউন • ${c.role || catMeta.title}` }],
                    biographies: [{ value: bioText }],
                    addresses: [{ streetAddress: c.location || '', type: 'Work' }],
                    memberships: groupResName ? [{ contactGroupMembership: { contactGroupResourceName: groupResName } }] : undefined
                };

                await fetchWithRetry(updateUrl, {
                    method: 'PATCH',
                    headers: {
                        Authorization: `Bearer ${acc.accessToken}`,
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(updatePayload)
                });
                syncedAny = true;
            } else {
                // Create contact
                const createUrl = 'https://people.googleapis.com/v1/people:createContact';
                const createPayload = {
                    names: [{ givenName: displayName }],
                    phoneNumbers: phoneList,
                    organizations: [{ name: "M/S. MAA-MOTOR'S", title: `গোডাউন • ${c.role || catMeta.title}` }],
                    biographies: [{ value: bioText }],
                    addresses: [{ streetAddress: c.location || '', type: 'Work' }],
                    memberships: groupResName ? [{ contactGroupMembership: { contactGroupResourceName: groupResName } }] : undefined
                };

                const crRes = await fetchWithRetry(createUrl, {
                    method: 'POST',
                    headers: {
                        Authorization: `Bearer ${acc.accessToken}`,
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(createPayload)
                });
                if (crRes && crRes.ok) syncedAny = true;
            }
        } catch (devErr) {
            console.error(`Godown contact sync error for ${acc.label}:`, devErr);
        }
    }

    if (syncedAny) {
        await db.collection('godown_contacts').doc(contactId).update({
            isGoogleSynced: true,
            googleSyncedAt: new Date().toISOString()
        });
    }

    return { success: syncedAny };
}

/**
 * Non-blocking Background Trigger
 */
export function triggerSilentGodownContactGoogleSync(contactId) {
    if (!contactId) return;
    setTimeout(() => {
        syncSingleGodownContactToGoogle(contactId).catch(err => {
            console.error('Background godown contact sync error:', err);
        });
    }, 200);
}

/**
 * Bulk Sync All Godown Contacts
 */
export async function executeBulkGodownGoogleSync(onProgress) {
    const snap = await db.collection('godown_contacts').get();
    if (snap.empty) {
        return { success: true, count: 0 };
    }

    const contacts = snap.docs.map(d => ({ id: d.id, ...d.data() }));
    let completed = 0;
    let failed = 0;

    for (const c of contacts) {
        try {
            const res = await syncSingleGodownContactToGoogle(c.id);
            if (res.success) completed++;
            else failed++;
        } catch (e) {
            failed++;
        }
        if (typeof onProgress === 'function') {
            onProgress(completed + failed, contacts.length);
        }
    }

    return {
        success: true,
        total: contacts.length,
        synced: completed,
        failed
    };
}

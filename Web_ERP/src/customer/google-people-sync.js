import Swal from 'sweetalert2';
import { SettingsDAO, CustomerDAO } from '../dao.js';
import { formatAmountWithComma, showToast, promptSecurityPin, escapeHTML } from '../utils.js';
import { getCustomerCache } from './customer-state.js';
import { generateBossToken } from './boss-card-token.js';
import { parsePhoneNumbers, normalizeBengaliNumbers, buildContactDisplayName } from './customer-contact-export-helpers.js';

let isGisLoaded = false;

/**
 * Google Identity Services (GIS) স্ক্রিপ্ট ডায়নামিকালি লোড করে
 */
async function loadGisScript() {
    if (window.google?.accounts?.oauth2) return true;
    if (isGisLoaded) return true;

    return new Promise((resolve, reject) => {
        const script = document.createElement('script');
        script.src = 'https://accounts.google.com/gsi/client';
        script.async = true;
        script.defer = true;
        script.onload = () => {
            isGisLoaded = true;
            resolve(true);
        };
        script.onerror = () => reject(new Error('Google Identity Services লোড করা সম্ভব হয়নি।'));
        document.head.appendChild(script);
    });
}

/**
 * গুগল ওআথ ক্লায়েন্ট আইডি কনফিগারেশন মডাল
 */
async function promptForGoogleClientId(currentId = '') {
    const { value: clientId } = await Swal.fire({
        title: '<div class="flex items-center justify-center gap-2 font-bn font-black text-white text-base"><i class="fa-brands fa-google text-red-400"></i><span>Google OAuth Client ID সেটআপ</span></div>',
        html: `
            <div class="text-left font-bn space-y-3.5 p-1 text-slate-200">
                <p class="text-xs text-slate-300 leading-relaxed">
                    Google People API-এর মাধ্যমে কন্টাক্ট অটো-সিঙ্ক করতে গুগল ক্লাউড কনসোলের <strong>OAuth 2.0 Web Client ID</strong> প্রয়োজন। এটি শুধুমাত্র একবার কনফিগার করতে হবে।
                </p>

                <div>
                    <label class="block text-[11px] font-bold text-indigo-400 uppercase tracking-wider mb-1 ml-1">OAuth Client ID দিন *</label>
                    <input id="google-client-id-input" type="text" value="${escapeHTML(currentId)}" placeholder="যেমন: 96761506330-xxxx.apps.googleusercontent.com" class="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white outline-none focus:border-indigo-500 font-mono font-bold">
                </div>

                <div class="p-3 bg-slate-900/90 rounded-2xl border border-slate-800 text-[11px] space-y-1 text-slate-400">
                    <span class="font-bold text-amber-400 block"><i class="fa-solid fa-circle-info mr-1"></i> Client ID কোথায় পাবেন?</span>
                    <p>১. <a href="https://console.cloud.google.com" target="_blank" class="text-indigo-400 underline font-bold">console.cloud.google.com</a>-এ প্রজেক্ট <strong>maa-motors-erp</strong> সিলেক্ট করুন।</p>
                    <p>২. <strong>APIs & Services &gt; Credentials</strong>-এ গিয়ে <strong>Create Credentials &gt; OAuth Client ID</strong> তৈরি করুন।</p>
                    <p>৩. Authorized JavaScript Origin-এ <code class="text-slate-300 font-mono">https://maa-motors-erp.web.app</code> যুক্ত করুন।</p>
                </div>
            </div>
        `,
        showCancelButton: true,
        confirmButtonText: '<i class="fa-solid fa-floppy-disk mr-1.5"></i> সেভ করুন ও সিঙ্ক শুরু করুন',
        cancelButtonText: 'বাতিল',
        customClass: {
            popup: '!bg-slate-950 !text-white !rounded-3xl border border-slate-800 font-bn w-[95%] max-w-lg',
            confirmButton: 'm3-btn-primary !bg-indigo-600 hover:!bg-indigo-500 !px-5 !py-2.5 !rounded-xl font-bold',
            cancelButton: '!bg-slate-800 hover:!bg-slate-700 !text-slate-300 !px-4 !py-2.5 !rounded-xl font-bold'
        },
        preConfirm: () => {
            const val = document.getElementById('google-client-id-input')?.value?.trim();
            if (!val) {
                Swal.showValidationMessage('Client ID প্রদান করা আবশ্যক!');
                return false;
            }
            return val;
        }
    });

    if (clientId) {
        try {
            await SettingsDAO.updateAppSettings({ googleOAuthClientId: clientId });
            showToast('Google OAuth Client ID সংরক্ষিত হয়েছে', 'success');
            return clientId;
        } catch (e) {
            console.error('Failed to save Client ID:', e);
            Swal.fire({ title: 'এরর!', text: 'Client ID সেভ করা যায়নি: ' + e.message, icon: 'error' });
            return null;
        }
    }
    return null;
}

const DEFAULT_CLIENT_ID = '861017217926-5m6p7oqqpflnk8v2tjt6uppo3b7m11je.apps.googleusercontent.com';

/**
 * Google People API দিয়ে সব কাস্টমার স্বয়ংক্রিয়ভাবে সিঙ্ক করার মূল কন্ট্রোলার
 */
export async function startGooglePeopleSyncFlow() {
    const isPinValid = await promptSecurityPin("গুগল কন্টাক্ট ক্লাউড অটো-সিঙ্ক");
    if (!isPinValid) return;

    try {
        await loadGisScript();
    } catch (e) {
        console.error('GIS Load Error:', e);
        return Swal.fire({
            title: 'গুগল সার্ভিস এরর',
            text: 'Google Identity Services লোড করা যায়নি। ইন্টারনেট সংযোগ চেক করুন।',
            icon: 'error',
            customClass: { popup: '!bg-slate-950 !text-white !rounded-3xl border border-slate-800 font-bn' }
        });
    }

    let settings = {};
    try {
        settings = await SettingsDAO.getAppSettings();
    } catch (e) {
        console.warn('Settings load fallback:', e);
    }

    let clientId = DEFAULT_CLIENT_ID;
    if (settings.googleOAuthClientId && settings.googleOAuthClientId.includes('apps.googleusercontent.com')) {
        clientId = settings.googleOAuthClientId;
    }

    // কাস্টমার ডাটা রেডি করা
    let customers = getCustomerCache();
    if (!customers || customers.length === 0) {
        try {
            const snap = await CustomerDAO.collection.get();
            customers = [];
            snap.forEach(doc => customers.push({ id: doc.id, ...doc.data() }));
        } catch (e) {
            console.error('Error fetching customers:', e);
            customers = [];
        }
    }

    if (customers.length === 0) {
        return Swal.fire({
            title: 'কোনো কাস্টমার নেই',
            text: 'ডাটাবেজে বর্তমানে কোনো কাস্টমার রেকর্ড নেই।',
            icon: 'info',
            customClass: { popup: '!bg-slate-950 !text-white !rounded-3xl border border-slate-800 font-bn' }
        });
    }

    const choice = await Swal.fire({
        title: '<div class="flex items-center justify-center gap-2 font-bn font-black text-white text-base"><i class="fa-brands fa-google text-red-400"></i><span>গুগল অ্যাকাউন্টের অনুমতি দিন</span></div>',
        html: `
            <div class="text-left font-bn space-y-3 p-1 text-slate-300 text-xs">
                <p>বসের মোবাইলের ডায়লারে লাইভ বকেয়া আপডেট করতে বসের গুগল অ্যাকাউন্টটি নির্বাচন করে <strong>"Allow"</strong> বাটন দিন।</p>
                <div class="p-3 bg-indigo-950/40 border border-indigo-500/30 rounded-2xl flex items-center justify-between text-indigo-300">
                    <span>মোট সিঙ্কযোগ্য কাস্টমার:</span>
                    <strong class="text-white font-mono text-sm">${customers.length} জন</strong>
                </div>
            </div>
        `,
        showCancelButton: true,
        confirmButtonText: '<i class="fa-brands fa-google mr-1.5"></i> গুগল অ্যাকাউন্টে কানেক্ট করুন',
        cancelButtonText: 'বাতিল',
        customClass: {
            popup: '!bg-slate-950 !text-white !rounded-3xl border border-slate-800 font-bn',
            confirmButton: 'm3-btn-primary !bg-indigo-600 hover:!bg-indigo-500 !px-5 !py-2.5 !rounded-xl font-bold',
            cancelButton: '!bg-slate-800 hover:!bg-slate-700 !text-slate-300 !px-4 !py-2.5 !rounded-xl font-bold'
        }
    });

    if (!choice.isConfirmed) return;
    requestGoogleTokenAndSync(clientId, customers);
}

/**
 * গুগল ওআথ টোকেন গ্রহণ ও পিপল এপিআই কল করা
 */
function requestGoogleTokenAndSync(clientId, customers) {
    try {
        const tokenClient = window.google.accounts.oauth2.initTokenClient({
            client_id: clientId,
            scope: 'https://www.googleapis.com/auth/contacts',
            callback: async (tokenResponse) => {
                if (tokenResponse.error) {
                    console.error('Google Auth Error:', tokenResponse);
                    return Swal.fire({
                        title: 'অনুমোদন ব্যর্থ',
                        text: 'গুগল অ্যাকাউন্টের অনুমতি পাওয়া যায়নি: ' + tokenResponse.error,
                        icon: 'error',
                        customClass: { popup: '!bg-slate-950 !text-white !rounded-3xl border border-slate-800 font-bn' }
                    });
                }
                if (tokenResponse.access_token) {
                    await executePeopleApiSync(tokenResponse.access_token, customers);
                }
            }
        });

        tokenClient.requestAccessToken({ prompt: 'consent' });
    } catch (err) {
        console.error('GIS Client init error:', err);
        Swal.fire({
            title: 'ওআথ ক্লায়েন্ট এরর',
            text: 'Client ID সঠিক কিনা যাচাই করুন: ' + err.message,
            icon: 'error',
            customClass: { popup: '!bg-slate-950 !text-white !rounded-3xl border border-slate-800 font-bn' }
        });
    }
}

/**
 * গুগল পিপল এপিআই দিয়ে ফেচ, ম্যাচ ও ব্যাচ আপডেট সম্পন্ন করা
 */
async function executePeopleApiSync(accessToken, customers) {
    Swal.fire({
        title: '<div class="flex items-center justify-center gap-2 font-bn font-black text-white text-base"><i class="fa-solid fa-arrows-rotate fa-spin text-indigo-400"></i><span>গুগল কন্টাক্ট ক্লাউড সিঙ্ক চলছে...</span></div>',
        html: `
            <div class="text-center font-bn space-y-3 p-2 text-slate-300">
                <p id="sync-status-msg" class="text-xs font-bold text-slate-300">গুগল থেকে কন্টাক্ট তালিকা ফেচ করা হচ্ছে...</p>
                <div class="w-full bg-slate-800 rounded-full h-2.5 overflow-hidden border border-slate-700">
                    <div id="sync-progress-bar" class="bg-indigo-600 h-2.5 rounded-full transition-all duration-300" style="width: 10%"></div>
                </div>
                <span id="sync-count-txt" class="text-[11px] font-mono text-slate-400 block">০ / ${customers.length} সম্পন্ন</span>
            </div>
        `,
        allowOutsideClick: false,
        allowEscapeKey: false,
        showConfirmButton: false,
        customClass: { popup: '!bg-slate-950 !text-white !rounded-3xl border border-slate-800 font-bn' }
    });

    const statusEl = document.getElementById('sync-status-msg');
    const barEl = document.getElementById('sync-progress-bar');
    const countEl = document.getElementById('sync-count-txt');

    try {
        // ১. গুগলে বিদ্যমান কন্টাক্টগুলো ফেচ করা
        let googleContacts = [];
        let nextPageToken = '';
        do {
            const url = `https://people.googleapis.com/v1/people/me/connections?personFields=names,phoneNumbers,organizations,biographies,urls,metadata&pageSize=1000${nextPageToken ? `&pageToken=${nextPageToken}` : ''}`;
            const res = await fetch(url, { headers: { Authorization: `Bearer ${accessToken}` } });
            if (!res.ok) {
                let errMsg = 'গুগল কন্টাক্ট ডাটা রিড করতে ব্যর্থ';
                try {
                    const errJson = await res.json();
                    if (errJson.error?.message) errMsg = errJson.error.message;
                } catch (parseErr) {
                    console.warn('JSON parse fallback:', parseErr);
                }
                throw new Error(errMsg);
            }
            const data = await res.json();
            if (data.connections) googleContacts.push(...data.connections);
            nextPageToken = data.nextPageToken || '';
        } while (nextPageToken);

        if (statusEl) statusEl.innerText = `বিদ্যমান কন্টাক্ট পাওয়া গেছে: ${googleContacts.length} টি। ম্যাচিং ও আপডেট শুরু হচ্ছে...`;
        if (barEl) barEl.style.width = '25%';

        // ২. ফোন নম্বর ভিত্তিক ইন্ডেক্সিং (দ্রুত ম্যাচ করার জন্য)
        const phoneToContactMap = new Map();
        googleContacts.forEach(gc => {
            if (gc.phoneNumbers) {
                gc.phoneNumbers.forEach(pn => {
                    const clean = normalizeBengaliNumbers(pn.value).replace(/\D/g, '');
                    if (clean.length >= 10) {
                        const last10 = clean.slice(-10);
                        phoneToContactMap.set(last10, gc);
                    }
                });
            }
        });

        let updatedCount = 0;
        let createdCount = 0;
        let failedCount = 0;

        // ৩. প্রতি কাস্টমারের জন্য কন্টাক্ট তৈরি বা আপডেট করা
        for (let i = 0; i < customers.length; i++) {
            const c = customers[i];
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

            // ম্যাচিং চেক
            let matchedGoogleContact = null;
            for (const p of phones) {
                const digits = p.replace(/\D/g, '');
                if (digits.length >= 10) {
                    const last10 = digits.slice(-10);
                    if (phoneToContactMap.has(last10)) {
                        matchedGoogleContact = phoneToContactMap.get(last10);
                        break;
                    }
                }
            }

            try {
                if (matchedGoogleContact) {
                    // বসের আগের সেভ করা নাম সংরক্ষণ নীতি:
                    // যদি কন্টাক্টে বসের নিজস্ব নাম থাকে (কোনো [MM] ছাড়া), বসের নামটি অপরিবর্তিত রাখা হবে
                    const existingName = matchedGoogleContact.names?.[0]?.displayName || matchedGoogleContact.names?.[0]?.givenName || '';
                    const hasMMTag = existingName.includes('[MM]');

                    const updateFields = ['organizations', 'biographies', 'urls'];
                    const updatePayload = {
                        etag: matchedGoogleContact.etag,
                        organizations: [{ name: "M/S. MAA-MOTOR'S", title: orgTitle }],
                        urls: [{ value: liveUrl, type: 'Live Due Card' }],
                        biographies: [{ value: bioText }]
                    };

                    if (hasMMTag || !existingName) {
                        updateFields.push('names');
                        updatePayload.names = [{ givenName: displayName }];
                    }

                    const updateUrl = `https://people.googleapis.com/v1/${matchedGoogleContact.resourceName}:updateContact?updatePersonFields=${updateFields.join(',')}`;

                    const patchRes = await fetch(updateUrl, {
                        method: 'PATCH',
                        headers: {
                            Authorization: `Bearer ${accessToken}`,
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify(updatePayload)
                    });

                    if (patchRes.ok) {
                        updatedCount++;
                    } else {
                        failedCount++;
                    }
                } else if (phones.length > 0) {
                    // নতুন তৈরি
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

                    if (postRes.ok) {
                        createdCount++;
                    } else {
                        failedCount++;
                    }
                }
            } catch (singleErr) {
                console.error('Contact sync error for:', c.name, singleErr);
                failedCount++;
            }

            // প্রগ্রেস বার আপডেট
            const percent = Math.round(25 + ((i + 1) / customers.length) * 75);
            if (barEl) barEl.style.width = `${percent}%`;
            if (countEl) countEl.innerText = `${i + 1} / ${customers.length} সম্পন্ন`;
            if (statusEl) statusEl.innerText = `সিঙ্ক হচ্ছে: ${c.name || 'গ্রাহক'} (${dueText})`;

            // ছোট রেট লিমিট বাফার (Google API কোটা সেফটি)
            if (i % 5 === 0) {
                await new Promise(r => setTimeout(r, 60));
            }
        }

        // সফলতার সারসংক্ষেপ ডায়ালগ
        Swal.fire({
            title: '<div class="flex items-center justify-center gap-2 font-bn font-black text-emerald-400 text-lg"><i class="fa-solid fa-circle-check"></i><span>গুগল কন্টাক্ট সিঙ্ক সফল!</span></div>',
            html: `
                <div class="text-left font-bn space-y-3.5 p-2 text-slate-200">
                    <div class="p-3 bg-emerald-950/40 border border-emerald-500/30 rounded-2xl flex items-center justify-between text-xs">
                        <span class="text-emerald-300 font-bold">মোট কাস্টমার প্রসেসড:</span>
                        <strong class="text-white font-mono text-sm">${customers.length} জন</strong>
                    </div>

                    <div class="grid grid-cols-2 gap-2.5 text-xs text-center font-bold">
                        <div class="p-2.5 rounded-xl bg-slate-900 border border-slate-800">
                            <span class="text-slate-400 text-[10px] block">আপডেট হয়েছে</span>
                            <span class="text-blue-400 font-mono text-base">${updatedCount} জন</span>
                        </div>
                        <div class="p-2.5 rounded-xl bg-slate-900 border border-slate-800">
                            <span class="text-slate-400 text-[10px] block">নতুন যুক্ত হয়েছে</span>
                            <span class="text-emerald-400 font-mono text-base">${createdCount} জন</span>
                        </div>
                    </div>

                    ${failedCount > 0 ? `
                        <div class="p-2 rounded-xl bg-amber-950/30 border border-amber-500/30 text-[11px] text-amber-300 text-center">
                            <i class="fa-solid fa-triangle-exclamation mr-1"></i> ${failedCount} টি কন্টাক্ট স্কিপ বা এরর হয়েছে।
                        </div>
                    ` : ''}

                    <div class="p-3 bg-slate-900/90 rounded-2xl border border-slate-800 text-[11px] text-slate-300 space-y-1">
                        <span class="font-bold text-amber-400 block"><i class="fa-solid fa-mobile-screen mr-1"></i> মোবাইলে দেখার নিয়ম:</span>
                        <p>বসের মোবাইলের <strong>Google Contacts</strong> অ্যাপ খুললে অথবা ফোনবুকে সার্চ করলেই <strong>[MM]</strong> ট্যাগ সহ লাইভ বকেয়া দেখা যাবে!</p>
                    </div>
                </div>
            `,
            icon: 'success',
            confirmButtonText: 'ঠিক আছে',
            customClass: {
                popup: '!bg-slate-950 !text-white !rounded-3xl border border-slate-800 font-bn max-w-md',
                confirmButton: 'm3-btn-primary !bg-emerald-600 hover:!bg-emerald-500 !px-6 !py-2.5 !rounded-xl font-bold'
            }
        });
    } catch (err) {
        console.error('Fatal People API Sync Error:', err);
        Swal.fire({
            title: 'সিঙ্ক ব্যর্থ!',
            text: 'গুগল কন্টাক্ট সিঙ্ক করতে সমস্যা হয়েছে: ' + (err.message || ''),
            icon: 'error',
            customClass: { popup: '!bg-slate-950 !text-white !rounded-3xl border border-slate-800 font-bn' }
        });
    }
}

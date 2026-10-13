// ALLOW_LARGE_FILE: Google Sync Modal Control
import Swal from 'sweetalert2';
import { db } from '../firebase-config.js';
import { CustomerDAO } from '../dao.js';
import { getCustomerCache } from './customer-state.js';
import { showToast, promptSecurityPin, escapeHTML, formatAmountWithComma } from '../utils.js';
import { getConnectedGoogleAccounts, removeConnectedAccount, buildGoogleAuthUrl } from './google-auth-client.js';
import { executeFullGoogleContactsSync, getPendingDeltaInfo, trialPushCustomerPhotoBadge, fetchSingleCustomerIntelligence, executeBulkPhotoBadgeSync } from './google-contact-sync-service.js';
import { generateCustomerBadgeDataUrl } from './contact-badge-canvas.js';
import { executeSmartLabelSync } from './google-contact-groups.js';

function formatSyncTime(isoStr) {
    if (!isoStr) return '';
    try {
        const d = new Date(isoStr);
        if (isNaN(d.getTime())) return '';
        const now = new Date();
        const isToday = d.toDateString() === now.toDateString();
        const hours = d.getHours();
        const mins = String(d.getMinutes()).padStart(2, '0');
        const ampm = hours >= 12 ? 'PM' : 'AM';
        const h12 = hours % 12 || 12;
        const timeStr = `${h12}:${mins} ${ampm}`;
        if (isToday) return `আজ ${timeStr}`;
        const dateStr = `${d.getDate()}/${d.getMonth() + 1}`;
        return `${dateStr} ${timeStr}`;
    } catch (e) {
        console.error('formatSyncTime error:', e);
        return '';
    }
}

/**
 * এডমিন প্যানেলে গুগল সিঙ্ক ম্যানেজমেন্ট মডাল ওপেন করে (মাল্টি-ডিভাইস সাপোর্ট সহ)
 */
export async function openGoogleSyncAdminModal() {
    const isPinValid = await promptSecurityPin("গুগল কন্টাক্ট ক্লাউড অটো-সিঙ্ক");
    if (!isPinValid) return;

    Swal.fire({
        title: '<div class="flex items-center justify-center gap-2 font-bn font-black text-white text-base"><i class="fa-solid fa-circle-notch fa-spin text-indigo-400"></i><span>সিঙ্ক স্ট্যাটাস লোড হচ্ছে...</span></div>',
        allowOutsideClick: false,
        showConfirmButton: false,
        customClass: { popup: '!bg-slate-950 !text-white !rounded-3xl border border-slate-800 font-bn' }
    });

    const accounts = await getConnectedGoogleAccounts();
    const hasAccounts = accounts.length > 0;
    const hasUnsyncedAccounts = accounts.some(acc => !acc.lastSyncAt);

    let deltaInfo = { pendingCount: 0, totalCustomers: 0, hasSyncCache: false };
    try {
        deltaInfo = await getPendingDeltaInfo();
    } catch (deltaErr) {
        console.warn('Delta info fetch warning:', deltaErr);
    }

    let customers = getCustomerCache();
    if (!customers || customers.length === 0) {
        try {
            const snap = await CustomerDAO.collection.get();
            customers = [];
            snap.forEach(doc => customers.push({ id: doc.id, ...doc.data() }));
        } catch (cErr) {
            console.error('Customer fetch error:', cErr);
            customers = [];
        }
    }

    const sortedCustomers = [...customers].sort((a, b) => (Number(b.totalDue) || 0) - (Number(a.totalDue) || 0));
    const customerOptionsHtml = sortedCustomers.slice(0, 80).map(c => {
        const due = Number(c.totalDue) || 0;
        const dueStr = due > 0 ? `[৳ ${formatAmountWithComma(due)} বাকি]` : (due < 0 ? `[৳ ${formatAmountWithComma(Math.abs(due))} জমা]` : `[পরিশোধিত]`);
        return `<option value="${escapeHTML(c.id)}">${escapeHTML(c.name)} - ${escapeHTML(c.zone || '')} ${dueStr}</option>`;
    }).join('');

    let accountsHtml = '';
    if (hasAccounts) {
        accountsHtml = accounts.map(acc => {
            const isUnsynced = !acc.lastSyncAt;
            // নতুন সিঙ্ক বাকি থাকলে শুধু নতুনটি ডিফল্ট চেক, অন্যথায় সবগুলো চেক
            const isChecked = hasUnsyncedAccounts ? isUnsynced : true;
            const syncTimeText = formatSyncTime(acc.lastSyncAt);

            return `
                <div class="p-3 bg-slate-900 border border-slate-800 rounded-2xl flex items-center justify-between gap-2.5 transition-all hover:border-slate-700">
                    <div class="flex items-center gap-2.5 overflow-hidden flex-1">
                        <label class="flex items-center cursor-pointer shrink-0" title="সিঙ্ক করার জন্য নির্বাচন করুন">
                            <input type="checkbox" class="device-sync-chk w-4 h-4 rounded accent-indigo-500 cursor-pointer" data-id="${escapeHTML(acc.id)}" ${isChecked ? 'checked' : ''}>
                        </label>
                        <div class="w-8 h-8 rounded-xl bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center text-indigo-400 shrink-0">
                            <i class="fa-solid fa-mobile-screen text-xs"></i>
                        </div>
                        <div class="truncate">
                            <div class="flex items-center gap-1.5 truncate">
                                <span class="text-xs font-bold text-white truncate">${escapeHTML(acc.label || 'ডিভাইস')}</span>
                                ${isUnsynced ? `
                                    <span class="px-1.5 py-0.2 rounded bg-amber-500/15 border border-amber-500/30 text-[9px] font-bold text-amber-300 shrink-0">
                                        <i class="fa-solid fa-bell mr-0.5"></i> নতুন
                                    </span>
                                ` : ''}
                            </div>
                            <span class="text-[10px] text-slate-400 font-mono block truncate">${escapeHTML(acc.email || '')}</span>
                            <span class="text-[10px] ${isUnsynced ? 'text-amber-400 font-semibold' : 'text-slate-400 font-mono'} block truncate">
                                ${isUnsynced
                                    ? '<i class="fa-solid fa-circle-exclamation text-[9px] mr-1"></i>কখনো সিঙ্ক হয়নি'
                                    : `<i class="fa-solid fa-clock-rotate-left text-[9px] mr-1 text-slate-500"></i>সর্বশেষ: ${syncTimeText}`
                                }
                            </span>
                        </div>
                    </div>
                    <div class="flex items-center gap-1.5 shrink-0">
                        <button data-sync-id="${escapeHTML(acc.id)}" class="single-device-sync-btn px-2.5 py-1.5 rounded-xl bg-indigo-600/20 hover:bg-indigo-600 border border-indigo-500/30 text-indigo-300 hover:text-white flex items-center gap-1 text-[11px] font-bold transition-all cursor-pointer" title="শুধুমাত্র এই অ্যাকাউন্টে সিঙ্ক করুন">
                            <i class="fa-solid fa-arrows-rotate text-[10px]"></i>
                            <span>সিঙ্ক</span>
                        </button>
                        <button data-acc-id="${escapeHTML(acc.id)}" class="remove-acc-btn w-7 h-7 rounded-xl bg-red-950/40 hover:bg-red-900/60 border border-red-500/30 text-red-400 flex items-center justify-center text-xs transition-colors cursor-pointer" title="ডিভাইসটি সংযোগ বিচ্ছিন্ন করুন">
                            <i class="fa-solid fa-trash-can"></i>
                        </button>
                    </div>
                </div>
            `;
        }).join('');
    } else {
        accountsHtml = `
            <div class="p-4 bg-slate-900/60 border border-dashed border-slate-800 rounded-2xl text-center text-slate-400 text-xs space-y-1">
                <i class="fa-solid fa-link-slash text-2xl text-slate-500 block mb-1"></i>
                <span>কোনো গুগল অ্যাকাউন্ট কানেক্ট করা নেই।</span>
            </div>
        `;
    }

    await Swal.fire({
        title: '<div class="flex items-center justify-center gap-2 font-bn font-black text-white text-base"><i class="fa-brands fa-google text-red-400"></i><span>Google Contacts অটো-সিঙ্ক কন্ট্রোল</span></div>',
        html: `
            <div class="text-left font-bn space-y-3 p-1 text-slate-200 text-xs">
                <!-- কানেক্টেড ডিভাইস লিস্ট -->
                <div>
                    <div class="flex items-center justify-between mb-2">
                        <span class="text-[11px] font-bold text-indigo-400 uppercase tracking-wider">সংযুক্ত ডিভাইসসমূহ (${accounts.length} টি)</span>
                        ${hasAccounts ? `
                            <label class="flex items-center gap-1.5 cursor-pointer text-[10px] text-slate-300 hover:text-white font-bold select-none" title="সবগুলো নির্বাচন বা বাতিল করুন">
                                <input type="checkbox" id="select-all-devices-chk" class="w-3.5 h-3.5 rounded accent-indigo-500 cursor-pointer">
                                <span>সবগুলো নির্বাচন</span>
                            </label>
                        ` : ''}
                    </div>
                    <div class="space-y-2 max-h-48 overflow-y-auto pr-1">
                        ${accountsHtml}
                    </div>
                </div>

                <!-- লাইভ সিঙ্ক স্থিতি ব্যাজ -->
                <div class="p-2.5 bg-slate-900/90 rounded-2xl border border-slate-800 flex items-center justify-between gap-2">
                    <div class="flex items-center gap-2 text-slate-300">
                        <i class="fa-solid fa-bolt text-indigo-400"></i>
                        <span class="font-bold text-[11px]">সিঙ্ক স্থিতি:</span>
                    </div>
                    <div>
                        ${deltaInfo.pendingCount > 0 ? `
                            <span class="px-2.5 py-1 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-300 font-bold text-[10px]">
                                <i class="fa-solid fa-triangle-exclamation mr-1"></i>বকেয়া পরিবর্তন হয়েছে: ${deltaInfo.pendingCount} জন
                            </span>
                        ` : `
                            <span class="px-2.5 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 font-bold text-[10px]">
                                <i class="fa-solid fa-circle-check mr-1"></i>সবাই আপ-টু-ডেট (${deltaInfo.totalCustomers} জন)
                            </span>
                        `}
                    </div>
                </div>

                <!-- কল স্ক্রিন ও ফিচারের সুবিধা -->
                <div class="p-3 bg-slate-900/90 rounded-2xl border border-slate-800 text-[11px] space-y-1 text-slate-300">
                    <span class="font-bold text-amber-400 block"><i class="fa-solid fa-phone-volume mr-1"></i> লাইভ কলার আইডি সুবিধা:</span>
                    <p>• কল স্ক্রিনে বড় করে দেখা যাবে: <code>[MM] নাম - এলাকা [৳ ১৫,০০০]</code></p>
                    <p>• ডায়ালারে থাকবে: <span class="text-emerald-400 font-bold">শেষ জমা: ২০ দিন আগে</span> (তারিখ ও জমার অংক)।</p>
                    <p>• কলার ফটো ব্যাজ: বকেয়া থাকলে লাল, পরিশোধিত হলে সবুজ ব্যালেন্স ব্যাজ।</p>
                </div>

                <!-- স্যাম্পল ফটো ব্যাজ ও ট্রায়াল টেস্ট সেকশন -->
                <div class="p-3 bg-indigo-950/40 rounded-2xl border border-indigo-500/30 text-[11px] space-y-2">
                    <div class="flex items-center justify-between">
                        <span class="font-bold text-indigo-300 flex items-center gap-1.5">
                            <i class="fa-solid fa-id-badge text-xs text-indigo-400"></i>
                            <span>স্যাম্পল কলার আইডি ও ফটো ব্যাজ ট্রায়াল</span>
                        </span>
                        <span class="px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 text-[9px] font-bold">
                            Pilot Test
                        </span>
                    </div>
                    <p class="text-slate-300 text-[10px]">
                        ১ জন কাস্টমার বেছে নিয়ে ডায়ালার কার্ড প্রিভিউ দেখুন এবং সরাসরি আপনার ফোনে ট্রায়াল পুশ পাঠান:
                    </p>
                    <div class="space-y-1.5">
                        <select id="modal-trial-cust-select" class="w-full bg-slate-900 border border-slate-700 rounded-xl px-2.5 py-1.5 text-xs text-white outline-none focus:border-indigo-500">
                            ${customerOptionsHtml}
                        </select>
                        <div class="flex items-center gap-2">
                            <button type="button" id="modal-trial-preview-btn" class="flex-1 py-1.5 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 font-bold flex items-center justify-center gap-1.5 cursor-pointer text-xs transition-colors">
                                <i class="fa-solid fa-eye text-indigo-400"></i>
                                <span>প্রিভিউ দেখুন</span>
                            </button>
                            <button type="button" id="modal-trial-push-btn" class="flex-1 py-1.5 px-3 rounded-xl bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 text-white font-bold flex items-center justify-center gap-1.5 cursor-pointer text-xs shadow-md transition-all active:scale-[0.98]">
                                <i class="fa-solid fa-paper-plane"></i>
                                <span>ফোনে টেস্ট পুশ</span>
                            </button>
                        </div>
                    </div>
                </div>

                <!-- বাটন গ্রুপ -->
                <div class="space-y-2 pt-1">
                    <button id="modal-gen-link-btn" class="w-full bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 text-white font-bold py-2.5 px-4 rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-[0.98]">
                        <i class="fa-brands fa-whatsapp text-base"></i>
                        <span>নতুন ডিভাইসের জন্য WhatsApp লিংক তৈরি করুন</span>
                    </button>

                    ${hasAccounts ? `
                        ${deltaInfo.pendingCount > 0 ? `
                            <button id="modal-delta-sync-btn" class="w-full bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 text-white font-bold py-2.5 px-4 rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-[0.98]">
                                <i class="fa-solid fa-bolt text-sm"></i>
                                <span id="modal-delta-btn-text">দ্রুত ডেল্টা সিঙ্ক চালান (${deltaInfo.pendingCount} জন)</span>
                            </button>
                            <button id="modal-full-sync-btn" class="w-full bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white font-bold py-2 px-4 rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-[0.98] text-[11px]">
                                <i class="fa-solid fa-arrows-rotate text-xs"></i>
                                <span id="modal-sync-btn-text">সম্পূর্ণ ডাটাবেজ রি-সিঙ্ক (${deltaInfo.totalCustomers} জন)</span>
                            </button>
                        ` : `
                            <button id="modal-full-sync-btn" class="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-2.5 px-4 rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-[0.98]">
                                <i class="fa-solid fa-arrows-rotate text-sm"></i>
                                <span id="modal-sync-btn-text">সম্পূর্ণ ডাটাবেজ সিঙ্ক চালান (${deltaInfo.totalCustomers} জন)</span>
                            </button>
                        `}
                        <button id="modal-bulk-photo-sync-btn" class="w-full bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white font-bold py-2.5 px-4 rounded-xl shadow-lg shadow-indigo-950/50 transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-[0.98]">
                            <i class="fa-solid fa-id-badge text-yellow-300 text-sm"></i>
                            <span id="modal-photo-sync-btn-text">সকল কাস্টমারের ফটো ব্যাজ সিঙ্ক করুন</span>
                        </button>
                        <button id="modal-smart-label-sync-btn" class="w-full bg-gradient-to-r from-amber-600 via-orange-600 to-amber-700 hover:from-amber-500 hover:to-orange-500 text-white font-bold py-2.5 px-4 rounded-xl shadow-lg shadow-amber-950/40 transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-[0.98]">
                            <i class="fa-solid fa-tags text-yellow-200 text-sm"></i>
                            <span id="modal-label-btn-text">স্মার্ট কন্টাক্ট লেবেল সিঙ্ক করুন</span>
                        </button>
                    ` : `
                        <button id="modal-direct-connect-btn" class="w-full bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold py-2.5 px-4 rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-[0.98]">
                            <i class="fa-brands fa-google text-red-400"></i>
                            <span>এই কম্পিউটার থেকে সরাসরি কানেক্ট করুন</span>
                        </button>
                    `}
                </div>
            </div>
        `,
        showConfirmButton: false,
        showCloseButton: true,
        customClass: {
            popup: '!bg-slate-950 !text-white !rounded-3xl border border-slate-800 font-bn w-[95%] max-w-md',
            closeButton: '!text-slate-400 hover:!text-white'
        },
        didOpen: () => {
            const linkBtn = document.getElementById('modal-gen-link-btn');
            const syncBtn = document.getElementById('modal-full-sync-btn');
            const deltaSyncBtn = document.getElementById('modal-delta-sync-btn');
            const directBtn = document.getElementById('modal-direct-connect-btn');
            const selectAllEl = document.getElementById('select-all-devices-chk');

            const updateSyncButtonLabel = () => {
                const checkedBoxes = Array.from(document.querySelectorAll('.device-sync-chk:checked'));
                const allBoxes = Array.from(document.querySelectorAll('.device-sync-chk'));
                const btnTextEl = document.getElementById('modal-sync-btn-text');
                const deltaBtnTextEl = document.getElementById('modal-delta-btn-text');
                const photoBtnTextEl = document.getElementById('modal-photo-sync-btn-text');
                const labelBtnTextEl = document.getElementById('modal-label-btn-text');

                if (selectAllEl && allBoxes.length > 0) {
                    selectAllEl.checked = checkedBoxes.length === allBoxes.length;
                    selectAllEl.indeterminate = checkedBoxes.length > 0 && checkedBoxes.length < allBoxes.length;
                }

                const countStr = checkedBoxes.length === allBoxes.length
                    ? `সকল ডিভাইসে (${allBoxes.length} টি)`
                    : `নির্বাচিত ডিভাইসে (${checkedBoxes.length} টি)`;

                if (btnTextEl) {
                    if (checkedBoxes.length > 0) {
                        btnTextEl.innerText = `সম্পূর্ণ রি-সিঙ্ক - ${countStr}`;
                    } else {
                        btnTextEl.innerText = `ডিভাইস নির্বাচন করুন (০ টি)`;
                    }
                }

                if (deltaBtnTextEl) {
                    if (checkedBoxes.length > 0) {
                        deltaBtnTextEl.innerText = `দ্রুত সিঙ্ক (${deltaInfo.pendingCount} জন) - ${countStr}`;
                    } else {
                        deltaBtnTextEl.innerText = `ডিভাইস নির্বাচন করুন (০ টি)`;
                    }
                }

                if (photoBtnTextEl) {
                    if (checkedBoxes.length > 0) {
                        photoBtnTextEl.innerText = `সকল ফটো ব্যাজ সিঙ্ক - ${countStr}`;
                    } else {
                        photoBtnTextEl.innerText = `ডিভাইস নির্বাচন করুন (০ টি)`;
                    }
                }

                if (labelBtnTextEl) {
                    if (checkedBoxes.length > 0) {
                        labelBtnTextEl.innerText = `স্মার্ট লেবেল সিঙ্ক - ${countStr}`;
                    } else {
                        labelBtnTextEl.innerText = `ডিভাইস নির্বাচন করুন (০ টি)`;
                    }
                }
            };

            // চেকবক্স হ্যান্ডলার
            document.querySelectorAll('.device-sync-chk').forEach(chk => {
                chk.addEventListener('change', updateSyncButtonLabel);
            });

            // মাস্টার সিলেক্ট অল
            if (selectAllEl) {
                selectAllEl.addEventListener('change', (e) => {
                    const isChecked = e.target.checked;
                    document.querySelectorAll('.device-sync-chk').forEach(chk => {
                        chk.checked = isChecked;
                    });
                    updateSyncButtonLabel();
                });
            }

            // প্রাথমিক বাটন লেবেল সেট
            updateSyncButtonLabel();

            if (linkBtn) linkBtn.addEventListener('click', promptAndGenerateLink);
            if (directBtn) directBtn.addEventListener('click', () => {
                window.location.href = buildGoogleAuthUrl('direct', 'দোকান পিসি');
            });

            // একক ডিভাইস সিঙ্ক বাটন হ্যান্ডলার
            document.querySelectorAll('.single-device-sync-btn').forEach(btn => {
                btn.addEventListener('click', async (e) => {
                    const accId = e.currentTarget.getAttribute('data-sync-id');
                    if (accId) {
                        const useDelta = deltaInfo.pendingCount > 0;
                        await handleManualFullSync([accId], useDelta);
                    }
                });
            });

            // দ্রুত ডেল্টা সিঙ্ক বাটন
            if (deltaSyncBtn) {
                deltaSyncBtn.addEventListener('click', () => {
                    const checkedBoxes = Array.from(document.querySelectorAll('.device-sync-chk:checked'));
                    if (checkedBoxes.length === 0) {
                        showToast('দয়া করে সিঙ্ক করার জন্য অন্তত ১টি ডিভাইস নির্বাচন করুন', 'warning');
                        return;
                    }
                    const targetIds = checkedBoxes.map(cb => cb.getAttribute('data-id'));
                    handleManualFullSync(targetIds, true);
                });
            }

            // সম্পূর্ণ সিঙ্ক বাটন (নির্বাচিত ডিভাইসসমূহ)
            if (syncBtn) {
                syncBtn.addEventListener('click', () => {
                    const checkedBoxes = Array.from(document.querySelectorAll('.device-sync-chk:checked'));
                    if (checkedBoxes.length === 0) {
                        showToast('দয়া করে সিঙ্ক করার জন্য অন্তত ১টি ডিভাইস নির্বাচন করুন', 'warning');
                        return;
                    }
                    const targetIds = checkedBoxes.map(cb => cb.getAttribute('data-id'));
                    handleManualFullSync(targetIds, false);
                });
            }

            // বাল্ক ফটো ব্যাজ সিঙ্ক বাটন (নির্বাচিত ডিভাইসসমূহ)
            const bulkPhotoBtn = document.getElementById('modal-bulk-photo-sync-btn');
            if (bulkPhotoBtn) {
                bulkPhotoBtn.addEventListener('click', () => {
                    const checkedBoxes = Array.from(document.querySelectorAll('.device-sync-chk:checked'));
                    if (checkedBoxes.length === 0) {
                        showToast('দয়া করে সিঙ্ক করার জন্য অন্তত ১টি ডিভাইস নির্বাচন করুন', 'warning');
                        return;
                    }
                    const targetIds = checkedBoxes.map(cb => cb.getAttribute('data-id'));
                    handleBulkPhotoSync(targetIds);
                });
            }

            // স্মার্ট কন্টাক্ট লেবেল সিঙ্ক বাটন (নির্বাচিত ডিভাইসসমূহ)
            const smartLabelBtn = document.getElementById('modal-smart-label-sync-btn');
            if (smartLabelBtn) {
                smartLabelBtn.addEventListener('click', () => {
                    const checkedBoxes = Array.from(document.querySelectorAll('.device-sync-chk:checked'));
                    if (checkedBoxes.length === 0) {
                        showToast('দয়া করে সিঙ্ক করার জন্য অন্তত ১টি ডিভাইস নির্বাচন করুন', 'warning');
                        return;
                    }
                    const targetIds = checkedBoxes.map(cb => cb.getAttribute('data-id'));
                    handleSmartLabelSync(targetIds);
                });
            }

            // রিমুভ অ্যাকাউন্ট ইভেন্ট লিসেনার
            document.querySelectorAll('.remove-acc-btn').forEach(btn => {
                btn.addEventListener('click', async (e) => {
                    const accId = e.currentTarget.getAttribute('data-acc-id');
                    if (accId) await handleRemoveAccount(accId);
                });
            });

            // ট্রায়াল প্রিভিউ ও পুশ হ্যান্ডলার
            const trialSelect = document.getElementById('modal-trial-cust-select');
            const trialPreviewBtn = document.getElementById('modal-trial-preview-btn');
            const trialPushBtn = document.getElementById('modal-trial-push-btn');

            const executeTrialPush = async (custId, custName) => {
                Swal.fire({
                    title: '<div class="flex items-center justify-center gap-2 font-bn font-black text-white text-base"><i class="fa-solid fa-circle-notch fa-spin text-emerald-400"></i><span>ফোনে টেস্ট পুশ পাঠানো হচ্ছে...</span></div>',
                    html: `<p class="text-xs text-slate-400 font-bn mt-2">${escapeHTML(custName)}-এর ফটো ব্যাজ ও ব্যালেন্স গুগলে আপলোড হচ্ছে...</p>`,
                    allowOutsideClick: false,
                    showConfirmButton: false,
                    customClass: { popup: '!bg-slate-950 !text-white !rounded-3xl border border-slate-800 font-bn' }
                });

                try {
                    const result = await trialPushCustomerPhotoBadge(custId);
                    const hasPhoto = result.deviceResults.some(r => r.photoUpdated);
                    const deviceNames = result.deviceResults.map(r => r.accountLabel).join(', ');

                    await Swal.fire({
                        icon: 'success',
                        title: '<div class="font-bn font-black text-emerald-400 text-lg">টেস্ট পুশ সফল হয়েছে!</div>',
                        html: `
                            <div class="font-bn text-left text-xs space-y-2.5 text-slate-300 p-1">
                                <p class="text-white font-bold">
                                    <i class="fa-solid fa-circle-check text-emerald-400 mr-1.5"></i>
                                    ${escapeHTML(custName)}-এর কলার আইডি আপনার ফোনে পুশ সম্পন্ন হয়েছে।
                                </p>
                                <div class="p-2.5 bg-slate-900 rounded-xl border border-slate-800 space-y-1">
                                    <p>• সিঙ্ককৃত ডিভাইস: <span class="font-bold text-white">${escapeHTML(deviceNames || 'ডিভাইস')}</span></p>
                                    <p>• ফটো ব্যাজ স্ট্যাটাস: <span class="font-bold ${hasPhoto ? 'text-emerald-400' : 'text-amber-400'}">${hasPhoto ? 'আপলোড সফল' : 'পেন্ডিং / ব্যাকগ্রাউন্ড'}</span></p>
                                </div>
                                <div class="p-2.5 bg-emerald-950/40 rounded-xl border border-emerald-500/30 text-[11px] text-emerald-300">
                                    <i class="fa-solid fa-mobile-screen mr-1 text-emerald-400"></i>
                                    <strong>মোবাইলে চেক করুন:</strong> আপনার ফোন বা গুগল কন্টাক্টস অ্যাপ ওপেন করে ${escapeHTML(custName)}-এর প্রোফাইলটি রিফ্রেশ করুন এবং কলার আইডি কার্ডটি দেখুন!
                                </div>
                            </div>
                        `,
                        confirmButtonText: 'ঠিক আছে',
                        customClass: {
                            popup: '!bg-slate-950 !text-white !rounded-3xl border border-slate-800 font-bn max-w-sm',
                            confirmButton: '!bg-indigo-600 hover:!bg-indigo-500 !text-white !font-bold !rounded-xl !px-5 !py-2.5 !text-xs cursor-pointer'
                        }
                    });
                } catch (err) {
                    console.error('Trial push error:', err);
                    Swal.fire({
                        icon: 'error',
                        title: '<div class="font-bn font-black text-red-400 text-base">টেস্ট পুশ ব্যর্থ হয়েছে</div>',
                        text: err.message || 'অজানা ত্রুটি ঘটেছে',
                        customClass: {
                            popup: '!bg-slate-950 !text-white !rounded-3xl border border-slate-800 font-bn max-w-sm',
                            confirmButton: '!bg-slate-800 !text-white !rounded-xl !px-4 !py-2 !text-xs'
                        }
                    });
                }
            };

            if (trialPreviewBtn && trialSelect) {
                trialPreviewBtn.addEventListener('click', async () => {
                    const custId = trialSelect.value;
                    if (!custId) {
                        showToast('দয়া করে একজন কাস্টমার নির্বাচন করুন', 'warning');
                        return;
                    }
                    const cust = customers.find(c => c.id === custId);
                    if (!cust) return;

                    Swal.fire({
                        title: '<div class="flex items-center justify-center gap-2 font-bn font-black text-white text-base"><i class="fa-solid fa-circle-notch fa-spin text-indigo-400"></i><span>প্রিভিউ তৈরি হচ্ছে...</span></div>',
                        allowOutsideClick: false,
                        showConfirmButton: false,
                        customClass: { popup: '!bg-slate-950 !text-white !rounded-3xl border border-slate-800 font-bn' }
                    });

                    const totalDue = Number(cust.totalDue) || 0;
                    const intelligence = await fetchSingleCustomerIntelligence(custId, totalDue);
                    const dataUrl = generateCustomerBadgeDataUrl(cust, intelligence);

                    const previewModalRes = await Swal.fire({
                        title: `<div class="font-bn font-black text-white text-base flex items-center justify-center gap-2">
                            <i class="fa-solid fa-id-badge text-indigo-400"></i>
                            <span>${escapeHTML(cust.name)} - কলার আইডি প্রিভিউ</span>
                        </div>`,
                        html: `
                            <div class="space-y-3 text-center font-bn p-1">
                                <p class="text-xs text-slate-300">গুগল ও শাওমি ডায়ালারে ফোন আসার সময় কলার স্ক্রিনে যেমন দেখাবে:</p>
                                <div class="relative inline-block my-2">
                                    <img src="${dataUrl}" class="w-56 h-56 rounded-full border-4 border-indigo-500/50 shadow-2xl mx-auto block object-cover" alt="Caller Badge">
                                    <span class="absolute bottom-1 right-2 bg-slate-950/90 text-[10px] text-slate-300 px-2 py-0.5 rounded-full border border-slate-700">
                                        Circular Crop
                                    </span>
                                </div>
                                <div class="p-2.5 bg-slate-900 rounded-xl border border-slate-800 text-left text-xs space-y-1">
                                    <div class="flex justify-between text-slate-300">
                                        <span>হিসাব নং:</span>
                                        <span class="font-bold text-white">#${escapeHTML(cust.accountNo || '-')}</span>
                                    </div>
                                    <div class="flex justify-between text-slate-300">
                                        <span>বর্তমান অবস্থা:</span>
                                        <span class="font-bold ${totalDue > 0 ? 'text-red-400' : 'text-emerald-400'}">${totalDue > 0 ? `বকেয়া ৳ ${formatAmountWithComma(totalDue)}` : 'পরিশোধিত'}</span>
                                    </div>
                                    <div class="flex justify-between text-slate-300">
                                        <span>পেমেন্ট রিকারেন্সি:</span>
                                        <span class="font-bold text-amber-300">${escapeHTML(intelligence.lastPaymentRecencyText || 'কোনো জমা নেই')}</span>
                                    </div>
                                </div>
                            </div>
                        `,
                        confirmButtonText: '<i class="fa-solid fa-paper-plane mr-1.5"></i> এই কাস্টমারকে ফোনে টেস্ট পুশ করুন',
                        showCancelButton: true,
                        cancelButtonText: 'বন্ধ করুন',
                        customClass: {
                            popup: '!bg-slate-950 !text-white !rounded-3xl border border-slate-800 font-bn max-w-sm',
                            confirmButton: '!bg-emerald-600 hover:!bg-emerald-500 !text-white !font-bold !rounded-xl !px-4 !py-2.5 !text-xs cursor-pointer',
                            cancelButton: '!bg-slate-800 hover:!bg-slate-700 !text-slate-300 !font-bold !rounded-xl !px-4 !py-2.5 !text-xs cursor-pointer'
                        }
                    });

                    if (previewModalRes.isConfirmed) {
                        await executeTrialPush(custId, cust.name);
                    }
                });
            }

            if (trialPushBtn && trialSelect) {
                trialPushBtn.addEventListener('click', async () => {
                    const custId = trialSelect.value;
                    if (!custId) {
                        showToast('দয়া করে একজন কাস্টমার নির্বাচন করুন', 'warning');
                        return;
                    }
                    const cust = customers.find(c => c.id === custId);
                    await executeTrialPush(custId, cust?.name || 'কাস্টমার');
                });
            }
        }
    });
}

/**
 * ডিভাইসের নাম নির্বাচন করে হোয়াটসঅ্যাপ লিংক জেনারেট করে
 */
async function promptAndGenerateLink() {
    const { value: selectedLabel } = await Swal.fire({
        title: '<div class="flex items-center justify-center gap-2 font-bn font-black text-white text-base"><i class="fa-solid fa-mobile-screen text-indigo-400"></i><span>ডিভাইসের ধরন নির্বাচন করুন</span></div>',
        html: `
            <div class="text-left font-bn space-y-3 p-1 text-slate-300 text-xs">
                <p>আপনি যার জন্য লিংকটি তৈরি করছেন তার নাম বা পদবী নির্বাচন করুন:</p>
                <div class="space-y-1.5">
                    <label class="flex items-center gap-2 p-2.5 bg-slate-900 rounded-xl border border-slate-800 cursor-pointer hover:border-indigo-500">
                        <input type="radio" name="device-label-radio" value="বস" checked class="text-indigo-600">
                        <span class="font-bold text-white"><i class="fa-solid fa-user-tie text-indigo-400 mr-1.5"></i>বস (প্রধান অ্যাকাউন্ট)</span>
                    </label>
                    <label class="flex items-center gap-2 p-2.5 bg-slate-900 rounded-xl border border-slate-800 cursor-pointer hover:border-indigo-500">
                        <input type="radio" name="device-label-radio" value="ম্যানেজার" class="text-indigo-600">
                        <span class="font-bold text-white"><i class="fa-solid fa-briefcase text-indigo-400 mr-1.5"></i>ম্যানেজার</span>
                    </label>
                    <label class="flex items-center gap-2 p-2.5 bg-slate-900 rounded-xl border border-slate-800 cursor-pointer hover:border-indigo-500">
                        <input type="radio" name="device-label-radio" value="অংশীদার" class="text-indigo-600">
                        <span class="font-bold text-white"><i class="fa-solid fa-handshake text-indigo-400 mr-1.5"></i>অংশীদার (পার্টনার)</span>
                    </label>
                </div>
                <div>
                    <label class="block text-[11px] text-slate-400 font-bold mb-1">অথবা কাস্টম নাম লিখুন:</label>
                    <input id="custom-device-label-input" type="text" placeholder="যেমন: আলতাফ মামা / জাবেদ" class="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white outline-none focus:border-indigo-500">
                </div>
            </div>
        `,
        showCancelButton: true,
        confirmButtonText: '<i class="fa-brands fa-whatsapp mr-1.5"></i> লিংক কপি ও প্রস্তুত করুন',
        cancelButtonText: 'বাতিল',
        customClass: {
            popup: '!bg-slate-950 !text-white !rounded-3xl border border-slate-800 font-bn max-w-sm',
            confirmButton: 'm3-btn-primary !bg-emerald-600 hover:!bg-emerald-500 !px-4 !py-2.5 !rounded-xl font-bold text-xs',
            cancelButton: '!bg-slate-800 hover:!bg-slate-700 !text-slate-300 !px-4 !py-2.5 !rounded-xl font-bold text-xs'
        },
        preConfirm: () => {
            const custom = document.getElementById('custom-device-label-input')?.value?.trim();
            if (custom) return custom;
            const checkedRadio = document.querySelector('input[name="device-label-radio"]:checked');
            return checkedRadio ? checkedRadio.value : 'ডিভাইস';
        }
    });

    if (!selectedLabel) return;

    try {
        const setupKey = 'MM' + Math.random().toString(36).slice(2, 8).toUpperCase();
        await db.collection('settings').doc('google_sync').set({
            setupKey: setupKey,
            setupKeyCreatedAt: new Date().toISOString()
        }, { merge: true });

        const deviceUrl = `${window.location.origin}/?view=boss-connect&key=${setupKey}&label=${encodeURIComponent(selectedLabel)}`;
        const whatsappMsg = `আসসালামু আলাইকুম ${selectedLabel},\nমা মোটরসের কাস্টমারদের লাইভ বর্তমান বকেয়া আপনার মোবাইলের গুগল কন্টাক্টস ও কল ডায়লারে স্বয়ংক্রিয়ভাবে আপডেট রাখতে নিচের লিংকে ক্লিক করে আপনার গুগল অ্যাকাউন্টটিতে মাত্র ১ বার 'Allow' করে দিন:\n\n${deviceUrl}\n\n(পরবর্তীতে আর কখনোই কিছু করতে হবে না)`;

        await navigator.clipboard.writeText(whatsappMsg);
        showToast('WhatsApp বার্তা ক্লিপবোর্ডে কপি হয়েছে!', 'success');

        Swal.fire({
            title: `<div class="flex items-center justify-center gap-2 font-bn font-black text-emerald-400 text-base"><i class="fa-brands fa-whatsapp text-lg"></i><span>${escapeHTML(selectedLabel)}-এর জন্য লিংক প্রস্তুত!</span></div>`,
            html: `
                <div class="text-left font-bn space-y-3 p-1 text-slate-200 text-xs">
                    <p class="leading-relaxed">বার্তাটি সফলভাবে কপি হয়েছে। আপনি এটি এখনই হোয়াটসঅ্যাপে পাঠিয়ে দিন:</p>
                    <div class="p-3 bg-slate-900 rounded-xl border border-slate-800 font-mono text-[11px] text-slate-300 break-all select-all">
                        ${escapeHTML(deviceUrl)}
                    </div>
                    <div class="pt-2 flex gap-2">
                        <a href="https://wa.me/?text=${encodeURIComponent(whatsappMsg)}" target="_blank" class="flex-1 bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-2.5 px-4 rounded-xl text-center block text-xs">
                            <i class="fa-brands fa-whatsapp mr-1"></i> WhatsApp খুলুন
                        </a>
                    </div>
                </div>
            `,
            showConfirmButton: false,
            showCloseButton: true,
            customClass: { popup: '!bg-slate-950 !text-white !rounded-3xl border border-slate-800 font-bn max-w-sm' }
        });
    } catch (e) {
        console.error('Failed to generate device link:', e);
        showToast('লিংক তৈরি করা যায়নি: ' + e.message, 'error');
    }
}

/**
 * যেকোনো একটি ডিভাইস রিমুভ করে
 */
async function handleRemoveAccount(accId) {
    const isPinValid = await promptSecurityPin("ডিভাইস সংযোগ বিচ্ছিন্নকরণ");
    if (!isPinValid) return;

    try {
        const ok = await removeConnectedAccount(accId);
        if (ok) {
            showToast('ডিভাইসটি সফলভাবে বিচ্ছিন্ন করা হয়েছে', 'success');
            openGoogleSyncAdminModal();
        } else {
            showToast('বিচ্ছিন্ন করা যায়নি', 'error');
        }
    } catch (e) {
        console.error('Error removing account:', e);
        showToast('বিচ্ছিন্ন করতে সমস্যা হয়েছে: ' + e.message, 'error');
    }
}

/**
 * নির্দিষ্ট বা সকল কানেক্টেড ডিভাইসে ম্যানুয়াল সিঙ্ক এক্সিকিউট করে
 * @param {Array|null} targetAccountIds
 * @param {boolean} deltaOnly
 */
async function handleManualFullSync(targetAccountIds = null, deltaOnly = false) {
    const isSingle = Array.isArray(targetAccountIds) && targetAccountIds.length === 1;
    const modeText = deltaOnly ? 'টার্বো ডেল্টা সিঙ্ক' : 'টার্বো সম্পূর্ণ সিঙ্ক';
    const titleText = isSingle ? `নির্বাচিত ডিভাইসে ${modeText} চলছে...` : `ডিভাইসসমূহে ${modeText} চলছে...`;

    Swal.fire({
        title: `<div class="flex items-center justify-center gap-2 font-bn font-black text-white text-base"><i class="fa-solid fa-arrows-rotate fa-spin text-indigo-400"></i><span>${titleText}</span></div>`,
        html: `
            <div class="text-center font-bn space-y-3 p-2 text-slate-300">
                <p id="full-sync-msg" class="text-xs font-bold text-slate-300">প্রস্তুত হচ্ছে...</p>
                <div class="w-full bg-slate-800 rounded-full h-2.5 overflow-hidden border border-slate-700">
                    <div id="full-sync-bar" class="bg-indigo-600 h-2.5 rounded-full transition-all duration-300" style="width: 10%"></div>
                </div>
                <span id="full-sync-count" class="text-[11px] font-mono text-slate-400 block">শুরু হচ্ছে...</span>
            </div>
        `,
        allowOutsideClick: false,
        showConfirmButton: false,
        customClass: { popup: '!bg-slate-950 !text-white !rounded-3xl border border-slate-800 font-bn' }
    });

    const msgEl = document.getElementById('full-sync-msg');
    const barEl = document.getElementById('full-sync-bar');
    const countEl = document.getElementById('full-sync-count');

    try {
        const res = await executeFullGoogleContactsSync((p) => {
            if (msgEl) msgEl.innerText = p.text;
            if (countEl) countEl.innerText = `${p.current} / ${p.total} সম্পন্ন`;
            if (barEl && p.total > 0) {
                const pct = Math.round((p.current / p.total) * 100);
                barEl.style.width = `${pct}%`;
            }
        }, targetAccountIds, deltaOnly);

        if (!res.success) {
            showToast(res.message || 'সিঙ্ক সম্পন্ন করা যায়নি', 'warning');
            return;
        }

        const syncCount = res.deviceCount || (Array.isArray(targetAccountIds) ? targetAccountIds.length : 1);
        const modeLabel = res.deltaOnly ? 'দ্রুত ডেল্টা সিঙ্ক' : 'সম্পূর্ণ রি-সিঙ্ক';

        Swal.fire({
            title: '<div class="flex items-center justify-center gap-2 font-bn font-black text-emerald-400 text-base"><i class="fa-solid fa-circle-check"></i><span>সিঙ্ক সফল হয়েছে!</span></div>',
            html: `
                <div class="text-left font-bn space-y-2.5 p-1 text-slate-200 text-xs">
                    <div class="flex items-center justify-between pb-1.5 border-b border-slate-800">
                        <span class="text-slate-400">সিঙ্ক মোড:</span>
                        <span class="font-bold text-amber-300">${modeLabel} <span class="ml-1 text-[10px] text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded border border-emerald-500/20"><i class="fa-solid fa-bolt mr-0.5"></i>টার্বো ব্যাচ</span></span>
                    </div>
                    <div class="flex items-center justify-between">
                        <span class="text-slate-400">সিঙ্ক সম্পন্ন ডিভাইস:</span>
                        <strong class="font-bold text-white">${syncCount} টি</strong>
                    </div>
                    <div class="flex items-center justify-between">
                        <span class="text-slate-400">প্রসেসকৃত কাস্টমার:</span>
                        <strong class="font-bold text-white">${res.total} জন</strong>
                    </div>
                    <div class="flex items-center justify-between">
                        <span class="text-slate-400">তথ্য আপডেট হয়েছে:</span>
                        <strong class="text-emerald-400 font-mono font-bold">${res.updated} বার</strong>
                    </div>
                    ${res.created > 0 ? `
                        <div class="flex items-center justify-between">
                            <span class="text-slate-400">নতুন যোগ হয়েছে:</span>
                            <strong class="text-indigo-400 font-mono font-bold">${res.created} টি</strong>
                        </div>
                    ` : ''}

                    <!-- ইনস্ট্যান্ট মোবাইল রিফ্রেশ নির্দেশিকা কার্ড -->
                    <div class="mt-3 p-3 bg-indigo-950/40 border border-indigo-500/30 rounded-2xl space-y-1.5 text-slate-200">
                        <div class="flex items-center gap-1.5 text-indigo-400 font-bold text-xs">
                            <i class="fa-solid fa-mobile-screen-button"></i>
                            <span>মোবাইলে সাথে সাথে দেখার নিয়ম:</span>
                        </div>
                        <p class="text-[11px] text-slate-300 leading-relaxed">
                            বসের বা আপনার মোবাইলের <strong>Contacts</strong> অ্যাপটি খুলুন এবং আঙুল দিয়ে ওপর থেকে নিচে টানুন (<strong>Pull down to refresh</strong>)। সাথে সাথে কল ডায়লারে লাইভ বকেয়া আপডেট দেখতে পাবেন।
                        </p>
                    </div>
                </div>
            `,
            icon: 'success',
            customClass: { popup: '!bg-slate-950 !text-white !rounded-3xl border border-slate-800 font-bn max-w-sm' }
        });
    } catch (e) {
        console.error('Full Sync Error:', e);
        Swal.fire({
            title: 'সিঙ্ক এরর',
            text: e.message || 'গুগল কন্টাক্ট সিঙ্ক করা যায়নি।',
            icon: 'error',
            customClass: { popup: '!bg-slate-950 !text-white !rounded-3xl border border-slate-800 font-bn' }
        });
    }
}

/**
 * সকল কাস্টমারের ডায়নামিক কলার আইডি ফটো ব্যাজ বাল্ক সিঙ্ক হ্যান্ডলার
 * @param {Array|null} targetAccountIds
 */
async function handleBulkPhotoSync(targetAccountIds = null) {
    const isSingle = Array.isArray(targetAccountIds) && targetAccountIds.length === 1;
    const targetText = isSingle ? 'নির্বাচিত ডিভাইসে' : 'সকল নির্বাচিত ডিভাইসে';

    const confirmRes = await Swal.fire({
        title: `<div class="flex items-center justify-center gap-2 font-bn font-black text-white text-base">
            <i class="fa-solid fa-id-badge text-yellow-400"></i>
            <span>সকল কাস্টমারের ফটো ব্যাজ সিঙ্ক</span>
        </div>`,
        html: `
            <div class="font-bn text-left text-xs space-y-3 text-slate-300 p-1">
                <p class="leading-relaxed">
                    ডাটাবেজের সকল কাস্টমারের জন্য স্বয়ংক্রিয়ভাবে <strong class="text-white">এইচডি কলার আইডি ফটো ব্যাজ</strong> (বকেয়া, সর্বশেষ পেমেন্ট দিন ও এলাকা) তৈরি করে ${targetText} গুগলে আপলোড করা হবে।
                </p>
                <div class="p-2.5 bg-slate-900 rounded-xl border border-slate-800 space-y-1 text-[11px]">
                    <p class="text-indigo-300 font-bold"><i class="fa-solid fa-bolt mr-1"></i>স্মার্ট কনকারেন্সি পুল ও পেসিং:</p>
                    <p class="text-slate-400">গুগল এপিআই সেফটি বজায় রেখে ৩ জনের গ্রুপে ব্যাকগ্রাউন্ডে নিরাপদ গতিতে আপলোড হবে।</p>
                </div>
                <p class="text-amber-400 text-[11px] font-bold">
                    <i class="fa-solid fa-circle-question mr-1"></i>
                    আপনি কি এখনই বাল্ক ফটো ব্যাজ সিঙ্ক শুরু করতে চান?
                </p>
            </div>
        `,
        icon: 'question',
        showCancelButton: true,
        confirmButtonText: '<i class="fa-solid fa-play mr-1.5"></i> হ্যাঁ, ফটো ব্যাজ সিঙ্ক শুরু করুন',
        cancelButtonText: 'বাতিল',
        customClass: {
            popup: '!bg-slate-950 !text-white !rounded-3xl border border-slate-800 font-bn max-w-sm',
            confirmButton: '!bg-gradient-to-r !from-purple-600 !to-indigo-600 hover:!from-purple-500 hover:!to-indigo-500 !text-white !font-bold !rounded-xl !px-4 !py-2.5 !text-xs cursor-pointer',
            cancelButton: '!bg-slate-800 hover:!bg-slate-700 !text-slate-300 !font-bold !rounded-xl !px-4 !py-2.5 !text-xs cursor-pointer'
        }
    });

    if (!confirmRes.isConfirmed) return;

    Swal.fire({
        title: `<div class="flex items-center justify-center gap-2 font-bn font-black text-white text-base">
            <i class="fa-solid fa-id-badge animate-pulse text-yellow-400"></i>
            <span>ফটো ব্যাজ সিঙ্ক হচ্ছে...</span>
        </div>`,
        html: `
            <div class="text-center font-bn space-y-3 p-2 text-slate-300">
                <p id="bulk-photo-msg" class="text-xs font-bold text-slate-200">ডাটা ও কন্টাক্ট ম্যাপ প্রস্তুত হচ্ছে...</p>
                <div class="w-full bg-slate-900 rounded-full h-3 overflow-hidden border border-slate-800 p-0.5">
                    <div id="bulk-photo-bar" class="bg-gradient-to-r from-purple-500 to-indigo-500 h-full rounded-full transition-all duration-300" style="width: 2%"></div>
                </div>
                <div class="flex justify-between items-center text-xs text-slate-400 px-1 font-mono">
                    <span id="bulk-photo-count">০ / ০ জন</span>
                    <span id="bulk-photo-pct" class="font-bold text-indigo-400">০%</span>
                </div>
                <div class="p-2 bg-slate-900/90 rounded-xl border border-slate-800 text-[11px] text-slate-300 flex items-center justify-center gap-2">
                    <i class="fa-solid fa-user text-indigo-400 text-xs"></i>
                    <span id="bulk-photo-current-name" class="truncate font-semibold">অপেক্ষা করুন...</span>
                </div>
                <p class="text-[10px] text-amber-400/90 font-bold">
                    <i class="fa-solid fa-triangle-exclamation mr-1"></i>
                    উইন্ডো বন্ধ করবেন না, ব্যাকগ্রাউন্ডে নিরাপদে ব্যাজ আপলোড হচ্ছে
                </p>
            </div>
        `,
        allowOutsideClick: false,
        showConfirmButton: false,
        customClass: { popup: '!bg-slate-950 !text-white !rounded-3xl border border-slate-800 font-bn max-w-sm' }
    });

    const msgEl = document.getElementById('bulk-photo-msg');
    const barEl = document.getElementById('bulk-photo-bar');
    const countEl = document.getElementById('bulk-photo-count');
    const pctEl = document.getElementById('bulk-photo-pct');
    const nameEl = document.getElementById('bulk-photo-current-name');

    try {
        const res = await executeBulkPhotoBadgeSync((p) => {
            if (msgEl && p.text) msgEl.innerText = p.text;
            if (countEl) countEl.innerText = `${p.current} / ${p.total} জন`;
            if (pctEl) pctEl.innerText = `${p.percent}%`;
            if (barEl) barEl.style.width = `${Math.max(2, p.percent)}%`;
            if (nameEl && p.currentName) nameEl.innerText = `বর্তমান: ${p.currentName}`;
        }, targetAccountIds);

        if (!res.success) {
            showToast(res.message || 'ফটো ব্যাজ সিঙ্ক সম্পন্ন করা যায়নি', 'warning');
            return;
        }

        await Swal.fire({
            title: '<div class="flex items-center justify-center gap-2 font-bn font-black text-emerald-400 text-base"><i class="fa-solid fa-circle-check"></i><span>ফটো ব্যাজ সিঙ্ক সফল হয়েছে!</span></div>',
            html: `
                <div class="text-left font-bn space-y-2.5 p-1 text-slate-200 text-xs">
                    <div class="p-3 bg-slate-900 rounded-xl border border-slate-800 space-y-1.5">
                        <div class="flex items-center justify-between">
                            <span class="text-slate-400">মোট প্রসেসকৃত কাস্টমার:</span>
                            <strong class="font-bold text-white">${res.total} জন</strong>
                        </div>
                        <div class="flex items-center justify-between">
                            <span class="text-slate-400">সফল ফটো ব্যাজ আপলোড:</span>
                            <strong class="text-emerald-400 font-mono font-bold">${res.updatedCount} টি</strong>
                        </div>
                        ${res.failedCount > 0 ? `
                        <div class="flex items-center justify-between">
                            <span class="text-slate-400">ব্যর্থ / মিসিং:</span>
                            <strong class="text-amber-400 font-mono font-bold">${res.failedCount} টি</strong>
                        </div>` : ''}
                    </div>

                    <!-- ইনস্ট্যান্ট মোবাইল রিফ্রেশ নির্দেশিকা কার্ড -->
                    <div class="p-3 bg-indigo-950/40 border border-indigo-500/30 rounded-2xl space-y-1.5 text-slate-200">
                        <div class="flex items-center gap-1.5 text-indigo-400 font-bold text-xs">
                            <i class="fa-solid fa-mobile-screen-button"></i>
                            <span>মোবাইলে ব্যাজ দেখার নিয়ম:</span>
                        </div>
                        <p class="text-[11px] text-slate-300 leading-relaxed">
                            বসের বা আপনার ফোনের <strong>Contacts</strong> অ্যাপটি খুলুন এবং আঙুল দিয়ে ওপর থেকে নিচে টানুন (<strong>Pull down to refresh</strong>)। যেকোনো কাস্টমারের নামের ওপর ট্যাপ করলেই তার বড় কলার আইডি ফটো কার্ড দেখতে পাবেন!
                        </p>
                    </div>
                </div>
            `,
            icon: 'success',
            customClass: { popup: '!bg-slate-950 !text-white !rounded-3xl border border-slate-800 font-bn max-w-sm' }
        });
    } catch (e) {
        console.error('Bulk Photo Sync Error:', e);
        Swal.fire({
            title: '<div class="font-bn font-black text-red-400 text-base">ফটো সিঙ্ক এরর</div>',
            text: e.message || 'গুগল কন্টাক্ট ফটো ব্যাজ সিঙ্ক করা যায়নি।',
            icon: 'error',
            customClass: { popup: '!bg-slate-950 !text-white !rounded-3xl border border-slate-800 font-bn max-w-sm' }
        });
    }
}

/**
 * সকল কানেক্টেড ডিভাইসে ৪টি স্মার্ট লেবেল সিঙ্ক হ্যান্ডলার
 * @param {Array|null} targetAccountIds
 */
async function handleSmartLabelSync(targetAccountIds = null) {
    const isSingle = Array.isArray(targetAccountIds) && targetAccountIds.length === 1;
    const targetText = isSingle ? 'নির্বাচিত ডিভাইসে' : 'সকল নির্বাচিত ডিভাইসে';

    const confirmRes = await Swal.fire({
        title: `<div class="flex items-center justify-center gap-2 font-bn font-black text-white text-base">
            <i class="fa-solid fa-tags text-amber-300"></i>
            <span>স্মার্ট কন্টাক্ট লেবেল সিঙ্ক</span>
        </div>`,
        html: `
            <div class="font-bn text-left text-xs space-y-3 text-slate-300 p-1">
                <p class="leading-relaxed">
                    আপনার গুগল কন্টাক্টসে স্বয়ংক্রিয়ভাবে <strong class="text-white">৪টি স্মার্ট লেবেল</strong> তৈরি করে কাস্টমারদের বকেয়ার বয়স অনুযায়ী ক্যাটাগরাইজ করা হবে:
                </p>
                <div class="p-2.5 bg-slate-900 rounded-xl border border-slate-800 space-y-1.5 text-[11px]">
                    <div class="flex items-center gap-1.5 text-indigo-300 font-bold">
                        <i class="fa-solid fa-tag text-xs text-indigo-400"></i>
                        <span>M/S. MAA-MOTOR'S (সকল কাস্টমার)</span>
                    </div>
                    <div class="flex items-center gap-1.5 text-amber-300 font-bold">
                        <i class="fa-solid fa-tag text-xs text-amber-400"></i>
                        <span>MAA MOTORS - ১৫+ দিন বকেয়া</span>
                    </div>
                    <div class="flex items-center gap-1.5 text-orange-300 font-bold">
                        <i class="fa-solid fa-tag text-xs text-orange-400"></i>
                        <span>MAA MOTORS - ৩০+ দিন বকেয়া</span>
                    </div>
                    <div class="flex items-center gap-1.5 text-red-400 font-bold">
                        <i class="fa-solid fa-tag text-xs text-red-400"></i>
                        <span>MAA MOTORS - হাই রিস্ক বকেয়া (৬০+ দিন)</span>
                    </div>
                </div>
                <p class="text-emerald-400 text-[11px] font-bold">
                    <i class="fa-solid fa-circle-question mr-1"></i>
                    আপনি কি এখনই ${targetText} লেবেল সিঙ্ক শুরু করতে চান?
                </p>
            </div>
        `,
        icon: 'question',
        showCancelButton: true,
        confirmButtonText: '<i class="fa-solid fa-play mr-1.5"></i> হ্যাঁ, লেবেল সিঙ্ক শুরু করুন',
        cancelButtonText: 'বাতিল',
        customClass: {
            popup: '!bg-slate-950 !text-white !rounded-3xl border border-slate-800 font-bn max-w-sm',
            confirmButton: '!bg-gradient-to-r !from-amber-600 !to-orange-600 hover:!from-amber-500 hover:!to-orange-500 !text-white !font-bold !rounded-xl !px-4 !py-2.5 !text-xs cursor-pointer',
            cancelButton: '!bg-slate-800 hover:!bg-slate-700 !text-slate-300 !font-bold !rounded-xl !px-4 !py-2.5 !text-xs cursor-pointer'
        }
    });

    if (!confirmRes.isConfirmed) return;

    Swal.fire({
        title: `<div class="flex items-center justify-center gap-2 font-bn font-black text-white text-base">
            <i class="fa-solid fa-tags animate-pulse text-amber-300"></i>
            <span>স্মার্ট লেবেল সিঙ্ক হচ্ছে...</span>
        </div>`,
        html: `
            <div class="text-center font-bn space-y-3 p-2 text-slate-300">
                <p id="label-sync-msg" class="text-xs font-bold text-slate-200">কাস্টমার ডাটা ও লেবেল প্রস্তুত হচ্ছে...</p>
                <div class="w-full bg-slate-900 rounded-full h-3 overflow-hidden border border-slate-800 p-0.5">
                    <div id="label-sync-bar" class="bg-gradient-to-r from-amber-500 to-orange-500 h-full rounded-full transition-all duration-300" style="width: 10%"></div>
                </div>
                <div class="flex justify-between items-center text-xs text-slate-400 px-1 font-mono">
                    <span id="label-sync-status">প্রক্রিয়াধীন...</span>
                    <span id="label-sync-pct" class="font-bold text-amber-400">১০%</span>
                </div>
                <p class="text-[10px] text-amber-400/90 font-bold">
                    <i class="fa-solid fa-triangle-exclamation mr-1"></i>
                    উইন্ডো বন্ধ করবেন না, ব্যাকগ্রাউন্ডে নিরাপদ গতিতে লেবেল আপডেট হচ্ছে
                </p>
            </div>
        `,
        allowOutsideClick: false,
        showConfirmButton: false,
        customClass: { popup: '!bg-slate-950 !text-white !rounded-3xl border border-slate-800 font-bn max-w-sm' }
    });

    const msgEl = document.getElementById('label-sync-msg');
    const barEl = document.getElementById('label-sync-bar');
    const pctEl = document.getElementById('label-sync-pct');
    const statusEl = document.getElementById('label-sync-status');

    try {
        const res = await executeSmartLabelSync((p) => {
            if (msgEl && p.text) msgEl.innerText = p.text;
            if (pctEl && p.percent) pctEl.innerText = `${p.percent}%`;
            if (barEl && p.percent) barEl.style.width = `${Math.max(5, p.percent)}%`;
            if (statusEl) statusEl.innerText = p.percent === 100 ? 'সম্পন্ন' : 'সিঙ্ক চলছে...';
        }, targetAccountIds);

        if (!res.success) {
            showToast(res.message || 'লেবেল সিঙ্ক সম্পন্ন করা যায়নি', 'warning');
            return;
        }

        const s = res.stats || {};

        await Swal.fire({
            title: '<div class="flex items-center justify-center gap-2 font-bn font-black text-emerald-400 text-base"><i class="fa-solid fa-circle-check"></i><span>স্মার্ট লেবেল সিঙ্ক সফল হয়েছে!</span></div>',
            html: `
                <div class="text-left font-bn space-y-2.5 p-1 text-slate-200 text-xs">
                    <div class="p-3 bg-slate-900 rounded-xl border border-slate-800 space-y-1.5">
                        <div class="flex items-center justify-between pb-1 border-b border-slate-800">
                            <span class="text-indigo-400 font-bold"><i class="fa-solid fa-folder mr-1"></i>M/S. MAA-MOTOR'S:</span>
                            <strong class="font-bold text-white">${s.master || 0} জন</strong>
                        </div>
                        <div class="flex items-center justify-between">
                            <span class="text-amber-400 font-bold"><i class="fa-solid fa-tag mr-1"></i>১৫+ দিন বকেয়া:</span>
                            <strong class="text-amber-300 font-mono font-bold">${s.late15 || 0} জন</strong>
                        </div>
                        <div class="flex items-center justify-between">
                            <span class="text-orange-400 font-bold"><i class="fa-solid fa-tag mr-1"></i>৩০+ দিন বকেয়া:</span>
                            <strong class="text-orange-300 font-mono font-bold">${s.late30 || 0} জন</strong>
                        </div>
                        <div class="flex items-center justify-between">
                            <span class="text-red-400 font-bold"><i class="fa-solid fa-triangle-exclamation mr-1"></i>হাই রিস্ক বকেয়া (৬০+ দিন):</span>
                            <strong class="text-red-400 font-mono font-bold">${s.highRisk || 0} জন</strong>
                        </div>
                    </div>

                    <!-- ইনস্ট্যান্ট মোবাইল রিফ্রেশ নির্দেশিকা কার্ড -->
                    <div class="p-3 bg-amber-950/40 border border-amber-500/30 rounded-2xl space-y-1.5 text-slate-200">
                        <div class="flex items-center gap-1.5 text-amber-400 font-bold text-xs">
                            <i class="fa-solid fa-mobile-screen-button"></i>
                            <span>মোবাইলে লেবেল দেখার নিয়ম:</span>
                        </div>
                        <p class="text-[11px] text-slate-300 leading-relaxed">
                            বসের বা আপনার ফোনের <strong>Contacts</strong> অ্যাপটি খুলুন এবং বাম পাশের মেনু বা <strong>Labels (লেবেল)</strong> অপশনে যান। সেখানে এই ৪টি লেবেল দেখতে পাবেন এবং যেকোনো লেবেলে চাপ দিলেই আলাদাভাবে সেই কাস্টমারদের পেয়ে যাবেন!
                        </p>
                    </div>
                </div>
            `,
            icon: 'success',
            customClass: { popup: '!bg-slate-950 !text-white !rounded-3xl border border-slate-800 font-bn max-w-sm' }
        });
    } catch (e) {
        console.error('Smart Label Sync Error:', e);
        Swal.fire({
            title: '<div class="font-bn font-black text-red-400 text-base">লেবেল সিঙ্ক এরর</div>',
            text: e.message || 'গুগল কন্টাক্ট স্মার্ট লেবেল সিঙ্ক করা যায়নি।',
            icon: 'error',
            customClass: { popup: '!bg-slate-950 !text-white !rounded-3xl border border-slate-800 font-bn max-w-sm' }
        });
    }
}

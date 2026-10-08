import Swal from 'sweetalert2';
import { db } from '../firebase-config.js';
import { showToast, promptSecurityPin, escapeHTML } from '../utils.js';
import { getConnectedGoogleAccounts, removeConnectedAccount, buildGoogleAuthUrl } from './google-auth-client.js';
import { executeFullGoogleContactsSync } from './google-contact-sync-service.js';

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
            <div class="text-left font-bn space-y-3.5 p-1 text-slate-200 text-xs">
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
                    <div class="space-y-2 max-h-52 overflow-y-auto pr-1">
                        ${accountsHtml}
                    </div>
                </div>

                <!-- কল স্ক্রিন ও ফিচারের সুবিধা -->
                <div class="p-3 bg-slate-900/90 rounded-2xl border border-slate-800 text-[11px] space-y-1 text-slate-300">
                    <span class="font-bold text-amber-400 block"><i class="fa-solid fa-phone-volume mr-1"></i> নতুন কল স্ক্রিন সুবিধা:</span>
                    <p>• কল স্ক্রিনে বড় করে দেখা যাবে: <code>[MM] নাম - এলাকা [৳ ১৫,০০০]</code></p>
                    <p>• কন্টাক্ট নোটে থাকবে: সর্বশেষ জমার তারিখ/পরিমাণ ও বাকির বয়স।</p>
                    <p>• বস ও ম্যানেজার উভয়ের ফোনেই একযোগে অটো-আপডেট হবে।</p>
                </div>

                <!-- বাটন গ্রুপ -->
                <div class="space-y-2 pt-1">
                    <button id="modal-gen-link-btn" class="w-full bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 text-white font-bold py-3 px-4 rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-[0.98]">
                        <i class="fa-brands fa-whatsapp text-base"></i>
                        <span>নতুন ডিভাইসের জন্য WhatsApp লিংক তৈরি করুন</span>
                    </button>

                    ${hasAccounts ? `
                        <button id="modal-full-sync-btn" class="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-2.5 px-4 rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-[0.98]">
                            <i class="fa-solid fa-arrows-rotate text-sm"></i>
                            <span id="modal-sync-btn-text">সিঙ্ক চালান</span>
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
            const directBtn = document.getElementById('modal-direct-connect-btn');
            const selectAllEl = document.getElementById('select-all-devices-chk');

            const updateSyncButtonLabel = () => {
                const checkedBoxes = Array.from(document.querySelectorAll('.device-sync-chk:checked'));
                const allBoxes = Array.from(document.querySelectorAll('.device-sync-chk'));
                const btnTextEl = document.getElementById('modal-sync-btn-text');

                if (selectAllEl && allBoxes.length > 0) {
                    selectAllEl.checked = checkedBoxes.length === allBoxes.length;
                    selectAllEl.indeterminate = checkedBoxes.length > 0 && checkedBoxes.length < allBoxes.length;
                }

                if (btnTextEl) {
                    if (checkedBoxes.length === allBoxes.length && allBoxes.length > 0) {
                        btnTextEl.innerText = `সকল ডিভাইসে সিঙ্ক চালান (${allBoxes.length} টি)`;
                    } else if (checkedBoxes.length > 0) {
                        btnTextEl.innerText = `নির্বাচিত ডিভাইসে সিঙ্ক চালান (${checkedBoxes.length} টি)`;
                    } else {
                        btnTextEl.innerText = `ডিভাইস নির্বাচন করুন (০ টি)`;
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
                        await handleManualFullSync([accId]);
                    }
                });
            });

            // সিঙ্ক বাটন (নির্বাচিত ডিভাইসসমূহ)
            if (syncBtn) {
                syncBtn.addEventListener('click', () => {
                    const checkedBoxes = Array.from(document.querySelectorAll('.device-sync-chk:checked'));
                    if (checkedBoxes.length === 0) {
                        showToast('দয়া করে সিঙ্ক করার জন্য অন্তত ১টি ডিভাইস নির্বাচন করুন', 'warning');
                        return;
                    }
                    const targetIds = checkedBoxes.map(cb => cb.getAttribute('data-id'));
                    handleManualFullSync(targetIds);
                });
            }

            // রিমুভ অ্যাকাউন্ট ইভেন্ট লিসেনার
            document.querySelectorAll('.remove-acc-btn').forEach(btn => {
                btn.addEventListener('click', async (e) => {
                    const accId = e.currentTarget.getAttribute('data-acc-id');
                    if (accId) await handleRemoveAccount(accId);
                });
            });
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
 */
async function handleManualFullSync(targetAccountIds = null) {
    const isSingle = Array.isArray(targetAccountIds) && targetAccountIds.length === 1;
    const titleText = isSingle ? 'নির্বাচিত ডিভাইসে সিঙ্ক চলছে...' : 'ডিভাইসসমূহে সিঙ্ক চলছে...';

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
        }, targetAccountIds);

        const syncCount = res.deviceCount || (Array.isArray(targetAccountIds) ? targetAccountIds.length : 1);

        Swal.fire({
            title: '<div class="flex items-center justify-center gap-2 font-bn font-black text-emerald-400 text-base"><i class="fa-solid fa-circle-check"></i><span>সিঙ্ক সফল!</span></div>',
            html: `
                <div class="text-left font-bn space-y-2 p-1 text-slate-200 text-xs">
                    <p>সিঙ্ক সম্পন্ন ডিভাইস: <strong>${syncCount} টি</strong></p>
                    <p>মোট কাস্টমার: <strong>${res.total} জন</strong></p>
                    <p>আপডেট হয়েছে: <strong class="text-blue-400 font-mono">${res.updated} বার</strong></p>
                    <p class="text-[11px] text-emerald-300 font-bold mt-2">
                        <i class="fa-solid fa-check-double mr-1"></i> কল স্ক্রিন ফরম্যাট ও কল ইন্টেলিজেন্স নোটস যুক্ত হয়েছে।
                    </p>
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

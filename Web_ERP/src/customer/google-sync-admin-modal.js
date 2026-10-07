import Swal from 'sweetalert2';
import { db } from '../firebase-config.js';
import { showToast, promptSecurityPin, escapeHTML } from '../utils.js';
import { getGoogleSyncConfig, buildGoogleAuthUrl } from './google-auth-client.js';
import { executeFullGoogleContactsSync } from './google-contact-sync-service.js';

/**
 * এডমিন প্যানেলে গুগল সিঙ্ক ম্যানেজমেন্ট মডাল ওপেন করে
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

    const config = await getGoogleSyncConfig();
    const isConnected = !!(config?.isActive && config?.refreshToken);

    const emailDisplay = config?.accountEmail || 'সংযুক্ত নেই';
    const lastSyncDisplay = config?.lastSyncAt 
        ? new Date(config.lastSyncAt).toLocaleString('bn-BD', { dateStyle: 'medium', timeStyle: 'short' })
        : 'এখনো সিঙ্ক হয়নি';

    await Swal.fire({
        title: '<div class="flex items-center justify-center gap-2 font-bn font-black text-white text-base"><i class="fa-brands fa-google text-red-400"></i><span>Google Contacts অটো-সিঙ্ক কন্ট্রোল</span></div>',
        html: `
            <div class="text-left font-bn space-y-4 p-1 text-slate-200 text-xs">
                <!-- স্ট্যাটাস কার্ড -->
                <div class="p-3.5 bg-slate-900 border ${isConnected ? 'border-emerald-500/40 bg-emerald-950/20' : 'border-amber-500/40 bg-amber-950/20'} rounded-2xl flex items-center justify-between">
                    <div>
                        <span class="text-[10px] uppercase font-bold tracking-wider ${isConnected ? 'text-emerald-400' : 'text-amber-400'} block">
                            ${isConnected ? '<i class="fa-solid fa-circle-check mr-1"></i> সচল ও ক্লাউডে কানেক্টেড' : '<i class="fa-solid fa-circle-exclamation mr-1"></i> কানেক্ট করা হয়নি'}
                        </span>
                        <strong class="text-sm font-mono text-white block mt-0.5">${escapeHTML(emailDisplay)}</strong>
                        <span class="text-[11px] text-slate-400 block mt-0.5">সর্বশেষ সিঙ্ক: ${lastSyncDisplay}</span>
                    </div>
                    <div class="w-10 h-10 rounded-xl ${isConnected ? 'bg-emerald-500/20 text-emerald-400' : 'bg-amber-500/20 text-amber-400'} flex items-center justify-center text-lg">
                        <i class="fa-solid ${isConnected ? 'fa-satellite-dish' : 'fa-link-slash'}"></i>
                    </div>
                </div>

                <!-- মূল সুবিধা সারসংক্ষেপ -->
                <div class="p-3 bg-slate-900/90 rounded-2xl border border-slate-800 text-[11px] space-y-1.5 text-slate-300">
                    <span class="font-bold text-indigo-400 block"><i class="fa-solid fa-wand-magic-sparkles mr-1"></i> ১-বার কানেক্ট ও আজীবনের অটো-সিঙ্ক:</span>
                    <p>• বসকে দোকানে কোনো জিমেইল লগইন করতে হবে না এবং ইআরপিতে কোনো আইডি-পাসওয়ার্ডও দিতে হবে না।</p>
                    <p>• বস তার ফোনে ১ বার 'Allow' দিলে প্রতিদিন মেমো বা জমা হওয়ামাত্র স্বয়ংক্রিয়ভাবে বসের মোবাইলে বকেয়া আপডেট হবে।</p>
                </div>

                <!-- বাটন গ্রুপ -->
                <div class="space-y-2 pt-1">
                    <button id="modal-gen-boss-link-btn" class="w-full bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 text-white font-bold py-3 px-4 rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-[0.98]">
                        <i class="fa-brands fa-whatsapp text-base"></i>
                        <span>${isConnected ? 'বসের জন্য পুনরায় ১-ক্লিক লিংক কপি করুন' : 'বসের জন্য ১-ক্লিক WhatsApp লিংক কপি করুন'}</span>
                    </button>

                    ${isConnected ? `
                        <button id="modal-full-sync-btn" class="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-2.5 px-4 rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-[0.98]">
                            <i class="fa-solid fa-arrows-rotate text-sm"></i>
                            <span>ম্যানুয়াল ফুল সিঙ্ক চালান (সকল কাস্টমার)</span>
                        </button>
                    ` : `
                        <button id="modal-direct-connect-btn" class="w-full bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold py-2.5 px-4 rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-[0.98]">
                            <i class="fa-brands fa-google text-red-400"></i>
                            <span>সরাসরি এই কম্পিউটার থেকে কানেক্ট করুন</span>
                        </button>
                    `}

                    ${isConnected ? `
                        <button id="modal-disconnect-btn" class="w-full bg-red-950/30 hover:bg-red-900/40 text-red-400 border border-red-500/30 font-bold py-2 px-4 rounded-xl text-xs transition-all flex items-center justify-center gap-2 cursor-pointer">
                            <i class="fa-solid fa-power-off text-xs"></i>
                            <span>কানেকশন বিচ্ছিন্ন করুন (Disconnect)</span>
                        </button>
                    ` : ''}
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
            const linkBtn = document.getElementById('modal-gen-boss-link-btn');
            const syncBtn = document.getElementById('modal-full-sync-btn');
            const directBtn = document.getElementById('modal-direct-connect-btn');
            const disconnectBtn = document.getElementById('modal-disconnect-btn');

            if (linkBtn) linkBtn.addEventListener('click', handleGenerateBossWhatsAppLink);
            if (syncBtn) syncBtn.addEventListener('click', handleManualFullSync);
            if (directBtn) directBtn.addEventListener('click', handleDirectConnect);
            if (disconnectBtn) disconnectBtn.addEventListener('click', handleDisconnect);
        }
    });
}

/**
 * বসের জন্য ওয়ান-টাইম সিকিউর লিংক জেনারেট ও হোয়াটসঅ্যাপ ক্লিপবোর্ডে কপি
 */
async function handleGenerateBossWhatsAppLink() {
    try {
        const setupKey = 'MM' + Math.random().toString(36).slice(2, 8).toUpperCase();
        await db.collection('settings').doc('google_sync').set({
            setupKey: setupKey,
            setupKeyCreatedAt: new Date().toISOString()
        }, { merge: true });

        const bossUrl = `${window.location.origin}/?view=boss-connect&key=${setupKey}`;
        const whatsappMsg = `আসসালামু আলাইকুম বস,\nমা মোটরসের কাস্টমারদের লাইভ বর্তমান বকেয়া আপনার মোবাইলের গুগল কন্টাক্টস ও ডায়লারে স্বয়ংক্রিয়ভাবে আপডেট রাখতে নিচের লিংকে ক্লিক করে আপনার গুগল অ্যাকাউন্টটিতে মাত্র ১ বার 'Allow' করে দিন:\n\n${bossUrl}\n\n(পরবর্তীতে আর কখনোই কিছু করতে হবে না)`;

        await navigator.clipboard.writeText(whatsappMsg);
        showToast('WhatsApp বার্তা সফলভাবে ক্লিপবোর্ডে কপি হয়েছে!', 'success');

        Swal.fire({
            title: '<div class="flex items-center justify-center gap-2 font-bn font-black text-emerald-400 text-base"><i class="fa-brands fa-whatsapp text-lg"></i><span>বসের ১-ক্লিক লিংক প্রস্তুত!</span></div>',
            html: `
                <div class="text-left font-bn space-y-3 p-1 text-slate-200 text-xs">
                    <p class="leading-relaxed">বার্তাটি সফলভাবে কপি হয়েছে। আপনি এখনই এটি বসের হোয়াটসঅ্যাপে পাঠিয়ে দিতে পারেন:</p>
                    <div class="p-3 bg-slate-900 rounded-xl border border-slate-800 font-mono text-[11px] text-slate-300 break-all select-all">
                        ${escapeHTML(bossUrl)}
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
        console.error('Failed to generate boss link:', e);
        showToast('লিংক তৈরি করা যায়নি: ' + e.message, 'error');
    }
}

/**
 * ম্যানুয়াল ফুল সিঙ্ক এক্সিকিউট করে
 */
async function handleManualFullSync() {
    Swal.fire({
        title: '<div class="flex items-center justify-center gap-2 font-bn font-black text-white text-base"><i class="fa-solid fa-arrows-rotate fa-spin text-indigo-400"></i><span>ক্লাউড সিঙ্ক চলছে...</span></div>',
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
        });

        Swal.fire({
            title: '<div class="flex items-center justify-center gap-2 font-bn font-black text-emerald-400 text-base"><i class="fa-solid fa-circle-check"></i><span>সিঙ্ক সফল!</span></div>',
            html: `
                <div class="text-left font-bn space-y-2 p-1 text-slate-200 text-xs">
                    <p>মোট কাস্টমার: <strong>${res.total} জন</strong></p>
                    <p>আপডেট হয়েছে: <strong class="text-blue-400 font-mono">${res.updated} জন</strong></p>
                    <p>নতুন তৈরি হয়েছে: <strong class="text-emerald-400 font-mono">${res.created} জন</strong></p>
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
 * সরাসরি বর্তমান ব্রাউজার থেকে কানেক্ট
 */
function handleDirectConnect() {
    const authUrl = buildGoogleAuthUrl('direct');
    window.location.href = authUrl;
}

/**
 * গুগল কানেকশন ডিসকানেক্ট করে
 */
async function handleDisconnect() {
    const isPinValid = await promptSecurityPin("গুগল কন্টাক্ট সিঙ্ক বিচ্ছিন্নকরণ");
    if (!isPinValid) return;

    try {
        await db.collection('settings').doc('google_sync').set({
            isActive: false,
            refreshToken: null,
            disconnectedAt: new Date().toISOString()
        }, { merge: true });

        showToast('গুগল অ্যাকাউন্ট সফলভাবে বিচ্ছিন্ন করা হয়েছে', 'success');
        openGoogleSyncAdminModal();
    } catch (e) {
        console.error('Failed to disconnect:', e);
        showToast('বিচ্ছিন্ন করতে সমস্যা হয়েছে: ' + e.message, 'error');
    }
}

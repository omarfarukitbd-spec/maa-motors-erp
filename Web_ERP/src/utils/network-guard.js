import Swal from 'sweetalert2';
import { showToast } from './ui-helpers.js';

/**
 * --- UNIVERSAL ENTERPRISE OFFLINE GUARD ---
 * Protects accounting invariants & financial data by strictly blocking
 * mutations (Create/Edit/Delete/Collect) when the device is disconnected.
 */

let isOfflineBannerVisible = false;

/**
 * Universal Gatekeeper: Check if online before performing any critical mutation.
 * @param {string} actionName - Name of the action in Bengali (e.g. 'নতুন লেনদেন', 'কাস্টমার ডিলিট')
 * @returns {boolean} - true if online and allowed to proceed, false if blocked.
 */
export function ensureOnline(actionName = 'এই অপারেশনটি') {
    if (!navigator.onLine) {
        if (navigator.vibrate) {
            navigator.vibrate([100, 50, 100]);
        }

        Swal.fire({
            title: '<div class="flex items-center justify-center gap-2 text-red-400 font-bn font-black text-xl"><i class="fa-solid fa-wifi text-red-400"></i><span>ইন্টারনেট সংযোগ নেই!</span></div>',
            html: `
                <div class="text-left font-bn text-xs space-y-3 p-1">
                    <p class="text-slate-300">আপনার ডিভাইসটি বর্তমানে <strong>অফলাইনে (ইন্টারনেট ছাড়া)</strong> রয়েছে।</p>
                    <div class="bg-red-950/40 border border-red-500/40 p-3 rounded-2xl text-red-300 leading-relaxed font-bold">
                        <i class="fa-solid fa-triangle-exclamation text-amber-400 mr-1.5"></i>
                        আর্থিক তথ্যের নিরাপত্তা, সার্ভার সিঙ্ক এবং খতিয়ানের গরমিল প্রতিরোধে অফলাইনে <strong>${actionName}</strong> সম্পন্ন করা সম্পূর্ণ নিষিদ্ধ।
                    </div>
                    <div class="p-2.5 bg-slate-900 rounded-xl border border-slate-800 text-slate-400 text-[11px]">
                        <i class="fa-solid fa-circle-info text-blue-400 mr-1"></i>
                        দয়া করে মোবাইল ডাটা বা ওয়াইফাই চালু করে পুনরায় চেষ্টা করুন।
                    </div>
                </div>
            `,
            icon: 'error',
            confirmButtonText: '<i class="fa-solid fa-arrows-rotate mr-1.5"></i>কানেকশন চেক করুন',
            showCancelButton: true,
            cancelButtonText: 'ঠিক আছে',
            customClass: {
                popup: '!bg-slate-950 !text-white !rounded-3xl border border-red-500/30 shadow-2xl font-bn',
                confirmButton: 'm3-btn-primary !bg-red-600 hover:!bg-red-500 !px-6 !py-2.5 !rounded-xl font-bold',
                cancelButton: 'm3-btn-tonal !bg-slate-800 hover:!bg-slate-700 !text-slate-300 !px-5 !py-2.5 !rounded-xl font-bold'
            },
            preConfirm: () => {
                checkNetworkConnectivity();
            }
        });

        return false;
    }
    return true;
}

/**
 * Check Network Connectivity and notify user
 */
export async function checkNetworkConnectivity() {
    if (navigator.onLine) {
        showToast('ইন্টারনেট সংযোগ সক্রিয় রয়েছে! আপনি অনলাইনে আছেন।', 'success', 'নেটওয়ার্ক');
        updateOfflineBanner(false);
    } else {
        showToast('ডিভাইস এখনও অফলাইনে রয়েছে! ইন্টারনেট অন করুন।', 'error', 'নেটওয়ার্ক');
        updateOfflineBanner(true);
    }
}

/**
 * Update Persistent Top Banner State
 */
function updateOfflineBanner(isOffline) {
    let banner = document.getElementById('global-offline-banner');

    if (isOffline) {
        if (!banner) {
            banner = document.createElement('div');
            banner.id = 'global-offline-banner';
            banner.className = 'fixed top-0 left-0 right-0 z-[9999999] bg-gradient-to-r from-red-700 via-rose-700 to-red-800 text-white text-xs font-bold font-bn py-2 px-4 shadow-2xl flex items-center justify-between border-b border-red-400/30 backdrop-blur-md animate-in slide-in-from-top duration-300';
            banner.innerHTML = `
                <div class="flex items-center gap-2.5">
                    <span class="relative flex h-3 w-3 shrink-0">
                        <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
                        <span class="relative inline-flex rounded-full h-3 w-3 bg-amber-300"></span>
                    </span>
                    <i class="fa-solid fa-cloud-slash text-sm text-amber-300"></i>
                    <span class="leading-tight">সতর্কবার্তা: ডিভাইসটি অফলাইনে রয়েছে! আর্থিক তথ্যের নিরাপত্তা ও গরমিল এড়াতে যেকোনো এন্ট্রি বা ডাটা পরিবর্তন সাময়িকভাবে বন্ধ রাখা হয়েছে।</span>
                </div>
                <button type="button" onclick="window.checkNetworkConnectivity()" class="bg-white/20 hover:bg-white/30 text-white px-3 py-1 rounded-xl text-[11px] font-black cursor-pointer flex items-center gap-1.5 shrink-0 transition-all ml-3 border border-white/20">
                    <i class="fa-solid fa-arrows-rotate"></i>
                    <span>কানেকশন চেক</span>
                </button>
            `;
            document.body.prepend(banner);
        } else {
            banner.classList.remove('hidden');
        }
        isOfflineBannerVisible = true;
    } else {
        if (banner) {
            banner.classList.add('hidden');
        }
        isOfflineBannerVisible = false;
    }
}

/**
 * Initialize Global Network Guard Listeners & Interceptors
 */
export function initGlobalNetworkGuard() {
    window.addEventListener('offline', () => {
        updateOfflineBanner(true);
        showToast('ইন্টারনেট সংযোগ বিচ্ছিন্ন! আর্থিক ডাটা পরিবর্তন সাময়িকভাবে লক করা হয়েছে।', 'error', 'অফলাইন গার্ড');
    });

    window.addEventListener('online', () => {
        updateOfflineBanner(false);
        showToast('ইন্টারনেট সংযোগ ফিরে এসেছে! আপনি এখন নিরাপদে কাজ চালিয়ে যেতে পারেন।', 'success', 'অনলাইন');
    });

    // Check initial state on boot
    if (!navigator.onLine) {
        updateOfflineBanner(true);
    }

    // Intercept mutative buttons clicks if marked with data-require-online
    document.addEventListener('click', (e) => {
        const targetBtn = e.target.closest('[data-require-online]');
        if (targetBtn && !navigator.onLine) {
            e.preventDefault();
            e.stopPropagation();
            const actionLabel = targetBtn.getAttribute('data-require-online') || 'এই কাজটি';
            ensureOnline(actionLabel);
        }
    }, true);
}

// Global Bindings
if (typeof window !== 'undefined') {
    window.ensureOnline = ensureOnline;
    window.checkNetworkConnectivity = checkNetworkConnectivity;
}

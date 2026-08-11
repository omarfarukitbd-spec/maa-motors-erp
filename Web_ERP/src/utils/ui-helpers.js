import Swal from 'sweetalert2';
import * as XLSX from 'xlsx';

/**
 * Universal Contextual Floating Toast Notification System (3s auto-dismiss)
 */
export function showToast(message, type = 'success', boxContext = null) {
    const iconMap = {
        success: 'fa-circle-check text-emerald-400',
        error: 'fa-circle-xmark text-red-400',
        warning: 'fa-triangle-exclamation text-amber-400',
        info: 'fa-circle-info text-blue-400'
    };

    const container = document.getElementById('toast-container') || createToastContainer();
    const contextBadgeHtml = boxContext ? `<span class="px-2 py-0.5 rounded bg-blue-500/20 text-blue-300 font-black border border-blue-500/30 text-[10px] uppercase">${boxContext}</span>` : '';
    
    const toast = document.createElement('div');
    toast.className = `flex items-center gap-2.5 bg-slate-900/95 text-white border border-slate-700/80 px-3.5 py-2.5 rounded-xl shadow-2xl backdrop-blur-md transition-all transform translate-y-2 opacity-0 font-bn text-xs font-bold pointer-events-auto max-w-md`;
    toast.innerHTML = `<i class="fa-solid ${iconMap[type] || iconMap.info} text-base shrink-0"></i> ${contextBadgeHtml} <span>${message}</span>`;
    
    container.appendChild(toast);

    // Animate In
    requestAnimationFrame(() => {
        toast.classList.remove('translate-y-2', 'opacity-0');
        toast.classList.add('translate-y-0', 'opacity-100');
    });

    // Auto Dismiss after 3s
    setTimeout(() => {
        toast.classList.remove('translate-y-0', 'opacity-100');
        toast.classList.add('-translate-y-2', 'opacity-0');
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

function createToastContainer() {
    let el = document.getElementById('toast-container');
    if (!el) {
        el = document.createElement('div');
        el.id = 'toast-container';
        el.className = 'fixed top-4 right-4 z-[999999] flex flex-col gap-2.5 pointer-events-none max-w-sm w-full px-4 sm:px-0';
        document.body.appendChild(el);
    }
    return el;
}

/**
 * Universal Button Loading & Contextual Feedback Controller
 */
export async function withButtonFeedback(buttonElement, asyncTask, successMsg = 'সফলভাবে সেভ হয়েছে!', boxContext = null) {
    if (!buttonElement) return await asyncTask();
    const originalContent = buttonElement.innerHTML;
    try {
        buttonElement.disabled = true;
        buttonElement.innerHTML = `<i class="fa-solid fa-circle-notch fa-spin mr-1"></i> প্রসেসিং...`;
        if (navigator.vibrate) navigator.vibrate(15);
        const result = await asyncTask();
        showToast(successMsg, 'success', boxContext);
        return result;
    } catch (err) {
        showToast(err.message || 'অপারেশন ব্যর্থ হয়েছে!', 'error', boxContext);
        throw err;
    } finally {
        buttonElement.disabled = false;
        buttonElement.innerHTML = originalContent;
    }
}

/**
 * Global Touch Haptic & Micro-Interaction Delegation
 */
export function initGlobalButtonInteractions() {
    document.body.addEventListener('click', (e) => {
        const btn = e.target.closest('button, .m3-btn-primary, .m3-btn-tonal, .m3-btn-icon');
        if (!btn) return;

        // 1. Mobile Haptic Touch Vibration
        if (navigator.vibrate && !btn.disabled) {
            navigator.vibrate(12);
        }

        // 2. Auto Contextual Toast on Data Attribute (if specified)
        const toastMsg = btn.dataset.toastMsg;
        const boxContext = btn.dataset.boxContext;
        if (toastMsg) {
            showToast(toastMsg, 'info', boxContext || 'অ্যাকশন');
        }
    }, { passive: true });
}

/**
 * Shimmer Skeleton Loaders for Data Tables
 */
export function renderSkeletonRows(container, count = 5) {
    if (!container) return;
    let html = '';
    for (let i = 0; i < count; i++) {
        html += `
            <tr class="animate-pulse border-b border-slate-800/40">
                <td class="py-4 px-4"><div class="h-3 bg-slate-800 rounded-md w-16"></div></td>
                <td class="py-4 px-4">
                    <div class="flex items-center gap-3">
                        <div class="w-8 h-8 rounded-full bg-slate-800 shrink-0"></div>
                        <div class="space-y-1.5 flex-grow">
                            <div class="h-3.5 bg-slate-800 rounded-md w-3/4"></div>
                            <div class="h-2.5 bg-slate-800/60 rounded-md w-1/2"></div>
                        </div>
                    </div>
                </td>
                <td class="py-4 px-4"><div class="h-3 bg-slate-800/60 rounded-md w-24"></div></td>
                <td class="py-4 px-4"><div class="h-3 bg-slate-800/60 rounded-md w-20"></div></td>
                <td class="py-4 px-4 text-right"><div class="h-4 bg-slate-800 rounded-md w-16 ml-auto"></div></td>
                <td class="py-4 px-4 text-center"><div class="h-7 bg-slate-800/80 rounded-lg w-24 mx-auto"></div></td>
            </tr>`;
    }
    container.innerHTML = html;
}

/**
 * Live Network Sync Status Indicator
 */
export function initNetworkSyncBadge() {
    const updateStatus = () => {
        const isOnline = navigator.onLine;
        const badge = document.getElementById('network-sync-badge');
        if (badge) {
            badge.innerHTML = isOnline 
                ? `<span class="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse block"></span>`
                : `<span class="w-2.5 h-2.5 rounded-full bg-red-500 block"></span>`;
            badge.className = isOnline 
                ? 'w-8 h-8 flex items-center justify-center rounded-full bg-emerald-500/10 border border-emerald-500/20 shadow-sm cursor-default'
                : 'w-8 h-8 flex items-center justify-center rounded-full bg-red-500/10 border border-red-500/20 shadow-sm cursor-default';
            badge.title = isOnline ? 'অনলাইন — Sync Active' : 'অফলাইন — Local Mode';
        }
    };

    window.addEventListener('online', () => { updateStatus(); showToast('অনলাইন কানেকশন পুনরুদ্ধার হয়েছে!', 'success', 'নেটওয়ার্ক'); });
    window.addEventListener('offline', () => { updateStatus(); showToast('ইন্টারনেট সংযোগ বিচ্ছিন্ন! অফলাইন মোড সক্রিয়।', 'warning', 'নেটওয়ার্ক'); });
    updateStatus();
}

/**
 * Client-Side Table to CSV/Excel Exporter
 */
export function exportTableToExcel(tableId, filename = 'export.xlsx') {
    const table = document.getElementById(tableId);
    if (!table) return showToast('টেবিল ডাটা পাওয়া যায়নি!', 'warning', 'এক্সপোর্ট');

    try {
        const wb = XLSX.utils.book_new();
        const ws = XLSX.utils.table_to_sheet(table, { raw: true });
        XLSX.utils.book_append_sheet(wb, ws, "Sheet1");
        XLSX.writeFile(wb, filename);
        showToast('এক্সেল ডাটা সফলভাবে ডাউনলোড হয়েছে!', 'success', 'এক্সপোর্ট');
    } catch (e) {
        console.error("Excel Export Error:", e);
        showToast('এক্সপোর্ট করতে সমস্যা হয়েছে!', 'error', 'এক্সপোর্ট');
    }
}

/**
 * Mobile & Desktop Safe Universal Print Trigger
 */
export function triggerUniversalPrint(container) {
    if (!container) return;

    const images = Array.from(container.querySelectorAll('img'));
    let loadedCount = 0;
    
    if (images.length === 0) {
        setTimeout(() => window.print(), 100);
        return;
    }

    images.forEach(img => {
        if (img.complete) {
            loadedCount++;
            if (loadedCount === images.length) setTimeout(() => window.print(), 100);
        } else {
            img.onload = img.onerror = () => {
                loadedCount++;
                if (loadedCount === images.length) setTimeout(() => window.print(), 100);
            };
        }
    });
}

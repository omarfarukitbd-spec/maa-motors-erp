/**
 * Dubai Procurement - Container L/C Sub-Ledger Interactive Modals
 * Handles Delivery Date selection, Adding Dated Payment Lines, Editing Payments, and Editing Container Metadata.
 */

import Swal from 'sweetalert2';
import { DubaiLCDAO } from './dubai-lc-dao.js';
import {
    formatAmountWithComma,
    parseAmount,
    getTodayLocalDateString,
    formatAppDate,
    escapeHTML,
    showToast,
    promptSecurityPin,
    ensureOnline
} from '../utils.js';

/**
 * Opens modal to set, update, or clear a container's Delivery Date.
 * @param {Object} containerObj
 */
export async function openDeliveryDateModal(containerObj) {
    if (!containerObj) return;

    const currentDisplayDate = containerObj.deliveryDate ? formatAppDate(containerObj.deliveryDate) : '';

    const result = await Swal.fire({
        title: `<span class="font-bn text-lg font-bold text-white"><i class="fa-solid fa-truck-ramp-box text-emerald-400 mr-2"></i>কন্টেইনার #${containerObj.containerNo} ডেলিভারি তারিখ</span>`,
        background: '#0f172a',
        color: '#f8fafc',
        html: `
            <div class="font-bn text-left space-y-3 mt-2">
                <div class="bg-slate-900 border border-slate-700/80 rounded-xl p-3 text-xs">
                    <div class="text-slate-400">কোম্পানি: <strong class="text-white">${escapeHTML(containerObj.company)}</strong></div>
                    <div class="text-slate-400 mt-0.5">এলসি নং: <strong class="text-sky-400">${escapeHTML(containerObj.lcNo)}</strong></div>
                </div>
                <div>
                    <label class="block text-xs font-bold text-slate-300 mb-1.5">ডেলিভারি / খালাসের তারিখ (DD/MM/YYYY):</label>
                    <input type="text" id="swal-lc-delivery-date" value="${escapeHTML(currentDisplayDate)}" placeholder="তারিখ সিলেক্ট করুন..." class="datepicker w-full bg-slate-950 border border-emerald-500/50 rounded-xl px-3 py-2.5 text-sm text-white font-bold focus:border-emerald-400 outline-none">
                </div>
            </div>
        `,
        showCancelButton: true,
        showDenyButton: Boolean(currentDisplayDate),
        confirmButtonText: '<i class="fa-solid fa-check mr-1"></i> সেভ করুন',
        denyButtonText: '<i class="fa-solid fa-eraser mr-1"></i> তারিখ মুছুন',
        cancelButtonText: 'বাতিল',
        confirmButtonColor: '#059669',
        denyButtonColor: '#dc2626',
        cancelButtonColor: '#334155',
        preConfirm: () => {
            const val = document.getElementById('swal-lc-delivery-date')?.value?.trim();
            if (!val) {
                Swal.showValidationMessage('অনুগ্রহ করে ডেলিভারি তারিখ সিলেক্ট করুন!');
                return false;
            }
            return val;
        }
    });

    if (result.isConfirmed && result.value) {
        if (!ensureOnline()) return;
        try {
            await DubaiLCDAO.updateDeliveryDate(containerObj.id, result.value);
            showToast(`কন্টেইনার #${containerObj.containerNo} ডেলিভারি তারিখ সেভ হয়েছে`, 'success');
        } catch (e) {
            console.error('Delivery date save error:', e);
            showToast('তারিখ সেভ করতে সমস্যা হয়েছে!', 'error');
        }
    } else if (result.isDenied) {
        if (!ensureOnline()) return;
        try {
            await DubaiLCDAO.updateDeliveryDate(containerObj.id, '');
            showToast(`কন্টেইনার #${containerObj.containerNo} ডেলিভারি তারিখ মুছে ফেলা হয়েছে`, 'success');
        } catch (e) {
            console.error('Delivery date clear error:', e);
            showToast('তারিখ মুছতে সমস্যা হয়েছে!', 'error');
        }
    }
}

/**
 * Opens modal to add a new dated installment/expense line under an existing container.
 * @param {Object} containerObj
 */
export async function openAddPaymentLineModal(containerObj) {
    if (!containerObj) return;

    const result = await Swal.fire({
        title: `<span class="font-bn text-lg font-bold text-white"><i class="fa-solid fa-circle-plus text-emerald-400 mr-2"></i>কন্টেইনার #${containerObj.containerNo}-এ নতুন খরচ যোগ</span>`,
        background: '#0f172a',
        color: '#f8fafc',
        html: `
            <div class="font-bn text-left space-y-3 mt-2">
                <div class="bg-slate-900 border border-slate-700/80 rounded-xl p-2.5 text-xs flex items-center justify-between">
                    <span class="text-slate-300">এলসি নং: <strong class="text-sky-400">${escapeHTML(containerObj.lcNo)}</strong></span>
                    <span class="text-slate-300">${escapeHTML(containerObj.company)}</span>
                </div>

                <div>
                    <label class="block text-xs font-bold text-slate-300 mb-1">তারিখ (DD/MM/YYYY):</label>
                    <input type="text" id="swal-lc-pay-date" value="${getTodayLocalDateString()}" class="datepicker w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white font-bold focus:border-sky-500 outline-none">
                </div>

                <div>
                    <label class="block text-xs font-bold text-slate-300 mb-1">খরচের বিবরণ:</label>
                    <input type="text" id="swal-lc-pay-desc" value="অতিরিক্ত এলসি / ক্যাশ পেমেন্ট" class="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white font-bold focus:border-sky-500 outline-none">
                </div>

                <div class="grid grid-cols-2 gap-3">
                    <div>
                        <label class="block text-xs font-bold text-teal-400 mb-1">ডলার (USD $) (যদি থাকে):</label>
                        <input type="text" id="swal-lc-pay-usd" value="" placeholder="0" oninput="window.handleNumberInput(this)" class="w-full bg-slate-950 border border-teal-500/40 rounded-xl px-3 py-2 text-xs text-teal-400 font-mono font-bold text-right outline-none">
                    </div>
                    <div>
                        <label class="block text-xs font-bold text-red-400 mb-1">টাকা (BDT TK):</label>
                        <input type="text" id="swal-lc-pay-bdt" placeholder="0.00" oninput="window.handleNumberInput(this); window.updateLiveWords(this, 'swal-lc-pay-words');" class="w-full bg-slate-950 border border-red-500/60 rounded-xl px-3 py-2 text-xs text-red-400 font-mono font-black text-right outline-none">
                    </div>
                </div>

                <div class="text-[11px] bg-slate-900/90 border border-slate-800 rounded-lg p-2 text-slate-400">
                    <span>কথায়:</span>
                    <span id="swal-lc-pay-words" class="text-amber-400 font-bold ml-1">শূন্য টাকা মাত্র</span>
                </div>
            </div>
        `,
        showCancelButton: true,
        confirmButtonText: '<i class="fa-solid fa-check mr-1"></i> কিস্তি যোগ করুন',
        cancelButtonText: 'বাতিল',
        confirmButtonColor: '#059669',
        cancelButtonColor: '#334155',
        preConfirm: () => {
            const date = document.getElementById('swal-lc-pay-date')?.value?.trim();
            const description = document.getElementById('swal-lc-pay-desc')?.value?.trim();
            const amountUSD = parseAmount(document.getElementById('swal-lc-pay-usd')?.value || 0);
            const amountBDT = parseAmount(document.getElementById('swal-lc-pay-bdt')?.value || 0);

            if (!date) {
                Swal.showValidationMessage('তারিখ দেওয়া আবশ্যক!');
                return false;
            }
            if (amountBDT <= 0 && amountUSD <= 0) {
                Swal.showValidationMessage('ডলার অথবা টাকা যেকোনো একটি পরিমাণ লিখুন!');
                return false;
            }

            return { date, description, amountUSD, amountBDT };
        }
    });

    if (result.isConfirmed && result.value) {
        if (!ensureOnline()) return;
        try {
            await DubaiLCDAO.addPaymentLine(containerObj.id, result.value);
            showToast(`কন্টেইনার #${containerObj.containerNo}-এ নতুন তারিখের খরচ যোগ হয়েছে`, 'success');
        } catch (e) {
            console.error('Add payment line error:', e);
            showToast('খরচ যোগ করতে সমস্যা হয়েছে!', 'error');
        }
    }
}

/**
 * Opens modal to edit a specific payment line inside a container (PIN protected).
 * @param {Object} containerObj
 * @param {Object} paymentObj
 */
export async function openEditPaymentLineModal(containerObj, paymentObj) {
    if (!containerObj || !paymentObj) return;

    const pinVerified = await promptSecurityPin('এলসি পেমেন্ট লাইন এডিট করতে সিকিউরিটি পিন দিন');
    if (!pinVerified) return;

    const result = await Swal.fire({
        title: `<span class="font-bn text-lg font-bold text-white"><i class="fa-solid fa-pen-to-square text-sky-400 mr-2"></i>কিস্তি এডিট (কন্টেইনার #${containerObj.containerNo})</span>`,
        background: '#0f172a',
        color: '#f8fafc',
        html: `
            <div class="font-bn text-left space-y-3 mt-2">
                <div>
                    <label class="block text-xs font-bold text-slate-300 mb-1">তারিখ:</label>
                    <input type="text" id="swal-edit-pay-date" value="${formatAppDate(paymentObj.date)}" class="datepicker w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white font-bold outline-none">
                </div>
                <div>
                    <label class="block text-xs font-bold text-slate-300 mb-1">খরচের বিবরণ:</label>
                    <input type="text" id="swal-edit-pay-desc" value="${escapeHTML(paymentObj.description || '')}" class="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white font-bold outline-none">
                </div>
                <div class="grid grid-cols-2 gap-3">
                    <div>
                        <label class="block text-xs font-bold text-teal-400 mb-1">ডলার (USD):</label>
                        <input type="text" id="swal-edit-pay-usd" value="${paymentObj.amountUSD > 0 ? formatAmountWithComma(paymentObj.amountUSD) : ''}" oninput="window.handleNumberInput(this)" class="w-full bg-slate-950 border border-teal-500/40 rounded-xl px-3 py-2 text-xs text-teal-400 font-mono font-bold text-right outline-none">
                    </div>
                    <div>
                        <label class="block text-xs font-bold text-red-400 mb-1">টাকা (BDT):</label>
                        <input type="text" id="swal-edit-pay-bdt" value="${formatAmountWithComma(paymentObj.amountBDT)}" oninput="window.handleNumberInput(this); window.updateLiveWords(this, 'swal-edit-pay-words');" class="w-full bg-slate-950 border border-red-500/60 rounded-xl px-3 py-2 text-xs text-red-400 font-mono font-black text-right outline-none">
                    </div>
                </div>
                <div class="text-[11px] bg-slate-900/90 border border-slate-800 rounded-lg p-2 text-slate-400">
                    <span>কথায়:</span>
                    <span id="swal-edit-pay-words" class="text-amber-400 font-bold ml-1"></span>
                </div>
            </div>
        `,
        didOpen: () => {
            const bdtInput = document.getElementById('swal-edit-pay-bdt');
            if (bdtInput && window.updateLiveWords) {
                window.updateLiveWords(bdtInput, 'swal-edit-pay-words');
            }
        },
        showCancelButton: true,
        confirmButtonText: '<i class="fa-solid fa-save mr-1"></i> আপডেট করুন',
        cancelButtonText: 'বাতিল',
        confirmButtonColor: '#0284c7',
        cancelButtonColor: '#334155',
        preConfirm: () => {
            const date = document.getElementById('swal-edit-pay-date')?.value?.trim();
            const description = document.getElementById('swal-edit-pay-desc')?.value?.trim();
            const amountUSD = parseAmount(document.getElementById('swal-edit-pay-usd')?.value || 0);
            const amountBDT = parseAmount(document.getElementById('swal-edit-pay-bdt')?.value || 0);
            if (!date || (amountBDT <= 0 && amountUSD <= 0)) {
                Swal.showValidationMessage('সঠিক তারিখ এবং পরিমাণ লিখুন!');
                return false;
            }
            return { date, description, amountUSD, amountBDT };
        }
    });

    if (result.isConfirmed && result.value) {
        if (!ensureOnline()) return;
        try {
            await DubaiLCDAO.updatePaymentLine(containerObj.id, paymentObj.id, result.value);
            showToast('কিস্তির হিসাব আপডেট হয়েছে', 'success');
        } catch (e) {
            console.error('Update payment line error:', e);
            showToast('আপডেট করতে সমস্যা হয়েছে!', 'error');
        }
    }
}

/**
 * Opens modal to edit container header metadata (Container No, LC No, Company, Notes)
 * @param {Object} containerObj
 */
export async function openEditContainerMetaModal(containerObj) {
    if (!containerObj) return;

    const pinVerified = await promptSecurityPin('কন্টেইনার তথ্য এডিট করতে সিকিউরিটি পিন দিন');
    if (!pinVerified) return;

    const result = await Swal.fire({
        title: `<span class="font-bn text-lg font-bold text-white"><i class="fa-solid fa-box-open text-sky-400 mr-2"></i>কন্টেইনার তথ্য সংশোধন</span>`,
        background: '#0f172a',
        color: '#f8fafc',
        html: `
            <div class="font-bn text-left space-y-3 mt-2">
                <div class="grid grid-cols-2 gap-3">
                    <div>
                        <label class="block text-xs font-bold text-slate-300 mb-1">কন্টেইনার নং:</label>
                        <input type="number" id="swal-meta-cno" value="${containerObj.containerNo}" class="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white font-bold outline-none">
                    </div>
                    <div>
                        <label class="block text-xs font-bold text-slate-300 mb-1">এলসি নং (L/C No):</label>
                        <input type="text" id="swal-meta-lcno" value="${escapeHTML(containerObj.lcNo)}" class="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white font-bold outline-none">
                    </div>
                </div>
                <div>
                    <label class="block text-xs font-bold text-slate-300 mb-1">কোম্পানি / বেনিফিশিয়ারি:</label>
                    <input type="text" id="swal-meta-comp" value="${escapeHTML(containerObj.company)}" class="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white font-bold outline-none">
                </div>
                <div>
                    <label class="block text-xs font-bold text-slate-300 mb-1">নোট (যদি থাকে):</label>
                    <input type="text" id="swal-meta-notes" value="${escapeHTML(containerObj.notes || '')}" class="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white font-bold outline-none">
                </div>
            </div>
        `,
        showCancelButton: true,
        confirmButtonText: 'সংরক্ষণ করুন',
        cancelButtonText: 'বাতিল',
        confirmButtonColor: '#0284c7',
        cancelButtonColor: '#334155',
        preConfirm: () => {
            const containerNo = Number(document.getElementById('swal-meta-cno')?.value);
            const lcNo = document.getElementById('swal-meta-lcno')?.value?.trim();
            const company = document.getElementById('swal-meta-comp')?.value?.trim();
            const notes = document.getElementById('swal-meta-notes')?.value?.trim();
            if (!containerNo || !lcNo || !company) {
                Swal.showValidationMessage('কন্টেইনার নং, এলসি নং ও কোম্পানি দেওয়া আবশ্যক!');
                return false;
            }
            return { containerNo, lcNo, company, notes };
        }
    });

    if (result.isConfirmed && result.value) {
        if (!ensureOnline()) return;
        try {
            await DubaiLCDAO.saveContainerLC({
                ...containerObj,
                ...result.value
            });
            showToast('কন্টেইনার তথ্য আপডেট হয়েছে', 'success');
        } catch (e) {
            console.error('Update container metadata error:', e);
            showToast('আপডেট করতে সমস্যা হয়েছে!', 'error');
        }
    }
}

/**
 * Dubai Procurement - Container L/C Sub-Ledger Interactive Modals
 * Handles Delivery Date selection, Adding Dated Payment Lines, Editing Payments, and Editing Container Metadata.
 */

import Swal from 'sweetalert2';
import { DubaiLCDAO } from './dubai-lc-dao.js';
import { isContainerClosed } from './dubai-lc-calc.js';
import {
    formatAmountWithComma, parseAmount, getTodayLocalDateString, formatAppDate,
    escapeHTML, showToast, promptSecurityPin, ensureOnline
} from '../utils.js';

/**
 * Opens modal to manage Container L/C Closing Status ("শেষ/সমাপ্ত" vs "চলমান") and optional Delivery Date.
 * @param {Object} containerObj
 */
export async function openDeliveryDateModal(containerObj) {
    if (!containerObj) return;

    const wasClosed = isContainerClosed(containerObj);
    const currentDisplayDate = containerObj.deliveryDate ? formatAppDate(containerObj.deliveryDate) : '';

    const result = await Swal.fire({
        title: `<span class="font-bn text-lg font-bold text-white"><i class="fa-solid fa-clipboard-check text-emerald-400 mr-2"></i>কন্টেইনার #${containerObj.containerNo} ক্লোজিং ও ডেলিভারি</span>`,
        width: '520px',
        background: '#0f172a',
        color: '#f8fafc',
        html: `
            <div class="font-bn text-left space-y-3.5 mt-2">
                <div class="bg-slate-900 border border-slate-700/80 rounded-xl p-3 text-xs flex items-center justify-between gap-2">
                    <div>
                        <div class="text-slate-400">কোম্পানি: <strong class="text-white">${escapeHTML(containerObj.company)}</strong></div>
                        <div class="text-slate-400 mt-0.5">এলসি নং: <strong class="text-sky-400">${escapeHTML(containerObj.lcNo)}</strong></div>
                    </div>
                    <span class="px-2.5 py-1 rounded-lg text-[11px] font-black border ${wasClosed ? 'bg-emerald-500/15 text-emerald-300 border-emerald-500/35' : 'bg-amber-500/15 text-amber-300 border-amber-500/35'}">
                        ${wasClosed ? 'বর্তমান: সমাপ্ত (শেষ)' : 'বর্তমান: চলমান'}
                    </span>
                </div>

                <div>
                    <label class="block text-xs font-bold text-slate-300 mb-2">১. কন্টেইনারের বর্তমান হিসাব অবস্থা:</label>
                    <div class="grid grid-cols-2 gap-2.5">
                        <label class="cursor-pointer bg-slate-950 border border-emerald-500/40 hover:border-emerald-400 rounded-xl p-2.5 flex items-start gap-2 transition-all">
                            <input type="radio" name="swal-lc-settled-state" value="settled" ${wasClosed ? 'checked' : ''} class="mt-0.5 accent-emerald-500 cursor-pointer">
                            <div>
                                <div class="text-xs font-black text-emerald-400">শেষ / চূড়ান্ত সমাপ্ত</div>
                                <div class="text-[10px] text-slate-400 mt-0.5">হিসাব ক্লোজ ও এডিট লক থাকবে</div>
                            </div>
                        </label>
                        <label class="cursor-pointer bg-slate-950 border border-amber-500/40 hover:border-amber-400 rounded-xl p-2.5 flex items-start gap-2 transition-all">
                            <input type="radio" name="swal-lc-settled-state" value="open" ${!wasClosed ? 'checked' : ''} class="mt-0.5 accent-amber-500 cursor-pointer">
                            <div>
                                <div class="text-xs font-black text-amber-400">চলমান / খোলা</div>
                                <div class="text-[10px] text-slate-400 mt-0.5">নতুন খরচ বা কিস্তি যোগ করা যাবে</div>
                            </div>
                        </label>
                    </div>
                </div>

                <div>
                    <div class="flex items-center justify-between mb-1.5">
                        <label class="text-xs font-bold text-slate-300">২. ডেলিভারি / খালাসের তারিখ (ঐচ্ছিক):</label>
                        ${currentDisplayDate ? `<button type="button" id="btn-clear-lc-del-date" class="text-[10px] text-red-400 hover:text-red-300 font-bold cursor-pointer"><i class="fa-solid fa-eraser mr-1"></i>তারিখ মুছুন</button>` : ''}
                    </div>
                    <input type="text" id="swal-lc-delivery-date" value="${escapeHTML(currentDisplayDate)}" placeholder="তারিখ না জানলে খালি রাখতে পারেন..." class="datepicker w-full bg-slate-950 border border-slate-700 focus:border-emerald-400 rounded-xl px-3 py-2.5 text-sm text-white font-bold outline-none">
                    <p class="text-[10px] text-slate-500 mt-1">ডেলিভারি তারিখ দিলে কন্টেইনারটি স্বয়ংক্রিয়ভাবে সমাপ্ত হিসেবে সংরক্ষিত হবে।</p>
                </div>
            </div>
        `,
        showCancelButton: true,
        confirmButtonText: '<i class="fa-solid fa-check mr-1"></i> স্ট্যাটাস সংরক্ষণ করুন',
        cancelButtonText: 'বাতিল',
        confirmButtonColor: '#059669',
        cancelButtonColor: '#334155',
        didOpen: () => {
            const clearBtn = document.getElementById('btn-clear-lc-del-date');
            const dateInp = document.getElementById('swal-lc-delivery-date');
            if (clearBtn && dateInp) {
                clearBtn.onclick = () => {
                    dateInp.value = '';
                    if (dateInp._flatpickr) dateInp._flatpickr.clear();
                };
            }
            if (dateInp) {
                dateInp.addEventListener('change', () => {
                    if (dateInp.value.trim() !== '') {
                        const settledRadio = document.querySelector('input[name="swal-lc-settled-state"][value="settled"]');
                        if (settledRadio) settledRadio.checked = true;
                    }
                });
            }
        },
        preConfirm: () => {
            const selected = document.querySelector('input[name="swal-lc-settled-state"]:checked')?.value || 'open';
            const delDate = document.getElementById('swal-lc-delivery-date')?.value?.trim() || '';
            const isSettled = selected === 'settled' || delDate !== '';
            return { isSettled, deliveryDate: delDate };
        }
    });

    if (result.isConfirmed && result.value) {
        if (!ensureOnline()) return;
        const { isSettled, deliveryDate } = result.value;

        // Audit guard: reopening a closed container or closing requires Security PIN
        if (wasClosed && !isSettled) {
            const pinOk = await promptSecurityPin('সমাপ্ত কন্টেইনার পুনরায় চালু (Reopen) করতে সিকিউরিটি পিন দিন');
            if (!pinOk) return;
        }

        try {
            await DubaiLCDAO.updateContainerStatus(containerObj.id, { isSettled, deliveryDate });
            showToast(
                isSettled
                    ? `কন্টেইনার #${containerObj.containerNo} "শেষ / সমাপ্ত" হিসেবে সংরক্ষিত হয়েছে`
                    : `কন্টেইনার #${containerObj.containerNo} "চলমান" অবস্থায় ফেরত আনা হয়েছে`,
                'success'
            );
        } catch (e) {
            console.error('Container status save error:', e);
            showToast('স্ট্যাটাস সেভ করতে সমস্যা হয়েছে!', 'error');
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

/**
 * Extracts numeric container index from Port Duty text (e.g. "১ নং কন্টেইনার" -> 1, "7 নং" -> 7).
 * @param {string} rawText
 * @returns {number|null}
 */
function parseContainerNoFromText(rawText = '') {
    const bnMap = { '০': '0', '১': '1', '২': '2', '৩': '3', '৪': '4', '৫': '5', '৬': '6', '৭': '7', '৮': '8', '৯': '9' };
    const normalized = String(rawText).replace(/[০-৯]/g, d => bnMap[d] || d);
    const match = normalized.match(/\d+/);
    return match ? Number(match[0]) : null;
}

/**
 * Opens Bulk Closing & Port-Duty (০০০৪) Cross-Sync modal to close or reopen containers in 1 click.
 * @param {Array} lcBillsList
 * @param {Array} portDutyBillsList
 */
export async function openBulkCloseContainersModal(lcBillsList = [], portDutyBillsList = []) {
    if (!Array.isArray(lcBillsList) || lcBillsList.length === 0) {
        showToast('সিঙ্ক করার জন্য কোনো কন্টেইনার পাওয়া যায়নি', 'error');
        return;
    }

    const clearedInPortSet = new Set();
    portDutyBillsList.forEach(p => {
        const num = parseContainerNoFromText(p.containerNo || p.orderIndex);
        if (num) clearedInPortSet.add(num);
    });

    const rowsHtml = lcBillsList.map(c => {
        const cNum = Number(c.containerNo || c.orderIndex || 0);
        const currentlyClosed = isContainerClosed(c);
        const isInPortDuty = clearedInPortSet.has(cNum);
        const checkedByDefault = currentlyClosed || isInPortDuty;

        return `
            <label class="flex items-center justify-between gap-2 p-2.5 rounded-xl bg-slate-950/90 border border-slate-800 hover:border-cyan-500/40 cursor-pointer transition-all">
                <div class="flex items-center gap-2.5 min-w-0">
                    <input type="checkbox" class="bulk-lc-close-chk w-4 h-4 accent-emerald-500 cursor-pointer shrink-0"
                        data-cid="${escapeHTML(c.id)}" data-port-cleared="${isInPortDuty ? '1' : '0'}"
                        ${checkedByDefault ? 'checked' : ''}>
                    <div class="min-w-0">
                        <div class="text-xs font-black text-white flex items-center gap-1.5 flex-wrap">
                            <span class="text-cyan-400">#${cNum} নং</span>
                            <span class="font-mono text-sky-400">LC: ${escapeHTML(c.lcNo)}</span>
                            <span class="text-slate-300 font-bold truncate">${escapeHTML(c.company)}</span>
                        </div>
                        <div class="text-[10px] text-slate-400 mt-0.5">
                            মোট ব্যয়: <span class="text-red-400 font-mono font-bold">৳ ${formatAmountWithComma(c.totalBDT || 0)}</span>
                            ${isInPortDuty ? '<span class="ml-2 px-1.5 py-0.5 rounded bg-indigo-500/15 text-indigo-300 border border-indigo-500/30 font-bold">পোর্ট বিল (০০০৪) খালাস</span>' : '<span class="ml-2 text-amber-400 font-bold">এখনো পোর্ট বিল (০০০৪) নেই</span>'}
                        </div>
                    </div>
                </div>
                <span class="bulk-lc-badge shrink-0 px-2 py-0.5 rounded-lg text-[10px] font-black border ${checkedByDefault ? 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30' : 'bg-amber-500/15 text-amber-300 border-amber-500/30'}">
                    ${checkedByDefault ? 'শেষ / সমাপ্ত' : 'চলমান'}
                </span>
            </label>
        `;
    }).join('');

    const res = await Swal.fire({
        title: '<span class="font-bn text-lg font-black text-white"><i class="fa-solid fa-list-check text-emerald-400 mr-2"></i>কন্টেইনার ক্লোজিং ও পোর্ট বিল সিঙ্ক</span>',
        width: '620px',
        background: '#0f172a',
        color: '#f8fafc',
        html: `
            <div class="font-bn text-left space-y-3 text-xs">
                <div class="bg-sky-950/35 border border-sky-500/30 rounded-xl p-2.5 text-[11px] text-sky-200 leading-relaxed">
                    <i class="fa-solid fa-circle-info text-sky-400 mr-1"></i>
                    যে কন্টেইনারগুলোর হিসাব <strong>শেষ হয়েছে</strong> সেগুলোতে টিক রাখুন (পোর্ট বিল ০০০৪-এ খালাস পাওয়া কন্টেইনারগুলো স্বয়ংক্রিয়ভাবে সিলেক্ট করা হয়েছে)। যেগুলো এখনো শেষ হয়নি (যেমন ৮ ও ৯ নং) সেগুলোর টিক উঠিয়ে দিন।
                </div>
                <div class="flex flex-wrap items-center justify-between gap-2">
                    <div id="bulk-lc-counter" class="text-[11px] font-black text-slate-300"></div>
                    <div class="flex items-center gap-1.5">
                        <button type="button" id="btn-bulk-lc-port" class="px-2.5 py-1 rounded-lg bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-300 border border-indigo-500/35 text-[10px] font-bold cursor-pointer">পোর্ট বিল (০০০৪) অনুযায়ী</button>
                        <button type="button" id="btn-bulk-lc-all" class="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-[10px] font-bold cursor-pointer">সব শেষ</button>
                        <button type="button" id="btn-bulk-lc-none" class="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-[10px] font-bold cursor-pointer">সব চলমান</button>
                    </div>
                </div>
                <div class="max-h-72 overflow-y-auto pr-1 space-y-2 custom-scrollbar">
                    ${rowsHtml}
                </div>
            </div>
        `,
        showCancelButton: true,
        confirmButtonText: '<i class="fa-solid fa-floppy-disk mr-1"></i> সব আপডেট সংরক্ষণ করুন',
        cancelButtonText: 'বাতিল',
        confirmButtonColor: '#059669',
        cancelButtonColor: '#334155',
        didOpen: () => {
            const refreshBadges = () => {
                const chks = [...document.querySelectorAll('.bulk-lc-close-chk')];
                let closedC = 0;
                chks.forEach(chk => {
                    if (chk.checked) closedC += 1;
                    const badge = chk.closest('label')?.querySelector('.bulk-lc-badge');
                    if (badge) {
                        badge.textContent = chk.checked ? 'শেষ / সমাপ্ত' : 'চলমান';
                        badge.className = `bulk-lc-badge shrink-0 px-2 py-0.5 rounded-lg text-[10px] font-black border ${chk.checked ? 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30' : 'bg-amber-500/15 text-amber-300 border-amber-500/30'}`;
                    }
                });
                const counterEl = document.getElementById('bulk-lc-counter');
                if (counterEl) {
                    counterEl.innerHTML = `<span class="text-emerald-400">সমাপ্ত (শেষ): ${closedC} টি</span> | <span class="text-amber-400">চলমান (বাকি): ${chks.length - closedC} টি</span>`;
                }
            };

            const setAll = (fn) => {
                document.querySelectorAll('.bulk-lc-close-chk').forEach(chk => { chk.checked = fn(chk); });
                refreshBadges();
            };
            document.querySelectorAll('.bulk-lc-close-chk').forEach(chk => { chk.onchange = refreshBadges; });
            document.getElementById('btn-bulk-lc-port')?.addEventListener('click', () => setAll(chk => chk.getAttribute('data-port-cleared') === '1'));
            document.getElementById('btn-bulk-lc-all')?.addEventListener('click', () => setAll(() => true));
            document.getElementById('btn-bulk-lc-none')?.addEventListener('click', () => setAll(() => false));
            refreshBadges();
        },
        preConfirm: () => {
            return [...document.querySelectorAll('.bulk-lc-close-chk')].map(chk => ({
                id: chk.getAttribute('data-cid'),
                isSettled: chk.checked
            }));
        }
    });

    if (!res.isConfirmed || !res.value) return;
    if (!ensureOnline()) return;

    const pinOk = await promptSecurityPin('কন্টেইনার ক্লোজিং স্ট্যাটাস ব্যাচ আপডেট করতে পিন দিন');
    if (!pinOk) return;

    try {
        await DubaiLCDAO.batchSetContainersStatus(res.value);
        const closedNow = res.value.filter(x => x.isSettled).length;
        showToast(`সফলভাবে ${closedNow}টি সমাপ্ত ও ${res.value.length - closedNow}টি চলমান হিসেবে সংরক্ষিত হয়েছে`, 'success');
    } catch (e) {
        console.error('Bulk container status error:', e);
        showToast('বাল্ক আপডেট করতে সমস্যা হয়েছে!', 'error');
    }
}

import { escapeHTML, formatAmountWithComma, formatAppDate, numberToBanglaWords } from '../utils.js';
import { renderInCardLedgerHistory } from './memo-history-table.js';
import './memo-actions-bridge.js';
import './memo-ledger-drawer.js';
import './memo-quick-pay.js';
import './memo-edit.js';

/**
 * Render Ultra-Premium Next-Gen Memo Card UI
 */
export function renderMemoCardHTML(txn, adjacent = {}, lifetimeStats = {}) {
    if (!txn) return '';

    const bill = Number(txn.bill) || 0;
    const paid = Number(txn.paid) || 0;
    const prevDue = Number(txn.computedPrevDue) || 0;
    const currentDue = Number(txn.computedCurrentDue) || 0;
    const cleanCustName = String(txn.customerName || 'গ্রাহক').replace(/^\[.*?\]\s*/, '').trim();

    // Watermark Stamp & Status Badge
    let watermarkText = 'DUE';
    let watermarkColor = '#dc2626';
    let statusBadge = '';

    if (bill > 0 && paid >= bill) {
        watermarkText = 'PAID';
        watermarkColor = '#059669';
        statusBadge = '<span class="px-2.5 py-1 rounded-full text-xs font-black bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"><i class="fa-solid fa-circle-check mr-1"></i>পরিশোধিত (PAID)</span>';
    } else if (bill > 0 && paid < bill) {
        watermarkText = 'DUE';
        watermarkColor = '#dc2626';
        statusBadge = '<span class="px-2.5 py-1 rounded-full text-xs font-black bg-red-500/10 text-red-400 border border-red-500/20"><i class="fa-solid fa-circle-exclamation mr-1"></i>বকেয়া (DUE)</span>';
    } else if (paid > 0) {
        watermarkText = 'COLLECTED';
        watermarkColor = '#9333ea';
        statusBadge = '<span class="px-2.5 py-1 rounded-full text-xs font-black bg-purple-500/10 text-purple-400 border border-purple-500/20"><i class="fa-solid fa-receipt mr-1"></i>জমা রিসিট</span>';
    } else {
        watermarkText = 'RECORD';
        watermarkColor = '#3b82f6';
        statusBadge = '<span class="px-2.5 py-1 rounded-full text-xs font-black bg-blue-500/10 text-blue-400 border border-blue-500/20"><i class="fa-solid fa-info-circle mr-1"></i>এন্ট্রি</span>';
    }

    // Payment Method
    let paymentMethodHtml = '';
    if (paid > 0 && txn.receivedType) {
        paymentMethodHtml = `<span class="px-2 py-0.5 rounded text-[10px] font-black bg-emerald-500/10 text-emerald-300 border border-emerald-500/20 ml-1.5">${escapeHTML(txn.receivedType)}${txn.receivedFrom ? ' • ' + escapeHTML(txn.receivedFrom) : ''}</span>`;
    }

    // Item Table (if items exist)
    let itemsTableHtml = '';
    if (txn.hasItems && txn.items && txn.items.length > 0) {
        itemsTableHtml = `
            <div class="overflow-x-auto custom-scrollbar border border-slate-700/60 rounded-2xl mb-4 bg-slate-950/40">
                <table class="w-full text-left text-xs border-collapse">
                    <thead>
                        <tr class="bg-slate-900/90 text-slate-300 border-b border-slate-700/60 font-black">
                            <th class="py-2.5 px-3 text-center w-12">#</th>
                            <th class="py-2.5 px-3">পণ্যের বিবরণ / আইটেম</th>
                            <th class="py-2.5 px-3 text-center">পরিমাণ</th>
                            <th class="py-2.5 px-3 text-right">একক দর</th>
                            <th class="py-2.5 px-3 text-right">মোট টাকা</th>
                        </tr>
                    </thead>
                    <tbody class="divide-y divide-slate-800/60">
                        ${txn.items.map((it, idx) => `
                            <tr class="hover:bg-slate-800/30 transition-colors">
                                <td class="py-2 px-3 text-center font-mono text-slate-500">${String(idx + 1).padStart(2, '0')}</td>
                                <td class="py-2 px-3 font-bold text-slate-200">${escapeHTML(it.desc || '-')}</td>
                                <td class="py-2 px-3 text-center font-mono text-slate-300">${it.qty || 1} ${it.unit || 'Pcs'}</td>
                                <td class="py-2 px-3 text-right font-mono text-slate-300">৳${formatAmountWithComma(it.rate || 0)}</td>
                                <td class="py-2 px-3 text-right font-mono font-black text-white">৳${formatAmountWithComma(it.total || 0)}</td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            </div>
        `;
    }

    const publicUrl = `${window.location.origin}${window.location.pathname}?view=public-memo&id=${txn.id}`;
    const qrCodeSrc = `https://api.qrserver.com/v1/create-qr-code/?size=120x120&margin=2&data=${encodeURIComponent(publicUrl)}`;

    const billWords = bill > 0 ? numberToBanglaWords(bill) : '';
    const dueWords = currentDue !== 0 ? numberToBanglaWords(Math.abs(currentDue)) : '';

    return `
        <div class="space-y-4">
            <!-- Stepper Navigation Bar -->
            <div class="flex items-center justify-between gap-3 px-1 text-xs font-bn">
                ${adjacent.prevMemo ? `
                    <button onclick="window.searchMemoDirectly('${escapeHTML(adjacent.prevMemo.voucherNo)}')" class="px-4 py-2 rounded-2xl bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-700/80 shadow-md transition-all flex items-center gap-2 active:scale-95 cursor-pointer">
                        <i class="fa-solid fa-arrow-left text-xs text-cyan-400"></i>
                        <span>পূর্ববর্তী মেমো: <strong class="font-mono text-cyan-300 font-black">#${escapeHTML(adjacent.prevMemo.voucherNo)}</strong></span>
                    </button>
                ` : '<div></div>'}
                ${adjacent.nextMemo ? `
                    <button onclick="window.searchMemoDirectly('${escapeHTML(adjacent.nextMemo.voucherNo)}')" class="px-4 py-2 rounded-2xl bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-700/80 shadow-md transition-all flex items-center gap-2 active:scale-95 cursor-pointer ml-auto">
                        <span>পরবর্তী মেমো: <strong class="font-mono text-cyan-300 font-black">#${escapeHTML(adjacent.nextMemo.voucherNo)}</strong></span>
                        <i class="fa-solid fa-arrow-right text-xs text-cyan-400"></i>
                    </button>
                ` : '<div></div>'}
            </div>

            <!-- Main Memo Card -->
            <div class="relative overflow-hidden bg-slate-900/90 border border-slate-700/80 rounded-3xl p-4 sm:p-7 shadow-2xl backdrop-blur-2xl animate-fade-in font-bn">
                <!-- Watermark Stamp -->
                <div class="absolute right-8 top-24 pointer-events-none select-none opacity-10 sm:opacity-15 transform -rotate-12 border-4 sm:border-8 border-dashed rounded-2xl px-6 py-2 text-center text-4xl sm:text-6xl font-black font-sans uppercase tracking-widest z-0" style="color: ${watermarkColor}; border-color: ${watermarkColor};">
                    ${watermarkText}
                </div>

                <!-- Header Bar -->
                <div class="relative z-10 flex flex-wrap items-center justify-between gap-4 border-b border-slate-800/80 pb-5 mb-5">
                    <div class="flex items-center gap-3.5">
                        <div class="w-13 h-13 rounded-2xl bg-gradient-to-tr from-cyan-600/30 to-blue-600/20 border border-cyan-500/40 flex items-center justify-center text-cyan-400 text-2xl font-black shadow-lg shadow-cyan-900/20">
                            <i class="fa-solid fa-receipt"></i>
                        </div>
                        <div>
                            <div class="flex items-center gap-2.5 flex-wrap">
                                <span class="text-2xl font-black text-white tracking-tight font-mono">#${escapeHTML(txn.voucherNo || txn.id.slice(-6).toUpperCase())}</span>
                                ${statusBadge}
                            </div>
                            <div class="flex items-center gap-2 text-xs text-slate-400 mt-1">
                                <span><i class="fa-regular fa-calendar text-cyan-400 mr-1"></i>${formatAppDate(txn.date)}</span>
                                <span>•</span>
                                <span><i class="fa-solid fa-user-pen text-slate-500 mr-1"></i>${escapeHTML(txn.createdBy || 'Staff')}</span>
                            </div>
                        </div>
                    </div>

                    <!-- Action Hub Buttons -->
                    <div class="flex flex-wrap items-center gap-2">
                        <button onclick="window.printMemoReceipt('${txn.id}', 'a4')" class="h-9 px-3.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-black text-xs flex items-center gap-1.5 shadow-lg shadow-blue-600/25 active:scale-95 transition-all cursor-pointer" title="A4 সাইজ ইনভয়েস প্রিন্ট">
                            <i class="fa-solid fa-print"></i><span>A4 প্রিন্ট</span>
                        </button>
                        <button onclick="window.printMemoReceipt('${txn.id}', 'pos')" class="h-9 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs flex items-center gap-1.5 border border-slate-700 active:scale-95 transition-all cursor-pointer" title="৮০মিমি POS থার্মাল রসিদ">
                            <i class="fa-solid fa-receipt"></i><span>POS মেমো</span>
                        </button>
                        ${currentDue > 0 ? `
                            <button onclick="window.openMemoQuickPayModal('${txn.id}', '${escapeHTML(txn.voucherNo || '')}', '${txn.customerId}', ${currentDue})" class="h-9 px-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs flex items-center gap-1.5 shadow-lg shadow-emerald-900/30 active:scale-95 transition-all cursor-pointer" title="সরাসরি টাকা জমা নিন">
                                <i class="fa-solid fa-hand-holding-dollar text-sm"></i><span>টাকা জমা নিন</span>
                            </button>
                        ` : ''}
                        <button onclick="window.openCustomerLedgerDrawer('${txn.customerId}')" class="h-9 px-3 rounded-xl bg-purple-600/20 hover:bg-purple-600 text-purple-300 hover:text-white font-bold text-xs flex items-center gap-1.5 border border-purple-500/30 active:scale-95 transition-all cursor-pointer" title="কাস্টমারের সম্পূর্ণ খতিয়ান দেখুন ও প্রিন্ট করুন">
                            <i class="fa-solid fa-book"></i><span>পূর্ণ খতিয়ান</span>
                        </button>
                        <button onclick="window.openMemoEditModal('${txn.id}')" class="h-9 px-3 rounded-xl bg-amber-600/20 hover:bg-amber-600 text-amber-300 hover:text-white font-bold text-xs flex items-center gap-1.5 border border-amber-500/30 active:scale-95 transition-all cursor-pointer" title="মেমো সংশোধন করুন">
                            <i class="fa-solid fa-pen-to-square"></i><span>এডিট</span>
                        </button>
                        <button onclick="window.shareMemoOnWhatsApp('${txn.id}')" class="h-9 px-3 rounded-xl bg-emerald-600/20 hover:bg-emerald-600 text-emerald-400 hover:text-white font-bold text-xs flex items-center gap-1.5 border border-emerald-500/30 active:scale-95 transition-all cursor-pointer" title="WhatsApp মেসেজ">
                            <i class="fa-brands fa-whatsapp text-sm"></i><span>WhatsApp</span>
                        </button>
                        <button onclick="window.sendMemoDueSMS('${txn.id}', '${escapeHTML(cleanCustName)}', '${escapeHTML(txn.customerPhone || '')}', ${currentDue}, '${escapeHTML(txn.voucherNo || '')}')" class="h-9 px-3 rounded-xl bg-cyan-600/20 hover:bg-cyan-600 text-cyan-300 hover:text-white font-bold text-xs flex items-center gap-1.5 border border-cyan-500/30 active:scale-95 transition-all cursor-pointer" title="এসএমএস তাগাদা পাঠান">
                            <i class="fa-solid fa-comment-sms"></i><span>SMS</span>
                        </button>
                        <button onclick="window.copyDigitalMemoLink('${txn.id}')" class="h-9 w-9 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white flex items-center justify-center border border-slate-700 active:scale-95 transition-all cursor-pointer" title="মেমো লিংক কপি করুন">
                            <i class="fa-solid fa-link text-xs"></i>
                        </button>
                    </div>
                </div>

                <!-- Customer Profile Card + QR Grid -->
                <div class="relative z-10 grid grid-cols-1 md:grid-cols-4 gap-4 mb-5">
                    <div class="md:col-span-3 bg-slate-950/70 border border-slate-800 rounded-2xl p-4.5 space-y-3">
                        <div class="flex items-center justify-between border-b border-slate-800 pb-2">
                            <div class="text-[11px] font-black uppercase text-cyan-400 tracking-wider flex items-center gap-1.5">
                                <i class="fa-solid fa-id-card"></i> <span>কাস্টমার প্রোফাইল</span>
                            </div>
                            <button onclick="window.openCustomerLedgerDrawer('${txn.customerId}')" class="text-[11px] text-purple-400 hover:text-purple-300 font-black hover:underline cursor-pointer flex items-center gap-1">
                                <i class="fa-solid fa-arrow-up-right-from-square text-[9px]"></i> সব লেনদেন হিস্ট্রি
                            </button>
                        </div>
                        <div class="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                            <div>
                                <div class="text-slate-500 font-bold">নাম:</div>
                                <div class="text-base font-black text-white truncate">${escapeHTML(cleanCustName)}</div>
                            </div>
                            <div>
                                <div class="text-slate-500 font-bold">অ্যাকাউন্ট নং:</div>
                                <div class="text-sm font-mono font-bold text-blue-400">${escapeHTML(txn.customerAccountNo || '-')}</div>
                            </div>
                            <div>
                                <div class="text-slate-500 font-bold">মোবাইল:</div>
                                <div class="flex items-center gap-2 text-sm font-bold text-slate-200">
                                    <span>${escapeHTML(txn.customerPhone || 'মোবাইল নেই')}</span>
                                    ${txn.customerPhone ? `
                                        <a href="tel:${txn.customerPhone}" class="text-emerald-400 hover:text-emerald-300" title="সরাসরি কল দিন"><i class="fa-solid fa-phone text-xs"></i></a>
                                        <a href="https://wa.me/88${txn.customerPhone.replace(/[^0-9]/g,'')}" target="_blank" class="text-emerald-400 hover:text-emerald-300" title="WhatsApp চ্যাট"><i class="fa-brands fa-whatsapp text-sm"></i></a>
                                    ` : ''}
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Dynamic QR Code -->
                    <div class="bg-slate-950/70 border border-slate-800 rounded-2xl p-3 flex flex-col items-center justify-center text-center">
                        <img src="${qrCodeSrc}" alt="Memo QR" class="w-18 h-18 rounded-lg bg-white p-1 border border-slate-700 shadow-md">
                        <span class="text-[9px] font-bold text-slate-400 mt-1.5 flex items-center gap-1"><i class="fa-solid fa-qrcode text-cyan-400"></i> স্ক্যান করে মেমো দেখুন</span>
                    </div>
                </div>

                ${itemsTableHtml}

                <!-- Accounting Equation & Bengali Words -->
                <div class="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-4 items-start mb-4">
                    <div class="space-y-3">
                        <div class="bg-slate-950/50 border border-slate-800 rounded-2xl p-4">
                            <div class="text-[11px] font-black text-amber-400 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                                <i class="fa-solid fa-note-sticky"></i> <span>নোট / রিমার্কস</span>
                            </div>
                            <p class="text-xs text-slate-300 leading-relaxed font-medium">
                                ${txn.notes ? escapeHTML(txn.notes).replace(/\n/g, '<br/>') : 'কোনো বিশেষ মন্তব্য বা শর্তাবলী নেই।'}
                            </p>
                        </div>

                        ${billWords || dueWords ? `
                            <div class="bg-amber-500/10 border border-amber-500/20 rounded-2xl p-3 text-xs text-amber-300 font-bold space-y-1">
                                ${billWords ? `<div><i class="fa-solid fa-coins text-[10px] text-amber-400 mr-1.5"></i>আজকের বিল কথায়: <span class="text-white">${billWords}</span></div>` : ''}
                                ${dueWords ? `<div><i class="fa-solid fa-wallet text-[10px] text-amber-400 mr-1.5"></i>মোট বকেয়া কথায়: <span class="text-white">${dueWords}</span></div>` : ''}
                            </div>
                        ` : ''}
                    </div>

                    <div class="bg-slate-950/80 border border-slate-800 rounded-2xl p-4.5 space-y-2 text-xs">
                        <div class="text-[11px] font-black text-slate-400 uppercase tracking-wider border-b border-slate-800 pb-1.5 mb-2">
                            হিসাবের বিবরণী (Accounting Summary)
                        </div>
                        <div class="flex justify-between text-slate-300">
                            <span>পূর্বের বকেয়া:</span>
                            <span class="font-mono font-bold">৳ ${formatAmountWithComma(prevDue)}</span>
                        </div>
                        <div class="flex justify-between text-red-400 font-bold">
                            <span>আজকের বিল (Debit):</span>
                            <span class="font-mono font-black">৳ ${formatAmountWithComma(bill)}</span>
                        </div>
                        <div class="flex justify-between text-emerald-400 font-bold items-center">
                            <span>আজকের জমা (Credit):${paymentMethodHtml}</span>
                            <span class="font-mono font-black">- ৳ ${formatAmountWithComma(paid)}</span>
                        </div>
                        <div class="pt-2.5 border-t border-slate-800 flex justify-between items-center text-sm font-black ${currentDue > 0 ? 'text-red-400' : 'text-emerald-400'}">
                            <span>বর্তমান মোট বকেয়া:</span>
                            <span class="font-mono text-base bg-slate-900 px-3.5 py-1.5 rounded-xl border border-slate-800 shadow-inner">
                                ৳ ${formatAmountWithComma(Math.abs(currentDue))} ${currentDue < 0 ? '(অ্যাডভান্স)' : ''}
                            </span>
                        </div>
                    </div>
                </div>

                <!-- In-Card Recent Ledger History Table -->
                ${renderInCardLedgerHistory(txn.customerId, cleanCustName, txn.customerAccountNo, lifetimeStats)}
            </div>
        </div>
    `;
}

// Global Copy Link Helper
window.copyDigitalMemoLink = function(txnId) {
    const url = `${window.location.origin}${window.location.pathname}?view=public-memo&id=${txnId}`;
    navigator.clipboard.writeText(url);
    showToast('ডিজিটাল মেমোর সরাসরি লিংক কপি করা হয়েছে!', 'success');
};

import { escapeHTML, formatAmountWithComma, formatAppDate, numberToBanglaWords } from '../utils.js';
import { renderInCardLedgerHistory } from './memo-history-table.js';
import { renderMemoItemsTable, renderCustomerAllMemosBar } from './memo-items-table.js';
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

    const publicUrl = `${window.location.origin}${window.location.pathname}?view=public-memo&id=${txn.id}`;
    const qrCodeSrc = `https://api.qrserver.com/v1/create-qr-code/?size=120x120&margin=2&data=${encodeURIComponent(publicUrl)}`;

    const billWords = bill > 0 ? numberToBanglaWords(bill) : '';
    const dueWords = currentDue !== 0 ? numberToBanglaWords(Math.abs(currentDue)) : '';

    const addressStr = txn.customerAddress || txn.address || '';
    const zoneStr = txn.customerZone || txn.zone || '';
    const fullAddress = (zoneStr ? `[${zoneStr}] ` : '') + (addressStr || '');

    return `
        <div class="space-y-3.5 font-bn">
            <!-- Above-the-Fold Zero-Scroll Hero Voucher Card -->
            <div class="relative overflow-hidden bg-slate-900/90 border border-slate-700/80 rounded-2xl p-4 sm:p-5 shadow-2xl backdrop-blur-2xl animate-fade-in">
                <!-- Watermark Stamp -->
                <div class="absolute right-4 top-2 pointer-events-none select-none opacity-5 sm:opacity-10 transform -rotate-12 border-2 sm:border-4 border-dashed rounded-xl px-4 py-0.5 text-center text-2xl sm:text-4xl font-black font-sans uppercase tracking-widest z-0" style="color: ${watermarkColor}; border-color: ${watermarkColor};">
                    ${watermarkText}
                </div>

                <!-- Top Header Bar with Integrated Steppers -->
                <div class="relative z-10 flex flex-wrap items-center justify-between gap-3 border-b border-slate-800/80 pb-3 mb-3.5">
                    <div class="flex items-center gap-3">
                        <div class="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-600/30 to-blue-600/20 border border-cyan-500/40 flex items-center justify-center text-cyan-400 text-lg font-black shadow-md">
                            <i class="fa-solid fa-receipt"></i>
                        </div>
                        <div>
                            <div class="flex items-center gap-2 flex-wrap">
                                <span class="text-xl font-black text-white tracking-tight font-mono">#${escapeHTML(txn.voucherNo || txn.id.slice(-6).toUpperCase())}</span>
                                ${statusBadge}
                            </div>
                            <div class="flex items-center gap-2 text-xs text-slate-400 mt-0.5">
                                <span><i class="fa-regular fa-calendar text-cyan-400 mr-1"></i>${formatAppDate(txn.date)}</span>
                                <span>•</span>
                                <span><i class="fa-solid fa-user-pen text-slate-500 mr-1"></i>${escapeHTML(txn.createdBy || 'Staff')}</span>
                            </div>
                        </div>
                    </div>

                    <!-- Integrated Stepper Navigation Buttons -->
                    <div class="flex items-center gap-2 text-xs">
                        ${adjacent.prevMemo ? `
                            <button onclick="window.searchMemoDirectly('${escapeHTML(adjacent.prevMemo.voucherNo)}')" class="px-3 py-1.5 rounded-xl bg-slate-950/80 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800 hover:border-slate-700 shadow-sm transition-all flex items-center gap-1.5 active:scale-95 cursor-pointer text-xs" title="পূর্ববর্তী মেমো">
                                <i class="fa-solid fa-arrow-left text-[10px] text-cyan-400"></i>
                                <span class="hidden sm:inline">পূর্ববর্তী:</span> <strong class="font-mono text-cyan-300">#${escapeHTML(adjacent.prevMemo.voucherNo)}</strong>
                            </button>
                        ` : ''}
                        ${adjacent.nextMemo ? `
                            <button onclick="window.searchMemoDirectly('${escapeHTML(adjacent.nextMemo.voucherNo)}')" class="px-3 py-1.5 rounded-xl bg-slate-950/80 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800 hover:border-slate-700 shadow-sm transition-all flex items-center gap-1.5 active:scale-95 cursor-pointer text-xs" title="পরবর্তী মেমো">
                                <span class="hidden sm:inline">পরবর্তী:</span> <strong class="font-mono text-cyan-300">#${escapeHTML(adjacent.nextMemo.voucherNo)}</strong>
                                <i class="fa-solid fa-arrow-right text-[10px] text-cyan-400"></i>
                            </button>
                        ` : ''}
                    </div>
                </div>

                <!-- 2-Column Split Hero Grid (Above the Fold) -->
                <div class="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-3.5 items-stretch">
                    <!-- Left Column: Customer Profile & Action Hub (lg:col-span-7) -->
                    <div class="lg:col-span-7 flex flex-col justify-between space-y-2.5">
                        <!-- Customer Profile Box -->
                        <div class="bg-slate-950/70 border border-slate-800 rounded-xl p-3 space-y-2">
                            <div class="flex items-center justify-between border-b border-slate-800/80 pb-1.5">
                                <div class="text-[10px] font-black uppercase text-cyan-400 tracking-wider flex items-center gap-1.5">
                                    <i class="fa-solid fa-id-card"></i> <span>কাস্টমার প্রোফাইল</span>
                                </div>
                                <button onclick="window.openCustomerLedgerDrawer('${txn.customerId}', '${escapeHTML(cleanCustName)}', '${escapeHTML(txn.customerAccountNo || '')}')" class="text-[11px] text-purple-400 hover:text-purple-300 font-bold hover:underline cursor-pointer flex items-center gap-1">
                                    <i class="fa-solid fa-book-open text-[10px]"></i> সম্পূর্ণ খতিয়ান
                                </button>
                            </div>
                            <div class="grid grid-cols-1 sm:grid-cols-12 gap-2 text-xs">
                                <div class="sm:col-span-4">
                                    <div class="text-slate-500 font-bold text-[11px]">কাস্টমার নাম:</div>
                                    <div class="text-sm sm:text-base font-black text-white truncate" title="${escapeHTML(cleanCustName)}">${escapeHTML(cleanCustName)}</div>
                                </div>
                                <div class="sm:col-span-3">
                                    <div class="text-slate-500 font-bold text-[11px]">অ্যাকাউন্ট নং:</div>
                                    <div class="text-sm font-mono font-bold text-cyan-400">${escapeHTML(txn.customerAccountNo || '-')}</div>
                                </div>
                                <div class="sm:col-span-5">
                                    <div class="text-slate-500 font-bold text-[11px]">মোবাইল:</div>
                                    <div class="flex items-center gap-1.5 text-xs font-bold text-slate-200">
                                        <span class="font-mono">${escapeHTML(txn.customerPhone || 'মোবাইল নেই')}</span>
                                        ${txn.customerPhone ? `
                                            <a href="tel:${txn.customerPhone}" class="text-emerald-400 hover:text-emerald-300 ml-0.5" title="সরাসরি কল দিন"><i class="fa-solid fa-phone text-[11px]"></i></a>
                                            <a href="https://wa.me/88${txn.customerPhone.replace(/[^0-9]/g,'')}" target="_blank" class="text-emerald-400 hover:text-emerald-300" title="WhatsApp চ্যাট"><i class="fa-brands fa-whatsapp text-sm"></i></a>
                                        ` : ''}
                                    </div>
                                </div>
                                <div class="sm:col-span-12 pt-1.5 border-t border-slate-800/80 flex items-center gap-1.5 text-xs">
                                    <span class="text-slate-500 font-bold text-[11px] shrink-0">ঠিকানা ও জোন:</span>
                                    <span class="text-slate-300 font-medium truncate flex items-center gap-1" title="${escapeHTML(fullAddress || 'ঠিকানা নেই')}">
                                        <i class="fa-solid fa-location-dot text-[10px] text-slate-500"></i> ${escapeHTML(fullAddress || 'ঠিকানা নেই')}
                                    </span>
                                </div>
                            </div>
                        </div>

                        <!-- Compact Single-Line Action Toolbar -->
                        <div class="flex items-center gap-1.5 pt-0.5 overflow-x-auto custom-scrollbar no-scrollbar">
                            <button onclick="window.printMemoReceipt('${txn.id}', 'a4')" class="h-8 px-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-black text-[11px] flex items-center gap-1 shadow-sm shrink-0 active:scale-95 transition-all cursor-pointer" title="A4 সাইজ ইনভয়েস প্রিন্ট">
                                <i class="fa-solid fa-print"></i><span>A4 প্রিন্ট</span>
                            </button>
                            <button onclick="window.printMemoReceipt('${txn.id}', 'pos')" class="h-8 px-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-[11px] flex items-center gap-1 border border-slate-700 shrink-0 active:scale-95 transition-all cursor-pointer" title="৮০মিমি POS থার্মাল রসিদ">
                                <i class="fa-solid fa-receipt"></i><span>POS</span>
                            </button>
                            ${currentDue > 0 ? `
                                <button onclick="window.openMemoQuickPayModal('${txn.id}', '${escapeHTML(txn.voucherNo || '')}', '${txn.customerId}', ${currentDue})" class="h-8 px-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-[11px] flex items-center gap-1 shadow-sm shrink-0 active:scale-95 transition-all cursor-pointer" title="সরাসরি টাকা জমা নিন">
                                    <i class="fa-solid fa-hand-holding-dollar text-xs"></i><span>জমা নিন</span>
                                </button>
                            ` : ''}
                            <button onclick="window.openCustomerLedgerDrawer('${txn.customerId}', '${escapeHTML(cleanCustName)}', '${escapeHTML(txn.customerAccountNo || '')}')" class="h-8 px-2 rounded-xl bg-purple-600/20 hover:bg-purple-600 text-purple-300 hover:text-white font-bold text-[11px] flex items-center gap-1 border border-purple-500/30 shrink-0 active:scale-95 transition-all cursor-pointer" title="কাস্টমারের সম্পূর্ণ খতিয়ান">
                                <i class="fa-solid fa-book"></i><span>খতিয়ান</span>
                            </button>
                            <button onclick="window.openMemoEditModal('${txn.id}')" class="h-8 px-2 rounded-xl bg-amber-600/20 hover:bg-amber-600 text-amber-300 hover:text-white font-bold text-[11px] flex items-center gap-1 border border-amber-500/30 shrink-0 active:scale-95 transition-all cursor-pointer" title="মেমো এডিট">
                                <i class="fa-solid fa-pen-to-square"></i><span>এডিট</span>
                            </button>
                            <button onclick="window.shareMemoOnWhatsApp('${txn.id}')" class="h-8 px-2 rounded-xl bg-emerald-600/20 hover:bg-emerald-600 text-emerald-400 hover:text-white font-bold text-[11px] flex items-center gap-1 border border-emerald-500/30 shrink-0 active:scale-95 transition-all cursor-pointer" title="WhatsApp বার্তা">
                                <i class="fa-brands fa-whatsapp text-xs"></i><span>WhatsApp</span>
                            </button>
                            <button onclick="window.sendMemoDueSMS('${txn.id}', '${escapeHTML(cleanCustName)}', '${escapeHTML(txn.customerPhone || '')}', ${currentDue}, '${escapeHTML(txn.voucherNo || '')}')" class="h-8 px-2 rounded-xl bg-cyan-600/20 hover:bg-cyan-600 text-cyan-300 hover:text-white font-bold text-[11px] flex items-center gap-1 border border-cyan-500/30 shrink-0 active:scale-95 transition-all cursor-pointer" title="SMS পাঠান">
                                <i class="fa-solid fa-comment-sms"></i><span>SMS</span>
                            </button>
                            <button onclick="window.copyDigitalMemoLink('${txn.id}')" class="h-8 w-8 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white flex items-center justify-center border border-slate-700 shrink-0 active:scale-95 transition-all cursor-pointer" title="মেমো লিংক কপি">
                                <i class="fa-solid fa-link text-[10px]"></i>
                            </button>
                        </div>
                    </div>

                    <!-- Right Column: Instant Financial Breakdown Hub (lg:col-span-5) -->
                    <div class="lg:col-span-5 bg-slate-950/80 border border-slate-800 rounded-xl p-3 flex flex-col justify-between space-y-2 text-xs">
                        <!-- Hero Highlight: Current Total Net Due -->
                        <div class="flex items-center justify-between bg-slate-900/90 border border-slate-800 p-2.5 rounded-xl">
                            <div>
                                <div class="text-[10px] font-black text-slate-400 uppercase tracking-wider">বর্তমান মোট বকেয়া:</div>
                                <div class="text-base sm:text-lg font-black font-mono ${currentDue > 0 ? 'text-red-400' : 'text-emerald-400'}">
                                    ৳ ${formatAmountWithComma(Math.abs(currentDue))} ${currentDue < 0 ? '<span class="text-xs font-normal text-emerald-300">(অ্যাডভান্স)</span>' : ''}
                                </div>
                            </div>
                            <div class="text-right">
                                <span class="px-2 py-0.5 rounded-md text-[10px] font-black ${currentDue > 0 ? 'bg-red-500/10 text-red-400 border border-red-500/20' : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'}">
                                    ${currentDue > 0 ? 'বকেয়া আছে' : (currentDue < 0 ? 'অগ্রিম জমা' : 'পরিশোধিত')}
                                </span>
                            </div>
                        </div>

                        <!-- 3-Pill Financial Breakdown -->
                        <div class="space-y-1.5 font-medium">
                            <div class="flex justify-between items-center text-slate-300 px-1">
                                <span class="text-slate-400">পূর্বের বকেয়া:</span>
                                <span class="font-mono font-bold">৳ ${formatAmountWithComma(prevDue)}</span>
                            </div>
                            <div class="flex justify-between items-center text-red-400 font-bold px-1">
                                <span>আজকের বিল (Debit):</span>
                                <span class="font-mono font-black">৳ ${formatAmountWithComma(bill)}</span>
                            </div>
                            <div class="flex justify-between items-center text-emerald-400 font-bold px-1">
                                <span>আজকের জমা (Credit):${paymentMethodHtml}</span>
                                <span class="font-mono font-black">- ৳ ${formatAmountWithComma(paid)}</span>
                            </div>
                        </div>

                        <!-- Words Pill (if any) -->
                        ${dueWords || billWords ? `
                            <div class="pt-1.5 border-t border-slate-800/80 text-[11px] text-amber-300/90 font-medium truncate" title="${dueWords ? 'বকেয়া: ' + dueWords : 'বিল: ' + billWords}">
                                <i class="fa-solid fa-coins text-[10px] text-amber-400 mr-1"></i>
                                <span>কথায়: ${dueWords || billWords}</span>
                            </div>
                        ` : ''}
                    </div>
                </div>
            </div>

            <!-- Customer All Memos Navigator Bar -->
            ${renderCustomerAllMemosBar(txn.voucherNo, lifetimeStats)}

            <!-- Below-The-Fold Secondary Sections (Scrollable) -->
            ${renderMemoItemsTable(txn)}

            <!-- Notes & QR Code Grid -->
            <div class="grid grid-cols-1 md:grid-cols-4 gap-3 items-stretch">
                <div class="md:col-span-3 bg-slate-950/50 border border-slate-800 rounded-xl p-3 space-y-1">
                    <div class="text-[10px] font-black text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
                        <i class="fa-solid fa-note-sticky"></i> <span>নোট / রিমার্কস</span>
                    </div>
                    <p class="text-xs text-slate-300 leading-relaxed font-medium">
                        ${txn.notes ? escapeHTML(txn.notes).replace(/\n/g, '<br/>') : 'কোনো বিশেষ মন্তব্য বা শর্তাবলী নেই।'}
                    </p>
                </div>

                <div class="bg-slate-950/60 border border-slate-800 rounded-xl p-2.5 flex items-center justify-between md:flex-col md:justify-center text-center gap-2">
                    <img src="${qrCodeSrc}" alt="Memo QR" class="w-12 h-12 rounded-lg bg-white p-1 border border-slate-700 shadow-md">
                    <div class="text-left md:text-center">
                        <div class="text-[9px] font-bold text-slate-400 flex items-center gap-1"><i class="fa-solid fa-qrcode text-cyan-400"></i> ডিজিটাল মেমো QR</div>
                        <button onclick="window.copyDigitalMemoLink('${txn.id}')" class="text-[10px] text-cyan-400 hover:text-cyan-300 font-bold hover:underline cursor-pointer">লিংক কপি করুন</button>
                    </div>
                </div>
            </div>

            <!-- In-Card Recent Ledger History Table -->
            ${renderInCardLedgerHistory(txn.customerId, cleanCustName, txn.customerAccountNo, lifetimeStats)}
        </div>
    `;
}

// Global Copy Link Helper
window.copyDigitalMemoLink = function(txnId) {
    const url = `${window.location.origin}${window.location.pathname}?view=public-memo&id=${txnId}`;
    navigator.clipboard.writeText(url);
    showToast('ডিজিটাল মেমোর সরাসরি লিংক কপি করা হয়েছে!', 'success');
};

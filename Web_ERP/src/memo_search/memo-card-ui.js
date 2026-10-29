// ALLOW_LARGE_FILE: Memo Card Ultra-Premium Complete View
import { escapeHTML, formatAmountWithComma, formatAppDate, numberToBanglaWords, safeRound } from '../utils.js';
import { renderInCardLedgerHistory } from './memo-history-table.js';
import { renderMemoItemsTable, renderCustomerAllMemosBar } from './memo-items-table.js';
import './memo-actions-bridge.js';
import './memo-ledger-drawer.js';
import './memo-quick-pay.js';
import './memo-quick-less.js';
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

    const isLessMemo = txn.receivedType === 'Less' || (paid > 0 && bill === 0 && txn.refMemoNo);
    const memoAmount = isLessMemo ? paid : (bill > 0 ? bill : (paid > 0 ? paid : 0));
    const memoAmountWords = memoAmount > 0 ? numberToBanglaWords(memoAmount) : '';

    const liveCustomerDue = Number(txn.customerTotalDue !== undefined ? txn.customerTotalDue : currentDue);
    const liveDueWords = liveCustomerDue !== 0 ? numberToBanglaWords(Math.abs(liveCustomerDue)) : '';

    // Watermark Stamp & Status Badge
    let watermarkText = 'DUE';
    let watermarkColor = '#dc2626';
    let statusBadge = '';

    if (isLessMemo) {
        watermarkText = 'LESS';
        watermarkColor = '#a855f7';
        statusBadge = '<span class="px-2.5 py-1 rounded-full text-xs font-black bg-purple-500/10 text-purple-400 border border-purple-500/20"><i class="fa-solid fa-tags mr-1"></i>ছাড় / মাল ফেরত (LESS)</span>';
    } else if (bill > 0 && paid >= bill) {
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

                    <!-- Integrated Stepper Navigation Buttons with Keyboard Indicators -->
                    <div class="flex items-center gap-2 text-xs">
                        ${adjacent.prevMemo ? `
                            <button onclick="window.searchMemoDirectly('${escapeHTML(adjacent.prevMemo.voucherNo)}')" 
                                class="px-3 py-1.5 rounded-xl bg-slate-950 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800 hover:border-cyan-500/50 shadow-sm transition-all flex items-center gap-1.5 active:scale-95 cursor-pointer text-xs group" 
                                title="পূর্ববর্তী মেমো (কিবোর্ড: ← Left Arrow)">
                                <i class="fa-solid fa-arrow-left text-[10px] text-cyan-400 group-hover:-translate-x-0.5 transition-transform"></i>
                                <span class="hidden sm:inline">পূর্ববর্তী:</span> 
                                <strong class="font-mono text-cyan-300">#${escapeHTML(adjacent.prevMemo.voucherNo)}</strong>
                                <span class="text-[9px] font-mono text-slate-400 bg-slate-900 px-1 py-0.5 rounded border border-slate-800">←</span>
                            </button>
                        ` : ''}
                        ${adjacent.nextMemo ? `
                            <button onclick="window.searchMemoDirectly('${escapeHTML(adjacent.nextMemo.voucherNo)}')" 
                                class="px-3 py-1.5 rounded-xl bg-slate-950 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800 hover:border-cyan-500/50 shadow-sm transition-all flex items-center gap-1.5 active:scale-95 cursor-pointer text-xs group" 
                                title="পরবর্তী মেমো (কিবোর্ড: → Right Arrow)">
                                <span class="text-[9px] font-mono text-slate-400 bg-slate-900 px-1 py-0.5 rounded border border-slate-800">→</span>
                                <span class="hidden sm:inline">পরবর্তী:</span> 
                                <strong class="font-mono text-cyan-300">#${escapeHTML(adjacent.nextMemo.voucherNo)}</strong>
                                <i class="fa-solid fa-arrow-right text-[10px] text-cyan-400 group-hover:translate-x-0.5 transition-transform"></i>
                            </button>
                        ` : ''}
                    </div>
                </div>

                ${(txn.refMemoNo && (txn.receivedType === 'Less' || (paid > 0 && bill === 0))) ? `
                    <div class="relative z-10 p-2.5 mb-3 rounded-xl bg-purple-950/40 border border-purple-500/30 flex items-center justify-between text-xs font-bn text-purple-200">
                        <div class="flex items-center gap-2">
                            <i class="fa-solid fa-link text-purple-400"></i>
                            <span>এই এন্ট্রিটি মূল মেমো <strong>#${escapeHTML(txn.refMemoNo)}</strong> এর বিপরীতে ছাড় / মাল ফেরত সমন্বয়।</span>
                        </div>
                        <button onclick="window.searchMemoDirectly('${escapeHTML(txn.refMemoNo)}')" class="px-2.5 py-1 rounded-lg bg-purple-600 hover:bg-purple-500 text-white font-bold text-[11px] flex items-center gap-1 cursor-pointer">
                            <i class="fa-solid fa-arrow-up-right-from-square text-[10px]"></i> মূল মেমো দেখুন
                        </button>
                    </div>
                ` : ''}

                <!-- TOP HERO SPOTLIGHT: Searched Memo Amount (BIGGEST!) & Live Customer Due -->
                <div class="relative z-10 grid grid-cols-1 md:grid-cols-12 gap-3.5 items-stretch mb-3.5">
                    <!-- Giant Memo Amount Hero Spotlight -->
                    <div class="md:col-span-7 bg-gradient-to-br from-slate-950 via-slate-900 to-cyan-950/40 border border-cyan-500/40 rounded-2xl p-4 sm:p-5 shadow-lg flex flex-col justify-between relative overflow-hidden group">
                        <div class="absolute -right-6 -bottom-6 text-cyan-500/5 group-hover:text-cyan-500/10 text-8xl pointer-events-none transition-all">
                            <i class="fa-solid fa-file-invoice-dollar"></i>
                        </div>

                        <div>
                            <div class="flex items-center justify-between mb-1.5 flex-wrap gap-2">
                                <div class="text-[11px] font-black uppercase text-cyan-400 tracking-wider flex items-center gap-1.5">
                                    <i class="fa-solid fa-coins text-cyan-400"></i>
                                    <span>${isLessMemo ? 'মেমোর সমন্বিত ছাড় (DISCOUNT)' : 'মেমোর মোট টাকার পরিমাণ (MEMO AMOUNT)'}</span>
                                </div>
                                <span class="text-[10px] font-black px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 font-mono">
                                    ভাউচার #${escapeHTML(txn.voucherNo || '')}
                                </span>
                            </div>

                            <!-- THE GIANT MEMO AMOUNT -->
                            <div class="flex items-baseline gap-2 text-white">
                                <span class="text-2xl sm:text-3xl md:text-4xl font-black text-cyan-400 font-mono">৳</span>
                                <span class="text-3xl sm:text-4xl md:text-5xl font-black font-mono tracking-tight text-white drop-shadow-[0_2px_14px_rgba(6,182,212,0.4)]">
                                    ${formatAmountWithComma(memoAmount)}
                                </span>
                                ${isLessMemo ? '<span class="text-xs font-bold text-purple-300 font-bn">(লেস সমন্বয়)</span>' : ''}
                            </div>

                            ${txn.totalLinkedLess > 0 ? `
                                <div class="text-[11px] text-purple-300 font-medium mt-1.5 flex items-center gap-2 flex-wrap bg-purple-950/30 p-1.5 rounded-lg border border-purple-500/20">
                                    <span>মূল বিল: ৳ ${formatAmountWithComma(bill)}</span>
                                    <span>•</span>
                                    <span>সমন্বিত ছাড়: -৳ ${formatAmountWithComma(txn.totalLinkedLess)}</span>
                                    <span>•</span>
                                    <span class="font-bold text-cyan-300">নিট বিক্রয়: ৳ ${formatAmountWithComma(safeRound(bill - txn.totalLinkedLess))}</span>
                                </div>
                            ` : ''}
                        </div>

                        <!-- Bangla Words Pill -->
                        <div class="pt-2 mt-2 border-t border-slate-800/80 text-[11px] text-amber-300/95 font-medium flex items-center gap-1.5 truncate">
                            <i class="fa-solid fa-spell-check text-[10px] text-amber-400 shrink-0"></i>
                            <span class="truncate">কথায়: <strong>${memoAmountWords || 'শূন্য টাকা মাত্র'}</strong></span>
                        </div>
                    </div>

                    <!-- Customer's Current Live Net Due (বর্তমান লাইভ মোট বকেয়া) -->
                    <div class="md:col-span-5 bg-slate-950/90 border ${liveCustomerDue > 0 ? 'border-red-500/40 shadow-red-950/20' : 'border-emerald-500/40 shadow-emerald-950/20'} rounded-2xl p-4 sm:p-5 shadow-lg flex flex-col justify-between">
                        <div>
                            <div class="flex items-center justify-between mb-1.5">
                                <div class="text-[11px] font-black uppercase text-slate-400 tracking-wider flex items-center gap-1.5">
                                    <span class="relative flex h-2 w-2">
                                        <span class="animate-ping absolute inline-flex h-full w-full rounded-full ${liveCustomerDue > 0 ? 'bg-red-400' : 'bg-emerald-400'} opacity-75"></span>
                                        <span class="relative inline-flex rounded-full h-2 w-2 ${liveCustomerDue > 0 ? 'bg-red-500' : 'bg-emerald-500'}"></span>
                                    </span>
                                    <span class="text-slate-300">কাস্টমারের বর্তমান লাইভ বকেয়া</span>
                                </div>
                                <span class="px-2 py-0.5 rounded text-[10px] font-black ${liveCustomerDue > 0 ? 'bg-red-500/10 text-red-400 border border-red-500/20' : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'}">
                                    ${liveCustomerDue > 0 ? 'বকেয়া আছে' : (liveCustomerDue < 0 ? 'অগ্রিম জমা' : 'পরিশোধিত')}
                                </span>
                            </div>

                            <!-- Live Balance Figure -->
                            <div class="text-2xl sm:text-3xl font-black font-mono ${liveCustomerDue > 0 ? 'text-red-400' : 'text-emerald-400'} tracking-tight mt-1">
                                ৳ ${formatAmountWithComma(Math.abs(liveCustomerDue))} ${liveCustomerDue < 0 ? '<span class="text-xs font-bold text-emerald-300">(অগ্রিম)</span>' : ''}
                            </div>

                            <div class="text-[11px] text-slate-400 mt-1 flex items-center gap-1.5">
                                <i class="fa-solid fa-clock-rotate-left text-[10px] text-slate-500"></i>
                                <span>আজকের রিয়েল-টাইম নিট স্থিতি (খতিয়ান সিঙ্ক)</span>
                            </div>
                        </div>

                        ${liveDueWords ? `
                            <div class="pt-2 mt-2 border-t border-slate-800/80 text-[10px] text-slate-400 truncate">
                                <span>বকেয়া কথায়: ${liveDueWords}</span>
                            </div>
                        ` : ''}
                    </div>
                </div>

                <!-- 2-Column Split: Customer Profile & Action Hub (Left) + Memo Snapshot Equation (Right) -->
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
                                    <div class="text-base sm:text-lg font-black text-white truncate" title="${escapeHTML(cleanCustName)}">${escapeHTML(cleanCustName)}</div>
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
                            ${txn.memoPhotoUrl ? `
                                <button onclick="window.viewMemoPhoto('${txn.id}')" class="h-8 px-2.5 rounded-xl bg-amber-500/20 hover:bg-amber-500 text-amber-300 hover:text-white font-bold text-[11px] flex items-center gap-1 border border-amber-500/30 shrink-0 active:scale-95 transition-all cursor-pointer" title="আসল স্ক্যান মেমোর ছবি দেখুন">
                                    <i class="fa-solid fa-file-invoice text-amber-400"></i><span>স্ক্যান মেমো</span>
                                </button>
                            ` : `
                                <button onclick="window.promptAttachMemo('${txn.id}', '${escapeHTML(txn.voucherNo || '')}', '${escapeHTML(cleanCustName)}')" class="h-8 px-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-[11px] flex items-center gap-1 border border-slate-700 shrink-0 active:scale-95 transition-all cursor-pointer" title="স্ক্যান মেমো যুক্ত করুন">
                                    <i class="fa-solid fa-paperclip text-slate-400"></i><span>মেমো যুক্ত</span>
                                </button>
                            `}
                            <button onclick="window.printMemoReceipt('${txn.id}', 'a4')" class="h-8 px-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-black text-[11px] flex items-center gap-1 shadow-sm shrink-0 active:scale-95 transition-all cursor-pointer" title="A4 সাইজ ইনভয়েস প্রিন্ট">
                                <i class="fa-solid fa-print"></i><span>A4 প্রিন্ট</span>
                            </button>
                            <button onclick="window.printMemoReceipt('${txn.id}', 'pos')" class="h-8 px-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-[11px] flex items-center gap-1 border border-slate-700 shrink-0 active:scale-95 transition-all cursor-pointer" title="৮০মিমি POS থার্মাল রসিদ">
                                <i class="fa-solid fa-receipt"></i><span>POS</span>
                            </button>
                            ${liveCustomerDue > 0 ? `
                                <button onclick="window.openMemoQuickPayModal('${txn.id}', '${escapeHTML(txn.voucherNo || '')}', '${txn.customerId}', ${liveCustomerDue})" class="h-8 px-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-[11px] flex items-center gap-1 shadow-sm shrink-0 active:scale-95 transition-all cursor-pointer" title="সরাসরি টাকা জমা নিন">
                                    <i class="fa-solid fa-hand-holding-dollar text-xs"></i><span>জমা নিন</span>
                                </button>
                            ` : ''}
                            <button onclick="window.openMemoQuickLessModal('${txn.id}', '${escapeHTML(txn.voucherNo || '')}', '${txn.customerId}', '${escapeHTML(cleanCustName)}', ${bill})" class="h-8 px-2.5 rounded-xl bg-purple-600/20 hover:bg-purple-600 text-purple-300 hover:text-white font-bold text-[11px] flex items-center gap-1 border border-purple-500/30 shrink-0 active:scale-95 transition-all cursor-pointer" title="মেমোর বিপরীতে পরবর্তী ছাড় বা মাল ফেরত এন্ট্রি দিন">
                                <i class="fa-solid fa-tags text-xs text-purple-400"></i><span>লেস/ফেরত</span>
                            </button>
                            <button onclick="window.openCustomerLedgerDrawer('${txn.customerId}', '${escapeHTML(cleanCustName)}', '${escapeHTML(txn.customerAccountNo || '')}')" class="h-8 px-2 rounded-xl bg-purple-600/20 hover:bg-purple-600 text-purple-300 hover:text-white font-bold text-[11px] flex items-center gap-1 border border-purple-500/30 shrink-0 active:scale-95 transition-all cursor-pointer" title="কাস্টমারের সম্পূর্ণ খতিয়ান">
                                <i class="fa-solid fa-book"></i><span>খতিয়ান</span>
                            </button>
                            <button onclick="window.openMemoEditModal('${txn.id}')" class="h-8 px-2 rounded-xl bg-amber-600/20 hover:bg-amber-600 text-amber-300 hover:text-white font-bold text-[11px] flex items-center gap-1 border border-amber-500/30 shrink-0 active:scale-95 transition-all cursor-pointer" title="মেমো এডিট">
                                <i class="fa-solid fa-pen-to-square"></i><span>এডিট</span>
                            </button>
                            <button onclick="window.shareMemoOnWhatsApp('${txn.id}')" class="h-8 px-2 rounded-xl bg-emerald-600/20 hover:bg-emerald-600 text-emerald-400 hover:text-white font-bold text-[11px] flex items-center gap-1 border border-emerald-500/30 shrink-0 active:scale-95 transition-all cursor-pointer" title="WhatsApp বার্তা">
                                <i class="fa-brands fa-whatsapp text-xs"></i><span>WhatsApp</span>
                            </button>
                            <button onclick="window.sendMemoDueSMS('${txn.id}', '${escapeHTML(cleanCustName)}', '${escapeHTML(txn.customerPhone || '')}', ${liveCustomerDue}, '${escapeHTML(txn.voucherNo || '')}')" class="h-8 px-2 rounded-xl bg-cyan-600/20 hover:bg-cyan-600 text-cyan-300 hover:text-white font-bold text-[11px] flex items-center gap-1 border border-cyan-500/30 shrink-0 active:scale-95 transition-all cursor-pointer" title="SMS পাঠান">
                                <i class="fa-solid fa-comment-sms"></i><span>SMS</span>
                            </button>
                            <button onclick="window.copyDigitalMemoLink('${txn.id}')" class="h-8 w-8 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white flex items-center justify-center border border-slate-700 shrink-0 active:scale-95 transition-all cursor-pointer" title="মেমো লিংক কপি">
                                <i class="fa-solid fa-link text-[10px]"></i>
                            </button>
                        </div>
                    </div>

                    <!-- Right Column: Memo Snapshot Financial Equation Hub (lg:col-span-5) -->
                    <div class="lg:col-span-5 bg-slate-950/80 border border-slate-800 rounded-xl p-3 flex flex-col justify-between space-y-2 text-xs">
                        <!-- Memo Equation Header -->
                        <div class="flex items-center justify-between border-b border-slate-800/80 pb-1.5">
                            <span class="text-[10px] font-black uppercase text-slate-400 tracking-wider flex items-center gap-1.5">
                                <i class="fa-solid fa-calculator text-cyan-400"></i>
                                <span>মেমোর হিসাব সমীকরণ</span>
                            </span>
                            <span class="text-[10px] font-mono text-slate-500">${formatAppDate(txn.date)}</span>
                        </div>

                        <!-- 4-Pill Historical Balance Breakdown -->
                        <div class="space-y-1.5 font-medium">
                            <div class="flex justify-between items-center text-slate-300 px-1">
                                <span class="text-slate-400">পূর্বের বকেয়া:</span>
                                <span class="font-mono font-bold">৳ ${formatAmountWithComma(prevDue)}</span>
                            </div>
                            <div class="flex justify-between items-center text-red-400 font-bold px-1">
                                <span>আজকের বিল (Debit):</span>
                                <span class="font-mono font-black">+ ৳ ${formatAmountWithComma(bill)}</span>
                            </div>
                            <div class="flex justify-between items-center text-emerald-400 font-bold px-1">
                                <span>আজকের জমা (Credit):${paymentMethodHtml}</span>
                                <span class="font-mono font-black">- ৳ ${formatAmountWithComma(paid)}</span>
                            </div>
                            <div class="flex justify-between items-center text-slate-200 font-bold px-1 pt-1.5 border-t border-slate-800">
                                <span class="text-slate-400">মেমো শেষে তৎকালীন বকেয়া:</span>
                                <span class="font-mono font-black ${currentDue > 0 ? 'text-red-400' : 'text-emerald-400'}">
                                    ৳ ${formatAmountWithComma(Math.abs(currentDue))} ${currentDue < 0 ? '(অগ্রিম)' : ''}
                                </span>
                            </div>
                        </div>

                        <div class="pt-1.5 border-t border-slate-800/80 text-[10px] text-slate-500 flex items-center justify-between">
                            <span>লেনদেন আইডি: <span class="font-mono">${escapeHTML(txn.id.slice(-8).toUpperCase())}</span></span>
                            <span class="text-emerald-400 font-bold"><i class="fa-solid fa-check-double text-[9px] mr-1"></i>সমীকরণ ভেরিফাইড</span>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Customer All Memos Navigator Bar -->
            ${renderCustomerAllMemosBar(txn.voucherNo, lifetimeStats)}

            <!-- Linked Later-Date Less / Return Adjustments List -->
            ${(txn.linkedLessList && txn.linkedLessList.length > 0) ? `
                <div class="bg-purple-950/20 border border-purple-500/30 rounded-2xl p-3.5 space-y-2.5">
                    <div class="flex items-center justify-between border-b border-purple-500/20 pb-2">
                        <div class="text-xs font-black uppercase text-purple-300 tracking-wider flex items-center gap-1.5">
                            <i class="fa-solid fa-tags text-purple-400"></i>
                            <span>এই মেমোর বিপরীতে পরবর্তী সমন্বিত ছাড় / মাল ফেরত (${txn.linkedLessList.length}টি)</span>
                        </div>
                        <span class="text-xs font-mono font-black text-purple-300 bg-purple-500/20 border border-purple-500/30 px-2 py-0.5 rounded-lg">
                            মোট ছাড়: -৳ ${formatAmountWithComma(txn.totalLinkedLess)}
                        </span>
                    </div>
                    <div class="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                        ${txn.linkedLessList.map(item => `
                            <div class="flex items-center justify-between p-2.5 bg-slate-950/70 border border-purple-500/20 rounded-xl">
                                <div class="space-y-0.5">
                                    <div class="flex items-center gap-1.5 text-purple-300 font-bold">
                                        <i class="fa-regular fa-calendar text-[10px]"></i>
                                        <span>${formatAppDate(item.date)}</span>
                                        ${item.voucherNo ? `<span class="text-[10px] text-slate-500 font-mono">(${escapeHTML(item.voucherNo)})</span>` : ''}
                                    </div>
                                    <div class="text-[11px] text-slate-300 font-medium truncate max-w-[180px]" title="${escapeHTML(item.receivedFrom || item.notes || '')}">
                                        ${escapeHTML(item.receivedFrom || item.notes || 'ছাড় / মাল ফেরত')}
                                    </div>
                                </div>
                                <div class="text-right">
                                    <div class="text-xs font-mono font-black text-purple-400">
                                        - ৳ ${formatAmountWithComma(item.paid)}
                                    </div>
                                    <div class="text-[9px] text-slate-400">খতিয়ানে বাদ গেছে</div>
                                </div>
                            </div>
                        `).join('')}
                    </div>
                </div>
            ` : ''}

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

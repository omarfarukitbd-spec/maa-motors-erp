import { formatAmountWithComma, formatAppDate } from '../utils.js';

/**
 * [BANK-SYNC-UI] Master Treasury Bank Sync UI Components
 * Pure UI Template builder with Zero Raw Emojis (Strict Rule 5)
 */

export function buildRowsHTML(items, syncedBankTxnIds, activeFilterMode, selectedDateStr, pendingCount) {
    if (!items || items.length === 0) {
        let emptyTitle = 'কোনো ব্যাংকিং লেনদেন পাওয়া যায়নি';
        let emptySubtext = 'তারিখ পরিবর্তন করে বা ফিল্টার পরিবর্তন করে পেছনের লেনদেন দেখতে পারেন।';
        let actionBtnHTML = '';

        if (activeFilterMode === 'date') {
            emptyTitle = `এই তারিখে (${selectedDateStr ? formatAppDate(selectedDateStr) : ''}) কোনো ব্যাংকিং লেনদেন নেই`;
            emptySubtext = 'আজকে ব্যাংকিং লেজারে নতুন কোনো জমা বা উত্তোলন এন্ট্রি করা হয়নি। পেছনের তারিখ নির্বাচন করে বা বিগত দিনের বাকি লেনদেন দেখতে পারেন।';
            if (pendingCount > 0) {
                actionBtnHTML = `
                    <div class="mt-3">
                        <button type="button" id="tr-sync-empty-goto-pending" class="px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-xl shadow transition-all inline-flex items-center gap-1.5 cursor-pointer whitespace-nowrap">
                            <i class="fa-solid fa-bolt text-amber-300"></i>
                            <span>বিগত দিনের বাকি থাকা লেনদেন দেখুন (${pendingCount} টি)</span>
                        </button>
                    </div>
                `;
            }
        }

        return `
            <tr>
                <td colspan="5" class="text-center py-10 px-4 text-slate-400 font-bn">
                    <i class="fa-solid fa-calendar-xmark text-3xl text-slate-600 mb-2"></i>
                    <div class="font-bold text-sm text-slate-300">${emptyTitle}</div>
                    <div class="text-xs text-slate-500 mt-1 max-w-md mx-auto">${emptySubtext}</div>
                    ${actionBtnHTML}
                </td>
            </tr>
        `;
    }

    return items.map((tx) => {
        const isSynced = syncedBankTxnIds.has(tx.id);
        const rawType = String(tx.type || '').toUpperCase();
        const isDeposit = rawType === 'DEPOSIT';
        const isTransfer = rawType === 'TRANSFER';
        const amount = Number(tx.amount || 0);
        const noteText = String(tx.note || '').trim();

        // Check for cash deposit warning
        const isCashDepositRisk = isDeposit && (
            noteText.includes('ক্যাশ') || 
            noteText.includes('cash') || 
            noteText.includes('শোরুম') ||
            noteText.includes('আদায়')
        );

        let typeBadge = '';
        if (isDeposit) {
            typeBadge = '<span class="px-2.5 py-0.5 rounded-lg text-[10px] font-black bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 whitespace-nowrap inline-flex items-center gap-1"><i class="fa-solid fa-arrow-down"></i>জমা (+ ইন)</span>';
        } else if (isTransfer) {
            typeBadge = `<span class="px-2.5 py-0.5 rounded-lg text-[10px] font-black bg-blue-500/20 text-blue-300 border border-blue-500/30 whitespace-nowrap inline-flex items-center gap-1"><i class="fa-solid fa-right-left"></i>ট্রান্সফার ➔ ${tx.targetBankName || 'অন্য ব্যাংক'}</span>`;
        } else {
            typeBadge = '<span class="px-2.5 py-0.5 rounded-lg text-[10px] font-black bg-red-500/20 text-red-400 border border-red-500/30 whitespace-nowrap inline-flex items-center gap-1"><i class="fa-solid fa-arrow-up"></i>উত্তোলন (- আউট)</span>';
        }

        let statusBadge = '';
        if (isSynced) {
            statusBadge = '<span class="px-2 py-0.5 rounded-lg text-[10px] font-bold bg-emerald-950/60 text-emerald-400 border border-emerald-500/40 whitespace-nowrap inline-flex items-center gap-1"><i class="fa-solid fa-circle-check"></i>যুক্ত আছে</span>';
        } else if (isCashDepositRisk) {
            statusBadge = '<span class="px-2 py-0.5 rounded-lg text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40 whitespace-nowrap inline-flex items-center gap-1" title="সতর্কতা: শোরুম ক্যাশ থেকে জমা হলে ট্রেজারিতে অলরেডি দৈনিক কালেকশনে থাকতে পারে!"><i class="fa-solid fa-triangle-exclamation"></i>ক্যাশ ডিপোজিট?</span>';
        }

        const isChecked = !isSynced;
        const disabledAttr = isSynced ? 'disabled' : '';
        const rowOpacity = isSynced ? 'opacity-60 bg-slate-900/40' : 'hover:bg-slate-800/40 transition-colors';

        return `
            <tr class="border-b border-slate-800/70 ${rowOpacity} font-bn" data-id="${tx.id}">
                <td class="py-2.5 px-3 text-center w-12 shrink-0">
                    <input 
                        type="checkbox" 
                        class="tr-sync-check w-4 h-4 rounded text-blue-600 bg-slate-800 border-slate-600 focus:ring-blue-500 focus:ring-1 cursor-pointer" 
                        data-id="${tx.id}" 
                        data-type="${rawType}"
                        data-amount="${amount}"
                        ${isChecked ? 'checked' : ''} 
                        ${disabledAttr}
                        onchange="window.updateTreasurySyncLiveCalc()"
                    />
                </td>
                <td class="py-2.5 px-3 whitespace-nowrap">
                    <div class="font-black text-xs text-white flex items-center gap-1.5">
                        <i class="fa-solid fa-building-columns text-blue-400 text-[11px] shrink-0"></i>
                        <span>${tx.bankName || 'অজানা ব্যাংক'}</span>
                    </div>
                    <div class="text-[10px] text-slate-400 font-mono mt-0.5 flex items-center gap-1">
                        <i class="fa-regular fa-clock text-[9px] text-slate-500"></i>
                        <span>${formatAppDate(tx.date)}</span>
                    </div>
                </td>
                <td class="py-2.5 px-3 text-center whitespace-nowrap">
                    ${typeBadge}
                </td>
                <td class="py-2.5 px-3 max-w-[240px]">
                    <div class="text-xs text-slate-200 truncate" title="${noteText || 'বিবরণ নেই'}">
                        ${noteText || '<span class="text-slate-500 italic font-sans text-[11px]">কোনো নোট নেই</span>'}
                    </div>
                    ${statusBadge ? `<div class="mt-1">${statusBadge}</div>` : ''}
                </td>
                <td class="py-2.5 px-3 text-right whitespace-nowrap font-mono font-bold text-xs ${isDeposit ? 'text-emerald-400' : 'text-red-400'}">
                    ${isDeposit ? '+' : '-'} ৳ ${formatAmountWithComma(amount)}
                </td>
            </tr>
        `;
    }).join('');
}

export function buildSyncModalHTML(initialDate, initialShowroomFlag, pendingCount) {
    return `
        <div class="text-left font-bn space-y-3 select-none">
            <!-- Filter & Navigation Control Bar -->
            <div class="bg-slate-950/90 p-3 rounded-2xl border border-slate-800 flex flex-col gap-2.5 shadow-md">
                
                <!-- Row 1: Quick Filter Pills & Showroom Cash Toggle -->
                <div class="flex flex-wrap items-center justify-between gap-2">
                    <div class="flex flex-wrap items-center gap-1.5">
                        <button type="button" id="tr-sync-tab-today" class="px-2.5 py-1 text-xs font-bold rounded-xl border whitespace-nowrap shrink-0 transition-all flex items-center gap-1 cursor-pointer bg-blue-600/30 text-blue-300 border-blue-500/50 hover:bg-blue-600/40">
                            <i class="fa-solid fa-calendar-day text-blue-400 text-xs"></i>
                            <span>আজ</span>
                        </button>

                        <button type="button" id="tr-sync-tab-yesterday" class="px-2.5 py-1 text-xs font-bold rounded-xl border whitespace-nowrap shrink-0 transition-all flex items-center gap-1 cursor-pointer bg-slate-900 text-slate-300 border-slate-700 hover:bg-slate-800">
                            <i class="fa-solid fa-clock-rotate-left text-purple-400 text-xs"></i>
                            <span>গতকাল</span>
                        </button>

                        <button type="button" id="tr-sync-tab-pending" class="px-2.5 py-1 text-xs font-bold rounded-xl border whitespace-nowrap shrink-0 transition-all flex items-center gap-1.5 cursor-pointer bg-slate-900 text-slate-300 border-slate-700 hover:bg-slate-800">
                            <i class="fa-solid fa-bolt text-amber-400 text-xs"></i>
                            <span>সব অপেক্ষমান</span>
                            <span id="tr-sync-pending-badge" class="px-1.5 py-0.2 text-[10px] font-black rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">${pendingCount}</span>
                        </button>

                        <button type="button" id="tr-sync-tab-all" class="px-2.5 py-1 text-xs font-bold rounded-xl border whitespace-nowrap shrink-0 transition-all flex items-center gap-1 cursor-pointer bg-slate-900 text-slate-300 border-slate-700 hover:bg-slate-800" title="সকল তারিখের সব লেনদেন">
                            <i class="fa-solid fa-list-check text-slate-400 text-xs"></i>
                            <span>সকল</span>
                        </button>
                    </div>

                    <div class="flex items-center gap-3">
                        <label class="flex items-center gap-1.5 text-xs text-slate-400 cursor-pointer hover:text-slate-200 whitespace-nowrap shrink-0 select-none">
                            <input type="checkbox" id="tr-sync-include-cash" class="w-3.5 h-3.5 rounded bg-slate-900 border-slate-700 text-blue-600 focus:ring-0 cursor-pointer" ${initialShowroomFlag ? 'checked' : ''} />
                            <span>শোরুম ক্যাশ দেখাও</span>
                        </label>
                    </div>
                </div>

                <!-- Row 2: Date Selector & Live Search Input -->
                <div class="flex flex-wrap items-center justify-between gap-2.5 pt-2 border-t border-slate-800/80">
                    <div class="flex items-center gap-2">
                        <label class="text-xs font-bold text-slate-300 whitespace-nowrap shrink-0 flex items-center gap-1">
                            <i class="fa-solid fa-calendar text-blue-400"></i>
                            <span>তারিখ নির্বাচন:</span>
                        </label>
                        <div class="relative inline-flex items-center">
                            <input 
                                type="text" 
                                id="tr-sync-date-picker" 
                                class="bg-slate-900 border border-slate-700 hover:border-blue-500 focus:border-blue-500 rounded-xl px-3 py-1.5 text-xs text-white font-mono outline-none datepicker cursor-pointer w-36 min-w-[140px] text-center shadow-inner transition-colors" 
                                placeholder="DD/MM/YYYY"
                                value="${initialDate ? formatAppDate(initialDate) : ''}"
                            />
                        </div>
                        <span id="tr-sync-active-filter-label" class="text-[11px] font-bold text-blue-400 whitespace-nowrap shrink-0 bg-blue-500/10 px-2 py-0.5 rounded-lg border border-blue-500/20">
                            আজকের তারিখ
                        </span>
                    </div>

                    <!-- Instant Search Bar -->
                    <div class="relative flex-1 min-w-[180px] max-w-[260px]">
                        <i class="fa-solid fa-magnifying-glass absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 text-xs pointer-events-none"></i>
                        <input 
                            type="text" 
                            id="tr-sync-search-input" 
                            placeholder="ব্যাংক বা নোট সার্চ করুন..." 
                            class="w-full bg-slate-900 border border-slate-700 hover:border-slate-600 focus:border-blue-500 rounded-xl pl-8 pr-3 py-1.5 text-xs text-slate-200 placeholder-slate-500 outline-none transition-colors"
                        />
                    </div>
                </div>

            </div>

            <!-- Intelligent Duplicate Guard Notice -->
            <div class="px-3 py-2 bg-blue-950/30 border border-blue-500/20 rounded-xl text-xs text-blue-300 flex items-start gap-2">
                <i class="fa-solid fa-shield-halved text-blue-400 text-xs mt-0.5 shrink-0"></i>
                <div>
                    <strong>স্মার্ট গার্ড:</strong> ডিফল্টভাবে আজকের তারিখের ব্যাংক লেনদেন দেখানো হচ্ছে। আপনি পেছনের যেকোনো তারিখ সিলেক্ট করলে ঐ দিনের ডাটা স্বয়ংক্রিয়ভাবে লোড হবে।
                </div>
            </div>

            <!-- Table Header Bar with Count Badge -->
            <div class="flex items-center justify-between px-1">
                <div class="flex items-center gap-2">
                    <span class="text-xs text-slate-400">সিলেক্ট করার জন্য চেকবক্সে টিক দিন:</span>
                </div>
                <div id="tr-sync-count-badge" class="text-xs font-bold text-slate-300">
                    গণনা হচ্ছে...
                </div>
            </div>

            <!-- Staging Table Scroll Container -->
            <div class="max-h-[320px] overflow-y-auto border border-slate-800 rounded-2xl bg-slate-950/60 custom-scrollbar shadow-inner">
                <table class="w-full text-left border-collapse">
                    <thead class="sticky top-0 bg-slate-900 border-b border-slate-800 text-[11px] font-black text-slate-400 uppercase tracking-wider z-10">
                        <tr>
                            <th class="py-2.5 px-3 text-center w-12 shrink-0 whitespace-nowrap">
                                <input 
                                    type="checkbox" 
                                    id="tr-sync-master-check" 
                                    class="w-4 h-4 rounded text-blue-600 bg-slate-800 border-slate-600 focus:ring-blue-500 cursor-pointer" 
                                    title="সবগুলো একসাথে নির্বাচন / বাতিল করুন"
                                />
                            </th>
                            <th class="py-2.5 px-3 whitespace-nowrap">ব্যাংক ও তারিখ</th>
                            <th class="py-2.5 px-3 text-center whitespace-nowrap">ধরন</th>
                            <th class="py-2.5 px-3">বিবরণ / নোট</th>
                            <th class="py-2.5 px-3 text-right whitespace-nowrap">পরিমাণ</th>
                        </tr>
                    </thead>
                    <tbody id="tr-sync-tbody">
                        <!-- Populated Dynamically -->
                    </tbody>
                </table>
            </div>

            <!-- Real-time Live Summary Bar -->
            <div class="p-3 bg-slate-950 border border-slate-800/90 rounded-2xl flex flex-wrap items-center justify-between gap-3 font-mono text-xs shadow-md">
                <div class="flex items-center gap-5">
                    <div>
                        <span class="text-[10px] text-slate-400 block font-sans font-bold">মোট জমা (+)</span>
                        <span id="tr-sync-sum-inflow" class="font-black text-emerald-400">+৳ ০</span>
                    </div>
                    <div class="h-6 w-px bg-slate-800"></div>
                    <div>
                        <span class="text-[10px] text-slate-400 block font-sans font-bold">মোট উত্তোলন (-)</span>
                        <span id="tr-sync-sum-outflow" class="font-black text-red-400">-৳ ০</span>
                    </div>
                </div>
                <div class="text-right">
                    <span class="text-[10px] text-amber-400 block font-sans font-bold">নিট ফান্ড প্রভাব</span>
                    <span id="tr-sync-sum-net" class="font-black text-amber-300 text-sm">৳ ০</span>
                </div>
            </div>
        </div>
    `;
}

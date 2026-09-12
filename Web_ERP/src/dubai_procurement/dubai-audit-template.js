/**
 * Dubai Procurement & Weekly Audit - HTML Layout & Card Templates
 * Pure UI presentation strings keeping controllers concise and maintainable.
 */

import { formatAmountWithComma, getTodayLocalDateString } from '../utils.js';

export function getDubaiAuditMainTemplate() {
    return `
        <div class="flex flex-col gap-6 font-bn max-w-7xl mx-auto pb-16">
            <!-- Top Header & Actions Bar -->
            <div class="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-900/80 border border-slate-800 p-4 sm:p-6 rounded-3xl backdrop-blur-xl shadow-xl">
                <div class="flex items-center gap-3.5">
                    <div class="w-12 h-12 rounded-2xl bg-sky-500/10 border border-sky-500/20 flex items-center justify-center text-sky-400 text-2xl shadow-inner shrink-0">
                        <i class="fa-solid fa-ship"></i>
                    </div>
                    <div>
                        <div class="flex items-center gap-2">
                            <h1 class="text-lg sm:text-2xl font-black text-white tracking-tight">দুবাই কনটেইনার ও ক্রয় খতিয়ান</h1>
                            <span class="px-2.5 py-0.5 rounded-full text-xs font-black bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">AED (د.إ)</span>
                        </div>
                        <p class="text-xs text-slate-400 mt-0.5">সাপ্তাহিক কেনাকাটা, দেরহাম রেমিট্যান্স, ফিল্ড খরচ ও বৃহস্পতিবারের ক্যাশ অডিট</p>
                    </div>
                </div>

                <div class="flex flex-wrap items-center gap-2.5">
                    <button type="button" id="btn-dubai-roll-forward" class="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-sky-300 border border-sky-500/30 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer shadow-sm">
                        <i class="fa-solid fa-arrows-rotate text-sky-400"></i>
                        <span>রোল-ফরওয়ার্ড আনুন</span>
                    </button>
                    <button type="button" id="btn-dubai-print" class="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer shadow-sm">
                        <i class="fa-solid fa-print text-slate-400"></i>
                        <span>১-পাতা প্রিন্ট</span>
                    </button>
                    <button type="button" id="btn-dubai-save" class="px-4 py-2 bg-sky-600 hover:bg-sky-500 text-white rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer shadow-lg shadow-sky-600/20">
                        <i class="fa-solid fa-cloud-arrow-up"></i>
                        <span>অডিট সেভ করুন</span>
                    </button>
                    <button type="button" id="btn-dubai-new" class="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-amber-400 border border-amber-500/30 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer shadow-sm">
                        <i class="fa-solid fa-plus"></i>
                        <span>নতুন সপ্তাহ</span>
                    </button>
                </div>
            </div>

            <!-- Master Meta Inputs Bar -->
            <div class="grid grid-cols-1 sm:grid-cols-3 gap-3.5 bg-slate-900/60 border border-slate-800/80 p-4 rounded-2xl">
                <div>
                    <label class="block text-xs font-bold text-slate-400 mb-1">কনটেইনার নং / আইডি:</label>
                    <input type="text" id="dubai-container-no" value="CT-2026-DXB-01" class="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white font-bold focus:border-sky-500 outline-none">
                </div>
                <div>
                    <label class="block text-xs font-bold text-slate-400 mb-1">অডিট তারিখ (বৃহস্পতিবার):</label>
                    <input type="text" id="dubai-week-date" value="${getTodayLocalDateString()}" class="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white font-bold font-mono focus:border-sky-500 outline-none datepicker">
                </div>
                <div>
                    <label class="block text-xs font-bold text-slate-400 mb-1">অডিট নোট / মেমো বিবরণ:</label>
                    <input type="text" id="dubai-audit-note" placeholder="যেমন: ১০/০৯/২৬ ক্লোজিং" class="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-300 focus:border-sky-500 outline-none">
                </div>
            </div>

            <!-- Top Level Live Summary Cards (Rolling Totals) -->
            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div class="bg-gradient-to-br from-emerald-950/40 to-slate-900 border border-emerald-500/30 rounded-2xl p-4 flex flex-col justify-between">
                    <div class="flex items-center justify-between text-xs text-emerald-400 font-bold mb-2">
                        <span>১. সর্বমোট দেরহাম প্রাপ্তি</span>
                        <i class="fa-solid fa-plane-arrival"></i>
                    </div>
                    <div id="card-dubai-cum-remittance" class="text-xl sm:text-2xl font-black text-white font-mono">0 AED</div>
                    <div class="text-[11px] text-slate-400 mt-2 flex justify-between">
                        <span>পূর্বের: <span id="card-dubai-prev-rem">0</span></span>
                        <span>নতুন: <span id="card-dubai-new-rem" class="text-emerald-400 font-bold">+0</span></span>
                    </div>
                </div>

                <div class="bg-gradient-to-br from-amber-950/40 to-slate-900 border border-amber-500/30 rounded-2xl p-4 flex flex-col justify-between">
                    <div class="flex items-center justify-between text-xs text-amber-400 font-bold mb-2">
                        <span>২. সর্বমোট মালামাল ক্রয়</span>
                        <i class="fa-solid fa-receipt"></i>
                    </div>
                    <div id="card-dubai-cum-purchase" class="text-xl sm:text-2xl font-black text-white font-mono">0 AED</div>
                    <div class="text-[11px] text-slate-400 mt-2 flex justify-between">
                        <span>পূর্বের: <span id="card-dubai-prev-pur">0</span></span>
                        <span>নতুন: <span id="card-dubai-new-pur" class="text-amber-400 font-bold">+0</span></span>
                    </div>
                </div>

                <div class="bg-gradient-to-br from-red-950/40 to-slate-900 border border-red-500/30 rounded-2xl p-4 flex flex-col justify-between">
                    <div class="flex items-center justify-between text-xs text-red-400 font-bold mb-2">
                        <span>৩. সর্বমোট ফিল্ড খরচ</span>
                        <i class="fa-solid fa-wallet"></i>
                    </div>
                    <div id="card-dubai-cum-expense" class="text-xl sm:text-2xl font-black text-white font-mono">0 AED</div>
                    <div class="text-[11px] text-slate-400 mt-2 flex justify-between">
                        <span>পূর্বের: <span id="card-dubai-prev-exp">0</span></span>
                        <span>নতুন: <span id="card-dubai-new-exp" class="text-red-400 font-bold">+0</span></span>
                    </div>
                </div>

                <div class="bg-gradient-to-br from-slate-950 to-slate-900 border border-slate-700 rounded-2xl p-4 flex flex-col justify-between">
                    <div class="flex items-center justify-between text-xs text-slate-300 font-bold mb-2">
                        <span>৪. নিট ক্যাশ স্থিতি (Book)</span>
                        <i class="fa-solid fa-scale-balanced text-sky-400"></i>
                    </div>
                    <div id="card-dubai-calc-cash" class="text-xl sm:text-2xl font-black text-sky-400 font-mono">0 AED</div>
                    <div class="text-[10px] text-slate-500 mt-2">(দেরহাম - ক্রয় - খরচ)</div>
                </div>
            </div>

            <!-- Opening Balances Bar -->
            <div class="bg-slate-900/40 border border-slate-800 p-3 rounded-xl flex flex-wrap items-center gap-3 text-xs">
                <span class="text-slate-400 font-bold flex items-center gap-1">
                    <i class="fa-solid fa-clock-rotate-left text-sky-400"></i> পূর্বের ব্যালেন্স (Opening):
                </span>
                <div class="flex items-center gap-1.5">
                    <span class="text-slate-500">রেমিট্যান্স:</span>
                    <input type="text" id="dubai-prev-rem-input" value="0" oninput="window.handleNumberInput(this)" onchange="window.handleDubaiPrevChange()" class="w-28 bg-slate-950 border border-slate-700 rounded px-2 py-0.5 text-xs text-emerald-400 font-mono text-right font-bold">
                </div>
                <div class="flex items-center gap-1.5">
                    <span class="text-slate-500">ক্রয়:</span>
                    <input type="text" id="dubai-prev-pur-input" value="0" oninput="window.handleNumberInput(this)" onchange="window.handleDubaiPrevChange()" class="w-28 bg-slate-950 border border-slate-700 rounded px-2 py-0.5 text-xs text-amber-400 font-mono text-right font-bold">
                </div>
                <div class="flex items-center gap-1.5">
                    <span class="text-slate-500">খরচ:</span>
                    <input type="text" id="dubai-prev-exp-input" value="0" oninput="window.handleNumberInput(this)" onchange="window.handleDubaiPrevChange()" class="w-28 bg-slate-950 border border-slate-700 rounded px-2 py-0.5 text-xs text-red-400 font-mono text-right font-bold">
                </div>
            </div>

            <!-- Two Main Grids: Memo/Expenses vs Remittances/Separated Assets -->
            <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div class="flex flex-col gap-6">
                    <div id="dubai-memo-grid-section"></div>
                    <div id="dubai-expense-grid-section"></div>
                </div>
                <div class="flex flex-col gap-6">
                    <div id="dubai-remittance-grid-section"></div>
                    <div id="dubai-asset-modal-section"></div>
                </div>
            </div>

            <!-- Final Reconciliation & Variance Card -->
            <div id="dubai-reconciliation-bar" class="p-5 rounded-3xl border bg-slate-900/90 flex flex-col md:flex-row items-center justify-between gap-4 backdrop-blur-xl"></div>

            <!-- Past Audits History Table -->
            <div class="bg-slate-900/80 border border-slate-800 rounded-3xl p-5 backdrop-blur-xl">
                <div class="flex items-center justify-between pb-3 border-b border-slate-800 mb-4">
                    <div class="flex items-center gap-2">
                        <i class="fa-solid fa-list-check text-sky-400 text-lg"></i>
                        <h3 class="text-base font-bold text-white">সংরক্ষিত অডিট হিস্ট্রি (বৃহস্পতিবারের ক্লোজিং সমূহ)</h3>
                    </div>
                </div>
                <div class="overflow-x-auto custom-scrollbar">
                    <table class="w-full text-xs text-left border-collapse">
                        <thead>
                            <tr class="border-b border-slate-800 text-slate-400 font-semibold bg-slate-950/40">
                                <th class="p-2.5">অডিট তারিখ</th>
                                <th class="p-2.5">কনটেইনার নং</th>
                                <th class="p-2.5 text-right">মোট রেমিট্যান্স</th>
                                <th class="p-2.5 text-right">মোট ক্রয়</th>
                                <th class="p-2.5 text-right">মোট খরচ</th>
                                <th class="p-2.5 text-right">নগদ ক্যাশ</th>
                                <th class="p-2.5 text-right">মার্কেট AD</th>
                                <th class="p-2.5 text-right">ভ্যারিয়েন্স</th>
                                <th class="p-2.5 text-center">অ্যাকশন</th>
                            </tr>
                        </thead>
                        <tbody id="dubai-history-tbody"></tbody>
                    </table>
                </div>
            </div>
        </div>
    `;
}

export function buildReconciliationBarHtml(theoreticalCash, physicalAssets, variance) {
    const isBalanced = variance === 0;
    const isSurplus = variance > 0;

    const badgeColor = isBalanced ? 'border-emerald-500/40 bg-emerald-500/10 text-emerald-400' 
        : isSurplus ? 'border-sky-500/40 bg-sky-500/10 text-sky-400' 
        : 'border-red-500/40 bg-red-500/10 text-red-400';

    const statusText = isBalanced ? '১০০% নিখুঁত মিলেছে (Balanced)' 
        : isSurplus ? `ক্যাশ উদ্বৃত্ত / বাড়তি (+${formatAmountWithComma(variance)} AED)` 
        : `ক্যাশ ঘাটতি / শর্ট (${formatAmountWithComma(variance)} AED)`;

    return {
        className: `p-5 rounded-3xl border ${badgeColor} flex flex-col md:flex-row items-center justify-between gap-4 backdrop-blur-xl transition-all`,
        html: `
            <div class="flex items-center gap-3">
                <div class="text-2xl">
                    <i class="fa-solid ${isBalanced ? 'fa-circle-check text-emerald-400' : isSurplus ? 'fa-circle-plus text-sky-400' : 'fa-circle-exclamation text-red-400'}"></i>
                </div>
                <div>
                    <span class="text-xs font-bold uppercase tracking-wider block">সাপ্তাহিক রিকনসিলিয়েশন অবস্থা</span>
                    <span class="text-base sm:text-lg font-black">${statusText}</span>
                </div>
            </div>

            <div class="flex items-center gap-6 text-xs">
                <div>
                    <span class="text-slate-400 block text-[11px]">হিসাব মতে ক্যাশ:</span>
                    <b class="text-sm font-mono text-white">${formatAmountWithComma(theoreticalCash)} AED</b>
                </div>
                <div class="text-slate-600 text-lg">➔</div>
                <div>
                    <span class="text-slate-400 block text-[11px]">ঘোষিত বাস্তব সম্পদ:</span>
                    <b class="text-sm font-mono text-emerald-400">${formatAmountWithComma(physicalAssets)} AED</b>
                </div>
            </div>
        `
    };
}

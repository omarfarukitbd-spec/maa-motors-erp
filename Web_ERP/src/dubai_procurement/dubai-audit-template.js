/**
 * Dubai Procurement & Weekly Audit - Balanced 3-Column Ledger Template
 * Engineered for 100%, 110%, and 125% browser zoom without voids or deformed heights.
 */

import { getTodayLocalDateString, formatAmountWithComma, parseAmount, safeRound } from '../utils.js';

export function getDubaiAuditMainTemplate() {
    return `
        <div class="flex flex-col gap-5 font-bn w-full max-w-6xl mx-auto px-2 sm:px-4 pb-20">
            <!-- Top Controls & Action Bar -->
            <div class="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-900/90 border border-slate-800 p-4 sm:p-5 rounded-3xl backdrop-blur-xl shadow-2xl">
                <div class="flex items-center gap-3">
                    <div class="w-11 h-11 rounded-2xl bg-sky-500/10 border border-sky-500/20 flex items-center justify-center text-sky-400 text-xl shadow-inner shrink-0">
                        <i class="fa-solid fa-ship"></i>
                    </div>
                    <div>
                        <div class="flex items-center gap-2">
                            <h1 class="text-base sm:text-xl font-black text-white tracking-tight">দুবাই কনটেইনার ও সাপ্তাহিক অডিট খতিয়ান</h1>
                            <span class="px-2.5 py-0.5 rounded-full text-[11px] font-black bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 whitespace-nowrap">AED (د.إ)</span>
                        </div>
                        <p class="text-xs text-slate-400">বৃহস্পতিবারের ধারাবাহিক বিয়োগফল ও ক্যাশ রিকনসিলিয়েশন শিট</p>
                    </div>
                </div>

                <div class="flex flex-wrap items-center gap-2 shrink-0">
                    <button type="button" id="btn-dubai-roll-forward" class="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-sky-300 border border-sky-500/30 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-sm" title="গত সপ্তাহের ব্যালেন্স নিজে নিজে নিয়ে আসবে">
                        <i class="fa-solid fa-arrows-rotate text-sky-400 text-xs"></i>
                        <span>রোল-ফরওয়ার্ড</span>
                    </button>
                    <button type="button" id="btn-dubai-print" class="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-sm">
                        <i class="fa-solid fa-print text-slate-400 text-xs"></i>
                        <span>১-পাতা প্রিন্ট</span>
                    </button>
                    <button type="button" id="btn-dubai-save" class="px-4 py-2 bg-sky-600 hover:bg-sky-500 text-white rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-lg shadow-sky-600/20">
                        <i class="fa-solid fa-cloud-arrow-up text-xs"></i>
                        <span>অডিট সেভ করুন</span>
                    </button>
                    <button type="button" id="btn-dubai-new" class="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-amber-400 border border-amber-500/30 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-sm">
                        <i class="fa-solid fa-plus text-xs"></i>
                        <span>নতুন সপ্তাহ</span>
                    </button>
                </div>
            </div>

            <!-- Master Meta Bar -->
            <div class="grid grid-cols-1 sm:grid-cols-3 gap-3 bg-slate-900/60 border border-slate-800/80 p-3.5 rounded-2xl">
                <div>
                    <label class="block text-[11px] font-bold text-slate-400 mb-1">কনটেইনার আইডি:</label>
                    <input type="text" id="dubai-container-no" value="CT-2026-DXB-01" class="w-full bg-slate-950 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-white font-bold focus:border-sky-500 outline-none">
                </div>
                <div>
                    <label class="block text-[11px] font-bold text-slate-400 mb-1">অডিট তারিখ (বৃহস্পতিবার):</label>
                    <input type="text" id="dubai-week-date" value="2026-08-27" class="w-full bg-slate-950 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-white font-bold font-mono focus:border-sky-500 outline-none datepicker">
                </div>
                <div>
                    <label class="block text-[11px] font-bold text-slate-400 mb-1">অডিট নোট / শিরোনাম:</label>
                    <input type="text" id="dubai-audit-note" value="বৃহস্পতিবারের সাপ্তাহিক ক্যাশ রিকনসিলিয়েশন" class="w-full bg-slate-950 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-slate-300 focus:border-sky-500 outline-none">
                </div>
            </div>

            <!-- Balanced 3-Column Waterfall Table Card -->
            <div class="bg-slate-900/90 border border-slate-700/80 rounded-3xl p-4 sm:p-5 shadow-2xl backdrop-blur-xl flex flex-col gap-3">
                <div class="flex items-center justify-between pb-2 border-b border-slate-800">
                    <div class="text-sm font-black text-white flex items-center gap-2">
                        <i class="fa-solid fa-table-list text-sky-400"></i>
                        <span>সাপ্তাহিক রিকনসিলিয়েশন শিট (Thursday Cascade Sheet)</span>
                    </div>
                    <button type="button" onclick="window.toggleDubaiMemoModal(true)" class="px-2.5 py-1 bg-sky-500/10 hover:bg-sky-500/20 text-sky-400 border border-sky-500/20 rounded-lg text-xs font-bold flex items-center gap-1.5 cursor-pointer">
                        <i class="fa-solid fa-receipt text-xs"></i>
                        <span>মেমো রেঞ্জ জেনারেটর</span>
                    </button>
                </div>

                <!-- The Balanced 3-Column Grid -->
                <div class="border border-slate-700 rounded-2xl overflow-hidden text-xs shadow-inner">
                    <!-- Table Header: 6 cols (Description) | 3 cols (Cumulative AED) | 3 cols (Running Week) -->
                    <div class="grid grid-cols-12 bg-slate-950 border-b border-slate-700 font-bold text-slate-300">
                        <div class="col-span-6 p-3 flex items-center justify-between border-r border-slate-700">
                            <span id="label-table-date" class="text-sky-300 font-black">তারিখ: অডিট বৃহস্পতিবার</span>
                            <span class="text-[10px] text-slate-500 uppercase tracking-wider">বিবরণী ও হিসাব</span>
                        </div>
                        <div class="col-span-3 p-3 text-right text-sky-400 border-r border-slate-700 pr-3">
                            মোট ক্রমপুঞ্জিত (AED)
                        </div>
                        <div class="col-span-3 p-3 text-right text-emerald-400 pr-3">
                            রানিং সপ্তাহ / স্থিতি (AED)
                        </div>
                    </div>

                    <!-- Row 1: টাকা পাঠানো (Remittance) -->
                    <div class="grid grid-cols-12 border-b border-slate-800 bg-slate-900/50 hover:bg-slate-800/30 transition-colors items-center">
                        <div class="col-span-6 p-2.5 border-r border-slate-800 flex flex-col gap-1">
                            <input type="text" id="desc-sent" value="বৃহস্পতিবার পর্যন্ত টাকা পাঠানো" class="bg-transparent border-b border-dashed border-slate-700 text-slate-200 text-xs font-bold focus:border-sky-400 outline-none w-full">
                            <div class="flex items-center gap-1.5 text-[10px] text-slate-400 mt-0.5">
                                <i class="fa-solid fa-lock text-sky-400 text-[9px]" title="পূর্ববর্তী ক্লোজিং ব্যালেন্স (লক করা)"></i>
                                <span class="text-slate-400 font-semibold">পূর্বের মোট:</span>
                                <input type="text" id="dubai-prev-rem-input" value="11,52,395" placeholder="০.০০" readonly oninput="window.handleNumberInput(this); window.handlePrevBaselineChange('sent')" class="w-24 bg-slate-950/70 border border-slate-700/60 rounded px-1.5 py-0.5 text-[10px] text-emerald-400 font-mono text-right font-bold outline-none cursor-default" title="গত সপ্তাহের সমাপনী ব্যালেন্স (লক করা)">
                                <span class="text-slate-500 font-bold">AED</span>
                                <button type="button" onclick="window.toggleUnlockPrevBaseline('sent')" class="text-[9px] text-slate-500 hover:text-sky-400 px-0.5 cursor-pointer" title="প্রয়োজনে আনলক করে এডিট করুন"><i class="fa-solid fa-pen-to-square"></i></button>
                            </div>
                        </div>
                        <div class="col-span-3 p-2.5 border-r border-slate-800 flex items-center justify-end gap-1.5 pr-2">
                            <span class="text-[10px] text-slate-500 font-bold">AED:</span>
                            <input type="text" id="input-cum-sent" value="" placeholder="০.০০" oninput="window.handleNumberInput(this); window.handleCumChange('sent')" class="w-full max-w-[135px] bg-slate-950 border border-slate-700 rounded px-2 py-1 text-xs text-emerald-400 font-mono text-right font-bold focus:border-emerald-500 outline-none">
                        </div>
                        <div class="col-span-3 p-2.5 flex items-center justify-end pr-2">
                            <input type="text" id="input-running-sent" value="" placeholder="০.০০" oninput="window.handleNumberInput(this); window.handleRunningChange('sent')" class="w-full max-w-[135px] bg-slate-950 border border-slate-700 rounded-lg px-2 py-1 text-xs text-emerald-400 font-bold font-mono text-right focus:border-emerald-500 outline-none">
                        </div>
                    </div>

                    <!-- Row 2: মাল ক্রয় (Purchases) - Balanced with 1-Line Memo Sub-bar -->
                    <div class="grid grid-cols-12 border-b border-slate-800 bg-slate-900/50 hover:bg-slate-800/30 transition-colors items-center">
                        <div class="col-span-6 p-2.5 border-r border-slate-800 flex flex-col gap-1.5">
                            <div class="flex items-center justify-between gap-2">
                                <input type="text" id="desc-purchase" value="সর্বমোট মাল ক্রয়" class="bg-transparent border-b border-dashed border-slate-700 text-slate-200 text-xs font-bold focus:border-sky-400 outline-none flex-grow">
                                <span class="text-slate-500 text-[10px] whitespace-nowrap"><i class="fa-solid fa-minus text-amber-400 mr-0.5"></i> বিয়োগ</span>
                            </div>
                            <!-- Compact Inline Memo Range Toolbar -->
                            <div class="flex flex-wrap items-center gap-1.5 bg-slate-950/80 px-2 py-1 rounded-lg border border-slate-800 text-[11px]">
                                <span class="text-slate-400 text-[10px]">মেমো:</span>
                                <input type="number" id="memo-range-start" value="113" placeholder="শুরু" oninput="window.handleMemoRangeChange()" class="w-12 bg-slate-900 border border-slate-700 rounded px-1 py-0.5 text-[11px] text-amber-300 font-mono text-center outline-none">
                                <span class="text-slate-500 text-[10px]">থেকে</span>
                                <input type="number" id="memo-range-end" value="" placeholder="শেষ" oninput="window.handleMemoRangeChange()" class="w-12 bg-slate-900 border border-slate-700 rounded px-1 py-0.5 text-[11px] text-amber-300 font-mono text-center outline-none">
                                <span id="memo-auto-count-badge" class="px-1.5 py-0.5 rounded bg-slate-800 text-slate-400 text-[10px] font-bold whitespace-nowrap">০টি মেমো</span>
                                <input type="hidden" id="desc-memos" value="">
                                <button type="button" onclick="window.openDubaiMemoDetailsModal()" class="ml-auto px-1.5 py-0.5 bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/30 rounded text-[10px] font-bold flex items-center gap-1 cursor-pointer">
                                    <i class="fa-solid fa-list-check text-[9px]"></i> মেমো এন্ট্রি
                                </button>
                            </div>
                            <div class="flex items-center gap-1.5 text-[10px] text-slate-400 mt-0.5">
                                <i class="fa-solid fa-lock text-sky-400 text-[9px]" title="পূর্ববর্তী ক্লোজিং ব্যালেন্স (লক করা)"></i>
                                <span class="text-slate-400 font-semibold">পূর্বের মোট ক্রয়:</span>
                                <input type="text" id="dubai-prev-pur-input" value="8,59,860" placeholder="০.০০" readonly oninput="window.handleNumberInput(this); window.handlePrevBaselineChange('purchase')" class="w-24 bg-slate-950/70 border border-slate-700/60 rounded px-1.5 py-0.5 text-[10px] text-amber-400 font-mono text-right font-bold outline-none cursor-default" title="গত সপ্তাহের সমাপনী ক্রয় (লক করা)">
                                <span class="text-slate-500 font-bold">AED</span>
                                <button type="button" onclick="window.toggleUnlockPrevBaseline('purchase')" class="text-[9px] text-slate-500 hover:text-sky-400 px-0.5 cursor-pointer" title="প্রয়োজনে আনলক করে এডিট করুন"><i class="fa-solid fa-pen-to-square"></i></button>
                            </div>
                        </div>
                        <div class="col-span-3 p-2.5 border-r border-slate-800 flex items-center justify-end gap-1.5 pr-2">
                            <span class="text-[10px] text-slate-500 font-bold">AED:</span>
                            <input type="text" id="input-cum-purchase" value="" placeholder="০.০০" oninput="window.handleNumberInput(this); window.handleCumChange('purchase')" class="w-full max-w-[135px] bg-slate-950 border border-slate-700 rounded px-2 py-1 text-xs text-amber-400 font-mono text-right font-bold focus:border-amber-500 outline-none">
                        </div>
                        <div class="col-span-3 p-2.5 flex items-center justify-end pr-2">
                            <input type="text" id="input-running-purchase" value="" placeholder="০.০০" oninput="window.handleNumberInput(this); window.handleRunningChange('purchase')" class="w-full max-w-[135px] bg-slate-950 border border-slate-700 rounded-lg px-2.5 py-1 text-xs text-amber-400 font-bold font-mono text-right focus:border-amber-500 outline-none">
                        </div>
                    </div>

                    <!-- Subtotal 1: টাকা পাঠানো - মাল ক্রয় -->
                    <div class="grid grid-cols-12 border-b border-slate-800 bg-slate-950/70 font-bold items-center">
                        <div class="col-span-6 p-2 border-r border-slate-800 flex items-center text-sky-300 pl-3">
                            <span class="text-[11px] text-slate-400">অবশিষ্ট ফান্ড (টাকা পাঠানো – মাল ক্রয়):</span>
                        </div>
                        <div class="col-span-3 p-2 border-r border-slate-800 flex items-center justify-end gap-1.5 text-sky-400 font-mono text-sm pr-2">
                            <span class="text-xs text-slate-500 font-normal">AED =</span>
                            <span id="subtotal-1" class="font-black">0</span>
                        </div>
                        <div class="col-span-3 p-2 text-center text-slate-600 text-xs">—</div>
                    </div>

                    <!-- Row 3: খরচ (Expenses) -->
                    <div class="grid grid-cols-12 border-b border-slate-800 bg-slate-900/50 hover:bg-slate-800/30 transition-colors items-center">
                        <div class="col-span-6 p-2.5 border-r border-slate-800 flex flex-col gap-1">
                            <div class="flex items-center justify-between gap-2">
                                <input type="text" id="desc-expense" value="সর্বমোট খরচ" class="bg-transparent border-b border-dashed border-slate-700 text-slate-200 text-xs font-bold focus:border-sky-400 outline-none flex-grow">
                                <span class="text-slate-500 text-[10px] whitespace-nowrap"><i class="fa-solid fa-minus text-red-400 mr-0.5"></i> বিয়োগ</span>
                            </div>
                            <div class="flex items-center gap-1.5 text-[10px] text-slate-400 mt-0.5">
                                <i class="fa-solid fa-lock text-sky-400 text-[9px]" title="পূর্ববর্তী ক্লোজিং ব্যালেন্স (লক করা)"></i>
                                <span class="text-slate-400 font-semibold">পূর্বের মোট খরচ:</span>
                                <input type="text" id="dubai-prev-exp-input" value="18,069" placeholder="০.০০" readonly oninput="window.handleNumberInput(this); window.handlePrevBaselineChange('expense')" class="w-24 bg-slate-950/70 border border-slate-700/60 rounded px-1.5 py-0.5 text-[10px] text-red-400 font-mono text-right font-bold outline-none cursor-default" title="গত সপ্তাহের সমাপনী খরচ (লক করা)">
                                <span class="text-slate-500 font-bold">AED</span>
                                <button type="button" onclick="window.toggleUnlockPrevBaseline('expense')" class="text-[9px] text-slate-500 hover:text-sky-400 px-0.5 cursor-pointer" title="প্রয়োজনে আনলক করে এডিট করুন"><i class="fa-solid fa-pen-to-square"></i></button>
                            </div>
                        </div>
                        <div class="col-span-3 p-2.5 border-r border-slate-800 flex items-center justify-end gap-1.5 pr-2">
                            <span class="text-[10px] text-slate-500 font-bold">AED:</span>
                            <input type="text" id="input-cum-expense" value="" placeholder="০.০০" oninput="window.handleNumberInput(this); window.handleCumChange('expense')" class="w-full max-w-[135px] bg-slate-950 border border-slate-700 rounded px-2 py-1 text-xs text-red-400 font-mono text-right font-bold focus:border-red-500 outline-none">
                        </div>
                        <div class="col-span-3 p-2.5 flex items-center justify-end pr-2">
                            <input type="text" id="input-running-expense" value="" placeholder="০.০০" oninput="window.handleNumberInput(this); window.handleRunningChange('expense')" class="w-full max-w-[135px] bg-slate-950 border border-slate-700 rounded-lg px-2.5 py-1 text-xs text-red-400 font-bold font-mono text-right focus:border-red-500 outline-none">
                        </div>
                    </div>

                    <!-- Subtotal 2: নিট ক্যাশ স্থিতি (Subtotal 1 - খরচ) -->
                    <div class="grid grid-cols-12 border-b border-slate-800 bg-slate-950/70 font-bold items-center">
                        <div class="col-span-6 p-2 border-r border-slate-800 flex items-center text-sky-300 pl-3">
                            <span class="text-[11px] text-slate-400">নিট ক্যাশ স্থিতি (হাতে থাকার কথা):</span>
                        </div>
                        <div class="col-span-3 p-2 border-r border-slate-800 flex items-center justify-end gap-1.5 text-sky-400 font-mono text-sm pr-2">
                            <span class="text-xs text-slate-500 font-normal">AED =</span>
                            <span id="subtotal-2" class="font-black">0</span>
                        </div>
                        <div class="col-span-3 p-2 text-center text-slate-600 text-xs">—</div>
                    </div>

                    <!-- Row 4: মার্কেট এডভান্স (সম্পূর্ণ আলাদা সারি) -->
                    <div class="grid grid-cols-12 border-b border-slate-800 bg-slate-900/40 hover:bg-slate-800/30 transition-colors items-center">
                        <div class="col-span-6 p-2.5 border-r border-slate-800 flex items-center justify-between gap-2">
                            <input type="text" id="desc-ad" value="মার্কেট এডভান্স (AD)" class="bg-transparent border-b border-dashed border-slate-700 text-cyan-300 text-xs font-bold focus:border-cyan-400 outline-none flex-grow">
                            <span class="text-slate-500 text-[10px] whitespace-nowrap"><i class="fa-solid fa-minus text-cyan-400 mr-0.5"></i> বিয়োগ</span>
                        </div>
                        <div class="col-span-3 p-2.5 border-r border-slate-800 flex items-center justify-end gap-1.5 pr-2">
                            <span class="text-[10px] text-slate-500 font-bold">AED:</span>
                            <input type="text" id="val-market-ad" value="" placeholder="০.০০" oninput="window.handleNumberInput(this); window.handleDubaiWaterfallChange()" class="w-full max-w-[135px] bg-slate-950 border border-slate-700 rounded px-2 py-1 text-xs text-cyan-400 font-mono text-right font-bold focus:border-cyan-500 outline-none">
                        </div>
                        <div class="col-span-3 p-2.5 text-slate-400 text-xs text-right pr-3">
                            সাপ্লায়ারদের অগ্রিম
                        </div>
                    </div>

                    <!-- Row 5: নগদ ক্যাশ আছে (সম্পূর্ণ আলাদা সারি) -->
                    <div class="grid grid-cols-12 border-b border-slate-800 bg-slate-900/40 hover:bg-slate-800/30 transition-colors items-center">
                        <div class="col-span-6 p-2.5 border-r border-slate-800 flex items-center justify-between gap-2">
                            <input type="text" id="desc-cash" value="নগদ ক্যাশ আছে (Cash in Hand)" class="bg-transparent border-b border-dashed border-slate-700 text-emerald-300 text-xs font-bold focus:border-emerald-400 outline-none flex-grow">
                            <span class="text-slate-500 text-[10px] whitespace-nowrap"><i class="fa-solid fa-minus text-emerald-400 mr-0.5"></i> বিয়োগ</span>
                        </div>
                        <div class="col-span-3 p-2.5 border-r border-slate-800 flex items-center justify-end gap-1.5 pr-2">
                            <span class="text-[10px] text-slate-500 font-bold">AED:</span>
                            <input type="text" id="val-cash-in-hand" value="" placeholder="০.০০" oninput="window.handleNumberInput(this); window.handleDubaiWaterfallChange()" class="w-full max-w-[135px] bg-slate-950 border border-slate-700 rounded px-2 py-1 text-xs text-emerald-400 font-mono text-right font-bold focus:border-emerald-500 outline-none">
                        </div>
                        <div class="col-span-3 p-2.5 text-slate-400 text-xs text-right pr-3">
                            ক্যাশ বাক্সে নগদ দেরহাম
                        </div>
                    </div>

                    <!-- Subtotal 3: ক্যাশ ও এডভান্স বিয়োগের পর অবশিষ্ট -->
                    <div class="grid grid-cols-12 border-b border-slate-800 bg-slate-950/70 font-bold items-center">
                        <div class="col-span-6 p-2 border-r border-slate-800 flex items-center text-purple-300 pl-3">
                            <span class="text-[11px] text-slate-400">অবশিষ্ট ব্যালেন্স (এডভান্স ও ক্যাশ বাদে):</span>
                        </div>
                        <div class="col-span-3 p-2 border-r border-slate-800 flex items-center justify-end gap-1.5 text-purple-400 font-mono text-sm pr-2">
                            <span class="text-xs text-slate-500 font-normal">AED =</span>
                            <span id="subtotal-3" class="font-black">0</span>
                        </div>
                        <div class="col-span-3 p-2 text-center text-slate-600 text-xs">—</div>
                    </div>

                    <!-- Row 6+: Dynamic Custody Holdings (আলতাফ, মেছ, এমরান ইত্যাদি) -->
                    <div id="dubai-dynamic-holdings-container">
                        <!-- Rendered dynamically via dubai-audit-ui.js -->
                    </div>

                    <!-- Add Custody Item Button Row with Quick Preset Chips -->
                    <div class="grid grid-cols-12 border-b border-slate-800 bg-slate-950/40 p-2.5 items-center">
                        <div class="col-span-6 flex flex-wrap items-center gap-1.5 border-r border-slate-800 pr-2">
                            <span class="text-[10px] text-slate-500 font-bold mr-1">বিবরণ যোগ:</span>
                            <button type="button" onclick="window.addDubaiHoldingPreset('আলতাফ')" class="px-2 py-0.5 bg-slate-800 hover:bg-slate-700 text-purple-300 border border-purple-500/30 rounded text-[11px] font-semibold cursor-pointer">+ আলতাফ</button>
                            <button type="button" onclick="window.addDubaiHoldingPreset('এমরান মামা')" class="px-2 py-0.5 bg-slate-800 hover:bg-slate-700 text-purple-300 border border-purple-500/30 rounded text-[11px] font-semibold cursor-pointer">+ এমরান মামা</button>
                            <button type="button" onclick="window.addDubaiHoldingPreset('জাবেদ')" class="px-2 py-0.5 bg-slate-800 hover:bg-slate-700 text-purple-300 border border-purple-500/30 rounded text-[11px] font-semibold cursor-pointer">+ জাবেদ</button>
                            <button type="button" onclick="window.addDubaiHoldingPreset('মেছ (মেস)')" class="px-2 py-0.5 bg-slate-800 hover:bg-slate-700 text-purple-300 border border-purple-500/30 rounded text-[11px] font-semibold cursor-pointer">+ মেছ</button>
                            <button type="button" id="btn-add-waterfall-holding" class="px-2 py-0.5 bg-purple-500/10 hover:bg-purple-500/20 text-purple-400 border border-purple-500/20 rounded text-[11px] font-bold cursor-pointer"><i class="fa-solid fa-plus text-[10px]"></i> নতুন</button>
                        </div>
                        <div class="col-span-6 text-slate-500 text-[10px] flex items-center justify-end pr-2">
                            <i class="fa-solid fa-pen-to-square mr-1 text-slate-600"></i> যেকোনো নাম ও অংক পরিবর্তনযোগ্য
                        </div>
                    </div>

                    <!-- FINAL ROW: ক্যাশ সমন্বয় (Surplus / Deficit) - No duplicate text! -->
                    <div class="grid grid-cols-12 bg-slate-950 p-3 items-center font-black">
                        <div class="col-span-6 border-r border-slate-700 flex items-center gap-2 pl-2">
                            <span id="final-variance-badge" class="px-3 py-1 rounded-full text-xs font-black bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 flex items-center gap-1.5">
                                <i class="fa-solid fa-circle-check text-emerald-400"></i>
                                <span>ক্যাশ বাড়তি</span>
                            </span>
                            <input type="hidden" id="desc-final-status" value="(ক্যাশ বাড়তি)">
                        </div>
                        <div class="col-span-3 border-r border-slate-700 flex items-center justify-end gap-1.5 font-mono text-base sm:text-lg pr-3">
                            <span class="text-xs text-slate-500">AED =</span>
                            <span id="val-final-variance" class="text-emerald-400">0</span>
                        </div>
                        <div class="col-span-3 px-3 text-[11px] text-slate-400 text-center flex items-center justify-center gap-1.5">
                            <i class="fa-solid fa-shield-check text-emerald-400"></i>
                            <span>অডিট সমন্বয় সফল</span>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Executive Bottom Action Bar (Clean Controls, No Duplicate Widgets) -->
            <div class="flex flex-col sm:flex-row items-center justify-between gap-4 bg-slate-900/95 border border-slate-800 p-4 sm:p-5 rounded-3xl backdrop-blur-xl shadow-2xl">
                <div class="flex items-center gap-3 w-full sm:w-auto text-slate-400">
                    <div class="w-9 h-9 rounded-xl bg-sky-500/10 border border-sky-500/20 flex items-center justify-center text-sky-400 text-sm shrink-0">
                        <i class="fa-solid fa-shield-check"></i>
                    </div>
                    <div>
                        <div class="text-xs font-bold text-slate-300">স্বয়ংক্রিয় ব্যালেন্স সমন্বয় সক্রিয়</div>
                        <div class="text-[11px] text-slate-500">পূর্বের বেসলাইন ও চলতি সপ্তাহের পার্থক্য ক্যালকুলেটরে হিসাব করার প্রয়োজন নেই</div>
                    </div>
                </div>

                <div class="flex flex-wrap items-center justify-end gap-2 w-full sm:w-auto">
                    <button type="button" id="btn-dubai-roll-forward-bottom" class="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-sky-300 border border-sky-500/30 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-sm" title="পূর্ববর্তী অডিটের ব্যালেন্স নিয়ে আসুন">
                        <i class="fa-solid fa-arrows-rotate text-sky-400 text-xs"></i>
                        <span>রোল-ফরওয়ার্ড</span>
                    </button>
                    <button type="button" id="btn-dubai-new-bottom" class="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-amber-300 border border-amber-500/30 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-sm">
                        <i class="fa-solid fa-plus text-xs"></i>
                        <span>নতুন সপ্তাহ</span>
                    </button>
                    <button type="button" id="btn-dubai-print-bottom" class="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-sm">
                        <i class="fa-solid fa-print text-slate-400 text-xs"></i>
                        <span>১-পাতা প্রিন্ট</span>
                    </button>
                    <button type="button" id="btn-dubai-save-bottom" class="px-5 py-2.5 bg-gradient-to-r from-sky-600 to-blue-600 hover:from-sky-500 hover:to-blue-500 text-white rounded-xl text-xs font-black transition-all flex items-center gap-2 cursor-pointer shadow-lg shadow-sky-600/30">
                        <i class="fa-solid fa-cloud-arrow-up text-sm"></i>
                        <span class="text-sm tracking-wide">অডিট সংরক্ষণ করুন</span>
                    </button>
                </div>
            </div>

            <!-- Smart Memo Range Generator Modal / Drawer (Popup) -->
            <div id="dubai-memo-popup" class="hidden fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 font-bn">
                <div class="bg-slate-900 border border-slate-700 rounded-3xl w-full max-w-2xl shadow-2xl p-5 flex flex-col gap-4">
                    <div class="flex items-center justify-between pb-3 border-b border-slate-800">
                        <div class="flex items-center gap-2">
                            <i class="fa-solid fa-wand-magic-sparkles text-sky-400 text-lg"></i>
                            <h3 class="text-base font-bold text-white">স্মার্ট মেমো রেঞ্জ জেনারেটর (চলতি সপ্তাহ)</h3>
                        </div>
                        <button type="button" onclick="window.toggleDubaiMemoModal(false)" class="w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center cursor-pointer">
                            <i class="fa-solid fa-xmark text-sm"></i>
                        </button>
                    </div>

                    <!-- Range Inputs -->
                    <div class="bg-slate-950 p-3.5 rounded-2xl border border-slate-800 flex flex-wrap items-center gap-3">
                        <div class="flex items-center gap-1.5">
                            <span class="text-xs text-slate-400">শুরুর মেমো:</span>
                            <input type="number" id="modal-memo-start" placeholder="১০৩" class="w-20 bg-slate-900 border border-slate-700 rounded-lg px-2 py-1 text-xs text-white text-center font-bold">
                        </div>
                        <div class="flex items-center gap-1.5">
                            <span class="text-xs text-slate-400">শেষ মেমো:</span>
                            <input type="number" id="modal-memo-end" placeholder="১১২" class="w-20 bg-slate-900 border border-slate-700 rounded-lg px-2 py-1 text-xs text-white text-center font-bold">
                        </div>
                        <button type="button" id="btn-modal-gen-memo" class="px-3 py-1 bg-sky-600 hover:bg-sky-500 text-white rounded-lg text-xs font-bold flex items-center gap-1 cursor-pointer">
                            <i class="fa-solid fa-bolt text-xs"></i>
                            <span>রো জেনারেট করুন</span>
                        </button>
                    </div>

                    <!-- Memos List -->
                    <div id="modal-memo-list-container" class="max-h-[300px] overflow-y-auto custom-scrollbar flex flex-col gap-2 p-1">
                        <!-- Memos rendered dynamically -->
                    </div>

                    <!-- Footer -->
                    <div class="flex items-center justify-between pt-3 border-t border-slate-800">
                        <div class="text-xs text-slate-400">
                            মেমোর মোট যোগফল: <b id="modal-memo-total-amt" class="text-amber-400 text-sm font-mono">0 AED</b>
                        </div>
                        <button type="button" id="btn-modal-apply-memo" class="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold cursor-pointer flex items-center gap-1.5">
                            <i class="fa-solid fa-check text-xs"></i>
                            <span>রানিং ক্রয় কলামে বসান</span>
                        </button>
                    </div>
                </div>
            </div>

            <!-- Past Audits History Table (10 Columns with Personal Holdings) -->
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
                                <th class="p-2.5">কনটেইনার আইডি</th>
                                <th class="p-2.5 text-right text-emerald-400">টাকা পাঠানো</th>
                                <th class="p-2.5 text-right text-amber-400">মাল ক্রয়</th>
                                <th class="p-2.5 text-right text-red-400">মোট খরচ</th>
                                <th class="p-2.5 text-right text-cyan-400">মার্কেট AD</th>
                                <th class="p-2.5 text-right text-emerald-400">নগদ ক্যাশ</th>
                                <th class="p-2.5 text-right text-purple-400">হস্তান্তর / মেস</th>
                                <th class="p-2.5 text-right text-white">ক্যাশ সমন্বয় (+/-)</th>
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

export function getDynamicHoldingRowHtml(h, idx) {
    const amt = safeRound(parseAmount(h.amount));
    return `
        <div class="grid grid-cols-12 border-b border-slate-800 bg-slate-900/40 hover:bg-slate-800/30 transition-colors items-center">
            <div class="col-span-6 p-2.5 border-r border-slate-800 flex items-center justify-between gap-2">
                <input type="text" value="${h.desc || ''}" placeholder="বিবরণ (যেমন: আলতাফ + মেছ)" oninput="window.handleDubaiHoldingDescChange(${idx}, this.value)" class="bg-transparent border-b border-dashed border-slate-700 text-purple-300 text-xs font-bold focus:border-purple-400 outline-none flex-grow">
                <div class="flex items-center gap-1.5 shrink-0">
                    <span class="text-slate-500 text-[10px] whitespace-nowrap"><i class="fa-solid fa-minus text-purple-400 mr-0.5"></i> বিয়োগ</span>
                    <button type="button" onclick="window.removeDubaiHoldingRow(${idx})" class="w-5 h-5 rounded flex items-center justify-center text-slate-500 hover:text-red-400 hover:bg-red-500/10 cursor-pointer" title="মুছে ফেলুন">
                        <i class="fa-solid fa-xmark text-[10px]"></i>
                    </button>
                </div>
            </div>
            <div class="col-span-3 p-2.5 border-r border-slate-800 flex items-center justify-end gap-1.5 pr-2">
                <span class="text-[10px] text-slate-500 font-bold">AED:</span>
                <input type="text" value="${amt > 0 ? formatAmountWithComma(amt) : ''}" placeholder="০.০০" oninput="window.handleNumberInput(this); window.handleDubaiHoldingAmtChange(${idx}, this.value)" class="w-full max-w-[135px] bg-slate-950 border border-slate-700 rounded px-2 py-1 text-xs text-purple-300 font-mono text-right font-bold focus:border-purple-500 outline-none">
            </div>
            <div class="col-span-3 p-2.5 text-slate-400 text-xs text-right pr-3">
                ব্যক্তিগত হস্তান্তর / মেস
            </div>
        </div>
    `;
}

/**
 * Dubai Procurement - Bangladesh Landed Expenses UI Controller
 * Manages the live register for Register Page 0002, quick-entry dock, category filtering, and print engine.
 */
// ALLOW_LARGE_FILE (Corporate Bangladesh Expenses Register & Consignment CapEx UI Controller)

import Swal from 'sweetalert2';
import { DubaiBDExpenseDAO } from './dubai-bd-expense-dao.js';
import { DubaiRemittanceDAO } from './dubai-remittance-dao.js';
import { calculateBDExpenseSummary, calculateConsolidatedCapEx } from './dubai-bd-expense-calc.js';
import { calculateConsignmentSummary } from './dubai-remittance-calc.js';
import { printDubaiBDExpenseBook } from './dubai-bd-expense-print.js';
import { renderNothiSubBookHeader } from './dubai-subbook-header.js';
import {
    formatAmountWithComma,
    parseAmount,
    safeRound,
    getTodayLocalDateString,
    formatAppDate,
    toDBDate,
    escapeHTML,
    showToast,
    promptSecurityPin,
    ensureOnline
} from '../utils.js';

let activeConsignment = null;
let consignmentsList = [];
let bdExpensesList = [];
let dubaiRemittancesList = [];
let unsubscribeBDExpenses = null;
let unsubscribeConsignments = null;
let unsubscribeRemittances = null;
let editingExpenseId = null;

export function initDubaiBDExpenseModule(container) {
    if (!container) return;

    // Seed initial data if first time
    DubaiBDExpenseDAO.seedInitialDataIfNeeded().catch(e => console.error('BD expense seed error:', e));

    renderBDExpenseView(container);
    renderBDExpenseTable();
    updateBDExpenseKpis();
    setupBDExpenseListeners();
}

export function cleanupDubaiBDExpense() {
    if (unsubscribeBDExpenses) {
        unsubscribeBDExpenses();
        unsubscribeBDExpenses = null;
    }
    if (unsubscribeConsignments) {
        unsubscribeConsignments();
        unsubscribeConsignments = null;
    }
    if (unsubscribeRemittances) {
        unsubscribeRemittances();
        unsubscribeRemittances = null;
    }
}

function setupBDExpenseListeners() {
    unsubscribeConsignments = DubaiRemittanceDAO.listenConsignments(consignments => {
        consignmentsList = consignments;
        if (!activeConsignment && consignments.length > 0) {
            activeConsignment = consignments.find(c => c.status === 'active') || consignments[0];
        }
        updateConsignmentUI();
        listenToActiveBDExpenses();
    });

    // Also fetch Dubai remittances to keep the master combined CapEx dynamically synced
    const consId = activeConsignment?.id || 'CONSIGNMENT-01';
    unsubscribeRemittances = DubaiRemittanceDAO.listenRemittances(consId, items => {
        dubaiRemittancesList = items;
        updateBDExpenseKpis();
    });
}

function listenToActiveBDExpenses() {
    if (unsubscribeBDExpenses) {
        unsubscribeBDExpenses();
        unsubscribeBDExpenses = null;
    }

    const consId = activeConsignment?.id || 'CONSIGNMENT-01';
    unsubscribeBDExpenses = DubaiBDExpenseDAO.listenBDExpenses(consId, items => {
        bdExpensesList = items;
        renderBDExpenseTable();
        updateBDExpenseKpis();
    });
}

function renderBDExpenseView(container) {
    const actionButtonsHtml = `
        <button type="button" id="btn-print-bd-expense" class="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-sm">
            <i class="fa-solid fa-print text-slate-400 text-xs"></i>
            <span>A4 প্রিন্ট / ভাউচার</span>
        </button>
    `;

    container.innerHTML = `
        <div class="flex flex-col gap-4 font-bn w-full max-w-6xl mx-auto px-2 sm:px-4 pb-20">
            <!-- Top Unified 2-Tier Workspace Header -->
            ${renderNothiSubBookHeader({
                activeKey: 'bd-expense',
                title: 'বাংলাদেশ খরচ মাস্টার খাতা',
                subtitle: 'স্থানীয় মাল ক্রয়, গোডাউন ভাড়া, চালানি কেরিং ও আনুষঙ্গিক খরচ রেজিস্টার',
                pageBadge: 'খাতা পাতা: ০০০২',
                currencyBadge: 'BDT',
                iconClass: 'fa-solid fa-file-invoice-dollar',
                accentColor: 'amber',
                actionButtonsHtml
            })}

            <!-- Consignment Selector & Active Status -->
            <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-900/60 border border-slate-800/80 p-3.5 rounded-2xl">
                <div class="flex items-center gap-2.5 flex-grow">
                    <span class="text-xs font-bold text-slate-400 whitespace-nowrap"><i class="fa-solid fa-boxes-stacked text-amber-400 mr-1"></i>সেশন / খাতা:</span>
                    <select id="select-bd-consignment" class="bg-slate-950 border border-slate-700 rounded-xl px-3 py-1.5 text-xs text-white font-bold focus:border-amber-500 outline-none max-w-md w-full">
                        <option value="CONSIGNMENT-01">এমরান ব্যক্তিগত ১ম কনসোলমেন্ট, দেশীয় ল্যান্ডেড খরচ (চলমান)</option>
                    </select>
                </div>
                <div class="flex items-center gap-2">
                    <span class="px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center gap-1.5">
                        <i class="fa-solid fa-circle text-[7px] text-emerald-400"></i>
                        <span>চলমান রেজিস্টার (Active)</span>
                    </span>
                </div>
            </div>

            <!-- 3 Master KPI Summary Cards -->
            <div id="bd-expense-kpi-container" class="grid grid-cols-1 md:grid-cols-3 gap-3">
                <!-- Dynamically populated -->
            </div>

            <!-- Consolidated Master CapEx Banner (Dubai + BD) -->
            <div id="bd-consolidated-capex-container" class="bg-gradient-to-r from-slate-900 via-sky-950/40 to-slate-900 border border-sky-500/30 rounded-2xl p-4 shadow-xl">
                <!-- Dynamically populated -->
            </div>

            <!-- Quick Entry Dock -->
            <div class="bg-slate-900/80 border border-slate-700/80 rounded-2xl p-4 shadow-xl flex flex-col gap-3">
                <div class="flex items-center justify-between border-b border-slate-800 pb-2">
                    <div class="text-xs font-bold text-white flex items-center gap-2">
                        <i class="fa-solid fa-circle-plus text-emerald-400 text-sm"></i>
                        <span id="form-bd-expense-title">নতুন বাংলাদেশ খরচ এন্ট্রি যোগ করুন</span>
                    </div>
                    <span class="text-[11px] text-slate-400">বিল বা খরচের টাকা লিখলে নিচে স্বয়ংক্রিয় বাংলায় কথায় রূপান্তর হবে</span>
                </div>

                <form id="form-bd-expense" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 items-end">
                    <!-- Date -->
                    <div>
                        <label class="block text-[11px] font-bold text-slate-300 mb-1">তারিখ:</label>
                        <input type="text" id="bd-input-date" required class="datepicker w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white font-bold focus:border-amber-500 outline-none">
                    </div>

                    <!-- Vendor / Description -->
                    <div class="lg:col-span-1">
                        <label class="block text-[11px] font-bold text-slate-300 mb-1">বিবরণ / বিক্রেতা / মারফত:</label>
                        <input type="text" id="bd-input-desc" required placeholder="যেমন: সুমাইয়া মোটর হতে মাল ক্রয়" class="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white font-bold focus:border-amber-500 outline-none">
                    </div>

                    <!-- Category -->
                    <div>
                        <label class="block text-[11px] font-bold text-slate-300 mb-1">ক্যাটাগরি:</label>
                        <select id="bd-input-category" class="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white font-bold focus:border-amber-500 outline-none">
                            <option value="স্থানীয় মাল ক্রয়">স্থানীয় মাল ক্রয়</option>
                            <option value="চালানি কেরিং">চালানি কেরিং</option>
                            <option value="গোডাউন খরচ">গোডাউন খরচ</option>
                            <option value="কন্টেইনার খরচ">কন্টেইনার খরচ</option>
                            <option value="শিপিং খরচ">শিপিং খরচ</option>
                            <option value="অন্যান্য খরচ">অন্যান্য খরচ</option>
                        </select>
                    </div>

                    <!-- Memo / Chalan -->
                    <div>
                        <label class="block text-[11px] font-bold text-slate-300 mb-1">মেমো / চালান নং:</label>
                        <input type="text" id="bd-input-memo" placeholder="যেমন: মেমো-১০৪৮" class="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white font-bold focus:border-amber-500 outline-none">
                    </div>

                    <!-- Amount BDT -->
                    <div>
                        <label class="block text-[11px] font-bold text-red-400 mb-1">খরচ / বিল (BDT / TK):</label>
                        <input type="text" id="bd-input-amount" required placeholder="0.00" oninput="window.handleNumberInput(this); window.updateLiveWords(this, 'bd-live-words');" class="w-full bg-slate-950 border border-red-500/60 rounded-xl px-3 py-2 text-xs text-red-400 font-mono font-black focus:border-red-400 outline-none text-right">
                    </div>

                    <!-- Submit & Actions -->
                    <div class="sm:col-span-2 lg:col-span-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pt-2">
                        <div class="text-[11px] text-slate-400 flex items-center gap-1.5">
                            <i class="fa-solid fa-comment-dollar text-slate-400"></i>
                            <span class="text-slate-400">কথায়:</span>
                            <span id="bd-live-words" class="text-amber-400 font-bold">শূন্য টাকা মাত্র</span>
                        </div>

                        <div class="flex items-center gap-2 self-end">
                            <button type="button" id="btn-cancel-bd-edit" class="hidden px-3.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-bold transition-all">বাতিল</button>
                            <button type="submit" id="btn-save-bd-expense" class="px-5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shadow-lg shadow-emerald-950/40 cursor-pointer">
                                <i class="fa-solid fa-check text-xs"></i>
                                <span id="btn-save-bd-text">এন্ট্রি যোগ করুন</span>
                            </button>
                        </div>
                    </div>
                </form>
            </div>

            <!-- Filter & Search Toolbar -->
            <div class="flex flex-col sm:flex-row items-center justify-between gap-3 bg-slate-900/60 border border-slate-800/80 p-3 rounded-2xl">
                <div class="text-xs font-bold text-slate-200 flex items-center gap-2">
                    <i class="fa-solid fa-list-check text-sky-400"></i>
                    <span>বাংলাদেশ খরচ রেজিস্টার তালিকা</span>
                    <span id="bd-badge-count" class="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-800 text-slate-300 border border-slate-700">০টি</span>
                </div>

                <div class="flex items-center gap-2 w-full sm:w-auto">
                    <select id="bd-filter-category" class="bg-slate-950 border border-slate-700 rounded-xl px-3 py-1.5 text-xs text-slate-300 outline-none">
                        <option value="all">সকল ক্যাটাগরি</option>
                        <option value="স্থানীয় মাল ক্রয়">স্থানীয় মাল ক্রয়</option>
                        <option value="চালানি কেরিং">চালানি কেরিং</option>
                        <option value="গোডাউন খরচ">গোডাউন খরচ</option>
                        <option value="কন্টেইনার খরচ">কন্টেইনার খরচ</option>
                        <option value="শিপিং খরচ">শিপিং খরচ</option>
                    </select>
                    <div class="relative w-full sm:w-64">
                        <input type="text" id="bd-search-input" placeholder="বিক্রেতা, মেমো বা বিবরণ খুঁজুন..." class="w-full bg-slate-950 border border-slate-700 rounded-xl pl-8 pr-3 py-1.5 text-xs text-white placeholder-slate-500 focus:border-amber-500 outline-none">
                        <i class="fa-solid fa-magnifying-glass absolute left-2.5 top-2.5 text-slate-500 text-xs"></i>
                    </div>
                </div>
            </div>

            <!-- Expenses Table Container -->
            <div class="overflow-x-auto bg-slate-900/80 border border-slate-800 rounded-2xl shadow-xl">
                <table class="w-full text-left border-collapse">
                    <thead>
                        <tr class="bg-slate-950/80 border-b border-slate-800 text-[11px] font-bold text-slate-400">
                            <th class="p-3 text-center w-12 border-r border-slate-800">#</th>
                            <th class="p-3 text-center w-28 border-r border-slate-800">তারিখ</th>
                            <th class="p-3 text-left border-r border-slate-800">বিবরণ / বিক্রেতা / মারফত</th>
                            <th class="p-3 text-left w-32 border-r border-slate-800">ক্যাটাগরি</th>
                            <th class="p-3 text-center w-28 border-r border-slate-800">মেমো / চালান</th>
                            <th class="p-3 text-right w-36 border-r border-slate-800 text-red-400">টাকা (BDT / TK)</th>
                            <th class="p-3 text-center w-28 border-r border-slate-800">স্ট্যাটাস</th>
                            <th class="p-3 text-center w-20">অ্যাকশন</th>
                        </tr>
                    </thead>
                    <tbody id="bd-expenses-table-body" class="divide-y divide-slate-800/60 text-xs text-slate-300">
                        <tr><td colspan="8" class="p-8 text-center text-slate-500">লোড করা হচ্ছে...</td></tr>
                    </tbody>
                </table>
            </div>
        </div>
    `;

    bindBDExpenseEvents();
}

function bindBDExpenseEvents() {
    const bind = (id, fn) => { const el = document.getElementById(id); if (el) el.onclick = fn; };

    bind('btn-print-bd-expense', () => {
        const dubaiSummary = calculateConsignmentSummary(activeConsignment, dubaiRemittancesList);
        printDubaiBDExpenseBook(activeConsignment, bdExpensesList, dubaiSummary);
    });

    const form = document.getElementById('form-bd-expense');
    if (form) form.onsubmit = onSaveBDExpenseSubmit;

    const cancelBtn = document.getElementById('btn-cancel-bd-edit');
    if (cancelBtn) cancelBtn.onclick = resetBDExpenseForm;

    const searchInput = document.getElementById('bd-search-input');
    if (searchInput) searchInput.oninput = renderBDExpenseTable;

    const filterCat = document.getElementById('bd-filter-category');
    if (filterCat) filterCat.onchange = renderBDExpenseTable;

    const dateInp = document.getElementById('bd-input-date');
    if (dateInp) {
        dateInp.value = getTodayLocalDateString();
    }
}

function updateConsignmentUI() {
    const select = document.getElementById('select-bd-consignment');
    if (select && consignmentsList.length > 0) {
        select.innerHTML = consignmentsList.map(c => `
            <option value="${c.id}" ${c.id === activeConsignment?.id ? 'selected' : ''}>${escapeHTML(c.name || c.id)}</option>
        `).join('');
    }
}

function updateBDExpenseKpis() {
    const kpiContainer = document.getElementById('bd-expense-kpi-container');
    const capexContainer = document.getElementById('bd-consolidated-capex-container');
    if (!kpiContainer) return;

    const summary = calculateBDExpenseSummary(activeConsignment, bdExpensesList);
    const dubaiSummary = calculateConsignmentSummary(activeConsignment, dubaiRemittancesList);
    const capex = calculateConsolidatedCapEx(dubaiSummary, summary);

    // 1. Render 3 Master BD KPI Cards
    kpiContainer.innerHTML = `
        <!-- Card 1: B/F -->
        <div class="bg-gradient-to-br from-slate-900/90 to-sky-950/40 border border-sky-500/20 p-4 rounded-2xl flex flex-col justify-between shadow-lg">
            <div class="flex items-center justify-between text-slate-400 text-xs mb-2">
                <span class="font-bold flex items-center gap-1.5"><i class="fa-solid fa-clock-rotate-left text-sky-400"></i>১. সাবেক ব্যালেন্স (B/F)</span>
                <span class="px-2 py-0.5 rounded text-[10px] font-bold bg-sky-500/10 text-sky-400 border border-sky-500/20">পূর্ববর্তী সেশন</span>
            </div>
            <div class="text-xl sm:text-2xl font-mono font-black text-sky-400 tracking-tight">৳ ${formatAmountWithComma(summary.bfAmount)}</div>
            <div class="mt-2 pt-2 border-t border-slate-800/80 text-[11px] text-slate-400 flex items-center justify-between">
                <span>সময়কাল: ০১/১১/২০২৫ হতে ০৬/০৮/২০২৬</span>
                <span class="font-bold text-sky-300">প্রারম্ভিক ব্যালেন্স</span>
            </div>
        </div>

        <!-- Card 2: Running Expenses -->
        <div class="bg-gradient-to-br from-slate-900/90 to-red-950/40 border border-red-500/20 p-4 rounded-2xl flex flex-col justify-between shadow-lg">
            <div class="flex items-center justify-between text-slate-400 text-xs mb-2">
                <span class="font-bold flex items-center gap-1.5"><i class="fa-solid fa-receipt text-red-400"></i>২. রানিং খাতার খরচ (${summary.count} কিস্তি)</span>
                <span class="px-2 py-0.5 rounded text-[10px] font-bold bg-red-500/10 text-red-400 border border-red-500/20">চলমান খাতা</span>
            </div>
            <div class="text-xl sm:text-2xl font-mono font-black text-red-400 tracking-tight">৳ ${formatAmountWithComma(summary.runningTotal)}</div>
            <div class="mt-2 pt-2 border-t border-slate-800/80 text-[11px] text-slate-400 flex items-center justify-between">
                <span>সময়কাল: ২৯/০৮/২০২৬ হতে ০৯/১১/২০২৬</span>
                <span class="font-bold text-red-300">${summary.count} টি ভাউচার পরিশোধিত</span>
            </div>
        </div>

        <!-- Card 3: Grand Total BD Expense -->
        <div class="bg-gradient-to-br from-slate-900/90 to-amber-950/40 border border-amber-500/30 p-4 rounded-2xl flex flex-col justify-between shadow-lg">
            <div class="flex items-center justify-between text-slate-400 text-xs mb-2">
                <span class="font-bold flex items-center gap-1.5"><i class="fa-solid fa-calculator text-amber-400"></i>৩. সর্বমোট বাংলাদেশ খরচ</span>
                <span class="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/20 text-amber-400 border border-amber-500/30">সর্বসাকুল্যে মোট</span>
            </div>
            <div class="text-xl sm:text-2xl font-mono font-black text-amber-400 tracking-tight">৳ ${formatAmountWithComma(summary.grandTotal)}</div>
            <div class="mt-2 pt-2 border-t border-slate-800/80 text-[11px] text-slate-400 flex items-center justify-between">
                <span>০১/১১/২০২৫ হতে ০৯/১১/২০২৬ পর্যন্ত</span>
                <span class="font-bold text-amber-300">B/F + রানিং খাতা</span>
            </div>
        </div>
    `;

    // 2. Render Consolidated CapEx Box
    if (capexContainer) {
        capexContainer.innerHTML = `
            <div class="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-sky-800/40 pb-3 mb-3">
                <div class="flex items-center gap-2">
                    <span class="w-8 h-8 rounded-xl bg-sky-500/20 border border-sky-400/30 flex items-center justify-center text-sky-400 text-sm">
                        <i class="fa-solid fa-chart-pie"></i>
                    </span>
                    <div>
                        <div class="text-xs sm:text-sm font-black text-white">১ম কনসোলমেন্টের সামগ্রিক পুঁজী ও হিসাব (Consolidated Master CapEx)</div>
                        <div class="text-[11px] text-slate-400">দুবাই বৈদেশিক ক্রয় + বাংলাদেশ ল্যান্ডেড খরচের একীভূত পুঁজী কাঠামো</div>
                    </div>
                </div>
                <div class="flex items-center gap-2 bg-slate-950/80 px-3.5 py-1.5 rounded-xl border border-sky-500/30">
                    <span class="text-[11px] text-slate-400 font-bold">সর্বমোট প্রজেক্ট ক্যাপিটাল:</span>
                    <span class="text-sm sm:text-base font-mono font-black text-emerald-400">৳ ${formatAmountWithComma(capex.totalCapExBDT)}</span>
                </div>
            </div>

            <div class="grid grid-cols-1 sm:grid-cols-3 gap-3 text-center">
                <div class="bg-slate-950/60 p-2.5 rounded-xl border border-slate-800">
                    <div class="text-[11px] text-slate-400 font-bold mb-1">দুবাই ক্রয় পার্ট (পাতা ০০০১)</div>
                    <div class="text-sm font-mono font-black text-emerald-400">${formatAmountWithComma(capex.dubaiAED)} AED</div>
                    <div class="text-xs font-mono font-bold text-slate-300">৳ ${formatAmountWithComma(capex.dubaiBDT)} <span class="text-[10px] text-slate-400">(${capex.dubaiSharePct}%)</span></div>
                </div>

                <div class="bg-slate-950/60 p-2.5 rounded-xl border border-slate-800">
                    <div class="text-[11px] text-slate-400 font-bold mb-1">বাংলাদেশ খরচ পার্ট (পাতা ০০০২)</div>
                    <div class="text-sm font-mono font-black text-red-400">৳ ${formatAmountWithComma(capex.bdBDT)}</div>
                    <div class="text-xs text-slate-400">${summary.count} কিস্তি + সাবেক <span class="font-bold text-slate-300">(${capex.bdSharePct}%)</span></div>
                </div>

                <div class="bg-slate-950/60 p-2.5 rounded-xl border border-emerald-500/30">
                    <div class="text-[11px] text-emerald-400 font-bold mb-1">১ম কনসোলমেন্ট সর্বমোট পুঁজী</div>
                    <div class="text-base font-mono font-black text-emerald-300">৳ ${formatAmountWithComma(capex.totalCapExBDT)}</div>
                    <div class="text-[10px] text-slate-400">দুবাই + বাংলাদেশ একীভূত (১০০%)</div>
                </div>
            </div>
        `;
    }
}

function renderBDExpenseTable() {
    const tbody = document.getElementById('bd-expenses-table-body');
    const badgeCount = document.getElementById('bd-badge-count');
    if (!tbody) return;

    const searchTerm = (document.getElementById('bd-search-input')?.value || '').trim().toLowerCase();
    const filterCat = document.getElementById('bd-filter-category')?.value || 'all';

    let filtered = bdExpensesList.filter(item => {
        if (filterCat !== 'all' && item.category !== filterCat) return false;
        if (!searchTerm) return true;
        const desc = (item.description || item.vendor || '').toLowerCase();
        const memo = (item.memo || '').toLowerCase();
        const date = (item.date || '').toLowerCase();
        const cat = (item.category || '').toLowerCase();
        return desc.includes(searchTerm) || memo.includes(searchTerm) || date.includes(searchTerm) || cat.includes(searchTerm);
    });

    if (badgeCount) badgeCount.innerText = `${filtered.length} টি`;

    const summary = calculateBDExpenseSummary(activeConsignment, bdExpensesList);

    // B/F Row
    const bfRowHtml = `
        <tr class="bg-sky-950/20 hover:bg-sky-950/30 transition-colors font-bold border-b border-sky-800/40">
            <td class="p-3 text-center border-r border-slate-800 text-sky-400">০</td>
            <td class="p-3 text-center border-r border-slate-800 font-mono text-sky-300 whitespace-nowrap">০১/১১/২৫ - ০৬/০৮/২৬</td>
            <td class="p-3 border-r border-slate-800 text-sky-200">
                <div class="font-bold">B/F (পূর্ববর্তী স্থানান্তরিত কিউমুলেটিভ ব্যালেন্স)</div>
                <div class="text-[10px] text-slate-400">পূর্ববর্তী সেশনের সর্বমোট জমা খরচ স্থিতি</div>
            </td>
            <td class="p-3 border-r border-slate-800">
                <span class="px-2 py-0.5 rounded text-[10px] font-bold bg-sky-500/10 text-sky-400 border border-sky-500/20">প্রারম্ভিক ব্যালেন্স</span>
            </td>
            <td class="p-3 text-center border-r border-slate-800 text-slate-400 font-mono">—</td>
            <td class="p-3 text-right border-r border-slate-800 font-mono font-black text-sky-400 whitespace-nowrap">৳ ${formatAmountWithComma(summary.bfAmount)}</td>
            <td class="p-3 text-center border-r border-slate-800">
                <span class="px-2 py-0.5 rounded text-[10px] font-bold bg-sky-500/20 text-sky-300">সাবেক ব্যালেন্স শুরু</span>
            </td>
            <td class="p-3 text-center text-slate-600">—</td>
        </tr>
    `;

    if (filtered.length === 0 && searchTerm) {
        tbody.innerHTML = `
            ${bfRowHtml}
            <tr><td colspan="8" class="p-8 text-center text-slate-500">কোনো এন্ট্রি পাওয়া যায়নি</td></tr>
        `;
        return;
    }

    const rowsHtml = filtered.map((item, idx) => {
        const appDt = formatAppDate(item.date);
        const amtStr = formatAmountWithComma(item.amount);

        return `
            <tr class="hover:bg-slate-800/40 transition-colors">
                <td class="p-3 text-center border-r border-slate-800 text-slate-500 font-bold">${idx + 1}</td>
                <td class="p-3 text-center border-r border-slate-800 font-mono text-slate-300 whitespace-nowrap">${appDt}</td>
                <td class="p-3 border-r border-slate-800 font-bold text-white">${escapeHTML(item.description || item.vendor || '—')}</td>
                <td class="p-3 border-r border-slate-800">
                    <span class="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-800 text-slate-300 border border-slate-700">${escapeHTML(item.category || '—')}</span>
                </td>
                <td class="p-3 text-center border-r border-slate-800 font-mono text-slate-400">${escapeHTML(item.memo || '—')}</td>
                <td class="p-3 text-right border-r border-slate-800 font-mono font-bold text-red-400 whitespace-nowrap">৳ ${amtStr}</td>
                <td class="p-3 text-center border-r border-slate-800">
                    <span class="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">${escapeHTML(item.status || 'চূড়ান্ত পরিশোধিত')}</span>
                </td>
                <td class="p-3 text-center">
                    <div class="flex items-center justify-center gap-1.5">
                        <button type="button" onclick="window.editBDExpenseEntry('${item.id}')" class="p-1 hover:text-sky-400 text-slate-400 transition-colors" title="সংশোধন করুন">
                            <i class="fa-solid fa-pen-to-square text-xs"></i>
                        </button>
                        <button type="button" onclick="window.deleteBDExpenseEntry('${item.id}')" class="p-1 hover:text-red-400 text-slate-400 transition-colors" title="মুছে ফেলুন">
                            <i class="fa-solid fa-trash text-xs"></i>
                        </button>
                    </div>
                </td>
            </tr>
        `;
    }).join('');

    tbody.innerHTML = `
        ${bfRowHtml}
        ${rowsHtml}

        <!-- Running Subtotal Row -->
        <tr class="bg-slate-950/80 border-t-2 border-slate-700 font-bold text-xs text-slate-300">
            <td colspan="5" class="p-3 text-right border-r border-slate-800 font-bold">চলমান খাতার উপ-মোট (${summary.count} টি কিস্তি):</td>
            <td class="p-3 text-right font-mono font-black text-red-400 border-r border-slate-800">৳ ${formatAmountWithComma(summary.runningTotal)}</td>
            <td colspan="2" class="p-3 text-center font-bold text-slate-400">উপ-মোট</td>
        </tr>

        <!-- Grand Total Row -->
        <tr class="bg-amber-950/30 border-t-2 border-b-2 border-amber-500 font-black text-xs text-white">
            <td colspan="5" class="p-3.5 text-right border-r border-slate-800 text-sm">সর্বমোট বাংলাদেশ খরচ (B/F সাবেক + রানিং খাতা):</td>
            <td class="p-3.5 text-right font-mono font-black text-amber-400 border-r border-slate-800 text-sm">৳ ${formatAmountWithComma(summary.grandTotal)}</td>
            <td colspan="2" class="p-3.5 text-center"><span class="px-2.5 py-1 rounded text-xs font-black bg-amber-600 text-white shadow-md">সর্বমোট</span></td>
        </tr>
    `;

    // Global action helpers
    window.editBDExpenseEntry = (id) => {
        const item = bdExpensesList.find(b => b.id === id);
        if (!item) return;
        editingExpenseId = id;
        const dateInp = document.getElementById('bd-input-date');
        const appDt = formatAppDate(item.date);
        if (dateInp) {
            dateInp.value = appDt;
            if (dateInp._flatpickr) {
                dateInp._flatpickr.setDate(appDt, false);
            }
        }
        document.getElementById('bd-input-desc').value = item.description || item.vendor || '';
        document.getElementById('bd-input-category').value = item.category || 'স্থানীয় মাল ক্রয়';
        document.getElementById('bd-input-memo').value = item.memo || '';
        
        const amtInp = document.getElementById('bd-input-amount');
        amtInp.value = formatAmountWithComma(item.amount);
        window.updateLiveWords(amtInp, 'bd-live-words');

        document.getElementById('form-bd-expense-title').innerText = 'বাংলাদেশ খরচ এন্ট্রি সংশোধন করুন';
        document.getElementById('btn-save-bd-text').innerText = 'আপডেট করুন';
        document.getElementById('btn-cancel-bd-edit').classList.remove('hidden');

        document.getElementById('form-bd-expense').scrollIntoView({ behavior: 'smooth' });
    };

    window.deleteBDExpenseEntry = async (id) => {
        ensureOnline();
        const pinPassed = await promptSecurityPin();
        if (!pinPassed) return;

        const res = await Swal.fire({
            title: 'এন্ট্রি মুছে ফেলতে চান?',
            text: 'এই খরচ এন্ট্রিটি তালিকা থেকে মুছে ফেলা হবে।',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'হ্যাঁ, মুছুন',
            cancelButtonText: 'বাতিল',
            confirmButtonColor: '#dc2626',
            cancelButtonColor: '#334155'
        });

        if (res.isConfirmed) {
            try {
                await DubaiBDExpenseDAO.deleteBDExpense(id);
                showToast('এন্ট্রি সফলভাবে মুছে ফেলা হয়েছে', 'success');
            } catch (err) {
                console.error('Delete expense error:', err);
                showToast('মুছে ফেলতে সমস্যা হয়েছে', 'error');
            }
        }
    };
}

async function onSaveBDExpenseSubmit(e) {
    e.preventDefault();
    ensureOnline();

    const dateVal = document.getElementById('bd-input-date').value.trim();
    const descVal = document.getElementById('bd-input-desc').value.trim();
    const catVal = document.getElementById('bd-input-category').value.trim();
    const memoVal = document.getElementById('bd-input-memo').value.trim();
    const amtVal = parseAmount(document.getElementById('bd-input-amount').value);

    if (!dateVal || !descVal || amtVal <= 0) {
        showToast('তারিখ, বিবরণ এবং সঠিক টাকার অঙ্ক লিখুন', 'warning');
        return;
    }

    const payload = {
        consignmentId: activeConsignment?.id || 'CONSIGNMENT-01',
        date: toDBDate(dateVal),
        description: descVal,
        category: catVal,
        memo: memoVal || '—',
        amount: amtVal,
        status: 'চূড়ান্ত পরিশোধিত'
    };

    if (editingExpenseId) {
        payload.id = editingExpenseId;
    }

    try {
        await DubaiBDExpenseDAO.saveBDExpense(payload);
        showToast(editingExpenseId ? 'এন্ট্রি সফলভাবে আপডেট হয়েছে' : 'নতুন বাংলাদেশ খরচ এন্ট্রি যুক্ত হয়েছে', 'success');
        resetBDExpenseForm();
    } catch (err) {
        console.error('Save BD expense error:', err);
        showToast('সংরক্ষণ করতে সমস্যা হয়েছে', 'error');
    }
}

function resetBDExpenseForm() {
    editingExpenseId = null;
    document.getElementById('form-bd-expense')?.reset();
    const dateInp = document.getElementById('bd-input-date');
    const todayStr = getTodayLocalDateString();
    if (dateInp) {
        dateInp.value = todayStr;
        if (dateInp._flatpickr) {
            dateInp._flatpickr.setDate(todayStr, false);
        }
    }
    document.getElementById('form-bd-expense-title').innerText = 'নতুন বাংলাদেশ খরচ এন্ট্রি যোগ করুন';
    document.getElementById('btn-save-bd-text').innerText = 'এন্ট্রি যোগ করুন';
    document.getElementById('btn-cancel-bd-edit').classList.add('hidden');
    document.getElementById('bd-live-words').innerText = 'শূন্য টাকা মাত্র';
}

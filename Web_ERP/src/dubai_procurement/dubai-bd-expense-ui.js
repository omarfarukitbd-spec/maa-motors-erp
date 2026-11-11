/**
 * Dubai Procurement - Bangladesh Landed Expenses UI Controller
 * Manages the live register for Register Page 0002, quick-entry dock, category filtering, and print engine.
 */
// ALLOW_LARGE_FILE (Corporate Bangladesh Expenses Register & Consignment CapEx UI Controller)

import Swal from 'sweetalert2';
import { DubaiBDExpenseDAO } from './dubai-bd-expense-dao.js';
import { DubaiRemittanceDAO } from './dubai-remittance-dao.js';
import { calculateBDExpenseSummary } from './dubai-bd-expense-calc.js';
import { printDubaiBDExpenseBook } from './dubai-bd-expense-print.js';
import { renderNothiSubBookHeader } from './dubai-subbook-header.js';
import { mountNothiBannerBar } from './dubai-banner-editor-modal.js';
import {
    exportNothiRowsToExcel,
    confirmNothiAction,
    renderNothiMasterLinkPill
} from './dubai-nothi-helpers.js';
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
let activeListenersConsId = null;
let unsubscribeBDExpenses = null;
let unsubscribeConsignments = null;
let editingExpenseId = null;

export function initDubaiBDExpenseModule(container) {
    if (!container) return;

    activeListenersConsId = null;
    DubaiBDExpenseDAO.seedInitialDataIfNeeded().catch(e => console.error('BD expense seed error:', e));

    renderBDExpenseView(container);
    renderBDExpenseTable();
    updateBDExpenseKpis();
    setupBDExpenseListeners();
}

export function cleanupDubaiBDExpense() {
    activeListenersConsId = null;
    if (unsubscribeBDExpenses) {
        unsubscribeBDExpenses();
        unsubscribeBDExpenses = null;
    }
    if (unsubscribeConsignments) {
        unsubscribeConsignments();
        unsubscribeConsignments = null;
    }
}

function setupBDExpenseListeners() {
    unsubscribeConsignments = DubaiRemittanceDAO.listenConsignments(consignments => {
        consignmentsList = consignments;
        if (consignments.length > 0) {
            if (activeConsignment?.id) {
                activeConsignment = consignments.find(c => c.id === activeConsignment.id)
                    || consignments.find(c => c.status === 'active')
                    || consignments[0];
            } else {
                activeConsignment = consignments.find(c => c.status === 'active') || consignments[0];
            }
        }
        updateConsignmentUI();
        updateBDExpenseKpis();
        const consId = activeConsignment?.id || 'CONSIGNMENT-01';
        if (consId !== activeListenersConsId) {
            listenToActiveConsignmentData();
        }
    });

    listenToActiveConsignmentData();
}

function listenToActiveConsignmentData() {
    if (unsubscribeBDExpenses) {
        unsubscribeBDExpenses();
        unsubscribeBDExpenses = null;
    }

    const consId = activeConsignment?.id || 'CONSIGNMENT-01';
    activeListenersConsId = consId;
    unsubscribeBDExpenses = DubaiBDExpenseDAO.listenBDExpenses(consId, items => {
        bdExpensesList = items;
        renderBDExpenseTable();
        updateBDExpenseKpis();
    });
}

function renderBDExpenseView(container) {
    const actionButtonsHtml = `
        ${renderNothiMasterLinkPill()}
        <button type="button" id="btn-export-bd-excel" class="px-3.5 py-2 bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 border border-emerald-500/35 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-sm">
            <i class="fa-solid fa-file-excel text-emerald-400 text-xs"></i>
            <span>এক্সেল</span>
        </button>
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

            <!-- Per-Section Consignment Selector & Customizable Print Banner -->
            <div id="bd-expense-banner-slot"></div>

            <!-- 3 Master KPI Summary Cards -->
            <div id="bd-expense-kpi-container" class="grid grid-cols-1 md:grid-cols-3 gap-3">
                <!-- Dynamically populated -->
            </div>

            <!-- Quick Entry Dock -->
            <div data-perm="manageNothiEntries" class="bg-slate-900/80 border border-slate-700/80 rounded-2xl p-4 shadow-xl flex flex-col gap-3">
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
                        <option value="অন্যান্য খরচ">অন্যান্য খরচ</option>
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
    updateConsignmentUI();
}

function bindBDExpenseEvents() {
    const bind = (id, fn) => { const el = document.getElementById(id); if (el) el.onclick = fn; };

    bind('btn-print-bd-expense', () => {
        printDubaiBDExpenseBook(activeConsignment, bdExpensesList);
    });

    bind('btn-export-bd-excel', () => {
        const headers = ['নং', 'তারিখ', 'বিবরণ / বিক্রেতা', 'ক্যাটাগরি', 'মেমো / চালান', 'টাকা (BDT)', 'স্ট্যাটাস'];
        const summary = calculateBDExpenseSummary(activeConsignment, bdExpensesList);
        const rows = [
            ['০', summary.bfStartDate ? formatAppDate(summary.bfStartDate) : 'প্রারম্ভিক', 'B/F (পূর্ববর্তী স্থানান্তরিত ব্যালেন্স)', 'প্রারম্ভিক ব্যালেন্স', '—', summary.bfAmount, 'সাবেক ব্যালেন্স']
        ];
        bdExpensesList.forEach((b, i) => {
            rows.push([
                i + 1,
                formatAppDate(b.date),
                b.description || b.vendor || '—',
                b.category || 'অন্যান্য খরচ',
                b.memo || '—',
                safeRound(Number(b.amount) || 0),
                b.status || 'চূড়ান্ত পরিশোধিত'
            ]);
        });
        exportNothiRowsToExcel({
            sheetName: 'Nothi_0002_BD_Expense',
            headers,
            rows,
            filename: `Nothi_0002_BD_Expense_${activeConsignment?.id || 'CONSIGNMENT'}.xlsx`
        });
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
    mountNothiBannerBar({
        slotId: 'bd-expense-banner-slot',
        sectionKey: 'bd-expense',
        getConsignment: () => activeConsignment,
        getAllConsignments: () => consignmentsList,
        selectId: 'select-bd-consignment',
        showSelector: true,
        onConsignmentChange: (selectedId) => {
            activeConsignment = consignmentsList.find(c => c.id === selectedId) || activeConsignment;
            updateConsignmentUI();
            listenToActiveConsignmentData();
        }
    });
}

function updateBDExpenseKpis() {
    const kpiContainer = document.getElementById('bd-expense-kpi-container');
    if (!kpiContainer) return;

    const summary = calculateBDExpenseSummary(activeConsignment, bdExpensesList);
    const bfPeriodLabel = (summary.bfStartDate && summary.bfEndDate)
        ? `${formatAppDate(summary.bfStartDate)} হতে ${formatAppDate(summary.bfEndDate)}`
        : 'প্রারম্ভিক সেশন';

    // Render 3 Master BD KPI Cards strictly scoped to Book 0002
    kpiContainer.innerHTML = `
        <!-- Card 1: B/F -->
        <div class="bg-gradient-to-br from-slate-900/90 to-sky-950/40 border border-sky-500/20 p-4 rounded-2xl flex flex-col justify-between shadow-lg">
            <div class="flex items-center justify-between text-slate-400 text-xs mb-2">
                <span class="font-bold flex items-center gap-1.5"><i class="fa-solid fa-clock-rotate-left text-sky-400"></i>১. সাবেক ব্যালেন্স (B/F)</span>
                <button type="button" data-perm="manageNothiEntries" onclick="window.editBDBfBalance()" class="px-2 py-0.5 rounded text-[10px] font-bold bg-sky-500/15 hover:bg-sky-500/30 text-sky-300 border border-sky-500/30 cursor-pointer transition-all">
                    <i class="fa-solid fa-pen text-[9px] mr-1"></i>B/F এডিট
                </button>
            </div>
            <div class="text-xl sm:text-2xl font-mono font-black text-sky-400 tracking-tight">৳ ${formatAmountWithComma(summary.bfAmount)}</div>
            <div class="mt-2 pt-2 border-t border-slate-800/80 text-[11px] text-slate-400 flex items-center justify-between">
                <span>সময়কাল: ${escapeHTML(bfPeriodLabel)}</span>
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
                <span>সময়কাল: ${escapeHTML(summary.runningDates || 'কোনো রানিং এন্ট্রি নেই')}</span>
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
                <span>${escapeHTML(summary.overallDates || 'চলমান সেশন')}</span>
                <span class="font-bold text-amber-300">B/F + রানিং খাতা</span>
            </div>
        </div>
    `;
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

    const bfRowDates = (summary.bfStartDate && summary.bfEndDate)
        ? `${formatAppDate(summary.bfStartDate)} - ${formatAppDate(summary.bfEndDate)}`
        : (summary.bfStartDate ? formatAppDate(summary.bfStartDate) : 'প্রারম্ভিক ব্যালেন্স');

    // B/F Row
    const bfRowHtml = `
        <tr class="bg-sky-950/20 hover:bg-sky-950/30 transition-colors font-bold border-b border-sky-800/40">
            <td class="p-3 text-center border-r border-slate-800 text-sky-400">০</td>
            <td class="p-3 text-center border-r border-slate-800 font-mono text-sky-300 whitespace-nowrap">${escapeHTML(bfRowDates)}</td>
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
            <td class="p-3 text-center">
                <button type="button" data-perm="manageNothiEntries" onclick="window.editBDBfBalance()" class="p-1 hover:text-sky-300 text-sky-400 transition-colors cursor-pointer" title="B/F ব্যালেন্স সংশোধন করুন">
                    <i class="fa-solid fa-pen-to-square text-xs"></i>
                </button>
            </td>
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
                        <button type="button" data-perm="manageNothiEntries" onclick="window.editBDExpenseEntry('${item.id}')" class="p-1 hover:text-sky-400 text-slate-400 transition-colors" title="সংশোধন করুন">
                            <i class="fa-solid fa-pen-to-square text-xs"></i>
                        </button>
                        <button type="button" data-perm="deleteNothiEntries" onclick="window.deleteBDExpenseEntry('${item.id}')" class="p-1 hover:text-red-400 text-slate-400 transition-colors" title="মুছে ফেলুন">
                            <i class="fa-solid fa-trash text-xs"></i>
                        </button>
                    </div>
                </td>
            </tr>
        `;
    }).join('');

    const isFiltered = filtered.length !== bdExpensesList.length;
    const filteredTotal = safeRound(filtered.reduce((acc, item) => safeRound(acc + (Number(item.amount) || 0)), 0));
    const filteredSubtotalRow = isFiltered ? `
        <tr class="bg-amber-950/20 border-t border-amber-500/40 font-black text-xs text-amber-200">
            <td colspan="5" class="p-3 text-right border-r border-slate-800">ফিল্টারকৃত উপ-মোট (${filtered.length} টি এন্ট্রি):</td>
            <td class="p-3 text-right font-mono text-amber-300 border-r border-slate-800">৳ ${formatAmountWithComma(filteredTotal)}</td>
            <td colspan="2" class="p-3 text-center"><span class="px-2 py-0.5 rounded text-[10px] bg-amber-600/30 text-amber-200">ফিল্টার</span></td>
        </tr>
    ` : '';

    tbody.innerHTML = `
        ${bfRowHtml}
        ${rowsHtml}
        ${filteredSubtotalRow}

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

    window.editBDBfBalance = async () => {
        if (!ensureOnline('B/F ব্যালেন্স সংশোধন')) return;
        const pinOk = await promptSecurityPin();
        if (!pinOk) return;

        const summary = calculateBDExpenseSummary(activeConsignment, bdExpensesList);
        const startVal = summary.bfStartDate ? formatAppDate(summary.bfStartDate) : '';
        const endVal = summary.bfEndDate ? formatAppDate(summary.bfEndDate) : '';

        const { value: formVals } = await Swal.fire({
            title: 'সাবেক ব্যালেন্স (B/F) সংশোধন',
            html: `
                <div class="text-left font-bn text-xs space-y-3">
                    <div>
                        <label class="block text-slate-300 font-bold mb-1">সাবেক টাকার পরিমাণ (BDT):</label>
                        <input id="swal-bd-bf-amount" type="text" value="${escapeHTML(formatAmountWithComma(summary.bfAmount))}"
                            oninput="window.handleNumberInput(this); window.updateLiveWords(this, 'swal-bd-bf-words');"
                            class="w-full bg-slate-950 border border-sky-500/50 rounded-xl px-3 py-2 text-sm text-sky-400 font-mono font-black text-right outline-none">
                        <div id="swal-bd-bf-words" class="text-[11px] text-amber-400 font-bold mt-1"></div>
                    </div>
                    <div class="grid grid-cols-2 gap-2">
                        <div>
                            <label class="block text-slate-300 font-bold mb-1">শুরুর তারিখ:</label>
                            <input id="swal-bd-bf-start" type="text" value="${escapeHTML(startVal)}" placeholder="DD/MM/YYYY" class="datepicker w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white outline-none">
                        </div>
                        <div>
                            <label class="block text-slate-300 font-bold mb-1">শেষ তারিখ:</label>
                            <input id="swal-bd-bf-end" type="text" value="${escapeHTML(endVal)}" placeholder="DD/MM/YYYY" class="datepicker w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white outline-none">
                        </div>
                    </div>
                </div>
            `,
            background: '#0f172a',
            color: '#f8fafc',
            showCancelButton: true,
            confirmButtonText: 'আপডেট করুন',
            cancelButtonText: 'বাতিল',
            confirmButtonColor: '#0284c7',
            didOpen: () => {
                const amtEl = document.getElementById('swal-bd-bf-amount');
                if (amtEl && window.updateLiveWords) window.updateLiveWords(amtEl, 'swal-bd-bf-words');
            },
            preConfirm: () => {
                const amount = parseAmount(document.getElementById('swal-bd-bf-amount')?.value || 0);
                if (amount < 0) {
                    Swal.showValidationMessage('সঠিক টাকার অঙ্ক দিন');
                    return false;
                }
                return {
                    amount: safeRound(amount),
                    start: document.getElementById('swal-bd-bf-start')?.value?.trim() || '',
                    end: document.getElementById('swal-bd-bf-end')?.value?.trim() || ''
                };
            }
        });

        if (formVals) {
            try {
                await DubaiBDExpenseDAO.updateConsignmentBf(activeConsignment?.id || 'CONSIGNMENT-01', formVals.amount, formVals.start, formVals.end);
                showToast('B/F ব্যালেন্স সফলভাবে আপডেট হয়েছে', 'success');
            } catch (err) {
                console.error('Update B/F error:', err);
                showToast('B/F আপডেট করতে সমস্যা হয়েছে', 'error');
            }
        }
    };

    window.deleteBDExpenseEntry = async (id) => {
        if (!ensureOnline('খরচ এন্ট্রি মুছে ফেলা')) return;
        const pinPassed = await promptSecurityPin();
        if (!pinPassed) return;

        const targetItem = bdExpensesList.find(b => b.id === id) || null;
        const confirmed = await confirmNothiAction({
            title: 'এন্ট্রি মুছে ফেলতে চান?',
            text: `${targetItem?.description || 'এই খরচ এন্ট্রি'} রিসাইকেল বিনে সংরক্ষণ করে তালিকা থেকে সরানো হবে।`,
            confirmButtonText: 'হ্যাঁ, মুছুন'
        });

        if (confirmed) {
            try {
                await DubaiBDExpenseDAO.deleteBDExpense(id, targetItem);
                showToast('এন্ট্রি সফলভাবে রিসাইকেল বিনে সরানো হয়েছে', 'success');
            } catch (err) {
                console.error('Delete expense error:', err);
                showToast('মুছে ফেলতে সমস্যা হয়েছে', 'error');
            }
        }
    };
}

async function onSaveBDExpenseSubmit(e) {
    e.preventDefault();
    if (!ensureOnline('বাংলাদেশ খরচ সংরক্ষণ')) return;

    const dateVal = document.getElementById('bd-input-date').value.trim();
    const descVal = document.getElementById('bd-input-desc').value.trim();
    const catVal = document.getElementById('bd-input-category').value.trim();
    const memoVal = document.getElementById('bd-input-memo').value.trim();
    const amtVal = parseAmount(document.getElementById('bd-input-amount').value);

    if (!dateVal || !descVal || amtVal <= 0) {
        showToast('তারিখ, বিবরণ এবং সঠিক টাকার অঙ্ক লিখুন', 'warning');
        return;
    }

    if (editingExpenseId) {
        const pinOk = await promptSecurityPin();
        if (!pinOk) return;
    }

    const payload = {
        consignmentId: activeConsignment?.id || 'CONSIGNMENT-01',
        date: toDBDate(dateVal),
        description: descVal,
        category: catVal,
        memo: memoVal || '—',
        amount: safeRound(amtVal),
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

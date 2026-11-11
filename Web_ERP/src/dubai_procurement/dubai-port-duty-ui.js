/**
 * Dubai Procurement - Container Port, Customs Duty & C&F UI Controller
 * Manages the live register for Register Page 0004, quick-entry dock, size badges, and print engine.
 */
// ALLOW_LARGE_FILE (Corporate Container Duty & Port Bills UI Controller)

import Swal from 'sweetalert2';
import { DubaiPortDutyDAO } from './dubai-port-duty-dao.js';
import { DubaiRemittanceDAO } from './dubai-remittance-dao.js';
import { DubaiBDExpenseDAO } from './dubai-bd-expense-dao.js';
import { calculatePortDutySummary, calculateMasterProjectCapEx } from './dubai-port-duty-calc.js';
import { calculateConsignmentSummary } from './dubai-remittance-calc.js';
import { calculateBDExpenseSummary } from './dubai-bd-expense-calc.js';
import { printDubaiPortDutyBook } from './dubai-port-duty-print.js';
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
let portDutyBillsList = [];
let dubaiRemittancesList = [];
let bdExpensesList = [];
let unsubscribePortDuty = null;
let unsubscribeConsignments = null;
let unsubscribeRemittances = null;
let unsubscribeBDExpenses = null;
let editingBillId = null;

export function initDubaiPortDutyModule(container) {
    if (!container) return;

    // Seed initial data if first time
    DubaiPortDutyDAO.seedInitialDataIfNeeded().catch(e => console.error('Port duty seed error:', e));

    renderPortDutyView(container);
    renderPortDutyTable();
    updatePortDutyKpis();
    setupPortDutyListeners();
}

export function cleanupDubaiPortDuty() {
    if (unsubscribePortDuty) {
        unsubscribePortDuty();
        unsubscribePortDuty = null;
    }
    if (unsubscribeConsignments) {
        unsubscribeConsignments();
        unsubscribeConsignments = null;
    }
    if (unsubscribeRemittances) {
        unsubscribeRemittances();
        unsubscribeRemittances = null;
    }
    if (unsubscribeBDExpenses) {
        unsubscribeBDExpenses();
        unsubscribeBDExpenses = null;
    }
}

function setupPortDutyListeners() {
    unsubscribeConsignments = DubaiRemittanceDAO.listenConsignments(consignments => {
        consignmentsList = consignments;
        if (!activeConsignment && consignments.length > 0) {
            activeConsignment = consignments.find(c => c.status === 'active') || consignments[0];
        }
        updateConsignmentUI();
        listenToActivePortDutyBills();
    });

    const consId = activeConsignment?.id || 'CONSIGNMENT-01';

    // Dubai Remittances sync for master CapEx
    unsubscribeRemittances = DubaiRemittanceDAO.listenRemittances(consId, items => {
        dubaiRemittancesList = items;
        updatePortDutyKpis();
    });

    // Bangladesh Expenses sync for master CapEx
    unsubscribeBDExpenses = DubaiBDExpenseDAO.listenBDExpenses(consId, items => {
        bdExpensesList = items;
        updatePortDutyKpis();
    });
}

function listenToActivePortDutyBills() {
    if (unsubscribePortDuty) {
        unsubscribePortDuty();
        unsubscribePortDuty = null;
    }

    const consId = activeConsignment?.id || 'CONSIGNMENT-01';
    unsubscribePortDuty = DubaiPortDutyDAO.listenPortDutyBills(consId, items => {
        portDutyBillsList = items;
        renderPortDutyTable();
        updatePortDutyKpis();
    });
}

function renderPortDutyView(container) {
    container.innerHTML = `
        <div class="flex flex-col gap-4 font-bn w-full max-w-6xl mx-auto px-2 sm:px-4 pb-20">
            <!-- Top View Switcher & Action Bar -->
            <div class="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-900/90 border border-slate-800 p-4 sm:p-5 rounded-3xl backdrop-blur-xl shadow-2xl">
                <div class="flex items-center gap-3">
                    <div class="w-11 h-11 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 text-xl shadow-inner shrink-0">
                        <i class="fa-solid fa-ship"></i>
                    </div>
                    <div>
                        <div class="flex items-center gap-2">
                            <h1 class="text-base sm:text-xl font-black text-white tracking-tight">কন্টেইনার ডিউটি, সিএন্ডএফ ও পোর্ট বিল রেজিস্টার</h1>
                            <span class="px-2.5 py-0.5 rounded-full text-[11px] font-black bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 whitespace-nowrap">খাতা পাতা: ০০০৪</span>
                            <span class="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-800 text-slate-300 border border-slate-700">BDT</span>
                        </div>
                        <p class="text-xs text-slate-400">১ম কনসোলমেন্ট কন্টেইনার ক্লিয়ারেন্স, কাস্টমস শুল্ক, সিএন্ডএফ ও বন্দর খালাস ব্যয়</p>
                    </div>
                </div>

                <div class="flex flex-wrap items-center gap-2 shrink-0">
                    <button type="button" id="btn-port-to-audit" class="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-sky-400 border border-sky-500/30 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-sm" title="বৃহস্পতিবার সাপ্তাহিক অডিট শিটে যান">
                        <i class="fa-solid fa-table-list text-sky-400 text-xs"></i>
                        <span>সাপ্তাহিক অডিট শিট</span>
                    </button>
                    <button type="button" id="btn-port-to-remittance" class="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-emerald-400 border border-emerald-500/30 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-sm" title="দুবাই রেমিট্যান্স মাস্টার বুকে যান">
                        <i class="fa-solid fa-money-bill-transfer text-emerald-400 text-xs"></i>
                        <span>রেমিট্যান্স বুক</span>
                    </button>
                    <button type="button" id="btn-port-to-bd" class="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-amber-400 border border-amber-500/30 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-sm" title="বাংলাদেশ খরচ মাস্টার খাতায় যান">
                        <i class="fa-solid fa-file-invoice-dollar text-amber-400 text-xs"></i>
                        <span>বাংলাদেশ খরচ</span>
                    </button>
                    <button type="button" id="btn-port-to-lc" class="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-cyan-400 border border-cyan-500/30 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-sm" title="কন্টেইনার এলসি ও ব্যাংক খরচ খাতায় যান">
                        <i class="fa-solid fa-file-contract text-cyan-400 text-xs"></i>
                        <span>এলসি ও ব্যাংক হিসাব</span>
                    </button>
                    <button type="button" id="btn-print-port-duty" class="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-sm">
                        <i class="fa-solid fa-print text-slate-400 text-xs"></i>
                        <span>A4 প্রিন্ট / ভাউচার</span>
                    </button>
                </div>
            </div>

            <!-- Consignment Selector & Active Status -->
            <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-900/60 border border-slate-800/80 p-3.5 rounded-2xl">
                <div class="flex items-center gap-2.5 flex-grow">
                    <span class="text-xs font-bold text-slate-400 whitespace-nowrap"><i class="fa-solid fa-boxes-stacked text-indigo-400 mr-1"></i>কনসোলমেন্ট:</span>
                    <select id="select-port-consignment" class="bg-slate-950 border border-slate-700 rounded-xl px-3 py-1.5 text-xs text-white font-bold focus:border-indigo-500 outline-none max-w-md w-full">
                        <option value="CONSIGNMENT-01">১ম কনসোলমেন্ট, কন্টেইনার ক্লিয়ারেন্স ও খালাস রেজিস্টার (চলমান)</option>
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
            <div id="port-duty-kpi-container" class="grid grid-cols-1 md:grid-cols-3 gap-3">
                <!-- Dynamically populated -->
            </div>

            <!-- 4-Tier Master Project CapEx Banner -->
            <div id="port-consolidated-capex-container" class="bg-gradient-to-r from-slate-900 via-sky-950/40 to-slate-900 border border-sky-500/30 rounded-2xl p-4 shadow-xl">
                <!-- Dynamically populated -->
            </div>

            <!-- Quick Entry Dock -->
            <div class="bg-slate-900/80 border border-slate-700/80 rounded-2xl p-4 shadow-xl flex flex-col gap-3">
                <div class="flex items-center justify-between border-b border-slate-800 pb-2">
                    <div class="text-xs font-bold text-white flex items-center gap-2">
                        <i class="fa-solid fa-circle-plus text-emerald-400 text-sm"></i>
                        <span id="form-port-duty-title">নতুন কন্টেইনার খালাস বিল যোগ করুন</span>
                    </div>
                    <span class="text-[11px] text-slate-400">বিল বা খরচের টাকা লিখলে নিচে স্বয়ংক্রিয় বাংলায় কথায় রূপান্তর হবে</span>
                </div>

                <form id="form-port-duty" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-3 items-end">
                    <!-- Date -->
                    <div>
                        <label class="block text-[11px] font-bold text-slate-300 mb-1">পরিশোধের তারিখ:</label>
                        <input type="text" id="port-input-date" required class="datepicker w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white font-bold focus:border-indigo-500 outline-none">
                    </div>

                    <!-- Container No -->
                    <div>
                        <label class="block text-[11px] font-bold text-slate-300 mb-1">কন্টেইনার নং:</label>
                        <input type="text" id="port-input-cont-no" required placeholder="যেমন: ৮ নং কন্টেইনার" class="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white font-bold focus:border-indigo-500 outline-none">
                    </div>

                    <!-- Container Size -->
                    <div>
                        <label class="block text-[11px] font-bold text-slate-300 mb-1">কন্টেইনার সাইজ:</label>
                        <select id="port-input-size" class="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white font-bold focus:border-indigo-500 outline-none">
                            <option value="40 FT">৪০ ফুট (40 FT)</option>
                            <option value="20 FT">২০ ফুট (20 FT)</option>
                            <option value="—">সাধারণ / অনির্ধারিত</option>
                        </select>
                    </div>

                    <!-- Agent / Person -->
                    <div>
                        <label class="block text-[11px] font-bold text-slate-300 mb-1">সিএন্ডএফ এজেন্ট / মারফত:</label>
                        <input type="text" id="port-input-agent" required placeholder="যেমন: আরমান ও মিতুল" class="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white font-bold focus:border-indigo-500 outline-none">
                    </div>

                    <!-- Description -->
                    <div>
                        <label class="block text-[11px] font-bold text-slate-300 mb-1">বিল বিবরণ / খাত:</label>
                        <input type="text" id="port-input-desc" placeholder="কন্টেইনার ডিউটি, সিএন্ডএফ ও পোর্ট বিল" class="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white font-bold focus:border-indigo-500 outline-none">
                    </div>

                    <!-- Amount BDT -->
                    <div>
                        <label class="block text-[11px] font-bold text-red-400 mb-1">টাকার অঙ্ক (BDT / TK):</label>
                        <input type="text" id="port-input-amount" required placeholder="0.00" oninput="window.handleNumberInput(this); window.updateLiveWords(this, 'port-duty-live-words');" class="w-full bg-slate-950 border border-red-500/60 rounded-xl px-3 py-2 text-xs text-red-400 font-mono font-black focus:border-red-400 outline-none text-right">
                    </div>

                    <!-- Submit & Actions -->
                    <div class="sm:col-span-2 lg:col-span-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pt-2">
                        <div class="text-[11px] text-slate-400 flex items-center gap-1.5">
                            <i class="fa-solid fa-comment-dollar text-slate-400"></i>
                            <span class="text-slate-400">কথায়:</span>
                            <span id="port-duty-live-words" class="text-amber-400 font-bold">শূন্য টাকা মাত্র</span>
                        </div>

                        <div class="flex items-center gap-2 self-end">
                            <button type="button" id="btn-cancel-port-edit" class="hidden px-3.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-bold transition-all">বাতিল</button>
                            <button type="submit" id="btn-save-port-bill" class="px-5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shadow-lg shadow-emerald-950/40 cursor-pointer">
                                <i class="fa-solid fa-check text-xs"></i>
                                <span id="btn-save-port-text">বিল এন্ট্রি যোগ করুন</span>
                            </button>
                        </div>
                    </div>
                </form>
            </div>

            <!-- Filter & Search Toolbar -->
            <div class="flex flex-col sm:flex-row items-center justify-between gap-3 bg-slate-900/60 border border-slate-800/80 p-3 rounded-2xl">
                <div class="text-xs font-bold text-slate-200 flex items-center gap-2">
                    <i class="fa-solid fa-list-check text-indigo-400"></i>
                    <span>কন্টেইনার খালাস ও পোর্ট বিল তালিকা</span>
                    <span id="port-badge-count" class="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-800 text-slate-300 border border-slate-700">০টি</span>
                </div>

                <div class="flex items-center gap-2 w-full sm:w-auto">
                    <select id="port-filter-size" class="bg-slate-950 border border-slate-700 rounded-xl px-3 py-1.5 text-xs text-slate-300 outline-none">
                        <option value="all">সকল সাইজ</option>
                        <option value="40 FT">৪০ ফুট (40 FT)</option>
                        <option value="20 FT">২০ ফুট (20 FT)</option>
                    </select>
                    <div class="relative w-full sm:w-64">
                        <input type="text" id="port-search-input" placeholder="কন্টেইনার, এজেন্ট বা বিবরণ খুঁজুন..." class="w-full bg-slate-950 border border-slate-700 rounded-xl pl-8 pr-3 py-1.5 text-xs text-white placeholder-slate-500 focus:border-indigo-500 outline-none">
                        <i class="fa-solid fa-magnifying-glass absolute left-2.5 top-2.5 text-slate-500 text-xs"></i>
                    </div>
                </div>
            </div>

            <!-- Bills Table Container -->
            <div class="overflow-x-auto bg-slate-900/80 border border-slate-800 rounded-2xl shadow-xl">
                <table class="w-full text-left border-collapse">
                    <thead>
                        <tr class="bg-slate-950/80 border-b border-slate-800 text-[11px] font-bold text-slate-400">
                            <th class="p-3 text-center w-12 border-r border-slate-800">#</th>
                            <th class="p-3 text-center w-28 border-r border-slate-800">তারিখ</th>
                            <th class="p-3 text-left border-r border-slate-800">কন্টেইনার নং ও সাইজ</th>
                            <th class="p-3 text-left border-r border-slate-800">সিএন্ডএফ এজেন্ট / মারফত</th>
                            <th class="p-3 text-left border-r border-slate-800">বিল বিবরণ / খাত</th>
                            <th class="p-3 text-right w-36 border-r border-slate-800 text-red-400">টাকা (BDT / TK)</th>
                            <th class="p-3 text-center w-28 border-r border-slate-800">স্ট্যাটাস</th>
                            <th class="p-3 text-center w-20">অ্যাকশন</th>
                        </tr>
                    </thead>
                    <tbody id="port-duty-table-body" class="divide-y divide-slate-800/60 text-xs text-slate-300">
                        <tr><td colspan="8" class="p-8 text-center text-slate-500">লোড করা হচ্ছে...</td></tr>
                    </tbody>
                </table>
            </div>
        </div>
    `;

    bindPortDutyEvents();
}

function bindPortDutyEvents() {
    const bind = (id, fn) => { const el = document.getElementById(id); if (el) el.onclick = fn; };

    bind('btn-port-to-audit', () => {
        if (window.switchDubaiProcurementView) {
            window.switchDubaiProcurementView('audit');
        }
    });

    bind('btn-port-to-remittance', () => {
        if (window.switchDubaiProcurementView) {
            window.switchDubaiProcurementView('remittance');
        }
    });

    bind('btn-port-to-bd', () => {
        if (window.switchDubaiProcurementView) {
            window.switchDubaiProcurementView('bd-expense');
        }
    });

    bind('btn-port-to-lc', () => {
        if (window.switchDubaiProcurementView) {
            window.switchDubaiProcurementView('lc-bills');
        }
    });

    bind('btn-print-port-duty', () => {
        const dubaiSummary = calculateConsignmentSummary(activeConsignment, dubaiRemittancesList);
        const bdSummary = calculateBDExpenseSummary(activeConsignment, bdExpensesList);
        printDubaiPortDutyBook(activeConsignment, portDutyBillsList, dubaiSummary, bdSummary);
    });

    const form = document.getElementById('form-port-duty');
    if (form) form.onsubmit = onSavePortDutySubmit;

    const cancelBtn = document.getElementById('btn-cancel-port-edit');
    if (cancelBtn) cancelBtn.onclick = resetPortDutyForm;

    const searchInput = document.getElementById('port-search-input');
    if (searchInput) searchInput.oninput = renderPortDutyTable;

    const filterSize = document.getElementById('port-filter-size');
    if (filterSize) filterSize.onchange = renderPortDutyTable;

    const dateInp = document.getElementById('port-input-date');
    if (dateInp) {
        dateInp.value = getTodayLocalDateString();
    }
}

function updateConsignmentUI() {
    const select = document.getElementById('select-port-consignment');
    if (select && consignmentsList.length > 0) {
        select.innerHTML = consignmentsList.map(c => `
            <option value="${c.id}" ${c.id === activeConsignment?.id ? 'selected' : ''}>${escapeHTML(c.name || c.id)}</option>
        `).join('');
    }
}

function updatePortDutyKpis() {
    const kpiContainer = document.getElementById('port-duty-kpi-container');
    const capexContainer = document.getElementById('port-consolidated-capex-container');
    if (!kpiContainer) return;

    const summary = calculatePortDutySummary(activeConsignment, portDutyBillsList);
    const dubaiSummary = calculateConsignmentSummary(activeConsignment, dubaiRemittancesList);
    const bdSummary = calculateBDExpenseSummary(activeConsignment, bdExpensesList);
    const capex = calculateMasterProjectCapEx(dubaiSummary, summary, bdSummary);

    // 1. Render 3 Master KPI Cards
    kpiContainer.innerHTML = `
        <!-- Card 1: Count -->
        <div class="bg-gradient-to-br from-slate-900/90 to-indigo-950/40 border border-indigo-500/20 p-4 rounded-2xl flex flex-col justify-between shadow-lg">
            <div class="flex items-center justify-between text-slate-400 text-xs mb-2">
                <span class="font-bold flex items-center gap-1.5"><i class="fa-solid fa-boxes-packing text-indigo-400"></i>১. মোট কন্টেইনার সংখ্যা</span>
                <span class="px-2 py-0.5 rounded text-[10px] font-bold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">আমদানি চালানী</span>
            </div>
            <div class="text-xl sm:text-2xl font-mono font-black text-indigo-400 tracking-tight">${summary.count} টি কন্টেইনার</div>
            <div class="mt-2 pt-2 border-t border-slate-800/80 text-[11px] text-slate-400 flex items-center justify-between">
                <span>১ নং হতে ৭ নং কন্টেইনার খালাস</span>
                <span class="font-bold text-indigo-300">৪০ ফুট ও ২০ ফুট</span>
            </div>
        </div>

        <!-- Card 2: Main Agent -->
        <div class="bg-gradient-to-br from-slate-900/90 to-emerald-950/40 border border-emerald-500/20 p-4 rounded-2xl flex flex-col justify-between shadow-lg">
            <div class="flex items-center justify-between text-slate-400 text-xs mb-2">
                <span class="font-bold flex items-center gap-1.5"><i class="fa-solid fa-handshake text-emerald-400"></i>২. প্রধান সিএন্ডএফ / মারফত</span>
                <span class="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">চট্টগ্রাম বন্দর</span>
            </div>
            <div class="text-xl sm:text-2xl font-mono font-black text-emerald-400 tracking-tight">আরমান ও মিতুল</div>
            <div class="mt-2 pt-2 border-t border-slate-800/80 text-[11px] text-slate-400 flex items-center justify-between">
                <span>সিএন্ডএফ ও ক্লিয়ারেন্স সমন্বয়</span>
                <span class="font-bold text-emerald-300">${summary.count} কিস্তির বিল পরিশোধ</span>
            </div>
        </div>

        <!-- Card 3: Grand Total Duty -->
        <div class="bg-gradient-to-br from-slate-900/90 to-amber-950/40 border border-amber-500/30 p-4 rounded-2xl flex flex-col justify-between shadow-lg">
            <div class="flex items-center justify-between text-slate-400 text-xs mb-2">
                <span class="font-bold flex items-center gap-1.5"><i class="fa-solid fa-file-invoice-dollar text-amber-400"></i>৩. সর্বমোট কন্টেইনার ডিউটি ও পোর্ট বিল</span>
                <span class="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/20 text-amber-400 border border-amber-500/30">সর্বসাকুল্যে খালাস</span>
            </div>
            <div class="text-xl sm:text-2xl font-mono font-black text-amber-400 tracking-tight">৳ ${formatAmountWithComma(summary.totalDuty)}</div>
            <div class="mt-2 pt-2 border-t border-slate-800/80 text-[11px] text-slate-400 flex items-center justify-between">
                <span>১ হতে ৭ নং কন্টেইনার সর্বমোট বিল</span>
                <span class="font-bold text-amber-300">১০০% চূড়ান্ত পরিশোধিত</span>
            </div>
        </div>
    `;

    // 2. Render 4-Tier Master Project CapEx Banner
    if (capexContainer) {
        capexContainer.innerHTML = `
            <div class="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-sky-800/40 pb-3 mb-3">
                <div class="flex items-center gap-2">
                    <span class="w-8 h-8 rounded-xl bg-sky-500/20 border border-sky-400/30 flex items-center justify-center text-sky-400 text-sm">
                        <i class="fa-solid fa-chart-pie"></i>
                    </span>
                    <div>
                        <div class="text-xs sm:text-sm font-black text-white">১ম কনসোলমেন্টের সামগ্রিক মূলধন ও পুঁজী (Master CapEx Hierarchy)</div>
                        <div class="text-[11px] text-slate-400">দুবাই বৈদেশিক ক্রয় + বন্দর খালাস ও কাস্টমস ডিউটি + বাংলাদেশ দেশীয় অভ্যন্তরীণ খরচের একীভূত পুঁজী কাঠামো</div>
                    </div>
                </div>
                <div class="flex items-center gap-2 bg-slate-950/80 px-3.5 py-1.5 rounded-xl border border-sky-500/30">
                    <span class="text-[11px] text-slate-400 font-bold">সর্বমোট প্রজেক্ট ক্যাপিটাল:</span>
                    <span class="text-sm sm:text-base font-mono font-black text-emerald-400">৳ ${formatAmountWithComma(capex.totalCapExBDT)}</span>
                </div>
            </div>

            <div class="grid grid-cols-1 sm:grid-cols-4 gap-3 text-center">
                <div class="bg-slate-950/60 p-2.5 rounded-xl border border-slate-800">
                    <div class="text-[11px] text-slate-400 font-bold mb-1">১. দুবাই ক্রয় (পাতা ০০০১)</div>
                    <div class="text-sm font-mono font-black text-emerald-400">${formatAmountWithComma(capex.dubaiAED)} AED</div>
                    <div class="text-xs font-mono font-bold text-slate-300">৳ ${formatAmountWithComma(capex.dubaiBDT)} <span class="text-[10px] text-slate-400">(${capex.dubaiSharePct}%)</span></div>
                </div>

                <div class="bg-slate-950/60 p-2.5 rounded-xl border border-indigo-500/30">
                    <div class="text-[11px] text-indigo-400 font-bold mb-1">২. পোর্ট ও ডিউটি (পাতা ০০০৪)</div>
                    <div class="text-sm font-mono font-black text-red-400">৳ ${formatAmountWithComma(capex.portBDT)}</div>
                    <div class="text-xs text-slate-400">${summary.count}টি কন্টেইনার <span class="font-bold text-slate-300">(${capex.portSharePct}%)</span></div>
                </div>

                <div class="bg-slate-950/60 p-2.5 rounded-xl border border-slate-800">
                    <div class="text-[11px] text-slate-400 font-bold mb-1">৩. বাংলাদেশ খরচ (পাতা ০০০২)</div>
                    <div class="text-sm font-mono font-black text-amber-400">৳ ${formatAmountWithComma(capex.bdBDT)}</div>
                    <div class="text-xs text-slate-400">১৯ কিস্তি + সাবেক <span class="font-bold text-slate-300">(${capex.bdSharePct}%)</span></div>
                </div>

                <div class="bg-slate-950/60 p-2.5 rounded-xl border border-emerald-500/40">
                    <div class="text-[11px] text-emerald-400 font-bold mb-1">সর্বমোট সামগ্রিক পুঁজী</div>
                    <div class="text-base font-mono font-black text-emerald-300">৳ ${formatAmountWithComma(capex.totalCapExBDT)}</div>
                    <div class="text-[10px] text-slate-400">১ম কনসোলমেন্ট CapEx (১০০%)</div>
                </div>
            </div>
        `;
    }
}

function renderPortDutyTable() {
    const tbody = document.getElementById('port-duty-table-body');
    const badgeCount = document.getElementById('port-badge-count');
    if (!tbody) return;

    const searchTerm = (document.getElementById('port-search-input')?.value || '').trim().toLowerCase();
    const filterSize = document.getElementById('port-filter-size')?.value || 'all';

    let filtered = portDutyBillsList.filter(item => {
        if (filterSize !== 'all' && (item.size || '') !== filterSize) return false;
        if (!searchTerm) return true;
        const cont = (item.containerNo || '').toLowerCase();
        const agent = (item.agent || '').toLowerCase();
        const desc = (item.description || '').toLowerCase();
        const date = (item.date || '').toLowerCase();
        return cont.includes(searchTerm) || agent.includes(searchTerm) || desc.includes(searchTerm) || date.includes(searchTerm);
    });

    if (badgeCount) badgeCount.innerText = `${filtered.length} টি`;

    const summary = calculatePortDutySummary(activeConsignment, portDutyBillsList);

    if (filtered.length === 0) {
        tbody.innerHTML = `<tr><td colspan="8" class="p-8 text-center text-slate-500">কোনো এন্ট্রি পাওয়া যায়নি</td></tr>`;
        return;
    }

    const rowsHtml = filtered.map((item, idx) => {
        const appDt = formatAppDate(item.date);
        const amtStr = formatAmountWithComma(item.amount);
        const sizeBadge = (item.size && item.size !== '—') ? `
            <span class="px-2 py-0.5 rounded text-[10px] font-black bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">${escapeHTML(item.size)}</span>
        ` : '';

        return `
            <tr class="hover:bg-slate-800/40 transition-colors">
                <td class="p-3 text-center border-r border-slate-800 text-slate-500 font-bold">${idx + 1}</td>
                <td class="p-3 text-center border-r border-slate-800 font-mono text-slate-300 whitespace-nowrap">${appDt}</td>
                <td class="p-3 border-r border-slate-800 font-bold text-white flex items-center justify-between gap-2">
                    <span>${escapeHTML(item.containerNo || '—')}</span>
                    ${sizeBadge}
                </td>
                <td class="p-3 border-r border-slate-800 font-bold text-slate-300">${escapeHTML(item.agent || '—')}</td>
                <td class="p-3 border-r border-slate-800 text-slate-400">${escapeHTML(item.description || 'কন্টেইনার ডিউটি, সিএন্ডএফ ও পোর্ট বিল')}</td>
                <td class="p-3 text-right border-r border-slate-800 font-mono font-bold text-red-400 whitespace-nowrap">৳ ${amtStr}</td>
                <td class="p-3 text-center border-r border-slate-800">
                    <span class="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">${escapeHTML(item.status || 'চূড়ান্ত পরিশোধিত')}</span>
                </td>
                <td class="p-3 text-center">
                    <div class="flex items-center justify-center gap-1.5">
                        <button type="button" onclick="window.editPortDutyEntry('${item.id}')" class="p-1 hover:text-sky-400 text-slate-400 transition-colors" title="সংশোধন করুন">
                            <i class="fa-solid fa-pen-to-square text-xs"></i>
                        </button>
                        <button type="button" onclick="window.deletePortDutyEntry('${item.id}')" class="p-1 hover:text-red-400 text-slate-400 transition-colors" title="মুছে ফেলুন">
                            <i class="fa-solid fa-trash text-xs"></i>
                        </button>
                    </div>
                </td>
            </tr>
        `;
    }).join('');

    tbody.innerHTML = `
        ${rowsHtml}

        <!-- Grand Total Row -->
        <tr class="bg-amber-950/30 border-t-2 border-b-2 border-amber-500 font-black text-xs text-white">
            <td colspan="5" class="p-3.5 text-right border-r border-slate-800 text-sm">সর্বমোট কন্টেইনার ডিউটি ও পোর্ট বিল (১ হতে ৭ নং কন্টেইনার):</td>
            <td class="p-3.5 text-right font-mono font-black text-amber-400 border-r border-slate-800 text-sm">৳ ${formatAmountWithComma(summary.totalDuty)}</td>
            <td colspan="2" class="p-3.5 text-center"><span class="px-2.5 py-1 rounded text-xs font-black bg-amber-600 text-white shadow-md">সর্বমোট</span></td>
        </tr>
    `;

    // Global action helpers
    window.editPortDutyEntry = (id) => {
        const item = portDutyBillsList.find(b => b.id === id);
        if (!item) return;
        editingBillId = id;
        const dateInp = document.getElementById('port-input-date');
        const appDt = formatAppDate(item.date);
        if (dateInp) {
            dateInp.value = appDt;
            if (dateInp._flatpickr) {
                dateInp._flatpickr.setDate(appDt, false);
            }
        }
        document.getElementById('port-input-cont-no').value = item.containerNo || '';
        document.getElementById('port-input-size').value = item.size || '40 FT';
        document.getElementById('port-input-agent').value = item.agent || 'আরমান ও মিতুল';
        document.getElementById('port-input-desc').value = item.description || 'কন্টেইনার ডিউটি, সিএন্ডএফ ও পোর্ট বিল';
        
        const amtInp = document.getElementById('port-input-amount');
        amtInp.value = formatAmountWithComma(item.amount);
        window.updateLiveWords(amtInp, 'port-duty-live-words');

        document.getElementById('form-port-duty-title').innerText = 'কন্টেইনার খালাস বিল সংশোধন করুন';
        document.getElementById('btn-save-port-text').innerText = 'আপডেট করুন';
        document.getElementById('btn-cancel-port-edit').classList.remove('hidden');

        document.getElementById('form-port-duty').scrollIntoView({ behavior: 'smooth' });
    };

    window.deletePortDutyEntry = async (id) => {
        ensureOnline();
        const pinPassed = await promptSecurityPin();
        if (!pinPassed) return;

        const res = await Swal.fire({
            title: 'বিল মুছে ফেলতে চান?',
            text: 'এই কন্টেইনার বিলটি তালিকা থেকে মুছে ফেলা হবে।',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'হ্যাঁ, মুছুন',
            cancelButtonText: 'বাতিল',
            confirmButtonColor: '#dc2626',
            cancelButtonColor: '#334155'
        });

        if (res.isConfirmed) {
            try {
                await DubaiPortDutyDAO.deletePortDutyBill(id);
                showToast('বিল সফলভাবে মুছে ফেলা হয়েছে', 'success');
            } catch (err) {
                console.error('Delete port duty error:', err);
                showToast('মুছে ফেলতে সমস্যা হয়েছে', 'error');
            }
        }
    };
}

async function onSavePortDutySubmit(e) {
    e.preventDefault();
    ensureOnline();

    const dateVal = document.getElementById('port-input-date').value.trim();
    const contVal = document.getElementById('port-input-cont-no').value.trim();
    const sizeVal = document.getElementById('port-input-size').value.trim();
    const agentVal = document.getElementById('port-input-agent').value.trim();
    const descVal = document.getElementById('port-input-desc').value.trim();
    const amtVal = parseAmount(document.getElementById('port-input-amount').value);

    if (!dateVal || !contVal || amtVal <= 0) {
        showToast('তারিখ, কন্টেইনার নং এবং সঠিক টাকার অঙ্ক লিখুন', 'warning');
        return;
    }

    const payload = {
        consignmentId: activeConsignment?.id || 'CONSIGNMENT-01',
        date: toDBDate(dateVal),
        containerNo: contVal,
        size: sizeVal || '—',
        agent: agentVal || 'আরমান ও মিতুল',
        description: descVal || 'কন্টেইনার ডিউটি, সিএন্ডএফ ও পোর্ট বিল',
        amount: amtVal,
        status: 'চূড়ান্ত পরিশোধিত'
    };

    if (editingBillId) {
        payload.id = editingBillId;
    }

    try {
        await DubaiPortDutyDAO.savePortDutyBill(payload);
        showToast(editingBillId ? 'বিল সফলভাবে আপডেট হয়েছে' : 'নতুন কন্টেইনার খালাস বিল যুক্ত হয়েছে', 'success');
        resetPortDutyForm();
    } catch (err) {
        console.error('Save port duty bill error:', err);
        showToast('সংরক্ষণ করতে সমস্যা হয়েছে', 'error');
    }
}

function resetPortDutyForm() {
    editingBillId = null;
    document.getElementById('form-port-duty')?.reset();
    const dateInp = document.getElementById('port-input-date');
    const todayStr = getTodayLocalDateString();
    if (dateInp) {
        dateInp.value = todayStr;
        if (dateInp._flatpickr) {
            dateInp._flatpickr.setDate(todayStr, false);
        }
    }
    document.getElementById('form-port-duty-title').innerText = 'নতুন কন্টেইনার খালাস বিল যোগ করুন';
    document.getElementById('btn-save-port-text').innerText = 'বিল এন্ট্রি যোগ করুন';
    document.getElementById('btn-cancel-port-edit').classList.add('hidden');
    document.getElementById('port-duty-live-words').innerText = 'শূন্য টাকা মাত্র';
}

/**
 * Dubai Remittance & Consignment - UI Controller
 * Manages the live cross-currency remittance register, quick-entry dock, and consignment lifecycle.
 */
// ALLOW_LARGE_FILE (Corporate Remittance & Consignment UI Controller)

import Swal from 'sweetalert2';
import { DubaiRemittanceDAO } from './dubai-remittance-dao.js';
import { calculateConsignmentSummary, calcBDTfromAED, calcAEDfromBDT } from './dubai-remittance-calc.js';
import { printDubaiRemittanceBook } from './dubai-remittance-print.js';
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
let remittancesList = [];
let unsubscribeRemittances = null;
let unsubscribeConsignments = null;
let editingRemittanceId = null;

export function initDubaiRemittanceModule(container) {
    if (!container) return;

    // Seed initial data if first time
    DubaiRemittanceDAO.seedInitialDataIfNeeded().catch(e => console.error('Seed error:', e));

    renderRemittanceView(container);
    renderRemittanceTable();
    updateRemittanceKpis();
    setupRemittanceListeners();
}

export function cleanupDubaiRemittance() {
    if (unsubscribeRemittances) {
        unsubscribeRemittances();
        unsubscribeRemittances = null;
    }
    if (unsubscribeConsignments) {
        unsubscribeConsignments();
        unsubscribeConsignments = null;
    }
}

function setupRemittanceListeners() {
    unsubscribeConsignments = DubaiRemittanceDAO.listenConsignments(consignments => {
        consignmentsList = consignments;
        if (!activeConsignment && consignments.length > 0) {
            activeConsignment = consignments.find(c => c.status === 'active') || consignments[0];
        }
        updateConsignmentUI();
        listenToActiveRemittances();
    });
}

function listenToActiveRemittances() {
    if (unsubscribeRemittances) {
        unsubscribeRemittances();
        unsubscribeRemittances = null;
    }

    const consId = activeConsignment?.id || 'CONSIGNMENT-01';
    unsubscribeRemittances = DubaiRemittanceDAO.listenRemittances(consId, items => {
        remittancesList = items;
        renderRemittanceTable();
        updateRemittanceKpis();
    });
}

function renderRemittanceView(container) {
    container.innerHTML = `
        <div class="flex flex-col gap-4 font-bn w-full max-w-6xl mx-auto px-2 sm:px-4 pb-20">
            <!-- Top View Switcher & Action Bar -->
            <div class="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-900/90 border border-slate-800 p-4 sm:p-5 rounded-3xl backdrop-blur-xl shadow-2xl">
                <div class="flex items-center gap-3">
                    <div class="w-11 h-11 rounded-2xl bg-sky-500/10 border border-sky-500/20 flex items-center justify-center text-sky-400 text-xl shadow-inner shrink-0">
                        <i class="fa-solid fa-money-bill-transfer"></i>
                    </div>
                    <div>
                        <div class="flex items-center gap-2">
                            <h1 class="text-base sm:text-xl font-black text-white tracking-tight">দুবাই টাকা পাঠানো ও রেমিট্যান্স মাস্টার বুক</h1>
                            <span class="px-2.5 py-0.5 rounded-full text-[11px] font-black bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 whitespace-nowrap">AED & BDT</span>
                        </div>
                        <p class="text-xs text-slate-400">এমরান ব্যক্তিগত কনসোলমেন্ট মাল ক্রয় ফান্ডিং ও ক্যাশ ফ্লো রেজিস্টার</p>
                    </div>
                </div>

                <div class="flex flex-wrap items-center gap-2 shrink-0">
                    <button type="button" id="btn-switch-to-audit" class="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-sky-400 border border-sky-500/30 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-sm">
                        <i class="fa-solid fa-table-list text-sky-400 text-xs"></i>
                        <span>সাপ্তাহিক অডিট শিট</span>
                    </button>
                    <button type="button" id="btn-switch-to-bd-expense" class="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-amber-400 border border-amber-500/30 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-sm">
                        <i class="fa-solid fa-file-invoice-dollar text-amber-400 text-xs"></i>
                        <span>বাংলাদেশ খরচ খাতা</span>
                    </button>
                    <button type="button" id="btn-switch-to-port-duty" class="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-indigo-400 border border-indigo-500/30 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-sm">
                        <i class="fa-solid fa-ship text-indigo-400 text-xs"></i>
                        <span>পোর্ট ও ডিউটি বিল</span>
                    </button>
                    <button type="button" id="btn-switch-to-lc" class="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-cyan-400 border border-cyan-500/30 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-sm" title="কন্টেইনার এলসি ও ব্যাংক খরচ খাতায় যান">
                        <i class="fa-solid fa-file-contract text-cyan-400 text-xs"></i>
                        <span>এলসি ও ব্যাংক হিসাব</span>
                    </button>
                    <button type="button" id="btn-print-remittance" class="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-sm">
                        <i class="fa-solid fa-print text-slate-400 text-xs"></i>
                        <span>A4 প্রিন্ট / ভাউচার</span>
                    </button>
                    <button type="button" id="btn-close-consignment" class="px-3.5 py-2 bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 border border-amber-500/30 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-sm">
                        <i class="fa-solid fa-lock text-xs"></i>
                        <span>১ম কনসোলমেন্ট ক্লোজিং ও ২য় শুরু</span>
                    </button>
                </div>
            </div>

            <!-- Consignment Selector & Status Banner -->
            <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-900/60 border border-slate-800/80 p-3.5 rounded-2xl">
                <div class="flex items-center gap-2.5 flex-grow">
                    <span class="text-xs font-bold text-slate-400 whitespace-nowrap"><i class="fa-solid fa-boxes-stacked text-sky-400 mr-1"></i>কনসোলমেন্ট:</span>
                    <select id="select-consignment" class="bg-slate-950 border border-slate-700 rounded-xl px-3 py-1.5 text-xs text-white font-bold focus:border-sky-500 outline-none max-w-md w-full">
                        <option value="CONSIGNMENT-01">এমরান ব্যক্তিগত ১ম কনসোলমেন্ট, ডুবাই মাল ক্রয় ইনভেস্ট (চলমান)</option>
                    </select>
                </div>
                <div class="flex items-center gap-2">
                    <span id="badge-consignment-status" class="px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center gap-1.5">
                        <i class="fa-solid fa-circle text-[7px] text-emerald-400"></i>
                        <span>চলমান কনসোলমেন্ট (Active)</span>
                    </span>
                </div>
            </div>

            <!-- 4 Master KPI Summary Cards -->
            <div id="remittance-kpi-container" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                <!-- Dynamically updated -->
            </div>

            <!-- Quick Entry Dock -->
            <div class="bg-slate-900/80 border border-slate-700/80 rounded-2xl p-4 shadow-xl flex flex-col gap-3">
                <div class="flex items-center justify-between border-b border-slate-800 pb-2">
                    <div class="text-xs font-bold text-white flex items-center gap-2">
                        <i class="fa-solid fa-circle-plus text-emerald-400 text-sm"></i>
                        <span id="form-remittance-title">নতুন টাকা পাঠানোর এন্ট্রি যোগ করুন</span>
                    </div>
                    <span class="text-[11px] text-slate-400">দেরহাম বা টাকা যে কোনো একটি লিখলে অন্যটি অটোমেটিক কনভার্ট হবে</span>
                </div>

                <form id="form-remittance" class="grid grid-cols-1 sm:grid-cols-12 gap-3 items-end">
                    <div class="sm:col-span-2">
                        <label class="block text-[11px] font-bold text-slate-400 mb-1">তারিখ:</label>
                        <input type="text" id="rem-input-date" value="${getTodayLocalDateString()}" class="w-full bg-slate-950 border border-slate-700 rounded-xl px-2.5 py-2 text-xs text-white font-bold font-mono focus:border-sky-500 outline-none datepicker" required>
                    </div>

                    <div class="sm:col-span-3">
                        <label class="block text-[11px] font-bold text-slate-400 mb-1">মারফত / মাধ্যম:</label>
                        <input type="text" id="rem-input-via" list="rem-via-suggestions" placeholder="যেমন: মিনহাজ মারফত" class="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white font-bold focus:border-sky-500 outline-none" required>
                        <datalist id="rem-via-suggestions">
                            <option value="মিনহাজ মারফত">
                            <option value="একরাম / সোহেল">
                            <option value="একরাম / ফারুক">
                            <option value="নুরুল হক / সাইফুল">
                            <option value="সাইফুল / নুরুল হক">
                            <option value="আলতাফ মারফত">
                            <option value="হৃদয় মারফত">
                            <option value="ফারুক মারফত">
                        </datalist>
                    </div>

                    <div class="sm:col-span-2">
                        <label class="block text-[11px] font-bold text-slate-400 mb-1">এক্সচেঞ্জ রেট:</label>
                        <input type="number" step="0.01" id="rem-input-rate" value="34.75" class="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white font-bold font-mono focus:border-sky-500 outline-none" required>
                    </div>

                    <div class="sm:col-span-2">
                        <label class="block text-[11px] font-bold text-emerald-400 mb-1">দেরহাম (AED):</label>
                        <input type="text" id="rem-input-aed" placeholder="০.০০" oninput="window.handleNumberInput(this); window.handleRemAedChange();" class="w-full bg-slate-950 border border-emerald-500/50 rounded-xl px-3 py-2 text-xs sm:text-sm text-emerald-400 font-bold font-mono text-right focus:border-emerald-500 outline-none" required>
                    </div>

                    <div class="sm:col-span-3">
                        <label class="block text-[11px] font-bold text-red-400 mb-1">টাকা (BDT / TK):</label>
                        <input type="text" id="rem-input-bdt" placeholder="০.০০" oninput="window.handleNumberInput(this); window.handleRemBdtChange(); window.updateLiveWords(this, 'rem-live-words');" class="w-full bg-slate-950 border border-red-500/50 rounded-xl px-3 py-2 text-xs sm:text-sm text-red-400 font-bold font-mono text-right focus:border-red-500 outline-none" required>
                    </div>

                    <!-- Live Words Bar & Save Button -->
                    <div class="sm:col-span-12 flex flex-col sm:flex-row sm:items-center justify-between gap-2 pt-1 border-t border-slate-800/80">
                        <div class="text-xs text-slate-300 font-semibold flex items-center gap-1.5 overflow-hidden">
                            <i class="fa-solid fa-comment-dots text-sky-400 text-xs"></i>
                            <span class="text-slate-400">কথায়:</span>
                            <span id="rem-live-words" class="text-amber-300 font-bold italic truncate">শূন্য টাকা মাত্র</span>
                        </div>
                        <div class="flex items-center gap-2 shrink-0">
                            <button type="button" id="btn-cancel-rem-edit" class="hidden px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-bold transition-all cursor-pointer">
                                বাতিল
                            </button>
                            <button type="submit" id="btn-save-remittance" class="px-5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-black transition-all flex items-center gap-1.5 cursor-pointer shadow-lg shadow-emerald-600/20">
                                <i class="fa-solid fa-check text-xs"></i>
                                <span id="btn-save-rem-text">এন্ট্রি যোগ করুন</span>
                            </button>
                        </div>
                    </div>
                </form>
            </div>

            <!-- Interactive Register Table -->
            <div class="bg-slate-900/90 border border-slate-700/80 rounded-3xl p-4 sm:p-5 shadow-2xl backdrop-blur-xl flex flex-col gap-3">
                <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-slate-800">
                    <div class="text-sm font-black text-white flex items-center gap-2">
                        <i class="fa-solid fa-list-check text-sky-400"></i>
                        <span>দৈনিক লেনদেন রেজিস্টার তালিকা</span>
                        <span id="rem-records-count" class="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-800 text-slate-300 border border-slate-700">০ টি</span>
                    </div>

                    <div class="flex items-center gap-2">
                        <div class="relative">
                            <i class="fa-solid fa-magnifying-glass absolute left-3 top-2.5 text-slate-500 text-xs"></i>
                            <input type="text" id="rem-search-input" placeholder="মারফত দিয়ে খুঁজুন..." class="bg-slate-950 border border-slate-700 rounded-xl pl-8 pr-3 py-1.5 text-xs text-white placeholder-slate-500 focus:border-sky-500 outline-none w-44 sm:w-56">
                        </div>
                    </div>
                </div>

                <div class="border border-slate-700 rounded-2xl overflow-x-auto text-xs shadow-inner">
                    <table class="w-full text-left border-collapse">
                        <thead>
                            <tr class="bg-slate-950 border-b border-slate-700 font-bold text-slate-300 text-xs">
                                <th class="p-3 text-center w-12 border-r border-slate-800">#</th>
                                <th class="p-3 text-center w-28 border-r border-slate-800">তারিখ</th>
                                <th class="p-3 border-r border-slate-800">বিবরণ / মারফত</th>
                                <th class="p-3 text-center w-20 border-r border-slate-800">রেট</th>
                                <th class="p-3 text-right w-36 border-r border-slate-800 text-emerald-400 font-bold">দেরহাম (AED)</th>
                                <th class="p-3 text-right w-36 border-r border-slate-800 text-red-400 font-bold">টাকা (BDT / TK)</th>
                                <th class="p-3 text-center w-24 border-r border-slate-800">স্ট্যাটাস</th>
                                <th class="p-3 text-center w-24">অ্যাকশন</th>
                            </tr>
                        </thead>
                        <tbody id="remittance-table-body">
                            <!-- Dynamic Rows -->
                        </tbody>
                        <tfoot id="remittance-table-foot">
                            <!-- Dynamic Totals -->
                        </tfoot>
                    </table>
                </div>
            </div>
        </div>
    `;

    bindRemittanceEvents();
}

function bindRemittanceEvents() {
    const bind = (id, fn) => { const el = document.getElementById(id); if (el) el.onclick = fn; };

    bind('btn-switch-to-audit', () => {
        if (window.switchDubaiProcurementView) {
            window.switchDubaiProcurementView('audit');
        }
    });

    bind('btn-switch-to-bd-expense', () => {
        if (window.switchDubaiProcurementView) {
            window.switchDubaiProcurementView('bd-expense');
        }
    });

    bind('btn-switch-to-port-duty', () => {
        if (window.switchDubaiProcurementView) {
            window.switchDubaiProcurementView('port-duty');
        }
    });

    bind('btn-switch-to-lc', () => {
        if (window.switchDubaiProcurementView) {
            window.switchDubaiProcurementView('lc-bills');
        }
    });

    bind('btn-print-remittance', () => {
        printDubaiRemittanceBook(activeConsignment, remittancesList);
    });

    bind('btn-close-consignment', onCloseConsignmentClick);

    const form = document.getElementById('form-remittance');
    if (form) form.onsubmit = onSaveRemittanceSubmit;

    const cancelBtn = document.getElementById('btn-cancel-rem-edit');
    if (cancelBtn) cancelBtn.onclick = resetRemittanceForm;

    const searchInput = document.getElementById('rem-search-input');
    if (searchInput) searchInput.oninput = renderRemittanceTable;

    // Window helpers for conversion
    window.handleRemAedChange = () => {
        const aed = parseAmount(document.getElementById('rem-input-aed')?.value || 0);
        const rate = parseAmount(document.getElementById('rem-input-rate')?.value || 0);
        if (rate > 0) {
            const bdt = calcBDTfromAED(aed, rate);
            const bdtInp = document.getElementById('rem-input-bdt');
            if (bdtInp) {
                bdtInp.value = formatAmountWithComma(bdt);
                if (window.updateLiveWords) window.updateLiveWords(bdtInp, 'rem-live-words');
            }
        }
    };

    window.handleRemBdtChange = () => {
        const bdt = parseAmount(document.getElementById('rem-input-bdt')?.value || 0);
        const rate = parseAmount(document.getElementById('rem-input-rate')?.value || 0);
        if (rate > 0) {
            const aed = calcAEDfromBDT(bdt, rate);
            const aedInp = document.getElementById('rem-input-aed');
            if (aedInp) aedInp.value = formatAmountWithComma(aed);
        }
    };
}

function updateConsignmentUI() {
    const select = document.getElementById('select-consignment');
    if (!select) return;

    select.innerHTML = consignmentsList.map(c => `
        <option value="${c.id}" ${activeConsignment?.id === c.id ? 'selected' : ''}>
            ${escapeHTML(c.name || 'কনসোলমেন্ট')} (${c.status === 'active' ? 'চলমান' : 'সমাপ্ত'})
        </option>
    `).join('');

    select.onchange = (e) => {
        activeConsignment = consignmentsList.find(c => c.id === e.target.value) || activeConsignment;
        listenToActiveRemittances();
    };

    const badge = document.getElementById('badge-consignment-status');
    if (badge && activeConsignment) {
        const isActive = activeConsignment.status === 'active';
        badge.className = `px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1.5 ${
            isActive ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
        }`;
        badge.innerHTML = `
            <i class="fa-solid fa-circle text-[7px] ${isActive ? 'text-emerald-400' : 'text-amber-400'}"></i>
            <span>${isActive ? 'চলমান কনসোলমেন্ট (Active)' : 'সমাপ্ত কনসোলমেন্ট (Closed)'}</span>
        `;
    }
}

function updateRemittanceKpis() {
    const kpiContainer = document.getElementById('remittance-kpi-container');
    if (!kpiContainer) return;

    const summary = calculateConsignmentSummary(activeConsignment, remittancesList);

    kpiContainer.innerHTML = `
        <div class="bg-slate-900/90 border border-slate-800 border-l-4 border-l-indigo-500 p-3.5 rounded-2xl shadow-xl flex flex-col gap-1">
            <span class="text-[11px] font-bold text-slate-400">১. পর্যায় ১ (২০২৫ ইনভেস্ট)</span>
            <div class="text-base font-black text-indigo-400 font-mono">${formatAmountWithComma(summary.stage1.aed)} AED</div>
            <div class="text-[11px] text-slate-400 font-semibold">৳ ${formatAmountWithComma(summary.stage1.bdt)} (রেট: ${summary.stage1.rate})</div>
        </div>

        <div class="bg-slate-900/90 border border-slate-800 border-l-4 border-l-sky-500 p-3.5 rounded-2xl shadow-xl flex flex-col gap-1">
            <span class="text-[11px] font-bold text-slate-400">২. পর্যায় ২ (২০২৬ সাবেক)</span>
            <div class="text-base font-black text-sky-400 font-mono">${formatAmountWithComma(summary.stage2.aed)} AED</div>
            <div class="text-[11px] text-slate-400 font-semibold">৳ ${formatAmountWithComma(summary.stage2.bdt)} (রেট: ${summary.stage2.rate.toFixed(2)})</div>
        </div>

        <div class="bg-slate-900/90 border border-slate-800 border-l-4 border-l-emerald-500 p-3.5 rounded-2xl shadow-xl flex flex-col gap-1">
            <span class="text-[11px] font-bold text-slate-400">৩. পর্যায় ৩ রানিং (${summary.stage3.count} কিস্তি)</span>
            <div class="text-base font-black text-emerald-400 font-mono">${formatAmountWithComma(summary.stage3.aed)} AED</div>
            <div class="text-[11px] text-slate-400 font-semibold">৳ ${formatAmountWithComma(summary.stage3.bdt)} (গড়: ${summary.stage3.rate.toFixed(2)})</div>
        </div>

        <div class="bg-amber-950/20 border border-amber-500/30 border-l-4 border-l-amber-500 p-3.5 rounded-2xl shadow-xl flex flex-col gap-1">
            <span class="text-[11px] font-black text-amber-400">৪. ১ম কনসোলমেন্ট সর্বমোট তহবিল</span>
            <div class="text-base font-black text-amber-300 font-mono">${formatAmountWithComma(summary.grandTotal.aed)} AED</div>
            <div class="text-[11px] text-amber-200/80 font-bold">৳ ${formatAmountWithComma(summary.grandTotal.bdt)} (গড়: ${summary.grandTotal.rate.toFixed(2)})</div>
        </div>
    `;

    const countEl = document.getElementById('rem-records-count');
    if (countEl) countEl.innerText = `${remittancesList.length} টি`;
}

function renderRemittanceTable() {
    const tbody = document.getElementById('remittance-table-body');
    const tfoot = document.getElementById('remittance-table-foot');
    if (!tbody || !tfoot) return;

    const query = document.getElementById('rem-search-input')?.value?.toLowerCase()?.trim() || '';
    const filtered = remittancesList.filter(e => {
        if (!query) return true;
        return (e.via || '').toLowerCase().includes(query) || (e.date || '').includes(query);
    });

    const summary = calculateConsignmentSummary(activeConsignment, remittancesList);

    // Row 0: Opening / Former Balance
    let rowsHtml = `
        <tr class="bg-sky-950/30 border-b border-sky-800/50 hover:bg-sky-950/50 transition-colors">
            <td class="p-3 text-center font-black text-sky-400 border-r border-slate-800">০</td>
            <td class="p-3 text-center text-slate-300 font-mono font-bold border-r border-slate-800">13/10/2026</td>
            <td class="p-3 font-black text-sky-300 border-r border-slate-800">সাবেক (পূর্ববর্তী কিউমুলেটিভ ব্যালেন্স)</td>
            <td class="p-3 text-center font-mono font-bold text-slate-400 border-r border-slate-800">${summary.stage2.rate.toFixed(2)}</td>
            <td class="p-3 text-right font-mono font-black text-emerald-400 border-r border-slate-800">${formatAmountWithComma(summary.stage2.aed)} AED</td>
            <td class="p-3 text-right font-mono font-black text-red-400 border-r border-slate-800">৳ ${formatAmountWithComma(summary.stage2.bdt)}</td>
            <td class="p-3 text-center border-r border-slate-800"><span class="px-2 py-0.5 rounded text-[10px] font-bold bg-sky-500/10 text-sky-400 border border-sky-500/20">সাবেক শুরু</span></td>
            <td class="p-3 text-center text-slate-500 text-xs">—</td>
        </tr>
    `;

    filtered.forEach((r, idx) => {
        const dtStr = formatAppDate(r.date);
        rowsHtml += `
            <tr class="border-b border-slate-800 hover:bg-slate-800/40 transition-colors">
                <td class="p-3 text-center font-bold text-slate-400 border-r border-slate-800">${idx + 1}</td>
                <td class="p-3 text-center text-slate-200 font-mono font-bold border-r border-slate-800">${escapeHTML(dtStr)}</td>
                <td class="p-3 font-bold text-white border-r border-slate-800">${escapeHTML(r.via || '')}</td>
                <td class="p-3 text-center font-mono font-bold text-slate-400 border-r border-slate-800">${(parseAmount(r.rate) || 0).toFixed(2)}</td>
                <td class="p-3 text-right font-mono font-black text-emerald-400 border-r border-slate-800">${formatAmountWithComma(r.aedAmount)} AED</td>
                <td class="p-3 text-right font-mono font-black text-red-400 border-r border-slate-800">৳ ${formatAmountWithComma(r.bdtAmount)}</td>
                <td class="p-3 text-center border-r border-slate-800">
                    <span class="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">${escapeHTML(r.status || 'পরিশোধিত')}</span>
                </td>
                <td class="p-3 text-center flex items-center justify-center gap-1.5">
                    <button type="button" onclick="window.editRemittanceEntry('${r.id}')" class="p-1.5 text-sky-400 hover:text-sky-300 hover:bg-slate-800 rounded-lg transition-colors cursor-pointer" title="সংশোধন"><i class="fa-solid fa-pen-to-square text-xs"></i></button>
                    <button type="button" onclick="window.deleteRemittanceEntry('${r.id}')" class="p-1.5 text-red-400 hover:text-red-300 hover:bg-slate-800 rounded-lg transition-colors cursor-pointer" title="মুছে ফেলুন"><i class="fa-solid fa-trash-can text-xs"></i></button>
                </td>
            </tr>
        `;
    });

    if (filtered.length === 0) {
        rowsHtml += `
            <tr class="border-b border-slate-800">
                <td colspan="8" class="p-6 text-center text-slate-400">
                    <div class="flex flex-col items-center justify-center gap-2">
                        <i class="fa-solid fa-cloud-arrow-down text-sky-400 text-2xl"></i>
                        <span class="font-bold text-slate-300">ডাটাবেসে কোনো এন্ট্রি পাওয়া যায়নি অথবা লোড হচ্ছে</span>
                        <p class="text-xs text-slate-500">পিডিএফ-এর ১৯টি কিস্তির এন্ট্রি ডাটাবেসে এক ক্লিকে লোড করতে নিচের বাটনে চাপ দিন:</p>
                        <button type="button" onclick="window.forceSeedRemittances()" class="mt-2 px-4 py-2 bg-sky-600 hover:bg-sky-500 text-white rounded-xl text-xs font-bold transition-all shadow-md cursor-pointer flex items-center gap-2">
                            <i class="fa-solid fa-database text-xs"></i>
                            <span>পিডিএফ-এর খাতার ১৯টি এন্ট্রি ডাটাবেসে সেভ করুন</span>
                        </button>
                    </div>
                </td>
            </tr>
        `;
    }

    tbody.innerHTML = rowsHtml;

    // Foot totals
    tfoot.innerHTML = `
        <!-- Subtotal -->
        <tr class="bg-slate-950/80 border-t-2 border-slate-700 font-bold text-xs text-slate-300">
            <td colspan="3" class="p-3 text-right border-r border-slate-800 font-bold">চলমান খাতার উপ-মোট (${summary.stage3.count} টি লেনদেন):</td>
            <td class="p-3 text-center font-mono font-bold border-r border-slate-800">${summary.stage3.rate.toFixed(2)}</td>
            <td class="p-3 text-right font-mono font-black text-emerald-400 border-r border-slate-800">${formatAmountWithComma(summary.stage3.aed)} AED</td>
            <td class="p-3 text-right font-mono font-black text-red-400 border-r border-slate-800">৳ ${formatAmountWithComma(summary.stage3.bdt)}</td>
            <td colspan="2" class="p-3 text-center font-bold text-slate-400">উপ-মোট</td>
        </tr>

        <!-- 2026 Session Total -->
        <tr class="bg-emerald-950/20 border-t border-emerald-800/40 font-bold text-xs text-emerald-400">
            <td colspan="3" class="p-3 text-right border-r border-slate-800 font-black">২০২৬ সেশনের মোট তহবিল (সাবেক সহ):</td>
            <td class="p-3 text-center font-mono font-black border-r border-slate-800">${summary.session2026.rate.toFixed(2)}</td>
            <td class="p-3 text-right font-mono font-black text-emerald-400 border-r border-slate-800">${formatAmountWithComma(summary.session2026.aed)} AED</td>
            <td class="p-3 text-right font-mono font-black text-red-400 border-r border-slate-800">৳ ${formatAmountWithComma(summary.session2026.bdt)}</td>
            <td colspan="2" class="p-3 text-center"><span class="px-2 py-0.5 rounded text-[10px] font-black bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">২০২৬ মোট</span></td>
        </tr>

        <!-- All-Time Grand Total -->
        <tr class="bg-sky-950/40 border-t-2 border-b-2 border-sky-500 font-black text-xs text-white">
            <td colspan="3" class="p-3.5 text-right border-r border-slate-800 text-sm">১ম কনসোলমেন্টের সর্বমোট তহবিল (পর্যায় ১ + ২ + ৩):</td>
            <td class="p-3.5 text-center font-mono font-black border-r border-slate-800 text-sky-400 text-sm">${summary.grandTotal.rate.toFixed(2)}</td>
            <td class="p-3.5 text-right font-mono font-black text-emerald-400 border-r border-slate-800 text-sm">${formatAmountWithComma(summary.grandTotal.aed)} AED</td>
            <td class="p-3.5 text-right font-mono font-black text-red-400 border-r border-slate-800 text-sm">৳ ${formatAmountWithComma(summary.grandTotal.bdt)}</td>
            <td colspan="2" class="p-3.5 text-center"><span class="px-2.5 py-1 rounded text-xs font-black bg-sky-600 text-white shadow-md">সর্বমোট</span></td>
        </tr>
    `;

    // Global action helpers
    window.forceSeedRemittances = async () => {
        ensureOnline();
        try {
            showToast('ডাটাবেসে লোড করা হচ্ছে...', 'info');
            await DubaiRemittanceDAO.seedInitialDataIfNeeded(true);
            showToast('পিডিএফ-এর খাতার ১৯টি এন্ট্রি সফলভাবে ডাটাবেসে লোড হয়েছে', 'success');
        } catch (e) {
            console.error('Error seeding remittances:', e);
            showToast('ডাটাবেসে লোড করতে সমস্যা হয়েছে: ' + (e.message || ''), 'error');
        }
    };

    window.editRemittanceEntry = (id) => {
        const item = remittancesList.find(r => r.id === id);
        if (!item) return;
        editingRemittanceId = id;
        const dateInp = document.getElementById('rem-input-date');
        const appDt = formatAppDate(item.date);
        if (dateInp) {
            dateInp.value = appDt;
            if (dateInp._flatpickr) {
                dateInp._flatpickr.setDate(appDt, false);
            }
        }
        document.getElementById('rem-input-via').value = item.via || '';
        document.getElementById('rem-input-rate').value = item.rate || '';
        document.getElementById('rem-input-aed').value = formatAmountWithComma(item.aedAmount);
        document.getElementById('rem-input-bdt').value = formatAmountWithComma(item.bdtAmount);
        document.getElementById('form-remittance-title').innerText = 'লেনদেন তথ্য সংশোধন করুন';
        document.getElementById('btn-save-rem-text').innerText = 'হালনাগাদ সংরক্ষণ করুন';
        document.getElementById('btn-cancel-rem-edit').classList.remove('hidden');
        if (window.updateLiveWords) window.updateLiveWords(document.getElementById('rem-input-bdt'), 'rem-live-words');
    };

    window.deleteRemittanceEntry = async (id) => {
        ensureOnline();
        const pinPassed = await promptSecurityPin();
        if (!pinPassed) return;

        const res = await Swal.fire({
            title: 'লেনদেন মুছে ফেলবেন?',
            text: 'এই টাকা পাঠানোর রেকর্ডটি স্থায়ীভাবে মুছে ফেলা হবে।',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'হ্যাঁ, মুছুন',
            cancelButtonText: 'বাতিল',
            confirmButtonColor: '#ef4444',
            cancelButtonColor: '#334155'
        });

        if (res.isConfirmed) {
            try {
                await DubaiRemittanceDAO.deleteRemittance(id);
                showToast('লেনদেন সফলভাবে মুছে ফেলা হয়েছে', 'success');
            } catch (e) {
                console.error('Delete error:', e);
                showToast('মুছতে সমস্যা হয়েছে', 'error');
            }
        }
    };
}

async function onSaveRemittanceSubmit(e) {
    e.preventDefault();
    ensureOnline();

    const dateVal = document.getElementById('rem-input-date')?.value;
    const viaVal = document.getElementById('rem-input-via')?.value?.trim();
    const rateVal = parseAmount(document.getElementById('rem-input-rate')?.value || 0);
    const aedVal = parseAmount(document.getElementById('rem-input-aed')?.value || 0);
    const bdtVal = parseAmount(document.getElementById('rem-input-bdt')?.value || 0);

    if (!dateVal || !viaVal || aedVal <= 0 || bdtVal <= 0) {
        showToast('তারিখ, মারফত, দেরহাম ও টাকার অঙ্ক সঠিকভাবে পূরণ করুন', 'error');
        return;
    }

    try {
        const payload = {
            id: editingRemittanceId || undefined,
            consignmentId: activeConsignment?.id || 'CONSIGNMENT-01',
            date: toDBDate(dateVal),
            via: viaVal,
            rate: rateVal,
            aedAmount: aedVal,
            bdtAmount: bdtVal,
            status: 'পরিশোধিত'
        };

        await DubaiRemittanceDAO.saveRemittance(payload);
        showToast(editingRemittanceId ? 'লেনদেন সফলভাবে হালনাগাদ হয়েছে' : 'নতুন রেমিট্যান্স এন্ট্রি যোগ করা হয়েছে', 'success');
        resetRemittanceForm();
    } catch (err) {
        console.error('Save remittance error:', err);
        showToast('সংরক্ষণ করতে সমস্যা হয়েছে', 'error');
    }
}

function resetRemittanceForm() {
    editingRemittanceId = null;
    document.getElementById('form-remittance')?.reset();
    const dateInp = document.getElementById('rem-input-date');
    const todayStr = getTodayLocalDateString();
    if (dateInp) {
        dateInp.value = todayStr;
        if (dateInp._flatpickr) {
            dateInp._flatpickr.setDate(todayStr, false);
        }
    }
    document.getElementById('rem-input-rate').value = '34.75';
    document.getElementById('form-remittance-title').innerText = 'নতুন টাকা পাঠানোর এন্ট্রি যোগ করুন';
    document.getElementById('btn-save-rem-text').innerText = 'এন্ট্রি যোগ করুন';
    document.getElementById('btn-cancel-rem-edit').classList.add('hidden');
    document.getElementById('rem-live-words').innerText = 'শূন্য টাকা মাত্র';
}

async function onCloseConsignmentClick() {
    ensureOnline();
    const pinPassed = await promptSecurityPin();
    if (!pinPassed) return;

    const summary = calculateConsignmentSummary(activeConsignment, remittancesList);

    const res = await Swal.fire({
        title: '১ম কনসোলমেন্ট সমাপ্ত ও ২য় শুরু?',
        html: `
            <div class="text-left text-xs font-bn text-slate-300 flex flex-col gap-2">
                <p>আপনি কি <strong>${escapeHTML(activeConsignment?.name || '১ম কনসোলমেন্ট')}</strong> আনুষ্ঠানিকভাবে ক্লোজ করতে চান?</p>
                <div class="bg-slate-800 p-2.5 rounded-lg border border-slate-700">
                    <div>• ১ম কনসোলমেন্ট সর্বমোট তহবিল: <strong class="text-emerald-400">${formatAmountWithComma(summary.grandTotal.aed)} AED</strong></div>
                    <div>• সমমূল্যের বাংলাদেশি টাকা: <strong class="text-red-400">৳ ${formatAmountWithComma(summary.grandTotal.bdt)}</strong></div>
                    <div>• চূড়ান্ত গড় রেট: <strong class="text-sky-400">${summary.grandTotal.rate.toFixed(2)}</strong></div>
                </div>
                <p class="text-amber-400 font-bold">এটি সম্পন্ন হলে ১ম কনসোলমেন্টের সমাপনী স্থিতি স্বয়ংক্রিয়ভাবে ২য় কনসোলমেন্টের প্রারম্ভিক মূলধন (Opening Balance) হিসেবে স্থানান্তরিত হবে।</p>
            </div>
        `,
        icon: 'question',
        showCancelButton: true,
        confirmButtonText: 'হ্যাঁ, ক্লোজ করে ২য় শুরু করুন',
        cancelButtonText: 'বাতিল',
        confirmButtonColor: '#0284c7',
        cancelButtonColor: '#334155'
    });

    if (res.isConfirmed) {
        try {
            await DubaiRemittanceDAO.closeConsignmentAndStartNext(
                activeConsignment.id,
                'এমরান ব্যক্তিগত ২য় কনসোলমেন্ট, ডুবাই মাল ক্রয় ইনভেস্ট',
                summary
            );
            showToast('১ম কনসোলমেন্ট ক্লোজ করে ২য় কনসোলমেন্ট সফলভাবে চালু করা হয়েছে', 'success');
        } catch (e) {
            console.error('Consignment closure error:', e);
            showToast('ক্লোজ করতে সমস্যা হয়েছে', 'error');
        }
    }
}

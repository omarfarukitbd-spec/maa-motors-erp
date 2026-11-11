/**
 * Dubai Remittance & Consignment - UI Controller
 * Manages the live cross-currency remittance register, quick-entry dock, and consignment lifecycle.
 */
// ALLOW_LARGE_FILE (Corporate Remittance & Consignment UI Controller)

import Swal from 'sweetalert2';
import { DubaiRemittanceDAO } from './dubai-remittance-dao.js';
import { calculateConsignmentSummary, calcBDTfromAED, calcAEDfromBDT, calcWeightedRate } from './dubai-remittance-calc.js';
import { printDubaiRemittanceBook } from './dubai-remittance-print.js';
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
let remittancesList = [];
let activeListenersConsId = null;
let unsubscribeRemittances = null;
let unsubscribeConsignments = null;
let editingRemittanceId = null;

export function initDubaiRemittanceModule(container) {
    if (!container) return;

    activeListenersConsId = null;
    // Seed initial data if first time
    DubaiRemittanceDAO.seedInitialDataIfNeeded().catch(e => console.error('Seed error:', e));

    renderRemittanceView(container);
    renderRemittanceTable();
    updateRemittanceKpis();
    setupRemittanceListeners();
}

export function cleanupDubaiRemittance() {
    activeListenersConsId = null;
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
        updateRemittanceKpis();
        const consId = activeConsignment?.id || 'CONSIGNMENT-01';
        if (consId !== activeListenersConsId) {
            listenToActiveRemittances();
        }
    });
}

function listenToActiveRemittances() {
    if (unsubscribeRemittances) {
        unsubscribeRemittances();
        unsubscribeRemittances = null;
    }

    const consId = activeConsignment?.id || 'CONSIGNMENT-01';
    activeListenersConsId = consId;
    unsubscribeRemittances = DubaiRemittanceDAO.listenRemittances(consId, items => {
        remittancesList = items;
        renderRemittanceTable();
        updateRemittanceKpis();
    });
}

function renderRemittanceView(container) {
    const actionButtonsHtml = `
        ${renderNothiMasterLinkPill('টাকা পাঠানোর খাতা')}
        <button type="button" id="btn-edit-stage-dates" data-perm="manageNothiEntries" class="px-3.5 py-2 bg-indigo-500/15 hover:bg-indigo-500/25 text-indigo-300 border border-indigo-500/35 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-sm" title="পর্যায় ১ ও পর্যায় ২-এর তারিখ সময়সীমা সেট বা সংশোধন করুন">
            <i class="fa-regular fa-calendar-days text-indigo-400 text-xs"></i>
            <span>তারিখ সময়সীমা</span>
        </button>
        <button type="button" id="btn-export-rem-excel" class="px-3.5 py-2 bg-teal-600/20 hover:bg-teal-600/35 text-teal-300 border border-teal-500/40 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-sm" title="Excel (.xlsx) ডাউনলোড">
            <i class="fa-solid fa-file-excel text-teal-400 text-xs"></i>
            <span>Excel</span>
        </button>
        <button type="button" id="btn-print-remittance" class="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-sm">
            <i class="fa-solid fa-print text-slate-400 text-xs"></i>
            <span>A4 প্রিন্ট / ভাউচার</span>
        </button>
        <button type="button" id="btn-close-consignment" data-perm="manageNothiEntries" class="px-3.5 py-2 bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 border border-amber-500/30 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-sm">
            <i class="fa-solid fa-lock text-xs"></i>
            <span>সেশন ক্লোজিং ও ২য় শুরু</span>
        </button>
    `;

    container.innerHTML = `
        <div class="flex flex-col gap-4 font-bn w-full max-w-6xl mx-auto px-2 sm:px-4 pb-20">
            <!-- Top Unified 2-Tier Workspace Header -->
            ${renderNothiSubBookHeader({
                activeKey: 'remittance',
                title: 'টাকা পাঠানোর খাতা (দুবাই রেমিট্যান্স বুক)',
                subtitle: 'বৈদেশিক রেমিট্যান্স, এক্সচেঞ্জ রেট ও ক্রমপুঞ্জিত তহবিল রেজিস্টার',
                pageBadge: 'খাতা পাতা: ০০০১',
                currencyBadge: 'AED & BDT',
                iconClass: 'fa-solid fa-money-bill-transfer',
                accentColor: 'emerald',
                actionButtonsHtml
            })}

            <!-- Per-Section Consignment Selector & Customizable Print Banner -->
            <div id="remittance-banner-slot"></div>

            <!-- 4 Master KPI Summary Cards -->
            <div id="remittance-kpi-container" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                <!-- Dynamically updated -->
            </div>

            <!-- Quick Entry Dock -->
            <div data-perm="manageNothiEntries" class="bg-slate-900/80 border border-slate-700/80 rounded-2xl p-4 shadow-xl flex flex-col gap-3">
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
                        <input type="number" step="0.01" id="rem-input-rate" value="34.75" oninput="window.handleRemRateChange()" class="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white font-bold font-mono focus:border-sky-500 outline-none" required>
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
    updateConsignmentUI();
}

function bindRemittanceEvents() {
    const bind = (id, fn) => { const el = document.getElementById(id); if (el) el.onclick = fn; };

    bind('btn-edit-stage-dates', openEditStageDatesModal);
    bind('btn-export-rem-excel', () => {
        const rows = remittancesList.map((r, idx) => [
            idx + 1,
            formatAppDate(r.date),
            r.via || '',
            safeRound(r.rate || 0),
            safeRound(r.aedAmount || 0),
            safeRound(r.bdtAmount || 0),
            r.status || 'পরিশোধিত'
        ]);
        const consTag = activeConsignment?.id || 'CONSIGNMENT-01';
        exportNothiRowsToExcel({
            sheetName: 'Dubai_Remittance_0001',
            headers: ['ক্রমিক', 'তারিখ', 'বিবরণ / মারফত', 'এক্সচেঞ্জ রেট', 'দেরহাম (AED)', 'টাকা (BDT)', 'স্ট্যাটাস'],
            rows,
            filename: `Nothi_0001_Remittance_${consTag}.xlsx`
        });
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

    // Window helpers for currency conversion
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

    window.handleRemRateChange = () => {
        const rate = parseAmount(document.getElementById('rem-input-rate')?.value || 0);
        if (rate <= 0) return;
        const aed = parseAmount(document.getElementById('rem-input-aed')?.value || 0);
        const bdt = parseAmount(document.getElementById('rem-input-bdt')?.value || 0);
        if (aed > 0) {
            window.handleRemAedChange();
        } else if (bdt > 0) {
            window.handleRemBdtChange();
        }
    };
}

function updateConsignmentUI() {
    mountNothiBannerBar({
        slotId: 'remittance-banner-slot',
        sectionKey: 'remittance',
        getConsignment: () => activeConsignment,
        getAllConsignments: () => consignmentsList,
        selectId: 'select-consignment',
        showSelector: true,
        onConsignmentChange: (selectedId) => {
            activeConsignment = consignmentsList.find(c => c.id === selectedId) || activeConsignment;
            updateConsignmentUI();
            listenToActiveRemittances();
        }
    });
}

function updateRemittanceKpis() {
    const kpiContainer = document.getElementById('remittance-kpi-container');
    if (!kpiContainer) return;

    const summary = calculateConsignmentSummary(activeConsignment, remittancesList);
    const isPrimarySession = (!activeConsignment?.id || activeConsignment.id === 'CONSIGNMENT-01') && !summary.isRollover;

    const stage1Title = isPrimarySession ? '১. পর্যায় ১ (২০২৫ ইনভেস্ট)' : '১. পূর্ববর্তী স্থিতি / পর্যায় ১';
    const stage2Title = isPrimarySession ? '২. পর্যায় ২ (২০২৬ সাবেক)' : '২. প্রারম্ভিক ব্যালেন্স (সাবেক B/F)';
    const grandTitle = isPrimarySession
        ? '৪. ১ম কনসোলমেন্ট সর্বমোট তহবিল'
        : '৪. চলমান সেশন সর্বমোট তহবিল';

    kpiContainer.innerHTML = `
        <div class="bg-slate-900/90 border border-slate-800 border-l-4 border-l-indigo-500 p-3.5 rounded-2xl shadow-xl flex flex-col gap-1">
            <div class="flex items-center justify-between gap-1">
                <span class="text-[11px] font-bold text-slate-400">${stage1Title}</span>
                <button type="button" onclick="window.openRemStageDatesEditor && window.openRemStageDatesEditor()" data-perm="manageNothiEntries" class="text-[10px] text-indigo-400 hover:text-indigo-300 cursor-pointer" title="তারিখ এডিট করুন"><i class="fa-solid fa-pen"></i></button>
            </div>
            <div class="text-[10px] font-mono font-bold text-indigo-300 bg-indigo-500/10 border border-indigo-500/20 rounded-md px-2 py-0.5 self-start">
                <i class="fa-regular fa-calendar-days mr-1"></i>${escapeHTML(summary.stage1.dates)}
            </div>
            <div class="text-base font-black text-indigo-400 font-mono">${formatAmountWithComma(summary.stage1.aed)} AED</div>
            <div class="text-[11px] text-slate-400 font-semibold">৳ ${formatAmountWithComma(summary.stage1.bdt)} (রেট: ${Number(summary.stage1.rate || 0).toFixed(2)})</div>
        </div>

        <div class="bg-slate-900/90 border border-slate-800 border-l-4 border-l-sky-500 p-3.5 rounded-2xl shadow-xl flex flex-col gap-1">
            <div class="flex items-center justify-between gap-1">
                <span class="text-[11px] font-bold text-slate-400">${stage2Title}</span>
                <button type="button" onclick="window.openRemStageDatesEditor && window.openRemStageDatesEditor()" data-perm="manageNothiEntries" class="text-[10px] text-sky-400 hover:text-sky-300 cursor-pointer" title="তারিখ এডিট করুন"><i class="fa-solid fa-pen"></i></button>
            </div>
            <div class="text-[10px] font-mono font-bold text-sky-300 bg-sky-500/10 border border-sky-500/20 rounded-md px-2 py-0.5 self-start">
                <i class="fa-regular fa-calendar-days mr-1"></i>${escapeHTML(summary.stage2.dates || 'প্রারম্ভিক')}
            </div>
            <div class="text-base font-black text-sky-400 font-mono">${formatAmountWithComma(summary.stage2.aed)} AED</div>
            <div class="text-[11px] text-slate-400 font-semibold">৳ ${formatAmountWithComma(summary.stage2.bdt)} (রেট: ${Number(summary.stage2.rate || 0).toFixed(2)})</div>
        </div>

        <div class="bg-slate-900/90 border border-slate-800 border-l-4 border-l-emerald-500 p-3.5 rounded-2xl shadow-xl flex flex-col gap-1">
            <span class="text-[11px] font-bold text-slate-400">৩. পর্যায় ৩ রানিং (${summary.stage3.count} কিস্তি)</span>
            <div class="text-[10px] font-mono font-bold text-emerald-300 bg-emerald-500/10 border border-emerald-500/20 rounded-md px-2 py-0.5 self-start">
                <i class="fa-regular fa-calendar-days mr-1"></i>${escapeHTML(summary.stage3.dates)}
            </div>
            <div class="text-base font-black text-emerald-400 font-mono">${formatAmountWithComma(summary.stage3.aed)} AED</div>
            <div class="text-[11px] text-slate-400 font-semibold">৳ ${formatAmountWithComma(summary.stage3.bdt)} (গড়: ${Number(summary.stage3.rate || 0).toFixed(2)})</div>
        </div>

        <div class="bg-amber-950/20 border border-amber-500/30 border-l-4 border-l-amber-500 p-3.5 rounded-2xl shadow-xl flex flex-col gap-1">
            <span class="text-[11px] font-black text-amber-400">${grandTitle}</span>
            <div class="text-[10px] font-mono font-bold text-amber-300 bg-amber-500/10 border border-amber-500/20 rounded-md px-2 py-0.5 self-start">
                <i class="fa-regular fa-calendar-days mr-1"></i>${escapeHTML(summary.grandTotal.dates)}
            </div>
            <div class="text-base font-black text-amber-300 font-mono">${formatAmountWithComma(summary.grandTotal.aed)} AED</div>
            <div class="text-[11px] text-amber-200/80 font-bold">৳ ${formatAmountWithComma(summary.grandTotal.bdt)} (গড়: ${Number(summary.grandTotal.rate || 0).toFixed(2)})</div>
        </div>
    `;

    window.openRemStageDatesEditor = openEditStageDatesModal;

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
    const isPrimarySession = (!activeConsignment?.id || activeConsignment.id === 'CONSIGNMENT-01') && !summary.isRollover;
    const formerDateLabel = isPrimarySession ? '13/10/2026' : (summary.stage2.dates || 'প্রারম্ভিক');
    const formerDescLabel = isPrimarySession
        ? 'সাবেক (পূর্ববর্তী কিউমুলেটিভ ব্যালেন্স)'
        : (summary.isRollover ? 'সাবেক (পূর্ববর্তী কনসোলমেন্ট থেকে স্থানান্তরিত ব্যালেন্স)' : 'প্রারম্ভিক ব্যালেন্স (B/F)');
    const sessionSubtotalLabel = isPrimarySession
        ? '২০২৬ সেশনের মোট তহবিল (সাবেক সহ):'
        : 'চলমান সেশনের মোট তহবিল (সাবেক সহ):';
    const sessionSubtotalBadge = isPrimarySession ? '২০২৬ মোট' : 'সেশন মোট';
    const grandRowLabel = isPrimarySession
        ? '১ম কনসোলমেন্টের সর্বমোট তহবিল (পর্যায় ১ + ২ + ৩):'
        : `${escapeHTML(activeConsignment?.name || 'চলমান সেশন')} সর্বমোট তহবিল:`;

    // Row 0: Opening / Former Balance
    let rowsHtml = `
        <tr class="bg-sky-950/30 border-b border-sky-800/50 hover:bg-sky-950/50 transition-colors">
            <td class="p-3 text-center font-black text-sky-400 border-r border-slate-800">০</td>
            <td class="p-3 text-center text-slate-300 font-mono font-bold border-r border-slate-800">${escapeHTML(formerDateLabel)}</td>
            <td class="p-3 font-black text-sky-300 border-r border-slate-800">${formerDescLabel}</td>
            <td class="p-3 text-center font-mono font-bold text-slate-400 border-r border-slate-800">${Number(summary.stage2.rate || 0).toFixed(2)}</td>
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
                    <button type="button" onclick="window.editRemittanceEntry('${r.id}')" data-perm="manageNothiEntries" class="p-1.5 text-sky-400 hover:text-sky-300 hover:bg-slate-800 rounded-lg transition-colors cursor-pointer" title="সংশোধন"><i class="fa-solid fa-pen-to-square text-xs"></i></button>
                    <button type="button" onclick="window.deleteRemittanceEntry('${r.id}')" data-perm="deleteNothiEntries" class="p-1.5 text-red-400 hover:text-red-300 hover:bg-slate-800 rounded-lg transition-colors cursor-pointer" title="মুছে ফেলুন"><i class="fa-solid fa-trash-can text-xs"></i></button>
                </td>
            </tr>
        `;
    });

    if (filtered.length === 0) {
        const emptyHtml = isPrimarySession && remittancesList.length === 0
            ? `
                <div class="flex flex-col items-center justify-center gap-2">
                    <i class="fa-solid fa-cloud-arrow-down text-sky-400 text-2xl"></i>
                    <span class="font-bold text-slate-300">ডাটাবেসে কোনো এন্ট্রি পাওয়া যায়নি অথবা লোড হচ্ছে</span>
                    <p class="text-xs text-slate-500">পিডিএফ-এর ১৯টি কিস্তির এন্ট্রি ডাটাবেসে এক ক্লিকে লোড করতে নিচের বাটনে চাপ দিন:</p>
                    <button type="button" onclick="window.forceSeedRemittances()" data-perm="manageNothiEntries" class="mt-2 px-4 py-2 bg-sky-600 hover:bg-sky-500 text-white rounded-xl text-xs font-bold transition-all shadow-md cursor-pointer flex items-center gap-2">
                        <i class="fa-solid fa-database text-xs"></i>
                        <span>পিডিএফ-এর খাতার ১৯টি এন্ট্রি ডাটাবেসে সেভ করুন</span>
                    </button>
                </div>
            `
            : `<span class="text-slate-400 font-semibold">${query ? 'অনুসন্ধান অনুযায়ী কোনো লেনদেন পাওয়া যায়নি।' : 'এই কনসোলমেন্টে এখনো কোনো রেমিট্যান্স এন্ট্রি যোগ করা হয়নি।'}</span>`;

        rowsHtml += `
            <tr class="border-b border-slate-800">
                <td colspan="8" class="p-6 text-center text-slate-400">${emptyHtml}</td>
            </tr>
        `;
    }

    tbody.innerHTML = rowsHtml;

    let filteredSubtotalRow = '';
    if (query) {
        const fAed = safeRound(filtered.reduce((s, r) => s + parseAmount(r.aedAmount || 0), 0));
        const fBdt = safeRound(filtered.reduce((s, r) => s + parseAmount(r.bdtAmount || 0), 0));
        const fRate = calcWeightedRate(fBdt, fAed);
        filteredSubtotalRow = `
            <tr class="bg-amber-950/25 border-t border-amber-500/30 font-bold text-xs text-amber-300">
                <td colspan="3" class="p-3 text-right border-r border-slate-800">সার্চ ফলাফল উপ-মোট (${filtered.length} টি লেনদেন):</td>
                <td class="p-3 text-center font-mono border-r border-slate-800">${fRate.toFixed(2)}</td>
                <td class="p-3 text-right font-mono font-black text-emerald-400 border-r border-slate-800">${formatAmountWithComma(fAed)} AED</td>
                <td class="p-3 text-right font-mono font-black text-red-400 border-r border-slate-800">৳ ${formatAmountWithComma(fBdt)}</td>
                <td colspan="2" class="p-3 text-center text-amber-400">ফিল্টার মোট</td>
            </tr>
        `;
    }

    // Foot totals
    tfoot.innerHTML = `
        ${filteredSubtotalRow}
        <!-- Subtotal -->
        <tr class="bg-slate-950/80 border-t-2 border-slate-700 font-bold text-xs text-slate-300">
            <td colspan="3" class="p-3 text-right border-r border-slate-800 font-bold">চলমান খাতার উপ-মোট (${summary.stage3.count} টি লেনদেন):</td>
            <td class="p-3 text-center font-mono font-bold border-r border-slate-800">${Number(summary.stage3.rate || 0).toFixed(2)}</td>
            <td class="p-3 text-right font-mono font-black text-emerald-400 border-r border-slate-800">${formatAmountWithComma(summary.stage3.aed)} AED</td>
            <td class="p-3 text-right font-mono font-black text-red-400 border-r border-slate-800">৳ ${formatAmountWithComma(summary.stage3.bdt)}</td>
            <td colspan="2" class="p-3 text-center font-bold text-slate-400">উপ-মোট</td>
        </tr>

        <!-- Session Running + Stage 2 Total -->
        <tr class="bg-emerald-950/20 border-t border-emerald-800/40 font-bold text-xs text-emerald-400">
            <td colspan="3" class="p-3 text-right border-r border-slate-800 font-black">${sessionSubtotalLabel}</td>
            <td class="p-3 text-center font-mono font-black border-r border-slate-800">${Number(summary.session2026.rate || 0).toFixed(2)}</td>
            <td class="p-3 text-right font-mono font-black text-emerald-400 border-r border-slate-800">${formatAmountWithComma(summary.session2026.aed)} AED</td>
            <td class="p-3 text-right font-mono font-black text-red-400 border-r border-slate-800">৳ ${formatAmountWithComma(summary.session2026.bdt)}</td>
            <td colspan="2" class="p-3 text-center"><span class="px-2 py-0.5 rounded text-[10px] font-black bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">${sessionSubtotalBadge}</span></td>
        </tr>

        <!-- All-Time Grand Total -->
        <tr class="bg-sky-950/40 border-t-2 border-b-2 border-sky-500 font-black text-xs text-white">
            <td colspan="3" class="p-3.5 text-right border-r border-slate-800 text-sm">${grandRowLabel}</td>
            <td class="p-3.5 text-center font-mono font-black border-r border-slate-800 text-sky-400 text-sm">${Number(summary.grandTotal.rate || 0).toFixed(2)}</td>
            <td class="p-3.5 text-right font-mono font-black text-emerald-400 border-r border-slate-800 text-sm">${formatAmountWithComma(summary.grandTotal.aed)} AED</td>
            <td class="p-3.5 text-right font-mono font-black text-red-400 border-r border-slate-800 text-sm">৳ ${formatAmountWithComma(summary.grandTotal.bdt)}</td>
            <td colspan="2" class="p-3.5 text-center"><span class="px-2.5 py-1 rounded text-xs font-black bg-sky-600 text-white shadow-md">সর্বমোট</span></td>
        </tr>
    `;

    // Global action helpers
    window.forceSeedRemittances = async () => {
        if (!ensureOnline('ডাটাবেস সিড করা')) return;
        const pinOk = await promptSecurityPin('প্রাথমিক ১৯টি এন্ট্রি ডাটাবেসে লোড করতে সিকিউরিটি পিন দিন');
        if (!pinOk) return;
        try {
            showToast('ডাটাবেসে লোড করা হচ্ছে...', 'info');
            await DubaiRemittanceDAO.seedInitialDataIfNeeded(true);
            showToast('পিডিএফ-এর খাতার ১৯টি এন্ট্রি সফলভাবে ডাটাবেসে লোড হয়েছে', 'success');
        } catch (e) {
            console.error('Error seeding remittances:', e);
            showToast('ডাটাবেসে লোড করতে সমস্যা হয়েছে: ' + (e.message || ''), 'error');
        }
    };

    window.editRemittanceEntry = async (id) => {
        const item = remittancesList.find(r => r.id === id);
        if (!item) return;
        const pinOk = await promptSecurityPin('রেমিট্যান্স এন্ট্রি সংশোধন করতে সিকিউরিটি পিন দিন');
        if (!pinOk) return;
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
        if (!ensureOnline('রেমিট্যান্স এন্ট্রি মুছে ফেলা')) return;
        const pinPassed = await promptSecurityPin('টাকা পাঠানোর রেকর্ড মুছে ফেলতে সিকিউরিটি পিন দিন');
        if (!pinPassed) return;

        const confirmed = await confirmNothiAction({
            title: 'লেনদেন মুছে ফেলবেন?',
            text: 'এই টাকা পাঠানোর রেকর্ডটি রিসাইকেল বিনে সরানো হবে এবং বর্তমান খাতা থেকে মুছে যাবে।',
            confirmButtonText: 'হ্যাঁ, মুছুন',
            confirmButtonColor: '#ef4444'
        });

        if (confirmed) {
            try {
                const snapshot = remittancesList.find(r => r.id === id) || null;
                await DubaiRemittanceDAO.deleteRemittance(id, snapshot);
                showToast('লেনদেন রিসাইকেল বিনে সরানো হয়েছে', 'success');
            } catch (e) {
                console.error('Delete error:', e);
                showToast('মুছতে সমস্যা হয়েছে', 'error');
            }
        }
    };
}

async function onSaveRemittanceSubmit(e) {
    e.preventDefault();
    if (!ensureOnline('রেমিট্যান্স এন্ট্রি সংরক্ষণ')) return;

    const dateVal = document.getElementById('rem-input-date')?.value;
    const viaVal = document.getElementById('rem-input-via')?.value?.trim();
    const rateVal = safeRound(parseAmount(document.getElementById('rem-input-rate')?.value || 0));
    const aedVal = safeRound(parseAmount(document.getElementById('rem-input-aed')?.value || 0));
    const bdtVal = safeRound(parseAmount(document.getElementById('rem-input-bdt')?.value || 0));

    if (!dateVal || !viaVal || rateVal <= 0 || aedVal <= 0 || bdtVal <= 0) {
        showToast('তারিখ, মারফত, রেট, দেরহাম ও টাকার অঙ্ক সঠিকভাবে পূরণ করুন', 'error');
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
    if (!activeConsignment) return;
    if (activeConsignment.status === 'closed') {
        showToast('এই কনসোলমেন্টটি ইতিমধ্যেই সমাপ্ত (Closed) অবস্থায় রয়েছে', 'error');
        return;
    }
    if (!ensureOnline('কনসোলমেন্ট ক্লোজ করা')) return;
    const pinPassed = await promptSecurityPin('সেশন ক্লোজিং এবং পরবর্তী সেশন চালু করতে সিকিউরিটি পিন দিন');
    if (!pinPassed) return;

    const summary = calculateConsignmentSummary(activeConsignment, remittancesList);
    const nextSessionNum = consignmentsList.length + 1;
    const defaultNextName = `কনসোলমেন্ট / মূল হিসাব সেশন ০${nextSessionNum}`;

    const res = await Swal.fire({
        title: `<span class="font-bn text-lg font-black text-white">বর্তমান সেশন সমাপ্ত ও নতুন সেশন শুরু?</span>`,
        background: '#0f172a',
        color: '#f8fafc',
        html: `
            <div class="text-left text-xs font-bn text-slate-300 flex flex-col gap-2.5">
                <p>আপনি কি <strong>${escapeHTML(activeConsignment?.name || 'চলমান কনসোলমেন্ট')}</strong> আনুষ্ঠানিকভাবে ক্লোজ করতে চান?</p>
                <div class="bg-slate-800/90 p-2.5 rounded-xl border border-slate-700 space-y-1">
                    <div>• সমাপনী মোট তহবিল: <strong class="text-emerald-400 font-mono">${formatAmountWithComma(summary.grandTotal.aed)} AED</strong></div>
                    <div>• সমমূল্যের বাংলাদেশি টাকা: <strong class="text-red-400 font-mono">৳ ${formatAmountWithComma(summary.grandTotal.bdt)}</strong></div>
                    <div>• চূড়ান্ত গড় রেট: <strong class="text-sky-400 font-mono">${Number(summary.grandTotal.rate || 0).toFixed(2)}</strong></div>
                </div>
                <div>
                    <label class="block text-[11px] font-bold text-slate-300 mb-1">পরবর্তী নতুন সেশনের নাম:</label>
                    <input type="text" id="swal-next-cons-name" value="${escapeHTML(defaultNextName)}" class="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white font-bold outline-none focus:border-sky-500">
                </div>
                <p class="text-amber-400 font-bold">এটি সম্পন্ন হলে সমাপনী স্থিতি স্বয়ংক্রিয়ভাবে নতুন সেশনের প্রারম্ভিক মূলধন (Opening Balance) হিসেবে স্থানান্তরিত হবে।</p>
            </div>
        `,
        icon: 'question',
        showCancelButton: true,
        confirmButtonText: 'হ্যাঁ, ক্লোজ করে নতুন শুরু করুন',
        cancelButtonText: 'বাতিল',
        confirmButtonColor: '#0284c7',
        cancelButtonColor: '#334155',
        preConfirm: () => {
            const nameVal = document.getElementById('swal-next-cons-name')?.value?.trim();
            return nameVal || defaultNextName;
        }
    });

    if (res.isConfirmed) {
        try {
            await DubaiRemittanceDAO.closeConsignmentAndStartNext(
                activeConsignment.id,
                res.value || defaultNextName,
                summary
            );
            showToast('বর্তমান সেশন ক্লোজ করে নতুন সেশন সফলভাবে চালু করা হয়েছে', 'success');
        } catch (e) {
            console.error('Consignment closure error:', e);
            showToast('ক্লোজ করতে সমস্যা হয়েছে', 'error');
        }
    }
}

async function openEditStageDatesModal() {
    if (!activeConsignment) return;
    const summary = calculateConsignmentSummary(activeConsignment, remittancesList);

    const parsePair = (str) => {
        const m = String(str || '').match(/\d{2}\/\d{2}\/\d{4}/g);
        return { start: m?.[0] || '', end: m?.[1] || '' };
    };
    const s1 = parsePair(summary.stage1.dates);
    const s2 = parsePair(summary.stage2.dates);

    const res = await Swal.fire({
        title: '<span class="font-bn text-lg font-black text-white"><i class="fa-regular fa-calendar-days text-indigo-400 mr-2"></i>পর্যায়ভিত্তিক তারিখ সময়সীমা সেট করুন</span>',
        width: '560px',
        background: '#0f172a',
        color: '#f8fafc',
        html: `
            <div class="font-bn text-left space-y-3.5 text-xs mt-2">
                <div class="bg-indigo-950/25 border border-indigo-500/30 rounded-xl p-3 space-y-2">
                    <div class="font-black text-indigo-300">১. পর্যায় ১ (২০২৫ ইনভেস্ট) — কত তারিখ হতে কত তারিখ:</div>
                    <div class="grid grid-cols-2 gap-2.5">
                        <div>
                            <label class="block text-[10px] text-slate-400 mb-1">শুরুর তারিখ (হতে):</label>
                            <input type="text" id="swal-s1-start" value="${escapeHTML(s1.start)}" placeholder="DD/MM/YYYY" class="datepicker w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white font-bold font-mono outline-none">
                        </div>
                        <div>
                            <label class="block text-[10px] text-slate-400 mb-1">শেষ তারিখ (পর্যন্ত):</label>
                            <input type="text" id="swal-s1-end" value="${escapeHTML(s1.end)}" placeholder="DD/MM/YYYY" class="datepicker w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white font-bold font-mono outline-none">
                        </div>
                    </div>
                </div>

                <div class="bg-sky-950/25 border border-sky-500/30 rounded-xl p-3 space-y-2">
                    <div class="font-black text-sky-300">২. পর্যায় ২ সাবেক (২০২৬ সাবেক) — কত তারিখ হতে কত তারিখ:</div>
                    <div class="grid grid-cols-2 gap-2.5">
                        <div>
                            <label class="block text-[10px] text-slate-400 mb-1">শুরুর তারিখ (হতে):</label>
                            <input type="text" id="swal-s2-start" value="${escapeHTML(s2.start)}" placeholder="DD/MM/YYYY" class="datepicker w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white font-bold font-mono outline-none">
                        </div>
                        <div>
                            <label class="block text-[10px] text-slate-400 mb-1">শেষ তারিখ (পর্যন্ত):</label>
                            <input type="text" id="swal-s2-end" value="${escapeHTML(s2.end)}" placeholder="DD/MM/YYYY" class="datepicker w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white font-bold font-mono outline-none">
                        </div>
                    </div>
                </div>

                <div class="bg-slate-900 border border-slate-800 rounded-xl p-2.5 text-[11px] text-slate-400">
                    <i class="fa-solid fa-wand-magic-sparkles text-emerald-400 mr-1"></i>
                    পর্যায় ৩ রানিং (<strong class="text-emerald-300 font-mono">${escapeHTML(summary.stage3.dates)}</strong>) ও সর্বমোট তহবিলের তারিখ প্রকৃত এন্ট্রি থেকে স্বয়ংক্রিয়ভাবে হিসাব হয়।
                </div>
            </div>
        `,
        showCancelButton: true,
        confirmButtonText: '<i class="fa-solid fa-check mr-1"></i> তারিখ সংরক্ষণ করুন',
        cancelButtonText: 'বাতিল',
        confirmButtonColor: '#4f46e5',
        cancelButtonColor: '#334155',
        preConfirm: () => {
            const joinRange = (a, b) => (a && b ? `${a} - ${b}` : (a || b || ''));
            const s1a = document.getElementById('swal-s1-start')?.value?.trim() || '';
            const s1b = document.getElementById('swal-s1-end')?.value?.trim() || '';
            const s2a = document.getElementById('swal-s2-start')?.value?.trim() || '';
            const s2b = document.getElementById('swal-s2-end')?.value?.trim() || '';
            const stage1Dates = joinRange(s1a, s1b);
            const stage2Dates = joinRange(s2a, s2b);
            if (!stage2Dates) {
                Swal.showValidationMessage('পর্যায় ২-এর শুরুর ও শেষ তারিখ প্রদান করুন!');
                return false;
            }
            return { stage1Dates: stage1Dates || '—', stage2Dates };
        }
    });

    if (!res.isConfirmed || !res.value) return;
    if (!ensureOnline()) return;

    const pinOk = await promptSecurityPin('পর্যায়ের তারিখ সময়সীমা পরিবর্তনের জন্য পিন দিন');
    if (!pinOk) return;

    try {
        await DubaiRemittanceDAO.updateStageDates(activeConsignment.id, res.value);
        showToast('পর্যায়ভিত্তিক তারিখ সময়সীমা সফলভাবে আপডেট হয়েছে', 'success');
    } catch (e) {
        console.error('Update stage dates error:', e);
        showToast('তারিখ সংরক্ষণ করতে সমস্যা হয়েছে!', 'error');
    }
}

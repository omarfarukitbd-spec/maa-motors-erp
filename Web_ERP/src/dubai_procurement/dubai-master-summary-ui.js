/**
 * Master Consolidated CapEx & Liquidity Summary UI (নথি খাতা পাতা: ০০০৬)
 * Dedicated single-source-of-truth dashboard combining Books ০০০১–০০০৫:
 *   - 4-Tier Master CapEx Cards & Interactive Combination Simulator
 *   - Per-Container 0003 (L/C) + 0004 (Port Duty) Landed Cost Matrix
 *   - Dubai AED Cash Liquidity & Weekly Audit Reconciliation (০০০৫)
 */

import { DubaiRemittanceDAO } from './dubai-remittance-dao.js';
import { DubaiBDExpenseDAO } from './dubai-bd-expense-dao.js';
import { DubaiLCDAO } from './dubai-lc-dao.js';
import { DubaiPortDutyDAO } from './dubai-port-duty-dao.js';
import { DubaiDAO } from './dubai-dao.js';
import { calculateConsignmentSummary } from './dubai-remittance-calc.js';
import { calculateBDExpenseSummary } from './dubai-bd-expense-calc.js';
import { calculateLCSummary } from './dubai-lc-calc.js';
import { calculatePortDutySummary } from './dubai-port-duty-calc.js';
import {
    calculateMaster4TierCapEx,
    buildContainerLandedCostMatrix,
    calculateDubaiLiquiditySummary
} from './dubai-capex-calc.js';
import { renderNothiSubBookHeader } from './dubai-subbook-header.js';
import { mountNothiBannerBar } from './dubai-banner-editor-modal.js';
import { printDubaiMasterSummary } from './dubai-master-summary-print.js';
import { exportNothiRowsToExcel } from './dubai-nothi-helpers.js';
import {
    formatAmountWithComma,
    safeRound,
    formatAppDate,
    escapeHTML,
    numberToBanglaWords,
    showToast
} from '../utils.js';

let activeConsignment = null;
let consignmentsList = [];
let remittancesList = [];
let bdExpensesList = [];
let lcBillsList = [];
let portDutyBillsList = [];
let weeklyAuditsList = [];

let activeListenersConsId = null;
let unsubConsignments = null;
let unsubRemittances = null;
let unsubBdExpenses = null;
let unsubLcBills = null;
let unsubPortDuty = null;
let unsubAudits = null;

const comboFlags = {
    includeDubai: true,
    includeLC: true,
    includePort: true,
    includeBD: true
};

export function initDubaiMasterSummaryModule(container) {
    if (!container) return;

    activeListenersConsId = null;
    comboFlags.includeDubai = true;
    comboFlags.includeLC = true;
    comboFlags.includePort = true;
    comboFlags.includeBD = true;

    renderMasterSummaryShell(container);
    setupMasterListeners();
}

export function cleanupDubaiMasterSummary() {
    activeListenersConsId = null;
    [unsubConsignments, unsubRemittances, unsubBdExpenses, unsubLcBills, unsubPortDuty, unsubAudits]
        .forEach(fn => { if (typeof fn === 'function') fn(); });
    unsubConsignments = null;
    unsubRemittances = null;
    unsubBdExpenses = null;
    unsubLcBills = null;
    unsubPortDuty = null;
    unsubAudits = null;
}

function setupMasterListeners() {
    if (unsubConsignments) {
        unsubConsignments();
        unsubConsignments = null;
    }

    unsubConsignments = DubaiRemittanceDAO.listenConsignments(consignments => {
        consignmentsList = consignments || [];
        if (consignmentsList.length > 0) {
            if (activeConsignment?.id) {
                activeConsignment = consignmentsList.find(c => c.id === activeConsignment.id)
                    || consignmentsList.find(c => c.status === 'active')
                    || consignmentsList[0];
            } else {
                activeConsignment = consignmentsList.find(c => c.status === 'active') || consignmentsList[0];
            }
        }
        updateMasterBanner();
        const consId = activeConsignment?.id || 'CONSIGNMENT-01';
        if (consId !== activeListenersConsId) {
            listenToConsignmentBooks(consId);
        } else {
            refreshMasterDashboard();
        }
    });

    const initialConsId = activeConsignment?.id || 'CONSIGNMENT-01';
    if (initialConsId !== activeListenersConsId) {
        listenToConsignmentBooks(initialConsId);
    }
}

function listenToConsignmentBooks(consId) {
    [unsubRemittances, unsubBdExpenses, unsubLcBills, unsubPortDuty, unsubAudits]
        .forEach(fn => { if (typeof fn === 'function') fn(); });

    activeListenersConsId = consId;

    unsubRemittances = DubaiRemittanceDAO.listenRemittances(consId, items => {
        remittancesList = items || [];
        refreshMasterDashboard();
    });

    unsubBdExpenses = DubaiBDExpenseDAO.listenBDExpenses(consId, items => {
        bdExpensesList = items || [];
        refreshMasterDashboard();
    });

    unsubLcBills = DubaiLCDAO.listenLCBills(consId, items => {
        lcBillsList = items || [];
        refreshMasterDashboard();
    });

    unsubPortDuty = DubaiPortDutyDAO.listenPortDutyBills(consId, items => {
        portDutyBillsList = items || [];
        refreshMasterDashboard();
    });

    unsubAudits = DubaiDAO.listenWeeklyAudits(items => {
        weeklyAuditsList = items || [];
        refreshMasterDashboard();
    });
}

function computeAllSnapshots() {
    const consId = activeConsignment?.id || 'CONSIGNMENT-01';
    const dubaiSummary = calculateConsignmentSummary(activeConsignment, remittancesList);
    const bdSummary = calculateBDExpenseSummary(activeConsignment, bdExpensesList);
    const lcSummary = calculateLCSummary(activeConsignment, lcBillsList);
    const portSummary = calculatePortDutySummary(activeConsignment, portDutyBillsList);
    const capex = calculateMaster4TierCapEx(dubaiSummary, lcSummary, portSummary, bdSummary, comboFlags);
    const matrix = buildContainerLandedCostMatrix(lcBillsList, portDutyBillsList);

    const scopedAudits = weeklyAuditsList
        .filter(a => (a.consignmentId || 'CONSIGNMENT-01') === consId)
        .sort((a, b) => String(b.weekEndDate || '').localeCompare(String(a.weekEndDate || '')));
    const latestAudit = scopedAudits[0] || null;
    const liquidity = calculateDubaiLiquiditySummary(dubaiSummary, latestAudit);

    return { dubaiSummary, bdSummary, lcSummary, portSummary, capex, matrix, liquidity };
}

function renderMasterSummaryShell(container) {
    const actionButtonsHtml = `
        <button type="button" id="btn-master-export-excel" class="px-3.5 py-2 bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 border border-emerald-500/35 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-sm">
            <i class="fa-solid fa-file-excel text-emerald-400 text-xs"></i>
            <span>এক্সেল রিপোর্ট</span>
        </button>
        <button type="button" id="btn-master-print" class="px-3.5 py-2 bg-purple-600 hover:bg-purple-500 text-white border border-purple-400/40 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-lg shadow-purple-900/30">
            <i class="fa-solid fa-print text-xs"></i>
            <span>A4 সমন্বিত প্রিন্ট</span>
        </button>
    `;

    container.innerHTML = `
        <div class="flex flex-col gap-4 font-bn w-full max-w-6xl mx-auto px-2 sm:px-4 pb-20">
            ${renderNothiSubBookHeader({
                activeKey: 'master-summary',
                title: 'সমন্বিত মোট হিসাব ও প্রজেক্ট পুঁজী',
                subtitle: '০০০১ থেকে ০০০৫ সব খাতার একীভূত ল্যান্ডেড কস্ট, কন্টেইনার ম্যাট্রিক্স ও দুবাই তারল্য',
                pageBadge: 'খাতা পাতা: ০০০৬',
                currencyBadge: 'BDT & AED (সমন্বিত)',
                iconClass: 'fa-solid fa-chart-pie',
                accentColor: 'purple',
                actionButtonsHtml
            })}

            <div id="master-summary-banner-slot"></div>

            <!-- Section 1: 4 Individual Sub-Book Pillars -->
            <div id="master-tier-cards" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3"></div>

            <!-- Section 2: Interactive Single-Source-of-Truth Combination Simulator -->
            <div id="master-simulator-panel" class="bg-gradient-to-br from-slate-900 via-purple-950/25 to-slate-900 border border-purple-500/35 rounded-2xl p-4 sm:p-5 shadow-2xl"></div>

            <!-- Section 3: Per-Container Landed Cost Matrix (0003 + 0004) -->
            <div class="bg-slate-900/80 border border-slate-800 rounded-2xl shadow-xl overflow-hidden">
                <div class="px-4 py-3 border-b border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-2 bg-slate-950/50">
                    <div class="flex items-center gap-2">
                        <i class="fa-solid fa-boxes-stacked text-indigo-400"></i>
                        <h3 class="text-sm font-black text-white">কন্টেইনার ভিত্তিক মোট খরচ ম্যাট্রিক্স (০০০৩ L/C + ০০০৪ পোর্ট ও ডিউটি)</h3>
                    </div>
                    <div class="flex items-center gap-2 text-[11px] font-bold">
                        <button type="button" onclick="window.switchDubaiProcurementView('lc-bills')" class="px-2.5 py-1 rounded-lg bg-cyan-500/10 text-cyan-300 border border-cyan-500/25 hover:bg-cyan-500/20 transition-all cursor-pointer">খাতা ০০০৩ খুলুন</button>
                        <button type="button" onclick="window.switchDubaiProcurementView('port-duty')" class="px-2.5 py-1 rounded-lg bg-indigo-500/10 text-indigo-300 border border-indigo-500/25 hover:bg-indigo-500/20 transition-all cursor-pointer">খাতা ০০০৪ খুলুন</button>
                    </div>
                </div>
                <div class="overflow-x-auto">
                    <table class="w-full text-left border-collapse">
                        <thead>
                            <tr class="bg-slate-950/80 border-b border-slate-800 text-[11px] font-bold text-slate-400">
                                <th class="p-3 text-center w-20 border-r border-slate-800">কন্টেইনার</th>
                                <th class="p-3 text-left border-r border-slate-800">কোম্পানি / এলসি নং</th>
                                <th class="p-3 text-center w-24 border-r border-slate-800">সাইজ</th>
                                <th class="p-3 text-right w-28 border-r border-slate-800 text-cyan-400">L/C (USD)</th>
                                <th class="p-3 text-right w-36 border-r border-slate-800 text-cyan-400">L/C ও ব্যাংক (০০০৩)</th>
                                <th class="p-3 text-right w-36 border-r border-slate-800 text-indigo-400">পোর্ট ও ডিউটি (০০০৪)</th>
                                <th class="p-3 text-right w-40 border-r border-slate-800 text-purple-300">মোট কন্টেইনার ব্যয়</th>
                                <th class="p-3 text-center w-32">স্ট্যাটাস</th>
                            </tr>
                        </thead>
                        <tbody id="master-container-matrix-body" class="divide-y divide-slate-800/60 text-xs text-slate-300"></tbody>
                    </table>
                </div>
            </div>

            <!-- Section 4: Dubai Foreign Liquidity Reconciliation (0001 vs 0005 in AED) -->
            <div id="master-liquidity-panel" class="bg-slate-900/80 border border-sky-500/30 rounded-2xl p-4 sm:p-5 shadow-xl"></div>
        </div>
    `;

    bindMasterEvents();
    updateMasterBanner();
    refreshMasterDashboard();
}

function bindMasterEvents() {
    const printBtn = document.getElementById('btn-master-print');
    if (printBtn) {
        printBtn.onclick = () => {
            const snap = computeAllSnapshots();
            printDubaiMasterSummary({ consignment: activeConsignment, ...snap });
        };
    }

    const excelBtn = document.getElementById('btn-master-export-excel');
    if (excelBtn) {
        excelBtn.onclick = exportConsolidatedExcel;
    }
}

function updateMasterBanner() {
    mountNothiBannerBar({
        slotId: 'master-summary-banner-slot',
        sectionKey: 'master-summary',
        getConsignment: () => activeConsignment,
        getAllConsignments: () => consignmentsList,
        selectId: 'select-master-consignment',
        showSelector: true,
        onConsignmentChange: selectedId => {
            activeConsignment = consignmentsList.find(c => c.id === selectedId) || activeConsignment;
            updateMasterBanner();
            listenToConsignmentBooks(selectedId);
        }
    });
}

function refreshMasterDashboard() {
    const snap = computeAllSnapshots();
    renderTierCards(snap);
    renderSimulatorPanel(snap);
    renderContainerMatrix(snap.matrix);
    renderLiquidityPanel(snap.liquidity);
}

function renderTierCards({ dubaiSummary, bdSummary, lcSummary, portSummary, capex }) {
    const el = document.getElementById('master-tier-cards');
    if (!el) return;

    const cards = [
        {
            key: 'remittance',
            flagKey: 'includeDubai',
            bookNo: '০০০১',
            title: 'দুবাই ক্রয় ও রেমিট্যান্স',
            amountBDT: capex.dubaiBDT,
            subText: `${formatAmountWithComma(capex.dubaiAED)} AED (${dubaiSummary.stage3?.count || 0} কিস্তি)`,
            sharePct: capex.dubaiSharePct,
            border: 'border-emerald-500/35 hover:border-emerald-400/60',
            text: 'text-emerald-400',
            pill: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30'
        },
        {
            key: 'lc-bills',
            flagKey: 'includeLC',
            bookNo: '০০০৩',
            title: 'কন্টেইনার L/C ও ব্যাংক',
            amountBDT: capex.lcBDT,
            subText: `$${formatAmountWithComma(capex.lcUSD)} USD (${lcSummary.containerCount || 0} কন্টেইনার)`,
            sharePct: capex.lcSharePct,
            border: 'border-cyan-500/35 hover:border-cyan-400/60',
            text: 'text-cyan-400',
            pill: 'bg-cyan-500/15 text-cyan-300 border-cyan-500/30'
        },
        {
            key: 'port-duty',
            flagKey: 'includePort',
            bookNo: '০০০৪',
            title: 'পোর্ট ও কাস্টমস ডিউটি',
            amountBDT: capex.portBDT,
            subText: `${portSummary.count || 0}টি ক্লিয়ারেন্স বিল`,
            sharePct: capex.portSharePct,
            border: 'border-indigo-500/35 hover:border-indigo-400/60',
            text: 'text-indigo-400',
            pill: 'bg-indigo-500/15 text-indigo-300 border-indigo-500/30'
        },
        {
            key: 'bd-expense',
            flagKey: 'includeBD',
            bookNo: '০০০২',
            title: 'বাংলাদেশ খরচ ও ক্লিয়ারিং',
            amountBDT: capex.bdBDT,
            subText: `সাবেক + ${bdSummary.count || 0}টি এন্ট্রি`,
            sharePct: capex.bdSharePct,
            border: 'border-amber-500/35 hover:border-amber-400/60',
            text: 'text-amber-400',
            pill: 'bg-amber-500/15 text-amber-300 border-amber-500/30'
        }
    ];

    el.innerHTML = cards.map(c => {
        const included = comboFlags[c.flagKey];
        return `
            <div onclick="window.switchDubaiProcurementView('${c.key}')"
                class="bg-slate-900/90 border ${c.border} rounded-2xl p-4 shadow-lg cursor-pointer transition-all group ${included ? '' : 'opacity-50'}">
                <div class="flex items-center justify-between gap-2 mb-2">
                    <span class="px-2 py-0.5 rounded-full text-[10px] font-black border ${c.pill}">পাতা ${c.bookNo}</span>
                    <span class="text-[11px] font-mono font-black ${c.text}">${c.sharePct}%</span>
                </div>
                <div class="text-xs font-bold text-slate-300 group-hover:text-white transition-colors">${c.title}</div>
                <div class="text-xl font-black font-mono ${c.text} mt-1">৳ ${formatAmountWithComma(c.amountBDT)}</div>
                <div class="text-[11px] text-slate-400 mt-1 font-mono">${escapeHTML(c.subText)}</div>
            </div>
        `;
    }).join('');
}

function renderSimulatorPanel({ capex }) {
    const el = document.getElementById('master-simulator-panel');
    if (!el) return;

    const allOn = comboFlags.includeDubai && comboFlags.includeLC && comboFlags.includePort && comboFlags.includeBD;
    const words = numberToBanglaWords(Math.round(capex.selectedTotalBDT || 0));

    const toggleItems = [
        { key: 'includeDubai', label: '০০০১ দুবাই ক্রয়', activeCls: 'bg-emerald-500/15 border-emerald-500/40 text-white' },
        { key: 'includeLC', label: '০০০৩ L/C ও ব্যাংক', activeCls: 'bg-cyan-500/15 border-cyan-500/40 text-white' },
        { key: 'includePort', label: '০০০৪ পোর্ট ও ডিউটি', activeCls: 'bg-indigo-500/15 border-indigo-500/40 text-white' },
        { key: 'includeBD', label: '০০০২ বাংলাদেশ খরচ', activeCls: 'bg-amber-500/15 border-amber-500/40 text-white' }
    ];

    const checkboxesHtml = toggleItems.map(item => {
        const checked = comboFlags[item.key];
        return `
            <label class="flex items-center gap-2 px-3 py-2 rounded-xl border cursor-pointer transition-all select-none ${
                checked
                    ? item.activeCls
                    : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:border-slate-700'
            }">
                <input type="checkbox" data-capex-toggle="${item.key}" ${checked ? 'checked' : ''} class="accent-purple-500 w-3.5 h-3.5 cursor-pointer">
                <span class="text-xs font-bold">${item.label}</span>
            </label>
        `;
    }).join('');

    el.innerHTML = `
        <div class="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div class="flex-grow min-w-0">
                <div class="flex flex-wrap items-center gap-2 mb-2">
                    <span class="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-purple-500/20 text-purple-300 border border-purple-500/40 uppercase tracking-wider">
                        <i class="fa-solid fa-layer-group mr-1"></i>সমন্বিত মোট হিসাব ইঞ্জিন
                    </span>
                    <button type="button" data-capex-preset="2tier" class="px-2.5 py-0.5 rounded-lg text-[10px] font-bold bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 cursor-pointer transition-all">২-স্তর (০০০১+০০০২)</button>
                    <button type="button" data-capex-preset="3tier" class="px-2.5 py-0.5 rounded-lg text-[10px] font-bold bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 cursor-pointer transition-all">৩-স্তর (০০০১+০০০৪+০০০২)</button>
                    <button type="button" data-capex-preset="4tier" class="px-2.5 py-0.5 rounded-lg text-[10px] font-bold bg-purple-600/25 hover:bg-purple-600/40 text-purple-200 border border-purple-500/40 cursor-pointer transition-all">৪-স্তর পূর্ণ প্রজেক্ট</button>
                </div>

                <div class="flex flex-wrap gap-2 mt-2">${checkboxesHtml}</div>

                <div class="mt-3 text-xs font-bold text-slate-300">
                    <i class="fa-solid fa-spell-check text-purple-400 mr-1"></i>কথায়:
                    <span class="text-purple-200">${escapeHTML(words)} টাকা মাত্র</span>
                </div>
            </div>

            <div class="bg-slate-950/80 border border-purple-500/40 rounded-2xl px-5 py-4 text-right shrink-0 shadow-inner min-w-[260px]">
                <div class="text-[11px] font-bold text-purple-300">
                    ${allOn ? 'সর্বমোট ৪-স্তর প্রজেক্ট পুঁজী (০০০১–০০০৪)' : 'নির্বাচিত খাতগুলোর সমন্বিত যোগফল'}
                </div>
                <div class="text-2xl sm:text-3xl font-black font-mono text-white mt-1">
                    ৳ ${formatAmountWithComma(capex.selectedTotalBDT)}
                </div>
                <div class="text-[11px] font-mono text-slate-400 mt-1">
                    ${!allOn ? `পূর্ণ ৪-স্তর মোট: ৳ ${formatAmountWithComma(capex.totalCapExBDT)} · ` : ''}
                    ল্যান্ডেড রেট: <span class="text-emerald-400 font-bold">${capex.landedEffectiveRate.toFixed(2)}</span> টাকা/AED
                </div>
            </div>
        </div>
    `;

    el.querySelectorAll('[data-capex-toggle]').forEach(cb => {
        cb.onchange = () => {
            const k = cb.getAttribute('data-capex-toggle');
            comboFlags[k] = cb.checked;
            refreshMasterDashboard();
        };
    });

    el.querySelectorAll('[data-capex-preset]').forEach(btn => {
        btn.onclick = () => {
            const preset = btn.getAttribute('data-capex-preset');
            comboFlags.includeDubai = true;
            comboFlags.includeBD = true;
            comboFlags.includeLC = preset === '4tier';
            comboFlags.includePort = preset === '3tier' || preset === '4tier';
            refreshMasterDashboard();
        };
    });
}

function renderContainerMatrix(matrix) {
    const tbody = document.getElementById('master-container-matrix-body');
    if (!tbody) return;

    const rows = matrix?.rows || [];
    const unmatched = matrix?.unmatchedPortRows || [];

    if (rows.length === 0 && unmatched.length === 0) {
        tbody.innerHTML = '<tr><td colspan="8" class="p-8 text-center text-slate-500 font-bold">এই কনসোলমেন্টে কোনো কন্টেইনার L/C বা পোর্ট বিল পাওয়া যায়নি।</td></tr>';
        return;
    }

    const rowHtml = rows.map(row => {
        const sizeBadge = row.portSizes.length > 0
            ? row.portSizes.map(s => `<span class="px-2 py-0.5 rounded bg-indigo-500/10 text-indigo-300 border border-indigo-500/25 font-mono text-[10px] font-black">${escapeHTML(s)}</span>`).join(' ')
            : '<span class="text-slate-600">—</span>';

        const statusBadge = row.isClosed
            ? `<span class="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">${row.deliveryDate ? escapeHTML(formatAppDate(row.deliveryDate)) : 'সমাপ্ত'}</span>`
            : '<span class="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/15 text-amber-300 border border-amber-500/30">চলমান</span>';

        return `
            <tr class="hover:bg-slate-800/40 transition-colors">
                <td class="p-3 text-center border-r border-slate-800 font-mono font-black text-white">#${row.containerNum}</td>
                <td class="p-3 border-r border-slate-800">
                    <div class="font-bold text-white">${escapeHTML(row.company || 'নির্ধারিত নয়')}</div>
                    ${row.lcNo ? `<div class="text-[10px] font-mono text-slate-400">L/C: ${escapeHTML(row.lcNo)}</div>` : ''}
                </td>
                <td class="p-3 text-center border-r border-slate-800">${sizeBadge}</td>
                <td class="p-3 text-right border-r border-slate-800 font-mono font-bold text-cyan-300">$${formatAmountWithComma(row.lcUSD)}</td>
                <td class="p-3 text-right border-r border-slate-800 font-mono font-bold text-red-400">৳ ${formatAmountWithComma(row.lcBDT)}</td>
                <td class="p-3 text-right border-r border-slate-800 font-mono font-bold text-red-400">৳ ${formatAmountWithComma(row.portBDT)}</td>
                <td class="p-3 text-right border-r border-slate-800 font-mono font-black text-purple-300">৳ ${formatAmountWithComma(row.combinedBDT)}</td>
                <td class="p-3 text-center">${statusBadge}</td>
            </tr>
        `;
    }).join('');

    const unmatchedHtml = unmatched.map(u => `
        <tr class="bg-amber-950/15 hover:bg-amber-950/25 transition-colors">
            <td class="p-3 text-center border-r border-slate-800 font-bold text-amber-400">—</td>
            <td class="p-3 border-r border-slate-800 font-bold text-amber-200">${escapeHTML(u.description)} <span class="text-[10px] text-amber-400">(কন্টেইনার নং বিহীন)</span></td>
            <td class="p-3 text-center border-r border-slate-800 font-mono text-slate-400">${escapeHTML(u.size)}</td>
            <td class="p-3 text-right border-r border-slate-800 font-mono text-slate-500">$0</td>
            <td class="p-3 text-right border-r border-slate-800 font-mono text-slate-500">৳ 0</td>
            <td class="p-3 text-right border-r border-slate-800 font-mono font-bold text-red-400">৳ ${formatAmountWithComma(u.portBDT)}</td>
            <td class="p-3 text-right border-r border-slate-800 font-mono font-black text-purple-300">৳ ${formatAmountWithComma(u.portBDT)}</td>
            <td class="p-3 text-center"><span class="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/15 text-amber-300 border border-amber-500/30">পোর্ট-০০০৪</span></td>
        </tr>
    `).join('');

    const t = matrix.totals;
    tbody.innerHTML = `
        ${rowHtml}
        ${unmatchedHtml}
        <tr class="bg-purple-950/35 border-t-2 border-purple-500 font-black text-xs text-white">
            <td colspan="3" class="p-3.5 text-right border-r border-slate-800">মোট কন্টেইনার এলসি ও পোর্ট ব্যয় (${t.containerCount} টি কন্টেইনার):</td>
            <td class="p-3.5 text-right font-mono text-cyan-300 border-r border-slate-800">$${formatAmountWithComma(t.lcUSD)}</td>
            <td class="p-3.5 text-right font-mono text-red-300 border-r border-slate-800">৳ ${formatAmountWithComma(t.lcBDT)}</td>
            <td class="p-3.5 text-right font-mono text-red-300 border-r border-slate-800">৳ ${formatAmountWithComma(t.portTotalBDT)}</td>
            <td class="p-3.5 text-right font-mono text-purple-200 border-r border-slate-800 text-sm">৳ ${formatAmountWithComma(t.combinedAllBDT)}</td>
            <td class="p-3.5 text-center"><span class="px-2.5 py-1 rounded text-[10px] font-black bg-purple-600 text-white">সম্মিলিত</span></td>
        </tr>
    `;
}

function renderLiquidityPanel(liq) {
    const el = document.getElementById('master-liquidity-panel');
    if (!el) return;

    const vm = liq.varianceMetrics || {};
    const varSign = vm.variance > 0 ? '+' : '';
    const varClass = vm.statusKind === 'deficit' ? 'text-red-400' : 'text-emerald-400';
    const gapClass = Math.abs(liq.remittanceAuditGapAED) > 0.01 ? 'text-amber-400' : 'text-emerald-400';

    const holdingsHtml = liq.personalHoldings.length > 0
        ? liq.personalHoldings.map(h => `
            <span class="px-2.5 py-1 rounded-lg bg-slate-950 border border-slate-800 text-[11px] font-bold text-slate-300">
                ${escapeHTML(h.name)}: <span class="font-mono text-sky-400">${formatAmountWithComma(h.amount)} AED</span>
            </span>
        `).join('')
        : '<span class="text-xs text-slate-500">কোনো কাস্টডিয়ান হোল্ডিং নেই</span>';

    el.innerHTML = `
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 mb-4 border-b border-slate-800">
            <div class="flex items-center gap-2">
                <i class="fa-solid fa-scale-balanced text-sky-400"></i>
                <h3 class="text-sm font-black text-white">দুবাই দিরহাম (AED) তারল্য ও সাপ্তাহিক ক্যাশ রিকনসিলিয়েশন (০০০১ বনাম ০০০৫)</h3>
            </div>
            <button type="button" onclick="window.switchDubaiProcurementView('audit')" class="px-3 py-1 rounded-xl bg-sky-500/15 hover:bg-sky-500/25 text-sky-300 border border-sky-500/35 text-xs font-bold cursor-pointer transition-all self-start sm:self-auto">
                সাপ্তাহিক অডিট ০০০৫ খুলুন (${liq.hasAudit ? escapeHTML(formatAppDate(liq.weekEndDate)) : 'নতুন'})
            </button>
        </div>

        <div class="grid grid-cols-2 lg:grid-cols-5 gap-3">
            <div class="bg-slate-950/70 border border-slate-800 rounded-xl p-3">
                <div class="text-[10px] font-bold text-slate-400">মোট প্রেরিত (পাতা ০০০১)</div>
                <div class="text-base font-black font-mono text-emerald-400 mt-1">${formatAmountWithComma(liq.remittedAED)} AED</div>
                <div class="text-[10px] font-mono ${gapClass} mt-0.5">অডিট পার্থক্য: ${formatAmountWithComma(liq.remittanceAuditGapAED)} AED</div>
            </div>
            <div class="bg-slate-950/70 border border-slate-800 rounded-xl p-3">
                <div class="text-[10px] font-bold text-slate-400">মোট ক্রয় + খরচ (০০০৫)</div>
                <div class="text-base font-black font-mono text-red-400 mt-1">${formatAmountWithComma(safeRound(liq.cumPurchaseAED + liq.cumExpenseAED))} AED</div>
                <div class="text-[10px] font-mono text-slate-400 mt-0.5">ক্রয় ${formatAmountWithComma(liq.cumPurchaseAED)} + খরচ ${formatAmountWithComma(liq.cumExpenseAED)}</div>
            </div>
            <div class="bg-slate-950/70 border border-slate-800 rounded-xl p-3">
                <div class="text-[10px] font-bold text-slate-400">থিওরেটিক্যাল ক্যাশ ব্যালেন্স</div>
                <div class="text-base font-black font-mono text-white mt-1">${formatAmountWithComma(liq.theoreticalCashAED)} AED</div>
                <div class="text-[10px] font-mono text-slate-400 mt-0.5">সম্ভাব্য মূল্য ≈ ৳ ${formatAmountWithComma(liq.estimatedCashBDT)}</div>
            </div>
            <div class="bg-slate-950/70 border border-slate-800 rounded-xl p-3">
                <div class="text-[10px] font-bold text-slate-400">মোট বাস্তব সম্পদ (Physical)</div>
                <div class="text-base font-black font-mono text-sky-400 mt-1">${formatAmountWithComma(liq.totalPhysicalAED)} AED</div>
                <div class="text-[10px] font-mono text-slate-400 mt-0.5">নগদ ${formatAmountWithComma(liq.cashInHandAED)} + AD ${formatAmountWithComma(liq.marketAdvanceAED)} + মেস ${formatAmountWithComma(liq.messBalanceAED)}</div>
            </div>
            <div class="col-span-2 lg:col-span-1 bg-slate-950/70 border border-slate-800 rounded-xl p-3">
                <div class="text-[10px] font-bold text-slate-400">ক্যাশ তফাত ${escapeHTML(vm.statusLabel || '')}</div>
                <div class="text-base font-black font-mono ${varClass} mt-1">${varSign}${formatAmountWithComma(vm.variance || 0)} AED</div>
                <div class="text-[10px] text-slate-400 mt-0.5">সর্বশেষ সাপ্তাহিক শিট অনুযায়ী</div>
            </div>
        </div>

        <div class="mt-3 flex flex-wrap items-center gap-2">
            <span class="text-[11px] font-bold text-slate-400"><i class="fa-solid fa-people-carry-box text-sky-400 mr-1"></i>ব্যক্তিগত হেফাজত (Custodians):</span>
            ${holdingsHtml}
        </div>
    `;
}

function exportConsolidatedExcel() {
    const { capex, matrix, liquidity } = computeAllSnapshots();
    if (!activeConsignment && remittancesList.length === 0 && lcBillsList.length === 0 && portDutyBillsList.length === 0) {
        showToast('এক্সপোর্ট করার মতো ডাটা নেই!', 'warning', 'এক্সপোর্ট');
        return;
    }

    const headers = ['খাত / কন্টেইনার নং', 'কোম্পানি / বিবরণ', 'সাইজ / মুদ্রা', 'বৈদেশিক পরিমাণ', 'L/C ও ব্যাংক (BDT)', 'পোর্ট ও ডিউটি (BDT)', 'মোট টাকা (BDT)', 'স্ট্যাটাস / শতাংশ'];
    const rows = [
        ['পাতা ০০০১', 'দুবাই ক্রয় ও রেমিট্যান্স', 'AED', capex.dubaiAED, 0, 0, capex.dubaiBDT, `${capex.dubaiSharePct}%`],
        ['পাতা ০০০৩', 'কন্টেইনার L/C ও ব্যাংক', 'USD', capex.lcUSD, capex.lcBDT, 0, capex.lcBDT, `${capex.lcSharePct}%`],
        ['পাতা ০০০৪', 'পোর্ট ও কাস্টমস ডিউটি', 'BDT', 0, 0, capex.portBDT, capex.portBDT, `${capex.portSharePct}%`],
        ['পাতা ০০০২', 'বাংলাদেশ খরচ ও ক্লিয়ারিং', 'BDT', 0, 0, 0, capex.bdBDT, `${capex.bdSharePct}%`],
        ['মোট ৪-স্তর', 'সর্বমোট সমন্বিত প্রজেক্ট পুঁজী (০০০১–০০০৪)', 'BDT', capex.dubaiAED, capex.lcBDT, capex.portBDT, capex.totalCapExBDT, '100%'],
        ['', '', '', '', '', '', '', '']
    ];

    for (const r of matrix.rows) {
        rows.push([
            `কন্টেইনার #${r.containerNum}`,
            `${r.company || '—'}${r.lcNo ? ` (L/C: ${r.lcNo})` : ''}`,
            r.portSizes.join(', ') || '—',
            r.lcUSD,
            r.lcBDT,
            r.portBDT,
            r.combinedBDT,
            r.isClosed ? 'সমাপ্ত' : 'চলমান'
        ]);
    }

    for (const u of matrix.unmatchedPortRows) {
        rows.push(['পোর্ট-০০০৪', u.description, u.size, 0, 0, u.portBDT, u.portBDT, 'অমিল পোর্ট বিল']);
    }

    rows.push(['', '', '', '', '', '', '', '']);
    rows.push(['দুবাই তারল্য (০০০৫)', 'থিওরেটিক্যাল ক্যাশ / বাস্তব সম্পদ (AED)', 'AED', liquidity.theoreticalCashAED, liquidity.totalPhysicalAED, liquidity.varianceMetrics?.variance || 0, liquidity.estimatedCashBDT, liquidity.varianceMetrics?.statusLabel || '']);

    exportNothiRowsToExcel({
        sheetName: 'Nothi_Master_0006',
        headers,
        rows,
        filename: `Nothi_Master_Summary_${activeConsignment?.id || 'CONSIGNMENT'}.xlsx`
    });
}

/**
 * Dubai Procurement - Container L/C Margin & Bank Expense UI Controller
 * Manages the Container-Based Multi-Date Sub-Ledger for Page 0003, Delivery Date tracking, and 4-Tier CapEx.
 */
// ALLOW_LARGE_FILE (Corporate Container L/C Sub-Ledger UI Controller)

import Swal from 'sweetalert2';
import { DubaiLCDAO } from './dubai-lc-dao.js';
import { DubaiRemittanceDAO } from './dubai-remittance-dao.js';
import { DubaiPortDutyDAO } from './dubai-port-duty-dao.js';
import { DubaiBDExpenseDAO } from './dubai-bd-expense-dao.js';
import { calculateLCSummary, calculateContainerLCTotals, calculateMaster4TierCapEx, isContainerClosed } from './dubai-lc-calc.js';
import { calculateConsignmentSummary } from './dubai-remittance-calc.js';
import { calculatePortDutySummary } from './dubai-port-duty-calc.js';
import { calculateBDExpenseSummary } from './dubai-bd-expense-calc.js';
import { printDubaiLCBook } from './dubai-lc-print.js';
import { renderNothiSubBookHeader } from './dubai-subbook-header.js';
import { mountNothiBannerBar } from './dubai-banner-editor-modal.js';
import {
    openDeliveryDateModal,
    openAddPaymentLineModal,
    openEditPaymentLineModal,
    openEditContainerMetaModal,
    openBulkCloseContainersModal
} from './dubai-lc-modals.js';
import {
    formatAmountWithComma,
    parseAmount,
    getTodayLocalDateString,
    formatAppDate,
    escapeHTML,
    showToast,
    promptSecurityPin,
    ensureOnline
} from '../utils.js';

let activeConsignment = null;
let consignmentsList = [];
let lcBillsList = [];
let dubaiRemittancesList = [];
let portDutyBillsList = [];
let bdExpensesList = [];
let activeListenersConsId = null;

let unsubscribeLC = null;
let unsubscribeConsignments = null;
let unsubscribeRemittances = null;
let unsubscribePortDuty = null;
let unsubscribeBDExpenses = null;

export function initDubaiLCModule(container) {
    if (!container) return;

    activeListenersConsId = null;
    // Seed initial 9 containers if collection is empty
    DubaiLCDAO.seedInitialDataIfNeeded().catch(e => console.error('L/C seed error:', e));

    renderLCView(container);
    renderLCContainersList();
    updateLCKpis();
    setupLCListeners();
}

export function cleanupDubaiLC() {
    activeListenersConsId = null;
    if (unsubscribeLC) {
        unsubscribeLC();
        unsubscribeLC = null;
    }
    if (unsubscribeConsignments) {
        unsubscribeConsignments();
        unsubscribeConsignments = null;
    }
    if (unsubscribeRemittances) {
        unsubscribeRemittances();
        unsubscribeRemittances = null;
    }
    if (unsubscribePortDuty) {
        unsubscribePortDuty();
        unsubscribePortDuty = null;
    }
    if (unsubscribeBDExpenses) {
        unsubscribeBDExpenses();
        unsubscribeBDExpenses = null;
    }
}

function setupLCListeners() {
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
        updateLCKpis();
        const consId = activeConsignment?.id || 'CONSIGNMENT-01';
        if (consId !== activeListenersConsId) {
            listenToActiveConsignmentData();
        }
    });

    listenToActiveConsignmentData();
}

function listenToActiveConsignmentData() {
    if (unsubscribeLC) { unsubscribeLC(); unsubscribeLC = null; }
    if (unsubscribeRemittances) { unsubscribeRemittances(); unsubscribeRemittances = null; }
    if (unsubscribePortDuty) { unsubscribePortDuty(); unsubscribePortDuty = null; }
    if (unsubscribeBDExpenses) { unsubscribeBDExpenses(); unsubscribeBDExpenses = null; }

    const consId = activeConsignment?.id || 'CONSIGNMENT-01';
    activeListenersConsId = consId;

    unsubscribeLC = DubaiLCDAO.listenLCBills(consId, items => {
        lcBillsList = items;
        suggestNextContainerNumber();
        renderLCContainersList();
        updateLCKpis();
    });

    unsubscribeRemittances = DubaiRemittanceDAO.listenRemittances(consId, items => {
        dubaiRemittancesList = items;
        updateLCKpis();
    });

    unsubscribePortDuty = DubaiPortDutyDAO.listenPortDutyBills(consId, items => {
        portDutyBillsList = items;
        updateLCKpis();
    });

    unsubscribeBDExpenses = DubaiBDExpenseDAO.listenBDExpenses(consId, items => {
        bdExpensesList = items;
        updateLCKpis();
    });
}

function suggestNextContainerNumber() {
    const input = document.getElementById('lc-input-cont-no');
    if (!input || input.value) return;
    let maxNo = 0;
    for (const c of lcBillsList) {
        const num = Number(c.containerNo || 0);
        if (num > maxNo) maxNo = num;
    }
    input.value = String(maxNo + 1);
}

function renderLCView(container) {
    const actionButtonsHtml = `
        <button type="button" id="btn-lc-bulk-sync" class="px-3.5 py-2 bg-emerald-600/20 hover:bg-emerald-600/35 text-emerald-300 border border-emerald-500/40 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-sm" title="কোন কন্টেইনারগুলো শেষ ও কোনগুলো চলমান তা এক ক্লিকে সেট করুন">
            <i class="fa-solid fa-list-check text-emerald-400 text-xs"></i>
            <span>ক্লোজিং ও সিঙ্ক</span>
        </button>
        <button type="button" id="btn-print-lc-book" class="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-sm">
            <i class="fa-solid fa-print text-slate-400 text-xs"></i>
            <span>A4 প্রিন্ট / ভাউচার</span>
        </button>
    `;

    container.innerHTML = `
        <div class="flex flex-col gap-4 font-bn w-full max-w-6xl mx-auto px-2 sm:px-4 pb-20">
            <!-- Top Unified 2-Tier Workspace Header -->
            ${renderNothiSubBookHeader({
                activeKey: 'lc-bills',
                title: 'কন্টেইনার এলসি ও ব্যাংক খরচ রেজিস্টার',
                subtitle: 'কন্টেইনারভিত্তিক আলাদা তারিখের ব্যাংক পেমেন্ট, USD ও ডেলিভারি ট্র্যাকার',
                pageBadge: 'খাতা পাতা: ০০০৩',
                currencyBadge: 'USD & BDT',
                iconClass: 'fa-solid fa-file-contract',
                accentColor: 'cyan',
                actionButtonsHtml
            })}

            <!-- Per-Section Consignment Selector & Customizable Print Banner -->
            <div id="lc-banner-slot"></div>

            <!-- 3 Master KPI Summary Cards -->
            <div id="lc-kpi-container" class="grid grid-cols-1 md:grid-cols-3 gap-3">
                <!-- Dynamically updated -->
            </div>

            <!-- 4-Tier Consolidated Master CapEx Banner -->
            <div id="lc-consolidated-capex-container" class="bg-gradient-to-r from-slate-900 via-cyan-950/30 to-slate-900 border border-cyan-500/30 rounded-2xl p-4 shadow-xl">
                <!-- Dynamically updated -->
            </div>

            <!-- Quick Open New Container L/C Dock -->
            <div class="bg-slate-900/80 border border-slate-700/80 rounded-2xl p-4 shadow-xl flex flex-col gap-3">
                <div class="flex items-center justify-between border-b border-slate-800 pb-2">
                    <div class="text-xs font-bold text-white flex items-center gap-2">
                        <i class="fa-solid fa-circle-plus text-emerald-400 text-sm"></i>
                        <span>নতুন কন্টেইনার এলসি খুলুন (১ম তারিখের খরচ সহ)</span>
                    </div>
                    <span class="text-[11px] text-slate-400">বিদ্যমান কন্টেইনারে নতুন খরচ যোগ করতে নিচের তালিকা থেকে "+ নতুন তারিখের খরচ যোগ" ব্যবহার করুন</span>
                </div>

                <form id="form-new-container-lc" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-7 gap-3 items-end">
                    <div>
                        <label class="block text-[11px] font-bold text-slate-300 mb-1">কন্টেইনার নং:</label>
                        <input type="number" id="lc-input-cont-no" required min="1" placeholder="10" class="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white font-bold focus:border-cyan-500 outline-none text-center">
                    </div>

                    <div>
                        <label class="block text-[11px] font-bold text-slate-300 mb-1">১ম তারিখ:</label>
                        <input type="text" id="lc-input-date" value="${getTodayLocalDateString()}" required class="datepicker w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white font-bold focus:border-cyan-500 outline-none">
                    </div>

                    <div>
                        <label class="block text-[11px] font-bold text-slate-300 mb-1">এলসি নং (L/C No):</label>
                        <input type="text" id="lc-input-lcno" required placeholder="যেমন: 10588" class="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white font-bold focus:border-cyan-500 outline-none">
                    </div>

                    <div>
                        <label class="block text-[11px] font-bold text-slate-300 mb-1">কোম্পানি / বেনিফিশিয়ারি:</label>
                        <input type="text" id="lc-input-company" required placeholder="যেমন: আরিয়ান মোটর" class="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white font-bold focus:border-cyan-500 outline-none">
                    </div>

                    <div>
                        <label class="block text-[11px] font-bold text-slate-300 mb-1">বিবরণ:</label>
                        <input type="text" id="lc-input-desc" value="মূল এলসি ওপেনিং পেমেন্ট" class="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white font-bold focus:border-cyan-500 outline-none">
                    </div>

                    <div>
                        <label class="block text-[11px] font-bold text-teal-400 mb-1">ডলার ($ USD):</label>
                        <input type="text" id="lc-input-usd" placeholder="0" oninput="window.handleNumberInput(this)" class="w-full bg-slate-950 border border-teal-500/50 rounded-xl px-3 py-2 text-xs text-teal-400 font-mono font-bold focus:border-teal-400 outline-none text-right">
                    </div>

                    <div>
                        <label class="block text-[11px] font-bold text-red-400 mb-1">টাকা (BDT TK):</label>
                        <input type="text" id="lc-input-bdt" required placeholder="0.00" oninput="window.handleNumberInput(this); window.updateLiveWords(this, 'lc-live-words');" class="w-full bg-slate-950 border border-red-500/60 rounded-xl px-3 py-2 text-xs text-red-400 font-mono font-black focus:border-red-400 outline-none text-right">
                    </div>

                    <div class="sm:col-span-2 lg:col-span-7 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pt-2">
                        <div class="text-[11px] text-slate-400 flex items-center gap-1.5">
                            <i class="fa-solid fa-comment-dollar text-slate-400"></i>
                            <span>কথায়:</span>
                            <span id="lc-live-words" class="text-amber-400 font-bold">শূন্য টাকা মাত্র</span>
                        </div>

                        <button type="submit" id="btn-save-new-lc" class="px-5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shadow-lg shadow-emerald-950/40 cursor-pointer self-end">
                            <i class="fa-solid fa-check text-xs"></i>
                            <span>নতুন কন্টেইনার এলসি খুলুন</span>
                        </button>
                    </div>
                </form>
            </div>

            <!-- Search & Delivery Status Filter Bar -->
            <div class="flex flex-col sm:flex-row items-center justify-between gap-3 bg-slate-900/60 border border-slate-800/80 p-3 rounded-2xl">
                <div class="text-xs font-bold text-slate-200 flex items-center gap-2">
                    <i class="fa-solid fa-layer-group text-cyan-400"></i>
                    <span>কন্টেইনার-ভিত্তিক এলসি ও ডেলিভারি সাব-লেজার</span>
                    <span id="lc-badge-count" class="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-800 text-slate-300 border border-slate-700">০টি কন্টেইনার</span>
                </div>

                <div class="flex items-center gap-2 w-full sm:w-auto">
                    <select id="lc-filter-delivery" class="bg-slate-950 border border-slate-700 rounded-xl px-3 py-1.5 text-xs text-slate-300 outline-none">
                        <option value="all">সকল কন্টেইনার</option>
                        <option value="pending">চলমান / বাকি (Open)</option>
                        <option value="delivered">শেষ / সমাপ্ত (Closed)</option>
                    </select>
                    <div class="relative w-full sm:w-64">
                        <input type="text" id="lc-search-input" placeholder="কন্টেইনার, এলসি নং বা কোম্পানি খুঁজুন..." class="w-full bg-slate-950 border border-slate-700 rounded-xl pl-8 pr-3 py-1.5 text-xs text-white placeholder-slate-500 focus:border-cyan-500 outline-none">
                        <i class="fa-solid fa-magnifying-glass absolute left-2.5 top-2.5 text-slate-500 text-xs"></i>
                    </div>
                </div>
            </div>

            <!-- Grouped Sub-Ledger Container Cards -->
            <div id="lc-containers-list" class="flex flex-col gap-4">
                <!-- Dynamically populated with Container Cards -->
            </div>
        </div>
    `;

    bindLCEvents();
    updateConsignmentUI();
}

function bindLCEvents() {
    const bind = (id, fn) => { const el = document.getElementById(id); if (el) el.onclick = fn; };

    bind('btn-lc-bulk-sync', () => {
        openBulkCloseContainersModal(lcBillsList, portDutyBillsList);
    });

    bind('btn-print-lc-book', () => {
        const dubaiSummary = calculateConsignmentSummary(activeConsignment, dubaiRemittancesList);
        const portSummary = calculatePortDutySummary(activeConsignment, portDutyBillsList);
        const bdSummary = calculateBDExpenseSummary(activeConsignment, bdExpensesList);
        printDubaiLCBook(activeConsignment, lcBillsList, dubaiSummary, portSummary, bdSummary);
    });

    const form = document.getElementById('form-new-container-lc');
    if (form) form.onsubmit = onSaveNewContainerLC;

    const searchInput = document.getElementById('lc-search-input');
    if (searchInput) searchInput.oninput = renderLCContainersList;

    const filterSelect = document.getElementById('lc-filter-delivery');
    if (filterSelect) filterSelect.onchange = renderLCContainersList;

    // Register global inline handlers for container cards
    window.promptLCDeliveryDate = (containerId) => {
        const obj = lcBillsList.find(c => c.id === containerId);
        if (obj) openDeliveryDateModal(obj);
    };

    window.openAddLCPaymentModal = (containerId) => {
        const obj = lcBillsList.find(c => c.id === containerId);
        if (!obj) return;
        if (isContainerClosed(obj)) {
            showToast('এই কন্টেইনারটি "শেষ (Closed)" অবস্থায় লক করা আছে — খরচ যোগ করতে আগে পুনরায় চালু করুন', 'error');
            return;
        }
        openAddPaymentLineModal(obj);
    };

    window.openEditLCPaymentModal = (containerId, paymentId) => {
        const cObj = lcBillsList.find(c => c.id === containerId);
        if (!cObj || !Array.isArray(cObj.payments)) return;
        if (isContainerClosed(cObj)) {
            showToast('এই কন্টেইনারটি "শেষ (Closed)" অবস্থায় লক করা আছে — সংশোধনের আগে পুনরায় চালু করুন', 'error');
            return;
        }
        const pObj = cObj.payments.find(p => p.id === paymentId);
        if (pObj) openEditPaymentLineModal(cObj, pObj);
    };

    window.openEditLCContainerMetaModal = (containerId) => {
        const obj = lcBillsList.find(c => c.id === containerId);
        if (obj) openEditContainerMetaModal(obj);
    };

    window.deleteLCPaymentLineAction = async (containerId, paymentId) => {
        const cObj = lcBillsList.find(c => c.id === containerId);
        if (cObj && isContainerClosed(cObj)) {
            showToast('এই কন্টেইনারটি "শেষ (Closed)" অবস্থায় লক করা আছে — মুছতে আগে পুনরায় চালু করুন', 'error');
            return;
        }
        const pinOk = await promptSecurityPin('এলসি পেমেন্ট লাইন মুছতে সিকিউরিটি পিন দিন');
        if (!pinOk) return;
        if (!ensureOnline()) return;

        const conf = await Swal.fire({
            title: 'পেমেন্ট লাইন মুছবেন?',
            text: 'এই নির্দিষ্ট তারিখের খরচটি মুছে দিলে কন্টেইনারের মোট হিসাব কমে যাবে।',
            icon: 'warning',
            background: '#0f172a',
            color: '#f8fafc',
            showCancelButton: true,
            confirmButtonText: 'হ্যাঁ, মুছে ফেলুন',
            cancelButtonText: 'না',
            confirmButtonColor: '#dc2626'
        });

        if (conf.isConfirmed) {
            try {
                await DubaiLCDAO.deletePaymentLine(containerId, paymentId);
                showToast('পেমেন্ট লাইন মুছে ফেলা হয়েছে', 'success');
            } catch (e) {
                console.error('Delete payment line error:', e);
                showToast('মুছতে সমস্যা হয়েছে!', 'error');
            }
        }
    };

    window.deleteLCContainerAction = async (containerId) => {
        const pinOk = await promptSecurityPin('সম্পূর্ণ কন্টেইনার এলসি রেকর্ড মুছতে পিন দিন');
        if (!pinOk) return;
        if (!ensureOnline()) return;

        const conf = await Swal.fire({
            title: 'কন্টেইনার এলসি মুছবেন?',
            text: 'সম্পূর্ণ কন্টেইনারটি ও এর সব তারিখের পেমেন্ট মুছে যাবে!',
            icon: 'warning',
            background: '#0f172a',
            color: '#f8fafc',
            showCancelButton: true,
            confirmButtonText: 'হ্যাঁ, মুছুন',
            cancelButtonText: 'বাতিল',
            confirmButtonColor: '#dc2626'
        });

        if (conf.isConfirmed) {
            try {
                await DubaiLCDAO.deleteContainerLC(containerId);
                showToast('কন্টেইনার এলসি মুছে ফেলা হয়েছে', 'success');
            } catch (e) {
                console.error('Delete container LC error:', e);
                showToast('মুছতে সমস্যা হয়েছে!', 'error');
            }
        }
    };
}

function updateConsignmentUI() {
    mountNothiBannerBar({
        slotId: 'lc-banner-slot',
        sectionKey: 'lc-bills',
        getConsignment: () => activeConsignment,
        getAllConsignments: () => consignmentsList,
        selectId: 'select-lc-consignment',
        showSelector: true,
        onConsignmentChange: (selectedId) => {
            activeConsignment = consignmentsList.find(c => c.id === selectedId) || activeConsignment;
            updateConsignmentUI();
            listenToActiveConsignmentData();
        }
    });
}

async function onSaveNewContainerLC(e) {
    e.preventDefault();
    if (!ensureOnline()) return;

    const containerNo = Number(document.getElementById('lc-input-cont-no')?.value);
    const date = document.getElementById('lc-input-date')?.value?.trim();
    const lcNo = document.getElementById('lc-input-lcno')?.value?.trim();
    const company = document.getElementById('lc-input-company')?.value?.trim();
    const description = document.getElementById('lc-input-desc')?.value?.trim();
    const amountUSD = parseAmount(document.getElementById('lc-input-usd')?.value || 0);
    const amountBDT = parseAmount(document.getElementById('lc-input-bdt')?.value || 0);

    if (!containerNo || !date || !lcNo || !company || (amountBDT <= 0 && amountUSD <= 0)) {
        showToast('অনুগ্রহ করে সকল সঠিক তথ্য, এলসি নং ও টাকার পরিমাণ দিন!', 'error');
        return;
    }

    const consId = activeConsignment?.id || 'CONSIGNMENT-01';
    try {
        await DubaiLCDAO.saveContainerLC({
            consignmentId: consId,
            containerNo,
            lcNo,
            company,
            deliveryDate: '',
            payments: [{
                id: `P-${containerNo}-1`,
                date,
                description: description || 'মূল এলসি ওপেনিং পেমেন্ট',
                amountUSD,
                amountBDT
            }]
        });

        showToast(`${containerNo} নং কন্টেইনার এলসি সফলভাবে তৈরি হয়েছে`, 'success');
        document.getElementById('lc-input-lcno').value = '';
        document.getElementById('lc-input-company').value = '';
        document.getElementById('lc-input-usd').value = '';
        document.getElementById('lc-input-bdt').value = '';
        const wordsEl = document.getElementById('lc-live-words');
        if (wordsEl) wordsEl.textContent = 'শূন্য টাকা মাত্র';
        document.getElementById('lc-input-cont-no').value = '';
        suggestNextContainerNumber();
    } catch (err) {
        console.error('Error creating container L/C:', err);
        showToast('কন্টেইনার এলসি সেভ করতে সমস্যা হয়েছে!', 'error');
    }
}

function updateLCKpis() {
    const kpiBox = document.getElementById('lc-kpi-container');
    const capexBox = document.getElementById('lc-consolidated-capex-container');
    if (!kpiBox || !capexBox) return;

    const summary = calculateLCSummary(activeConsignment, lcBillsList);
    const dubaiSummary = calculateConsignmentSummary(activeConsignment, dubaiRemittancesList);
    const portSummary = calculatePortDutySummary(activeConsignment, portDutyBillsList);
    const bdSummary = calculateBDExpenseSummary(activeConsignment, bdExpensesList);
    const capex = calculateMaster4TierCapEx(dubaiSummary, summary, portSummary, bdSummary);

    kpiBox.innerHTML = `
        <div class="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 shadow-lg">
            <div class="flex items-center justify-between mb-1">
                <span class="text-xs font-bold text-slate-400">১. মোট কন্টেইনার সংখ্যা</span>
                <span class="px-2 py-0.5 rounded-full text-[10px] font-bold bg-sky-500/10 text-sky-400 border border-sky-500/20">১ হতে ${summary.containerCount} নং</span>
            </div>
            <div class="text-2xl font-black text-sky-400 font-mono">${summary.containerCount} টি কন্টেইনার</div>
            <div class="text-[11px] text-slate-400 mt-1 flex flex-wrap items-center gap-3">
                <span class="text-emerald-400 font-bold"><i class="fa-solid fa-circle-check mr-1"></i>সমাপ্ত (শেষ): ${summary.closedCount} টি</span>
                <span class="text-amber-400 font-bold"><i class="fa-solid fa-clock mr-1"></i>চলমান (বাকি): ${summary.openCount} টি</span>
            </div>
        </div>

        <div class="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 shadow-lg">
            <div class="flex items-center justify-between mb-1">
                <span class="text-xs font-bold text-slate-400">২. সর্বমোট বৈদেশিক মুদ্রা (ডলার)</span>
                <span class="px-2 py-0.5 rounded-full text-[10px] font-bold bg-teal-500/10 text-teal-400 border border-teal-500/20">USD $</span>
            </div>
            <div class="text-2xl font-black text-teal-400 font-mono">$ ${formatAmountWithComma(summary.totalUSD)}</div>
            <div class="text-[11px] text-slate-400 mt-1">সমাপ্ত: $ ${formatAmountWithComma(summary.closedTotalUSD)} | চলমান: $ ${formatAmountWithComma(summary.openTotalUSD)}</div>
        </div>

        <div class="bg-slate-900/90 border border-red-500/30 rounded-2xl p-4 shadow-lg">
            <div class="flex items-center justify-between mb-1">
                <span class="text-xs font-bold text-red-400">৩. সর্বমোট এলসি মার্জিন ও ব্যাংক খরচ</span>
                <span class="px-2 py-0.5 rounded-full text-[10px] font-bold bg-red-500/10 text-red-400 border border-red-500/20">${summary.totalPaymentsCount} টি কিস্তি</span>
            </div>
            <div class="text-2xl font-black text-red-400 font-mono">৳ ${formatAmountWithComma(summary.totalBDT)}</div>
            <div class="text-[11px] text-slate-400 mt-1 flex flex-wrap items-center gap-2">
                <span class="text-emerald-400 font-bold">সমাপ্ত (${summary.closedCount}): ৳ ${formatAmountWithComma(summary.closedTotalBDT)}</span>
                <span class="text-slate-600">|</span>
                <span class="text-amber-400 font-bold">চলমান (${summary.openCount}): ৳ ${formatAmountWithComma(summary.openTotalBDT)}</span>
            </div>
        </div>
    `;

    capexBox.innerHTML = `
        <div class="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div>
                <div class="flex items-center gap-2">
                    <span class="px-2 py-0.5 rounded text-[10px] font-black bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 uppercase">Master 4-Tier CapEx</span>
                    <h3 class="text-sm sm:text-base font-black text-white">১ম কনসোলমেন্ট সর্বমোট সামগ্রিক মেগা পুঁজী (৪-স্তরের সমন্বিত হিসাব)</h3>
                </div>
                <div class="grid grid-cols-2 sm:grid-cols-4 gap-2 mt-3 text-[11px]">
                    <div class="bg-slate-950/70 border border-slate-800 rounded-xl p-2">
                        <div class="text-slate-400">১. দুবাই এফওবি (পাতা ০০০১)</div>
                        <div class="text-sky-400 font-black font-mono mt-0.5">৳ ${formatAmountWithComma(capex.dubaiBDT)}</div>
                        <div class="text-[10px] text-slate-500">${capex.dubaiSharePct}% (${formatAmountWithComma(capex.dubaiAED)} AED)</div>
                    </div>
                    <div class="bg-cyan-950/40 border border-cyan-500/40 rounded-xl p-2">
                        <div class="text-cyan-300 font-bold">২. এলসি খরচ (পাতা ০০০৩)</div>
                        <div class="text-red-400 font-black font-mono mt-0.5">৳ ${formatAmountWithComma(capex.lcBDT)}</div>
                        <div class="text-[10px] text-cyan-400/80">${capex.lcSharePct}% ($${formatAmountWithComma(capex.lcUSD)} USD)</div>
                    </div>
                    <div class="bg-slate-950/70 border border-slate-800 rounded-xl p-2">
                        <div class="text-slate-400">৩. পোর্ট ও ডিউটি (পাতা ০০০৪)</div>
                        <div class="text-indigo-400 font-black font-mono mt-0.5">৳ ${formatAmountWithComma(capex.portBDT)}</div>
                        <div class="text-[10px] text-slate-500">${capex.portSharePct}%</div>
                    </div>
                    <div class="bg-slate-950/70 border border-slate-800 rounded-xl p-2">
                        <div class="text-slate-400">৪. বাংলাদেশ খরচ (পাতা ০০০২)</div>
                        <div class="text-amber-400 font-black font-mono mt-0.5">৳ ${formatAmountWithComma(capex.bdBDT)}</div>
                        <div class="text-[10px] text-slate-500">${capex.bdSharePct}%</div>
                    </div>
                </div>
            </div>

            <div class="bg-slate-950/90 border border-emerald-500/40 rounded-2xl p-3.5 text-center shrink-0 min-w-[230px] shadow-inner">
                <div class="text-[11px] font-bold text-slate-400">সর্বমোট মেগা প্রজেক্ট পুঁজী</div>
                <div class="text-xl sm:text-2xl font-black text-emerald-400 font-mono mt-1">৳ ${formatAmountWithComma(capex.totalCapExBDT)}</div>
                <div class="text-[10px] text-emerald-500 font-bold mt-1"><i class="fa-solid fa-shield-halved mr-1"></i>১০০% অডিট ও ব্যালেন্সড</div>
            </div>
        </div>
    `;
}

function renderLCContainersList() {
    const listContainer = document.getElementById('lc-containers-list');
    const countBadge = document.getElementById('lc-badge-count');
    if (!listContainer) return;

    const query = (document.getElementById('lc-search-input')?.value || '').trim().toLowerCase();
    const deliveryFilter = document.getElementById('lc-filter-delivery')?.value || 'all';

    const filtered = lcBillsList.filter(c => {
        const closed = isContainerClosed(c);
        if (deliveryFilter === 'delivered' && !closed) return false;
        if (deliveryFilter === 'pending' && closed) return false;

        if (!query) return true;
        const searchable = `${c.containerNo} ${c.lcNo} ${c.company} ${c.notes}`.toLowerCase();
        return searchable.includes(query);
    });

    if (countBadge) countBadge.textContent = `${filtered.length}টি কন্টেইনার`;

    if (filtered.length === 0) {
        listContainer.innerHTML = `
            <div class="bg-slate-900/60 border border-slate-800 rounded-2xl p-10 text-center text-slate-400 text-xs">
                <i class="fa-solid fa-box-open text-3xl text-slate-600 mb-3 block"></i>
                কোনো কন্টেইনার এলসি রেকর্ড পাওয়া যায়নি।
            </div>
        `;
        return;
    }

    listContainer.innerHTML = filtered.map(c => {
        const payments = Array.isArray(c.payments) ? c.payments : [];
        const cTotals = calculateContainerLCTotals(payments);
        const hasDelivery = Boolean(c.deliveryDate && String(c.deliveryDate).trim() !== '');
        const isClosed = isContainerClosed(c);

        const deliveryHtml = isClosed
            ? `<button type="button" onclick="window.promptLCDeliveryDate('${c.id}')" class="px-3 py-1 rounded-xl text-xs font-bold bg-emerald-500/15 hover:bg-emerald-500/25 text-emerald-300 border border-emerald-500/35 flex items-center gap-1.5 cursor-pointer transition-all" title="ক্লোজিং স্ট্যাটাস বা ডেলিভারি তারিখ পরিবর্তন করুন">
                    <i class="fa-solid fa-circle-check text-emerald-400"></i>
                    <span>সমাপ্ত (শেষ)${hasDelivery ? ` • ${formatAppDate(c.deliveryDate)}` : ''}</span>
                    <i class="fa-solid fa-pen text-[10px] opacity-70 ml-0.5"></i>
               </button>`
            : `<button type="button" onclick="window.promptLCDeliveryDate('${c.id}')" class="px-3 py-1 rounded-xl text-xs font-bold bg-amber-500/15 hover:bg-amber-500/25 text-amber-300 border border-amber-500/35 flex items-center gap-1.5 cursor-pointer transition-all" title="কন্টেইনারটি শেষ / ক্লোজ করুন অথবা ডেলিভারি তারিখ দিন">
                    <i class="fa-solid fa-clock text-amber-400"></i>
                    <span>চলমান (বাকি) • ক্লোজ/তারিখ দিন</span>
               </button>`;

        const addOrLockBtn = isClosed
            ? `<button type="button" onclick="window.promptLCDeliveryDate('${c.id}')" class="px-3 py-1 bg-slate-800/80 hover:bg-slate-700 text-slate-300 border border-slate-700 rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer transition-all" title="এই কন্টেইনার সমাপ্ত ও লকড — এডিট করতে পুনরায় চালু করুন">
                    <i class="fa-solid fa-lock text-amber-400 text-[10px]"></i>
                    <span>লকড (রি-ওপেন)</span>
               </button>`
            : `<button type="button" onclick="window.openAddLCPaymentModal('${c.id}')" class="px-3 py-1 bg-sky-600/20 hover:bg-sky-600/30 text-sky-400 border border-sky-500/30 rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer transition-all">
                    <i class="fa-solid fa-plus text-[10px]"></i>
                    <span>নতুন তারিখের খরচ যোগ</span>
               </button>`;

        const paymentRowsHtml = payments.map((p, idx) => `
            <tr class="border-b border-slate-800/60 hover:bg-slate-800/30 transition-colors">
                <td class="py-2.5 px-3 text-xs text-slate-400 font-mono text-center w-10">${idx + 1}</td>
                <td class="py-2.5 px-3 text-xs text-white font-bold font-mono whitespace-nowrap">${formatAppDate(p.date)}</td>
                <td class="py-2.5 px-3 text-xs text-slate-300">${escapeHTML(p.description || 'এলসি পেমেন্ট')}</td>
                <td class="py-2.5 px-3 text-xs text-teal-400 font-bold font-mono text-right whitespace-nowrap">
                    ${Number(p.amountUSD) > 0 ? `$ ${formatAmountWithComma(p.amountUSD)}` : '—'}
                </td>
                <td class="py-2.5 px-3 text-xs text-red-400 font-black font-mono text-right whitespace-nowrap">
                    ৳ ${formatAmountWithComma(p.amountBDT)}
                </td>
                <td class="py-2.5 px-3 text-right whitespace-nowrap w-20">
                    ${isClosed ? `<span class="text-slate-600 text-[10px] font-bold" title="সংশোধনের আগে কন্টেইনার রি-ওপেন করুন"><i class="fa-solid fa-lock"></i></span>` : `
                        <button type="button" onclick="window.openEditLCPaymentModal('${c.id}', '${p.id}')" class="p-1.5 text-slate-400 hover:text-sky-400 transition-colors cursor-pointer" title="এডিট">
                            <i class="fa-solid fa-pen-to-square text-xs"></i>
                        </button>
                        <button type="button" onclick="window.deleteLCPaymentLineAction('${c.id}', '${p.id}')" class="p-1.5 text-slate-400 hover:text-red-400 transition-colors cursor-pointer" title="মুছুন">
                            <i class="fa-solid fa-trash-can text-xs"></i>
                        </button>
                    `}
                </td>
            </tr>
        `).join('');

        return `
            <div class="bg-slate-900/90 border ${isClosed ? 'border-emerald-500/25' : 'border-amber-500/40'} rounded-2xl overflow-hidden shadow-xl">
                <!-- Container Header -->
                <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-950/80 px-4 py-3 border-b border-slate-800">
                    <div class="flex flex-wrap items-center gap-2.5">
                        <span class="px-2.5 py-1 rounded-lg bg-cyan-500/15 text-cyan-300 border border-cyan-500/30 text-xs font-black">
                            #${c.containerNo} নং কন্টেইনার
                        </span>
                        <span class="px-2.5 py-1 rounded-lg bg-slate-800 text-sky-400 border border-slate-700 text-xs font-bold font-mono">
                            এলসি নং: ${escapeHTML(c.lcNo)}
                        </span>
                        <span class="text-xs sm:text-sm font-bold text-white">${escapeHTML(c.company)}</span>
                    </div>

                    <div class="flex flex-wrap items-center gap-2">
                        ${deliveryHtml}
                        ${addOrLockBtn}
                        <button type="button" onclick="window.openEditLCContainerMetaModal('${c.id}')" class="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 cursor-pointer" title="কন্টেইনার তথ্য এডিট">
                            <i class="fa-solid fa-gear text-xs"></i>
                        </button>
                        <button type="button" onclick="window.deleteLCContainerAction('${c.id}')" class="p-1.5 text-slate-400 hover:text-red-400 rounded-lg hover:bg-slate-800 cursor-pointer" title="সম্পূর্ণ কন্টেইনার মুছুন">
                            <i class="fa-solid fa-trash text-xs"></i>
                        </button>
                    </div>
                </div>

                <!-- Dated Payment Lines Table -->
                <div class="overflow-x-auto">
                    <table class="w-full text-left border-collapse">
                        <thead>
                            <tr class="bg-slate-900/50 border-b border-slate-800 text-[11px] text-slate-400">
                                <th class="py-2 px-3 text-center w-10">#</th>
                                <th class="py-2 px-3">খরচের তারিখ</th>
                                <th class="py-2 px-3">খরচের বিবরণ</th>
                                <th class="py-2 px-3 text-right">ডলার ($ USD)</th>
                                <th class="py-2 px-3 text-right text-red-400">টাকা (BDT TK)</th>
                                <th class="py-2 px-3 text-right w-20">অ্যাকশন</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${paymentRowsHtml}
                        </tbody>
                    </table>
                </div>

                <!-- Container Sub-Total Closing Footer -->
                <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-2 bg-slate-950/60 px-4 py-2.5 border-t border-slate-800 text-xs">
                    <div class="text-slate-400 italic text-[11px]">
                        ${c.notes ? `<i class="fa-solid fa-note-sticky text-amber-400/70 mr-1"></i>${escapeHTML(c.notes)}` : ''}
                    </div>
                    <div class="flex flex-wrap items-center gap-3 sm:gap-4 self-end">
                        <span class="px-2 py-0.5 rounded text-[10px] font-black border ${isClosed ? 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30' : 'bg-amber-500/15 text-amber-300 border-amber-500/30'}">${isClosed ? 'শেষ' : 'চলমান'}</span>
                        <span class="font-bold text-slate-300">${c.containerNo} নং কন্টেইনার সর্বমোট:</span>
                        <span class="font-black font-mono text-teal-400">${cTotals.totalUSD > 0 ? `$ ${formatAmountWithComma(cTotals.totalUSD)} USD` : '—'}</span>
                        <span class="font-black font-mono text-red-400 text-sm">৳ ${formatAmountWithComma(cTotals.totalBDT)}</span>
                    </div>
                </div>
            </div>
        `;
    }).join('');
}

/**
 * Nothi Book (নথি বুক) - Master Category Portal & Real-Time Register Library Hub
 * Central landing dashboard displaying each accounting register book as an independent card.
 */

import { NOTHI_BOOK_CATEGORIES, getNothiTheme } from './dubai-subbook-header.js';
import { DubaiRemittanceDAO } from './dubai-remittance-dao.js';
import { DubaiBDExpenseDAO } from './dubai-bd-expense-dao.js';
import { DubaiLCDAO } from './dubai-lc-dao.js';
import { DubaiPortDutyDAO } from './dubai-port-duty-dao.js';
import { DubaiDAO } from './dubai-dao.js';
import { calculateConsignmentSummary } from './dubai-remittance-calc.js';
import { calculateBDExpenseSummary } from './dubai-bd-expense-calc.js';
import { calculateLCSummary, calculateMaster4TierCapEx } from './dubai-lc-calc.js';
import { calculatePortDutySummary } from './dubai-port-duty-calc.js';
import { formatAmountWithComma, formatAppDate, escapeHTML, showToast } from '../utils.js';

let activeConsignment = null;
let remittancesList = [];
let bdExpensesList = [];
let lcBillsList = [];
let portDutyBillsList = [];
let weeklyAuditsList = [];

let unsubConsignments = null;
let unsubRemittances = null;
let unsubBdExpenses = null;
let unsubLcBills = null;
let unsubPortDuty = null;
let unsubAudits = null;

export function initNothiBookHub(container) {
    if (!container) return;

    renderNothiHubSkeleton(container);
    attachHubListeners();
    refreshNothiHubCards();
}

export function cleanupNothiBookHub() {
    const clean = (fn) => { if (typeof fn === 'function') fn(); };
    clean(unsubConsignments); unsubConsignments = null;
    clean(unsubRemittances); unsubRemittances = null;
    clean(unsubBdExpenses); unsubBdExpenses = null;
    clean(unsubLcBills); unsubLcBills = null;
    clean(unsubPortDuty); unsubPortDuty = null;
    clean(unsubAudits); unsubAudits = null;
}

function attachHubListeners() {
    cleanupNothiBookHub();

    unsubConsignments = DubaiRemittanceDAO.listenConsignments(list => {
        if (list.length > 0) {
            activeConsignment = list.find(c => c.status === 'active') || list[0];
        }
        const consId = activeConsignment?.id || 'CONSIGNMENT-01';
        attachConsignmentBookListeners(consId);
        refreshNothiHubCards();
    });

    attachConsignmentBookListeners('CONSIGNMENT-01');

    unsubAudits = DubaiDAO.listenWeeklyAudits(items => {
        weeklyAuditsList = items || [];
        refreshNothiHubCards();
    });
}

function attachConsignmentBookListeners(consId) {
    if (unsubRemittances) unsubRemittances();
    if (unsubBdExpenses) unsubBdExpenses();
    if (unsubLcBills) unsubLcBills();
    if (unsubPortDuty) unsubPortDuty();

    unsubRemittances = DubaiRemittanceDAO.listenRemittances(consId, items => {
        remittancesList = items || [];
        refreshNothiHubCards();
    });

    unsubBdExpenses = DubaiBDExpenseDAO.listenBDExpenses(consId, items => {
        bdExpensesList = items || [];
        refreshNothiHubCards();
    });

    unsubLcBills = DubaiLCDAO.listenLCBills(consId, items => {
        lcBillsList = items || [];
        refreshNothiHubCards();
    });

    unsubPortDuty = DubaiPortDutyDAO.listenPortDutyBills(consId, items => {
        portDutyBillsList = items || [];
        refreshNothiHubCards();
    });
}

function renderNothiHubSkeleton(container) {
    container.innerHTML = `
        <div class="flex flex-col gap-6 font-bn w-full max-w-6xl mx-auto px-2 sm:px-4 pb-20">
            <!-- Nothi Book Portal Header -->
            <div class="relative overflow-hidden bg-gradient-to-br from-slate-900 via-slate-900 to-slate-950 border border-slate-800 rounded-3xl p-5 sm:p-7 shadow-2xl">
                <div class="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
                    <div class="flex items-start sm:items-center gap-4">
                        <div class="w-14 h-14 rounded-2xl bg-gradient-to-br from-sky-500/20 to-indigo-500/15 border border-sky-500/30 flex items-center justify-center text-sky-400 text-2xl shadow-inner shrink-0">
                            <i class="fa-solid fa-book-bookmark"></i>
                        </div>
                        <div>
                            <div class="flex flex-wrap items-center gap-2.5">
                                <h1 class="text-2xl sm:text-3xl font-black text-white tracking-tight">নথি বুক</h1>
                                <span class="px-3 py-1 rounded-full text-[11px] font-black bg-emerald-500/10 text-emerald-400 border border-emerald-500/25 flex items-center gap-1.5">
                                    <i class="fa-solid fa-layer-group text-[10px]"></i>
                                    <span>৫টি স্বতন্ত্র রেজিস্টার খাতা</span>
                                </span>
                            </div>
                            <p class="text-xs sm:text-sm text-slate-400 mt-1">প্রতিটি খাতা নিজস্ব হিসাব ও প্রিন্ট ভাউচার হিসেবে আলাদা কাজ করে — প্রয়োজনীয় ক্যাটাগরিতে ক্লিক করে খাতা খুলুন</p>
                        </div>
                    </div>

                    <div class="relative w-full md:w-72 shrink-0">
                        <input type="text" id="nothi-hub-search" placeholder="খাতা বা পাতা নম্বর খুঁজুন (যেমন: ০০০৩)..."
                            class="w-full bg-slate-950/90 border border-slate-700/80 focus:border-sky-500 rounded-2xl pl-9 pr-4 py-2.5 text-xs text-white placeholder-slate-500 outline-none shadow-inner transition-all">
                        <i class="fa-solid fa-magnifying-glass absolute left-3.5 top-3 text-slate-500 text-xs"></i>
                    </div>
                </div>

                <!-- Minimal Consolidated Overview Strip -->
                <div id="nothi-hub-summary-strip" class="mt-5 pt-4 border-t border-slate-800/80 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
                    <!-- Dynamically populated -->
                </div>
            </div>

            <!-- Category Cards Section Title -->
            <div class="flex items-center justify-between px-1">
                <div class="flex items-center gap-2">
                    <span class="w-1.5 h-5 rounded-full bg-sky-500"></span>
                    <h2 class="text-sm sm:text-base font-black text-white">নথি বুক ক্যাটাগরি সমূহ</h2>
                </div>
                <span class="text-[11px] font-bold text-slate-400">যেকোনো কার্ডে ক্লিক করলে ওই সেকশন আলাদাভাবে খুলবে</span>
            </div>

            <!-- Category Cards Grid -->
            <div id="nothi-hub-cards-grid" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                <!-- Dynamically populated -->
            </div>
        </div>
    `;

    const searchInp = document.getElementById('nothi-hub-search');
    if (searchInp) {
        searchInp.oninput = refreshNothiHubCards;
    }
}

function buildCategoryLiveMetrics() {
    const dubaiSummary = calculateConsignmentSummary(activeConsignment, remittancesList);
    const bdSummary = calculateBDExpenseSummary(activeConsignment, bdExpensesList);
    const lcSummary = calculateLCSummary(activeConsignment, lcBillsList);
    const portSummary = calculatePortDutySummary(activeConsignment, portDutyBillsList);
    const capex = calculateMaster4TierCapEx(dubaiSummary, lcSummary, portSummary, bdSummary);
    const latestAudit = weeklyAuditsList[0] || null;

    return {
        capex,
        metrics: {
            remittance: {
                countText: remittancesList.length > 0 ? `${remittancesList.length}টি কিস্তি ও সাবেক` : 'স্বয়ংক্রিয় সিড',
                primaryValue: `৳ ${formatAmountWithComma(capex.dubaiBDT)}`,
                secondaryValue: `${formatAmountWithComma(capex.dubaiAED)} AED`,
                lastDate: remittancesList[remittancesList.length - 1]?.date ? formatAppDate(remittancesList[remittancesList.length - 1].date) : 'চলমান খাতা'
            },
            'bd-expense': {
                countText: bdExpensesList.length > 0 ? `${bdExpensesList.length}টি এন্ট্রি ও সাবেক` : 'স্বয়ংক্রিয় সিড',
                primaryValue: `৳ ${formatAmountWithComma(capex.bdBDT)}`,
                secondaryValue: `${capex.bdSharePct}% মোট তহবিলের`,
                lastDate: bdExpensesList[bdExpensesList.length - 1]?.date ? formatAppDate(bdExpensesList[bdExpensesList.length - 1].date) : 'চলমান খাতা'
            },
            'lc-bills': {
                countText: lcBillsList.length > 0 ? `${lcBillsList.length}টি কন্টেইনার (${lcSummary.totalPaymentsCount} কিস্তি)` : '৯টি কন্টেইনার',
                primaryValue: `৳ ${formatAmountWithComma(capex.lcBDT)}`,
                secondaryValue: `$${formatAmountWithComma(capex.lcUSD)} USD`,
                lastDate: `${lcSummary.deliveredCount} ডেলিভারি / ${lcSummary.pendingDeliveryCount} অপেক্ষমাণ`
            },
            'port-duty': {
                countText: portDutyBillsList.length > 0 ? `${portDutyBillsList.length}টি কন্টেইনার বিল` : '৭টি কন্টেইনার',
                primaryValue: `৳ ${formatAmountWithComma(capex.portBDT)}`,
                secondaryValue: `${capex.portSharePct}% মোট তহবিলের`,
                lastDate: portDutyBillsList[portDutyBillsList.length - 1]?.date ? formatAppDate(portDutyBillsList[portDutyBillsList.length - 1].date) : 'চলমান খাতা'
            },
            audit: {
                countText: weeklyAuditsList.length > 0 ? `${weeklyAuditsList.length} সপ্তাহের রেকর্ড` : 'বৃহস্পতিবার রিকনসিলিয়েশন',
                primaryValue: latestAudit ? `${formatAmountWithComma(latestAudit.physicalAssets?.totalPhysical || 0)} AED` : 'সাপ্তাহিক শিট',
                secondaryValue: latestAudit ? `তফাত: ${formatAmountWithComma(latestAudit.variance || 0)} AED` : 'মেমো ও ক্যাশ হিসাব',
                lastDate: latestAudit?.weekEndDate ? formatAppDate(latestAudit.weekEndDate) : 'সর্বশেষ অডিট'
            }
        }
    };
}

function refreshNothiHubCards() {
    const stripEl = document.getElementById('nothi-hub-summary-strip');
    const gridEl = document.getElementById('nothi-hub-cards-grid');
    if (!stripEl || !gridEl) return;

    const { capex, metrics } = buildCategoryLiveMetrics();
    const q = (document.getElementById('nothi-hub-search')?.value || '').trim().toLowerCase();

    stripEl.innerHTML = `
        <div class="bg-slate-950/70 border border-slate-800/80 rounded-2xl p-3">
            <div class="text-[10px] font-bold text-slate-400">পাতা ০০০১ (রেমিট্যান্স)</div>
            <div class="text-sm font-black font-mono text-emerald-400 mt-0.5">৳ ${formatAmountWithComma(capex.dubaiBDT)}</div>
        </div>
        <div class="bg-slate-950/70 border border-slate-800/80 rounded-2xl p-3">
            <div class="text-[10px] font-bold text-slate-400">পাতা ০০০২ (বাংলাদেশ)</div>
            <div class="text-sm font-black font-mono text-amber-400 mt-0.5">৳ ${formatAmountWithComma(capex.bdBDT)}</div>
        </div>
        <div class="bg-slate-950/70 border border-slate-800/80 rounded-2xl p-3">
            <div class="text-[10px] font-bold text-slate-400">পাতা ০০০৩ (এলসি ও ব্যাংক)</div>
            <div class="text-sm font-black font-mono text-cyan-400 mt-0.5">৳ ${formatAmountWithComma(capex.lcBDT)}</div>
        </div>
        <div class="bg-slate-950/70 border border-slate-800/80 rounded-2xl p-3">
            <div class="text-[10px] font-bold text-slate-400">পাতা ০০০৪ (পোর্ট ও ডিউটি)</div>
            <div class="text-sm font-black font-mono text-indigo-400 mt-0.5">৳ ${formatAmountWithComma(capex.portBDT)}</div>
        </div>
        <div class="col-span-2 sm:col-span-1 bg-gradient-to-br from-sky-950/60 to-slate-950 border border-sky-500/30 rounded-2xl p-3">
            <div class="text-[10px] font-black text-sky-400">সর্বমোট সমন্বিত হিসাব (৪ খাতা)</div>
            <div class="text-sm font-black font-mono text-white mt-0.5">৳ ${formatAmountWithComma(capex.totalCapExBDT)}</div>
        </div>
    `;

    const filteredCats = NOTHI_BOOK_CATEGORIES.filter(cat => {
        if (!q) return true;
        return `${cat.title} ${cat.subtitle} ${cat.pageBadge} ${cat.pageNo}`.toLowerCase().includes(q);
    });

    if (filteredCats.length === 0) {
        gridEl.innerHTML = `
            <div class="col-span-full bg-slate-900/70 border border-slate-800 rounded-3xl p-10 text-center text-slate-400">
                <i class="fa-solid fa-folder-open text-3xl text-slate-600 mb-2 block"></i>
                <div class="text-sm font-bold text-white">"${escapeHTML(q)}" নামে কোনো নথি খাতা পাওয়া যায়নি</div>
            </div>
        `;
        return;
    }

    const cardsHtml = filteredCats.map(cat => {
        const theme = getNothiTheme(cat.accent);
        const m = metrics[cat.key];
        return `
            <button type="button" onclick="window.switchDubaiProcurementView && window.switchDubaiProcurementView('${cat.key}')"
                class="group text-left bg-slate-900/85 hover:bg-slate-900 border border-slate-800 ${theme.cardBorder} rounded-3xl p-5 shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all duration-200 flex flex-col justify-between gap-4 cursor-pointer">
                <div>
                    <div class="flex items-center justify-between gap-2 mb-3.5">
                        <div class="w-12 h-12 rounded-2xl border flex items-center justify-center text-xl shadow-inner ${theme.iconBox} group-hover:scale-105 transition-transform">
                            <i class="fa-solid ${cat.icon}"></i>
                        </div>
                        <div class="flex flex-col items-end gap-1">
                            <span class="px-2.5 py-0.5 rounded-full text-[11px] font-black border ${theme.badge}">${cat.pageBadge}</span>
                            <span class="text-[10px] font-bold text-slate-500">${cat.currency}</span>
                        </div>
                    </div>

                    <h3 class="text-lg font-black text-white leading-snug mb-1.5 group-hover:text-sky-200 transition-colors">${cat.title}</h3>
                    <p class="text-xs text-slate-400 leading-relaxed">${cat.subtitle}</p>
                </div>

                <div class="space-y-3 pt-2 border-t border-slate-800/80">
                    <div class="bg-slate-950/75 border border-slate-800/70 rounded-2xl p-3 flex items-center justify-between gap-2">
                        <div>
                            <div class="text-[10px] font-bold text-slate-500">${m.countText}</div>
                            <div class="text-base font-black font-mono ${theme.kpiValue} mt-0.5">${m.primaryValue}</div>
                        </div>
                        <div class="text-right">
                            <div class="text-[10px] font-bold text-slate-400">${m.secondaryValue}</div>
                            <div class="text-[10px] text-slate-500 mt-0.5">${m.lastDate}</div>
                        </div>
                    </div>

                    <div class="flex items-center justify-between text-xs font-bold ${theme.actionText}">
                        <span>এই নথি খাতা খুলুন</span>
                        <i class="fa-solid fa-arrow-right group-hover:translate-x-1 transition-transform"></i>
                    </div>
                </div>
            </button>
        `;
    }).join('');

    const futureSlotHtml = !q ? `
        <button type="button" id="btn-nothi-future-slot"
            class="text-left bg-slate-950/40 hover:bg-slate-900/50 border-2 border-dashed border-slate-800 hover:border-slate-700 rounded-3xl p-5 transition-all flex flex-col items-center justify-center text-center gap-2.5 min-h-[230px] cursor-pointer group">
            <div class="w-12 h-12 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-500 group-hover:text-sky-400 group-hover:border-sky-500/30 transition-colors text-lg">
                <i class="fa-solid fa-plus"></i>
            </div>
            <div class="text-sm font-black text-slate-300 group-hover:text-white transition-colors">নতুন নথি বুক ক্যাটাগরি (০০০৫+)</div>
            <p class="text-xs text-slate-500 max-w-[230px]">পরবর্তীতে নতুন কোনো নথি খাতা বা হিসাব যুক্ত করতে চাইলে এখান থেকেই নতুন কার্ড হিসেবে যোগ করা হবে</p>
        </button>
    ` : '';

    gridEl.innerHTML = cardsHtml + futureSlotHtml;

    const futureBtn = document.getElementById('btn-nothi-future-slot');
    if (futureBtn) {
        futureBtn.onclick = () => {
            showToast('পরবর্তী নথি খাতার ছবি বা তথ্য দিলে পাতা ০০০৫+ হিসেবে এখানে যুক্ত করে দেওয়া হবে', 'info');
        };
    }
}

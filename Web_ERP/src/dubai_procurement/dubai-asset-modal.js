/**
 * Dubai Procurement & Weekly Audit - Separated Physical Assets Manager
 * Explicitly separates: Cash in Hand, Market Advance (AD), Custodians (এমরান মামা, আলতাফ), and Mess.
 */

import { formatAmountWithComma, parseAmount, safeRound } from '../utils.js';

let assetData = {
    cashInHand: 0,
    marketAdvance: 0,
    personalHoldings: [],
    messBalance: 0
};
let onAssetChangeCallback = null;

export function initAssetManager(initialData = {}, onChange = null) {
    assetData = {
        cashInHand: safeRound(parseAmount(initialData.cashInHand || 0)),
        marketAdvance: safeRound(parseAmount(initialData.marketAdvance || 0)),
        personalHoldings: Array.isArray(initialData.personalHoldings) ? [...initialData.personalHoldings] : [],
        messBalance: safeRound(parseAmount(initialData.messBalance || 0))
    };
    onAssetChangeCallback = onChange;
}

export function getAssetData() {
    let holdingsTotal = 0;
    assetData.personalHoldings.forEach(h => {
        holdingsTotal = safeRound(holdingsTotal + safeRound(parseAmount(h.amount)));
    });
    const total = safeRound(assetData.cashInHand + assetData.marketAdvance + holdingsTotal + assetData.messBalance);

    return {
        ...assetData,
        totalPhysicalAssets: total
    };
}

export function renderAssetSectionContainer(containerId) {
    const el = document.getElementById(containerId);
    if (!el) return;

    el.innerHTML = `
        <div class="bg-slate-900/60 border border-slate-700/60 rounded-2xl p-4 sm:p-5 backdrop-blur-md flex flex-col gap-4">
            <!-- Header -->
            <div class="flex items-center justify-between pb-3 border-b border-slate-800">
                <div class="flex items-center gap-2">
                    <i class="fa-solid fa-vault text-amber-400 text-lg"></i>
                    <h3 class="text-sm sm:text-base font-bold text-white">সমাপনী ক্যাশ ও মার্কেট অবস্থান (বাস্তব সম্পদ)</h3>
                </div>
                <div class="text-xs text-slate-400 font-semibold flex items-center gap-1.5">
                    <span>মোট বাস্তব সম্পদ:</span>
                    <span id="dubai-asset-live-total" class="text-emerald-400 font-bold font-mono text-sm sm:text-base">0 AED</span>
                </div>
            </div>

            <!-- Primary Separated Fields: Cash & Market Advance (AD) -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <!-- 1. নগদ ক্যাশ (Cash in Hand) -->
                <div class="bg-slate-950/70 p-3.5 rounded-xl border border-slate-800 flex flex-col gap-1.5">
                    <div class="flex items-center justify-between">
                        <label class="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                            <i class="fa-solid fa-money-bill-wave text-emerald-400"></i>
                            <span>১. নগদ ক্যাশ (Cash in Hand)</span>
                        </label>
                        <span class="text-[10px] text-slate-500 font-semibold">অফিস ক্যাশ বাক্স</span>
                    </div>
                    <div class="relative">
                        <input type="text" id="dubai-input-cash-in-hand" value="${assetData.cashInHand > 0 ? formatAmountWithComma(assetData.cashInHand) : ''}" placeholder="০.০০" oninput="window.handleNumberInput(this)" onchange="window.handleDubaiAssetCashChange(this.value)" class="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-emerald-400 font-bold font-mono text-right focus:border-emerald-500 outline-none">
                        <span class="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-500">AED</span>
                    </div>
                </div>

                <!-- 2. মার্কেট এডভান্স (Market Advance / AD) -->
                <div class="bg-slate-950/70 p-3.5 rounded-xl border border-slate-800 flex flex-col gap-1.5">
                    <div class="flex items-center justify-between">
                        <label class="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                            <i class="fa-solid fa-hand-holding-dollar text-cyan-400"></i>
                            <span>২. মার্কেট এডভান্স (AD)</span>
                        </label>
                        <span class="text-[10px] text-slate-500 font-semibold">সাপ্লায়ারদের অগ্রিম</span>
                    </div>
                    <div class="relative">
                        <input type="text" id="dubai-input-market-ad" value="${assetData.marketAdvance > 0 ? formatAmountWithComma(assetData.marketAdvance) : ''}" placeholder="০.০০" oninput="window.handleNumberInput(this)" onchange="window.handleDubaiAssetAdChange(this.value)" class="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-cyan-400 font-bold font-mono text-right focus:border-cyan-500 outline-none">
                        <span class="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-500">AED</span>
                    </div>
                </div>
            </div>

            <!-- Secondary Separated Fields: Personal Custody / Transfers -->
            <div class="bg-slate-950/70 p-3.5 rounded-xl border border-slate-800 flex flex-col gap-3">
                <div class="flex items-center justify-between">
                    <label class="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                        <i class="fa-solid fa-users-gear text-purple-400"></i>
                        <span>৩. ব্যক্তিগত হেফাজত / হস্তান্তর (Custody Transfers)</span>
                    </label>
                    <button type="button" id="btn-add-custodian-row" class="px-2.5 py-0.5 bg-purple-500/10 hover:bg-purple-500/20 text-purple-400 border border-purple-500/20 rounded-lg text-xs font-semibold flex items-center gap-1 cursor-pointer">
                        <i class="fa-solid fa-user-plus text-[10px]"></i>
                        <span>ব্যক্তি যোগ করুন</span>
                    </button>
                </div>
                <div id="dubai-custodian-rows-list" class="flex flex-col gap-2">
                    <!-- Rendered dynamically -->
                </div>
            </div>

            <!-- 4. মেস বা ডরমেটরি ব্যালেন্স (Mess Balance) -->
            <div class="bg-slate-950/70 p-3.5 rounded-xl border border-slate-800 flex items-center justify-between gap-4">
                <div class="flex items-center gap-2">
                    <i class="fa-solid fa-utensils text-amber-400 text-sm"></i>
                    <div>
                        <label class="text-xs font-bold text-slate-300">৪. মেস ব্যালেন্স / খাবার ফান্ড (Mess)</label>
                        <p class="text-[10px] text-slate-500">খাবারের অগ্রিম বা মেস ক্যাশিয়ারের কাছে জমা</p>
                    </div>
                </div>
                <div class="relative w-44">
                    <input type="text" id="dubai-input-mess-balance" value="${assetData.messBalance > 0 ? formatAmountWithComma(assetData.messBalance) : ''}" placeholder="০.০০" oninput="window.handleNumberInput(this)" onchange="window.handleDubaiAssetMessChange(this.value)" class="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-amber-400 font-bold font-mono text-right focus:border-amber-500 outline-none">
                    <span class="absolute left-2.5 top-1/2 -translate-y-1/2 text-[10px] font-bold text-slate-500">AED</span>
                </div>
            </div>
        </div>
    `;

    const btnAdd = document.getElementById('btn-add-custodian-row');
    if (btnAdd) {
        btnAdd.onclick = () => {
            assetData.personalHoldings.push({ name: '', amount: 0 });
            renderCustodianRows();
            notifyAssetChange();
        };
    }

    renderCustodianRows();
    updateLiveAssetTotal();
}

function renderCustodianRows() {
    const listEl = document.getElementById('dubai-custodian-rows-list');
    if (!listEl) return;

    if (assetData.personalHoldings.length === 0) {
        listEl.innerHTML = `
            <div class="text-xs text-slate-500 italic py-2 text-center">
                কারো কাছে সাময়িক টাকা হস্তান্তর করা না থাকলে এটি ফাঁকা থাকবে (যেমন: আলতাফ, জাবেদ, এমরান মামা)।
            </div>
        `;
        return;
    }

    let html = '';
    assetData.personalHoldings.forEach((h, idx) => {
        const amt = safeRound(parseAmount(h.amount));
        html += `
            <div class="flex items-center gap-2 p-1.5 bg-slate-900 border border-slate-700/60 rounded-lg">
                <input type="text" value="${h.name || ''}" placeholder="ব্যক্তির নাম (যেমন: এমরান মামা / আলতাফ)" onchange="window.handleDubaiCustodianNameChange(${idx}, this.value)" class="flex-grow bg-slate-950 border border-slate-800 rounded-md px-2.5 py-1 text-xs text-white focus:border-purple-500 outline-none">
                <div class="relative w-36 shrink-0">
                    <input type="text" value="${amt > 0 ? formatAmountWithComma(amt) : ''}" placeholder="০.০০" oninput="window.handleNumberInput(this)" onchange="window.handleDubaiCustodianAmtChange(${idx}, this.value)" class="w-full bg-slate-950 border border-slate-800 rounded-md px-2.5 py-1 text-xs text-purple-300 font-bold font-mono text-right focus:border-purple-500 outline-none">
                    <span class="absolute left-2 top-1/2 -translate-y-1/2 text-[10px] font-bold text-slate-500">AED</span>
                </div>
                <button type="button" onclick="window.removeDubaiCustodianRow(${idx})" class="w-6 h-6 flex items-center justify-center rounded-md bg-red-500/10 hover:bg-red-500/20 text-red-400 transition-all cursor-pointer" title="মুছে ফেলুন">
                    <i class="fa-solid fa-xmark text-xs"></i>
                </button>
            </div>
        `;
    });

    listEl.innerHTML = html;
}

function updateLiveAssetTotal() {
    const totalEl = document.getElementById('dubai-asset-live-total');
    let holdingsTotal = 0;
    assetData.personalHoldings.forEach(h => {
        holdingsTotal = safeRound(holdingsTotal + safeRound(parseAmount(h.amount)));
    });
    const total = safeRound(assetData.cashInHand + assetData.marketAdvance + holdingsTotal + assetData.messBalance);

    if (totalEl) totalEl.textContent = `${formatAmountWithComma(total)} AED`;
}

function notifyAssetChange() {
    updateLiveAssetTotal();
    if (typeof onAssetChangeCallback === 'function') {
        onAssetChangeCallback(getAssetData());
    }
}

// Global window event bindings
window.handleDubaiAssetCashChange = function(val) {
    assetData.cashInHand = safeRound(parseAmount(val));
    notifyAssetChange();
};

window.handleDubaiAssetAdChange = function(val) {
    assetData.marketAdvance = safeRound(parseAmount(val));
    notifyAssetChange();
};

window.handleDubaiAssetMessChange = function(val) {
    assetData.messBalance = safeRound(parseAmount(val));
    notifyAssetChange();
};

window.handleDubaiCustodianNameChange = function(idx, val) {
    if (assetData.personalHoldings[idx]) {
        assetData.personalHoldings[idx].name = String(val).trim();
        notifyAssetChange();
    }
};

window.handleDubaiCustodianAmtChange = function(idx, val) {
    if (assetData.personalHoldings[idx]) {
        assetData.personalHoldings[idx].amount = safeRound(parseAmount(val));
        notifyAssetChange();
    }
};

window.removeDubaiCustodianRow = function(idx) {
    if (assetData.personalHoldings[idx]) {
        assetData.personalHoldings.splice(idx, 1);
        renderCustodianRows();
        notifyAssetChange();
    }
};

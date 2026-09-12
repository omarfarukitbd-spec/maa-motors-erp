/**
 * Dubai Procurement & Weekly Audit - Smart Memo Range Grid
 * Auto-generates sequential memo rows from Start to End Memo number.
 * Features fast keyboard navigation (Enter to next) and live sum.
 */

import { formatAmountWithComma, parseAmount, safeRound } from '../utils.js';

let memoItems = [];
let onMemoChangeCallback = null;

export function initMemoGrid(initialMemos = [], onChange = null) {
    memoItems = Array.isArray(initialMemos) && initialMemos.length > 0 
        ? [...initialMemos] 
        : [];
    onMemoChangeCallback = onChange;
}

export function getMemoItems() {
    return [...memoItems];
}

export function renderMemoGridContainer(containerId) {
    const el = document.getElementById(containerId);
    if (!el) return;

    el.innerHTML = `
        <div class="bg-slate-900/60 border border-slate-700/60 rounded-2xl p-4 sm:p-5 backdrop-blur-md flex flex-col gap-4">
            <!-- Header & Generator Controls -->
            <div class="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-3 border-b border-slate-800">
                <div class="flex items-center gap-2">
                    <i class="fa-solid fa-receipt text-sky-400 text-lg"></i>
                    <h3 class="text-sm sm:text-base font-bold text-white">মাল কেনার মেমো বুক এন্ট্রি</h3>
                    <span id="dubai-memo-badge-count" class="px-2.5 py-0.5 rounded-full text-xs font-black bg-sky-500/10 text-sky-400 border border-sky-500/20">
                        (${memoItems.length}টি মেমো)
                    </span>
                </div>
                <div class="text-xs text-slate-400 font-semibold flex items-center gap-1.5">
                    <span>এই সপ্তাহের মেমো যোগফল:</span>
                    <span id="dubai-memo-live-total" class="text-emerald-400 font-bold font-mono text-sm sm:text-base">0 AED</span>
                </div>
            </div>

            <!-- Smart Range Generator Bar -->
            <div class="bg-slate-950/60 p-3 rounded-xl border border-slate-800 flex flex-wrap items-center gap-2 sm:gap-3">
                <div class="flex items-center gap-1.5 text-xs text-slate-300 font-semibold">
                    <i class="fa-solid fa-wand-magic-sparkles text-amber-400"></i>
                    <span>স্মার্ট রেঞ্জ জেনারেটর:</span>
                </div>
                <div class="flex items-center gap-1.5">
                    <span class="text-[11px] text-slate-400">শুরুর মেমো:</span>
                    <input type="number" id="dubai-memo-range-start" placeholder="১০৩" class="w-20 bg-slate-900 border border-slate-700 rounded-lg px-2 py-1 text-xs text-white focus:border-sky-500 outline-none text-center font-bold">
                </div>
                <div class="flex items-center gap-1.5">
                    <span class="text-[11px] text-slate-400">শেষ মেমো:</span>
                    <input type="number" id="dubai-memo-range-end" placeholder="১১২" class="w-20 bg-slate-900 border border-slate-700 rounded-lg px-2 py-1 text-xs text-white focus:border-sky-500 outline-none text-center font-bold">
                </div>
                <button type="button" id="btn-generate-memo-range" class="px-3 py-1 bg-sky-600 hover:bg-sky-500 text-white rounded-lg text-xs font-bold transition-all shadow-sm flex items-center gap-1 cursor-pointer">
                    <i class="fa-solid fa-bolt text-xs"></i>
                    <span>জেনারেট করুন</span>
                </button>
                <button type="button" id="btn-add-single-memo" class="ml-auto px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs font-semibold transition-all border border-slate-700 flex items-center gap-1 cursor-pointer">
                    <i class="fa-solid fa-plus text-xs text-sky-400"></i>
                    <span>একক মেমো যোগ</span>
                </button>
            </div>

            <!-- Memos Dynamic Rows List -->
            <div id="dubai-memo-rows-list" class="flex flex-col gap-2 max-h-[380px] overflow-y-auto custom-scrollbar pr-1">
                <!-- Rendered dynamically -->
            </div>
        </div>
    `;

    // Attach generator listeners
    const btnGen = document.getElementById('btn-generate-memo-range');
    if (btnGen) {
        btnGen.onclick = () => {
            const startVal = parseInt(document.getElementById('dubai-memo-range-start').value, 10);
            const endVal = parseInt(document.getElementById('dubai-memo-range-end').value, 10);
            if (!isNaN(startVal) && !isNaN(endVal) && endVal >= startVal) {
                generateMemoRange(startVal, endVal);
            }
        };
    }

    const btnAdd = document.getElementById('btn-add-single-memo');
    if (btnAdd) {
        btnAdd.onclick = () => {
            const lastNo = memoItems.length > 0 ? (parseInt(memoItems[memoItems.length - 1].memoNo, 10) || 0) + 1 : 1;
            memoItems.push({ memoNo: String(lastNo), amount: 0, note: '' });
            renderMemoRows();
            notifyChange();
        };
    }

    renderMemoRows();
}

export function generateMemoRange(startNo, endNo) {
    const count = endNo - startNo + 1;
    if (count > 200) {
        window.showToast && window.showToast('সর্বোচ্চ ২০০টি মেমো একসাথে তৈরি করা যাবে', 'error');
        return;
    }

    // Preserve existing amount if memoNo already exists
    const existingMap = new Map();
    memoItems.forEach(item => {
        existingMap.set(String(item.memoNo), item.amount);
    });

    const newItems = [];
    for (let i = startNo; i <= endNo; i++) {
        const noStr = String(i);
        newItems.push({
            memoNo: noStr,
            amount: existingMap.has(noStr) ? existingMap.get(noStr) : 0,
            note: ''
        });
    }

    memoItems = newItems;
    renderMemoRows();
    notifyChange();

    // Auto-focus first empty amount input
    setTimeout(() => {
        const firstInput = document.querySelector('.dubai-memo-amt-input');
        if (firstInput) firstInput.focus();
    }, 50);
}

export function renderMemoRows() {
    const listEl = document.getElementById('dubai-memo-rows-list');
    const badgeEl = document.getElementById('dubai-memo-badge-count');
    const liveTotalEl = document.getElementById('dubai-memo-live-total');

    if (!listEl) return;

    if (badgeEl) badgeEl.textContent = `(${memoItems.length}টি মেমো)`;

    if (memoItems.length === 0) {
        listEl.innerHTML = `
            <div class="text-center py-8 text-slate-500 text-xs">
                <i class="fa-solid fa-file-invoice text-2xl mb-2 text-slate-600"></i>
                <p>কোনো মেমো এন্ট্রি নেই। উপরে শুরুর ও শেষ মেমো নম্বর দিয়ে <strong>"জেনারেট করুন"</strong> চাপুন।</p>
            </div>
        `;
        if (liveTotalEl) liveTotalEl.textContent = '0 AED';
        return;
    }

    let html = '';
    let totalAmt = 0;

    memoItems.forEach((m, idx) => {
        const amt = safeRound(parseAmount(m.amount));
        totalAmt = safeRound(totalAmt + amt);
        html += `
            <div class="flex items-center gap-2 p-2 bg-slate-800/40 hover:bg-slate-800/80 border border-slate-700/50 rounded-xl transition-colors" data-index="${idx}">
                <span class="w-6 text-center text-[11px] font-bold text-slate-500">${idx + 1}</span>
                <div class="flex items-center gap-1.5 w-28 shrink-0">
                    <span class="text-xs text-slate-400 font-semibold">মেমো:</span>
                    <input type="text" value="${m.memoNo || ''}" onchange="window.handleDubaiMemoNoChange(${idx}, this.value)" class="w-full bg-slate-900 border border-slate-700 rounded-lg px-2 py-1 text-xs text-sky-400 font-bold text-center focus:border-sky-500 outline-none">
                </div>
                <div class="flex-grow flex items-center gap-2">
                    <input type="text" value="${amt > 0 ? formatAmountWithComma(amt) : ''}" placeholder="০.০০" oninput="window.handleNumberInput(this)" onchange="window.handleDubaiMemoAmtChange(${idx}, this.value)" onkeydown="window.handleDubaiMemoKeydown(event, ${idx})" class="dubai-memo-amt-input w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-1 text-xs text-emerald-400 font-bold font-mono text-right focus:border-emerald-500 outline-none" data-idx="${idx}">
                    <span class="text-[11px] font-bold text-slate-400 shrink-0">AED</span>
                </div>
                <button type="button" onclick="window.removeDubaiMemoRow(${idx})" class="w-7 h-7 flex items-center justify-center rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 transition-all cursor-pointer" title="মুছে ফেলুন">
                    <i class="fa-solid fa-trash-can text-xs"></i>
                </button>
            </div>
        `;
    });

    listEl.innerHTML = html;
    if (liveTotalEl) liveTotalEl.textContent = `${formatAmountWithComma(totalAmt)} AED`;
}

function notifyChange() {
    let totalAmt = 0;
    memoItems.forEach(m => {
        totalAmt = safeRound(totalAmt + safeRound(parseAmount(m.amount)));
    });
    if (typeof onMemoChangeCallback === 'function') {
        onMemoChangeCallback({
            memos: [...memoItems],
            totalAmount: totalAmt,
            count: memoItems.length
        });
    }
}

// Window bindings for event handlers
window.handleDubaiMemoNoChange = function(idx, val) {
    if (memoItems[idx]) {
        memoItems[idx].memoNo = String(val).trim();
        notifyChange();
    }
};

window.handleDubaiMemoAmtChange = function(idx, val) {
    if (memoItems[idx]) {
        memoItems[idx].amount = safeRound(parseAmount(val));
        renderMemoRows();
        notifyChange();
    }
};

window.handleDubaiMemoKeydown = function(event, idx) {
    if (event.key === 'Enter') {
        event.preventDefault();
        const nextInput = document.querySelector(`.dubai-memo-amt-input[data-idx="${idx + 1}"]`);
        if (nextInput) {
            nextInput.focus();
            nextInput.select();
        }
    }
};

window.removeDubaiMemoRow = function(idx) {
    if (memoItems[idx]) {
        memoItems.splice(idx, 1);
        renderMemoRows();
        notifyChange();
    }
};

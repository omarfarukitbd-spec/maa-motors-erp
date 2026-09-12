/**
 * Dubai Procurement & Weekly Audit - Remittance & Expense Flow Grids
 * Handles entry of Remittances (দেশ থেকে দেরহাম আসা) and Running Expenses (দৈনন্দিন খরচ).
 */

import { formatAmountWithComma, parseAmount, safeRound, getTodayLocalDateString } from '../utils.js';

let remittances = [];
let expenses = [];
let onFlowChangeCallback = null;

export function initFlowGrids(initialRemittances = [], initialExpenses = [], onChange = null) {
    remittances = Array.isArray(initialRemittances) ? [...initialRemittances] : [];
    expenses = Array.isArray(initialExpenses) ? [...initialExpenses] : [];
    onFlowChangeCallback = onChange;
}

export function getFlowData() {
    let remTotal = 0;
    remittances.forEach(r => {
        remTotal = safeRound(remTotal + safeRound(parseAmount(r.amount)));
    });

    let expTotal = 0;
    expenses.forEach(e => {
        expTotal = safeRound(expTotal + safeRound(parseAmount(e.amount)));
    });

    return {
        remittances: [...remittances],
        weeklyRemittanceTotal: remTotal,
        expenses: [...expenses],
        weeklyExpenseTotal: expTotal
    };
}

export function renderRemittanceSection(containerId) {
    const el = document.getElementById(containerId);
    if (!el) return;

    el.innerHTML = `
        <div class="bg-slate-900/60 border border-slate-700/60 rounded-2xl p-4 sm:p-5 backdrop-blur-md flex flex-col gap-3">
            <div class="flex items-center justify-between pb-2.5 border-b border-slate-800">
                <div class="flex items-center gap-2">
                    <i class="fa-solid fa-plane-arrival text-emerald-400 text-lg"></i>
                    <h3 class="text-sm sm:text-base font-bold text-white">দেশ থেকে দেরহাম আসা (রেমিট্যান্স)</h3>
                </div>
                <button type="button" id="btn-add-remittance-row" class="px-2.5 py-1 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/20 rounded-lg text-xs font-semibold flex items-center gap-1 cursor-pointer">
                    <i class="fa-solid fa-plus text-[10px]"></i>
                    <span>দেরহাম এন্ট্রি</span>
                </button>
            </div>
            <div id="dubai-remittance-rows-list" class="flex flex-col gap-2 max-h-[220px] overflow-y-auto custom-scrollbar pr-1">
                <!-- Rendered dynamically -->
            </div>
        </div>
    `;

    const btn = document.getElementById('btn-add-remittance-row');
    if (btn) {
        btn.onclick = () => {
            remittances.push({ date: getTodayLocalDateString(), via: 'মিনহাজ', amount: 0 });
            renderRemittanceRows();
            notifyFlowChange();
        };
    }

    renderRemittanceRows();
}

export function renderExpenseSection(containerId) {
    const el = document.getElementById(containerId);
    if (!el) return;

    el.innerHTML = `
        <div class="bg-slate-900/60 border border-slate-700/60 rounded-2xl p-4 sm:p-5 backdrop-blur-md flex flex-col gap-3">
            <div class="flex items-center justify-between pb-2.5 border-b border-slate-800">
                <div class="flex items-center gap-2">
                    <i class="fa-solid fa-wallet text-red-400 text-lg"></i>
                    <h3 class="text-sm sm:text-base font-bold text-white">আনুষঙ্গিক লজিস্টিক ও ফিল্ড খরচ</h3>
                </div>
                <button type="button" id="btn-add-expense-row" class="px-2.5 py-1 bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 rounded-lg text-xs font-semibold flex items-center gap-1 cursor-pointer">
                    <i class="fa-solid fa-plus text-[10px]"></i>
                    <span>খরচ যোগ</span>
                </button>
            </div>
            <div id="dubai-expense-rows-list" class="flex flex-col gap-2 max-h-[220px] overflow-y-auto custom-scrollbar pr-1">
                <!-- Rendered dynamically -->
            </div>
        </div>
    `;

    const btn = document.getElementById('btn-add-expense-row');
    if (btn) {
        btn.onclick = () => {
            expenses.push({ date: getTodayLocalDateString(), note: 'চা ও নাস্তা', amount: 0 });
            renderExpenseRows();
            notifyFlowChange();
        };
    }

    renderExpenseRows();
}

function renderRemittanceRows() {
    const listEl = document.getElementById('dubai-remittance-rows-list');
    if (!listEl) return;

    if (remittances.length === 0) {
        listEl.innerHTML = `
            <div class="text-xs text-slate-500 italic py-3 text-center">
                এই সপ্তাহে কোনো রেমিট্যান্স না আসলে খালি থাকবে। নতুনদের দেরহাম যুক্ত করতে উপরে <strong>"দেরহাম এন্ট্রি"</strong> চাপুন।
            </div>
        `;
        return;
    }

    let html = '';
    remittances.forEach((r, idx) => {
        const amt = safeRound(parseAmount(r.amount));
        html += `
            <div class="flex items-center gap-2 p-1.5 bg-slate-800/40 border border-slate-700/60 rounded-xl">
                <input type="text" value="${r.date || ''}" placeholder="তারিখ" onchange="window.handleDubaiRemDateChange(${idx}, this.value)" class="w-24 bg-slate-900 border border-slate-700 rounded-lg px-2 py-1 text-xs text-slate-300 font-mono text-center focus:border-emerald-500 outline-none">
                <input type="text" value="${r.via || ''}" placeholder="কার মাধ্যমে (যেমন: মিনহাজ / আলতাফ)" onchange="window.handleDubaiRemViaChange(${idx}, this.value)" class="flex-grow bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1 text-xs text-white focus:border-emerald-500 outline-none">
                <div class="relative w-32 shrink-0">
                    <input type="text" value="${amt > 0 ? formatAmountWithComma(amt) : ''}" placeholder="০.০০" oninput="window.handleNumberInput(this)" onchange="window.handleDubaiRemAmtChange(${idx}, this.value)" class="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1 text-xs text-emerald-400 font-bold font-mono text-right focus:border-emerald-500 outline-none">
                    <span class="absolute left-2 top-1/2 -translate-y-1/2 text-[10px] font-bold text-slate-500">AED</span>
                </div>
                <button type="button" onclick="window.removeDubaiRemRow(${idx})" class="w-6 h-6 flex items-center justify-center rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 transition-all cursor-pointer" title="মুছে ফেলুন">
                    <i class="fa-solid fa-xmark text-xs"></i>
                </button>
            </div>
        `;
    });

    listEl.innerHTML = html;
}

function renderExpenseRows() {
    const listEl = document.getElementById('dubai-expense-rows-list');
    if (!listEl) return;

    if (expenses.length === 0) {
        listEl.innerHTML = `
            <div class="text-xs text-slate-500 italic py-3 text-center">
                এই সপ্তাহে কোনো খরচ না থাকলে খালি থাকবে। নতুন খরচ যুক্ত করতে উপরে <strong>"খরচ যোগ"</strong> চাপুন।
            </div>
        `;
        return;
    }

    let html = '';
    expenses.forEach((e, idx) => {
        const amt = safeRound(parseAmount(e.amount));
        html += `
            <div class="flex items-center gap-2 p-1.5 bg-slate-800/40 border border-slate-700/60 rounded-xl">
                <input type="text" value="${e.date || ''}" placeholder="তারিখ" onchange="window.handleDubaiExpDateChange(${idx}, this.value)" class="w-24 bg-slate-900 border border-slate-700 rounded-lg px-2 py-1 text-xs text-slate-300 font-mono text-center focus:border-red-500 outline-none">
                <input type="text" value="${e.note || ''}" placeholder="বিবরণ (চা / গাড়ি ভাড়া / মেস মিল / রুম ভাড়া)" onchange="window.handleDubaiExpNoteChange(${idx}, this.value)" class="flex-grow bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1 text-xs text-white focus:border-red-500 outline-none">
                <div class="relative w-28 shrink-0">
                    <input type="text" value="${amt > 0 ? formatAmountWithComma(amt) : ''}" placeholder="০.০০" oninput="window.handleNumberInput(this)" onchange="window.handleDubaiExpAmtChange(${idx}, this.value)" class="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1 text-xs text-red-400 font-bold font-mono text-right focus:border-red-500 outline-none">
                    <span class="absolute left-2 top-1/2 -translate-y-1/2 text-[10px] font-bold text-slate-500">AED</span>
                </div>
                <button type="button" onclick="window.removeDubaiExpRow(${idx})" class="w-6 h-6 flex items-center justify-center rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 transition-all cursor-pointer" title="মুছে ফেলুন">
                    <i class="fa-solid fa-xmark text-xs"></i>
                </button>
            </div>
        `;
    });

    listEl.innerHTML = html;
}

function notifyFlowChange() {
    if (typeof onFlowChangeCallback === 'function') {
        onFlowChangeCallback(getFlowData());
    }
}

// Remittance Handlers
window.handleDubaiRemDateChange = function(idx, val) {
    if (remittances[idx]) {
        remittances[idx].date = String(val).trim();
        notifyFlowChange();
    }
};

window.handleDubaiRemViaChange = function(idx, val) {
    if (remittances[idx]) {
        remittances[idx].via = String(val).trim();
        notifyFlowChange();
    }
};

window.handleDubaiRemAmtChange = function(idx, val) {
    if (remittances[idx]) {
        remittances[idx].amount = safeRound(parseAmount(val));
        renderRemittanceRows();
        notifyFlowChange();
    }
};

window.removeDubaiRemRow = function(idx) {
    if (remittances[idx]) {
        remittances.splice(idx, 1);
        renderRemittanceRows();
        notifyFlowChange();
    }
};

// Expense Handlers
window.handleDubaiExpDateChange = function(idx, val) {
    if (expenses[idx]) {
        expenses[idx].date = String(val).trim();
        notifyFlowChange();
    }
};

window.handleDubaiExpNoteChange = function(idx, val) {
    if (expenses[idx]) {
        expenses[idx].note = String(val).trim();
        notifyFlowChange();
    }
};

window.handleDubaiExpAmtChange = function(idx, val) {
    if (expenses[idx]) {
        expenses[idx].amount = safeRound(parseAmount(val));
        renderExpenseRows();
        notifyFlowChange();
    }
};

window.removeDubaiExpRow = function(idx) {
    if (expenses[idx]) {
        expenses.splice(idx, 1);
        renderExpenseRows();
        notifyFlowChange();
    }
};

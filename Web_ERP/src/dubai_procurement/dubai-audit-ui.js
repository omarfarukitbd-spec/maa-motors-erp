/**
 * Dubai Procurement & Weekly Audit - Main UI Controller
 * Manages the authentic 2-column waterfall table with editable descriptions and separated assets.
 */

import { DubaiActions } from './dubai-audit-actions.js';
import { printDubaiAuditSheet } from './dubai-print.js';
import { getDubaiAuditMainTemplate } from './dubai-audit-template.js';
import { DubaiMemoModal } from './dubai-memo-modal.js';
import { renderDubaiHistoryTable } from './dubai-audit-history.js';
import { 
    formatAmountWithComma, parseAmount, safeRound, getTodayLocalDateString, 
    showToast 
} from '../utils.js';

let currentAuditId = null;
let auditHistory = [];
let dynamicHoldings = [
    { desc: 'আলতাফ + মেছ (৫০,০০০ + ৪৮৮)', amount: 50488 }
];

export async function renderDubaiProcurement(container) {
    if (!container) return;

    container.innerHTML = getDubaiAuditMainTemplate();

    DubaiMemoModal.init((total, memoRangeText) => {
        const purInp = document.getElementById('input-running-purchase');
        if (purInp) purInp.value = formatAmountWithComma(total);

        const memoDescInp = document.getElementById('desc-memos');
        if (memoDescInp && memoRangeText) memoDescInp.value = memoRangeText;

        const mStart = document.getElementById('modal-memo-start')?.value;
        const mEnd = document.getElementById('modal-memo-end')?.value;
        if (mStart) document.getElementById('memo-range-start').value = mStart;
        if (mEnd) document.getElementById('memo-range-end').value = mEnd;
        window.handleMemoRangeChange();

        updateLiveWaterfall();
    });

    setupActionButtons();
    renderDynamicHoldings();
    window.handleMemoRangeChange();
    updateLiveWaterfall();
    listenToHistory();
}

function setupActionButtons() {
    const btnSave = document.getElementById('btn-dubai-save');
    if (btnSave) btnSave.onclick = () => onSaveAuditClick();

    const btnPrint = document.getElementById('btn-dubai-print');
    if (btnPrint) btnPrint.onclick = () => onPrintAuditClick();

    const btnNew = document.getElementById('btn-dubai-new');
    if (btnNew) btnNew.onclick = () => onNewAuditClick();

    const btnRoll = document.getElementById('btn-dubai-roll-forward');
    if (btnRoll) btnRoll.onclick = () => onRollForwardClick();

    const btnAddHold = document.getElementById('btn-add-waterfall-holding');
    if (btnAddHold) {
        btnAddHold.onclick = () => {
            dynamicHoldings.push({ desc: 'নতুন বিবরণ', amount: 0 });
            renderDynamicHoldings();
            updateLiveWaterfall();
        };
    }
}

export function updateLiveWaterfall() {
    // 1. Cumulative amounts directly from left column inputs
    const cumSent = safeRound(parseAmount(document.getElementById('input-cum-sent')?.value || 0));
    const cumPur = safeRound(parseAmount(document.getElementById('input-cum-purchase')?.value || 0));
    const cumExp = safeRound(parseAmount(document.getElementById('input-cum-expense')?.value || 0));

    // 2. Subtotals
    const sub1 = safeRound(cumSent - cumPur);
    const sub2 = safeRound(sub1 - cumExp);

    // 3. Separated Market Advance & Cash
    const marketAd = safeRound(parseAmount(document.getElementById('val-market-ad')?.value || 0));
    const cashInHand = safeRound(parseAmount(document.getElementById('val-cash-in-hand')?.value || 0));
    const sub3 = safeRound(sub2 - marketAd - cashInHand);

    // 4. Dynamic Holdings sum
    let holdingsTotal = 0;
    dynamicHoldings.forEach(h => {
        holdingsTotal = safeRound(holdingsTotal + safeRound(parseAmount(h.amount)));
    });

    // 5. Final Variance (Subtotal 3 - Holdings)
    const finalVariance = safeRound(sub3 - holdingsTotal);

    // Update DOM Subtotals & Variance
    const setTxt = (id, val) => { 
        const el = document.getElementById(id); 
        if (el) el.textContent = formatAmountWithComma(val); 
    };
    setTxt('subtotal-1', sub1);
    setTxt('subtotal-2', sub2);
    setTxt('subtotal-3', sub3);
    setTxt('val-final-variance', finalVariance);

    const badgeEl = document.getElementById('final-variance-badge');
    const statusDescEl = document.getElementById('desc-final-status');
    const valFinalEl = document.getElementById('val-final-variance');

    if (finalVariance >= 0) {
        if (badgeEl) {
            badgeEl.className = 'px-2.5 py-0.5 rounded-full text-xs font-black bg-emerald-500/20 text-emerald-400 border border-emerald-500/40';
            badgeEl.textContent = 'ক্যাশ বাড়তি';
        }
        if (statusDescEl && !statusDescEl.dataset.custom) statusDescEl.value = '(ক্যাশ বাড়তি)';
        if (valFinalEl) valFinalEl.className = 'text-emerald-400 font-bold';
    } else {
        if (badgeEl) {
            badgeEl.className = 'px-2.5 py-0.5 rounded-full text-xs font-black bg-red-500/20 text-red-400 border border-red-500/40';
            badgeEl.textContent = 'ক্যাশ ঘাটতি';
        }
        if (statusDescEl && !statusDescEl.dataset.custom) statusDescEl.value = '(ক্যাশ ঘাটতি)';
        if (valFinalEl) valFinalEl.className = 'text-red-400 font-bold';
    }

    const dateVal = document.getElementById('dubai-week-date')?.value || '';
    const lblDate = document.getElementById('label-table-date');
    if (lblDate && dateVal) lblDate.textContent = `তারিখ: ${dateVal} (বৃহস্পতিবার)`;
}

window.handleDubaiWaterfallChange = function() {
    updateLiveWaterfall();
};

window.handleRunningChange = function(type) {
    const prevRem = safeRound(parseAmount(document.getElementById('dubai-prev-rem-input')?.value || 0));
    const prevPur = safeRound(parseAmount(document.getElementById('dubai-prev-pur-input')?.value || 0));
    const prevExp = safeRound(parseAmount(document.getElementById('dubai-prev-exp-input')?.value || 0));

    if (type === 'sent') {
        const running = safeRound(parseAmount(document.getElementById('input-running-sent')?.value || 0));
        if (prevRem > 0) {
            const cumInp = document.getElementById('input-cum-sent');
            if (cumInp) cumInp.value = formatAmountWithComma(safeRound(prevRem + running));
        }
    } else if (type === 'purchase') {
        const running = safeRound(parseAmount(document.getElementById('input-running-purchase')?.value || 0));
        if (prevPur > 0) {
            const cumInp = document.getElementById('input-cum-purchase');
            if (cumInp) cumInp.value = formatAmountWithComma(safeRound(prevPur + running));
        }
    } else if (type === 'expense') {
        const running = safeRound(parseAmount(document.getElementById('input-running-expense')?.value || 0));
        if (prevExp > 0) {
            const cumInp = document.getElementById('input-cum-expense');
            if (cumInp) cumInp.value = formatAmountWithComma(safeRound(prevExp + running));
        }
    }
    updateLiveWaterfall();
};

window.handleMemoRangeChange = function() {
    const startInp = document.getElementById('memo-range-start');
    const endInp = document.getElementById('memo-range-end');
    const badgeEl = document.getElementById('memo-auto-count-badge');
    const descEl = document.getElementById('desc-memos');

    const startVal = parseInt(startInp?.value, 10);
    const endVal = parseInt(endInp?.value, 10);

    if (!isNaN(startVal) && !isNaN(endVal) && endVal >= startVal) {
        const count = endVal - startVal + 1;
        if (badgeEl) badgeEl.textContent = `${count}টি মেমো`;
        if (descEl) descEl.value = `মেমো নং: (${startVal}-${endVal}) = ${count}টি`;

        const modalStart = document.getElementById('modal-memo-start');
        const modalEnd = document.getElementById('modal-memo-end');
        if (modalStart) modalStart.value = startVal;
        if (modalEnd) modalEnd.value = endVal;
    } else if (!isNaN(startVal) && isNaN(endVal)) {
        if (badgeEl) badgeEl.textContent = `১টি মেমো`;
        if (descEl) descEl.value = `মেমো নং: (${startVal})`;
    } else {
        if (badgeEl) badgeEl.textContent = `০টি মেমো`;
    }
};

window.openDubaiMemoDetailsModal = function() {
    const startVal = parseInt(document.getElementById('memo-range-start')?.value, 10);
    const endVal = parseInt(document.getElementById('memo-range-end')?.value, 10);
    if (!isNaN(startVal) && !isNaN(endVal) && endVal >= startVal) {
        const modalStart = document.getElementById('modal-memo-start');
        const modalEnd = document.getElementById('modal-memo-end');
        if (modalStart) modalStart.value = startVal;
        if (modalEnd) modalEnd.value = endVal;
        DubaiMemoModal.generateMemos();
    }
    DubaiMemoModal.toggle(true);
};

window.addDubaiHoldingPreset = function(presetName) {
    dynamicHoldings.push({ desc: presetName, amount: 0 });
    renderDynamicHoldings();
    updateLiveWaterfall();
};

function renderDynamicHoldings() {
    const cont = document.getElementById('dubai-dynamic-holdings-container');
    if (!cont) return;

    let html = '';
    dynamicHoldings.forEach((h, idx) => {
        const amt = safeRound(parseAmount(h.amount));
        html += `
            <div class="grid grid-cols-12 border-b border-slate-800 bg-slate-900/40 hover:bg-slate-800/30 transition-colors">
                <div class="col-span-8 p-2.5 border-r border-slate-800 flex items-center justify-between gap-2">
                    <div class="flex items-center gap-2 flex-grow">
                        <input type="text" value="${h.desc || ''}" placeholder="বিবরণ (যেমন: আলতাফ + মেছ)" onchange="window.handleDubaiHoldingDescChange(${idx}, this.value)" class="bg-transparent border-b border-dashed border-slate-700 text-purple-300 text-xs font-bold focus:border-purple-400 outline-none w-64">
                        <span class="text-slate-500 text-[10px]"><i class="fa-solid fa-minus text-purple-400 mr-1"></i> বিয়োগ</span>
                    </div>
                    <div class="relative w-36 shrink-0 flex items-center gap-1.5">
                        <input type="text" value="${amt > 0 ? formatAmountWithComma(amt) : ''}" placeholder="০.০০" oninput="window.handleNumberInput(this)" onchange="window.handleDubaiHoldingAmtChange(${idx}, this.value)" class="w-full bg-slate-950 border border-slate-700 rounded px-2 py-0.5 text-xs text-purple-300 font-mono text-right font-bold focus:border-purple-500 outline-none">
                        <button type="button" onclick="window.removeDubaiHoldingRow(${idx})" class="w-5 h-5 rounded flex items-center justify-center text-slate-500 hover:text-red-400 hover:bg-red-500/10 cursor-pointer" title="মুছে ফেলুন">
                            <i class="fa-solid fa-xmark text-[10px]"></i>
                        </button>
                    </div>
                </div>
                <div class="col-span-4 p-2.5 bg-slate-950/20 text-slate-500 text-[10px] flex items-center">
                    ব্যক্তিগত হস্তান্তর / মেস
                </div>
            </div>
        `;
    });
    cont.innerHTML = html;
}

window.handleDubaiHoldingDescChange = function(idx, val) {
    if (dynamicHoldings[idx]) dynamicHoldings[idx].desc = String(val).trim();
};

window.handleDubaiHoldingAmtChange = function(idx, val) {
    if (dynamicHoldings[idx]) {
        dynamicHoldings[idx].amount = safeRound(parseAmount(val));
        updateLiveWaterfall();
    }
};

window.removeDubaiHoldingRow = function(idx) {
    if (dynamicHoldings[idx]) {
        dynamicHoldings.splice(idx, 1);
        renderDynamicHoldings();
        updateLiveWaterfall();
    }
};

// --- Actions & History Handlers ---
async function onRollForwardClick() {
    const latest = await DubaiActions.rollForward();
    if (!latest) return;
    const prevRem = latest.cumulativeRemittance || 0;
    const prevPur = latest.cumulativePurchaseTotal || 0;
    const prevExp = latest.cumulativeExpenseTotal || 0;

    document.getElementById('dubai-prev-rem-input').value = formatAmountWithComma(prevRem);
    document.getElementById('dubai-prev-pur-input').value = formatAmountWithComma(prevPur);
    document.getElementById('dubai-prev-exp-input').value = formatAmountWithComma(prevExp);

    document.getElementById('input-cum-sent').value = formatAmountWithComma(prevRem);
    document.getElementById('input-cum-purchase').value = formatAmountWithComma(prevPur);
    document.getElementById('input-cum-expense').value = formatAmountWithComma(prevExp);

    document.getElementById('input-running-sent').value = '';
    document.getElementById('input-running-purchase').value = '';
    document.getElementById('input-running-expense').value = '';

    updateLiveWaterfall();
    showToast(`পূর্ববর্তী অডিট (${latest.weekEndDate || ''}) থেকে ব্যালেন্স আনা হয়েছে`, 'success');
}

async function onSaveAuditClick() {
    const payload = buildCurrentAuditObject();
    if (currentAuditId) payload.id = currentAuditId;
    const memos = DubaiMemoModal.getMemos();
    const savedId = await DubaiActions.saveAudit(payload, memos);
    if (savedId) currentAuditId = savedId;
}

function onPrintAuditClick() {
    const payload = buildCurrentAuditObject();
    const memos = DubaiMemoModal.getMemos();
    printDubaiAuditSheet(payload, memos, [], []);
}

function buildCurrentAuditObject() {
    const cumSent = safeRound(parseAmount(document.getElementById('input-cum-sent')?.value || 0));
    const cumPur = safeRound(parseAmount(document.getElementById('input-cum-purchase')?.value || 0));
    const cumExp = safeRound(parseAmount(document.getElementById('input-cum-expense')?.value || 0));

    const runningSent = safeRound(parseAmount(document.getElementById('input-running-sent')?.value || 0));
    const runningPur = safeRound(parseAmount(document.getElementById('input-running-purchase')?.value || 0));
    const runningExp = safeRound(parseAmount(document.getElementById('input-running-expense')?.value || 0));

    const prevRem = Math.max(0, safeRound(cumSent - runningSent));
    const prevPur = Math.max(0, safeRound(cumPur - runningPur));
    const prevExp = Math.max(0, safeRound(cumExp - runningExp));

    const marketAd = safeRound(parseAmount(document.getElementById('val-market-ad')?.value || 0));
    const cashInHand = safeRound(parseAmount(document.getElementById('val-cash-in-hand')?.value || 0));

    let holdingsTotal = 0;
    dynamicHoldings.forEach(h => { holdingsTotal = safeRound(holdingsTotal + safeRound(parseAmount(h.amount))); });

    const totalPhysical = safeRound(marketAd + cashInHand + holdingsTotal);
    const theoreticalCash = safeRound(cumSent - cumPur - cumExp);
    const finalVariance = safeRound(theoreticalCash - totalPhysical);

    const mStart = document.getElementById('memo-range-start')?.value || '';
    const mEnd = document.getElementById('memo-range-end')?.value || '';
    const mStartNum = parseInt(mStart, 10);
    const mEndNum = parseInt(mEnd, 10);
    const memoCount = (!isNaN(mStartNum) && !isNaN(mEndNum) && mEndNum >= mStartNum) 
        ? (mEndNum - mStartNum + 1) 
        : (!isNaN(mStartNum) ? 1 : 0);

    return {
        containerNo: document.getElementById('dubai-container-no')?.value?.trim() || 'CT-2026-DXB-01',
        weekEndDate: document.getElementById('dubai-week-date')?.value?.trim() || getTodayLocalDateString(),
        note: document.getElementById('dubai-audit-note')?.value?.trim() || '',
        descriptions: {
            sent: document.getElementById('desc-sent')?.value || 'বৃহস্পতিবার পর্যন্ত টাকা পাঠানো',
            purchase: document.getElementById('desc-purchase')?.value || 'সর্বমোট মাল ক্রয়',
            memos: document.getElementById('desc-memos')?.value || '',
            expense: document.getElementById('desc-expense')?.value || 'সর্বমোট খরচ',
            ad: document.getElementById('desc-ad')?.value || 'মার্কেট এডভান্স (AD)',
            cash: document.getElementById('desc-cash')?.value || 'নগদ ক্যাশ আছে (Cash in Hand)',
            status: document.getElementById('desc-final-status')?.value || '(ক্যাশ বাড়তি)'
        },
        memoRangeStart: mStart,
        memoRangeEnd: mEnd,
        memoCount: memoCount,
        prevRemittance: prevRem,
        weeklyRemittanceTotal: runningSent,
        cumulativeRemittance: cumSent,
        prevPurchaseTotal: prevPur,
        weeklyPurchaseTotal: runningPur,
        cumulativePurchaseTotal: cumPur,
        prevExpenseTotal: prevExp,
        weeklyExpenseTotal: runningExp,
        cumulativeExpenseTotal: cumExp,
        marketAdvance: marketAd,
        cashInHand: cashInHand,
        personalHoldings: [...dynamicHoldings],
        totalPhysicalAssets: totalPhysical,
        calculatedCashBalance: theoreticalCash,
        varianceAmount: finalVariance,
        status: 'CLOSED'
    };
}

function onNewAuditClick() {
    currentAuditId = null;
    document.getElementById('dubai-week-date').value = getTodayLocalDateString();
    document.getElementById('dubai-audit-note').value = '';
    document.getElementById('dubai-prev-rem-input').value = '0';
    document.getElementById('dubai-prev-pur-input').value = '0';
    document.getElementById('dubai-prev-exp-input').value = '0';
    document.getElementById('input-cum-sent').value = '';
    document.getElementById('input-cum-purchase').value = '';
    document.getElementById('input-cum-expense').value = '';
    document.getElementById('input-running-sent').value = '';
    document.getElementById('input-running-purchase').value = '';
    document.getElementById('input-running-expense').value = '';
    document.getElementById('val-market-ad').value = '';
    document.getElementById('val-cash-in-hand').value = '';
    if (document.getElementById('memo-range-start')) document.getElementById('memo-range-start').value = '';
    if (document.getElementById('memo-range-end')) document.getElementById('memo-range-end').value = '';
    const badgeEl = document.getElementById('memo-auto-count-badge');
    if (badgeEl) badgeEl.textContent = '০টি মেমো';
    const descMemos = document.getElementById('desc-memos');
    if (descMemos) descMemos.value = '';
    dynamicHoldings = [{ desc: 'আলতাফ + মেছ', amount: 0 }];
    DubaiMemoModal.setMemos([]);
    renderDynamicHoldings();
    updateLiveWaterfall();
    showToast('নতুন সপ্তাহের ব্ল্যাঙ্ক অডিট প্রস্তুত', 'info');
}

function listenToHistory() {
    DubaiActions.listenAudits(audits => {
        auditHistory = audits;
        renderDubaiHistoryTable('dubai-history-tbody', auditHistory);
    });
}

window.loadDubaiAuditHistory = async function(id) {
    const data = await DubaiActions.loadAudit(id);
    if (!data) return;
    const { audit, memos } = data;

    currentAuditId = audit.id;
    document.getElementById('dubai-container-no').value = audit.containerNo || 'CT-2026-DXB-01';
    document.getElementById('dubai-week-date').value = audit.weekEndDate || '';
    document.getElementById('dubai-audit-note').value = audit.note || '';

    if (audit.descriptions) {
        if (audit.descriptions.sent) document.getElementById('desc-sent').value = audit.descriptions.sent;
        if (audit.descriptions.purchase) document.getElementById('desc-purchase').value = audit.descriptions.purchase;
        if (audit.descriptions.memos) document.getElementById('desc-memos').value = audit.descriptions.memos;
        if (audit.descriptions.expense) document.getElementById('desc-expense').value = audit.descriptions.expense;
        if (audit.descriptions.ad) document.getElementById('desc-ad').value = audit.descriptions.ad;
        if (audit.descriptions.cash) document.getElementById('desc-cash').value = audit.descriptions.cash;
        if (audit.descriptions.status) document.getElementById('desc-final-status').value = audit.descriptions.status;
    }

    if (document.getElementById('memo-range-start')) {
        document.getElementById('memo-range-start').value = audit.memoRangeStart || '';
    }
    if (document.getElementById('memo-range-end')) {
        document.getElementById('memo-range-end').value = audit.memoRangeEnd || '';
    }
    window.handleMemoRangeChange();

    document.getElementById('dubai-prev-rem-input').value = formatAmountWithComma(audit.prevRemittance || 0);
    document.getElementById('dubai-prev-pur-input').value = formatAmountWithComma(audit.prevPurchaseTotal || 0);
    document.getElementById('dubai-prev-exp-input').value = formatAmountWithComma(audit.prevExpenseTotal || 0);

    document.getElementById('input-cum-sent').value = formatAmountWithComma(audit.cumulativeRemittance || 0);
    document.getElementById('input-cum-purchase').value = formatAmountWithComma(audit.cumulativePurchaseTotal || 0);
    document.getElementById('input-cum-expense').value = formatAmountWithComma(audit.cumulativeExpenseTotal || 0);

    document.getElementById('input-running-sent').value = formatAmountWithComma(audit.weeklyRemittanceTotal || 0);
    document.getElementById('input-running-purchase').value = formatAmountWithComma(audit.weeklyPurchaseTotal || 0);
    document.getElementById('input-running-expense').value = formatAmountWithComma(audit.weeklyExpenseTotal || 0);

    document.getElementById('val-market-ad').value = formatAmountWithComma(audit.marketAdvance || 0);
    document.getElementById('val-cash-in-hand').value = formatAmountWithComma(audit.cashInHand || 0);

    dynamicHoldings = Array.isArray(audit.personalHoldings) && audit.personalHoldings.length > 0 
        ? [...audit.personalHoldings] 
        : [{ desc: 'আলতাফ / জাবেদ', amount: 0 }];
    renderDynamicHoldings();

    DubaiMemoModal.setMemos(Array.isArray(memos) ? memos : []);

    updateLiveWaterfall();
    showToast(`অডিট লোড করা হয়েছে (${audit.weekEndDate || ''})`, 'info');
};

window.printDubaiAuditHistory = async function(id) {
    const data = await DubaiActions.loadAudit(id);
    if (!data) return;
    printDubaiAuditSheet(data.audit, data.memos || [], [], []);
};

window.deleteDubaiAuditHistory = async function(id) {
    const deleted = await DubaiActions.deleteAudit(id);
    if (deleted && currentAuditId === id) onNewAuditClick();
};

export function unsubscribeDubaiAudits() {
    DubaiActions.unsubscribe();
}

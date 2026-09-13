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
    { desc: 'আলতাফ জাবেদ', amount: 55100 }
];

const getVal = id => safeRound(parseAmount(document.getElementById(id)?.value || 0));
const getTxt = (id, def = '') => document.getElementById(id)?.value?.trim() || def;
const setInp = (id, val = '') => { const el = document.getElementById(id); if (el) el.value = val; };

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
    const bindClick = (id, fn) => { const el = document.getElementById(id); if (el) el.onclick = fn; };
    ['btn-dubai-save', 'btn-dubai-save-bottom'].forEach(id => bindClick(id, onSaveAuditClick));
    ['btn-dubai-print', 'btn-dubai-print-bottom'].forEach(id => bindClick(id, onPrintAuditClick));
    ['btn-dubai-new', 'btn-dubai-new-bottom'].forEach(id => bindClick(id, onNewAuditClick));
    ['btn-dubai-roll-forward', 'btn-dubai-roll-forward-bottom'].forEach(id => bindClick(id, onRollForwardClick));

    bindClick('btn-add-waterfall-holding', () => {
        dynamicHoldings.push({ desc: 'নতুন বিবরণ', amount: 0 });
        renderDynamicHoldings();
        updateLiveWaterfall();
    });

    const dateInp = document.getElementById('dubai-week-date');
    if (dateInp) {
        dateInp.addEventListener('change', () => {
            const val = dateInp.value;
            if (!val) return;
            const existing = auditHistory.find(a => a.weekEndDate === val);
            if (existing && existing.id !== currentAuditId) {
                showToast(`${val} তারিখের সংরক্ষিত অডিট পাওয়া গেছে, লোড হচ্ছে...`, 'info');
                window.loadDubaiAuditHistory(existing.id);
            }
        });
    }
}

export function updateLiveWaterfall() {
    const cumSent = getVal('input-cum-sent');
    const cumPur = getVal('input-cum-purchase');
    const cumExp = getVal('input-cum-expense');
    const runSent = getVal('input-running-sent');
    const runPur = getVal('input-running-purchase');
    const runExp = getVal('input-running-expense');
    const mAd = getVal('val-market-ad');
    const cHand = getVal('val-cash-in-hand');

    const hasNewEntries = (cumSent > 0 || runSent > 0 || cumPur > 0 || runPur > 0 || cumExp > 0 || runExp > 0 || mAd > 0 || cHand > 0);

    const sub1 = safeRound(cumSent - cumPur);
    const sub2 = safeRound(sub1 - cumExp);
    const sub3 = safeRound(sub2 - mAd - cHand);

    let holdingsTotal = 0;
    dynamicHoldings.forEach(h => { holdingsTotal = safeRound(holdingsTotal + safeRound(parseAmount(h.amount))); });
    const finalVariance = safeRound(sub3 - holdingsTotal);

    const setTxt = (id, val) => { 
        const el = document.getElementById(id); 
        if (el) el.textContent = val !== 0 ? formatAmountWithComma(val) : '0'; 
    };

    const badgeEl = document.getElementById('final-variance-badge');
    const statusDescEl = document.getElementById('desc-final-status');
    const valFinalEl = document.getElementById('val-final-variance');

    if (!hasNewEntries) {
        setTxt('subtotal-1', 0);
        setTxt('subtotal-2', 0);
        setTxt('subtotal-3', 0);
        setTxt('val-final-variance', 0);
        if (badgeEl) {
            badgeEl.className = 'px-2.5 py-0.5 rounded-full text-xs font-bold bg-slate-800 text-slate-400 border border-slate-700';
            badgeEl.textContent = 'হিসাবের অপেক্ষায়';
        }
        if (statusDescEl && !statusDescEl.dataset.custom) statusDescEl.value = '(হিসাবের অপেক্ষায়)';
        if (valFinalEl) valFinalEl.className = 'text-slate-400 font-bold';
    } else {
        setTxt('subtotal-1', sub1);
        setTxt('subtotal-2', sub2);
        setTxt('subtotal-3', sub3);
        setTxt('val-final-variance', finalVariance);

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
    }

    const dateVal = getTxt('dubai-week-date');
    const lblDate = document.getElementById('label-table-date');
    if (lblDate && dateVal) lblDate.textContent = `তারিখ: ${dateVal} (বৃহস্পতিবার)`;
}

const AUDIT_FIELD_MAP = {
    sent: ['dubai-prev-rem-input', 'input-cum-sent', 'input-running-sent'],
    purchase: ['dubai-prev-pur-input', 'input-cum-purchase', 'input-running-purchase'],
    expense: ['dubai-prev-exp-input', 'input-cum-expense', 'input-running-expense']
};

window.handleDubaiWaterfallChange = function() {
    updateLiveWaterfall();
};

window.handleCumChange = function(type) {
    const [pId, cId, rId] = AUDIT_FIELD_MAP[type] || [];
    if (pId && cId && rId) {
        const diff = Math.abs(safeRound(getVal(cId) - getVal(pId)));
        const runInp = document.getElementById(rId);
        if (runInp) runInp.value = diff > 0 ? formatAmountWithComma(diff) : '';
    }
    updateLiveWaterfall();
};

window.handleRunningChange = function(type) {
    const [pId, cId, rId] = AUDIT_FIELD_MAP[type] || [];
    if (pId && cId && rId) {
        const cumInp = document.getElementById(cId);
        if (cumInp) cumInp.value = formatAmountWithComma(safeRound(getVal(pId) + getVal(rId)));
    }
    updateLiveWaterfall();
};

window.handlePrevBaselineChange = function(type) {
    window.handleCumChange(type);
};

window.toggleUnlockPrevBaseline = function(type) {
    const map = { sent: 'dubai-prev-rem-input', purchase: 'dubai-prev-pur-input', expense: 'dubai-prev-exp-input' };
    const el = document.getElementById(map[type]);
    if (el) {
        el.readOnly = !el.readOnly;
        if (!el.readOnly) {
            el.classList.remove('cursor-default');
            el.classList.add('bg-slate-900', 'border-sky-500');
            el.focus();
            showToast('পূর্বের ব্যালেন্স সম্পাদনের জন্য প্রস্তুত', 'info');
        } else {
            el.classList.add('cursor-default');
            el.classList.remove('bg-slate-900', 'border-sky-500');
            showToast('পূর্বের ব্যালেন্স লক করা হয়েছে', 'info');
        }
    }
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
        if (badgeEl) {
            badgeEl.className = 'px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-400 text-[10px] font-bold whitespace-nowrap';
            badgeEl.textContent = `${count}টি মেমো`;
        }
        if (descEl) descEl.value = `মেমো নং: (${startVal}-${endVal}) = ${count}টি`;

        const modalStart = document.getElementById('modal-memo-start');
        const modalEnd = document.getElementById('modal-memo-end');
        if (modalStart) modalStart.value = startVal;
        if (modalEnd) modalEnd.value = endVal;
    } else if (!isNaN(startVal) && (!endInp?.value || isNaN(endVal))) {
        if (badgeEl) {
            badgeEl.className = 'px-1.5 py-0.5 rounded bg-sky-500/20 text-sky-400 text-[10px] font-bold whitespace-nowrap';
            badgeEl.textContent = `শুরু: ${startVal}`;
        }
        if (descEl) descEl.value = `মেমো নং: ${startVal} থেকে...`;
    } else if (!isNaN(startVal) && !isNaN(endVal) && endVal < startVal) {
        if (badgeEl) {
            badgeEl.className = 'px-1.5 py-0.5 rounded bg-red-500/20 text-red-400 text-[10px] font-bold whitespace-nowrap';
            badgeEl.textContent = `ভুল রেঞ্জ`;
        }
        if (descEl) descEl.value = `মেমো নং: ভুল ক্রম`;
    } else {
        if (badgeEl) {
            badgeEl.className = 'px-1.5 py-0.5 rounded bg-slate-800 text-slate-400 text-[10px] font-bold whitespace-nowrap';
            badgeEl.textContent = `০টি মেমো`;
        }
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
            <div class="grid grid-cols-12 border-b border-slate-800 bg-slate-900/40 hover:bg-slate-800/30 transition-colors items-center">
                <div class="col-span-6 p-2.5 border-r border-slate-800 flex items-center justify-between gap-2">
                    <input type="text" value="${h.desc || ''}" placeholder="বিবরণ (যেমন: আলতাফ + মেছ)" oninput="window.handleDubaiHoldingDescChange(${idx}, this.value)" class="bg-transparent border-b border-dashed border-slate-700 text-purple-300 text-xs font-bold focus:border-purple-400 outline-none flex-grow">
                    <div class="flex items-center gap-1.5 shrink-0">
                        <span class="text-slate-500 text-[10px] whitespace-nowrap"><i class="fa-solid fa-minus text-purple-400 mr-0.5"></i> বিয়োগ</span>
                        <button type="button" onclick="window.removeDubaiHoldingRow(${idx})" class="w-5 h-5 rounded flex items-center justify-center text-slate-500 hover:text-red-400 hover:bg-red-500/10 cursor-pointer" title="মুছে ফেলুন">
                            <i class="fa-solid fa-xmark text-[10px]"></i>
                        </button>
                    </div>
                </div>
                <div class="col-span-3 p-2.5 border-r border-slate-800 flex items-center justify-end gap-1.5 pr-2">
                    <span class="text-[10px] text-slate-500 font-bold">AED:</span>
                    <input type="text" value="${amt > 0 ? formatAmountWithComma(amt) : ''}" placeholder="০.০০" oninput="window.handleNumberInput(this); window.handleDubaiHoldingAmtChange(${idx}, this.value)" class="w-full max-w-[135px] bg-slate-950 border border-slate-700 rounded px-2 py-1 text-xs text-purple-300 font-mono text-right font-bold focus:border-purple-500 outline-none">
                </div>
                <div class="col-span-3 p-2.5 text-slate-400 text-xs text-right pr-3">
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
    currentAuditId = null; // Prepare for new week's audit

    const prevRem = latest.cumulativeRemittance || 0;
    const prevPur = latest.cumulativePurchaseTotal || 0;
    const prevExp = latest.cumulativeExpenseTotal || 0;

    // Set locked previous baseline on the left
    setInp('dubai-prev-rem-input', formatAmountWithComma(prevRem));
    setInp('dubai-prev-pur-input', formatAmountWithComma(prevPur));
    setInp('dubai-prev-exp-input', formatAmountWithComma(prevExp));

    ['dubai-prev-rem-input', 'dubai-prev-pur-input', 'dubai-prev-exp-input'].forEach(id => {
        const el = document.getElementById(id);
        if (el) el.readOnly = true;
    });

    // Keep ALL new week entry fields completely EMPTY!
    ['input-cum-sent', 'input-cum-purchase', 'input-cum-expense',
     'input-running-sent', 'input-running-purchase', 'input-running-expense',
     'val-market-ad', 'val-cash-in-hand'].forEach(id => setInp(id, ''));

    // Auto-advance date by 7 days to next Thursday
    if (latest.weekEndDate) {
        try {
            const parts = String(latest.weekEndDate).split('-');
            if (parts.length === 3) {
                const d = new Date(parseInt(parts[0], 10), parseInt(parts[1], 10) - 1, parseInt(parts[2], 10));
                d.setDate(d.getDate() + 7);
                const yr = d.getFullYear();
                const mo = String(d.getMonth() + 1).padStart(2, '0');
                const da = String(d.getDate()).padStart(2, '0');
                const nextDateStr = `${yr}-${mo}-${da}`;
                const dateInp = document.getElementById('dubai-week-date');
                if (dateInp) dateInp.value = nextDateStr;
            }
        } catch (e) {
            console.error('Date advance error:', e);
        }
    }

    // Auto-set next memo start number (e.g. 112 -> 113) and keep end EMPTY
    if (latest.memoRangeEnd) {
        const nextStart = parseInt(latest.memoRangeEnd, 10) + 1;
        if (!isNaN(nextStart)) {
            const startInp = document.getElementById('memo-range-start');
            if (startInp) startInp.value = nextStart;
            const endInp = document.getElementById('memo-range-end');
            if (endInp) endInp.value = '';
            window.handleMemoRangeChange();
        }
    }

    dynamicHoldings = [{ desc: 'আলতাফ জাবেদ', amount: 0 }];
    renderDynamicHoldings();
    DubaiMemoModal.setMemos([]);

    updateLiveWaterfall();
    showToast(`পূর্ববর্তী অডিট (${latest.weekEndDate || ''}) থেকে ব্যালেন্স লক করা হয়েছে। নতুন সপ্তাহের ডাটা ফাঁকা রাখা হয়েছে।`, 'success');
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
    const prevRem = getVal('dubai-prev-rem-input');
    const prevPur = getVal('dubai-prev-pur-input');
    const prevExp = getVal('dubai-prev-exp-input');

    let cumSent = getVal('input-cum-sent');
    let cumPur = getVal('input-cum-purchase');
    let cumExp = getVal('input-cum-expense');
    let runningSent = getVal('input-running-sent');
    let runningPur = getVal('input-running-purchase');
    let runningExp = getVal('input-running-expense');

    if (cumSent === 0 && runningSent > 0) cumSent = safeRound(prevRem + runningSent);
    else if (cumSent === 0 && runningSent === 0) cumSent = prevRem;

    if (cumPur === 0 && runningPur > 0) cumPur = safeRound(prevPur + runningPur);
    else if (cumPur === 0 && runningPur === 0) cumPur = prevPur;

    if (cumExp === 0 && runningExp > 0) cumExp = safeRound(prevExp + runningExp);
    else if (cumExp === 0 && runningExp === 0) cumExp = prevExp;

    if (runningSent === 0 && cumSent > prevRem) runningSent = safeRound(cumSent - prevRem);
    if (runningPur === 0 && cumPur > prevPur) runningPur = safeRound(cumPur - prevPur);
    if (runningExp === 0 && cumExp > prevExp) runningExp = safeRound(cumExp - prevExp);

    const marketAd = getVal('val-market-ad');
    const cashInHand = getVal('val-cash-in-hand');

    let holdingsTotal = 0;
    dynamicHoldings.forEach(h => { holdingsTotal = safeRound(holdingsTotal + safeRound(parseAmount(h.amount))); });

    const totalPhysical = safeRound(marketAd + cashInHand + holdingsTotal);
    const theoreticalCash = safeRound(cumSent - cumPur - cumExp);
    const finalVariance = safeRound(theoreticalCash - totalPhysical);

    const mStart = getTxt('memo-range-start');
    const mEnd = getTxt('memo-range-end');
    const mStartNum = parseInt(mStart, 10);
    const mEndNum = parseInt(mEnd, 10);
    const memoCount = (!isNaN(mStartNum) && !isNaN(mEndNum) && mEndNum >= mStartNum) 
        ? (mEndNum - mStartNum + 1) 
        : (!isNaN(mStartNum) ? 1 : 0);

    return {
        containerNo: getTxt('dubai-container-no', 'CT-2026-DXB-01'),
        weekEndDate: getTxt('dubai-week-date', getTodayLocalDateString()),
        note: getTxt('dubai-audit-note'),
        descriptions: {
            sent: getTxt('desc-sent', 'বৃহস্পতিবার পর্যন্ত টাকা পাঠানো'),
            purchase: getTxt('desc-purchase', 'সর্বমোট মাল ক্রয়'),
            memos: getTxt('desc-memos'),
            expense: getTxt('desc-expense', 'সর্বমোট খরচ'),
            ad: getTxt('desc-ad', 'মার্কেট এডভান্স (AD)'),
            cash: getTxt('desc-cash', 'নগদ ক্যাশ আছে (Cash in Hand)'),
            status: getTxt('desc-final-status', '(ক্যাশ বাড়তি)')
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
    setInp('dubai-week-date', getTodayLocalDateString());
    ['dubai-audit-note', 'input-cum-sent', 'input-cum-purchase', 'input-cum-expense',
     'input-running-sent', 'input-running-purchase', 'input-running-expense',
     'val-market-ad', 'val-cash-in-hand', 'memo-range-start', 'memo-range-end', 'desc-memos'].forEach(id => setInp(id, ''));
    ['dubai-prev-rem-input', 'dubai-prev-pur-input', 'dubai-prev-exp-input'].forEach(id => {
        setInp(id, '0');
        const el = document.getElementById(id);
        if (el) el.readOnly = false;
    });
    const badgeEl = document.getElementById('memo-auto-count-badge');
    if (badgeEl) badgeEl.textContent = '০টি মেমো';
    dynamicHoldings = [{ desc: 'আলতাফ জাবেদ', amount: 0 }];
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
    setInp('dubai-container-no', audit.containerNo || 'CT-2026-DXB-01');
    setInp('dubai-week-date', audit.weekEndDate || '');
    setInp('dubai-audit-note', audit.note || '');

    if (audit.descriptions) {
        ['sent', 'purchase', 'memos', 'expense', 'ad', 'cash', 'status'].forEach(k => {
            if (audit.descriptions[k]) setInp(`desc-${k}`, audit.descriptions[k]);
        });
    }

    setInp('memo-range-start', audit.memoRangeStart || '');
    setInp('memo-range-end', audit.memoRangeEnd || '');
    window.handleMemoRangeChange();

    setInp('dubai-prev-rem-input', formatAmountWithComma(audit.prevRemittance || 0));
    setInp('dubai-prev-pur-input', formatAmountWithComma(audit.prevPurchaseTotal || 0));
    setInp('dubai-prev-exp-input', formatAmountWithComma(audit.prevExpenseTotal || 0));

    setInp('input-cum-sent', formatAmountWithComma(audit.cumulativeRemittance || 0));
    setInp('input-cum-purchase', formatAmountWithComma(audit.cumulativePurchaseTotal || 0));
    setInp('input-cum-expense', formatAmountWithComma(audit.cumulativeExpenseTotal || 0));

    setInp('input-running-sent', formatAmountWithComma(audit.weeklyRemittanceTotal || 0));
    setInp('input-running-purchase', formatAmountWithComma(audit.weeklyPurchaseTotal || 0));
    setInp('input-running-expense', formatAmountWithComma(audit.weeklyExpenseTotal || 0));

    setInp('val-market-ad', formatAmountWithComma(audit.marketAdvance || 0));
    setInp('val-cash-in-hand', formatAmountWithComma(audit.cashInHand || 0));

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

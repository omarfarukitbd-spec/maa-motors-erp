/**
 * Dubai Procurement & Weekly Audit - Main UI Controller
 * Manages the authentic 2-column waterfall table with editable descriptions and separated assets.
 */

import Swal from 'sweetalert2';
import { DubaiActions } from './dubai-audit-actions.js';
import { printDubaiAuditSheet } from './dubai-print.js';
import { getDubaiAuditMainTemplate, getDynamicHoldingRowHtml } from './dubai-audit-template.js';
import { DubaiMemoModal } from './dubai-memo-modal.js';
import { renderDubaiHistoryTable } from './dubai-audit-history.js';
import { 
    formatAmountWithComma, parseAmount, safeRound, getTodayLocalDateString, 
    toDBDate, showToast, promptSecurityPin 
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
    [['save', onSaveAuditClick], ['print', onPrintAuditClick], ['new', onNewAuditClick], ['roll-forward', onRollForwardClick]].forEach(([k, fn]) => {
        bindClick(`btn-dubai-${k}`, fn);
        bindClick(`btn-dubai-${k}-bottom`, fn);
    });

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
    const prevRem = getVal('dubai-prev-rem-input'), prevPur = getVal('dubai-prev-pur-input'), prevExp = getVal('dubai-prev-exp-input');
    const cumSent = getVal('input-cum-sent'), cumPur = getVal('input-cum-purchase'), cumExp = getVal('input-cum-expense');
    const runSent = getVal('input-running-sent'), runPur = getVal('input-running-purchase'), runExp = getVal('input-running-expense');
    const mAd = getVal('val-market-ad'), cHand = getVal('val-cash-in-hand');

    const hasNewEntries = (cumSent > 0 || runSent > 0 || cumPur > 0 || runPur > 0 || cumExp > 0 || runExp > 0 || mAd > 0 || cHand > 0);

    const effSent = cumSent > 0 ? cumSent : (runSent > 0 ? safeRound(prevRem + runSent) : prevRem);
    const effPur = cumPur > 0 ? cumPur : (runPur > 0 ? safeRound(prevPur + runPur) : prevPur);
    const effExp = cumExp > 0 ? cumExp : (runExp > 0 ? safeRound(prevExp + runExp) : prevExp);

    const sub1 = safeRound(effSent - effPur);
    const sub2 = safeRound(sub1 - effExp);
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
        ['subtotal-1', 'subtotal-2', 'subtotal-3', 'val-final-variance'].forEach(id => setTxt(id, 0));
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

        const isSurplus = finalVariance >= 0;
        if (badgeEl) {
            badgeEl.className = `px-2.5 py-0.5 rounded-full text-xs font-black ${isSurplus ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40' : 'bg-red-500/20 text-red-400 border border-red-500/40'}`;
            badgeEl.textContent = isSurplus ? 'ক্যাশ বাড়তি' : 'ক্যাশ ঘাটতি';
        }
        if (statusDescEl && !statusDescEl.dataset.custom) statusDescEl.value = isSurplus ? '(ক্যাশ বাড়তি)' : '(ক্যাশ ঘাটতি)';
        if (valFinalEl) valFinalEl.className = `${isSurplus ? 'text-emerald-400' : 'text-red-400'} font-bold`;
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
        const cVal = getVal(cId), pVal = getVal(pId), runInp = document.getElementById(rId);
        if (runInp) {
            const hasText = Boolean(document.getElementById(cId)?.value.trim());
            runInp.value = (cVal >= pVal && hasText) 
                ? (safeRound(cVal - pVal) > 0 ? formatAmountWithComma(safeRound(cVal - pVal)) : '') 
                : '';
        }
    }
    updateLiveWaterfall();
};

window.handleRunningChange = function(type) {
    const [pId, cId, rId] = AUDIT_FIELD_MAP[type] || [];
    if (pId && cId && rId) {
        const rVal = getVal(rId), pVal = getVal(pId), cumInp = document.getElementById(cId);
        if (cumInp) {
            const hasText = Boolean(document.getElementById(rId)?.value.trim());
            cumInp.value = (rVal > 0 && hasText) ? formatAmountWithComma(safeRound(pVal + rVal)) : '';
        }
    }
    updateLiveWaterfall();
};

window.handlePrevBaselineChange = function(type) {
    window.handleCumChange(type);
};

window.toggleUnlockPrevBaseline = async function(type) {
    const map = { sent: 'dubai-prev-rem-input', purchase: 'dubai-prev-pur-input', expense: 'dubai-prev-exp-input' };
    const el = document.getElementById(map[type]);
    if (el) {
        if (el.readOnly) {
            const pinOk = await promptSecurityPin('পূর্ববর্তী অডিট ব্যালেন্স আনলক');
            if (!pinOk) return;
        }
        el.readOnly = !el.readOnly;
        el.classList.toggle('cursor-default', el.readOnly);
        el.classList.toggle('bg-slate-900', !el.readOnly);
        el.classList.toggle('border-sky-500', !el.readOnly);
        if (!el.readOnly) el.focus();
        showToast(el.readOnly ? 'পূর্বের ব্যালেন্স লক করা হয়েছে' : 'পূর্বের ব্যালেন্স সম্পাদনের জন্য প্রস্তুত', 'info');
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
        setInp('modal-memo-start', startVal);
        setInp('modal-memo-end', endVal);
    } else if (!isNaN(startVal) && (!endInp?.value || isNaN(endVal))) {
        if (badgeEl) {
            badgeEl.className = 'px-1.5 py-0.5 rounded bg-sky-500/20 text-sky-400 text-[10px] font-bold whitespace-nowrap';
            badgeEl.textContent = `শুরু: ${startVal}`;
        }
        if (descEl) descEl.value = `মেমো নং: ${startVal} থেকে...`;
    } else if (!isNaN(startVal) && !isNaN(endVal) && endVal < startVal) {
        if (badgeEl) {
            badgeEl.className = 'px-1.5 py-0.5 rounded bg-red-500/20 text-red-400 text-[10px] font-bold whitespace-nowrap';
            badgeEl.textContent = 'ভুল রেঞ্জ';
        }
        if (descEl) descEl.value = 'মেমো নং: ভুল ক্রম';
    } else if (badgeEl) {
        badgeEl.className = 'px-1.5 py-0.5 rounded bg-slate-800 text-slate-400 text-[10px] font-bold whitespace-nowrap';
        badgeEl.textContent = '০টি মেমো';
    }
};

window.openDubaiMemoDetailsModal = function() {
    const startVal = parseInt(document.getElementById('memo-range-start')?.value, 10);
    const endVal = parseInt(document.getElementById('memo-range-end')?.value, 10);
    if (!isNaN(startVal) && !isNaN(endVal) && endVal >= startVal) {
        setInp('modal-memo-start', startVal);
        setInp('modal-memo-end', endVal);
        DubaiMemoModal.generateMemos();
    }
    DubaiMemoModal.toggle(true);
};

window.addDubaiHoldingPreset = function(presetName) {
    dynamicHoldings.push({ desc: presetName, amount: 0 });
    renderDynamicHoldings();
    updateLiveWaterfall();
};

function clearNewWeekFields() {
    ['input-cum-sent', 'input-cum-purchase', 'input-cum-expense',
     'input-running-sent', 'input-running-purchase', 'input-running-expense',
     'val-market-ad', 'val-cash-in-hand'].forEach(id => setInp(id, ''));
}

function renderDynamicHoldings() {
    const cont = document.getElementById('dubai-dynamic-holdings-container');
    if (cont) cont.innerHTML = dynamicHoldings.map((h, idx) => getDynamicHoldingRowHtml(h, idx)).join('');
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

window.removeDubaiHoldingRow = async function(idx) {
    if (dynamicHoldings[idx]) {
        const amt = safeRound(parseAmount(dynamicHoldings[idx].amount));
        if (amt > 0) {
            const pinOk = await promptSecurityPin(`${dynamicHoldings[idx].desc || 'হস্তান্তর'} আমানত মুছে ফেলা`);
            if (!pinOk) return;
        }
        dynamicHoldings.splice(idx, 1);
        renderDynamicHoldings();
        updateLiveWaterfall();
    }
};

// --- Actions & History Handlers ---
async function onRollForwardClick(silent = false) {
    const latest = await DubaiActions.rollForward();
    if (!latest) return;
    currentAuditId = null;

    const prevRem = latest.cumulativeRemittance || 0;
    const prevPur = latest.cumulativePurchaseTotal || 0;
    const prevExp = latest.cumulativeExpenseTotal || 0;

    [['dubai-prev-rem-input', prevRem], ['dubai-prev-pur-input', prevPur], ['dubai-prev-exp-input', prevExp]].forEach(([id, v]) => {
        setInp(id, formatAmountWithComma(v));
        const el = document.getElementById(id);
        if (el) el.readOnly = true;
    });

    clearNewWeekFields();

    if (latest.weekEndDate) {
        try {
            const parts = String(toDBDate(latest.weekEndDate)).split('-');
            if (parts.length === 3) {
                const d = new Date(parseInt(parts[0], 10), parseInt(parts[1], 10) - 1, parseInt(parts[2], 10) + 7);
                setInp('dubai-week-date', `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`);
            }
        } catch (e) {
            console.error('Date advance error:', e);
        }
    }

    if (latest.memoRangeEnd) {
        const nextStart = parseInt(latest.memoRangeEnd, 10) + 1;
        if (!isNaN(nextStart)) {
            setInp('memo-range-start', nextStart);
            setInp('memo-range-end', '');
            window.handleMemoRangeChange();
        }
    }

    dynamicHoldings = [{ desc: 'আলতাফ জাবেদ', amount: 0 }];
    renderDynamicHoldings();
    DubaiMemoModal.setMemos([]);
    updateLiveWaterfall();
    if (!silent) showToast(`পূর্ববর্তী অডিট (${latest.weekEndDate || ''}) থেকে ব্যালেন্স লক করা হয়েছে। নতুন সপ্তাহের ডাটা ফাঁকা রাখা হয়েছে।`, 'success');
}

async function onSaveAuditClick() {
    if (currentAuditId) {
        const pinOk = await promptSecurityPin('সংরক্ষিত অডিট সংশোধন ও পুনরায় সংরক্ষণ');
        if (!pinOk) return;
    }
    const payload = buildCurrentAuditObject();
    if (currentAuditId) payload.id = currentAuditId;
    const memos = DubaiMemoModal.getMemos();
    const savedId = await DubaiActions.saveAudit(payload, memos);
    if (savedId) currentAuditId = savedId;
}

function onPrintAuditClick() {
    printDubaiAuditSheet(buildCurrentAuditObject(), DubaiMemoModal.getMemos(), [], []);
}

function buildCurrentAuditObject() {
    const prevRem = getVal('dubai-prev-rem-input'), prevPur = getVal('dubai-prev-pur-input'), prevExp = getVal('dubai-prev-exp-input');
    let cumSent = getVal('input-cum-sent'), cumPur = getVal('input-cum-purchase'), cumExp = getVal('input-cum-expense');
    let runningSent = getVal('input-running-sent'), runningPur = getVal('input-running-purchase'), runningExp = getVal('input-running-expense');

    const syncVal = (cum, run, prev) => {
        let c = cum, r = run;
        if (c === 0 && r > 0) c = safeRound(prev + r);
        else if (c === 0 && r === 0) c = prev;
        if (r === 0 && c > prev) r = safeRound(c - prev);
        return [c, r];
    };
    [cumSent, runningSent] = syncVal(cumSent, runningSent, prevRem);
    [cumPur, runningPur] = syncVal(cumPur, runningPur, prevPur);
    [cumExp, runningExp] = syncVal(cumExp, runningExp, prevExp);

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
        weekEndDate: toDBDate(getTxt('dubai-week-date', getTodayLocalDateString())),
        note: getTxt('dubai-audit-note'),
        descriptions: {
            sent: getTxt('desc-sent', 'বৃহস্পতিবার পর্যন্ত টাকা পাঠানো'), purchase: getTxt('desc-purchase', 'সর্বমোট মাল ক্রয়'),
            memos: getTxt('desc-memos'), expense: getTxt('desc-expense', 'সর্বমোট খরচ'),
            ad: getTxt('desc-ad', 'মার্কেট এডভান্স (AD)'), cash: getTxt('desc-cash', 'নগদ ক্যাশ আছে (Cash in Hand)'),
            status: getTxt('desc-final-status', '(ক্যাশ বাড়তি)')
        },
        memoRangeStart: mStart, memoRangeEnd: mEnd, memoCount,
        prevRemittance: prevRem, weeklyRemittanceTotal: runningSent, cumulativeRemittance: cumSent,
        prevPurchaseTotal: prevPur, weeklyPurchaseTotal: runningPur, cumulativePurchaseTotal: cumPur,
        prevExpenseTotal: prevExp, weeklyExpenseTotal: runningExp, cumulativeExpenseTotal: cumExp,
        marketAdvance: marketAd, cashInHand: cashInHand, personalHoldings: [...dynamicHoldings],
        totalPhysicalAssets: totalPhysical, calculatedCashBalance: theoreticalCash,
        varianceAmount: finalVariance, status: 'CLOSED'
    };
}

async function onNewAuditClick() {
    const hasUnsaved = (getVal('input-cum-sent') > 0 || getVal('input-running-sent') > 0 || getVal('input-cum-purchase') > 0 || getVal('input-running-purchase') > 0);
    if (hasUnsaved && !currentAuditId) {
        const res = await Swal.fire({
            title: 'নতুন ব্ল্যাঙ্ক অডিট?',
            text: 'চলতি অডিটের ডাটা মুছে নতুন ফাঁকা ফরম তৈরি হবে। আপনি কি নিশ্চিত?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'হ্যাঁ, নতুন ফরম',
            cancelButtonText: 'না, বাতিল'
        });
        if (!res.isConfirmed) return;
    }
    currentAuditId = null;
    setInp('dubai-week-date', getTodayLocalDateString());
    ['dubai-audit-note', 'memo-range-start', 'memo-range-end', 'desc-memos'].forEach(id => setInp(id, ''));
    clearNewWeekFields();
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

let hasAutoLoadedDb = false;
function listenToHistory() {
    DubaiActions.listenAudits(audits => {
        auditHistory = audits;
        renderDubaiHistoryTable('dubai-history-tbody', auditHistory);
        if (!hasAutoLoadedDb && !currentAuditId && audits.length > 0) {
            hasAutoLoadedDb = true;
            onRollForwardClick(true);
        }
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

    [['dubai-prev-rem-input', audit.prevRemittance], ['dubai-prev-pur-input', audit.prevPurchaseTotal], ['dubai-prev-exp-input', audit.prevExpenseTotal],
     ['input-cum-sent', audit.cumulativeRemittance], ['input-cum-purchase', audit.cumulativePurchaseTotal], ['input-cum-expense', audit.cumulativeExpenseTotal],
     ['input-running-sent', audit.weeklyRemittanceTotal], ['input-running-purchase', audit.weeklyPurchaseTotal], ['input-running-expense', audit.weeklyExpenseTotal],
     ['val-market-ad', audit.marketAdvance], ['val-cash-in-hand', audit.cashInHand]
    ].forEach(([id, val]) => setInp(id, formatAmountWithComma(val || 0)));

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

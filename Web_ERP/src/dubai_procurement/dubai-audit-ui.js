/**
 * Dubai Procurement & Weekly Audit - Main UI Controller
 * Manages the authentic 2-column waterfall table with editable descriptions and separated assets.
 */
// ALLOW_LARGE_FILE (Critical Dubai Waterfall Accounting UI)

import Swal from 'sweetalert2';
import { DubaiActions } from './dubai-audit-actions.js';
import { printDubaiAuditSheet } from './dubai-print.js';
import { getDubaiAuditMainTemplate, getDynamicHoldingRowHtml } from './dubai-audit-template.js';
import { DubaiMemoModal } from './dubai-memo-modal.js';
import { renderDubaiHistoryTable } from './dubai-audit-history.js';
import { 
    formatAmountWithComma, parseAmount, safeRound, getTodayLocalDateString, 
    toDBDate, showToast, promptSecurityPin, getDayOfWeekBangla, formatAppDate 
} from '../utils.js';

let currentAuditId = null;
let auditHistory = [];
let dynamicHoldings = [
    { desc: 'আলতাফ জাবেদ', amount: 0, op: '-' }
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
        const handleDateChange = () => {
            const val = dateInp.value;
            if (!val) return;
            const dbVal = toDBDate(val);
            const existing = auditHistory.find(a => toDBDate(a.weekEndDate) === dbVal);
            if (existing && existing.id !== currentAuditId) {
                showToast(`${formatAppDate(dbVal)} তারিখের সংরক্ষিত অডিট পাওয়া গেছে, লোড হচ্ছে...`, 'info');
                window.loadDubaiAuditHistory(existing.id);
            } else if (!existing && !currentAuditId) {
                applyBaselineForDate(dbVal);
            }
            updateLiveWaterfall();
        };

        dateInp.addEventListener('change', handleDateChange);
        dateInp.addEventListener('blur', handleDateChange);
        setTimeout(() => {
            if (dateInp._flatpickr && Array.isArray(dateInp._flatpickr.config?.onChange)) {
                dateInp._flatpickr.config.onChange.push(handleDateChange);
            }
        }, 150);
    }
}

function applyBaselineForDate(targetDbDate) {
    if (!targetDbDate) return;
    const prevAudit = auditHistory.find(a => toDBDate(a.weekEndDate) < targetDbDate);
    if (prevAudit) {
        const prevRem = prevAudit.cumulativeRemittance || 0;
        const prevPur = prevAudit.cumulativePurchaseTotal || 0;
        const prevExp = prevAudit.cumulativeExpenseTotal || 0;

        setInp('dubai-prev-rem-input', formatAmountWithComma(prevRem));
        setInp('dubai-prev-pur-input', formatAmountWithComma(prevPur));
        setInp('dubai-prev-exp-input', formatAmountWithComma(prevExp));

        ['dubai-prev-rem-input', 'dubai-prev-pur-input', 'dubai-prev-exp-input'].forEach(id => {
            const el = document.getElementById(id);
            if (el) el.readOnly = true;
        });

        if (prevAudit.memoRangeEnd) {
            const nextStart = parseInt(prevAudit.memoRangeEnd, 10) + 1;
            if (!isNaN(nextStart)) {
                setInp('memo-range-start', nextStart);
                setInp('memo-range-end', '');
                window.handleMemoRangeChange?.();
            }
        }
    } else {
        ['dubai-prev-rem-input', 'dubai-prev-pur-input', 'dubai-prev-exp-input'].forEach(id => {
            setInp(id, '0');
            const el = document.getElementById(id);
            if (el) el.readOnly = false;
        });
    }
    updateLiveWaterfall();
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
    const sub2_5 = safeRound(sub2 - mAd);
    const sub3 = safeRound(sub2_5 - cHand);

    let runningBal = sub3;
    dynamicHoldings.forEach((h, idx) => {
        const amt = safeRound(parseAmount(h.amount));
        const isPlus = h.op === '+';
        runningBal = safeRound(isPlus ? runningBal + amt : runningBal - amt);
    });
    const finalVariance = runningBal;

    const setTxt = (id, val) => { 
        const el = document.getElementById(id); 
        if (el) el.textContent = val !== 0 ? formatAmountWithComma(val) : '0'; 
    };

    const badgeEl = document.getElementById('final-variance-badge');
    const statusDescEl = document.getElementById('desc-final-status');
    const valFinalEl = document.getElementById('val-final-variance');

    if (!hasNewEntries) {
        ['subtotal-1', 'subtotal-2', 'subtotal-ad', 'subtotal-3', 'val-final-variance'].forEach(id => setTxt(id, 0));
        dynamicHoldings.forEach((_, idx) => setTxt(`dubai-holding-subtotal-${idx}`, 0));
        if (badgeEl) {
            badgeEl.className = 'px-2.5 py-0.5 rounded-full text-xs font-bold bg-slate-800 text-slate-400 border border-slate-700';
            badgeEl.textContent = 'হিসাবের অপেক্ষায়';
        }
        if (statusDescEl && !statusDescEl.dataset.custom) statusDescEl.value = '(হিসাবের অপেক্ষায়)';
        if (valFinalEl) valFinalEl.className = 'text-slate-400 font-bold';
    } else {
        setTxt('subtotal-1', sub1);
        setTxt('subtotal-2', sub2);
        setTxt('subtotal-ad', sub2_5);
        setTxt('subtotal-3', sub3);

        let stepBal = sub3;
        dynamicHoldings.forEach((h, idx) => {
            const amt = safeRound(parseAmount(h.amount));
            const isPlus = h.op === '+';
            stepBal = safeRound(isPlus ? stepBal + amt : stepBal - amt);
            setTxt(`dubai-holding-subtotal-${idx}`, stepBal);
            const subEl = document.getElementById(`dubai-holding-subtotal-${idx}`);
            if (subEl) {
                subEl.className = `font-black ${stepBal >= 0 ? 'text-sky-400' : 'text-red-400'}`;
            }
            const lblEl = document.getElementById(`dubai-holding-equal-label-${idx}`);
            if (lblEl) {
                lblEl.textContent = `অবশিষ্ট ব্যালেন্স (${escapeHTML(h.desc || h.name || 'হিসাব')} এর পর):`;
            }
        });

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
    if (lblDate && dateVal) {
        const dbDate = toDBDate(dateVal);
        const dayBangla = getDayOfWeekBangla(dbDate) || 'বৃহস্পতিবার';
        lblDate.textContent = `তারিখ: ${formatAppDate(dbDate)} (${dayBangla})`;
    }
}

window.handleAssetDescChange = function(type, val) {
    const text = String(val || '').trim();
    if (type === 'ad') {
        const isCash = text.includes('নগদ') || text.toLowerCase().includes('cash');
        const noteEl = document.getElementById('note-ad');
        if (noteEl) noteEl.textContent = isCash ? 'ক্যাশ বাক্সে নগদ দেরহাম' : 'সাপ্লায়ারদের অগ্রিম';
        const lblEl = document.getElementById('lbl-subtotal-ad');
        if (lblEl) lblEl.textContent = isCash ? 'অবশিষ্ট ক্যাশ স্থিতি (নগদ বাদে):' : 'অবশিষ্ট ক্যাশ স্থিতি (এডভান্স বাদে):';
    } else if (type === 'cash') {
        const isAd = text.includes('এডভান্স') || text.toLowerCase().includes('ad') || text.includes('অগ্রিম');
        const noteEl = document.getElementById('note-cash');
        if (noteEl) noteEl.textContent = isAd ? 'সাপ্লায়ারদের অগ্রিম' : 'ক্যাশ বাক্সে নগদ দেরহাম';
    }
};

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
    dynamicHoldings.push({ desc: presetName, amount: 0, op: '-' });
    renderDynamicHoldings();
    updateLiveWaterfall();
};

window.toggleDubaiHoldingOp = function(idx) {
    if (dynamicHoldings[idx]) {
        dynamicHoldings[idx].op = dynamicHoldings[idx].op === '+' ? '-' : '+';
        renderDynamicHoldings();
        updateLiveWaterfall();
    }
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
    if (dynamicHoldings[idx]) {
        dynamicHoldings[idx].desc = String(val).trim();
        const lblEl = document.getElementById(`dubai-holding-equal-label-${idx}`);
        if (lblEl) lblEl.textContent = `অবশিষ্ট ব্যালেন্স (${dynamicHoldings[idx].desc || 'হিসাব'} এর পর):`;
    }
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
            const pinOk = await promptSecurityPin(`${dynamicHoldings[idx].desc || 'হিসাব'} এন্ট্রি মুছে ফেলা`);
            if (!pinOk) return;
        }
        dynamicHoldings.splice(idx, 1);
        renderDynamicHoldings();
        updateLiveWaterfall();
    }
};

// --- Actions & History Handlers ---
async function onRollForwardClick(silent = false) {
    const curDateVal = getTxt('dubai-week-date');
    const targetDbDate = curDateVal ? toDBDate(curDateVal) : null;

    let latest = null;
    if (targetDbDate && auditHistory.length > 0) {
        latest = auditHistory.find(a => toDBDate(a.weekEndDate) < targetDbDate);
    }
    if (!latest) {
        latest = await DubaiActions.rollForward(targetDbDate);
    }
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

    if (!curDateVal && latest.weekEndDate) {
        try {
            const parts = String(toDBDate(latest.weekEndDate)).split('-');
            if (parts.length === 3) {
                const d = new Date(parseInt(parts[0], 10), parseInt(parts[1], 10) - 1, parseInt(parts[2], 10) + 7);
                const nextDateStr = formatAppDate(`${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`);
                setInp('dubai-week-date', nextDateStr);
                const fp = document.getElementById('dubai-week-date')?._flatpickr;
                if (fp) fp.setDate(nextDateStr, false);
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
            window.handleMemoRangeChange?.();
        }
    }

    dynamicHoldings = [{ desc: 'আলতাফ জাবেদ', amount: 0, op: '-' }];
    renderDynamicHoldings();
    DubaiMemoModal.setMemos([]);
    updateLiveWaterfall();
    if (!silent) showToast(`পূর্ববর্তী অডিট (${formatAppDate(latest.weekEndDate)}) থেকে ব্যালেন্স লক করা হয়েছে। নতুন সপ্তাহের ডাটা ফাঁকা রাখা হয়েছে।`, 'success');
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

    let holdingsEffect = 0;
    dynamicHoldings.forEach(h => {
        const amt = safeRound(parseAmount(h.amount));
        if (h.op === '+') {
            holdingsEffect = safeRound(holdingsEffect + amt);
        } else {
            holdingsEffect = safeRound(holdingsEffect - amt);
        }
    });

    const theoreticalCash = safeRound(cumSent - cumPur - cumExp);
    const sub3 = safeRound(theoreticalCash - marketAd - cashInHand);
    const finalVariance = safeRound(sub3 + holdingsEffect);
    const totalPhysical = safeRound(theoreticalCash - finalVariance);

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
        marketAdvance: marketAd, cashInHand: cashInHand, personalHoldings: dynamicHoldings.map(h => ({
            desc: h.desc || h.name || '',
            name: h.name || h.desc || '',
            amount: safeRound(parseAmount(h.amount)),
            op: h.op === '+' ? '+' : '-'
        })),
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
    const todayStr = getTodayLocalDateString();
    setInp('dubai-week-date', todayStr);
    const fp = document.getElementById('dubai-week-date')?._flatpickr;
    if (fp) fp.setDate(todayStr, false);

    ['dubai-audit-note', 'memo-range-start', 'memo-range-end', 'desc-memos'].forEach(id => setInp(id, ''));
    clearNewWeekFields();
    applyBaselineForDate(toDBDate(todayStr));

    const badgeEl = document.getElementById('memo-auto-count-badge');
    if (badgeEl) badgeEl.textContent = '০টি মেমো';
    dynamicHoldings = [{ desc: 'আলতাফ জাবেদ', amount: 0, op: '-' }];
    DubaiMemoModal.setMemos([]);
    renderDynamicHoldings();
    updateLiveWaterfall();
    showToast('নতুন সপ্তাহের অডিট প্রস্তুত (পূর্ববর্তী ব্যালেন্স রোল-ফরওয়ার্ড সহ)', 'info');
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
    const formattedDate = formatAppDate(audit.weekEndDate);
    setInp('dubai-week-date', formattedDate);
    const fp = document.getElementById('dubai-week-date')?._flatpickr;
    if (fp) fp.setDate(formattedDate, false);
    setInp('dubai-audit-note', audit.note || '');

    if (audit.descriptions) {
        ['sent', 'purchase', 'memos', 'expense', 'ad', 'cash', 'status'].forEach(k => {
            if (audit.descriptions[k]) setInp(`desc-${k}`, audit.descriptions[k]);
        });
        if (window.handleAssetDescChange) {
            window.handleAssetDescChange('ad', audit.descriptions.ad || '');
            window.handleAssetDescChange('cash', audit.descriptions.cash || '');
        }
    }

    setInp('memo-range-start', audit.memoRangeStart || '');
    setInp('memo-range-end', audit.memoRangeEnd || '');
    window.handleMemoRangeChange?.();

    [['dubai-prev-rem-input', audit.prevRemittance], ['dubai-prev-pur-input', audit.prevPurchaseTotal], ['dubai-prev-exp-input', audit.prevExpenseTotal],
     ['input-cum-sent', audit.cumulativeRemittance], ['input-cum-purchase', audit.cumulativePurchaseTotal], ['input-cum-expense', audit.cumulativeExpenseTotal],
     ['input-running-sent', audit.weeklyRemittanceTotal], ['input-running-purchase', audit.weeklyPurchaseTotal], ['input-running-expense', audit.weeklyExpenseTotal],
     ['val-market-ad', audit.marketAdvance], ['val-cash-in-hand', audit.cashInHand]
    ].forEach(([id, val]) => setInp(id, formatAmountWithComma(val || 0)));

    dynamicHoldings = Array.isArray(audit.personalHoldings) && audit.personalHoldings.length > 0 
        ? audit.personalHoldings.map(h => ({
            desc: h.desc || h.name || '',
            name: h.name || h.desc || '',
            amount: safeRound(parseAmount(h.amount)),
            op: h.op === '+' ? '+' : '-'
        }))
        : [{ desc: 'আলতাফ / জাবেদ', amount: 0, op: '-' }];
    renderDynamicHoldings();

    DubaiMemoModal.setMemos(Array.isArray(memos) ? memos : []);

    updateLiveWaterfall();
    showToast(`অডিট লোড করা হয়েছে (${formattedDate})`, 'info');
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

window.focusNextDubaiTableInput = function(currentId) {
    const seq = ['input-running-sent', 'input-running-purchase', 'input-running-expense', 'val-market-ad', 'val-cash-in-hand'];
    const idx = seq.indexOf(currentId);
    if (idx !== -1 && idx < seq.length - 1) {
        const nextEl = document.getElementById(seq[idx + 1]);
        if (nextEl) { nextEl.focus(); if (nextEl.select) nextEl.select(); return; }
    }
    if (currentId === 'val-cash-in-hand') {
        const firstHold = document.getElementById('dubai-holding-amt-0') || document.querySelector('#dubai-dynamic-holdings-container input[type="text"]:not([readonly])');
        if (firstHold) { firstHold.focus(); if (firstHold.select) firstHold.select(); return; }
        document.getElementById('btn-dubai-save')?.focus();
    }
};

window.focusNextHoldingInput = function(idx) {
    const nextHold = document.getElementById(`dubai-holding-amt-${idx + 1}`);
    if (nextHold) {
        nextHold.focus();
        if (nextHold.select) nextHold.select();
    } else {
        document.getElementById('btn-dubai-save')?.focus();
    }
};

export function unsubscribeDubaiAudits() {
    DubaiActions.unsubscribe();
}

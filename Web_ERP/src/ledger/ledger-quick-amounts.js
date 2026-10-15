import { formatAmountWithComma, safeRound, showToast, resetLiveWords } from '../utils.js';
import { getCustomerCache } from '../customer/index.js';

let _activeLedgerTarget = 'paid'; // Default target: 'paid' (Credit / জমা)

export function getActiveLedgerTarget() {
    return _activeLedgerTarget;
}

export function setActiveLedgerTarget(target) {
    if (target !== 'bill' && target !== 'paid') return;
    _activeLedgerTarget = target;
    updateTargetBadgeUI();
}

export function updateTargetBadgeUI() {
    const badge = document.getElementById('ledger-quick-target-badge');
    const container = document.getElementById('ledger-quick-amounts-bar');
    if (!badge) return;

    if (_activeLedgerTarget === 'bill') {
        badge.innerHTML = '<i class="fa-solid fa-crosshairs text-red-400 mr-1.5 text-xs"></i><span>লক্ষ্য:</span><span class="font-bold text-red-400 ml-1">বিল (Debit)</span><i class="fa-solid fa-arrow-down text-[10px] text-red-400 ml-1.5"></i>';
        badge.className = 'px-2.5 py-1 rounded-lg text-[11px] font-bold border border-red-500/40 bg-red-950/40 text-red-300 transition-all cursor-pointer select-none flex items-center active:scale-95 shadow-sm';
        badge.title = 'ক্লিক করে জমা (Credit) এ পরিবর্তন করুন';

        if (container) {
            container.querySelectorAll('.quick-amt-chip').forEach(el => {
                el.classList.remove('hover:border-emerald-500/60', 'hover:bg-emerald-500/10', 'hover:text-emerald-300');
                el.classList.add('hover:border-red-500/60', 'hover:bg-red-500/10', 'hover:text-red-300');
            });
        }
    } else {
        badge.innerHTML = '<i class="fa-solid fa-crosshairs text-emerald-400 mr-1.5 text-xs"></i><span>লক্ষ্য:</span><span class="font-bold text-emerald-400 ml-1">জমা (Credit)</span><i class="fa-solid fa-arrow-up text-[10px] text-emerald-400 ml-1.5"></i>';
        badge.className = 'px-2.5 py-1 rounded-lg text-[11px] font-bold border border-emerald-500/40 bg-emerald-950/40 text-emerald-300 transition-all cursor-pointer select-none flex items-center active:scale-95 shadow-sm';
        badge.title = 'ক্লিক করে বিল (Debit) এ পরিবর্তন করুন';

        if (container) {
            container.querySelectorAll('.quick-amt-chip').forEach(el => {
                el.classList.remove('hover:border-red-500/60', 'hover:bg-red-500/10', 'hover:text-red-300');
                el.classList.add('hover:border-emerald-500/60', 'hover:bg-emerald-500/10', 'hover:text-emerald-300');
            });
        }
    }
}

export function renderLedgerQuickAmountBarHtml() {
    return `
    <div data-perm="addLedgerEntry" id="ledger-quick-amounts-bar" class="hide-for-boss -mt-2 p-2 rounded-xl bg-slate-950/70 border border-slate-800/80 flex flex-wrap items-center justify-between gap-2 text-xs shadow-inner">
        <div class="flex items-center gap-1.5 flex-wrap">
            <button type="button" id="ledger-quick-target-badge" onclick="window.toggleLedgerQuickTarget && window.toggleLedgerQuickTarget()" title="ক্লিক করে লক্ষ্য (বিল ⇄ জমা) পরিবর্তন করুন" class="px-2.5 py-1 rounded-lg text-[11px] font-bold border border-emerald-500/40 bg-emerald-950/40 text-emerald-300 transition-all cursor-pointer select-none flex items-center active:scale-95 shadow-sm">
                <i class="fa-solid fa-crosshairs text-emerald-400 mr-1.5 text-xs"></i><span>লক্ষ্য:</span><span class="font-bold text-emerald-400 ml-1">জমা (Credit)</span><i class="fa-solid fa-arrow-up text-[10px] text-emerald-400 ml-1.5"></i>
            </button>
            <div class="h-4 w-px bg-slate-800 mx-1 hidden sm:block"></div>
            <div class="flex items-center gap-1 flex-wrap">
                <button type="button" onclick="window.applyLedgerQuickAmount && window.applyLedgerQuickAmount(50000)" class="quick-amt-chip px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-700/80 text-slate-200 font-mono font-bold text-[11px] hover:border-emerald-500/60 hover:bg-emerald-500/10 hover:text-emerald-300 transition-all cursor-pointer active:scale-95 shadow-xs">৫০,০০০</button>
                <button type="button" onclick="window.applyLedgerQuickAmount && window.applyLedgerQuickAmount(100000)" class="quick-amt-chip px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-700/80 text-slate-200 font-mono font-bold text-[11px] hover:border-emerald-500/60 hover:bg-emerald-500/10 hover:text-emerald-300 transition-all cursor-pointer active:scale-95 shadow-xs">১,০০,০০০</button>
                <button type="button" onclick="window.applyLedgerQuickAmount && window.applyLedgerQuickAmount(150000)" class="quick-amt-chip px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-700/80 text-slate-200 font-mono font-bold text-[11px] hover:border-emerald-500/60 hover:bg-emerald-500/10 hover:text-emerald-300 transition-all cursor-pointer active:scale-95 shadow-xs">১,৫০,০০০</button>
                <button type="button" onclick="window.applyLedgerQuickAmount && window.applyLedgerQuickAmount(200000)" class="quick-amt-chip px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-700/80 text-slate-200 font-mono font-bold text-[11px] hover:border-emerald-500/60 hover:bg-emerald-500/10 hover:text-emerald-300 transition-all cursor-pointer active:scale-95 shadow-xs">২,০০,০০০</button>
                <button type="button" onclick="window.applyLedgerQuickAmount && window.applyLedgerQuickAmount(300000)" class="quick-amt-chip px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-700/80 text-slate-200 font-mono font-bold text-[11px] hover:border-emerald-500/60 hover:bg-emerald-500/10 hover:text-emerald-300 transition-all cursor-pointer active:scale-95 shadow-xs">৩,০০,০০০</button>
                <button type="button" onclick="window.applyLedgerQuickAmount && window.applyLedgerQuickAmount(400000)" class="quick-amt-chip px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-700/80 text-slate-200 font-mono font-bold text-[11px] hover:border-emerald-500/60 hover:bg-emerald-500/10 hover:text-emerald-300 transition-all cursor-pointer active:scale-95 shadow-xs">৪,০০,০০০</button>
                <button type="button" onclick="window.applyLedgerQuickAmount && window.applyLedgerQuickAmount(500000)" class="quick-amt-chip px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-700/80 text-slate-200 font-mono font-bold text-[11px] hover:border-emerald-500/60 hover:bg-emerald-500/10 hover:text-emerald-300 transition-all cursor-pointer active:scale-95 shadow-xs">৫,০০,০০০</button>
            </div>
        </div>
        <div class="flex items-center gap-1.5 ml-auto">
            <button type="button" onclick="window.applyLedgerQuickFullDue && window.applyLedgerQuickFullDue()" class="px-2.5 py-1 rounded-lg bg-purple-500/10 hover:bg-purple-500/20 border border-purple-500/30 text-purple-300 font-bold text-[11px] transition-all flex items-center gap-1.5 cursor-pointer active:scale-95 shadow-xs" title="কাস্টমারের সম্পূর্ণ বকেয়া জমায় বসান">
                <i class="fa-solid fa-check-double text-[10px] text-purple-400"></i><span>মোট বকেয়া</span>
            </button>
            <button type="button" onclick="window.clearLedgerAmounts && window.clearLedgerAmounts()" class="w-7 h-7 rounded-lg bg-slate-800/80 hover:bg-red-500/20 border border-slate-700 hover:border-red-500/40 text-slate-400 hover:text-red-400 transition-all flex items-center justify-center cursor-pointer active:scale-95 shadow-xs" title="টাকার ঘর ক্লিয়ার করুন">
                <i class="fa-solid fa-trash-can text-xs"></i>
            </button>
        </div>
    </div>`;
}

export function initLedgerQuickAmounts() {
    const billInput = document.getElementById('ledger-bill');
    const paidInput = document.getElementById('ledger-paid');

    if (billInput && !billInput._quickTargetBound) {
        billInput._quickTargetBound = true;
        billInput.addEventListener('focus', () => {
            setActiveLedgerTarget('bill');
        });
        billInput.addEventListener('click', () => {
            setActiveLedgerTarget('bill');
        });
    }

    if (paidInput && !paidInput._quickTargetBound) {
        paidInput._quickTargetBound = true;
        paidInput.addEventListener('focus', () => {
            setActiveLedgerTarget('paid');
        });
        paidInput.addEventListener('click', () => {
            setActiveLedgerTarget('paid');
        });
    }

    window.toggleLedgerQuickTarget = () => {
        const next = _activeLedgerTarget === 'bill' ? 'paid' : 'bill';
        setActiveLedgerTarget(next);
        const el = next === 'bill' ? billInput : paidInput;
        el?.focus();
    };

    window.applyLedgerQuickAmount = (amount) => {
        const target = _activeLedgerTarget;
        const currentBillInput = document.getElementById('ledger-bill');
        const currentPaidInput = document.getElementById('ledger-paid');
        const targetEl = target === 'bill' ? currentBillInput : currentPaidInput;
        const oppositeEl = target === 'bill' ? currentPaidInput : currentBillInput;

        if (!targetEl) return;

        targetEl.value = formatAmountWithComma(amount);
        if (oppositeEl) oppositeEl.value = '';

        if (window.updateLedgerLiveText) window.updateLedgerLiveText();
        if (window.toggleReceivedSection) window.toggleReceivedSection();

        if (target === 'bill') {
            if (window.updateLiveWords) window.updateLiveWords(targetEl, 'ledger-bill-words');
            if (window.resetLiveWords) window.resetLiveWords('ledger-paid-words');
        } else {
            if (window.updateLiveWords) window.updateLiveWords(targetEl, 'ledger-paid-words');
            if (window.resetLiveWords) window.resetLiveWords('ledger-bill-words');
        }

        targetEl.focus();
    };

    window.applyLedgerQuickFullDue = () => {
        const sel = document.getElementById('ledger-customer-select');
        const custId = sel?.value;
        const cust = custId ? (getCustomerCache() || []).find(c => c.id === custId) : null;
        let due = cust ? Number(cust.totalDue || 0) : (parseFloat(sel?.options[sel.selectedIndex]?.dataset?.due) || 0);

        const editRef = window._ledgerEditingRef || {};
        if (editRef.id && editRef.oldCid === custId) {
            const oldBill = Number(editRef.oldBill) || 0;
            const oldPaid = Number(editRef.oldPaid) || 0;
            due = safeRound(due - (oldBill - oldPaid));
        }

        if (due <= 0) {
            showToast('এই কাস্টমারের কোনো বকেয়া নেই', 'info');
            return;
        }

        setActiveLedgerTarget('paid');
        const currentBillInput = document.getElementById('ledger-bill');
        const currentPaidInput = document.getElementById('ledger-paid');

        if (currentPaidInput) {
            currentPaidInput.value = formatAmountWithComma(due);
            if (currentBillInput) currentBillInput.value = '';

            if (window.updateLedgerLiveText) window.updateLedgerLiveText();
            if (window.toggleReceivedSection) window.toggleReceivedSection();
            if (window.updateLiveWords) window.updateLiveWords(currentPaidInput, 'ledger-paid-words');
            if (window.resetLiveWords) window.resetLiveWords('ledger-bill-words');

            currentPaidInput.focus();
        }
    };

    window.clearLedgerAmounts = () => {
        const currentBillInput = document.getElementById('ledger-bill');
        const currentPaidInput = document.getElementById('ledger-paid');

        if (currentBillInput) currentBillInput.value = '';
        if (currentPaidInput) currentPaidInput.value = '';

        if (window.resetLiveWords) {
            window.resetLiveWords('ledger-bill-words');
            window.resetLiveWords('ledger-paid-words');
        }

        if (window.updateLedgerLiveText) window.updateLedgerLiveText();
        if (window.toggleReceivedSection) window.toggleReceivedSection();

        const activeEl = _activeLedgerTarget === 'bill' ? currentBillInput : currentPaidInput;
        activeEl?.focus();
    };

    // Initial badge UI synchronization
    updateTargetBadgeUI();
}

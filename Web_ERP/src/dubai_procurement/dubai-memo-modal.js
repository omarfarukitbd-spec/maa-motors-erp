/**
 * Dubai Procurement - Smart Memo Range Modal Manager
 * Handles rapid batch generation and entry of overseas purchase memos.
 */

import { formatAmountWithComma, parseAmount, safeRound, showToast } from '../utils.js';

let modalMemos = [];
let applyCallback = null;

export const DubaiMemoModal = {
    init(onApply) {
        applyCallback = onApply;
        const btnGen = document.getElementById('btn-modal-gen-memo');
        if (btnGen) btnGen.onclick = () => this.generateMemos();

        const btnApply = document.getElementById('btn-modal-apply-memo');
        if (btnApply) btnApply.onclick = () => this.applyToWaterfall();
    },

    toggle(show) {
        const modal = document.getElementById('dubai-memo-popup');
        if (!modal) return;
        if (show) {
            modal.classList.remove('hidden');
            this.renderList();
        } else {
            modal.classList.add('hidden');
        }
    },

    setMemos(memos) {
        modalMemos = Array.isArray(memos) ? [...memos] : [];
        this.renderList();
    },

    getMemos() {
        return [...modalMemos];
    },

    generateMemos() {
        const startVal = parseInt(document.getElementById('modal-memo-start')?.value, 10);
        const endVal = parseInt(document.getElementById('modal-memo-end')?.value, 10);
        if (isNaN(startVal) || isNaN(endVal) || endVal < startVal) {
            showToast('সঠিক শুরু ও শেষ মেমো নম্বর দিন', 'error');
            return;
        }
        const count = endVal - startVal + 1;
        if (count > 200) {
            showToast('একবারে সর্বোচ্চ ২০০টি মেমো জেনারেট করা যাবে', 'error');
            return;
        }

        const newMemos = [];
        for (let i = startVal; i <= endVal; i++) {
            newMemos.push({ memoNo: String(i), amount: 0 });
        }
        modalMemos = newMemos;
        this.renderList();
    },

    renderList() {
        const cont = document.getElementById('modal-memo-list-container');
        const totEl = document.getElementById('modal-memo-total-amt');
        if (!cont) return;

        if (modalMemos.length === 0) {
            cont.innerHTML = `<div class="text-xs text-slate-500 text-center py-6">শুরুর ও শেষ মেমো নম্বর দিয়ে রো জেনারেট করুন।</div>`;
            if (totEl) totEl.textContent = '0 AED';
            return;
        }

        let html = '';
        let total = 0;
        modalMemos.forEach((m, idx) => {
            const amt = safeRound(parseAmount(m.amount));
            total = safeRound(total + amt);
            html += `
                <div class="flex items-center gap-2 p-1.5 bg-slate-950 border border-slate-800 rounded-lg">
                    <span class="text-xs font-bold text-slate-400 w-20 shrink-0">মেমো #${m.memoNo}:</span>
                    <input type="text" value="${amt > 0 ? formatAmountWithComma(amt) : ''}" placeholder="০.০০" oninput="window.handleNumberInput(this); window.handleModalMemoAmtChange(${idx}, this.value)" onkeydown="if(event.key==='Enter'){event.preventDefault(); window.focusNextMemoInp(${idx});}" class="modal-memo-inp flex-grow bg-slate-900 border border-slate-700 rounded px-2.5 py-1 text-xs text-amber-400 font-mono font-bold text-right outline-none">
                </div>
            `;
        });
        cont.innerHTML = html;
        if (totEl) totEl.textContent = `${formatAmountWithComma(total)} AED`;
    },

    handleAmtChange(idx, val) {
        if (modalMemos[idx]) {
            modalMemos[idx].amount = safeRound(parseAmount(val));
            let total = 0;
            modalMemos.forEach(m => { total = safeRound(total + safeRound(parseAmount(m.amount))); });
            const totEl = document.getElementById('modal-memo-total-amt');
            if (totEl) totEl.textContent = `${formatAmountWithComma(total)} AED`;
        }
    },

    applyToWaterfall() {
        let total = 0;
        modalMemos.forEach(m => { total = safeRound(total + safeRound(parseAmount(m.amount))); });

        const count = modalMemos.length;
        const memoRangeText = count > 0 
            ? `মেমো নং: (${modalMemos[0].memoNo}-${modalMemos[count - 1].memoNo}) = ${count}টি` 
            : '';

        if (typeof applyCallback === 'function') {
            applyCallback(total, memoRangeText, modalMemos);
        }

        this.toggle(false);
        showToast(`মেমোর মোট ক্রয় ${formatAmountWithComma(total)} AED যুক্ত হয়েছে`, 'success');
    }
};

window.toggleDubaiMemoModal = (show) => DubaiMemoModal.toggle(show);
window.handleModalMemoAmtChange = (idx, val) => DubaiMemoModal.handleAmtChange(idx, val);
window.focusNextMemoInp = (idx) => {
    const inputs = document.querySelectorAll('.modal-memo-inp');
    if (inputs && inputs[idx + 1]) {
        inputs[idx + 1].focus();
        inputs[idx + 1].select();
    }
};

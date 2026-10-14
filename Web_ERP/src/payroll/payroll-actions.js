import { PayrollDAO } from './payroll-dao.js';
import { calculatePayrollSummary, calculateNetSalary, convertAedToBdt, formatTaka } from './payroll-calc.js';
import { promptSecurityPin, showToast, escapeHTML, formatAmountWithComma, parseAmount, safeRound } from '../utils.js';

let _activePayrollState = null;
let _onStateChangeCallback = null;

export function setPayrollStateChangeListener(callback) {
    _onStateChangeCallback = callback;
}

export function getActivePayrollState() {
    return _activePayrollState;
}

export function setActivePayrollState(state) {
    _activePayrollState = state;
}

/**
 * Handle in-place amount change with reactive subtotal & grand total refresh
 */
export function handleAmountInput(inputElem, sectionId, itemId) {
    const rawVal = parseAmount(inputElem.value);
    if (!_activePayrollState) return;

    const sec = _activePayrollState.sections.find(s => s.id === sectionId);
    if (!sec) return;
    const itm = sec.items.find(i => i.id === itemId);
    if (!itm) return;

    itm.amount = rawVal;

    // Synchronize baseSalary if employee salary item
    if (itm.type === 'salary') {
        const bon = Number(itm.bonus) || 0;
        const ded = Number(itm.deduction) || 0;
        itm.baseSalary = safeRound(rawVal - bon + ded);
    }

    // Synchronize foreignAmount if AED item
    if (itm.foreignCurrency === 'AED' && _activePayrollState.aedRate) {
        itm.foreignAmount = safeRound(rawVal / _activePayrollState.aedRate);
        itm.details = `${itm.foreignAmount} AED (@ ${_activePayrollState.aedRate} টাকা)`;
    }

    triggerReactiveCalculations();
}

/**
 * Handle details or name text change
 */
export function handleTextInput(sectionId, itemId, field, value) {
    if (!_activePayrollState) return;
    const sec = _activePayrollState.sections.find(s => s.id === sectionId);
    if (!sec) return;
    const itm = sec.items.find(i => i.id === itemId);
    if (!itm) return;

    itm[field] = value;
}

/**
 * Toggle paid vs pending status
 */
export function toggleItemStatus(sectionId, itemId) {
    if (!_activePayrollState) return;
    const sec = _activePayrollState.sections.find(s => s.id === sectionId);
    if (!sec) return;
    const itm = sec.items.find(i => i.id === itemId);
    if (!itm) return;

    itm.status = itm.status === 'paid' ? 'pending' : 'paid';
    if (_onStateChangeCallback) _onStateChangeCallback(_activePayrollState, true);
    triggerReactiveCalculations();
}

/**
 * Mark all items in entire sheet as paid or pending
 * @param {'paid' | 'pending'} status
 */
export function setAllItemsStatus(status) {
    if (!_activePayrollState) return;
    _activePayrollState.sections.forEach(sec => {
        (sec.items || []).forEach(itm => {
            itm.status = status;
        });
    });
    if (_onStateChangeCallback) _onStateChangeCallback(_activePayrollState, true);
    triggerReactiveCalculations();
    showToast(status === 'paid' ? 'সকল আইটেম "পরিশোধিত" করা হয়েছে' : 'সকল আইটেম "বকেয়া" করা হয়েছে', 'success');
}

/**
 * Mark all items in a specific section as paid or pending
 * @param {string} sectionId
 * @param {'paid' | 'pending'} status
 */
export function setSectionItemsStatus(sectionId, status) {
    if (!_activePayrollState) return;
    const sec = _activePayrollState.sections.find(s => s.id === sectionId);
    if (!sec) return;
    (sec.items || []).forEach(itm => {
        itm.status = status;
    });
    if (_onStateChangeCallback) _onStateChangeCallback(_activePayrollState, true);
    triggerReactiveCalculations();
    showToast(`শাখার সকল আইটেম "${status === 'paid' ? 'পরিশোধিত' : 'বকেয়া'}" করা হয়েছে`, 'success');
}

/**
 * Reset current sheet to canonical default template
 */
export async function resetToDefaultTemplate() {
    if (!_activePayrollState) return;
    const confirmResult = await Swal.fire({
        title: 'ডিফল্ট টেমপ্লেটে রিসেট করবেন?',
        text: 'বর্তমান শিটটি অনুমোদিত ৩৫টি আইটেমের প্রাথমিক বকেয়া অবস্থায় ফিরে যাবে।',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'হ্যাঁ, রিসেট করুন',
        cancelButtonText: 'বাতিল',
        customClass: {
            popup: '!bg-slate-950 !text-white !rounded-3xl border border-slate-800 shadow-2xl font-bn',
            confirmButton: 'm3-btn-primary !bg-red-600 hover:!bg-red-500 !px-5 !py-2 rounded-xl font-bold',
            cancelButton: 'bg-slate-800 hover:bg-slate-700 text-slate-300 px-5 py-2 rounded-xl font-bold ml-2'
        }
    });

    if (!confirmResult.isConfirmed) return;

    const fresh = PayrollDAO.getDefaultTemplate(_activePayrollState.monthYear);
    _activePayrollState = fresh;
    if (_onStateChangeCallback) _onStateChangeCallback(_activePayrollState, true);
    triggerReactiveCalculations();
    showToast('ডিফল্ট টেমপ্লেটে রিসেট সফল হয়েছে', 'success');
}

/**
 * Update payment account
 */
export function updatePaymentAccount(sectionId, itemId, account) {
    if (!_activePayrollState) return;
    const sec = _activePayrollState.sections.find(s => s.id === sectionId);
    if (!sec) return;
    const itm = sec.items.find(i => i.id === itemId);
    if (!itm) return;

    itm.paymentAccount = account;
}

/**
 * Add a new customizable row to a specific section
 */
export function addNewRow(sectionId) {
    if (!_activePayrollState) return;
    const sec = _activePayrollState.sections.find(s => s.id === sectionId);
    if (!sec) return;

    const newIdx = (sec.items || []).length + 1;
    const newItem = {
        id: `custom_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
        sl: `+`,
        name: 'নতুন এন্ট্রি',
        details: 'বিবরণ লিখুন',
        amount: 0,
        type: sectionId.includes('dubai') || sectionId.includes('godown') || sectionId.includes('shop') ? 'salary' : 'expense',
        status: 'pending',
        paymentMethod: 'Cash',
        paymentAccount: 'শোরুম ক্যাশ'
    };

    sec.items.push(newItem);
    if (_onStateChangeCallback) _onStateChangeCallback(_activePayrollState, true);
    showToast('নতুন সারি যুক্ত করা হয়েছে', 'success');
}

/**
 * Delete a row from a section
 */
export async function deleteRow(sectionId, itemId) {
    if (!_activePayrollState) return;
    const sec = _activePayrollState.sections.find(s => s.id === sectionId);
    if (!sec) return;

    const itm = sec.items.find(i => i.id === itemId);
    const itemName = itm ? itm.name : 'এই আইটেমটি';

    const confirmResult = await Swal.fire({
        title: 'সারি মুছে ফেলতে চান?',
        text: `"${itemName}" তালিকা থেকে মুছে ফেলা হবে।`,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'হ্যাঁ, মুছুন',
        cancelButtonText: 'বাতিল',
        customClass: {
            popup: '!bg-slate-950 !text-white !rounded-3xl border border-slate-800 shadow-2xl font-bn',
            confirmButton: 'm3-btn-primary !bg-red-600 hover:!bg-red-500 !px-5 !py-2 rounded-xl font-bold',
            cancelButton: 'bg-slate-800 hover:bg-slate-700 text-slate-300 px-5 py-2 rounded-xl font-bold ml-2'
        }
    });

    if (!confirmResult.isConfirmed) return;

    sec.items = sec.items.filter(i => i.id !== itemId);
    if (_onStateChangeCallback) _onStateChangeCallback(_activePayrollState, true);
    showToast('সারি মুছে ফেলা হয়েছে', 'success');
}

/**
 * Open Salary Breakdown Modal for Base + Bonus - Deduction
 */
export async function openSalaryBreakdownModal(sectionId, itemId) {
    if (!_activePayrollState) return;
    const sec = _activePayrollState.sections.find(s => s.id === sectionId);
    if (!sec) return;
    const itm = sec.items.find(i => i.id === itemId);
    if (!itm) return;

    const baseVal = itm.baseSalary !== undefined ? itm.baseSalary : itm.amount;
    const bonVal = itm.bonus || 0;
    const dedVal = itm.deduction || 0;

    const modalHtml = `
        <div class="text-left font-bn space-y-3.5 p-1">
            <div class="p-3 rounded-2xl bg-slate-900 border border-slate-800 text-xs">
                <div class="text-slate-400">কর্মীর নাম:</div>
                <div class="text-sm font-black text-cyan-400">${escapeHTML(itm.name)}</div>
            </div>

            <div>
                <label class="m3-label text-slate-300">মূল নির্ধারিত বেতন (Basic Salary ৳)</label>
                <input type="text" id="bd-base" value="${formatAmountWithComma(baseVal)}" oninput="window.handleNumberInput(this); window.recalcBreakdownNet();" class="m3-field text-base font-black text-white">
            </div>

            <div class="grid grid-cols-2 gap-2.5">
                <div>
                    <label class="m3-label text-emerald-400">+ বোনাস / ভাতা (৳)</label>
                    <input type="text" id="bd-bonus" value="${formatAmountWithComma(bonVal)}" oninput="window.handleNumberInput(this); window.recalcBreakdownNet();" class="m3-field text-sm font-black text-emerald-400">
                </div>
                <div>
                    <label class="m3-label text-red-400">- অগ্রিম / ঋণ কর্তন (৳)</label>
                    <input type="text" id="bd-deduction" value="${formatAmountWithComma(dedVal)}" oninput="window.handleNumberInput(this); window.recalcBreakdownNet();" class="m3-field text-sm font-black text-red-400">
                </div>
            </div>

            <div class="p-3.5 rounded-2xl bg-gradient-to-r from-emerald-950/40 to-slate-900 border border-emerald-500/30 flex justify-between items-center">
                <div>
                    <div class="text-[10px] text-slate-400 font-bold uppercase">নিট প্রদেয় বেতন (Net Payable)</div>
                    <div id="bd-net-display" class="text-lg font-black text-emerald-400">৳ ${formatAmountWithComma(calculateNetSalary(baseVal, bonVal, dedVal))}</div>
                </div>
                <div class="text-[10px] text-slate-400 text-right">মূল + বোনাস - কর্তন</div>
            </div>

            <div>
                <label class="m3-label text-slate-300">বিবরণ নোট (Details)</label>
                <input type="text" id="bd-details" value="${escapeHTML(itm.details || '')}" class="m3-field text-xs text-slate-200" placeholder="যেমন: ৩০,০০০ টাকা – ১০,০০০ (কর্তন)">
            </div>
        </div>
    `;

    window.recalcBreakdownNet = () => {
        const b = parseAmount(document.getElementById('bd-base')?.value);
        const bon = parseAmount(document.getElementById('bd-bonus')?.value);
        const d = parseAmount(document.getElementById('bd-deduction')?.value);
        const net = calculateNetSalary(b, bon, d);
        const disp = document.getElementById('bd-net-display');
        if (disp) disp.innerText = `৳ ${formatAmountWithComma(net)}`;
    };

    const res = await Swal.fire({
        title: '<div class="font-bn font-black text-lg text-white flex items-center justify-center gap-2"><i class="fa-solid fa-calculator text-cyan-400"></i><span>বেতন ও কর্তন সমন্বয়</span></div>',
        html: modalHtml,
        showCancelButton: true,
        confirmButtonText: 'সংরক্ষণ ও আপডেট করুন',
        cancelButtonText: 'বাতিল',
        customClass: {
            popup: '!bg-slate-950 !text-white !rounded-3xl border border-slate-800 shadow-2xl font-bn max-w-md w-full',
            confirmButton: 'm3-btn-primary !bg-emerald-600 hover:!bg-emerald-500 !px-5 !py-2 rounded-xl font-bold',
            cancelButton: 'bg-slate-800 hover:bg-slate-700 text-slate-300 px-5 py-2 rounded-xl font-bold ml-2'
        }
    });

    if (!res.isConfirmed) return;

    const b = parseAmount(document.getElementById('bd-base')?.value);
    const bon = parseAmount(document.getElementById('bd-bonus')?.value);
    const d = parseAmount(document.getElementById('bd-deduction')?.value);
    const det = document.getElementById('bd-details')?.value || '';

    itm.baseSalary = b;
    itm.bonus = bon;
    itm.deduction = d;
    itm.amount = calculateNetSalary(b, bon, d);
    itm.details = det;

    if (_onStateChangeCallback) _onStateChangeCallback(_activePayrollState, true);
    showToast('বেতন ব্রেকডাউন সফলভাবে আপডেট হয়েছে', 'success');
}

/**
 * Update Dubai exchange rate (AED to BDT)
 */
export function updateAedRate(rate) {
    if (!_activePayrollState) return;
    const r = Number(rate) || 35;
    _activePayrollState.aedRate = r;

    // Recalculate Dubai AED amounts
    const dubaiSec = _activePayrollState.sections.find(s => s.id === 'dubai');
    if (dubaiSec) {
        dubaiSec.items.forEach(itm => {
            if (itm.foreignCurrency === 'AED' && itm.foreignAmount) {
                itm.amount = convertAedToBdt(itm.foreignAmount, r);
                itm.details = `${itm.foreignAmount} AED (@ ${r} টাকা)`;
            }
        });
    }

    if (_onStateChangeCallback) _onStateChangeCallback(_activePayrollState, true);
}

/**
 * Save current active payroll to Firestore with security PIN verification
 */
export async function savePayrollToCloud() {
    if (!_activePayrollState) return;

    const pinVerified = await promptSecurityPin('মাসিক বেতন ও খরচ ক্লাউডে সংরক্ষণ');
    if (!pinVerified) return;

    try {
        const summary = calculatePayrollSummary(_activePayrollState.sections, _activePayrollState.aedRate);
        const payload = {
            ..._activePayrollState,
            grandTotal: summary.grandTotal,
            totalPaid: summary.totalPaid,
            totalPending: summary.totalPending,
            grandTotalInWords: summary.grandTotalInWords
        };

        await PayrollDAO.savePayroll(_activePayrollState.monthYear, payload);
        showToast(`মাসিক বেতন ও খরচ (${_activePayrollState.monthYear}) ক্লাউডে সফলভাবে সংরক্ষিত!`, 'success');
    } catch (e) {
        console.error('savePayrollToCloud error:', e);
        showToast('সংরক্ষণ ব্যর্থ হয়েছে!', 'error');
    }
}

/**
 * Recalculate and update HUD counters reactively without re-rendering entire table
 */
function triggerReactiveCalculations() {
    if (!_activePayrollState) return;
    const summary = calculatePayrollSummary(_activePayrollState.sections, _activePayrollState.aedRate);

    // Update section subtotal labels
    summary.sections.forEach(s => {
        const el = document.getElementById(`subtotal-${s.id}`);
        if (el) el.innerText = `৳ ${formatAmountWithComma(s.subTotal)}`;
    });

    // Update top KPI cards
    const grandEl = document.getElementById('kpi-grand-total');
    if (grandEl) grandEl.innerText = `৳ ${formatAmountWithComma(summary.grandTotal)}`;

    const paidEl = document.getElementById('kpi-total-paid');
    if (paidEl) paidEl.innerText = `৳ ${formatAmountWithComma(summary.totalPaid)}`;

    const pendingEl = document.getElementById('kpi-total-pending');
    if (pendingEl) pendingEl.innerText = `৳ ${formatAmountWithComma(summary.totalPending)}`;

    // Update bottom summary labels
    const bGrandEl = document.getElementById('bottom-kpi-grand');
    if (bGrandEl) bGrandEl.innerText = `৳ ${formatAmountWithComma(summary.grandTotal)}`;

    const bPaidEl = document.getElementById('bottom-kpi-paid');
    if (bPaidEl) bPaidEl.innerText = `৳ ${formatAmountWithComma(summary.totalPaid)}`;

    const bPendingEl = document.getElementById('bottom-kpi-pending');
    if (bPendingEl) bPendingEl.innerText = `৳ ${formatAmountWithComma(summary.totalPending)}`;

    const wordsEl = document.getElementById('payroll-words-display');
    if (wordsEl) wordsEl.innerText = summary.grandTotalInWords;
}

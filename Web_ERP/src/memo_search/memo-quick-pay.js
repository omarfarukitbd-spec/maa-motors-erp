import Swal from 'sweetalert2';
import { db, firebase } from '../firebase-config.js';
import { TransactionDAO, CustomerDAO, BankDAO } from '../dao.js';
import { parseAmount, formatAmountWithComma, numberToBanglaWords, toDBDate, safeRound, escapeHTML } from '../utils.js';
import { showToast } from '../utils/ui-helpers.js';
import { auditLog } from '../audit.js';

/**
 * Open Quick Payment Collect Modal directly for a memo
 */
export async function openMemoQuickPayModal(txnId, voucherNo, customerId, currentDue = 0) {
    let targetTxn = null;
    if (txnId && (!customerId || !voucherNo)) {
        try {
            targetTxn = await TransactionDAO.getById(txnId);
        } catch (e) {
            console.error("Error fetching txn for quick pay:", e);
        }
    }

    const targetCustId = customerId || targetTxn?.customerId;
    const targetVoucher = voucherNo || targetTxn?.voucherNo || '';
    if (!targetCustId) {
        showToast('কাস্টমার তথ্য পাওয়া যায়নি', 'error');
        return;
    }

    let customer = {};
    try {
        customer = (await CustomerDAO.getById(targetCustId)) || {};
    } catch (e) {
        console.error("Error fetching customer for quick pay:", e);
    }

    const custName = customer.name || targetTxn?.customerName || 'গ্রাহক';
    const netDue = currentDue !== undefined ? Number(currentDue) : Number(customer.totalDue || 0);

    let activeBanks = [];
    try {
        activeBanks = await BankDAO.getActiveBanks();
    } catch (e) {
        console.warn("Could not fetch banks:", e);
    }

    const defaultAmount = netDue > 0 ? netDue : '';
    const today = new Date().toISOString().split('T')[0];

    const { value: formValues } = await Swal.fire({
        title: `
            <div class="flex items-center justify-center gap-2 font-bn font-black text-lg text-white">
                <i class="fa-solid fa-hand-holding-dollar text-emerald-400"></i>
                <span>টাকা জমা নিন (মেমো #${escapeHTML(targetVoucher)})</span>
            </div>
        `,
        html: `
            <div class="text-left font-bn p-2 space-y-3 text-xs">
                <div class="p-3 bg-slate-950/60 rounded-2xl border border-slate-800 flex justify-between items-center">
                    <div>
                        <div class="text-[10px] text-slate-500 font-bold">কাস্টমার</div>
                        <div class="text-sm font-black text-white">${escapeHTML(custName)}</div>
                    </div>
                    <div class="text-right">
                        <div class="text-[10px] text-slate-500 font-bold">বর্তমান বকেয়া</div>
                        <div class="text-sm font-mono font-black text-red-400">৳ ${formatAmountWithComma(netDue)}</div>
                    </div>
                </div>

                <div>
                    <label class="block text-slate-400 font-bold mb-1">জমার পরিমাণ (টাকা):</label>
                    <input type="text" id="quick-pay-amt" value="${defaultAmount}" placeholder="0" 
                        oninput="window.handleNumberInput(this); window.updateLiveWords(this, 'quick-pay-words')"
                        class="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-base font-mono font-black text-emerald-400 outline-none focus:border-emerald-500 shadow-inner">
                    <div id="quick-pay-words" class="text-[11px] font-bold text-amber-400 mt-1 min-h-[16px]">
                        ${defaultAmount ? '<i class="fa-solid fa-coins mr-1"></i>কথায়: ' + numberToBanglaWords(defaultAmount) : ''}
                    </div>
                </div>

                <div class="grid grid-cols-2 gap-3">
                    <div>
                        <label class="block text-slate-400 font-bold mb-1">পেমেন্ট মাধ্যম:</label>
                        <select id="quick-pay-type" class="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs font-bold text-white outline-none focus:border-blue-500" onchange="document.getElementById('quick-bank-select-box').classList.toggle('hidden', this.value !== 'Bank')">
                            <option value="Cash" selected>ক্যাশ (Cash)</option>
                            <option value="Bank">ব্যাংক / মোবাইল ব্যাংকিং</option>
                        </select>
                    </div>
                    <div>
                        <label class="block text-slate-400 font-bold mb-1">তারিখ:</label>
                        <input type="text" id="quick-pay-date" value="${today}" class="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs font-bold text-white outline-none focus:border-blue-500 datepicker">
                    </div>
                </div>

                <div id="quick-bank-select-box" class="hidden">
                    <label class="block text-slate-400 font-bold mb-1">ব্যাংক অ্যাকাউন্ট:</label>
                    <select id="quick-pay-bank" class="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs font-bold text-white outline-none focus:border-blue-500">
                        <option value="">-- ব্যাংক নির্বাচন করুন --</option>
                        ${activeBanks.map(b => `<option value="${escapeHTML(b.name)}">${escapeHTML(b.name)} (${escapeHTML(b.accountNo || '')})</option>`).join('')}
                    </select>
                </div>

                <div>
                    <label class="block text-slate-400 font-bold mb-1">প্রাপ্তি সূত্র / মারফত / নোট:</label>
                    <input type="text" id="quick-pay-notes" placeholder="e.g. ক্যাশ পেমেন্ট / মেমো বাবদ" class="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white outline-none focus:border-blue-500">
                </div>
            </div>
        `,
        focusConfirm: false,
        showCancelButton: true,
        confirmButtonText: '<i class="fa-solid fa-check mr-1.5"></i> জমা সেভ করুন',
        cancelButtonText: 'বাতিল',
        customClass: {
            popup: '!bg-slate-950 !text-white !rounded-3xl border border-slate-800 shadow-2xl font-bn',
            confirmButton: 'm3-btn-primary !bg-emerald-600 hover:!bg-emerald-500 !px-6 !py-2.5 !rounded-xl font-bold',
            cancelButton: 'm3-btn-tonal !bg-slate-800 !text-slate-300 !px-4 !py-2.5 !rounded-xl font-bold'
        },
        preConfirm: () => {
            const amtStr = document.getElementById('quick-pay-amt')?.value || '0';
            const amt = parseAmount(amtStr);
            if (amt <= 0) {
                Swal.showValidationMessage('অনুগ্রহ করে সঠিক টাকার অংক লিখুন!');
                return false;
            }
            const pType = document.getElementById('quick-pay-type')?.value || 'Cash';
            const bankName = document.getElementById('quick-pay-bank')?.value || '';
            const date = toDBDate(document.getElementById('quick-pay-date')?.value || today);
            const notes = document.getElementById('quick-pay-notes')?.value || `মেমো #${targetVoucher} বাবদ জমা`;

            return { amt, pType, bankName, date, notes };
        }
    });

    if (!formValues) return;

    Swal.fire({ title: 'জমা সেভ হচ্ছে...', allowOutsideClick: false, didOpen: () => Swal.showLoading() });

    try {
        const batch = db.batch();
        const txnRef = TransactionDAO.getRef();
        const prevDue = Number(customer.totalDue) || 0;
        const newDue = safeRound(prevDue - formValues.amt);

        const newTxnData = {
            customerId: targetCustId,
            customerName: customer.name || custName,
            date: formValues.date,
            voucherNo: targetVoucher || 'COLLECTION',
            bill: 0,
            paid: formValues.amt,
            receivedType: formValues.pType,
            receivedFrom: formValues.pType === 'Bank' ? formValues.bankName : 'Cash',
            notes: formValues.notes,
            prevDue: safeRound(prevDue),
            currentDue: safeRound(newDue),
            createdBy: window.AppState?.currentUserEmail || 'Staff',
            createdAt: firebase.firestore.FieldValue.serverTimestamp()
        };

        batch.set(txnRef, newTxnData);
        batch.update(CustomerDAO.getRef(targetCustId), {
            totalDue: firebase.firestore.FieldValue.increment(-formValues.amt)
        });

        await batch.commit();
        auditLog('QUICK_COLLECT', 'Transaction', txnRef.id, custName, { paid: formValues.amt, voucherNo: targetVoucher });

        showToast(`৳ ${formatAmountWithComma(formValues.amt)} জমা সফলভাবে সেভ হয়েছে!`, 'success');
        Swal.close();

        // Automatically reload active memo view to reflect updated status & balance!
        if (typeof window.searchMemoDirectly === 'function') {
            window.searchMemoDirectly(targetVoucher);
        }
    } catch (e) {
        console.error("Memo Quick Pay error:", e);
        Swal.fire('Error', 'জমা সেভ করতে সমস্যা হয়েছে', 'error');
    }
}

// Global Binding
window.openMemoQuickPayModal = openMemoQuickPayModal;

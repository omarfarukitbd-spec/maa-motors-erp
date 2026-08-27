import Swal from 'sweetalert2';
import { db, firebase } from '../firebase-config.js';
import { TransactionDAO, CustomerDAO } from '../dao.js';
import { parseAmount, formatAmountWithComma, promptSecurityPin, toDBDate, safeRound } from '../utils.js';
import { showToast } from '../utils/ui-helpers.js';
import { auditLog } from '../audit.js';

/**
 * Open Memo Edit Modal with Admin PIN verification
 */
export async function openMemoEditModal(txnId, voucherNo) {
    if (!txnId) return;

    const isPinValid = await promptSecurityPin("মেমো সংশোধন (Edit Memo)");
    if (!isPinValid) return;

    Swal.fire({
        title: 'মেমো লোড হচ্ছে...',
        didOpen: () => Swal.showLoading(),
        allowOutsideClick: false,
        customClass: { popup: '!bg-slate-950 !text-white !rounded-3xl border border-slate-800' }
    });

    try {
        const txn = await TransactionDAO.getById(txnId);
        if (!txn) {
            Swal.fire('Error', 'মেমো ডাটা পাওয়া যায়নি', 'error');
            return;
        }

        const oldBill = Number(txn.bill) || 0;
        const oldPaid = Number(txn.paid) || 0;
        const oldVoucher = txn.voucherNo || '';
        const oldDate = txn.date || '';
        const oldNotes = txn.notes || '';
        const custName = txn.customerName || 'Customer';

        const { value: formValues } = await Swal.fire({
            title: `
                <div class="flex items-center justify-center gap-2 font-bn font-black text-lg text-white">
                    <i class="fa-solid fa-pen-to-square text-amber-400"></i>
                    <span>মেমো #${escapeHTML(oldVoucher)} সংশোধন</span>
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
                            <div class="text-[10px] text-slate-500 font-bold">আগের বিল / জমা</div>
                            <div class="text-xs font-mono font-bold text-slate-300">বিল: ৳${formatAmountWithComma(oldBill)} | জমা: ৳${formatAmountWithComma(oldPaid)}</div>
                        </div>
                    </div>

                    <div class="grid grid-cols-2 gap-3">
                        <div>
                            <label class="block text-slate-400 font-bold mb-1">মেমো / ভাউচার নং:</label>
                            <input type="text" id="edit-memo-voucher" value="${escapeHTML(oldVoucher)}" class="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs font-mono font-bold text-white outline-none focus:border-amber-500">
                        </div>
                        <div>
                            <label class="block text-slate-400 font-bold mb-1">তারিখ:</label>
                            <input type="text" id="edit-memo-date" value="${escapeHTML(oldDate)}" class="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs font-bold text-white outline-none focus:border-amber-500 datepicker">
                        </div>
                    </div>

                    <div class="grid grid-cols-2 gap-3">
                        <div>
                            <label class="block text-red-400 font-bold mb-1">বিল (Debit):</label>
                            <input type="text" id="edit-memo-bill" value="${oldBill}" oninput="window.handleNumberInput(this)" class="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-sm font-mono font-black text-red-400 outline-none focus:border-red-500">
                        </div>
                        <div>
                            <label class="block text-emerald-400 font-bold mb-1">জমা (Credit):</label>
                            <input type="text" id="edit-memo-paid" value="${oldPaid}" oninput="window.handleNumberInput(this)" class="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-sm font-mono font-black text-emerald-400 outline-none focus:border-emerald-500">
                        </div>
                    </div>

                    <div>
                        <label class="block text-slate-400 font-bold mb-1">নোট / রিমার্কস:</label>
                        <input type="text" id="edit-memo-notes" value="${escapeHTML(oldNotes)}" placeholder="মন্তব্য লিখুন..." class="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white outline-none focus:border-blue-500">
                    </div>
                </div>
            `,
            showCancelButton: true,
            confirmButtonText: '<i class="fa-solid fa-check mr-1.5"></i> আপডেট করুন',
            cancelButtonText: 'বাতিল',
            customClass: {
                popup: '!bg-slate-950 !text-white !rounded-3xl border border-slate-800 shadow-2xl font-bn',
                confirmButton: 'm3-btn-primary !bg-amber-600 hover:!bg-amber-500 !px-6 !py-2.5 !rounded-xl font-bold text-white',
                cancelButton: 'm3-btn-tonal !bg-slate-800 !text-slate-300 !px-4 !py-2.5 !rounded-xl font-bold'
            },
            preConfirm: () => {
                const newVoucher = document.getElementById('edit-memo-voucher')?.value?.trim() || oldVoucher;
                const newDate = toDBDate(document.getElementById('edit-memo-date')?.value || oldDate);
                const newBill = parseAmount(document.getElementById('edit-memo-bill')?.value || '0');
                const newPaid = parseAmount(document.getElementById('edit-memo-paid')?.value || '0');
                const newNotes = document.getElementById('edit-memo-notes')?.value || '';

                return { newVoucher, newDate, newBill, newPaid, newNotes };
            }
        });

        if (!formValues) return;

        Swal.fire({ title: 'আপডেট হচ্ছে...', allowOutsideClick: false, didOpen: () => Swal.showLoading() });

        const batch = db.batch();
        const txnRef = TransactionDAO.getRef(txnId);

        // Balance diff calculation
        const oldNetDiff = safeRound(oldBill - oldPaid);
        const newNetDiff = safeRound(formValues.newBill - formValues.newPaid);
        const adjustment = safeRound(newNetDiff - oldNetDiff);

        batch.update(txnRef, {
            voucherNo: formValues.newVoucher,
            date: formValues.newDate,
            bill: formValues.newBill,
            paid: formValues.newPaid,
            notes: formValues.newNotes,
            updatedAt: firebase.firestore.FieldValue.serverTimestamp()
        });

        if (txn.customerId && adjustment !== 0) {
            batch.update(CustomerDAO.getRef(txn.customerId), {
                totalDue: firebase.firestore.FieldValue.increment(adjustment)
            });
        }

        await batch.commit();
        auditLog('UPDATE_MEMO', 'Transaction', txnId, custName, {
            old: { bill: oldBill, paid: oldPaid, voucherNo: oldVoucher },
            new: { bill: formValues.newBill, paid: formValues.newPaid, voucherNo: formValues.newVoucher }
        });

        showToast('মেমো সফলভাবে আপডেট করা হয়েছে!', 'success');
        Swal.close();

        // Refresh memo view
        if (typeof window.searchMemoDirectly === 'function') {
            window.searchMemoDirectly(formValues.newVoucher);
        }
    } catch (e) {
        console.error("Memo Edit Error:", e);
        Swal.fire('Error', 'মেমো আপডেট করতে সমস্যা হয়েছে', 'error');
    }
}

// Global Binding
window.openMemoEditModal = openMemoEditModal;

import Swal from 'sweetalert2';
import { db, firebase } from '../firebase-config.js';
import { TransactionDAO, CustomerDAO } from '../dao.js';
import { parseAmount, formatAmountWithComma, numberToBanglaWords, toDBDate, safeRound, escapeHTML, showToast, handleError } from '../utils.js';
import { auditLog } from '../audit.js';
import { extractVoucherNumber } from './memo-book-audit-calc.js';
import { triggerSilentCustomerGoogleSync } from '../customer/google-contact-sync-service.js';

/**
 * Open Quick Less / Return Adjustment Modal for a specific memo
 * Allows adding a deduction/return on any past or present date while keeping original bill intact.
 */
export async function openMemoQuickLessModal(txnId, voucherNo, customerId, customerName, bill = 0) {
    if (!navigator.onLine) {
        return Swal.fire({
            title: '<i class="fa-solid fa-wifi text-red-400 mr-2"></i>অফলাইন!',
            text: 'ইন্টারনেট সংযোগ নেই। অফলাইনে নতুন লেস বা মাল ফেরত এন্ট্রি দেওয়া যাবে না।',
            icon: 'error',
            confirmButtonText: 'ঠিক আছে',
            customClass: { popup: '!bg-slate-950 !text-white !rounded-3xl border border-red-500/30 font-bn' }
        });
    }

    let targetCustId = customerId;
    let targetCustName = customerName;
    let targetVoucher = voucherNo || '';
    let targetBill = Number(bill) || 0;

    if (txnId && (!targetCustId || !targetVoucher)) {
        try {
            const txn = await TransactionDAO.getById(txnId);
            if (txn) {
                targetCustId = targetCustId || txn.customerId;
                targetCustName = targetCustName || txn.customerName;
                targetVoucher = targetVoucher || txn.voucherNo || '';
                targetBill = targetBill || Number(txn.bill) || 0;
            }
        } catch (e) {
            console.error("Error fetching txn for quick less:", e);
        }
    }

    if (!targetCustId) {
        return showToast('কাস্টমার তথ্য পাওয়া যায়নি', 'error');
    }

    let customer = {};
    try {
        customer = (await CustomerDAO.getById(targetCustId)) || {};
    } catch (e) {
        console.warn("Could not fetch customer live balance:", e);
    }

    const currentDue = Number(customer.totalDue || 0);
    const today = new Date().toISOString().split('T')[0];
    const cleanMemoNo = extractVoucherNumber(targetVoucher) || targetVoucher;

    const { value: formValues } = await Swal.fire({
        title: `
            <div class="flex items-center justify-center gap-2 font-bn font-black text-lg text-white">
                <i class="fa-solid fa-tags text-purple-400"></i>
                <span>মেমো #${escapeHTML(String(cleanMemoNo))} এর বিপরীতে ছাড় / মাল ফেরত</span>
            </div>
        `,
        html: `
            <div class="text-left font-bn p-2 space-y-3 text-xs">
                <div class="p-3 bg-slate-950/70 rounded-2xl border border-purple-500/30 flex justify-between items-center">
                    <div>
                        <div class="text-[10px] text-purple-300/80 font-bold">কাস্টমার</div>
                        <div class="text-sm font-black text-white">${escapeHTML(targetCustName || customer.name || 'গ্রাহক')}</div>
                    </div>
                    <div class="text-right">
                        <div class="text-[10px] text-slate-400 font-bold">মূল মেমো বিল / বর্তমান দেনা</div>
                        <div class="text-xs font-mono font-bold text-slate-300">
                            বিল: <span class="text-red-400 font-black">৳${formatAmountWithComma(targetBill)}</span> | 
                            দেনা: <span class="text-amber-400 font-black">৳${formatAmountWithComma(currentDue)}</span>
                        </div>
                    </div>
                </div>

                <div>
                    <label class="block text-purple-300 font-bold mb-1">ছাড় / লেসের পরিমাণ (টাকা):</label>
                    <input type="text" id="quick-less-amt" placeholder="0" 
                        oninput="window.handleNumberInput(this); window.updateLiveWords(this, 'quick-less-words')"
                        class="w-full bg-slate-950 border border-purple-500/60 rounded-xl px-3.5 py-2.5 text-base font-mono font-black text-purple-400 outline-none focus:border-purple-400 shadow-inner">
                    <div id="quick-less-words" class="text-[11px] font-bold text-amber-400 mt-1 min-h-[16px]"></div>
                </div>

                <div class="grid grid-cols-2 gap-3">
                    <div>
                        <label class="block text-slate-400 font-bold mb-1">লেস সমন্বয়ের তারিখ:</label>
                        <input type="text" id="quick-less-date" value="${today}" class="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs font-bold text-white outline-none focus:border-purple-500 datepicker" placeholder="DD/MM/YYYY">
                    </div>
                    <div>
                        <label class="block text-slate-400 font-bold mb-1">মূল মেমো রেফারেন্স:</label>
                        <input type="text" id="quick-less-memo-ref" value="#${cleanMemoNo}" readonly disabled class="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs font-mono font-bold text-cyan-400 cursor-not-allowed select-all">
                    </div>
                </div>

                <div>
                    <label class="block text-slate-400 font-bold mb-1">ছাড় / মাল ফেরতের কারণ বা বিবরণ:</label>
                    <input type="text" id="quick-less-notes" placeholder="যেমন: ২টি মাল ফেরত বা হিসাব চূড়ান্ত ছাড়..." class="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs font-medium text-white outline-none focus:border-purple-500">
                </div>

                <div class="p-2.5 rounded-xl bg-purple-950/20 border border-purple-500/20 text-[11px] text-purple-200/90 leading-relaxed">
                    <i class="fa-solid fa-circle-info text-purple-400 mr-1"></i>
                    এই এন্ট্রিটি কাস্টমারের খতিয়ান থেকে দেনা কমাবে কিন্তু মেমো #${cleanMemoNo} এর আসল বিক্রয়মূল্য (৳${formatAmountWithComma(targetBill)}) সম্পূর্ণ অক্ষুণ্ণ রাখবে।
                </div>
            </div>
        `,
        showCancelButton: true,
        confirmButtonText: '<i class="fa-solid fa-circle-check mr-1.5"></i>লেস নিশ্চিত করুন',
        cancelButtonText: 'বাতিল',
        customClass: {
            popup: '!bg-slate-950 !text-white !rounded-3xl border border-purple-500/30 shadow-2xl font-bn',
            confirmButton: 'm3-btn-primary !bg-purple-600 hover:!bg-purple-500 !px-6 !py-2.5 !rounded-xl font-bold',
            cancelButton: 'm3-btn-tonal !bg-slate-800 hover:!bg-slate-700 !text-slate-300 !px-5 !py-2.5 !rounded-xl font-bold'
        },
        preConfirm: () => {
            const amtStr = document.getElementById('quick-less-amt')?.value || '';
            const amt = parseAmount(amtStr);
            const dateStr = document.getElementById('quick-less-date')?.value || '';
            const notes = document.getElementById('quick-less-notes')?.value?.trim() || '';

            if (isNaN(amt) || amt <= 0) {
                Swal.showValidationMessage('সঠিক লেসের পরিমাণ লিখুন!');
                return false;
            }
            if (!dateStr) {
                Swal.showValidationMessage('তারিখ নির্বাচন করুন!');
                return false;
            }

            return {
                amount: amt,
                date: toDBDate(dateStr),
                notes
            };
        }
    });

    if (!formValues) return;

    Swal.fire({
        title: 'লেস সেভ করা হচ্ছে...',
        didOpen: () => Swal.showLoading(),
        allowOutsideClick: false,
        customClass: { popup: '!bg-slate-950 !text-white !rounded-3xl border border-slate-800' }
    });

    try {
        const liveCust = await CustomerDAO.getById(targetCustId);
        const prevDue = liveCust ? Number(liveCust.totalDue || 0) : currentDue;
        const lessAmt = safeRound(formValues.amount);
        const currentDueCalc = safeRound(prevDue - lessAmt);

        const batch = db.batch();
        const txnRef = TransactionDAO.getRef();

        const vNo = targetVoucher ? (targetVoucher.startsWith('#') ? targetVoucher : '#' + targetVoucher) : ('#' + cleanMemoNo);
        const notesDesc = formValues.notes 
            ? `${formValues.notes} (মেমো #${cleanMemoNo} থেকে কর্তন)` 
            : `মেমো #${cleanMemoNo} এর বিপরীতে ছাড়/মাল ফেরত`;

        batch.set(txnRef, {
            customerId: targetCustId,
            customerName: targetCustName || liveCust?.name || 'গ্রাহক',
            date: formValues.date,
            voucherNo: vNo,
            refMemoNo: String(cleanMemoNo),
            bill: 0,
            paid: lessAmt,
            receivedType: 'Less',
            receivedFrom: formValues.notes || 'ছাড় / মাল ফেরত',
            notes: notesDesc,
            prevDue: safeRound(prevDue),
            currentDue: safeRound(currentDueCalc),
            createdBy: window.AppState?.currentUserEmail || 'Staff',
            createdAt: firebase.firestore.FieldValue.serverTimestamp()
        });

        batch.update(CustomerDAO.getRef(targetCustId), {
            totalDue: firebase.firestore.FieldValue.increment(-lessAmt),
            lastTxnDate: formValues.date
        });

        await batch.commit();

        auditLog('CREATE_LESS', 'Ledger', txnRef.id, targetCustName, {
            amount: lessAmt,
            refMemoNo: String(cleanMemoNo),
            date: formValues.date,
            notes: formValues.notes
        });

        triggerSilentCustomerGoogleSync(targetCustId);
        showToast(`মেমো #${cleanMemoNo} এর বিপরীতে ৳ ${formatAmountWithComma(lessAmt)} লেস সফলভাবে সেভ হয়েছে!`, 'success');

        // Instant refresh memo search result if currently viewing this memo
        if (typeof window.executeMemoSearch === 'function') {
            window.executeMemoSearch(String(cleanMemoNo));
        }
    } catch (err) {
        handleError(err, 'লেস সেভ করতে সমস্যা হয়েছে');
    }
}

// Global attachment
if (typeof window !== 'undefined') {
    window.openMemoQuickLessModal = openMemoQuickLessModal;
}

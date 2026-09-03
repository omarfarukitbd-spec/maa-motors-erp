import Swal from 'sweetalert2';
import { db, firebase } from '../firebase-config.js';
import { CustomerDAO, TransactionDAO } from '../dao.js';
import { safeRound, formatAmountWithComma, promptSecurityPin, showToast, handleError } from '../utils.js';
import { auditLog } from '../audit.js';
import { reconcileSingleCustomerBalance } from './balance-recon-heal.js';
import { getCustomerCache, initCustomerCache } from '../customer/customer-state.js';

/**
 * World-Class Customer Account Merge Engine (Stripe/SAP Enterprise Pattern)
 * Merges source customer transactions into target customer, archives source into recycle_bin,
 * and executes JIT balance auto-reconciliation on the target account.
 */
export async function mergeCustomerAccounts(sourceCustId, targetCustId) {
    if (!sourceCustId || !targetCustId) {
        return Swal.fire('এরর', 'উৎস ও গন্তব্য উভয় কাস্টমার নির্বাচন করা আবশ্যক!', 'error');
    }
    if (sourceCustId === targetCustId) {
        return Swal.fire('এরর', 'উৎস এবং গন্তব্য কাস্টমার একই হতে পারে না!', 'warning');
    }

    try {
        Swal.fire({ title: 'ডাটা যাচাই করা হচ্ছে...', allowOutsideClick: false, didOpen: () => Swal.showLoading() });
        const sourceCust = await CustomerDAO.getById(sourceCustId);
        const targetCust = await CustomerDAO.getById(targetCustId);

        if (!sourceCust) throw new Error('উৎস কাস্টমার খুঁজে পাওয়া যায়নি');
        if (!targetCust) throw new Error('গন্তব্য কাস্টমার খুঁজে পাওয়া যায়নি');

        const sourceTxns = await TransactionDAO.getByCustomer(sourceCustId);
        const sourceDue = Number(sourceCust.totalDue || 0);
        const targetDue = Number(targetCust.totalDue || 0);
        const estimatedDue = safeRound(sourceDue + targetDue);

        const isPinValid = await promptSecurityPin('কাস্টমার একাউন্ট মার্জ (Account Merge)');
        if (!isPinValid) return;

        const confirmRes = await Swal.fire({
            title: '<div class="flex items-center justify-center gap-2 font-bn font-black text-xl text-amber-400"><i class="fa-solid fa-code-merge"></i><span>অ্যাকাউন্ট মার্জ নিশ্চিতকরণ</span></div>',
            html: `
                <div class="text-left font-bn space-y-3 p-3 bg-slate-900/90 rounded-2xl border border-amber-500/30 text-xs">
                    <p class="text-slate-300">আপনি কি নিশ্চিত যে নিচের উৎস অ্যাকাউন্টটি স্থায়ীভাবে গন্তব্য অ্যাকাউন্টের সাথে একীভূত (Merge) করতে চান?</p>
                    
                    <div class="grid grid-cols-2 gap-2 text-[11px]">
                        <div class="p-2.5 bg-red-950/40 rounded-xl border border-red-500/30">
                            <div class="text-red-400 font-bold mb-1"><i class="fa-solid fa-arrow-right-from-bracket mr-1"></i>উৎস অ্যাকাউন্ট (মুছে যাবে)</div>
                            <div class="font-bold text-white text-sm">${sourceCust.name}</div>
                            <div class="text-amber-400 font-mono font-bold">#${sourceCust.accountNo || 'N/A'}</div>
                            <div class="text-slate-300 font-mono">${sourceCust.phone || '-'}</div>
                            <div class="mt-1 pt-1 border-t border-red-500/20 text-red-300 font-bold">বকেয়া: ৳ ${formatAmountWithComma(sourceDue)}</div>
                            <div class="text-[10px] text-slate-400">ট্রানজ্যাকশন: ${sourceTxns.length} টি</div>
                        </div>

                        <div class="p-2.5 bg-emerald-950/40 rounded-xl border border-emerald-500/30">
                            <div class="text-emerald-400 font-bold mb-1"><i class="fa-solid fa-arrow-right-to-bracket mr-1"></i>গন্তব্য অ্যাকাউন্ট (চলমান থাকবে)</div>
                            <div class="font-bold text-white text-sm">${targetCust.name}</div>
                            <div class="text-amber-400 font-mono font-bold">#${targetCust.accountNo || 'N/A'}</div>
                            <div class="text-slate-300 font-mono">${targetCust.phone || '-'}</div>
                            <div class="mt-1 pt-1 border-t border-emerald-500/20 text-emerald-300 font-bold">বর্তমান বকেয়া: ৳ ${formatAmountWithComma(targetDue)}</div>
                            <div class="text-[10px] text-emerald-400 font-bold">মার্জ পরবর্তী বকেয়া: ৳ ${formatAmountWithComma(estimatedDue)}</div>
                        </div>
                    </div>

                    <div class="p-2.5 bg-amber-500/10 rounded-xl border border-amber-500/20 text-[11px] text-amber-300">
                        <i class="fa-solid fa-circle-info mr-1"></i>উৎস অ্যাকাউন্টের সব ভাউচার গন্তব্য অ্যাকাউন্টে যুক্ত হবে এবং উৎস অ্যাকাউন্টটি সুরক্ষার স্বার্থে <b>রিসাইকেল বিনে</b> ব্যাকআপ সংরক্ষিত হবে।
                    </div>
                </div>
            `,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: '<i class="fa-solid fa-code-merge mr-1.5"></i>হ্যাঁ, মার্জ সম্পূর্ণ করুন',
            cancelButtonText: 'বাতিল',
            confirmButtonColor: '#f59e0b',
            customClass: {
                popup: '!bg-slate-950 !text-white !rounded-3xl border border-amber-500/30 font-bn',
                confirmButton: 'm3-btn-primary !bg-amber-600 hover:!bg-amber-500 !px-6 !py-2.5 !rounded-xl font-bold',
                cancelButton: 'm3-btn-tonal !bg-slate-800 hover:!bg-slate-700 !text-slate-300 !px-5 !py-2.5 !rounded-xl font-bold border border-slate-700'
            }
        });

        if (!confirmRes.isConfirmed) return;

        Swal.fire({ title: 'মার্জ হচ্ছে...', allowOutsideClick: false, didOpen: () => Swal.showLoading() });

        const batchId = `merge_${Date.now()}`;
        const serverTimestamp = firebase.firestore.FieldValue.serverTimestamp();
        const currentUser = window.AppState?.currentUserEmail || 'Admin';

        // 1. Prepare batch operations
        const ops = [];

        // Archive source customer to recycle_bin
        ops.push(b => b.set(db.collection('recycle_bin').doc(sourceCustId), {
            module: 'Customer',
            batchId,
            action: 'MERGED_INTO',
            mergedIntoId: targetCustId,
            mergedIntoName: targetCust.name,
            mergedIntoAccNo: targetCust.accountNo || '',
            data: sourceCust,
            deletedAt: serverTimestamp,
            deletedBy: currentUser
        }));

        // Delete source customer from customers collection
        ops.push(b => b.delete(CustomerDAO.getRef(sourceCustId)));

        // Reassign all source transactions to target customer
        sourceTxns.forEach(txn => {
            const updatePayload = {
                customerId: targetCustId,
                customerName: targetCust.name,
                mergedFrom: {
                    sourceCustId,
                    sourceCustName: sourceCust.name,
                    sourceAccountNo: sourceCust.accountNo || ''
                },
                mergedAt: serverTimestamp
            };
            if (txn.voucherNo === 'OPENING') {
                updatePayload.voucherNo = 'ADJ-OPENING';
                updatePayload.notes = `প্রারম্ভিক ব্যালেন্স স্থানান্তর (${sourceCust.name} #${sourceCust.accountNo || ''})`;
            }
            ops.push(b => b.update(TransactionDAO.getRef(txn.id), updatePayload));
        });

        // Execute in atomic chunks of up to 400 operations
        for (let i = 0; i < ops.length; i += 400) {
            const batch = db.batch();
            ops.slice(i, i + 400).forEach(op => op(batch));
            await batch.commit();
        }

        // 2. Perform JIT balance reconciliation on target customer to guarantee mathematical precision
        const recon = await reconcileSingleCustomerBalance(targetCustId);
        const finalDue = recon && recon.healed ? recon.newDue : estimatedDue;

        // 3. Log audit event
        auditLog('MERGE', 'Customers', targetCustId, targetCust.name, {
            sourceCustId,
            sourceCustName: sourceCust.name,
            sourceAccountNo: sourceCust.accountNo || '',
            transferredTxnCount: sourceTxns.length,
            finalBalance: finalDue
        });

        // 4. Invalidate and refresh cache
        initCustomerCache();
        if (typeof window.loadCustomers === 'function') window.loadCustomers();
        if (typeof window.loadCustomersForDropdown === 'function') window.loadCustomersForDropdown();

        const modalRes = await Swal.fire({
            title: '<i class="fa-solid fa-circle-check text-emerald-400 mr-2"></i>মার্জ সম্পন্ন হয়েছে!',
            html: `
                <div class="text-left font-bn space-y-2 p-3 bg-slate-900/90 rounded-2xl border border-emerald-500/30 text-xs">
                    <p class="text-slate-200"><b>${sourceCust.name} (#${sourceCust.accountNo || ''})</b>-এর সকল হিসেব সফলভাবে <b>${targetCust.name} (#${targetCust.accountNo || ''})</b>-এ মার্জ করা হয়েছে।</p>
                    <div class="p-2.5 bg-slate-950/80 rounded-xl border border-slate-800 space-y-1">
                        <div class="flex justify-between"><span class="text-slate-400">স্থানান্তরিত ভাউচার:</span><span class="text-white font-bold">${sourceTxns.length} টি</span></div>
                        <div class="flex justify-between border-t border-slate-800 pt-1"><span class="text-slate-400">হালনাগাদ মোট বকেয়া:</span><span class="text-red-400 font-bold text-sm">৳ ${formatAmountWithComma(finalDue)}</span></div>
                    </div>
                </div>
            `,
            icon: 'success',
            confirmButtonText: 'খতিয়ান দেখুন',
            showCancelButton: true,
            cancelButtonText: 'বন্ধ করুন',
            customClass: {
                popup: '!bg-slate-950 !text-white !rounded-3xl border border-emerald-500/30 font-bn',
                confirmButton: 'm3-btn-primary !bg-emerald-600 hover:!bg-emerald-500 !px-6 !py-2.5 !rounded-xl font-bold',
                cancelButton: 'm3-btn-tonal !bg-slate-800 hover:!bg-slate-700 !text-slate-300 !px-5 !py-2.5 !rounded-xl font-bold border border-slate-700'
            }
        });

        if (modalRes.isConfirmed) {
            if (typeof window.filterLedgerByCustomer === 'function') {
                const sel = document.getElementById('ledger-customer-select');
                if (sel) sel.value = targetCustId;
                window.filterLedgerByCustomer(targetCustId);
            }
            if (typeof window.showSection === 'function') {
                window.showSection('ledger-sec');
            }
        }

    } catch (e) {
        console.error('Account Merge Error:', e);
        handleError(e, 'অ্যাকাউন্ট মার্জ করা সম্ভব হয়নি');
    }
}

/**
 * Open Customer Merge Interactive Modal
 */
export async function openCustomerMergeModal(defaultSourceId = null, defaultTargetId = null) {
    const customers = getCustomerCache() || [];
    if (customers.length < 2) {
        return Swal.fire('তথ্য ঘাটতি', 'মার্জ করার জন্য কমপক্ষে ২টি কাস্টমার অ্যাকাউন্ট থাকতে হবে।', 'info');
    }

    const buildOptions = (selectedId) => {
        let opts = '<option value="">-- কাস্টমার নির্বাচন করুন --</option>';
        customers.forEach(c => {
            const isSel = c.id === selectedId ? 'selected' : '';
            const acc = c.accountNo ? `#${c.accountNo} - ` : '';
            const phone = c.phone ? ` (${c.phone})` : '';
            const due = Number(c.totalDue || 0);
            opts += `<option value="${c.id}" ${isSel}>${acc}${c.name}${phone} [৳ ${formatAmountWithComma(due)}]</option>`;
        });
        return opts;
    };

    const { value: formValues } = await Swal.fire({
        title: '<div class="flex items-center justify-center gap-2 font-bn font-black text-xl text-white"><i class="fa-solid fa-code-merge text-amber-400"></i><span>কাস্টমার অ্যাকাউন্ট মার্জ (Merge)</span></div>',
        html: `
            <div class="space-y-4 text-left p-1 font-bn text-xs">
                <p class="text-slate-300 leading-relaxed">
                    ভুলবশত একই ব্যক্তির দুটি অ্যাকাউন্ট তৈরি হলে একটি অ্যাকাউন্টকে অন্যটির সাথে একীভূত করুন।
                </p>

                <div class="space-y-1">
                    <label class="block text-[11px] font-black text-red-400 uppercase tracking-wider">
                        <i class="fa-solid fa-arrow-right-from-bracket mr-1"></i>উৎস অ্যাকাউন্ট (Source - যা মার্জ হয়ে মুছে যাবে) *
                    </label>
                    <select id="merge-source-select" class="w-full bg-slate-950 border border-slate-700/80 rounded-xl px-3.5 py-2.5 text-white outline-none focus:border-red-500 font-bold cursor-pointer">
                        ${buildOptions(defaultSourceId)}
                    </select>
                </div>

                <div class="space-y-1">
                    <label class="block text-[11px] font-black text-emerald-400 uppercase tracking-wider">
                        <i class="fa-solid fa-arrow-right-to-bracket mr-1"></i>গন্তব্য অ্যাকাউন্ট (Target - যার মধ্যে সব ডাটা জমা হবে) *
                    </label>
                    <select id="merge-target-select" class="w-full bg-slate-950 border border-slate-700/80 rounded-xl px-3.5 py-2.5 text-white outline-none focus:border-emerald-500 font-bold cursor-pointer">
                        ${buildOptions(defaultTargetId)}
                    </select>
                </div>
            </div>
        `,
        showCancelButton: true,
        confirmButtonText: '<i class="fa-solid fa-arrow-right mr-1.5"></i>পরবর্তী ধাপ',
        cancelButtonText: 'বাতিল',
        customClass: {
            popup: '!bg-slate-950 !text-white !rounded-3xl border border-slate-800 shadow-2xl font-bn',
            confirmButton: 'm3-btn-primary !bg-blue-600 hover:!bg-blue-500 !px-6 !py-2.5 !rounded-xl font-bold',
            cancelButton: 'm3-btn-tonal !bg-slate-800 hover:!bg-slate-700 !text-slate-300 !px-5 !py-2.5 !rounded-xl font-bold border border-slate-700'
        },
        preConfirm: () => {
            const sId = document.getElementById('merge-source-select')?.value;
            const tId = document.getElementById('merge-target-select')?.value;
            if (!sId || !tId) {
                Swal.showValidationMessage('উৎস ও গন্তব্য উভয় অ্যাকাউন্ট নির্বাচন করুন!');
                return false;
            }
            if (sId === tId) {
                Swal.showValidationMessage('উৎস ও গন্তব্য অ্যাকাউন্ট একই হতে পারে না!');
                return false;
            }
            return { sId, tId };
        }
    });

    if (formValues && formValues.sId && formValues.tId) {
        await mergeCustomerAccounts(formValues.sId, formValues.tId);
    }
}

// Global Bindings
window.openCustomerMergeModal = openCustomerMergeModal;
window.mergeCustomerAccounts = mergeCustomerAccounts;

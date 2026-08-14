import Swal from 'sweetalert2';
import { CustomerDAO, TransactionDAO } from '../dao.js';
import { safeRound, formatAmountWithComma } from '../utils.js';
import { auditLog } from '../audit.js';

/**
 * --- Balance Integrity Scanner & Auto-Healer ---
 * Scans all customers and cross-verifies their stored totalDue with historical transactions.
 */
export async function runBalanceIntegrityScanner() {
    Swal.fire({
        title: '<i class="fa-solid fa-calculator text-blue-400 mr-2"></i>খতিয়ান স্ক্যান হচ্ছে...',
        html: '<p class="font-bn text-sm text-slate-300">সকল কাস্টমার এবং ভাউচার হিসাব যাচাই করা হচ্ছে। অনুগ্রহ করে অপেক্ষা করুন...</p>',
        allowOutsideClick: false,
        didOpen: () => Swal.showLoading(),
        customClass: { popup: '!bg-slate-950 !text-white !rounded-3xl border border-slate-800 font-bn' }
    });

    try {
        const [customers, transactions] = await Promise.all([
            CustomerDAO.getAll('name', 'asc'),
            TransactionDAO.getAll()
        ]);

        const txnMap = {};
        const openingMap = {};

        transactions.forEach(t => {
            if (!t.customerId) return;
            const v = String(t.voucherNo || '').trim().toUpperCase();
            const isOp = (v === 'OPENING' || v === 'OPEN' || v === 'প্রারম্ভিক ব্যালেন্স' || v === 'প্রারম্ভিক জের');

            if (isOp) {
                const opAmt = safeRound((Number(t.bill) || 0) - (Number(t.paid) || 0));
                openingMap[t.customerId] = opAmt;
            } else {
                if (!txnMap[t.customerId]) txnMap[t.customerId] = { totalBill: 0, totalPaid: 0, count: 0 };
                txnMap[t.customerId].totalBill = safeRound(txnMap[t.customerId].totalBill + (Number(t.bill) || 0));
                txnMap[t.customerId].totalPaid = safeRound(txnMap[t.customerId].totalPaid + (Number(t.paid) || 0));
                txnMap[t.customerId].count++;
            }
        });

        const discrepancies = [];
        customers.forEach(c => {
            let initial = Number(c.initialDue || 0);
            if (initial === 0 && openingMap[c.id] !== undefined) {
                initial = openingMap[c.id];
            }
            const tData = txnMap[c.id] || { totalBill: 0, totalPaid: 0, count: 0 };
            const expectedDue = safeRound(initial + tData.totalBill - tData.totalPaid);
            const currentDue = safeRound(Number(c.totalDue || 0));
            const diff = safeRound(currentDue - expectedDue);

            if (Math.abs(diff) > 0.01) {
                discrepancies.push({
                    id: c.id,
                    name: c.name,
                    accountNo: c.accountNo || 'N/A',
                    phone: c.phone || '',
                    initialDue: initial,
                    totalBill: tData.totalBill,
                    totalPaid: tData.totalPaid,
                    storedDue: currentDue,
                    expectedDue,
                    diff
                });
            }
        });

        if (discrepancies.length === 0) {
            return Swal.fire({
                title: '<i class="fa-solid fa-circle-check text-emerald-400 mr-2"></i>খতিয়ান ১০০% নির্ভুল!',
                html: `
                    <div class="font-bn text-left space-y-2 p-3 bg-slate-900 rounded-2xl border border-slate-800 text-xs">
                        <div class="flex justify-between border-b border-slate-800 pb-1.5"><span class="text-slate-400">মোট কাস্টমার:</span><strong class="text-white">${customers.length} জন</strong></div>
                        <div class="flex justify-between border-b border-slate-800 pb-1.5"><span class="text-slate-400">মোট ভাউচার লেনদেন:</span><strong class="text-white">${transactions.length} টি</strong></div>
                        <div class="flex justify-between pt-1"><span class="text-emerald-400 font-bold">ব্যালেন্স অমিল:</span><strong class="text-emerald-400">০ (কোনো ভুল নেই)</strong></div>
                    </div>
                `,
                icon: 'success',
                confirmButtonText: 'ঠিক আছে',
                customClass: { popup: '!bg-slate-950 !text-white !rounded-3xl border border-emerald-500/30 font-bn', confirmButton: 'm3-btn-primary !bg-emerald-600' }
            });
        }

        // Show Discrepancy Table with 1-Click Heal Button
        let tableRows = discrepancies.map((d, i) => `
            <tr class="border-b border-slate-800 text-xs">
                <td class="p-2 text-slate-400 font-mono">${i + 1}</td>
                <td class="p-2 font-bold text-white">${d.name} <span class="text-[10px] text-blue-400 block font-mono">[${d.accountNo}]</span></td>
                <td class="p-2 text-right font-mono text-slate-300">৳ ${formatAmountWithComma(d.storedDue)}</td>
                <td class="p-2 text-right font-mono text-emerald-400 font-black">৳ ${formatAmountWithComma(d.expectedDue)}</td>
                <td class="p-2 text-right font-mono text-red-400 font-black">৳ ${formatAmountWithComma(d.diff)}</td>
            </tr>
        `).join('');

        const confirmHeal = await Swal.fire({
            title: `<i class="fa-solid fa-triangle-exclamation text-amber-400 mr-2"></i>${discrepancies.length} জনের ব্যালেন্সে অমিল পাওয়া গেছে!`,
            html: `
                <div class="text-left font-bn space-y-3">
                    <p class="text-xs text-slate-300">নিচের কাস্টমারদের বর্তমান মোট ব্যালেন্স ও তাদের প্রকৃত ভাউচার যোগফলের মধ্যে অমিল রয়েছে:</p>
                    <div class="max-h-56 overflow-y-auto rounded-xl border border-slate-800 bg-slate-900">
                        <table class="w-full text-left">
                            <thead class="bg-slate-950 text-[10px] uppercase text-slate-400 sticky top-0">
                                <tr>
                                    <th class="p-2">#</th>
                                    <th class="p-2">কাস্টমার</th>
                                    <th class="p-2 text-right">সংরক্ষিত বকেয়া</th>
                                    <th class="p-2 text-right">প্রকৃত বকেয়া</th>
                                    <th class="p-2 text-right">পার্থক্য</th>
                                </tr>
                            </thead>
                            <tbody>${tableRows}</tbody>
                        </table>
                    </div>
                    <p class="text-[11px] text-emerald-400 font-bold text-center">"সবগুলো অটো-হিল করুন" বাটনে চাপ দিলে সবগুলো স্বয়ংক্রিয়ভাবে সঠিক হয়ে যাবে।</p>
                </div>
            `,
            showCancelButton: true,
            confirmButtonText: '<i class="fa-solid fa-wand-magic-sparkles mr-1.5"></i>সবগুলো অটো-হিল করুন',
            cancelButtonText: 'পরে করব',
            customClass: {
                popup: '!bg-slate-950 !text-white !rounded-3xl border border-amber-500/40 font-bn max-w-2xl',
                confirmButton: 'm3-btn-primary !bg-emerald-600 hover:!bg-emerald-500 font-bold px-6 py-2.5 rounded-xl',
                cancelButton: 'm3-btn-tonal !bg-slate-800 text-slate-300 font-bold px-5 py-2.5 rounded-xl'
            }
        });

        if (confirmHeal.isConfirmed) {
            await autoHealCustomerBalances(discrepancies);
        }

    } catch (err) {
        console.error("Balance scan error:", err);
        Swal.fire({ title: 'ত্রুটি!', text: 'স্ক্যান করার সময় সমস্যা হয়েছে: ' + err.message, icon: 'error' });
    }
}

async function autoHealCustomerBalances(discrepancies) {
    Swal.fire({
        title: 'ব্যালেন্স ঠিক করা হচ্ছে...',
        allowOutsideClick: false,
        didOpen: () => Swal.showLoading(),
        customClass: { popup: '!bg-slate-950 !text-white !rounded-3xl border border-slate-800 font-bn' }
    });

    try {
        let healedCount = 0;
        for (const d of discrepancies) {
            await CustomerDAO.update(d.id, { totalDue: d.expectedDue });
            auditLog('HEAL_BALANCE', 'Customer', d.id, d.name, {
                storedDue: d.storedDue,
                correctedDue: d.expectedDue,
                diff: d.diff
            });
            healedCount++;
        }

        Swal.fire({
            title: 'সফলভাবে সম্পন্ন!',
            text: `মোট ${healedCount} জন কাস্টমারের খতিয়ান ব্যালেন্স নিখুঁতভাবে রিস্টোর করা হয়েছে।`,
            icon: 'success',
            confirmButtonText: 'ঠিক আছে',
            customClass: { popup: '!bg-slate-950 !text-white !rounded-3xl border border-emerald-500/40 font-bn' }
        });
    } catch (e) {
        console.error("Heal error:", e);
        Swal.fire('Error', 'ব্যালেন্স রিস্টোর করতে সমস্যা হয়েছে: ' + e.message, 'error');
    }
}

if (typeof window !== 'undefined') {
    window.runBalanceIntegrityScanner = runBalanceIntegrityScanner;
}

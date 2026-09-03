import Swal from 'sweetalert2';
import { CustomerDAO, TransactionDAO } from '../dao.js';
import { safeRound } from '../utils.js';
import { getCustomerCache } from '../customer/index.js';
import { auditLog } from '../audit.js';

export async function autoHealCustomerBalances(discrepancies) {
    Swal.fire({
        title: 'ব্যালেন্স ঠিক করা হচ্ছে...',
        allowOutsideClick: false,
        didOpen: () => Swal.showLoading(),
        customClass: { popup: '!bg-slate-950 !text-white !rounded-3xl border border-slate-800 font-bn' }
    });

    try {
        let healedCount = 0;
        const cache = getCustomerCache() || [];
        for (const d of discrepancies) {
            await CustomerDAO.update(d.id, { totalDue: d.expectedDue });
            const cachedCust = cache.find(c => c.id === d.id);
            if (cachedCust) {
                cachedCust.totalDue = d.expectedDue;
            }
            auditLog('HEAL_BALANCE', 'Customer', d.id, d.name, {
                storedDue: d.storedDue,
                correctedDue: d.expectedDue,
                diff: d.diff
            });
            healedCount++;
        }

        if (typeof window.loadCustomers === 'function') window.loadCustomers();
        if (typeof window.loadCustomersForDropdown === 'function') window.loadCustomersForDropdown();

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

/**
 * --- Just-In-Time (JIT) Single Customer Auto-Reconciliation ---
 * Verifies and auto-heals an individual customer balance against their ledger transactions.
 */
export async function reconcileSingleCustomerBalance(customerId) {
    if (!customerId) return null;
    try {
        const [customer, transactions] = await Promise.all([
            CustomerDAO.getById(customerId),
            TransactionDAO.getByCustomer(customerId)
        ]);
        if (!customer) return null;

        let initial = Number(customer.initialDue || 0);
        let billSum = 0;
        let paidSum = 0;

        transactions.forEach(t => {
            const v = String(t.voucherNo || '').trim().toUpperCase();
            const isOp = (v === 'OPENING' || v === 'OPEN' || v === 'প্রারম্ভিক ব্যালেন্স' || v === 'প্রারম্ভিক জের');
            if (isOp) {
                const opAmount = safeRound((Number(t.bill) || 0) - (Number(t.paid) || 0));
                if (initial === 0) initial = opAmount;
            } else {
                billSum = safeRound(billSum + (Number(t.bill) || 0));
                paidSum = safeRound(paidSum + (Number(t.paid) || 0));
            }
        });

        const expectedDue = safeRound(initial + billSum - paidSum);
        const storedDue = safeRound(Number(customer.totalDue || 0));
        const diff = safeRound(storedDue - expectedDue);

        if (Math.abs(diff) > 0.01) {
            console.warn(`[Auto-Heal] Customer ${customer.name} (${customerId}) discrepancy: Stored=${storedDue}, Expected=${expectedDue}, Diff=${diff}. Auto-healing...`);
            await CustomerDAO.update(customerId, { totalDue: expectedDue });
            
            // Sync with memory cache so UI updates immediately
            const cache = getCustomerCache();
            const cachedCust = (cache || []).find(c => c.id === customerId);
            if (cachedCust) {
                cachedCust.totalDue = expectedDue;
            }

            auditLog('AUTO_HEAL_BALANCE', 'Customer', customerId, customer.name, {
                storedDue,
                correctedDue: expectedDue,
                diff
            });
            return { healed: true, expectedDue, storedDue, diff };
        }
        return { healed: false, expectedDue, storedDue, diff: 0 };
    } catch (e) {
        console.error("Single customer balance reconciliation error:", e);
        return null;
    }
}


import Swal from 'sweetalert2';
import { CustomerDAO } from '../dao.js';
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

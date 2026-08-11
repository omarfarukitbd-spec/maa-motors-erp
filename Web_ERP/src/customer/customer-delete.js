import { db } from '../firebase-config.js';
import { CustomerDAO, TransactionDAO } from '../dao.js';
import { promptSecurityPin, showToast } from '../utils.js';
import Swal from 'sweetalert2';
import { auditLog } from '../audit.js';


export async function deleteCustomer(id, name) {
    const isPinValid = await promptSecurityPin("কাস্টমার ডিলেট (Master PIN)", "deleteCustomer");
    if (!isPinValid) return;

    const result = await Swal.fire({
        title: '<i class="fa-solid fa-triangle-exclamation text-red-500 mr-2"></i>সাবধান!',
        html: `<p class="text-xs text-slate-300 font-bn leading-relaxed mt-2 text-left">আপনি কি নিশ্চিত যে আপনি <strong>${name}</strong>-এর সম্পূর্ণ প্রোফাইল ডিলেট করতে চান?<br><br><span class="text-red-400 font-bold block bg-red-500/10 p-3 border border-red-500/20 rounded-xl"><i class="fa-solid fa-circle-exclamation mr-1.5"></i>কাস্টমার এবং তার সমস্ত লেনদেনের হিসেব চিরতরে মুছে যাবে। এটি আর কখনো রিকভার করা সম্ভব নয়।</span></p>`,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'হ্যাঁ, ডিলেট করুন',
        cancelButtonText: 'বাতিল',
        confirmButtonColor: '#dc2626',
        customClass: { popup: '!bg-slate-950 !text-white !rounded-3xl border border-red-500/30 font-bn', confirmButton: 'm3-btn-primary !bg-red-600 hover:!bg-red-500', cancelButton: 'm3-btn-tonal !bg-slate-800' }
    });

    if (result.isConfirmed) {
        try {
            const trns = await TransactionDAO.getByCustomer(id);
            await db.runTransaction(async (t) => {
                for (let trn of trns) t.delete(TransactionDAO.getRef(trn.id));
                t.delete(CustomerDAO.getRef(id));
            });
            auditLog('DELETE', 'Customers', id, name);
            showToast('কাস্টমার ডিলেট সম্পন্ন হয়েছে', 'success');
            if (window.renderCustomerTable) window.renderCustomerTable();
        } catch (e) {
            Swal.fire('এরর', 'ডাটাবেস এরর।', 'error');
            console.error(e);
        }
    }
}

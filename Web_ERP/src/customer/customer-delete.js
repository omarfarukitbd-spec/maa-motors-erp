import { db } from '../firebase-config.js';
import { CustomerDAO, TransactionDAO } from '../dao.js';
import { promptSecurityPin, showToast, handleError } from '../utils.js';
import Swal from 'sweetalert2';
import { auditLog } from '../audit.js';
import { cachedCustomers } from './customer-state.js';

export async function deleteCustomer(id, name) {
    if (window.AppState?.currentUserRole !== 'Admin') {
        return Swal.fire('অ্যাক্সেস ডিনাইড!', 'শুধুমাত্র অ্যাডমিন কাস্টমার ডিলেট করতে পারবেন।', 'error');
    }

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
            Swal.fire({ title: 'ডিলেট হচ্ছে...', allowOutsideClick: false, didOpen: () => Swal.showLoading() });
            const txns = await TransactionDAO.getByCustomer(id);
            const ops = [ (b) => b.delete(CustomerDAO.getRef(id)) ];
            txns.forEach(txn => ops.push((b) => b.delete(TransactionDAO.getRef(txn.id))));

            const CHUNK_SIZE = 400;
            for (let i = 0; i < ops.length; i += CHUNK_SIZE) {
                const batch = db.batch();
                ops.slice(i, i + CHUNK_SIZE).forEach(op => op(batch));
                await batch.commit();
            }

            const delCust = (cachedCustomers || []).find(c => c.id === id);
            auditLog('DELETE', 'Customers', id, name, { action: 'Full Customer Deletion' });
            if (delCust?.zone && window.appAdmin?.syncSingleZoneCounter) {
                window.appAdmin.syncSingleZoneCounter(delCust.zone).catch(e => console.warn(e));
            }
            showToast('কাস্টমার ডিলেট সম্পন্ন হয়েছে', 'success');
            Swal.fire('সফল!', 'কাস্টমার এবং তার সকল লেনদেন মুছে ফেলা হয়েছে।', 'success');
            if (window.loadCustomers) window.loadCustomers();
            if (window.renderCustomerTable) window.renderCustomerTable();
        } catch (e) {
            handleError(e, 'কাস্টমার মুছে ফেলা সম্ভব হয়নি');
        }
    }
}

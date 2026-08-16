import { db, firebase } from '../firebase-config.js';
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
        title: '<i class="fa-solid fa-triangle-exclamation text-amber-500 mr-2"></i>ডিলিট কনফার্মেশন',
        html: `<p class="text-xs text-slate-300 font-bn leading-relaxed mt-2 text-left">আপনি কি নিশ্চিত যে আপনি <strong>${name}</strong>-এর সম্পূর্ণ প্রোফাইল ডিলিট করতে চান?<br><br><span class="text-amber-400 font-bold block bg-amber-500/10 p-3 border border-amber-500/20 rounded-xl"><i class="fa-solid fa-info-circle mr-1.5"></i>কাস্টমার এবং তার সমস্ত লেনদেনের হিসেব ডিলিট হয়ে <b>রিসাইকেল বিনে</b> জমা হবে। আপনি চাইলে পরবর্তীতে রিস্টোর করতে পারবেন।</span></p>`,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'হ্যাঁ, ডিলিট করুন',
        cancelButtonText: 'বাতিল',
        confirmButtonColor: '#f59e0b',
        customClass: { popup: '!bg-slate-950 !text-white !rounded-3xl border border-amber-500/30 font-bn', confirmButton: 'm3-btn-primary !bg-amber-600 hover:!bg-amber-500', cancelButton: 'm3-btn-tonal !bg-slate-800' }
    });

    if (result.isConfirmed) {
        try {
            Swal.fire({ title: 'ডিলিট হচ্ছে...', allowOutsideClick: false, didOpen: () => Swal.showLoading() });
            
            const delCust = (cachedCustomers || []).find(c => c.id === id);
            const txns = await TransactionDAO.getByCustomer(id);
            const batchId = 'batch_' + Date.now();
            const deletedAt = firebase.firestore.FieldValue.serverTimestamp();
            const deletedBy = window.AppState?.currentUserEmail || 'Unknown';
            
            const ops = [];
            
            // 1. Move Customer to Recycle Bin
            ops.push((b) => b.set(db.collection('recycle_bin').doc(id), {
                module: 'Customer',
                batchId: batchId,
                data: delCust || { id, name },
                deletedAt,
                deletedBy
            }));
            ops.push((b) => b.delete(CustomerDAO.getRef(id)));
            
            // 2. Move Transactions to Recycle Bin
            txns.forEach(txn => {
                ops.push((b) => b.set(db.collection('recycle_bin').doc(txn.id), {
                    module: 'Transaction',
                    batchId: batchId,
                    data: txn,
                    deletedAt,
                    deletedBy
                }));
                ops.push((b) => b.delete(TransactionDAO.getRef(txn.id)));
            });

            const CHUNK_SIZE = 400;
            for (let i = 0; i < ops.length; i += CHUNK_SIZE) {
                const batch = db.batch();
                ops.slice(i, i + CHUNK_SIZE).forEach(op => op(batch));
                await batch.commit();
            }

            auditLog('DELETE', 'Customers', id, name, { action: 'Soft Delete Customer & Txns to Recycle Bin' });
            
            if (delCust?.zone && window.appAdmin?.syncSingleZoneCounter) {
                window.appAdmin.syncSingleZoneCounter(delCust.zone).catch(e => console.warn(e));
            }
            
            showToast('কাস্টমার রিসাইকেল বিনে মুভ করা হয়েছে', 'success');
            Swal.fire('সফল!', 'কাস্টমার এবং তার সকল লেনদেন রিসাইকেল বিনে জমা হয়েছে।', 'success');
            if (window.loadCustomers) window.loadCustomers();
            if (window.renderCustomerTable) window.renderCustomerTable();
        } catch (e) {
            handleError(e, 'কাস্টমার মুছে ফেলা সম্ভব হয়নি');
        }
    }
}

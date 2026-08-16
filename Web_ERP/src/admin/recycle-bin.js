import { db, firebase } from '../firebase-config.js';
import { CustomerDAO, TransactionDAO } from '../dao.js';
import { safeRound, formatAmountWithComma, promptSecurityPin, showToast, formatAppDate } from '../utils.js';
import Swal from 'sweetalert2';
import { auditLog } from '../audit.js';

let unsubscribeRecycleBin = null;

export function renderRecycleBin(container) {
    if (window.AppState?.currentUserRole !== 'Admin') {
        container.innerHTML = `<div class="p-8 text-center text-red-400 font-bn text-xl">অ্যাক্সেস ডিনাইড! শুধুমাত্র অ্যাডমিন এই পেজ দেখতে পারবেন।</div>`;
        return;
    }

    container.innerHTML = `
        <div class="max-w-5xl mx-auto pb-20">
            <!-- Header -->
            <div class="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
                <div>
                    <h2 class="text-xl md:text-2xl font-black text-white flex items-center gap-2">
                        <i class="fa-solid fa-trash-can text-red-500"></i> রিসাইকেল বিন
                    </h2>
                    <p class="text-xs text-slate-400 mt-1 font-bn">ডিলিট হওয়া কাস্টমার এবং ভাউচার এখানে জমা থাকে।</p>
                </div>
                <button class="h-9 px-4 rounded-xl bg-red-600/20 border border-red-500/30 hover:bg-red-600 text-red-400 hover:text-white text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5" onclick="appAdmin.emptyRecycleBin()">
                    <i class="fa-solid fa-dumpster-fire"></i> সম্পূর্ণ খালি করুন
                </button>
            </div>

            <div class="bg-slate-900/50 border border-slate-800/70 rounded-2xl overflow-hidden shadow-2xl">
                <div class="overflow-x-auto min-h-[400px]">
                    <table class="w-full text-left border-collapse whitespace-nowrap">
                        <thead class="bg-slate-950/80 border-b border-slate-800/80 text-[10px] font-black text-slate-400 uppercase tracking-wider sticky top-0 z-10">
                            <tr>
                                <th class="p-3 pl-4">আইটেম টাইপ</th>
                                <th class="p-3">বিস্তারিত তথ্য</th>
                                <th class="p-3">ডিলিট করেছেন</th>
                                <th class="p-3">ডিলিটের সময়</th>
                                <th class="p-3 pr-4 text-right">অ্যাকশন</th>
                            </tr>
                        </thead>
                        <tbody id="recycle-bin-table-body" class="divide-y divide-slate-800/50">
                            <tr><td colspan="5" class="p-10 text-center"><i class="fa-solid fa-spinner fa-spin text-blue-500 text-2xl"></i></td></tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    `;

    loadRecycleBinData();
}

function loadRecycleBinData() {
    const tbody = document.getElementById('recycle-bin-table-body');
    if (!tbody) return;

    if (unsubscribeRecycleBin) unsubscribeRecycleBin();

    unsubscribeRecycleBin = db.collection('recycle_bin')
        .orderBy('deletedAt', 'desc')
        .onSnapshot(snapshot => {
            if (snapshot.empty) {
                tbody.innerHTML = `<tr><td colspan="5" class="p-12 text-center text-slate-500 font-bn text-lg"><i class="fa-solid fa-box-open text-3xl mb-3 opacity-30 block"></i>রিসাইকেল বিন সম্পূর্ণ খালি।</td></tr>`;
                return;
            }

            // Group by batchId to group transactions belonging to a deleted customer
            let docs = [];
            let batchMap = {};

            snapshot.forEach(doc => {
                const data = doc.data();
                data.id = doc.id;
                
                if (data.batchId && data.module === 'Transaction') {
                    if (!batchMap[data.batchId]) batchMap[data.batchId] = { isCustomerBatch: false, txns: [] };
                    batchMap[data.batchId].txns.push(data);
                } else if (data.batchId && data.module === 'Customer') {
                    if (!batchMap[data.batchId]) batchMap[data.batchId] = { isCustomerBatch: true, txns: [] };
                    batchMap[data.batchId].customer = data;
                    batchMap[data.batchId].isCustomerBatch = true;
                } else {
                    docs.push(data);
                }
            });

            let viewItems = [...docs];
            Object.keys(batchMap).forEach(bId => {
                const b = batchMap[bId];
                if (b.isCustomerBatch && b.customer) {
                    b.customer.groupedTxnCount = b.txns.length;
                    viewItems.push(b.customer);
                } else {
                    b.txns.forEach(t => viewItems.push(t));
                }
            });

            viewItems.sort((a, b) => {
                const tA = a.deletedAt ? a.deletedAt.toMillis() : 0;
                const tB = b.deletedAt ? b.deletedAt.toMillis() : 0;
                return tB - tA;
            });

            tbody.innerHTML = viewItems.map(item => {
                const isCust = item.module === 'Customer';
                const icon = isCust ? '<i class="fa-solid fa-users text-blue-400"></i>' : '<i class="fa-solid fa-file-invoice text-emerald-400"></i>';
                const typeName = isCust ? 'কাস্টমার প্রোফাইল' : 'সিঙ্গেল ভাউচার';
                
                const dateStr = item.deletedAt ? new Date(item.deletedAt.toMillis()).toLocaleString('en-GB') : 'N/A';
                
                let detailsHtml = '';
                if (isCust) {
                    const c = item.data;
                    detailsHtml = `
                        <div class="font-bold text-white">${c.name || 'Unknown'} <span class="text-[10px] text-blue-400 ml-1">[${c.accountNo || ''}]</span></div>
                        <div class="text-[10px] text-slate-400 mt-0.5">বকেয়া: ৳${formatAmountWithComma(c.totalDue || 0)} | সাথে ডিলিট হওয়া ভাউচার: ${item.groupedTxnCount || 0} টি</div>
                    `;
                } else {
                    const t = item.data;
                    const vDate = t.date ? formatAppDate(t.date) : 'N/A';
                    detailsHtml = `
                        <div class="font-bold text-white">ভাউচার: ${t.voucherNo || '-'} <span class="text-[10px] text-emerald-400 ml-1">[${vDate}]</span></div>
                        <div class="text-[10px] text-slate-400 mt-0.5">কাস্টমার: ${t.customerName || '-'} | বিল: ৳${formatAmountWithComma(t.bill || 0)} | জমা: ৳${formatAmountWithComma(t.paid || 0)}</div>
                    `;
                }

                const strItem = encodeURIComponent(JSON.stringify(item));

                return `
                    <tr class="hover:bg-slate-800/30 transition-colors group">
                        <td class="p-3 pl-4">
                            <div class="flex items-center gap-2">
                                <div class="w-8 h-8 rounded-lg bg-slate-950 flex items-center justify-center border border-slate-800">${icon}</div>
                                <span class="font-bn text-xs font-bold text-slate-300">${typeName}</span>
                            </div>
                        </td>
                        <td class="p-3 font-bn text-xs">${detailsHtml}</td>
                        <td class="p-3 font-bn text-xs text-slate-400"><i class="fa-solid fa-user-xmark mr-1"></i>${item.deletedBy || 'System'}</td>
                        <td class="p-3 font-mono text-[10px] text-slate-500">${dateStr}</td>
                        <td class="p-3 pr-4 text-right">
                            <div class="flex items-center justify-end gap-2 opacity-100 md:opacity-0 group-hover:opacity-100 transition-opacity">
                                <button class="w-7 h-7 rounded-md bg-emerald-500/10 border border-emerald-500/20 hover:bg-emerald-600 text-emerald-400 hover:text-white transition-colors" onclick="appAdmin.restoreRecycleItem('${strItem}')" title="রিস্টোর করুন">
                                    <i class="fa-solid fa-clock-rotate-left text-[10px]"></i>
                                </button>
                                <button class="w-7 h-7 rounded-md bg-red-500/10 border border-red-500/20 hover:bg-red-600 text-red-400 hover:text-white transition-colors" onclick="appAdmin.deleteRecycleItemPermanently('${item.id}', '${item.batchId || ''}')" title="চিরতরে মুছুন">
                                    <i class="fa-solid fa-trash text-[10px]"></i>
                                </button>
                            </div>
                        </td>
                    </tr>
                `;
            }).join('');
        }, err => {
            console.error("Recycle bin listener error:", err);
            if (tbody) tbody.innerHTML = `<tr><td colspan="5" class="p-4 text-center text-red-400 text-xs">Error loading data</td></tr>`;
        });
}

export function unsubscribeRecycleBinData() {
    if (unsubscribeRecycleBin) unsubscribeRecycleBin();
}

export async function restoreRecycleItem(encodedItem) {
    const isPinValid = await promptSecurityPin("রিস্টোর কনফার্মেশন", "restoreRecycleItem");
    if (!isPinValid) return;

    try {
        const item = JSON.parse(decodeURIComponent(encodedItem));
        Swal.fire({ title: 'রিস্টোর হচ্ছে...', allowOutsideClick: false, didOpen: () => Swal.showLoading() });
        
        if (item.module === 'Transaction' && !item.batchId) {
            const batch = db.batch();
            const tData = item.data;
            const cid = tData.customerId;
            const b = Number(tData.bill) || 0;
            const p = Number(tData.paid) || 0;

            batch.set(TransactionDAO.getRef(item.id), tData);
            batch.update(CustomerDAO.getRef(cid), { totalDue: firebase.firestore.FieldValue.increment(safeRound(b - p)) });
            batch.delete(db.collection('recycle_bin').doc(item.id));
            
            await batch.commit();
            auditLog('RESTORE', 'Ledger', item.id, tData.customerName, { action: 'Restored Transaction' });
            
        } else if (item.module === 'Customer') {
            const batchId = item.batchId;
            const batch = db.batch();
            
            batch.set(CustomerDAO.getRef(item.id), item.data);
            batch.delete(db.collection('recycle_bin').doc(item.id));
            
            const txnsSnap = await db.collection('recycle_bin').where('batchId', '==', batchId).where('module', '==', 'Transaction').get();
            txnsSnap.forEach(doc => {
                const tItem = doc.data();
                batch.set(TransactionDAO.getRef(doc.id), tItem.data);
                batch.delete(doc.ref);
            });
            
            await batch.commit();
            auditLog('RESTORE', 'Customers', item.id, item.data.name, { action: 'Restored Customer and ' + txnsSnap.size + ' Txns' });
        }

        Swal.fire('সফল!', 'সফলভাবে রিস্টোর করা হয়েছে।', 'success');
    } catch (e) {
        console.error("Restore error:", e);
        Swal.fire('Error', 'রিস্টোর করতে সমস্যা হয়েছে: ' + e.message, 'error');
    }
}

export async function deleteRecycleItemPermanently(docId, batchId) {
    const isPinValid = await promptSecurityPin("স্থায়ীভাবে ডিলিট", "deletePermanently");
    if (!isPinValid) return;

    try {
        Swal.fire({ title: 'মুছে ফেলা হচ্ছে...', allowOutsideClick: false, didOpen: () => Swal.showLoading() });
        const batch = db.batch();
        batch.delete(db.collection('recycle_bin').doc(docId));
        
        if (batchId && batchId !== 'undefined' && batchId !== 'null') {
            const txnsSnap = await db.collection('recycle_bin').where('batchId', '==', batchId).where('module', '==', 'Transaction').get();
            txnsSnap.forEach(d => batch.delete(d.ref));
        }

        await batch.commit();
        Swal.fire('সফল!', 'চিরতরে মুছে ফেলা হয়েছে।', 'success');
    } catch (e) {
        console.error("Permanent delete error:", e);
        Swal.fire('Error', 'সমস্যা হয়েছে: ' + e.message, 'error');
    }
}

export async function emptyRecycleBin() {
    const isPinValid = await promptSecurityPin("রিসাইকেল বিন সম্পূর্ণ খালি", "emptyRecycleBin");
    if (!isPinValid) return;

    const confirmWipe = await Swal.fire({
        title: 'ওয়ার্নিং!',
        text: 'রিসাইকেল বিনের সব ডাটা চিরতরে মুছে যাবে। আপনি কি নিশ্চিত?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#dc2626',
        confirmButtonText: 'হ্যাঁ, সব মুছুন',
        cancelButtonText: 'বাতিল',
        customClass: { popup: '!bg-slate-950 !text-white !rounded-3xl border border-red-500/30 font-bn' }
    });

    if (!confirmWipe.isConfirmed) return;

    try {
        Swal.fire({ title: 'মুছে ফেলা হচ্ছে...', allowOutsideClick: false, didOpen: () => Swal.showLoading() });
        const snap = await db.collection('recycle_bin').get();
        if (snap.empty) {
            return Swal.fire('সফল!', 'রিসাইকেল বিন আগে থেকেই খালি।', 'info');
        }

        let wipeBatch = db.batch();
        let wipeCount = 0;
        for (const doc of snap.docs) {
            wipeBatch.delete(doc.ref);
            wipeCount++;
            if (wipeCount >= 400) {
                await wipeBatch.commit();
                wipeBatch = db.batch();
                wipeCount = 0;
            }
        }
        if (wipeCount > 0) {
            await wipeBatch.commit();
        }

        auditLog('EMPTY_TRASH', 'System', 'RecycleBin', `Emptied ${snap.size} items`);
        Swal.fire('সফল!', 'রিসাইকেল বিন সম্পূর্ণ খালি করা হয়েছে।', 'success');
    } catch (e) {
        console.error("Empty trash error:", e);
        Swal.fire('Error', 'সমস্যা হয়েছে: ' + e.message, 'error');
    }
}

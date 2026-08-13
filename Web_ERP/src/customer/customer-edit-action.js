import { db, firebase } from '../firebase-config.js';
import { CustomerDAO, TransactionDAO, SettingsDAO, ZoneDAO } from '../dao.js';
import { parseAmount, toDBDate, getTodayLocalDateString, promptSecurityPin, numberToBanglaWords, formatAmountWithComma, handleError } from '../utils.js';
import Swal from 'sweetalert2';
import { auditLog } from '../audit.js';
import { cachedZones, cachedCustomers } from './customer-state.js';

export async function editCustomer(id, name, phone, address, currentZone) {
    if (window.AppState.currentUserRole !== 'Admin') {
        return Swal.fire('অ্যাক্সেস ডিনাইড!', 'শুধুমাত্র অ্যাডমিন কাস্টমার তথ্য এডিট করতে পারবেন।', 'error');
    }

    // ✅ Offline Guard — editing requires server transaction
    if (!navigator.onLine) {
        return Swal.fire({
            title: '<i class="fa-solid fa-wifi text-red-400 mr-2"></i>অফলাইন!',
            html: '<p class="font-bn text-slate-300 text-sm">ইন্টারনেট সংযোগ নেই।<br><strong class="text-red-400">অফলাইনে কাস্টমার এডিট করা যাবে না।</strong><br><span class="text-xs text-slate-400 mt-1 block">অনুগ্রহ করে ইন্টারনেট চালু করে আবার চেষ্টা করুন।</span></p>',
            icon: 'error',
            confirmButtonText: 'ঠিক আছে',
            customClass: { popup: '!bg-slate-950 !text-white !rounded-3xl border border-red-500/30 font-bn', confirmButton: 'm3-btn-primary !bg-red-600 hover:!bg-red-500 !px-6 !py-2 !rounded-xl font-bold' }
        });
    }

    const isPinValid = await promptSecurityPin("কাস্টমার তথ্য এডিট (Authorization)");
    if (!isPinValid) return;

    const customer = cachedCustomers.find(c => c.id === id);
    const currentInitialDue = customer ? (customer.initialDue || 0) : 0;
    const currentOpeningDate = customer?.openingDate || (customer?.createdAt ? customer.createdAt.toDate().toISOString().split('T')[0] : getTodayLocalDateString());

    let zoneOpts = '<option value="">-- জোন সিলেক্ট --</option>';
    cachedZones.forEach(z => {
        const zName = typeof z === 'string' ? z : z.name;
        zoneOpts += `<option value="${zName}" ${zName === currentZone ? 'selected' : ''}>${zName}</option>`;
    });

    const { value: f } = await Swal.fire({
        title: '<i class="fa-solid fa-user-pen text-blue-400 mr-2"></i>কাস্টমার তথ্য এডিট করুন',
        html: `
            <div class="space-y-4 text-left p-1 font-bn">
                <div class="grid grid-cols-2 gap-4">
                    <div><label class="block text-[11px] font-black text-blue-400 uppercase mb-1 ml-1">হিসাব খোলার তারিখ *</label><input id="ed-d" class="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-white outline-none focus:border-blue-500 text-sm datepicker" value="${currentOpeningDate}"></div>
                    <div><label class="block text-[11px] font-black text-blue-400 uppercase mb-1 ml-1">কাস্টমারের নাম *</label><input id="ed-n" class="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-white outline-none focus:border-blue-500 text-sm" value="${name}"></div>
                </div>
                <div><label class="block text-[11px] font-black text-blue-400 uppercase mb-1 ml-1">মোবাইল নম্বর *</label><input id="ed-p" class="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-white outline-none focus:border-blue-500 text-sm" value="${phone}"></div>
                <div><label class="block text-[11px] font-black text-blue-400 uppercase mb-1 ml-1">ঠিকানা (ঐচ্ছিক)</label><input id="ed-a" class="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-white outline-none focus:border-blue-500 text-sm" value="${address}"></div>
                <div class="grid grid-cols-2 gap-4">
                    <div><label class="block text-[11px] font-black text-purple-400 uppercase mb-1 ml-1">জোন / অঞ্চল</label><select id="ed-z" class="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-white outline-none focus:border-blue-500 text-sm">${zoneOpts}</select></div>
                    <div><label class="block text-[11px] font-black text-amber-400 uppercase mb-1 ml-1">অ্যাকাউন্ট নং (A/C No)</label><input id="ed-acc" class="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-amber-400 font-mono font-bold outline-none focus:border-amber-500 text-sm" value="${customer?.accountNo || ''}"></div>
                </div>
                <div>
                    <label class="block text-[11px] font-black text-emerald-500 uppercase mb-1 ml-1">Opening Balance</label>
                    <input id="ed-ib" class="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-emerald-400 font-bold outline-none focus:border-emerald-500 text-sm" value="${formatAmountWithComma(currentInitialDue)}" oninput="window.handleNumberInput(this); window.updateLiveWords(this, 'ed-ib-words');">
                    <div id="ed-ib-words" class="text-[11px] font-black text-emerald-400 mt-1.5 px-2 py-0.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 italic font-bn inline-block${currentInitialDue ? '' : ' hidden'}">${currentInitialDue ? '(' + numberToBanglaWords(currentInitialDue) + ')' : ''}</div>
                </div>
            </div>
        `,
        showCancelButton: true, confirmButtonText: 'আপডেট করুন', cancelButtonText: 'বাতিল',
        customClass: { popup: '!bg-slate-900 !text-white !rounded-3xl border border-slate-700' },
        didOpen: () => {
            const zSel = document.getElementById('ed-z');
            const accInp = document.getElementById('ed-acc');
            if (zSel && accInp) {
                zSel.addEventListener('change', async () => {
                    const selZone = zSel.value;
                    if (!selZone) return;
                    try {
                        const allZones = await ZoneDAO.getAllZones();
                        const zObj = allZones.find(z => z.name === selZone);
                        const code = zObj ? (zObj.code || '') : '';
                        const serial = await SettingsDAO.peekNextAccountNo(selZone);
                        accInp.value = code + serial;
                    } catch (e) { console.error(e); }
                });
            }
        },
        preConfirm: () => {
            const d = toDBDate(document.getElementById('ed-d').value);
            const n = document.getElementById('ed-n').value.trim();
            const p = document.getElementById('ed-p').value.trim();
            const a = document.getElementById('ed-a').value.trim();
            const z = document.getElementById('ed-z').value;
            const accNo = document.getElementById('ed-acc').value.trim();
            const ib = safeRound(parseAmount(document.getElementById('ed-ib').value));
            if (!n || !p) return Swal.showValidationMessage('নাম ও মোবাইল নম্বর আবশ্যক!');
            return { d, n, p, a, z, accNo, ib };
        }
    });

    if (f) {
        const words = numberToBanglaWords(f.ib);
        const confirmPreview = await Swal.fire({
            title: '<i class="fa-solid fa-magnifying-glass text-amber-400 mr-2"></i>সংশোধন যাচাই করুন',
            html: `<div class="text-left space-y-3 font-bn p-2 bg-slate-900 rounded-2xl border border-slate-800">
                    <div class="grid grid-cols-2 gap-4 border-b border-slate-800 pb-2">
                        <div class="flex flex-col gap-1"><span class="text-[10px] text-blue-400 font-black uppercase">নতুন নাম</span><span class="text-base text-white font-black">${f.n}</span></div>
                        <div class="flex flex-col gap-1"><span class="text-[10px] text-amber-500 font-black uppercase">অ্যাকাউন্ট নং</span><span class="text-base text-amber-400 font-black font-mono">${f.accNo || '-'}</span></div>
                    </div>
                    <div class="grid grid-cols-2 gap-4 border-b border-slate-800 pb-2">
                        <div class="flex flex-col gap-1"><span class="text-[10px] text-blue-400 font-black uppercase">মোবাইল</span><span class="text-sm text-slate-200 font-bold">${f.p}</span></div>
                        <div class="flex flex-col gap-1"><span class="text-[10px] text-purple-400 font-black uppercase">জোন</span><span class="text-sm text-slate-200 font-bold">${f.z}</span></div>
                    </div>
                    <div class="flex flex-col gap-1 border-b border-slate-800 pb-2">
                        <span class="text-[10px] text-sky-400 font-black uppercase flex items-center gap-1"><i class="fa-solid fa-location-dot text-amber-400 text-xs"></i>ঠিকানা (Address)</span>
                        <span class="text-xs text-slate-200 font-medium">${f.a || 'N/A'}</span>
                    </div>
                    <div class="flex flex-col gap-1 pt-1">
                        <span class="text-[10px] text-emerald-400 font-black uppercase">সংশোধিত Opening Balance</span>
                        <span class="text-2xl text-emerald-400 font-black">৳ ${formatAmountWithComma(f.ib)}</span>
                        ${words ? `<div class="text-[11px] text-emerald-500 font-black italic bg-emerald-500/10 px-2 py-1 rounded-lg border border-emerald-500/20 mt-1">(${words})</div>` : ''}
                    </div>
                </div>
                <p class="text-[11px] text-amber-500 font-bold mt-4 text-center">তথ্যগুলো কি আপডেট করবেন?</p>`,
        showCancelButton: true, confirmButtonText: '<i class="fa-solid fa-circle-check mr-2"></i>হ্যাঁ, আপডেট করুন', cancelButtonText: '<i class="fa-solid fa-pen-to-square mr-2"></i>না, ঠিক করব',
        customClass: { popup: '!bg-slate-950 !text-white !rounded-3xl border border-slate-800 shadow-2xl font-bn', confirmButton: 'm3-btn-primary !bg-blue-600 hover:!bg-blue-500 !px-7 !py-2.5 !rounded-xl font-bold shadow-lg shadow-blue-600/30', cancelButton: 'm3-btn-tonal !bg-slate-800 hover:!bg-slate-700 !text-slate-300 !px-5 !py-2.5 !rounded-xl font-bold border border-slate-700' }
    });

        if (!confirmPreview.isConfirmed) return;

        try {
            Swal.fire({ title: 'আপডেট হচ্ছে...', allowOutsideClick: false, didOpen: () => Swal.showLoading() });

            const balanceDiff = safeRound(f.ib - currentInitialDue);
            const custRef = CustomerDAO.getRef(id);
            const txns = await TransactionDAO.getByCustomer(id);

            const updatePayload = {
                name: f.n, phone: f.p, address: f.a, zone: f.z || '',
                accountNo: f.accNo || '',
                openingDate: f.d, initialDue: f.ib,
                totalDue: firebase.firestore.FieldValue.increment(balanceDiff),
                updatedAt: firebase.firestore.FieldValue.serverTimestamp()
            };

            const ops = [ (b) => b.update(custRef, updatePayload) ];

            txns.forEach(txn => {
                const updateData = { customerName: f.n };
                if (txn.voucherNo === 'OPENING') {
                    updateData.date = f.d;
                    updateData.bill = f.ib > 0 ? f.ib : 0;
                    updateData.paid = f.ib < 0 ? Math.abs(f.ib) : 0;
                    updateData.currentDue = f.ib;
                }
                ops.push((b) => b.update(TransactionDAO.getRef(txn.id), updateData));
            });

            // Commit in chunks of 400 to observe Firestore batch limit (max 500)
            const CHUNK_SIZE = 400;
            for (let i = 0; i < ops.length; i += CHUNK_SIZE) {
                const batch = db.batch();
                ops.slice(i, i + CHUNK_SIZE).forEach(op => op(batch));
                await batch.commit();
            }

            auditLog('UPDATE', 'Customers', id, f.n, { old: { name, phone, address, zone: currentZone, initialDue: currentInitialDue, openingDate: currentOpeningDate }, new: f });
            Swal.fire('সফল!', `কাস্টমার তথ্য ও একাউন্ট নম্বর (${f.accNo}) সফলভাবে আপডেট হয়েছে।`, 'success');
            if (window.loadCustomers) window.loadCustomers();
        } catch (e) {
            handleError(e, 'কাস্টমার তথ্য আপডেট করা যায়নি');
        }
    }
}

export async function deleteCustomer(id, name) {
    if (window.AppState.currentUserRole !== 'Admin') {
        return Swal.fire('অ্যাক্সেস ডিনাইড!', 'শুধুমাত্র অ্যাডমিন কাস্টমার ডিলেট করতে পারবেন।', 'error');
    }

    const confirm = await Swal.fire({
        title: '<i class="fa-solid fa-triangle-exclamation text-red-400 mr-2"></i>কাস্টমার ডিলেট?',
        text: `আপনি কি নিশ্চিত যে "${name}" এবং তার সকল লেনদেন ডাটাবেস থেকে মুছে ফেলতে চান? এটি আর ফিরিয়ে আনা সম্ভব নয়!`,
        icon: 'warning', showCancelButton: true, confirmButtonText: 'হ্যাঁ, ডিলেট করুন', cancelButtonText: 'বাতিল', confirmButtonColor: '#dc2626',
        customClass: { popup: '!bg-slate-900 !text-white !rounded-3xl border border-slate-700' }
    });

    if (confirm.isConfirmed) {
        const isPinValid = await promptSecurityPin("কাস্টমার ডিলেট (Permanent Delete)");
        if (!isPinValid) return;

        try {
            const txns = await TransactionDAO.getByCustomer(id);
            const ops = [ (b) => b.delete(CustomerDAO.getRef(id)) ];
            txns.forEach(txn => ops.push((b) => b.delete(TransactionDAO.getRef(txn.id))));

            const CHUNK_SIZE = 400;
            for (let i = 0; i < ops.length; i += CHUNK_SIZE) {
                const batch = db.batch();
                ops.slice(i, i + CHUNK_SIZE).forEach(op => op(batch));
                await batch.commit();
            }

            const delCust = cachedCustomers.find(c => c.id === id);
            auditLog('DELETE', 'Customers', id, name, { action: 'Full Customer Deletion' });
            if (delCust?.zone && window.appAdmin?.syncSingleZoneCounter) window.appAdmin.syncSingleZoneCounter(delCust.zone).catch(e => console.warn(e));
            Swal.fire('সফল!', 'কাস্টমার এবং তার সকল লেনদেন মুছে ফেলা হয়েছে।', 'success');
            if (window.loadCustomers) window.loadCustomers();
        } catch (e) { handleError(e, 'কাস্টমার মুছে ফেলা সম্ভব হয়নি'); }
    }
}

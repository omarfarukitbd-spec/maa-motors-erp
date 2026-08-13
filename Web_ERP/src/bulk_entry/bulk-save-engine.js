import Swal from 'sweetalert2';
import { db, firebase } from '../firebase-config.js';
import { CustomerDAO, TransactionDAO, SettingsDAO } from '../dao.js';
import { parseAmount, formatAmountWithComma, formatAppDate, safeRound, toDBDate } from '../utils.js';
import { getCustomerCache } from '../customer/index.js';
import { auditLog } from '../audit.js';

/**
 * Core Bulk Save Engine
 * Handles mapping, ID generation, and transactional batch commits with 100% Khatiyan parity.
 */
export async function executeBulkSave(rawDataToSave, isExcel = false) {
    try {
        const dataToSave = rawDataToSave.filter(item => item && item.name && item.name.trim() !== '').map(item => ({
            date: item.date || new Date().toISOString().split('T')[0],
            name: item.name.trim(),
            phone: item.phone ? String(item.phone).trim() : '',
            voucher: item.voucher ? String(item.voucher).trim() : '',
            bill: parseAmount(item.bill) || 0,
            paid: parseAmount(item.paid) || 0,
            receivedType: item.receivedType || 'Bank',
            receivedFrom: item.receivedFrom || ''
        })).filter(item => item.bill > 0 || item.paid > 0);

        if (dataToSave.length === 0) {
            return Swal.fire({ title: 'ভ্যালিড ডাটা নেই!', icon: 'warning', customClass: { popup: '!bg-slate-900 !text-white' } });
        }

        let totalBill = 0, totalPaid = 0;
        const rowsHtml = dataToSave.map(item => {
            totalBill = safeRound(totalBill + item.bill);
            totalPaid = safeRound(totalPaid + item.paid);
            return `
                <div class="p-2.5 bg-slate-950/50 border border-slate-800/80 rounded-xl text-left">
                    <div class="flex justify-between items-center mb-1">
                        <span class="text-sm font-black text-white">${item.name}</span>
                        <span class="text-[10px] font-bold text-amber-400 bg-amber-400/10 px-1.5 py-0.5 rounded border border-amber-400/20">ভাউচার: ${item.voucher || '-'}</span>
                    </div>
                    <div class="flex justify-between items-center text-xs">
                        <span class="text-slate-400 font-bold">${formatAppDate(item.date)}</span>
                        <div class="flex gap-4">
                            <span class="text-blue-400 font-mono font-bold">বিল: ৳ ${formatAmountWithComma(item.bill)}</span>
                            <span class="text-emerald-400 font-mono font-bold">জমা: ৳ ${formatAmountWithComma(item.paid)} ${item.paid > 0 ? `<span class="text-purple-400 font-bn tracking-wider ml-1 px-1.5 py-0.5 bg-purple-500/10 rounded-md border border-purple-500/20 text-[10px] uppercase">${item.receivedType}${item.receivedFrom ? ' - ' + item.receivedFrom : ''}</span>` : ''}</span>
                        </div>
                    </div>
                </div>
            `;
        }).join('');

        const confirmPreview = await Swal.fire({
            title: '<div class="flex items-center justify-center gap-2 font-bn font-black text-xl text-white"><i class="fa-solid fa-file-shield text-blue-400"></i><span>ফাস্ট এন্ট্রি যাচাই করুন</span></div>',
            html: `
                <div class="text-left space-y-3 font-bn p-3.5 bg-slate-900/90 rounded-2xl border border-slate-800 shadow-inner">
                    <div class="grid grid-cols-3 gap-4 border-b border-slate-800/80 pb-3">
                        <div class="flex flex-col gap-1 text-center bg-slate-950 p-2 rounded-xl border border-slate-800"><span class="text-[10px] text-slate-400 font-black uppercase tracking-wider">মোট এন্ট্রি</span><span class="text-lg text-white font-black">${dataToSave.length}</span></div>
                        <div class="flex flex-col gap-1 text-center bg-blue-950/30 p-2 rounded-xl border border-blue-900/30"><span class="text-[10px] text-blue-400 font-black uppercase tracking-wider">মোট বিল</span><span class="text-lg text-blue-400 font-black font-mono">৳ ${formatAmountWithComma(totalBill)}</span></div>
                        <div class="flex flex-col gap-1 text-center bg-emerald-950/30 p-2 rounded-xl border border-emerald-900/30"><span class="text-[10px] text-emerald-400 font-black uppercase tracking-wider">মোট জমা</span><span class="text-lg text-emerald-400 font-black font-mono">৳ ${formatAmountWithComma(totalPaid)}</span></div>
                    </div>
                    <div class="max-h-[350px] overflow-y-auto custom-scrollbar pr-2 mt-3 space-y-2">
                        ${rowsHtml}
                    </div>
                </div>
                <p class="text-xs text-amber-400 font-bold mt-3 text-center">সব তথ্য সঠিক থাকলে "কনফার্ম ও সেভ করুন" বাটনে ক্লিক করুন।</p>
            `,
            showCancelButton: true,
            confirmButtonText: '<i class="fa-solid fa-cloud-arrow-up mr-2"></i>কনফার্ম ও সেভ করুন',
            cancelButtonText: '<i class="fa-solid fa-pen-to-square mr-2"></i>সংশোধন করব',
            width: '700px',
            customClass: {
                popup: '!bg-slate-950 !text-white !rounded-3xl border border-slate-800 shadow-2xl font-bn',
                confirmButton: 'm3-btn-primary !bg-blue-600 hover:!bg-blue-500 !px-7 !py-2.5 !rounded-xl font-bold shadow-lg shadow-blue-600/30',
                cancelButton: 'm3-btn-tonal !bg-slate-800 hover:!bg-slate-700 !text-slate-300 !px-5 !py-2.5 !rounded-xl font-bold border border-slate-700'
            }
        });

        if (!confirmPreview.isConfirmed) {
            return; // Cancelled
        }

        Swal.fire({
            title: 'সেভ হচ্ছে...',
            text: `${dataToSave.length} টি এন্ট্রি প্রসেস করা হচ্ছে।`,
            allowOutsideClick: false,
            didOpen: () => { Swal.showLoading(); },
            customClass: { popup: '!bg-slate-900 !text-white !rounded-3xl border border-slate-700 font-bn' }
        });

        let cachedCustomers = getCustomerCache();
        if (!cachedCustomers.length) cachedCustomers = await CustomerDAO.getAll();

        const customersMap = {};
        const customersMapByAccNo = {};
        cachedCustomers.forEach(c => {
            if (c.name) customersMap[c.name.trim().toLowerCase()] = { id: c.id, totalDue: Number(c.totalDue) || 0, accountNo: c.accountNo || '', isNew: false };
            if (c.accountNo) customersMapByAccNo[String(c.accountNo).toLowerCase()] = { id: c.id, totalDue: Number(c.totalDue) || 0, accountNo: c.accountNo || '', isNew: false };
        });

        // Calculate how many new customers will be created to allocate account numbers atomically
        let newCustCount = 0;
        const tempMap = { ...customersMap };
        dataToSave.forEach(item => {
            const nameKey = item.name.trim().toLowerCase();
            const accMatch = item.name.match(/^\[(\d+)\]/);
            const accNo = accMatch ? accMatch[1].toLowerCase() : null;
            const strippedName = item.name.replace(/^\[\d+\]\s*/, '').replace(/\s*\(.*\)$/, '').trim().toLowerCase();

            const exists = (accNo && customersMapByAccNo[accNo]) || tempMap[strippedName] || tempMap[nameKey];
            if (!exists) {
                tempMap[nameKey] = true;
                newCustCount++;
            }
        });

        const counterRef = SettingsDAO.collection.doc('counters');
        let currentAllocatedAccountNo = 0;

        if (newCustCount > 0) {
            if (!navigator.onLine) {
                return Swal.fire({ title: 'অফলাইন সতর্কবার্তা', text: 'নতুন কাস্টমার তৈরিতে অ্যাকাউন্ট নম্বর নিশ্চিত করতে ইন্টারনেট সংযোগ প্রয়োজন।', icon: 'error' });
            }
            await db.runTransaction(async (t) => {
                const counterDoc = await t.get(counterRef);
                const currentCounter = (counterDoc.exists && counterDoc.data().customerAccountNo) ? parseInt(counterDoc.data().customerAccountNo) : 0;
                currentAllocatedAccountNo = currentCounter;
                t.set(counterRef, { customerAccountNo: currentCounter + newCustCount }, { merge: true });
            });
        }

        let batch = db.batch();
        let opCount = 0;
        const customerDeltas = {};
        const newCustomerDocs = {};

        for (const item of dataToSave) {
            const nameKey = item.name.trim().toLowerCase();
            let customerId = '';
            let resolvedKey = nameKey;

            const accMatch = item.name.match(/^\[(\d+)\]/);
            if (accMatch) {
                const accNo = accMatch[1].toLowerCase();
                if (customersMapByAccNo[accNo]) {
                    customerId = customersMapByAccNo[accNo].id;
                    resolvedKey = Object.keys(customersMap).find(k => customersMap[k].id === customerId) || nameKey;
                }
            }

            if (!customerId) {
                const strippedName = item.name.replace(/^\[\d+\]\s*/, '').replace(/\s*\(.*\)$/, '').trim().toLowerCase();
                if (customersMap[strippedName]) {
                    customerId = customersMap[strippedName].id;
                    resolvedKey = strippedName;
                } else if (customersMap[nameKey]) {
                    customerId = customersMap[nameKey].id;
                } else {
                    const newCustRef = CustomerDAO.getRef();
                    customerId = newCustRef.id;
                    currentAllocatedAccountNo++;
                    const accNoStr = String(currentAllocatedAccountNo).padStart(4, '0');
                    customersMap[nameKey] = { id: customerId, totalDue: 0, accountNo: accNoStr, isNew: true, phone: item.phone || '', name: item.name.replace(/^\[\d+\]\s*/, '').replace(/\s*\(.*\)$/, '').trim() };
                    resolvedKey = nameKey;
                }
            }

            const prevDue = safeRound(customersMap[resolvedKey]?.totalDue || 0);
            const changeInDue = safeRound(item.bill - item.paid);
            const currentDue = safeRound(prevDue + changeInDue);
            if (customersMap[resolvedKey]) customersMap[resolvedKey].totalDue = currentDue;

            const cleanName = customersMap[resolvedKey]?.name || item.name.replace(/^\[\d+\]\s*/, '').replace(/\s*\(.*\)$/, '').trim();

            const txnRef = TransactionDAO.getRef();
            batch.set(txnRef, {
                customerId, customerName: cleanName, date: toDBDate(item.date), voucherNo: item.voucher || '',
                bill: safeRound(item.bill), paid: safeRound(item.paid),
                receivedType: item.paid > 0 ? (item.receivedType || 'Bank') : '',
                receivedFrom: item.paid > 0 ? (item.receivedFrom || '') : '',
                prevDue, currentDue,
                createdBy: window.AppState?.currentUserEmail || 'Unknown',
                createdAt: firebase.firestore.FieldValue.serverTimestamp()
            });
            opCount++;

            if (customersMap[resolvedKey]?.isNew) {
                newCustomerDocs[customerId] = {
                    name: cleanName, phone: customersMap[resolvedKey].phone || '',
                    address: 'Bulk Import', accountNo: customersMap[resolvedKey].accountNo,
                    totalDue: currentDue, initialDue: 0,
                    createdAt: firebase.firestore.FieldValue.serverTimestamp()
                };
                customersMap[resolvedKey].isNew = false;
            } else {
                customerDeltas[customerId] = safeRound((customerDeltas[customerId] || 0) + changeInDue);
            }

            if (opCount >= 300) {
                for (const [cId, delta] of Object.entries(customerDeltas)) {
                    if (delta !== 0) {
                        batch.update(CustomerDAO.getRef(cId), { totalDue: firebase.firestore.FieldValue.increment(delta) });
                    }
                }
                for (const [cId, docData] of Object.entries(newCustomerDocs)) {
                    batch.set(CustomerDAO.getRef(cId), docData);
                }
                await batch.commit();
                batch = db.batch();
                opCount = 0;
                for (const k in customerDeltas) delete customerDeltas[k];
                for (const k in newCustomerDocs) delete newCustomerDocs[k];
            }
        }

        for (const [cId, delta] of Object.entries(customerDeltas)) {
            if (delta !== 0) {
                batch.update(CustomerDAO.getRef(cId), { totalDue: firebase.firestore.FieldValue.increment(delta) });
                opCount++;
            }
        }
        for (const [cId, docData] of Object.entries(newCustomerDocs)) {
            batch.set(CustomerDAO.getRef(cId), docData);
            opCount++;
        }

        if (opCount > 0) await batch.commit();

        Swal.fire({ title: 'সফল!', text: `সফলভাবে ${dataToSave.length} টি ডাটা সেভ হয়েছে!`, icon: 'success' });

        if(isExcel) {
            const input = document.getElementById('excel-file');
            if(input) input.value = '';
            const btn = document.getElementById('process-excel-btn');
            if(btn) { btn.disabled = false; btn.innerHTML = '<i class="fa-solid fa-upload"></i> ফাইল আপলোড ও সেভ করুন'; }
        } else {
            if (typeof window.switchBulkTab === 'function') window.switchBulkTab('spreadsheet');
        }

    } catch (error) {
        console.error('Bulk save error:', error);
        Swal.fire('Error!', 'ডাটা সেভ করতে সমস্যা হয়েছে। দয়া করে আবার চেষ্টা করুন।', 'error');
    } finally {
        if (isExcel) {
            const btn = document.getElementById('process-excel-btn');
            if(btn) { btn.disabled = false; btn.innerHTML = '<i class="fa-solid fa-upload"></i> ফাইল আপলোড ও সেভ করুন'; }
        }
    }
}

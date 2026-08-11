import Swal from 'sweetalert2';
import { db, firebase } from '../firebase-config.js';
import { CustomerDAO, TransactionDAO, SettingsDAO } from '../dao.js';
import { parseAmount } from '../utils.js';
import { getCustomerCache } from '../customer/index.js';
import { auditLog } from '../audit.js';

/**
 * Core Bulk Save Engine
 * Handles mapping, ID generation, and transactional batch commits.
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

        Swal.fire({
            title: 'সেভ হচ্ছে...',
            text: `${dataToSave.length} টি এন্ট্রি প্রসেস করা হচ্ছে।`,
            allowOutsideClick: false,
            didOpen: () => { Swal.showLoading(); },
            customClass: { popup: '!bg-slate-900 !text-white !rounded-3xl border border-slate-700' }
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
            await db.runTransaction(async (t) => {
                const counterDoc = await t.get(counterRef);
                const currentCounter = (counterDoc.exists && counterDoc.data().customerAccountNo) ? parseInt(counterDoc.data().customerAccountNo) : 0;
                currentAllocatedAccountNo = currentCounter;
                t.set(counterRef, { customerAccountNo: currentCounter + newCustCount }, { merge: true });
            });
        }

        let batch = db.batch();
        let opCount = 0;

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

            const prevDue = customersMap[resolvedKey]?.totalDue || 0;
            const changeInDue = item.bill - item.paid;
            const currentDue = prevDue + changeInDue;
            if(customersMap[resolvedKey]) customersMap[resolvedKey].totalDue = currentDue;

            const cleanName = customersMap[resolvedKey]?.name || item.name.replace(/^\[\d+\]\s*/, '').replace(/\s*\(.*\)$/, '').trim();

            const txnRef = TransactionDAO.getRef();
            batch.set(txnRef, {
                customerId, customerName: cleanName, date: item.date, voucherNo: item.voucher,
                bill: item.bill, paid: item.paid,
                receivedType: item.paid > 0 ? (item.receivedType || 'Bank') : '',
                receivedFrom: item.paid > 0 ? (item.receivedFrom || '') : '',
                prevDue, currentDue,
                createdBy: window.AppState?.currentUserEmail || 'Unknown',
                createdAt: firebase.firestore.FieldValue.serverTimestamp()
            });
            opCount++;

            const custRef = CustomerDAO.getRef(customerId);
            if (customersMap[resolvedKey]?.isNew) {
                batch.set(custRef, {
                    name: cleanName, phone: customersMap[resolvedKey].phone || '',
                    address: 'Bulk Import', accountNo: customersMap[resolvedKey].accountNo,
                    totalDue: currentDue, initialDue: 0,
                    createdAt: firebase.firestore.FieldValue.serverTimestamp()
                });
                auditLog('CREATE', 'Customers', customerId, cleanName, { source: 'Bulk Entry' });
                customersMap[resolvedKey].isNew = false;
                opCount++;
            } else {
                batch.update(custRef, { totalDue: firebase.firestore.FieldValue.increment(changeInDue) });
                opCount++;
            }

            if (opCount >= 400) {
                await batch.commit();
                batch = db.batch(); opCount = 0;
            }
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

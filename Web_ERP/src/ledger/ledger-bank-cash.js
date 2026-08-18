import Swal from 'sweetalert2';
import { db } from '../firebase-config.js';
import { BankDAO, CashCollectorDAO, TransactionDAO } from '../dao.js';
import { showToast, handleError } from '../utils.js';
import { auditLog } from '../audit.js';

let cachedBanks = [], cachedCollectors = [];
window.cachedBanksHtml = '<option value="">-- ব্যাংক নির্বাচন করুন --</option>';
window.cachedCashHtml = '<option value="">-- ক্যাশ রিসিভার নির্বাচন করুন --</option>';

/**
 * Loads dynamic bank accounts from Firebase & populates datalist
 * Auto-syncs any missing banks found in existing transactions.
 */
export async function loadBankOptions() {
    try {
        let banks = await BankDAO.getAllBanks();

        const currentBankNames = new Set(banks.map(b => b.name));
        let addedNew = false;
        if (!currentBankNames.has('OneBank (IFRAT)')) { await BankDAO.add({ name: 'OneBank (IFRAT)', status: 'active' }); addedNew = true; }
        if (!currentBankNames.has('IBBL (IFRAT)')) { await BankDAO.add({ name: 'IBBL (IFRAT)', status: 'active' }); addedNew = true; }
        
        if (addedNew) banks = await BankDAO.getAllBanks();

        cachedBanks = banks;
        const activeBanks = banks.filter(b => b.status !== 'inactive');
        let html = '<option value="" class="!bg-slate-900 !text-slate-400">-- ব্যাংক নির্বাচন করুন --</option>';
        activeBanks.forEach(b => {
            if (b.name) html += `<option value="${b.name}" class="!bg-slate-900 !text-slate-200 font-bold">${b.name}</option>`;
        });
        window.cachedBanksHtml = html;
        
        const sel = document.getElementById('ledger-received-from');
        if (sel && sel.tagName === 'SELECT' && document.getElementById('lbl-recv-from')?.innerText.includes('Bank')) {
            const currentVal = sel.value;
            sel.innerHTML = html;
            sel.value = currentVal;
        }
    } catch (e) { console.error('Error loading bank options:', e); }
}

export async function loadCashCollectorOptions() {
    try {
        let collectors = await CashCollectorDAO.getAllCollectors();

        const currentCollectorNames = new Set(collectors.map(c => c.name));
        let addedNew = false;
        if (!currentCollectorNames.has('শোরুম ক্যাশ')) { await CashCollectorDAO.add({ name: 'শোরুম ক্যাশ', status: 'active' }); addedNew = true; }
        if (!currentCollectorNames.has('ইফরাত')) { await CashCollectorDAO.add({ name: 'ইফরাত', status: 'active' }); addedNew = true; }

        if (addedNew) collectors = await CashCollectorDAO.getAllCollectors();

        cachedCollectors = collectors;
        const activeCollectors = collectors.filter(c => c.status !== 'inactive');
        let html = '<option value="" class="!bg-slate-900 !text-slate-400">-- ক্যাশ রিসিভার নির্বাচন করুন --</option>';
        activeCollectors.forEach(c => {
            if (c.name) html += `<option value="${c.name}" class="!bg-slate-900 !text-slate-200 font-bold">${c.name}</option>`;
        });
        window.cachedCashHtml = html;
        
        const sel = document.getElementById('ledger-received-from');
        if (sel && sel.tagName === 'SELECT' && document.getElementById('lbl-recv-from')?.innerText.includes('Cash')) {
            const currentVal = sel.value;
            sel.innerHTML = html;
            sel.value = currentVal;
        }
    } catch (e) { console.error('Error loading cash collectors:', e); }
}

/**
 * Quick add new Bank Account to Firebase
 */
export async function quickAddBank() {
    const { value: bankName } = await Swal.fire({
        title: '<div class="flex items-center gap-2 font-bn text-white text-xl"><i class="fa-solid fa-building-columns text-blue-400"></i><span>নতুন ব্যাংক যোগ করুন</span></div>',
        input: 'text',
        inputPlaceholder: 'যেমন: City Bank (IFRAT), Prime Bank...',
        showCancelButton: true,
        confirmButtonText: '<i class="fa-solid fa-check mr-1.5"></i>সেভ করুন',
        cancelButtonText: 'বাতিল',
        customClass: {
            popup: '!bg-slate-950 !text-white !rounded-3xl border border-slate-800 shadow-2xl font-bn',
            confirmButton: 'm3-btn-primary !bg-blue-600 hover:!bg-blue-500 !px-6 !py-2 !rounded-xl font-bold',
            cancelButton: 'm3-btn-tonal !bg-slate-800 hover:!bg-slate-700 !text-slate-300 !px-5 !py-2 !rounded-xl font-bold'
        },
        inputValidator: (val) => (!val || !val.trim()) ? 'ব্যাংকের নাম লিখুন!' : null
    });

    if (bankName && bankName.trim()) {
        try {
            const cleanName = bankName.trim();
            await BankDAO.add({ name: cleanName, status: 'active' });
            auditLog('ADD_BANKING', 'Ledger', 'BankingSystem', `Quick added Bank: ${cleanName}`);
            showToast('নতুন ব্যাংক সফলভাবে যুক্ত হয়েছে', 'success');
            await loadBankOptions();
            const input = document.getElementById('ledger-received-from');
            if (input) input.value = cleanName;
        } catch (e) {
            handleError(e, 'ব্যাংক সেভ করতে সমস্যা হয়েছে');
        }
    }
}

export async function quickAddCashCollector() {
    const { value: collectorName } = await Swal.fire({
        title: '<div class="flex items-center gap-2 font-bn text-white text-xl"><i class="fa-solid fa-user-gear text-emerald-400"></i><span>ক্যাশ গ্রহণকারী / সোর্স যোগ করুন</span></div>',
        input: 'text',
        inputPlaceholder: 'যেমন: ড্রাইভার শফিক, ম্যানেজার কালাম...',
        showCancelButton: true,
        confirmButtonText: '<i class="fa-solid fa-check mr-1.5"></i>সেভ করুন',
        cancelButtonText: 'বাতিল',
        customClass: {
            popup: '!bg-slate-950 !text-white !rounded-3xl border border-slate-800 shadow-2xl font-bn',
            confirmButton: 'm3-btn-primary !bg-emerald-600 hover:!bg-emerald-500 !px-6 !py-2 !rounded-xl font-bold',
            cancelButton: 'm3-btn-tonal !bg-slate-800 hover:!bg-slate-700 !text-slate-300 !px-5 !py-2 !rounded-xl font-bold'
        },
        inputValidator: (val) => (!val || !val.trim()) ? 'প্রাপক বা সোর্সের নাম লিখুন!' : null
    });

    if (collectorName && collectorName.trim()) {
        try {
            const cleanName = collectorName.trim();
            await CashCollectorDAO.add({ name: cleanName, status: 'active' });
            auditLog('ADD_BANKING', 'Ledger', 'BankingSystem', `Quick added Cash Collector: ${cleanName}`);
            showToast('ক্যাশ সোর্স সফলভাবে যুক্ত হয়েছে', 'success');
            await loadCashCollectorOptions();
            const input = document.getElementById('ledger-received-from');
            if (input) input.value = cleanName;
        } catch (e) {
            handleError(e, 'ক্যাশ সোর্স সেভ করতে সমস্যা হয়েছে');
        }
    }
}

// Global scope attachment for HTML onclick
window.quickAddBank = quickAddBank;
window.quickAddCashCollector = quickAddCashCollector;
window.quickEditBank = quickEditBank;
window.quickEditCashCollector = quickEditCashCollector;

export async function quickEditBank() {
    const sel = document.getElementById('ledger-received-from');
    if (!sel || !sel.value) return showToast('দয়া করে আগে লিস্ট থেকে একটি ব্যাংক নির্বাচন করুন!', 'warning');
    
    const oldName = sel.value;
    const bankObj = cachedBanks.find(b => b.name === oldName);
    if (!bankObj) return showToast('ব্যাংকটি খুঁজে পাওয়া যায়নি!', 'error');

    const { value: newName } = await Swal.fire({
        title: '<div class="flex items-center gap-2 font-bn text-white text-xl"><i class="fa-solid fa-pen text-emerald-400"></i><span>ব্যাংকের নাম এডিট করুন</span></div>',
        input: 'text',
        inputValue: oldName,
        showCancelButton: true,
        confirmButtonText: '<i class="fa-solid fa-check mr-1.5"></i>আপডেট করুন',
        cancelButtonText: 'বাতিল',
        customClass: {
            popup: '!bg-slate-950 !text-white !rounded-3xl border border-slate-800 shadow-2xl font-bn',
            confirmButton: 'm3-btn-primary !bg-emerald-600 hover:!bg-emerald-500 !px-6 !py-2 !rounded-xl font-bold',
            cancelButton: 'm3-btn-tonal !bg-slate-800 hover:!bg-slate-700 !text-slate-300 !px-5 !py-2 !rounded-xl font-bold'
        },
        inputValidator: (val) => {
            if (!val || !val.trim()) return 'ব্যাংকের নাম খালি রাখা যাবে না!';
            if (val.trim() === oldName) return 'আপনি কোনো পরিবর্তন করেননি!';
        }
    });

    if (newName) {
        try {
            const finalName = newName.trim();
            await BankDAO.update(bankObj.id, { name: finalName });
            
            // Auto update all past transactions with this bank name using targeted query and batch commit
            const snap = await db.collection('transactions').where('receivedType', '==', 'Bank').where('receivedFrom', '==', oldName).get();
            const CHUNK_SIZE = 400;
            for (let i = 0; i < snap.docs.length; i += CHUNK_SIZE) {
                const batch = db.batch();
                snap.docs.slice(i, i + CHUNK_SIZE).forEach(doc => {
                    batch.update(doc.ref, { receivedFrom: finalName });
                });
                await batch.commit();
            }

            auditLog('GLOBAL_RENAME', 'Ledger', 'BankingSystem', `Quick renamed Bank from ${oldName} to ${finalName} (${snap.size} txns)`);
            showToast('ব্যাংক আপডেট করা হয়েছে!', 'success');
            await loadBankOptions();
            const updatedSel = document.getElementById('ledger-received-from');
            if (updatedSel) updatedSel.value = finalName;
        } catch (e) {
            handleError(e, 'ব্যাংক আপডেট করতে সমস্যা হয়েছে');
        }
    }
}

/**
 * Quick edit existing Cash Collector in Firebase
 */
export async function quickEditCashCollector() {
    const sel = document.getElementById('ledger-received-from');
    if (!sel || !sel.value) {
        return showToast('দয়া করে আগে লিস্ট থেকে একটি ক্যাশ সোর্স নির্বাচন করুন!', 'warning');
    }
    const oldName = sel.value;
    const collObj = cachedCollectors.find(c => c.name === oldName);
    if (!collObj) return showToast('ক্যাশ সোর্স খুঁজে পাওয়া যায়নি!', 'error');

    const { value: newName } = await Swal.fire({
        title: '<div class="flex items-center gap-2 font-bn text-white text-xl"><i class="fa-solid fa-pen text-emerald-400"></i><span>ক্যাশ সোর্স এডিট করুন</span></div>',
        input: 'text',
        inputValue: oldName,
        showCancelButton: true,
        confirmButtonText: '<i class="fa-solid fa-check mr-1.5"></i>আপডেট করুন',
        cancelButtonText: 'বাতিল',
        customClass: {
            popup: '!bg-slate-950 !text-white !rounded-3xl border border-slate-800 shadow-2xl font-bn',
            confirmButton: 'm3-btn-primary !bg-emerald-600 hover:!bg-emerald-500 !px-6 !py-2 !rounded-xl font-bold',
            cancelButton: 'm3-btn-tonal !bg-slate-800 hover:!bg-slate-700 !text-slate-300 !px-5 !py-2 !rounded-xl font-bold'
        },
        inputValidator: (val) => {
            if (!val || !val.trim()) return 'নাম খালি রাখা যাবে না!';
            if (val.trim() === oldName) return 'আপনি কোনো পরিবর্তন করেননি!';
        }
    });

    if (newName) {
        try {
            const finalName = newName.trim();
            await CashCollectorDAO.update(collObj.id, { name: finalName });
            
            // Auto update all past transactions with this cash source using targeted query and batch commit
            const snap = await db.collection('transactions').where('receivedType', '==', 'Cash').where('receivedFrom', '==', oldName).get();
            const CHUNK_SIZE = 400;
            for (let i = 0; i < snap.docs.length; i += CHUNK_SIZE) {
                const batch = db.batch();
                snap.docs.slice(i, i + CHUNK_SIZE).forEach(doc => {
                    batch.update(doc.ref, { receivedFrom: finalName });
                });
                await batch.commit();
            }

            auditLog('GLOBAL_RENAME', 'Ledger', 'BankingSystem', `Quick renamed Cash Collector from ${oldName} to ${finalName} (${snap.size} txns)`);
            showToast('ক্যাশ সোর্স আপডেট করা হয়েছে!', 'success');
            await loadCashCollectorOptions();
            
            // Re-select the updated cash source
            const updatedSel = document.getElementById('ledger-received-from');
            if (updatedSel) updatedSel.value = finalName;
        } catch (e) {
            handleError(e, 'ক্যাশ সোর্স আপডেট করতে সমস্যা হয়েছে');
        }
    }
}

import Swal from 'sweetalert2';
import { db, firebase } from '../firebase-config.js';
import { BankDAO, CashCollectorDAO, TransactionDAO, BankTransactionDAO } from '../dao.js';
import { promptSecurityPin, showToast } from '../utils.js';
import { auditLog } from '../audit.js';
import { loadBankOptions, loadCashCollectorOptions } from '../ledger/ledger-bank-cash.js';

let currentTab = 'bank'; // 'bank' or 'cash'
let activeBanks = [];
let activeCash = [];

export async function showBankingSystemManager() {
    Swal.fire({
        title: 'ব্যাংকিং ও ক্যাশ ম্যানেজমেন্ট',
        html: `
            <div class="text-left space-y-4 font-bn p-2 min-h-[300px]">
                <div class="flex gap-2 border-b border-slate-700/50 pb-3">
                    <button id="tab-bank" class="px-4 py-2 bg-blue-600 text-white rounded-lg text-xs font-bold transition-all shadow-md">ব্যাংক অ্যাকাউন্টস</button>
                    <button id="tab-cash" class="px-4 py-2 bg-slate-800 text-slate-300 hover:bg-slate-700 rounded-lg text-xs font-bold transition-all">ক্যাশ রিসিভার</button>
                </div>
                
                <div class="flex justify-between items-center mb-2">
                    <h3 id="banking-tab-title" class="text-sm font-black text-slate-200">সকল ব্যাংক অ্যাকাউন্ট</h3>
                    <button id="btn-add-banking-item" class="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-lg transition-all"><i class="fa-solid fa-plus mr-1"></i>নতুন যুক্ত করুন</button>
                </div>

                <div id="banking-list-container" class="space-y-2 max-h-[350px] overflow-y-auto pr-2 custom-scrollbar">
                    <div class="text-center py-6 text-slate-400 text-xs"><i class="fa-solid fa-spinner fa-spin mr-2"></i>লোড হচ্ছে...</div>
                </div>
            </div>
        `,
        showConfirmButton: false,
        showCloseButton: true,
        width: '600px',
        customClass: { popup: '!bg-slate-900 !text-white !rounded-3xl border border-slate-700' },
        didOpen: () => {
            document.getElementById('tab-bank').addEventListener('click', () => switchTab('bank'));
            document.getElementById('tab-cash').addEventListener('click', () => switchTab('cash'));
            document.getElementById('btn-add-banking-item').addEventListener('click', handleAddNewItem);
            loadBankingData();
        }
    });
}

function switchTab(tab) {
    currentTab = tab;
    const btnBank = document.getElementById('tab-bank');
    const btnCash = document.getElementById('tab-cash');
    const title = document.getElementById('banking-tab-title');
    
    if (tab === 'bank') {
        btnBank.className = 'px-4 py-2 bg-blue-600 text-white rounded-lg text-xs font-bold transition-all shadow-md';
        btnCash.className = 'px-4 py-2 bg-slate-800 text-slate-300 hover:bg-slate-700 rounded-lg text-xs font-bold transition-all';
        title.innerText = 'সকল ব্যাংক অ্যাকাউন্ট';
    } else {
        btnCash.className = 'px-4 py-2 bg-emerald-600 text-white rounded-lg text-xs font-bold transition-all shadow-md';
        btnBank.className = 'px-4 py-2 bg-slate-800 text-slate-300 hover:bg-slate-700 rounded-lg text-xs font-bold transition-all';
        title.innerText = 'সকল ক্যাশ রিসিভার';
    }
    renderBankingList();
}

async function loadBankingData() {
    try {
        const [banks, cash] = await Promise.all([
            BankDAO.getAllBanks(),
            CashCollectorDAO.getAllCollectors()
        ]);
        activeBanks = banks;
        activeCash = cash;
        renderBankingList();
        loadBankOptions();
        loadCashCollectorOptions();
    } catch (e) {
        console.error(e);
        document.getElementById('banking-list-container').innerHTML = '<div class="text-red-400 text-xs text-center">ডাটা লোড করতে সমস্যা হয়েছে।</div>';
    }
}

function renderBankingList() {
    const container = document.getElementById('banking-list-container');
    if (!container) return;
    
    const items = currentTab === 'bank' ? activeBanks : activeCash;
    const isCash = currentTab === 'cash';
    
    if (items.length === 0) {
        container.innerHTML = '<div class="text-slate-500 text-xs text-center py-6">কোনো ডাটা পাওয়া যায়নি।</div>';
        return;
    }
    
    let html = '';
    items.forEach(item => {
        const isActive = item.status !== 'inactive';
        const statusBadge = isActive 
            ? '<span class="bg-emerald-500/10 text-emerald-400 text-[9px] px-1.5 py-0.5 rounded font-bold uppercase border border-emerald-500/20">Active</span>'
            : '<span class="bg-red-500/10 text-red-400 text-[9px] px-1.5 py-0.5 rounded font-bold uppercase border border-red-500/20">Inactive</span>';
            
        const icon = isCash ? '<i class="fa-solid fa-user-tie text-emerald-400"></i>' : '<i class="fa-solid fa-building-columns text-blue-400"></i>';
        
        html += `
            <div class="flex items-center justify-between p-3 bg-slate-950/50 border border-slate-800/80 rounded-xl hover:bg-slate-800/40 transition-colors group">
                <div class="flex items-center gap-3">
                    <div class="w-8 h-8 rounded-lg bg-slate-900 border border-slate-700 flex items-center justify-center shrink-0">
                        ${icon}
                    </div>
                    <div>
                        <div class="text-sm font-bold text-slate-200 flex items-center gap-2">${item.name} ${statusBadge}</div>
                        <div class="text-[10px] text-slate-500">তৈরি: ${item.createdAt ? new Date(item.createdAt.toMillis ? item.createdAt.toMillis() : item.createdAt).toLocaleDateString('bn-BD') : '-'}</div>
                    </div>
                </div>
                <div class="flex items-center gap-1.5 opacity-60 group-hover:opacity-100 transition-opacity">
                    <button class="w-7 h-7 rounded-md bg-slate-800 hover:bg-amber-600 text-slate-400 hover:text-white transition-colors" onclick="window.appAdmin.editBankingItem('${item.id}', '${item.name}', '${currentTab}')" title="এডিট বা রিনেম"><i class="fa-solid fa-pen text-[10px]"></i></button>
                    ${isActive 
                        ? `<button class="w-7 h-7 rounded-md bg-slate-800 hover:bg-red-600 text-slate-400 hover:text-white transition-colors" onclick="window.appAdmin.deactivateBankingItem('${item.id}', '${item.name}', '${currentTab}')" title="নিষ্ক্রিয়/ডিলেট করুন"><i class="fa-solid fa-trash-can text-[10px]"></i></button>`
                        : `<button class="w-7 h-7 rounded-md bg-slate-800 hover:bg-emerald-600 text-slate-400 hover:text-white transition-colors" onclick="window.appAdmin.reactivateBankingItem('${item.id}', '${item.name}', '${currentTab}')" title="পুনরায় চালু করুন"><i class="fa-solid fa-rotate-left text-[10px]"></i></button>`
                    }
                </div>
            </div>
        `;
    });
    container.innerHTML = html;
}

async function handleAddNewItem() {
    const isCash = currentTab === 'cash';
    const typeLabel = isCash ? 'ক্যাশ রিসিভার' : 'ব্যাংক অ্যাকাউন্ট';
    
    const { value: name } = await Swal.fire({
        title: `নতুন ${typeLabel} যোগ করুন`,
        input: 'text',
        inputPlaceholder: `${typeLabel} এর নাম...`,
        showCancelButton: true,
        confirmButtonText: 'যোগ করুন',
        cancelButtonText: 'বাতিল',
        customClass: { popup: '!bg-slate-900 !text-white !rounded-3xl border border-slate-700', input: '!bg-slate-950 !text-white !border-slate-700 focus:!border-emerald-500' },
        inputValidator: (value) => {
            if (!value || !value.trim()) return 'নাম দেওয়া আবশ্যক!';
        }
    });

    if (name) {
        // Master PIN Check
        const isPinValid = await promptSecurityPin(`${typeLabel} যোগ করা (Master PIN)`);
        if (!isPinValid) return;

        Swal.fire({ title: 'যোগ করা হচ্ছে...', allowOutsideClick: false, didOpen: () => Swal.showLoading() });
        try {
            const data = { name: name.trim(), status: 'active' };
            if (isCash) {
                await CashCollectorDAO.add(data);
            } else {
                await BankDAO.add(data);
            }
            auditLog('ADD_BANKING', 'Admin', 'BankingSystem', `Added new ${currentTab}: ${name.trim()}`);
            await loadBankingData();
            Swal.fire({ title: 'সফল!', text: `${name} সফলভাবে যোগ করা হয়েছে।`, icon: 'success', customClass: { popup: '!bg-slate-900 !text-white !rounded-3xl border border-slate-700' }});
        } catch (e) {
            Swal.fire('Error', 'যোগ করতে সমস্যা হয়েছে।', 'error');
        }
    }
}

export async function editBankingItem(id, oldName, type) {
    const isCash = type === 'cash';
    const typeLabel = isCash ? 'ক্যাশ রিসিভার' : 'ব্যাংক অ্যাকাউন্ট';
    const polKey = 'editBank'; // We use the same policy for both Bank/Cash edit

    const { value: formValues } = await Swal.fire({
        title: `${typeLabel} আপডেট (Global Rename)`,
        html: `
            <div class="text-left font-bn space-y-4">
                <div class="bg-amber-500/10 border border-amber-500/30 p-3 rounded-xl text-amber-200 text-xs">
                    <i class="fa-solid fa-triangle-exclamation mr-1.5"></i> <strong>সতর্কতা:</strong> আপনি যদি নাম পরিবর্তন করেন, তবে সিস্টেম আগের সবগুলো ট্রানজাকশন স্ক্যান করে যেখানে <strong>"${oldName}"</strong> ছিল, সব অটোমেটিক আপডেট করে নতুন নাম বসিয়ে দেবে। এতে কয়েক সেকেন্ড সময় লাগতে পারে।
                </div>
                <div>
                    <label class="block text-xs font-bold text-slate-400 mb-1">নতুন নাম লিখুন:</label>
                    <input id="rename-new-name" class="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white outline-none focus:border-amber-500" value="${oldName}">
                </div>
            </div>
        `,
        showCancelButton: true,
        confirmButtonText: 'আপডেট করুন',
        cancelButtonText: 'বাতিল',
        customClass: { popup: '!bg-slate-900 !text-white !rounded-3xl border border-slate-700' },
        preConfirm: () => {
            const val = document.getElementById('rename-new-name').value.trim();
            if (!val) return Swal.showValidationMessage('নাম দেওয়া আবশ্যক');
            if (val === oldName) return Swal.showValidationMessage('নাম পরিবর্তন করা হয়নি');
            return val;
        }
    });

    if (formValues) {
        // Security PIN Check
        const isPinValid = await promptSecurityPin(`${typeLabel} রিনেম (Master PIN)`, polKey);
        if (!isPinValid) return;

        Swal.fire({ title: 'গ্লোবাল রিনেম চলছে...', html: 'পুরনো ট্রানজাকশন স্ক্যান ও আপডেট করা হচ্ছে। দয়া করে অপেক্ষা করুন...', allowOutsideClick: false, didOpen: () => Swal.showLoading() });
        
        try {
            // 1. Update the Master Record
            if (isCash) {
                await CashCollectorDAO.update(id, { name: formValues });
            } else {
                await BankDAO.update(id, { name: formValues });
            }

            // 2. Global Rename in Transactions & Bank Transactions
            let updatedCount = 0;
            const rType = isCash ? 'Cash' : 'Bank';
            
            const [txnSnap, bTxnSnap, bTargetSnap] = await Promise.all([
                TransactionDAO.collection.where('receivedType', '==', rType).where('receivedFrom', '==', oldName).get(),
                BankTransactionDAO.collection.where('bankName', '==', oldName).get(),
                BankTransactionDAO.collection.where('targetBankName', '==', oldName).get()
            ]);
            
            const allDocs = [];
            txnSnap.forEach(d => allDocs.push({ ref: d.ref, data: { receivedFrom: formValues } }));
            bTxnSnap.forEach(d => allDocs.push({ ref: d.ref, data: { bankName: formValues } }));
            bTargetSnap.forEach(d => allDocs.push({ ref: d.ref, data: { targetBankName: formValues } }));

            const CHUNK_SIZE = 400;
            for (let i = 0; i < allDocs.length; i += CHUNK_SIZE) {
                const b = db.batch();
                allDocs.slice(i, i + CHUNK_SIZE).forEach(item => {
                    b.update(item.ref, { ...item.data, updatedAt: firebase.firestore.FieldValue.serverTimestamp() });
                    updatedCount++;
                });
                await b.commit();
            }

            auditLog('GLOBAL_RENAME', 'Admin', 'BankingSystem', `Renamed ${typeLabel} from ${oldName} to ${formValues}. Updated ${updatedCount} txns.`);
            await loadBankingData();
            Swal.fire({ title: 'সফল!', html: `${oldName} পরিবর্তন করে <strong>${formValues}</strong> করা হয়েছে。<br><span class="text-xs text-amber-500">মোট ${updatedCount} টি ট্রানজাকশন অটোমেটিক আপডেট হয়েছে।</span>`, icon: 'success', customClass: { popup: '!bg-slate-900 !text-white !rounded-3xl border border-slate-700' }});

        } catch (e) {
            console.error(e);
            Swal.fire('ত্রুটি', 'আপডেট করতে সমস্যা হয়েছে।', 'error');
        }
    }
}

export async function deactivateBankingItem(id, name, type) {
    const isCash = type === 'cash';
    const typeLabel = isCash ? 'ক্যাশ রিসিভার' : 'ব্যাংক অ্যাকাউন্ট';
    const polKey = 'deleteBank';

    // Master PIN Check
    const isPinValid = await promptSecurityPin(`${typeLabel} ডিলেট/নিষ্ক্রিয় (Master PIN)`, polKey);
    if (!isPinValid) return;

    const result = await Swal.fire({
        title: 'নিশ্চিত করুন',
        html: `<div class="font-bn">আপনি কি <strong>${name}</strong> নিষ্ক্রিয় (Archive) করতে চান?<br><span class="text-xs text-slate-400 mt-2 block">এটি করলে নতুন এন্ট্রির ড্রপডাউনে আর এই নাম দেখাবে না, তবে আগের রিপোর্টগুলো ঠিক থাকবে।</span></div>`,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#ef4444',
        confirmButtonText: 'হ্যাঁ, নিষ্ক্রিয় করুন',
        cancelButtonText: 'বাতিল',
        customClass: { popup: '!bg-slate-900 !text-white !rounded-3xl border border-slate-700' }
    });
    
    if (result.isConfirmed) {
        Swal.fire({ title: 'নিষ্ক্রিয় করা হচ্ছে...', allowOutsideClick: false, didOpen: () => Swal.showLoading() });
        try {
            if (isCash) await CashCollectorDAO.update(id, { status: 'inactive' });
            else await BankDAO.update(id, { status: 'inactive' });
            
            auditLog('DEACTIVATE_BANKING', 'Admin', 'BankingSystem', `Deactivated ${typeLabel}: ${name}`);
            await loadBankingData();
            Swal.fire({ title: 'সফল!', text: 'সফলভাবে নিষ্ক্রিয় করা হয়েছে।', icon: 'success', customClass: { popup: '!bg-slate-900 !text-white !rounded-3xl border border-slate-700' }});
        } catch (e) {
            Swal.fire('ত্রুটি', 'নিষ্ক্রিয় করতে সমস্যা হয়েছে।', 'error');
        }
    }
}

export async function reactivateBankingItem(id, name, type) {
    const isCash = type === 'cash';
    const typeLabel = isCash ? 'ক্যাশ রিসিভার' : 'ব্যাংক অ্যাকাউন্ট';
    
    const isPinValid = await promptSecurityPin(`${typeLabel} পুনরায় চালু (Master PIN)`);
    if (!isPinValid) return;

    Swal.fire({ title: 'চালু করা হচ্ছে...', allowOutsideClick: false, didOpen: () => Swal.showLoading() });
    try {
        if (isCash) await CashCollectorDAO.update(id, { status: 'active' });
        else await BankDAO.update(id, { status: 'active' });
        
        auditLog('REACTIVATE_BANKING', 'Admin', 'BankingSystem', `Reactivated ${typeLabel}: ${name}`);
        await loadBankingData();
        Swal.fire({ title: 'সফল!', text: 'সফলভাবে চালু করা হয়েছে।', icon: 'success', customClass: { popup: '!bg-slate-900 !text-white !rounded-3xl border border-slate-700' }});
    } catch (e) {
        Swal.fire('ত্রুটি', 'চালু করতে সমস্যা হয়েছে।', 'error');
    }
}

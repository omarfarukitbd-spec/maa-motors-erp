import Swal from 'sweetalert2';
import { BankDAO, CashCollectorDAO, BankTransactionDAO } from '../dao.js';
import { calculateAccountBalance } from './banking-calc.js';
import { getBankingSummary } from './banking-analytics.js';
import { formatAmountWithComma, promptSecurityPin, showToast, parseAmount } from '../utils.js';
import { auditLog } from '../audit.js';
import { firebase } from '../firebase-config.js';
import { openAccountLedger, loadLedgerTable, printLedger, exportLedgerExcel, deleteBankingTransaction, shareLedgerWhatsApp } from './banking-ledger-ui.js';

let activeAccounts = []; // mixed banks and cash

export async function renderBankingLedger(container) {
    if (window.AppState.currentUserRole === 'Staff' && window.AppState.permissions.viewBanking === false) {
        container.innerHTML = `<div class="m3-card text-center font-bn py-12"><h2 class="text-xl font-bold text-red-500">অ্যাক্সেস ডিনাইড!</h2></div>`;
        return;
    }

    container.innerHTML = `
        <div class="flex flex-col gap-6 font-bn">
            <div class="flex flex-wrap items-center justify-between gap-3 px-2">
                <h2 class="text-2xl font-black text-white flex items-center gap-3">
                    <div class="w-1.5 h-8 bg-purple-600 rounded-full"></div>
                    ব্যাংকিং লেজার <span class="text-xs font-bold text-slate-400 uppercase tracking-wider">(Banking & Cash)</span>
                    <button class="w-8 h-8 rounded-full hover:bg-slate-800 flex items-center justify-center text-slate-500 hover:text-purple-400 transition-all cursor-pointer" onclick="window.renderBankingLedger(document.getElementById('main-content'))" title="রিফ্রেশ">
                        <i class="fa-solid fa-rotate text-sm"></i>
                    </button>
                </h2>
                <div class="flex items-center gap-2">
                    <button data-perm="addBankDeposit" class="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold transition-all shadow-md shadow-emerald-600/20 flex items-center gap-2 cursor-pointer" onclick="window.bankingApp.openTransactionModal('DEPOSIT')">
                        <i class="fa-solid fa-arrow-down"></i> ম্যানুয়াল জমা
                    </button>
                    <button data-perm="addBankWithdrawal" class="px-4 py-2 bg-red-600 hover:bg-red-500 text-white rounded-xl text-xs font-bold transition-all shadow-md shadow-red-600/20 flex items-center gap-2 cursor-pointer" onclick="window.bankingApp.openTransactionModal('WITHDRAWAL')">
                        <i class="fa-solid fa-arrow-up"></i> টাকা উত্তোলন
                    </button>
                    <button data-perm="addBankTransfer" class="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold transition-all shadow-md shadow-blue-600/20 flex items-center gap-2 cursor-pointer" onclick="window.bankingApp.openTransactionModal('TRANSFER')">
                        <i class="fa-solid fa-right-left"></i> ট্রান্সফার
                    </button>
                </div>
            </div>

            <div id="banking-dashboard-container" class="mb-2"></div>

            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4" id="banking-accounts-grid">
                <div class="text-center py-12 col-span-full text-slate-400 font-bold italic"><i class="fa-solid fa-spinner fa-spin mr-2"></i>অ্যাকাউন্ট ব্যালেন্স লোড হচ্ছে...</div>
            </div>
        </div>
    `;

    await loadAndRenderAccounts();
}

async function loadAndRenderAccounts() {
    try {
        const banks = await BankDAO.getActiveBanks();
        const cash = await CashCollectorDAO.getActiveCollectors();
        
        activeAccounts = [
            ...banks.map(b => ({ ...b, isCash: false })),
            ...cash.map(c => ({ ...c, isCash: true }))
        ];

        let html = '';
        if (activeAccounts.length === 0) {
            html = `<div class="col-span-full text-center py-12 text-slate-400 font-bold">এখনো কোনো ব্যাংক বা ক্যাশ অ্যাকাউন্ট যুক্ত করা হয়নি।</div>`;
        } else {
            // Fetch all balances concurrently for massive speedup
            const balances = await Promise.all(activeAccounts.map(acc => calculateAccountBalance(acc.name, acc.isCash)));

            activeAccounts.forEach((acc, index) => {
                const balance = balances[index];
                acc.balance = balance; // Fix: Save balance so dashboard can sum it up
                const isOverdrawn = balance < 0;
                const icon = acc.isCash ? '<i class="fa-solid fa-wallet text-emerald-400 text-2xl"></i>' : '<i class="fa-solid fa-building-columns text-blue-400 text-2xl"></i>';
                const typeLabel = acc.isCash ? '<span class="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">CASH</span>' : '<span class="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-500/10 text-blue-400 border border-blue-500/20">BANK</span>';
                const overdrawnBadge = isOverdrawn ? '<span class="px-2 py-0.5 rounded text-[10px] font-black bg-red-500/20 text-red-400 border border-red-500/40 animate-pulse flex items-center gap-1"><i class="fa-solid fa-triangle-exclamation text-[9px]"></i> ওভারড্রন</span>' : '';
                const cardBorder = isOverdrawn ? 'border-red-500/50 bg-red-950/10 hover:border-red-500 shadow-red-900/10' : 'border-slate-800 hover:border-purple-500/50';
                
                html += `
                    <div class="m3-card relative overflow-hidden group cursor-pointer ${cardBorder} transition-all duration-300 shadow-lg" onclick="window.bankingApp.viewAccountLedger('${acc.name}', ${acc.isCash})">
                        <div class="flex items-start justify-between mb-4">
                            <div class="w-12 h-12 rounded-xl bg-slate-900 border border-slate-700 flex items-center justify-center">
                                ${icon}
                            </div>
                            <div class="flex items-center gap-1.5">
                                ${overdrawnBadge}
                                ${typeLabel}
                            </div>
                        </div>
                        <div>
                            <h3 class="text-lg font-black text-slate-200 truncate">${acc.name}</h3>
                            <div class="text-xs font-bold text-slate-400 mb-1 flex items-center justify-between">
                                <span>বর্তমান ব্যালেন্স</span>
                                ${isOverdrawn ? '<span class="text-[10px] text-red-400 font-bold">ঋণাত্মক ঘাটতি</span>' : ''}
                            </div>
                            <div class="text-3xl font-black font-mono ${isOverdrawn ? 'text-red-400' : 'text-white'}">৳ ${formatAmountWithComma(balance)}</div>
                        </div>
                        
                        <div class="absolute bottom-0 left-0 w-full h-1 bg-slate-800">
                            <div class="h-full bg-gradient-to-r ${isOverdrawn ? 'from-red-500 to-rose-600' : 'from-purple-500 to-blue-500'} w-0 group-hover:w-full transition-all duration-500"></div>
                        </div>
                    </div>
                `;
            });
        }

        const grid = document.getElementById('banking-accounts-grid');
        if (grid) grid.innerHTML = html;
        
        await loadBankingDashboard('month');
        
    } catch (e) {
        console.error("Error loading banking accounts:", e);
        const grid = document.getElementById('banking-accounts-grid');
        if (grid) grid.innerHTML = `<div class="text-center py-12 col-span-full text-red-400 font-bold break-all">ব্যালেন্স লোড করতে সমস্যা হয়েছে! Error: ${e.message}</div>`;
    }
}

async function openTransactionModal(type) {
    // type: DEPOSIT, WITHDRAWAL, TRANSFER
    const title = type === 'DEPOSIT' ? 'ম্যানুয়াল জমা (Deposit)' : type === 'WITHDRAWAL' ? 'টাকা উত্তোলন (Withdrawal)' : 'এক ব্যাংক থেকে অন্য ব্যাংকে ট্রান্সফার';
    const btnText = type === 'DEPOSIT' ? 'জমা করুন' : type === 'WITHDRAWAL' ? 'উত্তোলন করুন' : 'ট্রান্সফার করুন';
    const btnColor = type === 'DEPOSIT' ? '#10b981' : type === 'WITHDRAWAL' ? '#ef4444' : '#3b82f6';
    
    let accountOptions = '<option value="">-- নির্বাচন করুন --</option>';
    activeAccounts.forEach(a => {
        accountOptions += `<option value="${a.name}">${a.name} (${a.isCash ? 'Cash' : 'Bank'})</option>`;
    });

    let html = `
        <div class="text-left font-bn space-y-4">
            <div>
                <label class="block text-xs font-bold text-slate-400 mb-1">${type === 'TRANSFER' ? 'কোথা থেকে (From)' : 'অ্যাকাউন্ট নির্বাচন করুন'}</label>
                <select id="banking-txn-acc" class="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2.5 text-white font-bold outline-none">${accountOptions}</select>
            </div>
    `;

    if (type === 'TRANSFER') {
        html += `
            <div>
                <label class="block text-xs font-bold text-slate-400 mb-1">কোথায় যাবে (To)</label>
                <select id="banking-txn-target-acc" class="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2.5 text-white font-bold outline-none">${accountOptions}</select>
            </div>
        `;
    }

    html += `
            <div>
                <label class="block text-xs font-bold text-slate-400 mb-1">পরিমাণ (Amount ৳)</label>
                <input type="text" id="banking-txn-amount" oninput="window.handleNumberInput(this); window.updateLiveWords(this, 'banking-txn-amount-words');" class="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2.5 text-white font-black text-xl outline-none focus:border-purple-500" placeholder="0.00">
                <div id="banking-txn-amount-words" class="text-xs text-blue-400 font-bold hidden italic mt-1"></div>
            </div>
            <div>
                <label class="block text-xs font-bold text-slate-400 mb-1">বিবরণ / নোট</label>
                <input type="text" id="banking-txn-note" class="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2.5 text-white outline-none focus:border-purple-500" placeholder="যেমন: বস নিজ পকেট থেকে দিয়েছেন...">
            </div>
            <div>
                <label class="block text-xs font-bold text-slate-400 mb-1">তারিখ</label>
                <input type="text" id="banking-txn-date" class="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2.5 text-white outline-none datepicker" value="${new Date().toISOString().split('T')[0]}">
            </div>
        </div>
    `;

    const { value: formValues } = await Swal.fire({
        title: `<span class="font-bn font-black">${title}</span>`,
        html: html,
        focusConfirm: false,
        showCancelButton: true,
        confirmButtonText: btnText,
        cancelButtonText: 'বাতিল',
        confirmButtonColor: btnColor,
        customClass: { popup: '!bg-slate-900 !text-white !rounded-3xl border border-slate-700' },
        preConfirm: () => {
            const bankName = document.getElementById('banking-txn-acc').value;
            const targetBankName = type === 'TRANSFER' ? document.getElementById('banking-txn-target-acc').value : null;
            const rawAmount = document.getElementById('banking-txn-amount').value;
            const amount = parseAmount(rawAmount);
            const note = document.getElementById('banking-txn-note').value.trim();
            const date = document.getElementById('banking-txn-date').value;

            if (!bankName) return Swal.showValidationMessage('অনুগ্রহ করে একটি অ্যাকাউন্ট নির্বাচন করুন!');
            if (type === 'TRANSFER' && !targetBankName) return Swal.showValidationMessage('অনুগ্রহ করে টার্গেট অ্যাকাউন্ট নির্বাচন করুন!');
            if (type === 'TRANSFER' && bankName === targetBankName) return Swal.showValidationMessage('একই অ্যাকাউন্টে ট্রান্সফার সম্ভব নয়!');
            if (!amount || isNaN(amount) || amount <= 0) return Swal.showValidationMessage('সঠিক টাকার পরিমাণ লিখুন!');
            if (!date) return Swal.showValidationMessage('তারিখ নির্বাচন করুন!');

            return { bankName, targetBankName, amount, note, date };
        }
    });

    if (formValues) {
        Swal.fire({ title: 'সংরক্ষণ করা হচ্ছে...', allowOutsideClick: false, didOpen: () => Swal.showLoading() });
        try {
            const txnData = {
                type: type,
                bankName: formValues.bankName,
                amount: formValues.amount,
                note: formValues.note,
                date: formValues.date,
                createdBy: firebase.auth().currentUser?.email || 'Admin',
                createdAt: firebase.firestore.FieldValue.serverTimestamp()
            };
            if (type === 'TRANSFER') {
                txnData.targetBankName = formValues.targetBankName;
            }

            await BankTransactionDAO.create(txnData);
            auditLog('BANKING_TXN_CREATE', 'Admin', 'BankingLedger', `Created ${type} of ৳${formValues.amount} on ${formValues.bankName}`);
            
            showToast('সফলভাবে সম্পন্ন হয়েছে!', 'success');
            await loadAndRenderAccounts();
        } catch (e) {
            console.error(e);
            Swal.fire('ত্রুটি', 'ডাটাবেজে সেভ করতে সমস্যা হয়েছে!', 'error');
        }
    }
}

async function loadBankingDashboard(timeFilter = 'month') {
    const container = document.getElementById('banking-dashboard-container');
    if (!container) return;

    try {
        const summary = await getBankingSummary(timeFilter);
        const totalBankBalance = activeAccounts.filter(a => !a.isCash).reduce((sum, a) => sum + (a.balance || 0), 0);
        const totalCashBalance = activeAccounts.filter(a => a.isCash).reduce((sum, a) => sum + (a.balance || 0), 0);
        
        container.innerHTML = `
            <div class="m3-card bg-slate-900 border border-slate-800 p-4 rounded-2xl mb-4 font-bn">
                <div class="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-3 mb-4">
                    <div>
                        <h3 class="text-lg font-black text-white flex items-center gap-2">
                            <i class="fa-solid fa-chart-pie text-purple-400"></i>
                            ব্যাংকিং সারাংশ ও লিকুইডিটি
                        </h3>
                    </div>
                    <div class="flex items-center gap-2">
                        <input type="text" id="banking-custom-range" class="${timeFilter.includes('to') ? '' : 'hidden'} bg-slate-950 border border-slate-700 text-white text-sm font-bold rounded-lg px-3 py-1.5 outline-none focus:border-purple-500 w-52 datepicker text-center" data-mode="range" placeholder="DD/MM/YYYY to DD/MM/YYYY" value="${timeFilter.includes('to') ? timeFilter : ''}" onchange="if(this.value.includes(' to ')) window.bankingApp.loadBankingDashboard(this.value)">
                        <select id="banking-summary-filter" class="bg-slate-950 border border-slate-700 text-white text-sm font-bold rounded-lg px-3 py-1.5 outline-none focus:border-purple-500 cursor-pointer transition-colors" onchange="if(this.value === 'custom') { document.getElementById('banking-custom-range').classList.remove('hidden'); document.getElementById('banking-custom-range').focus(); } else { document.getElementById('banking-custom-range').classList.add('hidden'); window.bankingApp.loadBankingDashboard(this.value); }">
                            <option value="today" ${timeFilter === 'today' ? 'selected' : ''}>আজকের সামারি (Today)</option>
                            <option value="month" ${timeFilter === 'month' ? 'selected' : ''}>চলতি মাস (This Month)</option>
                            <option value="lastMonth" ${timeFilter === 'lastMonth' ? 'selected' : ''}>গত মাস (Last Month)</option>
                            <option value="year" ${timeFilter === 'year' ? 'selected' : ''}>চলতি বছর (This Year)</option>
                            <option value="all" ${timeFilter === 'all' ? 'selected' : ''}>সর্বমোট (All Time)</option>
                            <option value="custom" ${timeFilter.includes('to') ? 'selected' : ''}>তারিখ অনুযায়ী ফিল্টার...</option>
                        </select>
                    </div>
                </div>

                <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div class="bg-slate-950 p-4 rounded-xl border border-slate-800">
                        <p class="text-slate-400 text-[10px] font-bold uppercase tracking-wider mb-1">মোট কালেকশন জমা</p>
                        <h4 class="text-emerald-400 font-black text-xl">৳ ${formatAmountWithComma(summary.totalCustomerCollections)}</h4>
                    </div>
                    <div class="bg-slate-950 p-4 rounded-xl border border-slate-800">
                        <p class="text-slate-400 text-[10px] font-bold uppercase tracking-wider mb-1">ম্যানুয়াল উত্তোলন</p>
                        <h4 class="text-red-400 font-black text-xl">৳ ${formatAmountWithComma(summary.totalWithdrawals)}</h4>
                    </div>
                    <div class="bg-slate-950 p-4 rounded-xl border border-emerald-900/50 relative overflow-hidden">
                        <div class="absolute -right-4 -top-4 w-16 h-16 bg-emerald-600/20 rounded-full blur-xl"></div>
                        <p class="text-emerald-300 text-[10px] font-bold uppercase tracking-wider mb-1">সর্বমোট ক্যাশ ব্যালেন্স</p>
                        <h4 class="text-emerald-400 font-black text-xl relative z-10">৳ ${formatAmountWithComma(totalCashBalance)}</h4>
                    </div>
                    <div class="bg-slate-950 p-4 rounded-xl border border-purple-900/50 relative overflow-hidden">
                        <div class="absolute -right-4 -top-4 w-16 h-16 bg-purple-600/20 rounded-full blur-xl"></div>
                        <p class="text-purple-300 text-[10px] font-bold uppercase tracking-wider mb-1">সর্বমোট ব্যাংক ব্যালেন্স</p>
                        <h4 class="text-purple-400 font-black text-xl relative z-10">৳ ${formatAmountWithComma(totalBankBalance)}</h4>
                    </div>
                </div>
            </div>
        `;
    } catch (e) {
        console.error("Dashboard load error", e);
        container.innerHTML = `<div class="text-center py-8 text-red-400 font-bold italic">সামারি লোড করতে সমস্যা হয়েছে!</div>`;
    }
}

export const bankingApp = {
    renderBankingLedger,
    openTransactionModal,
    loadBankingDashboard,
    viewAccountLedger: (acc, isCash) => {
        if (typeof window !== 'undefined' && window.bankingApp) {
            window.bankingApp.isCurrentAccountCash = isCash;
        }
        openAccountLedger(acc, isCash);
    },
    loadLedgerTable,
    printLedger,
    exportLedgerExcel,
    shareLedgerWhatsApp,
    deleteBankingTransaction,
    refreshCards: loadAndRenderAccounts
};

if (typeof window !== 'undefined') {
    window.bankingApp = bankingApp;
    window.renderBankingLedger = renderBankingLedger;
}

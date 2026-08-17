import { BankDAO, CashCollectorDAO } from '../dao.js';
import { calculateAccountBalance } from './banking-calc.js';
import { getBankingSummary } from './banking-analytics.js';
import { formatAmountWithComma } from '../utils.js';
import { openAccountLedger, loadLedgerTable, printLedger, exportLedgerExcel, deleteBankingTransaction, shareLedgerWhatsApp } from './banking-ledger-ui.js';
import { openTransactionModal } from './banking-txn-modal.js';

let activeAccounts = [];
let currentCategoryFilter = 'all';
let currentSearchQuery = '';

export async function renderBankingLedger(container) {
    if (window.AppState.currentUserRole === 'Staff' && window.AppState.permissions.viewBanking === false) {
        container.innerHTML = `<div class="m3-card text-center font-bn py-12"><h2 class="text-xl font-bold text-red-500">অ্যাক্সেস ডিনাইড!</h2></div>`;
        return;
    }

    container.innerHTML = `
        <div class="flex flex-col gap-5 font-bn">
            <!-- Top Header & Action Buttons -->
            <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-slate-900/60 p-4 rounded-2xl border border-slate-800 shadow-xl">
                <div class="flex items-center gap-3">
                    <div class="w-2 h-7 bg-purple-500 rounded-full shadow-[0_0_15px_rgba(168,85,247,0.5)]"></div>
                    <h2 class="text-xl md:text-2xl font-black text-white flex items-center gap-2">
                        <span>ব্যাংকিং ও ক্যাশ লেজার</span>
                        <button class="w-7 h-7 rounded-lg hover:bg-slate-800 flex items-center justify-center text-slate-500 hover:text-purple-400 transition-all active:rotate-180 cursor-pointer" onclick="window.renderBankingLedger(document.getElementById('view-container'))" title="রিফ্রেশ">
                            <i class="fa-solid fa-rotate text-xs"></i>
                        </button>
                    </h2>
                </div>
                <div class="flex flex-wrap items-center gap-2.5 w-full sm:w-auto justify-end">
                    <button data-perm="addBankDeposit" class="h-9 px-3.5 bg-emerald-600/90 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold transition-all shadow-md shadow-emerald-600/20 active:scale-95 flex items-center gap-2 cursor-pointer" onclick="window.bankingApp.openTransactionModal('DEPOSIT')">
                        <i class="fa-solid fa-arrow-down text-xs"></i><span>ম্যানুয়াল জমা</span>
                    </button>
                    <button data-perm="addBankWithdrawal" class="h-9 px-3.5 bg-red-600/90 hover:bg-red-500 text-white rounded-xl text-xs font-bold transition-all shadow-md shadow-red-600/20 active:scale-95 flex items-center gap-2 cursor-pointer" onclick="window.bankingApp.openTransactionModal('WITHDRAWAL')">
                        <i class="fa-solid fa-arrow-up text-xs"></i><span>টাকা উত্তোলন</span>
                    </button>
                    <button data-perm="addBankTransfer" class="h-9 px-3.5 bg-blue-600/90 hover:bg-blue-500 text-white rounded-xl text-xs font-bold transition-all shadow-md shadow-blue-600/20 active:scale-95 flex items-center gap-2 cursor-pointer" onclick="window.bankingApp.openTransactionModal('TRANSFER')">
                        <i class="fa-solid fa-right-left text-xs"></i><span>ফান্ড ট্রান্সফার</span>
                    </button>
                </div>
            </div>

            <!-- Treasury Summary KPI Section -->
            <div id="banking-dashboard-container"></div>

            <!-- Filter Tabs & Account Search -->
            <div class="flex flex-col sm:flex-row items-center justify-between gap-3 bg-slate-900/40 p-3 rounded-2xl border border-slate-800/80">
                <div class="flex items-center gap-1.5 w-full sm:w-auto overflow-x-auto" id="banking-filter-tabs">
                    <button type="button" onclick="window.bankingApp.setCategoryFilter('all')" class="banking-tab-btn active px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer bg-purple-600 text-white shadow-md" data-tab="all">
                        সকল অ্যাকাউন্ট (<span id="count-all">0</span>)
                    </button>
                    <button type="button" onclick="window.bankingApp.setCategoryFilter('bank')" class="banking-tab-btn px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer bg-slate-800 text-slate-400 hover:text-white" data-tab="bank">
                        <i class="fa-solid fa-building-columns mr-1 text-blue-400"></i> ব্যাংকসমূহ (<span id="count-bank">0</span>)
                    </button>
                    <button type="button" onclick="window.bankingApp.setCategoryFilter('cash')" class="banking-tab-btn px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer bg-slate-800 text-slate-400 hover:text-white" data-tab="cash">
                        <i class="fa-solid fa-wallet mr-1 text-emerald-400"></i> ক্যাশ বক্স (<span id="count-cash">0</span>)
                    </button>
                </div>
                <div class="relative w-full sm:w-64">
                    <i class="fa-solid fa-magnifying-glass absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 text-xs"></i>
                    <input type="text" id="banking-acc-search" onkeyup="window.bankingApp.handleSearch(this.value)" placeholder="অ্যাকাউন্ট খুঁজুন..." class="w-full bg-slate-950/80 border border-slate-700/80 rounded-xl pl-8 pr-3 py-1.5 text-xs text-white outline-none focus:border-purple-500 shadow-inner">
                </div>
            </div>

            <!-- Accounts Grid -->
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4" id="banking-accounts-grid">
                <div class="text-center py-12 col-span-full text-slate-400 font-bold italic"><i class="fa-solid fa-spinner fa-spin mr-2"></i>অ্যাকাউন্ট ব্যালেন্স লোড হচ্ছে...</div>
            </div>
        </div>
    `;

    await loadAndRenderAccounts();
}

async function loadAndRenderAccounts() {
    try {
        const [banks, cash] = await Promise.all([
            BankDAO.getActiveBanks(),
            CashCollectorDAO.getActiveCollectors()
        ]);
        
        activeAccounts = [
            ...banks.map(b => ({ ...b, isCash: false })),
            ...cash.map(c => ({ ...c, isCash: true }))
        ];

        // Fetch balances concurrently
        const balances = await Promise.all(activeAccounts.map(acc => calculateAccountBalance(acc.name, acc.isCash)));
        activeAccounts.forEach((acc, i) => { acc.balance = balances[i]; });

        renderAccountCards();
        await loadBankingDashboard('month');
    } catch (e) {
        console.error("Error loading accounts:", e);
        const grid = document.getElementById('banking-accounts-grid');
        if (grid) grid.innerHTML = `<div class="text-center py-12 col-span-full text-red-400 font-bold">ব্যালেন্স লোড করতে সমস্যা হয়েছে!</div>`;
    }
}

function renderAccountCards() {
    const grid = document.getElementById('banking-accounts-grid');
    if (!grid) return;

    const bankCount = activeAccounts.filter(a => !a.isCash).length;
    const cashCount = activeAccounts.filter(a => a.isCash).length;
    const countAllEl = document.getElementById('count-all');
    const countBankEl = document.getElementById('count-bank');
    const countCashEl = document.getElementById('count-cash');
    if (countAllEl) countAllEl.innerText = activeAccounts.length;
    if (countBankEl) countBankEl.innerText = bankCount;
    if (countCashEl) countCashEl.innerText = cashCount;

    const query = currentSearchQuery.toLowerCase().trim();
    const filtered = activeAccounts.filter(acc => {
        const matchCat = currentCategoryFilter === 'all' ? true : (currentCategoryFilter === 'cash' ? acc.isCash : !acc.isCash);
        const matchSearch = query ? acc.name.toLowerCase().includes(query) : true;
        return matchCat && matchSearch;
    });

    if (filtered.length === 0) {
        grid.innerHTML = `<div class="col-span-full text-center py-12 text-slate-500 font-bold italic">কোনো অ্যাকাউন্ট পাওয়া যায়নি।</div>`;
        return;
    }

    grid.innerHTML = filtered.map(acc => {
        const balance = acc.balance || 0;
        const isOverdrawn = balance < 0;
        const isCash = acc.isCash;
        const icon = isCash 
            ? '<i class="fa-solid fa-wallet text-emerald-400 text-xl"></i>' 
            : '<i class="fa-solid fa-building-columns text-blue-400 text-xl"></i>';
        const iconBg = isCash ? 'bg-emerald-500/10 border-emerald-500/20' : 'bg-blue-500/10 border-blue-500/20';
        const typeBadge = isCash 
            ? '<span class="px-2 py-0.5 rounded-md text-[10px] font-black bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 uppercase tracking-wider">CASH BOX</span>' 
            : '<span class="px-2 py-0.5 rounded-md text-[10px] font-black bg-blue-500/10 text-blue-400 border border-blue-500/20 uppercase tracking-wider">BANK</span>';
        const overdrawnBadge = isOverdrawn 
            ? '<span class="px-2 py-0.5 rounded-md text-[10px] font-black bg-red-500/20 text-red-400 border border-red-500/40 animate-pulse flex items-center gap-1"><i class="fa-solid fa-triangle-exclamation text-[9px]"></i> ঘাটতি</span>' 
            : '';
        const cardBorder = isOverdrawn 
            ? 'border-red-500/50 bg-gradient-to-br from-red-950/20 to-slate-900/90 shadow-red-950/20' 
            : 'border-slate-800/90 bg-slate-900/80 hover:border-purple-500/50 hover:shadow-purple-950/20';

        const jsName = acc.name.replace(/'/g, "\\'");

        return `
            <div class="m3-card relative overflow-hidden group cursor-pointer ${cardBorder} transition-all duration-300 shadow-xl rounded-2xl p-5 hover:translate-y-[-2px]" onclick="window.bankingApp.viewAccountLedger('${jsName}', ${isCash})">
                <div class="flex items-start justify-between mb-3">
                    <div class="w-11 h-11 rounded-xl ${iconBg} border flex items-center justify-center shadow-md">
                        ${icon}
                    </div>
                    <div class="flex items-center gap-1.5">
                        ${overdrawnBadge}
                        ${typeBadge}
                    </div>
                </div>
                <div>
                    <h3 class="text-base font-black text-white truncate group-hover:text-purple-300 transition-colors">${acc.name}</h3>
                    <div class="text-[11px] font-bold text-slate-400 mt-0.5 mb-1.5">বর্তমান ব্যালেন্স</div>
                    <div class="text-2xl lg:text-3xl font-black font-mono ${isOverdrawn ? 'text-red-400' : 'text-white'} tracking-tight">৳ ${formatAmountWithComma(balance)}</div>
                </div>
                
                <div class="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs font-bold text-slate-400 group-hover:text-purple-300">
                    <span class="flex items-center gap-1.5"><i class="fa-solid fa-book-open text-[11px] text-purple-400"></i> লেজার খতিয়ান</span>
                    <i class="fa-solid fa-arrow-right text-[11px] transform group-hover:translate-x-1 transition-transform"></i>
                </div>

                <div class="absolute bottom-0 left-0 w-full h-1 bg-slate-800">
                    <div class="h-full bg-gradient-to-r ${isOverdrawn ? 'from-red-500 to-rose-600' : 'from-purple-500 to-blue-500'} w-0 group-hover:w-full transition-all duration-500"></div>
                </div>
            </div>
        `;
    }).join('');
}

async function loadBankingDashboard(timeFilter = 'month') {
    const container = document.getElementById('banking-dashboard-container');
    if (!container) return;

    try {
        const summary = await getBankingSummary(timeFilter);
        const totalBankBalance = activeAccounts.filter(a => !a.isCash).reduce((sum, a) => sum + (a.balance || 0), 0);
        const totalCashBalance = activeAccounts.filter(a => a.isCash).reduce((sum, a) => sum + (a.balance || 0), 0);
        const totalCapital = totalBankBalance + totalCashBalance;
        
        container.innerHTML = `
            <div class="m3-card bg-slate-900/90 border border-slate-800/90 p-4 md:p-5 rounded-2xl shadow-2xl font-bn">
                <div class="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800/80 pb-3 mb-4">
                    <div class="flex items-center gap-2.5">
                        <div class="w-8 h-8 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-400 flex items-center justify-center text-sm font-black shadow-sm">
                            <i class="fa-solid fa-chart-pie"></i>
                        </div>
                        <div>
                            <h3 class="text-base font-black text-white">লিকুইডিটি ও ট্রেজারি সামারি</h3>
                            <p class="text-[10px] text-slate-400 font-bold">ব্যবসায়িক ক্যাশ ও ব্যাংক তহবিলের বর্তমান অবস্থা</p>
                        </div>
                    </div>
                    <div class="flex items-center gap-2">
                        <input type="text" id="banking-custom-range" class="${timeFilter.includes('to') ? '' : 'hidden'} bg-slate-950 border border-slate-700 text-white text-xs font-bold rounded-xl px-3 py-1.5 outline-none focus:border-purple-500 w-52 datepicker text-center" data-mode="range" placeholder="DD/MM/YYYY to DD/MM/YYYY" value="${timeFilter.includes('to') ? timeFilter : ''}" onchange="if(this.value.includes(' to ')) window.bankingApp.loadBankingDashboard(this.value)">
                        <select id="banking-summary-filter" class="bg-slate-950 border border-slate-700/80 text-purple-300 text-xs font-black rounded-xl px-3 py-1.5 outline-none focus:border-purple-500 cursor-pointer shadow-inner" onchange="if(this.value === 'custom') { document.getElementById('banking-custom-range').classList.remove('hidden'); document.getElementById('banking-custom-range').focus(); } else { document.getElementById('banking-custom-range').classList.add('hidden'); window.bankingApp.loadBankingDashboard(this.value); }">
                            <option value="today" ${timeFilter === 'today' ? 'selected' : ''}>আজকের সামারি (Today)</option>
                            <option value="month" ${timeFilter === 'month' ? 'selected' : ''}>চলতি মাস (This Month)</option>
                            <option value="lastMonth" ${timeFilter === 'lastMonth' ? 'selected' : ''}>গত মাস (Last Month)</option>
                            <option value="year" ${timeFilter === 'year' ? 'selected' : ''}>চলতি বছর (This Year)</option>
                            <option value="all" ${timeFilter === 'all' ? 'selected' : ''}>সর্বমোট (All Time)</option>
                            <option value="custom" ${timeFilter.includes('to') ? 'selected' : ''}>কাস্টম তারিখ ফিল্টার...</option>
                        </select>
                    </div>
                </div>

                <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
                    <div class="bg-slate-950/80 p-4 rounded-xl border border-slate-800 shadow-inner">
                        <div class="flex items-center justify-between mb-1">
                            <p class="text-slate-400 text-[10px] font-bold uppercase tracking-wider">মোট আদায় ও কালেকশন</p>
                            <i class="fa-solid fa-arrow-down text-emerald-400 text-xs"></i>
                        </div>
                        <h4 class="text-emerald-400 font-black text-xl font-mono">৳ ${formatAmountWithComma(summary.totalCustomerCollections || 0)}</h4>
                    </div>
                    <div class="bg-slate-950/80 p-4 rounded-xl border border-slate-800 shadow-inner">
                        <div class="flex items-center justify-between mb-1">
                            <p class="text-slate-400 text-[10px] font-bold uppercase tracking-wider">ম্যানুয়াল উত্তোলন</p>
                            <i class="fa-solid fa-arrow-up text-red-400 text-xs"></i>
                        </div>
                        <h4 class="text-red-400 font-black text-xl font-mono">৳ ${formatAmountWithComma(summary.totalWithdrawals || 0)}</h4>
                    </div>
                    <div class="bg-slate-950/80 p-4 rounded-xl border border-emerald-900/40 relative overflow-hidden shadow-inner">
                        <div class="absolute -right-4 -top-4 w-16 h-16 bg-emerald-600/20 rounded-full blur-xl"></div>
                        <div class="flex items-center justify-between mb-1 relative z-10">
                            <p class="text-emerald-300 text-[10px] font-bold uppercase tracking-wider">মোট নগদ ক্যাশ ফান্ড</p>
                            <i class="fa-solid fa-wallet text-emerald-400 text-xs"></i>
                        </div>
                        <h4 class="text-emerald-400 font-black text-xl font-mono relative z-10">৳ ${formatAmountWithComma(totalCashBalance)}</h4>
                    </div>
                    <div class="bg-slate-950/80 p-4 rounded-xl border border-purple-900/40 relative overflow-hidden shadow-inner">
                        <div class="absolute -right-4 -top-4 w-16 h-16 bg-purple-600/20 rounded-full blur-xl"></div>
                        <div class="flex items-center justify-between mb-1 relative z-10">
                            <p class="text-purple-300 text-[10px] font-bold uppercase tracking-wider">মোট ব্যাংক তহবিল</p>
                            <i class="fa-solid fa-building-columns text-purple-400 text-xs"></i>
                        </div>
                        <h4 class="text-purple-400 font-black text-xl font-mono relative z-10">৳ ${formatAmountWithComma(totalBankBalance)}</h4>
                    </div>
                </div>

                <div class="mt-3.5 pt-3 border-t border-slate-800/60 flex items-center justify-between text-xs">
                    <span class="text-slate-400 font-bold">ব্যবসায়ের সর্বমোট চলতি তহবিল (Liquid Capital):</span>
                    <span class="text-sm font-black font-mono text-white bg-slate-800/80 px-3 py-1 rounded-xl border border-slate-700">৳ ${formatAmountWithComma(totalCapital)}</span>
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
    openTransactionModal: (type) => openTransactionModal(type, activeAccounts, loadAndRenderAccounts),
    loadBankingDashboard,
    viewAccountLedger: (acc, isCash) => {
        if (typeof window !== 'undefined' && window.bankingApp) {
            window.bankingApp.isCurrentAccountCash = isCash;
        }
        openAccountLedger(acc, isCash);
    },
    setCategoryFilter: (cat) => {
        currentCategoryFilter = cat;
        document.querySelectorAll('.banking-tab-btn').forEach(btn => {
            const isMatch = btn.getAttribute('data-tab') === cat;
            btn.className = isMatch 
                ? 'banking-tab-btn active px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer bg-purple-600 text-white shadow-md' 
                : 'banking-tab-btn px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer bg-slate-800 text-slate-400 hover:text-white';
        });
        renderAccountCards();
    },
    handleSearch: (val) => {
        currentSearchQuery = val || '';
        renderAccountCards();
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

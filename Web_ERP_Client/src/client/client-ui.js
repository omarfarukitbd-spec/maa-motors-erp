import { db } from '../firebase-config.js';
import {
    activeCustomer,
    allCustomersCache,
    previousViewName,
    setAppSettings,
    setAllCustomersCache,
    setPreviousViewName,
    setUnsubscribeCustomers,
    setUnsubscribeToday
} from './client-state.js';
import { loadAndRenderCustomerLedger } from './client-logic.js';

/**
 * Format Numbers with commas (৳ 1,50,000)
 */
export function formatMoney(amount) {
    const num = Number(amount) || 0;
    return '৳ ' + Math.abs(num).toLocaleString('en-IN');
}

/**
 * Render Login Screen
 */
export function renderLoginView(container) {
    container.innerHTML = `
        <div class="space-y-6 pt-6">
            <!-- Hero Card -->
            <div class="client-card p-6 text-center space-y-3 relative overflow-hidden border-sky-500/30">
                <div class="absolute -right-8 -top-8 w-32 h-32 bg-sky-500/10 rounded-full blur-2xl pointer-events-none"></div>
                <div class="w-16 h-16 bg-gradient-to-tr from-sky-500 to-blue-600 rounded-2xl mx-auto flex items-center justify-center text-white text-2xl font-black shadow-xl shadow-sky-500/30">
                    <i class="fa-solid fa-store"></i>
                </div>
                <h2 class="text-xl font-black text-white tracking-tight">মা মোটরস কাস্টমার ও বস পোর্টাল</h2>
                <p class="text-xs text-slate-300 font-medium">হিসাব বিবরণী, লেনদেন এবং স্টেটমেন্ট দেখতে একাউন্ট নম্বর বা মাস্টার পিন দিন</p>
            </div>

            <!-- Login Form Card -->
            <div class="client-card p-6 space-y-4">
                <div class="space-y-2">
                    <label class="block text-xs font-bold text-sky-400 uppercase tracking-wider">A/C নম্বর বা মাস্টার পিন (A/C No or Master PIN)</label>
                    <div class="relative">
                        <input type="text" id="login-input" class="client-field text-lg text-center tracking-widest font-mono py-3 pr-10" placeholder="উদাঃ 10005 বা 1060" autofocus autocomplete="off">
                        <button type="button" class="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white" onclick="document.getElementById('login-input').value=''">
                            <i class="fa-solid fa-circle-xmark"></i>
                        </button>
                    </div>
                </div>

                <button id="login-btn" onclick="window.handleLoginSubmit()" class="client-btn-primary py-3.5 text-base">
                    <span>পোর্টাল প্রবেশ করুন</span>
                    <i class="fa-solid fa-arrow-right"></i>
                </button>

                <div class="pt-2 text-center">
                    <p class="text-[11px] text-slate-400 font-medium">💡 বস সম্পূর্ণ অ্যাক্সেস পেতে মাস্টার পিন <strong class="text-sky-400 font-bold font-mono">1060</strong> ব্যবহার করুন</p>
                </div>
            </div>
        </div>
    `;

    document.getElementById('login-input')?.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') window.handleLoginSubmit();
    });
}

export function renderWelcomeBossCard() {
    const totalMarketDue = allCustomersCache.reduce((acc, c) => acc + (Number(c.totalDue) || 0), 0);

    return `
        <div class="space-y-4">
            <!-- KPI Cards Grid -->
            <div class="grid grid-cols-2 gap-3">
                <div class="client-card p-4 border-l-4 border-red-500 bg-red-500/5">
                    <p class="text-[10px] font-black text-red-400 uppercase">মার্কেটে মোট বকেয়া</p>
                    <p class="text-xl font-black text-white mt-1">${formatMoney(totalMarketDue)}</p>
                </div>
                <div class="client-card p-4 border-l-4 border-sky-500 bg-sky-500/5">
                    <p class="text-[10px] font-black text-sky-400 uppercase">মোট কাস্টমার সংখ্যা</p>
                    <p class="text-xl font-black text-white mt-1">${allCustomersCache.length} জন</p>
                </div>
            </div>

            <!-- Recent Dues Quick List -->
            <div class="client-card p-4 space-y-3">
                <div class="flex justify-between items-center border-b border-slate-800 pb-2">
                    <h3 class="text-xs font-black text-white uppercase flex items-center gap-1.5">
                        <i class="fa-solid fa-fire text-amber-400"></i>
                        <span>শীর্ষ বকেয়া কাস্টমার তালিকা</span>
                    </h3>
                    <span class="text-[10px] text-slate-400 font-bold">টপ ১০</span>
                </div>

                <div class="space-y-2">
                    ${allCustomersCache
                        .filter(c => (Number(c.totalDue) || 0) > 0)
                        .sort((a, b) => (Number(b.totalDue) || 0) - (Number(a.totalDue) || 0))
                        .slice(0, 10)
                        .map((c, i) => `
                            <div class="flex items-center justify-between p-2.5 rounded-xl bg-slate-900/80 border border-slate-800 hover:border-sky-500/50 cursor-pointer transition-all" onclick="window.selectCustomerById('${c.id}')">
                                <div class="flex items-center gap-2.5">
                                    <span class="w-6 h-6 rounded-lg bg-sky-500/10 text-sky-400 font-black text-xs flex items-center justify-center">${i + 1}</span>
                                    <div>
                                        <p class="text-xs font-black text-white truncate max-w-[130px]">${c.name || 'Unknown'}</p>
                                        <p class="text-[10px] text-slate-400 font-bold">A/C: ${c.accountNo || '-'} • ${c.phone || '-'}</p>
                                    </div>
                                </div>
                                <div class="text-right">
                                    <span class="text-xs font-black text-red-400">${formatMoney(c.totalDue)}</span>
                                    <div class="text-[9px] text-slate-500 font-bold">বকেয়া</div>
                                </div>
                            </div>
                        `).join('') || '<p class="text-xs text-slate-500 italic text-center py-4">কোনো বকেয়া কাস্টমার নেই</p>'}
                </div>
            </div>
        </div>
    `;
}

/**
 * Render Customer / Boss Search & Statement Dashboard (Tab 1: Search)
 */
export async function renderDashboardView(container, session) {
    setPreviousViewName('dashboard');

    // Load Settings
    try {
        const sSnap = await db.collection('settings').doc('app_settings').get();
        if (sSnap.exists) setAppSettings(sSnap.data());
    } catch(e) {}

    // Boss / Universal Search View Render
    container.innerHTML = `
        <div class="space-y-4">
            <!-- Search Control Card -->
            <div class="client-card p-4 space-y-3">
                <div class="flex items-center justify-between">
                    <span class="text-xs font-black text-sky-400 uppercase tracking-wider flex items-center gap-1.5">
                        <i class="fa-solid fa-magnifying-glass"></i>
                        <span>স্মার্ট ওমনি-সার্চ (Omni-Search)</span>
                    </span>
                    <span class="text-[10px] bg-sky-500/10 text-sky-400 border border-sky-500/30 px-2.5 py-0.5 rounded-full font-bold">লাইভ ডাটা</span>
                </div>

                <div class="relative">
                    <input type="text" id="omni-search-input" class="client-field text-sm font-bold pl-10 pr-10 py-3" placeholder="নাম, A/C No, ভাউচার নং বা মোবাইল নম্বর লিখুন..." oninput="window.handleOmniSearch(this.value)">
                    <i class="fa-solid fa-search absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"></i>
                    <button type="button" class="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white" onclick="document.getElementById('omni-search-input').value=''; window.handleOmniSearch('')">
                        <i class="fa-solid fa-circle-xmark"></i>
                    </button>
                </div>

                <!-- Instant Search Suggestions Dropdown -->
                <div id="search-results-dropdown" class="space-y-1 max-h-60 overflow-y-auto hidden pt-1 border-t border-slate-800"></div>
            </div>

            <!-- Dashboard Main Display -->
            <div id="client-main-content">
                ${renderWelcomeBossCard()}
            </div>
        </div>
    `;

    // Real-Time Listener for Customers Data
    const unsub = db.collection('customers').onSnapshot(snap => {
        const cache = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setAllCustomersCache(cache);

        if (session.role === 'Customer' && session.customerId) {
            const customer = cache.find(c => c.id === session.customerId);
            if (customer) {
                loadAndRenderCustomerLedger(container, customer);
                return;
            }
        }

        const mainContent = document.getElementById('client-main-content');
        if (mainContent) {
            mainContent.innerHTML = renderWelcomeBossCard();
        }
    }, err => {
        console.error("Customers snapshot error:", err);
    });

    setUnsubscribeCustomers(unsub);
}

export function renderDirectoryCardsHtml(customers) {
    if (!customers || customers.length === 0) {
        return `<div class="client-card p-8 text-center text-slate-500 font-bold text-xs italic">কোনো কাস্টমার পাওয়া যায়নি</div>`;
    }

    return customers.map(c => {
        const due = Number(c.totalDue) || 0;

        return `
            <div class="client-card p-3.5 flex justify-between items-center hover:border-purple-500/50 cursor-pointer transition-all" onclick="window.selectCustomerById('${c.id}')">
                <div class="space-y-1">
                    <p class="text-xs font-black text-white">${c.name || 'Unknown'}</p>
                    <p class="text-[10px] text-slate-400 font-bold">
                        A/C: <span class="text-sky-400 font-mono">${c.accountNo || '-'}</span> • Mobile: ${c.phone || '-'}
                    </p>
                    ${c.zone ? `<span class="inline-block text-[9px] bg-slate-900 text-slate-300 px-2 py-0.5 rounded border border-slate-800 font-bold">${c.zone}</span>` : ''}
                </div>
                <div class="text-right">
                    <span class="text-xs font-black ${due > 0 ? 'text-red-400' : 'text-emerald-400'}">${formatMoney(due)}</span>
                    <p class="text-[9px] text-slate-500 font-bold">${due > 0 ? 'বকেয়া' : 'পরিশোধিত'}</p>
                </div>
            </div>
        `;
    }).join('');
}

/**
 * Render All Customers Directory View (Tab 3: Directory)
 */
export async function renderCustomerDirectoryView(container) {
    setPreviousViewName('directory');

    container.innerHTML = `
        <div class="space-y-4">
            <div class="client-card p-4 space-y-3">
                <div class="flex justify-between items-center">
                    <div>
                        <span class="text-[10px] font-black text-purple-400 uppercase tracking-widest">CUSTOMER DIRECTORY</span>
                        <h2 class="text-lg font-black text-white leading-tight">সকল কাস্টমার তালিকা</h2>
                    </div>
                    <span id="dir-count-badge" class="px-2.5 py-1 rounded-full bg-purple-500/10 text-purple-400 border border-purple-500/30 text-xs font-bold">${allCustomersCache.length} জন</span>
                </div>

                <div class="relative">
                    <input type="text" id="dir-search-input" class="client-field text-sm font-bold pl-10 py-2.5" placeholder="কাস্টমার ফিল্টার করুন..." oninput="window.filterDirectoryList(this.value)">
                    <i class="fa-solid fa-search absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"></i>
                </div>
            </div>

            <div id="directory-customers-list" class="space-y-2">
                ${renderDirectoryCardsHtml(allCustomersCache)}
            </div>
        </div>
    `;
}

export function renderTxnCardsHtml(txns) {
    if (txns.length === 0) {
        return `<div class="client-card p-8 text-center text-slate-500 font-bold text-xs italic">কোনো লেনদেন রেকর্ড পাওয়া যায়নি</div>`;
    }

    return txns.map(t => {
        const b = Number(t.bill) || 0;
        const p = Number(t.paid) || 0;
        const dateStr = t.date ? t.date.split('-').reverse().join('/') : '-';

        return `
            <div class="client-card p-3.5 space-y-2">
                <div class="flex justify-between items-start border-b border-slate-800/80 pb-2">
                    <div>
                        <span class="text-[10px] font-mono font-bold text-sky-400">${t.voucherNo ? '#' + t.voucherNo : 'মেমো'}</span>
                        <p class="text-xs font-black text-white mt-0.5">${t.voucherNo ? 'বিক্রয় বিল মেমো' : (p > 0 ? 'জমা গ্রহণ (Payment Received)' : 'লেনদেন')}</p>
                    </div>
                    <span class="text-[10px] font-bold text-slate-400 font-mono">${dateStr}</span>
                </div>

                <div class="grid grid-cols-2 gap-2 text-xs">
                    <div>
                        <span class="text-[10px] text-slate-400 font-bold">খরচ (Debit):</span>
                        <p class="font-black ${b > 0 ? 'text-red-400' : 'text-slate-500'}">${b > 0 ? formatMoney(b) : '-'}</p>
                    </div>
                    <div class="text-right">
                        <span class="text-[10px] text-slate-400 font-bold">জমা (Credit):</span>
                        <p class="font-black ${p > 0 ? 'text-emerald-400' : 'text-slate-500'}">${p > 0 ? formatMoney(p) : '-'}</p>
                    </div>
                </div>
                ${t.notes ? `<p class="text-[10px] text-slate-400 italic bg-slate-900/60 p-1.5 rounded-lg border border-slate-800">• ${t.notes}</p>` : ''}
            </div>
        `;
    }).join('');
}

/**
 * Render Customer Ledger View with Date Filters & Prominent Back Button
 */
export function renderCustomerLedgerView(container, customer, txns) {
    let totBill = 0, totPaid = 0;
    txns.forEach(t => {
        totBill += Number(t.bill) || 0;
        totPaid += Number(t.paid) || 0;
    });

    const currentDue = Number(customer.totalDue) || 0;

    container.innerHTML = `
        <div class="space-y-4">
            <!-- Navigation Back Bar -->
            <div class="flex items-center justify-between">
                <button onclick="window.navTo('${previousViewName}')" class="px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-sky-400 hover:text-white font-bold text-xs flex items-center gap-1.5 transition-colors">
                    <i class="fa-solid fa-arrow-left"></i>
                    <span>ফিরে যান (${previousViewName === 'directory' ? 'কাস্টমার তালিকা' : 'ড্যাশবোর্ড'})</span>
                </button>
            </div>

            <!-- Customer Details Card -->
            <div class="client-card p-4 border-l-4 border-sky-500 space-y-3">
                <div class="flex justify-between items-start">
                    <div>
                        <span class="text-[10px] font-black text-sky-400 uppercase tracking-widest">CUSTOMER PROFILE</span>
                        <h2 class="text-lg font-black text-white leading-tight mt-0.5">${customer.name}</h2>
                        <p class="text-xs text-slate-300 font-bold mt-1">
                            A/C No: <span class="text-sky-400 font-mono font-black">${customer.accountNo || '-'}</span> | Mobile: ${customer.phone || '-'}
                        </p>
                        ${customer.address ? `<p class="text-[11px] text-slate-400 mt-1">${customer.address}</p>` : ''}
                    </div>
                    <button onclick="window.triggerPrintCurrentStatement()" class="px-3 py-2 rounded-xl bg-sky-500 hover:bg-sky-400 text-white font-black text-xs shadow-lg shadow-sky-500/20 flex items-center gap-1.5 shrink-0">
                        <i class="fa-solid fa-print"></i>
                        <span>A4 PDF</span>
                    </button>
                </div>

                <!-- Financial Summary Badges -->
                <div class="grid grid-cols-3 gap-2 pt-2 border-t border-slate-800">
                    <div class="bg-slate-900/90 p-2 rounded-xl text-center border border-slate-800">
                        <p class="text-[9px] font-black text-red-400 uppercase">মোট বিল</p>
                        <p class="text-xs font-black text-white mt-0.5">${formatMoney(totBill)}</p>
                    </div>
                    <div class="bg-slate-900/90 p-2 rounded-xl text-center border border-slate-800">
                        <p class="text-[9px] font-black text-emerald-400 uppercase">মোট জমা</p>
                        <p class="text-xs font-black text-white mt-0.5">${formatMoney(totPaid)}</p>
                    </div>
                    <div class="bg-sky-500/10 p-2 rounded-xl text-center border border-sky-500/30">
                        <p class="text-[9px] font-black text-sky-400 uppercase">বর্তমান বকেয়া</p>
                        <p class="text-xs font-black text-sky-300 mt-0.5">${formatMoney(currentDue)}</p>
                    </div>
                </div>
            </div>

            <!-- Date Presets & Filter Bar -->
            <div class="client-card p-3 space-y-2">
                <div class="flex items-center justify-between text-xs font-bold text-slate-300">
                    <span><i class="fa-solid fa-filter text-sky-400 mr-1"></i>ফিল্টার সময়কাল:</span>
                    <span id="date-filter-label" class="text-[10px] text-sky-400 font-mono">সব সময়</span>
                </div>
                <div class="grid grid-cols-4 gap-1.5 text-xs font-bold">
                    <button onclick="window.applyDatePreset('all')" class="py-1.5 rounded-lg bg-sky-500 text-white text-[11px] text-center" id="preset-all">সব সময়</button>
                    <button onclick="window.applyDatePreset('today')" class="py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-[11px] text-center" id="preset-today">আজকে</button>
                    <button onclick="window.applyDatePreset('month')" class="py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-[11px] text-center" id="preset-month">এই মাস</button>
                    <button onclick="window.applyDatePreset('year')" class="py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-[11px] text-center" id="preset-year">এই বছর</button>
                </div>
            </div>

            <!-- Itemized Transactions Mobile Cards -->
            <div class="space-y-2.5" id="txns-cards-list">
                ${renderTxnCardsHtml(txns)}
            </div>
        </div>
    `;
}

/**
 * Render Today's Collection View (Tab 2: Today's Collection)
 */
export async function renderTodayCollectionView(container) {
    setPreviousViewName('today');
    const now = new Date();
    const todayStr = now.toISOString().split('T')[0];
    const formattedDate = `${now.getDate()}/${now.getMonth() + 1}/${now.getFullYear()}`;

    container.innerHTML = `
        <div class="space-y-4">
            <div class="client-card p-4 border-l-4 border-emerald-500 space-y-2">
                <div class="flex justify-between items-center">
                    <div>
                        <span class="text-[10px] font-black text-emerald-400 uppercase tracking-widest">TODAY'S COLLECTION</span>
                        <h2 class="text-lg font-black text-white leading-tight">আজকের জমা কালেকশন</h2>
                    </div>
                    <span class="px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-xs font-bold font-mono">${formattedDate}</span>
                </div>
                <div class="pt-2 border-t border-slate-800 flex justify-between items-center">
                    <span class="text-xs text-slate-400 font-bold">আজকের সর্বমোট কালেকশন:</span>
                    <span id="today-total-badge" class="text-xl font-black text-emerald-400">৳ 0</span>
                </div>
            </div>

            <div id="today-txns-list" class="space-y-2">
                <div class="client-card p-6 text-center text-slate-400 text-xs font-bold">
                    <i class="fa-solid fa-spinner fa-spin text-lg mb-2 text-emerald-400"></i>
                    <p>আজকের জমা ডাটা লোড হচ্ছে...</p>
                </div>
            </div>
        </div>
    `;

    const unsub = db.collection('transactions')
        .where('date', '==', todayStr)
        .onSnapshot(snap => {
            const todayTxns = snap.docs
                .map(doc => ({ id: doc.id, ...doc.data() }))
                .filter(t => (Number(t.paid) || 0) > 0);

            const totalPaid = todayTxns.reduce((sum, t) => sum + (Number(t.paid) || 0), 0);

            const badgeEl = document.getElementById('today-total-badge');
            if (badgeEl) badgeEl.innerText = formatMoney(totalPaid);

            const listEl = document.getElementById('today-txns-list');
            if (!listEl) return;

            if (todayTxns.length === 0) {
                listEl.innerHTML = `
                    <div class="client-card p-8 text-center text-slate-400 font-bold text-xs italic">
                        <i class="fa-solid fa-calendar-minus text-2xl text-slate-600 mb-2"></i>
                        <p>আজকে (${formattedDate}) এ পর্যন্ত কোনো জমা ভাউচার অ্যান্ট্রি হয়নি</p>
                    </div>
                `;
                return;
            }

            listEl.innerHTML = todayTxns.map(t => `
                <div class="client-card p-3.5 space-y-2 border-l-4 border-emerald-500/80 hover:border-emerald-400 cursor-pointer transition-all" onclick="window.selectCustomerById('${t.customerId}')">
                    <div class="flex justify-between items-start">
                        <div>
                            <p class="text-xs font-black text-white">${t.customerName || 'Customer'}</p>
                            <p class="text-[10px] text-slate-400 font-bold">Voucher: <span class="text-sky-400 font-mono">#${t.voucherNo || '-'}</span></p>
                        </div>
                        <div class="text-right">
                            <span class="text-sm font-black text-emerald-400">${formatMoney(t.paid)}</span>
                            <div class="text-[9px] text-slate-400 font-bold">জমা হয়েছে</div>
                        </div>
                    </div>
                    ${t.notes ? `<p class="text-[10px] text-slate-400 italic bg-slate-900/60 p-1.5 rounded-lg border border-slate-800/80">• ${t.notes}</p>` : ''}
                </div>
            `).join('');
        }, err => {
            console.error("Today transactions snapshot error:", err);
        });

    setUnsubscribeToday(unsub);
}

import { GodownChallansDAO } from './godown-challans-dao.js';
import { showToast } from '../utils.js';
import { viewGodownChallanDetail, deleteGodownChallan } from './godown-challans-modal.js';

let _challansCache = [];
let _activeFilter = 'all'; // 'all' | 'inward' | 'outward' | 'today'
let _searchQuery = '';

/**
 * Format timestamp or date string to readable Bengali/English
 */
function formatDate(dateVal) {
    if (!dateVal) return '—';
    try {
        let d;
        if (typeof dateVal === 'string') {
            d = new Date(dateVal);
        } else if (dateVal.toDate) {
            d = dateVal.toDate();
        } else if (dateVal.seconds) {
            d = new Date(dateVal.seconds * 1000);
        } else {
            d = new Date(dateVal);
        }
        if (isNaN(d.getTime())) return String(dateVal);
        return d.toLocaleDateString('bn-BD', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        }) + ' ' + d.toLocaleTimeString('bn-BD', {
            hour: '2-digit',
            minute: '2-digit'
        });
    } catch (e) {
        console.error('Date format error:', e);
        return String(dateVal);
    }
}

/**
 * Check if a date falls on today
 */
function isToday(dateVal) {
    if (!dateVal) return false;
    try {
        const d = (dateVal.toDate) ? dateVal.toDate() : new Date(dateVal);
        const today = new Date();
        return d.getDate() === today.getDate() &&
               d.getMonth() === today.getMonth() &&
               d.getFullYear() === today.getFullYear();
    } catch (e) {
        console.error('Date check error:', e);
        return false;
    }
}

/**
 * Calculate KPI summary
 */
function calculateKPIs(list) {
    let inwardPcs = 0;
    let outwardPcs = 0;
    let todayCount = 0;
    let todayPcs = 0;

    for (const c of list) {
        const pcs = Number(c.totalPcs) || 0;
        if (c.sessionType === 'inward') {
            inwardPcs += pcs;
        } else if (c.sessionType === 'outward') {
            outwardPcs += pcs;
        }
        if (isToday(c.date)) {
            todayCount += 1;
            todayPcs += pcs;
        }
    }

    return {
        totalChallans: list.length,
        inwardPcs,
        outwardPcs,
        todayCount,
        todayPcs
    };
}

/**
 * Filter challans according to active tab and search query
 */
function getFilteredChallans() {
    let filtered = _challansCache;

    if (_activeFilter === 'inward') {
        filtered = filtered.filter(c => c.sessionType === 'inward');
    } else if (_activeFilter === 'outward') {
        filtered = filtered.filter(c => c.sessionType === 'outward');
    } else if (_activeFilter === 'today') {
        filtered = filtered.filter(c => isToday(c.date));
    }

    if (_searchQuery.trim() !== '') {
        const q = _searchQuery.trim().toLowerCase();
        filtered = filtered.filter(c => {
            const challanNo = (c.challanNo || '').toLowerCase();
            const customer = (c.customerName || c.destinationFor || '').toLowerCase();
            const phone = (c.customerPhone || '').toLowerCase();
            const vehicle = (c.vehicleNo || '').toLowerCase();
            const driver = (c.driverName || '').toLowerCase();
            const staff = (c.countedByUserName || '').toLowerCase();
            return challanNo.includes(q) ||
                   customer.includes(q) ||
                   phone.includes(q) ||
                   vehicle.includes(q) ||
                   driver.includes(q) ||
                   staff.includes(q);
        });
    }

    return filtered;
}

/**
 * Render Godown Challans Main View
 */
export function renderGodownChallansUI(container, params = {}) {
    if (!container) return;

    container.innerHTML = `
        <div class="space-y-6 font-bn">
            <!-- Header section -->
            <div class="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-900/60 p-5 rounded-2xl border border-slate-800 backdrop-blur-xl">
                <div>
                    <div class="flex items-center gap-2">
                        <span class="p-2 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-emerald-400">
                            <i class="fa-solid fa-truck-ramp-box text-xl"></i>
                        </span>
                        <div>
                            <h2 class="text-xl font-black text-white tracking-wide">গোডাউন চালান ও খালাস রেজিস্টার</h2>
                            <p class="text-xs text-slate-400">মা মোটরস গোডাউন-১ (মুরাদপুর) মোবাইল অ্যাপ থেকে সরাসরি সিঙ্ককৃত আনলোডিং ও ডেলিভারি গেটপাস</p>
                        </div>
                    </div>
                </div>
                <div class="flex items-center gap-2 shrink-0">
                    <span id="godown-sync-badge" class="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-full text-xs font-bold">
                        <span class="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                        <i class="fa-solid fa-cloud-arrow-down text-xs"></i>
                        <span>লাইভ সিঙ্ক চালু</span>
                    </span>
                    <button id="btn-refresh-challans" class="px-3.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-bold transition-all border border-slate-700 cursor-pointer">
                        <i class="fa-solid fa-rotate mr-1"></i> রিফ্রেশ
                    </button>
                </div>
            </div>

            <!-- KPI Cards -->
            <div id="godown-kpi-container" class="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <!-- Injected dynamically -->
            </div>

            <!-- Filter & Search Controls -->
            <div class="flex flex-col md:flex-row items-center justify-between gap-3 bg-slate-900/40 p-4 rounded-xl border border-slate-800/80">
                <div class="flex items-center gap-1.5 w-full md:w-auto overflow-x-auto pb-1 md:pb-0" id="filter-tabs-container">
                    <button data-filter="all" class="filter-tab-btn active px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer bg-blue-600 text-white">
                        সব চালান (<span id="count-all">0</span>)
                    </button>
                    <button data-filter="inward" class="filter-tab-btn px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer bg-slate-800 text-slate-400 hover:text-white">
                        <i class="fa-solid fa-arrow-down-long text-sky-400 mr-1"></i> আনলোডিং (<span id="count-inward">0</span>)
                    </button>
                    <button data-filter="outward" class="filter-tab-btn px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer bg-slate-800 text-slate-400 hover:text-white">
                        <i class="fa-solid fa-arrow-up-long text-emerald-400 mr-1"></i> ডেলিভারি (<span id="count-outward">0</span>)
                    </button>
                    <button data-filter="today" class="filter-tab-btn px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer bg-slate-800 text-slate-400 hover:text-white">
                        <i class="fa-solid fa-calendar-day text-amber-400 mr-1"></i> আজকের চালান (<span id="count-today">0</span>)
                    </button>
                </div>
                <div class="relative w-full md:w-72">
                    <i class="fa-solid fa-magnifying-glass absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 text-xs"></i>
                    <input type="text" id="challan-search-input" placeholder="চালান নং, কাস্টমার, গাড়ির নং..." class="w-full bg-slate-950 border border-slate-800 rounded-lg pl-8 pr-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500">
                </div>
            </div>

            <!-- Table Container -->
            <div class="bg-slate-900/60 rounded-2xl border border-slate-800 overflow-hidden shadow-xl">
                <div class="overflow-x-auto">
                    <table class="w-full text-left border-collapse text-xs">
                        <thead>
                            <tr class="bg-slate-950/80 text-slate-400 border-b border-slate-800 font-bold uppercase tracking-wider">
                                <th class="py-3 px-4">চালান নং / গেটপাস</th>
                                <th class="py-3 px-4">তারিখ ও সময়</th>
                                <th class="py-3 px-4">পার্টি / কাস্টমার</th>
                                <th class="py-3 px-4">গাড়ির নং ও ড্রাইভার</th>
                                <th class="py-3 px-4 text-center">মোট মাল</th>
                                <th class="py-3 px-4">কাউন্টার কর্মী</th>
                                <th class="py-3 px-4 text-center">অ্যাকশন</th>
                            </tr>
                        </thead>
                        <tbody id="challans-table-body" class="divide-y divide-slate-800/60 text-slate-300">
                            <tr>
                                <td colspan="7" class="py-12 text-center text-slate-500">
                                    <i class="fa-solid fa-circle-notch fa-spin text-xl text-blue-500 mb-2"></i>
                                    <p>চালান লোড হচ্ছে...</p>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    `;

    // Attach listeners
    const refreshBtn = document.getElementById('btn-refresh-challans');
    if (refreshBtn) {
        refreshBtn.onclick = async () => {
            refreshBtn.disabled = true;
            refreshBtn.innerHTML = `<i class="fa-solid fa-rotate fa-spin mr-1"></i> রিফ্রেশিং...`;
            const docs = await GodownChallansDAO.getAll();
            _challansCache = docs;
            updateUI();
            refreshBtn.disabled = false;
            refreshBtn.innerHTML = `<i class="fa-solid fa-rotate mr-1"></i> রিফ্রেশ`;
            showToast('চালান ডাটা রিফ্রেশ সম্পন্ন', 'success');
        };
    }

    // Filter tabs
    const tabBtns = container.querySelectorAll('.filter-tab-btn');
    tabBtns.forEach(btn => {
        btn.onclick = () => {
            tabBtns.forEach(b => {
                b.className = 'filter-tab-btn px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer bg-slate-800 text-slate-400 hover:text-white';
            });
            btn.className = 'filter-tab-btn active px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer bg-blue-600 text-white';
            _activeFilter = btn.dataset.filter || 'all';
            renderTableRows();
        };
    });

    // Search input
    const searchInput = document.getElementById('challan-search-input');
    if (searchInput) {
        searchInput.oninput = (e) => {
            _searchQuery = e.target.value;
            renderTableRows();
        };
    }

    // Subscribe to real-time changes
    GodownChallansDAO.subscribe(
        (docs) => {
            _challansCache = docs;
            updateUI();
        },
        (err) => {
            console.error('Firestore listener error:', err);
            const body = document.getElementById('challans-table-body');
            if (body && _challansCache.length === 0) {
                body.innerHTML = `
                    <tr>
                        <td colspan="7" class="py-8 text-center text-red-400">
                            <i class="fa-solid fa-triangle-exclamation text-lg mb-1"></i>
                            <p>চালান লোড করতে সমস্যা হয়েছে। রিফ্রেশ বোতামে চাপ দিন।</p>
                        </td>
                    </tr>
                `;
            }
        }
    );
}

function updateUI() {
    updateKPICards();
    updateTabCounts();
    renderTableRows();
}

function updateKPICards() {
    const kpiEl = document.getElementById('godown-kpi-container');
    if (!kpiEl) return;

    const stats = calculateKPIs(_challansCache);

    kpiEl.innerHTML = `
        <div class="bg-slate-900/80 p-4 rounded-xl border border-slate-800 shadow-lg">
            <div class="flex items-center justify-between text-slate-400 mb-2">
                <span class="text-xs font-bold uppercase tracking-wider">মোট চালান</span>
                <span class="p-1.5 bg-blue-500/10 text-blue-400 rounded-lg"><i class="fa-solid fa-receipt text-sm"></i></span>
            </div>
            <div class="text-2xl font-black text-white">${stats.totalChallans} <span class="text-xs font-normal text-slate-500">টি</span></div>
            <div class="text-[11px] text-slate-400 mt-1">গোডাউন-১ ক্লাউড রেজিস্টার</div>
        </div>

        <div class="bg-slate-900/80 p-4 rounded-xl border border-slate-800 shadow-lg">
            <div class="flex items-center justify-between text-slate-400 mb-2">
                <span class="text-xs font-bold uppercase tracking-wider">খালাস / আনলোডিং</span>
                <span class="p-1.5 bg-sky-500/10 text-sky-400 rounded-lg"><i class="fa-solid fa-arrow-down-long text-sm"></i></span>
            </div>
            <div class="text-2xl font-black text-sky-400">${stats.inwardPcs.toLocaleString('en-IN')} <span class="text-xs font-normal text-slate-500">পিস</span></div>
            <div class="text-[11px] text-slate-400 mt-1">গাড়ি থেকে নামানো মোট মাল</div>
        </div>

        <div class="bg-slate-900/80 p-4 rounded-xl border border-slate-800 shadow-lg">
            <div class="flex items-center justify-between text-slate-400 mb-2">
                <span class="text-xs font-bold uppercase tracking-wider">ডেলিভারি / লোডিং</span>
                <span class="p-1.5 bg-emerald-500/10 text-emerald-400 rounded-lg"><i class="fa-solid fa-arrow-up-long text-sm"></i></span>
            </div>
            <div class="text-2xl font-black text-emerald-400">${stats.outwardPcs.toLocaleString('en-IN')} <span class="text-xs font-normal text-slate-500">পিস</span></div>
            <div class="text-[11px] text-slate-400 mt-1">পার্টি বা শোরুমে পাঠানো মাল</div>
        </div>

        <div class="bg-slate-900/80 p-4 rounded-xl border border-slate-800 shadow-lg">
            <div class="flex items-center justify-between text-slate-400 mb-2">
                <span class="text-xs font-bold uppercase tracking-wider">আজকের চালান</span>
                <span class="p-1.5 bg-amber-500/10 text-amber-400 rounded-lg"><i class="fa-solid fa-calendar-day text-sm"></i></span>
            </div>
            <div class="text-2xl font-black text-amber-400">${stats.todayCount} <span class="text-xs font-normal text-slate-500">টি</span> <span class="text-sm font-bold text-slate-400">(${stats.todayPcs.toLocaleString('en-IN')} পিস)</span></div>
            <div class="text-[11px] text-slate-400 mt-1">আজকের মোট মুভমেন্ট</div>
        </div>
    `;
}

function updateTabCounts() {
    const stats = calculateKPIs(_challansCache);
    const countAll = document.getElementById('count-all');
    const countInward = document.getElementById('count-inward');
    const countOutward = document.getElementById('count-outward');
    const countToday = document.getElementById('count-today');

    if (countAll) countAll.innerText = _challansCache.length;
    if (countInward) countInward.innerText = _challansCache.filter(c => c.sessionType === 'inward').length;
    if (countOutward) countOutward.innerText = _challansCache.filter(c => c.sessionType === 'outward').length;
    if (countToday) countToday.innerText = stats.todayCount;
}

function renderTableRows() {
    const tbody = document.getElementById('challans-table-body');
    if (!tbody) return;

    const list = getFilteredChallans();

    if (list.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="7" class="py-12 text-center text-slate-500">
                    <i class="fa-solid fa-box-open text-2xl text-slate-600 mb-2 block"></i>
                    <p class="font-bold">কোনো চালান পাওয়া যায়নি</p>
                    <p class="text-[11px] text-slate-600">মোবাইল অ্যাপ থেকে চালান তৈরি করলে এখানে তাৎক্ষণিক প্রদর্শিত হবে।</p>
                </td>
            </tr>
        `;
        return;
    }

    tbody.innerHTML = list.map(c => {
        const isInward = c.sessionType === 'inward';
        const typeBadge = isInward
            ? `<span class="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-sky-500/10 text-sky-400 border border-sky-500/20"><i class="fa-solid fa-arrow-down-long text-[9px]"></i> আনলোডিং</span>`
            : `<span class="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"><i class="fa-solid fa-arrow-up-long text-[9px]"></i> ডেলিভারি</span>`;

        const partyName = c.customerName || c.destinationFor || 'মেসার্স মা মোটরস';
        const partyPhone = c.customerPhone ? `<div class="text-[10px] text-slate-500"><i class="fa-solid fa-phone text-[9px] mr-0.5"></i> ${c.customerPhone}</div>` : '';
        const vehicle = c.vehicleNo || '—';
        const driver = c.driverName ? `<div class="text-[10px] text-slate-400"><i class="fa-solid fa-user-tag text-[9px] mr-0.5"></i> ${c.driverName}</div>` : '';
        const staff = c.countedByUserName || 'মোঃ এমরান';
        const totalPcs = Number(c.totalPcs) || 0;

        return `
            <tr class="hover:bg-slate-800/40 transition-colors">
                <td class="py-3 px-4">
                    <div class="font-black text-white font-mono">${c.challanNo || c.id}</div>
                    <div class="mt-1">${typeBadge}</div>
                </td>
                <td class="py-3 px-4 text-slate-300">
                    ${formatDate(c.date)}
                </td>
                <td class="py-3 px-4">
                    <div class="font-bold text-white">${partyName}</div>
                    ${partyPhone}
                </td>
                <td class="py-3 px-4">
                    <div class="font-mono text-slate-200">${vehicle}</div>
                    ${driver}
                </td>
                <td class="py-3 px-4 text-center">
                    <span class="inline-block px-2.5 py-1 rounded-lg bg-slate-800 border border-slate-700 font-black text-sm text-white font-mono">
                        ${totalPcs.toLocaleString('en-IN')} <span class="text-[10px] font-normal text-slate-400">পিস</span>
                    </span>
                </td>
                <td class="py-3 px-4">
                    <span class="inline-flex items-center gap-1 text-slate-300 font-bold">
                        <i class="fa-solid fa-user-check text-blue-400 text-xs"></i> ${staff}
                    </span>
                </td>
                <td class="py-3 px-4 text-center">
                    <div class="flex items-center justify-center gap-1.5">
                        <button onclick="window.viewGodownChallanDetail('${c.id}')" class="px-2.5 py-1.5 bg-blue-500/10 hover:bg-blue-500 text-blue-400 hover:text-white rounded-lg transition-all border border-blue-500/20 text-xs font-bold cursor-pointer" title="চালান ভিউ ও প্রিন্ট">
                            <i class="fa-solid fa-eye mr-1"></i> ভিউ
                        </button>
                        <button onclick="window.deleteGodownChallan('${c.id}', '${c.challanNo || c.id}')" class="p-1.5 bg-red-500/10 hover:bg-red-500 text-red-400 hover:text-white rounded-lg transition-all border border-red-500/20 text-xs cursor-pointer" title="চালান মুছুন">
                            <i class="fa-solid fa-trash-can"></i>
                        </button>
                    </div>
                </td>
            </tr>
        `;
    }).join('');
}

// Global window actions
window.viewGodownChallanDetail = function(id) {
    viewGodownChallanDetail(id, _challansCache);
};

window.deleteGodownChallan = function(id, challanNo) {
    deleteGodownChallan(id, challanNo, () => {
        _challansCache = _challansCache.filter(c => c.id !== id);
        updateUI();
    });
};

import { getPartsCatalogCache, initPartsCatalogCache, searchParts, getAvailableCategories } from './parts-state.js';
import { formatAmountWithComma } from '../utils.js';
import { openPartModal, promptDeletePart, exportPartsToExcel, promptBulkPriceShift } from './parts-catalog-actions.js';

let currentCategoryFilter = 'all';
let currentSearchQuery = '';

/**
 * Render the Auto Parts Master Catalog Management View
 * @param {HTMLElement} container View container element
 */
export function renderPartsCatalog(container) {
    if (!container) return;

    container.innerHTML = `
        <div class="space-y-6 animate-fade-in font-bn">
            <!-- Header & Metrics -->
            <div class="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 bg-slate-900/80 p-5 rounded-3xl border border-slate-800 backdrop-blur-xl shadow-2xl">
                <div>
                    <div class="flex items-center gap-3">
                        <div class="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 text-xl shadow-inner">
                            <i class="fa-solid fa-gears"></i>
                        </div>
                        <div>
                            <h1 class="text-xl sm:text-2xl font-black text-white tracking-wide flex items-center gap-2">
                                পার্টস মাস্টার ক্যাটালগ ও ফিটমেন্ট ডিরেক্টরি
                                <span id="parts-total-badge" class="text-xs px-2.5 py-0.5 rounded-full bg-blue-500/20 text-blue-400 border border-blue-500/30 font-bold">০ আইটেম</span>
                            </h1>
                            <p class="text-xs text-slate-400 mt-0.5">জাপানি রিকন্ডিশন্ড পার্টস, ফিটমেন্ট মডেল, আস্কিং ও ফ্লোর প্রাইস মাস্টার ডেটাবেজ</p>
                        </div>
                    </div>
                </div>
                
                <div class="flex flex-wrap items-center gap-2 w-full lg:w-auto">
                    <button type="button" onclick="window.partsCatalogActions.openAddModal()" class="flex-1 sm:flex-none px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 font-black text-xs transition-all shadow-lg shadow-amber-500/20 active:scale-95 flex items-center justify-center gap-2 cursor-pointer">
                        <i class="fa-solid fa-plus text-sm"></i>
                        <span>নতুন পার্টস যোগ</span>
                    </button>
                    <button type="button" onclick="window.partsCatalogActions.exportExcel()" class="px-3.5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 font-bold text-xs transition-all active:scale-95 flex items-center gap-2 cursor-pointer" title="এক্সেল স্প্রেডশিট ডাউনলোড">
                        <i class="fa-solid fa-file-excel text-emerald-400 text-sm"></i>
                        <span class="hidden sm:inline">এক্সেল</span>
                    </button>
                    <button type="button" onclick="window.partsCatalogActions.bulkPriceShift()" class="px-3.5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-amber-400 font-bold text-xs transition-all active:scale-95 flex items-center gap-2 cursor-pointer" title="কনটেইনার রেট অনুযায়ী ক্যাটালগ প্রাইস বৃদ্ধি বা হ্রাস">
                        <i class="fa-solid fa-percent text-amber-400 text-sm"></i>
                        <span class="hidden sm:inline">দর সমন্বয়</span>
                    </button>
                    <button type="button" onclick="window.partsCatalogActions.seedDefault()" class="px-3.5 py-2.5 rounded-xl bg-blue-600/20 hover:bg-blue-600/40 text-blue-300 hover:text-white border border-blue-500/30 font-bold text-xs transition-all active:scale-95 flex items-center gap-2 cursor-pointer" title="১৩৪টি মেমো-ভেরিফাইড মাস্টার পার্টস ক্লাউডে আপলোড">
                        <i class="fa-solid fa-cloud-arrow-up text-blue-400 text-sm"></i>
                        <span class="hidden sm:inline">ডাটা সিঙ্ক</span>
                    </button>
                </div>
            </div>

            <!-- Category Summary Metrics Cards -->
            <div id="parts-metrics-cards" class="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-5 gap-3"></div>

            <!-- Search Bar & Filters -->
            <div class="flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between bg-slate-900/60 p-4 rounded-2xl border border-slate-800/80 backdrop-blur-md">
                <div class="relative flex-grow max-w-2xl">
                    <i class="fa-solid fa-magnifying-glass absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500 text-xs"></i>
                    <input type="text" id="parts-search-input" placeholder="পার্টসের বাংলা নাম, OEM পার্ট নং, কোড, বা গাড়ির মডেল (যেমন: Axio 141, রেক, 45510)..." class="w-full bg-slate-950/90 border border-slate-700/60 rounded-xl py-2.5 pl-9 pr-10 text-xs sm:text-sm text-white focus:border-amber-500 outline-none transition-all shadow-inner" oninput="window.partsCatalogUI.handleSearch(this.value)">
                    <button id="parts-search-clear" class="hidden absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white" onclick="window.partsCatalogUI.clearSearch()">
                        <i class="fa-solid fa-xmark text-xs"></i>
                    </button>
                </div>
                
                <div id="parts-category-chips" class="flex items-center gap-1.5 overflow-x-auto custom-scrollbar pb-1 md:pb-0"></div>
            </div>

            <!-- Parts Catalog Table / List -->
            <div class="bg-slate-900/80 rounded-2xl border border-slate-800/90 overflow-hidden shadow-2xl backdrop-blur-xl">
                <div class="overflow-x-auto custom-scrollbar">
                    <table class="w-full text-left border-collapse">
                        <thead>
                            <tr class="border-b border-slate-800 bg-slate-950/70 text-[11px] font-black uppercase tracking-wider text-slate-400">
                                <th class="py-3 px-3 w-12 text-center">#</th>
                                <th class="py-3 px-3 w-28">কোড / অবস্থান</th>
                                <th class="py-3 px-4">পার্টসের নাম ও OEM কোড</th>
                                <th class="py-3 px-4">ফিটমেন্ট মডেল ও প্ল্যাটফর্ম</th>
                                <th class="py-3 px-3 w-24 text-center">ইউনিট</th>
                                <th class="py-3 px-4 w-44 text-right">দর করিডোর (৳)</th>
                                <th class="py-3 px-3 w-20 text-center">অ্যাকশন</th>
                            </tr>
                        </thead>
                        <tbody id="parts-table-tbody" class="divide-y divide-slate-800/60 text-xs">
                            <tr>
                                <td colspan="7" class="py-12 text-center text-slate-500 italic">
                                    <i class="fa-solid fa-spinner fa-spin text-xl text-amber-500 mb-2"></i>
                                    <div>পার্টস ক্যাটালগ লোড হচ্ছে...</div>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    `;

    // Initialize State & Listener
    initPartsCatalogCache((parts) => {
        updateCatalogView(parts);
    });

    // Initial render with existing cache if available
    const initialParts = getPartsCatalogCache();
    if (initialParts.length > 0) {
        updateCatalogView(initialParts);
    }
}

/**
 * Update the UI table and metrics with given parts list
 */
function updateCatalogView(parts) {
    const totalBadge = document.getElementById('parts-total-badge');
    if (totalBadge) totalBadge.innerText = `${parts.length} আইটেম`;

    renderCategoryChips();
    renderMetricsCards(parts);
    renderTableRows();
}

/**
 * Render category filter buttons
 */
function renderCategoryChips() {
    const chipsContainer = document.getElementById('parts-category-chips');
    if (!chipsContainer) return;

    const categories = ['all', ...getAvailableCategories()];
    const labels = {
        'all': 'সব ক্যাটাগরি',
        'স্টিয়ারিং ও সাসপেনশন': 'স্টিয়ারিং ও সাসপেনশন',
        'ব্রেকিং সিস্টেম': 'ব্রেকিং সিস্টেম',
        'ইঞ্জিন ও ট্রান্সমিশন': 'ইঞ্জিন ও গিয়ার',
        'ইলেকট্রিক্যাল ও সেন্সর': 'ইলেকট্রিক্যাল',
        'কুলিং ও এসি': 'কুলিং ও এসি',
        'বডি ও এক্সটেরিয়র': 'বডি পার্টস',
        'ড্রাইভট্রেন ও এক্সেল': 'এক্সেল ও ড্রাইভ'
    };

    chipsContainer.innerHTML = categories.map(cat => {
        const isActive = currentCategoryFilter === cat;
        const activeClass = isActive 
            ? 'bg-amber-500 text-slate-950 font-black shadow-md shadow-amber-500/20' 
            : 'bg-slate-800/90 text-slate-300 hover:bg-slate-700 font-bold border border-slate-700/60';
        return `
            <button type="button" onclick="window.partsCatalogUI.filterCategory('${cat}')" class="px-3 py-1.5 rounded-xl text-xs whitespace-nowrap transition-all cursor-pointer ${activeClass}">
                ${labels[cat] || cat}
            </button>
        `;
    }).join('');
}

/**
 * Render top summary metric cards
 */
function renderMetricsCards(parts) {
    const container = document.getElementById('parts-metrics-cards');
    if (!container) return;

    const catCounts = {};
    parts.forEach(p => {
        catCounts[p.category] = (catCounts[p.category] || 0) + 1;
    });

    const metrics = [
        { label: 'স্টিয়ারিং ও সাসপেনশন', count: catCounts['স্টিয়ারিং ও সাসপেনশন'] || 0, icon: 'fa-circle-dot', color: 'text-amber-400 border-amber-500/20 bg-amber-500/10' },
        { label: 'ব্রেকিং ও হাইড্রোলিক', count: catCounts['ব্রেকিং সিস্টেম'] || 0, icon: 'fa-gauge-high', color: 'text-rose-400 border-rose-500/20 bg-rose-500/10' },
        { label: 'ইঞ্জিন ও ট্রান্সমিশন', count: catCounts['ইঞ্জিন ও ট্রান্সমিশন'] || 0, icon: 'fa-gear', color: 'text-sky-400 border-sky-500/20 bg-sky-500/10' },
        { label: 'ইলেকট্রিক্যাল ও সেন্সর', count: catCounts['ইলেকট্রিক্যাল ও সেন্সর'] || 0, icon: 'fa-bolt', color: 'text-emerald-400 border-emerald-500/20 bg-emerald-500/10' },
        { label: 'কুলিং ও এসি', count: catCounts['কুলিং ও এসি'] || 0, icon: 'fa-snowflake', color: 'text-cyan-400 border-cyan-500/20 bg-cyan-500/10' }
    ];

    container.innerHTML = metrics.map(m => `
        <div class="p-3.5 rounded-2xl border ${m.color} backdrop-blur-md flex items-center justify-between">
            <div>
                <p class="text-[10px] font-bold text-slate-400 uppercase tracking-wider">${m.label}</p>
                <p class="text-base sm:text-lg font-black text-white mt-0.5">${m.count} <span class="text-xs font-normal text-slate-400">আইটেম</span></p>
            </div>
            <i class="fa-solid ${m.icon} text-lg opacity-80"></i>
        </div>
    `).join('');
}

/**
 * Render filtered table rows
 */
function renderTableRows() {
    const tbody = document.getElementById('parts-table-tbody');
    if (!tbody) return;

    const results = searchParts(currentSearchQuery, currentCategoryFilter);

    if (results.length === 0) {
        const isCompletelyEmpty = getPartsCatalogCache().length === 0;
        if (isCompletelyEmpty) {
            tbody.innerHTML = `
                <tr>
                    <td colspan="7" class="py-12 text-center text-slate-400 font-bn">
                        <i class="fa-solid fa-boxes-stacked text-4xl text-amber-500/50 mb-3 block"></i>
                        <div class="text-base font-bold text-white mb-1">ক্যাটালগ বর্তমানে খালি রয়েছে</div>
                        <p class="text-xs text-slate-400 mb-4 max-w-md mx-auto">মা মোটরসের দোকান মেমো থেকে সংগৃহীত ১৩৪টি জাপানি রিকন্ডিশন্ড মাস্টার পার্টস ক্লাউড ডাটাবেজে এক ক্লিকে আপলোড করতে পারেন।</p>
                        <button type="button" onclick="window.partsCatalogActions.seedDefault()" class="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-black text-xs transition-all shadow-lg shadow-amber-500/20 active:scale-95 inline-flex items-center gap-2 cursor-pointer">
                            <i class="fa-solid fa-cloud-arrow-up text-sm"></i>
                            <span>১৩৪টি মেমো-ভেরিফাইড মাস্টার পার্টস লোড করুন</span>
                        </button>
                    </td>
                </tr>
            `;
        } else {
            tbody.innerHTML = `
                <tr>
                    <td colspan="7" class="py-12 text-center text-slate-500 font-bold italic">
                        <i class="fa-solid fa-magnifying-glass text-3xl text-slate-600 mb-2"></i>
                        <div>খোঁজা ফিল্টারে কোনো পার্টস মেলেনি</div>
                    </td>
                </tr>
            `;
        }
        return;
    }

    tbody.innerHTML = results.map((item, idx) => {
        const modelsHtml = Array.isArray(item.popularModels) 
            ? item.popularModels.map(m => `<span class="inline-block px-1.5 py-0.5 rounded-md bg-slate-800 text-[10px] font-bold text-slate-300 border border-slate-700/60 mr-1 mb-0.5">${m}</span>`).join('')
            : '';

        const yearsBadge = (item.yearStart && item.yearEnd) 
            ? `<span class="inline-block px-1.5 py-0.5 rounded-md bg-sky-950/80 text-[10px] font-bold text-sky-300 border border-sky-800/60 mr-1 mb-0.5"><i class="fa-solid fa-calendar-days text-[9px] mr-1"></i>${item.yearStart}—${item.yearEnd}</span>` 
            : '';

        const mismatchBadge = item.mismatchWarning 
            ? `<div class="text-[10px] text-amber-400 font-bold mt-1 flex items-center gap-1"><i class="fa-solid fa-triangle-exclamation text-[9px]"></i><span>${item.mismatchWarning}</span></div>`
            : '';

        return `
            <tr class="hover:bg-slate-800/40 transition-colors">
                <td class="py-3 px-3 text-center text-slate-500 font-bold text-[11px]">${idx + 1}</td>
                <td class="py-3 px-3">
                    <div class="font-mono text-[11px] font-black text-amber-400">${item.id}</div>
                    <div class="text-[10px] text-slate-400 font-bold mt-0.5 flex items-center gap-1">
                        <i class="fa-solid fa-location-dot text-[9px] text-blue-400"></i>
                        <span>${item.locationShop || 'সাধারণ স্টক'}</span>
                    </div>
                </td>
                <td class="py-3 px-4">
                    <div class="font-bold text-white text-xs sm:text-sm">${item.nameBn}</div>
                    <div class="text-[11px] text-slate-400 font-mono flex items-center gap-2 mt-0.5">
                        <span class="text-blue-300">${item.oemPartNumber || 'OEM N/A'}</span>
                        <span class="text-slate-600">•</span>
                        <span class="italic text-slate-400 text-[10px]">${item.nameEn || ''}</span>
                    </div>
                    ${item.memoReference ? `<div class="text-[10px] text-amber-400/90 font-bold mt-0.5 flex items-center gap-1"><i class="fa-solid fa-receipt text-[9px]"></i><span>${item.memoReference}</span></div>` : ''}
                    ${item.secretCode ? `<span class="inline-block mt-1 text-[9px] font-mono px-1.5 py-0.2 rounded bg-purple-500/10 text-purple-300 border border-purple-500/20 font-bold">[${item.secretCode}]</span>` : ''}
                </td>
                <td class="py-3 px-4">
                    <div class="flex flex-wrap items-center">${modelsHtml}${yearsBadge}</div>
                    ${mismatchBadge}
                </td>
                <td class="py-3 px-3 text-center">
                    <span class="px-2 py-0.5 rounded-full bg-slate-800 text-[11px] font-bold text-slate-300 border border-slate-700/60">${item.defaultUnit || 'পিছ'}</span>
                    <div class="text-[9px] text-slate-500 mt-0.5">${item.pcsPerUnit ? `${item.pcsPerUnit} পিছ/প্যাক` : ''}</div>
                </td>
                <td class="py-3 px-4 text-right">
                    <div class="font-black text-emerald-400 text-xs sm:text-sm">৳ ${formatAmountWithComma(item.askingPrice || 0)}</div>
                    <div class="text-[10px] text-red-400 font-bold">ফ্লোর: ৳ ${formatAmountWithComma(item.floorPrice || 0)}</div>
                    ${item.singlePiecePrice ? `<div class="text-[9px] text-slate-400">ভাঙা ১ পিছ: ৳${formatAmountWithComma(item.singlePiecePrice)}</div>` : ''}
                </td>
                <td class="py-3 px-3 text-center">
                    <div class="flex items-center justify-center gap-1.5">
                        <button type="button" onclick="window.partsCatalogActions.openEditModal('${item.id}')" class="w-7 h-7 rounded-lg bg-slate-800 hover:bg-amber-500/20 text-slate-400 hover:text-amber-400 flex items-center justify-center transition-all cursor-pointer" title="এডিট করুন">
                            <i class="fa-solid fa-pen-to-square text-xs"></i>
                        </button>
                        <button type="button" onclick="window.partsCatalogActions.promptDelete('${item.id}')" class="w-7 h-7 rounded-lg bg-slate-800 hover:bg-red-500/20 text-slate-400 hover:text-red-400 flex items-center justify-center transition-all cursor-pointer" title="মুছে ফেলুন">
                            <i class="fa-solid fa-trash-can text-xs"></i>
                        </button>
                    </div>
                </td>
            </tr>
        `;
    }).join('');
}

// Global Controller Binding for Parts Catalog UI
window.partsCatalogUI = {
    handleSearch: (val) => {
        currentSearchQuery = val || '';
        const clearBtn = document.getElementById('parts-search-clear');
        if (clearBtn) clearBtn.classList.toggle('hidden', !currentSearchQuery);
        renderTableRows();
    },
    clearSearch: () => {
        currentSearchQuery = '';
        const input = document.getElementById('parts-search-input');
        if (input) input.value = '';
        const clearBtn = document.getElementById('parts-search-clear');
        if (clearBtn) clearBtn.classList.add('hidden');
        renderTableRows();
    },
    filterCategory: (cat) => {
        currentCategoryFilter = cat;
        renderCategoryChips();
        renderTableRows();
    }
};

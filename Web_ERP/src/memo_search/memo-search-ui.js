import { searchMemosByNumber, getRecentMemos, enrichMemoData } from './memo-search-engine.js';
import { renderMemoCardHTML } from './memo-card-ui.js';
import { escapeHTML, formatAppDate, formatAmountWithComma } from '../utils.js';

let _searchDebounceTimer;

/**
 * Main View Renderer for Memo Search Section
 */
export async function renderMemoSearch(container, params = {}) {
    if (!container) return;

    container.innerHTML = `
        <div class="max-w-6xl mx-auto space-y-6 animate-fade-in font-bn pb-10">
            <!-- Header Section -->
            <div class="flex flex-wrap items-center justify-between gap-4 bg-slate-900/60 p-4 sm:p-6 rounded-3xl border border-slate-800 backdrop-blur-xl">
                <div class="flex items-center gap-3.5">
                    <div class="w-12 h-12 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400 text-2xl shadow-inner">
                        <i class="fa-solid fa-receipt"></i>
                    </div>
                    <div>
                        <h1 class="text-xl sm:text-2xl font-black text-white tracking-tight flex items-center gap-2">
                            <span>মেমো / ভাউচার ইনস্ট্যান্ট সার্চ</span>
                            <span class="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">Live Deep View</span>
                        </h1>
                        <p class="text-xs text-slate-400 mt-0.5">মেমো নম্বর লিখলেই সাথে সাথে আইটেম তালিকা, পূর্বের ও বর্তমান বকেয়া এবং প্রিন্ট অপশন চলে আসবে</p>
                    </div>
                </div>
            </div>

            <!-- Search Hero Card -->
            <div class="bg-slate-900/80 border border-slate-700/80 rounded-3xl p-5 sm:p-7 shadow-2xl backdrop-blur-xl space-y-4">
                <div class="relative max-w-2xl mx-auto">
                    <i class="fa-solid fa-magnifying-glass absolute left-4.5 top-1/2 -translate-y-1/2 text-cyan-400 text-base pointer-events-none"></i>
                    <input type="text" 
                        id="memo-search-input" 
                        placeholder="মেমো বা ভাউচার নম্বর লিখুন (e.g. 1025, #105, QC-12)..." 
                        autocomplete="off"
                        class="w-full bg-slate-950 border-2 border-slate-700 focus:border-cyan-500 text-white rounded-2xl pl-12 pr-12 py-3.5 text-base sm:text-lg font-mono font-bold outline-none transition-all shadow-inner placeholder:font-bn placeholder:text-slate-500 placeholder:text-sm">
                    <button id="memo-search-clear-btn" class="hidden absolute right-4 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full bg-slate-800 text-slate-400 hover:text-white flex items-center justify-center transition-all cursor-pointer" onclick="window.clearMemoSearchInput()" title="মুছে ফেলুন">
                        <i class="fa-solid fa-xmark text-xs"></i>
                    </button>
                </div>

                <!-- Recent Memos Chips -->
                <div id="memo-recent-chips-container" class="max-w-2xl mx-auto flex items-center gap-2 overflow-x-auto custom-scrollbar py-1 text-xs">
                    <span class="text-slate-500 font-bold flex items-center gap-1 shrink-0 text-[11px]">
                        <i class="fa-solid fa-clock-rotate-left text-cyan-400"></i> সাম্প্রতিক মেমো:
                    </span>
                    <div id="memo-recent-chips" class="flex items-center gap-1.5 shrink-0">
                        <span class="text-slate-600 text-xs italic">লোড হচ্ছে...</span>
                    </div>
                </div>
            </div>

            <!-- Matches Selector (if multiple) -->
            <div id="memo-multiple-matches" class="hidden max-w-6xl mx-auto"></div>

            <!-- Result Display Container -->
            <div id="memo-search-result-area" class="max-w-6xl mx-auto">
                <div class="bg-slate-900/40 border border-dashed border-slate-800 rounded-3xl p-12 text-center text-slate-500 space-y-3">
                    <div class="w-16 h-16 rounded-3xl bg-slate-800/40 border border-slate-700/40 flex items-center justify-center mx-auto text-slate-600 text-2xl">
                        <i class="fa-solid fa-barcode"></i>
                    </div>
                    <div class="text-sm font-bold text-slate-400">যেকোনো মেমো নম্বর লিখে সার্চ করুন</div>
                    <div class="text-xs text-slate-600">মেমো নম্বর লেখার সাথে সাথে সম্পূর্ণ বিবরণ ও হিসাবের সমীকরণ এখানে প্রদর্শিত হবে</div>
                </div>
            </div>
        </div>
    `;

    setupMemoSearchEvents(params);
    loadRecentMemoChips();
}

/**
 * Setup Event Listeners for Search Input
 */
function setupMemoSearchEvents(params = {}) {
    const input = document.getElementById('memo-search-input');
    const clearBtn = document.getElementById('memo-search-clear-btn');
    if (!input) return;

    // Focus input automatically
    setTimeout(() => { input.focus(); }, 100);

    input.oninput = (e) => {
        const val = e.target.value;
        if (clearBtn) clearBtn.classList.toggle('hidden', val.length === 0);

        clearTimeout(_searchDebounceTimer);
        if (!val.trim()) {
            resetMemoResultArea();
            return;
        }

        _searchDebounceTimer = setTimeout(() => {
            executeMemoSearch(val);
        }, 200);
    };

    input.onkeydown = (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            clearTimeout(_searchDebounceTimer);
            executeMemoSearch(input.value);
        }
    };

    // If passed memoNo param, trigger immediately
    if (params.memoNo) {
        input.value = params.memoNo;
        if (clearBtn) clearBtn.classList.remove('hidden');
        executeMemoSearch(params.memoNo);
    }
}

/**
 * Execute Memo Search & Render Results
 */
export async function executeMemoSearch(query) {
    const resultArea = document.getElementById('memo-search-result-area');
    const multipleArea = document.getElementById('memo-multiple-matches');
    if (!resultArea) return;

    if (!query || !query.trim()) {
        resetMemoResultArea();
        return;
    }

    resultArea.innerHTML = `
        <div class="bg-slate-900/60 border border-slate-800 rounded-3xl p-12 text-center text-slate-400 space-y-3">
            <i class="fa-solid fa-spinner fa-spin text-3xl text-cyan-400 mb-2"></i>
            <div class="text-sm font-bold">মেমো তথ্য খোঁজা হচ্ছে...</div>
        </div>
    `;

    try {
        const list = await searchMemosByNumber(query);

        if (!list || list.length === 0) {
            if (multipleArea) multipleArea.classList.add('hidden');
            resultArea.innerHTML = `
                <div class="bg-slate-900/60 border border-red-500/20 rounded-3xl p-10 text-center text-slate-400 space-y-2">
                    <div class="w-14 h-14 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center mx-auto text-red-400 text-2xl">
                        <i class="fa-solid fa-triangle-exclamation"></i>
                    </div>
                    <div class="text-base font-bold text-white">মেমো পাওয়া যায়নি!</div>
                    <div class="text-xs text-slate-500 font-mono">"#${escapeHTML(query)}" নম্বরে কোনো লেনদেন ডাটাবেসে নেই</div>
                </div>
            `;
            return;
        }

        // If multiple matching memos found, show selector chips
        if (list.length > 1 && multipleArea) {
            multipleArea.classList.remove('hidden');
            multipleArea.innerHTML = `
                <div class="bg-slate-900/60 border border-slate-800 rounded-2xl p-3 mb-4">
                    <div class="text-[11px] font-black text-cyan-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                        <i class="fa-solid fa-layer-group"></i> <span>একাধিক মেমো পাওয়া গেছে (${list.length}টি) - পছন্দ করুন:</span>
                    </div>
                    <div class="flex flex-wrap gap-2">
                        ${list.map((m, idx) => `
                            <button onclick="window.selectSpecificMemoMatch(${idx})" class="memo-match-btn px-3 py-1.5 rounded-xl ${idx === 0 ? 'bg-cyan-600 text-white font-black' : 'bg-slate-800 hover:bg-slate-700 text-slate-300'} text-xs flex items-center gap-2 border border-slate-700 transition-all cursor-pointer" data-idx="${idx}">
                                <span class="font-mono font-bold">#${escapeHTML(m.voucherNo || m.id.slice(-6).toUpperCase())}</span>
                                <span>•</span>
                                <span class="font-bold truncate max-w-[120px]">${escapeHTML(m.customerName)}</span>
                                <span class="text-[10px] text-slate-400 font-mono">(${formatAppDate(m.date)})</span>
                            </button>
                        `).join('')}
                    </div>
                </div>
            `;
            window._currentMemoSearchResults = list;
        } else if (multipleArea) {
            multipleArea.classList.add('hidden');
        }

        // Render top/selected memo
        resultArea.innerHTML = renderMemoCardHTML(list[0]);

    } catch (e) {
        console.error("executeMemoSearch UI error:", e);
        resultArea.innerHTML = `
            <div class="p-8 text-center text-red-400 font-bold bg-slate-900/60 rounded-3xl border border-red-500/20">
                মেমো অনুসন্ধানে সমস্যা হয়েছে: ${escapeHTML(e.message || 'Error')}
            </div>
        `;
    }
}

/**
 * Helper to select specific memo match from multiple list
 */
window.selectSpecificMemoMatch = function(idx) {
    if (window._currentMemoSearchResults && window._currentMemoSearchResults[idx]) {
        const selectedTxn = window._currentMemoSearchResults[idx];
        const resultArea = document.getElementById('memo-search-result-area');
        if (resultArea) resultArea.innerHTML = renderMemoCardHTML(selectedTxn);

        document.querySelectorAll('.memo-match-btn').forEach(btn => {
            const isTarget = Number(btn.dataset.idx) === idx;
            btn.className = `memo-match-btn px-3 py-1.5 rounded-xl ${isTarget ? 'bg-cyan-600 text-white font-black' : 'bg-slate-800 hover:bg-slate-700 text-slate-300'} text-xs flex items-center gap-2 border border-slate-700 transition-all cursor-pointer`;
        });
    }
};

/**
 * Load Recent Memos Chips
 */
async function loadRecentMemoChips() {
    const container = document.getElementById('memo-recent-chips');
    if (!container) return;

    try {
        const recent = await getRecentMemos(8);
        if (recent.length === 0) {
            container.innerHTML = `<span class="text-slate-600 text-xs">কোনো মেমো পাওয়া যায়নি</span>`;
            return;
        }

        container.innerHTML = recent.map(m => `
            <button onclick="window.searchMemoDirectly('${escapeHTML(m.voucherNo)}')" class="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-cyan-600/30 hover:border-cyan-500/50 text-slate-300 hover:text-cyan-300 border border-slate-700/60 text-[11px] font-mono font-bold transition-all shrink-0 cursor-pointer flex items-center gap-1.5" title="${escapeHTML(m.customerName)} (${formatAppDate(m.date)})">
                <span>#${escapeHTML(m.voucherNo)}</span>
                <span class="text-[10px] text-slate-500 font-sans font-normal">${escapeHTML(m.customerName.slice(0, 10))}</span>
            </button>
        `).join('');
    } catch (e) {
        console.error("loadRecentMemoChips error:", e);
    }
}

/**
 * Direct Search Helper
 */
window.searchMemoDirectly = function(memoNo) {
    const input = document.getElementById('memo-search-input');
    const clearBtn = document.getElementById('memo-search-clear-btn');
    if (input) {
        input.value = memoNo;
        if (clearBtn) clearBtn.classList.remove('hidden');
        executeMemoSearch(memoNo);
    }
};

/**
 * Clear Search Input
 */
window.clearMemoSearchInput = function() {
    const input = document.getElementById('memo-search-input');
    const clearBtn = document.getElementById('memo-search-clear-btn');
    if (input) {
        input.value = '';
        input.focus();
        if (clearBtn) clearBtn.classList.add('hidden');
        resetMemoResultArea();
    }
};

function resetMemoResultArea() {
    const resultArea = document.getElementById('memo-search-result-area');
    const multipleArea = document.getElementById('memo-multiple-matches');
    if (multipleArea) multipleArea.classList.add('hidden');
    if (resultArea) {
        resultArea.innerHTML = `
            <div class="bg-slate-900/40 border border-dashed border-slate-800 rounded-3xl p-12 text-center text-slate-500 space-y-3">
                <div class="w-16 h-16 rounded-3xl bg-slate-800/40 border border-slate-700/40 flex items-center justify-center mx-auto text-slate-600 text-2xl">
                    <i class="fa-solid fa-barcode"></i>
                </div>
                <div class="text-sm font-bold text-slate-400">যেকোনো মেমো নম্বর লিখে সার্চ করুন</div>
                <div class="text-xs text-slate-600">মেমো নম্বর লেখার সাথে সাথে সম্পূর্ণ বিবরণ ও হিসাবের সমীকরণ এখানে প্রদর্শিত হবে</div>
            </div>
        `;
    }
}

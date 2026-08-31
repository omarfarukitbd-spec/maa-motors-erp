import { searchMemosByNumber, getRecentMemos, getAdjacentMemos, getCustomerLifetimeStats } from './memo-search-engine.js';
import { renderMemoCardHTML } from './memo-card-ui.js';
import { startMemoVoiceSearch } from './memo-voice-search.js';
import { renderMemoBookAuditUI } from './memo-book-audit-ui.js';
import { escapeHTML, formatAppDate } from '../utils.js';
import { showToast } from '../utils/ui-helpers.js';

let _searchDebounceTimer;
let _currentVoucherNo = '';
let _currentSearchRequestId = 0;

/**
 * Main View Renderer for Memo Search Section
 */
export async function renderMemoSearch(container, params = {}) {
    if (!container) return;

    container.innerHTML = `
        <div class="max-w-6xl mx-auto space-y-3.5 animate-fade-in font-bn pb-10">
            <!-- Mode Switcher Tabs Header -->
            <div class="flex items-center justify-between flex-wrap gap-2">
                <div class="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800 shadow-inner">
                    <button id="tab-memo-single-btn" onclick="window.switchMemoSearchTab('single')" class="px-3.5 py-1.5 rounded-lg text-xs font-black bg-cyan-600 text-white shadow-md transition-all flex items-center gap-1.5 cursor-pointer">
                        <i class="fa-solid fa-magnifying-glass text-[10px]"></i> <span>একক মেমো সার্চ</span>
                    </button>
                    <button id="tab-memo-audit-btn" onclick="window.switchMemoSearchTab('audit')" class="px-3.5 py-1.5 rounded-lg text-xs font-bold text-slate-400 hover:text-white hover:bg-slate-900 transition-all flex items-center gap-1.5 cursor-pointer">
                        <i class="fa-solid fa-book-open text-[10px] text-purple-400"></i> <span>মেমো বুক রেঞ্জ অডিট</span>
                    </button>
                </div>
            </div>

            <!-- Single Memo Search View Container -->
            <div id="memo-single-view" class="space-y-3.5">
                <!-- Compact Unified Command & Search Hub -->
                <div class="bg-slate-900/80 border border-slate-800/90 rounded-2xl p-3 sm:p-4 shadow-xl backdrop-blur-xl space-y-2.5">
                    <div class="flex flex-col md:flex-row md:items-center justify-between gap-3">
                        <!-- Left Title Badge -->
                        <div class="flex items-center gap-2.5 shrink-0">
                            <div class="w-9 h-9 rounded-xl bg-gradient-to-tr from-cyan-600/30 to-blue-600/20 border border-cyan-500/30 flex items-center justify-center text-cyan-400 text-base shadow-sm">
                                <i class="fa-solid fa-receipt"></i>
                            </div>
                            <div>
                                <h1 class="text-base sm:text-lg font-black text-white tracking-tight flex items-center gap-2">
                                    <span>মেমো ইনস্ট্যান্ট সার্চ</span>
                                    <span class="text-[9px] font-black uppercase px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">Next-Gen</span>
                                </h1>
                                <p class="text-[11px] text-slate-400">মেমো নং লিখলেই সাথে সাথে কাস্টমার ও সম্পূর্ণ হিসাব প্রদর্শিত হবে</p>
                            </div>
                        </div>

                        <!-- Right Search Capsule -->
                        <div class="relative w-full md:w-auto md:min-w-[380px] lg:min-w-[440px] flex items-center bg-slate-950 border border-slate-700/80 hover:border-slate-600 focus-within:!border-cyan-500 focus-within:ring-2 focus-within:ring-cyan-500/20 rounded-xl shadow-inner transition-all px-3 py-1">
                            <div class="text-cyan-400 flex items-center justify-center pointer-events-none mr-2">
                                <i class="fa-solid fa-magnifying-glass text-xs"></i>
                            </div>

                            <input type="text" 
                                id="memo-search-input" 
                                placeholder="মেমো বা ভাউচার নম্বর লিখুন (e.g. 100, #105)..." 
                                autocomplete="off"
                                class="w-full bg-transparent text-white py-1.5 text-sm font-mono font-black outline-none placeholder:font-bn placeholder:text-slate-500 placeholder:text-xs">
                            
                            <div class="flex items-center gap-1 shrink-0 ml-1">
                                <button id="memo-search-clear-btn" class="hidden w-6 h-6 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center transition-all cursor-pointer" onclick="window.clearMemoSearchInput()" title="মুছে ফেলুন">
                                    <i class="fa-solid fa-xmark text-[10px]"></i>
                                </button>
                                <button id="memo-voice-btn" class="w-7 h-7 rounded-lg bg-slate-800/80 hover:bg-cyan-500/20 text-cyan-400 hover:text-cyan-300 flex items-center justify-center border border-slate-700/60 hover:border-cyan-500/40 active:scale-95 transition-all cursor-pointer" onclick="window.triggerMemoVoiceSearch()" title="মুখে বলে সার্চ করুন">
                                    <i class="fa-solid fa-microphone text-[10px]"></i>
                                </button>
                            </div>
                        </div>
                    </div>

                    <!-- Recent Memos Inline Chips -->
                    <div id="memo-recent-chips-container" class="flex items-center gap-2 overflow-x-auto custom-scrollbar pt-1.5 text-xs border-t border-slate-800/60">
                        <span class="text-slate-500 font-bold flex items-center gap-1 shrink-0 text-[11px]">
                            <i class="fa-solid fa-clock-rotate-left text-cyan-400"></i> সাম্প্রতিক মেমো:
                        </span>
                        <div id="memo-recent-chips" class="flex items-center gap-1.5 shrink-0">
                            <span class="text-slate-600 text-xs italic">লোড হচ্ছে...</span>
                        </div>
                    </div>
                </div>

                <!-- Matches Selector (if multiple matches) -->
                <div id="memo-multiple-matches" class="hidden max-w-6xl mx-auto"></div>

                <!-- Result Display Container -->
                <div id="memo-search-result-area" class="max-w-6xl mx-auto">
                    <div class="bg-slate-900/40 border border-dashed border-slate-800 rounded-2xl p-8 text-center text-slate-500 space-y-2">
                        <div class="w-12 h-12 rounded-2xl bg-slate-800/40 border border-slate-700/40 flex items-center justify-center mx-auto text-slate-600 text-xl"><i class="fa-solid fa-barcode"></i></div>
                        <div class="text-sm font-bold text-slate-400">যেকোনো মেমো নম্বর লিখে সার্চ করুন</div>
                        <div class="text-xs text-slate-600">মেমো নম্বর লেখার সাথে সাথে সম্পূর্ণ বিবরণ ও হিসাবের সমীকরণ কোনো স্ক্রোল ছাড়াই দৃশ্যমান হবে</div>
                    </div>
                </div>
            </div>

            <!-- Memo Book Audit View Container -->
            <div id="memo-audit-view" class="hidden space-y-3.5"></div>
        </div>
    `;

    window.switchMemoSearchTab = (tab) => {
        const sBtn = document.getElementById('tab-memo-single-btn');
        const aBtn = document.getElementById('tab-memo-audit-btn');
        const sView = document.getElementById('memo-single-view');
        const aView = document.getElementById('memo-audit-view');
        const isAudit = tab === 'audit';

        if (sBtn) sBtn.className = `px-3.5 py-1.5 rounded-lg text-xs font-black transition-all flex items-center gap-1.5 cursor-pointer ${!isAudit ? 'bg-cyan-600 text-white shadow-md' : 'text-slate-400 hover:text-white hover:bg-slate-900'}`;
        if (aBtn) aBtn.className = `px-3.5 py-1.5 rounded-lg text-xs font-black transition-all flex items-center gap-1.5 cursor-pointer ${isAudit ? 'bg-purple-600 text-white shadow-md shadow-purple-600/30' : 'text-slate-400 hover:text-white hover:bg-slate-900'}`;
        if (sView) sView.classList.toggle('hidden', isAudit);
        if (aView) {
            aView.classList.toggle('hidden', !isAudit);
            if (isAudit) renderMemoBookAuditUI(aView);
        }
        if (!isAudit) document.getElementById('memo-search-input')?.focus();
    };

    setupMemoSearchEvents(params);
    loadRecentMemoChips();
}

function setupMemoSearchEvents(params = {}) {
    const input = document.getElementById('memo-search-input');
    const clearBtn = document.getElementById('memo-search-clear-btn');
    if (!input) return;
    setTimeout(() => input.focus(), 100);

    input.oninput = (e) => {
        const val = e.target.value;
        if (clearBtn) clearBtn.classList.toggle('hidden', val.length === 0);
        clearTimeout(_searchDebounceTimer);
        if (!val.trim()) { resetMemoResultArea(); return; }
        _searchDebounceTimer = setTimeout(() => executeMemoSearch(val), 180);
    };

    input.onkeydown = (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            clearTimeout(_searchDebounceTimer);
            executeMemoSearch(input.value);
        }
    };

    if (params.memoNo) {
        input.value = params.memoNo;
        if (clearBtn) clearBtn.classList.remove('hidden');
        executeMemoSearch(params.memoNo);
    }
}

export async function executeMemoSearch(query) {
    const searchId = ++_currentSearchRequestId;
    const resultArea = document.getElementById('memo-search-result-area');
    const multipleArea = document.getElementById('memo-multiple-matches');
    if (!resultArea) return;

    const cleanQ = (query || '').trim();
    if (!cleanQ) { resetMemoResultArea(); return; }

    resultArea.innerHTML = `<div class="bg-slate-900/60 border border-slate-800 rounded-2xl p-8 text-center text-slate-400 space-y-2"><i class="fa-solid fa-spinner fa-spin text-2xl text-cyan-400 mb-1"></i><div class="text-xs font-bold">মেমো তথ্য লোড করা হচ্ছে...</div></div>`;

    try {
        const list = await searchMemosByNumber(cleanQ);
        if (searchId !== _currentSearchRequestId) return;

        if (!list || list.length === 0) {
            if (multipleArea) multipleArea.classList.add('hidden');
            resultArea.innerHTML = `<div class="bg-slate-900/60 border border-red-500/20 rounded-2xl p-8 text-center text-slate-400 space-y-2"><div class="w-12 h-12 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center mx-auto text-red-400 text-xl"><i class="fa-solid fa-triangle-exclamation"></i></div><div class="text-sm font-bold text-white">মেমো পাওয়া যায়নি!</div><div class="text-xs text-slate-500 font-mono">"#${escapeHTML(cleanQ)}" নম্বরে কোনো লেনদেন নেই</div></div>`;
            return;
        }

        const activeTxn = list[0];
        _currentVoucherNo = activeTxn.voucherNo || '';
        const [adjacent, lifetimeStats] = await Promise.all([
            getAdjacentMemos(_currentVoucherNo),
            getCustomerLifetimeStats(activeTxn.customerId)
        ]);
        if (searchId !== _currentSearchRequestId) return;

        if (list.length > 1 && multipleArea) {
            multipleArea.classList.remove('hidden');
            multipleArea.innerHTML = `<div class="bg-slate-900/60 border border-slate-800 rounded-2xl p-2.5 mb-3 font-bn"><div class="text-[10px] font-black text-cyan-400 uppercase tracking-wider mb-1.5 flex items-center gap-1.5"><i class="fa-solid fa-layer-group"></i> <span>একাধিক মেমো পাওয়া গেছে (${list.length}টি):</span></div><div class="flex flex-wrap gap-1.5">${list.map((m, idx) => `<button onclick="window.selectSpecificMemoMatch(${idx})" class="memo-match-btn px-2.5 py-1 rounded-xl ${idx === 0 ? 'bg-cyan-600 text-white font-black' : 'bg-slate-800 hover:bg-slate-700 text-slate-300'} text-xs flex items-center gap-1.5 border border-slate-700 transition-all cursor-pointer" data-idx="${idx}"><span class="font-mono font-bold">#${escapeHTML(m.voucherNo || m.id.slice(-6).toUpperCase())}</span><span>•</span><span class="font-bold truncate max-w-[130px]">${escapeHTML(String(m.customerName || 'গ্রাহক').replace(/^\[.*?\]\s*/, '').trim())}</span><span class="text-[10px] text-slate-400 font-mono">(${formatAppDate(m.date)})</span></button>`).join('')}</div></div>`;
            window._currentMemoSearchResults = list;
        } else if (multipleArea) {
            multipleArea.classList.add('hidden');
        }

        resultArea.innerHTML = renderMemoCardHTML(activeTxn, adjacent, lifetimeStats);
    } catch (e) {
        if (searchId !== _currentSearchRequestId) return;
        console.error("executeMemoSearch error:", e);
        resultArea.innerHTML = `<div class="p-6 text-center text-red-400 font-bold bg-slate-900/60 rounded-2xl border border-red-500/20">মেমো অনুসন্ধানে সমস্যা হয়েছে</div>`;
    }
}

window.triggerMemoVoiceSearch = function() {
    startMemoVoiceSearch((cleanSpoken, rawSpoken) => {
        const input = document.getElementById('memo-search-input');
        if (input) {
            input.value = cleanSpoken;
            document.getElementById('memo-search-clear-btn')?.classList.remove('hidden');
            executeMemoSearch(cleanSpoken);
        }
        showToast(`ভয়েস রিসিভ: "${rawSpoken}"`, 'success');
    });
};

async function loadRecentMemoChips() {
    const container = document.getElementById('memo-recent-chips');
    if (!container) return;
    try {
        const recent = await getRecentMemos(8);
        if (recent.length === 0) {
            container.innerHTML = `<span class="text-slate-600 text-xs">কোনো মেমো নেই</span>`;
            return;
        }
        container.innerHTML = recent.map(m => {
            const cleanCustName = String(m.customerName || 'গ্রাহক').replace(/^\[.*?\]\s*/, '').trim();
            return `<button onclick="window.searchMemoDirectly('${escapeHTML(m.voucherNo)}')" class="px-3 py-1.5 rounded-xl bg-slate-950/70 hover:bg-cyan-950/40 hover:border-cyan-500/50 text-slate-300 hover:text-cyan-300 border border-slate-800 text-[11px] font-bold transition-all shrink-0 cursor-pointer flex items-center gap-2 group shadow-sm" title="${escapeHTML(cleanCustName)} (${formatAppDate(m.date)})"><span class="font-mono font-black text-cyan-400">#${escapeHTML(m.voucherNo)}</span><span class="text-slate-400 group-hover:text-slate-200 truncate max-w-[130px] font-medium">${escapeHTML(cleanCustName)}</span></button>`;
        }).join('');
    } catch (e) { console.error("loadRecentMemoChips error:", e); }
}

window.selectSpecificMemoMatch = async function(idx) {
    if (window._currentMemoSearchResults && window._currentMemoSearchResults[idx]) {
        const selectedTxn = window._currentMemoSearchResults[idx];
        const [adjacent, lifetimeStats] = await Promise.all([
            getAdjacentMemos(selectedTxn.voucherNo),
            getCustomerLifetimeStats(selectedTxn.customerId)
        ]);
        const resultArea = document.getElementById('memo-search-result-area');
        if (resultArea) resultArea.innerHTML = renderMemoCardHTML(selectedTxn, adjacent, lifetimeStats);
        document.querySelectorAll('.memo-match-btn').forEach(btn => {
            const isTarget = Number(btn.dataset.idx) === idx;
            btn.className = `memo-match-btn px-3 py-1.5 rounded-xl ${isTarget ? 'bg-cyan-600 text-white font-black' : 'bg-slate-800 hover:bg-slate-700 text-slate-300'} text-xs flex items-center gap-2 border border-slate-700 transition-all cursor-pointer`;
        });
    }
};

window.searchMemoDirectly = function(memoNo) {
    const input = document.getElementById('memo-search-input');
    if (input) {
        input.value = memoNo;
        document.getElementById('memo-search-clear-btn')?.classList.remove('hidden');
        executeMemoSearch(memoNo);
    }
};

window.clearMemoSearchInput = function() {
    const input = document.getElementById('memo-search-input');
    if (input) {
        input.value = '';
        input.focus();
        document.getElementById('memo-search-clear-btn')?.classList.add('hidden');
        resetMemoResultArea();
    }
};

function resetMemoResultArea() {
    const resultArea = document.getElementById('memo-search-result-area');
    document.getElementById('memo-multiple-matches')?.classList.add('hidden');
    if (resultArea) {
        resultArea.innerHTML = `<div class="bg-slate-900/40 border border-dashed border-slate-800 rounded-3xl p-12 text-center text-slate-500 space-y-3"><div class="w-16 h-16 rounded-3xl bg-slate-800/40 border border-slate-700/40 flex items-center justify-center mx-auto text-slate-600 text-2xl"><i class="fa-solid fa-barcode"></i></div><div class="text-sm font-bold text-slate-400">যেকোনো মেমো নম্বর লিখে সার্চ করুন</div><div class="text-xs text-slate-600">মেমো নম্বর লেখার সাথে সাথে সম্পূর্ণ বিবরণ ও হিসাবের সমীকরণ এখানে প্রদর্শিত হবে</div></div>`;
    }
}

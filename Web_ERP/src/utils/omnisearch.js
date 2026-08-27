import { getCustomerCache } from '../customer/customer-state.js';
import { setupGlobalHotkeys, showHotkeyHelpModal } from './hotkey-system.js';

let isOmniOpen = false;
let selectedIndex = 0;
let searchItems = [];

export { showHotkeyHelpModal };

export function initOmnisearch() {
    createOmnisearchModal();
    setupGlobalHotkeys({ toggleOmnisearch });
}

function createOmnisearchModal() {
    if (document.getElementById('omnisearch-modal')) return;

    const modal = document.createElement('div');
    modal.id = 'omnisearch-modal';
    modal.className = 'fixed inset-0 z-[999999] bg-slate-950/80 backdrop-blur-md hidden flex items-start justify-center pt-16 md:pt-24 px-4 font-bn transition-all';
    modal.innerHTML = `
        <div class="bg-slate-900 border border-slate-700/80 w-full max-w-xl rounded-2xl shadow-2xl overflow-hidden flex flex-col transform transition-all scale-95 opacity-0" id="omnisearch-box">
            <div class="relative flex items-center border-b border-slate-800/80 px-4 py-3.5 bg-slate-950/40">
                <i class="fa-solid fa-magnifying-glass text-blue-400 text-base mr-3"></i>
                <input type="text" id="omni-input" placeholder="যেকোনো পেজ বা কাস্টমার খুঁজুন (যেমন: কাস্টমার, খতিয়ান, জসিম)..." class="w-full bg-transparent text-white text-sm focus:outline-none placeholder:text-slate-500 font-bold" autocomplete="off">
                <kbd class="text-[10px] font-black text-slate-400 bg-slate-800 border border-slate-700 px-2 py-0.5 rounded-md uppercase shrink-0">ESC</kbd>
            </div>
            <div id="omni-results" class="max-h-[350px] overflow-y-auto custom-scrollbar p-2 divide-y divide-slate-800/40">
                <div class="text-center py-8 text-slate-500 font-bold text-xs">কিছু টাইপ করুন অথবা নিচের শর্টকাট দেখুন...</div>
            </div>
            <div class="flex items-center justify-between px-4 py-2.5 bg-slate-950/60 border-t border-slate-800/60 text-[10px] font-bold text-slate-400">
                <div class="flex items-center gap-3">
                    <span><kbd class="bg-slate-800 border border-slate-700 px-1.5 py-0.5 rounded text-slate-300">↑↓</kbd> নেভিগেট</span>
                    <span><kbd class="bg-slate-800 border border-slate-700 px-1.5 py-0.5 rounded text-slate-300">↵</kbd> সিলেক্ট</span>
                </div>
                <div class="flex items-center gap-2">
                    <button type="button" class="text-blue-400 hover:underline cursor-pointer flex items-center gap-1" onclick="window.showHotkeyHelpModal()"><i class="fa-solid fa-keyboard text-xs"></i><kbd class="bg-slate-800 border border-slate-700 px-1.5 py-0.5 rounded text-amber-400">F10</kbd> শর্টকাট গাইড</button>
                    <span>|</span>
                    <span><kbd class="bg-slate-800 border border-slate-700 px-1.5 py-0.5 rounded text-blue-400">Ctrl + K</kbd> কমান্ড বার</span>
                </div>
            </div>
        </div>`;

    document.body.appendChild(modal);

    const input = document.getElementById('omni-input');
    if (input) {
        input.addEventListener('input', (e) => handleOmniSearch(e.target.value));
        input.addEventListener('keydown', handleOmniKeydown);
    }

    modal.addEventListener('click', (e) => {
        if (e.target === modal) toggleOmnisearch(false);
    });
}

export function toggleOmnisearch(show = null) {
    const modal = document.getElementById('omnisearch-modal');
    const box = document.getElementById('omnisearch-box');
    const input = document.getElementById('omni-input');
    if (!modal || !box) return;

    isOmniOpen = show !== null ? show : !isOmniOpen;

    if (isOmniOpen) {
        modal.classList.remove('hidden');
        requestAnimationFrame(() => {
            box.classList.remove('scale-95', 'opacity-0');
            box.classList.add('scale-100', 'opacity-100');
        });
        if (input) { input.value = ''; input.focus(); handleOmniSearch(''); }
    } else {
        box.classList.remove('scale-100', 'opacity-100');
        box.classList.add('scale-95', 'opacity-0');
        setTimeout(() => modal.classList.add('hidden'), 150);
    }
}

function handleOmniSearch(query) {
    const resultsEl = document.getElementById('omni-results');
    if (!resultsEl) return;

    query = (query || '').trim().toLowerCase();
    searchItems = [];

    const goNav = (view, params) => {
        if (typeof window.navigate === 'function') window.navigate(view, params);
        else if (typeof window.navigateTo === 'function') window.navigateTo(view, params);
    };

    // 1. Navigation Actions
    const navPages = [
        { title: 'কাস্টমার ম্যানেজমেন্ট (F4 / Alt+C)', subtitle: 'কাস্টমার তালিকা ও তৈরি', icon: 'fa-users text-blue-400', action: () => goNav('customers') },
        { title: 'খতিয়ান (F3 / Alt+L)', subtitle: 'কাস্টমার লেনদেন ও জমা-খরচ', icon: 'fa-wallet text-purple-400', action: () => goNav('ledger') },
        { title: 'ফাস্ট এন্ট্রি (F7 / Alt+B)', subtitle: 'দ্রুত ইনভয়েস ও মেমো তৈরি', icon: 'fa-bolt text-amber-400', action: () => goNav('bulk') },
        { title: 'ইনভয়েস / ভাউচার জেনারেটর (F2 / Alt+I)', subtitle: 'সর্বশেষ রসিদ ও ভাউচার', icon: 'fa-receipt text-emerald-400', action: () => goNav('invoice') },
        { title: 'মেমো / ভাউচার ইনস্ট্যান্ট সার্চ (F9 / Alt+M)', subtitle: 'মেমো নম্বর দিয়ে তাৎক্ষণিক বিবরণ ও প্রিন্ট', icon: 'fa-barcode text-cyan-400', action: () => goNav('memo-search') },
        { title: 'দৈনিক খরচ (F6 / Alt+E)', subtitle: 'দোকানের খরচের তালিকা', icon: 'fa-file-invoice-dollar text-red-400', action: () => goNav('expenses') },
        { title: 'সফটওয়্যার সেটিংস (F8 / Alt+S)', subtitle: 'দোকানের নাম ও সিকিউরিটি পিন', icon: 'fa-gear text-slate-400', action: () => goNav('settings') }
    ];

    navPages.forEach(p => {
        if (!query || p.title.toLowerCase().includes(query) || p.subtitle.toLowerCase().includes(query)) {
            searchItems.push(p);
        }
    });

    // 2. Customers Search
    if (query) {
        const customers = getCustomerCache() || [];
        customers.forEach(c => {
            const isMatch = typeof window.matchCustomerSearch === 'function' ? window.matchCustomerSearch(c, query) : (c.name || '').toLowerCase().includes(query);
            if (isMatch) {
                searchItems.push({
                    title: c.name,
                    subtitle: `ফোন: ${c.phone || '-'} | A/C: ${c.accountNo || '-'} | বকেয়া: ৳${c.totalDue || 0}`,
                    icon: 'fa-user text-blue-400',
                    action: () => goNav('ledger', { custId: c.id })
                });
            }
        });
    }

    selectedIndex = 0;
    renderOmniResults();
}

function renderOmniResults() {
    const container = document.getElementById('omni-results');
    if (!container) return;

    if (searchItems.length === 0) {
        container.innerHTML = '<div class="text-center py-8 text-slate-500 font-bold text-xs">কোনো ডাটা পাওয়া যায়নি</div>';
        return;
    }

    container.innerHTML = searchItems.map((item, idx) => `
        <div class="omni-item flex items-center justify-between p-3 rounded-xl cursor-pointer transition-all ${idx === selectedIndex ? 'bg-blue-600/20 border border-blue-500/30' : 'hover:bg-slate-800/50'}" onclick="window.execOmniItem(${idx})">
            <div class="flex items-center gap-3">
                <div class="w-8 h-8 rounded-lg bg-slate-800 border border-slate-700 flex items-center justify-center">
                    <i class="fa-solid ${item.icon}"></i>
                </div>
                <div>
                    <div class="font-bold text-white text-xs">${item.title}</div>
                    <div class="text-[10px] text-slate-400 font-semibold">${item.subtitle}</div>
                </div>
            </div>
            <i class="fa-solid fa-chevron-right text-xs text-slate-500"></i>
        </div>`).join('');
}

function handleOmniKeydown(e) {
    if (e.key === 'ArrowDown') {
        e.preventDefault();
        selectedIndex = (selectedIndex + 1) % searchItems.length;
        renderOmniResults();
    } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        selectedIndex = (selectedIndex - 1 + searchItems.length) % searchItems.length;
        renderOmniResults();
    } else if (e.key === 'Enter') {
        e.preventDefault();
        if (searchItems[selectedIndex]) {
            searchItems[selectedIndex].action();
            toggleOmnisearch(false);
        }
    }
}

window.execOmniItem = (idx) => {
    if (searchItems[idx]) {
        searchItems[idx].action();
        toggleOmnisearch(false);
    }
};

// Global Exports
window.toggleOmnisearch = toggleOmnisearch;
window.showHotkeyHelpModal = showHotkeyHelpModal;

import { CustomerDAO } from '../dao.js';
import { AppState } from '../state.js';
import { cleanCustomerName, formatAmountWithComma } from '../utils.js';

export function initOmnisearch() {
    const input = document.getElementById('global-search-input');
    const resultsContainer = document.getElementById('global-search-results');

    if (!input || !resultsContainer) return;

    window.toggleOmnisearch = (show) => {
        if (show) {
            resultsContainer.classList.remove('hidden');
            input.removeAttribute('readonly');
            input.focus();
            runSearch(input.value);
        } else {
            resultsContainer.classList.add('hidden');
            input.setAttribute('readonly', 'true');
        }
    };

    input.addEventListener('input', (e) => runSearch(e.target.value));

    document.addEventListener('click', (e) => {
        if (!input.contains(e.target) && !resultsContainer.contains(e.target)) {
            window.toggleOmnisearch(false);
        }
    });

    document.addEventListener('keydown', (e) => {
        if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
            e.preventDefault();
            window.toggleOmnisearch(true);
        }
        if (e.key === 'Escape') {
            window.toggleOmnisearch(false);
        }
    });
}

async function runSearch(q) {
    const resultsContainer = document.getElementById('global-search-results');
    if (!resultsContainer) return;

    const query = (q || '').toLowerCase().trim();
    const customers = AppState.customerCache.length ? AppState.customerCache : await CustomerDAO.getAll();
    AppState.customerCache = customers;

    if (!query) {
        resultsContainer.innerHTML = `<p class="p-4 text-center text-slate-500 text-xs italic">কাস্টমারের নাম, ফোন বা অ্যাকাউন্ট নং লিখে সার্চ করুন...</p>`;
        return;
    }

    const matches = customers.filter(c => {
        const n = (c.name || '').toLowerCase();
        const p = (c.phone || '').toLowerCase();
        const a = (c.accountNo || '').toLowerCase();
        const addr = (c.address || '').toLowerCase();
        return n.includes(query) || p.includes(query) || a.includes(query) || addr.includes(query);
    }).slice(0, 10);

    if (matches.length === 0) {
        resultsContainer.innerHTML = `<p class="p-4 text-center text-slate-500 text-xs italic">কোনো ফলাফল পাওয়া যায়নি</p>`;
        return;
    }

    let html = '<div class="space-y-1">';
    matches.forEach(c => {
        const cleanName = cleanCustomerName(c.name);
        const due = Number(c.totalDue) || 0;
        const dueClass = due > 0 ? 'text-red-400' : (due < 0 ? 'text-emerald-400' : 'text-slate-400');

        html += `
            <div class="flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-800 transition-colors cursor-pointer" onclick="window.selectSearchResult('${c.id}')">
                <div class="flex items-center gap-3 overflow-hidden">
                    <div class="w-8 h-8 rounded-lg bg-blue-600/20 text-blue-400 flex items-center justify-center text-xs font-black shrink-0">
                        ${(cleanName[0] || 'C').toUpperCase()}
                    </div>
                    <div class="overflow-hidden">
                        <h4 class="text-xs font-bold text-white truncate">${cleanName}</h4>
                        <p class="text-[10px] text-slate-400 font-mono">${c.accountNo ? `A/C: ${c.accountNo} • ` : ''}${c.phone || 'No Phone'}</p>
                    </div>
                </div>
                <div class="text-right shrink-0">
                    <span class="text-xs font-black font-inter ${dueClass}">৳ ${formatAmountWithComma(Math.abs(due))}</span>
                </div>
            </div>
        `;
    });
    html += '</div>';

    resultsContainer.innerHTML = html;
}

window.selectSearchResult = (customerId) => {
    window.toggleOmnisearch(false);
    navigate('ledger', { customerId });
};

import { ExpenseDAO } from '../dao.js';
import { formatAmountWithComma, formatAppDate, escapeHTML, getTodayLocalDateString } from '../utils.js';

let lastVisibleExp = null;
let pageStackExp = [];
let currentExpPage = 1;
const expPageSize = 20;

export function renderExpenses(container) {
    if(window.AppState.currentUserRole === 'Staff' && window.AppState.permissions.viewExpenses === false) {
        container.innerHTML = `<div class="m3-card text-center font-bn py-12"><h2 class="text-xl font-bold text-red-500">অ্যাক্সেস ডিনাইড!</h2></div>`;
        return;
    }

    lastVisibleExp = null; pageStackExp = []; currentExpPage = 1;

    container.innerHTML = `
        <div class="flex flex-col gap-6 font-bn">
            <div class="flex flex-wrap items-center justify-between gap-3 px-2">
                <h2 class="text-2xl font-black text-white flex items-center gap-3">
                    <div class="w-1.5 h-8 bg-blue-600 rounded-full"></div>
                    দৈনিক খরচ <span class="text-xs font-bold text-slate-400 uppercase tracking-wider">(Daily Expenses)</span>
                    <button class="w-8 h-8 rounded-full hover:bg-slate-800 flex items-center justify-center text-slate-500 hover:text-blue-400 transition-all" onclick="window.loadRecentExpenses()">
                        <i class="fa-solid fa-rotate text-sm"></i>
                    </button>
                </h2>
                <div class="flex items-center gap-3">
                    <div class="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-purple-500/10 border border-purple-500/30 text-purple-400 text-xs font-bold">
                        <i class="fa-solid fa-wallet"></i>
                        <span>আজকের খরচ: <strong id="expense-today-sum" class="text-white font-black">৳ ০</strong></span>
                    </div>
                    <button class="m3-btn-primary px-4 py-2 text-xs" onclick="window.generateExpenseReport()">
                        <i class="fa-solid fa-file-pdf mr-1"></i> প্রিন্ট স্টেটমেন্ট
                    </button>
                </div>
            </div>

            <div class="m3-card">
                <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 items-start font-bn">
                    <div><label class="m3-label">তারিখ <span class="m3-label-sub">(Date *)</span></label><input type="text" id="exp-date" class="m3-field h-[42px] py-0 datepicker"></div>
                    <div><label class="m3-label">ক্যাটাগরি <span class="m3-label-sub">(Category *)</span></label><select id="exp-category" class="m3-field h-[42px] py-0 font-bold" onchange="window.handleCategoryChange()"></select></div>
                    <div>
                        <label class="m3-label text-red-400">পরিমাণ <span class="m3-label-sub">(Amount ৳ *)</span></label>
                        <input type="text" id="exp-amount" oninput="window.handleNumberInput(this); window.updateLiveWords(this, 'exp-amount-words');" class="m3-field h-[42px] py-0 text-base font-black text-red-400 border-red-500/30" placeholder="০.০০">
                        <div class="h-6"><div id="exp-amount-words" class="text-[10px] font-black text-red-400 mt-1 px-2 py-0.5 rounded-lg bg-red-500/5 hidden italic truncate"></div></div>
                    </div>
                    <div><label class="m3-label">বিবরণ <span class="m3-label-sub">(Details)</span></label><input type="text" id="exp-details" placeholder="..." class="m3-field h-[42px]"></div>
                    <div><button id="save-exp-btn" class="m3-btn-primary w-full h-[42px] mt-6" onclick="window.saveExpense()">সেভ করুন</button></div>
                </div>
            </div>

            <!-- Desktop View Table -->
            <div class="desktop-only m3-table-container">
                <table class="m3-table w-full">
                    <thead><tr><th class="w-[140px]">তারিখ</th><th class="w-[180px]">ক্যাটাগরি</th><th>বিবরণ</th><th class="w-[150px] text-right">পরিমাণ</th><th class="w-[100px] text-center">অ্যাকশন</th></tr></thead>
                    <tbody id="expense-list"></tbody>
                </table>
            </div>

            <!-- Mobile View Responsive Cards -->
            <div id="expense-list-mobile" class="mobile-only mobile-card-container font-bn">
                <div class="text-center py-10 text-slate-500 font-bold italic">ডাটা লোড হচ্ছে...</div>
            </div>

            <div id="expense-pagination" class="flex items-center justify-center gap-4 py-4 hidden">
                <button id="exp-prev-page" class="px-4 py-2 bg-slate-800 text-slate-300 rounded-xl" onclick="window.changeExpensePage('prev')">পূর্ববর্তী</button>
                <div class="text-white font-bold bg-blue-600/10 border border-blue-500/30 px-4 py-2 rounded-xl">পৃষ্ঠা: <span id="exp-current-page-display">1</span></div>
                <button id="exp-next-page" class="px-4 py-2 bg-slate-800 text-slate-300 rounded-xl" onclick="window.changeExpensePage('next')">পরবর্তী</button>
            </div>
        </div>`;

    document.getElementById('exp-date').value = (window.getTodayLocalDateString ? window.getTodayLocalDateString() : new Date().toISOString().split('T')[0]);
    loadExpenseCategories(); loadRecentExpenses();
}

export async function loadExpenseCategories() {
    const sel = document.getElementById('exp-category'); if(!sel) return;
    const cats = ["দোকান ভাড়া", "বিদ্যুৎ বিল", "পানি বিল", "ইন্টারনেট/ডিস বিল", "স্টাফ বেতন", "নাস্তা/আপ্যায়ন", "চা/কফি", "যাতায়াত/পরিবহন", "মালামাল/পণ্য ক্রয়", "প্রিন্টিং/স্টেশনারি", "মেরামতি/রক্ষণাবেক্ষণ", "দান/চাঁদা", "পৌরসভা/ট্যাক্স", "কুরিয়ার/পার্সেল", "অন্যান্য"];
    sel.innerHTML = cats.map(c => `<option value="${c}">${c}</option>`).join('') + `<option value="ADD_NEW">+ নতুন ক্যাটাগরি যোগ করুন...</option>`;
}

export async function loadRecentExpenses(direction = 'next') {
    const tbody = document.getElementById('expense-list'); if(!tbody) return;
    const mobileContainer = document.getElementById('expense-list-mobile');
    tbody.innerHTML = '<tr><td colspan="5" class="text-center py-12">লোডিং...</td></tr>';
    if (mobileContainer) mobileContainer.innerHTML = '<div class="text-center py-10 text-slate-500 font-bold italic">লোডিং...</div>';

    try {
        const cursor = (direction === 'next') ? lastVisibleExp : (pageStackExp.length > 1 ? pageStackExp[pageStackExp.length - 2] : null);
        const results = await ExpenseDAO.getByPage(expPageSize, cursor, 'createdAt', 'desc');
        lastVisibleExp = results.lastDoc;
        if (direction === 'next') { if (cursor) pageStackExp.push(cursor); } else { pageStackExp.pop(); }

        const paginationEl = document.getElementById('expense-pagination');
        if (paginationEl) {
            paginationEl.classList.remove('hidden');
            document.getElementById('exp-current-page-display').innerText = currentExpPage;
            document.getElementById('exp-prev-page').disabled = currentExpPage === 1;
            document.getElementById('exp-next-page').disabled = results.count < expPageSize;
        }
        renderExpenseRows(results.data, tbody);
    } catch (err) { tbody.innerHTML = 'Error loading data'; }
}

function renderExpenseRows(expenses, tbody) {
    const mobileContainer = document.getElementById('expense-list-mobile');
    const isAdmin = String(window.AppState?.currentUserRole || '').toLowerCase() === 'admin';
    const canEdit = isAdmin || (window.AppState?.permissions?.editExpenses !== false && window.AppState?.permissions?.manageExpenses !== false);
    const canDelete = isAdmin || (window.AppState?.permissions?.deleteExpenses === true);

    const todayStr = getTodayLocalDateString();
    let todaySum = 0;
    expenses.forEach(d => {
        if (d.date === todayStr) todaySum += (Number(d.amount) || 0);
    });
    const sumEl = document.getElementById('expense-today-sum');
    if (sumEl) sumEl.innerText = `৳ ${formatAmountWithComma(todaySum)}`;

    let html = '';
    let mobileHtml = '';

    expenses.forEach(d => {
        const catEsc = escapeHTML(d.category);
        const detEsc = escapeHTML(d.details || '-');
        const catEscJs = catEsc.replace(/'/g, "\\'");

        html += `
            <tr class="border-b border-slate-800/50 hover:bg-white/[0.02] transition-colors">
                <td class="text-slate-300 font-bold text-xs">${formatAppDate(d.date)}${d.createdBy ? `<div class="text-[8px] text-blue-400/80 italic mt-0.5">by ${escapeHTML(d.createdBy)}</div>` : ''}</td>
                <td class="font-bold text-white text-sm">${catEsc}</td>
                <td class="text-xs text-slate-200">${detEsc}</td>
                <td class="text-right text-red-400 font-black text-base">৳${formatAmountWithComma(d.amount)}</td>
                <td class="text-center">
                    <div class="flex items-center justify-center gap-1.5">
                        ${canEdit ? `<button class="m3-btn-icon" onclick="window.editExpense('${d.id}', '${d.date}', '${catEscJs}', ${d.amount}, '${encodeURIComponent(d.details || '')}')" title="এডিট"><i class="fa-solid fa-pen-to-square text-amber-400"></i></button>` : ''}
                        ${canDelete ? `<button class="m3-btn-icon" onclick="window.deleteExpense('${d.id}', '${catEscJs}')" title="ডিলেট"><i class="fa-solid fa-trash-can text-red-400"></i></button>` : ''}
                    </div>
                </td>
            </tr>`;

        mobileHtml += `
            <div class="mobile-card">
                <div class="mobile-card-header">
                    <div>
                        <div class="mobile-card-title text-white font-bold">${catEsc}</div>
                        <div class="mobile-card-sub text-slate-400 font-bold mt-0.5">${formatAppDate(d.date)}</div>
                    </div>
                    <div class="text-right">
                        <div class="text-red-400 font-black text-lg">৳ ${formatAmountWithComma(d.amount)}</div>
                    </div>
                </div>
                <div class="mobile-card-row"><span class="mobile-card-label">বিবরণ:</span><span class="mobile-card-value text-slate-200">${detEsc}</span></div>
                ${d.createdBy ? `<div class="mobile-card-row"><span class="mobile-card-label">এন্ট্রিদাতা:</span><span class="mobile-card-value text-blue-400 text-xs">${escapeHTML(d.createdBy)}</span></div>` : ''}
                ${(canEdit || canDelete) ? `
                <div class="mobile-card-actions">
                    ${canEdit ? `<button class="m3-btn-icon" onclick="window.editExpense('${d.id}', '${d.date}', '${catEscJs}', ${d.amount}, '${encodeURIComponent(d.details || '')}')" title="এডিট"><i class="fa-solid fa-pen-to-square text-amber-400"></i></button>` : ''}
                    ${canDelete ? `<button class="m3-btn-icon" onclick="window.deleteExpense('${d.id}', '${catEscJs}')" title="ডিলেট"><i class="fa-solid fa-trash-can text-red-400"></i></button>` : ''}
                </div>` : ''}
            </div>`;
    });

    tbody.innerHTML = html || '<tr><td colspan="5" class="text-center py-10 italic">কোনো ডাটা নেই</td></tr>';
    if (mobileContainer) mobileContainer.innerHTML = mobileHtml || '<div class="text-center py-10 text-slate-500 font-bold italic">কোনো ডাটা নেই</div>';
}

export function changeExpensePage(dir) {
    if (dir === 'next') currentExpPage++; else currentExpPage--;
    loadRecentExpenses(dir);
}

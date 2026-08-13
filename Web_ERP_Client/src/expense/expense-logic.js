import { ExpenseDAO, db } from '../dao.js';
import { formatAmountWithComma, formatAppDate, toDBDate, getTodayLocalDateString, safeRound, exportTableToExcel } from '../utils.js';

let unsubExpenses = null;
let currentExpenses = [];

export async function initExpenses() {
    if (unsubExpenses) { unsubExpenses(); unsubExpenses = null; }

    // Load categories
    try {
        const catSnap = await db.collection('settings').doc('expense_categories').get();
        const cats = catSnap.exists ? (catSnap.data().list || []) : ['দোকান ভাড়া', 'বিদ্যুৎ বিল', 'স্টাফ বেতন', 'নাস্তা খরচ', 'পরিবহন খরচ', 'অন্যান্য'];
        const select = document.getElementById('expense-cat-filter');
        if (select) {
            let html = '<option value="">সকল ক্যাটাগরি (All Categories)</option>';
            cats.forEach(c => html += `<option value="${c}">${c}</option>`);
            select.innerHTML = html;
        }
    } catch (e) {
        console.error("Load Expense Categories Error:", e);
    }

    const today = toDBDate(getTodayLocalDateString());
    const dateInput = document.getElementById('expense-date-filter');
    if (dateInput) dateInput.value = formatAppDate(today);

    loadExpensesByDate(today);
}

export function loadExpensesByDate(queryDate) {
    if (unsubExpenses) { unsubExpenses(); unsubExpenses = null; }

    unsubExpenses = ExpenseDAO.listenByDate(queryDate, expenses => {
        currentExpenses = expenses;
        filterExpenses();
    });
}

export function filterExpenses() {
    const selectedCat = document.getElementById('expense-cat-filter')?.value || '';

    const filtered = currentExpenses.filter(e => {
        return !selectedCat || (e.category || '') === selectedCat;
    });

    let total = 0;
    filtered.forEach(e => total = safeRound(total + (Number(e.amount) || 0)));

    const badge = document.getElementById('expense-total-badge');
    const fTotal = document.getElementById('expense-footer-total');
    if (badge) badge.innerText = "৳ " + formatAmountWithComma(total);
    if (fTotal) fTotal.innerText = "৳ " + formatAmountWithComma(total);

    renderExpenseTable(filtered);
}

function renderExpenseTable(expenses) {
    const tbody = document.getElementById('expense-tbody');
    if (!tbody) return;

    if (expenses.length === 0) {
        tbody.innerHTML = `<tr><td colspan="4" class="text-center py-12 text-slate-500 italic">এই তারিখে কোনো খরচের রেকর্ড পাওয়া যায়নি</td></tr>`;
        return;
    }

    let html = '';
    expenses.forEach(e => {
        const amt = Number(e.amount) || 0;
        html += `
            <tr class="hover:bg-slate-800/40 transition-colors">
                <td class="py-3 px-4 font-mono text-slate-300">${formatAppDate(e.date)}</td>
                <td class="py-3 px-4 font-bold text-white"><span class="px-2.5 py-1 rounded-lg bg-purple-500/10 text-purple-400 border border-purple-500/20 text-xs">${e.category || 'সাধারণ'}</span></td>
                <td class="py-3 px-4 text-slate-300">${e.details || '-'}</td>
                <td class="py-3 px-4 text-right font-inter font-black text-purple-400 text-sm">৳ ${formatAmountWithComma(amt)}</td>
            </tr>
        `;
    });

    tbody.innerHTML = html;
}

export function handleExportExpenseExcel() {
    exportTableToExcel('expense-table', 'Daily_Expenses.xlsx');
}

import Swal from 'sweetalert2';
import { ExpenseDAO } from '../dao.js';
import { parseAmount, formatAmountWithComma, formatAppDate, toDBDate, numberToBanglaWords, resetLiveWords, promptSecurityPin } from '../utils.js';
import { auditLog } from '../audit.js';
import { AppState } from '../state.js';
import { loadRecentExpenses } from './expense-ui.js';

/**
 * Expense CRUD Actions
 */

let editingExpenseId = null;

export function getEditingId() { return editingExpenseId; }
export function setEditingId(val) { editingExpenseId = val; }

export async function saveExpense() {
    const dateEl = document.getElementById('exp-date');
    const catEl = document.getElementById('exp-category');
    const detEl = document.getElementById('exp-details');
    const amtEl = document.getElementById('exp-amount');
    if (!dateEl || !catEl || !amtEl) return;

    const d = toDBDate(dateEl.value);
    const c = catEl.value;
    const det = detEl.value.trim();
    const a = parseAmount(amtEl.value);

    if(!a || a <= 0) return Swal.fire({ title: 'ত্রুটি!', text: 'সঠিক খরচের পরিমাণ লিখুন', icon: 'error' });

    const btn = document.getElementById('save-exp-btn');
    if(btn) btn.disabled = true;

    // RESTORED: Verification Preview
    const words = numberToBanglaWords(a);
    const isEdit = !!editingExpenseId;

    const confirmPreview = await Swal.fire({
        title: isEdit ? '<i class="fa-solid fa-magnifying-glass text-amber-400 mr-2"></i>খরচ সংশোধন যাচাই' : '<i class="fa-solid fa-magnifying-glass text-blue-400 mr-2"></i>খরচ যাচাই করুন',
        html: `
            <div class="text-left space-y-3 font-bn p-2 bg-slate-900 rounded-2xl border border-slate-800">
                <div class="flex flex-col gap-1 border-b border-slate-800 pb-2">
                    <span class="text-[10px] text-blue-400 font-black uppercase tracking-widest">খরচের ক্যাটাগরি</span>
                    <span class="text-lg text-white font-black">${c}</span>
                </div>
                <div class="flex flex-col gap-1 border-b border-slate-800 pb-2">
                    <span class="text-[10px] text-slate-400 font-black uppercase tracking-widest">বিবরণ / নোট</span>
                    <span class="text-sm text-slate-200 font-bold">${det || 'N/A'}</span>
                </div>
                <div class="flex flex-col gap-1 pt-1">
                    <span class="text-[10px] text-red-400 font-black uppercase tracking-widest">খরচের পরিমাণ</span>
                    <span class="text-2xl text-red-400 font-black">৳ ${formatAmountWithComma(a)}</span>
                    ${words ? `<div class="text-[11px] text-red-400 font-black italic bg-red-500/10 px-2 py-1 rounded-lg border border-red-500/20 mt-1">(${words})</div>` : ''}
                </div>
                <div class="flex flex-col gap-1 pt-2 border-t border-slate-800">
                    <span class="text-[10px] text-slate-400 font-black uppercase tracking-widest">তারিখ</span>
                    <span class="text-sm text-slate-300 font-bold font-mono">${formatAppDate(d)}</span>
                </div>
            </div>
            <p class="text-xs text-amber-400 font-bold mt-3 text-center">তথ্য সঠিক থাকলে "কনফার্ম করুন" বাটনে চাপুন।</p>
        `,
        showCancelButton: true,
        confirmButtonText: '<i class="fa-solid fa-circle-check mr-2"></i>কনফার্ম করুন',
        cancelButtonText: '<i class="fa-solid fa-pen-to-square mr-2"></i>সংশোধন করব',
        customClass: {
            popup: '!bg-slate-950 !text-white !rounded-3xl border border-slate-800 shadow-2xl font-bn',
            confirmButton: 'm3-btn-primary !bg-red-600 hover:!bg-red-500 !px-6 !py-2 rounded-xl font-bold',
            cancelButton: 'm3-btn-tonal !bg-slate-800 hover:!bg-slate-700 !text-slate-300 !px-4 !py-2 rounded-xl font-bold border border-slate-700'
        }
    });

    if (!confirmPreview.isConfirmed) { if (btn) btn.disabled = false; return; }

    try {
        if (editingExpenseId) {
            await ExpenseDAO.update(editingExpenseId, { date: d, category: c, details: det, amount: a });
            auditLog('UPDATE', 'Expenses', editingExpenseId, c, { amount: a });
            editingExpenseId = null;
            if(btn) {
                btn.innerHTML = '<i class="fa-solid fa-cloud-arrow-up"></i> সেভ করুন';
                btn.className = "m3-btn-primary px-6 h-[42px] py-0 text-sm font-black uppercase tracking-widest w-full flex items-center justify-center gap-2";
            }
        } else {
            const id = await ExpenseDAO.add({ date: d, category: c, details: det, amount: a, createdBy: AppState.currentUserEmail });
            auditLog('CREATE', 'Expenses', id, c, { amount: a });
        }

        amtEl.value = ''; detEl.value = '';
        resetLiveWords('exp-amount-words');
        if (catEl) catEl.selectedIndex = 0;
        Swal.fire({ toast: true, position: 'top-end', icon: 'success', title: 'সাফল্য!', timer: 2000 });
        loadRecentExpenses();
    } catch(e) { Swal.fire('Error', 'ব্যর্থ হয়েছেন', 'error'); }
    finally { if(btn) btn.disabled = false; }
}

export async function deleteExpense(id, desc) {
    if (!(await promptSecurityPin("খরচ মুছে ফেলা"))) return;
    try {
        await ExpenseDAO.delete(id);
        auditLog('DELETE', 'Expenses', id, desc);
        loadRecentExpenses();
        Swal.fire('সফল!', 'খরচ মুছে ফেলা হয়েছে।', 'success');
    } catch(err) { Swal.fire('Error', 'মুছতে সমস্যা হয়েছে', 'error'); }
}

export async function editExpense(id, date, category, amount, detailsEncoded) {
    if (!(await promptSecurityPin("খরচ সংশোধন"))) return;

    const details = decodeURIComponent(detailsEncoded || '');
    document.getElementById('exp-date').value = formatAppDate(date);
    const sel = document.getElementById('exp-category');
    if (sel) {
        if (!Array.from(sel.options).some(o => o.value === category)) {
            const opt = document.createElement('option'); opt.value = category; opt.text = category;
            sel.insertBefore(opt, sel.lastChild);
        }
        sel.value = category;
    }
    document.getElementById('exp-amount').value = amount;
    document.getElementById('exp-details').value = details;

    editingExpenseId = id;
    const btn = document.getElementById('save-exp-btn');
    if(btn) {
        btn.innerHTML = '<i class="fa-solid fa-pen-to-square"></i> আপডেট খরচ';
        btn.className = "m3-btn-primary px-6 h-[42px] py-0 text-sm font-black uppercase tracking-widest w-full flex items-center justify-center gap-2 !bg-amber-600 shadow-lg";
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

export async function handleCategoryChange() {
    const sel = document.getElementById('exp-category');
    if (sel.value === 'ADD_NEW') {
        const { value: newCat } = await Swal.fire({
            title: 'নতুন ক্যাটাগরি', input: 'text', showCancelButton: true
        });
        if (newCat && newCat.trim()) {
            const opt = document.createElement('option');
            opt.value = newCat.trim(); opt.text = newCat.trim();
            sel.insertBefore(opt, sel.lastChild);
            sel.value = newCat.trim();
        } else sel.selectedIndex = 0;
    }
}

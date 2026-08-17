import Swal from 'sweetalert2';
import { getAccountLedgerTransactions } from './banking-calc.js';
import { formatAmountWithComma } from '../utils.js';
import { openWhatsAppShareModal } from './banking-ledger-share.js';
import * as xlsx from 'xlsx';

let currentLedgerData = null; // Store for export/print
let currentAccountName = '';
let isCurrentAccountCash = false;

export async function openAccountLedger(accountName, isCash) {
    currentAccountName = accountName;
    isCurrentAccountCash = isCash;
    const defaultFromDate = new Date();
    defaultFromDate.setDate(1); 
    
    const html = `
        <div class="font-bn space-y-4">
            <div class="grid grid-cols-1 md:grid-cols-4 gap-3 bg-slate-900/90 p-4 rounded-2xl border border-slate-800 text-left">
                <div>
                    <label class="block text-[10px] font-bold text-slate-400 mb-1">হতে (From Date)</label>
                    <input type="text" id="bl-from-date" class="w-full bg-slate-950 border border-slate-700 rounded-lg px-2.5 py-1.5 text-white text-xs font-mono outline-none datepicker cursor-pointer" value="${defaultFromDate.toISOString().split('T')[0]}">
                </div>
                <div>
                    <label class="block text-[10px] font-bold text-slate-400 mb-1">পর্যন্ত (To Date)</label>
                    <input type="text" id="bl-to-date" class="w-full bg-slate-950 border border-slate-700 rounded-lg px-2.5 py-1.5 text-white text-xs font-mono outline-none datepicker cursor-pointer" value="${new Date().toISOString().split('T')[0]}">
                </div>
                <div>
                    <label class="block text-[10px] font-bold text-slate-400 mb-1">লেনদেনের ধরন</label>
                    <select id="bl-type" class="w-full bg-slate-950 border border-slate-700 rounded-lg px-2.5 py-1.5 text-white text-xs font-bold outline-none cursor-pointer">
                        <option value="ALL">সকল লেনদেন (All)</option>
                        <option value="CREDIT">শুধুমাত্র জমা (+ Inflow)</option>
                        <option value="DEBIT">উত্তোলন ও খরচ (- Outflow)</option>
                    </select>
                </div>
                <div class="flex items-end gap-2">
                    <button onclick="window.bankingApp.loadLedgerTable('${accountName}', ${isCash})" class="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-1.5 rounded-lg text-xs transition-all shadow-md active:scale-95 cursor-pointer">
                        <i class="fa-solid fa-magnifying-glass mr-1"></i> সার্চ করুন
                    </button>
                </div>
            </div>

            <!-- Summary Metric Cards (Inflow, Outflow, Netflow) -->
            <div class="grid grid-cols-1 sm:grid-cols-3 gap-3" id="bl-summary-cards">
                <div class="p-3 rounded-xl bg-slate-950/80 border border-slate-800 flex items-center justify-between">
                    <div>
                        <div class="text-[10px] font-bold text-slate-400 uppercase">মোট জমা (Inflow)</div>
                        <div class="text-base font-black text-emerald-400 font-mono" id="bl-sum-inflow">৳ ০</div>
                    </div>
                    <div class="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center text-sm"><i class="fa-solid fa-arrow-down"></i></div>
                </div>
                <div class="p-3 rounded-xl bg-slate-950/80 border border-slate-800 flex items-center justify-between">
                    <div>
                        <div class="text-[10px] font-bold text-slate-400 uppercase">মোট খরচ/উত্তোলন (Outflow)</div>
                        <div class="text-base font-black text-red-400 font-mono" id="bl-sum-outflow">৳ ০</div>
                    </div>
                    <div class="w-8 h-8 rounded-lg bg-red-500/10 text-red-400 flex items-center justify-center text-sm"><i class="fa-solid fa-arrow-up"></i></div>
                </div>
                <div class="p-3 rounded-xl bg-slate-950/80 border border-slate-800 flex items-center justify-between">
                    <div>
                        <div class="text-[10px] font-bold text-slate-400 uppercase">নিট ক্যাশ ফ্লো (Net Flow)</div>
                        <div class="text-base font-black text-blue-400 font-mono" id="bl-sum-netflow">৳ ০</div>
                    </div>
                    <div class="w-8 h-8 rounded-lg bg-blue-500/10 text-blue-400 flex items-center justify-center text-sm"><i class="fa-solid fa-chart-line"></i></div>
                </div>
            </div>
            
            <div class="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800 pb-2">
                <div class="text-xs text-slate-400 font-bold" id="bl-txn-count-badge">মোট ০টি লেনদেন পাওয়া গেছে</div>
                <div class="flex items-center gap-2">
                    <button onclick="window.bankingApp.shareLedgerWhatsApp()" class="bg-emerald-600/20 border border-emerald-500/40 hover:bg-emerald-600 text-emerald-300 hover:text-white px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-md"><i class="fa-brands fa-whatsapp text-emerald-400 text-sm"></i> WhatsApp শেয়ার</button>
                    <button data-perm="printBankLedger" onclick="window.bankingApp.printLedger()" class="bg-slate-800 border border-slate-700 hover:bg-slate-700 text-slate-200 px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"><i class="fa-solid fa-print text-blue-400"></i> প্রিন্ট / PDF</button>
                    <button data-perm="exportBankLedger" onclick="window.bankingApp.exportLedgerExcel()" class="bg-slate-800 border border-slate-700 hover:bg-slate-700 text-slate-200 px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"><i class="fa-solid fa-file-excel text-emerald-400"></i> এক্সেল</button>
                </div>
            </div>

            <div class="bg-slate-950 rounded-2xl border border-slate-800 overflow-hidden">
                <div class="overflow-x-auto max-h-[420px] overflow-y-auto custom-scrollbar">
                    <table class="w-full text-left border-collapse">
                        <thead class="bg-slate-900 border-b border-slate-800 sticky top-0 z-10">
                            <tr>
                                <th class="p-3 text-xs font-bold text-slate-400 whitespace-nowrap">তারিখ</th>
                                <th class="p-3 text-xs font-bold text-slate-400 whitespace-nowrap">বিবরণ / নোট</th>
                                <th class="p-3 text-xs font-bold text-slate-400 whitespace-nowrap text-right">জমা (Deposit)</th>
                                <th class="p-3 text-xs font-bold text-slate-400 whitespace-nowrap text-right">খরচ (Withdraw)</th>
                                <th class="p-3 text-xs font-bold text-slate-400 whitespace-nowrap text-right">বর্তমান ব্যালেন্স</th>
                            </tr>
                        </thead>
                        <tbody id="bl-table-body" class="divide-y divide-slate-800/50">
                            <tr><td colspan="5" class="p-8 text-center text-slate-500 text-sm">লোড হচ্ছে...</td></tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    `;

    Swal.fire({
        title: `<div class="font-bn font-black text-white text-lg md:text-xl flex items-center justify-center gap-2">
            ${isCash ? '<i class="fa-solid fa-wallet text-emerald-400"></i>' : '<i class="fa-solid fa-building-columns text-blue-400"></i>'}
            <span>${accountName} - বিস্তারিত লেজার</span>
        </div>`,
        html: html,
        width: '920px',
        showConfirmButton: false,
        showCloseButton: true,
        customClass: { popup: '!bg-slate-900 !text-white !rounded-3xl border border-slate-700/80' },
        didOpen: () => {
            loadLedgerTable(accountName, isCash);
        }
    });
}

export async function loadLedgerTable(accountName, isCash) {
    const fromDate = document.getElementById('bl-from-date')?.value || '';
    const toDate = document.getElementById('bl-to-date')?.value || '';
    const filterType = document.getElementById('bl-type')?.value || 'ALL';
    const tbody = document.getElementById('bl-table-body');
    if (!tbody) return;

    tbody.innerHTML = '<tr><td colspan="5" class="p-8 text-center text-slate-500 text-sm"><i class="fa-solid fa-spinner fa-spin mr-2"></i> ডাটা ফেচ করা হচ্ছে...</td></tr>';

    try {
        const data = await getAccountLedgerTransactions(accountName, isCash, fromDate, toDate);
        currentLedgerData = data; 
        
        let totalInflow = 0, totalOutflow = 0, filteredCount = 0;
        let trs = `
            <tr class="bg-slate-900/60 font-bold border-b border-slate-800">
                <td class="p-3 text-xs text-slate-300 whitespace-nowrap" colspan="2"><i class="fa-solid fa-flag-checkered text-blue-400 mr-1.5"></i>প্রারম্ভিক ব্যালেন্স (Opening Balance)</td>
                <td class="p-3 text-xs text-right"></td><td class="p-3 text-xs text-right"></td>
                <td class="p-3 text-xs text-right font-black ${data.openingBalance < 0 ? 'text-red-400' : 'text-emerald-400'} font-mono">৳ ${formatAmountWithComma(data.openingBalance)}</td>
            </tr>
        `;

        data.transactions.forEach(t => {
            if (t.isCredit) totalInflow += Number(t.amount || 0);
            if (t.isDebit) totalOutflow += Number(t.amount || 0);

            if (filterType === 'CREDIT' && !t.isCredit) return;
            if (filterType === 'DEBIT' && !t.isDebit) return;
            filteredCount++;

            const depositStr = t.isCredit ? `<span class="text-emerald-400 font-bold font-mono">+ ৳ ${formatAmountWithComma(t.amount)}</span>` : '<span class="text-slate-600">-</span>';
            const withdrawStr = t.isDebit ? `<span class="text-red-400 font-bold font-mono">- ৳ ${formatAmountWithComma(t.amount)}</span>` : '<span class="text-slate-600">-</span>';
            const balColor = t.runningBalance < 0 ? 'text-red-400' : 'text-slate-200';
            const formattedDate = new Date(t.dateStr).toLocaleDateString('en-GB');
            
            const deleteBtn = t.type !== 'CUSTOMER_PAYMENT' 
                ? `<button data-perm="deleteBankTransaction" onclick="window.bankingApp.deleteBankingTransaction('${t.id}')" class="text-slate-500 hover:text-red-400 p-1 rounded transition-colors cursor-pointer" title="ডিলিট করুন"><i class="fa-solid fa-trash-can text-xs"></i></button>`
                : '';

            trs += `
                <tr class="hover:bg-slate-800/40 transition-colors text-left group border-b border-slate-800/40">
                    <td class="p-3 text-xs text-slate-300 whitespace-nowrap font-mono">
                        <div class="flex items-center justify-between">
                            <span>${formattedDate}</span>
                            <div class="opacity-0 group-hover:opacity-100 transition-opacity ml-2">${deleteBtn}</div>
                        </div>
                    </td>
                    <td class="p-3 text-xs text-slate-200">
                        <div class="font-black text-white flex items-center gap-1.5"><span class="px-1.5 py-0.5 rounded text-[10px] ${t.isCredit ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-red-500/10 text-red-400 border border-red-500/20'}">${t.type}</span></div>
                        <div class="text-[11px] text-slate-400 mt-0.5">${t.note}</div>
                    </td>
                    <td class="p-3 text-xs text-right whitespace-nowrap">${depositStr}</td>
                    <td class="p-3 text-xs text-right whitespace-nowrap">${withdrawStr}</td>
                    <td class="p-3 text-xs text-right font-black font-mono ${balColor}">৳ ${formatAmountWithComma(t.runningBalance)}</td>
                </tr>
            `;
        });

        if (filteredCount === 0) {
            trs += `<tr><td colspan="5" class="p-8 text-center text-slate-500 text-xs italic font-bold">এই তারিখে কোনো ট্রানজাকশন নেই।</td></tr>`;
        }

        trs += `
            <tr class="bg-slate-900/80 border-t-2 border-slate-700">
                <td class="p-3 text-xs text-white font-black whitespace-nowrap" colspan="2"><i class="fa-solid fa-circle-check text-emerald-400 mr-1.5"></i>সর্বশেষ ব্যালেন্স (Closing Balance)</td>
                <td class="p-3 text-xs text-right"></td><td class="p-3 text-xs text-right"></td>
                <td class="p-3 text-sm text-right font-black ${data.closingBalance < 0 ? 'text-red-400' : 'text-emerald-400'} font-mono">৳ ${formatAmountWithComma(data.closingBalance)}</td>
            </tr>
        `;

        tbody.innerHTML = trs;

        // Update Summary Metric Badges
        const netFlow = totalInflow - totalOutflow;
        const inEl = document.getElementById('bl-sum-inflow');
        const outEl = document.getElementById('bl-sum-outflow');
        const netEl = document.getElementById('bl-sum-netflow');
        const countEl = document.getElementById('bl-txn-count-badge');

        if (inEl) inEl.innerText = `৳ ${formatAmountWithComma(totalInflow)}`;
        if (outEl) outEl.innerText = `৳ ${formatAmountWithComma(totalOutflow)}`;
        if (netEl) {
            netEl.className = `text-base font-black font-mono ${netFlow >= 0 ? 'text-emerald-400' : 'text-red-400'}`;
            netEl.innerText = `${netFlow >= 0 ? '+' : '-'} ৳ ${formatAmountWithComma(Math.abs(netFlow))}`;
        }
        if (countEl) countEl.innerText = `মোট ${filteredCount}টি লেনদেন প্রদর্শিত হচ্ছে`;

    } catch (e) {
        console.error(e);
        tbody.innerHTML = '<tr><td colspan="5" class="p-8 text-center text-red-400 text-xs font-bold">ডাটা লোড করতে সমস্যা হয়েছে!</td></tr>';
    }
}

export function shareLedgerWhatsApp() {
    openWhatsAppShareModal(currentAccountName, isCurrentAccountCash, currentLedgerData);
}

export function printLedger() {
    if (!currentLedgerData) return Swal.fire('ত্রুটি', 'আগে লেজার লোড করুন', 'error');
    
    const printWindow = window.open('', '_blank');
    let rowsHtml = `<tr><td colspan="2" style="padding: 8px; font-weight: bold;">প্রারম্ভিক ব্যালেন্স (Opening Balance)</td><td></td><td></td><td style="padding: 8px; text-align: right; font-weight: bold;">৳ ${formatAmountWithComma(currentLedgerData.openingBalance)}</td></tr>`;
    
    currentLedgerData.transactions.forEach(t => {
        const formattedDate = new Date(t.dateStr).toLocaleDateString('en-GB');
        rowsHtml += `<tr><td style="padding: 8px; border-bottom: 1px solid #ddd;">${formattedDate}</td><td style="padding: 8px; border-bottom: 1px solid #ddd;"><strong>${t.type}</strong><br><small>${t.note}</small></td><td style="padding: 8px; text-align: right; border-bottom: 1px solid #ddd;">${t.isCredit ? '৳ ' + formatAmountWithComma(t.amount) : '-'}</td><td style="padding: 8px; text-align: right; border-bottom: 1px solid #ddd;">${t.isDebit ? '৳ ' + formatAmountWithComma(t.amount) : '-'}</td><td style="padding: 8px; text-align: right; border-bottom: 1px solid #ddd; font-weight: bold;">৳ ${formatAmountWithComma(t.runningBalance)}</td></tr>`;
    });
    
    rowsHtml += `<tr><td colspan="2" style="padding: 8px; font-weight: bold; border-top: 2px solid #000;">সর্বশেষ ব্যালেন্স (Closing Balance)</td><td style="border-top: 2px solid #000;"></td><td style="border-top: 2px solid #000;"></td><td style="padding: 8px; text-align: right; font-weight: bold; border-top: 2px solid #000;">৳ ${formatAmountWithComma(currentLedgerData.closingBalance)}</td></tr>`;

    const html = `<html><head><title>${currentAccountName} Ledger</title><style>body { font-family: Arial, sans-serif; padding: 20px; } table { width: 100%; border-collapse: collapse; margin-top: 20px; font-size: 12px; } th { background: #f0f0f0; padding: 10px; text-align: left; border-bottom: 2px solid #333; } .text-right { text-align: right; }</style></head><body><h2 style="text-align: center;">Maa Motors ERP</h2><h3 style="text-align: center;">Bank Ledger: ${currentAccountName}</h3><p style="text-align: center; color: #555;">From: ${document.getElementById('bl-from-date')?.value || ''} To: ${document.getElementById('bl-to-date')?.value || ''}</p><table><thead><tr><th>Date</th><th>Description / Note</th><th class="text-right">Deposit</th><th class="text-right">Withdrawal</th><th class="text-right">Balance</th></tr></thead><tbody>${rowsHtml}</tbody></table><div style="margin-top: 50px; text-align: center; font-size: 10px; color: #888;">Printed on: ${new Date().toLocaleString('en-GB')}</div><script>window.onload = () => { window.print(); window.close(); }</script></body></html>`;
    
    printWindow.document.write(html);
    printWindow.document.close();
}

export function exportLedgerExcel() {
    if (!currentLedgerData) return Swal.fire('ত্রুটি', 'আগে লেজার লোড করুন', 'error');
    
    const rows = [['Date', 'Description / Note', 'Deposit (+)', 'Withdrawal (-)', 'Balance'], ['', 'Opening Balance', '', '', currentLedgerData.openingBalance]];
    currentLedgerData.transactions.forEach(t => {
        const formattedDate = new Date(t.dateStr).toLocaleDateString('en-GB');
        rows.push([formattedDate, `${t.type} - ${t.note}`, t.isCredit ? t.amount : 0, t.isDebit ? t.amount : 0, t.runningBalance]);
    });
    rows.push(['', 'Closing Balance', '', '', currentLedgerData.closingBalance]);
    
    const wb = xlsx.utils.book_new();
    const ws = xlsx.utils.aoa_to_sheet(rows);
    xlsx.utils.book_append_sheet(wb, ws, "Ledger");
    xlsx.writeFile(wb, `Bank_Ledger_${currentAccountName}_${new Date().getTime()}.xlsx`);
}

export async function deleteBankingTransaction(txnId) {
    const { BankTransactionDAO } = await import('../dao.js');
    const { promptSecurityPin } = await import('../utils.js');
    const { auditLog } = await import('../audit.js');

    const result = await Swal.fire({
        title: 'আপনি কি নিশ্চিত?',
        text: "এই ট্রানজাকশনটি ডিলিট করলে ব্যাংকের ব্যালেন্স থেকে এটি অ্যাডজাস্ট হয়ে যাবে।",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#ef4444',
        cancelButtonColor: '#64748b',
        confirmButtonText: 'হ্যাঁ, ডিলিট করুন!',
        cancelButtonText: 'বাতিল',
        customClass: { popup: '!bg-slate-900 !text-white !rounded-3xl border border-slate-700' }
    });

    if (result.isConfirmed) {
        const isPinValid = await promptSecurityPin('Delete Transaction (Master PIN)');
        if (!isPinValid) return;

        Swal.fire({ title: 'ডিলিট করা হচ্ছে...', allowOutsideClick: false, didOpen: () => Swal.showLoading() });
        try {
            await BankTransactionDAO.delete(txnId);
            auditLog('BANKING_TXN_DELETE', 'Admin', 'BankingLedger', `Deleted bank transaction ID: ${txnId}`);
            Swal.fire({ title: 'ডিলিটেড!', text: 'ট্রানজাকশনটি সফলভাবে ডিলিট করা হয়েছে।', icon: 'success', customClass: { popup: '!bg-slate-900 !text-white !rounded-3xl border border-slate-700' }});
            await loadLedgerTable(currentAccountName, isCurrentAccountCash);
            if (typeof window.bankingApp?.refreshCards === 'function') {
                window.bankingApp.refreshCards();
            }
        } catch (error) {
            console.error(error);
            Swal.fire('ত্রুটি', 'ডিলিট করতে সমস্যা হয়েছে!', 'error');
        }
    }
}

import Swal from 'sweetalert2';
import { getAccountLedgerTransactions } from './banking-calc.js';
import { formatAmountWithComma } from '../utils.js';
import * as xlsx from 'xlsx';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

let currentLedgerData = null; // Store for export/print
let currentAccountName = '';

export async function openAccountLedger(accountName, isCash) {
    currentAccountName = accountName;
    const defaultFromDate = new Date();
    defaultFromDate.setDate(1); 
    
    const html = `
        <div class="font-bn space-y-4">
            <div class="grid grid-cols-1 md:grid-cols-4 gap-3 bg-slate-900 p-4 rounded-2xl border border-slate-700 text-left">
                <div>
                    <label class="block text-[10px] font-bold text-slate-400 mb-1">From Date</label>
                    <input type="date" id="bl-from-date" class="w-full bg-slate-950 border border-slate-700 rounded-lg px-2 py-1.5 text-white text-sm outline-none" value="${defaultFromDate.toISOString().split('T')[0]}">
                </div>
                <div>
                    <label class="block text-[10px] font-bold text-slate-400 mb-1">To Date</label>
                    <input type="date" id="bl-to-date" class="w-full bg-slate-950 border border-slate-700 rounded-lg px-2 py-1.5 text-white text-sm outline-none" value="${new Date().toISOString().split('T')[0]}">
                </div>
                <div>
                    <label class="block text-[10px] font-bold text-slate-400 mb-1">Type</label>
                    <select id="bl-type" class="w-full bg-slate-950 border border-slate-700 rounded-lg px-2 py-1.5 text-white text-sm outline-none">
                        <option value="ALL">All Transactions</option>
                        <option value="CREDIT">Deposits & Collections (+)</option>
                        <option value="DEBIT">Withdrawals & Transfers (-)</option>
                    </select>
                </div>
                <div class="flex items-end gap-2">
                    <button onclick="window.bankingApp.loadLedgerTable('${accountName}', ${isCash})" class="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-1.5 rounded-lg text-sm transition-all shadow-md">
                        <i class="fa-solid fa-magnifying-glass mr-1"></i> সার্চ
                    </button>
                </div>
            </div>
            
            <div class="flex justify-end gap-2">
                <button onclick="window.bankingApp.printLedger()" class="bg-slate-700 hover:bg-slate-600 text-white px-3 py-1.5 rounded text-xs font-bold transition-all"><i class="fa-solid fa-print mr-1"></i> Print / PDF</button>
                <button onclick="window.bankingApp.exportLedgerExcel()" class="bg-emerald-600 hover:bg-emerald-500 text-white px-3 py-1.5 rounded text-xs font-bold transition-all"><i class="fa-solid fa-file-excel mr-1"></i> Export Excel</button>
            </div>

            <div class="bg-slate-950 rounded-2xl border border-slate-700 overflow-hidden">
                <div class="overflow-x-auto max-h-[450px] overflow-y-auto custom-scrollbar">
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
        title: `<div class="font-bn font-black text-white text-xl flex items-center gap-2">
            ${isCash ? '<i class="fa-solid fa-wallet text-emerald-400"></i>' : '<i class="fa-solid fa-building-columns text-blue-400"></i>'}
            ${accountName} - বিস্তারিত লেজার
        </div>`,
        html: html,
        width: '900px',
        showConfirmButton: false,
        showCloseButton: true,
        customClass: { popup: '!bg-slate-900 !text-white !rounded-3xl border border-slate-700' },
        didOpen: () => {
            loadLedgerTable(accountName, isCash);
        }
    });
}

export async function loadLedgerTable(accountName, isCash) {
    const fromDate = document.getElementById('bl-from-date').value;
    const toDate = document.getElementById('bl-to-date').value;
    const filterType = document.getElementById('bl-type').value;
    const tbody = document.getElementById('bl-table-body');
    if (!tbody) return;

    tbody.innerHTML = '<tr><td colspan="5" class="p-8 text-center text-slate-500 text-sm"><i class="fa-solid fa-spinner fa-spin mr-2"></i> ডাটা ফেচ করা হচ্ছে...</td></tr>';

    try {
        const data = await getAccountLedgerTransactions(accountName, isCash, fromDate, toDate);
        currentLedgerData = data; 
        
        let trs = '';
        
        trs += `
            <tr class="bg-slate-800/30">
                <td class="p-3 text-sm text-slate-400 font-bold whitespace-nowrap" colspan="2">প্রারম্ভিক ব্যালেন্স (Opening Balance)</td>
                <td class="p-3 text-sm text-right"></td>
                <td class="p-3 text-sm text-right"></td>
                <td class="p-3 text-sm text-right font-bold ${data.openingBalance < 0 ? 'text-red-400' : 'text-emerald-400'}">৳ ${formatAmountWithComma(data.openingBalance)}</td>
            </tr>
        `;

        let filteredCount = 0;
        data.transactions.forEach(t => {
            if (filterType === 'CREDIT' && !t.isCredit) return;
            if (filterType === 'DEBIT' && !t.isDebit) return;
            filteredCount++;

            const depositStr = t.isCredit ? `<span class="text-emerald-400 font-bold">+ ${formatAmountWithComma(t.amount)}</span>` : '-';
            const withdrawStr = t.isDebit ? `<span class="text-red-400 font-bold">- ${formatAmountWithComma(t.amount)}</span>` : '-';
            const balColor = t.runningBalance < 0 ? 'text-red-400' : 'text-slate-200';
            
            const formattedDate = new Date(t.dateStr).toLocaleDateString('en-GB');

            trs += `
                <tr class="hover:bg-slate-800/50 transition-colors text-left">
                    <td class="p-3 text-sm text-slate-300 whitespace-nowrap">${formattedDate}</td>
                    <td class="p-3 text-sm text-slate-300">
                        <div class="font-bold">${t.type}</div>
                        <div class="text-[10px] text-slate-500">${t.note}</div>
                    </td>
                    <td class="p-3 text-sm text-right">${depositStr}</td>
                    <td class="p-3 text-sm text-right">${withdrawStr}</td>
                    <td class="p-3 text-sm text-right font-bold ${balColor}">৳ ${formatAmountWithComma(t.runningBalance)}</td>
                </tr>
            `;
        });

        if (filteredCount === 0) {
            trs += `<tr><td colspan="5" class="p-8 text-center text-slate-500 text-sm">এই তারিখে কোনো ট্রানজাকশন নেই।</td></tr>`;
        }

        trs += `
            <tr class="bg-slate-800/50 border-t border-slate-700">
                <td class="p-3 text-sm text-white font-bold whitespace-nowrap" colspan="2">সর্বশেষ ব্যালেন্স (Closing Balance)</td>
                <td class="p-3 text-sm text-right"></td>
                <td class="p-3 text-sm text-right"></td>
                <td class="p-3 text-sm text-right font-black ${data.closingBalance < 0 ? 'text-red-400' : 'text-emerald-400'} text-lg">৳ ${formatAmountWithComma(data.closingBalance)}</td>
            </tr>
        `;

        tbody.innerHTML = trs;
    } catch (e) {
        console.error(e);
        tbody.innerHTML = '<tr><td colspan="5" class="p-8 text-center text-red-400 text-sm">ডাটা লোড করতে সমস্যা হয়েছে!</td></tr>';
    }
}

export function printLedger() {
    if (!currentLedgerData) {
        Swal.fire('ত্রুটি', 'আগে লেজার লোড করুন', 'error');
        return;
    }
    
    // Create print window
    const printWindow = window.open('', '_blank');
    
    let rowsHtml = `
        <tr>
            <td colspan="2" style="padding: 8px; font-weight: bold;">প্রারম্ভিক ব্যালেন্স (Opening Balance)</td>
            <td></td>
            <td></td>
            <td style="padding: 8px; text-align: right; font-weight: bold;">${formatAmountWithComma(currentLedgerData.openingBalance)}</td>
        </tr>
    `;
    
    currentLedgerData.transactions.forEach(t => {
        const formattedDate = new Date(t.dateStr).toLocaleDateString('en-GB');
        rowsHtml += `
            <tr>
                <td style="padding: 8px; border-bottom: 1px solid #ddd;">${formattedDate}</td>
                <td style="padding: 8px; border-bottom: 1px solid #ddd;"><strong>${t.type}</strong><br><small>${t.note}</small></td>
                <td style="padding: 8px; text-align: right; border-bottom: 1px solid #ddd;">${t.isCredit ? formatAmountWithComma(t.amount) : '-'}</td>
                <td style="padding: 8px; text-align: right; border-bottom: 1px solid #ddd;">${t.isDebit ? formatAmountWithComma(t.amount) : '-'}</td>
                <td style="padding: 8px; text-align: right; border-bottom: 1px solid #ddd; font-weight: bold;">${formatAmountWithComma(t.runningBalance)}</td>
            </tr>
        `;
    });
    
    rowsHtml += `
        <tr>
            <td colspan="2" style="padding: 8px; font-weight: bold; border-top: 2px solid #000;">সর্বশেষ ব্যালেন্স (Closing Balance)</td>
            <td style="border-top: 2px solid #000;"></td>
            <td style="border-top: 2px solid #000;"></td>
            <td style="padding: 8px; text-align: right; font-weight: bold; border-top: 2px solid #000;">${formatAmountWithComma(currentLedgerData.closingBalance)}</td>
        </tr>
    `;

    const html = `
        <html>
        <head>
            <title>${currentAccountName} Ledger</title>
            <style>
                body { font-family: Arial, sans-serif; padding: 20px; }
                table { width: 100%; border-collapse: collapse; margin-top: 20px; font-size: 12px; }
                th { background: #f0f0f0; padding: 10px; text-align: left; border-bottom: 2px solid #333; }
                .text-right { text-align: right; }
            </style>
        </head>
        <body>
            <h2 style="text-align: center;">Maa Motors ERP</h2>
            <h3 style="text-align: center;">Bank Ledger: ${currentAccountName}</h3>
            <p style="text-align: center; color: #555;">From: ${document.getElementById('bl-from-date').value} To: ${document.getElementById('bl-to-date').value}</p>
            <table>
                <thead>
                    <tr>
                        <th>Date</th>
                        <th>Description / Note</th>
                        <th class="text-right">Deposit</th>
                        <th class="text-right">Withdrawal</th>
                        <th class="text-right">Balance</th>
                    </tr>
                </thead>
                <tbody>
                    ${rowsHtml}
                </tbody>
            </table>
            <div style="margin-top: 50px; text-align: center; font-size: 10px; color: #888;">
                Printed on: ${new Date().toLocaleString('en-GB')}
            </div>
            <script>
                window.onload = () => { window.print(); window.close(); }
            </script>
        </body>
        </html>
    `;
    
    printWindow.document.write(html);
    printWindow.document.close();
}

export function exportLedgerExcel() {
    if (!currentLedgerData) {
        Swal.fire('ত্রুটি', 'আগে লেজার লোড করুন', 'error');
        return;
    }
    
    const rows = [];
    rows.push(['Date', 'Description / Note', 'Deposit (+)', 'Withdrawal (-)', 'Balance']);
    rows.push(['', 'Opening Balance', '', '', currentLedgerData.openingBalance]);
    
    currentLedgerData.transactions.forEach(t => {
        const formattedDate = new Date(t.dateStr).toLocaleDateString('en-GB');
        const desc = t.type + ' - ' + t.note;
        rows.push([
            formattedDate,
            desc,
            t.isCredit ? t.amount : 0,
            t.isDebit ? t.amount : 0,
            t.runningBalance
        ]);
    });
    
    rows.push(['', 'Closing Balance', '', '', currentLedgerData.closingBalance]);
    
    const wb = xlsx.utils.book_new();
    const ws = xlsx.utils.aoa_to_sheet(rows);
    xlsx.utils.book_append_sheet(wb, ws, "Ledger");
    xlsx.writeFile(wb, \`Bank_Ledger_\${currentAccountName}_\${new Date().getTime()}.xlsx\`);
}

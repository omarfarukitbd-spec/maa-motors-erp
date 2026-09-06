import Swal from 'sweetalert2';
import * as xlsx from 'xlsx';
import { formatAmountWithComma, formatAppDate } from '../utils.js';
import { printViaIframe } from '../utils/smart-print-engine.js';

export function printLedger(ledgerData, accountName, fromDate, toDate, filterType = 'ALL') {
    if (!ledgerData || !ledgerData.transactions) {
        Swal.fire({
            title: 'ডাটা পাওয়া যায়নি',
            text: 'অনুগ্রহ করে আগে লেজার লোড হতে দিন।',
            icon: 'warning',
            customClass: { popup: '!bg-slate-900 !text-white !rounded-3xl border border-slate-700' }
        });
        return;
    }

    let rowsHtml = `
        <tr style="background-color: #f8fafc; font-weight: bold; border-bottom: 1.5px solid #cbd5e1;">
            <td style="padding: 6px 8px; text-align: center; color: #64748b;">-</td>
            <td style="padding: 6px 8px; white-space: nowrap;" colspan="2">প্রারম্ভিক ব্যালেন্স (Opening Balance)</td>
            <td style="padding: 6px 8px; text-align: right;"></td>
            <td style="padding: 6px 8px; text-align: right;"></td>
            <td style="padding: 6px 8px; text-align: right; font-weight: 900; font-family: monospace; color: ${ledgerData.openingBalance < 0 ? '#dc2626' : '#059669'};">৳ ${formatAmountWithComma(ledgerData.openingBalance)}</td>
        </tr>
    `;

    let serial = 0;
    let totalInflow = 0;
    let totalOutflow = 0;

    ledgerData.transactions.forEach(t => {
        if (t.isCredit) totalInflow += Number(t.amount || 0);
        if (t.isDebit) totalOutflow += Number(t.amount || 0);

        if (filterType === 'CREDIT' && !t.isCredit) return;
        if (filterType === 'DEBIT' && !t.isDebit) return;
        serial++;

        const formattedDate = formatAppDate(t.dateStr);
        const deposit = t.isCredit ? `৳ ${formatAmountWithComma(t.amount)}` : '-';
        const withdraw = t.isDebit ? `৳ ${formatAmountWithComma(t.amount)}` : '-';
        const balColor = t.runningBalance < 0 ? '#dc2626' : '#0f172a';
        const typeLabel = t.type === 'CUSTOMER_PAYMENT' ? 'কাস্টমার জমা' : (t.type === 'BUSINESS_EXPENSE' ? 'খরচ' : (t.type === 'DEPOSIT' ? 'ক্যাশ জমা' : (t.type === 'WITHDRAWAL' ? 'উত্তোলন' : t.type)));

        rowsHtml += `
            <tr style="border-bottom: 1px solid #e2e8f0; font-size: 11px;">
                <td style="padding: 5px 6px; text-align: center; font-weight: bold; color: #64748b;">${serial}</td>
                <td style="padding: 5px 6px; white-space: nowrap; font-family: monospace;">${formattedDate}</td>
                <td style="padding: 5px 8px;">
                    <div style="font-weight: bold; color: #1e293b;">${typeLabel}</div>
                    <div style="font-size: 10px; color: #475569;">${t.note || ''}</div>
                </td>
                <td style="padding: 5px 8px; text-align: right; color: #059669; font-weight: bold; font-family: monospace; white-space: nowrap;">${deposit}</td>
                <td style="padding: 5px 8px; text-align: right; color: #dc2626; font-weight: bold; font-family: monospace; white-space: nowrap;">${withdraw}</td>
                <td style="padding: 5px 8px; text-align: right; font-weight: 800; font-family: monospace; color: ${balColor}; white-space: nowrap;">৳ ${formatAmountWithComma(t.runningBalance)}</td>
            </tr>
        `;
    });

    if (serial === 0) {
        rowsHtml += `<tr><td colspan="6" style="padding: 16px; text-align: center; color: #64748b; font-style: italic;">এই ফিল্টারে কোনো লেনদেন পাওয়া যায়নি</td></tr>`;
    }

    const isCreditOnly = (filterType === 'CREDIT');
    const totalRowLabel = isCreditOnly ? 'সর্বমোট জমা (Total Inflow)' : 'সর্বশেষ ব্যালেন্স (Closing Balance)';

    rowsHtml += `
        <tr style="background-color: #f1f5f9; font-weight: bold; border-top: 2px solid #0f172a;">
            <td style="padding: 7px 8px; text-align: center; color: #64748b;">-</td>
            <td style="padding: 7px 8px; white-space: nowrap;" colspan="2">${totalRowLabel}</td>
            <td style="padding: 7px 8px; text-align: right; color: #059669; font-family: monospace; font-size: ${isCreditOnly ? '12px' : '11px'}; font-weight: 900;">৳ ${formatAmountWithComma(totalInflow)}</td>
            <td style="padding: 7px 8px; text-align: right; color: #dc2626; font-family: monospace;">${isCreditOnly ? '-' : '৳ ' + formatAmountWithComma(totalOutflow)}</td>
            <td style="padding: 7px 8px; text-align: right; font-weight: 900; font-family: monospace; color: ${ledgerData.closingBalance < 0 ? '#dc2626' : '#059669'};">৳ ${formatAmountWithComma(ledgerData.closingBalance)}</td>
        </tr>
    `;

    const cleanAccountName = accountName || 'অ্যাকাউন্ট';
    const displayRange = (fromDate || toDate) ? `${fromDate || 'শুরু'} হতে ${toDate || 'বর্তমান'}` : 'সকল লেনদেন';
    const safeTitle = `${cleanAccountName.replace(/[^a-zA-Z0-9\u0980-\u09FF]/g, '_')}_Ledger`;

    const summaryBanner = isCreditOnly ? `
        <div style="background-color: #ecfdf5; border: 1.5px solid #a7f3d0; border-radius: 8px; padding: 8px 14px; margin-bottom: 12px; display: flex; justify-content: space-between; align-items: center;">
            <div>
                <div style="font-size: 11px; font-weight: bold; color: #065f46; text-transform: uppercase;">মোট জমা (Total Inflow)</div>
                <div style="font-size: 18px; font-weight: 900; color: #047857; font-family: monospace;">৳ ${formatAmountWithComma(totalInflow)}</div>
            </div>
            <div style="text-align: right;">
                <div style="font-size: 11px; font-weight: bold; color: #065f46;">মোট জমা প্রদানকারী (Total Entries)</div>
                <div style="font-size: 15px; font-weight: 900; color: #047857;">${serial} জন / টি</div>
            </div>
        </div>
    ` : '';

    const htmlBody = `
        <div style="font-family: 'Inter', 'Kalpurush', sans-serif; color: #0f172a; padding: 4px;">
            <div style="text-align: center; border-bottom: 2px solid #0f172a; padding-bottom: 10px; margin-bottom: 14px;">
                <h1 style="margin: 0; font-size: 22px; font-weight: 900; letter-spacing: 0.5px; color: #0f172a;">মা মটরস (MAA MOTORS)</h1>
                <div style="font-size: 13px; font-weight: bold; color: #475569; margin-top: 3px;">অ্যাকাউন্ট লেজার স্টেটমেন্ট — ${cleanAccountName}</div>
            </div>

            ${summaryBanner}

            <div style="display: flex; justify-content: space-between; align-items: flex-end; margin-bottom: 12px; font-size: 11px;">
                <div>
                    <div style="font-weight: bold; color: #1e293b;">তারিখ সীমা: <span style="font-weight: normal; color: #475569;">${displayRange}</span></div>
                    <div style="font-weight: bold; color: #1e293b;">ফিল্টার: <span style="font-weight: normal; color: #475569;">${filterType === 'ALL' ? 'সকল লেনদেন' : (filterType === 'CREDIT' ? 'শুধুমাত্র জমা (+ Inflow)' : 'শুধুমাত্র খরচ (- Outflow)')}</span></div>
                </div>
                <div style="text-align: right; color: #64748b;">
                    <div>মোট এন্ট্রি: <strong>${serial}</strong> টি</div>
                    <div>প্রিন্ট সময়: ${new Date().toLocaleString('en-GB')}</div>
                </div>
            </div>

            <table class="data-table" style="width: 100%; border-collapse: collapse; font-size: 11px;">
                <thead>
                    <tr style="background-color: #e2e8f0; color: #1e293b; font-weight: bold; border-bottom: 2px solid #94a3b8;">
                        <th style="width: 35px; text-align: center; padding: 7px 4px;">#</th>
                        <th style="width: 80px; text-align: center; padding: 7px 4px;">তারিখ</th>
                        <th style="text-align: left; padding: 7px 8px;">বিবরণ / নোট</th>
                        <th style="width: 95px; text-align: right; padding: 7px 8px;">জমা (+ Inflow)</th>
                        <th style="width: 95px; text-align: right; padding: 7px 8px;">খরচ (- Outflow)</th>
                        <th style="width: 110px; text-align: right; padding: 7px 8px;">বর্তমান ব্যালেন্স</th>
                    </tr>
                </thead>
                <tbody>
                    ${rowsHtml}
                </tbody>
            </table>

            <div style="margin-top: 35px; display: flex; justify-content: space-between; font-size: 11px; color: #64748b; padding-top: 20px;">
                <div style="border-top: 1px dashed #94a3b8; width: 150px; text-align: center; padding-top: 4px;">হিসাবরক্ষক</div>
                <div style="border-top: 1px dashed #94a3b8; width: 150px; text-align: center; padding-top: 4px;">মালিকের স্বাক্ষর</div>
            </div>
        </div>
    `;

    printViaIframe(htmlBody, '@page { size: A4 portrait; margin: 12mm 10mm !important; }', safeTitle);
}

export function exportLedgerExcel(ledgerData, accountName, fromDate, toDate, filterType = 'ALL') {
    if (!ledgerData || !ledgerData.transactions) {
        Swal.fire({
            title: 'ডাটা পাওয়া যায়নি',
            text: 'আগে লেজার লোড করুন',
            icon: 'warning',
            customClass: { popup: '!bg-slate-900 !text-white !rounded-3xl border border-slate-700' }
        });
        return;
    }

    const rows = [
        ['#', 'তারিখ', 'বিবরণ / নোট', 'জমা (+ Inflow)', 'খরচ (- Outflow)', 'ব্যালেন্স'],
        ['-', 'প্রারম্ভিক ব্যালেন্স (Opening)', '', '', '', ledgerData.openingBalance]
    ];

    let serial = 0;
    ledgerData.transactions.forEach(t => {
        if (filterType === 'CREDIT' && !t.isCredit) return;
        if (filterType === 'DEBIT' && !t.isDebit) return;
        serial++;
        const formattedDate = formatAppDate(t.dateStr);
        const typeLabel = t.type === 'CUSTOMER_PAYMENT' ? 'কাস্টমার জমা' : (t.type === 'BUSINESS_EXPENSE' ? 'খরচ' : (t.type === 'DEPOSIT' ? 'ক্যাশ জমা' : (t.type === 'WITHDRAWAL' ? 'উত্তোলন' : t.type)));
        rows.push([
            serial,
            formattedDate,
            `${typeLabel} - ${t.note || ''}`,
            t.isCredit ? Number(t.amount || 0) : 0,
            t.isDebit ? Number(t.amount || 0) : 0,
            t.runningBalance
        ]);
    });

    rows.push(['-', 'সর্বশেষ ব্যালেন্স (Closing)', '', '', '', ledgerData.closingBalance]);

    const wb = xlsx.utils.book_new();
    const ws = xlsx.utils.aoa_to_sheet(rows);
    xlsx.utils.book_append_sheet(wb, ws, 'Ledger');
    const safeFileName = `Bank_Ledger_${(accountName || 'Account').replace(/\s+/g, '_')}_${Date.now()}.xlsx`;
    xlsx.writeFile(wb, safeFileName);
}

import Swal from 'sweetalert2';
import * as xlsx from 'xlsx';
import { SettingsDAO } from '../dao.js';
import { formatAmountWithComma, formatAppDate, getDayOfWeekBangla, renderPrintHeader, escapeHTML } from '../utils.js';
import { smartPaginatePrint, printViaIframe } from '../utils/smart-print-engine.js';

export async function printLedger(ledgerData, accountName, fromDate, toDate, filterType = 'ALL') {
    if (!ledgerData || !ledgerData.transactions) {
        Swal.fire({
            title: 'ডাটা পাওয়া যায়নি',
            text: 'অনুগ্রহ করে আগে লেজার লোড হতে দিন।',
            icon: 'warning',
            customClass: { popup: '!bg-slate-900 !text-white !rounded-3xl border border-slate-700' }
        });
        return;
    }

    const settings = (await SettingsDAO.getAppSettings()) || {};
    const cleanAccountName = accountName || 'অ্যাকাউন্ট';
    const displayRange = (fromDate || toDate) ? `${fromDate || 'শুরু'} হতে ${toDate || 'বর্তমান'}` : 'সকল লেনদেন';
    const formattedToday = formatAppDate(new Date());

    const isCreditOnly = (filterType === 'CREDIT');
    const isDebitOnly = (filterType === 'DEBIT');
    const filterTitle = isCreditOnly ? 'জমা বিবরণী (Deposit Statement)' : (isDebitOnly ? 'উত্তোলন ও খরচ বিবরণী' : 'লেজার স্টেটমেন্ট (Account Ledger)');

    const page1HeaderHtml = renderPrintHeader(settings, {
        title: cleanAccountName.toUpperCase(),
        subtitle: `${filterTitle} • ${cleanAccountName}`,
        dateRangeStr: displayRange
    });

    const repeatHeaderHtml = `
        <div style="display:flex; justify-content:space-between; align-items:flex-end; border-bottom:2px solid #0284c7; padding-bottom:4px; margin-bottom:8px;">
            <div style="font-size:13px; font-weight:900; color:#0f172a; font-family:'Inter',sans-serif;">
                ${cleanAccountName.toUpperCase()} <span style="font-size:10px; color:#475569; font-weight:normal;">(Continued)</span>
            </div>
            <div style="font-size:10px; color:#475569; font-family:'Hind Siliguri',sans-serif;">
                ${filterTitle} | সময়কাল: ${escapeHTML(displayRange)}
            </div>
        </div>
    `;

    const tableColHeaderHtml = `
        <thead>
            <tr style="background: #0f172a; border-bottom: 2px solid #0f172a;">
                <th style="text-align: center; border: 1px solid #1e293b; padding: 6px 4px; font-size: 10px; font-weight: 800; font-family: 'Hind Siliguri', sans-serif; width: 35px; color: #ffffff;">#</th>
                <th style="text-align: center; border: 1px solid #1e293b; padding: 6px 4px; font-size: 10px; font-weight: 800; font-family: 'Hind Siliguri', sans-serif; width: 80px; color: #ffffff;">তারিখ</th>
                <th style="text-align: left; border: 1px solid #1e293b; padding: 6px 8px; font-size: 10px; font-weight: 800; font-family: 'Hind Siliguri', sans-serif; color: #ffffff;">লেনদেনের বিবরণ / কাস্টমার</th>
                <th style="text-align: right; border: 1px solid #1e293b; padding: 6px 8px; font-size: 10px; font-weight: 800; font-family: 'Hind Siliguri', sans-serif; width: 100px; color: #34d399;">জমা (+ Inflow)</th>
                <th style="text-align: right; border: 1px solid #1e293b; padding: 6px 8px; font-size: 10px; font-weight: 800; font-family: 'Hind Siliguri', sans-serif; width: 100px; color: #f87171;">খরচ (- Outflow)</th>
                <th style="text-align: right; border: 1px solid #1e293b; padding: 6px 8px; font-size: 10px; font-weight: 800; font-family: 'Hind Siliguri', sans-serif; width: 115px; color: #ffffff;">বর্তমান ব্যালেন্স</th>
            </tr>
        </thead>
    `;

    const rowsArray = [];
    if (!isCreditOnly && !isDebitOnly) {
        const obVal = Number(ledgerData.openingBalance || 0);
        const obColor = obVal < 0 ? '#dc2626' : '#15803d';
        rowsArray.push(`
            <tr class="print-row-no-break" style="background: #f8fafc; border-bottom: 1.5px solid #cbd5e1;">
                <td style="text-align: center; vertical-align: middle; border: 1px solid #cbd5e1; padding: 5px 4px; font-size: 10px; font-family: 'Inter', monospace; color: #64748b;">-</td>
                <td style="text-align: center; vertical-align: middle; border: 1px solid #cbd5e1; padding: 4px 4px; font-size: 9.5px; font-weight: 800; font-family: 'Inter', monospace; color: #475569; white-space: nowrap;">${fromDate || '-'}</td>
                <td style="text-align: left; vertical-align: middle; border: 1px solid #cbd5e1; padding: 5px 8px; font-size: 11px; font-weight: 900; font-family: 'Hind Siliguri', sans-serif; color: #1e293b;">
                    প্রারম্ভিক ব্যালেন্স (Opening Balance)
                </td>
                <td style="text-align: right; vertical-align: middle; border: 1px solid #cbd5e1; padding: 5px 8px; font-size: 10.5px; color: #94a3b8; font-family: 'Inter', monospace;">-</td>
                <td style="text-align: right; vertical-align: middle; border: 1px solid #cbd5e1; padding: 5px 8px; font-size: 10.5px; color: #94a3b8; font-family: 'Inter', monospace;">-</td>
                <td style="text-align: right; vertical-align: middle; border: 1px solid #cbd5e1; padding: 5px 8px; font-size: 11px; font-weight: 900; color: ${obColor}; font-family: 'Inter', monospace; white-space: nowrap;">
                    ৳ ${formatAmountWithComma(obVal)}
                </td>
            </tr>
        `);
    }

    let serial = 0;
    let totalInflow = 0;
    let totalOutflow = 0;

    ledgerData.transactions.forEach(t => {
        if (t.isCredit) totalInflow += Number(t.amount || 0);
        if (t.isDebit) totalOutflow += Number(t.amount || 0);

        if (filterType === 'CREDIT' && !t.isCredit) return;
        if (filterType === 'DEBIT' && !t.isDebit) return;
        serial++;

        const isEven = serial % 2 === 0;
        const bgStyle = isEven ? 'background: #ffffff;' : 'background: #f8fafc;';
        const formattedDate = formatAppDate(t.dateStr);
        const dayBangla = getDayOfWeekBangla(t.dateStr);
        const deposit = t.isCredit ? `৳ ${formatAmountWithComma(t.amount)}` : '-';
        const withdraw = t.isDebit ? `৳ ${formatAmountWithComma(t.amount)}` : '-';
        const balColor = t.runningBalance < 0 ? '#dc2626' : '#0f172a';
        const typeLabel = t.type === 'CUSTOMER_PAYMENT' ? 'কাস্টমার জমা' : (t.type === 'BUSINESS_EXPENSE' ? 'খরচ' : (t.type === 'DEPOSIT' ? 'ক্যাশ জমা' : (t.type === 'WITHDRAWAL' ? 'উত্তোলন' : t.type)));

        rowsArray.push(`
            <tr class="print-row-no-break" style="${bgStyle}">
                <td style="text-align: center; vertical-align: middle; border: 1px solid #cbd5e1; padding: 5px 4px; font-size: 10px; font-family: 'Inter', sans-serif; color: #475569;">${serial}</td>
                <td style="text-align: center; vertical-align: middle; border: 1px solid #cbd5e1; padding: 4px 4px; font-size: 9.5px; font-family: 'Inter', monospace; color: #1e293b; white-space: nowrap;">
                    <div style="font-weight: 700;">${formattedDate}</div>
                    <div style="font-size: 8px; color: #64748b; font-family: 'Hind Siliguri', sans-serif; font-weight: 600; margin-top: 1px;">${dayBangla}</div>
                </td>
                <td style="text-align: left; vertical-align: middle; border: 1px solid #cbd5e1; padding: 5px 8px; font-size: 10.5px; font-family: 'Hind Siliguri', 'Kalpurush', sans-serif;">
                    <div style="font-weight: 800; color: #0f172a;">${typeLabel}</div>
                    <div style="font-size: 10px; color: #475569; margin-top: 1px;">${escapeHTML(t.note || '')}</div>
                </td>
                <td style="text-align: right; vertical-align: middle; border: 1px solid #cbd5e1; padding: 5px 8px; font-size: 10.5px; font-weight: 800; font-family: 'Inter', monospace; color: #16a34a; white-space: nowrap;">${deposit}</td>
                <td style="text-align: right; vertical-align: middle; border: 1px solid #cbd5e1; padding: 5px 8px; font-size: 10.5px; font-weight: 800; font-family: 'Inter', monospace; color: #dc2626; white-space: nowrap;">${withdraw}</td>
                <td style="text-align: right; vertical-align: middle; border: 1px solid #cbd5e1; padding: 5px 8px; font-size: 11px; font-weight: 900; font-family: 'Inter', monospace; color: ${balColor}; white-space: nowrap;">৳ ${formatAmountWithComma(t.runningBalance)}</td>
            </tr>
        `);
    });

    const summaryHtml = `
        <div style="display: flex; justify-content: space-between; align-items: stretch; margin-top: 14px; gap: 14px; page-break-inside: avoid; break-inside: avoid;">
            <div style="flex: 1; background: #f8fafc; border: 1px solid #cbd5e1; border-radius: 10px; padding: 10px 14px; font-family: 'Hind Siliguri', sans-serif; display: flex; flex-direction: column; justify-content: space-between;">
                <div>
                    <div style="font-size: 9.5px; font-weight: 800; color: #64748b; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 3px;">বিবরণীর সারসংক্ষেপ:</div>
                    <div style="font-size: 12px; font-weight: 700; color: #0f172a; line-height: 1.35;">
                        অ্যাকাউন্ট: <strong style="color:#0284c7;">${cleanAccountName}</strong> | সময়কাল: <strong>${escapeHTML(displayRange)}</strong>
                    </div>
                </div>
                <div style="display: flex; gap: 20px; font-size: 10px; color: #475569; border-top: 1px dashed #cbd5e1; padding-top: 6px; margin-top: 8px;">
                    <span>মোট এন্ট্রি সংখ্যা: <strong style="color: #0f172a;">${serial} টি</strong></span>
                    <span>প্রিন্ট সময়: <strong style="color: #0f172a;">${new Date().toLocaleString('en-GB')}</strong></span>
                </div>
            </div>

            <div style="width: 290px; background: #ffffff; border: 1.5px solid #0284c7; border-radius: 10px; padding: 10px 14px; font-family: 'Hind Siliguri', sans-serif; box-shadow: 0 2px 4px rgba(0,0,0,0.04);">
                ${!isCreditOnly && !isDebitOnly ? `
                <div style="display: flex; justify-content: space-between; font-size: 10.5px; margin-bottom: 3px;">
                    <span style="color: #64748b; font-weight: 700;">প্রারম্ভিক ব্যালেন্স:</span>
                    <strong style="color: #b45309; font-weight: 900; font-family: 'Inter', monospace;">৳ ${formatAmountWithComma(ledgerData.openingBalance || 0)}</strong>
                </div>` : ''}
                <div style="display: flex; justify-content: space-between; font-size: 10.5px; margin-bottom: 3px;">
                    <span style="color: #166534; font-weight: 700;">মোট জমা / ইনফ্লো (+):</span>
                    <strong style="color: #15803d; font-weight: 900; font-family: 'Inter', monospace;">৳ ${formatAmountWithComma(totalInflow)}</strong>
                </div>
                ${!isCreditOnly ? `
                <div style="display: flex; justify-content: space-between; font-size: 10.5px; margin-bottom: 4px; border-bottom: 1px dashed #cbd5e1; padding-bottom: 4px;">
                    <span style="color: #991b1b; font-weight: 700;">মোট খরচ / আউটফ্লো (-):</span>
                    <strong style="color: #b91c1c; font-weight: 900; font-family: 'Inter', monospace;">৳ ${formatAmountWithComma(totalOutflow)}</strong>
                </div>` : ''}
                <div style="display: flex; justify-content: space-between; font-size: 11.5px; padding-top: 2px;">
                    <span style="color: #0369a1; font-weight: 900;">সর্বশেষ ব্যালেন্স:</span>
                    <strong style="color: ${ledgerData.closingBalance < 0 ? '#dc2626' : '#047857'}; font-size: 14px; font-weight: 900; font-family: 'Inter', monospace;">৳ ${formatAmountWithComma(ledgerData.closingBalance)}</strong>
                </div>
            </div>
        </div>
    `;

    const signatureHtml = `
        <div class="signature-last-page-block" style="margin-top: 45px; page-break-inside: avoid; break-inside: avoid;">
            <div style="display: flex; justify-content: space-between; padding: 0 30px;">
                <div style="border-top: 1.5px dashed #64748b; width: 160px; text-align: center; font-size: 11px; font-weight: 700; color: #334155; font-family: 'Hind Siliguri', sans-serif; padding-top: 6px;">
                    হিসাবরক্ষক<br><span style="font-size: 9px; font-weight: normal; color: #64748b;">Accountant</span>
                </div>
                <div style="border-top: 1.5px dashed #64748b; width: 160px; text-align: center; font-size: 11px; font-weight: 700; color: #334155; font-family: 'Hind Siliguri', sans-serif; padding-top: 6px;">
                    কর্তৃপক্ষের স্বাক্ষর<br><span style="font-size: 9px; font-weight: normal; color: #64748b;">Authorized Signature</span>
                </div>
            </div>
        </div>
    `;

    const paginatedHtml = await smartPaginatePrint({
        rowsArray,
        page1HeaderHtml,
        repeatHeaderHtml,
        tableColHeaderHtml,
        summaryHtml,
        signatureHtml,
        formattedDate: formattedToday
    });

    const safeTitle = `${cleanAccountName.replace(/[^a-zA-Z0-9\u0980-\u09FF]/g, '_')}_Ledger`;
    printViaIframe(paginatedHtml, '', safeTitle);
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
        ['#', 'তারিখ', 'লেনদেনের ধরন', 'কাস্টমার / বিবরণ', 'জমা (+ Inflow)', 'খরচ (- Outflow)', 'ব্যালেন্স'],
        ['-', 'প্রারম্ভিক ব্যালেন্স (Opening)', '', '', '', '', ledgerData.openingBalance]
    ];

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
        const typeLabel = t.type === 'CUSTOMER_PAYMENT' ? 'কাস্টমার জমা' : (t.type === 'BUSINESS_EXPENSE' ? 'খরচ' : (t.type === 'DEPOSIT' ? 'ক্যাশ জমা' : (t.type === 'WITHDRAWAL' ? 'উত্তোলন' : t.type)));
        rows.push([
            serial,
            formattedDate,
            typeLabel,
            t.note || '',
            t.isCredit ? Number(t.amount || 0) : 0,
            t.isDebit ? Number(t.amount || 0) : 0,
            t.runningBalance
        ]);
    });

    rows.push(['-', 'সর্বশেষ ব্যালেন্স / মোট', '', '', totalInflow, totalOutflow, ledgerData.closingBalance]);

    const wb = xlsx.utils.book_new();
    const ws = xlsx.utils.aoa_to_sheet(rows);
    xlsx.utils.book_append_sheet(wb, ws, 'Ledger');
    const safeFileName = `Bank_Ledger_${(accountName || 'Account').replace(/\s+/g, '_')}_${Date.now()}.xlsx`;
    xlsx.writeFile(wb, safeFileName);
}

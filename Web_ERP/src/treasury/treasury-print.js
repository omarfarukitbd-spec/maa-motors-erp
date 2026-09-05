import { SettingsDAO } from '../dao.js';
import { formatAmountWithComma, formatAppDate, getDayOfWeekBangla, escapeHTML, renderPrintHeader, showToast, numberToBanglaWords } from '../utils.js';
import { smartPaginatePrint, printViaIframe } from '../utils/smart-print-engine.js';

/**
 * Treasury Print & Excel Export Services
 */

/**
 * Exports Treasury Ledger to Excel (.xlsx)
 */
export function exportTreasuryExcel(ledgerData, filterInfo = {}) {
    if (!ledgerData || (!ledgerData.transactions?.length && !ledgerData.kpis?.openingBalance)) {
        return showToast('এক্সপোর্ট করার মতো কোনো ডাটা নেই!', 'warning');
    }
    if (typeof XLSX === 'undefined') {
        return showToast('SheetJS Library লোড হয়নি!', 'error');
    }

    const openingDate = filterInfo.openingDate || ledgerData.openingDate || ledgerData.kpis?.openingDate || '2026-08-31';

    const rows = [
        {
            'SL': '-',
            'Date': formatAppDate(openingDate),
            'Title / Account': '৩১ আগস্ট ২০২৬ সমাপনী স্থিতি (B/F)',
            'Note': 'Opening Fund Balance (Brought Forward)',
            'Inflow (+) BDT': '',
            'Outflow (-) BDT': '',
            'Running Balance (BDT)': ledgerData.kpis?.openingBalance || 0
        }
    ];

    (ledgerData.transactions || []).forEach((t, i) => {
        rows.push({
            'SL': i + 1,
            'Date': formatAppDate(t.date),
            'Title / Account': t.title || '',
            'Note': t.note || '',
            'Inflow (+) BDT': t.isInflow ? t.amount : '',
            'Outflow (-) BDT': !t.isInflow ? t.amount : '',
            'Running Balance (BDT)': t.runningBalance
        });
    });

    const ws = XLSX.utils.json_to_sheet(rows);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Treasury Ledger');
    const fileName = `Maa_Motors_Treasury_Ledger_${new Date().toISOString().slice(0, 10)}.xlsx`;
    XLSX.writeFile(wb, fileName);
    showToast(`এক্সেল ফাইল ডাউনলোড সম্পন্ন: ${fileName}`, 'success');
}

/**
 * Generates and prints A4 Treasury Statement matching the physical ledger
 */
export async function printTreasuryReport(ledgerData, filterInfo = {}) {
    if (!ledgerData) {
        return showToast('প্রিন্ট করার মতো কোনো ডাটা নেই!', 'warning');
    }

    const settings = await SettingsDAO.getAppSettings();
    const periodLabel = filterInfo.label || 'সব লেনদেন';
    const openingDate = filterInfo.openingDate || ledgerData.openingDate || ledgerData.kpis?.openingDate || '2026-08-31';
    const formattedDate = formatAppDate(new Date());

    const page1HeaderHtml = renderPrintHeader(settings, {
        title: 'TREASURY FUND LEDGER',
        subtitle: 'মাস্টার ট্রেজারি ও সেন্ট্রাল ফান্ড বহি (Master Fund Flow)',
        dateRangeStr: periodLabel
    });

    const repeatHeaderHtml = `
        <div style="display:flex; justify-content:space-between; align-items:flex-end; border-bottom:2px solid #0284c7; padding-bottom:4px; margin-bottom:8px;">
            <div style="font-size:13px; font-weight:900; color:#0f172a; font-family:'Inter',sans-serif;">
                TREASURY FUND LEDGER <span style="font-size:10px; color:#475569; font-weight:normal;">(Continued)</span>
            </div>
            <div style="font-size:10px; color:#475569; font-family:'Hind Siliguri',sans-serif;">
                মাস্টার ট্রেজারি ও সেন্ট্রাল ফান্ড বহি | সময়কাল: ${escapeHTML(periodLabel)}
            </div>
        </div>
    `;

    const tableColHeaderHtml = `
        <thead>
            <tr style="background: #0f172a; border-bottom: 2px solid #0f172a;">
                <th style="text-align: center; border: 1px solid #1e293b; padding: 6px 4px; font-size: 10px; font-weight: 800; font-family: 'Hind Siliguri', sans-serif; width: 35px; color: #ffffff;">SL</th>
                <th style="text-align: center; border: 1px solid #1e293b; padding: 6px 4px; font-size: 10px; font-weight: 800; font-family: 'Hind Siliguri', sans-serif; width: 75px; color: #ffffff;">তারিখ</th>
                <th style="text-align: left; border: 1px solid #1e293b; padding: 6px 8px; font-size: 10px; font-weight: 800; font-family: 'Hind Siliguri', sans-serif; color: #ffffff;">বিবরণ / একাউন্ট</th>
                <th style="text-align: left; border: 1px solid #1e293b; padding: 6px 8px; font-size: 10px; font-weight: 800; font-family: 'Hind Siliguri', sans-serif; width: 145px; color: #ffffff;">মন্তব্য / বিবরণ নোট</th>
                <th style="text-align: right; border: 1px solid #1e293b; padding: 6px 8px; font-size: 10px; font-weight: 800; font-family: 'Hind Siliguri', sans-serif; width: 95px; color: #34d399;">ইনফ্লো (+)</th>
                <th style="text-align: right; border: 1px solid #1e293b; padding: 6px 8px; font-size: 10px; font-weight: 800; font-family: 'Hind Siliguri', sans-serif; width: 95px; color: #f87171;">আউটফ্লো (-)</th>
                <th style="text-align: right; border: 1px solid #1e293b; padding: 6px 8px; font-size: 10px; font-weight: 800; font-family: 'Hind Siliguri', sans-serif; width: 115px; color: #ffffff;">রানিং ব্যালেন্স (৳)</th>
            </tr>
        </thead>
    `;

    // Row 1: B/F Opening Fund Row
    const bfRow = `
        <tr class="print-row-no-break" style="background: #fef3c7; border-bottom: 1.5px solid #f59e0b;">
            <td style="text-align: center; vertical-align: middle; border: 1px solid #cbd5e1; padding: 6px 4px; font-size: 10px; font-family: 'Inter', monospace; color: #64748b;">-</td>
            <td style="text-align: center; vertical-align: middle; border: 1px solid #cbd5e1; padding: 4px 4px; font-size: 9.5px; font-weight: 800; font-family: 'Inter', monospace; color: #92400e; white-space: nowrap;"><div style="font-weight: 700;">${formatAppDate(openingDate)}</div><div style="font-size: 8px; color: #b45309; font-family: 'Hind Siliguri', sans-serif; font-weight: 600; margin-top: 1px;">${getDayOfWeekBangla(openingDate)}</div></td>
            <td style="text-align: left; vertical-align: middle; border: 1px solid #cbd5e1; padding: 6px 8px; font-size: 11px; font-weight: 900; font-family: 'Hind Siliguri', sans-serif; color: #92400e;" colspan="2">
                ৩১ আগস্ট ২০২৬ সমাপনী স্থিতি (Brought Forward / B/F)
            </td>
            <td style="text-align: right; vertical-align: middle; border: 1px solid #cbd5e1; padding: 6px 8px; font-size: 10.5px; color: #94a3b8; font-family: 'Inter', monospace;">-</td>
            <td style="text-align: right; vertical-align: middle; border: 1px solid #cbd5e1; padding: 6px 8px; font-size: 10.5px; color: #94a3b8; font-family: 'Inter', monospace;">-</td>
            <td style="text-align: right; vertical-align: middle; border: 1px solid #cbd5e1; padding: 6px 8px; font-size: 11.5px; font-weight: 900; color: #15803d; font-family: 'Inter', monospace; white-space: nowrap;">
                ৳ ${formatAmountWithComma(ledgerData.kpis?.openingBalance || 0)}
            </td>
        </tr>
    `;

    const rowsArray = [bfRow];

    (ledgerData.transactions || []).forEach((t, i) => {
        const isHighlight = t.isMonthEnd;
        const isEven = i % 2 === 0;
        const bgStyle = isHighlight 
            ? 'background: #fef9c3; border-bottom: 1.5px solid #facc15;' 
            : (isEven ? 'background: #ffffff;' : 'background: #f8fafc;');

        rowsArray.push(`
            <tr class="print-row-no-break" style="${bgStyle}">
                <td style="text-align: center; vertical-align: middle; border: 1px solid #cbd5e1; padding: 5px 4px; font-size: 10px; font-family: 'Inter', sans-serif; color: #475569;">${i + 1}</td>
                <td style="text-align: center; vertical-align: middle; border: 1px solid #cbd5e1; padding: 4px 4px; font-size: 9.5px; font-weight: 700; font-family: 'Inter', monospace; color: #1e293b; white-space: nowrap;"><div style="font-weight: 700;">${formatAppDate(t.date)}</div><div style="font-size: 8px; color: #64748b; font-family: 'Hind Siliguri', sans-serif; font-weight: 600; margin-top: 1px;">${getDayOfWeekBangla(t.date)}</div></td>
                <td style="text-align: left; vertical-align: middle; border: 1px solid #cbd5e1; padding: 5px 8px; font-size: 10.5px; font-family: 'Kalpurush', 'Hind Siliguri', sans-serif; color: #0f172a; font-weight: 700;">
                    ${escapeHTML(t.title)}
                    ${isHighlight ? '<span style="font-size: 8px; font-weight: 900; background: #fef08a; color: #854d0e; padding: 1px 5px; border-radius: 4px; margin-left: 6px; border: 1px solid #fde047;">মাস ক্লোজিং</span>' : ''}
                </td>
                <td style="text-align: left; vertical-align: middle; border: 1px solid #cbd5e1; padding: 5px 8px; font-size: 9.5px; font-family: 'Kalpurush', 'Hind Siliguri', sans-serif; color: #475569;">
                    ${escapeHTML(t.note || '-')}
                </td>
                <td style="text-align: right; vertical-align: middle; border: 1px solid #cbd5e1; padding: 5px 8px; font-size: 10.5px; font-weight: 800; font-family: 'Inter', monospace; color: #16a34a; white-space: nowrap;">
                    ${t.isInflow ? '৳ ' + formatAmountWithComma(t.amount) : '-'}
                </td>
                <td style="text-align: right; vertical-align: middle; border: 1px solid #cbd5e1; padding: 5px 8px; font-size: 10.5px; font-weight: 800; font-family: 'Inter', monospace; color: #dc2626; white-space: nowrap;">
                    ${!t.isInflow ? '৳ ' + formatAmountWithComma(t.amount) : '-'}
                </td>
                <td style="text-align: right; vertical-align: middle; border: 1px solid #cbd5e1; padding: 5px 8px; font-size: 11px; font-weight: 900; font-family: 'Inter', monospace; color: #0f172a; white-space: nowrap;">
                    ৳ ${formatAmountWithComma(t.runningBalance)}
                </td>
            </tr>
        `);
    });

    const summaryHtml = `
        <div style="display: flex; justify-content: space-between; align-items: stretch; margin-top: 14px; gap: 14px; page-break-inside: avoid; break-inside: avoid;">
            <div style="flex: 1; background: #f8fafc; border: 1px solid #cbd5e1; border-radius: 10px; padding: 10px 14px; font-family: 'Hind Siliguri', sans-serif; display: flex; flex-direction: column; justify-content: space-between;">
                <div>
                    <div style="font-size: 9.5px; font-weight: 800; color: #64748b; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 3px;">বর্তমান ফান্ড স্থিতি (কথায়):</div>
                    <div style="font-size: 12px; font-weight: 900; color: #047857; line-height: 1.35;">
                        ${numberToBanglaWords(ledgerData.kpis?.currentBalance || 0)}
                    </div>
                </div>
                <div style="display: flex; gap: 20px; font-size: 10px; color: #475569; border-top: 1px dashed #cbd5e1; padding-top: 6px; margin-top: 8px;">
                    <span>বিবরণীর সময়কাল: <strong style="color: #0f172a;">${escapeHTML(periodLabel)}</strong></span>
                    <span>মোট লেনদেন সংখ্যা: <strong style="color: #0f172a;">${(ledgerData.transactions || []).length} টি</strong></span>
                </div>
            </div>

            <div style="width: 290px; background: #ffffff; border: 1.5px solid #0284c7; border-radius: 10px; padding: 10px 14px; font-family: 'Hind Siliguri', sans-serif; box-shadow: 0 2px 4px rgba(0,0,0,0.04);">
                <div style="display: flex; justify-content: space-between; font-size: 10.5px; margin-bottom: 3px;">
                    <span style="color: #64748b; font-weight: 700;">প্রারম্ভিক তহবিল (B/F):</span>
                    <strong style="color: #b45309; font-weight: 900; font-family: 'Inter', monospace;">৳ ${formatAmountWithComma(ledgerData.kpis?.openingBalance || 0)}</strong>
                </div>
                <div style="display: flex; justify-content: space-between; font-size: 10.5px; margin-bottom: 3px;">
                    <span style="color: #166534; font-weight: 700;">মোট বৃদ্ধি / ইনফ্লো (+):</span>
                    <strong style="color: #15803d; font-weight: 900; font-family: 'Inter', monospace;">৳ ${formatAmountWithComma(ledgerData.kpis?.totalInflow || 0)}</strong>
                </div>
                <div style="display: flex; justify-content: space-between; font-size: 10.5px; margin-bottom: 4px; border-bottom: 1px dashed #cbd5e1; padding-bottom: 4px;">
                    <span style="color: #991b1b; font-weight: 700;">মোট ব্যয় / আউটফ্লো (-):</span>
                    <strong style="color: #b91c1c; font-weight: 900; font-family: 'Inter', monospace;">৳ ${formatAmountWithComma(ledgerData.kpis?.totalOutflow || 0)}</strong>
                </div>
                <div style="display: flex; justify-content: space-between; font-size: 11.5px; padding-top: 2px;">
                    <span style="color: #0369a1; font-weight: 900;">বর্তমান নেট ফান্ড স্থিতি:</span>
                    <strong style="color: #047857; font-size: 14px; font-weight: 900; font-family: 'Inter', monospace;">৳ ${formatAmountWithComma(ledgerData.kpis?.currentBalance || 0)}</strong>
                </div>
            </div>
        </div>
    `;

    const signatureHtml = `
        <div class="signature-last-page-block" style="margin-top: 35px; page-break-inside: avoid; break-inside: avoid;">
            <div style="display: flex; justify-content: space-between; padding: 0 40px;">
                <div style="border-top: 1.5px dashed #64748b; width: 160px; text-align: center; font-size: 10px; font-weight: 700; color: #334155; padding-top: 5px; font-family: 'Hind Siliguri', sans-serif;">
                    ক্যাশিয়ার / প্রস্তুতকারী<br><span style="font-size: 8.5px; font-weight: normal; color: #64748b;">Prepared By</span>
                </div>
                <div style="border-top: 1.5px dashed #64748b; width: 160px; text-align: center; font-size: 10px; font-weight: 700; color: #334155; padding-top: 5px; font-family: 'Hind Siliguri', sans-serif;">
                    ব্যবস্থাপনা পরিচালক / মালিক<br><span style="font-size: 8.5px; font-weight: normal; color: #64748b;">Authorized Signature</span>
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
        formattedDate
    });

    printViaIframe(paginatedHtml);
}

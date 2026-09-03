import { SettingsDAO } from '../dao.js';
import { formatAmountWithComma, formatAppDate, escapeHTML, renderPrintHeader, showToast } from '../utils.js';
import { printViaIframe } from '../utils/smart-print-engine.js';

/**
 * ️ Treasury Print & Excel Export Services
 */

/**
 * Exports Treasury Ledger to Excel (.xlsx)
 */
export function exportTreasuryExcel(ledgerData, filterInfo = {}) {
    if (!ledgerData || !ledgerData.transactions.length) {
        return showToast('এক্সপোর্ট করার মতো কোনো ডাটা নেই!', 'warning');
    }
    if (typeof XLSX === 'undefined') {
        return showToast('SheetJS Library লোড হয়নি!', 'error');
    }

    const rows = [
        {
            'SL': '-',
            'Date': formatAppDate(ledgerData.kpis.openingDate || '2026-08-29'),
            'Title / Account': 'প্রারম্ভিক তহবিল স্থিতি (B/F)',
            'Note': 'Opening Fund Balance',
            'Inflow (+) BDT': '',
            'Outflow (-) BDT': '',
            'Running Balance (BDT)': ledgerData.kpis.openingBalance
        }
    ];

    ledgerData.transactions.forEach((t, i) => {
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
    XLSX.utils.book_append_sheet(wb, ws, 'Treasury Fund Ledger');
    const fileName = `Maa_Motors_Treasury_Ledger_${new Date().toISOString().slice(0, 10)}.xlsx`;
    XLSX.writeFile(wb, fileName);
    showToast(`এক্সেল ফাইল ডাউনলোড সম্পন্ন: ${fileName}`, 'success');
}

/**
 * Generates and prints A4 Treasury Statement matching the physical ledger
 */
export async function printTreasuryReport(ledgerData, filterInfo = {}) {
    if (!ledgerData || !ledgerData.transactions.length) {
        return showToast('প্রিন্ট করার মতো কোনো ডাটা নেই!', 'warning');
    }

    const settings = await SettingsDAO.getAppSettings();
    const reportTitle = 'মাস্টার ট্রেজারি ও সেন্ট্রাল ফান্ড বহি';
    const periodSub = filterInfo.label || 'চলতি তহবিল বিবরণী';

    let rowsHtml = `
        <tr style="background-color: #f8fafc; font-weight: bold;">
            <td style="text-align: center; border: 1px solid #cbd5e1; padding: 6px;">-</td>
            <td style="border: 1px solid #cbd5e1; padding: 6px;">${formatAppDate(ledgerData.kpis.openingDate || '2026-08-29')}</td>
            <td style="border: 1px solid #cbd5e1; padding: 6px; font-weight: 900; color: #b45309;" colspan="2">
                প্রারম্ভিক তহবিল স্থিতি (Brought Forward / B/F)
            </td>
            <td style="text-align: right; border: 1px solid #cbd5e1; padding: 6px;">-</td>
            <td style="text-align: right; border: 1px solid #cbd5e1; padding: 6px;">-</td>
            <td style="text-align: right; border: 1px solid #cbd5e1; padding: 6px; font-family: monospace; font-weight: 900; color: #047857;">
                ৳ ${formatAmountWithComma(ledgerData.kpis.openingBalance)}
            </td>
        </tr>
    `;

    ledgerData.transactions.forEach((t, i) => {
        const isHighlight = t.isMonthEnd;
        const bgStyle = isHighlight ? 'background-color: #fef3c7;' : (i % 2 === 1 ? 'background-color: #fdfdfd;' : '');
        rowsHtml += `
            <tr style="${bgStyle}">
                <td style="text-align: center; border: 1px solid #cbd5e1; padding: 6px; font-size: 11px;">${i + 1}</td>
                <td style="border: 1px solid #cbd5e1; padding: 6px; font-size: 11px; white-space: nowrap;">${formatAppDate(t.date)}</td>
                <td style="border: 1px solid #cbd5e1; padding: 6px; font-weight: bold; font-size: 11px;">
                    ${escapeHTML(t.title)}
                </td>
                <td style="border: 1px solid #cbd5e1; padding: 6px; font-size: 10px; color: #475569;">
                    ${escapeHTML(t.note || '-')}
                </td>
                <td style="text-align: right; border: 1px solid #cbd5e1; padding: 6px; font-family: monospace; font-weight: bold; color: #047857; font-size: 11px;">
                    ${t.isInflow ? '৳ ' + formatAmountWithComma(t.amount) : '-'}
                </td>
                <td style="text-align: right; border: 1px solid #cbd5e1; padding: 6px; font-family: monospace; font-weight: bold; color: #b91c1c; font-size: 11px;">
                    ${!t.isInflow ? '৳ ' + formatAmountWithComma(t.amount) : '-'}
                </td>
                <td style="text-align: right; border: 1px solid #cbd5e1; padding: 6px; font-family: monospace; font-weight: 900; font-size: 11.5px; color: #0f172a;">
                    ৳ ${formatAmountWithComma(t.runningBalance)}
                </td>
            </tr>
        `;
    });

    const fullHtml = `
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="utf-8">
            <title>${reportTitle}</title>
            <style>
                @page { size: A4 portrait; margin: 10mm 10mm 15mm 10mm; }
                body { font-family: 'SolaimanLipi', Arial, sans-serif; color: #0f172a; margin: 0; padding: 0; font-size: 12px; }
                table { width: 100%; border-collapse: collapse; margin-top: 10px; }
                th { background-color: #0f172a; color: white; padding: 7px 6px; font-size: 11px; border: 1px solid #0f172a; }
                .kpi-box { display: inline-block; padding: 6px 12px; border: 1px solid #cbd5e1; border-radius: 8px; margin-right: 10px; text-align: center; }
            </style>
        </head>
        <body>
            ${renderPrintHeader(settings, reportTitle, periodSub)}
            
            <div style="margin: 12px 0 10px 0; display: flex; justify-content: space-between;">
                <div>
                    <div class="kpi-box">
                        <div style="font-size: 9px; color: #64748b; font-weight: bold;">মোট ইনফ্লো (+)</div>
                        <div style="font-size: 13px; font-weight: 900; color: #047857; font-family: monospace;">৳ ${formatAmountWithComma(ledgerData.kpis.totalInflow)}</div>
                    </div>
                    <div class="kpi-box">
                        <div style="font-size: 9px; color: #64748b; font-weight: bold;">মোট আউটফ্লো (-)</div>
                        <div style="font-size: 13px; font-weight: 900; color: #b91c1c; font-family: monospace;">৳ ${formatAmountWithComma(ledgerData.kpis.totalOutflow)}</div>
                    </div>
                    <div class="kpi-box" style="background-color: #f8fafc; border-color: #047857;">
                        <div style="font-size: 9px; color: #047857; font-weight: bold;">বর্তমান তহবিল স্থিতি</div>
                        <div style="font-size: 14px; font-weight: 900; color: #047857; font-family: monospace;">৳ ${formatAmountWithComma(ledgerData.kpis.currentBalance)}</div>
                    </div>
                </div>
            </div>

            <table>
                <thead>
                    <tr>
                        <th style="width: 35px;">ক্রম</th>
                        <th style="width: 75px;">তারিখ</th>
                        <th>বিবরণ / একাউন্ট</th>
                        <th style="width: 140px;">মন্তব্য / নোট</th>
                        <th style="width: 90px; text-align: right;">ইনফ্লো (+)</th>
                        <th style="width: 90px; text-align: right;">আউটফ্লো (-)</th>
                        <th style="width: 110px; text-align: right;">রানিং ব্যালেন্স</th>
                    </tr>
                </thead>
                <tbody>
                    ${rowsHtml}
                </tbody>
            </table>

            <div style="margin-top: 40px; display: flex; justify-content: space-between; padding: 0 30px;">
                <div style="text-align: center; border-top: 1px dashed #94a3b8; width: 140px; padding-top: 5px; font-size: 10px; font-weight: bold;">হিসাবরক্ষক</div>
                <div style="text-align: center; border-top: 1px dashed #94a3b8; width: 140px; padding-top: 5px; font-size: 10px; font-weight: bold;">ব্যবস্থাপনা পরিচালক / মালিক</div>
            </div>
        </body>
        </html>
    `;

    printViaIframe(fullHtml);
}

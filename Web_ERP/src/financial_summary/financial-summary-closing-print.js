import { SettingsDAO } from '../dao.js';
import { formatAmountWithComma, formatAppDate, escapeHTML, renderPrintHeader } from '../utils.js';
import { printViaIframe } from '../utils/smart-print-engine.js';
import Swal from 'sweetalert2';

export function exportClosingExcel(closingData) {
    if (!closingData || !closingData.customers.length) {
        return Swal.fire('Error', 'এক্সপোর্ট করার মতো কোনো ডাটা নেই', 'warning');
    }
    if (typeof XLSX === 'undefined') {
        return Swal.fire('Error', 'SheetJS Library missing!', 'error');
    }

    const rows = closingData.customers.map((c, i) => ({
        'SL': i + 1,
        'Account No': c.accountNo || '',
        'Customer Name': c.name || '',
        'Phone Number': c.phone || '',
        'Zone': c.zone || '',
        'Total Bill up to Date (BDT)': c.totalBill,
        'Total Paid up to Date (BDT)': c.totalPaid,
        'Closing Balance (BDT)': c.closingDue
    }));

    const ws = XLSX.utils.json_to_sheet(rows);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Closing Balances');
    const fileName = `Maa_Motors_Closing_Balances_${closingData.cutoffDate}.xlsx`;
    XLSX.writeFile(wb, fileName);
    Swal.fire({ toast: true, position: 'top-end', icon: 'success', title: `ফাইল ডাউনলোড সম্পন্ন (${fileName})`, timer: 2000 });
}

export async function printClosingReport(closingData) {
    if (!closingData || !closingData.customers.length) {
        return Swal.fire('Error', 'প্রিন্ট করার মতো কোনো ডাটা নেই', 'warning');
    }

    const settings = await SettingsDAO.getAppSettings();
    const formattedDate = formatAppDate(closingData.cutoffDate);
    const headerHtml = renderPrintHeader(settings, {
        title: 'CUSTOMER CLOSING BALANCE REPORT',
        subtitle: `${formattedDate} তারিখ পর্যন্ত সকল কাস্টমারের সমাপনী বকেয়া ও খতিয়ান শিট`
    });

    const rowsHtml = closingData.customers.map((c, idx) => {
        const bg = idx % 2 === 0 ? '#ffffff' : '#f8fafc';
        const dueColor = c.closingDue > 0 ? '#dc2626' : (c.closingDue < 0 ? '#059669' : '#64748b');
        return `
            <tr style="background:${bg}; border-bottom:1px solid #e2e8f0;">
                <td style="padding:6px 8px; text-align:center; font-family:monospace; font-size:11px;">${idx + 1}</td>
                <td style="padding:6px 8px; text-align:center; font-family:monospace; font-weight:bold; font-size:11px;">[${escapeHTML(c.accountNo)}]</td>
                <td style="padding:6px 8px; font-weight:bold; font-size:12px;">${escapeHTML(c.name)}</td>
                <td style="padding:6px 8px; font-size:11px; font-family:monospace;">${escapeHTML(c.phone || '-')}</td>
                <td style="padding:6px 8px; font-size:11px;">${escapeHTML(c.zone || '-')}</td>
                <td style="padding:6px 8px; text-align:right; font-family:monospace; font-weight:bold; font-size:11px;">৳ ${formatAmountWithComma(c.totalBill)}</td>
                <td style="padding:6px 8px; text-align:right; font-family:monospace; font-weight:bold; color:#059669; font-size:11px;">৳ ${formatAmountWithComma(c.totalPaid)}</td>
                <td style="padding:6px 8px; text-align:right; font-family:monospace; font-weight:900; color:${dueColor}; font-size:12px;">৳ ${formatAmountWithComma(Math.abs(c.closingDue))}${c.closingDue < 0 ? ' (Adv)' : ''}</td>
            </tr>
        `;
    }).join('');

    const fullHtml = `
        <div style="font-family:'Hind Siliguri',Arial,sans-serif; padding:15px; color:#0f172a;">
            ${headerHtml}
            <div style="display:flex; justify-content:space-between; margin:10px 0; padding:8px 12px; background:#f1f5f9; border-radius:8px; font-size:12px; font-weight:bold;">
                <span>কাট-অফ তারিখ: <strong style="color:#2563eb;">${formattedDate}</strong></span>
                <span>মোট কাস্টমার: <strong>${closingData.totalCustomers} জন</strong></span>
                <span>মোট মার্কেট বকেয়া: <strong style="color:#dc2626; font-size:14px; font-family:monospace;">৳ ${formatAmountWithComma(closingData.totalMarketDue)}</strong></span>
            </div>
            <table style="width:100%; border-collapse:collapse; text-align:left; margin-top:8px;">
                <thead>
                    <tr style="background:#0f172a; color:#ffffff; font-size:11px;">
                        <th style="padding:6px 8px; text-align:center;">#</th>
                        <th style="padding:6px 8px; text-align:center;">A/C নং</th>
                        <th style="padding:6px 8px;">কাস্টমার নাম</th>
                        <th style="padding:6px 8px;">মোবাইল</th>
                        <th style="padding:6px 8px;">জোন</th>
                        <th style="padding:6px 8px; text-align:right;">মোট বিল</th>
                        <th style="padding:6px 8px; text-align:right;">মোট জমা</th>
                        <th style="padding:6px 8px; text-align:right;">সমাপনী বকেয়া</th>
                    </tr>
                </thead>
                <tbody>${rowsHtml}</tbody>
            </table>
        </div>
    `;

    printViaIframe(fullHtml);
}

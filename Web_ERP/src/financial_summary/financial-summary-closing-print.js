import { SettingsDAO } from '../dao.js';
import { formatAmountWithComma, formatAppDate, escapeHTML, renderPrintHeader, safeRound } from '../utils.js';
import { smartPaginatePrint, printViaIframe } from '../utils/smart-print-engine.js';
import Swal from 'sweetalert2';

export function exportClosingExcel(closingData) {
    if (!closingData || !closingData.customers.length) {
        return Swal.fire('Error', 'এক্সপোর্ট করার মতো কোনো ডাটা নেই', 'warning');
    }
    if (typeof XLSX === 'undefined') {
        return Swal.fire('Error', 'SheetJS Library missing!', 'error');
    }

    const sortedCustomers = [...closingData.customers].sort((a, b) => 
        (a.accountNo || '').localeCompare(b.accountNo || '', undefined, { numeric: true })
    );

    const rows = sortedCustomers.map((c, i) => ({
        'SL': i + 1,
        'Account No': c.accountNo || '',
        'Customer Name': c.name || '',
        'Phone Number': c.phone || '',
        'Zone': c.zone || '',
        'Address': c.address || '',
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
    const reportTitle = `${formattedDate} তারিখ পর্যন্ত কাস্টমার সমাপনী বকেয়া খতিয়ান`;

    // Strictly sort all customers by Account No / Serial like the Customer section
    const sortedCustomers = [...closingData.customers].sort((a, b) => 
        (a.accountNo || '').localeCompare(b.accountNo || '', undefined, { numeric: true })
    );

    const page1HeaderHtml = renderPrintHeader(settings, {
        title: 'CUSTOMER CLOSING REPORT',
        subtitle: `${reportTitle}`
    });

    const repeatHeaderHtml = `
        <div style="display:flex; justify-content:space-between; align-items:flex-end; border-bottom:2px solid #0284c7; padding-bottom:4px; margin-bottom:8px;">
            <div style="font-size:14px; font-weight:900; color:#0f172a; font-family:'Inter',sans-serif;">CUSTOMER CLOSING REPORT <span style="font-size:10px; color:#475569; font-weight:normal;">(Continued)</span></div>
            <div style="font-size:10px; color:#475569; font-family:'Hind Siliguri',sans-serif;">${reportTitle}</div>
        </div>
    `;

    let totalDue = 0;
    const rowsArray = sortedCustomers.map((c, idx) => {
        const isEven = idx % 2 === 0;
        const bgStyle = isEven ? 'background: #ffffff;' : 'background: #f8fafc;';
        const dueVal = Number(c.closingDue) || 0;
        if (dueVal > 0) totalDue = safeRound(totalDue + dueVal);
        const dueColor = dueVal > 0 ? '#dc2626' : (dueVal < 0 ? '#059669' : '#64748b');
        const dueDisp = dueVal === 0 ? '৳ 0' : `৳ ${formatAmountWithComma(Math.abs(dueVal))} ${dueVal < 0 ? '(Adv)' : ''}`;
        const zoneBadge = c.zone 
            ? `<span style="background: #f1f5f9; border: 1px solid #cbd5e1; padding: 1px 5px; border-radius: 8px; font-size: 9.5px; font-weight: 700; color: #334155; display: inline-block;">${escapeHTML(c.zone)}</span>`
            : '-';

        const cellsHtml = `
            <td style="text-align:center; vertical-align:middle; border:1px solid #e2e8f0; padding:3.5px 3px; font-size:10px; font-family:'Inter',sans-serif; color:#475569;">${idx + 1}</td>
            <td style="text-align:center; vertical-align:middle; border:1px solid #e2e8f0; padding:3.5px 3px; font-size:10.5px; font-weight:800; font-family:'Inter',monospace; color:#0284c7;">${escapeHTML(c.accountNo || '-')}</td>
            <td style="text-align:left; vertical-align:middle; border:1px solid #e2e8f0; padding:3.5px 5px; font-size:10.5px; font-family:'Hind Siliguri',sans-serif; line-height:1.15; color:#0f172a;"><strong>${escapeHTML(c.name)}</strong></td>
            <td style="text-align:center; vertical-align:middle; border:1px solid #e2e8f0; padding:3.5px 3px; font-size:10px; font-family:'Inter',sans-serif; white-space:nowrap; color:#334155;">${escapeHTML(c.phone || '-')}</td>
            <td style="text-align:center; vertical-align:middle; border:1px solid #e2e8f0; padding:3.5px 3px; font-size:10px; font-family:'Hind Siliguri',sans-serif;">${zoneBadge}</td>
            <td style="text-align:left; vertical-align:middle; border:1px solid #e2e8f0; padding:3.5px 5px; font-size:10px; font-family:'Hind Siliguri',sans-serif; line-height:1.15; color:#475569; max-width:130px; overflow:hidden; text-overflow:ellipsis; white-space:nowrap;">${escapeHTML(c.address || '-')}</td>
            <td style="text-align:right; vertical-align:middle; border:1px solid #e2e8f0; padding:3.5px 5px; font-size:10.5px; font-family:'Inter',sans-serif; font-weight:bold; color:#475569; white-space:nowrap;">৳ ${formatAmountWithComma(c.totalBill || 0)}</td>
            <td style="text-align:right; vertical-align:middle; border:1px solid #e2e8f0; padding:3.5px 5px; font-size:10.5px; font-family:'Inter',sans-serif; font-weight:bold; color:#059669; white-space:nowrap;">৳ ${formatAmountWithComma(c.totalPaid || 0)}</td>
            <td style="text-align:right; vertical-align:middle; border:1px solid #e2e8f0; padding:3.5px 5px; font-size:10.5px; font-weight:900; color:${dueColor}; font-family:'Inter',sans-serif; white-space:nowrap;">${dueDisp}</td>
        `;

        const rowHtml = `<tr class="print-row-no-break" style="${bgStyle}">${cellsHtml}</tr>`;
        return {
            html: rowHtml,
            textLength: (c.name || '').length + (c.address || '').length
        };
    });

    const headerThHtml = `
        <th style="width:32px; text-align:center; border:1px solid #cbd5e1; padding:5px 3px; font-size:10px; font-weight:900; color:#1e293b; font-family:'Hind Siliguri',sans-serif;">SL</th>
        <th style="width:65px; text-align:center; border:1px solid #cbd5e1; padding:5px 3px; font-size:10px; font-weight:900; color:#1e293b; font-family:'Hind Siliguri',sans-serif;">A/C NO</th>
        <th style="text-align:left; border:1px solid #cbd5e1; padding:5px 5px; font-size:10px; font-weight:900; color:#1e293b; font-family:'Hind Siliguri',sans-serif;">কাস্টমারের নাম</th>
        <th style="width:100px; text-align:center; border:1px solid #cbd5e1; padding:5px 3px; font-size:10px; font-weight:900; color:#1e293b; font-family:'Hind Siliguri',sans-serif;">মোবাইল নম্বর</th>
        <th style="width:65px; text-align:center; border:1px solid #cbd5e1; padding:5px 3px; font-size:10px; font-weight:900; color:#1e293b; font-family:'Hind Siliguri',sans-serif;">জোন</th>
        <th style="width:120px; text-align:left; border:1px solid #cbd5e1; padding:5px 5px; font-size:10px; font-weight:900; color:#1e293b; font-family:'Hind Siliguri',sans-serif;">ঠিকানা</th>
        <th style="width:80px; text-align:right; border:1px solid #cbd5e1; padding:5px 5px; font-size:10px; font-weight:900; color:#1e293b; font-family:'Hind Siliguri',sans-serif;">মোট বিল (৳)</th>
        <th style="width:80px; text-align:right; border:1px solid #cbd5e1; padding:5px 5px; font-size:10px; font-weight:900; color:#1e293b; font-family:'Hind Siliguri',sans-serif;">মোট জমা (৳)</th>
        <th style="width:90px; text-align:right; border:1px solid #cbd5e1; padding:5px 5px; font-size:10px; font-weight:900; color:#1e293b; font-family:'Hind Siliguri',sans-serif;">সমাপনী ব্যালেন্স</th>
    `;
    const tableColHeaderHtml = `<thead><tr style="background:#f1f5f9; border-bottom:2px solid #cbd5e1;">${headerThHtml}</tr></thead>`;

    const summaryHtml = `
        <div style="display:flex; justify-content:flex-end; margin-top:8px; page-break-inside:avoid; break-inside:avoid;">
            <div style="width:260px; background:#f8fafc; border:1px solid #cbd5e1; border-radius:8px; padding:8px 10px; font-family:'Hind Siliguri',sans-serif; box-shadow:0 1px 2px rgba(0,0,0,0.05);">
                <div style="display:flex; justify-content:space-between; font-size:11px; margin-bottom:4px; border-bottom:1px dashed #cbd5e1; padding-bottom:3px;">
                    <span style="color:#64748b; font-weight:700;">কাট-অফ তারিখ:</span>
                    <strong style="color:#0284c7; font-weight:900;">${formattedDate}</strong>
                </div>
                <div style="display:flex; justify-content:space-between; font-size:11px; margin-bottom:4px; border-bottom:1px dashed #cbd5e1; padding-bottom:3px;">
                    <span style="color:#64748b; font-weight:700;">সর্বমোট কাস্টমার:</span>
                    <strong style="color:#0f172a; font-weight:900;">${sortedCustomers.length} জন</strong>
                </div>
                <div style="display:flex; justify-content:space-between; font-size:11px;">
                    <span style="color:#64748b; font-weight:700;">মার্কেটে মোট বকেয়া:</span>
                    <strong style="color:#dc2626; font-size:13.5px; font-weight:900;">৳ ${formatAmountWithComma(closingData.totalMarketDue || totalDue)}</strong>
                </div>
            </div>
        </div>
    `;

    const signatureHtml = `
        <div class="signature-last-page-block" style="margin-top:20px; page-break-inside:avoid; break-inside:avoid;">
            <div style="display:flex; justify-content:space-between; padding:0 30px;">
                <div style="border-top:1.5px dashed #64748b; width:150px; text-align:center; font-size:10px; font-weight:700; color:#334155; padding-top:4px; font-family:'Hind Siliguri',sans-serif;">
                    ক্যাশিয়ার / প্রস্তুতকারী<br><span style="font-size:8.5px; font-weight:normal; color:#64748b;">Prepared By</span>
                </div>
                <div style="border-top:1.5px dashed #64748b; width:150px; text-align:center; font-size:10px; font-weight:700; color:#334155; padding-top:4px; font-family:'Hind Siliguri',sans-serif;">
                    কর্তৃপক্ষের স্বাক্ষর<br><span style="font-size:8.5px; font-weight:normal; color:#64748b;">Authorized Signature</span>
                </div>
            </div>
        </div>
    `;

    const paginatedHtml = await smartPaginatePrint({
        rowsArray, page1HeaderHtml, repeatHeaderHtml, tableColHeaderHtml,
        summaryHtml, signatureHtml, formattedDate
    });

    printViaIframe(paginatedHtml);
}

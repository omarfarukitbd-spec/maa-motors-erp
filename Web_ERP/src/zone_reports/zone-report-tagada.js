import { SettingsDAO } from '../dao.js';
import { formatAmountWithComma, escapeHTML, renderPrintHeader, renderRepeatHeader, getTodayLocalDateString, getDayOfWeekBangla, safeRound } from '../utils.js';
import { smartPaginatePrint, printViaIframe } from '../utils/smart-print-engine.js';
import Swal from 'sweetalert2';

/**
 * Print A4 Collection Sheet (তাগাদা ও আদায় শিট) for Field Agents
 */
export async function printZoneTagadaReport(cachedZoneReportData) {
    const { customers } = cachedZoneReportData;
    const zoneName = cachedZoneReportData.selectedZone;

    const filtered = customers.filter(c => {
        const matchesZone = !zoneName || (c.zone || '').trim() === zoneName;
        return matchesZone && (Number(c.totalDue) || 0) > 0; // Only customers with due for tagada
    });

    if (filtered.length === 0) {
        return Swal.fire('তালিকায় কোনো বকেয়া কাস্টমার নেই', 'সিলেক্ট করা জোনে কোনো বকেয়াওয়ালা কাস্টমার পাওয়া যায়নি।', 'warning');
    }

    filtered.sort((a, b) => (Number(b.totalDue) || 0) - (Number(a.totalDue) || 0)); // Highest due first for tagada

    const settings = await SettingsDAO.getAppSettings();
    const reportTitle = zoneName ? `${zoneName} জোনের ফিল্ড তাগাদা ও আদায় রেজিস্টার` : 'সকল জোনের ফিল্ড তাগাদা ও আদায় রেজিস্টার';

    let totalDue = 0;
    filtered.forEach(c => totalDue = safeRound(totalDue + (Number(c.totalDue) || 0)));

    const todayStr = getTodayLocalDateString();
    const [y, m, d] = todayStr.split('-');
    const formattedDate = `${d}/${m}/${y}`;

    const docTitle = zoneName ? `${escapeHTML(zoneName)} তাগাদা শিট` : 'ফিল্ড তাগাদা শিট';
    const dayLabel = `${formattedDate} (${getDayOfWeekBangla(todayStr)})`;
    const page1HeaderHtml = `
        ${renderPrintHeader(settings, {
        title: docTitle,
        pageLabel: 'প্রিন্ট তারিখ',
        pageNo: formattedDate
    })}
        <div style="display:flex; justify-content:space-between; align-items:center; background:#f8fafc; border:1px solid #cbd5e1; border-left:4px solid #0284c7; border-radius:4px; padding:4px 10px; margin-bottom:8px; font-family:'Anek Bangla','Hind Siliguri',sans-serif; font-size:10px; color:#0f172a;">
            <span><strong>তাগাদা বিবরণ:</strong> ${escapeHTML(reportTitle)}</span>
            <span><strong>তারিখ:</strong> ${dayLabel}</span>
        </div>
    `;

    const repeatHeaderHtml = renderRepeatHeader(docTitle, `${escapeHTML(reportTitle)} • ${dayLabel}`);

    const rowsArray = filtered.map((c, idx) => {
        const isEven = idx % 2 === 0;
        const bgStyle = isEven ? 'background: #ffffff;' : 'background: #f8fafc;';
        const dueVal = Number(c.totalDue) || 0;

        return `
            <tr class="print-row-no-break" style="${bgStyle}">
                <td style="text-align:center; vertical-align:middle; border: 1px solid #cbd5e1; padding: 6px 4px; font-size: 11px; font-family: 'Inter', sans-serif;">${idx + 1}</td>
                <td style="text-align:center; vertical-align:middle; border: 1px solid #cbd5e1; padding: 6px 4px; font-size: 11px; font-weight: 800; font-family: 'Inter', monospace; color: #0284c7;">${escapeHTML(c.accountNo || '-')}</td>
                <td style="text-align:left; vertical-align:middle; border: 1px solid #cbd5e1; padding: 6px 6px; font-size: 11px; font-family: 'Kalpurush', 'Hind Siliguri', sans-serif; line-height: 1.25; color: #0f172a;">
                    <strong>${escapeHTML(c.name)}</strong><br>
                    <span style="font-size:10px; color:#475569;">${escapeHTML(c.phone || '-')}</span>
                </td>
                <td style="text-align:left; vertical-align:middle; border: 1px solid #cbd5e1; padding: 6px 6px; font-size: 10.5px; font-family: 'Kalpurush', 'Hind Siliguri', sans-serif; line-height: 1.25; color: #334155;">${escapeHTML(c.address || '-')}</td>
                <td style="text-align:right; vertical-align:middle; border: 1px solid #cbd5e1; padding: 6px 6px; font-size: 11px; font-weight: 900; color: #dc2626; font-family: 'Inter', sans-serif; white-space: nowrap;">৳ ${formatAmountWithComma(dueVal)}</td>
                <td style="border: 1px solid #cbd5e1; padding: 6px; width: 110px;"></td>
                <td style="border: 1px solid #cbd5e1; padding: 6px; width: 90px;"></td>
            </tr>
        `;
    });

    const tableColHeaderHtml = `
        <thead>
            <tr style="background: #f1f5f9; border-bottom: 2px solid #cbd5e1;">
                <th style="text-align: center; border: 1px solid #cbd5e1; padding: 7px 4px; font-size: 10.5px; font-weight: 900; color: #1e293b; font-family: 'Hind Siliguri', sans-serif;">SL</th>
                <th style="text-align: center; border: 1px solid #cbd5e1; padding: 7px 4px; font-size: 10.5px; font-weight: 900; color: #1e293b; font-family: 'Hind Siliguri', sans-serif;">A/C</th>
                <th style="text-align: left; border: 1px solid #cbd5e1; padding: 7px 6px; font-size: 10.5px; font-weight: 900; color: #1e293b; font-family: 'Hind Siliguri', sans-serif;">কাস্টমার ও মোবাইল</th>
                <th style="text-align: left; border: 1px solid #cbd5e1; padding: 7px 6px; font-size: 10.5px; font-weight: 900; color: #1e293b; font-family: 'Hind Siliguri', sans-serif;">ঠিকানা</th>
                <th style="text-align: right; border: 1px solid #cbd5e1; padding: 7px 6px; font-size: 10.5px; font-weight: 900; color: #1e293b; font-family: 'Hind Siliguri', sans-serif;">বকেয়া (৳)</th>
                <th style="text-align: center; border: 1px solid #cbd5e1; padding: 7px 4px; font-size: 10.5px; font-weight: 900; color: #1e293b; font-family: 'Hind Siliguri', sans-serif;">আদায়কৃত টাকা (৳)</th>
                <th style="text-align: center; border: 1px solid #cbd5e1; padding: 7px 4px; font-size: 10.5px; font-weight: 900; color: #1e293b; font-family: 'Hind Siliguri', sans-serif;">স্বাক্ষর/তারিখ</th>
            </tr>
        </thead>
    `;

    const summaryHtml = `
        <div style="display: flex; justify-content: flex-end; margin-top: 16px; page-break-inside: avoid; break-inside: avoid;">
            <div style="width: 280px; background: #f8fafc; border: 1px solid #cbd5e1; border-radius: 10px; padding: 12px; font-family: 'Hind Siliguri', sans-serif; box-shadow: 0 1px 3px rgba(0,0,0,0.05);">
                <div style="display: flex; justify-content: space-between; font-size: 12px; margin-bottom: 6px; border-bottom: 1px dashed #cbd5e1; padding-bottom: 4px;">
                    <span style="color: #64748b; font-weight: 700;">মোট বকেয়া কাস্টমার:</span>
                    <strong style="color: #0f172a; font-weight: 900;">${filtered.length} জন</strong>
                </div>
                <div style="display: flex; justify-content: space-between; font-size: 12px;">
                    <span style="color: #64748b; font-weight: 700;">মোট ফিল্ড বকেয়া:</span>
                    <strong style="color: #dc2626; font-size: 15px; font-weight: 900;">৳ ${formatAmountWithComma(totalDue)}</strong>
                </div>
            </div>
        </div>
    `;

    const signatureHtml = `
        <div class="signature-last-page-block" style="margin-top: 48px; page-break-inside: avoid; break-inside: avoid; font-family: 'Anek Bangla', 'Hind Siliguri', sans-serif;">
            <div style="display: flex; justify-content: space-between; padding: 0 30px;">
                <div style="border-top: 1.2px dashed #64748b; width: 165px; text-align: center; font-size: 11px; font-weight: 700; color: #1e293b; padding-top: 6px;">
                    সংগ্রহকারীর স্বাক্ষর<br><span style="font-size: 9px; font-weight: normal; color: #64748b;">Collector Signature</span>
                </div>
                <div style="border-top: 1.2px dashed #64748b; width: 165px; text-align: center; font-size: 11px; font-weight: 700; color: #1e293b; padding-top: 6px;">
                    কর্তৃপক্ষের স্বাক্ষর<br><span style="font-size: 9px; font-weight: normal; color: #64748b;">Authorized Signature</span>
                </div>
            </div>
        </div>
    `;

    // Smart DOM-measured pagination — no blank pages, auto column widths
    const paginatedHtml = await smartPaginatePrint({
        rowsArray, page1HeaderHtml, repeatHeaderHtml, tableColHeaderHtml,
        summaryHtml, signatureHtml, formattedDate
    });

    // iframe print — @page margin:0 removes Chrome URL/date header+footer
    printViaIframe(paginatedHtml);
}

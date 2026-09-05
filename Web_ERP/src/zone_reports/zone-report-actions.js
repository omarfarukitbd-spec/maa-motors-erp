import { ZoneDAO, CustomerDAO, SettingsDAO } from '../dao.js';
import { formatAmountWithComma, escapeHTML, renderPrintHeader, getTodayLocalDateString, safeRound } from '../utils.js';
import { smartPaginatePrint, printViaIframe } from '../utils/smart-print-engine.js';
import Swal from 'sweetalert2';

let cachedZoneReportData = {
    zones: [],
    customers: [],
    selectedZone: '', // '' means All Zones
    selectedStatus: 'all', // 'all', 'due', 'zero', 'advance'
    selectedSort: 'due_desc' // 'due_desc', 'acc_asc', 'name_asc'
};

export function getZoneReportState() {
    return cachedZoneReportData;
}

export function setSelectedZoneState(zoneName) {
    cachedZoneReportData.selectedZone = zoneName;
}

export function setSelectedStatusState(status) {
    cachedZoneReportData.selectedStatus = status;
}

export function setSelectedSortState(sort) {
    cachedZoneReportData.selectedSort = sort;
}

/**
 * Fetch all zones and customer data from Firestore / Cache
 */
export async function loadZoneReportData() {
    try {
        const [zones, customers] = await Promise.all([
            ZoneDAO.getAllZones(),
            CustomerDAO.getAll('name', 'asc')
        ]);

        cachedZoneReportData.zones = zones || [];
        cachedZoneReportData.customers = customers || [];
        return cachedZoneReportData;
    } catch (e) {
        console.error("Error loading zone report data:", e);
        return cachedZoneReportData;
    }
}

/**
 * Print A4 Multi-Page PDF Report for Selected Zone
 */
export async function printZonePDFReport(targetZoneName = '') {
    const { customers } = cachedZoneReportData;
    const zoneName = targetZoneName || cachedZoneReportData.selectedZone;

    const filtered = customers.filter(c => {
        if (!zoneName) return true;
        return (c.zone || '').trim() === zoneName;
    });

    if (filtered.length === 0) {
        return Swal.fire('তালিকায় কোনো কাস্টমার নেই', 'সিলেক্ট করা জোনে কোনো কাস্টমার পাওয়া যায়নি।', 'warning');
    }

    filtered.sort((a, b) => (a.accountNo || '').localeCompare(b.accountNo || '', undefined, { numeric: true }));

    const settings = await SettingsDAO.getAppSettings();
    const reportTitle = zoneName ? `${zoneName} জোনের কাস্টমার বকেয়া খতিয়ান` : 'সকল জোনের কাস্টমার বকেয়া খতিয়ান';
    
    let totalDue = 0;
    filtered.forEach(c => totalDue = safeRound(totalDue + (Number(c.totalDue) || 0)));

    const todayStr = getTodayLocalDateString();
    const [y, m, d] = todayStr.split('-');
    const formattedDate = `${d}/${m}/${y}`;

    const page1HeaderHtml = renderPrintHeader(settings, { 
        title: zoneName ? `${zoneName} ZONE REPORT` : 'ZONE REPORT', 
        subtitle: `${reportTitle} • ${formattedDate}` 
    });

    const repeatHeaderHtml = `
        <div style="display:flex; justify-content:space-between; align-items:flex-end; border-bottom:2px solid #0284c7; padding-bottom:4px; margin-bottom:8px;">
            <div style="font-size:14px; font-weight:900; color:#0f172a; font-family:'Inter',sans-serif;">ZONE REPORT <span style="font-size:10px; color:#475569; font-weight:normal;">(Continued)</span></div>
            <div style="font-size:10px; color:#475569; font-family:'Hind Siliguri',sans-serif;">${reportTitle} • ${formattedDate}</div>
        </div>
    `;

    const rowsArray = filtered.map((c, idx) => {
        const isEven = idx % 2 === 0;
        const bgStyle = isEven ? 'background: #ffffff;' : 'background: #f8fafc;';
        const dueVal = Number(c.totalDue) || 0;
        const dueColor = dueVal > 0 ? '#dc2626' : (dueVal < 0 ? '#059669' : '#64748b');
        const dueDisp = dueVal === 0 ? '৳ 0' : `৳ ${formatAmountWithComma(Math.abs(dueVal))} ${dueVal < 0 ? '(Adv)' : ''}`;
        const zoneBadge = c.zone 
            ? `<span style="background: #f1f5f9; border: 1px solid #cbd5e1; padding: 2px 7px; border-radius: 10px; font-size: 10px; font-weight: 700; color: #334155; display: inline-block;">${escapeHTML(c.zone)}</span>`
            : '-';

        const phoneList = (c.phone || '-').split(/[,/]/).map(p => p.trim()).filter(Boolean);
        const phoneDisp = phoneList.length ? phoneList.map(p => escapeHTML(p)).join('<br>') : '-';

        const rowHtml = `
            <tr class="print-row-no-break" style="${bgStyle}">
                <td style="text-align:center; vertical-align:middle; border: 1px solid #e2e8f0; padding: 4px 3px; font-size: 10px; font-family: 'Inter', sans-serif; color: #475569;">${idx + 1}</td>
                <td style="text-align:center; vertical-align:middle; border: 1px solid #e2e8f0; padding: 4px 3px; font-size: 10.5px; font-weight: 800; font-family: 'Inter', monospace; color: #0284c7;">${escapeHTML(c.accountNo || '-')}</td>
                <td style="text-align:left; vertical-align:middle; border: 1px solid #e2e8f0; padding: 4px 5px; font-size: 10.5px; font-family: 'Hind Siliguri', 'Kalpurush', sans-serif; line-height: 1.25; color: #0f172a;"><strong>${escapeHTML(c.name)}</strong></td>
                <td style="text-align:left; vertical-align:middle; border: 1px solid #e2e8f0; padding: 4px 5px; font-size: 10px; font-family: 'Hind Siliguri', 'Kalpurush', sans-serif; line-height: 1.25; color: #334155;">${escapeHTML(c.address || '-')}</td>
                <td style="text-align:center; vertical-align:middle; border: 1px solid #e2e8f0; padding: 4px 3px; font-size: 9.5px; font-family: 'Inter', monospace; line-height: 1.25; color: #334155;">${phoneDisp}</td>
                <td style="text-align:center; vertical-align:middle; border: 1px solid #e2e8f0; padding: 4px 3px; font-size: 10px; font-family: 'Hind Siliguri', 'Kalpurush', sans-serif;">${zoneBadge}</td>
                <td style="text-align:right; vertical-align:middle; border: 1px solid #e2e8f0; padding: 4px 5px; font-size: 10.5px; font-weight: 900; color: ${dueColor}; font-family: 'Inter', sans-serif; white-space: nowrap;">${dueDisp}</td>
            </tr>
        `;

        return { html: rowHtml, textLength: (c.address || '').length };
    });

    const tableColHeaderHtml = `
        <colgroup>
            <col style="width: 4%;">
            <col style="width: 8%;">
            <col style="width: 23%;">
            <col style="width: 27%;">
            <col style="width: 14%;">
            <col style="width: 10%;">
            <col style="width: 14%;">
        </colgroup>
        <thead>
            <tr style="background: #f1f5f9; border-bottom: 2px solid #cbd5e1;">
                <th style="text-align: center; border: 1px solid #cbd5e1; padding: 6px 3px; font-size: 10px; font-weight: 900; color: #1e293b; font-family: 'Hind Siliguri', sans-serif;">SL</th>
                <th style="text-align: center; border: 1px solid #cbd5e1; padding: 6px 3px; font-size: 10px; font-weight: 900; color: #1e293b; font-family: 'Hind Siliguri', sans-serif;">A/C NO</th>
                <th style="text-align: left; border: 1px solid #cbd5e1; padding: 6px 5px; font-size: 10px; font-weight: 900; color: #1e293b; font-family: 'Hind Siliguri', sans-serif;">কাস্টমারের নাম</th>
                <th style="text-align: left; border: 1px solid #cbd5e1; padding: 6px 5px; font-size: 10px; font-weight: 900; color: #1e293b; font-family: 'Hind Siliguri', sans-serif;">ঠিকানা</th>
                <th style="text-align: center; border: 1px solid #cbd5e1; padding: 6px 3px; font-size: 10px; font-weight: 900; color: #1e293b; font-family: 'Hind Siliguri', sans-serif;">মোবাইল নম্বর</th>
                <th style="text-align: center; border: 1px solid #cbd5e1; padding: 6px 3px; font-size: 10px; font-weight: 900; color: #1e293b; font-family: 'Hind Siliguri', sans-serif;">জোন</th>
                <th style="text-align: right; border: 1px solid #cbd5e1; padding: 6px 5px; font-size: 10px; font-weight: 900; color: #1e293b; font-family: 'Hind Siliguri', sans-serif;">ব্যালেন্স (৳)</th>
            </tr>
        </thead>
    `;

    const summaryHtml = `
        <div style="display: flex; justify-content: flex-end; margin-top: 16px; page-break-inside: avoid; break-inside: avoid;">
            <div style="min-width: 240px; background: #f8fafc; border: 1px solid #cbd5e1; border-radius: 10px; padding: 12px; font-family: 'Hind Siliguri', sans-serif; box-shadow: 0 1px 3px rgba(0,0,0,0.05);">
                <div style="display: flex; justify-content: space-between; font-size: 12px; margin-bottom: 6px; border-bottom: 1px dashed #cbd5e1; padding-bottom: 4px;">
                    <span style="color: #64748b; font-weight: 700;">মোট কাস্টমার:</span>
                    <strong style="color: #0f172a; font-weight: 900;">${filtered.length} জন</strong>
                </div>
                <div style="display: flex; justify-content: space-between; font-size: 12px;">
                    <span style="color: #64748b; font-weight: 700;">মার্কেটে মোট বকেয়া:</span>
                    <strong style="color: #dc2626; font-size: 15px; font-weight: 900;">৳ ${formatAmountWithComma(totalDue)}</strong>
                </div>
            </div>
        </div>
    `;

    const signatureHtml = `
        <div class="signature-last-page-block" style="margin-top: 45px; page-break-inside: avoid; break-inside: avoid;">
            <div style="display: flex; justify-content: space-between; padding: 0 30px;">
                <div style="border-top: 1.5px dashed #64748b; width: 160px; text-align: center; font-size: 11px; font-weight: 700; color: #334155; padding-top: 6px;">
                    কাস্টমারের স্বাক্ষর<br><span style="font-size: 9px; font-weight: normal; color: #64748b;">Customer Signature</span>
                </div>
                <div style="border-top: 1.5px dashed #64748b; width: 160px; text-align: center; font-size: 11px; font-weight: 700; color: #334155; padding-top: 6px;">
                    কর্তৃপক্ষের স্বাক্ষর<br><span style="font-size: 9px; font-weight: normal; color: #64748b;">Authorized Signature</span>
                </div>
            </div>
        </div>
    `;

    // Smart DOM-measured pagination — no blank pages, auto column width
    const paginatedHtml = await smartPaginatePrint({
        rowsArray,
        page1HeaderHtml,
        repeatHeaderHtml,
        tableColHeaderHtml,
        summaryHtml,
        signatureHtml,
        formattedDate
    });

    // iframe print — @page margin:0 removes Chrome URL/date header+footer
    printViaIframe(paginatedHtml);
}

/**

 * Export Zone Customer List to Excel File
 */
export async function exportZoneExcelReport(targetZoneName = '') {
    const { customers } = cachedZoneReportData;
    const zoneName = targetZoneName || cachedZoneReportData.selectedZone;

    const filtered = customers.filter(c => {
        if (!zoneName) return true;
        return (c.zone || '').trim() === zoneName;
    });

    if (filtered.length === 0) {
        return Swal.fire('এরর', 'এক্সপোর্ট করার মতো কোনো কাস্টমার নেই।', 'warning');
    }

    if (typeof XLSX === 'undefined') {
        return Swal.fire('Error', 'SheetJS Library missing!', 'error');
    }

    filtered.sort((a, b) => (a.accountNo || '').localeCompare(b.accountNo || '', undefined, { numeric: true }));

    const excelData = filtered.map((c, i) => ({
        'SL': i + 1,
        'Account No': c.accountNo || '',
        'Customer Name': c.name || '',
        'Phone Number': c.phone || '',
        'Zone': c.zone || '',
        'Address': c.address || '',
        'Due Balance (BDT)': c.totalDue || 0
    }));

    const ws = XLSX.utils.json_to_sheet(excelData);
    const wb = XLSX.utils.book_new();
    const sheetName = zoneName ? `${zoneName} Zone` : 'All Zones';
    XLSX.utils.book_append_sheet(wb, ws, sheetName);

    const fileName = zoneName ? `MAA_ERP_Zone_${zoneName}_${getTodayLocalDateString()}.xlsx` : `MAA_ERP_All_Zones_${getTodayLocalDateString()}.xlsx`;
    XLSX.writeFile(wb, fileName);

    Swal.fire({
        title: '<i class="fa-solid fa-file-excel text-emerald-400 mr-2"></i>ডাউনলোড সফল!',
        text: `কাস্টমার জোন রিপোর্ট ফাইল (${fileName}) ডাউনলোড করা হয়েছে।`,
        icon: 'success',
        customClass: { popup: '!bg-slate-900 !text-white !rounded-3xl border border-slate-700 font-bn' }
    });
}

export async function printZoneTagadaReport(targetZoneName = '') {
    const { printZoneTagadaReport: tagadaFn } = await import('./zone-report-tagada.js');
    if (targetZoneName) {
        return tagadaFn({ ...cachedZoneReportData, selectedZone: targetZoneName });
    }
    return tagadaFn(cachedZoneReportData);
}

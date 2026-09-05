import { SettingsDAO, ZoneDAO } from '../dao.js';
import { formatAmountWithComma, promptSecurityPin, getTodayLocalDateString, escapeHTML, renderPrintHeader, formatAppDate } from '../utils.js';
import { smartPaginatePrint, printViaIframe } from '../utils/smart-print-engine.js';
import Swal from 'sweetalert2';
import { cachedCustomers } from './customer-state.js';

export async function printFilteredCustomerList() {
    if (window.AppState?.currentUserRole === 'Staff' && window.AppState?.permissions?.printCustList === false) {
        return Swal.fire('অ্যাক্সেস ডিনাইড!', 'আপনার কাস্টমার লিস্ট প্রিন্ট করার অনুমতি নেই।', 'error');
    }

    const isPinValid = await promptSecurityPin("কাস্টমার লিস্ট প্রিন্ট (Full Report)");
    if (!isPinValid) return;

    // Interactive Column Selection Popup with 9 Customizable Fields
    const { value: selectedCols } = await Swal.fire({
        title: '<div class="flex items-center gap-2 text-sky-400 font-bold text-lg"><i class="fa-solid fa-sliders"></i> প্রিন্ট কলাম কাস্টমাইজেশন</div>',
        html: `
            <div class="text-left font-bn text-sm text-slate-300 space-y-3 py-2">
                <p class="text-xs text-slate-400 border-b border-slate-700 pb-2">প্রিন্ট রিপোর্টে যে যে কলামগুলো দেখাতে চান সিলেক্ট করুন:</p>
                <div class="grid grid-cols-2 gap-2 text-xs font-semibold">
                    <label class="flex items-center gap-2 p-2 rounded-xl bg-slate-800/80 border border-slate-700/80 cursor-pointer hover:border-sky-500 transition-all">
                        <input type="checkbox" id="col-sl" checked class="w-4 h-4 text-sky-500 rounded focus:ring-sky-400"> SL (ক্রমিক নং)
                    </label>
                    <label class="flex items-center gap-2 p-2 rounded-xl bg-slate-800/80 border border-slate-700/80 cursor-pointer hover:border-sky-500 transition-all">
                        <input type="checkbox" id="col-date" checked class="w-4 h-4 text-sky-500 rounded focus:ring-sky-400"> খোলার তারিখ (Date)
                    </label>
                    <label class="flex items-center gap-2 p-2 rounded-xl bg-slate-800/80 border border-slate-700/80 cursor-pointer hover:border-sky-500 transition-all">
                        <input type="checkbox" id="col-acc" checked class="w-4 h-4 text-sky-500 rounded focus:ring-sky-400"> A/C NO (হিসাব নং)
                    </label>
                    <label class="flex items-center gap-2 p-2 rounded-xl bg-slate-800/80 border border-slate-700/80 cursor-pointer hover:border-sky-500 transition-all">
                        <input type="checkbox" id="col-code" checked class="w-4 h-4 text-sky-500 rounded focus:ring-sky-400"> জোন কোড (Code)
                    </label>
                    <label class="flex items-center gap-2 p-2 rounded-xl bg-slate-800/80 border border-slate-700/80 cursor-pointer hover:border-sky-500 transition-all">
                        <input type="checkbox" id="col-name" checked class="w-4 h-4 text-sky-500 rounded focus:ring-sky-400"> কাস্টমারের নাম
                    </label>
                    <label class="flex items-center gap-2 p-2 rounded-xl bg-slate-800/80 border border-slate-700/80 cursor-pointer hover:border-sky-500 transition-all">
                        <input type="checkbox" id="col-addr" checked class="w-4 h-4 text-sky-500 rounded focus:ring-sky-400"> ঠিকানা
                    </label>
                    <label class="flex items-center gap-2 p-2 rounded-xl bg-slate-800/80 border border-slate-700/80 cursor-pointer hover:border-sky-500 transition-all">
                        <input type="checkbox" id="col-phone" checked class="w-4 h-4 text-sky-500 rounded focus:ring-sky-400"> মোবাইল নম্বর
                    </label>
                    <label class="flex items-center gap-2 p-2 rounded-xl bg-slate-800/80 border border-slate-700/80 cursor-pointer hover:border-sky-500 transition-all">
                        <input type="checkbox" id="col-zone" checked class="w-4 h-4 text-sky-500 rounded focus:ring-sky-400"> জোন / অঞ্চল
                    </label>
                    <label class="flex items-center gap-2 p-2 rounded-xl bg-slate-800/80 border border-slate-700/80 cursor-pointer hover:border-sky-500 transition-all col-span-2">
                        <input type="checkbox" id="col-bal" checked class="w-4 h-4 text-sky-500 rounded focus:ring-sky-400"> অবশিষ্ট ব্যালেন্স (৳)
                    </label>
                </div>
            </div>
        `,
        focusConfirm: false,
        showCancelButton: true,
        confirmButtonText: '<i class="fa-solid fa-print mr-1.5"></i> রিপোর্ট প্রিন্ট করুন',
        cancelButtonText: 'বাতিল',
        customClass: {
            popup: '!bg-slate-900 !text-white !rounded-2xl border border-slate-700',
            confirmButton: '!bg-sky-600 hover:!bg-sky-500 !text-white !font-bold !px-5 !py-2.5 !rounded-xl',
            cancelButton: '!bg-slate-800 hover:!bg-slate-700 !text-slate-300 !font-bold !px-5 !py-2.5 !rounded-xl'
        },
        preConfirm: () => {
            const cols = {
                sl: document.getElementById('col-sl').checked,
                date: document.getElementById('col-date').checked,
                acc: document.getElementById('col-acc').checked,
                code: document.getElementById('col-code').checked,
                name: document.getElementById('col-name').checked,
                addr: document.getElementById('col-addr').checked,
                phone: document.getElementById('col-phone').checked,
                zone: document.getElementById('col-zone').checked,
                bal: document.getElementById('col-bal').checked
            };
            if (!Object.values(cols).some(Boolean)) {
                Swal.showValidationMessage('কমপক্ষে ১টি কলাম সিলেক্ট করতেই হবে!');
                return false;
            }
            return cols;
        }
    });

    if (!selectedCols) return; // User cancelled

    const query = document.getElementById('cust-search-input')?.value.trim();
    const zone = document.getElementById('cust-filter-zone')?.value;

    const filtered = cachedCustomers.filter(c => {
        const matchesSearch = !query || c.name.toLowerCase().includes(query.toLowerCase()) || (c.accountNo && c.accountNo.includes(query));
        const matchesZone = !zone || c.zone === zone;
        return matchesSearch && matchesZone;
    });

    if (filtered.length === 0) return Swal.fire('Error', 'লিস্টে কোনো ডাটা নেই!', 'warning');

    filtered.sort((a, b) => (a.accountNo || '').localeCompare(b.accountNo || '', undefined, { numeric: true }));

    const settings = await SettingsDAO.getAppSettings();
    const zones = await ZoneDAO.getAllZones();
    const zoneMap = {};
    if (zones && zones.length) {
        zones.forEach(z => zoneMap[(z.name || '').trim()] = (z.code || '').trim());
    }

    const reportTitle = zone ? `${zone} জোনের কাস্টমার লিস্ট` : 'সকল কাস্টমার লিস্ট';
    let totalDue = 0;
    filtered.forEach(c => totalDue += (Number(c.totalDue) || 0));

    const todayStr = getTodayLocalDateString();
    const [y, m, d] = todayStr.split('-');
    const formattedDate = `${d}/${m}/${y}`;
    const page1HeaderHtml = renderPrintHeader(settings, { title: 'CUSTOMER REPORT', subtitle: `${reportTitle} • ${formattedDate}` });
    
    const repeatHeaderHtml = `
        <div style="display:flex; justify-content:space-between; align-items:flex-end; border-bottom:2px solid #0284c7; padding-bottom:4px; margin-bottom:8px;">
            <div style="font-size:14px; font-weight:900; color:#0f172a; font-family:'Inter',sans-serif;">CUSTOMER REPORT <span style="font-size:10px; color:#475569; font-weight:normal;">(Continued)</span></div>
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

        // Format creation/opening date and time
        let openDateDisp = '-', openTimeDisp = '';
        if (c.createdAt) {
            try {
                const dateObj = c.createdAt.toDate ? c.createdAt.toDate() : (c.createdAt.toMillis ? new Date(c.createdAt.toMillis()) : new Date(c.createdAt));
                if (!isNaN(dateObj.getTime())) {
                    openDateDisp = dateObj.toLocaleDateString('en-GB');
                    openTimeDisp = dateObj.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
                }
            } catch (e) {
                console.error('Error parsing customer creation date:', e);
            }
        }
        if (openDateDisp === '-' && (c.openingDate || c.date)) {
            openDateDisp = formatAppDate(c.openingDate || c.date);
        }

        // Zone code lookup
        const custZone = (c.zone || '').trim();
        const zCode = zoneMap[custZone] ? zoneMap[custZone] : '-';

        let cellsHtml = '';
        if (selectedCols.sl) cellsHtml += `<td style="text-align:center; vertical-align:middle; border: 1px solid #e2e8f0; padding: 5px 4px; font-size: 11px; font-family: 'Inter', sans-serif; color: #475569;">${idx + 1}</td>`;
        if (selectedCols.date) cellsHtml += `<td style="text-align:center; vertical-align:middle; border: 1px solid #e2e8f0; padding: 4px 2px; font-size: 10px; font-family: 'Inter', sans-serif; color: #334155; line-height: 1.15; white-space: nowrap;"><div style="font-weight: 700;">${openDateDisp}</div>${openTimeDisp ? `<div style="font-size: 8px; color: #64748b; font-weight: 500; margin-top: 1px;">${openTimeDisp}</div>` : ''}</td>`;
        if (selectedCols.acc) cellsHtml += `<td style="text-align:center; vertical-align:middle; border: 1px solid #e2e8f0; padding: 5px 4px; font-size: 11px; font-weight: 800; font-family: 'Inter', monospace; color: #0284c7;">${escapeHTML(c.accountNo || '-')}</td>`;
        if (selectedCols.code) cellsHtml += `<td style="text-align:center; vertical-align:middle; border: 1px solid #e2e8f0; padding: 5px 4px; font-size: 10.5px; font-weight: 700; font-family: 'Inter', monospace; color: #475569;">${escapeHTML(zCode)}</td>`;
        if (selectedCols.name) cellsHtml += `<td style="text-align:left; vertical-align:middle; border: 1px solid #e2e8f0; padding: 5px 6px; font-size: 11px; font-family: 'Kalpurush', 'Hind Siliguri', sans-serif; line-height: 1.25; color: #0f172a;"><strong>${escapeHTML(c.name)}</strong></td>`;
        if (selectedCols.addr) cellsHtml += `<td style="text-align:left; vertical-align:middle; border: 1px solid #e2e8f0; padding: 5px 6px; font-size: 10.5px; font-family: 'Kalpurush', 'Hind Siliguri', sans-serif; line-height: 1.25; color: #334155;">${escapeHTML(c.address || '-')}</td>`;
        if (selectedCols.phone) cellsHtml += `<td style="text-align:center; vertical-align:middle; border: 1px solid #e2e8f0; padding: 5px 4px; font-size: 11px; font-family: 'Inter', sans-serif; white-space: nowrap; color: #334155;">${escapeHTML(c.phone || '-')}</td>`;
        if (selectedCols.zone) cellsHtml += `<td style="text-align:center; vertical-align:middle; border: 1px solid #e2e8f0; padding: 5px 4px; font-size: 11px; font-family: 'Kalpurush', 'Hind Siliguri', sans-serif;">${zoneBadge}</td>`;
        if (selectedCols.bal) cellsHtml += `<td style="text-align:right; vertical-align:middle; border: 1px solid #e2e8f0; padding: 5px 6px; font-size: 11px; font-weight: 900; color: ${dueColor}; font-family: 'Inter', sans-serif; white-space: nowrap;">${dueDisp}</td>`;

        const rowHtml = `<tr class="print-row-no-break" style="${bgStyle}">${cellsHtml}</tr>`;

        return {
            html: rowHtml,
            textLength: selectedCols.addr ? (c.address || '').length : 10
        };
    });

    let headerThHtml = '';
    if (selectedCols.sl) headerThHtml += `<th style="width: 32px; text-align: center; border: 1px solid #cbd5e1; padding: 7px 4px; font-size: 11px; font-weight: 900; color: #1e293b; font-family: 'Hind Siliguri', sans-serif;">SL</th>`;
    if (selectedCols.date) headerThHtml += `<th style="width: 70px; text-align: center; border: 1px solid #cbd5e1; padding: 7px 4px; font-size: 11px; font-weight: 900; color: #1e293b; font-family: 'Hind Siliguri', sans-serif;">তারিখ</th>`;
    if (selectedCols.acc) headerThHtml += `<th style="width: 65px; text-align: center; border: 1px solid #cbd5e1; padding: 7px 4px; font-size: 11px; font-weight: 900; color: #1e293b; font-family: 'Hind Siliguri', sans-serif;">A/C NO</th>`;
    if (selectedCols.code) headerThHtml += `<th style="width: 50px; text-align: center; border: 1px solid #cbd5e1; padding: 7px 4px; font-size: 11px; font-weight: 900; color: #1e293b; font-family: 'Hind Siliguri', sans-serif;">কোড</th>`;
    if (selectedCols.name) headerThHtml += `<th style="text-align: left; border: 1px solid #cbd5e1; padding: 7px 6px; font-size: 11px; font-weight: 900; color: #1e293b; font-family: 'Hind Siliguri', sans-serif;">কাস্টমারের নাম</th>`;
    if (selectedCols.addr) headerThHtml += `<th style="text-align: left; border: 1px solid #cbd5e1; padding: 7px 6px; font-size: 11px; font-weight: 900; color: #1e293b; font-family: 'Hind Siliguri', sans-serif;">ঠিকানা</th>`;
    if (selectedCols.phone) headerThHtml += `<th style="width: 100px; text-align: center; border: 1px solid #cbd5e1; padding: 7px 4px; font-size: 11px; font-weight: 900; color: #1e293b; font-family: 'Hind Siliguri', sans-serif;">মোবাইল নম্বর</th>`;
    if (selectedCols.zone) headerThHtml += `<th style="width: 65px; text-align: center; border: 1px solid #cbd5e1; padding: 7px 4px; font-size: 11px; font-weight: 900; color: #1e293b; font-family: 'Hind Siliguri', sans-serif;">জোন</th>`;
    if (selectedCols.bal) headerThHtml += `<th style="width: 85px; text-align: right; border: 1px solid #cbd5e1; padding: 7px 6px; font-size: 11px; font-weight: 900; color: #1e293b; font-family: 'Hind Siliguri', sans-serif;">ব্যালেন্স (৳)</th>`;

    const tableColHeaderHtml = `<thead><tr style="background: #f1f5f9; border-bottom: 2px solid #cbd5e1;">${headerThHtml}</tr></thead>`;

    const summaryHtml = `
        <div style="display: flex; justify-content: flex-end; margin-top: 16px; page-break-inside: avoid; break-inside: avoid;">
            <div style="width: 260px; background: #f8fafc; border: 1px solid #cbd5e1; border-radius: 10px; padding: 12px; font-family: 'Hind Siliguri', sans-serif; box-shadow: 0 1px 3px rgba(0,0,0,0.05);">
                <div style="display: flex; justify-content: space-between; font-size: 12px; margin-bottom: 6px; border-bottom: 1px dashed #cbd5e1; padding-bottom: 4px;">
                    <span style="color: #64748b; font-weight: 700;">মোট কাস্টমার:</span>
                    <strong style="color: #0f172a; font-weight: 900;">${filtered.length} জন</strong>
                </div>
                <div style="display: flex; justify-content: space-between; font-size: 12px;">
                    <span style="color: #64748b; font-weight: 700;">মার্কেটে মোট বকেয়া:</span>
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

    // Smart DOM-measured pagination — no blank pages, auto column widths
    const paginatedHtml = await smartPaginatePrint({
        rowsArray, page1HeaderHtml, repeatHeaderHtml, tableColHeaderHtml,
        summaryHtml, signatureHtml, formattedDate
    });

    // iframe print — @page margin:0 removes Chrome URL/date header+footer
    printViaIframe(paginatedHtml);
}

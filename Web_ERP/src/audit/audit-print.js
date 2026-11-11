/**
 * Audit Log Printable Report Engine
 * Generates an official printable PDF summary report for audit logs.
 */

import { SettingsDAO } from '../dao.js';
import { renderSharedPrintHeader, renderSharedRepeatHeader } from '../shared/print/print-header.js';
import { smartPaginatePrint, printViaIframe } from '../utils/smart-print-engine.js';
import { escapeHTML } from '../utils.js';

export async function printAuditLogReport(logs, filterSummary = 'সকল অডিট রেকর্ড') {
    if (!logs || logs.length === 0) {
        if (window.Swal) window.Swal.fire('ফাঁকা রিপোর্ট', 'প্রিন্ট করার জন্য কোনো অডিট রেকর্ড পাওয়া যায়নি', 'warning');
        return;
    }

    try {
        const settings = (await SettingsDAO.getAppSettings()) || {};
        const todayStr = new Date().toLocaleDateString('en-GB');

        const rowsArray = logs.map((log, index) => {
            const ts = log.timestamp ? log.timestamp.toDate() : new Date(log.clientTimestamp || Date.now());
            const formattedTime = ts.toLocaleDateString('en-GB') + ' ' + ts.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

            let changeText = log.entityName || '-';
            if (log.changes) {
                changeText += ` (Old: ${JSON.stringify(log.changes.old)} => New: ${JSON.stringify(log.changes.new)})`;
            } else if (log.details && Object.keys(log.details).length > 0) {
                changeText += ` (${JSON.stringify(log.details)})`;
            }

            return `
                <tr style="border-bottom: 1px solid #cbd5e1; font-size: 10.5px;">
                    <td style="padding: 6px; text-align: center; border-right: 1px solid #e2e8f0;">${index + 1}</td>
                    <td style="padding: 6px; border-right: 1px solid #e2e8f0;">${escapeHTML(formattedTime)}</td>
                    <td style="padding: 6px; font-weight: bold; border-right: 1px solid #e2e8f0;">${escapeHTML(log.action || '-')}</td>
                    <td style="padding: 6px; border-right: 1px solid #e2e8f0;">${escapeHTML(log.module || '-')}</td>
                    <td style="padding: 6px; font-weight: bold; border-right: 1px solid #e2e8f0;">${escapeHTML(log.userEmail || 'System')}</td>
                    <td style="padding: 6px; word-break: break-word;">${escapeHTML(changeText)}</td>
                </tr>
            `;
        });

        const headerHtml = renderSharedPrintHeader(settings, {
            title: 'নিরাপত্তা ও অডিট লগ রিপোর্ট',
            pageLabel: 'প্রিন্ট তারিখ',
            pageNo: todayStr
        });
        const repeatHeaderHtml = renderSharedRepeatHeader(
            'নিরাপত্তা ও অডিট লগ রিপোর্ট',
            `ফিল্টার: ${filterSummary} | ${logs.length} টি এন্ট্রি`
        );
        const page1ExtraHtml = `
            <div style="display: flex; justify-content: space-between; font-size: 11px; font-weight: 700; margin-bottom: 10px; background: #f8fafc; padding: 7px 12px; border-radius: 6px; border: 1px solid #cbd5e1; border-left: 4px solid #0284c7;">
                <span>ফিল্টার টাইপ: ${escapeHTML(filterSummary)}</span>
                <span>মোট এন্ট্রি: ${logs.length} টি</span>
                <span>রিপোর্ট প্রিন্ট তারিখ: ${escapeHTML(todayStr)}</span>
            </div>
        `;
        const tableColHeaderHtml = `
            <thead>
                <tr>
                    <th style="width: 6%; text-align: center; background: #0f172a; color: #ffffff; padding: 7px; font-size: 10.5px;">SL</th>
                    <th style="width: 17%; background: #0f172a; color: #ffffff; padding: 7px; text-align: left; font-size: 10.5px;">তারিখ ও সময়</th>
                    <th style="width: 12%; background: #0f172a; color: #ffffff; padding: 7px; text-align: left; font-size: 10.5px;">অ্যাকশন</th>
                    <th style="width: 12%; background: #0f172a; color: #ffffff; padding: 7px; text-align: left; font-size: 10.5px;">মডিউল</th>
                    <th style="width: 23%; background: #0f172a; color: #ffffff; padding: 7px; text-align: left; font-size: 10.5px;">স্টাফ ইমেইল</th>
                    <th style="width: 30%; background: #0f172a; color: #ffffff; padding: 7px; text-align: left; font-size: 10.5px;">বিবরণ ও পরিবর্তন</th>
                </tr>
            </thead>
        `;
        const signatureHtml = `
            <div class="print-sig-block" style="display: flex; justify-content: space-between; margin-top: 32px; padding: 6px 30px 0 30px; page-break-inside: avoid; break-inside: avoid;">
                <div style="border-top: 1.2px dashed #64748b; width: 170px; text-align: center; padding-top: 6px; font-size: 11px; font-weight: 700; color: #1e293b;">প্রিন্ট ইউজার: Admin</div>
                <div style="border-top: 1.2px dashed #64748b; width: 185px; text-align: center; padding-top: 6px; font-size: 11px; font-weight: 700; color: #1e293b;">প্রোপ্রাইটর / অ্যাডমিন স্বাক্ষর</div>
            </div>
        `;

        const unifiedFontCss = `
            * {
                font-family: 'Anek Bangla', 'Hind Siliguri', 'Inter', sans-serif !important;
                box-sizing: border-box;
            }
            @page { size: A4 portrait; margin: 0 !important; }
            body { margin: 0 !important; padding: 0 !important; }
        `;

        const paginatedHtml = await smartPaginatePrint({
            rowsArray,
            page1HeaderHtml: headerHtml,
            repeatHeaderHtml,
            page1ExtraHtml,
            tableColHeaderHtml,
            signatureHtml,
            formattedDate: todayStr,
            extraCss: unifiedFontCss,
            tableClass: 'audit-table',
            tableStyle: 'width: 100%; border-collapse: collapse; margin-bottom: 10px; border: 1px solid #cbd5e1;',
            sheetPadding: '8mm 12mm'
        });

        await printViaIframe(paginatedHtml, unifiedFontCss, `নিরাপত্তা_অডিট_লগ_${todayStr.replace(/\//g, '-')}`);
    } catch (err) {
        console.error("Print audit report error:", err);
        if (window.Swal) window.Swal.fire('এরর', 'অডিট রিপোর্ট প্রিন্ট করতে সমস্যা হয়েছে', 'error');
    }
}

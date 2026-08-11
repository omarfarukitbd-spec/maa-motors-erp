/**
 * Audit Log Printable Report Engine
 * Generates an official printable PDF summary report for audit logs.
 */

import { SettingsDAO } from '../dao.js';

export async function printAuditLogReport(logs, filterSummary = 'সকল অডিট রেকর্ড') {
    if (!logs || logs.length === 0) {
        if (window.Swal) window.Swal.fire('ফাঁকা রিপোর্ট', 'প্রিন্ট করার জন্য কোনো অডিট রেকর্ড পাওয়া যায়নি', 'warning');
        return;
    }

    try {
        const settings = await SettingsDAO.getAppSettings();
        const shopName = settings.shopName || "M/S. Maa Motors";
        const shopAddress = settings.shopAddress || "Shop No. 22, Rahman Tower, 1st Rail Gate, Muradpur, Hathazari Road";
        const shopPhone = settings.shopPhone || "01819-397669, 01815-707934";

        const todayStr = new Date().toLocaleDateString('en-GB');

        const rowsHtml = logs.map((log, index) => {
            const ts = log.timestamp ? log.timestamp.toDate() : new Date(log.clientTimestamp || Date.now());
            const formattedTime = ts.toLocaleDateString('en-GB') + ' ' + ts.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

            let changeText = log.entityName || '-';
            if (log.changes) {
                changeText += ` (Old: ${JSON.stringify(log.changes.old)} => New: ${JSON.stringify(log.changes.new)})`;
            } else if (log.details && Object.keys(log.details).length > 0) {
                changeText += ` (${JSON.stringify(log.details)})`;
            }

            return `
                <tr style="border-bottom: 1px solid #cbd5e1; font-size: 11px;">
                    <td style="padding: 6px; text-align: center; border-right: 1px solid #e2e8f0;">${index + 1}</td>
                    <td style="padding: 6px; border-right: 1px solid #e2e8f0;">${formattedTime}</td>
                    <td style="padding: 6px; font-weight: bold; border-right: 1px solid #e2e8f0;">${log.action || '-'}</td>
                    <td style="padding: 6px; border-right: 1px solid #e2e8f0;">${log.module || '-'}</td>
                    <td style="padding: 6px; font-weight: bold; border-right: 1px solid #e2e8f0;">${log.userEmail || 'System'}</td>
                    <td style="padding: 6px;">${changeText}</td>
                </tr>
            `;
        }).join('');

        const printHtml = `
            <!DOCTYPE html>
            <html>
            <head>
                <title>Audit Log Report - ${shopName}</title>
                <style>
                    body { font-family: 'Hind Siliguri', 'Kalpurush', sans-serif; padding: 20px; color: #0f172a; }
                    .header { text-align: center; border-bottom: 2px solid #0f172a; padding-bottom: 10px; margin-bottom: 15px; }
                    .header h1 { margin: 0; font-size: 24px; text-transform: uppercase; }
                    .header p { margin: 2px 0; font-size: 12px; }
                    .info-bar { display: flex; justify-content: space-between; font-size: 12px; font-weight: bold; margin-bottom: 15px; background: #f8fafc; padding: 8px 12px; border-radius: 8px; border: 1px solid #e2e8f0; }
                    table { width: 100%; border-collapse: collapse; margin-bottom: 30px; }
                    th { background: #0f172a; color: white; padding: 8px; text-align: left; font-size: 11px; }
                    .footer { display: flex; justify-content: space-between; margin-top: 40px; font-size: 12px; font-weight: bold; }
                </style>
            </head>
            <body>
                <div class="header">
                    <h1>${shopName}</h1>
                    <p>${shopAddress}</p>
                    <p>মোবাইল: ${shopPhone}</p>
                    <h3 style="margin-top: 8px; font-size: 16px;">সিস্টেম অডিট ও সিকিউরিটি রিপোর্ট</h3>
                </div>
                <div class="info-bar">
                    <span>ফিল্টার টাইপ: ${filterSummary}</span>
                    <span>মোট এন্ট্রি: ${logs.length} টি</span>
                    <span>রিপোর্ট প্রিন্ট তারিখ: ${todayStr}</span>
                </div>
                <table>
                    <thead>
                        <tr>
                            <th style="width: 5%; text-align: center;">SL</th>
                            <th style="width: 18%;">তারিখ ও সময়</th>
                            <th style="width: 12%;">অ্যাকশন</th>
                            <th style="width: 12%;">মডিউল</th>
                            <th style="width: 23%;">স্টাফ ইমেইল</th>
                            <th style="width: 30%;">বিবরণ ও পরিবর্তন</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${rowsHtml}
                    </tbody>
                </table>
                <div class="footer">
                    <div>প্রিন্ট ইউজার: Admin</div>
                    <div style="border-top: 1px solid #0f172a; width: 180px; text-align: center; padding-top: 4px;">প্রোপ্রাইটর / এডমিন স্বাক্ষর</div>
                </div>
            </body>
            </html>
        `;

        const printWindow = window.open('', '_blank');
        if (printWindow) {
            printWindow.document.write(printHtml);
            printWindow.document.close();
            printWindow.focus();
            setTimeout(() => { printWindow.print(); }, 500);
        }
    } catch (err) {
        console.error("Print audit report error:", err);
        if (window.Swal) window.Swal.fire('এরর', 'অডিট রিপোর্ট প্রিন্ট করতে সমস্যা হয়েছে', 'error');
    }
}

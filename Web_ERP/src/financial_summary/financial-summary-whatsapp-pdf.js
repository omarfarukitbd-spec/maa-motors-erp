import { SettingsDAO } from '../dao.js';
import { formatAmountWithComma, escapeHTML, renderPrintHeader, formatAppDate, showToast } from '../utils.js';
import { smartPaginatePrint, printViaIframe } from '../utils/smart-print-engine.js';
import { numberToBanglaWords } from '../utils/currency-words.js';
import { generateAutoTablePDF } from '../utils/pdf/pdf-engine.js';
import Swal from 'sweetalert2';

/**
 * 1. Print Customer Deposits & Bank Balances Register (A4 Paginated)
 */
export async function printClosingDepositPdfReport(summaryData) {
    const { customerCollections, totalCollection, cashCollection, bankCollection, startDate, endDate, bankBalances, totalLiquidFund } = summaryData;

    if (!customerCollections || customerCollections.length === 0) {
        return Swal.fire({
            title: 'কোনো জমার ডাটা নেই',
            text: 'নির্বাচিত সময়ে কোনো কাস্টমার জমার রেকর্ড পাওয়া যায়নি।',
            icon: 'warning',
            customClass: { popup: '!bg-slate-900 !text-white !rounded-3xl border border-slate-700 font-bn' }
        });
    }

    const settings = await SettingsDAO.getAppSettings();
    const isSingleDay = startDate === endDate;
    const dateTitle = isSingleDay ? `তারিখ: ${formatAppDate(startDate)}` : `সময়কাল: ${formatAppDate(startDate)} থেকে ${formatAppDate(endDate)}`;

    // Bank Balances Matrix HTML
    let bankBoxesHtml = '';
    if (bankBalances && bankBalances.length > 0) {
        bankBoxesHtml = `
            <div style="margin-bottom: 12px; background: #f8fafc; border: 1.5px solid #cbd5e1; border-radius: 8px; padding: 8px 12px; font-family: 'Hind Siliguri', sans-serif;">
                <div style="font-size: 11px; font-weight: 900; color: #0284c7; margin-bottom: 6px; border-bottom: 1px solid #e2e8f0; padding-bottom: 3px;">
                    কোন ব্যাংকে কত টাকা আছে ও বর্তমান স্থিতি (Live Balances):
                </div>
                <div style="display: flex; flex-wrap: wrap; gap: 12px; font-size: 10px; color: #334155;">
                    <span>ক্যাশ ইন হ্যান্ড: <strong style="color:#0f172a; font-weight:900;">৳ ${formatAmountWithComma(cashCollection)}</strong></span>
                    ${bankBalances.map(b => `<span>• ${escapeHTML(b.name)}: <strong style="color:#0284c7; font-weight:900;">৳ ${formatAmountWithComma(b.balance)}</strong></span>`).join('')}
                    ${totalLiquidFund ? `<span style="margin-left: auto; color:#15803d; font-weight:900; font-size: 11px;">মোট ফান্ড স্থিতি: ৳ ${formatAmountWithComma(totalLiquidFund)}</span>` : ''}
                </div>
            </div>
        `;
    }

    const page1HeaderHtml = `
        ${renderPrintHeader(settings, {
            title: 'DAILY CUSTOMER DEPOSIT & BANK CLOSING REGISTER',
            subtitle: `দৈনিক কাস্টমার জমা ও ব্যাংক ব্যালেন্স অডিট শিট • ${dateTitle}`
        })}
        ${bankBoxesHtml}
    `;

    const repeatHeaderHtml = `
        <div style="display:flex; justify-content:space-between; align-items:flex-end; border-bottom:2px solid #0284c7; padding-bottom:4px; margin-bottom:8px;">
            <div style="font-size:13px; font-weight:900; color:#0f172a; font-family:'Inter',sans-serif;">DEPOSIT & BANK CLOSING REGISTER <span style="font-size:10px; color:#475569; font-weight:normal;">(Continued)</span></div>
            <div style="font-size:10px; color:#475569; font-family:'Hind Siliguri',sans-serif;">${dateTitle}</div>
        </div>
    `;

    const rowsArray = customerCollections.map((c, idx) => {
        const isEven = idx % 2 === 0;
        const bgStyle = isEven ? 'background: #ffffff;' : 'background: #f8fafc;';
        const methodDisplay = c.receivedType === 'Cash' ? 'ক্যাশ' : (c.receivedFrom || c.receivedType || 'ব্যাংক');
        const dueVal = Number(c.currentDue || 0);

        return `
            <tr class="print-row-no-break" style="${bgStyle}">
                <td style="text-align:center; vertical-align:middle; border: 1px solid #cbd5e1; padding: 5px 4px; font-size: 10px; font-family: 'Inter', sans-serif;">${idx + 1}</td>
                <td style="text-align:center; vertical-align:middle; border: 1px solid #cbd5e1; padding: 5px 4px; font-size: 10px; font-family: 'Inter', sans-serif; white-space: nowrap;">${formatAppDate(c.date || startDate)}</td>
                <td style="text-align:center; vertical-align:middle; border: 1px solid #cbd5e1; padding: 5px 4px; font-size: 10.5px; font-weight: 800; font-family: 'Inter', monospace; color: #0284c7;">${escapeHTML(c.customerAccountNo || '-')}</td>
                <td style="text-align:left; vertical-align:middle; border: 1px solid #cbd5e1; padding: 5px 6px; font-size: 10.5px; font-family: 'Kalpurush', 'Hind Siliguri', sans-serif; line-height: 1.25; color: #0f172a;">
                    <strong>${escapeHTML(c.customerName)}</strong><br>
                    <span style="font-size:9.5px; color:#475569;">${escapeHTML(c.customerPhone || '-')}</span>
                </td>
                <td style="text-align:left; vertical-align:middle; border: 1px solid #cbd5e1; padding: 5px 6px; font-size: 10px; font-family: 'Kalpurush', 'Hind Siliguri', sans-serif; line-height: 1.2; color: #334155;">${escapeHTML(c.customerZone || '-')}</td>
                <td style="text-align:center; vertical-align:middle; border: 1px solid #cbd5e1; padding: 5px 4px; font-size: 10px; font-family: 'Inter', monospace; color: #475569;">${escapeHTML(c.voucherNo || '-')}</td>
                <td style="text-align:center; vertical-align:middle; border: 1px solid #cbd5e1; padding: 5px 4px; font-size: 10px; font-family: 'Hind Siliguri', sans-serif; font-weight: 600; color: #1e293b;">${escapeHTML(methodDisplay)}</td>
                <td style="text-align:right; vertical-align:middle; border: 1px solid #cbd5e1; padding: 5px 6px; font-size: 11px; font-weight: 900; color: #16a34a; font-family: 'Inter', sans-serif; white-space: nowrap;">৳ ${formatAmountWithComma(c.amount)}</td>
                <td style="text-align:right; vertical-align:middle; border: 1px solid #cbd5e1; padding: 5px 6px; font-size: 10.5px; font-weight: 800; color: ${dueVal > 0 ? '#dc2626' : '#16a34a'}; font-family: 'Inter', sans-serif; white-space: nowrap;">৳ ${formatAmountWithComma(Math.abs(dueVal))} ${dueVal < 0 ? '(Adv)' : ''}</td>
            </tr>
        `;
    });

    const tableColHeaderHtml = `
        <thead>
            <tr style="background: #f1f5f9; border-bottom: 2px solid #cbd5e1;">
                <th style="text-align: center; border: 1px solid #cbd5e1; padding: 6px 4px; font-size: 10px; font-weight: 900; color: #1e293b; width: 30px;">SL</th>
                <th style="text-align: center; border: 1px solid #cbd5e1; padding: 6px 4px; font-size: 10px; font-weight: 900; color: #1e293b; width: 65px;">তারিখ</th>
                <th style="text-align: center; border: 1px solid #cbd5e1; padding: 6px 4px; font-size: 10px; font-weight: 900; color: #1e293b; width: 50px;">A/C</th>
                <th style="text-align: left; border: 1px solid #cbd5e1; padding: 6px 6px; font-size: 10px; font-weight: 900; color: #1e293b;">কাস্টমার ও মোবাইল</th>
                <th style="text-align: left; border: 1px solid #cbd5e1; padding: 6px 6px; font-size: 10px; font-weight: 900; color: #1e293b; width: 80px;">জোন</th>
                <th style="text-align: center; border: 1px solid #cbd5e1; padding: 6px 4px; font-size: 10px; font-weight: 900; color: #1e293b; width: 60px;">ভাউচার</th>
                <th style="text-align: center; border: 1px solid #cbd5e1; padding: 6px 4px; font-size: 10px; font-weight: 900; color: #1e293b; width: 75px;">পদ্ধতি / ব্যাংক</th>
                <th style="text-align: right; border: 1px solid #cbd5e1; padding: 6px 6px; font-size: 10px; font-weight: 900; color: #1e293b; width: 85px;">জমা (৳)</th>
                <th style="text-align: right; border: 1px solid #cbd5e1; padding: 6px 6px; font-size: 10px; font-weight: 900; color: #1e293b; width: 85px;">অবশিষ্ট বকেয়া (৳)</th>
            </tr>
        </thead>
    `;

    const summaryHtml = `
        <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-top: 14px; page-break-inside: avoid; break-inside: avoid;">
            <div style="width: 55%; background: #f8fafc; border: 1px solid #cbd5e1; border-radius: 8px; padding: 8px 12px; font-family: 'Hind Siliguri', sans-serif;">
                <div style="font-size: 11px; font-weight: 700; color: #334155; margin-bottom: 3px;">
                    কথায়: <span style="font-weight: 900; color: #15803d;">${numberToBanglaWords(totalCollection)}</span>
                </div>
                <div style="display: flex; gap: 15px; font-size: 10.5px; color: #64748b; margin-top: 4px;">
                    <span>ক্যাশ জমা: <strong style="color: #0f172a;">৳ ${formatAmountWithComma(cashCollection)}</strong></span>
                    <span>ব্যাংক জমা: <strong style="color: #0284c7;">৳ ${formatAmountWithComma(bankCollection)}</strong></span>
                </div>
            </div>

            <div style="width: 38%; background: #f0fdf4; border: 1.5px solid #86efac; border-radius: 8px; padding: 8px 12px; font-family: 'Hind Siliguri', sans-serif;">
                <div style="display: flex; justify-content: space-between; font-size: 11px; margin-bottom: 4px;">
                    <span style="color: #166534; font-weight: 700;">মোট কাস্টমার জমা:</span>
                    <strong style="color: #0f172a; font-weight: 900;">${customerCollections.length} জন</strong>
                </div>
                <div style="display: flex; justify-content: space-between; font-size: 12px; border-top: 1px dashed #86efac; padding-top: 4px;">
                    <span style="color: #166534; font-weight: 900;">সর্বমোট জমা:</span>
                    <strong style="color: #15803d; font-size: 14px; font-weight: 900;">৳ ${formatAmountWithComma(totalCollection)}</strong>
                </div>
            </div>
        </div>
    `;

    const signatureHtml = `
        <div class="signature-last-page-block" style="margin-top: 35px; page-break-inside: avoid; break-inside: avoid;">
            <div style="display: flex; justify-content: space-between; padding: 0 20px;">
                <div style="border-top: 1.5px dashed #64748b; width: 130px; text-align: center; font-size: 10px; font-weight: 700; color: #334155; padding-top: 4px; font-family: 'Hind Siliguri', sans-serif;">
                    ক্যাশিয়ারের স্বাক্ষর
                </div>
                <div style="border-top: 1.5px dashed #64748b; width: 130px; text-align: center; font-size: 10px; font-weight: 700; color: #334155; padding-top: 4px; font-family: 'Hind Siliguri', sans-serif;">
                    ম্যানেজারের স্বাক্ষর
                </div>
                <div style="border-top: 1.5px dashed #64748b; width: 130px; text-align: center; font-size: 10px; font-weight: 700; color: #334155; padding-top: 4px; font-family: 'Hind Siliguri', sans-serif;">
                    প্রোপ্রাইটরের স্বাক্ষর
                </div>
            </div>
        </div>
    `;

    const pagesHtml = await smartPaginatePrint({
        page1HeaderHtml,
        repeatHeaderHtml,
        tableColHeaderHtml,
        rowsArray,
        summaryHtml,
        signatureHtml
    });

    printViaIframe(pagesHtml);
}

/**
 * 2. Download jsPDF AutoTable Document
 */
export async function downloadClosingPdf(summaryData) {
    const { customerCollections, totalCollection, startDate } = summaryData;
    if (!customerCollections || customerCollections.length === 0) {
        showToast('কোনো জমার ডাটা নেই', 'warning');
        return;
    }

    const settings = await SettingsDAO.getAppSettings();
    const columns = [
        { header: 'SL', dataKey: 'sl' },
        { header: 'A/C', dataKey: 'acc' },
        { header: 'Customer Name', dataKey: 'name' },
        { header: 'Zone', dataKey: 'zone' },
        { header: 'Method', dataKey: 'method' },
        { header: 'Paid (Tk)', dataKey: 'paid' },
        { header: 'Due (Tk)', dataKey: 'due' }
    ];

    const data = customerCollections.map((c, idx) => ({
        sl: String(idx + 1),
        acc: c.customerAccountNo || '-',
        name: `${c.customerName}\n${c.customerPhone || ''}`,
        zone: c.customerZone || '-',
        method: c.receivedType === 'Cash' ? 'Cash' : (c.receivedFrom || c.receivedType || 'Bank'),
        paid: formatAmountWithComma(c.amount),
        due: formatAmountWithComma(c.currentDue)
    }));

    await generateAutoTablePDF({
        settings,
        options: {
            title: 'CUSTOMER DEPOSITS & BANK REPORT',
            subtitle: `Date: ${formatAppDate(startDate)} • Total Deposits: Tk ${formatAmountWithComma(totalCollection)}`
        },
        columns,
        data,
        filename: `Maa_Motors_Deposits_${startDate}.pdf`
    });

    showToast('PDF ফাইল সফলভাবে ডাউনলোড হয়েছে!', 'success', 'PDF');
}

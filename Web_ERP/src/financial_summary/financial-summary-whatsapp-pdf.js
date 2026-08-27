import { SettingsDAO } from '../dao.js';
import { formatAmountWithComma, escapeHTML, renderPrintHeader, formatAppDate, showToast } from '../utils.js';
import { smartPaginatePrint, printViaIframe } from '../utils/smart-print-engine.js';
import { numberToBanglaWords } from '../utils/currency-words.js';
import { generateAutoTablePDF } from '../utils/pdf/pdf-engine.js';
import Swal from 'sweetalert2';

/**
 * 1. Print Complete Master Closing & Audit PDF (All Sections in 1 Document)
 */
export async function printClosingDepositPdfReport(summaryData) {
    const { 
        customerCollections = [], totalCollection = 0, cashCollection = 0, bankCollection = 0,
        startDate, endDate, bankBalances = [], totalLiquidFund = 0,
        totalSales = 0, salesCount = 0, totalExpenses = 0, netCashFlow = 0,
        bankingTransactions = [], rawExpenses = []
    } = summaryData;

    const settings = await SettingsDAO.getAppSettings();
    const isSingleDay = startDate === endDate;
    const dateTitle = isSingleDay ? `তারিখ: ${formatAppDate(startDate)}` : `সময়কাল: ${formatAppDate(startDate)} থেকে ${formatAppDate(endDate)}`;

    // 1. Executive Summary KPI Matrix HTML
    const kpiMatrixHtml = `
        <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 8px; margin-bottom: 10px; font-family: 'Hind Siliguri', sans-serif;">
            <div style="background: #f0f9ff; border: 1px solid #bae6fd; border-radius: 6px; padding: 6px 8px;">
                <div style="font-size: 9.5px; font-weight: 700; color: #0369a1;">মোট বিক্রয় (${salesCount}টি)</div>
                <div style="font-size: 13px; font-weight: 900; color: #0284c7; font-family: 'Inter', sans-serif;">৳ ${formatAmountWithComma(totalSales)}</div>
            </div>
            <div style="background: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 6px; padding: 6px 8px;">
                <div style="font-size: 9.5px; font-weight: 700; color: #15803d;">সর্বমোট আদায় (${customerCollections.length}জন)</div>
                <div style="font-size: 13px; font-weight: 900; color: #16a34a; font-family: 'Inter', sans-serif;">৳ ${formatAmountWithComma(totalCollection)}</div>
            </div>
            <div style="background: #fff1f2; border: 1px solid #fecdd3; border-radius: 6px; padding: 6px 8px;">
                <div style="font-size: 9.5px; font-weight: 700; color: #be123c;">মোট দোকান খরচ</div>
                <div style="font-size: 13px; font-weight: 900; color: #e11d48; font-family: 'Inter', sans-serif;">৳ ${formatAmountWithComma(totalExpenses)}</div>
            </div>
            <div style="background: #faf5ff; border: 1px solid #e9d5ff; border-radius: 6px; padding: 6px 8px;">
                <div style="font-size: 9.5px; font-weight: 700; color: #7e22ce;">নিট ক্যাশ ফ্লো</div>
                <div style="font-size: 13px; font-weight: 900; color: ${netCashFlow >= 0 ? '#16a34a' : '#e11d48'}; font-family: 'Inter', sans-serif;">৳ ${formatAmountWithComma(netCashFlow)}</div>
            </div>
        </div>
    `;

    // 2. Bank Balances Matrix HTML ("কোন ব্যাংকে কত টাকা আছে")
    let bankBoxesHtml = '';
    if (bankBalances && bankBalances.length > 0) {
        bankBoxesHtml = `
            <div style="margin-bottom: 10px; background: #f8fafc; border: 1.5px solid #cbd5e1; border-radius: 8px; padding: 7px 10px; font-family: 'Hind Siliguri', sans-serif;">
                <div style="font-size: 10.5px; font-weight: 900; color: #0284c7; margin-bottom: 4px; border-bottom: 1px solid #e2e8f0; padding-bottom: 2px;">
                    কোন ব্যাংকে কত টাকা আছে ও বর্তমান স্থিতি (Live Closing Balances):
                </div>
                <div style="display: flex; flex-wrap: wrap; gap: 10px; font-size: 9.5px; color: #334155;">
                    <span>ক্যাশ ইন হ্যান্ড: <strong style="color:#0f172a; font-weight:900;">৳ ${formatAmountWithComma(cashCollection)}</strong></span>
                    ${bankBalances.map(b => `<span>• ${escapeHTML(b.name)}: <strong style="color:#0284c7; font-weight:900;">৳ ${formatAmountWithComma(b.balance)}</strong></span>`).join('')}
                    ${totalLiquidFund ? `<span style="margin-left: auto; color:#15803d; font-weight:900; font-size: 10.5px;">মোট ফান্ড স্থিতি: ৳ ${formatAmountWithComma(totalLiquidFund)}</span>` : ''}
                </div>
            </div>
        `;
    }

    // 3. Banking Ledger Manual Transactions HTML (যদি থাকে)
    let bankingTxnsHtml = '';
    if (bankingTransactions && bankingTransactions.length > 0) {
        const bankRows = bankingTransactions.map((bt, i) => {
            const isDep = (bt.type || '').toLowerCase() === 'deposit';
            const typeText = isDep ? 'সরাসরি জমা' : ((bt.type || '').toLowerCase() === 'withdraw' ? 'টাকা উত্তোলন' : 'ফান্ড ট্রান্সফার');
            const typeColor = isDep ? '#16a34a' : '#e11d48';
            return `
                <tr style="background: ${i % 2 === 0 ? '#ffffff' : '#f8fafc'}; font-size: 9.5px;">
                    <td style="text-align:center; border:1px solid #cbd5e1; padding:4px;">${i + 1}</td>
                    <td style="border:1px solid #cbd5e1; padding:4px; font-weight:bold; color:#0f172a;">${escapeHTML(bt.bankName)} ${bt.targetBankName ? '➔ ' + escapeHTML(bt.targetBankName) : ''}</td>
                    <td style="text-align:center; border:1px solid #cbd5e1; padding:4px; font-weight:bold; color:${typeColor};">${typeText}</td>
                    <td style="text-align:center; border:1px solid #cbd5e1; padding:4px; font-family:monospace;">${escapeHTML(bt.voucherNo)}</td>
                    <td style="border:1px solid #cbd5e1; padding:4px; color:#475569;">${escapeHTML(bt.notes || '-')}</td>
                    <td style="text-align:right; border:1px solid #cbd5e1; padding:4px; font-weight:bold; color:${typeColor}; font-family:'Inter',sans-serif;">৳ ${formatAmountWithComma(bt.amount)}</td>
                </tr>
            `;
        }).join('');

        bankingTxnsHtml = `
            <div style="margin-bottom: 10px; font-family: 'Hind Siliguri', sans-serif;">
                <div style="font-size: 10.5px; font-weight: 900; color: #475569; margin-bottom: 3px;">
                    ব্যাংকিং লেজার লেনদেন বিবরণী (ম্যানুয়াল জমা, উত্তোলন ও ট্রান্সফার):
                </div>
                <table style="width:100%; border-collapse:collapse; font-family:'Hind Siliguri',sans-serif;">
                    <thead>
                        <tr style="background:#f1f5f9; font-size:9.5px; color:#1e293b; font-weight:bold;">
                            <th style="border:1px solid #cbd5e1; padding:4px; width:25px;">SL</th>
                            <th style="border:1px solid #cbd5e1; padding:4px; text-align:left;">ব্যাংক হিসাব</th>
                            <th style="border:1px solid #cbd5e1; padding:4px; width:75px;">লেনদেনের ধরন</th>
                            <th style="border:1px solid #cbd5e1; padding:4px; width:60px;">ভাউচার/চেক</th>
                            <th style="border:1px solid #cbd5e1; padding:4px; text-align:left;">বিবরণ / নোট</th>
                            <th style="border:1px solid #cbd5e1; padding:4px; text-align:right; width:75px;">পরিমাণ (৳)</th>
                        </tr>
                    </thead>
                    <tbody>${bankRows}</tbody>
                </table>
            </div>
        `;
    }

    const page1HeaderHtml = `
        ${renderPrintHeader(settings, {
            title: 'MASTER FINANCIAL CLOSING & AUDIT REGISTER',
            subtitle: `সার্বিক দৈনিক আর্থিক ক্লোজিং ও কাস্টমার আদায় শিট • ${dateTitle}`
        })}
        ${kpiMatrixHtml}
        ${bankBoxesHtml}
        ${bankingTxnsHtml}
    `;

    const repeatHeaderHtml = `
        <div style="display:flex; justify-content:space-between; align-items:flex-end; border-bottom:2px solid #0284c7; padding-bottom:4px; margin-bottom:8px;">
            <div style="font-size:13px; font-weight:900; color:#0f172a; font-family:'Inter',sans-serif;">MASTER CLOSING & AUDIT REGISTER <span style="font-size:10px; color:#475569; font-weight:normal;">(Continued)</span></div>
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
                <td style="text-align:center; vertical-align:middle; border: 1px solid #cbd5e1; padding: 4.5px 3px; font-size: 10px; font-family: 'Inter', sans-serif;">${idx + 1}</td>
                <td style="text-align:center; vertical-align:middle; border: 1px solid #cbd5e1; padding: 4.5px 3px; font-size: 9.5px; font-family: 'Inter', sans-serif; white-space: nowrap;">${formatAppDate(c.date || startDate)}</td>
                <td style="text-align:center; vertical-align:middle; border: 1px solid #cbd5e1; padding: 4.5px 3px; font-size: 10px; font-weight: 800; font-family: 'Inter', monospace; color: #0284c7;">${escapeHTML(c.customerAccountNo || '-')}</td>
                <td style="text-align:left; vertical-align:middle; border: 1px solid #cbd5e1; padding: 4.5px 5px; font-size: 10px; font-family: 'Kalpurush', 'Hind Siliguri', sans-serif; line-height: 1.2; color: #0f172a;">
                    <strong>${escapeHTML(c.customerName)}</strong><br>
                    <span style="font-size:9px; color:#475569;">${escapeHTML(c.customerPhone || '-')}</span>
                </td>
                <td style="text-align:left; vertical-align:middle; border: 1px solid #cbd5e1; padding: 4.5px 5px; font-size: 9.5px; font-family: 'Kalpurush', 'Hind Siliguri', sans-serif; line-height: 1.15; color: #334155;">${escapeHTML(c.customerZone || '-')}</td>
                <td style="text-align:center; vertical-align:middle; border: 1px solid #cbd5e1; padding: 4.5px 3px; font-size: 9.5px; font-family: 'Inter', monospace; color: #475569;">${escapeHTML(c.voucherNo || '-')}</td>
                <td style="text-align:center; vertical-align:middle; border: 1px solid #cbd5e1; padding: 4.5px 3px; font-size: 9.5px; font-family: 'Hind Siliguri', sans-serif; font-weight: 600; color: #1e293b;">${escapeHTML(methodDisplay)}</td>
                <td style="text-align:right; vertical-align:middle; border: 1px solid #cbd5e1; padding: 4.5px 5px; font-size: 10.5px; font-weight: 900; color: #16a34a; font-family: 'Inter', sans-serif; white-space: nowrap;">৳ ${formatAmountWithComma(c.amount)}</td>
                <td style="text-align:right; vertical-align:middle; border: 1px solid #cbd5e1; padding: 4.5px 5px; font-size: 10px; font-weight: 800; color: ${dueVal > 0 ? '#dc2626' : '#16a34a'}; font-family: 'Inter', sans-serif; white-space: nowrap;">৳ ${formatAmountWithComma(Math.abs(dueVal))} ${dueVal < 0 ? '(Adv)' : ''}</td>
            </tr>
        `;
    });

    const tableColHeaderHtml = `
        <thead>
            <tr style="background: #f1f5f9; border-bottom: 2px solid #cbd5e1;">
                <th style="text-align: center; border: 1px solid #cbd5e1; padding: 5px 3px; font-size: 9.5px; font-weight: 900; color: #1e293b; width: 28px;">SL</th>
                <th style="text-align: center; border: 1px solid #cbd5e1; padding: 5px 3px; font-size: 9.5px; font-weight: 900; color: #1e293b; width: 60px;">তারিখ</th>
                <th style="text-align: center; border: 1px solid #cbd5e1; padding: 5px 3px; font-size: 9.5px; font-weight: 900; color: #1e293b; width: 45px;">A/C</th>
                <th style="text-align: left; border: 1px solid #cbd5e1; padding: 5px 5px; font-size: 9.5px; font-weight: 900; color: #1e293b;">কাস্টমার ও মোবাইল</th>
                <th style="text-align: left; border: 1px solid #cbd5e1; padding: 5px 5px; font-size: 9.5px; font-weight: 900; color: #1e293b; width: 75px;">জোন</th>
                <th style="text-align: center; border: 1px solid #cbd5e1; padding: 5px 3px; font-size: 9.5px; font-weight: 900; color: #1e293b; width: 55px;">ভাউচার</th>
                <th style="text-align: center; border: 1px solid #cbd5e1; padding: 5px 3px; font-size: 9.5px; font-weight: 900; color: #1e293b; width: 70px;">পদ্ধতি / ব্যাংক</th>
                <th style="text-align: right; border: 1px solid #cbd5e1; padding: 5px 5px; font-size: 9.5px; font-weight: 900; color: #1e293b; width: 80px;">জমা (৳)</th>
                <th style="text-align: right; border: 1px solid #cbd5e1; padding: 5px 5px; font-size: 9.5px; font-weight: 900; color: #1e293b; width: 80px;">অবশিষ্ট বকেয়া (৳)</th>
            </tr>
        </thead>
    `;

    const summaryHtml = `
        <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-top: 12px; page-break-inside: avoid; break-inside: avoid;">
            <div style="width: 55%; background: #f8fafc; border: 1px solid #cbd5e1; border-radius: 8px; padding: 7px 10px; font-family: 'Hind Siliguri', sans-serif;">
                <div style="font-size: 10.5px; font-weight: 700; color: #334155; margin-bottom: 3px;">
                    কথায়: <span style="font-weight: 900; color: #15803d;">${numberToBanglaWords(totalCollection)}</span>
                </div>
                <div style="display: flex; gap: 12px; font-size: 10px; color: #64748b; margin-top: 3px;">
                    <span>ক্যাশ জমা: <strong style="color: #0f172a;">৳ ${formatAmountWithComma(cashCollection)}</strong></span>
                    <span>ব্যাংক জমা: <strong style="color: #0284c7;">৳ ${formatAmountWithComma(bankCollection)}</strong></span>
                </div>
            </div>

            <div style="width: 38%; background: #f0fdf4; border: 1.5px solid #86efac; border-radius: 8px; padding: 7px 10px; font-family: 'Hind Siliguri', sans-serif;">
                <div style="display: flex; justify-content: space-between; font-size: 10.5px; margin-bottom: 3px;">
                    <span style="color: #166534; font-weight: 700;">মোট কাস্টমার জমা:</span>
                    <strong style="color: #0f172a; font-weight: 900;">${customerCollections.length} জন</strong>
                </div>
                <div style="display: flex; justify-content: space-between; font-size: 11.5px; border-top: 1px dashed #86efac; padding-top: 3px;">
                    <span style="color: #166534; font-weight: 900;">সর্বমোট আদায়:</span>
                    <strong style="color: #15803d; font-size: 13px; font-weight: 900;">৳ ${formatAmountWithComma(totalCollection)}</strong>
                </div>
            </div>
        </div>
    `;

    const signatureHtml = `
        <div class="signature-last-page-block" style="margin-top: 30px; page-break-inside: avoid; break-inside: avoid;">
            <div style="display: flex; justify-content: space-between; padding: 0 20px;">
                <div style="border-top: 1.5px dashed #64748b; width: 130px; text-align: center; font-size: 9.5px; font-weight: 700; color: #334155; padding-top: 4px; font-family: 'Hind Siliguri', sans-serif;">
                    ক্যাশিয়ারের স্বাক্ষর
                </div>
                <div style="border-top: 1.5px dashed #64748b; width: 130px; text-align: center; font-size: 9.5px; font-weight: 700; color: #334155; padding-top: 4px; font-family: 'Hind Siliguri', sans-serif;">
                    ম্যানেজারের স্বাক্ষর
                </div>
                <div style="border-top: 1.5px dashed #64748b; width: 130px; text-align: center; font-size: 9.5px; font-weight: 700; color: #334155; padding-top: 4px; font-family: 'Hind Siliguri', sans-serif;">
                    স্বত্বাধিকারীর স্বাক্ষর
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
 * 2. Download Master jsPDF AutoTable Document
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
            title: 'MASTER DAILY CLOSING & AUDIT REPORT',
            subtitle: `Date: ${formatAppDate(startDate)} • Total Collection: Tk ${formatAmountWithComma(totalCollection)}`
        },
        columns,
        data,
        filename: `Maa_Motors_Master_Closing_${startDate}.pdf`
    });

    showToast('মাস্টার PDF ফাইল সফলভাবে ডাউনলোড হয়েছে!', 'success', 'PDF');
}

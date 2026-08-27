import { SettingsDAO } from '../dao.js';
import { formatAmountWithComma, escapeHTML, formatAppDate, showToast } from '../utils.js';
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
        bankingTransactions = []
    } = summaryData;

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
    const dateTitle = isSingleDay ? formatAppDate(startDate) : `${formatAppDate(startDate)} - ${formatAppDate(endDate)}`;

    const shopName = escapeHTML(settings.shopName || "M/S. MAA-MOTOR'S");
    const shopOwner = escapeHTML(settings.shopOwner || "Mohammed Amran");
    const shopAddress = escapeHTML(settings.shopAddress || "Shop No. 22, Rahman Tower, 1st Rail Gate, Muradpur, Hathazari Road");
    const shopPhone = escapeHTML(settings.shopPhone || "01819-397669, 01815-707934");
    const shopLogo = settings.shopLogo || "/shop-official-logo.jpg";

    // 1. Sleek Compact Master Header Banner
    const masterHeaderHtml = `
        <div style="background: linear-gradient(135deg, #0284c7 0%, #0369a1 100%) !important; color: #ffffff !important; border-radius: 12px; padding: 10px 16px; display: flex; justify-content: space-between; align-items: center; box-shadow: 0 2px 8px rgba(2, 132, 199, 0.2); margin-bottom: 8px; font-family: 'Inter', 'Kalpurush', sans-serif !important; -webkit-print-color-adjust: exact; print-color-adjust: exact;">
            <div style="display: flex; align-items: center; gap: 12px;">
                <div style="width: 52px; height: 52px; background: #ffffff !important; border-radius: 50%; display: flex; align-items: center; justify-content: center; overflow: hidden; border: 2px solid #ffffff; flex-shrink: 0; padding: 1px;">
                    <img src="${shopLogo}" style="width: 100%; height: 100%; object-fit: contain; border-radius: 50%; display: block;" />
                </div>
                <div>
                    <h1 style="font-size: 18px; font-weight: 900 !important; margin: 0; text-transform: uppercase; line-height: 1.1; color: #ffffff !important; font-family: 'Inter', sans-serif !important;">${shopName}</h1>
                    <p style="font-size: 9.5px; margin: 2px 0 1px 0; font-weight: 700 !important; color: #e0f2fe !important;">Proprietor: ${shopOwner} • Mobile: ${shopPhone}</p>
                    <p style="font-size: 9px; margin: 0; opacity: 0.9; font-weight: 600 !important; color: #f0f9ff !important; font-family: 'Kalpurush', 'Hind Siliguri', sans-serif !important;">${shopAddress}</p>
                </div>
            </div>
            <div style="text-align: right; flex-shrink: 0;">
                <div style="display: inline-block; font-size: 12px; font-weight: 900 !important; text-transform: uppercase; background: rgba(255, 255, 255, 0.2) !important; border: 1px solid rgba(255, 255, 255, 0.4); padding: 5px 14px; border-radius: 8px; letter-spacing: 0.5px; color: #ffffff !important;">DAILY CLOSING & AUDIT REGISTER</div>
                <div style="font-size: 9.5px; font-weight: 700 !important; margin-top: 3px; color: #e0f2fe !important; font-family: 'Hind Siliguri', sans-serif !important;">তারিখ: ${dateTitle}</div>
            </div>
        </div>
    `;

    // 2. Compact Executive KPI Summary Matrix (4 Cards)
    const kpiMatrixHtml = `
        <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 6px; margin-bottom: 6px; font-family: 'Hind Siliguri', sans-serif;">
            <div style="background: #f0f9ff; border: 1px solid #bae6fd; border-radius: 6px; padding: 4px 6px;">
                <div style="font-size: 8.5px; font-weight: 700; color: #0369a1;">মোট বিক্রয় (${salesCount}টি)</div>
                <div style="font-size: 11px; font-weight: 900; color: #0284c7; font-family: 'Inter', sans-serif;">৳ ${formatAmountWithComma(totalSales)}</div>
            </div>
            <div style="background: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 6px; padding: 4px 6px;">
                <div style="font-size: 8.5px; font-weight: 700; color: #15803d;">সর্বমোট আদায় (${customerCollections.length}জন)</div>
                <div style="font-size: 11px; font-weight: 900; color: #16a34a; font-family: 'Inter', sans-serif;">৳ ${formatAmountWithComma(totalCollection)}</div>
            </div>
            <div style="background: #fff1f2; border: 1px solid #fecdd3; border-radius: 6px; padding: 4px 6px;">
                <div style="font-size: 8.5px; font-weight: 700; color: #be123c;">মোট দোকান খরচ</div>
                <div style="font-size: 11px; font-weight: 900; color: #e11d48; font-family: 'Inter', sans-serif;">৳ ${formatAmountWithComma(totalExpenses)}</div>
            </div>
            <div style="background: #faf5ff; border: 1px solid #e9d5ff; border-radius: 6px; padding: 4px 6px;">
                <div style="font-size: 8.5px; font-weight: 700; color: #7e22ce;">নিট ক্যাশ ফ্লো</div>
                <div style="font-size: 11px; font-weight: 900; color: ${netCashFlow >= 0 ? '#16a34a' : '#e11d48'}; font-family: 'Inter', sans-serif;">৳ ${formatAmountWithComma(netCashFlow)}</div>
            </div>
        </div>
    `;

    // 3. Beautiful Bank Balances Card Grid Layout
    let bankBoxesHtml = '';
    if (bankBalances && bankBalances.length > 0) {
        const bankCards = [
            `<div style="background: #f8fafc; border: 1px solid #cbd5e1; border-radius: 6px; padding: 4px 6px;">
                <div style="font-size: 8.5px; font-weight: 700; color: #64748b;">ক্যাশ ইন হ্যান্ড</div>
                <div style="font-size: 10.5px; font-weight: 900; color: #0f172a; font-family: 'Inter', monospace; margin-top: 1px;">৳ ${formatAmountWithComma(cashCollection)}</div>
            </div>`,
            ...bankBalances.map(b => `<div style="background: #f8fafc; border: 1px solid #cbd5e1; border-radius: 6px; padding: 4px 6px;">
                <div style="font-size: 8.5px; font-weight: 700; color: #0284c7; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">${escapeHTML(b.name)}</div>
                <div style="font-size: 10.5px; font-weight: 900; color: #0369a1; font-family: 'Inter', monospace; margin-top: 1px;">৳ ${formatAmountWithComma(b.balance)}</div>
            </div>`),
            totalLiquidFund ? `<div style="background: #f0fdf4; border: 1px solid #86efac; border-radius: 6px; padding: 4px 6px;">
                <div style="font-size: 8.5px; font-weight: 800; color: #166534;">মোট ফান্ড স্থিতি</div>
                <div style="font-size: 10.5px; font-weight: 900; color: #15803d; font-family: 'Inter', monospace; margin-top: 1px;">৳ ${formatAmountWithComma(totalLiquidFund)}</div>
            </div>` : ''
        ].filter(Boolean).join('');

        bankBoxesHtml = `
            <div style="margin-bottom: 6px; font-family: 'Hind Siliguri', sans-serif;">
                <div style="font-size: 9px; font-weight: 900; color: #0369a1; margin-bottom: 2px;">কোন ব্যাংকে কত টাকা আছে (Live Closing Balances):</div>
                <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(115px, 1fr)); gap: 5px;">${bankCards}</div>
            </div>
        `;
    }

    // 4. Banking Ledger Manual Transactions (যদি থাকে)
    let bankingTxnsHtml = '';
    if (bankingTransactions && bankingTransactions.length > 0) {
        const bankRows = bankingTransactions.map((bt, i) => {
            const isDep = (bt.type || '').toLowerCase() === 'deposit';
            const typeText = isDep ? 'সরাসরি জমা' : ((bt.type || '').toLowerCase() === 'withdraw' ? 'উত্তোলন' : 'ট্রান্সফার');
            const typeColor = isDep ? '#16a34a' : '#e11d48';
            return `<tr style="background: ${i % 2 === 0 ? '#ffffff' : '#f8fafc'}; font-size: 8.5px;">
                <td style="text-align:center; border:1px solid #cbd5e1; padding:3px;">${i + 1}</td>
                <td style="border:1px solid #cbd5e1; padding:3px; font-weight:bold; color:#0f172a;">${escapeHTML(bt.bankName)} ${bt.targetBankName ? '➔ ' + escapeHTML(bt.targetBankName) : ''}</td>
                <td style="text-align:center; border:1px solid #cbd5e1; padding:3px; font-weight:bold; color:${typeColor};">${typeText}</td>
                <td style="text-align:center; border:1px solid #cbd5e1; padding:3px; font-family:monospace;">${escapeHTML(bt.voucherNo)}</td>
                <td style="border:1px solid #cbd5e1; padding:3px; color:#475569;">${escapeHTML(bt.notes || '-')}</td>
                <td style="text-align:right; border:1px solid #cbd5e1; padding:3px; font-weight:bold; color:${typeColor}; font-family:'Inter',sans-serif;">৳ ${formatAmountWithComma(bt.amount)}</td>
            </tr>`;
        }).join('');

        bankingTxnsHtml = `
            <div style="margin-bottom: 6px; font-family: 'Hind Siliguri', sans-serif;">
                <div style="font-size: 9px; font-weight: 900; color: #475569; margin-bottom: 2px;">ব্যাংকিং লেজার ম্যানুয়াল লেনদেন (জমা, উত্তোলন ও ট্রান্সফার):</div>
                <table style="width:100%; border-collapse:collapse; font-family:'Hind Siliguri',sans-serif;">
                    <thead>
                        <tr style="background:#f1f5f9; font-size:8.5px; color:#1e293b; font-weight:bold;">
                            <th style="border:1px solid #cbd5e1; padding:3px; width:25px;">SL</th>
                            <th style="border:1px solid #cbd5e1; padding:3px; text-align:left;">ব্যাংক হিসাব</th>
                            <th style="border:1px solid #cbd5e1; padding:3px; width:65px;">লেনদেনের ধরন</th>
                            <th style="border:1px solid #cbd5e1; padding:3px; width:50px;">ভাউচার/চেক</th>
                            <th style="border:1px solid #cbd5e1; padding:3px; text-align:left;">বিবরণ / নোট</th>
                            <th style="border:1px solid #cbd5e1; padding:3px; text-align:right; width:65px;">পরিমাণ (৳)</th>
                        </tr>
                    </thead>
                    <tbody>${bankRows}</tbody>
                </table>
            </div>
        `;
    }

    const page1HeaderHtml = `${masterHeaderHtml}${kpiMatrixHtml}${bankBoxesHtml}${bankingTxnsHtml}`;

    const repeatHeaderHtml = `
        <div style="display:flex; justify-content:space-between; align-items:flex-end; border-bottom:2px solid #0284c7; padding-bottom:3px; margin-bottom:6px;">
            <div style="font-size:12px; font-weight:900; color:#0f172a; font-family:'Inter',sans-serif;">MASTER CLOSING & AUDIT REGISTER <span style="font-size:9.5px; color:#475569; font-weight:normal;">(Continued)</span></div>
            <div style="font-size:9.5px; color:#475569; font-family:'Hind Siliguri',sans-serif;">তারিখ: ${dateTitle}</div>
        </div>
    `;

    // 5. Customer Collections Rows (WITHOUT Zone and Voucher as requested)
    const rowsArray = customerCollections.map((c, idx) => {
        const isEven = idx % 2 === 0;
        const bgStyle = isEven ? 'background: #ffffff;' : 'background: #f8fafc;';
        const methodDisplay = c.receivedType === 'Cash' ? 'ক্যাশ' : (c.receivedFrom || c.receivedType || 'ব্যাংক');
        const dueVal = Number(c.currentDue || 0);

        return `
            <tr class="print-row-no-break" style="${bgStyle}">
                <td style="text-align:center; vertical-align:middle; border: 1px solid #cbd5e1; padding: 4px 3px; font-size: 9.5px; font-family: 'Inter', sans-serif;">${idx + 1}</td>
                <td style="text-align:center; vertical-align:middle; border: 1px solid #cbd5e1; padding: 4px 3px; font-size: 9px; font-family: 'Inter', sans-serif; white-space: nowrap;">${formatAppDate(c.date || startDate)}</td>
                <td style="text-align:center; vertical-align:middle; border: 1px solid #cbd5e1; padding: 4px 3px; font-size: 9.5px; font-weight: 800; font-family: 'Inter', monospace; color: #0284c7;">${escapeHTML(c.customerAccountNo || '-')}</td>
                <td style="text-align:left; vertical-align:middle; border: 1px solid #cbd5e1; padding: 4px 6px; font-size: 10px; font-family: 'Kalpurush', 'Hind Siliguri', sans-serif; line-height: 1.2; color: #0f172a;">
                    <strong>${escapeHTML(c.customerName)}</strong>
                    ${c.customerPhone ? `<span style="font-size:8.5px; color:#475569; margin-left:4px;">(${escapeHTML(c.customerPhone)})</span>` : ''}
                </td>
                <td style="text-align:center; vertical-align:middle; border: 1px solid #cbd5e1; padding: 4px 4px; font-size: 9px; font-family: 'Hind Siliguri', sans-serif; font-weight: 600; color: #1e293b;">${escapeHTML(methodDisplay)}</td>
                <td style="text-align:right; vertical-align:middle; border: 1px solid #cbd5e1; padding: 4px 6px; font-size: 10.5px; font-weight: 900; color: #16a34a; font-family: 'Inter', sans-serif; white-space: nowrap;">৳ ${formatAmountWithComma(c.amount)}</td>
                <td style="text-align:right; vertical-align:middle; border: 1px solid #cbd5e1; padding: 4px 6px; font-size: 10px; font-weight: 800; color: ${dueVal > 0 ? '#dc2626' : '#16a34a'}; font-family: 'Inter', sans-serif; white-space: nowrap;">৳ ${formatAmountWithComma(Math.abs(dueVal))} ${dueVal < 0 ? '(Adv)' : ''}</td>
            </tr>
        `;
    });

    // 6. Table Header (Cleaner & more spacious without Zone and Voucher)
    const tableColHeaderHtml = `
        <thead>
            <tr style="background: #f1f5f9; border-bottom: 2px solid #cbd5e1;">
                <th style="text-align: center; border: 1px solid #cbd5e1; padding: 5px 3px; font-size: 9px; font-weight: 900; color: #1e293b; width: 28px;">SL</th>
                <th style="text-align: center; border: 1px solid #cbd5e1; padding: 5px 3px; font-size: 9px; font-weight: 900; color: #1e293b; width: 65px;">তারিখ</th>
                <th style="text-align: center; border: 1px solid #cbd5e1; padding: 5px 3px; font-size: 9px; font-weight: 900; color: #1e293b; width: 50px;">A/C</th>
                <th style="text-align: left; border: 1px solid #cbd5e1; padding: 5px 6px; font-size: 9.5px; font-weight: 900; color: #1e293b;">কাস্টমার ও মোবাইল</th>
                <th style="text-align: center; border: 1px solid #cbd5e1; padding: 5px 4px; font-size: 9px; font-weight: 900; color: #1e293b; width: 95px;">পদ্ধতি / ব্যাংক</th>
                <th style="text-align: right; border: 1px solid #cbd5e1; padding: 5px 6px; font-size: 9.5px; font-weight: 900; color: #1e293b; width: 90px;">জমা (৳)</th>
                <th style="text-align: right; border: 1px solid #cbd5e1; padding: 5px 6px; font-size: 9.5px; font-weight: 900; color: #1e293b; width: 90px;">অবশিষ্ট বকেয়া (৳)</th>
            </tr>
        </thead>
    `;

    const summaryHtml = `
        <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-top: 10px; page-break-inside: avoid; break-inside: avoid;">
            <div style="width: 55%; background: #f8fafc; border: 1px solid #cbd5e1; border-radius: 6px; padding: 6px 9px; font-family: 'Hind Siliguri', sans-serif;">
                <div style="font-size: 10px; font-weight: 700; color: #334155; margin-bottom: 2px;">
                    কথায়: <span style="font-weight: 900; color: #15803d;">${numberToBanglaWords(totalCollection)}</span>
                </div>
                <div style="display: flex; gap: 10px; font-size: 9.5px; color: #64748b; margin-top: 2px;">
                    <span>ক্যাশ জমা: <strong style="color: #0f172a;">৳ ${formatAmountWithComma(cashCollection)}</strong></span>
                    <span>ব্যাংক জমা: <strong style="color: #0284c7;">৳ ${formatAmountWithComma(bankCollection)}</strong></span>
                </div>
            </div>

            <div style="width: 38%; background: #f0fdf4; border: 1.5px solid #86efac; border-radius: 6px; padding: 6px 9px; font-family: 'Hind Siliguri', sans-serif;">
                <div style="display: flex; justify-content: space-between; font-size: 10px; margin-bottom: 2px;">
                    <span style="color: #166534; font-weight: 700;">মোট কাস্টমার জমা:</span>
                    <strong style="color: #0f172a; font-weight: 900;">${customerCollections.length} জন</strong>
                </div>
                <div style="display: flex; justify-content: space-between; font-size: 11px; border-top: 1px dashed #86efac; padding-top: 2px;">
                    <span style="color: #166534; font-weight: 900;">সর্বমোট আদায়:</span>
                    <strong style="color: #15803d; font-size: 12.5px; font-weight: 900;">৳ ${formatAmountWithComma(totalCollection)}</strong>
                </div>
            </div>
        </div>
    `;

    const signatureHtml = `
        <div class="signature-last-page-block" style="margin-top: 25px; page-break-inside: avoid; break-inside: avoid;">
            <div style="display: flex; justify-content: space-between; padding: 0 20px;">
                <div style="border-top: 1.5px dashed #64748b; width: 120px; text-align: center; font-size: 9px; font-weight: 700; color: #334155; padding-top: 3px; font-family: 'Hind Siliguri', sans-serif;">ক্যাশিয়ারের স্বাক্ষর</div>
                <div style="border-top: 1.5px dashed #64748b; width: 120px; text-align: center; font-size: 9px; font-weight: 700; color: #334155; padding-top: 3px; font-family: 'Hind Siliguri', sans-serif;">ম্যানেজারের স্বাক্ষর</div>
                <div style="border-top: 1.5px dashed #64748b; width: 120px; text-align: center; font-size: 9px; font-weight: 700; color: #334155; padding-top: 3px; font-family: 'Hind Siliguri', sans-serif;">স্বত্বাধিকারীর স্বাক্ষর</div>
            </div>
        </div>
    `;

    const pagesHtml = await smartPaginatePrint({
        page1HeaderHtml,
        repeatHeaderHtml,
        tableColHeaderHtml,
        rowsArray,
        summaryHtml,
        signatureHtml,
        formattedDate: dateTitle
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
        { header: 'Method', dataKey: 'method' },
        { header: 'Paid (Tk)', dataKey: 'paid' },
        { header: 'Due (Tk)', dataKey: 'due' }
    ];

    const data = customerCollections.map((c, idx) => ({
        sl: String(idx + 1),
        acc: c.customerAccountNo || '-',
        name: `${c.customerName}\n${c.customerPhone || ''}`,
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

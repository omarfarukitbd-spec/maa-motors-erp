import { SettingsDAO } from '../dao.js';
import { formatAmountWithComma, escapeHTML, formatAppDate, toDBDate, renderPrintHeader, renderRepeatHeader } from '../utils.js';
import { smartPaginatePrint, printViaIframe } from '../utils/smart-print-engine.js';
import { numberToBanglaWords } from '../utils/currency-words.js';
import Swal from 'sweetalert2';

/**
 * 1. Print Complete Master Closing & Audit PDF (All Sections in 1 Document)
 */
export async function printClosingDepositPdfReport(summaryData) {
    const { 
        customerCollections = [], totalCollection = 0, cashCollection = 0, bankCollection = 0,
        startDate, endDate, bankBalances = [], totalLiquidFund = 0,
        totalSales = 0, salesCount = 0, totalExpenses = 0, netCashFlow = 0,
        totalMarketDue = 0, dueCustomerCount = 0,
        bankingTransactions = [], methodBreakdown = {}
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

    // 1. Official Mother PDF Header
    const masterHeaderHtml = renderPrintHeader(settings, {
        title: 'দৈনিক ক্লোজিং ও অডিট রেজিস্টার',
        pageLabel: isSingleDay ? 'তারিখ' : 'সময়কাল',
        dateRangeStr: dateTitle
    });

    // 2. Compact Executive KPI Summary Matrix (5 Cards)
    const kpiMatrixHtml = `
        <div style="display: grid; grid-template-columns: repeat(5, 1fr); gap: 5px; margin-bottom: 5px; font-family: 'Hind Siliguri', sans-serif;">
            <div style="background: #f0f9ff; border: 1px solid #bae6fd; border-radius: 5px; padding: 3px 5px;">
                <div style="font-size: 8px; font-weight: 700; color: #0369a1;">মোট বিক্রয় (${salesCount}টি)</div>
                <div style="font-size: 10px; font-weight: 900; color: #0284c7; font-family: 'Inter', sans-serif;">৳ ${formatAmountWithComma(totalSales)}</div>
            </div>
            <div style="background: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 5px; padding: 3px 5px;">
                <div style="font-size: 8px; font-weight: 700; color: #15803d;">সর্বমোট আদায় (${customerCollections.length}জন)</div>
                <div style="font-size: 10px; font-weight: 900; color: #16a34a; font-family: 'Inter', sans-serif;">৳ ${formatAmountWithComma(totalCollection)}</div>
            </div>
            <div style="background: #fff1f2; border: 1px solid #fecdd3; border-radius: 5px; padding: 3px 5px;">
                <div style="font-size: 8px; font-weight: 700; color: #be123c;">মোট দোকান খরচ</div>
                <div style="font-size: 10px; font-weight: 900; color: #e11d48; font-family: 'Inter', sans-serif;">৳ ${formatAmountWithComma(totalExpenses)}</div>
            </div>
            <div style="background: #faf5ff; border: 1px solid #e9d5ff; border-radius: 5px; padding: 3px 5px;">
                <div style="font-size: 8px; font-weight: 700; color: #7e22ce;">নিট ক্যাশ ফ্লো</div>
                <div style="font-size: 10px; font-weight: 900; color: ${netCashFlow >= 0 ? '#16a34a' : '#e11d48'}; font-family: 'Inter', sans-serif;">৳ ${formatAmountWithComma(netCashFlow)}</div>
            </div>
            <div style="background: #fff1f2; border: 1px solid #fda4af; border-radius: 5px; padding: 3px 5px;">
                <div style="font-size: 8px; font-weight: 700; color: #9f1239;">মার্কেটে মোট বকেয়া (${dueCustomerCount}জন)</div>
                <div style="font-size: 10px; font-weight: 900; color: #e11d48; font-family: 'Inter', sans-serif;">৳ ${formatAmountWithComma(totalMarketDue)}</div>
            </div>
        </div>
    `;

    // 3. Today's Bank Collections Breakdown Cards (আজকে কোন ব্যাংকে কত টাকা জমা হয়েছে)
    let todayDepositCardsHtml = '';
    const validMethods = Object.values(methodBreakdown || {}).filter(m => m.name !== 'Less' && m.amount > 0);
    if (validMethods.length > 0) {
        const depCards = validMethods.map(m => `
            <div style="background: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 5px; padding: 3px 5px;">
                <div style="font-size: 8px; font-weight: 700; color: #166534; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">${escapeHTML(m.name === 'Cash' ? 'ক্যাশ জমা' : m.name)} (${m.count}জন)</div>
                <div style="font-size: 10px; font-weight: 900; color: #15803d; font-family: 'Inter', monospace; margin-top: 1px;">৳ ${formatAmountWithComma(m.amount)}</div>
            </div>
        `).join('');

        todayDepositCardsHtml = `
            <div style="margin-bottom: 5px; font-family: 'Hind Siliguri', sans-serif;">
                <div style="font-size: 8.5px; font-weight: 900; color: #15803d; margin-bottom: 2px;">আজকে কোন মাধ্যমে/ব্যাংকে কত টাকা জমা হয়েছে (Today's Collections):</div>
                <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(110px, 1fr)); gap: 4px;">${depCards}</div>
            </div>
        `;
    }

    // 4. Live Closing Bank Balances Card Grid (কোন ব্যাংকে মোট কত স্থিতি আছে)
    let bankBoxesHtml = '';
    if (bankBalances && bankBalances.length > 0) {
        const bankCards = [
            `<div style="background: #f8fafc; border: 1px solid #cbd5e1; border-radius: 5px; padding: 3px 5px;">
                <div style="font-size: 8px; font-weight: 700; color: #64748b;">ক্যাশ ইন হ্যান্ড</div>
                <div style="font-size: 10px; font-weight: 900; color: #0f172a; font-family: 'Inter', monospace; margin-top: 1px;">৳ ${formatAmountWithComma(cashCollection)}</div>
            </div>`,
            ...bankBalances.map(b => `<div style="background: #f8fafc; border: 1px solid #cbd5e1; border-radius: 5px; padding: 3px 5px;">
                <div style="font-size: 8px; font-weight: 700; color: #0284c7; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">${escapeHTML(b.name)}</div>
                <div style="font-size: 10px; font-weight: 900; color: #0369a1; font-family: 'Inter', monospace; margin-top: 1px;">৳ ${formatAmountWithComma(b.balance)}</div>
            </div>`),
            totalLiquidFund ? `<div style="background: #ecfdf5; border: 1px solid #6ee7b7; border-radius: 5px; padding: 3px 5px;">
                <div style="font-size: 8px; font-weight: 800; color: #047857;">মোট ফান্ড স্থিতি</div>
                <div style="font-size: 10px; font-weight: 900; color: #059669; font-family: 'Inter', monospace; margin-top: 1px;">৳ ${formatAmountWithComma(totalLiquidFund)}</div>
            </div>` : ''
        ].filter(Boolean).join('');

        bankBoxesHtml = `
            <div style="margin-bottom: 5px; font-family: 'Hind Siliguri', sans-serif;">
                <div style="font-size: 8.5px; font-weight: 900; color: #0369a1; margin-bottom: 2px;">সব ব্যাংকের সমাপনী মোট স্থিতি (Bank Closing Balances):</div>
                <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(110px, 1fr)); gap: 4px;">${bankCards}</div>
            </div>
        `;
    }

    // 5. Banking Ledger Manual Transactions (যদি থাকে)
    let bankingTxnsHtml = '';
    if (bankingTransactions && bankingTransactions.length > 0) {
        const bankRows = bankingTransactions.map((bt, i) => {
            const rawType = (bt.type || '').toLowerCase();
            const isDep = rawType === 'deposit';
            const isWith = rawType === 'withdrawal' || rawType === 'withdraw';
            const typeText = isDep ? 'সরাসরি জমা' : (isWith ? 'টাকা উত্তোলন' : 'ফান্ড ট্রান্সফার');
            const typeColor = isDep ? '#16a34a' : (isWith ? '#e11d48' : '#0284c7');
            return `<tr style="background: ${i % 2 === 0 ? '#ffffff' : '#f8fafc'}; font-size: 8.5px;">
                <td style="text-align:center; border:1px solid #cbd5e1; padding:2px;">${i + 1}</td>
                <td style="border:1px solid #cbd5e1; padding:2px 4px; font-weight:bold; color:#0f172a;">${escapeHTML(bt.bankName)} ${bt.targetBankName ? '➔ ' + escapeHTML(bt.targetBankName) : ''}</td>
                <td style="text-align:center; border:1px solid #cbd5e1; padding:2px; font-weight:bold; color:${typeColor};">${typeText}</td>
                <td style="text-align:center; border:1px solid #cbd5e1; padding:2px; font-family:monospace;">${escapeHTML(bt.voucherNo || '-')}</td>
                <td style="border:1px solid #cbd5e1; padding:2px 4px; color:#1e293b; font-weight:600;">${escapeHTML(bt.notes || '-')}</td>
                <td style="text-align:right; border:1px solid #cbd5e1; padding:2px 4px; font-weight:bold; color:${typeColor}; font-family:'Inter',sans-serif;">৳ ${formatAmountWithComma(bt.amount)}</td>
            </tr>`;
        }).join('');

        bankingTxnsHtml = `
            <div style="margin-bottom: 5px; font-family: 'Hind Siliguri', sans-serif;">
                <div style="font-size: 8.5px; font-weight: 900; color: #475569; margin-bottom: 2px;">ব্যাংকিং লেজার ম্যানুয়াল লেনদেন (জমা, উত্তোলন ও ট্রান্সফার):</div>
                <table style="width:100%; border-collapse:collapse; font-family:'Hind Siliguri',sans-serif;">
                    <thead>
                        <tr style="background:#f1f5f9; font-size:8px; color:#1e293b; font-weight:bold;">
                            <th style="border:1px solid #cbd5e1; padding:2px; width:22px;">SL</th>
                            <th style="border:1px solid #cbd5e1; padding:2px; text-align:left;">ব্যাংক হিসাব</th>
                            <th style="border:1px solid #cbd5e1; padding:2px; width:65px;">লেনদেনের ধরন</th>
                            <th style="border:1px solid #cbd5e1; padding:2px; width:50px;">ভাউচার/চেক</th>
                            <th style="border:1px solid #cbd5e1; padding:2px; text-align:left;">বিবরণ / নোট</th>
                            <th style="border:1px solid #cbd5e1; padding:2px; text-align:right; width:65px;">পরিমাণ (৳)</th>
                        </tr>
                    </thead>
                    <tbody>${bankRows}</tbody>
                </table>
            </div>
        `;
    }

    const page1HeaderHtml = `${masterHeaderHtml}${kpiMatrixHtml}${todayDepositCardsHtml}${bankBoxesHtml}${bankingTxnsHtml}`;

    const repeatHeaderHtml = renderRepeatHeader('দৈনিক ক্লোজিং ও অডিট রেজিস্টার', `তারিখ: ${dateTitle}`);

    // 6. Customer Collections Rows (Chronologically Ascending)
    const sortedCollections = [...customerCollections].sort((a, b) => {
        const dA = toDBDate(a.date || startDate), dB = toDBDate(b.date || startDate);
        if (dA !== dB) return dA.localeCompare(dB);
        const tA = a.createdAt?.toMillis?.() || (a.createdAt?.toDate?.()?.getTime?.()) || (new Date(a.createdAt || 0).getTime()) || 0;
        const tB = b.createdAt?.toMillis?.() || (b.createdAt?.toDate?.()?.getTime?.()) || (new Date(b.createdAt || 0).getTime()) || 0;
        if (tA !== tB) return tA - tB;
        return (a.customerAccountNo || '').localeCompare(b.customerAccountNo || '', undefined, { numeric: true });
    });

    const rowsArray = sortedCollections.map((c, idx) => {
        const isEven = idx % 2 === 0;
        const bgStyle = isEven ? 'background: #ffffff;' : 'background: #f8fafc;';
        const methodDisplay = c.receivedType === 'Cash' ? 'ক্যাশ' : (c.receivedFrom || c.receivedType || 'ব্যাংক');
        const dueVal = Number(c.currentDue || 0);

        const addressParts = [];
        if (c.customerAddress && c.customerAddress.trim() !== '') {
            addressParts.push(c.customerAddress.trim());
        }
        if (c.customerZone && c.customerZone.trim() !== '' && c.customerZone !== '-' && (!c.customerAddress || !c.customerAddress.toLowerCase().includes(c.customerZone.toLowerCase()))) {
            addressParts.push(c.customerZone.trim());
        }
        const fullAddressStr = addressParts.join(', ');

        return `
            <tr class="print-row-no-break" style="${bgStyle}">
                <td style="text-align:center; vertical-align:middle; border: 1px solid #cbd5e1; padding: 3px 2px; font-size: 9px; font-family: 'Inter', sans-serif;">${idx + 1}</td>
                <td style="text-align:center; vertical-align:middle; border: 1px solid #cbd5e1; padding: 3px 2px; font-size: 8.5px; font-family: 'Inter', sans-serif; white-space: nowrap;">${formatAppDate(c.date || startDate)}</td>
                <td style="text-align:center; vertical-align:middle; border: 1px solid #cbd5e1; padding: 3px 2px; font-size: 9px; font-weight: 800; font-family: 'Inter', monospace; color: #0284c7;">${escapeHTML(c.customerAccountNo || '-')}</td>
                <td style="text-align:left; vertical-align:middle; border: 1px solid #cbd5e1; padding: 3px 5px; font-size: 9.5px; font-family: 'Kalpurush', 'Hind Siliguri', sans-serif; line-height: 1.25; color: #0f172a;">
                    <div style="font-weight: 800; color: #0f172a;">
                        ${escapeHTML(c.customerName)}
                        ${c.customerPhone && c.customerPhone !== '-' ? `<span style="font-size:8px; font-weight: 600; color:#475569; margin-left:3px;">(${escapeHTML(c.customerPhone)})</span>` : ''}
                    </div>
                    ${fullAddressStr ? `<div style="font-size:8px; color:#475569; font-weight:600; margin-top:1px; line-height:1.15;">${escapeHTML(fullAddressStr)}</div>` : ''}
                </td>
                <td style="text-align:center; vertical-align:middle; border: 1px solid #cbd5e1; padding: 3px 2px; font-size: 8.5px; font-family: 'Inter', monospace; color: #475569;">${escapeHTML(c.voucherNo || '-')}</td>
                <td style="text-align:center; vertical-align:middle; border: 1px solid #cbd5e1; padding: 3px 4px; font-size: 8.5px; font-family: 'Hind Siliguri', sans-serif; font-weight: 600; color: #1e293b;">${escapeHTML(methodDisplay)}</td>
                <td style="text-align:right; vertical-align:middle; border: 1px solid #cbd5e1; padding: 3px 5px; font-size: 10px; font-weight: 900; color: #16a34a; font-family: 'Inter', sans-serif; white-space: nowrap;">৳ ${formatAmountWithComma(c.amount)}</td>
                <td style="text-align:right; vertical-align:middle; border: 1px solid #cbd5e1; padding: 3px 5px; font-size: 9.5px; font-weight: 800; color: ${dueVal > 0 ? '#dc2626' : '#16a34a'}; font-family: 'Inter', sans-serif; white-space: nowrap;">৳ ${formatAmountWithComma(Math.abs(dueVal))} ${dueVal < 0 ? '(Adv)' : ''}</td>
            </tr>
        `;
    });

    const tableColHeaderHtml = `
        <thead>
            <tr style="background: #f1f5f9; border-bottom: 2px solid #cbd5e1;">
                <th style="text-align: center; border: 1px solid #cbd5e1; padding: 4px 2px; font-size: 8.5px; font-weight: 900; color: #1e293b; width: 22px;">SL</th>
                <th style="text-align: center; border: 1px solid #cbd5e1; padding: 4px 2px; font-size: 8.5px; font-weight: 900; color: #1e293b; width: 55px;">তারিখ</th>
                <th style="text-align: center; border: 1px solid #cbd5e1; padding: 4px 2px; font-size: 8.5px; font-weight: 900; color: #1e293b; width: 42px;">A/C</th>
                <th style="text-align: left; border: 1px solid #cbd5e1; padding: 4px 5px; font-size: 9px; font-weight: 900; color: #1e293b;">কাস্টমার, ঠিকানা ও মোবাইল</th>
                <th style="text-align: center; border: 1px solid #cbd5e1; padding: 4px 2px; font-size: 8.5px; font-weight: 900; color: #1e293b; width: 45px;">ভাউচার</th>
                <th style="text-align: center; border: 1px solid #cbd5e1; padding: 4px 4px; font-size: 8.5px; font-weight: 900; color: #1e293b; width: 85px;">পদ্ধতি / ব্যাংক</th>
                <th style="text-align: right; border: 1px solid #cbd5e1; padding: 4px 5px; font-size: 9px; font-weight: 900; color: #1e293b; width: 75px;">জমা (৳)</th>
                <th style="text-align: right; border: 1px solid #cbd5e1; padding: 4px 5px; font-size: 9px; font-weight: 900; color: #1e293b; width: 80px;">অবশিষ্ট বকেয়া (৳)</th>
            </tr>
        </thead>
    `;

    const summaryHtml = `
        <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-top: 8px; page-break-inside: avoid; break-inside: avoid;">
            <div style="width: 55%; background: #f8fafc; border: 1px solid #cbd5e1; border-radius: 5px; padding: 5px 8px; font-family: 'Hind Siliguri', sans-serif;">
                <div style="font-size: 9.5px; font-weight: 700; color: #334155; margin-bottom: 2px;">
                    কথায়: <span style="font-weight: 900; color: #15803d;">${numberToBanglaWords(totalCollection)}</span>
                </div>
                <div style="display: flex; gap: 8px; font-size: 9px; color: #64748b; margin-top: 1px;">
                    <span>ক্যাশ জমা: <strong style="color: #0f172a;">৳ ${formatAmountWithComma(cashCollection)}</strong></span>
                    <span>ব্যাংক জমা: <strong style="color: #0284c7;">৳ ${formatAmountWithComma(bankCollection)}</strong></span>
                </div>
            </div>

            <div style="width: 38%; background: #f0fdf4; border: 1px solid #86efac; border-radius: 5px; padding: 5px 8px; font-family: 'Hind Siliguri', sans-serif;">
                <div style="display: flex; justify-content: space-between; font-size: 9.5px; margin-bottom: 1px;">
                    <span style="color: #166534; font-weight: 700;">মোট কাস্টমার জমা:</span>
                    <strong style="color: #0f172a; font-weight: 900;">${customerCollections.length} জন</strong>
                </div>
                <div style="display: flex; justify-content: space-between; font-size: 10.5px; border-top: 1px dashed #86efac; padding-top: 1px;">
                    <span style="color: #166534; font-weight: 900;">সর্বমোট আদায়:</span>
                    <strong style="color: #15803d; font-size: 12px; font-weight: 900;">৳ ${formatAmountWithComma(totalCollection)}</strong>
                </div>
            </div>
        </div>
    `;

    const signatureHtml = `
        <div class="signature-last-page-block" style="margin-top: 48px; page-break-inside: avoid; break-inside: avoid;">
            <div style="display: flex; justify-content: space-between; padding: 0 15px;">
                <div style="border-top: 1.2px dashed #64748b; width: 135px; text-align: center; font-size: 9.5px; font-weight: 700; color: #1e293b; padding-top: 5px; font-family: 'Anek Bangla', 'Hind Siliguri', sans-serif;">ক্যাশিয়ারের স্বাক্ষর</div>
                <div style="border-top: 1.2px dashed #64748b; width: 135px; text-align: center; font-size: 9.5px; font-weight: 700; color: #1e293b; padding-top: 5px; font-family: 'Anek Bangla', 'Hind Siliguri', sans-serif;">ম্যানেজারের স্বাক্ষর</div>
                <div style="border-top: 1.2px dashed #64748b; width: 135px; text-align: center; font-size: 9.5px; font-weight: 700; color: #1e293b; padding-top: 5px; font-family: 'Anek Bangla', 'Hind Siliguri', sans-serif;">স্বত্বাধিকারীর স্বাক্ষর</div>
            </div>
        </div>
    `;

    const cleanDateForFilename = (dStr) => {
        if (!dStr) return '';
        if (/^\d{4}-\d{2}-\d{2}$/.test(dStr)) {
            const [y, m, d] = dStr.split('-');
            return `${d}-${m}-${y}`;
        }
        return String(dStr).replace(/\//g, '-');
    };

    const pdfTitle = isSingleDay 
        ? `মা_মোটরস_দৈনিক_ক্লোজিং_${cleanDateForFilename(startDate)}`
        : `মা_মোটরস_সার্বিক_ক্লোজিং_${cleanDateForFilename(startDate)}_থেকে_${cleanDateForFilename(endDate)}`;

    const pagesHtml = await smartPaginatePrint({
        page1HeaderHtml,
        repeatHeaderHtml,
        tableColHeaderHtml,
        rowsArray,
        summaryHtml,
        signatureHtml,
        formattedDate: dateTitle
    });

    printViaIframe(pagesHtml, '', pdfTitle);
}

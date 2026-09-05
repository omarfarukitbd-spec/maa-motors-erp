import { SettingsDAO } from '../dao.js';
import { formatAmountWithComma, escapeHTML, renderPrintHeader, formatAppDate, safeRound, getTodayLocalDateString } from '../utils.js';
import { smartPaginatePrint, printViaIframe } from '../utils/smart-print-engine.js';
import { numberToBanglaWords } from '../utils/currency-words.js';
import Swal from 'sweetalert2';

/**
 * 1. Print Detailed Customer Collection Register (কাস্টমার আদায় রেজিস্টার শিট)
 */
export async function printCustomerCollectionRegister(summaryData) {
    const { customerCollections, totalCollection, cashCollection, bankCollection, startDate, endDate } = summaryData;

    if (!customerCollections || customerCollections.length === 0) {
        return Swal.fire({
            title: 'কোনো আদায়ের ডাটা নেই',
            text: 'নির্বাচিত সময়ে কোনো কাস্টমার আদায়ের রেকর্ড পাওয়া যায়নি।',
            icon: 'warning',
            customClass: { popup: '!bg-slate-900 !text-white !rounded-3xl border border-slate-700 font-bn' }
        });
    }

    const settings = await SettingsDAO.getAppSettings();
    const isSingleDay = startDate === endDate;
    const dateTitle = isSingleDay ? `তারিখ: ${formatAppDate(startDate)}` : `সময়কাল: ${formatAppDate(startDate)} থেকে ${formatAppDate(endDate)}`;
    const reportTitle = isSingleDay ? 'দৈনিক কাস্টমার আদায় রেজিস্টার' : 'কাস্টমার আদায় ও কালেকশন রেজিস্টার';

    const bankSummaryHtml = summaryData.bankBalances && summaryData.bankBalances.length > 0 ? `
        <div style="margin-bottom: 10px; background: #f8fafc; border: 1.5px solid #cbd5e1; border-radius: 8px; padding: 7px 10px; font-family: 'Hind Siliguri', sans-serif;">
            <div style="font-size: 10.5px; font-weight: 800; color: #0284c7; margin-bottom: 4px;">
                কোন ব্যাংকে কত টাকা আছে (Live Bank Balances):
            </div>
            <div style="display: flex; flex-wrap: wrap; gap: 10px; font-size: 9.5px; color: #334155;">
                <span>ক্যাশ: <strong style="color:#0f172a;">৳ ${formatAmountWithComma(cashCollection)}</strong></span>
                ${summaryData.bankBalances.map(b => `<span>• ${escapeHTML(b.name)}: <strong style="color:#0284c7;">৳ ${formatAmountWithComma(b.balance)}</strong></span>`).join('')}
                ${summaryData.totalLiquidFund ? `<span style="margin-left: auto; color:#15803d; font-weight:900;">মোট স্থিতি: ৳ ${formatAmountWithComma(summaryData.totalLiquidFund)}</span>` : ''}
            </div>
        </div>
    ` : '';

    const page1HeaderHtml = `
        ${renderPrintHeader(settings, {
            title: 'CUSTOMER COLLECTION REGISTER',
            subtitle: `${reportTitle} • ${dateTitle}`
        })}
        ${bankSummaryHtml}
    `;

    const repeatHeaderHtml = `
        <div style="display:flex; justify-content:space-between; align-items:flex-end; border-bottom:2px solid #0284c7; padding-bottom:4px; margin-bottom:8px;">
            <div style="font-size:14px; font-weight:900; color:#0f172a; font-family:'Inter',sans-serif;">CUSTOMER COLLECTION REGISTER <span style="font-size:10px; color:#475569; font-weight:normal;">(Continued)</span></div>
            <div style="font-size:10px; color:#475569; font-family:'Hind Siliguri',sans-serif;">${dateTitle}</div>
        </div>
    `;

    const rowsArray = customerCollections.map((c, idx) => {
        const isEven = idx % 2 === 0;
        const bgStyle = isEven ? 'background: #ffffff;' : 'background: #f8fafc;';
        const methodDisplay = c.receivedType === 'Cash' ? 'ক্যাশ' : (c.receivedFrom || c.receivedType);
        const dueVal = Number(c.currentDue || 0);

        return `
            <tr class="print-row-no-break" style="${bgStyle}">
                <td style="text-align:center; vertical-align:middle; border: 1px solid #cbd5e1; padding: 5px 3px; font-size: 10px; font-family: 'Inter', sans-serif;">${idx + 1}</td>
                <td style="text-align:center; vertical-align:middle; border: 1px solid #cbd5e1; padding: 5px 3px; font-size: 10px; font-family: 'Inter', monospace; color: #334155; white-space: nowrap;">${formatAppDate(c.date || startDate)}</td>
                <td style="text-align:center; vertical-align:middle; border: 1px solid #cbd5e1; padding: 5px 3px; font-size: 10px; font-weight: 800; font-family: 'Inter', monospace; color: #0284c7;">${escapeHTML(c.customerAccountNo || '-')}</td>
                <td style="text-align:left; vertical-align:middle; border: 1px solid #cbd5e1; padding: 5px 5px; font-size: 10.5px; font-family: 'Kalpurush', 'Hind Siliguri', sans-serif; line-height: 1.2; color: #0f172a;">
                    <strong>${escapeHTML(c.customerName)}</strong><br>
                    <span style="font-size:9px; color:#475569;">${escapeHTML(c.customerPhone || '-')}</span>
                </td>
                <td style="text-align:left; vertical-align:middle; border: 1px solid #cbd5e1; padding: 5px 5px; font-size: 9.5px; font-family: 'Kalpurush', 'Hind Siliguri', sans-serif; line-height: 1.15; color: #334155;">${escapeHTML(c.customerZone || '-')}</td>
                <td style="text-align:center; vertical-align:middle; border: 1px solid #cbd5e1; padding: 5px 3px; font-size: 9.5px; font-family: 'Inter', monospace; color: #475569;">${escapeHTML(c.voucherNo || '-')}</td>
                <td style="text-align:center; vertical-align:middle; border: 1px solid #cbd5e1; padding: 5px 3px; font-size: 9.5px; font-family: 'Hind Siliguri', sans-serif; font-weight: 600; color: #1e293b;">${escapeHTML(methodDisplay)}</td>
                <td style="text-align:right; vertical-align:middle; border: 1px solid #cbd5e1; padding: 5px 5px; font-size: 10.5px; font-weight: 900; color: #16a34a; font-family: 'Inter', sans-serif; white-space: nowrap;">৳ ${formatAmountWithComma(c.amount)}</td>
                <td style="text-align:right; vertical-align:middle; border: 1px solid #cbd5e1; padding: 5px 5px; font-size: 10px; font-weight: 800; color: ${dueVal > 0 ? '#dc2626' : '#16a34a'}; font-family: 'Inter', sans-serif; white-space: nowrap;">৳ ${formatAmountWithComma(Math.abs(dueVal))} ${dueVal < 0 ? '(Adv)' : ''}</td>
            </tr>
        `;
    });

    const tableColHeaderHtml = `
        <colgroup>
            <col style="width: 4%;">
            <col style="width: 11%;">
            <col style="width: 7%;">
            <col style="width: 24%;">
            <col style="width: 10%;">
            <col style="width: 8%;">
            <col style="width: 11%;">
            <col style="width: 12%;">
            <col style="width: 13%;">
        </colgroup>
        <thead>
            <tr style="background: #f1f5f9; border-bottom: 2px solid #cbd5e1;">
                <th style="text-align: center; border: 1px solid #cbd5e1; padding: 6px 2px; font-size: 10px; font-weight: 900; color: #1e293b; font-family: 'Hind Siliguri', sans-serif;">SL</th>
                <th style="text-align: center; border: 1px solid #cbd5e1; padding: 6px 2px; font-size: 10px; font-weight: 900; color: #1e293b; font-family: 'Hind Siliguri', sans-serif;">তারিখ</th>
                <th style="text-align: center; border: 1px solid #cbd5e1; padding: 6px 2px; font-size: 10px; font-weight: 900; color: #1e293b; font-family: 'Hind Siliguri', sans-serif;">A/C</th>
                <th style="text-align: left; border: 1px solid #cbd5e1; padding: 6px 5px; font-size: 10px; font-weight: 900; color: #1e293b; font-family: 'Hind Siliguri', sans-serif;">কাস্টমার ও মোবাইল</th>
                <th style="text-align: left; border: 1px solid #cbd5e1; padding: 6px 4px; font-size: 10px; font-weight: 900; color: #1e293b; font-family: 'Hind Siliguri', sans-serif;">জোন</th>
                <th style="text-align: center; border: 1px solid #cbd5e1; padding: 6px 2px; font-size: 10px; font-weight: 900; color: #1e293b; font-family: 'Hind Siliguri', sans-serif;">ভাউচার</th>
                <th style="text-align: center; border: 1px solid #cbd5e1; padding: 6px 2px; font-size: 10px; font-weight: 900; color: #1e293b; font-family: 'Hind Siliguri', sans-serif;">পেমেন্ট মেথড</th>
                <th style="text-align: right; border: 1px solid #cbd5e1; padding: 6px 4px; font-size: 10px; font-weight: 900; color: #1e293b; font-family: 'Hind Siliguri', sans-serif;">আদায় (৳)</th>
                <th style="text-align: right; border: 1px solid #cbd5e1; padding: 6px 4px; font-size: 10px; font-weight: 900; color: #1e293b; font-family: 'Hind Siliguri', sans-serif;">অবশিষ্ট বকেয়া (৳)</th>
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
                    <span>ক্যাশ আদায়: <strong style="color: #0f172a;">৳ ${formatAmountWithComma(cashCollection)}</strong></span>
                    <span>ব্যাংক আদায়: <strong style="color: #0f172a;">৳ ${formatAmountWithComma(bankCollection)}</strong></span>
                </div>
            </div>

            <div style="width: 38%; background: #f0fdf4; border: 1.5px solid #86efac; border-radius: 8px; padding: 8px 12px; font-family: 'Hind Siliguri', sans-serif;">
                <div style="display: flex; justify-content: space-between; font-size: 11px; margin-bottom: 4px;">
                    <span style="color: #166534; font-weight: 700;">মোট কাস্টমার:</span>
                    <strong style="color: #0f172a; font-weight: 900;">${customerCollections.length} জন</strong>
                </div>
                <div style="display: flex; justify-content: space-between; font-size: 12px; border-top: 1px dashed #86efac; padding-top: 4px;">
                    <span style="color: #166534; font-weight: 900;">সর্বমোট আদায়:</span>
                    <strong style="color: #15803d; font-size: 14px; font-weight: 900;">৳ ${formatAmountWithComma(totalCollection)}</strong>
                </div>
            </div>
        </div>
    `;

    const signatureHtml = `
        <div class="signature-last-page-block" style="margin-top: 40px; page-break-inside: avoid; break-inside: avoid;">
            <div style="display: flex; justify-content: space-between; padding: 0 20px;">
                <div style="border-top: 1.5px dashed #64748b; width: 140px; text-align: center; font-size: 10px; font-weight: 700; color: #334155; padding-top: 4px; font-family: 'Hind Siliguri', sans-serif;">
                    ক্যাশিয়ারের স্বাক্ষর
                </div>
                <div style="border-top: 1.5px dashed #64748b; width: 140px; text-align: center; font-size: 10px; font-weight: 700; color: #334155; padding-top: 4px; font-family: 'Hind Siliguri', sans-serif;">
                    ম্যানেজারের স্বাক্ষর
                </div>
                <div style="border-top: 1.5px dashed #64748b; width: 140px; text-align: center; font-size: 10px; font-weight: 700; color: #334155; padding-top: 4px; font-family: 'Hind Siliguri', sans-serif;">
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
 * 2. Print Day-by-Day Monthly Register (তারিখভিত্তিক মাসিক সারাংশ অডিট শিট)
 */
export async function printDayByDayMonthlyRegister(summaryData) {
    const { dayByDaySummary, totalSales, totalCollection, cashCollection, bankCollection, totalExpenses, netCashFlow, startDate, endDate } = summaryData;

    if (!dayByDaySummary || dayByDaySummary.length === 0) {
        return Swal.fire({ title: 'কোনো ডাটা নেই', text: 'নির্বাচিত সময়ে কোনো লেনদেনের রেকর্ড পাওয়া যায়নি।', icon: 'warning' });
    }

    const settings = await SettingsDAO.getAppSettings();
    const dateTitle = `সময়কাল: ${formatAppDate(startDate)} থেকে ${formatAppDate(endDate)}`;

    const page1HeaderHtml = renderPrintHeader(settings, {
        title: 'MONTHLY FINANCIAL SUMMARY & AUDIT',
        subtitle: `তারিখভিত্তিক মাসিক আর্থিক বিবরণী • ${dateTitle}`
    });

    const repeatHeaderHtml = `
        <div style="display:flex; justify-content:space-between; align-items:flex-end; border-bottom:2px solid #0284c7; padding-bottom:4px; margin-bottom:8px;">
            <div style="font-size:14px; font-weight:900; color:#0f172a; font-family:'Inter',sans-serif;">MONTHLY FINANCIAL AUDIT <span style="font-size:10px; color:#475569; font-weight:normal;">(Continued)</span></div>
            <div style="font-size:10px; color:#475569; font-family:'Hind Siliguri',sans-serif;">${dateTitle}</div>
        </div>
    `;

    const rowsArray = dayByDaySummary.map((d, idx) => {
        const isEven = idx % 2 === 0;
        const bgStyle = isEven ? 'background: #ffffff;' : 'background: #f8fafc;';

        return `
            <tr class="print-row-no-break" style="${bgStyle}">
                <td style="text-align:center; vertical-align:middle; border: 1px solid #cbd5e1; padding: 6px 4px; font-size: 10.5px; font-family: 'Inter', sans-serif;">${formatAppDate(d.date)}</td>
                <td style="text-align:center; vertical-align:middle; border: 1px solid #cbd5e1; padding: 6px 4px; font-size: 10.5px; font-weight: 700; font-family: 'Inter', sans-serif; color: #0284c7;">${d.customerCount} জন</td>
                <td style="text-align:right; vertical-align:middle; border: 1px solid #cbd5e1; padding: 6px 6px; font-size: 10.5px; font-weight: 700; color: #0f172a; font-family: 'Inter', sans-serif;">৳ ${formatAmountWithComma(d.sales)}</td>
                <td style="text-align:right; vertical-align:middle; border: 1px solid #cbd5e1; padding: 6px 6px; font-size: 10.5px; font-weight: 700; color: #16a34a; font-family: 'Inter', sans-serif;">৳ ${formatAmountWithComma(d.cashPaid)}</td>
                <td style="text-align:right; vertical-align:middle; border: 1px solid #cbd5e1; padding: 6px 6px; font-size: 10.5px; font-weight: 700; color: #2563eb; font-family: 'Inter', sans-serif;">৳ ${formatAmountWithComma(d.bankPaid)}</td>
                <td style="text-align:right; vertical-align:middle; border: 1px solid #cbd5e1; padding: 6px 6px; font-size: 11px; font-weight: 900; color: #15803d; font-family: 'Inter', sans-serif; background: #f0fdf4;">৳ ${formatAmountWithComma(d.totalPaid)}</td>
                <td style="text-align:right; vertical-align:middle; border: 1px solid #cbd5e1; padding: 6px 6px; font-size: 10.5px; font-weight: 700; color: #dc2626; font-family: 'Inter', sans-serif;">৳ ${formatAmountWithComma(d.expenses)}</td>
                <td style="text-align:right; vertical-align:middle; border: 1px solid #cbd5e1; padding: 6px 6px; font-size: 11px; font-weight: 900; color: ${d.netCash >= 0 ? '#15803d' : '#dc2626'}; font-family: 'Inter', sans-serif;">৳ ${formatAmountWithComma(d.netCash)}</td>
            </tr>
        `;
    });

    const tableColHeaderHtml = `
        <colgroup>
            <col style="width: 12%;">
            <col style="width: 9%;">
            <col style="width: 13%;">
            <col style="width: 13%;">
            <col style="width: 13%;">
            <col style="width: 14%;">
            <col style="width: 13%;">
            <col style="width: 13%;">
        </colgroup>
        <thead>
            <tr style="background: #f1f5f9; border-bottom: 2px solid #cbd5e1;">
                <th style="text-align: center; border: 1px solid #cbd5e1; padding: 7px 4px; font-size: 10px; font-weight: 900; color: #1e293b; font-family: 'Hind Siliguri', sans-serif;">তারিখ</th>
                <th style="text-align: center; border: 1px solid #cbd5e1; padding: 7px 4px; font-size: 10px; font-weight: 900; color: #1e293b; font-family: 'Hind Siliguri', sans-serif;">খদ্দের সংখ্যা</th>
                <th style="text-align: right; border: 1px solid #cbd5e1; padding: 7px 4px; font-size: 10px; font-weight: 900; color: #1e293b; font-family: 'Hind Siliguri', sans-serif;">মোট বিক্রয় (৳)</th>
                <th style="text-align: right; border: 1px solid #cbd5e1; padding: 7px 4px; font-size: 10px; font-weight: 900; color: #1e293b; font-family: 'Hind Siliguri', sans-serif;">ক্যাশ আদায় (৳)</th>
                <th style="text-align: right; border: 1px solid #cbd5e1; padding: 7px 4px; font-size: 10px; font-weight: 900; color: #1e293b; font-family: 'Hind Siliguri', sans-serif;">ব্যাংক আদায় (৳)</th>
                <th style="text-align: right; border: 1px solid #cbd5e1; padding: 7px 4px; font-size: 10px; font-weight: 900; color: #1e293b; font-family: 'Hind Siliguri', sans-serif;">মোট আদায় (৳)</th>
                <th style="text-align: right; border: 1px solid #cbd5e1; padding: 7px 4px; font-size: 10px; font-weight: 900; color: #1e293b; font-family: 'Hind Siliguri', sans-serif;">মোট খরচ (৳)</th>
                <th style="text-align: right; border: 1px solid #cbd5e1; padding: 7px 4px; font-size: 10px; font-weight: 900; color: #1e293b; font-family: 'Hind Siliguri', sans-serif;">নিট ক্যাশ (৳)</th>
            </tr>
        </thead>
    `;

    const summaryHtml = `
        <div style="display: flex; justify-content: flex-end; margin-top: 14px; page-break-inside: avoid; break-inside: avoid;">
            <div style="width: 320px; background: #f8fafc; border: 1.5px solid #cbd5e1; border-radius: 10px; padding: 10px 14px; font-family: 'Hind Siliguri', sans-serif;">
                <div style="display: flex; justify-content: space-between; font-size: 11px; margin-bottom: 4px;">
                    <span style="color: #64748b; font-weight: 700;">মাসের মোট বিক্রয়:</span>
                    <strong style="color: #0f172a; font-weight: 800;">৳ ${formatAmountWithComma(totalSales)}</strong>
                </div>
                <div style="display: flex; justify-content: space-between; font-size: 11px; margin-bottom: 4px;">
                    <span style="color: #64748b; font-weight: 700;">মাসের মোট আদায়:</span>
                    <strong style="color: #15803d; font-weight: 900;">৳ ${formatAmountWithComma(totalCollection)}</strong>
                </div>
                <div style="display: flex; justify-content: space-between; font-size: 11px; margin-bottom: 4px;">
                    <span style="color: #64748b; font-weight: 700;">মাসের মোট খরচ:</span>
                    <strong style="color: #dc2626; font-weight: 800;">৳ ${formatAmountWithComma(totalExpenses)}</strong>
                </div>
                <div style="display: flex; justify-content: space-between; font-size: 12.5px; border-top: 1.5px solid #cbd5e1; padding-top: 6px; margin-top: 4px;">
                    <span style="color: #0f172a; font-weight: 900;">মাসের নিট ক্যাশ স্থিতি:</span>
                    <strong style="color: ${netCashFlow >= 0 ? '#15803d' : '#dc2626'}; font-size: 14px; font-weight: 900;">৳ ${formatAmountWithComma(netCashFlow)}</strong>
                </div>
            </div>
        </div>
    `;

    const signatureHtml = `
        <div class="signature-last-page-block" style="margin-top: 40px; page-break-inside: avoid; break-inside: avoid;">
            <div style="display: flex; justify-content: space-between; padding: 0 20px;">
                <div style="border-top: 1.5px dashed #64748b; width: 140px; text-align: center; font-size: 10px; font-weight: 700; color: #334155; padding-top: 4px; font-family: 'Hind Siliguri', sans-serif;">
                    হিসাবরক্ষকের স্বাক্ষর
                </div>
                <div style="border-top: 1.5px dashed #64748b; width: 140px; text-align: center; font-size: 10px; font-weight: 700; color: #334155; padding-top: 4px; font-family: 'Hind Siliguri', sans-serif;">
                    ম্যানেজারের স্বাক্ষর
                </div>
                <div style="border-top: 1.5px dashed #64748b; width: 140px; text-align: center; font-size: 10px; font-weight: 700; color: #334155; padding-top: 4px; font-family: 'Hind Siliguri', sans-serif;">
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

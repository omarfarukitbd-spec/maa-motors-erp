/**
 * Dubai Procurement - Bangladesh Landed Expenses Corporate Print Engine
 * Generates an executive A4 printable register voucher for Page 0002 matching MAA MOTORS ERP standards.
 */

import {
    formatAmountWithComma,
    escapeHTML,
    formatAppDate,
    getTodayLocalDateString,
    renderPrintHeader,
    renderRepeatHeader,
    numberToBanglaWords
} from '../utils.js';
import { SettingsDAO } from '../dao.js';
import { smartPaginatePrint, printViaIframe } from '../utils/smart-print-engine.js';
import { calculateBDExpenseSummary } from './dubai-bd-expense-calc.js';
import { renderNothiPrintSectionBanner, resolveSectionBannerConfig } from './dubai-section-banner.js';

export async function printDubaiBDExpenseBook(consignment, entries = []) {
    let settings = {};
    try {
        settings = (await SettingsDAO.getAppSettings()) || {};
    } catch (e) {
        console.error('Settings fetch error in BD expense print:', e);
    }

    const bannerCfg = resolveSectionBannerConfig(consignment, 'bd-expense');
    const title = `Bangladesh_Expenses_${bannerCfg.title || 'Page_0002'}`;
    const summary = calculateBDExpenseSummary(consignment, entries);

    const extraCss = `
        .num-font {
            font-family: 'Inter', 'Segoe UI', Arial, sans-serif !important;
            font-feature-settings: 'tnum' 1;
            font-variant-numeric: tabular-nums;
        }
        .bd-expense-table {
            width: 100% !important;
            border-collapse: collapse !important;
            border: 1.5px solid #334155 !important;
        }
        .bd-expense-table th {
            border: 1px solid #334155 !important;
            background: #1e293b !important;
            color: #ffffff !important;
            padding: 3.5px 4px !important;
            font-size: 8px !important;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
        }
        .bd-expense-table td {
            border: 1px solid #94a3b8 !important;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
        }
    `;

    const parts = generateBDExpensePaginationParts(consignment, entries, summary, settings, bannerCfg);
    const paginatedHtml = await smartPaginatePrint({
        ...parts,
        extraCss,
        tableClass: 'bd-expense-table',
        tableStyle: 'width:100%;border-collapse:collapse;border:1.5px solid #334155;',
        sheetPadding: '5mm 9mm',
        formattedDate: formatAppDate(getTodayLocalDateString())
    });

    await printViaIframe(paginatedHtml, extraCss, title);
}

function generateBDExpensePaginationParts(consignment, entries, summary, settings, bannerCfg) {
    const bfFormatted = formatAmountWithComma(summary.bfAmount);
    const runningFormatted = formatAmountWithComma(summary.runningTotal);
    const grandFormatted = formatAmountWithComma(summary.grandTotal);
    const grandWords = numberToBanglaWords(Math.round(summary.grandTotal || 0));

    const bfDateRange = (summary.bfStartDate && summary.bfEndDate)
        ? `${formatAppDate(summary.bfStartDate)} - ${formatAppDate(summary.bfEndDate)}`
        : (summary.bfStartDate ? formatAppDate(summary.bfStartDate) : 'প্রারম্ভিক ব্যালেন্স');

    const rowsArray = [];
    // Row 0: B/F Row
    rowsArray.push(`
        <tr style="background: #f0f9ff; font-weight: bold;">
            <td style="padding: 2.5px 4px; text-align: center; font-size: 8px; color: #0284c7;">০</td>
            <td style="padding: 2.5px 4px; text-align: center; font-size: 8px; color: #0369a1;">${escapeHTML(bfDateRange)}</td>
            <td style="padding: 2.5px 6px; font-size: 8.5px; color: #0369a1;">B/F (পূর্ববর্তী স্থানান্তরিত কিউমুলেটিভ ব্যালেন্স)</td>
            <td style="padding: 2.5px 4px; font-size: 7.5px; color: #0284c7;">প্রারম্ভিক ব্যালেন্স</td>
            <td style="padding: 2.5px 4px; text-align: center; font-size: 8px; color: #64748b;">—</td>
            <td style="padding: 2.5px 6px; text-align: right; font-size: 8.5px; font-weight: 800; color: #0284c7;" class="num-font">৳ ${bfFormatted}</td>
            <td style="padding: 2.5px 4px; text-align: center; font-size: 7.5px; color: #0284c7;">সাবেক ব্যালেন্স শুরু</td>
        </tr>
    `);

    entries.forEach((item, idx) => {
        const amtStr = formatAmountWithComma(item.amount);
        const appDate = formatAppDate(item.date);
        const bgStyle = idx % 2 === 1 ? 'background: #f8fafc;' : 'background: #ffffff;';

        rowsArray.push(`
            <tr style="${bgStyle}">
                <td style="padding: 2.5px 4px; text-align: center; font-size: 8px; color: #64748b; font-weight: bold;">${idx + 1}</td>
                <td style="padding: 2.5px 4px; text-align: center; font-size: 8px; font-weight: 600; white-space: nowrap;">${appDate}</td>
                <td style="padding: 2.5px 6px; font-size: 8.5px; font-weight: 600; color: #0f172a;">${escapeHTML(item.description || item.vendor || '—')}</td>
                <td style="padding: 2.5px 4px; font-size: 7.5px; color: #475569;">${escapeHTML(item.category || '—')}</td>
                <td style="padding: 2.5px 4px; text-align: center; font-size: 8px; color: #64748b;">${escapeHTML(item.memo || '—')}</td>
                <td style="padding: 2.5px 6px; text-align: right; font-size: 8.5px; font-weight: 700; color: #b91c1c;" class="num-font">৳ ${amtStr}</td>
                <td style="padding: 2.5px 4px; text-align: center; font-size: 7.5px; font-weight: 600; color: #047857;">${escapeHTML(item.status || 'চূড়ান্ত পরিশোধিত')}</td>
            </tr>
        `);
    });

    const page1HeaderHtml = `
        ${renderPrintHeader(settings, {
            title: bannerCfg.motherTitle,
            pageLabel: 'রেজিস্টার খাতা পাতা',
            pageNo: bannerCfg.pageNo || '০০০২'
        })}
        ${renderNothiPrintSectionBanner(consignment, 'bd-expense')}
    `;

    const repeatHeaderHtml = renderRepeatHeader(
        bannerCfg.motherTitle || 'বাংলাদেশ ল্যান্ডেড ও আমদানি খরচ রেজিস্টার',
        `রেজিস্টার খাতা পাতা: ${bannerCfg.pageNo || '০০০২'}`
    );

    const page1ExtraHtml = `
        <div style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 4px; margin-bottom: 4px;">
            <div style="background: #f0f9ff; border: 1px solid #7dd3fc; border-radius: 4px; padding: 3px 6px; text-align: center;">
                <div style="font-size: 7px; font-weight: 700; color: #0369a1;">১. সাবেক ব্যালেন্স (B/F)</div>
                <div style="font-size: 10px; font-weight: 900; color: #0284c7;" class="num-font">৳ ${bfFormatted}</div>
                <div style="font-size: 6.5px; color: #64748b;">${escapeHTML(bfDateRange)}</div>
            </div>
            <div style="background: #fef2f2; border: 1px solid #fca5a5; border-radius: 4px; padding: 3px 6px; text-align: center;">
                <div style="font-size: 7px; font-weight: 700; color: #991b1b;">২. রানিং খাতার খরচ (${summary.count} কিস্তি)</div>
                <div style="font-size: 10px; font-weight: 900; color: #dc2626;" class="num-font">৳ ${runningFormatted}</div>
                <div style="font-size: 6.5px; color: #64748b;">${escapeHTML(summary.runningDates || 'রানিং এন্ট্রি')}</div>
            </div>
            <div style="background: #fffbeb; border: 1.5px solid #f59e0b; border-radius: 4px; padding: 3px 6px; text-align: center;">
                <div style="font-size: 7px; font-weight: 800; color: #92400e;">৩. সর্বমোট বাংলাদেশ খরচ</div>
                <div style="font-size: 11px; font-weight: 900; color: #b45309;" class="num-font">৳ ${grandFormatted}</div>
                <div style="font-size: 6.5px; color: #78350f;">${escapeHTML(summary.overallDates || 'সর্বমোট সেশন')}</div>
            </div>
        </div>
    `;

    const tableColHeaderHtml = `
        <thead>
            <tr>
                <th style="width: 20px;">নং</th>
                <th style="width: 60px;">তারিখ</th>
                <th style="width: 170px; text-align: left;">বিবরণ / বিক্রেতা / মারফত</th>
                <th style="width: 90px; text-align: left;">ক্যাটাগরি</th>
                <th style="width: 55px;">মেমো / চালান</th>
                <th style="width: 90px; text-align: right;">টাকা (BDT)</th>
                <th style="width: 65px;">স্ট্যাটাস</th>
            </tr>
        </thead>
    `;

    const tableFooterRowsHtml = `
        <tr style="background: #f8fafc; font-weight: bold; border-top: 1.5px solid #64748b;">
            <td colspan="5" style="padding: 3px 6px; text-align: right; font-size: 8.5px; color: #334155;">চলমান খাতার উপ-মোট (${summary.count} টি রানিং খরচ):</td>
            <td style="padding: 3px 6px; text-align: right; font-size: 9px; font-weight: 800; color: #dc2626;" class="num-font">৳ ${runningFormatted}</td>
            <td style="padding: 3px 4px; text-align: center; font-size: 7.5px; color: #475569;">উপ-মোট</td>
        </tr>
        <tr style="background: #fffbeb; font-weight: 900; border-top: 1.5px solid #d97706; border-bottom: 2px solid #d97706;">
            <td colspan="5" style="padding: 4px 6px; text-align: right; font-size: 9.5px; color: #92400e;">সর্বমোট বাংলাদেশ খরচ (B/F সাবেক + রানিং খাতা):</td>
            <td style="padding: 4px 6px; text-align: right; font-size: 10px; font-weight: 900; color: #b45309;" class="num-font">৳ ${grandFormatted}</td>
            <td style="padding: 4px 4px; text-align: center; font-size: 8px; color: #b45309;">সর্বমোট</td>
        </tr>
    `;

    const summaryHtml = `
        <div class="page-break-avoid" style="margin-top: 5px; background: #f8fafc; border: 1px solid #cbd5e1; border-radius: 4px; padding: 5px 8px;">
            <div style="font-size: 8.5px; color: #334155; margin-bottom: 3px;">
                <strong>কথায়:</strong> <span style="color: #92400e; font-weight: bold;">${escapeHTML(grandWords)} টাকা মাত্র</span>
            </div>
            <div style="display: flex; justify-content: space-between; align-items: center; border-top: 1px dashed #cbd5e1; padding-top: 3px; font-size: 7.5px; color: #475569;">
                <span>সাবেক (B/F): <strong class="num-font">৳ ${bfFormatted}</strong> + রানিং (${summary.count} টি): <strong class="num-font">৳ ${runningFormatted}</strong> = <strong style="color: #b45309;" class="num-font">৳ ${grandFormatted}</strong></span>
                <span style="color: #6d28d9; font-weight: 800;">সমন্বিত ৪-স্তর হিসাবের জন্য পাতা ০০০৬ দেখুন</span>
            </div>
        </div>
    `;

    const signatureHtml = `
        <div class="print-sig-block" style="margin-top: 30px; padding-top: 6px; page-break-inside: avoid; break-inside: avoid;">
            <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; text-align: center;">
                <div style="text-align: center; border-top: 1.2px dashed #64748b; padding-top: 6px; font-size: 8px; color: #1e293b; font-weight: 700; font-family: 'Anek Bangla', sans-serif;">
                    প্রস্তুতকারক (হিসাব বিভাগ)
                </div>
                <div style="text-align: center; border-top: 1.2px dashed #64748b; padding-top: 6px; font-size: 8px; color: #1e293b; font-weight: 700; font-family: 'Anek Bangla', sans-serif;">
                    অভ্যন্তরীণ নিরীক্ষক (অফিস ইনচার্জ)
                </div>
                <div style="text-align: center; border-top: 1.2px dashed #64748b; padding-top: 6px; font-size: 8px; color: #1e293b; font-weight: 700; font-family: 'Anek Bangla', sans-serif;">
                    পার্টনার অনুমোদন
                </div>
                <div style="text-align: center; border-top: 1.2px dashed #64748b; padding-top: 6px; font-size: 8px; color: #1e293b; font-weight: 700; font-family: 'Anek Bangla', sans-serif;">
                    মোহাম্মদ এমরান (স্বত্বাধিকারী)
                </div>
            </div>
        </div>
    `;

    return {
        rowsArray,
        page1HeaderHtml,
        repeatHeaderHtml,
        page1ExtraHtml,
        tableColHeaderHtml,
        tableFooterRowsHtml,
        summaryHtml,
        signatureHtml
    };
}

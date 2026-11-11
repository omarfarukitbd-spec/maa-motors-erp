/**
 * Dubai Procurement - Container L/C Margin & Bank Expense Corporate Print Engine
 * Generates an executive A4 printable Container Sub-Ledger Register for Page 0003.
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
import { calculateLCSummary, calculateContainerLCTotals, isContainerClosed } from './dubai-lc-calc.js';
import { renderNothiPrintSectionBanner, resolveSectionBannerConfig } from './dubai-section-banner.js';

export async function printDubaiLCBook(consignment, lcBills = []) {
    let settings = {};
    try {
        settings = (await SettingsDAO.getAppSettings()) || {};
    } catch (e) {
        console.error('Settings fetch error in L/C print:', e);
    }

    const bannerCfg = resolveSectionBannerConfig(consignment, 'lc-bills');
    const title = `Container_LC_Register_${bannerCfg.title || 'Page_0003'}`;
    const summary = calculateLCSummary(consignment, lcBills);

    const extraCss = `
        .num-font {
            font-family: 'Inter', 'Segoe UI', Arial, sans-serif !important;
            font-feature-settings: 'tnum' 1;
            font-variant-numeric: tabular-nums;
        }
        .lc-table {
            width: 100% !important;
            border-collapse: collapse !important;
            border: 1.5px solid #334155 !important;
        }
        .lc-table th {
            border: 1px solid #334155 !important;
            background: #1e293b !important;
            color: #ffffff !important;
            padding: 4px 5px !important;
            font-size: 8.5px !important;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
        }
        .lc-table td {
            border: 1px solid #94a3b8 !important;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
        }
    `;

    const parts = generateLCPaginationParts(consignment, lcBills, summary, settings, bannerCfg);
    const paginatedHtml = await smartPaginatePrint({
        ...parts,
        extraCss,
        tableClass: 'lc-table',
        tableStyle: 'width:100%;border-collapse:collapse;border:1.5px solid #334155;',
        sheetPadding: '7mm 10mm',
        formattedDate: formatAppDate(getTodayLocalDateString())
    });

    await printViaIframe(paginatedHtml, extraCss, title);
}

function generateLCPaginationParts(consignment, lcBills, summary, settings, bannerCfg) {
    const totalUSDFormatted = formatAmountWithComma(summary.totalUSD);
    const totalBDTFormatted = formatAmountWithComma(summary.totalBDT);
    const amountInWords = numberToBanglaWords(Math.round(summary.totalBDT || 0));

    const rowsArray = lcBills.map((container, cIdx) => {
        const payments = Array.isArray(container.payments) && container.payments.length > 0
            ? container.payments
            : [{ date: container.date, description: 'মূল এলসি পেমেন্ট', amountUSD: container.totalUSD || 0, amountBDT: container.totalBDT || 0 }];

        const cTotals = calculateContainerLCTotals(payments);
        const isClosed = isContainerClosed(container);
        const deliveryDisplay = container.deliveryDate
            ? formatAppDate(container.deliveryDate)
            : (isClosed ? 'সম্পন্ন' : 'অপেক্ষমাণ');
        const deliveryColor = container.deliveryDate
            ? '#047857'
            : (isClosed ? '#059669' : '#b45309');
        const statusPillHtml = isClosed
            ? '<span style="background: #dcfce7; color: #166534; border: 1px solid #86efac; border-radius: 3px; padding: 1px 5px; font-size: 7px; font-weight: 800; display: inline-block;">শেষ</span>'
            : '<span style="background: #fef3c7; color: #92400e; border: 1px solid #fcd34d; border-radius: 3px; padding: 1px 5px; font-size: 7px; font-weight: 800; display: inline-block;">চলমান</span>';
        const bgGroup = cIdx % 2 === 0 ? '#ffffff' : '#f8fafc';

        const lineRows = payments.map((pay, pIdx) => {
            const isFirst = pIdx === 0;
            const usdText = Number(pay.amountUSD) > 0 ? `$ ${formatAmountWithComma(pay.amountUSD)}` : '—';
            const bdtText = `৳ ${formatAmountWithComma(pay.amountBDT)}`;

            return `
                <tr style="background: ${bgGroup};">
                    ${isFirst ? `<td rowspan="${payments.length}" style="padding: 4px; text-align: center; font-size: 9px; font-weight: 800; color: #0369a1; vertical-align: middle;">${container.containerNo || cIdx + 1}</td>` : ''}
                    <td style="padding: 3.5px 5px; text-align: center; font-size: 8px; font-weight: 600; white-space: nowrap;">${formatAppDate(pay.date)}</td>
                    ${isFirst ? `
                    <td rowspan="${payments.length}" style="padding: 4px 6px; font-size: 8.5px; font-weight: 700; color: #0f172a; vertical-align: middle;">
                        <div>${escapeHTML(container.company || '—')}</div>
                        <div style="font-size: 7.5px; color: #0369a1; font-weight: 800;">এলসি নং: ${escapeHTML(container.lcNo || '—')}</div>
                    </td>` : ''}
                    <td style="padding: 3.5px 6px; font-size: 8px; color: #334155;">${escapeHTML(pay.description || 'এলসি পেমেন্ট')}</td>
                    <td style="padding: 3.5px 6px; text-align: right; font-size: 8.5px; font-weight: 700; color: #0f766e;" class="num-font">${usdText}</td>
                    <td style="padding: 3.5px 6px; text-align: right; font-size: 8.5px; font-weight: 700; color: #b91c1c;" class="num-font">${bdtText}</td>
                    ${isFirst ? `<td rowspan="${payments.length}" style="padding: 4px; text-align: center; font-size: 7.5px; font-weight: 700; color: ${deliveryColor}; vertical-align: middle;">${escapeHTML(deliveryDisplay)}</td>` : ''}
                </tr>
            `;
        }).join('');

        const subTotalRow = `
            <tr style="background: ${isClosed ? '#f1f5f9' : '#fffbeb'}; border-bottom: 1.8px solid #475569;">
                <td colspan="4" style="padding: 3px 6px; text-align: right; font-size: 8px; font-weight: 800; color: #334155;">
                    ${container.containerNo || cIdx + 1} নং কন্টেইনার এলসি সর্বমোট:
                </td>
                <td style="padding: 3px 6px; text-align: right; font-size: 8.5px; font-weight: 800; color: #0f766e;" class="num-font">${cTotals.totalUSD > 0 ? `$ ${formatAmountWithComma(cTotals.totalUSD)}` : '—'}</td>
                <td style="padding: 3px 6px; text-align: right; font-size: 9px; font-weight: 900; color: #b91c1c;" class="num-font">৳ ${formatAmountWithComma(cTotals.totalBDT)}</td>
                <td style="padding: 3px; text-align: center;">${statusPillHtml}</td>
            </tr>
        `;

        return { html: lineRows + subTotalRow, isGroup: true };
    });

    const page1HeaderHtml = `
        ${renderPrintHeader(settings, {
            title: bannerCfg.motherTitle,
            pageLabel: 'রেজিস্টার খাতা পাতা',
            pageNo: bannerCfg.pageNo || '০০০৩'
        })}
        ${renderNothiPrintSectionBanner(consignment, 'lc-bills')}
    `;

    const repeatHeaderHtml = renderRepeatHeader(
        bannerCfg.motherTitle || 'কন্টেইনার এলসি ও ব্যাংক খরচ রেজিস্টার',
        `রেজিস্টার খাতা পাতা: ${bannerCfg.pageNo || '০০০৩'}`
    );

    const page1ExtraHtml = `
        <div style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 5px; margin-bottom: 6px;">
            <div style="background: #f0f9ff; border: 1px solid #7dd3fc; border-radius: 4px; padding: 4px 6px; text-align: center;">
                <div style="font-size: 7.5px; font-weight: 700; color: #0369a1;">১. মোট কন্টেইনার সংখ্যা</div>
                <div style="font-size: 11px; font-weight: 900; color: #0284c7;">${summary.containerCount} টি কন্টেইনার</div>
                <div style="font-size: 6.5px; font-weight: 700;">
                    <span style="color: #047857;">সমাপ্ত (শেষ): ${summary.closedCount} টি</span> |
                    <span style="color: #b45309;">চলমান (বাকি): ${summary.openCount} টি</span>
                </div>
            </div>
            <div style="background: #f0fdf4; border: 1px solid #86efac; border-radius: 4px; padding: 4px 6px; text-align: center;">
                <div style="font-size: 7.5px; font-weight: 700; color: #15803d;">২. সর্বমোট বৈদেশিক মুদ্রা (ডলার)</div>
                <div style="font-size: 11px; font-weight: 900; color: #059669;" class="num-font">$ ${totalUSDFormatted} ডলার</div>
                <div style="font-size: 6.5px; color: #475569;">সমাপ্ত: $ ${formatAmountWithComma(summary.closedTotalUSD)} | চলমান: $ ${formatAmountWithComma(summary.openTotalUSD)}</div>
            </div>
            <div style="background: #fef2f2; border: 1.5px solid #ef4444; border-radius: 4px; padding: 4px 6px; text-align: center;">
                <div style="font-size: 7.5px; font-weight: 800; color: #991b1b;">৩. সর্বমোট এলসি মার্জিন ও ব্যাংক খরচ</div>
                <div style="font-size: 11.5px; font-weight: 900; color: #b91c1c;" class="num-font">৳ ${totalBDTFormatted}</div>
                <div style="font-size: 6.5px; color: #7f1d1d;">সমাপ্ত: ৳ ${formatAmountWithComma(summary.closedTotalBDT)} | চলমান: ৳ ${formatAmountWithComma(summary.openTotalBDT)}</div>
            </div>
        </div>
    `;

    const tableColHeaderHtml = `
        <thead>
            <tr>
                <th style="width: 24px;">নং</th>
                <th style="width: 60px;">তারিখ</th>
                <th style="width: 120px; text-align: left;">কোম্পানি ও এলসি নং</th>
                <th style="width: 140px; text-align: left;">খরচের বিবরণ</th>
                <th style="width: 68px; text-align: right;">ডলার (USD)</th>
                <th style="width: 85px; text-align: right;">টাকা (BDT)</th>
                <th style="width: 65px;">স্ট্যাটাস / ডেলিভারি</th>
            </tr>
        </thead>
    `;

    const tableFooterRowsHtml = `
        <tr style="background: #0f172a; color: #ffffff; font-weight: 900;">
            <td colspan="4" style="padding: 5px 6px; text-align: right; font-size: 9px; color: #f8fafc;">সর্বমোট কন্টেইনার এলসি ও ব্যাংক খরচ (১ হতে ${summary.containerCount} নং):</td>
            <td style="padding: 5px 6px; text-align: right; font-size: 9.5px; color: #5eead4;" class="num-font">$ ${totalUSDFormatted}</td>
            <td style="padding: 5px 6px; text-align: right; font-size: 10px; color: #fca5a5;" class="num-font">৳ ${totalBDTFormatted}</td>
            <td style="padding: 5px 4px; text-align: center; font-size: 8px; color: #f8fafc;">সর্বমোট</td>
        </tr>
    `;

    const summaryHtml = `
        <div class="page-break-avoid" style="margin-top: 6px; background: #f8fafc; border: 1px solid #cbd5e1; border-radius: 4px; padding: 5px 8px;">
            <div style="font-size: 8.5px; color: #334155; margin-bottom: 3px;">
                <strong>কথায়:</strong> <span style="color: #b91c1c; font-weight: bold;">${escapeHTML(amountInWords)} টাকা মাত্র</span>
            </div>
            <div style="display: flex; justify-content: space-between; align-items: center; border-top: 1px dashed #cbd5e1; padding-top: 3px; font-size: 7.5px; color: #475569;">
                <span>সমাপ্ত (${summary.closedCount}টি): <strong class="num-font">৳ ${formatAmountWithComma(summary.closedTotalBDT)}</strong> · চলমান (${summary.openCount}টি): <strong class="num-font">৳ ${formatAmountWithComma(summary.openTotalBDT)}</strong> · মোট কিস্তি: <strong class="num-font">${summary.totalPaymentsCount} টি</strong></span>
                <span style="color: #6d28d9; font-weight: 800;">সমন্বিত ৪-স্তর হিসাবের জন্য পাতা ০০০৬ দেখুন</span>
            </div>
        </div>
    `;

    const signatureHtml = `
        <div class="print-sig-block" style="margin-top: 30px; padding-top: 6px; page-break-inside: avoid; break-inside: avoid;">
            <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; text-align: center;">
                <div style="text-align: center; border-top: 1.2px dashed #64748b; padding-top: 6px; font-size: 8px; color: #1e293b; font-weight: 700;">
                    প্রস্তুতকারক (হিসাব বিভাগ)
                </div>
                <div style="text-align: center; border-top: 1.2px dashed #64748b; padding-top: 6px; font-size: 8px; color: #1e293b; font-weight: 700;">
                    এলসি নিরীক্ষক (ব্যাংক ইনচার্জ)
                </div>
                <div style="text-align: center; border-top: 1.2px dashed #64748b; padding-top: 6px; font-size: 8px; color: #1e293b; font-weight: 700;">
                    পার্টনার অনুমোদন
                </div>
                <div style="text-align: center; border-top: 1.2px dashed #64748b; padding-top: 6px; font-size: 8px; color: #1e293b; font-weight: 700;">
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

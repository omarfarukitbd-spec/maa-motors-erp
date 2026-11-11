/**
 * Dubai Remittance & Consignment - Official Corporate Print Engine
 * Generates an executive A4 printable register voucher matching MAA MOTORS ERP standards.
 */

import {
    formatAmountWithComma,
    parseAmount,
    safeRound,
    renderPrintHeader,
    renderRepeatHeader,
    escapeHTML,
    formatAppDate,
    getTodayLocalDateString
} from '../utils.js';
import { SettingsDAO } from '../dao.js';
import { smartPaginatePrint, printViaIframe } from '../utils/smart-print-engine.js';
import { calculateConsignmentSummary } from './dubai-remittance-calc.js';
import { renderNothiPrintSectionBanner, resolveSectionBannerConfig } from './dubai-section-banner.js';

export async function printDubaiRemittanceBook(consignment, entries = []) {
    let settings = {};
    try {
        settings = (await SettingsDAO.getAppSettings()) || {};
    } catch (e) {
        console.error('Settings fetch error in remittance print:', e);
    }

    const bannerCfg = resolveSectionBannerConfig(consignment, 'remittance');
    const title = `Dubai_Remittance_${bannerCfg.title || consignment?.name || 'Consignment_1'}`;
    const summary = calculateConsignmentSummary(consignment, entries);

    const extraCss = `
        .num-font {
            font-family: 'Inter', 'Segoe UI', Arial, sans-serif !important;
            font-feature-settings: 'tnum' 1;
            font-variant-numeric: tabular-nums;
        }
        .remittance-table {
            width: 100% !important;
            border-collapse: collapse !important;
            font-size: 8.5px !important;
            border: 1.5px solid #334155 !important;
        }
        .remittance-table th {
            border: 1px solid #334155 !important;
            background: #1e293b !important;
            color: #ffffff !important;
            padding: 3.5px 4px !important;
            font-size: 8px !important;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
        }
        .remittance-table td {
            border: 1px solid #94a3b8 !important;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
        }
    `;

    const parts = generateRemittancePaginationParts(consignment, entries, summary, settings, bannerCfg);
    const paginatedHtml = await smartPaginatePrint({
        ...parts,
        extraCss,
        tableClass: 'remittance-table',
        tableStyle: 'width:100%;border-collapse:collapse;font-size:8.5px;border:1.5px solid #334155;',
        sheetPadding: '6mm 10mm',
        formattedDate: formatAppDate(getTodayLocalDateString())
    });

    await printViaIframe(paginatedHtml, extraCss, title);
}

function generateRemittancePaginationParts(consignment, entries, summary, settings, bannerCfg) {
    const s1Aed = formatAmountWithComma(summary.stage1.aed);
    const s1Bdt = formatAmountWithComma(summary.stage1.bdt);
    const s2Aed = formatAmountWithComma(summary.stage2.aed);
    const s2Bdt = formatAmountWithComma(summary.stage2.bdt);
    const s3Aed = formatAmountWithComma(summary.stage3.aed);
    const s3Bdt = formatAmountWithComma(summary.stage3.bdt);
    const grandAed = formatAmountWithComma(summary.grandTotal.aed);
    const grandBdt = formatAmountWithComma(summary.grandTotal.bdt);
    const session2026Aed = formatAmountWithComma(summary.session2026.aed);
    const session2026Bdt = formatAmountWithComma(summary.session2026.bdt);

    const isPrimarySession = (!consignment?.id || consignment.id === 'CONSIGNMENT-01') && !summary.isRollover;
    const formerDateLabel = isPrimarySession ? '13/10/2026' : (summary.stage2.dates || 'প্রারম্ভিক');
    const formerDescLabel = isPrimarySession
        ? 'সাবেক (পূর্ববর্তী কিউমুলেটিভ ব্যালেন্স)'
        : (summary.isRollover ? 'সাবেক (পূর্ববর্তী কনসোলমেন্ট থেকে স্থানান্তরিত ব্যালেন্স)' : 'প্রারম্ভিক ব্যালেন্স (B/F)');
    const stage1Title = isPrimarySession ? '১. পর্যায় ১ (২০২৫ ইনভেস্ট)' : '১. পূর্ববর্তী স্থিতি / পর্যায় ১';
    const stage2Title = isPrimarySession ? '২. পর্যায় ২ সাবেক (২০২৬ সাবেক)' : '২. প্রারম্ভিক ব্যালেন্স (সাবেক B/F)';
    const grandKpiTitle = isPrimarySession ? '৪. ১ম কনসোলমেন্ট সর্বমোট তহবিল' : '৪. চলমান সেশন সর্বমোট তহবিল';
    const sessionRowLabel = isPrimarySession ? '২০২৬ সেশনের মোট তহবিল (সাবেক সহ):' : 'চলমান সেশনের মোট তহবিল (সাবেক সহ):';
    const sessionBadgeLabel = isPrimarySession ? '২০২৬ মোট' : 'সেশন মোট';
    const grandRowLabel = isPrimarySession
        ? '১ম কনসোলমেন্টের সর্বমোট তহবিল (পর্যায় ১ + ২ + ৩):'
        : `${escapeHTML(consignment?.name || 'চলমান সেশন')} সর্বমোট তহবিল:`;

    const rowsArray = [];
    // Row 0: Opening / Former Balance
    rowsArray.push(`
        <tr style="background: #eff6ff; font-weight: 700;">
            <td style="text-align: center; color: #0284c7; font-weight: 800; padding: 3px 4px; border: 1px solid #94a3b8;">০</td>
            <td style="text-align: center; font-weight: 600; padding: 3px 4px; border: 1px solid #94a3b8;" class="num-font">${escapeHTML(formerDateLabel)}</td>
            <td style="font-weight: 800; color: #0369a1; padding: 3px 4px; border: 1px solid #94a3b8;">${formerDescLabel}</td>
            <td style="text-align: center; font-weight: 700; color: #475569; padding: 3px 4px; border: 1px solid #94a3b8;" class="num-font">${Number(summary.stage2.rate || 0).toFixed(2)}</td>
            <td style="text-align: right; font-weight: 800; color: #059669; padding: 3px 4px; border: 1px solid #94a3b8;" class="num-font">${s2Aed}</td>
            <td style="text-align: right; font-weight: 800; color: #dc2626; padding: 3px 4px; border: 1px solid #94a3b8;" class="num-font">৳ ${s2Bdt}</td>
            <td style="text-align: center; padding: 3px 4px; border: 1px solid #94a3b8;"><span style="background: #e0f2fe; color: #0369a1; border: 1px solid #bae6fd; padding: 1px 4px; border-radius: 3px; font-size: 7.5px; font-weight: 700;">সাবেক শুরু</span></td>
        </tr>
    `);

    entries.forEach((e, idx) => {
        const aedStr = formatAmountWithComma(safeRound(parseAmount(e.aedAmount || 0)));
        const bdtStr = formatAmountWithComma(safeRound(parseAmount(e.bdtAmount || 0)));
        const dtStr = formatAppDate(e.date);
        const rateStr = (parseAmount(e.rate) || 0).toFixed(2);
        const bg = (idx % 2 === 1) ? 'background: #f8fafc;' : 'background: #ffffff;';

        rowsArray.push(`
            <tr style="${bg}">
                <td style="text-align: center; color: #64748b; font-weight: 700; padding: 2.5px 4px; border: 1px solid #94a3b8;">${idx + 1}</td>
                <td style="text-align: center; font-weight: 600; padding: 2.5px 4px; border: 1px solid #94a3b8;" class="num-font">${escapeHTML(dtStr)}</td>
                <td style="font-weight: 600; color: #0f172a; padding: 2.5px 4px; border: 1px solid #94a3b8;">${escapeHTML(e.via || '')}</td>
                <td style="text-align: center; font-weight: 700; color: #475569; padding: 2.5px 4px; border: 1px solid #94a3b8;" class="num-font">${rateStr}</td>
                <td style="text-align: right; font-weight: 800; color: #059669; padding: 2.5px 4px; border: 1px solid #94a3b8;" class="num-font">${aedStr}</td>
                <td style="text-align: right; font-weight: 800; color: #dc2626; padding: 2.5px 4px; border: 1px solid #94a3b8;" class="num-font">৳ ${bdtStr}</td>
                <td style="text-align: center; padding: 2.5px 4px; border: 1px solid #94a3b8;"><span style="background: #ecfdf5; color: #047857; border: 1px solid #a7f3d0; padding: 1px 4px; border-radius: 3px; font-size: 7.5px; font-weight: 700;">${escapeHTML(e.status || 'পরিশোধিত')}</span></td>
            </tr>
        `);
    });

    const page1HeaderHtml = `
        ${renderPrintHeader(settings, {
            title: bannerCfg.motherTitle,
            pageLabel: 'রেজিস্টার খাতা পাতা',
            pageNo: bannerCfg.pageNo || '০০০১'
        })}
        ${renderNothiPrintSectionBanner(consignment, 'remittance')}
    `;

    const repeatHeaderHtml = renderRepeatHeader(
        bannerCfg.motherTitle || 'দুবাই টাকা পাঠানোর হিসাব বুক',
        `রেজিস্টার খাতা পাতা: ${bannerCfg.pageNo || '০০০১'}`
    );

    const page1ExtraHtml = `
        <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 5px; margin-bottom: 5px;">
            <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-left: 2.5px solid #6366f1; border-radius: 4px; padding: 3px 5px; text-align: center;">
                <div style="font-size: 7.5px; font-weight: 700; color: #64748b;">${stage1Title}</div>
                <div class="num-font" style="font-size: 6.5px; font-weight: 700; color: #4338ca; background: #eef2ff; border: 1px solid #c7d2fe; border-radius: 3px; display: inline-block; padding: 0.5px 4px; margin: 1px 0;">${escapeHTML(summary.stage1.dates)}</div>
                <div class="num-font" style="font-size: 10px; font-weight: 900; color: #4f46e5; line-height: 1.2;">${s1Aed} AED</div>
                <div style="font-size: 7px; color: #475569; font-weight: 600;">৳ ${s1Bdt} (রেট: ${Number(summary.stage1.rate || 0).toFixed(2)})</div>
            </div>
            <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-left: 2.5px solid #0284c7; border-radius: 4px; padding: 3px 5px; text-align: center;">
                <div style="font-size: 7.5px; font-weight: 700; color: #64748b;">${stage2Title}</div>
                <div class="num-font" style="font-size: 6.5px; font-weight: 700; color: #0369a1; background: #e0f2fe; border: 1px solid #bae6fd; border-radius: 3px; display: inline-block; padding: 0.5px 4px; margin: 1px 0;">${escapeHTML(summary.stage2.dates || 'প্রারম্ভিক')}</div>
                <div class="num-font" style="font-size: 10px; font-weight: 900; color: #0284c7; line-height: 1.2;">${s2Aed} AED</div>
                <div style="font-size: 7px; color: #475569; font-weight: 600;">৳ ${s2Bdt} (রেট: ${Number(summary.stage2.rate || 0).toFixed(2)})</div>
            </div>
            <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-left: 2.5px solid #059669; border-radius: 4px; padding: 3px 5px; text-align: center;">
                <div style="font-size: 7.5px; font-weight: 700; color: #64748b;">৩. পর্যায় ৩ রানিং (${summary.stage3.count} কিস্তি)</div>
                <div class="num-font" style="font-size: 6.5px; font-weight: 700; color: #047857; background: #d1fae5; border: 1px solid #a7f3d0; border-radius: 3px; display: inline-block; padding: 0.5px 4px; margin: 1px 0;">${escapeHTML(summary.stage3.dates)}</div>
                <div class="num-font" style="font-size: 10px; font-weight: 900; color: #059669; line-height: 1.2;">${s3Aed} AED</div>
                <div style="font-size: 7px; color: #475569; font-weight: 600;">৳ ${s3Bdt} (গড়: ${Number(summary.stage3.rate || 0).toFixed(2)})</div>
            </div>
            <div style="background: #fffbeb; border: 1px solid #fde68a; border-left: 2.5px solid #d97706; border-radius: 4px; padding: 3px 5px; text-align: center;">
                <div style="font-size: 7.5px; font-weight: 800; color: #b45309;">${grandKpiTitle}</div>
                <div class="num-font" style="font-size: 6.5px; font-weight: 800; color: #92400e; background: #fef3c7; border: 1px solid #fcd34d; border-radius: 3px; display: inline-block; padding: 0.5px 4px; margin: 1px 0;">${escapeHTML(summary.grandTotal.dates)}</div>
                <div class="num-font" style="font-size: 10px; font-weight: 900; color: #b45309; line-height: 1.2;">${grandAed} AED</div>
                <div style="font-size: 7px; color: #92400e; font-weight: 700;">৳ ${grandBdt} (গড়: ${Number(summary.grandTotal.rate || 0).toFixed(2)})</div>
            </div>
        </div>
    `;

    const tableColHeaderHtml = `
        <thead>
            <tr style="background: #1e293b; color: #ffffff;">
                <th style="width: 4%; padding: 3.5px 4px; border: 1px solid #334155; text-align: center; font-size: 8px;">নং</th>
                <th style="width: 11%; padding: 3.5px 4px; border: 1px solid #334155; text-align: center; font-size: 8px;">তারিখ</th>
                <th style="width: 32%; padding: 3.5px 4px; border: 1px solid #334155; text-align: left; font-size: 8px;">বিবরণ / মারফত (Particulars)</th>
                <th style="width: 9%; padding: 3.5px 4px; border: 1px solid #334155; text-align: center; font-size: 8px;">রেট (Rate)</th>
                <th style="width: 18%; padding: 3.5px 4px; border: 1px solid #334155; text-align: right; font-size: 8px;">দিরহাম (AED)</th>
                <th style="width: 18%; padding: 3.5px 4px; border: 1px solid #334155; text-align: right; font-size: 8px;">টাকা (BDT / TK)</th>
                <th style="width: 8%; padding: 3.5px 4px; border: 1px solid #334155; text-align: center; font-size: 8px;">স্ট্যাটাস</th>
            </tr>
        </thead>
    `;

    const tableFooterRowsHtml = `
        <tr style="background: #f8fafc; font-weight: 700; color: #475569;">
            <td colspan="3" style="text-align: right; padding: 3px 5px; border: 1px solid #94a3b8; font-weight: 800;">চলমান খাতার উপ-মোট (${summary.stage3.count} টি লেনদেন):</td>
            <td style="text-align: center; padding: 3px 4px; border: 1px solid #94a3b8;" class="num-font">${Number(summary.stage3.rate || 0).toFixed(2)}</td>
            <td style="text-align: right; font-weight: 800; color: #059669; padding: 3px 5px; border: 1px solid #94a3b8;" class="num-font">${s3Aed} AED</td>
            <td style="text-align: right; font-weight: 800; color: #dc2626; padding: 3px 5px; border: 1px solid #94a3b8;" class="num-font">৳ ${s3Bdt}</td>
            <td style="text-align: center; font-size: 7.5px; font-weight: 800; color: #475569; padding: 3px 4px; border: 1px solid #94a3b8;">উপ-মোট</td>
        </tr>
        <tr style="background: #f0fdf4; font-weight: 800; color: #065f46;">
            <td colspan="3" style="text-align: right; padding: 3px 5px; border: 1.5px solid #86efac; font-weight: 900;">${sessionRowLabel}</td>
            <td style="text-align: center; padding: 3px 4px; border: 1.5px solid #86efac;" class="num-font">${Number(summary.session2026.rate || 0).toFixed(2)}</td>
            <td style="text-align: right; font-weight: 900; color: #047857; padding: 3px 5px; border: 1.5px solid #86efac;" class="num-font">${session2026Aed} AED</td>
            <td style="text-align: right; font-weight: 900; color: #b91c1c; padding: 3px 5px; border: 1.5px solid #86efac;" class="num-font">৳ ${session2026Bdt}</td>
            <td style="text-align: center; padding: 3px 4px; border: 1.5px solid #86efac;"><span style="background: #d1fae5; color: #065f46; border: 1px solid #a7f3d0; padding: 1px 4px; border-radius: 3px; font-size: 7px; font-weight: 800;">${sessionBadgeLabel}</span></td>
        </tr>
        <tr style="background: #eff6ff; font-weight: 900;">
            <td colspan="3" style="text-align: right; font-size: 9.5px; color: #0f172a; padding: 4px 6px; border: 2px solid #0284c7; font-weight: 900;">${grandRowLabel}</td>
            <td style="text-align: center; font-size: 9px; color: #0284c7; padding: 4px 5px; border: 2px solid #0284c7;" class="num-font">${Number(summary.grandTotal.rate || 0).toFixed(2)}</td>
            <td style="text-align: right; font-size: 10px; font-weight: 900; color: #047857; padding: 4px 6px; border: 2px solid #0284c7;" class="num-font">${grandAed} AED</td>
            <td style="text-align: right; font-size: 10px; font-weight: 900; color: #b91c1c; padding: 4px 6px; border: 2px solid #0284c7;" class="num-font">৳ ${grandBdt}</td>
            <td style="text-align: center; padding: 4px 5px; border: 2px solid #0284c7;"><span style="background: #0284c7; color: #fff; padding: 1.5px 5px; border-radius: 3px; font-size: 7.5px; font-weight: 900;">সর্বমোট</span></td>
        </tr>
    `;

    const signatureHtml = `
        <div class="print-sig-block" style="margin-top: 30px; padding-top: 6px; page-break-inside: avoid; break-inside: avoid;">
            <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px;">
                <div style="text-align: center; border-top: 1.2px dashed #64748b; padding-top: 5px; font-size: 8px; color: #1e293b; font-weight: 700; font-family: 'Anek Bangla', sans-serif;">প্রস্তুতকারক (হিসাব বিভাগ)</div>
                <div style="text-align: center; border-top: 1.2px dashed #64748b; padding-top: 5px; font-size: 8px; color: #1e293b; font-weight: 700; font-family: 'Anek Bangla', sans-serif;">অভ্যন্তরীণ নিরীক্ষক (অফিস ইনচার্জ)</div>
                <div style="text-align: center; border-top: 1.2px dashed #64748b; padding-top: 5px; font-size: 8px; color: #1e293b; font-weight: 700; font-family: 'Anek Bangla', sans-serif;">পার্টনার অনুমোদন</div>
                <div style="text-align: center; border-top: 1.2px dashed #64748b; padding-top: 5px; font-size: 8px; color: #1e293b; font-weight: 700; font-family: 'Anek Bangla', sans-serif;">মোহাম্মদ এমরান (স্বত্বাধিকারী)</div>
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
        summaryHtml: '',
        signatureHtml
    };
}

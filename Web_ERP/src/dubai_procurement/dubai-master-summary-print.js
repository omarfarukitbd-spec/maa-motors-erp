/**
 * Consolidated Master Project CapEx & Liquidity - Official A4 Print Engine (পাতা ০০০৬)
 * Prints 4-tier combined investment totals, optional combination simulator snapshot,
 * per-container 0003+0004 landed cost matrix, and 0005 Dubai AED liquidity reconciliation.
 */

import {
    formatAmountWithComma,
    safeRound,
    renderPrintHeader,
    renderRepeatHeader,
    escapeHTML,
    formatAppDate,
    getTodayLocalDateString,
    numberToBanglaWords
} from '../utils.js';
import { SettingsDAO } from '../dao.js';
import { smartPaginatePrint, printViaIframe } from '../utils/smart-print-engine.js';
import { renderNothiPrintSectionBanner, resolveSectionBannerConfig } from './dubai-section-banner.js';

export async function printDubaiMasterSummary({
    consignment,
    dubaiSummary,
    bdSummary,
    lcSummary,
    portSummary,
    capex,
    matrix,
    liquidity
}) {
    let settings = {};
    try {
        settings = (await SettingsDAO.getAppSettings()) || {};
    } catch (e) {
        console.error('Settings fetch error in master summary print:', e);
    }

    const bannerCfg = resolveSectionBannerConfig(consignment, 'master-summary');
    const title = `Nothi_Master_Summary_${consignment?.name || 'CONSIGNMENT'}`;

    const extraCss = `
        .num-font {
            font-family: 'Inter', 'Segoe UI', Arial, sans-serif !important;
            font-feature-settings: 'tnum' 1;
            font-variant-numeric: tabular-nums;
        }
        .master-table {
            width: 100% !important;
            border-collapse: collapse !important;
            font-size: 8px !important;
            border: 1.5px solid #334155 !important;
        }
        .master-table th {
            border: 1px solid #334155 !important;
            background: #1e293b !important;
            color: #ffffff !important;
            padding: 3.5px 4px !important;
            font-size: 7.5px !important;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
        }
        .master-table td {
            border: 1px solid #94a3b8 !important;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
        }
    `;

    const parts = buildMasterSummaryPrintParts({
        consignment,
        dubaiSummary,
        bdSummary,
        lcSummary,
        portSummary,
        capex,
        matrix,
        liquidity,
        settings,
        bannerCfg
    });

    const paginatedHtml = await smartPaginatePrint({
        ...parts,
        extraCss,
        tableClass: 'master-table',
        tableStyle: 'width:100%;border-collapse:collapse;font-size:8px;border:1.5px solid #334155;',
        sheetPadding: '6mm 10mm',
        formattedDate: formatAppDate(getTodayLocalDateString())
    });

    await printViaIframe(paginatedHtml, extraCss, title);
}

function buildMasterSummaryPrintParts({
    consignment,
    dubaiSummary,
    bdSummary,
    lcSummary,
    portSummary,
    capex,
    matrix,
    liquidity,
    settings,
    bannerCfg
}) {
    const flags = capex.flags || { includeDubai: true, includeLC: true, includePort: true, includeBD: true };
    const isAllFourSelected = flags.includeDubai && flags.includeLC && flags.includePort && flags.includeBD;
    const activeTotalBDT = isAllFourSelected ? capex.totalCapExBDT : capex.selectedTotalBDT;
    const activeWords = numberToBanglaWords(Math.round(activeTotalBDT || 0));

    const selectedLabels = [];
    if (flags.includeDubai) selectedLabels.push('০০০১ দুবাই FOB');
    if (flags.includeLC) selectedLabels.push('০০০৩ L/C ও ব্যাংক');
    if (flags.includePort) selectedLabels.push('০০০৪ পোর্ট ও ডিউটি');
    if (flags.includeBD) selectedLabels.push('০০০২ বাংলাদেশ খরচ');

    const page1HeaderHtml = `
        ${renderPrintHeader(settings, {
            title: bannerCfg.motherTitle,
            pageLabel: 'রেজিস্টার খাতা পাতা',
            pageNo: bannerCfg.pageNo || '০০০৬'
        })}
        ${renderNothiPrintSectionBanner(consignment, 'master-summary')}
    `;

    const repeatHeaderHtml = renderRepeatHeader(
        bannerCfg.motherTitle || 'সমন্বিত মোট হিসাব ও প্রজেক্ট পুঁজী',
        `রেজিস্টার খাতা পাতা: ${bannerCfg.pageNo || '০০০৬'}`
    );

    const tierCardsHtml = `
        <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 5px; margin-bottom: 5px;">
            <div style="background: #f0fdf4; border: 1px solid #86efac; border-left: 3px solid #059669; border-radius: 4px; padding: 4px 6px; ${flags.includeDubai ? '' : 'opacity: 0.45;'}">
                <div style="font-size: 7px; font-weight: 800; color: #065f46;">১. দুবাই ক্রয় ও রেমিট্যান্স (০০০১)</div>
                <div class="num-font" style="font-size: 10px; font-weight: 900; color: #047857; margin-top: 1px;">৳ ${formatAmountWithComma(capex.dubaiBDT)}</div>
                <div class="num-font" style="font-size: 6.8px; color: #047857; font-weight: 700;">${formatAmountWithComma(capex.dubaiAED)} AED (${capex.dubaiSharePct}%)</div>
            </div>
            <div style="background: #ecfeff; border: 1px solid #67e8f9; border-left: 3px solid #0891b2; border-radius: 4px; padding: 4px 6px; ${flags.includeLC ? '' : 'opacity: 0.45;'}">
                <div style="font-size: 7px; font-weight: 800; color: #155e75;">২. কন্টেইনার L/C ও ব্যাংক (০০০৩)</div>
                <div class="num-font" style="font-size: 10px; font-weight: 900; color: #0e7490; margin-top: 1px;">৳ ${formatAmountWithComma(capex.lcBDT)}</div>
                <div class="num-font" style="font-size: 6.8px; color: #0e7490; font-weight: 700;">$${formatAmountWithComma(capex.lcUSD)} USD · ${lcSummary.containerCount || 0} টি (${capex.lcSharePct}%)</div>
            </div>
            <div style="background: #eef2ff; border: 1px solid #a5b4fc; border-left: 3px solid #4f46e5; border-radius: 4px; padding: 4px 6px; ${flags.includePort ? '' : 'opacity: 0.45;'}">
                <div style="font-size: 7px; font-weight: 800; color: #3730a3;">৩. পোর্ট ও কাস্টমস ডিউটি (০০০৪)</div>
                <div class="num-font" style="font-size: 10px; font-weight: 900; color: #4338ca; margin-top: 1px;">৳ ${formatAmountWithComma(capex.portBDT)}</div>
                <div class="num-font" style="font-size: 6.8px; color: #4338ca; font-weight: 700;">${portSummary.count || 0} টি বিল (${capex.portSharePct}%)</div>
            </div>
            <div style="background: #fffbeb; border: 1px solid #fcd34d; border-left: 3px solid #d97706; border-radius: 4px; padding: 4px 6px; ${flags.includeBD ? '' : 'opacity: 0.45;'}">
                <div style="font-size: 7px; font-weight: 800; color: #92400e;">৪. বাংলাদেশ খরচ ও ক্লিয়ারিং (০০০২)</div>
                <div class="num-font" style="font-size: 10px; font-weight: 900; color: #b45309; margin-top: 1px;">৳ ${formatAmountWithComma(capex.bdBDT)}</div>
                <div class="num-font" style="font-size: 6.8px; color: #b45309; font-weight: 700;">সাবেক + ${bdSummary.count || 0} এন্ট্রি (${capex.bdSharePct}%)</div>
            </div>
        </div>

        <div style="background: #faf5ff; border: 1.5px solid #7e22ce; border-radius: 5px; padding: 5px 8px; margin-bottom: 6px; display: flex; justify-content: space-between; align-items: center; gap: 10px;">
            <div>
                <div style="font-size: 8px; font-weight: 900; color: #581c87;">
                    ${isAllFourSelected
                        ? 'সর্বমোট সমন্বিত ল্যান্ডেড কস্ট (০০০১ + ০০০৩ + ০০০৪ + ০০০২):'
                        : `নির্বাচিত সমন্বয় (${escapeHTML(selectedLabels.join(' + ') || 'কোনোটি নয়')}):`}
                </div>
                <div style="font-size: 7.5px; font-weight: 700; color: #6b21a8; margin-top: 1px;">
                    কথায়: ${escapeHTML(activeWords)} টাকা মাত্র। ${capex.landedEffectiveRate > 0 ? `(কার্যকর ল্যান্ডেড রেট: ${capex.landedEffectiveRate.toFixed(2)} টাকা/AED · ক্রয় রেট: ${capex.remittanceAvgRate.toFixed(2)})` : ''}
                </div>
            </div>
            <div style="text-align: right; shrink: 0;">
                <div class="num-font" style="font-size: 13px; font-weight: 900; color: #581c87; white-space: nowrap;">৳ ${formatAmountWithComma(activeTotalBDT)}</div>
                ${!isAllFourSelected ? `<div class="num-font" style="font-size: 7px; font-weight: 700; color: #475569;">পূর্ণ ৪-স্তর মোট: ৳ ${formatAmountWithComma(capex.totalCapExBDT)}</div>` : ''}
            </div>
        </div>
    `;

    const page1ExtraHtml = tierCardsHtml;

    const rowsArray = (matrix?.rows || []).map((row, idx) => {
        const bg = idx % 2 === 1 ? 'background: #f8fafc;' : 'background: #ffffff;';
        const statusBg = row.isClosed ? '#d1fae5' : '#fef3c7';
        const statusColor = row.isClosed ? '#065f46' : '#92400e';
        const statusText = row.isClosed
            ? (row.deliveryDate ? `ডেলিভারি (${formatAppDate(row.deliveryDate)})` : 'সমাপ্ত')
            : 'চলমান (Open)';
        const sizeBadge = row.portSizes.length > 0 ? row.portSizes.join(', ') : '—';

        return `
            <tr style="${bg}">
                <td style="text-align: center; font-weight: 900; color: #1e293b; padding: 3px 4px;" class="num-font">${row.containerNum}</td>
                <td style="font-weight: 700; color: #0f172a; padding: 3px 4px;">
                    ${escapeHTML(row.company || 'নির্ধারিত নয়')}
                    ${row.lcNo ? `<div class="num-font" style="font-size: 6.8px; color: #475569;">L/C: ${escapeHTML(row.lcNo)}</div>` : ''}
                </td>
                <td style="text-align: center; font-weight: 700; color: #334155; padding: 3px 4px;" class="num-font">${escapeHTML(sizeBadge)}</td>
                <td style="text-align: right; font-weight: 700; color: #0e7490; padding: 3px 4px;" class="num-font">$${formatAmountWithComma(row.lcUSD)}</td>
                <td style="text-align: right; font-weight: 800; color: #0e7490; padding: 3px 4px;" class="num-font">৳ ${formatAmountWithComma(row.lcBDT)}</td>
                <td style="text-align: right; font-weight: 800; color: #4338ca; padding: 3px 4px;" class="num-font">৳ ${formatAmountWithComma(row.portBDT)}</td>
                <td style="text-align: right; font-weight: 900; color: #581c87; padding: 3px 4px;" class="num-font">৳ ${formatAmountWithComma(row.combinedBDT)}</td>
                <td style="text-align: center; padding: 3px 4px;"><span style="background: ${statusBg}; color: ${statusColor}; padding: 1px 4px; border-radius: 3px; font-size: 6.8px; font-weight: 800;">${escapeHTML(statusText)}</span></td>
            </tr>
        `;
    });

    for (const unmatched of (matrix?.unmatchedPortRows || [])) {
        rowsArray.push(`
            <tr style="background: #fff7ed;">
                <td style="text-align: center; font-weight: 700; color: #9a3412; padding: 3px 4px;">—</td>
                <td style="font-weight: 700; color: #9a3412; padding: 3px 4px;">${escapeHTML(unmatched.description)} (অমিল পোর্ট বিল)</td>
                <td style="text-align: center; font-weight: 700; padding: 3px 4px;" class="num-font">${escapeHTML(unmatched.size)}</td>
                <td style="text-align: right; padding: 3px 4px;" class="num-font">$0</td>
                <td style="text-align: right; padding: 3px 4px;" class="num-font">৳ 0</td>
                <td style="text-align: right; font-weight: 800; color: #4338ca; padding: 3px 4px;" class="num-font">৳ ${formatAmountWithComma(unmatched.portBDT)}</td>
                <td style="text-align: right; font-weight: 900; color: #581c87; padding: 3px 4px;" class="num-font">৳ ${formatAmountWithComma(unmatched.portBDT)}</td>
                <td style="text-align: center; padding: 3px 4px;"><span style="background: #ffedd5; color: #9a3412; padding: 1px 4px; border-radius: 3px; font-size: 6.8px; font-weight: 800;">পোর্ট-০৪</span></td>
            </tr>
        `);
    }

    const tableColHeaderHtml = `
        <thead>
            <tr>
                <th style="width: 6%; text-align: center;">কন্টেইনার</th>
                <th style="width: 22%; text-align: left;">কোম্পানি / এলসি নং</th>
                <th style="width: 8%; text-align: center;">সাইজ</th>
                <th style="width: 11%; text-align: right;">L/C (USD)</th>
                <th style="width: 15%; text-align: right;">L/C ও ব্যাংক (০০০৩)</th>
                <th style="width: 15%; text-align: right;">পোর্ট ও ডিউটি (০০০৪)</th>
                <th style="width: 15%; text-align: right;">মোট কন্টেইনার খরচ</th>
                <th style="width: 8%; text-align: center;">স্ট্যাটাস</th>
            </tr>
        </thead>
    `;

    const tableFooterRowsHtml = `
        <tr style="background: #f5f3ff; font-weight: 900;">
            <td colspan="3" style="text-align: right; padding: 4px 6px; border: 1.5px solid #6d28d9; color: #1e1b4b;">মোট কন্টেইনার ও পোর্ট ব্যয় (${matrix?.totals?.containerCount || 0} টি কন্টেইনার):</td>
            <td style="text-align: right; padding: 4px 5px; border: 1.5px solid #6d28d9; color: #0e7490;" class="num-font">$${formatAmountWithComma(matrix?.totals?.lcUSD || 0)}</td>
            <td style="text-align: right; padding: 4px 5px; border: 1.5px solid #6d28d9; color: #0e7490;" class="num-font">৳ ${formatAmountWithComma(matrix?.totals?.lcBDT || 0)}</td>
            <td style="text-align: right; padding: 4px 5px; border: 1.5px solid #6d28d9; color: #4338ca;" class="num-font">৳ ${formatAmountWithComma(matrix?.totals?.portTotalBDT || 0)}</td>
            <td style="text-align: right; padding: 4px 5px; border: 1.5px solid #6d28d9; color: #581c87; font-size: 9px;" class="num-font">৳ ${formatAmountWithComma(matrix?.totals?.combinedAllBDT || 0)}</td>
            <td style="text-align: center; padding: 4px; border: 1.5px solid #6d28d9; font-size: 7px; color: #581c87;">০০০৩+০০০৪</td>
        </tr>
    `;

    const vm = liquidity?.varianceMetrics || {};
    const varColor = vm.statusKind === 'deficit' ? '#dc2626' : '#059669';
    const varSign = vm.variance > 0 ? '+' : '';
    const summaryHtml = `
        <div style="margin-top: 6px; border: 1px solid #cbd5e1; border-radius: 5px; padding: 5px 8px; background: #f8fafc; page-break-inside: avoid;">
            <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1px dashed #cbd5e1; padding-bottom: 3px; margin-bottom: 4px;">
                <span style="font-size: 8px; font-weight: 900; color: #0f172a;">দুবাই দিরহাম (AED) তারল্য ও সাপ্তাহিক ক্যাশ সারাংশ (০০০১ বনাম ০০০৫ — BDT হতে সম্পূর্ণ আলাদা)</span>
                <span class="num-font" style="font-size: 7.5px; font-weight: 700; color: #0369a1;">সর্বশেষ অডিট: ${liquidity?.hasAudit ? escapeHTML(formatAppDate(liquidity.weekEndDate)) : 'রেকর্ড নেই'}</span>
            </div>
            <div style="display: grid; grid-template-columns: repeat(5, 1fr); gap: 6px; font-size: 7.5px;">
                <div><span style="color: #64748b; display: block;">মোট প্রেরিত (০০০১):</span><strong class="num-font" style="color: #047857;">${formatAmountWithComma(liquidity?.remittedAED || 0)} AED</strong></div>
                <div><span style="color: #64748b; display: block;">ক্রয় ও খরচ (০০০৫):</span><strong class="num-font" style="color: #dc2626;">${formatAmountWithComma(safeRound((liquidity?.cumPurchaseAED || 0) + (liquidity?.cumExpenseAED || 0)))} AED</strong></div>
                <div><span style="color: #64748b; display: block;">থিওরেটিক্যাল ক্যাশ:</span><strong class="num-font" style="color: #0f172a;">${formatAmountWithComma(liquidity?.theoreticalCashAED || 0)} AED</strong></div>
                <div><span style="color: #64748b; display: block;">বাস্তব সম্পদ (হাতে+AD+অন্যান্য):</span><strong class="num-font" style="color: #0369a1;">${formatAmountWithComma(liquidity?.totalPhysicalAED || 0)} AED</strong></div>
                <div><span style="color: #64748b; display: block;">তফাত ${escapeHTML(vm.statusLabel || '')}:</span><strong class="num-font" style="color: ${varColor};">${varSign}${formatAmountWithComma(vm.variance || 0)} AED</strong></div>
            </div>
        </div>
    `;

    const signatureHtml = `
        <div class="print-sig-block" style="margin-top: 26px; padding-top: 6px; page-break-inside: avoid; break-inside: avoid;">
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
        summaryHtml,
        signatureHtml
    };
}


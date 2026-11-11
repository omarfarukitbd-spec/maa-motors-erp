/**
 * Dubai Procurement - Bangladesh Landed Expenses Corporate Print Engine
 * Generates an executive A4 printable register voucher for Page 0002 matching MAA MOTORS ERP standards.
 */

import {
    formatAmountWithComma,
    safeRound,
    escapeHTML,
    formatAppDate,
    renderPrintHeader
} from '../utils.js';
import { SettingsDAO } from '../dao.js';
import { printViaIframe } from '../utils/smart-print-engine.js';
import { calculateBDExpenseSummary } from './dubai-bd-expense-calc.js';
import { renderNothiPrintSectionBanner, resolveSectionBannerConfig } from './dubai-section-banner.js';

export async function printDubaiBDExpenseBook(consignment, entries = [], dubaiSummary = null) {
    let settings = {};
    try {
        settings = (await SettingsDAO.getAppSettings()) || {};
    } catch (e) {
        console.error('Settings fetch error in BD expense print:', e);
    }

    const bannerCfg = resolveSectionBannerConfig(consignment, 'bd-expense');
    const title = `Bangladesh_Expenses_${bannerCfg.title || 'Page_0002'}`;
    const summary = calculateBDExpenseSummary(consignment, entries);
    const htmlBody = generateBDExpensePrintHtml(consignment, entries, summary, dubaiSummary, settings);

    const extraCss = `
        @page { size: A4 portrait; margin: 0 !important; }
        html, body {
            font-family: 'Anek Bangla', 'Hind Siliguri', 'Inter', sans-serif !important;
            background: #fff !important;
            color: #0f172a !important;
            margin: 0 !important;
            padding: 0 !important;
        }
        .num-font {
            font-family: 'Inter', 'Segoe UI', Arial, sans-serif !important;
            font-feature-settings: 'tnum' 1;
            font-variant-numeric: tabular-nums;
        }
        table { border-collapse: collapse !important; width: 100% !important; }
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
        tr { page-break-inside: avoid !important; }
        thead { display: table-header-group !important; }
        .bd-print-sheet {
            width: 100% !important;
            max-width: 210mm !important;
            margin: 0 auto !important;
            box-sizing: border-box !important;
            padding: 5mm 9mm 5mm 9mm !important;
            background: #ffffff !important;
        }
        .print-sig-block {
            page-break-inside: avoid !important;
            break-inside: avoid !important;
        }
    `;

    printViaIframe(htmlBody, extraCss, title);
}

function generateBDExpensePrintHtml(consignment, entries, summary, dubaiSummary, settings) {
    const bfFormatted = formatAmountWithComma(summary.bfAmount);
    const runningFormatted = formatAmountWithComma(summary.runningTotal);
    const grandFormatted = formatAmountWithComma(summary.grandTotal);

    // Consolidated CapEx numbers
    const dubaiBdt = dubaiSummary?.grandTotal?.bdt || 236437459;
    const dubaiAed = dubaiSummary?.grandTotal?.aed || 6907319;
    const totalCapEx = dubaiBdt + summary.grandTotal;
    const bannerCfg = resolveSectionBannerConfig(consignment, 'bd-expense');
    const remBannerCfg = resolveSectionBannerConfig(consignment, 'remittance');

    const rowsHtml = entries.map((item, idx) => {
        const amtStr = formatAmountWithComma(item.amount);
        const appDate = formatAppDate(item.date);
        const bgStyle = idx % 2 === 1 ? 'background: #f8fafc;' : 'background: #ffffff;';

        return `
            <tr style="${bgStyle}">
                <td style="padding: 2.5px 4px; text-align: center; font-size: 8px; color: #64748b; font-weight: bold;">${idx + 1}</td>
                <td style="padding: 2.5px 4px; text-align: center; font-size: 8px; font-weight: 600; white-space: nowrap;">${appDate}</td>
                <td style="padding: 2.5px 6px; font-size: 8.5px; font-weight: 600; color: #0f172a;">${escapeHTML(item.description || item.vendor || '—')}</td>
                <td style="padding: 2.5px 4px; font-size: 7.5px; color: #475569;">${escapeHTML(item.category || '—')}</td>
                <td style="padding: 2.5px 4px; text-align: center; font-size: 8px; color: #64748b;">${escapeHTML(item.memo || '—')}</td>
                <td style="padding: 2.5px 6px; text-align: right; font-size: 8.5px; font-weight: 700; color: #b91c1c;" class="num-font">৳ ${amtStr}</td>
                <td style="padding: 2.5px 4px; text-align: center; font-size: 7.5px; font-weight: 600; color: #047857;">${escapeHTML(item.status || 'চূড়ান্ত পরিশোধিত')}</td>
            </tr>
        `;
    }).join('');

    return `
        <div class="bd-print-sheet">
            <!-- Mother Header (Official Corporate Design) -->
            ${renderPrintHeader(settings, {
                title: bannerCfg.motherTitle,
                pageLabel: 'রেজিস্টার খাতা পাতা',
                pageNo: bannerCfg.pageNo || '০০০২'
            })}

            <!-- Customizable Per-Section Banner Bar -->
            ${renderNothiPrintSectionBanner(consignment, 'bd-expense')}

            <!-- 3 Master KPI Summary Cards -->
            <div style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 4px; margin-bottom: 4px;">
                <div style="background: #f0f9ff; border: 1px solid #7dd3fc; border-radius: 4px; padding: 3px 6px; text-align: center;">
                    <div style="font-size: 7px; font-weight: 700; color: #0369a1;">১. সাবেক ব্যালেন্স (B/F)</div>
                    <div style="font-size: 10px; font-weight: 900; color: #0284c7;" class="num-font">৳ ${bfFormatted}</div>
                    <div style="font-size: 6.5px; color: #64748b;">০১/১১/২০২৫ - ০৬/০৮/২০২৬ সেশন</div>
                </div>
                <div style="background: #fef2f2; border: 1px solid #fca5a5; border-radius: 4px; padding: 3px 6px; text-align: center;">
                    <div style="font-size: 7px; font-weight: 700; color: #991b1b;">২. রানিং খাতার খরচ (${summary.count} কিস্তি)</div>
                    <div style="font-size: 10px; font-weight: 900; color: #dc2626;" class="num-font">৳ ${runningFormatted}</div>
                    <div style="font-size: 6.5px; color: #64748b;">২৯/০৮/২০২৬ - ০৯/১১/২০২৬ সেশন</div>
                </div>
                <div style="background: #fffbeb; border: 1.5px solid #f59e0b; border-radius: 4px; padding: 3px 6px; text-align: center;">
                    <div style="font-size: 7px; font-weight: 800; color: #92400e;">৩. সর্বমোট বাংলাদেশ খরচ</div>
                    <div style="font-size: 11px; font-weight: 900; color: #b45309;" class="num-font">৳ ${grandFormatted}</div>
                    <div style="font-size: 6.5px; color: #78350f;">০১/১১/২০২৫ - ০৯/১১/২০২৬ সর্বমোট</div>
                </div>
            </div>

            <!-- Detailed Expense Register Table -->
            <table class="bd-expense-table">
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
                <tbody>
                    <!-- B/F Row -->
                    <tr style="background: #f0f9ff; font-weight: bold;">
                        <td style="padding: 2.5px 4px; text-align: center; font-size: 8px; color: #0284c7;">০</td>
                        <td style="padding: 2.5px 4px; text-align: center; font-size: 8px; color: #0369a1;">০১/১১/২৫ - ০৬/০৮/২৬</td>
                        <td style="padding: 2.5px 6px; font-size: 8.5px; color: #0369a1;">B/F (পূর্ববর্তী স্থানান্তরিত কিউমুলেটিভ ব্যালেন্স)</td>
                        <td style="padding: 2.5px 4px; font-size: 7.5px; color: #0284c7;">প্রারম্ভিক ব্যালেন্স</td>
                        <td style="padding: 2.5px 4px; text-align: center; font-size: 8px; color: #64748b;">—</td>
                        <td style="padding: 2.5px 6px; text-align: right; font-size: 8.5px; font-weight: 800; color: #0284c7;" class="num-font">৳ ${bfFormatted}</td>
                        <td style="padding: 2.5px 4px; text-align: center; font-size: 7.5px; color: #0284c7;">সাবেক ব্যালেন্স শুরু</td>
                    </tr>

                    ${rowsHtml}

                    <!-- Subtotal Row -->
                    <tr style="background: #f8fafc; font-weight: bold; border-top: 1.5px solid #64748b;">
                        <td colspan="5" style="padding: 3px 6px; text-align: right; font-size: 8.5px; color: #334155;">চলমান খাতার উপ-মোট (${summary.count} টি রানিং খরচ):</td>
                        <td style="padding: 3px 6px; text-align: right; font-size: 9px; font-weight: 800; color: #dc2626;" class="num-font">৳ ${runningFormatted}</td>
                        <td style="padding: 3px 4px; text-align: center; font-size: 7.5px; color: #475569;">উপ-মোট</td>
                    </tr>

                    <!-- Grand Total Row -->
                    <tr style="background: #fffbeb; font-weight: 900; border-top: 1.5px solid #d97706; border-bottom: 2px solid #d97706;">
                        <td colspan="5" style="padding: 4px 6px; text-align: right; font-size: 9.5px; color: #92400e;">সর্বমোট বাংলাদেশ খরচ (B/F সাবেক + রানিং খাতা):</td>
                        <td style="padding: 4px 6px; text-align: right; font-size: 10px; font-weight: 900; color: #b45309;" class="num-font">৳ ${grandFormatted}</td>
                        <td style="padding: 4px 4px; text-align: center; font-size: 8px; color: #b45309;">সর্বমোট</td>
                    </tr>
                </tbody>
            </table>

            <!-- Consolidated Dubai + BD Grand Capital Summary Box -->
            <div style="margin-top: 4px; background: #f8fafc; border: 1.5px solid #cbd5e1; border-radius: 4px; padding: 4px 8px;">
                <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1px dashed #94a3b8; padding-bottom: 2px; margin-bottom: 2px;">
                    <div style="font-size: 8px; font-weight: 800; color: #0f172a;">
                        <span style="color: #0284c7;">১ম কনসোলমেন্ট সমন্বিত পুঁজী বিবরণী:</span> দুবাই ক্রয় + বাংলাদেশ ল্যান্ডেড খরচ
                    </div>
                    <div style="font-size: 8px; font-weight: 800; color: #047857;">
                        সর্বমোট পুঁজী: <span style="font-size: 10px;" class="num-font">৳ ${formatAmountWithComma(totalCapEx)}</span>
                    </div>
                </div>
                <div style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 6px; text-align: center; font-size: 7.5px;">
                    <div>• দুবাই পার্ট (পাতা ${escapeHTML(remBannerCfg.pageNo || '০০০১')}): <strong>${formatAmountWithComma(dubaiAed)} AED</strong> = <strong class="num-font">৳ ${formatAmountWithComma(dubaiBdt)}</strong></div>
                    <div>• বাংলাদেশ পার্ট (পাতা ${escapeHTML(bannerCfg.pageNo || '০০০২')}): <strong class="num-font">৳ ${grandFormatted}</strong> (${summary.count} কিস্তি + সাবেক)</div>
                    <div>• সর্বসাকুল্যে ক্যাপিটাল: <strong style="color: #047857;" class="num-font">৳ ${formatAmountWithComma(totalCapEx)}</strong> (১০০%)</div>
                </div>
            </div>

            <!-- Signatures Section -->
            <div class="print-sig-block" style="margin-top: 48px; display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; text-align: center;">
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
}

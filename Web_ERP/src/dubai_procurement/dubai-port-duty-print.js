/**
 * Dubai Procurement - Container Port, Customs Duty & C&F Corporate Print Engine
 * Generates an executive A4 printable register voucher for Page 0004 matching MAA MOTORS ERP standards.
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
import { calculatePortDutySummary, calculateMasterProjectCapEx } from './dubai-port-duty-calc.js';
import { renderNothiPrintSectionBanner, resolveSectionBannerConfig } from './dubai-section-banner.js';

export async function printDubaiPortDutyBook(consignment, bills = [], dubaiSummary = null, bdExpenseSummary = null) {
    let settings = {};
    try {
        settings = (await SettingsDAO.getAppSettings()) || {};
    } catch (e) {
        console.error('Settings fetch error in port duty print:', e);
    }

    const bannerCfg = resolveSectionBannerConfig(consignment, 'port-duty');
    const title = `Container_Port_Duty_${bannerCfg.title || 'Page_0004'}`;
    const summary = calculatePortDutySummary(consignment, bills);
    const capex = calculateMasterProjectCapEx(dubaiSummary, summary, bdExpenseSummary);

    const extraCss = `
        .num-font {
            font-family: 'Inter', 'Segoe UI', Arial, sans-serif !important;
            font-feature-settings: 'tnum' 1;
            font-variant-numeric: tabular-nums;
        }
        .port-duty-table {
            width: 100% !important;
            border-collapse: collapse !important;
            border: 1.5px solid #334155 !important;
        }
        .port-duty-table th {
            border: 1px solid #334155 !important;
            background: #1e293b !important;
            color: #ffffff !important;
            padding: 4px 5px !important;
            font-size: 8.5px !important;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
        }
        .port-duty-table td {
            border: 1px solid #94a3b8 !important;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
        }
    `;

    const parts = generatePortDutyPaginationParts(consignment, bills, summary, capex, settings, bannerCfg);
    const paginatedHtml = await smartPaginatePrint({
        ...parts,
        extraCss,
        tableClass: 'port-duty-table',
        tableStyle: 'width:100%;border-collapse:collapse;border:1.5px solid #334155;',
        sheetPadding: '7mm 10mm',
        formattedDate: formatAppDate(getTodayLocalDateString())
    });

    await printViaIframe(paginatedHtml, extraCss, title);
}

function generatePortDutyPaginationParts(consignment, bills, summary, capex, settings, bannerCfg) {
    const totalDutyFormatted = formatAmountWithComma(summary.totalDuty);
    const dutyWords = numberToBanglaWords(summary.totalDuty);

    const rowsArray = bills.map((item, idx) => {
        const amtStr = formatAmountWithComma(item.amount);
        const appDate = formatAppDate(item.date);
        const bgStyle = idx % 2 === 1 ? 'background: #f8fafc;' : 'background: #ffffff;';
        const sizeBadge = (item.size && item.size !== '—') ? `<span style="display: inline-block; background: #e0f2fe; color: #0369a1; padding: 1px 4px; border-radius: 3px; font-size: 7px; font-weight: bold; margin-left: 4px;">${escapeHTML(item.size)}</span>` : '';

        return `
            <tr style="${bgStyle}">
                <td style="padding: 4px; text-align: center; font-size: 8.5px; color: #64748b; font-weight: bold;">${idx + 1}</td>
                <td style="padding: 4px; text-align: center; font-size: 8.5px; font-weight: 600; white-space: nowrap;">${appDate}</td>
                <td style="padding: 4px 6px; font-size: 9px; font-weight: 700; color: #0284c7;">
                    ${escapeHTML(item.containerNo || '—')}${sizeBadge}
                </td>
                <td style="padding: 4px 6px; font-size: 8.5px; font-weight: 600; color: #334155;">${escapeHTML(item.agent || '—')}</td>
                <td style="padding: 4px 6px; font-size: 8px; color: #475569;">${escapeHTML(item.description || 'কন্টেইনার ডিউটি, সিএন্ডএফ ও পোর্ট বিল')}</td>
                <td style="padding: 4px 6px; text-align: right; font-size: 9px; font-weight: 800; color: #b91c1c;" class="num-font">৳ ${amtStr}</td>
                <td style="padding: 4px; text-align: center; font-size: 8px; font-weight: 600; color: #047857;">${escapeHTML(item.status || 'চূড়ান্ত পরিশোধিত')}</td>
            </tr>
        `;
    });

    const page1HeaderHtml = `
        ${renderPrintHeader(settings, {
            title: bannerCfg.motherTitle,
            pageLabel: 'রেজিস্টার খাতা পাতা',
            pageNo: bannerCfg.pageNo || '০০০৪'
        })}
        ${renderNothiPrintSectionBanner(consignment, 'port-duty')}
    `;

    const repeatHeaderHtml = renderRepeatHeader(
        bannerCfg.motherTitle || 'কন্টেইনার ডিউটি, সিএন্ডএফ ও পোর্ট বিল রেজিস্টার',
        `রেজিস্টার খাতা পাতা: ${bannerCfg.pageNo || '০০০৪'}`
    );

    const page1ExtraHtml = `
        <div style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 5px; margin-bottom: 6px;">
            <div style="background: #f0f9ff; border: 1px solid #7dd3fc; border-radius: 4px; padding: 4px 6px; text-align: center;">
                <div style="font-size: 7.5px; font-weight: 700; color: #0369a1;">১. মোট কন্টেইনার সংখ্যা</div>
                <div style="font-size: 11px; font-weight: 900; color: #0284c7;">${summary.count} টি কন্টেইনার</div>
                <div style="font-size: 6.5px; color: #64748b;">১ নং হতে ${summary.count} নং কন্টেইনার খালাস</div>
            </div>
            <div style="background: #f0fdf4; border: 1px solid #86efac; border-radius: 4px; padding: 4px 6px; text-align: center;">
                <div style="font-size: 7.5px; font-weight: 700; color: #15803d;">২. প্রধান সিএন্ডএফ / মারফত</div>
                <div style="font-size: 11px; font-weight: 900; color: #059669;">আরমান ও মিতুল</div>
                <div style="font-size: 6.5px; color: #64748b;">চট্টগ্রাম বন্দর ক্লিয়ারিং ও ফরওয়ার্ডিং</div>
            </div>
            <div style="background: #fffbeb; border: 1.5px solid #f59e0b; border-radius: 4px; padding: 4px 6px; text-align: center;">
                <div style="font-size: 7.5px; font-weight: 800; color: #92400e;">৩. সর্বমোট কন্টেইনার ডিউটি ও পোর্ট বিল</div>
                <div style="font-size: 11.5px; font-weight: 900; color: #b45309;" class="num-font">৳ ${totalDutyFormatted}</div>
                <div style="font-size: 6.5px; color: #78350f;">সর্বসাকুল্যে খালাস ব্যয়</div>
            </div>
        </div>
    `;

    const tableColHeaderHtml = `
        <thead>
            <tr>
                <th style="width: 25px;">নং</th>
                <th style="width: 65px;">তারিখ</th>
                <th style="width: 140px; text-align: left;">কন্টেইনার নং ও সাইজ</th>
                <th style="width: 120px; text-align: left;">এজেন্ট / মারফত</th>
                <th style="width: 140px; text-align: left;">বিল বিবরণ / খাত</th>
                <th style="width: 95px; text-align: right;">টাকা (BDT)</th>
                <th style="width: 65px;">স্ট্যাটাস</th>
            </tr>
        </thead>
    `;

    const tableFooterRowsHtml = `
        <tr style="background: #fffbeb; font-weight: 900; border-top: 1.5px solid #d97706; border-bottom: 2px solid #d97706;">
            <td colspan="5" style="padding: 5px 6px; text-align: right; font-size: 9.5px; color: #92400e;">সর্বমোট কন্টেইনার ডিউটি ও পোর্ট বিল (${summary.count} টি কন্টেইনার):</td>
            <td style="padding: 5px 6px; text-align: right; font-size: 10.5px; font-weight: 900; color: #b45309;" class="num-font">৳ ${totalDutyFormatted}</td>
            <td style="padding: 5px 4px; text-align: center; font-size: 8px; color: #b45309;">সর্বমোট</td>
        </tr>
    `;

    const summaryHtml = `
        <div class="page-break-avoid" style="margin-top: 5px;">
            <div style="font-size: 8.5px; color: #334155;">
                <strong>কথায়:</strong> <span style="color: #92400e; font-weight: bold;">${escapeHTML(dutyWords)}</span>
            </div>
            <div style="margin-top: 6px; background: #f8fafc; border: 1.5px solid #cbd5e1; border-radius: 4px; padding: 4px 8px;">
                <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1px dashed #94a3b8; padding-bottom: 2px; margin-bottom: 3px;">
                    <div style="font-size: 8.5px; font-weight: 800; color: #0f172a;">
                        <span style="color: #0284c7;">১ম কনসোলমেন্টের সামগ্রিক মূলধন ও পুঁজী (Master CapEx):</span> ৩-স্তরের সমন্বিত হিসাব
                    </div>
                    <div style="font-size: 8.5px; font-weight: 800; color: #047857;">
                        সর্বমোট পুঁজী: <span style="font-size: 10.5px;" class="num-font">৳ ${formatAmountWithComma(capex.totalCapExBDT)}</span>
                    </div>
                </div>
                <div style="display: grid; grid-template-columns: 1fr 1fr 1fr 1fr; gap: 4px; text-align: center; font-size: 7.5px;">
                    <div style="background: #f0f9ff; padding: 2px; border-radius: 3px;">
                        ১. দুবাই ক্রয়: <strong>${formatAmountWithComma(capex.dubaiAED)} AED</strong><br>
                        <span class="num-font">৳ ${formatAmountWithComma(capex.dubaiBDT)}</span> (${capex.dubaiSharePct}%)
                    </div>
                    <div style="background: #fef2f2; padding: 2px; border-radius: 3px;">
                        ২. পোর্ট ও ডিউটি: <strong>${summary.count}টি কন্টেইনার</strong><br>
                        <span class="num-font">৳ ${totalDutyFormatted}</span> (${capex.portSharePct}%)
                    </div>
                    <div style="background: #fffbeb; padding: 2px; border-radius: 3px;">
                        ৩. বাংলাদেশ খরচ: <strong>সাবেক + রানিং</strong><br>
                        <span class="num-font">৳ ${formatAmountWithComma(capex.bdBDT)}</span> (${capex.bdSharePct}%)
                    </div>
                    <div style="background: #ecfdf5; padding: 2px; border-radius: 3px; font-weight: bold; color: #047857;">
                        সর্বমোট সামগ্রিক পুঁজী<br>
                        <span style="font-size: 9px;" class="num-font">৳ ${formatAmountWithComma(capex.totalCapExBDT)}</span> (১০০%)
                    </div>
                </div>
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
                    সিএন্ডএফ নিরীক্ষক (পোর্ট ইনচার্জ)
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

/**
 * Dubai Procurement - Container Port, Customs Duty & C&F Corporate Print Engine
 * Generates an executive A4 printable register voucher for Page 0004 matching MAA MOTORS ERP standards.
 */

import {
    formatAmountWithComma,
    escapeHTML,
    formatAppDate
} from '../utils.js';
import { SettingsDAO } from '../dao.js';
import { printViaIframe } from '../utils/smart-print-engine.js';
import { calculatePortDutySummary, calculateMasterProjectCapEx } from './dubai-port-duty-calc.js';

export async function printDubaiPortDutyBook(consignment, bills = [], dubaiSummary = null, bdExpenseSummary = null) {
    let settings = {};
    try {
        settings = (await SettingsDAO.getAppSettings()) || {};
    } catch (e) {
        console.error('Settings fetch error in port duty print:', e);
    }

    const title = `Container_Port_Duty_${consignment?.name || 'Consignment_1'}_Page_0004`;
    const summary = calculatePortDutySummary(consignment, bills);
    const capex = calculateMasterProjectCapEx(dubaiSummary, summary, bdExpenseSummary);
    const htmlBody = generatePortDutyPrintHtml(consignment, bills, summary, capex, settings);

    const extraCss = `
        @page { size: A4 portrait; margin: 0 !important; }
        html, body {
            font-family: 'Inter', 'Kalpurush', 'Hind Siliguri', sans-serif !important;
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
        tr { page-break-inside: avoid !important; }
        thead { display: table-header-group !important; }
        .port-print-sheet {
            width: 100% !important;
            max-width: 210mm !important;
            margin: 0 auto !important;
            box-sizing: border-box !important;
            padding: 7mm 10mm 7mm 10mm !important;
            background: #ffffff !important;
        }
        .print-sig-block {
            page-break-inside: avoid !important;
            break-inside: avoid !important;
        }
    `;

    printViaIframe(htmlBody, extraCss, title);
}

function generatePortDutyPrintHtml(consignment, bills, summary, capex, settings) {
    const shopName = settings.shopName || "মেসার্স মা মোটরস (M/S. MAA-MOTOR'S)";
    const ownerName = settings.ownerName || "স্বত্বাধিকারী: মোহাম্মদ এমরান (Mohammed Amran)";
    const address = settings.address || "দোকান নং-২২, রহমান টাওয়ার, ১ম রেলগেট, মুরাদপুর, হাটহাজারী রোড, চট্টগ্রাম। | মোবাইল: 01819-397669, 01815-707934";

    const totalDutyFormatted = formatAmountWithComma(summary.totalDuty);

    const rowsHtml = bills.map((item, idx) => {
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
    }).join('');

    return `
        <div class="port-print-sheet">
            <!-- Header Section -->
            <div style="border-bottom: 2px solid #0f172a; padding-bottom: 4px; margin-bottom: 6px; text-align: center;">
                <h1 style="font-size: 15px; font-weight: 900; color: #0284c7; margin: 0; padding: 0; text-transform: uppercase;">${escapeHTML(shopName)}</h1>
                <div style="font-size: 8.5px; font-weight: 700; color: #1e293b; margin-top: 1px;">${escapeHTML(ownerName)}</div>
                <div style="font-size: 7px; color: #475569; margin-top: 1px;">${escapeHTML(address)}</div>
                
                <div style="margin-top: 4px; display: inline-block; background: #0f172a; color: #fff; padding: 2px 14px; border-radius: 4px;">
                    <span style="font-size: 10px; font-weight: 900; letter-spacing: 0.5px;">কন্টেইনার ডিউটি, সিএন্ডএফ (C&F), পোর্ট বিল ও শিপিং বিল রেজিস্টার</span>
                </div>
                <div style="font-size: 7.5px; font-weight: 700; color: #334155; margin-top: 3px;">
                    ${escapeHTML(consignment?.name || '১ম কনসোলমেন্ট কন্টেইনার ক্লিয়ারেন্স ও খালাস রেজিস্টার')} | 
                    <span style="color: #b91c1c;">খাতা পাতা: ০০০৪</span> | 
                    সময়কাল: ০৫/১১/২০২৫ হইতে ২১/১০/২০২৬ পর্যন্ত
                </div>
            </div>

            <!-- 3 Master KPI Summary Cards -->
            <div style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 5px; margin-bottom: 6px;">
                <div style="background: #f0f9ff; border: 1px solid #7dd3fc; border-radius: 4px; padding: 4px 6px; text-align: center;">
                    <div style="font-size: 7.5px; font-weight: 700; color: #0369a1;">১. মোট কন্টেইনার সংখ্যা</div>
                    <div style="font-size: 11px; font-weight: 900; color: #0284c7;">${summary.count} টি কন্টেইনার</div>
                    <div style="font-size: 6.5px; color: #64748b;">১ নং হতে ৭ নং কন্টেইনার খালাস</div>
                </div>
                <div style="background: #f0fdf4; border: 1px solid #86efac; border-radius: 4px; padding: 4px 6px; text-align: center;">
                    <div style="font-size: 7.5px; font-weight: 700; color: #15803d;">২. প্রধান সিএন্ডএফ / মারফত</div>
                    <div style="font-size: 11px; font-weight: 900; color: #059669;">আরমান ও মিতুল</div>
                    <div style="font-size: 6.5px; color: #64748b;">চট্টগ্রাম বন্দর ক্লিয়ারিং ও ফরওয়ার্ডিং</div>
                </div>
                <div style="background: #fffbeb; border: 1.5px solid #f59e0b; border-radius: 4px; padding: 4px 6px; text-align: center;">
                    <div style="font-size: 7.5px; font-weight: 800; color: #92400e;">৩. সর্বমোট কন্টেইনার ডিউটি ও পোর্ট বিল</div>
                    <div style="font-size: 11.5px; font-weight: 900; color: #b45309;" class="num-font">৳ ${totalDutyFormatted}</div>
                    <div style="font-size: 6.5px; color: #78350f;">১ হতে ৭ নং কন্টেইনার সর্বসাকুল্যে খালাস ব্যয়</div>
                </div>
            </div>

            <!-- Detailed Expense Register Table -->
            <table class="port-duty-table">
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
                <tbody>
                    ${rowsHtml}

                    <!-- Grand Total Row -->
                    <tr style="background: #fffbeb; font-weight: 900; border-top: 1.5px solid #d97706; border-bottom: 2px solid #d97706;">
                        <td colspan="5" style="padding: 5px 6px; text-align: right; font-size: 9.5px; color: #92400e;">সর্বমোট কন্টেইনার ডিউটি ও পোর্ট বিল (১ হতে ৭ নং কন্টেইনার):</td>
                        <td style="padding: 5px 6px; text-align: right; font-size: 10.5px; font-weight: 900; color: #b45309;" class="num-font">৳ ${totalDutyFormatted}</td>
                        <td style="padding: 5px 4px; text-align: center; font-size: 8px; color: #b45309;">সর্বমোট</td>
                    </tr>
                </tbody>
            </table>

            <!-- Words Representation -->
            <div style="margin-top: 5px; font-size: 8.5px; color: #334155;">
                <strong>কথায়:</strong> <span style="color: #92400e; font-weight: bold;">দুই কোটি একান্ন লাখ পঞ্চাশ হাজার সাতশত তেরো টাকা মাত্র।</span>
            </div>

            <!-- 3-Tier Master Project CapEx Consolidation Box -->
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
                        ২. পোর্ট ও ডিউটি: <strong>৭টি কন্টেইনার</strong><br>
                        <span class="num-font">৳ ${totalDutyFormatted}</span> (${capex.portSharePct}%)
                    </div>
                    <div style="background: #fffbeb; padding: 2px; border-radius: 3px;">
                        ৩. বাংলাদেশ খরচ: <strong>১৯ কিস্তি + সাবেক</strong><br>
                        <span class="num-font">৳ ${formatAmountWithComma(capex.bdBDT)}</span> (${capex.bdSharePct}%)
                    </div>
                    <div style="background: #ecfdf5; padding: 2px; border-radius: 3px; font-weight: bold; color: #047857;">
                        সর্বমোট সামগ্রিক পুঁজী<br>
                        <span style="font-size: 9px;" class="num-font">৳ ${formatAmountWithComma(capex.totalCapExBDT)}</span> (১০০%)
                    </div>
                </div>
            </div>

            <!-- Signatures Section -->
            <div class="print-sig-block" style="margin-top: 18px; display: grid; grid-template-columns: repeat(4, 1fr); gap: 8px; text-align: center;">
                <div style="padding-top: 20px; border-top: 1px solid #64748b; font-size: 7.5px; font-weight: bold; color: #334155;">
                    প্রস্তুতকারক (হিসাব বিভাগ)
                </div>
                <div style="padding-top: 20px; border-top: 1px solid #64748b; font-size: 7.5px; font-weight: bold; color: #334155;">
                    সিএন্ডএফ নিরীক্ষক (পোর্ট ইনচার্জ)
                </div>
                <div style="padding-top: 20px; border-top: 1px solid #64748b; font-size: 7.5px; font-weight: bold; color: #334155;">
                    পার্টনার অনুমোদন
                </div>
                <div style="padding-top: 20px; border-top: 1px solid #64748b; font-size: 7.5px; font-weight: bold; color: #0f172a;">
                    মোহাম্মদ এমরান (স্বত্বাধিকারী)
                </div>
            </div>
        </div>
    `;
}

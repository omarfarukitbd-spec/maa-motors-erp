/**
 * Dubai Remittance & Consignment - Official Corporate Print Engine
 * Generates an executive A4 printable register voucher matching MAA MOTORS ERP standards.
 */

import {
    formatAmountWithComma,
    parseAmount,
    safeRound,
    renderPrintHeader,
    escapeHTML,
    formatAppDate
} from '../utils.js';
import { SettingsDAO } from '../dao.js';
import { printViaIframe } from '../utils/smart-print-engine.js';
import { calculateConsignmentSummary } from './dubai-remittance-calc.js';

export async function printDubaiRemittanceBook(consignment, entries = []) {
    let settings = {};
    try {
        settings = (await SettingsDAO.getAppSettings()) || {};
    } catch (e) {
        console.error('Settings fetch error in remittance print:', e);
    }

    const title = `Dubai_Remittance_${consignment?.name || 'Consignment_1'}`;
    const summary = calculateConsignmentSummary(consignment, entries);
    const htmlBody = generateRemittancePrintHtml(consignment, entries, summary, settings);

    const extraCss = `
        @page { size: A4 portrait; margin: 5mm 8mm 5mm 8mm !important; }
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
        table { border-collapse: collapse; width: 100%; }
        tr { page-break-inside: avoid !important; }
        thead { display: table-header-group !important; }
        .remittance-print-sheet {
            width: 100% !important;
            max-width: 210mm !important;
            margin: 0 auto !important;
            box-sizing: border-box !important;
            padding: 2mm 4mm !important;
            background: #ffffff !important;
        }
    `;

    printViaIframe(htmlBody, extraCss, title);
}

function generateRemittancePrintHtml(consignment, entries, summary, settings) {
    const shopName = settings.shopName || "মেসার্স মা মোটরস (M/S. MAA-MOTOR'S)";
    const ownerName = settings.ownerName || "স্বত্বাধিকারী: মোহাম্মদ এমরান (Mohammed Amran)";
    const address = settings.address || "দোকান নং-২২, রহমান টাওয়ার, ১ম রেলগেট, মুরাদপুর, হাটহাজারী রোড, চট্টগ্রাম। | মোবাইল: 01819-397669, 01815-707934";

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

    let rowsHtml = '';
    // Row 0: Opening / Former Balance
    rowsHtml += `
        <tr style="background: #eff6ff; border-bottom: 1px solid #bfdbfe;">
            <td style="text-align: center; color: #0284c7; font-weight: 800; padding: 3px 4px;">০</td>
            <td style="text-align: center; font-weight: 600; padding: 3px 4px;" class="num-font">13/10/2026</td>
            <td style="font-weight: 800; color: #0369a1; padding: 3px 4px;">সাবেক (পূর্ববর্তী কিউমুলেটিভ ব্যালেন্স)</td>
            <td style="text-align: center; font-weight: 700; color: #475569; padding: 3px 4px;" class="num-font">${summary.stage2.rate.toFixed(2)}</td>
            <td style="text-align: right; font-weight: 800; color: #059669; padding: 3px 4px;" class="num-font">${s2Aed}</td>
            <td style="text-align: right; font-weight: 800; color: #dc2626; padding: 3px 4px;" class="num-font">৳ ${s2Bdt}</td>
            <td style="text-align: center; padding: 3px 4px;"><span style="background: #e0f2fe; color: #0369a1; border: 1px solid #bae6fd; padding: 1px 4px; border-radius: 3px; font-size: 7.5px; font-weight: 700;">সাবেক শুরু</span></td>
        </tr>
    `;

    entries.forEach((e, idx) => {
        const aedStr = formatAmountWithComma(safeRound(parseAmount(e.aedAmount || 0)));
        const bdtStr = formatAmountWithComma(safeRound(parseAmount(e.bdtAmount || 0)));
        const dtStr = formatAppDate(e.date);
        const rateStr = (parseAmount(e.rate) || 0).toFixed(2);
        const bg = (idx % 2 === 1) ? 'background: #f8fafc;' : 'background: #ffffff;';

        rowsHtml += `
            <tr style="${bg} border-bottom: 1px solid #e2e8f0;">
                <td style="text-align: center; color: #64748b; font-weight: 700; padding: 2.5px 4px;">${idx + 1}</td>
                <td style="text-align: center; font-weight: 600; padding: 2.5px 4px;" class="num-font">${escapeHTML(dtStr)}</td>
                <td style="font-weight: 600; color: #0f172a; padding: 2.5px 4px;">${escapeHTML(e.via || '')}</td>
                <td style="text-align: center; font-weight: 700; color: #475569; padding: 2.5px 4px;" class="num-font">${rateStr}</td>
                <td style="text-align: right; font-weight: 800; color: #059669; padding: 2.5px 4px;" class="num-font">${aedStr}</td>
                <td style="text-align: right; font-weight: 800; color: #dc2626; padding: 2.5px 4px;" class="num-font">৳ ${bdtStr}</td>
                <td style="text-align: center; padding: 2.5px 4px;"><span style="background: #ecfdf5; color: #047857; border: 1px solid #a7f3d0; padding: 1px 4px; border-radius: 3px; font-size: 7.5px; font-weight: 700;">${escapeHTML(e.status || 'পরিশোধিত')}</span></td>
            </tr>
        `;
    });

    return `
        <div class="remittance-print-sheet">
            <!-- Header Banner -->
            <div style="display: flex; align-items: center; justify-content: space-between; background: linear-gradient(135deg, #0284c7 0%, #0369a1 100%); border-radius: 6px; padding: 6px 12px; color: #ffffff; margin-bottom: 5px;">
                <div style="display: flex; align-items: center; gap: 9px;">
                    <div style="width: 40px; height: 40px; border-radius: 50%; border: 2px solid #fff; background: #fff; display: flex; align-items: center; justify-content: center; font-size: 20px; color: #0284c7; font-weight: 900;">MM</div>
                    <div>
                        <h1 style="font-size: 15px; font-weight: 800; margin: 0 0 1px 0; letter-spacing: 0.3px;">${escapeHTML(shopName)}</h1>
                        <div style="font-size: 8.5px; font-weight: 600; color: #e0f2fe; margin-bottom: 1px;">${escapeHTML(ownerName)}</div>
                        <div style="font-size: 7.5px; color: #bae6fd; line-height: 1.15;">${escapeHTML(address)}</div>
                    </div>
                </div>
                <div style="text-align: right;">
                    <div style="background: rgba(255, 255, 255, 0.22); border: 1px solid rgba(255, 255, 255, 0.45); padding: 2px 7px; border-radius: 4px; font-size: 8.5px; font-weight: 700; letter-spacing: 0.6px; display: inline-block; margin-bottom: 2px;">DUBAI REMITTANCE BOOK</div>
                    <div style="font-size: 7.5px; color: #e0f2fe;">রেজিস্টার খাতা পাতা: <span class="num-font" style="font-weight: 700;">০০০১</span></div>
                </div>
            </div>

            <!-- Title Bar with Consignment Status -->
            <div style="background: #0f172a; color: #ffffff; display: flex; justify-content: space-between; align-items: center; padding: 4px 10px; border-radius: 4px; margin-bottom: 5px;">
                <h2 style="margin: 0; font-size: 11px; font-weight: 700;">ডুবাই টাকা পাঠানো এর হিসাব — ${escapeHTML(consignment?.name || 'এমরান ব্যক্তিগত ১ম কনসোলমেন্ট, ডুবাই মাল ক্রয় ইনভেস্ট')}</h2>
                <span style="background: #10b981; color: #ffffff; font-size: 8px; font-weight: 700; padding: 2px 6px; border-radius: 12px;">● চলমান কনসোলমেন্ট (Active)</span>
            </div>

            <!-- 4 Master KPI Grid -->
            <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 5px; margin-bottom: 5px;">
                <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-left: 2.5px solid #6366f1; border-radius: 4px; padding: 3px 5px; text-align: center;">
                    <div style="font-size: 7.5px; font-weight: 700; color: #64748b; margin-bottom: 1px;">১. পর্যায় ১ (২০২৫ ইনভেস্ট)</div>
                    <div class="num-font" style="font-size: 10px; font-weight: 900; color: #4f46e5; line-height: 1.2;">${s1Aed} AED</div>
                    <div style="font-size: 7px; color: #475569; font-weight: 600;">৳ ${s1Bdt} (রেট: ${summary.stage1.rate})</div>
                </div>
                <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-left: 2.5px solid #0284c7; border-radius: 4px; padding: 3px 5px; text-align: center;">
                    <div style="font-size: 7.5px; font-weight: 700; color: #64748b; margin-bottom: 1px;">২. পর্যায় ২ সাবেক (২০২৬ সাবেক)</div>
                    <div class="num-font" style="font-size: 10px; font-weight: 900; color: #0284c7; line-height: 1.2;">${s2Aed} AED</div>
                    <div style="font-size: 7px; color: #475569; font-weight: 600;">৳ ${s2Bdt} (রেট: ${summary.stage2.rate.toFixed(2)})</div>
                </div>
                <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-left: 2.5px solid #059669; border-radius: 4px; padding: 3px 5px; text-align: center;">
                    <div style="font-size: 7.5px; font-weight: 700; color: #64748b; margin-bottom: 1px;">৩. পর্যায় ৩ রানিং (${summary.stage3.count} কিস্তি)</div>
                    <div class="num-font" style="font-size: 10px; font-weight: 900; color: #059669; line-height: 1.2;">${s3Aed} AED</div>
                    <div style="font-size: 7px; color: #475569; font-weight: 600;">৳ ${s3Bdt} (গড়: ${summary.stage3.rate.toFixed(2)})</div>
                </div>
                <div style="background: #fffbeb; border: 1px solid #fde68a; border-left: 2.5px solid #d97706; border-radius: 4px; padding: 3px 5px; text-align: center;">
                    <div style="font-size: 7.5px; font-weight: 800; color: #b45309; margin-bottom: 1px;">৪. ১ম কনসোলমেন্ট সর্বমোট তহবিল</div>
                    <div class="num-font" style="font-size: 10px; font-weight: 900; color: #b45309; line-height: 1.2;">${grandAed} AED</div>
                    <div style="font-size: 7px; color: #92400e; font-weight: 700;">৳ ${grandBdt} (গড়: ${summary.grandTotal.rate.toFixed(2)})</div>
                </div>
            </div>

            <!-- Detail Table -->
            <table style="width: 100%; border-collapse: collapse; font-size: 8.5px; border: 1px solid #cbd5e1;">
                <thead>
                    <tr style="background: #1e293b; color: #ffffff;">
                        <th style="width: 4%; padding: 3px 4px; border: 1px solid #334155; text-align: center; font-size: 8px;">নং</th>
                        <th style="width: 11%; padding: 3px 4px; border: 1px solid #334155; text-align: center; font-size: 8px;">তারিখ</th>
                        <th style="width: 32%; padding: 3px 4px; border: 1px solid #334155; text-align: left; font-size: 8px;">বিবরণ / মারফত (Particulars)</th>
                        <th style="width: 9%; padding: 3px 4px; border: 1px solid #334155; text-align: center; font-size: 8px;">রেট (Rate)</th>
                        <th style="width: 18%; padding: 3px 4px; border: 1px solid #334155; text-align: right; font-size: 8px;">দিরহাম (AED)</th>
                        <th style="width: 18%; padding: 3px 4px; border: 1px solid #334155; text-align: right; font-size: 8px;">টাকা (BDT / TK)</th>
                        <th style="width: 8%; padding: 3px 4px; border: 1px solid #334155; text-align: center; font-size: 8px;">স্ট্যাটাস</th>
                    </tr>
                </thead>
                <tbody>
                    ${rowsHtml}

                    <!-- 1. Running Subtotal Row -->
                    <tr style="background: #f8fafc; font-weight: 700; border-top: 1.5px solid #cbd5e1; color: #475569;">
                        <td colspan="3" style="text-align: right; padding: 2.5px 4px;">চলমান খাতার উপ-মোট (${summary.stage3.count} টি লেনদেন):</td>
                        <td style="text-align: center; padding: 2.5px 4px;" class="num-font">${summary.stage3.rate.toFixed(2)}</td>
                        <td style="text-align: right; font-weight: 800; color: #059669; padding: 2.5px 4px;" class="num-font">${s3Aed} AED</td>
                        <td style="text-align: right; font-weight: 800; color: #dc2626; padding: 2.5px 4px;" class="num-font">৳ ${s3Bdt}</td>
                        <td style="text-align: center; font-size: 7px; color: #64748b; padding: 2.5px 4px;">উপ-মোট</td>
                    </tr>

                    <!-- 2. 2026 Session Cumulative Total Row -->
                    <tr style="background: #f0fdf4; font-weight: 800; border-top: 1.5px solid #10b981; color: #065f46;">
                        <td colspan="3" style="text-align: right; padding: 2.5px 4px;">২০২৬ সেশনের মোট তহবিল (সাবেক সহ):</td>
                        <td style="text-align: center; padding: 2.5px 4px;" class="num-font">${summary.session2026.rate.toFixed(2)}</td>
                        <td style="text-align: right; font-weight: 800; color: #047857; padding: 2.5px 4px;" class="num-font">${session2026Aed} AED</td>
                        <td style="text-align: right; font-weight: 800; color: #047857; padding: 2.5px 4px;" class="num-font">৳ ${session2026Bdt}</td>
                        <td style="text-align: center; padding: 2.5px 4px;"><span style="background: #d1fae5; color: #065f46; border: 1px solid #a7f3d0; padding: 1px 4px; border-radius: 3px; font-size: 7px; font-weight: 700;">২০২৬ মোট</span></td>
                    </tr>

                    <!-- 3. ALL-TIME 1ST CONSIGNMENT GRAND TOTAL -->
                    <tr style="background: #eff6ff; font-weight: 900; border-top: 2px solid #0284c7; border-bottom: 2px solid #0284c7;">
                        <td colspan="3" style="text-align: right; font-size: 9.5px; color: #0f172a; padding: 3px 4px;">১ম কনসোলমেন্টের সর্বমোট তহবিল (পর্যায় ১ + ২ + ৩):</td>
                        <td style="text-align: center; font-size: 9px; color: #0284c7; padding: 3px 4px;" class="num-font">${summary.grandTotal.rate.toFixed(2)}</td>
                        <td style="text-align: right; font-size: 10px; font-weight: 900; color: #047857; padding: 3px 4px;" class="num-font">${grandAed} AED</td>
                        <td style="text-align: right; font-size: 10px; font-weight: 900; color: #b91c1c; padding: 3px 4px;" class="num-font">৳ ${grandBdt}</td>
                        <td style="text-align: center; padding: 3px 4px;"><span style="background: #0284c7; color: #fff; padding: 1px 4px; border-radius: 3px; font-size: 7px; font-weight: 800;">সর্বমোট</span></td>
                    </tr>
                </tbody>
            </table>

            <!-- Master Consignment Closure & Rollover Certificate Box -->
            <div style="margin-top: 5px; background: #fffbeb; border: 1.5px solid #f59e0b; border-radius: 4px; padding: 4px 7px; font-size: 8px; color: #78350f;">
                <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1px dashed #d97706; padding-bottom: 2px; margin-bottom: 3px;">
                    <div style="font-size: 9px; font-weight: 800; color: #92400e;"><i class="fa-solid fa-certificate" style="color: #d97706; margin-right: 4px;"></i>এমরান ব্যক্তিগত ১ম কনসোলমেন্ট — সার্বিক সমাপ্তি ও ২য় কনসোলমেন্টে স্থানান্তর বিবরণী</div>
                    <span style="font-weight: 700; color: #92400e; font-size: 7.5px;">স্ট্যাটাস: চলমান (মাল ক্রয় শেষে ক্লোজ হবে)</span>
                </div>
                <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 5px; text-align: center; margin-bottom: 3px;">
                    <div style="background: #fff; border: 1px solid #fde68a; border-radius: 3px; padding: 2px;">
                        <div style="font-size: 7px; font-weight: 700; color: #92400e;">১ম পর্যায় (২০২৫)</div>
                        <div class="num-font" style="font-size: 9px; font-weight: 900; color: #4f46e5;">${s1Aed} AED</div>
                        <div style="font-size: 6.8px; color: #475569;">৳ ${s1Bdt}</div>
                    </div>
                    <div style="background: #fff; border: 1px solid #fde68a; border-radius: 3px; padding: 2px;">
                        <div style="font-size: 7px; font-weight: 700; color: #92400e;">২য় পর্যায় (২০২৬ সাবেক)</div>
                        <div class="num-font" style="font-size: 9px; font-weight: 900; color: #0284c7;">${s2Aed} AED</div>
                        <div style="font-size: 6.8px; color: #475569;">৳ ${s2Bdt}</div>
                    </div>
                    <div style="background: #fff; border: 1px solid #fde68a; border-radius: 3px; padding: 2px;">
                        <div style="font-size: 7px; font-weight: 700; color: #92400e;">৩য় পর্যায় (চলমান খাতা)</div>
                        <div class="num-font" style="font-size: 9px; font-weight: 900; color: #059669;">${s3Aed} AED</div>
                        <div style="font-size: 6.8px; color: #475569;">৳ ${s3Bdt}</div>
                    </div>
                    <div style="background: #fef3c7; border: 1px solid #f59e0b; border-radius: 3px; padding: 2px;">
                        <div style="font-size: 7px; font-weight: 800; color: #92400e;">১ম কনসোলমেন্ট সর্বমোট তহবিল</div>
                        <div class="num-font" style="font-size: 9.5px; font-weight: 900; color: #b45309;">${grandAed} AED</div>
                        <div style="font-size: 7px; font-weight: 700; color: #b91c1c;">৳ ${grandBdt}</div>
                    </div>
                </div>
                <div style="font-size: 7.5px; line-height: 1.25; color: #451a03; background: rgba(254, 243, 199, 0.6); padding: 2px 5px; border-radius: 3px;">
                    <i class="fa-solid fa-circle-info" style="color: #d97706; margin-right: 3px;"></i><strong>ক্লোজিং ও ২য় কনসোলমেন্ট রোল-ওভার নীতি:</strong> এই ১ম কনসোলমেন্টের অধীনে আরও লেনদেন যুক্ত করা যাবে। ১ম কনসোলমেন্টের সম্পূর্ণ মাল ক্রয় শেষ হলে হিসাবটি আনুষ্ঠানিকভাবে <strong>"ক্লোজ / সমাপ্ত"</strong> হবে এবং এর চূড়ান্ত সমাপনী ব্যালেন্স স্বয়ংক্রিয়ভাবে <strong>'এমরান ব্যক্তিগত ২য় কনসোলমেন্ট'</strong>-এর প্রারম্ভিক তহবিল (Opening Balance) হিসেবে স্থানান্তরিত হবে।
                </div>
            </div>

            <!-- 4 Signatures Block -->
            <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 8px; margin-top: 8px;">
                <div style="text-align: center; border-top: 1.2px dashed #64748b; padding-top: 2px; font-size: 7.5px; color: #334155; font-weight: 600;">প্রস্তুতকারক (হিসাব বিভাগ)</div>
                <div style="text-align: center; border-top: 1.2px dashed #64748b; padding-top: 2px; font-size: 7.5px; color: #334155; font-weight: 600;">অভ্যন্তরীণ নিরীক্ষক (অফিস ইনচার্জ)</div>
                <div style="text-align: center; border-top: 1.2px dashed #64748b; padding-top: 2px; font-size: 7.5px; color: #334155; font-weight: 600;">পার্টনার অনুমোদন</div>
                <div style="text-align: center; border-top: 1.2px dashed #64748b; padding-top: 2px; font-size: 7.5px; color: #334155; font-weight: 600;">মোহাম্মদ এমরান (স্বত্বাধিকারী)</div>
            </div>
        </div>
    `;
}

import { formatAmountWithComma, numberToBanglaWords, escapeHTML } from '../utils.js';
import { printViaIframe } from '../utils/smart-print-engine.js';
import { renderSharedPrintHeader } from '../shared/print/print-header.js';
import { SettingsDAO } from '../dao.js';

/**
 * Generate and trigger ultra-clean, branded A4 print voucher for Container Settlement
 * Matches official Maa Motors print design system (shared gradient header, Kalpurush/Hind Siliguri typography)
 * @param {Object} settlement Settlement document object
 */
export async function printContainerSettlement(settlement) {
    if (!settlement) return;

    let settings = {};
    try {
        settings = (await SettingsDAO.getAppSettings()) || {};
    } catch (e) {
        console.warn('Settings fetch error in container print:', e);
    }

    const title = settlement.title || 'কন্টেইনার মাল বিক্রয় ও খরচের হিসাব';
    const date = settlement.settlementDate || new Date().toLocaleDateString('en-GB');
    const period = settlement.fiscalPeriod || '';
    const containerCount = settlement.containerCount || 27;
    const netProfit = Math.round(Number(settlement.netProfit) || 0);
    const finalBalance = Math.round(Number(settlement.finalNetBalance) || 0);
    const totalDistProfit = Math.round(Number(settlement.totalDistributedProfit) || netProfit);

    // numberToBanglaWords already appends "টাকা মাত্র"
    const netProfitWords = netProfit > 0 ? numberToBanglaWords(netProfit) : '';
    const finalBalanceWords = finalBalance > 0 ? numberToBanglaWords(finalBalance) : '';

    // 1. Official Canonical Gradient Header
    const headerHtml = renderSharedPrintHeader(settings, {
        title: title,
        subtitle: `তারিখ: ${date} ${period ? `| অর্থবছর: ${period}` : ''}`
    });

    // 2. Section 1: Sales & Costs Rows
    const salesCostsRows = (settlement.salesAndCosts || []).map((row, idx) => {
        const isPlus = row.op === '+';
        const roundedAmt = Math.round(Number(row.amount) || 0);
        return `
            <tr style="border-bottom: 1px solid #cbd5e1; background: ${idx % 2 === 0 ? '#ffffff' : '#f8fafc'};">
                <td style="padding: 6px 8px; text-align: center; color: #64748b; font-weight: 700; width: 35px; border: 1px solid #cbd5e1;">${idx + 1}</td>
                <td style="padding: 6px 12px; font-weight: 700; color: #1e293b; border: 1px solid #cbd5e1;">${escapeHTML(row.desc)}</td>
                <td style="padding: 6px 8px; text-align: center; width: 75px; border: 1px solid #cbd5e1;">
                    <span style="display: inline-block; padding: 2px 8px; border-radius: 4px; font-weight: 800; font-size: 11px; ${isPlus ? 'background: #ecfdf5; color: #059669; border: 1px solid #a7f3d0;' : 'background: #fef2f2; color: #dc2626; border: 1px solid #fecaca;'}">
                        ${isPlus ? '(+) আয়' : '(-) বাদ'}
                    </span>
                </td>
                <td style="padding: 6px 12px; text-align: right; font-weight: 800; font-size: 13px; color: ${isPlus ? '#059669' : '#dc2626'}; border: 1px solid #cbd5e1;" class="num-font">
                    ৳ ${formatAmountWithComma(roundedAmt)}
                </td>
            </tr>
        `;
    }).join('');

    // 3. Section 2: Profit Sharing Rows
    const profitRows = (settlement.profitSharing || []).map((p, idx) => {
        const roundedAmt = Math.round(Number(p.calculatedAmount) || 0);
        return `
            <tr style="border-bottom: 1px solid #cbd5e1; background: ${idx % 2 === 0 ? '#ffffff' : '#f8fafc'};">
                <td style="padding: 6px 8px; text-align: center; color: #64748b; font-weight: 700; width: 35px; border: 1px solid #cbd5e1;">${idx + 1}</td>
                <td style="padding: 6px 12px; font-weight: 800; color: #0f172a; border: 1px solid #cbd5e1;">${escapeHTML(p.partnerName)}</td>
                <td style="padding: 6px 10px; color: #475569; font-weight: 600; border: 1px solid #cbd5e1;">${escapeHTML(p.shareType || 'শেয়ার')}</td>
                <td style="padding: 6px 10px; text-align: center; font-weight: 800; color: #0284c7; width: 75px; border: 1px solid #cbd5e1;" class="num-font">${p.percentage}%</td>
                <td style="padding: 6px 12px; text-align: right; font-weight: 800; font-size: 13px; color: #0f172a; border: 1px solid #cbd5e1;" class="num-font">
                    ৳ ${formatAmountWithComma(roundedAmt)}
                </td>
            </tr>
        `;
    }).join('');

    // 4. Section 3: Capital & Waterfall Rows
    const capitalRows = (settlement.capitalSettlements || []).map((row, idx) => {
        const isPlus = row.op === '+';
        const roundedAmt = Math.round(Number(row.amount) || 0);
        return `
            <tr style="border-bottom: 1px solid #cbd5e1; background: ${idx % 2 === 0 ? '#ffffff' : '#f8fafc'};">
                <td style="padding: 6px 8px; text-align: center; color: #64748b; font-weight: 700; width: 35px; border: 1px solid #cbd5e1;">${idx + 1}</td>
                <td style="padding: 6px 12px; font-weight: 700; color: #1e293b; border: 1px solid #cbd5e1;">${escapeHTML(row.desc)}</td>
                <td style="padding: 6px 8px; text-align: center; width: 75px; border: 1px solid #cbd5e1;">
                    <span style="display: inline-block; padding: 2px 8px; border-radius: 4px; font-weight: 800; font-size: 11px; ${isPlus ? 'background: #ecfdf5; color: #059669; border: 1px solid #a7f3d0;' : 'background: #fef2f2; color: #dc2626; border: 1px solid #fecaca;'}">
                        ${isPlus ? '(+) যোগ' : '(-) বাদ'}
                    </span>
                </td>
                <td style="padding: 6px 12px; text-align: right; font-weight: 800; font-size: 13px; color: ${isPlus ? '#059669' : '#dc2626'}; border: 1px solid #cbd5e1;" class="num-font">
                    ৳ ${formatAmountWithComma(roundedAmt)}
                </td>
            </tr>
        `;
    }).join('');

    const htmlBody = `
        <div class="print-sheet">
            <!-- Header -->
            <div style="margin-bottom: 10px;">
                ${headerHtml}
            </div>

            <!-- Executive Metadata Bar -->
            <div style="display: grid; grid-template-columns: 1.2fr 1.3fr 1.1fr 1.2fr; gap: 8px; background: #f8fafc; border: 1.5px solid #cbd5e1; border-radius: 8px; padding: 8px 14px; margin-bottom: 12px;">
                <div>
                    <div style="font-size: 10px; font-weight: 700; color: #64748b; text-transform: uppercase;">কন্টেইনার সংখ্যা:</div>
                    <div style="font-size: 13px; font-weight: 900; color: #0f172a; margin-top: 1px;">${containerCount} টি কন্টেইনার</div>
                </div>
                <div>
                    <div style="font-size: 10px; font-weight: 700; color: #64748b; text-transform: uppercase;">হিসাবের তারিখ:</div>
                    <div style="font-size: 13px; font-weight: 800; color: #0284c7; margin-top: 1px;">${escapeHTML(date)}</div>
                </div>
                <div>
                    <div style="font-size: 10px; font-weight: 700; color: #64748b; text-transform: uppercase;">অর্থবছর / ব্যাচ:</div>
                    <div style="font-size: 13px; font-weight: 800; color: #0f172a; margin-top: 1px;">${escapeHTML(period || '২০২৪ - ২০২৫')}</div>
                </div>
                <div style="text-align: right;">
                    <div style="font-size: 10px; font-weight: 700; color: #64748b; text-transform: uppercase;">স্ট্যাটাস:</div>
                    <div style="margin-top: 2px;">
                        <span style="display: inline-block; background: #ecfdf5; color: #059669; border: 1px solid #a7f3d0; font-size: 11px; font-weight: 800; padding: 2px 8px; border-radius: 5px;">
                            চূড়ান্ত নিষ্পত্তি (Final)
                        </span>
                    </div>
                </div>
            </div>

            <!-- Section 1: Sales & Costs -->
            <div class="page-break-avoid" style="margin-bottom: 14px; border: 1px solid #cbd5e1; border-radius: 8px; overflow: hidden;">
                <div style="background: #0f172a; color: #ffffff; padding: 6px 12px; font-weight: 800; font-size: 12px; display: flex; justify-content: space-between; align-items: center;">
                    <span>১. মাল বিক্রয় ও কন্টেইনার লাভ হিসাব</span>
                    <span style="font-size: 11px; color: #94a3b8; font-weight: 600;">বিক্রয় – খরচ = মোট লাভ</span>
                </div>
                <table class="print-table" style="font-size: 12px;">
                    <tbody>
                        ${salesCostsRows}
                    </tbody>
                    <tfoot>
                        <tr style="background: #f1f5f9; border-top: 2px solid #cbd5e1;">
                            <td colspan="3" style="padding: 8px 12px; font-weight: 800; text-align: right; font-size: 13px; color: #0f172a; border: 1px solid #cbd5e1;">
                                সর্বমোট কন্টেইনার লাভ:
                            </td>
                            <td style="padding: 8px 12px; font-weight: 900; font-size: 14.5px; text-align: right; color: #059669; border: 1px solid #cbd5e1;" class="num-font">
                                ৳ ${formatAmountWithComma(netProfit)}
                            </td>
                        </tr>
                    </tfoot>
                </table>
                ${netProfitWords ? `<div style="padding: 5px 12px; background: #f8fafc; font-size: 10.5px; color: #334155; font-weight: 700; border-top: 1px dashed #cbd5e1;">কথায়: ${escapeHTML(netProfitWords)}</div>` : ''}
            </div>

            <!-- Section 2: Profit Sharing -->
            <div class="page-break-avoid" style="margin-bottom: 14px; border: 1px solid #cbd5e1; border-radius: 8px; overflow: hidden;">
                <div style="background: #0f172a; color: #ffffff; padding: 6px 12px; font-weight: 800; font-size: 12px; display: flex; justify-content: space-between; align-items: center;">
                    <span>২. পার্টনারদের লভ্যাংশ বণ্টন</span>
                    <span style="font-size: 11px; color: #94a3b8; font-weight: 600;">ইকুইটি ও ওয়ার্কিং শেয়ার ভিত্তিক</span>
                </div>
                <table class="print-table" style="font-size: 12px;">
                    <thead>
                        <tr style="background: #f8fafc; border-bottom: 1px solid #cbd5e1; font-size: 11px;">
                            <th style="padding: 5px 8px; text-align: center; width: 35px; border: 1px solid #cbd5e1; color: #475569;">#</th>
                            <th style="padding: 5px 12px; text-align: left; border: 1px solid #cbd5e1; color: #475569;">পার্টনারের নাম</th>
                            <th style="padding: 5px 10px; text-align: left; border: 1px solid #cbd5e1; color: #475569;">শেয়ার প্রকার</th>
                            <th style="padding: 5px 10px; text-align: center; width: 75px; border: 1px solid #cbd5e1; color: #475569;">হার (%)</th>
                            <th style="padding: 5px 12px; text-align: right; border: 1px solid #cbd5e1; color: #475569;">লভ্যাংশ (টাকা)</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${profitRows}
                    </tbody>
                    <tfoot>
                        <tr style="background: #f1f5f9; border-top: 2px solid #cbd5e1;">
                            <td colspan="3" style="padding: 8px 12px; font-weight: 800; text-align: right; font-size: 13px; color: #0f172a; border: 1px solid #cbd5e1;">
                                মোট বণ্টিত লভ্যাংশ:
                            </td>
                            <td style="padding: 8px 10px; font-weight: 800; text-align: center; color: #0284c7; border: 1px solid #cbd5e1;" class="num-font">
                                ${settlement.totalPercentage || 100}%
                            </td>
                            <td style="padding: 8px 12px; font-weight: 900; font-size: 14.5px; text-align: right; color: #0f172a; border: 1px solid #cbd5e1;" class="num-font">
                                ৳ ${formatAmountWithComma(totalDistProfit)}
                            </td>
                        </tr>
                    </tfoot>
                </table>
            </div>

            <!-- Section 3: Capital & Waterfall Settlement -->
            <div class="page-break-avoid" style="margin-bottom: 20px; border: 1px solid #cbd5e1; border-radius: 8px; overflow: hidden;">
                <div style="background: #0f172a; color: #ffffff; padding: 6px 12px; font-weight: 800; font-size: 12px; display: flex; justify-content: space-between; align-items: center;">
                    <span>৩. মূলধন, এলসি মার্জিন ও সমন্বয় নিষ্পত্তি হিসাব</span>
                    <span style="font-size: 11px; color: #94a3b8; font-weight: 600;">মূলধন – এলসি মার্জিন + সমন্বয়</span>
                </div>
                <table class="print-table" style="font-size: 12px;">
                    <tbody>
                        ${capitalRows}
                    </tbody>
                    <tfoot>
                        <tr style="background: #f0f9ff; border-top: 2px solid #cbd5e1;">
                            <td colspan="3" style="padding: 8px 12px; font-weight: 800; text-align: right; font-size: 13px; color: #0369a1; border: 1px solid #cbd5e1;">
                                সর্বমোট অবশিষ্ট সমন্বিত ব্যালেন্স:
                            </td>
                            <td style="padding: 8px 12px; font-weight: 900; font-size: 15px; text-align: right; color: #0284c7; border: 1px solid #cbd5e1;" class="num-font">
                                ৳ ${formatAmountWithComma(finalBalance)}
                            </td>
                        </tr>
                    </tfoot>
                </table>
                ${finalBalanceWords ? `<div style="padding: 5px 12px; background: #f8fafc; font-size: 10.5px; color: #334155; font-weight: 700; border-top: 1px dashed #cbd5e1;">কথায়: ${escapeHTML(finalBalanceWords)}</div>` : ''}
            </div>

            <!-- Authentic 4-Partner Signature Block -->
            <div class="page-break-avoid" style="margin-top: 30px; display: grid; grid-template-columns: repeat(4, 1fr); gap: 12px; padding-top: 5px;">
                <div style="text-align: center;">
                    <div style="border: 1px dashed #cbd5e1; height: 42px; margin-bottom: 6px; border-radius: 4px; background: rgba(248, 250, 252, 0.4);"></div>
                    <div style="border-top: 1.5px solid #334155; padding-top: 4px;">
                        <div style="font-size: 11px; font-weight: 800; color: #0f172a;">প্রস্তুতকারক</div>
                        <div style="font-size: 8.5px; color: #64748b; font-weight: 600;">মা মোটরস একাউন্টস</div>
                    </div>
                </div>
                <div style="text-align: center;">
                    <div style="border: 1px dashed #cbd5e1; height: 42px; margin-bottom: 6px; border-radius: 4px; background: rgba(248, 250, 252, 0.4);"></div>
                    <div style="border-top: 1.5px solid #334155; padding-top: 4px;">
                        <div style="font-size: 11px; font-weight: 800; color: #0f172a;">সজীব</div>
                        <div style="font-size: 8.5px; color: #64748b; font-weight: 600;">ওয়ার্কিং পার্টনার (১০%)</div>
                    </div>
                </div>
                <div style="text-align: center;">
                    <div style="border: 1px dashed #cbd5e1; height: 42px; margin-bottom: 6px; border-radius: 4px; background: rgba(248, 250, 252, 0.4);"></div>
                    <div style="border-top: 1.5px solid #334155; padding-top: 4px;">
                        <div style="font-size: 11px; font-weight: 800; color: #0f172a;">আলতাফ</div>
                        <div style="font-size: 8.5px; color: #64748b; font-weight: 600;">ইকুইটি পার্টনার (৪৫%)</div>
                    </div>
                </div>
                <div style="text-align: center;">
                    <div style="border: 1px dashed #cbd5e1; height: 42px; margin-bottom: 6px; border-radius: 4px; background: rgba(248, 250, 252, 0.4);"></div>
                    <div style="border-top: 1.5px solid #334155; padding-top: 4px;">
                        <div style="font-size: 11px; font-weight: 800; color: #0f172a;">এমরান</div>
                        <div style="font-size: 8.5px; color: #64748b; font-weight: 600;">ম্যানেজিং পার্টনার (৪৫%)</div>
                    </div>
                </div>
            </div>

            <!-- Print Timestamp Footer -->
            <div style="margin-top: 18px; border-top: 1px solid #e2e8f0; padding-top: 4px; display: flex; justify-content: space-between; font-size: 9px; color: #94a3b8; font-weight: 600;">
                <span>মেসার্স মা মোটরস ইআরপি সিস্টেম • কন্টেইনার পার্টনারশিপ সেটেলমেন্ট ভাউচার</span>
                <span>প্রিন্ট সময়: ${new Date().toLocaleString('en-GB')}</span>
            </div>
        </div>
    `;

    const extraCss = `
        @page { size: A4 portrait; margin: 0 !important; }
        * {
            box-sizing: border-box !important;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
            font-family: 'Hind Siliguri', 'Kalpurush', 'Inter', system-ui, -apple-system, sans-serif !important;
        }
        html, body {
            margin: 0 !important;
            padding: 0 !important;
            background: #ffffff !important;
            color: #0f172a !important;
            width: 100% !important;
        }
        .num-font {
            font-family: 'Inter', 'Hind Siliguri', sans-serif !important;
            font-variant-numeric: tabular-nums;
        }
        .print-sheet {
            width: 100% !important;
            max-width: 210mm !important;
            margin: 0 auto !important;
            padding: 8mm 12mm 6mm 12mm !important;
            box-sizing: border-box !important;
            background: #ffffff !important;
        }
        .print-table {
            width: 100% !important;
            border-collapse: collapse !important;
        }
        .print-table th, .print-table td {
            border: 1px solid #cbd5e1 !important;
            line-height: 1.3 !important;
        }
        .page-break-avoid {
            page-break-inside: avoid !important;
            break-inside: avoid !important;
        }
    `;

    const pdfTitle = `Container_Settlement_${containerCount}_Containers_${date.replace(/\//g, '-')}`;
    printViaIframe(htmlBody, extraCss, pdfTitle);
}

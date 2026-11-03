import { formatAmountWithComma, numberToBanglaWords, escapeHTML } from '../utils.js';
import { printViaIframe } from '../utils/smart-print-engine.js';

/**
 * Generate and trigger clean A4 printed voucher for Container Profit & Settlement
 * @param {Object} settlement Settlement document object
 */
export function printContainerSettlement(settlement) {
    if (!settlement) return;

    const title = settlement.title || 'কন্টেইনার মাল বিক্রয় ও খরচের হিসাব';
    const date = settlement.settlementDate || '';
    const period = settlement.fiscalPeriod || '';
    const netProfit = Number(settlement.netProfit) || 0;
    const finalBalance = Number(settlement.finalNetBalance) || 0;

    const netProfitWords = netProfit > 0 ? `${numberToBanglaWords(netProfit)} টাকা মাত্র` : '';
    const finalBalanceWords = finalBalance > 0 ? `${numberToBanglaWords(finalBalance)} টাকা মাত্র` : '';

    // Section 1: Sales & Costs Rows
    const salesCostsRows = (settlement.salesAndCosts || []).map((row, idx) => {
        const isPlus = row.op === '+';
        return `
            <tr style="border-bottom: 1px solid #e2e8f0;">
                <td style="padding: 6px 10px; text-align: center; color: #64748b; font-weight: bold; width: 40px;">${idx + 1}</td>
                <td style="padding: 6px 10px; font-weight: 700; color: #1e293b;">${escapeHTML(row.desc)}</td>
                <td style="padding: 6px 10px; text-align: center; width: 60px;">
                    <span style="display: inline-block; padding: 2px 8px; border-radius: 4px; font-weight: 900; font-size: 11px; ${isPlus ? 'background: #ecfdf5; color: #059669; border: 1px solid #a7f3d0;' : 'background: #fef2f2; color: #dc2626; border: 1px solid #fecaca;'}">
                        ${isPlus ? '(+) আয়' : '(-) বাদ'}
                    </span>
                </td>
                <td style="padding: 6px 10px; text-align: right; font-weight: 800; font-family: monospace; font-size: 13px; color: ${isPlus ? '#059669' : '#dc2626'};">
                    ৳ ${formatAmountWithComma(row.amount)}
                </td>
            </tr>
        `;
    }).join('');

    // Section 2: Profit Sharing Rows
    const profitRows = (settlement.profitSharing || []).map((p, idx) => {
        return `
            <tr style="border-bottom: 1px solid #e2e8f0;">
                <td style="padding: 6px 10px; text-align: center; color: #64748b; font-weight: bold; width: 40px;">${idx + 1}</td>
                <td style="padding: 6px 10px; font-weight: 800; color: #0f172a;">${escapeHTML(p.partnerName)}</td>
                <td style="padding: 6px 10px; color: #475569; font-weight: 600;">${escapeHTML(p.shareType || 'শেয়ার')}</td>
                <td style="padding: 6px 10px; text-align: center; font-weight: 900; color: #2563eb; width: 80px;">${p.percentage}%</td>
                <td style="padding: 6px 10px; text-align: right; font-weight: 900; font-family: monospace; font-size: 13px; color: #0f172a;">
                    ৳ ${formatAmountWithComma(p.calculatedAmount)}
                </td>
            </tr>
        `;
    }).join('');

    // Section 3: Capital & Waterfall Rows
    const capitalRows = (settlement.capitalSettlements || []).map((row, idx) => {
        const isPlus = row.op === '+';
        return `
            <tr style="border-bottom: 1px solid #e2e8f0;">
                <td style="padding: 6px 10px; text-align: center; color: #64748b; font-weight: bold; width: 40px;">${idx + 1}</td>
                <td style="padding: 6px 10px; font-weight: 700; color: #1e293b;">${escapeHTML(row.desc)}</td>
                <td style="padding: 6px 10px; text-align: center; width: 60px;">
                    <span style="display: inline-block; padding: 2px 8px; border-radius: 4px; font-weight: 900; font-size: 11px; ${isPlus ? 'background: #ecfdf5; color: #059669; border: 1px solid #a7f3d0;' : 'background: #fef2f2; color: #dc2626; border: 1px solid #fecaca;'}">
                        ${isPlus ? '(+) যোগ' : '(-) বাদ'}
                    </span>
                </td>
                <td style="padding: 6px 10px; text-align: right; font-weight: 800; font-family: monospace; font-size: 13px; color: ${isPlus ? '#059669' : '#dc2626'};">
                    ৳ ${formatAmountWithComma(row.amount)}
                </td>
            </tr>
        `;
    }).join('');

    const htmlBody = `
        <div style="font-family: 'Hind Siliguri', 'SolaimanLipi', sans-serif; max-width: 800px; margin: 0 auto; color: #0f172a; padding: 15px;">
            <!-- Header -->
            <div style="text-align: center; border-bottom: 2px solid #0f172a; padding-bottom: 10px; margin-bottom: 15px;">
                <h1 style="margin: 0; font-size: 22px; font-weight: 900; color: #0f172a; letter-spacing: 0.5px;">মেসার্স মা মোটরস</h1>
                <p style="margin: 3px 0; font-size: 11px; color: #475569; font-weight: 600;">জাপানি রিকন্ডিশন্ড অটোমোবাইল পার্টস আমদানিকারক ও পাইকারী বিক্রেতা</p>
                <div style="display: inline-block; margin-top: 6px; padding: 4px 14px; background: #0f172a; color: #fff; font-size: 13px; font-weight: 800; border-radius: 6px;">
                    ${escapeHTML(title)}
                </div>
                <div style="margin-top: 5px; font-size: 11px; color: #64748b; font-weight: bold;">
                    <span>তারিখ: ${escapeHTML(date)}</span>
                    ${period ? `<span style="margin-left: 15px;">অর্থবছর: ${escapeHTML(period)}</span>` : ''}
                </div>
            </div>

            <!-- 1. Sales & Costs -->
            <div style="margin-bottom: 16px; border: 1px solid #cbd5e1; border-radius: 8px; overflow: hidden;">
                <div style="background: #f8fafc; padding: 6px 12px; font-weight: 900; font-size: 12px; border-bottom: 1px solid #cbd5e1; color: #1e293b;">
                    ১. মাল বিক্রয় ও কন্টেইনার লাভ হিসাব
                </div>
                <table style="width: 100%; border-collapse: collapse; font-size: 12px;">
                    <tbody>
                        ${salesCostsRows}
                    </tbody>
                    <tfoot>
                        <tr style="background: #f1f5f9; border-top: 2px solid #cbd5e1;">
                            <td colspan="3" style="padding: 8px 12px; font-weight: 900; text-align: right; font-size: 13px; color: #0f172a;">
                                সর্বমোট কন্টেইনার লাভ:
                            </td>
                            <td style="padding: 8px 12px; font-weight: 900; font-family: monospace; font-size: 15px; text-align: right; color: #059669;">
                                ৳ ${formatAmountWithComma(netProfit)}
                            </td>
                        </tr>
                    </tfoot>
                </table>
                ${netProfitWords ? `<div style="padding: 4px 12px; background: #f8fafc; font-size: 10px; color: #475569; font-weight: bold; border-top: 1px dashed #cbd5e1;">কথায়: ${escapeHTML(netProfitWords)}</div>` : ''}
            </div>

            <!-- 2. Profit Sharing -->
            <div style="margin-bottom: 16px; border: 1px solid #cbd5e1; border-radius: 8px; overflow: hidden;">
                <div style="background: #f8fafc; padding: 6px 12px; font-weight: 900; font-size: 12px; border-bottom: 1px solid #cbd5e1; color: #1e293b;">
                    ২. পার্টনারদের লভ্যাংশ বণ্টন
                </div>
                <table style="width: 100%; border-collapse: collapse; font-size: 12px;">
                    <thead>
                        <tr style="background: #f1f5f9; border-bottom: 1px solid #cbd5e1; font-size: 11px; text-transform: uppercase;">
                            <th style="padding: 5px 10px; text-align: center; width: 40px;">#</th>
                            <th style="padding: 5px 10px; text-align: left;">পার্টনারের নাম</th>
                            <th style="padding: 5px 10px; text-align: left;">শেয়ার প্রকার</th>
                            <th style="padding: 5px 10px; text-align: center; width: 80px;">হার (%)</th>
                            <th style="padding: 5px 10px; text-align: right;">লভ্যাংশ (টাকা)</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${profitRows}
                    </tbody>
                    <tfoot>
                        <tr style="background: #f1f5f9; border-top: 2px solid #cbd5e1;">
                            <td colspan="3" style="padding: 8px 12px; font-weight: 900; text-align: right; font-size: 13px; color: #0f172a;">
                                মোট বণ্টিত লভ্যাংশ:
                            </td>
                            <td style="padding: 8px 12px; font-weight: 900; text-align: center; color: #2563eb;">
                                ${settlement.totalPercentage || 100}%
                            </td>
                            <td style="padding: 8px 12px; font-weight: 900; font-family: monospace; font-size: 15px; text-align: right; color: #0f172a;">
                                ৳ ${formatAmountWithComma(settlement.totalDistributedProfit || netProfit)}
                            </td>
                        </tr>
                    </tfoot>
                </table>
            </div>

            <!-- 3. Capital & Waterfall Settlement -->
            <div style="margin-bottom: 25px; border: 1px solid #cbd5e1; border-radius: 8px; overflow: hidden;">
                <div style="background: #f8fafc; padding: 6px 12px; font-weight: 900; font-size: 12px; border-bottom: 1px solid #cbd5e1; color: #1e293b;">
                    ৩. মূলধন, এলসি মার্জিন ও সমন্বয় নিষ্পত্তি হিসাব
                </div>
                <table style="width: 100%; border-collapse: collapse; font-size: 12px;">
                    <tbody>
                        ${capitalRows}
                    </tbody>
                    <tfoot>
                        <tr style="background: #f1f5f9; border-top: 2px solid #cbd5e1;">
                            <td colspan="3" style="padding: 8px 12px; font-weight: 900; text-align: right; font-size: 13px; color: #0f172a;">
                                সর্বমোট অবশিষ্ট সমন্বিত ব্যালেন্স:
                            </td>
                            <td style="padding: 8px 12px; font-weight: 900; font-family: monospace; font-size: 15px; text-align: right; color: #0284c7;">
                                ৳ ${formatAmountWithComma(finalBalance)}
                            </td>
                        </tr>
                    </tfoot>
                </table>
                ${finalBalanceWords ? `<div style="padding: 4px 12px; background: #f8fafc; font-size: 10px; color: #475569; font-weight: bold; border-top: 1px dashed #cbd5e1;">কথায়: ${escapeHTML(finalBalanceWords)}</div>` : ''}
            </div>

            <!-- Signatures -->
            <div style="margin-top: 40px; display: flex; justify-content: space-between; align-items: flex-end; padding-top: 10px;">
                <div style="text-align: center; width: 140px;">
                    <div style="border-top: 1px solid #475569; padding-top: 4px; font-size: 11px; font-weight: 800; color: #1e293b;">প্রস্তুতকারক</div>
                </div>
                <div style="text-align: center; width: 140px;">
                    <div style="border-top: 1px solid #475569; padding-top: 4px; font-size: 11px; font-weight: 800; color: #1e293b;">সজীব (ওয়ার্কিং)</div>
                </div>
                <div style="text-align: center; width: 140px;">
                    <div style="border-top: 1px solid #475569; padding-top: 4px; font-size: 11px; font-weight: 800; color: #1e293b;">আলতাফ (পার্টনার)</div>
                </div>
                <div style="text-align: center; width: 140px;">
                    <div style="border-top: 1px solid #475569; padding-top: 4px; font-size: 11px; font-weight: 800; color: #1e293b;">এমরান (ম্যানেজিং পার্টনার)</div>
                </div>
            </div>
        </div>
    `;

    printViaIframe(htmlBody, '', `Container_Settlement_${settlement.containerCount || 'Report'}`);
}

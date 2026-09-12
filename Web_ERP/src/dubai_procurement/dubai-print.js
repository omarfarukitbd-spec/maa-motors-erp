/**
 * Dubai Procurement & Weekly Audit - Authentic 2-Column Waterfall Print Engine
 * Generates an executive single-page printable voucher matching the authentic Thursday audit sheet.
 */

import { formatAmountWithComma, parseAmount, safeRound } from '../utils.js';
import { printViaIframe } from '../utils/smart-print-engine.js';

export function printDubaiAuditSheet(auditData, memos = [], remittances = [], expenses = []) {
    if (!auditData) return;

    const title = `Dubai_Audit_${auditData.weekEndDate || 'Weekly'}`;
    const htmlBody = generateAuditPrintHtml(auditData, memos, remittances, expenses);
    
    const extraCss = `
        @page { size: A4 portrait; margin: 10mm 12mm; }
        body { font-family: 'Inter', 'Hind Siliguri', sans-serif; background: #fff; color: #0f172a; margin: 0; padding: 0; }
        .num-font { font-family: 'Inter', monospace; font-weight: 700; }
        table { border-collapse: collapse; width: 100%; }
        th, td { border: 1px solid #334155; padding: 5px 8px; font-size: 11px; }
    `;

    printViaIframe(htmlBody, extraCss, title);
}

function generateAuditPrintHtml(audit, memos) {
    const formatAED = val => formatAmountWithComma(safeRound(parseAmount(val)));
    const desc = audit.descriptions || {};

    const cumSent = safeRound(parseAmount(audit.cumulativeRemittance));
    const runningSent = safeRound(parseAmount(audit.weeklyRemittanceTotal));

    const cumPur = safeRound(parseAmount(audit.cumulativePurchaseTotal));
    const runningPur = safeRound(parseAmount(audit.weeklyPurchaseTotal));

    const sub1 = safeRound(cumSent - cumPur);

    const cumExp = safeRound(parseAmount(audit.cumulativeExpenseTotal));
    const runningExp = safeRound(parseAmount(audit.weeklyExpenseTotal));

    const sub2 = safeRound(sub1 - cumExp);

    const marketAd = safeRound(parseAmount(audit.marketAdvance));
    const cashInHand = safeRound(parseAmount(audit.cashInHand));
    const sub3 = safeRound(sub2 - marketAd - cashInHand);

    let holdingsTotal = 0;
    const holdingsList = Array.isArray(audit.personalHoldings) ? audit.personalHoldings : [];
    holdingsList.forEach(h => {
        holdingsTotal = safeRound(holdingsTotal + safeRound(parseAmount(h.amount)));
    });

    const finalVariance = safeRound(parseAmount(audit.varianceAmount));
    const isSurplus = finalVariance >= 0;

    // Dynamic holdings rows
    let holdingsHtml = '';
    holdingsList.forEach(h => {
        const amt = safeRound(parseAmount(h.amount));
        holdingsHtml += `
            <tr style="background: #faf5ff;">
                <td style="padding: 5px 8px; border: 1px solid #cbd5e1;">
                    <div style="display: flex; justify-content: space-between; align-items: center;">
                        <span style="font-weight: 700; color: #581c87;">${h.desc || h.name || 'ব্যক্তিগত হস্তান্তর'}</span>
                        <span style="color: #64748b; font-size: 9.5px;">(-) AED: <b class="num-font" style="color: #6b21a8; font-size: 11px;">${formatAED(amt)}</b></span>
                    </div>
                </td>
                <td style="text-align: center; color: #64748b; font-size: 9.5px; border: 1px solid #cbd5e1; background: #f8fafc;">
                    ব্যক্তিগত হস্তান্তর / মেস
                </td>
            </tr>
        `;
    });

    // Memos compact list
    let memosSummaryHtml = '';
    if (Array.isArray(memos) && memos.length > 0) {
        memosSummaryHtml = memos.map(m => `
            <span style="display: inline-block; margin: 1px 4px; font-size: 9px; background: #f1f5f9; padding: 1px 4px; border-radius: 3px; border: 1px solid #e2e8f0;">
                #${m.memoNo}: <b class="num-font">${formatAmountWithComma(m.amount)}</b>
            </span>
        `).join('');
    }

    return `
        <div style="width: 100%; box-sizing: border-box; font-size: 11px; line-height: 1.35;">
            <!-- Header -->
            <div style="text-align: center; border-bottom: 2px solid #0f172a; padding-bottom: 6px; margin-bottom: 8px;">
                <div style="font-size: 18px; font-weight: 900; letter-spacing: 0.5px; color: #0f172a;">মা মোটরস — দুবাই কনটেইনার ও বিদেশি ক্রয় খতিয়ান</div>
                <div style="font-size: 10px; font-weight: 700; color: #475569; text-transform: uppercase; letter-spacing: 1px;">
                    MAA MOTORS • OVERSEAS PROCUREMENT & WEEKLY CASH AUDIT (AED)
                </div>
                <div style="display: flex; justify-content: space-between; margin-top: 6px; font-size: 10px; background: #f8fafc; padding: 4px 8px; border-radius: 6px; border: 1px solid #e2e8f0;">
                    <div><b>কনটেইনার আইডি:</b> ${audit.containerNo || 'CT-2026-DXB-01'}</div>
                    <div><b>অডিট তারিখ:</b> ${audit.weekEndDate || ''} (বৃহস্পতিবার)</div>
                    <div><b>মুদ্রা:</b> UAE Dirham (AED د.إ)</div>
                    <div><b>স্ট্যাটাস:</b> <span style="color: #047857; font-weight: 800;">${audit.status || 'CLOSED'}</span></div>
                </div>
            </div>

            <!-- Authentic 2-Column Waterfall Table -->
            <table style="border: 1.5px solid #0f172a; margin-top: 4px;">
                <thead>
                    <tr style="background: #0f172a; color: #fff;">
                        <th style="width: 68%; text-align: left; padding: 6px 8px; font-size: 11px; border: 1px solid #0f172a;">
                            তারিখ: ${audit.weekEndDate || ''} (বৃহস্পতিবার) — ক্রমপুঞ্জিত ও বিয়োগফল
                        </th>
                        <th style="width: 32%; text-align: center; padding: 6px 8px; font-size: 11px; border: 1px solid #0f172a; color: #34d399;">
                            ক্রয়/খরচ দেরহাম দেওয়া রানিং সপ্তাহ
                        </th>
                    </tr>
                </thead>
                <tbody>
                    <!-- Row 1: টাকা পাঠানো -->
                    <tr style="background: #f0fdf4;">
                        <td style="padding: 6px 8px; border: 1px solid #cbd5e1;">
                            <div style="display: flex; justify-content: space-between; align-items: center;">
                                <span style="font-weight: 700; color: #166534;">${desc.sent || 'বৃহস্পতিবার পর্যন্ত টাকা পাঠানো'}</span>
                                <span style="color: #15803d;">AED: <b class="num-font" style="font-size: 12px;">${formatAED(cumSent)}</b></span>
                            </div>
                        </td>
                        <td style="text-align: right; padding: 6px 8px; font-weight: 700; border: 1px solid #cbd5e1;" class="num-font">
                            ${runningSent > 0 ? formatAED(runningSent) : '-'}
                        </td>
                    </tr>

                    <!-- Row 2: মাল ক্রয় -->
                    <tr style="background: #fffbeb;">
                        <td style="padding: 6px 8px; border: 1px solid #cbd5e1;">
                            <div style="display: flex; justify-content: space-between; align-items: center;">
                                <div>
                                    <span style="font-weight: 700; color: #92400e;">${desc.purchase || 'সর্বমোট মাল ক্রয়'}</span>
                                    ${desc.memos ? `<div style="font-size: 9.5px; color: #78350f; margin-top: 1px;">${desc.memos}</div>` : ''}
                                </div>
                                <span style="color: #b45309;">(-) AED: <b class="num-font" style="font-size: 12px;">${formatAED(cumPur)}</b></span>
                            </div>
                        </td>
                        <td style="text-align: right; padding: 6px 8px; font-weight: 700; border: 1px solid #cbd5e1;" class="num-font">
                            ${runningPur > 0 ? formatAED(runningPur) : '-'}
                        </td>
                    </tr>

                    <!-- Subtotal 1 -->
                    <tr style="background: #e0f2fe; font-weight: 800;">
                        <td style="padding: 4px 8px; text-align: right; border: 1px solid #94a3b8; color: #0369a1;">
                            অবশিষ্ট (টাকা পাঠানো – মাল ক্রয়): AED = <span class="num-font" style="font-size: 12px;">${formatAED(sub1)}</span>
                        </td>
                        <td style="background: #f1f5f9; border: 1px solid #cbd5e1;"></td>
                    </tr>

                    <!-- Row 3: খরচ -->
                    <tr style="background: #fef2f2;">
                        <td style="padding: 6px 8px; border: 1px solid #cbd5e1;">
                            <div style="display: flex; justify-content: space-between; align-items: center;">
                                <span style="font-weight: 700; color: #991b1b;">${desc.expense || 'সর্বমোট খরচ'}</span>
                                <span style="color: #b91c1c;">(-) AED: <b class="num-font" style="font-size: 12px;">${formatAED(cumExp)}</b></span>
                            </div>
                        </td>
                        <td style="text-align: right; padding: 6px 8px; font-weight: 700; border: 1px solid #cbd5e1;" class="num-font">
                            ${runningExp > 0 ? formatAED(runningExp) : '-'}
                        </td>
                    </tr>

                    <!-- Subtotal 2 -->
                    <tr style="background: #e0f2fe; font-weight: 800;">
                        <td style="padding: 4px 8px; text-align: right; border: 1px solid #94a3b8; color: #0369a1;">
                            নিট ক্যাশ স্থিতি (হাতে থাকার কথা): AED = <span class="num-font" style="font-size: 12px;">${formatAED(sub2)}</span>
                        </td>
                        <td style="background: #f1f5f9; border: 1px solid #cbd5e1;"></td>
                    </tr>

                    <!-- Row 4: মার্কেট এডভান্স (সম্পূর্ণ আলাদা সারি) -->
                    <tr style="background: #ecfeff;">
                        <td style="padding: 6px 8px; border: 1px solid #cbd5e1;">
                            <div style="display: flex; justify-content: space-between; align-items: center;">
                                <span style="font-weight: 700; color: #155e75;">${desc.ad || 'মার্কেট এডভান্স (AD)'}</span>
                                <span style="color: #0891b2;">(-) AED: <b class="num-font" style="font-size: 12px;">${formatAED(marketAd)}</b></span>
                            </div>
                        </td>
                        <td style="text-align: center; color: #64748b; font-size: 9.5px; border: 1px solid #cbd5e1; background: #f8fafc;">
                            সাপ্লায়ারদের অগ্রিম
                        </td>
                    </tr>

                    <!-- Row 5: নগদ ক্যাশ আছে (সম্পূর্ণ আলাদা সারি) -->
                    <tr style="background: #ecfdf5;">
                        <td style="padding: 6px 8px; border: 1px solid #cbd5e1;">
                            <div style="display: flex; justify-content: space-between; align-items: center;">
                                <span style="font-weight: 700; color: #065f46;">${desc.cash || 'নগদ ক্যাশ আছে (Cash in Hand)'}</span>
                                <span style="color: #059669;">(-) AED: <b class="num-font" style="font-size: 12px;">${formatAED(cashInHand)}</b></span>
                            </div>
                        </td>
                        <td style="text-align: center; color: #64748b; font-size: 9.5px; border: 1px solid #cbd5e1; background: #f8fafc;">
                            ক্যাশ বাক্সে নগদ দেরহাম
                        </td>
                    </tr>

                    <!-- Subtotal 3 -->
                    <tr style="background: #f3e8ff; font-weight: 800;">
                        <td style="padding: 4px 8px; text-align: right; border: 1px solid #c084fc; color: #6b21a8;">
                            অবশিষ্ট ব্যালেন্স (এডভান্স ও ক্যাশ বাদে): AED = <span class="num-font" style="font-size: 12px;">${formatAED(sub3)}</span>
                        </td>
                        <td style="background: #f1f5f9; border: 1px solid #cbd5e1;"></td>
                    </tr>

                    <!-- Dynamic Holdings Rows -->
                    ${holdingsHtml}

                    <!-- Final Variance Row: ক্যাশ বাড়তি / ঘাটতি -->
                    <tr style="background: ${isSurplus ? '#dcfce7' : '#fee2e2'}; font-weight: 900;">
                        <td style="padding: 8px; border: 2px solid ${isSurplus ? '#16a34a' : '#dc2626'};">
                            <div style="display: flex; justify-content: space-between; align-items: center;">
                                <span style="font-size: 13px; color: ${isSurplus ? '#15803d' : '#b91c1c'};">
                                    ${desc.status || (isSurplus ? '(ক্যাশ বাড়তি)' : '(ক্যাশ ঘাটতি)')}
                                </span>
                                <span style="font-size: 14px; color: ${isSurplus ? '#15803d' : '#b91c1c'};">
                                    AED = <span class="num-font" style="font-size: 15px;">${formatAED(finalVariance)}</span>
                                </span>
                            </div>
                        </td>
                        <td style="text-align: center; font-weight: 700; color: ${isSurplus ? '#15803d' : '#b91c1c'}; border: 2px solid ${isSurplus ? '#16a34a' : '#dc2626'};">
                            ${isSurplus ? 'অডিট সমন্বয় সফল' : 'ক্যাশ ঘাটতি'}
                        </td>
                    </tr>
                </tbody>
            </table>

            <!-- Memos Section if available -->
            ${memosSummaryHtml ? `
                <div style="margin-top: 8px; padding: 4px 8px; background: #fff; border: 1px solid #e2e8f0; border-radius: 4px;">
                    <div style="font-size: 9.5px; font-weight: 800; color: #475569; margin-bottom: 2px;">সংযুক্ত মেমো তালিকা:</div>
                    <div>${memosSummaryHtml}</div>
                </div>
            ` : ''}

            <!-- Signature Footers -->
            <div style="margin-top: 25px; padding-top: 10px; display: flex; justify-content: space-between; text-align: center; font-size: 10px; color: #475569;">
                <div style="width: 180px;">
                    <div style="border-top: 1px dashed #64748b; margin-top: 25px; padding-top: 4px; font-weight: 700;">দুবাই প্রতিনিধি স্বাক্ষর</div>
                </div>
                <div style="width: 180px;">
                    <div style="border-top: 1px dashed #64748b; margin-top: 25px; padding-top: 4px; font-weight: 700;">অডিটর যাচাই</div>
                </div>
                <div style="width: 180px;">
                    <div style="border-top: 1px dashed #64748b; margin-top: 25px; padding-top: 4px; font-weight: 700;">স্বত্বাধিকারী অনুমোদন</div>
                </div>
            </div>
        </div>
    `;
}

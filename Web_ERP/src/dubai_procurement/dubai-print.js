/**
 * Dubai Procurement & Weekly Audit - Official Corporate Print Engine
 * Generates an executive single-page printable voucher matching MAA MOTORS ERP standards.
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

export async function printDubaiAuditSheet(auditData, memos = [], remittances = [], expenses = []) {
    if (!auditData) return;

    let settings = {};
    try {
        settings = (await SettingsDAO.getAppSettings()) || {};
    } catch (e) {
        console.error('Settings fetch error in dubai print:', e);
    }

    const title = `Dubai_Audit_${auditData.weekEndDate || 'Weekly'}`;
    const htmlBody = generateAuditPrintHtml(auditData, memos, settings);

    const extraCss = `
        @page { size: A4 portrait; margin: 0 !important; }
        html, body {
            font-family: 'Inter', 'Kalpurush', 'Hind Siliguri', sans-serif !important;
            background: #fff !important;
            color: #0f172a !important;
            margin: 0 !important;
            padding: 0 !important;
        }
        .num-font { font-family: 'Inter', monospace; }
        table { border-collapse: collapse; width: 100%; }
        .print-row-no-break { page-break-inside: avoid; break-inside: avoid; }
        .dubai-print-sheet {
            width: 100% !important;
            max-width: 210mm !important;
            margin: 0 auto !important;
            box-sizing: border-box !important;
            padding: 10mm 15mm 8mm 15mm !important;
            background: #ffffff !important;
        }
    `;

    printViaIframe(htmlBody, extraCss, title);
}

function generateAuditPrintHtml(audit, memos, settings) {
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
            <tr class="print-row-no-break" style="background: #ffffff; border-bottom: 1px solid #e2e8f0;">
                <td style="padding: 5px 8px; border: 1px solid #cbd5e1;">
                    <div style="display: flex; justify-content: space-between; align-items: center;">
                        <span style="font-weight: 700; color: #475569; font-size: 11px;">${escapeHTML(h.desc || h.name || 'ব্যক্তিগত হস্তান্তর')}</span>
                        <span style="color: #64748b; font-size: 9.5px;">(-) AED: <b class="num-font" style="color: #6b21a8; font-size: 11.5px;">${formatAED(amt)}</b></span>
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
            <span style="display: inline-block; margin: 2px 3px; font-size: 9px; background: #ffffff; padding: 2px 6px; border-radius: 4px; border: 1px solid #cbd5e1; box-shadow: 0 1px 2px rgba(0,0,0,0.02);">
                <span style="color: #0284c7; font-weight: 800;">#${escapeHTML(m.memoNo)}:</span> <b class="num-font" style="color: #0f172a;">${formatAmountWithComma(m.amount)}</b>
            </span>
        `).join('');
    }

    const headerHtml = renderPrintHeader(settings, {
        title: 'DUBAI CONTAINER AUDIT',
        subtitle: 'দুবাই কনটেইনার ও বিদেশি ক্রয় খতিয়ান (Weekly Cash & Procurement Audit)'
    });

    const printTimeStr = new Date().toLocaleString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true,
        day: '2-digit',
        month: 'short',
        year: 'numeric'
    });

    return `
        <div class="dubai-print-sheet" style="width: 100%; max-width: 210mm; margin: 0 auto; box-sizing: border-box; padding: 10mm 15mm 8mm 15mm; font-size: 11px; line-height: 1.3; background: #ffffff;">
            <!-- Official Corporate Gradient Header -->
            <div style="margin-bottom: 10px;">
                ${headerHtml}
            </div>

            <!-- Executive Metadata Bar (4-Column) -->
            <div style="display: grid; grid-template-columns: 1.2fr 1.3fr 1.1fr 1.2fr; gap: 8px; background: #f8fafc; border: 1.5px solid #cbd5e1; border-radius: 8px; padding: 6px 12px; margin-bottom: 10px;">
                <div>
                    <div style="font-size: 8.5px; font-weight: 700; color: #64748b; text-transform: uppercase; letter-spacing: 0.5px;">কনটেইনার নং:</div>
                    <div style="font-size: 11.5px; font-weight: 900; color: #0f172a; font-family: 'Inter', monospace; margin-top: 1px;">${escapeHTML(audit.containerNo || 'CT-2026-DXB-01')}</div>
                </div>
                <div>
                    <div style="font-size: 8.5px; font-weight: 700; color: #64748b; text-transform: uppercase; letter-spacing: 0.5px;">অডিট তারিখ:</div>
                    <div style="font-size: 11px; font-weight: 800; color: #0284c7; margin-top: 1px;">${formatAppDate(audit.weekEndDate)} <span style="font-size: 9.5px; color: #64748b; font-weight: 600;">(বৃহস্পতিবার)</span></div>
                </div>
                <div>
                    <div style="font-size: 8.5px; font-weight: 700; color: #64748b; text-transform: uppercase; letter-spacing: 0.5px;">মুদ্রা (Currency):</div>
                    <div style="font-size: 11px; font-weight: 800; color: #0f172a; margin-top: 1px;">UAE Dirham (<span style="font-weight: 900; color: #047857;">AED د.إ</span>)</div>
                </div>
                <div style="text-align: right;">
                    <div style="font-size: 8.5px; font-weight: 700; color: #64748b; text-transform: uppercase; letter-spacing: 0.5px;">অডিট স্ট্যাটাস:</div>
                    <div style="margin-top: 2px;">
                        <span style="display: inline-block; background: #ecfdf5; color: #059669; border: 1px solid #a7f3d0; font-size: 9.5px; font-weight: 800; padding: 1px 7px; border-radius: 5px;">
                            ${escapeHTML(audit.status || 'AUDITED & CLOSED')}
                        </span>
                    </div>
                </div>
            </div>

            <!-- Authentic 2-Column Waterfall Table -->
            <table style="border: 1.5px solid #0f172a; width: 100%;">
                <thead>
                    <tr style="background: #0f172a; color: #ffffff;">
                        <th style="width: 70%; text-align: left; padding: 6px 10px; font-size: 10.5px; font-weight: 800; border: 1px solid #0f172a; letter-spacing: 0.3px;">
                            তারিখ: ${formatAppDate(audit.weekEndDate)} (বৃহস্পতিবার) — ক্রমপুঞ্জিত ও বিয়োগফল (Cumulative Waterfall)
                        </th>
                        <th style="width: 30%; text-align: right; padding: 6px 10px; font-size: 10.5px; font-weight: 800; border: 1px solid #0f172a; color: #38bdf8;">
                            ক্রয়/খরচ দেরহাম রানিং সপ্তাহ (AED د.إ)
                        </th>
                    </tr>
                </thead>
                <tbody>
                    <!-- Row 1: টাকা পাঠানো -->
                    <tr class="print-row-no-break" style="background: #ffffff;">
                        <td style="padding: 5px 8px; border: 1px solid #cbd5e1;">
                            <div style="display: flex; justify-content: space-between; align-items: center;">
                                <strong style="font-size: 11px; color: #0f172a;">${escapeHTML(desc.sent || 'বৃহস্পতিবার পর্যন্ত টাকা পাঠানো')}</strong>
                                <span style="color: #047857;">AED: <b class="num-font" style="font-size: 12px;">${formatAED(cumSent)}</b></span>
                            </div>
                        </td>
                        <td style="text-align: right; padding: 5px 8px; font-weight: 800; border: 1px solid #cbd5e1; color: #047857;" class="num-font">
                            ${runningSent > 0 ? formatAED(runningSent) : '—'}
                        </td>
                    </tr>

                    <!-- Row 2: সর্বমোট মাল ক্রয় -->
                    <tr class="print-row-no-break" style="background: #ffffff;">
                        <td style="padding: 5px 8px; border: 1px solid #cbd5e1;">
                            <div style="display: flex; justify-content: space-between; align-items: center;">
                                <div>
                                    <strong style="font-size: 11px; color: #0f172a;">${escapeHTML(desc.purchase || 'সর্বমোট মাল ক্রয়')}</strong>
                                    ${desc.memos ? `<div style="font-size: 9.5px; color: #64748b; margin-top: 1px;">${escapeHTML(desc.memos)}</div>` : ''}
                                </div>
                                <span style="color: #b45309;">(-) AED: <b class="num-font" style="font-size: 12px;">${formatAED(cumPur)}</b></span>
                            </div>
                        </td>
                        <td style="text-align: right; padding: 5px 8px; font-weight: 800; border: 1px solid #cbd5e1; color: #b45309;" class="num-font">
                            ${runningPur > 0 ? formatAED(runningPur) : '—'}
                        </td>
                    </tr>

                    <!-- Subtotal 1 (টাকা পাঠানো – মাল ক্রয়) -->
                    <tr class="print-row-no-break" style="background: #f0f9ff; font-weight: 800;">
                        <td style="padding: 4px 8px; border: 1px solid #94a3b8; border-left: 3px solid #0284c7; color: #0369a1;">
                            <div style="display: flex; justify-content: space-between; align-items: center;">
                                <span>অবশিষ্ট ফান্ড (টাকা পাঠানো – মাল ক্রয়):</span>
                                <span>AED = <b class="num-font" style="font-size: 12px;">${formatAED(sub1)}</b></span>
                            </div>
                        </td>
                        <td style="background: #f8fafc; border: 1px solid #cbd5e1; text-align: center; color: #94a3b8; font-size: 9px;">—</td>
                    </tr>

                    <!-- Row 3: সর্বমোট খরচ -->
                    <tr class="print-row-no-break" style="background: #ffffff;">
                        <td style="padding: 5px 8px; border: 1px solid #cbd5e1;">
                            <div style="display: flex; justify-content: space-between; align-items: center;">
                                <strong style="font-size: 11px; color: #0f172a;">${escapeHTML(desc.expense || 'সর্বমোট খরচ')}</strong>
                                <span style="color: #dc2626;">(-) AED: <b class="num-font" style="font-size: 12px;">${formatAED(cumExp)}</b></span>
                            </div>
                        </td>
                        <td style="text-align: right; padding: 5px 8px; font-weight: 800; border: 1px solid #cbd5e1; color: #dc2626;" class="num-font">
                            ${runningExp > 0 ? formatAED(runningExp) : '—'}
                        </td>
                    </tr>

                    <!-- Subtotal 2 (নিট ক্যাশ স্থিতি - হাতে থাকার কথা) -->
                    <tr class="print-row-no-break" style="background: #ecfdf5; font-weight: 800;">
                        <td style="padding: 4px 8px; border: 1px solid #94a3b8; border-left: 3px solid #10b981; color: #065f46;">
                            <div style="display: flex; justify-content: space-between; align-items: center;">
                                <span>নিট ক্যাশ স্থিতি (হাতে থাকার কথা):</span>
                                <span>AED = <b class="num-font" style="font-size: 12px;">${formatAED(sub2)}</b></span>
                            </div>
                        </td>
                        <td style="background: #f8fafc; border: 1px solid #cbd5e1; text-align: center; color: #94a3b8; font-size: 9px;">—</td>
                    </tr>

                    <!-- Row 4: মার্কেট এডভান্স (সম্পূর্ণ আলাদা সারি) -->
                    <tr class="print-row-no-break" style="background: #ffffff;">
                        <td style="padding: 5px 8px; border: 1px solid #cbd5e1;">
                            <div style="display: flex; justify-content: space-between; align-items: center;">
                                <strong style="font-size: 11px; color: #0f172a;">${escapeHTML(desc.ad || 'মার্কেট এডভান্স (AD)')}</strong>
                                <span style="color: #0284c7;">(-) AED: <b class="num-font" style="font-size: 12px;">${formatAED(marketAd)}</b></span>
                            </div>
                        </td>
                        <td style="text-align: center; color: #64748b; font-size: 9.5px; border: 1px solid #cbd5e1; background: #f8fafc;">
                            সাপ্লায়ারদের অগ্রিম
                        </td>
                    </tr>

                    <!-- Row 5: নগদ ক্যাশ আছে (সম্পূর্ণ আলাদা সারি) -->
                    <tr class="print-row-no-break" style="background: #ffffff;">
                        <td style="padding: 5px 8px; border: 1px solid #cbd5e1;">
                            <div style="display: flex; justify-content: space-between; align-items: center;">
                                <strong style="font-size: 11px; color: #0f172a;">${escapeHTML(desc.cash || 'নগদ ক্যাশ আছে (Cash in Hand)')}</strong>
                                <span style="color: #059669;">(-) AED: <b class="num-font" style="font-size: 12px;">${formatAED(cashInHand)}</b></span>
                            </div>
                        </td>
                        <td style="text-align: center; color: #64748b; font-size: 9.5px; border: 1px solid #cbd5e1; background: #f8fafc;">
                            ক্যাশ বাক্সে নগদ দেরহাম
                        </td>
                    </tr>

                    <!-- Subtotal 3 (এডভান্স ও ক্যাশ বাদে অবশিষ্ট) -->
                    <tr class="print-row-no-break" style="background: #faf5ff; font-weight: 800;">
                        <td style="padding: 4px 8px; border: 1px solid #c084fc; border-left: 3px solid #8b5cf6; color: #6b21a8;">
                            <div style="display: flex; justify-content: space-between; align-items: center;">
                                <span>অবশিষ্ট ব্যালেন্স (এডভান্স ও ক্যাশ বাদে):</span>
                                <span>AED = <b class="num-font" style="font-size: 12px;">${formatAED(sub3)}</b></span>
                            </div>
                        </td>
                        <td style="background: #f8fafc; border: 1px solid #cbd5e1; text-align: center; color: #94a3b8; font-size: 9px;">—</td>
                    </tr>

                    <!-- Dynamic Holdings Rows -->
                    ${holdingsHtml}

                    <!-- Final Variance Row: ক্যাশ বাড়তি / ঘাটতি -->
                    <tr class="print-row-no-break" style="background: ${isSurplus ? '#f0fdf4' : '#fef2f2'}; font-weight: 900;">
                        <td style="padding: 7px 8px; border: 2px solid ${isSurplus ? '#16a34a' : '#dc2626'};">
                            <div style="display: flex; justify-content: space-between; align-items: center;">
                                <span style="font-size: 12px; color: ${isSurplus ? '#15803d' : '#b91c1c'};">
                                    ${escapeHTML(desc.status || (isSurplus ? '(ক্যাশ সমাপনী স্থিতি — অডিট সমন্বয় সফল)' : '(ক্যাশ ঘাটতি)'))}
                                </span>
                                <span style="font-size: 13px; color: ${isSurplus ? '#15803d' : '#b91c1c'};">
                                    AED = <span class="num-font" style="font-size: 15px;">${formatAED(finalVariance)}</span>
                                </span>
                            </div>
                        </td>
                        <td style="text-align: center; font-weight: 800; font-size: 10.5px; color: ${isSurplus ? '#15803d' : '#b91c1c'}; border: 2px solid ${isSurplus ? '#16a34a' : '#dc2626'};">
                            ${isSurplus ? 'অডিট সমন্বয় সফল (SURPLUS)' : 'ক্যাশ ঘাটতি (DEFICIT)'}
                        </td>
                    </tr>
                </tbody>
            </table>

            <!-- Attached Memos Section (if available) -->
            ${memosSummaryHtml ? `
                <div style="margin-top: 8px; padding: 5px 8px; background: #f8fafc; border: 1.5px solid #cbd5e1; border-radius: 6px;">
                    <div style="font-size: 9.5px; font-weight: 800; color: #334155; margin-bottom: 3px; display: flex; justify-content: space-between;">
                        <span>সংযুক্ত ক্রয় মেমো তালিকা (${memos.length}টি মেমো):</span>
                        <span style="color: #64748b;">মোট ক্রয়: <b class="num-font" style="color: #0f172a;">${formatAED(cumPur)} AED</b></span>
                    </div>
                    <div style="display: flex; flex-wrap: wrap; gap: 3px;">
                        ${memosSummaryHtml}
                    </div>
                </div>
            ` : ''}

            <!-- Signature Footers -->
            <div class="print-row-no-break" style="margin-top: 22px; padding-top: 6px;">
                <div style="display: flex; justify-content: space-between; padding: 0 16px; text-align: center;">
                    <div style="width: 170px;">
                        <div style="border-top: 1.5px dashed #64748b; padding-top: 4px; font-size: 10px; font-weight: 800; color: #1e293b;">
                            দুবাই প্রতিনিধি স্বাক্ষর
                        </div>
                        <div style="font-size: 8px; color: #64748b; font-family: 'Inter', sans-serif;">Dubai Representative</div>
                    </div>
                    <div style="width: 170px;">
                        <div style="border-top: 1.5px dashed #64748b; padding-top: 4px; font-size: 10px; font-weight: 800; color: #1e293b;">
                            অডিটর যাচাই ও নিরীক্ষা
                        </div>
                        <div style="font-size: 8px; color: #64748b; font-family: 'Inter', sans-serif;">Audited & Verified</div>
                    </div>
                    <div style="width: 170px;">
                        <div style="border-top: 1.5px dashed #64748b; padding-top: 4px; font-size: 10px; font-weight: 800; color: #1e293b;">
                            স্বত্বাধিকারী চূড়ান্ত অনুমোদন
                        </div>
                        <div style="font-size: 8px; color: #64748b; font-family: 'Inter', sans-serif;">Proprietor Approval</div>
                    </div>
                </div>
            </div>

            <!-- Print Footer Notice -->
            <div style="margin-top: 12px; text-align: center; font-size: 8px; color: #94a3b8; font-family: 'Inter', 'Hind Siliguri', sans-serif; border-top: 1px dotted #e2e8f0; padding-top: 4px;">
                সফটওয়্যার জেনারেটেড অফিসিয়াল অডিট ভাউচার • মা মোটরস ইআরপি সিস্টেম • প্রিন্ট সময়: ${printTimeStr}
            </div>
        </div>
    `;
}


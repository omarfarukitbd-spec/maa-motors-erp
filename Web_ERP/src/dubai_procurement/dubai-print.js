/**
 * Dubai Procurement & Weekly Audit - Executive 1-Page A4 Print Engine
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
        body { font-family: 'Inter', 'Hind Siliguri', sans-serif; background: #fff; color: #0f172a; }
        .print-box { border: 1px solid #cbd5e1; border-radius: 8px; padding: 8px 12px; margin-bottom: 8px; }
        .print-title-badge { font-size: 11px; font-weight: 800; text-transform: uppercase; color: #334155; border-bottom: 1px solid #e2e8f0; padding-bottom: 4px; margin-bottom: 6px; }
        .num-font { font-family: 'Inter', monospace; font-weight: 700; }
    `;

    printViaIframe(htmlBody, extraCss, title);
}

function generateAuditPrintHtml(audit, memos, remittances, expenses) {
    const formatAEDVal = val => `${formatAmountWithComma(safeRound(parseAmount(val)))}/-`;

    // Memos sub-list for print (compact)
    let memosRowsHtml = '';
    if (memos.length > 0) {
        memosRowsHtml = memos.map(m => `
            <span style="display:inline-block; margin-right:8px; font-size:9.5px; border-bottom:1px dashed #cbd5e1; padding:1px 0;">
                #${m.memoNo}: <b class="num-font">${formatAmountWithComma(m.amount)}</b>
            </span>
        `).join('');
    }

    // Remittances list
    let remRowsHtml = '';
    if (remittances.length > 0) {
        remRowsHtml = remittances.map(r => `
            <div style="display:flex; justify-content:space-between; font-size:10px; border-bottom:1px dotted #e2e8f0; padding:2px 0;">
                <span>${r.date || ''} (${r.via || 'রেমিট্যান্স'})</span>
                <span class="num-font">${formatAEDVal(r.amount)}</span>
            </div>
        `).join('');
    }

    // Custodians list
    let custRowsHtml = '';
    if (Array.isArray(audit.personalHoldings) && audit.personalHoldings.length > 0) {
        custRowsHtml = audit.personalHoldings.map(c => `
            <div style="display:flex; justify-content:space-between; font-size:10px; border-bottom:1px dotted #e2e8f0; padding:2px 0;">
                <span>${c.name || 'ব্যক্তিগত হস্তান্তর'}</span>
                <span class="num-font">${formatAEDVal(c.amount)}</span>
            </div>
        `).join('');
    }

    const varianceAmt = safeRound(parseAmount(audit.varianceAmount));
    const isSurplus = varianceAmt >= 0;

    return `
        <div style="width:100%; box-sizing:border-box; font-size:11px; line-height:1.35;">
            <!-- Header -->
            <div style="text-align:center; border-bottom:2px solid #0f172a; padding-bottom:6px; margin-bottom:8px;">
                <div style="font-size:18px; font-weight:900; letter-spacing:0.5px; color:#0f172a;">মা মোটরস — দুবাই কনটেইনার ও বিদেশি ক্রয় খতিয়ান</div>
                <div style="font-size:10px; font-weight:700; color:#475569; text-transform:uppercase; letter-spacing:1px;">
                    MAA MOTORS • OVERSEAS PROCUREMENT & WEEKLY CASH AUDIT (AED)
                </div>
                <div style="display:flex; justify-content:space-between; margin-top:6px; font-size:10.5px; background:#f8fafc; padding:4px 8px; border-radius:6px; border:1px solid #e2e8f0;">
                    <div><b>কনটেইনার আইডি:</b> ${audit.containerNo || 'CT-DXB-01'}</div>
                    <div><b>অডিট তারিখ:</b> ${audit.weekEndDate || ''} (বৃহস্পতিবার)</div>
                    <div><b>কারেন্সি:</b> UAE Dirham (AED د.إ)</div>
                    <div><b>স্ট্যাটাস:</b> <span style="color:#047857; font-weight:800;">${audit.status || 'CLOSED'}</span></div>
                </div>
            </div>

            <!-- Two Column Layout: Inflows & Outflows vs Physical Holdings -->
            <div style="display:grid; grid-template-columns:1.05fr 0.95fr; gap:10px;">
                <!-- LEFT COLUMN: FLOWS & THEORETICAL CASH -->
                <div>
                    <!-- 1. দেশ থেকে দেরহাম আসা -->
                    <div class="print-box" style="background:#f0fdf4; border-color:#bbf7d0;">
                        <div class="print-title-badge" style="color:#166534;">১. দেশ থেকে দেরহাম আসা (Remittances)</div>
                        <div style="display:flex; justify-content:space-between; font-size:10px; margin-bottom:3px;">
                            <span>পূর্বের মোট আগমন:</span>
                            <span class="num-font">${formatAEDVal(audit.prevRemittance)}</span>
                        </div>
                        ${remRowsHtml ? `<div style="margin:4px 0; max-height:80px; overflow:hidden;">${remRowsHtml}</div>` : ''}
                        <div style="display:flex; justify-content:space-between; font-size:10px; margin-bottom:3px;">
                            <span>এই সপ্তাহের নতুন রেমিট্যান্স:</span>
                            <span class="num-font">+ ${formatAEDVal(audit.weeklyRemittanceTotal)}</span>
                        </div>
                        <div style="display:flex; justify-content:space-between; font-size:11.5px; font-weight:800; border-top:1px solid #86efac; padding-top:3px; color:#14532d;">
                            <span>সর্বমোট প্রাপ্ত দেরহাম:</span>
                            <span class="num-font">${formatAEDVal(audit.cumulativeRemittance)}</span>
                        </div>
                    </div>

                    <!-- 2. মাল কেনার হিসাব -->
                    <div class="print-box" style="background:#fff7ed; border-color:#fed7aa;">
                        <div class="print-title-badge" style="color:#9a3412;">২. মাল কেনার হিসাব (${audit.memoCount || 0}টি মেমো)</div>
                        <div style="display:flex; justify-content:space-between; font-size:10px; margin-bottom:3px;">
                            <span>পূর্বের মোট ক্রয়:</span>
                            <span class="num-font">${formatAEDVal(audit.prevPurchaseTotal)}</span>
                        </div>
                        <div style="display:flex; justify-content:space-between; font-size:10px; margin-bottom:3px;">
                            <span>এই সপ্তাহের ক্রয় (${audit.memoCount || 0}টি মেমো):</span>
                            <span class="num-font">+ ${formatAEDVal(audit.weeklyPurchaseTotal)}</span>
                        </div>
                        <div style="display:flex; justify-content:space-between; font-size:11.5px; font-weight:800; border-top:1px solid #fdba74; padding-top:3px; color:#7c2d12;">
                            <span>সর্বমোট ক্রয় ব্যালেন্স:</span>
                            <span class="num-font">${formatAEDVal(audit.cumulativePurchaseTotal)}</span>
                        </div>
                        ${memosRowsHtml ? `<div style="margin-top:6px; line-height:1.5; background:#fff; padding:4px 6px; border-radius:4px; border:1px solid #ffedd5;">${memosRowsHtml}</div>` : ''}
                    </div>

                    <!-- 3. আনুষঙ্গিক লজিস্টিক খরচ -->
                    <div class="print-box" style="background:#fef2f2; border-color:#fecaca;">
                        <div class="print-title-badge" style="color:#991b1b;">৩. আনুষঙ্গিক খরচ হিসাব (Expenses)</div>
                        <div style="display:flex; justify-content:space-between; font-size:10px; margin-bottom:3px;">
                            <span>পূর্বের মোট খরচ:</span>
                            <span class="num-font">${formatAEDVal(audit.prevExpenseTotal)}</span>
                        </div>
                        <div style="display:flex; justify-content:space-between; font-size:10px; margin-bottom:3px;">
                            <span>এই সপ্তাহের নতুন খরচ:</span>
                            <span class="num-font">+ ${formatAEDVal(audit.weeklyExpenseTotal)}</span>
                        </div>
                        <div style="display:flex; justify-content:space-between; font-size:11.5px; font-weight:800; border-top:1px solid #fca5a5; padding-top:3px; color:#7f1d1d;">
                            <span>সর্বমোট খরচ ব্যালেন্স:</span>
                            <span class="num-font">${formatAEDVal(audit.cumulativeExpenseTotal)}</span>
                        </div>
                    </div>

                    <!-- 4. হিসাব অনুযায়ী নিট ক্যাশ স্থিতি -->
                    <div class="print-box" style="background:#f8fafc; border:1.5px solid #64748b;">
                        <div style="display:flex; justify-content:space-between; align-items:center;">
                            <div>
                                <div style="font-size:11px; font-weight:800; color:#1e293b;">হিসাব অনুযায়ী নিট ক্যাশ স্থিতি</div>
                                <div style="font-size:8.5px; color:#64748b;">(মোট দেরহাম - মোট ক্রয় - মোট খরচ)</div>
                            </div>
                            <div class="num-font" style="font-size:14px; font-weight:900; color:#0f172a;">
                                ${formatAEDVal(audit.calculatedCashBalance)}
                            </div>
                        </div>
                    </div>
                </div>

                <!-- RIGHT COLUMN: PHYSICAL ASSETS & RECONCILIATION -->
                <div>
                    <div class="print-box" style="background:#f8fafc; border:1.5px solid #cbd5e1; height:calc(100% - 10px); display:flex; flex-col; justify-content:space-between;">
                        <div>
                            <div class="print-title-badge" style="color:#0f172a; font-size:12px;">সমাপনী বাস্তব সম্পদ ও মার্কেট অবস্থান</div>
                            
                            <!-- নগদ ক্যাশ -->
                            <div style="display:flex; justify-content:space-between; padding:4px 0; border-bottom:1px solid #e2e8f0; font-size:11px;">
                                <div><b>১. নগদ ক্যাশ (Cash in Hand)</b><br><span style="font-size:8.5px; color:#64748b;">অফিস ভল্ট / ক্যাশ বাক্স</span></div>
                                <div class="num-font" style="font-size:12px; color:#047857;">${formatAEDVal(audit.cashInHand)}</div>
                            </div>

                            <!-- মার্কেট এডভান্স -->
                            <div style="display:flex; justify-content:space-between; padding:4px 0; border-bottom:1px solid #e2e8f0; font-size:11px;">
                                <div><b>২. মার্কেট এডভান্স (AD)</b><br><span style="font-size:8.5px; color:#64748b;">ইয়ার্ড ও সাপ্লায়ার অগ্রিম</span></div>
                                <div class="num-font" style="font-size:12px; color:#0369a1;">${formatAEDVal(audit.marketAdvance)}</div>
                            </div>

                            <!-- ব্যক্তিগত হস্তান্তর -->
                            <div style="padding:4px 0; border-bottom:1px solid #e2e8f0;">
                                <div style="font-size:11px; font-weight:700; margin-bottom:2px;">৩. ব্যক্তিগত হেফাজত / হস্তান্তর:</div>
                                ${custRowsHtml || '<div style="font-size:9.5px; color:#94a3b8; font-style:italic;">কোনো ব্যক্তি জমা নেই</div>'}
                            </div>

                            <!-- মেস ব্যালেন্স -->
                            <div style="display:flex; justify-content:space-between; padding:4px 0; border-bottom:1px solid #e2e8f0; font-size:11px;">
                                <div><b>৪. মেস ফান্ড (Mess Balance)</b></div>
                                <div class="num-font" style="font-size:11px;">${formatAEDVal(audit.messBalance)}</div>
                            </div>

                            <!-- সর্বমোট বাস্তব সম্পদ -->
                            <div style="display:flex; justify-content:space-between; padding:6px 0; margin-top:8px; background:#e2e8f0; border-radius:4px; padding:6px 8px; font-size:12px; font-weight:900;">
                                <span>মোট ঘোষিত বাস্তব সম্পদ:</span>
                                <span class="num-font" style="color:#0f172a;">${formatAEDVal(audit.totalPhysicalAssets)}</span>
                            </div>
                        </div>

                        <!-- ভ্যারিয়েন্স কার্ড -->
                        <div style="margin-top:12px; padding:8px 10px; border-radius:6px; background:${isSurplus ? '#ecfdf5' : '#fff1f2'}; border:1.5px solid ${isSurplus ? '#10b981' : '#f43f5e'};">
                            <div style="font-size:10px; font-weight:800; color:${isSurplus ? '#047857' : '#be123c'}; text-transform:uppercase;">
                                সাপ্তাহিক রিকনসিলিয়েশন ভ্যারিয়েন্স:
                            </div>
                            <div style="display:flex; justify-content:space-between; align-items:center; margin-top:2px;">
                                <span style="font-size:11px; font-weight:700;">
                                    ${isSurplus ? 'ক্যাশ উদ্বৃত্ত / বাড়তি (Surplus)' : 'ক্যাশ ঘাটতি / শর্ট (Deficit)'}
                                </span>
                                <span class="num-font" style="font-size:14px; font-weight:900; color:${isSurplus ? '#047857' : '#be123c'};">
                                    ${formatAEDVal(varianceAmt)}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Signature Footers -->
            <div style="margin-top:16px; padding-top:10px; border-top:1px solid #cbd5e1; display:flex; justify-content:space-between; text-align:center; font-size:10px; color:#475569;">
                <div style="width:180px;">
                    <div style="border-top:1px dashed #94a3b8; margin-top:25px; padding-top:4px;">দুবাই প্রতিনিধি স্বাক্ষর</div>
                </div>
                <div style="width:180px;">
                    <div style="border-top:1px dashed #94a3b8; margin-top:25px; padding-top:4px;">অডিটর যাচাই</div>
                </div>
                <div style="width:180px;">
                    <div style="border-top:1px dashed #94a3b8; margin-top:25px; padding-top:4px;">স্বত্বাধিকারী অনুমোদন</div>
                </div>
            </div>
        </div>
    `;
}

import{_ as e,g as t,l as n}from"./ui-helpers-ChDNPFdp.js";function r(r,i={},a={}){let o=r.voucherNo?String(r.voucherNo).trim():`মেমো`,s=o.startsWith(`#`)?o:`#${o}`,c=r.date?n(r.date):``,l=Number(r.bill||0),u=Number(r.paid||0),d=i.currentIdx||1,f=i.totalMemos||1,p=t((i.customerName||``).replace(/^\[.*?\]\s*/,``).trim()||`সম্মানিত গ্রাহক`),m=t(i.accountNo||``),h=t(a.shopName||`M/S. MAA-MOTOR'S`),g=t(a.shopPhone||`01819-397669, 01815-707934`);return`
        <div class="print-page memo-print-page" style="page-break-before: always; break-before: page; min-height: 1123px; width: 794px; padding: 18px 24px; box-sizing: border-box; background: #ffffff; display: flex; flex-direction: column; justify-content: flex-start; align-items: center; margin: 0 auto; font-family: 'Inter', 'Kalpurush', 'Hind Siliguri', sans-serif;">
            
            <!-- Compact Corporate Scanned Memo Header -->
            <div style="width: 100%; background: linear-gradient(135deg, #0284c7 0%, #0369a1 100%) !important; color: #ffffff !important; border-radius: 12px; padding: 10px 16px; display: flex; justify-content: space-between; align-items: center; box-shadow: 0 2px 8px rgba(2, 132, 199, 0.2); -webkit-print-color-adjust: exact; print-color-adjust: exact; margin-bottom: 8px;">
                <div style="display: flex; align-items: center; gap: 12px;">
                    <div style="width: 40px; height: 40px; background: #ffffff !important; border-radius: 50%; display: flex; align-items: center; justify-content: center; overflow: hidden; border: 2px solid #ffffff; flex-shrink: 0; padding: 1px;">
                        <img src="${a.shopLogo||`/shop-official-logo.jpg`}" style="width: 100%; height: 100%; object-fit: contain; border-radius: 50%; display: block;" />
                    </div>
                    <div>
                        <h2 style="font-size: 15px; font-weight: 900 !important; margin: 0; text-transform: uppercase; line-height: 1.1; color: #ffffff !important; font-family: 'Inter', sans-serif;">${h}</h2>
                        <p style="font-size: 9.5px; margin: 2px 0 0 0; opacity: 0.95; font-weight: 600 !important; color: #ffffff !important;">সংযুক্ত মূল মেমো • মুরাদপুর, চট্টগ্রাম | মোবাইল: ${g}</p>
                    </div>
                </div>
                <div style="text-align: right; flex-shrink: 0;">
                    <div style="display: inline-block; font-size: 12px; font-weight: 900 !important; text-transform: uppercase; background: rgba(255, 255, 255, 0.2) !important; border: 1px solid rgba(255, 255, 255, 0.4); padding: 4px 12px; border-radius: 8px; color: #ffffff !important; font-family: 'Inter', monospace;">
                        ভাউচার ${s}
                    </div>
                    <div style="font-size: 9px; font-weight: 700; margin-top: 3px; opacity: 0.95; color: #e0f2fe;">কপি ${d}/${f}</div>
                </div>
            </div>

            <!-- Structured Metadata Strip -->
            <div style="width: 100%; background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 6px 12px; display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px; font-size: 10.5px; color: #334155;">
                <div style="display: flex; align-items: center; gap: 8px;">
                    <span><strong>গ্রাহক:</strong> <span style="color: #0f172a; font-weight: 800;">${p}</span>${m?` <span style="color: #64748b; font-size: 9.5px;">(A/C: ${m})</span>`:``}</span>
                    <span style="color: #cbd5e1;">•</span>
                    ${c?`<span><strong>তারিখ:</strong> <span style="font-weight: 700;">${c}</span></span>`:``}
                </div>
                <div style="display: flex; align-items: center; gap: 8px;">
                    ${l>0?`<span style="background: #fef2f2; color: #dc2626; border: 1px solid #fecaca; padding: 1px 7px; border-radius: 5px; font-weight: 800; font-family: monospace; font-size: 10px;">বিল: ৳ ${e(l)}</span>`:``}
                    ${u>0?`<span style="background: #ecfdf5; color: #059669; border: 1px solid #a7f3d0; padding: 1px 7px; border-radius: 5px; font-weight: 800; font-family: monospace; font-size: 10px;">জমা: ৳ ${e(u)}</span>`:``}
                    <span style="background: #eff6ff; color: #1d4ed8; border: 1px solid #bfdbfe; padding: 1px 7px; border-radius: 5px; font-size: 9.5px; font-weight: 800;">✓ অনুমোদিত কপি</span>
                </div>
            </div>

            <!-- Scanned Memo Image Display Canvas -->
            <div style="width: 100%; flex-grow: 1; display: flex; align-items: center; justify-content: center; max-height: 980px; overflow: hidden;">
                <img src="${r.url}" style="max-width: 100%; max-height: 965px; object-fit: contain; border: 1px solid #cbd5e1; border-radius: 8px; box-shadow: 0 4px 14px rgba(0,0,0,0.06);" alt="Scanned Memo ${s}">
            </div>

            <!-- Subtle Corporate Footer Line -->
            <div style="width: 100%; display: flex; justify-content: space-between; font-size: 8.5px; color: #94a3b8; padding-top: 6px; border-top: 1px dashed #e2e8f0; margin-top: auto;">
                <span>মা মোটরস্ ইআরপি ক্লাউড আর্কাইভে সংরক্ষিত মূল স্ক্যান ভাউচার</span>
                <span style="font-family: monospace;">পৃষ্ঠা ${d} / ${f}</span>
            </div>

        </div>
    `}export{r as t};
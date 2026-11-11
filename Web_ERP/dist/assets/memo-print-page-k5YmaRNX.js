import{_ as e,b as t,s as n,y as r}from"./ui-helpers-BA8fJYbk.js";function i(i,a={},o={}){let s=i.voucherNo?String(i.voucherNo).trim():`মেমো`,c=s.startsWith(`#`)?s:`#${s}`,l=i.date?n(i.date):``,u=Number(i.bill||0),d=Number(i.paid||0),f=a.currentIdx||1,p=a.totalMemos||1,m=a.pageNum===void 0?f:a.pageNum,h=a.totalPages===void 0?p:a.totalPages,g=r((a.customerName||``).replace(/^\[.*?\]\s*/,``).trim()||`সম্মানিত গ্রাহক`),_=r(a.accountNo||``);return`
        <div class="print-page memo-print-page" style="page-break-before: always; break-before: page; min-height: 1070px; max-height: 1105px; width: 794px; padding: 16px 22px; box-sizing: border-box; background: #ffffff; display: flex; flex-direction: column; justify-content: flex-start; align-items: center; margin: 0 auto; font-family: 'Anek Bangla', 'Hind Siliguri', 'Inter', sans-serif;">
            
            <!-- Official Mother PDF Header -->
            <div style="width: 100%;">
                ${e(o,{title:`সংযুক্ত স্ক্যান মেমো কপি (${f}/${p})`,pageLabel:`ভাউচার নং`,pageNo:c})}
            </div>

            <!-- Structured Metadata Strip -->
            <div style="width: 100%; background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 6px 12px; display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px; font-size: 10.5px; color: #334155;">
                <div style="display: flex; align-items: center; gap: 8px;">
                    <span><strong>গ্রাহক:</strong> <span style="color: #0f172a; font-weight: 800;">${g}</span>${_?` <span style="color: #64748b; font-size: 9.5px;">(A/C: ${_})</span>`:``}</span>
                    <span style="color: #cbd5e1;">•</span>
                    ${l?`<span><strong>তারিখ:</strong> <span style="font-weight: 700;">${l}</span></span>`:``}
                </div>
                <div style="display: flex; align-items: center; gap: 8px;">
                    ${u>0?`<span style="background: #fef2f2; color: #dc2626; border: 1px solid #fecaca; padding: 1px 7px; border-radius: 5px; font-weight: 800; font-family: monospace; font-size: 10px;">বিল: ৳ ${t(u)}</span>`:``}
                    ${d>0?`<span style="background: #ecfdf5; color: #059669; border: 1px solid #a7f3d0; padding: 1px 7px; border-radius: 5px; font-weight: 800; font-family: monospace; font-size: 10px;">জমা: ৳ ${t(d)}</span>`:``}
                    <span style="background: #eff6ff; color: #1d4ed8; border: 1px solid #bfdbfe; padding: 1px 7px; border-radius: 5px; font-size: 9.5px; font-weight: 800;">✓ অনুমোদিত কপি</span>
                </div>
            </div>

            <!-- Scanned Memo Image Display Canvas -->
            <div style="width: 100%; flex-grow: 1; display: flex; align-items: center; justify-content: center; max-height: 935px; overflow: hidden;">
                <img src="${i.url}" style="max-width: 100%; max-height: 920px; object-fit: contain; border: 1px solid #cbd5e1; border-radius: 8px; box-shadow: 0 4px 14px rgba(0,0,0,0.06);" alt="Scanned Memo ${c}">
            </div>

            <!-- Subtle Corporate Footer Line -->
            <div style="width: 100%; display: flex; justify-content: space-between; font-size: 8.5px; color: #94a3b8; padding-top: 6px; border-top: 1px dashed #e2e8f0; margin-top: auto;">
                <span>মা মোটরস্ ইআরপি ক্লাউড আর্কাইভে সংরক্ষিত মূল স্ক্যান ভাউচার</span>
                <span style="font-family: monospace;">পৃষ্ঠা ${m} / ${h}</span>
            </div>

        </div>
    `}export{i as t};
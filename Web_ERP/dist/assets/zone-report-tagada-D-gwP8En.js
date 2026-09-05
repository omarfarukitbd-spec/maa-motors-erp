import{i as e}from"./rolldown-runtime-Dd_uD5pT.js";import{s as t}from"./dao-CJk3sbx1.js";import{_ as n,b as r,c as i,f as a,g as o,p as s}from"./ui-helpers-vB-cDBaI.js";import{n as c}from"./vendor-ui-n4g2UPZQ.js";import{n as l,t as u}from"./index-UFICEZQ3.js";var d=e(c());async function f(e){let{customers:c}=e,f=e.selectedZone,p=c.filter(e=>(!f||(e.zone||``).trim()===f)&&(Number(e.totalDue)||0)>0);if(p.length===0)return d.default.fire(`তালিকায় কোনো বকেয়া কাস্টমার নেই`,`সিলেক্ট করা জোনে কোনো বকেয়াওয়ালা কাস্টমার পাওয়া যায়নি।`,`warning`);p.sort((e,t)=>(Number(t.totalDue)||0)-(Number(e.totalDue)||0));let m=await t.getAppSettings(),h=f?`${f} জোনের ফিল্ড তাগাদা ও আদায় রেজিস্টার`:`সকল জোনের ফিল্ড তাগাদা ও আদায় রেজিস্টার`,g=0;p.forEach(e=>g=r(g+(Number(e.totalDue)||0)));let _=s(),[v,y,b]=_.split(`-`),x=`${b}/${y}/${v}`,S=i(m,{title:f?`${f} TAGADA SHEET`:`FIELD TAGADA SHEET`,subtitle:`${h} • ${x} (${a(_)})`}),C=`
        <div style="display:flex; justify-content:space-between; align-items:flex-end; border-bottom:2px solid #0284c7; padding-bottom:4px; margin-bottom:8px;">
            <div style="font-size:14px; font-weight:900; color:#0f172a; font-family:'Inter',sans-serif;">FIELD TAGADA SHEET <span style="font-size:10px; color:#475569; font-weight:normal;">(Continued)</span></div>
            <div style="font-size:10px; color:#475569; font-family:'Hind Siliguri',sans-serif;">${h}</div>
        </div>
    `,w=p.map((e,t)=>{let r=t%2==0?`background: #ffffff;`:`background: #f8fafc;`,i=Number(e.totalDue)||0;return`
            <tr class="print-row-no-break" style="${r}">
                <td style="text-align:center; vertical-align:middle; border: 1px solid #cbd5e1; padding: 6px 4px; font-size: 11px; font-family: 'Inter', sans-serif;">${t+1}</td>
                <td style="text-align:center; vertical-align:middle; border: 1px solid #cbd5e1; padding: 6px 4px; font-size: 11px; font-weight: 800; font-family: 'Inter', monospace; color: #0284c7;">${o(e.accountNo||`-`)}</td>
                <td style="text-align:left; vertical-align:middle; border: 1px solid #cbd5e1; padding: 6px 6px; font-size: 11px; font-family: 'Kalpurush', 'Hind Siliguri', sans-serif; line-height: 1.25; color: #0f172a;">
                    <strong>${o(e.name)}</strong><br>
                    <span style="font-size:10px; color:#475569;">${o(e.phone||`-`)}</span>
                </td>
                <td style="text-align:left; vertical-align:middle; border: 1px solid #cbd5e1; padding: 6px 6px; font-size: 10.5px; font-family: 'Kalpurush', 'Hind Siliguri', sans-serif; line-height: 1.25; color: #334155;">${o(e.address||`-`)}</td>
                <td style="text-align:right; vertical-align:middle; border: 1px solid #cbd5e1; padding: 6px 6px; font-size: 11px; font-weight: 900; color: #dc2626; font-family: 'Inter', sans-serif; white-space: nowrap;">৳ ${n(i)}</td>
                <td style="border: 1px solid #cbd5e1; padding: 6px; width: 110px;"></td>
                <td style="border: 1px solid #cbd5e1; padding: 6px; width: 90px;"></td>
            </tr>
        `}),T=`
        <div style="display: flex; justify-content: flex-end; margin-top: 16px; page-break-inside: avoid; break-inside: avoid;">
            <div style="width: 280px; background: #f8fafc; border: 1px solid #cbd5e1; border-radius: 10px; padding: 12px; font-family: 'Hind Siliguri', sans-serif; box-shadow: 0 1px 3px rgba(0,0,0,0.05);">
                <div style="display: flex; justify-content: space-between; font-size: 12px; margin-bottom: 6px; border-bottom: 1px dashed #cbd5e1; padding-bottom: 4px;">
                    <span style="color: #64748b; font-weight: 700;">মোট বকেয়া কাস্টমার:</span>
                    <strong style="color: #0f172a; font-weight: 900;">${p.length} জন</strong>
                </div>
                <div style="display: flex; justify-content: space-between; font-size: 12px;">
                    <span style="color: #64748b; font-weight: 700;">মোট ফিল্ড বকেয়া:</span>
                    <strong style="color: #dc2626; font-size: 15px; font-weight: 900;">৳ ${n(g)}</strong>
                </div>
            </div>
        </div>
    `,E=await l({rowsArray:w,page1HeaderHtml:S,repeatHeaderHtml:C,tableColHeaderHtml:`
        <thead>
            <tr style="background: #f1f5f9; border-bottom: 2px solid #cbd5e1;">
                <th style="text-align: center; border: 1px solid #cbd5e1; padding: 7px 4px; font-size: 10.5px; font-weight: 900; color: #1e293b; font-family: 'Hind Siliguri', sans-serif;">SL</th>
                <th style="text-align: center; border: 1px solid #cbd5e1; padding: 7px 4px; font-size: 10.5px; font-weight: 900; color: #1e293b; font-family: 'Hind Siliguri', sans-serif;">A/C</th>
                <th style="text-align: left; border: 1px solid #cbd5e1; padding: 7px 6px; font-size: 10.5px; font-weight: 900; color: #1e293b; font-family: 'Hind Siliguri', sans-serif;">কাস্টমার ও মোবাইল</th>
                <th style="text-align: left; border: 1px solid #cbd5e1; padding: 7px 6px; font-size: 10.5px; font-weight: 900; color: #1e293b; font-family: 'Hind Siliguri', sans-serif;">ঠিকানা</th>
                <th style="text-align: right; border: 1px solid #cbd5e1; padding: 7px 6px; font-size: 10.5px; font-weight: 900; color: #1e293b; font-family: 'Hind Siliguri', sans-serif;">বকেয়া (৳)</th>
                <th style="text-align: center; border: 1px solid #cbd5e1; padding: 7px 4px; font-size: 10.5px; font-weight: 900; color: #1e293b; font-family: 'Hind Siliguri', sans-serif;">আদায়কৃত টাকা (৳)</th>
                <th style="text-align: center; border: 1px solid #cbd5e1; padding: 7px 4px; font-size: 10.5px; font-weight: 900; color: #1e293b; font-family: 'Hind Siliguri', sans-serif;">স্বাক্ষর/তারিখ</th>
            </tr>
        </thead>
    `,summaryHtml:T,signatureHtml:`
        <div class="signature-last-page-block" style="margin-top: 45px; page-break-inside: avoid; break-inside: avoid;">
            <div style="display: flex; justify-content: space-between; padding: 0 30px;">
                <div style="border-top: 1.5px dashed #64748b; width: 160px; text-align: center; font-size: 11px; font-weight: 700; color: #334155; padding-top: 6px;">
                    সংগ্রহকারীর স্বাক্ষর<br><span style="font-size: 9px; font-weight: normal; color: #64748b;">Collector Signature</span>
                </div>
                <div style="border-top: 1.5px dashed #64748b; width: 160px; text-align: center; font-size: 11px; font-weight: 700; color: #334155; padding-top: 6px;">
                    কর্তৃপক্ষের স্বাক্ষর<br><span style="font-size: 9px; font-weight: normal; color: #64748b;">Authorized Signature</span>
                </div>
            </div>
        </div>
    `,formattedDate:x});u(E)}export{f as printZoneTagadaReport};
import{i as e}from"./rolldown-runtime-Dd_uD5pT.js";import{s as t}from"./dao-CJk3sbx1.js";import{c as n,d as r,h as i,m as a,v as o}from"./ui-helpers-OIqdNIvE.js";import{n as s}from"./vendor-ui-n4g2UPZQ.js";import{n as c,t as l}from"./index-CzSX0QGa.js";var u=e(s());async function d(e){let{customers:s}=e,d=e.selectedZone,f=s.filter(e=>(!d||(e.zone||``).trim()===d)&&(Number(e.totalDue)||0)>0);if(f.length===0)return u.default.fire(`তালিকায় কোনো বকেয়া কাস্টমার নেই`,`সিলেক্ট করা জোনে কোনো বকেয়াওয়ালা কাস্টমার পাওয়া যায়নি।`,`warning`);f.sort((e,t)=>(Number(t.totalDue)||0)-(Number(e.totalDue)||0));let p=await t.getAppSettings(),m=d?`${d} জোনের ফিল্ড তাগাদা ও আদায় রেজিস্টার`:`সকল জোনের ফিল্ড তাগাদা ও আদায় রেজিস্টার`,h=0;f.forEach(e=>h=o(h+(Number(e.totalDue)||0)));let[g,_,v]=r().split(`-`),y=`${v}/${_}/${g}`,b=n(p,{title:d?`${d} TAGADA SHEET`:`FIELD TAGADA SHEET`,subtitle:`${m} • ${y}`}),x=`
        <div style="display:flex; justify-content:space-between; align-items:flex-end; border-bottom:2px solid #0284c7; padding-bottom:4px; margin-bottom:8px;">
            <div style="font-size:14px; font-weight:900; color:#0f172a; font-family:'Inter',sans-serif;">FIELD TAGADA SHEET <span style="font-size:10px; color:#475569; font-weight:normal;">(Continued)</span></div>
            <div style="font-size:10px; color:#475569; font-family:'Hind Siliguri',sans-serif;">${m}</div>
        </div>
    `,S=f.map((e,t)=>{let n=t%2==0?`background: #ffffff;`:`background: #f8fafc;`,r=Number(e.totalDue)||0;return`
            <tr class="print-row-no-break" style="${n}">
                <td style="text-align:center; vertical-align:middle; border: 1px solid #cbd5e1; padding: 6px 4px; font-size: 11px; font-family: 'Inter', sans-serif;">${t+1}</td>
                <td style="text-align:center; vertical-align:middle; border: 1px solid #cbd5e1; padding: 6px 4px; font-size: 11px; font-weight: 800; font-family: 'Inter', monospace; color: #0284c7;">${a(e.accountNo||`-`)}</td>
                <td style="text-align:left; vertical-align:middle; border: 1px solid #cbd5e1; padding: 6px 6px; font-size: 11px; font-family: 'Kalpurush', 'Hind Siliguri', sans-serif; line-height: 1.25; color: #0f172a;">
                    <strong>${a(e.name)}</strong><br>
                    <span style="font-size:10px; color:#475569;">${a(e.phone||`-`)}</span>
                </td>
                <td style="text-align:left; vertical-align:middle; border: 1px solid #cbd5e1; padding: 6px 6px; font-size: 10.5px; font-family: 'Kalpurush', 'Hind Siliguri', sans-serif; line-height: 1.25; color: #334155;">${a(e.address||`-`)}</td>
                <td style="text-align:right; vertical-align:middle; border: 1px solid #cbd5e1; padding: 6px 6px; font-size: 11px; font-weight: 900; color: #dc2626; font-family: 'Inter', sans-serif; white-space: nowrap;">৳ ${i(r)}</td>
                <td style="border: 1px solid #cbd5e1; padding: 6px; width: 110px;"></td>
                <td style="border: 1px solid #cbd5e1; padding: 6px; width: 90px;"></td>
            </tr>
        `}),C=`
        <div style="display: flex; justify-content: flex-end; margin-top: 16px; page-break-inside: avoid; break-inside: avoid;">
            <div style="width: 280px; background: #f8fafc; border: 1px solid #cbd5e1; border-radius: 10px; padding: 12px; font-family: 'Hind Siliguri', sans-serif; box-shadow: 0 1px 3px rgba(0,0,0,0.05);">
                <div style="display: flex; justify-content: space-between; font-size: 12px; margin-bottom: 6px; border-bottom: 1px dashed #cbd5e1; padding-bottom: 4px;">
                    <span style="color: #64748b; font-weight: 700;">মোট বকেয়া কাস্টমার:</span>
                    <strong style="color: #0f172a; font-weight: 900;">${f.length} জন</strong>
                </div>
                <div style="display: flex; justify-content: space-between; font-size: 12px;">
                    <span style="color: #64748b; font-weight: 700;">মোট ফিল্ড বকেয়া:</span>
                    <strong style="color: #dc2626; font-size: 15px; font-weight: 900;">৳ ${i(h)}</strong>
                </div>
            </div>
        </div>
    `,w=await c({rowsArray:S,page1HeaderHtml:b,repeatHeaderHtml:x,tableColHeaderHtml:`
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
    `,summaryHtml:C,signatureHtml:`
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
    `,formattedDate:y});l(w)}export{d as printZoneTagadaReport};
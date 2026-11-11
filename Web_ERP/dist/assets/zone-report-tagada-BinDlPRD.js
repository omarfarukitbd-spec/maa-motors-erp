import{i as e}from"./rolldown-runtime-Dd_uD5pT.js";import{s as t}from"./dao-vTQ5Se06.js";import"./audit-C2Xq9Grk.js";import{C as n,_ as r,b as i,d as a,h as o,m as s,u as c,v as l,y as u}from"./ui-helpers-BA8fJYbk.js";import{n as d}from"./vendor-ui-n4g2UPZQ.js";var f=e(d());async function p(e){let{customers:d}=e,p=e.selectedZone,m=d.filter(e=>(!p||(e.zone||``).trim()===p)&&(Number(e.totalDue)||0)>0);if(m.length===0)return f.default.fire(`তালিকায় কোনো বকেয়া কাস্টমার নেই`,`সিলেক্ট করা জোনে কোনো বকেয়াওয়ালা কাস্টমার পাওয়া যায়নি।`,`warning`);m.sort((e,t)=>(Number(t.totalDue)||0)-(Number(e.totalDue)||0));let h=await t.getAppSettings(),g=p?`${p} জোনের ফিল্ড তাগাদা ও আদায় রেজিস্টার`:`সকল জোনের ফিল্ড তাগাদা ও আদায় রেজিস্টার`,_=0;m.forEach(e=>_=n(_+(Number(e.totalDue)||0)));let v=a(),[y,b,x]=v.split(`-`),S=`${x}/${b}/${y}`,C=p?`${u(p)} তাগাদা শিট`:`ফিল্ড তাগাদা শিট`,w=`${S} (${c(v)})`,T=`
        ${r(h,{title:C,pageLabel:`প্রিন্ট তারিখ`,pageNo:S})}
        <div style="display:flex; justify-content:space-between; align-items:center; background:#f8fafc; border:1px solid #cbd5e1; border-left:4px solid #0284c7; border-radius:4px; padding:4px 10px; margin-bottom:8px; font-family:'Anek Bangla','Hind Siliguri',sans-serif; font-size:10px; color:#0f172a;">
            <span><strong>তাগাদা বিবরণ:</strong> ${u(g)}</span>
            <span><strong>তারিখ:</strong> ${w}</span>
        </div>
    `,E=l(C,`${u(g)} • ${w}`),D=m.map((e,t)=>{let n=t%2==0?`background: #ffffff;`:`background: #f8fafc;`,r=Number(e.totalDue)||0;return`
            <tr class="print-row-no-break" style="${n}">
                <td style="text-align:center; vertical-align:middle; border: 1px solid #cbd5e1; padding: 6px 4px; font-size: 11px; font-family: 'Inter', sans-serif;">${t+1}</td>
                <td style="text-align:center; vertical-align:middle; border: 1px solid #cbd5e1; padding: 6px 4px; font-size: 11px; font-weight: 800; font-family: 'Inter', monospace; color: #0284c7;">${u(e.accountNo||`-`)}</td>
                <td style="text-align:left; vertical-align:middle; border: 1px solid #cbd5e1; padding: 6px 6px; font-size: 11px; font-family: 'Kalpurush', 'Hind Siliguri', sans-serif; line-height: 1.25; color: #0f172a;">
                    <strong>${u(e.name)}</strong><br>
                    <span style="font-size:10px; color:#475569;">${u(e.phone||`-`)}</span>
                </td>
                <td style="text-align:left; vertical-align:middle; border: 1px solid #cbd5e1; padding: 6px 6px; font-size: 10.5px; font-family: 'Kalpurush', 'Hind Siliguri', sans-serif; line-height: 1.25; color: #334155;">${u(e.address||`-`)}</td>
                <td style="text-align:right; vertical-align:middle; border: 1px solid #cbd5e1; padding: 6px 6px; font-size: 11px; font-weight: 900; color: #dc2626; font-family: 'Inter', sans-serif; white-space: nowrap;">৳ ${i(r)}</td>
                <td style="border: 1px solid #cbd5e1; padding: 6px; width: 110px;"></td>
                <td style="border: 1px solid #cbd5e1; padding: 6px; width: 90px;"></td>
            </tr>
        `}),O=`
        <div style="display: flex; justify-content: flex-end; margin-top: 16px; page-break-inside: avoid; break-inside: avoid;">
            <div style="width: 280px; background: #f8fafc; border: 1px solid #cbd5e1; border-radius: 10px; padding: 12px; font-family: 'Hind Siliguri', sans-serif; box-shadow: 0 1px 3px rgba(0,0,0,0.05);">
                <div style="display: flex; justify-content: space-between; font-size: 12px; margin-bottom: 6px; border-bottom: 1px dashed #cbd5e1; padding-bottom: 4px;">
                    <span style="color: #64748b; font-weight: 700;">মোট বকেয়া কাস্টমার:</span>
                    <strong style="color: #0f172a; font-weight: 900;">${m.length} জন</strong>
                </div>
                <div style="display: flex; justify-content: space-between; font-size: 12px;">
                    <span style="color: #64748b; font-weight: 700;">মোট ফিল্ড বকেয়া:</span>
                    <strong style="color: #dc2626; font-size: 15px; font-weight: 900;">৳ ${i(_)}</strong>
                </div>
            </div>
        </div>
    `,k=await o({rowsArray:D,page1HeaderHtml:T,repeatHeaderHtml:E,tableColHeaderHtml:`
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
    `,summaryHtml:O,signatureHtml:`
        <div class="signature-last-page-block" style="margin-top: 48px; page-break-inside: avoid; break-inside: avoid; font-family: 'Anek Bangla', 'Hind Siliguri', sans-serif;">
            <div style="display: flex; justify-content: space-between; padding: 0 30px;">
                <div style="border-top: 1.2px dashed #64748b; width: 165px; text-align: center; font-size: 11px; font-weight: 700; color: #1e293b; padding-top: 6px;">
                    সংগ্রহকারীর স্বাক্ষর<br><span style="font-size: 9px; font-weight: normal; color: #64748b;">Collector Signature</span>
                </div>
                <div style="border-top: 1.2px dashed #64748b; width: 165px; text-align: center; font-size: 11px; font-weight: 700; color: #1e293b; padding-top: 6px;">
                    কর্তৃপক্ষের স্বাক্ষর<br><span style="font-size: 9px; font-weight: normal; color: #64748b;">Authorized Signature</span>
                </div>
            </div>
        </div>
    `,formattedDate:S});s(k)}export{p as printZoneTagadaReport};
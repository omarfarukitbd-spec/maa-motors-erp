const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["assets/dao-CJk3sbx1.js","assets/rolldown-runtime-Dd_uD5pT.js","assets/vendor-firebase-YQIUDKRL.js","assets/vendor-CJahiyzm.js","assets/vendor-CwbMEznW.css"])))=>i.map(i=>d[i]);
import{i as e}from"./rolldown-runtime-Dd_uD5pT.js";import{s as t}from"./dao-CJk3sbx1.js";import{a as n}from"./audit-BuamRIjn.js";import{c as r,d as i,h as a,l as o,v as s}from"./ui-helpers-OIqdNIvE.js";import{n as c}from"./vendor-ui-n4g2UPZQ.js";import{r as l,t as u}from"./index-hul1ekV8.js";var d=e(c());function f(e,t){let n=[],r=e,i=`<tr style="background:#f1f5f9; border-bottom:2px solid #cbd5e1;">
        <td colspan="2" style="font-weight:900; color:#0f172a; text-transform:uppercase; font-size:10px; padding: 8px 12px; letter-spacing: 1px;">Opening Balance</td>
        <td style="text-align:right; color:#0f172a; padding: 8px 12px;">-</td>
        <td style="text-align:right; color:#0f172a; padding: 8px 12px;">-</td>
        <td style="text-align:right; font-weight:900; color:#0f172a; padding: 8px 12px; border-left:1px solid #cbd5e1; background:#fff;">
            ৳ ${a(Math.abs(e))} ${e<0?`(Adv)`:``}
        </td>
    </tr>`;return n.push({html:i,textLength:15}),t.forEach(e=>{let t=Number(e.bill)||0,i=Number(e.paid)||0;e.receivedType,r=s(r+(t-i));let c=``;if(e.createdAt)try{let t=e.createdAt.toDate?e.createdAt.toDate():e.createdAt.toMillis?new Date(e.createdAt.toMillis()):new Date(e.createdAt);isNaN(t.getTime())||(c=t.toLocaleTimeString(`en-US`,{hour:`numeric`,minute:`2-digit`,hour12:!0}))}catch(e){console.error(`Time parsing error in statement print:`,e)}let l=`-`;if(i>0){let t=e.receivedType||`Bank`,n=(e.receivedFrom||``).trim(),r=n?`${t}: ${n}`:t;l=t===`Less`?`<strong style="color:#7c3aed; font-size:10px; background:#f5f3ff; border:1px solid #ddd6fe; padding:1px 6px; border-radius:5px; display:inline-block;">[LESS] ${n||``}</strong>`:t===`Bank`?`<strong style="color:#0284c7; font-size:10px; background:#f0f9ff; border:1px solid #bae6fd; padding:1px 6px; border-radius:5px; display:inline-block;">${r}</strong>`:`<strong style="color:#059669; font-size:10px; background:#ecfdf5; border:1px solid #a7f3d0; padding:1px 6px; border-radius:5px; display:inline-block;">${r}</strong>`}else t>0&&e.notes&&(l=`<span style="font-size:10px; color:#475569;">${e.notes}</span>`);let u=e.voucherNo&&e.voucherNo!==`OPENING`?`<span style="font-size:9.5px; color:#0284c7; font-weight:900; font-family:monospace; margin-left:4px;">#${e.voucherNo}</span>`:``,d=`<tr>
            <td style="font-size:10.5px; border-bottom:1px solid #e2e8f0; padding: 5px 8px; color:#0f172a; line-height: 1.2; vertical-align: middle;">
                <div style="font-weight: 700;">${o(e.date)}</div>
                ${c?`<div style="font-size: 8px; color: #64748b; font-weight: 500; margin-top: 1px;">${c}</div>`:``}
            </td>
            <td style="font-size:11px; border-bottom:1px solid #e2e8f0; padding: 5px 10px; color:#0f172a; vertical-align: middle;">${l}${u}</td>
            <td style="text-align:right; color:#dc2626; font-weight:700; border-bottom:1px solid #e2e8f0; padding: 5px 10px; vertical-align: middle;">${t>0?a(t):`-`}</td>
            <td style="text-align:right; color:#059669; font-weight:700; border-bottom:1px solid #e2e8f0; padding: 5px 10px; vertical-align: middle;">${i>0?a(i):`-`}</td>
            <td style="text-align:right; font-weight:900; color:#0f172a; border-bottom:1px solid #e2e8f0; padding: 5px 10px; border-left:1px solid #e2e8f0; vertical-align: middle;">
                ৳ ${a(Math.abs(r))} ${r<0?`<span style="font-size:8px; color:#059669;">(Adv)</span>`:``}
            </td>
        </tr>`;n.push({html:d,textLength:(e.receivedFrom||``).length})}),{rowsArray:n,running:r}}function p(e,t,n,i,a,o,s,c,l){let u=(e.name||``).replace(/^\[.*?\]\s*/,``).trim();return{page1HeaderHtml:r(o,{title:s,subtitle:c,dateRangeStr:l}),repeatHeaderHtml:`
        <div style="display:flex; justify-content:space-between; align-items:flex-end; border-bottom:2px solid #0284c7; padding-bottom:4px; margin-bottom:8px;">
            <div style="font-size:14px; font-weight:900; color:#0f172a; font-family:'Inter',sans-serif;">${s} <span style="font-size:10px; color:#475569; font-weight:normal;">(Continued)</span></div>
            <div style="font-size:10px; color:#475569; font-family:'Hind Siliguri',sans-serif;">${l||c}</div>
        </div>
    `,page1ExtraHtml:`
        <div style="position: relative; display: grid; grid-template-columns: 1.35fr 1fr; gap: 16px; margin-bottom: 16px; align-items: stretch; margin-top: 10px;">
            <div style="position: absolute; left: 54%; top: 50%; transform: translate(-50%, -50%) rotate(-12deg); pointer-events: none; opacity: 0.22; border: 4px double ${a<=0?`#059669`:`#dc2626`}; color: ${a<=0?`#059669`:`#dc2626`}; padding: 5px 18px; border-radius: 8px; font-weight: 900; font-size: 20px; text-transform: uppercase; letter-spacing: 1.5px; text-align: center; line-height: 1.1; z-index: 10; font-family: sans-serif; background: rgba(255,255,255,0.85); backdrop-filter: blur(2px);">
                ${a<=0?`PAID<br><span style="font-size:10px;">পরিশোধিত</span>`:`DUE<br><span style="font-size:10px;">বকেয়া হিসাব</span>`}
            </div>

            <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; border-left: 4px solid #0284c7; padding: 12px 16px; display: flex; flex-direction: column; justify-content: flex-start;">
                <div style="font-size: 10px; font-weight: 900; color: #0284c7; text-transform: uppercase; border-bottom: 1px solid #cbd5e1; padding-bottom: 4px; margin-bottom: 8px;">CUSTOMER DETAILS</div>
                <p style="font-size:15px; font-weight: 900; color:#0f172a; margin-bottom: 4px; line-height: 1.2;">${u}</p>
                <div style="display: flex; flex-wrap: wrap; gap: 14px; font-size:11px; color:#475569; margin-bottom: 6px;">
                    <span><strong style="color:#0f172a;">A/C No:</strong> ${e.accountNo||`-`}</span>
                    <span><strong style="color:#0f172a;">Mobile:</strong> ${e.phone||`-`}</span>
                </div>
                <div style="border-top: 1px dashed #cbd5e1; padding-top: 6px;">
                    <p style="font-size: 10px; color: #334155; line-height: 1.4; margin: 0; font-weight: 600;">${e.address||`-`}</p>
                </div>
            </div>

            <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; border-left: 4px solid #0369a1; padding: 12px 16px; display: flex; flex-direction: column;">
                <div style="font-size: 10px; font-weight: 900; color: #0369a1; text-transform: uppercase; border-bottom: 1px solid #cbd5e1; padding-bottom: 4px; margin-bottom: 8px;">FINANCIAL SUMMARY</div>
                <div style="flex-grow: 1; display: flex; flex-direction: column; justify-content: center; gap: 4px;">
                    <div style="border-left: 3px solid #dc2626; background: #fff; display: flex; justify-content: space-between; align-items: center; padding: 4px 10px; border-radius: 6px; border: 1px solid #f1f5f9;">
                        <span style="font-size:10px; font-weight:900; color:#64748b;">DEBIT</span>
                        <strong style="font-size:13px; color:#dc2626;">${t}</strong>
                    </div>
                    <div style="border-left: 3px solid #059669; background: #fff; display: flex; justify-content: space-between; align-items: center; padding: 4px 10px; border-radius: 6px; border: 1px solid #f1f5f9;">
                        <span style="font-size:10px; font-weight:900; color:#64748b;">CREDIT</span>
                        <strong style="font-size:13px; color:#059669;">${n}</strong>
                    </div>
                    <div style="border-left: 4px solid #1e40af; background: #eff6ff !important; display: flex; justify-content: space-between; align-items: center; padding: 4px 10px; border-radius: 6px;">
                        <span style="font-size:10px; font-weight:900; color:#1e40af;">BALANCE</span>
                        <strong style="font-size:14px; color:#1e40af;">${i}</strong>
                    </div>
                </div>
            </div>
        </div>
    `,tableColHeaderHtml:`
        <thead>
            <tr style="background:#f1f5f9; border-bottom:1.5px solid #0f172a;">
                <th style="width:12%; padding:6px 8px; text-align:left; font-size:9px; font-weight:900; text-transform:uppercase;">Date</th>
                <th style="width:40%; padding:6px 8px; text-align:left; font-size:9px; font-weight:900; text-transform:uppercase;">Description / Voucher</th>
                <th style="width:15%; padding:6px 8px; text-align:right; font-size:9px; font-weight:900; text-transform:uppercase;">Debit</th>
                <th style="width:15%; padding:6px 8px; text-align:right; font-size:9px; font-weight:900; text-transform:uppercase;">Credit</th>
                <th style="width:18%; padding:6px 8px; text-align:right; font-size:9px; font-weight:900; text-transform:uppercase; border-left:1px solid #cbd5e1;">Balance</th>
            </tr>
        </thead>
    `,signatureHtml:`
        <div class="signature-last-page-block" style="margin-top: 40px; page-break-inside: avoid; break-inside: avoid;">
            <div style="display: flex; justify-content: space-between; padding: 0 30px;">
                <div style="border-top: 1.5px dashed #64748b; padding-top: 6px; width: 150px; text-align: center; font-size: 11px; font-weight: 700; color: #334155;">গ্রাহকের স্বাক্ষর<br><span style="font-size:8px; font-weight:normal;">Customer Signature</span></div>
                <div style="border-top: 1.5px dashed #64748b; padding-top: 6px; width: 150px; text-align: center; font-size: 11px; font-weight: 700; color: #334155;">কর্তৃপক্ষের স্বাক্ষর<br><span style="font-size:8px; font-weight:normal;">Authorized Signature</span></div>
            </div>
        </div>
    `}}async function m(e,n,r,a=``){try{let s=await t.getAppSettings(),c=document.getElementById(`print-receipt-container`);c||(c=document.createElement(`div`),c.id=`print-receipt-container`,document.body.appendChild(c));let d=document.getElementById(`stmt-start-date`)?.value||``,m=document.getElementById(`stmt-end-date`)?.value||``,h=d||m?`${d?o(d):`শুরু`} হতে ${m?o(m):`আজ`}`:`সকল লেনদেন`,g=document.getElementById(`stmt-total-bill`)?.innerText||`৳ 0`,_=document.getElementById(`stmt-total-paid`)?.innerText||`৳ 0`,v=document.getElementById(`stmt-total-due`)?.innerText||`৳ 0`,{rowsArray:y,running:b}=f(n,r),{page1HeaderHtml:x,repeatHeaderHtml:S,page1ExtraHtml:C,tableColHeaderHtml:w,signatureHtml:T}=p(e,g,_,v,b,s,`CUSTOMER KHATIYAN`,`কাস্টমার বকেয়া খতিয়ান`,h),E=a&&a.trim()?`
            <div style="margin-top: 15px; padding: 10px 14px; background: #fffbe6; border: 1px solid #ffe58f; border-radius: 8px; font-size: 11px; color: #856404; font-family: sans-serif; page-break-inside: avoid; break-inside: avoid;">
                <strong style="display: block; font-weight: 900; margin-bottom: 3px; color: #533f03;">বিশেষ নোটিশ / শর্তাবলি:</strong>
                ${a.replace(/\n/g,`<br>`)}
            </div>`:``,[D,O,k]=i().split(`-`),A=await l({rowsArray:y,page1HeaderHtml:x,repeatHeaderHtml:S,tableColHeaderHtml:w,page1ExtraHtml:C,summaryHtml:E,signatureHtml:T,formattedDate:`${k}/${O}/${D}`});u(A)}catch(e){console.error(`Statement print error:`,e),d.default.fire(`Error`,`প্রিন্ট করতে সমস্যা হয়েছে`,`error`)}}var h=null;async function g(e){if(!e)return;let t=document.getElementById(`login-screen`),r=document.getElementById(`app-container`);t&&(t.style.display=`none`),r&&r.classList.add(`hidden`);let i=document.getElementById(`public-stmt-view`);i||(i=document.createElement(`div`),i.id=`public-stmt-view`,i.className=`fixed inset-0 z-[9999] overflow-y-auto bg-slate-950 p-3 sm:p-6 font-bn flex flex-col items-center justify-start`,document.body.appendChild(i)),i.innerHTML=`<div class="text-center py-20 text-white font-bold"><i class="fa-solid fa-spinner fa-spin text-2xl text-blue-500 mb-3"></i><p>মেসার্স মা মোটরস্ বিবরণী লোড হচ্ছে...</p></div>`;try{let{CustomerDAO:t,TransactionDAO:r,SettingsDAO:o}=await n(async()=>{let{CustomerDAO:e,TransactionDAO:t,SettingsDAO:n}=await import(`./dao-CJk3sbx1.js`).then(e=>e.d);return{CustomerDAO:e,TransactionDAO:t,SettingsDAO:n}},__vite__mapDeps([0,1,2,3,4])),c=await t.getById(e);if(!c)return i.innerHTML=`<div class="m3-card text-center py-12 text-red-400 font-bold max-w-md mx-auto">কাস্টমার হিসাব পাওয়া যায়নি!</div>`;let l=await o.getAppSettings(),u=(await r.getByCustomer(e)).filter(e=>{let t=String(e.voucherNo||``).trim().toUpperCase();return t!==`OPENING`&&t!==`OPEN`&&t!==`প্রারম্ভিক ব্যালেন্স`&&t!==`প্রারম্ভিক জের`});u.sort((e,t)=>{let n=new Date(e.date)-new Date(t.date);return n===0?(e.createdAt?.toMillis()||0)-(t.createdAt?.toMillis()||0):n});let d=Number(c.initialDue||0),m=0,g=0,_=0;u.forEach(e=>{e.receivedType===`Less`?_=s(_+(Number(e.paid)||0)):g=s(g+(Number(e.paid)||0)),m=s(m+(Number(e.bill)||0))});let v=s(d+m-g-_),{rowsArray:y}=f(d,u);h={customer:c,docs:u,settings:l,initialDue:d,billSum:m,paidSum:g,lessSum:_,running:v};let{page1HeaderHtml:b,page1ExtraHtml:x}=p(c,`৳ ${a(m)}`,`৳ ${a(g)}`,`৳ ${a(Math.abs(v))} ${v<0?`(Adv)`:``}`,v,l,`STATEMENT SUMMARY`,`সকল লেনদেন`,`সকল লেনদেন`);i.innerHTML=`
            <div class="w-full max-w-4xl bg-slate-900 rounded-3xl border border-slate-800 p-4 sm:p-6 shadow-2xl mb-6 font-bn">
                <div class="flex items-center justify-between gap-3 border-b border-slate-800 pb-4 mb-4">
                    <div class="flex items-center gap-2 text-white font-black text-sm sm:text-base"><i class="fa-solid fa-file-invoice text-blue-400"></i> মেসার্স মা মোটরস্ - হিসাব বিবরণী</div>
                    <button onclick="window.printPublicStatement()" class="h-9 px-4 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs flex items-center gap-1.5"><i class="fa-solid fa-print"></i><span>প্রিন্ট / PDF</span></button>
                </div>
                <div id="public-print-area" class="bg-white text-slate-900 p-4 sm:p-8 rounded-2xl">
                    ${b}
                    ${x}
                    <table style="width:100%; border-collapse:collapse; margin-bottom:12px; border: 1px solid #cbd5e1;">
                        <thead><tr style="background:#f1f5f9; border-bottom:1.5px solid #0f172a;"><th style="width:12%; padding:6px 8px; text-align:left; font-size:9px; font-weight:900;">Date</th><th style="width:40%; padding:6px 8px; text-align:left; font-size:9px; font-weight:900;">Description</th><th style="width:15%; padding:6px 8px; text-align:right; font-size:9px; font-weight:900;">Debit</th><th style="width:15%; padding:6px 8px; text-align:right; font-size:9px; font-weight:900;">Credit</th><th style="width:18%; padding:6px 8px; text-align:right; font-size:9px; font-weight:900;">Balance</th></tr></thead>
                        <tbody style="font-size: 10px;">${y.map(e=>e.html||e).join(``)}</tbody>
                    </table>
                    <div style="margin-top: 40px; display: flex; justify-content: space-between; padding: 0 30px;">
                        <div style="border-top: 1.5px dashed #64748b; padding-top: 6px; width: 150px; text-align: center; font-size: 11px; font-weight: 700; color: #334155;">গ্রাহকের স্বাক্ষর</div>
                        <div style="border-top: 1.5px dashed #64748b; padding-top: 6px; width: 150px; text-align: center; font-size: 11px; font-weight: 700; color: #334155;">কর্তৃপক্ষের স্বাক্ষর</div>
                    </div>
                </div>
            </div>`}catch(e){console.error(e),i.innerHTML=`<div class="m3-card text-center py-12 text-red-400 font-bold max-w-md mx-auto">স্টেটমেন্ট লোড করতে ব্যর্থ!</div>`}}window.printPublicStatement=async()=>{if(!h)return;let{customer:e,docs:t,settings:n,initialDue:r,billSum:o,paidSum:s,running:c}=h,d=document.getElementById(`print-receipt-container`);d||(d=document.createElement(`div`),d.id=`print-receipt-container`,document.body.appendChild(d));let{rowsArray:m}=f(r,t),{page1HeaderHtml:g,repeatHeaderHtml:_,page1ExtraHtml:v,tableColHeaderHtml:y,signatureHtml:b}=p(e,`৳ ${a(o)}`,`৳ ${a(s)}`,`৳ ${a(Math.abs(c))} ${c<0?`(Adv)`:``}`,c,n,`STATEMENT SUMMARY`,`সকল লেনদেন`,`সকল লেনদেন`),[x,S,C]=i().split(`-`),w=await l({rowsArray:m,page1HeaderHtml:g,repeatHeaderHtml:_,tableColHeaderHtml:y,page1ExtraHtml:v,summaryHtml:``,signatureHtml:b,formattedDate:`${C}/${S}/${x}`});u(w)},window.renderPublicStatementView=g;export{m as printStatement,g as renderPublicStatementView};
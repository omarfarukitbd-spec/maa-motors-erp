const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["assets/dao-BAvPFDr3.js","assets/rolldown-runtime-Dd_uD5pT.js","assets/vendor-firebase-BClu8lYp.js","assets/vendor-3SwtfBWZ.js","assets/vendor-CwbMEznW.css"])))=>i.map(i=>d[i]);
import{i as e}from"./rolldown-runtime-Dd_uD5pT.js";import{s as t}from"./dao-BAvPFDr3.js";import{a as n}from"./audit-CM_cQwMj.js";import{_ as r,b as i,c as a,f as o,g as s,l as c,m as l,p as u}from"./ui-helpers-ChDNPFdp.js";import"./customer-state-2ylgXcjb.js";import{n as d}from"./vendor-ui-n4g2UPZQ.js";import{a as f,r as p}from"./smart-print-engine-BIa7XdT8.js";var m=e(d());function h(e,t){let n=[],a=e,s=`<tr style="background:#f1f5f9; border-bottom:2px solid #cbd5e1;">
        <td colspan="2" style="font-weight:900; color:#0f172a; text-transform:uppercase; font-size:10px; padding: 8px 12px; letter-spacing: 1px;">Opening Balance</td>
        <td style="text-align:right; color:#0f172a; padding: 8px 12px;">-</td>
        <td style="text-align:right; color:#0f172a; padding: 8px 12px;">-</td>
        <td style="text-align:right; font-weight:900; color:#0f172a; padding: 8px 12px; border-left:1px solid #cbd5e1; background:#fff;">
            ৳ ${r(Math.abs(e))} ${e<0?`(Adv)`:``}
        </td>
    </tr>`;return n.push({html:s,textLength:15}),t.forEach(e=>{let t=Number(e.bill)||0,s=Number(e.paid)||0;e.receivedType,a=i(a+(t-s));let l=``;if(e.createdAt)try{let t=e.createdAt.toDate?e.createdAt.toDate():e.createdAt.toMillis?new Date(e.createdAt.toMillis()):new Date(e.createdAt);isNaN(t.getTime())||(l=t.toLocaleTimeString(`en-US`,{hour:`numeric`,minute:`2-digit`,hour12:!0}))}catch(e){console.error(`Time parsing error in statement print:`,e)}let u=`-`;if(s>0){let t=e.receivedType||`Bank`,n=(e.receivedFrom||``).trim(),r=n?`${t}: ${n}`:t;u=t===`Less`?`<strong style="color:#7c3aed; font-size:10px; background:#f5f3ff; border:1px solid #ddd6fe; padding:1px 6px; border-radius:5px; display:inline-block;">[LESS] ${n||``}</strong>`:t===`Bank`?`<strong style="color:#0284c7; font-size:10px; background:#f0f9ff; border:1px solid #bae6fd; padding:1px 6px; border-radius:5px; display:inline-block;">${r}</strong>`:`<strong style="color:#059669; font-size:10px; background:#ecfdf5; border:1px solid #a7f3d0; padding:1px 6px; border-radius:5px; display:inline-block;">${r}</strong>`,e.notes&&(u+=` <span style="font-size:9.5px; color:#475569; font-style:italic;">• ${e.notes}</span>`)}else e.notes&&(u=`<span style="font-size:10px; color:#475569;">${e.notes}</span>`);let d=e.voucherNo&&e.voucherNo!==`OPENING`?`<span style="font-size:9.5px; color:#0284c7; font-weight:900; font-family:monospace; margin-left:4px;">#${e.voucherNo}</span>`:``,f=`<tr>
            <td style="font-size:10.5px; border-bottom:1px solid #e2e8f0; padding: 5px 8px; color:#0f172a; line-height: 1.2; vertical-align: middle;">
                <div style="font-weight: 700;">${c(e.date)}</div>
                <div style="font-size: 8px; color: #64748b; font-family: 'Hind Siliguri', sans-serif; font-weight: 600; margin-top: 1px;">${o(e.date)}${l?` • ${l}`:``}</div>
            </td>
            <td style="font-size:11px; border-bottom:1px solid #e2e8f0; padding: 5px 10px; color:#0f172a; vertical-align: middle;">${u}${d}</td>
            <td style="text-align:right; color:#dc2626; font-weight:700; border-bottom:1px solid #e2e8f0; padding: 5px 10px; vertical-align: middle;">${t>0?r(t):`-`}</td>
            <td style="text-align:right; color:#059669; font-weight:700; border-bottom:1px solid #e2e8f0; padding: 5px 10px; vertical-align: middle;">${s>0?r(s):`-`}</td>
            <td style="text-align:right; font-weight:900; color:#0f172a; border-bottom:1px solid #e2e8f0; padding: 5px 10px; border-left:1px solid #e2e8f0; vertical-align: middle;">
                ৳ ${r(Math.abs(a))} ${a<0?`<span style="font-size:8px; color:#059669;">(Adv)</span>`:``}
            </td>
        </tr>`;n.push({html:f,textLength:(e.receivedFrom||``).length})}),{rowsArray:n,running:a}}function g(e,t,n,r,i,o,s,c,l){let u=(e.name||``).replace(/^\[.*?\]\s*/,``).trim();return{page1HeaderHtml:a(o,{title:s,subtitle:c,dateRangeStr:l}),repeatHeaderHtml:`
        <div style="display:flex; justify-content:space-between; align-items:flex-end; border-bottom:2px solid #0284c7; padding-bottom:4px; margin-bottom:8px;">
            <div style="font-size:14px; font-weight:900; color:#0f172a; font-family:'Inter',sans-serif;">${s} <span style="font-size:10px; color:#475569; font-weight:normal;">(Continued)</span></div>
            <div style="font-size:10px; color:#475569; font-family:'Hind Siliguri',sans-serif;">${l||c}</div>
        </div>
    `,page1ExtraHtml:`
        <div style="position: relative; display: grid; grid-template-columns: 1.35fr 1fr; gap: 16px; margin-bottom: 16px; align-items: stretch; margin-top: 10px;">
            <div style="position: absolute; left: 54%; top: 50%; transform: translate(-50%, -50%) rotate(-12deg); pointer-events: none; opacity: 0.22; border: 4px double ${i<=0?`#059669`:`#dc2626`}; color: ${i<=0?`#059669`:`#dc2626`}; padding: 5px 18px; border-radius: 8px; font-weight: 900; font-size: 20px; text-transform: uppercase; letter-spacing: 1.5px; text-align: center; line-height: 1.1; z-index: 10; font-family: sans-serif; background: rgba(255,255,255,0.85); backdrop-filter: blur(2px);">
                ${i<=0?`PAID<br><span style="font-size:10px;">পরিশোধিত</span>`:`DUE<br><span style="font-size:10px;">বকেয়া হিসাব</span>`}
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
                        <strong style="font-size:14px; color:#1e40af;">${r}</strong>
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
    `}}async function _(e,t){let n=[],i=e.map(e=>{let t=e.voucherNo?String(e.voucherNo).startsWith(`#`)?e.voucherNo:`#${e.voucherNo}`:`ভাউচার`,n=e.date?c(e.date):``,i=Number(e.bill||0),a=Number(e.paid||0);return`
            <label class="flex items-center justify-between p-2 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 cursor-pointer text-xs transition-colors">
                <div class="flex items-center gap-2.5 overflow-hidden">
                    <input type="checkbox" class="stmt-memo-cb w-4 h-4 rounded border-slate-700 bg-slate-950 text-amber-500 focus:ring-0 cursor-pointer" data-url="${s(e.memoPhotoUrl)}" data-voucher="${s(t)}" data-date="${s(e.date||``)}" data-bill="${i}" data-paid="${a}">
                    <img src="${s(e.memoPhotoUrl)}" class="w-9 h-9 object-cover rounded-lg border border-slate-700 shrink-0">
                    <div class="truncate">
                        <div class="font-mono font-black text-amber-300 text-xs">${s(t)}</div>
                        <div class="text-[10px] text-slate-400 font-medium">${n}</div>
                    </div>
                </div>
                <div class="text-right shrink-0">
                    ${i>0?`<div class="text-red-400 font-bold font-mono text-xs">৳ ${r(i)}</div>`:``}
                    ${a>0?`<div class="text-emerald-400 font-bold font-mono text-xs">৳ ${r(a)}</div>`:``}
                </div>
            </label>
        `}).join(``),a=await m.default.fire({title:`<div class="flex items-center gap-2 font-bn font-black text-lg text-white"><i class="fa-solid fa-file-invoice text-amber-400"></i><span>স্ক্যান মেমো প্রিন্ট সংযুক্তি</span></div>`,html:`
            <div class="text-left font-bn space-y-2 p-1 text-slate-300">
                <p class="text-xs text-slate-300 leading-relaxed">
                    এই গ্রাহকের স্টেটমেন্টের সাথে মোট <strong class="text-amber-400">${e.length}টি</strong> স্ক্যান মেমোর ছবি রয়েছে। কোন কোন মেমো স্টেটমেন্টের সাথে প্রিন্ট/PDF-এ যুক্ত করতে চান?
                </p>
                <div class="flex items-center justify-between pt-1 pb-1 border-b border-slate-800">
                    <label class="flex items-center gap-1.5 text-xs font-bold text-cyan-400 cursor-pointer">
                        <input type="checkbox" id="stmt-memo-toggle-all" class="w-4 h-4 rounded border-slate-700 bg-slate-950 text-cyan-500 focus:ring-0 cursor-pointer">
                        <span>সকল মেমো সিলেক্ট করুন</span>
                    </label>
                    <span id="stmt-memo-count-disp" class="text-[11px] text-slate-400 font-mono">০টি সিলেক্টেড</span>
                </div>
                <div class="max-h-60 overflow-y-auto custom-scrollbar space-y-1.5 pt-1 pr-1">
                    ${i}
                </div>
            </div>
        `,showCancelButton:!0,showDenyButton:!0,confirmButtonText:`<i class="fa-solid fa-print mr-1.5"></i>মেমো সহ প্রিন্ট`,denyButtonText:`শুধু স্টেটমেন্ট প্রিন্ট`,cancelButtonText:`বাতিল`,confirmButtonColor:`#059669`,denyButtonColor:`#2563eb`,cancelButtonColor:`#64748b`,customClass:{popup:`!bg-slate-950 !rounded-3xl border border-slate-800 shadow-2xl font-bn`,confirmButton:`m3-btn-primary font-bold !px-5 !py-2.5 !rounded-xl text-xs`,denyButton:`m3-btn-primary !bg-blue-600 hover:!bg-blue-500 font-bold !px-5 !py-2.5 !rounded-xl text-xs`,cancelButton:`m3-btn-tonal font-bold !px-4 !py-2.5 !rounded-xl text-xs`},didOpen:e=>{let t=e.querySelector(`#stmt-memo-toggle-all`),n=e.querySelectorAll(`.stmt-memo-cb`),r=e.querySelector(`#stmt-memo-count-disp`),i=()=>{let i=e.querySelectorAll(`.stmt-memo-cb:checked`).length;r&&(r.innerText=`${i}টি সিলেক্টেড`),t&&(t.checked=i===n.length&&n.length>0)};t&&(t.onchange=()=>{n.forEach(e=>{e.checked=t.checked}),i()}),n.forEach(e=>{e.onchange=i})}});if(a.isDismissed)return null;if(a.isDenied)return[];let o=m.default.getPopup();return o&&o.querySelectorAll(`.stmt-memo-cb:checked`).forEach(e=>{n.push({url:e.dataset.url,voucherNo:e.dataset.voucher,date:e.dataset.date,bill:e.dataset.bill,paid:e.dataset.paid})}),n}async function v(e,n,a,o=``){try{let s=await t.getAppSettings(),l=document.getElementById(`print-receipt-container`);l||(l=document.createElement(`div`),l.id=`print-receipt-container`,document.body.appendChild(l));let d=(a||[]).filter(e=>e.memoPhotoUrl&&String(e.memoPhotoUrl).trim()!==``),m=[];if(d.length>0){let t=await _(d,e?.name||``);if(t===null)return;m=t}let v=document.getElementById(`stmt-start-date`)?.value||``,y=document.getElementById(`stmt-end-date`)?.value||``,b=v||y?`${v?c(v):`শুরু`} হতে ${y?c(y):`আজ`}`:`সকল লেনদেন`,x=0,S=0;(a||[]).forEach(e=>{x=i(x+(Number(e.bill)||0)),S=i(S+(Number(e.paid)||0))});let{rowsArray:C,running:w}=h(n,a),{page1HeaderHtml:T,repeatHeaderHtml:E,page1ExtraHtml:D,tableColHeaderHtml:O,signatureHtml:k}=g(e,`৳ ${r(x)}`,`৳ ${r(S)}`,`৳ ${r(Math.abs(w))} ${w<0?`(Adv)`:``}`,w,s,`CUSTOMER KHATIYAN`,`কাস্টমার বকেয়া খতিয়ান`,b),A=o&&o.trim()?`
            <div style="margin-top: 15px; padding: 10px 14px; background: #fffbe6; border: 1px solid #ffe58f; border-radius: 8px; font-size: 11px; color: #856404; font-family: sans-serif; page-break-inside: avoid; break-inside: avoid;">
                <strong style="display: block; font-weight: 900; margin-bottom: 3px; color: #533f03;">বিশেষ নোটিশ / শর্তাবলি:</strong>
                ${o.replace(/\n/g,`<br>`)}
            </div>`:``,[j,M,N]=u().split(`-`),P=await f({rowsArray:C,page1HeaderHtml:T,repeatHeaderHtml:E,tableColHeaderHtml:O,page1ExtraHtml:D,summaryHtml:A,signatureHtml:k,formattedDate:`${N}/${M}/${j}`}),F=``;m.length>0&&m.forEach((t,n)=>{let i=t.voucherNo||`মেমো`,a=t.date?c(t.date):``;F+=`
                    <div class="print-page memo-print-page" style="page-break-before: always; break-before: page; min-height: 1123px; width: 794px; padding: 24px 32px; box-sizing: border-box; background: #fff; display: flex; flex-direction: column; justify-content: flex-start; align-items: center; margin: 0 auto;">
                        <div style="width: 100%; border-bottom: 2px solid #0284c7; padding-bottom: 8px; margin-bottom: 16px; display: flex; justify-content: space-between; align-items: flex-end;">
                            <div>
                                <div style="font-size: 15px; font-weight: 900; color: #0f172a; font-family: 'Inter', 'Kalpurush', sans-serif;">মেসার্স মা মোটরস্ - সংযুক্ত স্ক্যান মেমো (${n+1}/${m.length})</div>
                                <div style="font-size: 11px; color: #475569; font-family: 'Hind Siliguri', sans-serif; font-weight: 600;">ভাউচার: <strong style="color: #0284c7; font-family: monospace;">${i}</strong> | গ্রাহক: <strong>${(e?.name||``).replace(/^\[.*?\]\s*/,``)}</strong></div>
                            </div>
                            <div style="font-size: 11px; color: #64748b; font-family: 'Hind Siliguri', sans-serif; font-weight: 600; text-align: right;">
                                ${a?`তারিখ: ${a}`:``}
                                ${Number(t.bill||0)>0?` | বিল: ৳ ${r(t.bill)}`:``}
                            </div>
                        </div>
                        <div style="width: 100%; flex-grow: 1; display: flex; align-items: center; justify-content: center; max-height: 980px;">
                            <img src="${t.url}" style="max-width: 100%; max-height: 960px; object-fit: contain; border: 1px solid #cbd5e1; border-radius: 6px; box-shadow: 0 4px 12px rgba(0,0,0,0.08);" alt="Scanned Memo ${i}">
                        </div>
                    </div>
                `}),p(P+F)}catch(e){console.error(`Statement print error:`,e),m.default.fire(`Error`,`প্রিন্ট করতে সমস্যা হয়েছে`,`error`)}}var y=null;async function b(e){if(!e)return;let t=document.getElementById(`login-screen`),a=document.getElementById(`app-container`);t&&(t.style.display=`none`),a&&a.classList.add(`hidden`);let o=document.getElementById(`public-stmt-view`);o||(o=document.createElement(`div`),o.id=`public-stmt-view`,o.className=`fixed inset-0 z-[9999] overflow-y-auto bg-slate-950 p-3 sm:p-6 font-bn flex flex-col items-center justify-start`,document.body.appendChild(o)),o.innerHTML=`<div class="text-center py-20 text-white font-bold"><i class="fa-solid fa-spinner fa-spin text-2xl text-blue-500 mb-3"></i><p>মেসার্স মা মোটরস্ বিবরণী লোড হচ্ছে...</p></div>`;try{let{CustomerDAO:t,TransactionDAO:a,SettingsDAO:s}=await n(async()=>{let{CustomerDAO:e,TransactionDAO:t,SettingsDAO:n}=await import(`./dao-BAvPFDr3.js`).then(e=>e.d);return{CustomerDAO:e,TransactionDAO:t,SettingsDAO:n}},__vite__mapDeps([0,1,2,3,4])),c=await t.getById(e);if(!c)return o.innerHTML=`<div class="m3-card text-center py-12 text-red-400 font-bold max-w-md mx-auto">কাস্টমার হিসাব পাওয়া যায়নি!</div>`;let u=await s.getAppSettings(),d=(await a.getByCustomer(e)).filter(e=>{let t=String(e.voucherNo||``).trim().toUpperCase();return t!==`OPENING`&&t!==`OPEN`&&t!==`প্রারম্ভিক ব্যালেন্স`&&t!==`প্রারম্ভিক জের`});d.sort((e,t)=>{let n=l(e.date),r=l(t.date);return n===r?(e.createdAt?.toMillis?.()||e.createdAt?.toDate?.()?.getTime?.()||new Date(e.createdAt||0).getTime()||0)-(t.createdAt?.toMillis?.()||t.createdAt?.toDate?.()?.getTime?.()||new Date(t.createdAt||0).getTime()||0):n.localeCompare(r)});let f=Number(c.initialDue||0),p=0,m=0,_=0;d.forEach(e=>{e.receivedType===`Less`?_=i(_+(Number(e.paid)||0)):m=i(m+(Number(e.paid)||0)),p=i(p+(Number(e.bill)||0))});let v=i(f+p-m-_),{rowsArray:b}=h(f,d);y={customer:c,docs:d,settings:u,initialDue:f,billSum:p,paidSum:m,lessSum:_,running:v};let{page1HeaderHtml:x,page1ExtraHtml:S}=g(c,`৳ ${r(p)}`,`৳ ${r(m)}`,`৳ ${r(Math.abs(v))} ${v<0?`(Adv)`:``}`,v,u,`STATEMENT SUMMARY`,`সকল লেনদেন`,`সকল লেনদেন`);o.innerHTML=`
            <div class="w-full max-w-4xl bg-slate-900 rounded-3xl border border-slate-800 p-4 sm:p-6 shadow-2xl mb-6 font-bn">
                <div class="flex items-center justify-between gap-3 border-b border-slate-800 pb-4 mb-4">
                    <div class="flex items-center gap-2 text-white font-black text-sm sm:text-base"><i class="fa-solid fa-file-invoice text-blue-400"></i> মেসার্স মা মোটরস্ - হিসাব বিবরণী</div>
                    <button onclick="window.printPublicStatement()" class="h-9 px-4 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs flex items-center gap-1.5"><i class="fa-solid fa-print"></i><span>প্রিন্ট / PDF</span></button>
                </div>
                <div id="public-print-area" class="bg-white text-slate-900 p-4 sm:p-8 rounded-2xl">
                    ${x}
                    ${S}
                    <table style="width:100%; border-collapse:collapse; margin-bottom:12px; border: 1px solid #cbd5e1;">
                        <thead><tr style="background:#f1f5f9; border-bottom:1.5px solid #0f172a;"><th style="width:12%; padding:6px 8px; text-align:left; font-size:9px; font-weight:900;">Date</th><th style="width:40%; padding:6px 8px; text-align:left; font-size:9px; font-weight:900;">Description</th><th style="width:15%; padding:6px 8px; text-align:right; font-size:9px; font-weight:900;">Debit</th><th style="width:15%; padding:6px 8px; text-align:right; font-size:9px; font-weight:900;">Credit</th><th style="width:18%; padding:6px 8px; text-align:right; font-size:9px; font-weight:900;">Balance</th></tr></thead>
                        <tbody style="font-size: 10px;">${b.map(e=>e.html||e).join(``)}</tbody>
                    </table>
                    <div style="margin-top: 40px; display: flex; justify-content: space-between; padding: 0 30px;">
                        <div style="border-top: 1.5px dashed #64748b; padding-top: 6px; width: 150px; text-align: center; font-size: 11px; font-weight: 700; color: #334155;">গ্রাহকের স্বাক্ষর</div>
                        <div style="border-top: 1.5px dashed #64748b; padding-top: 6px; width: 150px; text-align: center; font-size: 11px; font-weight: 700; color: #334155;">কর্তৃপক্ষের স্বাক্ষর</div>
                    </div>
                </div>
            </div>`}catch(e){console.error(e),o.innerHTML=`<div class="m3-card text-center py-12 text-red-400 font-bold max-w-md mx-auto">স্টেটমেন্ট লোড করতে ব্যর্থ!</div>`}}window.printPublicStatement=async()=>{if(!y)return;let{customer:e,docs:t,settings:n,initialDue:i,billSum:a,paidSum:o,running:s}=y,c=document.getElementById(`print-receipt-container`);c||(c=document.createElement(`div`),c.id=`print-receipt-container`,document.body.appendChild(c));let{rowsArray:l}=h(i,t),{page1HeaderHtml:d,repeatHeaderHtml:m,page1ExtraHtml:_,tableColHeaderHtml:v,signatureHtml:b}=g(e,`৳ ${r(a)}`,`৳ ${r(o)}`,`৳ ${r(Math.abs(s))} ${s<0?`(Adv)`:``}`,s,n,`STATEMENT SUMMARY`,`সকল লেনদেন`,`সকল লেনদেন`),[x,S,C]=u().split(`-`),w=await f({rowsArray:l,page1HeaderHtml:d,repeatHeaderHtml:m,tableColHeaderHtml:v,page1ExtraHtml:_,summaryHtml:``,signatureHtml:b,formattedDate:`${C}/${S}/${x}`});p(w)},window.renderPublicStatementView=b;export{v as printStatement,b as renderPublicStatementView};
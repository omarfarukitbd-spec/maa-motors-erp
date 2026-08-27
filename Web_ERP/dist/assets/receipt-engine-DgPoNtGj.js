import{i as e}from"./rolldown-runtime-Dd_uD5pT.js";import{a as t,c as n,s as r}from"./dao-t3V9h23g.js";import{c as i,h as a,l as o,m as s,o as c,v as l}from"./ui-helpers-OIqdNIvE.js";import{n as u}from"./vendor-ui-n4g2UPZQ.js";var d=e(u());async function f(e){if(!e)return;let t=document.getElementById(`login-screen`),i=document.getElementById(`app-container`);t&&(t.style.display=`none`),i&&i.classList.add(`hidden`);let a=document.getElementById(`public-memo-view`);a||(a=document.createElement(`div`),a.id=`public-memo-view`,a.className=`fixed inset-0 z-[9999] overflow-y-auto bg-slate-950 p-3 sm:p-6 font-bn flex flex-col items-center justify-start`,document.body.appendChild(a)),a.innerHTML=`<div class="text-center py-20 text-white font-bold"><i class="fa-solid fa-spinner fa-spin text-2xl text-blue-500 mb-3"></i><p>মেমো ভাউচার লোড হচ্ছে...</p></div>`;try{let t=await n.getById(e);if(!t){a.innerHTML=`<div class="m3-card text-center py-12 text-red-400 font-bold max-w-md mx-auto">মেমো ভাউচার ডাটা পাওয়া যায়নি!</div>`;return}let i=await r.getAppSettings(),o=i.shopName||`M/S. Maa Motors`,s=i.shopPhone||`01819-397669, 01815-707934`,c=i.shopAddress||`Shop No. 22, Rahman Tower, 1st Rail Gate, Muradpur, Hathazari Road`;a.innerHTML=`
            <div class="w-full max-w-2xl bg-slate-900 rounded-3xl border border-slate-800 p-4 sm:p-6 shadow-2xl mb-6 font-bn">
                <div class="flex items-center justify-between gap-3 border-b border-slate-800 pb-4 mb-4">
                    <div class="flex items-center gap-2 text-white font-black text-sm sm:text-base"><i class="fa-solid fa-file-invoice text-blue-400"></i> ${o} - ডিজিটাল মেমো</div>
                    <button onclick="window.printReceiptEngine('${e}', 'a4')" class="h-9 px-4 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs flex items-center gap-1.5 cursor-pointer"><i class="fa-solid fa-print"></i><span>প্রিন্ট / PDF</span></button>
                </div>
                <div class="bg-white text-slate-900 p-6 rounded-2xl border border-slate-200">
                    <div class="text-center border-b pb-4 mb-4">
                        <h1 class="text-2xl font-black uppercase text-slate-900 mb-1">${o}</h1>
                        <p class="text-xs text-slate-600 font-bold mb-1">${c}</p>
                        <p class="text-xs text-slate-700 font-bold">মোবাইল: ${s}</p>
                    </div>
                    <div class="flex justify-between items-center text-xs font-bold mb-4 bg-slate-100 p-3 rounded-xl border border-slate-200">
                        <div>
                            <p class="text-slate-500">কাস্টমারের নাম:</p>
                            <p class="text-sm font-black text-slate-900">${t.customerName||`Customer`}</p>
                        </div>
                        <div class="text-right">
                            <p class="text-slate-500">মেমো / ভাউচার নং:</p>
                            <p class="text-sm font-black text-blue-600">#${t.voucherNo||e.slice(-6).toUpperCase()}</p>
                            <p class="text-[10px] text-slate-400">${t.date||``}</p>
                        </div>
                    </div>

                    ${t.hasItems&&t.items&&t.items.length>0?`
                        <table class="w-full text-xs text-left border-collapse border border-slate-300 mb-4">
                            <thead>
                                <tr class="bg-slate-200 text-slate-900 font-black">
                                    <th class="p-2 border border-slate-300">ক্রমিক</th>
                                    <th class="p-2 border border-slate-300">বিবরণ / আইটেম</th>
                                    <th class="p-2 border border-slate-300 text-center">পরিমাণ</th>
                                    <th class="p-2 border border-slate-300 text-right">দর</th>
                                    <th class="p-2 border border-slate-300 text-right">মোট</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${t.items.map((e,t)=>`
                                    <tr class="border-b border-slate-200">
                                        <td class="p-2 border border-slate-300 text-center font-bold">${t+1}</td>
                                        <td class="p-2 border border-slate-300 font-black text-slate-800">${e.desc||`-`}</td>
                                        <td class="p-2 border border-slate-300 text-center font-bold">${e.qty||1} ${e.unit||``}</td>
                                        <td class="p-2 border border-slate-300 text-right font-bold">৳ ${(Number(e.rate)||0).toLocaleString(`en-BD`)}</td>
                                        <td class="p-2 border border-slate-300 text-right font-black">৳ ${(Number(e.total)||0).toLocaleString(`en-BD`)}</td>
                                    </tr>
                                `).join(``)}
                            </tbody>
                        </table>
                    `:``}

                    <div class="space-y-1.5 text-xs font-bold max-w-xs ml-auto border-t pt-3">
                        <div class="flex justify-between"><span>বিল (Bill):</span><span class="font-black">৳ ${(Number(t.bill)||0).toLocaleString(`en-BD`)}</span></div>
                        <div class="flex justify-between text-emerald-600"><span>জমা (Paid):</span><span class="font-black">- ৳ ${(Number(t.paid)||0).toLocaleString(`en-BD`)}</span></div>
                        <div class="flex justify-between text-base font-black text-slate-900 border-t pt-2 mt-2">
                            <span>বর্তমান অবস্থা:</span>
                            <span class="${(Number(t.currentDue)||0)>0?`text-red-600`:`text-emerald-600`}">৳ ${Math.abs(Number(t.currentDue)||0).toLocaleString(`en-BD`)} ${(Number(t.currentDue)||0)<0?`(Adv)`:``}</span>
                        </div>
                    </div>
                </div>
            </div>
        `}catch(e){console.error(`Public Memo View Error:`,e),a.innerHTML=`<div class="m3-card text-center py-12 text-red-400 font-bold max-w-md mx-auto">মেমো লোড করতে সমস্যা হয়েছে</div>`}}function p(e){if(!e)return;e.classList.remove(`hidden`);let t=!1,n=()=>{t||(t=!0,e.classList.add(`hidden`),window.removeEventListener(`afterprint`,n))};window.addEventListener(`afterprint`,n),setTimeout(()=>{window.print(),setTimeout(n,12e3)},150)}function m(e={},t={}){return i(t,e)}async function h(e,i=`a4`){try{c(`রিসিট লেআউট তৈরি হচ্ছে (${i.toUpperCase()})...`,`info`,`প্রিন্ট Engine`);let u=await n.getById(e);if(!u)throw c(`লেনদেন ডাটা পাওয়া যায়নি!`,`error`,`প্রিন্ট Error`),Error(`Transaction record not found in database`);let d=u.customerId,f=await t.getById(d)||{},h=(await n.getByCustomer(d)).filter(e=>{let t=String(e.voucherNo||``).trim().toUpperCase();return t!==`OPENING`&&t!==`OPEN`&&t!==`প্রারম্ভিক ব্যালেন্স`&&t!==`প্রারম্ভিক জের`}),g=e=>e?.createdAt?typeof e.createdAt.toMillis==`function`?e.createdAt.toMillis():typeof e.createdAt.toDate==`function`?e.createdAt.toDate().getTime():new Date(e.createdAt).getTime()||0:0;h.sort((e,t)=>{let n=new Date(e.date)-new Date(t.date);return n===0?g(e)-g(t):n});let _=Number(f.initialDue||0);for(let t of h){if(t.id===e)break;_=l(_+(Number(t.bill)||0)-(Number(t.paid)||0))}let v=l(_),y=l(v+(Number(u.bill)||0)-(Number(u.paid)||0)),b=await r.getAppSettings(),x=s(b.shopName||`M/S. Maa Motors`),S=s(b.shopAddress||`Shop No. 22, Rahman Tower, 1st Rail Gate, Muradpur, Hathazari Road`),C=s(b.shopPhone||`01819-397669, 01815-707934`),w=document.getElementById(`print-receipt-container`);w||(w=document.createElement(`div`),w.id=`print-receipt-container`,w.classList.add(`hidden`),document.body.appendChild(w));let T=``;if(u.hasItems&&u.items&&u.items.length>0)T=`
                <table class="print-items-table">
                    <thead>
                        <tr>
                            <th style="width:8%">SL.</th>
                            <th style="width:42%; text-align:left;">বিবরণ / আইটেমের নাম</th>
                            <th style="width:15%">পরিমাণ</th>
                            <th style="width:15%">দর</th>
                            <th style="width:20%">মোট</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${u.items.map((e,t)=>`
                            <tr>
                                <td style="text-align:center;">${String(t+1).padStart(2,`0`)}</td>
                                <td class="text-left" style="font-weight:700;">${s(e.desc||`-`)}</td>
                                <td class="text-right">${e.qty||0}</td>
                                <td class="text-right">৳${a(e.rate||0)}</td>
                                <td class="text-right" style="font-weight:800;">৳${a(e.total||0)}</td>
                            </tr>
                        `).join(``)}
                    </tbody>
                </table>
            `;else{let e=u.bill>0?u.paid>0?`Transaction Entry / Payment`:`Opening Balance / Bill Entry`:`Cash Received / Payment`,t=u.bill>0?u.bill:u.paid;T=`
                <table class="print-items-table">
                    <thead>
                        <tr>
                            <th style="width:10%">SL.</th>
                            <th style="width:60%; text-align:left;">Description / বিবরণ</th>
                            <th style="width:30%; text-align:right;">Amount / পরিমাণ</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td style="text-align:center;">01</td>
                            <td class="text-left" style="font-weight:700; color:#0f172a;">${e}</td>
                            <td class="text-right" style="font-weight:900; color:#0f172a;">৳${a(t)}</td>
                        </tr>
                    </tbody>
                </table>
            `}let E=String(u.customerName||f.name||``).replace(/^\[.*?\]\s*/,``).trim(),D=``;if(u.paid>0&&u.receivedType&&(D=` <span style="font-size: 9px; opacity: 0.8;">(${s(u.receivedType)}${u.receivedFrom?` - `+s(u.receivedFrom):``})</span>`),i===`a4`){let t=m({title:`INVOICE`,dateRangeStr:`ভাউচার #: #${s(u.voucherNo||e.slice(-6).toUpperCase())} • তারিখ: ${o(u.date)}`},b);w.className=`print-a4`,w.innerHTML=`
                <style>
                    .print-items-table { width: 100%; border-collapse: collapse; margin: 15px 0; font-size: 12px; }
                    .print-items-table th { background: #f1f5f9 !important; border: 1px solid #cbd5e1; padding: 8px 10px; text-align: center; font-weight: 900; color: #0f172a; }
                    .print-items-table td { border: 1px solid #e2e8f0; padding: 7px 10px; color: #334155; }
                    .print-items-table .text-left { text-align: left; }
                    .print-items-table .text-right { text-align: right; }
                </style>
                <div class="a4-wrapper font-bn" style="width: 100%; max-width: 210mm; margin: 0 auto; padding: 10mm 12mm; box-sizing: border-box; background: #ffffff; color: #0f172a;">
                    ${t}

                    <!-- Customer Details Box (Full Width) -->
                    <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; border-left: 4px solid #0284c7; padding: 12px 16px; margin-bottom: 18px;">
                        <div style="font-size: 10px; font-weight: 900; color: #0284c7; text-transform: uppercase; border-bottom: 1px solid #cbd5e1; padding-bottom: 4px; margin-bottom: 8px; letter-spacing: 0.5px;">CUSTOMER DETAILS</div>
                        <p style="font-size:15px; font-weight: 900; color:#0f172a; margin-bottom: 4px; line-height: 1.2;">${s(E)}</p>
                        <div style="display: flex; flex-wrap: wrap; gap: 12px; font-size:11px; color:#475569; margin-bottom: 6px;">
                            <span><strong style="color:#0f172a;">A/C No:</strong> ${s(f.accountNo||`-`)}</span>
                            <span><strong style="color:#0f172a;">Mobile:</strong> ${s(f.phone||`-`)}</span>
                        </div>
                        <div style="border-top: 1px dashed #cbd5e1; padding-top: 6px; margin-top: 4px;">
                            <p style="font-size: 11px; color: #334155; line-height: 1.4; margin: 0; font-weight: 600;"><strong>Address:</strong> ${s(f.address||`-`)}</p>
                        </div>
                    </div>

                    ${T?`<div style="margin-bottom:18px;">${T}</div>`:``}

                    <div style="display: grid; grid-template-columns: 1.2fr 1fr; gap: 24px; margin-top: 15px; page-break-inside: avoid;">
                        <div style="background: #fffbe6; border: 1px solid #ffe58f; border-radius: 10px; padding: 10px 14px;">
                            <strong style="color:#856404; font-weight:900; font-size:11px; border-bottom:1px solid #fadb14; display:block; padding-bottom:3px; margin-bottom:5px;">নোট / শর্তাবলী:</strong>
                            <p style="font-size:10.5px; line-height:1.5; color:#533f03; margin:0;">${u.notes?s(u.notes).replace(/\n/g,`<br/>`):`পণ্য বিক্রয়ের সময় রিসিট দেখে বুঝে নিন। ধন্যবাদ!`}</p>
                        </div>
                        <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 10px; padding: 10px 14px; position: relative;">
                            
                            <!-- Watermark Stamp (Moved to Payment Equation) -->
                            <div style="position: absolute; left: 50%; top: 50%; transform: translate(-50%, -50%) rotate(-12deg); pointer-events: none; opacity: 0.12; border: 4px double ${y<=0?`#059669`:`#dc2626`}; color: ${y<=0?`#059669`:`#dc2626`}; padding: 6px 14px; border-radius: 8px; font-weight: 900; font-size: 26px; text-transform: uppercase; letter-spacing: 2px; text-align: center; line-height: 1.1; z-index: 10; font-family: sans-serif;">
                                ${y<=0?`PAID`:`DUE`}
                            </div>

                            <div style="font-size: 10px; font-weight: 900; color: #0f172a; border-bottom: 1px solid #cbd5e1; padding-bottom: 4px; margin-bottom: 6px; text-transform: uppercase;">হিসাবের বিবরণী (Payment Equation)</div>
                            ${u.subtotal&&u.discount>0?`<div style="display:flex; justify-content:space-between; margin-bottom:3px; font-size:11px; color:#475569; position: relative; z-index: 20;"><span>Subtotal:</span><strong>৳ ${a(u.subtotal)}</strong></div>`:``}
                            ${u.discount>0?`<div style="display:flex; justify-content:space-between; margin-bottom:3px; font-size:11px; color:#d97706; position: relative; z-index: 20;"><span>Discount (-):</span><strong>- ৳ ${a(u.discount)}</strong></div>`:``}
                            <div style="display:flex; justify-content:space-between; margin-bottom:3px; font-size:11px; color:#0f172a; font-weight:700; position: relative; z-index: 20;"><span>আজকের বিল:</span><strong>৳ ${a(u.bill)}</strong></div>
                            <div style="display:flex; justify-content:space-between; margin-bottom:3px; font-size:11px; color:#475569; position: relative; z-index: 20;"><span>পূর্বের বকেয়া:</span><strong>৳ ${a(v)}</strong></div>
                            <div style="display:flex; justify-content:space-between; margin-bottom:3px; font-size:11px; color:#059669; font-weight:700; position: relative; z-index: 20;"><span>আজকের জমা${D}:</span><strong>- ৳ ${a(u.paid)}</strong></div>
                            <div style="display:flex; justify-content:space-between; padding:5px 8px; border-top:2px solid #cbd5e1; font-size:12.5px; font-weight:900; color:${y>0?`#dc2626`:`#059669`}; background: ${y>0?`#fef2f2`:`#ecfdf5`}; border-radius: 6px; margin-top: 4px; border-left: 4px solid ${y>0?`#dc2626`:`#059669`}; position: relative; z-index: 20;"><span>মোট বকেয়া:</span><strong>৳ ${a(Math.abs(y))} ${y<0?`(Adv)`:``}</strong></div>
                        </div>
                    </div>

                    <div style="display: flex; justify-content: space-between; margin-top: 40px; padding: 0 20px; page-break-inside: avoid;">
                        <div style="border-top: 1.5px dashed #64748b; padding-top: 5px; width: 140px; text-align: center; font-size: 11px; font-weight: 700; color: #334155;">গ্রাহকের স্বাক্ষর</div>
                        <div style="border-top: 1.5px dashed #64748b; padding-top: 5px; width: 140px; text-align: center; font-size: 11px; font-weight: 700; color: #334155;">কর্তৃপক্ষের স্বাক্ষর</div>
                    </div>
                </div>
            `}else{let t=s(b.shopOwner||`Mohammed Amran`);w.className=`print-pos`,w.innerHTML=`
                <div class="pos-wrapper font-bn text-center" style="width: 80mm; padding: 10px; box-sizing: border-box; background: white; color: black; font-family: 'Inter', 'Kalpurush', 'Hind Siliguri', sans-serif;">
                    <h2 style="font-size: 16px; font-weight: 900; margin: 0 0 2px 0; text-transform: uppercase;">${x}</h2>
                    <p style="font-size: 10px; margin: 1px 0 4px 0; font-weight: 700; font-family: 'Inter', sans-serif;">Proprietor: ${t}</p>
                    <p style="font-size: 10px; margin: 0 0 6px 0; opacity: 0.85;">${S}<br>মোবাইল: ${C}</p>
                    <div style="border-bottom: 1.5px dashed #000; margin: 6px 0;"></div>
                    <div style="display: flex; justify-content: space-between; font-size: 10px; font-weight: 700; font-family: monospace;">
                        <span>#${s(u.voucherNo||e.slice(-6).toUpperCase())}</span>
                        <span>${o(u.date)}</span>
                    </div>
                    <div style="text-align: left; margin: 6px 0 4px 0;">
                        <div style="font-weight: 900; font-size: 12px; line-height: 1.2;">কাস্টমার: ${s(E)}</div>
                        ${f.accountNo||f.phone?`
                        <div style="display: flex; justify-content: space-between; font-size: 10px; font-weight: 700; color: #334155; margin-top: 2px;">
                            ${f.accountNo?`<span><strong>A/C:</strong> ${s(f.accountNo)}</span>`:`<span></span>`}
                            ${f.phone?`<span><strong>মোবাইল:</strong> ${s(f.phone)}</span>`:`<span></span>`}
                        </div>`:``}
                    </div>
                    <div style="border-bottom: 1px dashed #000; margin: 6px 0;"></div>
                    <div style="display: flex; justify-content: space-between; font-size: 11px; margin: 3px 0;"><span>পূর্বের বকেয়া:</span><span>৳ ${a(v)}</span></div>
                    <div style="display: flex; justify-content: space-between; font-size: 11px; margin: 3px 0;"><span>আজকের বিল:</span><span>৳ ${a(u.bill)}</span></div>
                    <div style="display: flex; justify-content: space-between; font-size: 11px; margin: 3px 0; font-weight: 700;"><span>আজকের জমা${D}:</span><span>- ৳ ${a(u.paid)}</span></div>
                    <div style="border-bottom: 1.5px solid #000; margin: 6px 0;"></div>
                    <div style="display: flex; justify-content: space-between; font-size: 13px; font-weight: 900;">
                        <span>মোট বকেয়া:</span>
                        <span>৳ ${a(Math.abs(y))} ${y<0?`(Adv)`:``}</span>
                    </div>
                    <div style="border-bottom: 1px dashed #000; margin: 8px 0;"></div>
                    <div style="font-size: 10px; font-weight: 700; margin-top: 6px;">পণ্য বিক্রয়ের সময় দেখে বুঝে নিন। ধন্যবাদ!</div>
                </div>
            `}p(w),c(`প্রিন্ট পপ-আপ কমান্ড তৈরি সফল (${i.toUpperCase()})!`,`success`,`প্রিন্ট Engine`)}catch(e){console.error(`Print Engine Error:`,e),c(`প্রিন্ট ব্যর্থ: ${e.message||`অজানা এরর`}`,`error`,`প্রিন্ট Error`),d.default.fire(`প্রিন্ট এরর`,e.message||`প্রিন্ট করতে সমস্যা হয়েছে`,`error`)}}typeof window<`u`&&(window.printReceiptEngine=h);export{h as printReceiptEngine,m as renderPrintHeader,f as renderPublicMemoView,p as triggerUniversalPrint};
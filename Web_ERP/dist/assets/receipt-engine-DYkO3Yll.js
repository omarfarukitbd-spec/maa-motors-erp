import{i as e}from"./rolldown-runtime-Dd_uD5pT.js";import{a as t,i as n,n as r}from"./dao-CJcWJLH8.js";import{d as i,i as a,o,p as s,s as c,u as l}from"./ui-helpers-BkH1xB3j.js";import{n as u}from"./vendor-ui-n4g2UPZQ.js";var d=e(u());function f(e){if(!e)return;e.classList.remove(`hidden`);let t=!1,n=()=>{t||(t=!0,e.classList.add(`hidden`),window.removeEventListener(`afterprint`,n))};window.addEventListener(`afterprint`,n),setTimeout(()=>{window.print(),setTimeout(n,12e3)},150)}function p(e={},t={}){return o(t,e)}async function m(e,o=`a4`){try{a(`রিসিট লেআউট তৈরি হচ্ছে (${o.toUpperCase()})...`,`info`,`প্রিন্ট Engine`);let u=await t.getById(e);if(!u)throw a(`লেনদেন ডাটা পাওয়া যায়নি!`,`error`,`প্রিন্ট Error`),Error(`Transaction record not found in database`);let d=u.customerId,m=await r.getById(d)||{},h=await t.getByCustomer(d);h.sort((e,t)=>{let n=new Date(e.date)-new Date(t.date);return n===0?(e.createdAt?.toMillis()||0)-(t.createdAt?.toMillis()||0):n});let g=Number(m.initialDue||0);for(let t of h){if(t.id===e)break;g+=(Number(t.bill)||0)-(Number(t.paid)||0)}let _=s(g),v=s(_+(Number(u.bill)||0)-(Number(u.paid)||0)),y=await n.getAppSettings(),b=l(y.shopName||`M/S. Maa Motors`),x=l(y.shopAddress||`Shop No. 22, Rahman Tower, 1st Rail Gate, Muradpur, Hathazari Road`),S=l(y.shopPhone||`01819-397669, 01815-707934`),C=document.getElementById(`print-receipt-container`);C||(C=document.createElement(`div`),C.id=`print-receipt-container`,C.classList.add(`hidden`),document.body.appendChild(C));let w=``;if(u.hasItems&&u.items&&u.items.length>0)w=`
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
                                <td class="text-left" style="font-weight:700;">${l(e.desc||`-`)}</td>
                                <td class="text-right">${e.qty||0}</td>
                                <td class="text-right">৳${i(e.rate||0)}</td>
                                <td class="text-right" style="font-weight:800;">৳${i(e.total||0)}</td>
                            </tr>
                        `).join(``)}
                    </tbody>
                </table>
            `;else{let e=u.bill>0?u.paid>0?`Transaction Entry / Payment`:`Opening Balance / Bill Entry`:`Cash Received / Payment`,t=u.bill>0?u.bill:u.paid;w=`
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
                            <td class="text-right" style="font-weight:900; color:#0f172a;">৳${i(t)}</td>
                        </tr>
                    </tbody>
                </table>
            `}if(o===`a4`){let t=p({title:`INVOICE`,dateRangeStr:`ভাউচার #: #${l(u.voucherNo||e.slice(-6).toUpperCase())} • তারিখ: ${c(u.date)}`},y);C.className=`print-a4`,C.innerHTML=`
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
                        <p style="font-size:15px; font-weight: 900; color:#0f172a; margin-bottom: 4px; line-height: 1.2;">${l(u.customerName)}</p>
                        <div style="display: flex; flex-wrap: wrap; gap: 12px; font-size:11px; color:#475569; margin-bottom: 6px;">
                            <span><strong style="color:#0f172a;">A/C No:</strong> ${l(m.accountNo||`-`)}</span>
                            <span><strong style="color:#0f172a;">Mobile:</strong> ${l(m.phone||`-`)}</span>
                        </div>
                        <div style="border-top: 1px dashed #cbd5e1; padding-top: 6px; margin-top: 4px;">
                            <p style="font-size: 11px; color: #334155; line-height: 1.4; margin: 0; font-weight: 600;"><strong>Address:</strong> ${l(m.address||`-`)}</p>
                        </div>
                    </div>

                    ${w?`<div style="margin-bottom:18px;">${w}</div>`:``}

                    <div style="display: grid; grid-template-columns: 1.2fr 1fr; gap: 24px; margin-top: 15px; page-break-inside: avoid;">
                        <div style="background: #fffbe6; border: 1px solid #ffe58f; border-radius: 10px; padding: 10px 14px;">
                            <strong style="color:#856404; font-weight:900; font-size:11px; border-bottom:1px solid #fadb14; display:block; padding-bottom:3px; margin-bottom:5px;">নোট / শর্তাবলী:</strong>
                            <p style="font-size:10.5px; line-height:1.5; color:#533f03; margin:0;">${u.notes?l(u.notes).replace(/\n/g,`<br/>`):`পণ্য বিক্রয়ের সময় রিসিট দেখে বুঝে নিন। ধন্যবাদ!`}</p>
                        </div>
                        <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 10px; padding: 10px 14px; position: relative;">
                            
                            <!-- Watermark Stamp (Moved to Payment Equation) -->
                            <div style="position: absolute; left: 50%; top: 50%; transform: translate(-50%, -50%) rotate(-12deg); pointer-events: none; opacity: 0.12; border: 4px double ${v<=0?`#059669`:`#dc2626`}; color: ${v<=0?`#059669`:`#dc2626`}; padding: 6px 14px; border-radius: 8px; font-weight: 900; font-size: 26px; text-transform: uppercase; letter-spacing: 2px; text-align: center; line-height: 1.1; z-index: 10; font-family: sans-serif;">
                                ${v<=0?`PAID`:`DUE`}
                            </div>

                            <div style="font-size: 10px; font-weight: 900; color: #0f172a; border-bottom: 1px solid #cbd5e1; padding-bottom: 4px; margin-bottom: 6px; text-transform: uppercase;">হিসাবের বিবরণী (Payment Equation)</div>
                            ${u.subtotal&&u.discount>0?`<div style="display:flex; justify-content:space-between; margin-bottom:3px; font-size:11px; color:#475569; position: relative; z-index: 20;"><span>Subtotal:</span><strong>৳ ${i(u.subtotal)}</strong></div>`:``}
                            ${u.discount>0?`<div style="display:flex; justify-content:space-between; margin-bottom:3px; font-size:11px; color:#d97706; position: relative; z-index: 20;"><span>Discount (-):</span><strong>- ৳ ${i(u.discount)}</strong></div>`:``}
                            <div style="display:flex; justify-content:space-between; margin-bottom:3px; font-size:11px; color:#0f172a; font-weight:700; position: relative; z-index: 20;"><span>আজকের বিল:</span><strong>৳ ${i(u.bill)}</strong></div>
                            <div style="display:flex; justify-content:space-between; margin-bottom:3px; font-size:11px; color:#475569; position: relative; z-index: 20;"><span>পূর্বের জের:</span><strong>৳ ${i(_)}</strong></div>
                            <div style="display:flex; justify-content:space-between; margin-bottom:3px; font-size:11px; color:#059669; font-weight:700; position: relative; z-index: 20;"><span>আজকের জমা:</span><strong>- ৳ ${i(u.paid)}</strong></div>
                            <div style="display:flex; justify-content:space-between; padding:5px 8px; border-top:2px solid #cbd5e1; font-size:12.5px; font-weight:900; color:${v>0?`#dc2626`:`#059669`}; background: ${v>0?`#fef2f2`:`#ecfdf5`}; border-radius: 6px; margin-top: 4px; border-left: 4px solid ${v>0?`#dc2626`:`#059669`}; position: relative; z-index: 20;"><span>মোট জের:</span><strong>৳ ${i(Math.abs(v))} ${v<0?`(Adv)`:``}</strong></div>
                        </div>
                    </div>

                    <div style="display: flex; justify-content: space-between; margin-top: 40px; padding: 0 20px; page-break-inside: avoid;">
                        <div style="border-top: 1.5px dashed #64748b; padding-top: 5px; width: 140px; text-align: center; font-size: 11px; font-weight: 700; color: #334155;">গ্রাহকের স্বাক্ষর</div>
                        <div style="border-top: 1.5px dashed #64748b; padding-top: 5px; width: 140px; text-align: center; font-size: 11px; font-weight: 700; color: #334155;">কর্তৃপক্ষের স্বাক্ষর</div>
                    </div>
                </div>
            `}else{let t=l(y.shopOwner||`Mohammed Amran`);C.className=`print-pos`,C.innerHTML=`
                <div class="pos-wrapper font-bn text-center" style="width: 80mm; padding: 10px; box-sizing: border-box; background: white; color: black; font-family: 'Inter', 'Kalpurush', 'Hind Siliguri', sans-serif;">
                    <h2 style="font-size: 16px; font-weight: 900; margin: 0 0 2px 0; text-transform: uppercase;">${b}</h2>
                    <p style="font-size: 10px; margin: 1px 0 4px 0; font-weight: 700; font-family: 'Inter', sans-serif;">Proprietor: ${t}</p>
                    <p style="font-size: 10px; margin: 0 0 6px 0; opacity: 0.85;">${x}<br>মোবাইল: ${S}</p>
                    <div style="border-bottom: 1.5px dashed #000; margin: 6px 0;"></div>
                    <div style="display: flex; justify-content: space-between; font-size: 10px; font-weight: 700; font-family: monospace;">
                        <span>#${l(u.voucherNo||e.slice(-6).toUpperCase())}</span>
                        <span>${c(u.date)}</span>
                    </div>
                    <div style="text-align: left; font-weight: 800; font-size: 12px; margin: 6px 0 4px 0;">কাস্টমার: ${l(u.customerName)}</div>
                    <div style="border-bottom: 1px dashed #000; margin: 6px 0;"></div>
                    <div style="display: flex; justify-content: space-between; font-size: 11px; margin: 3px 0;"><span>পূর্বের জের:</span><span>৳ ${i(_)}</span></div>
                    <div style="display: flex; justify-content: space-between; font-size: 11px; margin: 3px 0;"><span>আজকের বিল:</span><span>৳ ${i(u.bill)}</span></div>
                    <div style="display: flex; justify-content: space-between; font-size: 11px; margin: 3px 0; font-weight: 700;"><span>আজকের জমা (-):</span><span>- ৳ ${i(u.paid)}</span></div>
                    <div style="border-bottom: 1.5px solid #000; margin: 6px 0;"></div>
                    <div style="display: flex; justify-content: space-between; font-size: 13px; font-weight: 900;">
                        <span>মোট বকেয়া:</span>
                        <span>৳ ${i(Math.abs(v))} ${v<0?`(Adv)`:``}</span>
                    </div>
                    <div style="border-bottom: 1px dashed #000; margin: 8px 0;"></div>
                    <div style="font-size: 10px; font-weight: 700; margin-top: 6px;">পণ্য বিক্রয়ের সময় দেখে বুঝে নিন। ধন্যবাদ!</div>
                </div>
            `}f(C),a(`প্রিন্ট পপ-আপ কমান্ড তৈরি সফল (${o.toUpperCase()})!`,`success`,`প্রিন্ট Engine`)}catch(e){console.error(`Print Engine Error:`,e),a(`প্রিন্ট ব্যর্থ: ${e.message||`অজানা এরর`}`,`error`,`প্রিন্ট Error`),d.default.fire(`প্রিন্ট এরর`,e.message||`প্রিন্ট করতে সমস্যা হয়েছে`,`error`)}}typeof window<`u`&&(window.printReceiptEngine=m);export{m as printReceiptEngine};
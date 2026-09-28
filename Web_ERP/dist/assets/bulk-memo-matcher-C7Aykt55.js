import{i as e}from"./rolldown-runtime-Dd_uD5pT.js";import{c as t}from"./dao-BAvPFDr3.js";import{_ as n,l as r,o as i}from"./ui-helpers-ChDNPFdp.js";import{_ as a}from"./customer-state-2ylgXcjb.js";import{n as o}from"./vendor-ui-n4g2UPZQ.js";import{n as s,t as c}from"./index-Bl-EwODg.js";import{uploadMemoToR2 as l}from"./r2-memo-uploader-CkAs0uPJ.js";var u=e(o());function d(e){if(!e&&e!==0)return``;let t=String(e).trim(),n=[`০`,`১`,`২`,`৩`,`৪`,`৫`,`৬`,`৭`,`৮`,`৯`];for(let e=0;e<10;e++)t=t.replaceAll(n[e],String(e));return t=t.replace(/^(?:memo[_-]?|inv[_-]?|v[_-]?|[#\s])+/i,``),t=t.replace(/^0+(?=\d)/,``),t.trim()}function f(e){if(!e)return``;let t=e.replace(/\.[^/.]+$/,``).trim(),n=t.match(/(?:memo[_-]?|inv[_-]?|v[_-]?)?(\d+)/i);return d(n?n[1]:t.replace(/^[#\s]+/,``))}function p(e){if(!e||!e.date)return``;let t=String(e.date).trim().match(/^(\d{4})/);return t?t[1]:``}function m(e,t){return e?`
            <div class="font-bold text-white text-xs truncate max-w-[170px]">${e.customerName||`কাস্টমার`}</div>
            <div class="text-[10px] text-slate-400 flex items-center gap-1 font-mono">
                <span>${r(e.date)}</span>
                ${e.bill>0?`<span class="text-red-400">বিল: ৳${n(e.bill)}</span>`:``}
                ${e.paid>0?`<span class="text-emerald-400">জমা: ৳${n(e.paid)}</span>`:``}
            </div>`:`<div class="text-[11px] text-rose-300 font-medium">খতিয়ানে ভাউচার #${t||`—`} নেই</div>`}function h(e){return e?e.memoPhotoUrl?{cls:`text-[9px] font-bold text-amber-400 bg-amber-500/10 px-1.5 py-0.5 rounded border border-amber-500/20`,html:`<i class="fa-solid fa-triangle-exclamation text-[8px] mr-1"></i>মেমো আছে`}:{cls:`text-[9px] font-bold text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded border border-emerald-500/20`,html:`<i class="fa-solid fa-circle-check text-[8px] mr-1"></i>প্রস্তুত`}:{cls:`text-[9px] font-bold text-rose-400 bg-rose-500/10 px-1.5 py-0.5 rounded border border-rose-500/20`,html:`<i class="fa-solid fa-circle-xmark text-[8px] mr-1"></i>লেনদেন নেই`}}function g(e,t){let n=t&&t!==`all`?e.filter(e=>p(e)===t):e,r=new Map;return n.forEach(e=>{if(e.voucherNo){let t=d(e.voucherNo);t&&(r.has(t)||r.set(t,[]),r.get(t).push(e))}}),r}async function _(){let e=[],n=[],r=new Date().getFullYear().toString(),a=r;try{try{n=await t.getAll()}catch(e){console.error(`Failed to load txns for bulk matcher:`,e),n=window._currentLedgerTxns||[]}let o=Array.from(new Set(n.map(e=>p(e)).filter(e=>e&&e.length===4))).sort((e,t)=>t.localeCompare(e));o.includes(r)||o.unshift(r);let c=o.map(e=>`
            <option value="${e}" ${e===r?`selected`:``}>
                ${e===r?`${e} (চলতি সাল)`:`${e} সাল`}
            </option>
        `).join(``)+`<option value="all">সকল সাল (All Years)</option>`;u.default.fire({title:`
                <div class="flex items-center justify-between w-full pb-2 border-b border-slate-800 font-bn">
                    <div class="flex items-center gap-2 text-white text-base font-black">
                        <i class="fa-solid fa-layer-group text-amber-400"></i>
                        <span>বাল্ক মেমো ম্যাচিং ইঞ্জিন</span>
                    </div>
                    <div class="flex items-center gap-1.5 bg-slate-900 border border-slate-700/80 px-2 py-1 rounded-xl">
                        <span class="text-[11px] font-bold text-slate-400 flex items-center gap-1">
                            <i class="fa-solid fa-calendar-days text-amber-400 text-[10px]"></i>
                            <span>সাল:</span>
                        </span>
                        <select id="bulk-year-select" class="bg-slate-950 text-cyan-400 font-mono font-bold text-xs border border-slate-700/80 rounded-lg px-2 py-0.5 outline-none focus:border-amber-400 cursor-pointer">
                            ${c}
                        </select>
                    </div>
                </div>`,html:`
                <div class="flex flex-col gap-3 font-bn text-left p-1">
                    <div id="bulk-dropzone" class="border-2 border-dashed border-slate-700 hover:border-amber-500/60 bg-slate-900/80 rounded-2xl p-5 text-center cursor-pointer transition-all flex flex-col items-center justify-center gap-2 group">
                        <input type="file" id="bulk-file-input" multiple accept="image/*,.webp" class="hidden">
                        <div class="w-11 h-11 rounded-full bg-slate-800 flex items-center justify-center text-slate-400 text-lg group-hover:text-amber-400 group-hover:scale-110 transition-all">
                            <i class="fa-solid fa-cloud-arrow-up"></i>
                        </div>
                        <div class="text-xs text-slate-200 font-bold">একসাথে একাধিক মেমোর ছবি টেনে আনুন (Drag & Drop) অথবা <span class="text-amber-400 underline">ব্রাউজ করুন</span></div>
                        <div class="text-[10px] text-slate-400 font-medium">১০ থেকে ৫০+ ছবি একবারে সিলেক্ট করুন (যেমন: 101.webp, 102.webp...)</div>
                    </div>
                    <div id="bulk-preview-section" class="hidden flex flex-col gap-2">
                        <div class="flex items-center justify-between px-1">
                            <div id="bulk-count-badge" class="text-xs font-bold text-amber-400 flex items-center gap-1.5">
                                <i class="fa-solid fa-images"></i> <span>০টি ছবি নির্বাচিত</span>
                            </div>
                            <button type="button" id="bulk-select-all-btn" class="text-[11px] font-bold text-cyan-400 hover:underline cursor-pointer">সবগুলো আনচেক</button>
                        </div>
                        <div class="max-h-72 overflow-y-auto custom-scrollbar border border-slate-800 rounded-xl bg-slate-950/60 divide-y divide-slate-800/80" id="bulk-match-list"></div>
                    </div>
                    <div id="bulk-progress-container" class="hidden flex flex-col gap-1.5 p-3 rounded-xl bg-slate-950 border border-slate-800">
                        <div class="flex items-center justify-between text-xs font-bold">
                            <span id="bulk-progress-status" class="text-slate-300">আপলোড শুরু হচ্ছে...</span>
                            <span id="bulk-progress-pct" class="text-amber-400 font-mono">০%</span>
                        </div>
                        <div class="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
                            <div id="bulk-progress-bar" class="h-full bg-gradient-to-r from-amber-500 to-emerald-400 transition-all duration-300" style="width: 0%"></div>
                        </div>
                    </div>
                </div>`,showCancelButton:!0,confirmButtonText:`<i class="fa-solid fa-cloud-arrow-up mr-1.5"></i>সবগুলো আপলোড ও লিঙ্ক করুন`,cancelButtonText:`বাতিল`,showConfirmButton:!1,customClass:{popup:`!bg-slate-950 !text-white !rounded-3xl border border-slate-800 shadow-2xl font-bn max-w-2xl w-full`,confirmButton:`m3-btn-primary !bg-emerald-600 hover:!bg-emerald-500 !px-5 !py-2.5 rounded-xl font-bold text-xs`,cancelButton:`!bg-slate-900 hover:!bg-slate-800 !text-slate-400 !px-5 !py-2.5 rounded-xl font-bold text-xs border border-slate-800`},didOpen:async()=>{let t=document.getElementById(`bulk-dropzone`),r=document.getElementById(`bulk-file-input`),o=document.getElementById(`bulk-year-select`),c=t=>{let r=Array.from(t).filter(e=>s(e));if(!r.length)return i(`কোনো সঠিক ছবি পাওয়া যায়নি। JPG, PNG বা WebP নির্বাচন করুন।`,`warning`);e=r,y(e,n,a)};o&&(o.onchange=()=>{a=o.value,e.length>0&&y(e,n,a)}),t&&r&&(t.onclick=()=>r.click(),r.onchange=e=>{e.target.files?.length&&c(e.target.files)},t.ondragover=e=>{e.preventDefault(),t.classList.add(`!border-amber-400`,`!bg-amber-500/10`)},t.ondragleave=()=>{t.classList.remove(`!border-amber-400`,`!bg-amber-500/10`)},t.ondrop=e=>{e.preventDefault(),t.classList.remove(`!border-amber-400`,`!bg-amber-500/10`),e.dataTransfer.files?.length&&c(e.dataTransfer.files)})},preConfirm:async()=>b(e,n,a)})}catch(e){console.error(`Bulk matcher modal error:`,e),i(`মোডাল লোড করতে সমস্যা হয়েছে`,`error`)}}function v(e,t){let n=document.getElementById(`bulk-count-badge`);if(!n)return;let r=0,i=0;e.forEach(e=>{let n=e._customVoucher===void 0?f(e.name):e._customVoucher;(t.get(n)||[]).length>0?r++:i++}),n.innerHTML=`
        <div class="flex flex-wrap items-center gap-1.5">
            <span class="text-xs font-bold text-amber-400 flex items-center gap-1">
                <i class="fa-solid fa-images"></i> <span>মোট ${e.length}টি</span>
            </span>
            <span class="text-[10px] text-slate-500">•</span>
            <button type="button" class="bulk-filter-tab text-[10px] font-bold px-2 py-0.5 rounded-md bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 cursor-pointer hover:bg-emerald-500/30 transition-all" data-tab="ready">
                <i class="fa-solid fa-circle-check mr-1 text-[9px]"></i>প্রস্তুত (${r})
            </button>
            ${i>0?`
                <button type="button" class="bulk-filter-tab text-[10px] font-bold px-2 py-0.5 rounded-md bg-rose-500/20 text-rose-300 border border-rose-500/30 cursor-pointer hover:bg-rose-500/30 transition-all" data-tab="unmatched">
                    <i class="fa-solid fa-circle-xmark mr-1 text-[9px]"></i>এন্ট্রি নেই (${i})
                </button>
            `:``}
            <button type="button" class="bulk-filter-tab text-[10px] font-bold px-2 py-0.5 rounded-md bg-slate-800 text-slate-300 border border-slate-700 cursor-pointer hover:bg-slate-700 transition-all" data-tab="all">
                সবগুলো
            </button>
        </div>`,document.querySelectorAll(`.bulk-filter-tab`).forEach(e=>{e.onclick=()=>{let t=e.dataset.tab;document.querySelectorAll(`.bulk-match-row`).forEach(e=>{t===`all`?e.style.display=`flex`:t===`ready`?e.style.display=e.dataset.status===`ready`?`flex`:`none`:t===`unmatched`&&(e.style.display=e.dataset.status===`unmatched`?`flex`:`none`)})}})}function y(e,t,n){let r=document.getElementById(`bulk-preview-section`),i=document.getElementById(`bulk-match-list`),a=u.default.getConfirmButton();if(!r||!i)return;r.classList.remove(`hidden`),a&&(a.style.display=`inline-flex`);let o=g(t,n);v(e,o);let s=``;e.forEach((e,t)=>{let n=e._customVoucher===void 0?f(e.name):e._customVoucher;e._customVoucher=n;let r=(o.get(n)||[])[0]||null,i=URL.createObjectURL(e),a=h(r);s+=`
            <div class="bulk-match-row flex items-center justify-between gap-2 p-2 hover:bg-slate-900/60 transition-colors" data-idx="${t}" data-status="${r?`ready`:`unmatched`}">
                <div class="flex items-center gap-2 overflow-hidden">
                    <input type="checkbox" class="bulk-item-check rounded accent-emerald-500 w-4 h-4 cursor-pointer" ${r===null?`disabled`:`checked`} data-idx="${t}">
                    <img src="${i}" alt="thumb" class="w-9 h-11 object-cover rounded bg-slate-800 border border-slate-700 shrink-0 cursor-pointer" onclick="window.open('${i}', '_blank')" title="বড় করে দেখতে ক্লিক করুন">
                    <div class="flex flex-col overflow-hidden">
                        <div class="flex items-center gap-1.5">
                            <div class="flex items-center bg-slate-900 border border-slate-700 focus-within:border-cyan-400 rounded px-1.5 py-0.5 transition-colors" title="ভাউচার নাম্বারে ভুল থাকলে সরাসরি এডিট করুন">
                                <span class="text-[10px] font-mono font-bold text-slate-500 mr-0.5">#</span>
                                <input type="text" class="bulk-voucher-input bg-transparent text-[11px] font-mono font-bold text-cyan-400 outline-none w-16" value="${n}" data-idx="${t}">
                            </div>
                            <span class="text-[10px] text-slate-500 truncate max-w-[100px]" title="${e.name}">${e.name}</span>
                        </div>
                        <div id="bulk-cust-info-${t}">
                            ${m(r,n)}
                        </div>
                    </div>
                </div>
                <div class="shrink-0 flex items-center gap-1">
                    <span id="bulk-status-badge-${t}" class="${a.cls}">${a.html}</span>
                </div>
            </div>`}),i.innerHTML=s,document.querySelectorAll(`.bulk-voucher-input`).forEach(t=>{let n=()=>{let n=parseInt(t.dataset.idx,10),r=e[n];if(!r)return;let i=d(t.value);t.value=i,r._customVoucher=i;let a=(o.get(i)||[])[0]||null,s=document.querySelector(`.bulk-match-row[data-idx="${n}"]`),c=document.getElementById(`bulk-cust-info-${n}`),l=document.getElementById(`bulk-status-badge-${n}`),u=document.querySelector(`.bulk-item-check[data-idx="${n}"]`);if(s&&(s.dataset.status=a?`ready`:`unmatched`),u&&(u.disabled=!a,u.checked=a!==null),l){let e=h(a);l.className=e.cls,l.innerHTML=e.html}c&&(c.innerHTML=m(a,i)),v(e,o)};t.oninput=n,t.onchange=n,t.onkeydown=e=>{if(e.key===`Enter`){e.preventDefault();let n=parseInt(t.dataset.idx,10),r=document.querySelector(`.bulk-voucher-input[data-idx="${n+1}"]`);r&&(r.focus(),r.select())}}});let c=document.getElementById(`bulk-select-all-btn`);if(c){let e=!0;c.onclick=()=>{e=!e,document.querySelectorAll(`.bulk-item-check:not(:disabled)`).forEach(t=>t.checked=e),c.innerText=e?`সবগুলো আনচেক`:`সবগুলো সিলেক্ট`}}}async function b(e,n,r){let o=document.querySelectorAll(`.bulk-item-check:checked`),s=Array.from(o).map(e=>parseInt(e.dataset.idx,10));if(!s.length)return i(`আপলোড করার জন্য কমপক্ষে একটি প্রস্তুত মেমো সিলেক্ট করুন।`,`warning`),!1;if(!await a(`বাল্ক মেমো আপলোড ও লিঙ্ক`))return!1;let d=document.getElementById(`bulk-progress-container`),p=document.getElementById(`bulk-progress-bar`),m=document.getElementById(`bulk-progress-status`),h=document.getElementById(`bulk-progress-pct`),_=u.default.getConfirmButton(),v=u.default.getCancelButton();d&&d.classList.remove(`hidden`),_&&(_.disabled=!0),v&&(v.disabled=!0);let y=g(n,r),b=0,x=0,S=s.length;for(let n=0;n<S;n++){let r=e[s[n]],i=r._customVoucher===void 0?f(r.name):r._customVoucher,a=y.get(i)||[],o=a[0],u=n+1,d=Math.round(u/S*100);m&&(m.innerText=`${u}/${S}: ভাউচার #${i} আপলোড হচ্ছে...`),h&&(h.innerText=`${d}%`),p&&(p.style.width=`${d}%`);try{if(!o)throw Error(`লেনদেন পাওয়া যায়নি`);let e=r;(r.type!==`image/webp`||r.size>51200)&&(e=(await c(r)).blob);let n=await l(e,i,o.customerId||``);if(!n||!n.url)throw Error(`R2 রেসপন্স ত্রুটিপূর্ণ`);for(let e of a)await t.update(e.id,{memoPhotoUrl:n.url,memoPhotoPath:n.filename,memoUploadedAt:new Date().toISOString()}),e.memoPhotoUrl=n.url,e.memoPhotoPath=n.filename;b++}catch(e){console.error(`Failed to upload memo for voucher #${i}:`,e),x++}}return typeof window.loadRecentTransactions==`function`&&window.loadRecentTransactions(),u.default.fire({title:`<i class="fa-solid fa-circle-check text-emerald-400 mr-2"></i>বাল্ক আপলোড সম্পন্ন!`,html:`
            <div class="font-bn text-sm text-slate-300 space-y-2 text-center">
                <div class="text-base font-bold text-white">মোট ${S}টি মেমোর মধ্যে <span class="text-emerald-400 font-mono font-black">${b}টি</span> সফলভাবে লিঙ্ক হয়েছে!</div>
                ${x>0?`<div class="text-xs text-rose-400 font-bold">${x}টি আপলোড ব্যর্থ হয়েছে।</div>`:``}
                <div class="text-xs text-slate-400 pt-1">খতিয়ান টেবিলে গোল্ডেন মেমো আইকন দৃশ্যমান হয়েছে।</div>
            </div>`,icon:`success`,confirmButtonText:`ঠিক আছে`,customClass:{popup:`!bg-slate-950 !text-white !rounded-3xl border border-slate-800 font-bn`}}),!0}export{_ as openBulkMemoMatcherModal};
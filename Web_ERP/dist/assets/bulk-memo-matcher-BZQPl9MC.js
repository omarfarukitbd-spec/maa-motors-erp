import{i as e}from"./rolldown-runtime-Dd_uD5pT.js";import{c as t}from"./dao-BAvPFDr3.js";import{_ as n,l as r,o as i}from"./ui-helpers-ChDNPFdp.js";import{_ as a}from"./customer-state-2ylgXcjb.js";import{n as o}from"./vendor-ui-n4g2UPZQ.js";import{n as s,t as c}from"./index-BIGPEfc6.js";import{uploadMemoToR2 as l}from"./r2-memo-uploader-CkAs0uPJ.js";var u=e(o());function d(e){if(!e)return``;let t=e.replace(/\.[^/.]+$/,``).trim(),n=t.match(/(?:memo[_-]?|inv[_-]?|v[_-]?)?(\d+)/i);return n?n[1]:t.replace(/^[#\s]+/,``)}async function f(){let e=[],n=[];try{u.default.fire({title:`<div class="flex items-center justify-center gap-2 font-bn font-black text-lg text-white"><i class="fa-solid fa-layer-group text-amber-400"></i><span>বাল্ক মেমো ম্যাচিং ইঞ্জিন</span></div>`,html:`
                <div class="flex flex-col gap-4 font-bn text-left p-1">
                    <!-- Dropzone -->
                    <div id="bulk-dropzone" class="border-2 border-dashed border-slate-700 hover:border-amber-500/60 bg-slate-900/80 rounded-2xl p-6 text-center cursor-pointer transition-all flex flex-col items-center justify-center gap-2 group">
                        <input type="file" id="bulk-file-input" multiple accept="image/*,.webp" class="hidden">
                        <div class="w-12 h-12 rounded-full bg-slate-800 flex items-center justify-center text-slate-400 text-xl group-hover:text-amber-400 group-hover:scale-110 transition-all">
                            <i class="fa-solid fa-cloud-arrow-up"></i>
                        </div>
                        <div class="text-xs text-slate-200 font-bold">একসাথে একাধিক মেমোর ছবি টেনে আনুন (Drag & Drop) অথবা <span class="text-amber-400 underline">ব্রাউজ করুন</span></div>
                        <div class="text-[10px] text-slate-500 font-medium">১০ থেকে ৫০+ ছবি একবারে সিলেক্ট করুন (যেমন: 101.webp, 102.webp...)</div>
                    </div>

                    <!-- Selected Files Preview Container -->
                    <div id="bulk-preview-section" class="hidden flex flex-col gap-2">
                        <div class="flex items-center justify-between px-1">
                            <div id="bulk-count-badge" class="text-xs font-bold text-amber-400 flex items-center gap-1.5">
                                <i class="fa-solid fa-images"></i>
                                <span>০টি ছবি নির্বাচিত</span>
                            </div>
                            <button type="button" id="bulk-select-all-btn" class="text-[11px] font-bold text-cyan-400 hover:underline cursor-pointer">সবগুলো আনচেক</button>
                        </div>

                        <!-- Match Table -->
                        <div class="max-h-72 overflow-y-auto custom-scrollbar border border-slate-800 rounded-xl bg-slate-950/60 divide-y divide-slate-800/80" id="bulk-match-list">
                            <!-- Rows inserted dynamically -->
                        </div>
                    </div>

                    <!-- Progress Bar (Initially Hidden) -->
                    <div id="bulk-progress-container" class="hidden flex flex-col gap-1.5 p-3 rounded-xl bg-slate-950 border border-slate-800">
                        <div class="flex items-center justify-between text-xs font-bold">
                            <span id="bulk-progress-status" class="text-slate-300">আপলোড শুরু হচ্ছে...</span>
                            <span id="bulk-progress-pct" class="text-amber-400 font-mono">০%</span>
                        </div>
                        <div class="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
                            <div id="bulk-progress-bar" class="h-full bg-gradient-to-r from-amber-500 to-emerald-400 transition-all duration-300" style="width: 0%"></div>
                        </div>
                    </div>
                </div>
            `,showCancelButton:!0,confirmButtonText:`<i class="fa-solid fa-cloud-arrow-up mr-1.5"></i>সবগুলো আপলোড ও লিঙ্ক করুন`,cancelButtonText:`বাতিল`,showConfirmButton:!1,customClass:{popup:`!bg-slate-950 !text-white !rounded-3xl border border-slate-800 shadow-2xl font-bn max-w-2xl w-full`,confirmButton:`m3-btn-primary !bg-emerald-600 hover:!bg-emerald-500 !px-5 !py-2.5 rounded-xl font-bold text-xs`,cancelButton:`!bg-slate-900 hover:!bg-slate-800 !text-slate-400 !px-5 !py-2.5 rounded-xl font-bold text-xs border border-slate-800`},didOpen:async()=>{let r=document.getElementById(`bulk-dropzone`),a=document.getElementById(`bulk-file-input`);try{n=await t.getAll()}catch(e){console.error(`Failed to load txns for bulk matcher:`,e),n=window._currentLedgerTxns||[]}let o=t=>{let r=Array.from(t).filter(e=>s(e));if(!r.length)return i(`কোনো সঠিক ছবি পাওয়া যায়নি। JPG, PNG বা WebP নির্বাচন করুন।`,`warning`);e=r,p(e,n)};r&&a&&(r.onclick=()=>a.click(),a.onchange=e=>{e.target.files?.length&&o(e.target.files)},r.ondragover=e=>{e.preventDefault(),r.classList.add(`!border-amber-400`,`!bg-amber-500/10`)},r.ondragleave=()=>{r.classList.remove(`!border-amber-400`,`!bg-amber-500/10`)},r.ondrop=e=>{e.preventDefault(),r.classList.remove(`!border-amber-400`,`!bg-amber-500/10`),e.dataTransfer.files?.length&&o(e.dataTransfer.files)})},preConfirm:async()=>m(e,n)})}catch(e){console.error(`Bulk matcher modal error:`,e),i(`মোডাল লোড করতে সমস্যা হয়েছে`,`error`)}}function p(e,t){let i=document.getElementById(`bulk-preview-section`),a=document.getElementById(`bulk-count-badge`),o=document.getElementById(`bulk-match-list`),s=u.default.getConfirmButton();if(!i||!o)return;i.classList.remove(`hidden`),s&&(s.style.display=`inline-flex`);let c=new Map;t.forEach(e=>{if(e.voucherNo){let t=String(e.voucherNo).trim().replace(/^[#\s]+/,``);c.has(t)||c.set(t,[]),c.get(t).push(e)}});let l=0,f=0;e.forEach(e=>{let t=d(e.name);(c.get(t)||[]).length?l++:f++}),a.innerHTML=`
        <div class="flex flex-wrap items-center gap-1.5">
            <span class="text-xs font-bold text-amber-400 flex items-center gap-1">
                <i class="fa-solid fa-images"></i> <span>মোট ${e.length}টি ছবি</span>
            </span>
            <span class="text-[10px] text-slate-500">•</span>
            <button type="button" class="bulk-filter-tab text-[10px] font-bold px-2 py-0.5 rounded-md bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 cursor-pointer hover:bg-emerald-500/30 transition-all" data-tab="ready">
                <i class="fa-solid fa-circle-check mr-1 text-[9px]"></i>প্রস্তুত (${l})
            </button>
            ${f>0?`
                <button type="button" class="bulk-filter-tab text-[10px] font-bold px-2 py-0.5 rounded-md bg-rose-500/20 text-rose-300 border border-rose-500/30 cursor-pointer hover:bg-rose-500/30 transition-all" data-tab="unmatched">
                    <i class="fa-solid fa-circle-xmark mr-1 text-[9px]"></i>এন্ট্রি নেই (${f})
                </button>
            `:``}
            <button type="button" class="bulk-filter-tab text-[10px] font-bold px-2 py-0.5 rounded-md bg-slate-800 text-slate-300 border border-slate-700 cursor-pointer hover:bg-slate-700 transition-all" data-tab="all">
                সবগুলো
            </button>
        </div>
    `;let p=``;e.forEach((e,t)=>{let i=d(e.name),a=(c.get(i)||[])[0]||null,o=URL.createObjectURL(e),s=``,l=!1,u=`unmatched`;a?(l=!0,u=`ready`,s=a.memoPhotoUrl?`<span class="text-[9px] font-bold text-amber-400 bg-amber-500/10 px-1.5 py-0.5 rounded border border-amber-500/20" title="পূর্বে মেমো আপলোড ছিল, প্রতিস্থাপন হবে"><i class="fa-solid fa-triangle-exclamation text-[8px] mr-1"></i>মেমো আছে</span>`:`<span class="text-[9px] font-bold text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded border border-emerald-500/20"><i class="fa-solid fa-circle-check text-[8px] mr-1"></i>প্রস্তুত</span>`):(u=`unmatched`,s=`<span class="text-[9px] font-bold text-rose-400 bg-rose-500/10 px-1.5 py-0.5 rounded border border-rose-500/20"><i class="fa-solid fa-circle-xmark text-[8px] mr-1"></i>লেনদেন নেই</span>`);let f=a?`<div class="font-bold text-white text-xs truncate max-w-[170px]">${a.customerName||`কাস্টমার`}</div>
               <div class="text-[10px] text-slate-400 flex items-center gap-1 font-mono">
                   <span>${r(a.date)}</span>
                   ${a.bill>0?`<span class="text-red-400">বিল: ৳${n(a.bill)}</span>`:``}
                   ${a.paid>0?`<span class="text-emerald-400">জমা: ৳${n(a.paid)}</span>`:``}
               </div>`:`<div class="text-[11px] text-rose-300 font-medium">খতিয়ানে ভাউচার #${i} এন্ট্রি করা হয়নি</div>`;p+=`
            <div class="bulk-match-row flex items-center justify-between gap-2 p-2 hover:bg-slate-900/60 transition-colors" data-idx="${t}" data-status="${u}">
                <div class="flex items-center gap-2 overflow-hidden">
                    <input type="checkbox" class="bulk-item-check rounded accent-emerald-500 w-4 h-4 cursor-pointer" ${l?`checked`:`disabled`} data-idx="${t}">
                    <img src="${o}" alt="thumb" class="w-9 h-11 object-cover rounded bg-slate-800 border border-slate-700 shrink-0 cursor-pointer" onclick="window.open('${o}', '_blank')" title="বড় করে দেখতে ক্লিক করুন">
                    <div class="flex flex-col overflow-hidden">
                        <div class="flex items-center gap-1.5">
                            <span class="text-[11px] font-mono font-black text-cyan-400">#${i||`—`}</span>
                            <span class="text-[10px] text-slate-500 truncate max-w-[100px]">${e.name}</span>
                        </div>
                        ${f}
                    </div>
                </div>
                <div class="shrink-0 flex items-center gap-1">
                    ${s}
                </div>
            </div>
        `}),o.innerHTML=p,document.querySelectorAll(`.bulk-filter-tab`).forEach(e=>{e.onclick=()=>{let t=e.dataset.tab;document.querySelectorAll(`.bulk-match-row`).forEach(e=>{t===`all`?e.style.display=`flex`:t===`ready`?e.style.display=e.dataset.status===`ready`?`flex`:`none`:t===`unmatched`&&(e.style.display=e.dataset.status===`unmatched`?`flex`:`none`)})}});let m=document.getElementById(`bulk-select-all-btn`);if(m){let e=!0;m.onclick=()=>{e=!e,document.querySelectorAll(`.bulk-item-check:not(:disabled)`).forEach(t=>t.checked=e),m.innerText=e?`সবগুলো আনচেক`:`সবগুলো সিলেক্ট`}}}async function m(e,n){let r=document.querySelectorAll(`.bulk-item-check:checked`),o=Array.from(r).map(e=>parseInt(e.dataset.idx,10));if(!o.length)return i(`আপলোড করার জন্য কমপক্ষে একটি প্রস্তুত মেমো সিলেক্ট করুন।`,`warning`),!1;if(!await a(`বাল্ক মেমো আপলোড ও লিঙ্ক`))return!1;let s=document.getElementById(`bulk-progress-container`),f=document.getElementById(`bulk-progress-bar`),p=document.getElementById(`bulk-progress-status`),m=document.getElementById(`bulk-progress-pct`),h=u.default.getConfirmButton(),g=u.default.getCancelButton();s&&s.classList.remove(`hidden`),h&&(h.disabled=!0),g&&(g.disabled=!0);let _=new Map;n.forEach(e=>{if(e.voucherNo){let t=String(e.voucherNo).trim().replace(/^[#\s]+/,``);_.has(t)||_.set(t,[]),_.get(t).push(e)}});let v=0,y=0,b=o.length;for(let n=0;n<b;n++){let r=e[o[n]],i=d(r.name),a=(_.get(i)||[])[0],s=n+1,u=Math.round(s/b*100);p&&(p.innerText=`${s}/${b}: ভাউচার #${i} আপলোড হচ্ছে...`),m&&(m.innerText=`${u}%`),f&&(f.style.width=`${u}%`);try{if(!a)throw Error(`লেনদেন পাওয়া যায়নি`);let e=r;(r.type!==`image/webp`||r.size>51200)&&(e=(await c(r)).blob);let n=await l(e,i,a.customerId||``);if(!n||!n.url)throw Error(`R2 রেসপন্স ত্রুটিপূর্ণ`);await t.update(a.id,{memoPhotoUrl:n.url,memoPhotoPath:n.filename,memoUploadedAt:new Date().toISOString()}),a.memoPhotoUrl=n.url,a.memoPhotoPath=n.filename,v++}catch(e){console.error(`Failed to upload memo for voucher #${i}:`,e),y++}}return typeof window.loadRecentTransactions==`function`&&window.loadRecentTransactions(),u.default.fire({title:`<i class="fa-solid fa-circle-check text-emerald-400 mr-2"></i>বাল্ক আপলোড সম্পন্ন!`,html:`
            <div class="font-bn text-sm text-slate-300 space-y-2 text-center">
                <div class="text-base font-bold text-white">মোট ${b}টি মেমোর মধ্যে <span class="text-emerald-400 font-mono font-black">${v}টি</span> সফলভাবে লিঙ্ক হয়েছে!</div>
                ${y>0?`<div class="text-xs text-rose-400 font-bold">${y}টি আপলোড ব্যর্থ হয়েছে।</div>`:``}
                <div class="text-xs text-slate-500 pt-1">খতিয়ান টেবিলে গোল্ডেন মেমো আইকন দৃশ্যমান হয়েছে।</div>
            </div>
        `,icon:`success`,confirmButtonText:`ঠিক আছে`,customClass:{popup:`!bg-slate-950 !text-white !rounded-3xl border border-slate-800 font-bn`}}),!0}export{f as openBulkMemoMatcherModal};
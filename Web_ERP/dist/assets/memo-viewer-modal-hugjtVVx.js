import{i as e}from"./rolldown-runtime-Dd_uD5pT.js";import{c as t}from"./dao-BAvPFDr3.js";import{_ as n,g as r,l as i,o as a}from"./ui-helpers-ChDNPFdp.js";import{_ as o}from"./customer-state-2ylgXcjb.js";import{n as s}from"./vendor-ui-n4g2UPZQ.js";import{n as c,t as l}from"./index-BYJoCV7T.js";import{uploadMemoToR2 as u}from"./r2-memo-uploader-CkAs0uPJ.js";var d=e(s()),f=1,p=0;async function m({url:e,voucherNo:s=``,customerName:c=``,date:l=``,bill:u=0,paid:m=0,txnId:g=null,onUpdated:_=null}){if(!e){a(`কোনো মেমোর ছবি পাওয়া যায়নি`,`error`);return}f=1,p=0;let v=s?s.startsWith(`#`)?s:`#${s}`:`ভাউচার বিহীন`,y=l?i(l):``;await d.default.fire({title:null,html:`
            <div class="text-left font-bn text-white select-none">
                <!-- Header Info Bar -->
                <div class="flex items-center justify-between border-b border-slate-800 pb-3 mb-3">
                    <div class="flex items-center gap-2">
                        <div class="w-8 h-8 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
                            <i class="fa-solid fa-file-invoice text-sm"></i>
                        </div>
                        <div>
                            <div class="text-sm font-black text-amber-300 font-mono">${r(v)}</div>
                            <div class="text-[11px] text-slate-300 font-medium">${r(c||`গ্রাহকের নাম`)} ${y?`• `+y:``}</div>
                        </div>
                    </div>
                    <div class="flex items-center gap-1.5">
                        ${u>0?`<span class="text-xs font-mono font-bold text-red-400 bg-red-500/10 border border-red-500/20 px-2 py-0.5 rounded-lg">বিল: ৳ ${n(u)}</span>`:``}
                        ${m>0?`<span class="text-xs font-mono font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-lg">জমা: ৳ ${n(m)}</span>`:``}
                    </div>
                </div>

                <!-- Controls Toolbar -->
                <div class="flex items-center justify-between bg-slate-900 border border-slate-800 rounded-xl px-2.5 py-1.5 mb-3 text-xs">
                    <div class="flex items-center gap-1">
                        <button type="button" id="memo-zoom-in-btn" class="h-8 px-2.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 active:scale-95 transition-all" title="বড় করুন (Zoom In)">
                            <i class="fa-solid fa-magnifying-glass-plus mr-1"></i><span>বড়</span>
                        </button>
                        <button type="button" id="memo-zoom-out-btn" class="h-8 px-2.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 active:scale-95 transition-all" title="ছোট করুন (Zoom Out)">
                            <i class="fa-solid fa-magnifying-glass-minus mr-1"></i><span>ছোট</span>
                        </button>
                        <button type="button" id="memo-rotate-btn" class="h-8 px-2.5 rounded-lg bg-blue-600/20 hover:bg-blue-600 text-blue-300 hover:text-white border border-blue-500/30 active:scale-95 transition-all" title="৯০ ডিগ্রি ঘোরান (Rotate 90°)">
                            <i class="fa-solid fa-rotate-right mr-1"></i><span id="memo-rotate-label">ঘোরান</span>
                        </button>
                    </div>

                    <div class="flex items-center gap-1">
                        <button type="button" id="memo-direct-print-btn" class="h-8 px-2.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold active:scale-95 transition-all" title="সরাসরি প্রিন্ট করুন">
                            <i class="fa-solid fa-print mr-1"></i><span>প্রিন্ট</span>
                        </button>
                        <a href="${r(e)}" download="${r(v.replace(`#`,`Memo_`))}.webp" target="_blank" class="h-8 px-2.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 flex items-center active:scale-95 transition-all" title="মেমোর ছবি ডাউনলোড">
                            <i class="fa-solid fa-download mr-1"></i><span>ডাউনলোড</span>
                        </a>
                        ${g?`
                            <button type="button" id="memo-delete-btn" class="h-8 px-2 rounded-lg bg-red-600/20 hover:bg-red-600 text-red-300 hover:text-white border border-red-500/30 active:scale-95 transition-all" title="মেমো মুছে ফেলুন">
                                <i class="fa-solid fa-trash-can"></i>
                            </button>
                        `:``}
                    </div>
                </div>

                <!-- Image Viewport -->
                <div id="memo-viewport" class="relative w-full h-[65vh] max-h-[600px] bg-slate-950/90 rounded-2xl border border-slate-800 overflow-auto flex items-center justify-center p-2 custom-scrollbar">
                    <img id="memo-display-img" src="${r(e)}" alt="Scanned Memo" class="max-w-full max-h-full object-contain rounded-lg shadow-2xl transition-transform duration-200 select-none origin-center" style="transform: scale(1) rotate(0deg);">
                </div>
            </div>
        `,showConfirmButton:!1,showCloseButton:!0,width:`850px`,customClass:{popup:`!bg-slate-950 !rounded-3xl border border-slate-800 shadow-2xl p-4 sm:p-6`},didOpen:n=>{let r=n.querySelector(`#memo-display-img`),i=n.querySelector(`#memo-zoom-in-btn`),s=n.querySelector(`#memo-zoom-out-btn`),l=n.querySelector(`#memo-rotate-btn`),u=n.querySelector(`#memo-rotate-label`),m=n.querySelector(`#memo-direct-print-btn`),b=n.querySelector(`#memo-delete-btn`),x=()=>{r&&(r.style.transform=`scale(${f}) rotate(${p}deg)`)};i&&(i.onclick=()=>{f<2.5&&(f=Math.round((f+.25)*100)/100,x())}),s&&(s.onclick=()=>{f>.6&&(f=Math.round((f-.25)*100)/100,x())}),l&&(l.onclick=()=>{p=(p+90)%360,u&&(u.innerText=`${p}°`),x()}),m&&(m.onclick=()=>{h(e,v,c,y,p)}),b&&g&&(b.onclick=async()=>{if(await o())try{await t.update(g,{memoPhotoUrl:null,memoSource:null}),a(`সংযুক্ত মেমোর ছবি মুছে ফেলা হয়েছে`,`success`),d.default.close(),typeof _==`function`&&_()}catch(e){console.error(`Failed to detach memo:`,e),a(`মেমো মুছতে ব্যর্থ হয়েছে`,`error`)}})}})}function h(e,t,n,i,a=0){let o=document.createElement(`iframe`);o.style.position=`fixed`,o.style.left=`-9999px`,o.style.top=`0`,o.style.width=`0`,o.style.height=`0`,o.style.border=`none`,document.body.appendChild(o);let s=o.contentWindow.document,c=`
        <!DOCTYPE html>
        <html>
        <head>
            <title>${r(t||`Memo_Print`)}</title>
            <style>
                @page { size: A4 portrait; margin: 12mm 15mm; }
                body {
                    margin: 0;
                    padding: 0;
                    font-family: 'Inter', 'Kalpurush', sans-serif;
                    color: #0f172a;
                    background: #fff;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: flex-start;
                }
                .memo-header {
                    width: 100%;
                    border-bottom: 2px solid #0284c7;
                    padding-bottom: 8px;
                    margin-bottom: 14px;
                    display: flex;
                    justify-content: space-between;
                    align-items: flex-end;
                }
                .memo-title {
                    font-size: 16px;
                    font-weight: 900;
                    color: #0f172a;
                }
                .memo-meta {
                    font-size: 11px;
                    color: #475569;
                    font-weight: 600;
                }
                .memo-img-wrapper {
                    width: 100%;
                    max-height: 240mm;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }
                .memo-img {
                    max-width: 100%;
                    max-height: 235mm;
                    object-fit: contain;
                    transform: rotate(${a}deg);
                    border: 1px solid #e2e8f0;
                    border-radius: 4px;
                }
            </style>
        </head>
        <body>
            <div class="memo-header">
                <div>
                    <div class="memo-title">মেসার্স মা মোটরস্ - স্ক্যান মেমো কপি</div>
                    <div class="memo-meta">ভাউচার: <strong>${r(t)}</strong> | গ্রাহক: <strong>${r(n)}</strong></div>
                </div>
                <div class="memo-meta">তারিখ: ${r(i||`-`)}</div>
            </div>
            <div class="memo-img-wrapper">
                <img src="${r(e)}" class="memo-img" alt="Scanned Memo">
            </div>
            <script>
                window.onload = function() {
                    setTimeout(function() {
                        window.focus();
                        window.print();
                        setTimeout(function() {
                            window.parent.document.body.removeChild(window.frameElement);
                        }, 500);
                    }, 400);
                };
            <\/script>
        </body>
        </html>
    `;s.open(),s.write(c),s.close()}async function g(e,n=``,i=``,o=null){if(!e)return;let s=null,f=n?n.startsWith(`#`)?n:`#${n}`:`ভাউচার`;await d.default.fire({title:`<div class="flex items-center gap-2 font-bn font-black text-lg text-white"><i class="fa-solid fa-paperclip text-amber-400"></i><span>স্ক্যান মেমো সংযুক্ত করুন</span></div>`,html:`
            <div class="text-left font-bn space-y-3 p-1">
                <div class="bg-slate-900 border border-slate-800 p-2.5 rounded-xl text-xs flex justify-between items-center text-slate-300">
                    <div>ভাউচার: <strong class="text-cyan-400 font-mono">${r(f)}</strong></div>
                    <div>গ্রাহক: <strong class="text-white">${r(i||`কাস্টমার`)}</strong></div>
                </div>

                <!-- Dropzone Area -->
                <div id="late-dropzone" class="border-2 border-dashed border-slate-700 hover:border-amber-400/80 bg-slate-900/60 rounded-2xl p-6 text-center cursor-pointer transition-all flex flex-col items-center justify-center gap-2">
                    <input type="file" id="late-file-input" accept="image/*" class="hidden">
                    <div class="w-12 h-12 rounded-full bg-slate-800 flex items-center justify-center text-slate-400 text-xl group-hover:text-amber-400">
                        <i class="fa-solid fa-cloud-arrow-up"></i>
                    </div>
                    <div class="text-xs text-slate-200 font-bold">কম্পিউটার থেকে ছবি টেনে আনুন (Drag & Drop), <span class="text-amber-400 underline">ব্রাউজ করুন</span> অথবা <kbd class="px-1.5 py-0.5 rounded bg-slate-800 text-cyan-400 font-mono text-[11px] border border-slate-700">Ctrl + V</kbd> পেস্ট করুন</div>
                    <div class="text-[10px] text-slate-500 font-medium">স্বয়ংক্রিয়ভাবে ২০–৫০ KB WebP ফরমেটে অপ্টিমাইজ হবে</div>
                </div>

                <!-- Compression Preview Chip -->
                <div id="late-preview-chip" class="hidden bg-slate-900 border border-emerald-500/40 p-2.5 rounded-xl flex items-center justify-between text-xs">
                    <div class="flex items-center gap-2 overflow-hidden">
                        <img id="late-thumb" src="" class="w-10 h-10 object-cover rounded-lg border border-slate-700 shrink-0">
                        <div class="truncate">
                            <div class="font-bold text-white text-xs truncate">স্ক্যান মেমো প্রস্তুত</div>
                            <div id="late-size-info" class="text-[10px] text-emerald-400 font-mono font-bold">WebP • 0 KB</div>
                        </div>
                    </div>
                    <button type="button" id="late-remove-staged" class="text-slate-400 hover:text-red-400 p-1.5" title="বাদ দিন">
                        <i class="fa-solid fa-xmark"></i>
                    </button>
                </div>
            </div>
        `,showCancelButton:!0,confirmButtonText:`<i class="fa-solid fa-upload mr-1.5"></i>আপলোড ও সংরক্ষণ`,cancelButtonText:`বাতিল`,confirmButtonColor:`#059669`,cancelButtonColor:`#64748b`,customClass:{popup:`!bg-slate-950 !rounded-3xl border border-slate-800 shadow-2xl font-bn`,confirmButton:`m3-btn-primary font-bold !px-6 !py-2.5 !rounded-xl`,cancelButton:`m3-btn-tonal font-bold !px-5 !py-2.5 !rounded-xl`},didOpen:e=>{let t=e.querySelector(`#late-dropzone`),n=e.querySelector(`#late-file-input`),r=e.querySelector(`#late-preview-chip`),i=e.querySelector(`#late-thumb`),o=e.querySelector(`#late-size-info`),u=e.querySelector(`#late-remove-staged`),d=async e=>{if(!c(e)){a(`শুধুমাত্র ছবির ফাইল (JPG, PNG, WebP) গ্রহণযোগ্য`,`error`);return}try{a(`মেমো অপ্টিমাইজ হচ্ছে...`,`info`);let n=await l(e);s=n.blob,n.dataUrl,i&&(i.src=n.dataUrl),o&&(o.innerText=`WebP • ${n.sizeKB} KB (ক্রিস্টাল ক্লিয়ার)`),r&&r.classList.remove(`hidden`),t&&t.classList.add(`hidden`)}catch(e){console.error(`Late compression error:`,e),a(e.message||`ছবি প্রসেস করতে ব্যর্থ`,`error`)}};e.onpaste=e=>{let t=e.clipboardData?.items;if(t){for(let n=0;n<t.length;n++)if(t[n].type&&t[n].type.indexOf(`image`)!==-1){let r=t[n].getAsFile();if(r){e.preventDefault(),a(`ক্লিপবোর্ড থেকে ছবি গ্রহণ করা হয়েছে`,`info`),d(r);break}}}},t&&n&&(t.onclick=()=>n.click(),n.onchange=e=>{let t=e.target.files?.[0];t&&d(t)},t.ondragover=e=>{e.preventDefault(),t.classList.add(`border-amber-400`)},t.ondragleave=()=>{t.classList.remove(`border-amber-400`)},t.ondrop=e=>{e.preventDefault(),t.classList.remove(`border-amber-400`);let n=e.dataTransfer?.files?.[0];n&&d(n)}),u&&(u.onclick=()=>{s=null,r&&r.classList.add(`hidden`),t&&t.classList.remove(`hidden`),n&&(n.value=``)})},preConfirm:async()=>{if(!s)return d.default.showValidationMessage(`অনুগ্রহ করে আগে একটি মেমোর ছবি নির্বাচন করুন`),!1;try{d.default.showLoading();let n=await u(s,f,e);if(!n.success||!n.url)throw Error(n.error||`আপলোড ব্যর্থ হয়েছে`);return await t.update(e,{memoPhotoUrl:n.url,memoSource:`offline_scan`}),n.url}catch(e){return console.error(`Late upload error:`,e),d.default.showValidationMessage(e.message||`মেমো সেভ করতে সমস্যা হয়েছে`),!1}}}),typeof o==`function`&&o()}export{g as openLateMemoUploadModal,m as openMemoViewerModal};
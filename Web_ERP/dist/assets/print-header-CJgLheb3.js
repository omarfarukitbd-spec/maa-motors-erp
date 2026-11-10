import"./rolldown-runtime-Dd_uD5pT.js";import{n as e}from"./vendor-ui-n4g2UPZQ.js";import{n as t,r as n}from"./vendor-excel-Cd8Spm_A.js";function r(e){return e==null?``:String(e).replace(/&/g,`&amp;`).replace(/</g,`&lt;`).replace(/>/g,`&gt;`).replace(/"/g,`&quot;`).replace(/'/g,`&#039;`)}function i(e){return e==null||e===``||isNaN(e)?``:Number(e).toLocaleString(`en-IN`)}function a(e){return e&&parseFloat(e.toString().replace(/,/g,``))||0}function o(e){let t=e.value.replace(/[^0-9.]/g,``);e.value=t?i(t):``}function s(e,t=2){if(e==null||isNaN(e))return 0;let n=10**t;return Math.round((e+2**-52)*n)/n}window.escapeHTML=r,window.formatAmountWithComma=i,window.parseAmount=a,window.handleNumberInput=o,window.safeRound=s;function c(){try{let e=new Date;return new Intl.DateTimeFormat(`en-CA`,{timeZone:`Asia/Dhaka`,year:`numeric`,month:`2-digit`,day:`2-digit`}).format(e)}catch{let e=new Date;return`${e.getFullYear()}-${String(e.getMonth()+1).padStart(2,`0`)}-${String(e.getDate()).padStart(2,`0`)}`}}function l(e){if(!e)return``;let t=typeof e.toDate==`function`?e.toDate():new Date(e);return isNaN(t.getTime())?``:`${String(t.getDate()).padStart(2,`0`)}/${String(t.getMonth()+1).padStart(2,`0`)}/${t.getFullYear()}`}function u(e){if(!e)return c();if(e instanceof Date)return isNaN(e.getTime())?c():`${e.getFullYear()}-${String(e.getMonth()+1).padStart(2,`0`)}-${String(e.getDate()).padStart(2,`0`)}`;let t=String(e).trim();if(/^\d{4}-\d{2}-\d{2}$/.test(t))return t;if(/^\d{2}\/\d{2}\/\d{4}$/.test(t)){let[e,n,r]=t.split(`/`);return`${r}-${n}-${e}`}let n=new Date(e);return isNaN(n.getTime())?c():`${n.getFullYear()}-${String(n.getMonth()+1).padStart(2,`0`)}-${String(n.getDate()).padStart(2,`0`)}`}function d(e){if(!e)return``;let t=String(e).trim();if(/^\d{2}\/\d{2}\/\d{4}$/.test(t))return t;if(/^\d{4}-\d{2}-\d{2}$/.test(t)){let[e,n,r]=t.split(`-`);return`${r}/${n}/${e}`}let n=new Date(e);return isNaN(n.getTime())?t:`${String(n.getDate()).padStart(2,`0`)}/${String(n.getMonth()+1).padStart(2,`0`)}/${n.getFullYear()}`}function f(e){return d(e)}function p(e,t=!1){if(!e)return``;let n;if(e instanceof Date)n=e;else if(typeof e?.toDate==`function`)n=e.toDate();else{let t=String(e).trim();if(/^\d{4}-\d{2}-\d{2}$/.test(t)){let[e,r,i]=t.split(`-`).map(Number);n=new Date(e,r-1,i)}else if(/^\d{2}\/\d{2}\/\d{4}$/.test(t)){let[e,r,i]=t.split(`/`).map(Number);n=new Date(i,r-1,e)}else n=new Date(e)}if(!n||isNaN(n.getTime()))return``;let r=n.getDay();return(t?[`রবি`,`সোম`,`মঙ্গল`,`বুধ`,`বৃহঃ`,`শুক্র`,`শনি`]:[`রবিবার`,`সোমবার`,`মঙ্গলবার`,`বুধবার`,`বৃহস্পতিবার`,`শুক্রবার`,`শনিবার`])[r]||``}function m(e,t={}){let n=d(e);if(!n)return``;let r=p(e,t.short||!1);if(!r)return n;if(t.inline)return`${n} (${r})`;let i=t.subClass||`text-[10px] text-slate-400 font-medium`,a=t.subStyle||`font-size: 8px; color: #64748b; font-weight: 600; line-height: 1.1; font-family: "Hind Siliguri", sans-serif;`;return t.isPrint?`<div style="font-weight: 700; white-space: nowrap;">${n}</div><div style="${a} white-space: nowrap;">${r}</div>`:`<div class="leading-tight"><span class="font-bold">${n}</span><div class="${i}">${r}</div></div>`}window.getTodayLocalDateString=c,window.formatTimestampToAppDate=l,window.toDBDate=u,window.toDisplayDate=d,window.formatAppDate=f,window.getDayOfWeekBangla=p,window.formatAppDateWithDay=m,e();function h(e,t=`success`,n=null){let r={success:`fa-circle-check text-emerald-400`,error:`fa-circle-xmark text-red-400`,warning:`fa-triangle-exclamation text-amber-400`,info:`fa-circle-info text-blue-400`},i=document.getElementById(`toast-container`)||g(),a=n?`<span class="px-2 py-0.5 rounded bg-blue-500/20 text-blue-300 font-black border border-blue-500/30 text-[10px] uppercase">${n}</span>`:``,o=document.createElement(`div`);o.className=`flex items-center gap-2.5 bg-slate-900/95 text-white border border-slate-700/80 px-3.5 py-2.5 rounded-xl shadow-2xl backdrop-blur-md transition-all transform translate-y-2 opacity-0 font-bn text-xs font-bold pointer-events-auto max-w-md`,o.innerHTML=`<i class="fa-solid ${r[t]||r.info} text-base shrink-0"></i> ${a} <span>${e}</span>`,i.appendChild(o),requestAnimationFrame(()=>{o.classList.remove(`translate-y-2`,`opacity-0`),o.classList.add(`translate-y-0`,`opacity-100`)}),setTimeout(()=>{o.classList.remove(`translate-y-0`,`opacity-100`),o.classList.add(`-translate-y-2`,`opacity-0`),setTimeout(()=>o.remove(),300)},3e3)}typeof window<`u`&&(window.showToast=h);function g(){let e=document.getElementById(`toast-container`);return e||(e=document.createElement(`div`),e.id=`toast-container`,e.className=`fixed top-4 right-4 z-[999999] flex flex-col gap-2.5 pointer-events-none max-w-sm w-full px-4 sm:px-0`,document.body.appendChild(e)),e}function _(){document.body.addEventListener(`click`,e=>{let t=e.target.closest(`button, .m3-btn-primary, .m3-btn-tonal, .m3-btn-icon`);if(!t)return;navigator.vibrate&&!t.disabled&&navigator.vibrate(12);let n=t.dataset.toastMsg,r=t.dataset.boxContext;n&&h(n,`info`,r||`অ্যাকশন`)},{passive:!0})}function v(e,t=5){if(!e)return;let n=``;for(let e=0;e<t;e++)n+=`
            <tr class="animate-pulse border-b border-slate-800/40">
                <td class="py-4 px-4"><div class="h-3 bg-slate-800 rounded-md w-16"></div></td>
                <td class="py-4 px-4">
                    <div class="flex items-center gap-3">
                        <div class="w-8 h-8 rounded-full bg-slate-800 shrink-0"></div>
                        <div class="space-y-1.5 flex-grow">
                            <div class="h-3.5 bg-slate-800 rounded-md w-3/4"></div>
                            <div class="h-2.5 bg-slate-800/60 rounded-md w-1/2"></div>
                        </div>
                    </div>
                </td>
                <td class="py-4 px-4"><div class="h-3 bg-slate-800/60 rounded-md w-24"></div></td>
                <td class="py-4 px-4"><div class="h-3 bg-slate-800/60 rounded-md w-20"></div></td>
                <td class="py-4 px-4 text-right"><div class="h-4 bg-slate-800 rounded-md w-16 ml-auto"></div></td>
                <td class="py-4 px-4 text-center"><div class="h-7 bg-slate-800/80 rounded-lg w-24 mx-auto"></div></td>
            </tr>`;e.innerHTML=n}function y(){let e=()=>{let e=navigator.onLine,t=document.getElementById(`network-sync-badge`);t.innerHTML=e?`<span class="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse block"></span><span class="hidden md:inline text-[10px] font-black uppercase text-emerald-400">অনলাইন</span>`:`<span class="w-2.5 h-2.5 rounded-full bg-red-500 block"></span><span class="hidden md:inline text-[10px] font-black uppercase text-red-400">অফলাইন</span>`,t.className=e?`w-8 h-8 md:w-auto md:h-auto md:px-3 md:py-1 md:gap-1.5 flex items-center justify-center rounded-full bg-emerald-500/10 border border-emerald-500/20 shadow-sm cursor-default`:`w-8 h-8 md:w-auto md:h-auto md:px-3 md:py-1 md:gap-1.5 flex items-center justify-center rounded-full bg-red-500/10 border border-red-500/20 shadow-sm cursor-default`,t.title=e?`অনলাইন — Sync Active`:`অফলাইন — Local Mode`};window.addEventListener(`online`,()=>{e(),h(`অনলাইন কানেকশন পুনরুদ্ধার হয়েছে!`,`success`,`নেটওয়ার্ক`)}),window.addEventListener(`offline`,()=>{e(),h(`ইন্টারনেট সংযোগ বিচ্ছিন্ন! অফলাইন মোড সক্রিয়।`,`warning`,`নেটওয়ার্ক`)}),e()}function b(e,r=`export.xlsx`){let i=document.getElementById(e);if(!i)return h(`টেবিল ডাটা পাওয়া যায়নি!`,`warning`,`এক্সপোর্ট`);try{let e=t.book_new(),a=t.table_to_sheet(i,{raw:!0});t.book_append_sheet(e,a,`Sheet1`),n(e,r),h(`এক্সেল ডাটা সফলভাবে ডাউনলোড হয়েছে!`,`success`,`এক্সপোর্ট`)}catch(e){console.error(`Excel Export Error:`,e),h(`এক্সপোর্ট করতে সমস্যা হয়েছে!`,`error`,`এক্সপোর্ট`)}}function x(e){if(!e)return;let t=Array.from(e.querySelectorAll(`img`)),n=0;if(t.length===0){setTimeout(()=>window.print(),100);return}t.forEach(e=>{e.complete?(n++,n===t.length&&setTimeout(()=>window.print(),100)):e.onload=e.onerror=()=>{n++,n===t.length&&setTimeout(()=>window.print(),100)}})}typeof window<`u`&&(window.exportTableToExcel=b);function S(){let e=()=>{if(!window.AppState||!window.AppState.permissions)return;let e=window.AppState.permissions;document.querySelectorAll(`[data-perm]`).forEach(t=>{let n=t.getAttribute(`data-perm`);e[n]===!1?(t.style.cssText=`display: none !important;`,t.classList.contains(`nav-item`)||(t.innerHTML=``)):t.style.cssText=``})};e(),new MutationObserver(()=>{e()}).observe(document.body,{childList:!0,subtree:!0})}function C(e){if(e==null)return`০০০১`;let t=String(e).trim(),n=[`০`,`১`,`২`,`৩`,`৪`,`৫`,`৬`,`৭`,`৮`,`৯`];return/^\d+$/.test(t)?(t.length<4?t.padStart(4,`0`):t).replace(/\d/g,e=>n[Number(e)]):t.replace(/\d/g,e=>n[Number(e)])}function w(e,t=`#ffdf00`,n=`#ffffff`){if(!e)return``;let i=e.match(/^(.*?)\s*(\(.*?\))\s*$/);return i?`<span style="color: ${t} !important;">${r(i[1].trim())}</span> <span style="color: ${n} !important; font-size: 0.88em; font-weight: 700;">${r(i[2].trim())}</span>`:`<span style="color: ${t} !important;">${r(e)}</span>`}function T(e={},t={}){let n={},i={};e&&(e.shopName!==void 0||e.shopLogo!==void 0||e.shopPhone!==void 0||e.shopAddress!==void 0)?(n=e,i=t||{}):t&&(t.shopName!==void 0||t.shopLogo!==void 0||t.shopPhone!==void 0||t.shopAddress!==void 0)?(n=t,i=e||{}):(n=e||{},i=t||{});let a=i.title||`DUBAI REMITTANCE BOOK`,o=i.pageLabel||`রেজিস্টার খাতা পাতা`,s=C(i.pageNo||i.sheetNo||i.invoiceNo||i.subtitle||`০০০১`),c=!!i.hideRightPill,l=n.shopName||`মেসার্স মা মোটরস (M/S. MAA-MOTOR'S)`,u=n.shopOwner||`মোহাম্মদ এমরান (Mohammed Amran)`,d=r(n.shopAddress||`দোকান নং-২২, রহমান টাওয়ার, ১ম ফ্লোর / ৫ম ফ্লোর, মুরাদপুর, হাটহাজারী রোড, চট্টগ্রাম।`),f=r(n.shopPhone||`01819-397669, 01815-707934`),p=n.shopLogo||`/shop-official-logo.png`,m=w(l,`#ffdf00`,`#ffffff`),h=w(u,`#ffdf00`,`#ffffff`),g=a.length>25?`9.5px`:a.length>20?`10.5px`:`11.5px`;return`
        <div class="mother-print-header" style="
            background: linear-gradient(90deg, #024ea2 0%, #0056b8 36%, #00459e 70%, #002d72 100%) !important;
            border-radius: 14px;
            padding: 9px 14px 7px 14px;
            color: #ffffff !important;
            position: relative;
            overflow: hidden;
            box-shadow: 0 3px 12px rgba(2, 78, 162, 0.25);
            margin-bottom: 8px;
            box-sizing: border-box !important;
            font-family: 'Anek Bangla', 'Hind Siliguri', 'Inter', system-ui, -apple-system, sans-serif !important;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
        ">
            <!-- Decorative Luminous Accent Waves at bottom right corner (Image 1) -->
            <div style="position: absolute; right: 0; bottom: 0; width: 155px; height: 46px; background: radial-gradient(ellipse at bottom right, rgba(236, 72, 153, 0.6) 0%, rgba(6, 182, 212, 0.5) 45%, transparent 75%); pointer-events: none; z-index: 1;"></div>

            <!-- Top Row: Logo, Shop Details, Car Brands, and Dynamic Badge -->
            <div style="display: flex; align-items: center; justify-content: space-between; gap: 8px; position: relative; z-index: 2;">
                <!-- Left: Circular App Logo from Settings -->
                <div style="display: flex; align-items: center; gap: 8px; flex-shrink: 0;">
                    <div style="width: 60px; height: 60px; min-width: 60px; background: #ffffff !important; border-radius: 50%; display: flex; align-items: center; justify-content: center; overflow: hidden; border: 2px solid #ffffff; box-shadow: 0 2px 6px rgba(0,0,0,0.25); padding: 1px;">
                        <img src="${p}" alt="Maa Motors Official Logo" style="width: 100%; height: 100%; object-fit: contain; border-radius: 50%; display: block;" />
                    </div>
                    <div style="width: 1.5px; height: 52px; background: rgba(255, 255, 255, 0.45); margin: 0 2px;"></div>
                </div>

                <!-- Center: Business Branding -->
                <div style="flex-grow: 1; min-width: 0; padding-left: 2px;">
                    <!-- Shop Name: Bengali in Golden Yellow, English in White -->
                    <h1 style="font-size: 20.5px; font-weight: 800 !important; margin: 0 0 2px 0; text-shadow: 0 1px 3px rgba(0,0,0,0.5); letter-spacing: -0.2px; line-height: 1.15; font-family: 'Anek Bangla', 'Hind Siliguri', sans-serif !important; white-space: nowrap;">
                        ${m}
                    </h1>
                    <!-- Subtitle in White Rounded Pill with Navy Text -->
                    <div style="display: inline-block; background: #ffffff !important; color: #001a70 !important; border-radius: 14px; padding: 1.5px 8.5px; font-size: 8.5px; font-weight: 700 !important; margin-bottom: 3px; box-shadow: 0 1px 2px rgba(0,0,0,0.15); line-height: 1.25; font-family: 'Anek Bangla', sans-serif !important; white-space: nowrap;">
                        জাতীয় জাপানি কার ও মাইক্রোবাসের রিকন্ডিশন ইঞ্জিন ও পার্টস বিক্রয় করা হয়।
                    </div>
                    <!-- Proprietor with Red Badge & Two-Tone Name -->
                    <div style="display: flex; align-items: center; gap: 5px; font-size: 11.5px; line-height: 1.2;">
                        <span style="background: #e11d48 !important; color: #ffffff !important; border-radius: 4px; padding: 1px 6px; font-size: 9.5px; font-weight: 800 !important; letter-spacing: 0.2px; white-space: nowrap; font-family: 'Anek Bangla', sans-serif !important;">
                            প্রোপাইটর:
                        </span>
                        <span style="text-shadow: 0 1px 2px rgba(0,0,0,0.3); font-size: 11.5px; font-weight: 800 !important; white-space: nowrap; font-family: 'Anek Bangla', 'Hind Siliguri', sans-serif !important;">
                            ${h}
                        </span>
                    </div>
                </div>

                <!-- Middle-Right: Pure SVG Japanese Car Brand Vectors (Mitsubishi & Toyota) -->
                <div style="display: flex; align-items: center; gap: 12px; margin: 0 8px 0 14px; flex-shrink: 0;">
                    <!-- Mitsubishi Brand Vector -->
                    <div style="display: flex; flex-direction: column; align-items: center; justify-content: center; text-align: center;">
                        <svg width="23" height="19" viewBox="0 0 30 25" fill="none" xmlns="http://www.w3.org/2000/svg" style="display: block;">
                            <polygon points="15,0 20,8.66 15,17.32 10,8.66" fill="#e11d48"/>
                            <polygon points="10,8.66 15,17.32 10,25.98 5,17.32" fill="#e11d48"/>
                            <polygon points="20,8.66 25,17.32 20,25.98 15,17.32" fill="#e11d48"/>
                        </svg>
                        <span style="font-size: 6px; font-weight: 800; color: #ffffff; letter-spacing: 0.6px; margin-top: 1px; font-family: 'Inter', sans-serif;">MITSUBISHI</span>
                    </div>

                    <!-- Toyota Brand Vector -->
                    <div style="display: flex; flex-direction: column; align-items: center; justify-content: center; text-align: center;">
                        <svg width="23" height="18" viewBox="0 0 32 24" fill="none" xmlns="http://www.w3.org/2000/svg" style="display: block;">
                            <ellipse cx="16" cy="12" rx="15" ry="11" stroke="#ffffff" stroke-width="1.8"/>
                            <ellipse cx="16" cy="8.5" rx="9" ry="5.5" stroke="#ffffff" stroke-width="1.5"/>
                            <ellipse cx="16" cy="12" rx="4.5" ry="9" stroke="#ffffff" stroke-width="1.5"/>
                        </svg>
                        <span style="font-size: 6px; font-weight: 800; color: #ffffff; letter-spacing: 0.6px; margin-top: 1px; font-family: 'Inter', sans-serif;">TOYOTA</span>
                    </div>
                </div>

                <!-- Separator line before Category badge -->
                <div style="width: 1.5px; height: 50px; background: rgba(255, 255, 255, 0.45); margin: 0 4px; flex-shrink: 0;"></div>

                <!-- Far-Right: Dynamic Category Badge & Sheet Indicator (Image 3) -->
                ${c?``:`
                <div style="text-align: right; flex-shrink: 0; min-width: 140px;">
                    <!-- Category Title in White Pill with Red Border -->
                    <div style="
                        background: #ffffff !important;
                        color: #001a70 !important;
                        border: 2.2px solid #ef4444 !important;
                        border-radius: 7px;
                        padding: 3.5px 12px;
                        font-size: ${g};
                        font-weight: 900 !important;
                        letter-spacing: 0.4px;
                        text-align: center;
                        box-shadow: 0 1px 4px rgba(0,0,0,0.18);
                        white-space: nowrap;
                        font-family: 'Inter', 'Segoe UI', Arial, sans-serif !important;
                    ">
                        ${a}
                    </div>

                    <!-- Register Page / Sheet Number Indicator -->
                    <div style="display: flex; align-items: center; justify-content: flex-end; gap: 4px; margin-top: 3.5px;">
                        <span style="color: #ffffff !important; font-size: 10px; font-weight: 700 !important; text-shadow: 0 1px 2px rgba(0,0,0,0.3); font-family: 'Anek Bangla', sans-serif !important; white-space: nowrap;">
                            ${o}:
                        </span>
                        <span style="
                            background: #ffdf00 !important;
                            color: #000000 !important;
                            border-radius: 12px;
                            padding: 1px 9px;
                            font-size: 11px;
                            font-weight: 900 !important;
                            font-family: 'Anek Bangla', 'Inter', monospace !important;
                            line-height: 1.2;
                            white-space: nowrap;
                            box-shadow: 0 1px 2px rgba(0,0,0,0.2);
                        ">
                            ${s}
                        </span>
                    </div>
                </div>
                `}
            </div>

            <!-- Bottom Row: Floating Light-Blue Ribbon Contact Strip (Image 1) -->
            <div style="
                background: linear-gradient(90deg, #ffffff 0%, #e0f2fe 50%, #ffffff 100%) !important;
                border-radius: 18px;
                padding: 2.5px 14px;
                margin-top: 6px;
                display: flex;
                justify-content: space-between;
                align-items: center;
                color: #002d72 !important;
                font-size: 9px;
                font-weight: 700 !important;
                box-shadow: 0 1px 3px rgba(0,0,0,0.12);
                border: 1px solid #bae6fd;
                position: relative;
                z-index: 2;
                white-space: nowrap;
                font-family: 'Anek Bangla', 'Inter', sans-serif !important;
            ">
                <!-- Left: Location pin + Shop Address + Separator -->
                <div style="display: flex; align-items: center; gap: 5px; overflow: hidden; text-overflow: ellipsis;">
                    <span style="display: inline-flex; align-items: center; justify-content: center; width: 14px; height: 14px; min-width: 14px; background: #fbbf24; border-radius: 50%; color: #dc2626; font-size: 8px;">
                        <svg width="8" height="8" viewBox="0 0 24 24" fill="#dc2626"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/></svg>
                    </span>
                    <span style="color: #0f172a !important; font-weight: 700; font-family: 'Anek Bangla', sans-serif !important;">${d}</span>
                    <span style="color: #0284c7; margin: 0 8px; font-weight: 400;">|</span>
                </div>

                <!-- Right: Phone icon + Mobile numbers -->
                <div style="display: flex; align-items: center; gap: 5px; flex-shrink: 0;">
                    <span style="display: inline-flex; align-items: center; justify-content: center; width: 14px; height: 14px; min-width: 14px; background: #fbbf24; border-radius: 50%; color: #dc2626; font-size: 8px;">
                        <svg width="8" height="8" viewBox="0 0 24 24" fill="#16a34a"><path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z"/></svg>
                    </span>
                    <span style="color: #002d72 !important; font-family: 'Anek Bangla', 'Inter', sans-serif !important; font-weight: 700;"><strong style="font-weight: 800;">মোবাইল:</strong> ${f}</span>
                </div>
            </div>
        </div>
    `}export{i as _,S as a,s as b,x as c,l as d,p as f,r as g,d as h,y as i,f as l,u as m,b as n,v as o,c as p,_ as r,h as s,T as t,m as u,o as v,a as y};
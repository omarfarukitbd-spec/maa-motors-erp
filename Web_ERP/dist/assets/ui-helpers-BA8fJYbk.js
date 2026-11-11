import"./rolldown-runtime-Dd_uD5pT.js";import{n as e}from"./vendor-ui-n4g2UPZQ.js";import{n as t,r as n}from"./vendor-excel-Cd8Spm_A.js";function r(e){return e==null?``:String(e).replace(/&/g,`&amp;`).replace(/</g,`&lt;`).replace(/>/g,`&gt;`).replace(/"/g,`&quot;`).replace(/'/g,`&#039;`)}function i(e){return e==null||e===``||isNaN(e)?``:Number(e).toLocaleString(`en-IN`)}function a(e){return e&&parseFloat(e.toString().replace(/,/g,``))||0}function o(e){let t=e.value.replace(/[^0-9.]/g,``);e.value=t?i(t):``}function s(e,t=2){if(e==null||isNaN(e))return 0;let n=10**t;return Math.round((e+2**-52)*n)/n}window.escapeHTML=r,window.formatAmountWithComma=i,window.parseAmount=a,window.handleNumberInput=o,window.safeRound=s;function c(e){if(e==null)return``;let t=String(e).trim(),n=[`০`,`১`,`২`,`৩`,`৪`,`৫`,`৬`,`৭`,`৮`,`৯`];return/^\d+$/.test(t)?(t.length<4?t.padStart(4,`0`):t).replace(/\d/g,e=>n[Number(e)]):t.replace(/\d/g,e=>n[Number(e)])}function l(e){let t=e.pageNo||e.sheetNo||e.invoiceNo;if(t)return{mode:`pill`,label:e.pageLabel||`রেজিস্টার খাতা পাতা`,value:c(t)};let n=e.dateRangeStr?String(e.dateRangeStr).trim():``;if(n){let t=e.pageLabel||`সময়কাল`,r=n;return/^তারিখ\s*[:ঃ]/i.test(r)?(e.pageLabel||(t=`তারিখ`),r=r.replace(/^তারিখ\s*[:ঃ]\s*/i,``).trim()):/^সময়কাল\s*[:ঃ]/i.test(r)&&(e.pageLabel||(t=`সময়কাল`),r=r.replace(/^সময়কাল\s*[:ঃ]\s*/i,``).trim()),{mode:`pill`,label:t,value:c(r)}}if(e.subtitle)return{mode:`subtitle`,label:``,value:c(e.subtitle)};let r=new Date,i=`${String(r.getDate()).padStart(2,`0`)}/${String(r.getMonth()+1).padStart(2,`0`)}/${r.getFullYear()}`;return{mode:`pill`,label:e.pageLabel||`তারিখ`,value:c(i)}}function u(e,t=``){let n=r(e||`হিসাব বিবরণী`),i=t?r(c(t)):``;return`
        <div style="display:flex; justify-content:space-between; align-items:center; background:linear-gradient(90deg, #eff6ff 0%, #ffffff 100%); border-left:4px solid #024ea2; border-bottom:2px solid #024ea2; border-radius:4px; padding:4px 10px; margin-bottom:8px; font-family:'Anek Bangla','Hind Siliguri','Inter',sans-serif !important; -webkit-print-color-adjust:exact !important; print-color-adjust:exact !important;">
            <div style="font-size:12px; font-weight:800; color:#002d72;">
                মেসার্স মা মোটরস • ${n} <span style="font-size:9.5px; color:#64748b; font-weight:600;">(চলমান পাতা)</span>
            </div>
            ${i?`<div style="font-size:9.5px; font-weight:700; color:#334155;">${i}</div>`:``}
        </div>
    `}function d(e,t=`#ffdf00`,n=`#ffffff`){if(!e)return``;let i=e.match(/^(.*?)\s*(\(.*?\))\s*$/);return i?`<span style="color: ${t} !important;">${r(i[1].trim())}</span> <span style="color: ${n} !important; font-size: 0.88em; font-weight: 700;">${r(i[2].trim())}</span>`:`<span style="color: ${t} !important;">${r(e)}</span>`}function f(e={},t={}){let n={},i={};e&&(e.shopName!==void 0||e.shopLogo!==void 0||e.shopPhone!==void 0||e.shopAddress!==void 0)?(n=e,i=t||{}):t&&(t.shopName!==void 0||t.shopLogo!==void 0||t.shopPhone!==void 0||t.shopAddress!==void 0)?(n=t,i=e||{}):(n=e||{},i=t||{});let a=i.title||`ডুবাই টাকা পাঠানোর হিসাব বুক`,o=r(a),s=!!i.hideRightPill,c=l(i),u=n.shopName||`মেসার্স মা মোটরস (M/S. MAA-MOTOR'S)`,f=n.shopOwner||`মোহাম্মদ এমরান (Mohammed Amran)`,p=r(n.shopAddress||`দোকান নং-২২, রহমান টাওয়ার, ১ নং রেইল গেইট, মুরাদপুর, হাটহাজারী রোড, চট্টগ্রাম।`),m=r(n.shopPhone||`01819-397669, 01815-707934`),h=n.shopLogo||`/shop-official-logo.png`,g=d(u,`#ffdf00`,`#ffffff`),_=d(f,`#ffdf00`,`#ffffff`),v=/[^\x00-\x7F]/.test(a)?`'Anek Bangla', 'Hind Siliguri', sans-serif !important;`:`'Inter', 'Segoe UI', Arial, sans-serif !important;`,y=a.length>32?`9.5px`:a.length>25?`10px`:a.length>18?`11px`:`11.5px`,b=c.value.length>22?`9px`:c.value.length>14?`10px`:`11px`,x=c.value.length>22?`1.5px 7px`:`1px 9px`;return`
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
                        <img src="${h}" alt="Maa Motors Official Logo" style="width: 100%; height: 100%; object-fit: contain; border-radius: 50%; display: block;" />
                    </div>
                    <div style="width: 1.5px; height: 52px; background: rgba(255, 255, 255, 0.45); margin: 0 2px;"></div>
                </div>

                <!-- Center: Business Branding -->
                <div style="flex-grow: 1; min-width: 0; padding-left: 2px;">
                    <!-- Shop Name: Bengali in Golden Yellow, English in White -->
                    <h1 style="font-size: 20.5px; font-weight: 800 !important; margin: 0 0 2px 0; text-shadow: 0 1px 3px rgba(0,0,0,0.5); letter-spacing: -0.2px; line-height: 1.15; font-family: 'Anek Bangla', 'Hind Siliguri', sans-serif !important; white-space: nowrap;">
                        ${g}
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
                            ${_}
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
                ${s?``:`
                <div style="text-align: right; flex-shrink: 0; min-width: 145px;">
                    <!-- Category Title in White Pill with Red Border -->
                    <div style="
                        background: #ffffff !important;
                        color: #001a70 !important;
                        border: 2.2px solid #ef4444 !important;
                        border-radius: 7px;
                        padding: 3.5px 10px;
                        font-size: ${y};
                        font-weight: 900 !important;
                        letter-spacing: 0.2px;
                        text-align: center;
                        box-shadow: 0 1px 4px rgba(0,0,0,0.18);
                        white-space: nowrap;
                        font-family: ${v};
                    ">
                        ${o}
                    </div>

                    <!-- Register Page / Sheet Number Indicator -->
                    ${c.mode===`pill`?`
                    <div style="display: flex; align-items: center; justify-content: flex-end; gap: 4px; margin-top: 3.5px;">
                        <span style="color: #ffffff !important; font-size: 10px; font-weight: 700 !important; text-shadow: 0 1px 2px rgba(0,0,0,0.3); font-family: 'Anek Bangla', sans-serif !important; white-space: nowrap;">
                            ${r(c.label)}:
                        </span>
                        <span style="
                            background: #ffdf00 !important;
                            color: #000000 !important;
                            border-radius: 12px;
                            padding: ${x};
                            font-size: ${b};
                            font-weight: 900 !important;
                            font-family: 'Anek Bangla', 'Inter', monospace !important;
                            line-height: 1.2;
                            white-space: nowrap;
                            box-shadow: 0 1px 2px rgba(0,0,0,0.2);
                        ">
                            ${r(c.value)}
                        </span>
                    </div>
                    `:`
                    <div style="color: #ffdf00 !important; font-size: 9px; font-weight: 700 !important; text-shadow: 0 1px 2px rgba(0,0,0,0.3); font-family: 'Anek Bangla', sans-serif !important; white-space: nowrap; margin-top: 3.5px;">
                        ${r(c.value)}
                    </div>
                    `}
                </div>
                `}
            </div>

            <!-- Bottom Row: Floating Light-Blue Ribbon Contact Strip (Image 1) -->
            <div style="
                background: linear-gradient(90deg, #ffffff 0%, #e0f2fe 50%, #ffffff 100%) !important;
                border-radius: 9999px;
                padding: 3px 14px;
                margin-top: 6px;
                display: flex;
                justify-content: space-between;
                align-items: center;
                color: #002d72 !important;
                font-size: 9px;
                font-weight: 700 !important;
                box-shadow: 0 1px 4px rgba(0,0,0,0.12);
                border: 1px solid #7dd3fc;
                position: relative;
                z-index: 2;
                white-space: nowrap;
                font-family: 'Anek Bangla', 'Inter', sans-serif !important;
            ">
                <!-- Left: Location pin + Shop Address + Separator -->
                <div style="display: flex; align-items: center; gap: 6px; overflow: hidden; text-overflow: ellipsis;">
                    <span style="display: inline-flex; align-items: center; justify-content: center; width: 17px; height: 17px; min-width: 17px; background: #ffd700; border-radius: 50%; box-shadow: 0 1px 2px rgba(0,0,0,0.18); vertical-align: middle;">
                        <svg width="9.5" height="9.5" viewBox="0 0 24 24" fill="#dc2626"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/></svg>
                    </span>
                    <span style="color: #0f172a !important; font-weight: 700; font-family: 'Anek Bangla', sans-serif !important; font-size: 9px; line-height: 1; vertical-align: middle;">${p}</span>
                    <span style="color: #0284c7; margin: 0 6px; font-weight: 400;">|</span>
                </div>

                <!-- Right: Phone icon + Mobile numbers -->
                <div style="display: flex; align-items: center; gap: 6px; flex-shrink: 0;">
                    <span style="display: inline-flex; align-items: center; justify-content: center; width: 17px; height: 17px; min-width: 17px; background: #ffd700; border-radius: 50%; box-shadow: 0 1px 2px rgba(0,0,0,0.18); vertical-align: middle;">
                        <svg width="9.5" height="9.5" viewBox="0 0 24 24" fill="#16a34a"><path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z"/></svg>
                    </span>
                    <span style="color: #002d72 !important; font-family: 'Anek Bangla', 'Inter', sans-serif !important; font-weight: 700; font-size: 9px; line-height: 1; vertical-align: middle;"><strong style="font-weight: 800;">মোবাইল:</strong> ${m}</span>
                </div>
            </div>
        </div>
    `}var p=`
@page { size: A4 portrait; margin: 0 !important; }
*, *::before, *::after {
    -webkit-print-color-adjust: exact !important;
    print-color-adjust: exact !important;
    box-sizing: border-box;
}
html, body {
    margin: 0 !important; padding: 0 !important;
    background: #fff !important; color: #0f172a !important;
    width: 100% !important; overflow: visible !important;
    font-family: 'Anek Bangla', 'Hind Siliguri', 'Inter', -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif !important;
}
table {
    border-collapse: collapse !important;
    width: 100% !important;
    table-layout: auto !important;
}
thead { display: table-header-group !important; }
tfoot { display: table-footer-group !important; }
tr {
    page-break-inside: avoid !important;
    break-inside: avoid !important;
}
tbody.print-row-group {
    page-break-inside: avoid !important;
    break-inside: avoid !important;
}
.data-table { border: 1px solid #cbd5e1 !important; }
.data-table th, .data-table td {
    border: 1px solid #cbd5e1 !important;
    padding: 4px !important;
    line-height: 1.3 !important;
    -webkit-print-color-adjust: exact !important;
    print-color-adjust: exact !important;
}
.print-items-table { border: 1px solid #cbd5e1 !important; }
.print-items-table th, .print-items-table td {
    border: 1px solid #e2e8f0 !important;
    padding: 4px 5px !important;
}
.print-row-no-break,
.signature-last-page-block,
.print-sig-block,
.page-break-avoid,
[data-print-keep-together] {
    page-break-inside: avoid !important;
    break-inside: avoid !important;
}
.spe-page {
    width: 100%;
    max-width: 794px;
    margin: 0 auto;
    box-sizing: border-box;
    background: #ffffff;
    color: #0f172a;
}
`,m=1122,h=1075,g=.88;function _(e=``){let t=String(e||``);if(!/<html[\s>]|<!doctype/i.test(t))return{bodyHtml:t,extractedCss:``};let n=``,r=t.match(/<style[^>]*>([\s\S]*?)<\/style>/gi);r&&(n=r.map(e=>e.replace(/<\/?style[^>]*>/gi,``)).join(`
`));let i=t.match(/<body[^>]*>([\s\S]*?)<\/body>/i);return{bodyHtml:i?i[1]:t.replace(/<!doctype[^>]*>/gi,``).replace(/<\/?(html|head|body)[^>]*>/gi,``),extractedCss:n}}async function v(e,t=1800){if(!e)return;let n=e.defaultView||window;await Promise.all([(async()=>{try{e.fonts&&e.fonts.ready&&await Promise.race([e.fonts.ready,new Promise(e=>setTimeout(e,t))])}catch(e){console.warn(`Print fonts.ready check skipped:`,e)}})(),(async()=>{try{let n=Array.from(e.images||[]).filter(e=>!e.complete);if(n.length===0)return;await Promise.race([Promise.all(n.map(e=>new Promise(t=>{e.addEventListener(`load`,t,{once:!0}),e.addEventListener(`error`,t,{once:!0})}))),new Promise(e=>setTimeout(e,t))])}catch(e){console.warn(`Print image readiness check skipped:`,e)}})()]),await new Promise(e=>{n&&typeof n.requestAnimationFrame==`function`?n.requestAnimationFrame(()=>n.requestAnimationFrame(e)):setTimeout(e,40)})}function y(e){if(!e)return 0;let t=e.ownerDocument?.defaultView||window,n=Math.ceil(e.getBoundingClientRect().height||0);try{let r=t.getComputedStyle(e),i=parseFloat(r.marginTop)||0,a=parseFloat(r.marginBottom)||0;return Math.ceil(n+i+a)}catch(e){return console.warn(`measureOuterHeight style fallback:`,e),n}}function b(e){if(!e)return;let t=e.ownerDocument?.defaultView||window;e.querySelectorAll(`.print-sig-block, .signature-last-page-block, [data-print-sig]`).forEach(e=>{(parseFloat(t.getComputedStyle(e).marginTop)||0)>20&&(e.style.marginTop=`18px`),(parseFloat(t.getComputedStyle(e).paddingTop)||0)>8&&(e.style.paddingTop=`4px`)});try{let n=t.getComputedStyle(e),r=parseFloat(n.paddingTop)||0,i=parseFloat(n.paddingBottom)||0;r>22&&(e.style.paddingTop=`18px`),i>22&&(e.style.paddingBottom=`16px`)}catch(e){console.warn(`Container spacing compaction error:`,e)}}function x({rowHeights:e=[],page1BodyMax:t=760,pageNBodyMax:n=920,totalLastExtra:r=0,sumH:i=0,nearFitTolerance:a=115}){if(!Array.isArray(e)||e.length===0)return[[]];let o=e.reduce((e,t)=>e+Math.max(18,t||24),0);if(o<=t&&o+r<=t+a)return[e.map((e,t)=>t)];let s=[],c=[],l=[],u=0,d=!0;for(let r=0;r<e.length;r++){let i=Math.max(18,e[r]||24),a=d?t:n;u+i>a&&l.length>0&&(s.push(l),c.push(u),l=[],u=0,d=!1),l.push(r),u+=i}l.length>0&&(s.push(l),c.push(u));let f=s.length-1,p=f===0?t:n;if(c[f]+r-p>a){let t=s[f];if(t.length>=2){let i=t[t.length-1];if(Math.max(18,e[i]||24)+r<=n+a)return t.pop(),s.push([i]),s}(i>0||c[f]>p-120)&&s.push([])}return s}function S(e){if(!e)return;let t=e.getBoundingClientRect();Array.from(e.querySelectorAll(`.print-sig-block, .signature-last-page-block`)).forEach(n=>{n.style.pageBreakInside=`avoid`,n.style.breakInside=`avoid`;let r=n.getBoundingClientRect(),i=r.top-t.top,a=r.bottom-t.top,o=Math.floor(Math.max(0,i)/h);if(Math.floor(Math.max(0,a)/1075)>o||i%1075<28){let t=n.previousElementSibling,r=a-(o+1)*h;if(r>0&&r<=52){b(e);return}t&&t.getBoundingClientRect().height<260?(t.style.pageBreakBefore=`always`,t.style.breakBefore=`page`,t.style.marginTop=`0px`,t.style.paddingTop=`20px`):(n.style.marginTop=`0px`,n.style.paddingTop=`32px`)}})}function C(e){if(!e||!e.body)return{adjustedCount:0,mode:`none`};let t=0;Array.from(e.querySelectorAll(`.memo-print-page`)).forEach(e=>{e.style.minHeight=`1070px`,e.style.maxHeight=`1105px`,e.style.overflow=`hidden`});let n=Array.from(e.querySelectorAll(`.spe-page`));if(n.length>0)return n.forEach(e=>{e.style.zoom=``;let n=Math.ceil(e.scrollHeight||0);if(n>1075&&n<=1235&&(b(e),n=Math.ceil(e.scrollHeight||0),n>1075)){let r=Math.max(g,1069/n);e.style.zoom=r.toFixed(4),t++}}),{adjustedCount:t,mode:`spe-pages`};if(e.querySelector(`.print-pos, .pos-wrapper`))return{adjustedCount:0,mode:`pos-skip`};let r=Array.from(e.body.children).filter(e=>e.tagName!==`STYLE`&&e.tagName!==`SCRIPT`),i=r.length===1?r[0]:e.body;if(!i)return{adjustedCount:0,mode:`empty`};i.style.zoom=``;let a=Math.ceil(i.scrollHeight||0);if(a>1075&&a<=1235){if(b(i),a=Math.ceil(i.scrollHeight||0),a>1075){let e=Math.max(g,1069/a);i.style.zoom=e.toFixed(4),i.style.margin=`0 auto`,t++}return{adjustedCount:t,mode:`freeflow-autofit`}}return a>1235?(S(i),{adjustedCount:1,mode:`freeflow-multipage-guard`}):{adjustedCount:0,mode:`single-ok`}}var w=`
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Anek+Bangla:wght@400;500;600;700;800;900&family=Hind+Siliguri:wght@400;500;600;700;800;900&family=Inter:wght@400;500;600;700;800;900&display=swap" rel="stylesheet">
<link href="https://fonts.maateen.me/kalpurush/font.css" rel="stylesheet">`;function T(e,t,n){return`<div style="display:flex;justify-content:space-between;align-items:center;font-size:10px;color:#475569;font-weight:700;border-top:1px solid #cbd5e1;padding-top:6px;margin-top:8px;font-family:'Anek Bangla','Hind Siliguri','Inter',sans-serif;">
        <span>${e?`তারিখ: `+e:``}</span>
        <span>পৃষ্ঠা ${t} / ${n}</span>
    </div>`}function E(e){return typeof e==`object`&&e?{html:e.html||``,isGroup:!!(e.isGroup||e.groupHtml)}:{html:String(e||``),isGroup:!1}}function D(e,t){let n=t===`print-items-table`?` style="font-size:10px;"`:``,r=[],i=[],a=()=>{i.length>0&&(r.push(`<tbody${n}>${i.join(``)}</tbody>`),i=[])};return e.forEach(e=>{let t=E(e);t.html&&(t.isGroup?(a(),r.push(`<tbody class="print-row-group"${n}>${t.html}</tbody>`)):i.push(t.html))}),a(),r.join(``)}async function O({rowsArray:e=[],page1HeaderHtml:t=``,repeatHeaderHtml:n=``,page1ExtraHtml:r=``,tableColHeaderHtml:i=``,tableFooterRowsHtml:a=``,summaryHtml:o=``,signatureHtml:s=``,formattedDate:c=``,extraCss:l=``,tableClass:u=`data-table`,tableStyle:d=``,sheetPadding:f=`6px 12px`}){let h=document.getElementById(`__spe_measure_iframe__`);h&&h.remove();let g=document.createElement(`iframe`);g.id=`__spe_measure_iframe__`,g.setAttribute(`aria-hidden`,`true`),g.style.cssText=`position:fixed;left:-9999px;top:0;width:794px;height:${m}px;border:none;visibility:hidden;pointer-events:none;`,document.body.appendChild(g);try{let m=g.contentDocument||g.contentWindow.document,h=(e||[]).map(E).map((e,t)=>`<tbody data-row-idx="${t}">${e.html}</tbody>`).join(``),_=d||`width:100%;border-collapse:collapse;table-layout:auto;margin-top:2px;border:1px solid #cbd5e1;`,b=T(c,1,1);m.open(),m.write(`<!DOCTYPE html><html lang="bn"><head><meta charset="UTF-8">${w}<style>${p}${l}</style></head>
        <body>
            <div data-m="sheet" style="width:794px;box-sizing:border-box;padding:${f};background:#fff;">
                <div data-m="p1h" style="display:flow-root;padding-top:2px;margin-bottom:4px;">${t}</div>
                <div data-m="reph" style="display:flow-root;padding-top:2px;margin-bottom:4px;">${n}</div>
                <div data-m="ext" style="display:flow-root;">${r}</div>
                <table data-m="tbl" style="${_}" class="${u}">
                    ${i}
                    ${h}
                    ${a?`<tbody data-m="tfootrows">${a}</tbody>`:``}
                </table>
                <div data-m="sum" style="display:flow-root;">${o}</div>
                <div data-m="sig" style="display:flow-root;">${s}</div>
                <div data-m="ftr" style="display:flow-root;">${b}</div>
            </div>
        </body></html>`),m.close(),await v(m,1500);let x=m.querySelector(`[data-m="sheet"]`),S=m.defaultView.getComputedStyle(x),C=Math.ceil((parseFloat(S.paddingTop)||0)+(parseFloat(S.paddingBottom)||0)),D=y(m.querySelector(`[data-m="p1h"]`)),O=n?y(m.querySelector(`[data-m="reph"]`)):38,k=r?y(m.querySelector(`[data-m="ext"]`)):0,A=m.querySelector(`[data-m="tbl"] thead`),j=A?Math.ceil(A.getBoundingClientRect().height||0):0,M=m.querySelector(`[data-m="tfootrows"]`),N=M?Math.ceil(M.getBoundingClientRect().height||0):0,P=o?y(m.querySelector(`[data-m="sum"]`)):0,F=s?y(m.querySelector(`[data-m="sig"]`)):0,I=y(m.querySelector(`[data-m="ftr"]`)),L=m.querySelectorAll(`tbody[data-row-idx]`);return{sheetPadV:C,p1HeaderH:D,repeatHeaderH:O,extraH:k,theadH:j,tableFooterH:N,sumH:P,sigH:F,footerH:I,rowHeights:Array.from(L).map(e=>Math.max(18,Math.ceil(e.getBoundingClientRect().height||24)))}}catch(t){return console.error(`Sandbox measurement fallback triggered:`,t),{sheetPadV:18,p1HeaderH:148,repeatHeaderH:48,extraH:0,theadH:34,tableFooterH:0,sumH:o?80:0,sigH:s?95:0,footerH:34,rowHeights:(e||[]).map(()=>28)}}finally{try{g.remove()}catch(e){console.error(`Measure iframe cleanup error:`,e)}}}function k(e,t){let{page1HeaderHtml:n,repeatHeaderHtml:r,tableColHeaderHtml:i,page1ExtraHtml:a=``,tableFooterRowsHtml:o=``,summaryHtml:s=``,signatureHtml:c=``,formattedDate:l=``,tableClass:u=`data-table`,tableStyle:d=``,sheetPadding:f=`6px 12px`,extraPagesCount:p=0}=t,m=e.length+(p||0),h=d||`width:100%;border-collapse:collapse;table-layout:auto;margin-top:2px;border:1px solid #cbd5e1;`,g=u===`print-items-table`?` style="font-size:10px;"`:``;return e.map((t,d)=>{let _=d+1,v=_===1,y=_===e.length&&p===0,b=_===e.length,x=y?``:`page-break-after:always;break-after:always;`,S=D(t,u);!S&&!o&&(S=`<tbody${g}><tr><td colspan="20" style="text-align:center;padding:12px;color:#64748b;font-size:10px;">কোনো এন্ট্রি পাওয়া যায়নি</td></tr></tbody>`);let C=b&&o?`<tbody class="print-row-group"${g}>${o}</tbody>`:``;return`<div class="spe-page" style="${x}width:100%;box-sizing:border-box;background:#ffffff;color:#0f172a;padding:${f};">
            <div style="padding-top:2px;margin-bottom:4px;">${v?n:r}</div>
            ${v&&a?a:``}
            <table style="${h}" class="${u}">
                ${i}
                ${S}
                ${C}
            </table>
            ${b?s+c:``}
            ${T(l,_,m)}
        </div>`}).join(``)}async function A(e){let{rowsArray:t=[],page1HeaderHtml:n=``,repeatHeaderHtml:r=``,tableColHeaderHtml:i=``,page1ExtraHtml:a=``,tableFooterRowsHtml:o=``,summaryHtml:s=``,signatureHtml:c=``,formattedDate:l=``,extraCss:u=``,tableClass:d=`data-table`,tableStyle:f=``,sheetPadding:p=`6px 12px`,extraPagesCount:m=0}=e,g=await O({rowsArray:t,page1HeaderHtml:n,repeatHeaderHtml:r,page1ExtraHtml:a,tableColHeaderHtml:i,tableFooterRowsHtml:o,summaryHtml:s,signatureHtml:c,formattedDate:l,extraCss:u,tableClass:d,tableStyle:f,sheetPadding:p}),_=Math.max(180,h-g.sheetPadV-g.p1HeaderH-g.extraH-g.theadH-g.footerH-12),v=Math.max(260,h-g.sheetPadV-g.repeatHeaderH-g.theadH-g.footerH-12),y=g.tableFooterH+g.sumH+g.sigH,b=x({rowHeights:g.rowHeights,page1BodyMax:_,pageNBodyMax:v,totalLastExtra:y,sumH:g.tableFooterH+g.sumH,nearFitTolerance:115}).map(e=>e.map(e=>t[e]));return{html:k(b,{page1HeaderHtml:n,repeatHeaderHtml:r,tableColHeaderHtml:i,page1ExtraHtml:a,tableFooterRowsHtml:o,summaryHtml:s,signatureHtml:c,formattedDate:l,tableClass:d,tableStyle:f,sheetPadding:p,extraPagesCount:m}),pageCount:b.length}}async function j(e){return(await A({tableClass:`data-table`,...e})).html}async function M(e){let t=await A({tableClass:`print-items-table`,...e}),n=e.extraPagesCount||0;return{html:t.html,stmtPageCount:t.pageCount,totalPageCount:t.pageCount+n,toString(){return this.html}}}async function N(e,t=``,n=`Maa_Motors_Document`){let r=document.getElementById(`__spe_iframe__`);r&&r.remove();let{bodyHtml:i,extractedCss:a}=_(e),o=`${p}\n${a}\n${t||``}`,s=document.createElement(`iframe`);s.id=`__spe_iframe__`,s.setAttribute(`aria-hidden`,`true`),s.style.cssText=`position:fixed;left:-9999px;top:0;width:794px;height:${m}px;border:none;visibility:hidden;pointer-events:none;`,document.body.appendChild(s);let c=s.contentDocument||s.contentWindow.document;c.open(),c.write(`<!DOCTYPE html><html lang="bn"><head><meta charset="UTF-8"><title>${n}</title>${w}<style>${o}</style></head><body>${i}</body></html>`),c.close();let l=document.title,u=()=>{document.title=l;try{s.remove()}catch(e){console.error(`Remove iframe error:`,e)}};try{await v(c,1800),C(c),await v(c,250),n&&(document.title=n),s.contentWindow.focus(),s.contentWindow.print()}catch(e){console.error(`Iframe print fallback to window.print:`,e),window.print()}window.addEventListener(`afterprint`,u,{once:!0}),s.contentWindow&&s.contentWindow.addEventListener(`afterprint`,u,{once:!0}),setTimeout(u,6e3)}function P(){try{let e=new Date;return new Intl.DateTimeFormat(`en-CA`,{timeZone:`Asia/Dhaka`,year:`numeric`,month:`2-digit`,day:`2-digit`}).format(e)}catch{let e=new Date;return`${e.getFullYear()}-${String(e.getMonth()+1).padStart(2,`0`)}-${String(e.getDate()).padStart(2,`0`)}`}}function F(e){if(!e)return``;let t=typeof e.toDate==`function`?e.toDate():new Date(e);return isNaN(t.getTime())?``:`${String(t.getDate()).padStart(2,`0`)}/${String(t.getMonth()+1).padStart(2,`0`)}/${t.getFullYear()}`}function I(e){if(!e)return P();if(e instanceof Date)return isNaN(e.getTime())?P():`${e.getFullYear()}-${String(e.getMonth()+1).padStart(2,`0`)}-${String(e.getDate()).padStart(2,`0`)}`;let t=String(e).trim();if(/^\d{4}-\d{2}-\d{2}$/.test(t))return t;if(/^\d{2}\/\d{2}\/\d{4}$/.test(t)){let[e,n,r]=t.split(`/`);return`${r}-${n}-${e}`}let n=new Date(e);return isNaN(n.getTime())?P():`${n.getFullYear()}-${String(n.getMonth()+1).padStart(2,`0`)}-${String(n.getDate()).padStart(2,`0`)}`}function L(e){if(!e)return``;let t=String(e).trim();if(/^\d{2}\/\d{2}\/\d{4}$/.test(t))return t;if(/^\d{4}-\d{2}-\d{2}$/.test(t)){let[e,n,r]=t.split(`-`);return`${r}/${n}/${e}`}let n=new Date(e);return isNaN(n.getTime())?t:`${String(n.getDate()).padStart(2,`0`)}/${String(n.getMonth()+1).padStart(2,`0`)}/${n.getFullYear()}`}function R(e){return L(e)}function z(e,t=!1){if(!e)return``;let n;if(e instanceof Date)n=e;else if(typeof e?.toDate==`function`)n=e.toDate();else{let t=String(e).trim();if(/^\d{4}-\d{2}-\d{2}$/.test(t)){let[e,r,i]=t.split(`-`).map(Number);n=new Date(e,r-1,i)}else if(/^\d{2}\/\d{2}\/\d{4}$/.test(t)){let[e,r,i]=t.split(`/`).map(Number);n=new Date(i,r-1,e)}else n=new Date(e)}if(!n||isNaN(n.getTime()))return``;let r=n.getDay();return(t?[`রবি`,`সোম`,`মঙ্গল`,`বুধ`,`বৃহঃ`,`শুক্র`,`শনি`]:[`রবিবার`,`সোমবার`,`মঙ্গলবার`,`বুধবার`,`বৃহস্পতিবার`,`শুক্রবার`,`শনিবার`])[r]||``}function B(e,t={}){let n=L(e);if(!n)return``;let r=z(e,t.short||!1);if(!r)return n;if(t.inline)return`${n} (${r})`;let i=t.subClass||`text-[10px] text-slate-400 font-medium`,a=t.subStyle||`font-size: 8px; color: #64748b; font-weight: 600; line-height: 1.1; font-family: "Hind Siliguri", sans-serif;`;return t.isPrint?`<div style="font-weight: 700; white-space: nowrap;">${n}</div><div style="${a} white-space: nowrap;">${r}</div>`:`<div class="leading-tight"><span class="font-bold">${n}</span><div class="${i}">${r}</div></div>`}window.getTodayLocalDateString=P,window.formatTimestampToAppDate=F,window.toDBDate=I,window.toDisplayDate=L,window.formatAppDate=R,window.getDayOfWeekBangla=z,window.formatAppDateWithDay=B,e();function V(e,t=`success`,n=null){let r={success:`fa-circle-check text-emerald-400`,error:`fa-circle-xmark text-red-400`,warning:`fa-triangle-exclamation text-amber-400`,info:`fa-circle-info text-blue-400`},i=document.getElementById(`toast-container`)||H(),a=n?`<span class="px-2 py-0.5 rounded bg-blue-500/20 text-blue-300 font-black border border-blue-500/30 text-[10px] uppercase">${n}</span>`:``,o=document.createElement(`div`);o.className=`flex items-center gap-2.5 bg-slate-900/95 text-white border border-slate-700/80 px-3.5 py-2.5 rounded-xl shadow-2xl backdrop-blur-md transition-all transform translate-y-2 opacity-0 font-bn text-xs font-bold pointer-events-auto max-w-md`,o.innerHTML=`<i class="fa-solid ${r[t]||r.info} text-base shrink-0"></i> ${a} <span>${e}</span>`,i.appendChild(o),requestAnimationFrame(()=>{o.classList.remove(`translate-y-2`,`opacity-0`),o.classList.add(`translate-y-0`,`opacity-100`)}),setTimeout(()=>{o.classList.remove(`translate-y-0`,`opacity-100`),o.classList.add(`-translate-y-2`,`opacity-0`),setTimeout(()=>o.remove(),300)},3e3)}typeof window<`u`&&(window.showToast=V);function H(){let e=document.getElementById(`toast-container`);return e||(e=document.createElement(`div`),e.id=`toast-container`,e.className=`fixed top-4 right-4 z-[999999] flex flex-col gap-2.5 pointer-events-none max-w-sm w-full px-4 sm:px-0`,document.body.appendChild(e)),e}function U(){document.body.addEventListener(`click`,e=>{let t=e.target.closest(`button, .m3-btn-primary, .m3-btn-tonal, .m3-btn-icon`);if(!t)return;navigator.vibrate&&!t.disabled&&navigator.vibrate(12);let n=t.dataset.toastMsg,r=t.dataset.boxContext;n&&V(n,`info`,r||`অ্যাকশন`)},{passive:!0})}function W(e,t=5){if(!e)return;let n=``;for(let e=0;e<t;e++)n+=`
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
            </tr>`;e.innerHTML=n}function G(){let e=()=>{let e=navigator.onLine,t=document.getElementById(`network-sync-badge`);t.innerHTML=e?`<span class="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse block"></span><span class="hidden md:inline text-[10px] font-black uppercase text-emerald-400">অনলাইন</span>`:`<span class="w-2.5 h-2.5 rounded-full bg-red-500 block"></span><span class="hidden md:inline text-[10px] font-black uppercase text-red-400">অফলাইন</span>`,t.className=e?`w-8 h-8 md:w-auto md:h-auto md:px-3 md:py-1 md:gap-1.5 flex items-center justify-center rounded-full bg-emerald-500/10 border border-emerald-500/20 shadow-sm cursor-default`:`w-8 h-8 md:w-auto md:h-auto md:px-3 md:py-1 md:gap-1.5 flex items-center justify-center rounded-full bg-red-500/10 border border-red-500/20 shadow-sm cursor-default`,t.title=e?`অনলাইন — Sync Active`:`অফলাইন — Local Mode`};window.addEventListener(`online`,()=>{e(),V(`অনলাইন কানেকশন পুনরুদ্ধার হয়েছে!`,`success`,`নেটওয়ার্ক`)}),window.addEventListener(`offline`,()=>{e(),V(`ইন্টারনেট সংযোগ বিচ্ছিন্ন! অফলাইন মোড সক্রিয়।`,`warning`,`নেটওয়ার্ক`)}),e()}function K(e,r=`export.xlsx`){let i=document.getElementById(e);if(!i)return V(`টেবিল ডাটা পাওয়া যায়নি!`,`warning`,`এক্সপোর্ট`);try{let e=t.book_new(),a=t.table_to_sheet(i,{raw:!0});t.book_append_sheet(e,a,`Sheet1`),n(e,r),V(`এক্সেল ডাটা সফলভাবে ডাউনলোড হয়েছে!`,`success`,`এক্সপোর্ট`)}catch(e){console.error(`Excel Export Error:`,e),V(`এক্সপোর্ট করতে সমস্যা হয়েছে!`,`error`,`এক্সপোর্ট`)}}typeof window<`u`&&(window.exportTableToExcel=K);function q(){let e=()=>{if(!window.AppState||!window.AppState.permissions)return;let e=window.AppState.permissions;document.querySelectorAll(`[data-perm]`).forEach(t=>{let n=t.getAttribute(`data-perm`);e[n]===!1?(t.style.cssText=`display: none !important;`,t.classList.contains(`nav-item`)||(t.innerHTML=``)):t.style.cssText=``})};e(),new MutationObserver(()=>{e()}).observe(document.body,{childList:!0,subtree:!0})}export{s as C,a as S,f as _,W as a,i as b,B as c,P as d,I as f,M as g,j as h,q as i,F as l,N as m,U as n,V as o,L as p,G as r,R as s,K as t,z as u,u as v,o as x,r as y};
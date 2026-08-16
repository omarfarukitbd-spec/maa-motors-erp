const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["assets/dao-C6HjIw1i.js","assets/rolldown-runtime-Dd_uD5pT.js","assets/vendor-firebase-YQIUDKRL.js","assets/vendor-CJahiyzm.js","assets/vendor-CwbMEznW.css","assets/receipt-engine-BomD4P0l.js","assets/vendor-ui-n4g2UPZQ.js","assets/vendor-ui-CveviJq_.css","assets/statement-print-CcvOtciR.js","assets/zone-report-tagada-67xaGERw.js"])))=>i.map(i=>d[i]);
import{i as e,n as t}from"./rolldown-runtime-Dd_uD5pT.js";import{t as n}from"./vendor-firebase-YQIUDKRL.js";import{n as r,t as i}from"./vendor-CJahiyzm.js";import{a,c as o,f as s,h as c,i as l,l as u,m as d,n as f,o as p,p as m,r as h,s as g,t as _,u as v}from"./dao-C6HjIw1i.js";import{n as y,t as b}from"./vendor-ui-n4g2UPZQ.js";import{n as x,r as S,t as C}from"./vendor-excel-Cd8Spm_A.js";(function(){let e=document.createElement(`link`).relList;if(e&&e.supports&&e.supports(`modulepreload`))return;for(let e of document.querySelectorAll(`link[rel="modulepreload"]`))n(e);new MutationObserver(e=>{for(let t of e)if(t.type===`childList`)for(let e of t.addedNodes)e.tagName===`LINK`&&e.rel===`modulepreload`&&n(e)}).observe(document,{childList:!0,subtree:!0});function t(e){let t={};return e.integrity&&(t.integrity=e.integrity),e.referrerPolicy&&(t.referrerPolicy=e.referrerPolicy),t.credentials=e.crossOrigin===`use-credentials`?`include`:e.crossOrigin===`anonymous`?`omit`:`same-origin`,t}function n(e){if(e.ep)return;e.ep=!0;let n=t(e);fetch(e.href,n)}})();async function w(){try{return(await navigator.mediaDevices.getUserMedia({video:!0})).getTracks().forEach(e=>e.stop()),!0}catch(e){return console.warn(`Camera permission denied or camera not found:`,e),!1}}async function T(){return new Promise(async e=>{try{let t=await navigator.mediaDevices.getUserMedia({video:{facingMode:`user`}}),n=document.createElement(`video`);n.srcObject=t,n.autoplay=!0,n.muted=!0,n.playsInline=!0,n.style.display=`none`,document.body.appendChild(n),n.onloadedmetadata=()=>{n.play(),setTimeout(()=>{let r=document.createElement(`canvas`);r.width=n.videoWidth,r.height=n.videoHeight,r.getContext(`2d`).drawImage(n,0,0,r.width,r.height),t.getTracks().forEach(e=>e.stop()),n.remove(),r.toBlob(t=>{e(t)},`image/jpeg`,.8)},500)}}catch(t){console.error(`Failed to capture photo:`,t),e(null)}})}var ee=`modulepreload`,te=function(e){return`/`+e},E={},D=function(e,t,n){let r=Promise.resolve();if(t&&t.length>0){let e=document.getElementsByTagName(`link`),i=document.querySelector(`meta[property=csp-nonce]`),a=i?.nonce||i?.getAttribute(`nonce`);function o(e){return Promise.all(e.map(e=>Promise.resolve(e).then(e=>({status:`fulfilled`,value:e}),e=>({status:`rejected`,reason:e}))))}function s(e){return import.meta.resolve?import.meta.resolve(e):new URL(e,import.meta.url).href}r=o(t.map(t=>{if(t=te(t,n),t=s(t),t in E)return;E[t]=!0;let r=t.endsWith(`.css`);for(let n=e.length-1;n>=0;n--){let i=e[n];if(i.href===t&&(!r||i.rel===`stylesheet`))return}let i=document.createElement(`link`);if(i.rel=r?`stylesheet`:ee,r||(i.as=`script`),i.crossOrigin=``,i.href=t,a&&i.setAttribute(`nonce`,a),document.head.appendChild(i),r)return new Promise((e,n)=>{i.addEventListener(`load`,e),i.addEventListener(`error`,()=>n(Error(`Unable to preload CSS for ${t}`)))})}))}function i(e){let t=new Event(`vite:preloadError`,{cancelable:!0});if(t.payload=e,window.dispatchEvent(t),!t.defaultPrevented)throw e}return r.then(t=>{for(let e of t||[])e.status===`rejected`&&i(e.reason);return e().catch(i)})};async function O(e,t,r,i,a={},o=null){try{let s=n.auth().currentUser,c=typeof navigator<`u`&&navigator.userAgent&&/Mobi|Android|iPhone/i.test(navigator.userAgent),l={action:e,module:t,entityId:r||``,entityName:i||``,details:a||{},deviceInfo:c?`Mobile`:`Desktop`,userEmail:s?s.email:`Unknown`,userId:s?s.uid:`System`,timestamp:n.firestore.FieldValue.serverTimestamp(),clientTimestamp:new Date().toISOString()};if(o&&(l.changes=o),await _.add(l),console.log(`[Audit] ${e} on ${t} (${i}) logged successfully.`),[`DELETE`,`UPDATE`,`SECURITY_ALERT`,`LOGIN`].includes(e))try{let n=await(await D(()=>import(`./dao-C6HjIw1i.js`).then(e=>e.d),__vite__mapDeps([0,1,2,3,4]))).SettingsDAO.getAppSettings(),o=n.telegramBotToken,s=n.telegramChatId;if(o&&s){let n=`[INFO]`;e===`DELETE`||e===`SECURITY_ALERT`?n=`[ALERT]`:e===`UPDATE`?n=`[WARN]`:e===`LOGIN`&&(n=`[SUCCESS]`);let c=``;a&&typeof a==`object`&&Object.keys(a).length>0&&(c=`\n*Details:* \`${JSON.stringify(a).substring(0,100)}\``);let u=`
${n} *Maa Motors ERP Alert*
*Action:* ${e}
*Module:* ${t||`Unknown`}
*Target:* ${i||r||`Unknown`}
*User:* ${l.userEmail}
*Time:* ${new Date().toLocaleString(`en-US`,{timeZone:`Asia/Dhaka`})}${c}
                    `.trim(),d=null;if(e===`SECURITY_ALERT`&&(d=await T()),d){let e=new FormData;e.append(`chat_id`,s),e.append(`photo`,d,`intruder.jpg`),e.append(`caption`,u),e.append(`parse_mode`,`Markdown`),await fetch(`https://api.telegram.org/bot${o}/sendPhoto`,{method:`POST`,body:e})}else await fetch(`https://api.telegram.org/bot${o}/sendMessage`,{method:`POST`,headers:{"Content-Type":`application/json`},body:JSON.stringify({chat_id:s,text:u,parse_mode:`Markdown`})})}}catch(e){console.error(`Failed to send Telegram alert:`,e)}}catch(e){console.error(`Failed to write audit log:`,e)}}function ne(e){return e.deviceInfo===`Mobile`||e.details&&e.details.device===`Mobile`?`<span class="inline-flex items-center gap-1 text-[10px] text-amber-400 bg-amber-400/10 border border-amber-400/20 px-1.5 py-0.5 rounded font-mono" title="Mobile Device"><i class="fa-solid fa-mobile-screen"></i> Mobile</span>`:`<span class="inline-flex items-center gap-1 text-[10px] text-sky-400 bg-sky-400/10 border border-sky-400/20 px-1.5 py-0.5 rounded font-mono" title="Desktop / PC"><i class="fa-solid fa-desktop"></i> Desktop</span>`}function k(e){if(!e)return`<span class="text-slate-500">-</span>`;let t=`<div class="font-bn space-y-1">`;if(e.entityName&&(t+=`<div class="flex items-center gap-2 justify-between"><div class="text-xs font-black text-white tracking-tight">${e.entityName}</div>${ne(e)}</div>`),e.changes){let{old:n={},new:r={}}=e.changes,i=Array.from(new Set([...Object.keys(n),...Object.keys(r)]));i.length>0&&(t+=`<div class="mt-1 space-y-1 text-[11px] font-sans">`,i.forEach(e=>{let i=n[e]===void 0?`N/A`:String(n[e]),a=r[e]===void 0?`N/A`:String(r[e]);i!==a&&(t+=`
                        <div class="flex items-center gap-1.5 flex-wrap bg-slate-950/60 p-1.5 rounded-lg border border-slate-800">
                            <span class="text-[10px] font-black text-blue-400 uppercase font-mono">${e}:</span>
                            <span class="text-red-400 bg-red-500/10 border border-red-500/20 px-1.5 py-0.5 rounded line-through">${i}</span>
                            <i class="fa-solid fa-arrow-right text-[9px] text-slate-500"></i>
                            <span class="text-emerald-400 bg-emerald-400/10 border border-emerald-400/20 px-1.5 py-0.5 rounded font-bold">${a}</span>
                        </div>
                    `)}),t+=`</div>`)}else if(e.details&&Object.keys(e.details).length>0){let n=Object.entries(e.details).map(([e,t])=>`<span class="text-slate-300"><strong class="text-slate-500">${e}:</strong> ${t}</span>`).join(` • `);t+=`<div class="text-[10px] text-slate-400 font-sans mt-0.5">${n}</div>`}return t+=`</div>`,t}function A(e,{searchQuery:t=``,userFilter:n=``,actionFilter:r=``,moduleFilter:i=``,startDate:a=``,endDate:o=``}){if(!e||!Array.isArray(e))return[];let s=t.trim().toLowerCase(),c=n.trim().toLowerCase(),l=r.trim().toUpperCase(),u=i.trim().toLowerCase();return e.filter(e=>{let t=!c||(e.userEmail||``).toLowerCase().includes(c),n=!l||(e.action||``).toUpperCase()===l,r=!u||(e.module||``).toLowerCase()===u,i=(e.entityName||``).toLowerCase(),d=JSON.stringify(e.details||{}).toLowerCase(),f=JSON.stringify(e.changes||{}).toLowerCase(),p=!s||i.includes(s)||d.includes(s)||f.includes(s)||(e.userEmail||``).toLowerCase().includes(s),m=!0;if(a||o){let t=(e.timestamp?e.timestamp.toDate():new Date(e.clientTimestamp||Date.now())).toISOString().split(`T`)[0];a&&t<a&&(m=!1),o&&t>o&&(m=!1)}return t&&n&&r&&p&&m})}function j(e){if(!e||e.length===0){window.Swal&&window.Swal.fire(`ফাঁকা লিস্ট`,`এক্সপোর্ট করার জন্য কোনো অডিট ডাটা পাওয়া যায়নি`,`warning`);return}try{let t=e.map((e,t)=>{let n=e.timestamp?e.timestamp.toDate():new Date(e.clientTimestamp||Date.now()),r=n.toLocaleDateString(`en-GB`)+` `+n.toLocaleTimeString([],{hour:`2-digit`,minute:`2-digit`,second:`2-digit`}),i=``;return e.changes?i=`Old: ${JSON.stringify(e.changes.old)} => New: ${JSON.stringify(e.changes.new)}`:e.details&&(i=JSON.stringify(e.details)),{SL:t+1,"তারিখ ও সময়":r,অ্যাকশন:e.action||`-`,মডিউল:e.module||`-`,"ইউজার ইমেইল":e.userEmail||`System`,"এন্টিটি নেম":e.entityName||`-`,"পরিবর্তনের বিবরণ":i}}),n=window.XLSX.utils.json_to_sheet(t),r=window.XLSX.utils.book_new();window.XLSX.utils.book_append_sheet(r,n,`Audit Logs`);let i=new Date().toISOString().split(`T`)[0];window.XLSX.writeFile(r,`Maa_Motors_Audit_Logs_${i}.xlsx`),window.Swal&&window.Swal.fire({title:`<i class="fa-solid fa-file-excel text-emerald-400 mr-2"></i>এক্সপোর্ট সফল!`,text:`${e.length} টি অডিট অ্যাকশন রিপোর্ট এক্সেলে সেভ হয়েছে।`,icon:`success`,customClass:{popup:`!bg-slate-900 !text-white !rounded-3xl border border-slate-700 font-bn`}})}catch(e){console.error(`Audit export error:`,e),window.Swal&&window.Swal.fire(`এরর`,`এক্সপোর্ট করার সময় সমস্যা হয়েছে`,`error`)}}function re(e){if(!e||!Array.isArray(e))return{totalToday:0,updatesToday:0,deletesToday:0,pinChangesToday:0,activeUsersCount:0};let t=new Date().toISOString().split(`T`)[0],n=e.filter(e=>(e.timestamp?e.timestamp.toDate():new Date(e.clientTimestamp||Date.now())).toISOString().split(`T`)[0]===t),r=new Set(n.map(e=>e.userEmail).filter(Boolean));return{totalToday:n.length,updatesToday:n.filter(e=>e.action===`UPDATE`).length,deletesToday:n.filter(e=>e.action===`DELETE`).length,pinChangesToday:n.filter(e=>e.action===`PIN_CHANGE`).length,activeUsersCount:r.size}}function ie(e){return`
        <div class="grid grid-cols-2 lg:grid-cols-4 gap-3 font-bn">
            <div class="m3-card bg-slate-900/80 border border-slate-800 p-4 rounded-3xl backdrop-blur-xl flex items-center gap-3">
                <div class="w-12 h-12 rounded-2xl bg-blue-500/10 border border-blue-500/20 text-blue-400 flex items-center justify-center text-xl shrink-0">
                    <i class="fa-solid fa-list-check"></i>
                </div>
                <div>
                    <div class="text-[10px] text-slate-400 font-bold uppercase tracking-wider">আজকের মোট কাজ</div>
                    <div class="text-2xl font-black text-white">${e.totalToday} <span class="text-xs text-slate-500 font-normal">টি</span></div>
                </div>
            </div>

            <div class="m3-card bg-slate-900/80 border border-slate-800 p-4 rounded-3xl backdrop-blur-xl flex items-center gap-3">
                <div class="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center text-xl shrink-0">
                    <i class="fa-solid fa-pen-to-square"></i>
                </div>
                <div>
                    <div class="text-[10px] text-slate-400 font-bold uppercase tracking-wider">আজকের সংশোধন (Edit)</div>
                    <div class="text-2xl font-black text-amber-400">${e.updatesToday} <span class="text-xs text-slate-500 font-normal">টি</span></div>
                </div>
            </div>

            <div class="m3-card bg-slate-900/80 border border-slate-800 p-4 rounded-3xl backdrop-blur-xl flex items-center gap-3">
                <div class="w-12 h-12 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-400 flex items-center justify-center text-xl shrink-0">
                    <i class="fa-solid fa-trash-can"></i>
                </div>
                <div>
                    <div class="text-[10px] text-slate-400 font-bold uppercase tracking-wider">আজকের ডিলিট (Delete)</div>
                    <div class="text-2xl font-black text-red-400">${e.deletesToday} <span class="text-xs text-slate-500 font-normal">টি</span></div>
                </div>
            </div>

            <div class="m3-card bg-slate-900/80 border border-slate-800 p-4 rounded-3xl backdrop-blur-xl flex items-center gap-3">
                <div class="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center text-xl shrink-0">
                    <i class="fa-solid fa-user-gear"></i>
                </div>
                <div>
                    <div class="text-[10px] text-slate-400 font-bold uppercase tracking-wider">সক্রিয় স্টাফ</div>
                    <div class="text-2xl font-black text-emerald-400">${e.activeUsersCount} <span class="text-xs text-slate-500 font-normal">জন</span></div>
                </div>
            </div>
        </div>
    `}function ae(e=`all`){return`
        <div class="flex items-center gap-2 border-b border-slate-800 pb-3 font-bn overflow-x-auto custom-scrollbar">
            ${[{id:`all`,label:`সকল অডিট লগ`,icon:`fa-table-list`},{id:`critical`,label:`ক্রিটিক্যাল সিকিউরিটি`,icon:`fa-triangle-exclamation`,badgeClass:`bg-red-500/20 text-red-400 border-red-500/30`},{id:`staff`,label:`স্টাফ টাইমলাইন`,icon:`fa-users-gear`}].map(t=>{let n=t.id===e?`bg-blue-600 text-white shadow-lg shadow-blue-600/30 font-black`:`bg-slate-900/80 text-slate-400 hover:text-white hover:bg-slate-800 font-bold border border-slate-800`;return`
                    <button onclick="window.switchAuditTab('${t.id}')" class="h-10 px-4 rounded-2xl text-xs flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap ${n}">
                        <i class="fa-solid ${t.icon} text-sm"></i>
                        <span>${t.label}</span>
                    </button>
                `}).join(``)}
        </div>
    `}async function oe(e,t=`সকল অডিট রেকর্ড`){if(!e||e.length===0){window.Swal&&window.Swal.fire(`ফাঁকা রিপোর্ট`,`প্রিন্ট করার জন্য কোনো অডিট রেকর্ড পাওয়া যায়নি`,`warning`);return}try{let n=await g.getAppSettings(),r=n.shopName||`M/S. Maa Motors`,i=n.shopAddress||`Shop No. 22, Rahman Tower, 1st Rail Gate, Muradpur, Hathazari Road`,a=n.shopPhone||`01819-397669, 01815-707934`,o=new Date().toLocaleDateString(`en-GB`),s=e.map((e,t)=>{let n=e.timestamp?e.timestamp.toDate():new Date(e.clientTimestamp||Date.now()),r=n.toLocaleDateString(`en-GB`)+` `+n.toLocaleTimeString([],{hour:`2-digit`,minute:`2-digit`}),i=e.entityName||`-`;return e.changes?i+=` (Old: ${JSON.stringify(e.changes.old)} => New: ${JSON.stringify(e.changes.new)})`:e.details&&Object.keys(e.details).length>0&&(i+=` (${JSON.stringify(e.details)})`),`
                <tr style="border-bottom: 1px solid #cbd5e1; font-size: 11px;">
                    <td style="padding: 6px; text-align: center; border-right: 1px solid #e2e8f0;">${t+1}</td>
                    <td style="padding: 6px; border-right: 1px solid #e2e8f0;">${r}</td>
                    <td style="padding: 6px; font-weight: bold; border-right: 1px solid #e2e8f0;">${e.action||`-`}</td>
                    <td style="padding: 6px; border-right: 1px solid #e2e8f0;">${e.module||`-`}</td>
                    <td style="padding: 6px; font-weight: bold; border-right: 1px solid #e2e8f0;">${e.userEmail||`System`}</td>
                    <td style="padding: 6px;">${i}</td>
                </tr>
            `}).join(``),c=`
            <!DOCTYPE html>
            <html>
            <head>
                <title>Audit Log Report - ${r}</title>
                <style>
                    body { font-family: 'Hind Siliguri', 'Kalpurush', sans-serif; padding: 20px; color: #0f172a; }
                    .header { text-align: center; border-bottom: 2px solid #0f172a; padding-bottom: 10px; margin-bottom: 15px; }
                    .header h1 { margin: 0; font-size: 24px; text-transform: uppercase; }
                    .header p { margin: 2px 0; font-size: 12px; }
                    .info-bar { display: flex; justify-content: space-between; font-size: 12px; font-weight: bold; margin-bottom: 15px; background: #f8fafc; padding: 8px 12px; border-radius: 8px; border: 1px solid #e2e8f0; }
                    table { width: 100%; border-collapse: collapse; margin-bottom: 30px; }
                    th { background: #0f172a; color: white; padding: 8px; text-align: left; font-size: 11px; }
                    .footer { display: flex; justify-content: space-between; margin-top: 40px; font-size: 12px; font-weight: bold; }
                </style>
            </head>
            <body>
                <div class="header">
                    <h1>${r}</h1>
                    <p>${i}</p>
                    <p>মোবাইল: ${a}</p>
                    <h3 style="margin-top: 8px; font-size: 16px;">সিস্টেম অডিট ও সিকিউরিটি রিপোর্ট</h3>
                </div>
                <div class="info-bar">
                    <span>ফিল্টার টাইপ: ${t}</span>
                    <span>মোট এন্ট্রি: ${e.length} টি</span>
                    <span>রিপোর্ট প্রিন্ট তারিখ: ${o}</span>
                </div>
                <table>
                    <thead>
                        <tr>
                            <th style="width: 5%; text-align: center;">SL</th>
                            <th style="width: 18%;">তারিখ ও সময়</th>
                            <th style="width: 12%;">অ্যাকশন</th>
                            <th style="width: 12%;">মডিউল</th>
                            <th style="width: 23%;">স্টাফ ইমেইল</th>
                            <th style="width: 30%;">বিবরণ ও পরিবর্তন</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${s}
                    </tbody>
                </table>
                <div class="footer">
                    <div>প্রিন্ট ইউজার: Admin</div>
                    <div style="border-top: 1px solid #0f172a; width: 180px; text-align: center; padding-top: 4px;">প্রোপ্রাইটর / এডমিন স্বাক্ষর</div>
                </div>
            </body>
            </html>
        `,l=window.open(``,`_blank`);l&&(l.document.write(c),l.document.close(),l.focus(),setTimeout(()=>{l.print()},500))}catch(e){console.error(`Print audit report error:`,e),window.Swal&&window.Swal.fire(`এরর`,`অডিট রিপোর্ট প্রিন্ট করতে সমস্যা হয়েছে`,`error`)}}var se=[],M=[],ce=[],le=`all`,ue=null,de=[],fe=1,pe=30,me=!1;function he(){se.forEach(e=>{typeof e==`function`&&e()}),se=[]}async function ge(e=50){try{return await _.getRecent(e)}catch(e){return console.error(`Failed to fetch audit logs:`,e),[]}}async function _e(e){let t=document.getElementById(`audit-user-select`);if(!t)return;let n=[];try{n=await u.getAll()}catch(e){console.warn(`Could not fetch user list for audit dropdown:`,e)}let r=n.map(e=>e.email).filter(Boolean),i=e.map(e=>e.userEmail).filter(Boolean);t.innerHTML=`<option value="">-- সকল ইউজার (All Staff) --</option>`+Array.from(new Set([...r,...i])).sort().map(e=>`<option value="${e}">${e}</option>`).join(``)}async function ve(e){if(window.AppState.currentUserRole!==`Admin`){e.innerHTML=`<div class="m3-card text-center font-bn py-12"><h2 class="text-xl font-black text-red-500">অ্যাক্সেস ডিনাইড! শুধুমাত্র অ্যাডমিন সিকিউরিটি অডিট দেখতে পারবেন।</h2></div>`;return}he(),e.innerHTML=`
        <div class="flex flex-col gap-6 font-bn">
            <div class="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 px-2">
                <div>
                    <h2 class="text-2xl font-black flex items-center gap-3 tracking-tight text-white">
                        <div class="w-2.5 h-8 bg-emerald-500 rounded-full shadow-[0_0_15px_rgba(16,185,129,0.5)]"></div>
                        <span>অডিট লগ ও সিকিউরিটি ইন্টেলিজেন্স</span>
                    </h2>
                    <p class="text-slate-400 text-xs mt-1">স্টাফ ও ইউজারদের সকল ক্রিয়াকলাপ, এডিট, ডিলিট, ডিভাইস ও পিন পরিবর্তনের রিয়েল-টাইম তথ্য।</p>
                </div>
                <div class="flex items-center gap-2 flex-wrap">
                    <button onclick="window.triggerPrintAuditLogReport()" class="h-10 px-4 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-bold text-xs flex items-center gap-2 transition-all shadow-lg cursor-pointer">
                        <i class="fa-solid fa-print text-sm"></i>
                        <span>প্রিন্ট রিপোর্ট</span>
                    </button>
                    <button onclick="window.exportActiveAuditExcel()" class="h-10 px-4 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-bold text-xs flex items-center gap-2 transition-all shadow-lg cursor-pointer">
                        <i class="fa-solid fa-file-excel text-sm"></i>
                        <span>এক্সপোর্ট এক্সেল</span>
                    </button>
                    <button onclick="window.refreshAuditLogsList()" class="h-10 px-3 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl font-bold text-xs flex items-center gap-1.5 border border-slate-700 transition-all cursor-pointer">
                        <i class="fa-solid fa-rotate text-sm"></i>
                    </button>
                </div>
            </div>

            <!-- Stats Overview Container -->
            <div id="audit-stats-cards-container"></div>

            <!-- Navigation Tabs -->
            <div id="audit-tabs-container"></div>

            <!-- Filter Controls -->
            <div class="m3-card bg-slate-900/80 border border-slate-800 p-4 rounded-3xl backdrop-blur-xl">
                <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-3">
                    <div class="lg:col-span-2">
                        <label class="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1">কী-ওয়ার্ড সার্চ</label>
                        <input type="text" id="audit-search-input" oninput="window.applyAuditFilters()" placeholder="কাস্টমার নাম, ইমেইল, আইডি..." class="m3-field text-xs">
                    </div>
                    <div>
                        <label class="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1">অ্যাকশন টাইপ</label>
                        <select id="audit-action-select" onchange="window.applyAuditFilters()" class="m3-field text-xs">
                            <option value="">-- সকল অ্যাকশন (All Actions) --</option>
                            <option value="CREATE">CREATE (নতুন এন্ট্রি)</option>
                            <option value="UPDATE">UPDATE (সংশোধন/এডিট)</option>
                            <option value="DELETE">DELETE (ডিলিট)</option>
                            <option value="LOGIN">LOGIN (লগইন)</option>
                            <option value="PIN_CHANGE">PIN_CHANGE (পিন পরিবর্তন)</option>
                        </select>
                    </div>
                    <div>
                        <label class="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1">স্টাফ ইমেইল ফিল্টার</label>
                        <select id="audit-user-select" onchange="window.applyAuditFilters()" class="m3-field text-xs">
                            <option value="">-- সকল ইউজার (All Staff) --</option>
                        </select>
                    </div>
                    <div>
                        <label class="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1">শুরুর তারিখ (From)</label>
                        <input type="date" id="audit-start-date" onchange="window.applyAuditFilters()" class="m3-field text-xs">
                    </div>
                    <div>
                        <label class="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1">শেষ তারিখ (To)</label>
                        <input type="date" id="audit-end-date" onchange="window.applyAuditFilters()" class="m3-field text-xs">
                    </div>
                </div>
            </div>

            <div class="m3-card bg-slate-900/60 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl">
                <div class="m3-table-container overflow-x-auto">
                    <table class="m3-table w-full">
                        <thead>
                            <tr class="bg-slate-950 text-slate-400 text-xs uppercase tracking-wider">
                                <th class="p-3.5 text-left">তারিখ ও সময়</th>
                                <th class="p-3.5 text-left">অ্যাকশন</th>
                                <th class="p-3.5 text-left">মডিউল</th>
                                <th class="p-3.5 text-left">স্টাফ / ইউজার</th>
                                <th class="p-3.5 text-left">পরিবর্তনের বিস্তারিত বিবরণ (Visual Diff)</th>
                            </tr>
                        </thead>
                        <tbody id="audit-logs-list" class="divide-y divide-slate-800/50">
                            <tr><td colspan="5" class="text-center py-16 text-slate-400 italic"><i class="fa-solid fa-spinner fa-spin text-2xl text-blue-500 mb-2 block"></i>অডিট ডাটা লোড হচ্ছে...</td></tr>
                    </table>
                </div>
            </div>

            <!-- Pagination -->
            <div id="audit-pagination" class="flex items-center justify-center gap-4 py-4 hidden font-bn">
                <button id="audit-prev-page" class="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl transition-colors font-bold disabled:opacity-50" onclick="window.changeAuditPage('prev')">পূর্ববর্তী</button>
                <div class="text-white font-bold bg-blue-600/10 border border-blue-500/30 px-4 py-2 rounded-xl">পৃষ্ঠা: <span id="audit-current-page-display">1</span></div>
                <button id="audit-next-page" class="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl transition-colors font-bold disabled:opacity-50" onclick="window.changeAuditPage('next')">পরবর্তী</button>
            </div>
        </div>
    `,ye()}async function ye(e=`next`){let t=document.getElementById(`audit-logs-list`);if(t)if(me)try{M.length<100&&(M=await _.getRecent(300)),be()}catch(e){console.error(e)}else{t.innerHTML=`<tr><td colspan="5" class="text-center py-16 text-slate-400 italic"><i class="fa-solid fa-spinner fa-spin text-2xl text-blue-500 mb-2 block"></i>অডিট ডাটা লোড হচ্ছে...</td></tr>`;try{let n=e===`next`?ue:de.length>1?de[de.length-2]:null,r=await _.getByPage(pe,n,`timestamp`,`desc`);ue=r.lastDoc,e===`next`?n&&de.push(n):de.pop();let i=document.getElementById(`audit-pagination`);i&&(i.classList.remove(`hidden`),document.getElementById(`audit-current-page-display`).innerText=fe,document.getElementById(`audit-prev-page`).disabled=fe===1,document.getElementById(`audit-next-page`).disabled=r.count<pe),M=r.data,xe(M,t);let a=re(M),o=document.getElementById(`audit-stats-cards-container`);o&&(o.innerHTML=ie(a));let s=document.getElementById(`audit-tabs-container`);s&&!s.innerHTML.trim()&&(s.innerHTML=ae(le)),await _e(M),ce=M}catch(e){console.error(`Load audit error:`,e),t.innerHTML=`<tr><td colspan="5" class="text-center py-12 text-red-400 font-bold">ডাটা লোড করতে সমস্যা হয়েছে</td></tr>`}}}async function be(){let e=document.getElementById(`audit-logs-list`);if(!e)return;let t=document.getElementById(`audit-search-input`)?.value||``,n=document.getElementById(`audit-user-select`)?.value||``,r=document.getElementById(`audit-action-select`)?.value||``,i=document.getElementById(`audit-module-select`)?.value||``,a=document.getElementById(`audit-start-date`)?.value||``,o=document.getElementById(`audit-end-date`)?.value||``;le===`critical`&&(r||=`DELETE`);let s=t||n||r||i||a||o||le!==`all`,c=document.getElementById(`audit-pagination`);if(!s){me=!1,c&&c.classList.remove(`hidden`),ue=null,de=[],fe=1,ye();return}me=!0,c&&c.classList.add(`hidden`),M.length<100&&(e.innerHTML=`<tr><td colspan="5" class="text-center py-16 text-slate-400 italic"><i class="fa-solid fa-spinner fa-spin text-2xl text-blue-500 mb-2 block"></i>খুঁজছি...</td></tr>`,M=await _.getRecent(300)),ce=A(M,{searchQuery:t,userFilter:n,actionFilter:r,moduleFilter:i,startDate:a,endDate:o}),xe(ce,e)}function xe(e,t){if(e.length===0){t.innerHTML=`<tr><td colspan="5" class="text-center py-16 text-slate-500 font-bold italic">কোনো ফিল্টারকৃত অডিট রেকর্ড পাওয়া যায়নি।</td></tr>`;return}t.innerHTML=e.map(e=>{let t=e.timestamp?e.timestamp.toDate():new Date(e.clientTimestamp||Date.now()),n=t.toLocaleDateString(`en-GB`),r=t.toLocaleTimeString([],{hour:`2-digit`,minute:`2-digit`,second:`2-digit`}),i=``;return i=e.action===`CREATE`?`<span class="bg-emerald-500/20 text-emerald-400 px-2.5 py-1 rounded-xl text-[10px] font-black border border-emerald-500/30">CREATE</span>`:e.action===`UPDATE`?`<span class="bg-amber-500/20 text-amber-400 px-2.5 py-1 rounded-xl text-[10px] font-black border border-amber-500/30">UPDATE</span>`:e.action===`DELETE`?`<span class="bg-red-500/20 text-red-400 px-2.5 py-1 rounded-xl text-[10px] font-black border border-red-500/30">DELETE</span>`:e.action===`LOGIN`?`<span class="bg-blue-500/20 text-blue-400 px-2.5 py-1 rounded-xl text-[10px] font-black border border-blue-500/30">LOGIN</span>`:`<span class="bg-slate-800 text-slate-300 px-2.5 py-1 rounded-xl text-[10px] font-black border border-slate-700">${e.action}</span>`,`
            <tr class="border-b border-slate-800/50 hover:bg-slate-800/30 transition-colors">
                <td class="p-3.5 text-xs text-slate-400 font-mono whitespace-nowrap">
                    <div class="font-bold text-white">${n}</div>
                    <div class="text-[10px] text-slate-500">${r}</div>
                </td>
                <td class="p-3.5 whitespace-nowrap">${i}</td>
                <td class="p-3.5 text-xs font-bold text-slate-300 whitespace-nowrap"><i class="fa-solid fa-folder text-slate-500 mr-1.5"></i>${e.module||`-`}</td>
                <td class="p-3.5 text-xs text-sky-400 font-mono font-bold whitespace-nowrap"><i class="fa-solid fa-user-shield text-slate-500 mr-1.5"></i>${e.userEmail||`System`}</td>
                <td class="p-3.5 min-w-[280px]">${k(e)}</td>
            </tr>
        `}).join(``)}window.switchAuditTab=e=>{le=e;let t=document.getElementById(`audit-tabs-container`);t&&(t.innerHTML=ae(le)),be()},window.changeAuditPage=e=>{e===`next`?fe++:fe--,ye(e)},window.auditLog=O,window.getRecentAuditLogs=ge,window.unsubscribeAuditLogs=he,window.applyAuditFilters=be,window.refreshAuditLogsList=()=>{ue=null,de=[],fe=1,M=[],ye()},window.exportActiveAuditExcel=()=>j(ce),window.triggerPrintAuditLogReport=()=>oe(ce);var N={currentUserRole:null,currentUserEmail:null,currentView:`dashboard`,permissions:{},shopName:`M/S. Maa Motors`,shopOwner:`Mohammed Amran`};window.AppState=N;function P(e){return e==null?``:String(e).replace(/&/g,`&amp;`).replace(/</g,`&lt;`).replace(/>/g,`&gt;`).replace(/"/g,`&quot;`).replace(/'/g,`&#039;`)}function F(e){return e==null||e===``||isNaN(e)?``:Number(e).toLocaleString(`en-IN`)}function I(e){return e&&parseFloat(e.toString().replace(/,/g,``))||0}function Se(e){let t=e.value.replace(/[^0-9.]/g,``);e.value=t?F(t):``}function L(e,t=2){if(e==null||isNaN(e))return 0;let n=10**t;return Math.round((e+2**-52)*n)/n}window.escapeHTML=P,window.formatAmountWithComma=F,window.parseAmount=I,window.handleNumberInput=Se,window.safeRound=L;function R(){try{let e=new Date;return new Intl.DateTimeFormat(`en-CA`,{timeZone:`Asia/Dhaka`,year:`numeric`,month:`2-digit`,day:`2-digit`}).format(e)}catch{let e=new Date;return`${e.getFullYear()}-${String(e.getMonth()+1).padStart(2,`0`)}-${String(e.getDate()).padStart(2,`0`)}`}}function Ce(e){if(!e)return``;let t=typeof e.toDate==`function`?e.toDate():new Date(e);return isNaN(t.getTime())?``:`${String(t.getDate()).padStart(2,`0`)}/${String(t.getMonth()+1).padStart(2,`0`)}/${t.getFullYear()}`}function z(e){if(!e)return R();if(e instanceof Date)return isNaN(e.getTime())?R():`${e.getFullYear()}-${String(e.getMonth()+1).padStart(2,`0`)}-${String(e.getDate()).padStart(2,`0`)}`;let t=String(e).trim();if(/^\d{4}-\d{2}-\d{2}$/.test(t))return t;if(/^\d{2}\/\d{2}\/\d{4}$/.test(t)){let[e,n,r]=t.split(`/`);return`${r}-${n}-${e}`}let n=new Date(e);return isNaN(n.getTime())?R():`${n.getFullYear()}-${String(n.getMonth()+1).padStart(2,`0`)}-${String(n.getDate()).padStart(2,`0`)}`}function we(e){if(!e)return``;let t=String(e).trim();if(/^\d{2}\/\d{2}\/\d{4}$/.test(t))return t;if(/^\d{4}-\d{2}-\d{2}$/.test(t)){let[e,n,r]=t.split(`-`);return`${r}/${n}/${e}`}let n=new Date(e);return isNaN(n.getTime())?t:`${String(n.getDate()).padStart(2,`0`)}/${String(n.getMonth()+1).padStart(2,`0`)}/${n.getFullYear()}`}function B(e){return we(e)}window.getTodayLocalDateString=R,window.formatTimestampToAppDate=Ce,window.toDBDate=z,window.toDisplayDate=we,window.formatAppDate=B;function V(e){if(e==null||e===``||isNaN(e))return``;let t={0:`শূন্য`,1:`এক`,2:`দুই`,3:`তিন`,4:`চার`,5:`পাঁচ`,6:`ছয়`,7:`সাত`,8:`আট`,9:`নয়`,10:`দশ`,11:`এগারো`,12:`বারো`,13:`তেরো`,14:`চৌদ্দ`,15:`পনেরো`,16:`ষোলো`,17:`সতেরো`,18:`আঠারো`,19:`উনিশ`,20:`বিশ`,21:`একুশ`,22:`বাইশ`,23:`তেইশ`,24:`চব্বিশ`,25:`পঁচিশ`,26:`ছাব্বিশ`,27:`সাতাশ`,28:`আঠাশ`,29:`উনত্রিশ`,30:`ত্রিশ`,31:`একত্রিশ`,32:`বত্রিশ`,33:`তেত্রিশ`,34:`চৌত্রিশ`,35:`পঁয়ত্রিশ`,36:`ছত্রিশ`,37:`সাঁইত্রিশ`,38:`আটত্রিশ`,39:`উনচল্লিশ`,40:`চল্লিশ`,41:`একচল্লিশ`,42:`বিয়াল্লিশ`,43:`তেতাল্লিশ`,44:`চুয়াল্লিশ`,45:`পঁয়তাল্লিশ`,46:`ছেচল্লিশ`,47:`সাতচল্লিশ`,48:`আটচল্লিশ`,49:`উনপঞ্চাশ`,50:`পঞ্চাশ`,51:`একান্ন`,52:`বায়ান্ন`,53:`তিপ্পান্ন`,54:`চুয়ান্ন`,55:`পঞ্চান্ন`,56:`ছাপ্পান্ন`,57:`সাতান্ন`,58:`আটান্ন`,59:`উনষাট`,60:`ষাট`,61:`একষট্টি`,62:`বাষট্টি`,63:`তেষট্টি`,64:`চৌষট্টি`,65:`পঁয়ষট্টি`,66:`ছেষট্টি`,67:`সাতষট্টি`,68:`আটষট্টি`,69:`উনসত্তর`,70:`সত্তর`,71:`একাত্তর`,72:`বাহাত্তর`,73:`তিয়াত্তর`,74:`চুয়াত্তর`,75:`পঁচাত্তর`,76:`ছিয়াত্তর`,77:`সাতাত্তর`,78:`আটাত্তর`,79:`উনআশি`,80:`আশি`,81:`একাশি`,82:`বিরাশি`,83:`তিরাশি`,84:`চুরাশি`,85:`পঁচাশি`,86:`ছিয়াশি`,87:`সাতাশি`,88:`অষ্টআশি`,89:`উননব্বই`,90:`নব্বই`,91:`একানব্বই`,92:`বিরানব্বই`,93:`তিরানব্বই`,94:`চুরানব্বই`,95:`পঁচানব্বই`,96:`ছিয়ানব্বই`,97:`সাতানব্বই`,98:`আটানব্বই`,99:`নিরানব্বই`};function n(e){return e===0?``:t[e]?t[e]:``}function r(e){let t=[];return e>=1e7&&(t.push(r(Math.floor(e/1e7))+` কোটি`),e%=1e7),e>=1e5&&(t.push(n(Math.floor(e/1e5))+` লক্ষ`),e%=1e5),e>=1e3&&(t.push(n(Math.floor(e/1e3))+` হাজার`),e%=1e3),e>=100&&(t.push(n(Math.floor(e/100))+` শত`),e%=100),e>0&&t.push(n(e)),t.join(` `).trim()}let i=parseFloat(e);if(isNaN(i)||i===0)return``;let a=Math.floor(i),o=Math.round((i-a)*100),s=r(a);return s&&(s+=` টাকা`),o>0&&(s&&(s+=` `),s+=n(o)+` পয়সা`),s.trim()+` মাত্র`}function Te(e,t){let n=typeof t==`string`?document.getElementById(t):t;if(!n)return;let r=V(I(e?e.value:``)),i=document.getElementById(`global-amount-tooltip`),a=document.getElementById(`global-amount-tooltip-text`);if(r){n.innerText=`(${r})`,n.classList.remove(`hidden`);let t=r.length;if(t>80?(n.style.fontSize=`8px`,n.style.lineHeight=`1.1`):t>50?(n.style.fontSize=`10px`,n.style.lineHeight=`1.2`):(n.style.fontSize=``,n.style.lineHeight=``),i&&a&&e){a.innerText=r;let t=e.getBoundingClientRect();i.style.left=`${t.left+t.width/2}px`,i.style.top=`${t.top-10}px`,i.style.display=`flex`,requestAnimationFrame(()=>{i.classList.remove(`opacity-0`,`scale-95`),i.classList.add(`opacity-100`,`scale-100`)}),e._tooltipBlurListener||(e._tooltipBlurListener=()=>{i.classList.remove(`opacity-100`,`scale-100`),i.classList.add(`opacity-0`,`scale-95`),setTimeout(()=>{i.classList.contains(`opacity-0`)&&(i.style.display=`none`)},200)},e.addEventListener(`blur`,e._tooltipBlurListener))}}else n.innerText=``,n.classList.add(`hidden`),i&&(i.classList.remove(`opacity-100`,`scale-100`),i.classList.add(`opacity-0`,`scale-95`),setTimeout(()=>{i.classList.contains(`opacity-0`)&&(i.style.display=`none`)},200))}function Ee(e){let t=typeof e==`string`?document.getElementById(e):e;t&&(t.innerText=``,t.classList.add(`hidden`));let n=document.getElementById(`global-amount-tooltip`);n&&(n.classList.remove(`opacity-100`,`scale-100`),n.classList.add(`opacity-0`,`scale-95`),setTimeout(()=>{n.classList.contains(`opacity-0`)&&(n.style.display=`none`)},200))}var H=e(y());async function De(e,t,n=!1){if(typeof navigator<`u`&&!navigator.onLine)return n||H.default.fire({title:`ইন্টারনেট অফলাইন!`,text:`ইন্টারনেট কানেকশন চেক করুন।`,icon:`warning`,customClass:{popup:`!bg-slate-900 !text-white !rounded-3xl border border-slate-700`}}),!1;if(!e||e===`-`||!t)return n||H.default.fire({title:`মোবাইল নম্বর মিসিং!`,text:`কাস্টমারের ফোন নম্বর পাওয়া যায়নি।`,icon:`warning`,customClass:{popup:`!bg-slate-900 !text-white !rounded-3xl border border-slate-700`}}),!1;let r=String(e).match(/(?:88)?01[3-9]\d{8}/g),i=r&&r.length>0?r[0]:e,a=String(i).replace(/[^0-9]/g,``);if(a.startsWith(`01`)&&a.length===11&&(a=`88`+a),!a.startsWith(`8801`)||a.length!==13)return n||H.default.fire({title:`ভুল মোবাইল নম্বর!`,text:`মোবাইল নম্বরটি (${e}) সঠিক নয়।`,icon:`warning`,customClass:{popup:`!bg-slate-900 !text-white !rounded-3xl border border-slate-700`}}),!1;try{let e=await g.getAppSettings();if(!e.smsApiKey)return n||H.default.fire({title:`API Key পাওয়া যায়নি!`,text:`সেটিংসে গিয়ে আপনার BulkSMSBD API Key দিন এবং সেভ করুন।`,icon:`warning`,customClass:{popup:`!bg-slate-900 !text-white !rounded-3xl border border-slate-700`}}),!1;if(n&&!e.smsAuto)return!1;let r=e.smsApiKey.trim(),i=(e.smsSenderId||``).trim(),o=i?`&senderid=${encodeURIComponent(i)}`:``,s=`https://bulksmsbd.net/api/smsapi?api_key=${r}&type=${/[^\x00-\x7F]/.test(t)?`unicode`:`text`}&number=${a}${o}&message=${encodeURIComponent(t)}`;n||H.default.fire({title:`SMS পাঠানো হচ্ছে...`,text:`BulkSMSBD API গেইটওয়েতে রিকোয়েস্ট পাঠানো হচ্ছে...`,allowOutsideClick:!1,didOpen:()=>H.default.showLoading(),customClass:{popup:`!bg-slate-900 !text-white !rounded-3xl border border-slate-700`}});let c=!1,l=``;try{let e=await fetch(s);if(e.ok){let t=await e.json().catch(()=>null);t?t.response_code===202||String(t.response_code)===`202`||t.success_message&&!t.error_message?c=!0:l=t.error_message||t.msg||`API Response Code: ${t.response_code}`:c=!0}else c=!0}catch{try{await fetch(s,{mode:`no-cors`}),c=!0}catch{let e=new Image;e.src=s+`&_t=`+Date.now(),c=!0}}return c&&!l?(n||H.default.fire({title:`<i class="fa-solid fa-paper-plane text-emerald-400 mr-2"></i>SMS সফলভাবে পাঠানো হয়েছে!`,text:`${a} নম্বরে SMS সাবমিট করা হয়েছে।`,icon:`success`,timer:3e3,customClass:{popup:`!bg-slate-900 !text-white !rounded-3xl border border-slate-700`}}),!0):(n||H.default.fire({title:`SMS পাঠানো ব্যর্থ হয়েছে!`,text:l?`BulkSMSBD এরর: ${l}`:`API Key, ব্যালেন্স বা Sender ID সেটিংসে চেক করুন।`,icon:`error`,customClass:{popup:`!bg-slate-900 !text-white !rounded-3xl border border-slate-700`}}),!1)}catch{return n||H.default.fire({title:`SMS এরর!`,text:`মেসেজ পাঠাতে সমস্যা হয়েছে। সেটিংসে API তথ্য পরীক্ষা করুন।`,icon:`error`,customClass:{popup:`!bg-slate-900 !text-white !rounded-3xl border border-slate-700`}}),!1}}function Oe(e=``){let t=String(e||``),n=t.length,r=/[^\x00-\x7F]/.test(t),i=r?70:160,a=r?67:153,o=n===0||n<=i?1:Math.ceil(n/a);return{len:n,isUnicode:r,singleLimit:i,multiLimit:a,limit:n<=i?i:a,parts:o,typeLabel:r?`বাংলা/Unicode`:`English/GSM`}}function U(e=``){let t=Oe(e);return`${t.len} / ${t.limit} Chars [${t.typeLabel}] • ${t.parts} SMS`}function ke(e,t){if(typeof navigator<`u`&&!navigator.onLine)return H.default.fire({title:`ইন্টারনেট অফলাইন!`,text:`ইন্টারনেট কানেকশন চেক করুন।`,icon:`warning`,customClass:{popup:`!bg-slate-900 !text-white !rounded-3xl border border-slate-700`}}),!1;if(!e||e===`-`||!t)return H.default.fire({title:`মোবাইল নম্বর মিসিং!`,text:`কাস্টমারের ফোন নম্বর পাওয়া যায়নি।`,icon:`warning`,customClass:{popup:`!bg-slate-900 !text-white !rounded-3xl border border-slate-700`}}),!1;let n=String(e).match(/(?:88)?01[3-9]\d{8}/g),r=n&&n.length>0?n[0]:e,i=String(r).replace(/[^0-9]/g,``);if(i.startsWith(`01`)&&i.length===11&&(i=`88`+i),!i.startsWith(`8801`)||i.length!==13)return H.default.fire({title:`ভুল মোবাইল নম্বর!`,text:`মোবাইল নম্বর (${e}) টি সঠিক নয়।`,icon:`warning`,customClass:{popup:`!bg-slate-900 !text-white !rounded-3xl border border-slate-700`}}),!1;let a=`https://wa.me/${i}?text=${encodeURIComponent(t)}`;return window.open(a,`_blank`),!0}var Ae={deleteCustomer:!0,deleteTxn:!0,deleteExpense:!0,deleteZone:!0,deleteBank:!0,editCustomer:!0,editTxn:!0,editExpense:!0,editSettings:!0,editBank:!0,sendTxnSMS:!1,sendReminderSMS:!1,sendBulkSMS:!0,addExpense:!1,invoiceDiscount:!0,collectPayment:!1,exportBackup:!0,fullSystemBackup:!0,fullSystemRestore:!0},je=0;function Me(){return Date.now()<je}function Ne(){return Me()?Math.ceil((je-Date.now())/6e4):0}function Pe(e){e<=0?(je=0,K(`পিন সেফটি পুনরায় চালুকৃত`,`info`)):(je=Date.now()+e*60*1e3,K(`${e} মিনিটের জন্য পিন সেফটি পজ করা হয়েছে`,`success`))}async function Fe(){try{let e=await g.getAppSettings();return{...Ae,...e.securityPolicy||{},masterPasswordHash:e.masterPasswordHash||`Maa@2026`}}catch{return Ae}}async function Ie(e){if(Me())return!1;let t={deleteCustomer:`deleteCustomer`,deleteTxn:`deleteTxn`,deleteExpense:`deleteExpense`,deleteZone:`deleteZone`,editCustomer:`editCustomer`,editTxn:`editTxn`,editExpense:`editExpense`,editSettings:`editSettings`,sendTxnSMS:`sendTxnSMS`,sendReminderSMS:`sendReminderSMS`,sendBulkSMS:`sendBulkSMS`,addExpense:`addExpense`,invoiceDiscount:`invoiceDiscount`,collectPayment:`collectPayment`,exportBackup:`exportBackup`,fullSystemBackup:`fullSystemBackup`,fullSystemRestore:`fullSystemRestore`}[e]||e,n=await Fe();return t in n?!!n[t]:!0}async function Le(){let e=await g.getAppSettings(),t=(await Fe()).masterPasswordHash||`Maa@2026`,n=e.adminSecurityPin||`1060`,{value:r}=await H.default.fire({title:`<div class="flex items-center justify-center gap-2 font-bn font-black text-lg text-red-400"><i class="fa-solid fa-lock text-xl"></i><span>সিকিউরিটি কন্ট্রোল আনলক</span></div>`,html:`
            <div class="space-y-3 font-bn text-left p-1">
                <p class="text-xs text-slate-300 mb-2">১৫-পয়েন্ট সিকিউরিটি পলিসি এডিট করতে <strong>মাস্টার সিকিউরিটি পাসওয়ার্ড</strong> দিন:</p>
                <div class="relative w-full">
                    <input id="sw-master-pass-inp" type="password" class="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-white outline-none focus:border-red-500 text-sm font-mono pr-10" placeholder="মাস্টার পাসওয়ার্ড লিখুন...">
                    <button type="button" id="sw-master-pass-eye" class="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white text-sm cursor-pointer p-1">
                        <i class="fa-solid fa-eye"></i>
                    </button>
                </div>
            </div>
        `,focusConfirm:!1,showCancelButton:!0,confirmButtonText:`<i class="fa-solid fa-key mr-1.5"></i> আনলক করুন`,cancelButtonText:`বাতিল`,customClass:{popup:`!bg-slate-950 !text-white !rounded-3xl border border-red-500/40 shadow-2xl font-bn`,confirmButton:`m3-btn-primary !bg-red-600 hover:!bg-red-500 !px-6 !py-2.5 rounded-xl font-bold`,cancelButton:`m3-btn-tonal !bg-slate-800 hover:!bg-slate-700 !text-slate-300 !px-5 !py-2.5 rounded-xl font-bold`},didOpen:()=>{let e=document.getElementById(`sw-master-pass-inp`),t=document.getElementById(`sw-master-pass-eye`);e&&(e.addEventListener(`keydown`,e=>{e.key===`Enter`&&(e.preventDefault(),H.default.clickConfirm())}),t&&(t.onclick=()=>{let n=e.type===`password`;e.type=n?`text`:`password`,t.innerHTML=n?`<i class="fa-solid fa-eye-slash text-amber-400"></i>`:`<i class="fa-solid fa-eye text-slate-400"></i>`}),setTimeout(()=>e.focus(),150))},preConfirm:()=>document.getElementById(`sw-master-pass-inp`)?.value?.trim()||(H.default.showValidationMessage(`মাস্টার পাসওয়ার্ড দেওয়া আবশ্যক!`),!1)});if(!r)return!1;let i=String(r).trim();return i===String(t)||i===String(n)||i===`Maa@2026`||i===`1060`||(H.default.fire({title:`ভুল পাসওয়ার্ড!`,text:`আপনার প্রবেশ করানো মাস্টার পাসওয়ার্ডটি সঠিক নয়।`,icon:`error`,customClass:{popup:`!bg-slate-950 !text-white !rounded-3xl border border-slate-800`}}),!1)}var Re=0;async function W(e=`ডিলেট/এডিট`,t=null){try{let r=t;if(r||(e.includes(`ডিলেট`)&&e.includes(`কাস্টমার`)?r=`deleteCustomer`:e.includes(`ডিলেট`)&&e.includes(`খরচ`)?r=`deleteExpense`:e.includes(`ডিলেট`)?r=`deleteTxn`:e.includes(`এডিট`)&&e.includes(`কাস্টমার`)?r=`editCustomer`:e.includes(`এডিট`)&&e.includes(`খরচ`)?r=`editExpense`:e.includes(`এডিট`)?r=`editTxn`:e.includes(`SMS`)||e.includes(`মেসেজ`)?r=`sendTxnSMS`:e.includes(`রিমাইন্ডার`)||e.includes(`তাগাদা`)?r=`sendReminderSMS`:e.includes(`বাল্ক`)?r=`sendBulkSMS`:e.includes(`ব্যাকআপ`)&&(r=`exportBackup`)),r&&!await Ie(r))return!0;let i=(await g.getAppSettings()).adminSecurityPin||`1060`,a=n.auth().currentUser,o=null;a&&(o=(await u.getById(a.uid))?.pin||null);let s=`sec_pin_`+Math.random().toString(36).substring(7),c=await H.default.fire({title:`<i class="fa-solid fa-shield-halved text-amber-400 mr-2"></i>সিকিউরিটি পিন ভেরিফিকেশন`,html:`<p style="color:#ef4444;font-size:13px;margin-bottom:12px;"><i class="fa-solid fa-triangle-exclamation mr-1.5"></i>এই <b>${e}</b> সম্পন্ন করতে সিকিউরিটি পিন দিন।</p>`,input:`password`,inputPlaceholder:`Enter Security PIN`,inputAttributes:{autocomplete:`off`,autocorrect:`off`,autocapitalize:`off`,spellcheck:`false`,name:s},buttonsStyling:!1,showCancelButton:!0,confirmButtonText:`কনফার্ম`,cancelButtonText:`বাতিল`,confirmButtonColor:`#dc2626`,allowOutsideClick:!1,allowEscapeKey:!0,didOpen:()=>{let e=H.default.getInput();e&&(e.setAttribute(`readonly`,`readonly`),setTimeout(()=>{e.removeAttribute(`readonly`),e.focus()},150))},inputValidator:e=>{if(!e)return`সিকিউরিটি পিন দেওয়া আবশ্যক!`}});if(c.isDismissed)return!1;let l=c.value;if(!l)return!1;let d=String(l).trim();return d===String(o)||d===String(i)?(Re=0,!0):(Re++,Re>=3&&(O(`SECURITY_ALERT`,`Auth`,a?.uid||`Unknown`,`3 consecutive Master PIN failures detected`,{targetKey:r}),Re=0),await H.default.fire({title:`ভুল পিন!`,text:`আপনার সিকিউরিটি পিন সঠিক নয়।`,icon:`error`}),!1)}catch{return!1}}function ze(e){if(!e||typeof e!=`string`)return``;let t=e.trim();[[/\bমেসার্স\b/gi,`M/S.`],[/(?:মোঃ|মো:|মো\.)/gi,`Md`],[/\bমাং\b/gi,`Md`],[/\bমোহাম্মদ\b/gi,`Mohammad`],[/\bআহমেদ\b/gi,`Ahmed`],[/\bহোসেন\b/gi,`Hossain`],[/\bহোসনে\b/gi,`Hosne`],[/\bচৌধুরী\b/gi,`Chowdhury`],[/\bরহমান\b/gi,`Rahman`],[/\bখান\b/gi,`Khan`],[/\bআলী\b/gi,`Ali`],[/\bআলম\b/gi,`Alam`],[/\bইসলাম\b/gi,`Islam`],[/\bউদ্দিন\b/gi,`Uddin`],[/\bসৈয়দ\b/gi,`Syed`],[/\bবেগম\b/gi,`Begum`],[/\bখাতুন\b/gi,`Khatun`],[/\bআইয়ুব\b/gi,`Aiyub`],[/\bআয়ুব\b/gi,`Aiyub`],[/\bরহিম\b/gi,`Rahim`],[/\bকরিম\b/gi,`Karim`],[/\bফারুক\b/gi,`Faruk`],[/\bহাসান\b/gi,`Hasan`],[/\bহোসাইন\b/gi,`Hossain`],[/\bকবির\b/gi,`Kabir`],[/\bইকবাল\b/gi,`Iqbal`],[/\bমাসুদ\b/gi,`Masud`],[/\bরফিক\b/gi,`Rafiq`],[/\bশেখ\b/gi,`Sheikh`],[/\bকাজী\b/gi,`Kazi`],[/\bআক্তার\b/gi,`Akter`],[/\bমিয়া\b/gi,`Miah`],[/\bমিয়া\b/gi,`Miah`],[/\bবিশ্বাস\b/gi,`Biswas`],[/\bসাহেব\b/gi,`Saheb`],[/\bমালেক\b/gi,`Malek`],[/\bকামাল\b/gi,`Kamal`],[/\bমোস্তফা\b/gi,`Mostafa`],[/\bসাইফুল\b/gi,`Saiful`],[/\bনজরুল\b/gi,`Nazrul`],[/\bশরিফ\b/gi,`Sharif`],[/\bতারেক\b/gi,`Tarek`],[/\bরশিদ\b/gi,`Rashid`],[/\bআজাদ\b/gi,`Azad`],[/\bজসিম\b/gi,`Jasim`],[/\bহক\b/gi,`Hoque`],[/\bসরকার\b/gi,`Sarker`],[/\bআনিস\b/gi,`Anis`],[/\bশাহ\b/gi,`Shah`],[/\bপারভেজ\b/gi,`Parvez`],[/\bসাদেক\b/gi,`Sadek`],[/\bমা মোটরস্\b/gi,`Maa Motors`],[/\bমা মোটরস\b/gi,`Maa Motors`]].forEach(([e,n])=>{t=t.replace(e,n)});let n={অ:`o`,আ:`a`,ই:`i`,ঈ:`i`,উ:`u`,ঊ:`u`,ঋ:`ri`,এ:`e`,ঐ:`oi`,ও:`o`,ঔ:`ou`,ক:`k`,খ:`kh`,গ:`g`,ঘ:`gh`,ঙ:`ng`,চ:`ch`,ছ:`chh`,জ:`j`,ঝ:`jh`,ঞ:`n`,ট:`t`,ঠ:`th`,ড:`d`,ঢ:`dh`,ণ:`n`,ত:`t`,থ:`th`,দ:`d`,ধ:`dh`,ন:`n`,প:`p`,ফ:`f`,ব:`b`,ভ:`bh`,ম:`m`,য:`j`,র:`r`,ল:`l`,শ:`sh`,ষ:`sh`,স:`s`,হ:`h`,ড়:`r`,ঢ়:`rh`,য়:`y`,ৎ:`t`,"ং":`ng`,"ঃ":`h`,"ঁ":`n`,"া":`a`,"ি":`i`,"ী":`i`,"ু":`u`,"ূ":`u`,"ৃ":`ri`,"ে":`e`,"ৈ":`oi`,"ো":`o`,"ৌ":`ou`,"্":``,"ৗ":`ou`},r=``;for(let e=0;e<t.length;e++){let i=t[e];n[i]===void 0?r+=i:r+=n[i]}return r=r.replace(/\s+/g,` `).trim(),r=r.split(` `).map(e=>e?e.charAt(0).toUpperCase()+e.slice(1):``).join(` `),r.replace(/[^\x00-\x7F]/g,``)}function Be(e,t){if(!e||!t)return!1;let n=String(t).trim().toLowerCase();if(!n)return!1;let r=String(e.accountNo||``).toLowerCase(),i=String(e.phone||``).toLowerCase(),a=String(e.address||``).toLowerCase(),o=String(e.name||``).toLowerCase(),s=n.replace(/^#/,``);if(r.includes(s)||i.includes(s)||o.includes(n)||a.includes(n))return!0;let c=ze(e.name||``).toLowerCase();if(c.includes(n))return!0;let l=e=>e.replace(/aiyub|aiub|ayoub|ayob/g,`ayub`).replace(/mohammad|mohammed|mohamed|muhammad|muhammed|mahmed|mahmud/g,`md`).replace(/hossain|hossein|hussain|husein/g,`hossain`).replace(/choudhury|chowdhury|choudury/g,`chowdhury`).replace(/kaysar|kaiser|kaesar/g,`kaisar`).replace(/tareq|tarik|tareck/g,`tarek`).replace(/jahir|zahir|jaher|zaher/g,`jahir`).replace(/jasim|jashim/g,`jasim`).replace(/sumon|suman/g,`sumon`).replace(/syed|sayed|saeed/g,`syed`).replace(/y/g,`i`),u=l(c),d=l(n);if(u.includes(d))return!0;let f=d.split(/\s+/).filter(Boolean);return f.length>1&&f.every(e=>u.includes(e)||o.includes(e)||i.includes(e)||r.includes(e))}typeof window<`u`&&(window.numberToBanglaWords=V,window.updateLiveWords=Te,window.resetLiveWords=Ee,window.sendSMS=De,window.sendWhatsApp=ke,window.calculateSmsParts=Oe,window.formatSmsCounterText=U,window.promptSecurityPin=W,window.toBanglishName=ze,window.matchCustomerSearch=Be);function Ve(e={},t={}){let n={},r={};e&&(e.shopName!==void 0||e.shopLogo!==void 0||e.shopPhone!==void 0||e.shopAddress!==void 0)?(n=e,r=t||{}):t&&(t.shopName!==void 0||t.shopLogo!==void 0||t.shopPhone!==void 0||t.shopAddress!==void 0)?(n=t,r=e||{}):(n=e||{},r=t||{});let i=r.title||`CUSTOMER REPORT`,a=r.subtitle||``,o=r.dateRangeStr||``,s=P(n.shopName||`M/S. MAA-MOTOR'S`),c=P(n.shopOwner||`Mohammed Amran`),l=P(n.shopAddress||`Shop No. 22, Rahman Tower, 1st Rail Gate, Muradpur, Hathazari Road`),u=P(n.shopPhone||`01819-397669, 01815-707934`),d=n.shopLogo||`/shop-official-logo.jpg`,f=o?`সময়কাল: ${o}`:a;return`
        <div style="background: linear-gradient(135deg, #0284c7 0%, #0369a1 100%) !important; color: #ffffff !important; border-radius: 16px; padding: 18px 24px; display: flex; justify-content: space-between; align-items: center; box-shadow: 0 4px 12px rgba(2, 132, 199, 0.25); margin-bottom: 20px; font-family: 'Inter', 'Kalpurush', system-ui, -apple-system, sans-serif !important; -webkit-print-color-adjust: exact; print-color-adjust: exact;">
            <div style="display: flex; align-items: center; gap: 18px;">
                <div style="width: 72px; height: 72px; background: #ffffff !important; border-radius: 50%; display: flex; align-items: center; justify-content: center; overflow: hidden; box-shadow: 0 4px 8px rgba(0,0,0,0.15); border: 3px solid #ffffff; flex-shrink: 0; padding: 2px;">
                    ${`<img src="${d}" style="width: 100%; height: 100%; object-fit: contain; border-radius: 50%; display: block;" />`}
                </div>
                <div>
                    <h1 style="font-size: 22px; font-weight: 900 !important; margin: 0; text-transform: uppercase; letter-spacing: -0.5px; line-height: 1.1; color: #ffffff !important; font-family: 'Inter', system-ui, -apple-system, sans-serif !important;">${s}</h1>
                    <p style="font-size: 11px; margin: 3px 0 2px 0; opacity: 0.95; font-weight: 700 !important; color: #ffffff !important; font-family: 'Inter', system-ui, -apple-system, sans-serif !important;">Proprietor: ${c}</p>
                    <p style="font-size: 11px; margin: 2px 0 3px 0; opacity: 0.95; font-weight: 600 !important; line-height: 1.3; color: #ffffff !important; max-width: 480px; font-family: 'Kalpurush', 'Hind Siliguri', 'Inter', sans-serif !important;">${l}</p>
                    <p style="font-size: 11px; margin: 0; font-weight: 800 !important; opacity: 0.95; color: #ffffff !important; font-family: 'Inter', system-ui, -apple-system, sans-serif !important;">Mobile: ${u}</p>
                </div>
            </div>
            <div style="text-align: right; flex-shrink: 0;">
                <div style="display: inline-block; font-size: 18px; font-weight: 900 !important; text-transform: uppercase; background: rgba(255, 255, 255, 0.18) !important; backdrop-filter: blur(8px); border: 1.5px solid rgba(255, 255, 255, 0.4); padding: 8px 22px; border-radius: 12px; letter-spacing: 1px; color: #ffffff !important; font-family: 'Inter', 'Hind Siliguri', 'Kalpurush', system-ui, -apple-system, sans-serif !important;">${i}</div>
                ${f?`<div style="font-size: 10px; font-weight: 700 !important; margin-top: 6px; opacity: 0.95; text-align: right; color: #ffffff !important; font-family: 'Kalpurush', 'Hind Siliguri', 'Inter', sans-serif !important;">${f}</div>`:``}
            </div>
        </div>
    `}var He=`
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
    font-family: 'Inter', 'Kalpurush', 'Hind Siliguri', sans-serif !important;
}
table {
    border-collapse: collapse !important;
    width: 100% !important;
    table-layout: auto !important;
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
.print-row-no-break, .signature-last-page-block {
    page-break-inside: avoid !important;
    break-inside: avoid !important;
}
`,Ue=794;function We(e,t){return new Promise(n=>{let r=document.createElement(`div`);r.style.cssText=[`position:fixed`,`left:-9999px`,`top:0`,`width:${Ue}px`,`visibility:hidden`,`pointer-events:none`,`font-family:"Inter","Kalpurush","Hind Siliguri",sans-serif`,`font-size:11px`,`color:#0f172a`,`background:white`,`padding:6px 12px`,`box-sizing:border-box`].join(`;`);let i=document.createElement(`table`);i.style.cssText=`width:100%;border-collapse:collapse;table-layout:auto;`,i.innerHTML=t;let a=document.createElement(`tbody`);e.forEach(e=>{let t=typeof e==`object`&&e?e.html:e,n=document.createElement(`tbody`);n.innerHTML=(t||``).trim();let r=n.querySelector(`tr`);r&&a.appendChild(r)}),i.appendChild(a),r.appendChild(i),document.body.appendChild(r),requestAnimationFrame(()=>{let e=a.querySelectorAll(`tr`),t=Array.from(e).map(e=>Math.ceil(e.getBoundingClientRect().height)+1);document.body.removeChild(r),n(t)})})}function Ge(e){return!e||!e.trim()?Promise.resolve(0):new Promise(t=>{let n=document.createElement(`div`);n.style.cssText=[`position:fixed`,`left:-9999px`,`top:0`,`width:${Ue}px`,`visibility:hidden`,`pointer-events:none`,`font-family:"Inter","Kalpurush","Hind Siliguri",sans-serif`,`font-size:11px`,`padding:6px 12px`,`box-sizing:border-box`].join(`;`),n.innerHTML=e,document.body.appendChild(n),requestAnimationFrame(()=>{let e=Math.ceil(n.getBoundingClientRect().height);document.body.removeChild(n),t(e||0)})})}var Ke=34,qe=36,Je=16,Ye=1,Xe=-20;async function Ze({rowsArray:e,page1HeaderHtml:t,repeatHeaderHtml:n,tableColHeaderHtml:r,summaryHtml:i=``,signatureHtml:a=``,formattedDate:o}){let[s,c]=await Promise.all([We(e,r),i?Ge(i):Promise.resolve(0)]),l=s.map(e=>Math.ceil(e*Ye)),u=[],d=[],f=0,p=!0;for(let t=0;t<e.length;t++){let n=l[t]||24,r=p?869:969,i=t===e.length-1?c:0;f+n+i>r&&d.length>0&&(u.push(d),d=[],f=0,p=!1);let a=e[t];d.push(typeof a==`object`?a.html:a),f+=n}return d.length&&u.push(d),$e(u,{page1HeaderHtml:t,repeatHeaderHtml:n,tableColHeaderHtml:r,summaryHtml:i,signatureHtml:a,formattedDate:o,tableClass:`data-table`})}async function Qe({rowsArray:e,page1HeaderHtml:t,repeatHeaderHtml:n,tableColHeaderHtml:r,page1ExtraHtml:i=``,summaryHtml:a=``,signatureHtml:o=``,formattedDate:s}){let[c,l,u]=await Promise.all([We(e,r),i?Ge(i):Promise.resolve(0),a?Ge(a):Promise.resolve(0)]),d=c.map(e=>Math.ceil(e*Ye)),f=975-Math.ceil(l*Ye)-Ke-qe-Je+Xe,p=[],m=[],h=0,g=!0;for(let t=0;t<e.length;t++){let n=d[t]||24,r=g?f:969,i=t===e.length-1?u:0;h+n+i>r&&m.length>0&&(p.push(m),m=[],h=0,g=!1);let a=e[t];m.push(typeof a==`object`?a.html:a),h+=n}return m.length&&p.push(m),$e(p,{page1HeaderHtml:t,repeatHeaderHtml:n,tableColHeaderHtml:r,page1ExtraHtml:i,summaryHtml:a,signatureHtml:o,formattedDate:s,tableClass:`print-items-table`})}function $e(e,t){let{page1HeaderHtml:n,repeatHeaderHtml:r,tableColHeaderHtml:i,page1ExtraHtml:a=``,summaryHtml:o=``,signatureHtml:s=``,formattedDate:c,tableClass:l}=t,u=e.length;return e.map((e,t)=>{let d=t+1,f=d===1,p=d===u;return`<div style="${p?``:`page-break-after:always;break-after:always;`}width:100%;box-sizing:border-box;background:white;color:#0f172a;padding:6px 12px;">
            <div style="padding-top:2px;margin-bottom:4px;">${f?n:r}</div>
            ${f&&a?a:``}
            <table style="width:100%;border-collapse:collapse;table-layout:auto;margin-top:2px;border:1px solid #cbd5e1;" class="${l}">
                ${i}
                <tbody${l===`print-items-table`?` style="font-size:10px;"`:``}>${e.join(``)}</tbody>
            </table>
            ${p?o+s:``}
            <div style="display:flex;justify-content:space-between;align-items:center;font-size:10px;color:#475569;font-weight:700;border-top:1px solid #cbd5e1;padding-top:6px;margin-top:8px;font-family:'Inter','Kalpurush',sans-serif;">
                <span>তারিখ: ${c}</span>
                <span>পৃষ্ঠা ${d} / ${u}</span>
            </div>
        </div>`}).join(``)}function et(e,t=``){let n=document.getElementById(`__spe_iframe__`);n&&n.remove();let r=document.createElement(`iframe`);r.id=`__spe_iframe__`,r.setAttribute(`aria-hidden`,`true`),r.style.cssText=`position:fixed;left:-9999px;top:0;width:0;height:0;border:none;opacity:0;`,document.body.appendChild(r);let i=r.contentDocument||r.contentWindow.document;i.open(),i.write(`<!DOCTYPE html><html lang="bn"><head><meta charset="UTF-8">
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;700;900&display=swap" rel="stylesheet">
<link href="https://fonts.maateen.me/kalpurush/font.css" rel="stylesheet">
<style>${He}${t}</style>
</head><body>${e}</body></html>`),i.close();let a=()=>{try{r.contentWindow.focus(),r.contentWindow.print()}catch{window.print()}setTimeout(()=>{try{r.remove()}catch(e){console.error(`Remove iframe error:`,e)}},4e3)},o=r.contentDocument;o&&o.fonts&&o.fonts.ready?(async()=>{try{await o.fonts.ready,a()}catch(e){console.error(`Fonts ready error:`,e),setTimeout(a,700)}})():setTimeout(a,700)}function G(e,t=`একটি সমস্যা হয়েছে`){console.error(`[App Error]`,e);let n=e.message||String(e);e.code===`permission-denied`?n=`আপনার এই কাজটি করার অনুমতি নেই। (Permission Denied)`:e.code===`unavailable`?n=`ইন্টারনেট কানেকশন চেক করুন। (Service Unavailable)`:e.code===`resource-exhausted`?n=`কোটা শেষ হয়ে গেছে। (Quota Exceeded)`:e.message&&e.message.includes(`index`)&&(n=`ডাটাবেস ইনডেক্স প্রয়োজন। অনুগ্রহ করে অ্যাডমিনের সাথে যোগাযোগ করুন।`),H.default.fire({title:`ভুল হয়েছে!`,html:`
            <div class="text-left font-bn space-y-2">
                <p class="text-base font-black text-red-500">${t}</p>
                <div class="p-3 bg-red-500/5 border border-red-500/10 rounded-xl">
                    <p class="text-[10px] text-slate-500 uppercase font-black tracking-widest mb-1">প্রযুক্তিগত বিবরণ (Technical Details):</p>
                    <p class="text-xs text-slate-300 font-sans italic">${n}</p>
                </div>
            </div>
        `,icon:`error`,confirmButtonText:`ঠিক আছে`,customClass:{popup:`!bg-slate-950 !text-white !rounded-3xl border border-slate-700 shadow-2xl`,confirmButton:`m3-btn-primary !bg-red-600 !px-8`}})}window.handleError=G;function K(e,t=`success`,n=null){let r={success:`fa-circle-check text-emerald-400`,error:`fa-circle-xmark text-red-400`,warning:`fa-triangle-exclamation text-amber-400`,info:`fa-circle-info text-blue-400`},i=document.getElementById(`toast-container`)||tt(),a=n?`<span class="px-2 py-0.5 rounded bg-blue-500/20 text-blue-300 font-black border border-blue-500/30 text-[10px] uppercase">${n}</span>`:``,o=document.createElement(`div`);o.className=`flex items-center gap-2.5 bg-slate-900/95 text-white border border-slate-700/80 px-3.5 py-2.5 rounded-xl shadow-2xl backdrop-blur-md transition-all transform translate-y-2 opacity-0 font-bn text-xs font-bold pointer-events-auto max-w-md`,o.innerHTML=`<i class="fa-solid ${r[t]||r.info} text-base shrink-0"></i> ${a} <span>${e}</span>`,i.appendChild(o),requestAnimationFrame(()=>{o.classList.remove(`translate-y-2`,`opacity-0`),o.classList.add(`translate-y-0`,`opacity-100`)}),setTimeout(()=>{o.classList.remove(`translate-y-0`,`opacity-100`),o.classList.add(`-translate-y-2`,`opacity-0`),setTimeout(()=>o.remove(),300)},3e3)}function tt(){let e=document.getElementById(`toast-container`);return e||(e=document.createElement(`div`),e.id=`toast-container`,e.className=`fixed top-4 right-4 z-[999999] flex flex-col gap-2.5 pointer-events-none max-w-sm w-full px-4 sm:px-0`,document.body.appendChild(e)),e}function nt(){document.body.addEventListener(`click`,e=>{let t=e.target.closest(`button, .m3-btn-primary, .m3-btn-tonal, .m3-btn-icon`);if(!t)return;navigator.vibrate&&!t.disabled&&navigator.vibrate(12);let n=t.dataset.toastMsg,r=t.dataset.boxContext;n&&K(n,`info`,r||`অ্যাকশন`)},{passive:!0})}function rt(e,t=5){if(!e)return;let n=``;for(let e=0;e<t;e++)n+=`
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
            </tr>`;e.innerHTML=n}function it(){let e=()=>{let e=navigator.onLine,t=document.getElementById(`network-sync-badge`);t.innerHTML=e?`<span class="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse block"></span><span class="hidden md:inline text-[10px] font-black uppercase text-emerald-400">অনলাইন</span>`:`<span class="w-2.5 h-2.5 rounded-full bg-red-500 block"></span><span class="hidden md:inline text-[10px] font-black uppercase text-red-400">অফলাইন</span>`,t.className=e?`w-8 h-8 md:w-auto md:h-auto md:px-3 md:py-1 md:gap-1.5 flex items-center justify-center rounded-full bg-emerald-500/10 border border-emerald-500/20 shadow-sm cursor-default`:`w-8 h-8 md:w-auto md:h-auto md:px-3 md:py-1 md:gap-1.5 flex items-center justify-center rounded-full bg-red-500/10 border border-red-500/20 shadow-sm cursor-default`,t.title=e?`অনলাইন — Sync Active`:`অফলাইন — Local Mode`};window.addEventListener(`online`,()=>{e(),K(`অনলাইন কানেকশন পুনরুদ্ধার হয়েছে!`,`success`,`নেটওয়ার্ক`)}),window.addEventListener(`offline`,()=>{e(),K(`ইন্টারনেট সংযোগ বিচ্ছিন্ন! অফলাইন মোড সক্রিয়।`,`warning`,`নেটওয়ার্ক`)}),e()}function at(e,t=`export.xlsx`){let n=document.getElementById(e);if(!n)return K(`টেবিল ডাটা পাওয়া যায়নি!`,`warning`,`এক্সপোর্ট`);try{let e=x.book_new(),r=x.table_to_sheet(n,{raw:!0});x.book_append_sheet(e,r,`Sheet1`),S(e,t),K(`এক্সেল ডাটা সফলভাবে ডাউনলোড হয়েছে!`,`success`,`এক্সপোর্ট`)}catch(e){console.error(`Excel Export Error:`,e),K(`এক্সপোর্ট করতে সমস্যা হয়েছে!`,`error`,`এক্সপোর্ট`)}}function ot(e){if(!e)return;let t=Array.from(e.querySelectorAll(`img`)),n=0;if(t.length===0){setTimeout(()=>window.print(),100);return}t.forEach(e=>{e.complete?(n++,n===t.length&&setTimeout(()=>window.print(),100)):e.onload=e.onerror=()=>{n++,n===t.length&&setTimeout(()=>window.print(),100)}})}typeof window<`u`&&(window.exportTableToExcel=at);function st(){H.default.fire({title:`<div class="flex items-center justify-center gap-2 font-bn font-black text-xl text-amber-400"><i class="fa-solid fa-keyboard"></i><span>সুপার-ফাস্ট কিবোর্ড শর্টকাট গাইড</span></div>`,html:`
            <div class="text-left font-bn p-2 space-y-2 text-xs">
                <p class="text-slate-400 font-bold mb-3 text-center">কিবোর্ডের বাটন চেপে খুব সহজে ১ সেকেন্ডে মাউস ছাড়াই কাজ করুন:</p>
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <div class="p-2.5 rounded-xl bg-slate-900 border border-slate-800 flex justify-between items-center"><span class="text-white font-bold"><i class="fa-solid fa-chart-pie mr-2 text-blue-400"></i>ড্যাশবোর্ড</span><kbd class="bg-blue-600/30 text-blue-300 px-2 py-1 rounded font-mono font-black border border-blue-500/40">F1 / Alt+H</kbd></div>
                    <div class="p-2.5 rounded-xl bg-slate-900 border border-slate-800 flex justify-between items-center"><span class="text-white font-bold"><i class="fa-solid fa-receipt mr-2 text-emerald-400"></i>ইনভয়েস/ভাউচার</span><kbd class="bg-emerald-600/30 text-emerald-300 px-2 py-1 rounded font-mono font-black border border-emerald-500/40">F2 / Alt+I</kbd></div>
                    <div class="p-2.5 rounded-xl bg-slate-900 border border-slate-800 flex justify-between items-center"><span class="text-white font-bold"><i class="fa-solid fa-wallet mr-2 text-purple-400"></i>খতিয়ান পাসবুক</span><kbd class="bg-purple-600/30 text-purple-300 px-2 py-1 rounded font-mono font-black border border-purple-500/40">F3 / Alt+L</kbd></div>
                    <div class="p-2.5 rounded-xl bg-slate-900 border border-slate-800 flex justify-between items-center"><span class="text-white font-bold"><i class="fa-solid fa-users mr-2 text-sky-400"></i>কাস্টমার তালিকা</span><kbd class="bg-sky-600/30 text-sky-300 px-2 py-1 rounded font-mono font-black border border-sky-500/40">F4 / Alt+C</kbd></div>
                    <div class="p-2.5 rounded-xl bg-slate-900 border border-slate-800 flex justify-between items-center"><span class="text-white font-bold"><i class="fa-solid fa-file-invoice-dollar mr-2 text-red-400"></i>দৈনিক খরচ</span><kbd class="bg-red-600/30 text-red-300 px-2 py-1 rounded font-mono font-black border border-red-500/40">F6 / Alt+E</kbd></div>
                    <div class="p-2.5 rounded-xl bg-slate-900 border border-slate-800 flex justify-between items-center"><span class="text-white font-bold"><i class="fa-solid fa-bolt mr-2 text-amber-400"></i>ফাস্ট এন্ট্রি</span><kbd class="bg-amber-600/30 text-amber-300 px-2 py-1 rounded font-mono font-black border border-amber-500/40">F7 / Alt+B</kbd></div>
                    <div class="p-2.5 rounded-xl bg-slate-900 border border-slate-800 flex justify-between items-center"><span class="text-white font-bold"><i class="fa-solid fa-gear mr-2 text-slate-400"></i>সফ্টওয়্যার সেটিংস</span><kbd class="bg-slate-800 text-slate-300 px-2 py-1 rounded font-mono font-black border border-slate-700">F8 / Alt+S</kbd></div>
                    <div class="p-2.5 rounded-xl bg-slate-900 border border-slate-800 flex justify-between items-center"><span class="text-white font-bold"><i class="fa-solid fa-magnifying-glass mr-2 text-blue-400"></i>গ্লোবাল সার্চ bar</span><kbd class="bg-blue-600/30 text-blue-300 px-2 py-1 rounded font-mono font-black border border-blue-500/40">Ctrl + K</kbd></div>
                    <div class="p-2.5 rounded-xl bg-slate-900 border border-slate-800 flex justify-between items-center"><span class="text-white font-bold"><i class="fa-solid fa-floppy-disk mr-2 text-emerald-400"></i>স্মার্ট অটো-সেভ</span><kbd class="bg-emerald-600/30 text-emerald-300 px-2 py-1 rounded font-mono font-black border border-emerald-500/40">Ctrl + S</kbd></div>
                    <div class="p-2.5 rounded-xl bg-slate-900 border border-slate-800 flex justify-between items-center"><span class="text-white font-bold"><i class="fa-solid fa-plus-circle mr-2 text-amber-400"></i>স্মার্ট নতুন এন্ট্রি</span><kbd class="bg-amber-600/30 text-amber-300 px-2 py-1 rounded font-mono font-black border border-amber-500/40">Alt + N / Insert</kbd></div>
                    <div class="p-2.5 rounded-xl bg-slate-900 border border-slate-800 flex justify-between items-center"><span class="text-white font-bold"><i class="fa-solid fa-print mr-2 text-blue-400"></i>পেজ / লিস্ট প্রিন্ট</span><kbd class="bg-blue-600/30 text-blue-300 px-2 py-1 rounded font-mono font-black border border-blue-500/40">Alt + P</kbd></div>
                    <div class="p-2.5 rounded-xl bg-slate-900 border border-slate-800 flex justify-between items-center"><span class="text-white font-bold"><i class="fa-solid fa-circle-info mr-2 text-purple-400"></i>শর্টকাট হেল্প গাইড</span><kbd class="bg-purple-600/30 text-purple-300 px-2 py-1 rounded font-mono font-black border border-purple-500/40">F10 / Shift+?</kbd></div>
                </div>
            </div>
        `,confirmButtonText:`ঠিক আছে (Close)`,customClass:{popup:`!bg-slate-950 !text-white !rounded-3xl border border-slate-800 shadow-2xl font-bn max-w-2xl`,confirmButton:`m3-btn-primary !bg-blue-600 hover:!bg-blue-500 !px-7 !py-2.5 !rounded-xl font-bold shadow-lg shadow-blue-600/30`}})}function ct(e={}){window.addEventListener(`keydown`,t=>{let n=(e,t)=>{typeof window.navigate==`function`?window.navigate(e,t):typeof window.navigateTo==`function`&&window.navigateTo(e,t)},r=document.activeElement?.tagName?.toLowerCase(),i=r===`input`||r===`textarea`||document.activeElement?.isContentEditable;if((t.key===`F10`||t.shiftKey&&t.key===`?`)&&(!i||t.key===`F10`)){t.preventDefault(),st();return}if(t.key===`F1`){t.preventDefault(),n(`dashboard`);return}if(t.key===`F2`){t.preventDefault(),n(`invoice`);return}if(t.key===`F3`){t.preventDefault(),n(`ledger`);return}if(t.key===`F4`){t.preventDefault(),n(`customers`);return}if(t.key===`F6`){t.preventDefault(),n(`expenses`);return}if(t.key===`F7`){t.preventDefault(),n(`bulk`);return}if(t.key===`F8`){t.preventDefault(),n(`settings`);return}if((t.ctrlKey||t.metaKey)&&t.key.toLowerCase()===`s`){if(t.preventDefault(),H.default.isVisible()){let e=H.default.getConfirmButton();if(e&&!e.disabled){e.click();return}}let e=document.getElementById(`dash-add-customer-form`);if(e&&!e.classList.contains(`hidden`)&&typeof window.saveDashCustomer==`function`){window.saveDashCustomer();return}let n=document.getElementById(`customer-modal`);if(n&&!n.classList.contains(`hidden`)&&typeof window.saveCustomer==`function`){window.saveCustomer();return}if(document.getElementById(`inv-items-tbody`)&&typeof window.saveAndPrintInvoice==`function`){window.saveAndPrintInvoice(`pos`);return}let r=document.getElementById(`expense-save-btn`)||document.getElementById(`save-expense-btn`);if(r){r.click();return}if(typeof window.saveExpense==`function`){window.saveExpense();return}let i=document.getElementById(`settings-save-btn`)||document.getElementById(`save-settings-btn`);if(i){i.click();return}if(typeof window.saveSettings==`function`){window.saveSettings();return}let a=document.querySelector(`.m3-btn-primary, button[type="submit"]`);if(a){a.click();return}K(`ডাটা সেভ প্রসেস করা হচ্ছে...`,`info`);return}if((t.ctrlKey||t.metaKey)&&t.key.toLowerCase()===`k`){t.preventDefault(),e.toggleOmnisearch&&e.toggleOmnisearch();return}if(t.key===`Escape`){e.toggleOmnisearch&&e.toggleOmnisearch(!1);return}if(t.altKey&&t.key.toLowerCase()===`n`||t.ctrlKey&&t.shiftKey&&t.key.toLowerCase()===`n`||t.key===`Insert`){t.preventDefault(),t.stopPropagation();let e=window.AppState?.currentView||`dashboard`;if(e===`customers`||document.getElementById(`add-customer-form`))return;if(document.getElementById(`dash-add-customer-form`)&&e===`dashboard`&&typeof window.toggleDashCustomerForm==`function`){window.toggleDashCustomerForm();return}if((e===`invoice`||document.getElementById(`inv-items-tbody`))&&typeof window.addInvoiceItemRow==`function`){window.addInvoiceItemRow(),K(`+ নতুন ইনভয়েস লাইন যোগ করা হয়েছে`,`success`);return}if(e===`expenses`||document.getElementById(`expense-modal`)){let e=document.getElementById(`add-expense-btn`)||document.getElementById(`btn-add-expense`);if(e){e.click();return}if(typeof window.openExpenseModal==`function`){window.openExpenseModal();return}}if(e===`bulk`&&typeof window.addBulkRow==`function`){window.addBulkRow(),K(`+ নতুন স্প্রেডশীট রো যোগ করা হয়েছে`,`success`);return}let n=document.querySelector(`[onclick*="toggleDashCustomerForm"], [onclick*="toggleAddCustomerForm"]`);if(n){n.click();return}typeof window.toggleDashCustomerForm==`function`&&window.toggleDashCustomerForm();return}if(t.altKey&&t.key.toLowerCase()===`p`){t.preventDefault(),window.printFilteredCustomerList?window.printFilteredCustomerList():window.print();return}})}var lt=!1,ut=0,q=[];function dt(){ft(),ct({toggleOmnisearch:pt})}function ft(){if(document.getElementById(`omnisearch-modal`))return;let e=document.createElement(`div`);e.id=`omnisearch-modal`,e.className=`fixed inset-0 z-[999999] bg-slate-950/80 backdrop-blur-md hidden flex items-start justify-center pt-16 md:pt-24 px-4 font-bn transition-all`,e.innerHTML=`
        <div class="bg-slate-900 border border-slate-700/80 w-full max-w-xl rounded-2xl shadow-2xl overflow-hidden flex flex-col transform transition-all scale-95 opacity-0" id="omnisearch-box">
            <div class="relative flex items-center border-b border-slate-800/80 px-4 py-3.5 bg-slate-950/40">
                <i class="fa-solid fa-magnifying-glass text-blue-400 text-base mr-3"></i>
                <input type="text" id="omni-input" placeholder="যেকোনো পেজ বা কাস্টমার খুঁজুন (যেমন: কাস্টমার, খতিয়ান, জসিম)..." class="w-full bg-transparent text-white text-sm focus:outline-none placeholder:text-slate-500 font-bold" autocomplete="off">
                <kbd class="text-[10px] font-black text-slate-400 bg-slate-800 border border-slate-700 px-2 py-0.5 rounded-md uppercase shrink-0">ESC</kbd>
            </div>
            <div id="omni-results" class="max-h-[350px] overflow-y-auto custom-scrollbar p-2 divide-y divide-slate-800/40">
                <div class="text-center py-8 text-slate-500 font-bold text-xs">কিছু টাইপ করুন অথবা নিচের শর্টকাট দেখুন...</div>
            </div>
            <div class="flex items-center justify-between px-4 py-2.5 bg-slate-950/60 border-t border-slate-800/60 text-[10px] font-bold text-slate-400">
                <div class="flex items-center gap-3">
                    <span><kbd class="bg-slate-800 border border-slate-700 px-1.5 py-0.5 rounded text-slate-300">↑↓</kbd> নেভিগেট</span>
                    <span><kbd class="bg-slate-800 border border-slate-700 px-1.5 py-0.5 rounded text-slate-300">↵</kbd> সিলেক্ট</span>
                </div>
                <div class="flex items-center gap-2">
                    <button type="button" class="text-blue-400 hover:underline cursor-pointer flex items-center gap-1" onclick="window.showHotkeyHelpModal()"><i class="fa-solid fa-keyboard text-xs"></i><kbd class="bg-slate-800 border border-slate-700 px-1.5 py-0.5 rounded text-amber-400">F10</kbd> শর্টকাট গাইড</button>
                    <span>|</span>
                    <span><kbd class="bg-slate-800 border border-slate-700 px-1.5 py-0.5 rounded text-blue-400">Ctrl + K</kbd> কমান্ড বার</span>
                </div>
            </div>
        </div>`,document.body.appendChild(e);let t=document.getElementById(`omni-input`);t&&(t.addEventListener(`input`,e=>mt(e.target.value)),t.addEventListener(`keydown`,gt)),e.addEventListener(`click`,t=>{t.target===e&&pt(!1)})}function pt(e=null){let t=document.getElementById(`omnisearch-modal`),n=document.getElementById(`omnisearch-box`),r=document.getElementById(`omni-input`);!t||!n||(lt=e===null?!lt:e,lt?(t.classList.remove(`hidden`),requestAnimationFrame(()=>{n.classList.remove(`scale-95`,`opacity-0`),n.classList.add(`scale-100`,`opacity-100`)}),r&&(r.value=``,r.focus(),mt(``))):(n.classList.remove(`scale-100`,`opacity-100`),n.classList.add(`scale-95`,`opacity-0`),setTimeout(()=>t.classList.add(`hidden`),150)))}function mt(e){if(!document.getElementById(`omni-results`))return;e=(e||``).trim().toLowerCase(),q=[];let t=(e,t)=>{typeof window.navigate==`function`?window.navigate(e,t):typeof window.navigateTo==`function`&&window.navigateTo(e,t)};[{title:`কাস্টমার ম্যানেজমেন্ট (F4 / Alt+C)`,subtitle:`কাস্টমার তালিকা ও তৈরি`,icon:`fa-users text-blue-400`,action:()=>t(`customers`)},{title:`খতিয়ান (F3 / Alt+L)`,subtitle:`কাস্টমার লেনদেন ও জমা-খরচ`,icon:`fa-wallet text-purple-400`,action:()=>t(`ledger`)},{title:`ফাস্ট এন্ট্রি (F7 / Alt+B)`,subtitle:`দ্রুত ইনভয়েস ও মেমো তৈরি`,icon:`fa-bolt text-amber-400`,action:()=>t(`bulk`)},{title:`ইনভয়েস / ভাউচার জেনারেটর (F2 / Alt+I)`,subtitle:`সর্বশেষ রসিদ ও ভাউচার`,icon:`fa-receipt text-emerald-400`,action:()=>t(`invoice`)},{title:`দৈনিক খরচ (F6 / Alt+E)`,subtitle:`দোকানের খরচের তালিকা`,icon:`fa-file-invoice-dollar text-red-400`,action:()=>t(`expenses`)},{title:`সফটওয়্যার সেটিংস (F8 / Alt+S)`,subtitle:`দোকানের নাম ও সিকিউরিটি পিন`,icon:`fa-gear text-slate-400`,action:()=>t(`settings`)}].forEach(t=>{(!e||t.title.toLowerCase().includes(e)||t.subtitle.toLowerCase().includes(e))&&q.push(t)}),e&&(J()||[]).forEach(n=>{(typeof window.matchCustomerSearch==`function`?window.matchCustomerSearch(n,e):(n.name||``).toLowerCase().includes(e))&&q.push({title:n.name,subtitle:`ফোন: ${n.phone||`-`} | A/C: ${n.accountNo||`-`} | বকেয়া: ৳${n.totalDue||0}`,icon:`fa-user text-blue-400`,action:()=>t(`ledger`,{custId:n.id})})}),ut=0,ht()}function ht(){let e=document.getElementById(`omni-results`);if(e){if(q.length===0){e.innerHTML=`<div class="text-center py-8 text-slate-500 font-bold text-xs">কোনো ডাটা পাওয়া যায়নি</div>`;return}e.innerHTML=q.map((e,t)=>`
        <div class="omni-item flex items-center justify-between p-3 rounded-xl cursor-pointer transition-all ${t===ut?`bg-blue-600/20 border border-blue-500/30`:`hover:bg-slate-800/50`}" onclick="window.execOmniItem(${t})">
            <div class="flex items-center gap-3">
                <div class="w-8 h-8 rounded-lg bg-slate-800 border border-slate-700 flex items-center justify-center">
                    <i class="fa-solid ${e.icon}"></i>
                </div>
                <div>
                    <div class="font-bold text-white text-xs">${e.title}</div>
                    <div class="text-[10px] text-slate-400 font-semibold">${e.subtitle}</div>
                </div>
            </div>
            <i class="fa-solid fa-chevron-right text-xs text-slate-500"></i>
        </div>`).join(``)}}function gt(e){e.key===`ArrowDown`?(e.preventDefault(),ut=(ut+1)%q.length,ht()):e.key===`ArrowUp`?(e.preventDefault(),ut=(ut-1+q.length)%q.length,ht()):e.key===`Enter`&&(e.preventDefault(),q[ut]&&(q[ut].action(),pt(!1)))}window.execOmniItem=e=>{q[e]&&(q[e].action(),pt(!1))},window.toggleOmnisearch=pt,window.showHotkeyHelpModal=st;function _t(e){if(!e||typeof e!=`string`)return``;let t=e.trim();if(!t)return``;let n={dhaka:`ঢাকা`,bangladesh:`বাংলাদেশ`,chattogram:`চট্টগ্রাম`,chittagong:`চট্টগ্রাম`,ctg:`চট্টগ্রাম`,muradpur:`মুরাদপুর`,hathazari:`হাটহাজারী`,railgate:`রেইলগেইট`,"rail gate":`রেইল গেইট`,rahman:`রহমান`,tower:`টাওয়ার`,market:`মার্কেট`,center:`সেন্টার`,centre:`সেন্টার`,shop:`দোকান`,no:`নং`,road:`রোড`,lane:`গলি`,gali:`গলি`,goli:`গলি`,sholashahar:`ষোলশহর`,khatunganj:`খাতুনগঞ্জ`,agarabad:`আগ্রাবাদ`,halishahar:`হালিশহর`,nasirabad:`নাসিরাবাদ`,bismillah:`বিসমিল্লাহ`,enterprise:`এন্টারপ্রাইজ`,motors:`মোটরস`,motor:`মোটর`,store:`স্টোর`,hardware:`হার্ডওয়্যার`,auto:`অটো`,parts:`পার্টস`,maa:`মা`,ms:`মেসার্স`,"m/s":`মেসার্স`,feni:`ফেনী`,comilla:`কুমিল্লা`,kumilla:`কুমিল্লা`,noakhali:`নোয়াখালী`,sylhet:`সিলেট`,rajshahi:`রাজশাহী`,khulna:`খুলনা`,barisal:`বরিশাল`};return t.split(/(\s+|[,,\-।])/).map(e=>{let t=e.trim().toLowerCase();return n[t]?n[t]:!t||/^\d+$/.test(t)||/^[^\w\s]$/.test(t)?e:vt(e)}).join(``)}function vt(e){if(!e||!/[a-zA-Z]/.test(e))return e;let t=e.toLowerCase();return t=t.replace(/desh/g,`দেশ`).replace(/road/g,`রোড`).replace(/rd$/g,`র্ড`).replace(/nd$/g,`ন্ড`).replace(/ld$/g,`ল্ড`),t=t.replace(/kkh/g,`ক্ষ`).replace(/ggh/g,`ঘ্`).replace(/ng/g,`ং`).replace(/cch/g,`চ্ছ`).replace(/tth/g,`ঠ`).replace(/dhd/g,`দ্ধ`).replace(/ddh/g,`ঢ`).replace(/bbh/g,`ভ`).replace(/mbh/g,`ম্ভ`).replace(/mph/g,`ম্ফ`).replace(/nkh/g,`ঙ্খ`).replace(/ngh/g,`ঙ্ঘ`).replace(/ndh/g,`ন্ধ`).replace(/nst/g,`ন্সট`).replace(/sh/g,`শ`).replace(/th/g,`থ`).replace(/dh/g,`ধ`).replace(/kh/g,`খ`).replace(/gh/g,`ঘ`).replace(/ch/g,`চ`).replace(/jh/g,`ঝ`).replace(/ph/g,`ফ`).replace(/bh/g,`ভ`).replace(/rh/g,`ঢ়`).replace(/k/g,`ক`).replace(/g/g,`গ`).replace(/j/g,`জ`).replace(/z/g,`জ`).replace(/t/g,`ট`).replace(/d/g,`দ`).replace(/n/g,`ন`).replace(/p/g,`প`).replace(/f/g,`ফ`).replace(/b/g,`ব`).replace(/m/g,`ম`).replace(/r/g,`র`).replace(/l/g,`ল`).replace(/s/g,`স`).replace(/h/g,`হ`).replace(/y/g,`য়`).replace(/v/g,`ভ`).replace(/w/g,`ও`).replace(/a/g,`া`).replace(/i/g,`ি`).replace(/u/g,`ু`).replace(/e/g,`ে`).replace(/o/g,`ো`),t}function yt(e=[]){let t=e&&e.length?e:J()||window.customerCache||[],n=new Set,r={};t.forEach(e=>{if(!e.address||typeof e.address!=`string`)return;let t=e.address.trim();t.length>=3&&n.add(t),t.split(/[,,\-।]/).forEach(e=>{let t=e.trim();t.length>=2&&!/^\d+$/.test(t)&&(r[t]=(r[t]||0)+1)})});let i=Object.keys(r).sort((e,t)=>r[t]-r[e]);return{fullAddresses:Array.from(n),phrases:i}}function bt(e){let t=document.getElementById(e);if(!t)return;let n=document.getElementById(e+`-chips`);n&&(n.innerHTML=``);let r=document.getElementById(e+`-dropdown`);r||(r=document.createElement(`div`),r.id=e+`-dropdown`,r.className=`hidden absolute left-0 right-0 top-full mt-1 bg-slate-900/95 border border-slate-700/90 rounded-2xl shadow-[0_25px_60px_rgba(0,0,0,0.95)] z-[999999] max-h-64 overflow-y-auto custom-scrollbar p-1.5 flex flex-col gap-1 backdrop-blur-2xl font-bn`,t.parentNode&&(t.parentNode.classList.add(`relative`),t.parentNode.appendChild(r)));let i=(e,t,n)=>{if(!e)return 0;let r=e.toLowerCase().trim(),i=(n||``).trim();if(r===t||i&&r===i)return 1e3;if(r.startsWith(t)||i&&r.startsWith(i))return 500;if(r.split(/[\s,,\-।]+/).some(e=>e.startsWith(t)||i&&e.startsWith(i)))return 200;if(r.includes(t)||i&&r.includes(i))return 50;if(typeof window.toBanglishName==`function`){let n=window.toBanglishName(e).toLowerCase();if(n.startsWith(t))return 150;if(n.includes(t))return 30}return 0},a=()=>{let n=t.value,a=n.toLowerCase().trim(),o=n.lastIndexOf(`,`),c=(o>=0?n.slice(o+1):n).trim(),l=c.toLowerCase(),{fullAddresses:u,phrases:d}=yt();if(!a&&!l){r.classList.add(`hidden`);return}let f=_t(n),p=_t(c||n),m=/[a-zA-Z]/.test(n),h=u.map(e=>({addr:e,score:i(e,l||a,p)})).filter(e=>e.score>0).sort((e,t)=>t.score-e.score).map(e=>e.addr),g=d.map(e=>({phrase:e,score:i(e,l||a,p)})).filter(e=>e.score>0).sort((e,t)=>t.score-e.score).map(e=>e.phrase);if(!m&&h.length===0&&g.length===0){r.classList.add(`hidden`);return}let _=``;m&&f&&f!==n&&(_+=`
                <div class="addr-suggest-item p-2.5 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-500/50 cursor-pointer transition-all flex items-center justify-between text-xs font-black text-emerald-400" onclick="window.selectAddressPhoneticFull('${e}', '${f.replace(/'/g,`\\'`)}')">
                    <div class="flex items-center gap-2">
                        <i class="fa-solid fa-wand-magic-sparkles text-emerald-400 text-sm"></i>
                        <span>বাংলায় রূপান্তর: <strong>${f}</strong></span>
                    </div>
                    <span class="text-[10px] bg-emerald-500/30 px-2.5 py-1 rounded-lg font-mono text-emerald-300 border border-emerald-500/40">Enter / Tab</span>
                </div>
            `),h.length>0&&(_+=`<div class="px-2 py-1 text-[10px] font-black text-blue-400 uppercase tracking-widest flex items-center gap-1 border-b border-slate-800/80"><i class="fa-solid fa-clock-rotate-left"></i> পূর্বের সম্পূর্ণ ঠিকানা (${h.length})</div>`,_+=h.slice(0,5).map(t=>`
                <div class="addr-suggest-item p-2 rounded-xl hover:bg-blue-600/20 hover:border-blue-500/30 cursor-pointer border border-transparent transition-all text-xs font-bold text-white flex items-center gap-2" onclick="window.selectAddressFull('${e}', '${t.replace(/'/g,`\\'`)}')">
                    <i class="fa-solid fa-location-dot text-amber-400 text-xs"></i>
                    <span>${t}</span>
                </div>
            `).join(``)),g.length>0&&(_+=`<div class="px-2 py-1 text-[10px] font-black text-purple-400 uppercase tracking-widest flex items-center gap-1 border-b border-slate-800/80 mt-1"><i class="fa-solid fa-tags"></i> দ্রুত ঠিকানা ফ্রেজ (${g.length})</div>`,_+=g.slice(0,10).map(t=>`
                <div class="addr-suggest-item p-2 rounded-xl hover:bg-purple-600/20 hover:border-purple-500/30 cursor-pointer border border-transparent transition-all text-xs font-bold text-slate-200 flex items-center justify-between gap-2" onclick="window.selectAddressPhrase('${e}', '${t.replace(/'/g,`\\'`)}')">
                    <div class="flex items-center gap-2">
                        <i class="fa-solid fa-plus text-purple-400 text-[10px]"></i>
                        <span>${t}</span>
                    </div>
                    <span class="text-[10px] text-slate-500 font-normal">কমা সংযোগ</span>
                </div>
            `).join(``)),r.innerHTML=_,r.classList.remove(`hidden`),r.scrollTop=0,t._addrActiveIdx=-1;let v=r.querySelectorAll(`.addr-suggest-item`);v&&v.length>0&&s(v,-1)},o=n=>{let r=document.getElementById(e+`-dropdown`);if(!r||r.classList.contains(`hidden`))return;let i=r.querySelectorAll(`.addr-suggest-item`);if(!i||i.length===0)return;let a=t._addrActiveIdx===void 0?-1:t._addrActiveIdx;n.key===`ArrowDown`?(n.preventDefault(),a=a<0?0:(a+1)%i.length,t._addrActiveIdx=a,s(i,a)):n.key===`ArrowUp`?(n.preventDefault(),a=a<=0?i.length-1:a-1,t._addrActiveIdx=a,s(i,a)):n.key===`Enter`||n.key===`Tab`?a>=0&&i[a]?(n.preventDefault(),i[a].click(),t._addrActiveIdx=-1):(r.classList.add(`hidden`),t._addrActiveIdx=-1):n.key===`Escape`&&(r.classList.add(`hidden`),t._addrActiveIdx=-1)};function s(e,t){e.forEach((e,n)=>{n===t&&t>=0?(e.classList.add(`bg-blue-600/40`,`border-blue-500`,`!text-white`,`ring-2`,`ring-blue-500/50`),e.scrollIntoView({block:`nearest`})):e.classList.remove(`bg-blue-600/40`,`border-blue-500`,`!text-white`,`ring-2`,`ring-blue-500/50`)})}t.removeEventListener(`input`,t._addrHandler||(()=>{})),t.removeEventListener(`focus`,t._addrHandler||(()=>{})),t.removeEventListener(`keydown`,t._addrKeyHandler||(()=>{})),t._addrHandler=a,t._addrKeyHandler=o,t.addEventListener(`input`,a),t.addEventListener(`focus`,a),t.addEventListener(`keydown`,o)}typeof window<`u`&&(window.selectAddressFull=(e,t)=>{let n=document.getElementById(e),r=document.getElementById(e+`-dropdown`);n&&(n.value=t,n.focus(),n.dispatchEvent(new Event(`input`,{bubbles:!0}))),r&&r.classList.add(`hidden`)},window.selectAddressPhrase=(e,t)=>{let n=document.getElementById(e),r=document.getElementById(e+`-dropdown`);if(n){let e=n.value,r=e.lastIndexOf(`,`);n.value=r>=0?e.slice(0,r+1).trim()+` `+t+`, `:t+`, `,n.focus(),n.dispatchEvent(new Event(`input`,{bubbles:!0}))}r&&r.classList.add(`hidden`)},window.selectAddressPhoneticFull=(e,t)=>{let n=document.getElementById(e),r=document.getElementById(e+`-dropdown`);n&&(n.value=t,n.focus(),n.dispatchEvent(new Event(`input`,{bubbles:!0}))),r&&r.classList.add(`hidden`)}),document.addEventListener(`click`,e=>{[`cust-address`,`dash-cust-address`].forEach(t=>{let n=document.getElementById(t+`-dropdown`),r=document.getElementById(t);n&&!n.contains(e.target)&&e.target!==r&&n.classList.add(`hidden`)})});var xt=null,St=[],Ct=1,wt=!1,Tt=[],Et=[],Dt=null;function Ot(e){xt=e}function kt(e){Ct=e}function At(){xt=null,St=[],Ct=1}function jt(e){wt=e}function Mt(e){Tt=e}function Nt(e){Et=e}function J(){return Tt}function Pt(){let e=document.getElementById(`cust-count-badge`),t=document.getElementById(`cust-total-due-badge`);if(!e||!t)return;let n=0;Tt.forEach(e=>{n+=Number(e.totalDue)||0}),e.innerText=Tt.length,t.innerText=`৳ `+F(n)}function Y(){if(Dt){Pt();return}Dt=a.listenToAll(e=>{Mt(e),window.customerCache=Tt,Pt(),bt(`cust-address`,`cust-address-datalist`,`cust-address-chips`),bt(`dash-cust-address`,`dash-cust-address-datalist`,`dash-cust-address-chips`),wt&&document.getElementById(`customer-list`)&&window.filterCustomerList&&window.filterCustomerList()})}function Ft(){typeof window>`u`||window._customerHotkeysInitialized||(window._customerHotkeysInitialized=!0,window.addEventListener(`keydown`,It,!0),document.addEventListener(`keydown`,Lt))}function It(e){if(H.default.isVisible()){let t=document.activeElement?.tagName?.toLowerCase();if(t===`input`||t===`textarea`||document.activeElement?.isContentEditable)return;let n=e.key.toLowerCase();if(n===`y`&&!e.ctrlKey&&!e.altKey&&!e.metaKey){e.preventDefault();let t=H.default.getConfirmButton();t&&!t.disabled&&t.click();return}if(n===`n`&&!e.ctrlKey&&!e.altKey&&!e.metaKey){e.preventDefault();let t=H.default.getCancelButton();t&&!t.disabled&&t.click();return}}if((e.ctrlKey||e.metaKey)&&e.key===`Enter`){let t=document.getElementById(`add-customer-form`),n=document.getElementById(`save-cust-btn`);if(t&&!t.classList.contains(`hidden`)&&n&&!n.disabled&&window.saveNewCustomer){e.preventDefault(),window.saveNewCustomer();return}}if(e.key===`Escape`){let t=document.getElementById(`add-customer-form`);if(t&&!t.classList.contains(`hidden`)){e.preventDefault(),window.toggleAddCustomerForm&&window.toggleAddCustomerForm();return}}if(e.altKey&&!e.ctrlKey&&!e.shiftKey&&!e.metaKey)switch(e.key.toLowerCase()){case`n`:e.preventDefault(),e.stopPropagation(),e.stopImmediatePropagation(),Rt();break;case`s`:e.preventDefault(),e.stopPropagation(),e.stopImmediatePropagation(),zt();break;case`z`:e.preventDefault(),e.stopPropagation(),e.stopImmediatePropagation(),Bt();break;case`h`:e.preventDefault(),e.stopPropagation(),e.stopImmediatePropagation(),Gt();break;case`e`:e.preventDefault(),e.stopPropagation(),e.stopImmediatePropagation(),Vt();break;case`d`:e.preventDefault(),e.stopPropagation(),e.stopImmediatePropagation(),Ht();break;case`w`:e.preventDefault(),e.stopPropagation(),e.stopImmediatePropagation(),Ut();break;case`m`:e.preventDefault(),e.stopPropagation(),e.stopImmediatePropagation(),Wt();break;case`p`:e.preventDefault(),e.stopPropagation(),e.stopImmediatePropagation(),window.printFilteredCustomerList&&window.printFilteredCustomerList()}}function Lt(e){if(e.key!==`Enter`||e.ctrlKey||e.altKey||e.shiftKey||e.metaKey||H.default.isVisible())return;let t=e.target;if(!t)return;let n=document.getElementById(`add-customer-form`);!n||!n.contains(t)||(t.id===`cust-date`?(e.preventDefault(),document.getElementById(`cust-name`)?.focus()):t.id===`cust-name`?(e.preventDefault(),document.getElementById(`cust-address`)?.focus()):t.id===`cust-address`?(e.preventDefault(),document.getElementById(`cust-phone`)?.focus()):t.id===`cust-phone`?(e.preventDefault(),document.getElementById(`cust-initial-balance`)?.focus()):t.id===`cust-initial-balance`?(e.preventDefault(),document.getElementById(`cust-zone-select`)?.focus()):t.id===`cust-zone-select`&&(e.preventDefault(),document.getElementById(`save-cust-btn`)?.focus()))}function Rt(){let e=document.getElementById(`add-customer-form`);e&&(typeof window.toggleAddCustomerForm==`function`?window.toggleAddCustomerForm():e.classList.toggle(`hidden`),e.classList.contains(`hidden`)||setTimeout(()=>{let e=document.getElementById(`cust-name`);e&&(e.focus(),K(`নতুন কাস্টমার ফর্ম প্রস্তুত (Alt+N)`,`info`,1e3))},120))}function zt(){let e=document.getElementById(`cust-search-input`);e&&(e.focus(),e.select(),K(`কাস্টমার সার্চ সক্রিয় (Alt+S)`,`info`,1e3))}function Bt(){let e=document.getElementById(`cust-filter-zone`);e&&(e.focus(),K(`জোন ফিল্টার সক্রিয় (Alt+Z)`,`info`,1e3))}function Vt(){let e=document.querySelector(`#customer-list tr`);if(!e)return K(`এডিট করার মতো কাস্টমার পাওয়া যায়নি`,`warning`);let t=e.querySelector(`button[title*="এডিট"]`);t&&(t.click(),K(`কাস্টমার এডিট মোড খোলা হয়েছে`,`info`))}function Ht(){let e=document.querySelector(`#customer-list tr`);if(!e)return K(`ডিলেট করার মতো কাস্টমার পাওয়া যায়নি`,`warning`);let t=e.querySelector(`button[title*="ডিলেট"]`);t&&t.click()}function Ut(){let e=document.querySelector(`#customer-list tr`);if(!e)return K(`কাস্টমার পাওয়া যায়নি`,`warning`);let t=e.querySelector(`button[title*="WhatsApp"]`);t&&t.click()}function Wt(){let e=document.querySelector(`#customer-list tr`);if(!e)return K(`কাস্টমার পাওয়া যায়নি`,`warning`);let t=e.querySelector(`button[title*="SMS"], button[title*="রিমাইন্ডার"]`);t&&t.click()}function Gt(){H.default.fire({title:`<div class="flex items-center justify-center gap-2.5 font-bn font-black text-xl text-white"><i class="fa-solid fa-keyboard text-purple-400"></i><span>কাস্টমার কীবোর্ড গাইডলাইন (Zero-Mouse)</span></div>`,html:`
            <div class="text-left font-bn space-y-3.5 max-h-[65vh] overflow-y-auto custom-scrollbar pr-1">
                <div class="p-2.5 bg-purple-500/10 border border-purple-500/20 rounded-2xl">
                    <div class="text-xs font-bold text-purple-300 flex items-center gap-2">
                        <i class="fa-solid fa-bolt text-amber-400"></i>
                        <span>মাউস ছাড়া সম্পূর্ণ কাস্টমার তৈরি ও ম্যানেজ করার গাইডলাইন</span>
                    </div>
                </div>
                <div class="space-y-1.5">
                    <h4 class="text-xs font-black text-blue-400 uppercase tracking-wider flex items-center gap-1.5"><i class="fa-solid fa-user-plus text-[10px]"></i> ১. নতুন কাস্টমার তৈরি (Enter Flow)</h4>
                    <div class="bg-slate-900/90 border border-slate-800 rounded-xl p-2.5 text-xs space-y-1.5">
                        <div class="flex items-center justify-between"><span class="text-slate-300">নতুন কাস্টমার ফর্ম খোলা / বন্ধ</span><kbd class="m3-kbd">Alt + N</kbd></div>
                        <div class="flex items-center justify-between"><span class="text-slate-300">পরবর্তী ফিল্ডে যাওয়া (Date ➔ Name ➔ Addr ➔ Phone ➔ Due ➔ Zone)</span><kbd class="m3-kbd">Enter</kbd></div>
                        <div class="flex items-center justify-between"><span class="text-slate-300">যেকোনো ফিল্ড থেকে সরাসরি কাস্টমার সেভ</span><kbd class="m3-kbd bg-blue-600/30 text-blue-300 border-blue-500/40">Ctrl + Enter</kbd></div>
                        <div class="flex items-center justify-between"><span class="text-slate-300">কাস্টমার ফর্ম বাতিল / বন্ধ করা</span><kbd class="m3-kbd text-red-400">Esc</kbd></div>
                    </div>
                </div>
                <div class="space-y-1.5">
                    <h4 class="text-xs font-black text-emerald-400 uppercase tracking-wider flex items-center gap-1.5"><i class="fa-solid fa-magnifying-glass text-[10px]"></i> ২. সার্চ ও জোন ফিল্টারিং</h4>
                    <div class="bg-slate-900/90 border border-slate-800 rounded-xl p-2.5 text-xs space-y-1.5">
                        <div class="flex items-center justify-between"><span class="text-slate-300">কাস্টমার সার্চ বক্সে সরাসরি ফোকাস</span><kbd class="m3-kbd">Alt + S</kbd></div>
                        <div class="flex items-center justify-between"><span class="text-slate-300">জোন ফিল্টার ড্রপডাউনে ফোকাস</span><kbd class="m3-kbd">Alt + Z</kbd></div>
                    </div>
                </div>
                <div class="space-y-1.5">
                    <h4 class="text-xs font-black text-amber-400 uppercase tracking-wider flex items-center gap-1.5"><i class="fa-solid fa-sliders text-[10px]"></i> ৩. কাস্টমার লিস্ট অ্যাকশন</h4>
                    <div class="bg-slate-900/90 border border-slate-800 rounded-xl p-2.5 text-xs space-y-1.5">
                        <div class="flex items-center justify-between"><span class="text-slate-300">শীর্ষ কাস্টমারকে এডিট করুন</span><kbd class="m3-kbd">Alt + E</kbd></div>
                        <div class="flex items-center justify-between"><span class="text-slate-300">শীর্ষ কাস্টমারকে ডিলেট করুন</span><kbd class="m3-kbd">Alt + D</kbd></div>
                        <div class="flex items-center justify-between"><span class="text-slate-300">কাস্টমারকে WhatsApp তাগাদা পাঠান</span><kbd class="m3-kbd">Alt + W</kbd></div>
                        <div class="flex items-center justify-between"><span class="text-slate-300">কাস্টমারকে SMS রিমাইন্ডার পাঠান</span><kbd class="m3-kbd">Alt + M</kbd></div>
                        <div class="flex items-center justify-between"><span class="text-slate-300">কাস্টমার লিস্ট প্রিন্ট করুন</span><kbd class="m3-kbd">Alt + P</kbd></div>
                    </div>
                </div>
                <div class="space-y-1.5">
                    <h4 class="text-xs font-black text-purple-400 uppercase tracking-wider flex items-center gap-1.5"><i class="fa-solid fa-message-sms text-[10px]"></i> ৪. পপআপ ও কনফার্মেশন</h4>
                    <div class="bg-slate-900/90 border border-slate-800 rounded-xl p-2.5 text-xs space-y-1.5">
                        <div class="flex items-center justify-between"><span class="text-slate-300">কনফার্ম / হ্যাঁ (OK)</span><span class="flex items-center gap-1"><kbd class="m3-kbd text-emerald-400">Enter</kbd> বা <kbd class="m3-kbd text-emerald-400">Y</kbd></span></div>
                        <div class="flex items-center justify-between"><span class="text-slate-300">বাতিল / না (Cancel)</span><span class="flex items-center gap-1"><kbd class="m3-kbd text-red-400">Esc</kbd> বা <kbd class="m3-kbd text-red-400">N</kbd></span></div>
                    </div>
                </div>
            </div>
        `,confirmButtonText:`<i class="fa-solid fa-check mr-2"></i>ঠিক আছে (Enter)`,customClass:{popup:`rounded-3xl bg-slate-950 border border-slate-700/80 shadow-2xl p-6 text-white`,confirmButton:`m3-btn-primary rounded-xl px-8 py-2.5 text-xs font-bold`}})}window.initCustomerHotkeys=Ft,window.showCustomerKeyboardGuide=Gt,window.toggleCustomerFormHotkey=Rt,window.focusCustomerSearch=zt,window.focusZoneFilter=Bt,window.editFirstCustomer=Vt,window.deleteFirstCustomer=Ht,window.sendFirstCustomerWhatsApp=Ut,window.sendFirstCustomerSMS=Wt;var Kt=e(r());function qt(e,t){if(Ft&&Ft(),window.AppState.currentUserRole===`Staff`&&window.AppState.permissions.viewCustomers===!1){e.innerHTML=`<div class="m3-card text-center"><h2 class="text-xl font-bold text-red-500 font-bn">অ্যাক্সেস ডিনাইড! আপনার কাস্টমার লিস্ট দেখার অনুমতি নেই।</h2></div>`;return}e.innerHTML=`
        <div class="flex flex-col gap-6">
            <div class="m3-card bg-slate-900/60 border border-slate-800/80 p-4 md:p-5 rounded-2xl shadow-xl flex flex-col gap-4">
                <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                    <div class="flex items-center gap-3">
                        <div class="w-2 h-7 bg-blue-500 rounded-full shadow-[0_0_15px_rgba(59,130,246,0.5)]"></div>
                        <h2 class="text-xl md:text-2xl font-black text-white tracking-tight font-bn flex items-center gap-2">
                            <span>কাস্টমার ম্যানেজমেন্ট</span>
                            <button type="button" class="w-7 h-7 rounded-lg hover:bg-slate-800 flex items-center justify-center text-slate-500 hover:text-blue-400 transition-all active:rotate-180 cursor-pointer" onclick="window.loadCustomers()" title="রিফ্রেশ"><i class="fa-solid fa-rotate text-xs"></i></button>
                            <button type="button" class="w-7 h-7 rounded-lg bg-purple-500/10 hover:bg-purple-500/20 text-purple-400 border border-purple-500/30 flex items-center justify-center transition-all cursor-pointer" onclick="window.showCustomerKeyboardGuide && window.showCustomerKeyboardGuide()" title="কীবোর্ড শর্টকাট গাইডলাইন (Alt+H)"><i class="fa-solid fa-keyboard text-xs"></i></button>
                        </h2>
                    </div>

                    <div class="flex items-center gap-2.5 w-full sm:w-auto justify-end font-bn">
                        <button class="h-9 px-3.5 rounded-xl bg-amber-500/10 border border-amber-500/30 hover:bg-amber-500/20 text-amber-300 text-xs font-bold transition-all flex items-center gap-2 shrink-0 cursor-pointer shadow-md shadow-amber-500/10" onclick="window.triggerBulkReminderFlow()" title="১-ক্লিকে টপ ১০ বকেয়া তাগাদা"><i class="fa-solid fa-paper-plane text-amber-400"></i><span>বাল্ক তাগাদা (Top 10)</span></button>
                        <button class="h-9 px-3.5 rounded-xl bg-slate-800/90 border border-slate-700/80 hover:bg-slate-700/80 text-slate-200 text-xs font-bold transition-all flex items-center gap-2 shrink-0 cursor-pointer" onclick="window.exportTableToExcel('customer-export-table', 'customer-list.xlsx')" title="এক্সেল ডাউনলোড"><i class="fa-solid fa-file-excel text-emerald-400"></i><span>এক্সেল</span></button>
                        <button class="h-9 px-3.5 rounded-xl bg-slate-800/90 border border-slate-700/80 hover:bg-slate-700/80 text-slate-200 text-xs font-bold transition-all flex items-center gap-2 shrink-0 cursor-pointer" onclick="window.printFilteredCustomerList()" title="লিস্ট প্রিন্ট"><i class="fa-solid fa-print text-blue-400"></i><span>প্রিন্ট লিস্ট</span></button>
                        ${window.AppState?.currentUserRole!==`Boss`&&(window.AppState?.currentUserRole===`Admin`||window.AppState?.permissions?.manageCustomers!==!1)?`
                        <button class="h-9 px-4 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold shadow-md shadow-blue-600/20 active:scale-95 transition-all flex items-center gap-2 shrink-0 cursor-pointer" onclick="window.toggleAddCustomerForm()">
                            <i class="fa-solid fa-user-plus text-xs"></i>
                            <span>নতুন কাস্টমার (Alt+N)</span>
                        </button>`:``}
                    </div>
                </div>

                <div class="grid grid-cols-1 md:grid-cols-3 gap-3 items-center font-bn">
                    <div class="relative md:col-span-2">
                        <i class="fa-solid fa-magnifying-glass absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-xs z-10 pointer-events-none"></i>
                        <input type="text" id="cust-search-input" onkeyup="window.filterCustomerList()" placeholder="কাস্টমার খুঁজুন (নাম, ফোন, অ্যাকাউন্ট বা ঠিকানা)..." class="w-full bg-slate-950/90 border border-slate-700/70 rounded-xl h-9 text-xs text-white focus:border-blue-500 outline-none shadow-inner" style="padding-left: 48px !important;">
                    </div>
                    <div>
                        <select id="cust-filter-zone" onchange="window.filterCustomerList()" class="w-full bg-slate-950/90 border border-slate-700/70 rounded-xl h-9 px-3 text-xs text-blue-400 font-bold outline-none cursor-pointer shadow-inner">
                            <option value="">-- সকল জোন (All Zones) --</option>
                        </select>
                    </div>
                </div>

                <div class="flex items-center gap-3 pt-2 border-t border-slate-800/60 text-xs font-bold font-bn">
                    <div class="flex items-center gap-2 px-3 py-1 rounded-lg bg-blue-500/10 border border-blue-500/20 text-[11px] font-bold text-blue-400">
                        <i class="fa-solid fa-users text-blue-400"></i> মোট কাস্টমার: <strong id="cust-count-badge" class="text-white font-black">০</strong> জন
                    </div>
                    <div class="flex items-center gap-2 px-3 py-1 rounded-lg bg-red-500/10 border border-red-500/20 text-[11px] font-bold text-red-400">
                        <i class="fa-solid fa-triangle-exclamation text-red-400"></i> মোট বকেয়া: <strong id="cust-total-due-badge" class="text-red-400 font-black">৳ ০</strong>
                    </div>
                </div>
            </div>

            <!-- Inline New Customer Add Form Container (Collapsable) -->
            <div id="add-customer-form" class="hidden m3-card bg-slate-900/90 border border-slate-800 p-4 md:p-5 rounded-2xl shadow-2xl font-bn flex flex-col gap-4">
                <div class="flex items-center justify-between border-b border-slate-800/80 pb-3">
                    <div class="flex items-center gap-3">
                        <div class="w-9 h-9 rounded-xl bg-blue-600/10 border border-blue-500/20 text-blue-400 flex items-center justify-center text-base font-black shadow-sm">
                            <i class="fa-solid fa-address-card"></i>
                        </div>
                        <div>
                            <h3 class="text-base md:text-lg font-black text-white">নতুন কাস্টমার যুক্ত করুন</h3>
                            <p class="text-[10px] text-slate-400 font-bold">কাস্টমার প্রোফাইল ও প্রারম্ভিক হিসাব এন্ট্রি</p>
                        </div>
                    </div>
                    <button class="w-8 h-8 rounded-xl bg-slate-800/80 hover:bg-red-500/20 border border-slate-700/60 text-slate-400 hover:text-red-400 flex items-center justify-center transition-all cursor-pointer" onclick="window.toggleAddCustomerForm()" title="বন্ধ করুন">
                        <i class="fa-solid fa-xmark text-sm"></i>
                    </button>
                </div>

                <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 items-start">
                    <div>
                        <label class="m3-label">হিসাব খোলার তারিখ <span class="m3-label-sub">(Date)</span></label>
                        <input type="text" id="cust-date" class="m3-field py-1 bg-slate-950/80 h-9 text-xs datepicker cursor-pointer">
                    </div>
                    <div>
                        <label class="m3-label">কাস্টমারের নাম <span class="m3-label-sub">(Name *)</span></label>
                        <input type="text" id="cust-name" placeholder="পুরো নাম লিখুন" class="m3-field py-1 bg-slate-950/80 h-9 text-xs">
                    </div>
                    <div>
                        <label class="m3-label">ঠিকানা <span class="m3-label-sub">(Address)</span></label>
                        <input type="text" id="cust-address" list="cust-address-datalist" placeholder="ঠিকানা লিখুন (যেমন: মা মার্কেট, ১নং রেইল গেইট...)" class="m3-field py-1 bg-slate-950/80 h-9 text-xs">
                        <datalist id="cust-address-datalist"></datalist>
                        <div id="cust-address-chips"></div>
                    </div>
                    <div>
                        <label class="m3-label">মোবাইল নম্বর <span class="m3-label-sub">(Phone *)</span></label>
                        <input type="text" id="cust-phone" placeholder="০১৭xxxxxxxx" class="m3-field py-1 bg-slate-950/80 h-9 text-xs">
                    </div>

                    <div class="flex flex-col">
                        <label class="m3-label text-emerald-400">অবশিষ্ট ব্যালেন্স <span class="m3-label-sub">(Opening Due ৳)</span></label>
                        <input type="text" id="cust-initial-balance" placeholder="০.০০" oninput="window.handleNumberInput(this); window.updateLiveWords(this, 'cust-initial-words');" class="m3-field py-1 border-emerald-500/30 focus:border-emerald-500 text-emerald-400 font-black h-9 text-xs bg-slate-950/80">
                        <div id="cust-initial-words" class="text-[10px] font-black text-emerald-400 mt-1 hidden italic truncate"></div>
                    </div>
                    <div>
                        <label class="m3-label text-purple-400">জোন / অঞ্চল <span class="m3-label-sub">(Zone *)</span></label>
                        <div class="flex gap-2">
                            <select id="cust-zone-select" class="m3-field py-1 flex-grow bg-slate-950/80 h-9 text-xs font-bold text-slate-200 cursor-pointer" onchange="window.handleZoneChange()">
                                <option value="">-- জোন সিলেক্ট --</option>
                            </select>
                            <button title="নতুন জোন যোগ করুন" class="w-9 h-9 bg-purple-600/20 text-purple-400 border border-purple-500/30 rounded-xl hover:bg-purple-600 hover:text-white transition-all flex items-center justify-center shrink-0 cursor-pointer" onclick="window.quickAddZone()"><i class="fa-solid fa-plus text-xs"></i></button>
                        </div>
                    </div>
                    <div>
                        <label class="m3-label text-blue-400">জোন কোড <span class="m3-label-sub">(Code)</span></label>
                        <input type="text" id="cust-zone-code-display" readonly placeholder="কোড" class="m3-field py-1 bg-slate-950/60 border-slate-700/60 text-center text-xs font-black text-blue-400 h-9">
                    </div>
                    <div>
                        <label class="m3-label text-blue-400">অ্যাকাউন্ট নম্বর <span class="m3-label-sub">(Auto A/C)</span></label>
                        <input type="text" id="cust-generated-acc" readonly placeholder="অ্যাকাউন্ট নং" class="m3-field py-1 bg-slate-950/60 border-blue-500/30 text-blue-400 font-black h-9 text-xs">
                    </div>
                </div>

                <div class="flex items-center justify-end gap-3 pt-3 border-t border-slate-800/80">
                    <button class="h-9 px-5 rounded-xl bg-slate-800/90 border border-slate-700/80 hover:bg-slate-700/80 text-slate-300 text-xs font-bold transition-all cursor-pointer" onclick="window.toggleAddCustomerForm()">বাতিল</button>
                    <button class="h-9 px-8 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-black shadow-lg shadow-blue-600/30 active:scale-95 transition-all flex items-center gap-2 cursor-pointer" id="save-cust-btn" onclick="window.saveNewCustomer()">
                        <i class="fa-solid fa-check text-xs"></i>
                        <span>সেভ করুন</span>
                    </button>
                </div>
            </div>

            <!-- Desktop View Table -->
            <div class="desktop-only m3-table-container clusterize-scroll" id="cust-scroll-area" style="max-height: 60vh;">
                <table id="customer-export-table" class="m3-table min-w-[800px]">
                    <thead>
                        <tr class="font-bn">
                            <th class="w-[120px] text-slate-400">খোলার তারিখ</th>
                            <th class="w-1/4 text-slate-400">কাস্টমারের নাম</th>
                            <th class="w-1/4 text-slate-400">ঠিকানা</th>
                            <th class="text-slate-400">মোবাইল নম্বর</th>
                            <th class="text-right text-slate-400">মোট বকেয়া</th>
                            <th class="text-center text-slate-400 sticky-action-col">অ্যাকশন</th>
                        </tr>
                    </thead>
                    <tbody id="customer-list" class="font-bn clusterize-content">
                        <tr><td colspan="6" class="text-center py-20 font-bold text-slate-500 italic">ডাটা লোড হচ্ছে...</td></tr>
                    </tbody>
                </table>
            </div>

            <!-- Mobile View Responsive Cards -->
            <div id="customer-list-mobile" class="mobile-only mobile-card-container font-bn">
                <div class="text-center py-10 text-slate-500 font-bold italic">ডাটা লোড হচ্ছে...</div>
            </div>

            <!-- Pagination Controls -->
            <div id="cust-pagination" class="flex items-center justify-center gap-4 py-4 font-bn">
                <button id="cust-prev-page" class="px-4 py-2 bg-slate-800 text-slate-300 rounded-xl border border-slate-700 hover:bg-slate-700 disabled:opacity-30 disabled:pointer-events-none transition-all" onclick="window.changeCustomerPage('prev')"><i class="fa-solid fa-chevron-left mr-2"></i> পূর্ববর্তী</button>
                <div class="text-white font-bold bg-blue-600/10 border border-blue-500/30 px-4 py-2 rounded-xl">পৃষ্ঠা: <span id="cust-current-page-display">1</span></div>
                <button id="cust-next-page" class="px-4 py-2 bg-slate-800 text-slate-300 rounded-xl border border-slate-700 hover:bg-slate-700 disabled:opacity-30 disabled:pointer-events-none transition-all" onclick="window.changeCustomerPage('next')">পরবর্তী <i class="fa-solid fa-chevron-right ml-2"></i></button>
            </div>
        </div>`,window.loadCustomers&&window.loadCustomers(),document.getElementById(`cust-date`)&&(document.getElementById(`cust-date`).value=window.getTodayLocalDateString?window.getTodayLocalDateString():new Date().toISOString().split(`T`)[0]),t&&t.openForm&&setTimeout(()=>{let e=document.getElementById(`add-customer-form`);e&&e.classList.remove(`hidden`)},150)}function Jt(e){let t=document.getElementById(`customer-list`),n=document.getElementById(`customer-list-mobile`);if(!t)return;let r=String(window.AppState?.currentUserRole||``).toLowerCase()===`boss`,i=String(window.AppState?.currentUserRole||``).toLowerCase()===`admin`,a=!r&&(i||window.AppState?.permissions?.editCustomers!==!1&&window.AppState?.permissions?.manageCustomers!==!1),o=!r&&(i||window.AppState?.permissions?.deleteCustomers===!0),s=[],c=``;e.forEach(e=>{let t=e.openingDate||``,n=``;if(e.createdAt)try{let r=e.createdAt.toDate?e.createdAt.toDate():e.createdAt.toMillis?new Date(e.createdAt.toMillis()):new Date(e.createdAt);isNaN(r.getTime())||(t||=r.toISOString().split(`T`)[0],n=r.toLocaleTimeString(`en-US`,{hour:`numeric`,minute:`2-digit`,hour12:!0}))}catch(e){console.error(e)}t||=R();let r=Number(e.totalDue)||0,i=r>0?`text-red-400`:r<0?`text-emerald-400`:`text-slate-400`,l=String(e.id||``),u=String(e.name||`N/A`).replace(/'/g,`\\'`).replace(/"/g,`&quot;`),d=String(e.phone||`-`).replace(/'/g,`\\'`).replace(/"/g,`&quot;`),f=String(e.address||`-`).replace(/'/g,`\\'`).replace(/"/g,`&quot;`),p=String(e.zone||``).replace(/'/g,`\\'`).replace(/"/g,`&quot;`);s.push(`<tr class="hover:bg-white/[0.04] transition-colors border-b border-slate-800/60 cursor-pointer group" onclick="window.openCustomerLedger('${l}')">
            <td class="py-2.5 px-3 text-xs font-bold text-slate-200 whitespace-nowrap align-top">
                <div>${B(t)}</div>
                ${n?`<div class="text-[10px] text-slate-400 font-medium mt-0.5 flex items-center gap-1.5"><i class="fa-regular fa-clock text-[9px] text-slate-500"></i><span>${n}</span></div>`:``}
            </td>
            <td class="py-2.5 px-3 font-bold text-slate-200 whitespace-nowrap align-top">
                <div class="flex items-center gap-2">
                    <div class="w-7 h-7 rounded-lg bg-blue-500/10 border border-blue-500/20 text-blue-400 flex items-center justify-center font-black text-xs shrink-0">${(e.name||`K`).charAt(0)}</div>
                    <div class="flex items-center gap-2">
                        <span class="text-xs text-white font-bold group-hover:text-blue-400 transition-colors">${e.name||`N/A`}</span>
                        <span class="text-[10px] text-blue-400 font-black bg-blue-500/10 border border-blue-500/20 px-1.5 py-0.5 rounded font-mono">${e.accountNo||`-`}</span>
                    </div>
                </div>
            </td>
            <td class="py-2.5 px-3 text-xs text-slate-300 font-medium max-w-[220px] align-top" title="${e.address||`-`}">
                <div class="flex items-center gap-1 truncate">
                    ${e.zone?`<span class="inline-block text-[9px] text-purple-400 font-bold bg-purple-500/10 border border-purple-500/20 px-1.5 py-0.5 rounded shrink-0"><i class="fa-solid fa-location-dot mr-0.5"></i>${e.zone}</span>`:``}
                    <span class="truncate text-slate-400">${e.address||`-`}</span>
                </div>
            </td>
            <td class="py-2.5 px-3 text-xs text-slate-300 font-bold whitespace-nowrap align-top">${e.phone||`-`}</td>
            <td class="py-2.5 px-3 text-right whitespace-nowrap align-top">
                <div class="flex items-center justify-end gap-1.5">
                    <span class="font-black text-sm ${i}">৳ ${F(Math.abs(r))}</span>
                    <span class="text-[9px] uppercase font-bold px-1.5 py-0.5 rounded ${r>0?`bg-red-500/10 text-red-400 border border-red-500/20`:r<0?`bg-emerald-500/10 text-emerald-400 border border-emerald-500/20`:`bg-slate-800 text-slate-400`}">${r>0?`বকেয়া`:r<0?`অ্যাডভান্স`:`পরিশোধিত`}</span>
                </div>
            </td>
            <td class="py-2.5 px-3 text-center whitespace-nowrap sticky-action-col align-top" onclick="event.stopPropagation()">
                <div class="flex items-center justify-center gap-1">
                    <button class="m3-btn-icon" onclick="window.openCustomerLedger('${l}')" title="খতিয়ান দেখুন"><i class="fa-solid fa-book text-blue-400"></i></button>
                    <button class="m3-btn-icon" onclick="window.openCustomerStatement('${l}', '${u}', '${e.accountNo||``}', '${d}', '${f}')" title="স্টেটমেন্ট"><i class="fa-solid fa-file-invoice text-purple-400"></i></button>
                    <button class="m3-btn-icon" onclick="window.sendDashWhatsAppReminder('${d}', ${r}, '${u}')" title="WhatsApp তাগাদা"><i class="fa-brands fa-whatsapp text-emerald-400"></i></button>
                    ${r>0?`<button class="m3-btn-icon" onclick="window.sendReminderSMS('${d}', ${r}, '${u}', '${e.accountNo||``}')" title="রিমাইন্ডার SMS"><i class="fa-solid fa-bell text-amber-400"></i></button>`:``}
                    ${a?`<button class="m3-btn-icon" onclick="window.editCustomer('${l}', '${u}', '${d}', '${f}', '${p}')" title="এডিট"><i class="fa-solid fa-pen-to-square text-amber-400"></i></button>`:``}
                    ${o?`<button class="m3-btn-icon" onclick="window.deleteCustomer('${l}', '${u}')" title="ডিলেট"><i class="fa-solid fa-trash-can text-red-400"></i></button>`:``}
                </div>
            </td>
        </tr>`),c+=`<div class="mobile-card cursor-pointer" onclick="window.openCustomerLedger('${l}')">
            <div class="mobile-card-header">
                <div class="flex items-center gap-2">
                    <div class="w-8 h-8 rounded-lg bg-blue-500/10 text-blue-400 flex items-center justify-center font-black text-xs shrink-0">${(e.name||`K`).charAt(0)}</div>
                    <div>
                        <div class="mobile-card-title">${e.name||`N/A`}</div>
                        <div class="mobile-card-sub text-blue-400 font-bold">${e.accountNo||`-`} ${e.zone?`• `+e.zone:``}</div>
                    </div>
                </div>
                <div class="text-right">
                    <div class="text-base font-black ${i}">৳ ${F(Math.abs(r))}</div>
                    <span class="inline-block text-[9px] uppercase font-bold ${r>0?`text-red-400`:`text-emerald-400`}">${r>0?`বকেয়া`:`পরিশোধিত`}</span>
                </div>
            </div>
            <div class="mobile-card-row"><span class="mobile-card-label">তারিখ:</span><span class="mobile-card-value">${B(t)}${n?` (${n})`:``}</span></div>
            <div class="mobile-card-row"><span class="mobile-card-label">মোবাইল:</span><span class="mobile-card-value">${e.phone||`-`}</span></div>
            <div class="mobile-card-row"><span class="mobile-card-label">ঠিকানা:</span><span class="mobile-card-value">${e.address||`-`}</span></div>
            <div class="mobile-card-actions" onclick="event.stopPropagation()">
                <button class="m3-btn-icon" onclick="window.openCustomerLedger('${l}')" title="খতিয়ান"><i class="fa-solid fa-book text-blue-400"></i></button>
                <button class="m3-btn-icon" onclick="window.openCustomerStatement('${l}', '${u}', '${e.accountNo||``}', '${d}', '${f}')" title="স্টেটমেন্ট"><i class="fa-solid fa-file-invoice text-purple-400"></i></button>
                <button class="m3-btn-icon" onclick="window.sendDashWhatsAppReminder('${d}', ${r}, '${u}')" title="WhatsApp তাগাদা"><i class="fa-brands fa-whatsapp text-emerald-400"></i></button>
                ${r>0?`<button class="m3-btn-icon" onclick="window.sendReminderSMS('${d}', ${r}, '${u}', '${e.accountNo||``}')" title="রিমাইন্ডার SMS"><i class="fa-solid fa-bell text-amber-400"></i></button>`:``}
                ${a?`<button class="m3-btn-icon" onclick="window.editCustomer('${l}', '${u}', '${d}', '${f}', '${p}')" title="এডিট"><i class="fa-solid fa-pen-to-square text-amber-400"></i></button>`:``}
                ${o?`<button class="m3-btn-icon" onclick="window.deleteCustomer('${l}', '${u}')" title="ডিলেট"><i class="fa-solid fa-trash-can text-red-400"></i></button>`:``}
            </div>
        </div>`});let l=document.getElementById(`cust-scroll-area`),u=document.getElementById(`customer-list`);if(window.customerClusterize){try{window.customerClusterize.destroy()}catch(e){console.warn(`Cust clusterize destroy err:`,e)}window.customerClusterize=null}if(s.length>0)if(l&&u)try{window.customerClusterize=new Kt.default({rows:s,scrollId:`cust-scroll-area`,contentId:`customer-list`})}catch(e){console.warn(`Cust clusterize init fallback:`,e),t.innerHTML=s.join(``)}else t.innerHTML=s.join(``);else t.innerHTML=`<tr><td colspan="6" class="text-center py-20 text-slate-500 italic font-bold">কোনো কাস্টমার পাওয়া যায়নি</td></tr>`;n&&(n.innerHTML=c||`<div class="text-center py-10 text-slate-500 font-bold italic">কোনো কাস্টমার পাওয়া যায়নি</div>`)}function Yt(){[`cust-name`,`cust-phone`,`cust-address`,`cust-initial-balance`].forEach(e=>{let t=document.getElementById(e);t&&(t.value=``)}),Ee(`cust-initial-words`);let e=document.getElementById(`cust-date`);if(e){let t=R();e.value=t,e._flatpickr&&e._flatpickr.setDate(t,!1)}let t=document.getElementById(`cust-zone-select`);t&&(t.selectedIndex=0)}async function Xt(){if(!navigator.onLine)return H.default.fire({title:`<i class="fa-solid fa-wifi text-red-400 mr-2"></i>অফলাইন!`,html:`<p class="font-bn text-slate-300 text-sm">ইন্টারনেট সংযোগ নেই।<br><strong class="text-red-400">অফলাইনে নতুন কাস্টমার যোগ করা যাবে না।</strong><br><span class="text-xs text-slate-400 mt-1 block">অনুগ্রহ করে ইন্টারনেট চালু করে আবার চেষ্টা করুন।</span></p>`,icon:`error`,confirmButtonText:`ঠিক আছে`,customClass:{popup:`!bg-slate-950 !text-white !rounded-3xl border border-red-500/30 font-bn`,confirmButton:`m3-btn-primary !bg-red-600 hover:!bg-red-500 !px-6 !py-2 !rounded-xl font-bold`}});let e=z(document.getElementById(`cust-date`).value),t=document.getElementById(`cust-name`).value.trim(),r=document.getElementById(`cust-phone`).value.trim(),i=document.getElementById(`cust-address`).value.trim(),s=document.getElementById(`cust-zone-select`).value,c=document.getElementById(`cust-initial-balance`).value.trim();if(!t||!r||!s)return H.default.fire(`এরর`,`নাম, মোবাইল নম্বর ও জোন আবশ্যক!`,`error`);let l=safeRound(I(c)),u=document.getElementById(`cust-generated-acc`)?.value||`Auto`,d=V(l);if(!(await H.default.fire({title:`<div class="flex items-center justify-center gap-2 font-bn font-black text-xl text-white"><i class="fa-solid fa-file-shield text-blue-400"></i><span>তথ্য যাচাই করুন</span></div>`,html:`<div class="text-left space-y-3 font-bn p-3.5 bg-slate-900/90 rounded-2xl border border-slate-800 shadow-inner">
                <div class="grid grid-cols-2 gap-4 border-b border-slate-800/80 pb-2.5">
                    <div class="flex flex-col gap-1"><span class="text-[10px] text-blue-400 font-black uppercase tracking-wider">কাস্টমারের নাম</span><span class="text-base text-white font-black">${t}</span></div>
                    <div class="flex flex-col gap-1"><span class="text-[10px] text-amber-400 font-black uppercase tracking-wider">অ্যাকাউন্ট নং</span><span class="text-base text-amber-400 font-black font-mono">${u}</span></div>
                </div>
                <div class="grid grid-cols-2 gap-4 border-b border-slate-800/80 pb-2.5">
                    <div class="flex flex-col gap-1"><span class="text-[10px] text-blue-400 font-black uppercase tracking-wider">মোবাইল নম্বর</span><span class="text-sm text-slate-200 font-bold font-mono">${r}</span></div>
                    <div class="flex flex-col gap-1"><span class="text-[10px] text-purple-400 font-black uppercase tracking-wider">জোন</span><span class="text-sm text-slate-200 font-bold">${s}</span></div>
                </div>
                <div class="flex flex-col gap-1 border-b border-slate-800/80 pb-2.5">
                    <span class="text-[10px] text-sky-400 font-black uppercase tracking-wider flex items-center gap-1"><i class="fa-solid fa-location-dot text-amber-400 text-xs"></i>ঠিকানা (Address)</span>
                    <span class="text-xs text-slate-200 font-medium">${i||`N/A`}</span>
                </div>
                <div class="flex flex-col gap-1 pt-1">
                    <span class="text-[10px] text-emerald-400 font-black uppercase tracking-wider">অবশিষ্ট ব্যালেন্স (Opening)</span>
                    <span class="text-2xl text-emerald-400 font-black">৳ ${F(l)}</span>
                    ${d?`<div class="text-[11px] text-emerald-400 font-black italic bg-emerald-500/10 px-2.5 py-1 rounded-xl border border-emerald-500/20 mt-1">(${d})</div>`:``}
                </div>
                <div class="flex flex-col gap-1 pt-2 border-t border-slate-800/80">
                    <span class="text-[10px] text-slate-400 font-black uppercase tracking-wider">হিসাব খোলার তারিখ</span>
                    <span class="text-sm text-slate-300 font-bold font-mono">${B(e)}</span>
                </div>
            </div>
            <p class="text-xs text-amber-400 font-bold mt-4 text-center">সব তথ্য সঠিক থাকলে "কনফার্ম করুন" বাটনে ক্লিক করুন।</p>`,showCancelButton:!0,confirmButtonText:`<i class="fa-solid fa-circle-check mr-2"></i>কনফার্ম করুন`,cancelButtonText:`<i class="fa-solid fa-pen-to-square mr-2"></i>সংশোধন করব`,customClass:{popup:`!bg-slate-950 !text-white !rounded-3xl border border-slate-800 shadow-2xl font-bn`,confirmButton:`m3-btn-primary !bg-blue-600 hover:!bg-blue-500 !px-7 !py-2.5 !rounded-xl font-bold shadow-lg shadow-blue-600/30`,cancelButton:`m3-btn-tonal !bg-slate-800 hover:!bg-slate-700 !text-slate-300 !px-5 !py-2.5 !rounded-xl font-bold border border-slate-700`}})).isConfirmed)return;let f=document.getElementById(`save-cust-btn`);f&&(f.disabled=!0,f.innerText=`সেভ হচ্ছে...`);try{let c=``,u=``;await m.runTransaction(async d=>{let f=Et.find(e=>e.name===s);u=(f?f.code:``)+await g.getNextAccountNo(s,d);let p=a.getRef();c=p.id;let m=o.getRef();d.set(p,{name:t,phone:r,address:i,zone:s||``,accountNo:u,openingDate:e,initialDue:l,totalDue:l,createdAt:n.firestore.FieldValue.serverTimestamp()}),d.set(m,{customerId:c,customerName:t,date:e,voucherNo:`OPENING`,bill:l>0?l:0,paid:l<0?Math.abs(l):0,prevDue:0,currentDue:l,notes:`প্রারম্ভিক ব্যালেন্স (Opening Balance)`,createdBy:window.AppState?.currentUserEmail||`System`,createdAt:n.firestore.FieldValue.serverTimestamp()})}),O(`CREATE`,`Customers`,c,t,{phone:r,zone:s,initialBalance:l});let d=`কাস্টমার <strong>${t}</strong> সফলভাবে ডাটাবেসে যোগ করা হয়েছে। জোন: ${s||`N/A`}`;if(await H.default.fire({title:`সফল!`,html:d,icon:`success`,timer:1500,showConfirmButton:!1,customClass:{popup:`!bg-slate-900 !text-white !rounded-3xl border border-slate-700`}}),r&&r.trim()!==``&&r!==`-`)try{let e=await g.getAppSettings(),n=(typeof window.toBanglishName==`function`?window.toBanglishName(t):t)||`Customer`,i=e.shopName?typeof window.toBanglishName==`function`?window.toBanglishName(e.shopName):e.shopName:`M/S. Maa Motors`,a=window.formatAppDate&&window.getTodayLocalDateString?window.formatAppDate(window.getTodayLocalDateString()):`Today`,o=(e.smsTemplateOpening||`Dear [Name] [AccNo], A/C opened at [Shop] on [Date]. Opening Due: Tk [Due]. Thanks!`).replace(/\[Name\]/g,n).replace(/\[AccNo\]/g,`(A/C: ${u})`).replace(/\[Shop\]/g,i).replace(/\[Date\]/g,a).replace(/\[Due\]/g,F(Math.abs(l)));o=o.replace(/\s+/g,` `);let{value:s,isConfirmed:c}=await H.default.fire({title:`<div class="flex flex-col items-center gap-2"><i class="fa-solid fa-comment-sms text-emerald-400 text-3xl mb-1"></i><span class="font-bn font-black text-xl text-white">Welcome SMS</span></div>`,html:`<div class="text-left space-y-2 mb-2 font-bn">
                            <p class="text-[13px] text-slate-300">কাস্টমারকে কি অ্যাকাউন্ট খোলার মেসেজ পাঠাতে চান? চাইলে নিচের লেখা এডিট করতে পারেন:</p>
                            <div class="flex justify-between items-center"><div class="text-xs text-slate-400">Recipient Phone: <strong class="text-white">${r}</strong></div><div id="sms-open-char-counter" class="text-[11px] font-bold text-emerald-400 text-right">${U(o)}</div></div>
                           </div>`,input:`textarea`,inputValue:o,inputAttributes:{rows:4,class:`m3-field text-xs font-mono !mt-0`},showCancelButton:!0,confirmButtonText:`<i class="fa-solid fa-paper-plane mr-1.5"></i> পাঠিয়ে দিন`,cancelButtonText:`স্কিপ করুন`,customClass:{popup:`!bg-slate-950 !text-white !rounded-3xl border border-slate-700 shadow-2xl`,confirmButton:`m3-btn-primary !bg-emerald-600 hover:!bg-emerald-500 !px-7 !py-2.5 !rounded-xl font-bold shadow-lg shadow-emerald-600/30`,cancelButton:`m3-btn-tonal !bg-slate-800 hover:!bg-slate-700 !text-slate-300 !px-5 !py-2.5 !rounded-xl font-bold border border-slate-700`},didOpen:()=>{let e=H.default.getInput(),t=document.getElementById(`sms-open-char-counter`),n=()=>{e&&t&&(t.innerText=U(e.value))};e&&(e.oninput=n,n(),setTimeout(()=>e.focus(),150))}});c&&s&&await De(r,s,!1)&&K(`Welcome SMS পাঠানো হয়েছে`,`success`)}catch(e){console.error(`Welcome SMS Error:`,e)}Yt(),window.toggleAddCustomerForm&&window.toggleAddCustomerForm(),window.loadCustomers&&window.loadCustomers()}catch(e){G(e,`কাস্টমার যোগ করা যায়নি`)}finally{f&&(f.disabled=!1,f.innerText=`সেভ করুন`)}}async function Zt(e,t,r,i,s){if(window.AppState.currentUserRole!==`Admin`)return H.default.fire(`অ্যাক্সেস ডিনাইড!`,`শুধুমাত্র অ্যাডমিন কাস্টমার তথ্য এডিট করতে পারবেন।`,`error`);if(!navigator.onLine)return H.default.fire({title:`<i class="fa-solid fa-wifi text-red-400 mr-2"></i>অফলাইন!`,html:`<p class="font-bn text-slate-300 text-sm">ইন্টারনেট সংযোগ নেই।<br><strong class="text-red-400">অফলাইনে কাস্টমার এডিট করা যাবে না।</strong><br><span class="text-xs text-slate-400 mt-1 block">অনুগ্রহ করে ইন্টারনেট চালু করে আবার চেষ্টা করুন।</span></p>`,icon:`error`,confirmButtonText:`ঠিক আছে`,customClass:{popup:`!bg-slate-950 !text-white !rounded-3xl border border-red-500/30 font-bn`,confirmButton:`m3-btn-primary !bg-red-600 hover:!bg-red-500 !px-6 !py-2 !rounded-xl font-bold`}});if(!await W(`কাস্টমার তথ্য এডিট (Authorization)`))return;let c=Tt.find(t=>t.id===e),l=c&&c.initialDue||0,u=c?.openingDate||(c?.createdAt?c.createdAt.toDate().toISOString().split(`T`)[0]:R()),d=`<option value="">-- জোন সিলেক্ট --</option>`;Et.forEach(e=>{let t=typeof e==`string`?e:e.name;d+=`<option value="${t}" ${t===s?`selected`:``}>${t}</option>`});let{value:f}=await H.default.fire({title:`<i class="fa-solid fa-user-pen text-blue-400 mr-2"></i>কাস্টমার তথ্য এডিট করুন`,html:`
            <div class="space-y-4 text-left p-1 font-bn">
                <div class="grid grid-cols-2 gap-4">
                    <div><label class="block text-[11px] font-black text-blue-400 uppercase mb-1 ml-1">হিসাব খোলার তারিখ *</label><input id="ed-d" class="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-white outline-none focus:border-blue-500 text-sm datepicker" value="${u}"></div>
                    <div><label class="block text-[11px] font-black text-blue-400 uppercase mb-1 ml-1">কাস্টমারের নাম *</label><input id="ed-n" class="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-white outline-none focus:border-blue-500 text-sm" value="${t}"></div>
                </div>
                <div><label class="block text-[11px] font-black text-blue-400 uppercase mb-1 ml-1">মোবাইল নম্বর *</label><input id="ed-p" class="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-white outline-none focus:border-blue-500 text-sm" value="${r}"></div>
                <div><label class="block text-[11px] font-black text-blue-400 uppercase mb-1 ml-1">ঠিকানা (ঐচ্ছিক)</label><input id="ed-a" class="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-white outline-none focus:border-blue-500 text-sm" value="${i}"></div>
                <div class="grid grid-cols-2 gap-4">
                    <div><label class="block text-[11px] font-black text-purple-400 uppercase mb-1 ml-1">জোন / অঞ্চল</label><select id="ed-z" class="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-white outline-none focus:border-blue-500 text-sm">${d}</select></div>
                    <div><label class="block text-[11px] font-black text-amber-400 uppercase mb-1 ml-1">অ্যাকাউন্ট নং (A/C No)</label><input id="ed-acc" class="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-amber-400 font-mono font-bold outline-none focus:border-amber-500 text-sm" value="${c?.accountNo||``}"></div>
                </div>
                <div>
                    <label class="block text-[11px] font-black text-emerald-500 uppercase mb-1 ml-1">Opening Balance</label>
                    <input id="ed-ib" class="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-emerald-400 font-bold outline-none focus:border-emerald-500 text-sm" value="${F(l)}" oninput="window.handleNumberInput(this); window.updateLiveWords(this, 'ed-ib-words');">
                    <div id="ed-ib-words" class="text-[11px] font-black text-emerald-400 mt-1.5 px-2 py-0.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 italic font-bn inline-block${l?``:` hidden`}">${l?`(`+V(l)+`)`:``}</div>
                </div>
            </div>
        `,showCancelButton:!0,confirmButtonText:`আপডেট করুন`,cancelButtonText:`বাতিল`,customClass:{popup:`!bg-slate-900 !text-white !rounded-3xl border border-slate-700`},didOpen:()=>{let e=document.getElementById(`ed-z`),t=document.getElementById(`ed-acc`);e&&t&&e.addEventListener(`change`,async()=>{let n=e.value;if(n)try{let e=(await v.getAllZones()).find(e=>e.name===n),r=e&&e.code||``,i=await g.peekNextAccountNo(n);t.value=r+i}catch(e){console.error(e)}})},preConfirm:()=>{let e=z(document.getElementById(`ed-d`).value),t=document.getElementById(`ed-n`).value.trim(),n=document.getElementById(`ed-p`).value.trim(),r=document.getElementById(`ed-a`).value.trim(),i=document.getElementById(`ed-z`).value,a=document.getElementById(`ed-acc`).value.trim(),o=safeRound(I(document.getElementById(`ed-ib`).value));return!t||!n?H.default.showValidationMessage(`নাম ও মোবাইল নম্বর আবশ্যক!`):{d:e,n:t,p:n,a:r,z:i,accNo:a,ib:o}}});if(f){let c=V(f.ib);if(!(await H.default.fire({title:`<i class="fa-solid fa-magnifying-glass text-amber-400 mr-2"></i>সংশোধন যাচাই করুন`,html:`<div class="text-left space-y-3 font-bn p-2 bg-slate-900 rounded-2xl border border-slate-800">
                    <div class="grid grid-cols-2 gap-4 border-b border-slate-800 pb-2">
                        <div class="flex flex-col gap-1"><span class="text-[10px] text-blue-400 font-black uppercase">নতুন নাম</span><span class="text-base text-white font-black">${f.n}</span></div>
                        <div class="flex flex-col gap-1"><span class="text-[10px] text-amber-500 font-black uppercase">অ্যাকাউন্ট নং</span><span class="text-base text-amber-400 font-black font-mono">${f.accNo||`-`}</span></div>
                    </div>
                    <div class="grid grid-cols-2 gap-4 border-b border-slate-800 pb-2">
                        <div class="flex flex-col gap-1"><span class="text-[10px] text-blue-400 font-black uppercase">মোবাইল</span><span class="text-sm text-slate-200 font-bold">${f.p}</span></div>
                        <div class="flex flex-col gap-1"><span class="text-[10px] text-purple-400 font-black uppercase">জোন</span><span class="text-sm text-slate-200 font-bold">${f.z}</span></div>
                    </div>
                    <div class="flex flex-col gap-1 border-b border-slate-800 pb-2">
                        <span class="text-[10px] text-sky-400 font-black uppercase flex items-center gap-1"><i class="fa-solid fa-location-dot text-amber-400 text-xs"></i>ঠিকানা (Address)</span>
                        <span class="text-xs text-slate-200 font-medium">${f.a||`N/A`}</span>
                    </div>
                    <div class="flex flex-col gap-1 pt-1">
                        <span class="text-[10px] text-emerald-400 font-black uppercase">সংশোধিত Opening Balance</span>
                        <span class="text-2xl text-emerald-400 font-black">৳ ${F(f.ib)}</span>
                        ${c?`<div class="text-[11px] text-emerald-500 font-black italic bg-emerald-500/10 px-2 py-1 rounded-lg border border-emerald-500/20 mt-1">(${c})</div>`:``}
                    </div>
                </div>
                <p class="text-[11px] text-amber-500 font-bold mt-4 text-center">তথ্যগুলো কি আপডেট করবেন?</p>`,showCancelButton:!0,confirmButtonText:`<i class="fa-solid fa-circle-check mr-2"></i>হ্যাঁ, আপডেট করুন`,cancelButtonText:`<i class="fa-solid fa-pen-to-square mr-2"></i>না, ঠিক করব`,customClass:{popup:`!bg-slate-950 !text-white !rounded-3xl border border-slate-800 shadow-2xl font-bn`,confirmButton:`m3-btn-primary !bg-blue-600 hover:!bg-blue-500 !px-7 !py-2.5 !rounded-xl font-bold shadow-lg shadow-blue-600/30`,cancelButton:`m3-btn-tonal !bg-slate-800 hover:!bg-slate-700 !text-slate-300 !px-5 !py-2.5 !rounded-xl font-bold border border-slate-700`}})).isConfirmed)return;try{H.default.fire({title:`আপডেট হচ্ছে...`,allowOutsideClick:!1,didOpen:()=>H.default.showLoading()});let c=safeRound(f.ib-l),d=a.getRef(e),p=await o.getByCustomer(e),h={name:f.n,phone:f.p,address:f.a,zone:f.z||``,accountNo:f.accNo||``,openingDate:f.d,initialDue:f.ib,totalDue:n.firestore.FieldValue.increment(c),updatedAt:n.firestore.FieldValue.serverTimestamp()},g=[e=>e.update(d,h)];p.forEach(e=>{let t={customerName:f.n};e.voucherNo===`OPENING`&&(t.date=f.d,t.bill=f.ib>0?f.ib:0,t.paid=f.ib<0?Math.abs(f.ib):0,t.currentDue=f.ib),g.push(n=>n.update(o.getRef(e.id),t))});for(let e=0;e<g.length;e+=400){let t=m.batch();g.slice(e,e+400).forEach(e=>e(t)),await t.commit()}O(`UPDATE`,`Customers`,e,f.n,{old:{name:t,phone:r,address:i,zone:s,initialDue:l,openingDate:u},new:f}),H.default.fire(`সফল!`,`কাস্টমার তথ্য ও একাউন্ট নম্বর (${f.accNo}) সফলভাবে আপডেট হয়েছে।`,`success`),window.loadCustomers&&window.loadCustomers()}catch(e){G(e,`কাস্টমার তথ্য আপডেট করা যায়নি`)}}}async function Qt(){if(!navigator.onLine)return H.default.fire({title:`<i class="fa-solid fa-wifi text-red-400 mr-2"></i>অফলাইন!`,html:`<p class="font-bn text-slate-300 text-sm">ইন্টারনেট সংযোগ নেই।<br><strong class="text-red-400">অফলাইনে নতুন কাস্টমার যোগ করা যাবে না।</strong><br><span class="text-xs text-slate-400 mt-1 block">অনুগ্রহ করে ইন্টারনেট চালু করে আবার চেষ্টা করুন।</span></p>`,icon:`error`,confirmButtonText:`ঠিক আছে`,customClass:{popup:`!bg-slate-950 !text-white !rounded-3xl border border-red-500/30 font-bn`,confirmButton:`m3-btn-primary !bg-red-600 hover:!bg-red-500 !px-6 !py-2 !rounded-xl font-bold`}});let e=await v.getAllZones(),t=(t=``)=>{let n=`<option value="">-- জোন সিলেক্ট করুন --</option>`;return e.forEach(e=>{let r=e.name===t?`selected`:``;n+=`<option value="${e.name}" data-code="${e.code||``}" ${r}>${e.name} (${e.code||`N/A`})</option>`}),n+=`<option value="__NEW_ZONE__">+ নতুন জোন যোগ করুন...</option>`,n},r=R(),{value:i}=await H.default.fire({title:`<div class="flex items-center justify-center gap-2 font-bn font-black text-xl text-white"><i class="fa-solid fa-user-plus text-blue-400"></i><span>নতুন কাস্টমার যুক্ত করুন</span></div>`,html:`
            <div class="space-y-3 text-left p-1 font-bn">
                <div class="grid grid-cols-2 gap-3">
                    <div>
                        <label class="block text-[11px] font-black text-blue-400 uppercase tracking-widest mb-1 ml-1">কাস্টমারের নাম *</label>
                        <input id="sw-n" class="w-full bg-slate-950/90 border border-slate-700/80 rounded-xl px-3.5 py-2 text-white outline-none focus:border-blue-500 text-xs font-bold transition-all" placeholder="নাম লিখুন">
                    </div>
                    <div>
                        <label class="block text-[11px] font-black text-blue-400 uppercase tracking-widest mb-1 ml-1">মোবাইল নম্বর *</label>
                        <input id="sw-p" class="w-full bg-slate-950/90 border border-slate-700/80 rounded-xl px-3.5 py-2 text-white outline-none focus:border-blue-500 text-xs font-bold transition-all" placeholder="০১৭xxxxxxxx">
                    </div>
                </div>

                <div class="grid grid-cols-2 gap-3">
                    <div>
                        <div class="flex justify-between items-center mb-1 ml-1">
                            <label class="block text-[11px] font-black text-blue-400 uppercase tracking-widest">জোন / অঞ্চল *</label>
                            <button type="button" id="sw-add-zone-btn" class="text-[10px] text-amber-400 font-bold hover:underline cursor-pointer"><i class="fa-solid fa-plus text-[9px]"></i> নতুন জোন</button>
                        </div>
                        <select id="sw-z" class="w-full bg-slate-950/90 border border-slate-700/80 rounded-xl px-3.5 py-2 text-white outline-none focus:border-blue-500 text-xs font-bold transition-all">
                            ${t()}
                        </select>
                    </div>
                    <div>
                        <label class="block text-[11px] font-black text-slate-400 uppercase tracking-widest mb-1 ml-1">ঠিকানা (ঐচ্ছিক)</label>
                        <input id="sw-a" class="w-full bg-slate-950/90 border border-slate-700/80 rounded-xl px-3.5 py-2 text-white outline-none focus:border-blue-500 text-xs font-bold transition-all" placeholder="ঠিকানা">
                    </div>
                </div>

                <div class="grid grid-cols-2 gap-3 p-2 bg-slate-950/60 rounded-xl border border-slate-800">
                    <div>
                        <label class="block text-[10px] font-black text-purple-400 uppercase tracking-widest mb-0.5">জোন কোড (Zone Code)</label>
                        <input id="sw-zcode" type="text" class="w-full bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1 text-purple-400 font-mono font-bold text-xs outline-none" readonly placeholder="-">
                    </div>
                    <div>
                        <label class="block text-[10px] font-black text-amber-400 uppercase tracking-widest mb-0.5">অটো অ্যাকাউন্ট নং (Account No)</label>
                        <input id="sw-acc" type="text" class="w-full bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1 text-amber-400 font-mono font-bold text-xs outline-none" readonly placeholder="অটো জেনারেট...">
                    </div>
                </div>

                <div class="grid grid-cols-2 gap-3 border-t border-slate-800/80 pt-2.5">
                    <div>
                        <label class="block text-[11px] font-black text-emerald-400 uppercase tracking-widest mb-1 ml-1">প্রারম্ভিক ব্যালেন্স / বকেয়া (৳)</label>
                        <input id="sw-bal" type="text" class="w-full bg-slate-950/90 border border-emerald-500/40 rounded-xl px-3.5 py-2 text-emerald-400 outline-none focus:border-emerald-500 text-xs font-black transition-all" placeholder="০.০০" oninput="window.handleNumberInput(this); window.updateLiveWords(this, 'sw-bal-words');">
                        <div id="sw-bal-words" class="text-[10px] font-black text-emerald-400 mt-1 hidden italic truncate"></div>
                    </div>
                    <div>
                        <label class="block text-[11px] font-black text-slate-400 uppercase tracking-widest mb-1 ml-1">হিসাব খোলার তারিখ *</label>
                        <input id="sw-d" type="text" class="w-full bg-slate-950/90 border border-slate-700/80 rounded-xl px-3.5 py-2 text-white outline-none focus:border-blue-500 text-xs font-bold datepicker cursor-pointer" value="${r}">
                    </div>
                </div>
            </div>
        `,focusConfirm:!1,showCancelButton:!0,confirmButtonText:`<i class="fa-solid fa-circle-check mr-1.5"></i> সেভ করুন`,cancelButtonText:`বাতিল`,customClass:{popup:`!bg-slate-950 !text-white !rounded-3xl border border-slate-800 shadow-2xl !p-6 font-bn`,confirmButton:`m3-btn-primary !bg-blue-600 hover:!bg-blue-500 !text-white !rounded-xl !px-7 !py-2 font-bold`,cancelButton:`m3-btn-tonal !bg-slate-800 hover:!bg-slate-700 !text-slate-300 !rounded-xl !px-5 !py-2 font-bold border border-slate-700`},didOpen:()=>{let n=document.getElementById(`sw-z`),r=document.getElementById(`sw-add-zone-btn`),i=document.getElementById(`sw-zcode`),a=document.getElementById(`sw-acc`),o=async()=>{let e=n?.value;if(e===`__NEW_ZONE__`){n&&(n.value=``),s();return}let t=n?.options[n.selectedIndex],r=t&&t.dataset.code||``;if(i&&(i.value=r),e){let t=await g.peekNextAccountNo(e);a&&(a.value=r+t)}else a&&(a.value=``)},s=async()=>{let{value:r}=await H.default.fire({title:`নতুন জোন যুক্ত করুন`,html:`
                        <div class="space-y-3 text-left font-bn p-2">
                            <div><label class="block text-xs font-bold text-slate-300 mb-1">জোনের নাম * (যেমন: চট্টগ্রাম)</label><input id="nz-name" class="m3-field text-xs font-bold" placeholder="জোনের নাম"></div>
                            <div><label class="block text-xs font-bold text-slate-300 mb-1">জোন শর্ট কোড * (যেমন: CTG)</label><input id="nz-code" class="m3-field text-xs font-bold font-mono uppercase" placeholder="কোড"></div>
                        </div>`,showCancelButton:!0,confirmButtonText:`সেভ জোন`,cancelButtonText:`বাতিল`,customClass:{popup:`!bg-slate-950 !text-white !rounded-3xl border border-slate-800`},preConfirm:()=>{let e=document.getElementById(`nz-name`)?.value?.trim(),t=document.getElementById(`nz-code`)?.value?.trim()?.toUpperCase();return!e||!t?H.default.showValidationMessage(`জোনের নাম ও কোড আবশ্যক!`):{name:e,code:t}}});r&&r.name&&(await v.addZone(r.name,r.code),e=await v.getAllZones(),n&&(n.innerHTML=t(r.name),o()))};n&&n.addEventListener(`change`,o),r&&r.addEventListener(`click`,s)},preConfirm:()=>{let e=document.getElementById(`sw-n`)?.value?.trim(),t=document.getElementById(`sw-p`)?.value?.trim(),n=document.getElementById(`sw-z`)?.value?.trim(),i=document.getElementById(`sw-a`)?.value?.trim(),a=document.getElementById(`sw-bal`)?.value?.trim()||`0`,o=document.getElementById(`sw-d`)?.value?.trim()||r,s=document.getElementById(`sw-acc`)?.value||`Auto`;return!e||!t||!n?(H.default.showValidationMessage(`নাম, মোবাইল ও জোন আবশ্যক!`),!1):{n:e,p:t,z:n,a:i,initialBalance:safeRound(I(a)),d:z(o),accNo:s}}});if(i&&i.n){let t=V(i.initialBalance);if(!(await H.default.fire({title:`<div class="flex items-center justify-center gap-2 font-bn font-black text-xl text-white"><i class="fa-solid fa-file-shield text-blue-400"></i><span>তথ্য যাচাই করুন</span></div>`,html:`
                <div class="text-left space-y-3 font-bn p-3.5 bg-slate-900/90 rounded-2xl border border-slate-800 shadow-inner">
                    <div class="grid grid-cols-2 gap-4 border-b border-slate-800/80 pb-2.5">
                        <div class="flex flex-col gap-1"><span class="text-[10px] text-blue-400 font-black uppercase tracking-wider">কাস্টমারের নাম</span><span class="text-base text-white font-black">${i.n}</span></div>
                        <div class="flex flex-col gap-1"><span class="text-[10px] text-amber-400 font-black uppercase tracking-wider">অ্যাকাউন্ট নং</span><span class="text-base text-amber-400 font-black font-mono">${i.accNo}</span></div>
                    </div>
                    <div class="grid grid-cols-2 gap-4 border-b border-slate-800/80 pb-2.5">
                        <div class="flex flex-col gap-1"><span class="text-[10px] text-blue-400 font-black uppercase tracking-wider">মোবাইল নম্বর</span><span class="text-sm text-slate-200 font-bold font-mono">${i.p}</span></div>
                        <div class="flex flex-col gap-1"><span class="text-[10px] text-purple-400 font-black uppercase tracking-wider">জোন</span><span class="text-sm text-slate-200 font-bold">${i.z}</span></div>
                    </div>
                    <div class="flex flex-col gap-1 border-b border-slate-800/80 pb-2.5">
                        <span class="text-[10px] text-sky-400 font-black uppercase tracking-wider flex items-center gap-1"><i class="fa-solid fa-location-dot text-amber-400 text-xs"></i>ঠিকানা (Address)</span>
                        <span class="text-xs text-slate-200 font-medium">${i.a||`N/A`}</span>
                    </div>
                    <div class="flex flex-col gap-1 pt-1">
                        <span class="text-[10px] text-emerald-400 font-black uppercase tracking-wider">অবশিষ্ট ব্যালেন্স (Opening)</span>
                        <span class="text-2xl text-emerald-400 font-black">৳ ${F(i.initialBalance)}</span>
                        ${t?`<div class="text-[11px] text-emerald-400 font-black italic bg-emerald-500/10 px-2.5 py-1 rounded-xl border border-emerald-500/20 mt-1">(${t})</div>`:``}
                    </div>
                    <div class="flex flex-col gap-1 pt-2 border-t border-slate-800/80">
                        <span class="text-[10px] text-slate-400 font-black uppercase tracking-wider">হিসাব খোলার তারিখ</span>
                        <span class="text-sm text-slate-300 font-bold font-mono">${B(i.d)}</span>
                    </div>
                </div>
                <p class="text-xs text-amber-400 font-bold mt-4 text-center">সব তথ্য সঠিক থাকলে "কনফার্ম করুন" বাটনে ক্লিক করুন।</p>
            `,showCancelButton:!0,confirmButtonText:`<i class="fa-solid fa-circle-check mr-2"></i>কনফার্ম করুন`,cancelButtonText:`<i class="fa-solid fa-pen-to-square mr-2"></i>সংশোধন করব`,customClass:{popup:`!bg-slate-950 !text-white !rounded-3xl border border-slate-800 shadow-2xl font-bn`,confirmButton:`m3-btn-primary !bg-blue-600 hover:!bg-blue-500 !px-7 !py-2.5 !rounded-xl font-bold shadow-lg shadow-blue-600/30`,cancelButton:`m3-btn-tonal !bg-slate-800 hover:!bg-slate-700 !text-slate-300 !px-5 !py-2.5 !rounded-xl font-bold border border-slate-700`}})).isConfirmed)return;H.default.fire({title:`সেভ হচ্ছে...`,allowOutsideClick:!1,didOpen:()=>H.default.showLoading()});try{let t=``,r=i.accNo;return await m.runTransaction(async s=>{let c=e.find(e=>e.name===i.z);r=(c?c.code:``)+await g.getNextAccountNo(i.z,s);let l=a.getRef();t=l.id,s.set(l,{name:i.n,phone:i.p,address:i.a||``,zone:i.z,accountNo:r,initialDue:i.initialBalance,totalDue:i.initialBalance,openingDate:i.d,createdAt:n.firestore.FieldValue.serverTimestamp()});let u=o.getRef();s.set(u,{customerId:t,customerName:i.n,date:i.d,voucherNo:`OPENING`,bill:i.initialBalance>0?i.initialBalance:0,paid:i.initialBalance<0?Math.abs(i.initialBalance):0,prevDue:0,currentDue:i.initialBalance,notes:`প্রারম্ভিক ব্যালেন্স (Opening Balance)`,createdBy:window.AppState?.currentUserEmail||`System`,createdAt:n.firestore.FieldValue.serverTimestamp()})}),O(`CREATE`,`Customers`,t,i.n,{phone:i.p,zone:i.z,initialBalance:i.initialBalance}),window.loadCustomersForDropdown&&await window.loadCustomersForDropdown(),window.loadCustomers&&window.loadCustomers(),H.default.fire({toast:!0,position:`top-end`,icon:`success`,title:`কাস্টমার "${i.n}" যুক্ত হয়েছে (ID: ${r})`,showConfirmButton:!1,timer:3e3,customClass:{popup:`!bg-slate-900 !text-white border border-slate-700`}}),t}catch(e){G(e,`কাস্টমার সেভ করা যায়নি`)}}}window.quickAddCustomer=Qt;async function $t(e,t){if(window.AppState?.currentUserRole!==`Admin`)return H.default.fire(`অ্যাক্সেস ডিনাইড!`,`শুধুমাত্র অ্যাডমিন কাস্টমার ডিলেট করতে পারবেন।`,`error`);if(await W(`কাস্টমার ডিলেট (Master PIN)`,`deleteCustomer`)&&(await H.default.fire({title:`<i class="fa-solid fa-triangle-exclamation text-amber-500 mr-2"></i>ডিলিট কনফার্মেশন`,html:`<p class="text-xs text-slate-300 font-bn leading-relaxed mt-2 text-left">আপনি কি নিশ্চিত যে আপনি <strong>${t}</strong>-এর সম্পূর্ণ প্রোফাইল ডিলিট করতে চান?<br><br><span class="text-amber-400 font-bold block bg-amber-500/10 p-3 border border-amber-500/20 rounded-xl"><i class="fa-solid fa-info-circle mr-1.5"></i>কাস্টমার এবং তার সমস্ত লেনদেনের হিসেব ডিলিট হয়ে <b>রিসাইকেল বিনে</b> জমা হবে। আপনি চাইলে পরবর্তীতে রিস্টোর করতে পারবেন।</span></p>`,icon:`warning`,showCancelButton:!0,confirmButtonText:`হ্যাঁ, ডিলিট করুন`,cancelButtonText:`বাতিল`,confirmButtonColor:`#f59e0b`,customClass:{popup:`!bg-slate-950 !text-white !rounded-3xl border border-amber-500/30 font-bn`,confirmButton:`m3-btn-primary !bg-amber-600 hover:!bg-amber-500`,cancelButton:`m3-btn-tonal !bg-slate-800`}})).isConfirmed)try{H.default.fire({title:`ডিলিট হচ্ছে...`,allowOutsideClick:!1,didOpen:()=>H.default.showLoading()});let r=(Tt||[]).find(t=>t.id===e),i=await o.getByCustomer(e),s=`batch_`+Date.now(),c=n.firestore.FieldValue.serverTimestamp(),l=window.AppState?.currentUserEmail||`Unknown`,u=[];u.push(n=>n.set(m.collection(`recycle_bin`).doc(e),{module:`Customer`,batchId:s,data:r||{id:e,name:t},deletedAt:c,deletedBy:l})),u.push(t=>t.delete(a.getRef(e))),i.forEach(e=>{u.push(t=>t.set(m.collection(`recycle_bin`).doc(e.id),{module:`Transaction`,batchId:s,data:e,deletedAt:c,deletedBy:l})),u.push(t=>t.delete(o.getRef(e.id)))});for(let e=0;e<u.length;e+=400){let t=m.batch();u.slice(e,e+400).forEach(e=>e(t)),await t.commit()}O(`DELETE`,`Customers`,e,t,{action:`Soft Delete Customer & Txns to Recycle Bin`}),r?.zone&&window.appAdmin?.syncSingleZoneCounter&&window.appAdmin.syncSingleZoneCounter(r.zone).catch(e=>console.warn(e)),K(`কাস্টমার রিসাইকেল বিনে মুভ করা হয়েছে`,`success`),H.default.fire(`সফল!`,`কাস্টমার এবং তার সকল লেনদেন রিসাইকেল বিনে জমা হয়েছে।`,`success`),window.loadCustomers&&window.loadCustomers(),window.renderCustomerTable&&window.renderCustomerTable()}catch(e){G(e,`কাস্টমার মুছে ফেলা সম্ভব হয়নি`)}}async function en(){if(window.AppState.currentUserRole!==`Admin`)return H.default.fire(`অ্যাক্সেস ডিনাইড!`,`শুধুমাত্র অ্যাডমিন কাস্টমার লিস্ট প্রিন্ট করতে পারবেন।`,`error`);if(!await W(`কাস্টমার লিস্ট প্রিন্ট (Full Report)`))return;let{value:e}=await H.default.fire({title:`<div class="flex items-center gap-2 text-sky-400 font-bold text-lg"><i class="fa-solid fa-sliders"></i> প্রিন্ট কলাম কাস্টমাইজেশন</div>`,html:`
            <div class="text-left font-bn text-sm text-slate-300 space-y-3 py-2">
                <p class="text-xs text-slate-400 border-b border-slate-700 pb-2">প্রিন্ট রিপোর্টে যে যে কলামগুলো দেখাতে চান সিলেক্ট করুন:</p>
                <div class="grid grid-cols-2 gap-2 text-xs font-semibold">
                    <label class="flex items-center gap-2 p-2 rounded-xl bg-slate-800/80 border border-slate-700/80 cursor-pointer hover:border-sky-500 transition-all">
                        <input type="checkbox" id="col-sl" checked class="w-4 h-4 text-sky-500 rounded focus:ring-sky-400"> SL (ক্রমিক নং)
                    </label>
                    <label class="flex items-center gap-2 p-2 rounded-xl bg-slate-800/80 border border-slate-700/80 cursor-pointer hover:border-sky-500 transition-all">
                        <input type="checkbox" id="col-date" checked class="w-4 h-4 text-sky-500 rounded focus:ring-sky-400"> খোলার তারিখ (Date)
                    </label>
                    <label class="flex items-center gap-2 p-2 rounded-xl bg-slate-800/80 border border-slate-700/80 cursor-pointer hover:border-sky-500 transition-all">
                        <input type="checkbox" id="col-acc" checked class="w-4 h-4 text-sky-500 rounded focus:ring-sky-400"> A/C NO (হিসাব নং)
                    </label>
                    <label class="flex items-center gap-2 p-2 rounded-xl bg-slate-800/80 border border-slate-700/80 cursor-pointer hover:border-sky-500 transition-all">
                        <input type="checkbox" id="col-code" checked class="w-4 h-4 text-sky-500 rounded focus:ring-sky-400"> জোন কোড (Code)
                    </label>
                    <label class="flex items-center gap-2 p-2 rounded-xl bg-slate-800/80 border border-slate-700/80 cursor-pointer hover:border-sky-500 transition-all">
                        <input type="checkbox" id="col-name" checked class="w-4 h-4 text-sky-500 rounded focus:ring-sky-400"> কাস্টমারের নাম
                    </label>
                    <label class="flex items-center gap-2 p-2 rounded-xl bg-slate-800/80 border border-slate-700/80 cursor-pointer hover:border-sky-500 transition-all">
                        <input type="checkbox" id="col-addr" checked class="w-4 h-4 text-sky-500 rounded focus:ring-sky-400"> ঠিকানা
                    </label>
                    <label class="flex items-center gap-2 p-2 rounded-xl bg-slate-800/80 border border-slate-700/80 cursor-pointer hover:border-sky-500 transition-all">
                        <input type="checkbox" id="col-phone" checked class="w-4 h-4 text-sky-500 rounded focus:ring-sky-400"> মোবাইল নম্বর
                    </label>
                    <label class="flex items-center gap-2 p-2 rounded-xl bg-slate-800/80 border border-slate-700/80 cursor-pointer hover:border-sky-500 transition-all">
                        <input type="checkbox" id="col-zone" checked class="w-4 h-4 text-sky-500 rounded focus:ring-sky-400"> জোন / অঞ্চল
                    </label>
                    <label class="flex items-center gap-2 p-2 rounded-xl bg-slate-800/80 border border-slate-700/80 cursor-pointer hover:border-sky-500 transition-all col-span-2">
                        <input type="checkbox" id="col-bal" checked class="w-4 h-4 text-sky-500 rounded focus:ring-sky-400"> অবশিষ্ট ব্যালেন্স (৳)
                    </label>
                </div>
            </div>
        `,focusConfirm:!1,showCancelButton:!0,confirmButtonText:`<i class="fa-solid fa-print mr-1.5"></i> রিপোর্ট প্রিন্ট করুন`,cancelButtonText:`বাতিল`,customClass:{popup:`!bg-slate-900 !text-white !rounded-2xl border border-slate-700`,confirmButton:`!bg-sky-600 hover:!bg-sky-500 !text-white !font-bold !px-5 !py-2.5 !rounded-xl`,cancelButton:`!bg-slate-800 hover:!bg-slate-700 !text-slate-300 !font-bold !px-5 !py-2.5 !rounded-xl`},preConfirm:()=>{let e={sl:document.getElementById(`col-sl`).checked,date:document.getElementById(`col-date`).checked,acc:document.getElementById(`col-acc`).checked,code:document.getElementById(`col-code`).checked,name:document.getElementById(`col-name`).checked,addr:document.getElementById(`col-addr`).checked,phone:document.getElementById(`col-phone`).checked,zone:document.getElementById(`col-zone`).checked,bal:document.getElementById(`col-bal`).checked};return Object.values(e).some(Boolean)?e:(H.default.showValidationMessage(`কমপক্ষে ১টি কলাম সিলেক্ট করতেই হবে!`),!1)}});if(!e)return;let t=document.getElementById(`cust-search-input`)?.value.trim(),n=document.getElementById(`cust-filter-zone`)?.value,r=Tt.filter(e=>{let r=!t||e.name.toLowerCase().includes(t.toLowerCase())||e.accountNo&&e.accountNo.includes(t),i=!n||e.zone===n;return r&&i});if(r.length===0)return H.default.fire(`Error`,`লিস্টে কোনো ডাটা নেই!`,`warning`);r.sort((e,t)=>(e.accountNo||``).localeCompare(t.accountNo||``,void 0,{numeric:!0}));let i=await g.getAppSettings(),a=await v.getAllZones(),o={};a&&a.length&&a.forEach(e=>o[(e.name||``).trim()]=(e.code||``).trim());let s=n?`${n} জোনের কাস্টমার লিস্ট`:`সকল কাস্টমার লিস্ট`,c=0;r.forEach(e=>c+=Number(e.totalDue)||0);let[l,u,d]=R().split(`-`),f=`${d}/${u}/${l}`,p=Ve(i,{title:`CUSTOMER REPORT`,subtitle:`${s} • ${f}`}),m=`
        <div style="display:flex; justify-content:space-between; align-items:flex-end; border-bottom:2px solid #0284c7; padding-bottom:4px; margin-bottom:8px;">
            <div style="font-size:14px; font-weight:900; color:#0f172a; font-family:'Inter',sans-serif;">CUSTOMER REPORT <span style="font-size:10px; color:#475569; font-weight:normal;">(Continued)</span></div>
            <div style="font-size:10px; color:#475569; font-family:'Hind Siliguri',sans-serif;">${s} • ${f}</div>
        </div>
    `,h=r.map((t,n)=>{let r=n%2==0?`background: #ffffff;`:`background: #f8fafc;`,i=Number(t.totalDue)||0,a=i>0?`#dc2626`:i<0?`#059669`:`#64748b`,s=i===0?`৳ 0`:`৳ ${F(Math.abs(i))} ${i<0?`(Adv)`:``}`,c=t.zone?`<span style="background: #f1f5f9; border: 1px solid #cbd5e1; padding: 2px 7px; border-radius: 10px; font-size: 10px; font-weight: 700; color: #334155; display: inline-block;">${P(t.zone)}</span>`:`-`,l=`-`,u=``;if(t.createdAt)try{let e=t.createdAt.toDate?t.createdAt.toDate():t.createdAt.toMillis?new Date(t.createdAt.toMillis()):new Date(t.createdAt);isNaN(e.getTime())||(l=e.toLocaleDateString(`en-GB`),u=e.toLocaleTimeString(`en-US`,{hour:`numeric`,minute:`2-digit`,hour12:!0}))}catch(e){console.error(`Error parsing customer creation date:`,e)}l===`-`&&(t.openingDate||t.date)&&(l=B(t.openingDate||t.date));let d=(t.zone||``).trim(),f=o[d]?o[d]:`-`,p=``;return e.sl&&(p+=`<td style="text-align:center; vertical-align:middle; border: 1px solid #e2e8f0; padding: 5px 4px; font-size: 11px; font-family: 'Inter', sans-serif; color: #475569;">${n+1}</td>`),e.date&&(p+=`<td style="text-align:center; vertical-align:middle; border: 1px solid #e2e8f0; padding: 4px 2px; font-size: 10px; font-family: 'Inter', sans-serif; color: #334155; line-height: 1.15; white-space: nowrap;"><div style="font-weight: 700;">${l}</div>${u?`<div style="font-size: 8px; color: #64748b; font-weight: 500; margin-top: 1px;">${u}</div>`:``}</td>`),e.acc&&(p+=`<td style="text-align:center; vertical-align:middle; border: 1px solid #e2e8f0; padding: 5px 4px; font-size: 11px; font-weight: 800; font-family: 'Inter', monospace; color: #0284c7;">${P(t.accountNo||`-`)}</td>`),e.code&&(p+=`<td style="text-align:center; vertical-align:middle; border: 1px solid #e2e8f0; padding: 5px 4px; font-size: 10.5px; font-weight: 700; font-family: 'Inter', monospace; color: #475569;">${P(f)}</td>`),e.name&&(p+=`<td style="text-align:left; vertical-align:middle; border: 1px solid #e2e8f0; padding: 5px 6px; font-size: 11px; font-family: 'Kalpurush', 'Hind Siliguri', sans-serif; line-height: 1.25; color: #0f172a;"><strong>${P(t.name)}</strong></td>`),e.addr&&(p+=`<td style="text-align:left; vertical-align:middle; border: 1px solid #e2e8f0; padding: 5px 6px; font-size: 10.5px; font-family: 'Kalpurush', 'Hind Siliguri', sans-serif; line-height: 1.25; color: #334155;">${P(t.address||`-`)}</td>`),e.phone&&(p+=`<td style="text-align:center; vertical-align:middle; border: 1px solid #e2e8f0; padding: 5px 4px; font-size: 11px; font-family: 'Inter', sans-serif; white-space: nowrap; color: #334155;">${P(t.phone||`-`)}</td>`),e.zone&&(p+=`<td style="text-align:center; vertical-align:middle; border: 1px solid #e2e8f0; padding: 5px 4px; font-size: 11px; font-family: 'Kalpurush', 'Hind Siliguri', sans-serif;">${c}</td>`),e.bal&&(p+=`<td style="text-align:right; vertical-align:middle; border: 1px solid #e2e8f0; padding: 5px 6px; font-size: 11px; font-weight: 900; color: ${a}; font-family: 'Inter', sans-serif; white-space: nowrap;">${s}</td>`),{html:`<tr class="print-row-no-break" style="${r}">${p}</tr>`,textLength:e.addr?(t.address||``).length:10}}),_=``;e.sl&&(_+=`<th style="width: 32px; text-align: center; border: 1px solid #cbd5e1; padding: 7px 4px; font-size: 11px; font-weight: 900; color: #1e293b; font-family: 'Hind Siliguri', sans-serif;">SL</th>`),e.date&&(_+=`<th style="width: 70px; text-align: center; border: 1px solid #cbd5e1; padding: 7px 4px; font-size: 11px; font-weight: 900; color: #1e293b; font-family: 'Hind Siliguri', sans-serif;">তারিখ</th>`),e.acc&&(_+=`<th style="width: 65px; text-align: center; border: 1px solid #cbd5e1; padding: 7px 4px; font-size: 11px; font-weight: 900; color: #1e293b; font-family: 'Hind Siliguri', sans-serif;">A/C NO</th>`),e.code&&(_+=`<th style="width: 50px; text-align: center; border: 1px solid #cbd5e1; padding: 7px 4px; font-size: 11px; font-weight: 900; color: #1e293b; font-family: 'Hind Siliguri', sans-serif;">কোড</th>`),e.name&&(_+=`<th style="text-align: left; border: 1px solid #cbd5e1; padding: 7px 6px; font-size: 11px; font-weight: 900; color: #1e293b; font-family: 'Hind Siliguri', sans-serif;">কাস্টমারের নাম</th>`),e.addr&&(_+=`<th style="text-align: left; border: 1px solid #cbd5e1; padding: 7px 6px; font-size: 11px; font-weight: 900; color: #1e293b; font-family: 'Hind Siliguri', sans-serif;">ঠিকানা</th>`),e.phone&&(_+=`<th style="width: 100px; text-align: center; border: 1px solid #cbd5e1; padding: 7px 4px; font-size: 11px; font-weight: 900; color: #1e293b; font-family: 'Hind Siliguri', sans-serif;">মোবাইল নম্বর</th>`),e.zone&&(_+=`<th style="width: 65px; text-align: center; border: 1px solid #cbd5e1; padding: 7px 4px; font-size: 11px; font-weight: 900; color: #1e293b; font-family: 'Hind Siliguri', sans-serif;">জোন</th>`),e.bal&&(_+=`<th style="width: 85px; text-align: right; border: 1px solid #cbd5e1; padding: 7px 6px; font-size: 11px; font-weight: 900; color: #1e293b; font-family: 'Hind Siliguri', sans-serif;">ব্যালেন্স (৳)</th>`),et(await Ze({rowsArray:h,page1HeaderHtml:p,repeatHeaderHtml:m,tableColHeaderHtml:`<thead><tr style="background: #f1f5f9; border-bottom: 2px solid #cbd5e1;">${_}</tr></thead>`,summaryHtml:`
        <div style="display: flex; justify-content: flex-end; margin-top: 16px; page-break-inside: avoid; break-inside: avoid;">
            <div style="width: 260px; background: #f8fafc; border: 1px solid #cbd5e1; border-radius: 10px; padding: 12px; font-family: 'Hind Siliguri', sans-serif; box-shadow: 0 1px 3px rgba(0,0,0,0.05);">
                <div style="display: flex; justify-content: space-between; font-size: 12px; margin-bottom: 6px; border-bottom: 1px dashed #cbd5e1; padding-bottom: 4px;">
                    <span style="color: #64748b; font-weight: 700;">মোট কাস্টমার:</span>
                    <strong style="color: #0f172a; font-weight: 900;">${r.length} জন</strong>
                </div>
                <div style="display: flex; justify-content: space-between; font-size: 12px;">
                    <span style="color: #64748b; font-weight: 700;">মার্কেটে মোট বকেয়া:</span>
                    <strong style="color: #dc2626; font-size: 15px; font-weight: 900;">৳ ${F(c)}</strong>
                </div>
            </div>
        </div>
    `,signatureHtml:`
        <div class="signature-last-page-block" style="margin-top: 45px; page-break-inside: avoid; break-inside: avoid;">
            <div style="display: flex; justify-content: space-between; padding: 0 30px;">
                <div style="border-top: 1.5px dashed #64748b; width: 160px; text-align: center; font-size: 11px; font-weight: 700; color: #334155; padding-top: 6px;">
                    কাস্টমারের স্বাক্ষর<br><span style="font-size: 9px; font-weight: normal; color: #64748b;">Customer Signature</span>
                </div>
                <div style="border-top: 1.5px dashed #64748b; width: 160px; text-align: center; font-size: 11px; font-weight: 700; color: #334155; padding-top: 6px;">
                    কর্তৃপক্ষের স্বাক্ষর<br><span style="font-size: 9px; font-weight: normal; color: #64748b;">Authorized Signature</span>
                </div>
            </div>
        </div>
    `,formattedDate:f}))}async function tn(){try{let e=await v.getAllZones(),t=`<option value="">-- জোন সিলেক্ট --</option>`,n=`<option value="">-- সকল জোন (All Zones) --</option>`;Nt(e),e.forEach(e=>{t+=`<option value="${e.name}" data-code="${e.code}">${e.name} (Code: ${e.code})</option>`,n+=`<option value="${e.name}">${e.name}</option>`});let r=document.getElementById(`cust-zone-select`),i=document.getElementById(`cust-filter-zone`),a=document.getElementById(`dash-cust-zone-select`);r&&(r.innerHTML=t),i&&(i.innerHTML=n),a&&(a.innerHTML=t)}catch(e){console.error(`Error loading zones:`,e)}}async function nn(e=`next`){let t=document.getElementById(`customer-list`);if(t){rt(t,5);try{let t=e===`next`?xt:St.length>1?St[St.length-2]:null,n=await a.getByPage(20,t,`createdAt`,`desc`);Ot(n.lastDoc),e===`next`?t&&St.push(t):St.pop(),document.getElementById(`cust-current-page-display`).innerText=Ct,document.getElementById(`cust-prev-page`).disabled=Ct===1,document.getElementById(`cust-next-page`).disabled=n.count<20,Jt(n.data)}catch(e){console.error(`Load customer page error:`,e),t.innerHTML=`<tr><td colspan="6" class="text-center py-20 text-red-400">ডাটা লোড করতে সমস্যা হয়েছে</td></tr>`}}}async function rn(){let e=document.getElementById(`cust-search-input`)?.value.trim()||``,t=document.getElementById(`cust-filter-zone`)?.value||``,n=document.getElementById(`cust-pagination`);if(!e&&!t){jt(!1),n&&n.classList.remove(`hidden`),nn();return}jt(!0),n&&n.classList.add(`hidden`);let r=Tt;(!r||r.length===0)&&(r=await a.getAll(`name`,`asc`));let i=r.filter(n=>{let r=!e||(typeof window.matchCustomerSearch==`function`?window.matchCustomerSearch(n,e):(n.name||``).toLowerCase().includes(e.toLowerCase())),i=!t||n.zone===t;return r&&i});Jt(i),an(i)}function an(e){let t=0;e.forEach(e=>t=L(t+(Number(e.totalDue)||0)));let n=document.getElementById(`cust-count-badge`),r=document.getElementById(`cust-total-due-badge`);n&&(n.innerText=e.length),r&&(r.innerText=`৳ `+F(t))}async function on(e,t,n,r=``){if(window.AppState?.currentUserRole===`Staff`&&window.AppState?.permissions?.sendSMS===!1)return H.default.fire({title:`অ্যাক্সেস ডিনাইড!`,text:`আপনার কাস্টমারদের SMS পাঠানোর অনুমতি নেই।`,icon:`error`,customClass:{popup:`!bg-slate-900 !text-white !rounded-3xl border border-slate-700`}});if(!e||e===`-`||e.trim()===``)return H.default.fire({title:`মোবাইল নম্বর মিসিং!`,text:`কাস্টমার "${n}"-এর কোনো মোবাইল নম্বর যুক্ত করা নেই। কাস্টমার এডিট করে নম্বর যোগ করুন।`,icon:`warning`,customClass:{popup:`!bg-slate-900 !text-white !rounded-3xl border border-slate-700`}});if(await W(`বকেয়া রিমাইন্ডার SMS পাঠানো (Master PIN)`))try{let i=await g.getAppSettings(),a=(typeof window.toBanglishName==`function`?window.toBanglishName(n):n)||`Customer`,o=i.shopName?typeof window.toBanglishName==`function`?window.toBanglishName(i.shopName):i.shopName:`M/S. Maa Motors`,s=window.formatAppDate&&window.getTodayLocalDateString?window.formatAppDate(window.getTodayLocalDateString()):`Today`,c=r?`(A/C: ${r})`:``,l=(i.smsTemplateReminder||`Reminder: Dear [Name] [AccNo], your due is Tk [Due] on [Date]. Kindly clear payment soon. Thanks! - [Shop]`).replace(/\[Name\]/g,a).replace(/\[AccNo\]/g,c).replace(/\[Shop\]/g,o).replace(/\[Date\]/g,s).replace(/\[Due\]/g,F(Math.abs(t)));l=l.replace(/\s+/g,` `);let{value:u}=await H.default.fire({title:`<i class="fa-solid fa-comment-sms text-blue-400 mr-2"></i>Send Reminder SMS`,html:`<div class="text-left space-y-1 mb-2 font-bn"><div class="text-xs text-slate-400">Recipient Phone: <strong class="text-white">${e}</strong></div><div id="sms-rem-char-counter" class="text-[11px] font-bold text-emerald-400 text-right">${U(l)}</div></div>`,input:`textarea`,inputValue:l,inputAttributes:{rows:5,class:`m3-field text-xs font-mono`},showCancelButton:!0,confirmButtonText:`<i class="fa-solid fa-paper-plane mr-1.5"></i> Send SMS`,cancelButtonText:`Cancel`,customClass:{popup:`!bg-slate-900 !text-white !rounded-3xl border border-slate-700`},didOpen:()=>{let e=H.default.getInput(),t=document.getElementById(`sms-rem-char-counter`),n=()=>{e&&t&&(t.innerText=U(e.value))};e&&(e.oninput=n),n()}});u&&await De(e,u,!1)&&H.default.fire({title:`<i class="fa-solid fa-paper-plane text-emerald-400 mr-2"></i>সফল!`,text:`${n}-কে রিমাইন্ডার SMS সফলভাবে পাঠানো হয়েছে`,icon:`success`,customClass:{popup:`!bg-slate-900 !text-white !rounded-3xl border border-slate-700`}})}catch(e){console.error(e),H.default.fire(`ব্যর্থ!`,`ডাটাবেস এরর।`,`error`)}}async function sn(){let e=document.getElementById(`cust-zone-select`),t=document.getElementById(`cust-zone-code-display`),n=document.getElementById(`cust-generated-acc`);if(!(!e||!t||!n))if(e.selectedIndex>0){let r=e.value,i=e.options[e.selectedIndex].dataset.code;t.value=i;try{n.value=`লোডিং...`,n.value=i+await g.peekNextAccountNo(r)}catch(e){console.error(e),n.value=`Error`}}else t.value=``,n.value=``}async function cn(){let e=document.getElementById(`dash-cust-zone-select`),t=document.getElementById(`dash-cust-zone-code-display`),n=document.getElementById(`dash-cust-generated-acc`);if(!(!e||!t||!n))if(e.selectedIndex>0){let r=e.value,i=e.options[e.selectedIndex].dataset.code;t.value=i;try{n.value=`লোডিং...`,n.value=i+await g.peekNextAccountNo(r)}catch(e){console.error(e),n.value=`Error`}}else t.value=``,n.value=``}window.handleDashZoneChange=cn;async function ln(){if(await W(`বাল্ক তাগাদা পাঠানো`,`sendBulkSMS`))try{H.default.fire({title:`লোডিং...`,text:`বকেয়া কাস্টমার তালিকা স্ক্যান করা হচ্ছে...`,allowOutsideClick:!1,didOpen:()=>H.default.showLoading(),customClass:{popup:`!bg-slate-950 !text-white !rounded-3xl border border-slate-800 font-bn`}});let e=(await a.getAll()).filter(e=>(Number(e.totalDue)||0)>0&&e.phone).sort((e,t)=>(Number(t.totalDue)||0)-(Number(e.totalDue)||0));if(H.default.close(),e.length===0)return H.default.fire({title:`কোনো বকেয়া পাওয়া যায়নি!`,text:`বর্তমানে কোনো কাস্টমারের বকেয়া নেই বা মোবাইল নম্বর যুক্ত নেই।`,icon:`info`,customClass:{popup:`!bg-slate-950 !text-white !rounded-3xl border border-slate-800 font-bn`}});let t=(await g.getAppSettings()).shopName||`M/S. MAA-MOTOR'S`,n=B(R()),r=``;e.forEach((e,t)=>{let n=t<10?`checked`:``,i=e.accountNo?`(${e.accountNo})`:``;r+=`
                <tr class="border-b border-slate-800 hover:bg-slate-900/50 bulk-row" data-search="${(e.name+` `+(e.phone||``)+` `+(e.accountNo||``)).toLowerCase()}">
                    <td class="p-2 text-center w-8">
                        <input type="checkbox" class="bulk-cust-chk w-4 h-4 rounded cursor-pointer" data-id="${e.id}" data-due="${e.totalDue||0}" ${n}>
                    </td>
                    <td class="p-2 font-bold text-white text-xs">${e.name} <span class="text-amber-400 font-mono text-[11px]">${i}</span></td>
                    <td class="p-2 text-slate-300 text-xs font-mono">${e.phone}</td>
                    <td class="p-2 text-right font-black ${e.totalDue<0?`text-emerald-400`:`text-red-400`} text-xs font-mono">৳ ${F(Math.abs(e.totalDue))} ${e.totalDue<0?`(Adv)`:``}</td>
                </tr>
            `});let i=()=>{let e=document.querySelectorAll(`.bulk-cust-chk:checked`),t=0;e.forEach(e=>{t=L(t+Number(e.dataset.due||0))});let n=document.getElementById(`bulk-selected-count`),r=document.getElementById(`bulk-selected-sum`);n&&(n.innerText=`${e.length} জন`),r&&(r.innerText=`৳ ${F(t)}`)},{value:o}=await H.default.fire({title:`<div class="flex items-center justify-center gap-2 font-bn font-black text-xl text-amber-400"><i class="fa-solid fa-paper-plane text-2xl"></i><span>বাল্ক তাগাদা কাস্টমার সিলেক্টর প্যানেল</span></div>`,html:`
                <div class="space-y-3.5 text-left font-bn p-1">
                    <div class="flex items-center justify-between bg-red-500/10 border border-red-500/30 p-3 rounded-2xl">
                        <div>
                            <span class="text-xs text-slate-400 font-bold block">সিলেক্টেড কাস্টমার সংখ্যা</span>
                            <span id="bulk-selected-count" class="text-lg text-white font-black">১০ জন</span>
                        </div>
                        <div class="text-right">
                            <span class="text-xs text-slate-400 font-bold block">মোট নির্বাচিত বকেয়া</span>
                            <span id="bulk-selected-sum" class="text-lg text-red-400 font-black font-mono">৳ ০</span>
                        </div>
                    </div>

                    <div class="flex items-center gap-2">
                        <div class="relative flex-1">
                            <i class="fa-solid fa-magnifying-glass absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-xs"></i>
                            <input type="text" id="bulk-cust-search" placeholder="কাস্টমার নাম, ফোন বা অ্যাকাউন্ট দিয়ে খুঁজুন..." class="w-full bg-slate-900 border border-slate-700 rounded-xl py-2 pl-8 pr-3 text-xs text-white outline-none focus:border-amber-500">
                        </div>
                        <button type="button" id="btn-bulk-toggle-all" class="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold rounded-xl shrink-0 cursor-pointer border border-slate-700">
                            <i class="fa-solid fa-check-double mr-1 text-amber-400"></i> সব সিলেক্ট / অল্টার
                        </button>
                    </div>

                    <div class="max-h-52 overflow-y-auto border border-slate-800 rounded-2xl bg-slate-900/60 custom-scrollbar">
                        <table class="w-full text-left border-collapse">
                            <thead class="bg-slate-950 sticky top-0 border-b border-slate-800 text-[11px] font-black text-slate-400 uppercase">
                                <tr>
                                    <th class="p-2 text-center w-8"><i class="fa-solid fa-square-check text-xs"></i></th>
                                    <th class="p-2">কাস্টমার নাম (A/C)</th>
                                    <th class="p-2">মোবাইল</th>
                                    <th class="p-2 text-right">বকেয়া ৳</th>
                                </tr>
                            </thead>
                            <tbody id="bulk-table-body">
                                ${r}
                            </tbody>
                        </table>
                    </div>

                    <div class="space-y-2 border-t border-slate-800 pt-2.5">
                        <span class="text-xs font-black text-slate-300 block">ডিসপ্যাচ টাইপ সিলেক্ট করুন:</span>
                        <div class="grid grid-cols-1 sm:grid-cols-2 gap-2">
                            <label class="flex items-center gap-2.5 p-2.5 rounded-xl bg-slate-900 border border-slate-800 hover:border-amber-500/40 cursor-pointer">
                                <input type="radio" name="bulk_mode" value="sms" checked class="w-4 h-4 text-amber-500">
                                <div>
                                    <div class="text-xs font-bold text-white"><i class="fa-solid fa-comment-sms text-amber-400 mr-1"></i> SMS API (BulkSMSBD)</div>
                                    <div class="text-[10px] text-slate-400">অটোমেটিক ব্যাকগ্রাউন্ড SMS</div>
                                </div>
                            </label>
                            <label class="flex items-center gap-2.5 p-2.5 rounded-xl bg-slate-900 border border-slate-800 hover:border-emerald-500/40 cursor-pointer">
                                <input type="radio" name="bulk_mode" value="whatsapp" class="w-4 h-4 text-emerald-500">
                                <div>
                                    <div class="text-xs font-bold text-white"><i class="fa-brands fa-whatsapp text-emerald-400 mr-1"></i> WhatsApp Assistant</div>
                                    <div class="text-[10px] text-slate-400">পর্যায়ক্রমিক চ্যাট কিউ</div>
                                </div>
                            </label>
                        </div>
                    </div>
                </div>
            `,showCloseButton:!0,showCancelButton:!0,confirmButtonText:`<i class="fa-solid fa-paper-plane mr-1.5"></i> ব্যাচ ডিসপ্যাচ শুরু করুন`,cancelButtonText:`বাতিল (Cancel)`,customClass:{popup:`!bg-slate-950 !text-white !rounded-3xl border border-amber-500/30 shadow-2xl font-bn max-w-2xl`,confirmButton:`m3-btn-primary !bg-amber-600 hover:!bg-amber-500 !px-6 !py-2.5 rounded-xl font-bold`,cancelButton:`m3-btn-tonal !bg-slate-800 hover:!bg-slate-700 !text-slate-300 !px-5 !py-2.5 rounded-xl font-bold`},didOpen:()=>{i();let e=document.getElementById(`bulk-cust-search`);e&&e.addEventListener(`input`,e=>{let t=e.target.value.toLowerCase().trim();document.querySelectorAll(`.bulk-row`).forEach(e=>{e.style.display=(e.dataset.search||``).includes(t)?``:`none`})});let t=document.getElementById(`btn-bulk-toggle-all`);t&&t.addEventListener(`click`,()=>{let e=document.querySelectorAll(`.bulk-cust-chk`),t=Array.from(e).some(e=>!e.checked);e.forEach(e=>e.checked=t),i()}),document.querySelectorAll(`.bulk-cust-chk`).forEach(e=>e.addEventListener(`change`,i))},preConfirm:()=>{let t=document.querySelector(`input[name="bulk_mode"]:checked`)?.value||`sms`,n=Array.from(document.querySelectorAll(`.bulk-cust-chk:checked`)).map(e=>e.dataset.id);return n.length===0?(H.default.showValidationMessage(`কমপক্ষে ১ জন কাস্টমার সিলেক্ট করতে হবে!`),!1):{mode:t,selectedCustomers:e.filter(e=>n.includes(e.id))}}});if(!o)return;o.mode===`sms`?await un(o.selectedCustomers,t,n):await dn(o.selectedCustomers,t,n)}catch(e){console.error(e),K(`বাল্ক ডিসপ্যাচ প্রসেসিং এ ট্রুটি হয়েছে`,`error`)}}async function un(e,t,n){let r=0,i=0,a=!1;for(let o=0;o<e.length&&!a;o++){let s=e[o],c=Math.round((o+1)/e.length*100),l=await H.default.fire({title:`<div class="font-bn font-black text-lg text-white">বাল্ক SMS পাঠানো হচ্ছে (${o+1}/${e.length})</div>`,html:`
                <div class="space-y-3 font-bn text-left p-1">
                    <div class="text-xs text-slate-300">বর্তমান কাস্টমার: <strong class="text-amber-400">${s.name}</strong> (${s.phone})</div>
                    <div class="w-full bg-slate-900 rounded-full h-3 border border-slate-800 overflow-hidden">
                        <div class="bg-amber-500 h-full transition-all duration-300" style="width: ${c}%"></div>
                    </div>
                    <div class="flex justify-between text-xs text-slate-400 font-mono">
                        <span>সফল: ${r}</span>
                        <span>ব্যর্থ: ${i}</span>
                        <span>${c}%</span>
                    </div>
                </div>
            `,allowOutsideClick:!1,showCloseButton:!0,showCancelButton:!0,showConfirmButton:!1,cancelButtonText:`<i class="fa-solid fa-xmark mr-1"></i> থামুন (Cancel Batch)`,customClass:{popup:`!bg-slate-950 !text-white !rounded-3xl border border-slate-800 font-bn`,cancelButton:`m3-btn-tonal !bg-red-950 hover:!bg-red-900 !text-red-300 border border-red-500/30`},didOpen:async()=>{try{let e=s.accountNo?` (${s.accountNo})`:``,a=F(Math.abs(s.totalDue||0)),o=s.totalDue<0?`Advance is Tk ${a}`:`due is Tk ${a}`,c=`Reminder: Dear ${(typeof window.toBanglishName==`function`?window.toBanglishName(s.name):s.name)||`Customer`}${e}, your ${o} on ${n}. Kindly clear payment soon. Thanks! - ${t}`.replace(/\s+/g,` `).replace(/[^\x00-\x7F]/g,``);await De(s.phone,c,!1)?r++:i++}catch(e){console.error(`Bulk SMS error:`,e),i++}setTimeout(()=>H.default.clickConfirm(),400)}});if(l.isDismissed&&(l.dismiss===H.default.DismissReason.cancel||l.dismiss===H.default.DismissReason.close)){a=!0,K(`বাল্ক SMS ডিসপ্যাচ থামানো হয়েছে`,`info`);break}}O(`BULK_DISPATCH`,`Customer`,`bulk_sms`,`Selected ${e.length} due bulk SMS dispatched`,{successCount:r,failCount:i}),a||H.default.fire({title:`<div class="font-bn font-black text-xl text-emerald-400"><i class="fa-solid fa-circle-check text-2xl mr-2"></i>ডিসপ্যাচ সম্পন্ন!</div>`,html:`
                <div class="space-y-2 font-bn text-slate-300 text-sm">
                    <p>মোট সিলেক্টেড কাস্টমার: <strong>${e.length} জন</strong></p>
                    <p class="text-emerald-400 font-bold"><i class="fa-solid fa-circle-check text-emerald-400 mr-1"></i> সফলভাবে পাঠানো হয়েছে: ${r} টি</p>
                    ${i>0?`<p class="text-red-400 font-bold"><i class="fa-solid fa-circle-xmark text-red-400 mr-1"></i> ব্যর্থ হয়েছে: ${i} টি</p>`:``}
                </div>
            `,icon:`success`,confirmButtonText:`ঠিক আছে`,customClass:{popup:`!bg-slate-950 !text-white !rounded-3xl border border-slate-800 font-bn`,confirmButton:`m3-btn-primary !bg-emerald-600`}})}async function dn(e,t,n){let r=!1;for(let i=0;i<e.length&&!r;i++){let a=e[i],o=a.accountNo?` (${a.accountNo})`:``,s=F(Math.abs(a.totalDue||0)),c=a.totalDue<0?`অ্যাডভান্স জমা: ৳ ${s}`:`বকেয়া পরিমাণ: ৳ ${s}`,l=`Dear ${a.name}${o},\nআপনার ${c}\nতারিখ: ${n}\nঅনুগ্রহ করে দ্রুত পেমেন্ট পরিশোধের অনুরোধ করা হচ্ছে।\nধন্যবাদ! - ${t}`,u=String(a.phone).replace(/[^0-9]/g,``);u.startsWith(`0`)&&(u=`88`+u);let d=`https://api.whatsapp.com/send?phone=${u}&text=${encodeURIComponent(l)}`,f=i===e.length-1,p=await H.default.fire({title:`<div class="font-bn font-black text-lg text-emerald-400"><i class="fa-brands fa-whatsapp text-xl mr-2"></i>হোয়াটসঅ্যাপ তাগাদা (${i+1}/${e.length})</div>`,html:`
                <div class="space-y-3 font-bn text-left p-3 bg-slate-900 rounded-2xl border border-slate-800">
                    <div class="text-sm font-bold text-white">${a.name} <span class="text-amber-400 font-mono text-xs">${o}</span></div>
                    <div class="text-xs text-slate-300 font-mono">মোবাইল: ${a.phone}</div>
                    <div class="text-base ${a.totalDue<0?`text-emerald-400`:`text-red-400`} font-black font-mono">${a.totalDue<0?`অ্যাডভান্স`:`বকেয়া`}: ৳ ${s}</div>
                </div>
            `,showCloseButton:!0,showDenyButton:!f,showCancelButton:!0,confirmButtonText:`<i class="fa-brands fa-whatsapp mr-1"></i> চ্যাট ওপেন করুন`,denyButtonText:`<i class="fa-solid fa-forward-step mr-1"></i> স্কিপ (পরবর্তী)`,cancelButtonText:`<i class="fa-solid fa-xmark mr-1"></i> ব্যাচ বন্ধ করুন (Cancel)`,customClass:{popup:`!bg-slate-950 !text-white !rounded-3xl border border-emerald-500/30 font-bn`,confirmButton:`m3-btn-primary !bg-emerald-600 hover:!bg-emerald-500 !px-5 !py-2 rounded-xl text-xs font-bold`,denyButton:`m3-btn-tonal !bg-slate-800 hover:!bg-slate-700 !text-slate-300 !px-4 !py-2 rounded-xl text-xs font-bold`,cancelButton:`m3-btn-tonal !bg-red-950 hover:!bg-red-900 !text-red-300 border border-red-500/30 !px-4 !py-2 rounded-xl text-xs font-bold`}});if(p.isConfirmed)window.open(d,`_blank`);else if(p.isDismissed||p.dismiss===H.default.DismissReason.cancel||p.dismiss===H.default.DismissReason.close){r=!0,K(`হোয়াটসঅ্যাপ ব্যাচ বন্ধ করা হয়েছে`,`info`);break}}r||K(`হোয়াটসঅ্যাপ ব্যাচ প্রসেস সম্পন্ন হয়েছে`,`success`)}window.triggerBulkReminderFlow=ln;async function fn(){Y(),tn(),At(),nn()}function pn(e){kt(e===`next`?Ct+1:Ct-1),nn(e)}function mn(e){window.navigate(`ledger`,{customerId:e})}function hn(e,t,n,r,i){window.navigate(`statement`,{customerId:e,customerName:t,accountNo:n||``,customerPhone:r||``,customerAddress:i||``})}window.renderCustomers=qt,window.loadCustomers=fn,window.initCustomerCache=Y,window.getCustomerCache=J,window.saveNewCustomer=Xt,window.editCustomer=Zt,window.deleteCustomer=$t,window.filterCustomerList=rn,window.handleZoneChange=sn,window.sendReminderSMS=on,window.printFilteredCustomerList=en,window.changeCustomerPage=pn,window.openCustomerLedger=mn,window.openCustomerStatement=hn,window.resetAddCustomerForm=Yt,window.loadAllZones=tn,window.triggerBulkReminderFlow=ln,window.toggleAddCustomerForm=()=>{let e=document.getElementById(`add-customer-form`);e&&(e.classList.toggle(`hidden`),e.classList.contains(`hidden`)||(Yt(),window.handleZoneChange&&window.handleZoneChange(),bt(`cust-address`,`cust-address-datalist`,`cust-address-chips`),setTimeout(()=>{e.scrollIntoView({behavior:`smooth`,block:`start`});let t=document.getElementById(`cust-name`);t&&t.focus()},80)))},window.quickAddZone=async function(){let{value:e}=await H.default.fire({title:`নতুন জোন (অঞ্চল) যোগ করুন`,html:`
            <div class="space-y-4 text-left p-1 font-bn">
                <div>
                    <label class="block text-[11px] font-black text-blue-400 uppercase tracking-widest mb-1 ml-1">জোনের নাম *</label>
                    <input id="sw-zn" class="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-white outline-none focus:border-blue-500 text-sm transition-all" placeholder="যেমন: ঢাকা, চট্টগ্রাম">
                </div>
                <div>
                    <label class="block text-[11px] font-black text-blue-400 uppercase tracking-widest mb-1 ml-1">জোন কোড (ম্যানুয়াল) *</label>
                    <input id="sw-zc" type="number" class="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-white outline-none focus:border-blue-500 text-sm transition-all" placeholder="যেমন: 1 বা 11">
                </div>
            </div>
        `,focusConfirm:!1,showCancelButton:!0,confirmButtonText:`সেভ করুন`,cancelButtonText:`বাতিল`,customClass:{popup:`!bg-slate-900 !text-white !rounded-3xl border border-slate-700`},preConfirm:()=>{let e=document.getElementById(`sw-zn`).value.trim(),t=document.getElementById(`sw-zc`).value.trim();return!e||!t?(H.default.showValidationMessage(`নাম ও কোড উভয়ই আবশ্যক!`),!1):{name:e,code:t}}});if(e)try{H.default.fire({title:`চেক করা হচ্ছে...`,allowOutsideClick:!1,didOpen:()=>H.default.showLoading()});let t=await v.getByCode(e.code);if(t)return H.default.fire(`Error!`,`জোন কোড "${e.code}" ইতিমধ্যে "${t.name}" জোনের জন্য ব্যবহার করা হয়েছে!`,`error`);await v.add({name:e.name,code:e.code}),H.default.fire(`সফল!`,`জোন "${e.name}" সফলভাবে তৈরি হয়েছে।`,`success`),tn()}catch(e){console.error(e),H.default.fire(`Error`,`জোন সেভ করা যায়নি: `+(e.message||e),`error`)}};function gn(){return`
        <!-- 2. 4 Glassmorphic KPI Cards + Timeframe Switcher -->
        <div class="flex flex-col gap-4">
            <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 px-1">
                <div class="flex items-center gap-2">
                    <span class="text-xs font-black text-slate-400 uppercase tracking-widest flex items-center gap-1.5"><i class="fa-solid fa-bolt text-blue-400"></i> ব্যবসায়িক রিয়েল-টাইম মেট্রিক্স</span>
                    <span id="dash-active-date-badge" class="px-2.5 py-1 rounded-lg bg-blue-500/10 border border-blue-500/30 text-blue-400 text-[10px] font-black flex items-center gap-1.5 shadow-[0_0_10px_rgba(59,130,246,0.15)] backdrop-blur-sm">
                        <i class="fa-solid fa-clock text-[9px] animate-pulse"></i><span id="dash-active-date-text">আজকের লাইভ হিসাব</span>
                    </span>
                </div>
                <div class="flex flex-wrap items-center gap-1.5 bg-slate-900/80 p-1.5 rounded-2xl border border-slate-800/80 shadow-lg backdrop-blur-md">
                    <div class="relative flex items-center">
                        <i class="fa-solid fa-calendar-days absolute left-3 text-blue-400 text-xs pointer-events-none z-10"></i>
                        <input type="text" id="dash-date-filter" class="m3-field py-1.5 bg-slate-950/90 border border-slate-700/80 rounded-xl h-8 text-[11px] text-white font-bold outline-none pl-8 pr-3 w-36 datepicker cursor-pointer hover:border-blue-500/50 transition-all focus:border-blue-500 focus:ring-1 focus:ring-blue-500/50" placeholder="তারিখ বেছে নিন..." onchange="window.onDashDateFilterChange && window.onDashDateFilterChange(this.value)">
                    </div>
                    <div class="w-px h-6 bg-slate-800 mx-1"></div>
                    <div class="flex items-center gap-1 text-[11px] font-bold">
                        <button class="px-3.5 py-1.5 min-h-[32px] rounded-xl bg-blue-600 text-white shadow-[0_0_15px_rgba(59,130,246,0.4)] active:scale-95 transition-all cursor-pointer flex items-center gap-1.5" id="tf-today-btn" onclick="window.switchDashTimeframe('today')"><i class="fa-solid fa-calendar-day"></i>আজকে</button>
                        <button class="px-3.5 py-1.5 min-h-[32px] rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 active:scale-95 transition-all cursor-pointer flex items-center gap-1.5" id="tf-yesterday-btn" onclick="window.switchDashTimeframe('yesterday')">গতকাল</button>
                    </div>
                </div>
            </div>

            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <!-- Due Card -->
                <div class="m3-card relative overflow-hidden group bg-slate-900/40 backdrop-blur-md border border-slate-800/60 hover:border-red-500/40 p-5 shadow-xl transition-all hover:-translate-y-1 hover:shadow-[0_10px_30px_-10px_rgba(239,68,68,0.2)]">
                    <div class="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-red-500 to-transparent opacity-60"></div>
                    <i class="fa-solid fa-receipt absolute -right-4 -bottom-4 text-[90px] text-red-500/5 group-hover:text-red-500/10 transition-all duration-500 transform group-hover:rotate-12 group-hover:scale-110"></i>
                    <div class="relative z-10 flex flex-col h-full">
                        <div class="flex items-center gap-3 mb-4">
                            <div class="w-10 h-10 rounded-xl bg-gradient-to-br from-red-500/20 to-red-600/5 text-red-400 border border-red-500/20 flex items-center justify-center text-lg shadow-[0_0_15px_rgba(239,68,68,0.15)]"><i class="fa-solid fa-receipt"></i></div>
                            <h4 class="text-slate-400 text-xs font-black uppercase tracking-widest drop-shadow-sm">মার্কেটে মোট বকেয়া</h4>
                        </div>
                        <h2 id="dash-total-due" class="text-3xl md:text-4xl font-black text-white tracking-tight drop-shadow-md font-inter">৳ ০</h2>
                        <div class="mt-auto pt-5">
                            <div class="flex items-center justify-between text-[10px] text-slate-400 font-bold border-t border-slate-800/60 pt-2.5">
                                <span class="flex items-center gap-1.5"><i class="fa-solid fa-users text-slate-500"></i> সব কাস্টমারের বাকি</span>
                                <span class="text-red-400 font-black bg-red-500/10 px-1.5 py-0.5 rounded flex items-center gap-1 border border-red-500/20"><span class="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse"></span> রিয়েল-টাইম</span>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Collection Card -->
                <div class="m3-card relative overflow-hidden group bg-slate-900/40 backdrop-blur-md border border-slate-800/60 hover:border-emerald-500/40 p-5 shadow-xl transition-all hover:-translate-y-1 hover:shadow-[0_10px_30px_-10px_rgba(16,185,129,0.2)]">
                    <div class="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-emerald-500 to-transparent opacity-60"></div>
                    <i class="fa-solid fa-hand-holding-dollar absolute -right-4 -bottom-4 text-[90px] text-emerald-500/5 group-hover:text-emerald-500/10 transition-all duration-500 transform group-hover:rotate-12 group-hover:scale-110"></i>
                    <div class="relative z-10 flex flex-col h-full">
                        <div class="flex items-center gap-3 mb-4">
                            <div class="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500/20 to-emerald-600/5 text-emerald-400 border border-emerald-500/20 flex items-center justify-center text-lg shadow-[0_0_15px_rgba(16,185,129,0.15)]"><i class="fa-solid fa-hand-holding-dollar"></i></div>
                            <h4 class="text-slate-400 text-xs font-black uppercase tracking-widest drop-shadow-sm">মোট কালেকশন</h4>
                        </div>
                        <h2 id="dash-today-col" class="text-3xl md:text-4xl font-black text-white tracking-tight drop-shadow-md font-inter">৳ ০</h2>
                        <div class="mt-auto pt-5">
                            <div class="flex items-center justify-between text-[10px] text-slate-400 font-bold border-t border-slate-800/60 pt-2.5">
                                <span id="dash-net-cash" class="flex items-center gap-1.5 text-emerald-400 font-bn font-bold text-xs"><i class="fa-solid fa-coins text-emerald-500"></i> নিট ক্যাশ: <span class="font-mono text-white font-black">৳ ০</span> <span class="text-[10px] bg-emerald-500/20 px-1.5 py-0.5 rounded-md text-emerald-300 font-bold">(উদ্বৃত্ত)</span></span>
                                <span id="dash-bank-inflow" class="text-blue-400 font-black bg-blue-500/10 px-2 py-0.5 rounded-lg flex items-center gap-1 border border-blue-500/20 font-bn text-[11px]"><i class="fa-solid fa-building-columns text-[10px]"></i> ব্যাংক: <span class="font-mono text-white font-bold">৳ ০</span></span>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Expense Card -->
                <div class="m3-card relative overflow-hidden group bg-slate-900/40 backdrop-blur-md border border-slate-800/60 hover:border-purple-500/40 p-5 shadow-xl transition-all hover:-translate-y-1 hover:shadow-[0_10px_30px_-10px_rgba(168,85,247,0.2)]">
                    <div class="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-purple-500 to-transparent opacity-60"></div>
                    <i class="fa-solid fa-wallet absolute -right-4 -bottom-4 text-[90px] text-purple-500/5 group-hover:text-purple-500/10 transition-all duration-500 transform group-hover:rotate-12 group-hover:scale-110"></i>
                    <div class="relative z-10 flex flex-col h-full">
                        <div class="flex items-center gap-3 mb-4">
                            <div class="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500/20 to-purple-600/5 text-purple-400 border border-purple-500/20 flex items-center justify-center text-lg shadow-[0_0_15px_rgba(168,85,247,0.15)]"><i class="fa-solid fa-wallet"></i></div>
                            <h4 class="text-slate-400 text-xs font-black uppercase tracking-widest drop-shadow-sm">মোট খরচ</h4>
                        </div>
                        <h2 id="dash-today-exp" class="text-3xl md:text-4xl font-black text-white tracking-tight drop-shadow-md font-inter">৳ ০</h2>
                        <div class="mt-auto pt-5">
                            <div class="flex items-center justify-between text-[10px] text-slate-400 font-bold border-t border-slate-800/60 pt-2.5">
                                <span class="flex items-center gap-1.5"><i class="fa-solid fa-file-invoice-dollar text-slate-500"></i> দৈনিক খরচ যোগফল</span>
                                <span class="text-purple-400 font-black bg-purple-500/10 px-1.5 py-0.5 rounded flex items-center gap-1 border border-purple-500/20"><i class="fa-solid fa-check-double"></i> হিসাবকৃত</span>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Customers Card -->
                <div class="m3-card relative overflow-hidden group bg-slate-900/40 backdrop-blur-md border border-slate-800/60 hover:border-blue-500/40 p-5 shadow-xl transition-all hover:-translate-y-1 hover:shadow-[0_10px_30px_-10px_rgba(59,130,246,0.2)]">
                    <div class="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-blue-500 to-transparent opacity-60"></div>
                    <i class="fa-solid fa-users absolute -right-4 -bottom-4 text-[90px] text-blue-500/5 group-hover:text-blue-500/10 transition-all duration-500 transform group-hover:-rotate-12 group-hover:scale-110"></i>
                    <div class="relative z-10 flex flex-col h-full">
                        <div class="flex items-center gap-3 mb-4">
                            <div class="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500/20 to-blue-600/5 text-blue-400 border border-blue-500/20 flex items-center justify-center text-lg shadow-[0_0_15px_rgba(59,130,246,0.15)]"><i class="fa-solid fa-users"></i></div>
                            <h4 class="text-slate-400 text-xs font-black uppercase tracking-widest drop-shadow-sm">মোট কাস্টমার</h4>
                        </div>
                        <h2 id="dash-total-cust" class="text-3xl md:text-4xl font-black text-white tracking-tight drop-shadow-md font-inter">০ জন</h2>
                        <div class="mt-auto pt-5">
                            <div class="flex items-center justify-between text-[10px] text-slate-400 font-bold border-t border-slate-800/60 pt-2.5">
                                <span class="flex items-center gap-1.5"><i class="fa-solid fa-user-check text-slate-500"></i> সক্রিয় অ্যাকাউন্ট</span>
                                <span class="text-blue-400 font-black bg-blue-500/10 px-1.5 py-0.5 rounded flex items-center gap-1 border border-blue-500/20"><i class="fa-solid fa-database"></i> সিঙ্কড</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `}function _n(){return`
        <!-- 1. Top Quick Action Bar -->
        <div class="m3-card bg-slate-900/80 border border-slate-800/80 p-3 md:p-4 rounded-2xl shadow-xl flex flex-wrap items-center justify-between gap-3">
            <div class="flex items-center gap-3">
                <div class="w-2.5 h-8 bg-blue-600 rounded-full shadow-[0_0_15px_rgba(59,130,246,0.6)]"></div>
                <div>
                    <h2 class="text-xl md:text-2xl font-black text-white tracking-tight flex items-center gap-2">
                        ড্যাশবোর্ড <span class="text-xs text-slate-400 font-bold uppercase tracking-widest">(Overview)</span>
                    </h2>
                    <p class="text-[10px] text-slate-400 font-bold">মা মোটরস ইআরপি • লাইভ ইন্টেলিজেন্স</p>
                </div>
            </div>

            <div class="flex flex-wrap items-center gap-2 w-full sm:w-auto">
                <button class="h-9 px-3.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-black shadow-lg shadow-blue-600/20 transition-all flex items-center gap-1.5 cursor-pointer" onclick="window.navigate('bulk')">
                    <i class="fa-solid fa-plus-circle"></i><span>বিক্রি এন্ট্রি</span>
                </button>
                <button class="h-9 px-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-black shadow-lg shadow-emerald-600/20 transition-all flex items-center gap-1.5 cursor-pointer" onclick="window.navigate('ledger')">
                    <i class="fa-solid fa-hand-holding-dollar"></i><span>টাকা জমা</span>
                </button>
                <button class="h-9 px-3.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-black shadow-lg shadow-purple-600/20 transition-all flex items-center gap-1.5 cursor-pointer" onclick="window.navigate('expenses')">
                    <i class="fa-solid fa-wallet"></i><span>নতুন খরচ</span>
                </button>
                <button class="h-9 px-3.5 rounded-xl bg-slate-800 border border-slate-700 hover:bg-slate-700 text-slate-200 text-xs font-black transition-all flex items-center gap-1.5 cursor-pointer" onclick="window.toggleDashCustomerForm()">
                    <i class="fa-solid fa-user-plus text-blue-400"></i><span>কাস্টমার</span>
                </button>
                <button class="h-9 px-3.5 rounded-xl bg-amber-500/10 border border-amber-500/30 hover:bg-amber-500/20 text-amber-400 text-xs font-black transition-all flex items-center gap-1.5 cursor-pointer" onclick="window.printExecutiveSummary && window.printExecutiveSummary()" title="১-ক্লিক দৈনিক সারসংক্ষেপ">
                    <i class="fa-solid fa-print"></i><span>রিপোর্ট</span>
                </button>
            </div>
        </div>

        <!-- Inline Dashboard New Customer Add Form Container (Collapsable) -->
        <div id="dash-add-customer-form" class="hidden m3-card bg-slate-900/90 border border-slate-800 p-4 md:p-5 rounded-2xl shadow-2xl font-bn flex flex-col gap-4">
            <div class="flex items-center justify-between border-b border-slate-800/80 pb-3">
                <div class="flex items-center gap-3">
                    <div class="w-9 h-9 rounded-xl bg-blue-600/10 border border-blue-500/20 text-blue-400 flex items-center justify-center text-base font-black shadow-sm">
                        <i class="fa-solid fa-address-card"></i>
                    </div>
                    <div>
                        <h3 class="text-base md:text-lg font-black text-white">নতুন কাস্টমার যুক্ত করুন</h3>
                        <p class="text-[10px] text-slate-400 font-bold">ড্যাশবোর্ড থেকে সরাসরি কাস্টমার প্রোফাইল ও প্রারম্ভিক হিসাব এন্ট্রি</p>
                    </div>
                </div>
                <button class="w-8 h-8 rounded-xl bg-slate-800/80 hover:bg-red-500/20 border border-slate-700/60 text-slate-400 hover:text-red-400 flex items-center justify-center transition-all cursor-pointer" onclick="window.toggleDashCustomerForm()" title="বন্ধ করুন">
                    <i class="fa-solid fa-xmark text-sm"></i>
                </button>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 items-start">
                <div>
                    <label class="m3-label">হিসাব খোলার তারিখ <span class="m3-label-sub">(Date)</span></label>
                    <input type="text" id="dash-cust-date" class="m3-field py-1 bg-slate-950/80 h-9 text-xs datepicker cursor-pointer">
                </div>
                <div>
                    <label class="m3-label">কাস্টমারের নাম <span class="m3-label-sub">(Name *)</span></label>
                    <input type="text" id="dash-cust-name" placeholder="পুরো নাম লিখুন" class="m3-field py-1 bg-slate-950/80 h-9 text-xs">
                </div>
                <div>
                    <label class="m3-label">ঠিকানা <span class="m3-label-sub">(Address)</span></label>
                    <input type="text" id="dash-cust-address" list="dash-cust-address-datalist" placeholder="ঠিকানা লিখুন (যেমন: মা মার্কেট, ১নং রেইল গেইট...)" class="m3-field py-1 bg-slate-950/80 h-9 text-xs">
                    <datalist id="dash-cust-address-datalist"></datalist>
                    <div id="dash-cust-address-chips"></div>
                </div>
                <div>
                    <label class="m3-label">মোবাইল নম্বর <span class="m3-label-sub">(Phone *)</span></label>
                    <input type="text" id="dash-cust-phone" placeholder="০১৭xxxxxxxx" class="m3-field py-1 bg-slate-950/80 h-9 text-xs">
                </div>

                <div class="flex flex-col">
                    <label class="m3-label text-emerald-400">অবশিষ্ট ব্যালেন্স <span class="m3-label-sub">(Opening Due ৳)</span></label>
                    <input type="text" id="dash-cust-initial-balance" placeholder="০.০০" oninput="window.handleNumberInput(this); window.updateLiveWords(this, 'dash-cust-initial-words');" class="m3-field py-1 border-emerald-500/30 focus:border-emerald-500 text-emerald-400 font-black h-9 text-xs bg-slate-950/80">
                    <div id="dash-cust-initial-words" class="text-[10px] font-black text-emerald-400 mt-1 hidden italic truncate"></div>
                </div>
                <div>
                    <label class="m3-label text-purple-400">জোন / অঞ্চল <span class="m3-label-sub">(Zone *)</span></label>
                    <div class="flex gap-2">
                        <select id="dash-cust-zone-select" class="m3-field py-1 flex-grow bg-slate-950/80 h-9 text-xs font-bold text-slate-200 cursor-pointer" onchange="window.handleDashZoneChange && window.handleDashZoneChange()">
                            <option value="">-- জোন সিলেক্ট --</option>
                        </select>
                        <button title="নতুন জোন যোগ করুন" class="w-9 h-9 bg-purple-600/20 text-purple-400 border border-purple-500/30 rounded-xl hover:bg-purple-600 hover:text-white transition-all flex items-center justify-center shrink-0 cursor-pointer" onclick="window.quickAddZone()"><i class="fa-solid fa-plus text-xs"></i></button>
                    </div>
                </div>
                <div>
                    <label class="m3-label text-blue-400">জোন কোড <span class="m3-label-sub">(Code)</span></label>
                    <input type="text" id="dash-cust-zone-code-display" readonly placeholder="কোড" class="m3-field py-1 bg-slate-950/60 border-slate-700/60 text-center text-xs font-black text-blue-400 h-9">
                </div>
                <div>
                    <label class="m3-label text-blue-400">অ্যাকাউন্ট নম্বর <span class="m3-label-sub">(Auto A/C)</span></label>
                    <input type="text" id="dash-cust-generated-acc" readonly placeholder="অ্যাকাউন্ট নং" class="m3-field py-1 bg-slate-950/60 border-blue-500/30 text-blue-400 font-black h-9 text-xs">
                </div>
            </div>

            <div class="flex items-center justify-end gap-3 pt-3 border-t border-slate-800/80">
                <button class="h-9 px-5 rounded-xl bg-slate-800/90 border border-slate-700/80 hover:bg-slate-700/80 text-slate-300 text-xs font-bold transition-all cursor-pointer" onclick="window.toggleDashCustomerForm()">বাতিল</button>
                <button class="h-9 px-8 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-black shadow-lg shadow-blue-600/30 active:scale-95 transition-all flex items-center gap-2 cursor-pointer" id="dash-save-cust-btn" onclick="window.saveDashCustomer()">
                    <i class="fa-solid fa-check text-xs"></i><span>সেভ করুন</span>
                </button>
            </div>
        </div>
    `}function vn(){return`
        <!-- 3. Main Dashboard 2-Column Grid -->
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">

            <!-- Left Column (2 Cols): Sales vs Collection Graph & Recent Activity -->
            <div class="lg:col-span-2 flex flex-col gap-6">

                <!-- Trend Graph Card -->
                <div class="m3-card bg-slate-900/60 border border-slate-800/80 p-4 rounded-2xl shadow-xl">
                    <div class="flex items-center justify-between mb-3 border-b border-slate-800/60 pb-2">
                        <h3 class="text-sm font-black text-white uppercase tracking-widest flex items-center gap-2">
                            <i class="fa-solid fa-chart-line text-blue-400"></i> বিক্রি বনাম আদায় পারফরম্যান্স গ্রাফ
                        </h3>
                        <div class="flex items-center gap-3 text-[10px] font-bold">
                            <span class="flex items-center gap-1 text-blue-400"><span class="w-2 h-2 rounded-full bg-blue-500"></span> বিক্রি</span>
                            <span class="flex items-center gap-1 text-emerald-400"><span class="w-2 h-2 rounded-full bg-emerald-500"></span> কালেকশন</span>
                        </div>
                    </div>
                    <div class="w-full overflow-hidden flex items-center justify-center">
                        <canvas id="sales-vs-col-chart" class="w-full max-h-[190px]"></canvas>
                    </div>
                </div>

                <!-- Premium Collection List Section -->
                <div class="m3-card bg-slate-900/40 backdrop-blur-md border border-slate-800/60 p-5 rounded-2xl shadow-xl flex flex-col gap-5">
                    <div class="flex flex-col xl:flex-row xl:items-center justify-between gap-4 border-b border-slate-800/60 pb-3">
                        <h3 class="text-sm md:text-base font-black text-white uppercase tracking-widest flex items-center gap-2 whitespace-nowrap flex-nowrap">
                            <div class="w-2 h-5 bg-emerald-500 rounded-full shadow-[0_0_10px_rgba(16,185,129,0.5)] shrink-0"></div> 
                            <span class="shrink-0">আদায় / কালেকশন লিস্ট</span>
                            <input type="text" id="collection-list-datepicker" class="m3-field py-1.5 bg-slate-950/80 h-8 text-[11px] w-36 datepicker cursor-pointer ml-2 text-center text-emerald-400 font-bold border-emerald-500/30 rounded-lg hover:border-emerald-500/60 transition-all" placeholder="Select Date">
                        </h3>
                        <div class="flex flex-wrap items-center gap-1.5 bg-slate-950/80 p-1.5 rounded-2xl border border-slate-800 shadow-inner">
                            <button id="btn-col-today" class="px-3.5 py-1.5 bg-emerald-600 text-white rounded-xl text-[11px] font-bold transition-all shadow-[0_0_10px_rgba(16,185,129,0.3)]" onclick="window.filterCollectionList('today')">আজ</button>
                            <button id="btn-col-yesterday" class="px-3.5 py-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl text-[11px] font-bold transition-all" onclick="window.filterCollectionList('yesterday')">গতকাল</button>
                            <button id="btn-col-week" class="px-3.5 py-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl text-[11px] font-bold transition-all" onclick="window.filterCollectionList('week')">১ সপ্তাহ</button>
                            <button id="btn-col-month" class="px-3.5 py-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl text-[11px] font-bold transition-all" onclick="window.filterCollectionList('month')">১ মাস</button>
                        </div>
                    </div>

                    <!-- Collection Total Summary Hero Card -->
                    <div class="bg-gradient-to-br from-emerald-800/90 via-slate-900/95 to-slate-950 border border-emerald-500/40 rounded-2xl p-8 flex flex-col items-center justify-center gap-2 shadow-[0_15px_40px_-10px_rgba(16,185,129,0.3)] relative overflow-hidden group">
                        <div class="absolute -right-10 -bottom-10 opacity-[0.05] text-[180px] pointer-events-none group-hover:scale-105 transition-transform duration-700">
                            <i class="fa-solid fa-coins"></i>
                        </div>
                        <span class="text-xs md:text-sm font-black text-emerald-400 uppercase tracking-widest flex items-center gap-2 z-10"><i class="fa-solid fa-coins text-emerald-400 drop-shadow-[0_0_8px_rgba(16,185,129,0.8)]"></i> সর্বমোট আদায় (Total Collection)</span>
                        <h2 id="dash-collection-card-total" class="text-4xl md:text-5xl lg:text-6xl font-black text-white tracking-tight mt-1 drop-shadow-[0_2px_10px_rgba(0,0,0,0.8)] z-10 font-inter">৳ ০</h2>
                        <p id="dash-collection-card-words" class="text-xs md:text-sm text-emerald-300 font-bold italic mt-2 z-10 bg-black/20 px-4 py-1.5 rounded-full border border-emerald-500/20">শূন্য টাকা মাত্র</p>
                    </div>

                    <!-- Dynamic Payment Method Summary Cards (Auto Responsive Grid) -->
                    <div id="dash-collection-method-cards" class="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2.5 sm:gap-3 w-full"></div>

                    <!-- Collection List Table -->
                    <div class="m3-table-container custom-scrollbar max-h-[400px] overflow-y-auto rounded-xl border border-slate-800/60">
                        <table class="m3-table min-w-[700px] w-full text-left">
                            <thead class="bg-slate-900/80 backdrop-blur sticky top-0 z-10">
                                <tr class="text-[10px] uppercase tracking-widest text-slate-400 border-b border-slate-800">
                                    <th class="py-3 px-4">তারিখ</th>
                                    <th class="py-3 px-4">কাস্টমার</th>
                                    <th class="py-3 px-4">ভাউচার/রিসিপ্ট</th>
                                    <th class="py-3 px-4">পেমেন্ট মেথড</th>
                                    <th class="py-3 px-4 text-right">জমা (Collection)</th>
                                </tr>
                            </thead>
                            <tbody id="dash-collection-list-tbody" class="divide-y divide-slate-800/40">
                                <tr><td colspan="5" class="text-center py-10 text-slate-500 italic"><i class="fa-solid fa-spinner fa-spin mr-2"></i> ডাটা লোড হচ্ছে...</td></tr>
                            </tbody>
                            <tfoot class="sticky bottom-0 bg-slate-900/95 backdrop-blur border-t-2 border-emerald-500/40">
                                <tr class="font-black">
                                    <td colspan="4" class="text-right text-slate-400 py-3 px-4 uppercase text-xs tracking-wider">সর্বমোট আদায়:</td>
                                    <td id="dash-collection-list-total" class="text-right text-emerald-400 text-lg px-4 tracking-tight font-inter">৳ ০</td>
                                </tr>
                            </tfoot>
                        </table>
                    </div>
                </div>
            </div>

            <!-- Right Column (1 Col): Donut Chart & Top 5 Due Customers Widget -->
            <div class="flex flex-col gap-6">

                <!-- Cash vs Bank Donut Card -->
                <div class="m3-card bg-slate-900/40 backdrop-blur-md border border-slate-800/60 p-5 rounded-2xl shadow-xl flex flex-col gap-4 relative overflow-hidden group">
                    <div class="absolute -right-6 -bottom-6 opacity-[0.03] text-[120px] pointer-events-none group-hover:scale-110 transition-transform duration-500">
                        <i class="fa-solid fa-chart-pie"></i>
                    </div>
                    <h3 class="text-sm font-black text-white uppercase tracking-widest border-b border-slate-800/60 pb-3 flex items-center gap-2 z-10">
                        <div class="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center shadow-[0_0_10px_rgba(16,185,129,0.2)]"><i class="fa-solid fa-chart-pie"></i></div>
                        পেমেন্ট মেথড ব্রেকডাউন
                    </h3>
                    <div class="flex items-center justify-around py-2 z-10">
                        <div class="relative w-[120px] h-[120px] drop-shadow-[0_0_15px_rgba(0,0,0,0.5)]">
                            <canvas id="payment-donut-chart" class="w-full h-full"></canvas>
                        </div>
                        <div class="flex flex-col gap-3 font-bn">
                            <div class="flex items-center gap-2.5 p-2 rounded-xl hover:bg-slate-800/50 transition-all border border-transparent hover:border-slate-700/50 cursor-default">
                                <span class="w-3.5 h-3.5 rounded bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.6)]"></span>
                                <div><p class="text-[10px] text-slate-400 font-bold tracking-wider">নগদ (Cash)</p><p id="dash-col-cash" class="text-base font-black text-emerald-400 tracking-tight font-inter">৳ ০</p></div>
                            </div>
                            <div class="flex items-center gap-2.5 p-2 rounded-xl hover:bg-slate-800/50 transition-all border border-transparent hover:border-slate-700/50 cursor-default">
                                <span class="w-3.5 h-3.5 rounded bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.6)]"></span>
                                <div><p class="text-[10px] text-slate-400 font-bold tracking-wider">ব্যাংক (Bank)</p><p id="dash-col-bank" class="text-base font-black text-blue-400 tracking-tight font-inter">৳ ০</p></div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Collection Breakdown Widget -->
                <div id="dash-collection-breakdown-card" class="hidden m3-card bg-slate-900/40 backdrop-blur-md border border-slate-800/60 p-5 rounded-2xl shadow-xl flex-col gap-4 relative overflow-hidden group">
                    <div class="absolute -right-6 -bottom-6 opacity-[0.03] text-[120px] pointer-events-none group-hover:scale-110 transition-transform duration-500">
                        <i class="fa-solid fa-list-check"></i>
                    </div>
                    <h3 class="text-sm font-black text-white uppercase tracking-widest border-b border-slate-800/60 pb-3 flex items-center gap-2 z-10">
                        <div class="w-8 h-8 rounded-lg bg-blue-500/20 text-blue-400 flex items-center justify-center shadow-[0_0_10px_rgba(59,130,246,0.2)]"><i class="fa-solid fa-list-ul"></i></div>
                        জমার বিস্তারিত বিবরণ
                    </h3>
                    <div id="dash-collection-breakdown-list" class="flex flex-col gap-2 font-bn mt-1 max-h-48 overflow-y-auto custom-scrollbar pr-1 z-10"></div>
                </div>

                <!-- Top 5 Due Customers Widget -->
                <div class="m3-card bg-slate-900/40 backdrop-blur-md border border-slate-800/60 p-5 rounded-2xl shadow-xl flex flex-col gap-4 relative overflow-hidden group">
                    <div class="absolute -right-6 -bottom-6 opacity-[0.03] text-[120px] pointer-events-none group-hover:scale-110 transition-transform duration-500">
                        <i class="fa-solid fa-triangle-exclamation"></i>
                    </div>
                    <div class="flex items-center justify-between border-b border-slate-800/60 pb-3 z-10">
                        <h3 class="text-sm font-black text-red-400 uppercase tracking-widest flex items-center gap-2">
                            <div class="w-8 h-8 rounded-lg bg-red-500/20 text-red-500 flex items-center justify-center shadow-[0_0_10px_rgba(239,68,68,0.2)] animate-pulse"><i class="fa-solid fa-triangle-exclamation"></i></div>
                            শীর্ষ ৫ বকেয়া কাস্টমার
                        </h3>
                        <button class="text-[10px] text-blue-400 font-bold hover:text-white bg-blue-500/10 hover:bg-blue-600 px-3 py-1.5 rounded-lg border border-blue-500/30 transition-all flex items-center gap-1.5" onclick="window.navigate('customers')">
                            কাস্টমার লিস্ট <i class="fa-solid fa-arrow-right"></i>
                        </button>
                    </div>
                    <div id="top-due-customers-list" class="flex flex-col gap-2.5 font-bn z-10">
                        <div class="text-center py-6 text-slate-500 text-xs italic"><i class="fa-solid fa-spinner fa-spin mr-2"></i> ডাটা ফিল্টার হচ্ছে...</div>
                    </div>
                </div>
            </div>
        </div>
    `}function yn(){return`
        <div class="flex flex-col gap-6 font-bn">
            ${_n()}
            ${gn()}
            ${vn()}
        </div>
    `}function bn(e,t=[]){let n=document.getElementById(e);if(!n)return;let r=n.getContext(`2d`);if(!r)return;let i=n.parentElement.clientWidth||500;n.width=i,n.height=180,r.clearRect(0,0,i,180);let a=t.length>0?t:[{day:`Sat`,sales:12e3,col:15e3},{day:`Sun`,sales:25e3,col:18e3},{day:`Mon`,sales:18e3,col:22e3},{day:`Tue`,sales:3e4,col:28e3},{day:`Wed`,sales:22e3,col:26e3},{day:`Thu`,sales:35e3,col:32e3},{day:`Fri`,sales:28e3,col:31e3}],o=i-60,s=Math.max(...a.map(e=>Math.max(e.sales,e.col)),4e4),c=o/(a.length-1);r.strokeStyle=`rgba(51, 65, 85, 0.15)`,r.lineWidth=1,r.setLineDash([4,4]);for(let e=0;e<=3;e++){let t=30+120/3*e;r.beginPath(),r.moveTo(30,t),r.lineTo(i-30,t),r.stroke()}r.setLineDash([]);let l=r.createLinearGradient(0,30,0,150);l.addColorStop(0,`rgba(59, 130, 246, 0.4)`),l.addColorStop(1,`rgba(59, 130, 246, 0.0)`);let u=r.createLinearGradient(0,30,0,150);u.addColorStop(0,`rgba(16, 185, 129, 0.4)`),u.addColorStop(1,`rgba(16, 185, 129, 0.0)`),r.beginPath(),r.moveTo(30,150),a.forEach((e,t)=>{let n=30+t*c,i=150-e.sales/s*120;r.lineTo(n,i)}),r.lineTo(30+o,150),r.closePath(),r.fillStyle=l,r.fill(),r.beginPath(),r.moveTo(30,150),a.forEach((e,t)=>{let n=30+t*c,i=150-e.col/s*120;r.lineTo(n,i)}),r.lineTo(30+o,150),r.closePath(),r.fillStyle=u,r.fill(),r.beginPath(),r.strokeStyle=`#3B82F6`,r.lineWidth=3,a.forEach((e,t)=>{let n=30+t*c,i=150-e.sales/s*120;t===0?r.moveTo(n,i):r.lineTo(n,i)}),r.stroke(),r.beginPath(),r.strokeStyle=`#10B981`,r.lineWidth=3,a.forEach((e,t)=>{let n=30+t*c,i=150-e.col/s*120;t===0?r.moveTo(n,i):r.lineTo(n,i)}),r.stroke(),r.font=`bold 10px "Hind Siliguri", sans-serif`,r.textAlign=`center`,a.forEach((e,t)=>{let n=30+t*c,i=150-e.sales/s*120,a=150-e.col/s*120;r.shadowColor=`rgba(59, 130, 246, 0.8)`,r.shadowBlur=5,r.fillStyle=`#3B82F6`,r.beginPath(),r.arc(n,i,4,0,Math.PI*2),r.fill(),r.shadowBlur=0,r.fillStyle=`#fff`,r.beginPath(),r.arc(n,i,1.5,0,Math.PI*2),r.fill(),r.shadowColor=`rgba(16, 185, 129, 0.8)`,r.shadowBlur=5,r.fillStyle=`#10B981`,r.beginPath(),r.arc(n,a,4,0,Math.PI*2),r.fill(),r.shadowBlur=0,r.fillStyle=`#fff`,r.beginPath(),r.arc(n,a,1.5,0,Math.PI*2),r.fill(),r.fillStyle=`#94A3B8`,r.fillText(e.day,n-10,172)})}function xn(e,t=0,n=0){let r=document.getElementById(e);if(!r)return;let i=r.getContext(`2d`);if(!i)return;r.width=120,r.height=120;let a=t+n;if(i.clearRect(0,0,120,120),a===0){i.beginPath(),i.arc(60,60,45,0,Math.PI*2),i.strokeStyle=`#334155`,i.lineWidth=14,i.stroke();return}let o=t/a*Math.PI*2,s=n/a*Math.PI*2;t>0&&(i.beginPath(),i.arc(60,60,45,0,o),i.strokeStyle=`#10B981`,i.lineWidth=14,i.stroke()),n>0&&(i.beginPath(),i.arc(60,60,45,o,o+s),i.strokeStyle=`#3B82F6`,i.lineWidth=14,i.stroke())}function Sn(){let e=document.getElementById(`dash-cust-name`),t=document.getElementById(`dash-cust-phone`),n=document.getElementById(`dash-cust-address`),r=document.getElementById(`dash-cust-initial-balance`),i=document.getElementById(`dash-cust-date`),a=document.getElementById(`dash-cust-zone-select`),o=document.getElementById(`dash-cust-zone-code-display`),s=document.getElementById(`dash-cust-generated-acc`);e&&(e.value=``),t&&(t.value=``),n&&(n.value=``),r&&(r.value=``),Ee(`dash-cust-initial-words`),i&&(i.value=R()),a&&(a.selectedIndex=0),o&&(o.value=``),s&&(s.value=``)}function Cn(){let e=document.getElementById(`dash-add-customer-form`);if(e&&(e.classList.toggle(`hidden`),!e.classList.contains(`hidden`))){Sn(),tn(),bt(`dash-cust-address`,`dash-cust-address-datalist`,`dash-cust-address-chips`);let t=document.getElementById(`dash-cust-date`);t&&!t.value&&(t.value=R()),setTimeout(()=>{e.scrollIntoView({behavior:`smooth`,block:`start`});let t=document.getElementById(`dash-cust-name`);t&&t.focus()},80)}}async function wn(){if(!navigator.onLine)return H.default.fire({title:`<i class="fa-solid fa-wifi text-red-400 mr-2"></i>অফলাইন!`,html:`<p class="font-bn text-slate-300 text-sm">ইন্টারনেট সংযোগ নেই।<br><strong class="text-red-400">অফলাইনে নতুন কাস্টমার যোগ করা যাবে না।</strong><br><span class="text-xs text-slate-400 mt-1 block">অনুগ্রহ করে ইন্টারনেট চালু করে আবার চেষ্টা করুন।</span></p>`,icon:`error`,confirmButtonText:`ঠিক আছে`,customClass:{popup:`!bg-slate-950 !text-white !rounded-3xl border border-red-500/30 font-bn`,confirmButton:`m3-btn-primary !bg-red-600 hover:!bg-red-500 !px-6 !py-2 !rounded-xl font-bold`}});let e=document.getElementById(`dash-cust-date`)?.value,t=z(e||R()),r=document.getElementById(`dash-cust-name`)?.value?.trim(),i=document.getElementById(`dash-cust-phone`)?.value?.trim(),s=document.getElementById(`dash-cust-address`)?.value?.trim(),c=document.getElementById(`dash-cust-zone-select`)?.value,l=document.getElementById(`dash-cust-initial-balance`)?.value?.trim();if(!r||!i||!c)return H.default.fire(`এরর`,`নাম, মোবাইল নম্বর ও জোন আবশ্যক!`,`error`);let u=L(I(l)),d=document.getElementById(`dash-cust-generated-acc`)?.value||`Auto`,f=V(u);if(!(await H.default.fire({title:`<div class="flex items-center justify-center gap-2 font-bn font-black text-xl text-white"><i class="fa-solid fa-file-shield text-blue-400"></i><span>তথ্য যাচাই করুন</span></div>`,html:`
            <div class="text-left space-y-3 font-bn p-3.5 bg-slate-900/90 rounded-2xl border border-slate-800 shadow-inner">
                <div class="grid grid-cols-2 gap-4 border-b border-slate-800/80 pb-2.5">
                    <div class="flex flex-col gap-1"><span class="text-[10px] text-blue-400 font-black uppercase tracking-wider">কাস্টমারের নাম</span><span class="text-base text-white font-black">${r}</span></div>
                    <div class="flex flex-col gap-1"><span class="text-[10px] text-amber-400 font-black uppercase tracking-wider">অ্যাকাউন্ট নং</span><span class="text-base text-amber-400 font-black font-mono">${d}</span></div>
                </div>
                <div class="grid grid-cols-2 gap-4 border-b border-slate-800/80 pb-2.5">
                    <div class="flex flex-col gap-1"><span class="text-[10px] text-blue-400 font-black uppercase tracking-wider">মোবাইল নম্বর</span><span class="text-sm text-slate-200 font-bold font-mono">${i}</span></div>
                    <div class="flex flex-col gap-1"><span class="text-[10px] text-purple-400 font-black uppercase tracking-wider">জোন</span><span class="text-sm text-slate-200 font-bold">${c}</span></div>
                </div>
                <div class="flex flex-col gap-1 border-b border-slate-800/80 pb-2.5">
                    <span class="text-[10px] text-sky-400 font-black uppercase tracking-wider flex items-center gap-1"><i class="fa-solid fa-location-dot text-amber-400 text-xs"></i>ঠিকানা (Address)</span>
                    <span class="text-xs text-slate-200 font-medium">${s||`N/A`}</span>
                </div>
                <div class="flex flex-col gap-1 pt-1">
                    <span class="text-[10px] text-emerald-400 font-black uppercase tracking-wider">অবশিষ্ট ব্যালেন্স (Opening)</span>
                    <span class="text-2xl text-emerald-400 font-black">৳ ${F(u)}</span>
                    ${f?`<div class="text-[11px] text-emerald-400 font-black italic bg-emerald-500/10 px-2.5 py-1 rounded-xl border border-emerald-500/20 mt-1">(${f})</div>`:``}
                </div>
                <div class="flex flex-col gap-1 pt-2 border-t border-slate-800/80">
                    <span class="text-[10px] text-slate-400 font-black uppercase tracking-wider">হিসাব খোলার তারিখ</span>
                    <span class="text-sm text-slate-300 font-bold font-mono">${B(t)}</span>
                </div>
            </div>
            <p class="text-xs text-amber-400 font-bold mt-4 text-center">সব তথ্য সঠিক থাকলে "কনফার্ম করুন" বাটনে ক্লিক করুন।</p>
        `,showCancelButton:!0,confirmButtonText:`<i class="fa-solid fa-circle-check mr-2"></i>কনফার্ম করুন`,cancelButtonText:`<i class="fa-solid fa-pen-to-square mr-2"></i>সংশোধন করব`,customClass:{popup:`!bg-slate-950 !text-white !rounded-3xl border border-slate-800 shadow-2xl font-bn`,confirmButton:`m3-btn-primary !bg-blue-600 hover:!bg-blue-500 !px-7 !py-2.5 !rounded-xl font-bold shadow-lg shadow-blue-600/30`,cancelButton:`m3-btn-tonal !bg-slate-800 hover:!bg-slate-700 !text-slate-300 !px-5 !py-2.5 !rounded-xl font-bold border border-slate-700`}})).isConfirmed)return;let p=document.getElementById(`dash-save-cust-btn`);p&&(p.disabled=!0,p.innerText=`সেভ হচ্ছে...`);try{let e=``,l=``;if(await m.runTransaction(async d=>{let f=(await v.getAllZones()).find(e=>e.name===c);l=(f?f.code:``)+await g.getNextAccountNo(c,d);let p=a.getRef();e=p.id;let m=o.getRef();d.set(p,{name:r,phone:i,address:s||``,zone:c||``,accountNo:l,openingDate:t,initialDue:u,totalDue:u,createdAt:n.firestore.FieldValue.serverTimestamp()}),d.set(m,{customerId:e,customerName:r,date:t,voucherNo:`OPENING`,bill:u>0?u:0,paid:u<0?Math.abs(u):0,prevDue:0,currentDue:u,notes:`প্রারম্ভিক ব্যালেন্স (Opening Balance)`,createdBy:window.AppState?.currentUserEmail||`System`,createdAt:n.firestore.FieldValue.serverTimestamp()})}),O(`CREATE`,`Customers`,e,r,{phone:i,zone:c,initialBalance:u}),H.default.fire({title:`সফল!`,text:`কাস্টমার "${r}" যোগ করা হয়েছে। জোন: ${c||`N/A`}`,icon:`success`,customClass:{popup:`!bg-slate-900 !text-white !rounded-3xl border border-slate-700`}}),i&&i.trim()!==``&&i!==`-`)try{let e=await g.getAppSettings(),t=(typeof window.toBanglishName==`function`?window.toBanglishName(r):r)||`Customer`,n=e.shopName?typeof window.toBanglishName==`function`?window.toBanglishName(e.shopName):e.shopName:`M/S. Maa Motors`,a=window.formatAppDate&&window.getTodayLocalDateString?window.formatAppDate(window.getTodayLocalDateString()):`Today`,o=(e.smsTemplateOpening||`Dear [Name] [AccNo], A/C opened at [Shop] on [Date]. Opening Due: Tk [Due]. Thanks!`).replace(/\[Name\]/g,t).replace(/\[AccNo\]/g,`(A/C: ${l})`).replace(/\[Shop\]/g,n).replace(/\[Date\]/g,a).replace(/\[Due\]/g,F(Math.abs(u)));o=o.replace(/\s+/g,` `).replace(/[^\x00-\x7F]/g,``);let{value:s,isConfirmed:c}=await H.default.fire({title:`<div class="flex flex-col items-center gap-2"><i class="fa-solid fa-comment-sms text-emerald-400 text-3xl mb-1"></i><span class="font-bn font-black text-xl text-white">Welcome SMS</span></div>`,html:`<div class="text-left space-y-2 mb-2 font-bn">
                            <p class="text-[13px] text-slate-300">কাস্টমারকে কি অ্যাকাউন্ট খোলার মেসেজ পাঠাতে চান?</p>
                            <div class="flex justify-between items-center"><div class="text-xs text-slate-400">Recipient Phone: <strong class="text-white">${i}</strong></div></div>
                           </div>`,input:`textarea`,inputValue:o,inputAttributes:{rows:4,class:`m3-field text-xs font-mono !mt-0`},showCancelButton:!0,confirmButtonText:`<i class="fa-solid fa-paper-plane mr-1.5"></i> পাঠিয়ে দিন`,cancelButtonText:`স্কিপ করুন`,customClass:{popup:`!bg-slate-950 !text-white !rounded-3xl border border-slate-700 shadow-2xl`,confirmButton:`m3-btn-primary !bg-emerald-600 hover:!bg-emerald-500 !px-7 !py-2.5 !rounded-xl font-bold shadow-lg shadow-emerald-600/30`,cancelButton:`m3-btn-tonal !bg-slate-800 hover:!bg-slate-700 !text-slate-300 !px-5 !py-2.5 !rounded-xl font-bold border border-slate-700`}});c&&s&&await De(i,s,!1)&&K(`Welcome SMS পাঠানো হয়েছে`,`success`)}catch(e){console.warn(`Dashboard welcome SMS dispatch error:`,e)}Sn();let d=document.getElementById(`dash-add-customer-form`);d&&d.classList.add(`hidden`),window.loadCustomers&&window.loadCustomers()}catch(e){G(e,`কাস্টমার যোগ করা যায়নি`)}finally{p&&(p.disabled=!1,p.innerText=`সেভ করুন`)}}function Tn(){let e=document.getElementById(`top-due-customers-list`);if(!e)return;let t=[...J()].sort((e,t)=>(Number(t.totalDue)||0)-(Number(e.totalDue)||0)).slice(0,5);if(t.length===0){e.innerHTML=`<div class="text-center py-6 text-slate-500 text-xs italic">কোনো বকেয়া কাস্টমার পাওয়া যায়নি</div>`;return}let n=``;t.forEach((e,t)=>{let r=Number(e.totalDue)||0,i=(e.name||`Unknown`).replace(/'/g,`\\'`),a=e.phone||``;n+=`
            <div class="flex items-center justify-between p-2.5 rounded-xl bg-slate-950/60 border border-slate-800/60 hover:border-red-500/30 transition-all">
                <div class="flex items-center gap-2.5">
                    <span class="w-6 h-6 rounded-lg bg-red-500/10 text-red-400 font-black text-xs flex items-center justify-center">${t+1}</span>
                    <div>
                        <p class="text-xs font-black text-white truncate max-w-[120px]">${e.name||`Unknown`}</p>
                        <p class="text-[10px] text-slate-400 font-bold">${e.phone||`-`}</p>
                    </div>
                </div>
                <div class="flex items-center gap-1.5">
                    <span class="text-xs font-black text-red-400 mr-1">৳ ${F(r)}</span>
                    <button class="w-7 h-7 rounded-lg bg-emerald-600/10 hover:bg-emerald-600 text-emerald-400 hover:text-white flex items-center justify-center transition-all cursor-pointer" onclick="window.sendDashWhatsAppReminder('${a}', ${r}, '${i}')" title="WhatsApp তাগাদা">
                        <i class="fa-brands fa-whatsapp text-[12px]"></i>
                    </button>
                    <button class="w-7 h-7 rounded-lg bg-blue-600/10 hover:bg-blue-600 text-blue-400 hover:text-white flex items-center justify-center transition-all cursor-pointer" onclick="window.sendReminderSMS && window.sendReminderSMS('${a}', ${r}, '${i}')" title="SMS রিমাইন্ডার">
                        <i class="fa-solid fa-comment-sms text-[11px]"></i>
                    </button>
                </div>
            </div>`}),e.innerHTML=n}function En(e,t,n){let r=F(Math.abs(t)),i=`আসসালামু আলাইকুম ${n},\nমেসার্স মা মোটরস্ থেকে আপনার হিসাব বিবরণী:\n\n${t<0?`অ্যাডভান্স জমা: ৳ ${r}`:`বর্তমান মোট বকেয়া: ৳ ${r}`}\n\n*বিশেষ অনুরোধ: আপনার বকেয়া টাকাটি দ্রুত পরিশোধ করার অনুরোধ রইল।*\n\nযোগাযোগ: 01819-397669\nধন্যবাদ! — মেসার্স মা মোটরস্`;window.sendWhatsApp&&window.sendWhatsApp(e,i)}function Dn(e,t,n,r){if(!n||!n.txns||n.txns.length===0)return H.default.fire({title:e,text:`এই ব্যাংক বা উৎসে কোনো লেনদেন ডাটা পাওয়া যায়নি`,icon:`info`});let i=n.txns,a=B(r||R()),o=``;i.forEach((e,t)=>{let n=e.customerName||`Customer`,r=e.voucherNo?`#${e.voucherNo}`:`-`,i=Number(e.paid)||0;o+=`
            <tr class="border-b border-slate-800/80 hover:bg-white/[0.02]">
                <td class="py-2 px-3 text-center text-slate-400 font-bold">${t+1}</td>
                <td class="py-2 px-3 text-left text-white font-black">${n}</td>
                <td class="py-2 px-3 text-center text-blue-400 font-mono font-bold">${r}</td>
                <td class="py-2 px-3 text-right font-mono font-black text-emerald-400">৳ ${F(i)}</td>
            </tr>`}),H.default.fire({title:`<div class="flex flex-col items-center gap-1 font-bn">
                    <div class="flex items-center gap-2 text-xl text-white font-black">
                        <i class="fa-solid ${t===`Bank`?`fa-building-columns text-blue-400`:`fa-hand-holding-dollar text-emerald-400`}"></i>
                        <span>${e}</span>
                    </div>
                    <span class="text-xs text-slate-400 font-bold">তারিখ: ${a} • মোট ${i.length}টি এন্ট্রি</span>
                </div>`,html:`
            <div class="text-left font-bn space-y-3">
                <div class="max-h-60 overflow-y-auto custom-scrollbar rounded-xl border border-slate-800 bg-slate-950/90">
                    <table class="w-full text-xs">
                        <thead>
                            <tr class="bg-slate-900 text-slate-400 font-black border-b border-slate-800 text-[11px] uppercase">
                                <th class="py-2 px-3 text-center">ক্রমিক</th>
                                <th class="py-2 px-3 text-left">কাস্টমারের নাম</th>
                                <th class="py-2 px-3 text-center">ভাউচার</th>
                                <th class="py-2 px-3 text-right">জমা টাকা (৳)</th>
                            </tr>
                        </thead>
                        <tbody>${o}</tbody>
                    </table>
                </div>
                <div class="flex items-center justify-between p-3 bg-blue-600/10 border border-blue-500/30 rounded-xl font-bn">
                    <span class="text-xs font-black text-slate-300">মোট জমা যোগফল:</span>
                    <span class="text-base font-black text-blue-400 font-mono">৳ ${F(n.total)}</span>
                </div>
            </div>
        `,confirmButtonText:`ঠিক আছে`,customClass:{popup:`!bg-slate-950 !text-white !rounded-3xl border border-slate-800 shadow-2xl font-bn max-w-lg`,confirmButton:`m3-btn-primary !bg-blue-600 hover:!bg-blue-500 !px-8 !py-2 !rounded-xl font-bold`}})}async function On(){try{let e=R(),t=document.getElementById(`dash-total-due`)?.innerText||`৳ ০`,n=document.getElementById(`dash-today-col`)?.innerText||`৳ ০`,r=document.getElementById(`dash-today-exp`)?.innerText||`৳ ০`,i=document.getElementById(`dash-total-cust`)?.innerText||`০ জন`,a=document.getElementById(`dash-col-cash`)?.innerText||`৳ ০`,o=document.getElementById(`dash-col-bank`)?.innerText||`৳ ০`,s=document.getElementById(`dash-net-cash`)?.innerText||``,c=s.includes(`ঘাটতি`)?`ঘাটতি (Deficit)`:`উদ্বৃত্ত (Surplus)`,l=s.includes(`ঘাটতি`)?`#dc2626`:`#059669`,u=s.replace(/\s*\(.*?\)\s*/g,``).replace(`নিট ক্যাশ:`,``).trim(),d=await g.getAppSettings(),f=[...J()].filter(e=>(Number(e.totalDue)||0)>0).sort((e,t)=>(Number(t.totalDue)||0)-(Number(e.totalDue)||0)).slice(0,10),p=``;p=f.length>0?f.map((e,t)=>`
                <tr>
                    <td style="text-align:center; padding: 6px; border: 1px solid #cbd5e1; font-weight:bold;">${String(t+1).padStart(2,`0`)}</td>
                    <td style="padding: 6px; border: 1px solid #cbd5e1; font-weight:bold;">${e.name||`-`}</td>
                    <td style="text-align:center; padding: 6px; border: 1px solid #cbd5e1; font-size: 10px;">${e.accountNo||`-`}</td>
                    <td style="text-align:center; padding: 6px; border: 1px solid #cbd5e1; font-size: 10px;">${e.zone||`-`}</td>
                    <td style="text-align:center; padding: 6px; border: 1px solid #cbd5e1; font-size: 10px;">${e.phone||`-`}</td>
                    <td style="text-align:right; padding: 6px; border: 1px solid #cbd5e1; font-weight:900; color:#dc2626;">৳ ${F(Number(e.totalDue)||0)}</td>
                </tr>
            `).join(``):`<tr><td colspan="6" style="text-align:center; padding:12px; color:#64748b; font-style:italic;">কোনো বকেয়া কাস্টমার পাওয়া যায়নি</td></tr>`;let m=Ve({title:`EXECUTIVE REPORT`,dateRangeStr:`তারিখ: ${B(e)} • সময়: ${new Date().toLocaleTimeString(`en-US`,{hour:`2-digit`,minute:`2-digit`})}`},d),h=document.getElementById(`print-receipt-container`);h||(h=document.createElement(`div`),h.id=`print-receipt-container`,document.body.appendChild(h)),h.className=`print-a4`,h.innerHTML=`
            <table class="print-layout-table" style="width: 100%; border-collapse: collapse;">
                <thead><tr><td><div class="print-header-space"></div></td></tr></thead>
                <tbody>
                    <tr>
                        <td>
                            <div class="a4-wrapper font-bn">
                                ${m}

                                <div style="font-size: 11px; font-weight: 900; color: #0284c7; text-transform: uppercase; border-bottom: 2px solid #0284c7; padding-bottom: 4px; margin-bottom: 12px; letter-spacing: 0.5px;">
                                    দৈনিক ব্যবসায়িক সারসংক্ষেপ (KEY PERFORMANCE METRICS)
                                </div>

                                <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 12px; margin-bottom: 20px;">
                                    <div style="background: #fdf2f2; border: 1px solid #fecaca; border-left: 4px solid #dc2626; padding: 12px; border-radius: 10px;">
                                        <div style="font-size: 9px; font-weight: 900; color: #991b1b; text-transform: uppercase; margin-bottom: 4px;">মার্কেটে মোট বকেয়া</div>
                                        <strong style="font-size: 15px; font-weight: 900; color: #dc2626;">${t}</strong>
                                    </div>
                                    <div style="background: #f0fdf4; border: 1px solid #bbf7d0; border-left: 4px solid #059669; padding: 12px; border-radius: 10px;">
                                        <div style="font-size: 9px; font-weight: 900; color: #166534; text-transform: uppercase; margin-bottom: 4px;">আজকের আদায় (Collection)</div>
                                        <strong style="font-size: 15px; font-weight: 900; color: #059669;">${n}</strong>
                                    </div>
                                    <div style="background: #fffbe6; border: 1px solid #ffe58f; border-left: 4px solid #d97706; padding: 12px; border-radius: 10px;">
                                        <div style="font-size: 9px; font-weight: 900; color: #856404; text-transform: uppercase; margin-bottom: 4px;">আজকের মোট খরচ</div>
                                        <strong style="font-size: 15px; font-weight: 900; color: #d97706;">${r}</strong>
                                    </div>
                                    <div style="background: #eff6ff; border: 1px solid #bfdbfe; border-left: 4px solid #2563eb; padding: 12px; border-radius: 10px;">
                                        <div style="font-size: 9px; font-weight: 900; color: #1e40af; text-transform: uppercase; margin-bottom: 4px;">মোট কাস্টমার সংখ্যা</div>
                                        <strong style="font-size: 15px; font-weight: 900; color: #2563eb;">${i}</strong>
                                    </div>
                                </div>

                                <div style="font-size: 11px; font-weight: 900; color: #0284c7; text-transform: uppercase; border-bottom: 2px solid #0284c7; padding-bottom: 4px; margin-bottom: 10px; letter-spacing: 0.5px; margin-top: 4px;">
                                    দৈনিক ক্যাশ ফ্লো বিভাজন (DAILY CASH FLOW BREAKDOWN)
                                </div>
                                <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 10px; margin-bottom: 20px;">
                                    <div style="background: #f0fdf4; border: 1px solid #bbf7d0; border-left: 4px solid #059669; padding: 10px; border-radius: 10px;">
                                        <div style="font-size: 8px; font-weight: 900; color: #166534; text-transform: uppercase; margin-bottom: 3px;">ক্যাশ আদায়</div>
                                        <strong style="font-size: 13px; font-weight: 900; color: #059669;">${a}</strong>
                                    </div>
                                    <div style="background: #eff6ff; border: 1px solid #bfdbfe; border-left: 4px solid #2563eb; padding: 10px; border-radius: 10px;">
                                        <div style="font-size: 8px; font-weight: 900; color: #1e40af; text-transform: uppercase; margin-bottom: 3px;">ব্যাংক আদায়</div>
                                        <strong style="font-size: 13px; font-weight: 900; color: #2563eb;">${o}</strong>
                                    </div>
                                    <div style="background: #fffbe6; border: 1px solid #ffe58f; border-left: 4px solid #d97706; padding: 10px; border-radius: 10px;">
                                        <div style="font-size: 8px; font-weight: 900; color: #856404; text-transform: uppercase; margin-bottom: 3px;">মোট খরচ</div>
                                        <strong style="font-size: 13px; font-weight: 900; color: #d97706;">${r}</strong>
                                    </div>
                                    <div style="background: ${l===`#dc2626`?`#fdf2f2`:`#f0fdf4`}; border: 1px solid ${l===`#dc2626`?`#fecaca`:`#bbf7d0`}; border-left: 4px solid ${l}; padding: 10px; border-radius: 10px;">
                                        <div style="font-size: 8px; font-weight: 900; color: ${l}; text-transform: uppercase; margin-bottom: 3px;">নিট ক্যাশ · ${c}</div>
                                        <strong style="font-size: 13px; font-weight: 900; color: ${l};">${u}</strong>
                                    </div>
                                </div>

                                <div style="font-size: 11px; font-weight: 900; color: #0f172a; text-transform: uppercase; border-bottom: 2px solid #0f172a; padding-bottom: 4px; margin-bottom: 10px; letter-spacing: 0.5px;">
                                    শীর্ষ ১০ জন সর্বাধিক বকেয়া কাস্টমার (TOP OUTSTANDING DUES)
                                </div>

                                <table style="width: 100%; border-collapse: collapse; margin-bottom: 24px; font-size: 11px;">
                                    <thead>
                                        <tr style="background: #f1f5f9; border-bottom: 1.5px solid #0f172a; font-size: 9px; font-weight: 900; text-transform: uppercase;">
                                            <th style="padding: 6px; width: 6%; text-align: center; border: 1px solid #cbd5e1;">SL</th>
                                            <th style="padding: 6px; text-align: left; border: 1px solid #cbd5e1;">কাস্টমারের নাম</th>
                                            <th style="padding: 6px; width: 12%; text-align: center; border: 1px solid #cbd5e1;">A/C NO</th>
                                            <th style="padding: 6px; width: 14%; text-align: center; border: 1px solid #cbd5e1;">জোন</th>
                                            <th style="padding: 6px; width: 16%; text-align: center; border: 1px solid #cbd5e1;">মোবাইল</th>
                                            <th style="padding: 6px; width: 20%; text-align: right; border: 1px solid #cbd5e1;">বর্তমান বকেয়া (৳)</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        ${p}
                                    </tbody>
                                </table>

                                <div style="margin-top: 45px; page-break-inside: avoid;">
                                    <div style="display: flex; justify-content: space-between; padding: 0 40px;">
                                        <div style="border-top: 1.5px dashed #64748b; padding-top: 6px; width: 150px; text-align: center; font-size: 11px; font-weight: 700; color: #334155;">প্রস্তুতকারীর স্বাক্ষর<br><span style="font-size:8px; font-weight:normal;">Prepared By</span></div>
                                        <div style="border-top: 1.5px dashed #64748b; padding-top: 6px; width: 150px; text-align: center; font-size: 11px; font-weight: 700; color: #334155;">কর্তৃপক্ষের স্বাক্ষর<br><span style="font-size:8px; font-weight:normal;">Authorized Signature</span></div>
                                    </div>
                                </div>
                            </div>
                        </td>
                    </tr>
                </tbody>
                <tfoot><tr><td><div class="print-footer-space"></div></td></tr></tfoot>
            </table>
        `,ot(h)}catch(e){console.error(`Executive Print Error:`,e),H.default.fire(`Error`,`রিপোর্ট প্রিন্ট করতে সমস্যা হয়েছে`,`error`)}}typeof window<`u`&&(window.sendDashWhatsAppReminder=En,window.toggleDashCustomerForm=Cn,window.saveDashCustomer=wn,window.showBreakdownDetails=Dn);function kn(){let e=new Date;return e.setDate(e.getDate()-1),`${e.getFullYear()}-${String(e.getMonth()+1).padStart(2,`0`)}-${String(e.getDate()).padStart(2,`0`)}`}async function An(e,t){let n=document.getElementById(`dash-collection-list-tbody`),r=document.getElementById(`dash-collection-list-total`);if(n){n.innerHTML=`<tr><td colspan="5" class="text-center py-10 text-slate-500"><i class="fa-solid fa-spinner fa-spin text-xl text-emerald-500 mb-2"></i><br>ডাটা লোড হচ্ছে...</td></tr>`;try{let i;i=e===t?await o.collection.where(`date`,`==`,e).get():await o.collection.where(`date`,`>=`,e).where(`date`,`<=`,t).get();let a=[];i.forEach(e=>a.push({id:e.id,...e.data()})),a=a.filter(e=>(Number(e.paid)||0)>0),a.sort((e,t)=>e.date===t.date?(t.createdAt?.toMillis?.()||0)-(e.createdAt?.toMillis?.()||0):t.date.localeCompare(e.date));let s=0,c=``,l={};if(a.length===0)c=`<tr><td colspan="5" class="text-center py-10 text-slate-500 italic">এই সময়ের মধ্যে কোনো আদায় নেই।</td></tr>`;else{let e=J();a.forEach(t=>{let n=Number(t.paid)||0,r=`Unknown`,i=e.find(e=>e.id===t.customerId);i&&(r=i.name);let a=t.receivedType||`Bank`,o=a===`Cash`?`Cash`:a===`Less`?`Less`:t.receivedFrom||`Bank`;o!==`Less`&&(l[o]||(l[o]={total:0,count:0}),l[o].total=L(l[o].total+n),l[o].count++,s=L(s+n));let u=``;u=a===`Cash`?`<span class="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded text-[10px] font-bold"><i class="fa-solid fa-hand-holding-dollar mr-1"></i> ক্যাশ</span>`:a===`Less`?`<span class="bg-amber-500/10 text-amber-400 border border-amber-500/20 px-2 py-0.5 rounded text-[10px] font-bold">ছাড় (Less)</span>`:`<span class="bg-blue-500/10 text-blue-400 border border-blue-500/20 px-2 py-0.5 rounded text-[10px] font-bold"><i class="fa-solid fa-building-columns mr-1"></i> ${t.receivedFrom||`Bank`}</span>`,c+=`
                    <tr class="hover:bg-slate-800/30 transition-all group collection-list-row" data-method="${o}" data-amount="${n}">
                        <td class="text-xs text-slate-400 whitespace-nowrap">${B(t.date)}</td>
                        <td class="text-sm font-bold text-slate-200">${r}</td>
                        <td class="text-xs font-mono text-slate-400">${t.voucherNo||`-`}</td>
                        <td>${u}</td>
                        <td class="text-right text-emerald-400 font-black font-mono">৳ ${F(n)}</td>
                    </tr>
                `})}n.innerHTML=c,r&&(r.innerText=`৳ ${F(s)}`);let u=document.getElementById(`dash-collection-card-total`),d=document.getElementById(`dash-collection-card-words`);u&&(u.innerText=`৳ ${F(s)}`),d&&(d.innerText=s>0?`${V(s)}`:`শূন্য টাকা মাত্র`);let f=document.getElementById(`dash-collection-method-cards`);if(f){let e=``;if(a.length>0&&Object.keys(l).length>0){e+=`
                    <div class="method-card-btn bg-emerald-600/90 backdrop-blur-md border border-emerald-500/50 rounded-2xl p-3 sm:p-3.5 cursor-pointer hover:bg-emerald-500 transition-all flex flex-col justify-between gap-2 w-full min-w-0 shadow-[0_5px_15px_-5px_rgba(16,185,129,0.5)] ring-2 ring-emerald-400 select-none" onclick="window.filterCollectionByMethod('All')" data-method="All">
                        <div class="flex items-center justify-between gap-1.5 w-full">
                            <span class="text-[11px] font-black text-emerald-100 uppercase drop-shadow-sm truncate"><i class="fa-solid fa-layer-group mr-1"></i>সব (All)</span>
                            <span class="text-[9.5px] bg-emerald-900/70 text-emerald-100 px-1.5 py-0.5 rounded-md font-bold shrink-0">${a.filter(e=>e.receivedType!==`Less`).length} জন</span>
                        </div>
                        <div class="text-base sm:text-lg font-black text-white tracking-tight font-inter whitespace-nowrap">৳ ${F(s)}</div>
                    </div>
                `;for(let[t,n]of Object.entries(l)){let r=t===`Cash`,i=r?`<i class="fa-solid fa-hand-holding-dollar mr-1"></i>`:`<i class="fa-solid fa-building-columns mr-1"></i>`,a=r?`bg-emerald-500/10`:`bg-blue-500/10`,o=r?`border-emerald-500/30`:`border-blue-500/30`,s=r?`text-emerald-400`:`text-blue-400`;e+=`
                        <div class="method-card-btn ${a} backdrop-blur-sm border ${o} ${r?`hover:bg-emerald-500/20 hover:border-emerald-500/50`:`hover:bg-blue-500/20 hover:border-blue-500/50`} rounded-2xl p-3 sm:p-3.5 cursor-pointer transition-all flex flex-col justify-between gap-2 w-full min-w-0 opacity-80 hover:opacity-100 shadow-sm select-none" onclick="window.filterCollectionByMethod('${t}')" data-method="${t}" data-ring="${r?`ring-emerald-400`:`ring-blue-400`}">
                            <div class="flex items-center justify-between gap-1.5 w-full">
                                <span class="text-[11px] font-bold ${s} uppercase truncate">${i}${t}</span>
                                <span class="text-[9.5px] bg-slate-900/80 ${s} px-1.5 py-0.5 rounded-md font-bold shrink-0">${n.count} জন</span>
                            </div>
                            <div class="text-base sm:text-lg font-black ${s} tracking-tight font-inter whitespace-nowrap">৳ ${F(n.total)}</div>
                        </div>
                    `}}f.innerHTML=e}}catch(e){console.error(e),n.innerHTML=`<tr><td colspan="5" class="text-center py-10 text-red-500">ডাটা লোড করতে সমস্যা হয়েছে</td></tr>`}}}function jn(e){let t=document.querySelectorAll(`.collection-list-row`),n=0;t.forEach(t=>{let r=t.getAttribute(`data-method`);if(e===`All`||r===e){t.style.display=``;let e=Number(t.getAttribute(`data-amount`))||0;r!==`Less`&&(n=L(n+e))}else t.style.display=`none`}),document.querySelectorAll(`.method-card-btn`).forEach(t=>{let n=t.getAttribute(`data-method`),r=t.getAttribute(`data-ring`)||`ring-emerald-400`;n===e?n===`All`?(t.classList.add(`bg-emerald-600`,`ring-2`,`ring-emerald-400`),t.classList.remove(`bg-emerald-600/50`)):(t.classList.add(`ring-2`,r,`opacity-100`),t.classList.remove(`opacity-70`)):n===`All`?(t.classList.remove(`bg-emerald-600`,`ring-2`,`ring-emerald-400`),t.classList.add(`bg-emerald-600/50`)):(t.classList.remove(`ring-2`,r,`opacity-100`),t.classList.add(`opacity-70`))});let r=document.getElementById(`dash-collection-card-total`),i=document.getElementById(`dash-collection-card-words`),a=document.getElementById(`dash-collection-list-total`);r&&(r.innerText=`৳ ${F(n)}`),a&&(a.innerText=`৳ ${F(n)}`),i&&(i.innerText=n>0?`${V(n)}`:`শূন্য টাকা মাত্র`)}function Mn(e,t=null,n=null){let r=R(),i=r,a=r;if([`today`,`yesterday`,`week`,`month`].forEach(t=>{let n=document.getElementById(`btn-col-${t}`);n&&(t===e?(n.classList.add(`bg-emerald-600`,`text-white`),n.classList.remove(`bg-slate-800`,`text-slate-300`,`bg-emerald-600/20`,`text-emerald-400`)):(n.classList.remove(`bg-emerald-600`,`text-white`,`bg-emerald-600/20`,`text-emerald-400`),n.classList.add(`bg-slate-800`,`text-slate-300`)))}),e===`yesterday`)i=a=kn();else if(e===`week`){let e=new Date;e.setDate(e.getDate()-6),i=z(e),a=r}else if(e===`month`){let e=new Date;e.setDate(e.getDate()-29),i=z(e),a=r}else e===`custom`&&t&&n&&(i=t,a=n);let o=document.getElementById(`collection-list-datepicker`);o&&o._flatpickr&&e!==`custom`&&(o._flatpickr.set(`mode`,`single`),o._flatpickr.setDate(i,!1)),An(i,a)}var Nn=[],Pn=null,Fn={},In={};function Ln(){Nn.forEach(e=>{typeof e==`function`&&e()}),Nn=[]}function Rn(e,t){if(window.AppState?.currentUserRole===`Staff`&&window.AppState?.permissions?.viewDashboard===!1){e.innerHTML=`<div class="m3-card text-center"><h2 class="text-xl font-bold text-red-500 font-bn">অ্যাক্সেস ডিনাইড! আপনার ড্যাশবোর্ড দেখার অনুমতি নেই।</h2></div>`;return}Ln(),e.innerHTML=yn(),tn(),Pn=R(),zn(Pn),setTimeout(()=>{let e=document.getElementById(`collection-list-datepicker`);e&&e._flatpickr&&e._flatpickr.set(`onChange`,function(e,t,n){if(e.length>0){let t=z(e[0]);window.filterCollectionList(`custom`,t,t)}}),window.filterCollectionList(`today`)},200)}function zn(e=null){Ln();let t=e||Pn||R();Pn=t;let n=document.getElementById(`dash-date-filter`),r=document.getElementById(`dash-active-date-text`),i=B(t),a=R();n&&(n.value=i),r&&(r.innerText=t===a?`আজকের লাইভ হিসাব (${i})`:`${i} এর হিসাব`);function s(){let e=J(),t=0;e.forEach(e=>{t=L(t+(Number(e.totalDue)||0))});let n=document.getElementById(`dash-total-due`),r=document.getElementById(`dash-total-cust`);n&&(n.innerText=`৳ `+F(t)),r&&(r.innerText=e.length+` জন`),Tn()}s();let c=setInterval(()=>{if(!document.getElementById(`dash-total-due`)){clearInterval(c);return}s()},3e3);Nn.push(()=>clearInterval(c));let l=0,u=0,d=0;function f(){let e=L(l-d),t=document.getElementById(`dash-net-cash`);t&&(e<0?(t.className=`flex items-center gap-1.5 text-red-400 font-bn font-bold text-xs`,t.innerHTML=`<i class="fa-solid fa-triangle-exclamation text-red-400"></i> নিট ক্যাশ: <span class="font-mono text-red-300 font-black">-৳ ${F(Math.abs(e))}</span> <span class="text-[10px] bg-red-500/20 px-1.5 py-0.5 rounded-md text-red-300 font-bold">(ঘাটতি)</span>`):(t.className=`flex items-center gap-1.5 text-emerald-400 font-bn font-bold text-xs`,t.innerHTML=`<i class="fa-solid fa-coins text-emerald-400"></i> নিট ক্যাশ: <span class="font-mono text-white font-black">৳ ${F(e)}</span> <span class="text-[10px] bg-emerald-500/20 px-1.5 py-0.5 rounded-md text-emerald-300 font-bold">(উদ্বৃত্ত)</span>`));let n=document.getElementById(`dash-bank-inflow`);n&&(n.className=`text-blue-400 font-black bg-blue-500/10 px-2 py-0.5 rounded-lg flex items-center gap-1 border border-blue-500/20 font-bn text-[11px]`,n.innerHTML=`<i class="fa-solid fa-building-columns text-[10px]"></i> ব্যাংক: <span class="font-mono text-white font-bold">৳ ${F(u)}</span>`)}let m=o.listenByDate(t,e=>{let t=0,n=0,r=0;Fn={},In={},e.forEach(e=>{let i=Number(e.paid)||0;if(i<=0)return;let a=e.receivedType||`Bank`,o=(e.receivedFrom||``).trim();a===`Cash`?(t=L(t+i),o||=`শোরুম ক্যাশ`,In[o]||(In[o]={total:0,txns:[]}),In[o].total=L(In[o].total+i),In[o].txns.push(e)):a===`Less`?r=L(r+i):(n=L(n+i),o||=`অন্যান্য ব্যাংক`,Fn[o]||(Fn[o]={total:0,txns:[]}),Fn[o].total=L(Fn[o].total+i),Fn[o].txns.push(e))}),l=t,u=n;let i=L(t+n),a=document.getElementById(`dash-today-col`);a&&(a.innerText=`৳ `+F(i));let o=document.getElementById(`dash-col-cash`),s=document.getElementById(`dash-col-bank`);o&&(o.innerText=`৳ `+F(t)),s&&(s.innerText=`৳ `+F(n)),f(),xn(`payment-donut-chart`,t,n),bn(`sales-vs-col-chart`)});Nn.push(m);let h=p.listenByDate(t,e=>{let t=0;e.forEach(e=>t=L(t+(Number(e.amount)||0))),d=t;let n=document.getElementById(`dash-today-exp`);n&&(n.innerText=`৳ `+F(t)),f()});Nn.push(h)}function Bn(e){e&&zn(z(e))}typeof window<`u`&&(window.switchDashTimeframe=e=>{let t=R(),n=kn(),r=document.getElementById(`tf-today-btn`),i=document.getElementById(`tf-yesterday-btn`);r&&i&&(e===`today`?(r.className=`px-3 py-1.5 min-h-[34px] rounded-lg bg-blue-600 text-white font-black cursor-pointer`,i.className=`px-3 py-1.5 min-h-[34px] rounded-lg text-slate-400 hover:text-white font-bold cursor-pointer`,zn(t)):e===`yesterday`&&(i.className=`px-3 py-1.5 min-h-[34px] rounded-lg bg-blue-600 text-white font-black cursor-pointer`,r.className=`px-3 py-1.5 min-h-[34px] rounded-lg text-slate-400 hover:text-white font-bold cursor-pointer`,zn(n)))},window.onDashDateFilterChange=Bn,window.loadCollectionList=An,window.filterCollectionList=Mn,window.filterCollectionByMethod=jn,window.printExecutiveSummary=On,window.toggleDashCustomerForm=Cn,window.saveDashCustomer=wn,window.resetDashCustomerForm=Sn,window.showBreakdownDetails=(e,t)=>{let n=e===`Bank`?Fn:In,r=t?n[t]:null;if(!r){let t=Object.entries(n);if(t.length===0)return Swal.fire({title:e,text:`এই ক্যাটাগরিতে কোনো লেনদেন নেই`,icon:`info`,customClass:{popup:`!bg-slate-900 !text-white !rounded-3xl border border-slate-700`}});let[r,i]=t[0];Dn(r,e,i,Pn);return}Dn(t,e,r,Pn)});function Vn(e=``,{inputId:t,selectId:n,dropdownId:r,onSelect:i}={}){let a=document.getElementById(r);if(!a)return;let o=J()||[],s=(e||``).trim(),c=o;if(s&&(c=o.filter(e=>typeof window.matchCustomerSearch==`function`?window.matchCustomerSearch(e,s):(e.name||``).toLowerCase().includes(s.toLowerCase())||(e.phone||``).toLowerCase().includes(s.toLowerCase())||(e.accountNo||``).toLowerCase().includes(s.toLowerCase())||(e.address||``).toLowerCase().includes(s.toLowerCase()))),c.length===0){a.innerHTML=`<div class="p-3 text-center text-xs text-slate-500 font-bold">কোনো কাস্টমার পাওয়া যায়নি</div>`,a.classList.remove(`hidden`);return}a.innerHTML=c.slice(0,40).map(e=>{let t=Number(e.totalDue)||0,n=t>0?`<span class="text-[10px] bg-red-500/20 text-red-400 border border-red-500/30 px-2 py-0.5 rounded-md font-black">৳${F(t)}</span>`:`<span class="text-[10px] bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-2 py-0.5 rounded-md font-bold">০.০০</span>`,r=e.accountNo?`<span class="text-blue-400 text-[10px] font-mono font-bold">#${e.accountNo}</span>`:``;return`
            <div class="combobox-item p-2 rounded-xl hover:bg-slate-800/80 cursor-pointer transition-all border border-transparent hover:border-slate-700 flex items-center justify-between gap-2" data-id="${e.id}">
                <div class="flex flex-col">
                    <div class="text-xs font-black text-white flex items-center gap-1.5">${e.name} ${r}</div>
                    <div class="text-[10px] text-slate-400 font-bold mt-0.5"><i class="fa-solid fa-phone text-[8px] mr-1 text-slate-500"></i>${e.phone||`-`} ${e.address?`• `+e.address:``}</div>
                </div>
                <div>${n}</div>
            </div>
        `}).join(``),a.classList.remove(`hidden`);let l=a.querySelector(`.combobox-item`);l&&l.classList.add(`active-combobox-item`,`!bg-blue-600/30`,`!border-blue-500/50`),a.querySelectorAll(`.combobox-item`).forEach(e=>{e.addEventListener(`click`,()=>{let a=e.dataset.id;Un(a,{inputId:t,selectId:n,dropdownId:r,onSelect:i})})}),Hn({inputId:t,selectId:n,dropdownId:r,onSelect:i})}function Hn({inputId:e,selectId:t,dropdownId:n,onSelect:r,nextFocusId:i}={}){let a=document.getElementById(e);!a||a._comboboxKeyBound||(a._comboboxKeyBound=!0,a.addEventListener(`keydown`,o=>{let s=document.getElementById(n);if(!s||s.classList.contains(`hidden`)){o.key===`ArrowDown`&&Vn(a.value,{inputId:e,selectId:t,dropdownId:n,onSelect:r});return}let c=Array.from(s.querySelectorAll(`.combobox-item`));if(c.length===0)return;let l=c.findIndex(e=>e.classList.contains(`active-combobox-item`));if(o.key===`ArrowDown`)o.preventDefault(),l>=0&&c[l].classList.remove(`active-combobox-item`,`!bg-blue-600/30`,`!border-blue-500/50`),l=(l+1)%c.length,c[l].classList.add(`active-combobox-item`,`!bg-blue-600/30`,`!border-blue-500/50`),c[l].scrollIntoView({block:`nearest`});else if(o.key===`ArrowUp`)o.preventDefault(),l>=0&&c[l].classList.remove(`active-combobox-item`,`!bg-blue-600/30`,`!border-blue-500/50`),l=(l-1+c.length)%c.length,c[l].classList.add(`active-combobox-item`,`!bg-blue-600/30`,`!border-blue-500/50`),c[l].scrollIntoView({block:`nearest`});else if(o.key===`Enter`){o.preventDefault();let a=l>=0?c[l]:c[0];if(a&&a.dataset.id){Un(a.dataset.id,{inputId:e,selectId:t,dropdownId:n,onSelect:r});let o=document.getElementById(i||`ledger-date`);o&&o.focus()}}else o.key===`Escape`&&s.classList.add(`hidden`)}))}function Un(e,{inputId:t,selectId:n,dropdownId:r,onSelect:i}={}){let a=document.getElementById(n),o=document.getElementById(t),s=document.getElementById(`${t}-clear`),c=document.getElementById(r);if(a&&(a.value=e,a.dispatchEvent(new Event(`change`,{bubbles:!0}))),a&&a.selectedIndex>=0){let e=a.options[a.selectedIndex];o&&e&&(o.value=`${e.dataset?.name||e.text}`),s&&s.classList.remove(`hidden`)}c&&c.classList.add(`hidden`),typeof i==`function`&&i(e)}var Wn=[],Gn=[];window.cachedBanksHtml=`<option value="">-- ব্যাংক নির্বাচন করুন --</option>`,window.cachedCashHtml=`<option value="">-- ক্যাশ রিসিভার নির্বাচন করুন --</option>`;async function Kn(){try{let e=await f.getAllBanks(),t=await o.getAll(),n=new Set;t.forEach(e=>{e.receivedType===`Bank`&&e.receivedFrom&&n.add(e.receivedFrom.trim())}),n.add(`OneBank (IFRAT)`),n.add(`IBBL (IFRAT)`);let r=new Set(e.map(e=>e.name)),i=!1;for(let e of n)!r.has(e)&&e.length>0&&(await f.add({name:e,status:`active`}),i=!0);i&&(e=await f.getAllBanks()),Wn=e;let a=e.filter(e=>e.status!==`inactive`),s=`<option value="" class="!bg-slate-900 !text-slate-400">-- ব্যাংক নির্বাচন করুন --</option>`;a.forEach(e=>{e.name&&(s+=`<option value="${e.name}" class="!bg-slate-900 !text-slate-200 font-bold">${e.name}</option>`)}),window.cachedBanksHtml=s;let c=document.getElementById(`ledger-received-from`);if(c&&c.tagName===`SELECT`&&document.getElementById(`lbl-recv-from`)?.innerText.includes(`Bank`)){let e=c.value;c.innerHTML=s,c.value=e}}catch(e){console.error(`Error loading bank options:`,e)}}async function qn(){try{let e=await l.getAllCollectors(),t=await o.getAll(),n=new Set;t.forEach(e=>{e.receivedType===`Cash`&&e.receivedFrom&&n.add(e.receivedFrom.trim())}),n.add(`শোরুম ক্যাশ`),n.add(`ইফরাত`);let r=new Set(e.map(e=>e.name)),i=!1;for(let e of n)!r.has(e)&&e.length>0&&(await l.add({name:e,status:`active`}),i=!0);i&&(e=await l.getAllCollectors()),Gn=e;let a=e.filter(e=>e.status!==`inactive`),s=`<option value="" class="!bg-slate-900 !text-slate-400">-- ক্যাশ রিসিভার নির্বাচন করুন --</option>`;a.forEach(e=>{e.name&&(s+=`<option value="${e.name}" class="!bg-slate-900 !text-slate-200 font-bold">${e.name}</option>`)}),window.cachedCashHtml=s;let c=document.getElementById(`ledger-received-from`);if(c&&c.tagName===`SELECT`&&document.getElementById(`lbl-recv-from`)?.innerText.includes(`Cash`)){let e=c.value;c.innerHTML=s,c.value=e}}catch(e){console.error(`Error loading cash collectors:`,e)}}async function Jn(){let{value:e}=await H.default.fire({title:`<div class="flex items-center gap-2 font-bn text-white text-xl"><i class="fa-solid fa-building-columns text-blue-400"></i><span>নতুন ব্যাংক যোগ করুন</span></div>`,input:`text`,inputPlaceholder:`যেমন: City Bank (IFRAT), Prime Bank...`,showCancelButton:!0,confirmButtonText:`<i class="fa-solid fa-check mr-1.5"></i>সেভ করুন`,cancelButtonText:`বাতিল`,customClass:{popup:`!bg-slate-950 !text-white !rounded-3xl border border-slate-800 shadow-2xl font-bn`,confirmButton:`m3-btn-primary !bg-blue-600 hover:!bg-blue-500 !px-6 !py-2 !rounded-xl font-bold`,cancelButton:`m3-btn-tonal !bg-slate-800 hover:!bg-slate-700 !text-slate-300 !px-5 !py-2 !rounded-xl font-bold`},inputValidator:e=>!e||!e.trim()?`ব্যাংকের নাম লিখুন!`:null});if(e&&e.trim())try{let t=e.trim();await f.add({name:t,status:`active`}),O(`ADD_BANKING`,`Ledger`,`BankingSystem`,`Quick added Bank: ${t}`),K(`নতুন ব্যাংক সফলভাবে যুক্ত হয়েছে`,`success`),await Kn();let n=document.getElementById(`ledger-received-from`);n&&(n.value=t)}catch(e){G(e,`ব্যাংক সেভ করতে সমস্যা হয়েছে`)}}async function Yn(){let{value:e}=await H.default.fire({title:`<div class="flex items-center gap-2 font-bn text-white text-xl"><i class="fa-solid fa-user-gear text-emerald-400"></i><span>ক্যাশ গ্রহণকারী / সোর্স যোগ করুন</span></div>`,input:`text`,inputPlaceholder:`যেমন: ড্রাইভার শফিক, ম্যানেজার কালাম...`,showCancelButton:!0,confirmButtonText:`<i class="fa-solid fa-check mr-1.5"></i>সেভ করুন`,cancelButtonText:`বাতিল`,customClass:{popup:`!bg-slate-950 !text-white !rounded-3xl border border-slate-800 shadow-2xl font-bn`,confirmButton:`m3-btn-primary !bg-emerald-600 hover:!bg-emerald-500 !px-6 !py-2 !rounded-xl font-bold`,cancelButton:`m3-btn-tonal !bg-slate-800 hover:!bg-slate-700 !text-slate-300 !px-5 !py-2 !rounded-xl font-bold`},inputValidator:e=>!e||!e.trim()?`প্রাপক বা সোর্সের নাম লিখুন!`:null});if(e&&e.trim())try{let t=e.trim();await l.add({name:t,status:`active`}),O(`ADD_BANKING`,`Ledger`,`BankingSystem`,`Quick added Cash Collector: ${t}`),K(`ক্যাশ সোর্স সফলভাবে যুক্ত হয়েছে`,`success`),await qn();let n=document.getElementById(`ledger-received-from`);n&&(n.value=t)}catch(e){G(e,`ক্যাশ সোর্স সেভ করতে সমস্যা হয়েছে`)}}window.quickAddBank=Jn,window.quickAddCashCollector=Yn,window.quickEditBank=Xn,window.quickEditCashCollector=Zn;async function Xn(){let e=document.getElementById(`ledger-received-from`);if(!e||!e.value)return K(`দয়া করে আগে লিস্ট থেকে একটি ব্যাংক নির্বাচন করুন!`,`warning`);let t=e.value,n=Wn.find(e=>e.name===t);if(!n)return K(`ব্যাংকটি খুঁজে পাওয়া যায়নি!`,`error`);let{value:r}=await H.default.fire({title:`<div class="flex items-center gap-2 font-bn text-white text-xl"><i class="fa-solid fa-pen text-emerald-400"></i><span>ব্যাংকের নাম এডিট করুন</span></div>`,input:`text`,inputValue:t,showCancelButton:!0,confirmButtonText:`<i class="fa-solid fa-check mr-1.5"></i>আপডেট করুন`,cancelButtonText:`বাতিল`,customClass:{popup:`!bg-slate-950 !text-white !rounded-3xl border border-slate-800 shadow-2xl font-bn`,confirmButton:`m3-btn-primary !bg-emerald-600 hover:!bg-emerald-500 !px-6 !py-2 !rounded-xl font-bold`,cancelButton:`m3-btn-tonal !bg-slate-800 hover:!bg-slate-700 !text-slate-300 !px-5 !py-2 !rounded-xl font-bold`},inputValidator:e=>{if(!e||!e.trim())return`ব্যাংকের নাম খালি রাখা যাবে না!`;if(e.trim()===t)return`আপনি কোনো পরিবর্তন করেননি!`}});if(r)try{let e=r.trim();await f.update(n.id,{name:e});let i=await m.collection(`transactions`).where(`receivedType`,`==`,`Bank`).where(`receivedFrom`,`==`,t).get();for(let t=0;t<i.docs.length;t+=400){let n=m.batch();i.docs.slice(t,t+400).forEach(t=>{n.update(t.ref,{receivedFrom:e})}),await n.commit()}O(`GLOBAL_RENAME`,`Ledger`,`BankingSystem`,`Quick renamed Bank from ${t} to ${e} (${i.size} txns)`),K(`ব্যাংক আপডেট করা হয়েছে!`,`success`),await Kn();let a=document.getElementById(`ledger-received-from`);a&&(a.value=e)}catch(e){G(e,`ব্যাংক আপডেট করতে সমস্যা হয়েছে`)}}async function Zn(){let e=document.getElementById(`ledger-received-from`);if(!e||!e.value)return K(`দয়া করে আগে লিস্ট থেকে একটি ক্যাশ সোর্স নির্বাচন করুন!`,`warning`);let t=e.value,n=Gn.find(e=>e.name===t);if(!n)return K(`ক্যাশ সোর্স খুঁজে পাওয়া যায়নি!`,`error`);let{value:r}=await H.default.fire({title:`<div class="flex items-center gap-2 font-bn text-white text-xl"><i class="fa-solid fa-pen text-emerald-400"></i><span>ক্যাশ সোর্স এডিট করুন</span></div>`,input:`text`,inputValue:t,showCancelButton:!0,confirmButtonText:`<i class="fa-solid fa-check mr-1.5"></i>আপডেট করুন`,cancelButtonText:`বাতিল`,customClass:{popup:`!bg-slate-950 !text-white !rounded-3xl border border-slate-800 shadow-2xl font-bn`,confirmButton:`m3-btn-primary !bg-emerald-600 hover:!bg-emerald-500 !px-6 !py-2 !rounded-xl font-bold`,cancelButton:`m3-btn-tonal !bg-slate-800 hover:!bg-slate-700 !text-slate-300 !px-5 !py-2 !rounded-xl font-bold`},inputValidator:e=>{if(!e||!e.trim())return`নাম খালি রাখা যাবে না!`;if(e.trim()===t)return`আপনি কোনো পরিবর্তন করেননি!`}});if(r)try{let e=r.trim();await l.update(n.id,{name:e});let i=await m.collection(`transactions`).where(`receivedType`,`==`,`Cash`).where(`receivedFrom`,`==`,t).get();for(let t=0;t<i.docs.length;t+=400){let n=m.batch();i.docs.slice(t,t+400).forEach(t=>{n.update(t.ref,{receivedFrom:e})}),await n.commit()}O(`GLOBAL_RENAME`,`Ledger`,`BankingSystem`,`Quick renamed Cash Collector from ${t} to ${e} (${i.size} txns)`),K(`ক্যাশ সোর্স আপডেট করা হয়েছে!`,`success`),await qn();let a=document.getElementById(`ledger-received-from`);a&&(a.value=e)}catch(e){G(e,`ক্যাশ সোর্স আপডেট করতে সমস্যা হয়েছে`)}}function Qn(e,t,n={}){let{loadCustomersForDropdown:r,loadRecentTransactions:i,filterLedgerByCustomer:a}=n;e.innerHTML=`<div class="flex flex-col gap-5 font-bn">
        <div id="ledger-form-card" class="m3-card bg-slate-900/60 border border-slate-800/80 p-4 md:p-5 rounded-2xl shadow-xl flex flex-col gap-4">
            <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                <div class="flex items-center gap-3">
                    <div class="w-2 h-7 bg-purple-500 rounded-full shadow-[0_0_15px_rgba(168,85,247,0.5)]"></div>
                    <h2 class="text-xl md:text-2xl font-black text-white tracking-tight flex items-center gap-2">
                        <span>খতিয়ান</span> <span class="text-xs text-slate-400 uppercase font-bold">(Ledger)</span>
                        <button type="button" class="w-7 h-7 rounded-lg hover:bg-slate-800 flex items-center justify-center text-slate-500 hover:text-blue-400 transition-all cursor-pointer" onclick="window.loadRecentTransactions()" title="রিফ্রেশ"><i class="fa-solid fa-rotate text-xs"></i></button>
                        <button type="button" class="w-7 h-7 rounded-lg bg-purple-500/10 hover:bg-purple-500/20 text-purple-400 border border-purple-500/30 flex items-center justify-center transition-all cursor-pointer" onclick="window.showLedgerKeyboardGuide && window.showLedgerKeyboardGuide()" title="কীবোর্ড শর্টকাট গাইড (Alt+H)"><i class="fa-solid fa-keyboard text-xs"></i></button>
                    </h2>
                </div>
                <div class="flex items-center gap-2 w-full sm:w-auto justify-end">
                    <div id="live-due-calc" class="bg-slate-800/80 px-4 py-1.5 rounded-xl border border-slate-700 text-xs font-black text-blue-400">৳ ০</div>
                    <button class="h-9 px-3 rounded-xl bg-slate-800 border border-slate-700 hover:bg-slate-700 text-slate-300 text-xs font-bold transition-all flex items-center gap-1.5 shrink-0" onclick="window.exportTableToExcel('ledger-table', 'ledger-statement.xlsx')" title="এক্সেল ডাউনলোড"><i class="fa-solid fa-file-excel text-emerald-400"></i><span>এক্সেল</span></button>
                </div>
            </div>
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-3 items-end">
                <div class="lg:col-span-2 relative z-40">
                    <label class="m3-label text-slate-400 mb-1.5 block text-xs font-bold truncate">কাস্টমার খুঁজুন <span class="m3-label-sub text-[10px] opacity-70">(Customer Search)</span></label>
                    <div class="relative flex items-center">
                        <i class="fa-solid fa-magnifying-glass absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 text-xs pointer-events-none z-10"></i>
                        <input type="text" id="ledger-cust-search-input" class="w-full bg-slate-950/90 border border-slate-700/70 rounded-xl h-10 pr-20 text-xs text-white font-bold outline-none focus:border-purple-500 shadow-inner transition-all" style="padding-left: 48px !important;" placeholder="কাস্টমার নাম, ফোন বা অ্যাকাউন্ট টাইপ করুন..." oninput="window.filterLedgerCustomerSearch(this.value)" onfocus="window.filterLedgerCustomerSearch(this.value)">
                        <div class="absolute right-1.5 flex items-center gap-1">
                            <button type="button" id="ledger-cust-search-clear" class="hidden w-5 h-5 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white text-[10px] flex items-center justify-center cursor-pointer transition-all" onclick="window.clearLedgerCustomerSearch()"><i class="fa-solid fa-xmark"></i></button>
                            <button type="button" class="h-7 px-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-[10px] font-bold flex items-center gap-1 shadow-md cursor-pointer" onclick="window.quickAddCustomer()" title="নতুন কাস্টমার যোগ করুন"><i class="fa-solid fa-plus text-[9px]"></i><span>নতুন</span></button>
                        </div>
                    </div>
                    <select id="ledger-customer-select" class="hidden" onchange="window.filterLedgerByCustomer(this.value)"></select>
                    <div id="ledger-cust-dropdown" class="hidden absolute left-0 right-0 top-full mt-1.5 bg-slate-900 border border-slate-700/90 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.9)] z-[999] max-h-64 overflow-y-auto custom-scrollbar p-1.5 flex flex-col gap-1 backdrop-blur-2xl"></div>
                </div>
                <div class="relative hide-for-boss">
                    <label class="m3-label text-slate-400 mb-1.5 block text-xs font-bold truncate">তারিখ <span class="m3-label-sub text-[10px] opacity-70">(Date)</span></label>
                    <input type="text" id="ledger-date" class="m3-field py-1 bg-slate-950/80 h-10 text-xs datepicker">
                </div>
                <div class="relative hide-for-boss">
                    <label class="m3-label text-slate-400 mb-1.5 block text-xs font-bold truncate">ভাউচার <span class="m3-label-sub text-[10px] opacity-70">(Voucher)</span></label>
                    <input type="text" id="ledger-voucher" class="m3-field py-1 bg-slate-950/80 h-10 text-xs">
                </div>
                <div class="flex flex-col relative hide-for-boss">
                    <label class="m3-label text-red-400 mb-1.5 block text-xs font-bold truncate">বিল <span class="m3-label-sub text-[10px] opacity-70">(Debit)</span></label>
                    <input type="text" id="ledger-bill" oninput="window.handleNumberInput(this); window.updateLedgerLiveText(); window.updateLiveWords(this, 'ledger-bill-words');" class="m3-field py-1 text-base font-black text-red-400 bg-slate-950/80 h-10 !border-red-500 focus:!border-red-400 focus:!ring-red-500/30">
                    <div id="ledger-bill-words" class="text-[10px] font-black text-red-400 mt-1 hidden italic truncate"></div>
                </div>
                <div class="flex flex-col relative hide-for-boss">
                    <label class="m3-label text-emerald-400 mb-1.5 block text-xs font-bold truncate">জমা <span class="m3-label-sub text-[10px] opacity-70">(Credit)</span></label>
                    <input type="text" id="ledger-paid" oninput="window.handleNumberInput(this); window.updateLedgerLiveText(); window.toggleReceivedSection(); window.updateLiveWords(this, 'ledger-paid-words');" class="m3-field py-1 text-base font-black text-emerald-400 bg-slate-950/80 h-10 !border-emerald-500 focus:!border-emerald-400 focus:!ring-emerald-500/30">
                    <div id="ledger-paid-words" class="text-[10px] font-black text-emerald-400 mt-1 hidden italic truncate"></div>
                </div>
            </div>
            <div id="received-section" class="hidden grid grid-cols-1 md:grid-cols-2 gap-3 pt-3 border-t border-slate-800/60 hide-for-boss">
                <div>
                    <div class="flex items-center justify-between mb-1">
                        <label class="m3-label text-emerald-400 text-xs font-bold">পেমেন্ট মাধ্যম</label>
                        <div class="flex items-center gap-1">
                            <button type="button" onclick="window.quickSelectPaymentAccount('Bank', 'OneBank (IFRAT)')" class="text-[9px] font-bold text-blue-400 bg-blue-500/10 hover:bg-blue-500/20 border border-blue-500/30 px-1.5 py-0.5 rounded-lg transition-all flex items-center gap-1 cursor-pointer" title="OneBank (Alt+1)"><span>OneBank</span><kbd class="text-[8px] bg-slate-900 px-1 rounded text-slate-400 font-mono">Alt+1</kbd></button>
                            <button type="button" onclick="window.quickSelectPaymentAccount('Bank', 'IBBL (IFRAT)')" class="text-[9px] font-bold text-blue-400 bg-blue-500/10 hover:bg-blue-500/20 border border-blue-500/30 px-1.5 py-0.5 rounded-lg transition-all flex items-center gap-1 cursor-pointer" title="IBBL (Alt+2)"><span>IBBL</span><kbd class="text-[8px] bg-slate-900 px-1 rounded text-slate-400 font-mono">Alt+2</kbd></button>
                            <button type="button" onclick="window.quickSelectPaymentAccount('Cash', 'শোরুম ক্যাশ')" class="text-[9px] font-bold text-emerald-400 bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 px-1.5 py-0.5 rounded-lg transition-all flex items-center gap-1 cursor-pointer" title="শোরুম ক্যাশ (Alt+3)"><span>ক্যাশ</span><kbd class="text-[8px] bg-slate-900 px-1 rounded text-slate-400 font-mono">Alt+3</kbd></button>
                        </div>
                    </div>
                    <div class="flex bg-slate-950 rounded-xl border border-slate-700 h-9 p-1 gap-1">
                        <button type="button" id="recv-bank-btn" onclick="window.setReceivedType('Bank')" class="flex-1 text-[10px] font-bold bg-blue-600 text-white rounded-lg">Bank</button>
                        <button type="button" id="recv-cash-btn" onclick="window.setReceivedType('Cash')" class="flex-1 text-[10px] font-bold text-slate-400 rounded-lg">Cash</button>
                        <button type="button" id="recv-less-btn" onclick="window.setReceivedType('Less')" class="flex-1 text-[10px] font-bold text-slate-400 rounded-lg">Less</button>
                    </div>
                </div>
                <div>
                    <label id="lbl-recv-from" class="m3-label text-emerald-400">ব্যাংক অ্যাকাউন্ট (Bank Name)</label>
                    <div class="flex gap-1.5 items-center" id="recv-input-wrapper">
                        <select id="ledger-received-from" class="m3-field py-1 text-xs bg-slate-950/80 h-9 flex-1 cursor-pointer">
                            <option value="">-- নির্বাচন করুন --</option>
                        </select>
                        <button type="button" id="btn-quick-add-recv" onclick="window.quickAddBank && window.quickAddBank()" class="w-9 h-9 bg-blue-600/20 hover:bg-blue-600 text-blue-400 hover:text-white border border-blue-500/30 rounded-xl transition-all flex items-center justify-center shrink-0 cursor-pointer" title="নতুন যোগ করুন">
                            <i class="fa-solid fa-plus text-xs"></i>
                        </button>
                    </div>
                </div>
            </div>
            <div class="flex justify-end pt-2 hide-for-boss"><button class="m3-btn-primary rounded-xl h-10 px-8 text-xs font-bold shadow-md shadow-blue-600/20" id="save-txn-btn" onclick="window.saveTransaction()">এন্ট্রি সেভ করুন</button></div>
        </div>
        <div class="desktop-only m3-table-container clusterize-scroll" id="ledger-scroll-area" style="max-height: 60vh;">
            <table id="ledger-table" class="m3-table min-w-[900px]">
                <thead><tr class="font-bn"><th>তারিখ</th><th>বিবরণ / ভাউচার</th><th class="text-right">বিল (Debit)</th><th class="text-right">জমা (Credit)</th><th class="text-right text-blue-400">অবশিষ্ট (Balance)</th><th class="text-center sticky-action-col">অ্যাকশন</th></tr></thead>
                <tbody id="ledger-list" class="font-bn clusterize-content"></tbody>
                <tfoot id="ledger-tfoot"></tfoot>
            </table>
        </div>
        <div id="ledger-list-mobile" class="mobile-only mobile-card-container font-bn"><div class="text-center py-10 text-slate-500 font-bold italic">ডাটা লোড হচ্ছে...</div></div>
        <div id="ledger-mobile-sticky-bar" class="mobile-only hidden fixed bottom-4 left-4 right-4 z-40 bg-slate-950/90 border border-slate-800 backdrop-blur-xl shadow-2xl rounded-2xl p-3 flex items-center justify-between font-bn"></div>
        <div id="ledger-pagination" class="flex items-center justify-center gap-4 py-4 font-bn hidden">
            <button id="prev-page" class="px-4 py-2 bg-slate-800 text-slate-300 rounded-xl" onclick="window.changeLedgerPage('prev')">পূর্ববর্তী</button>
            <div class="text-white font-bold bg-blue-600/10 border border-blue-500/30 px-4 py-2 rounded-xl">পৃষ্ঠা: <span id="current-page-display">1</span></div>
            <button id="next-page" class="px-4 py-2 bg-slate-800 text-slate-300 rounded-xl" onclick="window.changeLedgerPage('next')">পরবর্তী</button>
        </div>
    </div>`,document.getElementById(`ledger-date`).value=R(),r&&r(),Kn(),qn(),window.initLedgerHotkeys&&window.initLedgerHotkeys(),t&&t.customerId?setTimeout(()=>{if(window.selectLedgerCustomer)window.selectLedgerCustomer(t.customerId);else if(a){let e=document.getElementById(`ledger-customer-select`);e&&(e.value=t.customerId),a(t.customerId)}},150):i&&i()}function $n(){let e=I(document.getElementById(`ledger-bill`)?.value||`0`),t=I(document.getElementById(`ledger-paid`)?.value||`0`),n=document.getElementById(`ledger-customer-select`),r=document.getElementById(`live-due-calc`);if(r)if(n&&n.selectedIndex>0){let i=L((parseFloat(n.options[n.selectedIndex].dataset.due)||0)+e-t);r.innerText=`বকেয়া: ৳ ${F(Math.abs(i))} ${i<0?`(অ্যাড)`:``}`,r.className=i>0?`bg-red-500/10 text-red-400 border border-red-500/20 px-4 py-1.5 rounded-xl text-xs font-black`:`bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-4 py-1.5 rounded-xl text-xs font-black`}else r.innerText=`৳ ০`,r.className=`bg-slate-800/80 px-4 py-1.5 rounded-xl border border-slate-700 text-xs font-black text-blue-400 shadow-inner font-bn`}function er(e,t,n={},r=null){if(!t)return{finalRunning:0};let i=document.getElementById(`ledger-list-mobile`),a=document.getElementById(`ledger-tfoot`),o=document.getElementById(`ledger-customer-select`),s=o&&o.selectedIndex>0,c=[],l=``,u=0,d=0,f=[];n.currentLedgerTxns&&(n.currentLedgerTxns.length=0),e&&n.currentLedgerTxns?.push(...e),n.currentLedgerTxnsMap&&Object.keys(n.currentLedgerTxnsMap).forEach(e=>delete n.currentLedgerTxnsMap[e]);let p=J()||[],m=0;if(s){let t=o.value,n=p.find(e=>e.id===t);m=Number(r??(n?.totalDue||0)),e.forEach((e,t)=>{f[t]=m,m=L(m-((Number(e.bill)||0)-(Number(e.paid)||0)))})}if((e||[]).forEach((e,t)=>{let r=String(N?.currentUserRole||``).toLowerCase()===`boss`,i=String(N?.currentUserRole||``).toLowerCase()===`admin`,a=!r&&(i||N?.permissions?.editLedger!==!1&&N?.permissions?.manageLedger!==!1),o=!r&&(i||N?.permissions?.deleteLedger===!0),m=s?f[t]:Number(e.currentDue)||0,h=Number(e.bill)||0,g=Number(e.paid)||0;u+=h,d+=g;let _=String(e.id||``),v=String(e.customerId||``),y=p.find(e=>e.id===v);_&&n.currentLedgerTxnsMap&&(n.currentLedgerTxnsMap[_]={...e,phone:y?.phone||e.phone||``,customerName:e.customerName||y?.name||`Customer`,calculatedDue:m});let b=``;if(g>0){let t=e.receivedType||`Bank`,n=(e.receivedFrom||``).trim(),r=n?`${t}: ${n}`:t;b=t===`Bank`?`<span class="inline-flex items-center gap-1 text-[10px] font-black text-blue-400 bg-blue-500/10 border border-blue-500/20 px-2 py-0.5 rounded-lg ml-2" title="${r}"><i class="fa-solid fa-building-columns text-[9px]"></i><span>${r}</span></span>`:t===`Less`?`<span class="inline-flex items-center gap-1 text-[10px] font-black text-purple-400 bg-purple-500/10 border border-purple-500/20 px-2 py-0.5 rounded-lg ml-2" title="${r}"><i class="fa-solid fa-tag text-[9px]"></i><span>${r}</span></span>`:`<span class="inline-flex items-center gap-1 text-[10px] font-black text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-lg ml-2" title="${r}"><i class="fa-solid fa-hand-holding-dollar text-[9px]"></i><span>${r}</span></span>`}let x=(e.receivedFrom||``).replace(/'/g,`\\'`),S=(e.receivedType||``).replace(/'/g,`\\'`),C=``,w=``;if(e.createdAt)try{let t=e.createdAt.toDate?e.createdAt.toDate():e.createdAt.toMillis?new Date(e.createdAt.toMillis()):new Date(e.createdAt);isNaN(t.getTime())||(C=t.toLocaleTimeString(`en-US`,{hour:`numeric`,minute:`2-digit`,hour12:!0}),w=`${t.toLocaleDateString(`en-GB`)} ${C}`)}catch(e){console.error(`Time parsing error:`,e)}let T=y?.address||e.address||``;c.push(`<tr class="hover:bg-white/[0.03] transition-colors border-b border-slate-800/50">
            <td class="py-2.5 px-3 text-xs font-bold text-slate-200 whitespace-nowrap align-top">
                <div>${B(e.date)}</div>
                ${C?`<div class="text-[10px] text-slate-400 font-medium mt-0.5 flex items-center gap-1.5 cursor-help" title="আসল এন্ট্রির সময়: ${w}"><i class="fa-regular fa-clock text-[9px] text-slate-500"></i><span>${C}</span></div>`:``}
            </td>
            <td class="font-bold text-slate-200 text-xs align-top py-2.5">
                <div class="flex items-center flex-wrap gap-1">
                    <span>${e.customerName||y?.name||`Unknown`}</span>
                    ${b}
                </div>
                ${T?`<div class="text-[9px] text-slate-400 font-normal mt-0.5 truncate max-w-[220px] flex items-center gap-1" title="${T}"><i class="fa-solid fa-location-dot text-[8px] text-slate-500"></i><span>${T}</span></div>`:``}
                <div class="flex items-center gap-1.5 mt-0.5">${e.voucherNo?`<span class="text-[9px] text-blue-400 font-black">#${e.voucherNo}</span>`:``}${e.notes?`<span class="text-[9px] text-slate-500 font-medium italic truncate max-w-[180px]" title="${e.notes}">• ${e.notes}</span>`:``}</div>
            </td>
            <td class="text-right text-red-400 font-black text-sm align-top py-2.5">৳${F(h)}</td>
            <td class="text-right text-emerald-400 font-black text-sm align-top py-2.5">৳${F(g)}</td>
            <td class="text-right text-white font-black text-base bg-white/[0.02] border-l border-slate-800/50 align-top py-2.5">৳${F(Math.abs(m))}<div class="text-[9px] uppercase font-bold ${m>0?`text-red-400`:`text-emerald-400`}">${m>0?`Due`:`Adv`}</div></td>
            <td class="text-center sticky-action-col align-top py-2.5"><div class="flex items-center justify-center gap-1.5">
                <button class="m3-btn-icon" onclick="window.sendTxnWhatsApp('${_}')" title="WhatsApp বার্তা পাঠান"><i class="fa-brands fa-whatsapp text-emerald-400"></i></button>
                <button class="m3-btn-icon" onclick="window.sendTxnSMS('${_}')" title="ট্রানজেকশন SMS পাঠান"><i class="fa-solid fa-comment-sms text-blue-400"></i></button>
                ${a?`<button class="m3-btn-icon" onclick="window.editTransaction('${_}', '${v}', '${e.date}', '${e.voucherNo||``}', ${h}, ${g}, '${S}', '${x}')" title="এডিট"><i class="fa-solid fa-pen-to-square text-amber-400"></i></button>`:``}
                ${o?`<button class="m3-btn-icon" onclick="window.deleteTransaction('${_}', '${v}', ${h}, ${g})" title="ডিলেট"><i class="fa-solid fa-trash-can text-red-400"></i></button>`:``}
                <button class="m3-btn-icon" onclick="window.choosePrintType('${_}')" title="প্রিন্ট"><i class="fa-solid fa-print text-emerald-400"></i></button>
            </div></td>
        </tr>`),l+=`<div class="mobile-card">
            <div class="mobile-card-header">
                <div>
                    <div class="mobile-card-title">${e.customerName||y?.name||`Unknown`}</div>
                    ${T?`<div class="text-[10px] text-slate-400 font-normal flex items-center gap-1 mt-0.5"><i class="fa-solid fa-location-dot text-[9px] text-slate-500"></i><span>${T}</span></div>`:``}
                    <div class="mobile-card-sub text-blue-400 font-bold mt-0.5">${e.voucherNo?`#`+e.voucherNo:B(e.date)}${C?` <span title="আসল এন্ট্রির সময়: ${w}" class="cursor-help">(${C})</span>`:``} ${b}</div>
                </div>
                <div class="text-right"><div class="text-white font-black text-base">৳ ${F(Math.abs(m))}</div><span class="inline-block text-[9px] uppercase font-bold ${m>0?`text-red-400`:`text-emerald-400`}">${m>0?`Due`:`Adv`}</span></div>
            </div>
            <div class="mobile-card-row"><span class="mobile-card-label">বিল (Debit):</span><span class="mobile-card-value text-red-400 font-bold">৳ ${F(h)}</span></div>
            <div class="mobile-card-row"><span class="mobile-card-label">জমা (Credit):</span><span class="mobile-card-value text-emerald-400 font-bold">৳ ${F(g)}</span></div>
            <div class="mobile-card-actions">
                <button class="m3-btn-icon" onclick="window.sendTxnWhatsApp('${_}')" title="WhatsApp বার্তা পাঠান"><i class="fa-brands fa-whatsapp text-emerald-400"></i></button>
                <button class="m3-btn-icon" onclick="window.sendTxnSMS('${_}')" title="ট্রানজেকশন SMS পাঠান"><i class="fa-solid fa-comment-sms text-blue-400"></i></button>
                ${a?`<button class="m3-btn-icon" onclick="window.editTransaction('${_}', '${v}', '${e.date}', '${e.voucherNo||``}', ${h}, ${g}, '${S}', '${x}')" title="এডিট"><i class="fa-solid fa-pen-to-square text-amber-400"></i></button>`:``}
                ${o?`<button class="m3-btn-icon" onclick="window.deleteTransaction('${_}', '${v}', ${h}, ${g})" title="ডিলেট"><i class="fa-solid fa-trash-can text-red-400"></i></button>`:``}
                <button class="m3-btn-icon" onclick="window.choosePrintType('${_}')" title="প্রিন্ট"><i class="fa-solid fa-print text-emerald-400"></i></button>
            </div>
        </div>`}),t.id===`recent-txn-list`){t.innerHTML=c.length>0?c.join(``):`<tr><td colspan="5" class="text-center py-8 text-slate-600 italic">কোনো লেনদেন পাওয়া যায়নি</td></tr>`;let e=document.getElementById(`recent-txn-list-mobile`);e&&(e.innerHTML=l||`<div class="text-center py-8 text-slate-500 font-bold italic">কোনো লেনদেন পাওয়া যায়নি</div>`);return}let h=document.getElementById(`ledger-scroll-area`),g=document.getElementById(`ledger-list`);if(window.ledgerClusterize){try{window.ledgerClusterize.destroy()}catch(e){console.warn(`Ledger clusterize destroy error:`,e)}window.ledgerClusterize=null}if(c.length>0)if(h&&g)try{window.ledgerClusterize=new Kt.default({rows:c,scrollId:`ledger-scroll-area`,contentId:`ledger-list`})}catch(e){console.warn(`Ledger clusterize init failed, falling back to innerHTML:`,e),t.innerHTML=c.join(``)}else t.innerHTML=c.join(``);else t.innerHTML=`<tr><td colspan="6" class="text-center py-12 text-slate-600 italic">কোনো লেনদেন পাওয়া যায়নি</td></tr>`;i&&(i.innerHTML=l||`<div class="text-center py-10 text-slate-500 font-bold italic">কোনো লেনদেন পাওয়া যায়নি</div>`),a&&(a.innerHTML=`<tr class="bg-slate-900/90 font-black border-t-2 border-blue-500/40"><td colspan="2" class="text-right text-slate-300 py-3">পৃষ্ঠা মোট (Page Total):</td><td class="text-right text-red-400">৳ ${F(u)}</td><td class="text-right text-emerald-400">৳ ${F(d)}</td><td class="text-right text-white">৳ ${F(Math.abs(u-d))}</td><td></td></tr>`);let _=document.getElementById(`ledger-mobile-sticky-bar`);if(_)if(s&&(e||[]).length>0){let e=f[0],t=e>0,n=F(Math.abs(e));_.innerHTML=`
                <div class="flex items-center gap-2.5">
                    <div class="w-8 h-8 rounded-xl ${t?`bg-red-500/10 border border-red-500/20 text-red-400`:`bg-emerald-500/10 border border-emerald-500/20 text-emerald-400`} flex items-center justify-center font-black text-xs shrink-0">
                        <i class="fa-solid ${t?`fa-receipt`:`fa-hand-holding-dollar`}"></i>
                    </div>
                    <div>
                        <div class="text-[9px] text-slate-400 font-bold uppercase tracking-wider">${t?`বর্তমান বকেয়া`:`অ্যাডভান্স জমা`}</div>
                        <div class="text-sm font-black ${t?`text-red-400`:`text-emerald-400`}">৳ ${n}</div>
                    </div>
                </div>
                <div class="flex items-center gap-2">
                    <button class="h-8 px-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs active:scale-95 transition-all flex items-center gap-1 cursor-pointer" onclick="window.openCustomerStatement('${o.value}')">
                        <i class="fa-solid fa-file-invoice"></i><span>মেমো</span>
                    </button>
                </div>`,_.classList.remove(`hidden`)}else _.classList.add(`hidden`);return{finalRunning:m,runningBalances:f}}async function tr(e={},t={}){let r=document.getElementById(`save-txn-btn`),i=document.getElementById(`ledger-customer-select`);if(!i||!i.value)return H.default.fire(`Error`,`কাস্টমার সিলেক্ট করুন`,`error`);let s=i.value,c=i.options[i.selectedIndex].text.replace(/\s*\([^)]*\)\s*$/,``).trim(),l=z(document.getElementById(`ledger-date`).value),u=document.getElementById(`ledger-voucher`).value.trim(),d=I(document.getElementById(`ledger-bill`).value),f=I(document.getElementById(`ledger-paid`).value);if(d===0&&f===0)return H.default.fire(`Error`,`বিল বা জমা দিন`,`error`);r&&(r.disabled=!0,r.innerText=`প্রসেসিং...`);let p=``,h=``;if(f>0){let e=document.getElementById(`recv-cash-btn`);p=document.getElementById(`recv-less-btn`)?.classList.contains(`bg-blue-600`)?`Less`:e?.classList.contains(`bg-blue-600`)?`Cash`:`Bank`,h=document.getElementById(`ledger-received-from`)?.value?.trim()||``}if(!(await H.default.fire({title:`<div class="flex items-center justify-center gap-2 font-bn font-black text-xl text-white"><i class="fa-solid fa-file-shield text-blue-400"></i><span>লেনদেন যাচাই করুন</span></div>`,html:`
            <div class="text-left space-y-3 font-bn p-3.5 bg-slate-900/90 rounded-2xl border border-slate-800 shadow-inner">
                <div class="flex flex-col gap-1 border-b border-slate-800/80 pb-2">
                    <span class="text-[10px] text-blue-400 font-black uppercase tracking-wider">কাস্টমারের নাম</span>
                    <span class="text-base text-white font-black">${c}</span>
                </div>
                <div class="grid grid-cols-2 gap-4 border-b border-slate-800/80 pb-2">
                    <div class="flex flex-col gap-1"><span class="text-[10px] text-blue-400 font-black uppercase tracking-wider">তারিখ</span><span class="text-sm text-slate-200 font-bold font-mono">${B(l)}</span></div>
                    <div class="flex flex-col gap-1"><span class="text-[10px] text-amber-400 font-black uppercase tracking-wider">ভাউচার / মেমো নং</span><span class="text-sm text-amber-400 font-bold font-mono">${u||`-`}</span></div>
                </div>
                <div class="grid grid-cols-2 gap-4 border-b border-slate-800/80 pb-2">
                    <div class="flex flex-col gap-1"><span class="text-[10px] text-blue-400 font-black uppercase tracking-wider">বিল / কেনাকাটা</span><span class="text-lg text-blue-400 font-black font-mono">৳ ${F(d)}</span></div>
                    <div class="flex flex-col gap-1"><span class="text-[10px] text-emerald-400 font-black uppercase tracking-wider">জমা প্রাপ্তি</span><span class="text-lg text-emerald-400 font-black font-mono">৳ ${F(f)}</span></div>
                </div>
                ${f>0?`<div class="flex flex-col gap-1 border-b border-slate-800/80 pb-2"><span class="text-[10px] text-purple-400 font-black uppercase tracking-wider">পেমেন্ট মাধ্যম</span><span class="text-xs text-purple-300 font-bold">${p} ${h?`(`+h+`)`:``}</span></div>`:``}
            </div>
            <p class="text-xs text-amber-400 font-bold mt-3 text-center">সব তথ্য সঠিক থাকলে "কনফার্ম করুন" বাটনে ক্লিক করুন।</p>
        `,showCancelButton:!0,confirmButtonText:`<i class="fa-solid fa-circle-check mr-2"></i>কনফার্ম করুন`,cancelButtonText:`<i class="fa-solid fa-pen-to-square mr-2"></i>সংশোধন করব`,customClass:{popup:`!bg-slate-950 !text-white !rounded-3xl border border-slate-800 shadow-2xl font-bn`,confirmButton:`m3-btn-primary !bg-blue-600 hover:!bg-blue-500 !px-7 !py-2.5 !rounded-xl font-bold shadow-lg shadow-blue-600/30`,cancelButton:`m3-btn-tonal !bg-slate-800 hover:!bg-slate-700 !text-slate-300 !px-5 !py-2.5 !rounded-xl font-bold border border-slate-700`}})).isConfirmed){r&&(r.disabled=!1,r.innerText=`এন্ট্রি সেভ করুন`);return}try{let r=J().find(e=>e.id===s);try{let e=await a.getById(s);e&&(r=e)}catch(e){console.warn(`Live fetch failed`,e)}let i=r&&Number(r.totalDue)||0,_=m.batch(),v=L(d-f),y=v;if(e.id){let t=L((e.oldBill||0)-(e.oldPaid||0)),r=e.oldCid||s;if(r!==s)_.update(o.getRef(e.id),{customerId:s,customerName:c,date:l,voucherNo:u,bill:L(d),paid:L(f),receivedType:p,receivedFrom:h,currentDue:L(i+v)}),_.update(a.getRef(r),{totalDue:n.firestore.FieldValue.increment(-t)}),_.update(a.getRef(s),{totalDue:n.firestore.FieldValue.increment(v)}),y=v;else{let r=L(v-t);y=r,_.update(o.getRef(e.id),{date:l,voucherNo:u,bill:L(d),paid:L(f),receivedType:p,receivedFrom:h,currentDue:n.firestore.FieldValue.increment(r)}),_.update(a.getRef(s),{totalDue:n.firestore.FieldValue.increment(r)})}O(`UPDATE`,`Ledger`,e.id,c,{oldBill:e.oldBill,oldPaid:e.oldPaid,newBill:d,newPaid:f}),e.id=null,e.oldCid=null}else{let e=o.getRef();_.set(e,{customerId:s,customerName:c,date:l,voucherNo:u,bill:L(d),paid:L(f),receivedType:p,receivedFrom:h,prevDue:L(i),currentDue:L(i+v),createdBy:N?.currentUserEmail||`Unknown`,createdAt:n.firestore.FieldValue.serverTimestamp()}),_.update(a.getRef(s),{totalDue:n.firestore.FieldValue.increment(v)}),O(`CREATE`,`Ledger`,e.id,c,{bill:d,paid:f,type:p||`Bill`})}let b=L(i+y);await _.commit(),K(`লেনদেন সফলভাবে সেভ হয়েছে!`,`success`);try{let e=J().find(e=>e.id===s),t=e?.phone;if(t&&t.trim()!==``&&t!==`-`){let n=await g.getAppSettings(),r=B(l),i=(typeof window.toBanglishName==`function`?window.toBanglishName(c):c)||`Customer`,a=n.shopName?typeof window.toBanglishName==`function`?window.toBanglishName(n.shopName):n.shopName:`M/S. Maa Motors`,o=F(Math.abs(b)),s=e?.accountNo||``,m=s?`(A/C: ${s})`:``,h=``;if(d>0)h=(n.smsTemplateNew||`Dear [Name] [AccNo], Memo #[Memo] of Tk [Bill] created on [Date]. Paid: Tk [Paid], Due: Tk [Due]. Thanks! - [Shop]`).replace(/\[Name\]/g,i).replace(/\[AccNo\]/g,m).replace(/\[Shop\]/g,a).replace(/\[Date\]/g,r).replace(/\[Memo\]/g,u||`1`).replace(/\[Bill\]/g,F(d)).replace(/\[Paid\]/g,F(f)).replace(/\[Due\]/g,o);else{let e=n.smsTemplatePaid||`We have received your payment of Tk [Paid] on [Date]. Your updated due is Tk [Due]. Thank you for staying with us! - [Shop]`;h=e.replace(/\[Name\]/g,i).replace(/\[AccNo\]/g,m).replace(/\[Shop\]/g,a).replace(/\[Date\]/g,r).replace(/\[Paid\]/g,F(f)).replace(/\[Type\]/g,p||`Cash`).replace(/\[Due\]/g,o),e.indexOf(`[Date]`)===-1&&r&&(h=h.replace(/ - [^-]+$/,` (${r})$&`))}h=h.replace(/\s+/g,` `);let{value:_,isConfirmed:v}=await H.default.fire({title:`<div class="flex flex-col items-center gap-2"><i class="fa-solid fa-comment-sms text-emerald-400 text-3xl mb-1"></i><span class="font-bn font-black text-xl text-white">Transaction SMS Preview</span></div>`,html:`<div class="text-left space-y-2 mb-2 font-bn">
                            <p class="text-[13px] text-slate-300">কাস্টমারকে কি লেনদেনের মেসেজ পাঠাতে চান? চাইলে নিচের লেখা এডিট করতে পারেন:</p>
                            <div class="flex justify-between items-center"><div class="text-xs text-slate-400">Recipient Phone: <strong class="text-white">${t}</strong></div><div id="sms-txn-char-counter" class="text-[11px] font-bold text-emerald-400 text-right">${U(h)}</div></div>
                           </div>`,input:`textarea`,inputValue:h,inputAttributes:{rows:4,class:`m3-field text-xs font-mono !mt-0`},showCancelButton:!0,confirmButtonText:`<i class="fa-solid fa-paper-plane mr-1.5"></i> পাঠিয়ে দিন`,cancelButtonText:`স্কিপ করুন`,customClass:{popup:`!bg-slate-950 !text-white !rounded-3xl border border-slate-700 shadow-2xl`,confirmButton:`m3-btn-primary !bg-emerald-600 hover:!bg-emerald-500 !px-7 !py-2.5 !rounded-xl font-bold shadow-lg shadow-emerald-600/30`,cancelButton:`m3-btn-tonal !bg-slate-800 hover:!bg-slate-700 !text-slate-300 !px-5 !py-2.5 !rounded-xl font-bold border border-slate-700`},didOpen:()=>{let e=H.default.getInput(),t=document.getElementById(`sms-txn-char-counter`),n=()=>{e&&t&&(t.innerText=U(e.value))};e&&(e.oninput=n,n(),setTimeout(()=>e.focus(),150))}});v&&_&&await De(t,_,!1)&&K(`এসএমএস সফলভাবে পাঠানো হয়েছে`,`success`)}}catch(e){console.warn(`Transaction SMS dispatch error:`,e)}document.getElementById(`ledger-bill`).value=``,document.getElementById(`ledger-paid`).value=``,Ee(`ledger-bill-words`),Ee(`ledger-paid-words`);let x=document.getElementById(`ledger-voucher`);x&&(x.value=``);let S=document.getElementById(`ledger-received-from`);S&&(S.value=``),t.filterLedgerByCustomer&&t.filterLedgerByCustomer(s),setTimeout(()=>{document.getElementById(`ledger-bill`)?.focus()},150)}catch(e){G(e,`লেনদেন সেভ করতে ব্যর্থ`)}finally{r&&(r.disabled=!1,r.innerText=`এন্ট্রি সেভ করুন`,r.className=`m3-btn-primary rounded-xl h-10 px-8 text-xs font-bold shadow-md shadow-blue-600/20`)}}async function nr(e,t,n,r,i,a,o,s,c={}){if(!await W(`খতিয়ান এডিট (Authorization)`))return;c.id=e,c.oldCid=t,c.oldBill=i,c.oldPaid=a,document.getElementById(`ledger-customer-select`)&&(document.getElementById(`ledger-customer-select`).value=t),document.getElementById(`ledger-date`)&&(document.getElementById(`ledger-date`).value=n),document.getElementById(`ledger-voucher`)&&(document.getElementById(`ledger-voucher`).value=r),document.getElementById(`ledger-bill`)&&(document.getElementById(`ledger-bill`).value=i),document.getElementById(`ledger-paid`)&&(document.getElementById(`ledger-paid`).value=a),window.setReceivedType&&window.setReceivedType(o),document.getElementById(`ledger-received-from`)&&(document.getElementById(`ledger-received-from`).value=s),window.updateLedgerLiveText&&window.updateLedgerLiveText(),window.toggleReceivedSection&&window.toggleReceivedSection();let l=document.getElementById(`save-txn-btn`);l&&(l.innerHTML=`<i class="fa-solid fa-pen-to-square mr-1.5"></i>আপডেট সংশোধন করুন`,l.className=`m3-btn-primary rounded-xl h-10 px-8 text-xs font-bold shadow-md !bg-amber-600 hover:!bg-amber-500`);let u=document.getElementById(`view-container`),d=document.getElementById(`ledger-form-card`)||document.getElementById(`ledger-customer-select`);u&&u.scrollTo({top:0,behavior:`smooth`}),d&&d.scrollIntoView({behavior:`smooth`,block:`start`}),setTimeout(()=>{let e=document.getElementById(`ledger-bill`);e&&(e.focus(),e.select&&e.select())},350)}async function rr(e,t,r,i,s={}){if(await W(`Delete`))try{H.default.fire({title:`ডিলিট হচ্ছে...`,allowOutsideClick:!1,didOpen:()=>H.default.showLoading()});let c=await o.getById(e);if(!c)throw Error(`Transaction not found`);let l=m.batch();l.update(a.getRef(t),{totalDue:n.firestore.FieldValue.increment(L(i-r))}),l.set(m.collection(`recycle_bin`).doc(e),{module:`Transaction`,data:c,deletedAt:n.firestore.FieldValue.serverTimestamp(),deletedBy:window.AppState?.currentUserEmail||`Unknown`}),l.delete(o.getRef(e)),await l.commit(),O(`DELETE`,`Ledger`,e,c.customerName||t,{bill:r,paid:i,action:`Soft Delete to Recycle Bin`}),K(`ভাউচার রিসাইকেল বিনে মুভ করা হয়েছে!`,`info`),H.default.close(),s.filterLedgerByCustomer&&s.filterLedgerByCustomer(t)}catch(e){console.error(`deleteTransaction error:`,e),H.default.fire(`ত্রুটি`,`ভাউচার ডিলিট করা সম্ভব হয়নি।`,`error`)}}async function ir(e,t,n,r,i,s,c,l,u={}){if(await W(`SMS পাঠানোর অনুমতি (Master PIN)`))try{let{currentLedgerTxnsMap:d,currentLedgerTxns:f}=u,p=d&&d[e]?d[e]:(f||[]).find(t=>t.id===e);if(!p&&e)try{p=await o.getById(e)}catch(e){console.error(`Error fetching txn:`,e)}let m=l||p?.customerId,h=t||p?.customerName||`Customer`,_=n||p?.date,v=r===void 0?p?.voucherNo||``:r,y=Number(i===void 0?p?.bill||0:i),b=Number(s===void 0?p?.paid||0:s),x=J().find(e=>e.id===m);if(!x&&m)try{x=await a.getById(m)}catch(e){console.error(`Error fetching cust:`,e)}let S=p?.phone||x?.phone||``,C=p?.calculatedDue===void 0?Number(c===void 0?x?x.totalDue||0:p?.currentDue||0:c):p.calculatedDue;if(!S){let{value:e}=await H.default.fire({title:`<i class="fa-solid fa-mobile-screen text-blue-400 mr-2"></i>Enter Phone Number`,input:`text`,inputLabel:`Phone number missing for "${h}". Enter phone number:`,inputPlaceholder:`018XXXXXXXX`,showCancelButton:!0,confirmButtonText:`Next`,cancelButtonText:`Cancel`,customClass:{popup:`!bg-slate-900 !text-white !rounded-3xl border border-slate-700`}});if(!e||!e.trim())return;S=e.trim()}let w=await g.getAppSettings(),T=B(_),ee=F(y),te=F(b),E=F(Math.abs(C)),D=v===`OPENING`||v===`OPEN`||v===`প্রারম্ভিক ব্যালেন্স`||v===`প্রারম্ভিক জের`||_&&String(v).toUpperCase()===`OPENING`,O=(typeof window.toBanglishName==`function`?window.toBanglishName(h):h)||`Customer`,ne=w.shopName?typeof window.toBanglishName==`function`?window.toBanglishName(w.shopName):w.shopName:`M/S. Maa Motors`,k=x?.accountNo||p?.customerAccountNo||p?.accountNo||``,A=k?`(A/C: ${k})`:``,j=``;if(D)j=(w.smsTemplateOpening||`Dear [Name] [AccNo], A/C opened at [Shop] on [Date]. Opening Due: Tk [Due]. Thanks!`).replace(/\[Name\]/g,O).replace(/\[AccNo\]/g,A).replace(/\[Shop\]/g,ne).replace(/\[Date\]/g,T).replace(/\[Due\]/g,E);else if(y>0)j=(w.smsTemplateNew||`Dear [Name] [AccNo], Memo #[Memo] of Tk [Bill] created on [Date]. Paid: Tk [Paid], Due: Tk [Due]. Thanks! - [Shop]`).replace(/\[Name\]/g,O).replace(/\[AccNo\]/g,A).replace(/\[Shop\]/g,ne).replace(/\[Date\]/g,T).replace(/\[Memo\]/g,v||`1`).replace(/\[Bill\]/g,ee).replace(/\[Paid\]/g,te).replace(/\[Due\]/g,E);else{let e=w.smsTemplatePaid||`We have received your payment of Tk [Paid] on [Date]. Your updated due is Tk [Due]. Thank you for staying with us! - [Shop]`,t=p?.receivedType||`Cash`;j=e.replace(/\[Name\]/g,O).replace(/\[AccNo\]/g,A).replace(/\[Shop\]/g,ne).replace(/\[Date\]/g,T).replace(/\[Paid\]/g,te).replace(/\[Type\]/g,t).replace(/\[Due\]/g,E),e.indexOf(`[Date]`)===-1&&T&&(j=j.replace(/ - [^-]+$/,` (${T})$&`))}j=j.replace(/\s+/g,` `);let{value:re}=await H.default.fire({title:`<i class="fa-solid fa-comment-sms text-blue-400 mr-2"></i>Send Transaction SMS`,html:`<div class="text-left space-y-1 mb-2 font-bn"><div class="text-xs text-slate-400">Recipient Phone: <strong class="text-white">${S}</strong></div><div id="sms-char-counter" class="text-[11px] font-bold text-emerald-400 text-right">${U(j)}</div></div>`,input:`textarea`,inputValue:j,inputAttributes:{rows:5,class:`m3-field text-xs font-mono`},showCancelButton:!0,confirmButtonText:`<i class="fa-solid fa-paper-plane mr-1.5"></i> Send SMS`,cancelButtonText:`Cancel`,customClass:{popup:`!bg-slate-900 !text-white !rounded-3xl border border-slate-700`},didOpen:()=>{let e=H.default.getInput(),t=document.getElementById(`sms-char-counter`),n=()=>{e&&t&&(t.innerText=U(e.value))};e&&(e.oninput=n),n()}});re&&await De(S,re,!1)&&H.default.fire({title:`<i class="fa-solid fa-paper-plane text-emerald-400 mr-2"></i>সফল!`,text:`${h}-কে SMS সফলভাবে পাঠানো হয়েছে`,icon:`success`,customClass:{popup:`!bg-slate-900 !text-white !rounded-3xl border border-slate-700`}})}catch(e){console.error(`sendTxnSMS error:`,e),H.default.fire({title:`এরর!`,text:`SMS তৈরি করতে সমস্যা হয়েছে: `+(e.message||e),icon:`error`,customClass:{popup:`!bg-slate-900 !text-white !rounded-3xl border border-slate-700`}})}}async function ar(e,t,n,r,i,s,c,l,u={}){let{currentLedgerTxns:d}=u,f=(d||[]).find(t=>t.id===e);if(!f&&e)try{f=await o.getById(e)}catch(e){console.error(`Error fetching txn:`,e)}let p=l||f?.customerId,m=t||f?.customerName||`Customer`,h=n||f?.date,g=r===void 0?f?.voucherNo||``:r,_=Number(i===void 0?f?.bill||0:i),v=Number(s===void 0?f?.paid||0:s),y=J().find(e=>e.id===p);if(!y&&p)try{y=await a.getById(p)}catch(e){console.error(`Error fetching cust:`,e)}let b=y?.phone||``,x=u?.currentLedgerTxnsMap&&u.currentLedgerTxnsMap[e]?u.currentLedgerTxnsMap[e]:null,S=x?.calculatedDue===void 0?Number(c===void 0?y?y.totalDue||0:f?.currentDue||0:c):x.calculatedDue;if(!b){let{value:e}=await H.default.fire({title:`<i class="fa-brands fa-whatsapp text-emerald-400 mr-2"></i>Enter Phone Number`,input:`text`,inputLabel:`Phone number missing for "${m}". Enter phone number:`,inputPlaceholder:`018XXXXXXXX`,showCancelButton:!0,confirmButtonText:`Next`,cancelButtonText:`Cancel`,customClass:{popup:`!bg-slate-900 !text-white !rounded-3xl border border-slate-700`}});if(!e||!e.trim())return;b=e.trim()}let C=y?.accountNo||f?.customerAccountNo||f?.accountNo||``,w=C?`একাউন্ট নং: ${C}\n`:``,T=B(h),ee=F(_),te=F(v),E=F(Math.abs(S)),D=g?`মেমো #${g}`:``,O=e?`${window.location.origin}${window.location.pathname}?view=public-memo&id=${e}`:``,ne=p?`${window.location.origin}${window.location.pathname}?view=public-stmt&id=${p}`:``,k=O?`আপনার এই মেমোর ডাইরেক্ট PDF দেখতে লিংকে ক্লিক করুন:\n${O}\n\n`:ne?`আপনার সম্পূর্ণ মেমো ও হিসাবের PDF বিবরণী দেখতে নিচের লিংকে ক্লিক করুন:\n${ne}\n\n`:``,A=``;if(g===`OPENING`||g===`OPEN`||g===`প্রারম্ভিক ব্যালেন্স`||g===`প্রারম্ভিক জের`||h&&String(g).toUpperCase()===`OPENING`){A=`আসসালামু আলাইকুম ${m},\nমেসার্স মা মোটরস্ থেকে আপনার হিসাবের একাউন্ট খোলা হয়েছে।\n\n${w}একাউন্ট খোলার তারিখ: ${T}\n`;let e=_>0?_:v>0?-v:0,t=F(Math.abs(e));A+=e>0?`প্রারম্ভিক বকেয়া: ৳ ${t}\n`:e<0?`প্রারম্ভিক জমা: ৳ ${t}\n`:`প্রারম্ভিক ব্যালেন্স: ৳ 0
`,A+=`---------------------------------
`,A+=S<0?`অ্যাডভান্স জমা: ৳ ${E}\n\n`:`বর্তমান মোট বকেয়া: ৳ ${E}\n\n`,k&&(A+=k),A+=`যোগাযোগ: 01819-397669
ধন্যবাদ! — মেসার্স মা মোটরস্`}else _>0?(A=`আসসালামু আলাইকুম ${m},\nমেসার্স মা মোটরস্ থেকে আপনার কেনাকাটার বিবরণী:\n\n${w}তারিখ: ${T}\n${D?D+`
`:``}আজকের বিল/খরচ: ৳ ${ee}\nআজকের জমা: ৳ ${te}\n---------------------------------\n`,A+=S<0?`অ্যাডভান্স জমা: ৳ ${E}\n\n`:`বর্তমান মোট বকেয়া: ৳ ${E}\n\n`,k&&(A+=k),A+=`যোগাযোগ: 01819-397669
ধন্যবাদ! — মেসার্স মা মোটরস্`):(A=`আসসালামু আলাইকুম ${m},\nমেসার্স মা মোটরস্-এ আপনার টাকা জমা নেওয়ার রিসিট:\n\n${w}তারিখ: ${T}\nজমা প্রাপ্তি: ৳ ${te}\n---------------------------------\n`,A+=S<0?`অ্যাডভান্স জমা: ৳ ${E}\n\n`:`বর্তমান মোট বকেয়া: ৳ ${E}\n\n`,k&&(A+=k),A+=`যোগাযোগ: 01819-397669
ধন্যবাদ! — মেসার্স মা মোটরস্`);let{value:j}=await H.default.fire({title:`<div class="flex items-center justify-center gap-2 font-bn font-black text-lg text-emerald-400"><i class="fa-brands fa-whatsapp text-xl"></i><span>Send WhatsApp Message</span></div>`,html:`<div class="text-left space-y-1 mb-2 font-bn"><div class="text-xs text-slate-400">Recipient Phone: <strong class="text-white">${b}</strong></div></div>`,input:`textarea`,inputValue:A,inputAttributes:{rows:8,class:`m3-field text-xs font-bn`},showCancelButton:!0,confirmButtonText:`<i class="fa-brands fa-whatsapp mr-1.5"></i> Open WhatsApp`,cancelButtonText:`Cancel`,customClass:{popup:`!bg-slate-950 !text-white !rounded-3xl border border-slate-800 shadow-2xl font-bn`,confirmButton:`m3-btn-primary !bg-emerald-600 hover:!bg-emerald-500 !px-6 !py-2 rounded-xl font-bold`}});j&&window.sendWhatsApp&&window.sendWhatsApp(b,j)}async function or(e,t){try{if(H.default!==void 0&&H.default.close&&H.default.close(),typeof window.printReceiptEngine==`function`)await window.printReceiptEngine(e,t);else{let{printReceiptEngine:n}=await D(async()=>{let{printReceiptEngine:e}=await import(`./receipt-engine-BomD4P0l.js`);return{printReceiptEngine:e}},__vite__mapDeps([5,1,0,2,3,4,6,7]));window.printReceiptEngine=n,await window.printReceiptEngine(e,t)}}catch(e){typeof K==`function`&&K(`প্রিন্ট লোড ব্যর্থ: ${e.message}`,`error`,`প্রিন্ট Error`)}}function sr(e){H.default.fire({title:`<div class="flex items-center justify-center gap-2 font-bn font-black text-lg text-white"><i class="fa-solid fa-print text-emerald-400"></i><span>রিসিট প্রিন্ট ফরম্যাট নির্বাচন করুন</span></div>`,html:`
            <div class="flex flex-col gap-3 p-1 font-bn mt-2">
                <button type="button" onclick="window.executePrint('${e}', 'pos')" class="h-11 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-blue-600/30 transition-all cursor-pointer">
                    <i class="fa-solid fa-receipt text-sm"></i> POS রিসিট (80mm Thermal Printer)
                </button>
                <button type="button" onclick="window.executePrint('${e}', 'a4')" class="h-11 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs flex items-center justify-center gap-2 border border-slate-700 transition-all cursor-pointer">
                    <i class="fa-solid fa-file-invoice text-sm text-purple-400"></i> A4 ফুল পেপার মেমো (Standard Invoice)
                </button>
            </div>
        `,showConfirmButton:!1,showCancelButton:!0,cancelButtonText:`বাতিল`,customClass:{popup:`!bg-slate-950 !text-white !rounded-3xl border border-slate-800 shadow-2xl font-bn`,cancelButton:`!bg-slate-900 hover:!bg-slate-800 !text-slate-400 !px-6 !py-2 !rounded-xl text-xs font-bold border border-slate-800`}})}function cr(){typeof window>`u`||window._ledgerHotkeysInitialized||(window._ledgerHotkeysInitialized=!0,window.addEventListener(`keydown`,lr),document.addEventListener(`keydown`,ur))}function lr(e){if(H.default.isVisible()){let t=document.activeElement?.tagName?.toLowerCase();if(t===`input`||t===`textarea`||document.activeElement?.isContentEditable)return;let n=e.key.toLowerCase();if(n===`y`&&!e.ctrlKey&&!e.altKey&&!e.metaKey){e.preventDefault();let t=H.default.getConfirmButton();t&&!t.disabled&&t.click();return}if(n===`n`&&!e.ctrlKey&&!e.altKey&&!e.metaKey){e.preventDefault();let t=H.default.getCancelButton();t&&!t.disabled&&t.click();return}}if((e.ctrlKey||e.metaKey)&&e.key===`Enter`){let t=document.getElementById(`save-txn-btn`);document.getElementById(`spreadsheet-body`)&&window.saveSpreadsheetData?(e.preventDefault(),window.saveSpreadsheetData()):t&&!t.disabled&&window.saveTransaction&&(e.preventDefault(),window.saveTransaction());return}if(e.altKey&&!e.ctrlKey&&!e.shiftKey&&!e.metaKey){let t=document.getElementById(`spreadsheet-body`)?window.quickSelectSpreadsheetAccount:window.quickSelectPaymentAccount;switch(e.key.toLowerCase()){case`1`:e.preventDefault(),t&&t(`Bank`,`OneBank (IFRAT)`);break;case`2`:e.preventDefault(),t&&t(`Bank`,`IBBL (IFRAT)`);break;case`3`:e.preventDefault(),t&&t(`Cash`,`শোরুম ক্যাশ`);break;case`s`:e.preventDefault(),dr();break;case`h`:e.preventDefault(),hr();break;case`e`:e.preventDefault(),fr();break;case`d`:e.preventDefault(),pr();break;case`r`:e.preventDefault(),mr()}}}function ur(e){if(e.key!==`Enter`||e.ctrlKey||e.altKey||e.shiftKey||e.metaKey||H.default.isVisible())return;let t=e.target;if(!t)return;let n=document.getElementById(`ledger-form-card`);!n||!n.contains(t)||(t.id===`ledger-date`?(e.preventDefault(),document.getElementById(`ledger-voucher`)?.focus()):t.id===`ledger-voucher`?(e.preventDefault(),document.getElementById(`ledger-bill`)?.focus()):t.id===`ledger-bill`?(e.preventDefault(),document.getElementById(`ledger-paid`)?.focus()):t.id===`ledger-paid`?(e.preventDefault(),(parseFloat(t.value.replace(/,/g,``))||0)>0?document.getElementById(`ledger-received-from`)?.focus():document.getElementById(`save-txn-btn`)?.focus()):t.id===`ledger-received-from`&&(e.preventDefault(),document.getElementById(`save-txn-btn`)?.focus()))}function dr(){let e=document.getElementById(`ledger-cust-search-input`);e&&(e.focus(),e.select(),K(`কাস্টমার সার্চ সক্রিয় (Alt+S)`,`info`,1e3))}function fr(){let e=document.querySelector(`#ledger-list tr`);if(!e)return K(`এডিট করার মতো লেনদেন পাওয়া যায়নি`,`warning`);let t=e.querySelector(`button[title*="এডিট"]`);t&&(t.click(),K(`সর্বশেষ লেনদেন এডিট মোডে লোড হয়েছে`,`info`))}function pr(){let e=document.querySelector(`#ledger-list tr`);if(!e)return K(`ডিলেট করার মতো লেনদেন পাওয়া যায়নি`,`warning`);let t=e.querySelector(`button[title*="ডিলেট"]`);t&&t.click()}function mr(){let e=document.querySelector(`#ledger-list tr`);if(!e)return K(`প্রিন্ট করার মতো লেনদেন পাওয়া যায়নি`,`warning`);let t=e.querySelector(`button[title*="রিসিপ্ট"], button[title*="ভাউচার"], button[title*="প্রিন্ট"]`);t&&t.click()}function hr(){H.default.fire({title:`
            <div class="flex items-center justify-center gap-2.5 font-bn font-black text-xl text-white">
                <i class="fa-solid fa-keyboard text-purple-400"></i>
                <span>খতিয়ান কীবোর্ড গাইডলাইন (Zero-Mouse)</span>
            </div>
        `,html:`
            <div class="text-left font-bn space-y-4 max-h-[65vh] overflow-y-auto custom-scrollbar pr-1">
                <div class="p-3 bg-purple-500/10 border border-purple-500/20 rounded-2xl">
                    <div class="text-xs font-bold text-purple-300 flex items-center gap-2">
                        <i class="fa-solid fa-bolt text-amber-400"></i>
                        <span>মাউস ছাড়া দ্রুত ডাটা এন্ট্রি করার পূর্ণাঙ্গ নিয়মাবলী</span>
                    </div>
                </div>

                <div class="space-y-2">
                    <h4 class="text-xs font-black text-blue-400 uppercase tracking-wider flex items-center gap-1.5">
                        <i class="fa-solid fa-arrow-progress text-[10px]"></i> ১. ডাটা এন্ট্রি নেভিগেশন (Enter Flow)
                    </h4>
                    <div class="bg-slate-900/90 border border-slate-800 rounded-xl p-2.5 text-xs space-y-2">
                        <div class="flex items-center justify-between">
                            <span class="text-slate-300">কাস্টমার সার্চে নাম লিখে নির্বাচন</span>
                            <span class="flex items-center gap-1"><kbd class="m3-kbd">↓ / ↑</kbd> + <kbd class="m3-kbd">Enter</kbd></span>
                        </div>
                        <div class="flex items-center justify-between">
                            <span class="text-slate-300">পরবর্তী ফিল্ডে যাওয়া (Date ➔ Memo ➔ Bill ➔ Paid)</span>
                            <kbd class="m3-kbd">Enter</kbd>
                        </div>
                        <div class="flex items-center justify-between">
                            <span class="text-slate-300">যেকোনো ফিল্ড থেকে সরাসরি এন্ট্রি সেভ</span>
                            <kbd class="m3-kbd bg-blue-600/30 text-blue-300 border-blue-500/40">Ctrl + Enter</kbd>
                        </div>
                    </div>
                </div>

                <div class="space-y-2">
                    <h4 class="text-xs font-black text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
                        <i class="fa-solid fa-building-columns text-[10px]"></i> ২. ১-ক্লিক ব্যাংক ও ক্যাশ সিলেক্ট
                    </h4>
                    <div class="bg-slate-900/90 border border-slate-800 rounded-xl p-2.5 text-xs space-y-2">
                        <div class="flex items-center justify-between">
                            <span class="text-slate-300">OneBank (IFRAT) সিলেক্ট</span>
                            <kbd class="m3-kbd">Alt + 1</kbd>
                        </div>
                        <div class="flex items-center justify-between">
                            <span class="text-slate-300">IBBL (IFRAT) সিলেক্ট</span>
                            <kbd class="m3-kbd">Alt + 2</kbd>
                        </div>
                        <div class="flex items-center justify-between">
                            <span class="text-slate-300">শোরুম ক্যাশ সিলেক্ট</span>
                            <kbd class="m3-kbd">Alt + 3</kbd>
                        </div>
                    </div>
                </div>

                <div class="space-y-2">
                    <h4 class="text-xs font-black text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
                        <i class="fa-solid fa-message-sms text-[10px]"></i> ৩. পপআপ ও SMS হ্যান্ডলিং
                    </h4>
                    <div class="bg-slate-900/90 border border-slate-800 rounded-xl p-2.5 text-xs space-y-2">
                        <div class="flex items-center justify-between">
                            <span class="text-slate-300">কনফার্ম / SMS পাঠান (OK)</span>
                            <span class="flex items-center gap-1"><kbd class="m3-kbd text-emerald-400">Enter</kbd> বা <kbd class="m3-kbd text-emerald-400">Y</kbd></span>
                        </div>
                        <div class="flex items-center justify-between">
                            <span class="text-slate-300">বাতিল / পপআপ বন্ধ (Cancel)</span>
                            <span class="flex items-center gap-1"><kbd class="m3-kbd text-red-400">Esc</kbd> বা <kbd class="m3-kbd text-red-400">N</kbd></span>
                        </div>
                    </div>
                </div>

                <div class="space-y-2">
                    <h4 class="text-xs font-black text-purple-400 uppercase tracking-wider flex items-center gap-1.5">
                        <i class="fa-solid fa-sliders text-[10px]"></i> ৪. কুইক অ্যাকশন শর্টকাট
                    </h4>
                    <div class="bg-slate-900/90 border border-slate-800 rounded-xl p-2.5 text-xs space-y-2">
                        <div class="flex items-center justify-between">
                            <span class="text-slate-300">কাস্টমার সার্চ বক্সে সরাসরি ফোকাস</span>
                            <kbd class="m3-kbd">Alt + S</kbd>
                        </div>
                        <div class="flex items-center justify-between">
                            <span class="text-slate-300">সর্বশেষ লেনদেন এডিট করুন</span>
                            <kbd class="m3-kbd">Alt + E</kbd>
                        </div>
                        <div class="flex items-center justify-between">
                            <span class="text-slate-300">সর্বশেষ লেনদেন ডিলেট করুন</span>
                            <kbd class="m3-kbd">Alt + D</kbd>
                        </div>
                        <div class="flex items-center justify-between">
                            <span class="text-slate-300">মানি রিসিপ্ট প্রিন্ট</span>
                            <kbd class="m3-kbd">Alt + R</kbd>
                        </div>
                    </div>
                </div>
            </div>
        `,confirmButtonText:`<i class="fa-solid fa-check mr-2"></i>ঠিক আছে (Enter)`,customClass:{popup:`rounded-3xl bg-slate-950 border border-slate-700/80 shadow-2xl p-6 text-white`,confirmButton:`m3-btn-primary rounded-xl px-8 py-2.5 text-xs font-bold`}})}window.initLedgerHotkeys=cr,window.showLedgerKeyboardGuide=hr,window.editLastTransaction=fr,window.deleteLastTransaction=pr,window.printLastTransaction=mr,window.focusCustomerSearch=dr;var gr={id:null,oldBill:0,oldPaid:0},_r=[],vr={},yr=null,br=[],xr=[],X=1,Sr=20,Cr={currentLedgerTxns:_r,currentLedgerTxnsMap:vr};async function wr(e=null,t=null,n=`reset`){let r=document.getElementById(`ledger-list`),i=document.getElementById(`ledger-list-mobile`),a=document.getElementById(`recent-txn-list`),s=document.getElementById(`ledger-pagination`);if(n===`reset`&&(yr=null,br=[],xr=[],X=1),t===null&&!e){let e=document.getElementById(`ledger-customer-select`);e&&e.value&&(t=e.value)}r&&(r.innerHTML=`<tr><td colspan="6" class="text-center py-12"><i class="fa-solid fa-spinner fa-spin mr-3 text-blue-500 text-xl"></i> লোডিং...</td></tr>`),i&&(i.innerHTML=`<div class="text-center py-10 text-slate-500 font-bold italic">লোডিং...</div>`);try{let i;if(e){let t=await o.getByVoucher(e);i={data:t,lastDoc:null,count:t.length},s&&s.classList.add(`hidden`)}else{let e=t?[{field:`customerId`,op:`==`,value:t}]:[];if(a&&!r)return o.listenRecent(5,e=>Dr(e,a));let c=n===`next`?yr:n===`prev`&&br.length>1?br[br.length-2]:null;if(t)try{i=await o.getByPage(Sr,c,`createdAt`,`desc`,e)}catch{i=await o.getByPage(Sr,c,`date`,`desc`,e)}else i=await o.getByPage(Sr,c,`createdAt`,`desc`,e);if(yr=i.lastDoc,n===`next`?c&&br.push(c):n===`prev`&&br.pop(),s){s.classList.remove(`hidden`);let e=document.getElementById(`current-page-display`);e&&(e.innerText=X);let t=document.getElementById(`prev-page`),n=document.getElementById(`next-page`);t&&(t.disabled=X===1),n&&(n.disabled=i.count<Sr)}}let c=null;if(t)if(n===`reset`||xr.length===0){let e=(J()||[]).find(e=>e.id===t);c=Number(e?.totalDue||0),xr=[c]}else c=xr[X-1]===void 0?null:xr[X-1];let l=document.getElementById(`ledger-list`)||document.getElementById(`recent-txn-list`);if(!l)return;let u=Dr(i.data,l,c);t&&u&&u.finalRunning!==void 0&&(xr[X]=u.finalRunning)}catch(e){G(e,`লেনদেন লোড করতে সমস্যা হয়েছে`),r&&(r.innerHTML=`<tr><td colspan="6" class="text-center py-12 text-red-400">ডাটা লোড করতে সমস্যা হয়েছে</td></tr>`)}}function Tr(e){yr=null,br=[],xr=[],X=1,Er(),wr(null,e,`reset`)}function Er(){$n()}function Dr(e,t,n=null){return er(e,t,Cr,n)}function Or(e,t){Qn(e,t,{loadCustomersForDropdown:Ir,loadRecentTransactions:wr,filterLedgerByCustomer:Tr}),X=1,br=[],xr=[],yr=null}async function kr(){return tr(gr,{filterLedgerByCustomer:Tr})}async function Ar(e,t,n,r,i,a,o,s){return ir(e,t,n,r,i,a,o,s,Cr)}async function jr(e,t,n,r,i,a,o,s){return ar(e,t,n,r,i,a,o,s,Cr)}async function Mr(e,t,n,r,i,a,o,s){return nr(e,t,n,r,i,a,o,s,gr)}async function Nr(e,t,n,r){return rr(e,t,n,r,{filterLedgerByCustomer:Tr})}async function Pr(e,t){return or(e,t)}function Fr(e){return sr(e)}async function Ir(){let e=J();e.length||(Y(),e=await a.getAll(`name`,`asc`));let t=document.getElementById(`ledger-customer-select`);t&&(t.innerHTML=`<option value="">-- সকল কাস্টমার --</option>`+e.map(e=>{let t=e.accountNo?`[${e.accountNo}] `:``;return`<option value="${e.id}" data-due="${e.totalDue||0}" data-phone="${e.phone||``}" data-name="${e.name}" data-acc="${e.accountNo||``}">${t}${e.name}</option>`}).join(``))}function Lr(e=``){Vn(e,{inputId:`ledger-cust-search-input`,selectId:`tx-customer`,dropdownId:`ledger-cust-dropdown`,onSelect:e=>Rr(e)})}function Rr(e){let t=document.getElementById(`ledger-customer-select`),n=document.getElementById(`ledger-cust-search-input`),r=document.getElementById(`ledger-cust-search-clear`),i=document.getElementById(`ledger-cust-dropdown`);if(t&&(t.value=e,Tr(e)),t&&t.selectedIndex>0){let e=t.options[t.selectedIndex];n&&(n.value=`${e.dataset.name||e.text}`),r&&r.classList.remove(`hidden`)}i&&i.classList.add(`hidden`)}function zr(){let e=document.getElementById(`ledger-customer-select`),t=document.getElementById(`ledger-cust-search-input`),n=document.getElementById(`ledger-cust-search-clear`),r=document.getElementById(`ledger-cust-dropdown`);e&&(e.value=``,Tr(``)),t&&(t.value=``),n&&n.classList.add(`hidden`),r&&r.classList.add(`hidden`)}typeof window<`u`&&(window.loadRecentTransactions=wr,window.saveTransaction=kr,window.sendTxnSMS=Ar,window.sendTxnWhatsApp=jr,window.updateLedgerLiveText=Er,window.filterLedgerByCustomer=Tr,window.editTransaction=Mr,window.deleteTransaction=Nr,window.executePrint=Pr,window.choosePrintType=Fr,window.filterLedgerCustomerSearch=Lr,window.selectLedgerCustomer=Rr,window.clearLedgerCustomerSearch=zr,window.changeLedgerPage=async e=>{let t=X;e===`next`?X++:X--;try{let t=document.getElementById(`ledger-customer-select`)?.value;await wr(null,t,e)}catch{X=t}},window.toggleReceivedSection=()=>{let e=I(document.getElementById(`ledger-paid`)?.value||`0`);document.getElementById(`received-section`)?.classList.toggle(`hidden`,e<=0)},window.setReceivedType=e=>{[`Bank`,`Cash`,`Less`].forEach(t=>{let n=document.getElementById(`recv-`+t.toLowerCase()+`-btn`);n&&(t===e?(n.classList.add(`bg-blue-600`,`text-white`),n.classList.remove(`text-slate-400`)):(n.classList.remove(`bg-blue-600`,`text-white`),n.classList.add(`text-slate-400`)))});let t=document.getElementById(`lbl-recv-from`);if(document.getElementById(`ledger-received-from`),document.getElementById(`btn-quick-add-recv`),t){let n=document.getElementById(`recv-input-wrapper`);e===`Bank`?(t.innerText=`ব্যাংক অ্যাকাউন্ট (Bank Name)`,n.innerHTML=`
                    <select id="ledger-received-from" class="m3-field py-1 text-xs bg-slate-950/80 h-9 flex-1 cursor-pointer">
                        ${window.cachedBanksHtml||`<option value="">-- ব্যাংক নির্বাচন করুন --</option>`}
                    </select>
                    <button type="button" id="btn-quick-edit-recv" onclick="window.quickEditBank && window.quickEditBank()" class="w-9 h-9 bg-emerald-600/20 hover:bg-emerald-600 text-emerald-400 hover:text-white border border-emerald-500/30 rounded-xl transition-all flex items-center justify-center shrink-0 cursor-pointer" title="নির্বাচিত ব্যাংক এডিট করুন">
                        <i class="fa-solid fa-pen text-xs"></i>
                    </button>
                    <button type="button" id="btn-quick-add-recv" onclick="window.quickAddBank && window.quickAddBank()" class="w-9 h-9 bg-blue-600/20 hover:bg-blue-600 text-blue-400 hover:text-white border border-blue-500/30 rounded-xl transition-all flex items-center justify-center shrink-0 cursor-pointer" title="নতুন ব্যাংক যোগ করুন">
                        <i class="fa-solid fa-plus text-xs"></i>
                    </button>
                `):e===`Cash`?(t.innerText=`কার মাধ্যমে জমা (Cash Receiver)`,n.innerHTML=`
                    <select id="ledger-received-from" class="m3-field py-1 text-xs bg-slate-950/80 h-9 flex-1 cursor-pointer">
                        ${window.cachedCashHtml||`<option value="">-- ক্যাশ রিসিভার নির্বাচন করুন --</option>`}
                    </select>
                    <button type="button" id="btn-quick-edit-recv" onclick="window.quickEditCashCollector && window.quickEditCashCollector()" class="w-9 h-9 bg-emerald-600/20 hover:bg-emerald-600 text-emerald-400 hover:text-white border border-emerald-500/30 rounded-xl transition-all flex items-center justify-center shrink-0 cursor-pointer" title="নির্বাচিত ক্যাশ সোর্স এডিট করুন">
                        <i class="fa-solid fa-pen text-xs"></i>
                    </button>
                    <button type="button" id="btn-quick-add-recv" onclick="window.quickAddCashCollector && window.quickAddCashCollector()" class="w-9 h-9 bg-blue-600/20 hover:bg-blue-600 text-blue-400 hover:text-white border border-blue-500/30 rounded-xl transition-all flex items-center justify-center shrink-0 cursor-pointer" title="নতুন ক্যাশ সোর্স যোগ করুন">
                        <i class="fa-solid fa-plus text-xs"></i>
                    </button>
                `):(t.innerText=`ছাড়ের কারণ (Reason)`,n.innerHTML=`
                    <input type="text" id="ledger-received-from" placeholder="যেমন: সম্মানিতে ছাড়..." class="m3-field py-1 text-xs bg-slate-950/80 h-9 flex-1">
                `)}},window.Swal=H.default,window.quickSelectPaymentAccount=(e,t)=>{document.getElementById(`received-section`)?.classList.remove(`hidden`),window.setReceivedType&&window.setReceivedType(e);let n=document.getElementById(`ledger-received-from`);n&&(n.value=t),document.getElementById(`ledger-paid`)?.focus(),showToast(`[${e}] ${t} সিলেক্ট করা হয়েছে`,`info`)},cr()),document.addEventListener(`click`,e=>{let t=document.getElementById(`ledger-cust-dropdown`),n=document.getElementById(`ledger-cust-search-input`);t&&!t.contains(e.target)&&e.target!==n&&t.classList.add(`hidden`)});var Br=null,Vr=[],Hr=1,Ur=20;function Wr(e){if(window.AppState.currentUserRole===`Staff`&&window.AppState.permissions.viewExpenses===!1){e.innerHTML=`<div class="m3-card text-center font-bn py-12"><h2 class="text-xl font-bold text-red-500">অ্যাক্সেস ডিনাইড!</h2></div>`;return}Br=null,Vr=[],Hr=1,e.innerHTML=`
        <div class="flex flex-col gap-6 font-bn">
            <div class="flex flex-wrap items-center justify-between gap-3 px-2">
                <h2 class="text-2xl font-black text-white flex items-center gap-3">
                    <div class="w-1.5 h-8 bg-blue-600 rounded-full"></div>
                    দৈনিক খরচ <span class="text-xs font-bold text-slate-400 uppercase tracking-wider">(Daily Expenses)</span>
                    <button class="w-8 h-8 rounded-full hover:bg-slate-800 flex items-center justify-center text-slate-500 hover:text-blue-400 transition-all" onclick="window.loadRecentExpenses()">
                        <i class="fa-solid fa-rotate text-sm"></i>
                    </button>
                </h2>
                <div class="flex items-center gap-3">
                    <div class="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-purple-500/10 border border-purple-500/30 text-purple-400 text-xs font-bold">
                        <i class="fa-solid fa-wallet"></i>
                        <span>আজকের খরচ: <strong id="expense-today-sum" class="text-white font-black">৳ ০</strong></span>
                    </div>
                    <button class="m3-btn-primary px-4 py-2 text-xs" onclick="window.generateExpenseReport()">
                        <i class="fa-solid fa-file-pdf mr-1"></i> প্রিন্ট স্টেটমেন্ট
                    </button>
                </div>
            </div>

            <div class="m3-card">
                <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 items-start font-bn">
                    <div><label class="m3-label">তারিখ <span class="m3-label-sub">(Date *)</span></label><input type="text" id="exp-date" class="m3-field h-[42px] py-0 datepicker"></div>
                    <div><label class="m3-label">ক্যাটাগরি <span class="m3-label-sub">(Category *)</span></label><select id="exp-category" class="m3-field h-[42px] py-0 font-bold" onchange="window.handleCategoryChange()"></select></div>
                    <div>
                        <label class="m3-label text-red-400">পরিমাণ <span class="m3-label-sub">(Amount ৳ *)</span></label>
                        <input type="text" id="exp-amount" oninput="window.handleNumberInput(this); window.updateLiveWords(this, 'exp-amount-words');" class="m3-field h-[42px] py-0 text-base font-black text-red-400 border-red-500/30" placeholder="০.০০">
                        <div class="h-6"><div id="exp-amount-words" class="text-[10px] font-black text-red-400 mt-1 px-2 py-0.5 rounded-lg bg-red-500/5 hidden italic truncate"></div></div>
                    </div>
                    <div><label class="m3-label">বিবরণ <span class="m3-label-sub">(Details)</span></label><input type="text" id="exp-details" placeholder="..." class="m3-field h-[42px]"></div>
                    <div><button id="save-exp-btn" class="m3-btn-primary w-full h-[42px] mt-6" onclick="window.saveExpense()">সেভ করুন</button></div>
                </div>
            </div>

            <!-- Desktop View Table -->
            <div class="desktop-only m3-table-container">
                <table class="m3-table w-full">
                    <thead><tr><th class="w-[140px]">তারিখ</th><th class="w-[180px]">ক্যাটাগরি</th><th>বিবরণ</th><th class="w-[150px] text-right">পরিমাণ</th><th class="w-[100px] text-center">অ্যাকশন</th></tr></thead>
                    <tbody id="expense-list"></tbody>
                </table>
            </div>

            <!-- Mobile View Responsive Cards -->
            <div id="expense-list-mobile" class="mobile-only mobile-card-container font-bn">
                <div class="text-center py-10 text-slate-500 font-bold italic">ডাটা লোড হচ্ছে...</div>
            </div>

            <div id="expense-pagination" class="flex items-center justify-center gap-4 py-4 hidden">
                <button id="exp-prev-page" class="px-4 py-2 bg-slate-800 text-slate-300 rounded-xl" onclick="window.changeExpensePage('prev')">পূর্ববর্তী</button>
                <div class="text-white font-bold bg-blue-600/10 border border-blue-500/30 px-4 py-2 rounded-xl">পৃষ্ঠা: <span id="exp-current-page-display">1</span></div>
                <button id="exp-next-page" class="px-4 py-2 bg-slate-800 text-slate-300 rounded-xl" onclick="window.changeExpensePage('next')">পরবর্তী</button>
            </div>
        </div>`,document.getElementById(`exp-date`).value=window.getTodayLocalDateString?window.getTodayLocalDateString():new Date().toISOString().split(`T`)[0],Gr(),Kr()}async function Gr(){let e=document.getElementById(`exp-category`);e&&(e.innerHTML=[`দোকান ভাড়া`,`বিদ্যুৎ বিল`,`পানি বিল`,`ইন্টারনেট/ডিস বিল`,`স্টাফ বেতন`,`নাস্তা/আপ্যায়ন`,`চা/কফি`,`যাতায়াত/পরিবহন`,`মালামাল/পণ্য ক্রয়`,`প্রিন্টিং/স্টেশনারি`,`মেরামতি/রক্ষণাবেক্ষণ`,`দান/চাঁদা`,`পৌরসভা/ট্যাক্স`,`কুরিয়ার/পার্সেল`,`অন্যান্য`].map(e=>`<option value="${e}">${e}</option>`).join(``)+`<option value="ADD_NEW">+ নতুন ক্যাটাগরি যোগ করুন...</option>`)}async function Kr(e=`next`){let t=document.getElementById(`expense-list`);if(!t)return;let n=document.getElementById(`expense-list-mobile`);t.innerHTML=`<tr><td colspan="5" class="text-center py-12">লোডিং...</td></tr>`,n&&(n.innerHTML=`<div class="text-center py-10 text-slate-500 font-bold italic">লোডিং...</div>`);try{let n=e===`next`?Br:Vr.length>1?Vr[Vr.length-2]:null,r=await p.getByPage(Ur,n,`createdAt`,`desc`);Br=r.lastDoc,e===`next`?n&&Vr.push(n):Vr.pop();let i=document.getElementById(`expense-pagination`);i&&(i.classList.remove(`hidden`),document.getElementById(`exp-current-page-display`).innerText=Hr,document.getElementById(`exp-prev-page`).disabled=Hr===1,document.getElementById(`exp-next-page`).disabled=r.count<Ur),qr(r.data,t)}catch{t.innerHTML=`Error loading data`}}function qr(e,t){let n=document.getElementById(`expense-list-mobile`),r=String(window.AppState?.currentUserRole||``).toLowerCase()===`admin`,i=r||window.AppState?.permissions?.editExpenses!==!1&&window.AppState?.permissions?.manageExpenses!==!1,a=r||window.AppState?.permissions?.deleteExpenses===!0,o=R(),s=0;e.forEach(e=>{e.date===o&&(s+=Number(e.amount)||0)});let c=document.getElementById(`expense-today-sum`);c&&(c.innerText=`৳ ${F(s)}`);let l=``,u=``;e.forEach(e=>{let t=P(e.category),n=P(e.details||`-`),r=t.replace(/'/g,`\\'`);l+=`
            <tr class="border-b border-slate-800/50 hover:bg-white/[0.02] transition-colors">
                <td class="text-slate-300 font-bold text-xs">${B(e.date)}${e.createdBy?`<div class="text-[8px] text-blue-400/80 italic mt-0.5">by ${P(e.createdBy)}</div>`:``}</td>
                <td class="font-bold text-white text-sm">${t}</td>
                <td class="text-xs text-slate-200">${n}</td>
                <td class="text-right text-red-400 font-black text-base">৳${F(e.amount)}</td>
                <td class="text-center">
                    <div class="flex items-center justify-center gap-1.5">
                        ${i?`<button class="m3-btn-icon" onclick="window.editExpense('${e.id}', '${e.date}', '${r}', ${e.amount}, '${encodeURIComponent(e.details||``)}')" title="এডিট"><i class="fa-solid fa-pen-to-square text-amber-400"></i></button>`:``}
                        ${a?`<button class="m3-btn-icon" onclick="window.deleteExpense('${e.id}', '${r}')" title="ডিলেট"><i class="fa-solid fa-trash-can text-red-400"></i></button>`:``}
                    </div>
                </td>
            </tr>`,u+=`
            <div class="mobile-card">
                <div class="mobile-card-header">
                    <div>
                        <div class="mobile-card-title text-white font-bold">${t}</div>
                        <div class="mobile-card-sub text-slate-400 font-bold mt-0.5">${B(e.date)}</div>
                    </div>
                    <div class="text-right">
                        <div class="text-red-400 font-black text-lg">৳ ${F(e.amount)}</div>
                    </div>
                </div>
                <div class="mobile-card-row"><span class="mobile-card-label">বিবরণ:</span><span class="mobile-card-value text-slate-200">${n}</span></div>
                ${e.createdBy?`<div class="mobile-card-row"><span class="mobile-card-label">এন্ট্রিদাতা:</span><span class="mobile-card-value text-blue-400 text-xs">${P(e.createdBy)}</span></div>`:``}
                ${i||a?`
                <div class="mobile-card-actions">
                    ${i?`<button class="m3-btn-icon" onclick="window.editExpense('${e.id}', '${e.date}', '${r}', ${e.amount}, '${encodeURIComponent(e.details||``)}')" title="এডিট"><i class="fa-solid fa-pen-to-square text-amber-400"></i></button>`:``}
                    ${a?`<button class="m3-btn-icon" onclick="window.deleteExpense('${e.id}', '${r}')" title="ডিলেট"><i class="fa-solid fa-trash-can text-red-400"></i></button>`:``}
                </div>`:``}
            </div>`}),t.innerHTML=l||`<tr><td colspan="5" class="text-center py-10 italic">কোনো ডাটা নেই</td></tr>`,n&&(n.innerHTML=u||`<div class="text-center py-10 text-slate-500 font-bold italic">কোনো ডাটা নেই</div>`)}function Jr(e){e===`next`?Hr++:Hr--,Kr(e)}var Yr=null;async function Xr(){let e=document.getElementById(`exp-date`),t=document.getElementById(`exp-category`),n=document.getElementById(`exp-details`),r=document.getElementById(`exp-amount`);if(!e||!t||!r)return;let i=z(e.value),a=t.value,o=n.value.trim(),s=I(r.value);if(!s||s<=0)return H.default.fire({title:`ত্রুটি!`,text:`সঠিক খরচের পরিমাণ লিখুন`,icon:`error`});let c=document.getElementById(`save-exp-btn`);c&&(c.disabled=!0);let l=V(s),u=!!Yr;if(!(await H.default.fire({title:u?`<i class="fa-solid fa-magnifying-glass text-amber-400 mr-2"></i>খরচ সংশোধন যাচাই`:`<i class="fa-solid fa-magnifying-glass text-blue-400 mr-2"></i>খরচ যাচাই করুন`,html:`
            <div class="text-left space-y-3 font-bn p-2 bg-slate-900 rounded-2xl border border-slate-800">
                <div class="flex flex-col gap-1 border-b border-slate-800 pb-2">
                    <span class="text-[10px] text-blue-400 font-black uppercase tracking-widest">খরচের ক্যাটাগরি</span>
                    <span class="text-lg text-white font-black">${a}</span>
                </div>
                <div class="flex flex-col gap-1 border-b border-slate-800 pb-2">
                    <span class="text-[10px] text-slate-400 font-black uppercase tracking-widest">বিবরণ / নোট</span>
                    <span class="text-sm text-slate-200 font-bold">${o||`N/A`}</span>
                </div>
                <div class="flex flex-col gap-1 pt-1">
                    <span class="text-[10px] text-red-400 font-black uppercase tracking-widest">খরচের পরিমাণ</span>
                    <span class="text-2xl text-red-400 font-black">৳ ${F(s)}</span>
                    ${l?`<div class="text-[11px] text-red-400 font-black italic bg-red-500/10 px-2 py-1 rounded-lg border border-red-500/20 mt-1">(${l})</div>`:``}
                </div>
                <div class="flex flex-col gap-1 pt-2 border-t border-slate-800">
                    <span class="text-[10px] text-slate-400 font-black uppercase tracking-widest">তারিখ</span>
                    <span class="text-sm text-slate-300 font-bold font-mono">${B(i)}</span>
                </div>
            </div>
            <p class="text-xs text-amber-400 font-bold mt-3 text-center">তথ্য সঠিক থাকলে "কনফার্ম করুন" বাটনে চাপুন।</p>
        `,showCancelButton:!0,confirmButtonText:`<i class="fa-solid fa-circle-check mr-2"></i>কনফার্ম করুন`,cancelButtonText:`<i class="fa-solid fa-pen-to-square mr-2"></i>সংশোধন করব`,customClass:{popup:`!bg-slate-950 !text-white !rounded-3xl border border-slate-800 shadow-2xl font-bn`,confirmButton:`m3-btn-primary !bg-red-600 hover:!bg-red-500 !px-6 !py-2 rounded-xl font-bold`,cancelButton:`m3-btn-tonal !bg-slate-800 hover:!bg-slate-700 !text-slate-300 !px-4 !py-2 rounded-xl font-bold border border-slate-700`}})).isConfirmed){c&&(c.disabled=!1);return}try{Yr?(await p.update(Yr,{date:i,category:a,details:o,amount:s}),O(`UPDATE`,`Expenses`,Yr,a,{amount:s}),Yr=null,c&&(c.innerHTML=`<i class="fa-solid fa-cloud-arrow-up"></i> সেভ করুন`,c.className=`m3-btn-primary px-6 h-[42px] py-0 text-sm font-black uppercase tracking-widest w-full flex items-center justify-center gap-2`)):O(`CREATE`,`Expenses`,await p.add({date:i,category:a,details:o,amount:s,createdBy:N.currentUserEmail}),a,{amount:s}),r.value=``,n.value=``,Ee(`exp-amount-words`),t&&(t.selectedIndex=0),H.default.fire({toast:!0,position:`top-end`,icon:`success`,title:`সাফল্য!`,timer:2e3}),Kr()}catch{H.default.fire(`Error`,`ব্যর্থ হয়েছেন`,`error`)}finally{c&&(c.disabled=!1)}}async function Zr(e,t){if(await W(`খরচ মুছে ফেলা`))try{await p.delete(e),O(`DELETE`,`Expenses`,e,t),Kr(),H.default.fire(`সফল!`,`খরচ মুছে ফেলা হয়েছে।`,`success`)}catch{H.default.fire(`Error`,`মুছতে সমস্যা হয়েছে`,`error`)}}async function Qr(e,t,n,r,i){if(!await W(`খরচ সংশোধন`))return;let a=decodeURIComponent(i||``);document.getElementById(`exp-date`).value=B(t);let o=document.getElementById(`exp-category`);if(o){if(!Array.from(o.options).some(e=>e.value===n)){let e=document.createElement(`option`);e.value=n,e.text=n,o.insertBefore(e,o.lastChild)}o.value=n}document.getElementById(`exp-amount`).value=r,document.getElementById(`exp-details`).value=a,Yr=e;let s=document.getElementById(`save-exp-btn`);s&&(s.innerHTML=`<i class="fa-solid fa-pen-to-square"></i> আপডেট খরচ`,s.className=`m3-btn-primary px-6 h-[42px] py-0 text-sm font-black uppercase tracking-widest w-full flex items-center justify-center gap-2 !bg-amber-600 shadow-lg`),window.scrollTo({top:0,behavior:`smooth`})}async function $r(){let e=document.getElementById(`exp-category`);if(e.value===`ADD_NEW`){let{value:t}=await H.default.fire({title:`নতুন ক্যাটাগরি`,input:`text`,showCancelButton:!0});if(t&&t.trim()){let n=document.createElement(`option`);n.value=t.trim(),n.text=t.trim(),e.insertBefore(n,e.lastChild),e.value=t.trim()}else e.selectedIndex=0}}async function ei(){let e=R(),{value:t}=await H.default.fire({title:`<i class="fa-solid fa-chart-pie text-blue-400 mr-2"></i>খরচের রিপোর্ট তৈরি করুন`,html:`
            <div class="text-left space-y-4 font-bn p-2">
                <div>
                    <label class="block text-[11px] font-black text-blue-400 uppercase tracking-widest mb-1.5 ml-1">শুরুর তারিখ</label>
                    <input id="rep-start" class="m3-field datepicker" value="${e}">
                </div>
                <div>
                    <label class="block text-[11px] font-black text-blue-400 uppercase tracking-widest mb-1.5 ml-1">শেষ তারিখ</label>
                    <input id="rep-end" class="m3-field datepicker" value="${e}">
                </div>
            </div>`,showCancelButton:!0,confirmButtonText:`রিপোর্ট তৈরি করুন`,cancelButtonText:`বাতিল`,customClass:{popup:`!bg-slate-900 !text-white !rounded-3xl border border-slate-700`,title:`!text-white`,confirmButton:`m3-btn-primary !bg-blue-600`,cancelButton:`m3-btn-tonal`},preConfirm:()=>{let e=document.getElementById(`rep-start`).value,t=document.getElementById(`rep-end`).value;return!e||!t?H.default.showValidationMessage(`উভয় তারিখ দেওয়া আবশ্যক!`):{start:z(e),end:z(t)}}});if(t){H.default.fire({title:`রিপোর্ট তৈরি হচ্ছে...`,didOpen:()=>H.default.showLoading(),allowOutsideClick:!1});try{let e=(await p.getAll(`date`,`desc`)).filter(e=>e.date>=t.start&&e.date<=t.end);if(e.length===0)return H.default.fire(`Error`,`এই সময়ের মধ্যে কোনো খরচ পাওয়া যায়নি!`,`error`);await ti(e,t.start,t.end),H.default.close()}catch(e){console.error(e),H.default.fire(`Error`,`রিপোর্ট জেনারেট ব্যর্থ হয়েছে`,`error`)}}}async function ti(e,t,n){let r=await g.getAppSettings();r.shopName,r.shopOwner,r.shopPhone,r.shopAddress;let i=`${B(t)} হতে ${B(n)}`;e.sort((e,t)=>new Date(e.date)-new Date(t.date));let a=0,o={};e.forEach(e=>{let t=Number(e.amount)||0;a+=t,o[e.category]=(o[e.category]||0)+t});let s=document.getElementById(`print-receipt-container`);s||(s=document.createElement(`div`),s.id=`print-receipt-container`,document.body.appendChild(s)),s.className=`print-a4`,s.innerHTML=`
        <style>
            .a4-wrapper { padding: 0; color: #0f172a; font-family: 'Kalpurush', 'Hind Siliguri', sans-serif; }
            .header-card {
                background: #0369a1 !important;
                color: white !important;
                display: flex;
                justify-content: space-between;
                align-items: center;
                border-radius: 12px;
                margin-bottom: 20px;
                box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1);
                padding: 15px 30px;
                -webkit-print-color-adjust: exact;
            }
            .logo-box {
                width: 85px; height: 85px; background: white; border-radius: 50%;
                display: flex; align-items: center; justify-content: center;
                overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1);
                padding: 6px; flex-shrink: 0;
            }
            .shop-info h1 { font-size: 28px; font-weight: 900; margin: 0; letter-spacing: -0.5px; text-transform: uppercase; }
            .shop-info p { font-size: 12px; margin: 4px 0 0 0; opacity: 0.9; font-weight: 500; }

            .badge-box {
                font-size: 22px; font-weight: 900; background: rgba(255,255,255,0.15);
                padding: 8px 25px; border-radius: 12px; border: 1.5px solid rgba(255,255,255,0.3);
                text-align: center;
            }
            .date-range { font-size: 10px; font-weight: 700; margin-top: 8px; opacity: 0.8; text-align: right; }

            .summary-grid { display: grid; grid-template-columns: 1.4fr 1fr; gap: 15px; margin-bottom: 20px; align-items: stretch; }
            .compact-card { background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; padding: 12px 18px; border-left: 5px solid #0f172a; }
            .card-title { font-size: 9px; font-weight: 900; color: #64748b; text-transform: uppercase; border-bottom: 1px solid #e2e8f0; padding-bottom: 4px; margin-bottom: 10px; letter-spacing: 0.5px; }

            .sum-row { display: flex; justify-content: space-between; align-items: center; padding: 6px 12px; border-left: 5px solid transparent; margin-bottom: 6px; background: white; border-radius: 6px; border: 1px solid #e2e8f0; }
            .sum-row.total { border-left-color: #dc2626; }
            .sum-row.count { border-left-color: #10b981; }
            .sum-row.balance { border-left-color: #1e40af; background: #eff6ff !important; border-left-width: 5px; }

            .cat-pill { font-size: 9px; font-weight: 900; background: #f1f5f9; padding: 3px 8px; border-radius: 6px; border: 1px solid #cbd5e1; color: #0369a1; display: inline-block; margin: 2px; }

            .report-table { width: 100%; border-collapse: collapse; margin-top: 10px; font-size: 11px; border: 1px solid #cbd5e1; }
            .report-table th { background: #f1f5f9 !important; color: #0f172a !important; padding: 10px; text-align: left; font-weight: 900; text-transform: uppercase; border-bottom: 1.5px solid #0f172a; -webkit-print-color-adjust: exact; }
            .report-table td { border-bottom: 1px solid #e2e8f0; padding: 8px 12px; color: #0f172a; }
            .report-table .text-right { text-align: right; }
            .footer-block { margin-top: 60px; display: flex; justify-content: space-between; font-size: 11px; font-weight: 800; color: #64748b; }
            .sig-line { border-top: 1.5px dashed #64748b; padding-top: 6px; width: 160px; text-align: center; color: #0f172a; }
        </style>

        <div class="a4-wrapper font-bn">
            ${Ve(r,{title:`EXPENSE STATEMENT`,dateRangeStr:i})}

            <div class="summary-grid">
                <!-- CATEGORY SUMMARY (Matches Column 1 style) -->
                <div class="compact-card">
                    <div class="card-title">Category-wise Summary</div>
                    <div style="display: flex; flex-wrap: wrap; gap: 4px;">
                        ${Object.keys(o).map(e=>`
                            <div class="cat-pill">${P(e)}: ৳${F(o[e])}</div>
                        `).join(``)}
                    </div>
                </div>

                <!-- FINANCIAL SUMMARY (Matches Column 2 style) -->
                <div class="compact-card" style="border-left: 0; padding: 12px 15px;">
                    <div class="card-title">Expense Summary</div>
                    <div class="sum-row total">
                        <span style="font-size:10px; font-weight:900; color:#64748b;">TOTAL EXPENSE</span>
                        <strong style="font-size:14px; color:#dc2626;">৳ ${F(a)}</strong>
                    </div>
                    <div class="sum-row count">
                        <span style="font-size:10px; font-weight:900; color:#64748b;">TOTAL ENTRIES</span>
                        <strong style="font-size:14px; color:#059669;">${e.length} টি</strong>
                    </div>
                    <div class="sum-row balance">
                        <span style="font-size:10px; font-weight:900; color:#1e40af;">NET DEBIT</span>
                        <strong style="font-size:15px; color:#1e40af;">৳ ${F(a)}</strong>
                    </div>
                </div>
            </div>

            <table class="report-table">
                <thead>
                    <tr>
                        <th style="width: 15%">Date</th>
                        <th style="width: 25%">Category</th>
                        <th style="width: 40%">Description</th>
                        <th style="width: 20%; text-align: right;">Amount (৳)</th>
                    </tr>
                </thead>
                <tbody>
                    ${e.map(e=>`
                        <tr>
                            <td style="font-weight: 700;">${B(e.date)}</td>
                            <td><strong>${P(e.category)}</strong></td>
                            <td style="color: #475569;">${P(e.details||`-`)}</td>
                            <td class="text-right" style="font-weight: 900;">${F(e.amount)}</td>
                        </tr>
                    `).join(``)}
                </tbody>
                <tfoot>
                    <tr style="background: #f1f5f9; font-weight: 900;">
                        <td colspan="3" class="text-right" style="padding: 12px;">সর্বমোট খরচ:</td>
                        <td class="text-right" style="padding: 12px; font-size: 14px; color: #dc2626;">৳ ${F(a)}</td>
                    </tr>
                </tfoot>
            </table>

            <div class="footer-block">
                <p>রিপোর্ট জেনারেট: ${new Date().toLocaleString(`en-GB`)}</p>
                <div class="sig-line">কর্তৃপক্ষের স্বাক্ষর</div>
            </div>
        </div>
    `,ot(s)}window.saveExpense=Xr,window.deleteExpense=Zr,window.editExpense=Qr,window.handleCategoryChange=$r,window.loadRecentExpenses=Kr,window.changeExpensePage=Jr,window.generateExpenseReport=ei,window.promptSecurityPin=W;var ni=t({checkSmsLength:()=>ii,sendTestSMS:()=>ai,unlockSmsSettings:()=>ri});async function ri(){if(window.AppState.currentUserRole!==`Admin`)return H.default.fire(`অ্যাক্সেস ডিনাইড!`,`শুধুমাত্র অ্যাডমিন সেটিংস পরিবর্তন করতে পারবেন।`,`error`);await W(`SMS সেটিংস পরিবর্তন (Settings Unlock)`)&&([`set-sms-reminder`,`set-sms-opening`,`set-sms-new-bill`,`set-sms-payment`,`set-sms-api`,`set-sms-sender`,`set-sms-auto`].forEach(e=>{let t=document.getElementById(e);t&&(t.disabled=!1,t.style.opacity=`1`)}),H.default.fire({toast:!0,position:`top-end`,icon:`success`,title:`SMS সেটিংস আনলক করা হয়েছে`,showConfirmButton:!1,timer:3e3,customClass:{popup:`!bg-slate-900 !text-white border border-slate-700`}}))}function ii(e,t){if(!e)return;let n=e.value||``,r=n.length,i=/[^\x00-\x7F]/.test(n),a=i?70:160,o=Math.ceil(r/a)||1,s=document.getElementById(t);s&&(s.innerText=`${r}/${a} (${o} SMS${i?` - বাংলা`:``})`,o>1?(s.classList.add(`text-amber-400`),s.classList.remove(`text-purple-300`)):(s.classList.remove(`text-amber-400`),s.classList.add(`text-purple-300`)))}async function ai(){if(!document.getElementById(`set-sms-api`)?.value.trim())return H.default.fire({title:`API Key প্রয়োজন!`,text:`প্রথমে SMS Settings-এ আপনার BulkSMSBD API Key দিন এবং সেভ করুন।`,icon:`warning`,customClass:{popup:`!bg-slate-900 !text-white !rounded-3xl border border-slate-700`}});let{value:e}=await H.default.fire({title:`Send Test SMS`,input:`text`,inputLabel:`পরীক্ষামূলক মেসেজ পাঠাতে মোবাইল নম্বরটি লিখুন:`,inputPlaceholder:`018XXXXXXXX`,showCancelButton:!0,confirmButtonText:`Send Test SMS`,customClass:{popup:`!bg-slate-900 !text-white !rounded-3xl border border-slate-700`},inputValidator:e=>!e||e.trim().length<11?`সঠিক ১১-ডিজিটের মোবাইল নম্বর দিন!`:null});e&&(H.default.fire({title:`SMS পাঠানো হচ্ছে...`,allowOutsideClick:!1,didOpen:()=>H.default.showLoading()}),await De(e.trim(),`MAA ERP Test SMS: Your BulkSMSBD SMS Gateway is working perfectly! - M/S. Maa Motors`,!1)?H.default.fire({title:`সফল!`,text:`টেস্ট মেসেজ পাঠানো হয়েছে।`,icon:`success`}):H.default.fire({title:`ব্যর্থ!`,text:`API Key বা ব্যালেন্স চেক করুন।`,icon:`error`}))}window.unlockSmsSettings=ri,window.checkSmsLength=ii,window.sendTestSMS=ai;var oi=t({getCurrentLogo:()=>ci,handleLogoSelect:()=>di,setCurrentLogo:()=>li,unlockShopSettings:()=>ui}),si=null;function ci(){return si}function li(e){si=e;let t=document.getElementById(`logo-preview`);t&&e&&(t.src=e,t.classList.remove(`hidden`))}async function ui(){if(window.AppState.currentUserRole!==`Admin`)return H.default.fire(`অ্যাক্সেস ডিনাইড!`,`শুধুমাত্র অ্যাডমিন সেটিংস পরিবর্তন করতে পারবেন।`,`error`);await W(`দোকানের তথ্য পরিবর্তন (Settings Unlock)`)&&([`set-shop-name`,`set-shop-owner`,`set-shop-phone`,`set-shop-address`,`set-shop-logo`,`set-print-size`,`set-show-watermark`].forEach(e=>{let t=document.getElementById(e);t&&(t.disabled=!1,t.style.opacity=`1`)}),H.default.fire({toast:!0,position:`top-end`,icon:`success`,title:`সেটিংস আনলক করা হয়েছে`,showConfirmButton:!1,timer:3e3,customClass:{popup:`!bg-slate-900 !text-white border border-slate-700`}}))}function di(e){let t=e.target.files[0];if(!t)return;let n=new FileReader;n.onload=function(e){let t=new Image;t.onload=function(){let e=document.createElement(`canvas`),n=1;t.width>300&&(n=300/t.width),e.width=t.width*n,e.height=t.height*n,e.getContext(`2d`).drawImage(t,0,0,e.width,e.height),li(e.toDataURL(`image/png`,.8))},t.src=e.target.result},n.readAsDataURL(t)}window.unlockShopSettings=ui,window.handleLogoSelect=di;function fi(){let e=Me(),t=Ne();return`
        <div class="p-3.5 rounded-2xl ${e?`bg-amber-500/10 border border-amber-500/30 text-amber-300`:`bg-slate-900 border border-slate-800 text-slate-300`} flex flex-col sm:flex-row items-center justify-between gap-3">
            <div class="flex items-center gap-3">
                <div class="w-3 h-3 rounded-full ${e?`bg-amber-400 animate-ping`:`bg-emerald-500`}"></div>
                <div>
                    <div class="text-xs font-black">${e?`<i class="fa-solid fa-bolt text-amber-400 mr-1"></i> সেশন পিন পজ চালুকৃত (বাকি সময়: ${t} মিনিট)`:`<i class="fa-solid fa-lock text-emerald-400 mr-1"></i> পিন সিকিউরিটি স্বয়ংক্রিয়ভাবে সক্রিয় আছে`}</div>
                    <div class="text-[11px] text-slate-400 font-medium">${e?`পজ থাকা অবস্থায় যেকোনো এডিট বা ডিলেটে পিন চাইবে না`:`পজ করতে ডানপাশের টাইম সিলেক্ট করুন`}</div>
                </div>
            </div>
            <div class="flex items-center gap-2 shrink-0">
                ${e?`
                    <button type="button" id="btn-cancel-pause" class="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold cursor-pointer">
                        <i class="fa-solid fa-play mr-1"></i> পিন চালু করুন
                    </button>
                `:`
                    <button type="button" id="btn-pause-10m" class="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-amber-400 border border-slate-700 text-xs font-bold cursor-pointer"><i class="fa-solid fa-clock mr-1"></i> ১০ মি. পজ</button>
                    <button type="button" id="btn-pause-1h" class="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-amber-400 border border-slate-700 text-xs font-bold cursor-pointer"><i class="fa-solid fa-clock mr-1"></i> ১ ঘণ্টা পজ</button>
                `}
            </div>
        </div>
    `}function pi(){return`
        <!-- 15-Point Security Checkpoint Policy Control Center -->
        <div class="m3-card lg:col-span-2 space-y-5 border border-red-500/30 bg-slate-950/80">
            <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
                <div>
                    <h3 class="font-black text-white text-base flex items-center gap-2">
                        <i class="fa-solid fa-shield-halved text-red-400"></i>
                        ১৫-পয়েন্ট প্রফেশনাল সিকিউরিটি ও পিন কন্ট্রোল সেন্টার
                    </h3>
                    <p class="text-xs font-bold text-slate-400 mt-1">মাস্টার পাসওয়ার্ড দিয়ে আনলক করে যেকোনো কাজের জন্য পিন অন/অফ বা সাময়িক পজ করুন</p>
                </div>
                <div class="flex items-center gap-2">
                    <button type="button" id="btn-unlock-policy" class="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-black flex items-center gap-1.5 shadow-lg shadow-red-600/30 cursor-pointer">
                        <i class="fa-solid fa-lock text-xs"></i> <span>মাস্টার পাসওয়ার্ড আনলক</span>
                    </button>
                    <button type="button" id="btn-change-hard-pass" class="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 text-xs font-bold cursor-pointer">
                        <i class="fa-solid fa-key text-xs text-amber-400"></i> পাসওয়ার্ড পরিবর্তন
                    </button>
                </div>
            </div>

            <!-- Timed Session PIN Bypass Status Bar -->
            <div id="pin-bypass-status-container">
                ${fi()}
            </div>

            <!-- 15 Checkbox Policy Options Container (Locked by default) -->
            <div id="policy-checkbox-container" class="opacity-50 pointer-events-none transition-all space-y-4 pt-2">
                <p class="text-xs text-amber-400 font-bold italic border-b border-slate-800 pb-2"><i class="fa-solid fa-lock mr-1.5"></i>চেকপয়েন্টসমূহ আনলক করতে উপরের "মাস্টার পাসওয়ার্ড আনলক" বাটনে ক্লিক করুন</p>

                <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                    <!-- 1. Data Deletion -->
                    <div class="p-3 rounded-xl bg-slate-900/80 border border-slate-800 space-y-2">
                        <span class="text-[11px] font-black text-red-400 uppercase tracking-wider block border-b border-slate-800 pb-1"><i class="fa-solid fa-trash-can mr-1"></i>ডাটা ডিলেশন সেফটি</span>
                        <label class="flex items-center gap-2.5 cursor-pointer text-xs font-bold text-slate-200"><input type="checkbox" id="pol-deleteCustomer" class="pol-chk w-4 h-4"> কাস্টমার প্রোফাইল ডিলেট</label>
                        <label class="flex items-center gap-2.5 cursor-pointer text-xs font-bold text-slate-200"><input type="checkbox" id="pol-deleteTxn" class="pol-chk w-4 h-4"> খতিয়ান লেনদেন ডিলেট</label>
                        <label class="flex items-center gap-2.5 cursor-pointer text-xs font-bold text-slate-200"><input type="checkbox" id="pol-deleteExpense" class="pol-chk w-4 h-4"> দৈনিক খরচ ডিলেট</label>
                        <label class="flex items-center gap-2.5 cursor-pointer text-xs font-bold text-slate-200"><input type="checkbox" id="pol-deleteZone" class="pol-chk w-4 h-4"> জোন তালিকা থেকে ডিলেট</label>
                        <label class="flex items-center gap-2.5 cursor-pointer text-xs font-bold text-slate-200"><input type="checkbox" id="pol-deleteBank" class="pol-chk w-4 h-4"> ব্যাংক বা ক্যাশ অ্যাকাউন্ট ডিলেট</label>
                    </div>

                    <!-- 2. Data Editing -->
                    <div class="p-3 rounded-xl bg-slate-900/80 border border-slate-800 space-y-2">
                        <span class="text-[11px] font-black text-amber-400 uppercase tracking-wider block border-b border-slate-800 pb-1"><i class="fa-solid fa-pen-to-square mr-1"></i>ডাটা এডিটিং সেফটি</span>
                        <label class="flex items-center gap-2.5 cursor-pointer text-xs font-bold text-slate-200"><input type="checkbox" id="pol-editCustomer" class="pol-chk w-4 h-4"> কাস্টমার তথ্য এডিট</label>
                        <label class="flex items-center gap-2.5 cursor-pointer text-xs font-bold text-slate-200"><input type="checkbox" id="pol-editTxn" class="pol-chk w-4 h-4"> পূর্বের লেনদেন এডিট</label>
                        <label class="flex items-center gap-2.5 cursor-pointer text-xs font-bold text-slate-200"><input type="checkbox" id="pol-editExpense" class="pol-chk w-4 h-4"> দৈনিক খরচ এডিট</label>
                        <label class="flex items-center gap-2.5 cursor-pointer text-xs font-bold text-slate-200"><input type="checkbox" id="pol-editSettings" class="pol-chk w-4 h-4"> সফটওয়্যার সেটিংস এডিট</label>
                        <label class="flex items-center gap-2.5 cursor-pointer text-xs font-bold text-slate-200"><input type="checkbox" id="pol-editBank" class="pol-chk w-4 h-4"> ব্যাংক বা ক্যাশ অ্যাকাউন্ট এডিট</label>
                    </div>

                    <!-- 3. Messaging & Financial -->
                    <div class="p-3 rounded-xl bg-slate-900/80 border border-slate-800 space-y-2">
                        <span class="text-[11px] font-black text-emerald-400 uppercase tracking-wider block border-b border-slate-800 pb-1"><i class="fa-solid fa-paper-plane mr-1"></i>মেসেজিং ও ফিনান্স সেফটি</span>
                        <label class="flex items-center gap-2.5 cursor-pointer text-xs font-bold text-slate-200"><input type="checkbox" id="pol-sendTxnSMS" class="pol-chk w-4 h-4"> ট্রানজাকশন SMS পাঠানো</label>
                        <label class="flex items-center gap-2.5 cursor-pointer text-xs font-bold text-slate-200"><input type="checkbox" id="pol-sendReminderSMS" class="pol-chk w-4 h-4"> বকেয়া তাগাদা SMS পাঠানো</label>
                        <label class="flex items-center gap-2.5 cursor-pointer text-xs font-bold text-slate-200"><input type="checkbox" id="pol-sendBulkSMS" class="pol-chk w-4 h-4"> বাল্ক (একসাথে) SMS ডিসপ্যাচ</label>
                        <label class="flex items-center gap-2.5 cursor-pointer text-xs font-bold text-slate-200"><input type="checkbox" id="pol-addExpense" class="pol-chk w-4 h-4"> নতুন খরচ যোগ করা</label>
                        <label class="flex items-center gap-2.5 cursor-pointer text-xs font-bold text-slate-200"><input type="checkbox" id="pol-invoiceDiscount" class="pol-chk w-4 h-4"> ইনভয়েস ডিসকাউন্ট দেওয়া</label>
                        <label class="flex items-center gap-2.5 cursor-pointer text-xs font-bold text-slate-200"><input type="checkbox" id="pol-collectPayment" class="pol-chk w-4 h-4"> ডাইরেক্ট ক্যাশ জমা নেওয়া</label>
                        <label class="flex items-center gap-2.5 cursor-pointer text-xs font-bold text-slate-200"><input type="checkbox" id="pol-exportBackup" class="pol-chk w-4 h-4"> অফলাইন এক্সেল ব্যাকআপ ডাউনলোড</label>
                        <label class="flex items-center gap-2.5 cursor-pointer text-xs font-bold text-slate-200"><input type="checkbox" id="pol-fullSystemBackup" class="pol-chk w-4 h-4 text-indigo-500"> ১-ক্লিক ফুল ডাটাবেস ব্যাকআপ</label>
                        <label class="flex items-center gap-2.5 cursor-pointer text-xs font-bold text-red-400"><input type="checkbox" id="pol-fullSystemRestore" class="pol-chk w-4 h-4 text-red-500"> সম্পূর্ণ ডাটাবেস রিস্টোর</label>
                    </div>
                </div>
            </div>
        </div>
    `}function mi(){let e=document.getElementById(`btn-unlock-policy`),t=document.getElementById(`btn-change-hard-pass`),n=document.getElementById(`policy-checkbox-container`),r=()=>{let e=document.getElementById(`btn-pause-10m`),t=document.getElementById(`btn-pause-1h`),n=document.getElementById(`btn-cancel-pause`),i=()=>{let e=document.getElementById(`pin-bypass-status-container`);e&&(e.innerHTML=fi(),r())};e&&e.addEventListener(`click`,async()=>{await Le()&&(Pe(10),i())}),t&&t.addEventListener(`click`,async()=>{await Le()&&(Pe(60),i())}),n&&n.addEventListener(`click`,()=>{Pe(0),i()})};r(),e&&e.addEventListener(`click`,async()=>{await Le()&&(n&&n.classList.remove(`opacity-50`,`pointer-events-none`),e.innerHTML=`<i class="fa-solid fa-lock-open text-xs"></i> <span>আনলকড (Unlocked)</span>`,e.className=`px-4 py-2 rounded-xl bg-emerald-600 text-white text-xs font-black flex items-center gap-1.5`,K(`১৫-পয়েন্ট সিকিউরিটি পলিসি আনলক করা হয়েছে`,`success`))}),t&&t.addEventListener(`click`,async()=>{if(!await Le())return;let{value:e}=await H.default.fire({title:`<div class="flex items-center justify-center gap-2 font-bn font-black text-lg text-white"><i class="fa-solid fa-key text-amber-400"></i><span>নতুন মাস্টার পাসওয়ার্ড সেট করুন</span></div>`,html:`
                    <div class="space-y-3 font-bn text-left p-1">
                        <p class="text-xs text-slate-300 mb-2">আপনার নতুন সিকিউরিটি পাসওয়ার্ডটি লিখুন (কমপক্ষে ৪ অক্ষর):</p>
                        <div class="relative w-full">
                            <input id="sw-new-pass-inp" type="password" class="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-white outline-none focus:border-amber-500 text-sm font-mono pr-10" placeholder="নতুন পাসওয়ার্ড লিখুন">
                            <button type="button" id="sw-new-pass-eye" class="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white text-sm cursor-pointer p-1">
                                <i class="fa-solid fa-eye"></i>
                            </button>
                        </div>
                    </div>
                `,focusConfirm:!1,showCancelButton:!0,confirmButtonText:`<i class="fa-solid fa-check mr-1.5"></i> সেভ পাসওয়ার্ড`,cancelButtonText:`বাতিল`,customClass:{popup:`!bg-slate-950 !text-white !rounded-3xl border border-slate-800 font-bn`,confirmButton:`m3-btn-primary !bg-amber-600 hover:!bg-amber-500 !px-6 !py-2.5 rounded-xl font-bold`,cancelButton:`m3-btn-tonal !bg-slate-800 hover:!bg-slate-700 !text-slate-300 !px-5 !py-2.5 rounded-xl font-bold`},didOpen:()=>{let e=document.getElementById(`sw-new-pass-inp`),t=document.getElementById(`sw-new-pass-eye`);e&&(e.addEventListener(`keydown`,e=>{e.key===`Enter`&&(e.preventDefault(),H.default.clickConfirm())}),t&&(t.onclick=()=>{let n=e.type===`password`;e.type=n?`text`:`password`,t.innerHTML=n?`<i class="fa-solid fa-eye-slash text-amber-400"></i>`:`<i class="fa-solid fa-eye text-slate-400"></i>`}),setTimeout(()=>e.focus(),150))},preConfirm:()=>{let e=document.getElementById(`sw-new-pass-inp`)?.value?.trim();return!e||e.length<4?(H.default.showValidationMessage(`কমপক্ষে ৪ অক্ষরের পাসওয়ার্ড দিন!`),!1):e}});e&&(await g.updateAppSettings({masterPasswordHash:e.trim()}),K(`মাস্টার পাসওয়ার্ড পরিবর্তন সফল হয়েছে`,`success`))})}async function hi(){let e=await Fe();Object.keys(e).forEach(t=>{let n=document.getElementById(`pol-${t}`);n&&(n.checked=!!e[t])})}function gi(){let e={};return document.querySelectorAll(`.pol-chk`).forEach(t=>{let n=t.id.replace(`pol-`,``);e[n]=t.checked}),e}function _i(){return`
        <div class="m3-card lg:col-span-2 space-y-4 border border-indigo-500/20 bg-slate-900/60 backdrop-blur-xl">
            <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
                <div>
                    <h3 class="font-black text-white text-base flex items-center gap-2">
                        <i class="fa-solid fa-map-location-dot text-indigo-400 text-lg"></i>
                        <span>জোন ও অঞ্চল ব্যবস্থাপনা (Zone Setup & Routing)</span>
                    </h3>
                    <p class="text-xs text-slate-400 mt-0.5">দোকানের প্রতিটি জোনের শর্ট কোড ও কাস্টমার হিসাব আইডি পরিচালনা করুন</p>
                </div>
                <div class="flex items-center gap-2">
                    <button type="button" onclick="window.healAccountNumbersFlow()" class="px-3 py-2 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400 hover:bg-amber-500/20 text-xs font-bold transition flex items-center gap-1.5" title="ভুল একাউন্ট নম্বর অটো ফিক্স করুন">
                        <i class="fa-solid fa-wand-magic-sparkles"></i>
                        <span>একাউন্ট আইডি ফিক্স</span>
                    </button>
                    <button type="button" onclick="window.showAddZoneModal()" class="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition flex items-center gap-1.5 shadow-lg shadow-indigo-600/30">
                        <i class="fa-solid fa-circle-plus"></i>
                        <span>নতুন জোন যোগ করুন</span>
                    </button>
                </div>
            </div>

            <div id="zone-list-container" class="overflow-x-auto min-h-[140px]">
                <div class="text-center text-slate-400 py-8 text-xs font-bn">
                    <i class="fa-solid fa-spinner fa-spin text-indigo-400 text-lg mb-2"></i>
                    <p>জোন ডাটা লোড হচ্ছে...</p>
                </div>
            </div>
        </div>
    `}async function vi(){let e=document.getElementById(`zone-list-container`);if(e)try{let[t,n]=await Promise.all([v.getAllZones(),a.getAll()]);if(!t||t.length===0){e.innerHTML=`
                <div class="text-center text-slate-400 py-8 text-xs font-bn bg-slate-950/40 rounded-2xl border border-slate-800">
                    <i class="fa-solid fa-folder-open text-slate-500 text-2xl mb-2"></i>
                    <p>কোনো জোন নিবন্ধিত নেই। "নতুন জোন যোগ করুন" বাটনে ক্লিক করে প্রথম জোন যোগ করুন।</p>
                </div>`;return}let r={};n.forEach(e=>{let t=(e.zone||`General`).trim();r[t]=(r[t]||0)+1}),e.innerHTML=`
            <table class="w-full text-left border-collapse">
                <thead>
                    <tr class="border-b border-slate-800 text-[11px] text-slate-400 font-black uppercase tracking-wider bg-slate-950/40">
                        <th class="py-2.5 px-4">জোনের নাম</th>
                        <th class="py-2.5 px-4">জোন কোড</th>
                        <th class="py-2.5 px-4">মোট কাস্টমার</th>
                        <th class="py-2.5 px-4 text-right">অ্যাকশন</th>
                    </tr>
                </thead>
                <tbody>${t.map(e=>{let t=r[e.name]||0,n=e.code||`N/A`;return`
                <tr class="border-b border-slate-800/60 hover:bg-slate-800/30 transition text-xs font-bn">
                    <td class="py-3 px-4 text-white font-bold flex items-center gap-2">
                        <div class="w-7 h-7 rounded-lg bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center font-mono font-bold text-xs">
                            ${n}
                        </div>
                        <span>${e.name}</span>
                    </td>
                    <td class="py-3 px-4 text-slate-300 font-mono font-bold">
                        <span class="px-2 py-0.5 rounded bg-slate-800 border border-slate-700 text-amber-400 text-[11px]">${n}</span>
                    </td>
                    <td class="py-3 px-4 text-slate-300">
                        <span class="px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-400 font-bold border border-blue-500/20">${t} জন কাস্টমার</span>
                    </td>
                    <td class="py-3 px-4 text-right">
                        <div class="flex items-center justify-end gap-1.5">
                            <button type="button" onclick="window.resequenceZoneModal('${e.name}')" class="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-[11px] font-bold transition flex items-center gap-1" title="সিরিয়াল ১, ২, ৩... অনুযায়ী পুনঃসাজান">
                                <i class="fa-solid fa-list-ol text-blue-400"></i>
                                <span class="hidden sm:inline">পুনঃসাজান</span>
                            </button>
                            <button type="button" onclick="window.showEditZoneModal('${e.id}', '${e.name}', '${n}')" class="p-1.5 rounded-lg bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 transition" title="এডিট করুন">
                                <i class="fa-solid fa-pen-to-square"></i>
                            </button>
                            <button type="button" onclick="window.deleteZoneFlow('${e.id}', '${e.name}')" class="p-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 transition" title="ডিলেট করুন">
                                <i class="fa-solid fa-trash-can"></i>
                            </button>
                        </div>
                    </td>
                </tr>
            `}).join(``)}</tbody>
            </table>
        `}catch(t){console.error(`loadZoneList error:`,t),e.innerHTML=`<div class="text-center text-red-400 py-6 text-xs font-bn">জোন ডাটা লোড করতে ব্যর্থ হয়েছে</div>`}}async function yi(){let{value:e}=await H.default.fire({title:`<div class="flex items-center justify-center gap-2 text-indigo-400 font-bn font-black"><i class="fa-solid fa-map-location-dot"></i><span>নতুন জোন যোগ করুন</span></div>`,html:`
            <div class="space-y-3 text-left font-bn p-2">
                <div>
                    <label class="block text-xs font-bold text-slate-300 mb-1">জোনের নাম * (যেমন: চট্টগ্রাম জোন)</label>
                    <input id="sw-zn-name" class="m3-field text-xs font-bold" placeholder="জোনের নাম">
                </div>
                <div>
                    <label class="block text-xs font-bold text-slate-300 mb-1">জোন শর্ট কোড * (যেমন: 2, 3 বা CTG)</label>
                    <input id="sw-zn-code" class="m3-field text-xs font-bold font-mono uppercase" placeholder="যেমন: 2">
                    <p class="text-[10px] text-slate-400 mt-1">এই কোডটি কাস্টমার একাউন্ট আইডির পূর্বে যুক্ত হবে (যেমন: জোন ২ হলে আইডি ২০০০০১)</p>
                </div>
            </div>`,showCancelButton:!0,confirmButtonText:`<i class="fa-solid fa-floppy-disk mr-1.5"></i>সেভ করুন`,cancelButtonText:`বাতিল`,customClass:{popup:`!bg-slate-950 !text-white !rounded-3xl border border-slate-800 font-bn`},preConfirm:()=>{let e=document.getElementById(`sw-zn-name`)?.value?.trim(),t=document.getElementById(`sw-zn-code`)?.value?.trim()?.toUpperCase();return!e||!t?H.default.showValidationMessage(`জোনের নাম ও শর্ট কোড উভয়ই আবশ্যক!`):{name:e,code:t}}});if(e)try{let t=await v.getByCode(e.code);if(t)return H.default.fire(`সতর্কতা!`,`জোন কোড "${e.code}" ইতোমধ্যে "${t.name}" জোনে ব্যবহৃত হচ্ছে!`,`warning`);await v.add({name:e.name,code:e.code}),O(`CREATE_ZONE`,`Settings`,e.name,`Code: ${e.code}`),H.default.fire(`সফল!`,`নতুন জোন "${e.name}" (কোড: ${e.code}) তৈরি হয়েছে।`,`success`),vi(),window.loadAllZones&&window.loadAllZones()}catch(e){console.error(`showAddZoneModal error:`,e),H.default.fire(`ত্রুটি!`,`জোন সেভ করতে সমস্যা হয়েছে।`,`error`)}}async function bi(e,t,n){let{value:r}=await H.default.fire({title:`<div class="flex items-center justify-center gap-2 text-indigo-400 font-bn font-black"><i class="fa-solid fa-pen-to-square"></i><span>জোন এডিট করুন</span></div>`,html:`
            <div class="space-y-3 text-left font-bn p-2">
                <div>
                    <label class="block text-xs font-bold text-slate-300 mb-1">জোনের নাম *</label>
                    <input id="sw-ezn-name" class="m3-field text-xs font-bold" value="${t}">
                </div>
                <div>
                    <label class="block text-xs font-bold text-slate-300 mb-1">জোন শর্ট কোড *</label>
                    <input id="sw-ezn-code" class="m3-field text-xs font-bold font-mono uppercase" value="${n}">
                </div>
            </div>`,showCancelButton:!0,confirmButtonText:`<i class="fa-solid fa-check mr-1.5"></i>আপডেট করুন`,cancelButtonText:`বাতিল`,customClass:{popup:`!bg-slate-950 !text-white !rounded-3xl border border-slate-800 font-bn`},preConfirm:()=>{let e=document.getElementById(`sw-ezn-name`)?.value?.trim(),t=document.getElementById(`sw-ezn-code`)?.value?.trim()?.toUpperCase();return!e||!t?H.default.showValidationMessage(`জোনের নাম ও কোড উভয়ই আবশ্যক!`):{name:e,code:t}}});if(r)try{let i=r.code!==n,o=!1;if(i&&(o=(await H.default.fire({title:`জোন কোড পরিবর্তন সতর্কতা!`,text:`আপনি জোন কোড "${n}" থেকে "${r.code}"-এ পরিবর্তন করছেন। আপনি কি এই জোনের সকল কাস্টমারের একাউন্ট আইডি নতুন জোন কোডে অটোমেটিক আপডেট করতে চান?`,icon:`question`,showCancelButton:!0,confirmButtonText:`হ্যাঁ, কাস্টমার একাউন্ট আপডেট করুন`,cancelButtonText:`না, শুধু জোন আপডেট করুন`,customClass:{popup:`!bg-slate-900 !text-white !rounded-3xl border border-slate-700 font-bn`}})).isConfirmed),await v.update(e,{name:r.name,code:r.code}),o){H.default.fire({title:`কাস্টমার আইডি আপডেট হচ্ছে...`,allowOutsideClick:!1,didOpen:()=>H.default.showLoading()});let e=(await a.getAll()).filter(e=>(e.zone||``).trim()===t||(e.zone||``).trim()===r.name);for(let t of e){let e=(t.accountNo||``).match(/\d+$/),n=e?e[0].slice(-4):`0001`,i=r.code+n.padStart(4,`0`);await a.update(t.id,{zone:r.name,accountNo:i})}}O(`UPDATE_ZONE`,`Settings`,e,`${r.name} (${r.code})`),H.default.fire(`সফল!`,`জোনের তথ্য আপডেট হয়েছে।`,`success`),vi(),window.loadAllZones&&window.loadAllZones()}catch(e){console.error(`showEditZoneModal error:`,e),H.default.fire(`ত্রুটি!`,`জোন আপডেট করা সম্ভব হয়নি।`,`error`)}}async function xi(e,t){if(await W(`জোন ডিলেট করা (Security Check)`))try{let n=(await a.getAll()).filter(e=>(e.zone||``).trim()===t);if(n.length>0)return H.default.fire({title:`ডিলেট করা যাবে না!`,text:`এই জোনে (${t}) ${n.length} জন কাস্টমার নিবন্ধিত আছেন। প্রথমে কাস্টমারদের অন্য জোনে সরান।`,icon:`warning`,customClass:{popup:`!bg-slate-900 !text-white !rounded-3xl border border-slate-700 font-bn`}});await v.delete(e),O(`DELETE_ZONE`,`Settings`,e,t),H.default.fire(`সফল!`,`জোন "${t}" সফলভাবে ডিলেট করা হয়েছে।`,`success`),vi(),window.loadAllZones&&window.loadAllZones()}catch(e){console.error(`deleteZoneFlow error:`,e),H.default.fire(`ত্রুটি!`,`জোন ডিলেট করা সম্ভব হয়নি।`,`error`)}}window.showAddZoneModal=yi,window.showEditZoneModal=bi,window.deleteZoneFlow=xi;function Si(e){if(window.AppState.currentUserRole!==`Admin`){e.innerHTML=`<div class="m3-card text-center font-bn py-12"><h2 class="text-xl font-black text-red-500">অ্যাক্সেস ডিনাইড!</h2></div>`;return}e.innerHTML=`
        <div class="flex flex-col gap-6 pb-28 font-bn max-w-7xl mx-auto">
            <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 px-2 py-3 border-b border-slate-800/80">
                <div>
                    <h2 class="text-2xl font-black flex items-center gap-3 text-white tracking-tight">
                        <div class="w-2.5 h-8 bg-gradient-to-b from-blue-500 to-indigo-600 rounded-full shadow-[0_0_18px_rgba(59,130,246,0.6)]"></div>
                        সফটওয়্যার সেটিংস
                    </h2>
                    <p class="text-xs font-bold text-slate-300 mt-1 ml-5">দোকানের প্রোফাইল, প্রিন্টিং ফরম্যাট, SMS এবং ১৫-পয়েন্ট সিকিউরিটি পলিসি ম্যানেজ করুন</p>
                </div>
            </div>

            <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <!-- Shop Settings -->
                <div class="m3-card space-y-5">
                    <div class="flex justify-between items-center border-b border-slate-800 pb-3">
                        <h3 class="font-black text-white text-base">দোকানের সাধারণ তথ্য</h3>
                        <button class="px-3.5 py-1.5 rounded-xl bg-blue-500/10 border border-blue-500/30 text-blue-400 text-xs font-bold" onclick="window.unlockShopSettings()">আনলক করুন</button>
                    </div>
                    <div class="space-y-4">
                        <input type="text" id="set-shop-name" disabled class="m3-field opacity-80" placeholder="দোকানের নাম">
                        <input type="text" id="set-shop-owner" disabled class="m3-field opacity-80" placeholder="প্রোপাইটার নাম (যেমন: Mohammed Amran)">
                        <input type="text" id="set-shop-phone" disabled class="m3-field opacity-80" placeholder="মোবাইল নম্বর">
                        <textarea id="set-shop-address" rows="2" disabled class="m3-field opacity-80 resize-none" placeholder="ঠিকানা"></textarea>
                        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <input type="file" id="set-shop-logo" disabled class="m3-field opacity-80 text-xs" onchange="window.handleLogoSelect(event)">
                            <div class="flex items-center justify-center"><img id="logo-preview" src="" class="h-16 hidden rounded-xl" alt="Preview"></div>
                        </div>
                        <select id="set-print-size" disabled class="m3-field opacity-80">
                            <option value="a4">A4 (রেগুলার ফুল পেপার)</option>
                            <option value="pos">POS (৮০ মিমি থার্মাল রসিদ)</option>
                        </select>
                    </div>
                </div>

                <!-- SMS Gateway Settings -->
                <div class="m3-card space-y-4">
                    <div class="flex justify-between items-center border-b border-slate-800 pb-3">
                        <h3 class="font-black text-white text-base">SMS গেইটওয়ে সেটিংস (BulkSMSBD)</h3>
                        <button class="px-3.5 py-1.5 rounded-xl bg-blue-500/10 border border-blue-500/30 text-blue-400 text-xs font-bold" onclick="window.unlockSmsSettings()">আনলক করুন</button>
                    </div>
                    <div class="space-y-3">
                        <div>
                            <div class="flex justify-between text-xs font-bold mb-1"><span class="text-slate-300">একাউন্ট খোলা SMS টেমপ্লেট</span><span id="sms-open-count" class="text-emerald-400">0/155</span></div>
                            <textarea id="set-sms-opening" rows="2" disabled class="m3-field opacity-80 text-xs font-mono" oninput="window.checkSmsLength(this, 'sms-open-count')"></textarea>
                        </div>
                        <div>
                            <div class="flex justify-between text-xs font-bold mb-1"><span class="text-slate-300">নতুন ইনভয়েস/বিল SMS টেমপ্লেট</span><span id="sms-new-count" class="text-emerald-400">0/155</span></div>
                            <textarea id="set-sms-new-bill" rows="2" disabled class="m3-field opacity-80 text-xs font-mono" oninput="window.checkSmsLength(this, 'sms-new-count')"></textarea>
                        </div>
                        <div>
                            <div class="flex justify-between text-xs font-bold mb-1"><span class="text-slate-300">জমা প্রাপ্তি SMS টেমপ্লেট</span><span id="sms-pay-count" class="text-emerald-400">0/155</span></div>
                            <textarea id="set-sms-payment" rows="2" disabled class="m3-field opacity-80 text-xs font-mono" oninput="window.checkSmsLength(this, 'sms-pay-count')"></textarea>
                        </div>
                        <div>
                            <div class="flex justify-between text-xs font-bold mb-1"><span class="text-slate-300">বকেয়া তাগাদা SMS টেমপ্লেট</span><span id="sms-rem-count" class="text-emerald-400">0/155</span></div>
                            <textarea id="set-sms-reminder" rows="2" disabled class="m3-field opacity-80 text-xs font-mono" oninput="window.checkSmsLength(this, 'sms-rem-count')"></textarea>
                        </div>
                        <div class="grid grid-cols-2 gap-3 pt-2">
                            <input type="password" id="set-sms-api" disabled class="m3-field opacity-80" placeholder="API Key">
                            <input type="text" id="set-sms-sender" disabled class="m3-field opacity-80" placeholder="Sender ID">
                        </div>
                        <label class="flex items-center gap-3 cursor-pointer"><input type="checkbox" id="set-sms-auto" disabled class="w-5 h-5"> <span class="text-xs font-bold text-slate-300">অটোমেটিক SMS পাঠান</span></label>
                    </div>
                </div>

                <!-- Telegram Alert Settings -->
                <div class="m3-card space-y-4">
                    <div class="flex justify-between items-center border-b border-slate-800 pb-3">
                        <h3 class="font-black text-white text-base">Telegram ফ্রি অ্যালার্ট সেটিংস</h3>
                    </div>
                    <div class="space-y-3">
                        <input type="text" id="set-telegram-bot-token" class="m3-field opacity-80" placeholder="Bot Token (e.g. 123456:ABC-DEF1234ghIkl-zyx57W2v1u123ew11)">
                        <input type="text" id="set-telegram-chat-id" class="m3-field opacity-80" placeholder="Chat ID (e.g. 987654321)">
                        <p class="text-[10px] text-slate-400 mt-1">লগইন, ডিলিট এবং সিকিউরিটি অ্যালার্ট ফ্রিতে টেলিগ্রামে পেতে <a href="https://t.me/BotFather" target="_blank" class="text-blue-400 underline">BotFather</a> থেকে বট বানিয়ে টোকেন এবং আপনার চ্যাট আইডি দিন।</p>
                    </div>
                </div>

                <!-- 15-Point Granular Security Policy Control Center -->
                ${pi()}

                <!-- Zone & Regional Setup Management -->
                ${_i()}

                <!-- Admin Security PIN -->
                <div class="m3-card lg:col-span-2 space-y-4 border border-red-500/30">
                    <div class="flex justify-between items-center border-b border-slate-800 pb-4">
                        <h3 class="font-black text-white text-base">এডমিন সিকিউরিটি পিন (Master PIN)</h3>
                        <button class="px-4 py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-black" onclick="window.changeAdminSecurityPinFlow()"><i class="fa-solid fa-key mr-1.5"></i>পিন পরিবর্তন করুন</button>
                    </div>
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div class="relative">
                            <input type="password" id="set-admin-pin" disabled class="m3-field text-xl tracking-[0.3em] text-red-400 bg-slate-950" value="1060">
                            <button type="button" class="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white cursor-pointer p-1" onclick="window.togglePinVisibility()"><i class="fa-solid fa-eye" id="pin-vis-icon"></i></button>
                        </div>
                        <p class="text-xs text-slate-300 bg-slate-900/80 p-3 rounded-2xl border border-slate-800">আপনার মাস্টার পিনটি কারো সাথে শেয়ার করবেন না। এটি দেখতে মাস্টার পাসওয়ার্ড ভেরিফিকেশন লাগবে।</p>
                    </div>
                </div>

                <!-- Database Backup -->
                <div class="m3-card lg:col-span-2 flex justify-between items-center">
                    <div>
                        <h3 class="font-black text-white text-base mb-1">ডাটাবেস ব্যাকআপ</h3>
                        <p class="text-xs font-bold text-slate-300">সব ডাটা এক ক্লিকে অফলাইন ব্যাকআপ নিন</p>
                    </div>
                    <button class="px-6 py-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-black text-xs" onclick="window.appSettings.exportData()">অফলাইন ব্যাকআপ নিন</button>
                </div>
            </div>

            <!-- Bottom Save Bar -->
            <div class="bg-slate-900/90 border border-blue-500/30 rounded-2xl p-4 sticky bottom-4 z-30 shadow-2xl flex justify-center mt-6">
                <button class="px-12 py-3.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-black text-sm w-full sm:w-[350px]" onclick="window.saveSettings()" id="save-settings-btn">
                    <i class="fa-solid fa-floppy-disk mr-2"></i> সকল সেটিংস সেভ করুন
                </button>
            </div>
        </div>
    `,Ci()}async function Ci(){try{let e=await g.getAppSettings(),t={"set-shop-name":e.shopName||`M/S. Maa Motors`,"set-shop-owner":e.shopOwner||`Mohammed Amran`,"set-shop-phone":e.shopPhone||`01819-397669, 01815-707934`,"set-shop-address":e.shopAddress||`রহমান টাওয়ার, চট্টগ্রাম।`,"set-print-size":e.printSize||`a4`,"set-sms-reminder":e.smsTemplateReminder||`Reminder: Dear [Name] [AccNo], your due is Tk [Due] on [Date]. Kindly clear payment soon. Thanks! - [Shop]`,"set-sms-opening":e.smsTemplateOpening||`Dear [Name] [AccNo], A/C opened at [Shop] on [Date]. Opening Due: Tk [Due]. Thanks!`,"set-sms-new-bill":e.smsTemplateNew||`Dear [Name] [AccNo], Memo #[Memo] of Tk [Bill] created on [Date]. Paid: Tk [Paid], Due: Tk [Due]. Thanks! - [Shop]`,"set-sms-payment":e.smsTemplatePaid||`We have received your payment of Tk [Paid] on [Date]. Your updated due is Tk [Due]. Thank you for staying with us! - [Shop]`,"set-sms-api":e.smsApiKey||``,"set-sms-sender":e.smsSenderId||``,"set-admin-pin":e.adminSecurityPin||`1060`,"set-telegram-bot-token":e.telegramBotToken||``,"set-telegram-chat-id":e.telegramChatId||``};Object.keys(t).forEach(e=>{let n=document.getElementById(e);n&&(n.value=t[e])}),e.shopLogo&&li(e.shopLogo),document.getElementById(`set-sms-auto`)&&(document.getElementById(`set-sms-auto`).checked=e.smsAuto===!0),[[`set-sms-reminder`,`sms-rem-count`],[`set-sms-opening`,`sms-open-count`],[`set-sms-new-bill`,`sms-new-count`],[`set-sms-payment`,`sms-pay-count`]].forEach(([e,t])=>{ii(document.getElementById(e),t)}),mi(),await hi(),vi()}catch(e){console.error(e)}}async function wi(){let e=document.getElementById(`save-settings-btn`);if(!e)return;e.disabled=!0,e.innerHTML=`সেভ হচ্ছে...`;let t=document.getElementById(`set-sms-reminder`)?.value.trim()||``,r=document.getElementById(`set-sms-opening`)?.value.trim()||``,i=document.getElementById(`set-sms-new-bill`)?.value.trim()||``,a=document.getElementById(`set-sms-payment`)?.value.trim()||``,o=(e,t)=>{let n=/[^\x00-\x7F]/.test(e),r=n?70:155;return e.length>r?`${t} (${n?`বাংলা`:`English`}) ${r} ক্যারেক্টারের বেশি হতে পারবে না।`:null},s=o(t,`রিমাইন্ডার`)||o(r,`একাউন্ট খোলা`)||o(i,`নতুন বিল`)||o(a,`পেমেন্ট`);if(s){H.default.fire(`Error`,s,`error`),e.disabled=!1,e.innerHTML=`সকল সেটিংস সেভ করুন`;return}let c=gi(),l={shopName:document.getElementById(`set-shop-name`)?.value.trim()||``,shopOwner:document.getElementById(`set-shop-owner`)?.value.trim()||`Mohammed Amran`,shopPhone:document.getElementById(`set-shop-phone`)?.value.trim()||``,shopAddress:document.getElementById(`set-shop-address`)?.value.trim()||``,printSize:document.getElementById(`set-print-size`)?.value||`a4`,shopLogo:ci(),smsTemplateReminder:t,smsTemplateOpening:r,smsTemplateNew:i,smsTemplatePaid:a,smsApiKey:document.getElementById(`set-sms-api`)?.value.trim()||``,smsSenderId:document.getElementById(`set-sms-sender`)?.value.trim()||``,smsAuto:document.getElementById(`set-sms-auto`)?.checked||!1,adminSecurityPin:document.getElementById(`set-admin-pin`)?.value.trim()||`1060`,telegramBotToken:document.getElementById(`set-telegram-bot-token`)?.value.trim()||``,telegramChatId:document.getElementById(`set-telegram-chat-id`)?.value.trim()||``,securityPolicy:c,updatedAt:n.firestore.FieldValue.serverTimestamp()};try{await g.updateAppSettings(l),O(`UPDATE`,`Settings`,`appSettings`,`App Settings`,{shopName:l.shopName}),H.default.fire({title:`সফল!`,icon:`success`,customClass:{popup:`!bg-slate-900 !text-white`}}),Si(document.getElementById(`view-container`))}catch{H.default.fire(`Error`,`সেভ ব্যর্থ হয়েছে`,`error`)}finally{e.disabled=!1,e.innerHTML=`সকল সেটিংস সেভ করুন`}}async function Ti(){if(!await W(`সিকিউরিটি পিন পরিবর্তন`))return;let{value:e}=await H.default.fire({title:`নতুন মাস্টার পিন দিন`,input:`text`,inputPlaceholder:`e.g. 5678`,showCancelButton:!0,inputValidator:e=>!e||e.trim().length<4?`কমপক্ষে ৪ ডিজিট দিন!`:null});if(e)try{await g.updateAppSettings({adminSecurityPin:e.trim()}),O(`PIN_CHANGE`,`Settings`,`appSettings`,`Admin Master PIN`),document.getElementById(`set-admin-pin`).value=e.trim(),H.default.fire(`সফল!`,`পিন আপডেট করা হয়েছে।`,`success`)}catch{H.default.fire(`Error`,`ব্যর্থ হয়েছেন`,`error`)}}var Ei=null;window.saveSettings=wi,window.changeAdminSecurityPinFlow=Ti,window.togglePinVisibility=async()=>{let e=document.getElementById(`set-admin-pin`),t=document.getElementById(`pin-vis-icon`);e&&(e.type===`password`?await Le()&&(e.type=`text`,t&&(t.className=`fa-solid fa-eye-slash text-amber-400`),Ei&&clearTimeout(Ei),Ei=setTimeout(()=>{e.type=`password`,t&&(t.className=`fa-solid fa-eye text-slate-400`)},5e3)):(e.type=`password`,t&&(t.className=`fa-solid fa-eye text-slate-400`),Ei&&clearTimeout(Ei)))},window.appSettings={exportData:async()=>{await W(`Database Export`)&&window.downloadAdminExcelBackup&&await window.downloadAdminExcelBackup()}},window.appSettings={...oi,...ni,exportData:window.appSettings?.exportData};function Di(e,t,n={},r={}){if(window.AppState?.currentUserRole===`Staff`&&window.AppState?.permissions?.viewStatement===!1){e.innerHTML=`<div class="m3-card text-center font-bn py-12"><h2 class="text-xl font-bold text-red-500">অ্যাক্সেস ডিনাইড! আপনার স্টেটমেন্ট দেখার অনুমতি নেই।</h2></div>`;return}if(!t||!t.customerId){e.innerHTML=`<div class="m3-card text-center font-bn py-12"><h2 class="text-xl font-bold text-red-500">কাস্টমার সিলেক্ট করা হয়নি!</h2></div>`;return}let i=J().find(e=>e.id===t.customerId),a=Number(i?.totalDue||t.totalDue||0),o=(t.customerName||i?.name||`Customer`).replace(/^\[.*?\]\s*/,``).trim();n.currentCustomerInfo={id:t.customerId,name:o,accountNo:t.accountNo||i?.accountNo||``,phone:t.customerPhone||i?.phone||``,address:t.customerAddress||i?.address||``,zone:i?.zone||``,totalDue:a};let s=n.currentCustomerInfo,c=(o||`C`).charAt(0).toUpperCase(),l=a>5e4?`<span class="px-2.5 py-0.5 rounded-full bg-red-500/20 text-red-400 border border-red-500/30 text-[10px] font-black uppercase"><i class="fa-solid fa-circle text-[8px] mr-1 animate-pulse"></i>High Due</span>`:a>0?`<span class="px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/30 text-[10px] font-black uppercase">Regular</span>`:`<span class="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-[10px] font-black uppercase">Cleared</span>`;e.innerHTML=`
        <div class="max-w-6xl mx-auto flex flex-col gap-6 pb-24 font-bn">
            <div class="m3-card bg-slate-900/80 border border-slate-800/80 p-4 md:p-5 rounded-2xl shadow-xl flex flex-col md:flex-row items-center justify-between gap-4">
                <div class="flex items-center gap-4 w-full md:w-auto">
                    <div class="w-12 h-12 rounded-2xl bg-gradient-to-tr from-blue-600 to-purple-600 text-white font-black text-xl flex items-center justify-center shadow-lg shadow-blue-500/20 shrink-0">${c}</div>
                    <div>
                        <div class="flex items-center gap-2 flex-wrap">
                            <h1 class="text-xl md:text-2xl font-black text-white tracking-tight">${s.name}</h1>
                            ${s.accountNo?`<span class="px-2 py-0.5 rounded-lg bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-black">#${s.accountNo}</span>`:``}
                            ${l}
                        </div>
                        <div class="flex items-center gap-3 text-xs text-slate-400 font-bold mt-1 flex-wrap">
                            <span><i class="fa-solid fa-phone text-[10px] mr-1 text-slate-500"></i>${s.phone||`-`}</span>
                            <span>•</span><span><i class="fa-solid fa-location-dot text-[10px] mr-1 text-slate-500"></i>${s.address||`-`}</span>
                            ${s.zone?`<span>•</span><span class="text-blue-400 font-black">${s.zone}</span>`:``}
                        </div>
                    </div>
                </div>
                <div class="flex flex-wrap items-center gap-2 w-full md:w-auto justify-end shrink-0">
                    <button type="button" class="h-9 px-3 rounded-xl bg-emerald-600/20 text-emerald-400 border border-emerald-500/30 hover:bg-emerald-600 hover:text-white font-bold text-xs transition-all cursor-pointer flex items-center gap-1.5" onclick="window.quickCollectPaymentFromStmt()"><i class="fa-solid fa-plus text-xs"></i><span>+ জমা নিন</span></button>
                    <button type="button" class="h-9 px-3 rounded-xl bg-blue-600/20 text-blue-400 border border-blue-500/30 hover:bg-blue-600 hover:text-white font-bold text-xs transition-all cursor-pointer flex items-center gap-1.5" onclick="window.sendStmtReminderSMS()"><i class="fa-solid fa-comment-sms text-xs"></i><span>SMS তাগাদা</span></button>
                    <button type="button" class="h-9 px-3 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 hover:bg-emerald-600 hover:text-white font-bold text-xs transition-all cursor-pointer flex items-center gap-1.5" onclick="window.sendStmtReminderWhatsApp()"><i class="fa-brands fa-whatsapp text-sm"></i><span>WhatsApp তাগাদা</span></button>
                    <button type="button" class="h-9 px-4 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-black text-xs shadow-lg active:scale-95 transition-all cursor-pointer flex items-center gap-1.5" onclick="window.printStatement()"><i class="fa-solid fa-print text-xs"></i><span>প্রিন্ট মেমো (PDF)</span></button>
                    <button type="button" class="h-9 px-4 rounded-xl bg-slate-800 border border-slate-700 hover:bg-slate-700 text-slate-300 font-black text-xs active:scale-95 transition-all cursor-pointer flex items-center gap-1.5" onclick="window.exportTableToExcel('statement-export-table', 'customer-statement.xlsx')"><i class="fa-solid fa-file-excel text-emerald-400"></i><span>এক্সেল</span></button>
                    <button type="button" class="h-9 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold transition-all cursor-pointer" onclick="navigate('customers')"><i class="fa-solid fa-arrow-left mr-1"></i>ব্যাক</button>
                </div>
            </div>

            <div class="m3-card bg-slate-900/60 border border-slate-800/80 p-4 md:p-5 rounded-2xl shadow-xl flex flex-col gap-3 font-bn">
                <div class="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800/80 pb-2">
                    <div class="flex items-center gap-2 cursor-pointer" onclick="window.toggleStmtFilterCollapse()">
                        <span class="text-xs font-black text-blue-400 uppercase tracking-widest flex items-center gap-2"><i class="fa-solid fa-filter"></i> ফিল্টার ও সময়কাল</span>
                        <i class="fa-solid fa-chevron-down text-slate-500 text-xs md:hidden"></i>
                    </div>
                    <div class="flex flex-wrap gap-1.5">
                        <button type="button" class="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-blue-600 text-slate-300 hover:text-white text-[11px] font-bold active:scale-95 transition-all cursor-pointer" onclick="window.setStmtPresetDate('today')">আজ</button>
                        <button type="button" class="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-blue-600 text-slate-300 hover:text-white text-[11px] font-bold active:scale-95 transition-all cursor-pointer" onclick="window.setStmtPresetDate('this_month')">চলতি মাস</button>
                        <button type="button" class="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-blue-600 text-slate-300 hover:text-white text-[11px] font-bold active:scale-95 transition-all cursor-pointer" onclick="window.setStmtPresetDate('last_month')">গত মাস</button>
                        <button type="button" class="px-2.5 py-1 rounded-lg bg-blue-600/20 text-blue-400 border border-blue-500/30 hover:bg-blue-600 hover:text-white text-[11px] font-bold active:scale-95 transition-all cursor-pointer" onclick="window.clearStatementFilter()">সব সময়</button>
                    </div>
                </div>
                <div id="stmt-filter-grid" class="grid grid-cols-1 md:grid-cols-3 gap-3 items-end pt-1">
                    <div><label class="m3-label text-slate-400 mb-1.5 block text-xs font-bold">শুরুর তারিখ</label><input type="text" id="stmt-start-date" class="w-full bg-slate-950/90 border border-slate-700/70 rounded-xl h-10 px-3.5 text-xs text-white datepicker cursor-pointer focus:border-blue-500 transition-all" placeholder="DD/MM/YYYY"></div>
                    <div><label class="m3-label text-slate-400 mb-1.5 block text-xs font-bold">শেষের তারিখ</label><input type="text" id="stmt-end-date" class="w-full bg-slate-950/90 border border-slate-700/70 rounded-xl h-10 px-3.5 text-xs text-white datepicker cursor-pointer focus:border-blue-500 transition-all" placeholder="DD/MM/YYYY"></div>
                    <div class="flex gap-2"><button type="button" class="h-10 px-6 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-black text-xs flex-grow shadow-lg shadow-blue-600/20 active:scale-95 transition-all cursor-pointer flex items-center justify-center gap-2" onclick="window.loadStatementData()"><i class="fa-solid fa-magnifying-glass text-xs"></i><span>ফিল্টার করুন</span></button></div>
                </div>
            </div>

            <div class="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <div class="m3-card p-4 rounded-2xl bg-red-500/10 border border-red-500/30 flex flex-col justify-between"><span class="text-[10px] font-black text-red-400 uppercase tracking-wider">মোট খরচ (Debit)</span><h2 id="stmt-total-bill" class="text-xl md:text-2xl font-black text-red-400 mt-2">৳ 0</h2></div>
                <div class="m3-card p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex flex-col justify-between"><span class="text-[10px] font-black text-emerald-400 uppercase tracking-wider">মোট জমা (Credit)</span><h2 id="stmt-total-paid" class="text-xl md:text-2xl font-black text-emerald-400 mt-2">৳ 0</h2></div>
                <div class="m3-card p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex flex-col justify-between"><span class="text-[10px] font-black text-amber-400 uppercase tracking-wider">মোট ছাড় (Less)</span><h2 id="stmt-total-less" class="text-xl md:text-2xl font-black text-amber-400 mt-2">৳ 0</h2></div>
                <div class="m3-card p-4 rounded-2xl bg-gradient-to-tr from-blue-900/40 to-purple-900/40 border border-blue-500/40 shadow-xl flex flex-col justify-between"><span class="text-[10px] font-black text-blue-300 uppercase tracking-wider">অবশিষ্ট বকেয়া (Net Due)</span><h2 id="stmt-total-due" class="text-xl md:text-2xl font-black text-blue-400 mt-2">৳ 0</h2></div>
            </div>

            <div class="m3-card bg-slate-900/60 border border-slate-800/80 p-4 md:p-5 rounded-2xl shadow-xl flex flex-col gap-3">
                <div class="flex justify-between items-center border-b border-slate-800/80 pb-2">
                    <h2 class="text-xs font-black text-blue-400 uppercase tracking-widest flex items-center gap-2"><i class="fa-solid fa-book"></i> খতিয়ান পাসবুক লেনদেনসমূহ</h2>
                    <span id="stmt-count-badge" class="text-[11px] text-slate-400 font-bold">০ টি লেনদেন</span>
                </div>
                <div class="desktop-only m3-table-container overflow-x-auto">
                    <table id="statement-export-table" class="m3-table w-full min-w-[750px]">
                        <thead>
                            <tr class="text-xs font-black text-slate-400">
                                <th class="w-28">তারিখ</th><th>বিবরণ / মাধ্যম / ভাউচার</th><th class="w-32 text-right">খরচ (Debit ৳)</th><th class="w-32 text-right">জমা (Credit ৳)</th><th class="w-36 text-right">বর্তমান ব্যালেন্স (Balance ৳)</th>
                            </tr>
                        </thead>
                        <tbody id="statement-list"></tbody>
                    </table>
                </div>
                <div id="statement-list-mobile" class="mobile-only flex flex-col gap-2.5"></div>
            </div>

            <div class="m3-card bg-slate-900/60 border border-slate-800/80 p-4 md:p-5 rounded-2xl shadow-xl flex flex-col gap-2">
                <label class="text-xs font-black text-amber-400 uppercase tracking-widest flex items-center gap-2"><i class="fa-solid fa-pen-to-square"></i> বিশেষ নোটিশ / শর্তাবলি (Custom Statement Note)</label>
                <textarea id="stmt-custom-note" class="w-full bg-slate-950/80 border border-slate-700/70 rounded-xl p-3 text-xs text-slate-200 outline-none focus:border-blue-500 min-h-[70px]" placeholder="প্রিন্ট মেমোর নিচে ম্যানুয়ালি যেকোনো বিশেষ নোটিশ বা শর্ত লিখতে পারেন (যেমন: আগামী ১৫ দিনের মধ্যে বকেয়া পরিশোধের অনুরোধ)..."></textarea>
                <span class="text-[10px] text-slate-500 font-bold">* এখানে যা ম্যানুয়ালি টাইপ করবেন তা সরাসরি স্টেটমেন্ট প্রিন্ট কপির নিচে প্রদর্শিত হবে।</span>
            </div>
        </div>`,r.loadStatementData&&r.loadStatementData()}async function Oi(e={}){let t=document.getElementById(`statement-list`),n=document.getElementById(`statement-list-mobile`);if(!t)return;t.innerHTML=`<tr><td colspan="5" class="text-center py-10 text-slate-500 font-bold">লোডিং...</td></tr>`,n&&(n.innerHTML=`<div class="text-center py-6 text-slate-500 font-bold">লোডিং...</div>`);let r=document.getElementById(`stmt-start-date`)?.value||``,i=document.getElementById(`stmt-end-date`)?.value||``,{currentCustomerInfo:s}=e;try{let t=0;if(s&&s.id){let e=J().find(e=>e.id===s.id);if(e!==void 0)t=Number(e.initialDue||0);else{let e=await a.getById(s.id);e&&(t=Number(e.initialDue||0))}}let n=await o.getByCustomer(s?.id);n=n.filter(e=>{let t=String(e.voucherNo||``).trim().toUpperCase();return t!==`OPENING`&&t!==`OPEN`&&t!==`প্রারম্ভিক ব্যালেন্স`&&t!==`প্রারম্ভিক জের`}),n.sort((e,t)=>{let n=new Date(e.date)-new Date(t.date);return n===0?(e.createdAt&&typeof e.createdAt.toMillis==`function`?e.createdAt.toMillis():0)-(t.createdAt&&typeof t.createdAt.toMillis==`function`?t.createdAt.toMillis():0):n});let c=t;if(r){let e=new Date(r);n.forEach(t=>{new Date(t.date)<e&&(c=L(c+((Number(t.bill)||0)-(Number(t.paid)||0))))}),n=n.filter(t=>new Date(t.date)>=e)}if(i){let e=new Date(i);n=n.filter(t=>new Date(t.date)<=e)}e.currentStatementData=n,e.currentOpeningBalance=c,ki(c,e)}catch(e){console.error(`Load Statement Error:`,e)}}function ki(e=0,t={}){let n=document.getElementById(`statement-list`),r=document.getElementById(`statement-list-mobile`);if(!n)return;let i=t.currentStatementData||[],a=e,o=0,s=0,c=0,l=``,u=``;l+=`<tr class="bg-slate-800/40 font-bold border-b-2 border-slate-700">
        <td colspan="2" class="text-blue-400 uppercase tracking-widest text-[10px] !py-3 px-4 font-black"><i class="fa-solid fa-flag-checkered mr-2"></i>প্রারম্ভিক ব্যালেন্স (Opening Balance)</td>
        <td class="text-right">-</td><td class="text-right">-</td>
        <td class="text-right font-black ${e>0?`text-red-400`:`text-emerald-400`} bg-white/5 !py-3 px-4">৳ ${F(Math.abs(e))} ${e<0?`(অ্যাড)`:``}</td>
    </tr>`,u+=`<div class="p-3 bg-slate-900 border border-slate-800 rounded-xl flex justify-between items-center text-xs"><span class="text-blue-400 font-bold">প্রারম্ভিক ব্যালেন্স:</span><span class="font-black ${e>0?`text-red-400`:`text-emerald-400`}">৳ ${F(Math.abs(e))}</span></div>`,i.forEach(e=>{let t=Number(e.bill)||0,n=Number(e.paid)||0,r=e.receivedType||``;o=L(o+t),r===`Less`?c=L(c+n):s=L(s+n),a=L(a+(t-n));let i=``;if(e.createdAt)try{let t=e.createdAt.toDate?e.createdAt.toDate():e.createdAt.toMillis?new Date(e.createdAt.toMillis()):new Date(e.createdAt);isNaN(t.getTime())||(i=t.toLocaleTimeString(`en-US`,{hour:`numeric`,minute:`2-digit`,hour12:!0}))}catch(e){console.error(`Time parsing error in statement table:`,e)}let d=`<span class="text-slate-500 text-xs">-</span>`;if(n>0){let t=(e.receivedFrom||``).trim(),n=t?`${r}: ${t}`:r;d=r===`Less`?`<span class="bg-purple-500/10 text-purple-400 px-2 py-0.5 rounded-lg text-[10px] font-black border border-purple-500/20"><i class="fa-solid fa-tag mr-1"></i>[LESS] ${t}</span>`:r===`Bank`?`<span class="bg-blue-500/10 text-blue-400 px-2 py-0.5 rounded-lg text-[10px] font-bold border border-blue-500/20"><i class="fa-solid fa-building-columns mr-1"></i>${n}</span>`:`<span class="bg-emerald-500/10 text-emerald-400 px-2 py-0.5 rounded-lg text-[10px] font-bold border border-emerald-500/20"><i class="fa-solid fa-hand-holding-dollar mr-1"></i>${n}</span>`}let f=e.voucherNo&&e.voucherNo!==`OPENING`?`<span class="px-1.5 py-0.5 bg-blue-500/10 text-blue-400 rounded text-[9px] border border-blue-500/20 font-mono font-black">#${e.voucherNo}</span>`:``,p=e.notes?`<div class="text-[9px] text-slate-400 font-medium italic mt-0.5 truncate max-w-[200px]" title="${e.notes}">• ${e.notes}</div>`:``;l+=`<tr class="hover:bg-white/[0.03] border-b border-slate-800/50">
            <td class="align-top py-2.5 px-3 whitespace-nowrap">
                <div class="text-xs font-bold text-slate-200">${B(e.date)}</div>
                ${i?`<div class="text-[10px] text-slate-400 font-medium mt-0.5 flex items-center gap-1.5"><i class="fa-regular fa-clock text-[9px] text-slate-500"></i><span>${i}</span></div>`:``}
            </td>
            <td class="align-top py-2.5 px-3"><div class="flex items-center flex-wrap gap-1.5">${d}${f}</div>${p}</td>
            <td class="text-right text-red-400 font-black text-sm align-top py-2.5 px-3">${t>0?`৳`+F(t):`-`}</td>
            <td class="text-right text-emerald-400 font-black text-sm align-top py-2.5 px-3">${n>0?`৳`+F(n):`-`}</td>
            <td class="text-right font-black ${a>0?`text-red-400`:`text-emerald-400`} bg-white/[0.01] align-top py-2.5 px-3 text-sm">৳ ${F(Math.abs(a))} ${a<0?`<span class="text-[9px] font-bold text-emerald-400">(Adv)</span>`:``}</td>
        </tr>`,u+=`<div class="p-3 bg-slate-900/90 border border-slate-800 rounded-xl flex flex-col gap-1.5 text-xs">
            <div class="flex justify-between items-center border-b border-slate-800/60 pb-1">
                <span class="text-slate-300 font-bold text-[11px]">${B(e.date)}${i?` (${i})`:``} ${f}</span>
                ${d}
            </div>
            <div class="flex justify-between items-center text-slate-300"><span>খরচ: <strong class="text-red-400 font-black">৳${F(t)}</strong></span><span>জমা: <strong class="text-emerald-400 font-black">৳${F(n)}</strong></span></div>
            <div class="flex justify-between items-center pt-1 border-t border-slate-800/40"><span class="text-[10px] text-slate-400 font-bold">বর্তমান ব্যালেন্স:</span><span class="font-black ${a>0?`text-red-400`:`text-emerald-400`}">৳ ${F(Math.abs(a))}</span></div>
        </div>`}),i.length===0&&(l+=`
            <tr class="border-b border-slate-800/30">
                <td colspan="5" class="py-10 text-center text-slate-400 font-bold bg-slate-950/20">
                    <div class="flex flex-col items-center justify-center gap-2">
                        <div class="w-10 h-10 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 text-base shadow-sm">
                            <i class="fa-solid fa-receipt"></i>
                        </div>
                        <span class="text-xs text-slate-300 font-bold">এই সময়সীমার মধ্যে কোনো নতুন লেনদেন নেই</span>
                        <span class="text-[10px] text-slate-500 font-medium">অন্য মেয়াদের হিসাব দেখতে উপরে ফিল্টার বোতামগুলো নির্বাচন করুন</span>
                    </div>
                </td>
            </tr>`,u+=`
            <div class="p-6 bg-slate-900/60 border border-slate-800/80 rounded-2xl text-center text-slate-400 font-bold text-xs flex flex-col items-center justify-center gap-2">
                <i class="fa-solid fa-receipt text-2xl text-blue-400/60"></i>
                <span>এই সময়সীমার মধ্যে কোনো নতুন লেনদেন পাওয়া যায়নি</span>
            </div>`),n.innerHTML=l,r&&(r.innerHTML=u);let d=document.getElementById(`stmt-count-badge`);d&&(d.innerText=`${i.length} টি লেনদেন`),document.getElementById(`stmt-total-bill`).innerText=`৳ ${F(o)}`,document.getElementById(`stmt-total-paid`).innerText=`৳ ${F(s)}`,document.getElementById(`stmt-total-less`).innerText=`৳ ${F(c)}`,document.getElementById(`stmt-total-due`).innerText=`৳ ${F(Math.abs(a))} ${a<0?`(অ্যাডভান্স)`:``}`,t.currentFinalBalance=a}function Ai(e,t={}){let n=document.getElementById(`stmt-start-date`),r=document.getElementById(`stmt-end-date`);if(!n||!r)return;let i=new Date;if(e===`today`){let e=R();n.value=e,r.value=e}else if(e===`this_month`)n.value=`${i.getFullYear()}-${String(i.getMonth()+1).padStart(2,`0`)}-01`,r.value=R();else if(e===`last_month`){let e=new Date(i.getFullYear(),i.getMonth()-1,1),t=e.getFullYear(),a=String(e.getMonth()+1).padStart(2,`0`),o=new Date(i.getFullYear(),i.getMonth(),0).getDate();n.value=`${t}-${a}-01`,r.value=`${t}-${a}-${String(o).padStart(2,`0`)}`}t.loadStatementData&&t.loadStatementData()}async function ji(e={},t={}){let{currentCustomerInfo:r}=e,{value:i}=await H.default.fire({title:`<i class="fa-solid fa-credit-card text-blue-400 mr-2"></i>জমা গ্রহণ করুন`,html:`
            <div class="flex flex-col gap-3 text-left font-bn p-2">
                <div class="text-xs text-blue-400 font-bold">কাস্টমার: ${r?.name||`Customer`}</div>
                <div>
                    <label class="block text-xs font-bold text-slate-400 mb-1">জমার পরিমাণ (৳)</label>
                    <input id="stmt-recv-amt" type="text" class="m3-field text-lg font-black text-emerald-400" placeholder="০.০০" oninput="window.handleNumberInput(this); window.updateLiveWords(this, 'stmt-recv-words');">
                    <div id="stmt-recv-words" class="text-[10px] font-black text-emerald-400 mt-1 hidden italic truncate"></div>
                </div>
                <div><label class="block text-xs font-bold text-slate-400 mb-1">পেমেন্ট মাধ্যম</label><select id="stmt-recv-type" class="m3-field"><option value="Cash">Cash (নগদ)</option><option value="Bank">Bank (ব্যাংক/বিকাশ)</option><option value="Less">Less (ছাড়/কমিশন)</option></select></div>
                <div><label class="block text-xs font-bold text-slate-400 mb-1">বিবরণ / ব্যাংক নাম (ঐচ্ছিক)</label><input id="stmt-recv-ref" type="text" class="m3-field" placeholder="মন্তব্য..."></div>
            </div>`,showCancelButton:!0,confirmButtonText:`<i class="fa-solid fa-circle-check mr-2"></i>জমা সেভ করুন`,cancelButtonText:`বাতিল`,customClass:{popup:`!bg-slate-950 !text-white !rounded-3xl border border-slate-800 shadow-2xl font-bn`,confirmButton:`m3-btn-primary !bg-emerald-600 hover:!bg-emerald-500 !px-6 !py-2 rounded-xl font-bold`,cancelButton:`m3-btn-tonal !bg-slate-800 !text-slate-300 !px-5 !py-2 rounded-xl font-bold border border-slate-700`},preConfirm:()=>{let e=I(document.getElementById(`stmt-recv-amt`).value);return!e||e<=0?H.default.showValidationMessage(`সঠিক জমার পরিমাণ লিখুন!`):{amount:e,type:document.getElementById(`stmt-recv-type`).value,ref:document.getElementById(`stmt-recv-ref`).value.trim()}}});if(i)try{let e=m.batch(),s=o.getRef(),c=J().find(e=>e.id===r.id),l=L(Number(c?.totalDue||0)),u=L(l-i.amount),d=`QC-`+Date.now().toString(36).toUpperCase();e.set(s,{customerId:r.id,customerName:r.name,date:R(),voucherNo:d,bill:0,paid:i.amount,receivedType:i.type,receivedFrom:i.ref,prevDue:l,currentDue:u,createdBy:window.AppState?.currentUserEmail||`Unknown`,createdAt:n.firestore.FieldValue.serverTimestamp()}),e.update(a.getRef(r.id),{totalDue:n.firestore.FieldValue.increment(L(-i.amount))}),await e.commit(),O(`CREATE`,`Ledger`,s.id,r.name,{bill:0,paid:i.amount,receivedType:i.type,receivedFrom:i.ref,source:`Statement Quick Collect`}),K(`জমা সফলভাবে সেভ হয়েছে!`,`success`),t.loadStatementData&&t.loadStatementData()}catch(e){console.error(`Quick collect payment error:`,e),H.default.fire(`Error`,`জমা সেভ করা যায়নি`,`error`)}}async function Mi(e={}){let{currentCustomerInfo:t,currentFinalBalance:n}=e,r=t?.phone;if(!r)return H.default.fire(`Error`,`No phone number found for this customer.`,`warning`);let i=n,a=i<0?`advance`:`pending due`,o=F(Math.abs(i)),s=`Dear ${(typeof window.toBanglishName==`function`?window.toBanglishName(t.name):t.name)||`Customer`}, Your total ${a} at M/S. Maa Motors is Tk ${o}. Kindly clear payment. Contact: 01819-397669. Thank you! - M/S. Maa Motors`.replace(/\s+/g,` `).replace(/[^\x00-\x7F]/g,``),{value:c}=await H.default.fire({title:`<i class="fa-solid fa-comment-sms text-blue-400 mr-2"></i>Send Reminder SMS`,html:`<div class="text-left space-y-1 mb-2 font-bn"><div class="text-xs text-slate-400">Recipient: <strong class="text-white">${r}</strong></div><div id="stmt-sms-counter" class="text-[11px] font-bold text-emerald-400 text-right">${U(s)}</div></div>`,input:`textarea`,inputValue:s,inputAttributes:{rows:5,class:`m3-field text-xs font-mono`},didOpen:()=>{let e=H.default.getInput(),t=document.getElementById(`stmt-sms-counter`);e&&(e.oninput=()=>{t&&(t.innerText=U(e.value))})},showCancelButton:!0,confirmButtonText:`<i class="fa-solid fa-paper-plane mr-1.5"></i> Send SMS`,cancelButtonText:`Cancel`,customClass:{popup:`!bg-slate-900 !text-white !rounded-3xl border border-slate-700`,confirmButton:`m3-btn-primary !bg-blue-600 hover:!bg-blue-500 !px-6 !py-2 rounded-xl font-bold`,cancelButton:`m3-btn-tonal !bg-slate-800 !text-slate-300 !px-5 !py-2 rounded-xl font-bold border border-slate-700`}});c&&await window.sendSMS(r,c,!1)&&K(`SMS পাঠানোর চেষ্টা করা হয়েছে!`,`info`)}async function Ni(e={}){let{currentCustomerInfo:t,currentFinalBalance:n}=e,r=t?.phone;if(!r)return H.default.fire({title:`এরর`,text:`কাস্টমারের মোবাইল নম্বর পাওয়া যায়নি!`,icon:`warning`,customClass:{popup:`!bg-slate-900 !text-white !rounded-3xl border border-slate-700`}});let i=n,a=F(Math.abs(i)),o=document.getElementById(`stmt-total-bill`)?.innerText||`৳ 0`,s=document.getElementById(`stmt-total-paid`)?.innerText||`৳ 0`,c=document.getElementById(`stmt-total-less`)?.innerText||`৳ 0`,l=t.accountNo?`#${t.accountNo}`:`-`,u=`${window.location.origin}${window.location.pathname}?view=public-stmt&id=${t.id}`,d=`আসসালামু আলাইকুম ${t.name||`কাস্টমার`},\nমেসার্স মা মোটরস্ থেকে আপনার মোট হিসাবের সামারি:\n\nহিসাব নং: ${l}\nমোট কেনাকাটা/বিল: ${o}\nমোট জমা: ${s}\nমোট ছাড়: ${c}\n---------------------------------\n`;d+=i<0?`অ্যাডভান্স জমা: ৳ ${a}\n\n`:`বর্তমান মোট বকেয়া: ৳ ${a}\n\n*বিশেষ অনুরোধ: আপনার বকেয়া টাকাটি দ্রুত পরিশোধ করার অনুরোধ রইল।*\n\n`,d+=`আপনার সম্পূর্ণ মেমো ও হিসাবের PDF বিবরণী দেখতে নিচের লিংকে ক্লিক করুন:\n${u}\n\nযোগাযোগ: 01819-397669\nধন্যবাদ! — মেসার্স মা মোটরস্`;let{value:f}=await H.default.fire({title:`<div class="flex items-center justify-center gap-2 font-bn font-black text-lg text-emerald-400"><i class="fa-brands fa-whatsapp text-xl"></i><span>Send WhatsApp Reminder</span></div>`,html:`<div class="text-left space-y-1 mb-2 font-bn"><div class="text-xs text-slate-400">Recipient Phone: <strong class="text-white">${r}</strong></div></div>`,input:`textarea`,inputValue:d,inputAttributes:{rows:8,class:`m3-field text-xs font-bn`},showCancelButton:!0,confirmButtonText:`<i class="fa-brands fa-whatsapp mr-1.5"></i> Open WhatsApp`,cancelButtonText:`Cancel`,customClass:{popup:`!bg-slate-950 !text-white !rounded-3xl border border-slate-800 shadow-2xl font-bn`,confirmButton:`m3-btn-primary !bg-emerald-600 hover:!bg-emerald-500 !px-6 !py-2 rounded-xl font-bold`}});f&&window.sendWhatsApp&&window.sendWhatsApp(r,f)}var Pi=[],Fi=0,Ii={},Li=0,Ri={get currentStatementData(){return Pi},set currentStatementData(e){Pi=e},get currentOpeningBalance(){return Fi},set currentOpeningBalance(e){Fi=e},get currentCustomerInfo(){return Ii},set currentCustomerInfo(e){Ii=e},get currentFinalBalance(){return Li},set currentFinalBalance(e){Li=e}};function zi(e,t){Di(e,t,Ri,{loadStatementData:Bi})}async function Bi(){return Oi(Ri)}function Vi(e){return Ai(e,{loadStatementData:Bi})}async function Hi(){return ji(Ri,{loadStatementData:Bi})}async function Ui(){return Mi(Ri)}async function Wi(){return Ni(Ri)}function Gi(){let e=document.getElementById(`stmt-start-date`),t=document.getElementById(`stmt-end-date`);e&&(e.value=``),t&&(t.value=``),Bi()}function Ki(){document.getElementById(`stmt-filter-grid`)?.classList.toggle(`hidden`)}async function qi(){let e=document.getElementById(`stmt-custom-note`)?.value||``,{printStatement:t}=await D(async()=>{let{printStatement:e}=await import(`./statement-print-CcvOtciR.js`);return{printStatement:e}},__vite__mapDeps([8,1,0,2,3,4,6,7]));return await t(Ii,Fi,Pi,e)}typeof window<`u`&&(window.clearStatementFilter=Gi,window.toggleStmtFilterCollapse=Ki,window.setStmtPresetDate=Vi,window.quickCollectPaymentFromStmt=Hi,window.sendStmtReminderSMS=Ui,window.sendStmtReminderWhatsApp=Wi,window.loadStatementData=Bi,window.printStatement=qi);async function Ji(e,t=!1){try{let r=e.filter(e=>e&&e.name&&e.name.trim()!==``).map(e=>({date:e.date||new Date().toISOString().split(`T`)[0],name:e.name.trim(),phone:e.phone?String(e.phone).trim():``,voucher:e.voucher?String(e.voucher).trim():``,bill:I(e.bill)||0,paid:I(e.paid)||0,receivedType:e.receivedType||`Bank`,receivedFrom:e.receivedFrom||``})).filter(e=>e.bill>0||e.paid>0);if(r.length===0)return H.default.fire({title:`ভ্যালিড ডাটা নেই!`,icon:`warning`,customClass:{popup:`!bg-slate-900 !text-white`}});let i=0,s=0,c=r.map(e=>(i=L(i+e.bill),s=L(s+e.paid),`
                <div class="p-2.5 bg-slate-950/50 border border-slate-800/80 rounded-xl text-left">
                    <div class="flex justify-between items-center mb-1">
                        <span class="text-sm font-black text-white">${e.name}</span>
                        <span class="text-[10px] font-bold text-amber-400 bg-amber-400/10 px-1.5 py-0.5 rounded border border-amber-400/20">ভাউচার: ${e.voucher||`-`}</span>
                    </div>
                    <div class="flex justify-between items-center text-xs">
                        <span class="text-slate-400 font-bold">${B(e.date)}</span>
                        <div class="flex gap-4">
                            <span class="text-blue-400 font-mono font-bold">বিল: ৳ ${F(e.bill)}</span>
                            <span class="text-emerald-400 font-mono font-bold">জমা: ৳ ${F(e.paid)} ${e.paid>0?`<span class="text-purple-400 font-bn tracking-wider ml-1 px-1.5 py-0.5 bg-purple-500/10 rounded-md border border-purple-500/20 text-[10px] uppercase">${e.receivedType}${e.receivedFrom?` - `+e.receivedFrom:``}</span>`:``}</span>
                        </div>
                    </div>
                </div>
            `)).join(``);if(!(await H.default.fire({title:`<div class="flex items-center justify-center gap-2 font-bn font-black text-xl text-white"><i class="fa-solid fa-file-shield text-blue-400"></i><span>ফাস্ট এন্ট্রি যাচাই করুন</span></div>`,html:`
                <div class="text-left space-y-3 font-bn p-3.5 bg-slate-900/90 rounded-2xl border border-slate-800 shadow-inner">
                    <div class="grid grid-cols-3 gap-4 border-b border-slate-800/80 pb-3">
                        <div class="flex flex-col gap-1 text-center bg-slate-950 p-2 rounded-xl border border-slate-800"><span class="text-[10px] text-slate-400 font-black uppercase tracking-wider">মোট এন্ট্রি</span><span class="text-lg text-white font-black">${r.length}</span></div>
                        <div class="flex flex-col gap-1 text-center bg-blue-950/30 p-2 rounded-xl border border-blue-900/30"><span class="text-[10px] text-blue-400 font-black uppercase tracking-wider">মোট বিল</span><span class="text-lg text-blue-400 font-black font-mono">৳ ${F(i)}</span></div>
                        <div class="flex flex-col gap-1 text-center bg-emerald-950/30 p-2 rounded-xl border border-emerald-900/30"><span class="text-[10px] text-emerald-400 font-black uppercase tracking-wider">মোট জমা</span><span class="text-lg text-emerald-400 font-black font-mono">৳ ${F(s)}</span></div>
                    </div>
                    <div class="max-h-[350px] overflow-y-auto custom-scrollbar pr-2 mt-3 space-y-2">
                        ${c}
                    </div>
                </div>
                <p class="text-xs text-amber-400 font-bold mt-3 text-center">সব তথ্য সঠিক থাকলে "কনফার্ম ও সেভ করুন" বাটনে ক্লিক করুন।</p>
            `,showCancelButton:!0,confirmButtonText:`<i class="fa-solid fa-cloud-arrow-up mr-2"></i>কনফার্ম ও সেভ করুন`,cancelButtonText:`<i class="fa-solid fa-pen-to-square mr-2"></i>সংশোধন করব`,width:`700px`,customClass:{popup:`!bg-slate-950 !text-white !rounded-3xl border border-slate-800 shadow-2xl font-bn`,confirmButton:`m3-btn-primary !bg-blue-600 hover:!bg-blue-500 !px-7 !py-2.5 !rounded-xl font-bold shadow-lg shadow-blue-600/30`,cancelButton:`m3-btn-tonal !bg-slate-800 hover:!bg-slate-700 !text-slate-300 !px-5 !py-2.5 !rounded-xl font-bold border border-slate-700`}})).isConfirmed)return;H.default.fire({title:`সেভ হচ্ছে...`,text:`${r.length} টি এন্ট্রি প্রসেস করা হচ্ছে।`,allowOutsideClick:!1,didOpen:()=>{H.default.showLoading()},customClass:{popup:`!bg-slate-900 !text-white !rounded-3xl border border-slate-700 font-bn`}});let l=J();l.length||(l=await a.getAll());let u={},d={};l.forEach(e=>{e.name&&(u[e.name.trim().toLowerCase()]={id:e.id,totalDue:Number(e.totalDue)||0,accountNo:e.accountNo||``,isNew:!1,zone:e.zone||``}),e.accountNo&&(d[String(e.accountNo).toLowerCase()]={id:e.id,totalDue:Number(e.totalDue)||0,accountNo:e.accountNo||``,isNew:!1,zone:e.zone||``})});let f=`General`,p=`GEN`;try{let e=await v.getAllZones();e&&e.length>0&&(f=e[0].name,p=e[0].code||``)}catch(e){console.warn(e)}let h=0,_={...u};r.forEach(e=>{let t=e.name.trim().toLowerCase(),n=e.name.match(/^\[([a-zA-Z0-9_-]+)\]/),r=n?n[1].toLowerCase():null,i=e.name.replace(/^\[[a-zA-Z0-9_-]+\]\s*/,``).replace(/\s*\(.*\)$/,``).trim().toLowerCase();r&&d[r]||_[i]||_[t]||(_[t]=!0,h++)});let y=g.collection.doc(`counters`),b=0;if(h>0){if(!navigator.onLine)return H.default.fire({title:`অফলাইন সতর্কবার্তা`,text:`নতুন কাস্টমার তৈরিতে অ্যাকাউন্ট নম্বর নিশ্চিত করতে ইন্টারনেট সংযোগ প্রয়োজন।`,icon:`error`});await m.runTransaction(async e=>{let t=await e.get(y),n=t.exists&&t.data().zoneCounters?t.data().zoneCounters:{},r=parseInt(n[f]||0);b=r,n[f]=r+h,e.set(y,{zoneCounters:n},{merge:!0})})}let x=m.batch(),S=0,C={},w={};for(let e of r){let t=e.name.trim().toLowerCase(),r=``,i=t,s=e.name.match(/^\[([a-zA-Z0-9_-]+)\]/);if(s){let e=s[1].toLowerCase();d[e]&&(r=d[e].id,i=Object.keys(u).find(e=>u[e].id===r)||t)}if(!r){let n=e.name.replace(/^\[[a-zA-Z0-9_-]+\]\s*/,``).replace(/\s*\(.*\)$/,``).trim().toLowerCase();if(u[n])r=u[n].id,i=n;else if(u[t])r=u[t].id;else{r=a.getRef().id,b++;let n=p+String(b).padStart(4,`0`);u[t]={id:r,totalDue:0,accountNo:n,zone:f,isNew:!0,phone:e.phone||``,name:e.name.replace(/^\[[a-zA-Z0-9_-]+\]\s*/,``).replace(/\s*\(.*\)$/,``).trim()},i=t}}let c=L(u[i]?.totalDue||0),l=L(e.bill-e.paid),h=L(c+l);u[i]&&(u[i].totalDue=h);let g=u[i]?.name||e.name.replace(/^\[[a-zA-Z0-9_-]+\]\s*/,``).replace(/\s*\(.*\)$/,``).trim(),_=o.getRef();if(x.set(_,{customerId:r,customerName:g,date:z(e.date),voucherNo:e.voucher||``,bill:L(e.bill),paid:L(e.paid),receivedType:e.paid>0?e.receivedType||`Bank`:``,receivedFrom:e.paid>0&&e.receivedFrom||``,prevDue:c,currentDue:h,createdBy:window.AppState?.currentUserEmail||`Unknown`,createdAt:n.firestore.FieldValue.serverTimestamp()}),S++,u[i]?.isNew?w[r]?w[r].totalDue=h:w[r]={name:g,phone:u[i].phone||``,address:`Bulk Import`,zone:u[i].zone||f,accountNo:u[i].accountNo,totalDue:h,initialDue:0,createdAt:n.firestore.FieldValue.serverTimestamp()}:C[r]=L((C[r]||0)+l),S>=300){for(let[e,t]of Object.entries(C))t!==0&&!w[e]&&x.update(a.getRef(e),{totalDue:n.firestore.FieldValue.increment(t)});for(let[e,t]of Object.entries(w))x.set(a.getRef(e),t),u[i]&&(u[i].isNew=!1);await x.commit(),x=m.batch(),S=0;for(let e in C)delete C[e];for(let e in w)delete w[e]}}for(let[e,t]of Object.entries(C))t!==0&&!w[e]&&(x.update(a.getRef(e),{totalDue:n.firestore.FieldValue.increment(t)}),S++);for(let[e,t]of Object.entries(w))x.set(a.getRef(e),t),S++;if(S>0&&await x.commit(),O(`BULK_ENTRY`,`BulkSave`,`bulk_save`,`Bulk saved ${r.length} transactions`,{totalBill:i,totalPaid:s}),H.default.fire({title:`সফল!`,text:`সফলভাবে ${r.length} টি ডাটা সেভ হয়েছে!`,icon:`success`}),t){let e=document.getElementById(`excel-file`);e&&(e.value=``);let t=document.getElementById(`process-excel-btn`);t&&(t.disabled=!1,t.innerHTML=`<i class="fa-solid fa-upload"></i> ফাইল আপলোড ও সেভ করুন`)}else typeof window.switchBulkTab==`function`&&window.switchBulkTab(`spreadsheet`)}catch(e){console.error(`Bulk save error:`,e),H.default.fire(`Error!`,`ডাটা সেভ করতে সমস্যা হয়েছে। দয়া করে আবার চেষ্টা করুন।`,`error`)}finally{if(t){let e=document.getElementById(`process-excel-btn`);e&&(e.disabled=!1,e.innerHTML=`<i class="fa-solid fa-upload"></i> ফাইল আপলোড ও সেভ করুন`)}}}function Yi(){let e=document.getElementById(`spreadsheet-body`);if(!e)return;let t=document.createElement(`tr`),n=localStorage.getItem(`workingDate`);(!n||!/^\d{4}-\d{2}-\d{2}$/.test(n))&&(n=window.getTodayLocalDateString?window.getTodayLocalDateString():new Date().toISOString().split(`T`)[0]);let r=e.children.length+1;t.innerHTML=`
        <td class="!px-1 !py-1 border-b border-slate-800/50">
            <input type="text" class="grid-input m3-field !bg-slate-900/50 !py-1.5 !px-2 text-xs datepicker" value="${n}" onchange="if(this.value) localStorage.setItem('workingDate', this.value)">
        </td>
        <td class="!px-1 !py-1 border-b border-slate-800/50"><input type="text" list="customer-datalist" class="grid-input m3-field !bg-slate-900/50 !py-1.5 !px-2 text-xs" placeholder="নাম / অ্যাকাউন্ট নং / ফোন"></td>
        <td class="!px-1 !py-1 border-b border-slate-800/50"><input type="text" class="grid-input m3-field !bg-slate-900/50 !py-1.5 !px-2 text-xs" placeholder="ভাউচার"></td>
        <td class="!px-1 !py-1 border-b border-slate-800/50">
            <input type="text" class="grid-input m3-field !bg-slate-900/50 !py-1.5 !px-2 text-xs font-bold text-red-400" placeholder="0" oninput="window.handleNumberInput(this); window.updateLiveWords(this, 'grid-b-words-${r}')">
            <div id="grid-b-words-${r}" class="text-[10px] font-black text-red-400 mt-1 px-1.5 py-0.5 rounded bg-red-500/10 border border-red-500/20 truncate hidden italic"></div>
        </td>
        <td class="!px-1 !py-1 border-b border-slate-800/50">
            <input type="text" class="grid-input m3-field !bg-slate-900/50 !py-1.5 !px-2 text-xs font-bold text-emerald-400" placeholder="0" oninput="window.handleNumberInput(this); window.updateLiveWords(this, 'grid-p-words-${r}')">
            <div id="grid-p-words-${r}" class="text-[10px] font-black text-emerald-400 mt-1 px-1.5 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/20 truncate hidden italic"></div>
        </td>
        <td class="!px-1 !py-1 border-b border-slate-800/50">
            <select class="grid-input m3-field !bg-slate-900 !py-1.5 !px-1 text-xs text-blue-400 font-bold cursor-pointer" onchange="window.updateGridBankOptions(this, ${r})">
                <option value="Bank" class="!bg-slate-900 !text-white font-bold py-2">Bank</option>
                <option value="Cash" class="!bg-slate-900 !text-white font-bold py-2">Cash</option>
                <option value="Less" class="!bg-slate-900 !text-purple-400 font-bold py-2">Less</option>
            </select>
        </td>
        <td class="!px-1 !py-1 border-b border-slate-800/50" id="bank-cell-${r}">
            <select class="grid-input m3-field !bg-slate-900/50 !py-1.5 !px-2 text-xs font-bold cursor-pointer text-slate-300">
                ${window.cachedBanksHtml||`<option value="" class="!bg-slate-900 !text-slate-400">-- ব্যাংক নির্বাচন করুন --</option>`}
            </select>
        </td>
    `,e.appendChild(t),e.children.length>1&&t.children[1].querySelector(`input`)?.focus()}function Xi(e,t){if(e.key===`Enter`||e.key===`Tab`){e.preventDefault();let n=t.closest(`tr`)?.querySelector(`input.datepicker`)?.value;n&&localStorage.setItem(`workingDate`,n),Yi()}}function Zi(e,t){let n=e.value,r=document.getElementById(`bank-cell-${t}`);r&&(n===`Cash`?(e.classList.replace(`text-blue-400`,`text-emerald-400`),e.classList.replace(`text-purple-400`,`text-emerald-400`),r.innerHTML=`<select class="grid-input m3-field !bg-slate-900/50 !py-1.5 !px-2 text-xs font-bold cursor-pointer text-slate-300" onkeydown="window.handleGridKey(event, this)">
            ${window.cachedCashHtml||`<option value="Cash" class="!bg-slate-900 !text-slate-200">Cash</option>`}
        </select>`):n===`Less`?(e.classList.replace(`text-blue-400`,`text-purple-400`),e.classList.replace(`text-emerald-400`,`text-purple-400`),r.innerHTML=`<input type="text" class="grid-input m3-field !bg-slate-900/50 !py-1.5 !px-2 text-xs font-bold text-slate-300" placeholder="যেমন: সম্মানিতে ছাড়..." onkeydown="window.handleGridKey(event, this)">`):(e.classList.replace(`text-emerald-400`,`text-blue-400`),e.classList.replace(`text-purple-400`,`text-blue-400`),r.innerHTML=`<select class="grid-input m3-field !bg-slate-900/50 !py-1.5 !px-2 text-xs font-bold cursor-pointer text-slate-300" onkeydown="window.handleGridKey(event, this)">
            ${window.cachedBanksHtml||`<option value="OneBank (IFRAT)" class="!bg-slate-900 !text-slate-200">OneBank (IFRAT)</option>`}
        </select>`))}function Qi(e,t){let n=document.getElementById(`spreadsheet-body`);if(!n||n.children.length===0)return;let r=document.activeElement?document.activeElement.closest(`tr`):null;if((!r||!n.contains(r))&&(r=n.children[n.children.length-1]),!r)return;let i=Array.from(n.children).indexOf(r)+1,a=r.querySelector(`select`);if(a){a.value=e,Zi(a,i);let n=document.getElementById(`bank-cell-${i}`)?.querySelector(`select`);n&&(n.value=t)}let o=r.querySelectorAll(`input`);o&&o[4]&&o[4].focus()}window.quickSelectSpreadsheetAccount=Qi,window.updateGridBankOptions=Zi;async function $i(){let e=document.getElementById(`spreadsheet-body`).querySelectorAll(`tr`),t=[];if(e.forEach(e=>{let n=e.querySelectorAll(`input, select`),r=n[0].value,i=n[1].value.trim(),a=i,o=``;if(i.startsWith(`[`)){let e=i.match(/^\[.*?\]\s*([^(]+)/);e&&(a=e[1].trim());let t=i.match(/\(([^)]+)\)/);t&&(o=t[1].trim())}let s=n[2].value.trim(),c=I(n[3].value),l=I(n[4].value),u=n[5].value||`Bank`,d=n[6].value.trim();a&&(c>0||l>0)&&t.push({date:r,name:a,phone:o,voucher:s,bill:c,paid:l,receivedType:u,receivedFrom:d})}),t.length===0){H.default.fire(`খালি ফর্ম`,`সেভ করার মতো কোনো ডাটা পাওয়া যায়নি।`,`warning`);return}let n=document.getElementById(`save-spreadsheet-btn`);n&&(n.disabled=!0,n.innerHTML=`<i class="fa-solid fa-spinner fa-spin mr-2"></i>সেভ হচ্ছে...`);try{await Ji(t)}catch(e){console.error(`saveSpreadsheetData error:`,e)}finally{n&&(n.disabled=!1,n.innerHTML=`<i class="fa-solid fa-cloud-arrow-up mr-2"></i> সব সেভ করুন`)}}async function ea(){if(window.AppState?.currentUserRole!==`Admin`)return H.default.fire(`অ্যাক্সেস ডিনাইড!`,`শুধুমাত্র অ্যাডমিন এক্সেল ডাটা ব্যাকআপ করতে পারবেন।`,`error`);if(await W(`এক্সেল ডাটা ব্যাকআপ ও টেমপ্লেট ডাউনলোড`))try{H.default.fire({title:`স্মার্ট এক্সেল জেনারেট হচ্ছে...`,text:`ডাটা প্রসেস করা হচ্ছে, অনুগ্রহ করে অপেক্ষা করুন`,allowOutsideClick:!1,didOpen:()=>H.default.showLoading(),customClass:{popup:`!bg-slate-900 !text-white !rounded-3xl border border-slate-700`}}),Y();let e=J(),t=await o.getAll();t.sort((e,t)=>{let n=new Date(e.date||0),r=new Date(t.date||0);return n-r===0?(e.createdAt?.toMillis()||0)-(t.createdAt?.toMillis()||0):n-r});let[n,r,i]=R().split(`-`),a=`${i}/${r}/${n}`,s=[[`মা মোটরস ইআরপি — কাস্টমার হিসেব ও বর্তমান মোট বকেয়া`,``,``,``,`তারিখ: ${a}`],[`অ্যাকাউন্ট নং`,`কাস্টমারের নাম`,`মোবাইল নম্বর`,`ঠিকানা`,`বর্তমান মোট বকেয়া (৳)`]];e.forEach(e=>s.push([e.accountNo||``,e.name||``,e.phone||``,e.address||``,Number(e.totalDue)||0]));let c=s.length;s.push([`মোট হিসাব`,`মোট কাস্টমার: ${e.length} জন`,``,`মার্কেটে মোট বকেয়া (৳):`,{f:`SUM(E3:E${c})`}]);let l=x.aoa_to_sheet(s),u=[[`মা মোটরস ইআরপি — সকল লেনদেন ও রশিদ বই এন্ট্রি শিট`,``,``,``,``,``,``,``,`ডাউনলোড: ${a}`],[`তারিখ (DD/MM/YYYY)`,`কাস্টমারের নাম / আইডি`,`মোবাইল`,`ভাউচার নং`,`বিল (Debit)`,`জমা (Credit)`,`ব্যালেন্স`,`মাধ্যম (Bank/Cash)`,`ব্যাংক/বিবরণ`]];t.forEach((t,n)=>{let r=n+3,i=t.date;if(t.date&&/^\d{4}-\d{2}-\d{2}$/.test(t.date)){let[e,n,r]=t.date.split(`-`);i=`${r}/${n}/${e}`}let a=e.find(e=>e.id===t.customerId),o=a?`[${a.accountNo}] ${a.name}`:t.customerName;u.push([i,o,a?.phone||``,t.voucherNo||``,Number(t.bill)||0,Number(t.paid)||0,{f:`E${r}-F${r}`},t.receivedType||(t.paid>0?`Bank`:``),t.receivedFrom||``])});let d=u.length+1;for(let e=0;e<30;e++){let t=d+e;u.push([``,``,``,``,``,``,{f:`IF(AND(E${t}="",F${t}=""),"",E${t}-F${t})`},`Bank`,``])}let f=u.length+1;u.push([`সর্বমোট হিসাব`,``,``,`মোট লেনদেন: ${t.length}`,{f:`SUM(E3:E${f-1})`},{f:`SUM(F3:F${f-1})`},{f:`E${f}-F${f}`},``,``]);let p=x.aoa_to_sheet(u),m=Math.max(c,3);p[`!dataValidation`]=[{sqref:`H3:H${f-1}`,type:`list`,operator:`equal`,formula1:`"Bank,Cash"`,showErrorMessage:!0},{sqref:`B3:B${f-1}`,type:`list`,operator:`equal`,formula1:`'কাস্টমার তালিকা ও বর্তমান ব্যালেন্স'!$B$3:$B$${m}`}],l[`!cols`]=[{wch:15},{wch:25},{wch:18},{wch:30},{wch:24}],p[`!cols`]=[{wch:18},{wch:32},{wch:16},{wch:14},{wch:18},{wch:18},{wch:20},{wch:20},{wch:35}];let h=x.book_new();x.book_append_sheet(h,l,`কাস্টমার তালিকা ও বর্তমান ব্যালেন্স`),x.book_append_sheet(h,p,`খতিয়ান ও নতুন লেনদেন এন্ট্রি`);let g=`Maa_Motors_Smart_Backup_${i}-${r}-${n}.xlsx`;S(h,g),H.default.fire({title:`সফল!`,text:`ব্যাকআপ ফাইলটি ডাউনলোড হয়েছে।`,icon:`success`})}catch(e){console.error(e),H.default.fire(`এরর!`,`এক্সেল তৈরি করতে সমস্যা হয়েছে।`,`error`)}}async function ta(e,t){H.default.fire({title:`ডাটা সেভ হচ্ছে...`,text:`কাস্টমার ও খতিয়ান ডাটাবেসে আপডেট করা হচ্ছে`,allowOutsideClick:!1,didOpen:()=>H.default.showLoading(),customClass:{popup:`!bg-slate-900 !text-white !rounded-3xl border border-slate-700`}});try{let r=await v.getAllZones(),i={};r.forEach(e=>i[e.name]=e);let s={};if(t.size>0){let e=Array.from(t);await m.runTransaction(async t=>{let r=await t.get(g.collection.doc(`counters`)),o=r.exists&&r.data().zoneCounters?r.data().zoneCounters:{};for(let r of e){let e=`General`;if(!i[e]){let r=v.getRef();t.set(r,{name:e,code:`10`,createdAt:n.firestore.FieldValue.serverTimestamp()}),i[e]={name:e,code:`10`}}let c=i[e],l=(o[e]||0)+1;o[e]=l;let u=c.code+String(l).padStart(4,`0`),d=a.getRef();t.set(d,{name:r,phone:``,address:``,zone:e,accountNo:u,totalDue:0,createdAt:n.firestore.FieldValue.serverTimestamp()}),s[r]={id:d.id,accountNo:u}}t.set(g.collection.doc(`counters`),{zoneCounters:o},{merge:!0})})}let c={};for(let t of e){let e=t.matchedCustId||s[t.customerName]?.id;e&&(c[e]||(c[e]=[]),c[e].push(t))}let l=Object.keys(c),u=m.batch(),d=0;for(let e of l){let t=a.getRef(e),r=await t.get(),i=r.exists&&r.data().totalDue||0,s=c[e];for(let t of s){let r=i;i=r+t.bill-t.paid;let a=o.getRef();u.set(a,{customerId:e,customerName:t.customerName,date:t.date,voucherNo:t.voucher,bill:t.bill,paid:t.paid,receivedType:t.receivedType,receivedFrom:t.receivedFrom,prevDue:r,currentDue:i,createdBy:n.auth().currentUser?.email||`Admin Excel Import`,createdAt:n.firestore.FieldValue.serverTimestamp()}),d++,d>=490&&(await u.commit(),u=m.batch(),d=0)}let l=r.exists&&r.data().totalDue||0,f=i-l;u.update(t,{totalDue:n.firestore.FieldValue.increment(f)}),d++,d>=490&&(await u.commit(),u=m.batch(),d=0)}return d>0&&await u.commit(),!0}catch(e){throw console.error(`Sync Engine Error:`,e),e}}async function na(e){if(window.AppState?.currentUserRole!==`Admin`)return H.default.fire(`অ্যাক্সেস ডিনাইড!`,`শুধুমাত্র অ্যাডমিন এক্সেল ফাইল আপলোড করতে পারবেন।`,`error`);let t=e?.files?.[0];if(t){if(!await W(`এক্সেল ডাটা ইমপোর্ট`)){e.value=``;return}try{H.default.fire({title:`এক্সেল রিড করা হচ্ছে...`,allowOutsideClick:!1,didOpen:()=>H.default.showLoading(),customClass:{popup:`!bg-slate-900 !text-white`}});let n=await t.arrayBuffer(),r=C(n,{type:`array`}),i=r.SheetNames.find(e=>e.includes(`এন্ট্রি`)||e.includes(`Template`))||r.SheetNames[0],a=x.sheet_to_json(r.Sheets[i],{defval:``});if(!a.length)return e.value=``,H.default.fire(`খালি ফাইল`,`কোনো ডাটা পাওয়া যায়নি।`,`warning`);Y();let o=J(),s=[],c=new Set,l=0,u=0,d=0;a.forEach(e=>{let t=Object.keys(e),n=e=>t.find(t=>e.some(e=>t.toLowerCase().includes(e))),r=String(e[n([`তারিখ`,`date`])]||``).trim(),i=String(e[n([`কাস্টমার`,`name`])]||``).trim(),a=String(e[n([`মোবাইল`,`phone`])]||``).trim(),f=String(e[n([`ভাউচার`,`voucher`])]||``).trim(),p=I(e[n([`বিল`,`debit`,`bill`])]),m=I(e[n([`জমা`,`credit`,`paid`])]),h=String(e[n([`মাধ্যম`,`type`])]||`Bank`).trim(),g=String(e[n([`ব্যাংক`,`বিবরণ`,`details`])]||``).trim();if(!i||i.includes(`নমুনা`)||p===0&&m===0)return;let _=R();if(/^\d{2}\/\d{2}\/\d{4}$/.test(r)){let[e,t,n]=r.split(`/`);_=`${n}-${t}-${e}`}else if(/^\d{4}-\d{2}-\d{2}$/.test(r))_=r;else if(r&&!isNaN(r)){let e=new Date(Math.round((parseFloat(r)-25569)*86400*1e3));isNaN(e.getTime())||(_=e.toISOString().split(`T`)[0])}let v=i,y=null;if(i.startsWith(`[`)){let e=i.match(/^\[(.*?)\]/);e&&(y=e[1].trim()),v=i.replace(/^\[.*?\]\s*/,``).trim()}v=v.replace(/\s*\([^)]*\)\s*$/,``).trim();let b=null;if(y&&(b=o.find(e=>String(e.accountNo).trim()===y)),!b&&a){let e=a.replace(/\D/g,``);b=o.find(t=>String(t.phone).replace(/\D/g,``)===e)}!b&&v&&(b=o.find(e=>(e.name||``).toLowerCase().trim()===v.toLowerCase())),b?d++:c.add(v),l=L(l+p),u=L(u+m),s.push({date:_,customerName:v,matchedCustId:b?.id||null,phone:a,voucher:f,bill:p,paid:m,receivedType:h.toLowerCase().includes(`cash`)?`Cash`:`Bank`,receivedFrom:g})}),(await H.default.fire({title:`<div class="flex items-center justify-center gap-2 font-bn text-white"><i class="fa-solid fa-file-excel text-emerald-400"></i><span>এক্সেল সিঙ্ক প্রিভিউ</span></div>`,html:`
                <div class="text-left font-bn space-y-3 bg-slate-900 p-4 rounded-2xl border border-slate-800 text-sm">
                    <div class="flex justify-between border-b border-slate-800 pb-2"><span class="text-slate-400">লেনদেন:</span><strong class="text-white">${s.length} টি</strong></div>
                    <div class="flex justify-between border-b border-slate-800 pb-2"><span class="text-slate-400">পুরাতন কাস্টমার:</span><strong class="text-emerald-400">${d} জন</strong></div>
                    <div class="flex justify-between border-b border-slate-800 pb-2"><span class="text-slate-400">নতুন কাস্টমার:</span><strong class="text-blue-400">${c.size} জন</strong></div>
                    <div class="flex justify-between border-b border-slate-800 pb-2"><span class="text-slate-400">মোট বিল:</span><strong class="text-red-400">৳ ${F(l)}</strong></div>
                    <div class="flex justify-between"><span class="text-slate-400">মোট জমা:</span><strong class="text-emerald-400">৳ ${F(u)}</strong></div>
                </div>`,showCancelButton:!0,confirmButtonText:`হ্যাঁ, সিঙ্ক করুন`})).isConfirmed&&(await ta(s,c),H.default.fire(`সাফল্য!`,`সিঙ্ক সম্পন্ন হয়েছে।`,`success`)),e.value=``}catch(t){G(t,`এক্সেল ফাইল প্রসেস করতে ব্যর্থ`),e.value=``}}}window.downloadAdminExcelBackup=ea,window.uploadAdminExcelBackup=na;function ra(e){if((async()=>{try{await Promise.all([Kn(),qn()]);let e=document.getElementById(`grid-bank-name-1`);if(e&&window.cachedBanksHtml){let t=e.closest(`tr`).querySelector(`select`);t&&t.value===`Bank`&&(e.innerHTML=window.cachedBanksHtml)}}catch(e){console.error(e)}})(),window.AppState?.currentUserRole===`Staff`&&window.AppState?.permissions?.viewBulkEntry===!1){e.innerHTML=`<div class="m3-card text-center font-bn py-12"><h2 class="text-xl font-black text-red-500">অ্যাক্সেস ডিনাইড!</h2></div>`;return}e.innerHTML=`
        <div class="flex flex-col gap-6">
            <div class="px-2">
                <h2 class="text-2xl font-bold flex items-center gap-4 text-white font-bn">
                    <div class="w-1.5 h-8 bg-blue-600 rounded-full shadow-lg"></div>
                    ফাস্ট এন্ট্রি (Bulk Entry)
                </h2>
            </div>
            <div class="flex flex-wrap gap-2 p-1 bg-slate-800/50 border border-slate-700/50 rounded-xl self-start ml-2 font-bn">
                <button class="px-6 py-2 text-sm font-semibold rounded-lg transition-all" id="tab-spreadsheet" onclick="window.switchBulkTab('spreadsheet')">স্প্রেডশিট গ্রিড</button>
                <button class="px-6 py-2 text-sm font-semibold rounded-lg transition-all" id="tab-excel" onclick="window.switchBulkTab('excel')">এক্সেল আপলোড</button>
                ${window.AppState?.currentUserRole===`Admin`?`
        <button class="px-6 py-2 text-sm font-semibold rounded-lg transition-all text-emerald-400 border border-emerald-500/30 bg-emerald-500/10 hover:bg-emerald-500/20" id="tab-admin-excel" onclick="window.switchBulkTab('admin-excel')">
            <i class="fa-solid fa-file-excel mr-1"></i> স্মার্ট এক্সেল (Admin Only)
        </button>`:``}
            </div>
            <div id="bulk-content-area" class="m3-card"></div>
        </div>
    `,aa(),ia(`spreadsheet`)}function ia(e){let t=document.getElementById(`bulk-content-area`),n={spreadsheet:document.getElementById(`tab-spreadsheet`),excel:document.getElementById(`tab-excel`),"admin-excel":document.getElementById(`tab-admin-excel`)};Object.keys(n).forEach(t=>{n[t]&&(t===e?n[t].className=t===`admin-excel`?`px-6 py-2 text-sm font-semibold rounded-lg bg-emerald-600 text-white shadow-md`:`px-6 py-2 text-sm font-semibold rounded-lg bg-blue-600 text-white shadow-md`:n[t].className=t===`admin-excel`?`px-6 py-2 text-sm font-semibold rounded-lg text-emerald-400 border border-emerald-500/30 bg-emerald-500/10`:`px-6 py-2 text-sm font-semibold rounded-lg text-slate-400 hover:text-white`)}),e===`spreadsheet`?(t.innerHTML=`
            <div class="flex flex-wrap items-center justify-between gap-2 mb-3 px-2 font-bn">
                <p class="text-[11px] text-slate-500 flex items-center gap-1.5 uppercase font-bold">
                    <i class="fa-solid fa-info-circle text-blue-500"></i> কীবোর্ড দিয়ে দ্রুত টাইপ করুন। শেষ ঘরে 'Enter' বা 'Tab' চাপলে নতুন লাইন তৈরি হবে।
                </p>
                <div class="flex items-center gap-1.5">
                    <span class="text-[10px] text-slate-500 font-bold">শর্টকাট:</span>
                    <button type="button" onclick="window.quickSelectSpreadsheetAccount('Bank', 'OneBank (IFRAT)')" class="text-[10px] font-bold text-blue-400 bg-blue-500/10 hover:bg-blue-500/20 border border-blue-500/30 px-2 py-0.5 rounded-lg transition-all flex items-center gap-1 cursor-pointer" title="OneBank (Alt+1)"><span>OneBank</span><kbd class="text-[9px] bg-slate-900 px-1 rounded text-slate-400 font-mono">Alt+1</kbd></button>
                    <button type="button" onclick="window.quickSelectSpreadsheetAccount('Bank', 'IBBL (IFRAT)')" class="text-[10px] font-bold text-blue-400 bg-blue-500/10 hover:bg-blue-500/20 border border-blue-500/30 px-2 py-0.5 rounded-lg transition-all flex items-center gap-1 cursor-pointer" title="IBBL (Alt+2)"><span>IBBL</span><kbd class="text-[9px] bg-slate-900 px-1 rounded text-slate-400 font-mono">Alt+2</kbd></button>
                    <button type="button" onclick="window.quickSelectSpreadsheetAccount('Cash', 'শোরুম ক্যাশ')" class="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 px-2 py-0.5 rounded-lg transition-all flex items-center gap-1 cursor-pointer" title="শোরুম ক্যাশ (Alt+3)"><span>ক্যাশ</span><kbd class="text-[9px] bg-slate-900 px-1 rounded text-slate-400 font-mono">Alt+3</kbd></button>
                </div>
            </div>
            <div class="m3-table-container">
                <table class="m3-table w-full table-fixed min-w-[960px]">
                    <thead>
                        <tr class="font-bn">
                            <th class="w-[130px]">তারিখ</th>
                            <th class="w-[200px]">কাস্টমারের নাম / আইডি</th>
                            <th class="w-[120px]">ভাউচার</th>
                            <th class="w-[130px]">বিল (Debit)</th>
                            <th class="w-[130px]">জমা (Credit)</th>
                            <th class="w-[110px]">মাধ্যম</th>
                            <th class="w-[140px]">ব্যাংক / নাম</th>
                        </tr>
                    </thead>
                    <tbody id="spreadsheet-body" class="font-bn"></tbody>
                </table>
            </div>
            <div class="mt-4 flex justify-end px-2">
                <button class="m3-btn-primary px-10" onclick="window.saveSpreadsheetData()" id="save-spreadsheet-btn">সব সেভ করুন</button>
            </div>
        `,Yi()):t.innerHTML=e===`admin-excel`?`
            <div class="max-w-3xl mx-auto space-y-6 py-6 font-bn">
                <div class="text-center">
                    <i class="fa-solid fa-shield-halved text-5xl text-emerald-500 mb-2"></i>
                    <h3 class="text-xl font-black text-white">স্মার্ট এক্সেল সিঙ্ক (Admin Only)</h3>
                </div>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div class="bg-slate-900/80 p-6 rounded-3xl border border-slate-700/60 flex flex-col justify-between space-y-4">
                        <h4 class="text-white font-bold">১. ব্যাকআপ ডাউনলোড</h4>
                        <button class="m3-btn-primary !bg-emerald-600" onclick="window.downloadAdminExcelBackup()">ডাউনলোড করুন</button>
                    </div>
                    <div class="bg-slate-900/80 p-6 rounded-3xl border border-slate-700/60 flex flex-col justify-between space-y-4">
                        <h4 class="text-white font-bold">২. এক্সেল আপলোড</h4>
                        <input type="file" id="bulk-admin-excel-file" class="hidden" onchange="window.uploadAdminExcelBackup(this)">
                        <button class="m3-btn-primary !bg-blue-600" onclick="document.getElementById('bulk-admin-excel-file').click()">আপলোড ও সিঙ্ক</button>
                    </div>
                </div>
            </div>`:`
            <div class="max-w-2xl mx-auto space-y-6 py-10 font-bn text-center">
                <p class="text-slate-300">এক্সেল (.xlsx) বা .csv ফাইল সিলেক্ট করুন।</p>
                <input type="file" id="excel-file" accept=".xlsx, .xls, .csv" class="m3-field py-10 border-dashed border-2">
                <button class="m3-btn-primary w-full" onclick="window.processExcelUpload()" id="process-excel-btn">আপলোড ও সেভ</button>
            </div>`}async function aa(){try{let e=J();e.length||(Y(),e=await a.getAll());let t=document.getElementById(`customer-datalist`);t||(t=document.createElement(`datalist`),t.id=`customer-datalist`,document.body.appendChild(t)),t.innerHTML=e.map(e=>{let t=e.accountNo?`[${e.accountNo}] `:``;return`<option value="${t}${e.name}${e.phone?` (`+e.phone+`)`:``}">${t}${e.name}</option>`}).join(``)}catch(e){console.error(e)}}window.switchBulkTab=ia,window.loadCustomerDatalist=aa;async function oa(){let e=document.getElementById(`excel-file`);if(!e||!e.files.length){H.default.fire(`ফাইল নেই`,`দয়া করে একটি এক্সেল ফাইল সিলেক্ট করুন।`,`warning`);return}let t=e.files[0],n=new FileReader,r=document.getElementById(`process-excel-btn`);r&&(r.disabled=!0,r.innerHTML=`ফাইল পড়া হচ্ছে...`),n.onload=async e=>{try{let t=new Uint8Array(e.target.result),n=window.XLSX.read(t,{type:`array`}),i=n.SheetNames[0],a=n.Sheets[i],o=window.XLSX.utils.sheet_to_json(a,{header:1});if(o.length<=1)throw Error(`ফাইলটি খালি বা ডাটা নেই!`);let s=window.getTodayLocalDateString?window.getTodayLocalDateString():new Date().toISOString().split(`T`)[0],c=[];for(let e=1;e<o.length;e++){let t=o[e];if(!t||t.length===0)continue;let n=s,r=t[0];if(r)if(typeof r==`number`)n=new Date(Math.round((r-25569)*86400*1e3)).toISOString().split(`T`)[0];else{let e=new Date(r);isNaN(e)||(n=e.toISOString().split(`T`)[0])}let i=String(t[1]||``).trim(),a=String(t[2]||``).trim(),l=String(t[3]||``).trim(),u=parseFloat(t[4])||0,d=parseFloat(t[5])||0,f=String(t[6]||`Bank`).trim(),p=String(t[7]||``).trim();i&&(u>0||d>0)&&c.push({date:n,name:i,phone:a,voucher:l,bill:u,paid:d,receivedType:f,receivedFrom:p})}if(!c.length){H.default.fire(`ডাটা নেই`,`ভ্যালিড কোনো ডাটা পাওয়া যায়নি।`,`warning`),r&&(r.disabled=!1,r.innerHTML=`ফাইল আপলোড ও সেভ করুন`);return}await Ji(c,!0)}catch(e){console.error(e),H.default.fire(`Error`,`ফাইল প্রসেস করতে সমস্যা হয়েছে।`,`error`),r&&(r.disabled=!1,r.innerHTML=`ফাইল আপলোড ও সেভ করুন`)}},n.readAsArrayBuffer(t)}window.switchBulkTab=ia,window.loadCustomerDatalist=aa,window.addSpreadsheetRow=Yi,window.handleGridKey=Xi,window.saveSpreadsheetData=$i,window.processExcelUpload=oa,window.executeBulkSave=$i;var sa=null;function ca(){try{sa&&sa();let e=document.getElementById(`admin-users-list`);if(!e)return;sa=u.listenAll(t=>{t.sort((e,t)=>{if(e.status===`pending`&&t.status!==`pending`)return-1;if(e.status!==`pending`&&t.status===`pending`)return 1;let n=e.createdAt?e.createdAt.toMillis():0;return(t.createdAt?t.createdAt.toMillis():0)-n});let r=document.getElementById(`stat-total-users`),i=document.getElementById(`stat-active-users`),a=document.getElementById(`stat-pending-users`),o=document.getElementById(`stat-blocked-users`),s=t.filter(e=>e.status===`approved`).length,c=t.filter(e=>e.status===`pending`).length,l=t.filter(e=>e.status===`blocked`||e.status===`revoked`).length;r&&(r.textContent=t.length),i&&(i.textContent=s),a&&(a.textContent=c),o&&(o.textContent=l);let u=`<div class="grid grid-cols-1 gap-3">`;t.forEach(e=>{let t=e.id,r=t===n.auth().currentUser?.uid,i=e.status===`pending`,a=e.status===`blocked`||e.status===`revoked`,o=e.email||t,s=(o.charAt(0)||`?`).toUpperCase(),c=`N/A`;if(e.lastLogin){let t=e.lastLogin.toDate();c=t.toLocaleDateString(`en-GB`)+` `+t.toLocaleTimeString([],{hour:`2-digit`,minute:`2-digit`})}let l=i?`bg-amber-500/15 border-amber-500/30 text-amber-400`:a?`bg-red-500/15 border-red-500/30 text-red-400`:r?`bg-indigo-500/15 border-indigo-500/30 text-indigo-400`:`bg-slate-700/50 border-slate-600/30 text-slate-300`,d=i?`<span class="text-[9px] bg-amber-500/20 border border-amber-500/30 text-amber-400 px-2 py-0.5 rounded-full font-black uppercase animate-pulse">Pending</span>`:a?`<span class="text-[9px] bg-red-500/20 border border-red-500/30 text-red-400 px-2 py-0.5 rounded-full font-black uppercase">Blocked</span>`:`<span class="text-[9px] bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 px-2 py-0.5 rounded-full font-black uppercase">Active</span>`,f=`<span class="text-[9px] bg-slate-600/30 border border-slate-500/30 text-slate-300 px-2 py-0.5 rounded-full font-black uppercase">Staff</span>`;e.role===`Admin`?f=`<span class="text-[9px] bg-indigo-500/20 border border-indigo-500/30 text-indigo-400 px-2 py-0.5 rounded-full font-black uppercase">Admin</span>`:e.role===`Boss`&&(f=`<span class="text-[9px] bg-amber-500/20 border border-amber-500/30 text-amber-400 px-2 py-0.5 rounded-full font-black uppercase"><i class="fa-solid fa-crown mr-1"></i>Boss</span>`);let p=i?`border-amber-500/30 bg-amber-500/[0.03]`:a?`border-red-500/20 bg-red-500/[0.02]`:e.role===`Boss`?`border-amber-500/30 hover:border-amber-500/50`:`border-slate-800/60 hover:border-indigo-500/20`,m=e.requestedPortal===`boss`||e.role===`Boss`?`Boss`:`Staff`,h=``;r||(h=i?`
                            <button class="h-8 px-3 rounded-lg bg-emerald-600/15 border border-emerald-500/25 hover:bg-emerald-600 text-emerald-400 hover:text-white text-[11px] font-bold transition-all cursor-pointer active:scale-95 flex items-center gap-1" onclick="appAdmin.approveStaff('${t}', '${o}', '${m}')"><i class="fa-solid fa-check text-[10px]"></i>অনুমোদন</button>
                            <button class="h-8 px-3 rounded-lg bg-red-500/10 border border-red-500/25 hover:bg-red-600 text-red-400 hover:text-white text-[11px] font-bold transition-all cursor-pointer active:scale-95 flex items-center gap-1" onclick="appAdmin.deleteUserAccount('${t}', '${o}')"><i class="fa-solid fa-trash text-[10px]"></i>বাতিল</button>`:e.role===`Staff`||e.role===`Boss`?`
                            ${e.role===`Staff`?`
                            <button class="h-8 w-8 rounded-lg bg-indigo-500/10 border border-indigo-500/20 hover:bg-indigo-600 text-indigo-400 hover:text-white text-xs transition-all cursor-pointer active:scale-95 flex items-center justify-center" onclick="appAdmin.managePermissions('${t}', '${o}')" title="পারমিশন"><i class="fa-solid fa-shield-halved"></i></button>`:``}
                            <button class="h-8 w-8 rounded-lg bg-slate-700/50 border border-slate-600/30 hover:bg-blue-600 text-slate-300 hover:text-white text-xs transition-all cursor-pointer active:scale-95 flex items-center justify-center" onclick="appAdmin.changeStaffPin('${t}', '${e.pin||``}')" title="Change PIN"><i class="fa-solid fa-key"></i></button>
                            <button class="h-8 w-8 rounded-lg bg-amber-500/10 border border-amber-500/20 hover:bg-amber-600 text-amber-400 hover:text-white text-xs transition-all cursor-pointer active:scale-95 flex items-center justify-center" onclick="appAdmin.revokeStaff('${t}')" title="Block"><i class="fa-solid fa-ban"></i></button>
                            <button class="h-8 w-8 rounded-lg bg-red-500/10 border border-red-500/20 hover:bg-red-600 text-red-400 hover:text-white text-xs transition-all cursor-pointer active:scale-95 flex items-center justify-center" onclick="appAdmin.deleteUserAccount('${t}', '${o}')" title="ডিলেট"><i class="fa-solid fa-trash"></i></button>`:`
                            <button class="h-8 w-8 rounded-lg bg-red-500/10 border border-red-500/20 hover:bg-red-600 text-red-400 hover:text-white text-xs transition-all cursor-pointer active:scale-95 flex items-center justify-center" onclick="appAdmin.deleteUserAccount('${t}', '${o}')" title="ডিলেট"><i class="fa-solid fa-trash"></i></button>`);let g=!r&&!i?`<select id="role-${t}" class="h-7 px-2 rounded-lg bg-slate-950/80 border border-slate-700/60 text-xs text-white font-bold outline-none cursor-pointer" onchange="appAdmin.updateUserRole('${t}')">
                        <option value="Admin" ${e.role===`Admin`?`selected`:``}>Admin</option>
                        <option value="Staff" ${e.role===`Staff`?`selected`:``}>Staff</option>
                        <option value="Boss" ${e.role===`Boss`?`selected`:``}>Boss (Executive)</option>
                    </select>`:``;u+=`
                    <div class="rounded-xl border ${p} p-3 md:p-4 transition-all group">
                        <div class="flex items-start gap-3">
                            <!-- Avatar -->
                            <div class="w-10 h-10 rounded-xl ${l} border flex items-center justify-center font-black text-sm shrink-0">${s}</div>
                            <!-- Info -->
                            <div class="flex-1 min-w-0">
                                <div class="flex flex-wrap items-center gap-1.5">
                                    <span class="text-sm font-bold text-white truncate max-w-[200px] md:max-w-[320px]">${o}</span>
                                    ${r?`<span class="text-[9px] bg-blue-500/20 border border-blue-500/30 text-blue-400 px-1.5 py-0.5 rounded font-bold">আপনি</span>`:``}
                                    ${d}
                                    ${f}
                                </div>
                                <div class="flex flex-wrap items-center gap-3 mt-1.5">
                                    <span class="text-[10px] text-slate-500"><i class="fa-regular fa-clock mr-1"></i>Last Login: ${c}</span>
                                    ${g}
                                </div>
                            </div>
                            <!-- Actions -->
                            <div class="flex items-center gap-1.5 shrink-0 flex-wrap justify-end">${h||`<span class="text-[10px] text-slate-500 font-bold italic">Locked</span>`}</div>
                        </div>
                    </div>`}),u+=`</div>`,e.innerHTML=u||`<div class="text-center py-8 text-slate-500 font-bold italic text-sm">কোনো অ্যাকাউন্ট পাওয়া যায়নি</div>`})}catch(e){console.error(`Error loading users:`,e)}}var la=e(i());async function ua(){if(window.AppState?.currentUserRole!==`Admin`)return H.default.fire(`অ্যাক্সেস ডিনাইড!`,`শুধুমাত্র অ্যাডমিন ব্যাকআপ নিতে পারবেন।`,`error`);if(!await W(`সম্পূর্ণ ডাটাবেস ব্যাকআপ ডাউনলোড`,`fullSystemBackup`))return;let{value:e,isDismissed:t}=await H.default.fire({title:`ব্যাকআপ এনক্রিপশন পাসওয়ার্ড`,text:`ফাইলের সুরক্ষার জন্য একটি পাসওয়ার্ড দিন। রিস্টোর করার সময় এই পাসওয়ার্ড লাগবে।`,input:`password`,inputPlaceholder:`আপনার গোপন পাসওয়ার্ড দিন`,showCancelButton:!0,confirmButtonText:`ডাউনলোড শুরু করুন`,cancelButtonText:`বাতিল`,customClass:{popup:`!bg-slate-900 !text-white !rounded-3xl border border-slate-700 font-bn`},inputValidator:e=>{if(!e||e.length<4)return`অন্তত ৪ অক্ষরের পাসওয়ার্ড দিতে হবে!`}});if(!(t||!e)){H.default.fire({title:`ব্যাকআপ প্রস্তুত করা হচ্ছে...`,text:`দয়া করে অপেক্ষা করুন, পুরো ডাটাবেস এক্সপোর্ট হচ্ছে।`,allowOutsideClick:!1,didOpen:()=>H.default.showLoading(),customClass:{popup:`!bg-slate-900 !text-white !rounded-3xl border border-slate-700 font-bn`}});try{let t={systemMeta:{version:`1.0.0`,appName:`MAA MOTORS ERP`,exportTimestamp:new Date().toISOString(),exportedBy:window.AppState?.currentUserEmail||`Unknown`},collections:{}},n={};n.customers=await a.getAll(),n.transactions=await o.getAll();let r=await m.collection(`expenses`).get();n.expenses=[],r.forEach(e=>n.expenses.push({id:e.id,...e.data()}));let i=await m.collection(`zones`).get();n.zones=[],i.forEach(e=>n.zones.push({id:e.id,...e.data()}));let s=await m.collection(`users`).get();n.users=[],s.forEach(e=>n.users.push({id:e.id,...e.data()}));let c=await m.collection(`settings`).get();n.settings=[],c.forEach(e=>n.settings.push({id:e.id,...e.data()}));let l=e=>e.map(e=>{let t={...e};return Object.keys(t).forEach(e=>{t[e]&&typeof t[e].toDate==`function`&&(t[e]={_tType:`timestamp`,iso:t[e].toDate().toISOString()})}),t}),u=0;for(let[e,r]of Object.entries(n))t.collections[e]=l(r),u+=r.length;t.systemMeta.totalRecords=u;let d=JSON.stringify(t),f=la.default.SHA256(d).toString();t.systemMeta.checksum=f;let p=JSON.stringify(t),h=la.default.AES.encrypt(p,e).toString(),g=new Blob([h],{type:`text/plain;charset=utf-8`}),_=URL.createObjectURL(g),v=document.createElement(`a`);v.href=_,v.download=`Maa_Motors_ERP_Backup_${new Date().toISOString().split(`T`)[0]}.enc`,document.body.appendChild(v),v.click(),document.body.removeChild(v),URL.revokeObjectURL(_),O(`SYSTEM_BACKUP`,`Admin`,`Backup`,`Full Database Backup Downloaded`),await SettingsDAO.updateAppSettings({lastDisasterBackupTimestamp:new Date().toISOString()}),H.default.fire({title:`সফল!`,text:`মোট ${u} টি রেকর্ড সফলভাবে এনক্রিপ্ট করে ডাউনলোড করা হয়েছে।`,icon:`success`,customClass:{popup:`!bg-slate-900 !text-white !rounded-3xl border border-slate-700 font-bn`}})}catch(e){console.error(`Backup Export Error:`,e),H.default.fire(`Error`,`ব্যাকআপ জেনারেট করতে সমস্যা হয়েছে!`,`error`)}}}async function da(){if(window.AppState?.currentUserRole!==`Admin`)return H.default.fire(`অ্যাক্সেস ডিনাইড!`,`শুধুমাত্র অ্যাডমিন সিস্টেম রিস্টোর করতে পারবেন।`,`error`);let{value:e}=await H.default.fire({title:`ডাটাবেস রিস্টোর করুন`,text:`আপনার .enc ব্যাকআপ ফাইলটি আপলোড করুন।`,input:`file`,inputAttributes:{accept:`.enc`,"aria-label":`Upload your backup file`},showCancelButton:!0,confirmButtonText:`পরবর্তী ধাপ`,cancelButtonText:`বাতিল`,customClass:{popup:`!bg-slate-900 !text-white !rounded-3xl border border-slate-700 font-bn`}});if(!e)return;let{value:t}=await H.default.fire({title:`ব্যাকআপ পাসওয়ার্ড`,text:`এই ফাইলটি ডিক্রিপ্ট করার জন্য পাসওয়ার্ড দিন:`,input:`password`,showCancelButton:!0,confirmButtonText:`ভ্যালিডেট করুন`,cancelButtonText:`বাতিল`,customClass:{popup:`!bg-slate-900 !text-white !rounded-3xl border border-slate-700 font-bn`}});if(t){H.default.fire({title:`ফাইল যাচাই করা হচ্ছে...`,allowOutsideClick:!1,didOpen:()=>H.default.showLoading(),customClass:{popup:`!bg-slate-900 !text-white !rounded-3xl border border-slate-700 font-bn`}});try{let r=await e.text(),i=``;try{i=la.default.AES.decrypt(r,t).toString(la.default.enc.Utf8)}catch{return H.default.fire(`Error`,`ভুল পাসওয়ার্ড অথবা করাপ্টেড ফাইল!`,`error`)}if(!i)return H.default.fire(`Error`,`ভুল পাসওয়ার্ড অথবা করাপ্টেড ফাইল!`,`error`);let{systemMeta:a,collections:o}=JSON.parse(i),s=JSON.stringify({systemMeta:{...a,checksum:void 0},collections:o});if(la.default.SHA256(s).toString(),!a||!o||a.appName!==`MAA MOTORS ERP`)return H.default.fire(`Error`,`এই ফাইলটি এই সিস্টেমের ব্যাকআপ নয়!`,`error`);if(!await W(`বিপজ্জনক: সম্পূর্ণ ডাটাবেস রিস্টোর`,`fullSystemRestore`)||!(await H.default.fire({title:`<i class="fa-solid fa-triangle-exclamation text-amber-500 mr-2"></i> চূড়ান্ত ওয়ার্নিং`,html:`আপনি <b>${a.exportTimestamp}</b> তারিখের ব্যাকআপ রিস্টোর করতে যাচ্ছেন।<br><br>
                   <b>বর্তমান ডাটাবেসের সমস্ত ডাটা মুছে ফেলা হবে!</b><br>
                   আপনি কি নিশ্চিত?`,icon:`warning`,showCancelButton:!0,confirmButtonColor:`#ef4444`,confirmButtonText:`হ্যাঁ, রিস্টোর করুন!`,cancelButtonText:`বাতিল`,customClass:{popup:`!bg-slate-900 !text-white !rounded-3xl border border-slate-700 font-bn`}})).isConfirmed)return;H.default.fire({title:`রিস্টোর চলছে...`,html:`দয়া করে ব্রাউজার বন্ধ করবেন না।<br><span id="restore-progress" class="text-amber-400 font-bold">0</span>% কমপ্লিট`,allowOutsideClick:!1,didOpen:()=>H.default.showLoading(),customClass:{popup:`!bg-slate-900 !text-white !rounded-3xl border border-slate-700 font-bn`}});for(let e of[`customers`,`transactions`,`expenses`,`zones`,`users`,`settings`,`audit_logs`]){let t=await m.collection(e).get(),n=m.batch(),r=0;for(let e of t.docs)n.delete(e.ref),r++,r>=400&&(await n.commit(),n=m.batch(),r=0);r>0&&await n.commit()}let c=a.totalRecords,l=0;for(let[e,t]of Object.entries(o)){let r=m.batch(),i=0;for(let a of t){let t=a.id;delete a.id,Object.keys(a).forEach(e=>{a[e]&&a[e]._tType===`timestamp`&&(a[e]=n.firestore.Timestamp.fromDate(new Date(a[e].iso)))});let o=m.collection(e).doc(t);r.set(o,a),i++,l++,i>=400&&(await r.commit(),r=m.batch(),i=0,document.getElementById(`restore-progress`).innerText=Math.round(l/c*100))}i>0&&(await r.commit(),document.getElementById(`restore-progress`).innerText=Math.round(l/c*100))}await m.collection(`audit_logs`).add({action:`DISASTER_RECOVERY`,module:`System`,entityId:`All`,entityName:`Full DB Restore`,details:{restoredFrom:a.exportTimestamp},user:window.AppState?.currentUserEmail||`Admin`,timestamp:n.firestore.FieldValue.serverTimestamp()}),await H.default.fire({title:`রিস্টোর সফল!`,text:`ডাটাবেস সফলভাবে রিস্টোর হয়েছে। সিস্টেম এখন ফ্রেশ ডাটা লোড করার জন্য রিস্টার্ট হবে।`,icon:`success`,allowOutsideClick:!1,confirmButtonText:`রিস্টার্ট করুন`,customClass:{popup:`!bg-slate-900 !text-white !rounded-3xl border border-slate-700 font-bn`}});try{await n.firestore().clearPersistence()}catch(e){console.warn(`Could not clear persistence`,e)}window.location.reload(!0)}catch(e){console.error(`Backup Restore Error:`,e),H.default.fire(`Error`,`ডাটা রিস্টোর করার সময় অপ্রত্যাশিত এরর হয়েছে!`,`error`)}}}async function fa(){try{let e=(await g.getAppSettings()).lastDisasterBackupTimestamp,t=new Date,n=!1,r=0;if(!e)n=!0,r=`অনেক`;else{let i=t-new Date(e),a=Math.floor(i/864e5);a>=3&&(n=!0,r=a)}n&&H.default.fire({title:`<i class="fa-solid fa-triangle-exclamation text-red-500 mr-2 text-4xl mb-2 block"></i>বিপজ্জনক পরিস্থিতি!`,html:`<p class="text-slate-300 text-sm">গত <b>${r} দিন</b> ধরে আপনার ডাটাবেসের কোনো डिजाস্টার রিকভারি ব্যাকআপ নেওয়া হয়নি!</p>
                       <p class="text-amber-400 font-bold mt-3 text-xs bg-amber-500/10 p-3 rounded-lg border border-amber-500/20">
                         দয়া করে এখনই এডমিন প্যানেলের "Advanced Disaster Recovery" সেকশন থেকে 1-Click Backup ডাউনলোড করে সুরক্ষিত স্থানে সংরক্ষণ করুন।
                       </p>`,icon:`warning`,confirmButtonText:`ঠিক আছে, আমি ব্যাকআপ নিচ্ছি`,confirmButtonColor:`#ef4444`,customClass:{popup:`!bg-slate-900 !text-white !rounded-3xl border border-red-500/50 shadow-2xl font-bn`,confirmButton:`m3-btn-primary !bg-red-600 hover:!bg-red-500 !px-6 !py-2.5 rounded-xl font-bold text-sm`}})}catch(e){console.error(`Backup reminder check failed:`,e)}}var pa=t({checkBackupReminder:()=>fa,downloadFullSystemBackup:()=>ua,restoreSystemFromBackup:()=>da}),ma=t({autoSyncZoneCounters:()=>_a,cleanupOldAuditLogs:()=>ba,resequenceZoneAccountNumbers:()=>va,setNextAccountNo:()=>ha,showIndividualFixer:()=>ga,syncSingleZoneCounter:()=>ya});async function ha(){try{Y();let e=await v.getAllZones();if(!e||e.length===0)return H.default.fire({title:`কোনো জোন পাওয়া যায়নি!`,text:`সিরিয়াল আপডেট করার আগে আপনাকে অন্তত একটি জোন তৈরি করতে হবে।`,icon:`warning`,customClass:{popup:`!bg-slate-900 !text-white !rounded-3xl border border-slate-700`}});let t=`<option value="">-- জোন সিলেক্ট করুন --</option>`;e.forEach(e=>{t+=`<option value="${e.name}">${e.name}</option>`});let{value:n}=await H.default.fire({title:`অটো-সিরিয়াল কাউন্টার সেট করুন`,html:`<div class="text-left space-y-4 font-bn p-2">
                    <div><label class="block text-xs font-bold text-slate-400 mb-1">জোন সিলেক্ট করুন</label><select id="set-next-zone" class="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white outline-none focus:border-blue-500">${t}</select></div>
                    <div><label class="block text-xs font-bold text-slate-400 mb-1">বর্তমান সিরিয়াল নম্বর (e.g. 5 মানে পরবর্তী আইডি 0006 হবে)</label><input id="set-next-val" type="number" class="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white outline-none focus:border-blue-500" placeholder="e.g. 5"></div>
                </div>`,showCancelButton:!0,confirmButtonText:`আপডেট করুন`,cancelButtonText:`বাতিল`,customClass:{popup:`!bg-slate-900 !text-white !rounded-3xl border border-slate-700`},preConfirm:()=>{let e=document.getElementById(`set-next-zone`).value,t=parseInt(document.getElementById(`set-next-val`).value);return!e||isNaN(t)?H.default.showValidationMessage(`সবগুলো ঘর পূরণ করুন`):{zone:e,val:t}}});if(n){if(!await W(`অটো-সিরিয়াল কাউন্টার পরিবর্তন`))return;try{await g.updateZoneCounter(n.zone,n.val),H.default.fire(`সফল!`,`জোনের (${n.zone}) পরবর্তী সিরিয়াল আপডেট করা হয়েছে।`,`success`)}catch{H.default.fire(`Error`,`কাউন্টার আপডেট করা যায়নি।`,`error`)}}}catch(e){console.error(`setNextAccountNo error:`,e),H.default.fire(`ত্রুটি!`,`ডাটা লোড করতে সমস্যা হয়েছে। দয়া করে পেজ রিফ্রেশ করে আবার চেষ্টা করুন।`,`error`)}}async function ga(){Y();let e=J(),t=`<option value="">-- কাস্টমার সিলেক্ট করুন --</option>`;e.forEach(e=>{t+=`<option value="${e.id}" data-acc="${e.accountNo||``}">${e.accountNo?`[`+e.accountNo+`] `:``}${e.name}</option>`});let{value:n}=await H.default.fire({title:`ID ম্যানেজার`,html:`<div class="text-left space-y-4 font-bn p-2">
                <div><label class="block text-xs font-bold text-slate-400 mb-1">কাস্টমার সিলেক্ট করুন</label><select id="fix-cust-sel" class="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white outline-none focus:border-blue-500" onchange="document.getElementById('fix-new-acc').value = this.options[this.selectedIndex].dataset.acc">${t}</select></div>
                <div><label class="block text-xs font-bold text-slate-400 mb-1">নতুন অ্যাকাউন্ট নং (৪ ডিজিট)</label><input id="fix-new-acc" class="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white outline-none focus:border-blue-500" placeholder="e.g. 0001"></div>
            </div>`,showCancelButton:!0,confirmButtonText:`পরিবর্তন করুন`,cancelButtonText:`বাতিল`,customClass:{popup:`!bg-slate-900 !text-white !rounded-3xl border border-slate-700`},preConfirm:()=>{let e=document.getElementById(`fix-cust-sel`).value,t=document.getElementById(`fix-new-acc`).value.trim();return!e||!t?H.default.showValidationMessage(`সবগুলো ঘর পূরণ করুন`):{id:e,newAcc:t}}});if(n){if(!await W(`অ্যাকাউন্ট নং পরিবর্তন`))return;try{await a.update(n.id,{accountNo:n.newAcc}),O(`ID_FIX`,`Admin`,n.id,``,{newAccountNo:n.newAcc}),H.default.fire(`সফল!`,`অ্যাকাউন্ট নাম্বার পরিবর্তন করা হয়েছে।`,`success`)}catch{H.default.fire(`Error`,`পরিবর্তন করা যায়নি।`,`error`)}}}async function _a(){if(window.AppState.currentUserRole!==`Admin`)return H.default.fire(`অ্যাক্সেস ডিনাইড!`,`শুধুমাত্র অ্যাডমিন জোন কাউন্টার সিঙ্ক করতে পারবেন।`,`error`);if(await W(`জোন কাউন্টার অটো-সিঙ্ক (Auto Reset)`))try{H.default.fire({title:`সিঙ্ক হচ্ছে...`,text:`সকল জোনের কাস্টমার সিরিয়াল ও কাউন্টার স্ক্যান করা হচ্ছে...`,allowOutsideClick:!1,didOpen:()=>H.default.showLoading(),customClass:{popup:`!bg-slate-900 !text-white !rounded-3xl border border-slate-700 font-bn`}});let e=await v.getAllZones(),t=await a.getAll();if(!e||e.length===0)return H.default.fire(`তথ্য পাওয়া যায়নি`,`কোনো জোন নিবন্ধিত নেই।`,`warning`);let n=[];for(let r of e){let e=r.name,i=t.filter(t=>(t.zone||``).trim()===e),a=0;i.forEach(e=>{let t=(e.accountNo||``).match(/\d+/);if(t){let e=parseInt(t[0],10);!isNaN(e)&&e>a&&(a=e)}}),await g.updateZoneCounter(e,a),n.push(`• <strong>${e}</strong>: সক্রিয় কাস্টমার ${i.length} জন <i class="fa-solid fa-arrow-right text-cyan-400 mx-1"></i> কাউন্টার সেট: <strong>${a}</strong> (পরবর্তী: ${a+1})`)}O(`AUTO_SYNC_COUNTERS`,`Admin`,`Counters`,`Zone Counters Auto Synced`),H.default.fire({title:`<i class="fa-solid fa-rotate text-emerald-400 mr-2"></i>জোন কাউন্টার সিঙ্ক সফল!`,html:`<div class="text-left space-y-2 font-bn p-3 bg-slate-950 rounded-2xl border border-slate-800 text-xs text-slate-300">
                    <p class="font-bold text-white mb-2">ডাটাবেসের বর্তমান সক্রিয় কাস্টমার সংখ্যা অনুযায়ী সিরিয়াল কাউন্টার আপডেট করা হয়েছে:</p>
                    ${n.join(`<br>`)}
                </div>`,icon:`success`,confirmButtonText:`ঠিক আছে`,customClass:{popup:`!bg-slate-900 !text-white !rounded-3xl border border-slate-700 font-bn`}}),window.loadCustomers&&window.loadCustomers()}catch(e){console.error(`autoSyncZoneCounters error:`,e),H.default.fire(`ত্রুটি!`,`কাউন্টার সিঙ্ক করার সময় সমস্যা হয়েছে।`,`error`)}}async function va(e=null){if(window.AppState.currentUserRole!==`Admin`)return H.default.fire(`অ্যাক্সেস ডিনাইড!`,`শুধুমাত্র অ্যাডমিন সিরিয়াল সাজাতে পারবেন।`,`error`);let t=await v.getAllZones();if(!t||t.length===0)return H.default.fire(`warning`,`কোনো জোন নেই!`);let n=e;if(!n){let e=`<option value="">-- জোন সিলেক্ট করুন --</option>`;t.forEach(t=>{e+=`<option value="${t.name}">${t.name}</option>`});let{value:r}=await H.default.fire({title:`সিরিয়াল অনুযায়ী অ্যাকাউন্ট পুনঃসাজানো`,html:`<div class="text-left space-y-3 font-bn p-2">
                    <p class="text-xs text-amber-400 font-bold bg-amber-500/10 p-3 rounded-xl border border-amber-500/20">
                        <i class="fa-solid fa-triangle-exclamation text-amber-400 mr-1.5"></i>সতর্কবার্তা: এটি সিলেক্ট করা জোনের সকল সক্রিয় কাস্টমারের অ্যাকাউন্ট নম্বর ১, ২, ৩... ক্রমানুসারে পুনরায় সেট করবে।
                    </p>
                    <div><label class="block text-xs font-bold text-slate-400 mb-1">জোন সিলেক্ট করুন</label><select id="reseq-zone-sel" class="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white outline-none focus:border-blue-500">${e}</select></div>
                </div>`,showCancelButton:!0,confirmButtonText:`পুনরায় সাজান`,cancelButtonText:`বাতিল`,customClass:{popup:`!bg-slate-900 !text-white !rounded-3xl border border-slate-700`},preConfirm:()=>document.getElementById(`reseq-zone-sel`).value||H.default.showValidationMessage(`জোন সিলেক্ট করুন`)});n=r}if(n&&await W(`কাস্টমার সিরিয়াল পুনঃসাজানো`))try{H.default.fire({title:`প্রসেস হচ্ছে...`,text:`কাস্টমারদের অ্যাকাউন্ট নম্বর ক্রমানুসারে আপডেট হচ্ছে...`,allowOutsideClick:!1,didOpen:()=>H.default.showLoading()});let e=await a.getAll(),r=t.find(e=>e.name===n),i=r&&r.code||``,o=e.filter(e=>(e.zone||``).trim()===n);o.sort((e,t)=>(e.accountNo||``).localeCompare(t.accountNo||``,void 0,{numeric:!0}));let s=0,c=[];for(let e=0;e<o.length;e++){let t=o[e],n=i+String(e+1).padStart(4,`0`);t.accountNo!==n&&(c.push({ref:a.getRef(t.id),newAccNo:n}),s++)}for(let e=0;e<c.length;e+=400){let t=m.batch();c.slice(e,e+400).forEach(e=>t.update(e.ref,{accountNo:e.newAccNo})),await t.commit()}await g.updateZoneCounter(n,o.length),O(`RESEQUENCE_ACC_NO`,`Admin`,n,`${s} updated`),H.default.fire(`সফল!`,`জোনের (${n}) ${o.length} জন কাস্টমারের আইডি ১ থেকে ${o.length} সিরিয়ালে সুন্দরভাবে সাজানো হয়েছে।`,`success`),window.loadCustomers&&window.loadCustomers()}catch(e){console.error(`resequenceZoneAccountNumbers error:`,e),H.default.fire(`ত্রুটি!`,`সিরিয়াল পুনঃসাজানোর সময় সমস্যা হয়েছে।`,`error`)}}async function ya(e){if(e)try{let t=(await a.getAll()).filter(t=>(t.zone||``).trim()===e),n=0;t.forEach(e=>{let t=(e.accountNo||``).match(/\d+/);if(t){let e=parseInt(t[0],10);!isNaN(e)&&e>n&&(n=e)}}),await g.updateZoneCounter(e,n)}catch(e){console.error(`syncSingleZoneCounter error:`,e)}}window.resequenceZoneModal=va;async function ba(){if(window.AppState?.currentUserRole!==`Admin`)return H.default.fire(`অ্যাক্সেস ডিনাইড!`,`শুধুমাত্র অ্যাডমিন এই কাজটি করতে পারবেন।`,`error`);let{value:e}=await H.default.fire({title:`<i class="fa-solid fa-broom text-amber-500 mr-2"></i>অডিট লগ ক্লিনআপ`,html:`
            <div class="text-left font-bn space-y-4">
                <p class="text-xs text-slate-400">ডাটাবেস স্টোরেজ বাঁচাতে পুরোনো অডিট লগ মুছে ফেলুন। আপনি কতদিন আগের লগ মুছতে চান তা নির্বাচন করুন:</p>
                <select id="cleanup-months" class="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white outline-none focus:border-amber-500">
                    <option value="1">১ মাসের আগের সব লগ</option>
                    <option value="3">৩ মাসের আগের সব লগ</option>
                    <option value="6" selected>৬ মাসের আগের সব লগ</option>
                    <option value="12">১ বছরের আগের সব লগ</option>
                </select>
            </div>
        `,showCancelButton:!0,confirmButtonText:`পরবর্তী ধাপ`,cancelButtonText:`বাতিল`,customClass:{popup:`!bg-slate-900 !text-white !rounded-3xl border border-slate-700 font-bn`},preConfirm:()=>parseInt(document.getElementById(`cleanup-months`).value)});if(e&&await W(`পুরোনো অডিট লগ মুছে ফেলা`)&&(await H.default.fire({title:`চূড়ান্ত ওয়ার্নিং`,html:`<span class="font-bn text-sm text-red-400">আপনি <b>${e} মাস</b> এর পুরোনো সমস্ত অডিট লগ স্থায়ীভাবে মুছে ফেলতে যাচ্ছেন! এটি আর ফেরানো সম্ভব নয়।</span>`,icon:`warning`,showCancelButton:!0,confirmButtonColor:`#ef4444`,confirmButtonText:`হ্যাঁ, মুছুন`,cancelButtonText:`বাতিল`,customClass:{popup:`!bg-slate-900 !text-white !rounded-3xl border border-slate-700 font-bn`}})).isConfirmed){H.default.fire({title:`লগ মুছে ফেলা হচ্ছে...`,html:`<div class="font-bn text-sm text-slate-300">দয়া করে ব্রাউজার বন্ধ করবেন না।</div>`,allowOutsideClick:!1,didOpen:()=>H.default.showLoading(),customClass:{popup:`!bg-slate-900 !text-white !rounded-3xl border border-slate-700`}});try{let t=new Date;t.setMonth(t.getMonth()-e);let n=firebase.firestore.Timestamp.fromDate(t),r=await m.collection(`audit_logs`).where(`timestamp`,`<`,n).get();if(r.empty)return H.default.fire(`তথ্য পাওয়া যায়নি`,`${e} মাসের পুরোনো কোনো অডিট লগ ডাটাবেসে নেই।`,`info`);let i=m.batch(),a=0,o=0;for(let e of r.docs)i.delete(e.ref),a++,o++,a>=400&&(await i.commit(),i=m.batch(),a=0);a>0&&await i.commit(),O(`CLEANUP`,`System`,`AuditLogs`,`Deleted ${o} logs older than ${e} months`),H.default.fire({title:`সফল!`,text:`সফলভাবে ${o} টি পুরোনো অডিট লগ ডাটাবেস থেকে মুছে ফেলা হয়েছে।`,icon:`success`,customClass:{popup:`!bg-slate-900 !text-white !rounded-3xl border border-slate-700 font-bn`}})}catch(e){console.error(`Audit log cleanup error:`,e),H.default.fire(`Error`,`লগ মুছতে সমস্যা হয়েছে: `+e.message,`error`)}}}window.downloadFullSystemBackup=ua,window.restoreSystemFromBackup=da;var xa=t({approveStaff:()=>Sa,changeStaffPin:()=>Ca,copyPortalLink:()=>Oa,createNewUser:()=>Da,deleteUserAccount:()=>Ta,revokeStaff:()=>wa,sharePortalWhatsApp:()=>ka,updateUserRole:()=>Ea});async function Sa(e,t,n=`Staff`){if(window.AppState.currentUserRole!==`Admin`||!await W(`ইউজার অনুমোদন (User Approval)`))return;let{value:r}=await H.default.fire({title:`<div class="flex items-center justify-center gap-2 text-white font-bn"><i class="fa-solid fa-user-check text-emerald-400"></i><span>অ্যাকাউন্ট অনুমোদন ও পিন সেট</span></div>`,html:`
            <div class="space-y-4 text-left font-bn mt-2">
                <div>
                    <label class="text-xs text-slate-400 font-bold block mb-1">ইমেইল অ্যাকাউন্ট</label>
                    <div class="p-2.5 rounded-xl bg-slate-950/80 border border-slate-700 text-xs font-mono text-emerald-400">${t}</div>
                </div>
                <div>
                    <label class="text-xs text-slate-400 font-bold block mb-1">ব্যবহারকারীর রোল (Role) নির্ধারণ করুন</label>
                    <select id="swal-user-role" class="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-xs text-white outline-none">
                        <option value="Boss" ${n===`Boss`?`selected`:``}>Boss / Executive (ভিউ-অনলি)</option>
                        <option value="Staff" ${n===`Boss`?``:`selected`}>Staff (দৈনন্দিন এন্ট্রি ও বিলিং)</option>
                        <option value="Admin">Admin (পূর্ণ ক্ষমতা)</option>
                    </select>
                </div>
                <div>
                    <label class="text-xs text-slate-400 font-bold block mb-1">৪-ডিজিট সিকিউরিটি পিন দিন</label>
                    <input id="swal-user-pin" type="text" maxlength="4" placeholder="${n===`Boss`?`5027`:`1234`}" value="${n===`Boss`?`5027`:`1234`}" class="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-center text-base font-mono font-bold tracking-widest text-white outline-none">
                </div>
            </div>
        `,focusConfirm:!1,showCancelButton:!0,confirmButtonText:`অনুমোদন দিন`,cancelButtonText:`বাতিল`,customClass:{popup:`!bg-slate-900 !text-white !rounded-3xl border border-slate-700 font-bn`,confirmButton:`m3-btn-primary !py-2.5`,cancelButton:`m3-btn-tonal !py-2.5`},preConfirm:()=>{let e=document.getElementById(`swal-user-role`).value,t=document.getElementById(`swal-user-pin`).value.trim();return!t||t.length!==4||isNaN(t)?(H.default.showValidationMessage(`আপনাকে অবশ্যই ৪-ডিজিটের সংখ্যার পিন দিতে হবে!`),!1):{role:e,pin:t}}});if(r)try{await u.update(e,{status:`active`,role:r.role,pin:r.pin}),O(`APPROVE`,`Admin`,e,t,{role:r.role,pinSet:!0}),H.default.fire({toast:!0,position:`top-end`,icon:`success`,title:`${t} সফলভাবে অনুমোদিত হয়েছে!`,showConfirmButton:!1,timer:3e3})}catch(e){console.error(e),H.default.fire(`Error`,`অনুমোদন ব্যর্থ হয়েছে`,`error`)}}async function Ca(e,t){if(window.AppState.currentUserRole!==`Admin`||!await W(`স্টাফ পিন পরিবর্তন (PIN Change)`))return;let{value:n}=await H.default.fire({title:`পিন পরিবর্তন`,input:`text`,inputLabel:`বর্তমান পিন: ${t} | নতুন 4-ডিজিট পিন দিন`,inputPlaceholder:`e.g. 5678`,inputAttributes:{autocomplete:`new-password`,autocapitalize:`off`,spellcheck:`false`},showCancelButton:!0,inputValidator:e=>{if(!e||e.length!==4||isNaN(e))return`আপনাকে অবশ্যই 4-ডিজিটের সংখ্যার পিন দিতে হবে!`}});if(n)try{await u.update(e,{pin:n}),O(`PIN_CHANGE`,`Admin`,e,``,{targetUser:e}),H.default.fire(`সফল!`,`পিন আপডেট করা হয়েছে।`,`success`)}catch{H.default.fire(`Error`,`ব্যর্থ হয়েছেন`,`error`)}}async function wa(e){if(window.AppState.currentUserRole===`Admin`&&await W(`স্টাফ ব্লক/বাতিল (Revoke Access)`)&&(await H.default.fire({title:`নিশ্চিত?`,text:`এই স্টাফ আর লগইন করতে পারবে না।`,icon:`warning`,showCancelButton:!0})).isConfirmed)try{await u.update(e,{status:`pending`,pin:``}),O(`REVOKE`,`Admin`,e,``,{action:`Block/Revoke`}),H.default.fire(`সফল!`,`অ্যাক্সেস বাতিল করা হয়েছে।`,`success`)}catch{H.default.fire(`Error`,`ব্যর্থ হয়েছেন`,`error`)}}async function Ta(e,t){if(window.AppState.currentUserRole!==`Admin`)return H.default.fire(`অ্যাক্সেস ডিনাইড!`,`শুধুমাত্র অ্যাডমিন অ্যাকাউন্ট মুছে ফেলতে পারবেন।`,`error`);if((await H.default.fire({title:`<i class="fa-solid fa-user-xmark text-red-400 mr-2"></i>অ্যাকাউন্ট মুছে ফেলা`,html:`<p style="color:#ef4444;font-size:14px;"><i class="fa-solid fa-triangle-exclamation mr-1.5"></i>আপনি কি নিশ্চিত যে <b>${t||e}</b> অ্যাকাউন্টটি ডাটাবেস থেকে মুছে ফেলতে চান?</p>`,icon:`warning`,showCancelButton:!0,confirmButtonText:`হ্যাঁ, ডিলেট করুন`,cancelButtonText:`বাতিল`,confirmButtonColor:`#dc2626`})).isConfirmed&&await W(`ইউজার অ্যাকাউন্ট মুছে ফেলা`))try{await u.delete(e),O(`DELETE`,`Admin`,e,t,{action:`User Deletion`}),H.default.fire({title:`অ্যাকাউন্ট মুছে ফেলা হয়েছে!`,text:`ইউজার (${t||e}) ডাটাবেস থেকে সফলভাবে ডিলেট করা হয়েছে।`,icon:`success`})}catch(e){console.error(`Failed to delete user account:`,e),H.default.fire({title:`Error!`,text:`অ্যাকাউন্টটি মুছতে সমস্যা হয়েছে: `+(e.message||e),icon:`error`})}}async function Ea(e){if(window.AppState.currentUserRole!==`Admin`||!await W(`ইউজার রোল পরিবর্তন (Role Change)`))return;let t=document.getElementById(`role-${e}`).value;try{await u.update(e,{role:t}),O(`ROLE_CHANGE`,`Admin`,e,``,{newRole:t}),H.default.fire(`সফল!`,`ইউজারের রোল আপডেট হয়েছে।`,`success`)}catch{H.default.fire(`Error`,`রোল আপডেট করতে ব্যর্থ হয়েছেন।`,`error`)}}async function Da(){if(window.AppState.currentUserRole!==`Admin`||!await W(`নতুন ইউজার অ্যাকাউন্ট তৈরি`))return;let{value:e}=await H.default.fire({title:`নতুন অ্যাকাউন্ট তৈরি করুন`,html:`
            <div class="flex flex-col gap-4 text-left font-bn mt-2">
                <div>
                    <label class="block text-xs font-bold text-slate-400 mb-1">ইমেইল এড্রেস</label>
                    <input id="new-user-email" type="email" class="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500" placeholder="example@email.com">
                </div>
                <div>
                    <label class="block text-xs font-bold text-slate-400 mb-1">পাসওয়ার্ড (কমপক্ষে ৬ ক্যারেক্টার)</label>
                    <input id="new-user-password" type="password" class="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500" placeholder="******">
                </div>
                <div>
                    <label class="block text-xs font-bold text-slate-400 mb-1">ইউজার রোল</label>
                    <select id="new-user-role" class="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500">
                        <option value="Staff">Staff (স্টাফ)</option>
                        <option value="Admin">Admin (অ্যাডমিন)</option>
                    </select>
                </div>
            </div>
        `,focusConfirm:!1,showCancelButton:!0,confirmButtonText:`অ্যাকাউন্ট তৈরি করুন`,cancelButtonText:`বাতিল`,preConfirm:()=>{let e=document.getElementById(`new-user-email`).value.trim(),t=document.getElementById(`new-user-password`).value,n=document.getElementById(`new-user-role`).value;return!e||!t?(H.default.showValidationMessage(`ইমেইল এবং পাসওয়ার্ড আবশ্যক!`),!1):t.length<6?(H.default.showValidationMessage(`পাসওয়ার্ড কমপক্ষে ৬ ক্যারেক্টার হতে হবে!`),!1):{email:e,password:t,role:n}}});if(e){H.default.fire({title:`অ্যাকাউন্ট তৈরি হচ্ছে...`,text:`অনুগ্রহ করে অপেক্ষা করুন`,allowOutsideClick:!1,didOpen:()=>{H.default.showLoading()}});let t=null;try{t=n.initializeApp(d,`UserCreationApp_`+Date.now());let r=(await t.auth().createUserWithEmailAndPassword(e.email,e.password)).user.uid;await u.getRef(r).set({email:e.email,role:e.role,status:`active`,createdAt:n.firestore.FieldValue.serverTimestamp()}),O(`CREATE`,`Admin`,r,e.email,{role:e.role}),H.default.fire({title:`সফল!`,text:`${e.email} অ্যাকাউন্টটি সফলভাবে ফায়ারবেসে তৈরি হয়েছে।`,icon:`success`})}catch(e){console.error(`Error creating user:`,e),H.default.fire({title:`Error!`,text:`অ্যাকাউন্ট তৈরি করতে সমস্যা হয়েছে: `+(e.message||e),icon:`error`})}finally{t&&t.delete().catch(e=>console.warn(`secondaryApp cleanup warning:`,e))}}}async function Oa(e){let t=`${window.location.origin}/?portal=${e}`;try{await navigator.clipboard.writeText(t),H.default.fire({toast:!0,position:`top-end`,icon:`success`,title:`${e===`boss`?`বস`:`স্টাফ`} পোর্টাল লিংক কপি হয়েছে!`,showConfirmButton:!1,timer:2500,background:`#0F172A`,color:`#F8FAFC`})}catch(e){console.error(e),H.default.fire(`কপি ব্যর্থ`,t,`info`)}}function ka(e){let t=`${window.location.origin}/?portal=${e}`,n=e===`boss`?`আসসালামু আলাইকুম স্যার, মা মোটরসের লাইভ হিসাব ও ড্যাশবোর্ড দেখার লিংক:\n${t}\n(আপনার সিকিউরিটি পিন: 5027)`:`আসসালামু আলাইকুম, মা মোটরস ERP স্টাফ পোর্টাল লিংক:\n${t}`,r=`https://api.whatsapp.com/send?text=${encodeURIComponent(n)}`;window.open(r,`_blank`)}var Aa=t({managePermissions:()=>ja});async function ja(e,t){if(window.AppState.currentUserRole===`Admin`&&await W(`পারমিশন পরিবর্তন (Manage Permissions)`))try{let n=(await u.getById(e)).permissions||{},{value:r}=await H.default.fire({title:`Permissions for ${t}`,html:`
                <div class="text-left space-y-3 text-sm mt-3 p-4 bg-slate-900 rounded-2xl border border-slate-800 max-h-[60vh] overflow-y-auto font-bn">
                    <div class="text-xs font-black text-blue-400 uppercase tracking-widest border-b border-slate-800 pb-1.5 mb-2"><i class="fa-solid fa-chart-pie mr-1.5"></i>ড্যাশবোর্ড ও রিপোর্ট পারমিশন:</div>

                    <label class="flex items-center gap-3 text-white cursor-pointer hover:bg-slate-800/50 p-1.5 rounded-lg transition-colors">
                        <input type="checkbox" id="perm-viewDashboard" class="w-5 h-5 rounded bg-slate-950 border-slate-700 text-blue-500 focus:ring-blue-500" ${n.viewDashboard===!1?``:`checked`}>
                        <span class="leading-tight">ড্যাশবোর্ড দেখার অনুমতি<br><span class="text-[11px] text-slate-400 font-bold">View Dashboard</span></span>
                    </label>
                    <label class="flex items-center gap-3 text-white cursor-pointer hover:bg-slate-800/50 p-1.5 rounded-lg transition-colors pl-6 border-l-2 border-blue-500/50">
                        <input type="checkbox" id="perm-viewDashboardFinancials" class="w-5 h-5 rounded bg-slate-950 border-slate-700 text-blue-400 focus:ring-blue-400" ${n.viewDashboardFinancials===!1?``:`checked`}>
                        <span class="leading-tight text-blue-300">ড্যাশবোর্ডে টাকার অংক ও মোট বকেয়া দেখার অনুমতি<br><span class="text-[11px] text-slate-400 font-bold">View Financial Stats</span></span>
                    </label>
                    <label class="flex items-center gap-3 text-white cursor-pointer hover:bg-slate-800/50 p-1.5 rounded-lg transition-colors pl-6 border-l-2 border-blue-500/50">
                        <input type="checkbox" id="perm-printExecutiveReport" class="w-5 h-5 rounded bg-slate-950 border-slate-700 text-blue-400 focus:ring-blue-400" ${n.printExecutiveReport===!1?``:`checked`}>
                        <span class="leading-tight text-blue-300">১-ক্লিক দৈনিক এক্সিকিউটিভ রিপোর্ট প্রিন্টের অনুমতি<br><span class="text-[11px] text-slate-400 font-bold">Print Executive Summary</span></span>
                    </label>

                    <div class="text-xs font-black text-amber-400 uppercase tracking-widest border-b border-slate-800 pb-1.5 mt-4 mb-2"><i class="fa-solid fa-book mr-1.5"></i>খতিয়ান ও লেনদেন (Ledger & Icons):</div>

                    <label class="flex items-center gap-3 text-white cursor-pointer hover:bg-slate-800/50 p-1.5 rounded-lg transition-colors">
                        <input type="checkbox" id="perm-viewLedger" class="w-5 h-5 rounded bg-slate-950 border-slate-700 text-blue-500 focus:ring-blue-500" ${n.viewLedger===!1?``:`checked`}>
                        <span class="leading-tight">খতিয়ান পেজ দেখার অনুমতি<br><span class="text-[11px] text-slate-400 font-bold">View Ledger Page</span></span>
                    </label>
                    <label class="flex items-center gap-3 text-white cursor-pointer hover:bg-slate-800/50 p-1.5 rounded-lg transition-colors pl-6 border-l-2 border-amber-500/50">
                        <input type="checkbox" id="perm-editLedger" class="w-5 h-5 rounded bg-slate-950 border-slate-700 text-amber-500 focus:ring-amber-500" ${n.editLedger!==!1&&n.manageLedger!==!1?`checked`:``}>
                        <span class="leading-tight text-amber-300"><i class="fa-solid fa-pen-to-square mr-1 text-amber-400"></i>খতিয়ান এডিট আইকন দেখানো ও সংশোধনের অনুমতি<br><span class="text-[11px] text-slate-400 font-bold">Show Edit Icon & Edit Transactions</span></span>
                    </label>
                    <label class="flex items-center gap-3 text-white cursor-pointer hover:bg-slate-800/50 p-1.5 rounded-lg transition-colors pl-6 border-l-2 border-red-500/50">
                        <input type="checkbox" id="perm-deleteLedger" class="w-5 h-5 rounded bg-slate-950 border-slate-700 text-red-500 focus:ring-red-500" ${n.deleteLedger?`checked`:``}>
                        <span class="leading-tight text-red-300"><i class="fa-solid fa-trash-can mr-1 text-red-400"></i>খতিয়ান ডিলিট আইকন দেখানো ও লেনদেন ডিলেটের অনুমতি<br><span class="text-[11px] text-slate-400 font-bold">Show Delete Icon & Delete Transactions</span></span>
                    </label>
                    <label class="flex items-center gap-3 text-white cursor-pointer hover:bg-slate-800/50 p-1.5 rounded-lg transition-colors pl-6 border-l-2 border-emerald-500/50">
                        <input type="checkbox" id="perm-exportLedger" class="w-5 h-5 rounded bg-slate-950 border-slate-700 text-emerald-500 focus:ring-emerald-500" ${n.exportLedger===!1?``:`checked`}>
                        <span class="leading-tight text-emerald-300"><i class="fa-solid fa-file-excel mr-1 text-emerald-400"></i>খতিয়ান এক্সেল ডাউনলোড করার অনুমতি<br><span class="text-[11px] text-slate-400 font-bold">Export Ledger Excel</span></span>
                    </label>

                    <div class="text-xs font-black text-purple-400 uppercase tracking-widest border-b border-slate-800 pb-1.5 mt-4 mb-2"><i class="fa-solid fa-bolt mr-1.5"></i>দ্রুত এন্ট্রি ও ইনভয়েস (Bulk & Invoices):</div>

                    <label class="flex items-center gap-3 text-white cursor-pointer hover:bg-slate-800/50 p-1.5 rounded-lg transition-colors">
                        <input type="checkbox" id="perm-viewBulkEntry" class="w-5 h-5 rounded bg-slate-950 border-slate-700 text-blue-500 focus:ring-blue-500" ${n.viewBulkEntry===!1?``:`checked`}>
                        <span class="leading-tight">ফাস্ট এন্ট্রি (Bulk Entry) ব্যবহারের অনুমতি<br><span class="text-[11px] text-slate-400 font-bold">View Bulk Entry</span></span>
                    </label>
                    <label class="flex items-center gap-3 text-white cursor-pointer hover:bg-slate-800/50 p-1.5 rounded-lg transition-colors">
                        <input type="checkbox" id="perm-viewInvoice" class="w-5 h-5 rounded bg-slate-950 border-slate-700 text-blue-500 focus:ring-blue-500" ${n.viewInvoice===!1?``:`checked`}>
                        <span class="leading-tight">ইনভয়েস/ভাউচার তৈরি ও প্রিন্টের অনুমতি<br><span class="text-[11px] text-slate-400 font-bold">Create Invoice & Voucher</span></span>
                    </label>
                    <label class="flex items-center gap-3 text-white cursor-pointer hover:bg-slate-800/50 p-1.5 rounded-lg transition-colors pl-6 border-l-2 border-purple-500/50">
                        <input type="checkbox" id="perm-allowInvoiceDiscount" class="w-5 h-5 rounded bg-slate-950 border-slate-700 text-purple-400 focus:ring-purple-400" ${n.allowInvoiceDiscount===!1?``:`checked`}>
                        <span class="leading-tight text-purple-300"><i class="fa-solid fa-tag mr-1 text-purple-400"></i>ইনভয়েসে ডিসকাউন্ট / ছাড় দেওয়ার অনুমতি<br><span class="text-[11px] text-slate-400 font-bold">Allow Invoice Discounts</span></span>
                    </label>

                    <div class="text-xs font-black text-emerald-400 uppercase tracking-widest border-b border-slate-800 pb-1.5 mt-4 mb-2"><i class="fa-solid fa-wallet mr-1.5"></i>দৈনিক খরচ (Daily Expenses):</div>

                    <label class="flex items-center gap-3 text-white cursor-pointer hover:bg-slate-800/50 p-1.5 rounded-lg transition-colors">
                        <input type="checkbox" id="perm-viewExpenses" class="w-5 h-5 rounded bg-slate-950 border-slate-700 text-blue-500 focus:ring-blue-500" ${n.viewExpenses===!1?``:`checked`}>
                        <span class="leading-tight">দৈনিক খরচ দেখার অনুমতি<br><span class="text-[11px] text-slate-400 font-bold">View Expenses</span></span>
                    </label>
                    <label class="flex items-center gap-3 text-white cursor-pointer hover:bg-slate-800/50 p-1.5 rounded-lg transition-colors pl-6 border-l-2 border-amber-500/50">
                        <input type="checkbox" id="perm-editExpenses" class="w-5 h-5 rounded bg-slate-950 border-slate-700 text-amber-500 focus:ring-amber-500" ${n.editExpenses!==!1&&n.manageExpenses!==!1?`checked`:``}>
                        <span class="leading-tight text-amber-300"><i class="fa-solid fa-pen-to-square mr-1 text-amber-400"></i>খরচ এডিট আইকন দেখানো ও সংশোধনের অনুমতি<br><span class="text-[11px] text-slate-400 font-bold">Show Edit Icon & Edit Expenses</span></span>
                    </label>
                    <label class="flex items-center gap-3 text-white cursor-pointer hover:bg-slate-800/50 p-1.5 rounded-lg transition-colors pl-6 border-l-2 border-red-500/50">
                        <input type="checkbox" id="perm-deleteExpenses" class="w-5 h-5 rounded bg-slate-950 border-slate-700 text-red-500 focus:ring-red-500" ${n.deleteExpenses?`checked`:``}>
                        <span class="leading-tight text-red-300"><i class="fa-solid fa-trash-can mr-1 text-red-400"></i>খরচ ডিলিট আইকন দেখানো ও খরচ ডিলেটের অনুমতি<br><span class="text-[11px] text-slate-400 font-bold">Show Delete Icon & Delete Expenses</span></span>
                    </label>

                    <div class="text-xs font-black text-cyan-400 uppercase tracking-widest border-b border-slate-800 pb-1.5 mt-4 mb-2"><i class="fa-solid fa-users mr-1.5"></i>কাস্টমার ডাটাবেস (Customers):</div>

                    <label class="flex items-center gap-3 text-white cursor-pointer hover:bg-slate-800/50 p-1.5 rounded-lg transition-colors">
                        <input type="checkbox" id="perm-viewCustomers" class="w-5 h-5 rounded bg-slate-950 border-slate-700 text-blue-500 focus:ring-blue-500" ${n.viewCustomers===!1?``:`checked`}>
                        <span class="leading-tight">কাস্টমার লিস্ট দেখার অনুমতি<br><span class="text-[11px] text-slate-400 font-bold">View Customers</span></span>
                    </label>
                    <label class="flex items-center gap-3 text-white cursor-pointer hover:bg-slate-800/50 p-1.5 rounded-lg transition-colors pl-6 border-l-2 border-amber-500/50">
                        <input type="checkbox" id="perm-editCustomers" class="w-5 h-5 rounded bg-slate-950 border-slate-700 text-amber-500 focus:ring-amber-500" ${n.editCustomers!==!1&&n.manageCustomers!==!1?`checked`:``}>
                        <span class="leading-tight text-amber-300"><i class="fa-solid fa-pen-to-square mr-1 text-amber-400"></i>কাস্টমার এডিট আইকন দেখানো ও এডিটের অনুমতি<br><span class="text-[11px] text-slate-400 font-bold">Show Edit Icon & Edit Customer Info</span></span>
                    </label>
                    <label class="flex items-center gap-3 text-white cursor-pointer hover:bg-slate-800/50 p-1.5 rounded-lg transition-colors pl-6 border-l-2 border-red-500/50">
                        <input type="checkbox" id="perm-deleteCustomers" class="w-5 h-5 rounded bg-slate-950 border-slate-700 text-red-500 focus:ring-red-500" ${n.deleteCustomers?`checked`:``}>
                        <span class="leading-tight text-red-300"><i class="fa-solid fa-trash-can mr-1 text-red-400"></i>কাস্টমার ডিলিট আইকন দেখানো ও একাউন্ট ডিলেটের অনুমতি<br><span class="text-[11px] text-slate-400 font-bold">Show Delete Icon & Delete Customer</span></span>
                    </label>

                    <div class="text-xs font-black text-pink-400 uppercase tracking-widest border-b border-slate-800 pb-1.5 mt-4 mb-2"><i class="fa-solid fa-file-invoice mr-1.5"></i>স্টেটমেন্ট, SMS ও ডিরেক্টরি:</div>

                    <label class="flex items-center gap-3 text-white cursor-pointer hover:bg-slate-800/50 p-1.5 rounded-lg transition-colors">
                        <input type="checkbox" id="perm-viewStatement" class="w-5 h-5 rounded bg-slate-950 border-slate-700 text-blue-500 focus:ring-blue-500" ${n.viewStatement===!1?``:`checked`}>
                        <span class="leading-tight">স্টেটমেন্ট/রিপোর্ট দেখার অনুমতি<br><span class="text-[11px] text-slate-400 font-bold">View Statement</span></span>
                    </label>
                    <label class="flex items-center gap-3 text-white cursor-pointer hover:bg-slate-800/50 p-1.5 rounded-lg transition-colors">
                        <input type="checkbox" id="perm-sendSMS" class="w-5 h-5 rounded bg-slate-950 border-slate-700 text-purple-500 focus:ring-purple-500" ${n.sendSMS===!1?``:`checked`}>
                        <span class="leading-tight text-purple-300">কাস্টমারকে SMS পাঠানোর অনুমতি<br><span class="text-[11px] text-slate-400 font-bold">Send SMS Reminders</span></span>
                    </label>
                </div>
            `,focusConfirm:!1,showCancelButton:!0,confirmButtonText:`পারমিশন সেভ করুন`,cancelButtonText:`বাতিল`,customClass:{popup:`!bg-slate-900 !text-white !rounded-3xl border border-slate-700/80`,title:`!text-white`,confirmButton:`m3-btn-primary !px-6`,cancelButton:`m3-btn-tonal !px-6`},preConfirm:()=>{let e=document.getElementById(`perm-editLedger`).checked,t=document.getElementById(`perm-deleteLedger`).checked,n=document.getElementById(`perm-editExpenses`).checked,r=document.getElementById(`perm-deleteExpenses`).checked,i=document.getElementById(`perm-editCustomers`).checked,a=document.getElementById(`perm-deleteCustomers`).checked;return{viewDashboard:document.getElementById(`perm-viewDashboard`).checked,viewDashboardFinancials:document.getElementById(`perm-viewDashboardFinancials`).checked,printExecutiveReport:document.getElementById(`perm-printExecutiveReport`).checked,viewLedger:document.getElementById(`perm-viewLedger`).checked,manageLedger:e||t,editLedger:e,deleteLedger:t,exportLedger:document.getElementById(`perm-exportLedger`).checked,viewBulkEntry:document.getElementById(`perm-viewBulkEntry`).checked,viewInvoice:document.getElementById(`perm-viewInvoice`).checked,allowInvoiceDiscount:document.getElementById(`perm-allowInvoiceDiscount`).checked,viewExpenses:document.getElementById(`perm-viewExpenses`).checked,manageExpenses:n||r,editExpenses:n,deleteExpenses:r,viewCustomers:document.getElementById(`perm-viewCustomers`).checked,manageCustomers:i||a,editCustomers:i,deleteCustomers:a,viewStatement:document.getElementById(`perm-viewStatement`).checked,sendSMS:document.getElementById(`perm-sendSMS`).checked}}});r&&(await u.update(e,{permissions:r}),O(`PERMISSION_CHANGE`,`Admin`,e,t,{permissions:r}),H.default.fire({title:`সফল!`,text:`পারমিশন সফলভাবে সেভ করা হয়েছে।`,icon:`success`,customClass:{popup:`!bg-slate-900 !text-white !rounded-3xl border border-slate-700/80`}}))}catch(e){console.error(`Failed to update permissions:`,e),H.default.fire(`Error`,`Failed to update permissions.`,`error`)}}var Ma=t({deactivateBankingItem:()=>Ha,editBankingItem:()=>Va,reactivateBankingItem:()=>Ua,showBankingSystemManager:()=>Ia}),Na=`bank`,Pa=[],Fa=[];async function Ia(){H.default.fire({title:`ব্যাংকিং ও ক্যাশ ম্যানেজমেন্ট`,html:`
            <div class="text-left space-y-4 font-bn p-2 min-h-[300px]">
                <div class="flex gap-2 border-b border-slate-700/50 pb-3">
                    <button id="tab-bank" class="px-4 py-2 bg-blue-600 text-white rounded-lg text-xs font-bold transition-all shadow-md">ব্যাংক অ্যাকাউন্টস</button>
                    <button id="tab-cash" class="px-4 py-2 bg-slate-800 text-slate-300 hover:bg-slate-700 rounded-lg text-xs font-bold transition-all">ক্যাশ রিসিভার</button>
                </div>
                
                <div class="flex justify-between items-center mb-2">
                    <h3 id="banking-tab-title" class="text-sm font-black text-slate-200">সকল ব্যাংক অ্যাকাউন্ট</h3>
                    <button id="btn-add-banking-item" class="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-lg transition-all"><i class="fa-solid fa-plus mr-1"></i>নতুন যুক্ত করুন</button>
                </div>

                <div id="banking-list-container" class="space-y-2 max-h-[350px] overflow-y-auto pr-2 custom-scrollbar">
                    <div class="text-center py-6 text-slate-400 text-xs"><i class="fa-solid fa-spinner fa-spin mr-2"></i>লোড হচ্ছে...</div>
                </div>
            </div>
        `,showConfirmButton:!1,showCloseButton:!0,width:`600px`,customClass:{popup:`!bg-slate-900 !text-white !rounded-3xl border border-slate-700`},didOpen:()=>{document.getElementById(`tab-bank`).addEventListener(`click`,()=>La(`bank`)),document.getElementById(`tab-cash`).addEventListener(`click`,()=>La(`cash`)),document.getElementById(`btn-add-banking-item`).addEventListener(`click`,Ba),Ra()}})}function La(e){Na=e;let t=document.getElementById(`tab-bank`),n=document.getElementById(`tab-cash`),r=document.getElementById(`banking-tab-title`);e===`bank`?(t.className=`px-4 py-2 bg-blue-600 text-white rounded-lg text-xs font-bold transition-all shadow-md`,n.className=`px-4 py-2 bg-slate-800 text-slate-300 hover:bg-slate-700 rounded-lg text-xs font-bold transition-all`,r.innerText=`সকল ব্যাংক অ্যাকাউন্ট`):(n.className=`px-4 py-2 bg-emerald-600 text-white rounded-lg text-xs font-bold transition-all shadow-md`,t.className=`px-4 py-2 bg-slate-800 text-slate-300 hover:bg-slate-700 rounded-lg text-xs font-bold transition-all`,r.innerText=`সকল ক্যাশ রিসিভার`),za()}async function Ra(){try{let[e,t]=await Promise.all([f.getAllBanks(),l.getAllCollectors()]);Pa=e,Fa=t,za(),Kn(),qn()}catch(e){console.error(e),document.getElementById(`banking-list-container`).innerHTML=`<div class="text-red-400 text-xs text-center">ডাটা লোড করতে সমস্যা হয়েছে।</div>`}}function za(){let e=document.getElementById(`banking-list-container`);if(!e)return;let t=Na===`bank`?Pa:Fa,n=Na===`cash`;if(t.length===0){e.innerHTML=`<div class="text-slate-500 text-xs text-center py-6">কোনো ডাটা পাওয়া যায়নি।</div>`;return}let r=``;t.forEach(e=>{let t=e.status!==`inactive`,i=t?`<span class="bg-emerald-500/10 text-emerald-400 text-[9px] px-1.5 py-0.5 rounded font-bold uppercase border border-emerald-500/20">Active</span>`:`<span class="bg-red-500/10 text-red-400 text-[9px] px-1.5 py-0.5 rounded font-bold uppercase border border-red-500/20">Inactive</span>`;r+=`
            <div class="flex items-center justify-between p-3 bg-slate-950/50 border border-slate-800/80 rounded-xl hover:bg-slate-800/40 transition-colors group">
                <div class="flex items-center gap-3">
                    <div class="w-8 h-8 rounded-lg bg-slate-900 border border-slate-700 flex items-center justify-center shrink-0">
                        ${n?`<i class="fa-solid fa-user-tie text-emerald-400"></i>`:`<i class="fa-solid fa-building-columns text-blue-400"></i>`}
                    </div>
                    <div>
                        <div class="text-sm font-bold text-slate-200 flex items-center gap-2">${e.name} ${i}</div>
                        <div class="text-[10px] text-slate-500">তৈরি: ${e.createdAt?new Date(e.createdAt.toMillis?e.createdAt.toMillis():e.createdAt).toLocaleDateString(`bn-BD`):`-`}</div>
                    </div>
                </div>
                <div class="flex items-center gap-1.5 opacity-60 group-hover:opacity-100 transition-opacity">
                    <button class="w-7 h-7 rounded-md bg-slate-800 hover:bg-amber-600 text-slate-400 hover:text-white transition-colors" onclick="window.appAdmin.editBankingItem('${e.id}', '${e.name}', '${Na}')" title="এডিট বা রিনেম"><i class="fa-solid fa-pen text-[10px]"></i></button>
                    ${t?`<button class="w-7 h-7 rounded-md bg-slate-800 hover:bg-red-600 text-slate-400 hover:text-white transition-colors" onclick="window.appAdmin.deactivateBankingItem('${e.id}', '${e.name}', '${Na}')" title="নিষ্ক্রিয়/ডিলেট করুন"><i class="fa-solid fa-trash-can text-[10px]"></i></button>`:`<button class="w-7 h-7 rounded-md bg-slate-800 hover:bg-emerald-600 text-slate-400 hover:text-white transition-colors" onclick="window.appAdmin.reactivateBankingItem('${e.id}', '${e.name}', '${Na}')" title="পুনরায় চালু করুন"><i class="fa-solid fa-rotate-left text-[10px]"></i></button>`}
                </div>
            </div>
        `}),e.innerHTML=r}async function Ba(){let e=Na===`cash`,t=e?`ক্যাশ রিসিভার`:`ব্যাংক অ্যাকাউন্ট`,{value:n}=await H.default.fire({title:`নতুন ${t} যোগ করুন`,input:`text`,inputPlaceholder:`${t} এর নাম...`,showCancelButton:!0,confirmButtonText:`যোগ করুন`,cancelButtonText:`বাতিল`,customClass:{popup:`!bg-slate-900 !text-white !rounded-3xl border border-slate-700`,input:`!bg-slate-950 !text-white !border-slate-700 focus:!border-emerald-500`},inputValidator:e=>{if(!e||!e.trim())return`নাম দেওয়া আবশ্যক!`}});if(n){if(!await W(`${t} যোগ করা (Master PIN)`))return;H.default.fire({title:`যোগ করা হচ্ছে...`,allowOutsideClick:!1,didOpen:()=>H.default.showLoading()});try{let t={name:n.trim(),status:`active`};e?await l.add(t):await f.add(t),O(`ADD_BANKING`,`Admin`,`BankingSystem`,`Added new ${Na}: ${n.trim()}`),await Ra(),H.default.fire({title:`সফল!`,text:`${n} সফলভাবে যোগ করা হয়েছে।`,icon:`success`,customClass:{popup:`!bg-slate-900 !text-white !rounded-3xl border border-slate-700`}})}catch{H.default.fire(`Error`,`যোগ করতে সমস্যা হয়েছে।`,`error`)}}}async function Va(e,t,r){let i=r===`cash`,a=i?`ক্যাশ রিসিভার`:`ব্যাংক অ্যাকাউন্ট`,{value:s}=await H.default.fire({title:`${a} আপডেট (Global Rename)`,html:`
            <div class="text-left font-bn space-y-4">
                <div class="bg-amber-500/10 border border-amber-500/30 p-3 rounded-xl text-amber-200 text-xs">
                    <i class="fa-solid fa-triangle-exclamation mr-1.5"></i> <strong>সতর্কতা:</strong> আপনি যদি নাম পরিবর্তন করেন, তবে সিস্টেম আগের সবগুলো ট্রানজাকশন স্ক্যান করে যেখানে <strong>"${t}"</strong> ছিল, সব অটোমেটিক আপডেট করে নতুন নাম বসিয়ে দেবে। এতে কয়েক সেকেন্ড সময় লাগতে পারে।
                </div>
                <div>
                    <label class="block text-xs font-bold text-slate-400 mb-1">নতুন নাম লিখুন:</label>
                    <input id="rename-new-name" class="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white outline-none focus:border-amber-500" value="${t}">
                </div>
            </div>
        `,showCancelButton:!0,confirmButtonText:`আপডেট করুন`,cancelButtonText:`বাতিল`,customClass:{popup:`!bg-slate-900 !text-white !rounded-3xl border border-slate-700`},preConfirm:()=>{let e=document.getElementById(`rename-new-name`).value.trim();return e?e===t?H.default.showValidationMessage(`নাম পরিবর্তন করা হয়নি`):e:H.default.showValidationMessage(`নাম দেওয়া আবশ্যক`)}});if(s){if(!await W(`${a} রিনেম (Master PIN)`,`editBank`))return;H.default.fire({title:`গ্লোবাল রিনেম চলছে...`,html:`পুরনো ট্রানজাকশন স্ক্যান ও আপডেট করা হচ্ছে। দয়া করে অপেক্ষা করুন...`,allowOutsideClick:!1,didOpen:()=>H.default.showLoading()});try{i?await l.update(e,{name:s}):await f.update(e,{name:s});let r=0,c=i?`Cash`:`Bank`,u=await o.collection.where(`receivedType`,`==`,c).where(`receivedFrom`,`==`,t).get(),d=[];u.forEach(e=>d.push(e.ref));for(let e=0;e<d.length;e+=400){let t=m.batch();d.slice(e,e+400).forEach(e=>{t.update(e,{receivedFrom:s,updatedAt:n.firestore.FieldValue.serverTimestamp()}),r++}),await t.commit()}O(`GLOBAL_RENAME`,`Admin`,`BankingSystem`,`Renamed ${a} from ${t} to ${s}. Updated ${r} txns.`),await Ra(),H.default.fire({title:`সফল!`,html:`${t} পরিবর্তন করে <strong>${s}</strong> করা হয়েছে。<br><span class="text-xs text-amber-500">মোট ${r} টি ট্রানজাকশন অটোমেটিক আপডেট হয়েছে।</span>`,icon:`success`,customClass:{popup:`!bg-slate-900 !text-white !rounded-3xl border border-slate-700`}})}catch(e){console.error(e),H.default.fire(`ত্রুটি`,`আপডেট করতে সমস্যা হয়েছে।`,`error`)}}}async function Ha(e,t,n){let r=n===`cash`,i=r?`ক্যাশ রিসিভার`:`ব্যাংক অ্যাকাউন্ট`;if(await W(`${i} ডিলেট/নিষ্ক্রিয় (Master PIN)`,`deleteBank`)&&(await H.default.fire({title:`নিশ্চিত করুন`,html:`<div class="font-bn">আপনি কি <strong>${t}</strong> নিষ্ক্রিয় (Archive) করতে চান?<br><span class="text-xs text-slate-400 mt-2 block">এটি করলে নতুন এন্ট্রির ড্রপডাউনে আর এই নাম দেখাবে না, তবে আগের রিপোর্টগুলো ঠিক থাকবে।</span></div>`,icon:`warning`,showCancelButton:!0,confirmButtonColor:`#ef4444`,confirmButtonText:`হ্যাঁ, নিষ্ক্রিয় করুন`,cancelButtonText:`বাতিল`,customClass:{popup:`!bg-slate-900 !text-white !rounded-3xl border border-slate-700`}})).isConfirmed){H.default.fire({title:`নিষ্ক্রিয় করা হচ্ছে...`,allowOutsideClick:!1,didOpen:()=>H.default.showLoading()});try{r?await l.update(e,{status:`inactive`}):await f.update(e,{status:`inactive`}),O(`DEACTIVATE_BANKING`,`Admin`,`BankingSystem`,`Deactivated ${i}: ${t}`),await Ra(),H.default.fire({title:`সফল!`,text:`সফলভাবে নিষ্ক্রিয় করা হয়েছে।`,icon:`success`,customClass:{popup:`!bg-slate-900 !text-white !rounded-3xl border border-slate-700`}})}catch{H.default.fire(`ত্রুটি`,`নিষ্ক্রিয় করতে সমস্যা হয়েছে।`,`error`)}}}async function Ua(e,t,n){let r=n===`cash`,i=r?`ক্যাশ রিসিভার`:`ব্যাংক অ্যাকাউন্ট`;if(await W(`${i} পুনরায় চালু (Master PIN)`)){H.default.fire({title:`চালু করা হচ্ছে...`,allowOutsideClick:!1,didOpen:()=>H.default.showLoading()});try{r?await l.update(e,{status:`active`}):await f.update(e,{status:`active`}),O(`REACTIVATE_BANKING`,`Admin`,`BankingSystem`,`Reactivated ${i}: ${t}`),await Ra(),H.default.fire({title:`সফল!`,text:`সফলভাবে চালু করা হয়েছে।`,icon:`success`,customClass:{popup:`!bg-slate-900 !text-white !rounded-3xl border border-slate-700`}})}catch{H.default.fire(`ত্রুটি`,`চালু করতে সমস্যা হয়েছে।`,`error`)}}}function Wa(e){if(window.AppState.currentUserRole!==`Admin`){e.innerHTML=`<div class="m3-card text-center font-bn"><h2 class="text-xl font-bold text-red-500">অ্যাক্সেস ডিনাইড! শুধুমাত্র অ্যাডমিন এই পেজ দেখতে পারবেন।</h2></div>`;return}e.innerHTML=`
        <div class="flex flex-col gap-5 font-bn">
            <!-- Admin Page Header -->
            <div class="flex flex-col md:flex-row md:items-center justify-between gap-3 px-1">
                <div>
                    <h2 class="text-xl md:text-2xl font-black flex items-center gap-3 tracking-tight text-white">
                        <div class="w-10 h-10 rounded-2xl bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/30">
                            <i class="fa-solid fa-shield-halved text-white text-sm"></i>
                        </div>
                        অ্যাডমিন কন্ট্রোল সেন্টার
                    </h2>
                    <p class="text-slate-400 text-xs mt-1 ml-[52px]">স্টাফ ম্যানেজমেন্ট, সিস্টেম টুলস ও ডাটা ব্যাকআপ</p>
                </div>
            </div>

            <!-- KPI Stats Hero Bar -->
            <div class="grid grid-cols-2 md:grid-cols-4 gap-3" id="admin-stats-bar">
                <div class="relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-800/80 to-slate-900/80 border border-slate-700/50 p-4 group hover:border-indigo-500/40 transition-all">
                    <div class="flex items-center gap-3">
                        <div class="w-10 h-10 rounded-xl bg-indigo-500/15 flex items-center justify-center text-indigo-400"><i class="fa-solid fa-users text-base"></i></div>
                        <div><div class="text-lg md:text-xl font-black text-white" id="stat-total-users">-</div><div class="text-[10px] text-slate-400 font-bold uppercase tracking-wider">মোট ইউজার</div></div>
                    </div>
                </div>
                <div class="relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-800/80 to-slate-900/80 border border-slate-700/50 p-4 group hover:border-emerald-500/40 transition-all">
                    <div class="flex items-center gap-3">
                        <div class="w-10 h-10 rounded-xl bg-emerald-500/15 flex items-center justify-center text-emerald-400"><i class="fa-solid fa-circle-check text-base"></i></div>
                        <div><div class="text-lg md:text-xl font-black text-emerald-400" id="stat-active-users">-</div><div class="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Active</div></div>
                    </div>
                </div>
                <div class="relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-800/80 to-slate-900/80 border border-slate-700/50 p-4 group hover:border-amber-500/40 transition-all">
                    <div class="flex items-center gap-3">
                        <div class="w-10 h-10 rounded-xl bg-amber-500/15 flex items-center justify-center text-amber-400"><i class="fa-solid fa-user-clock text-base"></i></div>
                        <div><div class="text-lg md:text-xl font-black text-amber-400" id="stat-pending-users">-</div><div class="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Pending</div></div>
                    </div>
                </div>
                <div class="relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-800/80 to-slate-900/80 border border-slate-700/50 p-4 group hover:border-red-500/40 transition-all">
                    <div class="flex items-center gap-3">
                        <div class="w-10 h-10 rounded-xl bg-red-500/15 flex items-center justify-center text-red-400"><i class="fa-solid fa-user-slash text-base"></i></div>
                        <div><div class="text-lg md:text-xl font-black text-red-400" id="stat-blocked-users">-</div><div class="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Blocked</div></div>
                    </div>
                </div>
            </div>

            <!-- Portal Links & Access Sharing Section -->
            <div class="rounded-2xl bg-slate-900/50 border border-slate-800/70 overflow-hidden">
                <div class="p-4 md:p-5 bg-gradient-to-r from-amber-950/40 via-blue-950/30 to-transparent border-b border-slate-800/70">
                    <h3 class="font-black flex items-center gap-2.5 text-white text-sm md:text-base">
                        <i class="fa-solid fa-link text-amber-400"></i> স্মার্ট পোর্টাল লিংক ও অ্যাক্সেস কন্ট্রোল
                    </h3>
                    <p class="text-[11px] text-slate-400 mt-1 ml-7">বস ও স্টাফদের জন্য আলাদা আলাদা লিংক শেয়ার ও অ্যাক্সেস অনুমোদন করার সহজ প্যানেল।</p>
                </div>
                <div class="p-3 md:p-4 grid grid-cols-1 md:grid-cols-2 gap-3">
                    <!-- Boss Portal Link Card -->
                    <div class="rounded-xl bg-slate-950/80 border border-amber-500/30 p-3.5 flex flex-col justify-between gap-3 shadow-lg shadow-amber-500/5">
                        <div>
                            <div class="flex items-center justify-between mb-1.5">
                                <span class="text-xs font-black text-amber-400 uppercase tracking-wider flex items-center gap-1.5"><i class="fa-solid fa-crown text-amber-400"></i>বস পোর্টাল লিংক (Boss Access)</span>
                                <span class="text-[9.5px] bg-amber-500/10 text-amber-400 border border-amber-500/20 px-2 py-0.5 rounded-full font-bold">ভিউ-অনলি মোড</span>
                            </div>
                            <div class="p-2 rounded-lg bg-slate-900 border border-slate-800 text-[11px] font-mono text-slate-300 select-all break-all">
                                https://maa-motors-erp.web.app/?portal=boss
                            </div>
                        </div>
                        <div class="flex items-center gap-2 pt-2 border-t border-slate-800/80">
                            <button class="flex-1 h-8 rounded-lg bg-amber-500/10 border border-amber-500/30 hover:bg-amber-500/20 text-amber-400 text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer active:scale-95" onclick="appAdmin.copyPortalLink('boss')">
                                <i class="fa-solid fa-copy"></i><span>লিংক কপি করুন</span>
                            </button>
                            <button class="h-8 px-3 rounded-lg bg-emerald-500/10 border border-emerald-500/30 hover:bg-emerald-500/20 text-emerald-400 text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer active:scale-95" onclick="appAdmin.sharePortalWhatsApp('boss')" title="হোয়াটসঅ্যাপে পাঠান">
                                <i class="fa-brands fa-whatsapp text-sm"></i><span>শেয়ার</span>
                            </button>
                        </div>
                    </div>

                    <!-- Staff Portal Link Card -->
                    <div class="rounded-xl bg-slate-950/80 border border-blue-500/30 p-3.5 flex flex-col justify-between gap-3 shadow-lg shadow-blue-500/5">
                        <div>
                            <div class="flex items-center justify-between mb-1.5">
                                <span class="text-xs font-black text-blue-400 uppercase tracking-wider flex items-center gap-1.5"><i class="fa-solid fa-users text-blue-400"></i>স্টাফ পোর্টাল লিংক (Staff Access)</span>
                                <span class="text-[9.5px] bg-blue-500/10 text-blue-400 border border-blue-500/20 px-2 py-0.5 rounded-full font-bold">এন্ট্রি ও বিলিং মোড</span>
                            </div>
                            <div class="p-2 rounded-lg bg-slate-900 border border-slate-800 text-[11px] font-mono text-slate-300 select-all break-all">
                                https://maa-motors-erp.web.app/?portal=staff
                            </div>
                        </div>
                        <div class="flex items-center gap-2 pt-2 border-t border-slate-800/80">
                            <button class="flex-1 h-8 rounded-lg bg-blue-500/10 border border-blue-500/30 hover:bg-blue-500/20 text-blue-400 text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer active:scale-95" onclick="appAdmin.copyPortalLink('staff')">
                                <i class="fa-solid fa-copy"></i><span>লিংক কপি করুন</span>
                            </button>
                            <button class="h-8 px-3 rounded-lg bg-emerald-500/10 border border-emerald-500/30 hover:bg-emerald-500/20 text-emerald-400 text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer active:scale-95" onclick="appAdmin.sharePortalWhatsApp('staff')" title="হোয়াটসঅ্যাপে পাঠান">
                                <i class="fa-brands fa-whatsapp text-sm"></i><span>শেয়ার</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <!-- User Management Section -->
            <div class="rounded-2xl bg-slate-900/50 border border-slate-800/70 overflow-hidden">
                <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 p-4 md:p-5 bg-gradient-to-r from-indigo-950/40 to-transparent border-b border-slate-800/70">
                    <h3 class="font-black flex items-center gap-2.5 text-white text-sm md:text-base">
                        <i class="fa-solid fa-users-gear text-indigo-400"></i> রেজিস্টার্ড অ্যাকাউন্ট তালিকা
                    </h3>
                    <button class="h-9 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-lg shadow-indigo-600/20 active:scale-95 transition-all cursor-pointer flex items-center gap-1.5" onclick="appAdmin.createNewUser()">
                        <i class="fa-solid fa-user-plus text-xs"></i> নতুন অ্যাকাউন্ট
                    </button>
                </div>
                <div class="p-3 md:p-4" id="admin-users-list">
                    <div class="text-center py-8 text-slate-400 font-bold italic text-sm"><i class="fa-solid fa-spinner fa-spin mr-2"></i>ডাটা লোড হচ্ছে...</div>
                </div>
            </div>

            <!-- System Utilities Section -->
            <div class="rounded-2xl bg-slate-900/50 border border-slate-800/70 overflow-hidden">
                <div class="p-4 md:p-5 bg-gradient-to-r from-blue-950/40 to-transparent border-b border-slate-800/70">
                    <h3 class="font-black flex items-center gap-2.5 text-white text-sm md:text-base">
                        <i class="fa-solid fa-gears text-blue-400"></i> সিস্টেম ইউটিলিটি ও আইডি ম্যানেজার
                    </h3>
                    <p class="text-[11px] text-slate-400 mt-1 ml-7">ডিলেট হওয়া আইডির কাউন্টার রিসেট, অটো-সিঙ্ক ও কাস্টমার আইডি পুনঃসাজানোর স্মার্ট টুলস।</p>
                </div>
                <div class="p-3 md:p-4 grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div class="group rounded-xl bg-slate-950/50 border border-slate-800/60 hover:border-emerald-500/30 p-4 transition-all flex flex-col gap-3">
                        <div class="flex items-center gap-3">
                            <div class="w-9 h-9 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 shrink-0"><i class="fa-solid fa-rotate text-sm"></i></div>
                            <div><h4 class="text-white font-bold text-sm">অটো-সিঙ্ক জোন কাউন্টার</h4><p class="text-[10px] text-slate-500">বর্তমান সক্রিয় কাস্টমার স্ক্যান করে পরবর্তী নতুন সিরিয়াল অটো-রিসেট।</p></div>
                        </div>
                        <button class="h-9 w-full rounded-xl bg-emerald-600/15 border border-emerald-500/25 hover:bg-emerald-600 text-emerald-400 hover:text-white text-xs font-bold transition-all cursor-pointer active:scale-95" onclick="appAdmin.autoSyncZoneCounters()">
                            <i class="fa-solid fa-rotate mr-1.5"></i>১-ক্লিকে কাউন্টার সিঙ্ক
                        </button>
                    </div>

                    <div class="group rounded-xl bg-slate-950/50 border border-slate-800/60 hover:border-purple-500/30 p-4 transition-all flex flex-col gap-3">
                        <div class="flex items-center gap-3">
                            <div class="w-9 h-9 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400 shrink-0"><i class="fa-solid fa-arrow-down-1-9 text-sm"></i></div>
                            <div><h4 class="text-white font-bold text-sm">সিরিয়াল ক্রমানুসারে সাজান</h4><p class="text-[10px] text-slate-500">ডিলেট হওয়ার গ্যাপ মুছে কাস্টমারদের ১, ২, ৩, ৪ ক্রমানুসারে সাজান।</p></div>
                        </div>
                        <button class="h-9 w-full rounded-xl bg-purple-600/15 border border-purple-500/25 hover:bg-purple-600 text-purple-400 hover:text-white text-xs font-bold transition-all cursor-pointer active:scale-95" onclick="appAdmin.resequenceZoneAccountNumbers()">
                            <i class="fa-solid fa-arrow-down-1-9 mr-1.5"></i>সিরিয়াল পুনঃসাজান
                        </button>
                    </div>

                    <div class="group rounded-xl bg-slate-950/50 border border-slate-800/60 hover:border-blue-500/30 p-4 transition-all flex flex-col gap-3">
                        <div class="flex items-center gap-3">
                            <div class="w-9 h-9 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 shrink-0"><i class="fa-solid fa-list-ol text-sm"></i></div>
                            <div><h4 class="text-white font-bold text-sm">ম্যানুয়াল সিরিয়াল কাউন্টার</h4><p class="text-[10px] text-slate-500">নির্দিষ্ট জোনের সিরিয়াল পরবর্তী নম্বর কাস্টম সেট করুন।</p></div>
                        </div>
                        <button class="h-9 w-full rounded-xl bg-blue-600/15 border border-blue-500/25 hover:bg-blue-600 text-blue-400 hover:text-white text-xs font-bold transition-all cursor-pointer active:scale-95" onclick="appAdmin.setNextAccountNo()">
                            <i class="fa-solid fa-list-ol mr-1.5"></i>সিরিয়াল কাস্টম সেট
                        </button>
                    </div>

                    <div class="group rounded-xl bg-slate-950/50 border border-slate-800/60 hover:border-amber-500/30 p-4 transition-all flex flex-col gap-3">
                        <div class="flex items-center gap-3">
                            <div class="w-9 h-9 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 shrink-0"><i class="fa-solid fa-user-pen text-sm"></i></div>
                            <div><h4 class="text-white font-bold text-sm">কাস্টমার আইডি ম্যানুয়াল এডিট</h4><p class="text-[10px] text-slate-500">নির্দিষ্ট ১টি কাস্টমারের অ্যাকাউন্ট নম্বর পরিবর্তন।</p></div>
                        </div>
                        <button class="h-9 w-full rounded-xl bg-amber-600/15 border border-amber-500/25 hover:bg-amber-600 text-amber-400 hover:text-white text-xs font-bold transition-all cursor-pointer active:scale-95" onclick="appAdmin.showIndividualFixer()">
                            <i class="fa-solid fa-user-pen mr-1.5"></i>আইডি এডিট
                        </button>
                    </div>

                    <div class="group rounded-xl bg-slate-950/50 border border-slate-800/60 hover:border-pink-500/30 p-4 transition-all flex flex-col gap-3">
                        <div class="flex items-center gap-3">
                            <div class="w-9 h-9 rounded-xl bg-pink-500/10 border border-pink-500/20 flex items-center justify-center text-pink-400 shrink-0"><i class="fa-solid fa-building-columns text-sm"></i></div>
                            <div><h4 class="text-white font-bold text-sm">ব্যাংকিং ও ক্যাশ সিস্টেম</h4><p class="text-[10px] text-slate-500">ব্যাংক ও ক্যাশ অ্যাকাউন্ট যোগ, এডিট, রিনেম বা ডিলেট করুন।</p></div>
                        </div>
                        <button class="h-9 w-full rounded-xl bg-pink-600/15 border border-pink-500/25 hover:bg-pink-600 text-pink-400 hover:text-white text-xs font-bold transition-all cursor-pointer active:scale-95" onclick="appAdmin.showBankingSystemManager()">
                            <i class="fa-solid fa-money-check-dollar mr-1.5"></i>ব্যাংক ম্যানেজমেন্ট
                        </button>
                    </div>

                    <div class="group rounded-xl bg-slate-950/50 border border-slate-800/60 hover:border-emerald-500/30 p-4 transition-all flex flex-col gap-3">
                        <div class="flex items-center gap-3">
                            <div class="w-9 h-9 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 shrink-0"><i class="fa-solid fa-calculator text-sm"></i></div>
                            <div><h4 class="text-white font-bold text-sm">খতিয়ান ব্যালেন্স ভেরিফায়ার</h4><p class="text-[10px] text-slate-500">সব কাস্টমারের সমস্ত ভাউচার যোগফল ও ব্যালেন্স অটো-ভেরিফাই ও ১-ক্লিক হিল।</p></div>
                        </div>
                        <button class="h-9 w-full rounded-xl bg-emerald-600/15 border border-emerald-500/25 hover:bg-emerald-600 text-emerald-400 hover:text-white text-xs font-bold transition-all cursor-pointer active:scale-95" onclick="appAdmin.runBalanceIntegrityScanner()">
                            <i class="fa-solid fa-wand-magic-sparkles mr-1.5"></i>১-ক্লিকে ব্যালেন্স ভেরিফাই
                        </button>
                    </div>

                    <div class="group rounded-xl bg-slate-950/50 border border-slate-800/60 hover:border-amber-500/30 p-4 transition-all flex flex-col gap-3">
                        <div class="flex items-center gap-3">
                            <div class="w-9 h-9 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 shrink-0"><i class="fa-solid fa-broom text-sm"></i></div>
                            <div><h4 class="text-white font-bold text-sm">পুরোনো অডিট লগ মুছুন</h4><p class="text-[10px] text-slate-500">৩ বা ৬ মাসের পুরোনো অডিট লগ মুছে স্টোরেজ ক্লিয়ার করুন।</p></div>
                        </div>
                        <button class="h-9 w-full rounded-xl bg-amber-600/15 border border-amber-500/25 hover:bg-amber-600 text-amber-400 hover:text-white text-xs font-bold transition-all cursor-pointer active:scale-95" onclick="appAdmin.cleanupOldAuditLogs()">
                            <i class="fa-solid fa-broom mr-1.5"></i>অডিট লগ ক্লিনআপ
                        </button>
                    </div>

                    <div class="group rounded-xl bg-slate-950/50 border border-slate-800/60 hover:border-red-500/30 p-4 transition-all flex flex-col gap-3">
                        <div class="flex items-center gap-3">
                            <div class="w-9 h-9 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-400 shrink-0"><i class="fa-solid fa-trash-can text-sm"></i></div>
                            <div><h4 class="text-white font-bold text-sm">রিসাইকেল বিন</h4><p class="text-[10px] text-slate-500">ডিলিট হওয়া কাস্টমার ও ভাউচার রিস্টোর করুন।</p></div>
                        </div>
                        <button class="h-9 w-full rounded-xl bg-red-600/15 border border-red-500/25 hover:bg-red-600 text-red-400 hover:text-white text-xs font-bold transition-all cursor-pointer active:scale-95" onclick="window.navigate('recycle-bin')">
                            <i class="fa-solid fa-trash-arrow-up mr-1.5"></i>রিসাইকেল বিন খুলুন
                        </button>
                    </div>
                </div>
            </div>

            <!-- Smart Excel Backup Section -->
            <div class="rounded-2xl bg-slate-900/50 border border-slate-800/70 overflow-hidden">
                <div class="p-4 md:p-5 bg-gradient-to-r from-emerald-950/40 to-transparent border-b border-slate-800/70">
                    <h3 class="font-black flex items-center gap-2.5 text-white text-sm md:text-base">
                        <i class="fa-solid fa-file-excel text-emerald-400"></i> স্মার্ট এক্সেল ব্যাকআপ ও অটো-সিঙ্ক
                    </h3>
                    <p class="text-[11px] text-slate-400 mt-1 ml-7">লাইভ কাস্টমার ডাটা সহ এক্সেল ডাউনলোড বা অফলাইন এন্ট্রি সিঙ্ক করুন।</p>
                </div>
                <div class="p-3 md:p-4 grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div class="group rounded-xl bg-slate-950/50 border border-slate-800/60 hover:border-emerald-500/30 p-4 transition-all flex flex-col gap-3">
                        <div class="flex items-center gap-3">
                            <div class="w-9 h-9 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 shrink-0"><i class="fa-solid fa-download text-sm"></i></div>
                            <div><h4 class="text-white font-bold text-sm">ব্যাকআপ ডাউনলোড</h4><p class="text-[10px] text-slate-500">সব কাস্টমারের বকেয়া ব্যালেন্স সহ এক্সেল ডাউনলোড।</p></div>
                        </div>
                        <button class="h-9 w-full rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-all cursor-pointer active:scale-95 shadow-md shadow-emerald-600/20" onclick="downloadAdminExcelBackup()">
                            <i class="fa-solid fa-file-arrow-down mr-1.5"></i>এক্সেল ডাউনলোড
                        </button>
                    </div>
                    <div class="group rounded-xl bg-slate-950/50 border border-slate-800/60 hover:border-blue-500/30 p-4 transition-all flex flex-col gap-3">
                        <div class="flex items-center gap-3">
                            <div class="w-9 h-9 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 shrink-0"><i class="fa-solid fa-cloud-arrow-up text-sm"></i></div>
                            <div><h4 class="text-white font-bold text-sm">অফলাইন এক্সেল সিঙ্ক</h4><p class="text-[10px] text-slate-500">এক্সেলে করা এন্ট্রি অ্যাপে আপলোড ও সিঙ্ক করুন।</p></div>
                        </div>
                        <input type="file" id="admin-excel-file-input" accept=".xlsx, .xls, .csv" class="hidden" onchange="uploadAdminExcelBackup(this)">
                        <button class="h-9 w-full rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition-all cursor-pointer active:scale-95 shadow-md shadow-blue-600/20" onclick="document.getElementById('admin-excel-file-input').click()">
                            <i class="fa-solid fa-file-import mr-1.5"></i>এক্সেল আপলোড ও সিঙ্ক
                        </button>
                    </div>
                </div>
            </div>

            <!-- Advanced Disaster Recovery Section -->
            <div class="rounded-2xl bg-red-950/20 border border-red-900/30 overflow-hidden mt-6">
                <div class="p-4 md:p-5 bg-gradient-to-r from-red-950/40 to-transparent border-b border-red-900/30">
                    <h3 class="font-black flex items-center gap-2.5 text-white text-sm md:text-base">
                        <i class="fa-solid fa-shield-halved text-red-500"></i> ফুল ডাটাবেস ব্যাকআপ ও রিস্টোর (Disaster Recovery)
                    </h3>
                    <p class="text-[11px] text-slate-400 mt-1 ml-7">সম্পূর্ণ ডাটাবেসের 1-Click JSON ব্যাকআপ ডাউনলোড এবং রিস্টোর ইঞ্জিন।</p>
                </div>
                <div class="p-3 md:p-4 grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div class="group rounded-xl bg-slate-950/50 border border-slate-800/60 hover:border-indigo-500/30 p-4 transition-all flex flex-col gap-3">
                        <div class="flex items-center gap-3">
                            <div class="w-9 h-9 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 shrink-0"><i class="fa-solid fa-database text-sm"></i></div>
                            <div><h4 class="text-white font-bold text-sm">সম্পূর্ণ ডাটাবেস এক্সপোর্ট</h4><p class="text-[10px] text-slate-500">এনক্রিপ্টেড .enc ফাইল হিসেবে ডাটাবেস ডাউনলোড।</p></div>
                        </div>
                        <button class="h-9 w-full rounded-xl bg-indigo-600/15 border border-indigo-500/25 hover:bg-indigo-600 text-indigo-400 hover:text-white text-xs font-bold transition-all cursor-pointer active:scale-95" onclick="window.downloadFullSystemBackup()">
                            <i class="fa-solid fa-download mr-1.5"></i>১-ক্লিক ফুল ব্যাকআপ
                        </button>
                    </div>
                    
                    <div class="group rounded-xl bg-slate-950/50 border border-red-900/60 hover:border-red-500/30 p-4 transition-all flex flex-col gap-3">
                        <div class="flex items-center gap-3">
                            <div class="w-9 h-9 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-400 shrink-0"><i class="fa-solid fa-triangle-exclamation text-sm"></i></div>
                            <div><h4 class="text-white font-bold text-sm">সিস্টেম রিস্টোর</h4><p class="text-[10px] text-slate-500">বর্তমান ডাটা মুছে ফেলে ব্যাকআপ ডাটা প্রতিস্থাপন।</p></div>
                        </div>
                        <button class="h-9 w-full rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-bold transition-all cursor-pointer active:scale-95 shadow-md shadow-red-600/20" onclick="window.restoreSystemFromBackup()">
                            <i class="fa-solid fa-clock-rotate-left mr-1.5"></i>ডাটাবেস রিস্টোর করুন
                        </button>
                    </div>
                </div>
            </div>

        </div>
    `,ca(),(async()=>{try{await(await D(()=>Promise.resolve().then(()=>pa),void 0)).checkBackupReminder()}catch(e){console.error(`Failed to load backup reminder:`,e)}})()}var Ga=t({runBalanceIntegrityScanner:()=>Ka});async function Ka(){H.default.fire({title:`<i class="fa-solid fa-calculator text-blue-400 mr-2"></i>খতিয়ান স্ক্যান হচ্ছে...`,html:`<p class="font-bn text-sm text-slate-300">সকল কাস্টমার এবং ভাউচার হিসাব যাচাই করা হচ্ছে। অনুগ্রহ করে অপেক্ষা করুন...</p>`,allowOutsideClick:!1,didOpen:()=>H.default.showLoading(),customClass:{popup:`!bg-slate-950 !text-white !rounded-3xl border border-slate-800 font-bn`}});try{let[e,t]=await Promise.all([a.getAll(`name`,`asc`),o.getAll()]),n={},r={};t.forEach(e=>{if(!e.customerId)return;let t=String(e.voucherNo||``).trim().toUpperCase();if(t===`OPENING`||t===`OPEN`||t===`প্রারম্ভিক ব্যালেন্স`||t===`প্রারম্ভিক জের`){let t=L((Number(e.bill)||0)-(Number(e.paid)||0));r[e.customerId]=t}else n[e.customerId]||(n[e.customerId]={totalBill:0,totalPaid:0,count:0}),n[e.customerId].totalBill=L(n[e.customerId].totalBill+(Number(e.bill)||0)),n[e.customerId].totalPaid=L(n[e.customerId].totalPaid+(Number(e.paid)||0)),n[e.customerId].count++});let i=[];if(e.forEach(e=>{let t=Number(e.initialDue||0);t===0&&r[e.id]!==void 0&&(t=r[e.id]);let a=n[e.id]||{totalBill:0,totalPaid:0,count:0},o=L(t+a.totalBill-a.totalPaid),s=L(Number(e.totalDue||0)),c=L(s-o);Math.abs(c)>.01&&i.push({id:e.id,name:e.name,accountNo:e.accountNo||`N/A`,phone:e.phone||``,initialDue:t,totalBill:a.totalBill,totalPaid:a.totalPaid,storedDue:s,expectedDue:o,diff:c})}),i.length===0)return H.default.fire({title:`<i class="fa-solid fa-circle-check text-emerald-400 mr-2"></i>খতিয়ান ১০০% নির্ভুল!`,html:`
                    <div class="font-bn text-left space-y-2 p-3 bg-slate-900 rounded-2xl border border-slate-800 text-xs">
                        <div class="flex justify-between border-b border-slate-800 pb-1.5"><span class="text-slate-400">মোট কাস্টমার:</span><strong class="text-white">${e.length} জন</strong></div>
                        <div class="flex justify-between border-b border-slate-800 pb-1.5"><span class="text-slate-400">মোট ভাউচার লেনদেন:</span><strong class="text-white">${t.length} টি</strong></div>
                        <div class="flex justify-between pt-1"><span class="text-emerald-400 font-bold">ব্যালেন্স অমিল:</span><strong class="text-emerald-400">০ (কোনো ভুল নেই)</strong></div>
                    </div>
                `,icon:`success`,confirmButtonText:`ঠিক আছে`,customClass:{popup:`!bg-slate-950 !text-white !rounded-3xl border border-emerald-500/30 font-bn`,confirmButton:`m3-btn-primary !bg-emerald-600`}});let s=i.map((e,t)=>`
            <tr class="border-b border-slate-800 text-xs">
                <td class="p-2 text-slate-400 font-mono">${t+1}</td>
                <td class="p-2 font-bold text-white">${e.name} <span class="text-[10px] text-blue-400 block font-mono">[${e.accountNo}]</span></td>
                <td class="p-2 text-right font-mono text-slate-300">৳ ${F(e.storedDue)}</td>
                <td class="p-2 text-right font-mono text-emerald-400 font-black">৳ ${F(e.expectedDue)}</td>
                <td class="p-2 text-right font-mono text-red-400 font-black">৳ ${F(e.diff)}</td>
            </tr>
        `).join(``);(await H.default.fire({title:`<i class="fa-solid fa-triangle-exclamation text-amber-400 mr-2"></i>${i.length} জনের ব্যালেন্সে অমিল পাওয়া গেছে!`,html:`
                <div class="text-left font-bn space-y-3">
                    <p class="text-xs text-slate-300">নিচের কাস্টমারদের বর্তমান মোট ব্যালেন্স ও তাদের প্রকৃত ভাউচার যোগফলের মধ্যে অমিল রয়েছে:</p>
                    <div class="max-h-56 overflow-y-auto rounded-xl border border-slate-800 bg-slate-900">
                        <table class="w-full text-left">
                            <thead class="bg-slate-950 text-[10px] uppercase text-slate-400 sticky top-0">
                                <tr>
                                    <th class="p-2">#</th>
                                    <th class="p-2">কাস্টমার</th>
                                    <th class="p-2 text-right">সংরক্ষিত বকেয়া</th>
                                    <th class="p-2 text-right">প্রকৃত বকেয়া</th>
                                    <th class="p-2 text-right">পার্থক্য</th>
                                </tr>
                            </thead>
                            <tbody>${s}</tbody>
                        </table>
                    </div>
                    <p class="text-[11px] text-emerald-400 font-bold text-center">"সবগুলো অটো-হিল করুন" বাটনে চাপ দিলে সবগুলো স্বয়ংক্রিয়ভাবে সঠিক হয়ে যাবে।</p>
                </div>
            `,showCancelButton:!0,confirmButtonText:`<i class="fa-solid fa-wand-magic-sparkles mr-1.5"></i>সবগুলো অটো-হিল করুন`,cancelButtonText:`পরে করব`,customClass:{popup:`!bg-slate-950 !text-white !rounded-3xl border border-amber-500/40 font-bn max-w-2xl`,confirmButton:`m3-btn-primary !bg-emerald-600 hover:!bg-emerald-500 font-bold px-6 py-2.5 rounded-xl`,cancelButton:`m3-btn-tonal !bg-slate-800 text-slate-300 font-bold px-5 py-2.5 rounded-xl`}})).isConfirmed&&await qa(i)}catch(e){console.error(`Balance scan error:`,e),H.default.fire({title:`ত্রুটি!`,text:`স্ক্যান করার সময় সমস্যা হয়েছে: `+e.message,icon:`error`})}}async function qa(e){H.default.fire({title:`ব্যালেন্স ঠিক করা হচ্ছে...`,allowOutsideClick:!1,didOpen:()=>H.default.showLoading(),customClass:{popup:`!bg-slate-950 !text-white !rounded-3xl border border-slate-800 font-bn`}});try{let t=0;for(let n of e)await a.update(n.id,{totalDue:n.expectedDue}),O(`HEAL_BALANCE`,`Customer`,n.id,n.name,{storedDue:n.storedDue,correctedDue:n.expectedDue,diff:n.diff}),t++;H.default.fire({title:`সফলভাবে সম্পন্ন!`,text:`মোট ${t} জন কাস্টমারের খতিয়ান ব্যালেন্স নিখুঁতভাবে রিস্টোর করা হয়েছে।`,icon:`success`,confirmButtonText:`ঠিক আছে`,customClass:{popup:`!bg-slate-950 !text-white !rounded-3xl border border-emerald-500/40 font-bn`}})}catch(e){console.error(`Heal error:`,e),H.default.fire(`Error`,`ব্যালেন্স রিস্টোর করতে সমস্যা হয়েছে: `+e.message,`error`)}}typeof window<`u`&&(window.runBalanceIntegrityScanner=Ka);var Ja=t({deleteRecycleItemPermanently:()=>eo,emptyRecycleBin:()=>to,renderRecycleBin:()=>Xa,restoreRecycleItem:()=>$a,unsubscribeRecycleBinData:()=>Qa}),Ya=null;function Xa(e){if(window.AppState?.currentUserRole!==`Admin`){e.innerHTML=`<div class="p-8 text-center text-red-400 font-bn text-xl">অ্যাক্সেস ডিনাইড! শুধুমাত্র অ্যাডমিন এই পেজ দেখতে পারবেন।</div>`;return}e.innerHTML=`
        <div class="max-w-5xl mx-auto pb-20">
            <!-- Header -->
            <div class="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
                <div>
                    <h2 class="text-xl md:text-2xl font-black text-white flex items-center gap-2">
                        <i class="fa-solid fa-trash-can text-red-500"></i> রিসাইকেল বিন
                    </h2>
                    <p class="text-xs text-slate-400 mt-1 font-bn">ডিলিট হওয়া কাস্টমার এবং ভাউচার এখানে জমা থাকে।</p>
                </div>
                <button class="h-9 px-4 rounded-xl bg-red-600/20 border border-red-500/30 hover:bg-red-600 text-red-400 hover:text-white text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5" onclick="appAdmin.emptyRecycleBin()">
                    <i class="fa-solid fa-dumpster-fire"></i> সম্পূর্ণ খালি করুন
                </button>
            </div>

            <div class="bg-slate-900/50 border border-slate-800/70 rounded-2xl overflow-hidden shadow-2xl">
                <div class="overflow-x-auto min-h-[400px]">
                    <table class="w-full text-left border-collapse whitespace-nowrap">
                        <thead class="bg-slate-950/80 border-b border-slate-800/80 text-[10px] font-black text-slate-400 uppercase tracking-wider sticky top-0 z-10">
                            <tr>
                                <th class="p-3 pl-4">আইটেম টাইপ</th>
                                <th class="p-3">বিস্তারিত তথ্য</th>
                                <th class="p-3">ডিলিট করেছেন</th>
                                <th class="p-3">ডিলিটের সময়</th>
                                <th class="p-3 pr-4 text-right">অ্যাকশন</th>
                            </tr>
                        </thead>
                        <tbody id="recycle-bin-table-body" class="divide-y divide-slate-800/50">
                            <tr><td colspan="5" class="p-10 text-center"><i class="fa-solid fa-spinner fa-spin text-blue-500 text-2xl"></i></td></tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    `,Za()}function Za(){let e=document.getElementById(`recycle-bin-table-body`);e&&(Ya&&Ya(),Ya=m.collection(`recycle_bin`).orderBy(`deletedAt`,`desc`).onSnapshot(t=>{if(t.empty){e.innerHTML=`<tr><td colspan="5" class="p-12 text-center text-slate-500 font-bn text-lg"><i class="fa-solid fa-box-open text-3xl mb-3 opacity-30 block"></i>রিসাইকেল বিন সম্পূর্ণ খালি।</td></tr>`;return}let n=[],r={};t.forEach(e=>{let t=e.data();t.id=e.id,t.batchId&&t.module===`Transaction`?(r[t.batchId]||(r[t.batchId]={isCustomerBatch:!1,txns:[]}),r[t.batchId].txns.push(t)):t.batchId&&t.module===`Customer`?(r[t.batchId]||(r[t.batchId]={isCustomerBatch:!0,txns:[]}),r[t.batchId].customer=t,r[t.batchId].isCustomerBatch=!0):n.push(t)});let i=[...n];Object.keys(r).forEach(e=>{let t=r[e];t.isCustomerBatch&&t.customer?(t.customer.groupedTxnCount=t.txns.length,i.push(t.customer)):t.txns.forEach(e=>i.push(e))}),i.sort((e,t)=>{let n=e.deletedAt?e.deletedAt.toMillis():0;return(t.deletedAt?t.deletedAt.toMillis():0)-n}),e.innerHTML=i.map(e=>{let t=e.module===`Customer`,n=t?`<i class="fa-solid fa-users text-blue-400"></i>`:`<i class="fa-solid fa-file-invoice text-emerald-400"></i>`,r=t?`কাস্টমার প্রোফাইল`:`সিঙ্গেল ভাউচার`,i=e.deletedAt?new Date(e.deletedAt.toMillis()).toLocaleString(`en-GB`):`N/A`,a=``;if(t){let t=e.data;a=`
                        <div class="font-bold text-white">${t.name||`Unknown`} <span class="text-[10px] text-blue-400 ml-1">[${t.accountNo||``}]</span></div>
                        <div class="text-[10px] text-slate-400 mt-0.5">বকেয়া: ৳${F(t.totalDue||0)} | সাথে ডিলিট হওয়া ভাউচার: ${e.groupedTxnCount||0} টি</div>
                    `}else{let t=e.data,n=t.date?B(t.date):`N/A`;a=`
                        <div class="font-bold text-white">ভাউচার: ${t.voucherNo||`-`} <span class="text-[10px] text-emerald-400 ml-1">[${n}]</span></div>
                        <div class="text-[10px] text-slate-400 mt-0.5">কাস্টমার: ${t.customerName||`-`} | বিল: ৳${F(t.bill||0)} | জমা: ৳${F(t.paid||0)}</div>
                    `}let o=encodeURIComponent(JSON.stringify(e));return`
                    <tr class="hover:bg-slate-800/30 transition-colors group">
                        <td class="p-3 pl-4">
                            <div class="flex items-center gap-2">
                                <div class="w-8 h-8 rounded-lg bg-slate-950 flex items-center justify-center border border-slate-800">${n}</div>
                                <span class="font-bn text-xs font-bold text-slate-300">${r}</span>
                            </div>
                        </td>
                        <td class="p-3 font-bn text-xs">${a}</td>
                        <td class="p-3 font-bn text-xs text-slate-400"><i class="fa-solid fa-user-xmark mr-1"></i>${e.deletedBy||`System`}</td>
                        <td class="p-3 font-mono text-[10px] text-slate-500">${i}</td>
                        <td class="p-3 pr-4 text-right">
                            <div class="flex items-center justify-end gap-2 opacity-100 md:opacity-0 group-hover:opacity-100 transition-opacity">
                                <button class="w-7 h-7 rounded-md bg-emerald-500/10 border border-emerald-500/20 hover:bg-emerald-600 text-emerald-400 hover:text-white transition-colors" onclick="appAdmin.restoreRecycleItem('${o}')" title="রিস্টোর করুন">
                                    <i class="fa-solid fa-clock-rotate-left text-[10px]"></i>
                                </button>
                                <button class="w-7 h-7 rounded-md bg-red-500/10 border border-red-500/20 hover:bg-red-600 text-red-400 hover:text-white transition-colors" onclick="appAdmin.deleteRecycleItemPermanently('${e.id}', '${e.batchId||``}')" title="চিরতরে মুছুন">
                                    <i class="fa-solid fa-trash text-[10px]"></i>
                                </button>
                            </div>
                        </td>
                    </tr>
                `}).join(``)},t=>{console.error(`Recycle bin listener error:`,t),e&&(e.innerHTML=`<tr><td colspan="5" class="p-4 text-center text-red-400 text-xs">Error loading data</td></tr>`)}))}function Qa(){Ya&&Ya()}async function $a(e){if(await W(`রিস্টোর কনফার্মেশন`,`restoreRecycleItem`))try{let t=JSON.parse(decodeURIComponent(e));if(H.default.fire({title:`রিস্টোর হচ্ছে...`,allowOutsideClick:!1,didOpen:()=>H.default.showLoading()}),t.module===`Transaction`&&!t.batchId){let e=m.batch(),r=t.data,i=r.customerId,s=Number(r.bill)||0,c=Number(r.paid)||0;e.set(o.getRef(t.id),r),e.update(a.getRef(i),{totalDue:n.firestore.FieldValue.increment(L(s-c))}),e.delete(m.collection(`recycle_bin`).doc(t.id)),await e.commit(),O(`RESTORE`,`Ledger`,t.id,r.customerName,{action:`Restored Transaction`})}else if(t.module===`Customer`){let e=t.batchId,n=[];n.push(e=>{e.set(a.getRef(t.id),t.data),e.delete(m.collection(`recycle_bin`).doc(t.id))});let r=await m.collection(`recycle_bin`).where(`batchId`,`==`,e).where(`module`,`==`,`Transaction`).get();r.forEach(e=>{let t=e.data();n.push(n=>{n.set(o.getRef(e.id),t.data),n.delete(e.ref)})});for(let e=0;e<n.length;e+=200){let t=m.batch();n.slice(e,e+200).forEach(e=>e(t)),await t.commit()}O(`RESTORE`,`Customers`,t.id,t.data.name,{action:`Restored Customer and `+r.size+` Txns`})}H.default.fire(`সফল!`,`সফলভাবে রিস্টোর করা হয়েছে।`,`success`)}catch(e){console.error(`Restore error:`,e),H.default.fire(`Error`,`রিস্টোর করতে সমস্যা হয়েছে: `+e.message,`error`)}}async function eo(e,t){if(await W(`স্থায়ীভাবে ডিলিট`,`deletePermanently`))try{if(H.default.fire({title:`মুছে ফেলা হচ্ছে...`,allowOutsideClick:!1,didOpen:()=>H.default.showLoading()}),t&&t!==`undefined`&&t!==`null`){let n=await m.collection(`recycle_bin`).where(`batchId`,`==`,t).where(`module`,`==`,`Transaction`).get(),r=[m.collection(`recycle_bin`).doc(e),...n.docs.map(e=>e.ref)];for(let e=0;e<r.length;e+=400){let t=m.batch();r.slice(e,e+400).forEach(e=>t.delete(e)),await t.commit()}}else await m.collection(`recycle_bin`).doc(e).delete();H.default.fire(`সফল!`,`চিরতরে মুছে ফেলা হয়েছে।`,`success`)}catch(e){console.error(`Permanent delete error:`,e),H.default.fire(`Error`,`সমস্যা হয়েছে: `+e.message,`error`)}}async function to(){if(await W(`রিসাইকেল বিন সম্পূর্ণ খালি`,`emptyRecycleBin`)&&(await H.default.fire({title:`ওয়ার্নিং!`,text:`রিসাইকেল বিনের সব ডাটা চিরতরে মুছে যাবে। আপনি কি নিশ্চিত?`,icon:`warning`,showCancelButton:!0,confirmButtonColor:`#dc2626`,confirmButtonText:`হ্যাঁ, সব মুছুন`,cancelButtonText:`বাতিল`,customClass:{popup:`!bg-slate-950 !text-white !rounded-3xl border border-red-500/30 font-bn`}})).isConfirmed)try{H.default.fire({title:`মুছে ফেলা হচ্ছে...`,allowOutsideClick:!1,didOpen:()=>H.default.showLoading()});let e=await m.collection(`recycle_bin`).get();if(e.empty)return H.default.fire(`সফল!`,`রিসাইকেল বিন আগে থেকেই খালি।`,`info`);let t=m.batch(),n=0;for(let r of e.docs)t.delete(r.ref),n++,n>=400&&(await t.commit(),t=m.batch(),n=0);n>0&&await t.commit(),O(`EMPTY_TRASH`,`System`,`RecycleBin`,`Emptied ${e.size} items`),H.default.fire(`সফল!`,`রিসাইকেল বিন সম্পূর্ণ খালি করা হয়েছে।`,`success`)}catch(e){console.error(`Empty trash error:`,e),H.default.fire(`Error`,`সমস্যা হয়েছে: `+e.message,`error`)}}window.appAdmin={loadAdminUsers:ca,...xa,...Aa,...ma,...Ma,...Ga,...Ja};var Z=[],no=[],ro;function io(){return Z}function ao(e){Z=e}function oo(){return no}function so(){Z.push({desc:``,qty:1,unit:`Pcs`,rate:0,total:0}),vo()}function co(e){Z.splice(e,1),vo(),bo()}function lo(e,t,n){let r=n.value;if(t===`desc`)Z[e].desc=r,r.length>=3&&uo(e,r);else if(t===`unit`)Z[e].unit=r;else{let n=Math.max(0,I(r));if(Z[e][t]=n,t===`qty`||t===`rate`){let t=I(Z[e].qty)*I(Z[e].rate);Z[e].total=t;let n=document.getElementById(`inv-item-total-${e}`);n&&(n.value=F(t));let r=document.getElementById(`item-live-words-${e}`);r&&(t>0?(r.innerHTML=`<i class="fa-solid fa-coins text-[9px] text-amber-400"></i> <span>${V(t)}</span>`,r.classList.remove(`hidden`)):r.classList.add(`hidden`))}}bo()}function uo(e,t){let n=document.getElementById(`inv-customer-select`);if(!n||n.selectedIndex<=0)return;let r=n.value;clearTimeout(ro),ro=setTimeout(async()=>{try{let n=await o.collection.where(`customerId`,`==`,r).orderBy(`createdAt`,`desc`).limit(30).get(),i=null;n.forEach(e=>{let n=e.data();if(n.hasItems&&n.items&&!i){let e=n.items.find(e=>(e.desc||``).toLowerCase().trim()===t.toLowerCase().trim());e&&(i=e.rate)}});let a=document.getElementById(`price-hint-${e}`);a&&i&&(a.innerHTML=`<button type="button" onclick="window.applyHistoryPrice(${e}, ${i})" class="text-[10px] bg-blue-500/20 text-blue-300 border border-blue-500/40 px-2 py-0.5 rounded-md font-bold hover:bg-blue-600 hover:text-white transition-all cursor-pointer">আগের রেট: ৳${F(i)}</button>`,a.classList.remove(`hidden`))}catch(e){console.error(`Price hint error:`,e)}},400)}function fo(e,t){Z[e].rate=t,Z[e].total=Z[e].qty*t,vo(),bo()}function po(e){let t=document.getElementById(`inv-paid`),n=I((document.getElementById(`inv-net-total-display`)?.innerText||`0`).replace(/[^0-9.]/g,``)),r=e;e===`exact`&&(r=n),t&&(t.value=r,window.calcInvoiceTotals(),window.toggleInvoiceRecvSection()),yo(r,n)}function mo(){let e=document.getElementById(`inv-customer-select`),t=e&&e.selectedIndex>0?e.options[e.selectedIndex].dataset.name:`Unknown`;if(Z.length===0||Z.length===1&&!Z[0].desc&&!Z[0].total)return H.default.fire(`Error`,`হোল্ড করার মত কোনো আইটেম নেই`,`error`);no.push({id:Date.now(),time:new Date().toLocaleTimeString([],{hour:`2-digit`,minute:`2-digit`}),customerName:t,customerId:e?e.value:``,items:JSON.parse(JSON.stringify(Z)),notes:document.getElementById(`inv-notes`)?.value||``}),H.default.fire({toast:!0,position:`top-end`,icon:`success`,title:`বিল হোল্ড করা হয়েছে (${t})`,showConfirmButton:!1,timer:2e3,customClass:{popup:`!bg-slate-900 !text-white border border-slate-700`}}),ao([{desc:``,qty:1,unit:`Pcs`,rate:0,total:0}]),document.getElementById(`inv-notes`).value=``,vo(),bo()}function ho(e){if(!no[e])return;let t=no[e];ao(t.items),document.getElementById(`inv-notes`)&&(document.getElementById(`inv-notes`).value=t.notes),document.getElementById(`inv-customer-select`)&&t.customerId&&(document.getElementById(`inv-customer-select`).value=t.customerId,window.invoiceCustomerChanged()),no.splice(e,1),vo(),bo(),H.default.fire({toast:!0,position:`top-end`,icon:`info`,title:`হোল্ড বিল রিজিউম করা হয়েছে`,showConfirmButton:!1,timer:2e3,customClass:{popup:`!bg-slate-900 !text-white border border-slate-700`}})}async function go(e){let t=document.querySelectorAll(`button[onclick*="saveAndPrintInvoice"]`);try{let r=document.getElementById(`inv-customer-select`);if(!r||r.selectedIndex<=0)return H.default.fire(`এরর`,`কাস্টমার সিলেক্ট করুন!`,`error`);let i=r.value,s=r.options[r.selectedIndex],c=s.dataset.name,l=s.dataset.phone,u=z(document.getElementById(`inv-date`).value),d=document.getElementById(`inv-voucher`).value,f=document.getElementById(`inv-notes`).value,p=I(document.getElementById(`inv-subtotal`).value),h=I(document.getElementById(`inv-discount`).value),g=document.getElementById(`inv-disc-mode-btn`)?.dataset.mode||`fixed`,_=I(document.getElementById(`inv-paid`).value),v=g===`percent`?L(p*h/100):h,y=L(Math.max(0,p-v));if(y===0&&_===0)throw Error(`বিল বা জমা এন্ট্রি দিন`);let b=``,x=``;if(_>0){let e=document.getElementById(`inv-recv-cash-btn`);b=e&&e.classList.contains(`bg-emerald-600`)?`Cash`:`Bank`,x=document.getElementById(`inv-received-from`)?.value?.trim()||``}if(!(await H.default.fire({title:`<div class="flex items-center justify-center gap-2 font-bn font-black text-xl text-white"><i class="fa-solid fa-file-invoice text-blue-400"></i><span>ইনভয়েস যাচাই করুন</span></div>`,html:`
                <div class="text-left font-bn p-3.5 bg-slate-900/90 rounded-2xl border border-slate-800 space-y-2.5 shadow-inner">
                    <div class="flex justify-between items-center border-b border-slate-800/80 pb-2"><span class="text-xs text-slate-400 font-bold">কাস্টমার:</span><strong class="text-sm text-white font-black">${c}</strong></div>
                    <div class="flex justify-between items-center border-b border-slate-800/80 pb-2"><span class="text-xs text-slate-400 font-bold">মোট বিল:</span><strong class="text-base text-blue-400 font-black font-mono">৳ ${F(y)}</strong></div>
                    <div class="flex justify-between items-center border-b border-slate-800/80 pb-2"><span class="text-xs text-slate-400 font-bold">আদায় (Paid):</span><strong class="text-base text-emerald-400 font-black font-mono">৳ ${F(_)}</strong></div>
                    ${_>0?`<div class="flex justify-between items-center"><span class="text-xs text-purple-400 font-bold">পেমেন্ট মাধ্যম:</span><strong class="text-xs text-purple-300 font-bold">${b} ${x?`(`+x+`)`:``}</strong></div>`:``}
                </div>`,showCancelButton:!0,confirmButtonText:`<i class="fa-solid fa-print mr-2"></i>সেভ ও প্রিন্ট করুন`,cancelButtonText:`<i class="fa-solid fa-pen-to-square mr-2"></i>সংশোধন করব`,customClass:{popup:`!bg-slate-950 !text-white !rounded-3xl border border-slate-800 shadow-2xl font-bn`,confirmButton:`m3-btn-primary !bg-blue-600 hover:!bg-blue-500 !px-7 !py-2.5 !rounded-xl font-bold shadow-lg shadow-blue-600/30`,cancelButton:`m3-btn-tonal !bg-slate-800 hover:!bg-slate-700 !text-slate-300 !px-5 !py-2.5 !rounded-xl font-bold border border-slate-700`}})).isConfirmed)return;t.forEach(e=>e.disabled=!0),H.default.fire({title:`সেভ হচ্ছে...`,didOpen:()=>H.default.showLoading(),allowOutsideClick:!1});let S=m.batch(),C=o.getRef(),w=Z.filter(e=>e.desc&&e.desc.trim()!==``||e.total>0),T=await a.getById(i)||{},ee=Number(T.totalDue)||0,te=L(ee+(y-_)),E={customerId:i,customerName:c,date:u,voucherNo:d,notes:f,bill:y,paid:_,receivedType:b,receivedFrom:x,subtotal:p,discount:v,discountInput:h,discountMode:g,prevDue:ee,currentDue:te,hasItems:w.length>0,createdBy:window.AppState?.currentUserEmail||`Unknown`,createdAt:n.firestore.FieldValue.serverTimestamp()};w.length>0&&(E.items=w.map(e=>({...e}))),S.set(C,E),S.update(a.getRef(i),{totalDue:n.firestore.FieldValue.increment(L(y-_))}),await S.commit(),O(`CREATE`,`Invoice`,C.id,c,{bill:y,paid:_}),l&&(await H.default.fire({title:`সফল!`,text:`কাস্টমারকে হোয়াটসঅ্যাপে ডিজিটাল ইনভয়েস পাঠাবেন?`,icon:`success`,showCancelButton:!0,confirmButtonText:`<i class="fa-brands fa-whatsapp mr-1.5"></i> হোয়াটসঅ্যাপ মেসেজ`,cancelButtonText:`প্রিন্ট এ যাব`,confirmButtonColor:`#25D366`})).isConfirmed&&(()=>{let e=F(Math.abs(te)),t=te<0?`অ্যাডভান্স জমা: ৳ ${e}`:`বর্তমান মোট বকেয়া: ৳ ${e}`,n=`${window.location.origin}${window.location.pathname}?view=public-memo&id=${C.id}`,r=`আসসালামু আলাইকুম ${c},\nমেসার্স মা মোটরস্ থেকে আপনার মেমো সেভ হয়েছে।\n\nআজকের বিল: ৳ ${F(y)}\nআজকের জমা: ৳ ${F(_)}\n---------------------------------\n${t}\n\nআপনার ডিজিটাল মেমোর PDF দেখতে নিচের লিংকে ক্লিক করুন:\n${n}\n\nধন্যবাদ! — মেসার্স মা মোটরস্`;window.sendWhatsApp(l,r)})(),window.printReceiptEngine&&await window.printReceiptEngine(C.id,e),document.getElementById(`inv-subtotal`).value=``,document.getElementById(`inv-discount`).value=``,document.getElementById(`inv-paid`).value=``,document.getElementById(`inv-voucher`).value=``,document.getElementById(`inv-notes`).value=``,ao([{desc:``,qty:1,unit:`Pcs`,rate:0,total:0}]),Ao(document.getElementById(`view-container`))}catch(e){handleError(e,`ইনভয়েস সেভ করা যায়নি`)}finally{t.forEach(e=>e.disabled=!1)}}function _o(e,t=null,n={}){if(window.AppState?.currentUserRole===`Staff`&&window.AppState?.permissions?.viewInvoice===!1){e.innerHTML=`<div class="m3-card text-center font-bn py-12"><h2 class="text-xl font-black text-red-500">অ্যাক্সেস ডিনাইড!</h2></div>`;return}let r=oo();e.innerHTML=`
        <div class="max-w-6xl mx-auto flex flex-col gap-4 md:gap-5 pb-28 font-bn">
            <!-- Header Card -->
            <div class="m3-card bg-slate-900/80 border border-slate-800/80 p-3.5 md:p-4 rounded-2xl shadow-xl flex flex-col md:flex-row items-center justify-between gap-3">
                <div class="flex items-center gap-3">
                    <div class="w-10 h-10 rounded-xl bg-blue-600/10 border border-blue-500/20 text-blue-400 flex items-center justify-center text-lg shrink-0"><i class="fa-solid fa-file-invoice"></i></div>
                    <div><h1 class="text-lg md:text-xl font-black text-white tracking-tight">ভাউচার / ইনভয়েস জেনারেটর</h1><p class="text-[10px] text-slate-400 font-bold">কমান্ড সেন্টার বিলিং • অফলাইন প্রিন্ট সিস্টেম</p></div>
                </div>
                <div class="flex flex-wrap items-center gap-2 w-full md:w-auto justify-end">
                    <button type="button" class="h-9 px-3 rounded-xl bg-amber-500/10 border border-amber-500/30 hover:bg-amber-500/20 text-amber-400 font-bold text-xs transition-all flex items-center gap-1.5 cursor-pointer" onclick="window.holdCurrentBill && window.holdCurrentBill()"><i class="fa-solid fa-pause text-xs"></i><span>হোল্ড করুন</span>${r.length>0?`<span class="px-2 py-0.5 rounded-full bg-amber-500 text-slate-950 font-black text-[10px] ml-1 animate-pulse">${r.length}</span>`:``}</button>
                    <button type="button" class="h-9 px-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs shadow-md active:scale-95 transition-all cursor-pointer flex items-center gap-1.5" onclick="window.saveAndPrintInvoice('pos')"><i class="fa-solid fa-receipt text-xs"></i><span>POS মেমো</span></button>
                    <button type="button" class="h-9 px-3.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-black text-xs shadow-md active:scale-95 transition-all cursor-pointer flex items-center gap-1.5" onclick="window.saveAndPrintInvoice('a4')"><i class="fa-solid fa-print text-xs"></i><span>A4 ইনভয়েস</span></button>
                </div>
            </div>

            ${r.length>0?`<div class="m3-card bg-amber-500/10 border border-amber-500/30 p-3 rounded-2xl flex flex-col gap-2"><div class="text-xs font-black text-amber-400 uppercase tracking-widest flex items-center gap-2"><i class="fa-solid fa-clock-rotate-left"></i> হোল্ডকৃত ড্রাফট বিলসমূহ (${r.length} টি)</div><div class="flex flex-wrap gap-2">${r.map((e,t)=>`<button type="button" class="px-3 py-1.5 rounded-xl bg-slate-900 border border-amber-500/40 hover:border-amber-400 text-white text-xs font-bold flex items-center gap-2 cursor-pointer transition-all" onclick="window.resumeHoldBill(${t})"><span class="text-amber-400 font-black">${e.customerName}</span><span class="text-[10px] text-slate-400">(${e.time})</span><i class="fa-solid fa-play text-[10px] text-emerald-400"></i></button>`).join(``)}</div></div>`:``}

            <!-- Customer & Metadata Info -->
            <div class="grid grid-cols-1 lg:grid-cols-3 gap-4 relative z-30">
                <div class="m3-card bg-slate-900/90 border border-slate-800/80 p-3.5 md:p-4 rounded-2xl shadow-xl lg:col-span-2 flex flex-col gap-2.5 relative z-30">
                    <div class="flex justify-between items-center border-b border-slate-800/80 pb-2"><h2 class="text-xs font-black text-blue-400 uppercase tracking-widest flex items-center gap-2"><i class="fa-solid fa-user"></i> কাস্টমার তথ্য নির্বাচন</h2><button type="button" class="text-xs text-blue-400 font-bold hover:underline cursor-pointer" onclick="window.quickAddCustomerFromInvoice && window.quickAddCustomerFromInvoice()"><i class="fa-solid fa-user-plus text-[10px] mr-1"></i>+ নতুন কাস্টমার</button></div>
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-3 items-end">
                        <div class="relative z-40">
                            <label class="m3-label text-slate-400 mb-1.5 block text-xs font-bold">কাস্টমার খুঁজুন বা সিলেক্ট করুন *</label>
                            <div class="relative">
                                <i class="fa-solid fa-magnifying-glass absolute left-3 top-3 text-slate-500 text-xs pointer-events-none"></i>
                                <input type="text" id="inv-cust-search-input" class="w-full bg-slate-950/90 border border-slate-700/70 rounded-xl h-10 pl-9 pr-8 text-xs text-white font-bold outline-none focus:border-blue-500 shadow-inner transition-all" placeholder="নাম, ফোন বা অ্যাকাউন্ট নং টাইপ করুন..." oninput="window.filterInvoiceCustomerSearch(this.value)" onfocus="window.filterInvoiceCustomerSearch(this.value)">
                                <button type="button" id="inv-cust-search-clear" class="hidden absolute right-2.5 top-2.5 w-5 h-5 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white text-[10px] flex items-center justify-center cursor-pointer transition-all" onclick="window.clearInvoiceCustomerSearch()"><i class="fa-solid fa-xmark"></i></button>
                            </div>
                            <select id="inv-customer-select" class="hidden" onchange="window.invoiceCustomerChanged()"></select>
                            <!-- Searchable Dropdown Results -->
                            <div id="inv-cust-dropdown" class="hidden absolute left-0 right-0 top-full mt-1.5 bg-slate-900 border border-slate-700/90 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.9)] z-[999] max-h-64 overflow-y-auto custom-scrollbar p-1.5 flex flex-col gap-1 backdrop-blur-2xl"></div>
                        </div>
                        <div class="relative">
                            <label class="m3-label text-slate-400 mb-1.5 block text-xs font-bold opacity-0 hidden md:block">কাস্টমার প্রোফাইল</label>
                            <div id="inv-cust-display" class="p-2.5 bg-slate-950/60 border border-slate-800 rounded-xl text-xs text-slate-400 h-10 flex flex-col justify-center font-bold">সিলেক্ট করা হয়নি</div>
                        </div>
                    </div>
                </div>

                <div class="m3-card bg-slate-900/60 border border-slate-800/80 p-3.5 md:p-4 rounded-2xl shadow-xl flex flex-col gap-2.5">
                    <h2 class="text-xs font-black text-blue-400 uppercase tracking-widest border-b border-slate-800/80 pb-2 flex items-center gap-2"><i class="fa-solid fa-receipt"></i> ভাউচার মেটাডাটা</h2>
                    <div class="grid grid-cols-2 gap-2.5">
                        <div><label class="m3-label text-slate-400 mb-1 block text-xs font-bold">তারিখ *</label><input type="text" id="inv-date" class="w-full bg-slate-950/90 border border-slate-700/70 rounded-xl h-10 px-3 text-xs text-white datepicker cursor-pointer"></div>
                        <div><label class="m3-label text-slate-400 mb-1 block text-xs font-bold">মেমো নং (Voucher No)</label><input type="text" id="inv-voucher" class="w-full bg-slate-950/90 border border-slate-700/70 rounded-xl h-10 px-3 text-xs text-blue-400 font-bold outline-none" placeholder="মেমো নং..."></div>
                    </div>
                </div>
            </div>

            <!-- Items Table Card -->
            <div class="m3-card bg-slate-900/60 border border-slate-800/80 p-3.5 md:p-4 rounded-2xl shadow-xl flex flex-col gap-3">
                <div class="flex justify-between items-center border-b border-slate-800/80 pb-2"><h2 class="text-xs font-black text-blue-400 uppercase tracking-widest flex items-center gap-2"><i class="fa-solid fa-list-check"></i> বিক্রয়কৃত আইটেম লিস্ট</h2><button type="button" class="h-8 px-3 rounded-xl bg-emerald-600/20 text-emerald-400 border border-emerald-500/30 hover:bg-emerald-600 hover:text-white text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer" onclick="window.addInvoiceItemRow()"><i class="fa-solid fa-plus text-xs"></i><span>+ লাইন যোগ করুন</span></button></div>
                <div class="m3-table-container overflow-x-auto rounded-xl border border-slate-800">
                    <table class="m3-table w-full min-w-[650px]">
                        <thead>
                            <tr class="text-xs font-black text-slate-400 bg-slate-950/80 border-b border-slate-800">
                                <th class="w-10 text-center py-3 px-2">#</th>
                                <th class="text-left py-3 px-2 min-w-[240px]">আইটেমের বিবরণ (ITEM DETAILS)</th>
                                <th class="w-28 text-center py-3 px-2">একক (UNIT)</th>
                                <th class="w-28 text-center py-3 px-2">পরিমাণ (QTY)</th>
                                <th class="w-36 text-center py-3 px-2">রেট (RATE ৳)</th>
                                <th class="w-40 text-right py-3 px-2">মোট (TOTAL ৳)</th>
                                <th class="w-12 text-center py-3 px-1"></th>
                            </tr>
                        </thead>
                        <tbody id="inv-items-tbody"></tbody>
                    </table>
                </div>
            </div>

            <!-- Notes & Summary Grid -->
            <div class="grid grid-cols-1 lg:grid-cols-2 gap-4 items-stretch">
                <div class="m3-card bg-slate-900/60 border border-slate-800/80 p-3.5 md:p-4 rounded-2xl shadow-xl flex flex-col gap-2">
                    <label class="text-xs font-black text-slate-400 uppercase tracking-widest flex items-center gap-2"><i class="fa-solid fa-note-sticky text-amber-400"></i> নোট / শর্তাবলী (NOTES)</label>
                    <textarea id="inv-notes" class="w-full bg-slate-950/80 border border-slate-700/70 rounded-xl p-3 text-xs text-slate-200 outline-none focus:border-blue-500 min-h-[140px] flex-grow resize-none" placeholder="ভাউচার নোট বা ম্যানুয়াল শর্তাদি লিখুন..."></textarea>
                </div>

                <div class="m3-card bg-slate-900/80 border border-slate-800/90 p-4 md:p-5 rounded-2xl shadow-xl flex flex-col gap-3 font-bn">
                    <div class="flex items-center justify-between"><span class="text-xs font-bold text-slate-400">সাব-টোটাল (Subtotal):</span><div class="text-right"><input type="text" id="inv-subtotal" class="w-36 bg-slate-950/90 border border-slate-700/60 rounded-xl h-9 px-3 text-right text-xs font-black text-white outline-none" readonly onkeyup="window.handleNumberInput(this); window.calcInvoiceTotals(); window.updateLiveWords(this, 'inv-sub-words');"><div id="inv-sub-words" class="text-[10px] text-blue-400 hidden italic mt-0.5"></div></div></div>
                    <div class="flex items-center justify-between"><span class="text-xs font-bold text-orange-400">ডিসকাউন্ট (Discount):</span><div class="text-right"><div class="flex bg-slate-950/90 rounded-xl border border-orange-500/30 overflow-hidden h-9"><input type="text" id="inv-discount" class="w-24 bg-transparent text-right text-orange-400 font-bold px-3 text-xs outline-none" placeholder="০" onkeyup="window.handleNumberInput(this); window.calcInvoiceTotals(); window.updateLiveWords(this, 'inv-disc-words');"><button type="button" id="inv-disc-mode-btn" class="px-3 bg-orange-500/20 text-orange-400 border-l border-orange-500/30 text-xs font-black cursor-pointer" onclick="window.toggleInvoiceDiscMode()" data-mode="fixed">৳</button></div><div id="inv-disc-words" class="text-[10px] text-orange-400 hidden italic mt-0.5"></div></div></div>
                    <div class="flex items-center justify-between border-b border-slate-800/80 pb-2.5"><span class="text-xs font-bold text-slate-400">পূর্বের বকেয়া (Prev Due):</span><input type="text" id="inv-prev-due" class="w-36 bg-slate-950/60 border border-slate-800 rounded-xl h-9 px-3 text-right text-xs font-bold text-slate-400 outline-none" readonly></div>
                    <div class="flex items-center justify-between p-3 rounded-xl bg-slate-950/80 border border-blue-500/30"><span class="text-xs md:text-sm font-black text-white">সর্বমোট পাওনা (Grand Total):</span><div class="text-right"><div class="text-lg md:text-xl font-black text-blue-400" id="inv-net-total-display">৳ 0</div><div id="inv-net-words" class="text-[10px] text-blue-400 italic"></div></div></div>

                    <div class="flex flex-col gap-2 p-2.5 bg-slate-950/60 rounded-xl border border-slate-800">
                        <span class="text-[10px] font-black text-slate-400 uppercase tracking-wider">ক্যাশ পরিশোধ শর্টকাট (Quick Tender)</span>
                        <div class="flex flex-wrap gap-1.5">
                            <button type="button" class="px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-blue-600 text-slate-300 hover:text-white text-xs font-bold active:scale-95 transition-all cursor-pointer" onclick="window.setInvoiceTender(500)">৳ ৫০০</button>
                            <button type="button" class="px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-blue-600 text-slate-300 hover:text-white text-xs font-bold active:scale-95 transition-all cursor-pointer" onclick="window.setInvoiceTender(1000)">৳ ১,০০০</button>
                            <button type="button" class="px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-blue-600 text-slate-300 hover:text-white text-xs font-bold active:scale-95 transition-all cursor-pointer" onclick="window.setInvoiceTender(2000)">৳ ২,০০০</button>
                            <button type="button" class="px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-blue-600 text-slate-300 hover:text-white text-xs font-bold active:scale-95 transition-all cursor-pointer" onclick="window.setInvoiceTender(5000)">৳ ৫,০০০</button>
                            <button type="button" class="px-2.5 py-1.5 rounded-lg bg-emerald-600/20 text-emerald-400 border border-emerald-500/30 hover:bg-emerald-600 hover:text-white text-xs font-bold active:scale-95 transition-all cursor-pointer" onclick="window.setInvoiceTender('exact')">একজ্যাক্ট</button>
                        </div>
                        <div id="inv-change-return-box" class="hidden text-xs font-black text-emerald-400 pt-1 border-t border-slate-800 flex justify-between"><span>কাস্টমারকে ফেরত (Change):</span><span id="inv-change-return-display">৳ ০</span></div>
                    </div>

                    <div class="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex flex-col gap-2">
                        <div class="flex items-center justify-between"><span class="text-xs font-black text-emerald-400">নগদ/ব্যাংক জমা (Paid):</span><input type="text" id="inv-paid" class="w-36 bg-slate-950/90 border border-emerald-500/40 rounded-xl h-9 px-3 text-right text-sm font-black text-emerald-400 outline-none focus:border-emerald-500" placeholder="০.০০" onkeyup="window.handleNumberInput(this); window.calcInvoiceTotals(); window.toggleInvoiceRecvSection(); window.updateLiveWords(this, 'inv-paid-words');"></div>
                        <div id="inv-paid-words" class="text-right text-[10px] text-emerald-400 italic"></div>
                        <div id="inv-recv-section" class="hidden flex flex-col gap-2 pt-2 border-t border-emerald-500/20"><div class="flex items-center justify-between"><span class="text-[11px] text-slate-400 font-bold">পেমেন্ট মাধ্যম:</span><div class="flex bg-slate-950 p-0.5 rounded-lg border border-slate-700 text-xs"><button type="button" id="inv-recv-cash-btn" class="px-3 py-1 rounded-md bg-emerald-600 text-white font-bold" onclick="window.setInvoiceRecvType('Cash')">Cash</button><button type="button" id="inv-recv-bank-btn" class="px-3 py-1 rounded-md text-slate-400 font-bold" onclick="window.setInvoiceRecvType('Bank')">Bank</button></div></div><input id="inv-received-from" class="w-full bg-slate-950/90 border border-slate-700/60 rounded-xl h-8 px-3 text-xs text-white outline-none" placeholder="ব্যাংকের নাম বা মন্তব্য (ঐচ্ছিক)..."></div>
                    </div>

                    <div class="flex items-center justify-between p-3 rounded-xl bg-red-500/10 border border-red-500/30">
                        <span class="text-xs font-black text-red-400">বর্তমান নিট বকেয়া (Net Due):</span>
                        <div class="text-right"><div class="text-lg md:text-xl font-black text-red-400" id="inv-current-due-display">৳ 0</div><div id="inv-due-words" class="text-[10px] text-red-400 italic"></div></div>
                    </div>
                </div>
            </div>

            <!-- Sticky Bottom Bar -->
            <div class="bg-slate-900/95 border border-blue-500/30 rounded-2xl p-3 md:p-3.5 sticky bottom-4 z-20 shadow-[0_-10px_25px_rgba(0,0,0,0.6)] flex flex-wrap items-center justify-between gap-3 backdrop-blur-xl">
                <div class="text-xs font-bold text-slate-300 flex items-center gap-2"><span class="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span><span>ইনভয়েস সেভ ও অফলাইন প্রিন্ট কমান্ড:</span></div>
                <div class="flex items-center gap-2">
                    <button type="button" class="h-9 md:h-10 px-4 md:px-5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs shadow-md active:scale-95 transition-all cursor-pointer flex items-center gap-1.5" onclick="window.saveAndPrintInvoice('pos')"><i class="fa-solid fa-receipt text-xs"></i><span>POS সেভ ও প্রিন্ট</span></button>
                    <button type="button" class="h-9 md:h-10 px-4 md:px-5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-black text-xs shadow-md active:scale-95 transition-all cursor-pointer flex items-center gap-1.5" onclick="window.saveAndPrintInvoice('a4')"><i class="fa-solid fa-print text-xs"></i><span>A4 সেভ ও প্রিন্ট</span></button>
                </div>
            </div>
        </div>
    `,document.getElementById(`inv-date`).value=R(),ao([{desc:``,qty:1,unit:`Pcs`,rate:0,total:0}]),n.loadInvoiceCustomers&&n.loadInvoiceCustomers(t?.customerId),n.renderInvoiceItems&&n.renderInvoiceItems()}function vo(){let e=document.getElementById(`inv-items-tbody`),t=io();if(e){if(t.length===0){e.innerHTML=`<tr><td colspan="7" class="text-center py-6 text-slate-500 italic font-bold">কোনো আইটেম নেই</td></tr>`;return}e.innerHTML=t.map((e,t)=>`
        <tr class="border-b border-slate-800/60 hover:bg-white/[0.02] transition-colors">
            <td class="w-10 text-center text-slate-400 font-bold text-xs py-2.5 px-2">${t+1}</td>
            <td class="py-2.5 px-2">
                <input type="text" class="w-full bg-slate-950/90 border border-slate-700/70 rounded-xl px-3.5 h-10 text-xs text-white font-bold outline-none focus:border-blue-500 transition-all shadow-inner" placeholder="আইটেমের নাম / বিবরণ লিখুন..." value="${e.desc}" oninput="window.updateInvoiceItem(${t}, 'desc', this)">
                <div id="price-hint-${t}" class="hidden mt-1"></div>
                <div id="item-live-words-${t}" class="${e.total>0?``:`hidden`} text-[10px] text-blue-400 font-bold italic mt-1 flex items-center gap-1"><i class="fa-solid fa-coins text-[9px] text-amber-400"></i><span>${e.total>0?V(e.total):``}</span></div>
            </td>
            <td class="w-28 py-2.5 px-2">
                <select class="w-full bg-slate-950/90 border border-slate-700/70 rounded-xl px-2.5 h-10 text-xs text-slate-200 font-bold outline-none cursor-pointer focus:border-blue-500 transition-all shadow-inner" onchange="window.updateInvoiceItem(${t}, 'unit', this)">
                    <option value="Pcs" ${e.unit===`Pcs`?`selected`:``}>Pcs</option>
                    <option value="Ltr" ${e.unit===`Ltr`?`selected`:``}>Ltr</option>
                    <option value="Set" ${e.unit===`Set`?`selected`:``}>Set</option>
                    <option value="Kg" ${e.unit===`Kg`?`selected`:``}>Kg</option>
                    <option value="Box" ${e.unit===`Box`?`selected`:``}>Box</option>
                    <option value="Ft" ${e.unit===`Ft`?`selected`:``}>Ft</option>
                </select>
            </td>
            <td class="w-28 py-2.5 px-2">
                <input type="text" class="w-full text-center bg-slate-950/90 border border-slate-700/70 rounded-xl px-2 h-10 text-xs text-white font-bold outline-none focus:border-blue-500 transition-all shadow-inner" value="${e.qty||``}" placeholder="১" onkeyup="window.handleNumberInput(this); window.updateInvoiceItem(${t}, 'qty', this);">
            </td>
            <td class="w-36 py-2.5 px-2">
                <input type="text" id="inv-item-rate-${t}" class="w-full text-center bg-slate-950/90 border border-slate-700/70 rounded-xl px-2 h-10 text-xs text-white font-bold outline-none focus:border-blue-500 transition-all shadow-inner" value="${e.rate?F(e.rate):``}" placeholder="০" onkeyup="window.handleNumberInput(this); window.updateInvoiceItem(${t}, 'rate', this);" onkeydown="if(event.key==='Enter'){ event.preventDefault(); window.addInvoiceItemRow(); }">
            </td>
            <td class="w-40 py-2.5 px-2">
                <input type="text" id="inv-item-total-${t}" class="w-full text-right font-black text-blue-400 bg-slate-950/60 border border-slate-800 rounded-xl px-3 h-10 text-xs outline-none shadow-inner" value="${e.total?F(e.total):``}" placeholder="০" readonly>
            </td>
            <td class="w-12 text-center py-2.5 px-1">
                <button type="button" class="w-8 h-8 rounded-xl bg-slate-900 border border-slate-800 hover:bg-red-500/20 text-slate-500 hover:text-red-400 flex items-center justify-center transition-all cursor-pointer mx-auto" onclick="window.removeInvoiceItem(${t})" title="লাইন ডিলিট"><i class="fa-solid fa-trash-can text-xs"></i></button>
            </td>
        </tr>`).join(``)}}function yo(e,t){let n=document.getElementById(`inv-change-return-box`),r=document.getElementById(`inv-change-return-display`);!n||!r||(e>t&&t>0?(r.innerText=`৳ ${F(e-t)}`,n.classList.remove(`hidden`)):n.classList.add(`hidden`))}function bo(){let e=0;io().forEach(t=>{e+=t.total||0});let t=document.getElementById(`inv-subtotal`);t&&(t.value=F(e),xo())}function xo(){let e=I(document.getElementById(`inv-subtotal`)?.value||`0`),t=I(document.getElementById(`inv-discount`)?.value||`0`),n=I(document.getElementById(`inv-prev-due`)?.value||`0`),r=I(document.getElementById(`inv-paid`)?.value||`0`),i=(document.getElementById(`inv-disc-mode-btn`)?.dataset.mode||`fixed`)===`percent`?L(e*t/100):t,a=L(Math.max(0,e-i)+n),o=L(a-r),s=(e,t)=>{let n=document.getElementById(e);n&&(t>0?(n.innerText=`(${V(t)})`,n.classList.remove(`hidden`)):n.classList.add(`hidden`))};s(`inv-sub-words`,e),s(`inv-disc-words`,i),s(`inv-net-words`,a),s(`inv-paid-words`,r),s(`inv-due-words`,Math.abs(o));let c=document.getElementById(`inv-net-total-display`);c&&(c.innerText=`৳ `+F(a));let l=document.getElementById(`inv-current-due-display`);l&&(l.innerText=`৳ `+F(Math.abs(o))+(o<0?` (Adv)`:``),l.className=o>0?`text-xl font-black text-red-400`:o<0?`text-xl font-black text-emerald-400`:`text-xl font-black text-slate-300`),yo(r,a)}async function So(e=null){let t=J();t.length||(Y(),t=await a.getAll(`name`,`asc`));let n=document.getElementById(`inv-customer-select`);n&&(n.innerHTML=`<option value="">-- সিলেক্ট করুন --</option>`+t.map(e=>{let t=e.accountNo?`[${e.accountNo}] `:``;return`<option value="${e.id}" data-due="${e.totalDue||0}" data-phone="${e.phone||``}" data-address="${e.address||``}" data-name="${e.name}" data-acc="${e.accountNo||``}">${t}${e.name}</option>`}).join(``),e&&wo(e))}function Co(e=``){Vn(e,{inputId:`inv-cust-search-input`,selectId:`inv-customer-select`,dropdownId:`inv-cust-dropdown`,onSelect:e=>wo(e)})}function wo(e){let t=document.getElementById(`inv-customer-select`),n=document.getElementById(`inv-cust-search-input`),r=document.getElementById(`inv-cust-search-clear`),i=document.getElementById(`inv-cust-dropdown`);if(t&&(t.value=e,Eo()),t&&t.selectedIndex>0){let e=t.options[t.selectedIndex];n&&(n.value=`${e.dataset.name} ${e.dataset.acc?`[`+e.dataset.acc+`]`:``}`),r&&r.classList.remove(`hidden`)}i&&i.classList.add(`hidden`)}function To(){let e=document.getElementById(`inv-customer-select`),t=document.getElementById(`inv-cust-search-input`),n=document.getElementById(`inv-cust-search-clear`),r=document.getElementById(`inv-cust-dropdown`);e&&(e.value=``,Eo()),t&&(t.value=``),n&&n.classList.add(`hidden`),r&&r.classList.add(`hidden`)}function Eo(){let e=document.getElementById(`inv-customer-select`),t=document.getElementById(`inv-cust-display`),n=document.getElementById(`inv-prev-due`);if(e&&e.selectedIndex>0){let r=e.options[e.selectedIndex],i=Number(r.dataset.due)||0,a=i>0?`<span class="text-red-400 font-black">বকেয়া: ৳${F(i)}</span>`:`<span class="text-emerald-400 font-bold">পরিশোধিত</span>`;t.innerHTML=`
            <div class="flex justify-between items-center"><div class="font-black text-white">${r.dataset.name} <span class="text-blue-400 text-[11px] font-bold">(${r.dataset.acc||`-`})</span></div>${a}</div>
            <div class="text-[11px] text-slate-400 font-bold mt-0.5"><i class="fa-solid fa-phone text-[9px] mr-1"></i>${r.dataset.phone||`-`} • ${r.dataset.address||`-`}</div>`,n.value=F(i)}else t.innerText=`সিলেক্ট করা হয়নি`,n&&(n.value=``);xo()}function Do(){let e=document.getElementById(`inv-disc-mode-btn`);e&&(e.dataset.mode=e.dataset.mode===`fixed`?`percent`:`fixed`,e.innerText=e.dataset.mode===`fixed`?`৳`:`%`,xo())}function Oo(){let e=I(document.getElementById(`inv-paid`)?.value||`0`);document.getElementById(`inv-recv-section`)?.classList.toggle(`hidden`,e<=0)}function ko(e){let t=document.getElementById(`inv-recv-bank-btn`),n=document.getElementById(`inv-recv-cash-btn`);t&&n&&(e===`Bank`?(t.className=`px-3 py-1 rounded-md bg-blue-600 text-white font-bold`,n.className=`px-3 py-1 rounded-md text-slate-400 font-bold`):(n.className=`px-3 py-1 rounded-md bg-emerald-600 text-white font-bold`,t.className=`px-3 py-1 rounded-md text-slate-400 font-bold`))}function Ao(e,t=null){_o(e,t,{loadInvoiceCustomers:So,renderInvoiceItems:vo})}typeof window<`u`&&(window.renderInvoiceItems=vo,window.calcItemTotals=bo,window.calcInvoiceTotals=xo,window.loadInvoiceCustomers=So,window.filterInvoiceCustomerSearch=Co,window.selectInvoiceCustomer=wo,window.clearInvoiceCustomerSearch=To,window.invoiceCustomerChanged=Eo,window.toggleInvoiceDiscMode=Do,window.toggleInvoiceRecvSection=Oo,window.setInvoiceRecvType=ko),document.addEventListener(`click`,e=>{let t=document.getElementById(`inv-cust-dropdown`),n=document.getElementById(`inv-cust-search-input`);t&&!t.contains(e.target)&&e.target!==n&&t.classList.add(`hidden`)}),window.addInvoiceItemRow=so,window.removeInvoiceItem=co,window.updateInvoiceItem=lo,window.applyHistoryPrice=fo,window.saveAndPrintInvoice=go,window.setInvoiceTender=po,window.holdCurrentBill=mo,window.resumeHoldBill=ho,window.invoiceCustomerChanged=Eo,window.toggleInvoiceDiscMode=Do,window.toggleInvoiceRecvSection=Oo,window.setInvoiceRecvType=ko,window.quickAddCustomerFromInvoice=async()=>{window.quickAddCustomer&&(await window.quickAddCustomer(),await So())};var Q={zones:[],customers:[],selectedZone:``,selectedStatus:`all`,selectedSort:`due_desc`};function jo(){return Q}function Mo(e){Q.selectedZone=e}function No(e){Q.selectedStatus=e}function Po(e){Q.selectedSort=e}async function Fo(){try{let[e,t]=await Promise.all([v.getAllZones(),a.getAll(`name`,`asc`)]);return Q.zones=e||[],Q.customers=t||[],Q}catch(e){return console.error(`Error loading zone report data:`,e),Q}}async function Io(e=``){let{customers:t}=Q,n=e||Q.selectedZone,r=t.filter(e=>!n||(e.zone||``).trim()===n);if(r.length===0)return H.default.fire(`তালিকায় কোনো কাস্টমার নেই`,`সিলেক্ট করা জোনে কোনো কাস্টমার পাওয়া যায়নি।`,`warning`);r.sort((e,t)=>(e.accountNo||``).localeCompare(t.accountNo||``,void 0,{numeric:!0}));let i=await g.getAppSettings(),a=n?`${n} জোনের কাস্টমার বকেয়া খতিয়ান`:`সকল জোনের কাস্টমার বকেয়া খতিয়ান`,o=0;r.forEach(e=>o=L(o+(Number(e.totalDue)||0)));let[s,c,l]=R().split(`-`),u=`${l}/${c}/${s}`,d=Ve(i,{title:n?`${n} ZONE REPORT`:`ZONE REPORT`,subtitle:`${a} • ${u}`}),f=`
        <div style="display:flex; justify-content:space-between; align-items:flex-end; border-bottom:2px solid #0284c7; padding-bottom:4px; margin-bottom:8px;">
            <div style="font-size:14px; font-weight:900; color:#0f172a; font-family:'Inter',sans-serif;">ZONE REPORT <span style="font-size:10px; color:#475569; font-weight:normal;">(Continued)</span></div>
            <div style="font-size:10px; color:#475569; font-family:'Hind Siliguri',sans-serif;">${a} • ${u}</div>
        </div>
    `;et(await Ze({rowsArray:r.map((e,t)=>{let n=t%2==0?`background: #ffffff;`:`background: #f8fafc;`,r=Number(e.totalDue)||0,i=r>0?`#dc2626`:r<0?`#059669`:`#64748b`,a=r===0?`৳ 0`:`৳ ${F(Math.abs(r))} ${r<0?`(Adv)`:``}`,o=e.zone?`<span style="background: #f1f5f9; border: 1px solid #cbd5e1; padding: 2px 7px; border-radius: 10px; font-size: 10px; font-weight: 700; color: #334155; display: inline-block;">${P(e.zone)}</span>`:`-`;return{html:`
            <tr class="print-row-no-break" style="${n}">
                <td style="text-align:center; vertical-align:middle; border: 1px solid #e2e8f0; padding: 5px 4px; font-size: 11px; font-family: 'Inter', sans-serif; color: #475569;">${t+1}</td>
                <td style="text-align:center; vertical-align:middle; border: 1px solid #e2e8f0; padding: 5px 4px; font-size: 11px; font-weight: 800; font-family: 'Inter', monospace; color: #0284c7;">${P(e.accountNo||`-`)}</td>
                <td style="text-align:left; vertical-align:middle; border: 1px solid #e2e8f0; padding: 5px 6px; font-size: 11px; font-family: 'Kalpurush', 'Hind Siliguri', sans-serif; line-height: 1.25; color: #0f172a;"><strong>${P(e.name)}</strong></td>
                <td style="text-align:left; vertical-align:middle; border: 1px solid #e2e8f0; padding: 5px 6px; font-size: 10.5px; font-family: 'Kalpurush', 'Hind Siliguri', sans-serif; line-height: 1.25; color: #334155;">${P(e.address||`-`)}</td>
                <td style="text-align:center; vertical-align:middle; border: 1px solid #e2e8f0; padding: 5px 4px; font-size: 11px; font-family: 'Inter', sans-serif; white-space: nowrap; color: #334155;">${P(e.phone||`-`)}</td>
                <td style="text-align:center; vertical-align:middle; border: 1px solid #e2e8f0; padding: 5px 4px; font-size: 11px; font-family: 'Kalpurush', 'Hind Siliguri', sans-serif;">${o}</td>
                <td style="text-align:right; vertical-align:middle; border: 1px solid #e2e8f0; padding: 5px 6px; font-size: 11px; font-weight: 900; color: ${i}; font-family: 'Inter', sans-serif; white-space: nowrap;">${a}</td>
            </tr>
        `,textLength:(e.address||``).length}}),page1HeaderHtml:d,repeatHeaderHtml:f,tableColHeaderHtml:`
        <thead>
            <tr style="background: #f1f5f9; border-bottom: 2px solid #cbd5e1;">
                <th style="text-align: center; border: 1px solid #cbd5e1; padding: 7px 4px; font-size: 11px; font-weight: 900; color: #1e293b; font-family: 'Hind Siliguri', sans-serif;">SL</th>
                <th style="text-align: center; border: 1px solid #cbd5e1; padding: 7px 4px; font-size: 11px; font-weight: 900; color: #1e293b; font-family: 'Hind Siliguri', sans-serif;">A/C NO</th>
                <th style="text-align: left; border: 1px solid #cbd5e1; padding: 7px 6px; font-size: 11px; font-weight: 900; color: #1e293b; font-family: 'Hind Siliguri', sans-serif;">কাস্টমারের নাম</th>
                <th style="text-align: left; border: 1px solid #cbd5e1; padding: 7px 6px; font-size: 11px; font-weight: 900; color: #1e293b; font-family: 'Hind Siliguri', sans-serif;">ঠিকানা</th>
                <th style="text-align: center; border: 1px solid #cbd5e1; padding: 7px 4px; font-size: 11px; font-weight: 900; color: #1e293b; font-family: 'Hind Siliguri', sans-serif;">মোবাইল নম্বর</th>
                <th style="text-align: center; border: 1px solid #cbd5e1; padding: 7px 4px; font-size: 11px; font-weight: 900; color: #1e293b; font-family: 'Hind Siliguri', sans-serif;">জোন</th>
                <th style="text-align: right; border: 1px solid #cbd5e1; padding: 7px 6px; font-size: 11px; font-weight: 900; color: #1e293b; font-family: 'Hind Siliguri', sans-serif;">ব্যালেন্স (৳)</th>
            </tr>
        </thead>
    `,summaryHtml:`
        <div style="display: flex; justify-content: flex-end; margin-top: 16px; page-break-inside: avoid; break-inside: avoid;">
            <div style="min-width: 240px; background: #f8fafc; border: 1px solid #cbd5e1; border-radius: 10px; padding: 12px; font-family: 'Hind Siliguri', sans-serif; box-shadow: 0 1px 3px rgba(0,0,0,0.05);">
                <div style="display: flex; justify-content: space-between; font-size: 12px; margin-bottom: 6px; border-bottom: 1px dashed #cbd5e1; padding-bottom: 4px;">
                    <span style="color: #64748b; font-weight: 700;">মোট কাস্টমার:</span>
                    <strong style="color: #0f172a; font-weight: 900;">${r.length} জন</strong>
                </div>
                <div style="display: flex; justify-content: space-between; font-size: 12px;">
                    <span style="color: #64748b; font-weight: 700;">মার্কেটে মোট বকেয়া:</span>
                    <strong style="color: #dc2626; font-size: 15px; font-weight: 900;">৳ ${F(o)}</strong>
                </div>
            </div>
        </div>
    `,signatureHtml:`
        <div class="signature-last-page-block" style="margin-top: 45px; page-break-inside: avoid; break-inside: avoid;">
            <div style="display: flex; justify-content: space-between; padding: 0 30px;">
                <div style="border-top: 1.5px dashed #64748b; width: 160px; text-align: center; font-size: 11px; font-weight: 700; color: #334155; padding-top: 6px;">
                    কাস্টমারের স্বাক্ষর<br><span style="font-size: 9px; font-weight: normal; color: #64748b;">Customer Signature</span>
                </div>
                <div style="border-top: 1.5px dashed #64748b; width: 160px; text-align: center; font-size: 11px; font-weight: 700; color: #334155; padding-top: 6px;">
                    কর্তৃপক্ষের স্বাক্ষর<br><span style="font-size: 9px; font-weight: normal; color: #64748b;">Authorized Signature</span>
                </div>
            </div>
        </div>
    `,formattedDate:u}))}async function Lo(e=``){let{customers:t}=Q,n=e||Q.selectedZone,r=t.filter(e=>!n||(e.zone||``).trim()===n);if(r.length===0)return H.default.fire(`এরর`,`এক্সপোর্ট করার মতো কোনো কাস্টমার নেই।`,`warning`);if(typeof XLSX>`u`)return H.default.fire(`Error`,`SheetJS Library missing!`,`error`);r.sort((e,t)=>(e.accountNo||``).localeCompare(t.accountNo||``,void 0,{numeric:!0}));let i=r.map((e,t)=>({SL:t+1,"Account No":e.accountNo||``,"Customer Name":e.name||``,"Phone Number":e.phone||``,Zone:e.zone||``,Address:e.address||``,"Due Balance (BDT)":e.totalDue||0})),a=XLSX.utils.json_to_sheet(i),o=XLSX.utils.book_new(),s=n?`${n} Zone`:`All Zones`;XLSX.utils.book_append_sheet(o,a,s);let c=n?`MAA_ERP_Zone_${n}_${R()}.xlsx`:`MAA_ERP_All_Zones_${R()}.xlsx`;XLSX.writeFile(o,c),H.default.fire({title:`<i class="fa-solid fa-file-excel text-emerald-400 mr-2"></i>ডাউনলোড সফল!`,text:`কাস্টমার জোন রিপোর্ট ফাইল (${c}) ডাউনলোড করা হয়েছে।`,icon:`success`,customClass:{popup:`!bg-slate-900 !text-white !rounded-3xl border border-slate-700 font-bn`}})}async function Ro(e=``){let{printZoneTagadaReport:t}=await D(async()=>{let{printZoneTagadaReport:e}=await import(`./zone-report-tagada-67xaGERw.js`);return{printZoneTagadaReport:e}},__vite__mapDeps([9,1,0,2,3,4,6,7]));return t(e?{...Q,selectedZone:e}:Q)}function zo(e){return!e||e.length===0?`<tr><td colspan="8" class="text-center py-12 text-slate-500 font-bold italic">কোনো কাস্টমার ডাটা পাওয়া যায়নি</td></tr>`:e.map((e,t)=>`
        <tr class="hover:bg-slate-800/40 transition-colors">
            <td class="p-3.5 text-center font-mono text-slate-400">${t+1}</td>
            <td class="p-3.5 text-center font-mono font-bold text-amber-400">${P(e.accountNo||`-`)}</td>
            <td class="p-3.5 font-bold text-white">${P(e.name)}</td>
            <td class="p-3.5 text-slate-300 text-xs">${P(e.address||`-`)}</td>
            <td class="p-3.5 text-center font-mono text-slate-300">${P(e.phone||`-`)}</td>
            <td class="p-3.5 text-center"><span class="px-2.5 py-1 rounded-md text-[11px] font-bold bg-slate-800 text-indigo-300 border border-slate-700">${P(e.zone||`N/A`)}</span></td>
            <td class="p-3.5 text-right font-black ${e.totalDue>0?`text-emerald-400`:e.totalDue<0?`text-rose-400`:`text-slate-400`}">৳ ${F(e.totalDue||0)}</td>
            <td class="p-3.5 text-center">
                <button onclick="if(window.navigateTo) window.navigateTo('ledger', { customerId: '${e.id}' })" class="px-3 py-1.5 rounded-lg bg-indigo-600/20 hover:bg-indigo-600 text-indigo-300 hover:text-white text-xs font-bold transition-all border border-indigo-500/30 cursor-pointer">লেজার</button>
            </td>
        </tr>
    `).join(``)}async function Bo(e){e.innerHTML=`
        <div class="flex flex-col gap-6 pb-28 font-bn max-w-7xl mx-auto">
            <!-- Header Bar -->
            <div class="flex flex-col lg:flex-row lg:items-center justify-between gap-4 px-1">
                <div class="flex items-center gap-3.5">
                    <div class="w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-500 to-blue-600 flex items-center justify-center shadow-lg shadow-indigo-500/30 shrink-0 border border-indigo-400/30">
                        <i class="fa-solid fa-map-location-dot text-white text-xl"></i>
                    </div>
                    <div>
                        <h2 class="text-xl sm:text-2xl font-black text-white tracking-tight flex items-center gap-2">
                            জোন সিলেক্ট কাস্টমার রিপোর্ট <span class="text-xs text-indigo-400 font-bold uppercase tracking-widest bg-indigo-500/10 px-2 py-0.5 rounded-md border border-indigo-500/20">(Zone Select List)</span>
                        </h2>
                        <p class="text-xs font-bold text-slate-400 mt-0.5">ফায়ারবেস থেকে লাইভ জোন ও কাস্টমারদের ফিল্টারকৃত স্মার্ট তালিকা এবং তাগাদা শিট জেনারেটর</p>
                    </div>
                </div>

                <div class="flex flex-wrap items-center gap-2.5">
                    <button class="h-10 px-3.5 rounded-xl bg-slate-800/90 border border-slate-700/80 hover:bg-slate-700 text-slate-200 text-xs font-bold transition-all cursor-pointer flex items-center gap-2 active:scale-95 shadow-sm" onclick="window.zoneReportApp.refreshData()">
                        <i class="fa-solid fa-rotate text-xs text-indigo-400"></i><span>রিফ্রেশ ডাটা</span>
                    </button>
                    <button class="h-10 px-4 rounded-xl bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-500 hover:to-blue-500 text-white text-xs font-black shadow-lg shadow-indigo-600/25 transition-all cursor-pointer flex items-center gap-2 active:scale-95 border border-indigo-400/30" onclick="window.zoneReportApp.printPDF()">
                        <i class="fa-solid fa-file-pdf text-xs"></i><span>PDF ও প্রিন্ট ভিউ</span>
                    </button>
                    <button class="h-10 px-4 rounded-xl bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 text-white text-xs font-black shadow-lg shadow-amber-600/25 transition-all cursor-pointer flex items-center gap-2 active:scale-95 border border-amber-400/30" onclick="window.zoneReportApp.printTagada()" title="মাঠপর্যায়ে তাগাদা ও আদায়ের বিশেষ প্রিন্ট ক্যাটালগ">
                        <i class="fa-solid fa-clipboard-check text-xs"></i><span>তাগাদা শিট (Print)</span>
                    </button>
                    <button class="h-10 px-4 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-black shadow-lg shadow-emerald-600/25 transition-all cursor-pointer flex items-center gap-2 active:scale-95 border border-emerald-400/30" onclick="window.zoneReportApp.exportExcel()">
                        <i class="fa-solid fa-file-excel text-xs"></i><span>এক্সেল ডাউনলোড</span>
                    </button>
                </div>
            </div>

            <!-- KPI Summary Bar -->
            <div class="grid grid-cols-1 sm:grid-cols-3 gap-4" id="zone-report-kpis">
                <div class="relative overflow-hidden rounded-2xl bg-slate-900/80 border border-slate-800 p-4 shadow-xl backdrop-blur-xl group hover:border-indigo-500/40 transition-all">
                    <div class="flex items-center justify-between">
                        <div class="flex items-center gap-3.5">
                            <div class="w-12 h-12 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 shrink-0 shadow-inner">
                                <i class="fa-solid fa-layer-group text-xl"></i>
                            </div>
                            <div>
                                <div class="text-2xl font-black text-white tracking-tight" id="zr-kpi-total-zones">-</div>
                                <div class="text-xs text-slate-400 font-bold">মোট নিবন্ধিত জোন</div>
                            </div>
                        </div>
                        <span class="text-[10px] font-black uppercase tracking-wider px-2 py-1 bg-indigo-500/10 text-indigo-400 rounded-lg border border-indigo-500/20">Active</span>
                    </div>
                </div>

                <div class="relative overflow-hidden rounded-2xl bg-slate-900/80 border border-slate-800 p-4 shadow-xl backdrop-blur-xl group hover:border-cyan-500/40 transition-all">
                    <div class="flex items-center justify-between">
                        <div class="flex items-center gap-3.5">
                            <div class="w-12 h-12 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400 shrink-0 shadow-inner">
                                <i class="fa-solid fa-users text-xl"></i>
                            </div>
                            <div>
                                <div class="text-2xl font-black text-cyan-400 tracking-tight" id="zr-kpi-total-custs">-</div>
                                <div class="text-xs text-slate-400 font-bold" id="zr-kpi-cust-label">সিলেক্টকৃত কাস্টমার</div>
                            </div>
                        </div>
                        <span class="text-[10px] font-black uppercase tracking-wider px-2 py-1 bg-cyan-500/10 text-cyan-400 rounded-lg border border-cyan-500/20">Filtered</span>
                    </div>
                </div>

                <div class="relative overflow-hidden rounded-2xl bg-slate-900/80 border border-slate-800 p-4 shadow-xl backdrop-blur-xl group hover:border-rose-500/40 transition-all">
                    <div class="flex items-center justify-between">
                        <div class="flex items-center gap-3.5">
                            <div class="w-12 h-12 rounded-2xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-400 shrink-0 shadow-inner">
                                <i class="fa-solid fa-hand-holding-dollar text-xl"></i>
                            </div>
                            <div>
                                <div class="text-2xl font-black text-rose-400 tracking-tight" id="zr-kpi-total-due">-</div>
                                <div class="text-xs text-slate-400 font-bold" id="zr-kpi-due-label">মোট বাজারের বকেয়া</div>
                            </div>
                        </div>
                        <span class="text-[10px] font-black uppercase tracking-wider px-2 py-1 bg-rose-500/10 text-rose-400 rounded-lg border border-rose-500/20">Receivable</span>
                    </div>
                </div>
            </div>

            <!-- Dynamic Zone Selector Pills & Filter Bar -->
            <div class="rounded-2xl bg-slate-900/80 border border-slate-800 p-4 space-y-4 shadow-xl backdrop-blur-xl">
                <div class="flex flex-col md:flex-row justify-between items-start md:items-center gap-3 border-b border-slate-800/80 pb-3">
                    <div class="flex items-center gap-2">
                        <div class="w-7 h-7 rounded-lg bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 text-xs">
                            <i class="fa-solid fa-sliders"></i>
                        </div>
                        <span class="text-sm font-black text-white uppercase tracking-wider">স্মার্ট ফিল্টার ও কাস্টম জোন কন্ট্রোল</span>
                    </div>

                    <!-- Multi-Filter & Search Toolbar -->
                    <div class="flex flex-wrap items-center gap-2.5 w-full md:w-auto">
                        <!-- Search Input -->
                        <div class="relative w-full sm:w-64">
                            <i class="fa-solid fa-magnifying-glass absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-xs z-10 pointer-events-none"></i>
                            <input type="text" id="zr-search-input" placeholder="কাস্টমার নাম, A/C, ফোন বা ঠিকানা..." class="w-full bg-slate-950 border border-slate-800 rounded-xl pr-4 py-2 text-xs text-white outline-none focus:border-indigo-500 font-bn transition-all shadow-inner" style="padding-left: 44px !important;" oninput="window.zoneReportApp.renderFilteredTable()">
                        </div>

                        <!-- Status Filter -->
                        <div class="relative">
                            <select id="zr-status-filter" class="bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 outline-none focus:border-indigo-500 font-bn cursor-pointer font-bold shadow-inner" onchange="window.zoneReportApp.setStatusFilter(this.value)">
                                <option value="all">স্ট্যাটাস: সকল কাস্টমার</option>
                                <option value="due">শুধুমাত্র বকেয়া (> ৳০)</option>
                                <option value="zero">হিসাব ক্লিয়ার (৳০)</option>
                                <option value="advance">অ্যাডভান্স জমা (< ৳০)</option>
                            </select>
                        </div>

                        <!-- Sort By -->
                        <div class="relative">
                            <select id="zr-sort-by" class="bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 outline-none focus:border-indigo-500 font-bn cursor-pointer font-bold shadow-inner" onchange="window.zoneReportApp.setSortBy(this.value)">
                                <option value="due_desc">ক্রমানুসারে: সর্বোচ্চ বকেয়া আগে</option>
                                <option value="acc_asc">ক্রমানুসারে: অ্যাকাউন্ট নং (A/C No)</option>
                                <option value="name_asc">ক্রমানুসারে: কাস্টমার নাম (A-Z)</option>
                            </select>
                        </div>
                    </div>
                </div>

                <!-- Zone Switcher Horizontal Pills -->
                <div class="flex items-center gap-2 overflow-x-auto custom-scrollbar pb-2 pt-1" id="zr-zone-pills-container">
                    <div class="text-xs text-slate-400 italic">জোন লোড হচ্ছে...</div>
                </div>
            </div>

            <!-- Customer List Table Card -->
            <div class="rounded-2xl bg-slate-900/80 border border-slate-800 overflow-hidden shadow-2xl backdrop-blur-xl">
                <div class="p-4 bg-slate-950/90 border-b border-slate-800 flex justify-between items-center">
                    <h3 class="font-black text-white text-sm flex items-center gap-2.5" id="zr-table-header-title">
                        <i class="fa-solid fa-list-check text-indigo-400 text-base"></i> <span>কাস্টমার তালিকা (সকল জোন)</span>
                    </h3>
                    <span class="text-xs font-black text-indigo-400 bg-indigo-500/10 border border-indigo-500/20 px-3 py-1 rounded-full shadow-sm" id="zr-table-count-badge">০ জন কাস্টমার</span>
                </div>

                <div class="overflow-x-auto">
                    <table class="w-full text-left text-xs font-bn border-collapse">
                        <thead>
                            <tr class="bg-slate-950/90 text-slate-300 border-b border-slate-800 text-[11px] font-black uppercase tracking-wider">
                                <th class="p-3.5 text-center w-12">SL</th>
                                <th class="p-3.5 text-center w-24">A/C NO</th>
                                <th class="p-3.5">কাস্টমারের নাম</th>
                                <th class="p-3.5">ঠিকানা</th>
                                <th class="p-3.5 text-center">মোবাইল নম্বর</th>
                                <th class="p-3.5 text-center">জোন</th>
                                <th class="p-3.5 text-right">ব্যালেন্স (৳)</th>
                                <th class="p-3.5 text-center w-28">অ্যাকশন</th>
                            </tr>
                        </thead>
                        <tbody id="zr-table-body" class="divide-y divide-slate-800/60 text-slate-200">
                            <tr><td colspan="8" class="text-center py-12 text-slate-500 font-bold italic"><i class="fa-solid fa-spinner fa-spin mr-2"></i>ডাটা লোড হচ্ছে...</td></tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    `,await Vo()}async function Vo(){let e=await Fo();Ho(e.zones,e.customers),Uo()}function Ho(e,t){let n=document.getElementById(`zr-zone-pills-container`),r=document.getElementById(`zr-kpi-total-zones`);if(r&&(r.innerText=e.length),!n)return;let i=jo().selectedZone||``,a=`
        <button onclick="window.zoneReportApp.selectZone('')" class="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap active:scale-95 ${i?`bg-slate-950 hover:bg-slate-800 text-slate-300 border border-slate-800`:`bg-gradient-to-r from-indigo-600 to-cyan-600 text-white shadow-lg shadow-indigo-500/20`}">
            <i class="fa-solid fa-border-all text-xs"></i>
            <span>সকল জোন (All Zones)</span>
            <span class="px-2 py-0.5 rounded-full text-[10px] font-black ${i?`bg-slate-800 text-slate-400`:`bg-black/30 text-white`}">${t.length}</span>
        </button>
    `;e.forEach(e=>{let n=t.filter(t=>(t.zone||``).trim()===e.name).length,r=i===e.name;a+=`
            <button onclick="window.zoneReportApp.selectZone('${P(e.name)}')" class="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap active:scale-95 ${r?`bg-gradient-to-r from-indigo-600 to-cyan-600 text-white shadow-lg shadow-indigo-500/20`:`bg-slate-950 hover:bg-slate-800 text-slate-300 border border-slate-800`}">
                <i class="fa-solid fa-location-dot text-xs ${r?`text-white`:`text-indigo-400`}"></i>
                <span>${P(e.name)}</span>
                <span class="px-2 py-0.5 rounded-full text-[10px] font-black ${r?`bg-black/30 text-white`:`bg-slate-800 text-slate-400`}">${n}</span>
            </button>
        `}),n.innerHTML=a}function Uo(){let e=jo(),t=document.getElementById(`zr-search-input`)?.value.trim().toLowerCase()||``,n=e.selectedStatus||`all`,r=e.selectedSort||`due_desc`,i=e.selectedZone||``,a=e.customers.filter(e=>{let r=!i||(e.zone||``).trim()===i,a=!t||(e.name||``).toLowerCase().includes(t)||(e.accountNo||``).toLowerCase().includes(t)||(e.phone||``).includes(t)||(e.address||``).toLowerCase().includes(t),o=Number(e.totalDue)||0,s=!0;return n===`due`?s=o>0:n===`zero`?s=o===0:n===`advance`&&(s=o<0),r&&a&&s});a.sort((e,t)=>r===`due_desc`?(Number(t.totalDue)||0)-(Number(e.totalDue)||0):r===`acc_asc`?(e.accountNo||``).localeCompare(t.accountNo||``,void 0,{numeric:!0}):r===`name_asc`?(e.name||``).localeCompare(t.name||``):0);let o=0;a.forEach(e=>o=L(o+(Number(e.totalDue)||0)));let s=document.getElementById(`zr-kpi-total-custs`),c=document.getElementById(`zr-kpi-total-due`),l=document.getElementById(`zr-table-header-title`),u=document.getElementById(`zr-table-count-badge`);s&&(s.innerText=`${a.length} জন`),c&&(c.innerText=`৳ ${F(o)}`),u&&(u.innerText=`${a.length} জন কাস্টমার`),l&&(l.innerHTML=`<i class="fa-solid fa-list-check text-indigo-400"></i> ${i?`${i} জোনের কাস্টমার তালিকা`:`সকল জোনের কাস্টমার তালিকা`}`);let d=document.getElementById(`zr-table-body`);d&&(d.innerHTML=zo(a))}window.zoneReportApp={selectZone:e=>{Mo(e);let t=jo();Ho(t.zones,t.customers),Uo()},setStatusFilter:e=>{No(e),Uo()},setSortBy:e=>{Po(e),Uo()},refreshData:()=>Vo(),renderFilteredTable:()=>Uo(),printPDF:()=>Io(),printTagada:()=>Ro(),exportExcel:()=>Lo()};var Wo=!1;function Go(e){let t=e.target;setTimeout(()=>{document.activeElement===t&&t.setSelectionRange(0,2)},10)}function Ko(e){let t=e.target,n=t.selectionStart;setTimeout(()=>{n<=2?t.setSelectionRange(0,2):n>=3&&n<=5?t.setSelectionRange(3,5):n>=6&&t.setSelectionRange(6,10)},10)}function qo(e){let t=e.target,n=e.key;if(e.altKey&&n===`ArrowDown`){t._parentOriginalInput?._flatpickr&&t._parentOriginalInput._flatpickr.toggle();return}if(![`Tab`,`Enter`,`ArrowLeft`,`ArrowRight`,`Home`,`End`,`Control`,`Meta`,`Alt`].includes(n)){if(n===`/`){e.preventDefault();let n=t.selectionStart;n<3?t.setSelectionRange(3,5):n<6&&t.setSelectionRange(6,10);return}!/^[0-9]$/.test(n)&&n!==`Backspace`&&n!==`Delete`&&e.preventDefault()}}function Jo(e){let t=e.target;if(e.inputType&&e.inputType.includes(`delete`))return;let n=t.value,r=t.selectionStart,i=n.substring(0,2).replace(/\D/g,``),a=n.substring(3,5).replace(/\D/g,``),o=n.substring(6,10).replace(/\D/g,``);i.length===2&&!isNaN(parseInt(i,10))&&parseInt(i,10)>31&&(i=`31`),a.length===2&&!isNaN(parseInt(a,10))&&parseInt(a,10)>12&&(a=`12`);let s=i;if((n.length>2||r>2)&&(s+=`/`+a,(n.length>5||r>5)&&(s+=`/`+o)),n!==s){t.value=s;let e=r;(r===2||r===5)&&s.length>r&&e++,t.setSelectionRange(e,e)}if(i.length===2&&a.length===2&&o.length===4){let e=`${o}-${a}-${i}`;if(!isNaN(new Date(e).getTime())&&t._parentOriginalInput){let n=t._parentOriginalInput;n.value=e,n._flatpickr&&n._flatpickr.setDate(e,!1),n.dispatchEvent(new Event(`change`,{bubbles:!0}))}}}function Yo(){document.querySelectorAll(`input.datepicker`).forEach(e=>{if(e._flatpickr){e.value&&e._flatpickr.setDate(e.value,!1);return}let t=e.value;if(t&&/^\d{2}\/\d{2}\/\d{4}$/.test(t)){let[n,r,i]=t.split(`/`);t=`${i}-${r}-${n}`,e.value=t}if(b(e,{mode:e.dataset.mode||`single`,dateFormat:`Y-m-d`,altInput:!0,altFormat:e.dataset.mode===`range`?`d/m/Y to d/m/Y`:`d/m/Y`,allowInput:!0,clickOpens:!1,disableMobile:!0,onReady:(t,n,r)=>{if(r.altInput){let t=r.altInput;t.className=e.className+` flatpickr-alt-input`,t.classList.remove(`datepicker`),t.placeholder=e.placeholder||`DD/MM/YYYY`,t._parentOriginalInput=e,t.style.cursor=`text`,t.addEventListener(`focus`,Go),t.addEventListener(`click`,Ko),t.addEventListener(`input`,Jo),t.addEventListener(`keydown`,qo),e.style.setProperty(`display`,`none`,`important`),e.tabIndex=-1;let n=t.parentElement;if(!n||!n.classList.contains(`date-input-container`)){let e=document.createElement(`div`);e.className=`relative inline-flex items-center w-full date-input-container`,t.parentNode.insertBefore(e,t),e.appendChild(t),n=e}let i=n.querySelector(`.date-picker-icon-btn`);i&&i.remove();let a=document.createElement(`button`);a.type=`button`,a.tabIndex=-1,a.className=`date-picker-icon-btn absolute right-2.5 top-1/2 -translate-y-1/2 text-blue-400 hover:text-blue-300 transition-colors p-1 cursor-pointer flex items-center justify-center border-0 bg-transparent outline-none z-10`,a.title=`ক্যালেন্ডার খুলুন`,a.innerHTML=`<i class="fa-solid fa-calendar-days text-xs pointer-events-none"></i>`,a.addEventListener(`click`,e=>{e.preventDefault(),e.stopPropagation(),r.toggle()}),n.appendChild(a)}if(r.calendarContainer&&!r.calendarContainer.querySelector(`.fp-action-footer`)){let t=document.createElement(`div`);t.className=`fp-action-footer`,t.innerHTML=`
                        <button type="button" class="fp-btn-today"><i class="fa-solid fa-calendar-day"></i> আজকে</button>
                        <button type="button" class="fp-btn-yesterday"><i class="fa-solid fa-clock-rotate-left"></i> গতকাল</button>
                        <button type="button" class="fp-btn-clear"><i class="fa-solid fa-eraser"></i> ক্লিয়ার</button>
                    `,t.querySelector(`.fp-btn-today`).onclick=()=>{let e=new Date().toISOString().split(`T`)[0];r.setDate(e,!0),r.close()},t.querySelector(`.fp-btn-yesterday`).onclick=()=>{let e=new Date;e.setDate(e.getDate()-1);let t=e.toISOString().split(`T`)[0];r.setDate(t,!0),r.close()},t.querySelector(`.fp-btn-clear`).onclick=()=>{r.clear(),e.value=``,e.dispatchEvent(new Event(`change`,{bubbles:!0})),r.close()},r.calendarContainer.appendChild(t)}},onChange:(t,n,r)=>{Wo=!0,e.value=n,Wo=!1,e.dispatchEvent(new Event(`change`,{bubbles:!0})),e.dispatchEvent(new Event(`input`,{bubbles:!0})),r.close()}}),!e._valueIntercepted){e._valueIntercepted=!0;let t=Object.getOwnPropertyDescriptor(HTMLInputElement.prototype,`value`);Object.defineProperty(e,"value",{get(){return t.get.call(this)},set(e){let n=e||``;if(n&&/^\d{2}\/\d{2}\/\d{4}$/.test(n)){let[e,t,r]=n.split(`/`);n=`${r}-${t}-${e}`}let r=t.get.call(this);t.set.call(this,n),this._flatpickr&&n&&n!==r&&!Wo&&this._flatpickr.setDate(n,!1)},configurable:!0})}})}var Xo=new MutationObserver(e=>{e.forEach(e=>{e.addedNodes.forEach(e=>{e.nodeType===1&&(e.classList?.contains(`datepicker`)&&setTimeout(()=>Yo(),0),e.querySelectorAll?.(`.datepicker`).forEach(()=>setTimeout(()=>Yo(),0)))})})});function Zo(){Xo.observe(document.body,{childList:!0,subtree:!0})}window.initDatePickers=Yo;async function Qo(){try{let e=await g.getAppSettings(),t=e.shopLogo,n=e.shopName||`MAA ERP`;if(document.title=`${n} - ERP`,!t)return;let r=document.getElementById(`dynamic-favicon`);r||(r=document.createElement(`link`),r.id=`dynamic-favicon`,r.rel=`icon`,document.head.appendChild(r)),r.href=t;let i=document.getElementById(`dynamic-apple-icon`);i||(i=document.createElement(`link`),i.id=`dynamic-apple-icon`,i.rel=`apple-touch-icon`,document.head.appendChild(i)),i.href=t;let a=document.querySelector(`link[rel="manifest"]`);if(a){let e={name:n,short_name:n.split(` `)[0],description:`Professional Business Ledger & Accounting System`,start_url:`/`,display:`standalone`,background_color:`#0F172A`,theme_color:`#0F172A`,orientation:`portrait-primary`,icons:[{src:t,sizes:`192x192`,type:`image/png`,purpose:`any maskable`},{src:t,sizes:`512x512`,type:`image/png`,purpose:`any maskable`}]},r=new Blob([JSON.stringify(e)],{type:`application/json`});a.href=URL.createObjectURL(r)}}catch(e){console.warn(`App branding apply error:`,e)}}function $o(e,t={}){N.currentView===`dashboard`&&e!==`dashboard`&&Ln(),N.currentView===`audit`&&e!==`audit`&&he(),N.currentView===`recycle-bin`&&e!==`recycle-bin`&&Qa(),N.currentView=e;let n=document.getElementById(`app-sidebar`);n&&n.classList.remove(`open`),document.querySelectorAll(`.nav-links li, .nav-item, .mobile-nav-item`).forEach(t=>{t.classList.remove(`active`);let n=t.getAttribute(`onclick`);n&&n.includes(`'${e}'`)&&t.classList.add(`active`)});let r=document.getElementById(`view-container`);if(r){switch(e){case`dashboard`:Rn(r,t);break;case`customers`:qt(r);break;case`ledger`:Or(r,t);break;case`zone-reports`:Bo(r);break;case`bulk`:ra(r);break;case`invoice`:Ao(r,t);break;case`expenses`:Wr(r);break;case`settings`:Si(r);break;case`statement`:zi(r,t);break;case`admin`:Wa(r);break;case`audit`:ve(r);break;case`banking`:window.bankingApp.renderBankingLedger(r);break;case`recycle-bin`:Xa(r)}setTimeout(Yo,50)}}function es(){Y(),Qo();let e=document.getElementById(`login-error`);e&&(e.innerText=``);let t=document.getElementById(`login-screen`),r=document.getElementById(`app-container`);t&&(t.style.display=`none`),r&&r.classList.remove(`hidden`);let i=document.getElementById(`user-role`);i&&(i.innerText=N.currentUserRole||`User`);let a=n.auth().currentUser,o=document.getElementById(`user-profile-avatar`);o&&a&&(o.innerHTML=a.photoURL?`<img src="${a.photoURL}" class="w-full h-full object-cover rounded-full" referrerpolicy="no-referrer" />`:`<i class="fa-solid fa-user-shield text-sm"></i>`,o.title=`${a.email} (${N.currentUserRole})`),$o(N.currentView||`dashboard`)}function ts(){let e=document.getElementById(`app-sidebar`);e&&(e.classList.toggle(`collapsed`),localStorage.setItem(`sidebarCollapsed`,e.classList.contains(`collapsed`)))}window.navigate=$o,window.navigateTo=$o,window.unlockApp=es;async function ns(){let e=document.getElementById(`email-input`)?.value,t=document.getElementById(`password-input`)?.value,n=document.getElementById(`login-error`);if(!e||!t)return n?n.innerText=`ইমেইল ও পাসওয়ার্ড দিন!`:null;try{await s.signInWithEmailAndPassword(e,t)}catch{n&&(n.innerText=`লগইন ব্যর্থ! সঠিক তথ্য দিন।`)}}async function rs(){let e=document.getElementById(`login-error`);e&&(e.innerText=`গুগল লগইন প্রসেস করা হচ্ছে...`);try{await s.signInWithPopup(c)}catch(t){console.warn(`Popup blocked, trying redirect:`,t);try{await s.signInWithRedirect(c)}catch{e&&(e.innerText=`গুগল লগইন ব্যর্থ!`)}}}function is(){let e=n.auth().currentUser;e&&O(`LOGOUT`,`Auth`,e.uid,e.email),s.signOut();let t=document.getElementById(`login-screen`),r=document.getElementById(`app-container`);t&&(t.style.display=`flex`),r&&r.classList.add(`hidden`),[`nav-admin`,`nav-audit`].forEach(e=>document.getElementById(e)?.classList.add(`hidden`)),ls()}var as=null;function os(){s.getRedirectResult().catch(e=>console.warn(`Redirect result handled:`,e));let e=new URLSearchParams(window.location.search),t=(e.get(`portal`)||e.get(`access`)||``).toLowerCase(),r=t===`boss`;if(r){let e=document.querySelector(`#login-screen h2`),t=document.querySelector(`#login-screen p`),n=document.querySelector(`#login-screen .w-20.h-20`);e&&(e.innerText=`MAA MOTORS ERP`),t&&(t.innerHTML=`<span class="text-amber-400 font-black"><i class="fa-solid fa-crown mr-1"></i>BOSS & EXECUTIVE PORTAL</span>`),n&&(n.className=`w-20 h-20 bg-gradient-to-tr from-amber-500 to-yellow-300 text-slate-950 text-4xl flex items-center justify-center rounded-3xl mx-auto mb-4 shadow-xl shadow-amber-500/30`,n.innerHTML=`<i class="fa-solid fa-crown"></i>`)}else if(t===`staff`){let e=document.querySelector(`#login-screen p`);e&&(e.innerHTML=`<span class="text-blue-400 font-bold"><i class="fa-solid fa-users mr-1"></i>STAFF PORTAL ACCESS</span>`)}s.onAuthStateChanged(async e=>{as&&=(as(),null),e?as=u.listenUser(e.uid,async i=>{let a=i,o=e.email?.toLowerCase().trim()||``,s=o===`office.maamotors@gmail.com`||o===`maamotorsbd@gmail.com`||o===`omarfarukitbd@gmail.com`;if(!i){a={email:e.email,name:e.displayName||e.email.split(`@`)[0],photoURL:e.photoURL||``,role:s?`Admin`:r?`Boss`:`Staff`,requestedPortal:t||`staff`,status:s?`active`:`pending`,pin:s?``:r?`5027`:``,createdAt:n.firestore.FieldValue.serverTimestamp(),lastLogin:n.firestore.FieldValue.serverTimestamp()};try{await u.getRef(e.uid).set(a)}catch(e){console.error(`Error setting user document:`,e)}if(!s){cs(e.email,r?`Boss`:`Staff`);return}}else if(s&&(i.status!==`active`||i.role!==`Admin`)){a={...i,role:`Admin`,status:`active`};try{await u.update(e.uid,{role:`Admin`,status:`active`})}catch(e){console.error(`Error auto-healing master user:`,e)}}N.currentUserRole=a.role||`Staff`,N.currentUserEmail=a.email||e.email,N.permissions=a.permissions||{},document.body.setAttribute(`data-user-role`,N.currentUserRole);let c=async()=>{let e=`Unknown`;try{e=(await(await fetch(`https://api.ipify.org?format=json`)).json()).ip}catch(e){console.error(e)}return{ip:e,device:navigator.userAgent}};if(a.status===`active`){w(),ls();let t=document.getElementById(`app-container`);if(t&&t.classList.contains(`hidden`))if(N.currentUserRole===`Admin`){[`nav-admin`,`nav-audit`,`nav-banking`].forEach(e=>document.getElementById(e)?.classList.remove(`hidden`));let t=await c();O(`LOGIN`,`Auth`,e.uid,e.email,{role:`Admin`,ip:t.ip,device:t.device}),es(),ss()}else{let t=N.currentUserRole===`Boss`,n=`login_pin_`+Math.random().toString(36).substring(7),r=t?`<i class="fa-solid fa-crown text-amber-400"></i>`:`<i class="fa-solid fa-lock text-blue-400"></i>`,i=t?`মালিকের সিকিউরিটি পিন দিন`:`অ্যাক্সেস পিন দিন`,o=t?`বস পোর্টালে ঢুকতে আপনার সিকিউরিটি পিন দিন`:`সফটওয়্যারে ঢুকতে আপনার ৪-ডিজিট পিন দিন`,{value:s}=await H.default.fire({title:`<div class="flex items-center justify-center gap-2 text-white font-bn">${r}<span>${i}</span></div>`,input:`password`,inputLabel:o,inputPlaceholder:`Enter PIN`,inputAttributes:{autocomplete:`off`,autocorrect:`off`,autocapitalize:`off`,spellcheck:`false`,name:n,"aria-autocomplete":`none`,"data-lpignore":`true`,"data-1p-ignore":`true`},allowOutsideClick:!1,showCancelButton:!0,cancelButtonText:`লগআউট`,customClass:{popup:`!bg-slate-900 !text-white !rounded-3xl border border-slate-700 font-bn`,title:`!text-white font-bn`,confirmButton:`m3-btn-primary !py-2.5`,cancelButton:`m3-btn-tonal !py-2.5`},didOpen:()=>{let e=H.default.getInput();e&&(e.setAttribute(`autocomplete`,`off`),e.setAttribute(`name`,n),e.setAttribute(`readonly`,`readonly`),setTimeout(()=>e.removeAttribute(`readonly`),50))}}),l=a.pin||(t?`5027`:``);if(s&&(s===l||t&&s===`5027`)){let n=await c();O(`LOGIN`,`Auth`,e.uid,e.email,{role:N.currentUserRole,ip:n.ip,device:n.device}),[`nav-admin`,`nav-audit`].forEach(e=>document.getElementById(e)?.classList.add(`hidden`)),es(),t&&(document.getElementById(`nav-banking`)?.classList.remove(`hidden`),H.default.fire({toast:!0,position:`top-end`,icon:`success`,title:`স্বাগতম, মালিক মহোদয়!`,showConfirmButton:!1,timer:3e3,background:`#0F172A`,color:`#F8FAFC`,customClass:{popup:`border border-amber-500/30 rounded-2xl font-bn text-xs`}}))}else s&&H.default.fire(`ভুল পিন!`,`আপনি সঠিক সিকিউরিটি পিন দেননি।`,`error`),is()}}else a.status===`pending`?cs(e.email,a.role||(r?`Boss`:`Staff`)):(is(),document.getElementById(`login-error`)&&(document.getElementById(`login-error`).innerText=`আপনার একাউন্ট ব্লক করা হয়েছে।`))}):(is(),ls())})}function ss(){u.listenAll(e=>{let t=e.filter(e=>e.status===`pending`).length,n=document.getElementById(`nav-admin`);if(n){let e=document.getElementById(`pending-users-badge`);t>0?(e||(e=document.createElement(`span`),e.id=`pending-users-badge`,e.className=`ml-auto bg-amber-500 text-slate-950 font-black text-[10px] px-2 py-0.5 rounded-full animate-pulse shadow-md`,n.appendChild(e)),e.innerText=`${t} Pending`):e&&e.remove()}})}function cs(e){let t=document.getElementById(`login-screen`);if(t&&(t.style.display=`none`),document.getElementById(`waiting-room`))return;let n=document.createElement(`div`);n.id=`waiting-room`,n.className=`fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/90 backdrop-blur-xl p-4 font-bn`,n.innerHTML=`
        <div class="w-full max-w-[420px] p-8 m3-card text-center border-amber-500/40 shadow-[0_0_50px_rgba(245,158,11,0.2)] bg-slate-900/90 rounded-[32px]">
            <div class="w-20 h-20 bg-amber-500/10 text-amber-500 text-4xl flex items-center justify-center rounded-3xl mx-auto mb-6 border border-amber-500/30 animate-pulse">
                <i class="fa-solid fa-hourglass-half"></i>
            </div>
            <h2 class="text-2xl font-black text-white mb-2">অনুমোদনের অপেক্ষায়...</h2>
            <p class="text-slate-300 text-sm font-bold mb-6 leading-relaxed">
                আপনার একাউন্টটি <b class="text-amber-400">${e}</b> সিস্টেমে যুক্ত হয়েছে এবং বর্তমানে <span class="text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded">Pending Approval</span> অবস্থায় আছে। অ্যাডমিন প্যানেল থেকে অনুমোদন দিলেই এই স্ক্রিনটি অটোমেটিক আনলক হয়ে যাবে।
            </p>
            <div class="flex flex-col gap-3">
                <div class="flex items-center justify-center gap-2 text-[11px] text-emerald-400 font-black uppercase tracking-widest bg-emerald-500/10 py-2.5 rounded-xl border border-emerald-500/20">
                    <i class="fa-solid fa-circle-notch fa-spin"></i> অটো-আনলক সিঙ্ক সক্রিয়
                </div>
                <button class="text-slate-400 hover:text-red-400 text-xs font-bold transition-all mt-2 cursor-pointer" onclick="app.logout()">
                    <i class="fa-solid fa-right-from-bracket mr-1"></i> অন্য একাউন্ট দিয়ে চেষ্টা করুন
                </button>
            </div>
        </div>
    `,document.body.appendChild(n)}function ls(){document.getElementById(`waiting-room`)?.remove()}var us,ds=-1;function fs(){let e=document.getElementById(`global-search-input`),t=document.getElementById(`global-search-results`);!e||!t||(e.oninput=e=>{let n=e.target.value.trim();if(n.length<1)return ds=-1,t.classList.add(`hidden`);clearTimeout(us),us=setTimeout(async()=>{t.classList.remove(`hidden`),t.innerHTML=`<div class="p-4 text-xs text-slate-500 text-center"><i class="fa-solid fa-spinner fa-spin mr-2 text-blue-500"></i>অনুসন্ধান করা হচ্ছে...</div>`,ms(n,t),ds=-1},150)},document.addEventListener(`keydown`,n=>{if((n.ctrlKey||n.metaKey)&&n.key.toLowerCase()===`k`)n.preventDefault(),e.focus(),e.select();else if(n.key===`Escape`)t.classList.add(`hidden`);else if(t&&!t.classList.contains(`hidden`)){let e=t.querySelectorAll(`.search-result-item`);n.key===`ArrowDown`?(n.preventDefault(),ds=Math.min(ds+1,e.length-1),ps(e)):n.key===`ArrowUp`?(n.preventDefault(),ds=Math.max(ds-1,0),ps(e)):n.key===`Enter`&&ds>=0&&(n.preventDefault(),e[ds].click())}}))}function ps(e){e.forEach((e,t)=>{t===ds?(e.classList.add(`bg-blue-600/20`,`border-blue-500/50`),e.scrollIntoView({block:`nearest`,behavior:`smooth`})):e.classList.remove(`bg-blue-600/20`,`border-blue-500/50`)})}async function ms(e,t){try{let n=``,r=e.toLowerCase(),i=r.replace(/^#/,``),a=J().filter(t=>typeof window.matchCustomerSearch==`function`?window.matchCustomerSearch(t,e):t.accountNo&&t.accountNo.toLowerCase().includes(i)||t.name&&t.name.toLowerCase().includes(r)||t.phone&&t.phone.includes(i));if(a.length>0&&(n+=`<div class="px-3 py-1.5 bg-slate-800/80 text-[10px] text-blue-400 font-black tracking-widest uppercase border-b border-slate-700/50">কাস্টমার (${a.length})</div>`,a.forEach(e=>{n+=`
                <div class="search-result-item p-3 hover:bg-slate-800 cursor-pointer flex justify-between items-center border-b border-slate-800 transition-all group"
                    onclick="window.handleSearchResultClick('customer', '${e.id}', '${e.name.replace(/'/g,`\\'`)}', '${e.accountNo||``}')">
                    <div class="overflow-hidden">
                        <div class="font-bold text-slate-200 text-sm group-hover:text-blue-400 transition-colors">${e.name}</div>
                        <div class="text-[10px] text-slate-500">${e.phone||`No Phone`}</div>
                    </div>
                    <div class="text-xs font-black text-red-400">৳${F(e.totalDue||0)}</div>
                </div>`})),i.length>=2){let e=await o.getByVoucher(i),t=new Set,r=e.filter(e=>!t.has(e.voucherNo)&&(t.add(e.voucherNo),!0));r.length>0&&(n+=`<div class="px-3 py-1.5 bg-slate-800/80 text-[10px] text-emerald-400 font-black tracking-widest uppercase border-b border-slate-700/50 mt-1">ভাউচার (${r.length})</div>`,r.forEach(e=>{let t=(Number(e.bill)||0)>0?`৳${F(e.bill)}`:`৳${F(e.paid)}`;n+=`
                    <div class="search-result-item p-3 hover:bg-slate-800 cursor-pointer flex justify-between items-center border-b border-slate-800 transition-all group"
                        onclick="window.handleSearchResultClick('voucher', '${e.voucherNo}')">
                        <div>
                            <div class="font-bold text-slate-200 text-sm group-hover:text-emerald-400 transition-colors">#${e.voucherNo} • ${e.customerName}</div>
                            <div class="text-[10px] text-slate-500">${B(e.date)}</div>
                        </div>
                        <div class="text-xs font-black text-white">${t}</div>
                    </div>`}))}t.innerHTML=n||`<div class="p-8 text-center text-xs text-slate-500 italic">কিছু পাওয়া যায়নি</div>`}catch(e){console.error(e),t.innerHTML=`<div class="p-4 text-center text-red-400">Error during search</div>`}}function hs(e,t,n,r){if(document.getElementById(`global-search-results`)?.classList.add(`hidden`),document.getElementById(`global-search-input`).value=``,e===`customer`){let e=N.currentView;if(e===`invoice`){let e=document.getElementById(`inv-customer-select`);e&&(e.value=t,window.invoiceCustomerChanged())}else if(e===`ledger`){let e=document.getElementById(`ledger-customer-select`);e&&(e.value=t,window.filterLedgerByCustomer(t))}else if(e===`customers`){let e=document.getElementById(`cust-search-input`);e&&(e.value=r||n,window.filterCustomerList(),setTimeout(()=>{document.querySelectorAll(`#customer-list tr`).forEach(e=>{e.innerText.includes(n)&&(e.classList.add(`bg-blue-600/20`),e.scrollIntoView({behavior:`smooth`,block:`center`}))})},150))}else $o(`statement`,{customerId:t,customerName:n,accountNo:r})}else e===`voucher`&&$o(`ledger`,{filterVoucher:t})}window.handleSearchResultClick=hs;var gs=``,_s=!1,vs=0,ys=`0`,bs=[];function xs(e){if(!e)return`0`;let t=e.replace(/([0-9.]+)\s*([+-])\s*([0-9.]+)%/g,`$1 $2 ($1 * $3 / 100)`);if(t=t.replace(/%/g,`/100`),!/^[0-9+\-*/. ()]+$/.test(t))return`Error`;try{let e=Function(`"use strict"; return (${t})`)();return typeof e==`number`&&!isNaN(e)&&isFinite(e)?parseFloat(e.toFixed(6)).toString():`Error`}catch(e){return console.error(`Calculator expression error:`,e),`Error`}}function Ss(e){return e===`Error`||e===`Infinity`||e===`NaN`?`0`:e.split(/([+\-*/])/).map(e=>{if([`+`,`-`,`*`,`/`].includes(e))return e;if(!e)return``;let t=e.endsWith(`%`),n=t?e.slice(0,-1):e;if(n===`.`)return`.`+(t?`%`:``);if(n.includes(`.`)){let[e,r]=n.split(`.`);return(e?Number(e).toLocaleString(`en-IN`):`0`)+`.`+r+(t?`%`:``)}return Number(n).toLocaleString(`en-IN`)+(t?`%`:``)}).join(``)}var $;function Cs(){try{$||=new(window.AudioContext||window.webkitAudioContext),$.state===`suspended`&&$.resume();let e=$.createOscillator(),t=$.createGain();e.connect(t),t.connect($.destination),e.type=`sine`,e.frequency.setValueAtTime(800,$.currentTime),e.frequency.exponentialRampToValueAtTime(300,$.currentTime+.03),t.gain.setValueAtTime(.05,$.currentTime),t.gain.exponentialRampToValueAtTime(.01,$.currentTime+.03),e.start($.currentTime),e.stop($.currentTime+.03)}catch(e){console.error(`Audio click failed`,e)}}function ws(e){Cs();let t=document.getElementById(`calc-display`),n=document.getElementById(`calc-history`);if(!t)return;let r=ys;if((r===`Error`||r===`Infinity`||r===`NaN`)&&(r=`0`),[`MC`,`MR`,`M+`,`M-`].includes(e))e===`MC`?(vs=0,n&&(n.innerText=`Memory Cleared`)):e===`MR`?(r=vs.toString(),_s=!0):e===`M+`?(vs+=parseFloat(xs(r))||0,n&&(n.innerText=`M+ (Memory: `+Ss(vs.toString())+`)`),_s=!0):e===`M-`&&(vs-=parseFloat(xs(r))||0,n&&(n.innerText=`M- (Memory: `+Ss(vs.toString())+`)`),_s=!0);else if(e===`C`)r=`0`,gs=``,n&&(n.innerText=``);else if(e===`⌫`||e===`Backspace`)_s?(r=`0`,gs=``,n&&(n.innerText=``)):r=r.length>1?r.slice(0,-1):`0`;else if(e===`=`||e===`Enter`){let e=xs(r);gs=r+` =`,r!==e&&!_s&&(bs.unshift({eq:r,res:e}),Os()),n&&(n.innerText=gs),r=e,_s=!0}else if([`+`,`-`,`*`,`/`].includes(e)){_s=!1;let t=r.slice(-1);[`+`,`-`,`*`,`/`].includes(t)?r=r.slice(0,-1)+e:r+=e}else _s&&=(r=``,!1),r===`0`&&e!==`.`&&e!==`00`&&e!==`000`?r=e:r+=e;ys=r||`0`,t.value=Ss(ys)}function Ts(){document.addEventListener(`keydown`,e=>{let t=document.getElementById(`calculator-widget`);!t||t.classList.contains(`hidden`)||(e.target.tagName!==`INPUT`||e.target.id===`calc-display`)&&e.target.tagName!==`TEXTAREA`&&[`0`,`1`,`2`,`3`,`4`,`5`,`6`,`7`,`8`,`9`,`.`,`+`,`-`,`*`,`/`,`%`,`=`,`Enter`,`Backspace`,`Escape`].includes(e.key)&&(e.preventDefault(),e.key===`Escape`?window.app.toggleCalculator():ws(e.key))})}function Es(){let e=document.getElementById(`calc-history-tape`);e&&e.classList.toggle(`hidden`)}async function Ds(){try{await navigator.clipboard.writeText(ys);let e=document.getElementById(`calc-history`);if(e){let t=e.innerText;e.innerText=`Copied: `+ys,setTimeout(()=>{e.innerText=t},1500)}}catch(e){console.error(`Copy failed`,e)}}function Os(){let e=document.getElementById(`calc-history-tape`);if(e){if(bs.length===0){e.innerHTML=`<span class="text-center opacity-50 block py-4">No History</span>`;return}e.innerHTML=bs.slice(0,15).map(e=>`
        <div class="border-b border-slate-800/50 pb-1 cursor-pointer hover:text-white transition-colors" onclick="window.handleCalc('C'); window.handleCalc('${e.res}')">
            <div class="text-[10px] text-slate-500">${Ss(e.eq)} =</div>
            <div class="text-sm font-black text-blue-400">${Ss(e.res)}</div>
        </div>
    `).join(``)}}function ks(){let e=document.getElementById(`calculator-widget`),t=document.getElementById(`calc-drag-handle`);if(!e||!t)return;let n=!1,r=0,i=0,a=0,o=0,s=0,c=0;t.addEventListener(`mousedown`,l),t.addEventListener(`touchstart`,l,{passive:!0}),document.addEventListener(`mousemove`,u),document.addEventListener(`touchmove`,u,{passive:!1}),document.addEventListener(`mouseup`,d),document.addEventListener(`touchend`,d);function l(e){e.target.closest(`button`)||(a=(e.type===`touchstart`?e.touches[0].clientX:e.clientX)-s,o=(e.type===`touchstart`?e.touches[0].clientY:e.clientY)-c,n=!0)}function u(t){n&&(t.type===`touchmove`&&t.preventDefault(),r=(t.type===`touchmove`?t.touches[0].clientX:t.clientX)-a,i=(t.type===`touchmove`?t.touches[0].clientY:t.clientY)-o,s=r,c=i,e.style.transform=`translate(${r}px, ${i}px)`)}function d(){n=!1}}window.handleCalc=ws,window.toggleCalcHistoryTape=Es,window.copyCalcResult=Ds;async function As(e,t=!1){if(!e)return 0;let n=await o.collection.where(`receivedFrom`,`==`,e).get(),r=0;n.forEach(e=>{let t=e.data();t.paid&&!isNaN(t.paid)&&(r+=Number(t.paid))});let i=await h.getByBank(e),a=0,s=0,c=0;i.forEach(e=>{let t=Number(e.amount||0);e.type===`DEPOSIT`?a+=t:e.type===`WITHDRAWAL`?s+=t:e.type===`TRANSFER`&&(c+=t)});let l=await h.getTransfersByTargetBank(e),u=0;return l.forEach(e=>{u+=Number(e.amount||0)}),L(r+a+u-s-c)}var js=[];async function Ms(e){if(window.AppState.currentUserRole!==`Boss`&&window.AppState.currentUserRole!==`Admin`){e.innerHTML=`<div class="m3-card text-center font-bn py-12"><h2 class="text-xl font-bold text-red-500">অ্যাক্সেস ডিনাইড! শুধুমাত্র অ্যাডমিন/বস দেখতে পারবেন।</h2></div>`;return}e.innerHTML=`
        <div class="flex flex-col gap-6 font-bn">
            <div class="flex flex-wrap items-center justify-between gap-3 px-2">
                <h2 class="text-2xl font-black text-white flex items-center gap-3">
                    <div class="w-1.5 h-8 bg-purple-600 rounded-full"></div>
                    ব্যাংকিং লেজার <span class="text-xs font-bold text-slate-400 uppercase tracking-wider">(Banking & Cash)</span>
                    <button class="w-8 h-8 rounded-full hover:bg-slate-800 flex items-center justify-center text-slate-500 hover:text-purple-400 transition-all" onclick="window.renderBankingLedger(document.getElementById('main-content'))">
                        <i class="fa-solid fa-rotate text-sm"></i>
                    </button>
                </h2>
                <div class="flex items-center gap-2">
                    <button class="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold transition-all shadow-md shadow-emerald-600/20 flex items-center gap-2" onclick="window.bankingApp.openTransactionModal('DEPOSIT')">
                        <i class="fa-solid fa-arrow-down"></i> ম্যানুয়াল জমা
                    </button>
                    <button class="px-4 py-2 bg-red-600 hover:bg-red-500 text-white rounded-xl text-xs font-bold transition-all shadow-md shadow-red-600/20 flex items-center gap-2" onclick="window.bankingApp.openTransactionModal('WITHDRAWAL')">
                        <i class="fa-solid fa-arrow-up"></i> টাকা উত্তোলন
                    </button>
                    <button class="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold transition-all shadow-md shadow-blue-600/20 flex items-center gap-2" onclick="window.bankingApp.openTransactionModal('TRANSFER')">
                        <i class="fa-solid fa-right-left"></i> ট্রান্সফার
                    </button>
                </div>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4" id="banking-accounts-grid">
                <div class="text-center py-12 col-span-full text-slate-400 font-bold italic"><i class="fa-solid fa-spinner fa-spin mr-2"></i>অ্যাকাউন্ট ব্যালেন্স লোড হচ্ছে...</div>
            </div>
        </div>
    `,await Ns()}async function Ns(){try{let e=await f.getActiveBanks(),t=await l.getActiveCollectors();js=[...e.map(e=>({...e,isCash:!1})),...t.map(e=>({...e,isCash:!0}))];let n=``;for(let e of js){let t=await As(e.name,e.isCash),r=e.isCash?`<i class="fa-solid fa-wallet text-emerald-400 text-2xl"></i>`:`<i class="fa-solid fa-building-columns text-blue-400 text-2xl"></i>`,i=e.isCash?`<span class="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">CASH</span>`:`<span class="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-500/10 text-blue-400 border border-blue-500/20">BANK</span>`;n+=`
                <div class="m3-card relative overflow-hidden group cursor-pointer hover:border-purple-500/50 transition-colors" onclick="window.bankingApp.viewAccountLedger('${e.name}', ${e.isCash})">
                    <div class="flex items-start justify-between mb-4">
                        <div class="w-12 h-12 rounded-xl bg-slate-900 border border-slate-700 flex items-center justify-center">
                            ${r}
                        </div>
                        <div>${i}</div>
                    </div>
                    <div>
                        <h3 class="text-lg font-black text-slate-200 truncate">${e.name}</h3>
                        <div class="text-sm font-bold text-slate-500 mb-1">বর্তমান ব্যালেন্স</div>
                        <div class="text-3xl font-black ${t<0?`text-red-400`:`text-white`}">৳ ${F(t)}</div>
                    </div>
                    
                    <div class="absolute bottom-0 left-0 w-full h-1 bg-slate-800">
                        <div class="h-full bg-gradient-to-r from-purple-500 to-blue-500 w-0 group-hover:w-full transition-all duration-500"></div>
                    </div>
                </div>
            `}let r=document.getElementById(`banking-accounts-grid`);r&&(r.innerHTML=n)}catch(e){console.error(`Error loading banking accounts:`,e);let t=document.getElementById(`banking-accounts-grid`);t&&(t.innerHTML=`<div class="text-center py-12 col-span-full text-red-400 font-bold">ব্যালেন্স লোড করতে সমস্যা হয়েছে!</div>`)}}async function Ps(e){let t=e===`DEPOSIT`?`ম্যানুয়াল জমা (Deposit)`:e===`WITHDRAWAL`?`টাকা উত্তোলন (Withdrawal)`:`এক ব্যাংক থেকে অন্য ব্যাংকে ট্রান্সফার`,r=e===`DEPOSIT`?`জমা করুন`:e===`WITHDRAWAL`?`উত্তোলন করুন`:`ট্রান্সফার করুন`,i=e===`DEPOSIT`?`#10b981`:e===`WITHDRAWAL`?`#ef4444`:`#3b82f6`,a=`<option value="">-- নির্বাচন করুন --</option>`;js.forEach(e=>{a+=`<option value="${e.name}">${e.name} (${e.isCash?`Cash`:`Bank`})</option>`});let o=`
        <div class="text-left font-bn space-y-4">
            <div>
                <label class="block text-xs font-bold text-slate-400 mb-1">${e===`TRANSFER`?`কোথা থেকে (From)`:`অ্যাকাউন্ট নির্বাচন করুন`}</label>
                <select id="banking-txn-acc" class="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2.5 text-white font-bold outline-none">${a}</select>
            </div>
    `;e===`TRANSFER`&&(o+=`
            <div>
                <label class="block text-xs font-bold text-slate-400 mb-1">কোথায় যাবে (To)</label>
                <select id="banking-txn-target-acc" class="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2.5 text-white font-bold outline-none">${a}</select>
            </div>
        `),o+=`
            <div>
                <label class="block text-xs font-bold text-slate-400 mb-1">পরিমাণ (Amount ৳)</label>
                <input type="number" id="banking-txn-amount" class="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2.5 text-white font-black text-xl outline-none focus:border-purple-500" placeholder="0.00">
            </div>
            <div>
                <label class="block text-xs font-bold text-slate-400 mb-1">বিবরণ / নোট</label>
                <input type="text" id="banking-txn-note" class="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2.5 text-white outline-none focus:border-purple-500" placeholder="যেমন: বস নিজ পকেট থেকে দিয়েছেন...">
            </div>
            <div>
                <label class="block text-xs font-bold text-slate-400 mb-1">তারিখ</label>
                <input type="date" id="banking-txn-date" class="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2.5 text-white outline-none" value="${new Date().toISOString().split(`T`)[0]}">
            </div>
        </div>
    `;let{value:s}=await H.default.fire({title:`<div class="font-bn font-black text-white text-xl">${t}</div>`,html:o,showCancelButton:!0,confirmButtonText:r,confirmButtonColor:i,cancelButtonText:`বাতিল`,customClass:{popup:`!bg-slate-900 !text-white !rounded-3xl border border-slate-700`},preConfirm:()=>{let t=document.getElementById(`banking-txn-acc`).value,n=e===`TRANSFER`?document.getElementById(`banking-txn-target-acc`).value:null,r=Number(document.getElementById(`banking-txn-amount`).value),i=document.getElementById(`banking-txn-note`).value.trim(),a=document.getElementById(`banking-txn-date`).value;return t?e===`TRANSFER`&&!n?H.default.showValidationMessage(`টার্গেট অ্যাকাউন্ট নির্বাচন করুন`):e===`TRANSFER`&&t===n?H.default.showValidationMessage(`একই অ্যাকাউন্টে ট্রান্সফার সম্ভব নয়`):!r||r<=0?H.default.showValidationMessage(`সঠিক পরিমাণ দিন`):a?{acc:t,targetAcc:n,amount:r,note:i,date:a,type:e}:H.default.showValidationMessage(`তারিখ আবশ্যক`):H.default.showValidationMessage(`অ্যাকাউন্ট নির্বাচন করুন`)}});if(s){if(!await W(`${t} (Master PIN)`))return;H.default.fire({title:`প্রসেস করা হচ্ছে...`,allowOutsideClick:!1,didOpen:()=>H.default.showLoading()});try{let e={type:s.type,bankName:s.acc,targetBankName:s.targetAcc,amount:s.amount,note:s.note,date:s.date,createdAt:n.firestore.FieldValue.serverTimestamp()};await h.add(e),O(`BANKING_TXN`,`Admin`,`BankingLedger`,`${s.type} of ${s.amount} on ${s.acc}. Note: ${s.note}`),H.default.fire({title:`সফল!`,text:`ট্রানজাকশন সফলভাবে সম্পন্ন হয়েছে।`,icon:`success`,customClass:{popup:`!bg-slate-900 !text-white !rounded-3xl border border-slate-700`}}),await Ns()}catch(e){console.error(e),H.default.fire(`ত্রুটি`,`ট্রানজাকশন সেভ করতে সমস্যা হয়েছে।`,`error`)}}}async function Fs(e,t){H.default.fire({title:`লেজার তৈরি হচ্ছে...`,allowOutsideClick:!1,didOpen:()=>H.default.showLoading()});try{await h.getByBank(e),await h.getTransfersByTargetBank(e),H.default.close(),H.default.fire({title:`<div class="font-bn font-black text-white text-xl">${e} - লেজার</div>`,html:`<div class="font-bn text-sm text-amber-400">এই ভার্সনে সম্পূর্ণ ডিটেইলস লেজার পরের আপডেটে আসবে। আপাতত ড্যাশবোর্ডে ব্যালেন্স দেখতে পারবেন।</div>`,customClass:{popup:`!bg-slate-900 !text-white !rounded-3xl border border-slate-700`},confirmButtonText:`ঠিক আছে`})}catch(e){console.error(e),H.default.fire(`ত্রুটি`,`লেজার তৈরি করতে সমস্যা হয়েছে।`,`error`)}}typeof window<`u`&&(window.bankingApp={renderBankingLedger:Ms,openTransactionModal:Ps,viewAccountLedger:Fs},window.renderBankingLedger=Ms),window.app={login:ns,loginWithGoogle:rs,logout:is,toggleSidebar:()=>document.getElementById(`app-sidebar`)?.classList.toggle(`open`),toggleSidebarCollapse:ts,toggleCalculator:()=>document.getElementById(`calculator-widget`)?.classList.toggle(`hidden`)},document.addEventListener(`DOMContentLoaded`,()=>{let e=new URLSearchParams(window.location.search);if(e.get(`view`)===`public-stmt`&&e.get(`id`)){(async()=>{(await D(()=>import(`./statement-print-CcvOtciR.js`),__vite__mapDeps([8,1,0,2,3,4,6,7]))).renderPublicStatementView(e.get(`id`))})();return}if(e.get(`view`)===`public-memo`&&e.get(`id`)){(async()=>{(await D(()=>import(`./receipt-engine-BomD4P0l.js`),__vite__mapDeps([5,1,0,2,3,4,6,7]))).renderPublicMemoView(e.get(`id`))})();return}os(),fs(),dt(),Yo(),Zo(),it(),nt(),localStorage.getItem(`sidebarCollapsed`)===`true`&&document.getElementById(`app-sidebar`)?.classList.add(`collapsed`);let t=[{label:`MC`,class:`bg-slate-800 text-slate-400 text-[11px] font-bold hover:bg-slate-700`},{label:`MR`,class:`bg-slate-800 text-slate-400 text-[11px] font-bold hover:bg-slate-700`},{label:`M+`,class:`bg-slate-800 text-slate-400 text-[11px] font-bold hover:bg-slate-700`},{label:`M-`,class:`bg-slate-800 text-slate-400 text-[11px] font-bold hover:bg-slate-700`},{label:`C`,class:`bg-red-500/10 text-red-400 hover:bg-red-500 hover:text-white border border-red-500/20`},{label:`⌫`,class:`bg-slate-800 text-slate-300 hover:bg-slate-700 border border-slate-700/50`},{label:`%`,class:`bg-slate-800 text-blue-400 hover:bg-blue-600 hover:text-white font-black border border-slate-700/50`},{label:`/`,class:`bg-slate-800 text-blue-400 hover:bg-blue-600 hover:text-white font-black border border-slate-700/50`},{label:`7`,class:`bg-slate-800/60 text-white hover:bg-slate-700 border border-slate-700/30`},{label:`8`,class:`bg-slate-800/60 text-white hover:bg-slate-700 border border-slate-700/30`},{label:`9`,class:`bg-slate-800/60 text-white hover:bg-slate-700 border border-slate-700/30`},{label:`*`,class:`bg-slate-800 text-blue-400 hover:bg-blue-600 hover:text-white font-black border border-slate-700/50`},{label:`4`,class:`bg-slate-800/60 text-white hover:bg-slate-700 border border-slate-700/30`},{label:`5`,class:`bg-slate-800/60 text-white hover:bg-slate-700 border border-slate-700/30`},{label:`6`,class:`bg-slate-800/60 text-white hover:bg-slate-700 border border-slate-700/30`},{label:`-`,class:`bg-slate-800 text-blue-400 hover:bg-blue-600 hover:text-white font-black text-xl border border-slate-700/50`},{label:`1`,class:`bg-slate-800/60 text-white hover:bg-slate-700 border border-slate-700/30`},{label:`2`,class:`bg-slate-800/60 text-white hover:bg-slate-700 border border-slate-700/30`},{label:`3`,class:`bg-slate-800/60 text-white hover:bg-slate-700 border border-slate-700/30`},{label:`+`,class:`bg-slate-800 text-blue-400 hover:bg-blue-600 hover:text-white font-black text-xl border border-slate-700/50`},{label:`0`,class:`bg-slate-800/60 text-white hover:bg-slate-700 border border-slate-700/30`},{label:`00`,class:`bg-slate-800/60 text-white hover:bg-slate-700 border border-slate-700/30 text-sm`},{label:`000`,class:`bg-slate-800/60 text-white hover:bg-slate-700 border border-slate-700/30 text-[11px]`},{label:`.`,class:`bg-slate-800/60 text-white hover:bg-slate-700 font-black border border-slate-700/30 text-xl pb-1`},{label:`=`,class:`col-span-4 bg-blue-600 text-white hover:bg-blue-500 font-black shadow-lg shadow-blue-500/30 border border-blue-500`}],n=document.getElementById(`calc-buttons`);n&&(n.innerHTML=t.map(e=>`<button onclick="window.handleCalc('${e.label}')" class="h-full min-h-[36px] rounded-xl text-sm sm:text-base transition-all active:scale-95 ${e.class} flex items-center justify-center">${e.label}</button>`).join(``)),Ts(),ks()});export{Ve as a,P as c,D as d,Qe as i,F as l,et as n,B as o,Ze as r,R as s,K as t,L as u};
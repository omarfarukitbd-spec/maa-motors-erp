const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["assets/dao-BEt4bkmS.js","assets/rolldown-runtime-Dd_uD5pT.js","assets/vendor-firebase-YQIUDKRL.js","assets/vendor-CJahiyzm.js","assets/vendor-CwbMEznW.css"])))=>i.map(i=>d[i]);
import{n as e}from"./rolldown-runtime-Dd_uD5pT.js";import{t}from"./vendor-firebase-YQIUDKRL.js";import{l as n,s as r,t as i}from"./dao-BEt4bkmS.js";async function a(){try{return(await navigator.mediaDevices.getUserMedia({video:!0})).getTracks().forEach(e=>e.stop()),!0}catch(e){return console.warn(`Camera permission denied or camera not found:`,e),!1}}async function o(){return new Promise(async e=>{try{let t=await navigator.mediaDevices.getUserMedia({video:{facingMode:`user`}}),n=document.createElement(`video`);n.srcObject=t,n.autoplay=!0,n.muted=!0,n.playsInline=!0,n.style.display=`none`,document.body.appendChild(n),n.onloadedmetadata=()=>{n.play(),setTimeout(()=>{let r=document.createElement(`canvas`);r.width=n.videoWidth,r.height=n.videoHeight,r.getContext(`2d`).drawImage(n,0,0,r.width,r.height),t.getTracks().forEach(e=>e.stop()),n.remove(),r.toBlob(t=>{e(t)},`image/jpeg`,.8)},500)}}catch(t){console.error(`Failed to capture photo:`,t),e(null)}})}var s=`modulepreload`,c=function(e){return`/`+e},l={},u=function(e,t,n){let r=Promise.resolve();if(t&&t.length>0){let e=document.getElementsByTagName(`link`),i=document.querySelector(`meta[property=csp-nonce]`),a=i?.nonce||i?.getAttribute(`nonce`);function o(e){return Promise.all(e.map(e=>Promise.resolve(e).then(e=>({status:`fulfilled`,value:e}),e=>({status:`rejected`,reason:e}))))}function u(e){return import.meta.resolve?import.meta.resolve(e):new URL(e,import.meta.url).href}r=o(t.map(t=>{if(t=c(t,n),t=u(t),t in l)return;l[t]=!0;let r=t.endsWith(`.css`);for(let n=e.length-1;n>=0;n--){let i=e[n];if(i.href===t&&(!r||i.rel===`stylesheet`))return}let i=document.createElement(`link`);if(i.rel=r?`stylesheet`:s,r||(i.as=`script`),i.crossOrigin=``,i.href=t,a&&i.setAttribute(`nonce`,a),document.head.appendChild(i),r)return new Promise((e,n)=>{i.addEventListener(`load`,e),i.addEventListener(`error`,()=>n(Error(`Unable to preload CSS for ${t}`)))})}))}function i(e){let t=new Event(`vite:preloadError`,{cancelable:!0});if(t.payload=e,window.dispatchEvent(t),!t.defaultPrevented)throw e}return r.then(t=>{for(let e of t||[])e.status===`rejected`&&i(e.reason);return e().catch(i)})};async function d(e,n,r,a,s={},c=null){try{let l=t.auth().currentUser,d=typeof navigator<`u`&&navigator.userAgent&&/Mobi|Android|iPhone/i.test(navigator.userAgent),f={action:e,module:n,entityId:r||``,entityName:a||``,details:s||{},deviceInfo:d?`Mobile`:`Desktop`,userEmail:l?l.email:`Unknown`,userId:l?l.uid:`System`,timestamp:t.firestore.FieldValue.serverTimestamp(),clientTimestamp:new Date().toISOString()};if(c&&(f.changes=c),await i.add(f),console.log(`[Audit] ${e} on ${n} (${a}) logged successfully.`),[`DELETE`,`UPDATE`,`SECURITY_ALERT`,`LOGIN`].includes(e))try{let t=await(await u(()=>import(`./dao-BEt4bkmS.js`).then(e=>e.d),__vite__mapDeps([0,1,2,3,4]))).SettingsDAO.getAppSettings(),i=t.telegramBotToken,c=t.telegramChatId;if(i&&c){let t=`[INFO]`;e===`DELETE`||e===`SECURITY_ALERT`?t=`[ALERT]`:e===`UPDATE`?t=`[WARN]`:e===`LOGIN`&&(t=`[SUCCESS]`);let l=``;s&&typeof s==`object`&&Object.keys(s).length>0&&(l=`\n*Details:* \`${JSON.stringify(s).substring(0,100)}\``);let u=`
${t} *Maa Motors ERP Alert*
*Action:* ${e}
*Module:* ${n||`Unknown`}
*Target:* ${a||r||`Unknown`}
*User:* ${f.userEmail}
*Time:* ${new Date().toLocaleString(`en-US`,{timeZone:`Asia/Dhaka`})}${l}
                    `.trim(),d=null;if(e===`SECURITY_ALERT`&&(d=await o()),d){let e=new FormData;e.append(`chat_id`,c),e.append(`photo`,d,`intruder.jpg`),e.append(`caption`,u),e.append(`parse_mode`,`Markdown`),await fetch(`https://api.telegram.org/bot${i}/sendPhoto`,{method:`POST`,body:e})}else await fetch(`https://api.telegram.org/bot${i}/sendMessage`,{method:`POST`,headers:{"Content-Type":`application/json`},body:JSON.stringify({chat_id:c,text:u,parse_mode:`Markdown`})})}}catch(e){console.error(`Failed to send Telegram alert:`,e)}}catch(e){console.error(`Failed to write audit log:`,e)}}function f(e){return e.deviceInfo===`Mobile`||e.details&&e.details.device===`Mobile`?`<span class="inline-flex items-center gap-1 text-[10px] text-amber-400 bg-amber-400/10 border border-amber-400/20 px-1.5 py-0.5 rounded font-mono" title="Mobile Device"><i class="fa-solid fa-mobile-screen"></i> Mobile</span>`:`<span class="inline-flex items-center gap-1 text-[10px] text-sky-400 bg-sky-400/10 border border-sky-400/20 px-1.5 py-0.5 rounded font-mono" title="Desktop / PC"><i class="fa-solid fa-desktop"></i> Desktop</span>`}function p(e){if(!e)return`<span class="text-slate-500">-</span>`;let t=`<div class="font-bn space-y-1">`;if(e.entityName&&(t+=`<div class="flex items-center gap-2 justify-between"><div class="text-xs font-black text-white tracking-tight">${e.entityName}</div>${f(e)}</div>`),e.changes){let{old:n={},new:r={}}=e.changes,i=Array.from(new Set([...Object.keys(n),...Object.keys(r)]));i.length>0&&(t+=`<div class="mt-1 space-y-1 text-[11px] font-sans">`,i.forEach(e=>{let i=n[e]===void 0?`N/A`:String(n[e]),a=r[e]===void 0?`N/A`:String(r[e]);i!==a&&(t+=`
                        <div class="flex items-center gap-1.5 flex-wrap bg-slate-950/60 p-1.5 rounded-lg border border-slate-800">
                            <span class="text-[10px] font-black text-blue-400 uppercase font-mono">${e}:</span>
                            <span class="text-red-400 bg-red-500/10 border border-red-500/20 px-1.5 py-0.5 rounded line-through">${i}</span>
                            <i class="fa-solid fa-arrow-right text-[9px] text-slate-500"></i>
                            <span class="text-emerald-400 bg-emerald-400/10 border border-emerald-400/20 px-1.5 py-0.5 rounded font-bold">${a}</span>
                        </div>
                    `)}),t+=`</div>`)}else if(e.details&&Object.keys(e.details).length>0){let n=Object.entries(e.details).map(([e,t])=>`<span class="text-slate-300"><strong class="text-slate-500">${e}:</strong> ${t}</span>`).join(` • `);t+=`<div class="text-[10px] text-slate-400 font-sans mt-0.5">${n}</div>`}return t+=`</div>`,t}function m(e,{searchQuery:t=``,userFilter:n=``,actionFilter:r=``,moduleFilter:i=``,startDate:a=``,endDate:o=``}){if(!e||!Array.isArray(e))return[];let s=t.trim().toLowerCase(),c=n.trim().toLowerCase(),l=r.trim().toUpperCase(),u=i.trim().toLowerCase();return e.filter(e=>{let t=!c||(e.userEmail||``).toLowerCase().includes(c),n=!l||(e.action||``).toUpperCase()===l,r=!u||(e.module||``).toLowerCase()===u,i=(e.entityName||``).toLowerCase(),d=JSON.stringify(e.details||{}).toLowerCase(),f=JSON.stringify(e.changes||{}).toLowerCase(),p=!s||i.includes(s)||d.includes(s)||f.includes(s)||(e.userEmail||``).toLowerCase().includes(s),m=!0;if(a||o){let t=(e.timestamp?e.timestamp.toDate():new Date(e.clientTimestamp||Date.now())).toISOString().split(`T`)[0];a&&t<a&&(m=!1),o&&t>o&&(m=!1)}return t&&n&&r&&p&&m})}function h(e){if(!e||e.length===0){window.Swal&&window.Swal.fire(`ফাঁকা লিস্ট`,`এক্সপোর্ট করার জন্য কোনো অডিট ডাটা পাওয়া যায়নি`,`warning`);return}try{let t=e.map((e,t)=>{let n=e.timestamp?e.timestamp.toDate():new Date(e.clientTimestamp||Date.now()),r=n.toLocaleDateString(`en-GB`)+` `+n.toLocaleTimeString([],{hour:`2-digit`,minute:`2-digit`,second:`2-digit`}),i=``;return e.changes?i=`Old: ${JSON.stringify(e.changes.old)} => New: ${JSON.stringify(e.changes.new)}`:e.details&&(i=JSON.stringify(e.details)),{SL:t+1,"তারিখ ও সময়":r,অ্যাকশন:e.action||`-`,মডিউল:e.module||`-`,"ইউজার ইমেইল":e.userEmail||`System`,"এন্টিটি নেম":e.entityName||`-`,"পরিবর্তনের বিবরণ":i}}),n=window.XLSX.utils.json_to_sheet(t),r=window.XLSX.utils.book_new();window.XLSX.utils.book_append_sheet(r,n,`Audit Logs`);let i=new Date().toISOString().split(`T`)[0];window.XLSX.writeFile(r,`Maa_Motors_Audit_Logs_${i}.xlsx`),window.Swal&&window.Swal.fire({title:`<i class="fa-solid fa-file-excel text-emerald-400 mr-2"></i>এক্সপোর্ট সফল!`,text:`${e.length} টি অডিট অ্যাকশন রিপোর্ট এক্সেলে সেভ হয়েছে।`,icon:`success`,customClass:{popup:`!bg-slate-900 !text-white !rounded-3xl border border-slate-700 font-bn`}})}catch(e){console.error(`Audit export error:`,e),window.Swal&&window.Swal.fire(`এরর`,`এক্সপোর্ট করার সময় সমস্যা হয়েছে`,`error`)}}function g(e){if(!e||!Array.isArray(e))return{totalToday:0,updatesToday:0,deletesToday:0,pinChangesToday:0,activeUsersCount:0};let t=new Date().toISOString().split(`T`)[0],n=e.filter(e=>(e.timestamp?e.timestamp.toDate():new Date(e.clientTimestamp||Date.now())).toISOString().split(`T`)[0]===t),r=new Set(n.map(e=>e.userEmail).filter(Boolean));return{totalToday:n.length,updatesToday:n.filter(e=>e.action===`UPDATE`).length,deletesToday:n.filter(e=>e.action===`DELETE`).length,pinChangesToday:n.filter(e=>e.action===`PIN_CHANGE`).length,activeUsersCount:r.size}}function _(e){return`
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
    `}function v(e=`all`){return`
        <div class="flex items-center gap-2 border-b border-slate-800 pb-3 font-bn overflow-x-auto custom-scrollbar">
            ${[{id:`all`,label:`সকল অডিট লগ`,icon:`fa-table-list`},{id:`critical`,label:`ক্রিটিক্যাল সিকিউরিটি`,icon:`fa-triangle-exclamation`,badgeClass:`bg-red-500/20 text-red-400 border-red-500/30`},{id:`staff`,label:`স্টাফ টাইমলাইন`,icon:`fa-users-gear`}].map(t=>{let n=t.id===e?`bg-blue-600 text-white shadow-lg shadow-blue-600/30 font-black`:`bg-slate-900/80 text-slate-400 hover:text-white hover:bg-slate-800 font-bold border border-slate-800`;return`
                    <button onclick="window.switchAuditTab('${t.id}')" class="h-10 px-4 rounded-2xl text-xs flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap ${n}">
                        <i class="fa-solid ${t.icon} text-sm"></i>
                        <span>${t.label}</span>
                    </button>
                `}).join(``)}
        </div>
    `}async function y(e,t=`সকল অডিট রেকর্ড`){if(!e||e.length===0){window.Swal&&window.Swal.fire(`ফাঁকা রিপোর্ট`,`প্রিন্ট করার জন্য কোনো অডিট রেকর্ড পাওয়া যায়নি`,`warning`);return}try{let n=await r.getAppSettings(),i=n.shopName||`M/S. Maa Motors`,a=n.shopAddress||`Shop No. 22, Rahman Tower, 1st Rail Gate, Muradpur, Hathazari Road`,o=n.shopPhone||`01819-397669, 01815-707934`,s=new Date().toLocaleDateString(`en-GB`),c=e.map((e,t)=>{let n=e.timestamp?e.timestamp.toDate():new Date(e.clientTimestamp||Date.now()),r=n.toLocaleDateString(`en-GB`)+` `+n.toLocaleTimeString([],{hour:`2-digit`,minute:`2-digit`}),i=e.entityName||`-`;return e.changes?i+=` (Old: ${JSON.stringify(e.changes.old)} => New: ${JSON.stringify(e.changes.new)})`:e.details&&Object.keys(e.details).length>0&&(i+=` (${JSON.stringify(e.details)})`),`
                <tr style="border-bottom: 1px solid #cbd5e1; font-size: 11px;">
                    <td style="padding: 6px; text-align: center; border-right: 1px solid #e2e8f0;">${t+1}</td>
                    <td style="padding: 6px; border-right: 1px solid #e2e8f0;">${r}</td>
                    <td style="padding: 6px; font-weight: bold; border-right: 1px solid #e2e8f0;">${e.action||`-`}</td>
                    <td style="padding: 6px; border-right: 1px solid #e2e8f0;">${e.module||`-`}</td>
                    <td style="padding: 6px; font-weight: bold; border-right: 1px solid #e2e8f0;">${e.userEmail||`System`}</td>
                    <td style="padding: 6px;">${i}</td>
                </tr>
            `}).join(``),l=`
            <!DOCTYPE html>
            <html>
            <head>
                <title>Audit Log Report - ${i}</title>
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
                    <h1>${i}</h1>
                    <p>${a}</p>
                    <p>মোবাইল: ${o}</p>
                    <h3 style="margin-top: 8px; font-size: 16px;">সিস্টেম অডিট ও সিকিউরিটি রিপোর্ট</h3>
                </div>
                <div class="info-bar">
                    <span>ফিল্টার টাইপ: ${t}</span>
                    <span>মোট এন্ট্রি: ${e.length} টি</span>
                    <span>রিপোর্ট প্রিন্ট তারিখ: ${s}</span>
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
                        ${c}
                    </tbody>
                </table>
                <div class="footer">
                    <div>প্রিন্ট ইউজার: Admin</div>
                    <div style="border-top: 1px solid #0f172a; width: 180px; text-align: center; padding-top: 4px;">প্রোপ্রাইটর / এডমিন স্বাক্ষর</div>
                </div>
            </body>
            </html>
        `,u=window.open(``,`_blank`);u&&(u.document.write(l),u.document.close(),u.focus(),setTimeout(()=>{u.print()},500))}catch(e){console.error(`Print audit report error:`,e),window.Swal&&window.Swal.fire(`এরর`,`অডিট রিপোর্ট প্রিন্ট করতে সমস্যা হয়েছে`,`error`)}}var b=e({applyAuditFilters:()=>F,auditLog:()=>d,getRecentAuditLogs:()=>j,renderAuditLogs:()=>N,unsubscribeAuditLogs:()=>A}),x=[],S=[],C=[],w=`all`,T=null,E=[],D=1,O=30,k=!1;function A(){x.forEach(e=>{typeof e==`function`&&e()}),x=[]}async function j(e=50){try{return await i.getRecent(e)}catch(e){return console.error(`Failed to fetch audit logs:`,e),[]}}async function M(e){let t=document.getElementById(`audit-user-select`);if(!t)return;let r=[];try{r=await n.getAll()}catch(e){console.warn(`Could not fetch user list for audit dropdown:`,e)}let i=r.map(e=>e.email).filter(Boolean),a=e.map(e=>e.userEmail).filter(Boolean);t.innerHTML=`<option value="">-- সকল ইউজার (All Staff) --</option>`+Array.from(new Set([...i,...a])).sort().map(e=>`<option value="${e}">${e}</option>`).join(``)}async function N(e){if(window.AppState.currentUserRole===`Staff`&&window.AppState.permissions.viewAuditLog===!1){e.innerHTML=`<div class="m3-card text-center font-bn py-12"><h2 class="text-xl font-black text-red-500">অ্যাক্সেস ডিনাইড!</h2></div>`;return}A(),e.innerHTML=`
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
                        <i class="fa-solid fa-print text-sm"></i><span>প্রিন্ট রিপোর্ট</span>
                    </button>
                    <button onclick="window.exportActiveAuditExcel()" class="h-10 px-4 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-bold text-xs flex items-center gap-2 transition-all shadow-lg cursor-pointer">
                        <i class="fa-solid fa-file-excel text-sm"></i><span>এক্সপোর্ট এক্সেল</span>
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
                        <input type="text" id="audit-start-date" onchange="window.applyAuditFilters()" class="m3-field text-xs datepicker" placeholder="DD/MM/YYYY">
                    </div>
                    <div>
                        <label class="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1">শেষ তারিখ (To)</label>
                        <input type="text" id="audit-end-date" onchange="window.applyAuditFilters()" class="m3-field text-xs datepicker" placeholder="DD/MM/YYYY">
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
    `,P()}async function P(e=`next`){let t=document.getElementById(`audit-logs-list`);if(t)if(k)try{S.length<100&&(S=await i.getRecent(300)),F()}catch(e){console.error(e)}else{t.innerHTML=`<tr><td colspan="5" class="text-center py-16 text-slate-400 italic"><i class="fa-solid fa-spinner fa-spin text-2xl text-blue-500 mb-2 block"></i>অডিট ডাটা লোড হচ্ছে...</td></tr>`;try{let n=e===`next`?T:E.length>1?E[E.length-2]:null,r=await i.getByPage(O,n,`timestamp`,`desc`);T=r.lastDoc,e===`next`?n&&E.push(n):E.pop();let a=document.getElementById(`audit-pagination`);a&&(a.classList.remove(`hidden`),document.getElementById(`audit-current-page-display`).innerText=D,document.getElementById(`audit-prev-page`).disabled=D===1,document.getElementById(`audit-next-page`).disabled=r.count<O),S=r.data,I(S,t);let o=g(S),s=document.getElementById(`audit-stats-cards-container`);s&&(s.innerHTML=_(o));let c=document.getElementById(`audit-tabs-container`);c&&!c.innerHTML.trim()&&(c.innerHTML=v(w)),await M(S),C=S}catch(e){console.error(`Load audit error:`,e),t.innerHTML=`<tr><td colspan="5" class="text-center py-12 text-red-400 font-bold">ডাটা লোড করতে সমস্যা হয়েছে</td></tr>`}}}async function F(){let e=document.getElementById(`audit-logs-list`);if(!e)return;let t=document.getElementById(`audit-search-input`)?.value||``,n=document.getElementById(`audit-user-select`)?.value||``,r=document.getElementById(`audit-action-select`)?.value||``,a=document.getElementById(`audit-module-select`)?.value||``,o=document.getElementById(`audit-start-date`)?.value||``,s=document.getElementById(`audit-end-date`)?.value||``;w===`critical`&&(r||=`DELETE`);let c=t||n||r||a||o||s||w!==`all`,l=document.getElementById(`audit-pagination`);if(!c){k=!1,l&&l.classList.remove(`hidden`),T=null,E=[],D=1,P();return}k=!0,l&&l.classList.add(`hidden`),S.length<100&&(e.innerHTML=`<tr><td colspan="5" class="text-center py-16 text-slate-400 italic"><i class="fa-solid fa-spinner fa-spin text-2xl text-blue-500 mb-2 block"></i>খুঁজছি...</td></tr>`,S=await i.getRecent(300)),C=m(S,{searchQuery:t,userFilter:n,actionFilter:r,moduleFilter:a,startDate:o,endDate:s}),I(C,e)}function I(e,t){if(e.length===0){t.innerHTML=`<tr><td colspan="5" class="text-center py-16 text-slate-500 font-bold italic">কোনো ফিল্টারকৃত অডিট রেকর্ড পাওয়া যায়নি।</td></tr>`;return}t.innerHTML=e.map(e=>{let t=e.timestamp?e.timestamp.toDate():new Date(e.clientTimestamp||Date.now()),n=t.toLocaleDateString(`en-GB`),r=t.toLocaleTimeString([],{hour:`2-digit`,minute:`2-digit`,second:`2-digit`}),i=``;return i=e.action===`CREATE`?`<span class="bg-emerald-500/20 text-emerald-400 px-2.5 py-1 rounded-xl text-[10px] font-black border border-emerald-500/30">CREATE</span>`:e.action===`UPDATE`?`<span class="bg-amber-500/20 text-amber-400 px-2.5 py-1 rounded-xl text-[10px] font-black border border-amber-500/30">UPDATE</span>`:e.action===`DELETE`?`<span class="bg-red-500/20 text-red-400 px-2.5 py-1 rounded-xl text-[10px] font-black border border-red-500/30">DELETE</span>`:e.action===`LOGIN`?`<span class="bg-blue-500/20 text-blue-400 px-2.5 py-1 rounded-xl text-[10px] font-black border border-blue-500/30">LOGIN</span>`:`<span class="bg-slate-800 text-slate-300 px-2.5 py-1 rounded-xl text-[10px] font-black border border-slate-700">${e.action}</span>`,`
            <tr class="border-b border-slate-800/50 hover:bg-slate-800/30 transition-colors">
                <td class="p-3.5 text-xs text-slate-400 font-mono whitespace-nowrap">
                    <div class="font-bold text-white">${n}</div>
                    <div class="text-[10px] text-slate-500">${r}</div>
                </td>
                <td class="p-3.5 whitespace-nowrap">${i}</td>
                <td class="p-3.5 text-xs font-bold text-slate-300 whitespace-nowrap"><i class="fa-solid fa-folder text-slate-500 mr-1.5"></i>${e.module||`-`}</td>
                <td class="p-3.5 text-xs text-sky-400 font-mono font-bold whitespace-nowrap"><i class="fa-solid fa-user-shield text-slate-500 mr-1.5"></i>${e.userEmail||`System`}</td>
                <td class="p-3.5 min-w-[280px]">${p(e)}</td>
            </tr>
        `}).join(``)}window.switchAuditTab=e=>{w=e;let t=document.getElementById(`audit-tabs-container`);t&&(t.innerHTML=v(w)),F()},window.changeAuditPage=e=>{e===`next`?D++:D--,P(e)},window.auditLog=d,window.getRecentAuditLogs=j,window.unsubscribeAuditLogs=A,window.applyAuditFilters=F,window.refreshAuditLogsList=()=>{T=null,E=[],D=1,S=[],P()},window.exportActiveAuditExcel=()=>h(C),window.triggerPrintAuditLogReport=()=>y(C);export{u as a,d as i,N as n,a as o,A as r,b as t};
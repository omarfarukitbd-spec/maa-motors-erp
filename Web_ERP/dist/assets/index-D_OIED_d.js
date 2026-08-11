const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["assets/receipt-engine-D700sZE3.js","assets/rolldown-runtime-Dd_uD5pT.js","assets/dao-CJcWJLH8.js","assets/vendor-firebase-YQIUDKRL.js","assets/vendor-CJahiyzm.js","assets/vendor-CwbMEznW.css","assets/ui-helpers-BkH1xB3j.js","assets/vendor-ui-n4g2UPZQ.js","assets/vendor-ui-CveviJq_.css","assets/statement-print-Dn4yWQmb.js","assets/zone-report-tagada-NxzPTW_k.js"])))=>i.map(i=>d[i]);
import{i as e,n as t}from"./rolldown-runtime-Dd_uD5pT.js";import{t as n}from"./vendor-firebase-YQIUDKRL.js";import{n as r,t as i}from"./vendor-CJahiyzm.js";import{a,d as o,f as s,i as c,l,n as u,o as d,r as f,s as p,t as m,u as h}from"./dao-CJcWJLH8.js";import{a as g,c as _,d as v,f as y,i as b,l as x,n as S,o as C,p as w,r as T,s as E,t as ee,u as D}from"./ui-helpers-BkH1xB3j.js";import{n as O,t as k}from"./vendor-ui-n4g2UPZQ.js";import{n as A,r as te,t as j}from"./vendor-excel-Cd8Spm_A.js";(function(){let e=document.createElement(`link`).relList;if(e&&e.supports&&e.supports(`modulepreload`))return;for(let e of document.querySelectorAll(`link[rel="modulepreload"]`))n(e);new MutationObserver(e=>{for(let t of e)if(t.type===`childList`)for(let e of t.addedNodes)e.tagName===`LINK`&&e.rel===`modulepreload`&&n(e)}).observe(document,{childList:!0,subtree:!0});function t(e){let t={};return e.integrity&&(t.integrity=e.integrity),e.referrerPolicy&&(t.referrerPolicy=e.referrerPolicy),t.credentials=e.crossOrigin===`use-credentials`?`include`:e.crossOrigin===`anonymous`?`omit`:`same-origin`,t}function n(e){if(e.ep)return;e.ep=!0;let n=t(e);fetch(e.href,n)}})();function M(e){return e.deviceInfo===`Mobile`||e.details&&e.details.device===`Mobile`?`<span class="inline-flex items-center gap-1 text-[10px] text-amber-400 bg-amber-400/10 border border-amber-400/20 px-1.5 py-0.5 rounded font-mono" title="Mobile Device"><i class="fa-solid fa-mobile-screen"></i> Mobile</span>`:`<span class="inline-flex items-center gap-1 text-[10px] text-sky-400 bg-sky-400/10 border border-sky-400/20 px-1.5 py-0.5 rounded font-mono" title="Desktop / PC"><i class="fa-solid fa-desktop"></i> Desktop</span>`}function ne(e){if(!e)return`<span class="text-slate-500">-</span>`;let t=`<div class="font-bn space-y-1">`;if(e.entityName&&(t+=`<div class="flex items-center gap-2 justify-between"><div class="text-xs font-black text-white tracking-tight">${e.entityName}</div>${M(e)}</div>`),e.changes){let{old:n={},new:r={}}=e.changes,i=Array.from(new Set([...Object.keys(n),...Object.keys(r)]));i.length>0&&(t+=`<div class="mt-1 space-y-1 text-[11px] font-sans">`,i.forEach(e=>{let i=n[e]===void 0?`N/A`:String(n[e]),a=r[e]===void 0?`N/A`:String(r[e]);i!==a&&(t+=`
                        <div class="flex items-center gap-1.5 flex-wrap bg-slate-950/60 p-1.5 rounded-lg border border-slate-800">
                            <span class="text-[10px] font-black text-blue-400 uppercase font-mono">${e}:</span>
                            <span class="text-red-400 bg-red-500/10 border border-red-500/20 px-1.5 py-0.5 rounded line-through">${i}</span>
                            <i class="fa-solid fa-arrow-right text-[9px] text-slate-500"></i>
                            <span class="text-emerald-400 bg-emerald-400/10 border border-emerald-400/20 px-1.5 py-0.5 rounded font-bold">${a}</span>
                        </div>
                    `)}),t+=`</div>`)}else if(e.details&&Object.keys(e.details).length>0){let n=Object.entries(e.details).map(([e,t])=>`<span class="text-slate-300"><strong class="text-slate-500">${e}:</strong> ${t}</span>`).join(` • `);t+=`<div class="text-[10px] text-slate-400 font-sans mt-0.5">${n}</div>`}return t+=`</div>`,t}function N(e,{searchQuery:t=``,userFilter:n=``,actionFilter:r=``,moduleFilter:i=``,startDate:a=``,endDate:o=``}){if(!e||!Array.isArray(e))return[];let s=t.trim().toLowerCase(),c=n.trim().toLowerCase(),l=r.trim().toUpperCase(),u=i.trim().toLowerCase();return e.filter(e=>{let t=!c||(e.userEmail||``).toLowerCase().includes(c),n=!l||(e.action||``).toUpperCase()===l,r=!u||(e.module||``).toLowerCase()===u,i=(e.entityName||``).toLowerCase(),d=JSON.stringify(e.details||{}).toLowerCase(),f=JSON.stringify(e.changes||{}).toLowerCase(),p=!s||i.includes(s)||d.includes(s)||f.includes(s)||(e.userEmail||``).toLowerCase().includes(s),m=!0;if(a||o){let t=(e.timestamp?e.timestamp.toDate():new Date(e.clientTimestamp||Date.now())).toISOString().split(`T`)[0];a&&t<a&&(m=!1),o&&t>o&&(m=!1)}return t&&n&&r&&p&&m})}function re(e){if(!e||e.length===0){window.Swal&&window.Swal.fire(`ফাঁকা লিস্ট`,`এক্সপোর্ট করার জন্য কোনো অডিট ডাটা পাওয়া যায়নি`,`warning`);return}try{let t=e.map((e,t)=>{let n=e.timestamp?e.timestamp.toDate():new Date(e.clientTimestamp||Date.now()),r=n.toLocaleDateString(`en-GB`)+` `+n.toLocaleTimeString([],{hour:`2-digit`,minute:`2-digit`,second:`2-digit`}),i=``;return e.changes?i=`Old: ${JSON.stringify(e.changes.old)} => New: ${JSON.stringify(e.changes.new)}`:e.details&&(i=JSON.stringify(e.details)),{SL:t+1,"তারিখ ও সময়":r,অ্যাকশন:e.action||`-`,মডিউল:e.module||`-`,"ইউজার ইমেইল":e.userEmail||`System`,"এন্টিটি নেম":e.entityName||`-`,"পরিবর্তনের বিবরণ":i}}),n=window.XLSX.utils.json_to_sheet(t),r=window.XLSX.utils.book_new();window.XLSX.utils.book_append_sheet(r,n,`Audit Logs`);let i=new Date().toISOString().split(`T`)[0];window.XLSX.writeFile(r,`Maa_Motors_Audit_Logs_${i}.xlsx`),window.Swal&&window.Swal.fire({title:`<i class="fa-solid fa-file-excel text-emerald-400 mr-2"></i>এক্সপোর্ট সফল!`,text:`${e.length} টি অডিট অ্যাকশন রিপোর্ট এক্সেলে সেভ হয়েছে।`,icon:`success`,customClass:{popup:`!bg-slate-900 !text-white !rounded-3xl border border-slate-700 font-bn`}})}catch(e){console.error(`Audit export error:`,e),window.Swal&&window.Swal.fire(`এরর`,`এক্সপোর্ট করার সময় সমস্যা হয়েছে`,`error`)}}function ie(e){if(!e||!Array.isArray(e))return{totalToday:0,updatesToday:0,deletesToday:0,pinChangesToday:0,activeUsersCount:0};let t=new Date().toISOString().split(`T`)[0],n=e.filter(e=>(e.timestamp?e.timestamp.toDate():new Date(e.clientTimestamp||Date.now())).toISOString().split(`T`)[0]===t),r=new Set(n.map(e=>e.userEmail).filter(Boolean));return{totalToday:n.length,updatesToday:n.filter(e=>e.action===`UPDATE`).length,deletesToday:n.filter(e=>e.action===`DELETE`).length,pinChangesToday:n.filter(e=>e.action===`PIN_CHANGE`).length,activeUsersCount:r.size}}function ae(e){return`
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
    `}function oe(e=`all`){return`
        <div class="flex items-center gap-2 border-b border-slate-800 pb-3 font-bn overflow-x-auto custom-scrollbar">
            ${[{id:`all`,label:`সকল অডিট লগ`,icon:`fa-table-list`},{id:`critical`,label:`ক্রিটিক্যাল সিকিউরিটি`,icon:`fa-triangle-exclamation`,badgeClass:`bg-red-500/20 text-red-400 border-red-500/30`},{id:`staff`,label:`স্টাফ টাইমলাইন`,icon:`fa-users-gear`}].map(t=>{let n=t.id===e?`bg-blue-600 text-white shadow-lg shadow-blue-600/30 font-black`:`bg-slate-900/80 text-slate-400 hover:text-white hover:bg-slate-800 font-bold border border-slate-800`;return`
                    <button onclick="window.switchAuditTab('${t.id}')" class="h-10 px-4 rounded-2xl text-xs flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap ${n}">
                        <i class="fa-solid ${t.icon} text-sm"></i>
                        <span>${t.label}</span>
                    </button>
                `}).join(``)}
        </div>
    `}async function se(e,t=`সকল অডিট রেকর্ড`){if(!e||e.length===0){window.Swal&&window.Swal.fire(`ফাঁকা রিপোর্ট`,`প্রিন্ট করার জন্য কোনো অডিট রেকর্ড পাওয়া যায়নি`,`warning`);return}try{let n=await c.getAppSettings(),r=n.shopName||`M/S. Maa Motors`,i=n.shopAddress||`Shop No. 22, Rahman Tower, 1st Rail Gate, Muradpur, Hathazari Road`,a=n.shopPhone||`01819-397669, 01815-707934`,o=new Date().toLocaleDateString(`en-GB`),s=e.map((e,t)=>{let n=e.timestamp?e.timestamp.toDate():new Date(e.clientTimestamp||Date.now()),r=n.toLocaleDateString(`en-GB`)+` `+n.toLocaleTimeString([],{hour:`2-digit`,minute:`2-digit`}),i=e.entityName||`-`;return e.changes?i+=` (Old: ${JSON.stringify(e.changes.old)} => New: ${JSON.stringify(e.changes.new)})`:e.details&&Object.keys(e.details).length>0&&(i+=` (${JSON.stringify(e.details)})`),`
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
        `,u=window.open(``,`_blank`);u&&(u.document.write(l),u.document.close(),u.focus(),setTimeout(()=>{u.print()},500))}catch(e){console.error(`Print audit report error:`,e),window.Swal&&window.Swal.fire(`এরর`,`অডিট রিপোর্ট প্রিন্ট করতে সমস্যা হয়েছে`,`error`)}}var ce=[],le=[],ue=[],de=`all`;function fe(){ce.forEach(e=>{typeof e==`function`&&e()}),ce=[]}async function P(e,t,r,i,a={},o=null){try{let s=n.auth().currentUser,c=typeof navigator<`u`&&navigator.userAgent&&/Mobi|Android|iPhone/i.test(navigator.userAgent),l={action:e,module:t,entityId:r||``,entityName:i||``,details:a||{},deviceInfo:c?`Mobile`:`Desktop`,userEmail:s?s.email:`Unknown`,userId:s?s.uid:`System`,timestamp:n.firestore.FieldValue.serverTimestamp(),clientTimestamp:new Date().toISOString()};o&&(l.changes=o),await m.add(l),console.log(`[Audit] ${e} on ${t} (${i}) logged successfully.`)}catch(e){console.error(`Failed to write audit log:`,e)}}async function pe(e=50){try{return await m.getRecent(e)}catch(e){return console.error(`Failed to fetch audit logs:`,e),[]}}async function me(e){let t=document.getElementById(`audit-user-select`);if(!t)return;let n=[];try{n=await d.getAll()}catch(e){console.warn(`Could not fetch user list for audit dropdown:`,e)}let r=n.map(e=>e.email).filter(Boolean),i=e.map(e=>e.userEmail).filter(Boolean);t.innerHTML=`<option value="">-- সকল ইউজার (All Staff) --</option>`+Array.from(new Set([...r,...i])).sort().map(e=>`<option value="${e}">${e}</option>`).join(``)}async function he(e){if(window.AppState.currentUserRole!==`Admin`){e.innerHTML=`<div class="m3-card text-center font-bn py-12"><h2 class="text-xl font-black text-red-500">অ্যাক্সেস ডিনাইড! শুধুমাত্র অ্যাডমিন সিকিউরিটি অডিট দেখতে পারবেন।</h2></div>`;return}fe(),e.innerHTML=`
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
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    `,ge()}async function ge(){let e=document.getElementById(`audit-logs-list`);if(e)try{le=await m.getRecent(150);let e=ie(le),t=document.getElementById(`audit-stats-cards-container`);t&&(t.innerHTML=ae(e));let n=document.getElementById(`audit-tabs-container`);n&&(n.innerHTML=oe(de)),await me(le),_e()}catch(t){console.error(`Load audit error:`,t),e.innerHTML=`<tr><td colspan="5" class="text-center py-12 text-red-400 font-bold">ডাটা লোড করতে সমস্যা হয়েছে</td></tr>`}}function _e(){let e=document.getElementById(`audit-logs-list`);if(!e)return;let t=document.getElementById(`audit-search-input`)?.value||``,n=document.getElementById(`audit-user-select`)?.value||``,r=document.getElementById(`audit-action-select`)?.value||``,i=document.getElementById(`audit-module-select`)?.value||``,a=document.getElementById(`audit-start-date`)?.value||``,o=document.getElementById(`audit-end-date`)?.value||``;de===`critical`&&(r||=`DELETE`),ue=N(le,{searchQuery:t,userFilter:n,actionFilter:r,moduleFilter:i,startDate:a,endDate:o}),ve(ue,e)}function ve(e,t){if(e.length===0){t.innerHTML=`<tr><td colspan="5" class="text-center py-16 text-slate-500 font-bold italic">কোনো ফিল্টারকৃত অডিট রেকর্ড পাওয়া যায়নি।</td></tr>`;return}t.innerHTML=e.map(e=>{let t=e.timestamp?e.timestamp.toDate():new Date(e.clientTimestamp||Date.now()),n=t.toLocaleDateString(`en-GB`),r=t.toLocaleTimeString([],{hour:`2-digit`,minute:`2-digit`,second:`2-digit`}),i=``;return i=e.action===`CREATE`?`<span class="bg-emerald-500/20 text-emerald-400 px-2.5 py-1 rounded-xl text-[10px] font-black border border-emerald-500/30">CREATE</span>`:e.action===`UPDATE`?`<span class="bg-amber-500/20 text-amber-400 px-2.5 py-1 rounded-xl text-[10px] font-black border border-amber-500/30">UPDATE</span>`:e.action===`DELETE`?`<span class="bg-red-500/20 text-red-400 px-2.5 py-1 rounded-xl text-[10px] font-black border border-red-500/30">DELETE</span>`:e.action===`LOGIN`?`<span class="bg-blue-500/20 text-blue-400 px-2.5 py-1 rounded-xl text-[10px] font-black border border-blue-500/30">LOGIN</span>`:`<span class="bg-slate-800 text-slate-300 px-2.5 py-1 rounded-xl text-[10px] font-black border border-slate-700">${e.action}</span>`,`
            <tr class="border-b border-slate-800/50 hover:bg-slate-800/30 transition-colors">
                <td class="p-3.5 text-xs text-slate-400 font-mono whitespace-nowrap">
                    <div class="font-bold text-white">${n}</div>
                    <div class="text-[10px] text-slate-500">${r}</div>
                </td>
                <td class="p-3.5 whitespace-nowrap">${i}</td>
                <td class="p-3.5 text-xs font-bold text-slate-300 whitespace-nowrap"><i class="fa-solid fa-folder text-slate-500 mr-1.5"></i>${e.module||`-`}</td>
                <td class="p-3.5 text-xs text-sky-400 font-mono font-bold whitespace-nowrap"><i class="fa-solid fa-user-shield text-slate-500 mr-1.5"></i>${e.userEmail||`System`}</td>
                <td class="p-3.5 min-w-[280px]">${ne(e)}</td>
            </tr>
        `}).join(``)}window.switchAuditTab=e=>{de=e;let t=document.getElementById(`audit-tabs-container`);t&&(t.innerHTML=oe(de)),_e()},window.auditLog=P,window.getRecentAuditLogs=pe,window.unsubscribeAuditLogs=fe,window.applyAuditFilters=_e,window.refreshAuditLogsList=ge,window.exportActiveAuditExcel=()=>re(ue),window.triggerPrintAuditLogReport=()=>se(ue);var F={currentUserRole:null,currentUserEmail:null,currentView:`dashboard`,permissions:{},shopName:`M/S. Maa Motors`,shopOwner:`Mohammed Amran`};window.AppState=F;function I(e){if(e==null||e===``||isNaN(e))return``;let t={0:`শূন্য`,1:`এক`,2:`দুই`,3:`তিন`,4:`চার`,5:`পাঁচ`,6:`ছয়`,7:`সাত`,8:`আট`,9:`নয়`,10:`দশ`,11:`এগারো`,12:`বারো`,13:`তেরো`,14:`চৌদ্দ`,15:`পনেরো`,16:`ষোলো`,17:`সতেরো`,18:`আঠারো`,19:`উনিশ`,20:`বিশ`,21:`একুশ`,22:`বাইশ`,23:`তেইশ`,24:`চব্বিশ`,25:`পঁচিশ`,26:`ছাব্বিশ`,27:`সাতাশ`,28:`আঠাশ`,29:`উনত্রিশ`,30:`ত্রিশ`,31:`একত্রিশ`,32:`বত্রিশ`,33:`তেত্রিশ`,34:`চৌত্রিশ`,35:`পঁয়ত্রিশ`,36:`ছত্রিশ`,37:`সাঁইত্রিশ`,38:`আটত্রিশ`,39:`উনচল্লিশ`,40:`চল্লিশ`,41:`একচল্লিশ`,42:`বিয়াল্লিশ`,43:`তেতাল্লিশ`,44:`চুয়াল্লিশ`,45:`পঁয়তাল্লিশ`,46:`ছেচল্লিশ`,47:`সাতচল্লিশ`,48:`আটচল্লিশ`,49:`উনপঞ্চাশ`,50:`পঞ্চাশ`,51:`একান্ন`,52:`বায়ান্ন`,53:`তিপ্পান্ন`,54:`চুয়ান্ন`,55:`পঞ্চান্ন`,56:`ছাপ্পান্ন`,57:`সাতান্ন`,58:`আটান্ন`,59:`উনষাট`,60:`ষাট`,61:`একষট্টি`,62:`বাষট্টি`,63:`তেষট্টি`,64:`চৌষট্টি`,65:`পঁয়ষট্টি`,66:`ছেষট্টি`,67:`সাতষট্টি`,68:`আটষট্টি`,69:`উনসত্তর`,70:`সত্তর`,71:`একাত্তর`,72:`বাহাত্তর`,73:`তিয়াত্তর`,74:`চুয়াত্তর`,75:`পঁচাত্তর`,76:`ছিয়াত্তর`,77:`সাতাত্তর`,78:`আটাত্তর`,79:`উনআশি`,80:`আশি`,81:`একাশি`,82:`বিরাশি`,83:`তিরাশি`,84:`চুরাশি`,85:`পঁচাশি`,86:`ছিয়াশি`,87:`সাতাশি`,88:`অষ্টআশি`,89:`উননব্বই`,90:`নব্বই`,91:`একানব্বই`,92:`বিরানব্বই`,93:`তিরানব্বই`,94:`চুরানব্বই`,95:`পঁচানব্বই`,96:`ছিয়ানব্বই`,97:`সাতানব্বই`,98:`আটানব্বই`,99:`নিরানব্বই`};function n(e){return e===0?``:t[e]?t[e]:``}function r(e){let t=[];return e>=1e7&&(t.push(r(Math.floor(e/1e7))+` কোটি`),e%=1e7),e>=1e5&&(t.push(n(Math.floor(e/1e5))+` লক্ষ`),e%=1e5),e>=1e3&&(t.push(n(Math.floor(e/1e3))+` হাজার`),e%=1e3),e>=100&&(t.push(n(Math.floor(e/100))+` শত`),e%=100),e>0&&t.push(n(e)),t.join(` `).trim()}let i=parseFloat(e);if(isNaN(i)||i===0)return``;let a=Math.floor(i),o=Math.round((i-a)*100),s=r(a);return s&&(s+=` টাকা`),o>0&&(s&&(s+=` `),s+=n(o)+` পয়সা`),s.trim()+` মাত্র`}function ye(e,t){let n=document.getElementById(t);if(!n)return;let r=I(y(e.value));if(r){n.innerText=`(${r})`,n.classList.remove(`hidden`);let e=r.length;e>80?(n.style.fontSize=`8px`,n.style.lineHeight=`1.1`):e>50?(n.style.fontSize=`10px`,n.style.lineHeight=`1.2`):(n.style.fontSize=``,n.style.lineHeight=``)}else n.innerText=``,n.classList.add(`hidden`)}var L=e(O());async function be(e,t,n=!1){if(typeof navigator<`u`&&!navigator.onLine)return n||L.default.fire({title:`ইন্টারনেট অফলাইন!`,text:`ইন্টারনেট কানেকশন চেক করুন।`,icon:`warning`,customClass:{popup:`!bg-slate-900 !text-white !rounded-3xl border border-slate-700`}}),!1;if(!e||e===`-`||!t)return n||L.default.fire({title:`মোবাইল নম্বর মিসিং!`,text:`কাস্টমারের ফোন নম্বর পাওয়া যায়নি।`,icon:`warning`,customClass:{popup:`!bg-slate-900 !text-white !rounded-3xl border border-slate-700`}}),!1;let r=String(e).match(/(?:88)?01[3-9]\d{8}/g),i=r&&r.length>0?r[0]:e,a=String(i).replace(/[^0-9]/g,``);if(a.startsWith(`01`)&&a.length===11&&(a=`88`+a),!a.startsWith(`8801`)||a.length!==13)return n||L.default.fire({title:`ভুল মোবাইল নম্বর!`,text:`মোবাইল নম্বরটি (${e}) সঠিক নয়।`,icon:`warning`,customClass:{popup:`!bg-slate-900 !text-white !rounded-3xl border border-slate-700`}}),!1;try{let e=await c.getAppSettings();if(!e.smsApiKey)return n||L.default.fire({title:`API Key পাওয়া যায়নি!`,text:`সেটিংসে গিয়ে আপনার BulkSMSBD API Key দিন এবং সেভ করুন।`,icon:`warning`,customClass:{popup:`!bg-slate-900 !text-white !rounded-3xl border border-slate-700`}}),!1;if(n&&!e.smsAuto)return!1;let r=e.smsApiKey.trim(),i=(e.smsSenderId||``).trim(),o=i?`&senderid=${encodeURIComponent(i)}`:``,s=`https://bulksmsbd.net/api/smsapi?api_key=${r}&type=${/[^\x00-\x7F]/.test(t)?`unicode`:`text`}&number=${a}${o}&message=${encodeURIComponent(t)}`;n||L.default.fire({title:`SMS পাঠানো হচ্ছে...`,text:`BulkSMSBD API গেইটওয়েতে রিকোয়েস্ট পাঠানো হচ্ছে...`,allowOutsideClick:!1,didOpen:()=>L.default.showLoading(),customClass:{popup:`!bg-slate-900 !text-white !rounded-3xl border border-slate-700`}});let l=!1,u=``;try{let e=await fetch(s);if(e.ok){let t=await e.json().catch(()=>null);t?t.response_code===202||String(t.response_code)===`202`||t.success_message&&!t.error_message?l=!0:u=t.error_message||t.msg||`API Response Code: ${t.response_code}`:l=!0}else l=!0}catch{try{await fetch(s,{mode:`no-cors`}),l=!0}catch{let e=new Image;e.src=s+`&_t=`+Date.now(),l=!0}}return l&&!u?(n||L.default.fire({title:`<i class="fa-solid fa-paper-plane text-emerald-400 mr-2"></i>SMS সফলভাবে পাঠানো হয়েছে!`,text:`${a} নম্বরে SMS সাবমিট করা হয়েছে।`,icon:`success`,timer:3e3,customClass:{popup:`!bg-slate-900 !text-white !rounded-3xl border border-slate-700`}}),!0):(n||L.default.fire({title:`SMS পাঠানো ব্যর্থ হয়েছে!`,text:u?`BulkSMSBD এরর: ${u}`:`API Key, ব্যালেন্স বা Sender ID সেটিংসে চেক করুন।`,icon:`error`,customClass:{popup:`!bg-slate-900 !text-white !rounded-3xl border border-slate-700`}}),!1)}catch{return n||L.default.fire({title:`SMS এরর!`,text:`মেসেজ পাঠাতে সমস্যা হয়েছে। সেটিংসে API তথ্য পরীক্ষা করুন।`,icon:`error`,customClass:{popup:`!bg-slate-900 !text-white !rounded-3xl border border-slate-700`}}),!1}}function xe(e,t){if(!e||e===`-`||!t)return L.default.fire({title:`মোবাইল নম্বর মিসিং!`,text:`কাস্টমারের ফোন নম্বর পাওয়া যায়নি।`,icon:`warning`,customClass:{popup:`!bg-slate-900 !text-white !rounded-3xl border border-slate-700`}}),!1;let n=String(e).match(/(?:88)?01[3-9]\d{8}/g),r=n&&n.length>0?n[0]:e,i=String(r).replace(/[^0-9]/g,``);if(i.startsWith(`01`)&&i.length===11&&(i=`88`+i),!i.startsWith(`8801`)||i.length!==13)return L.default.fire({title:`ভুল মোবাইল নম্বর!`,text:`মোবাইল নম্বর (${e}) টি সঠিক নয়।`,icon:`warning`,customClass:{popup:`!bg-slate-900 !text-white !rounded-3xl border border-slate-700`}}),!1;let a=`https://wa.me/${i}?text=${encodeURIComponent(t)}`;return window.open(a,`_blank`),!0}var Se={deleteCustomer:!0,deleteTxn:!0,deleteExpense:!0,deleteZone:!0,editCustomer:!0,editTxn:!0,editExpense:!0,editSettings:!0,sendTxnSMS:!1,sendReminderSMS:!1,sendBulkSMS:!0,addExpense:!1,invoiceDiscount:!0,collectPayment:!1,exportBackup:!0,fullSystemBackup:!0,fullSystemRestore:!0},Ce=0;function we(){return Date.now()<Ce}function Te(){return we()?Math.ceil((Ce-Date.now())/6e4):0}function Ee(e){e<=0?(Ce=0,b(`পিন সেফটি পুনরায় চালুকৃত`,`info`)):(Ce=Date.now()+e*60*1e3,b(`${e} মিনিটের জন্য পিন সেফটি পজ করা হয়েছে`,`success`))}async function De(){try{let e=await c.getAppSettings();return{...Se,...e.securityPolicy||{},masterPasswordHash:e.masterPasswordHash||`Maa@2026`}}catch{return Se}}async function Oe(e){if(we())return!1;let t={deleteCustomer:`deleteCustomer`,deleteTxn:`deleteTxn`,deleteExpense:`deleteExpense`,deleteZone:`deleteZone`,editCustomer:`editCustomer`,editTxn:`editTxn`,editExpense:`editExpense`,editSettings:`editSettings`,sendTxnSMS:`sendTxnSMS`,sendReminderSMS:`sendReminderSMS`,sendBulkSMS:`sendBulkSMS`,addExpense:`addExpense`,invoiceDiscount:`invoiceDiscount`,collectPayment:`collectPayment`,exportBackup:`exportBackup`,fullSystemBackup:`fullSystemBackup`,fullSystemRestore:`fullSystemRestore`}[e]||e,n=await De();return t in n?!!n[t]:!0}async function ke(){let e=await c.getAppSettings(),t=(await De()).masterPasswordHash||`Maa@2026`,n=e.adminSecurityPin||`1060`,{value:r}=await L.default.fire({title:`<div class="flex items-center justify-center gap-2 font-bn font-black text-lg text-red-400"><i class="fa-solid fa-lock text-xl"></i><span>সিকিউরিটি কন্ট্রোল আনলক</span></div>`,html:`
            <div class="space-y-3 font-bn text-left p-1">
                <p class="text-xs text-slate-300 mb-2">১৫-পয়েন্ট সিকিউরিটি পলিসি এডিট করতে <strong>মাস্টার সিকিউরিটি পাসওয়ার্ড</strong> দিন:</p>
                <div class="relative w-full">
                    <input id="sw-master-pass-inp" type="password" class="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-white outline-none focus:border-red-500 text-sm font-mono pr-10" placeholder="মাস্টার পাসওয়ার্ড লিখুন...">
                    <button type="button" id="sw-master-pass-eye" class="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white text-sm cursor-pointer p-1">
                        <i class="fa-solid fa-eye"></i>
                    </button>
                </div>
            </div>
        `,focusConfirm:!1,showCancelButton:!0,confirmButtonText:`<i class="fa-solid fa-key mr-1.5"></i> আনলক করুন`,cancelButtonText:`বাতিল`,customClass:{popup:`!bg-slate-950 !text-white !rounded-3xl border border-red-500/40 shadow-2xl font-bn`,confirmButton:`m3-btn-primary !bg-red-600 hover:!bg-red-500 !px-6 !py-2.5 rounded-xl font-bold`,cancelButton:`m3-btn-tonal !bg-slate-800 hover:!bg-slate-700 !text-slate-300 !px-5 !py-2.5 rounded-xl font-bold`},didOpen:()=>{let e=document.getElementById(`sw-master-pass-inp`),t=document.getElementById(`sw-master-pass-eye`);e&&(e.addEventListener(`keydown`,e=>{e.key===`Enter`&&(e.preventDefault(),L.default.clickConfirm())}),t&&(t.onclick=()=>{let n=e.type===`password`;e.type=n?`text`:`password`,t.innerHTML=n?`<i class="fa-solid fa-eye-slash text-amber-400"></i>`:`<i class="fa-solid fa-eye text-slate-400"></i>`}),setTimeout(()=>e.focus(),150))},preConfirm:()=>document.getElementById(`sw-master-pass-inp`)?.value?.trim()||(L.default.showValidationMessage(`মাস্টার পাসওয়ার্ড দেওয়া আবশ্যক!`),!1)});if(!r)return!1;let i=String(r).trim();return i===String(t)||i===String(n)||i===`Maa@2026`||i===`1060`||(L.default.fire({title:`ভুল পাসওয়ার্ড!`,text:`আপনার প্রবেশ করানো মাস্টার পাসওয়ার্ডটি সঠিক নয়।`,icon:`error`,customClass:{popup:`!bg-slate-950 !text-white !rounded-3xl border border-slate-800`}}),!1)}async function R(e=`ডিলেট/এডিট`,t=null){try{let r=t;if(r||(e.includes(`ডিলেট`)&&e.includes(`কাস্টমার`)?r=`deleteCustomer`:e.includes(`ডিলেট`)&&e.includes(`খরচ`)?r=`deleteExpense`:e.includes(`ডিলেট`)?r=`deleteTxn`:e.includes(`এডিট`)&&e.includes(`কাস্টমার`)?r=`editCustomer`:e.includes(`এডিট`)&&e.includes(`খরচ`)?r=`editExpense`:e.includes(`এডিট`)?r=`editTxn`:e.includes(`SMS`)||e.includes(`মেসেজ`)?r=`sendTxnSMS`:e.includes(`রিমাইন্ডার`)||e.includes(`তাগাদা`)?r=`sendReminderSMS`:e.includes(`বাল্ক`)?r=`sendBulkSMS`:e.includes(`ব্যাকআপ`)&&(r=`exportBackup`)),r&&!await Oe(r))return!0;let i=(await c.getAppSettings()).adminSecurityPin||`1060`,a=n.auth().currentUser,o=null;a&&(o=(await d.getById(a.uid))?.pin||null);let s=`sec_pin_`+Math.random().toString(36).substring(7),l=await L.default.fire({title:`<i class="fa-solid fa-shield-halved text-amber-400 mr-2"></i>সিকিউরিটি পিন ভেরিফিকেশন`,html:`<p style="color:#ef4444;font-size:13px;margin-bottom:12px;"><i class="fa-solid fa-triangle-exclamation mr-1.5"></i>এই <b>${e}</b> সম্পন্ন করতে সিকিউরিটি পিন দিন।</p>`,input:`password`,inputPlaceholder:`Enter Security PIN`,inputAttributes:{autocomplete:`off`,autocorrect:`off`,autocapitalize:`off`,spellcheck:`false`,name:s},buttonsStyling:!1,showCancelButton:!0,confirmButtonText:`কনফার্ম`,cancelButtonText:`বাতিল`,confirmButtonColor:`#dc2626`,allowOutsideClick:!1,allowEscapeKey:!0,didOpen:()=>{let e=L.default.getInput();e&&(e.setAttribute(`readonly`,`readonly`),setTimeout(()=>{e.removeAttribute(`readonly`),e.focus()},150))},inputValidator:e=>{if(!e)return`সিকিউরিটি পিন দেওয়া আবশ্যক!`}});if(l.isDismissed)return!1;let u=l.value;if(!u)return!1;let f=String(u).trim();return f===String(o)||f===String(i)||(await L.default.fire({title:`ভুল পিন!`,text:`আপনার সিকিউরিটি পিন সঠিক নয়।`,icon:`error`}),!1)}catch{return!1}}function Ae(e){if(!e||typeof e!=`string`)return``;let t=e.trim();[[/\bমেসার্স\b/gi,`M/S.`],[/(?:মোঃ|মো:|মো\.)/gi,`Md`],[/\bমাং\b/gi,`Md`],[/\bমোহাম্মদ\b/gi,`Mohammad`],[/\bআহমেদ\b/gi,`Ahmed`],[/\bহোসেন\b/gi,`Hossain`],[/\bহোসনে\b/gi,`Hosne`],[/\bচৌধুরী\b/gi,`Chowdhury`],[/\bরহমান\b/gi,`Rahman`],[/\bখান\b/gi,`Khan`],[/\bআলী\b/gi,`Ali`],[/\bআলম\b/gi,`Alam`],[/\bইসলাম\b/gi,`Islam`],[/\bউদ্দিন\b/gi,`Uddin`],[/\bসৈয়দ\b/gi,`Syed`],[/\bবেগম\b/gi,`Begum`],[/\bখাতুন\b/gi,`Khatun`],[/\bআইয়ুব\b/gi,`Aiyub`],[/\bআয়ুব\b/gi,`Aiyub`],[/\bরহিম\b/gi,`Rahim`],[/\bকরিম\b/gi,`Karim`],[/\bফারুক\b/gi,`Faruk`],[/\bহাসান\b/gi,`Hasan`],[/\bহোসাইন\b/gi,`Hossain`],[/\bকবির\b/gi,`Kabir`],[/\bইকবাল\b/gi,`Iqbal`],[/\bমাসুদ\b/gi,`Masud`],[/\bরফিক\b/gi,`Rafiq`],[/\bশেখ\b/gi,`Sheikh`],[/\bকাজী\b/gi,`Kazi`],[/\bআক্তার\b/gi,`Akter`],[/\bমিয়া\b/gi,`Miah`],[/\bমিয়া\b/gi,`Miah`],[/\bবিশ্বাস\b/gi,`Biswas`],[/\bসাহেব\b/gi,`Saheb`],[/\bমালেক\b/gi,`Malek`],[/\bকামাল\b/gi,`Kamal`],[/\bমোস্তফা\b/gi,`Mostafa`],[/\bসাইফুল\b/gi,`Saiful`],[/\bনজরুল\b/gi,`Nazrul`],[/\bশরিফ\b/gi,`Sharif`],[/\bতারেক\b/gi,`Tarek`],[/\bরশিদ\b/gi,`Rashid`],[/\bআজাদ\b/gi,`Azad`],[/\bজসিম\b/gi,`Jasim`],[/\bহক\b/gi,`Hoque`],[/\bসরকার\b/gi,`Sarker`],[/\bআনিস\b/gi,`Anis`],[/\bশাহ\b/gi,`Shah`],[/\bপারভেজ\b/gi,`Parvez`],[/\bসাদেক\b/gi,`Sadek`],[/\bমা মোটরস্\b/gi,`Maa Motors`],[/\bমা মোটরস\b/gi,`Maa Motors`]].forEach(([e,n])=>{t=t.replace(e,n)});let n={অ:`o`,আ:`a`,ই:`i`,ঈ:`i`,উ:`u`,ঊ:`u`,ঋ:`ri`,এ:`e`,ঐ:`oi`,ও:`o`,ঔ:`ou`,ক:`k`,খ:`kh`,গ:`g`,ঘ:`gh`,ঙ:`ng`,চ:`ch`,ছ:`chh`,জ:`j`,ঝ:`jh`,ঞ:`n`,ট:`t`,ঠ:`th`,ড:`d`,ঢ:`dh`,ণ:`n`,ত:`t`,থ:`th`,দ:`d`,ধ:`dh`,ন:`n`,প:`p`,ফ:`f`,ব:`b`,ভ:`bh`,ম:`m`,য:`j`,র:`r`,ল:`l`,শ:`sh`,ষ:`sh`,স:`s`,হ:`h`,ড়:`r`,ঢ়:`rh`,য়:`y`,ৎ:`t`,"ং":`ng`,"ঃ":`h`,"ঁ":`n`,"া":`a`,"ি":`i`,"ী":`i`,"ু":`u`,"ূ":`u`,"ৃ":`ri`,"ে":`e`,"ৈ":`oi`,"ো":`o`,"ৌ":`ou`,"্":``,"ৗ":`ou`},r=``;for(let e=0;e<t.length;e++){let i=t[e];n[i]===void 0?r+=i:r+=n[i]}return r=r.replace(/\s+/g,` `).trim(),r=r.split(` `).map(e=>e?e.charAt(0).toUpperCase()+e.slice(1):``).join(` `),r.replace(/[^\x00-\x7F]/g,``)}function je(e,t){if(!e||!t)return!1;let n=String(t).trim().toLowerCase();if(!n)return!1;let r=String(e.accountNo||``).toLowerCase(),i=String(e.phone||``).toLowerCase(),a=String(e.address||``).toLowerCase(),o=String(e.name||``).toLowerCase(),s=n.replace(/^#/,``);if(r.includes(s)||i.includes(s)||o.includes(n)||a.includes(n))return!0;let c=Ae(e.name||``).toLowerCase();if(c.includes(n))return!0;let l=e=>e.replace(/aiyub|aiub|ayoub|ayob/g,`ayub`).replace(/mohammad|mohammed|mohamed|muhammad|muhammed|mahmed|mahmud/g,`md`).replace(/hossain|hossein|hussain|husein/g,`hossain`).replace(/choudhury|chowdhury|choudury/g,`chowdhury`).replace(/kaysar|kaiser|kaesar/g,`kaisar`).replace(/tareq|tarik|tareck/g,`tarek`).replace(/jahir|zahir|jaher|zaher/g,`jahir`).replace(/jasim|jashim/g,`jasim`).replace(/sumon|suman/g,`sumon`).replace(/syed|sayed|saeed/g,`syed`).replace(/y/g,`i`),u=l(c),d=l(n);if(u.includes(d))return!0;let f=d.split(/\s+/).filter(Boolean);return f.length>1&&f.every(e=>u.includes(e)||o.includes(e)||i.includes(e)||r.includes(e))}typeof window<`u`&&(window.numberToBanglaWords=I,window.updateLiveWords=ye,window.sendSMS=be,window.sendWhatsApp=xe,window.promptSecurityPin=R,window.toBanglishName=Ae,window.matchCustomerSearch=je);var Me=`
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
`,Ne=794;function Pe(e,t){return new Promise(n=>{let r=document.createElement(`div`);r.style.cssText=[`position:fixed`,`left:-9999px`,`top:0`,`width:${Ne}px`,`visibility:hidden`,`pointer-events:none`,`font-family:"Inter","Kalpurush","Hind Siliguri",sans-serif`,`font-size:11px`,`color:#0f172a`,`background:white`,`padding:6px 12px`,`box-sizing:border-box`].join(`;`);let i=document.createElement(`table`);i.style.cssText=`width:100%;border-collapse:collapse;table-layout:auto;`,i.innerHTML=t;let a=document.createElement(`tbody`);e.forEach(e=>{let t=typeof e==`object`&&e?e.html:e,n=document.createElement(`tbody`);n.innerHTML=(t||``).trim();let r=n.querySelector(`tr`);r&&a.appendChild(r)}),i.appendChild(a),r.appendChild(i),document.body.appendChild(r),requestAnimationFrame(()=>{let e=a.querySelectorAll(`tr`),t=Array.from(e).map(e=>Math.ceil(e.getBoundingClientRect().height)+1);document.body.removeChild(r),n(t)})})}function Fe(e){return!e||!e.trim()?Promise.resolve(0):new Promise(t=>{let n=document.createElement(`div`);n.style.cssText=[`position:fixed`,`left:-9999px`,`top:0`,`width:${Ne}px`,`visibility:hidden`,`pointer-events:none`,`font-family:"Inter","Kalpurush","Hind Siliguri",sans-serif`,`font-size:11px`,`padding:6px 12px`,`box-sizing:border-box`].join(`;`),n.innerHTML=e,document.body.appendChild(n),requestAnimationFrame(()=>{let e=Math.ceil(n.getBoundingClientRect().height);document.body.removeChild(n),t(e||0)})})}var Ie=34,Le=36,Re=16,ze=1,Be=-20;async function Ve({rowsArray:e,page1HeaderHtml:t,repeatHeaderHtml:n,tableColHeaderHtml:r,summaryHtml:i=``,signatureHtml:a=``,formattedDate:o}){let[s,c]=await Promise.all([Pe(e,r),i?Fe(i):Promise.resolve(0)]),l=s.map(e=>Math.ceil(e*ze)),u=[],d=[],f=0,p=!0;for(let t=0;t<e.length;t++){let n=l[t]||24,r=p?869:969,i=t===e.length-1?c:0;f+n+i>r&&d.length>0&&(u.push(d),d=[],f=0,p=!1);let a=e[t];d.push(typeof a==`object`?a.html:a),f+=n}return d.length&&u.push(d),Ue(u,{page1HeaderHtml:t,repeatHeaderHtml:n,tableColHeaderHtml:r,summaryHtml:i,signatureHtml:a,formattedDate:o,tableClass:`data-table`})}async function He({rowsArray:e,page1HeaderHtml:t,repeatHeaderHtml:n,tableColHeaderHtml:r,page1ExtraHtml:i=``,summaryHtml:a=``,signatureHtml:o=``,formattedDate:s}){let[c,l,u]=await Promise.all([Pe(e,r),i?Fe(i):Promise.resolve(0),a?Fe(a):Promise.resolve(0)]),d=c.map(e=>Math.ceil(e*ze)),f=975-Math.ceil(l*ze)-Ie-Le-Re+Be,p=[],m=[],h=0,g=!0;for(let t=0;t<e.length;t++){let n=d[t]||24,r=g?f:969,i=t===e.length-1?u:0;h+n+i>r&&m.length>0&&(p.push(m),m=[],h=0,g=!1);let a=e[t];m.push(typeof a==`object`?a.html:a),h+=n}return m.length&&p.push(m),Ue(p,{page1HeaderHtml:t,repeatHeaderHtml:n,tableColHeaderHtml:r,page1ExtraHtml:i,summaryHtml:a,signatureHtml:o,formattedDate:s,tableClass:`print-items-table`})}function Ue(e,t){let{page1HeaderHtml:n,repeatHeaderHtml:r,tableColHeaderHtml:i,page1ExtraHtml:a=``,summaryHtml:o=``,signatureHtml:s=``,formattedDate:c,tableClass:l}=t,u=e.length;return e.map((e,t)=>{let d=t+1,f=d===1,p=d===u;return`<div style="${p?``:`page-break-after:always;break-after:always;`}width:100%;box-sizing:border-box;background:white;color:#0f172a;padding:6px 12px;">
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
        </div>`}).join(``)}function We(e,t=``){let n=document.getElementById(`__spe_iframe__`);n&&n.remove();let r=document.createElement(`iframe`);r.id=`__spe_iframe__`,r.setAttribute(`aria-hidden`,`true`),r.style.cssText=`position:fixed;left:-9999px;top:0;width:0;height:0;border:none;opacity:0;`,document.body.appendChild(r);let i=r.contentDocument||r.contentWindow.document;i.open(),i.write(`<!DOCTYPE html><html lang="bn"><head><meta charset="UTF-8">
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;700;900&display=swap" rel="stylesheet">
<link href="https://fonts.maateen.me/kalpurush/font.css" rel="stylesheet">
<style>${Me}${t}</style>
</head><body>${e}</body></html>`),i.close();let a=()=>{try{r.contentWindow.focus(),r.contentWindow.print()}catch{window.print()}setTimeout(()=>{try{r.remove()}catch(e){console.error(`Remove iframe error:`,e)}},4e3)},o=r.contentDocument;o&&o.fonts&&o.fonts.ready?(async()=>{try{await o.fonts.ready,a()}catch(e){console.error(`Fonts ready error:`,e),setTimeout(a,700)}})():setTimeout(a,700)}function z(e,t=`একটি সমস্যা হয়েছে`){console.error(`[App Error]`,e);let n=e.message||String(e);e.code===`permission-denied`?n=`আপনার এই কাজটি করার অনুমতি নেই। (Permission Denied)`:e.code===`unavailable`?n=`ইন্টারনেট কানেকশন চেক করুন। (Service Unavailable)`:e.code===`resource-exhausted`?n=`কোটা শেষ হয়ে গেছে। (Quota Exceeded)`:e.message&&e.message.includes(`index`)&&(n=`ডাটাবেস ইনডেক্স প্রয়োজন। অনুগ্রহ করে অ্যাডমিনের সাথে যোগাযোগ করুন।`),L.default.fire({title:`ভুল হয়েছে!`,html:`
            <div class="text-left font-bn space-y-2">
                <p class="text-base font-black text-red-500">${t}</p>
                <div class="p-3 bg-red-500/5 border border-red-500/10 rounded-xl">
                    <p class="text-[10px] text-slate-500 uppercase font-black tracking-widest mb-1">প্রযুক্তিগত বিবরণ (Technical Details):</p>
                    <p class="text-xs text-slate-300 font-sans italic">${n}</p>
                </div>
            </div>
        `,icon:`error`,confirmButtonText:`ঠিক আছে`,customClass:{popup:`!bg-slate-950 !text-white !rounded-3xl border border-slate-700 shadow-2xl`,confirmButton:`m3-btn-primary !bg-red-600 !px-8`}})}window.handleError=z;function Ge(){L.default.fire({title:`<div class="flex items-center justify-center gap-2 font-bn font-black text-xl text-amber-400"><i class="fa-solid fa-keyboard"></i><span>সুপার-ফাস্ট কিবোর্ড শর্টকাট গাইড</span></div>`,html:`
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
        `,confirmButtonText:`ঠিক আছে (Close)`,customClass:{popup:`!bg-slate-950 !text-white !rounded-3xl border border-slate-800 shadow-2xl font-bn max-w-2xl`,confirmButton:`m3-btn-primary !bg-blue-600 hover:!bg-blue-500 !px-7 !py-2.5 !rounded-xl font-bold shadow-lg shadow-blue-600/30`}})}function Ke(e={}){window.addEventListener(`keydown`,t=>{let n=(e,t)=>{typeof window.navigate==`function`?window.navigate(e,t):typeof window.navigateTo==`function`&&window.navigateTo(e,t)},r=document.activeElement?.tagName?.toLowerCase(),i=r===`input`||r===`textarea`||document.activeElement?.isContentEditable;if((t.key===`F10`||t.shiftKey&&t.key===`?`)&&(!i||t.key===`F10`)){t.preventDefault(),Ge();return}if(t.key===`F1`||t.altKey&&t.key.toLowerCase()===`h`){t.preventDefault(),n(`dashboard`);return}if(t.key===`F2`||t.altKey&&t.key.toLowerCase()===`i`){t.preventDefault(),n(`invoice`);return}if(t.key===`F3`||t.altKey&&t.key.toLowerCase()===`l`){t.preventDefault(),n(`ledger`);return}if(t.key===`F4`||t.altKey&&t.key.toLowerCase()===`c`){t.preventDefault(),n(`customers`);return}if(t.key===`F6`||t.altKey&&t.key.toLowerCase()===`e`){t.preventDefault(),n(`expenses`);return}if(t.key===`F7`||t.altKey&&t.key.toLowerCase()===`b`){t.preventDefault(),n(`bulk`);return}if(t.key===`F8`||t.altKey&&t.key.toLowerCase()===`s`&&!t.ctrlKey){t.preventDefault(),n(`settings`);return}if((t.ctrlKey||t.metaKey)&&t.key.toLowerCase()===`s`){if(t.preventDefault(),L.default.isVisible()){let e=L.default.getConfirmButton();if(e&&!e.disabled){e.click();return}}let e=document.getElementById(`dash-add-customer-form`);if(e&&!e.classList.contains(`hidden`)&&typeof window.saveDashCustomer==`function`){window.saveDashCustomer();return}let n=document.getElementById(`customer-modal`);if(n&&!n.classList.contains(`hidden`)&&typeof window.saveCustomer==`function`){window.saveCustomer();return}if(document.getElementById(`inv-items-tbody`)&&typeof window.saveAndPrintInvoice==`function`){window.saveAndPrintInvoice(`pos`);return}let r=document.getElementById(`expense-save-btn`)||document.getElementById(`save-expense-btn`);if(r){r.click();return}if(typeof window.saveExpense==`function`){window.saveExpense();return}let i=document.getElementById(`settings-save-btn`)||document.getElementById(`save-settings-btn`);if(i){i.click();return}if(typeof window.saveSettings==`function`){window.saveSettings();return}let a=document.querySelector(`.m3-btn-primary, button[type="submit"]`);if(a){a.click();return}b(`ডাটা সেভ প্রসেস করা হচ্ছে...`,`info`);return}if((t.ctrlKey||t.metaKey)&&t.key.toLowerCase()===`k`){t.preventDefault(),e.toggleOmnisearch&&e.toggleOmnisearch();return}if(t.key===`Escape`){e.toggleOmnisearch&&e.toggleOmnisearch(!1);return}if(t.altKey&&t.key.toLowerCase()===`n`||t.ctrlKey&&t.shiftKey&&t.key.toLowerCase()===`n`||t.key===`Insert`){t.preventDefault(),t.stopPropagation();let e=window.AppState?.currentView||`dashboard`;if((document.getElementById(`dash-add-customer-form`)||e===`dashboard`)&&typeof window.toggleDashCustomerForm==`function`){window.toggleDashCustomerForm();return}if(e===`customers`){let e=document.getElementById(`btn-toggle-add-customer`)||document.getElementById(`toggle-cust-form-btn`);if(e){e.click();return}if(typeof window.toggleAddCustomerForm==`function`){window.toggleAddCustomerForm();return}}if((e===`invoice`||document.getElementById(`inv-items-tbody`))&&typeof window.addInvoiceItemRow==`function`){window.addInvoiceItemRow(),b(`+ নতুন ইনভয়েস লাইন যোগ করা হয়েছে`,`success`);return}if(e===`expenses`||document.getElementById(`expense-modal`)){let e=document.getElementById(`add-expense-btn`)||document.getElementById(`btn-add-expense`);if(e){e.click();return}if(typeof window.openExpenseModal==`function`){window.openExpenseModal();return}}if(e===`bulk`&&typeof window.addBulkRow==`function`){window.addBulkRow(),b(`+ নতুন স্প্রেডশীট রো যোগ করা হয়েছে`,`success`);return}let n=document.querySelector(`[onclick*="toggleDashCustomerForm"], [onclick*="toggleAddCustomerForm"]`);if(n){n.click();return}typeof window.toggleDashCustomerForm==`function`&&window.toggleDashCustomerForm();return}if(t.altKey&&t.key.toLowerCase()===`p`){t.preventDefault(),window.printFilteredCustomerList?window.printFilteredCustomerList():window.print();return}})}var qe=!1,B=0,V=[];function Je(){Ye(),Ke({toggleOmnisearch:Xe})}function Ye(){if(document.getElementById(`omnisearch-modal`))return;let e=document.createElement(`div`);e.id=`omnisearch-modal`,e.className=`fixed inset-0 z-[999999] bg-slate-950/80 backdrop-blur-md hidden flex items-start justify-center pt-16 md:pt-24 px-4 font-bn transition-all`,e.innerHTML=`
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
        </div>`,document.body.appendChild(e);let t=document.getElementById(`omni-input`);t&&(t.addEventListener(`input`,e=>Ze(e.target.value)),t.addEventListener(`keydown`,$e)),e.addEventListener(`click`,t=>{t.target===e&&Xe(!1)})}function Xe(e=null){let t=document.getElementById(`omnisearch-modal`),n=document.getElementById(`omnisearch-box`),r=document.getElementById(`omni-input`);!t||!n||(qe=e===null?!qe:e,qe?(t.classList.remove(`hidden`),requestAnimationFrame(()=>{n.classList.remove(`scale-95`,`opacity-0`),n.classList.add(`scale-100`,`opacity-100`)}),r&&(r.value=``,r.focus(),Ze(``))):(n.classList.remove(`scale-100`,`opacity-100`),n.classList.add(`scale-95`,`opacity-0`),setTimeout(()=>t.classList.add(`hidden`),150)))}function Ze(e){if(!document.getElementById(`omni-results`))return;e=(e||``).trim().toLowerCase(),V=[];let t=(e,t)=>{typeof window.navigate==`function`?window.navigate(e,t):typeof window.navigateTo==`function`&&window.navigateTo(e,t)};[{title:`কাস্টমার ম্যানেজমেন্ট (F4 / Alt+C)`,subtitle:`কাস্টমার তালিকা ও তৈরি`,icon:`fa-users text-blue-400`,action:()=>t(`customers`)},{title:`খতিয়ান (F3 / Alt+L)`,subtitle:`কাস্টমার লেনদেন ও জমা-খরচ`,icon:`fa-wallet text-purple-400`,action:()=>t(`ledger`)},{title:`ফাস্ট এন্ট্রি (F7 / Alt+B)`,subtitle:`দ্রুত ইনভয়েস ও মেমো তৈরি`,icon:`fa-bolt text-amber-400`,action:()=>t(`bulk`)},{title:`ইনভয়েস / ভাউচার জেনারেটর (F2 / Alt+I)`,subtitle:`সর্বশেষ রসিদ ও ভাউচার`,icon:`fa-receipt text-emerald-400`,action:()=>t(`invoice`)},{title:`দৈনিক খরচ (F6 / Alt+E)`,subtitle:`দোকানের খরচের তালিকা`,icon:`fa-file-invoice-dollar text-red-400`,action:()=>t(`expenses`)},{title:`সফটওয়্যার সেটিংস (F8 / Alt+S)`,subtitle:`দোকানের নাম ও সিকিউরিটি পিন`,icon:`fa-gear text-slate-400`,action:()=>t(`settings`)}].forEach(t=>{(!e||t.title.toLowerCase().includes(e)||t.subtitle.toLowerCase().includes(e))&&V.push(t)}),e&&(U()||[]).forEach(n=>{(typeof window.matchCustomerSearch==`function`?window.matchCustomerSearch(n,e):(n.name||``).toLowerCase().includes(e))&&V.push({title:n.name,subtitle:`ফোন: ${n.phone||`-`} | A/C: ${n.accountNo||`-`} | বকেয়া: ৳${n.totalDue||0}`,icon:`fa-user text-blue-400`,action:()=>t(`ledger`,{custId:n.id})})}),B=0,Qe()}function Qe(){let e=document.getElementById(`omni-results`);if(e){if(V.length===0){e.innerHTML=`<div class="text-center py-8 text-slate-500 font-bold text-xs">কোনো ডাটা পাওয়া যায়নি</div>`;return}e.innerHTML=V.map((e,t)=>`
        <div class="omni-item flex items-center justify-between p-3 rounded-xl cursor-pointer transition-all ${t===B?`bg-blue-600/20 border border-blue-500/30`:`hover:bg-slate-800/50`}" onclick="window.execOmniItem(${t})">
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
        </div>`).join(``)}}function $e(e){e.key===`ArrowDown`?(e.preventDefault(),B=(B+1)%V.length,Qe()):e.key===`ArrowUp`?(e.preventDefault(),B=(B-1+V.length)%V.length,Qe()):e.key===`Enter`&&(e.preventDefault(),V[B]&&(V[B].action(),Xe(!1)))}window.execOmniItem=e=>{V[e]&&(V[e].action(),Xe(!1))},window.toggleOmnisearch=Xe,window.showHotkeyHelpModal=Ge;function et(e){if(!e||typeof e!=`string`)return``;let t=e.trim();if(!t)return``;let n={dhaka:`ঢাকা`,bangladesh:`বাংলাদেশ`,chattogram:`চট্টগ্রাম`,chittagong:`চট্টগ্রাম`,ctg:`চট্টগ্রাম`,muradpur:`মুরাদপুর`,hathazari:`হাটহাজারী`,railgate:`রেইলগেইট`,"rail gate":`রেইল গেইট`,rahman:`রহমান`,tower:`টাওয়ার`,market:`মার্কেট`,center:`সেন্টার`,centre:`সেন্টার`,shop:`দোকান`,no:`নং`,road:`রোড`,lane:`গলি`,gali:`গলি`,goli:`গলি`,sholashahar:`ষোলশহর`,khatunganj:`খাতুনগঞ্জ`,agarabad:`আগ্রাবাদ`,halishahar:`হালিশহর`,nasirabad:`নাসিরাবাদ`,bismillah:`বিসমিল্লাহ`,enterprise:`এন্টারপ্রাইজ`,motors:`মোটরস`,motor:`মোটর`,store:`স্টোর`,hardware:`হার্ডওয়্যার`,auto:`অটো`,parts:`পার্টস`,maa:`মা`,ms:`মেসার্স`,"m/s":`মেসার্স`,feni:`ফেনী`,comilla:`কুমিল্লা`,kumilla:`কুমিল্লা`,noakhali:`নোয়াখালী`,sylhet:`সিলেট`,rajshahi:`রাজশাহী`,khulna:`খুলনা`,barisal:`বরিশাল`};return t.split(/(\s+|[,,\-।])/).map(e=>{let t=e.trim().toLowerCase();return n[t]?n[t]:!t||/^\d+$/.test(t)||/^[^\w\s]$/.test(t)?e:tt(e)}).join(``)}function tt(e){if(!e||!/[a-zA-Z]/.test(e))return e;let t=e.toLowerCase();return t=t.replace(/desh/g,`দেশ`).replace(/road/g,`রোড`).replace(/rd$/g,`র্ড`).replace(/nd$/g,`ন্ড`).replace(/ld$/g,`ল্ড`),t=t.replace(/kkh/g,`ক্ষ`).replace(/ggh/g,`ঘ্`).replace(/ng/g,`ং`).replace(/cch/g,`চ্ছ`).replace(/tth/g,`ঠ`).replace(/dhd/g,`দ্ধ`).replace(/ddh/g,`ঢ`).replace(/bbh/g,`ভ`).replace(/mbh/g,`ম্ভ`).replace(/mph/g,`ম্ফ`).replace(/nkh/g,`ঙ্খ`).replace(/ngh/g,`ঙ্ঘ`).replace(/ndh/g,`ন্ধ`).replace(/nst/g,`ন্সট`).replace(/sh/g,`শ`).replace(/th/g,`থ`).replace(/dh/g,`ধ`).replace(/kh/g,`খ`).replace(/gh/g,`ঘ`).replace(/ch/g,`চ`).replace(/jh/g,`ঝ`).replace(/ph/g,`ফ`).replace(/bh/g,`ভ`).replace(/rh/g,`ঢ়`).replace(/k/g,`ক`).replace(/g/g,`গ`).replace(/j/g,`জ`).replace(/z/g,`জ`).replace(/t/g,`ট`).replace(/d/g,`দ`).replace(/n/g,`ন`).replace(/p/g,`প`).replace(/f/g,`ফ`).replace(/b/g,`ব`).replace(/m/g,`ম`).replace(/r/g,`র`).replace(/l/g,`ল`).replace(/s/g,`স`).replace(/h/g,`হ`).replace(/y/g,`য়`).replace(/v/g,`ভ`).replace(/w/g,`ও`).replace(/a/g,`া`).replace(/i/g,`ি`).replace(/u/g,`ু`).replace(/e/g,`ে`).replace(/o/g,`ো`),t}function nt(e=[]){let t=e&&e.length?e:U()||window.customerCache||[],n=new Set,r={};t.forEach(e=>{if(!e.address||typeof e.address!=`string`)return;let t=e.address.trim();t.length>=3&&n.add(t),t.split(/[,,\-।]/).forEach(e=>{let t=e.trim();t.length>=2&&!/^\d+$/.test(t)&&(r[t]=(r[t]||0)+1)})});let i=Object.keys(r).sort((e,t)=>r[t]-r[e]);return{fullAddresses:Array.from(n),phrases:i}}function rt(e){let t=document.getElementById(e);if(!t)return;let n=document.getElementById(e+`-chips`);n&&(n.innerHTML=``);let r=document.getElementById(e+`-dropdown`);r||(r=document.createElement(`div`),r.id=e+`-dropdown`,r.className=`hidden absolute left-0 right-0 top-full mt-1 bg-slate-900/95 border border-slate-700/90 rounded-2xl shadow-[0_25px_60px_rgba(0,0,0,0.95)] z-[999999] max-h-64 overflow-y-auto custom-scrollbar p-1.5 flex flex-col gap-1 backdrop-blur-2xl font-bn`,t.parentNode&&(t.parentNode.classList.add(`relative`),t.parentNode.appendChild(r)));let i=(e,t,n)=>{if(!e)return 0;let r=e.toLowerCase().trim(),i=(n||``).trim();if(r===t||i&&r===i)return 1e3;if(r.startsWith(t)||i&&r.startsWith(i))return 500;if(r.split(/[\s,,\-।]+/).some(e=>e.startsWith(t)||i&&e.startsWith(i)))return 200;if(r.includes(t)||i&&r.includes(i))return 50;if(typeof window.toBanglishName==`function`){let n=window.toBanglishName(e).toLowerCase();if(n.startsWith(t))return 150;if(n.includes(t))return 30}return 0},a=()=>{let n=t.value,a=n.toLowerCase().trim(),o=n.lastIndexOf(`,`),c=(o>=0?n.slice(o+1):n).trim(),l=c.toLowerCase(),{fullAddresses:u,phrases:d}=nt();if(!a&&!l){r.classList.add(`hidden`);return}let f=et(n),p=et(c||n),m=/[a-zA-Z]/.test(n),h=u.map(e=>({addr:e,score:i(e,l||a,p)})).filter(e=>e.score>0).sort((e,t)=>t.score-e.score).map(e=>e.addr),g=d.map(e=>({phrase:e,score:i(e,l||a,p)})).filter(e=>e.score>0).sort((e,t)=>t.score-e.score).map(e=>e.phrase);if(!m&&h.length===0&&g.length===0){r.classList.add(`hidden`);return}let _=``;m&&f&&f!==n&&(_+=`
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
            `).join(``)),r.innerHTML=_,r.classList.remove(`hidden`),r.scrollTop=0,t._addrActiveIdx=-1;let v=r.querySelectorAll(`.addr-suggest-item`);v&&v.length>0&&s(v,-1)},o=n=>{let r=document.getElementById(e+`-dropdown`);if(!r||r.classList.contains(`hidden`))return;let i=r.querySelectorAll(`.addr-suggest-item`);if(!i||i.length===0)return;let a=t._addrActiveIdx===void 0?-1:t._addrActiveIdx;n.key===`ArrowDown`?(n.preventDefault(),a=a<0?0:(a+1)%i.length,t._addrActiveIdx=a,s(i,a)):n.key===`ArrowUp`?(n.preventDefault(),a=a<=0?i.length-1:a-1,t._addrActiveIdx=a,s(i,a)):n.key===`Enter`||n.key===`Tab`?a>=0&&i[a]?(n.preventDefault(),i[a].click(),t._addrActiveIdx=-1):(r.classList.add(`hidden`),t._addrActiveIdx=-1):n.key===`Escape`&&(r.classList.add(`hidden`),t._addrActiveIdx=-1)};function s(e,t){e.forEach((e,n)=>{n===t&&t>=0?(e.classList.add(`bg-blue-600/40`,`border-blue-500`,`!text-white`,`ring-2`,`ring-blue-500/50`),e.scrollIntoView({block:`nearest`})):e.classList.remove(`bg-blue-600/40`,`border-blue-500`,`!text-white`,`ring-2`,`ring-blue-500/50`)})}t.removeEventListener(`input`,t._addrHandler||(()=>{})),t.removeEventListener(`focus`,t._addrHandler||(()=>{})),t.removeEventListener(`keydown`,t._addrKeyHandler||(()=>{})),t._addrHandler=a,t._addrKeyHandler=o,t.addEventListener(`input`,a),t.addEventListener(`focus`,a),t.addEventListener(`keydown`,o)}typeof window<`u`&&(window.selectAddressFull=(e,t)=>{let n=document.getElementById(e),r=document.getElementById(e+`-dropdown`);n&&(n.value=t,n.focus(),n.dispatchEvent(new Event(`input`,{bubbles:!0}))),r&&r.classList.add(`hidden`)},window.selectAddressPhrase=(e,t)=>{let n=document.getElementById(e),r=document.getElementById(e+`-dropdown`);if(n){let e=n.value,r=e.lastIndexOf(`,`);n.value=r>=0?e.slice(0,r+1).trim()+` `+t+`, `:t+`, `,n.focus(),n.dispatchEvent(new Event(`input`,{bubbles:!0}))}r&&r.classList.add(`hidden`)},window.selectAddressPhoneticFull=(e,t)=>{let n=document.getElementById(e),r=document.getElementById(e+`-dropdown`);n&&(n.value=t,n.focus(),n.dispatchEvent(new Event(`input`,{bubbles:!0}))),r&&r.classList.add(`hidden`)}),document.addEventListener(`click`,e=>{[`cust-address`,`dash-cust-address`].forEach(t=>{let n=document.getElementById(t+`-dropdown`),r=document.getElementById(t);n&&!n.contains(e.target)&&e.target!==r&&n.classList.add(`hidden`)})});var it=null,at=[],ot=1,st=!1,H=[],ct=[],lt=null;function ut(e){it=e}function dt(e){ot=e}function ft(){it=null,at=[],ot=1}function pt(e){st=e}function mt(e){H=e}function ht(e){ct=e}function U(){return H}function gt(){let e=document.getElementById(`cust-count-badge`),t=document.getElementById(`cust-total-due-badge`);if(!e||!t)return;let n=0;H.forEach(e=>{n+=Number(e.totalDue)||0}),e.innerText=H.length,t.innerText=`৳ `+v(n)}function W(){if(lt){gt();return}lt=u.listenToAll(e=>{mt(e),window.customerCache=H,gt(),rt(`cust-address`,`cust-address-datalist`,`cust-address-chips`),rt(`dash-cust-address`,`dash-cust-address-datalist`,`dash-cust-address-chips`),st&&document.getElementById(`customer-list`)&&window.filterCustomerList&&window.filterCustomerList()})}var _t=e(r());function vt(e,t){if(window.AppState.currentUserRole===`Staff`&&window.AppState.permissions.viewCustomers===!1){e.innerHTML=`<div class="m3-card text-center"><h2 class="text-xl font-bold text-red-500 font-bn">অ্যাক্সেস ডিনাইড! আপনার কাস্টমার লিস্ট দেখার অনুমতি নেই।</h2></div>`;return}e.innerHTML=`
        <div class="flex flex-col gap-6">
            <div class="m3-card bg-slate-900/60 border border-slate-800/80 p-4 md:p-5 rounded-2xl shadow-xl flex flex-col gap-4">
                <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                    <div class="flex items-center gap-3">
                        <div class="w-2 h-7 bg-blue-500 rounded-full shadow-[0_0_15px_rgba(59,130,246,0.5)]"></div>
                        <h2 class="text-xl md:text-2xl font-black text-white tracking-tight font-bn flex items-center gap-2">
                            কাস্টমার ম্যানেজমেন্ট
                            <button class="w-7 h-7 rounded-lg hover:bg-slate-800 flex items-center justify-center text-slate-500 hover:text-blue-400 transition-all active:rotate-180" onclick="window.loadCustomers()" title="রিফ্রেশ">
                                <i class="fa-solid fa-rotate text-xs"></i>
                            </button>
                        </h2>
                    </div>

                    <div class="flex items-center gap-2.5 w-full sm:w-auto justify-end font-bn">
                        <button class="h-9 px-3.5 rounded-xl bg-amber-500/10 border border-amber-500/30 hover:bg-amber-500/20 text-amber-300 text-xs font-bold transition-all flex items-center gap-2 shrink-0 cursor-pointer shadow-md shadow-amber-500/10" onclick="window.triggerBulkReminderFlow()" title="১-ক্লিকে টপ ১০ বকেয়া তাগাদা">
                            <i class="fa-solid fa-paper-plane text-amber-400"></i>
                            <span>বাল্ক তাগাদা (Top 10)</span>
                        </button>
                        <button class="h-9 px-3.5 rounded-xl bg-slate-800/90 border border-slate-700/80 hover:bg-slate-700/80 text-slate-200 text-xs font-bold transition-all flex items-center gap-2 shrink-0" onclick="window.exportTableToExcel('customer-export-table', 'customer-list.xlsx')" title="এক্সেল ডাউনলোড">
                            <i class="fa-solid fa-file-excel text-emerald-400"></i>
                            <span>এক্সেল</span>
                        </button>
                        <button class="h-9 px-3.5 rounded-xl bg-slate-800/90 border border-slate-700/80 hover:bg-slate-700/80 text-slate-200 text-xs font-bold transition-all flex items-center gap-2 shrink-0" onclick="window.printFilteredCustomerList()" title="লিস্ট প্রিন্ট">
                            <i class="fa-solid fa-print text-blue-400"></i>
                            <span>প্রিন্ট লিস্ট</span>
                        </button>
                        ${window.AppState?.currentUserRole===`Admin`||window.AppState?.permissions?.manageCustomers!==!1?`
                        <button class="h-9 px-4 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold shadow-md shadow-blue-600/20 active:scale-95 transition-all flex items-center gap-2 shrink-0 cursor-pointer" onclick="window.toggleAddCustomerForm()">
                            <i class="fa-solid fa-user-plus text-xs"></i>
                            <span>নতুন কাস্টমার</span>
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
                <button id="cust-prev-page" class="px-4 py-2 bg-slate-800 text-slate-300 rounded-xl border border-slate-700 hover:bg-slate-700 disabled:opacity-30 disabled:pointer-events-none transition-all" onclick="window.changeCustomerPage('prev')">
                    <i class="fa-solid fa-chevron-left mr-2"></i> পূর্ববর্তী
                </button>
                <div class="text-white font-bold bg-blue-600/10 border border-blue-500/30 px-4 py-2 rounded-xl">
                    পৃষ্ঠা: <span id="cust-current-page-display">1</span>
                </div>
                <button id="cust-next-page" class="px-4 py-2 bg-slate-800 text-slate-300 rounded-xl border border-slate-700 hover:bg-slate-700 disabled:opacity-30 disabled:pointer-events-none transition-all" onclick="window.changeCustomerPage('next')">
                    পরবর্তী <i class="fa-solid fa-chevron-right ml-2"></i>
                </button>
            </div>
        </div>`,window.loadCustomers&&window.loadCustomers(),document.getElementById(`cust-date`)&&(document.getElementById(`cust-date`).value=window.getTodayLocalDateString?window.getTodayLocalDateString():new Date().toISOString().split(`T`)[0]),t&&t.openForm&&setTimeout(()=>{let e=document.getElementById(`add-customer-form`);e&&e.classList.remove(`hidden`)},150)}function yt(e){let t=document.getElementById(`customer-list`),n=document.getElementById(`customer-list-mobile`);if(!t)return;let r=String(window.AppState?.currentUserRole||``).toLowerCase()===`admin`,i=r||window.AppState?.permissions?.editCustomers!==!1&&window.AppState?.permissions?.manageCustomers!==!1,a=r||window.AppState?.permissions?.deleteCustomers===!0,o=[],s=``;e.forEach(e=>{let t=e.openingDate||``;if(!t&&e.createdAt)try{t=e.createdAt.toDate().toISOString().split(`T`)[0]}catch{t=_()}let n=Number(e.totalDue)||0,r=n>0?`text-red-400`:n<0?`text-emerald-400`:`text-slate-400`,c=String(e.id||``),l=String(e.name||`N/A`).replace(/'/g,`\\'`).replace(/"/g,`&quot;`),u=String(e.phone||`-`).replace(/'/g,`\\'`).replace(/"/g,`&quot;`),d=String(e.address||`-`).replace(/'/g,`\\'`).replace(/"/g,`&quot;`),f=String(e.zone||``).replace(/'/g,`\\'`).replace(/"/g,`&quot;`);o.push(`
            <tr class="hover:bg-white/[0.04] transition-colors border-b border-slate-800/60">
                <td class="py-2.5 px-3 text-xs font-bold text-slate-300 whitespace-nowrap">${E(t)}</td>
                <td class="py-2.5 px-3 font-bold text-slate-200 whitespace-nowrap">
                    <div class="flex items-center gap-2">
                        <div class="w-7 h-7 rounded-lg bg-blue-500/10 border border-blue-500/20 text-blue-400 flex items-center justify-center font-black text-xs shrink-0">${(e.name||`K`).charAt(0)}</div>
                        <div class="flex items-center gap-2">
                            <span class="text-xs text-white font-bold cursor-pointer hover:text-blue-400 transition-colors" onclick="window.openCustomerLedger('${c}')">${e.name||`N/A`}</span>
                            <span class="text-[10px] text-blue-400 font-black bg-blue-500/10 border border-blue-500/20 px-1.5 py-0.5 rounded font-mono">${e.accountNo||`-`}</span>
                        </div>
                    </div>
                </td>
                <td class="py-2.5 px-3 text-xs text-slate-300 font-medium max-w-[220px]" title="${e.address||`-`}">
                    <div class="flex items-center gap-1 truncate">
                        ${e.zone?`<span class="inline-block text-[9px] text-purple-400 font-bold bg-purple-500/10 border border-purple-500/20 px-1.5 py-0.5 rounded shrink-0"><i class="fa-solid fa-location-dot mr-0.5"></i>${e.zone}</span>`:``}
                        <span class="truncate text-slate-400">${e.address||`-`}</span>
                    </div>
                </td>
                <td class="py-2.5 px-3 text-xs text-slate-300 font-bold whitespace-nowrap">${e.phone||`-`}</td>
                <td class="py-2.5 px-3 text-right whitespace-nowrap">
                    <div class="flex items-center justify-end gap-1.5">
                        <span class="font-black text-sm ${r}">৳ ${v(Math.abs(n))}</span>
                        <span class="text-[9px] uppercase font-bold px-1.5 py-0.5 rounded ${n>0?`bg-red-500/10 text-red-400 border border-red-500/20`:n<0?`bg-emerald-500/10 text-emerald-400 border border-emerald-500/20`:`bg-slate-800 text-slate-400`}">${n>0?`বকেয়া`:n<0?`অ্যাডভান্স`:`পরিশোধিত`}</span>
                    </div>
                </td>
                <td class="py-2.5 px-3 text-center whitespace-nowrap sticky-action-col">
                    <div class="flex items-center justify-center gap-1">
                        <button class="m3-btn-icon" onclick="window.openCustomerLedger('${c}')" title="খতিয়ান দেখুন"><i class="fa-solid fa-book text-blue-400"></i></button>
                        <button class="m3-btn-icon" onclick="window.openCustomerStatement('${c}', '${l}', '${e.accountNo||``}', '${u}', '${d}')" title="স্টেটমেন্ট"><i class="fa-solid fa-file-invoice text-purple-400"></i></button>
                        <button class="m3-btn-icon" onclick="window.sendDashWhatsAppReminder('${u}', ${n}, '${l}')" title="WhatsApp তাগাদা"><i class="fa-brands fa-whatsapp text-emerald-400"></i></button>
                        ${n>0?`<button class="m3-btn-icon" onclick="window.sendReminderSMS('${u}', ${n}, '${l}', '${e.accountNo||``}')" title="রিমাইন্ডার SMS"><i class="fa-solid fa-bell text-amber-400"></i></button>`:``}
                        ${i?`<button class="m3-btn-icon" onclick="window.editCustomer('${c}', '${l}', '${u}', '${d}', '${f}')" title="এডিট"><i class="fa-solid fa-pen-to-square text-amber-400"></i></button>`:``}
                        ${a?`<button class="m3-btn-icon" onclick="window.deleteCustomer('${c}', '${l}')" title="ডিলেট"><i class="fa-solid fa-trash-can text-red-400"></i></button>`:``}
                    </div>
                </td>
            </tr>`),s+=`
            <div class="mobile-card">
                <div class="mobile-card-header">
                    <div class="flex items-center gap-2">
                        <div class="w-8 h-8 rounded-lg bg-blue-500/10 text-blue-400 flex items-center justify-center font-black text-xs shrink-0">${(e.name||`K`).charAt(0)}</div>
                        <div>
                            <div class="mobile-card-title cursor-pointer hover:text-blue-400" onclick="window.openCustomerLedger('${c}')">${e.name||`N/A`}</div>
                            <div class="mobile-card-sub text-blue-400 font-bold">${e.accountNo||`-`} ${e.zone?`• `+e.zone:``}</div>
                        </div>
                    </div>
                    <div class="text-right">
                        <div class="text-base font-black ${r}">৳ ${v(Math.abs(n))}</div>
                        <span class="inline-block text-[9px] uppercase font-bold ${n>0?`text-red-400`:`text-emerald-400`}">${n>0?`বকেয়া`:`পরিশোধিত`}</span>
                    </div>
                </div>
                <div class="mobile-card-row"><span class="mobile-card-label">মোবাইল:</span><span class="mobile-card-value">${e.phone||`-`}</span></div>
                <div class="mobile-card-row"><span class="mobile-card-label">ঠিকানা:</span><span class="mobile-card-value">${e.address||`-`}</span></div>
                <div class="mobile-card-actions">
                    <button class="m3-btn-icon" onclick="window.openCustomerLedger('${c}')" title="খতিয়ান"><i class="fa-solid fa-book text-blue-400"></i></button>
                    <button class="m3-btn-icon" onclick="window.openCustomerStatement('${c}', '${l}', '${e.accountNo||``}', '${u}', '${d}')" title="স্টেটমেন্ট"><i class="fa-solid fa-file-invoice text-purple-400"></i></button>
                    <button class="m3-btn-icon" onclick="window.sendDashWhatsAppReminder('${u}', ${n}, '${l}')" title="WhatsApp তাগাদা"><i class="fa-brands fa-whatsapp text-emerald-400"></i></button>
                    ${n>0?`<button class="m3-btn-icon" onclick="window.sendReminderSMS('${u}', ${n}, '${l}', '${e.accountNo||``}')" title="রিমাইন্ডার SMS"><i class="fa-solid fa-bell text-amber-400"></i></button>`:``}
                    ${i?`<button class="m3-btn-icon" onclick="window.editCustomer('${c}', '${l}', '${u}', '${d}', '${f}')" title="এডিট"><i class="fa-solid fa-pen-to-square text-amber-400"></i></button>`:``}
                    ${a?`<button class="m3-btn-icon" onclick="window.deleteCustomer('${c}', '${l}')" title="ডিলেট"><i class="fa-solid fa-trash-can text-red-400"></i></button>`:``}
                </div>
            </div>`}),window.customerClusterize&&window.customerClusterize.destroy(),o.length>0?window.customerClusterize=new _t.default({rows:o,scrollId:`cust-scroll-area`,contentId:`customer-list`}):t.innerHTML=`<tr><td colspan="6" class="text-center py-20 text-slate-500 italic font-bold">কোনো কাস্টমার পাওয়া যায়নি</td></tr>`,n&&(n.innerHTML=s||`<div class="text-center py-10 text-slate-500 font-bold italic">কোনো কাস্টমার পাওয়া যায়নি</div>`)}function bt(){[`cust-name`,`cust-phone`,`cust-address`,`cust-initial-balance`].forEach(e=>{let t=document.getElementById(e);t&&(t.value=``)});let e=document.getElementById(`cust-date`);if(e){let t=_();e.value=t,e._flatpickr&&e._flatpickr.setDate(t,!1)}let t=document.getElementById(`cust-zone-select`);t&&(t.selectedIndex=0)}async function xt(){let e=x(document.getElementById(`cust-date`).value),t=document.getElementById(`cust-name`).value.trim(),r=document.getElementById(`cust-phone`).value.trim(),i=document.getElementById(`cust-address`).value.trim(),o=document.getElementById(`cust-zone-select`).value,s=document.getElementById(`cust-initial-balance`).value.trim();if(!t||!r||!o)return L.default.fire(`এরর`,`নাম, মোবাইল নম্বর ও জোন আবশ্যক!`,`error`);let l=y(s),d=document.getElementById(`cust-generated-acc`)?.value||`Auto`,f=I(l);if(!(await L.default.fire({title:`<div class="flex items-center justify-center gap-2 font-bn font-black text-xl text-white"><i class="fa-solid fa-file-shield text-blue-400"></i><span>তথ্য যাচাই করুন</span></div>`,html:`<div class="text-left space-y-3 font-bn p-3.5 bg-slate-900/90 rounded-2xl border border-slate-800 shadow-inner">
                <div class="grid grid-cols-2 gap-4 border-b border-slate-800/80 pb-2.5">
                    <div class="flex flex-col gap-1"><span class="text-[10px] text-blue-400 font-black uppercase tracking-wider">কাস্টমারের নাম</span><span class="text-base text-white font-black">${t}</span></div>
                    <div class="flex flex-col gap-1"><span class="text-[10px] text-amber-400 font-black uppercase tracking-wider">অ্যাকাউন্ট নং</span><span class="text-base text-amber-400 font-black font-mono">${d}</span></div>
                </div>
                <div class="grid grid-cols-2 gap-4 border-b border-slate-800/80 pb-2.5">
                    <div class="flex flex-col gap-1"><span class="text-[10px] text-blue-400 font-black uppercase tracking-wider">মোবাইল নম্বর</span><span class="text-sm text-slate-200 font-bold font-mono">${r}</span></div>
                    <div class="flex flex-col gap-1"><span class="text-[10px] text-purple-400 font-black uppercase tracking-wider">জোন</span><span class="text-sm text-slate-200 font-bold">${o}</span></div>
                </div>
                <div class="flex flex-col gap-1 border-b border-slate-800/80 pb-2.5">
                    <span class="text-[10px] text-sky-400 font-black uppercase tracking-wider flex items-center gap-1"><i class="fa-solid fa-location-dot text-amber-400 text-xs"></i>ঠিকানা (Address)</span>
                    <span class="text-xs text-slate-200 font-medium">${i||`N/A`}</span>
                </div>
                <div class="flex flex-col gap-1 pt-1">
                    <span class="text-[10px] text-emerald-400 font-black uppercase tracking-wider">অবশিষ্ট ব্যালেন্স (Opening)</span>
                    <span class="text-2xl text-emerald-400 font-black">৳ ${v(l)}</span>
                    ${f?`<div class="text-[11px] text-emerald-400 font-black italic bg-emerald-500/10 px-2.5 py-1 rounded-xl border border-emerald-500/20 mt-1">(${f})</div>`:``}
                </div>
                <div class="flex flex-col gap-1 pt-2 border-t border-slate-800/80">
                    <span class="text-[10px] text-slate-400 font-black uppercase tracking-wider">হিসাব খোলার তারিখ</span>
                    <span class="text-sm text-slate-300 font-bold font-mono">${E(e)}</span>
                </div>
            </div>
            <p class="text-xs text-amber-400 font-bold mt-4 text-center">সব তথ্য সঠিক থাকলে "কনফার্ম করুন" বাটনে ক্লিক করুন।</p>`,showCancelButton:!0,confirmButtonText:`<i class="fa-solid fa-circle-check mr-2"></i>কনফার্ম করুন`,cancelButtonText:`<i class="fa-solid fa-pen-to-square mr-2"></i>সংশোধন করব`,customClass:{popup:`!bg-slate-950 !text-white !rounded-3xl border border-slate-800 shadow-2xl font-bn`,confirmButton:`m3-btn-primary !bg-blue-600 hover:!bg-blue-500 !px-7 !py-2.5 !rounded-xl font-bold shadow-lg shadow-blue-600/30`,cancelButton:`m3-btn-tonal !bg-slate-800 hover:!bg-slate-700 !text-slate-300 !px-5 !py-2.5 !rounded-xl font-bold border border-slate-700`}})).isConfirmed)return;let p=document.getElementById(`save-cust-btn`);p&&(p.disabled=!0,p.innerText=`সেভ হচ্ছে...`);try{let s=``,d=``;await h.runTransaction(async f=>{let p=ct.find(e=>e.name===o);d=(p?p.code:``)+await c.getNextAccountNo(o,f);let m=u.getRef();s=m.id;let h=a.getRef();f.set(m,{name:t,phone:r,address:i,zone:o||``,accountNo:d,openingDate:e,initialDue:l,totalDue:l,createdAt:n.firestore.FieldValue.serverTimestamp()}),f.set(h,{customerId:s,customerName:t,date:e,voucherNo:`OPENING`,bill:l>0?l:0,paid:l<0?Math.abs(l):0,prevDue:0,currentDue:l,notes:`প্রারম্ভিক জের (Opening Balance)`,createdBy:window.AppState?.currentUserEmail||`System`,createdAt:n.firestore.FieldValue.serverTimestamp()})}),P(`CREATE`,`Customers`,s,t,{phone:r,zone:o,initialBalance:l});let f=`কাস্টমার <strong>${t}</strong> সফলভাবে ডাটাবেসে যোগ করা হয়েছে। জোন: ${o||`N/A`}`;if(await L.default.fire({title:`সফল!`,html:f,icon:`success`,timer:1500,showConfirmButton:!1,customClass:{popup:`!bg-slate-900 !text-white !rounded-3xl border border-slate-700`}}),r&&r.trim()!==``&&r!==`-`)try{let e=await c.getAppSettings(),n=(typeof window.toBanglishName==`function`?window.toBanglishName(t):t)||`Customer`,i=e.shopName?typeof window.toBanglishName==`function`?window.toBanglishName(e.shopName):e.shopName:`M/S. Maa Motors`,a=window.formatAppDate&&window.getTodayLocalDateString?window.formatAppDate(window.getTodayLocalDateString()):`Today`,o=(e.smsTemplateOpening||`Dear [Name] [AccNo], A/C opened at [Shop] on [Date]. Opening Due: Tk [Due]. Thanks!`).replace(/\[Name\]/g,n).replace(/\[AccNo\]/g,`(A/C: ${d})`).replace(/\[Shop\]/g,i).replace(/\[Date\]/g,a).replace(/\[Due\]/g,v(l));o=o.replace(/\s+/g,` `).replace(/[^\x00-\x7F]/g,``);let{value:s,isConfirmed:u}=await L.default.fire({title:`<div class="flex flex-col items-center gap-2"><i class="fa-solid fa-comment-sms text-emerald-400 text-3xl mb-1"></i><span class="font-bn font-black text-xl text-white">Welcome SMS</span></div>`,html:`<div class="text-left space-y-2 mb-2 font-bn">
                            <p class="text-[13px] text-slate-300">কাস্টমারকে কি অ্যাকাউন্ট খোলার মেসেজ পাঠাতে চান? চাইলে নিচের লেখা এডিট করতে পারেন:</p>
                            <div class="flex justify-between items-center"><div class="text-xs text-slate-400">Recipient Phone: <strong class="text-white">${r}</strong></div><div id="sms-open-char-counter" class="text-[11px] font-bold text-emerald-400 text-right">0 / 160 Characters (1 SMS)</div></div>
                           </div>`,input:`textarea`,inputValue:o,inputAttributes:{rows:4,class:`m3-field text-xs font-mono !mt-0`},showCancelButton:!0,confirmButtonText:`<i class="fa-solid fa-paper-plane mr-1.5"></i> পাঠিয়ে দিন`,cancelButtonText:`স্কিপ করুন`,customClass:{popup:`!bg-slate-950 !text-white !rounded-3xl border border-slate-700 shadow-2xl`,confirmButton:`m3-btn-primary !bg-emerald-600 hover:!bg-emerald-500 !px-7 !py-2.5 !rounded-xl font-bold shadow-lg shadow-emerald-600/30`,cancelButton:`m3-btn-tonal !bg-slate-800 hover:!bg-slate-700 !text-slate-300 !px-5 !py-2.5 !rounded-xl font-bold border border-slate-700`},didOpen:()=>{let e=L.default.getInput(),t=document.getElementById(`sms-open-char-counter`),n=()=>{if(e&&t){let n=e.value.length,r=Math.ceil(n/160)||1;t.innerText=`${n} / 160 Characters (${r} SMS)`}};e&&(e.oninput=n,n(),setTimeout(()=>e.focus(),150))}});u&&s&&await be(r,s,!1)&&b(`Welcome SMS পাঠানো হয়েছে`,`success`)}catch(e){console.error(`Welcome SMS Error:`,e)}bt(),window.toggleAddCustomerForm&&window.toggleAddCustomerForm(),window.loadCustomers&&window.loadCustomers()}catch(e){z(e,`কাস্টমার যোগ করা যায়নি`)}finally{p&&(p.disabled=!1,p.innerText=`সেভ করুন`)}}async function St(e,t,r,i,o){if(window.AppState.currentUserRole!==`Admin`)return L.default.fire(`অ্যাক্সেস ডিনাইড!`,`শুধুমাত্র অ্যাডমিন কাস্টমার তথ্য এডিট করতে পারবেন।`,`error`);if(!await R(`কাস্টমার তথ্য এডিট (Authorization)`))return;let s=H.find(t=>t.id===e),l=s&&s.initialDue||0,d=s?.openingDate||(s?.createdAt?s.createdAt.toDate().toISOString().split(`T`)[0]:_()),f=`<option value="">-- জোন সিলেক্ট --</option>`;ct.forEach(e=>{let t=typeof e==`string`?e:e.name;f+=`<option value="${t}" ${t===o?`selected`:``}>${t}</option>`});let{value:m}=await L.default.fire({title:`<i class="fa-solid fa-user-pen text-blue-400 mr-2"></i>কাস্টমার তথ্য এডিট করুন`,html:`
            <div class="space-y-4 text-left p-1 font-bn">
                <div class="grid grid-cols-2 gap-4">
                    <div><label class="block text-[11px] font-black text-blue-400 uppercase mb-1 ml-1">হিসাব খোলার তারিখ *</label><input id="ed-d" class="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-white outline-none focus:border-blue-500 text-sm datepicker" value="${d}"></div>
                    <div><label class="block text-[11px] font-black text-blue-400 uppercase mb-1 ml-1">কাস্টমারের নাম *</label><input id="ed-n" class="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-white outline-none focus:border-blue-500 text-sm" value="${t}"></div>
                </div>
                <div><label class="block text-[11px] font-black text-blue-400 uppercase mb-1 ml-1">মোবাইল নম্বর *</label><input id="ed-p" class="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-white outline-none focus:border-blue-500 text-sm" value="${r}"></div>
                <div><label class="block text-[11px] font-black text-blue-400 uppercase mb-1 ml-1">ঠিকানা (ঐচ্ছিক)</label><input id="ed-a" class="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-white outline-none focus:border-blue-500 text-sm" value="${i}"></div>
                <div class="grid grid-cols-2 gap-4">
                    <div><label class="block text-[11px] font-black text-purple-400 uppercase mb-1 ml-1">জোন / অঞ্চল</label><select id="ed-z" class="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-white outline-none focus:border-blue-500 text-sm">${f}</select></div>
                    <div><label class="block text-[11px] font-black text-amber-400 uppercase mb-1 ml-1">অ্যাকাউন্ট নং (A/C No)</label><input id="ed-acc" class="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-amber-400 font-mono font-bold outline-none focus:border-amber-500 text-sm" value="${s?.accountNo||``}"></div>
                </div>
                <div>
                    <label class="block text-[11px] font-black text-emerald-500 uppercase mb-1 ml-1">Opening Balance</label>
                    <input id="ed-ib" class="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-emerald-400 font-bold outline-none focus:border-emerald-500 text-sm" value="${l}" oninput="handleNumberInput(this); updateLiveWords(this, 'ed-ib-words');">
                    <div id="ed-ib-words" class="text-[11px] font-black text-emerald-400 mt-1.5 px-2 py-0.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 italic font-bn inline-block">(${I(l)})</div>
                </div>
            </div>
        `,showCancelButton:!0,confirmButtonText:`আপডেট করুন`,cancelButtonText:`বাতিল`,customClass:{popup:`!bg-slate-900 !text-white !rounded-3xl border border-slate-700`},didOpen:()=>{let e=document.getElementById(`ed-z`),t=document.getElementById(`ed-acc`);e&&t&&e.addEventListener(`change`,async()=>{let n=e.value;if(n)try{let e=(await p.getAllZones()).find(e=>e.name===n),r=e&&e.code||``,i=await c.peekNextAccountNo(n);t.value=r+i}catch(e){console.error(e)}})},preConfirm:()=>{let e=x(document.getElementById(`ed-d`).value),t=document.getElementById(`ed-n`).value.trim(),n=document.getElementById(`ed-p`).value.trim(),r=document.getElementById(`ed-a`).value.trim(),i=document.getElementById(`ed-z`).value,a=document.getElementById(`ed-acc`).value.trim(),o=y(document.getElementById(`ed-ib`).value);return!t||!n?L.default.showValidationMessage(`নাম ও মোবাইল নম্বর আবশ্যক!`):{d:e,n:t,p:n,a:r,z:i,accNo:a,ib:o}}});if(m){let s=I(m.ib);if(!(await L.default.fire({title:`<i class="fa-solid fa-magnifying-glass text-amber-400 mr-2"></i>সংশোধন যাচাই করুন`,html:`<div class="text-left space-y-3 font-bn p-2 bg-slate-900 rounded-2xl border border-slate-800">
                    <div class="grid grid-cols-2 gap-4 border-b border-slate-800 pb-2">
                        <div class="flex flex-col gap-1"><span class="text-[10px] text-blue-400 font-black uppercase">নতুন নাম</span><span class="text-base text-white font-black">${m.n}</span></div>
                        <div class="flex flex-col gap-1"><span class="text-[10px] text-amber-500 font-black uppercase">অ্যাকাউন্ট নং</span><span class="text-base text-amber-400 font-black font-mono">${m.accNo||`-`}</span></div>
                    </div>
                    <div class="grid grid-cols-2 gap-4 border-b border-slate-800 pb-2">
                        <div class="flex flex-col gap-1"><span class="text-[10px] text-blue-400 font-black uppercase">মোবাইল</span><span class="text-sm text-slate-200 font-bold">${m.p}</span></div>
                        <div class="flex flex-col gap-1"><span class="text-[10px] text-purple-400 font-black uppercase">জোন</span><span class="text-sm text-slate-200 font-bold">${m.z}</span></div>
                    </div>
                    <div class="flex flex-col gap-1 border-b border-slate-800 pb-2">
                        <span class="text-[10px] text-sky-400 font-black uppercase flex items-center gap-1"><i class="fa-solid fa-location-dot text-amber-400 text-xs"></i>ঠিকানা (Address)</span>
                        <span class="text-xs text-slate-200 font-medium">${m.a||`N/A`}</span>
                    </div>
                    <div class="flex flex-col gap-1 pt-1">
                        <span class="text-[10px] text-emerald-400 font-black uppercase">সংশোধিত Opening Balance</span>
                        <span class="text-2xl text-emerald-400 font-black">৳ ${v(m.ib)}</span>
                        ${s?`<div class="text-[11px] text-emerald-500 font-black italic bg-emerald-500/10 px-2 py-1 rounded-lg border border-emerald-500/20 mt-1">(${s})</div>`:``}
                    </div>
                </div>
                <p class="text-[11px] text-amber-500 font-bold mt-4 text-center">তথ্যগুলো কি আপডেট করবেন?</p>`,showCancelButton:!0,confirmButtonText:`<i class="fa-solid fa-circle-check mr-2"></i>হ্যাঁ, আপডেট করুন`,cancelButtonText:`<i class="fa-solid fa-pen-to-square mr-2"></i>না, ঠিক করব`,customClass:{popup:`!bg-slate-950 !text-white !rounded-3xl border border-slate-800 shadow-2xl font-bn`,confirmButton:`m3-btn-primary !bg-blue-600 hover:!bg-blue-500 !px-7 !py-2.5 !rounded-xl font-bold shadow-lg shadow-blue-600/30`,cancelButton:`m3-btn-tonal !bg-slate-800 hover:!bg-slate-700 !text-slate-300 !px-5 !py-2.5 !rounded-xl font-bold border border-slate-700`}})).isConfirmed)return;try{L.default.fire({title:`আপডেট হচ্ছে...`,allowOutsideClick:!1,didOpen:()=>L.default.showLoading()});let s=m.ib-l,c=u.getRef(e),f=await a.getByCustomer(e),p={name:m.n,phone:m.p,address:m.a,zone:m.z||``,accountNo:m.accNo||``,openingDate:m.d,initialDue:m.ib,totalDue:n.firestore.FieldValue.increment(s),updatedAt:n.firestore.FieldValue.serverTimestamp()},g=[e=>e.update(c,p)];f.forEach(e=>{let t={customerName:m.n};e.voucherNo===`OPENING`&&(t.date=m.d,t.bill=m.ib>0?m.ib:0,t.paid=m.ib<0?Math.abs(m.ib):0,t.currentDue=m.ib),g.push(n=>n.update(a.getRef(e.id),t))});for(let e=0;e<g.length;e+=400){let t=h.batch();g.slice(e,e+400).forEach(e=>e(t)),await t.commit()}P(`UPDATE`,`Customers`,e,m.n,{old:{name:t,phone:r,address:i,zone:o,initialDue:l,openingDate:d},new:m}),L.default.fire(`সফল!`,`কাস্টমার তথ্য ও একাউন্ট নম্বর (${m.accNo}) সফলভাবে আপডেট হয়েছে।`,`success`),window.loadCustomers&&window.loadCustomers()}catch(e){z(e,`কাস্টমার তথ্য আপডেট করা যায়নি`)}}}async function Ct(){let e=await p.getAllZones(),t=(t=``)=>{let n=`<option value="">-- জোন সিলেক্ট করুন --</option>`;return e.forEach(e=>{let r=e.name===t?`selected`:``;n+=`<option value="${e.name}" data-code="${e.code||``}" ${r}>${e.name} (${e.code||`N/A`})</option>`}),n+=`<option value="__NEW_ZONE__">+ নতুন জোন যোগ করুন...</option>`,n},r=_(),{value:i}=await L.default.fire({title:`<div class="flex items-center justify-center gap-2 font-bn font-black text-xl text-white"><i class="fa-solid fa-user-plus text-blue-400"></i><span>নতুন কাস্টমার যুক্ত করুন</span></div>`,html:`
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
                        <label class="block text-[11px] font-black text-emerald-400 uppercase tracking-widest mb-1 ml-1">প্রারম্ভিক জের / বকেয়া (৳)</label>
                        <input id="sw-bal" type="text" class="w-full bg-slate-950/90 border border-emerald-500/40 rounded-xl px-3.5 py-2 text-emerald-400 outline-none focus:border-emerald-500 text-xs font-black transition-all" placeholder="০.০০">
                    </div>
                    <div>
                        <label class="block text-[11px] font-black text-slate-400 uppercase tracking-widest mb-1 ml-1">হিসাব খোলার তারিখ *</label>
                        <input id="sw-d" type="text" class="w-full bg-slate-950/90 border border-slate-700/80 rounded-xl px-3.5 py-2 text-white outline-none focus:border-blue-500 text-xs font-bold datepicker cursor-pointer" value="${r}">
                    </div>
                </div>
            </div>
        `,focusConfirm:!1,showCancelButton:!0,confirmButtonText:`<i class="fa-solid fa-circle-check mr-1.5"></i> সেভ করুন`,cancelButtonText:`বাতিল`,customClass:{popup:`!bg-slate-950 !text-white !rounded-3xl border border-slate-800 shadow-2xl !p-6 font-bn`,confirmButton:`m3-btn-primary !bg-blue-600 hover:!bg-blue-500 !text-white !rounded-xl !px-7 !py-2 font-bold`,cancelButton:`m3-btn-tonal !bg-slate-800 hover:!bg-slate-700 !text-slate-300 !rounded-xl !px-5 !py-2 font-bold border border-slate-700`},didOpen:()=>{let n=document.getElementById(`sw-z`),r=document.getElementById(`sw-add-zone-btn`),i=document.getElementById(`sw-zcode`),a=document.getElementById(`sw-acc`),o=async()=>{let e=n?.value;if(e===`__NEW_ZONE__`){n&&(n.value=``),s();return}let t=n?.options[n.selectedIndex],r=t&&t.dataset.code||``;if(i&&(i.value=r),e){let t=await c.peekNextAccountNo(e);a&&(a.value=r+t)}else a&&(a.value=``)},s=async()=>{let{value:r}=await L.default.fire({title:`নতুন জোন যুক্ত করুন`,html:`
                        <div class="space-y-3 text-left font-bn p-2">
                            <div><label class="block text-xs font-bold text-slate-300 mb-1">জোনের নাম * (যেমন: চট্টগ্রাম)</label><input id="nz-name" class="m3-field text-xs font-bold" placeholder="জোনের নাম"></div>
                            <div><label class="block text-xs font-bold text-slate-300 mb-1">জোন শর্ট কোড * (যেমন: CTG)</label><input id="nz-code" class="m3-field text-xs font-bold font-mono uppercase" placeholder="কোড"></div>
                        </div>`,showCancelButton:!0,confirmButtonText:`সেভ জোন`,cancelButtonText:`বাতিল`,customClass:{popup:`!bg-slate-950 !text-white !rounded-3xl border border-slate-800`},preConfirm:()=>{let e=document.getElementById(`nz-name`)?.value?.trim(),t=document.getElementById(`nz-code`)?.value?.trim()?.toUpperCase();return!e||!t?L.default.showValidationMessage(`জোনের নাম ও কোড আবশ্যক!`):{name:e,code:t}}});r&&r.name&&(await p.addZone(r.name,r.code),e=await p.getAllZones(),n&&(n.innerHTML=t(r.name),o()))};n&&n.addEventListener(`change`,o),r&&r.addEventListener(`click`,s)},preConfirm:()=>{let e=document.getElementById(`sw-n`)?.value?.trim(),t=document.getElementById(`sw-p`)?.value?.trim(),n=document.getElementById(`sw-z`)?.value?.trim(),i=document.getElementById(`sw-a`)?.value?.trim(),a=document.getElementById(`sw-bal`)?.value?.trim()||`0`,o=document.getElementById(`sw-d`)?.value?.trim()||r,s=document.getElementById(`sw-acc`)?.value||`Auto`;return!e||!t||!n?(L.default.showValidationMessage(`নাম, মোবাইল ও জোন আবশ্যক!`),!1):{n:e,p:t,z:n,a:i,initialBalance:y(a),d:x(o),accNo:s}}});if(i&&i.n){let t=I(i.initialBalance);if(!(await L.default.fire({title:`<div class="flex items-center justify-center gap-2 font-bn font-black text-xl text-white"><i class="fa-solid fa-file-shield text-blue-400"></i><span>তথ্য যাচাই করুন</span></div>`,html:`
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
                        <span class="text-2xl text-emerald-400 font-black">৳ ${v(i.initialBalance)}</span>
                        ${t?`<div class="text-[11px] text-emerald-400 font-black italic bg-emerald-500/10 px-2.5 py-1 rounded-xl border border-emerald-500/20 mt-1">(${t})</div>`:``}
                    </div>
                    <div class="flex flex-col gap-1 pt-2 border-t border-slate-800/80">
                        <span class="text-[10px] text-slate-400 font-black uppercase tracking-wider">হিসাব খোলার তারিখ</span>
                        <span class="text-sm text-slate-300 font-bold font-mono">${E(i.d)}</span>
                    </div>
                </div>
                <p class="text-xs text-amber-400 font-bold mt-4 text-center">সব তথ্য সঠিক থাকলে "কনফার্ম করুন" বাটনে ক্লিক করুন।</p>
            `,showCancelButton:!0,confirmButtonText:`<i class="fa-solid fa-circle-check mr-2"></i>কনফার্ম করুন`,cancelButtonText:`<i class="fa-solid fa-pen-to-square mr-2"></i>সংশোধন করব`,customClass:{popup:`!bg-slate-950 !text-white !rounded-3xl border border-slate-800 shadow-2xl font-bn`,confirmButton:`m3-btn-primary !bg-blue-600 hover:!bg-blue-500 !px-7 !py-2.5 !rounded-xl font-bold shadow-lg shadow-blue-600/30`,cancelButton:`m3-btn-tonal !bg-slate-800 hover:!bg-slate-700 !text-slate-300 !px-5 !py-2.5 !rounded-xl font-bold border border-slate-700`}})).isConfirmed)return;L.default.fire({title:`সেভ হচ্ছে...`,allowOutsideClick:!1,didOpen:()=>L.default.showLoading()});try{let t=``,r=i.accNo;return await h.runTransaction(async o=>{let s=e.find(e=>e.name===i.z);r=(s?s.code:``)+await c.getNextAccountNo(i.z,o);let l=u.getRef();t=l.id,o.set(l,{name:i.n,phone:i.p,address:i.a||``,zone:i.z,accountNo:r,initialDue:i.initialBalance,totalDue:i.initialBalance,openingDate:i.d,createdAt:n.firestore.FieldValue.serverTimestamp()});let d=a.getRef();o.set(d,{customerId:t,customerName:i.n,date:i.d,voucherNo:`OPENING`,bill:i.initialBalance>0?i.initialBalance:0,paid:i.initialBalance<0?Math.abs(i.initialBalance):0,prevDue:0,currentDue:i.initialBalance,notes:`প্রারম্ভিক জের (Opening Balance)`,createdBy:window.AppState?.currentUserEmail||`System`,createdAt:n.firestore.FieldValue.serverTimestamp()})}),P(`CREATE`,`Customers`,t,i.n,{phone:i.p,zone:i.z,initialBalance:i.initialBalance}),window.loadCustomersForDropdown&&await window.loadCustomersForDropdown(),window.loadCustomers&&window.loadCustomers(),L.default.fire({toast:!0,position:`top-end`,icon:`success`,title:`কাস্টমার "${i.n}" যুক্ত হয়েছে (ID: ${r})`,showConfirmButton:!1,timer:3e3,customClass:{popup:`!bg-slate-900 !text-white border border-slate-700`}}),t}catch(e){z(e,`কাস্টমার সেভ করা যায়নি`)}}}window.quickAddCustomer=Ct;async function wt(e,t){if(await R(`কাস্টমার ডিলেট (Master PIN)`,`deleteCustomer`)&&(await L.default.fire({title:`<i class="fa-solid fa-triangle-exclamation text-red-500 mr-2"></i>সাবধান!`,html:`<p class="text-xs text-slate-300 font-bn leading-relaxed mt-2 text-left">আপনি কি নিশ্চিত যে আপনি <strong>${t}</strong>-এর সম্পূর্ণ প্রোফাইল ডিলেট করতে চান?<br><br><span class="text-red-400 font-bold block bg-red-500/10 p-3 border border-red-500/20 rounded-xl"><i class="fa-solid fa-circle-exclamation mr-1.5"></i>কাস্টমার এবং তার সমস্ত লেনদেনের হিসেব চিরতরে মুছে যাবে। এটি আর কখনো রিকভার করা সম্ভব নয়।</span></p>`,icon:`warning`,showCancelButton:!0,confirmButtonText:`হ্যাঁ, ডিলেট করুন`,cancelButtonText:`বাতিল`,confirmButtonColor:`#dc2626`,customClass:{popup:`!bg-slate-950 !text-white !rounded-3xl border border-red-500/30 font-bn`,confirmButton:`m3-btn-primary !bg-red-600 hover:!bg-red-500`,cancelButton:`m3-btn-tonal !bg-slate-800`}})).isConfirmed)try{let n=await a.getByCustomer(e);await h.runTransaction(async t=>{for(let e of n)t.delete(a.getRef(e.id));t.delete(u.getRef(e))}),P(`DELETE`,`Customers`,e,t),b(`কাস্টমার ডিলেট সম্পন্ন হয়েছে`,`success`),window.renderCustomerTable&&window.renderCustomerTable()}catch(e){L.default.fire(`এরর`,`ডাটাবেস এরর।`,`error`),console.error(e)}}async function Tt(){if(window.AppState.currentUserRole!==`Admin`)return L.default.fire(`অ্যাক্সেস ডিনাইড!`,`শুধুমাত্র অ্যাডমিন কাস্টমার লিস্ট প্রিন্ট করতে পারবেন।`,`error`);if(!await R(`কাস্টমার লিস্ট প্রিন্ট (Full Report)`))return;let{value:e}=await L.default.fire({title:`<div class="flex items-center gap-2 text-sky-400 font-bold text-lg"><i class="fa-solid fa-sliders"></i> প্রিন্ট কলাম কাস্টমাইজেশন</div>`,html:`
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
        `,focusConfirm:!1,showCancelButton:!0,confirmButtonText:`<i class="fa-solid fa-print mr-1.5"></i> রিপোর্ট প্রিন্ট করুন`,cancelButtonText:`বাতিল`,customClass:{popup:`!bg-slate-900 !text-white !rounded-2xl border border-slate-700`,confirmButton:`!bg-sky-600 hover:!bg-sky-500 !text-white !font-bold !px-5 !py-2.5 !rounded-xl`,cancelButton:`!bg-slate-800 hover:!bg-slate-700 !text-slate-300 !font-bold !px-5 !py-2.5 !rounded-xl`},preConfirm:()=>{let e={sl:document.getElementById(`col-sl`).checked,date:document.getElementById(`col-date`).checked,acc:document.getElementById(`col-acc`).checked,code:document.getElementById(`col-code`).checked,name:document.getElementById(`col-name`).checked,addr:document.getElementById(`col-addr`).checked,phone:document.getElementById(`col-phone`).checked,zone:document.getElementById(`col-zone`).checked,bal:document.getElementById(`col-bal`).checked};return Object.values(e).some(Boolean)?e:(L.default.showValidationMessage(`কমপক্ষে ১টি কলাম সিলেক্ট করতেই হবে!`),!1)}});if(!e)return;let t=document.getElementById(`cust-search-input`)?.value.trim(),n=document.getElementById(`cust-filter-zone`)?.value,r=H.filter(e=>{let r=!t||e.name.toLowerCase().includes(t.toLowerCase())||e.accountNo&&e.accountNo.includes(t),i=!n||e.zone===n;return r&&i});if(r.length===0)return L.default.fire(`Error`,`লিস্টে কোনো ডাটা নেই!`,`warning`);r.sort((e,t)=>(e.accountNo||``).localeCompare(t.accountNo||``,void 0,{numeric:!0}));let i=await c.getAppSettings(),a=await p.getAllZones(),o={};a&&a.length&&a.forEach(e=>o[(e.name||``).trim()]=(e.code||``).trim());let s=n?`${n} জোনের কাস্টমার লিস্ট`:`সকল কাস্টমার লিস্ট`,l=0;r.forEach(e=>l+=Number(e.totalDue)||0);let[u,d,f]=_().split(`-`),m=`${f}/${d}/${u}`,h=C(i,{title:`CUSTOMER REPORT`,subtitle:`${s} • ${m}`}),g=`
        <div style="display:flex; justify-content:space-between; align-items:flex-end; border-bottom:2px solid #0284c7; padding-bottom:4px; margin-bottom:8px;">
            <div style="font-size:14px; font-weight:900; color:#0f172a; font-family:'Inter',sans-serif;">CUSTOMER REPORT <span style="font-size:10px; color:#475569; font-weight:normal;">(Continued)</span></div>
            <div style="font-size:10px; color:#475569; font-family:'Hind Siliguri',sans-serif;">${s} • ${m}</div>
        </div>
    `,y=r.map((t,n)=>{let r=n%2==0?`background: #ffffff;`:`background: #f8fafc;`,i=Number(t.totalDue)||0,a=i>0?`#dc2626`:i<0?`#059669`:`#64748b`,s=i===0?`৳ 0`:`৳ ${v(i)}`,c=t.zone?`<span style="background: #f1f5f9; border: 1px solid #cbd5e1; padding: 2px 7px; border-radius: 10px; font-size: 10px; font-weight: 700; color: #334155; display: inline-block;">${D(t.zone)}</span>`:`-`,l=`-`;if(t.createdAt)try{let e=t.createdAt.toDate?t.createdAt.toDate():new Date(t.createdAt);isNaN(e)||(l=e.toLocaleDateString(`en-GB`))}catch{}else t.date&&(l=t.date);let u=(t.zone||``).trim(),d=o[u]?o[u]:`-`,f=``;return e.sl&&(f+=`<td style="text-align:center; vertical-align:middle; border: 1px solid #e2e8f0; padding: 5px 4px; font-size: 11px; font-family: 'Inter', sans-serif; color: #475569;">${n+1}</td>`),e.date&&(f+=`<td style="text-align:center; vertical-align:middle; border: 1px solid #e2e8f0; padding: 5px 4px; font-size: 10.5px; font-family: 'Inter', sans-serif; color: #475569;">${l}</td>`),e.acc&&(f+=`<td style="text-align:center; vertical-align:middle; border: 1px solid #e2e8f0; padding: 5px 4px; font-size: 11px; font-weight: 800; font-family: 'Inter', monospace; color: #0284c7;">${D(t.accountNo||`-`)}</td>`),e.code&&(f+=`<td style="text-align:center; vertical-align:middle; border: 1px solid #e2e8f0; padding: 5px 4px; font-size: 10.5px; font-weight: 700; font-family: 'Inter', monospace; color: #475569;">${D(d)}</td>`),e.name&&(f+=`<td style="text-align:left; vertical-align:middle; border: 1px solid #e2e8f0; padding: 5px 6px; font-size: 11px; font-family: 'Kalpurush', 'Hind Siliguri', sans-serif; line-height: 1.25; color: #0f172a;"><strong>${D(t.name)}</strong></td>`),e.addr&&(f+=`<td style="text-align:left; vertical-align:middle; border: 1px solid #e2e8f0; padding: 5px 6px; font-size: 10.5px; font-family: 'Kalpurush', 'Hind Siliguri', sans-serif; line-height: 1.25; color: #334155;">${D(t.address||`-`)}</td>`),e.phone&&(f+=`<td style="text-align:center; vertical-align:middle; border: 1px solid #e2e8f0; padding: 5px 4px; font-size: 11px; font-family: 'Inter', sans-serif; white-space: nowrap; color: #334155;">${D(t.phone||`-`)}</td>`),e.zone&&(f+=`<td style="text-align:center; vertical-align:middle; border: 1px solid #e2e8f0; padding: 5px 4px; font-size: 11px; font-family: 'Kalpurush', 'Hind Siliguri', sans-serif;">${c}</td>`),e.bal&&(f+=`<td style="text-align:right; vertical-align:middle; border: 1px solid #e2e8f0; padding: 5px 6px; font-size: 11px; font-weight: 900; color: ${a}; font-family: 'Inter', sans-serif; white-space: nowrap;">${s}</td>`),{html:`<tr class="print-row-no-break" style="${r}">${f}</tr>`,textLength:e.addr?(t.address||``).length:10}}),b=``;e.sl&&(b+=`<th style="width: 32px; text-align: center; border: 1px solid #cbd5e1; padding: 7px 4px; font-size: 11px; font-weight: 900; color: #1e293b; font-family: 'Hind Siliguri', sans-serif;">SL</th>`),e.date&&(b+=`<th style="width: 70px; text-align: center; border: 1px solid #cbd5e1; padding: 7px 4px; font-size: 11px; font-weight: 900; color: #1e293b; font-family: 'Hind Siliguri', sans-serif;">তারিখ</th>`),e.acc&&(b+=`<th style="width: 65px; text-align: center; border: 1px solid #cbd5e1; padding: 7px 4px; font-size: 11px; font-weight: 900; color: #1e293b; font-family: 'Hind Siliguri', sans-serif;">A/C NO</th>`),e.code&&(b+=`<th style="width: 50px; text-align: center; border: 1px solid #cbd5e1; padding: 7px 4px; font-size: 11px; font-weight: 900; color: #1e293b; font-family: 'Hind Siliguri', sans-serif;">কোড</th>`),e.name&&(b+=`<th style="text-align: left; border: 1px solid #cbd5e1; padding: 7px 6px; font-size: 11px; font-weight: 900; color: #1e293b; font-family: 'Hind Siliguri', sans-serif;">কাস্টমারের নাম</th>`),e.addr&&(b+=`<th style="text-align: left; border: 1px solid #cbd5e1; padding: 7px 6px; font-size: 11px; font-weight: 900; color: #1e293b; font-family: 'Hind Siliguri', sans-serif;">ঠিকানা</th>`),e.phone&&(b+=`<th style="width: 100px; text-align: center; border: 1px solid #cbd5e1; padding: 7px 4px; font-size: 11px; font-weight: 900; color: #1e293b; font-family: 'Hind Siliguri', sans-serif;">মোবাইল নম্বর</th>`),e.zone&&(b+=`<th style="width: 65px; text-align: center; border: 1px solid #cbd5e1; padding: 7px 4px; font-size: 11px; font-weight: 900; color: #1e293b; font-family: 'Hind Siliguri', sans-serif;">জোন</th>`),e.bal&&(b+=`<th style="width: 85px; text-align: right; border: 1px solid #cbd5e1; padding: 7px 6px; font-size: 11px; font-weight: 900; color: #1e293b; font-family: 'Hind Siliguri', sans-serif;">ব্যালেন্স (৳)</th>`),We(await Ve({rowsArray:y,page1HeaderHtml:h,repeatHeaderHtml:g,tableColHeaderHtml:`<thead><tr style="background: #f1f5f9; border-bottom: 2px solid #cbd5e1;">${b}</tr></thead>`,summaryHtml:`
        <div style="display: flex; justify-content: flex-end; margin-top: 16px; page-break-inside: avoid; break-inside: avoid;">
            <div style="width: 260px; background: #f8fafc; border: 1px solid #cbd5e1; border-radius: 10px; padding: 12px; font-family: 'Hind Siliguri', sans-serif; box-shadow: 0 1px 3px rgba(0,0,0,0.05);">
                <div style="display: flex; justify-content: space-between; font-size: 12px; margin-bottom: 6px; border-bottom: 1px dashed #cbd5e1; padding-bottom: 4px;">
                    <span style="color: #64748b; font-weight: 700;">মোট কাস্টমার:</span>
                    <strong style="color: #0f172a; font-weight: 900;">${r.length} জন</strong>
                </div>
                <div style="display: flex; justify-content: space-between; font-size: 12px;">
                    <span style="color: #64748b; font-weight: 700;">মার্কেটে মোট বকেয়া:</span>
                    <strong style="color: #dc2626; font-size: 15px; font-weight: 900;">৳ ${v(l)}</strong>
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
    `,formattedDate:m}))}async function Et(){try{let e=await p.getAllZones(),t=`<option value="">-- জোন সিলেক্ট --</option>`,n=`<option value="">-- সকল জোন (All Zones) --</option>`;ht(e),e.forEach(e=>{t+=`<option value="${e.name}" data-code="${e.code}">${e.name} (Code: ${e.code})</option>`,n+=`<option value="${e.name}">${e.name}</option>`});let r=document.getElementById(`cust-zone-select`),i=document.getElementById(`cust-filter-zone`),a=document.getElementById(`dash-cust-zone-select`);r&&(r.innerHTML=t),i&&(i.innerHTML=n),a&&(a.innerHTML=t)}catch(e){console.error(`Error loading zones:`,e)}}async function Dt(e=`next`){let t=document.getElementById(`customer-list`);if(t){T(t,5);try{let t=e===`next`?it:at.length>1?at[at.length-2]:null,n=await u.getByPage(20,t,`createdAt`,`desc`);ut(n.lastDoc),e===`next`?t&&at.push(t):at.pop(),document.getElementById(`cust-current-page-display`).innerText=ot,document.getElementById(`cust-prev-page`).disabled=ot===1,document.getElementById(`cust-next-page`).disabled=n.count<20,yt(n.data)}catch(e){console.error(`Load customer page error:`,e),t.innerHTML=`<tr><td colspan="6" class="text-center py-20 text-red-400">ডাটা লোড করতে সমস্যা হয়েছে</td></tr>`}}}async function Ot(){let e=document.getElementById(`cust-search-input`)?.value.trim()||``,t=document.getElementById(`cust-filter-zone`)?.value||``,n=document.getElementById(`cust-pagination`);if(!e&&!t){pt(!1),n&&n.classList.remove(`hidden`),Dt();return}pt(!0),n&&n.classList.add(`hidden`);let r=H;(!r||r.length===0)&&(r=await u.getAll(`name`,`asc`));let i=r.filter(n=>{let r=!e||(typeof window.matchCustomerSearch==`function`?window.matchCustomerSearch(n,e):(n.name||``).toLowerCase().includes(e.toLowerCase())),i=!t||n.zone===t;return r&&i});yt(i),kt(i)}function kt(e){let t=0;e.forEach(e=>t+=Number(e.totalDue)||0);let n=document.getElementById(`cust-count-badge`),r=document.getElementById(`cust-total-due-badge`);n&&(n.innerText=e.length),r&&(r.innerText=`৳ `+v(t))}async function At(e,t,n,r=``){if(window.AppState?.currentUserRole===`Staff`&&window.AppState?.permissions?.sendSMS===!1)return L.default.fire({title:`অ্যাক্সেস ডিনাইড!`,text:`আপনার কাস্টমারদের SMS পাঠানোর অনুমতি নেই।`,icon:`error`,customClass:{popup:`!bg-slate-900 !text-white !rounded-3xl border border-slate-700`}});if(!e||e===`-`||e.trim()===``)return L.default.fire({title:`মোবাইল নম্বর মিসিং!`,text:`কাস্টমার "${n}"-এর কোনো মোবাইল নম্বর যুক্ত করা নেই। কাস্টমার এডিট করে নম্বর যোগ করুন।`,icon:`warning`,customClass:{popup:`!bg-slate-900 !text-white !rounded-3xl border border-slate-700`}});if(await R(`বকেয়া রিমাইন্ডার SMS পাঠানো (Master PIN)`))try{let i=await c.getAppSettings(),a=(typeof window.toBanglishName==`function`?window.toBanglishName(n):n)||`Customer`,o=i.shopName?typeof window.toBanglishName==`function`?window.toBanglishName(i.shopName):i.shopName:`M/S. Maa Motors`,s=window.formatAppDate&&window.getTodayLocalDateString?window.formatAppDate(window.getTodayLocalDateString()):`Today`,l=r?`(A/C: ${r})`:``,u=(i.smsTemplateReminder||`Reminder: Dear [Name] [AccNo], your due is Tk [Due] on [Date]. Kindly clear payment soon. Thanks! - [Shop]`).replace(/\[Name\]/g,a).replace(/\[AccNo\]/g,l).replace(/\[Shop\]/g,o).replace(/\[Date\]/g,s).replace(/\[Due\]/g,v(t));u=u.replace(/\s+/g,` `).replace(/[^\x00-\x7F]/g,``);let{value:d}=await L.default.fire({title:`<i class="fa-solid fa-comment-sms text-blue-400 mr-2"></i>Send Reminder SMS`,html:`<div class="text-left space-y-1 mb-2 font-bn"><div class="text-xs text-slate-400">Recipient Phone: <strong class="text-white">${e}</strong></div><div id="sms-rem-char-counter" class="text-[11px] font-bold text-emerald-400 text-right">0 / 160 Characters (1 SMS)</div></div>`,input:`textarea`,inputValue:u,inputAttributes:{rows:5,class:`m3-field text-xs font-mono`},showCancelButton:!0,confirmButtonText:`<i class="fa-solid fa-paper-plane mr-1.5"></i> Send SMS`,cancelButtonText:`Cancel`,customClass:{popup:`!bg-slate-900 !text-white !rounded-3xl border border-slate-700`},didOpen:()=>{let e=L.default.getInput(),t=document.getElementById(`sms-rem-char-counter`),n=()=>{if(e&&t){let n=e.value.length,r=Math.ceil(n/160)||1;t.innerText=`${n} / 160 Characters (${r} SMS)`}};e&&(e.oninput=n),n()}});d&&await be(e,d,!1)&&L.default.fire({title:`<i class="fa-solid fa-paper-plane text-emerald-400 mr-2"></i>সফল!`,text:`${n}-কে রিমাইন্ডার SMS সফলভাবে পাঠানো হয়েছে`,icon:`success`,customClass:{popup:`!bg-slate-900 !text-white !rounded-3xl border border-slate-700`}})}catch(e){console.error(e),L.default.fire(`ব্যর্থ!`,`ডাটাবেস এরর।`,`error`)}}async function jt(){let e=document.getElementById(`cust-zone-select`),t=document.getElementById(`cust-zone-code-display`),n=document.getElementById(`cust-generated-acc`);if(!(!e||!t||!n))if(e.selectedIndex>0){let r=e.value,i=e.options[e.selectedIndex].dataset.code;t.value=i;try{n.value=`লোডিং...`,n.value=i+await c.peekNextAccountNo(r)}catch(e){console.error(e),n.value=`Error`}}else t.value=``,n.value=``}async function Mt(){let e=document.getElementById(`dash-cust-zone-select`),t=document.getElementById(`dash-cust-zone-code-display`),n=document.getElementById(`dash-cust-generated-acc`);if(!(!e||!t||!n))if(e.selectedIndex>0){let r=e.value,i=e.options[e.selectedIndex].dataset.code;t.value=i;try{n.value=`লোডিং...`,n.value=i+await c.peekNextAccountNo(r)}catch(e){console.error(e),n.value=`Error`}}else t.value=``,n.value=``}window.handleDashZoneChange=Mt;var Nt=`modulepreload`,Pt=function(e){return`/`+e},Ft={},G=function(e,t,n){let r=Promise.resolve();if(t&&t.length>0){let e=document.getElementsByTagName(`link`),i=document.querySelector(`meta[property=csp-nonce]`),a=i?.nonce||i?.getAttribute(`nonce`);function o(e){return Promise.all(e.map(e=>Promise.resolve(e).then(e=>({status:`fulfilled`,value:e}),e=>({status:`rejected`,reason:e}))))}function s(e){return import.meta.resolve?import.meta.resolve(e):new URL(e,import.meta.url).href}r=o(t.map(t=>{if(t=Pt(t,n),t=s(t),t in Ft)return;Ft[t]=!0;let r=t.endsWith(`.css`);for(let n=e.length-1;n>=0;n--){let i=e[n];if(i.href===t&&(!r||i.rel===`stylesheet`))return}let i=document.createElement(`link`);if(i.rel=r?`stylesheet`:Nt,r||(i.as=`script`),i.crossOrigin=``,i.href=t,a&&i.setAttribute(`nonce`,a),document.head.appendChild(i),r)return new Promise((e,n)=>{i.addEventListener(`load`,e),i.addEventListener(`error`,()=>n(Error(`Unable to preload CSS for ${t}`)))})}))}function i(e){let t=new Event(`vite:preloadError`,{cancelable:!0});if(t.payload=e,window.dispatchEvent(t),!t.defaultPrevented)throw e}return r.then(t=>{for(let e of t||[])e.status===`rejected`&&i(e.reason);return e().catch(i)})};async function It(e,t,n,r,i,o,s,l,d={}){if(await R(`SMS পাঠানোর অনুমতি (Master PIN)`))try{let{currentLedgerTxnsMap:f,currentLedgerTxns:p}=d,m=f&&f[e]?f[e]:(p||[]).find(t=>t.id===e);if(!m&&e)try{m=await a.getById(e)}catch(e){console.error(`Error fetching txn:`,e)}let h=l||m?.customerId,g=t||m?.customerName||`Customer`,_=n||m?.date,y=r===void 0?m?.voucherNo||``:r,b=Number(i===void 0?m?.bill||0:i),x=Number(o===void 0?m?.paid||0:o),S=U().find(e=>e.id===h);if(!S&&h)try{S=await u.getById(h)}catch(e){console.error(`Error fetching cust:`,e)}let C=m?.phone||S?.phone||``,w=m?.calculatedDue===void 0?Number(s===void 0?S?S.totalDue||0:m?.currentDue||0:s):m.calculatedDue;if(!C){let{value:e}=await L.default.fire({title:`<i class="fa-solid fa-mobile-screen text-blue-400 mr-2"></i>Enter Phone Number`,input:`text`,inputLabel:`Phone number missing for "${g}". Enter phone number:`,inputPlaceholder:`018XXXXXXXX`,showCancelButton:!0,confirmButtonText:`Next`,cancelButtonText:`Cancel`,customClass:{popup:`!bg-slate-900 !text-white !rounded-3xl border border-slate-700`}});if(!e||!e.trim())return;C=e.trim()}let T=await c.getAppSettings(),ee=E(_),D=v(b),O=v(x),k=v(Math.abs(w)),A=y===`OPENING`||y===`OPEN`||y===`প্রারম্ভিক জের`||_&&String(y).toUpperCase()===`OPENING`,te=(typeof window.toBanglishName==`function`?window.toBanglishName(g):g)||`Customer`,j=T.shopName?typeof window.toBanglishName==`function`?window.toBanglishName(T.shopName):T.shopName:`M/S. Maa Motors`,M=S?.accountNo||m?.customerAccountNo||m?.accountNo||``,ne=M?`(A/C: ${M})`:``,N=``;if(A)N=(T.smsTemplateOpening||`Dear [Name] [AccNo], A/C opened at [Shop] on [Date]. Opening Due: Tk [Due]. Thanks!`).replace(/\[Name\]/g,te).replace(/\[AccNo\]/g,ne).replace(/\[Shop\]/g,j).replace(/\[Date\]/g,ee).replace(/\[Due\]/g,k);else if(b>0)N=(T.smsTemplateNew||`Dear [Name] [AccNo], Memo #[Memo] of Tk [Bill] created on [Date]. Paid: Tk [Paid], Due: Tk [Due]. Thanks! - [Shop]`).replace(/\[Name\]/g,te).replace(/\[AccNo\]/g,ne).replace(/\[Shop\]/g,j).replace(/\[Date\]/g,ee).replace(/\[Memo\]/g,y||`1`).replace(/\[Bill\]/g,D).replace(/\[Paid\]/g,O).replace(/\[Due\]/g,k);else{let e=T.smsTemplatePaid||`Dear [Name] [AccNo], Received Tk [Paid] ([Type]) on [Date]. Net Due: Tk [Due]. Thanks! - [Shop]`,t=m?.receivedType||`Cash`;N=e.replace(/\[Name\]/g,te).replace(/\[AccNo\]/g,ne).replace(/\[Shop\]/g,j).replace(/\[Date\]/g,ee).replace(/\[Paid\]/g,O).replace(/\[Type\]/g,t).replace(/\[Due\]/g,k)}N=N.replace(/\s+/g,` `).replace(/[^\x00-\x7F]/g,``);let{value:re}=await L.default.fire({title:`<i class="fa-solid fa-comment-sms text-blue-400 mr-2"></i>Send Transaction SMS`,html:`<div class="text-left space-y-1 mb-2 font-bn"><div class="text-xs text-slate-400">Recipient Phone: <strong class="text-white">${C}</strong></div><div id="sms-char-counter" class="text-[11px] font-bold text-emerald-400 text-right">0 / 160 Characters (1 SMS)</div></div>`,input:`textarea`,inputValue:N,inputAttributes:{rows:5,class:`m3-field text-xs font-mono`},showCancelButton:!0,confirmButtonText:`<i class="fa-solid fa-paper-plane mr-1.5"></i> Send SMS`,cancelButtonText:`Cancel`,customClass:{popup:`!bg-slate-900 !text-white !rounded-3xl border border-slate-700`},didOpen:()=>{let e=L.default.getInput(),t=document.getElementById(`sms-char-counter`),n=()=>{if(e&&t){let n=e.value.length,r=Math.ceil(n/160)||1;t.innerText=`${n} / 160 Characters (${r} SMS)`}};e&&(e.oninput=n),n()}});re&&await be(C,re,!1)&&L.default.fire({title:`<i class="fa-solid fa-paper-plane text-emerald-400 mr-2"></i>সফল!`,text:`${g}-কে SMS সফলভাবে পাঠানো হয়েছে`,icon:`success`,customClass:{popup:`!bg-slate-900 !text-white !rounded-3xl border border-slate-700`}})}catch(e){console.error(`sendTxnSMS error:`,e),L.default.fire({title:`এরর!`,text:`SMS তৈরি করতে সমস্যা হয়েছে: `+(e.message||e),icon:`error`,customClass:{popup:`!bg-slate-900 !text-white !rounded-3xl border border-slate-700`}})}}async function Lt(e,t,n,r,i,o,s,c,l={}){let{currentLedgerTxns:d}=l,f=(d||[]).find(t=>t.id===e);if(!f&&e)try{f=await a.getById(e)}catch(e){console.error(`Error fetching txn:`,e)}let p=c||f?.customerId,m=t||f?.customerName||`Customer`,h=n||f?.date,g=r===void 0?f?.voucherNo||``:r,_=Number(i===void 0?f?.bill||0:i),y=Number(o===void 0?f?.paid||0:o),b=U().find(e=>e.id===p);if(!b&&p)try{b=await u.getById(p)}catch(e){console.error(`Error fetching cust:`,e)}let x=b?.phone||``,S=Number(s===void 0?b?b.totalDue||0:f?.currentDue||0:s);if(!x){let{value:e}=await L.default.fire({title:`<i class="fa-brands fa-whatsapp text-emerald-400 mr-2"></i>Enter Phone Number`,input:`text`,inputLabel:`Phone number missing for "${m}". Enter phone number:`,inputPlaceholder:`018XXXXXXXX`,showCancelButton:!0,confirmButtonText:`Next`,cancelButtonText:`Cancel`,customClass:{popup:`!bg-slate-900 !text-white !rounded-3xl border border-slate-700`}});if(!e||!e.trim())return;x=e.trim()}let C=b?.accountNo||f?.customerAccountNo||f?.accountNo||``,w=C?`একাউন্ট নং: ${C}\n`:``,T=E(h),ee=v(_),D=v(y),O=v(Math.abs(S)),k=g?`মেমো #${g}`:``,A=targetTxnId?`${window.location.origin}${window.location.pathname}?view=public-memo&id=${targetTxnId}`:``,te=p?`${window.location.origin}${window.location.pathname}?view=public-stmt&id=${p}`:``,j=A?`আপনার এই মেমোর ডাইরেক্ট PDF দেখতে লিংকে ক্লিক করুন:\n${A}\n\n`:te?`আপনার সম্পূর্ণ মেমো ও হিসাবের PDF বিবরণী দেখতে নিচের লিংকে ক্লিক করুন:\n${te}\n\n`:``,M=``;if(g===`OPENING`||g===`OPEN`||g===`প্রারম্ভিক জের`||h&&String(g).toUpperCase()===`OPENING`){M=`আসসালামু আলাইকুম ${m},\nমেসার্স মা মোটরস্ থেকে আপনার হিসাবের একাউন্ট খোলা হয়েছে।\n\n${w}একাউন্ট খোলার তারিখ: ${T}\n`;let e=_>0?_:y>0?-y:0,t=v(Math.abs(e));M+=e>0?`প্রারম্ভিক বকেয়া: ৳ ${t}\n`:e<0?`প্রারম্ভিক জমা: ৳ ${t}\n`:`প্রারম্ভিক জের: ৳ 0
`,M+=`---------------------------------
`,M+=S<0?`অ্যাডভান্স জমা: ৳ ${O}\n\n`:`বর্তমান মোট বকেয়া: ৳ ${O}\n\n`,j&&(M+=j),M+=`যোগাযোগ: 01819-397669
ধন্যবাদ! — মেসার্স মা মোটরস্`}else _>0?(M=`আসসালামু আলাইকুম ${m},\nমেসার্স মা মোটরস্ থেকে আপনার কেনাকাটার বিবরণী:\n\n${w}তারিখ: ${T}\n${k?k+`
`:``}আজকের বিল/খরচ: ৳ ${ee}\nআজকের জমা: ৳ ${D}\n---------------------------------\n`,M+=S<0?`অ্যাডভান্স জমা: ৳ ${O}\n\n`:`বর্তমান মোট বকেয়া: ৳ ${O}\n\n`,j&&(M+=j),M+=`যোগাযোগ: 01819-397669
ধন্যবাদ! — মেসার্স মা মোটরস্`):(M=`আসসালামু আলাইকুম ${m},\nমেসার্স মা মোটরস্-এ আপনার টাকা জমা নেওয়ার রিসিট:\n\n${w}তারিখ: ${T}\nজমা প্রাপ্তি: ৳ ${D}\n---------------------------------\n`,M+=S<0?`অ্যাডভান্স জমা: ৳ ${O}\n\n`:`বর্তমান মোট বকেয়া: ৳ ${O}\n\n`,j&&(M+=j),M+=`যোগাযোগ: 01819-397669
ধন্যবাদ! — মেসার্স মা মোটরস্`);let{value:ne}=await L.default.fire({title:`<div class="flex items-center justify-center gap-2 font-bn font-black text-lg text-emerald-400"><i class="fa-brands fa-whatsapp text-xl"></i><span>Send WhatsApp Message</span></div>`,html:`<div class="text-left space-y-1 mb-2 font-bn"><div class="text-xs text-slate-400">Recipient Phone: <strong class="text-white">${x}</strong></div></div>`,input:`textarea`,inputValue:M,inputAttributes:{rows:8,class:`m3-field text-xs font-bn`},showCancelButton:!0,confirmButtonText:`<i class="fa-brands fa-whatsapp mr-1.5"></i> Open WhatsApp`,cancelButtonText:`Cancel`,customClass:{popup:`!bg-slate-950 !text-white !rounded-3xl border border-slate-800 shadow-2xl font-bn`,confirmButton:`m3-btn-primary !bg-emerald-600 hover:!bg-emerald-500 !px-6 !py-2 rounded-xl font-bold`}});ne&&window.sendWhatsApp&&window.sendWhatsApp(x,ne)}async function Rt(e,t){try{if(L.default!==void 0&&L.default.close&&L.default.close(),typeof window.printReceiptEngine==`function`)await window.printReceiptEngine(e,t);else{let{printReceiptEngine:n}=await G(async()=>{let{printReceiptEngine:e}=await import(`./receipt-engine-D700sZE3.js`);return{printReceiptEngine:e}},__vite__mapDeps([0,1,2,3,4,5,6,7,8]));window.printReceiptEngine=n,await window.printReceiptEngine(e,t)}}catch(e){typeof b==`function`&&b(`প্রিন্ট লোড ব্যর্থ: ${e.message}`,`error`,`প্রিন্ট Error`)}}function zt(e){L.default.fire({title:`<div class="flex items-center justify-center gap-2 font-bn font-black text-lg text-white"><i class="fa-solid fa-print text-emerald-400"></i><span>রিসিট প্রিন্ট ফরম্যাট নির্বাচন করুন</span></div>`,html:`
            <div class="flex flex-col gap-3 p-1 font-bn mt-2">
                <button type="button" onclick="window.executePrint('${e}', 'pos')" class="h-11 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-blue-600/30 transition-all cursor-pointer">
                    <i class="fa-solid fa-receipt text-sm"></i> POS রিসিট (80mm Thermal Printer)
                </button>
                <button type="button" onclick="window.executePrint('${e}', 'a4')" class="h-11 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs flex items-center justify-center gap-2 border border-slate-700 transition-all cursor-pointer">
                    <i class="fa-solid fa-file-invoice text-sm text-purple-400"></i> A4 ফুল পেপার মেমো (Standard Invoice)
                </button>
            </div>
        `,showConfirmButton:!1,showCancelButton:!0,cancelButtonText:`বাতিল`,customClass:{popup:`!bg-slate-950 !text-white !rounded-3xl border border-slate-800 shadow-2xl font-bn`,cancelButton:`!bg-slate-900 hover:!bg-slate-800 !text-slate-400 !px-6 !py-2 !rounded-xl text-xs font-bold border border-slate-800`}})}async function Bt(){if(await R(`বাল্ক তাগাদা পাঠানো`,`sendBulkSMS`))try{L.default.fire({title:`লোডিং...`,text:`বকেয়া কাস্টমার তালিকা স্ক্যান করা হচ্ছে...`,allowOutsideClick:!1,didOpen:()=>L.default.showLoading(),customClass:{popup:`!bg-slate-950 !text-white !rounded-3xl border border-slate-800 font-bn`}});let e=(await u.getAll()).filter(e=>(Number(e.totalDue)||0)>0&&e.phone).sort((e,t)=>(Number(t.totalDue)||0)-(Number(e.totalDue)||0));if(L.default.close(),e.length===0)return L.default.fire({title:`কোনো বকেয়া পাওয়া যায়নি!`,text:`বর্তমানে কোনো কাস্টমারের বকেয়া নেই বা মোবাইল নম্বর যুক্ত নেই।`,icon:`info`,customClass:{popup:`!bg-slate-950 !text-white !rounded-3xl border border-slate-800 font-bn`}});let t=(await c.getAppSettings()).shopName||`M/S. MAA-MOTOR'S`,n=E(_()),r=``;e.forEach((e,t)=>{let n=t<10?`checked`:``,i=e.accountNo?`(${e.accountNo})`:``;r+=`
                <tr class="border-b border-slate-800 hover:bg-slate-900/50 bulk-row" data-search="${(e.name+` `+(e.phone||``)+` `+(e.accountNo||``)).toLowerCase()}">
                    <td class="p-2 text-center w-8">
                        <input type="checkbox" class="bulk-cust-chk w-4 h-4 rounded cursor-pointer" data-id="${e.id}" data-due="${e.totalDue||0}" ${n}>
                    </td>
                    <td class="p-2 font-bold text-white text-xs">${e.name} <span class="text-amber-400 font-mono text-[11px]">${i}</span></td>
                    <td class="p-2 text-slate-300 text-xs font-mono">${e.phone}</td>
                    <td class="p-2 text-right font-black text-red-400 text-xs font-mono">৳ ${v(e.totalDue)}</td>
                </tr>
            `});let i=()=>{let e=document.querySelectorAll(`.bulk-cust-chk:checked`),t=0;e.forEach(e=>{t+=Number(e.dataset.due||0)});let n=document.getElementById(`bulk-selected-count`),r=document.getElementById(`bulk-selected-sum`);n&&(n.innerText=`${e.length} জন`),r&&(r.innerText=`৳ ${v(t)}`)},{value:a}=await L.default.fire({title:`<div class="flex items-center justify-center gap-2 font-bn font-black text-xl text-amber-400"><i class="fa-solid fa-paper-plane text-2xl"></i><span>বাল্ক তাগাদা কাস্টমার সিলেক্টর প্যানেল</span></div>`,html:`
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
            `,showCloseButton:!0,showCancelButton:!0,confirmButtonText:`<i class="fa-solid fa-paper-plane mr-1.5"></i> ব্যাচ ডিসপ্যাচ শুরু করুন`,cancelButtonText:`বাতিল (Cancel)`,customClass:{popup:`!bg-slate-950 !text-white !rounded-3xl border border-amber-500/30 shadow-2xl font-bn max-w-2xl`,confirmButton:`m3-btn-primary !bg-amber-600 hover:!bg-amber-500 !px-6 !py-2.5 rounded-xl font-bold`,cancelButton:`m3-btn-tonal !bg-slate-800 hover:!bg-slate-700 !text-slate-300 !px-5 !py-2.5 rounded-xl font-bold`},didOpen:()=>{i();let e=document.getElementById(`bulk-cust-search`);e&&e.addEventListener(`input`,e=>{let t=e.target.value.toLowerCase().trim();document.querySelectorAll(`.bulk-row`).forEach(e=>{e.style.display=(e.dataset.search||``).includes(t)?``:`none`})});let t=document.getElementById(`btn-bulk-toggle-all`);t&&t.addEventListener(`click`,()=>{let e=document.querySelectorAll(`.bulk-cust-chk`),t=Array.from(e).some(e=>!e.checked);e.forEach(e=>e.checked=t),i()}),document.querySelectorAll(`.bulk-cust-chk`).forEach(e=>e.addEventListener(`change`,i))},preConfirm:()=>{let t=document.querySelector(`input[name="bulk_mode"]:checked`)?.value||`sms`,n=Array.from(document.querySelectorAll(`.bulk-cust-chk:checked`)).map(e=>e.dataset.id);return n.length===0?(L.default.showValidationMessage(`কমপক্ষে ১ জন কাস্টমার সিলেক্ট করতে হবে!`),!1):{mode:t,selectedCustomers:e.filter(e=>n.includes(e.id))}}});if(!a)return;a.mode===`sms`?await Vt(a.selectedCustomers,t,n):await Ht(a.selectedCustomers,t,n)}catch(e){console.error(e),b(`বাল্ক ডিসপ্যাচ প্রসেসিং এ ট্রুটি হয়েছে`,`error`)}}async function Vt(e,t,n){let r=0,i=0,a=!1;for(let o=0;o<e.length&&!a;o++){let s=e[o],c=Math.round((o+1)/e.length*100),l=await L.default.fire({title:`<div class="font-bn font-black text-lg text-white">বাল্ক SMS পাঠানো হচ্ছে (${o+1}/${e.length})</div>`,html:`
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
            `,allowOutsideClick:!1,showCloseButton:!0,showCancelButton:!0,showConfirmButton:!1,cancelButtonText:`<i class="fa-solid fa-xmark mr-1"></i> থামুন (Cancel Batch)`,customClass:{popup:`!bg-slate-950 !text-white !rounded-3xl border border-slate-800 font-bn`,cancelButton:`m3-btn-tonal !bg-red-950 hover:!bg-red-900 !text-red-300 border border-red-500/30`},didOpen:async()=>{try{let e=s.accountNo?` (${s.accountNo})`:``,a=`Reminder: Dear ${s.name}${e}, your due is Tk ${v(s.totalDue)} on ${n}. Kindly clear payment soon. Thanks! - ${t}`;await It(s.phone,a)?r++:i++}catch{i++}setTimeout(()=>L.default.clickConfirm(),400)}});if(l.isDismissed&&(l.dismiss===L.default.DismissReason.cancel||l.dismiss===L.default.DismissReason.close)){a=!0,b(`বাল্ক SMS ডিসপ্যাচ থামানো হয়েছে`,`info`);break}}P(`BULK_DISPATCH`,`Customer`,`bulk_sms`,`Selected ${e.length} due bulk SMS dispatched`,{successCount:r,failCount:i}),a||L.default.fire({title:`<div class="font-bn font-black text-xl text-emerald-400"><i class="fa-solid fa-circle-check text-2xl mr-2"></i>ডিসপ্যাচ সম্পন্ন!</div>`,html:`
                <div class="space-y-2 font-bn text-slate-300 text-sm">
                    <p>মোট সিলেক্টেড কাস্টমার: <strong>${e.length} জন</strong></p>
                    <p class="text-emerald-400 font-bold"><i class="fa-solid fa-circle-check text-emerald-400 mr-1"></i> সফলভাবে পাঠানো হয়েছে: ${r} টি</p>
                    ${i>0?`<p class="text-red-400 font-bold"><i class="fa-solid fa-circle-xmark text-red-400 mr-1"></i> ব্যর্থ হয়েছে: ${i} টি</p>`:``}
                </div>
            `,icon:`success`,confirmButtonText:`ঠিক আছে`,customClass:{popup:`!bg-slate-950 !text-white !rounded-3xl border border-slate-800 font-bn`,confirmButton:`m3-btn-primary !bg-emerald-600`}})}async function Ht(e,t,n){let r=!1;for(let i=0;i<e.length&&!r;i++){let a=e[i],o=a.accountNo?` (${a.accountNo})`:``,s=`Dear ${a.name}${o},\nআপনার বকেয়া পরিমাণ: ৳ ${v(a.totalDue)}\nতারিখ: ${n}\nঅনুগ্রহ করে দ্রুত পেমেন্ট পরিশোধের অনুরোধ করা হচ্ছে।\nধন্যবাদ! - ${t}`,c=String(a.phone).replace(/[^0-9]/g,``);c.startsWith(`0`)&&(c=`88`+c);let l=`https://api.whatsapp.com/send?phone=${c}&text=${encodeURIComponent(s)}`,u=i===e.length-1,d=await L.default.fire({title:`<div class="font-bn font-black text-lg text-emerald-400"><i class="fa-brands fa-whatsapp text-xl mr-2"></i>হোয়াটসঅ্যাপ তাগাদা (${i+1}/${e.length})</div>`,html:`
                <div class="space-y-3 font-bn text-left p-3 bg-slate-900 rounded-2xl border border-slate-800">
                    <div class="text-sm font-bold text-white">${a.name} <span class="text-amber-400 font-mono text-xs">${o}</span></div>
                    <div class="text-xs text-slate-300 font-mono">মোবাইল: ${a.phone}</div>
                    <div class="text-base text-red-400 font-black font-mono">বকেয়া: ৳ ${v(a.totalDue)}</div>
                </div>
            `,showCloseButton:!0,showDenyButton:!u,showCancelButton:!0,confirmButtonText:`<i class="fa-brands fa-whatsapp mr-1"></i> চ্যাট ওপেন করুন`,denyButtonText:`<i class="fa-solid fa-forward-step mr-1"></i> স্কিপ (পরবর্তী)`,cancelButtonText:`<i class="fa-solid fa-xmark mr-1"></i> ব্যাচ বন্ধ করুন (Cancel)`,customClass:{popup:`!bg-slate-950 !text-white !rounded-3xl border border-emerald-500/30 font-bn`,confirmButton:`m3-btn-primary !bg-emerald-600 hover:!bg-emerald-500 !px-5 !py-2 rounded-xl text-xs font-bold`,denyButton:`m3-btn-tonal !bg-slate-800 hover:!bg-slate-700 !text-slate-300 !px-4 !py-2 rounded-xl text-xs font-bold`,cancelButton:`m3-btn-tonal !bg-red-950 hover:!bg-red-900 !text-red-300 border border-red-500/30 !px-4 !py-2 rounded-xl text-xs font-bold`}});if(d.isConfirmed)window.open(l,`_blank`);else if(d.isDismissed||d.dismiss===L.default.DismissReason.cancel||d.dismiss===L.default.DismissReason.close){r=!0,b(`হোয়াটসঅ্যাপ ব্যাচ বন্ধ করা হয়েছে`,`info`);break}}r||b(`হোয়াটসঅ্যাপ ব্যাচ প্রসেস সম্পন্ন হয়েছে`,`success`)}window.triggerBulkReminderFlow=Bt;async function Ut(){W(),Et(),ft(),Dt()}function Wt(e){dt(e===`next`?ot+1:ot-1),Dt(e)}function Gt(e){window.navigate(`ledger`,{customerId:e})}function Kt(e,t,n,r,i){window.navigate(`statement`,{customerId:e,customerName:t,accountNo:n||``,customerPhone:r||``,customerAddress:i||``})}window.renderCustomers=vt,window.loadCustomers=Ut,window.initCustomerCache=W,window.getCustomerCache=U,window.saveNewCustomer=xt,window.editCustomer=St,window.deleteCustomer=wt,window.filterCustomerList=Ot,window.handleZoneChange=jt,window.sendReminderSMS=At,window.printFilteredCustomerList=Tt,window.changeCustomerPage=Wt,window.openCustomerLedger=Gt,window.openCustomerStatement=Kt,window.resetAddCustomerForm=bt,window.loadAllZones=Et,window.triggerBulkReminderFlow=Bt,window.toggleAddCustomerForm=()=>{let e=document.getElementById(`add-customer-form`);e&&(e.classList.toggle(`hidden`),e.classList.contains(`hidden`)||(bt(),window.handleZoneChange&&window.handleZoneChange(),rt(`cust-address`,`cust-address-datalist`,`cust-address-chips`),setTimeout(()=>{e.scrollIntoView({behavior:`smooth`,block:`start`});let t=document.getElementById(`cust-name`);t&&t.focus()},80)))},window.quickAddZone=async function(){let{value:e}=await L.default.fire({title:`নতুন জোন (অঞ্চল) যোগ করুন`,html:`
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
        `,focusConfirm:!1,showCancelButton:!0,confirmButtonText:`সেভ করুন`,cancelButtonText:`বাতিল`,customClass:{popup:`!bg-slate-900 !text-white !rounded-3xl border border-slate-700`},preConfirm:()=>{let e=document.getElementById(`sw-zn`).value.trim(),t=document.getElementById(`sw-zc`).value.trim();return!e||!t?(L.default.showValidationMessage(`নাম ও কোড উভয়ই আবশ্যক!`),!1):{name:e,code:t}}});if(e)try{L.default.fire({title:`চেক করা হচ্ছে...`,allowOutsideClick:!1,didOpen:()=>L.default.showLoading()});let t=await p.getByCode(e.code);if(t)return L.default.fire(`Error!`,`জোন কোড "${e.code}" ইতিমধ্যে "${t.name}" জোনের জন্য ব্যবহার করা হয়েছে!`,`error`);await p.add({name:e.name,code:e.code}),L.default.fire(`সফল!`,`জোন "${e.name}" সফলভাবে তৈরি হয়েছে।`,`success`),Et()}catch(e){console.error(e),L.default.fire(`Error`,`জোন সেভ করা যায়নি: `+(e.message||e),`error`)}};function qt(e=``,{inputId:t,selectId:n,dropdownId:r,onSelect:i}={}){let a=document.getElementById(r);if(!a)return;let o=U()||[],s=(e||``).trim(),c=o;if(s&&(c=o.filter(e=>typeof window.matchCustomerSearch==`function`?window.matchCustomerSearch(e,s):(e.name||``).toLowerCase().includes(s.toLowerCase())||(e.phone||``).toLowerCase().includes(s.toLowerCase())||(e.accountNo||``).toLowerCase().includes(s.toLowerCase())||(e.address||``).toLowerCase().includes(s.toLowerCase()))),c.length===0){a.innerHTML=`<div class="p-3 text-center text-xs text-slate-500 font-bold">কোনো কাস্টমার পাওয়া যায়নি</div>`,a.classList.remove(`hidden`);return}a.innerHTML=c.slice(0,40).map(e=>{let t=Number(e.totalDue)||0,n=t>0?`<span class="text-[10px] bg-red-500/20 text-red-400 border border-red-500/30 px-2 py-0.5 rounded-md font-black">৳${v(t)}</span>`:`<span class="text-[10px] bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-2 py-0.5 rounded-md font-bold">০.০০</span>`,r=e.accountNo?`<span class="text-blue-400 text-[10px] font-mono font-bold">#${e.accountNo}</span>`:``;return`
            <div class="combobox-item p-2 rounded-xl hover:bg-slate-800/80 cursor-pointer transition-all border border-transparent hover:border-slate-700 flex items-center justify-between gap-2" data-id="${e.id}">
                <div class="flex flex-col">
                    <div class="text-xs font-black text-white flex items-center gap-1.5">${e.name} ${r}</div>
                    <div class="text-[10px] text-slate-400 font-bold mt-0.5"><i class="fa-solid fa-phone text-[8px] mr-1 text-slate-500"></i>${e.phone||`-`} ${e.address?`• `+e.address:``}</div>
                </div>
                <div>${n}</div>
            </div>
        `}).join(``),a.classList.remove(`hidden`),a.querySelectorAll(`.combobox-item`).forEach(e=>{e.addEventListener(`click`,()=>{let a=e.dataset.id;Jt(a,{inputId:t,selectId:n,dropdownId:r,onSelect:i})})})}function Jt(e,{inputId:t,selectId:n,dropdownId:r,onSelect:i}={}){let a=document.getElementById(n),o=document.getElementById(t),s=document.getElementById(`${t}-clear`),c=document.getElementById(r);if(a&&(a.value=e,a.dispatchEvent(new Event(`change`,{bubbles:!0}))),a&&a.selectedIndex>=0){let e=a.options[a.selectedIndex];o&&e&&(o.value=`${e.dataset?.name||e.text}`),s&&s.classList.remove(`hidden`)}c&&c.classList.add(`hidden`),typeof i==`function`&&i(e)}function Yt(e,t,n={}){let{loadCustomersForDropdown:r,loadRecentTransactions:i,filterLedgerByCustomer:a}=n;e.innerHTML=`<div class="flex flex-col gap-5 font-bn">
        <div id="ledger-form-card" class="m3-card bg-slate-900/60 border border-slate-800/80 p-4 md:p-5 rounded-2xl shadow-xl flex flex-col gap-4">
            <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                <div class="flex items-center gap-3">
                    <div class="w-2 h-7 bg-purple-500 rounded-full shadow-[0_0_15px_rgba(168,85,247,0.5)]"></div>
                    <h2 class="text-xl md:text-2xl font-black text-white tracking-tight flex items-center gap-2">খতিয়ান <span class="text-xs text-slate-400 uppercase font-bold">(Ledger)</span><button class="w-7 h-7 rounded-lg hover:bg-slate-800 flex items-center justify-center text-slate-500 hover:text-blue-400 transition-all" onclick="window.loadRecentTransactions()"><i class="fa-solid fa-rotate text-xs"></i></button></h2>
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
                <div class="relative">
                    <label class="m3-label text-slate-400 mb-1.5 block text-xs font-bold truncate">তারিখ <span class="m3-label-sub text-[10px] opacity-70">(Date)</span></label>
                    <input type="text" id="ledger-date" class="m3-field py-1 bg-slate-950/80 h-10 text-xs datepicker">
                </div>
                <div class="relative">
                    <label class="m3-label text-slate-400 mb-1.5 block text-xs font-bold truncate">ভাউচার <span class="m3-label-sub text-[10px] opacity-70">(Voucher)</span></label>
                    <input type="text" id="ledger-voucher" class="m3-field py-1 bg-slate-950/80 h-10 text-xs">
                </div>
                <div class="flex flex-col relative">
                    <label class="m3-label text-red-400 mb-1.5 block text-xs font-bold truncate">খরচ <span class="m3-label-sub text-[10px] opacity-70">(Debit)</span></label>
                    <input type="text" id="ledger-bill" oninput="window.handleNumberInput(this); window.updateLedgerLiveText(); window.updateLiveWords(this, 'ledger-bill-words');" class="m3-field py-1 text-base font-black text-red-400 bg-slate-950/80 h-10">
                    <div id="ledger-bill-words" class="text-[10px] font-black text-red-400 mt-1 hidden italic truncate"></div>
                </div>
                <div class="flex flex-col relative">
                    <label class="m3-label text-emerald-400 mb-1.5 block text-xs font-bold truncate">জমা <span class="m3-label-sub text-[10px] opacity-70">(Credit)</span></label>
                    <input type="text" id="ledger-paid" oninput="window.handleNumberInput(this); window.updateLedgerLiveText(); window.toggleReceivedSection(); window.updateLiveWords(this, 'ledger-paid-words');" class="m3-field py-1 text-base font-black text-emerald-400 bg-slate-950/80 h-10">
                    <div id="ledger-paid-words" class="text-[10px] font-black text-emerald-400 mt-1 hidden italic truncate"></div>
                </div>
            </div>
            <div id="received-section" class="hidden grid grid-cols-1 md:grid-cols-2 gap-3 pt-3 border-t border-slate-800/60">
                <div><label class="m3-label text-emerald-400">পেমেন্ট মাধ্যম</label><div class="flex bg-slate-950 rounded-xl border border-slate-700 h-9 p-1 gap-1"><button type="button" id="recv-bank-btn" onclick="window.setReceivedType('Bank')" class="flex-1 text-[10px] font-bold bg-blue-600 text-white rounded-lg">Bank</button><button type="button" id="recv-cash-btn" onclick="window.setReceivedType('Cash')" class="flex-1 text-[10px] font-bold text-slate-400 rounded-lg">Cash</button><button type="button" id="recv-less-btn" onclick="window.setReceivedType('Less')" class="flex-1 text-[10px] font-bold text-slate-400 rounded-lg">Less</button></div></div>
                <div>
                    <label id="lbl-recv-from" class="m3-label text-emerald-400">ব্যাংক অ্যাকাউন্ট (Bank Name)</label>
                    <input type="text" id="ledger-received-from" list="dl-bank-names" placeholder="যেমন: DBBL, bKash..." class="m3-field py-1 text-xs bg-slate-950/80 h-9">
                    <datalist id="dl-bank-names">
                        <option value="OneBank (IFRAT)"></option>
                        <option value="IBBL (IFRAT)"></option>
                        <option value="bKash"></option>
                        <option value="Nagad"></option>
                        <option value="Rocket"></option>
                        <option value="Upay"></option>
                        <option value="Islami Bank"></option>
                        <option value="Dutch-Bangla Bank (DBBL)"></option>
                        <option value="BRAC Bank"></option>
                        <option value="City Bank"></option>
                        <option value="Sonali Bank"></option>
                        <option value="Agrani Bank"></option>
                        <option value="Pubali Bank"></option>
                    </datalist>
                    <datalist id="dl-cash-receivers">
                        <option value="শোরুম ক্যাশ"></option>
                        <option value="নিজস্ব"></option>
                    </datalist>
                </div>
            </div>
            <div class="flex justify-end pt-2"><button class="m3-btn-primary rounded-xl h-10 px-8 text-xs font-bold shadow-md shadow-blue-600/20" id="save-txn-btn" onclick="window.saveTransaction()">এন্ট্রি সেভ করুন</button></div>
        </div>
        <div class="desktop-only m3-table-container clusterize-scroll" id="ledger-scroll-area" style="max-height: 60vh;">
            <table id="ledger-table" class="m3-table min-w-[900px]">
                <thead><tr class="font-bn"><th>তারিখ</th><th>বিবরণ / ভাউচার</th><th class="text-right">খরচ (Debit)</th><th class="text-right">জমা (Credit)</th><th class="text-right text-blue-400">অবশিষ্ট (Balance)</th><th class="text-center sticky-action-col">অ্যাকশন</th></tr></thead>
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
    </div>`,document.getElementById(`ledger-date`).value=_(),r&&r(),t&&t.customerId&&a?setTimeout(()=>{document.getElementById(`ledger-customer-select`).value=t.customerId,a(t.customerId)},200):i&&i()}function Xt(){let e=y(document.getElementById(`ledger-bill`)?.value||`0`),t=y(document.getElementById(`ledger-paid`)?.value||`0`),n=document.getElementById(`ledger-customer-select`),r=document.getElementById(`live-due-calc`);if(r)if(n&&n.selectedIndex>0){let i=(parseFloat(n.options[n.selectedIndex].dataset.due)||0)+e-t;r.innerText=`বকেয়া: ৳ ${v(Math.abs(i))} ${i<0?`(অ্যাড)`:``}`,r.className=i>0?`bg-red-500/10 text-red-400 border border-red-500/20 px-4 py-1.5 rounded-xl text-xs font-black`:`bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-4 py-1.5 rounded-xl text-xs font-black`}else r.innerText=`৳ ০`,r.className=`bg-slate-800/80 px-4 py-1.5 rounded-xl border border-slate-700 text-xs font-black text-blue-400 shadow-inner font-bn`}function Zt(e,t,n={}){if(!t)return;let r=document.getElementById(`ledger-list-mobile`),i=document.getElementById(`ledger-tfoot`),a=document.getElementById(`ledger-customer-select`),o=a&&a.selectedIndex>0,s=[],c=``,l=0,u=0,d=[];n.currentLedgerTxns&&(n.currentLedgerTxns.length=0),e&&n.currentLedgerTxns?.push(...e),n.currentLedgerTxnsMap&&Object.keys(n.currentLedgerTxnsMap).forEach(e=>delete n.currentLedgerTxnsMap[e]);let f=U()||[];if(o){let t=a.value,n=f.find(e=>e.id===t),r=Number(n?.totalDue||0);e.forEach((e,t)=>{d[t]=r,r-=(Number(e.bill)||0)-(Number(e.paid)||0)})}if((e||[]).forEach((e,t)=>{let r=String(F?.currentUserRole||``).toLowerCase()===`admin`,i=r||F?.permissions?.editLedger!==!1&&F?.permissions?.manageLedger!==!1,a=r||F?.permissions?.deleteLedger===!0,p=o?d[t]:Number(e.currentDue)||0,m=Number(e.bill)||0,h=Number(e.paid)||0;l+=m,u+=h;let g=String(e.id||``),_=String(e.customerId||``),y=f.find(e=>e.id===_);g&&n.currentLedgerTxnsMap&&(n.currentLedgerTxnsMap[g]={...e,phone:y?.phone||e.phone||``,customerName:e.customerName||y?.name||`Customer`,calculatedDue:p});let b=e.receivedType||``,x=h>0?`<span class="text-emerald-400 text-[10px] font-bold uppercase ml-2"><i class="fa-solid fa-money-bill-wave mr-1"></i>${b||`Cash`}</span>`:``;s.push(`<tr class="hover:bg-white/[0.03] transition-colors border-b border-slate-800/50">
            <td class="text-[10px] text-slate-300 font-bold whitespace-nowrap">${E(e.date)}</td>
            <td class="font-bold text-slate-200 text-xs"><div>${e.customerName||y?.name||`Unknown`}${x}</div><div class="flex items-center gap-1.5 mt-1">${e.voucherNo?`<span class="text-[9px] text-blue-400 font-black">#${e.voucherNo}</span>`:``}${e.notes?`<span class="text-[9px] text-slate-500 font-medium italic truncate max-w-[180px]" title="${e.notes}">• ${e.notes}</span>`:``}</div></td>
            <td class="text-right text-red-400 font-black text-sm">৳${v(m)}</td>
            <td class="text-right text-emerald-400 font-black text-sm">৳${v(h)}</td>
            <td class="text-right text-white font-black text-base bg-white/[0.02] border-l border-slate-800/50">৳${v(Math.abs(p))}<div class="text-[9px] uppercase font-bold ${p>0?`text-red-400`:`text-emerald-400`}">${p>0?`Due`:`Adv`}</div></td>
            <td class="text-center sticky-action-col"><div class="flex items-center justify-center gap-1.5">
                <button class="m3-btn-icon" onclick="window.sendTxnWhatsApp('${g}')" title="WhatsApp বার্তা পাঠান"><i class="fa-brands fa-whatsapp text-emerald-400"></i></button>
                <button class="m3-btn-icon" onclick="window.sendTxnSMS('${g}')" title="ট্রানজেকশন SMS পাঠান"><i class="fa-solid fa-comment-sms text-blue-400"></i></button>
                ${i?`<button class="m3-btn-icon" onclick="window.editTransaction('${g}', '${_}', '${e.date}', '${e.voucherNo||``}', ${m}, ${h}, '${e.receivedType||``}', '${e.receivedFrom||``}')" title="এডিট"><i class="fa-solid fa-pen-to-square text-amber-400"></i></button>`:``}
                ${a?`<button class="m3-btn-icon" onclick="window.deleteTransaction('${g}', '${_}', ${m}, ${h})" title="ডিলেট"><i class="fa-solid fa-trash-can text-red-400"></i></button>`:``}
                <button class="m3-btn-icon" onclick="window.choosePrintType('${g}')" title="প্রিন্ট"><i class="fa-solid fa-print text-emerald-400"></i></button>
            </div></td>
        </tr>`),c+=`<div class="mobile-card">
            <div class="mobile-card-header">
                <div><div class="mobile-card-title">${e.customerName||y?.name||`Unknown`}</div><div class="mobile-card-sub text-blue-400 font-bold mt-0.5">${e.voucherNo?`#`+e.voucherNo:E(e.date)} ${x}</div></div>
                <div class="text-right"><div class="text-white font-black text-base">৳ ${v(Math.abs(p))}</div><span class="inline-block text-[9px] uppercase font-bold ${p>0?`text-red-400`:`text-emerald-400`}">${p>0?`Due`:`Adv`}</span></div>
            </div>
            <div class="mobile-card-row"><span class="mobile-card-label">খরচ (Debit):</span><span class="mobile-card-value text-red-400 font-bold">৳ ${v(m)}</span></div>
            <div class="mobile-card-row"><span class="mobile-card-label">জমা (Credit):</span><span class="mobile-card-value text-emerald-400 font-bold">৳ ${v(h)}</span></div>
            <div class="mobile-card-actions">
                <button class="m3-btn-icon" onclick="window.sendTxnWhatsApp('${g}')" title="WhatsApp বার্তা পাঠান"><i class="fa-brands fa-whatsapp text-emerald-400"></i></button>
                <button class="m3-btn-icon" onclick="window.sendTxnSMS('${g}')" title="ট্রানজেকশন SMS পাঠান"><i class="fa-solid fa-comment-sms text-blue-400"></i></button>
                ${i?`<button class="m3-btn-icon" onclick="window.editTransaction('${g}', '${_}', '${e.date}', '${e.voucherNo||``}', ${m}, ${h}, '${e.receivedType||``}', '${e.receivedFrom||``}')" title="এডিট"><i class="fa-solid fa-pen-to-square text-amber-400"></i></button>`:``}
                ${a?`<button class="m3-btn-icon" onclick="window.deleteTransaction('${g}', '${_}', ${m}, ${h})" title="ডিলেট"><i class="fa-solid fa-trash-can text-red-400"></i></button>`:``}
                <button class="m3-btn-icon" onclick="window.choosePrintType('${g}')" title="প্রিন্ট"><i class="fa-solid fa-print text-emerald-400"></i></button>
            </div>
        </div>`}),t.id===`recent-txn-list`){t.innerHTML=s.length>0?s.join(``):`<tr><td colspan="5" class="text-center py-8 text-slate-600 italic">কোনো লেনদেন পাওয়া যায়নি</td></tr>`;let e=document.getElementById(`recent-txn-list-mobile`);e&&(e.innerHTML=c||`<div class="text-center py-8 text-slate-500 font-bold italic">কোনো লেনদেন পাওয়া যায়নি</div>`);return}window.ledgerClusterize&&window.ledgerClusterize.destroy(),s.length>0?window.ledgerClusterize=new _t.default({rows:s,scrollId:`ledger-scroll-area`,contentId:`ledger-list`}):t.innerHTML=`<tr><td colspan="6" class="text-center py-12 text-slate-600 italic">কোনো লেনদেন পাওয়া যায়নি</td></tr>`,r&&(r.innerHTML=c||`<div class="text-center py-10 text-slate-500 font-bold italic">কোনো লেনদেন পাওয়া যায়নি</div>`),i&&(i.innerHTML=`<tr class="bg-slate-900/90 font-black border-t-2 border-blue-500/40"><td colspan="2" class="text-right text-slate-300 py-3">পৃষ্ঠা মোট (Page Total):</td><td class="text-right text-red-400">৳ ${v(l)}</td><td class="text-right text-emerald-400">৳ ${v(u)}</td><td class="text-right text-white">৳ ${v(Math.abs(l-u))}</td><td></td></tr>`);let p=document.getElementById(`ledger-mobile-sticky-bar`);if(p)if(o&&(e||[]).length>0){let e=d[0],t=e>0,n=v(Math.abs(e));p.innerHTML=`
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
                    <button class="h-8 px-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs active:scale-95 transition-all flex items-center gap-1 cursor-pointer" onclick="window.openCustomerStatement('${a.value}')">
                        <i class="fa-solid fa-file-invoice"></i><span>মেমো</span>
                    </button>
                </div>`,p.classList.remove(`hidden`)}else p.classList.add(`hidden`)}async function Qt(e={},t={}){let r=document.getElementById(`save-txn-btn`),i=document.getElementById(`ledger-customer-select`);if(!i||!i.value)return L.default.fire(`Error`,`কাস্টমার সিলেক্ট করুন`,`error`);let o=i.value,s=i.options[i.selectedIndex].text.replace(/\s*\([^)]*\)\s*$/,``).trim(),l=x(document.getElementById(`ledger-date`).value),d=document.getElementById(`ledger-voucher`).value.trim(),f=y(document.getElementById(`ledger-bill`).value),p=y(document.getElementById(`ledger-paid`).value);if(f===0&&p===0)return L.default.fire(`Error`,`বিল বা জমা দিন`,`error`);r&&(r.disabled=!0,r.innerText=`প্রসেসিং...`);let m=``,g=``;if(p>0){let e=document.getElementById(`recv-cash-btn`);m=document.getElementById(`recv-less-btn`)?.classList.contains(`bg-blue-600`)?`Less`:e?.classList.contains(`bg-blue-600`)?`Cash`:`Bank`,g=document.getElementById(`ledger-received-from`)?.value?.trim()||``}if(!(await L.default.fire({title:`<div class="flex items-center justify-center gap-2 font-bn font-black text-xl text-white"><i class="fa-solid fa-file-shield text-blue-400"></i><span>লেনদেন যাচাই করুন</span></div>`,html:`
            <div class="text-left space-y-3 font-bn p-3.5 bg-slate-900/90 rounded-2xl border border-slate-800 shadow-inner">
                <div class="flex flex-col gap-1 border-b border-slate-800/80 pb-2">
                    <span class="text-[10px] text-blue-400 font-black uppercase tracking-wider">কাস্টমারের নাম</span>
                    <span class="text-base text-white font-black">${s}</span>
                </div>
                <div class="grid grid-cols-2 gap-4 border-b border-slate-800/80 pb-2">
                    <div class="flex flex-col gap-1"><span class="text-[10px] text-blue-400 font-black uppercase tracking-wider">তারিখ</span><span class="text-sm text-slate-200 font-bold font-mono">${E(l)}</span></div>
                    <div class="flex flex-col gap-1"><span class="text-[10px] text-amber-400 font-black uppercase tracking-wider">ভাউচার / মেমো নং</span><span class="text-sm text-amber-400 font-bold font-mono">${d||`-`}</span></div>
                </div>
                <div class="grid grid-cols-2 gap-4 border-b border-slate-800/80 pb-2">
                    <div class="flex flex-col gap-1"><span class="text-[10px] text-blue-400 font-black uppercase tracking-wider">বিল / কেনাকাটা</span><span class="text-lg text-blue-400 font-black font-mono">৳ ${v(f)}</span></div>
                    <div class="flex flex-col gap-1"><span class="text-[10px] text-emerald-400 font-black uppercase tracking-wider">জমা প্রাপ্তি</span><span class="text-lg text-emerald-400 font-black font-mono">৳ ${v(p)}</span></div>
                </div>
                ${p>0?`<div class="flex flex-col gap-1 border-b border-slate-800/80 pb-2"><span class="text-[10px] text-purple-400 font-black uppercase tracking-wider">পেমেন্ট মাধ্যম</span><span class="text-xs text-purple-300 font-bold">${m} ${g?`(`+g+`)`:``}</span></div>`:``}
            </div>
            <p class="text-xs text-amber-400 font-bold mt-3 text-center">সব তথ্য সঠিক থাকলে "কনফার্ম করুন" বাটনে ক্লিক করুন।</p>
        `,showCancelButton:!0,confirmButtonText:`<i class="fa-solid fa-circle-check mr-2"></i>কনফার্ম করুন`,cancelButtonText:`<i class="fa-solid fa-pen-to-square mr-2"></i>সংশোধন করব`,customClass:{popup:`!bg-slate-950 !text-white !rounded-3xl border border-slate-800 shadow-2xl font-bn`,confirmButton:`m3-btn-primary !bg-blue-600 hover:!bg-blue-500 !px-7 !py-2.5 !rounded-xl font-bold shadow-lg shadow-blue-600/30`,cancelButton:`m3-btn-tonal !bg-slate-800 hover:!bg-slate-700 !text-slate-300 !px-5 !py-2.5 !rounded-xl font-bold border border-slate-700`}})).isConfirmed){r&&(r.disabled=!1,r.innerText=`এন্ট্রি সেভ করুন`);return}try{let r=h.batch(),i=w(f-p);if(e.id){let t=w((e.oldBill||0)-(e.oldPaid||0)),s=w(i-t);r.update(a.getRef(e.id),{date:l,voucherNo:d,bill:f,paid:p,receivedType:m,receivedFrom:g}),r.update(u.getRef(o),{totalDue:n.firestore.FieldValue.increment(s)}),e.id=null}else{let e=a.getRef(),t=U().find(e=>e.id===o),c=t&&Number(t.totalDue)||0;r.set(e,{customerId:o,customerName:s,date:l,voucherNo:d,bill:w(f),paid:w(p),receivedType:m,receivedFrom:g,prevDue:w(c),currentDue:w(c+i),createdBy:F?.currentUserEmail||`Unknown`,createdAt:n.firestore.FieldValue.serverTimestamp()}),r.update(u.getRef(o),{totalDue:n.firestore.FieldValue.increment(i)})}await r.commit(),b(`লেনদেন সফলভাবে সেভ হয়েছে!`,`success`);try{let e=U().find(e=>e.id===o),t=e?.phone;if(t&&t.trim()!==``&&t!==`-`){let n=await c.getAppSettings(),r=E(l),a=(typeof window.toBanglishName==`function`?window.toBanglishName(s):s)||`Customer`,o=n.shopName?typeof window.toBanglishName==`function`?window.toBanglishName(n.shopName):n.shopName:`M/S. Maa Motors`,u=(e&&Number(e.totalDue)||0)+i,h=v(Math.abs(u)),g=``;g=f>0?(n.smsTemplateNew||`Dear [Name], Memo #[Memo] of Tk [Bill] created on [Date]. Paid: Tk [Paid], Due: Tk [Due]. Thanks! - [Shop]`).replace(/\[Name\]/g,a).replace(/\[Shop\]/g,o).replace(/\[Date\]/g,r).replace(/\[Memo\]/g,d||`1`).replace(/\[Bill\]/g,v(f)).replace(/\[Paid\]/g,v(p)).replace(/\[Due\]/g,h):(n.smsTemplatePaid||`Dear [Name], Received Tk [Paid] ([Type]) on [Date]. Net Due: Tk [Due]. Thanks! - [Shop]`).replace(/\[Name\]/g,a).replace(/\[Shop\]/g,o).replace(/\[Date\]/g,r).replace(/\[Paid\]/g,v(p)).replace(/\[Type\]/g,m||`Cash`).replace(/\[Due\]/g,h),g=g.replace(/\s+/g,` `).replace(/[^\x00-\x7F]/g,``);let{value:_,isConfirmed:y}=await L.default.fire({title:`<div class="flex flex-col items-center gap-2"><i class="fa-solid fa-comment-sms text-emerald-400 text-3xl mb-1"></i><span class="font-bn font-black text-xl text-white">Transaction SMS Preview</span></div>`,html:`<div class="text-left space-y-2 mb-2 font-bn">
                            <p class="text-[13px] text-slate-300">কাস্টমারকে কি লেনদেনের মেসেজ পাঠাতে চান? চাইলে নিচের লেখা এডিট করতে পারেন:</p>
                            <div class="flex justify-between items-center"><div class="text-xs text-slate-400">Recipient Phone: <strong class="text-white">${t}</strong></div><div id="sms-txn-char-counter" class="text-[11px] font-bold text-emerald-400 text-right">0 / 160 Characters (1 SMS)</div></div>
                           </div>`,input:`textarea`,inputValue:g,inputAttributes:{rows:4,class:`m3-field text-xs font-mono !mt-0`},showCancelButton:!0,confirmButtonText:`<i class="fa-solid fa-paper-plane mr-1.5"></i> পাঠিয়ে দিন`,cancelButtonText:`স্কিপ করুন`,customClass:{popup:`!bg-slate-950 !text-white !rounded-3xl border border-slate-700 shadow-2xl`,confirmButton:`m3-btn-primary !bg-emerald-600 hover:!bg-emerald-500 !px-7 !py-2.5 !rounded-xl font-bold shadow-lg shadow-emerald-600/30`,cancelButton:`m3-btn-tonal !bg-slate-800 hover:!bg-slate-700 !text-slate-300 !px-5 !py-2.5 !rounded-xl font-bold border border-slate-700`},didOpen:()=>{let e=L.default.getInput(),t=document.getElementById(`sms-txn-char-counter`),n=()=>{if(e&&t){let n=e.value.length,r=Math.ceil(n/160)||1;t.innerText=`${n} / 160 Characters (${r} SMS)`}};e&&(e.oninput=n,n(),setTimeout(()=>e.focus(),150))}});y&&_&&await be(t,_,!1)&&b(`এসএমএস সফলভাবে পাঠানো হয়েছে`,`success`)}}catch(e){console.warn(`Transaction SMS dispatch error:`,e)}document.getElementById(`ledger-bill`).value=``,document.getElementById(`ledger-paid`).value=``;let _=document.getElementById(`ledger-voucher`);_&&(_.value=``);let y=document.getElementById(`ledger-received-from`);y&&(y.value=``),t.filterLedgerByCustomer&&t.filterLedgerByCustomer(o)}catch(e){z(e,`লেনদেন সেভ করতে ব্যর্থ`)}finally{r&&(r.disabled=!1,r.innerText=`এন্ট্রি সেভ করুন`,r.className=`m3-btn-primary rounded-xl h-10 px-8 text-xs font-bold shadow-md shadow-blue-600/20`)}}async function $t(e,t,n,r,i,a,o,s,c={}){if(!await R(`খতিয়ান এডিট (Authorization)`))return;c.id=e,c.oldBill=i,c.oldPaid=a,document.getElementById(`ledger-customer-select`)&&(document.getElementById(`ledger-customer-select`).value=t),document.getElementById(`ledger-date`)&&(document.getElementById(`ledger-date`).value=n),document.getElementById(`ledger-voucher`)&&(document.getElementById(`ledger-voucher`).value=r),document.getElementById(`ledger-bill`)&&(document.getElementById(`ledger-bill`).value=i),document.getElementById(`ledger-paid`)&&(document.getElementById(`ledger-paid`).value=a),window.setReceivedType&&window.setReceivedType(o),document.getElementById(`ledger-received-from`)&&(document.getElementById(`ledger-received-from`).value=s),window.updateLedgerLiveText&&window.updateLedgerLiveText(),window.toggleReceivedSection&&window.toggleReceivedSection();let l=document.getElementById(`save-txn-btn`);l&&(l.innerHTML=`<i class="fa-solid fa-pen-to-square mr-1.5"></i>আপডেট সংশোধন করুন`,l.className=`m3-btn-primary rounded-xl h-10 px-8 text-xs font-bold shadow-md !bg-amber-600 hover:!bg-amber-500`);let u=document.getElementById(`view-container`),d=document.getElementById(`ledger-form-card`)||document.getElementById(`ledger-customer-select`);u&&u.scrollTo({top:0,behavior:`smooth`}),d&&d.scrollIntoView({behavior:`smooth`,block:`start`}),setTimeout(()=>{let e=document.getElementById(`ledger-bill`);e&&(e.focus(),e.select&&e.select())},350)}async function en(e,t,r,i,o={}){if(await R(`Delete`)){let s=h.batch();s.update(u.getRef(t),{totalDue:n.firestore.FieldValue.increment(w(i-r))}),s.delete(a.getRef(e)),await s.commit(),b(`লেনদেন ডিলেট করা হয়েছে!`,`info`),o.filterLedgerByCustomer&&o.filterLedgerByCustomer(t)}}var tn={id:null,oldBill:0,oldPaid:0},nn=[],rn={},an=null,K=[],q=1,on=20,sn={currentLedgerTxns:nn,currentLedgerTxnsMap:rn};async function cn(e=null,t=null,n=`reset`){let r=document.getElementById(`ledger-list`),i=document.getElementById(`ledger-list-mobile`),o=document.getElementById(`recent-txn-list`),s=document.getElementById(`ledger-pagination`);if(n===`reset`&&(an=null,K=[],q=1),t===null&&!e){let e=document.getElementById(`ledger-customer-select`);e&&e.value&&(t=e.value)}r&&(r.innerHTML=`<tr><td colspan="6" class="text-center py-12"><i class="fa-solid fa-spinner fa-spin mr-3 text-blue-500 text-xl"></i> লোডিং...</td></tr>`),i&&(i.innerHTML=`<div class="text-center py-10 text-slate-500 font-bold italic">লোডিং...</div>`);try{let i;if(e){let t=await a.getByVoucher(e);i={data:t,lastDoc:null,count:t.length},s&&s.classList.add(`hidden`)}else{let e=t?[{field:`customerId`,op:`==`,value:t}]:[];if(o&&!r)return a.listenRecent(5,e=>dn(e,o));let c=n===`next`?an:n===`prev`&&K.length>1?K[K.length-2]:null;if(t)try{i=await a.getByPage(on,c,`createdAt`,`desc`,e)}catch{i=await a.getByPage(on,c,`date`,`desc`,e)}else i=await a.getByPage(on,c,`createdAt`,`desc`,e);if(an=i.lastDoc,n===`next`?c&&K.push(c):n===`prev`&&K.pop(),s){s.classList.remove(`hidden`);let e=document.getElementById(`current-page-display`);e&&(e.innerText=q);let t=document.getElementById(`prev-page`),n=document.getElementById(`next-page`);t&&(t.disabled=q===1),n&&(n.disabled=i.count<on)}}dn(i.data,r)}catch(e){z(e,`লেনদেন লোড করতে সমস্যা হয়েছে`),r&&(r.innerHTML=`<tr><td colspan="6" class="text-center py-12 text-red-400">ডাটা লোড করতে সমস্যা হয়েছে</td></tr>`)}}function ln(e){an=null,K=[],q=1,un(),cn(null,e)}function un(){Xt()}function dn(e,t){Zt(e,t,sn)}function fn(e,t){Yt(e,t,{loadCustomersForDropdown:bn,loadRecentTransactions:cn,filterLedgerByCustomer:ln}),q=1,K=[],an=null}async function pn(){return Qt(tn,{filterLedgerByCustomer:ln})}async function mn(e,t,n,r,i,a,o,s){return It(e,t,n,r,i,a,o,s,sn)}async function hn(e,t,n,r,i,a,o,s){return Lt(e,t,n,r,i,a,o,s,sn)}async function gn(e,t,n,r,i,a,o,s){return $t(e,t,n,r,i,a,o,s,tn)}async function _n(e,t,n,r){return en(e,t,n,r,{filterLedgerByCustomer:ln})}async function vn(e,t){return Rt(e,t)}function yn(e){return zt(e)}async function bn(){let e=U();e.length||(W(),e=await u.getAll(`name`,`asc`));let t=document.getElementById(`ledger-customer-select`);t&&(t.innerHTML=`<option value="">-- সকল কাস্টমার --</option>`+e.map(e=>{let t=e.accountNo?`[${e.accountNo}] `:``;return`<option value="${e.id}" data-due="${e.totalDue||0}" data-phone="${e.phone||``}" data-name="${e.name}" data-acc="${e.accountNo||``}">${t}${e.name}</option>`}).join(``))}function xn(e=``){qt(e,{inputId:`ledger-cust-search-input`,selectId:`tx-customer`,dropdownId:`ledger-cust-dropdown`,onSelect:e=>Sn(e)})}function Sn(e){let t=document.getElementById(`ledger-customer-select`),n=document.getElementById(`ledger-cust-search-input`),r=document.getElementById(`ledger-cust-search-clear`),i=document.getElementById(`ledger-cust-dropdown`);if(t&&(t.value=e,ln(e)),t&&t.selectedIndex>0){let e=t.options[t.selectedIndex];n&&(n.value=`${e.dataset.name||e.text}`),r&&r.classList.remove(`hidden`)}i&&i.classList.add(`hidden`)}function Cn(){let e=document.getElementById(`ledger-customer-select`),t=document.getElementById(`ledger-cust-search-input`),n=document.getElementById(`ledger-cust-search-clear`),r=document.getElementById(`ledger-cust-dropdown`);e&&(e.value=``,ln(``)),t&&(t.value=``),n&&n.classList.add(`hidden`),r&&r.classList.add(`hidden`)}typeof window<`u`&&(window.loadRecentTransactions=cn,window.saveTransaction=pn,window.sendTxnSMS=mn,window.sendTxnWhatsApp=hn,window.updateLedgerLiveText=un,window.filterLedgerByCustomer=ln,window.editTransaction=gn,window.deleteTransaction=_n,window.executePrint=vn,window.choosePrintType=yn,window.filterLedgerCustomerSearch=xn,window.selectLedgerCustomer=Sn,window.clearLedgerCustomerSearch=Cn,window.changeLedgerPage=async e=>{let t=q;e===`next`?q++:q--;try{let t=document.getElementById(`ledger-customer-select`)?.value;await cn(null,t,e)}catch{q=t}},window.toggleReceivedSection=()=>{let e=y(document.getElementById(`ledger-paid`)?.value||`0`);document.getElementById(`received-section`)?.classList.toggle(`hidden`,e<=0)},window.setReceivedType=e=>{[`Bank`,`Cash`,`Less`].forEach(t=>{let n=document.getElementById(`recv-`+t.toLowerCase()+`-btn`);n&&(t===e?(n.classList.add(`bg-blue-600`,`text-white`),n.classList.remove(`text-slate-400`)):(n.classList.remove(`bg-blue-600`,`text-white`),n.classList.add(`text-slate-400`)))});let t=document.getElementById(`lbl-recv-from`),n=document.getElementById(`ledger-received-from`);t&&n&&(e===`Bank`?(t.innerText=`ব্যাংক অ্যাকাউন্ট (Bank Name)`,n.setAttribute(`list`,`dl-bank-names`),n.placeholder=`যেমন: DBBL, bKash...`):e===`Cash`?(t.innerText=`কার মাধ্যমে জমা (Received By)`,n.setAttribute(`list`,`dl-cash-receivers`),n.placeholder=`যেমন: রহিম, শোরুম ক্যাশ...`):(t.innerText=`ছাড়ের কারণ (Reason)`,n.removeAttribute(`list`),n.placeholder=`যেমন: সম্মানিতে ছাড়...`))},window.Swal=L.default),document.addEventListener(`click`,e=>{let t=document.getElementById(`ledger-cust-dropdown`),n=document.getElementById(`ledger-cust-search-input`);t&&!t.contains(e.target)&&e.target!==n&&t.classList.add(`hidden`)});function wn(){return`
        <div class="flex flex-col gap-6 font-bn">

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
                            <select id="dash-cust-zone-select" class="m3-field py-1 flex-grow bg-slate-950/80 h-9 text-xs font-bold text-slate-200 cursor-pointer" onchange="window.handleDashZoneChange()">
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
                        <i class="fa-solid fa-check text-xs"></i>
                        <span>সেভ করুন</span>
                    </button>
                </div>
            </div>

            <!-- 2. 4 Glassmorphic KPI Cards + Timeframe Switcher -->
            <div class="flex flex-col gap-3">
                <div class="flex items-center justify-between px-1">
                    <span class="text-xs font-black text-slate-400 uppercase tracking-widest">ব্যবসায়িক রিয়েল-টাইম মেট্রিক্স</span>
                    <div class="flex bg-slate-950/80 rounded-xl p-1 border border-slate-800 text-[11px] font-bold">
                        <button class="px-3 py-1.5 min-h-[34px] rounded-lg bg-blue-600 text-white active:scale-95 transition-all" id="tf-today-btn" onclick="window.switchDashTimeframe('today')">আজকে</button>
                        <button class="px-3 py-1.5 min-h-[34px] rounded-lg text-slate-400 hover:text-white active:scale-95 transition-all" id="tf-week-btn" onclick="window.switchDashTimeframe('week')">এই সপ্তাহ</button>
                        <button class="px-3 py-1.5 min-h-[34px] rounded-lg text-slate-400 hover:text-white active:scale-95 transition-all" id="tf-month-btn" onclick="window.switchDashTimeframe('month')">এই মাস</button>
                    </div>
                </div>

                <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <!-- Due Card -->
                    <div class="m3-card relative overflow-hidden group border-l-4 border-l-red-500 bg-slate-900/60">
                        <div class="w-9 h-9 rounded-xl bg-red-500/10 text-red-400 flex items-center justify-center mb-3 text-lg"><i class="fa-solid fa-receipt"></i></div>
                        <h4 class="text-slate-400 text-[11px] font-black uppercase tracking-wider mb-1">মার্কেটে মোট বকেয়া</h4>
                        <h2 id="dash-total-due" class="text-2xl md:text-3xl font-black text-white tracking-tight">৳ ০</h2>
                        <div class="mt-3 flex items-center justify-between text-[10px] text-slate-400 font-bold border-t border-slate-800/60 pt-2">
                            <span>সব কাস্টমারের বাকি</span><span class="text-red-400 font-black">রিয়েল-টাইম</span>
                        </div>
                    </div>

                    <!-- Collection Card -->
                    <div class="m3-card relative overflow-hidden group border-l-4 border-l-emerald-500 bg-slate-900/60">
                        <div class="w-9 h-9 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center mb-3 text-lg"><i class="fa-solid fa-hand-holding-dollar"></i></div>
                        <h4 class="text-slate-400 text-[11px] font-black uppercase tracking-wider mb-1">মোট কালেকশন</h4>
                        <h2 id="dash-today-col" class="text-2xl md:text-3xl font-black text-white tracking-tight">৳ ০</h2>
                        <div class="mt-3 flex items-center justify-between text-[10px] text-slate-400 font-bold border-t border-slate-800/60 pt-2">
                            <span id="dash-net-cash">নিট ক্যাশ: ৳ ০</span><span class="text-emerald-400 font-black">আদায় সিঙ্কড</span>
                        </div>
                    </div>

                    <!-- Expense Card -->
                    <div class="m3-card relative overflow-hidden group border-l-4 border-l-purple-500 bg-slate-900/60">
                        <div class="w-9 h-9 rounded-xl bg-purple-500/10 text-purple-400 flex items-center justify-center mb-3 text-lg"><i class="fa-solid fa-wallet"></i></div>
                        <h4 class="text-slate-400 text-[11px] font-black uppercase tracking-wider mb-1">মোট খরচ</h4>
                        <h2 id="dash-today-exp" class="text-2xl md:text-3xl font-black text-white tracking-tight">৳ ০</h2>
                        <div class="mt-3 flex items-center justify-between text-[10px] text-slate-400 font-bold border-t border-slate-800/60 pt-2">
                            <span>দৈনিক খরচ যোগফল</span><span class="text-purple-400 font-black">হিসাবকৃত</span>
                        </div>
                    </div>

                    <!-- Customers Card -->
                    <div class="m3-card relative overflow-hidden group border-l-4 border-l-blue-500 bg-slate-900/60">
                        <div class="w-9 h-9 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center mb-3 text-lg"><i class="fa-solid fa-users"></i></div>
                        <h4 class="text-slate-400 text-[11px] font-black uppercase tracking-wider mb-1">মোট কাস্টমার</h4>
                        <h2 id="dash-total-cust" class="text-2xl md:text-3xl font-black text-white tracking-tight">০ জন</h2>
                        <div class="mt-3 flex items-center justify-between text-[10px] text-slate-400 font-bold border-t border-slate-800/60 pt-2">
                            <span>সক্রিয় অ্যাকাউন্ট</span><span class="text-blue-400 font-black">ডাটাবেস সিঙ্কড</span>
                        </div>
                    </div>
                </div>
            </div>

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

                    <!-- Recent Activity Section -->
                    <div class="flex flex-col gap-3">
                        <div class="flex items-center justify-between px-1">
                            <h3 class="text-lg font-bold flex items-center gap-2 text-white">
                                <div class="w-2 h-5 bg-blue-600 rounded-full"></div> সাম্প্রতিক লেনদেন
                            </h3>
                            <button class="text-blue-400 text-xs font-bold hover:underline flex items-center gap-1" onclick="window.navigate('ledger')">
                                সব দেখুন <i class="fa-solid fa-arrow-right"></i>
                            </button>
                        </div>

                        <!-- Desktop Table View -->
                        <div class="desktop-only m3-table-container">
                            <table class="m3-table min-w-[700px]">
                                <thead>
                                    <tr>
                                        <th>তারিখ</th><th>কাস্টমার</th><th class="text-right">খরচ (Debit)</th><th class="text-right">জমা (Credit)</th><th class="text-center">অ্যাকশন</th>
                                    </tr>
                                </thead>
                                <tbody id="recent-txn-list">
                                    <tr><td colspan="5" class="text-center py-8 text-slate-500 italic">ডাটা লোড হচ্ছে...</td></tr>
                                </tbody>
                            </table>
                        </div>

                        <!-- Mobile Card View -->
                        <div id="recent-txn-list-mobile" class="mobile-only mobile-card-container">
                            <div class="text-center py-8 text-slate-500 italic">ডাটা লোড হচ্ছে...</div>
                        </div>
                    </div>
                </div>

                <!-- Right Column (1 Col): Donut Chart & Top 5 Due Customers Widget -->
                <div class="flex flex-col gap-6">

                    <!-- Cash vs Bank Donut Card -->
                    <div class="m3-card bg-slate-900/60 border border-slate-800/80 p-4 rounded-2xl shadow-xl flex flex-col gap-3">
                        <h3 class="text-sm font-black text-white uppercase tracking-widest border-b border-slate-800/60 pb-2 flex items-center gap-2">
                            <i class="fa-solid fa-pie-chart text-emerald-400"></i> পেমেন্ট মেথড ব্রেকডাউন
                        </h3>
                        <div class="flex items-center justify-around py-2">
                            <canvas id="payment-donut-chart" class="w-[120px] h-[120px]"></canvas>
                            <div class="flex flex-col gap-2 font-bn">
                                <div class="flex items-center gap-2">
                                    <span class="w-3 h-3 rounded-md bg-emerald-500"></span>
                                    <div><p class="text-[10px] text-slate-400 font-bold">নগদ (Cash)</p><p id="dash-col-cash" class="text-sm font-black text-white">৳ ০</p></div>
                                </div>
                                <div class="flex items-center gap-2">
                                    <span class="w-3 h-3 rounded-md bg-blue-500"></span>
                                    <div><p class="text-[10px] text-slate-400 font-bold">ব্যাংক (Bank)</p><p id="dash-col-bank" class="text-sm font-black text-white">৳ ০</p></div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Collection Breakdown Widget -->
                    <div id="dash-collection-breakdown-card" class="hidden m3-card bg-slate-900/60 border border-slate-800/80 p-4 rounded-2xl shadow-xl flex-col gap-3">
                        <h3 class="text-sm font-black text-white uppercase tracking-widest border-b border-slate-800/60 pb-2 flex items-center gap-2">
                            <i class="fa-solid fa-list-ul text-blue-400"></i> জমার বিস্তারিত বিবরণ
                        </h3>
                        <div id="dash-collection-breakdown-list" class="flex flex-col gap-2 font-bn mt-1 max-h-48 overflow-y-auto custom-scrollbar pr-1">
                        </div>
                    </div>

                    <!-- Top 5 Due Customers Widget -->
                    <div class="m3-card bg-slate-900/60 border border-slate-800/80 p-4 rounded-2xl shadow-xl flex flex-col gap-3">
                        <div class="flex items-center justify-between border-b border-slate-800/60 pb-2">
                            <h3 class="text-sm font-black text-red-400 uppercase tracking-widest flex items-center gap-2">
                                <i class="fa-solid fa-triangle-exclamation"></i> শীর্ষ ৫ বকেয়া কাস্টমার
                            </h3>
                            <button class="text-[10px] text-blue-400 font-bold hover:underline" onclick="window.navigate('customers')">কাস্টমার লিস্ট</button>
                        </div>
                        <div id="top-due-customers-list" class="flex flex-col gap-2 font-bn">
                            <div class="text-center py-6 text-slate-500 text-xs italic">ডাটা ফিল্টার হচ্ছে...</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>`}function Tn(e,t=[]){let n=document.getElementById(e);if(!n)return;let r=n.getContext(`2d`);if(!r)return;let i=n.parentElement.clientWidth||500;n.width=i,n.height=180,r.clearRect(0,0,i,180);let a=t.length>0?t:[{day:`Sat`,sales:12e3,col:15e3},{day:`Sun`,sales:25e3,col:18e3},{day:`Mon`,sales:18e3,col:22e3},{day:`Tue`,sales:3e4,col:28e3},{day:`Wed`,sales:22e3,col:26e3},{day:`Thu`,sales:35e3,col:32e3},{day:`Fri`,sales:28e3,col:31e3}],o=i-60,s=Math.max(...a.map(e=>Math.max(e.sales,e.col)),4e4),c=o/(a.length-1);r.strokeStyle=`rgba(51, 65, 85, 0.3)`,r.lineWidth=1;for(let e=0;e<=3;e++){let t=30+120/3*e;r.beginPath(),r.moveTo(30,t),r.lineTo(i-30,t),r.stroke()}r.beginPath(),r.strokeStyle=`#3B82F6`,r.lineWidth=3,a.forEach((e,t)=>{let n=30+t*c,i=150-e.sales/s*120;t===0?r.moveTo(n,i):r.lineTo(n,i)}),r.stroke(),r.beginPath(),r.strokeStyle=`#10B981`,r.lineWidth=3,a.forEach((e,t)=>{let n=30+t*c,i=150-e.col/s*120;t===0?r.moveTo(n,i):r.lineTo(n,i)}),r.stroke(),r.font=`10px "Hind Siliguri", sans-serif`,r.fillStyle=`#94A3B8`,a.forEach((e,t)=>{let n=30+t*c,i=150-e.sales/s*120,a=150-e.col/s*120;r.fillStyle=`#3B82F6`,r.beginPath(),r.arc(n,i,4,0,Math.PI*2),r.fill(),r.fillStyle=`#10B981`,r.beginPath(),r.arc(n,a,4,0,Math.PI*2),r.fill(),r.fillStyle=`#94A3B8`,r.fillText(e.day,n-10,172)})}function En(e,t=0,n=0){let r=document.getElementById(e);if(!r)return;let i=r.getContext(`2d`);if(!i)return;r.width=120,r.height=120;let a=t+n;if(i.clearRect(0,0,120,120),a===0){i.beginPath(),i.arc(60,60,45,0,Math.PI*2),i.strokeStyle=`#334155`,i.lineWidth=14,i.stroke();return}let o=t/a*Math.PI*2,s=n/a*Math.PI*2;t>0&&(i.beginPath(),i.arc(60,60,45,0,o),i.strokeStyle=`#10B981`,i.lineWidth=14,i.stroke()),n>0&&(i.beginPath(),i.arc(60,60,45,o,o+s),i.strokeStyle=`#3B82F6`,i.lineWidth=14,i.stroke())}function Dn(){let e=document.getElementById(`dash-cust-name`),t=document.getElementById(`dash-cust-phone`),n=document.getElementById(`dash-cust-address`),r=document.getElementById(`dash-cust-initial-balance`),i=document.getElementById(`dash-cust-date`),a=document.getElementById(`dash-cust-zone-select`),o=document.getElementById(`dash-cust-zone-code-display`),s=document.getElementById(`dash-cust-generated-acc`);e&&(e.value=``),t&&(t.value=``),n&&(n.value=``),r&&(r.value=``),i&&(i.value=_()),a&&(a.selectedIndex=0),o&&(o.value=``),s&&(s.value=``)}function On(){let e=document.getElementById(`dash-add-customer-form`);if(e&&(e.classList.toggle(`hidden`),!e.classList.contains(`hidden`))){Dn(),Et(),rt(`dash-cust-address`,`dash-cust-address-datalist`,`dash-cust-address-chips`);let t=document.getElementById(`dash-cust-date`);t&&!t.value&&(t.value=_()),setTimeout(()=>{e.scrollIntoView({behavior:`smooth`,block:`start`});let t=document.getElementById(`dash-cust-name`);t&&t.focus()},80)}}async function kn(){let e=document.getElementById(`dash-cust-date`)?.value,t=x(e||_()),r=document.getElementById(`dash-cust-name`)?.value?.trim(),i=document.getElementById(`dash-cust-phone`)?.value?.trim(),o=document.getElementById(`dash-cust-address`)?.value?.trim(),s=document.getElementById(`dash-cust-zone-select`)?.value,l=document.getElementById(`dash-cust-initial-balance`)?.value?.trim();if(!r||!i||!s)return L.default.fire(`এরর`,`নাম, মোবাইল নম্বর ও জোন আবশ্যক!`,`error`);let d=y(l),f=document.getElementById(`dash-cust-generated-acc`)?.value||`Auto`,m=I(d);if(!(await L.default.fire({title:`<div class="flex items-center justify-center gap-2 font-bn font-black text-xl text-white"><i class="fa-solid fa-file-shield text-blue-400"></i><span>তথ্য যাচাই করুন</span></div>`,html:`
            <div class="text-left space-y-3 font-bn p-3.5 bg-slate-900/90 rounded-2xl border border-slate-800 shadow-inner">
                <div class="grid grid-cols-2 gap-4 border-b border-slate-800/80 pb-2.5">
                    <div class="flex flex-col gap-1"><span class="text-[10px] text-blue-400 font-black uppercase tracking-wider">কাস্টমারের নাম</span><span class="text-base text-white font-black">${r}</span></div>
                    <div class="flex flex-col gap-1"><span class="text-[10px] text-amber-400 font-black uppercase tracking-wider">অ্যাকাউন্ট নং</span><span class="text-base text-amber-400 font-black font-mono">${f}</span></div>
                </div>
                <div class="grid grid-cols-2 gap-4 border-b border-slate-800/80 pb-2.5">
                    <div class="flex flex-col gap-1"><span class="text-[10px] text-blue-400 font-black uppercase tracking-wider">মোবাইল নম্বর</span><span class="text-sm text-slate-200 font-bold font-mono">${i}</span></div>
                    <div class="flex flex-col gap-1"><span class="text-[10px] text-purple-400 font-black uppercase tracking-wider">জোন</span><span class="text-sm text-slate-200 font-bold">${s}</span></div>
                </div>
                <div class="flex flex-col gap-1 border-b border-slate-800/80 pb-2.5">
                    <span class="text-[10px] text-sky-400 font-black uppercase tracking-wider flex items-center gap-1"><i class="fa-solid fa-location-dot text-amber-400 text-xs"></i>ঠিকানা (Address)</span>
                    <span class="text-xs text-slate-200 font-medium">${o||`N/A`}</span>
                </div>
                <div class="flex flex-col gap-1 pt-1">
                    <span class="text-[10px] text-emerald-400 font-black uppercase tracking-wider">অবশিষ্ট ব্যালেন্স (Opening)</span>
                    <span class="text-2xl text-emerald-400 font-black">৳ ${v(d)}</span>
                    ${m?`<div class="text-[11px] text-emerald-400 font-black italic bg-emerald-500/10 px-2.5 py-1 rounded-xl border border-emerald-500/20 mt-1">(${m})</div>`:``}
                </div>
                <div class="flex flex-col gap-1 pt-2 border-t border-slate-800/80">
                    <span class="text-[10px] text-slate-400 font-black uppercase tracking-wider">হিসাব খোলার তারিখ</span>
                    <span class="text-sm text-slate-300 font-bold font-mono">${E(t)}</span>
                </div>
            </div>
            <p class="text-xs text-amber-400 font-bold mt-4 text-center">সব তথ্য সঠিক থাকলে "কনফার্ম করুন" বাটনে ক্লিক করুন।</p>
        `,showCancelButton:!0,confirmButtonText:`<i class="fa-solid fa-circle-check mr-2"></i>কনফার্ম করুন`,cancelButtonText:`<i class="fa-solid fa-pen-to-square mr-2"></i>সংশোধন করব`,customClass:{popup:`!bg-slate-950 !text-white !rounded-3xl border border-slate-800 shadow-2xl font-bn`,confirmButton:`m3-btn-primary !bg-blue-600 hover:!bg-blue-500 !px-7 !py-2.5 !rounded-xl font-bold shadow-lg shadow-blue-600/30`,cancelButton:`m3-btn-tonal !bg-slate-800 hover:!bg-slate-700 !text-slate-300 !px-5 !py-2.5 !rounded-xl font-bold border border-slate-700`}})).isConfirmed)return;let g=document.getElementById(`dash-save-cust-btn`);g&&(g.disabled=!0,g.innerText=`সেভ হচ্ছে...`);try{let e=(await p.getAllZones()).find(e=>e.name===s),l=(e?e.code:``)+await c.getNextAccountNo(s),f=h.batch(),m=u.getRef(),g=m.id,_=a.getRef();f.set(m,{name:r,phone:i,address:o||``,zone:s||``,accountNo:l,openingDate:t,initialDue:d,totalDue:d,createdAt:n.firestore.FieldValue.serverTimestamp()}),f.set(_,{customerId:g,customerName:r,date:t,voucherNo:`OPENING`,bill:d>0?d:0,paid:d<0?Math.abs(d):0,prevDue:0,currentDue:d,notes:`প্রারম্ভিক জের (Opening Balance)`,createdBy:window.AppState?.currentUserEmail||`System`,createdAt:n.firestore.FieldValue.serverTimestamp()}),await f.commit(),P(`CREATE`,`Customers`,g,r,{phone:i,zone:s,initialBalance:d}),L.default.fire({title:`সফল!`,text:`কাস্টমার "${r}" যোগ করা হয়েছে। জোন: ${s||`N/A`}`,icon:`success`,customClass:{popup:`!bg-slate-900 !text-white !rounded-3xl border border-slate-700`}}),Dn();let v=document.getElementById(`dash-add-customer-form`);v&&v.classList.add(`hidden`),window.loadCustomers&&window.loadCustomers()}catch(e){z(e,`কাস্টমার যোগ করা যায়নি`)}finally{g&&(g.disabled=!1,g.innerText=`সেভ করুন`)}}function An(){let e=document.getElementById(`top-due-customers-list`);if(!e)return;let t=[...U()].sort((e,t)=>(Number(t.totalDue)||0)-(Number(e.totalDue)||0)).slice(0,5);if(t.length===0){e.innerHTML=`<div class="text-center py-6 text-slate-500 text-xs italic">কোনো বকেয়া কাস্টমার পাওয়া যায়নি</div>`;return}let n=``;t.forEach((e,t)=>{let r=Number(e.totalDue)||0,i=(e.name||`Unknown`).replace(/'/g,`\\'`),a=e.phone||``;n+=`
            <div class="flex items-center justify-between p-2.5 rounded-xl bg-slate-950/60 border border-slate-800/60 hover:border-red-500/30 transition-all">
                <div class="flex items-center gap-2.5">
                    <span class="w-6 h-6 rounded-lg bg-red-500/10 text-red-400 font-black text-xs flex items-center justify-center">${t+1}</span>
                    <div>
                        <p class="text-xs font-black text-white truncate max-w-[120px]">${e.name||`Unknown`}</p>
                        <p class="text-[10px] text-slate-400 font-bold">${e.phone||`-`}</p>
                    </div>
                </div>
                <div class="flex items-center gap-1.5">
                    <span class="text-xs font-black text-red-400 mr-1">৳ ${v(r)}</span>
                    <button class="w-7 h-7 rounded-lg bg-emerald-600/10 hover:bg-emerald-600 text-emerald-400 hover:text-white flex items-center justify-center transition-all cursor-pointer" onclick="window.sendDashWhatsAppReminder('${a}', ${r}, '${i}')" title="WhatsApp তাগাদা">
                        <i class="fa-brands fa-whatsapp text-[12px]"></i>
                    </button>
                    <button class="w-7 h-7 rounded-lg bg-blue-600/10 hover:bg-blue-600 text-blue-400 hover:text-white flex items-center justify-center transition-all cursor-pointer" onclick="window.sendReminderSMS && window.sendReminderSMS('${a}', ${r}, '${i}')" title="SMS রিমাইন্ডার">
                        <i class="fa-solid fa-comment-sms text-[11px]"></i>
                    </button>
                </div>
            </div>`}),e.innerHTML=n}function jn(e,t,n){let r=v(Math.abs(t)),i=`আসসালামু আলাইকুম ${n},\nমেসার্স মা মোটরস্ থেকে আপনার হিসাব বিবরণী:\n\n${t<0?`অ্যাডভান্স জমা: ৳ ${r}`:`বর্তমান মোট বকেয়া: ৳ ${r}`}\n\n*বিশেষ অনুরোধ: আপনার বকেয়া টাকাটি দ্রুত পরিশোধ করার অনুরোধ রইল।*\n\nযোগাযোগ: 01819-397669\nধন্যবাদ! — মেসার্স মা মোটরস্`;window.sendWhatsApp&&window.sendWhatsApp(e,i)}async function Mn(){try{let e=_(),t=document.getElementById(`dash-total-due`)?.innerText||`৳ ০`,n=document.getElementById(`dash-today-col`)?.innerText||`৳ ০`,r=document.getElementById(`dash-today-exp`)?.innerText||`৳ ০`,i=document.getElementById(`dash-total-cust`)?.innerText||`০ জন`,a=await c.getAppSettings(),o=[...U()].filter(e=>(Number(e.totalDue)||0)>0).sort((e,t)=>(Number(t.totalDue)||0)-(Number(e.totalDue)||0)).slice(0,10),s=``;s=o.length>0?o.map((e,t)=>`
                <tr>
                    <td style="text-align:center; padding: 6px; border: 1px solid #cbd5e1; font-weight:bold;">${String(t+1).padStart(2,`0`)}</td>
                    <td style="padding: 6px; border: 1px solid #cbd5e1; font-weight:bold;">${e.name||`-`}</td>
                    <td style="text-align:center; padding: 6px; border: 1px solid #cbd5e1; font-size: 10px;">${e.accountNo||`-`}</td>
                    <td style="text-align:center; padding: 6px; border: 1px solid #cbd5e1; font-size: 10px;">${e.zone||`-`}</td>
                    <td style="text-align:center; padding: 6px; border: 1px solid #cbd5e1; font-size: 10px;">${e.phone||`-`}</td>
                    <td style="text-align:right; padding: 6px; border: 1px solid #cbd5e1; font-weight:900; color:#dc2626;">৳ ${v(Number(e.totalDue)||0)}</td>
                </tr>
            `).join(``):`<tr><td colspan="6" style="text-align:center; padding:12px; color:#64748b; font-style:italic;">কোনো বকেয়া কাস্টমার পাওয়া যায়নি</td></tr>`;let l=C({title:`EXECUTIVE REPORT`,dateRangeStr:`তারিখ: ${E(e)} • সময়: ${new Date().toLocaleTimeString(`en-US`,{hour:`2-digit`,minute:`2-digit`})}`},a),u=document.getElementById(`print-receipt-container`);u||(u=document.createElement(`div`),u.id=`print-receipt-container`,document.body.appendChild(u)),u.className=`print-a4`,u.innerHTML=`
            <table class="print-layout-table" style="width: 100%; border-collapse: collapse;">
                <thead><tr><td><div class="print-header-space"></div></td></tr></thead>
                <tbody>
                    <tr>
                        <td>
                            <div class="a4-wrapper font-bn">
                                ${l}

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
                                        ${s}
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
        `,g(u)}catch(e){console.error(`Executive Print Error:`,e),L.default.fire(`Error`,`রিপোর্ট প্রিন্ট করতে সমস্যা হয়েছে`,`error`)}}typeof window<`u`&&(window.sendDashWhatsAppReminder=jn,window.toggleDashCustomerForm=On,window.saveDashCustomer=kn);var Nn=[];function Pn(){Nn.forEach(e=>{typeof e==`function`&&e()}),Nn=[]}function Fn(e,t){if(window.AppState?.currentUserRole===`Staff`&&window.AppState?.permissions?.viewDashboard===!1){e.innerHTML=`<div class="m3-card text-center"><h2 class="text-xl font-bold text-red-500 font-bn">অ্যাক্সেস ডিনাইড! আপনার ড্যাশবোর্ড দেখার অনুমতি নেই।</h2></div>`;return}Pn(),e.innerHTML=wn(),Et(),In(),cn(t&&t.filterVoucher?t.filterVoucher:null)}function In(){Pn();let e=_();function t(){let e=U(),t=0;e.forEach(e=>{t+=Number(e.totalDue)||0});let n=document.getElementById(`dash-total-due`),r=document.getElementById(`dash-total-cust`);n&&(n.innerText=`৳ `+v(t)),r&&(r.innerText=e.length+` জন`),An()}t();let n=setInterval(()=>{if(!document.getElementById(`dash-total-due`)){clearInterval(n);return}t()},3e3);Nn.push(()=>clearInterval(n));let r=a.listenByDate(e,e=>{let t=0,n=0,r=0,i=0,a={},o={};e.forEach(e=>{let s=Number(e.paid)||0,c=Number(e.bill)||0;if(t+=s,i+=c,s>0){let t=e.receivedType||`Bank`,i=(e.receivedFrom||``).trim();t===`Cash`?(n+=s,i||=`শোরুম ক্যাশ`,o[i]=(o[i]||0)+s):(t===`Bank`||!e.receivedType)&&(r+=s,i||=`অন্যান্য ব্যাংক`,a[i]=(a[i]||0)+s)}});let s=document.getElementById(`dash-today-col`);s&&(s.innerText=`৳ `+v(t));let c=document.getElementById(`dash-col-cash`),l=document.getElementById(`dash-col-bank`);c&&(c.innerText=`৳ `+v(n)),l&&(l.innerText=`৳ `+v(r)),typeof window.renderCollectionBreakdown==`function`&&window.renderCollectionBreakdown(a,o),En(`payment-donut-chart`,n,r),Tn(`sales-vs-col-chart`)});Nn.push(r);let i=f.listenByDate(e,e=>{let t=0;e.forEach(e=>t+=Number(e.amount)||0);let n=document.getElementById(`dash-today-exp`);n&&(n.innerText=`৳ `+v(t));let r=document.getElementById(`dash-today-col`)?.innerText?.replace(/[^0-9]/g,``)||`0`,i=Number(r)-t,a=document.getElementById(`dash-net-cash`);a&&(a.innerText=`নিট জমা: ৳ ${v(Math.max(0,i))}`)});Nn.push(i)}window.switchDashTimeframe=e=>{[`today`,`week`,`month`].forEach(t=>{let n=document.getElementById(`tf-${t}-btn`);n&&(n.className=t===e?`px-3 py-1 rounded-lg bg-blue-600 text-white font-black`:`px-3 py-1 rounded-lg text-slate-400 hover:text-white font-bold`)})},window.printExecutiveSummary=Mn,window.renderCollectionBreakdown=(e,t)=>{let n=document.getElementById(`dash-collection-breakdown-card`),r=document.getElementById(`dash-collection-breakdown-list`);if(!n||!r)return;let i=``;if(Object.keys(e).length===0&&Object.keys(t).length===0){n.classList.remove(`flex`),n.classList.add(`hidden`);return}if(n.classList.remove(`hidden`),n.classList.add(`flex`),Object.keys(e).length>0){i+=`<div class="text-[11px] text-blue-400 font-black uppercase mt-1 mb-1"><i class="fa-solid fa-building-columns mr-1"></i> ব্যাংক জমা</div>`;for(let[t,n]of Object.entries(e))i+=`<div class="flex items-center justify-between bg-slate-950/50 p-2 rounded-lg border border-slate-800">
                        <span class="text-xs text-slate-300 font-bold truncate max-w-[60%]">${t}</span>
                        <span class="text-xs font-black text-blue-400">৳ ${window.formatAmountWithComma?window.formatAmountWithComma(n):n}</span>
                     </div>`}if(Object.keys(t).length>0){i+=`<div class="text-[11px] text-emerald-400 font-black uppercase mt-2 mb-1"><i class="fa-solid fa-money-bill-wave mr-1"></i> ক্যাশ জমা</div>`;for(let[e,n]of Object.entries(t))i+=`<div class="flex items-center justify-between bg-slate-950/50 p-2 rounded-lg border border-slate-800">
                        <span class="text-xs text-slate-300 font-bold truncate max-w-[60%]">${e}</span>
                        <span class="text-xs font-black text-emerald-400">৳ ${window.formatAmountWithComma?window.formatAmountWithComma(n):n}</span>
                     </div>`}r.innerHTML=i};var Ln=null,Rn=[],zn=1,Bn=20;function Vn(e){if(window.AppState.currentUserRole===`Staff`&&window.AppState.permissions.viewExpenses===!1){e.innerHTML=`<div class="m3-card text-center font-bn py-12"><h2 class="text-xl font-bold text-red-500">অ্যাক্সেস ডিনাইড!</h2></div>`;return}Ln=null,Rn=[],zn=1,e.innerHTML=`
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
        </div>`,document.getElementById(`exp-date`).value=window.getTodayLocalDateString?window.getTodayLocalDateString():new Date().toISOString().split(`T`)[0],Hn(),Un()}async function Hn(){let e=document.getElementById(`exp-category`);e&&(e.innerHTML=[`দোকান ভাড়া`,`বিদ্যুৎ বিল`,`পানি বিল`,`ইন্টারনেট/ডিস বিল`,`স্টাফ বেতন`,`নাস্তা/আপ্যায়ন`,`চা/কফি`,`যাতায়াত/পরিবহন`,`মালামাল/পণ্য ক্রয়`,`প্রিন্টিং/স্টেশনারি`,`মেরামতি/রক্ষণাবেক্ষণ`,`দান/চাঁদা`,`পৌরসভা/ট্যাক্স`,`কুরিয়ার/পার্সেল`,`অন্যান্য`].map(e=>`<option value="${e}">${e}</option>`).join(``)+`<option value="ADD_NEW">+ নতুন ক্যাটাগরি যোগ করুন...</option>`)}async function Un(e=`next`){let t=document.getElementById(`expense-list`);if(!t)return;let n=document.getElementById(`expense-list-mobile`);t.innerHTML=`<tr><td colspan="5" class="text-center py-12">লোডিং...</td></tr>`,n&&(n.innerHTML=`<div class="text-center py-10 text-slate-500 font-bold italic">লোডিং...</div>`);try{let n=e===`next`?Ln:Rn.length>1?Rn[Rn.length-2]:null,r=await f.getByPage(Bn,n,`createdAt`,`desc`);Ln=r.lastDoc,e===`next`?n&&Rn.push(n):Rn.pop();let i=document.getElementById(`expense-pagination`);i&&(i.classList.remove(`hidden`),document.getElementById(`exp-current-page-display`).innerText=zn,document.getElementById(`exp-prev-page`).disabled=zn===1,document.getElementById(`exp-next-page`).disabled=r.count<Bn),Wn(r.data,t)}catch{t.innerHTML=`Error loading data`}}function Wn(e,t){let n=document.getElementById(`expense-list-mobile`),r=String(window.AppState?.currentUserRole||``).toLowerCase()===`admin`,i=r||window.AppState?.permissions?.editExpenses!==!1&&window.AppState?.permissions?.manageExpenses!==!1,a=r||window.AppState?.permissions?.deleteExpenses===!0,o=_(),s=0;e.forEach(e=>{e.date===o&&(s+=Number(e.amount)||0)});let c=document.getElementById(`expense-today-sum`);c&&(c.innerText=`৳ ${v(s)}`);let l=``,u=``;e.forEach(e=>{let t=D(e.category),n=D(e.details||`-`),r=t.replace(/'/g,`\\'`);l+=`
            <tr class="border-b border-slate-800/50 hover:bg-white/[0.02] transition-colors">
                <td class="text-slate-300 font-bold text-xs">${E(e.date)}${e.createdBy?`<div class="text-[8px] text-blue-400/80 italic mt-0.5">by ${D(e.createdBy)}</div>`:``}</td>
                <td class="font-bold text-white text-sm">${t}</td>
                <td class="text-xs text-slate-200">${n}</td>
                <td class="text-right text-red-400 font-black text-base">৳${v(e.amount)}</td>
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
                        <div class="mobile-card-sub text-slate-400 font-bold mt-0.5">${E(e.date)}</div>
                    </div>
                    <div class="text-right">
                        <div class="text-red-400 font-black text-lg">৳ ${v(e.amount)}</div>
                    </div>
                </div>
                <div class="mobile-card-row"><span class="mobile-card-label">বিবরণ:</span><span class="mobile-card-value text-slate-200">${n}</span></div>
                ${e.createdBy?`<div class="mobile-card-row"><span class="mobile-card-label">এন্ট্রিদাতা:</span><span class="mobile-card-value text-blue-400 text-xs">${D(e.createdBy)}</span></div>`:``}
                ${i||a?`
                <div class="mobile-card-actions">
                    ${i?`<button class="m3-btn-icon" onclick="window.editExpense('${e.id}', '${e.date}', '${r}', ${e.amount}, '${encodeURIComponent(e.details||``)}')" title="এডিট"><i class="fa-solid fa-pen-to-square text-amber-400"></i></button>`:``}
                    ${a?`<button class="m3-btn-icon" onclick="window.deleteExpense('${e.id}', '${r}')" title="ডিলেট"><i class="fa-solid fa-trash-can text-red-400"></i></button>`:``}
                </div>`:``}
            </div>`}),t.innerHTML=l||`<tr><td colspan="5" class="text-center py-10 italic">কোনো ডাটা নেই</td></tr>`,n&&(n.innerHTML=u||`<div class="text-center py-10 text-slate-500 font-bold italic">কোনো ডাটা নেই</div>`)}function Gn(e){e===`next`?zn++:zn--,Un(e)}var Kn=null;async function qn(){let e=document.getElementById(`exp-date`),t=document.getElementById(`exp-category`),n=document.getElementById(`exp-details`),r=document.getElementById(`exp-amount`);if(!e||!t||!r)return;let i=x(e.value),a=t.value,o=n.value.trim(),s=y(r.value);if(!s||s<=0)return L.default.fire({title:`ত্রুটি!`,text:`সঠিক খরচের পরিমাণ লিখুন`,icon:`error`});let c=document.getElementById(`save-exp-btn`);c&&(c.disabled=!0);let l=I(s),u=!!Kn;if(!(await L.default.fire({title:u?`<i class="fa-solid fa-magnifying-glass text-amber-400 mr-2"></i>খরচ সংশোধন যাচাই`:`<i class="fa-solid fa-magnifying-glass text-blue-400 mr-2"></i>খরচ যাচাই করুন`,html:`
            <div class="text-left space-y-3 font-bn p-2 bg-slate-900 rounded-2xl border border-slate-800">
                <div class="flex flex-col gap-1 border-b border-slate-800 pb-2">
                    <span class="text-[10px] text-blue-400 font-black uppercase tracking-widest">খরচের ক্যাটাগরি</span>
                    <span class="text-lg text-white font-black">${a}</span>
                </div>
                <div class="grid grid-cols-2 gap-4 border-b border-slate-800 pb-2">
                    <div class="flex flex-col gap-1">
                        <span class="text-[10px] text-blue-400 font-black uppercase tracking-widest">তারিখ</span>
                        <span class="text-sm text-slate-200 font-bold">${E(i)}</span>
                    </div>
                    <div class="flex flex-col gap-1">
                        <span class="text-[10px] text-slate-400 font-black uppercase tracking-widest">বিবরণ</span>
                        <span class="text-xs text-slate-300 font-medium">${o||`-`}</span>
                    </div>
                </div>
                <div class="flex flex-col gap-1 pt-1">
                    <span class="text-[10px] text-red-400 font-black uppercase tracking-widest">খরচের পরিমাণ (৳)</span>
                    <span class="text-2xl text-red-500 font-black">৳ ${v(s)}</span>
                    ${l?`<div class="text-[11px] text-red-400 font-black italic bg-red-500/10 px-2 py-1 rounded-lg border border-red-500/20 mt-1">(${l})</div>`:``}
                </div>
            </div>`,showCancelButton:!0,confirmButtonText:u?`<i class="fa-solid fa-pen-to-square mr-1"></i> আপডেট করুন`:`<i class="fa-solid fa-check mr-1"></i> সেভ করুন`})).isConfirmed){c&&(c.disabled=!1);return}try{Kn?(await f.update(Kn,{date:i,category:a,details:o,amount:s}),P(`UPDATE`,`Expenses`,Kn,a,{amount:s}),Kn=null,c&&(c.innerHTML=`<i class="fa-solid fa-cloud-arrow-up"></i> সেভ করুন`,c.className=`m3-btn-primary px-6 h-[42px] py-0 text-sm font-black uppercase tracking-widest w-full flex items-center justify-center gap-2`)):P(`CREATE`,`Expenses`,await f.add({date:i,category:a,details:o,amount:s,createdBy:F.currentUserEmail}),a,{amount:s}),r.value=``,n.value=``,t&&(t.selectedIndex=0),L.default.fire({toast:!0,position:`top-end`,icon:`success`,title:`সাফল্য!`,timer:2e3}),Un()}catch{L.default.fire(`Error`,`ব্যর্থ হয়েছেন`,`error`)}finally{c&&(c.disabled=!1)}}async function Jn(e,t){if(await R(`খরচ মুছে ফেলা`))try{await f.delete(e),P(`DELETE`,`Expenses`,e,t),Un(),L.default.fire(`সফল!`,`খরচ মুছে ফেলা হয়েছে।`,`success`)}catch{L.default.fire(`Error`,`মুছতে সমস্যা হয়েছে`,`error`)}}async function Yn(e,t,n,r,i){if(!await R(`খরচ সংশোধন`))return;let a=decodeURIComponent(i||``);document.getElementById(`exp-date`).value=E(t);let o=document.getElementById(`exp-category`);if(o){if(!Array.from(o.options).some(e=>e.value===n)){let e=document.createElement(`option`);e.value=n,e.text=n,o.insertBefore(e,o.lastChild)}o.value=n}document.getElementById(`exp-amount`).value=r,document.getElementById(`exp-details`).value=a,Kn=e;let s=document.getElementById(`save-exp-btn`);s&&(s.innerHTML=`<i class="fa-solid fa-pen-to-square"></i> আপডেট খরচ`,s.className=`m3-btn-primary px-6 h-[42px] py-0 text-sm font-black uppercase tracking-widest w-full flex items-center justify-center gap-2 !bg-amber-600 shadow-lg`),window.scrollTo({top:0,behavior:`smooth`})}async function Xn(){let e=document.getElementById(`exp-category`);if(e.value===`ADD_NEW`){let{value:t}=await L.default.fire({title:`নতুন ক্যাটাগরি`,input:`text`,showCancelButton:!0});if(t&&t.trim()){let n=document.createElement(`option`);n.value=t.trim(),n.text=t.trim(),e.insertBefore(n,e.lastChild),e.value=t.trim()}else e.selectedIndex=0}}async function Zn(){let e=_(),{value:t}=await L.default.fire({title:`<i class="fa-solid fa-chart-pie text-blue-400 mr-2"></i>খরচের রিপোর্ট তৈরি করুন`,html:`
            <div class="text-left space-y-4 font-bn p-2">
                <div>
                    <label class="block text-[11px] font-black text-blue-400 uppercase tracking-widest mb-1.5 ml-1">শুরুর তারিখ</label>
                    <input id="rep-start" class="m3-field datepicker" value="${e}">
                </div>
                <div>
                    <label class="block text-[11px] font-black text-blue-400 uppercase tracking-widest mb-1.5 ml-1">শেষ তারিখ</label>
                    <input id="rep-end" class="m3-field datepicker" value="${e}">
                </div>
            </div>`,showCancelButton:!0,confirmButtonText:`রিপোর্ট তৈরি করুন`,cancelButtonText:`বাতিল`,customClass:{popup:`!bg-slate-900 !text-white !rounded-3xl border border-slate-700`,title:`!text-white`,confirmButton:`m3-btn-primary !bg-blue-600`,cancelButton:`m3-btn-tonal`},preConfirm:()=>{let e=document.getElementById(`rep-start`).value,t=document.getElementById(`rep-end`).value;return!e||!t?L.default.showValidationMessage(`উভয় তারিখ দেওয়া আবশ্যক!`):{start:x(e),end:x(t)}}});if(t){L.default.fire({title:`রিপোর্ট তৈরি হচ্ছে...`,didOpen:()=>L.default.showLoading(),allowOutsideClick:!1});try{let e=(await f.getAll(`date`,`desc`)).filter(e=>e.date>=t.start&&e.date<=t.end);if(e.length===0)return L.default.fire(`Error`,`এই সময়ের মধ্যে কোনো খরচ পাওয়া যায়নি!`,`error`);await Qn(e,t.start,t.end),L.default.close()}catch(e){console.error(e),L.default.fire(`Error`,`রিপোর্ট জেনারেট ব্যর্থ হয়েছে`,`error`)}}}async function Qn(e,t,n){let r=await c.getAppSettings();r.shopName,r.shopOwner,r.shopPhone,r.shopAddress;let i=`${E(t)} হতে ${E(n)}`;e.sort((e,t)=>new Date(e.date)-new Date(t.date));let a=0,o={};e.forEach(e=>{let t=Number(e.amount)||0;a+=t,o[e.category]=(o[e.category]||0)+t});let s=document.getElementById(`print-receipt-container`);s||(s=document.createElement(`div`),s.id=`print-receipt-container`,document.body.appendChild(s)),s.className=`print-a4`,s.innerHTML=`
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
            ${C(r,{title:`EXPENSE STATEMENT`,dateRangeStr:i})}

            <div class="summary-grid">
                <!-- CATEGORY SUMMARY (Matches Column 1 style) -->
                <div class="compact-card">
                    <div class="card-title">Category-wise Summary</div>
                    <div style="display: flex; flex-wrap: wrap; gap: 4px;">
                        ${Object.keys(o).map(e=>`
                            <div class="cat-pill">${D(e)}: ৳${v(o[e])}</div>
                        `).join(``)}
                    </div>
                </div>

                <!-- FINANCIAL SUMMARY (Matches Column 2 style) -->
                <div class="compact-card" style="border-left: 0; padding: 12px 15px;">
                    <div class="card-title">Expense Summary</div>
                    <div class="sum-row total">
                        <span style="font-size:10px; font-weight:900; color:#64748b;">TOTAL EXPENSE</span>
                        <strong style="font-size:14px; color:#dc2626;">৳ ${v(a)}</strong>
                    </div>
                    <div class="sum-row count">
                        <span style="font-size:10px; font-weight:900; color:#64748b;">TOTAL ENTRIES</span>
                        <strong style="font-size:14px; color:#059669;">${e.length} টি</strong>
                    </div>
                    <div class="sum-row balance">
                        <span style="font-size:10px; font-weight:900; color:#1e40af;">NET DEBIT</span>
                        <strong style="font-size:15px; color:#1e40af;">৳ ${v(a)}</strong>
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
                            <td style="font-weight: 700;">${E(e.date)}</td>
                            <td><strong>${D(e.category)}</strong></td>
                            <td style="color: #475569;">${D(e.details||`-`)}</td>
                            <td class="text-right" style="font-weight: 900;">${v(e.amount)}</td>
                        </tr>
                    `).join(``)}
                </tbody>
                <tfoot>
                    <tr style="background: #f1f5f9; font-weight: 900;">
                        <td colspan="3" class="text-right" style="padding: 12px;">সর্বমোট খরচ:</td>
                        <td class="text-right" style="padding: 12px; font-size: 14px; color: #dc2626;">৳ ${v(a)}</td>
                    </tr>
                </tfoot>
            </table>

            <div class="footer-block">
                <p>রিপোর্ট জেনারেট: ${new Date().toLocaleString(`en-GB`)}</p>
                <div class="sig-line">কর্তৃপক্ষের স্বাক্ষর</div>
            </div>
        </div>
    `,g(s)}window.saveExpense=qn,window.deleteExpense=Jn,window.editExpense=Yn,window.handleCategoryChange=Xn,window.loadRecentExpenses=Un,window.changeExpensePage=Gn,window.generateExpenseReport=Zn,window.promptSecurityPin=R;var $n=t({checkSmsLength:()=>tr,sendTestSMS:()=>nr,unlockSmsSettings:()=>er});async function er(){if(window.AppState.currentUserRole!==`Admin`)return L.default.fire(`অ্যাক্সেস ডিনাইড!`,`শুধুমাত্র অ্যাডমিন সেটিংস পরিবর্তন করতে পারবেন।`,`error`);await R(`SMS সেটিংস পরিবর্তন (Settings Unlock)`)&&([`set-sms-reminder`,`set-sms-opening`,`set-sms-new-bill`,`set-sms-payment`,`set-sms-api`,`set-sms-sender`,`set-sms-auto`].forEach(e=>{let t=document.getElementById(e);t&&(t.disabled=!1,t.style.opacity=`1`)}),L.default.fire({toast:!0,position:`top-end`,icon:`success`,title:`SMS সেটিংস আনলক করা হয়েছে`,showConfirmButton:!1,timer:3e3,customClass:{popup:`!bg-slate-900 !text-white border border-slate-700`}}))}function tr(e,t){if(!e)return;let n=e.value||``,r=n.length,i=/[^\x00-\x7F]/.test(n),a=i?70:160,o=Math.ceil(r/a)||1,s=document.getElementById(t);s&&(s.innerText=`${r}/${a} (${o} SMS${i?` - বাংলা`:``})`,o>1?(s.classList.add(`text-amber-400`),s.classList.remove(`text-purple-300`)):(s.classList.remove(`text-amber-400`),s.classList.add(`text-purple-300`)))}async function nr(){if(!document.getElementById(`set-sms-api`)?.value.trim())return L.default.fire({title:`API Key প্রয়োজন!`,text:`প্রথমে SMS Settings-এ আপনার BulkSMSBD API Key দিন এবং সেভ করুন।`,icon:`warning`,customClass:{popup:`!bg-slate-900 !text-white !rounded-3xl border border-slate-700`}});let{value:e}=await L.default.fire({title:`Send Test SMS`,input:`text`,inputLabel:`পরীক্ষামূলক মেসেজ পাঠাতে মোবাইল নম্বরটি লিখুন:`,inputPlaceholder:`018XXXXXXXX`,showCancelButton:!0,confirmButtonText:`Send Test SMS`,customClass:{popup:`!bg-slate-900 !text-white !rounded-3xl border border-slate-700`},inputValidator:e=>!e||e.trim().length<11?`সঠিক ১১-ডিজিটের মোবাইল নম্বর দিন!`:null});e&&(L.default.fire({title:`SMS পাঠানো হচ্ছে...`,allowOutsideClick:!1,didOpen:()=>L.default.showLoading()}),await be(e.trim(),`MAA ERP Test SMS: Your BulkSMSBD SMS Gateway is working perfectly! - M/S. Maa Motors`,!1)?L.default.fire({title:`সফল!`,text:`টেস্ট মেসেজ পাঠানো হয়েছে।`,icon:`success`}):L.default.fire({title:`ব্যর্থ!`,text:`API Key বা ব্যালেন্স চেক করুন।`,icon:`error`}))}window.unlockSmsSettings=er,window.checkSmsLength=tr,window.sendTestSMS=nr;var rr=t({getCurrentLogo:()=>ar,handleLogoSelect:()=>cr,setCurrentLogo:()=>or,unlockShopSettings:()=>sr}),ir=null;function ar(){return ir}function or(e){ir=e;let t=document.getElementById(`logo-preview`);t&&e&&(t.src=e,t.classList.remove(`hidden`))}async function sr(){if(window.AppState.currentUserRole!==`Admin`)return L.default.fire(`অ্যাক্সেস ডিনাইড!`,`শুধুমাত্র অ্যাডমিন সেটিংস পরিবর্তন করতে পারবেন।`,`error`);await R(`দোকানের তথ্য পরিবর্তন (Settings Unlock)`)&&([`set-shop-name`,`set-shop-owner`,`set-shop-phone`,`set-shop-address`,`set-shop-logo`,`set-print-size`,`set-show-watermark`].forEach(e=>{let t=document.getElementById(e);t&&(t.disabled=!1,t.style.opacity=`1`)}),L.default.fire({toast:!0,position:`top-end`,icon:`success`,title:`সেটিংস আনলক করা হয়েছে`,showConfirmButton:!1,timer:3e3,customClass:{popup:`!bg-slate-900 !text-white border border-slate-700`}}))}function cr(e){let t=e.target.files[0];if(!t)return;let n=new FileReader;n.onload=function(e){let t=new Image;t.onload=function(){let e=document.createElement(`canvas`),n=1;t.width>300&&(n=300/t.width),e.width=t.width*n,e.height=t.height*n,e.getContext(`2d`).drawImage(t,0,0,e.width,e.height),or(e.toDataURL(`image/png`,.8))},t.src=e.target.result},n.readAsDataURL(t)}window.unlockShopSettings=sr,window.handleLogoSelect=cr;function lr(){let e=we(),t=Te();return`
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
    `}function ur(){return`
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
                ${lr()}
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
                    </div>

                    <!-- 2. Data Editing -->
                    <div class="p-3 rounded-xl bg-slate-900/80 border border-slate-800 space-y-2">
                        <span class="text-[11px] font-black text-amber-400 uppercase tracking-wider block border-b border-slate-800 pb-1"><i class="fa-solid fa-pen-to-square mr-1"></i>ডাটা এডিটিং সেফটি</span>
                        <label class="flex items-center gap-2.5 cursor-pointer text-xs font-bold text-slate-200"><input type="checkbox" id="pol-editCustomer" class="pol-chk w-4 h-4"> কাস্টমার তথ্য এডিট</label>
                        <label class="flex items-center gap-2.5 cursor-pointer text-xs font-bold text-slate-200"><input type="checkbox" id="pol-editTxn" class="pol-chk w-4 h-4"> পূর্বের লেনদেন এডিট</label>
                        <label class="flex items-center gap-2.5 cursor-pointer text-xs font-bold text-slate-200"><input type="checkbox" id="pol-editExpense" class="pol-chk w-4 h-4"> দৈনিক খরচ এডিট</label>
                        <label class="flex items-center gap-2.5 cursor-pointer text-xs font-bold text-slate-200"><input type="checkbox" id="pol-editSettings" class="pol-chk w-4 h-4"> সফটওয়্যার সেটিংস এডিট</label>
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
    `}function dr(){let e=document.getElementById(`btn-unlock-policy`),t=document.getElementById(`btn-change-hard-pass`),n=document.getElementById(`policy-checkbox-container`),r=()=>{let e=document.getElementById(`btn-pause-10m`),t=document.getElementById(`btn-pause-1h`),n=document.getElementById(`btn-cancel-pause`),i=()=>{let e=document.getElementById(`pin-bypass-status-container`);e&&(e.innerHTML=lr(),r())};e&&e.addEventListener(`click`,async()=>{await ke()&&(Ee(10),i())}),t&&t.addEventListener(`click`,async()=>{await ke()&&(Ee(60),i())}),n&&n.addEventListener(`click`,()=>{Ee(0),i()})};r(),e&&e.addEventListener(`click`,async()=>{await ke()&&(n&&n.classList.remove(`opacity-50`,`pointer-events-none`),e.innerHTML=`<i class="fa-solid fa-lock-open text-xs"></i> <span>আনলকড (Unlocked)</span>`,e.className=`px-4 py-2 rounded-xl bg-emerald-600 text-white text-xs font-black flex items-center gap-1.5`,b(`১৫-পয়েন্ট সিকিউরিটি পলিসি আনলক করা হয়েছে`,`success`))}),t&&t.addEventListener(`click`,async()=>{if(!await ke())return;let{value:e}=await L.default.fire({title:`<div class="flex items-center justify-center gap-2 font-bn font-black text-lg text-white"><i class="fa-solid fa-key text-amber-400"></i><span>নতুন মাস্টার পাসওয়ার্ড সেট করুন</span></div>`,html:`
                    <div class="space-y-3 font-bn text-left p-1">
                        <p class="text-xs text-slate-300 mb-2">আপনার নতুন সিকিউরিটি পাসওয়ার্ডটি লিখুন (কমপক্ষে ৪ অক্ষর):</p>
                        <div class="relative w-full">
                            <input id="sw-new-pass-inp" type="password" class="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-white outline-none focus:border-amber-500 text-sm font-mono pr-10" placeholder="নতুন পাসওয়ার্ড লিখুন">
                            <button type="button" id="sw-new-pass-eye" class="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white text-sm cursor-pointer p-1">
                                <i class="fa-solid fa-eye"></i>
                            </button>
                        </div>
                    </div>
                `,focusConfirm:!1,showCancelButton:!0,confirmButtonText:`<i class="fa-solid fa-check mr-1.5"></i> সেভ পাসওয়ার্ড`,cancelButtonText:`বাতিল`,customClass:{popup:`!bg-slate-950 !text-white !rounded-3xl border border-slate-800 font-bn`,confirmButton:`m3-btn-primary !bg-amber-600 hover:!bg-amber-500 !px-6 !py-2.5 rounded-xl font-bold`,cancelButton:`m3-btn-tonal !bg-slate-800 hover:!bg-slate-700 !text-slate-300 !px-5 !py-2.5 rounded-xl font-bold`},didOpen:()=>{let e=document.getElementById(`sw-new-pass-inp`),t=document.getElementById(`sw-new-pass-eye`);e&&(e.addEventListener(`keydown`,e=>{e.key===`Enter`&&(e.preventDefault(),L.default.clickConfirm())}),t&&(t.onclick=()=>{let n=e.type===`password`;e.type=n?`text`:`password`,t.innerHTML=n?`<i class="fa-solid fa-eye-slash text-amber-400"></i>`:`<i class="fa-solid fa-eye text-slate-400"></i>`}),setTimeout(()=>e.focus(),150))},preConfirm:()=>{let e=document.getElementById(`sw-new-pass-inp`)?.value?.trim();return!e||e.length<4?(L.default.showValidationMessage(`কমপক্ষে ৪ অক্ষরের পাসওয়ার্ড দিন!`),!1):e}});e&&(await c.updateAppSettings({masterPasswordHash:e.trim()}),b(`মাস্টার পাসওয়ার্ড পরিবর্তন সফল হয়েছে`,`success`))})}async function fr(){let e=await De();Object.keys(e).forEach(t=>{let n=document.getElementById(`pol-${t}`);n&&(n.checked=!!e[t])})}function pr(){let e={};return document.querySelectorAll(`.pol-chk`).forEach(t=>{let n=t.id.replace(`pol-`,``);e[n]=t.checked}),e}function mr(){return`
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
    `}async function hr(){let e=document.getElementById(`zone-list-container`);if(e)try{let[t,n]=await Promise.all([p.getAllZones(),u.getAll()]);if(!t||t.length===0){e.innerHTML=`
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
        `}catch(t){console.error(`loadZoneList error:`,t),e.innerHTML=`<div class="text-center text-red-400 py-6 text-xs font-bn">জোন ডাটা লোড করতে ব্যর্থ হয়েছে</div>`}}async function gr(){let{value:e}=await L.default.fire({title:`<div class="flex items-center justify-center gap-2 text-indigo-400 font-bn font-black"><i class="fa-solid fa-map-location-dot"></i><span>নতুন জোন যোগ করুন</span></div>`,html:`
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
            </div>`,showCancelButton:!0,confirmButtonText:`<i class="fa-solid fa-floppy-disk mr-1.5"></i>সেভ করুন`,cancelButtonText:`বাতিল`,customClass:{popup:`!bg-slate-950 !text-white !rounded-3xl border border-slate-800 font-bn`},preConfirm:()=>{let e=document.getElementById(`sw-zn-name`)?.value?.trim(),t=document.getElementById(`sw-zn-code`)?.value?.trim()?.toUpperCase();return!e||!t?L.default.showValidationMessage(`জোনের নাম ও শর্ট কোড উভয়ই আবশ্যক!`):{name:e,code:t}}});if(e)try{let t=await p.getByCode(e.code);if(t)return L.default.fire(`সতর্কতা!`,`জোন কোড "${e.code}" ইতোমধ্যে "${t.name}" জোনে ব্যবহৃত হচ্ছে!`,`warning`);await p.add({name:e.name,code:e.code}),P(`CREATE_ZONE`,`Settings`,e.name,`Code: ${e.code}`),L.default.fire(`সফল!`,`নতুন জোন "${e.name}" (কোড: ${e.code}) তৈরি হয়েছে।`,`success`),hr(),window.loadAllZones&&window.loadAllZones()}catch(e){console.error(`showAddZoneModal error:`,e),L.default.fire(`ত্রুটি!`,`জোন সেভ করতে সমস্যা হয়েছে।`,`error`)}}async function _r(e,t,n){let{value:r}=await L.default.fire({title:`<div class="flex items-center justify-center gap-2 text-indigo-400 font-bn font-black"><i class="fa-solid fa-pen-to-square"></i><span>জোন এডিট করুন</span></div>`,html:`
            <div class="space-y-3 text-left font-bn p-2">
                <div>
                    <label class="block text-xs font-bold text-slate-300 mb-1">জোনের নাম *</label>
                    <input id="sw-ezn-name" class="m3-field text-xs font-bold" value="${t}">
                </div>
                <div>
                    <label class="block text-xs font-bold text-slate-300 mb-1">জোন শর্ট কোড *</label>
                    <input id="sw-ezn-code" class="m3-field text-xs font-bold font-mono uppercase" value="${n}">
                </div>
            </div>`,showCancelButton:!0,confirmButtonText:`<i class="fa-solid fa-check mr-1.5"></i>আপডেট করুন`,cancelButtonText:`বাতিল`,customClass:{popup:`!bg-slate-950 !text-white !rounded-3xl border border-slate-800 font-bn`},preConfirm:()=>{let e=document.getElementById(`sw-ezn-name`)?.value?.trim(),t=document.getElementById(`sw-ezn-code`)?.value?.trim()?.toUpperCase();return!e||!t?L.default.showValidationMessage(`জোনের নাম ও কোড উভয়ই আবশ্যক!`):{name:e,code:t}}});if(r)try{let i=r.code!==n,a=!1;if(i&&(a=(await L.default.fire({title:`জোন কোড পরিবর্তন সতর্কতা!`,text:`আপনি জোন কোড "${n}" থেকে "${r.code}"-এ পরিবর্তন করছেন। আপনি কি এই জোনের সকল কাস্টমারের একাউন্ট আইডি নতুন জোন কোডে অটোমেটিক আপডেট করতে চান?`,icon:`question`,showCancelButton:!0,confirmButtonText:`হ্যাঁ, কাস্টমার একাউন্ট আপডেট করুন`,cancelButtonText:`না, শুধু জোন আপডেট করুন`,customClass:{popup:`!bg-slate-900 !text-white !rounded-3xl border border-slate-700 font-bn`}})).isConfirmed),await p.update(e,{name:r.name,code:r.code}),a){L.default.fire({title:`কাস্টমার আইডি আপডেট হচ্ছে...`,allowOutsideClick:!1,didOpen:()=>L.default.showLoading()});let e=(await u.getAll()).filter(e=>(e.zone||``).trim()===t||(e.zone||``).trim()===r.name);for(let t of e){let e=(t.accountNo||``).match(/\d+$/),n=e?e[0].slice(-4):`0001`,i=r.code+n.padStart(4,`0`);await u.update(t.id,{zone:r.name,accountNo:i})}}P(`UPDATE_ZONE`,`Settings`,e,`${r.name} (${r.code})`),L.default.fire(`সফল!`,`জোনের তথ্য আপডেট হয়েছে।`,`success`),hr(),window.loadAllZones&&window.loadAllZones()}catch(e){console.error(`showEditZoneModal error:`,e),L.default.fire(`ত্রুটি!`,`জোন আপডেট করা সম্ভব হয়নি।`,`error`)}}async function vr(e,t){if(await R(`জোন ডিলেট করা (Security Check)`))try{let n=(await u.getAll()).filter(e=>(e.zone||``).trim()===t);if(n.length>0)return L.default.fire({title:`ডিলেট করা যাবে না!`,text:`এই জোনে (${t}) ${n.length} জন কাস্টমার নিবন্ধিত আছেন। প্রথমে কাস্টমারদের অন্য জোনে সরান।`,icon:`warning`,customClass:{popup:`!bg-slate-900 !text-white !rounded-3xl border border-slate-700 font-bn`}});await p.delete(e),P(`DELETE_ZONE`,`Settings`,e,t),L.default.fire(`সফল!`,`জোন "${t}" সফলভাবে ডিলেট করা হয়েছে।`,`success`),hr(),window.loadAllZones&&window.loadAllZones()}catch(e){console.error(`deleteZoneFlow error:`,e),L.default.fire(`ত্রুটি!`,`জোন ডিলেট করা সম্ভব হয়নি।`,`error`)}}window.showAddZoneModal=gr,window.showEditZoneModal=_r,window.deleteZoneFlow=vr;function yr(e){if(window.AppState.currentUserRole!==`Admin`){e.innerHTML=`<div class="m3-card text-center font-bn py-12"><h2 class="text-xl font-black text-red-500">অ্যাক্সেস ডিনাইড!</h2></div>`;return}e.innerHTML=`
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

                <!-- 15-Point Granular Security Policy Control Center -->
                ${ur()}

                <!-- Zone & Regional Setup Management -->
                ${mr()}

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
    `,br()}async function br(){try{let e=await c.getAppSettings(),t={"set-shop-name":e.shopName||`M/S. Maa Motors`,"set-shop-owner":e.shopOwner||`Mohammed Amran`,"set-shop-phone":e.shopPhone||`01819-397669, 01815-707934`,"set-shop-address":e.shopAddress||`রহমান টাওয়ার, চট্টগ্রাম।`,"set-print-size":e.printSize||`a4`,"set-sms-reminder":e.smsTemplateReminder||`Reminder: Dear [Name] [AccNo], your due is Tk [Due] on [Date]. Kindly clear payment soon. Thanks! - [Shop]`,"set-sms-opening":e.smsTemplateOpening||`Dear [Name] [AccNo], A/C opened at [Shop] on [Date]. Opening Due: Tk [Due]. Thanks!`,"set-sms-new-bill":e.smsTemplateNew||`Dear [Name] [AccNo], Memo #[Memo] of Tk [Bill] created on [Date]. Paid: Tk [Paid], Due: Tk [Due]. Thanks! - [Shop]`,"set-sms-payment":e.smsTemplatePaid||`Dear [Name] [AccNo], Received Tk [Paid] ([Type]) on [Date]. Net Due: Tk [Due]. Thanks! - [Shop]`,"set-sms-api":e.smsApiKey||``,"set-sms-sender":e.smsSenderId||``,"set-admin-pin":e.adminSecurityPin||`1060`};Object.keys(t).forEach(e=>{let n=document.getElementById(e);n&&(n.value=t[e])}),e.shopLogo&&or(e.shopLogo),document.getElementById(`set-sms-auto`)&&(document.getElementById(`set-sms-auto`).checked=e.smsAuto===!0),[[`set-sms-reminder`,`sms-rem-count`],[`set-sms-opening`,`sms-open-count`],[`set-sms-new-bill`,`sms-new-count`],[`set-sms-payment`,`sms-pay-count`]].forEach(([e,t])=>{tr(document.getElementById(e),t)}),dr(),await fr(),hr()}catch(e){console.error(e)}}async function xr(){let e=document.getElementById(`save-settings-btn`);if(!e)return;e.disabled=!0,e.innerHTML=`সেভ হচ্ছে...`;let t=document.getElementById(`set-sms-reminder`)?.value.trim()||``,r=document.getElementById(`set-sms-opening`)?.value.trim()||``,i=document.getElementById(`set-sms-new-bill`)?.value.trim()||``,a=document.getElementById(`set-sms-payment`)?.value.trim()||``,o=(e,t)=>{let n=/[^\x00-\x7F]/.test(e),r=n?70:155;return e.length>r?`${t} (${n?`বাংলা`:`English`}) ${r} ক্যারেক্টারের বেশি হতে পারবে না।`:null},s=o(t,`রিমাইন্ডার`)||o(r,`একাউন্ট খোলা`)||o(i,`নতুন বিল`)||o(a,`পেমেন্ট`);if(s){L.default.fire(`Error`,s,`error`),e.disabled=!1,e.innerHTML=`সকল সেটিংস সেভ করুন`;return}let l=pr(),u={shopName:document.getElementById(`set-shop-name`)?.value.trim()||``,shopOwner:document.getElementById(`set-shop-owner`)?.value.trim()||`Mohammed Amran`,shopPhone:document.getElementById(`set-shop-phone`)?.value.trim()||``,shopAddress:document.getElementById(`set-shop-address`)?.value.trim()||``,printSize:document.getElementById(`set-print-size`)?.value||`a4`,shopLogo:ar(),smsTemplateReminder:t,smsTemplateOpening:r,smsTemplateNew:i,smsTemplatePaid:a,smsApiKey:document.getElementById(`set-sms-api`)?.value.trim()||``,smsSenderId:document.getElementById(`set-sms-sender`)?.value.trim()||``,smsAuto:document.getElementById(`set-sms-auto`)?.checked||!1,adminSecurityPin:document.getElementById(`set-admin-pin`)?.value.trim()||`1060`,securityPolicy:l,updatedAt:n.firestore.FieldValue.serverTimestamp()};try{await c.updateAppSettings(u),P(`UPDATE`,`Settings`,`appSettings`,`App Settings`,{shopName:u.shopName}),L.default.fire({title:`সফল!`,icon:`success`,customClass:{popup:`!bg-slate-900 !text-white`}}),yr(document.getElementById(`view-container`))}catch{L.default.fire(`Error`,`সেভ ব্যর্থ হয়েছে`,`error`)}finally{e.disabled=!1,e.innerHTML=`সকল সেটিংস সেভ করুন`}}async function Sr(){if(!await R(`সিকিউরিটি পিন পরিবর্তন`))return;let{value:e}=await L.default.fire({title:`নতুন মাস্টার পিন দিন`,input:`text`,inputPlaceholder:`e.g. 5678`,showCancelButton:!0,inputValidator:e=>!e||e.trim().length<4?`কমপক্ষে ৪ ডিজিট দিন!`:null});if(e)try{await c.updateAppSettings({adminSecurityPin:e.trim()}),P(`PIN_CHANGE`,`Settings`,`appSettings`,`Admin Master PIN`),document.getElementById(`set-admin-pin`).value=e.trim(),L.default.fire(`সফল!`,`পিন আপডেট করা হয়েছে।`,`success`)}catch{L.default.fire(`Error`,`ব্যর্থ হয়েছেন`,`error`)}}var Cr=null;window.saveSettings=xr,window.changeAdminSecurityPinFlow=Sr,window.togglePinVisibility=async()=>{let e=document.getElementById(`set-admin-pin`),t=document.getElementById(`pin-vis-icon`);e&&(e.type===`password`?await ke()&&(e.type=`text`,t&&(t.className=`fa-solid fa-eye-slash text-amber-400`),Cr&&clearTimeout(Cr),Cr=setTimeout(()=>{e.type=`password`,t&&(t.className=`fa-solid fa-eye text-slate-400`)},5e3)):(e.type=`password`,t&&(t.className=`fa-solid fa-eye text-slate-400`),Cr&&clearTimeout(Cr)))},window.appSettings={exportData:async()=>{await R(`Database Export`)&&window.downloadAdminExcelBackup&&await window.downloadAdminExcelBackup()}},window.appSettings={...rr,...$n,exportData:window.appSettings?.exportData};function wr(e,t,n={},r={}){if(window.AppState?.currentUserRole===`Staff`&&window.AppState?.permissions?.viewStatement===!1){e.innerHTML=`<div class="m3-card text-center font-bn py-12"><h2 class="text-xl font-bold text-red-500">অ্যাক্সেস ডিনাইড! আপনার স্টেটমেন্ট দেখার অনুমতি নেই।</h2></div>`;return}if(!t||!t.customerId){e.innerHTML=`<div class="m3-card text-center font-bn py-12"><h2 class="text-xl font-bold text-red-500">কাস্টমার সিলেক্ট করা হয়নি!</h2></div>`;return}let i=U().find(e=>e.id===t.customerId),a=Number(i?.totalDue||t.totalDue||0);n.currentCustomerInfo={id:t.customerId,name:t.customerName||i?.name||`Customer`,accountNo:t.accountNo||i?.accountNo||``,phone:t.customerPhone||i?.phone||``,address:t.customerAddress||i?.address||``,zone:i?.zone||``,totalDue:a};let o=n.currentCustomerInfo,s=(o.name||`C`).charAt(0).toUpperCase(),c=a>5e4?`<span class="px-2.5 py-0.5 rounded-full bg-red-500/20 text-red-400 border border-red-500/30 text-[10px] font-black uppercase"><i class="fa-solid fa-circle text-[8px] mr-1 animate-pulse"></i>High Due</span>`:a>0?`<span class="px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/30 text-[10px] font-black uppercase">Regular</span>`:`<span class="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-[10px] font-black uppercase">Cleared</span>`;e.innerHTML=`
        <div class="max-w-6xl mx-auto flex flex-col gap-6 pb-24 font-bn">
            <div class="m3-card bg-slate-900/80 border border-slate-800/80 p-4 md:p-5 rounded-2xl shadow-xl flex flex-col md:flex-row items-center justify-between gap-4">
                <div class="flex items-center gap-4 w-full md:w-auto">
                    <div class="w-12 h-12 rounded-2xl bg-gradient-to-tr from-blue-600 to-purple-600 text-white font-black text-xl flex items-center justify-center shadow-lg shadow-blue-500/20 shrink-0">${s}</div>
                    <div>
                        <div class="flex items-center gap-2 flex-wrap">
                            <h1 class="text-xl md:text-2xl font-black text-white tracking-tight">${o.name}</h1>
                            ${o.accountNo?`<span class="px-2 py-0.5 rounded-lg bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-black">#${o.accountNo}</span>`:``}
                            ${c}
                        </div>
                        <div class="flex items-center gap-3 text-xs text-slate-400 font-bold mt-1 flex-wrap">
                            <span><i class="fa-solid fa-phone text-[10px] mr-1 text-slate-500"></i>${o.phone||`-`}</span>
                            <span>•</span><span><i class="fa-solid fa-location-dot text-[10px] mr-1 text-slate-500"></i>${o.address||`-`}</span>
                            ${o.zone?`<span>•</span><span class="text-blue-400 font-black">${o.zone}</span>`:``}
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
                                <th class="w-28">তারিখ</th><th>বিবরণ / মাধ্যম / ভাউচার</th><th class="w-32 text-right">খরচ (Debit ৳)</th><th class="w-32 text-right">জমা (Credit ৳)</th><th class="w-36 text-right">অবশিষ্ট জের (Balance ৳)</th>
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
        </div>`,r.loadStatementData&&r.loadStatementData()}async function Tr(e={}){let t=document.getElementById(`statement-list`),n=document.getElementById(`statement-list-mobile`);if(!t)return;t.innerHTML=`<tr><td colspan="5" class="text-center py-10 text-slate-500 font-bold">লোডিং...</td></tr>`,n&&(n.innerHTML=`<div class="text-center py-6 text-slate-500 font-bold">লোডিং...</div>`);let r=document.getElementById(`stmt-start-date`)?.value||``,i=document.getElementById(`stmt-end-date`)?.value||``,{currentCustomerInfo:o}=e;try{let t=0;if(o&&o.id){let e=U().find(e=>e.id===o.id);if(e!==void 0)t=Number(e.initialDue||0);else{let e=await u.getById(o.id);e&&(t=Number(e.initialDue||0))}}let n=await a.getByCustomer(o?.id);n=n.filter(e=>e.voucherNo!==`OPENING`),n.sort((e,t)=>{let n=new Date(e.date)-new Date(t.date);return n===0?(e.createdAt&&typeof e.createdAt.toMillis==`function`?e.createdAt.toMillis():0)-(t.createdAt&&typeof t.createdAt.toMillis==`function`?t.createdAt.toMillis():0):n});let s=t;if(r){let e=new Date(r);n.forEach(t=>{new Date(t.date)<e&&(s+=(Number(t.bill)||0)-(Number(t.paid)||0))}),n=n.filter(t=>new Date(t.date)>=e)}if(i){let e=new Date(i);n=n.filter(t=>new Date(t.date)<=e)}e.currentStatementData=n,e.currentOpeningBalance=s,Er(s,e)}catch(e){console.error(`Load Statement Error:`,e)}}function Er(e=0,t={}){let n=document.getElementById(`statement-list`),r=document.getElementById(`statement-list-mobile`);if(!n)return;let i=t.currentStatementData||[],a=e,o=0,s=0,c=0,l=``,u=``;l+=`<tr class="bg-slate-800/40 font-bold border-b-2 border-slate-700">
        <td colspan="2" class="text-blue-400 uppercase tracking-widest text-[10px] !py-3 px-4 font-black"><i class="fa-solid fa-flag-checkered mr-2"></i>প্রারম্ভিক ব্যালেন্স (Opening Balance)</td>
        <td class="text-right">-</td><td class="text-right">-</td>
        <td class="text-right font-black ${e>0?`text-red-400`:`text-emerald-400`} bg-white/5 !py-3 px-4">৳ ${v(Math.abs(e))} ${e<0?`(অ্যাড)`:``}</td>
    </tr>`,u+=`<div class="p-3 bg-slate-900 border border-slate-800 rounded-xl flex justify-between items-center text-xs"><span class="text-blue-400 font-bold">প্রারম্ভিক ব্যালেন্স:</span><span class="font-black ${e>0?`text-red-400`:`text-emerald-400`}">৳ ${v(Math.abs(e))}</span></div>`,i.forEach(e=>{let t=Number(e.bill)||0,n=Number(e.paid)||0,r=e.receivedType||``;o+=t,r===`Less`?c+=n:s+=n,a+=t-n;let i=`<span class="text-slate-500 text-xs">-</span>`;n>0&&(i=r===`Less`?`<span class="bg-amber-500/10 text-amber-400 px-2 py-0.5 rounded text-[10px] font-black border border-amber-500/20"><i class="fa-solid fa-hand-holding-heart mr-1"></i>LESS</span>`:`<span class="${r===`Bank`?`text-blue-400`:`text-emerald-400`} text-[10px] font-bold uppercase"><i class="fa-solid ${r===`Bank`?`fa-building-columns`:`fa-money-bill`} mr-1"></i>${r}</span>`);let d=e.voucherNo&&e.voucherNo!==`OPENING`?`<span class="px-1.5 py-0.5 bg-slate-950 rounded text-[9px] text-slate-400 border border-slate-800 font-mono">#${e.voucherNo}</span>`:``,f=e.receivedFrom?`<div class="text-[9px] text-slate-500 mt-0.5">${e.receivedFrom}</div>`:``;l+=`<tr class="hover:bg-white/[0.02] border-b border-slate-800/50">
            <td class="text-slate-400 text-[11px] !py-3 px-4 font-mono font-bold">${E(e.date)}</td>
            <td class="!py-3 px-4"><div class="flex items-center gap-2">${i}${d}</div>${f}</td>
            <td class="text-right text-red-400 font-bold !py-3 px-4">${t>0?`৳`+v(t):`-`}</td>
            <td class="text-right text-emerald-400 font-bold !py-3 px-4">${n>0?`৳`+v(n):`-`}</td>
            <td class="text-right font-black ${a>0?`text-red-400`:`text-emerald-400`} bg-white/[0.01] !py-3 px-4">৳ ${v(Math.abs(a))} ${a<0?`<span class="text-[9px]">(Adv)</span>`:``}</td>
        </tr>`,u+=`<div class="p-3 bg-slate-900/90 border border-slate-800 rounded-xl flex flex-col gap-1.5 text-xs">
            <div class="flex justify-between items-center border-b border-slate-800/60 pb-1"><span class="text-slate-400 font-mono text-[10px]">${E(e.date)} ${d}</span>${i}</div>
            <div class="flex justify-between items-center text-slate-300"><span>খরচ: <strong class="text-red-400">৳${v(t)}</strong></span><span>জমা: <strong class="text-emerald-400">৳${v(n)}</strong></span></div>
            <div class="flex justify-between items-center pt-1 border-t border-slate-800/40"><span class="text-[10px] text-slate-400 font-bold">জের/ব্যালেন্স:</span><span class="font-black ${a>0?`text-red-400`:`text-emerald-400`}">৳ ${v(Math.abs(a))}</span></div>
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
            </div>`),n.innerHTML=l,r&&(r.innerHTML=u);let d=document.getElementById(`stmt-count-badge`);d&&(d.innerText=`${i.length} টি লেনদেন`),document.getElementById(`stmt-total-bill`).innerText=`৳ ${v(o)}`,document.getElementById(`stmt-total-paid`).innerText=`৳ ${v(s)}`,document.getElementById(`stmt-total-less`).innerText=`৳ ${v(c)}`,document.getElementById(`stmt-total-due`).innerText=`৳ ${v(Math.abs(a))} ${a<0?`(অ্যাডভান্স)`:``}`,t.currentFinalBalance=a}function Dr(e,t={}){let n=document.getElementById(`stmt-start-date`),r=document.getElementById(`stmt-end-date`);if(!n||!r)return;let i=new Date;if(e===`today`){let e=_();n.value=e,r.value=e}else if(e===`this_month`)n.value=`${i.getFullYear()}-${String(i.getMonth()+1).padStart(2,`0`)}-01`,r.value=_();else if(e===`last_month`){let e=new Date(i.getFullYear(),i.getMonth()-1,1),t=e.getFullYear(),a=String(e.getMonth()+1).padStart(2,`0`),o=new Date(i.getFullYear(),i.getMonth(),0).getDate();n.value=`${t}-${a}-01`,r.value=`${t}-${a}-${String(o).padStart(2,`0`)}`}t.loadStatementData&&t.loadStatementData()}async function Or(e={},t={}){let{currentCustomerInfo:r}=e,{value:i}=await L.default.fire({title:`<i class="fa-solid fa-credit-card text-blue-400 mr-2"></i>জমা গ্রহণ করুন`,html:`
            <div class="flex flex-col gap-3 text-left font-bn p-2">
                <div class="text-xs text-blue-400 font-bold">কাস্টমার: ${r?.name||`Customer`}</div>
                <div><label class="block text-xs font-bold text-slate-400 mb-1">জমার পরিমাণ (৳)</label><input id="stmt-recv-amt" type="text" class="m3-field text-lg font-black text-emerald-400" placeholder="০.০০"></div>
                <div><label class="block text-xs font-bold text-slate-400 mb-1">পেমেন্ট মাধ্যম</label><select id="stmt-recv-type" class="m3-field"><option value="Cash">Cash (নগদ)</option><option value="Bank">Bank (ব্যাংক/বিকাশ)</option><option value="Less">Less (ছাড়/কমিশন)</option></select></div>
                <div><label class="block text-xs font-bold text-slate-400 mb-1">বিবরণ / ব্যাংক নাম (ঐচ্ছিক)</label><input id="stmt-recv-ref" type="text" class="m3-field" placeholder="মন্তব্য..."></div>
            </div>`,showCancelButton:!0,confirmButtonText:`<i class="fa-solid fa-circle-check mr-2"></i>জমা সেভ করুন`,cancelButtonText:`বাতিল`,customClass:{popup:`!bg-slate-950 !text-white !rounded-3xl border border-slate-800 shadow-2xl font-bn`,confirmButton:`m3-btn-primary !bg-emerald-600 hover:!bg-emerald-500 !px-6 !py-2 rounded-xl font-bold`,cancelButton:`m3-btn-tonal !bg-slate-800 !text-slate-300 !px-5 !py-2 rounded-xl font-bold border border-slate-700`},preConfirm:()=>{let e=y(document.getElementById(`stmt-recv-amt`).value);return!e||e<=0?L.default.showValidationMessage(`সঠিক জমার পরিমাণ লিখুন!`):{amount:e,type:document.getElementById(`stmt-recv-type`).value,ref:document.getElementById(`stmt-recv-ref`).value.trim()}}});if(i)try{let e=h.batch(),o=a.getRef();e.set(o,{customerId:r.id,customerName:r.name,date:_(),voucherNo:``,bill:0,paid:i.amount,receivedType:i.type,receivedFrom:i.ref,createdBy:window.AppState?.currentUserEmail||`Unknown`,createdAt:n.firestore.FieldValue.serverTimestamp()}),e.update(u.getRef(r.id),{totalDue:n.firestore.FieldValue.increment(-i.amount)}),await e.commit(),b(`জমা সফলভাবে সেভ হয়েছে!`,`success`),t.loadStatementData&&t.loadStatementData()}catch{L.default.fire(`Error`,`জমা সেভ করা যায়নি`,`error`)}}async function kr(e={}){let{currentCustomerInfo:t,currentFinalBalance:n}=e,r=t?.phone;if(!r)return L.default.fire(`Error`,`No phone number found for this customer.`,`warning`);let i=n,a=i<0?`advance`:`pending due`,o=v(Math.abs(i)),s=`Dear ${t.name||`Customer`}, Your total ${a} at M/S. Maa Motors is Tk ${o}. Kindly clear payment. Contact: 01819-397669. Thank you! - M/S. Maa Motors`,{value:c}=await L.default.fire({title:`<i class="fa-solid fa-comment-sms text-blue-400 mr-2"></i>Send Reminder SMS`,input:`textarea`,inputValue:s,inputAttributes:{rows:5,class:`m3-field text-xs font-mono`},showCancelButton:!0,confirmButtonText:`<i class="fa-solid fa-paper-plane mr-1.5"></i> Send SMS`,cancelButtonText:`Cancel`,customClass:{popup:`!bg-slate-900 !text-white !rounded-3xl border border-slate-700`}});c&&await window.sendSMS(r,c,!1)&&b(`SMS পাঠানোর চেষ্টা করা হয়েছে!`,`info`)}async function Ar(e={}){let{currentCustomerInfo:t,currentFinalBalance:n}=e,r=t?.phone;if(!r)return L.default.fire({title:`এরর`,text:`কাস্টমারের মোবাইল নম্বর পাওয়া যায়নি!`,icon:`warning`,customClass:{popup:`!bg-slate-900 !text-white !rounded-3xl border border-slate-700`}});let i=n,a=v(Math.abs(i)),o=document.getElementById(`stmt-total-bill`)?.innerText||`৳ 0`,s=document.getElementById(`stmt-total-paid`)?.innerText||`৳ 0`,c=document.getElementById(`stmt-total-less`)?.innerText||`৳ 0`,l=t.accountNo?`#${t.accountNo}`:`-`,u=`${window.location.origin}${window.location.pathname}?view=public-stmt&id=${t.id}`,d=`আসসালামু আলাইকুম ${t.name||`কাস্টমার`},\nমেসার্স মা মোটরস্ থেকে আপনার মোট হিসাবের সামারি:\n\nহিসাব নং: ${l}\nমোট কেনাকাটা/বিল: ${o}\nমোট জমা: ${s}\nমোট ছাড়: ${c}\n---------------------------------\n`;d+=i<0?`অ্যাডভান্স জমা: ৳ ${a}\n\n`:`বর্তমান মোট বকেয়া: ৳ ${a}\n\n*বিশেষ অনুরোধ: আপনার বকেয়া টাকাটি দ্রুত পরিশোধ করার অনুরোধ রইল।*\n\n`,d+=`আপনার সম্পূর্ণ মেমো ও হিসাবের PDF বিবরণী দেখতে নিচের লিংকে ক্লিক করুন:\n${u}\n\nযোগাযোগ: 01819-397669\nধন্যবাদ! — মেসার্স মা মোটরস্`;let{value:f}=await L.default.fire({title:`<div class="flex items-center justify-center gap-2 font-bn font-black text-lg text-emerald-400"><i class="fa-brands fa-whatsapp text-xl"></i><span>Send WhatsApp Reminder</span></div>`,html:`<div class="text-left space-y-1 mb-2 font-bn"><div class="text-xs text-slate-400">Recipient Phone: <strong class="text-white">${r}</strong></div></div>`,input:`textarea`,inputValue:d,inputAttributes:{rows:8,class:`m3-field text-xs font-bn`},showCancelButton:!0,confirmButtonText:`<i class="fa-brands fa-whatsapp mr-1.5"></i> Open WhatsApp`,cancelButtonText:`Cancel`,customClass:{popup:`!bg-slate-950 !text-white !rounded-3xl border border-slate-800 shadow-2xl font-bn`,confirmButton:`m3-btn-primary !bg-emerald-600 hover:!bg-emerald-500 !px-6 !py-2 rounded-xl font-bold`}});f&&window.sendWhatsApp&&window.sendWhatsApp(r,f)}var jr=[],Mr=0,Nr={},Pr=0,Fr={get currentStatementData(){return jr},set currentStatementData(e){jr=e},get currentOpeningBalance(){return Mr},set currentOpeningBalance(e){Mr=e},get currentCustomerInfo(){return Nr},set currentCustomerInfo(e){Nr=e},get currentFinalBalance(){return Pr},set currentFinalBalance(e){Pr=e}};function Ir(e,t){wr(e,t,Fr,{loadStatementData:Lr})}async function Lr(){return Tr(Fr)}function Rr(e){return Dr(e,{loadStatementData:Lr})}async function zr(){return Or(Fr,{loadStatementData:Lr})}async function Br(){return kr(Fr)}async function Vr(){return Ar(Fr)}function Hr(){let e=document.getElementById(`stmt-start-date`),t=document.getElementById(`stmt-end-date`);e&&(e.value=``),t&&(t.value=``),Lr()}function Ur(){document.getElementById(`stmt-filter-grid`)?.classList.toggle(`hidden`)}async function Wr(){let e=document.getElementById(`stmt-custom-note`)?.value||``,{printStatement:t}=await G(async()=>{let{printStatement:e}=await import(`./statement-print-Dn4yWQmb.js`);return{printStatement:e}},__vite__mapDeps([9,1,2,3,4,5,6,7,8]));return await t(Nr,Mr,jr,e)}typeof window<`u`&&(window.clearStatementFilter=Hr,window.toggleStmtFilterCollapse=Ur,window.setStmtPresetDate=Rr,window.quickCollectPaymentFromStmt=zr,window.sendStmtReminderSMS=Br,window.sendStmtReminderWhatsApp=Vr,window.loadStatementData=Lr,window.printStatement=Wr);async function Gr(e,t=!1){try{let r=e.filter(e=>e&&e.name&&e.name.trim()!==``).map(e=>({date:e.date||new Date().toISOString().split(`T`)[0],name:e.name.trim(),phone:e.phone?String(e.phone).trim():``,voucher:e.voucher?String(e.voucher).trim():``,bill:y(e.bill)||0,paid:y(e.paid)||0,receivedType:e.receivedType||`Bank`,receivedFrom:e.receivedFrom||``})).filter(e=>e.bill>0||e.paid>0);if(r.length===0)return L.default.fire({title:`ভ্যালিড ডাটা নেই!`,icon:`warning`,customClass:{popup:`!bg-slate-900 !text-white`}});L.default.fire({title:`সেভ হচ্ছে...`,text:`${r.length} টি এন্ট্রি প্রসেস করা হচ্ছে।`,allowOutsideClick:!1,didOpen:()=>{L.default.showLoading()},customClass:{popup:`!bg-slate-900 !text-white !rounded-3xl border border-slate-700`}});let i=U();i.length||(i=await u.getAll());let o={},s={};i.forEach(e=>{e.name&&(o[e.name.trim().toLowerCase()]={id:e.id,totalDue:Number(e.totalDue)||0,accountNo:e.accountNo||``,isNew:!1}),e.accountNo&&(s[String(e.accountNo).toLowerCase()]={id:e.id,totalDue:Number(e.totalDue)||0,accountNo:e.accountNo||``,isNew:!1})});let l=0,d={...o};r.forEach(e=>{let t=e.name.trim().toLowerCase(),n=e.name.match(/^\[(\d+)\]/),r=n?n[1].toLowerCase():null,i=e.name.replace(/^\[\d+\]\s*/,``).replace(/\s*\(.*\)$/,``).trim().toLowerCase();r&&s[r]||d[i]||d[t]||(d[t]=!0,l++)});let f=c.collection.doc(`counters`),p=0;l>0&&await h.runTransaction(async e=>{let t=await e.get(f),n=t.exists&&t.data().customerAccountNo?parseInt(t.data().customerAccountNo):0;p=n,e.set(f,{customerAccountNo:n+l},{merge:!0})});let m=h.batch(),g=0;for(let e of r){let t=e.name.trim().toLowerCase(),r=``,i=t,c=e.name.match(/^\[(\d+)\]/);if(c){let e=c[1].toLowerCase();s[e]&&(r=s[e].id,i=Object.keys(o).find(e=>o[e].id===r)||t)}if(!r){let n=e.name.replace(/^\[\d+\]\s*/,``).replace(/\s*\(.*\)$/,``).trim().toLowerCase();if(o[n])r=o[n].id,i=n;else if(o[t])r=o[t].id;else{r=u.getRef().id,p++;let n=String(p).padStart(4,`0`);o[t]={id:r,totalDue:0,accountNo:n,isNew:!0,phone:e.phone||``,name:e.name.replace(/^\[\d+\]\s*/,``).replace(/\s*\(.*\)$/,``).trim()},i=t}}let l=o[i]?.totalDue||0,d=e.bill-e.paid,f=l+d;o[i]&&(o[i].totalDue=f);let _=o[i]?.name||e.name.replace(/^\[\d+\]\s*/,``).replace(/\s*\(.*\)$/,``).trim(),v=a.getRef();m.set(v,{customerId:r,customerName:_,date:e.date,voucherNo:e.voucher,bill:e.bill,paid:e.paid,receivedType:e.paid>0?e.receivedType||`Bank`:``,receivedFrom:e.paid>0&&e.receivedFrom||``,prevDue:l,currentDue:f,createdBy:window.AppState?.currentUserEmail||`Unknown`,createdAt:n.firestore.FieldValue.serverTimestamp()}),g++;let y=u.getRef(r);o[i]?.isNew?(m.set(y,{name:_,phone:o[i].phone||``,address:`Bulk Import`,accountNo:o[i].accountNo,totalDue:f,initialDue:0,createdAt:n.firestore.FieldValue.serverTimestamp()}),P(`CREATE`,`Customers`,r,_,{source:`Bulk Entry`}),o[i].isNew=!1,g++):(m.update(y,{totalDue:n.firestore.FieldValue.increment(d)}),g++),g>=400&&(await m.commit(),m=h.batch(),g=0)}if(g>0&&await m.commit(),L.default.fire({title:`সফল!`,text:`সফলভাবে ${r.length} টি ডাটা সেভ হয়েছে!`,icon:`success`}),t){let e=document.getElementById(`excel-file`);e&&(e.value=``);let t=document.getElementById(`process-excel-btn`);t&&(t.disabled=!1,t.innerHTML=`<i class="fa-solid fa-upload"></i> ফাইল আপলোড ও সেভ করুন`)}else typeof window.switchBulkTab==`function`&&window.switchBulkTab(`spreadsheet`)}catch(e){console.error(`Bulk save error:`,e),L.default.fire(`Error!`,`ডাটা সেভ করতে সমস্যা হয়েছে। দয়া করে আবার চেষ্টা করুন।`,`error`)}finally{if(t){let e=document.getElementById(`process-excel-btn`);e&&(e.disabled=!1,e.innerHTML=`<i class="fa-solid fa-upload"></i> ফাইল আপলোড ও সেভ করুন`)}}}function Kr(){let e=document.getElementById(`spreadsheet-body`);if(!e)return;let t=document.createElement(`tr`),n=localStorage.getItem(`workingDate`);(!n||!/^\d{4}-\d{2}-\d{2}$/.test(n))&&(n=window.getTodayLocalDateString?window.getTodayLocalDateString():new Date().toISOString().split(`T`)[0]);let r=e.children.length+1;t.innerHTML=`
        <td class="!px-1 !py-1 border-b border-slate-800/50">
            <input type="text" class="grid-input m3-field !bg-slate-900/50 !py-1.5 !px-2 text-xs datepicker" value="${n}" onchange="if(this.value) localStorage.setItem('workingDate', this.value)">
        </td>
        <td class="!px-1 !py-1 border-b border-slate-800/50"><input type="text" list="customer-datalist" class="grid-input m3-field !bg-slate-900/50 !py-1.5 !px-2 text-xs" placeholder="নাম / অ্যাকাউন্ট নং / ফোন"></td>
        <td class="!px-1 !py-1 border-b border-slate-800/50"><input type="text" class="grid-input m3-field !bg-slate-900/50 !py-1.5 !px-2 text-xs" placeholder="ভাউচার"></td>
        <td class="!px-1 !py-1 border-b border-slate-800/50">
            <input type="text" class="grid-input m3-field !bg-slate-900/50 !py-1.5 !px-2 text-xs font-bold text-red-400" placeholder="0" oninput="handleNumberInput(this); window.updateLiveWords(this, 'grid-b-words-${r}')">
            <div id="grid-b-words-${r}" class="text-[10px] font-black text-red-400 mt-1 px-1.5 py-0.5 rounded bg-red-500/10 border border-red-500/20 truncate hidden italic"></div>
        </td>
        <td class="!px-1 !py-1 border-b border-slate-800/50">
            <input type="text" class="grid-input m3-field !bg-slate-900/50 !py-1.5 !px-2 text-xs font-bold text-emerald-400" placeholder="0" oninput="handleNumberInput(this); window.updateLiveWords(this, 'grid-p-words-${r}')">
            <div id="grid-p-words-${r}" class="text-[10px] font-black text-emerald-400 mt-1 px-1.5 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/20 truncate hidden italic"></div>
        </td>
        <td class="!px-1 !py-1 border-b border-slate-800/50">
            <select class="grid-input m3-field !bg-slate-900 !py-1.5 !px-1 text-xs text-blue-400 font-bold cursor-pointer">
                <option value="Bank" class="!bg-slate-900 !text-white font-bold py-2">Bank</option>
                <option value="Cash" class="!bg-slate-900 !text-white font-bold py-2">Cash</option>
            </select>
        </td>
        <td class="!px-1 !py-1 border-b border-slate-800/50"><input type="text" class="grid-input m3-field !bg-slate-900/50 !py-1.5 !px-2 text-xs" placeholder="ব্যাংকের নাম / নাম" onkeydown="window.handleGridKey(event, this)"></td>
    `,e.appendChild(t),e.children.length>1&&t.children[1].querySelector(`input`)?.focus()}function qr(e,t){if(e.key===`Enter`||e.key===`Tab`){e.preventDefault();let n=t.closest(`tr`)?.querySelector(`input.datepicker`)?.value;n&&localStorage.setItem(`workingDate`,n),Kr()}}async function Jr(){let e=document.getElementById(`spreadsheet-body`).querySelectorAll(`tr`),t=[];if(e.forEach(e=>{let n=e.querySelectorAll(`input, select`),r=n[0].value,i=n[1].value.trim(),a=i,o=``;if(i.startsWith(`[`)){let e=i.match(/^\[.*?\]\s*([^(]+)/);e&&(a=e[1].trim());let t=i.match(/\(([^)]+)\)/);t&&(o=t[1].trim())}let s=n[2].value.trim(),c=y(n[3].value),l=y(n[4].value),u=n[5].value||`Bank`,d=n[6].value.trim();a&&(c>0||l>0)&&t.push({date:r,name:a,phone:o,voucher:s,bill:c,paid:l,receivedType:u,receivedFrom:d})}),t.length===0){L.default.fire(`খালি ফর্ম`,`সেভ করার মতো কোনো ডাটা পাওয়া যায়নি।`,`warning`);return}let n=document.getElementById(`save-spreadsheet-btn`);n&&(n.disabled=!0,n.innerHTML=`<i class="fa-solid fa-spinner fa-spin mr-2"></i>সেভ হচ্ছে...`);try{await Gr(t)}catch(e){console.error(`saveSpreadsheetData error:`,e)}finally{n&&(n.disabled=!1,n.innerHTML=`<i class="fa-solid fa-cloud-arrow-up mr-2"></i> সব সেভ করুন`)}}async function Yr(){if(window.AppState?.currentUserRole!==`Admin`)return L.default.fire(`অ্যাক্সেস ডিনাইড!`,`শুধুমাত্র অ্যাডমিন এক্সেল ডাটা ব্যাকআপ করতে পারবেন।`,`error`);if(await R(`এক্সেল ডাটা ব্যাকআপ ও টেমপ্লেট ডাউনলোড`))try{L.default.fire({title:`স্মার্ট এক্সেল জেনারেট হচ্ছে...`,text:`ডাটা প্রসেস করা হচ্ছে, অনুগ্রহ করে অপেক্ষা করুন`,allowOutsideClick:!1,didOpen:()=>L.default.showLoading(),customClass:{popup:`!bg-slate-900 !text-white !rounded-3xl border border-slate-700`}}),W();let e=U(),t=await a.getAll();t.sort((e,t)=>{let n=new Date(e.date||0),r=new Date(t.date||0);return n-r===0?(e.createdAt?.toMillis()||0)-(t.createdAt?.toMillis()||0):n-r});let[n,r,i]=_().split(`-`),o=`${i}/${r}/${n}`,s=[[`মা মোটরস ইআরপি — কাস্টমার হিসেব ও বর্তমান মোট জের`,``,``,``,`তারিখ: ${o}`],[`অ্যাকাউন্ট নং`,`কাস্টমারের নাম`,`মোবাইল নম্বর`,`ঠিকানা`,`বর্তমান মোট বকেয়া (৳)`]];e.forEach(e=>s.push([e.accountNo||``,e.name||``,e.phone||``,e.address||``,Number(e.totalDue)||0]));let c=s.length;s.push([`মোট হিসাব`,`মোট কাস্টমার: ${e.length} জন`,``,`মার্কেটে মোট বকেয়া (৳):`,{f:`SUM(E3:E${c})`}]);let l=A.aoa_to_sheet(s),u=[[`মা মোটরস ইআরপি — সকল লেনদেন ও রশিদ বই এন্ট্রি শিট`,``,``,``,``,``,``,``,`ডাউনলোড: ${o}`],[`তারিখ (DD/MM/YYYY)`,`কাস্টমারের নাম / আইডি`,`মোবাইল`,`ভাউচার নং`,`বিল (Debit)`,`জমা (Credit)`,`ব্যালেন্স`,`মাধ্যম (Bank/Cash)`,`ব্যাংক/বিবরণ`]];t.forEach((t,n)=>{let r=n+3,i=t.date;if(t.date&&/^\d{4}-\d{2}-\d{2}$/.test(t.date)){let[e,n,r]=t.date.split(`-`);i=`${r}/${n}/${e}`}let a=e.find(e=>e.id===t.customerId),o=a?`[${a.accountNo}] ${a.name}`:t.customerName;u.push([i,o,a?.phone||``,t.voucherNo||``,Number(t.bill)||0,Number(t.paid)||0,{f:`E${r}-F${r}`},t.receivedType||(t.paid>0?`Bank`:``),t.receivedFrom||``])});let d=u.length+1;for(let e=0;e<30;e++){let t=d+e;u.push([``,``,``,``,``,``,{f:`IF(AND(E${t}="",F${t}=""),"",E${t}-F${t})`},`Bank`,``])}let f=u.length+1;u.push([`সর্বমোট হিসাব`,``,``,`মোট লেনদেন: ${t.length}`,{f:`SUM(E3:E${f-1})`},{f:`SUM(F3:F${f-1})`},{f:`E${f}-F${f}`},``,``]);let p=A.aoa_to_sheet(u),m=Math.max(c,3);p[`!dataValidation`]=[{sqref:`H3:H${f-1}`,type:`list`,operator:`equal`,formula1:`"Bank,Cash"`,showErrorMessage:!0},{sqref:`B3:B${f-1}`,type:`list`,operator:`equal`,formula1:`'কাস্টমার তালিকা ও বর্তমান জের'!$B$3:$B$${m}`}],l[`!cols`]=[{wch:15},{wch:25},{wch:18},{wch:30},{wch:24}],p[`!cols`]=[{wch:18},{wch:32},{wch:16},{wch:14},{wch:18},{wch:18},{wch:20},{wch:20},{wch:35}];let h=A.book_new();A.book_append_sheet(h,l,`কাস্টমার তালিকা ও বর্তমান জের`),A.book_append_sheet(h,p,`খতিয়ান ও নতুন লেনদেন এন্ট্রি`);let g=`Maa_Motors_Smart_Backup_${i}-${r}-${n}.xlsx`;te(h,g),L.default.fire({title:`সফল!`,text:`ব্যাকআপ ফাইলটি ডাউনলোড হয়েছে।`,icon:`success`})}catch(e){console.error(e),L.default.fire(`এরর!`,`এক্সেল তৈরি করতে সমস্যা হয়েছে।`,`error`)}}async function Xr(e,t){L.default.fire({title:`ডাটা সেভ হচ্ছে...`,text:`কাস্টমার ও খতিয়ান ডাটাবেসে আপডেট করা হচ্ছে`,allowOutsideClick:!1,didOpen:()=>L.default.showLoading(),customClass:{popup:`!bg-slate-900 !text-white !rounded-3xl border border-slate-700`}});try{let r=await p.getAllZones(),i={};r.forEach(e=>i[e.name]=e);let o={};if(t.size>0){let e=Array.from(t);await h.runTransaction(async t=>{let r=await t.get(c.collection.doc(`counters`)),a=r.exists&&r.data().zoneCounters?r.data().zoneCounters:{};for(let r of e){let e=`General`;if(!i[e]){let r=p.getRef();t.set(r,{name:e,code:`10`,createdAt:n.firestore.FieldValue.serverTimestamp()}),i[e]={name:e,code:`10`}}let s=i[e],c=(a[e]||0)+1;a[e]=c;let l=s.code+String(c).padStart(4,`0`),d=u.getRef();t.set(d,{name:r,phone:``,address:``,zone:e,accountNo:l,totalDue:0,createdAt:n.firestore.FieldValue.serverTimestamp()}),o[r]={id:d.id,accountNo:l}}t.set(c.collection.doc(`counters`),{zoneCounters:a},{merge:!0})})}let s={};for(let t of e){let e=t.matchedCustId||o[t.customerName]?.id;e&&(s[e]||(s[e]=[]),s[e].push(t))}let l=Object.keys(s),d=h.batch(),f=0;for(let e of l){let t=u.getRef(e),r=await t.get(),i=r.exists&&r.data().totalDue||0,o=s[e];for(let t of o){let r=i;i=r+t.bill-t.paid;let o=a.getRef();d.set(o,{customerId:e,customerName:t.customerName,date:t.date,voucherNo:t.voucher,bill:t.bill,paid:t.paid,receivedType:t.receivedType,receivedFrom:t.receivedFrom,prevDue:r,currentDue:i,createdBy:n.auth().currentUser?.email||`Admin Excel Import`,createdAt:n.firestore.FieldValue.serverTimestamp()}),f++,f>=490&&(await d.commit(),d=h.batch(),f=0)}d.update(t,{totalDue:i}),f++,f>=490&&(await d.commit(),d=h.batch(),f=0)}return f>0&&await d.commit(),!0}catch(e){throw console.error(`Sync Engine Error:`,e),e}}async function Zr(e){if(window.AppState?.currentUserRole!==`Admin`)return L.default.fire(`অ্যাক্সেস ডিনাইড!`,`শুধুমাত্র অ্যাডমিন এক্সেল ফাইল আপলোড করতে পারবেন।`,`error`);let t=e?.files?.[0];if(t){if(!await R(`এক্সেল ডাটা ইমপোর্ট`)){e.value=``;return}try{L.default.fire({title:`এক্সেল রিড করা হচ্ছে...`,allowOutsideClick:!1,didOpen:()=>L.default.showLoading(),customClass:{popup:`!bg-slate-900 !text-white`}});let n=await t.arrayBuffer(),r=j(n,{type:`array`}),i=r.SheetNames.find(e=>e.includes(`এন্ট্রি`)||e.includes(`Template`))||r.SheetNames[0],a=A.sheet_to_json(r.Sheets[i],{defval:``});if(!a.length)return e.value=``,L.default.fire(`খালি ফাইল`,`কোনো ডাটা পাওয়া যায়নি।`,`warning`);W();let o=U(),s=[],c=new Set,l=0,u=0,d=0;a.forEach(e=>{let t=Object.keys(e),n=e=>t.find(t=>e.some(e=>t.toLowerCase().includes(e))),r=String(e[n([`তারিখ`,`date`])]||``).trim(),i=String(e[n([`কাস্টমার`,`name`])]||``).trim(),a=String(e[n([`মোবাইল`,`phone`])]||``).trim(),f=String(e[n([`ভাউচার`,`voucher`])]||``).trim(),p=y(e[n([`বিল`,`debit`,`bill`])]),m=y(e[n([`জমা`,`credit`,`paid`])]),h=String(e[n([`মাধ্যম`,`type`])]||`Bank`).trim(),g=String(e[n([`ব্যাংক`,`বিবরণ`,`details`])]||``).trim();if(!i||i.includes(`নমুনা`)||p===0&&m===0)return;let v=_();if(/^\d{2}\/\d{2}\/\d{4}$/.test(r)){let[e,t,n]=r.split(`/`);v=`${n}-${t}-${e}`}else if(/^\d{4}-\d{2}-\d{2}$/.test(r))v=r;else if(r&&!isNaN(r)){let e=new Date(Math.round((parseFloat(r)-25569)*86400*1e3));isNaN(e.getTime())||(v=e.toISOString().split(`T`)[0])}let b=i,x=null;if(i.startsWith(`[`)){let e=i.match(/^\[(.*?)\]/);e&&(x=e[1].trim()),b=i.replace(/^\[.*?\]\s*/,``).trim()}b=b.replace(/\s*\([^)]*\)\s*$/,``).trim();let S=null;if(x&&(S=o.find(e=>String(e.accountNo).trim()===x)),!S&&a){let e=a.replace(/\D/g,``);S=o.find(t=>String(t.phone).replace(/\D/g,``)===e)}!S&&b&&(S=o.find(e=>(e.name||``).toLowerCase().trim()===b.toLowerCase())),S?d++:c.add(b),l+=p,u+=m,s.push({date:v,customerName:b,matchedCustId:S?.id||null,phone:a,voucher:f,bill:p,paid:m,receivedType:h.toLowerCase().includes(`cash`)?`Cash`:`Bank`,receivedFrom:g})}),(await L.default.fire({title:`<div class="flex items-center justify-center gap-2 font-bn text-white"><i class="fa-solid fa-file-excel text-emerald-400"></i><span>এক্সেল সিঙ্ক প্রিভিউ</span></div>`,html:`
                <div class="text-left font-bn space-y-3 bg-slate-900 p-4 rounded-2xl border border-slate-800 text-sm">
                    <div class="flex justify-between border-b border-slate-800 pb-2"><span class="text-slate-400">লেনদেন:</span><strong class="text-white">${s.length} টি</strong></div>
                    <div class="flex justify-between border-b border-slate-800 pb-2"><span class="text-slate-400">পুরাতন কাস্টমার:</span><strong class="text-emerald-400">${d} জন</strong></div>
                    <div class="flex justify-between border-b border-slate-800 pb-2"><span class="text-slate-400">নতুন কাস্টমার:</span><strong class="text-blue-400">${c.size} জন</strong></div>
                    <div class="flex justify-between border-b border-slate-800 pb-2"><span class="text-slate-400">মোট বিল:</span><strong class="text-red-400">৳ ${v(l)}</strong></div>
                    <div class="flex justify-between"><span class="text-slate-400">মোট জমা:</span><strong class="text-emerald-400">৳ ${v(u)}</strong></div>
                </div>`,showCancelButton:!0,confirmButtonText:`হ্যাঁ, সিঙ্ক করুন`})).isConfirmed&&(await Xr(s,c),L.default.fire(`সাফল্য!`,`সিঙ্ক সম্পন্ন হয়েছে।`,`success`)),e.value=``}catch(t){z(t,`এক্সেল ফাইল প্রসেস করতে ব্যর্থ`),e.value=``}}}window.downloadAdminExcelBackup=Yr,window.uploadAdminExcelBackup=Zr;function Qr(e){if(window.AppState?.currentUserRole===`Staff`&&window.AppState?.permissions?.viewBulkEntry===!1){e.innerHTML=`<div class="m3-card text-center font-bn py-12"><h2 class="text-xl font-black text-red-500">অ্যাক্সেস ডিনাইড!</h2></div>`;return}e.innerHTML=`
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
    `,ei(),$r(`spreadsheet`)}function $r(e){let t=document.getElementById(`bulk-content-area`),n={spreadsheet:document.getElementById(`tab-spreadsheet`),excel:document.getElementById(`tab-excel`),"admin-excel":document.getElementById(`tab-admin-excel`)};Object.keys(n).forEach(t=>{n[t]&&(t===e?n[t].className=t===`admin-excel`?`px-6 py-2 text-sm font-semibold rounded-lg bg-emerald-600 text-white shadow-md`:`px-6 py-2 text-sm font-semibold rounded-lg bg-blue-600 text-white shadow-md`:n[t].className=t===`admin-excel`?`px-6 py-2 text-sm font-semibold rounded-lg text-emerald-400 border border-emerald-500/30 bg-emerald-500/10`:`px-6 py-2 text-sm font-semibold rounded-lg text-slate-400 hover:text-white`)}),e===`spreadsheet`?(t.innerHTML=`
            <p class="text-[11px] text-slate-500 mb-4 flex items-center gap-2 px-2 uppercase font-bold font-bn">
                <i class="fa-solid fa-info-circle text-blue-500"></i> কীবোর্ড দিয়ে দ্রুত টাইপ করুন। শেষ ঘরে 'Enter' বা 'Tab' চাপলে নতুন লাইন তৈরি হবে।
            </p>
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
        `,Kr()):t.innerHTML=e===`admin-excel`?`
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
            </div>`}async function ei(){try{let e=U();e.length||(W(),e=await u.getAll());let t=document.getElementById(`customer-datalist`);t||(t=document.createElement(`datalist`),t.id=`customer-datalist`,document.body.appendChild(t)),t.innerHTML=e.map(e=>{let t=e.accountNo?`[${e.accountNo}] `:``;return`<option value="${t}${e.name}${e.phone?` (`+e.phone+`)`:``}">${t}${e.name}</option>`}).join(``)}catch(e){console.error(e)}}window.switchBulkTab=$r,window.loadCustomerDatalist=ei;async function ti(){let e=document.getElementById(`excel-file`);if(!e||!e.files.length){L.default.fire(`ফাইল নেই`,`দয়া করে একটি এক্সেল ফাইল সিলেক্ট করুন।`,`warning`);return}let t=e.files[0],n=new FileReader,r=document.getElementById(`process-excel-btn`);r&&(r.disabled=!0,r.innerHTML=`ফাইল পড়া হচ্ছে...`),n.onload=async e=>{try{let t=new Uint8Array(e.target.result),n=window.XLSX.read(t,{type:`array`}),i=n.SheetNames[0],a=n.Sheets[i],o=window.XLSX.utils.sheet_to_json(a,{header:1});if(o.length<=1)throw Error(`ফাইলটি খালি বা ডাটা নেই!`);let s=window.getTodayLocalDateString?window.getTodayLocalDateString():new Date().toISOString().split(`T`)[0],c=[];for(let e=1;e<o.length;e++){let t=o[e];if(!t||t.length===0)continue;let n=s,r=t[0];if(r)if(typeof r==`number`)n=new Date(Math.round((r-25569)*86400*1e3)).toISOString().split(`T`)[0];else{let e=new Date(r);isNaN(e)||(n=e.toISOString().split(`T`)[0])}let i=String(t[1]||``).trim(),a=String(t[2]||``).trim(),l=String(t[3]||``).trim(),u=parseFloat(t[4])||0,d=parseFloat(t[5])||0,f=String(t[6]||`Bank`).trim(),p=String(t[7]||``).trim();i&&(u>0||d>0)&&c.push({date:n,name:i,phone:a,voucher:l,bill:u,paid:d,receivedType:f,receivedFrom:p})}if(!c.length){L.default.fire(`ডাটা নেই`,`ভ্যালিড কোনো ডাটা পাওয়া যায়নি।`,`warning`),r&&(r.disabled=!1,r.innerHTML=`ফাইল আপলোড ও সেভ করুন`);return}await Gr(c,!0)}catch(e){console.error(e),L.default.fire(`Error`,`ফাইল প্রসেস করতে সমস্যা হয়েছে।`,`error`),r&&(r.disabled=!1,r.innerHTML=`ফাইল আপলোড ও সেভ করুন`)}},n.readAsArrayBuffer(t)}window.switchBulkTab=$r,window.loadCustomerDatalist=ei,window.addSpreadsheetRow=Kr,window.handleGridKey=qr,window.saveSpreadsheetData=Jr,window.processExcelUpload=ti,window.executeBulkSave=Jr;var ni=null;function ri(){try{ni&&ni();let e=document.getElementById(`admin-users-list`);if(!e)return;ni=d.listenAll(t=>{t.sort((e,t)=>{if(e.status===`pending`&&t.status!==`pending`)return-1;if(e.status!==`pending`&&t.status===`pending`)return 1;let n=e.createdAt?e.createdAt.toMillis():0;return(t.createdAt?t.createdAt.toMillis():0)-n});let r=document.getElementById(`stat-total-users`),i=document.getElementById(`stat-active-users`),a=document.getElementById(`stat-pending-users`),o=document.getElementById(`stat-blocked-users`),s=t.filter(e=>e.status===`approved`).length,c=t.filter(e=>e.status===`pending`).length,l=t.filter(e=>e.status===`blocked`||e.status===`revoked`).length;r&&(r.textContent=t.length),i&&(i.textContent=s),a&&(a.textContent=c),o&&(o.textContent=l);let u=`<div class="grid grid-cols-1 gap-3">`;t.forEach(e=>{let t=e.id,r=t===n.auth().currentUser?.uid,i=e.status===`pending`,a=e.status===`blocked`||e.status===`revoked`,o=e.email||t,s=(o.charAt(0)||`?`).toUpperCase(),c=`N/A`;if(e.lastLogin){let t=e.lastLogin.toDate();c=t.toLocaleDateString(`en-GB`)+` `+t.toLocaleTimeString([],{hour:`2-digit`,minute:`2-digit`})}let l=i?`bg-amber-500/15 border-amber-500/30 text-amber-400`:a?`bg-red-500/15 border-red-500/30 text-red-400`:r?`bg-indigo-500/15 border-indigo-500/30 text-indigo-400`:`bg-slate-700/50 border-slate-600/30 text-slate-300`,d=i?`<span class="text-[9px] bg-amber-500/20 border border-amber-500/30 text-amber-400 px-2 py-0.5 rounded-full font-black uppercase animate-pulse">Pending</span>`:a?`<span class="text-[9px] bg-red-500/20 border border-red-500/30 text-red-400 px-2 py-0.5 rounded-full font-black uppercase">Blocked</span>`:`<span class="text-[9px] bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 px-2 py-0.5 rounded-full font-black uppercase">Active</span>`,f=e.role===`Admin`?`<span class="text-[9px] bg-indigo-500/20 border border-indigo-500/30 text-indigo-400 px-2 py-0.5 rounded-full font-black uppercase">Admin</span>`:`<span class="text-[9px] bg-slate-600/30 border border-slate-500/30 text-slate-300 px-2 py-0.5 rounded-full font-black uppercase">Staff</span>`,p=i?`border-amber-500/30 bg-amber-500/[0.03]`:a?`border-red-500/20 bg-red-500/[0.02]`:`border-slate-800/60 hover:border-indigo-500/20`,m=``;r||(m=i?`
                            <button class="h-8 px-3 rounded-lg bg-emerald-600/15 border border-emerald-500/25 hover:bg-emerald-600 text-emerald-400 hover:text-white text-[11px] font-bold transition-all cursor-pointer active:scale-95 flex items-center gap-1" onclick="appAdmin.approveStaff('${t}', '${o}')"><i class="fa-solid fa-check text-[10px]"></i>অনুমোদন</button>
                            <button class="h-8 px-3 rounded-lg bg-red-500/10 border border-red-500/25 hover:bg-red-600 text-red-400 hover:text-white text-[11px] font-bold transition-all cursor-pointer active:scale-95 flex items-center gap-1" onclick="appAdmin.deleteUserAccount('${t}', '${o}')"><i class="fa-solid fa-trash text-[10px]"></i>বাতিল</button>`:e.role===`Staff`?`
                            <button class="h-8 w-8 rounded-lg bg-indigo-500/10 border border-indigo-500/20 hover:bg-indigo-600 text-indigo-400 hover:text-white text-xs transition-all cursor-pointer active:scale-95 flex items-center justify-center" onclick="appAdmin.managePermissions('${t}', '${o}')" title="পারমিশন"><i class="fa-solid fa-shield-halved"></i></button>
                            <button class="h-8 w-8 rounded-lg bg-slate-700/50 border border-slate-600/30 hover:bg-blue-600 text-slate-300 hover:text-white text-xs transition-all cursor-pointer active:scale-95 flex items-center justify-center" onclick="appAdmin.changeStaffPin('${t}', '${e.pin||``}')" title="Change PIN"><i class="fa-solid fa-key"></i></button>
                            <button class="h-8 w-8 rounded-lg bg-amber-500/10 border border-amber-500/20 hover:bg-amber-600 text-amber-400 hover:text-white text-xs transition-all cursor-pointer active:scale-95 flex items-center justify-center" onclick="appAdmin.revokeStaff('${t}')" title="Block"><i class="fa-solid fa-ban"></i></button>
                            <button class="h-8 w-8 rounded-lg bg-red-500/10 border border-red-500/20 hover:bg-red-600 text-red-400 hover:text-white text-xs transition-all cursor-pointer active:scale-95 flex items-center justify-center" onclick="appAdmin.deleteUserAccount('${t}', '${o}')" title="ডিলেট"><i class="fa-solid fa-trash"></i></button>`:`
                            <button class="h-8 w-8 rounded-lg bg-red-500/10 border border-red-500/20 hover:bg-red-600 text-red-400 hover:text-white text-xs transition-all cursor-pointer active:scale-95 flex items-center justify-center" onclick="appAdmin.deleteUserAccount('${t}', '${o}')" title="ডিলেট"><i class="fa-solid fa-trash"></i></button>`);let h=!r&&!i?`<select id="role-${t}" class="h-7 px-2 rounded-lg bg-slate-950/80 border border-slate-700/60 text-xs text-white font-bold outline-none cursor-pointer" onchange="appAdmin.updateUserRole('${t}')">
                        <option value="Admin" ${e.role===`Admin`?`selected`:``}>Admin</option>
                        <option value="Staff" ${e.role===`Staff`?`selected`:``}>Staff</option>
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
                                    ${h}
                                </div>
                            </div>
                            <!-- Actions -->
                            <div class="flex items-center gap-1.5 shrink-0 flex-wrap justify-end">${m||`<span class="text-[10px] text-slate-500 font-bold italic">Locked</span>`}</div>
                        </div>
                    </div>`}),u+=`</div>`,e.innerHTML=u||`<div class="text-center py-8 text-slate-500 font-bold italic text-sm">কোনো অ্যাকাউন্ট পাওয়া যায়নি</div>`})}catch(e){console.error(`Error loading users:`,e)}}function ii(e){if(window.AppState.currentUserRole!==`Admin`){e.innerHTML=`<div class="m3-card text-center font-bn"><h2 class="text-xl font-bold text-red-500">অ্যাক্সেস ডিনাইড! শুধুমাত্র অ্যাডমিন এই পেজ দেখতে পারবেন।</h2></div>`;return}e.innerHTML=`
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
                            <div>
                                <h4 class="text-white font-bold text-sm">অটো-সিঙ্ক জোন কাউন্টার</h4>
                                <p class="text-[10px] text-slate-500">বর্তমান সক্রিয় কাস্টমার স্ক্যান করে পরবর্তী নতুন সিরিয়াল অটো-রিসেট।</p>
                            </div>
                        </div>
                        <button class="h-9 w-full rounded-xl bg-emerald-600/15 border border-emerald-500/25 hover:bg-emerald-600 text-emerald-400 hover:text-white text-xs font-bold transition-all cursor-pointer active:scale-95" onclick="appAdmin.autoSyncZoneCounters()">
                            <i class="fa-solid fa-rotate mr-1.5"></i>১-ক্লিকে কাউন্টার সিঙ্ক
                        </button>
                    </div>

                    <div class="group rounded-xl bg-slate-950/50 border border-slate-800/60 hover:border-purple-500/30 p-4 transition-all flex flex-col gap-3">
                        <div class="flex items-center gap-3">
                            <div class="w-9 h-9 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400 shrink-0"><i class="fa-solid fa-arrow-down-1-9 text-sm"></i></div>
                            <div>
                                <h4 class="text-white font-bold text-sm">সিরিয়াল ক্রমানুসারে সাজান</h4>
                                <p class="text-[10px] text-slate-500">ডিলেট হওয়ার গ্যাপ মুছে কাস্টমারদের ১, ২, ৩, ৪ ক্রমানুসারে সাজান।</p>
                            </div>
                        </div>
                        <button class="h-9 w-full rounded-xl bg-purple-600/15 border border-purple-500/25 hover:bg-purple-600 text-purple-400 hover:text-white text-xs font-bold transition-all cursor-pointer active:scale-95" onclick="appAdmin.resequenceZoneAccountNumbers()">
                            <i class="fa-solid fa-arrow-down-1-9 mr-1.5"></i>সিরিয়াল পুনঃসাজান
                        </button>
                    </div>

                    <div class="group rounded-xl bg-slate-950/50 border border-slate-800/60 hover:border-blue-500/30 p-4 transition-all flex flex-col gap-3">
                        <div class="flex items-center gap-3">
                            <div class="w-9 h-9 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 shrink-0"><i class="fa-solid fa-list-ol text-sm"></i></div>
                            <div>
                                <h4 class="text-white font-bold text-sm">ম্যানুয়াল সিরিয়াল কাউন্টার</h4>
                                <p class="text-[10px] text-slate-500">নির্দিষ্ট জোনের সিরিয়াল পরবর্তী নম্বর কাস্টম সেট করুন।</p>
                            </div>
                        </div>
                        <button class="h-9 w-full rounded-xl bg-blue-600/15 border border-blue-500/25 hover:bg-blue-600 text-blue-400 hover:text-white text-xs font-bold transition-all cursor-pointer active:scale-95" onclick="appAdmin.setNextAccountNo()">
                            <i class="fa-solid fa-list-ol mr-1.5"></i>সিরিয়াল কাস্টম সেট
                        </button>
                    </div>

                    <div class="group rounded-xl bg-slate-950/50 border border-slate-800/60 hover:border-amber-500/30 p-4 transition-all flex flex-col gap-3">
                        <div class="flex items-center gap-3">
                            <div class="w-9 h-9 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 shrink-0"><i class="fa-solid fa-user-pen text-sm"></i></div>
                            <div>
                                <h4 class="text-white font-bold text-sm">কাস্টমার আইডি ম্যানুয়াল এডিট</h4>
                                <p class="text-[10px] text-slate-500">নির্দিষ্ট ১টি কাস্টমারের অ্যাকাউন্ট নম্বর পরিবর্তন।</p>
                            </div>
                        </div>
                        <button class="h-9 w-full rounded-xl bg-amber-600/15 border border-amber-500/25 hover:bg-amber-600 text-amber-400 hover:text-white text-xs font-bold transition-all cursor-pointer active:scale-95" onclick="appAdmin.showIndividualFixer()">
                            <i class="fa-solid fa-user-pen mr-1.5"></i>আইডি এডিট
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
                            <div>
                                <h4 class="text-white font-bold text-sm">ব্যাকআপ ডাউনলোড</h4>
                                <p class="text-[10px] text-slate-500">সব কাস্টমারের বকেয়া জের সহ এক্সেল ডাউনলোড।</p>
                            </div>
                        </div>
                        <button class="h-9 w-full rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-all cursor-pointer active:scale-95 shadow-md shadow-emerald-600/20" onclick="downloadAdminExcelBackup()">
                            <i class="fa-solid fa-file-arrow-down mr-1.5"></i>এক্সেল ডাউনলোড
                        </button>
                    </div>
                    <div class="group rounded-xl bg-slate-950/50 border border-slate-800/60 hover:border-blue-500/30 p-4 transition-all flex flex-col gap-3">
                        <div class="flex items-center gap-3">
                            <div class="w-9 h-9 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 shrink-0"><i class="fa-solid fa-cloud-arrow-up text-sm"></i></div>
                            <div>
                                <h4 class="text-white font-bold text-sm">অফলাইন এক্সেল সিঙ্ক</h4>
                                <p class="text-[10px] text-slate-500">এক্সেলে করা এন্ট্রি অ্যাপে আপলোড ও সিঙ্ক করুন।</p>
                            </div>
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
                            <div>
                                <h4 class="text-white font-bold text-sm">সম্পূর্ণ ডাটাবেস এক্সপোর্ট</h4>
                                <p class="text-[10px] text-slate-500">এনক্রিপ্টেড .enc ফাইল হিসেবে ডাটাবেস ডাউনলোড।</p>
                            </div>
                        </div>
                        <button class="h-9 w-full rounded-xl bg-indigo-600/15 border border-indigo-500/25 hover:bg-indigo-600 text-indigo-400 hover:text-white text-xs font-bold transition-all cursor-pointer active:scale-95" onclick="window.downloadFullSystemBackup()">
                            <i class="fa-solid fa-download mr-1.5"></i>১-ক্লিক ফুল ব্যাকআপ
                        </button>
                    </div>
                    
                    <div class="group rounded-xl bg-slate-950/50 border border-red-900/60 hover:border-red-500/30 p-4 transition-all flex flex-col gap-3">
                        <div class="flex items-center gap-3">
                            <div class="w-9 h-9 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-400 shrink-0"><i class="fa-solid fa-triangle-exclamation text-sm"></i></div>
                            <div>
                                <h4 class="text-white font-bold text-sm">সিস্টেম রিস্টোর</h4>
                                <p class="text-[10px] text-slate-500">বর্তমান ডাটা মুছে ফেলে ব্যাকআপ ডাটা প্রতিস্থাপন।</p>
                            </div>
                        </div>
                        <button class="h-9 w-full rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-bold transition-all cursor-pointer active:scale-95 shadow-md shadow-red-600/20" onclick="window.restoreSystemFromBackup()">
                            <i class="fa-solid fa-clock-rotate-left mr-1.5"></i>ডাটাবেস রিস্টোর করুন
                        </button>
                    </div>
                </div>
            </div>

        </div>
    `,ri(),(async()=>{try{await(await G(()=>Promise.resolve().then(()=>vi),void 0)).checkBackupReminder()}catch(e){console.error(`Failed to load backup reminder:`,e)}})()}var ai=t({approveStaff:()=>oi,changeStaffPin:()=>si,createNewUser:()=>di,deleteUserAccount:()=>li,revokeStaff:()=>ci,updateUserRole:()=>ui});async function oi(e,t){if(window.AppState.currentUserRole!==`Admin`||!await R(`স্টাফ অনুমোদন (Staff Approval)`))return;let{value:n}=await L.default.fire({title:`অ্যাপ্রুভ ও পিন সেটআপ`,input:`text`,inputLabel:`${t} এর জন্য একটি 4-ডিজিট পিন সেট করুন`,inputPlaceholder:`e.g. 1234`,inputAttributes:{autocomplete:`new-password`,autocapitalize:`off`,spellcheck:`false`},showCancelButton:!0,inputValidator:e=>{if(!e||e.length!==4||isNaN(e))return`আপনাকে অবশ্যই 4-ডিজিটের সংখ্যার পিন দিতে হবে!`}});if(n)try{await d.update(e,{status:`active`,pin:n}),P(`APPROVE`,`Admin`,e,t,{pinSet:!0}),L.default.fire(`অ্যাপ্রুভড!`,`স্টাফ অ্যাপ্রুভ হয়েছে এবং পিন সেট করা হয়েছে।`,`success`)}catch{L.default.fire(`Error`,`ব্যর্থ হয়েছেন`,`error`)}}async function si(e,t){if(window.AppState.currentUserRole!==`Admin`||!await R(`স্টাফ পিন পরিবর্তন (PIN Change)`))return;let{value:n}=await L.default.fire({title:`পিন পরিবর্তন`,input:`text`,inputLabel:`বর্তমান পিন: ${t} | নতুন 4-ডিজিট পিন দিন`,inputPlaceholder:`e.g. 5678`,inputAttributes:{autocomplete:`new-password`,autocapitalize:`off`,spellcheck:`false`},showCancelButton:!0,inputValidator:e=>{if(!e||e.length!==4||isNaN(e))return`আপনাকে অবশ্যই 4-ডিজিটের সংখ্যার পিন দিতে হবে!`}});if(n)try{await d.update(e,{pin:n}),P(`PIN_CHANGE`,`Admin`,e,``,{targetUser:e}),L.default.fire(`সফল!`,`পিন আপডেট করা হয়েছে।`,`success`)}catch{L.default.fire(`Error`,`ব্যর্থ হয়েছেন`,`error`)}}async function ci(e){if(window.AppState.currentUserRole===`Admin`&&await R(`স্টাফ ব্লক/বাতিল (Revoke Access)`)&&(await L.default.fire({title:`নিশ্চিত?`,text:`এই স্টাফ আর লগইন করতে পারবে না।`,icon:`warning`,showCancelButton:!0})).isConfirmed)try{await d.update(e,{status:`pending`,pin:``}),P(`REVOKE`,`Admin`,e,``,{action:`Block/Revoke`}),L.default.fire(`সফল!`,`অ্যাক্সেস বাতিল করা হয়েছে।`,`success`)}catch{L.default.fire(`Error`,`ব্যর্থ হয়েছেন`,`error`)}}async function li(e,t){if(window.AppState.currentUserRole!==`Admin`)return L.default.fire(`অ্যাক্সেস ডিনাইড!`,`শুধুমাত্র অ্যাডমিন অ্যাকাউন্ট মুছে ফেলতে পারবেন।`,`error`);if((await L.default.fire({title:`<i class="fa-solid fa-user-xmark text-red-400 mr-2"></i>অ্যাকাউন্ট মুছে ফেলা`,html:`<p style="color:#ef4444;font-size:14px;"><i class="fa-solid fa-triangle-exclamation mr-1.5"></i>আপনি কি নিশ্চিত যে <b>${t||e}</b> অ্যাকাউন্টটি ডাটাবেস থেকে মুছে ফেলতে চান?</p>`,icon:`warning`,showCancelButton:!0,confirmButtonText:`হ্যাঁ, ডিলেট করুন`,cancelButtonText:`বাতিল`,confirmButtonColor:`#dc2626`})).isConfirmed&&await R(`ইউজার অ্যাকাউন্ট মুছে ফেলা`))try{await d.delete(e),P(`DELETE`,`Admin`,e,t,{action:`User Deletion`}),L.default.fire({title:`অ্যাকাউন্ট মুছে ফেলা হয়েছে!`,text:`ইউজার (${t||e}) ডাটাবেস থেকে সফলভাবে ডিলেট করা হয়েছে।`,icon:`success`})}catch(e){console.error(`Failed to delete user account:`,e),L.default.fire({title:`Error!`,text:`অ্যাকাউন্টটি মুছতে সমস্যা হয়েছে: `+(e.message||e),icon:`error`})}}async function ui(e){if(window.AppState.currentUserRole!==`Admin`||!await R(`ইউজার রোল পরিবর্তন (Role Change)`))return;let t=document.getElementById(`role-${e}`).value;try{await d.update(e,{role:t}),P(`ROLE_CHANGE`,`Admin`,e,``,{newRole:t}),L.default.fire(`সফল!`,`ইউজারের রোল আপডেট হয়েছে।`,`success`)}catch{L.default.fire(`Error`,`রোল আপডেট করতে ব্যর্থ হয়েছেন।`,`error`)}}async function di(){if(window.AppState.currentUserRole!==`Admin`||!await R(`নতুন ইউজার অ্যাকাউন্ট তৈরি`))return;let{value:e}=await L.default.fire({title:`নতুন অ্যাকাউন্ট তৈরি করুন`,html:`
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
        `,focusConfirm:!1,showCancelButton:!0,confirmButtonText:`অ্যাকাউন্ট তৈরি করুন`,cancelButtonText:`বাতিল`,preConfirm:()=>{let e=document.getElementById(`new-user-email`).value.trim(),t=document.getElementById(`new-user-password`).value,n=document.getElementById(`new-user-role`).value;return!e||!t?(L.default.showValidationMessage(`ইমেইল এবং পাসওয়ার্ড আবশ্যক!`),!1):t.length<6?(L.default.showValidationMessage(`পাসওয়ার্ড কমপক্ষে ৬ ক্যারেক্টার হতে হবে!`),!1):{email:e,password:t,role:n}}});if(e){L.default.fire({title:`অ্যাকাউন্ট তৈরি হচ্ছে...`,text:`অনুগ্রহ করে অপেক্ষা করুন`,allowOutsideClick:!1,didOpen:()=>{L.default.showLoading()}});let t=null;try{t=n.initializeApp(o,`UserCreationApp_`+Date.now());let r=(await t.auth().createUserWithEmailAndPassword(e.email,e.password)).user.uid;await d.getRef(r).set({email:e.email,role:e.role,status:`active`,createdAt:n.firestore.FieldValue.serverTimestamp()}),P(`CREATE`,`Admin`,r,e.email,{role:e.role}),L.default.fire({title:`সফল!`,text:`${e.email} অ্যাকাউন্টটি সফলভাবে ফায়ারবেসে তৈরি হয়েছে।`,icon:`success`})}catch(e){console.error(`Error creating user:`,e),L.default.fire({title:`Error!`,text:`অ্যাকাউন্ট তৈরি করতে সমস্যা হয়েছে: `+(e.message||e),icon:`error`})}finally{t&&t.delete().catch(e=>console.warn(`secondaryApp cleanup warning:`,e))}}}var fi=t({managePermissions:()=>pi});async function pi(e,t){if(window.AppState.currentUserRole===`Admin`&&await R(`পারমিশন পরিবর্তন (Manage Permissions)`))try{let n=(await d.getById(e)).permissions||{},{value:r}=await L.default.fire({title:`Permissions for ${t}`,html:`
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
            `,focusConfirm:!1,showCancelButton:!0,confirmButtonText:`পারমিশন সেভ করুন`,cancelButtonText:`বাতিল`,customClass:{popup:`!bg-slate-900 !text-white !rounded-3xl border border-slate-700/80`,title:`!text-white`,confirmButton:`m3-btn-primary !px-6`,cancelButton:`m3-btn-tonal !px-6`},preConfirm:()=>{let e=document.getElementById(`perm-editLedger`).checked,t=document.getElementById(`perm-deleteLedger`).checked,n=document.getElementById(`perm-editExpenses`).checked,r=document.getElementById(`perm-deleteExpenses`).checked,i=document.getElementById(`perm-editCustomers`).checked,a=document.getElementById(`perm-deleteCustomers`).checked;return{viewDashboard:document.getElementById(`perm-viewDashboard`).checked,viewDashboardFinancials:document.getElementById(`perm-viewDashboardFinancials`).checked,printExecutiveReport:document.getElementById(`perm-printExecutiveReport`).checked,viewLedger:document.getElementById(`perm-viewLedger`).checked,manageLedger:e||t,editLedger:e,deleteLedger:t,exportLedger:document.getElementById(`perm-exportLedger`).checked,viewBulkEntry:document.getElementById(`perm-viewBulkEntry`).checked,viewInvoice:document.getElementById(`perm-viewInvoice`).checked,allowInvoiceDiscount:document.getElementById(`perm-allowInvoiceDiscount`).checked,viewExpenses:document.getElementById(`perm-viewExpenses`).checked,manageExpenses:n||r,editExpenses:n,deleteExpenses:r,viewCustomers:document.getElementById(`perm-viewCustomers`).checked,manageCustomers:i||a,editCustomers:i,deleteCustomers:a,viewStatement:document.getElementById(`perm-viewStatement`).checked,sendSMS:document.getElementById(`perm-sendSMS`).checked}}});r&&(await d.update(e,{permissions:r}),P(`PERMISSION_CHANGE`,`Admin`,e,t,{permissions:r}),L.default.fire({title:`সফল!`,text:`পারমিশন সফলভাবে সেভ করা হয়েছে।`,icon:`success`,customClass:{popup:`!bg-slate-900 !text-white !rounded-3xl border border-slate-700/80`}}))}catch(e){console.error(`Failed to update permissions:`,e),L.default.fire(`Error`,`Failed to update permissions.`,`error`)}}var mi=e(i());async function hi(){if(window.AppState?.currentUserRole!==`Admin`)return L.default.fire(`অ্যাক্সেস ডিনাইড!`,`শুধুমাত্র অ্যাডমিন ব্যাকআপ নিতে পারবেন।`,`error`);if(!await R(`সম্পূর্ণ ডাটাবেস ব্যাকআপ ডাউনলোড`,`fullSystemBackup`))return;let{value:e,isDismissed:t}=await L.default.fire({title:`ব্যাকআপ এনক্রিপশন পাসওয়ার্ড`,text:`ফাইলের সুরক্ষার জন্য একটি পাসওয়ার্ড দিন। রিস্টোর করার সময় এই পাসওয়ার্ড লাগবে।`,input:`password`,inputPlaceholder:`আপনার গোপন পাসওয়ার্ড দিন`,showCancelButton:!0,confirmButtonText:`ডাউনলোড শুরু করুন`,cancelButtonText:`বাতিল`,customClass:{popup:`!bg-slate-900 !text-white !rounded-3xl border border-slate-700 font-bn`},inputValidator:e=>{if(!e||e.length<4)return`অন্তত ৪ অক্ষরের পাসওয়ার্ড দিতে হবে!`}});if(!(t||!e)){L.default.fire({title:`ব্যাকআপ প্রস্তুত করা হচ্ছে...`,text:`দয়া করে অপেক্ষা করুন, পুরো ডাটাবেস এক্সপোর্ট হচ্ছে।`,allowOutsideClick:!1,didOpen:()=>L.default.showLoading(),customClass:{popup:`!bg-slate-900 !text-white !rounded-3xl border border-slate-700 font-bn`}});try{let t={systemMeta:{version:`1.0.0`,appName:`MAA MOTORS ERP`,exportTimestamp:new Date().toISOString(),exportedBy:window.AppState?.currentUserEmail||`Unknown`},collections:{}},n={};n.customers=await u.getAll(),n.transactions=await a.getAll();let r=await h.collection(`expenses`).get();n.expenses=[],r.forEach(e=>n.expenses.push({id:e.id,...e.data()}));let i=await h.collection(`zones`).get();n.zones=[],i.forEach(e=>n.zones.push({id:e.id,...e.data()}));let o=await h.collection(`users`).get();n.users=[],o.forEach(e=>n.users.push({id:e.id,...e.data()}));let s=await h.collection(`settings`).get();n.settings=[],s.forEach(e=>n.settings.push({id:e.id,...e.data()}));let c=e=>e.map(e=>{let t={...e};return Object.keys(t).forEach(e=>{t[e]&&typeof t[e].toDate==`function`&&(t[e]={_tType:`timestamp`,iso:t[e].toDate().toISOString()})}),t}),l=0;for(let[e,r]of Object.entries(n))t.collections[e]=c(r),l+=r.length;t.systemMeta.totalRecords=l;let d=JSON.stringify(t),f=mi.default.SHA256(d).toString();t.systemMeta.checksum=f;let p=JSON.stringify(t),m=mi.default.AES.encrypt(p,e).toString(),g=new Blob([m],{type:`text/plain;charset=utf-8`}),_=URL.createObjectURL(g),v=document.createElement(`a`);v.href=_,v.download=`Maa_Motors_ERP_Backup_${new Date().toISOString().split(`T`)[0]}.enc`,document.body.appendChild(v),v.click(),document.body.removeChild(v),URL.revokeObjectURL(_),P(`SYSTEM_BACKUP`,`Admin`,`Backup`,`Full Database Backup Downloaded`),await SettingsDAO.updateAppSettings({lastDisasterBackupTimestamp:new Date().toISOString()}),L.default.fire({title:`সফল!`,text:`মোট ${l} টি রেকর্ড সফলভাবে এনক্রিপ্ট করে ডাউনলোড করা হয়েছে।`,icon:`success`,customClass:{popup:`!bg-slate-900 !text-white !rounded-3xl border border-slate-700 font-bn`}})}catch(e){console.error(`Backup Export Error:`,e),L.default.fire(`Error`,`ব্যাকআপ জেনারেট করতে সমস্যা হয়েছে!`,`error`)}}}async function gi(){if(window.AppState?.currentUserRole!==`Admin`)return L.default.fire(`অ্যাক্সেস ডিনাইড!`,`শুধুমাত্র অ্যাডমিন সিস্টেম রিস্টোর করতে পারবেন।`,`error`);let{value:e}=await L.default.fire({title:`ডাটাবেস রিস্টোর করুন`,text:`আপনার .enc ব্যাকআপ ফাইলটি আপলোড করুন।`,input:`file`,inputAttributes:{accept:`.enc`,"aria-label":`Upload your backup file`},showCancelButton:!0,confirmButtonText:`পরবর্তী ধাপ`,cancelButtonText:`বাতিল`,customClass:{popup:`!bg-slate-900 !text-white !rounded-3xl border border-slate-700 font-bn`}});if(!e)return;let{value:t}=await L.default.fire({title:`ব্যাকআপ পাসওয়ার্ড`,text:`এই ফাইলটি ডিক্রিপ্ট করার জন্য পাসওয়ার্ড দিন:`,input:`password`,showCancelButton:!0,confirmButtonText:`ভ্যালিডেট করুন`,cancelButtonText:`বাতিল`,customClass:{popup:`!bg-slate-900 !text-white !rounded-3xl border border-slate-700 font-bn`}});if(t){L.default.fire({title:`ফাইল যাচাই করা হচ্ছে...`,allowOutsideClick:!1,didOpen:()=>L.default.showLoading(),customClass:{popup:`!bg-slate-900 !text-white !rounded-3xl border border-slate-700 font-bn`}});try{let r=await e.text(),i=``;try{i=mi.default.AES.decrypt(r,t).toString(mi.default.enc.Utf8)}catch{return L.default.fire(`Error`,`ভুল পাসওয়ার্ড অথবা করাপ্টেড ফাইল!`,`error`)}if(!i)return L.default.fire(`Error`,`ভুল পাসওয়ার্ড অথবা করাপ্টেড ফাইল!`,`error`);let{systemMeta:a,collections:o}=JSON.parse(i),s=JSON.stringify({systemMeta:{...a,checksum:void 0},collections:o});if(mi.default.SHA256(s).toString(),!a||!o||a.appName!==`MAA MOTORS ERP`)return L.default.fire(`Error`,`এই ফাইলটি এই সিস্টেমের ব্যাকআপ নয়!`,`error`);if(!await R(`বিপজ্জনক: সম্পূর্ণ ডাটাবেস রিস্টোর`,`fullSystemRestore`)||!(await L.default.fire({title:`<i class="fa-solid fa-triangle-exclamation text-amber-500 mr-2"></i> চূড়ান্ত ওয়ার্নিং`,html:`আপনি <b>${a.exportTimestamp}</b> তারিখের ব্যাকআপ রিস্টোর করতে যাচ্ছেন।<br><br>
                   <b>বর্তমান ডাটাবেসের সমস্ত ডাটা মুছে ফেলা হবে!</b><br>
                   আপনি কি নিশ্চিত?`,icon:`warning`,showCancelButton:!0,confirmButtonColor:`#ef4444`,confirmButtonText:`হ্যাঁ, রিস্টোর করুন!`,cancelButtonText:`বাতিল`,customClass:{popup:`!bg-slate-900 !text-white !rounded-3xl border border-slate-700 font-bn`}})).isConfirmed)return;L.default.fire({title:`রিস্টোর চলছে...`,html:`দয়া করে ব্রাউজার বন্ধ করবেন না।<br><span id="restore-progress" class="text-amber-400 font-bold">0</span>% কমপ্লিট`,allowOutsideClick:!1,didOpen:()=>L.default.showLoading(),customClass:{popup:`!bg-slate-900 !text-white !rounded-3xl border border-slate-700 font-bn`}});for(let e of[`customers`,`transactions`,`expenses`,`zones`,`users`,`settings`,`audit_logs`]){let t=await h.collection(e).get(),n=h.batch(),r=0;for(let e of t.docs)n.delete(e.ref),r++,r>=400&&(await n.commit(),n=h.batch(),r=0);r>0&&await n.commit()}let c=a.totalRecords,l=0;for(let[e,t]of Object.entries(o)){let r=h.batch(),i=0;for(let a of t){let t=a.id;delete a.id,Object.keys(a).forEach(e=>{a[e]&&a[e]._tType===`timestamp`&&(a[e]=n.firestore.Timestamp.fromDate(new Date(a[e].iso)))});let o=h.collection(e).doc(t);r.set(o,a),i++,l++,i>=400&&(await r.commit(),r=h.batch(),i=0,document.getElementById(`restore-progress`).innerText=Math.round(l/c*100))}i>0&&(await r.commit(),document.getElementById(`restore-progress`).innerText=Math.round(l/c*100))}await h.collection(`audit_logs`).add({action:`DISASTER_RECOVERY`,module:`System`,entityId:`All`,entityName:`Full DB Restore`,details:{restoredFrom:a.exportTimestamp},user:window.AppState?.currentUserEmail||`Admin`,timestamp:n.firestore.FieldValue.serverTimestamp()}),await L.default.fire({title:`রিস্টোর সফল!`,text:`ডাটাবেস সফলভাবে রিস্টোর হয়েছে। সিস্টেম এখন ফ্রেশ ডাটা লোড করার জন্য রিস্টার্ট হবে।`,icon:`success`,allowOutsideClick:!1,confirmButtonText:`রিস্টার্ট করুন`,customClass:{popup:`!bg-slate-900 !text-white !rounded-3xl border border-slate-700 font-bn`}});try{await n.firestore().clearPersistence()}catch(e){console.warn(`Could not clear persistence`,e)}window.location.reload(!0)}catch(e){console.error(`Backup Restore Error:`,e),L.default.fire(`Error`,`ডাটা রিস্টোর করার সময় অপ্রত্যাশিত এরর হয়েছে!`,`error`)}}}async function _i(){try{let e=(await c.getAppSettings()).lastDisasterBackupTimestamp,t=new Date,n=!1,r=0;if(!e)n=!0,r=`অনেক`;else{let i=t-new Date(e),a=Math.floor(i/864e5);a>=3&&(n=!0,r=a)}n&&L.default.fire({title:`<i class="fa-solid fa-triangle-exclamation text-red-500 mr-2 text-4xl mb-2 block"></i>বিপজ্জনক পরিস্থিতি!`,html:`<p class="text-slate-300 text-sm">গত <b>${r} দিন</b> ধরে আপনার ডাটাবেসের কোনো डिजाস্টার রিকভারি ব্যাকআপ নেওয়া হয়নি!</p>
                       <p class="text-amber-400 font-bold mt-3 text-xs bg-amber-500/10 p-3 rounded-lg border border-amber-500/20">
                         দয়া করে এখনই এডমিন প্যানেলের "Advanced Disaster Recovery" সেকশন থেকে 1-Click Backup ডাউনলোড করে সুরক্ষিত স্থানে সংরক্ষণ করুন।
                       </p>`,icon:`warning`,confirmButtonText:`ঠিক আছে, আমি ব্যাকআপ নিচ্ছি`,confirmButtonColor:`#ef4444`,customClass:{popup:`!bg-slate-900 !text-white !rounded-3xl border border-red-500/50 shadow-2xl font-bn`,confirmButton:`m3-btn-primary !bg-red-600 hover:!bg-red-500 !px-6 !py-2.5 rounded-xl font-bold text-sm`}})}catch(e){console.error(`Backup reminder check failed:`,e)}}var vi=t({checkBackupReminder:()=>_i,downloadFullSystemBackup:()=>hi,restoreSystemFromBackup:()=>gi}),yi=t({autoSyncZoneCounters:()=>Si,resequenceZoneAccountNumbers:()=>Ci,setNextAccountNo:()=>bi,showIndividualFixer:()=>xi,syncSingleZoneCounter:()=>wi});async function bi(){try{W();let e=await p.getAllZones();if(!e||e.length===0)return L.default.fire({title:`কোনো জোন পাওয়া যায়নি!`,text:`সিরিয়াল আপডেট করার আগে আপনাকে অন্তত একটি জোন তৈরি করতে হবে।`,icon:`warning`,customClass:{popup:`!bg-slate-900 !text-white !rounded-3xl border border-slate-700`}});let t=`<option value="">-- জোন সিলেক্ট করুন --</option>`;e.forEach(e=>{t+=`<option value="${e.name}">${e.name}</option>`});let{value:n}=await L.default.fire({title:`অটো-সিরিয়াল কাউন্টার সেট করুন`,html:`<div class="text-left space-y-4 font-bn p-2">
                    <div><label class="block text-xs font-bold text-slate-400 mb-1">জোন সিলেক্ট করুন</label><select id="set-next-zone" class="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white outline-none focus:border-blue-500">${t}</select></div>
                    <div><label class="block text-xs font-bold text-slate-400 mb-1">বর্তমান সিরিয়াল নম্বর (e.g. 5 মানে পরবর্তী আইডি 0006 হবে)</label><input id="set-next-val" type="number" class="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white outline-none focus:border-blue-500" placeholder="e.g. 5"></div>
                </div>`,showCancelButton:!0,confirmButtonText:`আপডেট করুন`,cancelButtonText:`বাতিল`,customClass:{popup:`!bg-slate-900 !text-white !rounded-3xl border border-slate-700`},preConfirm:()=>{let e=document.getElementById(`set-next-zone`).value,t=parseInt(document.getElementById(`set-next-val`).value);return!e||isNaN(t)?L.default.showValidationMessage(`সবগুলো ঘর পূরণ করুন`):{zone:e,val:t}}});if(n){if(!await R(`অটো-সিরিয়াল কাউন্টার পরিবর্তন`))return;try{await c.updateZoneCounter(n.zone,n.val),L.default.fire(`সফল!`,`জোনের (${n.zone}) পরবর্তী সিরিয়াল আপডেট করা হয়েছে।`,`success`)}catch{L.default.fire(`Error`,`কাউন্টার আপডেট করা যায়নি।`,`error`)}}}catch(e){console.error(`setNextAccountNo error:`,e),L.default.fire(`ত্রুটি!`,`ডাটা লোড করতে সমস্যা হয়েছে। দয়া করে পেজ রিফ্রেশ করে আবার চেষ্টা করুন।`,`error`)}}async function xi(){W();let e=U(),t=`<option value="">-- কাস্টমার সিলেক্ট করুন --</option>`;e.forEach(e=>{t+=`<option value="${e.id}" data-acc="${e.accountNo||``}">${e.accountNo?`[`+e.accountNo+`] `:``}${e.name}</option>`});let{value:n}=await L.default.fire({title:`ID ম্যানেজার`,html:`<div class="text-left space-y-4 font-bn p-2">
                <div><label class="block text-xs font-bold text-slate-400 mb-1">কাস্টমার সিলেক্ট করুন</label><select id="fix-cust-sel" class="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white outline-none focus:border-blue-500" onchange="document.getElementById('fix-new-acc').value = this.options[this.selectedIndex].dataset.acc">${t}</select></div>
                <div><label class="block text-xs font-bold text-slate-400 mb-1">নতুন অ্যাকাউন্ট নং (৪ ডিজিট)</label><input id="fix-new-acc" class="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white outline-none focus:border-blue-500" placeholder="e.g. 0001"></div>
            </div>`,showCancelButton:!0,confirmButtonText:`পরিবর্তন করুন`,cancelButtonText:`বাতিল`,customClass:{popup:`!bg-slate-900 !text-white !rounded-3xl border border-slate-700`},preConfirm:()=>{let e=document.getElementById(`fix-cust-sel`).value,t=document.getElementById(`fix-new-acc`).value.trim();return!e||!t?L.default.showValidationMessage(`সবগুলো ঘর পূরণ করুন`):{id:e,newAcc:t}}});if(n){if(!await R(`অ্যাকাউন্ট নং পরিবর্তন`))return;try{await u.update(n.id,{accountNo:n.newAcc}),P(`ID_FIX`,`Admin`,n.id,``,{newAccountNo:n.newAcc}),L.default.fire(`সফল!`,`অ্যাকাউন্ট নাম্বার পরিবর্তন করা হয়েছে।`,`success`)}catch{L.default.fire(`Error`,`পরিবর্তন করা যায়নি।`,`error`)}}}async function Si(){if(window.AppState.currentUserRole!==`Admin`)return L.default.fire(`অ্যাক্সেস ডিনাইড!`,`শুধুমাত্র অ্যাডমিন জোন কাউন্টার সিঙ্ক করতে পারবেন।`,`error`);if(await R(`জোন কাউন্টার অটো-সিঙ্ক (Auto Reset)`))try{L.default.fire({title:`সিঙ্ক হচ্ছে...`,text:`সকল জোনের কাস্টমার সিরিয়াল ও কাউন্টার স্ক্যান করা হচ্ছে...`,allowOutsideClick:!1,didOpen:()=>L.default.showLoading(),customClass:{popup:`!bg-slate-900 !text-white !rounded-3xl border border-slate-700 font-bn`}});let e=await p.getAllZones(),t=await u.getAll();if(!e||e.length===0)return L.default.fire(`তথ্য পাওয়া যায়নি`,`কোনো জোন নিবন্ধিত নেই।`,`warning`);let n=[];for(let r of e){let e=r.name,i=t.filter(t=>(t.zone||``).trim()===e),a=0;i.forEach(e=>{let t=(e.accountNo||``).match(/\d+/);if(t){let e=parseInt(t[0],10);!isNaN(e)&&e>a&&(a=e)}}),await c.updateZoneCounter(e,a),n.push(`• <strong>${e}</strong>: সক্রিয় কাস্টমার ${i.length} জন <i class="fa-solid fa-arrow-right text-cyan-400 mx-1"></i> কাউন্টার সেট: <strong>${a}</strong> (পরবর্তী: ${a+1})`)}P(`AUTO_SYNC_COUNTERS`,`Admin`,`Counters`,`Zone Counters Auto Synced`),L.default.fire({title:`<i class="fa-solid fa-rotate text-emerald-400 mr-2"></i>জোন কাউন্টার সিঙ্ক সফল!`,html:`<div class="text-left space-y-2 font-bn p-3 bg-slate-950 rounded-2xl border border-slate-800 text-xs text-slate-300">
                    <p class="font-bold text-white mb-2">ডাটাবেসের বর্তমান সক্রিয় কাস্টমার সংখ্যা অনুযায়ী সিরিয়াল কাউন্টার আপডেট করা হয়েছে:</p>
                    ${n.join(`<br>`)}
                </div>`,icon:`success`,confirmButtonText:`ঠিক আছে`,customClass:{popup:`!bg-slate-900 !text-white !rounded-3xl border border-slate-700 font-bn`}}),window.loadCustomers&&window.loadCustomers()}catch(e){console.error(`autoSyncZoneCounters error:`,e),L.default.fire(`ত্রুটি!`,`কাউন্টার সিঙ্ক করার সময় সমস্যা হয়েছে।`,`error`)}}async function Ci(e=null){if(window.AppState.currentUserRole!==`Admin`)return L.default.fire(`অ্যাক্সেস ডিনাইড!`,`শুধুমাত্র অ্যাডমিন সিরিয়াল সাজাতে পারবেন।`,`error`);let t=await p.getAllZones();if(!t||t.length===0)return L.default.fire(`warning`,`কোনো জোন নেই!`);let n=e;if(!n){let e=`<option value="">-- জোন সিলেক্ট করুন --</option>`;t.forEach(t=>{e+=`<option value="${t.name}">${t.name}</option>`});let{value:r}=await L.default.fire({title:`সিরিয়াল অনুযায়ী অ্যাকাউন্ট পুনঃসাজানো`,html:`<div class="text-left space-y-3 font-bn p-2">
                    <p class="text-xs text-amber-400 font-bold bg-amber-500/10 p-3 rounded-xl border border-amber-500/20">
                        <i class="fa-solid fa-triangle-exclamation text-amber-400 mr-1.5"></i>সতর্কবার্তা: এটি সিলেক্ট করা জোনের সকল সক্রিয় কাস্টমারের অ্যাকাউন্ট নম্বর ১, ২, ৩... ক্রমানুসারে পুনরায় সেট করবে।
                    </p>
                    <div><label class="block text-xs font-bold text-slate-400 mb-1">জোন সিলেক্ট করুন</label><select id="reseq-zone-sel" class="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white outline-none focus:border-blue-500">${e}</select></div>
                </div>`,showCancelButton:!0,confirmButtonText:`পুনরায় সাজান`,cancelButtonText:`বাতিল`,customClass:{popup:`!bg-slate-900 !text-white !rounded-3xl border border-slate-700`},preConfirm:()=>document.getElementById(`reseq-zone-sel`).value||L.default.showValidationMessage(`জোন সিলেক্ট করুন`)});n=r}if(n&&await R(`কাস্টমার সিরিয়াল পুনঃসাজানো`))try{L.default.fire({title:`প্রসেস হচ্ছে...`,text:`কাস্টমারদের অ্যাকাউন্ট নম্বর ক্রমানুসারে আপডেট হচ্ছে...`,allowOutsideClick:!1,didOpen:()=>L.default.showLoading()});let e=await u.getAll(),r=t.find(e=>e.name===n),i=r&&r.code||``,a=e.filter(e=>(e.zone||``).trim()===n);a.sort((e,t)=>(e.accountNo||``).localeCompare(t.accountNo||``,void 0,{numeric:!0}));let o=0,s=[];for(let e=0;e<a.length;e++){let t=a[e],n=i+String(e+1).padStart(4,`0`);t.accountNo!==n&&(s.push({ref:u.getRef(t.id),newAccNo:n}),o++)}for(let e=0;e<s.length;e+=400){let t=h.batch();s.slice(e,e+400).forEach(e=>t.update(e.ref,{accountNo:e.newAccNo})),await t.commit()}await c.updateZoneCounter(n,a.length),P(`RESEQUENCE_ACC_NO`,`Admin`,n,`${o} updated`),L.default.fire(`সফল!`,`জোনের (${n}) ${a.length} জন কাস্টমারের আইডি ১ থেকে ${a.length} সিরিয়ালে সুন্দরভাবে সাজানো হয়েছে।`,`success`),window.loadCustomers&&window.loadCustomers()}catch(e){console.error(`resequenceZoneAccountNumbers error:`,e),L.default.fire(`ত্রুটি!`,`সিরিয়াল পুনঃসাজানোর সময় সমস্যা হয়েছে।`,`error`)}}async function wi(e){if(e)try{let t=(await u.getAll()).filter(t=>(t.zone||``).trim()===e),n=0;t.forEach(e=>{let t=(e.accountNo||``).match(/\d+/);if(t){let e=parseInt(t[0],10);!isNaN(e)&&e>n&&(n=e)}}),await c.updateZoneCounter(e,n)}catch(e){console.error(`syncSingleZoneCounter error:`,e)}}window.resequenceZoneModal=Ci,window.downloadFullSystemBackup=hi,window.restoreSystemFromBackup=gi,window.appAdmin={loadAdminUsers:ri,...ai,...fi,...yi};var J=[],Ti=[],Ei;function Di(){return J}function Oi(e){J=e}function ki(){return Ti}function Ai(){J.push({desc:``,qty:1,unit:`Pcs`,rate:0,total:0}),Y()}function ji(e){J.splice(e,1),Y(),Vi()}function Mi(e,t,n){let r=n.value;if(t===`desc`)J[e].desc=r,r.length>=3&&Ni(e,r);else if(t===`unit`)J[e].unit=r;else{let n=Math.max(0,y(r));if(J[e][t]=n,t===`qty`||t===`rate`){let t=y(J[e].qty)*y(J[e].rate);J[e].total=t;let n=document.getElementById(`inv-item-total-${e}`);n&&(n.value=v(t));let r=document.getElementById(`item-live-words-${e}`);r&&(t>0?(r.innerHTML=`<i class="fa-solid fa-coins text-[9px] text-amber-400"></i> <span>${I(t)}</span>`,r.classList.remove(`hidden`)):r.classList.add(`hidden`))}}Vi()}function Ni(e,t){let n=document.getElementById(`inv-customer-select`);if(!n||n.selectedIndex<=0)return;let r=n.value;clearTimeout(Ei),Ei=setTimeout(async()=>{try{let n=await a.collection.where(`customerId`,`==`,r).orderBy(`createdAt`,`desc`).limit(30).get(),i=null;n.forEach(e=>{let n=e.data();if(n.hasItems&&n.items&&!i){let e=n.items.find(e=>(e.desc||``).toLowerCase().trim()===t.toLowerCase().trim());e&&(i=e.rate)}});let o=document.getElementById(`price-hint-${e}`);o&&i&&(o.innerHTML=`<button type="button" onclick="window.applyHistoryPrice(${e}, ${i})" class="text-[10px] bg-blue-500/20 text-blue-300 border border-blue-500/40 px-2 py-0.5 rounded-md font-bold hover:bg-blue-600 hover:text-white transition-all cursor-pointer">আগের রেট: ৳${v(i)}</button>`,o.classList.remove(`hidden`))}catch(e){console.error(`Price hint error:`,e)}},400)}function Pi(e,t){J[e].rate=t,J[e].total=J[e].qty*t,Y(),Vi()}function Fi(e){let t=document.getElementById(`inv-paid`),n=document.getElementById(`inv-net-total-display`)?.innerText||`0`,r=y(n.replace(/[^0-9.]/g,``)),i=e;e===`exact`&&(i=r),t&&(t.value=i,window.calcInvoiceTotals(),window.toggleInvoiceRecvSection()),Bi(i,r)}function Ii(){let e=document.getElementById(`inv-customer-select`),t=e&&e.selectedIndex>0?e.options[e.selectedIndex].dataset.name:`Unknown`;if(J.length===0||J.length===1&&!J[0].desc&&!J[0].total)return L.default.fire(`Error`,`হোল্ড করার মত কোনো আইটেম নেই`,`error`);Ti.push({id:Date.now(),time:new Date().toLocaleTimeString([],{hour:`2-digit`,minute:`2-digit`}),customerName:t,customerId:e?e.value:``,items:JSON.parse(JSON.stringify(J)),notes:document.getElementById(`inv-notes`)?.value||``}),L.default.fire({toast:!0,position:`top-end`,icon:`success`,title:`বিল হোল্ড করা হয়েছে (${t})`,showConfirmButton:!1,timer:2e3,customClass:{popup:`!bg-slate-900 !text-white border border-slate-700`}}),Oi([{desc:``,qty:1,unit:`Pcs`,rate:0,total:0}]),document.getElementById(`inv-notes`).value=``,Y(),Vi()}function Li(e){if(!Ti[e])return;let t=Ti[e];Oi(t.items),document.getElementById(`inv-notes`)&&(document.getElementById(`inv-notes`).value=t.notes),document.getElementById(`inv-customer-select`)&&t.customerId&&(document.getElementById(`inv-customer-select`).value=t.customerId,window.invoiceCustomerChanged()),Ti.splice(e,1),Y(),Vi(),L.default.fire({toast:!0,position:`top-end`,icon:`info`,title:`হোল্ড বিল রিজিউম করা হয়েছে`,showConfirmButton:!1,timer:2e3,customClass:{popup:`!bg-slate-900 !text-white border border-slate-700`}})}async function Ri(e){let t=document.querySelectorAll(`button[onclick*="saveAndPrintInvoice"]`);try{let r=document.getElementById(`inv-customer-select`);if(!r||r.selectedIndex<=0)return L.default.fire(`এরর`,`কাস্টমার সিলেক্ট করুন!`,`error`);let i=r.value,o=r.options[r.selectedIndex],s=o.dataset.name,c=o.dataset.phone,l=x(document.getElementById(`inv-date`).value),d=document.getElementById(`inv-voucher`).value,f=document.getElementById(`inv-notes`).value,p=y(document.getElementById(`inv-subtotal`).value),m=y(document.getElementById(`inv-discount`).value),g=document.getElementById(`inv-disc-mode-btn`)?.dataset.mode||`fixed`,_=y(document.getElementById(`inv-paid`).value),b=g===`percent`?w(p*m/100):m,S=w(Math.max(0,p-b));if(S===0&&_===0)throw Error(`বিল বা জমা এন্ট্রি দিন`);if(!(await L.default.fire({title:`<div class="flex items-center justify-center gap-2 font-bn font-black text-xl text-white"><i class="fa-solid fa-file-invoice text-blue-400"></i><span>ইনভয়েস যাচাই করুন</span></div>`,html:`
                <div class="text-left font-bn p-3.5 bg-slate-900/90 rounded-2xl border border-slate-800 space-y-2.5 shadow-inner">
                    <div class="flex justify-between items-center border-b border-slate-800/80 pb-2"><span class="text-xs text-slate-400 font-bold">কাস্টমার:</span><strong class="text-sm text-white font-black">${s}</strong></div>
                    <div class="flex justify-between items-center border-b border-slate-800/80 pb-2"><span class="text-xs text-slate-400 font-bold">মোট বিল:</span><strong class="text-base text-blue-400 font-black font-mono">৳ ${v(S)}</strong></div>
                    <div class="flex justify-between items-center"><span class="text-xs text-slate-400 font-bold">আদায় (Paid):</span><strong class="text-base text-emerald-400 font-black font-mono">৳ ${v(_)}</strong></div>
                </div>`,showCancelButton:!0,confirmButtonText:`<i class="fa-solid fa-print mr-2"></i>সেভ ও প্রিন্ট করুন`,cancelButtonText:`<i class="fa-solid fa-pen-to-square mr-2"></i>সংশোধন করব`,customClass:{popup:`!bg-slate-950 !text-white !rounded-3xl border border-slate-800 shadow-2xl font-bn`,confirmButton:`m3-btn-primary !bg-blue-600 hover:!bg-blue-500 !px-7 !py-2.5 !rounded-xl font-bold shadow-lg shadow-blue-600/30`,cancelButton:`m3-btn-tonal !bg-slate-800 hover:!bg-slate-700 !text-slate-300 !px-5 !py-2.5 !rounded-xl font-bold border border-slate-700`}})).isConfirmed)return;t.forEach(e=>e.disabled=!0),L.default.fire({title:`সেভ হচ্ছে...`,didOpen:()=>L.default.showLoading(),allowOutsideClick:!1});let C=h.batch(),T=a.getRef(),E=J.filter(e=>e.desc&&e.desc.trim()!==``||e.total>0),ee=await u.getById(i)||{},D=Number(ee.totalDue)||0,O=w(D+(S-_)),k={customerId:i,customerName:s,date:l,voucherNo:d,notes:f,bill:S,paid:_,subtotal:p,discount:b,discountInput:m,discountMode:g,prevDue:D,currentDue:O,hasItems:E.length>0,createdBy:window.AppState?.currentUserEmail||`Unknown`,createdAt:n.firestore.FieldValue.serverTimestamp()};E.length>0&&(k.items=E.map(e=>({...e}))),C.set(T,k),C.update(u.getRef(i),{totalDue:n.firestore.FieldValue.increment(w(S-_))}),await C.commit(),P(`CREATE`,`Invoice`,T.id,s,{bill:S,paid:_}),c&&(await L.default.fire({title:`সফল!`,text:`কাস্টমারকে হোয়াটসঅ্যাপে ডিজিটাল ইনভয়েস পাঠাবেন?`,icon:`success`,showCancelButton:!0,confirmButtonText:`<i class="fa-brands fa-whatsapp mr-1.5"></i> হোয়াটসঅ্যাপ মেসেজ`,cancelButtonText:`প্রিন্ট এ যাব`,confirmButtonColor:`#25D366`})).isConfirmed&&(()=>{let e=v(Math.abs(O)),t=O<0?`অ্যাডভান্স জমা: ৳ ${e}`:`বর্তমান মোট বকেয়া: ৳ ${e}`,n=`${window.location.origin}${window.location.pathname}?view=public-memo&id=${T.id}`,r=`আসসালামু আলাইকুম ${s},\nমেসার্স মা মোটরস্ থেকে আপনার মেমো সেভ হয়েছে।\n\nআজকের বিল: ৳ ${v(S)}\nআজকের জমা: ৳ ${v(_)}\n---------------------------------\n${t}\n\nআপনার ডিজিটাল মেমোর PDF দেখতে নিচের লিংকে ক্লিক করুন:\n${n}\n\nধন্যবাদ! — মেসার্স মা মোটরস্`;window.sendWhatsApp(c,r)})(),window.printReceiptEngine&&await window.printReceiptEngine(T.id,e),document.getElementById(`inv-subtotal`).value=``,document.getElementById(`inv-discount`).value=``,document.getElementById(`inv-paid`).value=``,document.getElementById(`inv-voucher`).value=``,document.getElementById(`inv-notes`).value=``,Oi([{desc:``,qty:1,unit:`Pcs`,rate:0,total:0}]),Zi(document.getElementById(`view-container`))}catch(e){handleError(e,`ইনভয়েস সেভ করা যায়নি`)}finally{t.forEach(e=>e.disabled=!1)}}function zi(e,t=null,n={}){if(window.AppState?.currentUserRole===`Staff`&&window.AppState?.permissions?.viewInvoice===!1){e.innerHTML=`<div class="m3-card text-center font-bn py-12"><h2 class="text-xl font-black text-red-500">অ্যাক্সেস ডিনাইড!</h2></div>`;return}let r=ki();e.innerHTML=`
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
    `,document.getElementById(`inv-date`).value=_(),Oi([{desc:``,qty:1,unit:`Pcs`,rate:0,total:0}]),n.loadInvoiceCustomers&&n.loadInvoiceCustomers(t?.customerId),n.renderInvoiceItems&&n.renderInvoiceItems()}function Y(){let e=document.getElementById(`inv-items-tbody`),t=Di();if(e){if(t.length===0){e.innerHTML=`<tr><td colspan="7" class="text-center py-6 text-slate-500 italic font-bold">কোনো আইটেম নেই</td></tr>`;return}e.innerHTML=t.map((e,t)=>`
        <tr class="border-b border-slate-800/60 hover:bg-white/[0.02] transition-colors">
            <td class="w-10 text-center text-slate-400 font-bold text-xs py-2.5 px-2">${t+1}</td>
            <td class="py-2.5 px-2">
                <input type="text" class="w-full bg-slate-950/90 border border-slate-700/70 rounded-xl px-3.5 h-10 text-xs text-white font-bold outline-none focus:border-blue-500 transition-all shadow-inner" placeholder="আইটেমের নাম / বিবরণ লিখুন..." value="${e.desc}" oninput="window.updateInvoiceItem(${t}, 'desc', this)">
                <div id="price-hint-${t}" class="hidden mt-1"></div>
                <div id="item-live-words-${t}" class="${e.total>0?``:`hidden`} text-[10px] text-blue-400 font-bold italic mt-1 flex items-center gap-1"><i class="fa-solid fa-coins text-[9px] text-amber-400"></i><span>${e.total>0?I(e.total):``}</span></div>
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
                <input type="text" id="inv-item-rate-${t}" class="w-full text-center bg-slate-950/90 border border-slate-700/70 rounded-xl px-2 h-10 text-xs text-white font-bold outline-none focus:border-blue-500 transition-all shadow-inner" value="${e.rate?v(e.rate):``}" placeholder="০" onkeyup="window.handleNumberInput(this); window.updateInvoiceItem(${t}, 'rate', this);" onkeydown="if(event.key==='Enter'){ event.preventDefault(); window.addInvoiceItemRow(); }">
            </td>
            <td class="w-40 py-2.5 px-2">
                <input type="text" id="inv-item-total-${t}" class="w-full text-right font-black text-blue-400 bg-slate-950/60 border border-slate-800 rounded-xl px-3 h-10 text-xs outline-none shadow-inner" value="${e.total?v(e.total):``}" placeholder="০" readonly>
            </td>
            <td class="w-12 text-center py-2.5 px-1">
                <button type="button" class="w-8 h-8 rounded-xl bg-slate-900 border border-slate-800 hover:bg-red-500/20 text-slate-500 hover:text-red-400 flex items-center justify-center transition-all cursor-pointer mx-auto" onclick="window.removeInvoiceItem(${t})" title="লাইন ডিলিট"><i class="fa-solid fa-trash-can text-xs"></i></button>
            </td>
        </tr>`).join(``)}}function Bi(e,t){let n=document.getElementById(`inv-change-return-box`),r=document.getElementById(`inv-change-return-display`);if(!(!n||!r))if(e>t&&t>0){let i=e-t;r.innerText=`৳ ${v(i)}`,n.classList.remove(`hidden`)}else n.classList.add(`hidden`)}function Vi(){let e=0;Di().forEach(t=>{e+=t.total||0});let t=document.getElementById(`inv-subtotal`);t&&(t.value=v(e),Hi())}function Hi(){let e=y(document.getElementById(`inv-subtotal`)?.value||`0`),t=y(document.getElementById(`inv-discount`)?.value||`0`),n=y(document.getElementById(`inv-prev-due`)?.value||`0`),r=y(document.getElementById(`inv-paid`)?.value||`0`),i=(document.getElementById(`inv-disc-mode-btn`)?.dataset.mode||`fixed`)===`percent`?w(e*t/100):t,a=w(Math.max(0,e-i)+n),o=w(a-r),s=(e,t)=>{let n=document.getElementById(e);n&&(t>0?(n.innerText=`(${I(t)})`,n.classList.remove(`hidden`)):n.classList.add(`hidden`))};s(`inv-sub-words`,e),s(`inv-disc-words`,i),s(`inv-net-words`,a),s(`inv-paid-words`,r),s(`inv-due-words`,Math.abs(o));let c=document.getElementById(`inv-net-total-display`);c&&(c.innerText=`৳ `+v(a));let l=document.getElementById(`inv-current-due-display`);l&&(l.innerText=`৳ `+v(Math.abs(o))+(o<0?` (Adv)`:``),l.className=o>0?`text-xl font-black text-red-400`:o<0?`text-xl font-black text-emerald-400`:`text-xl font-black text-slate-300`),Bi(r,a)}async function Ui(e=null){let t=U();t.length||(W(),t=await u.getAll(`name`,`asc`));let n=document.getElementById(`inv-customer-select`);n&&(n.innerHTML=`<option value="">-- সিলেক্ট করুন --</option>`+t.map(e=>{let t=e.accountNo?`[${e.accountNo}] `:``;return`<option value="${e.id}" data-due="${e.totalDue||0}" data-phone="${e.phone||``}" data-address="${e.address||``}" data-name="${e.name}" data-acc="${e.accountNo||``}">${t}${e.name}</option>`}).join(``),e&&Gi(e))}function Wi(e=``){qt(e,{inputId:`inv-cust-search-input`,selectId:`inv-customer-select`,dropdownId:`inv-cust-dropdown`,onSelect:e=>Gi(e)})}function Gi(e){let t=document.getElementById(`inv-customer-select`),n=document.getElementById(`inv-cust-search-input`),r=document.getElementById(`inv-cust-search-clear`),i=document.getElementById(`inv-cust-dropdown`);if(t&&(t.value=e,qi()),t&&t.selectedIndex>0){let e=t.options[t.selectedIndex];n&&(n.value=`${e.dataset.name} ${e.dataset.acc?`[`+e.dataset.acc+`]`:``}`),r&&r.classList.remove(`hidden`)}i&&i.classList.add(`hidden`)}function Ki(){let e=document.getElementById(`inv-customer-select`),t=document.getElementById(`inv-cust-search-input`),n=document.getElementById(`inv-cust-search-clear`),r=document.getElementById(`inv-cust-dropdown`);e&&(e.value=``,qi()),t&&(t.value=``),n&&n.classList.add(`hidden`),r&&r.classList.add(`hidden`)}function qi(){let e=document.getElementById(`inv-customer-select`),t=document.getElementById(`inv-cust-display`),n=document.getElementById(`inv-prev-due`);if(e&&e.selectedIndex>0){let r=e.options[e.selectedIndex],i=Number(r.dataset.due)||0,a=i>0?`<span class="text-red-400 font-black">বকেয়া: ৳${v(i)}</span>`:`<span class="text-emerald-400 font-bold">পরিশোধিত</span>`;t.innerHTML=`
            <div class="flex justify-between items-center"><div class="font-black text-white">${r.dataset.name} <span class="text-blue-400 text-[11px] font-bold">(${r.dataset.acc||`-`})</span></div>${a}</div>
            <div class="text-[11px] text-slate-400 font-bold mt-0.5"><i class="fa-solid fa-phone text-[9px] mr-1"></i>${r.dataset.phone||`-`} • ${r.dataset.address||`-`}</div>`,n.value=v(i)}else t.innerText=`সিলেক্ট করা হয়নি`,n&&(n.value=``);Hi()}function Ji(){let e=document.getElementById(`inv-disc-mode-btn`);e&&(e.dataset.mode=e.dataset.mode===`fixed`?`percent`:`fixed`,e.innerText=e.dataset.mode===`fixed`?`৳`:`%`,Hi())}function Yi(){let e=y(document.getElementById(`inv-paid`)?.value||`0`);document.getElementById(`inv-recv-section`)?.classList.toggle(`hidden`,e<=0)}function Xi(e){let t=document.getElementById(`inv-recv-bank-btn`),n=document.getElementById(`inv-recv-cash-btn`);t&&n&&(e===`Bank`?(t.className=`px-3 py-1 rounded-md bg-blue-600 text-white font-bold`,n.className=`px-3 py-1 rounded-md text-slate-400 font-bold`):(n.className=`px-3 py-1 rounded-md bg-emerald-600 text-white font-bold`,t.className=`px-3 py-1 rounded-md text-slate-400 font-bold`))}function Zi(e,t=null){zi(e,t,{loadInvoiceCustomers:Ui,renderInvoiceItems:Y})}typeof window<`u`&&(window.renderInvoiceItems=Y,window.calcItemTotals=Vi,window.calcInvoiceTotals=Hi,window.loadInvoiceCustomers=Ui,window.filterInvoiceCustomerSearch=Wi,window.selectInvoiceCustomer=Gi,window.clearInvoiceCustomerSearch=Ki,window.invoiceCustomerChanged=qi,window.toggleInvoiceDiscMode=Ji,window.toggleInvoiceRecvSection=Yi,window.setInvoiceRecvType=Xi),document.addEventListener(`click`,e=>{let t=document.getElementById(`inv-cust-dropdown`),n=document.getElementById(`inv-cust-search-input`);t&&!t.contains(e.target)&&e.target!==n&&t.classList.add(`hidden`)}),window.addInvoiceItemRow=Ai,window.removeInvoiceItem=ji,window.updateInvoiceItem=Mi,window.applyHistoryPrice=Pi,window.saveAndPrintInvoice=Ri,window.setInvoiceTender=Fi,window.holdCurrentBill=Ii,window.resumeHoldBill=Li,window.invoiceCustomerChanged=qi,window.toggleInvoiceDiscMode=Ji,window.toggleInvoiceRecvSection=Yi,window.setInvoiceRecvType=Xi,window.quickAddCustomerFromInvoice=async()=>{window.quickAddCustomer&&(await window.quickAddCustomer(),await Ui())};var X={zones:[],customers:[],selectedZone:``,selectedStatus:`all`,selectedSort:`due_desc`};function Qi(){return X}function $i(e){X.selectedZone=e}function ea(e){X.selectedStatus=e}function ta(e){X.selectedSort=e}async function na(){try{let[e,t]=await Promise.all([p.getAllZones(),u.getAll(`name`,`asc`)]);return X.zones=e||[],X.customers=t||[],X}catch(e){return console.error(`Error loading zone report data:`,e),X}}async function ra(e=``){let{customers:t}=X,n=e||X.selectedZone,r=t.filter(e=>!n||(e.zone||``).trim()===n);if(r.length===0)return L.default.fire(`তালিকায় কোনো কাস্টমার নেই`,`সিলেক্ট করা জোনে কোনো কাস্টমার পাওয়া যায়নি।`,`warning`);r.sort((e,t)=>(e.accountNo||``).localeCompare(t.accountNo||``,void 0,{numeric:!0}));let i=await c.getAppSettings(),a=n?`${n} জোনের কাস্টমার বকেয়া খতিয়ান`:`সকল জোনের কাস্টমার বকেয়া খতিয়ান`,o=0;r.forEach(e=>o+=Number(e.totalDue)||0);let[s,l,u]=_().split(`-`),d=`${u}/${l}/${s}`,f=C(i,{title:n?`${n} ZONE REPORT`:`ZONE REPORT`,subtitle:`${a} • ${d}`}),p=`
        <div style="display:flex; justify-content:space-between; align-items:flex-end; border-bottom:2px solid #0284c7; padding-bottom:4px; margin-bottom:8px;">
            <div style="font-size:14px; font-weight:900; color:#0f172a; font-family:'Inter',sans-serif;">ZONE REPORT <span style="font-size:10px; color:#475569; font-weight:normal;">(Continued)</span></div>
            <div style="font-size:10px; color:#475569; font-family:'Hind Siliguri',sans-serif;">${a} • ${d}</div>
        </div>
    `;We(await Ve({rowsArray:r.map((e,t)=>{let n=t%2==0?`background: #ffffff;`:`background: #f8fafc;`,r=Number(e.totalDue)||0,i=r>0?`#dc2626`:r<0?`#059669`:`#64748b`,a=r===0?`৳ 0`:`৳ ${v(r)}`,o=e.zone?`<span style="background: #f1f5f9; border: 1px solid #cbd5e1; padding: 2px 7px; border-radius: 10px; font-size: 10px; font-weight: 700; color: #334155; display: inline-block;">${D(e.zone)}</span>`:`-`;return{html:`
            <tr class="print-row-no-break" style="${n}">
                <td style="text-align:center; vertical-align:middle; border: 1px solid #e2e8f0; padding: 5px 4px; font-size: 11px; font-family: 'Inter', sans-serif; color: #475569;">${t+1}</td>
                <td style="text-align:center; vertical-align:middle; border: 1px solid #e2e8f0; padding: 5px 4px; font-size: 11px; font-weight: 800; font-family: 'Inter', monospace; color: #0284c7;">${D(e.accountNo||`-`)}</td>
                <td style="text-align:left; vertical-align:middle; border: 1px solid #e2e8f0; padding: 5px 6px; font-size: 11px; font-family: 'Kalpurush', 'Hind Siliguri', sans-serif; line-height: 1.25; color: #0f172a;"><strong>${D(e.name)}</strong></td>
                <td style="text-align:left; vertical-align:middle; border: 1px solid #e2e8f0; padding: 5px 6px; font-size: 10.5px; font-family: 'Kalpurush', 'Hind Siliguri', sans-serif; line-height: 1.25; color: #334155;">${D(e.address||`-`)}</td>
                <td style="text-align:center; vertical-align:middle; border: 1px solid #e2e8f0; padding: 5px 4px; font-size: 11px; font-family: 'Inter', sans-serif; white-space: nowrap; color: #334155;">${D(e.phone||`-`)}</td>
                <td style="text-align:center; vertical-align:middle; border: 1px solid #e2e8f0; padding: 5px 4px; font-size: 11px; font-family: 'Kalpurush', 'Hind Siliguri', sans-serif;">${o}</td>
                <td style="text-align:right; vertical-align:middle; border: 1px solid #e2e8f0; padding: 5px 6px; font-size: 11px; font-weight: 900; color: ${i}; font-family: 'Inter', sans-serif; white-space: nowrap;">${a}</td>
            </tr>
        `,textLength:(e.address||``).length}}),page1HeaderHtml:f,repeatHeaderHtml:p,tableColHeaderHtml:`
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
                    <strong style="color: #dc2626; font-size: 15px; font-weight: 900;">৳ ${v(o)}</strong>
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
    `,formattedDate:d}))}async function ia(e=``){let{customers:t}=X,n=e||X.selectedZone,r=t.filter(e=>!n||(e.zone||``).trim()===n);if(r.length===0)return L.default.fire(`এরর`,`এক্সপোর্ট করার মতো কোনো কাস্টমার নেই।`,`warning`);if(typeof XLSX>`u`)return L.default.fire(`Error`,`SheetJS Library missing!`,`error`);r.sort((e,t)=>(e.accountNo||``).localeCompare(t.accountNo||``,void 0,{numeric:!0}));let i=r.map((e,t)=>({SL:t+1,"Account No":e.accountNo||``,"Customer Name":e.name||``,"Phone Number":e.phone||``,Zone:e.zone||``,Address:e.address||``,"Due Balance (BDT)":e.totalDue||0})),a=XLSX.utils.json_to_sheet(i),o=XLSX.utils.book_new(),s=n?`${n} Zone`:`All Zones`;XLSX.utils.book_append_sheet(o,a,s);let c=n?`MAA_ERP_Zone_${n}_${_()}.xlsx`:`MAA_ERP_All_Zones_${_()}.xlsx`;XLSX.writeFile(o,c),L.default.fire({title:`<i class="fa-solid fa-file-excel text-emerald-400 mr-2"></i>ডাউনলোড সফল!`,text:`কাস্টমার জোন রিপোর্ট ফাইল (${c}) ডাউনলোড করা হয়েছে।`,icon:`success`,customClass:{popup:`!bg-slate-900 !text-white !rounded-3xl border border-slate-700 font-bn`}})}async function aa(e=``){let{printZoneTagadaReport:t}=await G(async()=>{let{printZoneTagadaReport:e}=await import(`./zone-report-tagada-NxzPTW_k.js`);return{printZoneTagadaReport:e}},__vite__mapDeps([10,1,2,3,4,5,6,7,8]));return t(e?{...X,selectedZone:e}:X)}function oa(e){return!e||e.length===0?`<tr><td colspan="8" class="text-center py-12 text-slate-500 font-bold italic">কোনো কাস্টমার ডাটা পাওয়া যায়নি</td></tr>`:e.map((e,t)=>`
        <tr class="hover:bg-slate-800/40 transition-colors">
            <td class="p-3.5 text-center font-mono text-slate-400">${t+1}</td>
            <td class="p-3.5 text-center font-mono font-bold text-amber-400">${D(e.accountNo||`-`)}</td>
            <td class="p-3.5 font-bold text-white">${D(e.name)}</td>
            <td class="p-3.5 text-slate-300 text-xs">${D(e.address||`-`)}</td>
            <td class="p-3.5 text-center font-mono text-slate-300">${D(e.phone||`-`)}</td>
            <td class="p-3.5 text-center"><span class="px-2.5 py-1 rounded-md text-[11px] font-bold bg-slate-800 text-indigo-300 border border-slate-700">${D(e.zone||`N/A`)}</span></td>
            <td class="p-3.5 text-right font-black ${e.totalDue>0?`text-emerald-400`:e.totalDue<0?`text-rose-400`:`text-slate-400`}">৳ ${v(e.totalDue||0)}</td>
            <td class="p-3.5 text-center">
                <button onclick="if(window.navigateTo) window.navigateTo('ledger', { customerId: '${e.id}' })" class="px-3 py-1.5 rounded-lg bg-indigo-600/20 hover:bg-indigo-600 text-indigo-300 hover:text-white text-xs font-bold transition-all border border-indigo-500/30 cursor-pointer">লেজার</button>
            </td>
        </tr>
    `).join(``)}async function sa(e){e.innerHTML=`
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
    `,await ca()}async function ca(){let e=await na();la(e.zones,e.customers),ua()}function la(e,t){let n=document.getElementById(`zr-zone-pills-container`),r=document.getElementById(`zr-kpi-total-zones`);if(r&&(r.innerText=e.length),!n)return;let i=Qi().selectedZone||``,a=`
        <button onclick="window.zoneReportApp.selectZone('')" class="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap active:scale-95 ${i?`bg-slate-950 hover:bg-slate-800 text-slate-300 border border-slate-800`:`bg-gradient-to-r from-indigo-600 to-cyan-600 text-white shadow-lg shadow-indigo-500/20`}">
            <i class="fa-solid fa-border-all text-xs"></i>
            <span>সকল জোন (All Zones)</span>
            <span class="px-2 py-0.5 rounded-full text-[10px] font-black ${i?`bg-slate-800 text-slate-400`:`bg-black/30 text-white`}">${t.length}</span>
        </button>
    `;e.forEach(e=>{let n=t.filter(t=>(t.zone||``).trim()===e.name).length,r=i===e.name;a+=`
            <button onclick="window.zoneReportApp.selectZone('${D(e.name)}')" class="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap active:scale-95 ${r?`bg-gradient-to-r from-indigo-600 to-cyan-600 text-white shadow-lg shadow-indigo-500/20`:`bg-slate-950 hover:bg-slate-800 text-slate-300 border border-slate-800`}">
                <i class="fa-solid fa-location-dot text-xs ${r?`text-white`:`text-indigo-400`}"></i>
                <span>${D(e.name)}</span>
                <span class="px-2 py-0.5 rounded-full text-[10px] font-black ${r?`bg-black/30 text-white`:`bg-slate-800 text-slate-400`}">${n}</span>
            </button>
        `}),n.innerHTML=a}function ua(){let e=Qi(),t=document.getElementById(`zr-search-input`)?.value.trim().toLowerCase()||``,n=e.selectedStatus||`all`,r=e.selectedSort||`due_desc`,i=e.selectedZone||``,a=e.customers.filter(e=>{let r=!i||(e.zone||``).trim()===i,a=!t||(e.name||``).toLowerCase().includes(t)||(e.accountNo||``).toLowerCase().includes(t)||(e.phone||``).includes(t)||(e.address||``).toLowerCase().includes(t),o=Number(e.totalDue)||0,s=!0;return n===`due`?s=o>0:n===`zero`?s=o===0:n===`advance`&&(s=o<0),r&&a&&s});a.sort((e,t)=>r===`due_desc`?(Number(t.totalDue)||0)-(Number(e.totalDue)||0):r===`acc_asc`?(e.accountNo||``).localeCompare(t.accountNo||``,void 0,{numeric:!0}):r===`name_asc`?(e.name||``).localeCompare(t.name||``):0);let o=0;a.forEach(e=>o+=Number(e.totalDue)||0);let s=document.getElementById(`zr-kpi-total-custs`),c=document.getElementById(`zr-kpi-total-due`),l=document.getElementById(`zr-table-header-title`),u=document.getElementById(`zr-table-count-badge`);s&&(s.innerText=`${a.length} জন`),c&&(c.innerText=`৳ ${v(o)}`),u&&(u.innerText=`${a.length} জন কাস্টমার`),l&&(l.innerHTML=`<i class="fa-solid fa-list-check text-indigo-400"></i> ${i?`${i} জোনের কাস্টমার তালিকা`:`সকল জোনের কাস্টমার তালিকা`}`);let d=document.getElementById(`zr-table-body`);d&&(d.innerHTML=oa(a))}window.zoneReportApp={selectZone:e=>{$i(e);let t=Qi();la(t.zones,t.customers),ua()},setStatusFilter:e=>{ea(e),ua()},setSortBy:e=>{ta(e),ua()},refreshData:()=>ca(),renderFilteredTable:()=>ua(),printPDF:()=>ra(),printTagada:()=>aa(),exportExcel:()=>ia()};var da=!1;function fa(e){let t=e.target;setTimeout(()=>{document.activeElement===t&&t.setSelectionRange(0,2)},10)}function pa(e){let t=e.target,n=t.selectionStart;setTimeout(()=>{n<=2?t.setSelectionRange(0,2):n>=3&&n<=5?t.setSelectionRange(3,5):n>=6&&t.setSelectionRange(6,10)},10)}function ma(e){let t=e.target,n=e.key;if(e.altKey&&n===`ArrowDown`){t._parentOriginalInput?._flatpickr&&t._parentOriginalInput._flatpickr.toggle();return}if(![`Tab`,`Enter`,`ArrowLeft`,`ArrowRight`,`Home`,`End`,`Control`,`Meta`,`Alt`].includes(n)){if(n===`/`){e.preventDefault();let n=t.selectionStart;n<3?t.setSelectionRange(3,5):n<6&&t.setSelectionRange(6,10);return}!/^[0-9]$/.test(n)&&n!==`Backspace`&&n!==`Delete`&&e.preventDefault()}}function ha(e){let t=e.target;if(e.inputType&&e.inputType.includes(`delete`))return;let n=t.value,r=t.selectionStart,i=n.substring(0,2).replace(/\D/g,``),a=n.substring(3,5).replace(/\D/g,``),o=n.substring(6,10).replace(/\D/g,``);i.length===2&&!isNaN(parseInt(i,10))&&parseInt(i,10)>31&&(i=`31`),a.length===2&&!isNaN(parseInt(a,10))&&parseInt(a,10)>12&&(a=`12`);let s=i;if((n.length>2||r>2)&&(s+=`/`+a,(n.length>5||r>5)&&(s+=`/`+o)),n!==s){t.value=s;let e=r;(r===2||r===5)&&s.length>r&&e++,t.setSelectionRange(e,e)}if(i.length===2&&a.length===2&&o.length===4){let e=`${o}-${a}-${i}`;if(!isNaN(new Date(e).getTime())&&t._parentOriginalInput){let n=t._parentOriginalInput;n.value=e,n._flatpickr&&n._flatpickr.setDate(e,!1),n.dispatchEvent(new Event(`change`,{bubbles:!0}))}}}function ga(){document.querySelectorAll(`input.datepicker`).forEach(e=>{if(e._flatpickr){e.value&&e._flatpickr.setDate(e.value,!1);return}let t=e.value;if(t&&/^\d{2}\/\d{2}\/\d{4}$/.test(t)){let[n,r,i]=t.split(`/`);t=`${i}-${r}-${n}`,e.value=t}if(k(e,{dateFormat:`Y-m-d`,altInput:!0,altFormat:`d/m/Y`,allowInput:!0,clickOpens:!1,disableMobile:!0,onReady:(t,n,r)=>{if(r.altInput){let t=r.altInput;t.className=e.className+` flatpickr-alt-input`,t.classList.remove(`datepicker`),t.placeholder=e.placeholder||`DD/MM/YYYY`,t._parentOriginalInput=e,t.style.cursor=`text`,t.addEventListener(`focus`,fa),t.addEventListener(`click`,pa),t.addEventListener(`input`,ha),t.addEventListener(`keydown`,ma),e.style.setProperty(`display`,`none`,`important`),e.tabIndex=-1;let n=t.parentElement;if(!n||!n.classList.contains(`date-input-container`)){let e=document.createElement(`div`);e.className=`relative inline-flex items-center w-full date-input-container`,t.parentNode.insertBefore(e,t),e.appendChild(t),n=e}let i=n.querySelector(`.date-picker-icon-btn`);i&&i.remove();let a=document.createElement(`button`);a.type=`button`,a.tabIndex=-1,a.className=`date-picker-icon-btn absolute right-2.5 top-1/2 -translate-y-1/2 text-blue-400 hover:text-blue-300 transition-colors p-1 cursor-pointer flex items-center justify-center border-0 bg-transparent outline-none z-10`,a.title=`ক্যালেন্ডার খুলুন`,a.innerHTML=`<i class="fa-solid fa-calendar-days text-xs pointer-events-none"></i>`,a.addEventListener(`click`,e=>{e.preventDefault(),e.stopPropagation(),r.toggle()}),n.appendChild(a)}if(r.calendarContainer&&!r.calendarContainer.querySelector(`.fp-action-footer`)){let t=document.createElement(`div`);t.className=`fp-action-footer`,t.innerHTML=`
                        <button type="button" class="fp-btn-today"><i class="fa-solid fa-calendar-day"></i> আজকে</button>
                        <button type="button" class="fp-btn-yesterday"><i class="fa-solid fa-clock-rotate-left"></i> গতকাল</button>
                        <button type="button" class="fp-btn-clear"><i class="fa-solid fa-eraser"></i> ক্লিয়ার</button>
                    `,t.querySelector(`.fp-btn-today`).onclick=()=>{let e=new Date().toISOString().split(`T`)[0];r.setDate(e,!0),r.close()},t.querySelector(`.fp-btn-yesterday`).onclick=()=>{let e=new Date;e.setDate(e.getDate()-1);let t=e.toISOString().split(`T`)[0];r.setDate(t,!0),r.close()},t.querySelector(`.fp-btn-clear`).onclick=()=>{r.clear(),e.value=``,e.dispatchEvent(new Event(`change`,{bubbles:!0})),r.close()},r.calendarContainer.appendChild(t)}},onChange:(t,n,r)=>{da=!0,e.value=n,da=!1,e.dispatchEvent(new Event(`change`,{bubbles:!0})),e.dispatchEvent(new Event(`input`,{bubbles:!0})),r.close()}}),!e._valueIntercepted){e._valueIntercepted=!0;let t=Object.getOwnPropertyDescriptor(HTMLInputElement.prototype,`value`);Object.defineProperty(e,"value",{get(){return t.get.call(this)},set(e){let n=e||``;if(n&&/^\d{2}\/\d{2}\/\d{4}$/.test(n)){let[e,t,r]=n.split(`/`);n=`${r}-${t}-${e}`}let r=t.get.call(this);t.set.call(this,n),this._flatpickr&&n&&n!==r&&!da&&this._flatpickr.setDate(n,!1)},configurable:!0})}})}var _a=new MutationObserver(e=>{e.forEach(e=>{e.addedNodes.forEach(e=>{e.nodeType===1&&(e.classList?.contains(`datepicker`)&&setTimeout(()=>ga(),0),e.querySelectorAll?.(`.datepicker`).forEach(()=>setTimeout(()=>ga(),0)))})})});function va(){_a.observe(document.body,{childList:!0,subtree:!0})}window.initDatePickers=ga;async function ya(){try{let e=await c.getAppSettings(),t=e.shopLogo,n=e.shopName||`MAA ERP`;if(document.title=`${n} - ERP`,!t)return;let r=document.getElementById(`dynamic-favicon`);r||(r=document.createElement(`link`),r.id=`dynamic-favicon`,r.rel=`icon`,document.head.appendChild(r)),r.href=t;let i=document.getElementById(`dynamic-apple-icon`);i||(i=document.createElement(`link`),i.id=`dynamic-apple-icon`,i.rel=`apple-touch-icon`,document.head.appendChild(i)),i.href=t;let a=document.querySelector(`link[rel="manifest"]`);if(a){let e={name:n,short_name:n.split(` `)[0],description:`Professional Business Ledger & Accounting System`,start_url:`/`,display:`standalone`,background_color:`#0F172A`,theme_color:`#0F172A`,orientation:`portrait-primary`,icons:[{src:t,sizes:`192x192`,type:`image/png`,purpose:`any maskable`},{src:t,sizes:`512x512`,type:`image/png`,purpose:`any maskable`}]},r=new Blob([JSON.stringify(e)],{type:`application/json`});a.href=URL.createObjectURL(r)}}catch(e){console.warn(`App branding apply error:`,e)}}function ba(e,t={}){F.currentView===`dashboard`&&e!==`dashboard`&&Pn(),F.currentView===`audit`&&e!==`audit`&&fe(),F.currentView=e;let n=document.getElementById(`app-sidebar`);n&&n.classList.remove(`open`),document.querySelectorAll(`.nav-links li, .nav-item`).forEach(t=>{t.classList.remove(`active`);let n=t.getAttribute(`onclick`);n&&n.includes(`'${e}'`)&&t.classList.add(`active`)});let r=document.getElementById(`view-container`);if(r){switch(e){case`dashboard`:Fn(r,t);break;case`customers`:vt(r);break;case`ledger`:fn(r,t);break;case`zone-reports`:sa(r);break;case`bulk`:Qr(r);break;case`invoice`:Zi(r,t);break;case`expenses`:Vn(r);break;case`settings`:yr(r);break;case`statement`:Ir(r,t);break;case`admin`:ii(r);break;case`audit`:he(r)}setTimeout(ga,50)}}function xa(){W(),ya();let e=document.getElementById(`login-error`);e&&(e.innerText=``);let t=document.getElementById(`login-screen`),r=document.getElementById(`app-container`);t&&(t.style.display=`none`),r&&r.classList.remove(`hidden`);let i=document.getElementById(`user-role`);i&&(i.innerText=F.currentUserRole||`User`);let a=n.auth().currentUser,o=document.getElementById(`user-profile-avatar`);o&&a&&(o.innerHTML=a.photoURL?`<img src="${a.photoURL}" class="w-full h-full object-cover rounded-full" referrerpolicy="no-referrer" />`:`<i class="fa-solid fa-user-shield text-sm"></i>`,o.title=`${a.email} (${F.currentUserRole})`),ba(F.currentView||`dashboard`)}function Sa(){let e=document.getElementById(`app-sidebar`);e&&(e.classList.toggle(`collapsed`),localStorage.setItem(`sidebarCollapsed`,e.classList.contains(`collapsed`)))}window.navigate=ba,window.navigateTo=ba,window.unlockApp=xa;async function Ca(){let e=document.getElementById(`email-input`)?.value,t=document.getElementById(`password-input`)?.value,n=document.getElementById(`login-error`);if(!e||!t)return n?n.innerText=`ইমেইল ও পাসওয়ার্ড দিন!`:null;try{await l.signInWithEmailAndPassword(e,t)}catch{n&&(n.innerText=`লগইন ব্যর্থ! সঠিক তথ্য দিন।`)}}async function wa(){let e=document.getElementById(`login-error`);e&&(e.innerText=`গুগল লগইন প্রসেস করা হচ্ছে...`);try{await l.signInWithPopup(s)}catch(t){console.warn(`Popup blocked, trying redirect:`,t);try{await l.signInWithRedirect(s)}catch{e&&(e.innerText=`গুগল লগইন ব্যর্থ!`)}}}function Ta(){let e=n.auth().currentUser;e&&P(`LOGOUT`,`Auth`,e.uid,e.email),l.signOut();let t=document.getElementById(`login-screen`),r=document.getElementById(`app-container`);t&&(t.style.display=`flex`),r&&r.classList.add(`hidden`),[`nav-admin`,`nav-audit`].forEach(e=>document.getElementById(e)?.classList.add(`hidden`)),Aa()}var Ea=null;function Da(){l.getRedirectResult().catch(e=>console.warn(`Redirect result handled:`,e)),l.onAuthStateChanged(async e=>{Ea&&=(Ea(),null),e?Ea=d.listenUser(e.uid,async t=>{let r=t,i=e.email?.toLowerCase().trim()||``,a=i===`office.maamotors@gmail.com`||i===`maamotorsbd@gmail.com`||i===`omarfarukitbd@gmail.com`;if(!t){r={email:e.email,name:e.displayName||e.email.split(`@`)[0],photoURL:e.photoURL||``,role:a?`Admin`:`Staff`,status:a?`active`:`pending`,pin:``,createdAt:n.firestore.FieldValue.serverTimestamp(),lastLogin:n.firestore.FieldValue.serverTimestamp()};try{await d.getRef(e.uid).set(r)}catch(e){console.error(`Error setting user document:`,e)}if(!a){ka(e.email);return}}else if(a&&(t.status!==`active`||t.role!==`Admin`)){r={...t,role:`Admin`,status:`active`};try{await d.update(e.uid,{role:`Admin`,status:`active`})}catch(e){console.error(`Error auto-healing master user:`,e)}}if(F.currentUserRole=r.role||`Staff`,F.currentUserEmail=r.email||e.email,F.permissions=r.permissions||{},r.status===`active`){Aa();let t=document.getElementById(`app-container`);if(t&&t.classList.contains(`hidden`))if(F.currentUserRole===`Admin`)[`nav-admin`,`nav-audit`].forEach(e=>document.getElementById(e)?.classList.remove(`hidden`)),P(`LOGIN`,`Auth`,e.uid,e.email,{role:`Admin`}),xa(),Oa();else{let t=`login_pin_`+Math.random().toString(36).substring(7),{value:n}=await L.default.fire({title:`<div class="flex items-center justify-center gap-2 text-white font-bn"><i class="fa-solid fa-lock text-amber-400"></i><span>অ্যাক্সেস পিন দিন</span></div>`,input:`password`,inputLabel:`সফটওয়্যারে ঢুকতে আপনার ৪-ডিজিট পিন দিন`,inputPlaceholder:`Enter PIN`,inputAttributes:{autocomplete:`off`,autocorrect:`off`,autocapitalize:`off`,spellcheck:`false`,name:t,"aria-autocomplete":`none`,"data-lpignore":`true`,"data-1p-ignore":`true`},allowOutsideClick:!1,showCancelButton:!0,cancelButtonText:`লগআউট`,customClass:{popup:`!bg-slate-900 !text-white !rounded-3xl border border-slate-700`,title:`!text-white`,confirmButton:`m3-btn-primary !py-2.5`,cancelButton:`m3-btn-tonal !py-2.5`},didOpen:()=>{let e=L.default.getInput();e&&(e.setAttribute(`autocomplete`,`off`),e.setAttribute(`name`,t),e.setAttribute(`readonly`,`readonly`),setTimeout(()=>e.removeAttribute(`readonly`),50))}});n===r.pin&&n?(P(`LOGIN`,`Auth`,e.uid,e.email,{role:`Staff`}),xa()):(n&&L.default.fire(`ভুল পিন!`,`আপনি সঠিক পিন দেননি।`,`error`),Ta())}}else r.status===`pending`?ka(e.email):(Ta(),document.getElementById(`login-error`)&&(document.getElementById(`login-error`).innerText=`আপনার একাউন্ট ব্লক করা হয়েছে।`))}):(Ta(),Aa())})}function Oa(){d.listenAll(e=>{let t=e.filter(e=>e.status===`pending`).length,n=document.getElementById(`nav-admin`);if(n){let e=document.getElementById(`pending-users-badge`);t>0?(e||(e=document.createElement(`span`),e.id=`pending-users-badge`,e.className=`ml-auto bg-amber-500 text-slate-950 font-black text-[10px] px-2 py-0.5 rounded-full animate-pulse shadow-md`,n.appendChild(e)),e.innerText=`${t} Pending`):e&&e.remove()}})}function ka(e){let t=document.getElementById(`login-screen`);if(t&&(t.style.display=`none`),document.getElementById(`waiting-room`))return;let n=document.createElement(`div`);n.id=`waiting-room`,n.className=`fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/90 backdrop-blur-xl p-4 font-bn`,n.innerHTML=`
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
    `,document.body.appendChild(n)}function Aa(){document.getElementById(`waiting-room`)?.remove()}var ja,Z=-1;function Ma(){let e=document.getElementById(`global-search-input`),t=document.getElementById(`global-search-results`);!e||!t||(e.oninput=e=>{let n=e.target.value.trim();if(n.length<1)return Z=-1,t.classList.add(`hidden`);clearTimeout(ja),ja=setTimeout(async()=>{t.classList.remove(`hidden`),t.innerHTML=`<div class="p-4 text-xs text-slate-500 text-center"><i class="fa-solid fa-spinner fa-spin mr-2 text-blue-500"></i>অনুসন্ধান করা হচ্ছে...</div>`,Pa(n,t),Z=-1},150)},document.addEventListener(`keydown`,n=>{if((n.ctrlKey||n.metaKey)&&n.key.toLowerCase()===`k`)n.preventDefault(),e.focus(),e.select();else if(n.key===`Escape`)t.classList.add(`hidden`);else if(t&&!t.classList.contains(`hidden`)){let e=t.querySelectorAll(`.search-result-item`);n.key===`ArrowDown`?(n.preventDefault(),Z=Math.min(Z+1,e.length-1),Na(e)):n.key===`ArrowUp`?(n.preventDefault(),Z=Math.max(Z-1,0),Na(e)):n.key===`Enter`&&Z>=0&&(n.preventDefault(),e[Z].click())}}))}function Na(e){e.forEach((e,t)=>{t===Z?(e.classList.add(`bg-blue-600/20`,`border-blue-500/50`),e.scrollIntoView({block:`nearest`,behavior:`smooth`})):e.classList.remove(`bg-blue-600/20`,`border-blue-500/50`)})}async function Pa(e,t){try{let n=``,r=e.toLowerCase(),i=r.replace(/^#/,``),o=U().filter(t=>typeof window.matchCustomerSearch==`function`?window.matchCustomerSearch(t,e):t.accountNo&&t.accountNo.toLowerCase().includes(i)||t.name&&t.name.toLowerCase().includes(r)||t.phone&&t.phone.includes(i));if(o.length>0&&(n+=`<div class="px-3 py-1.5 bg-slate-800/80 text-[10px] text-blue-400 font-black tracking-widest uppercase border-b border-slate-700/50">কাস্টমার (${o.length})</div>`,o.forEach(e=>{n+=`
                <div class="search-result-item p-3 hover:bg-slate-800 cursor-pointer flex justify-between items-center border-b border-slate-800 transition-all group"
                    onclick="window.handleSearchResultClick('customer', '${e.id}', '${e.name.replace(/'/g,`\\'`)}', '${e.accountNo||``}')">
                    <div class="overflow-hidden">
                        <div class="font-bold text-slate-200 text-sm group-hover:text-blue-400 transition-colors">${e.name}</div>
                        <div class="text-[10px] text-slate-500">${e.phone||`No Phone`}</div>
                    </div>
                    <div class="text-xs font-black text-red-400">৳${v(e.totalDue||0)}</div>
                </div>`})),i.length>=2){let e=await a.getByVoucher(i),t=new Set,r=e.filter(e=>!t.has(e.voucherNo)&&(t.add(e.voucherNo),!0));r.length>0&&(n+=`<div class="px-3 py-1.5 bg-slate-800/80 text-[10px] text-emerald-400 font-black tracking-widest uppercase border-b border-slate-700/50 mt-1">ভাউচার (${r.length})</div>`,r.forEach(e=>{let t=(Number(e.bill)||0)>0?`৳${v(e.bill)}`:`৳${v(e.paid)}`;n+=`
                    <div class="search-result-item p-3 hover:bg-slate-800 cursor-pointer flex justify-between items-center border-b border-slate-800 transition-all group"
                        onclick="window.handleSearchResultClick('voucher', '${e.voucherNo}')">
                        <div>
                            <div class="font-bold text-slate-200 text-sm group-hover:text-emerald-400 transition-colors">#${e.voucherNo} • ${e.customerName}</div>
                            <div class="text-[10px] text-slate-500">${E(e.date)}</div>
                        </div>
                        <div class="text-xs font-black text-white">${t}</div>
                    </div>`}))}t.innerHTML=n||`<div class="p-8 text-center text-xs text-slate-500 italic">কিছু পাওয়া যায়নি</div>`}catch(e){console.error(e),t.innerHTML=`<div class="p-4 text-center text-red-400">Error during search</div>`}}function Fa(e,t,n,r){if(document.getElementById(`global-search-results`)?.classList.add(`hidden`),document.getElementById(`global-search-input`).value=``,e===`customer`){let e=F.currentView;if(e===`invoice`){let e=document.getElementById(`inv-customer-select`);e&&(e.value=t,window.invoiceCustomerChanged())}else if(e===`ledger`){let e=document.getElementById(`ledger-customer-select`);e&&(e.value=t,window.filterLedgerByCustomer(t))}else if(e===`customers`){let e=document.getElementById(`cust-search-input`);e&&(e.value=r||n,window.filterCustomerList(),setTimeout(()=>{document.querySelectorAll(`#customer-list tr`).forEach(e=>{e.innerText.includes(n)&&(e.classList.add(`bg-blue-600/20`),e.scrollIntoView({behavior:`smooth`,block:`center`}))})},150))}else ba(`statement`,{customerId:t,customerName:n,accountNo:r})}else e===`voucher`&&ba(`ledger`,{filterVoucher:t})}window.handleSearchResultClick=Fa;var Ia=``,Q=!1,La=0,Ra=`0`,za=[];function Ba(e){if(!e)return`0`;let t=e.replace(/([0-9.]+)\s*([+-])\s*([0-9.]+)%/g,`$1 $2 ($1 * $3 / 100)`);if(t=t.replace(/%/g,`/100`),!/^[0-9+\-*/. ()]+$/.test(t))return`Error`;try{let e=Function(`"use strict"; return (${t})`)();return typeof e==`number`&&!isNaN(e)&&isFinite(e)?parseFloat(e.toFixed(6)).toString():`Error`}catch{return`Error`}}function Va(e){return e===`Error`||e===`Infinity`||e===`NaN`?`0`:e.split(/([+\-*/])/).map(e=>{if([`+`,`-`,`*`,`/`].includes(e))return e;if(!e)return``;let t=e.endsWith(`%`),n=t?e.slice(0,-1):e;if(n===`.`)return`.`+(t?`%`:``);if(n.includes(`.`)){let[e,r]=n.split(`.`);return(e?Number(e).toLocaleString(`en-IN`):`0`)+`.`+r+(t?`%`:``)}return Number(n).toLocaleString(`en-IN`)+(t?`%`:``)}).join(``)}var $;function Ha(){try{$||=new(window.AudioContext||window.webkitAudioContext),$.state===`suspended`&&$.resume();let e=$.createOscillator(),t=$.createGain();e.connect(t),t.connect($.destination),e.type=`sine`,e.frequency.setValueAtTime(800,$.currentTime),e.frequency.exponentialRampToValueAtTime(300,$.currentTime+.03),t.gain.setValueAtTime(.05,$.currentTime),t.gain.exponentialRampToValueAtTime(.01,$.currentTime+.03),e.start($.currentTime),e.stop($.currentTime+.03)}catch(e){console.error(`Audio click failed`,e)}}function Ua(e){Ha();let t=document.getElementById(`calc-display`),n=document.getElementById(`calc-history`);if(!t)return;let r=Ra;if((r===`Error`||r===`Infinity`||r===`NaN`)&&(r=`0`),[`MC`,`MR`,`M+`,`M-`].includes(e))e===`MC`?(La=0,n&&(n.innerText=`Memory Cleared`)):e===`MR`?(r=La.toString(),Q=!0):e===`M+`?(La+=parseFloat(Ba(r))||0,n&&(n.innerText=`M+ (Memory: `+Va(La.toString())+`)`),Q=!0):e===`M-`&&(La-=parseFloat(Ba(r))||0,n&&(n.innerText=`M- (Memory: `+Va(La.toString())+`)`),Q=!0);else if(e===`C`)r=`0`,Ia=``,n&&(n.innerText=``);else if(e===`⌫`||e===`Backspace`)Q?(r=`0`,Ia=``,n&&(n.innerText=``)):r=r.length>1?r.slice(0,-1):`0`;else if(e===`=`||e===`Enter`){let e=Ba(r);Ia=r+` =`,r!==e&&!Q&&(za.unshift({eq:r,res:e}),qa()),n&&(n.innerText=Ia),r=e,Q=!0}else if([`+`,`-`,`*`,`/`].includes(e)){Q=!1;let t=r.slice(-1);[`+`,`-`,`*`,`/`].includes(t)?r=r.slice(0,-1)+e:r+=e}else Q&&=(r=``,!1),r===`0`&&e!==`.`&&e!==`00`&&e!==`000`?r=e:r+=e;Ra=r||`0`,t.value=Va(Ra)}function Wa(){document.addEventListener(`keydown`,e=>{let t=document.getElementById(`calculator-widget`);!t||t.classList.contains(`hidden`)||(e.target.tagName!==`INPUT`||e.target.id===`calc-display`)&&e.target.tagName!==`TEXTAREA`&&[`0`,`1`,`2`,`3`,`4`,`5`,`6`,`7`,`8`,`9`,`.`,`+`,`-`,`*`,`/`,`%`,`=`,`Enter`,`Backspace`,`Escape`].includes(e.key)&&(e.preventDefault(),e.key===`Escape`?window.app.toggleCalculator():Ua(e.key))})}function Ga(){let e=document.getElementById(`calc-history-tape`);e&&e.classList.toggle(`hidden`)}async function Ka(){try{await navigator.clipboard.writeText(Ra);let e=document.getElementById(`calc-history`);if(e){let t=e.innerText;e.innerText=`Copied: `+Ra,setTimeout(()=>{e.innerText=t},1500)}}catch(e){console.error(`Copy failed`,e)}}function qa(){let e=document.getElementById(`calc-history-tape`);if(e){if(za.length===0){e.innerHTML=`<span class="text-center opacity-50 block py-4">No History</span>`;return}e.innerHTML=za.slice(0,15).map(e=>`
        <div class="border-b border-slate-800/50 pb-1 cursor-pointer hover:text-white transition-colors" onclick="window.handleCalc('C'); window.handleCalc('${e.res}')">
            <div class="text-[10px] text-slate-500">${Va(e.eq)} =</div>
            <div class="text-sm font-black text-blue-400">${Va(e.res)}</div>
        </div>
    `).join(``)}}function Ja(){let e=document.getElementById(`calculator-widget`),t=document.getElementById(`calc-drag-handle`);if(!e||!t)return;let n=!1,r=0,i=0,a=0,o=0,s=0,c=0;t.addEventListener(`mousedown`,l),t.addEventListener(`touchstart`,l,{passive:!0}),document.addEventListener(`mousemove`,u),document.addEventListener(`touchmove`,u,{passive:!1}),document.addEventListener(`mouseup`,d),document.addEventListener(`touchend`,d);function l(e){e.target.closest(`button`)||(a=(e.type===`touchstart`?e.touches[0].clientX:e.clientX)-s,o=(e.type===`touchstart`?e.touches[0].clientY:e.clientY)-c,n=!0)}function u(t){n&&(t.type===`touchmove`&&t.preventDefault(),r=(t.type===`touchmove`?t.touches[0].clientX:t.clientX)-a,i=(t.type===`touchmove`?t.touches[0].clientY:t.clientY)-o,s=r,c=i,e.style.transform=`translate(${r}px, ${i}px)`)}function d(){n=!1}}window.handleCalc=Ua,window.toggleCalcHistoryTape=Ga,window.copyCalcResult=Ka,window.app={login:Ca,loginWithGoogle:wa,logout:Ta,toggleSidebar:()=>document.getElementById(`app-sidebar`)?.classList.toggle(`open`),toggleSidebarCollapse:Sa,toggleCalculator:()=>document.getElementById(`calculator-widget`)?.classList.toggle(`hidden`)},document.addEventListener(`DOMContentLoaded`,()=>{let e=new URLSearchParams(window.location.search);if(e.get(`view`)===`public-stmt`&&e.get(`id`)){(async()=>{(await G(()=>import(`./statement-print-Dn4yWQmb.js`),__vite__mapDeps([9,1,2,3,4,5,6,7,8]))).renderPublicStatementView(e.get(`id`))})();return}if(e.get(`view`)===`public-memo`&&e.get(`id`)){(async()=>{(await G(()=>import(`./receipt-engine-D700sZE3.js`),__vite__mapDeps([0,1,2,3,4,5,6,7,8]))).renderPublicMemoView(e.get(`id`))})();return}Da(),Ma(),Je(),ga(),va(),S(),ee(),localStorage.getItem(`sidebarCollapsed`)===`true`&&document.getElementById(`app-sidebar`)?.classList.add(`collapsed`);let t=[{label:`MC`,class:`bg-slate-800 text-slate-400 text-[11px] font-bold hover:bg-slate-700`},{label:`MR`,class:`bg-slate-800 text-slate-400 text-[11px] font-bold hover:bg-slate-700`},{label:`M+`,class:`bg-slate-800 text-slate-400 text-[11px] font-bold hover:bg-slate-700`},{label:`M-`,class:`bg-slate-800 text-slate-400 text-[11px] font-bold hover:bg-slate-700`},{label:`C`,class:`bg-red-500/10 text-red-400 hover:bg-red-500 hover:text-white border border-red-500/20`},{label:`⌫`,class:`bg-slate-800 text-slate-300 hover:bg-slate-700 border border-slate-700/50`},{label:`%`,class:`bg-slate-800 text-blue-400 hover:bg-blue-600 hover:text-white font-black border border-slate-700/50`},{label:`/`,class:`bg-slate-800 text-blue-400 hover:bg-blue-600 hover:text-white font-black border border-slate-700/50`},{label:`7`,class:`bg-slate-800/60 text-white hover:bg-slate-700 border border-slate-700/30`},{label:`8`,class:`bg-slate-800/60 text-white hover:bg-slate-700 border border-slate-700/30`},{label:`9`,class:`bg-slate-800/60 text-white hover:bg-slate-700 border border-slate-700/30`},{label:`*`,class:`bg-slate-800 text-blue-400 hover:bg-blue-600 hover:text-white font-black border border-slate-700/50`},{label:`4`,class:`bg-slate-800/60 text-white hover:bg-slate-700 border border-slate-700/30`},{label:`5`,class:`bg-slate-800/60 text-white hover:bg-slate-700 border border-slate-700/30`},{label:`6`,class:`bg-slate-800/60 text-white hover:bg-slate-700 border border-slate-700/30`},{label:`-`,class:`bg-slate-800 text-blue-400 hover:bg-blue-600 hover:text-white font-black text-xl border border-slate-700/50`},{label:`1`,class:`bg-slate-800/60 text-white hover:bg-slate-700 border border-slate-700/30`},{label:`2`,class:`bg-slate-800/60 text-white hover:bg-slate-700 border border-slate-700/30`},{label:`3`,class:`bg-slate-800/60 text-white hover:bg-slate-700 border border-slate-700/30`},{label:`+`,class:`bg-slate-800 text-blue-400 hover:bg-blue-600 hover:text-white font-black text-xl border border-slate-700/50`},{label:`0`,class:`bg-slate-800/60 text-white hover:bg-slate-700 border border-slate-700/30`},{label:`00`,class:`bg-slate-800/60 text-white hover:bg-slate-700 border border-slate-700/30 text-sm`},{label:`000`,class:`bg-slate-800/60 text-white hover:bg-slate-700 border border-slate-700/30 text-[11px]`},{label:`.`,class:`bg-slate-800/60 text-white hover:bg-slate-700 font-black border border-slate-700/30 text-xl pb-1`},{label:`=`,class:`col-span-4 bg-blue-600 text-white hover:bg-blue-500 font-black shadow-lg shadow-blue-500/30 border border-blue-500`}],n=document.getElementById(`calc-buttons`);n&&(n.innerHTML=t.map(e=>`<button onclick="window.handleCalc('${e.label}')" class="h-full min-h-[36px] rounded-xl text-sm sm:text-base transition-all active:scale-95 ${e.class} flex items-center justify-center">${e.label}</button>`).join(``)),Wa(),Ja()});export{He as i,We as n,Ve as r,G as t};
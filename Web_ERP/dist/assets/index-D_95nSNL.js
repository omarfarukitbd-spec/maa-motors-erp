const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["assets/receipt-engine--dF8PpIU.js","assets/rolldown-runtime-Dd_uD5pT.js","assets/dao-BJg8z6Lo.js","assets/vendor-firebase-YQIUDKRL.js","assets/vendor-CJahiyzm.js","assets/vendor-CwbMEznW.css","assets/ui-helpers-BkH1xB3j.js","assets/vendor-ui-n4g2UPZQ.js","assets/vendor-ui-CveviJq_.css","assets/statement-print-COMjHxy5.js","assets/customer-state-CCQZLMlH.js","assets/smart-print-engine-B0360BA8.js","assets/zone-report-tagada-D9EKJdFQ.js"])))=>i.map(i=>d[i]);
import{i as e,n as t}from"./rolldown-runtime-Dd_uD5pT.js";import{t as n}from"./vendor-firebase-YQIUDKRL.js";import{n as r,t as i}from"./vendor-CJahiyzm.js";import{a,c as o,d as s,f as c,i as l,l as u,m as d,n as f,o as p,p as m,r as h,s as g}from"./dao-BJg8z6Lo.js";import{C as _,D as v,E as y,O as b,S as x,T as S,_ as C,a as w,b as T,c as E,d as ee,f as D,g as O,h as k,i as A,k as te,l as j,m as M,n as N,o as P,p as ne,r as re,s as ie,t as ae,u as oe,v as se,w as ce,x as le,y as ue}from"./customer-state-CCQZLMlH.js";import{a as de,c as F,d as I,f as L,i as R,l as z,n as fe,o as pe,p as B,r as me,s as V,t as he,u as H}from"./ui-helpers-BkH1xB3j.js";import{n as ge,t as _e}from"./vendor-ui-n4g2UPZQ.js";import{n as ve,t as ye}from"./smart-print-engine-B0360BA8.js";import{n as be,r as xe,t as Se}from"./vendor-excel-Cd8Spm_A.js";(function(){let e=document.createElement(`link`).relList;if(e&&e.supports&&e.supports(`modulepreload`))return;for(let e of document.querySelectorAll(`link[rel="modulepreload"]`))n(e);new MutationObserver(e=>{for(let t of e)if(t.type===`childList`)for(let e of t.addedNodes)e.tagName===`LINK`&&e.rel===`modulepreload`&&n(e)}).observe(document,{childList:!0,subtree:!0});function t(e){let t={};return e.integrity&&(t.integrity=e.integrity),e.referrerPolicy&&(t.referrerPolicy=e.referrerPolicy),t.credentials=e.crossOrigin===`use-credentials`?`include`:e.crossOrigin===`anonymous`?`omit`:`same-origin`,t}function n(e){if(e.ep)return;e.ep=!0;let n=t(e);fetch(e.href,n)}})();var U={currentUserRole:null,currentUserEmail:null,currentView:`dashboard`,permissions:{},shopName:`M/S. Maa Motors`,shopOwner:`Mohammed Amran`};window.AppState=U;var Ce=e(r());function we(e,t){if(window.AppState.currentUserRole===`Staff`&&window.AppState.permissions.viewCustomers===!1){e.innerHTML=`<div class="m3-card text-center"><h2 class="text-xl font-bold text-red-500 font-bn">অ্যাক্সেস ডিনাইড! আপনার কাস্টমার লিস্ট দেখার অনুমতি নেই।</h2></div>`;return}e.innerHTML=`
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
        </div>`,window.loadCustomers&&window.loadCustomers(),document.getElementById(`cust-date`)&&(document.getElementById(`cust-date`).value=window.getTodayLocalDateString?window.getTodayLocalDateString():new Date().toISOString().split(`T`)[0]),t&&t.openForm&&setTimeout(()=>{let e=document.getElementById(`add-customer-form`);e&&e.classList.remove(`hidden`)},150)}function Te(e){let t=document.getElementById(`customer-list`),n=document.getElementById(`customer-list-mobile`);if(!t)return;let r=String(window.AppState?.currentUserRole||``).toLowerCase()===`admin`,i=r||window.AppState?.permissions?.editCustomers!==!1&&window.AppState?.permissions?.manageCustomers!==!1,a=r||window.AppState?.permissions?.deleteCustomers===!0,o=[],s=``;e.forEach(e=>{let t=e.openingDate||``;if(!t&&e.createdAt)try{t=e.createdAt.toDate().toISOString().split(`T`)[0]}catch{t=F()}let n=Number(e.totalDue)||0,r=n>0?`text-red-400`:n<0?`text-emerald-400`:`text-slate-400`,c=String(e.id||``),l=String(e.name||`N/A`).replace(/'/g,`\\'`).replace(/"/g,`&quot;`),u=String(e.phone||`-`).replace(/'/g,`\\'`).replace(/"/g,`&quot;`),d=String(e.address||`-`).replace(/'/g,`\\'`).replace(/"/g,`&quot;`),f=String(e.zone||``).replace(/'/g,`\\'`).replace(/"/g,`&quot;`);o.push(`
            <tr class="hover:bg-white/[0.04] transition-colors border-b border-slate-800/60">
                <td class="py-2.5 px-3 text-xs font-bold text-slate-300 whitespace-nowrap">${V(t)}</td>
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
                        <span class="font-black text-sm ${r}">৳ ${I(Math.abs(n))}</span>
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
                        <div class="text-base font-black ${r}">৳ ${I(Math.abs(n))}</div>
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
            </div>`}),window.customerClusterize&&window.customerClusterize.destroy(),o.length>0?window.customerClusterize=new Ce.default({rows:o,scrollId:`cust-scroll-area`,contentId:`customer-list`}):t.innerHTML=`<tr><td colspan="6" class="text-center py-20 text-slate-500 italic font-bold">কোনো কাস্টমার পাওয়া যায়নি</td></tr>`,n&&(n.innerHTML=s||`<div class="text-center py-10 text-slate-500 font-bold italic">কোনো কাস্টমার পাওয়া যায়নি</div>`)}var W=e(ge());function Ee(){[`cust-name`,`cust-phone`,`cust-address`,`cust-initial-balance`].forEach(e=>{let t=document.getElementById(e);t&&(t.value=``)}),ce(`cust-initial-words`);let e=document.getElementById(`cust-date`);if(e){let t=F();e.value=t,e._flatpickr&&e._flatpickr.setDate(t,!1)}let t=document.getElementById(`cust-zone-select`);t&&(t.selectedIndex=0)}async function De(){if(!navigator.onLine)return W.default.fire({title:`<i class="fa-solid fa-wifi text-red-400 mr-2"></i>অফলাইন!`,html:`<p class="font-bn text-slate-300 text-sm">ইন্টারনেট সংযোগ নেই।<br><strong class="text-red-400">অফলাইনে নতুন কাস্টমার যোগ করা যাবে না।</strong><br><span class="text-xs text-slate-400 mt-1 block">অনুগ্রহ করে ইন্টারনেট চালু করে আবার চেষ্টা করুন।</span></p>`,icon:`error`,confirmButtonText:`ঠিক আছে`,customClass:{popup:`!bg-slate-950 !text-white !rounded-3xl border border-red-500/30 font-bn`,confirmButton:`m3-btn-primary !bg-red-600 hover:!bg-red-500 !px-6 !py-2 !rounded-xl font-bold`}});let e=z(document.getElementById(`cust-date`).value),t=document.getElementById(`cust-name`).value.trim(),r=document.getElementById(`cust-phone`).value.trim(),i=document.getElementById(`cust-address`).value.trim(),a=document.getElementById(`cust-zone-select`).value,o=document.getElementById(`cust-initial-balance`).value.trim();if(!t||!r||!a)return W.default.fire(`এরর`,`নাম, মোবাইল নম্বর ও জোন আবশ্যক!`,`error`);let s=safeRound(L(o)),u=document.getElementById(`cust-generated-acc`)?.value||`Auto`,d=_(s);if(!(await W.default.fire({title:`<div class="flex items-center justify-center gap-2 font-bn font-black text-xl text-white"><i class="fa-solid fa-file-shield text-blue-400"></i><span>তথ্য যাচাই করুন</span></div>`,html:`<div class="text-left space-y-3 font-bn p-3.5 bg-slate-900/90 rounded-2xl border border-slate-800 shadow-inner">
                <div class="grid grid-cols-2 gap-4 border-b border-slate-800/80 pb-2.5">
                    <div class="flex flex-col gap-1"><span class="text-[10px] text-blue-400 font-black uppercase tracking-wider">কাস্টমারের নাম</span><span class="text-base text-white font-black">${t}</span></div>
                    <div class="flex flex-col gap-1"><span class="text-[10px] text-amber-400 font-black uppercase tracking-wider">অ্যাকাউন্ট নং</span><span class="text-base text-amber-400 font-black font-mono">${u}</span></div>
                </div>
                <div class="grid grid-cols-2 gap-4 border-b border-slate-800/80 pb-2.5">
                    <div class="flex flex-col gap-1"><span class="text-[10px] text-blue-400 font-black uppercase tracking-wider">মোবাইল নম্বর</span><span class="text-sm text-slate-200 font-bold font-mono">${r}</span></div>
                    <div class="flex flex-col gap-1"><span class="text-[10px] text-purple-400 font-black uppercase tracking-wider">জোন</span><span class="text-sm text-slate-200 font-bold">${a}</span></div>
                </div>
                <div class="flex flex-col gap-1 border-b border-slate-800/80 pb-2.5">
                    <span class="text-[10px] text-sky-400 font-black uppercase tracking-wider flex items-center gap-1"><i class="fa-solid fa-location-dot text-amber-400 text-xs"></i>ঠিকানা (Address)</span>
                    <span class="text-xs text-slate-200 font-medium">${i||`N/A`}</span>
                </div>
                <div class="flex flex-col gap-1 pt-1">
                    <span class="text-[10px] text-emerald-400 font-black uppercase tracking-wider">অবশিষ্ট ব্যালেন্স (Opening)</span>
                    <span class="text-2xl text-emerald-400 font-black">৳ ${I(s)}</span>
                    ${d?`<div class="text-[11px] text-emerald-400 font-black italic bg-emerald-500/10 px-2.5 py-1 rounded-xl border border-emerald-500/20 mt-1">(${d})</div>`:``}
                </div>
                <div class="flex flex-col gap-1 pt-2 border-t border-slate-800/80">
                    <span class="text-[10px] text-slate-400 font-black uppercase tracking-wider">হিসাব খোলার তারিখ</span>
                    <span class="text-sm text-slate-300 font-bold font-mono">${V(e)}</span>
                </div>
            </div>
            <p class="text-xs text-amber-400 font-bold mt-4 text-center">সব তথ্য সঠিক থাকলে "কনফার্ম করুন" বাটনে ক্লিক করুন।</p>`,showCancelButton:!0,confirmButtonText:`<i class="fa-solid fa-circle-check mr-2"></i>কনফার্ম করুন`,cancelButtonText:`<i class="fa-solid fa-pen-to-square mr-2"></i>সংশোধন করব`,customClass:{popup:`!bg-slate-950 !text-white !rounded-3xl border border-slate-800 shadow-2xl font-bn`,confirmButton:`m3-btn-primary !bg-blue-600 hover:!bg-blue-500 !px-7 !py-2.5 !rounded-xl font-bold shadow-lg shadow-blue-600/30`,cancelButton:`m3-btn-tonal !bg-slate-800 hover:!bg-slate-700 !text-slate-300 !px-5 !py-2.5 !rounded-xl font-bold border border-slate-700`}})).isConfirmed)return;let f=document.getElementById(`save-cust-btn`);f&&(f.disabled=!0,f.innerText=`সেভ হচ্ছে...`);try{let o=``,u=``;await c.runTransaction(async c=>{let d=N.find(e=>e.name===a);u=(d?d.code:``)+await p.getNextAccountNo(a,c);let f=l.getRef();o=f.id;let m=g.getRef();c.set(f,{name:t,phone:r,address:i,zone:a||``,accountNo:u,openingDate:e,initialDue:s,totalDue:s,createdAt:n.firestore.FieldValue.serverTimestamp()}),c.set(m,{customerId:o,customerName:t,date:e,voucherNo:`OPENING`,bill:s>0?s:0,paid:s<0?Math.abs(s):0,prevDue:0,currentDue:s,notes:`প্রারম্ভিক জের (Opening Balance)`,createdBy:window.AppState?.currentUserEmail||`System`,createdAt:n.firestore.FieldValue.serverTimestamp()})}),S(`CREATE`,`Customers`,o,t,{phone:r,zone:a,initialBalance:s});let d=`কাস্টমার <strong>${t}</strong> সফলভাবে ডাটাবেসে যোগ করা হয়েছে। জোন: ${a||`N/A`}`;if(await W.default.fire({title:`সফল!`,html:d,icon:`success`,timer:1500,showConfirmButton:!1,customClass:{popup:`!bg-slate-900 !text-white !rounded-3xl border border-slate-700`}}),r&&r.trim()!==``&&r!==`-`)try{let e=await p.getAppSettings(),n=(typeof window.toBanglishName==`function`?window.toBanglishName(t):t)||`Customer`,i=e.shopName?typeof window.toBanglishName==`function`?window.toBanglishName(e.shopName):e.shopName:`M/S. Maa Motors`,a=window.formatAppDate&&window.getTodayLocalDateString?window.formatAppDate(window.getTodayLocalDateString()):`Today`,o=(e.smsTemplateOpening||`Dear [Name] [AccNo], A/C opened at [Shop] on [Date]. Opening Due: Tk [Due]. Thanks!`).replace(/\[Name\]/g,n).replace(/\[AccNo\]/g,`(A/C: ${u})`).replace(/\[Shop\]/g,i).replace(/\[Date\]/g,a).replace(/\[Due\]/g,I(Math.abs(s)));o=o.replace(/\s+/g,` `).replace(/[^\x00-\x7F]/g,``);let{value:c,isConfirmed:l}=await W.default.fire({title:`<div class="flex flex-col items-center gap-2"><i class="fa-solid fa-comment-sms text-emerald-400 text-3xl mb-1"></i><span class="font-bn font-black text-xl text-white">Welcome SMS</span></div>`,html:`<div class="text-left space-y-2 mb-2 font-bn">
                            <p class="text-[13px] text-slate-300">কাস্টমারকে কি অ্যাকাউন্ট খোলার মেসেজ পাঠাতে চান? চাইলে নিচের লেখা এডিট করতে পারেন:</p>
                            <div class="flex justify-between items-center"><div class="text-xs text-slate-400">Recipient Phone: <strong class="text-white">${r}</strong></div><div id="sms-open-char-counter" class="text-[11px] font-bold text-emerald-400 text-right">0 / 160 Characters (1 SMS)</div></div>
                           </div>`,input:`textarea`,inputValue:o,inputAttributes:{rows:4,class:`m3-field text-xs font-mono !mt-0`},showCancelButton:!0,confirmButtonText:`<i class="fa-solid fa-paper-plane mr-1.5"></i> পাঠিয়ে দিন`,cancelButtonText:`স্কিপ করুন`,customClass:{popup:`!bg-slate-950 !text-white !rounded-3xl border border-slate-700 shadow-2xl`,confirmButton:`m3-btn-primary !bg-emerald-600 hover:!bg-emerald-500 !px-7 !py-2.5 !rounded-xl font-bold shadow-lg shadow-emerald-600/30`,cancelButton:`m3-btn-tonal !bg-slate-800 hover:!bg-slate-700 !text-slate-300 !px-5 !py-2.5 !rounded-xl font-bold border border-slate-700`},didOpen:()=>{let e=W.default.getInput(),t=document.getElementById(`sms-open-char-counter`),n=()=>{if(e&&t){let n=e.value.length,r=Math.ceil(n/160)||1;t.innerText=`${n} / 160 Characters (${r} SMS)`}};e&&(e.oninput=n,n(),setTimeout(()=>e.focus(),150))}});l&&c&&await x(r,c,!1)&&R(`Welcome SMS পাঠানো হয়েছে`,`success`)}catch(e){console.error(`Welcome SMS Error:`,e)}Ee(),window.toggleAddCustomerForm&&window.toggleAddCustomerForm(),window.loadCustomers&&window.loadCustomers()}catch(e){k(e,`কাস্টমার যোগ করা যায়নি`)}finally{f&&(f.disabled=!1,f.innerText=`সেভ করুন`)}}async function Oe(e,t,r,i,a){if(window.AppState.currentUserRole!==`Admin`)return W.default.fire(`অ্যাক্সেস ডিনাইড!`,`শুধুমাত্র অ্যাডমিন কাস্টমার তথ্য এডিট করতে পারবেন।`,`error`);if(!navigator.onLine)return W.default.fire({title:`<i class="fa-solid fa-wifi text-red-400 mr-2"></i>অফলাইন!`,html:`<p class="font-bn text-slate-300 text-sm">ইন্টারনেট সংযোগ নেই।<br><strong class="text-red-400">অফলাইনে কাস্টমার এডিট করা যাবে না।</strong><br><span class="text-xs text-slate-400 mt-1 block">অনুগ্রহ করে ইন্টারনেট চালু করে আবার চেষ্টা করুন।</span></p>`,icon:`error`,confirmButtonText:`ঠিক আছে`,customClass:{popup:`!bg-slate-950 !text-white !rounded-3xl border border-red-500/30 font-bn`,confirmButton:`m3-btn-primary !bg-red-600 hover:!bg-red-500 !px-6 !py-2 !rounded-xl font-bold`}});if(!await O(`কাস্টমার তথ্য এডিট (Authorization)`))return;let o=ae.find(t=>t.id===e),s=o&&o.initialDue||0,d=o?.openingDate||(o?.createdAt?o.createdAt.toDate().toISOString().split(`T`)[0]:F()),f=`<option value="">-- জোন সিলেক্ট --</option>`;N.forEach(e=>{let t=typeof e==`string`?e:e.name;f+=`<option value="${t}" ${t===a?`selected`:``}>${t}</option>`});let{value:m}=await W.default.fire({title:`<i class="fa-solid fa-user-pen text-blue-400 mr-2"></i>কাস্টমার তথ্য এডিট করুন`,html:`
            <div class="space-y-4 text-left p-1 font-bn">
                <div class="grid grid-cols-2 gap-4">
                    <div><label class="block text-[11px] font-black text-blue-400 uppercase mb-1 ml-1">হিসাব খোলার তারিখ *</label><input id="ed-d" class="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-white outline-none focus:border-blue-500 text-sm datepicker" value="${d}"></div>
                    <div><label class="block text-[11px] font-black text-blue-400 uppercase mb-1 ml-1">কাস্টমারের নাম *</label><input id="ed-n" class="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-white outline-none focus:border-blue-500 text-sm" value="${t}"></div>
                </div>
                <div><label class="block text-[11px] font-black text-blue-400 uppercase mb-1 ml-1">মোবাইল নম্বর *</label><input id="ed-p" class="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-white outline-none focus:border-blue-500 text-sm" value="${r}"></div>
                <div><label class="block text-[11px] font-black text-blue-400 uppercase mb-1 ml-1">ঠিকানা (ঐচ্ছিক)</label><input id="ed-a" class="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-white outline-none focus:border-blue-500 text-sm" value="${i}"></div>
                <div class="grid grid-cols-2 gap-4">
                    <div><label class="block text-[11px] font-black text-purple-400 uppercase mb-1 ml-1">জোন / অঞ্চল</label><select id="ed-z" class="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-white outline-none focus:border-blue-500 text-sm">${f}</select></div>
                    <div><label class="block text-[11px] font-black text-amber-400 uppercase mb-1 ml-1">অ্যাকাউন্ট নং (A/C No)</label><input id="ed-acc" class="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-amber-400 font-mono font-bold outline-none focus:border-amber-500 text-sm" value="${o?.accountNo||``}"></div>
                </div>
                <div>
                    <label class="block text-[11px] font-black text-emerald-500 uppercase mb-1 ml-1">Opening Balance</label>
                    <input id="ed-ib" class="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-emerald-400 font-bold outline-none focus:border-emerald-500 text-sm" value="${I(s)}" oninput="window.handleNumberInput(this); window.updateLiveWords(this, 'ed-ib-words');">
                    <div id="ed-ib-words" class="text-[11px] font-black text-emerald-400 mt-1.5 px-2 py-0.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 italic font-bn inline-block${s?``:` hidden`}">${s?`(`+_(s)+`)`:``}</div>
                </div>
            </div>
        `,showCancelButton:!0,confirmButtonText:`আপডেট করুন`,cancelButtonText:`বাতিল`,customClass:{popup:`!bg-slate-900 !text-white !rounded-3xl border border-slate-700`},didOpen:()=>{let e=document.getElementById(`ed-z`),t=document.getElementById(`ed-acc`);e&&t&&e.addEventListener(`change`,async()=>{let n=e.value;if(n)try{let e=(await u.getAllZones()).find(e=>e.name===n),r=e&&e.code||``,i=await p.peekNextAccountNo(n);t.value=r+i}catch(e){console.error(e)}})},preConfirm:()=>{let e=z(document.getElementById(`ed-d`).value),t=document.getElementById(`ed-n`).value.trim(),n=document.getElementById(`ed-p`).value.trim(),r=document.getElementById(`ed-a`).value.trim(),i=document.getElementById(`ed-z`).value,a=document.getElementById(`ed-acc`).value.trim(),o=safeRound(L(document.getElementById(`ed-ib`).value));return!t||!n?W.default.showValidationMessage(`নাম ও মোবাইল নম্বর আবশ্যক!`):{d:e,n:t,p:n,a:r,z:i,accNo:a,ib:o}}});if(m){let o=_(m.ib);if(!(await W.default.fire({title:`<i class="fa-solid fa-magnifying-glass text-amber-400 mr-2"></i>সংশোধন যাচাই করুন`,html:`<div class="text-left space-y-3 font-bn p-2 bg-slate-900 rounded-2xl border border-slate-800">
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
                        <span class="text-2xl text-emerald-400 font-black">৳ ${I(m.ib)}</span>
                        ${o?`<div class="text-[11px] text-emerald-500 font-black italic bg-emerald-500/10 px-2 py-1 rounded-lg border border-emerald-500/20 mt-1">(${o})</div>`:``}
                    </div>
                </div>
                <p class="text-[11px] text-amber-500 font-bold mt-4 text-center">তথ্যগুলো কি আপডেট করবেন?</p>`,showCancelButton:!0,confirmButtonText:`<i class="fa-solid fa-circle-check mr-2"></i>হ্যাঁ, আপডেট করুন`,cancelButtonText:`<i class="fa-solid fa-pen-to-square mr-2"></i>না, ঠিক করব`,customClass:{popup:`!bg-slate-950 !text-white !rounded-3xl border border-slate-800 shadow-2xl font-bn`,confirmButton:`m3-btn-primary !bg-blue-600 hover:!bg-blue-500 !px-7 !py-2.5 !rounded-xl font-bold shadow-lg shadow-blue-600/30`,cancelButton:`m3-btn-tonal !bg-slate-800 hover:!bg-slate-700 !text-slate-300 !px-5 !py-2.5 !rounded-xl font-bold border border-slate-700`}})).isConfirmed)return;try{W.default.fire({title:`আপডেট হচ্ছে...`,allowOutsideClick:!1,didOpen:()=>W.default.showLoading()});let o=safeRound(m.ib-s),u=l.getRef(e),f=await g.getByCustomer(e),p={name:m.n,phone:m.p,address:m.a,zone:m.z||``,accountNo:m.accNo||``,openingDate:m.d,initialDue:m.ib,totalDue:n.firestore.FieldValue.increment(o),updatedAt:n.firestore.FieldValue.serverTimestamp()},h=[e=>e.update(u,p)];f.forEach(e=>{let t={customerName:m.n};e.voucherNo===`OPENING`&&(t.date=m.d,t.bill=m.ib>0?m.ib:0,t.paid=m.ib<0?Math.abs(m.ib):0,t.currentDue=m.ib),h.push(n=>n.update(g.getRef(e.id),t))});for(let e=0;e<h.length;e+=400){let t=c.batch();h.slice(e,e+400).forEach(e=>e(t)),await t.commit()}S(`UPDATE`,`Customers`,e,m.n,{old:{name:t,phone:r,address:i,zone:a,initialDue:s,openingDate:d},new:m}),W.default.fire(`সফল!`,`কাস্টমার তথ্য ও একাউন্ট নম্বর (${m.accNo}) সফলভাবে আপডেট হয়েছে।`,`success`),window.loadCustomers&&window.loadCustomers()}catch(e){k(e,`কাস্টমার তথ্য আপডেট করা যায়নি`)}}}async function ke(){if(!navigator.onLine)return W.default.fire({title:`<i class="fa-solid fa-wifi text-red-400 mr-2"></i>অফলাইন!`,html:`<p class="font-bn text-slate-300 text-sm">ইন্টারনেট সংযোগ নেই।<br><strong class="text-red-400">অফলাইনে নতুন কাস্টমার যোগ করা যাবে না।</strong><br><span class="text-xs text-slate-400 mt-1 block">অনুগ্রহ করে ইন্টারনেট চালু করে আবার চেষ্টা করুন।</span></p>`,icon:`error`,confirmButtonText:`ঠিক আছে`,customClass:{popup:`!bg-slate-950 !text-white !rounded-3xl border border-red-500/30 font-bn`,confirmButton:`m3-btn-primary !bg-red-600 hover:!bg-red-500 !px-6 !py-2 !rounded-xl font-bold`}});let e=await u.getAllZones(),t=(t=``)=>{let n=`<option value="">-- জোন সিলেক্ট করুন --</option>`;return e.forEach(e=>{let r=e.name===t?`selected`:``;n+=`<option value="${e.name}" data-code="${e.code||``}" ${r}>${e.name} (${e.code||`N/A`})</option>`}),n+=`<option value="__NEW_ZONE__">+ নতুন জোন যোগ করুন...</option>`,n},r=F(),{value:i}=await W.default.fire({title:`<div class="flex items-center justify-center gap-2 font-bn font-black text-xl text-white"><i class="fa-solid fa-user-plus text-blue-400"></i><span>নতুন কাস্টমার যুক্ত করুন</span></div>`,html:`
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
                        <input id="sw-bal" type="text" class="w-full bg-slate-950/90 border border-emerald-500/40 rounded-xl px-3.5 py-2 text-emerald-400 outline-none focus:border-emerald-500 text-xs font-black transition-all" placeholder="০.০০" oninput="window.handleNumberInput(this); window.updateLiveWords(this, 'sw-bal-words');">
                        <div id="sw-bal-words" class="text-[10px] font-black text-emerald-400 mt-1 hidden italic truncate"></div>
                    </div>
                    <div>
                        <label class="block text-[11px] font-black text-slate-400 uppercase tracking-widest mb-1 ml-1">হিসাব খোলার তারিখ *</label>
                        <input id="sw-d" type="text" class="w-full bg-slate-950/90 border border-slate-700/80 rounded-xl px-3.5 py-2 text-white outline-none focus:border-blue-500 text-xs font-bold datepicker cursor-pointer" value="${r}">
                    </div>
                </div>
            </div>
        `,focusConfirm:!1,showCancelButton:!0,confirmButtonText:`<i class="fa-solid fa-circle-check mr-1.5"></i> সেভ করুন`,cancelButtonText:`বাতিল`,customClass:{popup:`!bg-slate-950 !text-white !rounded-3xl border border-slate-800 shadow-2xl !p-6 font-bn`,confirmButton:`m3-btn-primary !bg-blue-600 hover:!bg-blue-500 !text-white !rounded-xl !px-7 !py-2 font-bold`,cancelButton:`m3-btn-tonal !bg-slate-800 hover:!bg-slate-700 !text-slate-300 !rounded-xl !px-5 !py-2 font-bold border border-slate-700`},didOpen:()=>{let n=document.getElementById(`sw-z`),r=document.getElementById(`sw-add-zone-btn`),i=document.getElementById(`sw-zcode`),a=document.getElementById(`sw-acc`),o=async()=>{let e=n?.value;if(e===`__NEW_ZONE__`){n&&(n.value=``),s();return}let t=n?.options[n.selectedIndex],r=t&&t.dataset.code||``;if(i&&(i.value=r),e){let t=await p.peekNextAccountNo(e);a&&(a.value=r+t)}else a&&(a.value=``)},s=async()=>{let{value:r}=await W.default.fire({title:`নতুন জোন যুক্ত করুন`,html:`
                        <div class="space-y-3 text-left font-bn p-2">
                            <div><label class="block text-xs font-bold text-slate-300 mb-1">জোনের নাম * (যেমন: চট্টগ্রাম)</label><input id="nz-name" class="m3-field text-xs font-bold" placeholder="জোনের নাম"></div>
                            <div><label class="block text-xs font-bold text-slate-300 mb-1">জোন শর্ট কোড * (যেমন: CTG)</label><input id="nz-code" class="m3-field text-xs font-bold font-mono uppercase" placeholder="কোড"></div>
                        </div>`,showCancelButton:!0,confirmButtonText:`সেভ জোন`,cancelButtonText:`বাতিল`,customClass:{popup:`!bg-slate-950 !text-white !rounded-3xl border border-slate-800`},preConfirm:()=>{let e=document.getElementById(`nz-name`)?.value?.trim(),t=document.getElementById(`nz-code`)?.value?.trim()?.toUpperCase();return!e||!t?W.default.showValidationMessage(`জোনের নাম ও কোড আবশ্যক!`):{name:e,code:t}}});r&&r.name&&(await u.addZone(r.name,r.code),e=await u.getAllZones(),n&&(n.innerHTML=t(r.name),o()))};n&&n.addEventListener(`change`,o),r&&r.addEventListener(`click`,s)},preConfirm:()=>{let e=document.getElementById(`sw-n`)?.value?.trim(),t=document.getElementById(`sw-p`)?.value?.trim(),n=document.getElementById(`sw-z`)?.value?.trim(),i=document.getElementById(`sw-a`)?.value?.trim(),a=document.getElementById(`sw-bal`)?.value?.trim()||`0`,o=document.getElementById(`sw-d`)?.value?.trim()||r,s=document.getElementById(`sw-acc`)?.value||`Auto`;return!e||!t||!n?(W.default.showValidationMessage(`নাম, মোবাইল ও জোন আবশ্যক!`),!1):{n:e,p:t,z:n,a:i,initialBalance:safeRound(L(a)),d:z(o),accNo:s}}});if(i&&i.n){let t=_(i.initialBalance);if(!(await W.default.fire({title:`<div class="flex items-center justify-center gap-2 font-bn font-black text-xl text-white"><i class="fa-solid fa-file-shield text-blue-400"></i><span>তথ্য যাচাই করুন</span></div>`,html:`
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
                        <span class="text-2xl text-emerald-400 font-black">৳ ${I(i.initialBalance)}</span>
                        ${t?`<div class="text-[11px] text-emerald-400 font-black italic bg-emerald-500/10 px-2.5 py-1 rounded-xl border border-emerald-500/20 mt-1">(${t})</div>`:``}
                    </div>
                    <div class="flex flex-col gap-1 pt-2 border-t border-slate-800/80">
                        <span class="text-[10px] text-slate-400 font-black uppercase tracking-wider">হিসাব খোলার তারিখ</span>
                        <span class="text-sm text-slate-300 font-bold font-mono">${V(i.d)}</span>
                    </div>
                </div>
                <p class="text-xs text-amber-400 font-bold mt-4 text-center">সব তথ্য সঠিক থাকলে "কনফার্ম করুন" বাটনে ক্লিক করুন।</p>
            `,showCancelButton:!0,confirmButtonText:`<i class="fa-solid fa-circle-check mr-2"></i>কনফার্ম করুন`,cancelButtonText:`<i class="fa-solid fa-pen-to-square mr-2"></i>সংশোধন করব`,customClass:{popup:`!bg-slate-950 !text-white !rounded-3xl border border-slate-800 shadow-2xl font-bn`,confirmButton:`m3-btn-primary !bg-blue-600 hover:!bg-blue-500 !px-7 !py-2.5 !rounded-xl font-bold shadow-lg shadow-blue-600/30`,cancelButton:`m3-btn-tonal !bg-slate-800 hover:!bg-slate-700 !text-slate-300 !px-5 !py-2.5 !rounded-xl font-bold border border-slate-700`}})).isConfirmed)return;W.default.fire({title:`সেভ হচ্ছে...`,allowOutsideClick:!1,didOpen:()=>W.default.showLoading()});try{let t=``,r=i.accNo;return await c.runTransaction(async a=>{let o=e.find(e=>e.name===i.z);r=(o?o.code:``)+await p.getNextAccountNo(i.z,a);let s=l.getRef();t=s.id,a.set(s,{name:i.n,phone:i.p,address:i.a||``,zone:i.z,accountNo:r,initialDue:i.initialBalance,totalDue:i.initialBalance,openingDate:i.d,createdAt:n.firestore.FieldValue.serverTimestamp()});let c=g.getRef();a.set(c,{customerId:t,customerName:i.n,date:i.d,voucherNo:`OPENING`,bill:i.initialBalance>0?i.initialBalance:0,paid:i.initialBalance<0?Math.abs(i.initialBalance):0,prevDue:0,currentDue:i.initialBalance,notes:`প্রারম্ভিক জের (Opening Balance)`,createdBy:window.AppState?.currentUserEmail||`System`,createdAt:n.firestore.FieldValue.serverTimestamp()})}),S(`CREATE`,`Customers`,t,i.n,{phone:i.p,zone:i.z,initialBalance:i.initialBalance}),window.loadCustomersForDropdown&&await window.loadCustomersForDropdown(),window.loadCustomers&&window.loadCustomers(),W.default.fire({toast:!0,position:`top-end`,icon:`success`,title:`কাস্টমার "${i.n}" যুক্ত হয়েছে (ID: ${r})`,showConfirmButton:!1,timer:3e3,customClass:{popup:`!bg-slate-900 !text-white border border-slate-700`}}),t}catch(e){k(e,`কাস্টমার সেভ করা যায়নি`)}}}window.quickAddCustomer=ke;async function Ae(e,t){if(await O(`কাস্টমার ডিলেট (Master PIN)`,`deleteCustomer`)&&(await W.default.fire({title:`<i class="fa-solid fa-triangle-exclamation text-red-500 mr-2"></i>সাবধান!`,html:`<p class="text-xs text-slate-300 font-bn leading-relaxed mt-2 text-left">আপনি কি নিশ্চিত যে আপনি <strong>${t}</strong>-এর সম্পূর্ণ প্রোফাইল ডিলেট করতে চান?<br><br><span class="text-red-400 font-bold block bg-red-500/10 p-3 border border-red-500/20 rounded-xl"><i class="fa-solid fa-circle-exclamation mr-1.5"></i>কাস্টমার এবং তার সমস্ত লেনদেনের হিসেব চিরতরে মুছে যাবে। এটি আর কখনো রিকভার করা সম্ভব নয়।</span></p>`,icon:`warning`,showCancelButton:!0,confirmButtonText:`হ্যাঁ, ডিলেট করুন`,cancelButtonText:`বাতিল`,confirmButtonColor:`#dc2626`,customClass:{popup:`!bg-slate-950 !text-white !rounded-3xl border border-red-500/30 font-bn`,confirmButton:`m3-btn-primary !bg-red-600 hover:!bg-red-500`,cancelButton:`m3-btn-tonal !bg-slate-800`}})).isConfirmed)try{let n=await g.getByCustomer(e);await c.runTransaction(async t=>{for(let e of n)t.delete(g.getRef(e.id));t.delete(l.getRef(e))}),S(`DELETE`,`Customers`,e,t),R(`কাস্টমার ডিলেট সম্পন্ন হয়েছে`,`success`),window.renderCustomerTable&&window.renderCustomerTable()}catch(e){W.default.fire(`এরর`,`ডাটাবেস এরর।`,`error`),console.error(e)}}async function je(){if(window.AppState.currentUserRole!==`Admin`)return W.default.fire(`অ্যাক্সেস ডিনাইড!`,`শুধুমাত্র অ্যাডমিন কাস্টমার লিস্ট প্রিন্ট করতে পারবেন।`,`error`);if(!await O(`কাস্টমার লিস্ট প্রিন্ট (Full Report)`))return;let{value:e}=await W.default.fire({title:`<div class="flex items-center gap-2 text-sky-400 font-bold text-lg"><i class="fa-solid fa-sliders"></i> প্রিন্ট কলাম কাস্টমাইজেশন</div>`,html:`
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
        `,focusConfirm:!1,showCancelButton:!0,confirmButtonText:`<i class="fa-solid fa-print mr-1.5"></i> রিপোর্ট প্রিন্ট করুন`,cancelButtonText:`বাতিল`,customClass:{popup:`!bg-slate-900 !text-white !rounded-2xl border border-slate-700`,confirmButton:`!bg-sky-600 hover:!bg-sky-500 !text-white !font-bold !px-5 !py-2.5 !rounded-xl`,cancelButton:`!bg-slate-800 hover:!bg-slate-700 !text-slate-300 !font-bold !px-5 !py-2.5 !rounded-xl`},preConfirm:()=>{let e={sl:document.getElementById(`col-sl`).checked,date:document.getElementById(`col-date`).checked,acc:document.getElementById(`col-acc`).checked,code:document.getElementById(`col-code`).checked,name:document.getElementById(`col-name`).checked,addr:document.getElementById(`col-addr`).checked,phone:document.getElementById(`col-phone`).checked,zone:document.getElementById(`col-zone`).checked,bal:document.getElementById(`col-bal`).checked};return Object.values(e).some(Boolean)?e:(W.default.showValidationMessage(`কমপক্ষে ১টি কলাম সিলেক্ট করতেই হবে!`),!1)}});if(!e)return;let t=document.getElementById(`cust-search-input`)?.value.trim(),n=document.getElementById(`cust-filter-zone`)?.value,r=ae.filter(e=>{let r=!t||e.name.toLowerCase().includes(t.toLowerCase())||e.accountNo&&e.accountNo.includes(t),i=!n||e.zone===n;return r&&i});if(r.length===0)return W.default.fire(`Error`,`লিস্টে কোনো ডাটা নেই!`,`warning`);r.sort((e,t)=>(e.accountNo||``).localeCompare(t.accountNo||``,void 0,{numeric:!0}));let i=await p.getAppSettings(),a=await u.getAllZones(),o={};a&&a.length&&a.forEach(e=>o[(e.name||``).trim()]=(e.code||``).trim());let s=n?`${n} জোনের কাস্টমার লিস্ট`:`সকল কাস্টমার লিস্ট`,c=0;r.forEach(e=>c+=Number(e.totalDue)||0);let[l,d,f]=F().split(`-`),m=`${f}/${d}/${l}`,h=pe(i,{title:`CUSTOMER REPORT`,subtitle:`${s} • ${m}`}),g=`
        <div style="display:flex; justify-content:space-between; align-items:flex-end; border-bottom:2px solid #0284c7; padding-bottom:4px; margin-bottom:8px;">
            <div style="font-size:14px; font-weight:900; color:#0f172a; font-family:'Inter',sans-serif;">CUSTOMER REPORT <span style="font-size:10px; color:#475569; font-weight:normal;">(Continued)</span></div>
            <div style="font-size:10px; color:#475569; font-family:'Hind Siliguri',sans-serif;">${s} • ${m}</div>
        </div>
    `,_=r.map((t,n)=>{let r=n%2==0?`background: #ffffff;`:`background: #f8fafc;`,i=Number(t.totalDue)||0,a=i>0?`#dc2626`:i<0?`#059669`:`#64748b`,s=i===0?`৳ 0`:`৳ ${I(Math.abs(i))} ${i<0?`(Adv)`:``}`,c=t.zone?`<span style="background: #f1f5f9; border: 1px solid #cbd5e1; padding: 2px 7px; border-radius: 10px; font-size: 10px; font-weight: 700; color: #334155; display: inline-block;">${H(t.zone)}</span>`:`-`,l=`-`;if(t.createdAt)try{let e=t.createdAt.toDate?t.createdAt.toDate():new Date(t.createdAt);isNaN(e)||(l=e.toLocaleDateString(`en-GB`))}catch(e){console.error(`Error parsing customer creation date:`,e)}else t.date&&(l=t.date);let u=(t.zone||``).trim(),d=o[u]?o[u]:`-`,f=``;return e.sl&&(f+=`<td style="text-align:center; vertical-align:middle; border: 1px solid #e2e8f0; padding: 5px 4px; font-size: 11px; font-family: 'Inter', sans-serif; color: #475569;">${n+1}</td>`),e.date&&(f+=`<td style="text-align:center; vertical-align:middle; border: 1px solid #e2e8f0; padding: 5px 4px; font-size: 10.5px; font-family: 'Inter', sans-serif; color: #475569;">${l}</td>`),e.acc&&(f+=`<td style="text-align:center; vertical-align:middle; border: 1px solid #e2e8f0; padding: 5px 4px; font-size: 11px; font-weight: 800; font-family: 'Inter', monospace; color: #0284c7;">${H(t.accountNo||`-`)}</td>`),e.code&&(f+=`<td style="text-align:center; vertical-align:middle; border: 1px solid #e2e8f0; padding: 5px 4px; font-size: 10.5px; font-weight: 700; font-family: 'Inter', monospace; color: #475569;">${H(d)}</td>`),e.name&&(f+=`<td style="text-align:left; vertical-align:middle; border: 1px solid #e2e8f0; padding: 5px 6px; font-size: 11px; font-family: 'Kalpurush', 'Hind Siliguri', sans-serif; line-height: 1.25; color: #0f172a;"><strong>${H(t.name)}</strong></td>`),e.addr&&(f+=`<td style="text-align:left; vertical-align:middle; border: 1px solid #e2e8f0; padding: 5px 6px; font-size: 10.5px; font-family: 'Kalpurush', 'Hind Siliguri', sans-serif; line-height: 1.25; color: #334155;">${H(t.address||`-`)}</td>`),e.phone&&(f+=`<td style="text-align:center; vertical-align:middle; border: 1px solid #e2e8f0; padding: 5px 4px; font-size: 11px; font-family: 'Inter', sans-serif; white-space: nowrap; color: #334155;">${H(t.phone||`-`)}</td>`),e.zone&&(f+=`<td style="text-align:center; vertical-align:middle; border: 1px solid #e2e8f0; padding: 5px 4px; font-size: 11px; font-family: 'Kalpurush', 'Hind Siliguri', sans-serif;">${c}</td>`),e.bal&&(f+=`<td style="text-align:right; vertical-align:middle; border: 1px solid #e2e8f0; padding: 5px 6px; font-size: 11px; font-weight: 900; color: ${a}; font-family: 'Inter', sans-serif; white-space: nowrap;">${s}</td>`),{html:`<tr class="print-row-no-break" style="${r}">${f}</tr>`,textLength:e.addr?(t.address||``).length:10}}),v=``;e.sl&&(v+=`<th style="width: 32px; text-align: center; border: 1px solid #cbd5e1; padding: 7px 4px; font-size: 11px; font-weight: 900; color: #1e293b; font-family: 'Hind Siliguri', sans-serif;">SL</th>`),e.date&&(v+=`<th style="width: 70px; text-align: center; border: 1px solid #cbd5e1; padding: 7px 4px; font-size: 11px; font-weight: 900; color: #1e293b; font-family: 'Hind Siliguri', sans-serif;">তারিখ</th>`),e.acc&&(v+=`<th style="width: 65px; text-align: center; border: 1px solid #cbd5e1; padding: 7px 4px; font-size: 11px; font-weight: 900; color: #1e293b; font-family: 'Hind Siliguri', sans-serif;">A/C NO</th>`),e.code&&(v+=`<th style="width: 50px; text-align: center; border: 1px solid #cbd5e1; padding: 7px 4px; font-size: 11px; font-weight: 900; color: #1e293b; font-family: 'Hind Siliguri', sans-serif;">কোড</th>`),e.name&&(v+=`<th style="text-align: left; border: 1px solid #cbd5e1; padding: 7px 6px; font-size: 11px; font-weight: 900; color: #1e293b; font-family: 'Hind Siliguri', sans-serif;">কাস্টমারের নাম</th>`),e.addr&&(v+=`<th style="text-align: left; border: 1px solid #cbd5e1; padding: 7px 6px; font-size: 11px; font-weight: 900; color: #1e293b; font-family: 'Hind Siliguri', sans-serif;">ঠিকানা</th>`),e.phone&&(v+=`<th style="width: 100px; text-align: center; border: 1px solid #cbd5e1; padding: 7px 4px; font-size: 11px; font-weight: 900; color: #1e293b; font-family: 'Hind Siliguri', sans-serif;">মোবাইল নম্বর</th>`),e.zone&&(v+=`<th style="width: 65px; text-align: center; border: 1px solid #cbd5e1; padding: 7px 4px; font-size: 11px; font-weight: 900; color: #1e293b; font-family: 'Hind Siliguri', sans-serif;">জোন</th>`),e.bal&&(v+=`<th style="width: 85px; text-align: right; border: 1px solid #cbd5e1; padding: 7px 6px; font-size: 11px; font-weight: 900; color: #1e293b; font-family: 'Hind Siliguri', sans-serif;">ব্যালেন্স (৳)</th>`);let y=`<thead><tr style="background: #f1f5f9; border-bottom: 2px solid #cbd5e1;">${v}</tr></thead>`,b=`
        <div style="display: flex; justify-content: flex-end; margin-top: 16px; page-break-inside: avoid; break-inside: avoid;">
            <div style="width: 260px; background: #f8fafc; border: 1px solid #cbd5e1; border-radius: 10px; padding: 12px; font-family: 'Hind Siliguri', sans-serif; box-shadow: 0 1px 3px rgba(0,0,0,0.05);">
                <div style="display: flex; justify-content: space-between; font-size: 12px; margin-bottom: 6px; border-bottom: 1px dashed #cbd5e1; padding-bottom: 4px;">
                    <span style="color: #64748b; font-weight: 700;">মোট কাস্টমার:</span>
                    <strong style="color: #0f172a; font-weight: 900;">${r.length} জন</strong>
                </div>
                <div style="display: flex; justify-content: space-between; font-size: 12px;">
                    <span style="color: #64748b; font-weight: 700;">মার্কেটে মোট বকেয়া:</span>
                    <strong style="color: #dc2626; font-size: 15px; font-weight: 900;">৳ ${I(c)}</strong>
                </div>
            </div>
        </div>
    `,x=await ve({rowsArray:_,page1HeaderHtml:h,repeatHeaderHtml:g,tableColHeaderHtml:y,summaryHtml:b,signatureHtml:`
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
    `,formattedDate:m});ye(x)}async function Me(){try{let e=await u.getAllZones(),t=`<option value="">-- জোন সিলেক্ট --</option>`,n=`<option value="">-- সকল জোন (All Zones) --</option>`;j(e),e.forEach(e=>{t+=`<option value="${e.name}" data-code="${e.code}">${e.name} (Code: ${e.code})</option>`,n+=`<option value="${e.name}">${e.name}</option>`});let r=document.getElementById(`cust-zone-select`),i=document.getElementById(`cust-filter-zone`),a=document.getElementById(`dash-cust-zone-select`);r&&(r.innerHTML=t),i&&(i.innerHTML=n),a&&(a.innerHTML=t)}catch(e){console.error(`Error loading zones:`,e)}}async function Ne(e=`next`){let t=document.getElementById(`customer-list`);if(t){me(t,5);try{let t=e===`next`?P:ie.length>1?ie[ie.length-2]:null,n=await l.getByPage(20,t,`createdAt`,`desc`);D(n.lastDoc),e===`next`?t&&ie.push(t):ie.pop(),document.getElementById(`cust-current-page-display`).innerText=re,document.getElementById(`cust-prev-page`).disabled=re===1,document.getElementById(`cust-next-page`).disabled=n.count<20,Te(n.data)}catch(e){console.error(`Load customer page error:`,e),t.innerHTML=`<tr><td colspan="6" class="text-center py-20 text-red-400">ডাটা লোড করতে সমস্যা হয়েছে</td></tr>`}}}async function Pe(){let e=document.getElementById(`cust-search-input`)?.value.trim()||``,t=document.getElementById(`cust-filter-zone`)?.value||``,n=document.getElementById(`cust-pagination`);if(!e&&!t){ee(!1),n&&n.classList.remove(`hidden`),Ne();return}ee(!0),n&&n.classList.add(`hidden`);let r=ae;(!r||r.length===0)&&(r=await l.getAll(`name`,`asc`));let i=r.filter(n=>{let r=!e||(typeof window.matchCustomerSearch==`function`?window.matchCustomerSearch(n,e):(n.name||``).toLowerCase().includes(e.toLowerCase())),i=!t||n.zone===t;return r&&i});Te(i),Fe(i)}function Fe(e){let t=0;e.forEach(e=>t=safeRound(t+(Number(e.totalDue)||0)));let n=document.getElementById(`cust-count-badge`),r=document.getElementById(`cust-total-due-badge`);n&&(n.innerText=e.length),r&&(r.innerText=`৳ `+I(t))}async function Ie(e,t,n,r=``){if(window.AppState?.currentUserRole===`Staff`&&window.AppState?.permissions?.sendSMS===!1)return W.default.fire({title:`অ্যাক্সেস ডিনাইড!`,text:`আপনার কাস্টমারদের SMS পাঠানোর অনুমতি নেই।`,icon:`error`,customClass:{popup:`!bg-slate-900 !text-white !rounded-3xl border border-slate-700`}});if(!e||e===`-`||e.trim()===``)return W.default.fire({title:`মোবাইল নম্বর মিসিং!`,text:`কাস্টমার "${n}"-এর কোনো মোবাইল নম্বর যুক্ত করা নেই। কাস্টমার এডিট করে নম্বর যোগ করুন।`,icon:`warning`,customClass:{popup:`!bg-slate-900 !text-white !rounded-3xl border border-slate-700`}});if(await O(`বকেয়া রিমাইন্ডার SMS পাঠানো (Master PIN)`))try{let i=await p.getAppSettings(),a=(typeof window.toBanglishName==`function`?window.toBanglishName(n):n)||`Customer`,o=i.shopName?typeof window.toBanglishName==`function`?window.toBanglishName(i.shopName):i.shopName:`M/S. Maa Motors`,s=window.formatAppDate&&window.getTodayLocalDateString?window.formatAppDate(window.getTodayLocalDateString()):`Today`,c=r?`(A/C: ${r})`:``,l=(i.smsTemplateReminder||`Reminder: Dear [Name] [AccNo], your due is Tk [Due] on [Date]. Kindly clear payment soon. Thanks! - [Shop]`).replace(/\[Name\]/g,a).replace(/\[AccNo\]/g,c).replace(/\[Shop\]/g,o).replace(/\[Date\]/g,s).replace(/\[Due\]/g,I(Math.abs(t)));l=l.replace(/\s+/g,` `).replace(/[^\x00-\x7F]/g,``);let{value:u}=await W.default.fire({title:`<i class="fa-solid fa-comment-sms text-blue-400 mr-2"></i>Send Reminder SMS`,html:`<div class="text-left space-y-1 mb-2 font-bn"><div class="text-xs text-slate-400">Recipient Phone: <strong class="text-white">${e}</strong></div><div id="sms-rem-char-counter" class="text-[11px] font-bold text-emerald-400 text-right">0 / 160 Characters (1 SMS)</div></div>`,input:`textarea`,inputValue:l,inputAttributes:{rows:5,class:`m3-field text-xs font-mono`},showCancelButton:!0,confirmButtonText:`<i class="fa-solid fa-paper-plane mr-1.5"></i> Send SMS`,cancelButtonText:`Cancel`,customClass:{popup:`!bg-slate-900 !text-white !rounded-3xl border border-slate-700`},didOpen:()=>{let e=W.default.getInput(),t=document.getElementById(`sms-rem-char-counter`),n=()=>{if(e&&t){let n=e.value.length,r=Math.ceil(n/160)||1;t.innerText=`${n} / 160 Characters (${r} SMS)`}};e&&(e.oninput=n),n()}});u&&await x(e,u,!1)&&W.default.fire({title:`<i class="fa-solid fa-paper-plane text-emerald-400 mr-2"></i>সফল!`,text:`${n}-কে রিমাইন্ডার SMS সফলভাবে পাঠানো হয়েছে`,icon:`success`,customClass:{popup:`!bg-slate-900 !text-white !rounded-3xl border border-slate-700`}})}catch(e){console.error(e),W.default.fire(`ব্যর্থ!`,`ডাটাবেস এরর।`,`error`)}}async function Le(){let e=document.getElementById(`cust-zone-select`),t=document.getElementById(`cust-zone-code-display`),n=document.getElementById(`cust-generated-acc`);if(!(!e||!t||!n))if(e.selectedIndex>0){let r=e.value,i=e.options[e.selectedIndex].dataset.code;t.value=i;try{n.value=`লোডিং...`,n.value=i+await p.peekNextAccountNo(r)}catch(e){console.error(e),n.value=`Error`}}else t.value=``,n.value=``}async function Re(){let e=document.getElementById(`dash-cust-zone-select`),t=document.getElementById(`dash-cust-zone-code-display`),n=document.getElementById(`dash-cust-generated-acc`);if(!(!e||!t||!n))if(e.selectedIndex>0){let r=e.value,i=e.options[e.selectedIndex].dataset.code;t.value=i;try{n.value=`লোডিং...`,n.value=i+await p.peekNextAccountNo(r)}catch(e){console.error(e),n.value=`Error`}}else t.value=``,n.value=``}window.handleDashZoneChange=Re;async function ze(){if(await O(`বাল্ক তাগাদা পাঠানো`,`sendBulkSMS`))try{W.default.fire({title:`লোডিং...`,text:`বকেয়া কাস্টমার তালিকা স্ক্যান করা হচ্ছে...`,allowOutsideClick:!1,didOpen:()=>W.default.showLoading(),customClass:{popup:`!bg-slate-950 !text-white !rounded-3xl border border-slate-800 font-bn`}});let e=(await l.getAll()).filter(e=>(Number(e.totalDue)||0)>0&&e.phone).sort((e,t)=>(Number(t.totalDue)||0)-(Number(e.totalDue)||0));if(W.default.close(),e.length===0)return W.default.fire({title:`কোনো বকেয়া পাওয়া যায়নি!`,text:`বর্তমানে কোনো কাস্টমারের বকেয়া নেই বা মোবাইল নম্বর যুক্ত নেই।`,icon:`info`,customClass:{popup:`!bg-slate-950 !text-white !rounded-3xl border border-slate-800 font-bn`}});let t=(await p.getAppSettings()).shopName||`M/S. MAA-MOTOR'S`,n=V(F()),r=``;e.forEach((e,t)=>{let n=t<10?`checked`:``,i=e.accountNo?`(${e.accountNo})`:``;r+=`
                <tr class="border-b border-slate-800 hover:bg-slate-900/50 bulk-row" data-search="${(e.name+` `+(e.phone||``)+` `+(e.accountNo||``)).toLowerCase()}">
                    <td class="p-2 text-center w-8">
                        <input type="checkbox" class="bulk-cust-chk w-4 h-4 rounded cursor-pointer" data-id="${e.id}" data-due="${e.totalDue||0}" ${n}>
                    </td>
                    <td class="p-2 font-bold text-white text-xs">${e.name} <span class="text-amber-400 font-mono text-[11px]">${i}</span></td>
                    <td class="p-2 text-slate-300 text-xs font-mono">${e.phone}</td>
                    <td class="p-2 text-right font-black ${e.totalDue<0?`text-emerald-400`:`text-red-400`} text-xs font-mono">৳ ${I(Math.abs(e.totalDue))} ${e.totalDue<0?`(Adv)`:``}</td>
                </tr>
            `});let i=()=>{let e=document.querySelectorAll(`.bulk-cust-chk:checked`),t=0;e.forEach(e=>{t=B(t+Number(e.dataset.due||0))});let n=document.getElementById(`bulk-selected-count`),r=document.getElementById(`bulk-selected-sum`);n&&(n.innerText=`${e.length} জন`),r&&(r.innerText=`৳ ${I(t)}`)},{value:a}=await W.default.fire({title:`<div class="flex items-center justify-center gap-2 font-bn font-black text-xl text-amber-400"><i class="fa-solid fa-paper-plane text-2xl"></i><span>বাল্ক তাগাদা কাস্টমার সিলেক্টর প্যানেল</span></div>`,html:`
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
            `,showCloseButton:!0,showCancelButton:!0,confirmButtonText:`<i class="fa-solid fa-paper-plane mr-1.5"></i> ব্যাচ ডিসপ্যাচ শুরু করুন`,cancelButtonText:`বাতিল (Cancel)`,customClass:{popup:`!bg-slate-950 !text-white !rounded-3xl border border-amber-500/30 shadow-2xl font-bn max-w-2xl`,confirmButton:`m3-btn-primary !bg-amber-600 hover:!bg-amber-500 !px-6 !py-2.5 rounded-xl font-bold`,cancelButton:`m3-btn-tonal !bg-slate-800 hover:!bg-slate-700 !text-slate-300 !px-5 !py-2.5 rounded-xl font-bold`},didOpen:()=>{i();let e=document.getElementById(`bulk-cust-search`);e&&e.addEventListener(`input`,e=>{let t=e.target.value.toLowerCase().trim();document.querySelectorAll(`.bulk-row`).forEach(e=>{e.style.display=(e.dataset.search||``).includes(t)?``:`none`})});let t=document.getElementById(`btn-bulk-toggle-all`);t&&t.addEventListener(`click`,()=>{let e=document.querySelectorAll(`.bulk-cust-chk`),t=Array.from(e).some(e=>!e.checked);e.forEach(e=>e.checked=t),i()}),document.querySelectorAll(`.bulk-cust-chk`).forEach(e=>e.addEventListener(`change`,i))},preConfirm:()=>{let t=document.querySelector(`input[name="bulk_mode"]:checked`)?.value||`sms`,n=Array.from(document.querySelectorAll(`.bulk-cust-chk:checked`)).map(e=>e.dataset.id);return n.length===0?(W.default.showValidationMessage(`কমপক্ষে ১ জন কাস্টমার সিলেক্ট করতে হবে!`),!1):{mode:t,selectedCustomers:e.filter(e=>n.includes(e.id))}}});if(!a)return;a.mode===`sms`?await Be(a.selectedCustomers,t,n):await Ve(a.selectedCustomers,t,n)}catch(e){console.error(e),R(`বাল্ক ডিসপ্যাচ প্রসেসিং এ ট্রুটি হয়েছে`,`error`)}}async function Be(e,t,n){let r=0,i=0,a=!1;for(let o=0;o<e.length&&!a;o++){let s=e[o],c=Math.round((o+1)/e.length*100),l=await W.default.fire({title:`<div class="font-bn font-black text-lg text-white">বাল্ক SMS পাঠানো হচ্ছে (${o+1}/${e.length})</div>`,html:`
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
            `,allowOutsideClick:!1,showCloseButton:!0,showCancelButton:!0,showConfirmButton:!1,cancelButtonText:`<i class="fa-solid fa-xmark mr-1"></i> থামুন (Cancel Batch)`,customClass:{popup:`!bg-slate-950 !text-white !rounded-3xl border border-slate-800 font-bn`,cancelButton:`m3-btn-tonal !bg-red-950 hover:!bg-red-900 !text-red-300 border border-red-500/30`},didOpen:async()=>{try{let e=s.accountNo?` (${s.accountNo})`:``,a=I(Math.abs(s.totalDue||0)),o=s.totalDue<0?`Advance is Tk ${a}`:`due is Tk ${a}`,c=`Reminder: Dear ${s.name}${e}, your ${o} on ${n}. Kindly clear payment soon. Thanks! - ${t}`;await x(s.phone,c,!1)?r++:i++}catch(e){console.error(`Bulk SMS error:`,e),i++}setTimeout(()=>W.default.clickConfirm(),400)}});if(l.isDismissed&&(l.dismiss===W.default.DismissReason.cancel||l.dismiss===W.default.DismissReason.close)){a=!0,R(`বাল্ক SMS ডিসপ্যাচ থামানো হয়েছে`,`info`);break}}S(`BULK_DISPATCH`,`Customer`,`bulk_sms`,`Selected ${e.length} due bulk SMS dispatched`,{successCount:r,failCount:i}),a||W.default.fire({title:`<div class="font-bn font-black text-xl text-emerald-400"><i class="fa-solid fa-circle-check text-2xl mr-2"></i>ডিসপ্যাচ সম্পন্ন!</div>`,html:`
                <div class="space-y-2 font-bn text-slate-300 text-sm">
                    <p>মোট সিলেক্টেড কাস্টমার: <strong>${e.length} জন</strong></p>
                    <p class="text-emerald-400 font-bold"><i class="fa-solid fa-circle-check text-emerald-400 mr-1"></i> সফলভাবে পাঠানো হয়েছে: ${r} টি</p>
                    ${i>0?`<p class="text-red-400 font-bold"><i class="fa-solid fa-circle-xmark text-red-400 mr-1"></i> ব্যর্থ হয়েছে: ${i} টি</p>`:``}
                </div>
            `,icon:`success`,confirmButtonText:`ঠিক আছে`,customClass:{popup:`!bg-slate-950 !text-white !rounded-3xl border border-slate-800 font-bn`,confirmButton:`m3-btn-primary !bg-emerald-600`}})}async function Ve(e,t,n){let r=!1;for(let i=0;i<e.length&&!r;i++){let a=e[i],o=a.accountNo?` (${a.accountNo})`:``,s=I(Math.abs(a.totalDue||0)),c=a.totalDue<0?`অ্যাডভান্স জমা: ৳ ${s}`:`বকেয়া পরিমাণ: ৳ ${s}`,l=`Dear ${a.name}${o},\nআপনার ${c}\nতারিখ: ${n}\nঅনুগ্রহ করে দ্রুত পেমেন্ট পরিশোধের অনুরোধ করা হচ্ছে।\nধন্যবাদ! - ${t}`,u=String(a.phone).replace(/[^0-9]/g,``);u.startsWith(`0`)&&(u=`88`+u);let d=`https://api.whatsapp.com/send?phone=${u}&text=${encodeURIComponent(l)}`,f=i===e.length-1,p=await W.default.fire({title:`<div class="font-bn font-black text-lg text-emerald-400"><i class="fa-brands fa-whatsapp text-xl mr-2"></i>হোয়াটসঅ্যাপ তাগাদা (${i+1}/${e.length})</div>`,html:`
                <div class="space-y-3 font-bn text-left p-3 bg-slate-900 rounded-2xl border border-slate-800">
                    <div class="text-sm font-bold text-white">${a.name} <span class="text-amber-400 font-mono text-xs">${o}</span></div>
                    <div class="text-xs text-slate-300 font-mono">মোবাইল: ${a.phone}</div>
                    <div class="text-base ${a.totalDue<0?`text-emerald-400`:`text-red-400`} font-black font-mono">${a.totalDue<0?`অ্যাডভান্স`:`বকেয়া`}: ৳ ${s}</div>
                </div>
            `,showCloseButton:!0,showDenyButton:!f,showCancelButton:!0,confirmButtonText:`<i class="fa-brands fa-whatsapp mr-1"></i> চ্যাট ওপেন করুন`,denyButtonText:`<i class="fa-solid fa-forward-step mr-1"></i> স্কিপ (পরবর্তী)`,cancelButtonText:`<i class="fa-solid fa-xmark mr-1"></i> ব্যাচ বন্ধ করুন (Cancel)`,customClass:{popup:`!bg-slate-950 !text-white !rounded-3xl border border-emerald-500/30 font-bn`,confirmButton:`m3-btn-primary !bg-emerald-600 hover:!bg-emerald-500 !px-5 !py-2 rounded-xl text-xs font-bold`,denyButton:`m3-btn-tonal !bg-slate-800 hover:!bg-slate-700 !text-slate-300 !px-4 !py-2 rounded-xl text-xs font-bold`,cancelButton:`m3-btn-tonal !bg-red-950 hover:!bg-red-900 !text-red-300 border border-red-500/30 !px-4 !py-2 rounded-xl text-xs font-bold`}});if(p.isConfirmed)window.open(d,`_blank`);else if(p.isDismissed||p.dismiss===W.default.DismissReason.cancel||p.dismiss===W.default.DismissReason.close){r=!0,R(`হোয়াটসঅ্যাপ ব্যাচ বন্ধ করা হয়েছে`,`info`);break}}r||R(`হোয়াটসঅ্যাপ ব্যাচ প্রসেস সম্পন্ন হয়েছে`,`success`)}window.triggerBulkReminderFlow=ze;async function He(){w(),Me(),E(),Ne()}function Ue(e){oe(e===`next`?re+1:re-1),Ne(e)}function We(e){window.navigate(`ledger`,{customerId:e})}function Ge(e,t,n,r,i){window.navigate(`statement`,{customerId:e,customerName:t,accountNo:n||``,customerPhone:r||``,customerAddress:i||``})}window.renderCustomers=we,window.loadCustomers=He,window.initCustomerCache=w,window.getCustomerCache=A,window.saveNewCustomer=De,window.editCustomer=Oe,window.deleteCustomer=Ae,window.filterCustomerList=Pe,window.handleZoneChange=Le,window.sendReminderSMS=Ie,window.printFilteredCustomerList=je,window.changeCustomerPage=Ue,window.openCustomerLedger=We,window.openCustomerStatement=Ge,window.resetAddCustomerForm=Ee,window.loadAllZones=Me,window.triggerBulkReminderFlow=ze,window.toggleAddCustomerForm=()=>{let e=document.getElementById(`add-customer-form`);e&&(e.classList.toggle(`hidden`),e.classList.contains(`hidden`)||(Ee(),window.handleZoneChange&&window.handleZoneChange(),ne(`cust-address`,`cust-address-datalist`,`cust-address-chips`),setTimeout(()=>{e.scrollIntoView({behavior:`smooth`,block:`start`});let t=document.getElementById(`cust-name`);t&&t.focus()},80)))},window.quickAddZone=async function(){let{value:e}=await W.default.fire({title:`নতুন জোন (অঞ্চল) যোগ করুন`,html:`
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
        `,focusConfirm:!1,showCancelButton:!0,confirmButtonText:`সেভ করুন`,cancelButtonText:`বাতিল`,customClass:{popup:`!bg-slate-900 !text-white !rounded-3xl border border-slate-700`},preConfirm:()=>{let e=document.getElementById(`sw-zn`).value.trim(),t=document.getElementById(`sw-zc`).value.trim();return!e||!t?(W.default.showValidationMessage(`নাম ও কোড উভয়ই আবশ্যক!`),!1):{name:e,code:t}}});if(e)try{W.default.fire({title:`চেক করা হচ্ছে...`,allowOutsideClick:!1,didOpen:()=>W.default.showLoading()});let t=await u.getByCode(e.code);if(t)return W.default.fire(`Error!`,`জোন কোড "${e.code}" ইতিমধ্যে "${t.name}" জোনের জন্য ব্যবহার করা হয়েছে!`,`error`);await u.add({name:e.name,code:e.code}),W.default.fire(`সফল!`,`জোন "${e.name}" সফলভাবে তৈরি হয়েছে।`,`success`),Me()}catch(e){console.error(e),W.default.fire(`Error`,`জোন সেভ করা যায়নি: `+(e.message||e),`error`)}};function Ke(){return`
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
                                    <span id="dash-net-cash" class="flex items-center gap-1.5 text-emerald-200 font-inter"><i class="fa-solid fa-coins text-emerald-500"></i> নিট ক্যাশ: ৳ ০</span>
                                    <span class="text-emerald-400 font-black bg-emerald-500/10 px-1.5 py-0.5 rounded flex items-center gap-1 border border-emerald-500/20"><i class="fa-solid fa-cloud-arrow-up"></i> আদায় সিঙ্কড</span>
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
                                <input type="text" id="collection-list-datepicker" data-mode="range" class="m3-field py-1.5 bg-slate-950/80 h-8 text-[11px] w-44 datepicker cursor-pointer ml-2 text-center text-emerald-400 font-bold border-emerald-500/30 rounded-lg hover:border-emerald-500/60 transition-all" placeholder="Select Date Range">
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

                        <!-- Dynamic Payment Method Summary Cards -->
                        <div id="dash-collection-method-cards" class="flex flex-wrap items-center gap-3">
                        </div>

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
                        <div id="dash-collection-breakdown-list" class="flex flex-col gap-2 font-bn mt-1 max-h-48 overflow-y-auto custom-scrollbar pr-1 z-10">
                        </div>
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
        </div>`}function qe(e,t=[]){let n=document.getElementById(e);if(!n)return;let r=n.getContext(`2d`);if(!r)return;let i=n.parentElement.clientWidth||500;n.width=i,n.height=180,r.clearRect(0,0,i,180);let a=t.length>0?t:[{day:`Sat`,sales:12e3,col:15e3},{day:`Sun`,sales:25e3,col:18e3},{day:`Mon`,sales:18e3,col:22e3},{day:`Tue`,sales:3e4,col:28e3},{day:`Wed`,sales:22e3,col:26e3},{day:`Thu`,sales:35e3,col:32e3},{day:`Fri`,sales:28e3,col:31e3}],o=i-60,s=Math.max(...a.map(e=>Math.max(e.sales,e.col)),4e4),c=o/(a.length-1);r.strokeStyle=`rgba(51, 65, 85, 0.15)`,r.lineWidth=1,r.setLineDash([4,4]);for(let e=0;e<=3;e++){let t=30+120/3*e;r.beginPath(),r.moveTo(30,t),r.lineTo(i-30,t),r.stroke()}r.setLineDash([]);let l=r.createLinearGradient(0,30,0,150);l.addColorStop(0,`rgba(59, 130, 246, 0.4)`),l.addColorStop(1,`rgba(59, 130, 246, 0.0)`);let u=r.createLinearGradient(0,30,0,150);u.addColorStop(0,`rgba(16, 185, 129, 0.4)`),u.addColorStop(1,`rgba(16, 185, 129, 0.0)`),r.beginPath(),r.moveTo(30,150),a.forEach((e,t)=>{let n=30+t*c,i=150-e.sales/s*120;r.lineTo(n,i)}),r.lineTo(30+o,150),r.closePath(),r.fillStyle=l,r.fill(),r.beginPath(),r.moveTo(30,150),a.forEach((e,t)=>{let n=30+t*c,i=150-e.col/s*120;r.lineTo(n,i)}),r.lineTo(30+o,150),r.closePath(),r.fillStyle=u,r.fill(),r.beginPath(),r.strokeStyle=`#3B82F6`,r.lineWidth=3,a.forEach((e,t)=>{let n=30+t*c,i=150-e.sales/s*120;t===0?r.moveTo(n,i):r.lineTo(n,i)}),r.stroke(),r.beginPath(),r.strokeStyle=`#10B981`,r.lineWidth=3,a.forEach((e,t)=>{let n=30+t*c,i=150-e.col/s*120;t===0?r.moveTo(n,i):r.lineTo(n,i)}),r.stroke(),r.font=`bold 10px "Hind Siliguri", sans-serif`,r.textAlign=`center`,a.forEach((e,t)=>{let n=30+t*c,i=150-e.sales/s*120,a=150-e.col/s*120;r.shadowColor=`rgba(59, 130, 246, 0.8)`,r.shadowBlur=5,r.fillStyle=`#3B82F6`,r.beginPath(),r.arc(n,i,4,0,Math.PI*2),r.fill(),r.shadowBlur=0,r.fillStyle=`#fff`,r.beginPath(),r.arc(n,i,1.5,0,Math.PI*2),r.fill(),r.shadowColor=`rgba(16, 185, 129, 0.8)`,r.shadowBlur=5,r.fillStyle=`#10B981`,r.beginPath(),r.arc(n,a,4,0,Math.PI*2),r.fill(),r.shadowBlur=0,r.fillStyle=`#fff`,r.beginPath(),r.arc(n,a,1.5,0,Math.PI*2),r.fill(),r.fillStyle=`#94A3B8`,r.fillText(e.day,n-10,172)})}function Je(e,t=0,n=0){let r=document.getElementById(e);if(!r)return;let i=r.getContext(`2d`);if(!i)return;r.width=120,r.height=120;let a=t+n;if(i.clearRect(0,0,120,120),a===0){i.beginPath(),i.arc(60,60,45,0,Math.PI*2),i.strokeStyle=`#334155`,i.lineWidth=14,i.stroke();return}let o=t/a*Math.PI*2,s=n/a*Math.PI*2;t>0&&(i.beginPath(),i.arc(60,60,45,0,o),i.strokeStyle=`#10B981`,i.lineWidth=14,i.stroke()),n>0&&(i.beginPath(),i.arc(60,60,45,o,o+s),i.strokeStyle=`#3B82F6`,i.lineWidth=14,i.stroke())}function Ye(){let e=document.getElementById(`dash-cust-name`),t=document.getElementById(`dash-cust-phone`),n=document.getElementById(`dash-cust-address`),r=document.getElementById(`dash-cust-initial-balance`),i=document.getElementById(`dash-cust-date`),a=document.getElementById(`dash-cust-zone-select`),o=document.getElementById(`dash-cust-zone-code-display`),s=document.getElementById(`dash-cust-generated-acc`);e&&(e.value=``),t&&(t.value=``),n&&(n.value=``),r&&(r.value=``),ce(`dash-cust-initial-words`),i&&(i.value=F()),a&&(a.selectedIndex=0),o&&(o.value=``),s&&(s.value=``)}function Xe(){let e=document.getElementById(`dash-add-customer-form`);if(e&&(e.classList.toggle(`hidden`),!e.classList.contains(`hidden`))){Ye(),Me(),ne(`dash-cust-address`,`dash-cust-address-datalist`,`dash-cust-address-chips`);let t=document.getElementById(`dash-cust-date`);t&&!t.value&&(t.value=F()),setTimeout(()=>{e.scrollIntoView({behavior:`smooth`,block:`start`});let t=document.getElementById(`dash-cust-name`);t&&t.focus()},80)}}async function Ze(){let e=document.getElementById(`dash-cust-date`)?.value,t=z(e||F()),r=document.getElementById(`dash-cust-name`)?.value?.trim(),i=document.getElementById(`dash-cust-phone`)?.value?.trim(),a=document.getElementById(`dash-cust-address`)?.value?.trim(),o=document.getElementById(`dash-cust-zone-select`)?.value,s=document.getElementById(`dash-cust-initial-balance`)?.value?.trim();if(!r||!i||!o)return W.default.fire(`এরর`,`নাম, মোবাইল নম্বর ও জোন আবশ্যক!`,`error`);let d=L(s),f=document.getElementById(`dash-cust-generated-acc`)?.value||`Auto`,m=_(d);if(!(await W.default.fire({title:`<div class="flex items-center justify-center gap-2 font-bn font-black text-xl text-white"><i class="fa-solid fa-file-shield text-blue-400"></i><span>তথ্য যাচাই করুন</span></div>`,html:`
            <div class="text-left space-y-3 font-bn p-3.5 bg-slate-900/90 rounded-2xl border border-slate-800 shadow-inner">
                <div class="grid grid-cols-2 gap-4 border-b border-slate-800/80 pb-2.5">
                    <div class="flex flex-col gap-1"><span class="text-[10px] text-blue-400 font-black uppercase tracking-wider">কাস্টমারের নাম</span><span class="text-base text-white font-black">${r}</span></div>
                    <div class="flex flex-col gap-1"><span class="text-[10px] text-amber-400 font-black uppercase tracking-wider">অ্যাকাউন্ট নং</span><span class="text-base text-amber-400 font-black font-mono">${f}</span></div>
                </div>
                <div class="grid grid-cols-2 gap-4 border-b border-slate-800/80 pb-2.5">
                    <div class="flex flex-col gap-1"><span class="text-[10px] text-blue-400 font-black uppercase tracking-wider">মোবাইল নম্বর</span><span class="text-sm text-slate-200 font-bold font-mono">${i}</span></div>
                    <div class="flex flex-col gap-1"><span class="text-[10px] text-purple-400 font-black uppercase tracking-wider">জোন</span><span class="text-sm text-slate-200 font-bold">${o}</span></div>
                </div>
                <div class="flex flex-col gap-1 border-b border-slate-800/80 pb-2.5">
                    <span class="text-[10px] text-sky-400 font-black uppercase tracking-wider flex items-center gap-1"><i class="fa-solid fa-location-dot text-amber-400 text-xs"></i>ঠিকানা (Address)</span>
                    <span class="text-xs text-slate-200 font-medium">${a||`N/A`}</span>
                </div>
                <div class="flex flex-col gap-1 pt-1">
                    <span class="text-[10px] text-emerald-400 font-black uppercase tracking-wider">অবশিষ্ট ব্যালেন্স (Opening)</span>
                    <span class="text-2xl text-emerald-400 font-black">৳ ${I(d)}</span>
                    ${m?`<div class="text-[11px] text-emerald-400 font-black italic bg-emerald-500/10 px-2.5 py-1 rounded-xl border border-emerald-500/20 mt-1">(${m})</div>`:``}
                </div>
                <div class="flex flex-col gap-1 pt-2 border-t border-slate-800/80">
                    <span class="text-[10px] text-slate-400 font-black uppercase tracking-wider">হিসাব খোলার তারিখ</span>
                    <span class="text-sm text-slate-300 font-bold font-mono">${V(t)}</span>
                </div>
            </div>
            <p class="text-xs text-amber-400 font-bold mt-4 text-center">সব তথ্য সঠিক থাকলে "কনফার্ম করুন" বাটনে ক্লিক করুন।</p>
        `,showCancelButton:!0,confirmButtonText:`<i class="fa-solid fa-circle-check mr-2"></i>কনফার্ম করুন`,cancelButtonText:`<i class="fa-solid fa-pen-to-square mr-2"></i>সংশোধন করব`,customClass:{popup:`!bg-slate-950 !text-white !rounded-3xl border border-slate-800 shadow-2xl font-bn`,confirmButton:`m3-btn-primary !bg-blue-600 hover:!bg-blue-500 !px-7 !py-2.5 !rounded-xl font-bold shadow-lg shadow-blue-600/30`,cancelButton:`m3-btn-tonal !bg-slate-800 hover:!bg-slate-700 !text-slate-300 !px-5 !py-2.5 !rounded-xl font-bold border border-slate-700`}})).isConfirmed)return;let h=document.getElementById(`dash-save-cust-btn`);h&&(h.disabled=!0,h.innerText=`সেভ হচ্ছে...`);try{let e=(await u.getAllZones()).find(e=>e.name===o),s=(e?e.code:``)+await p.getNextAccountNo(o),f=c.batch(),m=l.getRef(),h=m.id,_=g.getRef();f.set(m,{name:r,phone:i,address:a||``,zone:o||``,accountNo:s,openingDate:t,initialDue:d,totalDue:d,createdAt:n.firestore.FieldValue.serverTimestamp()}),f.set(_,{customerId:h,customerName:r,date:t,voucherNo:`OPENING`,bill:d>0?d:0,paid:d<0?Math.abs(d):0,prevDue:0,currentDue:d,notes:`প্রারম্ভিক জের (Opening Balance)`,createdBy:window.AppState?.currentUserEmail||`System`,createdAt:n.firestore.FieldValue.serverTimestamp()}),await f.commit(),S(`CREATE`,`Customers`,h,r,{phone:i,zone:o,initialBalance:d}),W.default.fire({title:`সফল!`,text:`কাস্টমার "${r}" যোগ করা হয়েছে। জোন: ${o||`N/A`}`,icon:`success`,customClass:{popup:`!bg-slate-900 !text-white !rounded-3xl border border-slate-700`}}),Ye();let v=document.getElementById(`dash-add-customer-form`);v&&v.classList.add(`hidden`),window.loadCustomers&&window.loadCustomers()}catch(e){k(e,`কাস্টমার যোগ করা যায়নি`)}finally{h&&(h.disabled=!1,h.innerText=`সেভ করুন`)}}function Qe(){let e=document.getElementById(`top-due-customers-list`);if(!e)return;let t=[...A()].sort((e,t)=>(Number(t.totalDue)||0)-(Number(e.totalDue)||0)).slice(0,5);if(t.length===0){e.innerHTML=`<div class="text-center py-6 text-slate-500 text-xs italic">কোনো বকেয়া কাস্টমার পাওয়া যায়নি</div>`;return}let n=``;t.forEach((e,t)=>{let r=Number(e.totalDue)||0,i=(e.name||`Unknown`).replace(/'/g,`\\'`),a=e.phone||``;n+=`
            <div class="flex items-center justify-between p-2.5 rounded-xl bg-slate-950/60 border border-slate-800/60 hover:border-red-500/30 transition-all">
                <div class="flex items-center gap-2.5">
                    <span class="w-6 h-6 rounded-lg bg-red-500/10 text-red-400 font-black text-xs flex items-center justify-center">${t+1}</span>
                    <div>
                        <p class="text-xs font-black text-white truncate max-w-[120px]">${e.name||`Unknown`}</p>
                        <p class="text-[10px] text-slate-400 font-bold">${e.phone||`-`}</p>
                    </div>
                </div>
                <div class="flex items-center gap-1.5">
                    <span class="text-xs font-black text-red-400 mr-1">৳ ${I(r)}</span>
                    <button class="w-7 h-7 rounded-lg bg-emerald-600/10 hover:bg-emerald-600 text-emerald-400 hover:text-white flex items-center justify-center transition-all cursor-pointer" onclick="window.sendDashWhatsAppReminder('${a}', ${r}, '${i}')" title="WhatsApp তাগাদা">
                        <i class="fa-brands fa-whatsapp text-[12px]"></i>
                    </button>
                    <button class="w-7 h-7 rounded-lg bg-blue-600/10 hover:bg-blue-600 text-blue-400 hover:text-white flex items-center justify-center transition-all cursor-pointer" onclick="window.sendReminderSMS && window.sendReminderSMS('${a}', ${r}, '${i}')" title="SMS রিমাইন্ডার">
                        <i class="fa-solid fa-comment-sms text-[11px]"></i>
                    </button>
                </div>
            </div>`}),e.innerHTML=n}function $e(e,t,n){let r=I(Math.abs(t)),i=`আসসালামু আলাইকুম ${n},\nমেসার্স মা মোটরস্ থেকে আপনার হিসাব বিবরণী:\n\n${t<0?`অ্যাডভান্স জমা: ৳ ${r}`:`বর্তমান মোট বকেয়া: ৳ ${r}`}\n\n*বিশেষ অনুরোধ: আপনার বকেয়া টাকাটি দ্রুত পরিশোধ করার অনুরোধ রইল।*\n\nযোগাযোগ: 01819-397669\nধন্যবাদ! — মেসার্স মা মোটরস্`;window.sendWhatsApp&&window.sendWhatsApp(e,i)}function et(e,t,n,r){if(!n||!n.txns||n.txns.length===0)return W.default.fire({title:e,text:`এই ব্যাংক বা উৎসে কোনো লেনদেন ডাটা পাওয়া যায়নি`,icon:`info`});let i=n.txns,a=V(r||F()),o=``;i.forEach((e,t)=>{let n=e.customerName||`Customer`,r=e.voucherNo?`#${e.voucherNo}`:`-`,i=Number(e.paid)||0;o+=`
            <tr class="border-b border-slate-800/80 hover:bg-white/[0.02]">
                <td class="py-2 px-3 text-center text-slate-400 font-bold">${t+1}</td>
                <td class="py-2 px-3 text-left text-white font-black">${n}</td>
                <td class="py-2 px-3 text-center text-blue-400 font-mono font-bold">${r}</td>
                <td class="py-2 px-3 text-right font-mono font-black text-emerald-400">৳ ${I(i)}</td>
            </tr>`}),W.default.fire({title:`<div class="flex flex-col items-center gap-1 font-bn">
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
                    <span class="text-base font-black text-blue-400 font-mono">৳ ${I(n.total)}</span>
                </div>
            </div>
        `,confirmButtonText:`ঠিক আছে`,customClass:{popup:`!bg-slate-950 !text-white !rounded-3xl border border-slate-800 shadow-2xl font-bn max-w-lg`,confirmButton:`m3-btn-primary !bg-blue-600 hover:!bg-blue-500 !px-8 !py-2 !rounded-xl font-bold`}})}async function tt(){try{let e=F(),t=document.getElementById(`dash-total-due`)?.innerText||`৳ ০`,n=document.getElementById(`dash-today-col`)?.innerText||`৳ ০`,r=document.getElementById(`dash-today-exp`)?.innerText||`৳ ০`,i=document.getElementById(`dash-total-cust`)?.innerText||`০ জন`,a=await p.getAppSettings(),o=[...A()].filter(e=>(Number(e.totalDue)||0)>0).sort((e,t)=>(Number(t.totalDue)||0)-(Number(e.totalDue)||0)).slice(0,10),s=``;s=o.length>0?o.map((e,t)=>`
                <tr>
                    <td style="text-align:center; padding: 6px; border: 1px solid #cbd5e1; font-weight:bold;">${String(t+1).padStart(2,`0`)}</td>
                    <td style="padding: 6px; border: 1px solid #cbd5e1; font-weight:bold;">${e.name||`-`}</td>
                    <td style="text-align:center; padding: 6px; border: 1px solid #cbd5e1; font-size: 10px;">${e.accountNo||`-`}</td>
                    <td style="text-align:center; padding: 6px; border: 1px solid #cbd5e1; font-size: 10px;">${e.zone||`-`}</td>
                    <td style="text-align:center; padding: 6px; border: 1px solid #cbd5e1; font-size: 10px;">${e.phone||`-`}</td>
                    <td style="text-align:right; padding: 6px; border: 1px solid #cbd5e1; font-weight:900; color:#dc2626;">৳ ${I(Number(e.totalDue)||0)}</td>
                </tr>
            `).join(``):`<tr><td colspan="6" style="text-align:center; padding:12px; color:#64748b; font-style:italic;">কোনো বকেয়া কাস্টমার পাওয়া যায়নি</td></tr>`;let c=pe({title:`EXECUTIVE REPORT`,dateRangeStr:`তারিখ: ${V(e)} • সময়: ${new Date().toLocaleTimeString(`en-US`,{hour:`2-digit`,minute:`2-digit`})}`},a),l=document.getElementById(`print-receipt-container`);l||(l=document.createElement(`div`),l.id=`print-receipt-container`,document.body.appendChild(l)),l.className=`print-a4`,l.innerHTML=`
            <table class="print-layout-table" style="width: 100%; border-collapse: collapse;">
                <thead><tr><td><div class="print-header-space"></div></td></tr></thead>
                <tbody>
                    <tr>
                        <td>
                            <div class="a4-wrapper font-bn">
                                ${c}

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
        `,de(l)}catch(e){console.error(`Executive Print Error:`,e),W.default.fire(`Error`,`রিপোর্ট প্রিন্ট করতে সমস্যা হয়েছে`,`error`)}}typeof window<`u`&&(window.sendDashWhatsAppReminder=$e,window.toggleDashCustomerForm=Xe,window.saveDashCustomer=Ze,window.showBreakdownDetails=et);var nt=[],rt=null,it={},at={};function ot(){nt.forEach(e=>{typeof e==`function`&&e()}),nt=[]}function st(e,t){if(window.AppState?.currentUserRole===`Staff`&&window.AppState?.permissions?.viewDashboard===!1){e.innerHTML=`<div class="m3-card text-center"><h2 class="text-xl font-bold text-red-500 font-bn">অ্যাক্সেস ডিনাইড! আপনার ড্যাশবোর্ড দেখার অনুমতি নেই।</h2></div>`;return}ot(),e.innerHTML=Ke(),Me(),rt=F(),ct(rt),setTimeout(()=>{let e=document.getElementById(`collection-list-datepicker`);e&&e._flatpickr&&e._flatpickr.set(`onChange`,function(e,t,n){if(e.length===2){let t=z(e[0]),n=z(e[1]);window.filterCollectionList(`custom`,t,n)}else if(e.length===1&&!t.includes(`to`)){let t=z(e[0]);window.filterCollectionList(`custom`,t,t)}}),window.filterCollectionList(`today`)},200)}function ct(e=null){ot();let t=e||rt||F();rt=t;let n=document.getElementById(`dash-date-filter`),r=document.getElementById(`dash-active-date-text`),i=V(t),o=F();n&&(n.value=i),r&&(r.innerText=t===o?`আজকের লাইভ হিসাব (${i})`:`${i} এর হিসাব`);function s(){let e=A(),t=0;e.forEach(e=>{t=safeRound(t+(Number(e.totalDue)||0))});let n=document.getElementById(`dash-total-due`),r=document.getElementById(`dash-total-cust`);n&&(n.innerText=`৳ `+I(t)),r&&(r.innerText=e.length+` জন`),Qe()}s();let c=setInterval(()=>{if(!document.getElementById(`dash-total-due`)){clearInterval(c);return}s()},3e3);nt.push(()=>clearInterval(c));let l=g.listenByDate(t,e=>{let t=0,n=0,r=0;it={},at={},e.forEach(e=>{let i=Number(e.paid)||0;if(i<=0)return;let a=e.receivedType||`Bank`,o=(e.receivedFrom||``).trim();a===`Cash`?(t+=i,o||=`শোরুম ক্যাশ`,at[o]||(at[o]={total:0,txns:[]}),at[o].total+=i,at[o].txns.push(e)):a===`Less`?r+=i:(n+=i,o||=`অন্যান্য ব্যাংক`,it[o]||(it[o]={total:0,txns:[]}),it[o].total+=i,it[o].txns.push(e))});let i=t+n,a=document.getElementById(`dash-today-col`);a&&(a.innerText=`৳ `+I(i));let o=document.getElementById(`dash-col-cash`),s=document.getElementById(`dash-col-bank`);o&&(o.innerText=`৳ `+I(t)),s&&(s.innerText=`৳ `+I(n)),Je(`payment-donut-chart`,t,n),qe(`sales-vs-col-chart`)});nt.push(l);let u=a.listenByDate(t,e=>{let t=0;e.forEach(e=>t+=Number(e.amount)||0);let n=document.getElementById(`dash-today-exp`);n&&(n.innerText=`৳ `+I(t));let r=document.getElementById(`dash-today-col`)?.innerText?.replace(/[^0-9]/g,``)||`0`,i=Number(r)-t,a=document.getElementById(`dash-net-cash`);a&&(a.innerText=`নিট জমা: ৳ ${I(Math.max(0,i))}`)});nt.push(u)}function lt(e){e&&ct(z(e))}function ut(){let e=new Date;return e.setDate(e.getDate()-1),`${e.getFullYear()}-${String(e.getMonth()+1).padStart(2,`0`)}-${String(e.getDate()).padStart(2,`0`)}`}async function dt(e,t){let n=document.getElementById(`dash-collection-list-tbody`),r=document.getElementById(`dash-collection-list-total`);if(n){n.innerHTML=`<tr><td colspan="5" class="text-center py-10 text-slate-500"><i class="fa-solid fa-spinner fa-spin text-xl text-emerald-500 mb-2"></i><br>ডাটা লোড হচ্ছে...</td></tr>`;try{let i;i=e===t?await g.collection.where(`date`,`==`,e).get():await g.collection.where(`date`,`>=`,e).where(`date`,`<=`,t).get();let a=[];i.forEach(e=>a.push({id:e.id,...e.data()})),a=a.filter(e=>(Number(e.paid)||0)>0),a.sort((e,t)=>e.date===t.date?(t.createdAt?.toMillis?.()||0)-(e.createdAt?.toMillis?.()||0):t.date.localeCompare(e.date));let o=0,s=``,c={};if(a.length===0)s=`<tr><td colspan="5" class="text-center py-10 text-slate-500 italic">এই সময়ের মধ্যে কোনো আদায় নেই।</td></tr>`;else{let e=A();a.forEach(t=>{let n=Number(t.paid)||0;o+=n;let r=`Unknown`,i=e.find(e=>e.id===t.customerId);i&&(r=i.name);let a=t.receivedType||`Bank`,l=a===`Cash`?`Cash`:a===`Less`?`Less`:t.receivedFrom||`Bank`;l!==`Less`&&(c[l]||(c[l]={total:0,count:0}),c[l].total+=n,c[l].count++);let u=``;u=a===`Cash`?`<span class="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded text-[10px] font-bold"><i class="fa-solid fa-hand-holding-dollar mr-1"></i> ক্যাশ</span>`:a===`Less`?`<span class="bg-amber-500/10 text-amber-400 border border-amber-500/20 px-2 py-0.5 rounded text-[10px] font-bold">ছাড় (Less)</span>`:`<span class="bg-blue-500/10 text-blue-400 border border-blue-500/20 px-2 py-0.5 rounded text-[10px] font-bold"><i class="fa-solid fa-building-columns mr-1"></i> ${t.receivedFrom||`Bank`}</span>`,s+=`
                    <tr class="hover:bg-slate-800/30 transition-all group collection-list-row" data-method="${l}" data-amount="${n}">
                        <td class="text-xs text-slate-400 whitespace-nowrap">${V(t.date)}</td>
                        <td class="text-sm font-bold text-slate-200">
                            ${r}
                        </td>
                        <td class="text-xs font-mono text-slate-400">${t.voucherNo||`-`}</td>
                        <td>${u}</td>
                        <td class="text-right text-emerald-400 font-black font-mono">৳ ${I(n)}</td>
                    </tr>
                `})}n.innerHTML=s,r&&(r.innerText=`৳ ${I(o)}`);let l=document.getElementById(`dash-collection-card-total`),u=document.getElementById(`dash-collection-card-words`);l&&(l.innerText=`৳ ${I(o)}`),u&&(u.innerText=o>0?`${_(o)}`:`শূন্য টাকা মাত্র`);let d=document.getElementById(`dash-collection-method-cards`);if(d){let e=``;if(a.length>0&&Object.keys(c).length>0){e+=`
                    <div class="method-card-btn bg-emerald-600/90 backdrop-blur-md border border-emerald-500/50 rounded-xl p-3 cursor-pointer hover:bg-emerald-500 transition-all flex flex-col gap-1.5 min-w-[110px] shadow-[0_5px_15px_-5px_rgba(16,185,129,0.5)] ring-2 ring-emerald-400" onclick="window.filterCollectionByMethod('All')" data-method="All">
                        <span class="text-[10px] font-black text-emerald-100 uppercase drop-shadow-sm"><i class="fa-solid fa-layer-group mr-1"></i>সব (All)</span>
                        <div class="flex items-end justify-between gap-3">
                            <span class="text-sm font-black text-white tracking-tight">৳ ${I(o)}</span>
                            <span class="text-[9px] bg-emerald-900/40 text-emerald-100 px-1.5 py-0.5 rounded-md font-bold">${a.filter(e=>e.receivedType!==`Less`).length} জন</span>
                        </div>
                    </div>
                `;for(let[t,n]of Object.entries(c)){let r=t===`Cash`,i=r?`<i class="fa-solid fa-hand-holding-dollar mr-1"></i>`:`<i class="fa-solid fa-building-columns mr-1"></i>`,a=r?`bg-emerald-500/10`:`bg-blue-500/10`,o=r?`border-emerald-500/30`:`border-blue-500/30`,s=r?`text-emerald-400`:`text-blue-400`;e+=`
                        <div class="method-card-btn ${a} backdrop-blur-sm border ${o} ${r?`hover:bg-emerald-500/20 hover:border-emerald-500/50`:`hover:bg-blue-500/20 hover:border-blue-500/50`} rounded-xl p-3 cursor-pointer transition-all flex flex-col gap-1.5 min-w-[120px] opacity-70 hover:opacity-100 shadow-sm" onclick="window.filterCollectionByMethod('${t}')" data-method="${t}" data-ring="${r?`ring-emerald-400`:`ring-blue-400`}">
                            <span class="text-[10px] font-bold ${s} uppercase truncate max-w-[100px]">${i}${t}</span>
                            <div class="flex items-end justify-between gap-3">
                                <span class="text-sm font-black ${s} tracking-tight">৳ ${I(n.total)}</span>
                                <span class="text-[9px] bg-slate-900/60 ${s} px-1.5 py-0.5 rounded-md font-bold">${n.count} জন</span>
                            </div>
                        </div>
                    `}}d.innerHTML=e}}catch(e){console.error(e),n.innerHTML=`<tr><td colspan="5" class="text-center py-10 text-red-500">ডাটা লোড করতে সমস্যা হয়েছে</td></tr>`}}}function ft(e){let t=document.querySelectorAll(`.collection-list-row`),n=0;t.forEach(t=>{let r=t.getAttribute(`data-method`);if(e===`All`||r===e){t.style.display=``;let e=Number(t.getAttribute(`data-amount`))||0;n+=e}else t.style.display=`none`}),document.querySelectorAll(`.method-card-btn`).forEach(t=>{let n=t.getAttribute(`data-method`),r=t.getAttribute(`data-ring`)||`ring-emerald-400`;n===e?n===`All`?(t.classList.add(`bg-emerald-600`,`ring-2`,`ring-emerald-400`),t.classList.remove(`bg-emerald-600/50`)):(t.classList.add(`ring-2`,r,`opacity-100`),t.classList.remove(`opacity-70`)):n===`All`?(t.classList.remove(`bg-emerald-600`,`ring-2`,`ring-emerald-400`),t.classList.add(`bg-emerald-600/50`)):(t.classList.remove(`ring-2`,r,`opacity-100`),t.classList.add(`opacity-70`))});let r=document.getElementById(`dash-collection-card-total`),i=document.getElementById(`dash-collection-card-words`),a=document.getElementById(`dash-collection-list-total`);r&&(r.innerText=`৳ ${I(n)}`),a&&(a.innerText=`৳ ${I(n)}`),i&&(i.innerText=n>0?`${_(n)}`:`শূন্য টাকা মাত্র`)}function pt(e,t=null,n=null){let r=F(),i=r,a=r;if([`today`,`yesterday`,`week`,`month`].forEach(t=>{let n=document.getElementById(`btn-col-${t}`);n&&(t===e?(n.classList.add(`bg-emerald-600`,`text-white`),n.classList.remove(`bg-slate-800`,`text-slate-300`,`bg-emerald-600/20`,`text-emerald-400`)):(n.classList.remove(`bg-emerald-600`,`text-white`,`bg-emerald-600/20`,`text-emerald-400`),n.classList.add(`bg-slate-800`,`text-slate-300`)))}),e===`yesterday`)i=a=ut();else if(e===`week`){let e=new Date;e.setDate(e.getDate()-6),i=z(e),a=r}else if(e===`month`){let e=new Date;e.setDate(e.getDate()-29),i=z(e),a=r}else e===`custom`&&t&&n&&(i=t,a=n);let o=document.getElementById(`collection-list-datepicker`);o&&o._flatpickr&&e!==`custom`&&(i===a?o._flatpickr.setDate(i,!1):o._flatpickr.setDate([i,a],!1)),dt(i,a)}typeof window<`u`&&(window.switchDashTimeframe=e=>{let t=F(),n=ut(),r=document.getElementById(`tf-today-btn`),i=document.getElementById(`tf-yesterday-btn`);r&&i&&(e===`today`?(r.className=`px-3 py-1.5 min-h-[34px] rounded-lg bg-blue-600 text-white font-black cursor-pointer`,i.className=`px-3 py-1.5 min-h-[34px] rounded-lg text-slate-400 hover:text-white font-bold cursor-pointer`,ct(t)):e===`yesterday`&&(i.className=`px-3 py-1.5 min-h-[34px] rounded-lg bg-blue-600 text-white font-black cursor-pointer`,r.className=`px-3 py-1.5 min-h-[34px] rounded-lg text-slate-400 hover:text-white font-bold cursor-pointer`,ct(n)))},window.onDashDateFilterChange=lt,window.loadCollectionList=dt,window.filterCollectionList=pt,window.filterCollectionByMethod=ft,window.printExecutiveSummary=tt);function mt(e=``,{inputId:t,selectId:n,dropdownId:r,onSelect:i}={}){let a=document.getElementById(r);if(!a)return;let o=A()||[],s=(e||``).trim(),c=o;if(s&&(c=o.filter(e=>typeof window.matchCustomerSearch==`function`?window.matchCustomerSearch(e,s):(e.name||``).toLowerCase().includes(s.toLowerCase())||(e.phone||``).toLowerCase().includes(s.toLowerCase())||(e.accountNo||``).toLowerCase().includes(s.toLowerCase())||(e.address||``).toLowerCase().includes(s.toLowerCase()))),c.length===0){a.innerHTML=`<div class="p-3 text-center text-xs text-slate-500 font-bold">কোনো কাস্টমার পাওয়া যায়নি</div>`,a.classList.remove(`hidden`);return}a.innerHTML=c.slice(0,40).map(e=>{let t=Number(e.totalDue)||0,n=t>0?`<span class="text-[10px] bg-red-500/20 text-red-400 border border-red-500/30 px-2 py-0.5 rounded-md font-black">৳${I(t)}</span>`:`<span class="text-[10px] bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-2 py-0.5 rounded-md font-bold">০.০০</span>`,r=e.accountNo?`<span class="text-blue-400 text-[10px] font-mono font-bold">#${e.accountNo}</span>`:``;return`
            <div class="combobox-item p-2 rounded-xl hover:bg-slate-800/80 cursor-pointer transition-all border border-transparent hover:border-slate-700 flex items-center justify-between gap-2" data-id="${e.id}">
                <div class="flex flex-col">
                    <div class="text-xs font-black text-white flex items-center gap-1.5">${e.name} ${r}</div>
                    <div class="text-[10px] text-slate-400 font-bold mt-0.5"><i class="fa-solid fa-phone text-[8px] mr-1 text-slate-500"></i>${e.phone||`-`} ${e.address?`• `+e.address:``}</div>
                </div>
                <div>${n}</div>
            </div>
        `}).join(``),a.classList.remove(`hidden`),a.querySelectorAll(`.combobox-item`).forEach(e=>{e.addEventListener(`click`,()=>{let a=e.dataset.id;ht(a,{inputId:t,selectId:n,dropdownId:r,onSelect:i})})})}function ht(e,{inputId:t,selectId:n,dropdownId:r,onSelect:i}={}){let a=document.getElementById(n),o=document.getElementById(t),s=document.getElementById(`${t}-clear`),c=document.getElementById(r);if(a&&(a.value=e,a.dispatchEvent(new Event(`change`,{bubbles:!0}))),a&&a.selectedIndex>=0){let e=a.options[a.selectedIndex];o&&e&&(o.value=`${e.dataset?.name||e.text}`),s&&s.classList.remove(`hidden`)}c&&c.classList.add(`hidden`),typeof i==`function`&&i(e)}var gt=[],_t=[];window.cachedBanksHtml=`<option value="">-- ব্যাংক নির্বাচন করুন --</option>`,window.cachedCashHtml=`<option value="">-- ক্যাশ রিসিভার নির্বাচন করুন --</option>`;async function vt(){try{let e=await f.getAllBanks(),t=await g.getAll(),n=new Set;t.forEach(e=>{e.receivedType===`Bank`&&e.receivedFrom&&n.add(e.receivedFrom.trim())}),n.add(`OneBank (IFRAT)`),n.add(`IBBL (IFRAT)`);let r=new Set(e.map(e=>e.name)),i=!1;for(let e of n)!r.has(e)&&e.length>0&&(await f.add({name:e}),i=!0);i&&(e=await f.getAllBanks()),gt=e;let a=`<option value="" class="!bg-slate-900 !text-slate-400">-- ব্যাংক নির্বাচন করুন --</option>`;e.forEach(e=>{e.name&&(a+=`<option value="${e.name}" class="!bg-slate-900 !text-slate-200 font-bold">${e.name}</option>`)}),window.cachedBanksHtml=a;let o=document.getElementById(`ledger-received-from`);if(o&&o.tagName===`SELECT`&&document.getElementById(`lbl-recv-from`).innerText.includes(`Bank`)){let e=o.value;o.innerHTML=a,o.value=e}}catch(e){console.error(`Error loading bank options:`,e)}}async function yt(){try{let e=await h.getAllCollectors(),t=await g.getAll(),n=new Set;t.forEach(e=>{e.receivedType===`Cash`&&e.receivedFrom&&n.add(e.receivedFrom.trim())}),n.add(`শোরুম ক্যাশ`),n.add(`ইফরাত`);let r=new Set(e.map(e=>e.name)),i=!1;for(let e of n)!r.has(e)&&e.length>0&&(await h.add({name:e}),i=!0);i&&(e=await h.getAllCollectors()),_t=e;let a=`<option value="" class="!bg-slate-900 !text-slate-400">-- ক্যাশ রিসিভার নির্বাচন করুন --</option>`;e.forEach(e=>{e.name&&(a+=`<option value="${e.name}" class="!bg-slate-900 !text-slate-200 font-bold">${e.name}</option>`)}),window.cachedCashHtml=a;let o=document.getElementById(`ledger-received-from`);if(o&&o.tagName===`SELECT`&&document.getElementById(`lbl-recv-from`).innerText.includes(`Cash`)){let e=o.value;o.innerHTML=a,o.value=e}}catch(e){console.error(`Error loading cash collectors:`,e)}}async function bt(){let{value:e}=await W.default.fire({title:`<div class="flex items-center gap-2 font-bn text-white text-xl"><i class="fa-solid fa-building-columns text-blue-400"></i><span>নতুন ব্যাংক যোগ করুন</span></div>`,input:`text`,inputPlaceholder:`যেমন: City Bank (IFRAT), Prime Bank...`,showCancelButton:!0,confirmButtonText:`<i class="fa-solid fa-check mr-1.5"></i>সেভ করুন`,cancelButtonText:`বাতিল`,customClass:{popup:`!bg-slate-950 !text-white !rounded-3xl border border-slate-800 shadow-2xl font-bn`,confirmButton:`m3-btn-primary !bg-blue-600 hover:!bg-blue-500 !px-6 !py-2 !rounded-xl font-bold`,cancelButton:`m3-btn-tonal !bg-slate-800 hover:!bg-slate-700 !text-slate-300 !px-5 !py-2 !rounded-xl font-bold`},inputValidator:e=>!e||!e.trim()?`ব্যাংকের নাম লিখুন!`:null});if(e&&e.trim())try{let t=e.trim();await f.add({name:t}),R(`নতুন ব্যাংক সফলভাবে যুক্ত হয়েছে`,`success`),await vt();let n=document.getElementById(`ledger-received-from`);n&&(n.value=t)}catch(e){k(e,`ব্যাংক সেভ করতে সমস্যা হয়েছে`)}}async function xt(){let{value:e}=await W.default.fire({title:`<div class="flex items-center gap-2 font-bn text-white text-xl"><i class="fa-solid fa-user-gear text-emerald-400"></i><span>ক্যাশ গ্রহণকারী / সোর্স যোগ করুন</span></div>`,input:`text`,inputPlaceholder:`যেমন: ড্রাইভার শফিক, ম্যানেজার কালাম...`,showCancelButton:!0,confirmButtonText:`<i class="fa-solid fa-check mr-1.5"></i>সেভ করুন`,cancelButtonText:`বাতিল`,customClass:{popup:`!bg-slate-950 !text-white !rounded-3xl border border-slate-800 shadow-2xl font-bn`,confirmButton:`m3-btn-primary !bg-emerald-600 hover:!bg-emerald-500 !px-6 !py-2 !rounded-xl font-bold`,cancelButton:`m3-btn-tonal !bg-slate-800 hover:!bg-slate-700 !text-slate-300 !px-5 !py-2 !rounded-xl font-bold`},inputValidator:e=>!e||!e.trim()?`প্রাপক বা সোর্সের নাম লিখুন!`:null});if(e&&e.trim())try{let t=e.trim();await h.add({name:t}),R(`ক্যাশ সোর্স সফলভাবে যুক্ত হয়েছে`,`success`),await yt();let n=document.getElementById(`ledger-received-from`);n&&(n.value=t)}catch(e){k(e,`ক্যাশ সোর্স সেভ করতে সমস্যা হয়েছে`)}}window.quickAddBank=bt,window.quickAddCashCollector=xt,window.quickEditBank=St,window.quickEditCashCollector=Ct;async function St(){let e=document.getElementById(`ledger-received-from`);if(!e||!e.value)return R(`দয়া করে আগে লিস্ট থেকে একটি ব্যাংক নির্বাচন করুন!`,`warning`);let t=e.value,n=gt.find(e=>e.name===t);if(!n)return R(`ব্যাংকটি খুঁজে পাওয়া যায়নি!`,`error`);let{value:r}=await W.default.fire({title:`<div class="flex items-center gap-2 font-bn text-white text-xl"><i class="fa-solid fa-pen text-emerald-400"></i><span>ব্যাংকের নাম এডিট করুন</span></div>`,input:`text`,inputValue:t,showCancelButton:!0,confirmButtonText:`<i class="fa-solid fa-check mr-1.5"></i>আপডেট করুন`,cancelButtonText:`বাতিল`,customClass:{popup:`!bg-slate-950 !text-white !rounded-3xl border border-slate-800 shadow-2xl font-bn`,confirmButton:`m3-btn-primary !bg-emerald-600 hover:!bg-emerald-500 !px-6 !py-2 !rounded-xl font-bold`,cancelButton:`m3-btn-tonal !bg-slate-800 hover:!bg-slate-700 !text-slate-300 !px-5 !py-2 !rounded-xl font-bold`},inputValidator:e=>{if(!e||!e.trim())return`ব্যাংকের নাম খালি রাখা যাবে না!`;if(e.trim()===t)return`আপনি কোনো পরিবর্তন করেননি!`}});if(r)try{let e=r.trim();await f.update(n.id,{name:e});let i=(await g.getAll()).filter(e=>e.receivedType===`Bank`&&e.receivedFrom===t);for(let t of i)await g.update(t.id,{receivedFrom:e});R(`ব্যাংক আপডেট করা হয়েছে!`,`success`),await vt();let a=document.getElementById(`ledger-received-from`);a&&(a.value=e)}catch(e){k(e,`ব্যাংক আপডেট করতে সমস্যা হয়েছে`)}}async function Ct(){let e=document.getElementById(`ledger-received-from`);if(!e||!e.value)return R(`দয়া করে আগে লিস্ট থেকে একটি ক্যাশ সোর্স নির্বাচন করুন!`,`warning`);let t=e.value,n=_t.find(e=>e.name===t);if(!n)return R(`ক্যাশ সোর্স খুঁজে পাওয়া যায়নি!`,`error`);let{value:r}=await W.default.fire({title:`<div class="flex items-center gap-2 font-bn text-white text-xl"><i class="fa-solid fa-pen text-emerald-400"></i><span>ক্যাশ সোর্স এডিট করুন</span></div>`,input:`text`,inputValue:t,showCancelButton:!0,confirmButtonText:`<i class="fa-solid fa-check mr-1.5"></i>আপডেট করুন`,cancelButtonText:`বাতিল`,customClass:{popup:`!bg-slate-950 !text-white !rounded-3xl border border-slate-800 shadow-2xl font-bn`,confirmButton:`m3-btn-primary !bg-emerald-600 hover:!bg-emerald-500 !px-6 !py-2 !rounded-xl font-bold`,cancelButton:`m3-btn-tonal !bg-slate-800 hover:!bg-slate-700 !text-slate-300 !px-5 !py-2 !rounded-xl font-bold`},inputValidator:e=>{if(!e||!e.trim())return`নাম খালি রাখা যাবে না!`;if(e.trim()===t)return`আপনি কোনো পরিবর্তন করেননি!`}});if(r)try{let e=r.trim();await h.update(n.id,{name:e});let i=(await g.getAll()).filter(e=>e.receivedType===`Cash`&&e.receivedFrom===t);for(let t of i)await g.update(t.id,{receivedFrom:e});R(`ক্যাশ সোর্স আপডেট করা হয়েছে!`,`success`),await yt();let a=document.getElementById(`ledger-received-from`);a&&(a.value=e)}catch(e){k(e,`ক্যাশ সোর্স আপডেট করতে সমস্যা হয়েছে`)}}function wt(e,t,n={}){let{loadCustomersForDropdown:r,loadRecentTransactions:i,filterLedgerByCustomer:a}=n;e.innerHTML=`<div class="flex flex-col gap-5 font-bn">
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
                    <label class="m3-label text-red-400 mb-1.5 block text-xs font-bold truncate">বিল <span class="m3-label-sub text-[10px] opacity-70">(Debit)</span></label>
                    <input type="text" id="ledger-bill" oninput="window.handleNumberInput(this); window.updateLedgerLiveText(); window.updateLiveWords(this, 'ledger-bill-words');" class="m3-field py-1 text-base font-black text-red-400 bg-slate-950/80 h-10 !border-red-500 focus:!border-red-400 focus:!ring-red-500/30">
                    <div id="ledger-bill-words" class="text-[10px] font-black text-red-400 mt-1 hidden italic truncate"></div>
                </div>
                <div class="flex flex-col relative">
                    <label class="m3-label text-emerald-400 mb-1.5 block text-xs font-bold truncate">জমা <span class="m3-label-sub text-[10px] opacity-70">(Credit)</span></label>
                    <input type="text" id="ledger-paid" oninput="window.handleNumberInput(this); window.updateLedgerLiveText(); window.toggleReceivedSection(); window.updateLiveWords(this, 'ledger-paid-words');" class="m3-field py-1 text-base font-black text-emerald-400 bg-slate-950/80 h-10 !border-emerald-500 focus:!border-emerald-400 focus:!ring-emerald-500/30">
                    <div id="ledger-paid-words" class="text-[10px] font-black text-emerald-400 mt-1 hidden italic truncate"></div>
                </div>
            </div>
            <div id="received-section" class="hidden grid grid-cols-1 md:grid-cols-2 gap-3 pt-3 border-t border-slate-800/60">
                <div><label class="m3-label text-emerald-400">পেমেন্ট মাধ্যম</label><div class="flex bg-slate-950 rounded-xl border border-slate-700 h-9 p-1 gap-1"><button type="button" id="recv-bank-btn" onclick="window.setReceivedType('Bank')" class="flex-1 text-[10px] font-bold bg-blue-600 text-white rounded-lg">Bank</button><button type="button" id="recv-cash-btn" onclick="window.setReceivedType('Cash')" class="flex-1 text-[10px] font-bold text-slate-400 rounded-lg">Cash</button><button type="button" id="recv-less-btn" onclick="window.setReceivedType('Less')" class="flex-1 text-[10px] font-bold text-slate-400 rounded-lg">Less</button></div></div>
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
            <div class="flex justify-end pt-2"><button class="m3-btn-primary rounded-xl h-10 px-8 text-xs font-bold shadow-md shadow-blue-600/20" id="save-txn-btn" onclick="window.saveTransaction()">এন্ট্রি সেভ করুন</button></div>
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
    </div>`,document.getElementById(`ledger-date`).value=F(),r&&r(),vt(),yt(),t&&t.customerId&&a?setTimeout(()=>{document.getElementById(`ledger-customer-select`).value=t.customerId,a(t.customerId)},200):i&&i()}function Tt(){let e=L(document.getElementById(`ledger-bill`)?.value||`0`),t=L(document.getElementById(`ledger-paid`)?.value||`0`),n=document.getElementById(`ledger-customer-select`),r=document.getElementById(`live-due-calc`);if(r)if(n&&n.selectedIndex>0){let i=parseFloat(n.options[n.selectedIndex].dataset.due)||0,a=safeRound(i+e-t);r.innerText=`বকেয়া: ৳ ${I(Math.abs(a))} ${a<0?`(অ্যাড)`:``}`,r.className=a>0?`bg-red-500/10 text-red-400 border border-red-500/20 px-4 py-1.5 rounded-xl text-xs font-black`:`bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-4 py-1.5 rounded-xl text-xs font-black`}else r.innerText=`৳ ০`,r.className=`bg-slate-800/80 px-4 py-1.5 rounded-xl border border-slate-700 text-xs font-black text-blue-400 shadow-inner font-bn`}function Et(e,t,n={}){if(!t)return;let r=document.getElementById(`ledger-list-mobile`),i=document.getElementById(`ledger-tfoot`),a=document.getElementById(`ledger-customer-select`),o=a&&a.selectedIndex>0,s=[],c=``,l=0,u=0,d=[];n.currentLedgerTxns&&(n.currentLedgerTxns.length=0),e&&n.currentLedgerTxns?.push(...e),n.currentLedgerTxnsMap&&Object.keys(n.currentLedgerTxnsMap).forEach(e=>delete n.currentLedgerTxnsMap[e]);let f=A()||[];if(o){let t=a.value,n=f.find(e=>e.id===t),r=Number(n?.totalDue||0);e.forEach((e,t)=>{d[t]=r,r=safeRound(r-((Number(e.bill)||0)-(Number(e.paid)||0)))})}if((e||[]).forEach((e,t)=>{let r=String(U?.currentUserRole||``).toLowerCase()===`admin`,i=r||U?.permissions?.editLedger!==!1&&U?.permissions?.manageLedger!==!1,a=r||U?.permissions?.deleteLedger===!0,p=o?d[t]:Number(e.currentDue)||0,m=Number(e.bill)||0,h=Number(e.paid)||0;l+=m,u+=h;let g=String(e.id||``),_=String(e.customerId||``),v=f.find(e=>e.id===_);g&&n.currentLedgerTxnsMap&&(n.currentLedgerTxnsMap[g]={...e,phone:v?.phone||e.phone||``,customerName:e.customerName||v?.name||`Customer`,calculatedDue:p});let y=``;if(h>0){let t=e.receivedType||`Bank`,n=(e.receivedFrom||``).trim(),r=n?`${t}: ${n}`:t;y=t===`Bank`?`<span class="inline-flex items-center gap-1 text-[10px] font-black text-blue-400 bg-blue-500/10 border border-blue-500/20 px-2 py-0.5 rounded-lg ml-2" title="${r}"><i class="fa-solid fa-building-columns text-[9px]"></i><span>${r}</span></span>`:t===`Less`?`<span class="inline-flex items-center gap-1 text-[10px] font-black text-purple-400 bg-purple-500/10 border border-purple-500/20 px-2 py-0.5 rounded-lg ml-2" title="${r}"><i class="fa-solid fa-tag text-[9px]"></i><span>${r}</span></span>`:`<span class="inline-flex items-center gap-1 text-[10px] font-black text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-lg ml-2" title="${r}"><i class="fa-solid fa-hand-holding-dollar text-[9px]"></i><span>${r}</span></span>`}let b=(e.receivedFrom||``).replace(/'/g,`\\'`),x=(e.receivedType||``).replace(/'/g,`\\'`);s.push(`<tr class="hover:bg-white/[0.03] transition-colors border-b border-slate-800/50">
            <td class="text-[10px] text-slate-300 font-bold whitespace-nowrap">${V(e.date)}</td>
            <td class="font-bold text-slate-200 text-xs"><div>${e.customerName||v?.name||`Unknown`}${y}</div><div class="flex items-center gap-1.5 mt-1">${e.voucherNo?`<span class="text-[9px] text-blue-400 font-black">#${e.voucherNo}</span>`:``}${e.notes?`<span class="text-[9px] text-slate-500 font-medium italic truncate max-w-[180px]" title="${e.notes}">• ${e.notes}</span>`:``}</div></td>
            <td class="text-right text-red-400 font-black text-sm">৳${I(m)}</td>
            <td class="text-right text-emerald-400 font-black text-sm">৳${I(h)}</td>
            <td class="text-right text-white font-black text-base bg-white/[0.02] border-l border-slate-800/50">৳${I(Math.abs(p))}<div class="text-[9px] uppercase font-bold ${p>0?`text-red-400`:`text-emerald-400`}">${p>0?`Due`:`Adv`}</div></td>
            <td class="text-center sticky-action-col"><div class="flex items-center justify-center gap-1.5">
                <button class="m3-btn-icon" onclick="window.sendTxnWhatsApp('${g}')" title="WhatsApp বার্তা পাঠান"><i class="fa-brands fa-whatsapp text-emerald-400"></i></button>
                <button class="m3-btn-icon" onclick="window.sendTxnSMS('${g}')" title="ট্রানজেকশন SMS পাঠান"><i class="fa-solid fa-comment-sms text-blue-400"></i></button>
                ${i?`<button class="m3-btn-icon" onclick="window.editTransaction('${g}', '${_}', '${e.date}', '${e.voucherNo||``}', ${m}, ${h}, '${x}', '${b}')" title="এডিট"><i class="fa-solid fa-pen-to-square text-amber-400"></i></button>`:``}
                ${a?`<button class="m3-btn-icon" onclick="window.deleteTransaction('${g}', '${_}', ${m}, ${h})" title="ডিলেট"><i class="fa-solid fa-trash-can text-red-400"></i></button>`:``}
                <button class="m3-btn-icon" onclick="window.choosePrintType('${g}')" title="প্রিন্ট"><i class="fa-solid fa-print text-emerald-400"></i></button>
            </div></td>
        </tr>`),c+=`<div class="mobile-card">
            <div class="mobile-card-header">
                <div><div class="mobile-card-title">${e.customerName||v?.name||`Unknown`}</div><div class="mobile-card-sub text-blue-400 font-bold mt-0.5">${e.voucherNo?`#`+e.voucherNo:V(e.date)} ${y}</div></div>
                <div class="text-right"><div class="text-white font-black text-base">৳ ${I(Math.abs(p))}</div><span class="inline-block text-[9px] uppercase font-bold ${p>0?`text-red-400`:`text-emerald-400`}">${p>0?`Due`:`Adv`}</span></div>
            </div>
            <div class="mobile-card-row"><span class="mobile-card-label">বিল (Debit):</span><span class="mobile-card-value text-red-400 font-bold">৳ ${I(m)}</span></div>
            <div class="mobile-card-row"><span class="mobile-card-label">জমা (Credit):</span><span class="mobile-card-value text-emerald-400 font-bold">৳ ${I(h)}</span></div>
            <div class="mobile-card-actions">
                <button class="m3-btn-icon" onclick="window.sendTxnWhatsApp('${g}')" title="WhatsApp বার্তা পাঠান"><i class="fa-brands fa-whatsapp text-emerald-400"></i></button>
                <button class="m3-btn-icon" onclick="window.sendTxnSMS('${g}')" title="ট্রানজেকশন SMS পাঠান"><i class="fa-solid fa-comment-sms text-blue-400"></i></button>
                ${i?`<button class="m3-btn-icon" onclick="window.editTransaction('${g}', '${_}', '${e.date}', '${e.voucherNo||``}', ${m}, ${h}, '${x}', '${b}')" title="এডিট"><i class="fa-solid fa-pen-to-square text-amber-400"></i></button>`:``}
                ${a?`<button class="m3-btn-icon" onclick="window.deleteTransaction('${g}', '${_}', ${m}, ${h})" title="ডিলেট"><i class="fa-solid fa-trash-can text-red-400"></i></button>`:``}
                <button class="m3-btn-icon" onclick="window.choosePrintType('${g}')" title="প্রিন্ট"><i class="fa-solid fa-print text-emerald-400"></i></button>
            </div>
        </div>`}),t.id===`recent-txn-list`){t.innerHTML=s.length>0?s.join(``):`<tr><td colspan="5" class="text-center py-8 text-slate-600 italic">কোনো লেনদেন পাওয়া যায়নি</td></tr>`;let e=document.getElementById(`recent-txn-list-mobile`);e&&(e.innerHTML=c||`<div class="text-center py-8 text-slate-500 font-bold italic">কোনো লেনদেন পাওয়া যায়নি</div>`);return}window.ledgerClusterize&&window.ledgerClusterize.destroy(),s.length>0?window.ledgerClusterize=new Ce.default({rows:s,scrollId:`ledger-scroll-area`,contentId:`ledger-list`}):t.innerHTML=`<tr><td colspan="6" class="text-center py-12 text-slate-600 italic">কোনো লেনদেন পাওয়া যায়নি</td></tr>`,r&&(r.innerHTML=c||`<div class="text-center py-10 text-slate-500 font-bold italic">কোনো লেনদেন পাওয়া যায়নি</div>`),i&&(i.innerHTML=`<tr class="bg-slate-900/90 font-black border-t-2 border-blue-500/40"><td colspan="2" class="text-right text-slate-300 py-3">পৃষ্ঠা মোট (Page Total):</td><td class="text-right text-red-400">৳ ${I(l)}</td><td class="text-right text-emerald-400">৳ ${I(u)}</td><td class="text-right text-white">৳ ${I(Math.abs(l-u))}</td><td></td></tr>`);let p=document.getElementById(`ledger-mobile-sticky-bar`);if(p)if(o&&(e||[]).length>0){let e=d[0],t=e>0,n=I(Math.abs(e));p.innerHTML=`
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
                </div>`,p.classList.remove(`hidden`)}else p.classList.add(`hidden`)}async function Dt(e={},t={}){let r=document.getElementById(`save-txn-btn`),i=document.getElementById(`ledger-customer-select`);if(!i||!i.value)return W.default.fire(`Error`,`কাস্টমার সিলেক্ট করুন`,`error`);let a=i.value,o=i.options[i.selectedIndex].text.replace(/\s*\([^)]*\)\s*$/,``).trim(),s=z(document.getElementById(`ledger-date`).value),u=document.getElementById(`ledger-voucher`).value.trim(),d=L(document.getElementById(`ledger-bill`).value),f=L(document.getElementById(`ledger-paid`).value);if(d===0&&f===0)return W.default.fire(`Error`,`বিল বা জমা দিন`,`error`);r&&(r.disabled=!0,r.innerText=`প্রসেসিং...`);let m=``,h=``;if(f>0){let e=document.getElementById(`recv-cash-btn`);m=document.getElementById(`recv-less-btn`)?.classList.contains(`bg-blue-600`)?`Less`:e?.classList.contains(`bg-blue-600`)?`Cash`:`Bank`,h=document.getElementById(`ledger-received-from`)?.value?.trim()||``}if(!(await W.default.fire({title:`<div class="flex items-center justify-center gap-2 font-bn font-black text-xl text-white"><i class="fa-solid fa-file-shield text-blue-400"></i><span>লেনদেন যাচাই করুন</span></div>`,html:`
            <div class="text-left space-y-3 font-bn p-3.5 bg-slate-900/90 rounded-2xl border border-slate-800 shadow-inner">
                <div class="flex flex-col gap-1 border-b border-slate-800/80 pb-2">
                    <span class="text-[10px] text-blue-400 font-black uppercase tracking-wider">কাস্টমারের নাম</span>
                    <span class="text-base text-white font-black">${o}</span>
                </div>
                <div class="grid grid-cols-2 gap-4 border-b border-slate-800/80 pb-2">
                    <div class="flex flex-col gap-1"><span class="text-[10px] text-blue-400 font-black uppercase tracking-wider">তারিখ</span><span class="text-sm text-slate-200 font-bold font-mono">${V(s)}</span></div>
                    <div class="flex flex-col gap-1"><span class="text-[10px] text-amber-400 font-black uppercase tracking-wider">ভাউচার / মেমো নং</span><span class="text-sm text-amber-400 font-bold font-mono">${u||`-`}</span></div>
                </div>
                <div class="grid grid-cols-2 gap-4 border-b border-slate-800/80 pb-2">
                    <div class="flex flex-col gap-1"><span class="text-[10px] text-blue-400 font-black uppercase tracking-wider">বিল / কেনাকাটা</span><span class="text-lg text-blue-400 font-black font-mono">৳ ${I(d)}</span></div>
                    <div class="flex flex-col gap-1"><span class="text-[10px] text-emerald-400 font-black uppercase tracking-wider">জমা প্রাপ্তি</span><span class="text-lg text-emerald-400 font-black font-mono">৳ ${I(f)}</span></div>
                </div>
                ${f>0?`<div class="flex flex-col gap-1 border-b border-slate-800/80 pb-2"><span class="text-[10px] text-purple-400 font-black uppercase tracking-wider">পেমেন্ট মাধ্যম</span><span class="text-xs text-purple-300 font-bold">${m} ${h?`(`+h+`)`:``}</span></div>`:``}
            </div>
            <p class="text-xs text-amber-400 font-bold mt-3 text-center">সব তথ্য সঠিক থাকলে "কনফার্ম করুন" বাটনে ক্লিক করুন।</p>
        `,showCancelButton:!0,confirmButtonText:`<i class="fa-solid fa-circle-check mr-2"></i>কনফার্ম করুন`,cancelButtonText:`<i class="fa-solid fa-pen-to-square mr-2"></i>সংশোধন করব`,customClass:{popup:`!bg-slate-950 !text-white !rounded-3xl border border-slate-800 shadow-2xl font-bn`,confirmButton:`m3-btn-primary !bg-blue-600 hover:!bg-blue-500 !px-7 !py-2.5 !rounded-xl font-bold shadow-lg shadow-blue-600/30`,cancelButton:`m3-btn-tonal !bg-slate-800 hover:!bg-slate-700 !text-slate-300 !px-5 !py-2.5 !rounded-xl font-bold border border-slate-700`}})).isConfirmed){r&&(r.disabled=!1,r.innerText=`এন্ট্রি সেভ করুন`);return}try{let r=A().find(e=>e.id===a);try{let e=await l.getById(a);e&&(r=e)}catch(e){console.warn(`Live fetch failed`,e)}let i=r&&Number(r.totalDue)||0,_=c.batch(),v=B(d-f),y=v;if(e.id){let t=B((e.oldBill||0)-(e.oldPaid||0)),r=B(v-t);y=r,_.update(g.getRef(e.id),{date:s,voucherNo:u,bill:d,paid:f,receivedType:m,receivedFrom:h,currentDue:n.firestore.FieldValue.increment(r)}),_.update(l.getRef(a),{totalDue:n.firestore.FieldValue.increment(r)}),e.id=null}else{let e=g.getRef();_.set(e,{customerId:a,customerName:o,date:s,voucherNo:u,bill:B(d),paid:B(f),receivedType:m,receivedFrom:h,prevDue:B(i),currentDue:B(i+v),createdBy:U?.currentUserEmail||`Unknown`,createdAt:n.firestore.FieldValue.serverTimestamp()}),_.update(l.getRef(a),{totalDue:n.firestore.FieldValue.increment(v)})}let b=B(i+y);await _.commit(),R(`লেনদেন সফলভাবে সেভ হয়েছে!`,`success`);try{let e=A().find(e=>e.id===a)?.phone;if(e&&e.trim()!==``&&e!==`-`){let t=await p.getAppSettings(),n=V(s),r=(typeof window.toBanglishName==`function`?window.toBanglishName(o):o)||`Customer`,i=t.shopName?typeof window.toBanglishName==`function`?window.toBanglishName(t.shopName):t.shopName:`M/S. Maa Motors`,a=I(Math.abs(b)),c=``;c=d>0?(t.smsTemplateNew||`Dear [Name], Memo #[Memo] of Tk [Bill] created on [Date]. Paid: Tk [Paid], Due: Tk [Due]. Thanks! - [Shop]`).replace(/\[Name\]/g,r).replace(/\[Shop\]/g,i).replace(/\[Date\]/g,n).replace(/\[Memo\]/g,u||`1`).replace(/\[Bill\]/g,I(d)).replace(/\[Paid\]/g,I(f)).replace(/\[Due\]/g,a):(t.smsTemplatePaid||`Dear [Name], Received Tk [Paid] ([Type]) on [Date]. Net Due: Tk [Due]. Thanks! - [Shop]`).replace(/\[Name\]/g,r).replace(/\[Shop\]/g,i).replace(/\[Date\]/g,n).replace(/\[Paid\]/g,I(f)).replace(/\[Type\]/g,m||`Cash`).replace(/\[Due\]/g,a),c=c.replace(/\s+/g,` `).replace(/[^\x00-\x7F]/g,``);let{value:l,isConfirmed:h}=await W.default.fire({title:`<div class="flex flex-col items-center gap-2"><i class="fa-solid fa-comment-sms text-emerald-400 text-3xl mb-1"></i><span class="font-bn font-black text-xl text-white">Transaction SMS Preview</span></div>`,html:`<div class="text-left space-y-2 mb-2 font-bn">
                            <p class="text-[13px] text-slate-300">কাস্টমারকে কি লেনদেনের মেসেজ পাঠাতে চান? চাইলে নিচের লেখা এডিট করতে পারেন:</p>
                            <div class="flex justify-between items-center"><div class="text-xs text-slate-400">Recipient Phone: <strong class="text-white">${e}</strong></div><div id="sms-txn-char-counter" class="text-[11px] font-bold text-emerald-400 text-right">0 / 160 Characters (1 SMS)</div></div>
                           </div>`,input:`textarea`,inputValue:c,inputAttributes:{rows:4,class:`m3-field text-xs font-mono !mt-0`},showCancelButton:!0,confirmButtonText:`<i class="fa-solid fa-paper-plane mr-1.5"></i> পাঠিয়ে দিন`,cancelButtonText:`স্কিপ করুন`,customClass:{popup:`!bg-slate-950 !text-white !rounded-3xl border border-slate-700 shadow-2xl`,confirmButton:`m3-btn-primary !bg-emerald-600 hover:!bg-emerald-500 !px-7 !py-2.5 !rounded-xl font-bold shadow-lg shadow-emerald-600/30`,cancelButton:`m3-btn-tonal !bg-slate-800 hover:!bg-slate-700 !text-slate-300 !px-5 !py-2.5 !rounded-xl font-bold border border-slate-700`},didOpen:()=>{let e=W.default.getInput(),t=document.getElementById(`sms-txn-char-counter`),n=()=>{if(e&&t){let n=e.value.length,r=Math.ceil(n/160)||1;t.innerText=`${n} / 160 Characters (${r} SMS)`}};e&&(e.oninput=n,n(),setTimeout(()=>e.focus(),150))}});h&&l&&await x(e,l,!1)&&R(`এসএমএস সফলভাবে পাঠানো হয়েছে`,`success`)}}catch(e){console.warn(`Transaction SMS dispatch error:`,e)}document.getElementById(`ledger-bill`).value=``,document.getElementById(`ledger-paid`).value=``,ce(`ledger-bill-words`),ce(`ledger-paid-words`);let S=document.getElementById(`ledger-voucher`);S&&(S.value=``);let C=document.getElementById(`ledger-received-from`);C&&(C.value=``),t.filterLedgerByCustomer&&t.filterLedgerByCustomer(a)}catch(e){k(e,`লেনদেন সেভ করতে ব্যর্থ`)}finally{r&&(r.disabled=!1,r.innerText=`এন্ট্রি সেভ করুন`,r.className=`m3-btn-primary rounded-xl h-10 px-8 text-xs font-bold shadow-md shadow-blue-600/20`)}}async function Ot(e,t,n,r,i,a,o,s,c={}){if(!await O(`খতিয়ান এডিট (Authorization)`))return;c.id=e,c.oldBill=i,c.oldPaid=a,document.getElementById(`ledger-customer-select`)&&(document.getElementById(`ledger-customer-select`).value=t),document.getElementById(`ledger-date`)&&(document.getElementById(`ledger-date`).value=n),document.getElementById(`ledger-voucher`)&&(document.getElementById(`ledger-voucher`).value=r),document.getElementById(`ledger-bill`)&&(document.getElementById(`ledger-bill`).value=i),document.getElementById(`ledger-paid`)&&(document.getElementById(`ledger-paid`).value=a),window.setReceivedType&&window.setReceivedType(o),document.getElementById(`ledger-received-from`)&&(document.getElementById(`ledger-received-from`).value=s),window.updateLedgerLiveText&&window.updateLedgerLiveText(),window.toggleReceivedSection&&window.toggleReceivedSection();let l=document.getElementById(`save-txn-btn`);l&&(l.innerHTML=`<i class="fa-solid fa-pen-to-square mr-1.5"></i>আপডেট সংশোধন করুন`,l.className=`m3-btn-primary rounded-xl h-10 px-8 text-xs font-bold shadow-md !bg-amber-600 hover:!bg-amber-500`);let u=document.getElementById(`view-container`),d=document.getElementById(`ledger-form-card`)||document.getElementById(`ledger-customer-select`);u&&u.scrollTo({top:0,behavior:`smooth`}),d&&d.scrollIntoView({behavior:`smooth`,block:`start`}),setTimeout(()=>{let e=document.getElementById(`ledger-bill`);e&&(e.focus(),e.select&&e.select())},350)}async function kt(e,t,r,i,a={}){if(await O(`Delete`)){let o=c.batch();o.update(l.getRef(t),{totalDue:n.firestore.FieldValue.increment(B(i-r))}),o.delete(g.getRef(e)),await o.commit(),R(`লেনদেন ডিলেট করা হয়েছে!`,`info`),a.filterLedgerByCustomer&&a.filterLedgerByCustomer(t)}}async function At(e,t,n,r,i,a,o,s,c={}){if(await O(`SMS পাঠানোর অনুমতি (Master PIN)`))try{let{currentLedgerTxnsMap:u,currentLedgerTxns:d}=c,f=u&&u[e]?u[e]:(d||[]).find(t=>t.id===e);if(!f&&e)try{f=await g.getById(e)}catch(e){console.error(`Error fetching txn:`,e)}let m=s||f?.customerId,h=t||f?.customerName||`Customer`,_=n||f?.date,v=r===void 0?f?.voucherNo||``:r,y=Number(i===void 0?f?.bill||0:i),b=Number(a===void 0?f?.paid||0:a),S=A().find(e=>e.id===m);if(!S&&m)try{S=await l.getById(m)}catch(e){console.error(`Error fetching cust:`,e)}let C=f?.phone||S?.phone||``,w=f?.calculatedDue===void 0?Number(o===void 0?S?S.totalDue||0:f?.currentDue||0:o):f.calculatedDue;if(!C){let{value:e}=await W.default.fire({title:`<i class="fa-solid fa-mobile-screen text-blue-400 mr-2"></i>Enter Phone Number`,input:`text`,inputLabel:`Phone number missing for "${h}". Enter phone number:`,inputPlaceholder:`018XXXXXXXX`,showCancelButton:!0,confirmButtonText:`Next`,cancelButtonText:`Cancel`,customClass:{popup:`!bg-slate-900 !text-white !rounded-3xl border border-slate-700`}});if(!e||!e.trim())return;C=e.trim()}let T=await p.getAppSettings(),E=V(_),ee=I(y),D=I(b),O=I(Math.abs(w)),k=v===`OPENING`||v===`OPEN`||v===`প্রারম্ভিক জের`||_&&String(v).toUpperCase()===`OPENING`,te=(typeof window.toBanglishName==`function`?window.toBanglishName(h):h)||`Customer`,j=T.shopName?typeof window.toBanglishName==`function`?window.toBanglishName(T.shopName):T.shopName:`M/S. Maa Motors`,M=S?.accountNo||f?.customerAccountNo||f?.accountNo||``,N=M?`(A/C: ${M})`:``,P=``;if(k)P=(T.smsTemplateOpening||`Dear [Name] [AccNo], A/C opened at [Shop] on [Date]. Opening Due: Tk [Due]. Thanks!`).replace(/\[Name\]/g,te).replace(/\[AccNo\]/g,N).replace(/\[Shop\]/g,j).replace(/\[Date\]/g,E).replace(/\[Due\]/g,O);else if(y>0)P=(T.smsTemplateNew||`Dear [Name] [AccNo], Memo #[Memo] of Tk [Bill] created on [Date]. Paid: Tk [Paid], Due: Tk [Due]. Thanks! - [Shop]`).replace(/\[Name\]/g,te).replace(/\[AccNo\]/g,N).replace(/\[Shop\]/g,j).replace(/\[Date\]/g,E).replace(/\[Memo\]/g,v||`1`).replace(/\[Bill\]/g,ee).replace(/\[Paid\]/g,D).replace(/\[Due\]/g,O);else{let e=T.smsTemplatePaid||`Dear [Name] [AccNo], Received Tk [Paid] ([Type]) on [Date]. Net Due: Tk [Due]. Thanks! - [Shop]`,t=f?.receivedType||`Cash`;P=e.replace(/\[Name\]/g,te).replace(/\[AccNo\]/g,N).replace(/\[Shop\]/g,j).replace(/\[Date\]/g,E).replace(/\[Paid\]/g,D).replace(/\[Type\]/g,t).replace(/\[Due\]/g,O)}P=P.replace(/\s+/g,` `).replace(/[^\x00-\x7F]/g,``);let{value:ne}=await W.default.fire({title:`<i class="fa-solid fa-comment-sms text-blue-400 mr-2"></i>Send Transaction SMS`,html:`<div class="text-left space-y-1 mb-2 font-bn"><div class="text-xs text-slate-400">Recipient Phone: <strong class="text-white">${C}</strong></div><div id="sms-char-counter" class="text-[11px] font-bold text-emerald-400 text-right">0 / 160 Characters (1 SMS)</div></div>`,input:`textarea`,inputValue:P,inputAttributes:{rows:5,class:`m3-field text-xs font-mono`},showCancelButton:!0,confirmButtonText:`<i class="fa-solid fa-paper-plane mr-1.5"></i> Send SMS`,cancelButtonText:`Cancel`,customClass:{popup:`!bg-slate-900 !text-white !rounded-3xl border border-slate-700`},didOpen:()=>{let e=W.default.getInput(),t=document.getElementById(`sms-char-counter`),n=()=>{if(e&&t){let n=e.value.length,r=Math.ceil(n/160)||1;t.innerText=`${n} / 160 Characters (${r} SMS)`}};e&&(e.oninput=n),n()}});ne&&await x(C,ne,!1)&&W.default.fire({title:`<i class="fa-solid fa-paper-plane text-emerald-400 mr-2"></i>সফল!`,text:`${h}-কে SMS সফলভাবে পাঠানো হয়েছে`,icon:`success`,customClass:{popup:`!bg-slate-900 !text-white !rounded-3xl border border-slate-700`}})}catch(e){console.error(`sendTxnSMS error:`,e),W.default.fire({title:`এরর!`,text:`SMS তৈরি করতে সমস্যা হয়েছে: `+(e.message||e),icon:`error`,customClass:{popup:`!bg-slate-900 !text-white !rounded-3xl border border-slate-700`}})}}async function jt(e,t,n,r,i,a,o,s,c={}){let{currentLedgerTxns:u}=c,d=(u||[]).find(t=>t.id===e);if(!d&&e)try{d=await g.getById(e)}catch(e){console.error(`Error fetching txn:`,e)}let f=s||d?.customerId,p=t||d?.customerName||`Customer`,m=n||d?.date,h=r===void 0?d?.voucherNo||``:r,_=Number(i===void 0?d?.bill||0:i),v=Number(a===void 0?d?.paid||0:a),y=A().find(e=>e.id===f);if(!y&&f)try{y=await l.getById(f)}catch(e){console.error(`Error fetching cust:`,e)}let b=y?.phone||``,x=c?.currentLedgerTxnsMap&&c.currentLedgerTxnsMap[e]?c.currentLedgerTxnsMap[e]:null,S=x?.calculatedDue===void 0?Number(o===void 0?y?y.totalDue||0:d?.currentDue||0:o):x.calculatedDue;if(!b){let{value:e}=await W.default.fire({title:`<i class="fa-brands fa-whatsapp text-emerald-400 mr-2"></i>Enter Phone Number`,input:`text`,inputLabel:`Phone number missing for "${p}". Enter phone number:`,inputPlaceholder:`018XXXXXXXX`,showCancelButton:!0,confirmButtonText:`Next`,cancelButtonText:`Cancel`,customClass:{popup:`!bg-slate-900 !text-white !rounded-3xl border border-slate-700`}});if(!e||!e.trim())return;b=e.trim()}let C=y?.accountNo||d?.customerAccountNo||d?.accountNo||``,w=C?`একাউন্ট নং: ${C}\n`:``,T=V(m),E=I(_),ee=I(v),D=I(Math.abs(S)),O=h?`মেমো #${h}`:``,k=e?`${window.location.origin}${window.location.pathname}?view=public-memo&id=${e}`:``,te=f?`${window.location.origin}${window.location.pathname}?view=public-stmt&id=${f}`:``,j=k?`আপনার এই মেমোর ডাইরেক্ট PDF দেখতে লিংকে ক্লিক করুন:\n${k}\n\n`:te?`আপনার সম্পূর্ণ মেমো ও হিসাবের PDF বিবরণী দেখতে নিচের লিংকে ক্লিক করুন:\n${te}\n\n`:``,M=``;if(h===`OPENING`||h===`OPEN`||h===`প্রারম্ভিক জের`||m&&String(h).toUpperCase()===`OPENING`){M=`আসসালামু আলাইকুম ${p},\nমেসার্স মা মোটরস্ থেকে আপনার হিসাবের একাউন্ট খোলা হয়েছে।\n\n${w}একাউন্ট খোলার তারিখ: ${T}\n`;let e=_>0?_:v>0?-v:0,t=I(Math.abs(e));M+=e>0?`প্রারম্ভিক বকেয়া: ৳ ${t}\n`:e<0?`প্রারম্ভিক জমা: ৳ ${t}\n`:`প্রারম্ভিক জের: ৳ 0
`,M+=`---------------------------------
`,M+=S<0?`অ্যাডভান্স জমা: ৳ ${D}\n\n`:`বর্তমান মোট বকেয়া: ৳ ${D}\n\n`,j&&(M+=j),M+=`যোগাযোগ: 01819-397669
ধন্যবাদ! — মেসার্স মা মোটরস্`}else _>0?(M=`আসসালামু আলাইকুম ${p},\nমেসার্স মা মোটরস্ থেকে আপনার কেনাকাটার বিবরণী:\n\n${w}তারিখ: ${T}\n${O?O+`
`:``}আজকের বিল/খরচ: ৳ ${E}\nআজকের জমা: ৳ ${ee}\n---------------------------------\n`,M+=S<0?`অ্যাডভান্স জমা: ৳ ${D}\n\n`:`বর্তমান মোট বকেয়া: ৳ ${D}\n\n`,j&&(M+=j),M+=`যোগাযোগ: 01819-397669
ধন্যবাদ! — মেসার্স মা মোটরস্`):(M=`আসসালামু আলাইকুম ${p},\nমেসার্স মা মোটরস্-এ আপনার টাকা জমা নেওয়ার রিসিট:\n\n${w}তারিখ: ${T}\nজমা প্রাপ্তি: ৳ ${ee}\n---------------------------------\n`,M+=S<0?`অ্যাডভান্স জমা: ৳ ${D}\n\n`:`বর্তমান মোট বকেয়া: ৳ ${D}\n\n`,j&&(M+=j),M+=`যোগাযোগ: 01819-397669
ধন্যবাদ! — মেসার্স মা মোটরস্`);let{value:N}=await W.default.fire({title:`<div class="flex items-center justify-center gap-2 font-bn font-black text-lg text-emerald-400"><i class="fa-brands fa-whatsapp text-xl"></i><span>Send WhatsApp Message</span></div>`,html:`<div class="text-left space-y-1 mb-2 font-bn"><div class="text-xs text-slate-400">Recipient Phone: <strong class="text-white">${b}</strong></div></div>`,input:`textarea`,inputValue:M,inputAttributes:{rows:8,class:`m3-field text-xs font-bn`},showCancelButton:!0,confirmButtonText:`<i class="fa-brands fa-whatsapp mr-1.5"></i> Open WhatsApp`,cancelButtonText:`Cancel`,customClass:{popup:`!bg-slate-950 !text-white !rounded-3xl border border-slate-800 shadow-2xl font-bn`,confirmButton:`m3-btn-primary !bg-emerald-600 hover:!bg-emerald-500 !px-6 !py-2 rounded-xl font-bold`}});N&&window.sendWhatsApp&&window.sendWhatsApp(b,N)}async function Mt(e,t){try{if(W.default!==void 0&&W.default.close&&W.default.close(),typeof window.printReceiptEngine==`function`)await window.printReceiptEngine(e,t);else{let{printReceiptEngine:n}=await b(async()=>{let{printReceiptEngine:e}=await import(`./receipt-engine--dF8PpIU.js`);return{printReceiptEngine:e}},__vite__mapDeps([0,1,2,3,4,5,6,7,8]));window.printReceiptEngine=n,await window.printReceiptEngine(e,t)}}catch(e){typeof R==`function`&&R(`প্রিন্ট লোড ব্যর্থ: ${e.message}`,`error`,`প্রিন্ট Error`)}}function Nt(e){W.default.fire({title:`<div class="flex items-center justify-center gap-2 font-bn font-black text-lg text-white"><i class="fa-solid fa-print text-emerald-400"></i><span>রিসিট প্রিন্ট ফরম্যাট নির্বাচন করুন</span></div>`,html:`
            <div class="flex flex-col gap-3 p-1 font-bn mt-2">
                <button type="button" onclick="window.executePrint('${e}', 'pos')" class="h-11 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-blue-600/30 transition-all cursor-pointer">
                    <i class="fa-solid fa-receipt text-sm"></i> POS রিসিট (80mm Thermal Printer)
                </button>
                <button type="button" onclick="window.executePrint('${e}', 'a4')" class="h-11 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs flex items-center justify-center gap-2 border border-slate-700 transition-all cursor-pointer">
                    <i class="fa-solid fa-file-invoice text-sm text-purple-400"></i> A4 ফুল পেপার মেমো (Standard Invoice)
                </button>
            </div>
        `,showConfirmButton:!1,showCancelButton:!0,cancelButtonText:`বাতিল`,customClass:{popup:`!bg-slate-950 !text-white !rounded-3xl border border-slate-800 shadow-2xl font-bn`,cancelButton:`!bg-slate-900 hover:!bg-slate-800 !text-slate-400 !px-6 !py-2 !rounded-xl text-xs font-bold border border-slate-800`}})}var Pt={id:null,oldBill:0,oldPaid:0},Ft=[],It={},Lt=null,G=[],K=1,Rt=20,zt={currentLedgerTxns:Ft,currentLedgerTxnsMap:It};async function Bt(e=null,t=null,n=`reset`){let r=document.getElementById(`ledger-list`),i=document.getElementById(`ledger-list-mobile`),a=document.getElementById(`recent-txn-list`),o=document.getElementById(`ledger-pagination`);if(n===`reset`&&(Lt=null,G=[],K=1),t===null&&!e){let e=document.getElementById(`ledger-customer-select`);e&&e.value&&(t=e.value)}r&&(r.innerHTML=`<tr><td colspan="6" class="text-center py-12"><i class="fa-solid fa-spinner fa-spin mr-3 text-blue-500 text-xl"></i> লোডিং...</td></tr>`),i&&(i.innerHTML=`<div class="text-center py-10 text-slate-500 font-bold italic">লোডিং...</div>`);try{let i;if(e){let t=await g.getByVoucher(e);i={data:t,lastDoc:null,count:t.length},o&&o.classList.add(`hidden`)}else{let e=t?[{field:`customerId`,op:`==`,value:t}]:[];if(a&&!r)return g.listenRecent(5,e=>Ut(e,a));let s=n===`next`?Lt:n===`prev`&&G.length>1?G[G.length-2]:null;if(t)try{i=await g.getByPage(Rt,s,`createdAt`,`desc`,e)}catch{i=await g.getByPage(Rt,s,`date`,`desc`,e)}else i=await g.getByPage(Rt,s,`createdAt`,`desc`,e);if(Lt=i.lastDoc,n===`next`?s&&G.push(s):n===`prev`&&G.pop(),o){o.classList.remove(`hidden`);let e=document.getElementById(`current-page-display`);e&&(e.innerText=K);let t=document.getElementById(`prev-page`),n=document.getElementById(`next-page`);t&&(t.disabled=K===1),n&&(n.disabled=i.count<Rt)}}Ut(i.data,r)}catch(e){k(e,`লেনদেন লোড করতে সমস্যা হয়েছে`),r&&(r.innerHTML=`<tr><td colspan="6" class="text-center py-12 text-red-400">ডাটা লোড করতে সমস্যা হয়েছে</td></tr>`)}}function Vt(e){Lt=null,G=[],K=1,Ht(),Bt(null,e)}function Ht(){Tt()}function Ut(e,t){Et(e,t,zt)}function Wt(e,t){wt(e,t,{loadCustomersForDropdown:Qt,loadRecentTransactions:Bt,filterLedgerByCustomer:Vt}),K=1,G=[],Lt=null}async function Gt(){return Dt(Pt,{filterLedgerByCustomer:Vt})}async function Kt(e,t,n,r,i,a,o,s){return At(e,t,n,r,i,a,o,s,zt)}async function qt(e,t,n,r,i,a,o,s){return jt(e,t,n,r,i,a,o,s,zt)}async function Jt(e,t,n,r,i,a,o,s){return Ot(e,t,n,r,i,a,o,s,Pt)}async function Yt(e,t,n,r){return kt(e,t,n,r,{filterLedgerByCustomer:Vt})}async function Xt(e,t){return Mt(e,t)}function Zt(e){return Nt(e)}async function Qt(){let e=A();e.length||(w(),e=await l.getAll(`name`,`asc`));let t=document.getElementById(`ledger-customer-select`);t&&(t.innerHTML=`<option value="">-- সকল কাস্টমার --</option>`+e.map(e=>{let t=e.accountNo?`[${e.accountNo}] `:``;return`<option value="${e.id}" data-due="${e.totalDue||0}" data-phone="${e.phone||``}" data-name="${e.name}" data-acc="${e.accountNo||``}">${t}${e.name}</option>`}).join(``))}function $t(e=``){mt(e,{inputId:`ledger-cust-search-input`,selectId:`tx-customer`,dropdownId:`ledger-cust-dropdown`,onSelect:e=>en(e)})}function en(e){let t=document.getElementById(`ledger-customer-select`),n=document.getElementById(`ledger-cust-search-input`),r=document.getElementById(`ledger-cust-search-clear`),i=document.getElementById(`ledger-cust-dropdown`);if(t&&(t.value=e,Vt(e)),t&&t.selectedIndex>0){let e=t.options[t.selectedIndex];n&&(n.value=`${e.dataset.name||e.text}`),r&&r.classList.remove(`hidden`)}i&&i.classList.add(`hidden`)}function tn(){let e=document.getElementById(`ledger-customer-select`),t=document.getElementById(`ledger-cust-search-input`),n=document.getElementById(`ledger-cust-search-clear`),r=document.getElementById(`ledger-cust-dropdown`);e&&(e.value=``,Vt(``)),t&&(t.value=``),n&&n.classList.add(`hidden`),r&&r.classList.add(`hidden`)}typeof window<`u`&&(window.loadRecentTransactions=Bt,window.saveTransaction=Gt,window.sendTxnSMS=Kt,window.sendTxnWhatsApp=qt,window.updateLedgerLiveText=Ht,window.filterLedgerByCustomer=Vt,window.editTransaction=Jt,window.deleteTransaction=Yt,window.executePrint=Xt,window.choosePrintType=Zt,window.filterLedgerCustomerSearch=$t,window.selectLedgerCustomer=en,window.clearLedgerCustomerSearch=tn,window.changeLedgerPage=async e=>{let t=K;e===`next`?K++:K--;try{let t=document.getElementById(`ledger-customer-select`)?.value;await Bt(null,t,e)}catch{K=t}},window.toggleReceivedSection=()=>{let e=L(document.getElementById(`ledger-paid`)?.value||`0`);document.getElementById(`received-section`)?.classList.toggle(`hidden`,e<=0)},window.setReceivedType=e=>{[`Bank`,`Cash`,`Less`].forEach(t=>{let n=document.getElementById(`recv-`+t.toLowerCase()+`-btn`);n&&(t===e?(n.classList.add(`bg-blue-600`,`text-white`),n.classList.remove(`text-slate-400`)):(n.classList.remove(`bg-blue-600`,`text-white`),n.classList.add(`text-slate-400`)))});let t=document.getElementById(`lbl-recv-from`);if(document.getElementById(`ledger-received-from`),document.getElementById(`btn-quick-add-recv`),t){let n=document.getElementById(`recv-input-wrapper`);e===`Bank`?(t.innerText=`ব্যাংক অ্যাকাউন্ট (Bank Name)`,n.innerHTML=`
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
                `)}},window.Swal=W.default),document.addEventListener(`click`,e=>{let t=document.getElementById(`ledger-cust-dropdown`),n=document.getElementById(`ledger-cust-search-input`);t&&!t.contains(e.target)&&e.target!==n&&t.classList.add(`hidden`)});var nn=null,rn=[],an=1,on=20;function sn(e){if(window.AppState.currentUserRole===`Staff`&&window.AppState.permissions.viewExpenses===!1){e.innerHTML=`<div class="m3-card text-center font-bn py-12"><h2 class="text-xl font-bold text-red-500">অ্যাক্সেস ডিনাইড!</h2></div>`;return}nn=null,rn=[],an=1,e.innerHTML=`
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
        </div>`,document.getElementById(`exp-date`).value=window.getTodayLocalDateString?window.getTodayLocalDateString():new Date().toISOString().split(`T`)[0],cn(),ln()}async function cn(){let e=document.getElementById(`exp-category`);e&&(e.innerHTML=[`দোকান ভাড়া`,`বিদ্যুৎ বিল`,`পানি বিল`,`ইন্টারনেট/ডিস বিল`,`স্টাফ বেতন`,`নাস্তা/আপ্যায়ন`,`চা/কফি`,`যাতায়াত/পরিবহন`,`মালামাল/পণ্য ক্রয়`,`প্রিন্টিং/স্টেশনারি`,`মেরামতি/রক্ষণাবেক্ষণ`,`দান/চাঁদা`,`পৌরসভা/ট্যাক্স`,`কুরিয়ার/পার্সেল`,`অন্যান্য`].map(e=>`<option value="${e}">${e}</option>`).join(``)+`<option value="ADD_NEW">+ নতুন ক্যাটাগরি যোগ করুন...</option>`)}async function ln(e=`next`){let t=document.getElementById(`expense-list`);if(!t)return;let n=document.getElementById(`expense-list-mobile`);t.innerHTML=`<tr><td colspan="5" class="text-center py-12">লোডিং...</td></tr>`,n&&(n.innerHTML=`<div class="text-center py-10 text-slate-500 font-bold italic">লোডিং...</div>`);try{let n=e===`next`?nn:rn.length>1?rn[rn.length-2]:null,r=await a.getByPage(on,n,`createdAt`,`desc`);nn=r.lastDoc,e===`next`?n&&rn.push(n):rn.pop();let i=document.getElementById(`expense-pagination`);i&&(i.classList.remove(`hidden`),document.getElementById(`exp-current-page-display`).innerText=an,document.getElementById(`exp-prev-page`).disabled=an===1,document.getElementById(`exp-next-page`).disabled=r.count<on),un(r.data,t)}catch{t.innerHTML=`Error loading data`}}function un(e,t){let n=document.getElementById(`expense-list-mobile`),r=String(window.AppState?.currentUserRole||``).toLowerCase()===`admin`,i=r||window.AppState?.permissions?.editExpenses!==!1&&window.AppState?.permissions?.manageExpenses!==!1,a=r||window.AppState?.permissions?.deleteExpenses===!0,o=F(),s=0;e.forEach(e=>{e.date===o&&(s+=Number(e.amount)||0)});let c=document.getElementById(`expense-today-sum`);c&&(c.innerText=`৳ ${I(s)}`);let l=``,u=``;e.forEach(e=>{let t=H(e.category),n=H(e.details||`-`),r=t.replace(/'/g,`\\'`);l+=`
            <tr class="border-b border-slate-800/50 hover:bg-white/[0.02] transition-colors">
                <td class="text-slate-300 font-bold text-xs">${V(e.date)}${e.createdBy?`<div class="text-[8px] text-blue-400/80 italic mt-0.5">by ${H(e.createdBy)}</div>`:``}</td>
                <td class="font-bold text-white text-sm">${t}</td>
                <td class="text-xs text-slate-200">${n}</td>
                <td class="text-right text-red-400 font-black text-base">৳${I(e.amount)}</td>
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
                        <div class="mobile-card-sub text-slate-400 font-bold mt-0.5">${V(e.date)}</div>
                    </div>
                    <div class="text-right">
                        <div class="text-red-400 font-black text-lg">৳ ${I(e.amount)}</div>
                    </div>
                </div>
                <div class="mobile-card-row"><span class="mobile-card-label">বিবরণ:</span><span class="mobile-card-value text-slate-200">${n}</span></div>
                ${e.createdBy?`<div class="mobile-card-row"><span class="mobile-card-label">এন্ট্রিদাতা:</span><span class="mobile-card-value text-blue-400 text-xs">${H(e.createdBy)}</span></div>`:``}
                ${i||a?`
                <div class="mobile-card-actions">
                    ${i?`<button class="m3-btn-icon" onclick="window.editExpense('${e.id}', '${e.date}', '${r}', ${e.amount}, '${encodeURIComponent(e.details||``)}')" title="এডিট"><i class="fa-solid fa-pen-to-square text-amber-400"></i></button>`:``}
                    ${a?`<button class="m3-btn-icon" onclick="window.deleteExpense('${e.id}', '${r}')" title="ডিলেট"><i class="fa-solid fa-trash-can text-red-400"></i></button>`:``}
                </div>`:``}
            </div>`}),t.innerHTML=l||`<tr><td colspan="5" class="text-center py-10 italic">কোনো ডাটা নেই</td></tr>`,n&&(n.innerHTML=u||`<div class="text-center py-10 text-slate-500 font-bold italic">কোনো ডাটা নেই</div>`)}function dn(e){e===`next`?an++:an--,ln(e)}var fn=null;async function pn(){let e=document.getElementById(`exp-date`),t=document.getElementById(`exp-category`),n=document.getElementById(`exp-details`),r=document.getElementById(`exp-amount`);if(!e||!t||!r)return;let i=z(e.value),o=t.value,s=n.value.trim(),c=L(r.value);if(!c||c<=0)return W.default.fire({title:`ত্রুটি!`,text:`সঠিক খরচের পরিমাণ লিখুন`,icon:`error`});let l=document.getElementById(`save-exp-btn`);l&&(l.disabled=!0);let u=_(c),d=!!fn;if(!(await W.default.fire({title:d?`<i class="fa-solid fa-magnifying-glass text-amber-400 mr-2"></i>খরচ সংশোধন যাচাই`:`<i class="fa-solid fa-magnifying-glass text-blue-400 mr-2"></i>খরচ যাচাই করুন`,html:`
            <div class="text-left space-y-3 font-bn p-2 bg-slate-900 rounded-2xl border border-slate-800">
                <div class="flex flex-col gap-1 border-b border-slate-800 pb-2">
                    <span class="text-[10px] text-blue-400 font-black uppercase tracking-widest">খরচের ক্যাটাগরি</span>
                    <span class="text-lg text-white font-black">${o}</span>
                </div>
                <div class="flex flex-col gap-1 border-b border-slate-800 pb-2">
                    <span class="text-[10px] text-slate-400 font-black uppercase tracking-widest">বিবরণ / নোট</span>
                    <span class="text-sm text-slate-200 font-bold">${s||`N/A`}</span>
                </div>
                <div class="flex flex-col gap-1 pt-1">
                    <span class="text-[10px] text-red-400 font-black uppercase tracking-widest">খরচের পরিমাণ</span>
                    <span class="text-2xl text-red-400 font-black">৳ ${I(c)}</span>
                    ${u?`<div class="text-[11px] text-red-400 font-black italic bg-red-500/10 px-2 py-1 rounded-lg border border-red-500/20 mt-1">(${u})</div>`:``}
                </div>
                <div class="flex flex-col gap-1 pt-2 border-t border-slate-800">
                    <span class="text-[10px] text-slate-400 font-black uppercase tracking-widest">তারিখ</span>
                    <span class="text-sm text-slate-300 font-bold font-mono">${V(i)}</span>
                </div>
            </div>
            <p class="text-xs text-amber-400 font-bold mt-3 text-center">তথ্য সঠিক থাকলে "কনফার্ম করুন" বাটনে চাপুন।</p>
        `,showCancelButton:!0,confirmButtonText:`<i class="fa-solid fa-circle-check mr-2"></i>কনফার্ম করুন`,cancelButtonText:`<i class="fa-solid fa-pen-to-square mr-2"></i>সংশোধন করব`,customClass:{popup:`!bg-slate-950 !text-white !rounded-3xl border border-slate-800 shadow-2xl font-bn`,confirmButton:`m3-btn-primary !bg-red-600 hover:!bg-red-500 !px-6 !py-2 rounded-xl font-bold`,cancelButton:`m3-btn-tonal !bg-slate-800 hover:!bg-slate-700 !text-slate-300 !px-4 !py-2 rounded-xl font-bold border border-slate-700`}})).isConfirmed){l&&(l.disabled=!1);return}try{if(fn)await a.update(fn,{date:i,category:o,details:s,amount:c}),S(`UPDATE`,`Expenses`,fn,o,{amount:c}),fn=null,l&&(l.innerHTML=`<i class="fa-solid fa-cloud-arrow-up"></i> সেভ করুন`,l.className=`m3-btn-primary px-6 h-[42px] py-0 text-sm font-black uppercase tracking-widest w-full flex items-center justify-center gap-2`);else{let e=await a.add({date:i,category:o,details:s,amount:c,createdBy:U.currentUserEmail});S(`CREATE`,`Expenses`,e,o,{amount:c})}r.value=``,n.value=``,ce(`exp-amount-words`),t&&(t.selectedIndex=0),W.default.fire({toast:!0,position:`top-end`,icon:`success`,title:`সাফল্য!`,timer:2e3}),ln()}catch{W.default.fire(`Error`,`ব্যর্থ হয়েছেন`,`error`)}finally{l&&(l.disabled=!1)}}async function mn(e,t){if(await O(`খরচ মুছে ফেলা`))try{await a.delete(e),S(`DELETE`,`Expenses`,e,t),ln(),W.default.fire(`সফল!`,`খরচ মুছে ফেলা হয়েছে।`,`success`)}catch{W.default.fire(`Error`,`মুছতে সমস্যা হয়েছে`,`error`)}}async function hn(e,t,n,r,i){if(!await O(`খরচ সংশোধন`))return;let a=decodeURIComponent(i||``);document.getElementById(`exp-date`).value=V(t);let o=document.getElementById(`exp-category`);if(o){if(!Array.from(o.options).some(e=>e.value===n)){let e=document.createElement(`option`);e.value=n,e.text=n,o.insertBefore(e,o.lastChild)}o.value=n}document.getElementById(`exp-amount`).value=r,document.getElementById(`exp-details`).value=a,fn=e;let s=document.getElementById(`save-exp-btn`);s&&(s.innerHTML=`<i class="fa-solid fa-pen-to-square"></i> আপডেট খরচ`,s.className=`m3-btn-primary px-6 h-[42px] py-0 text-sm font-black uppercase tracking-widest w-full flex items-center justify-center gap-2 !bg-amber-600 shadow-lg`),window.scrollTo({top:0,behavior:`smooth`})}async function gn(){let e=document.getElementById(`exp-category`);if(e.value===`ADD_NEW`){let{value:t}=await W.default.fire({title:`নতুন ক্যাটাগরি`,input:`text`,showCancelButton:!0});if(t&&t.trim()){let n=document.createElement(`option`);n.value=t.trim(),n.text=t.trim(),e.insertBefore(n,e.lastChild),e.value=t.trim()}else e.selectedIndex=0}}async function _n(){let e=F(),{value:t}=await W.default.fire({title:`<i class="fa-solid fa-chart-pie text-blue-400 mr-2"></i>খরচের রিপোর্ট তৈরি করুন`,html:`
            <div class="text-left space-y-4 font-bn p-2">
                <div>
                    <label class="block text-[11px] font-black text-blue-400 uppercase tracking-widest mb-1.5 ml-1">শুরুর তারিখ</label>
                    <input id="rep-start" class="m3-field datepicker" value="${e}">
                </div>
                <div>
                    <label class="block text-[11px] font-black text-blue-400 uppercase tracking-widest mb-1.5 ml-1">শেষ তারিখ</label>
                    <input id="rep-end" class="m3-field datepicker" value="${e}">
                </div>
            </div>`,showCancelButton:!0,confirmButtonText:`রিপোর্ট তৈরি করুন`,cancelButtonText:`বাতিল`,customClass:{popup:`!bg-slate-900 !text-white !rounded-3xl border border-slate-700`,title:`!text-white`,confirmButton:`m3-btn-primary !bg-blue-600`,cancelButton:`m3-btn-tonal`},preConfirm:()=>{let e=document.getElementById(`rep-start`).value,t=document.getElementById(`rep-end`).value;return!e||!t?W.default.showValidationMessage(`উভয় তারিখ দেওয়া আবশ্যক!`):{start:z(e),end:z(t)}}});if(t){W.default.fire({title:`রিপোর্ট তৈরি হচ্ছে...`,didOpen:()=>W.default.showLoading(),allowOutsideClick:!1});try{let e=(await a.getAll(`date`,`desc`)).filter(e=>e.date>=t.start&&e.date<=t.end);if(e.length===0)return W.default.fire(`Error`,`এই সময়ের মধ্যে কোনো খরচ পাওয়া যায়নি!`,`error`);await vn(e,t.start,t.end),W.default.close()}catch(e){console.error(e),W.default.fire(`Error`,`রিপোর্ট জেনারেট ব্যর্থ হয়েছে`,`error`)}}}async function vn(e,t,n){let r=await p.getAppSettings();r.shopName,r.shopOwner,r.shopPhone,r.shopAddress;let i=`${V(t)} হতে ${V(n)}`;e.sort((e,t)=>new Date(e.date)-new Date(t.date));let a=0,o={};e.forEach(e=>{let t=Number(e.amount)||0;a+=t,o[e.category]=(o[e.category]||0)+t});let s=document.getElementById(`print-receipt-container`);s||(s=document.createElement(`div`),s.id=`print-receipt-container`,document.body.appendChild(s)),s.className=`print-a4`,s.innerHTML=`
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
            ${pe(r,{title:`EXPENSE STATEMENT`,dateRangeStr:i})}

            <div class="summary-grid">
                <!-- CATEGORY SUMMARY (Matches Column 1 style) -->
                <div class="compact-card">
                    <div class="card-title">Category-wise Summary</div>
                    <div style="display: flex; flex-wrap: wrap; gap: 4px;">
                        ${Object.keys(o).map(e=>`
                            <div class="cat-pill">${H(e)}: ৳${I(o[e])}</div>
                        `).join(``)}
                    </div>
                </div>

                <!-- FINANCIAL SUMMARY (Matches Column 2 style) -->
                <div class="compact-card" style="border-left: 0; padding: 12px 15px;">
                    <div class="card-title">Expense Summary</div>
                    <div class="sum-row total">
                        <span style="font-size:10px; font-weight:900; color:#64748b;">TOTAL EXPENSE</span>
                        <strong style="font-size:14px; color:#dc2626;">৳ ${I(a)}</strong>
                    </div>
                    <div class="sum-row count">
                        <span style="font-size:10px; font-weight:900; color:#64748b;">TOTAL ENTRIES</span>
                        <strong style="font-size:14px; color:#059669;">${e.length} টি</strong>
                    </div>
                    <div class="sum-row balance">
                        <span style="font-size:10px; font-weight:900; color:#1e40af;">NET DEBIT</span>
                        <strong style="font-size:15px; color:#1e40af;">৳ ${I(a)}</strong>
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
                            <td style="font-weight: 700;">${V(e.date)}</td>
                            <td><strong>${H(e.category)}</strong></td>
                            <td style="color: #475569;">${H(e.details||`-`)}</td>
                            <td class="text-right" style="font-weight: 900;">${I(e.amount)}</td>
                        </tr>
                    `).join(``)}
                </tbody>
                <tfoot>
                    <tr style="background: #f1f5f9; font-weight: 900;">
                        <td colspan="3" class="text-right" style="padding: 12px;">সর্বমোট খরচ:</td>
                        <td class="text-right" style="padding: 12px; font-size: 14px; color: #dc2626;">৳ ${I(a)}</td>
                    </tr>
                </tfoot>
            </table>

            <div class="footer-block">
                <p>রিপোর্ট জেনারেট: ${new Date().toLocaleString(`en-GB`)}</p>
                <div class="sig-line">কর্তৃপক্ষের স্বাক্ষর</div>
            </div>
        </div>
    `,de(s)}window.saveExpense=pn,window.deleteExpense=mn,window.editExpense=hn,window.handleCategoryChange=gn,window.loadRecentExpenses=ln,window.changeExpensePage=dn,window.generateExpenseReport=_n,window.promptSecurityPin=O;var yn=t({checkSmsLength:()=>xn,sendTestSMS:()=>Sn,unlockSmsSettings:()=>bn});async function bn(){if(window.AppState.currentUserRole!==`Admin`)return W.default.fire(`অ্যাক্সেস ডিনাইড!`,`শুধুমাত্র অ্যাডমিন সেটিংস পরিবর্তন করতে পারবেন।`,`error`);await O(`SMS সেটিংস পরিবর্তন (Settings Unlock)`)&&([`set-sms-reminder`,`set-sms-opening`,`set-sms-new-bill`,`set-sms-payment`,`set-sms-api`,`set-sms-sender`,`set-sms-auto`].forEach(e=>{let t=document.getElementById(e);t&&(t.disabled=!1,t.style.opacity=`1`)}),W.default.fire({toast:!0,position:`top-end`,icon:`success`,title:`SMS সেটিংস আনলক করা হয়েছে`,showConfirmButton:!1,timer:3e3,customClass:{popup:`!bg-slate-900 !text-white border border-slate-700`}}))}function xn(e,t){if(!e)return;let n=e.value||``,r=n.length,i=/[^\x00-\x7F]/.test(n),a=i?70:160,o=Math.ceil(r/a)||1,s=document.getElementById(t);s&&(s.innerText=`${r}/${a} (${o} SMS${i?` - বাংলা`:``})`,o>1?(s.classList.add(`text-amber-400`),s.classList.remove(`text-purple-300`)):(s.classList.remove(`text-amber-400`),s.classList.add(`text-purple-300`)))}async function Sn(){if(!document.getElementById(`set-sms-api`)?.value.trim())return W.default.fire({title:`API Key প্রয়োজন!`,text:`প্রথমে SMS Settings-এ আপনার BulkSMSBD API Key দিন এবং সেভ করুন।`,icon:`warning`,customClass:{popup:`!bg-slate-900 !text-white !rounded-3xl border border-slate-700`}});let{value:e}=await W.default.fire({title:`Send Test SMS`,input:`text`,inputLabel:`পরীক্ষামূলক মেসেজ পাঠাতে মোবাইল নম্বরটি লিখুন:`,inputPlaceholder:`018XXXXXXXX`,showCancelButton:!0,confirmButtonText:`Send Test SMS`,customClass:{popup:`!bg-slate-900 !text-white !rounded-3xl border border-slate-700`},inputValidator:e=>!e||e.trim().length<11?`সঠিক ১১-ডিজিটের মোবাইল নম্বর দিন!`:null});e&&(W.default.fire({title:`SMS পাঠানো হচ্ছে...`,allowOutsideClick:!1,didOpen:()=>W.default.showLoading()}),await x(e.trim(),`MAA ERP Test SMS: Your BulkSMSBD SMS Gateway is working perfectly! - M/S. Maa Motors`,!1)?W.default.fire({title:`সফল!`,text:`টেস্ট মেসেজ পাঠানো হয়েছে।`,icon:`success`}):W.default.fire({title:`ব্যর্থ!`,text:`API Key বা ব্যালেন্স চেক করুন।`,icon:`error`}))}window.unlockSmsSettings=bn,window.checkSmsLength=xn,window.sendTestSMS=Sn;var Cn=t({getCurrentLogo:()=>Tn,handleLogoSelect:()=>On,setCurrentLogo:()=>En,unlockShopSettings:()=>Dn}),wn=null;function Tn(){return wn}function En(e){wn=e;let t=document.getElementById(`logo-preview`);t&&e&&(t.src=e,t.classList.remove(`hidden`))}async function Dn(){if(window.AppState.currentUserRole!==`Admin`)return W.default.fire(`অ্যাক্সেস ডিনাইড!`,`শুধুমাত্র অ্যাডমিন সেটিংস পরিবর্তন করতে পারবেন।`,`error`);await O(`দোকানের তথ্য পরিবর্তন (Settings Unlock)`)&&([`set-shop-name`,`set-shop-owner`,`set-shop-phone`,`set-shop-address`,`set-shop-logo`,`set-print-size`,`set-show-watermark`].forEach(e=>{let t=document.getElementById(e);t&&(t.disabled=!1,t.style.opacity=`1`)}),W.default.fire({toast:!0,position:`top-end`,icon:`success`,title:`সেটিংস আনলক করা হয়েছে`,showConfirmButton:!1,timer:3e3,customClass:{popup:`!bg-slate-900 !text-white border border-slate-700`}}))}function On(e){let t=e.target.files[0];if(!t)return;let n=new FileReader;n.onload=function(e){let t=new Image;t.onload=function(){let e=document.createElement(`canvas`),n=1;t.width>300&&(n=300/t.width),e.width=t.width*n,e.height=t.height*n,e.getContext(`2d`).drawImage(t,0,0,e.width,e.height),En(e.toDataURL(`image/png`,.8))},t.src=e.target.result},n.readAsDataURL(t)}window.unlockShopSettings=Dn,window.handleLogoSelect=On;function kn(){let e=ue(),t=C();return`
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
    `}function An(){return`
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
                ${kn()}
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
    `}function jn(){let e=document.getElementById(`btn-unlock-policy`),t=document.getElementById(`btn-change-hard-pass`),n=document.getElementById(`policy-checkbox-container`),r=()=>{let e=document.getElementById(`btn-pause-10m`),t=document.getElementById(`btn-pause-1h`),n=document.getElementById(`btn-cancel-pause`),i=()=>{let e=document.getElementById(`pin-bypass-status-container`);e&&(e.innerHTML=kn(),r())};e&&e.addEventListener(`click`,async()=>{await le()&&(T(10),i())}),t&&t.addEventListener(`click`,async()=>{await le()&&(T(60),i())}),n&&n.addEventListener(`click`,()=>{T(0),i()})};r(),e&&e.addEventListener(`click`,async()=>{await le()&&(n&&n.classList.remove(`opacity-50`,`pointer-events-none`),e.innerHTML=`<i class="fa-solid fa-lock-open text-xs"></i> <span>আনলকড (Unlocked)</span>`,e.className=`px-4 py-2 rounded-xl bg-emerald-600 text-white text-xs font-black flex items-center gap-1.5`,R(`১৫-পয়েন্ট সিকিউরিটি পলিসি আনলক করা হয়েছে`,`success`))}),t&&t.addEventListener(`click`,async()=>{if(!await le())return;let{value:e}=await W.default.fire({title:`<div class="flex items-center justify-center gap-2 font-bn font-black text-lg text-white"><i class="fa-solid fa-key text-amber-400"></i><span>নতুন মাস্টার পাসওয়ার্ড সেট করুন</span></div>`,html:`
                    <div class="space-y-3 font-bn text-left p-1">
                        <p class="text-xs text-slate-300 mb-2">আপনার নতুন সিকিউরিটি পাসওয়ার্ডটি লিখুন (কমপক্ষে ৪ অক্ষর):</p>
                        <div class="relative w-full">
                            <input id="sw-new-pass-inp" type="password" class="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-white outline-none focus:border-amber-500 text-sm font-mono pr-10" placeholder="নতুন পাসওয়ার্ড লিখুন">
                            <button type="button" id="sw-new-pass-eye" class="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white text-sm cursor-pointer p-1">
                                <i class="fa-solid fa-eye"></i>
                            </button>
                        </div>
                    </div>
                `,focusConfirm:!1,showCancelButton:!0,confirmButtonText:`<i class="fa-solid fa-check mr-1.5"></i> সেভ পাসওয়ার্ড`,cancelButtonText:`বাতিল`,customClass:{popup:`!bg-slate-950 !text-white !rounded-3xl border border-slate-800 font-bn`,confirmButton:`m3-btn-primary !bg-amber-600 hover:!bg-amber-500 !px-6 !py-2.5 rounded-xl font-bold`,cancelButton:`m3-btn-tonal !bg-slate-800 hover:!bg-slate-700 !text-slate-300 !px-5 !py-2.5 rounded-xl font-bold`},didOpen:()=>{let e=document.getElementById(`sw-new-pass-inp`),t=document.getElementById(`sw-new-pass-eye`);e&&(e.addEventListener(`keydown`,e=>{e.key===`Enter`&&(e.preventDefault(),W.default.clickConfirm())}),t&&(t.onclick=()=>{let n=e.type===`password`;e.type=n?`text`:`password`,t.innerHTML=n?`<i class="fa-solid fa-eye-slash text-amber-400"></i>`:`<i class="fa-solid fa-eye text-slate-400"></i>`}),setTimeout(()=>e.focus(),150))},preConfirm:()=>{let e=document.getElementById(`sw-new-pass-inp`)?.value?.trim();return!e||e.length<4?(W.default.showValidationMessage(`কমপক্ষে ৪ অক্ষরের পাসওয়ার্ড দিন!`),!1):e}});e&&(await p.updateAppSettings({masterPasswordHash:e.trim()}),R(`মাস্টার পাসওয়ার্ড পরিবর্তন সফল হয়েছে`,`success`))})}async function Mn(){let e=await se();Object.keys(e).forEach(t=>{let n=document.getElementById(`pol-${t}`);n&&(n.checked=!!e[t])})}function Nn(){let e={};return document.querySelectorAll(`.pol-chk`).forEach(t=>{let n=t.id.replace(`pol-`,``);e[n]=t.checked}),e}function Pn(){return`
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
    `}async function Fn(){let e=document.getElementById(`zone-list-container`);if(e)try{let[t,n]=await Promise.all([u.getAllZones(),l.getAll()]);if(!t||t.length===0){e.innerHTML=`
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
        `}catch(t){console.error(`loadZoneList error:`,t),e.innerHTML=`<div class="text-center text-red-400 py-6 text-xs font-bn">জোন ডাটা লোড করতে ব্যর্থ হয়েছে</div>`}}async function In(){let{value:e}=await W.default.fire({title:`<div class="flex items-center justify-center gap-2 text-indigo-400 font-bn font-black"><i class="fa-solid fa-map-location-dot"></i><span>নতুন জোন যোগ করুন</span></div>`,html:`
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
            </div>`,showCancelButton:!0,confirmButtonText:`<i class="fa-solid fa-floppy-disk mr-1.5"></i>সেভ করুন`,cancelButtonText:`বাতিল`,customClass:{popup:`!bg-slate-950 !text-white !rounded-3xl border border-slate-800 font-bn`},preConfirm:()=>{let e=document.getElementById(`sw-zn-name`)?.value?.trim(),t=document.getElementById(`sw-zn-code`)?.value?.trim()?.toUpperCase();return!e||!t?W.default.showValidationMessage(`জোনের নাম ও শর্ট কোড উভয়ই আবশ্যক!`):{name:e,code:t}}});if(e)try{let t=await u.getByCode(e.code);if(t)return W.default.fire(`সতর্কতা!`,`জোন কোড "${e.code}" ইতোমধ্যে "${t.name}" জোনে ব্যবহৃত হচ্ছে!`,`warning`);await u.add({name:e.name,code:e.code}),S(`CREATE_ZONE`,`Settings`,e.name,`Code: ${e.code}`),W.default.fire(`সফল!`,`নতুন জোন "${e.name}" (কোড: ${e.code}) তৈরি হয়েছে।`,`success`),Fn(),window.loadAllZones&&window.loadAllZones()}catch(e){console.error(`showAddZoneModal error:`,e),W.default.fire(`ত্রুটি!`,`জোন সেভ করতে সমস্যা হয়েছে।`,`error`)}}async function Ln(e,t,n){let{value:r}=await W.default.fire({title:`<div class="flex items-center justify-center gap-2 text-indigo-400 font-bn font-black"><i class="fa-solid fa-pen-to-square"></i><span>জোন এডিট করুন</span></div>`,html:`
            <div class="space-y-3 text-left font-bn p-2">
                <div>
                    <label class="block text-xs font-bold text-slate-300 mb-1">জোনের নাম *</label>
                    <input id="sw-ezn-name" class="m3-field text-xs font-bold" value="${t}">
                </div>
                <div>
                    <label class="block text-xs font-bold text-slate-300 mb-1">জোন শর্ট কোড *</label>
                    <input id="sw-ezn-code" class="m3-field text-xs font-bold font-mono uppercase" value="${n}">
                </div>
            </div>`,showCancelButton:!0,confirmButtonText:`<i class="fa-solid fa-check mr-1.5"></i>আপডেট করুন`,cancelButtonText:`বাতিল`,customClass:{popup:`!bg-slate-950 !text-white !rounded-3xl border border-slate-800 font-bn`},preConfirm:()=>{let e=document.getElementById(`sw-ezn-name`)?.value?.trim(),t=document.getElementById(`sw-ezn-code`)?.value?.trim()?.toUpperCase();return!e||!t?W.default.showValidationMessage(`জোনের নাম ও কোড উভয়ই আবশ্যক!`):{name:e,code:t}}});if(r)try{let i=r.code!==n,a=!1;if(i&&(a=(await W.default.fire({title:`জোন কোড পরিবর্তন সতর্কতা!`,text:`আপনি জোন কোড "${n}" থেকে "${r.code}"-এ পরিবর্তন করছেন। আপনি কি এই জোনের সকল কাস্টমারের একাউন্ট আইডি নতুন জোন কোডে অটোমেটিক আপডেট করতে চান?`,icon:`question`,showCancelButton:!0,confirmButtonText:`হ্যাঁ, কাস্টমার একাউন্ট আপডেট করুন`,cancelButtonText:`না, শুধু জোন আপডেট করুন`,customClass:{popup:`!bg-slate-900 !text-white !rounded-3xl border border-slate-700 font-bn`}})).isConfirmed),await u.update(e,{name:r.name,code:r.code}),a){W.default.fire({title:`কাস্টমার আইডি আপডেট হচ্ছে...`,allowOutsideClick:!1,didOpen:()=>W.default.showLoading()});let e=(await l.getAll()).filter(e=>(e.zone||``).trim()===t||(e.zone||``).trim()===r.name);for(let t of e){let e=(t.accountNo||``).match(/\d+$/),n=e?e[0].slice(-4):`0001`,i=r.code+n.padStart(4,`0`);await l.update(t.id,{zone:r.name,accountNo:i})}}S(`UPDATE_ZONE`,`Settings`,e,`${r.name} (${r.code})`),W.default.fire(`সফল!`,`জোনের তথ্য আপডেট হয়েছে।`,`success`),Fn(),window.loadAllZones&&window.loadAllZones()}catch(e){console.error(`showEditZoneModal error:`,e),W.default.fire(`ত্রুটি!`,`জোন আপডেট করা সম্ভব হয়নি।`,`error`)}}async function Rn(e,t){if(await O(`জোন ডিলেট করা (Security Check)`))try{let n=(await l.getAll()).filter(e=>(e.zone||``).trim()===t);if(n.length>0)return W.default.fire({title:`ডিলেট করা যাবে না!`,text:`এই জোনে (${t}) ${n.length} জন কাস্টমার নিবন্ধিত আছেন। প্রথমে কাস্টমারদের অন্য জোনে সরান।`,icon:`warning`,customClass:{popup:`!bg-slate-900 !text-white !rounded-3xl border border-slate-700 font-bn`}});await u.delete(e),S(`DELETE_ZONE`,`Settings`,e,t),W.default.fire(`সফল!`,`জোন "${t}" সফলভাবে ডিলেট করা হয়েছে।`,`success`),Fn(),window.loadAllZones&&window.loadAllZones()}catch(e){console.error(`deleteZoneFlow error:`,e),W.default.fire(`ত্রুটি!`,`জোন ডিলেট করা সম্ভব হয়নি।`,`error`)}}window.showAddZoneModal=In,window.showEditZoneModal=Ln,window.deleteZoneFlow=Rn;function zn(e){if(window.AppState.currentUserRole!==`Admin`){e.innerHTML=`<div class="m3-card text-center font-bn py-12"><h2 class="text-xl font-black text-red-500">অ্যাক্সেস ডিনাইড!</h2></div>`;return}e.innerHTML=`
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
                ${An()}

                <!-- Zone & Regional Setup Management -->
                ${Pn()}

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
    `,Bn()}async function Bn(){try{let e=await p.getAppSettings(),t={"set-shop-name":e.shopName||`M/S. Maa Motors`,"set-shop-owner":e.shopOwner||`Mohammed Amran`,"set-shop-phone":e.shopPhone||`01819-397669, 01815-707934`,"set-shop-address":e.shopAddress||`রহমান টাওয়ার, চট্টগ্রাম।`,"set-print-size":e.printSize||`a4`,"set-sms-reminder":e.smsTemplateReminder||`Reminder: Dear [Name] [AccNo], your due is Tk [Due] on [Date]. Kindly clear payment soon. Thanks! - [Shop]`,"set-sms-opening":e.smsTemplateOpening||`Dear [Name] [AccNo], A/C opened at [Shop] on [Date]. Opening Due: Tk [Due]. Thanks!`,"set-sms-new-bill":e.smsTemplateNew||`Dear [Name] [AccNo], Memo #[Memo] of Tk [Bill] created on [Date]. Paid: Tk [Paid], Due: Tk [Due]. Thanks! - [Shop]`,"set-sms-payment":e.smsTemplatePaid||`Dear [Name] [AccNo], Received Tk [Paid] ([Type]) on [Date]. Net Due: Tk [Due]. Thanks! - [Shop]`,"set-sms-api":e.smsApiKey||``,"set-sms-sender":e.smsSenderId||``,"set-admin-pin":e.adminSecurityPin||`1060`,"set-telegram-bot-token":e.telegramBotToken||``,"set-telegram-chat-id":e.telegramChatId||``};Object.keys(t).forEach(e=>{let n=document.getElementById(e);n&&(n.value=t[e])}),e.shopLogo&&En(e.shopLogo),document.getElementById(`set-sms-auto`)&&(document.getElementById(`set-sms-auto`).checked=e.smsAuto===!0),[[`set-sms-reminder`,`sms-rem-count`],[`set-sms-opening`,`sms-open-count`],[`set-sms-new-bill`,`sms-new-count`],[`set-sms-payment`,`sms-pay-count`]].forEach(([e,t])=>{xn(document.getElementById(e),t)}),jn(),await Mn(),Fn()}catch(e){console.error(e)}}async function Vn(){let e=document.getElementById(`save-settings-btn`);if(!e)return;e.disabled=!0,e.innerHTML=`সেভ হচ্ছে...`;let t=document.getElementById(`set-sms-reminder`)?.value.trim()||``,r=document.getElementById(`set-sms-opening`)?.value.trim()||``,i=document.getElementById(`set-sms-new-bill`)?.value.trim()||``,a=document.getElementById(`set-sms-payment`)?.value.trim()||``,o=(e,t)=>{let n=/[^\x00-\x7F]/.test(e),r=n?70:155;return e.length>r?`${t} (${n?`বাংলা`:`English`}) ${r} ক্যারেক্টারের বেশি হতে পারবে না।`:null},s=o(t,`রিমাইন্ডার`)||o(r,`একাউন্ট খোলা`)||o(i,`নতুন বিল`)||o(a,`পেমেন্ট`);if(s){W.default.fire(`Error`,s,`error`),e.disabled=!1,e.innerHTML=`সকল সেটিংস সেভ করুন`;return}let c=Nn(),l={shopName:document.getElementById(`set-shop-name`)?.value.trim()||``,shopOwner:document.getElementById(`set-shop-owner`)?.value.trim()||`Mohammed Amran`,shopPhone:document.getElementById(`set-shop-phone`)?.value.trim()||``,shopAddress:document.getElementById(`set-shop-address`)?.value.trim()||``,printSize:document.getElementById(`set-print-size`)?.value||`a4`,shopLogo:Tn(),smsTemplateReminder:t,smsTemplateOpening:r,smsTemplateNew:i,smsTemplatePaid:a,smsApiKey:document.getElementById(`set-sms-api`)?.value.trim()||``,smsSenderId:document.getElementById(`set-sms-sender`)?.value.trim()||``,smsAuto:document.getElementById(`set-sms-auto`)?.checked||!1,adminSecurityPin:document.getElementById(`set-admin-pin`)?.value.trim()||`1060`,telegramBotToken:document.getElementById(`set-telegram-bot-token`)?.value.trim()||``,telegramChatId:document.getElementById(`set-telegram-chat-id`)?.value.trim()||``,securityPolicy:c,updatedAt:n.firestore.FieldValue.serverTimestamp()};try{await p.updateAppSettings(l),S(`UPDATE`,`Settings`,`appSettings`,`App Settings`,{shopName:l.shopName}),W.default.fire({title:`সফল!`,icon:`success`,customClass:{popup:`!bg-slate-900 !text-white`}}),zn(document.getElementById(`view-container`))}catch{W.default.fire(`Error`,`সেভ ব্যর্থ হয়েছে`,`error`)}finally{e.disabled=!1,e.innerHTML=`সকল সেটিংস সেভ করুন`}}async function Hn(){if(!await O(`সিকিউরিটি পিন পরিবর্তন`))return;let{value:e}=await W.default.fire({title:`নতুন মাস্টার পিন দিন`,input:`text`,inputPlaceholder:`e.g. 5678`,showCancelButton:!0,inputValidator:e=>!e||e.trim().length<4?`কমপক্ষে ৪ ডিজিট দিন!`:null});if(e)try{await p.updateAppSettings({adminSecurityPin:e.trim()}),S(`PIN_CHANGE`,`Settings`,`appSettings`,`Admin Master PIN`),document.getElementById(`set-admin-pin`).value=e.trim(),W.default.fire(`সফল!`,`পিন আপডেট করা হয়েছে।`,`success`)}catch{W.default.fire(`Error`,`ব্যর্থ হয়েছেন`,`error`)}}var Un=null;window.saveSettings=Vn,window.changeAdminSecurityPinFlow=Hn,window.togglePinVisibility=async()=>{let e=document.getElementById(`set-admin-pin`),t=document.getElementById(`pin-vis-icon`);e&&(e.type===`password`?await le()&&(e.type=`text`,t&&(t.className=`fa-solid fa-eye-slash text-amber-400`),Un&&clearTimeout(Un),Un=setTimeout(()=>{e.type=`password`,t&&(t.className=`fa-solid fa-eye text-slate-400`)},5e3)):(e.type=`password`,t&&(t.className=`fa-solid fa-eye text-slate-400`),Un&&clearTimeout(Un)))},window.appSettings={exportData:async()=>{await O(`Database Export`)&&window.downloadAdminExcelBackup&&await window.downloadAdminExcelBackup()}},window.appSettings={...Cn,...yn,exportData:window.appSettings?.exportData};function Wn(e,t,n={},r={}){if(window.AppState?.currentUserRole===`Staff`&&window.AppState?.permissions?.viewStatement===!1){e.innerHTML=`<div class="m3-card text-center font-bn py-12"><h2 class="text-xl font-bold text-red-500">অ্যাক্সেস ডিনাইড! আপনার স্টেটমেন্ট দেখার অনুমতি নেই।</h2></div>`;return}if(!t||!t.customerId){e.innerHTML=`<div class="m3-card text-center font-bn py-12"><h2 class="text-xl font-bold text-red-500">কাস্টমার সিলেক্ট করা হয়নি!</h2></div>`;return}let i=A().find(e=>e.id===t.customerId),a=Number(i?.totalDue||t.totalDue||0);n.currentCustomerInfo={id:t.customerId,name:t.customerName||i?.name||`Customer`,accountNo:t.accountNo||i?.accountNo||``,phone:t.customerPhone||i?.phone||``,address:t.customerAddress||i?.address||``,zone:i?.zone||``,totalDue:a};let o=n.currentCustomerInfo,s=(o.name||`C`).charAt(0).toUpperCase(),c=a>5e4?`<span class="px-2.5 py-0.5 rounded-full bg-red-500/20 text-red-400 border border-red-500/30 text-[10px] font-black uppercase"><i class="fa-solid fa-circle text-[8px] mr-1 animate-pulse"></i>High Due</span>`:a>0?`<span class="px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/30 text-[10px] font-black uppercase">Regular</span>`:`<span class="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-[10px] font-black uppercase">Cleared</span>`;e.innerHTML=`
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
        </div>`,r.loadStatementData&&r.loadStatementData()}async function Gn(e={}){let t=document.getElementById(`statement-list`),n=document.getElementById(`statement-list-mobile`);if(!t)return;t.innerHTML=`<tr><td colspan="5" class="text-center py-10 text-slate-500 font-bold">লোডিং...</td></tr>`,n&&(n.innerHTML=`<div class="text-center py-6 text-slate-500 font-bold">লোডিং...</div>`);let r=document.getElementById(`stmt-start-date`)?.value||``,i=document.getElementById(`stmt-end-date`)?.value||``,{currentCustomerInfo:a}=e;try{let t=0;if(a&&a.id){let e=A().find(e=>e.id===a.id);if(e!==void 0)t=Number(e.initialDue||0);else{let e=await l.getById(a.id);e&&(t=Number(e.initialDue||0))}}let n=await g.getByCustomer(a?.id);n=n.filter(e=>e.voucherNo!==`OPENING`),n.sort((e,t)=>{let n=new Date(e.date)-new Date(t.date);return n===0?(e.createdAt&&typeof e.createdAt.toMillis==`function`?e.createdAt.toMillis():0)-(t.createdAt&&typeof t.createdAt.toMillis==`function`?t.createdAt.toMillis():0):n});let o=t;if(r){let e=new Date(r);n.forEach(t=>{new Date(t.date)<e&&(o=B(o+((Number(t.bill)||0)-(Number(t.paid)||0))))}),n=n.filter(t=>new Date(t.date)>=e)}if(i){let e=new Date(i);n=n.filter(t=>new Date(t.date)<=e)}e.currentStatementData=n,e.currentOpeningBalance=o,Kn(o,e)}catch(e){console.error(`Load Statement Error:`,e)}}function Kn(e=0,t={}){let n=document.getElementById(`statement-list`),r=document.getElementById(`statement-list-mobile`);if(!n)return;let i=t.currentStatementData||[],a=e,o=0,s=0,c=0,l=``,u=``;l+=`<tr class="bg-slate-800/40 font-bold border-b-2 border-slate-700">
        <td colspan="2" class="text-blue-400 uppercase tracking-widest text-[10px] !py-3 px-4 font-black"><i class="fa-solid fa-flag-checkered mr-2"></i>প্রারম্ভিক ব্যালেন্স (Opening Balance)</td>
        <td class="text-right">-</td><td class="text-right">-</td>
        <td class="text-right font-black ${e>0?`text-red-400`:`text-emerald-400`} bg-white/5 !py-3 px-4">৳ ${I(Math.abs(e))} ${e<0?`(অ্যাড)`:``}</td>
    </tr>`,u+=`<div class="p-3 bg-slate-900 border border-slate-800 rounded-xl flex justify-between items-center text-xs"><span class="text-blue-400 font-bold">প্রারম্ভিক ব্যালেন্স:</span><span class="font-black ${e>0?`text-red-400`:`text-emerald-400`}">৳ ${I(Math.abs(e))}</span></div>`,i.forEach(e=>{let t=Number(e.bill)||0,n=Number(e.paid)||0,r=e.receivedType||``;o=B(o+t),r===`Less`?c=B(c+n):s=B(s+n),a=B(a+(t-n));let i=`<span class="text-slate-500 text-xs">-</span>`;n>0&&(i=r===`Less`?`<span class="bg-amber-500/10 text-amber-400 px-2 py-0.5 rounded text-[10px] font-black border border-amber-500/20"><i class="fa-solid fa-hand-holding-heart mr-1"></i>LESS</span>`:`<span class="${r===`Bank`?`text-blue-400`:`text-emerald-400`} text-[10px] font-bold uppercase"><i class="fa-solid ${r===`Bank`?`fa-building-columns`:`fa-money-bill`} mr-1"></i>${r}</span>`);let d=e.voucherNo&&e.voucherNo!==`OPENING`?`<span class="px-1.5 py-0.5 bg-slate-950 rounded text-[9px] text-slate-400 border border-slate-800 font-mono">#${e.voucherNo}</span>`:``,f=e.receivedFrom?`<div class="text-[9px] text-slate-500 mt-0.5">${e.receivedFrom}</div>`:``;l+=`<tr class="hover:bg-white/[0.02] border-b border-slate-800/50">
            <td class="text-slate-400 text-[11px] !py-3 px-4 font-mono font-bold">${V(e.date)}</td>
            <td class="!py-3 px-4"><div class="flex items-center gap-2">${i}${d}</div>${f}</td>
            <td class="text-right text-red-400 font-bold !py-3 px-4">${t>0?`৳`+I(t):`-`}</td>
            <td class="text-right text-emerald-400 font-bold !py-3 px-4">${n>0?`৳`+I(n):`-`}</td>
            <td class="text-right font-black ${a>0?`text-red-400`:`text-emerald-400`} bg-white/[0.01] !py-3 px-4">৳ ${I(Math.abs(a))} ${a<0?`<span class="text-[9px]">(Adv)</span>`:``}</td>
        </tr>`,u+=`<div class="p-3 bg-slate-900/90 border border-slate-800 rounded-xl flex flex-col gap-1.5 text-xs">
            <div class="flex justify-between items-center border-b border-slate-800/60 pb-1"><span class="text-slate-400 font-mono text-[10px]">${V(e.date)} ${d}</span>${i}</div>
            <div class="flex justify-between items-center text-slate-300"><span>খরচ: <strong class="text-red-400">৳${I(t)}</strong></span><span>জমা: <strong class="text-emerald-400">৳${I(n)}</strong></span></div>
            <div class="flex justify-between items-center pt-1 border-t border-slate-800/40"><span class="text-[10px] text-slate-400 font-bold">জের/ব্যালেন্স:</span><span class="font-black ${a>0?`text-red-400`:`text-emerald-400`}">৳ ${I(Math.abs(a))}</span></div>
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
            </div>`),n.innerHTML=l,r&&(r.innerHTML=u);let d=document.getElementById(`stmt-count-badge`);d&&(d.innerText=`${i.length} টি লেনদেন`),document.getElementById(`stmt-total-bill`).innerText=`৳ ${I(o)}`,document.getElementById(`stmt-total-paid`).innerText=`৳ ${I(s)}`,document.getElementById(`stmt-total-less`).innerText=`৳ ${I(c)}`,document.getElementById(`stmt-total-due`).innerText=`৳ ${I(Math.abs(a))} ${a<0?`(অ্যাডভান্স)`:``}`,t.currentFinalBalance=a}function qn(e,t={}){let n=document.getElementById(`stmt-start-date`),r=document.getElementById(`stmt-end-date`);if(!n||!r)return;let i=new Date;if(e===`today`){let e=F();n.value=e,r.value=e}else if(e===`this_month`)n.value=`${i.getFullYear()}-${String(i.getMonth()+1).padStart(2,`0`)}-01`,r.value=F();else if(e===`last_month`){let e=new Date(i.getFullYear(),i.getMonth()-1,1),t=e.getFullYear(),a=String(e.getMonth()+1).padStart(2,`0`),o=new Date(i.getFullYear(),i.getMonth(),0).getDate();n.value=`${t}-${a}-01`,r.value=`${t}-${a}-${String(o).padStart(2,`0`)}`}t.loadStatementData&&t.loadStatementData()}async function Jn(e={},t={}){let{currentCustomerInfo:r}=e,{value:i}=await W.default.fire({title:`<i class="fa-solid fa-credit-card text-blue-400 mr-2"></i>জমা গ্রহণ করুন`,html:`
            <div class="flex flex-col gap-3 text-left font-bn p-2">
                <div class="text-xs text-blue-400 font-bold">কাস্টমার: ${r?.name||`Customer`}</div>
                <div>
                    <label class="block text-xs font-bold text-slate-400 mb-1">জমার পরিমাণ (৳)</label>
                    <input id="stmt-recv-amt" type="text" class="m3-field text-lg font-black text-emerald-400" placeholder="০.০০" oninput="window.handleNumberInput(this); window.updateLiveWords(this, 'stmt-recv-words');">
                    <div id="stmt-recv-words" class="text-[10px] font-black text-emerald-400 mt-1 hidden italic truncate"></div>
                </div>
                <div><label class="block text-xs font-bold text-slate-400 mb-1">পেমেন্ট মাধ্যম</label><select id="stmt-recv-type" class="m3-field"><option value="Cash">Cash (নগদ)</option><option value="Bank">Bank (ব্যাংক/বিকাশ)</option><option value="Less">Less (ছাড়/কমিশন)</option></select></div>
                <div><label class="block text-xs font-bold text-slate-400 mb-1">বিবরণ / ব্যাংক নাম (ঐচ্ছিক)</label><input id="stmt-recv-ref" type="text" class="m3-field" placeholder="মন্তব্য..."></div>
            </div>`,showCancelButton:!0,confirmButtonText:`<i class="fa-solid fa-circle-check mr-2"></i>জমা সেভ করুন`,cancelButtonText:`বাতিল`,customClass:{popup:`!bg-slate-950 !text-white !rounded-3xl border border-slate-800 shadow-2xl font-bn`,confirmButton:`m3-btn-primary !bg-emerald-600 hover:!bg-emerald-500 !px-6 !py-2 rounded-xl font-bold`,cancelButton:`m3-btn-tonal !bg-slate-800 !text-slate-300 !px-5 !py-2 rounded-xl font-bold border border-slate-700`},preConfirm:()=>{let e=L(document.getElementById(`stmt-recv-amt`).value);return!e||e<=0?W.default.showValidationMessage(`সঠিক জমার পরিমাণ লিখুন!`):{amount:e,type:document.getElementById(`stmt-recv-type`).value,ref:document.getElementById(`stmt-recv-ref`).value.trim()}}});if(i)try{let e=c.batch(),a=g.getRef(),o=A().find(e=>e.id===r.id),s=B(Number(o?.totalDue||0)),u=B(s-i.amount);e.set(a,{customerId:r.id,customerName:r.name,date:F(),voucherNo:``,bill:0,paid:i.amount,receivedType:i.type,receivedFrom:i.ref,prevDue:s,currentDue:u,createdBy:window.AppState?.currentUserEmail||`Unknown`,createdAt:n.firestore.FieldValue.serverTimestamp()}),e.update(l.getRef(r.id),{totalDue:n.firestore.FieldValue.increment(-i.amount)}),await e.commit(),R(`জমা সফলভাবে সেভ হয়েছে!`,`success`),t.loadStatementData&&t.loadStatementData()}catch(e){console.error(`Quick collect payment error:`,e),W.default.fire(`Error`,`জমা সেভ করা যায়নি`,`error`)}}async function Yn(e={}){let{currentCustomerInfo:t,currentFinalBalance:n}=e,r=t?.phone;if(!r)return W.default.fire(`Error`,`No phone number found for this customer.`,`warning`);let i=n,a=i<0?`advance`:`pending due`,o=I(Math.abs(i)),s=`Dear ${t.name||`Customer`}, Your total ${a} at M/S. Maa Motors is Tk ${o}. Kindly clear payment. Contact: 01819-397669. Thank you! - M/S. Maa Motors`,{value:c}=await W.default.fire({title:`<i class="fa-solid fa-comment-sms text-blue-400 mr-2"></i>Send Reminder SMS`,input:`textarea`,inputValue:s,inputAttributes:{rows:5,class:`m3-field text-xs font-mono`},showCancelButton:!0,confirmButtonText:`<i class="fa-solid fa-paper-plane mr-1.5"></i> Send SMS`,cancelButtonText:`Cancel`,customClass:{popup:`!bg-slate-900 !text-white !rounded-3xl border border-slate-700`}});c&&await window.sendSMS(r,c,!1)&&R(`SMS পাঠানোর চেষ্টা করা হয়েছে!`,`info`)}async function Xn(e={}){let{currentCustomerInfo:t,currentFinalBalance:n}=e,r=t?.phone;if(!r)return W.default.fire({title:`এরর`,text:`কাস্টমারের মোবাইল নম্বর পাওয়া যায়নি!`,icon:`warning`,customClass:{popup:`!bg-slate-900 !text-white !rounded-3xl border border-slate-700`}});let i=n,a=I(Math.abs(i)),o=document.getElementById(`stmt-total-bill`)?.innerText||`৳ 0`,s=document.getElementById(`stmt-total-paid`)?.innerText||`৳ 0`,c=document.getElementById(`stmt-total-less`)?.innerText||`৳ 0`,l=t.accountNo?`#${t.accountNo}`:`-`,u=`${window.location.origin}${window.location.pathname}?view=public-stmt&id=${t.id}`,d=`আসসালামু আলাইকুম ${t.name||`কাস্টমার`},\nমেসার্স মা মোটরস্ থেকে আপনার মোট হিসাবের সামারি:\n\nহিসাব নং: ${l}\nমোট কেনাকাটা/বিল: ${o}\nমোট জমা: ${s}\nমোট ছাড়: ${c}\n---------------------------------\n`;d+=i<0?`অ্যাডভান্স জমা: ৳ ${a}\n\n`:`বর্তমান মোট বকেয়া: ৳ ${a}\n\n*বিশেষ অনুরোধ: আপনার বকেয়া টাকাটি দ্রুত পরিশোধ করার অনুরোধ রইল।*\n\n`,d+=`আপনার সম্পূর্ণ মেমো ও হিসাবের PDF বিবরণী দেখতে নিচের লিংকে ক্লিক করুন:\n${u}\n\nযোগাযোগ: 01819-397669\nধন্যবাদ! — মেসার্স মা মোটরস্`;let{value:f}=await W.default.fire({title:`<div class="flex items-center justify-center gap-2 font-bn font-black text-lg text-emerald-400"><i class="fa-brands fa-whatsapp text-xl"></i><span>Send WhatsApp Reminder</span></div>`,html:`<div class="text-left space-y-1 mb-2 font-bn"><div class="text-xs text-slate-400">Recipient Phone: <strong class="text-white">${r}</strong></div></div>`,input:`textarea`,inputValue:d,inputAttributes:{rows:8,class:`m3-field text-xs font-bn`},showCancelButton:!0,confirmButtonText:`<i class="fa-brands fa-whatsapp mr-1.5"></i> Open WhatsApp`,cancelButtonText:`Cancel`,customClass:{popup:`!bg-slate-950 !text-white !rounded-3xl border border-slate-800 shadow-2xl font-bn`,confirmButton:`m3-btn-primary !bg-emerald-600 hover:!bg-emerald-500 !px-6 !py-2 rounded-xl font-bold`}});f&&window.sendWhatsApp&&window.sendWhatsApp(r,f)}var Zn=[],Qn=0,$n={},er=0,tr={get currentStatementData(){return Zn},set currentStatementData(e){Zn=e},get currentOpeningBalance(){return Qn},set currentOpeningBalance(e){Qn=e},get currentCustomerInfo(){return $n},set currentCustomerInfo(e){$n=e},get currentFinalBalance(){return er},set currentFinalBalance(e){er=e}};function nr(e,t){Wn(e,t,tr,{loadStatementData:rr})}async function rr(){return Gn(tr)}function ir(e){return qn(e,{loadStatementData:rr})}async function ar(){return Jn(tr,{loadStatementData:rr})}async function or(){return Yn(tr)}async function sr(){return Xn(tr)}function cr(){let e=document.getElementById(`stmt-start-date`),t=document.getElementById(`stmt-end-date`);e&&(e.value=``),t&&(t.value=``),rr()}function lr(){document.getElementById(`stmt-filter-grid`)?.classList.toggle(`hidden`)}async function ur(){let e=document.getElementById(`stmt-custom-note`)?.value||``,{printStatement:t}=await b(async()=>{let{printStatement:e}=await import(`./statement-print-COMjHxy5.js`);return{printStatement:e}},__vite__mapDeps([9,1,2,3,4,5,10,6,7,8,11]));return await t($n,Qn,Zn,e)}typeof window<`u`&&(window.clearStatementFilter=cr,window.toggleStmtFilterCollapse=lr,window.setStmtPresetDate=ir,window.quickCollectPaymentFromStmt=ar,window.sendStmtReminderSMS=or,window.sendStmtReminderWhatsApp=sr,window.loadStatementData=rr,window.printStatement=ur);async function dr(e,t=!1){try{let r=e.filter(e=>e&&e.name&&e.name.trim()!==``).map(e=>({date:e.date||new Date().toISOString().split(`T`)[0],name:e.name.trim(),phone:e.phone?String(e.phone).trim():``,voucher:e.voucher?String(e.voucher).trim():``,bill:L(e.bill)||0,paid:L(e.paid)||0,receivedType:e.receivedType||`Bank`,receivedFrom:e.receivedFrom||``})).filter(e=>e.bill>0||e.paid>0);if(r.length===0)return W.default.fire({title:`ভ্যালিড ডাটা নেই!`,icon:`warning`,customClass:{popup:`!bg-slate-900 !text-white`}});let i=0,a=0,o=r.map(e=>(i+=e.bill,a+=e.paid,`
                <div class="p-2.5 bg-slate-950/50 border border-slate-800/80 rounded-xl text-left">
                    <div class="flex justify-between items-center mb-1">
                        <span class="text-sm font-black text-white">${e.name}</span>
                        <span class="text-[10px] font-bold text-amber-400 bg-amber-400/10 px-1.5 py-0.5 rounded border border-amber-400/20">ভাউচার: ${e.voucher||`-`}</span>
                    </div>
                    <div class="flex justify-between items-center text-xs">
                        <span class="text-slate-400 font-bold">${V(e.date)}</span>
                        <div class="flex gap-4">
                            <span class="text-blue-400 font-mono font-bold">বিল: ৳ ${I(e.bill)}</span>
                            <span class="text-emerald-400 font-mono font-bold">জমা: ৳ ${I(e.paid)} ${e.paid>0?`<span class="text-purple-400 font-bn tracking-wider ml-1 px-1.5 py-0.5 bg-purple-500/10 rounded-md border border-purple-500/20 text-[10px] uppercase">${e.receivedType}${e.receivedFrom?` - `+e.receivedFrom:``}</span>`:``}</span>
                        </div>
                    </div>
                </div>
            `)).join(``);if(!(await W.default.fire({title:`<div class="flex items-center justify-center gap-2 font-bn font-black text-xl text-white"><i class="fa-solid fa-file-shield text-blue-400"></i><span>ফাস্ট এন্ট্রি যাচাই করুন</span></div>`,html:`
                <div class="text-left space-y-3 font-bn p-3.5 bg-slate-900/90 rounded-2xl border border-slate-800 shadow-inner">
                    <div class="grid grid-cols-3 gap-4 border-b border-slate-800/80 pb-3">
                        <div class="flex flex-col gap-1 text-center bg-slate-950 p-2 rounded-xl border border-slate-800"><span class="text-[10px] text-slate-400 font-black uppercase tracking-wider">মোট এন্ট্রি</span><span class="text-lg text-white font-black">${r.length}</span></div>
                        <div class="flex flex-col gap-1 text-center bg-blue-950/30 p-2 rounded-xl border border-blue-900/30"><span class="text-[10px] text-blue-400 font-black uppercase tracking-wider">মোট বিল</span><span class="text-lg text-blue-400 font-black font-mono">৳ ${I(i)}</span></div>
                        <div class="flex flex-col gap-1 text-center bg-emerald-950/30 p-2 rounded-xl border border-emerald-900/30"><span class="text-[10px] text-emerald-400 font-black uppercase tracking-wider">মোট জমা</span><span class="text-lg text-emerald-400 font-black font-mono">৳ ${I(a)}</span></div>
                    </div>
                    <div class="max-h-[350px] overflow-y-auto custom-scrollbar pr-2 mt-3 space-y-2">
                        ${o}
                    </div>
                </div>
                <p class="text-xs text-amber-400 font-bold mt-3 text-center">সব তথ্য সঠিক থাকলে "কনফার্ম ও সেভ করুন" বাটনে ক্লিক করুন।</p>
            `,showCancelButton:!0,confirmButtonText:`<i class="fa-solid fa-cloud-arrow-up mr-2"></i>কনফার্ম ও সেভ করুন`,cancelButtonText:`<i class="fa-solid fa-pen-to-square mr-2"></i>সংশোধন করব`,width:`700px`,customClass:{popup:`!bg-slate-950 !text-white !rounded-3xl border border-slate-800 shadow-2xl font-bn`,confirmButton:`m3-btn-primary !bg-blue-600 hover:!bg-blue-500 !px-7 !py-2.5 !rounded-xl font-bold shadow-lg shadow-blue-600/30`,cancelButton:`m3-btn-tonal !bg-slate-800 hover:!bg-slate-700 !text-slate-300 !px-5 !py-2.5 !rounded-xl font-bold border border-slate-700`}})).isConfirmed)return;W.default.fire({title:`সেভ হচ্ছে...`,text:`${r.length} টি এন্ট্রি প্রসেস করা হচ্ছে।`,allowOutsideClick:!1,didOpen:()=>{W.default.showLoading()},customClass:{popup:`!bg-slate-900 !text-white !rounded-3xl border border-slate-700 font-bn`}});let s=A();s.length||(s=await l.getAll());let u={},d={};s.forEach(e=>{e.name&&(u[e.name.trim().toLowerCase()]={id:e.id,totalDue:Number(e.totalDue)||0,accountNo:e.accountNo||``,isNew:!1}),e.accountNo&&(d[String(e.accountNo).toLowerCase()]={id:e.id,totalDue:Number(e.totalDue)||0,accountNo:e.accountNo||``,isNew:!1})});let f=0,m={...u};r.forEach(e=>{let t=e.name.trim().toLowerCase(),n=e.name.match(/^\[(\d+)\]/),r=n?n[1].toLowerCase():null,i=e.name.replace(/^\[\d+\]\s*/,``).replace(/\s*\(.*\)$/,``).trim().toLowerCase();r&&d[r]||m[i]||m[t]||(m[t]=!0,f++)});let h=p.collection.doc(`counters`),_=0;f>0&&await c.runTransaction(async e=>{let t=await e.get(h),n=t.exists&&t.data().customerAccountNo?parseInt(t.data().customerAccountNo):0;_=n,e.set(h,{customerAccountNo:n+f},{merge:!0})});let v=c.batch(),y=0;for(let e of r){let t=e.name.trim().toLowerCase(),r=``,i=t,a=e.name.match(/^\[(\d+)\]/);if(a){let e=a[1].toLowerCase();d[e]&&(r=d[e].id,i=Object.keys(u).find(e=>u[e].id===r)||t)}if(!r){let n=e.name.replace(/^\[\d+\]\s*/,``).replace(/\s*\(.*\)$/,``).trim().toLowerCase();if(u[n])r=u[n].id,i=n;else if(u[t])r=u[t].id;else{r=l.getRef().id,_++;let n=String(_).padStart(4,`0`);u[t]={id:r,totalDue:0,accountNo:n,isNew:!0,phone:e.phone||``,name:e.name.replace(/^\[\d+\]\s*/,``).replace(/\s*\(.*\)$/,``).trim()},i=t}}let o=u[i]?.totalDue||0,s=e.bill-e.paid,f=o+s;u[i]&&(u[i].totalDue=f);let p=u[i]?.name||e.name.replace(/^\[\d+\]\s*/,``).replace(/\s*\(.*\)$/,``).trim(),m=g.getRef();v.set(m,{customerId:r,customerName:p,date:e.date,voucherNo:e.voucher,bill:e.bill,paid:e.paid,receivedType:e.paid>0?e.receivedType||`Bank`:``,receivedFrom:e.paid>0&&e.receivedFrom||``,prevDue:o,currentDue:f,createdBy:window.AppState?.currentUserEmail||`Unknown`,createdAt:n.firestore.FieldValue.serverTimestamp()}),y++;let h=l.getRef(r);u[i]?.isNew?(v.set(h,{name:p,phone:u[i].phone||``,address:`Bulk Import`,accountNo:u[i].accountNo,totalDue:f,initialDue:0,createdAt:n.firestore.FieldValue.serverTimestamp()}),S(`CREATE`,`Customers`,r,p,{source:`Bulk Entry`}),u[i].isNew=!1,y++):(v.update(h,{totalDue:n.firestore.FieldValue.increment(s)}),y++),y>=400&&(await v.commit(),v=c.batch(),y=0)}if(y>0&&await v.commit(),W.default.fire({title:`সফল!`,text:`সফলভাবে ${r.length} টি ডাটা সেভ হয়েছে!`,icon:`success`}),t){let e=document.getElementById(`excel-file`);e&&(e.value=``);let t=document.getElementById(`process-excel-btn`);t&&(t.disabled=!1,t.innerHTML=`<i class="fa-solid fa-upload"></i> ফাইল আপলোড ও সেভ করুন`)}else typeof window.switchBulkTab==`function`&&window.switchBulkTab(`spreadsheet`)}catch(e){console.error(`Bulk save error:`,e),W.default.fire(`Error!`,`ডাটা সেভ করতে সমস্যা হয়েছে। দয়া করে আবার চেষ্টা করুন।`,`error`)}finally{if(t){let e=document.getElementById(`process-excel-btn`);e&&(e.disabled=!1,e.innerHTML=`<i class="fa-solid fa-upload"></i> ফাইল আপলোড ও সেভ করুন`)}}}function fr(){let e=document.getElementById(`spreadsheet-body`);if(!e)return;let t=document.createElement(`tr`),n=localStorage.getItem(`workingDate`);(!n||!/^\d{4}-\d{2}-\d{2}$/.test(n))&&(n=window.getTodayLocalDateString?window.getTodayLocalDateString():new Date().toISOString().split(`T`)[0]);let r=e.children.length+1;t.innerHTML=`
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
    `,e.appendChild(t),e.children.length>1&&t.children[1].querySelector(`input`)?.focus()}function pr(e,t){if(e.key===`Enter`||e.key===`Tab`){e.preventDefault();let n=t.closest(`tr`)?.querySelector(`input.datepicker`)?.value;n&&localStorage.setItem(`workingDate`,n),fr()}}function mr(e,t){let n=e.value,r=document.getElementById(`bank-cell-${t}`);r&&(n===`Cash`?(e.classList.replace(`text-blue-400`,`text-emerald-400`),e.classList.replace(`text-purple-400`,`text-emerald-400`),r.innerHTML=`<select class="grid-input m3-field !bg-slate-900/50 !py-1.5 !px-2 text-xs font-bold cursor-pointer text-slate-300" onkeydown="window.handleGridKey(event, this)">
            ${window.cachedCashHtml||`<option value="Cash" class="!bg-slate-900 !text-slate-200">Cash</option>`}
        </select>`):n===`Less`?(e.classList.replace(`text-blue-400`,`text-purple-400`),e.classList.replace(`text-emerald-400`,`text-purple-400`),r.innerHTML=`<input type="text" class="grid-input m3-field !bg-slate-900/50 !py-1.5 !px-2 text-xs font-bold text-slate-300" placeholder="যেমন: সম্মানিতে ছাড়..." onkeydown="window.handleGridKey(event, this)">`):(e.classList.replace(`text-emerald-400`,`text-blue-400`),e.classList.replace(`text-purple-400`,`text-blue-400`),r.innerHTML=`<select class="grid-input m3-field !bg-slate-900/50 !py-1.5 !px-2 text-xs font-bold cursor-pointer text-slate-300" onkeydown="window.handleGridKey(event, this)">
            ${window.cachedBanksHtml||`<option value="OneBank (IFRAT)" class="!bg-slate-900 !text-slate-200">OneBank (IFRAT)</option>`}
        </select>`))}window.updateGridBankOptions=mr;async function hr(){let e=document.getElementById(`spreadsheet-body`).querySelectorAll(`tr`),t=[];if(e.forEach(e=>{let n=e.querySelectorAll(`input, select`),r=n[0].value,i=n[1].value.trim(),a=i,o=``;if(i.startsWith(`[`)){let e=i.match(/^\[.*?\]\s*([^(]+)/);e&&(a=e[1].trim());let t=i.match(/\(([^)]+)\)/);t&&(o=t[1].trim())}let s=n[2].value.trim(),c=L(n[3].value),l=L(n[4].value),u=n[5].value||`Bank`,d=n[6].value.trim();a&&(c>0||l>0)&&t.push({date:r,name:a,phone:o,voucher:s,bill:c,paid:l,receivedType:u,receivedFrom:d})}),t.length===0){W.default.fire(`খালি ফর্ম`,`সেভ করার মতো কোনো ডাটা পাওয়া যায়নি।`,`warning`);return}let n=document.getElementById(`save-spreadsheet-btn`);n&&(n.disabled=!0,n.innerHTML=`<i class="fa-solid fa-spinner fa-spin mr-2"></i>সেভ হচ্ছে...`);try{await dr(t)}catch(e){console.error(`saveSpreadsheetData error:`,e)}finally{n&&(n.disabled=!1,n.innerHTML=`<i class="fa-solid fa-cloud-arrow-up mr-2"></i> সব সেভ করুন`)}}async function gr(){if(window.AppState?.currentUserRole!==`Admin`)return W.default.fire(`অ্যাক্সেস ডিনাইড!`,`শুধুমাত্র অ্যাডমিন এক্সেল ডাটা ব্যাকআপ করতে পারবেন।`,`error`);if(await O(`এক্সেল ডাটা ব্যাকআপ ও টেমপ্লেট ডাউনলোড`))try{W.default.fire({title:`স্মার্ট এক্সেল জেনারেট হচ্ছে...`,text:`ডাটা প্রসেস করা হচ্ছে, অনুগ্রহ করে অপেক্ষা করুন`,allowOutsideClick:!1,didOpen:()=>W.default.showLoading(),customClass:{popup:`!bg-slate-900 !text-white !rounded-3xl border border-slate-700`}}),w();let e=A(),t=await g.getAll();t.sort((e,t)=>{let n=new Date(e.date||0),r=new Date(t.date||0);return n-r===0?(e.createdAt?.toMillis()||0)-(t.createdAt?.toMillis()||0):n-r});let[n,r,i]=F().split(`-`),a=`${i}/${r}/${n}`,o=[[`মা মোটরস ইআরপি — কাস্টমার হিসেব ও বর্তমান মোট জের`,``,``,``,`তারিখ: ${a}`],[`অ্যাকাউন্ট নং`,`কাস্টমারের নাম`,`মোবাইল নম্বর`,`ঠিকানা`,`বর্তমান মোট বকেয়া (৳)`]];e.forEach(e=>o.push([e.accountNo||``,e.name||``,e.phone||``,e.address||``,Number(e.totalDue)||0]));let s=o.length;o.push([`মোট হিসাব`,`মোট কাস্টমার: ${e.length} জন`,``,`মার্কেটে মোট বকেয়া (৳):`,{f:`SUM(E3:E${s})`}]);let c=be.aoa_to_sheet(o),l=[[`মা মোটরস ইআরপি — সকল লেনদেন ও রশিদ বই এন্ট্রি শিট`,``,``,``,``,``,``,``,`ডাউনলোড: ${a}`],[`তারিখ (DD/MM/YYYY)`,`কাস্টমারের নাম / আইডি`,`মোবাইল`,`ভাউচার নং`,`বিল (Debit)`,`জমা (Credit)`,`ব্যালেন্স`,`মাধ্যম (Bank/Cash)`,`ব্যাংক/বিবরণ`]];t.forEach((t,n)=>{let r=n+3,i=t.date;if(t.date&&/^\d{4}-\d{2}-\d{2}$/.test(t.date)){let[e,n,r]=t.date.split(`-`);i=`${r}/${n}/${e}`}let a=e.find(e=>e.id===t.customerId),o=a?`[${a.accountNo}] ${a.name}`:t.customerName;l.push([i,o,a?.phone||``,t.voucherNo||``,Number(t.bill)||0,Number(t.paid)||0,{f:`E${r}-F${r}`},t.receivedType||(t.paid>0?`Bank`:``),t.receivedFrom||``])});let u=l.length+1;for(let e=0;e<30;e++){let t=u+e;l.push([``,``,``,``,``,``,{f:`IF(AND(E${t}="",F${t}=""),"",E${t}-F${t})`},`Bank`,``])}let d=l.length+1;l.push([`সর্বমোট হিসাব`,``,``,`মোট লেনদেন: ${t.length}`,{f:`SUM(E3:E${d-1})`},{f:`SUM(F3:F${d-1})`},{f:`E${d}-F${d}`},``,``]);let f=be.aoa_to_sheet(l),p=Math.max(s,3);f[`!dataValidation`]=[{sqref:`H3:H${d-1}`,type:`list`,operator:`equal`,formula1:`"Bank,Cash"`,showErrorMessage:!0},{sqref:`B3:B${d-1}`,type:`list`,operator:`equal`,formula1:`'কাস্টমার তালিকা ও বর্তমান জের'!$B$3:$B$${p}`}],c[`!cols`]=[{wch:15},{wch:25},{wch:18},{wch:30},{wch:24}],f[`!cols`]=[{wch:18},{wch:32},{wch:16},{wch:14},{wch:18},{wch:18},{wch:20},{wch:20},{wch:35}];let m=be.book_new();be.book_append_sheet(m,c,`কাস্টমার তালিকা ও বর্তমান জের`),be.book_append_sheet(m,f,`খতিয়ান ও নতুন লেনদেন এন্ট্রি`);let h=`Maa_Motors_Smart_Backup_${i}-${r}-${n}.xlsx`;xe(m,h),W.default.fire({title:`সফল!`,text:`ব্যাকআপ ফাইলটি ডাউনলোড হয়েছে।`,icon:`success`})}catch(e){console.error(e),W.default.fire(`এরর!`,`এক্সেল তৈরি করতে সমস্যা হয়েছে।`,`error`)}}async function _r(e,t){W.default.fire({title:`ডাটা সেভ হচ্ছে...`,text:`কাস্টমার ও খতিয়ান ডাটাবেসে আপডেট করা হচ্ছে`,allowOutsideClick:!1,didOpen:()=>W.default.showLoading(),customClass:{popup:`!bg-slate-900 !text-white !rounded-3xl border border-slate-700`}});try{let r=await u.getAllZones(),i={};r.forEach(e=>i[e.name]=e);let a={};if(t.size>0){let e=Array.from(t);await c.runTransaction(async t=>{let r=await t.get(p.collection.doc(`counters`)),o=r.exists&&r.data().zoneCounters?r.data().zoneCounters:{};for(let r of e){let e=`General`;if(!i[e]){let r=u.getRef();t.set(r,{name:e,code:`10`,createdAt:n.firestore.FieldValue.serverTimestamp()}),i[e]={name:e,code:`10`}}let s=i[e],c=(o[e]||0)+1;o[e]=c;let d=s.code+String(c).padStart(4,`0`),f=l.getRef();t.set(f,{name:r,phone:``,address:``,zone:e,accountNo:d,totalDue:0,createdAt:n.firestore.FieldValue.serverTimestamp()}),a[r]={id:f.id,accountNo:d}}t.set(p.collection.doc(`counters`),{zoneCounters:o},{merge:!0})})}let o={};for(let t of e){let e=t.matchedCustId||a[t.customerName]?.id;e&&(o[e]||(o[e]=[]),o[e].push(t))}let s=Object.keys(o),d=c.batch(),f=0;for(let e of s){let t=l.getRef(e),r=await t.get(),i=r.exists&&r.data().totalDue||0,a=o[e];for(let t of a){let r=i;i=r+t.bill-t.paid;let a=g.getRef();d.set(a,{customerId:e,customerName:t.customerName,date:t.date,voucherNo:t.voucher,bill:t.bill,paid:t.paid,receivedType:t.receivedType,receivedFrom:t.receivedFrom,prevDue:r,currentDue:i,createdBy:n.auth().currentUser?.email||`Admin Excel Import`,createdAt:n.firestore.FieldValue.serverTimestamp()}),f++,f>=490&&(await d.commit(),d=c.batch(),f=0)}let s=r.exists&&r.data().totalDue||0,u=i-s;d.update(t,{totalDue:n.firestore.FieldValue.increment(u)}),f++,f>=490&&(await d.commit(),d=c.batch(),f=0)}return f>0&&await d.commit(),!0}catch(e){throw console.error(`Sync Engine Error:`,e),e}}async function vr(e){if(window.AppState?.currentUserRole!==`Admin`)return W.default.fire(`অ্যাক্সেস ডিনাইড!`,`শুধুমাত্র অ্যাডমিন এক্সেল ফাইল আপলোড করতে পারবেন।`,`error`);let t=e?.files?.[0];if(t){if(!await O(`এক্সেল ডাটা ইমপোর্ট`)){e.value=``;return}try{W.default.fire({title:`এক্সেল রিড করা হচ্ছে...`,allowOutsideClick:!1,didOpen:()=>W.default.showLoading(),customClass:{popup:`!bg-slate-900 !text-white`}});let n=await t.arrayBuffer(),r=Se(n,{type:`array`}),i=r.SheetNames.find(e=>e.includes(`এন্ট্রি`)||e.includes(`Template`))||r.SheetNames[0],a=be.sheet_to_json(r.Sheets[i],{defval:``});if(!a.length)return e.value=``,W.default.fire(`খালি ফাইল`,`কোনো ডাটা পাওয়া যায়নি।`,`warning`);w();let o=A(),s=[],c=new Set,l=0,u=0,d=0;a.forEach(e=>{let t=Object.keys(e),n=e=>t.find(t=>e.some(e=>t.toLowerCase().includes(e))),r=String(e[n([`তারিখ`,`date`])]||``).trim(),i=String(e[n([`কাস্টমার`,`name`])]||``).trim(),a=String(e[n([`মোবাইল`,`phone`])]||``).trim(),f=String(e[n([`ভাউচার`,`voucher`])]||``).trim(),p=L(e[n([`বিল`,`debit`,`bill`])]),m=L(e[n([`জমা`,`credit`,`paid`])]),h=String(e[n([`মাধ্যম`,`type`])]||`Bank`).trim(),g=String(e[n([`ব্যাংক`,`বিবরণ`,`details`])]||``).trim();if(!i||i.includes(`নমুনা`)||p===0&&m===0)return;let _=F();if(/^\d{2}\/\d{2}\/\d{4}$/.test(r)){let[e,t,n]=r.split(`/`);_=`${n}-${t}-${e}`}else if(/^\d{4}-\d{2}-\d{2}$/.test(r))_=r;else if(r&&!isNaN(r)){let e=new Date(Math.round((parseFloat(r)-25569)*86400*1e3));isNaN(e.getTime())||(_=e.toISOString().split(`T`)[0])}let v=i,y=null;if(i.startsWith(`[`)){let e=i.match(/^\[(.*?)\]/);e&&(y=e[1].trim()),v=i.replace(/^\[.*?\]\s*/,``).trim()}v=v.replace(/\s*\([^)]*\)\s*$/,``).trim();let b=null;if(y&&(b=o.find(e=>String(e.accountNo).trim()===y)),!b&&a){let e=a.replace(/\D/g,``);b=o.find(t=>String(t.phone).replace(/\D/g,``)===e)}!b&&v&&(b=o.find(e=>(e.name||``).toLowerCase().trim()===v.toLowerCase())),b?d++:c.add(v),l=B(l+p),u=B(u+m),s.push({date:_,customerName:v,matchedCustId:b?.id||null,phone:a,voucher:f,bill:p,paid:m,receivedType:h.toLowerCase().includes(`cash`)?`Cash`:`Bank`,receivedFrom:g})}),(await W.default.fire({title:`<div class="flex items-center justify-center gap-2 font-bn text-white"><i class="fa-solid fa-file-excel text-emerald-400"></i><span>এক্সেল সিঙ্ক প্রিভিউ</span></div>`,html:`
                <div class="text-left font-bn space-y-3 bg-slate-900 p-4 rounded-2xl border border-slate-800 text-sm">
                    <div class="flex justify-between border-b border-slate-800 pb-2"><span class="text-slate-400">লেনদেন:</span><strong class="text-white">${s.length} টি</strong></div>
                    <div class="flex justify-between border-b border-slate-800 pb-2"><span class="text-slate-400">পুরাতন কাস্টমার:</span><strong class="text-emerald-400">${d} জন</strong></div>
                    <div class="flex justify-between border-b border-slate-800 pb-2"><span class="text-slate-400">নতুন কাস্টমার:</span><strong class="text-blue-400">${c.size} জন</strong></div>
                    <div class="flex justify-between border-b border-slate-800 pb-2"><span class="text-slate-400">মোট বিল:</span><strong class="text-red-400">৳ ${I(l)}</strong></div>
                    <div class="flex justify-between"><span class="text-slate-400">মোট জমা:</span><strong class="text-emerald-400">৳ ${I(u)}</strong></div>
                </div>`,showCancelButton:!0,confirmButtonText:`হ্যাঁ, সিঙ্ক করুন`})).isConfirmed&&(await _r(s,c),W.default.fire(`সাফল্য!`,`সিঙ্ক সম্পন্ন হয়েছে।`,`success`)),e.value=``}catch(t){k(t,`এক্সেল ফাইল প্রসেস করতে ব্যর্থ`),e.value=``}}}window.downloadAdminExcelBackup=gr,window.uploadAdminExcelBackup=vr;function yr(e){if((async()=>{try{await Promise.all([vt(),yt()]);let e=document.getElementById(`grid-bank-name-1`);if(e&&window.cachedBanksHtml){let t=e.closest(`tr`).querySelector(`select`);t&&t.value===`Bank`&&(e.innerHTML=window.cachedBanksHtml)}}catch(e){console.error(e)}})(),window.AppState?.currentUserRole===`Staff`&&window.AppState?.permissions?.viewBulkEntry===!1){e.innerHTML=`<div class="m3-card text-center font-bn py-12"><h2 class="text-xl font-black text-red-500">অ্যাক্সেস ডিনাইড!</h2></div>`;return}e.innerHTML=`
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
    `,xr(),br(`spreadsheet`)}function br(e){let t=document.getElementById(`bulk-content-area`),n={spreadsheet:document.getElementById(`tab-spreadsheet`),excel:document.getElementById(`tab-excel`),"admin-excel":document.getElementById(`tab-admin-excel`)};Object.keys(n).forEach(t=>{n[t]&&(t===e?n[t].className=t===`admin-excel`?`px-6 py-2 text-sm font-semibold rounded-lg bg-emerald-600 text-white shadow-md`:`px-6 py-2 text-sm font-semibold rounded-lg bg-blue-600 text-white shadow-md`:n[t].className=t===`admin-excel`?`px-6 py-2 text-sm font-semibold rounded-lg text-emerald-400 border border-emerald-500/30 bg-emerald-500/10`:`px-6 py-2 text-sm font-semibold rounded-lg text-slate-400 hover:text-white`)}),e===`spreadsheet`?(t.innerHTML=`
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
        `,fr()):t.innerHTML=e===`admin-excel`?`
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
            </div>`}async function xr(){try{let e=A();e.length||(w(),e=await l.getAll());let t=document.getElementById(`customer-datalist`);t||(t=document.createElement(`datalist`),t.id=`customer-datalist`,document.body.appendChild(t)),t.innerHTML=e.map(e=>{let t=e.accountNo?`[${e.accountNo}] `:``;return`<option value="${t}${e.name}${e.phone?` (`+e.phone+`)`:``}">${t}${e.name}</option>`}).join(``)}catch(e){console.error(e)}}window.switchBulkTab=br,window.loadCustomerDatalist=xr;async function Sr(){let e=document.getElementById(`excel-file`);if(!e||!e.files.length){W.default.fire(`ফাইল নেই`,`দয়া করে একটি এক্সেল ফাইল সিলেক্ট করুন।`,`warning`);return}let t=e.files[0],n=new FileReader,r=document.getElementById(`process-excel-btn`);r&&(r.disabled=!0,r.innerHTML=`ফাইল পড়া হচ্ছে...`),n.onload=async e=>{try{let t=new Uint8Array(e.target.result),n=window.XLSX.read(t,{type:`array`}),i=n.SheetNames[0],a=n.Sheets[i],o=window.XLSX.utils.sheet_to_json(a,{header:1});if(o.length<=1)throw Error(`ফাইলটি খালি বা ডাটা নেই!`);let s=window.getTodayLocalDateString?window.getTodayLocalDateString():new Date().toISOString().split(`T`)[0],c=[];for(let e=1;e<o.length;e++){let t=o[e];if(!t||t.length===0)continue;let n=s,r=t[0];if(r)if(typeof r==`number`)n=new Date(Math.round((r-25569)*86400*1e3)).toISOString().split(`T`)[0];else{let e=new Date(r);isNaN(e)||(n=e.toISOString().split(`T`)[0])}let i=String(t[1]||``).trim(),a=String(t[2]||``).trim(),l=String(t[3]||``).trim(),u=parseFloat(t[4])||0,d=parseFloat(t[5])||0,f=String(t[6]||`Bank`).trim(),p=String(t[7]||``).trim();i&&(u>0||d>0)&&c.push({date:n,name:i,phone:a,voucher:l,bill:u,paid:d,receivedType:f,receivedFrom:p})}if(!c.length){W.default.fire(`ডাটা নেই`,`ভ্যালিড কোনো ডাটা পাওয়া যায়নি।`,`warning`),r&&(r.disabled=!1,r.innerHTML=`ফাইল আপলোড ও সেভ করুন`);return}await dr(c,!0)}catch(e){console.error(e),W.default.fire(`Error`,`ফাইল প্রসেস করতে সমস্যা হয়েছে।`,`error`),r&&(r.disabled=!1,r.innerHTML=`ফাইল আপলোড ও সেভ করুন`)}},n.readAsArrayBuffer(t)}window.switchBulkTab=br,window.loadCustomerDatalist=xr,window.addSpreadsheetRow=fr,window.handleGridKey=pr,window.saveSpreadsheetData=hr,window.processExcelUpload=Sr,window.executeBulkSave=hr;var Cr=null;function wr(){try{Cr&&Cr();let e=document.getElementById(`admin-users-list`);if(!e)return;Cr=o.listenAll(t=>{t.sort((e,t)=>{if(e.status===`pending`&&t.status!==`pending`)return-1;if(e.status!==`pending`&&t.status===`pending`)return 1;let n=e.createdAt?e.createdAt.toMillis():0;return(t.createdAt?t.createdAt.toMillis():0)-n});let r=document.getElementById(`stat-total-users`),i=document.getElementById(`stat-active-users`),a=document.getElementById(`stat-pending-users`),o=document.getElementById(`stat-blocked-users`),s=t.filter(e=>e.status===`approved`).length,c=t.filter(e=>e.status===`pending`).length,l=t.filter(e=>e.status===`blocked`||e.status===`revoked`).length;r&&(r.textContent=t.length),i&&(i.textContent=s),a&&(a.textContent=c),o&&(o.textContent=l);let u=`<div class="grid grid-cols-1 gap-3">`;t.forEach(e=>{let t=e.id,r=t===n.auth().currentUser?.uid,i=e.status===`pending`,a=e.status===`blocked`||e.status===`revoked`,o=e.email||t,s=(o.charAt(0)||`?`).toUpperCase(),c=`N/A`;if(e.lastLogin){let t=e.lastLogin.toDate();c=t.toLocaleDateString(`en-GB`)+` `+t.toLocaleTimeString([],{hour:`2-digit`,minute:`2-digit`})}let l=i?`bg-amber-500/15 border-amber-500/30 text-amber-400`:a?`bg-red-500/15 border-red-500/30 text-red-400`:r?`bg-indigo-500/15 border-indigo-500/30 text-indigo-400`:`bg-slate-700/50 border-slate-600/30 text-slate-300`,d=i?`<span class="text-[9px] bg-amber-500/20 border border-amber-500/30 text-amber-400 px-2 py-0.5 rounded-full font-black uppercase animate-pulse">Pending</span>`:a?`<span class="text-[9px] bg-red-500/20 border border-red-500/30 text-red-400 px-2 py-0.5 rounded-full font-black uppercase">Blocked</span>`:`<span class="text-[9px] bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 px-2 py-0.5 rounded-full font-black uppercase">Active</span>`,f=e.role===`Admin`?`<span class="text-[9px] bg-indigo-500/20 border border-indigo-500/30 text-indigo-400 px-2 py-0.5 rounded-full font-black uppercase">Admin</span>`:`<span class="text-[9px] bg-slate-600/30 border border-slate-500/30 text-slate-300 px-2 py-0.5 rounded-full font-black uppercase">Staff</span>`,p=i?`border-amber-500/30 bg-amber-500/[0.03]`:a?`border-red-500/20 bg-red-500/[0.02]`:`border-slate-800/60 hover:border-indigo-500/20`,m=``;r||(m=i?`
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
                    </div>`}),u+=`</div>`,e.innerHTML=u||`<div class="text-center py-8 text-slate-500 font-bold italic text-sm">কোনো অ্যাকাউন্ট পাওয়া যায়নি</div>`})}catch(e){console.error(`Error loading users:`,e)}}var Tr=e(i());async function Er(){if(window.AppState?.currentUserRole!==`Admin`)return W.default.fire(`অ্যাক্সেস ডিনাইড!`,`শুধুমাত্র অ্যাডমিন ব্যাকআপ নিতে পারবেন।`,`error`);if(!await O(`সম্পূর্ণ ডাটাবেস ব্যাকআপ ডাউনলোড`,`fullSystemBackup`))return;let{value:e,isDismissed:t}=await W.default.fire({title:`ব্যাকআপ এনক্রিপশন পাসওয়ার্ড`,text:`ফাইলের সুরক্ষার জন্য একটি পাসওয়ার্ড দিন। রিস্টোর করার সময় এই পাসওয়ার্ড লাগবে।`,input:`password`,inputPlaceholder:`আপনার গোপন পাসওয়ার্ড দিন`,showCancelButton:!0,confirmButtonText:`ডাউনলোড শুরু করুন`,cancelButtonText:`বাতিল`,customClass:{popup:`!bg-slate-900 !text-white !rounded-3xl border border-slate-700 font-bn`},inputValidator:e=>{if(!e||e.length<4)return`অন্তত ৪ অক্ষরের পাসওয়ার্ড দিতে হবে!`}});if(!(t||!e)){W.default.fire({title:`ব্যাকআপ প্রস্তুত করা হচ্ছে...`,text:`দয়া করে অপেক্ষা করুন, পুরো ডাটাবেস এক্সপোর্ট হচ্ছে।`,allowOutsideClick:!1,didOpen:()=>W.default.showLoading(),customClass:{popup:`!bg-slate-900 !text-white !rounded-3xl border border-slate-700 font-bn`}});try{let t={systemMeta:{version:`1.0.0`,appName:`MAA MOTORS ERP`,exportTimestamp:new Date().toISOString(),exportedBy:window.AppState?.currentUserEmail||`Unknown`},collections:{}},n={};n.customers=await l.getAll(),n.transactions=await g.getAll();let r=await c.collection(`expenses`).get();n.expenses=[],r.forEach(e=>n.expenses.push({id:e.id,...e.data()}));let i=await c.collection(`zones`).get();n.zones=[],i.forEach(e=>n.zones.push({id:e.id,...e.data()}));let a=await c.collection(`users`).get();n.users=[],a.forEach(e=>n.users.push({id:e.id,...e.data()}));let o=await c.collection(`settings`).get();n.settings=[],o.forEach(e=>n.settings.push({id:e.id,...e.data()}));let s=e=>e.map(e=>{let t={...e};return Object.keys(t).forEach(e=>{t[e]&&typeof t[e].toDate==`function`&&(t[e]={_tType:`timestamp`,iso:t[e].toDate().toISOString()})}),t}),u=0;for(let[e,r]of Object.entries(n))t.collections[e]=s(r),u+=r.length;t.systemMeta.totalRecords=u;let d=JSON.stringify(t),f=Tr.default.SHA256(d).toString();t.systemMeta.checksum=f;let p=JSON.stringify(t),m=Tr.default.AES.encrypt(p,e).toString(),h=new Blob([m],{type:`text/plain;charset=utf-8`}),_=URL.createObjectURL(h),v=document.createElement(`a`);v.href=_,v.download=`Maa_Motors_ERP_Backup_${new Date().toISOString().split(`T`)[0]}.enc`,document.body.appendChild(v),v.click(),document.body.removeChild(v),URL.revokeObjectURL(_),S(`SYSTEM_BACKUP`,`Admin`,`Backup`,`Full Database Backup Downloaded`),await SettingsDAO.updateAppSettings({lastDisasterBackupTimestamp:new Date().toISOString()}),W.default.fire({title:`সফল!`,text:`মোট ${u} টি রেকর্ড সফলভাবে এনক্রিপ্ট করে ডাউনলোড করা হয়েছে।`,icon:`success`,customClass:{popup:`!bg-slate-900 !text-white !rounded-3xl border border-slate-700 font-bn`}})}catch(e){console.error(`Backup Export Error:`,e),W.default.fire(`Error`,`ব্যাকআপ জেনারেট করতে সমস্যা হয়েছে!`,`error`)}}}async function Dr(){if(window.AppState?.currentUserRole!==`Admin`)return W.default.fire(`অ্যাক্সেস ডিনাইড!`,`শুধুমাত্র অ্যাডমিন সিস্টেম রিস্টোর করতে পারবেন।`,`error`);let{value:e}=await W.default.fire({title:`ডাটাবেস রিস্টোর করুন`,text:`আপনার .enc ব্যাকআপ ফাইলটি আপলোড করুন।`,input:`file`,inputAttributes:{accept:`.enc`,"aria-label":`Upload your backup file`},showCancelButton:!0,confirmButtonText:`পরবর্তী ধাপ`,cancelButtonText:`বাতিল`,customClass:{popup:`!bg-slate-900 !text-white !rounded-3xl border border-slate-700 font-bn`}});if(!e)return;let{value:t}=await W.default.fire({title:`ব্যাকআপ পাসওয়ার্ড`,text:`এই ফাইলটি ডিক্রিপ্ট করার জন্য পাসওয়ার্ড দিন:`,input:`password`,showCancelButton:!0,confirmButtonText:`ভ্যালিডেট করুন`,cancelButtonText:`বাতিল`,customClass:{popup:`!bg-slate-900 !text-white !rounded-3xl border border-slate-700 font-bn`}});if(t){W.default.fire({title:`ফাইল যাচাই করা হচ্ছে...`,allowOutsideClick:!1,didOpen:()=>W.default.showLoading(),customClass:{popup:`!bg-slate-900 !text-white !rounded-3xl border border-slate-700 font-bn`}});try{let r=await e.text(),i=``;try{i=Tr.default.AES.decrypt(r,t).toString(Tr.default.enc.Utf8)}catch{return W.default.fire(`Error`,`ভুল পাসওয়ার্ড অথবা করাপ্টেড ফাইল!`,`error`)}if(!i)return W.default.fire(`Error`,`ভুল পাসওয়ার্ড অথবা করাপ্টেড ফাইল!`,`error`);let{systemMeta:a,collections:o}=JSON.parse(i),s=JSON.stringify({systemMeta:{...a,checksum:void 0},collections:o});if(Tr.default.SHA256(s).toString(),!a||!o||a.appName!==`MAA MOTORS ERP`)return W.default.fire(`Error`,`এই ফাইলটি এই সিস্টেমের ব্যাকআপ নয়!`,`error`);if(!await O(`বিপজ্জনক: সম্পূর্ণ ডাটাবেস রিস্টোর`,`fullSystemRestore`)||!(await W.default.fire({title:`<i class="fa-solid fa-triangle-exclamation text-amber-500 mr-2"></i> চূড়ান্ত ওয়ার্নিং`,html:`আপনি <b>${a.exportTimestamp}</b> তারিখের ব্যাকআপ রিস্টোর করতে যাচ্ছেন।<br><br>
                   <b>বর্তমান ডাটাবেসের সমস্ত ডাটা মুছে ফেলা হবে!</b><br>
                   আপনি কি নিশ্চিত?`,icon:`warning`,showCancelButton:!0,confirmButtonColor:`#ef4444`,confirmButtonText:`হ্যাঁ, রিস্টোর করুন!`,cancelButtonText:`বাতিল`,customClass:{popup:`!bg-slate-900 !text-white !rounded-3xl border border-slate-700 font-bn`}})).isConfirmed)return;W.default.fire({title:`রিস্টোর চলছে...`,html:`দয়া করে ব্রাউজার বন্ধ করবেন না।<br><span id="restore-progress" class="text-amber-400 font-bold">0</span>% কমপ্লিট`,allowOutsideClick:!1,didOpen:()=>W.default.showLoading(),customClass:{popup:`!bg-slate-900 !text-white !rounded-3xl border border-slate-700 font-bn`}});for(let e of[`customers`,`transactions`,`expenses`,`zones`,`users`,`settings`,`audit_logs`]){let t=await c.collection(e).get(),n=c.batch(),r=0;for(let e of t.docs)n.delete(e.ref),r++,r>=400&&(await n.commit(),n=c.batch(),r=0);r>0&&await n.commit()}let l=a.totalRecords,u=0;for(let[e,t]of Object.entries(o)){let r=c.batch(),i=0;for(let a of t){let t=a.id;delete a.id,Object.keys(a).forEach(e=>{a[e]&&a[e]._tType===`timestamp`&&(a[e]=n.firestore.Timestamp.fromDate(new Date(a[e].iso)))});let o=c.collection(e).doc(t);r.set(o,a),i++,u++,i>=400&&(await r.commit(),r=c.batch(),i=0,document.getElementById(`restore-progress`).innerText=Math.round(u/l*100))}i>0&&(await r.commit(),document.getElementById(`restore-progress`).innerText=Math.round(u/l*100))}await c.collection(`audit_logs`).add({action:`DISASTER_RECOVERY`,module:`System`,entityId:`All`,entityName:`Full DB Restore`,details:{restoredFrom:a.exportTimestamp},user:window.AppState?.currentUserEmail||`Admin`,timestamp:n.firestore.FieldValue.serverTimestamp()}),await W.default.fire({title:`রিস্টোর সফল!`,text:`ডাটাবেস সফলভাবে রিস্টোর হয়েছে। সিস্টেম এখন ফ্রেশ ডাটা লোড করার জন্য রিস্টার্ট হবে।`,icon:`success`,allowOutsideClick:!1,confirmButtonText:`রিস্টার্ট করুন`,customClass:{popup:`!bg-slate-900 !text-white !rounded-3xl border border-slate-700 font-bn`}});try{await n.firestore().clearPersistence()}catch(e){console.warn(`Could not clear persistence`,e)}window.location.reload(!0)}catch(e){console.error(`Backup Restore Error:`,e),W.default.fire(`Error`,`ডাটা রিস্টোর করার সময় অপ্রত্যাশিত এরর হয়েছে!`,`error`)}}}async function Or(){try{let e=(await p.getAppSettings()).lastDisasterBackupTimestamp,t=new Date,n=!1,r=0;if(!e)n=!0,r=`অনেক`;else{let i=t-new Date(e),a=Math.floor(i/864e5);a>=3&&(n=!0,r=a)}n&&W.default.fire({title:`<i class="fa-solid fa-triangle-exclamation text-red-500 mr-2 text-4xl mb-2 block"></i>বিপজ্জনক পরিস্থিতি!`,html:`<p class="text-slate-300 text-sm">গত <b>${r} দিন</b> ধরে আপনার ডাটাবেসের কোনো डिजाস্টার রিকভারি ব্যাকআপ নেওয়া হয়নি!</p>
                       <p class="text-amber-400 font-bold mt-3 text-xs bg-amber-500/10 p-3 rounded-lg border border-amber-500/20">
                         দয়া করে এখনই এডমিন প্যানেলের "Advanced Disaster Recovery" সেকশন থেকে 1-Click Backup ডাউনলোড করে সুরক্ষিত স্থানে সংরক্ষণ করুন।
                       </p>`,icon:`warning`,confirmButtonText:`ঠিক আছে, আমি ব্যাকআপ নিচ্ছি`,confirmButtonColor:`#ef4444`,customClass:{popup:`!bg-slate-900 !text-white !rounded-3xl border border-red-500/50 shadow-2xl font-bn`,confirmButton:`m3-btn-primary !bg-red-600 hover:!bg-red-500 !px-6 !py-2.5 rounded-xl font-bold text-sm`}})}catch(e){console.error(`Backup reminder check failed:`,e)}}var kr=t({checkBackupReminder:()=>Or,downloadFullSystemBackup:()=>Er,restoreSystemFromBackup:()=>Dr}),Ar=t({autoSyncZoneCounters:()=>Nr,resequenceZoneAccountNumbers:()=>Pr,setNextAccountNo:()=>jr,showIndividualFixer:()=>Mr,syncSingleZoneCounter:()=>Fr});async function jr(){try{w();let e=await u.getAllZones();if(!e||e.length===0)return W.default.fire({title:`কোনো জোন পাওয়া যায়নি!`,text:`সিরিয়াল আপডেট করার আগে আপনাকে অন্তত একটি জোন তৈরি করতে হবে।`,icon:`warning`,customClass:{popup:`!bg-slate-900 !text-white !rounded-3xl border border-slate-700`}});let t=`<option value="">-- জোন সিলেক্ট করুন --</option>`;e.forEach(e=>{t+=`<option value="${e.name}">${e.name}</option>`});let{value:n}=await W.default.fire({title:`অটো-সিরিয়াল কাউন্টার সেট করুন`,html:`<div class="text-left space-y-4 font-bn p-2">
                    <div><label class="block text-xs font-bold text-slate-400 mb-1">জোন সিলেক্ট করুন</label><select id="set-next-zone" class="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white outline-none focus:border-blue-500">${t}</select></div>
                    <div><label class="block text-xs font-bold text-slate-400 mb-1">বর্তমান সিরিয়াল নম্বর (e.g. 5 মানে পরবর্তী আইডি 0006 হবে)</label><input id="set-next-val" type="number" class="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white outline-none focus:border-blue-500" placeholder="e.g. 5"></div>
                </div>`,showCancelButton:!0,confirmButtonText:`আপডেট করুন`,cancelButtonText:`বাতিল`,customClass:{popup:`!bg-slate-900 !text-white !rounded-3xl border border-slate-700`},preConfirm:()=>{let e=document.getElementById(`set-next-zone`).value,t=parseInt(document.getElementById(`set-next-val`).value);return!e||isNaN(t)?W.default.showValidationMessage(`সবগুলো ঘর পূরণ করুন`):{zone:e,val:t}}});if(n){if(!await O(`অটো-সিরিয়াল কাউন্টার পরিবর্তন`))return;try{await p.updateZoneCounter(n.zone,n.val),W.default.fire(`সফল!`,`জোনের (${n.zone}) পরবর্তী সিরিয়াল আপডেট করা হয়েছে।`,`success`)}catch{W.default.fire(`Error`,`কাউন্টার আপডেট করা যায়নি।`,`error`)}}}catch(e){console.error(`setNextAccountNo error:`,e),W.default.fire(`ত্রুটি!`,`ডাটা লোড করতে সমস্যা হয়েছে। দয়া করে পেজ রিফ্রেশ করে আবার চেষ্টা করুন।`,`error`)}}async function Mr(){w();let e=A(),t=`<option value="">-- কাস্টমার সিলেক্ট করুন --</option>`;e.forEach(e=>{t+=`<option value="${e.id}" data-acc="${e.accountNo||``}">${e.accountNo?`[`+e.accountNo+`] `:``}${e.name}</option>`});let{value:n}=await W.default.fire({title:`ID ম্যানেজার`,html:`<div class="text-left space-y-4 font-bn p-2">
                <div><label class="block text-xs font-bold text-slate-400 mb-1">কাস্টমার সিলেক্ট করুন</label><select id="fix-cust-sel" class="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white outline-none focus:border-blue-500" onchange="document.getElementById('fix-new-acc').value = this.options[this.selectedIndex].dataset.acc">${t}</select></div>
                <div><label class="block text-xs font-bold text-slate-400 mb-1">নতুন অ্যাকাউন্ট নং (৪ ডিজিট)</label><input id="fix-new-acc" class="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white outline-none focus:border-blue-500" placeholder="e.g. 0001"></div>
            </div>`,showCancelButton:!0,confirmButtonText:`পরিবর্তন করুন`,cancelButtonText:`বাতিল`,customClass:{popup:`!bg-slate-900 !text-white !rounded-3xl border border-slate-700`},preConfirm:()=>{let e=document.getElementById(`fix-cust-sel`).value,t=document.getElementById(`fix-new-acc`).value.trim();return!e||!t?W.default.showValidationMessage(`সবগুলো ঘর পূরণ করুন`):{id:e,newAcc:t}}});if(n){if(!await O(`অ্যাকাউন্ট নং পরিবর্তন`))return;try{await l.update(n.id,{accountNo:n.newAcc}),S(`ID_FIX`,`Admin`,n.id,``,{newAccountNo:n.newAcc}),W.default.fire(`সফল!`,`অ্যাকাউন্ট নাম্বার পরিবর্তন করা হয়েছে।`,`success`)}catch{W.default.fire(`Error`,`পরিবর্তন করা যায়নি।`,`error`)}}}async function Nr(){if(window.AppState.currentUserRole!==`Admin`)return W.default.fire(`অ্যাক্সেস ডিনাইড!`,`শুধুমাত্র অ্যাডমিন জোন কাউন্টার সিঙ্ক করতে পারবেন।`,`error`);if(await O(`জোন কাউন্টার অটো-সিঙ্ক (Auto Reset)`))try{W.default.fire({title:`সিঙ্ক হচ্ছে...`,text:`সকল জোনের কাস্টমার সিরিয়াল ও কাউন্টার স্ক্যান করা হচ্ছে...`,allowOutsideClick:!1,didOpen:()=>W.default.showLoading(),customClass:{popup:`!bg-slate-900 !text-white !rounded-3xl border border-slate-700 font-bn`}});let e=await u.getAllZones(),t=await l.getAll();if(!e||e.length===0)return W.default.fire(`তথ্য পাওয়া যায়নি`,`কোনো জোন নিবন্ধিত নেই।`,`warning`);let n=[];for(let r of e){let e=r.name,i=t.filter(t=>(t.zone||``).trim()===e),a=0;i.forEach(e=>{let t=(e.accountNo||``).match(/\d+/);if(t){let e=parseInt(t[0],10);!isNaN(e)&&e>a&&(a=e)}}),await p.updateZoneCounter(e,a),n.push(`• <strong>${e}</strong>: সক্রিয় কাস্টমার ${i.length} জন <i class="fa-solid fa-arrow-right text-cyan-400 mx-1"></i> কাউন্টার সেট: <strong>${a}</strong> (পরবর্তী: ${a+1})`)}S(`AUTO_SYNC_COUNTERS`,`Admin`,`Counters`,`Zone Counters Auto Synced`),W.default.fire({title:`<i class="fa-solid fa-rotate text-emerald-400 mr-2"></i>জোন কাউন্টার সিঙ্ক সফল!`,html:`<div class="text-left space-y-2 font-bn p-3 bg-slate-950 rounded-2xl border border-slate-800 text-xs text-slate-300">
                    <p class="font-bold text-white mb-2">ডাটাবেসের বর্তমান সক্রিয় কাস্টমার সংখ্যা অনুযায়ী সিরিয়াল কাউন্টার আপডেট করা হয়েছে:</p>
                    ${n.join(`<br>`)}
                </div>`,icon:`success`,confirmButtonText:`ঠিক আছে`,customClass:{popup:`!bg-slate-900 !text-white !rounded-3xl border border-slate-700 font-bn`}}),window.loadCustomers&&window.loadCustomers()}catch(e){console.error(`autoSyncZoneCounters error:`,e),W.default.fire(`ত্রুটি!`,`কাউন্টার সিঙ্ক করার সময় সমস্যা হয়েছে।`,`error`)}}async function Pr(e=null){if(window.AppState.currentUserRole!==`Admin`)return W.default.fire(`অ্যাক্সেস ডিনাইড!`,`শুধুমাত্র অ্যাডমিন সিরিয়াল সাজাতে পারবেন।`,`error`);let t=await u.getAllZones();if(!t||t.length===0)return W.default.fire(`warning`,`কোনো জোন নেই!`);let n=e;if(!n){let e=`<option value="">-- জোন সিলেক্ট করুন --</option>`;t.forEach(t=>{e+=`<option value="${t.name}">${t.name}</option>`});let{value:r}=await W.default.fire({title:`সিরিয়াল অনুযায়ী অ্যাকাউন্ট পুনঃসাজানো`,html:`<div class="text-left space-y-3 font-bn p-2">
                    <p class="text-xs text-amber-400 font-bold bg-amber-500/10 p-3 rounded-xl border border-amber-500/20">
                        <i class="fa-solid fa-triangle-exclamation text-amber-400 mr-1.5"></i>সতর্কবার্তা: এটি সিলেক্ট করা জোনের সকল সক্রিয় কাস্টমারের অ্যাকাউন্ট নম্বর ১, ২, ৩... ক্রমানুসারে পুনরায় সেট করবে।
                    </p>
                    <div><label class="block text-xs font-bold text-slate-400 mb-1">জোন সিলেক্ট করুন</label><select id="reseq-zone-sel" class="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white outline-none focus:border-blue-500">${e}</select></div>
                </div>`,showCancelButton:!0,confirmButtonText:`পুনরায় সাজান`,cancelButtonText:`বাতিল`,customClass:{popup:`!bg-slate-900 !text-white !rounded-3xl border border-slate-700`},preConfirm:()=>document.getElementById(`reseq-zone-sel`).value||W.default.showValidationMessage(`জোন সিলেক্ট করুন`)});n=r}if(n&&await O(`কাস্টমার সিরিয়াল পুনঃসাজানো`))try{W.default.fire({title:`প্রসেস হচ্ছে...`,text:`কাস্টমারদের অ্যাকাউন্ট নম্বর ক্রমানুসারে আপডেট হচ্ছে...`,allowOutsideClick:!1,didOpen:()=>W.default.showLoading()});let e=await l.getAll(),r=t.find(e=>e.name===n),i=r&&r.code||``,a=e.filter(e=>(e.zone||``).trim()===n);a.sort((e,t)=>(e.accountNo||``).localeCompare(t.accountNo||``,void 0,{numeric:!0}));let o=0,s=[];for(let e=0;e<a.length;e++){let t=a[e],n=i+String(e+1).padStart(4,`0`);t.accountNo!==n&&(s.push({ref:l.getRef(t.id),newAccNo:n}),o++)}for(let e=0;e<s.length;e+=400){let t=c.batch();s.slice(e,e+400).forEach(e=>t.update(e.ref,{accountNo:e.newAccNo})),await t.commit()}await p.updateZoneCounter(n,a.length),S(`RESEQUENCE_ACC_NO`,`Admin`,n,`${o} updated`),W.default.fire(`সফল!`,`জোনের (${n}) ${a.length} জন কাস্টমারের আইডি ১ থেকে ${a.length} সিরিয়ালে সুন্দরভাবে সাজানো হয়েছে।`,`success`),window.loadCustomers&&window.loadCustomers()}catch(e){console.error(`resequenceZoneAccountNumbers error:`,e),W.default.fire(`ত্রুটি!`,`সিরিয়াল পুনঃসাজানোর সময় সমস্যা হয়েছে।`,`error`)}}async function Fr(e){if(e)try{let t=(await l.getAll()).filter(t=>(t.zone||``).trim()===e),n=0;t.forEach(e=>{let t=(e.accountNo||``).match(/\d+/);if(t){let e=parseInt(t[0],10);!isNaN(e)&&e>n&&(n=e)}}),await p.updateZoneCounter(e,n)}catch(e){console.error(`syncSingleZoneCounter error:`,e)}}window.resequenceZoneModal=Pr,window.downloadFullSystemBackup=Er,window.restoreSystemFromBackup=Dr;var Ir=t({approveStaff:()=>Lr,changeStaffPin:()=>Rr,createNewUser:()=>Hr,deleteUserAccount:()=>Br,revokeStaff:()=>zr,updateUserRole:()=>Vr});async function Lr(e,t){if(window.AppState.currentUserRole!==`Admin`||!await O(`স্টাফ অনুমোদন (Staff Approval)`))return;let{value:n}=await W.default.fire({title:`অ্যাপ্রুভ ও পিন সেটআপ`,input:`text`,inputLabel:`${t} এর জন্য একটি 4-ডিজিট পিন সেট করুন`,inputPlaceholder:`e.g. 1234`,inputAttributes:{autocomplete:`new-password`,autocapitalize:`off`,spellcheck:`false`},showCancelButton:!0,inputValidator:e=>{if(!e||e.length!==4||isNaN(e))return`আপনাকে অবশ্যই 4-ডিজিটের সংখ্যার পিন দিতে হবে!`}});if(n)try{await o.update(e,{status:`active`,pin:n}),S(`APPROVE`,`Admin`,e,t,{pinSet:!0}),W.default.fire(`অ্যাপ্রুভড!`,`স্টাফ অ্যাপ্রুভ হয়েছে এবং পিন সেট করা হয়েছে।`,`success`)}catch{W.default.fire(`Error`,`ব্যর্থ হয়েছেন`,`error`)}}async function Rr(e,t){if(window.AppState.currentUserRole!==`Admin`||!await O(`স্টাফ পিন পরিবর্তন (PIN Change)`))return;let{value:n}=await W.default.fire({title:`পিন পরিবর্তন`,input:`text`,inputLabel:`বর্তমান পিন: ${t} | নতুন 4-ডিজিট পিন দিন`,inputPlaceholder:`e.g. 5678`,inputAttributes:{autocomplete:`new-password`,autocapitalize:`off`,spellcheck:`false`},showCancelButton:!0,inputValidator:e=>{if(!e||e.length!==4||isNaN(e))return`আপনাকে অবশ্যই 4-ডিজিটের সংখ্যার পিন দিতে হবে!`}});if(n)try{await o.update(e,{pin:n}),S(`PIN_CHANGE`,`Admin`,e,``,{targetUser:e}),W.default.fire(`সফল!`,`পিন আপডেট করা হয়েছে।`,`success`)}catch{W.default.fire(`Error`,`ব্যর্থ হয়েছেন`,`error`)}}async function zr(e){if(window.AppState.currentUserRole===`Admin`&&await O(`স্টাফ ব্লক/বাতিল (Revoke Access)`)&&(await W.default.fire({title:`নিশ্চিত?`,text:`এই স্টাফ আর লগইন করতে পারবে না।`,icon:`warning`,showCancelButton:!0})).isConfirmed)try{await o.update(e,{status:`pending`,pin:``}),S(`REVOKE`,`Admin`,e,``,{action:`Block/Revoke`}),W.default.fire(`সফল!`,`অ্যাক্সেস বাতিল করা হয়েছে।`,`success`)}catch{W.default.fire(`Error`,`ব্যর্থ হয়েছেন`,`error`)}}async function Br(e,t){if(window.AppState.currentUserRole!==`Admin`)return W.default.fire(`অ্যাক্সেস ডিনাইড!`,`শুধুমাত্র অ্যাডমিন অ্যাকাউন্ট মুছে ফেলতে পারবেন।`,`error`);if((await W.default.fire({title:`<i class="fa-solid fa-user-xmark text-red-400 mr-2"></i>অ্যাকাউন্ট মুছে ফেলা`,html:`<p style="color:#ef4444;font-size:14px;"><i class="fa-solid fa-triangle-exclamation mr-1.5"></i>আপনি কি নিশ্চিত যে <b>${t||e}</b> অ্যাকাউন্টটি ডাটাবেস থেকে মুছে ফেলতে চান?</p>`,icon:`warning`,showCancelButton:!0,confirmButtonText:`হ্যাঁ, ডিলেট করুন`,cancelButtonText:`বাতিল`,confirmButtonColor:`#dc2626`})).isConfirmed&&await O(`ইউজার অ্যাকাউন্ট মুছে ফেলা`))try{await o.delete(e),S(`DELETE`,`Admin`,e,t,{action:`User Deletion`}),W.default.fire({title:`অ্যাকাউন্ট মুছে ফেলা হয়েছে!`,text:`ইউজার (${t||e}) ডাটাবেস থেকে সফলভাবে ডিলেট করা হয়েছে।`,icon:`success`})}catch(e){console.error(`Failed to delete user account:`,e),W.default.fire({title:`Error!`,text:`অ্যাকাউন্টটি মুছতে সমস্যা হয়েছে: `+(e.message||e),icon:`error`})}}async function Vr(e){if(window.AppState.currentUserRole!==`Admin`||!await O(`ইউজার রোল পরিবর্তন (Role Change)`))return;let t=document.getElementById(`role-${e}`).value;try{await o.update(e,{role:t}),S(`ROLE_CHANGE`,`Admin`,e,``,{newRole:t}),W.default.fire(`সফল!`,`ইউজারের রোল আপডেট হয়েছে।`,`success`)}catch{W.default.fire(`Error`,`রোল আপডেট করতে ব্যর্থ হয়েছেন।`,`error`)}}async function Hr(){if(window.AppState.currentUserRole!==`Admin`||!await O(`নতুন ইউজার অ্যাকাউন্ট তৈরি`))return;let{value:e}=await W.default.fire({title:`নতুন অ্যাকাউন্ট তৈরি করুন`,html:`
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
        `,focusConfirm:!1,showCancelButton:!0,confirmButtonText:`অ্যাকাউন্ট তৈরি করুন`,cancelButtonText:`বাতিল`,preConfirm:()=>{let e=document.getElementById(`new-user-email`).value.trim(),t=document.getElementById(`new-user-password`).value,n=document.getElementById(`new-user-role`).value;return!e||!t?(W.default.showValidationMessage(`ইমেইল এবং পাসওয়ার্ড আবশ্যক!`),!1):t.length<6?(W.default.showValidationMessage(`পাসওয়ার্ড কমপক্ষে ৬ ক্যারেক্টার হতে হবে!`),!1):{email:e,password:t,role:n}}});if(e){W.default.fire({title:`অ্যাকাউন্ট তৈরি হচ্ছে...`,text:`অনুগ্রহ করে অপেক্ষা করুন`,allowOutsideClick:!1,didOpen:()=>{W.default.showLoading()}});let t=null;try{t=n.initializeApp(m,`UserCreationApp_`+Date.now());let r=(await t.auth().createUserWithEmailAndPassword(e.email,e.password)).user.uid;await o.getRef(r).set({email:e.email,role:e.role,status:`active`,createdAt:n.firestore.FieldValue.serverTimestamp()}),S(`CREATE`,`Admin`,r,e.email,{role:e.role}),W.default.fire({title:`সফল!`,text:`${e.email} অ্যাকাউন্টটি সফলভাবে ফায়ারবেসে তৈরি হয়েছে।`,icon:`success`})}catch(e){console.error(`Error creating user:`,e),W.default.fire({title:`Error!`,text:`অ্যাকাউন্ট তৈরি করতে সমস্যা হয়েছে: `+(e.message||e),icon:`error`})}finally{t&&t.delete().catch(e=>console.warn(`secondaryApp cleanup warning:`,e))}}}var Ur=t({managePermissions:()=>Wr});async function Wr(e,t){if(window.AppState.currentUserRole===`Admin`&&await O(`পারমিশন পরিবর্তন (Manage Permissions)`))try{let n=(await o.getById(e)).permissions||{},{value:r}=await W.default.fire({title:`Permissions for ${t}`,html:`
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
            `,focusConfirm:!1,showCancelButton:!0,confirmButtonText:`পারমিশন সেভ করুন`,cancelButtonText:`বাতিল`,customClass:{popup:`!bg-slate-900 !text-white !rounded-3xl border border-slate-700/80`,title:`!text-white`,confirmButton:`m3-btn-primary !px-6`,cancelButton:`m3-btn-tonal !px-6`},preConfirm:()=>{let e=document.getElementById(`perm-editLedger`).checked,t=document.getElementById(`perm-deleteLedger`).checked,n=document.getElementById(`perm-editExpenses`).checked,r=document.getElementById(`perm-deleteExpenses`).checked,i=document.getElementById(`perm-editCustomers`).checked,a=document.getElementById(`perm-deleteCustomers`).checked;return{viewDashboard:document.getElementById(`perm-viewDashboard`).checked,viewDashboardFinancials:document.getElementById(`perm-viewDashboardFinancials`).checked,printExecutiveReport:document.getElementById(`perm-printExecutiveReport`).checked,viewLedger:document.getElementById(`perm-viewLedger`).checked,manageLedger:e||t,editLedger:e,deleteLedger:t,exportLedger:document.getElementById(`perm-exportLedger`).checked,viewBulkEntry:document.getElementById(`perm-viewBulkEntry`).checked,viewInvoice:document.getElementById(`perm-viewInvoice`).checked,allowInvoiceDiscount:document.getElementById(`perm-allowInvoiceDiscount`).checked,viewExpenses:document.getElementById(`perm-viewExpenses`).checked,manageExpenses:n||r,editExpenses:n,deleteExpenses:r,viewCustomers:document.getElementById(`perm-viewCustomers`).checked,manageCustomers:i||a,editCustomers:i,deleteCustomers:a,viewStatement:document.getElementById(`perm-viewStatement`).checked,sendSMS:document.getElementById(`perm-sendSMS`).checked}}});r&&(await o.update(e,{permissions:r}),S(`PERMISSION_CHANGE`,`Admin`,e,t,{permissions:r}),W.default.fire({title:`সফল!`,text:`পারমিশন সফলভাবে সেভ করা হয়েছে।`,icon:`success`,customClass:{popup:`!bg-slate-900 !text-white !rounded-3xl border border-slate-700/80`}}))}catch(e){console.error(`Failed to update permissions:`,e),W.default.fire(`Error`,`Failed to update permissions.`,`error`)}}var Gr=t({deactivateBankingItem:()=>ei,editBankingItem:()=>$r,reactivateBankingItem:()=>ti,showBankingSystemManager:()=>Jr}),q=`bank`,Kr=[],qr=[];async function Jr(){W.default.fire({title:`ব্যাংকিং ও ক্যাশ ম্যানেজমেন্ট`,html:`
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
        `,showConfirmButton:!1,showCloseButton:!0,width:`600px`,customClass:{popup:`!bg-slate-900 !text-white !rounded-3xl border border-slate-700`},didOpen:()=>{document.getElementById(`tab-bank`).addEventListener(`click`,()=>Yr(`bank`)),document.getElementById(`tab-cash`).addEventListener(`click`,()=>Yr(`cash`)),document.getElementById(`btn-add-banking-item`).addEventListener(`click`,Qr),Xr()}})}function Yr(e){q=e;let t=document.getElementById(`tab-bank`),n=document.getElementById(`tab-cash`),r=document.getElementById(`banking-tab-title`);e===`bank`?(t.className=`px-4 py-2 bg-blue-600 text-white rounded-lg text-xs font-bold transition-all shadow-md`,n.className=`px-4 py-2 bg-slate-800 text-slate-300 hover:bg-slate-700 rounded-lg text-xs font-bold transition-all`,r.innerText=`সকল ব্যাংক অ্যাকাউন্ট`):(n.className=`px-4 py-2 bg-emerald-600 text-white rounded-lg text-xs font-bold transition-all shadow-md`,t.className=`px-4 py-2 bg-slate-800 text-slate-300 hover:bg-slate-700 rounded-lg text-xs font-bold transition-all`,r.innerText=`সকল ক্যাশ রিসিভার`),Zr()}async function Xr(){try{let[e,t]=await Promise.all([f.getAllBanks(),h.getAllCollectors()]);Kr=e,qr=t,Zr()}catch(e){console.error(e),document.getElementById(`banking-list-container`).innerHTML=`<div class="text-red-400 text-xs text-center">ডাটা লোড করতে সমস্যা হয়েছে।</div>`}}function Zr(){let e=document.getElementById(`banking-list-container`);if(!e)return;let t=q===`bank`?Kr:qr,n=q===`cash`;if(t.length===0){e.innerHTML=`<div class="text-slate-500 text-xs text-center py-6">কোনো ডাটা পাওয়া যায়নি।</div>`;return}let r=``;t.forEach(e=>{let t=e.status!==`inactive`,i=t?`<span class="bg-emerald-500/10 text-emerald-400 text-[9px] px-1.5 py-0.5 rounded font-bold uppercase border border-emerald-500/20">Active</span>`:`<span class="bg-red-500/10 text-red-400 text-[9px] px-1.5 py-0.5 rounded font-bold uppercase border border-red-500/20">Inactive</span>`;r+=`
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
                    <button class="w-7 h-7 rounded-md bg-slate-800 hover:bg-amber-600 text-slate-400 hover:text-white transition-colors" onclick="window.appAdmin.editBankingItem('${e.id}', '${e.name}', '${q}')" title="এডিট বা রিনেম"><i class="fa-solid fa-pen text-[10px]"></i></button>
                    ${t?`<button class="w-7 h-7 rounded-md bg-slate-800 hover:bg-red-600 text-slate-400 hover:text-white transition-colors" onclick="window.appAdmin.deactivateBankingItem('${e.id}', '${e.name}', '${q}')" title="নিষ্ক্রিয়/ডিলেট করুন"><i class="fa-solid fa-trash-can text-[10px]"></i></button>`:`<button class="w-7 h-7 rounded-md bg-slate-800 hover:bg-emerald-600 text-slate-400 hover:text-white transition-colors" onclick="window.appAdmin.reactivateBankingItem('${e.id}', '${e.name}', '${q}')" title="পুনরায় চালু করুন"><i class="fa-solid fa-rotate-left text-[10px]"></i></button>`}
                </div>
            </div>
        `}),e.innerHTML=r}async function Qr(){let e=q===`cash`,t=e?`ক্যাশ রিসিভার`:`ব্যাংক অ্যাকাউন্ট`,{value:n}=await W.default.fire({title:`নতুন ${t} যোগ করুন`,input:`text`,inputPlaceholder:`${t} এর নাম...`,showCancelButton:!0,confirmButtonText:`যোগ করুন`,cancelButtonText:`বাতিল`,customClass:{popup:`!bg-slate-900 !text-white !rounded-3xl border border-slate-700`,input:`!bg-slate-950 !text-white !border-slate-700 focus:!border-emerald-500`},inputValidator:e=>{if(!e||!e.trim())return`নাম দেওয়া আবশ্যক!`}});if(n){if(!await O(`${t} যোগ করা (Master PIN)`))return;W.default.fire({title:`যোগ করা হচ্ছে...`,allowOutsideClick:!1,didOpen:()=>W.default.showLoading()});try{let t={name:n.trim(),status:`active`};e?await h.add(t):await f.add(t),S(`ADD_BANKING`,`Admin`,`BankingSystem`,`Added new ${q}: ${n.trim()}`),await Xr(),W.default.fire({title:`সফল!`,text:`${n} সফলভাবে যোগ করা হয়েছে।`,icon:`success`,customClass:{popup:`!bg-slate-900 !text-white !rounded-3xl border border-slate-700`}})}catch{W.default.fire(`Error`,`যোগ করতে সমস্যা হয়েছে।`,`error`)}}}async function $r(e,t,r){let i=r===`cash`,a=i?`ক্যাশ রিসিভার`:`ব্যাংক অ্যাকাউন্ট`,{value:o}=await W.default.fire({title:`${a} আপডেট (Global Rename)`,html:`
            <div class="text-left font-bn space-y-4">
                <div class="bg-amber-500/10 border border-amber-500/30 p-3 rounded-xl text-amber-200 text-xs">
                    <i class="fa-solid fa-triangle-exclamation mr-1.5"></i> <strong>সতর্কতা:</strong> আপনি যদি নাম পরিবর্তন করেন, তবে সিস্টেম আগের সবগুলো ট্রানজাকশন স্ক্যান করে যেখানে <strong>"${t}"</strong> ছিল, সব অটোমেটিক আপডেট করে নতুন নাম বসিয়ে দেবে। এতে কয়েক সেকেন্ড সময় লাগতে পারে।
                </div>
                <div>
                    <label class="block text-xs font-bold text-slate-400 mb-1">নতুন নাম লিখুন:</label>
                    <input id="rename-new-name" class="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white outline-none focus:border-amber-500" value="${t}">
                </div>
            </div>
        `,showCancelButton:!0,confirmButtonText:`আপডেট করুন`,cancelButtonText:`বাতিল`,customClass:{popup:`!bg-slate-900 !text-white !rounded-3xl border border-slate-700`},preConfirm:()=>{let e=document.getElementById(`rename-new-name`).value.trim();return e?e===t?W.default.showValidationMessage(`নাম পরিবর্তন করা হয়নি`):e:W.default.showValidationMessage(`নাম দেওয়া আবশ্যক`)}});if(o){if(!await O(`${a} রিনেম (Master PIN)`,`editBank`))return;W.default.fire({title:`গ্লোবাল রিনেম চলছে...`,html:`পুরনো ট্রানজাকশন স্ক্যান ও আপডেট করা হচ্ছে। দয়া করে অপেক্ষা করুন...`,allowOutsideClick:!1,didOpen:()=>W.default.showLoading()});try{i?await h.update(e,{name:o}):await f.update(e,{name:o});let r=0,s=i?`Cash`:`Bank`,l=await g.collection.where(`receivedType`,`==`,s).where(`receivedFrom`,`==`,t).get(),u=c.batch();l.forEach(e=>{u.update(e.ref,{receivedFrom:o,updatedAt:n.firestore.FieldValue.serverTimestamp()}),r++}),r>0&&await u.commit(),S(`GLOBAL_RENAME`,`Admin`,`BankingSystem`,`Renamed ${a} from ${t} to ${o}. Updated ${r} txns.`),await Xr(),W.default.fire({title:`সফল!`,html:`${t} পরিবর্তন করে <strong>${o}</strong> করা হয়েছে。<br><span class="text-xs text-amber-500">মোট ${r} টি ট্রানজাকশন অটোমেটিক আপডেট হয়েছে।</span>`,icon:`success`,customClass:{popup:`!bg-slate-900 !text-white !rounded-3xl border border-slate-700`}})}catch(e){console.error(e),W.default.fire(`ত্রুটি`,`আপডেট করতে সমস্যা হয়েছে।`,`error`)}}}async function ei(e,t,n){let r=n===`cash`,i=r?`ক্যাশ রিসিভার`:`ব্যাংক অ্যাকাউন্ট`;if(await O(`${i} ডিলেট/নিষ্ক্রিয় (Master PIN)`,`deleteBank`)&&(await W.default.fire({title:`নিশ্চিত করুন`,html:`<div class="font-bn">আপনি কি <strong>${t}</strong> নিষ্ক্রিয় (Archive) করতে চান?<br><span class="text-xs text-slate-400 mt-2 block">এটি করলে নতুন এন্ট্রির ড্রপডাউনে আর এই নাম দেখাবে না, তবে আগের রিপোর্টগুলো ঠিক থাকবে।</span></div>`,icon:`warning`,showCancelButton:!0,confirmButtonColor:`#ef4444`,confirmButtonText:`হ্যাঁ, নিষ্ক্রিয় করুন`,cancelButtonText:`বাতিল`,customClass:{popup:`!bg-slate-900 !text-white !rounded-3xl border border-slate-700`}})).isConfirmed){W.default.fire({title:`নিষ্ক্রিয় করা হচ্ছে...`,allowOutsideClick:!1,didOpen:()=>W.default.showLoading()});try{r?await h.update(e,{status:`inactive`}):await f.update(e,{status:`inactive`}),S(`DEACTIVATE_BANKING`,`Admin`,`BankingSystem`,`Deactivated ${i}: ${t}`),await Xr(),W.default.fire({title:`সফল!`,text:`সফলভাবে নিষ্ক্রিয় করা হয়েছে।`,icon:`success`,customClass:{popup:`!bg-slate-900 !text-white !rounded-3xl border border-slate-700`}})}catch{W.default.fire(`ত্রুটি`,`নিষ্ক্রিয় করতে সমস্যা হয়েছে।`,`error`)}}}async function ti(e,t,n){let r=n===`cash`,i=r?`ক্যাশ রিসিভার`:`ব্যাংক অ্যাকাউন্ট`;if(await O(`${i} পুনরায় চালু (Master PIN)`)){W.default.fire({title:`চালু করা হচ্ছে...`,allowOutsideClick:!1,didOpen:()=>W.default.showLoading()});try{r?await h.update(e,{status:`active`}):await f.update(e,{status:`active`}),S(`REACTIVATE_BANKING`,`Admin`,`BankingSystem`,`Reactivated ${i}: ${t}`),await Xr(),R(`সফলভাবে চালু করা হয়েছে`,`success`)}catch{W.default.fire(`ত্রুটি`,`চালু করতে সমস্যা হয়েছে।`,`error`)}}}function ni(e){if(window.AppState.currentUserRole!==`Admin`){e.innerHTML=`<div class="m3-card text-center font-bn"><h2 class="text-xl font-bold text-red-500">অ্যাক্সেস ডিনাইড! শুধুমাত্র অ্যাডমিন এই পেজ দেখতে পারবেন।</h2></div>`;return}e.innerHTML=`
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

                    <div class="group rounded-xl bg-slate-950/50 border border-slate-800/60 hover:border-pink-500/30 p-4 transition-all flex flex-col gap-3">
                        <div class="flex items-center gap-3">
                            <div class="w-9 h-9 rounded-xl bg-pink-500/10 border border-pink-500/20 flex items-center justify-center text-pink-400 shrink-0"><i class="fa-solid fa-building-columns text-sm"></i></div>
                            <div>
                                <h4 class="text-white font-bold text-sm">ব্যাংকিং ও ক্যাশ সিস্টেম</h4>
                                <p class="text-[10px] text-slate-500">ব্যাংক ও ক্যাশ অ্যাকাউন্ট যোগ, এডিট, রিনেম বা ডিলেট করুন।</p>
                            </div>
                        </div>
                        <button class="h-9 w-full rounded-xl bg-pink-600/15 border border-pink-500/25 hover:bg-pink-600 text-pink-400 hover:text-white text-xs font-bold transition-all cursor-pointer active:scale-95" onclick="appAdmin.showBankingSystemManager()">
                            <i class="fa-solid fa-money-check-dollar mr-1.5"></i>ব্যাংক ম্যানেজমেন্ট
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
    `,wr(),(async()=>{try{await(await b(()=>Promise.resolve().then(()=>kr),void 0)).checkBackupReminder()}catch(e){console.error(`Failed to load backup reminder:`,e)}})()}window.appAdmin={loadAdminUsers:wr,...Ir,...Ur,...Ar,...Gr};var J=[],ri=[],ii;function ai(){return J}function oi(e){J=e}function si(){return ri}function ci(){J.push({desc:``,qty:1,unit:`Pcs`,rate:0,total:0}),Y()}function li(e){J.splice(e,1),Y(),yi()}function ui(e,t,n){let r=n.value;if(t===`desc`)J[e].desc=r,r.length>=3&&di(e,r);else if(t===`unit`)J[e].unit=r;else{let n=Math.max(0,L(r));if(J[e][t]=n,t===`qty`||t===`rate`){let t=L(J[e].qty)*L(J[e].rate);J[e].total=t;let n=document.getElementById(`inv-item-total-${e}`);n&&(n.value=I(t));let r=document.getElementById(`item-live-words-${e}`);r&&(t>0?(r.innerHTML=`<i class="fa-solid fa-coins text-[9px] text-amber-400"></i> <span>${_(t)}</span>`,r.classList.remove(`hidden`)):r.classList.add(`hidden`))}}yi()}function di(e,t){let n=document.getElementById(`inv-customer-select`);if(!n||n.selectedIndex<=0)return;let r=n.value;clearTimeout(ii),ii=setTimeout(async()=>{try{let n=await g.collection.where(`customerId`,`==`,r).orderBy(`createdAt`,`desc`).limit(30).get(),i=null;n.forEach(e=>{let n=e.data();if(n.hasItems&&n.items&&!i){let e=n.items.find(e=>(e.desc||``).toLowerCase().trim()===t.toLowerCase().trim());e&&(i=e.rate)}});let a=document.getElementById(`price-hint-${e}`);a&&i&&(a.innerHTML=`<button type="button" onclick="window.applyHistoryPrice(${e}, ${i})" class="text-[10px] bg-blue-500/20 text-blue-300 border border-blue-500/40 px-2 py-0.5 rounded-md font-bold hover:bg-blue-600 hover:text-white transition-all cursor-pointer">আগের রেট: ৳${I(i)}</button>`,a.classList.remove(`hidden`))}catch(e){console.error(`Price hint error:`,e)}},400)}function fi(e,t){J[e].rate=t,J[e].total=J[e].qty*t,Y(),yi()}function pi(e){let t=document.getElementById(`inv-paid`),n=document.getElementById(`inv-net-total-display`)?.innerText||`0`,r=L(n.replace(/[^0-9.]/g,``)),i=e;e===`exact`&&(i=r),t&&(t.value=i,window.calcInvoiceTotals(),window.toggleInvoiceRecvSection()),vi(i,r)}function mi(){let e=document.getElementById(`inv-customer-select`),t=e&&e.selectedIndex>0?e.options[e.selectedIndex].dataset.name:`Unknown`;if(J.length===0||J.length===1&&!J[0].desc&&!J[0].total)return W.default.fire(`Error`,`হোল্ড করার মত কোনো আইটেম নেই`,`error`);ri.push({id:Date.now(),time:new Date().toLocaleTimeString([],{hour:`2-digit`,minute:`2-digit`}),customerName:t,customerId:e?e.value:``,items:JSON.parse(JSON.stringify(J)),notes:document.getElementById(`inv-notes`)?.value||``}),W.default.fire({toast:!0,position:`top-end`,icon:`success`,title:`বিল হোল্ড করা হয়েছে (${t})`,showConfirmButton:!1,timer:2e3,customClass:{popup:`!bg-slate-900 !text-white border border-slate-700`}}),oi([{desc:``,qty:1,unit:`Pcs`,rate:0,total:0}]),document.getElementById(`inv-notes`).value=``,Y(),yi()}function hi(e){if(!ri[e])return;let t=ri[e];oi(t.items),document.getElementById(`inv-notes`)&&(document.getElementById(`inv-notes`).value=t.notes),document.getElementById(`inv-customer-select`)&&t.customerId&&(document.getElementById(`inv-customer-select`).value=t.customerId,window.invoiceCustomerChanged()),ri.splice(e,1),Y(),yi(),W.default.fire({toast:!0,position:`top-end`,icon:`info`,title:`হোল্ড বিল রিজিউম করা হয়েছে`,showConfirmButton:!1,timer:2e3,customClass:{popup:`!bg-slate-900 !text-white border border-slate-700`}})}async function gi(e){let t=document.querySelectorAll(`button[onclick*="saveAndPrintInvoice"]`);try{let r=document.getElementById(`inv-customer-select`);if(!r||r.selectedIndex<=0)return W.default.fire(`এরর`,`কাস্টমার সিলেক্ট করুন!`,`error`);let i=r.value,a=r.options[r.selectedIndex],o=a.dataset.name,s=a.dataset.phone,u=z(document.getElementById(`inv-date`).value),d=document.getElementById(`inv-voucher`).value,f=document.getElementById(`inv-notes`).value,p=L(document.getElementById(`inv-subtotal`).value),m=L(document.getElementById(`inv-discount`).value),h=document.getElementById(`inv-disc-mode-btn`)?.dataset.mode||`fixed`,_=L(document.getElementById(`inv-paid`).value),v=h===`percent`?B(p*m/100):m,y=B(Math.max(0,p-v));if(y===0&&_===0)throw Error(`বিল বা জমা এন্ট্রি দিন`);if(!(await W.default.fire({title:`<div class="flex items-center justify-center gap-2 font-bn font-black text-xl text-white"><i class="fa-solid fa-file-invoice text-blue-400"></i><span>ইনভয়েস যাচাই করুন</span></div>`,html:`
                <div class="text-left font-bn p-3.5 bg-slate-900/90 rounded-2xl border border-slate-800 space-y-2.5 shadow-inner">
                    <div class="flex justify-between items-center border-b border-slate-800/80 pb-2"><span class="text-xs text-slate-400 font-bold">কাস্টমার:</span><strong class="text-sm text-white font-black">${o}</strong></div>
                    <div class="flex justify-between items-center border-b border-slate-800/80 pb-2"><span class="text-xs text-slate-400 font-bold">মোট বিল:</span><strong class="text-base text-blue-400 font-black font-mono">৳ ${I(y)}</strong></div>
                    <div class="flex justify-between items-center"><span class="text-xs text-slate-400 font-bold">আদায় (Paid):</span><strong class="text-base text-emerald-400 font-black font-mono">৳ ${I(_)}</strong></div>
                </div>`,showCancelButton:!0,confirmButtonText:`<i class="fa-solid fa-print mr-2"></i>সেভ ও প্রিন্ট করুন`,cancelButtonText:`<i class="fa-solid fa-pen-to-square mr-2"></i>সংশোধন করব`,customClass:{popup:`!bg-slate-950 !text-white !rounded-3xl border border-slate-800 shadow-2xl font-bn`,confirmButton:`m3-btn-primary !bg-blue-600 hover:!bg-blue-500 !px-7 !py-2.5 !rounded-xl font-bold shadow-lg shadow-blue-600/30`,cancelButton:`m3-btn-tonal !bg-slate-800 hover:!bg-slate-700 !text-slate-300 !px-5 !py-2.5 !rounded-xl font-bold border border-slate-700`}})).isConfirmed)return;t.forEach(e=>e.disabled=!0),W.default.fire({title:`সেভ হচ্ছে...`,didOpen:()=>W.default.showLoading(),allowOutsideClick:!1});let b=c.batch(),x=g.getRef(),C=J.filter(e=>e.desc&&e.desc.trim()!==``||e.total>0),w=await l.getById(i)||{},T=Number(w.totalDue)||0,E=B(T+(y-_)),ee={customerId:i,customerName:o,date:u,voucherNo:d,notes:f,bill:y,paid:_,subtotal:p,discount:v,discountInput:m,discountMode:h,prevDue:T,currentDue:E,hasItems:C.length>0,createdBy:window.AppState?.currentUserEmail||`Unknown`,createdAt:n.firestore.FieldValue.serverTimestamp()};C.length>0&&(ee.items=C.map(e=>({...e}))),b.set(x,ee),b.update(l.getRef(i),{totalDue:n.firestore.FieldValue.increment(B(y-_))}),await b.commit(),S(`CREATE`,`Invoice`,x.id,o,{bill:y,paid:_}),s&&(await W.default.fire({title:`সফল!`,text:`কাস্টমারকে হোয়াটসঅ্যাপে ডিজিটাল ইনভয়েস পাঠাবেন?`,icon:`success`,showCancelButton:!0,confirmButtonText:`<i class="fa-brands fa-whatsapp mr-1.5"></i> হোয়াটসঅ্যাপ মেসেজ`,cancelButtonText:`প্রিন্ট এ যাব`,confirmButtonColor:`#25D366`})).isConfirmed&&(()=>{let e=I(Math.abs(E)),t=E<0?`অ্যাডভান্স জমা: ৳ ${e}`:`বর্তমান মোট বকেয়া: ৳ ${e}`,n=`${window.location.origin}${window.location.pathname}?view=public-memo&id=${x.id}`,r=`আসসালামু আলাইকুম ${o},\nমেসার্স মা মোটরস্ থেকে আপনার মেমো সেভ হয়েছে।\n\nআজকের বিল: ৳ ${I(y)}\nআজকের জমা: ৳ ${I(_)}\n---------------------------------\n${t}\n\nআপনার ডিজিটাল মেমোর PDF দেখতে নিচের লিংকে ক্লিক করুন:\n${n}\n\nধন্যবাদ! — মেসার্স মা মোটরস্`;window.sendWhatsApp(s,r)})(),window.printReceiptEngine&&await window.printReceiptEngine(x.id,e),document.getElementById(`inv-subtotal`).value=``,document.getElementById(`inv-discount`).value=``,document.getElementById(`inv-paid`).value=``,document.getElementById(`inv-voucher`).value=``,document.getElementById(`inv-notes`).value=``,oi([{desc:``,qty:1,unit:`Pcs`,rate:0,total:0}]),ki(document.getElementById(`view-container`))}catch(e){handleError(e,`ইনভয়েস সেভ করা যায়নি`)}finally{t.forEach(e=>e.disabled=!1)}}function _i(e,t=null,n={}){if(window.AppState?.currentUserRole===`Staff`&&window.AppState?.permissions?.viewInvoice===!1){e.innerHTML=`<div class="m3-card text-center font-bn py-12"><h2 class="text-xl font-black text-red-500">অ্যাক্সেস ডিনাইড!</h2></div>`;return}let r=si();e.innerHTML=`
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
    `,document.getElementById(`inv-date`).value=F(),oi([{desc:``,qty:1,unit:`Pcs`,rate:0,total:0}]),n.loadInvoiceCustomers&&n.loadInvoiceCustomers(t?.customerId),n.renderInvoiceItems&&n.renderInvoiceItems()}function Y(){let e=document.getElementById(`inv-items-tbody`),t=ai();if(e){if(t.length===0){e.innerHTML=`<tr><td colspan="7" class="text-center py-6 text-slate-500 italic font-bold">কোনো আইটেম নেই</td></tr>`;return}e.innerHTML=t.map((e,t)=>`
        <tr class="border-b border-slate-800/60 hover:bg-white/[0.02] transition-colors">
            <td class="w-10 text-center text-slate-400 font-bold text-xs py-2.5 px-2">${t+1}</td>
            <td class="py-2.5 px-2">
                <input type="text" class="w-full bg-slate-950/90 border border-slate-700/70 rounded-xl px-3.5 h-10 text-xs text-white font-bold outline-none focus:border-blue-500 transition-all shadow-inner" placeholder="আইটেমের নাম / বিবরণ লিখুন..." value="${e.desc}" oninput="window.updateInvoiceItem(${t}, 'desc', this)">
                <div id="price-hint-${t}" class="hidden mt-1"></div>
                <div id="item-live-words-${t}" class="${e.total>0?``:`hidden`} text-[10px] text-blue-400 font-bold italic mt-1 flex items-center gap-1"><i class="fa-solid fa-coins text-[9px] text-amber-400"></i><span>${e.total>0?_(e.total):``}</span></div>
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
                <input type="text" id="inv-item-rate-${t}" class="w-full text-center bg-slate-950/90 border border-slate-700/70 rounded-xl px-2 h-10 text-xs text-white font-bold outline-none focus:border-blue-500 transition-all shadow-inner" value="${e.rate?I(e.rate):``}" placeholder="০" onkeyup="window.handleNumberInput(this); window.updateInvoiceItem(${t}, 'rate', this);" onkeydown="if(event.key==='Enter'){ event.preventDefault(); window.addInvoiceItemRow(); }">
            </td>
            <td class="w-40 py-2.5 px-2">
                <input type="text" id="inv-item-total-${t}" class="w-full text-right font-black text-blue-400 bg-slate-950/60 border border-slate-800 rounded-xl px-3 h-10 text-xs outline-none shadow-inner" value="${e.total?I(e.total):``}" placeholder="০" readonly>
            </td>
            <td class="w-12 text-center py-2.5 px-1">
                <button type="button" class="w-8 h-8 rounded-xl bg-slate-900 border border-slate-800 hover:bg-red-500/20 text-slate-500 hover:text-red-400 flex items-center justify-center transition-all cursor-pointer mx-auto" onclick="window.removeInvoiceItem(${t})" title="লাইন ডিলিট"><i class="fa-solid fa-trash-can text-xs"></i></button>
            </td>
        </tr>`).join(``)}}function vi(e,t){let n=document.getElementById(`inv-change-return-box`),r=document.getElementById(`inv-change-return-display`);if(!(!n||!r))if(e>t&&t>0){let i=e-t;r.innerText=`৳ ${I(i)}`,n.classList.remove(`hidden`)}else n.classList.add(`hidden`)}function yi(){let e=0;ai().forEach(t=>{e+=t.total||0});let t=document.getElementById(`inv-subtotal`);t&&(t.value=I(e),bi())}function bi(){let e=L(document.getElementById(`inv-subtotal`)?.value||`0`),t=L(document.getElementById(`inv-discount`)?.value||`0`),n=L(document.getElementById(`inv-prev-due`)?.value||`0`),r=L(document.getElementById(`inv-paid`)?.value||`0`),i=(document.getElementById(`inv-disc-mode-btn`)?.dataset.mode||`fixed`)===`percent`?B(e*t/100):t,a=B(Math.max(0,e-i)+n),o=B(a-r),s=(e,t)=>{let n=document.getElementById(e);n&&(t>0?(n.innerText=`(${_(t)})`,n.classList.remove(`hidden`)):n.classList.add(`hidden`))};s(`inv-sub-words`,e),s(`inv-disc-words`,i),s(`inv-net-words`,a),s(`inv-paid-words`,r),s(`inv-due-words`,Math.abs(o));let c=document.getElementById(`inv-net-total-display`);c&&(c.innerText=`৳ `+I(a));let l=document.getElementById(`inv-current-due-display`);l&&(l.innerText=`৳ `+I(Math.abs(o))+(o<0?` (Adv)`:``),l.className=o>0?`text-xl font-black text-red-400`:o<0?`text-xl font-black text-emerald-400`:`text-xl font-black text-slate-300`),vi(r,a)}async function xi(e=null){let t=A();t.length||(w(),t=await l.getAll(`name`,`asc`));let n=document.getElementById(`inv-customer-select`);n&&(n.innerHTML=`<option value="">-- সিলেক্ট করুন --</option>`+t.map(e=>{let t=e.accountNo?`[${e.accountNo}] `:``;return`<option value="${e.id}" data-due="${e.totalDue||0}" data-phone="${e.phone||``}" data-address="${e.address||``}" data-name="${e.name}" data-acc="${e.accountNo||``}">${t}${e.name}</option>`}).join(``),e&&Ci(e))}function Si(e=``){mt(e,{inputId:`inv-cust-search-input`,selectId:`inv-customer-select`,dropdownId:`inv-cust-dropdown`,onSelect:e=>Ci(e)})}function Ci(e){let t=document.getElementById(`inv-customer-select`),n=document.getElementById(`inv-cust-search-input`),r=document.getElementById(`inv-cust-search-clear`),i=document.getElementById(`inv-cust-dropdown`);if(t&&(t.value=e,Ti()),t&&t.selectedIndex>0){let e=t.options[t.selectedIndex];n&&(n.value=`${e.dataset.name} ${e.dataset.acc?`[`+e.dataset.acc+`]`:``}`),r&&r.classList.remove(`hidden`)}i&&i.classList.add(`hidden`)}function wi(){let e=document.getElementById(`inv-customer-select`),t=document.getElementById(`inv-cust-search-input`),n=document.getElementById(`inv-cust-search-clear`),r=document.getElementById(`inv-cust-dropdown`);e&&(e.value=``,Ti()),t&&(t.value=``),n&&n.classList.add(`hidden`),r&&r.classList.add(`hidden`)}function Ti(){let e=document.getElementById(`inv-customer-select`),t=document.getElementById(`inv-cust-display`),n=document.getElementById(`inv-prev-due`);if(e&&e.selectedIndex>0){let r=e.options[e.selectedIndex],i=Number(r.dataset.due)||0,a=i>0?`<span class="text-red-400 font-black">বকেয়া: ৳${I(i)}</span>`:`<span class="text-emerald-400 font-bold">পরিশোধিত</span>`;t.innerHTML=`
            <div class="flex justify-between items-center"><div class="font-black text-white">${r.dataset.name} <span class="text-blue-400 text-[11px] font-bold">(${r.dataset.acc||`-`})</span></div>${a}</div>
            <div class="text-[11px] text-slate-400 font-bold mt-0.5"><i class="fa-solid fa-phone text-[9px] mr-1"></i>${r.dataset.phone||`-`} • ${r.dataset.address||`-`}</div>`,n.value=I(i)}else t.innerText=`সিলেক্ট করা হয়নি`,n&&(n.value=``);bi()}function Ei(){let e=document.getElementById(`inv-disc-mode-btn`);e&&(e.dataset.mode=e.dataset.mode===`fixed`?`percent`:`fixed`,e.innerText=e.dataset.mode===`fixed`?`৳`:`%`,bi())}function Di(){let e=L(document.getElementById(`inv-paid`)?.value||`0`);document.getElementById(`inv-recv-section`)?.classList.toggle(`hidden`,e<=0)}function Oi(e){let t=document.getElementById(`inv-recv-bank-btn`),n=document.getElementById(`inv-recv-cash-btn`);t&&n&&(e===`Bank`?(t.className=`px-3 py-1 rounded-md bg-blue-600 text-white font-bold`,n.className=`px-3 py-1 rounded-md text-slate-400 font-bold`):(n.className=`px-3 py-1 rounded-md bg-emerald-600 text-white font-bold`,t.className=`px-3 py-1 rounded-md text-slate-400 font-bold`))}function ki(e,t=null){_i(e,t,{loadInvoiceCustomers:xi,renderInvoiceItems:Y})}typeof window<`u`&&(window.renderInvoiceItems=Y,window.calcItemTotals=yi,window.calcInvoiceTotals=bi,window.loadInvoiceCustomers=xi,window.filterInvoiceCustomerSearch=Si,window.selectInvoiceCustomer=Ci,window.clearInvoiceCustomerSearch=wi,window.invoiceCustomerChanged=Ti,window.toggleInvoiceDiscMode=Ei,window.toggleInvoiceRecvSection=Di,window.setInvoiceRecvType=Oi),document.addEventListener(`click`,e=>{let t=document.getElementById(`inv-cust-dropdown`),n=document.getElementById(`inv-cust-search-input`);t&&!t.contains(e.target)&&e.target!==n&&t.classList.add(`hidden`)}),window.addInvoiceItemRow=ci,window.removeInvoiceItem=li,window.updateInvoiceItem=ui,window.applyHistoryPrice=fi,window.saveAndPrintInvoice=gi,window.setInvoiceTender=pi,window.holdCurrentBill=mi,window.resumeHoldBill=hi,window.invoiceCustomerChanged=Ti,window.toggleInvoiceDiscMode=Ei,window.toggleInvoiceRecvSection=Di,window.setInvoiceRecvType=Oi,window.quickAddCustomerFromInvoice=async()=>{window.quickAddCustomer&&(await window.quickAddCustomer(),await xi())};var X={zones:[],customers:[],selectedZone:``,selectedStatus:`all`,selectedSort:`due_desc`};function Ai(){return X}function ji(e){X.selectedZone=e}function Mi(e){X.selectedStatus=e}function Ni(e){X.selectedSort=e}async function Pi(){try{let[e,t]=await Promise.all([u.getAllZones(),l.getAll(`name`,`asc`)]);return X.zones=e||[],X.customers=t||[],X}catch(e){return console.error(`Error loading zone report data:`,e),X}}async function Fi(e=``){let{customers:t}=X,n=e||X.selectedZone,r=t.filter(e=>!n||(e.zone||``).trim()===n);if(r.length===0)return W.default.fire(`তালিকায় কোনো কাস্টমার নেই`,`সিলেক্ট করা জোনে কোনো কাস্টমার পাওয়া যায়নি।`,`warning`);r.sort((e,t)=>(e.accountNo||``).localeCompare(t.accountNo||``,void 0,{numeric:!0}));let i=await p.getAppSettings(),a=n?`${n} জোনের কাস্টমার বকেয়া খতিয়ান`:`সকল জোনের কাস্টমার বকেয়া খতিয়ান`,o=0;r.forEach(e=>o=safeRound(o+(Number(e.totalDue)||0)));let[s,c,l]=F().split(`-`),u=`${l}/${c}/${s}`,d=pe(i,{title:n?`${n} ZONE REPORT`:`ZONE REPORT`,subtitle:`${a} • ${u}`}),f=`
        <div style="display:flex; justify-content:space-between; align-items:flex-end; border-bottom:2px solid #0284c7; padding-bottom:4px; margin-bottom:8px;">
            <div style="font-size:14px; font-weight:900; color:#0f172a; font-family:'Inter',sans-serif;">ZONE REPORT <span style="font-size:10px; color:#475569; font-weight:normal;">(Continued)</span></div>
            <div style="font-size:10px; color:#475569; font-family:'Hind Siliguri',sans-serif;">${a} • ${u}</div>
        </div>
    `,m=r.map((e,t)=>{let n=t%2==0?`background: #ffffff;`:`background: #f8fafc;`,r=Number(e.totalDue)||0,i=r>0?`#dc2626`:r<0?`#059669`:`#64748b`,a=r===0?`৳ 0`:`৳ ${I(Math.abs(r))} ${r<0?`(Adv)`:``}`,o=e.zone?`<span style="background: #f1f5f9; border: 1px solid #cbd5e1; padding: 2px 7px; border-radius: 10px; font-size: 10px; font-weight: 700; color: #334155; display: inline-block;">${H(e.zone)}</span>`:`-`;return{html:`
            <tr class="print-row-no-break" style="${n}">
                <td style="text-align:center; vertical-align:middle; border: 1px solid #e2e8f0; padding: 5px 4px; font-size: 11px; font-family: 'Inter', sans-serif; color: #475569;">${t+1}</td>
                <td style="text-align:center; vertical-align:middle; border: 1px solid #e2e8f0; padding: 5px 4px; font-size: 11px; font-weight: 800; font-family: 'Inter', monospace; color: #0284c7;">${H(e.accountNo||`-`)}</td>
                <td style="text-align:left; vertical-align:middle; border: 1px solid #e2e8f0; padding: 5px 6px; font-size: 11px; font-family: 'Kalpurush', 'Hind Siliguri', sans-serif; line-height: 1.25; color: #0f172a;"><strong>${H(e.name)}</strong></td>
                <td style="text-align:left; vertical-align:middle; border: 1px solid #e2e8f0; padding: 5px 6px; font-size: 10.5px; font-family: 'Kalpurush', 'Hind Siliguri', sans-serif; line-height: 1.25; color: #334155;">${H(e.address||`-`)}</td>
                <td style="text-align:center; vertical-align:middle; border: 1px solid #e2e8f0; padding: 5px 4px; font-size: 11px; font-family: 'Inter', sans-serif; white-space: nowrap; color: #334155;">${H(e.phone||`-`)}</td>
                <td style="text-align:center; vertical-align:middle; border: 1px solid #e2e8f0; padding: 5px 4px; font-size: 11px; font-family: 'Kalpurush', 'Hind Siliguri', sans-serif;">${o}</td>
                <td style="text-align:right; vertical-align:middle; border: 1px solid #e2e8f0; padding: 5px 6px; font-size: 11px; font-weight: 900; color: ${i}; font-family: 'Inter', sans-serif; white-space: nowrap;">${a}</td>
            </tr>
        `,textLength:(e.address||``).length}}),h=`
        <div style="display: flex; justify-content: flex-end; margin-top: 16px; page-break-inside: avoid; break-inside: avoid;">
            <div style="min-width: 240px; background: #f8fafc; border: 1px solid #cbd5e1; border-radius: 10px; padding: 12px; font-family: 'Hind Siliguri', sans-serif; box-shadow: 0 1px 3px rgba(0,0,0,0.05);">
                <div style="display: flex; justify-content: space-between; font-size: 12px; margin-bottom: 6px; border-bottom: 1px dashed #cbd5e1; padding-bottom: 4px;">
                    <span style="color: #64748b; font-weight: 700;">মোট কাস্টমার:</span>
                    <strong style="color: #0f172a; font-weight: 900;">${r.length} জন</strong>
                </div>
                <div style="display: flex; justify-content: space-between; font-size: 12px;">
                    <span style="color: #64748b; font-weight: 700;">মার্কেটে মোট বকেয়া:</span>
                    <strong style="color: #dc2626; font-size: 15px; font-weight: 900;">৳ ${I(o)}</strong>
                </div>
            </div>
        </div>
    `,g=await ve({rowsArray:m,page1HeaderHtml:d,repeatHeaderHtml:f,tableColHeaderHtml:`
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
    `,summaryHtml:h,signatureHtml:`
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
    `,formattedDate:u});ye(g)}async function Ii(e=``){let{customers:t}=X,n=e||X.selectedZone,r=t.filter(e=>!n||(e.zone||``).trim()===n);if(r.length===0)return W.default.fire(`এরর`,`এক্সপোর্ট করার মতো কোনো কাস্টমার নেই।`,`warning`);if(typeof XLSX>`u`)return W.default.fire(`Error`,`SheetJS Library missing!`,`error`);r.sort((e,t)=>(e.accountNo||``).localeCompare(t.accountNo||``,void 0,{numeric:!0}));let i=r.map((e,t)=>({SL:t+1,"Account No":e.accountNo||``,"Customer Name":e.name||``,"Phone Number":e.phone||``,Zone:e.zone||``,Address:e.address||``,"Due Balance (BDT)":e.totalDue||0})),a=XLSX.utils.json_to_sheet(i),o=XLSX.utils.book_new(),s=n?`${n} Zone`:`All Zones`;XLSX.utils.book_append_sheet(o,a,s);let c=n?`MAA_ERP_Zone_${n}_${F()}.xlsx`:`MAA_ERP_All_Zones_${F()}.xlsx`;XLSX.writeFile(o,c),W.default.fire({title:`<i class="fa-solid fa-file-excel text-emerald-400 mr-2"></i>ডাউনলোড সফল!`,text:`কাস্টমার জোন রিপোর্ট ফাইল (${c}) ডাউনলোড করা হয়েছে।`,icon:`success`,customClass:{popup:`!bg-slate-900 !text-white !rounded-3xl border border-slate-700 font-bn`}})}async function Li(e=``){let{printZoneTagadaReport:t}=await b(async()=>{let{printZoneTagadaReport:e}=await import(`./zone-report-tagada-D9EKJdFQ.js`);return{printZoneTagadaReport:e}},__vite__mapDeps([12,1,2,3,4,5,10,6,7,8,11]));return t(e?{...X,selectedZone:e}:X)}function Ri(e){return!e||e.length===0?`<tr><td colspan="8" class="text-center py-12 text-slate-500 font-bold italic">কোনো কাস্টমার ডাটা পাওয়া যায়নি</td></tr>`:e.map((e,t)=>`
        <tr class="hover:bg-slate-800/40 transition-colors">
            <td class="p-3.5 text-center font-mono text-slate-400">${t+1}</td>
            <td class="p-3.5 text-center font-mono font-bold text-amber-400">${H(e.accountNo||`-`)}</td>
            <td class="p-3.5 font-bold text-white">${H(e.name)}</td>
            <td class="p-3.5 text-slate-300 text-xs">${H(e.address||`-`)}</td>
            <td class="p-3.5 text-center font-mono text-slate-300">${H(e.phone||`-`)}</td>
            <td class="p-3.5 text-center"><span class="px-2.5 py-1 rounded-md text-[11px] font-bold bg-slate-800 text-indigo-300 border border-slate-700">${H(e.zone||`N/A`)}</span></td>
            <td class="p-3.5 text-right font-black ${e.totalDue>0?`text-emerald-400`:e.totalDue<0?`text-rose-400`:`text-slate-400`}">৳ ${I(e.totalDue||0)}</td>
            <td class="p-3.5 text-center">
                <button onclick="if(window.navigateTo) window.navigateTo('ledger', { customerId: '${e.id}' })" class="px-3 py-1.5 rounded-lg bg-indigo-600/20 hover:bg-indigo-600 text-indigo-300 hover:text-white text-xs font-bold transition-all border border-indigo-500/30 cursor-pointer">লেজার</button>
            </td>
        </tr>
    `).join(``)}async function zi(e){e.innerHTML=`
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
    `,await Bi()}async function Bi(){let e=await Pi();Vi(e.zones,e.customers),Hi()}function Vi(e,t){let n=document.getElementById(`zr-zone-pills-container`),r=document.getElementById(`zr-kpi-total-zones`);if(r&&(r.innerText=e.length),!n)return;let i=Ai().selectedZone||``,a=`
        <button onclick="window.zoneReportApp.selectZone('')" class="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap active:scale-95 ${i?`bg-slate-950 hover:bg-slate-800 text-slate-300 border border-slate-800`:`bg-gradient-to-r from-indigo-600 to-cyan-600 text-white shadow-lg shadow-indigo-500/20`}">
            <i class="fa-solid fa-border-all text-xs"></i>
            <span>সকল জোন (All Zones)</span>
            <span class="px-2 py-0.5 rounded-full text-[10px] font-black ${i?`bg-slate-800 text-slate-400`:`bg-black/30 text-white`}">${t.length}</span>
        </button>
    `;e.forEach(e=>{let n=t.filter(t=>(t.zone||``).trim()===e.name).length,r=i===e.name;a+=`
            <button onclick="window.zoneReportApp.selectZone('${H(e.name)}')" class="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap active:scale-95 ${r?`bg-gradient-to-r from-indigo-600 to-cyan-600 text-white shadow-lg shadow-indigo-500/20`:`bg-slate-950 hover:bg-slate-800 text-slate-300 border border-slate-800`}">
                <i class="fa-solid fa-location-dot text-xs ${r?`text-white`:`text-indigo-400`}"></i>
                <span>${H(e.name)}</span>
                <span class="px-2 py-0.5 rounded-full text-[10px] font-black ${r?`bg-black/30 text-white`:`bg-slate-800 text-slate-400`}">${n}</span>
            </button>
        `}),n.innerHTML=a}function Hi(){let e=Ai(),t=document.getElementById(`zr-search-input`)?.value.trim().toLowerCase()||``,n=e.selectedStatus||`all`,r=e.selectedSort||`due_desc`,i=e.selectedZone||``,a=e.customers.filter(e=>{let r=!i||(e.zone||``).trim()===i,a=!t||(e.name||``).toLowerCase().includes(t)||(e.accountNo||``).toLowerCase().includes(t)||(e.phone||``).includes(t)||(e.address||``).toLowerCase().includes(t),o=Number(e.totalDue)||0,s=!0;return n===`due`?s=o>0:n===`zero`?s=o===0:n===`advance`&&(s=o<0),r&&a&&s});a.sort((e,t)=>r===`due_desc`?(Number(t.totalDue)||0)-(Number(e.totalDue)||0):r===`acc_asc`?(e.accountNo||``).localeCompare(t.accountNo||``,void 0,{numeric:!0}):r===`name_asc`?(e.name||``).localeCompare(t.name||``):0);let o=0;a.forEach(e=>o=safeRound(o+(Number(e.totalDue)||0)));let s=document.getElementById(`zr-kpi-total-custs`),c=document.getElementById(`zr-kpi-total-due`),l=document.getElementById(`zr-table-header-title`),u=document.getElementById(`zr-table-count-badge`);s&&(s.innerText=`${a.length} জন`),c&&(c.innerText=`৳ ${I(o)}`),u&&(u.innerText=`${a.length} জন কাস্টমার`),l&&(l.innerHTML=`<i class="fa-solid fa-list-check text-indigo-400"></i> ${i?`${i} জোনের কাস্টমার তালিকা`:`সকল জোনের কাস্টমার তালিকা`}`);let d=document.getElementById(`zr-table-body`);d&&(d.innerHTML=Ri(a))}window.zoneReportApp={selectZone:e=>{ji(e);let t=Ai();Vi(t.zones,t.customers),Hi()},setStatusFilter:e=>{Mi(e),Hi()},setSortBy:e=>{Ni(e),Hi()},refreshData:()=>Bi(),renderFilteredTable:()=>Hi(),printPDF:()=>Fi(),printTagada:()=>Li(),exportExcel:()=>Ii()};var Ui=!1;function Wi(e){let t=e.target;setTimeout(()=>{document.activeElement===t&&t.setSelectionRange(0,2)},10)}function Gi(e){let t=e.target,n=t.selectionStart;setTimeout(()=>{n<=2?t.setSelectionRange(0,2):n>=3&&n<=5?t.setSelectionRange(3,5):n>=6&&t.setSelectionRange(6,10)},10)}function Ki(e){let t=e.target,n=e.key;if(e.altKey&&n===`ArrowDown`){t._parentOriginalInput?._flatpickr&&t._parentOriginalInput._flatpickr.toggle();return}if(![`Tab`,`Enter`,`ArrowLeft`,`ArrowRight`,`Home`,`End`,`Control`,`Meta`,`Alt`].includes(n)){if(n===`/`){e.preventDefault();let n=t.selectionStart;n<3?t.setSelectionRange(3,5):n<6&&t.setSelectionRange(6,10);return}!/^[0-9]$/.test(n)&&n!==`Backspace`&&n!==`Delete`&&e.preventDefault()}}function qi(e){let t=e.target;if(e.inputType&&e.inputType.includes(`delete`))return;let n=t.value,r=t.selectionStart,i=n.substring(0,2).replace(/\D/g,``),a=n.substring(3,5).replace(/\D/g,``),o=n.substring(6,10).replace(/\D/g,``);i.length===2&&!isNaN(parseInt(i,10))&&parseInt(i,10)>31&&(i=`31`),a.length===2&&!isNaN(parseInt(a,10))&&parseInt(a,10)>12&&(a=`12`);let s=i;if((n.length>2||r>2)&&(s+=`/`+a,(n.length>5||r>5)&&(s+=`/`+o)),n!==s){t.value=s;let e=r;(r===2||r===5)&&s.length>r&&e++,t.setSelectionRange(e,e)}if(i.length===2&&a.length===2&&o.length===4){let e=`${o}-${a}-${i}`;if(!isNaN(new Date(e).getTime())&&t._parentOriginalInput){let n=t._parentOriginalInput;n.value=e,n._flatpickr&&n._flatpickr.setDate(e,!1),n.dispatchEvent(new Event(`change`,{bubbles:!0}))}}}function Ji(){document.querySelectorAll(`input.datepicker`).forEach(e=>{if(e._flatpickr){e.value&&e._flatpickr.setDate(e.value,!1);return}let t=e.value;if(t&&/^\d{2}\/\d{2}\/\d{4}$/.test(t)){let[n,r,i]=t.split(`/`);t=`${i}-${r}-${n}`,e.value=t}if(_e(e,{mode:e.dataset.mode||`single`,dateFormat:`Y-m-d`,altInput:!0,altFormat:e.dataset.mode===`range`?`d/m/Y to d/m/Y`:`d/m/Y`,allowInput:!0,clickOpens:!1,disableMobile:!0,onReady:(t,n,r)=>{if(r.altInput){let t=r.altInput;t.className=e.className+` flatpickr-alt-input`,t.classList.remove(`datepicker`),t.placeholder=e.placeholder||`DD/MM/YYYY`,t._parentOriginalInput=e,t.style.cursor=`text`,t.addEventListener(`focus`,Wi),t.addEventListener(`click`,Gi),t.addEventListener(`input`,qi),t.addEventListener(`keydown`,Ki),e.style.setProperty(`display`,`none`,`important`),e.tabIndex=-1;let n=t.parentElement;if(!n||!n.classList.contains(`date-input-container`)){let e=document.createElement(`div`);e.className=`relative inline-flex items-center w-full date-input-container`,t.parentNode.insertBefore(e,t),e.appendChild(t),n=e}let i=n.querySelector(`.date-picker-icon-btn`);i&&i.remove();let a=document.createElement(`button`);a.type=`button`,a.tabIndex=-1,a.className=`date-picker-icon-btn absolute right-2.5 top-1/2 -translate-y-1/2 text-blue-400 hover:text-blue-300 transition-colors p-1 cursor-pointer flex items-center justify-center border-0 bg-transparent outline-none z-10`,a.title=`ক্যালেন্ডার খুলুন`,a.innerHTML=`<i class="fa-solid fa-calendar-days text-xs pointer-events-none"></i>`,a.addEventListener(`click`,e=>{e.preventDefault(),e.stopPropagation(),r.toggle()}),n.appendChild(a)}if(r.calendarContainer&&!r.calendarContainer.querySelector(`.fp-action-footer`)){let t=document.createElement(`div`);t.className=`fp-action-footer`,t.innerHTML=`
                        <button type="button" class="fp-btn-today"><i class="fa-solid fa-calendar-day"></i> আজকে</button>
                        <button type="button" class="fp-btn-yesterday"><i class="fa-solid fa-clock-rotate-left"></i> গতকাল</button>
                        <button type="button" class="fp-btn-clear"><i class="fa-solid fa-eraser"></i> ক্লিয়ার</button>
                    `,t.querySelector(`.fp-btn-today`).onclick=()=>{let e=new Date().toISOString().split(`T`)[0];r.setDate(e,!0),r.close()},t.querySelector(`.fp-btn-yesterday`).onclick=()=>{let e=new Date;e.setDate(e.getDate()-1);let t=e.toISOString().split(`T`)[0];r.setDate(t,!0),r.close()},t.querySelector(`.fp-btn-clear`).onclick=()=>{r.clear(),e.value=``,e.dispatchEvent(new Event(`change`,{bubbles:!0})),r.close()},r.calendarContainer.appendChild(t)}},onChange:(t,n,r)=>{Ui=!0,e.value=n,Ui=!1,e.dispatchEvent(new Event(`change`,{bubbles:!0})),e.dispatchEvent(new Event(`input`,{bubbles:!0})),r.close()}}),!e._valueIntercepted){e._valueIntercepted=!0;let t=Object.getOwnPropertyDescriptor(HTMLInputElement.prototype,`value`);Object.defineProperty(e,"value",{get(){return t.get.call(this)},set(e){let n=e||``;if(n&&/^\d{2}\/\d{2}\/\d{4}$/.test(n)){let[e,t,r]=n.split(`/`);n=`${r}-${t}-${e}`}let r=t.get.call(this);t.set.call(this,n),this._flatpickr&&n&&n!==r&&!Ui&&this._flatpickr.setDate(n,!1)},configurable:!0})}})}var Yi=new MutationObserver(e=>{e.forEach(e=>{e.addedNodes.forEach(e=>{e.nodeType===1&&(e.classList?.contains(`datepicker`)&&setTimeout(()=>Ji(),0),e.querySelectorAll?.(`.datepicker`).forEach(()=>setTimeout(()=>Ji(),0)))})})});function Xi(){Yi.observe(document.body,{childList:!0,subtree:!0})}window.initDatePickers=Ji;async function Zi(){try{let e=await p.getAppSettings(),t=e.shopLogo,n=e.shopName||`MAA ERP`;if(document.title=`${n} - ERP`,!t)return;let r=document.getElementById(`dynamic-favicon`);r||(r=document.createElement(`link`),r.id=`dynamic-favicon`,r.rel=`icon`,document.head.appendChild(r)),r.href=t;let i=document.getElementById(`dynamic-apple-icon`);i||(i=document.createElement(`link`),i.id=`dynamic-apple-icon`,i.rel=`apple-touch-icon`,document.head.appendChild(i)),i.href=t;let a=document.querySelector(`link[rel="manifest"]`);if(a){let e={name:n,short_name:n.split(` `)[0],description:`Professional Business Ledger & Accounting System`,start_url:`/`,display:`standalone`,background_color:`#0F172A`,theme_color:`#0F172A`,orientation:`portrait-primary`,icons:[{src:t,sizes:`192x192`,type:`image/png`,purpose:`any maskable`},{src:t,sizes:`512x512`,type:`image/png`,purpose:`any maskable`}]},r=new Blob([JSON.stringify(e)],{type:`application/json`});a.href=URL.createObjectURL(r)}}catch(e){console.warn(`App branding apply error:`,e)}}function Qi(e,t={}){U.currentView===`dashboard`&&e!==`dashboard`&&ot(),U.currentView===`audit`&&e!==`audit`&&v(),U.currentView=e;let n=document.getElementById(`app-sidebar`);n&&n.classList.remove(`open`),document.querySelectorAll(`.nav-links li, .nav-item`).forEach(t=>{t.classList.remove(`active`);let n=t.getAttribute(`onclick`);n&&n.includes(`'${e}'`)&&t.classList.add(`active`)});let r=document.getElementById(`view-container`);if(r){switch(e){case`dashboard`:st(r,t);break;case`customers`:we(r);break;case`ledger`:Wt(r,t);break;case`zone-reports`:zi(r);break;case`bulk`:yr(r);break;case`invoice`:ki(r,t);break;case`expenses`:sn(r);break;case`settings`:zn(r);break;case`statement`:nr(r,t);break;case`admin`:ni(r);break;case`audit`:y(r)}setTimeout(Ji,50)}}function $i(){w(),Zi();let e=document.getElementById(`login-error`);e&&(e.innerText=``);let t=document.getElementById(`login-screen`),r=document.getElementById(`app-container`);t&&(t.style.display=`none`),r&&r.classList.remove(`hidden`);let i=document.getElementById(`user-role`);i&&(i.innerText=U.currentUserRole||`User`);let a=n.auth().currentUser,o=document.getElementById(`user-profile-avatar`);o&&a&&(o.innerHTML=a.photoURL?`<img src="${a.photoURL}" class="w-full h-full object-cover rounded-full" referrerpolicy="no-referrer" />`:`<i class="fa-solid fa-user-shield text-sm"></i>`,o.title=`${a.email} (${U.currentUserRole})`),Qi(U.currentView||`dashboard`)}function ea(){let e=document.getElementById(`app-sidebar`);e&&(e.classList.toggle(`collapsed`),localStorage.setItem(`sidebarCollapsed`,e.classList.contains(`collapsed`)))}window.navigate=Qi,window.navigateTo=Qi,window.unlockApp=$i;async function ta(){let e=document.getElementById(`email-input`)?.value,t=document.getElementById(`password-input`)?.value,n=document.getElementById(`login-error`);if(!e||!t)return n?n.innerText=`ইমেইল ও পাসওয়ার্ড দিন!`:null;try{await s.signInWithEmailAndPassword(e,t)}catch{n&&(n.innerText=`লগইন ব্যর্থ! সঠিক তথ্য দিন।`)}}async function na(){let e=document.getElementById(`login-error`);e&&(e.innerText=`গুগল লগইন প্রসেস করা হচ্ছে...`);try{await s.signInWithPopup(d)}catch(t){console.warn(`Popup blocked, trying redirect:`,t);try{await s.signInWithRedirect(d)}catch{e&&(e.innerText=`গুগল লগইন ব্যর্থ!`)}}}function ra(){let e=n.auth().currentUser;e&&S(`LOGOUT`,`Auth`,e.uid,e.email),s.signOut();let t=document.getElementById(`login-screen`),r=document.getElementById(`app-container`);t&&(t.style.display=`flex`),r&&r.classList.add(`hidden`),[`nav-admin`,`nav-audit`].forEach(e=>document.getElementById(e)?.classList.add(`hidden`)),ca()}var ia=null;function aa(){s.getRedirectResult().catch(e=>console.warn(`Redirect result handled:`,e)),s.onAuthStateChanged(async e=>{ia&&=(ia(),null),e?ia=o.listenUser(e.uid,async t=>{let r=t,i=e.email?.toLowerCase().trim()||``,a=i===`office.maamotors@gmail.com`||i===`maamotorsbd@gmail.com`||i===`omarfarukitbd@gmail.com`;if(!t){r={email:e.email,name:e.displayName||e.email.split(`@`)[0],photoURL:e.photoURL||``,role:a?`Admin`:`Staff`,status:a?`active`:`pending`,pin:``,createdAt:n.firestore.FieldValue.serverTimestamp(),lastLogin:n.firestore.FieldValue.serverTimestamp()};try{await o.getRef(e.uid).set(r)}catch(e){console.error(`Error setting user document:`,e)}if(!a){sa(e.email);return}}else if(a&&(t.status!==`active`||t.role!==`Admin`)){r={...t,role:`Admin`,status:`active`};try{await o.update(e.uid,{role:`Admin`,status:`active`})}catch(e){console.error(`Error auto-healing master user:`,e)}}U.currentUserRole=r.role||`Staff`,U.currentUserEmail=r.email||e.email,U.permissions=r.permissions||{};let s=async()=>{let e=`Unknown`;try{e=(await(await fetch(`https://api.ipify.org?format=json`)).json()).ip}catch(e){console.error(e)}return{ip:e,device:navigator.userAgent}};if(r.status===`active`){te(),ca();let t=document.getElementById(`app-container`);if(t&&t.classList.contains(`hidden`))if(U.currentUserRole===`Admin`){[`nav-admin`,`nav-audit`].forEach(e=>document.getElementById(e)?.classList.remove(`hidden`));let t=await s();S(`LOGIN`,`Auth`,e.uid,e.email,{role:`Admin`,ip:t.ip,device:t.device}),$i(),oa()}else{let t=`login_pin_`+Math.random().toString(36).substring(7),{value:n}=await W.default.fire({title:`<div class="flex items-center justify-center gap-2 text-white font-bn"><i class="fa-solid fa-lock text-amber-400"></i><span>অ্যাক্সেস পিন দিন</span></div>`,input:`password`,inputLabel:`সফটওয়্যারে ঢুকতে আপনার ৪-ডিজিট পিন দিন`,inputPlaceholder:`Enter PIN`,inputAttributes:{autocomplete:`off`,autocorrect:`off`,autocapitalize:`off`,spellcheck:`false`,name:t,"aria-autocomplete":`none`,"data-lpignore":`true`,"data-1p-ignore":`true`},allowOutsideClick:!1,showCancelButton:!0,cancelButtonText:`লগআউট`,customClass:{popup:`!bg-slate-900 !text-white !rounded-3xl border border-slate-700`,title:`!text-white`,confirmButton:`m3-btn-primary !py-2.5`,cancelButton:`m3-btn-tonal !py-2.5`},didOpen:()=>{let e=W.default.getInput();e&&(e.setAttribute(`autocomplete`,`off`),e.setAttribute(`name`,t),e.setAttribute(`readonly`,`readonly`),setTimeout(()=>e.removeAttribute(`readonly`),50))}});if(n===r.pin&&n){let t=await s();S(`LOGIN`,`Auth`,e.uid,e.email,{role:`Staff`,ip:t.ip,device:t.device}),$i()}else n&&W.default.fire(`ভুল পিন!`,`আপনি সঠিক পিন দেননি।`,`error`),ra()}}else r.status===`pending`?sa(e.email):(ra(),document.getElementById(`login-error`)&&(document.getElementById(`login-error`).innerText=`আপনার একাউন্ট ব্লক করা হয়েছে।`))}):(ra(),ca())})}function oa(){o.listenAll(e=>{let t=e.filter(e=>e.status===`pending`).length,n=document.getElementById(`nav-admin`);if(n){let e=document.getElementById(`pending-users-badge`);t>0?(e||(e=document.createElement(`span`),e.id=`pending-users-badge`,e.className=`ml-auto bg-amber-500 text-slate-950 font-black text-[10px] px-2 py-0.5 rounded-full animate-pulse shadow-md`,n.appendChild(e)),e.innerText=`${t} Pending`):e&&e.remove()}})}function sa(e){let t=document.getElementById(`login-screen`);if(t&&(t.style.display=`none`),document.getElementById(`waiting-room`))return;let n=document.createElement(`div`);n.id=`waiting-room`,n.className=`fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/90 backdrop-blur-xl p-4 font-bn`,n.innerHTML=`
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
    `,document.body.appendChild(n)}function ca(){document.getElementById(`waiting-room`)?.remove()}var la,Z=-1;function ua(){let e=document.getElementById(`global-search-input`),t=document.getElementById(`global-search-results`);!e||!t||(e.oninput=e=>{let n=e.target.value.trim();if(n.length<1)return Z=-1,t.classList.add(`hidden`);clearTimeout(la),la=setTimeout(async()=>{t.classList.remove(`hidden`),t.innerHTML=`<div class="p-4 text-xs text-slate-500 text-center"><i class="fa-solid fa-spinner fa-spin mr-2 text-blue-500"></i>অনুসন্ধান করা হচ্ছে...</div>`,fa(n,t),Z=-1},150)},document.addEventListener(`keydown`,n=>{if((n.ctrlKey||n.metaKey)&&n.key.toLowerCase()===`k`)n.preventDefault(),e.focus(),e.select();else if(n.key===`Escape`)t.classList.add(`hidden`);else if(t&&!t.classList.contains(`hidden`)){let e=t.querySelectorAll(`.search-result-item`);n.key===`ArrowDown`?(n.preventDefault(),Z=Math.min(Z+1,e.length-1),da(e)):n.key===`ArrowUp`?(n.preventDefault(),Z=Math.max(Z-1,0),da(e)):n.key===`Enter`&&Z>=0&&(n.preventDefault(),e[Z].click())}}))}function da(e){e.forEach((e,t)=>{t===Z?(e.classList.add(`bg-blue-600/20`,`border-blue-500/50`),e.scrollIntoView({block:`nearest`,behavior:`smooth`})):e.classList.remove(`bg-blue-600/20`,`border-blue-500/50`)})}async function fa(e,t){try{let n=``,r=e.toLowerCase(),i=r.replace(/^#/,``),a=A().filter(t=>typeof window.matchCustomerSearch==`function`?window.matchCustomerSearch(t,e):t.accountNo&&t.accountNo.toLowerCase().includes(i)||t.name&&t.name.toLowerCase().includes(r)||t.phone&&t.phone.includes(i));if(a.length>0&&(n+=`<div class="px-3 py-1.5 bg-slate-800/80 text-[10px] text-blue-400 font-black tracking-widest uppercase border-b border-slate-700/50">কাস্টমার (${a.length})</div>`,a.forEach(e=>{n+=`
                <div class="search-result-item p-3 hover:bg-slate-800 cursor-pointer flex justify-between items-center border-b border-slate-800 transition-all group"
                    onclick="window.handleSearchResultClick('customer', '${e.id}', '${e.name.replace(/'/g,`\\'`)}', '${e.accountNo||``}')">
                    <div class="overflow-hidden">
                        <div class="font-bold text-slate-200 text-sm group-hover:text-blue-400 transition-colors">${e.name}</div>
                        <div class="text-[10px] text-slate-500">${e.phone||`No Phone`}</div>
                    </div>
                    <div class="text-xs font-black text-red-400">৳${I(e.totalDue||0)}</div>
                </div>`})),i.length>=2){let e=await g.getByVoucher(i),t=new Set,r=e.filter(e=>!t.has(e.voucherNo)&&(t.add(e.voucherNo),!0));r.length>0&&(n+=`<div class="px-3 py-1.5 bg-slate-800/80 text-[10px] text-emerald-400 font-black tracking-widest uppercase border-b border-slate-700/50 mt-1">ভাউচার (${r.length})</div>`,r.forEach(e=>{let t=(Number(e.bill)||0)>0?`৳${I(e.bill)}`:`৳${I(e.paid)}`;n+=`
                    <div class="search-result-item p-3 hover:bg-slate-800 cursor-pointer flex justify-between items-center border-b border-slate-800 transition-all group"
                        onclick="window.handleSearchResultClick('voucher', '${e.voucherNo}')">
                        <div>
                            <div class="font-bold text-slate-200 text-sm group-hover:text-emerald-400 transition-colors">#${e.voucherNo} • ${e.customerName}</div>
                            <div class="text-[10px] text-slate-500">${V(e.date)}</div>
                        </div>
                        <div class="text-xs font-black text-white">${t}</div>
                    </div>`}))}t.innerHTML=n||`<div class="p-8 text-center text-xs text-slate-500 italic">কিছু পাওয়া যায়নি</div>`}catch(e){console.error(e),t.innerHTML=`<div class="p-4 text-center text-red-400">Error during search</div>`}}function pa(e,t,n,r){if(document.getElementById(`global-search-results`)?.classList.add(`hidden`),document.getElementById(`global-search-input`).value=``,e===`customer`){let e=U.currentView;if(e===`invoice`){let e=document.getElementById(`inv-customer-select`);e&&(e.value=t,window.invoiceCustomerChanged())}else if(e===`ledger`){let e=document.getElementById(`ledger-customer-select`);e&&(e.value=t,window.filterLedgerByCustomer(t))}else if(e===`customers`){let e=document.getElementById(`cust-search-input`);e&&(e.value=r||n,window.filterCustomerList(),setTimeout(()=>{document.querySelectorAll(`#customer-list tr`).forEach(e=>{e.innerText.includes(n)&&(e.classList.add(`bg-blue-600/20`),e.scrollIntoView({behavior:`smooth`,block:`center`}))})},150))}else Qi(`statement`,{customerId:t,customerName:n,accountNo:r})}else e===`voucher`&&Qi(`ledger`,{filterVoucher:t})}window.handleSearchResultClick=pa;var ma=``,Q=!1,ha=0,ga=`0`,_a=[];function va(e){if(!e)return`0`;let t=e.replace(/([0-9.]+)\s*([+-])\s*([0-9.]+)%/g,`$1 $2 ($1 * $3 / 100)`);if(t=t.replace(/%/g,`/100`),!/^[0-9+\-*/. ()]+$/.test(t))return`Error`;try{let e=Function(`"use strict"; return (${t})`)();return typeof e==`number`&&!isNaN(e)&&isFinite(e)?parseFloat(e.toFixed(6)).toString():`Error`}catch(e){return console.error(`Calculator expression error:`,e),`Error`}}function ya(e){return e===`Error`||e===`Infinity`||e===`NaN`?`0`:e.split(/([+\-*/])/).map(e=>{if([`+`,`-`,`*`,`/`].includes(e))return e;if(!e)return``;let t=e.endsWith(`%`),n=t?e.slice(0,-1):e;if(n===`.`)return`.`+(t?`%`:``);if(n.includes(`.`)){let[e,r]=n.split(`.`);return(e?Number(e).toLocaleString(`en-IN`):`0`)+`.`+r+(t?`%`:``)}return Number(n).toLocaleString(`en-IN`)+(t?`%`:``)}).join(``)}var $;function ba(){try{$||=new(window.AudioContext||window.webkitAudioContext),$.state===`suspended`&&$.resume();let e=$.createOscillator(),t=$.createGain();e.connect(t),t.connect($.destination),e.type=`sine`,e.frequency.setValueAtTime(800,$.currentTime),e.frequency.exponentialRampToValueAtTime(300,$.currentTime+.03),t.gain.setValueAtTime(.05,$.currentTime),t.gain.exponentialRampToValueAtTime(.01,$.currentTime+.03),e.start($.currentTime),e.stop($.currentTime+.03)}catch(e){console.error(`Audio click failed`,e)}}function xa(e){ba();let t=document.getElementById(`calc-display`),n=document.getElementById(`calc-history`);if(!t)return;let r=ga;if((r===`Error`||r===`Infinity`||r===`NaN`)&&(r=`0`),[`MC`,`MR`,`M+`,`M-`].includes(e))e===`MC`?(ha=0,n&&(n.innerText=`Memory Cleared`)):e===`MR`?(r=ha.toString(),Q=!0):e===`M+`?(ha+=parseFloat(va(r))||0,n&&(n.innerText=`M+ (Memory: `+ya(ha.toString())+`)`),Q=!0):e===`M-`&&(ha-=parseFloat(va(r))||0,n&&(n.innerText=`M- (Memory: `+ya(ha.toString())+`)`),Q=!0);else if(e===`C`)r=`0`,ma=``,n&&(n.innerText=``);else if(e===`⌫`||e===`Backspace`)Q?(r=`0`,ma=``,n&&(n.innerText=``)):r=r.length>1?r.slice(0,-1):`0`;else if(e===`=`||e===`Enter`){let e=va(r);ma=r+` =`,r!==e&&!Q&&(_a.unshift({eq:r,res:e}),Ta()),n&&(n.innerText=ma),r=e,Q=!0}else if([`+`,`-`,`*`,`/`].includes(e)){Q=!1;let t=r.slice(-1);[`+`,`-`,`*`,`/`].includes(t)?r=r.slice(0,-1)+e:r+=e}else Q&&=(r=``,!1),r===`0`&&e!==`.`&&e!==`00`&&e!==`000`?r=e:r+=e;ga=r||`0`,t.value=ya(ga)}function Sa(){document.addEventListener(`keydown`,e=>{let t=document.getElementById(`calculator-widget`);!t||t.classList.contains(`hidden`)||(e.target.tagName!==`INPUT`||e.target.id===`calc-display`)&&e.target.tagName!==`TEXTAREA`&&[`0`,`1`,`2`,`3`,`4`,`5`,`6`,`7`,`8`,`9`,`.`,`+`,`-`,`*`,`/`,`%`,`=`,`Enter`,`Backspace`,`Escape`].includes(e.key)&&(e.preventDefault(),e.key===`Escape`?window.app.toggleCalculator():xa(e.key))})}function Ca(){let e=document.getElementById(`calc-history-tape`);e&&e.classList.toggle(`hidden`)}async function wa(){try{await navigator.clipboard.writeText(ga);let e=document.getElementById(`calc-history`);if(e){let t=e.innerText;e.innerText=`Copied: `+ga,setTimeout(()=>{e.innerText=t},1500)}}catch(e){console.error(`Copy failed`,e)}}function Ta(){let e=document.getElementById(`calc-history-tape`);if(e){if(_a.length===0){e.innerHTML=`<span class="text-center opacity-50 block py-4">No History</span>`;return}e.innerHTML=_a.slice(0,15).map(e=>`
        <div class="border-b border-slate-800/50 pb-1 cursor-pointer hover:text-white transition-colors" onclick="window.handleCalc('C'); window.handleCalc('${e.res}')">
            <div class="text-[10px] text-slate-500">${ya(e.eq)} =</div>
            <div class="text-sm font-black text-blue-400">${ya(e.res)}</div>
        </div>
    `).join(``)}}function Ea(){let e=document.getElementById(`calculator-widget`),t=document.getElementById(`calc-drag-handle`);if(!e||!t)return;let n=!1,r=0,i=0,a=0,o=0,s=0,c=0;t.addEventListener(`mousedown`,l),t.addEventListener(`touchstart`,l,{passive:!0}),document.addEventListener(`mousemove`,u),document.addEventListener(`touchmove`,u,{passive:!1}),document.addEventListener(`mouseup`,d),document.addEventListener(`touchend`,d);function l(e){e.target.closest(`button`)||(a=(e.type===`touchstart`?e.touches[0].clientX:e.clientX)-s,o=(e.type===`touchstart`?e.touches[0].clientY:e.clientY)-c,n=!0)}function u(t){n&&(t.type===`touchmove`&&t.preventDefault(),r=(t.type===`touchmove`?t.touches[0].clientX:t.clientX)-a,i=(t.type===`touchmove`?t.touches[0].clientY:t.clientY)-o,s=r,c=i,e.style.transform=`translate(${r}px, ${i}px)`)}function d(){n=!1}}window.handleCalc=xa,window.toggleCalcHistoryTape=Ca,window.copyCalcResult=wa,window.app={login:ta,loginWithGoogle:na,logout:ra,toggleSidebar:()=>document.getElementById(`app-sidebar`)?.classList.toggle(`open`),toggleSidebarCollapse:ea,toggleCalculator:()=>document.getElementById(`calculator-widget`)?.classList.toggle(`hidden`)},document.addEventListener(`DOMContentLoaded`,()=>{let e=new URLSearchParams(window.location.search);if(e.get(`view`)===`public-stmt`&&e.get(`id`)){(async()=>{(await b(()=>import(`./statement-print-COMjHxy5.js`),__vite__mapDeps([9,1,2,3,4,5,10,6,7,8,11]))).renderPublicStatementView(e.get(`id`))})();return}if(e.get(`view`)===`public-memo`&&e.get(`id`)){(async()=>{(await b(()=>import(`./receipt-engine--dF8PpIU.js`),__vite__mapDeps([0,1,2,3,4,5,6,7,8]))).renderPublicMemoView(e.get(`id`))})();return}aa(),ua(),M(),Ji(),Xi(),fe(),he(),localStorage.getItem(`sidebarCollapsed`)===`true`&&document.getElementById(`app-sidebar`)?.classList.add(`collapsed`);let t=[{label:`MC`,class:`bg-slate-800 text-slate-400 text-[11px] font-bold hover:bg-slate-700`},{label:`MR`,class:`bg-slate-800 text-slate-400 text-[11px] font-bold hover:bg-slate-700`},{label:`M+`,class:`bg-slate-800 text-slate-400 text-[11px] font-bold hover:bg-slate-700`},{label:`M-`,class:`bg-slate-800 text-slate-400 text-[11px] font-bold hover:bg-slate-700`},{label:`C`,class:`bg-red-500/10 text-red-400 hover:bg-red-500 hover:text-white border border-red-500/20`},{label:`⌫`,class:`bg-slate-800 text-slate-300 hover:bg-slate-700 border border-slate-700/50`},{label:`%`,class:`bg-slate-800 text-blue-400 hover:bg-blue-600 hover:text-white font-black border border-slate-700/50`},{label:`/`,class:`bg-slate-800 text-blue-400 hover:bg-blue-600 hover:text-white font-black border border-slate-700/50`},{label:`7`,class:`bg-slate-800/60 text-white hover:bg-slate-700 border border-slate-700/30`},{label:`8`,class:`bg-slate-800/60 text-white hover:bg-slate-700 border border-slate-700/30`},{label:`9`,class:`bg-slate-800/60 text-white hover:bg-slate-700 border border-slate-700/30`},{label:`*`,class:`bg-slate-800 text-blue-400 hover:bg-blue-600 hover:text-white font-black border border-slate-700/50`},{label:`4`,class:`bg-slate-800/60 text-white hover:bg-slate-700 border border-slate-700/30`},{label:`5`,class:`bg-slate-800/60 text-white hover:bg-slate-700 border border-slate-700/30`},{label:`6`,class:`bg-slate-800/60 text-white hover:bg-slate-700 border border-slate-700/30`},{label:`-`,class:`bg-slate-800 text-blue-400 hover:bg-blue-600 hover:text-white font-black text-xl border border-slate-700/50`},{label:`1`,class:`bg-slate-800/60 text-white hover:bg-slate-700 border border-slate-700/30`},{label:`2`,class:`bg-slate-800/60 text-white hover:bg-slate-700 border border-slate-700/30`},{label:`3`,class:`bg-slate-800/60 text-white hover:bg-slate-700 border border-slate-700/30`},{label:`+`,class:`bg-slate-800 text-blue-400 hover:bg-blue-600 hover:text-white font-black text-xl border border-slate-700/50`},{label:`0`,class:`bg-slate-800/60 text-white hover:bg-slate-700 border border-slate-700/30`},{label:`00`,class:`bg-slate-800/60 text-white hover:bg-slate-700 border border-slate-700/30 text-sm`},{label:`000`,class:`bg-slate-800/60 text-white hover:bg-slate-700 border border-slate-700/30 text-[11px]`},{label:`.`,class:`bg-slate-800/60 text-white hover:bg-slate-700 font-black border border-slate-700/30 text-xl pb-1`},{label:`=`,class:`col-span-4 bg-blue-600 text-white hover:bg-blue-500 font-black shadow-lg shadow-blue-500/30 border border-blue-500`}],n=document.getElementById(`calc-buttons`);n&&(n.innerHTML=t.map(e=>`<button onclick="window.handleCalc('${e.label}')" class="h-full min-h-[36px] rounded-xl text-sm sm:text-base transition-all active:scale-95 ${e.class} flex items-center justify-center">${e.label}</button>`).join(``)),Sa(),Ea()});
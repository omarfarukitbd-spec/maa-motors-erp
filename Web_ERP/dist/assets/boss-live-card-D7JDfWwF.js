import{p as e}from"./dao-BAvPFDr3.js";import{_ as t,g as n}from"./ui-helpers-ChDNPFdp.js";import"./customer-state-dZilZm7l.js";import{a as r,i,o as a}from"./index-B6CkfZt6.js";async function o(t,n){let r=document.getElementById(`login-screen`),i=document.getElementById(`app-container`);r&&(r.style.display=`none`),i&&i.classList.add(`hidden`);let o=document.getElementById(`boss-live-card-view`);if(o||(o=document.createElement(`div`),o.id=`boss-live-card-view`,o.className=`fixed inset-0 z-[9999] overflow-y-auto bg-slate-950 p-4 sm:p-6 font-bn flex flex-col items-center justify-start min-h-screen`,document.body.appendChild(o)),!a(t,n)){o.innerHTML=`
            <div class="w-full max-w-md bg-slate-900 border border-red-500/30 rounded-3xl p-6 sm:p-8 text-center text-white shadow-2xl mt-12 space-y-4">
                <div class="w-16 h-16 rounded-2xl bg-red-500/10 border border-red-500/30 flex items-center justify-center mx-auto text-red-400">
                    <i class="fa-solid fa-shield-halved text-3xl"></i>
                </div>
                <h3 class="text-xl font-black text-red-400">অননুমোদিত অ্যাক্সেস</h3>
                <p class="text-xs text-slate-300 leading-relaxed">
                    এই কার্ডটির সিকিউরিটি সিগনেচার সঠিক নয় অথবা লিংকটি পরিবর্তন করা হয়েছে। সঠিক কন্টাক্ট লিংক দিয়ে পুনরায় চেষ্টা করুন।
                </p>
                <div class="pt-4 border-t border-slate-800">
                    <span class="text-[11px] text-slate-500 font-mono">ERROR: INVALID_HMAC_SIGNATURE</span>
                </div>
            </div>
        `;return}o.innerHTML=`
        <div class="text-center py-24 text-white font-bold space-y-3">
            <div class="w-12 h-12 rounded-2xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center mx-auto text-indigo-400">
                <i class="fa-solid fa-circle-notch fa-spin text-2xl"></i>
            </div>
            <p class="text-sm font-bold text-slate-300">কাস্টমারের বর্তমান লাইভ ব্যালেন্স লোড হচ্ছে...</p>
            <p class="text-[11px] text-slate-500 font-mono">Connecting to Secure Cloud...</p>
        </div>
    `;try{let r=await e.collection(`customers`).doc(t).get();if(!r.exists){o.innerHTML=`
                <div class="w-full max-w-md bg-slate-900 border border-amber-500/30 rounded-3xl p-6 text-center text-white shadow-2xl mt-12 space-y-4">
                    <div class="w-14 h-14 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center mx-auto text-amber-400">
                        <i class="fa-solid fa-triangle-exclamation text-2xl"></i>
                    </div>
                    <h3 class="text-lg font-black text-amber-400">কাস্টমার পাওয়া যায়নি</h3>
                    <p class="text-xs text-slate-400">ডাটাবেজে এই কাস্টমারের কোনো রেকর্ড পাওয়া যায়নি। সম্ভবত আইডিটি পরিবর্তিত বা ডিলিট হয়েছে।</p>
                </div>
            `;return}let i={id:r.id,...r.data()};s(o,i,t,n)}catch(e){console.error(`Error fetching customer for boss card:`,e),o.innerHTML=`
            <div class="w-full max-w-md bg-slate-900 border border-red-500/30 rounded-3xl p-6 text-center text-white shadow-2xl mt-12 space-y-4">
                <div class="w-14 h-14 rounded-2xl bg-red-500/10 border border-red-500/30 flex items-center justify-center mx-auto text-red-400">
                    <i class="fa-solid fa-circle-exclamation text-2xl"></i>
                </div>
                <h3 class="text-lg font-black text-red-400">ডাটা লোড করতে ব্যর্থ</h3>
                <p class="text-xs text-slate-400">ইন্টারনেট সংযোগ চেক করুন অথবা একটু পর আবার চেষ্টা করুন।</p>
                <button onclick="window.location.reload()" class="px-5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold transition-all">
                    <i class="fa-solid fa-arrows-rotate mr-1.5"></i> রিলোড করুন
                </button>
            </div>
        `}}function s(e,r,a,s){let c=Number(r.totalDue)||0,l=i(r.phone),u=new Date().toLocaleTimeString(`bn-BD`,{hour:`numeric`,minute:`2-digit`,hour12:!0}),d=new Date().toLocaleDateString(`bn-BD`,{day:`numeric`,month:`long`,year:`numeric`}),f=``;f=c>0?`
            <div class="p-5 rounded-2xl bg-red-950/40 border border-red-500/40 text-center relative overflow-hidden shadow-xl shadow-red-950/20">
                <div class="flex items-center justify-center gap-1.5 text-red-300 text-xs font-black uppercase tracking-wider mb-1">
                    <i class="fa-solid fa-file-invoice-dollar text-sm"></i>
                    <span>বর্তমান বকেয়া (Current Net Due)</span>
                </div>
                <div class="text-3xl sm:text-4xl font-black font-mono text-red-400 tracking-tight my-1">
                    ৳ ${t(c)}
                </div>
                <p class="text-[11px] text-red-300/80 font-bold">গ্রাহকের নিকট এই পরিমাণ টাকা পাওনা রয়েছে</p>
            </div>
        `:c<0?`
            <div class="p-5 rounded-2xl bg-emerald-950/40 border border-emerald-500/40 text-center relative overflow-hidden shadow-xl shadow-emerald-950/20">
                <div class="flex items-center justify-center gap-1.5 text-emerald-300 text-xs font-black uppercase tracking-wider mb-1">
                    <i class="fa-solid fa-wallet text-sm"></i>
                    <span>অগ্রিম ব্যালেন্স (Advance Balance)</span>
                </div>
                <div class="text-3xl sm:text-4xl font-black font-mono text-emerald-400 tracking-tight my-1">
                    ৳ ${t(Math.abs(c))}
                </div>
                <p class="text-[11px] text-emerald-300/80 font-bold">গ্রাহকের কোনো বকেয়া নেই (টাকা জমা আছে)</p>
            </div>
        `:`
            <div class="p-5 rounded-2xl bg-emerald-950/30 border border-emerald-500/30 text-center relative overflow-hidden shadow-xl">
                <div class="flex items-center justify-center gap-1.5 text-emerald-300 text-xs font-black uppercase tracking-wider mb-1">
                    <i class="fa-solid fa-circle-check text-sm"></i>
                    <span>ব্যালেন্স: সম্পূর্ণ পরিশোধিত</span>
                </div>
                <div class="text-3xl sm:text-4xl font-black font-mono text-emerald-400 tracking-tight my-1">
                    ৳ ০
                </div>
                <p class="text-[11px] text-emerald-300/80 font-bold">সকল দেনা-পাওনা সম্পূর্ণ পরিষ্কার</p>
            </div>
        `;let p=``;p=l.length>0?`
            <div class="space-y-2 pt-2">
                <div class="flex flex-wrap gap-2">
                    ${l.map(e=>`
            <a href="tel:${e}" class="flex-1 py-3 px-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/30 transition-all active:scale-95">
                <i class="fa-solid fa-phone"></i>
                <span>কল (${e})</span>
            </a>
        `).join(``)}
                </div>
                ${`
            <a href="https://wa.me/${l[0].replace(/\+/g,``)}?text=%E0%A6%86%E0%A6%B8%E0%A6%B8%E0%A6%BE%E0%A6%B2%E0%A6%BE%E0%A6%AE%E0%A7%81%20%E0%A6%86%E0%A6%B2%E0%A6%BE%E0%A6%87%E0%A6%95%E0%A7%81%E0%A6%AE%2C%20%E0%A6%AE%E0%A7%87%E0%A6%B8%E0%A6%BE%E0%A6%B0%E0%A7%8D%E0%A6%B8%20%E0%A6%AE%E0%A6%BE%20%E0%A6%AE%E0%A7%8B%E0%A6%9F%E0%A6%B0%E0%A6%B8%E0%A7%8D%20%E0%A6%A5%E0%A7%87%E0%A6%95%E0%A7%87%20%E0%A6%AF%E0%A7%8B%E0%A6%97%E0%A6%BE%E0%A6%AF%E0%A7%8B%E0%A6%97%20%E0%A6%95%E0%A6%B0%E0%A6%BE%20%E0%A6%B9%E0%A6%9A%E0%A7%8D%E0%A6%9B%E0%A7%87%E0%A5%A4" target="_blank" rel="noopener noreferrer" class="py-3 px-4 rounded-xl bg-emerald-500/20 border border-emerald-500/40 hover:bg-emerald-500/30 text-emerald-400 font-black text-xs flex items-center justify-center gap-2 transition-all active:scale-95">
                <i class="fa-brands fa-whatsapp text-base"></i>
                <span>হোয়াটসঅ্যাপ</span>
            </a>
        `}
            </div>
        `:`
            <div class="p-3 rounded-xl bg-slate-800/60 border border-slate-700/60 text-center text-xs text-slate-400">
                <i class="fa-solid fa-phone-slash text-slate-500 mr-1.5"></i> কোনো মোবাইল নম্বর সংরক্ষিত নেই
            </div>
        `,e.innerHTML=`
        <div class="w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl p-5 sm:p-7 text-white shadow-2xl space-y-5 my-auto">
            <!-- Header -->
            <div class="flex items-center justify-between border-b border-slate-800 pb-4">
                <div class="flex items-center gap-2.5">
                    <div class="w-10 h-10 rounded-2xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400 shadow-inner">
                        <i class="fa-solid fa-store text-lg"></i>
                    </div>
                    <div>
                        <h1 class="text-sm font-black text-white tracking-wide">মেসার্স মা মোটরস্</h1>
                        <p class="text-[10px] text-slate-400">লাইভ কাস্টমার ইনফরমেশন কার্ড</p>
                    </div>
                </div>
                <div class="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 text-[10px] font-black font-mono">
                    <i class="fa-solid fa-shield-halved text-[9px]"></i>
                    <span>VIP CARD</span>
                </div>
            </div>

            <!-- Customer Details Box -->
            <div class="bg-slate-950/60 border border-slate-800/80 rounded-2xl p-4 space-y-2">
                <div class="flex items-start justify-between gap-2">
                    <div>
                        <span class="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">দোকানের নাম / গ্রাহক</span>
                        <h2 class="text-base sm:text-lg font-black text-white leading-tight mt-0.5">${n(r.name||`নাম নেই`)}</h2>
                    </div>
                    ${r.accountNo?`
                        <div class="px-2.5 py-1 rounded-xl bg-slate-800 border border-slate-700 text-[11px] font-black font-mono text-indigo-300">
                            #${n(r.accountNo)}
                        </div>
                    `:``}
                </div>

                <div class="pt-2 border-t border-slate-800/80 space-y-1.5 text-xs">
                    <div class="flex items-center gap-2 text-slate-300">
                        <i class="fa-solid fa-location-dot text-slate-500 text-xs w-4 text-center"></i>
                        <span>${n(r.address||`ঠিকানা দেওয়া নেই`)}</span>
                    </div>
                    ${r.zone?`
                        <div class="flex items-center gap-2 text-slate-400 text-[11px]">
                            <i class="fa-solid fa-map-pin text-slate-500 text-xs w-4 text-center"></i>
                            <span>জোন: <strong class="text-slate-200">${n(r.zone)}</strong></span>
                        </div>
                    `:``}
                </div>
            </div>

            <!-- Balance Card -->
            ${f}

            <!-- Action Buttons -->
            ${p}

            <!-- Live Status & Refresh -->
            <div class="pt-3 border-t border-slate-800 space-y-2.5">
                <div class="flex items-center justify-between text-[11px] text-slate-400 px-1">
                    <div class="flex items-center gap-1.5">
                        <span class="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                        <span class="font-bold text-emerald-400">লাইভ ক্লাউড ডাটা</span>
                    </div>
                    <div class="font-mono text-slate-400">
                        ${u}
                    </div>
                </div>

                <button id="boss-refresh-btn" class="w-full py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs flex items-center justify-center gap-2 transition-all border border-slate-700">
                    <i class="fa-solid fa-arrows-rotate text-indigo-400"></i>
                    <span>সর্বশেষ বকেয়া রিফ্রেশ করুন</span>
                </button>
            </div>

            <!-- Security Footnote -->
            <div class="text-[10px] text-slate-500 text-center space-y-0.5 pt-1">
                <p><i class="fa-solid fa-lock text-slate-600 mr-1"></i> সুরক্ষিত এন্ড-টু-এন্ড ক্রিপ্টোগ্রাফিক সিগনেচার</p>
                <p>মেসার্স মা মোটরস্ ইআরপি সিস্টেম • ${d}</p>
            </div>
        </div>
    `;let m=document.getElementById(`boss-refresh-btn`);m&&(m.onclick=()=>{o(a,s)})}export{r as generateBossToken,o as renderBossLiveCard,a as verifyBossToken};
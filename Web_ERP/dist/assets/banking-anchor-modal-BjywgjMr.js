import{i as e}from"./rolldown-runtime-Dd_uD5pT.js";import{i as t,n}from"./dao-BctEXtfh.js";import{i as r}from"./audit-B-2BTDNi.js";import{_ as i,m as a,o,y as s}from"./ui-helpers-ChDNPFdp.js";import{n as c}from"./vendor-ui-n4g2UPZQ.js";import{i as l}from"./index-aCGnZFC_.js";var u=e(c());async function d(e,c,d){let f=c?t:n,p=c?`ক্যাশ বক্স`:`ব্যাংক অ্যাকাউন্ট`;u.default.fire({title:`লোড হচ্ছে...`,allowOutsideClick:!1,didOpen:()=>u.default.showLoading(),customClass:{popup:`!bg-slate-900 !text-white !rounded-3xl border border-slate-700`}});let m={effectiveStartDate:`2026-08-01`,openingBalance:0,docId:null};try{let t=await f.collection.where(`name`,`==`,e).limit(1).get();if(!t.empty){let e=t.docs[0],n=e.data();m.docId=e.id,n.effectiveStartDate&&(m.effectiveStartDate=a(n.effectiveStartDate)),n.openingBalance!==void 0&&!isNaN(Number(n.openingBalance))&&(m.openingBalance=Number(n.openingBalance))}}catch(e){console.error(`Error fetching account anchor:`,e)}let h=`
        <div class="text-left font-bn space-y-4">
            <div class="bg-blue-500/10 border border-blue-500/30 p-3.5 rounded-2xl text-blue-300 text-xs leading-relaxed shadow-sm">
                <i class="fa-solid fa-circle-info mr-1.5 text-blue-400"></i>
                <strong>প্রারম্ভিক ব্যালেন্স ও কাট-অফ ডেট:</strong> এই তারিখের আগের পুরোনো বা অপ্রাসঙ্গিক লেনদেন লেজারে আসবে না। নির্ধারিত তারিখ থেকে প্রদত্ত প্রারম্ভিক ব্যালেন্স দিয়ে হিসাব শুরু হবে।
            </div>

            <div>
                <label class="block text-xs font-bold text-slate-300 mb-1">অ্যাকাউন্টের নাম</label>
                <input type="text" readonly class="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-slate-300 text-xs font-bold outline-none cursor-not-allowed" value="${e} (${p})">
            </div>

            <div>
                <label class="block text-xs font-bold text-slate-300 mb-1">হিসাব শুরুর তারিখ (Effective Start Date)</label>
                <input type="text" id="anchor-start-date" class="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white text-xs font-mono outline-none datepicker cursor-pointer" value="${m.effectiveStartDate}">
            </div>

            <div>
                <label class="block text-xs font-bold text-slate-300 mb-1">প্রারম্ভিক ব্যালেন্স (Opening Balance ৳)</label>
                <input type="text" id="anchor-opening-bal" oninput="window.handleNumberInput(this); window.updateLiveWords(this, 'anchor-bal-words');" class="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-emerald-400 font-black text-lg outline-none font-mono focus:border-purple-500" value="${i(m.openingBalance)}">
                <div id="anchor-bal-words" class="text-[11px] text-emerald-400 font-bold hidden italic mt-1"></div>
            </div>
        </div>
    `,{value:g}=await u.default.fire({title:`<div class="font-bn font-black text-white text-lg flex items-center justify-center gap-2">
            <i class="fa-solid fa-sliders text-purple-400"></i>
            <span>প্রারম্ভিক ব্যালেন্স কনফিগারেশন</span>
        </div>`,html:h,focusConfirm:!1,showCancelButton:!0,confirmButtonText:`<i class="fa-solid fa-check mr-1.5"></i>সংরক্ষণ করুন`,cancelButtonText:`বাতিল`,confirmButtonColor:`#10b981`,cancelButtonColor:`#64748b`,customClass:{popup:`!bg-slate-900 !text-white !rounded-3xl border border-slate-700`},preConfirm:()=>{let e=document.getElementById(`anchor-start-date`)?.value?.trim(),t=document.getElementById(`anchor-opening-bal`)?.value?.trim(),n=a(e),r=s(t)||0;return n?{effectiveStartDate:n,openingBalance:r}:u.default.showValidationMessage(`শুরুর তারিখ দেওয়া আবশ্যক!`)}});if(g){if(!await l(`Configure Anchor for ${e}`,`editBank`))return;u.default.fire({title:`সংরক্ষণ করা হচ্ছে...`,allowOutsideClick:!1,didOpen:()=>u.default.showLoading()});try{m.docId?await f.update(m.docId,{effectiveStartDate:g.effectiveStartDate,openingBalance:g.openingBalance}):await f.add({name:e,status:`active`,effectiveStartDate:g.effectiveStartDate,openingBalance:g.openingBalance}),r(`SET_ACCOUNT_ANCHOR`,`Admin`,`BankingSystem`,`Set anchor for ${e}: Start ${g.effectiveStartDate}, Opening ৳${g.openingBalance}`),u.default.close(),o(`প্রারম্ভিক ব্যালেন্স সফলভাবে আপডেট হয়েছে!`,`success`),typeof d==`function`&&await d(),typeof window.bankingApp?.refreshCards==`function`&&window.bankingApp.refreshCards()}catch(e){console.error(`Error saving account anchor:`,e),u.default.fire(`ত্রুটি`,`সংরক্ষণ করতে সমস্যা হয়েছে!`,`error`)}}}export{d as openAccountAnchorModal};
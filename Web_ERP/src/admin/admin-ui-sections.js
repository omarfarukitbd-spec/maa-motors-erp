export function getAdminPortalCardsHtml() {
    return `
        <!-- Portal Links & Access Sharing Section -->
        <div class="rounded-2xl bg-slate-900/50 border border-slate-800/70 overflow-hidden">
            <div class="p-4 md:p-5 bg-gradient-to-r from-amber-950/40 via-blue-950/30 to-transparent border-b border-slate-800/70">
                <h3 class="font-black flex items-center gap-2.5 text-white text-sm md:text-base">
                    <i class="fa-solid fa-link text-amber-400"></i> স্মার্ট পোর্টাল লিংক ও অ্যাক্সেস কন্ট্রোল
                </h3>
                <p class="text-[11px] text-slate-400 mt-1 ml-7">বস ও স্টাফদের জন্য আলাদা আলাদা লিংক শেয়ার ও অ্যাক্সেস অনুমোদন করার সহজ প্যানেল।</p>
            </div>
            <div class="p-3 md:p-4 grid grid-cols-1 md:grid-cols-2 gap-3">
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
    `;
}

export function getAdminDisasterRecoveryHtml() {
    return `
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
    `;
}

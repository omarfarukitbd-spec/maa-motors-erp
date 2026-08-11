/**
 * Audit Log Sectional UI Components
 * Renders tabs, overview cards, critical security alerts, and staff timelines.
 */

export function renderAuditStatsCards(stats) {
    return `
        <div class="grid grid-cols-2 lg:grid-cols-4 gap-3 font-bn">
            <div class="m3-card bg-slate-900/80 border border-slate-800 p-4 rounded-3xl backdrop-blur-xl flex items-center gap-3">
                <div class="w-12 h-12 rounded-2xl bg-blue-500/10 border border-blue-500/20 text-blue-400 flex items-center justify-center text-xl shrink-0">
                    <i class="fa-solid fa-list-check"></i>
                </div>
                <div>
                    <div class="text-[10px] text-slate-400 font-bold uppercase tracking-wider">আজকের মোট কাজ</div>
                    <div class="text-2xl font-black text-white">${stats.totalToday} <span class="text-xs text-slate-500 font-normal">টি</span></div>
                </div>
            </div>

            <div class="m3-card bg-slate-900/80 border border-slate-800 p-4 rounded-3xl backdrop-blur-xl flex items-center gap-3">
                <div class="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center text-xl shrink-0">
                    <i class="fa-solid fa-pen-to-square"></i>
                </div>
                <div>
                    <div class="text-[10px] text-slate-400 font-bold uppercase tracking-wider">আজকের সংশোধন (Edit)</div>
                    <div class="text-2xl font-black text-amber-400">${stats.updatesToday} <span class="text-xs text-slate-500 font-normal">টি</span></div>
                </div>
            </div>

            <div class="m3-card bg-slate-900/80 border border-slate-800 p-4 rounded-3xl backdrop-blur-xl flex items-center gap-3">
                <div class="w-12 h-12 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-400 flex items-center justify-center text-xl shrink-0">
                    <i class="fa-solid fa-trash-can"></i>
                </div>
                <div>
                    <div class="text-[10px] text-slate-400 font-bold uppercase tracking-wider">আজকের ডিলিট (Delete)</div>
                    <div class="text-2xl font-black text-red-400">${stats.deletesToday} <span class="text-xs text-slate-500 font-normal">টি</span></div>
                </div>
            </div>

            <div class="m3-card bg-slate-900/80 border border-slate-800 p-4 rounded-3xl backdrop-blur-xl flex items-center gap-3">
                <div class="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center text-xl shrink-0">
                    <i class="fa-solid fa-user-gear"></i>
                </div>
                <div>
                    <div class="text-[10px] text-slate-400 font-bold uppercase tracking-wider">সক্রিয় স্টাফ</div>
                    <div class="text-2xl font-black text-emerald-400">${stats.activeUsersCount} <span class="text-xs text-slate-500 font-normal">জন</span></div>
                </div>
            </div>
        </div>
    `;
}

export function renderAuditTabsNavigation(activeTab = 'all') {
    const tabs = [
        { id: 'all', label: 'সকল অডিট লগ', icon: 'fa-table-list' },
        { id: 'critical', label: 'ক্রিটিক্যাল সিকিউরিটি', icon: 'fa-triangle-exclamation', badgeClass: 'bg-red-500/20 text-red-400 border-red-500/30' },
        { id: 'staff', label: 'স্টাফ টাইমলাইন', icon: 'fa-users-gear' }
    ];

    return `
        <div class="flex items-center gap-2 border-b border-slate-800 pb-3 font-bn overflow-x-auto custom-scrollbar">
            ${tabs.map(t => {
                const isActive = t.id === activeTab;
                const activeStyle = isActive 
                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30 font-black' 
                    : 'bg-slate-900/80 text-slate-400 hover:text-white hover:bg-slate-800 font-bold border border-slate-800';
                return `
                    <button onclick="window.switchAuditTab('${t.id}')" class="h-10 px-4 rounded-2xl text-xs flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap ${activeStyle}">
                        <i class="fa-solid ${t.icon} text-sm"></i>
                        <span>${t.label}</span>
                    </button>
                `;
            }).join('')}
        </div>
    `;
}

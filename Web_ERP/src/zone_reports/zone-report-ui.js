import { loadZoneReportData, getZoneReportState, setSelectedZoneState, setSelectedStatusState, setSelectedSortState, printZonePDFReport, exportZoneExcelReport, printZoneTagadaReport } from './zone-report-actions.js';
import { renderZoneTableRows } from './zone-report-table.js';
import { formatAmountWithComma, escapeHTML, safeRound } from '../utils.js';

/**
 * Render Main Zone Select List View Container
 */
export async function renderZoneReports(container) {
    if (window.AppState?.currentUserRole === 'Staff' && window.AppState?.permissions?.viewZoneReports === false) {
        container.innerHTML = `<div class="m3-card text-center font-bn py-12"><h2 class="text-xl font-bold text-red-500">অ্যাক্সেস ডিনাইড! আপনার জোন রিপোর্ট দেখার অনুমতি নেই।</h2></div>`;
        return;
    }

    container.innerHTML = `
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
                    <button data-perm="printZoneReport" class="h-10 px-4 rounded-xl bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-500 hover:to-blue-500 text-white text-xs font-black shadow-lg shadow-indigo-600/25 transition-all cursor-pointer flex items-center gap-2 active:scale-95 border border-indigo-400/30" onclick="window.zoneReportApp.printPDF()">
                        <i class="fa-solid fa-file-pdf text-xs"></i><span>PDF ও প্রিন্ট ভিউ</span>
                    </button>
                    <button data-perm="printTagadaSheet" class="h-10 px-4 rounded-xl bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 text-white text-xs font-black shadow-lg shadow-amber-600/25 transition-all cursor-pointer flex items-center gap-2 active:scale-95 border border-amber-400/30" onclick="window.zoneReportApp.printTagada()" title="মাঠপর্যায়ে তাগাদা ও আদায়ের বিশেষ প্রিন্ট ক্যাটালগ">
                        <i class="fa-solid fa-clipboard-check text-xs"></i><span>তাগাদা শিট (Print)</span>
                    </button>
                    <button data-perm="exportZoneReport" class="h-10 px-4 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-black shadow-lg shadow-emerald-600/25 transition-all cursor-pointer flex items-center gap-2 active:scale-95 border border-emerald-400/30" onclick="window.zoneReportApp.exportExcel()">
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
    `;

    await refreshZoneReportUI();
}

/**
 * Load & Refresh UI Components
 */
export async function refreshZoneReportUI() {
    const data = await loadZoneReportData();
    renderZonePills(data.zones, data.customers);
    renderFilteredTable();
}

/**
 * Render Zone Selection Pills (All Zones tab active by default)
 */
function renderZonePills(zones, customers) {
    const container = document.getElementById('zr-zone-pills-container');
    const kpiZones = document.getElementById('zr-kpi-total-zones');
    if (kpiZones) kpiZones.innerText = zones.length;

    if (!container) return;

    const state = getZoneReportState();
    const currentZone = state.selectedZone || '';

    // "All Zones" pill
    let pillsHtml = `
        <button onclick="window.zoneReportApp.selectZone('')" class="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap active:scale-95 ${!currentZone ? 'bg-gradient-to-r from-indigo-600 to-cyan-600 text-white shadow-lg shadow-indigo-500/20' : 'bg-slate-950 hover:bg-slate-800 text-slate-300 border border-slate-800'}">
            <i class="fa-solid fa-border-all text-xs"></i>
            <span>সকল জোন (All Zones)</span>
            <span class="px-2 py-0.5 rounded-full text-[10px] font-black ${!currentZone ? 'bg-black/30 text-white' : 'bg-slate-800 text-slate-400'}">${customers.length}</span>
        </button>
    `;

    zones.forEach(z => {
        const count = customers.filter(c => (c.zone || '').trim() === z.name).length;
        const isActive = currentZone === z.name;

        pillsHtml += `
            <button onclick="window.zoneReportApp.selectZone('${escapeHTML(z.name)}')" class="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap active:scale-95 ${isActive ? 'bg-gradient-to-r from-indigo-600 to-cyan-600 text-white shadow-lg shadow-indigo-500/20' : 'bg-slate-950 hover:bg-slate-800 text-slate-300 border border-slate-800'}">
                <i class="fa-solid fa-location-dot text-xs ${isActive ? 'text-white' : 'text-indigo-400'}"></i>
                <span>${escapeHTML(z.name)}</span>
                <span class="px-2 py-0.5 rounded-full text-[10px] font-black ${isActive ? 'bg-black/30 text-white' : 'bg-slate-800 text-slate-400'}">${count}</span>
            </button>
        `;
    });

    container.innerHTML = pillsHtml;
}

/**
 * Filter & Render Table Rows based on Selected Zone, Status Filter, Search Query & Sorting
 */
export function renderFilteredTable() {
    const state = getZoneReportState();
    const query = document.getElementById('zr-search-input')?.value.trim().toLowerCase() || '';
    const statusFilter = state.selectedStatus || 'all';
    const sortBy = state.selectedSort || 'due_desc';
    const zoneName = state.selectedZone || '';

    const filtered = state.customers.filter(c => {
        const matchesZone = !zoneName || (c.zone || '').trim() === zoneName;
        const matchesSearch = !query || 
            (c.name || '').toLowerCase().includes(query) || 
            (c.accountNo || '').toLowerCase().includes(query) || 
            (c.phone || '').includes(query) ||
            (c.address || '').toLowerCase().includes(query);

        const due = Number(c.totalDue) || 0;
        let matchesStatus = true;
        if (statusFilter === 'due') matchesStatus = due > 0;
        else if (statusFilter === 'zero') matchesStatus = due === 0;
        else if (statusFilter === 'advance') matchesStatus = due < 0;

        return matchesZone && matchesSearch && matchesStatus;
    });

    // Apply Sorting
    filtered.sort((a, b) => {
        if (sortBy === 'due_desc') {
            return (Number(b.totalDue) || 0) - (Number(a.totalDue) || 0);
        } else if (sortBy === 'acc_asc') {
            return (a.accountNo || '').localeCompare(b.accountNo || '', undefined, { numeric: true });
        } else if (sortBy === 'name_asc') {
            return (a.name || '').localeCompare(b.name || '');
        }
        return 0;
    });

    // Update KPI & Title Labels
    let totalDue = 0;
    filtered.forEach(c => totalDue = safeRound(totalDue + (Number(c.totalDue) || 0)));

    const kpiCusts = document.getElementById('zr-kpi-total-custs');
    const kpiDue = document.getElementById('zr-kpi-total-due');
    const titleEl = document.getElementById('zr-table-header-title');
    const badgeEl = document.getElementById('zr-table-count-badge');

    if (kpiCusts) kpiCusts.innerText = `${filtered.length} জন`;
    if (kpiDue) kpiDue.innerText = `৳ ${formatAmountWithComma(totalDue)}`;
    if (badgeEl) badgeEl.innerText = `${filtered.length} জন কাস্টমার`;
    if (titleEl) {
        titleEl.innerHTML = `<i class="fa-solid fa-list-check text-indigo-400"></i> ${zoneName ? `${zoneName} জোনের কাস্টমার তালিকা` : 'সকল জোনের কাস্টমার তালিকা'}`;
    }

    const tbody = document.getElementById('zr-table-body');
    if (tbody) {
        tbody.innerHTML = renderZoneTableRows(filtered);
    }
}

// Global Window Bindings for Zone Report Actions
window.zoneReportApp = {
    selectZone: (zoneName) => {
        setSelectedZoneState(zoneName);
        const data = getZoneReportState();
        renderZonePills(data.zones, data.customers);
        renderFilteredTable();
    },
    setStatusFilter: (status) => {
        setSelectedStatusState(status);
        renderFilteredTable();
    },
    setSortBy: (sort) => {
        setSelectedSortState(sort);
        renderFilteredTable();
    },
    refreshData: () => refreshZoneReportUI(),
    renderFilteredTable: () => renderFilteredTable(),
    printPDF: () => printZonePDFReport(),
    printTagada: () => printZoneTagadaReport(),
    exportExcel: () => exportZoneExcelReport()
};


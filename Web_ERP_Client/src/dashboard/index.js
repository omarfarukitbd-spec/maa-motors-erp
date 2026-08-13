import { getDashboardHTML } from './dashboard-ui.js';
import { initDashboardListeners, unsubscribeDashboard, loadDashboardDateData } from './dashboard-logic.js';
import { toDBDate, getTodayLocalDateString, formatAppDate } from '../utils.js';

export function renderDashboard(container) {
    if (!container) return;
    container.innerHTML = getDashboardHTML();
    initDashboardListeners();

    window.refreshDashboardData = () => initDashboardListeners();

    window.switchDashTimeframe = (tf) => {
        const btnToday = document.getElementById('tf-today-btn');
        const btnYest = document.getElementById('tf-yesterday-btn');
        const dateInput = document.getElementById('dash-date-filter');

        const d = new Date();
        if (tf === 'yesterday') {
            d.setDate(d.getDate() - 1);
            if (btnYest) btnYest.className = "px-3.5 py-1.5 min-h-[32px] rounded-xl bg-blue-600 text-white shadow-[0_0_15px_rgba(59,130,246,0.4)] active:scale-95 transition-all cursor-pointer flex items-center gap-1.5";
            if (btnToday) btnToday.className = "px-3.5 py-1.5 min-h-[32px] rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 active:scale-95 transition-all cursor-pointer flex items-center gap-1.5";
        } else {
            if (btnToday) btnToday.className = "px-3.5 py-1.5 min-h-[32px] rounded-xl bg-blue-600 text-white shadow-[0_0_15px_rgba(59,130,246,0.4)] active:scale-95 transition-all cursor-pointer flex items-center gap-1.5";
            if (btnYest) btnYest.className = "px-3.5 py-1.5 min-h-[32px] rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 active:scale-95 transition-all cursor-pointer flex items-center gap-1.5";
        }

        const dateStr = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
        if (dateInput) dateInput.value = formatAppDate(dateStr);
        loadDashboardDateData(dateStr);
    };

    window.onDashDateFilterChange = (val) => {
        if (!val) return;
        const dbDate = toDBDate(val);
        loadDashboardDateData(dbDate);
    };
}

export { unsubscribeDashboard };

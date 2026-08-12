// --- Audit Module (DAO & UI) ---
import { db, firebase } from './firebase-config.js';
import { UserDAO, SettingsDAO, AuditDAO } from './dao.js';
import { capturePhoto } from './utils/camera-capture.js';
import { renderVisualDiff } from './audit/audit-diff-viewer.js';
import { filterAuditLogs } from './audit/audit-filters.js';
import { exportAuditLogsToExcel } from './audit/audit-export.js';
import { calculateAuditStats } from './audit/audit-stats.js';
import { renderAuditStatsCards, renderAuditTabsNavigation } from './audit/audit-sections-ui.js';
import { printAuditLogReport } from './audit/audit-print.js';

let auditUnsubscribes = [];
let cachedAuditLogs = [];
let filteredAuditLogsCache = [];
let activeAuditTab = 'all';

export function unsubscribeAuditLogs() {
    auditUnsubscribes.forEach(unsub => {
        if (typeof unsub === 'function') unsub();
    });
    auditUnsubscribes = [];
}

/**
 * Logs an action to the audit trail.
 */
export async function auditLog(action, module, entityId, entityName, details = {}, changes = null) {
    try {
        const currentUser = firebase.auth().currentUser;
        const isMobile = (typeof navigator !== 'undefined' && navigator.userAgent && /Mobi|Android|iPhone/i.test(navigator.userAgent));
        
        const logEntry = {
            action: action,
            module: module,
            entityId: entityId || '',
            entityName: entityName || '',
            details: details || {},
            deviceInfo: isMobile ? 'Mobile' : 'Desktop',
            userEmail: currentUser ? currentUser.email : 'Unknown',
            userId: currentUser ? currentUser.uid : 'System',
            timestamp: firebase.firestore.FieldValue.serverTimestamp(),
            clientTimestamp: new Date().toISOString()
        };

        if (changes) logEntry.changes = changes;

        await AuditDAO.add(logEntry);
        console.log(`[Audit] ${action} on ${module} (${entityName}) logged successfully.`);

        // Telegram Alert Logic (Free plan alternative)
        if (['DELETE', 'UPDATE', 'SECURITY_ALERT', 'LOGIN'].includes(action)) {
            try {
                const daoModule = await import('./dao.js');
                const settings = await daoModule.SettingsDAO.getAppSettings();
                const botToken = settings.telegramBotToken;
                const chatId = settings.telegramChatId;
                
                if (botToken && chatId) {
                    let alertType = '[INFO]';
                    if (action === 'DELETE' || action === 'SECURITY_ALERT') alertType = '[ALERT]';
                    else if (action === 'UPDATE') alertType = '[WARN]';
                    else if (action === 'LOGIN') alertType = '[SUCCESS]';

                    let detailsStr = '';
                    if (details && typeof details === 'object' && Object.keys(details).length > 0) {
                        detailsStr = `\n*Details:* \`${JSON.stringify(details).substring(0, 100)}\``;
                    }

                    const text = `
${alertType} *Maa Motors ERP Alert*
*Action:* ${action}
*Module:* ${module || 'Unknown'}
*Target:* ${entityName || entityId || 'Unknown'}
*User:* ${logEntry.userEmail}
*Time:* ${new Date().toLocaleString('en-US', { timeZone: 'Asia/Dhaka' })}${detailsStr}
                    `.trim();

                    let photoBlob = null;
                    if (action === 'SECURITY_ALERT') {
                        photoBlob = await capturePhoto();
                    }

                    if (photoBlob) {
                        const formData = new FormData();
                        formData.append('chat_id', chatId);
                        formData.append('photo', photoBlob, 'intruder.jpg');
                        formData.append('caption', text);
                        formData.append('parse_mode', 'Markdown');

                        await fetch(`https://api.telegram.org/bot${botToken}/sendPhoto`, {
                            method: 'POST',
                            body: formData
                        });
                    } else {
                        await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({ chat_id: chatId, text, parse_mode: 'Markdown' })
                        });
                    }
                }
            } catch(e) {
                console.error('Failed to send Telegram alert:', e);
            }
        }

    } catch (error) {
        console.error("Failed to write audit log:", error);
    }
}

export async function getRecentAuditLogs(limitCount = 50) {
    try {
        return await AuditDAO.getRecent(limitCount);
    } catch (error) {
        console.error("Failed to fetch audit logs:", error);
        return [];
    }
}

async function populateUserDropdown(logs) {
    const select = document.getElementById('audit-user-select');
    if (!select) return;

    let registeredUsers = [];
    try {
        registeredUsers = await UserDAO.getAll();
    } catch(e) {
        console.warn("Could not fetch user list for audit dropdown:", e);
    }

    const regEmails = registeredUsers.map(u => u.email).filter(Boolean);
    const logEmails = logs.map(l => l.userEmail).filter(Boolean);
    const allEmails = Array.from(new Set([...regEmails, ...logEmails])).sort();

    select.innerHTML = '<option value="">-- সকল ইউজার (All Staff) --</option>' +
        allEmails.map(e => `<option value="${e}">${e}</option>`).join('');
}

/**
 * Renders the Advanced Audit Logs & Security UI.
 */
export async function renderAuditLogs(container) {
    if (window.AppState.currentUserRole !== 'Admin') {
        container.innerHTML = `<div class="m3-card text-center font-bn py-12"><h2 class="text-xl font-black text-red-500">অ্যাক্সেস ডিনাইড! শুধুমাত্র অ্যাডমিন সিকিউরিটি অডিট দেখতে পারবেন।</h2></div>`;
        return;
    }

    unsubscribeAuditLogs();
    container.innerHTML = `
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
    `;

    loadAuditLogsData();
}

async function loadAuditLogsData() {
    const tbody = document.getElementById('audit-logs-list');
    if (!tbody) return;

    try {
        cachedAuditLogs = await AuditDAO.getRecent(150);
        
        // Update stats cards & tabs
        const stats = calculateAuditStats(cachedAuditLogs);
        const statsEl = document.getElementById('audit-stats-cards-container');
        if (statsEl) statsEl.innerHTML = renderAuditStatsCards(stats);

        const tabsEl = document.getElementById('audit-tabs-container');
        if (tabsEl) tabsEl.innerHTML = renderAuditTabsNavigation(activeAuditTab);

        await populateUserDropdown(cachedAuditLogs);
        applyAuditFilters();
    } catch (err) {
        console.error("Load audit error:", err);
        tbody.innerHTML = '<tr><td colspan="5" class="text-center py-12 text-red-400 font-bold">ডাটা লোড করতে সমস্যা হয়েছে</td></tr>';
    }
}

export function applyAuditFilters() {
    const tbody = document.getElementById('audit-logs-list');
    if (!tbody) return;

    const searchQuery = document.getElementById('audit-search-input')?.value || '';
    const userFilter = document.getElementById('audit-user-select')?.value || '';
    let actionFilter = document.getElementById('audit-action-select')?.value || '';
    const moduleFilter = document.getElementById('audit-module-select')?.value || '';
    const startDate = document.getElementById('audit-start-date')?.value || '';
    const endDate = document.getElementById('audit-end-date')?.value || '';

    if (activeAuditTab === 'critical') {
        if (!actionFilter) actionFilter = 'DELETE';
    }

    filteredAuditLogsCache = filterAuditLogs(cachedAuditLogs, { searchQuery, userFilter, actionFilter, moduleFilter, startDate, endDate });
    renderAuditRows(filteredAuditLogsCache, tbody);
}

function renderAuditRows(logs, tbody) {
    if (logs.length === 0) {
        tbody.innerHTML = '<tr><td colspan="5" class="text-center py-16 text-slate-500 font-bold italic">কোনো ফিল্টারকৃত অডিট রেকর্ড পাওয়া যায়নি।</td></tr>';
        return;
    }

    tbody.innerHTML = logs.map(log => {
        const ts = log.timestamp ? log.timestamp.toDate() : new Date(log.clientTimestamp || Date.now());
        const dateStr = ts.toLocaleDateString('en-GB');
        const timeStr = ts.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });

        let actionBadge = '';
        if (log.action === 'CREATE') actionBadge = '<span class="bg-emerald-500/20 text-emerald-400 px-2.5 py-1 rounded-xl text-[10px] font-black border border-emerald-500/30">CREATE</span>';
        else if (log.action === 'UPDATE') actionBadge = '<span class="bg-amber-500/20 text-amber-400 px-2.5 py-1 rounded-xl text-[10px] font-black border border-amber-500/30">UPDATE</span>';
        else if (log.action === 'DELETE') actionBadge = '<span class="bg-red-500/20 text-red-400 px-2.5 py-1 rounded-xl text-[10px] font-black border border-red-500/30">DELETE</span>';
        else if (log.action === 'LOGIN') actionBadge = '<span class="bg-blue-500/20 text-blue-400 px-2.5 py-1 rounded-xl text-[10px] font-black border border-blue-500/30">LOGIN</span>';
        else actionBadge = `<span class="bg-slate-800 text-slate-300 px-2.5 py-1 rounded-xl text-[10px] font-black border border-slate-700">${log.action}</span>`;

        return `
            <tr class="border-b border-slate-800/50 hover:bg-slate-800/30 transition-colors">
                <td class="p-3.5 text-xs text-slate-400 font-mono whitespace-nowrap">
                    <div class="font-bold text-white">${dateStr}</div>
                    <div class="text-[10px] text-slate-500">${timeStr}</div>
                </td>
                <td class="p-3.5 whitespace-nowrap">${actionBadge}</td>
                <td class="p-3.5 text-xs font-bold text-slate-300 whitespace-nowrap"><i class="fa-solid fa-folder text-slate-500 mr-1.5"></i>${log.module || '-'}</td>
                <td class="p-3.5 text-xs text-sky-400 font-mono font-bold whitespace-nowrap"><i class="fa-solid fa-user-shield text-slate-500 mr-1.5"></i>${log.userEmail || 'System'}</td>
                <td class="p-3.5 min-w-[280px]">${renderVisualDiff(log)}</td>
            </tr>
        `;
    }).join('');
}

window.switchAuditTab = (tabId) => {
    activeAuditTab = tabId;
    const tabsEl = document.getElementById('audit-tabs-container');
    if (tabsEl) tabsEl.innerHTML = renderAuditTabsNavigation(activeAuditTab);
    applyAuditFilters();
};

window.auditLog = auditLog;
window.getRecentAuditLogs = getRecentAuditLogs;
window.unsubscribeAuditLogs = unsubscribeAuditLogs;
window.applyAuditFilters = applyAuditFilters;
window.refreshAuditLogsList = loadAuditLogsData;
window.exportActiveAuditExcel = () => exportAuditLogsToExcel(filteredAuditLogsCache);
window.triggerPrintAuditLogReport = () => printAuditLogReport(filteredAuditLogsCache);

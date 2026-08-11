// --- Audit Module (DAO) ---
import { db, firebase } from './firebase-config.js';
import { AuditDAO } from './dao.js';
import { formatAppDate, formatAmountWithComma } from './utils.js';

let auditUnsubscribes = [];

export function unsubscribeAuditLogs() {
    auditUnsubscribes.forEach(unsub => {
        if (typeof unsub === 'function') unsub();
    });
    auditUnsubscribes = [];
}

/**
 * Logs an action to the audit trail.
 *
 * @param {string} action - The action performed (e.g., 'CREATE', 'UPDATE', 'DELETE')
 * @param {string} module - The module name (e.g., 'Ledger', 'Customers', 'Admin')
 * @param {string} entityId - ID of the entity affected
 * @param {string} entityName - Name or identifier of the entity
 * @param {Object} details - Additional context or data
 * @param {Object} changes - (Optional) { old: {}, new: {} } mapping of changed fields
 */
export async function auditLog(action, module, entityId, entityName, details = {}, changes = null) {
    try {
        const currentUser = firebase.auth().currentUser;

        const logEntry = {
            action: action, // CREATE, UPDATE, DELETE, LOGIN, EXPORT, etc.
            module: module,
            entityId: entityId || '',
            entityName: entityName || '',
            details: details || {},
            userEmail: currentUser ? currentUser.email : 'Unknown',
            userId: currentUser ? currentUser.uid : 'System',
            timestamp: firebase.firestore.FieldValue.serverTimestamp(),
            clientTimestamp: new Date().toISOString()
        };

        if (changes) {
            logEntry.changes = changes;
        }

        await AuditDAO.add(logEntry);
        console.log(`[Audit] ${action} on ${module} (${entityName}) logged successfully.`);
    } catch (error) {
        console.error("Failed to write audit log:", error);
    }
}

/**
 * Fetches recent audit logs.
 * @param {number} limit - Number of logs to fetch
 */
export async function getRecentAuditLogs(limitCount = 50) {
    try {
        return await AuditDAO.getRecent(limitCount);
    } catch (error) {
        console.error("Failed to fetch audit logs:", error);
        return [];
    }
}

window.auditLog = auditLog;
window.getRecentAuditLogs = getRecentAuditLogs;
window.unsubscribeAuditLogs = unsubscribeAuditLogs;

// Pagination State for Audit
let lastVisibleAudit = null;
let pageStackAudit = [];
let currentAuditPage = 1;
const auditPageSize = 20;

/**
 * Renders the Audit Logs view.
 */
export async function renderAuditLogs(container) {
    if (window.AppState.currentUserRole !== 'Admin') {
        container.innerHTML = `<div class="m3-card text-center font-bn"><h2 class="text-xl font-bold text-red-500">অ্যাক্সেস ডিনাইড! শুধুমাত্র অ্যাডমিন অডিট লগ দেখতে পারবেন।</h2></div>`;
        return;
    }

    unsubscribeAuditLogs();

    // Reset pagination
    lastVisibleAudit = null;
    pageStackAudit = [];
    currentAuditPage = 1;

    container.innerHTML = `
        <div class="flex flex-col gap-6 font-bn">
            <div class="px-2">
                <h2 class="text-2xl font-black flex items-center gap-4 tracking-tight text-white">
                    <div class="w-1.5 h-8 bg-emerald-600 rounded-full shadow-[0_0_15px_rgba(16,185,129,0.4)]"></div>
                    অডিট লগ (সিস্টেম অ্যাক্টিভিটি)
                </h2>
                <p class="text-slate-400 text-sm mt-1">সিস্টেমে হওয়া সকল পরিবর্তন এবং গুরুত্বপূর্ণ অ্যাকশন এখানে রেকর্ড করা থাকে।</p>
            </div>

            <div class="m3-card">
                <div class="m3-table-container overflow-x-auto">
                    <table class="m3-table w-full">
                        <thead>
                            <tr>
                                <th>তারিখ ও সময়</th>
                                <th>অ্যাকশন</th>
                                <th>মডিউল</th>
                                <th>ইউজার</th>
                                <th>বিবরণ / চেঞ্জেস</th>
                            </tr>
                        </thead>
                        <tbody id="audit-logs-list">
                            <tr><td colspan="5" class="text-center py-12 text-slate-400 italic"><i class="fa-solid fa-spinner fa-spin mr-2"></i>লোডিং...</td></tr>
                        </tbody>
                    </table>
                </div>
            </div>

            <!-- Pagination Controls -->
            <div id="audit-pagination" class="flex items-center justify-center gap-4 py-4 font-bn hidden">
                <button id="audit-prev-page" class="px-4 py-2 bg-slate-800 text-slate-300 rounded-xl border border-slate-700 hover:bg-slate-700 disabled:opacity-30 disabled:pointer-events-none transition-all" onclick="changeAuditPage('prev')">
                    <i class="fa-solid fa-chevron-left mr-2"></i> পূর্ববর্তী
                </button>
                <div class="text-white font-bold bg-blue-600/10 border border-blue-500/30 px-4 py-2 rounded-xl">
                    পৃষ্ঠা: <span id="audit-current-page-display">1</span>
                </div>
                <button id="audit-next-page" class="px-4 py-2 bg-slate-800 text-slate-300 rounded-xl border border-slate-700 hover:bg-slate-700 disabled:opacity-30 disabled:pointer-events-none transition-all" onclick="changeAuditPage('next')">
                    পরবর্তী <i class="fa-solid fa-chevron-right ml-2"></i>
                </button>
            </div>
        </div>
    `;

    loadAuditPage();
}

async function loadAuditPage(direction = 'next') {
    const tbody = document.getElementById('audit-logs-list');
    if (!tbody) return;

    tbody.innerHTML = '<tr><td colspan="5" class="text-center py-12"><i class="fa-solid fa-spinner fa-spin mr-2"></i>লোডিং...</td></tr>';

    try {
        const cursor = (direction === 'next') ? lastVisibleAudit : (pageStackAudit.length > 1 ? pageStackAudit[pageStackAudit.length - 2] : null);

        const results = await AuditDAO.getByPage(auditPageSize, cursor, 'timestamp', 'desc');

        lastVisibleAudit = results.lastDoc;
        if (direction === 'next') {
            if (cursor) pageStackAudit.push(cursor);
        } else {
            pageStackAudit.pop();
        }

        const paginationEl = document.getElementById('audit-pagination');
        if (paginationEl) {
            paginationEl.classList.remove('hidden');
            document.getElementById('audit-current-page-display').innerText = currentAuditPage;
            document.getElementById('audit-prev-page').disabled = currentAuditPage === 1;
            document.getElementById('audit-next-page').disabled = results.count < auditPageSize;
        }

        renderAuditRows(results.data, tbody);
    } catch (err) {
        console.error("Load audit logs error:", err);
        tbody.innerHTML = '<tr><td colspan="5" class="text-center py-12 text-red-400">ডাটা লোড করতে সমস্যা হয়েছে</td></tr>';
    }
}

function renderAuditRows(logs, tbody) {
    if (logs.length === 0) {
        tbody.innerHTML = '<tr><td colspan="5" class="text-center py-12 text-slate-500">কোনো অডিট লগ পাওয়া যায়নি।</td></tr>';
        return;
    }

    tbody.innerHTML = logs.map(log => {
        const ts = log.timestamp ? log.timestamp.toDate() : new Date(log.clientTimestamp);
        const timeStr = ts.toLocaleDateString('en-GB') + ' ' + ts.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });

        let detailsHtml = `<div class="text-xs text-slate-300 font-bold">${log.entityName || '-'}</div>`;
        if (log.changes) {
            detailsHtml += `
                <div class="mt-1 flex flex-col gap-0.5">
                    <div class="text-[10px] text-slate-500 font-black tracking-widest uppercase">Changes:</div>
                    <div class="flex gap-2 items-center text-[10px] font-sans">
                        <span class="text-red-400/80 bg-red-400/10 px-1 rounded line-through">Old: ${JSON.stringify(log.changes.old)}</span>
                        <i class="fa-solid fa-arrow-right text-[8px] text-slate-600"></i>
                        <span class="text-emerald-400 bg-emerald-400/10 px-1 rounded">New: ${JSON.stringify(log.changes.new)}</span>
                    </div>
                </div>
            `;
        } else if (log.details && Object.keys(log.details).length > 0) {
            detailsHtml += `<div class="text-[10px] text-slate-500 mt-1 font-sans">${JSON.stringify(log.details)}</div>`;
        }

        let actionBadge = '';
        if (log.action === 'CREATE') actionBadge = '<span class="bg-blue-500/20 text-blue-400 px-2 py-0.5 rounded text-[10px] font-black border border-blue-500/20">CREATE</span>';
        else if (log.action === 'UPDATE') actionBadge = '<span class="bg-amber-500/20 text-amber-400 px-2 py-0.5 rounded text-[10px] font-black border border-blue-500/20">UPDATE</span>';
        else if (log.action === 'DELETE') actionBadge = '<span class="bg-red-500/20 text-red-400 px-2 py-0.5 rounded text-[10px] font-black border border-red-500/20">DELETE</span>';
        else if (log.action === 'LOGIN') actionBadge = '<span class="bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded text-[10px] font-black border border-blue-500/20">LOGIN</span>';
        else if (log.action === 'LOGOUT') actionBadge = '<span class="bg-slate-700 text-slate-300 px-2 py-0.5 rounded text-[10px] font-black border border-slate-600">LOGOUT</span>';
        else actionBadge = `<span class="bg-slate-800 text-slate-400 px-2 py-0.5 rounded text-[10px] font-black border border-slate-700">${log.action}</span>`;

        return `
            <tr class="border-b border-slate-700/50 hover:bg-slate-700/20 transition-colors">
                <td class="p-3 text-[11px] text-slate-400 whitespace-nowrap font-sans">${timeStr}</td>
                <td class="p-3">${actionBadge}</td>
                <td class="p-3 text-xs font-bold text-slate-300 tracking-tight">${log.module}</td>
                <td class="p-3 text-[11px] text-blue-400 font-sans font-bold">${log.userEmail}</td>
                <td class="p-3 min-w-[200px]">${detailsHtml}</td>
            </tr>
        `;
    }).join('');
}

window.changeAuditPage = (dir) => {
    if (dir === 'next') currentAuditPage++;
    else currentAuditPage--;
    loadAuditPage(dir);
};

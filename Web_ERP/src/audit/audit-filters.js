/**
 * Audit Log Filtering and Query Logic
 * Filters logs by User, Action Type, Module, Date Range (From/To), and Keyword Search.
 */

export function filterAuditLogs(logs, { searchQuery = '', userFilter = '', actionFilter = '', moduleFilter = '', startDate = '', endDate = '' }) {
    if (!logs || !Array.isArray(logs)) return [];

    const q = searchQuery.trim().toLowerCase();
    const u = userFilter.trim().toLowerCase();
    const act = actionFilter.trim().toUpperCase();
    const mod = moduleFilter.trim().toLowerCase();

    return logs.filter(log => {
        const matchesUser = !u || (log.userEmail || '').toLowerCase().includes(u);
        const matchesAction = !act || (log.action || '').toUpperCase() === act;
        const matchesModule = !mod || (log.module || '').toLowerCase() === mod;

        const entity = (log.entityName || '').toLowerCase();
        const detailsStr = JSON.stringify(log.details || {}).toLowerCase();
        const changesStr = JSON.stringify(log.changes || {}).toLowerCase();
        const matchesQuery = !q || entity.includes(q) || detailsStr.includes(q) || changesStr.includes(q) || (log.userEmail || '').toLowerCase().includes(q);

        let matchesDateRange = true;
        if (startDate || endDate) {
            const ts = log.timestamp ? log.timestamp.toDate() : new Date(log.clientTimestamp || Date.now());
            const logDateStr = ts.toISOString().split('T')[0];

            if (startDate && logDateStr < startDate) matchesDateRange = false;
            if (endDate && logDateStr > endDate) matchesDateRange = false;
        }

        return matchesUser && matchesAction && matchesModule && matchesQuery && matchesDateRange;
    });
}

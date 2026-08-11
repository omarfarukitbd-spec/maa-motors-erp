/**
 * Audit Statistics Helper
 * Calculates summary metrics for audit dashboard overview.
 */

export function calculateAuditStats(logs) {
    if (!logs || !Array.isArray(logs)) {
        return { totalToday: 0, updatesToday: 0, deletesToday: 0, pinChangesToday: 0, activeUsersCount: 0 };
    }

    const todayStr = new Date().toISOString().split('T')[0];

    const todayLogs = logs.filter(log => {
        const ts = log.timestamp ? log.timestamp.toDate() : new Date(log.clientTimestamp || Date.now());
        return ts.toISOString().split('T')[0] === todayStr;
    });

    const activeUsers = new Set(todayLogs.map(l => l.userEmail).filter(Boolean));

    return {
        totalToday: todayLogs.length,
        updatesToday: todayLogs.filter(l => l.action === 'UPDATE').length,
        deletesToday: todayLogs.filter(l => l.action === 'DELETE').length,
        pinChangesToday: todayLogs.filter(l => l.action === 'PIN_CHANGE').length,
        activeUsersCount: activeUsers.size
    };
}

/**
 * Visual Diff Viewer for Audit Logs
 * Converts raw JSON change objects into formatted, color-coded visual representations.
 */

export function getDeviceBadgeHtml(log) {
    const isMobile = log.deviceInfo === 'Mobile' || (log.details && log.details.device === 'Mobile');
    if (isMobile) {
        return `<span class="inline-flex items-center gap-1 text-[10px] text-amber-400 bg-amber-400/10 border border-amber-400/20 px-1.5 py-0.5 rounded font-mono" title="Mobile Device"><i class="fa-solid fa-mobile-screen"></i> Mobile</span>`;
    }
    return `<span class="inline-flex items-center gap-1 text-[10px] text-sky-400 bg-sky-400/10 border border-sky-400/20 px-1.5 py-0.5 rounded font-mono" title="Desktop / PC"><i class="fa-solid fa-desktop"></i> Desktop</span>`;
}

export function renderVisualDiff(log) {
    if (!log) return '<span class="text-slate-500">-</span>';

    let html = `<div class="font-bn space-y-1">`;
    if (log.entityName) {
        html += `<div class="flex items-center gap-2 justify-between"><div class="text-xs font-black text-white tracking-tight">${log.entityName}</div>${getDeviceBadgeHtml(log)}</div>`;
    }

    if (log.changes) {
        const { old: oldData = {}, new: newData = {} } = log.changes;
        const allKeys = Array.from(new Set([...Object.keys(oldData), ...Object.keys(newData)]));

        if (allKeys.length > 0) {
            html += `<div class="mt-1 space-y-1 text-[11px] font-sans">`;
            allKeys.forEach(key => {
                const oldVal = oldData[key] !== undefined ? String(oldData[key]) : 'N/A';
                const newVal = newData[key] !== undefined ? String(newData[key]) : 'N/A';

                if (oldVal !== newVal) {
                    html += `
                        <div class="flex items-center gap-1.5 flex-wrap bg-slate-950/60 p-1.5 rounded-lg border border-slate-800">
                            <span class="text-[10px] font-black text-blue-400 uppercase font-mono">${key}:</span>
                            <span class="text-red-400 bg-red-500/10 border border-red-500/20 px-1.5 py-0.5 rounded line-through">${oldVal}</span>
                            <i class="fa-solid fa-arrow-right text-[9px] text-slate-500"></i>
                            <span class="text-emerald-400 bg-emerald-400/10 border border-emerald-400/20 px-1.5 py-0.5 rounded font-bold">${newVal}</span>
                        </div>
                    `;
                }
            });
            html += `</div>`;
        }
    } else if (log.details && Object.keys(log.details).length > 0) {
        const detailEntries = Object.entries(log.details)
            .map(([k, v]) => `<span class="text-slate-300"><strong class="text-slate-500">${k}:</strong> ${v}</span>`)
            .join(' • ');
        html += `<div class="text-[10px] text-slate-400 font-sans mt-0.5">${detailEntries}</div>`;
    }

    html += `</div>`;
    return html;
}

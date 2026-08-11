/**
 * Audit Log Excel Export Engine
 * Exports active or filtered audit logs directly to XLSX format.
 */

export function exportAuditLogsToExcel(logs) {
    if (!logs || logs.length === 0) {
        if (window.Swal) {
            window.Swal.fire('ফাঁকা লিস্ট', 'এক্সপোর্ট করার জন্য কোনো অডিট ডাটা পাওয়া যায়নি', 'warning');
        }
        return;
    }

    try {
        const exportData = logs.map((log, index) => {
            const ts = log.timestamp ? log.timestamp.toDate() : new Date(log.clientTimestamp || Date.now());
            const formattedTime = ts.toLocaleDateString('en-GB') + ' ' + ts.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });

            let changeSummary = '';
            if (log.changes) {
                changeSummary = `Old: ${JSON.stringify(log.changes.old)} => New: ${JSON.stringify(log.changes.new)}`;
            } else if (log.details) {
                changeSummary = JSON.stringify(log.details);
            }

            return {
                'SL': index + 1,
                'তারিখ ও সময়': formattedTime,
                'অ্যাকশন': log.action || '-',
                'মডিউল': log.module || '-',
                'ইউজার ইমেইল': log.userEmail || 'System',
                'এন্টিটি নেম': log.entityName || '-',
                'পরিবর্তনের বিবরণ': changeSummary
            };
        });

        const worksheet = window.XLSX.utils.json_to_sheet(exportData);
        const workbook = window.XLSX.utils.book_new();
        window.XLSX.utils.book_append_sheet(workbook, worksheet, "Audit Logs");

        const todayStr = new Date().toISOString().split('T')[0];
        window.XLSX.writeFile(workbook, `Maa_Motors_Audit_Logs_${todayStr}.xlsx`);

        if (window.Swal) {
            window.Swal.fire({
                title: '<i class="fa-solid fa-file-excel text-emerald-400 mr-2"></i>এক্সপোর্ট সফল!',
                text: `${logs.length} টি অডিট অ্যাকশন রিপোর্ট এক্সেলে সেভ হয়েছে।`,
                icon: 'success',
                customClass: { popup: '!bg-slate-900 !text-white !rounded-3xl border border-slate-700 font-bn' }
            });
        }
    } catch (err) {
        console.error("Audit export error:", err);
        if (window.Swal) {
            window.Swal.fire('এরর', 'এক্সপোর্ট করার সময় সমস্যা হয়েছে', 'error');
        }
    }
}

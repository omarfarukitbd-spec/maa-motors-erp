import Swal from 'sweetalert2';
import { firebase, db } from '../firebase-config.js';
import { promptSecurityPin } from '../utils.js';
import { auditLog } from '../audit.js';

export async function cleanupOldAuditLogs() {
    if (window.AppState?.currentUserRole !== 'Admin') {
        return Swal.fire('অ্যাক্সেস ডিনাইড!', 'শুধুমাত্র অ্যাডমিন এই কাজটি করতে পারবেন।', 'error');
    }

    const { value: months } = await Swal.fire({
        title: '<i class="fa-solid fa-broom text-amber-500 mr-2"></i>অডিট লগ ক্লিনআপ',
        html: `
            <div class="text-left font-bn space-y-4">
                <p class="text-xs text-slate-400">ডাটাবেস স্টোরেজ বাঁচাতে পুরোনো অডিট লগ মুছে ফেলুন। আপনি কতদিন আগের লগ মুছতে চান তা নির্বাচন করুন:</p>
                <select id="cleanup-months" class="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white outline-none focus:border-amber-500">
                    <option value="1">১ মাসের আগের সব লগ</option>
                    <option value="3">৩ মাসের আগের সব লগ</option>
                    <option value="6" selected>৬ মাসের আগের সব লগ</option>
                    <option value="12">১ বছরের আগের সব লগ</option>
                </select>
            </div>
        `,
        showCancelButton: true,
        confirmButtonText: 'পরবর্তী ধাপ',
        cancelButtonText: 'বাতিল',
        customClass: { popup: '!bg-slate-900 !text-white !rounded-3xl border border-slate-700 font-bn' },
        preConfirm: () => parseInt(document.getElementById('cleanup-months').value)
    });

    if (!months) return;

    const isPinValid = await promptSecurityPin("পুরোনো অডিট লগ মুছে ফেলা");
    if (!isPinValid) return;

    const confirmWipe = await Swal.fire({
        title: 'চূড়ান্ত ওয়ার্নিং',
        html: `<span class="font-bn text-sm text-red-400">আপনি <b>${months} মাস</b> এর পুরোনো সমস্ত অডিট লগ স্থায়ীভাবে মুছে ফেলতে যাচ্ছেন! এটি আর ফেরানো সম্ভব নয়।</span>`,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#ef4444',
        confirmButtonText: 'হ্যাঁ, মুছুন',
        cancelButtonText: 'বাতিল',
        customClass: { popup: '!bg-slate-900 !text-white !rounded-3xl border border-slate-700 font-bn' }
    });

    if (!confirmWipe.isConfirmed) return;

    Swal.fire({
        title: 'লগ মুছে ফেলা হচ্ছে...',
        html: '<div class="font-bn text-sm text-slate-300">দয়া করে ব্রাউজার বন্ধ করবেন না।</div>',
        allowOutsideClick: false,
        didOpen: () => Swal.showLoading(),
        customClass: { popup: '!bg-slate-900 !text-white !rounded-3xl border border-slate-700' }
    });

    try {
        const targetDate = new Date();
        targetDate.setMonth(targetDate.getMonth() - months);
        const targetTimestamp = firebase.firestore.Timestamp.fromDate(targetDate);

        // Fetch logs older than targetDate
        const snap = await db.collection('audit_logs')
            .where('timestamp', '<', targetTimestamp)
            .get();

        if (snap.empty) {
            return Swal.fire('তথ্য পাওয়া যায়নি', `${months} মাসের পুরোনো কোনো অডিট লগ ডাটাবেসে নেই।`, 'info');
        }

        let wipeBatch = db.batch();
        let wipeCount = 0;
        let totalDeleted = 0;

        for (const doc of snap.docs) {
            wipeBatch.delete(doc.ref);
            wipeCount++;
            totalDeleted++;
            if (wipeCount >= 400) {
                await wipeBatch.commit();
                wipeBatch = db.batch();
                wipeCount = 0;
            }
        }
        if (wipeCount > 0) {
            await wipeBatch.commit();
        }

        auditLog('CLEANUP', 'System', 'AuditLogs', `Deleted ${totalDeleted} logs older than ${months} months`);

        Swal.fire({
            title: 'সফল!',
            text: `সফলভাবে ${totalDeleted} টি পুরোনো অডিট লগ ডাটাবেস থেকে মুছে ফেলা হয়েছে।`,
            icon: 'success',
            customClass: { popup: '!bg-slate-900 !text-white !rounded-3xl border border-slate-700 font-bn' }
        });

    } catch (e) {
        console.error("Audit log cleanup error:", e);
        Swal.fire('Error', 'লগ মুছতে সমস্যা হয়েছে: ' + e.message, 'error');
    }
}

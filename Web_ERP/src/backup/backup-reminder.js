import Swal from 'sweetalert2';
import { SettingsDAO } from '../dao.js';

export async function checkBackupReminder() {
    try {
        const settings = await SettingsDAO.getAppSettings();
        const lastBackupIso = settings.lastDisasterBackupTimestamp;

        const now = new Date();
        let shouldWarn = false;
        let daysAgo = 0;

        if (!lastBackupIso) {
            shouldWarn = true;
            daysAgo = 'অনেক';
        } else {
            const lastBackupDate = new Date(lastBackupIso);
            const diffMs = now - lastBackupDate;
            const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
            
            if (diffDays >= 3) {
                shouldWarn = true;
                daysAgo = diffDays;
            }
        }

        if (shouldWarn) {
            Swal.fire({
                title: '<i class="fa-solid fa-triangle-exclamation text-red-500 mr-2 text-4xl mb-2 block"></i>বিপজ্জনক পরিস্থিতি!',
                html: `<p class="text-slate-300 text-sm">গত <b>${daysAgo} দিন</b> ধরে আপনার ডাটাবেসের কোনো डिजाস্টার রিকভারি ব্যাকআপ নেওয়া হয়নি!</p>
                       <p class="text-amber-400 font-bold mt-3 text-xs bg-amber-500/10 p-3 rounded-lg border border-amber-500/20">
                         দয়া করে এখনই এডমিন প্যানেলের "Advanced Disaster Recovery" সেকশন থেকে 1-Click Backup ডাউনলোড করে সুরক্ষিত স্থানে সংরক্ষণ করুন।
                       </p>`,
                icon: 'warning',
                confirmButtonText: 'ঠিক আছে, আমি ব্যাকআপ নিচ্ছি',
                confirmButtonColor: '#ef4444',
                customClass: {
                    popup: '!bg-slate-900 !text-white !rounded-3xl border border-red-500/50 shadow-2xl font-bn',
                    confirmButton: 'm3-btn-primary !bg-red-600 hover:!bg-red-500 !px-6 !py-2.5 rounded-xl font-bold text-sm'
                }
            });
        }
    } catch (error) {
        console.error("Backup reminder check failed:", error);
    }
}

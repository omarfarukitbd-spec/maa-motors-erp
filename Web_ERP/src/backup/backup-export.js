import Swal from 'sweetalert2';
import CryptoJS from 'crypto-js';
import { db } from '../firebase-config.js';
import { CustomerDAO, TransactionDAO } from '../dao.js';
import { promptSecurityPin } from '../utils.js';
import { auditLog } from '../audit.js';

/**
 * Advanced 1-Click Backup Export Engine
 */
export async function downloadFullSystemBackup() {
    if (window.AppState?.currentUserRole !== 'Admin') {
        return Swal.fire('অ্যাক্সেস ডিনাইড!', 'শুধুমাত্র অ্যাডমিন ব্যাকআপ নিতে পারবেন।', 'error');
    }

    const isPinValid = await promptSecurityPin("সম্পূর্ণ ডাটাবেস ব্যাকআপ ডাউনলোড", "fullSystemBackup");
    if (!isPinValid) return;

    const { value: backupPassword, isDismissed } = await Swal.fire({
        title: 'ব্যাকআপ এনক্রিপশন পাসওয়ার্ড',
        text: 'ফাইলের সুরক্ষার জন্য একটি পাসওয়ার্ড দিন। রিস্টোর করার সময় এই পাসওয়ার্ড লাগবে।',
        input: 'password',
        inputPlaceholder: 'আপনার গোপন পাসওয়ার্ড দিন',
        showCancelButton: true,
        confirmButtonText: 'ডাউনলোড শুরু করুন',
        cancelButtonText: 'বাতিল',
        customClass: { popup: '!bg-slate-900 !text-white !rounded-3xl border border-slate-700 font-bn' },
        inputValidator: (value) => {
            if (!value || value.length < 4) {
                return 'অন্তত ৪ অক্ষরের পাসওয়ার্ড দিতে হবে!';
            }
        }
    });

    if (isDismissed || !backupPassword) return;

    Swal.fire({
        title: 'ব্যাকআপ প্রস্তুত করা হচ্ছে...',
        text: 'দয়া করে অপেক্ষা করুন, পুরো ডাটাবেস এক্সপোর্ট হচ্ছে।',
        allowOutsideClick: false,
        didOpen: () => Swal.showLoading(),
        customClass: { popup: '!bg-slate-900 !text-white !rounded-3xl border border-slate-700 font-bn' }
    });

    try {
        const payload = {
            systemMeta: {
                version: "1.0.0",
                appName: "MAA MOTORS ERP",
                exportTimestamp: new Date().toISOString(),
                exportedBy: window.AppState?.currentUserEmail || 'Unknown',
            },
            collections: {}
        };

        const collectionsData = {};
        
        collectionsData.customers = await CustomerDAO.getAll();
        collectionsData.transactions = await TransactionDAO.getAll();
        
        const expSnap = await db.collection('expenses').get();
        collectionsData.expenses = [];
        expSnap.forEach(d => collectionsData.expenses.push({ id: d.id, ...d.data() }));

        const znSnap = await db.collection('zones').get();
        collectionsData.zones = [];
        znSnap.forEach(d => collectionsData.zones.push({ id: d.id, ...d.data() }));

        const usrSnap = await db.collection('users').get();
        collectionsData.users = [];
        usrSnap.forEach(d => collectionsData.users.push({ id: d.id, ...d.data() }));

        const setSnap = await db.collection('settings').get();
        collectionsData.settings = [];
        setSnap.forEach(d => collectionsData.settings.push({ id: d.id, ...d.data() }));

        // Convert Timestamps to ISO strings
        const sanitizeData = (dataArray) => {
            return dataArray.map(item => {
                const cleanItem = { ...item };
                Object.keys(cleanItem).forEach(key => {
                    if (cleanItem[key] && typeof cleanItem[key].toDate === 'function') {
                        cleanItem[key] = { _tType: 'timestamp', iso: cleanItem[key].toDate().toISOString() };
                    }
                });
                return cleanItem;
            });
        };

        let totalRecords = 0;
        for (const [key, arr] of Object.entries(collectionsData)) {
            payload.collections[key] = sanitizeData(arr);
            totalRecords += arr.length;
        }

        payload.systemMeta.totalRecords = totalRecords;
        
        // Generate Checksum
        const jsonString = JSON.stringify(payload);
        const checksum = CryptoJS.SHA256(jsonString).toString();
        payload.systemMeta.checksum = checksum;

        // Encrypt Payload
        const finalJsonString = JSON.stringify(payload);
        const encryptedData = CryptoJS.AES.encrypt(finalJsonString, backupPassword).toString();

        // Download Blob
        const blob = new Blob([encryptedData], { type: "text/plain;charset=utf-8" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        const dateStr = new Date().toISOString().split('T')[0];
        a.download = `Maa_Motors_ERP_Backup_${dateStr}.enc`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);

        auditLog('SYSTEM_BACKUP', 'Admin', 'Backup', 'Full Database Backup Downloaded');

        // Update last backup timestamp in Firestore
        await SettingsDAO.updateAppSettings({ lastDisasterBackupTimestamp: new Date().toISOString() });

        Swal.fire({
            title: 'সফল!',
            text: `মোট ${totalRecords} টি রেকর্ড সফলভাবে এনক্রিপ্ট করে ডাউনলোড করা হয়েছে।`,
            icon: 'success',
            customClass: { popup: '!bg-slate-900 !text-white !rounded-3xl border border-slate-700 font-bn' }
        });

    } catch (error) {
        console.error("Backup Export Error:", error);
        Swal.fire('Error', 'ব্যাকআপ জেনারেট করতে সমস্যা হয়েছে!', 'error');
    }
}

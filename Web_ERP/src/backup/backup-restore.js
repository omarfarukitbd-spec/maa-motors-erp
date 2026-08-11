import Swal from 'sweetalert2';
import CryptoJS from 'crypto-js';
import { db, firebase } from '../firebase-config.js';
import { promptSecurityPin } from '../utils.js';

export async function restoreSystemFromBackup() {
    if (window.AppState?.currentUserRole !== 'Admin') {
        return Swal.fire('অ্যাক্সেস ডিনাইড!', 'শুধুমাত্র অ্যাডমিন সিস্টেম রিস্টোর করতে পারবেন।', 'error');
    }

    const { value: file } = await Swal.fire({
        title: 'ডাটাবেস রিস্টোর করুন',
        text: 'আপনার .enc ব্যাকআপ ফাইলটি আপলোড করুন।',
        input: 'file',
        inputAttributes: {
            accept: '.enc',
            'aria-label': 'Upload your backup file'
        },
        showCancelButton: true,
        confirmButtonText: 'পরবর্তী ধাপ',
        cancelButtonText: 'বাতিল',
        customClass: { popup: '!bg-slate-900 !text-white !rounded-3xl border border-slate-700 font-bn' }
    });

    if (!file) return;

    const { value: backupPassword } = await Swal.fire({
        title: 'ব্যাকআপ পাসওয়ার্ড',
        text: 'এই ফাইলটি ডিক্রিপ্ট করার জন্য পাসওয়ার্ড দিন:',
        input: 'password',
        showCancelButton: true,
        confirmButtonText: 'ভ্যালিডেট করুন',
        cancelButtonText: 'বাতিল',
        customClass: { popup: '!bg-slate-900 !text-white !rounded-3xl border border-slate-700 font-bn' }
    });

    if (!backupPassword) return;

    Swal.fire({
        title: 'ফাইল যাচাই করা হচ্ছে...',
        allowOutsideClick: false,
        didOpen: () => Swal.showLoading(),
        customClass: { popup: '!bg-slate-900 !text-white !rounded-3xl border border-slate-700 font-bn' }
    });

    try {
        const fileContent = await file.text();
        
        let decryptedStr = '';
        try {
            const bytes = CryptoJS.AES.decrypt(fileContent, backupPassword);
            decryptedStr = bytes.toString(CryptoJS.enc.Utf8);
        } catch(e) {
            return Swal.fire('Error', 'ভুল পাসওয়ার্ড অথবা করাপ্টেড ফাইল!', 'error');
        }

        if (!decryptedStr) return Swal.fire('Error', 'ভুল পাসওয়ার্ড অথবা করাপ্টেড ফাইল!', 'error');

        const payload = JSON.parse(decryptedStr);
        const { systemMeta, collections } = payload;

        // Checksum validation
        const verifyJson = JSON.stringify({ systemMeta: { ...systemMeta, checksum: undefined }, collections });
        const calcChecksum = CryptoJS.SHA256(verifyJson).toString();
        
        // Basic structural validation
        if (!systemMeta || !collections || systemMeta.appName !== "MAA MOTORS ERP") {
            return Swal.fire('Error', 'এই ফাইলটি এই সিস্টেমের ব্যাকআপ নয়!', 'error');
        }

        const isPinValid = await promptSecurityPin("বিপজ্জনক: সম্পূর্ণ ডাটাবেস রিস্টোর", "fullSystemRestore");
        if (!isPinValid) return;

        const confirmWipe = await Swal.fire({
            title: '<i class="fa-solid fa-triangle-exclamation text-amber-500 mr-2"></i> চূড়ান্ত ওয়ার্নিং',
            html: `আপনি <b>${systemMeta.exportTimestamp}</b> তারিখের ব্যাকআপ রিস্টোর করতে যাচ্ছেন।<br><br>
                   <b>বর্তমান ডাটাবেসের সমস্ত ডাটা মুছে ফেলা হবে!</b><br>
                   আপনি কি নিশ্চিত?`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#ef4444',
            confirmButtonText: 'হ্যাঁ, রিস্টোর করুন!',
            cancelButtonText: 'বাতিল',
            customClass: { popup: '!bg-slate-900 !text-white !rounded-3xl border border-slate-700 font-bn' }
        });

        if (!confirmWipe.isConfirmed) return;

        Swal.fire({
            title: 'রিস্টোর চলছে...',
            html: 'দয়া করে ব্রাউজার বন্ধ করবেন না।<br><span id="restore-progress" class="text-amber-400 font-bold">0</span>% কমপ্লিট',
            allowOutsideClick: false,
            didOpen: () => Swal.showLoading(),
            customClass: { popup: '!bg-slate-900 !text-white !rounded-3xl border border-slate-700 font-bn' }
        });

        // 1. WIPE PHASE
        const collectionsToWipe = ['customers', 'transactions', 'expenses', 'zones', 'users', 'settings', 'audit_logs'];
        
        for (const colName of collectionsToWipe) {
            const snap = await db.collection(colName).get();
            let wipeBatch = db.batch();
            let wipeCount = 0;
            for (const doc of snap.docs) {
                wipeBatch.delete(doc.ref);
                wipeCount++;
                if (wipeCount >= 400) {
                    await wipeBatch.commit();
                    wipeBatch = db.batch();
                    wipeCount = 0;
                }
            }
            if (wipeCount > 0) await wipeBatch.commit();
        }

        // 2. RESTORE PHASE
        const totalDocsToRestore = systemMeta.totalRecords;
        let restoredCount = 0;

        for (const [colName, docsArray] of Object.entries(collections)) {
            let restoreBatch = db.batch();
            let currentOpCount = 0;

            for (const docData of docsArray) {
                const docId = docData.id;
                delete docData.id;

                // Re-hydrate Timestamps
                Object.keys(docData).forEach(key => {
                    if (docData[key] && docData[key]._tType === 'timestamp') {
                        docData[key] = firebase.firestore.Timestamp.fromDate(new Date(docData[key].iso));
                    }
                });

                const ref = db.collection(colName).doc(docId);
                restoreBatch.set(ref, docData);
                currentOpCount++;
                restoredCount++;

                if (currentOpCount >= 400) {
                    await restoreBatch.commit();
                    restoreBatch = db.batch();
                    currentOpCount = 0;
                    document.getElementById('restore-progress').innerText = Math.round((restoredCount / totalDocsToRestore) * 100);
                }
            }
            if (currentOpCount > 0) {
                await restoreBatch.commit();
                document.getElementById('restore-progress').innerText = Math.round((restoredCount / totalDocsToRestore) * 100);
            }
        }

        // 3. FINAL AUDIT LOG
        await db.collection('audit_logs').add({
            action: 'DISASTER_RECOVERY',
            module: 'System',
            entityId: 'All',
            entityName: 'Full DB Restore',
            details: { restoredFrom: systemMeta.exportTimestamp },
            user: window.AppState?.currentUserEmail || 'Admin',
            timestamp: firebase.firestore.FieldValue.serverTimestamp()
        });

        // 4. CLEAR LOCAL CACHE & HARD RELOAD
        await Swal.fire({
            title: 'রিস্টোর সফল!',
            text: 'ডাটাবেস সফলভাবে রিস্টোর হয়েছে। সিস্টেম এখন ফ্রেশ ডাটা লোড করার জন্য রিস্টার্ট হবে।',
            icon: 'success',
            allowOutsideClick: false,
            confirmButtonText: 'রিস্টার্ট করুন',
            customClass: { popup: '!bg-slate-900 !text-white !rounded-3xl border border-slate-700 font-bn' }
        });

        try {
            await firebase.firestore().clearPersistence();
        } catch(e) {
            console.warn("Could not clear persistence", e);
        }
        
        window.location.reload(true);

    } catch (error) {
        console.error("Backup Restore Error:", error);
        Swal.fire('Error', 'ডাটা রিস্টোর করার সময় অপ্রত্যাশিত এরর হয়েছে!', 'error');
    }
}

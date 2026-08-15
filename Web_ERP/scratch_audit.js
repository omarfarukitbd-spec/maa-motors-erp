const firebase = require('firebase/compat/app').default;
require('firebase/compat/firestore');

const firebaseConfig = {
    apiKey: "AIzaSyD2KJqHyT84ErCFpWKUSLEFXdvnQ1s9SfQ",
    projectId: "maa-motors-erp"
};

if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
}

const db = firebase.firestore();

async function audit() {
    try {
        const snap = await db.collection('transactions').where('date', '==', '2026-08-13').get();
        let totalPaid = 0;
        let methodTotals = {};
        let entries = [];
        let jomaEntriesCount = 0;

        snap.forEach(doc => {
            const data = doc.data();
            const paid = Number(data.paid) || 0;
            
            if (paid > 0) {
                totalPaid += paid;
                const method = data.receivedType || 'Bank';
                let actualMethod = (method === 'Cash') ? 'Cash' : (method === 'Less' ? 'Less' : (data.receivedFrom || 'Bank'));

                if (!methodTotals[actualMethod]) {
                    methodTotals[actualMethod] = 0;
                }
                methodTotals[actualMethod] += paid;
                
                entries.push({
                    id: doc.id,
                    type: data.type,
                    paid: paid,
                    method: actualMethod,
                    voucher: data.voucherNo
                });
            }

            if (data.type === 'payment' || data.type === 'Credit') {
                jomaEntriesCount++;
            }
        });

        console.log("=== AUDIT REPORT FOR 2026-08-13 ===");
        console.log(`Total Dashboard Collection (paid > 0): ৳ ${totalPaid}`);
        console.log("Method Totals:", methodTotals);
        console.log(`\nDetailed Entries (${entries.length} collections found):`);
        console.table(entries);
        
        console.log(`\nExplicit 'Joma/Credit' entries count: ${jomaEntriesCount}`);
        
        // Also check if there are explicit "Joma" entries that have paid == 0 (which would be a bug)
        const allJomaSnap = await db.collection('transactions').where('date', '==', '2026-08-13').get();
        let missedJoma = [];
        allJomaSnap.forEach(doc => {
            const d = doc.data();
            if ((d.type === 'payment' || d.type === 'Credit') && (Number(d.paid) || 0) === 0) {
                missedJoma.push({ id: doc.id, type: d.type, paid: d.paid, voucher: d.voucherNo });
            }
        });
        
        if (missedJoma.length > 0) {
            console.log("\nWARNING: Found Joma entries with paid=0 (These won't show in Dashboard Collections):");
            console.table(missedJoma);
        } else {
            console.log("\nNo Joma entries with paid=0 found.");
        }

        process.exit(0);
    } catch (e) {
        console.error("Error:", e);
        process.exit(1);
    }
}

audit();

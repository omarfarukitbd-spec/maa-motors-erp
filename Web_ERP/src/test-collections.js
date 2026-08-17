import { TransactionDAO } from './dao.js';
import { firebase } from './firebase-config.js';

async function run() {
    try {
        console.log("Querying for date: '2026-08-17'");
        const snap = await TransactionDAO.collection.where('date', '==', '2026-08-17').get();
        console.log(`Found ${snap.size} documents for 2026-08-17`);
        
        let total = 0;
        snap.forEach(doc => {
            const t = doc.data();
            const paid = Number(t.paid || 0);
            if (paid > 0 && t.receivedFrom) {
                total += paid;
                console.log(`- Collection: ${paid} from ${t.receivedFrom} (Customer: ${t.customerId})`);
            }
        });
        console.log(`Total Collection for 2026-08-17: ${total}`);
        process.exit(0);
    } catch (e) {
        console.error("Error:", e);
        process.exit(1);
    }
}

run();

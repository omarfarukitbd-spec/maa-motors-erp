import { db, firebase } from '../firebase-config.js';
import { CustomerDAO, TransactionDAO, SettingsDAO, ZoneDAO } from '../dao.js';
import Swal from 'sweetalert2';

/**
 * Smart Excel Sync Engine
 * Handles atomic transactions for customer creation and ledger syncing.
 */
export async function executeSmartSync(transactionsToSave, newCustomerNamesSet) {
    Swal.fire({
        title: 'ডাটা সেভ হচ্ছে...',
        text: 'কাস্টমার ও খতিয়ান ডাটাবেসে আপডেট করা হচ্ছে',
        allowOutsideClick: false,
        didOpen: () => Swal.showLoading(),
        customClass: { popup: '!bg-slate-900 !text-white !rounded-3xl border border-slate-700' }
    });

    try {
        // 1. Fetch current zones
        const zones = await ZoneDAO.getAllZones();
        const zoneMap = {};
        zones.forEach(z => zoneMap[z.name] = z);

        const createdCustomerMap = {}; // name -> { id, accountNo }

        // 2. Transaction: Create New Customers & Update Counters
        if (newCustomerNamesSet.size > 0) {
            const newNamesArr = Array.from(newCustomerNamesSet);
            await db.runTransaction(async t => {
                const counterDoc = await t.get(SettingsDAO.collection.doc('counters'));
                let zoneCounters = (counterDoc.exists && counterDoc.data().zoneCounters) ? counterDoc.data().zoneCounters : {};

                for (const cName of newNamesArr) {
                    const defaultZone = "General";
                    if (!zoneMap[defaultZone]) {
                        const zRef = ZoneDAO.getRef();
                        t.set(zRef, { name: defaultZone, code: "10", createdAt: firebase.firestore.FieldValue.serverTimestamp() });
                        zoneMap[defaultZone] = { name: defaultZone, code: "10" };
                    }

                    const zInfo = zoneMap[defaultZone];
                    let nextNo = (zoneCounters[defaultZone] || 0) + 1;
                    zoneCounters[defaultZone] = nextNo;

                    const accNo = zInfo.code + String(nextNo).padStart(4, '0');
                    const cRef = CustomerDAO.getRef();

                    t.set(cRef, {
                        name: cName, phone: '', address: '', zone: defaultZone,
                        accountNo: accNo, totalDue: 0,
                        createdAt: firebase.firestore.FieldValue.serverTimestamp()
                    });
                    createdCustomerMap[cName] = { id: cRef.id, accountNo: accNo };
                }
                t.set(SettingsDAO.collection.doc('counters'), { zoneCounters }, { merge: true });
            });
        }

        // 3. Batch Save Transactions (Optimized for Speed & Integrity)
        // Group transactions by customer to calculate running balances in memory
        const customerTransactions = {};
        for (const item of transactionsToSave) {
            const custId = item.matchedCustId || createdCustomerMap[item.customerName]?.id;
            if (!custId) continue;
            if (!customerTransactions[custId]) customerTransactions[custId] = [];
            customerTransactions[custId].push(item);
        }

        const custIds = Object.keys(customerTransactions);
        let batch = db.batch();
        let operationCount = 0;

        for (const custId of custIds) {
            const custRef = CustomerDAO.getRef(custId);
            const cDoc = await custRef.get(); // Read once per customer
            let runningDue = cDoc.exists ? (cDoc.data().totalDue || 0) : 0;

            const txns = customerTransactions[custId];
            for (const item of txns) {
                const prevDue = runningDue;
                runningDue = prevDue + item.bill - item.paid;

                const txnRef = TransactionDAO.getRef();
                batch.set(txnRef, {
                    customerId: custId,
                    customerName: item.customerName,
                    date: item.date,
                    voucherNo: item.voucher,
                    bill: item.bill,
                    paid: item.paid,
                    receivedType: item.receivedType,
                    receivedFrom: item.receivedFrom,
                    prevDue: prevDue,
                    currentDue: runningDue,
                    createdBy: (firebase.auth().currentUser?.email || 'Admin Excel Import'),
                    createdAt: firebase.firestore.FieldValue.serverTimestamp()
                });
                operationCount++;

                // Check batch limit (500 ops)
                if (operationCount >= 490) {
                    await batch.commit();
                    batch = db.batch();
                    operationCount = 0;
                }
            }

            const initialDue = cDoc.exists ? (cDoc.data().totalDue || 0) : 0;
            const diffDelta = runningDue - initialDue;

            // Update final customer balance
            batch.update(custRef, { totalDue: firebase.firestore.FieldValue.increment(diffDelta) });
            operationCount++;

            if (operationCount >= 490) {
                await batch.commit();
                batch = db.batch();
                operationCount = 0;
            }
        }

        if (operationCount > 0) {
            await batch.commit();
        }

        return true;
    } catch (error) {
        console.error("Sync Engine Error:", error);
        throw error;
    }
}

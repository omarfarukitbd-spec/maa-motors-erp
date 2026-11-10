/**
 * Dubai Procurement - Container Port, Customs Duty & C&F Data Access Object (DAO)
 * Manages Firestore collection `dubai_port_duty_bills` for Consignment 1 container clearance bills.
 */

import { db, firebase } from '../firebase-config.js';
import { toDBDate } from '../utils.js';

const PORT_DUTY_COLLECTION = 'dubai_port_duty_bills';

export const DubaiPortDutyDAO = {
    /**
     * Real-time listener for container port & duty bills belonging to a consignment
     * @param {string} consignmentId
     * @param {Function} callback
     * @returns {Function} unsubscribe
     */
    listenPortDutyBills(consignmentId, callback) {
        return db.collection(PORT_DUTY_COLLECTION)
            .onSnapshot(snap => {
                const results = [];
                snap.forEach(doc => {
                    const data = doc.data();
                    if (!consignmentId || data.consignmentId === consignmentId) {
                        results.push({ id: doc.id, ...data });
                    }
                });
                results.sort((a, b) => {
                    if ((a.orderIndex || 0) !== (b.orderIndex || 0)) {
                        return (a.orderIndex || 0) - (b.orderIndex || 0);
                    }
                    return (a.date || '').localeCompare(b.date || '');
                });
                callback(results);
            }, err => {
                console.error('Error listening to dubai port duty bills:', err);
            });
    },

    /**
     * Save or update a container port & duty bill
     * @param {Object} data
     * @returns {Promise<string>}
     */
    async savePortDutyBill(data) {
        try {
            const id = data.id || `CONT-DUTY-${Date.now()}`;
            const docRef = db.collection(PORT_DUTY_COLLECTION).doc(id);
            const payload = {
                ...data,
                id,
                date: toDBDate(data.date),
                amount: Number(data.amount) || 0,
                updatedAt: firebase.firestore.FieldValue.serverTimestamp()
            };
            if (!data.id) {
                payload.createdAt = firebase.firestore.FieldValue.serverTimestamp();
            }
            await docRef.set(payload, { merge: true });
            return id;
        } catch (e) {
            console.error('Error saving container port duty bill:', e);
            throw e;
        }
    },

    /**
     * Delete a container port duty bill
     * @param {string} id
     */
    async deletePortDutyBill(id) {
        try {
            await db.collection(PORT_DUTY_COLLECTION).doc(id).delete();
        } catch (e) {
            console.error('Error deleting container port duty bill:', e);
            throw e;
        }
    },

    /**
     * Seed initial 7 user-verified container clearance bills from Register Page 0004
     * @param {boolean} force
     */
    async seedInitialDataIfNeeded(force = false) {
        try {
            const consId = 'CONSIGNMENT-01';

            if (!force) {
                const snap = await db.collection(PORT_DUTY_COLLECTION).limit(1).get();
                if (!snap.empty) {
                    return; // Already seeded!
                }
            }

            const initialBills = [
                { orderIndex: 1, date: '2025-11-05', containerNo: '১ নং কন্টেইনার', size: '—', agent: 'আরমান (আরিয়ান)', description: 'কন্টেইনার ডিউটি, সিএন্ডএফ ও পোর্ট বিল', amount: 3800000, status: 'চূড়ান্ত পরিশোধিত' },
                { orderIndex: 2, date: '2025-12-04', containerNo: '২ নং কন্টেইনার', size: '—', agent: 'আরমান (আরিয়ান)', description: 'কন্টেইনার ডিউটি, সিএন্ডএফ ও পোর্ট বিল', amount: 3580000, status: 'চূড়ান্ত পরিশোধিত' },
                { orderIndex: 3, date: '2025-12-18', containerNo: '৩ নং কন্টেইনার', size: '40 FT', agent: 'আরমান', description: 'কন্টেইনার ডিউটি, সিএন্ডএফ ও পোর্ট বিল', amount: 3500000, status: 'চূড়ান্ত পরিশোধিত' },
                { orderIndex: 4, date: '2026-01-26', containerNo: '৪ নং কন্টেইনার', size: '40 FT', agent: 'আরমান ও মিতুল', description: 'কন্টেইনার ডিউটি, সিএন্ডএফ ও পোর্ট বিল', amount: 3504236, status: 'চূড়ান্ত পরিশোধিত' },
                { orderIndex: 5, date: '2026-02-24', containerNo: '৫ নং কন্টেইনার', size: '—', agent: 'আরমান ও মিতুল', description: 'কন্টেইনার ডিউটি, সিএন্ডএফ ও পোর্ট বিল', amount: 2987439, status: 'চূড়ান্ত পরিশোধিত' },
                { orderIndex: 6, date: '2026-08-29', containerNo: '৬ নং কন্টেইনার', size: '40 FT', agent: 'আরমান ও মিতুল', description: 'কন্টেইনার ডিউটি, সিএন্ডএফ ও পোর্ট বিল', amount: 3332401, status: 'চূড়ান্ত পরিশোধিত' },
                { orderIndex: 7, date: '2026-10-21', containerNo: '৭ নং কন্টেইনার', size: '40 FT', agent: 'আরমান ও মিতুল', description: 'কন্টেইনার ডিউটি, সিএন্ডএফ ও পোর্ট বিল', amount: 4446637, status: 'চূড়ান্ত পরিশোধিত' }
            ];

            const batch = db.batch();
            initialBills.forEach((bill, idx) => {
                const docId = `CONT-DUTY-001-${String(idx + 1).padStart(3, '0')}`;
                const ref = db.collection(PORT_DUTY_COLLECTION).doc(docId);
                batch.set(ref, {
                    ...bill,
                    id: docId,
                    consignmentId: consId,
                    createdAt: firebase.firestore.FieldValue.serverTimestamp(),
                    updatedAt: firebase.firestore.FieldValue.serverTimestamp()
                });
            });

            await batch.commit();
        } catch (e) {
            console.error('Error seeding initial container port duty bills:', e);
        }
    }
};

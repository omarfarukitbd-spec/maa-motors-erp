/**
 * Dubai Procurement - Container L/C Margin & Bank Expense Data Access Object (DAO)
 * Manages Firestore collection `dubai_lc_bills` using Parent-Child Container Sub-Ledger structure.
 */

import { db, firebase } from '../firebase-config.js';
import { toDBDate, safeRound } from '../utils.js';
import { calculateContainerLCTotals } from './dubai-lc-calc.js';

const LC_COLLECTION = 'dubai_lc_bills';

export const DubaiLCDAO = {
    /**
     * Real-time listener for container L/C bills belonging to a consignment
     * @param {string} consignmentId
     * @param {Function} callback
     * @returns {Function} unsubscribe
     */
    listenLCBills(consignmentId, callback) {
        return db.collection(LC_COLLECTION)
            .onSnapshot(snap => {
                const results = [];
                snap.forEach(doc => {
                    const data = doc.data();
                    if (!consignmentId || data.consignmentId === consignmentId) {
                        results.push({ id: doc.id, ...data });
                    }
                });
                results.sort((a, b) => {
                    const orderA = Number(a.containerNo || a.orderIndex || 0);
                    const orderB = Number(b.containerNo || b.orderIndex || 0);
                    if (orderA !== orderB) {
                        return orderA - orderB;
                    }
                    return (a.lcNo || '').localeCompare(b.lcNo || '');
                });
                callback(results);
            }, err => {
                console.error('Error listening to dubai L/C bills:', err);
            });
    },

    /**
     * Save or update a complete container L/C record
     * @param {Object} data
     * @returns {Promise<string>}
     */
    async saveContainerLC(data) {
        try {
            const containerNo = Number(data.containerNo) || 1;
            const id = data.id || `LC-CONT-${String(containerNo).padStart(2, '0')}-${Date.now()}`;
            const docRef = db.collection(LC_COLLECTION).doc(id);

            const normalizedPayments = (Array.isArray(data.payments) ? data.payments : []).map(p => ({
                id: p.id || `PAY-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
                date: toDBDate(p.date),
                description: (p.description || 'এলসি পেমেন্ট').trim(),
                amountUSD: safeRound(Number(p.amountUSD) || 0),
                amountBDT: safeRound(Number(p.amountBDT) || 0)
            }));

            normalizedPayments.sort((a, b) => (a.date || '').localeCompare(b.date || ''));
            const totals = calculateContainerLCTotals(normalizedPayments);

            const deliveryDateDB = data.deliveryDate ? toDBDate(data.deliveryDate) : '';

            const payload = {
                id,
                consignmentId: data.consignmentId || 'CONSIGNMENT-01',
                orderIndex: containerNo,
                containerNo,
                lcNo: (data.lcNo || '').trim(),
                company: (data.company || '').trim(),
                deliveryDate: deliveryDateDB,
                isSettled: Boolean(data.isSettled || deliveryDateDB !== ''),
                payments: normalizedPayments,
                totalUSD: totals.totalUSD,
                totalBDT: totals.totalBDT,
                notes: (data.notes || '').trim(),
                updatedAt: firebase.firestore.FieldValue.serverTimestamp()
            };

            if (!data.id) {
                payload.createdAt = firebase.firestore.FieldValue.serverTimestamp();
            }

            await docRef.set(payload, { merge: true });
            return id;
        } catch (e) {
            console.error('Error saving container L/C record:', e);
            throw e;
        }
    },

    /**
     * Add a new dated payment/expense line to an existing container L/C
     * @param {string} containerId
     * @param {Object} paymentItem
     */
    async addPaymentLine(containerId, paymentItem) {
        try {
            const docRef = db.collection(LC_COLLECTION).doc(containerId);
            const snap = await docRef.get();
            if (!snap.exists) {
                throw new Error('কন্টেইনার রেকর্ড পাওয়া যায়নি!');
            }

            const data = snap.data();
            const existingPayments = Array.isArray(data.payments) ? [...data.payments] : [];
            const newLine = {
                id: `PAY-${Date.now()}`,
                date: toDBDate(paymentItem.date),
                description: (paymentItem.description || 'অতিরিক্ত এলসি পেমেন্ট').trim(),
                amountUSD: safeRound(Number(paymentItem.amountUSD) || 0),
                amountBDT: safeRound(Number(paymentItem.amountBDT) || 0)
            };

            existingPayments.push(newLine);
            existingPayments.sort((a, b) => (a.date || '').localeCompare(b.date || ''));

            const totals = calculateContainerLCTotals(existingPayments);

            await docRef.update({
                payments: existingPayments,
                totalUSD: totals.totalUSD,
                totalBDT: totals.totalBDT,
                updatedAt: firebase.firestore.FieldValue.serverTimestamp()
            });
        } catch (e) {
            console.error('Error adding payment line to container L/C:', e);
            throw e;
        }
    },

    /**
     * Update a specific payment line inside a container L/C
     * @param {string} containerId
     * @param {string} paymentId
     * @param {Object} updatedFields
     */
    async updatePaymentLine(containerId, paymentId, updatedFields) {
        try {
            const docRef = db.collection(LC_COLLECTION).doc(containerId);
            const snap = await docRef.get();
            if (!snap.exists) {
                throw new Error('কন্টেইনার রেকর্ড পাওয়া যায়নি!');
            }

            const data = snap.data();
            const payments = (Array.isArray(data.payments) ? data.payments : []).map(p => {
                if (p.id === paymentId) {
                    return {
                        ...p,
                        date: toDBDate(updatedFields.date ?? p.date),
                        description: (updatedFields.description ?? p.description).trim(),
                        amountUSD: safeRound(Number(updatedFields.amountUSD ?? p.amountUSD) || 0),
                        amountBDT: safeRound(Number(updatedFields.amountBDT ?? p.amountBDT) || 0)
                    };
                }
                return p;
            });

            payments.sort((a, b) => (a.date || '').localeCompare(b.date || ''));
            const totals = calculateContainerLCTotals(payments);

            await docRef.update({
                payments,
                totalUSD: totals.totalUSD,
                totalBDT: totals.totalBDT,
                updatedAt: firebase.firestore.FieldValue.serverTimestamp()
            });
        } catch (e) {
            console.error('Error updating container L/C payment line:', e);
            throw e;
        }
    },

    /**
     * Delete a specific payment line from a container L/C
     * @param {string} containerId
     * @param {string} paymentId
     */
    async deletePaymentLine(containerId, paymentId) {
        try {
            const docRef = db.collection(LC_COLLECTION).doc(containerId);
            const snap = await docRef.get();
            if (!snap.exists) {
                throw new Error('কন্টেইনার রেকর্ড পাওয়া যায়নি!');
            }

            const data = snap.data();
            const payments = (Array.isArray(data.payments) ? data.payments : []).filter(p => p.id !== paymentId);
            const totals = calculateContainerLCTotals(payments);

            await docRef.update({
                payments,
                totalUSD: totals.totalUSD,
                totalBDT: totals.totalBDT,
                updatedAt: firebase.firestore.FieldValue.serverTimestamp()
            });
        } catch (e) {
            console.error('Error deleting container L/C payment line:', e);
            throw e;
        }
    },

    /**
     * Update only the delivery date of a container L/C
     * @param {string} containerId
     * @param {string} deliveryDate
     */
    async updateDeliveryDate(containerId, deliveryDate) {
        try {
            const dbDate = deliveryDate && String(deliveryDate).trim() !== '' ? toDBDate(deliveryDate) : '';
            await db.collection(LC_COLLECTION).doc(containerId).update({
                deliveryDate: dbDate,
                isSettled: dbDate !== '',
                updatedAt: firebase.firestore.FieldValue.serverTimestamp()
            });
        } catch (e) {
            console.error('Error updating container delivery date:', e);
            throw e;
        }
    },

    /**
     * Delete an entire container L/C document
     * @param {string} containerId
     */
    async deleteContainerLC(containerId) {
        try {
            await db.collection(LC_COLLECTION).doc(containerId).delete();
        } catch (e) {
            console.error('Error deleting container L/C bill:', e);
            throw e;
        }
    },

    /**
     * Seed initial 9 user-verified container L/C sub-ledgers from Register Page 0003
     * @param {boolean} force
     */
    async seedInitialDataIfNeeded(force = false) {
        try {
            const consId = 'CONSIGNMENT-01';

            if (!force) {
                const snap = await db.collection(LC_COLLECTION).limit(1).get();
                if (!snap.empty) {
                    return; // Already seeded
                }
            }

            const initialContainers = [
                {
                    id: 'LC-CONT-01',
                    orderIndex: 1,
                    containerNo: 1,
                    lcNo: '10541',
                    company: 'আরিয়ান মো: ওয়ার্কশপ',
                    deliveryDate: '',
                    isSettled: false,
                    notes: 'মালিক বেলাল হোসেন স্বাক্ষরিত ০৩/১১/২৫',
                    payments: [
                        { id: 'P1-1', date: '2025-10-21', description: 'মূল এলসি ওপেনিং পেমেন্ট', amountUSD: 4530, amountBDT: 350000 },
                        { id: 'P1-2', date: '2025-10-31', description: 'ক্যাশ এলসি পেমেন্ট আরিয়ান', amountUSD: 0, amountBDT: 15550 }
                    ]
                },
                {
                    id: 'LC-CONT-02',
                    orderIndex: 2,
                    containerNo: 2,
                    lcNo: '10602',
                    company: 'আরিয়ান মো: ওয়ার্কশপ',
                    deliveryDate: '',
                    isSettled: false,
                    notes: 'মালিক স্বাক্ষরিত ০৪/১১/২৫',
                    payments: [
                        { id: 'P2-1', date: '2025-10-30', description: 'মূল এলসি ওপেনিং পেমেন্ট', amountUSD: 4620, amountBDT: 550000 },
                        { id: 'P2-2', date: '2025-11-04', description: 'ক্যাশ এলসি পেমেন্ট আরিয়ান', amountUSD: 0, amountBDT: 14000 }
                    ]
                },
                {
                    id: 'LC-CONT-03',
                    orderIndex: 3,
                    containerNo: 3,
                    lcNo: '10641',
                    company: 'আরিয়ান মো: ওয়ার্কশপ (আরমান)',
                    deliveryDate: '',
                    isSettled: false,
                    notes: 'হলুদ হাইলাইট: আরিয়ান LC ১৫,০০০ টাকা আরমান',
                    payments: [
                        { id: 'P3-1', date: '2025-11-17', description: 'মূল এলসি ওপেনিং পেমেন্ট', amountUSD: 6110, amountBDT: 750000 },
                        { id: 'P3-2', date: '2025-12-18', description: 'ক্যাশ এলসি পেমেন্ট আরিয়ান', amountUSD: 0, amountBDT: 10000 }
                    ]
                },
                {
                    id: 'LC-CONT-04',
                    orderIndex: 4,
                    containerNo: 4,
                    lcNo: '10701',
                    company: 'আরিয়ান মো: ওয়ার্কশপ',
                    deliveryDate: '',
                    isSettled: false,
                    notes: 'সম্পূর্ণ হিসাব এলসি মার্টিনের সাথে কথা হয়েছে (Paid 26/01/26)',
                    payments: [
                        { id: 'P4-1', date: '2025-12-19', description: 'সম্পূর্ণ এলসি ও সেটেলমেন্ট (Paid 26/01/26)', amountUSD: 5725, amountBDT: 900000 }
                    ]
                },
                {
                    id: 'LC-CONT-05',
                    orderIndex: 5,
                    containerNo: 5,
                    lcNo: '10646',
                    company: 'আরিয়ান মোটর',
                    deliveryDate: '',
                    isSettled: false,
                    notes: 'Paid 03/03/26, মালিক স্বাক্ষরিত',
                    payments: [
                        { id: 'P5-1', date: '2026-01-22', description: 'এলসি ক্লিয়ারেন্স ও সেটেলমেন্ট (Paid 03/03/26)', amountUSD: 5780, amountBDT: 700000 }
                    ]
                },
                {
                    id: 'LC-CONT-06',
                    orderIndex: 6,
                    containerNo: 6,
                    lcNo: '10354',
                    company: 'আরিয়ান মোট: ওয়ার্কশপ',
                    deliveryDate: '',
                    isSettled: false,
                    notes: 'মালিক বেলাল হোসাইন স্বাক্ষরিত ০৩/০৭/২৬',
                    payments: [
                        { id: 'P6-1', date: '2026-06-23', description: 'মূল এলসি ওপেনিং পেমেন্ট', amountUSD: 5141, amountBDT: 600000 },
                        { id: 'P6-2', date: '2026-07-03', description: 'অতিরিক্ত চার্জ ও ক্যাশ পেমেন্ট', amountUSD: 0, amountBDT: 20000 }
                    ]
                },
                {
                    id: 'LC-CONT-07',
                    orderIndex: 7,
                    containerNo: 7,
                    lcNo: '10395',
                    company: 'আরিয়ান মোটর ওয়ার্কশপ',
                    deliveryDate: '',
                    isSettled: false,
                    notes: 'M/S. MAA MOTORS Proprietor স্বাক্ষরিত',
                    payments: [
                        { id: 'P7-1', date: '2026-08-15', description: 'মূল এলসি ওপেনিং পেমেন্ট', amountUSD: 4805, amountBDT: 700000 },
                        { id: 'P7-2', date: '2026-09-05', description: 'অতিরিক্ত চার্জ ও ক্যাশ পেমেন্ট', amountUSD: 0, amountBDT: 10850 }
                    ]
                },
                {
                    id: 'LC-CONT-08',
                    orderIndex: 8,
                    containerNo: 8,
                    lcNo: '10476',
                    company: 'আরিয়ান মোটর ওয়ার্ক',
                    deliveryDate: '',
                    isSettled: false,
                    notes: 'সার্কেল ৮ নং কন্টেইনার',
                    payments: [
                        { id: 'P8-1', date: '2026-10-01', description: 'এলসি পেমেন্ট', amountUSD: 5169, amountBDT: 600000 }
                    ]
                },
                {
                    id: 'LC-CONT-09',
                    orderIndex: 9,
                    containerNo: 9,
                    lcNo: '10542',
                    company: 'আরিয়ান মোটর (N) / এমরান',
                    deliveryDate: '',
                    isSettled: false,
                    notes: 'সার্কেল ৯ নং, এমরান মারফত আরিয়ান মোটরকে প্রদান',
                    payments: [
                        { id: 'P9-1', date: '2026-11-09', description: 'এমরান মারফত আরিয়ান মোটরকে প্রদান', amountUSD: 0, amountBDT: 800000 }
                    ]
                }
            ];

            const batch = db.batch();
            for (const c of initialContainers) {
                const totals = calculateContainerLCTotals(c.payments);
                const docRef = db.collection(LC_COLLECTION).doc(c.id);
                batch.set(docRef, {
                    ...c,
                    consignmentId: consId,
                    totalUSD: totals.totalUSD,
                    totalBDT: totals.totalBDT,
                    createdAt: firebase.firestore.FieldValue.serverTimestamp(),
                    updatedAt: firebase.firestore.FieldValue.serverTimestamp()
                });
            }

            await batch.commit();
        } catch (e) {
            console.error('Error seeding container L/C bills:', e);
        }
    }
};

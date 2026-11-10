/**
 * Dubai Procurement - Bangladesh Landed Expenses Data Access Object (DAO)
 * Manages Firestore collection `dubai_bd_expenses` for Consignment 1 local expenses.
 */

import { db, firebase } from '../firebase-config.js';
import { toDBDate } from '../utils.js';

const BD_EXPENSES_COLLECTION = 'dubai_bd_expenses';
const CONSIGNMENTS_COLLECTION = 'dubai_consignments';

export const DubaiBDExpenseDAO = {
    /**
     * Real-time listener for Bangladesh expenses belonging to a consignment
     * @param {string} consignmentId
     * @param {Function} callback
     * @returns {Function} unsubscribe
     */
    listenBDExpenses(consignmentId, callback) {
        return db.collection(BD_EXPENSES_COLLECTION)
            .onSnapshot(snap => {
                const results = [];
                snap.forEach(doc => {
                    const data = doc.data();
                    if (!consignmentId || data.consignmentId === consignmentId) {
                        results.push({ id: doc.id, ...data });
                    }
                });
                results.sort((a, b) => {
                    const dateDiff = (a.date || '').localeCompare(b.date || '');
                    if (dateDiff !== 0) return dateDiff;
                    return (a.orderIndex || 0) - (b.orderIndex || 0);
                });
                callback(results);
            }, err => {
                console.error('Error listening to dubai BD expenses:', err);
            });
    },

    /**
     * Save or update a Bangladesh expense entry
     * @param {Object} data
     * @returns {Promise<string>}
     */
    async saveBDExpense(data) {
        try {
            const id = data.id || `BD-EXP-${Date.now()}`;
            const docRef = db.collection(BD_EXPENSES_COLLECTION).doc(id);
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
            console.error('Error saving BD expense entry:', e);
            throw e;
        }
    },

    /**
     * Delete an expense entry
     * @param {string} id
     */
    async deleteBDExpense(id) {
        try {
            await db.collection(BD_EXPENSES_COLLECTION).doc(id).delete();
        } catch (e) {
            console.error('Error deleting BD expense entry:', e);
            throw e;
        }
    },

    /**
     * Update Consignment B/F metadata
     * @param {string} consignmentId
     * @param {number} bfAmount
     */
    async updateConsignmentBf(consignmentId, bfAmount) {
        try {
            const docRef = db.collection(CONSIGNMENTS_COLLECTION).doc(consignmentId);
            await docRef.set({
                initialBfAmount: Number(bfAmount) || 0,
                updatedAt: firebase.firestore.FieldValue.serverTimestamp()
            }, { merge: true });
        } catch (e) {
            console.error('Error updating consignment B/F:', e);
            throw e;
        }
    },

    /**
     * Seed initial 19 user-verified Bangladesh expenses from Register Page 0002
     * @param {boolean} force
     */
    async seedInitialDataIfNeeded(force = false) {
        try {
            const consId = 'CONSIGNMENT-01';
            
            // Ensure consignment document has B/F configured
            const consRef = db.collection(CONSIGNMENTS_COLLECTION).doc(consId);
            await consRef.set({
                initialBfAmount: 30303773,
                bfStartDate: '2025-11-01',
                bfEndDate: '2026-08-06',
                updatedAt: firebase.firestore.FieldValue.serverTimestamp()
            }, { merge: true });

            if (!force) {
                const snap = await db.collection(BD_EXPENSES_COLLECTION).limit(1).get();
                if (!snap.empty) {
                    return; // Already seeded!
                }
            }

            const initialBDExpenses = [
                { orderIndex: 1, date: '2026-08-29', description: 'আলতাফ চালানী ৬ নং', category: 'চালানি কেরিং', memo: 'চালান-৬', amount: 1223000, status: 'চূড়ান্ত পরিশোধিত' },
                { orderIndex: 2, date: '2026-08-29', description: 'আলতাফ চালানী ৫ নং', category: 'চালানি কেরিং', memo: 'চালান-৫', amount: 560000, status: 'চূড়ান্ত পরিশোধিত' },
                { orderIndex: 3, date: '2026-08-29', description: 'নয়ন নাহার মোটর মাল ক্রয় (ইঞ্জিন ১৫ পিস)', category: 'স্থানীয় মাল ক্রয়', memo: '—', amount: 2500000, status: 'চূড়ান্ত পরিশোধিত' },
                { orderIndex: 4, date: '2026-08-31', description: 'আগস্ট মাস গোডাউন খরচ', category: 'গোডাউন খরচ', memo: '—', amount: 633355, status: 'চূড়ান্ত পরিশোধিত' },
                { orderIndex: 5, date: '2026-09-07', description: 'সাদেক ৬ নং কনটেইনার খরচ', category: 'কন্টেইনার খরচ', memo: '২নং কন্টেইনার', amount: 1061251, status: 'চূড়ান্ত পরিশোধিত' },
                { orderIndex: 6, date: '2026-09-16', description: 'সুমাইয়া মোটর হতে মাল ক্রয়', category: 'স্থানীয় মাল ক্রয়', memo: '—', amount: 2543800, status: 'চূড়ান্ত পরিশোধিত' },
                { orderIndex: 7, date: '2026-09-29', description: 'রুহুল, অটো উত্তরা, হতে মাল ক্রয়', category: 'স্থানীয় মাল ক্রয়', memo: '—', amount: 1102000, status: 'চূড়ান্ত পরিশোধিত' },
                { orderIndex: 8, date: '2026-09-30', description: 'সেপ্টেম্বর মাস গোডাউন খরচ', category: 'গোডাউন খরচ', memo: '—', amount: 297316, status: 'চূড়ান্ত পরিশোধিত' },
                { orderIndex: 9, date: '2026-10-04', description: 'আলতাফ চালানী কেরিং ৭ নং', category: 'চালানি কেরিং', memo: 'কেরিং-৭', amount: 797500, status: 'চূড়ান্ত পরিশোধিত' },
                { orderIndex: 10, date: '2026-10-04', description: 'আরমান হতে মাল ক্রয় (Voxy সাসপেনশন)', category: 'স্থানীয় মাল ক্রয়', memo: 'Voxy', amount: 560000, status: 'চূড়ান্ত পরিশোধিত' },
                { orderIndex: 11, date: '2026-10-14', description: 'জাবেদ হতে মাল ক্রয়', category: 'স্থানীয় মাল ক্রয়', memo: '—', amount: 18000, status: 'চূড়ান্ত পরিশোধিত' },
                { orderIndex: 12, date: '2026-10-14', description: 'জনি হতে মাল ক্রয়', category: 'স্থানীয় মাল ক্রয়', memo: '—', amount: 28000, status: 'চূড়ান্ত পরিশোধিত' },
                { orderIndex: 13, date: '2026-10-19', description: 'মা মোটর দোকান হতে মাল ক্রয়', category: 'স্থানীয় মাল ক্রয়', memo: '—', amount: 1350000, status: 'চূড়ান্ত পরিশোধিত' },
                { orderIndex: 14, date: '2026-10-31', description: 'অক্টোবর মাস গোডাউন খরচ', category: 'গোডাউন খরচ', memo: '—', amount: 373687, status: 'চূড়ান্ত পরিশোধিত' },
                { orderIndex: 15, date: '2026-11-03', description: 'এমরান (৮ নং) মা মোটর চালানী কেরিং', category: 'চালানি কেরিং', memo: 'চালান কেরিং', amount: 418900, status: 'চূড়ান্ত পরিশোধিত' },
                { orderIndex: 16, date: '2026-11-05', description: 'আরমান হতে মাল ক্রয় (মেমো-১২৪৫)', category: 'স্থানীয় মাল ক্রয়', memo: '১২৪৫', amount: 1790000, status: 'চূড়ান্ত পরিশোধিত' },
                { orderIndex: 17, date: '2026-11-05', description: 'আরমান হতে মাল ক্রয় (মেমো-১০৪৮)', category: 'স্থানীয় মাল ক্রয়', memo: '১০৪৮', amount: 7050000, status: 'চূড়ান্ত পরিশোধিত' },
                { orderIndex: 18, date: '2026-11-05', description: 'আরমান হতে মাল ক্রয় (মেমো-২৬৯)', category: 'স্থানীয় মাল ক্রয়', memo: '২৬৯', amount: 3600000, status: 'চূড়ান্ত পরিশোধিত' },
                { orderIndex: 19, date: '2026-11-09', description: '৭ নং কন্টেইনার ডুবাই শিপিং', category: 'শিপিং খরচ', memo: '৭নং কন্টেইনার', amount: 1683470, status: 'চূড়ান্ত পরিশোধিত' }
            ];

            const batch = db.batch();
            initialBDExpenses.forEach((exp, idx) => {
                const docId = `BD-EXP-001-${String(idx + 1).padStart(3, '0')}`;
                const ref = db.collection(BD_EXPENSES_COLLECTION).doc(docId);
                batch.set(ref, {
                    ...exp,
                    id: docId,
                    consignmentId: consId,
                    createdAt: firebase.firestore.FieldValue.serverTimestamp(),
                    updatedAt: firebase.firestore.FieldValue.serverTimestamp()
                });
            });

            await batch.commit();
        } catch (e) {
            console.error('Error seeding initial BD expenses:', e);
        }
    }
};

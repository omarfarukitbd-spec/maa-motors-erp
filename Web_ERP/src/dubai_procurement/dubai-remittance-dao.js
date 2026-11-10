/**
 * Dubai Remittance & Consignment - Data Access Object (DAO)
 * Manages Firestore collections for cross-border funding and consignments.
 */

import { db, firebase } from '../firebase-config.js';
import { toDBDate } from '../utils.js';

const CONSIGNMENTS_COLLECTION = 'dubai_consignments';
const REMITTANCES_COLLECTION = 'dubai_remittances';

export const DubaiRemittanceDAO = {
    /**
     * Real-time listener for consignments
     */
    listenConsignments(callback) {
        return db.collection(CONSIGNMENTS_COLLECTION)
            .orderBy('createdAt', 'desc')
            .onSnapshot(snap => {
                const results = [];
                snap.forEach(doc => results.push({ id: doc.id, ...doc.data() }));
                callback(results);
            }, err => {
                console.error('Error listening to dubai consignments:', err);
            });
    },

    /**
     * Fetch active consignment
     */
    async getActiveConsignment() {
        try {
            const snap = await db.collection(CONSIGNMENTS_COLLECTION).get();
            if (!snap.empty) {
                const active = snap.docs.find(d => d.data().status === 'active');
                const doc = active || snap.docs[0];
                return { id: doc.id, ...doc.data() };
            }
            return null;
        } catch (e) {
            console.error('Error fetching active consignment:', e);
            return null;
        }
    },

    /**
     * Save or update consignment document
     */
    async saveConsignment(data) {
        try {
            const id = data.id || `CONSIGNMENT-${Date.now()}`;
            const docRef = db.collection(CONSIGNMENTS_COLLECTION).doc(id);
            const payload = {
                ...data,
                id,
                updatedAt: firebase.firestore.FieldValue.serverTimestamp()
            };
            if (!data.id) {
                payload.createdAt = firebase.firestore.FieldValue.serverTimestamp();
            }
            await docRef.set(payload, { merge: true });
            return id;
        } catch (e) {
            console.error('Error saving consignment:', e);
            throw e;
        }
    },

    /**
     * Officially close current consignment and automatically roll balance to next consignment
     */
    async closeConsignmentAndStartNext(currentId, nextName, closingSummary) {
        try {
            const batch = db.batch();

            // 1. Close current consignment
            const currentRef = db.collection(CONSIGNMENTS_COLLECTION).doc(currentId);
            batch.update(currentRef, {
                status: 'closed',
                closingSummary,
                closedAt: firebase.firestore.FieldValue.serverTimestamp()
            });

            // 2. Create next consignment with rolled-forward opening balance
            const nextId = `CONSIGNMENT-${Date.now()}`;
            const nextRef = db.collection(CONSIGNMENTS_COLLECTION).doc(nextId);
            batch.set(nextRef, {
                id: nextId,
                name: nextName || 'এমরান ব্যক্তিগত ২য় কনসোলমেন্ট, ডুবাই মাল ক্রয় ইনভেস্ট',
                status: 'active',
                previousConsignmentId: currentId,
                openingBalance: {
                    aed: closingSummary?.grandTotal?.aed || 0,
                    bdt: closingSummary?.grandTotal?.bdt || 0,
                    rate: closingSummary?.grandTotal?.rate || 0,
                    note: '১ম কনসোলমেন্ট সমাপ্তি সাপেক্ষে স্থানান্তরিত সমাপনী ব্যালেন্স'
                },
                createdAt: firebase.firestore.FieldValue.serverTimestamp(),
                updatedAt: firebase.firestore.FieldValue.serverTimestamp()
            });

            await batch.commit();
            return nextId;
        } catch (e) {
            console.error('Error closing consignment and starting next:', e);
            throw e;
        }
    },

    /**
     * Real-time listener for remittances of a specific consignment
     */
    listenRemittances(consignmentId, callback) {
        return db.collection(REMITTANCES_COLLECTION)
            .onSnapshot(snap => {
                const results = [];
                snap.forEach(doc => {
                    const data = doc.data();
                    if (!consignmentId || data.consignmentId === consignmentId) {
                        results.push({ id: doc.id, ...data });
                    }
                });
                results.sort((a, b) => (a.date || '').localeCompare(b.date || ''));
                callback(results);
            }, err => {
                console.error('Error listening to dubai remittances:', err);
            });
    },

    /**
     * Get remittances by date range (used for weekly audit sync)
     */
    async getRemittancesByDateRange(startDate, endDate) {
        try {
            const snap = await db.collection(REMITTANCES_COLLECTION).get();
            const results = [];
            const sDate = startDate ? toDBDate(startDate) : null;
            const eDate = endDate ? toDBDate(endDate) : null;
            snap.forEach(doc => {
                const data = doc.data();
                const d = data.date;
                if ((!sDate || d >= sDate) && (!eDate || d <= eDate)) {
                    results.push({ id: doc.id, ...data });
                }
            });
            results.sort((a, b) => (a.date || '').localeCompare(b.date || ''));
            return results;
        } catch (e) {
            console.error('Error fetching remittances by date range:', e);
            return [];
        }
    },

    /**
     * Save or update remittance entry
     */
    async saveRemittance(data) {
        try {
            const id = data.id || `REM-${Date.now()}`;
            const docRef = db.collection(REMITTANCES_COLLECTION).doc(id);
            const payload = {
                ...data,
                id,
                date: toDBDate(data.date),
                updatedAt: firebase.firestore.FieldValue.serverTimestamp()
            };
            if (!data.id) {
                payload.createdAt = firebase.firestore.FieldValue.serverTimestamp();
            }
            await docRef.set(payload, { merge: true });
            return id;
        } catch (e) {
            console.error('Error saving remittance entry:', e);
            throw e;
        }
    },

    /**
     * Delete remittance entry
     */
    async deleteRemittance(id) {
        try {
            await db.collection(REMITTANCES_COLLECTION).doc(id).delete();
            return true;
        } catch (e) {
            console.error('Error deleting remittance entry:', e);
            throw e;
        }
    },

    /**
     * Initial Seed for Consignment 1 and notebook entries if database is empty
     */
    async seedInitialDataIfNeeded(force = false) {
        try {
            const consId = 'CONSIGNMENT-01';
            const consRef = db.collection(CONSIGNMENTS_COLLECTION).doc(consId);
            const consDoc = await consRef.get();
            if (!consDoc.exists || force) {
                await consRef.set({
                    id: consId,
                    name: 'এমরান ব্যক্তিগত ১ম কনসোলমেন্ট, ডুবাই মাল ক্রয় ইনভেস্ট',
                    status: 'active',
                    stage1: {
                        aed: 4285350,
                        bdt: 145802430,
                        rate: 34.02,
                        dates: '29/08/2025 - 18/12/2025',
                        agents: 'হৃদয়, ফারুক'
                    },
                    stage2: {
                        aed: 1692497,
                        bdt: 58421109,
                        rate: 34.51,
                        dates: '16/04/2026 - 13/10/2026',
                        agents: 'ফারুক'
                    },
                    createdAt: firebase.firestore.FieldValue.serverTimestamp(),
                    updatedAt: firebase.firestore.FieldValue.serverTimestamp()
                }, { merge: true });
            }

            if (!force) {
                const remSnap = await db.collection(REMITTANCES_COLLECTION).limit(1).get();
                if (!remSnap.empty) {
                    return; // Already seeded!
                }
            }

            const batch = db.batch();

            // 19 Initial Remittance Entries
            const initialRecords = [
                { date: '2026-10-14', via: 'মিনহাজ মারফত', rate: 34.50, aedAmount: 50000, bdtAmount: 1725000 },
                { date: '2026-10-15', via: 'মিনহাজ মারফত', rate: 34.50, aedAmount: 50000, bdtAmount: 1725000 },
                { date: '2026-10-18', via: 'মিনহাজ মারফত', rate: 34.55, aedAmount: 72400, bdtAmount: 2501420 },
                { date: '2026-10-25', via: 'মিনহাজ মারফত', rate: 34.60, aedAmount: 50000, bdtAmount: 1730000 },
                { date: '2026-10-25', via: 'আলতাফ মারফত', rate: 34.50, aedAmount: 30000, bdtAmount: 1035000 },
                { date: '2026-10-27', via: 'মিনহাজ মারফত', rate: 34.65, aedAmount: 50000, bdtAmount: 1732500 },
                { date: '2026-10-27', via: 'নুরুল হক মারফত', rate: 34.50, aedAmount: 52000, bdtAmount: 1794000 },
                { date: '2026-10-27', via: 'মিনহাজ মারফত', rate: 34.60, aedAmount: 50000, bdtAmount: 1730000 },
                { date: '2026-11-01', via: 'মিনহাজ মারফত', rate: 34.75, aedAmount: 30000, bdtAmount: 1042500 },
                { date: '2026-11-03', via: 'নুরুল হক / সাইফুল', rate: 34.65, aedAmount: 50000, bdtAmount: 1732500 },
                { date: '2026-11-03', via: 'হৃদয় মারফত', rate: 34.40, aedAmount: 15000, bdtAmount: 516000 },
                { date: '2026-11-03', via: 'মিনহাজ মারফত', rate: 34.75, aedAmount: 80000, bdtAmount: 2780000 },
                { date: '2026-11-04', via: 'একরাম / সোহেল', rate: 34.75, aedAmount: 50000, bdtAmount: 1737500 },
                { date: '2026-11-05', via: 'মিনহাজ মারফত', rate: 34.80, aedAmount: 50000, bdtAmount: 1740000 },
                { date: '2026-11-05', via: 'একরাম / ফারুক', rate: 34.75, aedAmount: 50000, bdtAmount: 1737500 },
                { date: '2026-11-05', via: 'সাইফুল / নুরুল হক', rate: 34.80, aedAmount: 50000, bdtAmount: 1740000 },
                { date: '2026-11-08', via: 'নুরুল হক / সাইফুল', rate: 34.80, aedAmount: 50000, bdtAmount: 1740000 },
                { date: '2026-11-08', via: 'একরাম / সোহেল', rate: 34.70, aedAmount: 50072, bdtAmount: 1737500 },
                { date: '2026-11-09', via: 'একরাম / সোহেল', rate: 34.75, aedAmount: 50000, bdtAmount: 1737500 }
            ];

            initialRecords.forEach((rec, idx) => {
                const remId = `REM-2026-001-${String(idx + 1).padStart(3, '0')}`;
                const ref = db.collection(REMITTANCES_COLLECTION).doc(remId);
                batch.set(ref, {
                    id: remId,
                    consignmentId: consId,
                    date: rec.date,
                    via: rec.via,
                    rate: rec.rate,
                    aedAmount: rec.aedAmount,
                    bdtAmount: rec.bdtAmount,
                    status: 'পরিশোধিত',
                    createdAt: firebase.firestore.FieldValue.serverTimestamp(),
                    updatedAt: firebase.firestore.FieldValue.serverTimestamp()
                });
            });

            await batch.commit();
        } catch (e) {
            console.error('Error seeding initial dubai remittance data:', e);
        }
    }
};

/**
 * Dubai Remittance & Consignment - Data Access Object (DAO)
 * Manages Firestore collections for cross-border funding and consignments.
 */

import { db, firebase } from '../firebase-config.js';
import { toDBDate, safeRound } from '../utils.js';
import { archiveNothiDocToRecycleBin, logNothiMutation } from './dubai-nothi-helpers.js';

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
     * Save or update per-section banner metadata inside a consignment document
     */
    async updateSectionBannersBatch(consignmentId, bannersMap = {}) {
        try {
            const id = consignmentId || 'CONSIGNMENT-01';
            const docRef = db.collection(CONSIGNMENTS_COLLECTION).doc(id);
            const cleanSectionBanners = {};

            Object.entries(bannersMap).forEach(([sectionKey, cfg]) => {
                if (!sectionKey || !cfg || typeof cfg !== 'object') return;
                cleanSectionBanners[sectionKey] = {
                    motherTitle: String(cfg.motherTitle ?? '').trim(),
                    pageNo: String(cfg.pageNo ?? '').trim(),
                    prefixLabel: String(cfg.prefixLabel ?? '').trim(),
                    title: String(cfg.title ?? '').trim(),
                    statusText: String(cfg.statusText ?? '').trim(),
                    statusTone: ['emerald', 'sky', 'amber', 'rose'].includes(cfg.statusTone)
                        ? cfg.statusTone
                        : 'emerald',
                    isCustom: true,
                    updatedAt: new Date().toISOString()
                };
            });

            if (Object.keys(cleanSectionBanners).length === 0) return {};

            await docRef.set({
                id,
                sectionBanners: cleanSectionBanners,
                updatedAt: firebase.firestore.FieldValue.serverTimestamp()
            }, { merge: true });

            return cleanSectionBanners;
        } catch (e) {
            console.error('Error updating section banners:', e);
            throw e;
        }
    },

    async updateSectionBanner(consignmentId, sectionKey, bannerData) {
        return this.updateSectionBannersBatch(consignmentId, { [sectionKey]: bannerData });
    },

    /**
     * Save or update custom date ranges for Stage 1 and Stage 2 inside a consignment document.
     * Uses nested merge to keep AED/BDT/rate totals intact.
     */
    async updateStageDates(consignmentId, { stage1Dates, stage2Dates } = {}) {
        try {
            const id = consignmentId || 'CONSIGNMENT-01';
            const docRef = db.collection(CONSIGNMENTS_COLLECTION).doc(id);
            const patch = {
                id,
                updatedAt: firebase.firestore.FieldValue.serverTimestamp()
            };
            if (stage1Dates !== undefined) {
                patch.stage1 = { dates: String(stage1Dates || '').trim() };
            }
            if (stage2Dates !== undefined) {
                patch.stage2 = { dates: String(stage2Dates || '').trim() };
            }
            await docRef.set(patch, { merge: true });
        } catch (e) {
            console.error('Error updating consignment stage dates:', e);
            throw e;
        }
    },

    /**
     * Officially close current consignment and automatically roll balance to next consignment
     */
    async closeConsignmentAndStartNext(currentId, nextName, closingSummary) {
        try {
            const safeCurrentId = currentId || 'CONSIGNMENT-01';
            const batch = db.batch();

            // 1. Close current consignment
            const currentRef = db.collection(CONSIGNMENTS_COLLECTION).doc(safeCurrentId);
            const currentSnap = await currentRef.get();
            const closedData = {
                id: safeCurrentId,
                status: 'closed',
                closingSummary,
                closedAt: firebase.firestore.FieldValue.serverTimestamp(),
                updatedAt: firebase.firestore.FieldValue.serverTimestamp()
            };
            if (currentSnap.exists) {
                batch.update(currentRef, closedData);
            } else {
                batch.set(currentRef, closedData, { merge: true });
            }

            // 2. Create next consignment with rolled-forward opening balance
            const nextId = `CONSIGNMENT-${Date.now()}`;
            const nextRef = db.collection(CONSIGNMENTS_COLLECTION).doc(nextId);
            const nextTitle = String(nextName || '২য় কনসোলমেন্ট / মূল হিসাব সেশন ০২').trim();
            batch.set(nextRef, {
                id: nextId,
                name: nextTitle,
                status: 'active',
                previousConsignmentId: safeCurrentId,
                initialBfAmount: 0,
                openingBalance: {
                    aed: safeRound(closingSummary?.grandTotal?.aed || 0),
                    bdt: safeRound(closingSummary?.grandTotal?.bdt || 0),
                    rate: safeRound(closingSummary?.grandTotal?.rate || 0),
                    note: 'পূর্ববর্তী কনসোলমেন্ট সমাপ্তি সাপেক্ষে স্থানান্তরিত সমাপনী ব্যালেন্স'
                },
                createdAt: firebase.firestore.FieldValue.serverTimestamp(),
                updatedAt: firebase.firestore.FieldValue.serverTimestamp()
            });

            await batch.commit();
            await logNothiMutation({
                action: 'CLOSE_SESSION',
                moduleLabel: 'রেমিট্যান্স ও কনসোলমেন্ট (পাতা ০০০১)',
                entityId: safeCurrentId,
                entityName: nextTitle,
                details: `Closed ${safeCurrentId} and rolled forward AED ${safeRound(closingSummary?.grandTotal?.aed || 0)} to ${nextId}`
            });
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
        let query = db.collection(REMITTANCES_COLLECTION);
        if (consignmentId) {
            query = query.where('consignmentId', '==', consignmentId);
        }
        return query.onSnapshot(snap => {
            const results = [];
            snap.forEach(doc => {
                const data = doc.data();
                if (!consignmentId || (data.consignmentId || 'CONSIGNMENT-01') === consignmentId) {
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
    async getRemittancesByDateRange(startDate, endDate, consignmentId = null) {
        try {
            let query = db.collection(REMITTANCES_COLLECTION);
            if (consignmentId) {
                query = query.where('consignmentId', '==', consignmentId);
            }
            const snap = await query.get();
            const results = [];
            const sDate = startDate ? toDBDate(startDate) : null;
            const eDate = endDate ? toDBDate(endDate) : null;
            snap.forEach(doc => {
                const data = doc.data();
                if (consignmentId && (data.consignmentId || 'CONSIGNMENT-01') !== consignmentId) {
                    return;
                }
                const d = data.date;
                if ((!sDate || d > sDate) && (!eDate || d <= eDate)) {
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
            const isUpdate = Boolean(data.id);
            const id = data.id || `REM-${Date.now()}`;
            const docRef = db.collection(REMITTANCES_COLLECTION).doc(id);
            const payload = {
                ...data,
                id,
                consignmentId: data.consignmentId || 'CONSIGNMENT-01',
                date: toDBDate(data.date),
                rate: safeRound(data.rate || 0),
                aedAmount: safeRound(data.aedAmount || 0),
                bdtAmount: safeRound(data.bdtAmount || 0),
                updatedAt: firebase.firestore.FieldValue.serverTimestamp()
            };
            if (!isUpdate) {
                payload.createdAt = firebase.firestore.FieldValue.serverTimestamp();
            }
            await docRef.set(payload, { merge: true });
            await logNothiMutation({
                action: isUpdate ? 'UPDATE' : 'CREATE',
                moduleLabel: 'টাকা পাঠানোর খাতা (পাতা ০০০১)',
                entityId: id,
                entityName: payload.via || id,
                details: `${isUpdate ? 'Updated' : 'Created'} remittance AED ${payload.aedAmount} / BDT ${payload.bdtAmount}`
            });
            return id;
        } catch (e) {
            console.error('Error saving remittance entry:', e);
            throw e;
        }
    },

    /**
     * Delete remittance entry (archives to Recycle Bin first)
     */
    async deleteRemittance(id, snapshotData = null) {
        try {
            const docRef = db.collection(REMITTANCES_COLLECTION).doc(id);
            let dataToArchive = snapshotData;
            if (!dataToArchive) {
                const snap = await docRef.get();
                if (snap.exists) dataToArchive = { id: snap.id, ...snap.data() };
            }
            if (dataToArchive) {
                await archiveNothiDocToRecycleBin({
                    collectionName: REMITTANCES_COLLECTION,
                    docId: id,
                    moduleLabel: 'টাকা পাঠানোর খাতা (পাতা ০০০১)',
                    itemName: `${dataToArchive.via || 'রেমিট্যান্স'} (${dataToArchive.aedAmount || 0} AED)`,
                    snapshotData: dataToArchive,
                    extraDetails: { consignmentId: dataToArchive.consignmentId || 'CONSIGNMENT-01' }
                });
            }
            await docRef.delete();
            await logNothiMutation({
                action: 'DELETE',
                moduleLabel: 'টাকা পাঠানোর খাতা (পাতা ০০০১)',
                entityId: id,
                entityName: dataToArchive?.via || id,
                details: `Deleted remittance AED ${dataToArchive?.aedAmount || 0}`
            });
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

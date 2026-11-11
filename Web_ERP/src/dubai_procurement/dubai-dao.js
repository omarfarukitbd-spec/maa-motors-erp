/**
 * Dubai Procurement & Weekly Audit - Data Access Object (DAO)
 * Complete database isolation for overseas procurement and weekly audit.
 */

import { db, firebase } from '../firebase-config.js';
import { toDBDate, safeRound, parseAmount } from '../utils.js';
import { archiveNothiDocToRecycleBin, logNothiMutation } from './dubai-nothi-helpers.js';

const AUDITS_COLLECTION = 'dubai_weekly_audits';
const MEMOS_COLLECTION = 'dubai_memos';
const REMITTANCES_COLLECTION = 'dubai_remittances';
const EXPENSES_COLLECTION = 'dubai_expenses';

async function commitDeletesInChunks(docRefs = []) {
    const CHUNK_SIZE = 450;
    for (let i = 0; i < docRefs.length; i += CHUNK_SIZE) {
        const batch = db.batch();
        docRefs.slice(i, i + CHUNK_SIZE).forEach(ref => batch.delete(ref));
        await batch.commit();
    }
}

export const DubaiDAO = {
    /**
     * Real-time listener for weekly audits (optionally scoped by consignmentId)
     */
    listenWeeklyAudits(callback, consignmentId = null) {
        return db.collection(AUDITS_COLLECTION)
            .orderBy('weekEndDate', 'desc')
            .onSnapshot(snap => {
                const results = [];
                snap.forEach(doc => {
                    const data = doc.data();
                    const itemCons = data.consignmentId || 'CONSIGNMENT-01';
                    if (!consignmentId || itemCons === consignmentId) {
                        results.push({ id: doc.id, ...data });
                    }
                });
                callback(results);
            }, err => {
                console.error('Error listening to dubai weekly audits:', err);
            });
    },

    /**
     * Fetch all weekly audits (ordered by date desc)
     */
    async getAllAudits(consignmentId = null) {
        try {
            const snap = await db.collection(AUDITS_COLLECTION)
                .orderBy('weekEndDate', 'desc')
                .get();
            const results = [];
            snap.forEach(doc => {
                const data = doc.data();
                const itemCons = data.consignmentId || 'CONSIGNMENT-01';
                if (!consignmentId || itemCons === consignmentId) {
                    results.push({ id: doc.id, ...data });
                }
            });
            return results;
        } catch (e) {
            console.error('Error getting all audits:', e);
            return [];
        }
    },

    /**
     * Fetch single audit by ID
     */
    async getAuditById(id) {
        try {
            const doc = await db.collection(AUDITS_COLLECTION).doc(id).get();
            return doc.exists ? { id: doc.id, ...doc.data() } : null;
        } catch (e) {
            console.error('Error getting audit by ID:', e);
            return null;
        }
    },

    /**
     * Get the most recent previous audit before a specific date or within a consignment
     */
    async getPreviousAudit(beforeDate = null, consignmentId = null) {
        try {
            const audits = await this.getAllAudits(consignmentId);
            if (!audits.length) return null;
            if (!beforeDate) return audits[0];
            const dbDate = toDBDate(beforeDate);
            return audits.find(a => toDBDate(a.weekEndDate) < dbDate) || null;
        } catch (e) {
            console.error('Error getting previous audit:', e);
            return null;
        }
    },

    /**
     * Save or update weekly audit document
     */
    async saveWeeklyAudit(auditData) {
        try {
            const isUpdate = Boolean(auditData.id);
            const normalizedWeekDate = toDBDate(auditData.weekEndDate);
            const auditId = auditData.id || `AUDIT-${normalizedWeekDate || Date.now()}`;
            const docRef = db.collection(AUDITS_COLLECTION).doc(auditId);
            const payload = {
                ...auditData,
                id: auditId,
                consignmentId: auditData.consignmentId || 'CONSIGNMENT-01',
                weekEndDate: normalizedWeekDate,
                messBalance: safeRound(parseAmount(auditData.messBalance || 0)),
                updatedAt: firebase.firestore.FieldValue.serverTimestamp()
            };
            if (!isUpdate) {
                payload.createdAt = firebase.firestore.FieldValue.serverTimestamp();
            }
            await docRef.set(payload, { merge: true });
            await logNothiMutation({
                action: isUpdate ? 'UPDATE' : 'CREATE',
                moduleLabel: 'সাপ্তাহিক ক্যাশ ও মেমো অডিট (পাতা ০০০৫)',
                entityId: auditId,
                entityName: `${payload.containerNo || 'DXB'} (${normalizedWeekDate})`,
                details: `${isUpdate ? 'Updated' : 'Saved'} weekly audit variance AED ${safeRound(payload.varianceAmount || 0)}`
            });
            return auditId;
        } catch (e) {
            console.error('Error saving weekly audit:', e);
            throw e;
        }
    },

    /**
     * Delete weekly audit document and linked records (deletes children first & archives parent)
     */
    async deleteWeeklyAudit(auditId, snapshotData = null) {
        try {
            const docRef = db.collection(AUDITS_COLLECTION).doc(auditId);
            let dataToArchive = snapshotData;
            if (!dataToArchive) {
                const snap = await docRef.get();
                if (snap.exists) dataToArchive = { id: snap.id, ...snap.data() };
            }

            const [memosSnap, remSnap, expSnap] = await Promise.all([
                db.collection(MEMOS_COLLECTION).where('auditId', '==', auditId).get(),
                db.collection(REMITTANCES_COLLECTION).where('auditId', '==', auditId).get(),
                db.collection(EXPENSES_COLLECTION).where('auditId', '==', auditId).get()
            ]);

            const childMemos = [];
            memosSnap.forEach(doc => childMemos.push({ id: doc.id, ...doc.data() }));

            if (dataToArchive) {
                await archiveNothiDocToRecycleBin({
                    collectionName: AUDITS_COLLECTION,
                    docId: auditId,
                    moduleLabel: 'সাপ্তাহিক ক্যাশ ও মেমো অডিট (পাতা ০০০৫)',
                    itemName: `${dataToArchive.containerNo || 'অডিট'} (${dataToArchive.weekEndDate || auditId})`,
                    snapshotData: { ...dataToArchive, _linkedMemos: childMemos },
                    extraDetails: { consignmentId: dataToArchive.consignmentId || 'CONSIGNMENT-01' }
                });
            }

            const refsToDelete = [];
            memosSnap.forEach(doc => refsToDelete.push(doc.ref));
            remSnap.forEach(doc => refsToDelete.push(doc.ref));
            expSnap.forEach(doc => refsToDelete.push(doc.ref));
            await commitDeletesInChunks(refsToDelete);

            await docRef.delete();
            await logNothiMutation({
                action: 'DELETE',
                moduleLabel: 'সাপ্তাহিক ক্যাশ ও মেমো অডিট (পাতা ০০০৫)',
                entityId: auditId,
                entityName: dataToArchive?.weekEndDate || auditId,
                details: `Deleted weekly audit and ${refsToDelete.length} linked child docs`
            });

            return true;
        } catch (e) {
            console.error('Error deleting weekly audit:', e);
            throw e;
        }
    },

    /**
     * Batch save purchase memos for an audit (safe against Firestore 500-op batch limit)
     */
    async saveMemos(auditId, memos) {
        try {
            const existingSnap = await db.collection(MEMOS_COLLECTION).where('auditId', '==', auditId).get();
            const existingRefs = [];
            existingSnap.forEach(doc => existingRefs.push(doc.ref));
            await commitDeletesInChunks(existingRefs);

            const cleanMemos = Array.isArray(memos) ? memos : [];
            const CHUNK_SIZE = 450;
            for (let i = 0; i < cleanMemos.length; i += CHUNK_SIZE) {
                const batch = db.batch();
                cleanMemos.slice(i, i + CHUNK_SIZE).forEach(m => {
                    const docRef = db.collection(MEMOS_COLLECTION).doc();
                    batch.set(docRef, {
                        memoNo: String(m.memoNo ?? ''),
                        amount: safeRound(parseAmount(m.amount || 0)),
                        auditId,
                        createdAt: firebase.firestore.FieldValue.serverTimestamp()
                    });
                });
                await batch.commit();
            }
            return true;
        } catch (e) {
            console.error('Error saving memos:', e);
            throw e;
        }
    },

    /**
     * Get memos for an audit
     */
    async getMemosByAuditId(auditId) {
        try {
            const snap = await db.collection(MEMOS_COLLECTION)
                .where('auditId', '==', auditId)
                .get();
            const results = [];
            snap.forEach(doc => results.push({ id: doc.id, ...doc.data() }));
            return results;
        } catch (e) {
            console.error('Error getting memos by auditId:', e);
            return [];
        }
    }
};

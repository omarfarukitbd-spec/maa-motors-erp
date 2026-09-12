/**
 * Dubai Procurement & Weekly Audit - Data Access Object (DAO)
 * Complete database isolation for overseas procurement and weekly audit.
 */

import { db, firebase } from '../firebase-config.js';

const AUDITS_COLLECTION = 'dubai_weekly_audits';
const MEMOS_COLLECTION = 'dubai_memos';
const REMITTANCES_COLLECTION = 'dubai_remittances';
const EXPENSES_COLLECTION = 'dubai_expenses';

export const DubaiDAO = {
    /**
     * Real-time listener for weekly audits
     */
    listenWeeklyAudits(callback) {
        return db.collection(AUDITS_COLLECTION)
            .orderBy('weekEndDate', 'desc')
            .onSnapshot(snap => {
                const results = [];
                snap.forEach(doc => results.push({ id: doc.id, ...doc.data() }));
                callback(results);
            }, err => {
                console.error('Error listening to dubai weekly audits:', err);
            });
    },

    /**
     * Fetch all weekly audits (ordered by date desc)
     */
    async getAllAudits() {
        try {
            const snap = await db.collection(AUDITS_COLLECTION)
                .orderBy('weekEndDate', 'desc')
                .get();
            const results = [];
            snap.forEach(doc => results.push({ id: doc.id, ...doc.data() }));
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
     * Get the most recent previous audit before a specific date or globally
     */
    async getPreviousAudit(beforeDate = null) {
        try {
            let query = db.collection(AUDITS_COLLECTION);
            if (beforeDate) {
                query = query.where('weekEndDate', '<', beforeDate);
            }
            const snap = await query.orderBy('weekEndDate', 'desc').limit(1).get();
            if (!snap.empty) {
                const doc = snap.docs[0];
                return { id: doc.id, ...doc.data() };
            }
            return null;
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
            const auditId = auditData.id || `AUDIT-${auditData.weekEndDate || Date.now()}`;
            const docRef = db.collection(AUDITS_COLLECTION).doc(auditId);
            const payload = {
                ...auditData,
                id: auditId,
                updatedAt: firebase.firestore.FieldValue.serverTimestamp()
            };
            if (!auditData.id) {
                payload.createdAt = firebase.firestore.FieldValue.serverTimestamp();
            }
            await docRef.set(payload, { merge: true });
            return auditId;
        } catch (e) {
            console.error('Error saving weekly audit:', e);
            throw e;
        }
    },

    /**
     * Delete weekly audit document and linked records
     */
    async deleteWeeklyAudit(auditId) {
        try {
            await db.collection(AUDITS_COLLECTION).doc(auditId).delete();
            
            // Delete linked memos
            const memosSnap = await db.collection(MEMOS_COLLECTION).where('auditId', '==', auditId).get();
            const batch1 = db.batch();
            memosSnap.forEach(doc => batch1.delete(doc.ref));
            await batch1.commit();

            // Delete linked remittances
            const remSnap = await db.collection(REMITTANCES_COLLECTION).where('auditId', '==', auditId).get();
            const batch2 = db.batch();
            remSnap.forEach(doc => batch2.delete(doc.ref));
            await batch2.commit();

            // Delete linked expenses
            const expSnap = await db.collection(EXPENSES_COLLECTION).where('auditId', '==', auditId).get();
            const batch3 = db.batch();
            expSnap.forEach(doc => batch3.delete(doc.ref));
            await batch3.commit();

            return true;
        } catch (e) {
            console.error('Error deleting weekly audit:', e);
            throw e;
        }
    },

    /**
     * Batch save purchase memos for an audit
     */
    async saveMemos(auditId, memos) {
        try {
            // Delete previous memos for this audit first
            const existingSnap = await db.collection(MEMOS_COLLECTION).where('auditId', '==', auditId).get();
            const batch = db.batch();
            existingSnap.forEach(doc => batch.delete(doc.ref));

            // Insert new memos
            memos.forEach(m => {
                const docRef = db.collection(MEMOS_COLLECTION).doc();
                batch.set(docRef, {
                    ...m,
                    auditId,
                    createdAt: firebase.firestore.FieldValue.serverTimestamp()
                });
            });
            await batch.commit();
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

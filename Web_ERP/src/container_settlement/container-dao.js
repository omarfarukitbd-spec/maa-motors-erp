import { db, firebase } from '../firebase-config.js';

/**
 * Cloud Firestore DAO for collection 'container_settlements'
 */
class ContainerSettlementDAOClass {
    constructor() {
        this.collection = db.collection('container_settlements');
    }

    /**
     * Get all settlements ordered by updatedAt descending
     */
    async getAll() {
        try {
            const snap = await this.collection.orderBy('updatedAt', 'desc').get();
            const results = [];
            snap.forEach(doc => results.push({ id: doc.id, ...doc.data() }));
            return results;
        } catch (e) {
            console.error('ContainerSettlementDAO.getAll error:', e);
            // Fallback without orderBy if index is still propagating
            try {
                const snap = await this.collection.get();
                const results = [];
                snap.forEach(doc => results.push({ id: doc.id, ...doc.data() }));
                return results;
            } catch (err) {
                console.error('ContainerSettlementDAO.getAll fallback error:', err);
                return [];
            }
        }
    }

    /**
     * Get single settlement by ID
     */
    async getById(id) {
        if (!id) return null;
        try {
            const doc = await this.collection.doc(id).get();
            if (doc.exists) {
                return { id: doc.id, ...doc.data() };
            }
            return null;
        } catch (e) {
            console.error('ContainerSettlementDAO.getById error:', e);
            return null;
        }
    }

    /**
     * Save or merge settlement document
     */
    async save(data) {
        try {
            const docId = (data.id || `CONT-${Date.now()}`).trim();
            const cleanData = {
                ...data,
                id: docId,
                updatedAt: firebase.firestore.FieldValue.serverTimestamp()
            };
            if (!cleanData.createdAt) {
                cleanData.createdAt = firebase.firestore.FieldValue.serverTimestamp();
            }
            await this.collection.doc(docId).set(cleanData, { merge: true });
            return docId;
        } catch (e) {
            console.error('ContainerSettlementDAO.save error:', e);
            throw e;
        }
    }

    /**
     * Delete settlement document
     */
    async delete(id) {
        if (!id) return false;
        try {
            await this.collection.doc(id).delete();
            return true;
        } catch (e) {
            console.error('ContainerSettlementDAO.delete error:', e);
            throw e;
        }
    }

    /**
     * Real-time listener for all settlements
     */
    listen(callback) {
        return this.collection.onSnapshot(
            snap => {
                const results = [];
                snap.forEach(doc => results.push({ id: doc.id, ...doc.data() }));
                callback(results);
            },
            err => {
                console.error('ContainerSettlementDAO.listen error:', err);
                callback([]);
            }
        );
    }
}

export const ContainerSettlementDAO = new ContainerSettlementDAOClass();

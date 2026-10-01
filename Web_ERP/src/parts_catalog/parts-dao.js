import { db, firebase } from '../firebase-config.js';
import { safeRound } from '../utils.js';

/**
 * Parts Catalog Data Access Object (DAO)
 * Handles Cloud Firestore operations for collection 'auto_parts_catalog'.
 */
class PartsCatalogDAOClass {
    constructor() {
        this.collection = db.collection('auto_parts_catalog');
    }

    /**
     * Get all parts ordered by part code or name
     */
    async getAll() {
        try {
            const snap = await this.collection.get();
            const results = [];
            snap.forEach(doc => results.push({ docId: doc.id, ...doc.data() }));
            results.sort((a, b) => (a.id || '').localeCompare(b.id || '', undefined, { numeric: true }));
            return results;
        } catch (e) {
            console.error('PartsCatalogDAO.getAll error:', e);
            return [];
        }
    }

    /**
     * Real-time listener for parts catalog
     */
    listen(callback) {
        return this.collection.onSnapshot(
            snap => {
                const results = [];
                snap.forEach(doc => results.push({ docId: doc.id, ...doc.data() }));
                results.sort((a, b) => (a.id || '').localeCompare(b.id || '', undefined, { numeric: true }));
                callback(results);
            },
            err => {
                console.error('PartsCatalogDAO.listen error:', err);
                callback([]);
            }
        );
    }

    /**
     * Get a specific part by ID or Part Code
     */
    async getById(partId) {
        try {
            const doc = await this.collection.doc(partId).get();
            if (doc.exists) {
                return { docId: doc.id, ...doc.data() };
            }
            // Fallback search by 'id' field if document ID differs
            const snap = await this.collection.where('id', '==', partId).limit(1).get();
            if (!snap.empty) {
                const first = snap.docs[0];
                return { docId: first.id, ...first.data() };
            }
            return null;
        } catch (e) {
            console.error('PartsCatalogDAO.getById error:', e);
            return null;
        }
    }

    /**
     * Create or set a new part document
     */
    async savePart(partData) {
        try {
            const partId = (partData.id || `PART-${Date.now()}`).trim();
            const cleanData = {
                ...partData,
                id: partId,
                askingPrice: safeRound(Number(partData.askingPrice) || 0),
                floorPrice: safeRound(Number(partData.floorPrice) || 0),
                singlePiecePrice: safeRound(Number(partData.singlePiecePrice) || 0),
                oldCoreDiscount: safeRound(Number(partData.oldCoreDiscount) || 0),
                updatedAt: firebase.firestore.FieldValue.serverTimestamp()
            };
            await this.collection.doc(partId).set(cleanData, { merge: true });
            return partId;
        } catch (e) {
            console.error('PartsCatalogDAO.savePart error:', e);
            throw e;
        }
    }

    /**
     * Update specific fields of a part
     */
    async updatePart(partId, updates) {
        try {
            const cleanUpdates = {
                ...updates,
                updatedAt: firebase.firestore.FieldValue.serverTimestamp()
            };
            if (cleanUpdates.askingPrice !== undefined) cleanUpdates.askingPrice = safeRound(Number(cleanUpdates.askingPrice) || 0);
            if (cleanUpdates.floorPrice !== undefined) cleanUpdates.floorPrice = safeRound(Number(cleanUpdates.floorPrice) || 0);
            if (cleanUpdates.singlePiecePrice !== undefined) cleanUpdates.singlePiecePrice = safeRound(Number(cleanUpdates.singlePiecePrice) || 0);
            if (cleanUpdates.oldCoreDiscount !== undefined) cleanUpdates.oldCoreDiscount = safeRound(Number(cleanUpdates.oldCoreDiscount) || 0);

            await this.collection.doc(partId).update(cleanUpdates);
            return true;
        } catch (e) {
            console.error('PartsCatalogDAO.updatePart error:', e);
            throw e;
        }
    }

    /**
     * Delete a part by ID
     */
    async deletePart(partId) {
        try {
            await this.collection.doc(partId).delete();
            return true;
        } catch (e) {
            console.error('PartsCatalogDAO.deletePart error:', e);
            throw e;
        }
    }

    /**
     * Bulk upload / seed parts in batches (max 400 per commit for safety)
     */
    async seedBatch(partsList) {
        if (!Array.isArray(partsList) || partsList.length === 0) return 0;
        let count = 0;
        const chunkSize = 300;
        
        for (let i = 0; i < partsList.length; i += chunkSize) {
            const chunk = partsList.slice(i, i + chunkSize);
            const batch = db.batch();
            
            chunk.forEach(item => {
                const docId = (item.id || `PART-${1000 + count}`).trim();
                const docRef = this.collection.doc(docId);
                const cleanItem = {
                    ...item,
                    id: docId,
                    askingPrice: safeRound(Number(item.askingPrice) || 0),
                    floorPrice: safeRound(Number(item.floorPrice) || 0),
                    singlePiecePrice: safeRound(Number(item.singlePiecePrice) || 0),
                    oldCoreDiscount: safeRound(Number(item.oldCoreDiscount) || 0),
                    updatedAt: firebase.firestore.FieldValue.serverTimestamp()
                };
                batch.set(docRef, cleanItem, { merge: true });
                count += 1;
            });

            await batch.commit();
        }
        return count;
    }
}

export const PartsCatalogDAO = new PartsCatalogDAOClass();

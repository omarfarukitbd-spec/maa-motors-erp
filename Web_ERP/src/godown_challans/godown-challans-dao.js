import { db, firebase } from '../firebase-config.js';

let _activeSnapshotUnsubscribe = null;

export const GodownChallansDAO = new class {
    constructor() {
        this.collection = db.collection('godown_challans');
    }

    /**
     * Subscribe to real-time updates for Godown Challans
     * @param {Function} onUpdate Callback receiving array of challans
     * @param {Function} onError Callback on snapshot error
     * @returns {Function} Unsubscribe function
     */
    subscribe(onUpdate, onError) {
        if (_activeSnapshotUnsubscribe) {
            _activeSnapshotUnsubscribe();
            _activeSnapshotUnsubscribe = null;
        }

        try {
            _activeSnapshotUnsubscribe = this.collection
                .orderBy('date', 'desc')
                .limit(200)
                .onSnapshot(
                    (snapshot) => {
                        const docs = snapshot.docs.map(doc => {
                            const data = doc.data() || {};
                            return {
                                id: doc.id,
                                ...data
                            };
                        });
                        onUpdate(docs);
                    },
                    (error) => {
                        console.error('Godown Challans listener error:', error);
                        if (onError) onError(error);
                    }
                );
            return _activeSnapshotUnsubscribe;
        } catch (e) {
            console.error('Failed to attach Godown Challans listener:', e);
            if (onError) onError(e);
            return () => {};
        }
    }

    /**
     * Fetch all challans once (fallback)
     */
    async getAll() {
        try {
            const snap = await this.collection.orderBy('date', 'desc').limit(200).get();
            return snap.docs.map(doc => ({ id: doc.id, ...(doc.data() || {}) }));
        } catch (e) {
            console.error('Error fetching godown challans:', e);
            return [];
        }
    }

    /**
     * Fetch single challan by ID
     */
    async getById(id) {
        if (!id) return null;
        try {
            const doc = await this.collection.doc(id).get();
            return doc.exists ? { id: doc.id, ...(doc.data() || {}) } : null;
        } catch (e) {
            console.error(`Error fetching challan ${id}:`, e);
            return null;
        }
    }

    /**
     * Delete challan (Admin only)
     */
    async delete(id) {
        if (!id) return;
        try {
            await this.collection.doc(id).delete();
        } catch (e) {
            console.error(`Error deleting challan ${id}:`, e);
            throw e;
        }
    }
};

export function unsubscribeGodownChallans() {
    if (_activeSnapshotUnsubscribe) {
        _activeSnapshotUnsubscribe();
        _activeSnapshotUnsubscribe = null;
    }
}

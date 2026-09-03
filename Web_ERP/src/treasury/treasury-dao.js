import { db, firebase } from '../firebase-config.js';
import { safeRound } from '../utils.js';

const COLLECTION_NAME = 'TreasuryTransactions';
const SETTINGS_DOC = 'treasury';

/**
 *  Treasury DAO - Data Access Object for Master Treasury & Fund Flow
 */
export const TreasuryDAO = {
    collection: db.collection(COLLECTION_NAME),
    settingsDoc: db.collection('settings').doc(SETTINGS_DOC),

    /**
     * Realtime listener for all treasury transactions
     * @param {Function} callback 
     * @returns {Function} Unsubscribe function
     */
    listenAll(callback) {
        return this.collection.orderBy('date', 'asc').onSnapshot(snap => {
            const results = [];
            snap.forEach(doc => results.push({ id: doc.id, ...doc.data() }));
            callback(results);
        }, err => {
            console.error('TreasuryDAO listenAll error:', err);
        });
    },

    /**
     * Get all transactions once
     */
    async getAll() {
        const snap = await this.collection.orderBy('date', 'asc').get();
        const results = [];
        snap.forEach(doc => results.push({ id: doc.id, ...doc.data() }));
        return results;
    },

    /**
     * Save a new treasury transaction
     */
    async addTransaction(data) {
        const docRef = this.collection.doc();
        const payload = {
            ...data,
            amount: safeRound(data.amount),
            createdAt: firebase.firestore.FieldValue.serverTimestamp()
        };
        await docRef.set(payload);
        return { id: docRef.id, ...payload };
    },

    /**
     * Update an existing transaction
     */
    async updateTransaction(id, data) {
        const payload = {
            ...data,
            amount: safeRound(data.amount),
            updatedAt: firebase.firestore.FieldValue.serverTimestamp()
        };
        await this.collection.doc(id).update(payload);
    },

    /**
     * Delete a transaction
     */
    async deleteTransaction(id) {
        await this.collection.doc(id).delete();
    },

    /**
     * Fetch master opening fund settings (B/F)
     */
    async getOpeningFund() {
        try {
            const doc = await this.settingsDoc.get();
            if (doc.exists) {
                const d = doc.data();
                return {
                    openingBalance: safeRound(d.openingBalance !== undefined ? d.openingBalance : 46391562),
                    openingDate: d.openingDate || '2026-08-31',
                    title: d.title || '৩১ আগস্ট ২০২৬ সমাপনী স্থিতি (B/F)'
                };
            }
        } catch (e) {
            console.error('getOpeningFund error:', e);
        }
        return { openingBalance: 46391562, openingDate: '2026-08-31', title: '৩১ আগস্ট ২০২৬ সমাপনী স্থিতি (B/F)' };
    },

    /**
     * Update master opening fund settings
     */
    async saveOpeningFund(openingBalance, openingDate = '2026-08-31') {
        await this.settingsDoc.set({
            openingBalance: safeRound(openingBalance),
            openingDate,
            title: '৩১ আগস্ট ২০২৬ সমাপনী স্থিতি (B/F)',
            updatedAt: firebase.firestore.FieldValue.serverTimestamp()
        }, { merge: true });
    }
};

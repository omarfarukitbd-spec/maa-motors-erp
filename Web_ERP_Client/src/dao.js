import { db } from './firebase-config.js';
export { db };

export const CustomerDAO = {
    getRef(id) {
        return id ? db.collection('customers').doc(id) : db.collection('customers').doc();
    },
    listenAll(callback) {
        return db.collection('customers').orderBy('createdAt', 'desc').onSnapshot(snap => {
            const data = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            callback(data);
        }, err => console.error("CustomerDAO listener error:", err));
    },
    async getAll() {
        const snap = await db.collection('customers').get();
        return snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    },
    async getById(id) {
        if (!id) return null;
        const doc = await db.collection('customers').doc(id).get();
        return doc.exists ? { id: doc.id, ...doc.data() } : null;
    }
};

export const TransactionDAO = {
    getRef(id) {
        return id ? db.collection('transactions').doc(id) : db.collection('transactions').doc();
    },
    listenByCustomer(customerId, callback) {
        return db.collection('transactions')
            .where('customerId', '==', customerId)
            .orderBy('date', 'asc')
            .onSnapshot(snap => {
                const data = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                callback(data);
            }, err => console.error("TransactionDAO customer listener error:", err));
    },
    listenByDate(date, callback) {
        return db.collection('transactions')
            .where('date', '==', date)
            .onSnapshot(snap => {
                const data = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                callback(data);
            }, err => console.error("TransactionDAO date listener error:", err));
    },
    listenDateRange(startDate, endDate, callback) {
        return db.collection('transactions')
            .where('date', '>=', startDate)
            .where('date', '<=', endDate)
            .orderBy('date', 'desc')
            .onSnapshot(snap => {
                const data = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                callback(data);
            }, err => console.error("TransactionDAO range listener error:", err));
    }
};

export const ExpenseDAO = {
    getRef(id) {
        return id ? db.collection('expenses').doc(id) : db.collection('expenses').doc();
    },
    listenByDate(date, callback) {
        return db.collection('expenses')
            .where('date', '==', date)
            .onSnapshot(snap => {
                const data = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                callback(data);
            }, err => console.error("ExpenseDAO date listener error:", err));
    },
    listenDateRange(startDate, endDate, callback) {
        return db.collection('expenses')
            .where('date', '>=', startDate)
            .where('date', '<=', endDate)
            .orderBy('date', 'desc')
            .onSnapshot(snap => {
                const data = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                callback(data);
            }, err => console.error("ExpenseDAO range listener error:", err));
    }
};

export const ZoneDAO = {
    async getAllZones() {
        try {
            const snap = await db.collection('zones').orderBy('name', 'asc').get();
            return snap.docs.map(d => ({ id: d.id, ...d.data() }));
        } catch (e) {
            console.error(e);
            return [];
        }
    }
};

export const SettingsDAO = {
    async getAppSettings() {
        try {
            const doc = await db.collection('settings').doc('app_config').get();
            return doc.exists ? doc.data() : { shopName: 'M/S. MAA MOTORS', shopPhone: '01819-189402', shopAddress: 'মাইজভাণ্ডার রোড, চট্টগ্রাম' };
        } catch (e) {
            console.error(e);
            return { shopName: 'M/S. MAA MOTORS' };
        }
    }
};

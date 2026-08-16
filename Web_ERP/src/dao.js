import { db, firebase } from './firebase-config.js';

/**
 * Base DAO with common CRUD operations
 */
class BaseDAO {
    constructor(collectionName) {
        this.collection = db.collection(collectionName);
    }

    getRef(id) {
        return id ? this.collection.doc(id) : this.collection.doc();
    }

    async getById(id) {
        const doc = await this.collection.doc(id).get();
        return doc.exists ? { id: doc.id, ...doc.data() } : null;
    }

    async getAll(orderByField = 'createdAt', direction = 'desc') {
        const snap = await this.collection.orderBy(orderByField, direction).get();
        const results = [];
        snap.forEach(doc => results.push({ id: doc.id, ...doc.data() }));
        return results;
    }

    async getByPage(pageSize = 20, lastDoc = null, orderByField = 'createdAt', direction = 'desc', filters = []) {
        let query = this.collection.orderBy(orderByField, direction);
        filters.forEach(f => { query = query.where(f.field, f.op, f.value); });
        if (lastDoc) query = query.startAfter(lastDoc);

        const snap = await query.limit(pageSize).get();
        const results = [];
        snap.forEach(doc => results.push({ id: doc.id, ...doc.data() }));

        return {
            data: results,
            lastDoc: snap.docs[snap.docs.length - 1] || null,
            firstDoc: snap.docs[0] || null,
            count: snap.size
        };
    }

    listen(callback, orderByField = 'createdAt', direction = 'desc') {
        return this.collection.orderBy(orderByField, direction).onSnapshot(snap => {
            const results = [];
            snap.forEach(doc => results.push({ id: doc.id, ...doc.data() }));
            callback(results);
        }, err => console.error(`Error in ${this.collection.id} listener:`, err));
    }

    async add(data) {
        const docRef = this.collection.doc();
        await docRef.set({ ...data, createdAt: firebase.firestore.FieldValue.serverTimestamp() });
        return docRef.id;
    }

    async update(id, data) {
        await this.collection.doc(id).update({ ...data, updatedAt: firebase.firestore.FieldValue.serverTimestamp() });
    }

    async delete(id) {
        await this.collection.doc(id).delete();
    }
}

// Specialized DAOs
export const CustomerDAO = new class extends BaseDAO {
    constructor() { super('customers'); }

    listenToAll(callback) {
        return this.collection.orderBy('name').onSnapshot(snap => {
            const results = [];
            snap.forEach(doc => results.push({ id: doc.id, ...doc.data() }));
            callback(results);
        });
    }
}();

export const TransactionDAO = new class extends BaseDAO {
    constructor() { super('transactions'); }

    listenRecent(limitCount = 30, callback) {
        return this.collection.orderBy('createdAt', 'desc').limit(limitCount).onSnapshot(snap => {
            const results = [];
            snap.forEach(doc => results.push({ id: doc.id, ...doc.data() }));
            callback(results);
        });
    }

    listenByDate(date, callback) {
        return this.collection.where('date', '==', date).onSnapshot(snap => {
            const results = [];
            snap.forEach(doc => results.push({ id: doc.id, ...doc.data() }));
            callback(results);
        });
    }

    listenByCustomer(customerId, callback, limitCount = 50) {
        return this.collection.where('customerId', '==', customerId)
            .orderBy('date', 'desc').orderBy('createdAt', 'desc').limit(limitCount)
            .onSnapshot(snap => {
                const results = [];
                snap.forEach(doc => results.push({ id: doc.id, ...doc.data() }));
                callback(results);
            });
    }

    async getByVoucher(voucherNo) {
        const snap = await this.collection.where('voucherNo', '==', voucherNo).get();
        const results = [];
        snap.forEach(doc => results.push({ id: doc.id, ...doc.data() }));
        return results;
    }

    async getAll() {
        const snap = await this.collection.get();
        const results = [];
        snap.forEach(doc => results.push({ id: doc.id, ...doc.data() }));
        return results;
    }

    async getByCustomer(customerId) {
        const snap = await this.collection.where('customerId', '==', customerId).get();
        const results = [];
        snap.forEach(doc => results.push({ id: doc.id, ...doc.data() }));
        return results;
    }
}();

export const SettingsDAO = new class {
    constructor() {
        this.collection = db.collection('settings');
    }

    async getAppSettings() {
        const doc = await this.collection.doc('appSettings').get();
        return doc.exists ? doc.data() : {};
    }

    async updateAppSettings(data) {
        await this.collection.doc('appSettings').set(data, { merge: true });
    }

    async updateZoneCounter(zoneName, val) {
        const counterRef = this.collection.doc('counters');
        await db.runTransaction(async (t) => {
            const doc = await t.get(counterRef);
            let zoneCounters = (doc.exists && doc.data().zoneCounters) ? doc.data().zoneCounters : {};
            zoneCounters[zoneName] = val;
            t.set(counterRef, { zoneCounters }, { merge: true });
        });
    }

    async getNextAccountNo(zoneName, transaction = null) {
        const counterRef = this.collection.doc('counters');
        const work = async (t) => {
            const doc = await t.get(counterRef);
            let zoneCounters = (doc.exists && doc.data().zoneCounters) ? doc.data().zoneCounters : {};
            let nextNo = (zoneCounters[zoneName] || 0) + 1;
            zoneCounters[zoneName] = nextNo;
            t.set(counterRef, { zoneCounters }, { merge: true });
            return String(nextNo).padStart(4, '0');
        };
        if (transaction) return await work(transaction);
        return db.runTransaction(work);
    }

    async peekNextAccountNo(zoneName) {
        const doc = await this.collection.doc('counters').get();
        let zoneCounters = (doc.exists && doc.data().zoneCounters) ? doc.data().zoneCounters : {};
        let nextNo = (zoneCounters[zoneName] || 0) + 1;
        return String(nextNo).padStart(4, '0');
    }
}();

export const ZoneDAO = new class extends BaseDAO {
    constructor() { super('zones'); }

    async getAllZones() {
        return await this.getAll('name', 'asc');
    }

    async getByCode(code) {
        const snap = await this.collection.where('code', '==', code).get();
        if (snap.empty) return null;
        const doc = snap.docs[0];
        return { id: doc.id, ...doc.data() };
    }
}();

export const UserDAO = new class extends BaseDAO {
    constructor() { super('users'); }

    listenAll(callback) {
        return this.collection.onSnapshot(snap => {
            const results = [];
            snap.forEach(doc => results.push({ id: doc.id, ...doc.data() }));
            callback(results);
        });
    }

    listenUser(uid, callback) {
        return this.collection.doc(uid).onSnapshot(doc => {
            if (doc.exists) callback({ id: doc.id, ...doc.data() });
            else callback(null);
        });
    }
}();

export const ExpenseDAO = new class extends BaseDAO {
    constructor() { super('expenses'); }

    listenRecent(limitCount = 30, callback) {
        return this.collection.orderBy('createdAt', 'desc').limit(limitCount).onSnapshot(snap => {
            const results = [];
            snap.forEach(doc => results.push({ id: doc.id, ...doc.data() }));
            callback(results);
        });
    }

    listenByDate(date, callback) {
        return this.collection.where('date', '==', date).onSnapshot(snap => {
            const results = [];
            snap.forEach(doc => results.push({ id: doc.id, ...doc.data() }));
            callback(results);
        });
    }
}();

export const AuditDAO = new class extends BaseDAO {
    constructor() { super('audit_logs'); }

    async getRecent(limitCount = 50) {
        const snap = await this.collection.orderBy('timestamp', 'desc').limit(limitCount).get();
        const results = [];
        snap.forEach(doc => results.push({ id: doc.id, ...doc.data() }));
        return results;
    }

    listenRecent(callback, limitCount = 50) {
        return this.collection.orderBy('timestamp', 'desc').limit(limitCount).onSnapshot(snap => {
            const results = [];
            snap.forEach(doc => results.push({ id: doc.id, ...doc.data() }));
            callback(results);
        }, err => console.error("Audit listener error:", err));
    }
}();

export const BankDAO = new class extends BaseDAO {
    constructor() { super('bank_accounts'); }

    async getAllBanks() {
        return await this.getAll('name', 'asc');
    }

    async getActiveBanks() {
        const snap = await this.collection.where('status', '==', 'active').orderBy('name', 'asc').get();
        const results = [];
        snap.forEach(doc => results.push({ id: doc.id, ...doc.data() }));
        return results;
    }
}();

export const CashCollectorDAO = new class extends BaseDAO {
    constructor() { super('cash_collectors'); }

    async getAllCollectors() {
        return await this.getAll('name', 'asc');
    }

    async getActiveCollectors() {
        const snap = await this.collection.where('status', '==', 'active').orderBy('name', 'asc').get();
        const results = [];
        snap.forEach(doc => results.push({ id: doc.id, ...doc.data() }));
        return results;
    }
}();

export const BankTransactionDAO = new class extends BaseDAO {
    constructor() { super('bank_transactions'); }

    async getByBank(bankName) {
        const snap = await this.collection.where('bankName', '==', bankName).orderBy('createdAt', 'desc').get();
        const results = [];
        snap.forEach(doc => results.push({ id: doc.id, ...doc.data() }));
        return results;
    }

    async getTransfersByTargetBank(bankName) {
        const snap = await this.collection.where('type', '==', 'TRANSFER').where('targetBankName', '==', bankName).orderBy('createdAt', 'desc').get();
        const results = [];
        snap.forEach(doc => results.push({ id: doc.id, ...doc.data() }));
        return results;
    }
}();

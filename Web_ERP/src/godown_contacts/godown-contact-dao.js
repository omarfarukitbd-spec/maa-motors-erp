import { db, firebase } from '../firebase-config.js';
import { triggerSilentGodownContactGoogleSync } from './godown-google-sync.js';
import { DEFAULT_GODOWN_CONTACTS } from './godown-default-contacts.js';

export { DEFAULT_GODOWN_CONTACTS };

export const GodownContactDAO = new class {
    constructor() {
        this.collection = db.collection('godown_contacts');
    }

    async getAll() {
        const snap = await this.collection.orderBy('createdAt', 'desc').get();
        return snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    }

    async getById(id) {
        if (!id) return null;
        const doc = await this.collection.doc(id).get();
        return doc.exists ? { id: doc.id, ...doc.data() } : null;
    }

    async create(data) {
        const payload = {
            ...data,
            isSample: Boolean(data.isSample),
            createdAt: firebase.firestore.FieldValue.serverTimestamp(),
            updatedAt: firebase.firestore.FieldValue.serverTimestamp()
        };
        const ref = await this.collection.add(payload);
        const contactId = ref.id;

        // Auto Silent Google Contact Sync
        triggerSilentGodownContactGoogleSync(contactId);

        return contactId;
    }

    async update(id, data) {
        if (!id) return;
        const payload = {
            ...data,
            updatedAt: firebase.firestore.FieldValue.serverTimestamp()
        };
        await this.collection.doc(id).set(payload, { merge: true });

        // Auto Silent Google Contact Sync
        triggerSilentGodownContactGoogleSync(id);
    }

    async delete(id) {
        if (!id) return;
        await this.collection.doc(id).delete();
    }

    async clearSampleContacts() {
        const snap = await this.collection.get();
        const sampleIds = [];
        const samplePhones = ['01819397669', '01815707934', '01711000000', '01911000000', '01822000000', '01833000000'];
        
        snap.forEach(doc => {
            const d = doc.data();
            if (d.isSample === true || (d.phone && samplePhones.includes(d.phone))) {
                sampleIds.push(doc.id);
            }
        });

        if (sampleIds.length === 0) return 0;

        const batch = db.batch();
        sampleIds.forEach(id => {
            batch.delete(this.collection.doc(id));
        });
        await batch.commit();
        return sampleIds.length;
    }

    listenAllContacts(onUpdate, onError) {
        return this.collection.orderBy('name', 'asc').onSnapshot(snap => {
            const list = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            if (typeof onUpdate === 'function') onUpdate(list);
        }, err => {
            console.error('Godown contacts snapshot error:', err);
            if (typeof onError === 'function') onError(err);
        });
    }

    async seedDefaultContactsIfEmpty() {
        try {
            const snap = await this.collection.get();
            const dummyPhones = ['01819397669', '01711000000', '01822000000', '01833000000'];
            const hasOnlySample = !snap.empty && snap.docs.every(d => {
                const data = d.data();
                return data.isSample === true || dummyPhones.includes(data.phone);
            });

            if (snap.empty || hasOnlySample) {
                const batch = db.batch();
                if (!snap.empty) {
                    snap.docs.forEach(d => batch.delete(d.ref));
                }
                DEFAULT_GODOWN_CONTACTS.forEach(item => {
                    const docRef = this.collection.doc();
                    batch.set(docRef, {
                        ...item,
                        createdAt: firebase.firestore.FieldValue.serverTimestamp(),
                        updatedAt: firebase.firestore.FieldValue.serverTimestamp()
                    });
                });
                await batch.commit();
                return true;
            } else {
                // Ensure all default verified contacts exist in DB (e.g. newly added paint contractor)
                const existingPhones = new Set();
                snap.forEach(d => {
                    const phone = d.data().phone;
                    if (phone) existingPhones.add(phone.trim());
                });

                const missing = DEFAULT_GODOWN_CONTACTS.filter(c => c.phone && !existingPhones.has(c.phone.trim()));
                if (missing.length > 0) {
                    const batch = db.batch();
                    missing.forEach(item => {
                        const docRef = this.collection.doc();
                        batch.set(docRef, {
                            ...item,
                            createdAt: firebase.firestore.FieldValue.serverTimestamp(),
                            updatedAt: firebase.firestore.FieldValue.serverTimestamp()
                        });
                    });
                    await batch.commit();
                    return true;
                }
            }
        } catch (e) {
            console.warn('Seed contacts error:', e);
        }
        return false;
    }
}();

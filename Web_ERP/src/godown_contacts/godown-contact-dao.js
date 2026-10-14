import { db, firebase } from '../firebase-config.js';
import { triggerSilentGodownContactGoogleSync } from './godown-google-sync.js';

/**
 * Initial Default Contacts for Godown Operations
 */
export const DEFAULT_GODOWN_CONTACTS = [
    {
        name: "মোঃ কাশেম",
        category: "transport",
        role: "পিকআপ ভ্যান (১ টন)",
        phone: "01819397669",
        altPhone: "01815707934",
        location: "মুরাদপুর রেলগেট স্ট্যান্ড",
        standardRate: "৫০০ টাকা (প্রতি ট্রিপ)",
        vehicleNo: "চট্ট-মেট্রো-ন ১১-২২৩৩",
        notes: "লোকাল শোরুম ও কাছাকাছি ডেলিভারির জন্য নির্ভরযোগ্য",
        isGoogleSynced: false
    },
    {
        name: "আলমগীর সর্দার",
        category: "labor",
        role: "লেবার সর্দার (লোডিং-আনলোডিং)",
        phone: "01815707934",
        altPhone: "",
        location: "মুরাদপুর মোড়",
        standardRate: "৭৫০ টাকা (দৈনিক হাজিরা / কন্টেইনার চুক্তি)",
        vehicleNo: "",
        notes: "কন্টেইনার খালাস বা বড় ট্রাক লোডিংয়ে ৫-১০ জন লেবার জোগাড় করে",
        isGoogleSynced: false
    },
    {
        name: "রহিম ড্রাইভার",
        category: "transport",
        role: "বড় ট্রাক (৫ টন)",
        phone: "01711000000",
        altPhone: "",
        location: "কদমতলী ট্রাক টার্মিনাল",
        standardRate: "চুক্তিভিত্তিক (দূরপাল্লা)",
        vehicleNo: "ঢাকা-মেট্রো-ট ১৫-৯৮৭৬",
        notes: "ঢাকা, বগুড়া ও উত্তরবঙ্গে পার্টস চালানের জন্য",
        isGoogleSynced: false
    },
    {
        name: "রফিক মিস্ত্রি",
        category: "technical",
        role: "লেদ মেশিন ও বুশ কাটিং",
        phone: "01911000000",
        altPhone: "",
        location: "হাজীপাড়া ওয়ার্কশপ",
        standardRate: "কাজ অনুযায়ী",
        vehicleNo: "",
        notes: "শ্যাফট টার্নিং ও থ্রেড কাটিংয়ের অভিজ্ঞ মিস্ত্রি",
        isGoogleSynced: false
    },
    {
        name: "ইকবাল হোসেন",
        category: "transport",
        role: "হ্যান্ড ট্রলি ও ভ্যান গাড়ি",
        phone: "01822000000",
        altPhone: "",
        location: "দোকানের সামনে / মুরাদপুর রেলগেট",
        standardRate: "১৫০ - ৩০০ টাকা",
        vehicleNo: "",
        notes: "গোডাউন থেকে শোরুমে পার্টস বহনের জন্য",
        isGoogleSynced: false
    },
    {
        name: "আমানত ক্রেন সার্ভিস",
        category: "labor",
        role: "মোবাইল ক্রেন (৫ টন)",
        phone: "01833000000",
        altPhone: "",
        location: "অক্সিজেন মোড়",
        standardRate: "৩,৫০০ টাকা (প্রতি ট্রিপ/ঘণ্টা)",
        vehicleNo: "চট্ট-ক্রেন-০৩",
        notes: "ভারী ইঞ্জিন ও গিয়ারবক্স গাড়ি থেকে নামানোর জন্য",
        isGoogleSynced: false
    }
];

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
            const snap = await this.collection.limit(1).get();
            if (snap.empty) {
                const batch = db.batch();
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
            }
        } catch (e) {
            console.warn('Seed contacts error:', e);
        }
        return false;
    }
}();

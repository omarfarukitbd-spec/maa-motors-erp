import { db, firebase } from '../firebase-config.js';
import { triggerSilentGodownContactGoogleSync } from './godown-google-sync.js';

/**
 * Initial Default Contacts for Godown Operations
 */
export const DEFAULT_GODOWN_CONTACTS = [
    {
        name: "হটলাইন ম্যানেজার",
        shopName: "ট্রাকবিডি৭১ (চট্টগ্রাম পিকআপ ও ট্রাক রেন্টাল)",
        category: "transport",
        role: "১ টন / ১.৫ টন পিকআপ ও ৭-১২ ফিট মিনিট্রাক",
        phone: "01771536999",
        altPhone: "01771537999",
        address: "মুরাদপুর ও বহদ্দারহাট পয়েন্ট, চট্টগ্রাম",
        location: "মুরাদপুর ও বহদ্দারহাট পয়েন্ট, চট্টগ্রাম",
        standardRate: "দূরত্ব ও ট্রিপ অনুযায়ী চুক্তিভিত্তিক",
        vehicleNo: "",
        notes: "বাসা বদল, গোডাউন শিফটিং ও সার্বক্ষণিক অন-কল পিকআপ সেবা",
        isGoogleSynced: false,
        isSample: false
    },
    {
        name: "কন্ট্রোল ডেস্ক",
        shopName: "পিকআপ রেন্টাল ও ট্রান্সপোর্ট সার্ভিস",
        category: "transport",
        role: "৭ ও ৯ ফিট খোলা ও কাভার্ড পিকআপ",
        phone: "01968732222",
        altPhone: "",
        address: "মুরাদপুর রেলগেট ও ২ নম্বর গেট, চট্টগ্রাম",
        location: "মুরাদপুর রেলগেট ও ২ নম্বর গেট, চট্টগ্রাম",
        standardRate: "৮০০ - ১৫০০ টাকা (চট্টগ্রাম শহর লোকাল ট্রিপ)",
        vehicleNo: "",
        notes: "লোকাল শোরুম ডেলিভারি ও দ্রুত পার্টস পরিবহনে নির্ভরযোগ্য",
        isGoogleSynced: false,
        isSample: false
    },
    {
        name: "ডিউটি ইনচার্জ",
        shopName: "চিটাগাং পিকআপ ও লাইট ট্রান্সপোর্ট",
        category: "transport",
        role: "১ টন টাটা এইস ও ছোট পিকআপ",
        phone: "01857252506",
        altPhone: "",
        address: "মুরাদপুর ফ্লাইওভার মোড় ও অক্সিজেন রোড",
        location: "মুরাদপুর ফ্লাইওভার মোড় ও অক্সিজেন রোড",
        standardRate: "আলোচনা সাপেক্ষে (লোকাল ট্রিপ)",
        vehicleNo: "",
        notes: "গোডাউন থেকে শোরুম বা ওয়ার্কশপে পার্টস বহনের জন্য সহজলভ্য",
        isGoogleSynced: false,
        isSample: false
    },
    {
        name: "লাইনম্যান / ড্রাইভার প্রতিনিধি",
        shopName: "মুরাদপুর ফ্লাইওভার ও রেলগেট পিকআপ স্ট্যান্ড",
        category: "transport",
        role: "টাটা এইস, মাহিন্দ্রা ও ভ্যান গাড়ি",
        phone: "01919550044",
        altPhone: "0312517515",
        address: "মির্জাপুর জলিল বিল্ডিং ও রেলগেট সংলগ্ন, মুরাদপুর, চট্টগ্রাম",
        location: "মুরাদপুর রেলগেট ও ফ্লাইওভার স্ট্যান্ড",
        standardRate: "৫০০ - ৮০০ টাকা (শহরের ভেতরে ট্রিপ)",
        vehicleNo: "",
        notes: "মুরাদপুর রেলগেট মোড়ে সরাসরি উপস্থিত থেকে তাৎক্ষণিক গাড়ি ভাড়া নেওয়া যায়",
        isGoogleSynced: false,
        isSample: false
    },
    {
        name: "সেন্ট্রাল বুকিং অফিস",
        shopName: "চট্টগ্রাম জেলা ট্রাক ও কাভার্ডভ্যান মালিক সমিতি",
        category: "transport",
        role: "৫ টন / ১০ টন ট্রাক, কাভার্ডভ্যান ও ট্রেইলার",
        phone: "01919550044",
        altPhone: "0312517515",
        address: "সেন্ট্রাল ট্রান্সপোর্ট জোন (মুরাদপুর ও কদমতলী), চট্টগ্রাম",
        location: "চট্টগ্রাম কেন্দ্রীয় পরিবহন টার্মিনাল",
        standardRate: "দূরপাল্লা ও কন্টেইনার চুক্তিভিত্তিক",
        vehicleNo: "",
        notes: "ঢাকা, বগুড়া ও দূরপাল্লার জেলায় ভারী পার্টস ও কন্টেইনার চালান বুকিং",
        isGoogleSynced: false,
        isSample: false
    },
    {
        name: "মুরাদপুর লেবার পয়েন্ট",
        shopName: "মুরাদপুর কুলি ও লোডিং-আনলোডিং শ্রমিক ইউনিয়ন",
        category: "labor",
        role: "ভারী পার্টস ও কন্টেইনার লোডিং-আনলোডিং শ্রমিক",
        phone: "01815707934",
        altPhone: "",
        address: "মুরাদপুর রেলগেট ও বিপ্লব উদ্যান রোড, চট্টগ্রাম",
        location: "মুরাদপুর মোড়",
        standardRate: "৮০০ টাকা (দৈনিক হাজিরা) / কন্টেইনার চুক্তি",
        vehicleNo: "",
        notes: "গোডাউনে কন্টেইনার খালাস বা বড় ট্রাক লোডিংয়ে লেবার টিম পাওয়া যায়",
        isGoogleSynced: false,
        isSample: false
    },
    {
        name: "মোহাম্মদ সেলিম (প্রোপ্রাইটার)",
        shopName: "বিছমিল্লাহ এন্টারপ্রাইজ",
        category: "রং মিস্ত্রি",
        role: "বিল্ডিং ও গোডাউন পেইন্টিং ঠিকাদার",
        phone: "01912373316",
        altPhone: "01723912211, 01676753023",
        address: "ভাই ভাই স্টোর, (ফিরোজশাহ্ বড় মসজিদের সামনে) পূর্ব ফিরোজশাহ্, আকবরশাহ্, চট্টগ্রাম",
        location: "ফিরোজশাহ্ ও আকবরশাহ্, চট্টগ্রাম",
        standardRate: "স্কয়ার ফিট বা চুক্তিভিত্তিক (আলোচনা সাপেক্ষে)",
        vehicleNo: "",
        notes: "বিল্ডিং ও গোডাউনের যাবতীয় রং, মাজন কাতিয়া রং, প্লাস্টিক রং, ওয়েদার কোট, ডিস্টেম্পার, স্প্রে রং করা হয়। অতিরিক্ত নম্বর: 01723-912211, 01676-753023",
        isGoogleSynced: false,
        isSample: false
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

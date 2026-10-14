import { db, firebase } from '../firebase-config.js';

export const HISTORICAL_GODOWN_BOOKS = [
    {
        bookSerial: 1,
        bookNo: '1901-1988',
        startMemoNo: 1901,
        endMemoNo: 1988,
        totalMemos: 88,
        startDate: '2025-11-02',
        endDate: '2025-11-26',
        grossSales: 27041960,
        totalLess: 3150,
        netSales: 27038810,
        cumulativeNetSales: 27038810,
        isHistorical: true,
        status: 'CLOSED',
        inChargeName: 'মোঃ এমরান',
        inChargeId: '১৯২৫',
        stampDate: '2025-11-26',
        documentNo: '00001'
    },
    {
        bookSerial: 2,
        bookNo: '2001-2100',
        startMemoNo: 2001,
        endMemoNo: 2100,
        totalMemos: 100,
        startDate: '2025-11-27',
        endDate: '2025-12-22',
        grossSales: 45758220,
        totalLess: 4800,
        netSales: 45753420,
        cumulativeNetSales: 72792230,
        isHistorical: true,
        status: 'CLOSED',
        inChargeName: 'মোঃ এমরান',
        inChargeId: '১৯২৫',
        stampDate: '2025-12-22',
        documentNo: '00001'
    },
    {
        bookSerial: 3,
        bookNo: '2101-2200',
        startMemoNo: 2101,
        endMemoNo: 2200,
        totalMemos: 100,
        startDate: '2025-12-22',
        endDate: '2026-01-21',
        grossSales: 35427050,
        totalLess: 10700,
        netSales: 35416350,
        cumulativeNetSales: 108208580,
        isHistorical: true,
        status: 'CLOSED',
        inChargeName: 'মোঃ এমরান',
        inChargeId: '১৯২৫',
        stampDate: '2026-01-21',
        documentNo: '00001'
    },
    {
        bookSerial: 4,
        bookNo: '2201-2295',
        startMemoNo: 2201,
        endMemoNo: 2295,
        totalMemos: 95,
        startDate: '2026-01-21',
        endDate: '2026-02-24',
        grossSales: 18553950,
        totalLess: 15650,
        netSales: 18538300,
        cumulativeNetSales: 126746880,
        isHistorical: true,
        status: 'CLOSED',
        inChargeName: 'মোঃ এমরান',
        inChargeId: '১৯২৫',
        stampDate: '2026-02-24',
        documentNo: '00001'
    },
    {
        bookSerial: 5,
        bookNo: '2301-2400',
        startMemoNo: 2301,
        endMemoNo: 2400,
        totalMemos: 100,
        startDate: '2026-02-25',
        endDate: '2026-03-31',
        grossSales: 36340200,
        totalLess: 24100,
        netSales: 36316100,
        cumulativeNetSales: 163062980,
        isHistorical: true,
        status: 'CLOSED',
        inChargeName: 'মোঃ এমরান',
        inChargeId: '১৯২৫',
        stampDate: '2026-03-31',
        documentNo: '00001'
    },
    {
        bookSerial: 6,
        bookNo: '2401-2500',
        startMemoNo: 2401,
        endMemoNo: 2500,
        totalMemos: 100,
        startDate: '2026-03-31',
        endDate: '2026-05-06',
        grossSales: 15370415,
        totalLess: 40650,
        netSales: 15329765,
        cumulativeNetSales: 178392745,
        isHistorical: true,
        status: 'CLOSED',
        inChargeName: 'মোঃ এমরান',
        inChargeId: '১৯২৫',
        stampDate: '2026-05-06',
        documentNo: '00001'
    },
    {
        bookSerial: 7,
        bookNo: '2501-2579',
        startMemoNo: 2501,
        endMemoNo: 2579,
        totalMemos: 79,
        startDate: '2026-05-06',
        endDate: '2026-06-29',
        grossSales: 18724750,
        totalLess: 3350,
        netSales: 18721400,
        cumulativeNetSales: 197114145,
        isHistorical: true,
        status: 'CLOSED',
        inChargeName: 'মোঃ এমরান',
        inChargeId: '১৯২৫',
        stampDate: '2026-06-29',
        documentNo: '00001'
    },
    {
        bookSerial: 8,
        bookNo: '01-100',
        startMemoNo: 1,
        endMemoNo: 100,
        totalMemos: 100,
        startDate: '2026-07-01',
        endDate: '2026-08-21',
        grossSales: 21812030,
        totalLess: 12500,
        netSales: 21799530,
        cumulativeNetSales: 218913675,
        isHistorical: true,
        status: 'CLOSED',
        inChargeName: 'মোঃ এমরান',
        inChargeId: '১৯২৫',
        stampDate: '2026-08-21',
        documentNo: '00001'
    },
    {
        bookSerial: 9,
        bookNo: '101-200',
        startMemoNo: 101,
        endMemoNo: 200,
        totalMemos: 100,
        startDate: '2026-08-21',
        endDate: '2026-10-07',
        grossSales: 49327497,
        totalLess: 76500,
        netSales: 49250997,
        cumulativeNetSales: 268164672,
        isHistorical: true,
        status: 'CLOSED',
        inChargeName: 'মোঃ এমরান',
        inChargeId: '১৯২৫',
        stampDate: '2026-10-07',
        documentNo: '00001'
    }
];

export const GodownMemoDAO = new class {
    constructor() {
        this.collection = db.collection('godown_memo_books');
        this.configDoc = db.collection('settings').doc('godown_memo_config');
    }

    /**
     * Seeds historical books into Firestore if collection is empty
     */
    async seedHistoricalBooksIfEmpty() {
        try {
            const snap = await this.collection.limit(1).get();
            if (!snap.empty) return { seeded: false, count: snap.size };

            const batch = db.batch();
            HISTORICAL_GODOWN_BOOKS.forEach(b => {
                const docRef = this.collection.doc(`hist_book_${String(b.bookSerial).padStart(2, '0')}`);
                batch.set(docRef, {
                    ...b,
                    createdAt: firebase.firestore.FieldValue.serverTimestamp(),
                    updatedAt: firebase.firestore.FieldValue.serverTimestamp()
                });
            });

            await batch.commit();

            // Set default active book config
            await this.configDoc.set({
                activeBookSerial: 10,
                startMemoNo: 201,
                endMemoNo: 300,
                defaultOfficerName: 'মোঃ এমরান',
                defaultOfficerId: '১৯২৫',
                updatedAt: firebase.firestore.FieldValue.serverTimestamp()
            }, { merge: true });

            return { seeded: true, count: HISTORICAL_GODOWN_BOOKS.length };
        } catch (e) {
            console.error('seedHistoricalBooksIfEmpty error:', e);
            return { seeded: false, error: e.message };
        }
    }

    /**
     * Listen to all books in real time ordered by bookSerial ascending
     */
    listenAllBooks(callback) {
        return this.collection.orderBy('bookSerial', 'asc').onSnapshot(snap => {
            const books = [];
            snap.forEach(doc => {
                books.push({ id: doc.id, ...doc.data() });
            });
            if (books.length === 0) {
                callback(HISTORICAL_GODOWN_BOOKS);
            } else {
                callback(books);
            }
        }, err => {
            console.error('GodownMemoDAO listenAllBooks error:', err);
            callback(HISTORICAL_GODOWN_BOOKS);
        });
    }

    /**
     * Fetch active book configuration
     */
    async getActiveBookConfig() {
        try {
            const doc = await this.configDoc.get();
            if (doc.exists) {
                return doc.data();
            }
            return {
                activeBookSerial: 10,
                startMemoNo: 201,
                endMemoNo: 300,
                defaultOfficerName: 'মোঃ এমরান',
                defaultOfficerId: '১৯২৫'
            };
        } catch (e) {
            console.error('getActiveBookConfig error:', e);
            return {
                activeBookSerial: 10,
                startMemoNo: 201,
                endMemoNo: 300,
                defaultOfficerName: 'মোঃ এমরান',
                defaultOfficerId: '১৯২৫'
            };
        }
    }

    /**
     * Save/update active book configuration
     */
    async saveActiveBookConfig(config) {
        try {
            await this.configDoc.set({
                ...config,
                updatedAt: firebase.firestore.FieldValue.serverTimestamp()
            }, { merge: true });
            return true;
        } catch (e) {
            console.error('saveActiveBookConfig error:', e);
            return false;
        }
    }

    /**
     * Add a newly completed book to the register
     */
    async addBook(bookData) {
        const docRef = this.collection.doc();
        await docRef.set({
            ...bookData,
            createdAt: firebase.firestore.FieldValue.serverTimestamp(),
            updatedAt: firebase.firestore.FieldValue.serverTimestamp()
        });
        return docRef.id;
    }

    /**
     * Update an existing book
     */
    async updateBook(id, bookData) {
        await this.collection.doc(id).set({
            ...bookData,
            updatedAt: firebase.firestore.FieldValue.serverTimestamp()
        }, { merge: true });
        return true;
    }

    /**
     * Delete a book (security restricted)
     */
    async deleteBook(id) {
        await this.collection.doc(id).delete();
        return true;
    }
}();

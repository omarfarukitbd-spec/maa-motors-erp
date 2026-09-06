import { TransactionDAO, BankDAO, CashCollectorDAO } from '../dao.js';
import { toDBDate } from '../utils.js';

/**
 * Fetch Account Anchor (Effective Start Date & Opening Balance)
 */
export async function getAccountAnchor(accountName, isCash) {
    let effectiveStartDate = null;
    let initialOpeningBalance = 0;

    try {
        const dao = isCash ? CashCollectorDAO : BankDAO;
        const snap = await dao.collection.where('name', '==', accountName).limit(1).get();
        if (!snap.empty) {
            const data = snap.docs[0].data();
            if (data.effectiveStartDate) {
                effectiveStartDate = toDBDate(data.effectiveStartDate);
            }
            if (data.openingBalance !== undefined && !isNaN(Number(data.openingBalance))) {
                initialOpeningBalance = Number(data.openingBalance);
            }
        }
    } catch (err) {
        console.warn(`Anchor fetch warning for ${accountName}:`, err);
    }

    return { effectiveStartDate, initialOpeningBalance };
}

/**
 * Fetch Customer Collections matching this account with deduplication.
 * For 'শোরুম ক্যাশ', pulls collections where receivedFrom is 'শোরুম ক্যাশ'/'Cash'/'ক্যাশ'
 * OR where receivedType is 'Cash' without another specific collector assigned.
 */
export async function fetchAccountCollections(accountName) {
    if (!accountName) return [];

    const isShowroomCash = (accountName === 'শোরুম ক্যাশ');
    const docMap = new Map();

    const queries = [
        TransactionDAO.collection.where('receivedFrom', '==', accountName).get()
    ];

    if (isShowroomCash) {
        queries.push(TransactionDAO.collection.where('receivedType', '==', 'Cash').get());
        queries.push(TransactionDAO.collection.where('receivedFrom', '==', 'ক্যাশ').get());
        queries.push(TransactionDAO.collection.where('receivedFrom', '==', 'Cash').get());
    }

    const [snapshots, otherCollectors] = await Promise.all([
        Promise.all(queries),
        isShowroomCash ? CashCollectorDAO.getActiveCollectors() : Promise.resolve([])
    ]);

    const otherCollectorNames = new Set();
    if (isShowroomCash && Array.isArray(otherCollectors)) {
        otherCollectors.forEach(c => {
            const cName = String(c.name || '').trim();
            if (cName && cName !== 'শোরুম ক্যাশ') {
                otherCollectorNames.add(cName);
            }
        });
    }

    snapshots.forEach(snap => {
        snap.forEach(doc => {
            if (docMap.has(doc.id)) return;
            const data = doc.data();
            if (String(data.receivedType || '').trim() === 'Less') return;

            const paid = Number(data.paid || 0);
            if (isNaN(paid) || paid <= 0) return;

            const rf = String(data.receivedFrom || '').trim();
            const rt = String(data.receivedType || '').trim();

            if (isShowroomCash) {
                if (rf && otherCollectorNames.has(rf)) return;
                if (rf === 'শোরুম ক্যাশ' || rf === 'Cash' || rf === 'ক্যাশ' || (!rf && rt === 'Cash') || rt === 'Cash') {
                    docMap.set(doc.id, { id: doc.id, ...data, paid });
                }
            } else {
                if (rf === accountName) {
                    docMap.set(doc.id, { id: doc.id, ...data, paid });
                }
            }
        });
    });

    return Array.from(docMap.values());
}

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
 * OR where receivedType is 'Cash' without another specific bank or collector assigned.
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

    const [snapshots, otherCollectors, activeBanks] = await Promise.all([
        Promise.all(queries),
        isShowroomCash ? CashCollectorDAO.getActiveCollectors() : Promise.resolve([]),
        isShowroomCash ? BankDAO.getActiveBanks() : Promise.resolve([])
    ]);

    const otherAccountNames = new Set();
    if (isShowroomCash) {
        if (Array.isArray(otherCollectors)) {
            otherCollectors.forEach(c => {
                const cName = String(c.name || '').trim();
                if (cName && cName !== 'শোরুম ক্যাশ') otherAccountNames.add(cName);
            });
        }
        if (Array.isArray(activeBanks)) {
            activeBanks.forEach(b => {
                const bName = String(b.name || '').trim();
                if (bName) otherAccountNames.add(bName);
            });
        }
    }

    snapshots.forEach(snap => {
        snap.forEach(doc => {
            if (docMap.has(doc.id)) return;
            const data = doc.data();
            
            // Skip Less / Discounts
            if (String(data.receivedType || '').trim() === 'Less') return;

            // Skip customer ledger opening balances (not showroom cash collections)
            const v = String(data.voucherNo || '').trim().toUpperCase();
            if (v === 'OPENING' || v === 'OPEN' || v === 'প্রারম্ভিক ব্যালেন্স' || v === 'প্রারম্ভিক জের') return;

            const paid = Number(data.paid || 0);
            if (isNaN(paid) || paid <= 0) return;

            const rf = String(data.receivedFrom || '').trim();
            const rt = String(data.receivedType || '').trim();

            if (isShowroomCash) {
                // If explicitly tagged with another active collector or bank, skip
                if (rf && otherAccountNames.has(rf)) return;

                // Belongs to Showroom Cash if receivedFrom is cash variant or receivedType is Cash with no other account
                const isExplicitCash = (rf === 'শোরুম ক্যাশ' || rf === 'Cash' || rf === 'ক্যাশ');
                const isUnassignedCash = (!rf && rt === 'Cash');

                if (isExplicitCash || isUnassignedCash) {
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

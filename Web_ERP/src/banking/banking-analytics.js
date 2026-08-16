import { TransactionDAO, BankTransactionDAO } from '../dao.js';

export async function getBankingSummary(dateFilter = 'month') {
    let startDate = '';
    let endDate = '';
    const todayObj = new Date();
    
    if (dateFilter === 'today') {
        const d = todayObj.toISOString().split('T')[0];
        startDate = d; endDate = d;
    } else if (dateFilter === 'week') {
        // Find start of week (Sunday)
        const d = new Date(todayObj);
        const day = d.getDay();
        const diff = d.getDate() - day;
        const firstDay = new Date(d.setDate(diff));
        const lastDay = new Date(d.setDate(diff + 6));
        
        startDate = firstDay.toISOString().split('T')[0];
        endDate = lastDay.toISOString().split('T')[0];
    } else if (dateFilter === 'month') {
        const y = todayObj.getFullYear();
        const m = String(todayObj.getMonth() + 1).padStart(2, '0');
        startDate = `${y}-${m}-01`;
        const lastDay = new Date(y, todayObj.getMonth() + 1, 0);
        endDate = `${y}-${m}-${String(lastDay.getDate()).padStart(2, '0')}`;
    } else if (dateFilter === 'year') {
        const y = todayObj.getFullYear();
        startDate = `${y}-01-01`;
        endDate = `${y}-12-31`;
    }

    // 1. Get all customer collections in range
    let collectionsSnap;
    if (dateFilter === 'all') {
        collectionsSnap = await TransactionDAO.collection.get();
    } else {
        collectionsSnap = await TransactionDAO.collection
            .where('date', '>=', startDate)
            .where('date', '<=', endDate)
            .get();
    }

    // 2. Get all bank transactions in range
    let bankTxnSnap;
    if (dateFilter === 'all') {
        bankTxnSnap = await BankTransactionDAO.collection.get();
    } else {
        bankTxnSnap = await BankTransactionDAO.collection
            .where('date', '>=', startDate)
            .where('date', '<=', endDate)
            .get();
    }

    // Process
    let totalIn = 0;
    let totalOut = 0;

    collectionsSnap.forEach(doc => {
        const t = doc.data();
        if (t.paid && !isNaN(t.paid) && t.receivedFrom) {
            totalIn += Number(t.paid);
        }
    });

    bankTxnSnap.forEach(doc => {
        const t = doc.data();
        if (t.type === 'DEPOSIT') totalIn += Number(t.amount);
        if (t.type === 'WITHDRAWAL') totalOut += Number(t.amount);
        // We ignore TRANSFER since it's just moving money internally
    });

    return {
        totalIn,
        totalOut,
        netFlow: totalIn - totalOut
    };
}

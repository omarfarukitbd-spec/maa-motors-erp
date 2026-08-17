import { TransactionDAO, BankTransactionDAO } from '../dao.js';
import { toDBDate, getTodayLocalDateString } from '../utils.js';

export async function getBankingSummary(dateFilter = 'month') {
    let startDate = '';
    let endDate = '';
    const todayObj = new Date();
    const todayStr = getTodayLocalDateString();
    
    if (typeof dateFilter === 'string' && dateFilter.includes(' to ')) {
        const [start, end] = dateFilter.split(' to ');
        startDate = toDBDate(start.trim());
        endDate = toDBDate(end.trim());
    } else if (typeof dateFilter === 'string' && (dateFilter.includes('/') || (dateFilter.includes('-') && dateFilter.length === 10))) {
        const d = toDBDate(dateFilter.trim());
        startDate = d;
        endDate = d;
    } else if (dateFilter === 'today') {
        startDate = todayStr;
        endDate = todayStr;
    } else if (dateFilter === 'week') {
        const d = new Date(todayObj);
        const day = d.getDay();
        const diff = d.getDate() - day;
        const firstDay = new Date(d.setDate(diff));
        const lastDay = new Date(d.setDate(diff + 6));
        startDate = toDBDate(firstDay);
        endDate = toDBDate(lastDay);
    } else if (dateFilter === 'month') {
        const y = todayObj.getFullYear();
        const m = String(todayObj.getMonth() + 1).padStart(2, '0');
        startDate = `${y}-${m}-01`;
        const lastDay = new Date(y, todayObj.getMonth() + 1, 0);
        endDate = `${y}-${m}-${String(lastDay.getDate()).padStart(2, '0')}`;
    } else if (dateFilter === 'lastMonth') {
        const prevMonthDate = new Date(todayObj.getFullYear(), todayObj.getMonth() - 1, 1);
        const y = prevMonthDate.getFullYear();
        const m = String(prevMonthDate.getMonth() + 1).padStart(2, '0');
        startDate = `${y}-${m}-01`;
        const lastDay = new Date(y, prevMonthDate.getMonth() + 1, 0);
        endDate = `${y}-${m}-${String(lastDay.getDate()).padStart(2, '0')}`;
    } else if (dateFilter === 'year') {
        const y = todayObj.getFullYear();
        startDate = `${y}-01-01`;
        endDate = `${y}-12-31`;
    }

    // 1. Get all customer collections in range
    let collectionsSnap;
    if (dateFilter === 'all' || !startDate || !endDate) {
        collectionsSnap = await TransactionDAO.collection.get();
    } else if (startDate === endDate) {
        collectionsSnap = await TransactionDAO.collection.where('date', '==', startDate).get();
    } else {
        collectionsSnap = await TransactionDAO.collection
            .where('date', '>=', startDate)
            .where('date', '<=', endDate)
            .get();
    }

    // 2. Get all bank transactions in range
    let bankTxnSnap;
    if (dateFilter === 'all' || !startDate || !endDate) {
        bankTxnSnap = await BankTransactionDAO.collection.get();
    } else if (startDate === endDate) {
        bankTxnSnap = await BankTransactionDAO.collection.where('date', '==', startDate).get();
    } else {
        bankTxnSnap = await BankTransactionDAO.collection
            .where('date', '>=', startDate)
            .where('date', '<=', endDate)
            .get();
    }

    // Process calculations
    let totalCustomerCollections = 0;
    let totalDeposits = 0;
    let totalWithdrawals = 0;

    collectionsSnap.forEach(doc => {
        const t = doc.data();
        const paid = Number(t.paid || 0);
        if (paid > 0 && t.receivedFrom) {
            totalCustomerCollections += paid;
        }
    });

    bankTxnSnap.forEach(doc => {
        const t = doc.data();
        const amt = Number(t.amount || 0);
        if (t.type === 'DEPOSIT') totalDeposits += amt;
        if (t.type === 'WITHDRAWAL') totalWithdrawals += amt;
    });

    const totalIn = totalCustomerCollections + totalDeposits;
    const totalOut = totalWithdrawals;

    return {
        totalCustomerCollections,
        totalDeposits,
        totalWithdrawals,
        totalIn,
        totalOut,
        netFlow: totalIn - totalOut
    };
}

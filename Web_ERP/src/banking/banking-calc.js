import { TransactionDAO, BankTransactionDAO } from '../dao.js';
import { safeRound } from '../utils.js';

/**
 * Calculate dynamic balance for a specific bank or cash account
 * 
 * Balance = (Customer Payments into this account) 
 *         + (Manual Deposits into this account) 
 *         + (Transfers to this account from other banks)
 *         - (Manual Withdrawals from this account)
 *         - (Transfers from this account to other banks)
 */
export async function calculateAccountBalance(accountName, isCash = false) {
    if (!accountName) return 0;
    
    // Run all 3 queries concurrently to speed up calculation
    const [collectionSnap, bankTxns, incomingTxns] = await Promise.all([
        TransactionDAO.collection.where('receivedFrom', '==', accountName).get(),
        BankTransactionDAO.getByBank(accountName),
        BankTransactionDAO.getTransfersByTargetBank(accountName)
    ]);
        
    // 1. Process Customer Collections
    let customerCollectionTotal = 0;
    collectionSnap.forEach(doc => {
        const t = doc.data();
        if (t.paid && !isNaN(t.paid)) {
            customerCollectionTotal += Number(t.paid);
        }
    });

    // 2. Process Bank Transactions (Deposits, Withdrawals, Transfers outgoing)
    let manualDeposits = 0;
    let manualWithdrawals = 0;
    let outgoingTransfers = 0;
    
    bankTxns.forEach(tx => {
        const amt = Number(tx.amount || 0);
        if (tx.type === 'DEPOSIT') manualDeposits += amt;
        else if (tx.type === 'WITHDRAWAL') manualWithdrawals += amt;
        else if (tx.type === 'TRANSFER') outgoingTransfers += amt;
    });
    
    // 3. Process Incoming Transfers
    let incomingTransfers = 0;
    incomingTxns.forEach(tx => {
        incomingTransfers += Number(tx.amount || 0);
    });

    // Final Balance
    const balance = customerCollectionTotal + manualDeposits + incomingTransfers - manualWithdrawals - outgoingTransfers;
    return safeRound(balance);
}

export async function getAccountLedgerTransactions(accountName, isCash, fromDateStr, toDateStr) {
    if (!accountName) return { openingBalance: 0, transactions: [], closingBalance: 0 };

    // 1. Fetch Customer Collections
    const collectionSnap = await TransactionDAO.collection.where('receivedFrom', '==', accountName).get();
    let allTxns = [];
    
    collectionSnap.forEach(doc => {
        const t = doc.data();
        if (t.paid && !isNaN(t.paid) && Number(t.paid) > 0) {
            allTxns.push({
                id: doc.id,
                dateStr: t.date || '',
                createdAt: t.createdAt ? (typeof t.createdAt.toMillis === 'function' ? t.createdAt.toMillis() : t.createdAt) : 0,
                type: 'CUSTOMER_PAYMENT',
                amount: Number(t.paid),
                isCredit: true,
                isDebit: false,
                note: `Payment from ${t.customerName} (Voucher: ${t.voucherNo || '-'})`,
                customerName: t.customerName
            });
        }
    });

    // 2. Fetch Bank Transactions (Deposit, Withdrawal, Outgoing Transfer)
    const bankTxns = await BankTransactionDAO.getByBank(accountName);
    bankTxns.forEach(t => {
        const amt = Number(t.amount || 0);
        if (amt > 0) {
            allTxns.push({
                id: t.id,
                dateStr: t.date || '',
                createdAt: t.createdAt ? (typeof t.createdAt.toMillis === 'function' ? t.createdAt.toMillis() : t.createdAt) : 0,
                type: t.type,
                amount: amt,
                isCredit: t.type === 'DEPOSIT',
                isDebit: t.type === 'WITHDRAWAL' || t.type === 'TRANSFER',
                note: t.type === 'TRANSFER' ? `Transfer to ${t.targetBankName}. ${t.note || ''}` : (t.note || '-'),
                targetBank: t.targetBankName || ''
            });
        }
    });

    // 3. Fetch Incoming Transfers
    const incomingTxns = await BankTransactionDAO.getTransfersByTargetBank(accountName);
    incomingTxns.forEach(t => {
        const amt = Number(t.amount || 0);
        if (amt > 0) {
            allTxns.push({
                id: t.id,
                dateStr: t.date || '',
                createdAt: t.createdAt ? (typeof t.createdAt.toMillis === 'function' ? t.createdAt.toMillis() : t.createdAt) : 0,
                type: 'INCOMING_TRANSFER',
                amount: amt,
                isCredit: true,
                isDebit: false,
                note: `Transfer from ${t.bankName}. ${t.note || ''}`,
                sourceBank: t.bankName
            });
        }
    });

    // Normalize dates for sorting
    allTxns.forEach(t => {
        if (!t.dateStr && t.createdAt) {
            t.dateStr = new Date(t.createdAt).toISOString().split('T')[0];
        }
        t.sortTime = t.createdAt || (new Date(t.dateStr).getTime() || 0);
    });

    // Sort ascending by date & time
    allTxns.sort((a, b) => {
        if (a.dateStr === b.dateStr) return a.sortTime - b.sortTime;
        return a.dateStr.localeCompare(b.dateStr);
    });

    // Filter by Date and calculate opening balance
    let openingBalance = 0;
    const filteredTxns = [];

    const fromDate = fromDateStr ? new Date(fromDateStr) : null;
    if (fromDate) fromDate.setHours(0, 0, 0, 0);
    const toDate = toDateStr ? new Date(toDateStr) : null;
    if (toDate) toDate.setHours(23, 59, 59, 999);

    allTxns.forEach(t => {
        const tDate = new Date(t.dateStr);
        tDate.setHours(12, 0, 0, 0); 

        if (fromDate && tDate < fromDate) {
            if (t.isCredit) openingBalance += t.amount;
            if (t.isDebit) openingBalance -= t.amount;
        } else if (toDate && tDate > toDate) {
            // After To Date -> ignore
        } else {
            // Inside Date Range -> add to filtered list
            filteredTxns.push(t);
        }
    });

    let currentBal = openingBalance;
    filteredTxns.forEach(t => {
        if (t.isCredit) currentBal += t.amount;
        if (t.isDebit) currentBal -= t.amount;
        t.runningBalance = currentBal;
    });

    return {
        openingBalance: safeRound(openingBalance),
        transactions: filteredTxns, 
        closingBalance: safeRound(currentBal)
    };
}

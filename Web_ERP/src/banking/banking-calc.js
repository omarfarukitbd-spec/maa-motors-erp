import { TransactionDAO, BankTransactionDAO, ExpenseDAO } from '../dao.js';
import { safeRound, toDBDate } from '../utils.js';

/**
 * Calculate dynamic balance for a specific bank or cash account
 * 
 * Balance = (Customer Payments into this account) 
 *         + (Manual Deposits into this account) 
 *         + (Transfers to this account from other banks)
 *         - (Manual Withdrawals from this account)
 *         - (Transfers from this account to other banks)
 *         - (Expenses disbursed from this account)
 */
export async function calculateAccountBalance(accountName, isCash = false) {
    if (!accountName) return 0;
    
    // Run all 4 queries concurrently to speed up calculation
    const [collectionSnap, bankTxns, incomingTxns, expenseSnap] = await Promise.all([
        TransactionDAO.collection.where('receivedFrom', '==', accountName).get(),
        BankTransactionDAO.getByBank(accountName),
        BankTransactionDAO.getTransfersByTargetBank(accountName),
        ExpenseDAO.collection.where('paymentAccount', '==', accountName).get()
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
        const rawType = String(tx.type || '').toUpperCase();
        if (rawType === 'DEPOSIT') manualDeposits += amt;
        else if (rawType === 'WITHDRAWAL' || rawType === 'WITHDRAW') manualWithdrawals += amt;
        else if (rawType === 'TRANSFER') outgoingTransfers += amt;
    });
    
    // 3. Process Incoming Transfers
    let incomingTransfers = 0;
    incomingTxns.forEach(tx => {
        incomingTransfers += Number(tx.amount || 0);
    });

    // 4. Process Expenses disbursed from this account
    let expenseTotal = 0;
    expenseSnap.forEach(doc => {
        const exp = doc.data();
        const amt = Number(exp.amount || 0);
        if (!isNaN(amt) && amt > 0) {
            expenseTotal += amt;
        }
    });

    // Final Balance
    const balance = customerCollectionTotal + manualDeposits + incomingTransfers - manualWithdrawals - outgoingTransfers - expenseTotal;
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
        const rawType = String(t.type || '').toUpperCase();
        const isDep = rawType === 'DEPOSIT';
        const isWith = rawType === 'WITHDRAWAL' || rawType === 'WITHDRAW';
        const isTrans = rawType === 'TRANSFER';
        if (amt > 0) {
            allTxns.push({
                id: t.id,
                dateStr: t.date || '',
                createdAt: t.createdAt ? (typeof t.createdAt.toMillis === 'function' ? t.createdAt.toMillis() : t.createdAt) : 0,
                type: isDep ? 'DEPOSIT' : (isWith ? 'WITHDRAWAL' : 'TRANSFER'),
                amount: amt,
                isCredit: isDep,
                isDebit: isWith || isTrans,
                note: isTrans ? `Transfer to ${t.targetBankName}. ${t.note || ''}` : (t.note || '-'),
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

    // 4. Fetch Business Expenses disbursed from this account
    const expenseSnap = await ExpenseDAO.collection.where('paymentAccount', '==', accountName).get();
    expenseSnap.forEach(doc => {
        const exp = doc.data();
        const amt = Number(exp.amount || 0);
        if (amt > 0) {
            allTxns.push({
                id: doc.id,
                dateStr: exp.date || '',
                createdAt: exp.createdAt ? (typeof exp.createdAt.toMillis === 'function' ? exp.createdAt.toMillis() : exp.createdAt) : 0,
                type: 'BUSINESS_EXPENSE',
                amount: amt,
                isCredit: false,
                isDebit: true,
                note: `খরচ: ${exp.category || 'ব্যবসায়িক খরচ'}${exp.details ? ' (' + exp.details + ')' : ''}`,
                category: exp.category
            });
        }
    });

    // Normalize dates for sorting
    allTxns.forEach(t => {
        t.dateStr = toDBDate(t.dateStr || t.createdAt);
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

    const fromDate = fromDateStr ? toDBDate(fromDateStr) : '';
    const toDate = toDateStr ? toDBDate(toDateStr) : '';

    allTxns.forEach(t => {
        const dbDate = toDBDate(t.dateStr);

        if (fromDate && dbDate < fromDate) {
            if (t.isCredit) openingBalance += t.amount;
            if (t.isDebit) openingBalance -= t.amount;
        } else if (toDate && dbDate > toDate) {
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

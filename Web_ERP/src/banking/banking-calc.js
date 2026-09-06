import { TransactionDAO, BankTransactionDAO, ExpenseDAO, BankDAO, CashCollectorDAO } from '../dao.js';
import { safeRound, toDBDate } from '../utils.js';

/**
 * Fetch Account Anchor (Effective Start Date & Opening Balance)
 */
async function getAccountAnchor(accountName, isCash) {
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

    // Default Anchor Fallback for 'শোরুম ক্যাশ' to isolate historical legacy data
    if (!effectiveStartDate && accountName === 'শোরুম ক্যাশ') {
        effectiveStartDate = '2026-09-01';
        initialOpeningBalance = 0;
    }

    return { effectiveStartDate, initialOpeningBalance };
}

/**
 * Calculate dynamic balance for a specific bank or cash account
 * 
 * Balance = (Initial Opening Balance)
 *         + (Customer Payments into this account) 
 *         + (Manual Deposits into this account) 
 *         + (Transfers to this account from other banks)
 *         - (Manual Withdrawals from this account)
 *         - (Transfers from this account to other banks)
 *         - (Expenses disbursed from this account [Non-Showroom Cash])
 */
export async function calculateAccountBalance(accountName, isCash = false, upToDate = null) {
    if (!accountName) return 0;
    const targetDate = upToDate ? toDBDate(upToDate) : null;
    
    // Run queries concurrently
    const [collectionSnap, bankTxns, incomingTxns, expenseSnap, anchor] = await Promise.all([
        TransactionDAO.collection.where('receivedFrom', '==', accountName).get(),
        BankTransactionDAO.getByBank(accountName),
        BankTransactionDAO.getTransfersByTargetBank(accountName),
        (accountName === 'শোরুম ক্যাশ') ? [] : ExpenseDAO.collection.where('paymentAccount', '==', accountName).get(),
        getAccountAnchor(accountName, isCash)
    ]);

    const { effectiveStartDate, initialOpeningBalance } = anchor;
        
    // 1. Process Customer Collections
    let customerCollectionTotal = 0;
    collectionSnap.forEach(doc => {
        const t = doc.data();
        const d = toDBDate(t.date || '');
        if (effectiveStartDate && d < effectiveStartDate) return;
        if (targetDate && d > targetDate) return;
        // BUG-3 FIX: Less/Discount payments must NOT count as bank/cash inflow
        if (String(t.receivedType || '').trim() === 'Less') return;
        if (t.paid && !isNaN(t.paid)) {
            customerCollectionTotal = safeRound(customerCollectionTotal + Number(t.paid));
        }
    });

    // 2. Process Bank Transactions (Deposits, Withdrawals, Transfers outgoing)
    let manualDeposits = 0;
    let manualWithdrawals = 0;
    let outgoingTransfers = 0;
    
    bankTxns.forEach(tx => {
        const d = toDBDate(tx.date || '');
        if (effectiveStartDate && d < effectiveStartDate) return;
        if (targetDate && d > targetDate) return;
        const amt = Number(tx.amount || 0);
        const rawType = String(tx.type || '').toUpperCase();
        if (rawType === 'DEPOSIT') manualDeposits = safeRound(manualDeposits + amt);
        else if (rawType === 'WITHDRAWAL' || rawType === 'WITHDRAW') manualWithdrawals = safeRound(manualWithdrawals + amt);
        else if (rawType === 'TRANSFER') outgoingTransfers = safeRound(outgoingTransfers + amt);
    });
    
    // 3. Process Incoming Transfers
    let incomingTransfers = 0;
    incomingTxns.forEach(tx => {
        const d = toDBDate(tx.date || '');
        if (effectiveStartDate && d < effectiveStartDate) return;
        if (targetDate && d > targetDate) return;
        incomingTransfers = safeRound(incomingTransfers + Number(tx.amount || 0));
    });

    // 4. Process Expenses disbursed from this account (Excluded for শোরুম ক্যাশ)
    let expenseTotal = 0;
    if (accountName !== 'শোরুম ক্যাশ' && expenseSnap && typeof expenseSnap.forEach === 'function') {
        expenseSnap.forEach(doc => {
            const exp = doc.data();
            const d = toDBDate(exp.date || '');
            if (effectiveStartDate && d < effectiveStartDate) return;
            if (targetDate && d > targetDate) return;
            const amt = Number(exp.amount || 0);
            if (!isNaN(amt) && amt > 0) {
                expenseTotal = safeRound(expenseTotal + amt);
            }
        });
    }

    // Final Balance
    const balance = safeRound(initialOpeningBalance + customerCollectionTotal + manualDeposits + incomingTransfers - manualWithdrawals - outgoingTransfers - expenseTotal);
    return balance;
}

export async function getAccountLedgerTransactions(accountName, isCash, fromDateStr, toDateStr) {
    if (!accountName) return { openingBalance: 0, transactions: [], closingBalance: 0 };

    // Parallel fetch
    const [collectionSnap, bankTxns, incomingTxns, expenseSnap, anchor] = await Promise.all([
        TransactionDAO.collection.where('receivedFrom', '==', accountName).get(),
        BankTransactionDAO.getByBank(accountName),
        BankTransactionDAO.getTransfersByTargetBank(accountName),
        (accountName === 'শোরুম ক্যাশ') ? [] : ExpenseDAO.collection.where('paymentAccount', '==', accountName).get(),
        getAccountAnchor(accountName, isCash)
    ]);

    const { effectiveStartDate, initialOpeningBalance } = anchor;
    let allTxns = [];
    
    // 1. Fetch Customer Collections
    collectionSnap.forEach(doc => {
        const t = doc.data();
        if (String(t.receivedType || '').trim() === 'Less') return;
        const d = toDBDate(t.date || '');
        if (effectiveStartDate && d < effectiveStartDate) return;

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
    bankTxns.forEach(t => {
        const d = toDBDate(t.date || '');
        if (effectiveStartDate && d < effectiveStartDate) return;

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
    incomingTxns.forEach(t => {
        const d = toDBDate(t.date || '');
        if (effectiveStartDate && d < effectiveStartDate) return;

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

    // 4. Fetch Business Expenses (Excluded for শোরুম ক্যাশ)
    if (accountName !== 'শোরুম ক্যাশ' && expenseSnap && typeof expenseSnap.forEach === 'function') {
        expenseSnap.forEach(doc => {
            const exp = doc.data();
            const d = toDBDate(exp.date || '');
            if (effectiveStartDate && d < effectiveStartDate) return;

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
    }

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
    let openingBalance = initialOpeningBalance;
    const filteredTxns = [];

    const fromDate = fromDateStr ? toDBDate(fromDateStr) : '';
    const toDate = toDateStr ? toDBDate(toDateStr) : '';

    const effectiveFromDate = (effectiveStartDate && (!fromDate || fromDate < effectiveStartDate))
        ? effectiveStartDate
        : fromDate;

    allTxns.forEach(t => {
        const dbDate = toDBDate(t.dateStr);

        if (effectiveFromDate && dbDate < effectiveFromDate) {
            if (t.isCredit) openingBalance = safeRound(openingBalance + t.amount);
            if (t.isDebit) openingBalance = safeRound(openingBalance - t.amount);
        } else if (toDate && dbDate > toDate) {
            // After To Date -> ignore
        } else {
            // Inside Date Range -> add to filtered list
            filteredTxns.push(t);
        }
    });

    let currentBal = openingBalance;
    filteredTxns.forEach(t => {
        if (t.isCredit) currentBal = safeRound(currentBal + t.amount);
        if (t.isDebit) currentBal = safeRound(currentBal - t.amount);
        t.runningBalance = currentBal;
    });

    return {
        openingBalance: safeRound(openingBalance),
        transactions: filteredTxns, 
        closingBalance: safeRound(currentBal)
    };
}

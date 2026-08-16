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
    
    // 1. Get Customer Collections (from TransactionDAO)
    // For Cash, receivedType is 'Cash'. For Bank, it is 'Bank'
    const rType = isCash ? 'Cash' : 'Bank';
    
    // Note: TransactionDAO has no direct getByReceivedFrom, so we fetch all matching
    const collectionSnap = await TransactionDAO.collection
        .where('receivedType', '==', rType)
        .where('receivedFrom', '==', accountName)
        .get();
        
    let customerCollectionTotal = 0;
    collectionSnap.forEach(doc => {
        const t = doc.data();
        if (t.receivedAmount && !isNaN(t.receivedAmount)) {
            customerCollectionTotal += Number(t.receivedAmount);
        }
    });

    // 2. Get Bank Transactions (Deposits, Withdrawals, Transfers outgoing)
    const bankTxns = await BankTransactionDAO.getByBank(accountName);
    
    let manualDeposits = 0;
    let manualWithdrawals = 0;
    let outgoingTransfers = 0;
    
    bankTxns.forEach(tx => {
        const amt = Number(tx.amount || 0);
        if (tx.type === 'DEPOSIT') manualDeposits += amt;
        else if (tx.type === 'WITHDRAWAL') manualWithdrawals += amt;
        else if (tx.type === 'TRANSFER') outgoingTransfers += amt;
    });
    
    // 3. Get Incoming Transfers (from other banks to this bank)
    const incomingTxns = await BankTransactionDAO.getTransfersByTargetBank(accountName);
    let incomingTransfers = 0;
    incomingTxns.forEach(tx => {
        incomingTransfers += Number(tx.amount || 0);
    });

    // Final Balance
    const balance = customerCollectionTotal + manualDeposits + incomingTransfers - manualWithdrawals - outgoingTransfers;
    return safeRound(balance);
}

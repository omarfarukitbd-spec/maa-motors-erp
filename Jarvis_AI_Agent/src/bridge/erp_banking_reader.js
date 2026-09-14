import { db } from '../config.js';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { safeRound } from './erp_bridge.js';

/**
 * 🏦 ERP Banking Reader — Live Running Balances & Liquidity Intelligence
 */

export async function getAllBankRunningBalances() {
    try {
        // 1. Fetch Banks and Cash Collectors in parallel
        const [banksSnap, collectorsSnap, txnsSnap, bankTxnsSnap, expensesSnap] = await Promise.all([
            getDocs(collection(db, 'bank_accounts')),
            getDocs(collection(db, 'cash_collectors')),
            getDocs(collection(db, 'transactions')),
            getDocs(collection(db, 'bank_transactions')),
            getDocs(collection(db, 'expenses'))
        ]);

        const activeBanks = [];
        banksSnap.forEach(doc => {
            const d = doc.data();
            if (d.status !== 'inactive') {
                activeBanks.push({
                    id: doc.id,
                    name: d.name || d.bankName || 'অজ্ঞাত ব্যাংক',
                    accountNo: d.accountNo || '',
                    branch: d.branch || '',
                    openingBalance: Number(d.openingBalance || 0),
                    effectiveStartDate: d.effectiveStartDate || null
                });
            }
        });

        // Add Showroom Cash
        let showroomCashOpening = 0;
        let showroomStartDate = null;
        collectorsSnap.forEach(doc => {
            const d = doc.data();
            if (d.name === 'শোরুম ক্যাশ') {
                showroomCashOpening = Number(d.openingBalance || 0);
                showroomStartDate = d.effectiveStartDate || null;
            }
        });

        // 2. Aggregate Customer Collections per Bank / Collector
        const customerCollectionsMap = new Map();
        txnsSnap.forEach(doc => {
            const t = doc.data();
            if (String(t.receivedType || '').trim() === 'Less') return; // Exclude Less/Discount
            const paid = Number(t.paid || 0);
            if (isNaN(paid) || paid <= 0) return;

            const receivedFrom = String(t.receivedFrom || '').trim();
            const receivedType = String(t.receivedType || '').trim();
            const date = t.date || '';

            // Attribute to bank or collector
            let targetAccount = receivedFrom;
            if (!targetAccount && receivedType === 'Cash') {
                targetAccount = 'শোরুম ক্যাশ';
            }

            if (targetAccount) {
                const current = customerCollectionsMap.get(targetAccount) || [];
                current.push({ paid, date });
                customerCollectionsMap.set(targetAccount, current);
            }
        });

        // 3. Aggregate Bank Transactions (Deposits, Withdrawals, Transfers)
        const bankTxnsMap = new Map();
        const incomingTransfersMap = new Map();
        bankTxnsSnap.forEach(doc => {
            const bt = doc.data();
            const amt = Number(bt.amount || 0);
            if (isNaN(amt) || amt <= 0) return;

            const bName = String(bt.bankName || '').trim();
            const rawType = String(bt.type || '').toUpperCase();
            const date = bt.date || '';

            if (bName) {
                const list = bankTxnsMap.get(bName) || [];
                list.push({ type: rawType, amount: amt, date });
                bankTxnsMap.set(bName, list);
            }

            if (rawType === 'TRANSFER') {
                const targetBank = String(bt.targetBankName || '').trim();
                if (targetBank) {
                    const incList = incomingTransfersMap.get(targetBank) || [];
                    incList.push({ amount: amt, date });
                    incomingTransfersMap.set(targetBank, incList);
                }
            }
        });

        // 4. Aggregate Expenses disbursed from accounts (Excluded for শোরুম ক্যাশ)
        const accountExpensesMap = new Map();
        expensesSnap.forEach(doc => {
            const exp = doc.data();
            const amt = Number(exp.amount || 0);
            if (isNaN(amt) || amt <= 0) return;
            const payAccount = String(exp.paymentAccount || '').trim();
            const date = exp.date || '';

            if (payAccount && payAccount !== 'শোরুম ক্যাশ') {
                const list = accountExpensesMap.get(payAccount) || [];
                list.push({ amount: amt, date });
                accountExpensesMap.set(payAccount, list);
            }
        });

        // 5. Calculate Running Balance for Each Bank
        let totalBankBalance = 0;
        const bankAccountsReport = activeBanks.map(b => {
            const collections = customerCollectionsMap.get(b.name) || [];
            const bTxns = bankTxnsMap.get(b.name) || [];
            const incoming = incomingTransfersMap.get(b.name) || [];
            const expenses = accountExpensesMap.get(b.name) || [];

            // Sum collections after effectiveStartDate
            let custTotal = 0;
            collections.forEach(c => {
                if (b.effectiveStartDate && c.date < b.effectiveStartDate) return;
                custTotal = safeRound(custTotal + c.paid);
            });

            // Sum manual deposits, withdrawals, outgoing transfers
            let manualDep = 0;
            let manualWith = 0;
            let outgoingTrans = 0;
            bTxns.forEach(tx => {
                if (b.effectiveStartDate && tx.date < b.effectiveStartDate) return;
                if (tx.type === 'DEPOSIT') manualDep = safeRound(manualDep + tx.amount);
                else if (tx.type === 'WITHDRAWAL' || tx.type === 'WITHDRAW') manualWith = safeRound(manualWith + tx.amount);
                else if (tx.type === 'TRANSFER') outgoingTrans = safeRound(outgoingTrans + tx.amount);
            });

            // Sum incoming transfers
            let incTotal = 0;
            incoming.forEach(tx => {
                if (b.effectiveStartDate && tx.date < b.effectiveStartDate) return;
                incTotal = safeRound(incTotal + tx.amount);
            });

            // Sum expenses
            let expTotal = 0;
            expenses.forEach(tx => {
                if (b.effectiveStartDate && tx.date < b.effectiveStartDate) return;
                expTotal = safeRound(expTotal + tx.amount);
            });

            const currentBalance = safeRound(b.openingBalance + custTotal + manualDep + incTotal - manualWith - outgoingTrans - expTotal);
            totalBankBalance = safeRound(totalBankBalance + currentBalance);

            return {
                id: b.id,
                bankName: b.name,
                accountNo: b.accountNo,
                branch: b.branch,
                openingBalance: b.openingBalance,
                customerCollections: custTotal,
                manualDeposits: manualDep,
                incomingTransfers: incTotal,
                manualWithdrawals: manualWith,
                outgoingTransfers: outgoingTrans,
                expenses: expTotal,
                currentBalance
            };
        });

        // 6. Calculate Showroom Cash Running Balance
        const showroomCollections = customerCollectionsMap.get('শোরুম ক্যাশ') || [];
        let showroomCustTotal = 0;
        showroomCollections.forEach(c => {
            if (showroomStartDate && c.date < showroomStartDate) return;
            showroomCustTotal = safeRound(showroomCustTotal + c.paid);
        });

        const showroomBTxns = bankTxnsMap.get('শোরুম ক্যাশ') || [];
        let showroomWith = 0;
        let showroomDep = 0;
        showroomBTxns.forEach(tx => {
            if (showroomStartDate && tx.date < showroomStartDate) return;
            if (tx.type === 'DEPOSIT') showroomDep = safeRound(showroomDep + tx.amount);
            else if (tx.type === 'WITHDRAWAL' || tx.type === 'WITHDRAW') showroomWith = safeRound(showroomWith + tx.amount);
        });

        const totalCashInHand = safeRound(showroomCashOpening + showroomCustTotal + showroomDep - showroomWith);
        const grandTotalLiquidFunds = safeRound(totalBankBalance + totalCashInHand);

        return {
            success: true,
            type: 'bank_running_balances',
            banksCount: bankAccountsReport.length,
            banks: bankAccountsReport,
            totalBankBalance,
            showroomCashInHand: totalCashInHand,
            grandTotalLiquidFunds
        };
    } catch (err) {
        console.error('[ERPBankingReader] Error:', err);
        return { success: false, error: err.message };
    }
}

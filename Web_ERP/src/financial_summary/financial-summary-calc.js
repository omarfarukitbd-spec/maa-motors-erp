import { TransactionDAO, ExpenseDAO, BankDAO, CashCollectorDAO, CustomerDAO, BankTransactionDAO } from '../dao.js';
import { getCustomerCache, initCustomerCache } from '../customer/index.js';
import { safeRound, toDBDate, getTodayLocalDateString, formatAppDate } from '../utils.js';
import { calculateAccountBalance } from '../banking/banking-calc.js';

/**
 * Fetch and aggregate financial data across Sales, Collections, Expenses, and Banking
 * for any given date range (Day, Week, Month, Year, Custom Range).
 */
export async function fetchFinancialSummaryData(startDate, endDate) {
    try {
        // Ensure customer cache is populated
        let customerCache = getCustomerCache();
        if (!customerCache || customerCache.length === 0) {
            try {
                await initCustomerCache();
                customerCache = getCustomerCache() || [];
            } catch (e) {
                console.warn('Customer cache init warning:', e);
                customerCache = [];
            }
        }

        const custMap = new Map();
        let totalMarketDue = 0, dueCustomerCount = 0;
        if (Array.isArray(customerCache)) {
            customerCache.forEach(c => {
                custMap.set(c.id, c);
                const d = Number(c.totalDue) || 0;
                if (d > 0) { totalMarketDue = safeRound(totalMarketDue + d); dueCustomerCount++; }
            });
        }

        // 1. Fetch Transactions in range
        let txnSnap;
        if (startDate === endDate) {
            txnSnap = await TransactionDAO.collection.where('date', '==', startDate).get();
        } else {
            txnSnap = await TransactionDAO.collection.where('date', '>=', startDate).where('date', '<=', endDate).get();
        }

        const rawTxns = [];
        if (txnSnap && !txnSnap.empty) {
            txnSnap.forEach(doc => rawTxns.push({ id: doc.id, ...doc.data() }));
        }

        // 2. Fetch Expenses in range
        let expSnap;
        if (startDate === endDate) {
            expSnap = await ExpenseDAO.collection.where('date', '==', startDate).get();
        } else {
            expSnap = await ExpenseDAO.collection.where('date', '>=', startDate).where('date', '<=', endDate).get();
        }

        const rawExpenses = [];
        if (expSnap && !expSnap.empty) {
            expSnap.forEach(doc => rawExpenses.push({ id: doc.id, ...doc.data() }));
        }

        // 3. Fetch Banking Ledger Manual Transactions in range
        let bankTxnSnap;
        try {
            if (startDate === endDate) {
                bankTxnSnap = await BankTransactionDAO.collection.where('date', '==', startDate).get();
            } else {
                bankTxnSnap = await BankTransactionDAO.collection.where('date', '>=', startDate).where('date', '<=', endDate).get();
            }
        } catch (e) {
            console.warn('BankTransactionDAO query fallback:', e);
        }

        const rawBankTxns = [];
        if (bankTxnSnap && !bankTxnSnap.empty) {
            bankTxnSnap.forEach(doc => rawBankTxns.push({ id: doc.id, ...doc.data() }));
        }

        const dateDescSort = (a, b) => {
            if (a.date !== b.date) return (b.date || '').localeCompare(a.date || '');
            return (b.createdAt?.toMillis?.() || 0) - (a.createdAt?.toMillis?.() || 0);
        };
        rawTxns.sort(dateDescSort);
        rawExpenses.sort(dateDescSort);
        rawBankTxns.sort(dateDescSort);

        let totalSales = 0, salesCount = 0, totalCollection = 0, cashCollection = 0, bankCollection = 0, lessDiscount = 0;
        const methodBreakdown = {}, zoneBreakdown = {}, customerCollections = [], dayMap = new Map();

        // Process Transactions
        rawTxns.forEach(t => {
            const bill = Number(t.bill) || 0;
            const paid = Number(t.paid) || 0;
            const d = t.date || startDate;
            const cust = custMap.get(t.customerId) || {};

            if (!dayMap.has(d)) {
                dayMap.set(d, {
                    date: d,
                    sales: 0,
                    cashPaid: 0,
                    bankPaid: 0,
                    lessDiscount: 0,
                    totalPaid: 0,
                    expenses: 0,
                    customerIds: new Set(),
                    txns: []
                });
            }
            const dayObj = dayMap.get(d);

            if (bill > 0) {
                totalSales = safeRound(totalSales + bill);
                salesCount++;
                dayObj.sales = safeRound(dayObj.sales + bill);
            }

            if (paid > 0) {
                const method = t.receivedType || 'Bank';
                let actualMethod = (method === 'Cash') ? 'Cash' : (method === 'Less' ? 'Less' : (t.receivedFrom || 'Bank'));

                if (method === 'Cash') {
                    cashCollection = safeRound(cashCollection + paid);
                    dayObj.cashPaid = safeRound(dayObj.cashPaid + paid);
                } else if (method === 'Less') {
                    lessDiscount = safeRound(lessDiscount + paid);
                    dayObj.lessDiscount = safeRound(dayObj.lessDiscount + paid);
                } else {
                    bankCollection = safeRound(bankCollection + paid);
                    dayObj.bankPaid = safeRound(dayObj.bankPaid + paid);
                }

                if (method !== 'Less') {
                    totalCollection = safeRound(totalCollection + paid);
                    dayObj.totalPaid = safeRound(dayObj.totalPaid + paid);
                    dayObj.customerIds.add(t.customerId || t.id);

                    if (!methodBreakdown[actualMethod]) {
                        methodBreakdown[actualMethod] = { name: actualMethod, amount: 0, count: 0 };
                    }
                    methodBreakdown[actualMethod].amount = safeRound(methodBreakdown[actualMethod].amount + paid);
                    methodBreakdown[actualMethod].count++;

                    // Zone Breakdown
                    const zoneName = cust.zone || 'অন্যান্য';
                    if (!zoneBreakdown[zoneName]) {
                        zoneBreakdown[zoneName] = { name: zoneName, amount: 0, count: 0 };
                    }
                    zoneBreakdown[zoneName].amount = safeRound(zoneBreakdown[zoneName].amount + paid);
                    zoneBreakdown[zoneName].count++;
                }

                // Enriched Customer Collection Record
                customerCollections.push({
                    id: t.id,
                    customerId: t.customerId,
                    customerName: cust.name || t.customerName || 'অজানা কাস্টমার',
                    customerPhone: cust.phone || '-',
                    customerZone: cust.zone || '-',
                    customerAccountNo: cust.accountNo || '-',
                    currentDue: Number(cust.totalDue) || Number(t.currentDue) || 0,
                    voucherNo: t.voucherNo || '-',
                    receivedType: t.receivedType || 'Cash',
                    receivedFrom: t.receivedFrom || (t.receivedType === 'Cash' ? 'ক্যাশ' : 'ব্যাংক'),
                    amount: paid,
                    date: t.date,
                    createdAt: t.createdAt
                });

                dayObj.txns.push(t);
            }
        });

        // Process Expenses
        let totalExpenses = 0;
        const expenseCategoryBreakdown = {};

        rawExpenses.forEach(exp => {
            const amt = Number(exp.amount) || 0;
            totalExpenses = safeRound(totalExpenses + amt);
            const d = exp.date || startDate;

            if (!dayMap.has(d)) {
                dayMap.set(d, {
                    date: d,
                    sales: 0,
                    cashPaid: 0,
                    bankPaid: 0,
                    lessDiscount: 0,
                    totalPaid: 0,
                    expenses: 0,
                    customerIds: new Set(),
                    txns: []
                });
            }
            const dayObj = dayMap.get(d);
            dayObj.expenses = safeRound(dayObj.expenses + amt);

            const cat = exp.category || 'অন্যান্য';
            if (!expenseCategoryBreakdown[cat]) expenseCategoryBreakdown[cat] = 0;
            expenseCategoryBreakdown[cat] = safeRound(expenseCategoryBreakdown[cat] + amt);
        });

        // Safe Isolated Bank Balances Fetching (Cannot crash entire financial report)
        const bankBalances = [];
        let totalLiquidFund = 0;

        try {
            const [banks, cash] = await Promise.all([BankDAO.getAllBanks(), CashCollectorDAO.getAllCollectors()]);
            const allAccs = [...(banks || []).map(b => ({ ...b, isCash: false })), ...(cash || []).map(c => ({ ...c, isCash: true }))];
            for (const acc of allAccs) {
                if (acc.status === 'inactive') continue;
                try {
                    const bal = await calculateAccountBalance(acc.name, acc.isCash);
                    bankBalances.push({ name: acc.name, balance: bal, isCash: !!acc.isCash });
                    totalLiquidFund = safeRound(totalLiquidFund + bal);
                } catch (e) { console.warn('Account balance calc warning:', acc.name, e); }
            }
        } catch (bankErr) { console.warn('Liquid balances warning:', bankErr); }

        // Process Banking Transactions
        let manualBankDepositTotal = 0;
        let manualBankWithdrawTotal = 0;
        const bankingTransactions = rawBankTxns.map(bt => {
            const amt = Number(bt.amount) || 0;
            const rawType = String(bt.type || 'DEPOSIT').toUpperCase();
            const isDeposit = rawType === 'DEPOSIT';
            const isWithdraw = rawType === 'WITHDRAW' || rawType === 'WITHDRAWAL';
            if (isDeposit) manualBankDepositTotal = safeRound(manualBankDepositTotal + amt);
            if (isWithdraw) manualBankWithdrawTotal = safeRound(manualBankWithdrawTotal + amt);
            return {
                id: bt.id,
                date: bt.date,
                bankName: bt.bankName || '-',
                type: isDeposit ? 'deposit' : (isWithdraw ? 'withdrawal' : 'transfer'),
                targetBankName: bt.targetBankName || '',
                amount: amt,
                voucherNo: bt.voucherNo || bt.chequeNo || '-',
                notes: bt.note || bt.notes || bt.description || ''
            };
        });

        // Convert DayMap to sorted array (Date Descending)
        const dayByDaySummary = Array.from(dayMap.values()).map(d => ({
            ...d,
            customerCount: d.customerIds.size,
            netCash: safeRound(d.totalPaid - d.expenses)
        })).sort((a, b) => b.date.localeCompare(a.date));

        const netCashFlow = safeRound(totalCollection - totalExpenses);

        return {
            startDate,
            endDate,
            totalSales,
            salesCount,
            totalCollection,
            cashCollection,
            bankCollection,
            lessDiscount,
            totalExpenses,
            netCashFlow,
            totalMarketDue,
            dueCustomerCount,
            methodBreakdown,
            zoneBreakdown,
            expenseCategoryBreakdown,
            bankBalances,
            totalLiquidFund,
            bankingTransactions,
            manualBankDepositTotal,
            manualBankWithdrawTotal,
            dayByDaySummary,
            customerCollections,
            rawExpenses
        };
    } catch (err) {
        console.error('Error calculating financial summary:', err);
        throw err;
    }
}

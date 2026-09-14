import { db } from '../config.js';
import { collection, getDocs } from 'firebase/firestore';
import { safeRound, getTodayLocalDateString } from './erp_bridge.js';

/**
 * 🏛️ ERP Bank Deep Reader — Single Bank 360° Statement & Top Inflow Rankings
 */

/**
 * Get Specific Bank Statement Summary (Inflows, Outflows & Current Balance)
 * Answers: "ইসলামী ব্যাংকে গত ১ মাসে কত টাকা আসলো আর কত খরচ হলো?" / "ওয়ান ব্যাংকের বর্তমান অবস্থা কি?"
 */
export async function getSpecificBankStatementSummary(bankNameQuery, days = 30) {
    if (!bankNameQuery) return { success: false, message: 'ব্যাংকের নাম উল্লেখ করা হয়নি।' };
    try {
        const d = new Date();
        const endDate = getTodayLocalDateString();
        const startDateObj = new Date(d.getTime() - days * 24 * 60 * 60 * 1000);
        const startDate = startDateObj.toISOString().split('T')[0];

        const [banksSnap, txnsSnap, bankTxnsSnap, expensesSnap] = await Promise.all([
            getDocs(collection(db, 'bank_accounts')),
            getDocs(collection(db, 'transactions')),
            getDocs(collection(db, 'bank_transactions')),
            getDocs(collection(db, 'expenses'))
        ]);

        // Find bank match
        const cleanQ = bankNameQuery.toLowerCase().trim();
        let matchedBank = null;

        banksSnap.forEach(doc => {
            const data = doc.data();
            if (data.status === 'inactive') return;
            const bName = String(data.name || data.bankName || '').trim();
            const bNameLower = bName.toLowerCase();

            if (bNameLower.includes(cleanQ) || 
                cleanQ.includes(bNameLower) ||
                (cleanQ.includes('ইসলামী') && /islami|ibbl/i.test(bNameLower)) ||
                (cleanQ.includes('ওয়ান') && /one/i.test(bNameLower)) ||
                (cleanQ.includes('ডাচ') && /dbbl|dutch/i.test(bNameLower)) ||
                (cleanQ.includes('ইউসিবি') && /ucb/i.test(bNameLower)) ||
                (cleanQ.includes('ব্র্যাক') && /brac/i.test(bNameLower)) ||
                (cleanQ.includes('সিটি') && /city/i.test(bNameLower))) {
                matchedBank = {
                    id: doc.id,
                    name: bName,
                    accountNo: data.accountNo || '',
                    branch: data.branch || '',
                    openingBalance: Number(data.openingBalance || 0),
                    effectiveStartDate: data.effectiveStartDate || null
                };
            }
        });

        if (!matchedBank) {
            return {
                success: false,
                found: false,
                message: `"${bankNameQuery}" নামে কোনো সক্রিয় ব্যাংক অ্যাকাউন্ট খুঁজে পাওয়া যায়নি।`
            };
        }

        const bName = matchedBank.name;
        let customerDepositsPeriod = 0;
        let customerDepositsAllTime = 0;
        let depositTxnCount = 0;

        txnsSnap.forEach(doc => {
            const t = doc.data();
            if (String(t.receivedType || '').trim() === 'Less') return;
            const paid = Number(t.paid || 0);
            if (paid <= 0) return;

            const rFrom = String(t.receivedFrom || '').trim();
            if (rFrom === bName) {
                if (!matchedBank.effectiveStartDate || t.date >= matchedBank.effectiveStartDate) {
                    customerDepositsAllTime = safeRound(customerDepositsAllTime + paid);
                }
                if (t.date >= startDate && t.date <= endDate) {
                    customerDepositsPeriod = safeRound(customerDepositsPeriod + paid);
                    depositTxnCount += 1;
                }
            }
        });

        let manualDepPeriod = 0, manualWithPeriod = 0, transferInPeriod = 0, transferOutPeriod = 0;
        let manualDepAll = 0, manualWithAll = 0, transferInAll = 0, transferOutAll = 0;

        bankTxnsSnap.forEach(doc => {
            const bt = doc.data();
            const amt = Number(bt.amount || 0);
            if (amt <= 0) return;

            const b = String(bt.bankName || '').trim();
            const rawType = String(bt.type || '').toUpperCase();
            const isTarget = String(bt.targetBankName || '').trim() === bName;
            const isSource = b === bName;

            const inScopeAll = !matchedBank.effectiveStartDate || bt.date >= matchedBank.effectiveStartDate;
            const inScopePeriod = bt.date >= startDate && bt.date <= endDate;

            if (isSource) {
                if (rawType === 'DEPOSIT') {
                    if (inScopeAll) manualDepAll = safeRound(manualDepAll + amt);
                    if (inScopePeriod) manualDepPeriod = safeRound(manualDepPeriod + amt);
                } else if (rawType === 'WITHDRAWAL' || rawType === 'WITHDRAW') {
                    if (inScopeAll) manualWithAll = safeRound(manualWithAll + amt);
                    if (inScopePeriod) manualWithPeriod = safeRound(manualWithPeriod + amt);
                } else if (rawType === 'TRANSFER') {
                    if (inScopeAll) transferOutAll = safeRound(transferOutAll + amt);
                    if (inScopePeriod) transferOutPeriod = safeRound(transferOutPeriod + amt);
                }
            }

            if (isTarget && rawType === 'TRANSFER') {
                if (inScopeAll) transferInAll = safeRound(transferInAll + amt);
                if (inScopePeriod) transferInPeriod = safeRound(transferInPeriod + amt);
            }
        });

        let expensesPeriod = 0, expensesAll = 0;
        expensesSnap.forEach(doc => {
            const exp = doc.data();
            const amt = Number(exp.amount || 0);
            if (amt <= 0) return;
            const payAcc = String(exp.paymentAccount || '').trim();
            if (payAcc === bName) {
                if (!matchedBank.effectiveStartDate || exp.date >= matchedBank.effectiveStartDate) {
                    expensesAll = safeRound(expensesAll + amt);
                }
                if (exp.date >= startDate && exp.date <= endDate) {
                    expensesPeriod = safeRound(expensesPeriod + amt);
                }
            }
        });

        const totalInflowsPeriod = safeRound(customerDepositsPeriod + manualDepPeriod + transferInPeriod);
        const totalOutflowsPeriod = safeRound(manualWithPeriod + transferOutPeriod + expensesPeriod);
        const netFlowPeriod = safeRound(totalInflowsPeriod - totalOutflowsPeriod);

        const currentRunningBalance = safeRound(
            matchedBank.openingBalance + customerDepositsAllTime + manualDepAll + transferInAll - manualWithAll - transferOutAll - expensesAll
        );

        return {
            success: true,
            found: true,
            type: 'specific_bank_statement',
            bankName: bName,
            accountNo: matchedBank.accountNo,
            branch: matchedBank.branch,
            days,
            startDate,
            endDate,
            customerDepositsPeriod,
            totalInflowsPeriod,
            totalOutflowsPeriod,
            netFlowPeriod,
            depositTxnCount,
            currentRunningBalance
        };
    } catch (err) {
        console.error('[ERPBankDeepReader] getSpecificBankStatementSummary error:', err);
        return { success: false, error: err.message };
    }
}

/**
 * Get Top Inflow Bank (The bank that received the most deposits in the period)
 * Answers: "সবচেয়ে বেশি টাকা কোন ব্যাংকে জমা হচ্ছে?"
 */
export async function getTopInflowBank(days = 30) {
    try {
        const d = new Date();
        const endDate = getTodayLocalDateString();
        const startDateObj = new Date(d.getTime() - days * 24 * 60 * 60 * 1000);
        const startDate = startDateObj.toISOString().split('T')[0];

        const [banksSnap, txnsSnap] = await Promise.all([
            getDocs(collection(db, 'bank_accounts')),
            getDocs(collection(db, 'transactions'))
        ]);

        const bankTotals = new Map();
        banksSnap.forEach(doc => {
            const data = doc.data();
            if (data.status !== 'inactive' && data.name) {
                bankTotals.set(data.name, { bankName: data.name, totalDeposits: 0, txnCount: 0 });
            }
        });

        txnsSnap.forEach(doc => {
            const t = doc.data();
            const date = t.date || '';
            if (date < startDate || date > endDate) return;
            if (String(t.receivedType || '').trim() === 'Less') return;

            const paid = Number(t.paid || 0);
            if (paid <= 0) return;

            const rFrom = String(t.receivedFrom || '').trim();
            if (bankTotals.has(rFrom)) {
                const item = bankTotals.get(rFrom);
                item.totalDeposits = safeRound(item.totalDeposits + paid);
                item.txnCount += 1;
                bankTotals.set(rFrom, item);
            }
        });

        const list = Array.from(bankTotals.values());
        list.sort((a, b) => b.totalDeposits - a.totalDeposits);

        return {
            success: true,
            type: 'top_inflow_bank',
            days,
            startDate,
            endDate,
            topBank: list[0] || null,
            rankings: list
        };
    } catch (err) {
        console.error('[ERPBankDeepReader] getTopInflowBank error:', err);
        return { success: false, error: err.message };
    }
}

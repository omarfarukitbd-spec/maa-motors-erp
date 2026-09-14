import { db } from '../config.js';
import { collection, getDocs } from 'firebase/firestore';
import { safeRound } from './erp_bridge.js';

/**
 * 🔍 ERP Lookup Reader — Reverse Amount Search & Business Demographics
 */

/**
 * Convert Bengali numerals and strip non-numeric characters to get float
 */
export function parseBanglaOrEnglishNumber(val) {
    if (val === null || val === undefined) return 0;
    const s = String(val).trim();
    const bengaliToAscii = str => str.replace(/[০-৯]/g, d => '০১২৩৪৫৬৭৮৯'.indexOf(d));
    const normalized = bengaliToAscii(s).replace(/,/g, '');
    const numMatch = normalized.match(/[-+]?[0-9]*\.?[0-9]+/);
    if (!numMatch) return 0;
    return parseFloat(numMatch[0]) || 0;
}

/**
 * Reverse Search Customer or Transaction by Exact Amount
 * Answers: "অগ্রিম জমা রয়েছে ৫,৫০০ টাকা এটা কোন একাউন্ট?" / "৫,৫০০ টাকা কার?" / "১০,০০০ টাকার ভাউচার কার?"
 */
export async function searchCustomerOrTxnByAmount(amountInput, hintType = 'any') {
    const targetAmount = safeRound(parseBanglaOrEnglishNumber(amountInput));
    if (targetAmount <= 0) {
        return { found: false, message: 'টাকার পরিমাণ শনাক্ত করা যায়নি।' };
    }

    try {
        const [custSnap, txnsSnap] = await Promise.all([
            getDocs(collection(db, 'customers')),
            getDocs(collection(db, 'transactions'))
        ]);

        const advanceMatches = [];
        const dueMatches = [];

        custSnap.forEach(doc => {
            const c = doc.data();
            const due = safeRound(Number(c.totalDue || 0));
            const cMeta = {
                id: doc.id,
                name: c.name || 'নামহীন',
                phone: c.phone || 'মোবাইল নেই',
                address: c.address || '',
                zone: c.zone || '',
                accountNo: c.accountNo || '',
                totalDue: due,
                initialDue: safeRound(c.initialDue || 0)
            };

            // Advance matches (totalDue is negative, Math.abs(due) == targetAmount)
            if (due < 0 && Math.abs(Math.abs(due) - targetAmount) <= 2) {
                advanceMatches.push({ ...cMeta, advanceAmount: Math.abs(due) });
            }

            // Due matches (totalDue is positive, due == targetAmount)
            if (due > 0 && Math.abs(due - targetAmount) <= 2) {
                dueMatches.push(cMeta);
            }
        });

        // 1. If searching advance or hint is advance
        if ((hintType === 'advance' || hintType === 'any') && advanceMatches.length > 0) {
            return {
                found: true,
                type: 'amount_lookup_result',
                matchCategory: 'advance',
                searchedAmount: targetAmount,
                primaryMatch: advanceMatches[0],
                totalMatchesCount: advanceMatches.length,
                allMatches: advanceMatches
            };
        }

        // 2. If searching due or hint is due
        if ((hintType === 'due' || hintType === 'any') && dueMatches.length > 0) {
            return {
                found: true,
                type: 'amount_lookup_result',
                matchCategory: 'due',
                searchedAmount: targetAmount,
                primaryMatch: dueMatches[0],
                totalMatchesCount: dueMatches.length,
                allMatches: dueMatches
            };
        }

        // 3. If not found in customer balances, check recent transactions
        const txnMatches = [];
        txnsSnap.forEach(doc => {
            const t = doc.data();
            const v = String(t.voucherNo || '').trim().toUpperCase();
            if (v === 'OPENING' || v === 'OPEN' || v === 'প্রারম্ভিক ব্যালেন্স' || v === 'প্রারম্ভিক জের') return;

            const paid = safeRound(Number(t.paid || 0));
            const bill = safeRound(Number(t.bill || 0));

            if (paid > 0 && Math.abs(paid - targetAmount) <= 2) {
                txnMatches.push({
                    id: doc.id,
                    customerName: t.customerName || 'অজানা কাস্টমার',
                    voucherNo: t.voucherNo || '',
                    date: t.date || '',
                    amount: paid,
                    isPayment: true,
                    receivedType: t.receivedType || 'ক্যাশ'
                });
            } else if (bill > 0 && Math.abs(bill - targetAmount) <= 2) {
                txnMatches.push({
                    id: doc.id,
                    customerName: t.customerName || 'অজানা কাস্টমার',
                    voucherNo: t.voucherNo || '',
                    date: t.date || '',
                    amount: bill,
                    isPayment: false,
                    notes: t.notes || ''
                });
            }
        });

        if (txnMatches.length > 0) {
            return {
                found: true,
                type: 'amount_lookup_result',
                matchCategory: 'transaction',
                searchedAmount: targetAmount,
                primaryMatch: txnMatches[0],
                totalMatchesCount: txnMatches.length,
                allMatches: txnMatches
            };
        }

        return {
            found: false,
            searchedAmount: targetAmount,
            message: `মা মোটরসের ডেটাবেজে ৳ ${targetAmount.toLocaleString('bn-BD')} টাকার কোনো অগ্রিম জমা, অবশিষ্ট বকেয়া বা ভাউচার পাওয়া যায়নি।`
        };
    } catch (err) {
        console.error('[ERPLookupReader] searchCustomerOrTxnByAmount error:', err);
        return { found: false, error: err.message };
    }
}

/**
 * Get Comprehensive App & Business Demographics
 * Answers: "আমাদের মোট কাস্টমার কতজন?" / "মোট কতজন দেনাদার আছে?" / "কাদের কোনো বকেয়া নেই?"
 */
export async function getGeneralBusinessDemographics() {
    try {
        const [custSnap, banksSnap] = await Promise.all([
            getDocs(collection(db, 'customers')),
            getDocs(collection(db, 'bank_accounts'))
        ]);

        let totalCustomers = 0;
        let debtorCount = 0;
        let advanceCount = 0;
        let zeroDueCount = 0;
        let totalMarketDue = 0;
        let totalAdvanceSum = 0;

        custSnap.forEach(doc => {
            totalCustomers += 1;
            const c = doc.data();
            const due = safeRound(Number(c.totalDue || 0));

            if (due > 0) {
                debtorCount += 1;
                totalMarketDue = safeRound(totalMarketDue + due);
            } else if (due < 0) {
                advanceCount += 1;
                totalAdvanceSum = safeRound(totalAdvanceSum + Math.abs(due));
            } else {
                zeroDueCount += 1;
            }
        });

        const activeBanks = [];
        banksSnap.forEach(doc => {
            const b = doc.data();
            if (b.status !== 'inactive' && b.name) {
                activeBanks.push({
                    name: b.name,
                    accountNo: b.accountNo || '',
                    branch: b.branch || ''
                });
            }
        });

        return {
            success: true,
            type: 'business_demographics',
            totalCustomers,
            debtorCount,
            advanceCount,
            zeroDueCount,
            totalMarketDue,
            totalAdvanceSum,
            netMarketDue: safeRound(totalMarketDue - totalAdvanceSum),
            activeBanksCount: activeBanks.length,
            activeBanks
        };
    } catch (err) {
        console.error('[ERPLookupReader] getGeneralBusinessDemographics error:', err);
        return { success: false, error: err.message };
    }
}

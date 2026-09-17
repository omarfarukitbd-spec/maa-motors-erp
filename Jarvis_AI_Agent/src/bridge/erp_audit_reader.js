import { db } from '../config.js';
import { collection, getDocs, limit, query, orderBy } from 'firebase/firestore';
import { safeRound } from './erp_bridge.js';

/**
 * 🔍 ERP Audit Reader — Financial Math & Ledger Integrity Inspector
 */

export async function getLedgerMathAuditSummary(sampleSize = 100) {
    try {
        let txnsSnap;
        try {
            txnsSnap = await getDocs(query(collection(db, 'transactions'), orderBy('date', 'desc'), limit(sampleSize)));
        } catch (qErr) {
            console.warn('[ERPAuditReader] Query with orderBy date failed, falling back to simple limit:', qErr);
            txnsSnap = await getDocs(query(collection(db, 'transactions'), limit(sampleSize)));
        }

        let auditedTxnCount = 0;
        let corruptTxnCount = 0;
        const corruptTransactions = [];

        // 1. Audit Invariant 1: currentDue === safeRound(prevDue + bill - paid)
        txnsSnap.forEach(doc => {
            const t = doc.data();
            auditedTxnCount += 1;

            const prevDue = Number(t.prevDue || 0);
            const bill = Number(t.bill || 0);
            const paid = Number(t.paid || 0);
            const currentDue = Number(t.currentDue || 0);

            const expectedCurrentDue = safeRound(prevDue + bill - paid);
            // Allow precision margin of 0.05 for floating point rounding in legacy records
            if (Math.abs(expectedCurrentDue - currentDue) > 0.05) {
                corruptTxnCount += 1;
                if (corruptTransactions.length < 5) {
                    corruptTransactions.push({
                        id: doc.id,
                        customerName: t.customerName || 'অজ্ঞাত',
                        date: t.date || '',
                        voucherNo: t.voucherNo || '',
                        expected: expectedCurrentDue,
                        actual: currentDue,
                        diff: safeRound(expectedCurrentDue - currentDue)
                    });
                }
            }
        });

        const isFullySound = corruptTxnCount === 0;

        return {
            success: true,
            type: 'ledger_audit_summary',
            isFullySound,
            auditedTxnCount,
            corruptTxnCount,
            corruptSamples: corruptTransactions,
            statusMessage: isFullySound 
                ? `মা মোটরসের সাম্প্রতিক ${auditedTxnCount}টি লেনদেন যাচাই করা হয়েছে। কোনো গাণিতিক ভুল বা ব্যালেন্স অসঙ্গতি পাওয়া যায়নি। হিসাব ১০০% নির্ভুল রয়েছে।`
                : `সতর্কতা! ${auditedTxnCount}টি লেনদেনের মধ্যে ${corruptTxnCount}টিতে গাণিতিক গরমিল শনাক্ত হয়েছে।`
        };
    } catch (err) {
        console.error('[ERPAuditReader] Error:', err);
        return { success: false, error: err.message };
    }
}

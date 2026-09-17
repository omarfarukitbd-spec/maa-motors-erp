import { BaseSkill } from './base_skill.js';
import { ERPBridge } from '../bridge/erp_bridge.js';

/**
 * ⚖️ Dispute Resolution & Ledger Audit Skill
 * Handles: "তুমি ভুল হিসাব দিয়েছ", "হিসাব ঠিক নাই", "ভুল কেন", "লেজার অডিট করো"
 */
export class DisputeAuditSkill extends BaseSkill {
    constructor() {
        super({
            id: 'skill_dispute_audit',
            name: 'লেজার অডিট ও ভুল সংশোধন (Dispute Resolution)',
            description: 'হিসাবে কোনো গরমিল বা ভুল অভিযোগ এলে লেজার লেনদেন পুঙ্খানুপুঙ্খ অডিট করে এবং নির্দিষ্ট কাস্টমার বা ভাউচারের সত্যতা যাচাই করে।',
            triggers: [
                'ভুল হিসাব', 'ভুল দিয়েছ', 'ভুল দিয়েছো', 'হিসাব ঠিক নাই', 'ভুল কেন',
                'লেজার অডিট', 'হিসাব ভুল', 'অডিট করো', 'গরমিল', 'ভুল উত্তর'
            ]
        });
    }

    getTools() {
        return [
            {
                name: 'get_ledger_math_audit_summary',
                description: 'মা মোটরসের লেজার লেনদেনের গাণিতিক নির্ভুলতা ও কোনো গরমিল আছে কিনা তা অডিট করতে এটি কল করো।',
                parameters: {
                    type: 'object',
                    properties: {
                        sampleSize: {
                            type: 'number',
                            description: 'কতটি লেনদেন অডিট করবে (ডিফল্ট ১০০)'
                        }
                    }
                }
            }
        ];
    }

    async execute(actionName, params = {}) {
        const audit = await ERPBridge.getLedgerMathAuditSummary(params.sampleSize || 100);
        if (!audit || !audit.success) {
            return {
                success: false,
                spokenResponse: 'স্যার, আমি আন্তরিকভাবে দুঃখিত। আপনি কোন কাস্টমার বা চালানের হিসাবটির কথা বলছেন তা জানালে আমি এখনই লেজার খাতা মিলিয়ে দিচ্ছি।'
            };
        }

        let spokenResponse = '';
        if (audit.isFullySound) {
            spokenResponse = `স্যার, আমি অত্যন্ত দুঃখিত যদি কোনো বিভ্রান্তি হয়ে থাকে। আমাদের ডাটাবেসের সাম্প্রতিক ${audit.auditedTxnCount}টি লেনদেন যাচাই করেছি এবং কোনো গাণিতিক অমিল পাওয়া যায়নি। আপনি নির্দিষ্ট কোন কাস্টমার বা ভাউচারের হিসাব দেখতে চাচ্ছেন জানালে আমি বিস্তারিত মিলিয়ে দিচ্ছি।`;
        } else {
            spokenResponse = `সতর্কতা স্যার! ${audit.auditedTxnCount}টি লেনদেনের মধ্যে ${audit.corruptTxnCount}টি এন্ট্রিতে গাণিতিক অমিল শনাক্ত হয়েছে। বিস্তারিত অডিট কার্ডে তুলে ধরা হলো।`;
        }

        return {
            success: true,
            spokenResponse,
            displayData: {
                type: 'ledger_audit_summary',
                ...audit
            }
        };
    }
}

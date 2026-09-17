import { BaseSkill } from './base_skill.js';
import { ERPBridge, formatAmountWithComma, numberToSpokenBangla } from '../bridge/erp_bridge.js';

/**
 * 🎯 Debt Recovery & Credit Control Skill
 * Handles: "কার কাছে বেশি বাকি", "টপ দেনাদার কে কে", "অলস বাকিদার কারা", "কালেকশন রিকভারি রেট কেমন"
 */
export class DebtRecoverySkill extends BaseSkill {
    constructor() {
        super({
            id: 'skill_debt_recovery',
            name: 'বকেয়া ও ঋণ আদায় নিয়ন্ত্রণ (Debt Recovery)',
            description: 'মার্কেটের শীর্ষ বাকিদার, দীর্ঘদিন টাকা না দেওয়া অলস গ্রাহক (Dormant Debtors) এবং বিক্রির বিপরীতে টাকা আদায়ের রিকভারি রেট বিশ্লেষণ করে।',
            triggers: [
                'বাকিদার', 'দেনাদার', 'টপ দেনাদার', 'বকেয়া কার বেশি', 'বেশি বাকি',
                'অলস বাকিদার', 'টাকা দেয় না', 'বাকি আদায়', 'রিকভারি রেট', 'আদায় দক্ষতা'
            ]
        });
    }

    getTools() {
        return [
            {
                name: 'get_top_debtors',
                description: 'মা মোটরসের সবচেয়ে বেশি বকেয়া থাকা শীর্ষ গ্রাহকদের তালিকা জানতে এটি কল করো।',
                parameters: {
                    type: 'object',
                    properties: {
                        limit: {
                            type: 'number',
                            description: 'কত জন গ্রাহকের তালিকা (ডিফল্ট ৫)'
                        },
                        zone: {
                            type: 'string',
                            description: 'নির্দিষ্ট কোনো জোনের নাম (ঐচ্ছিক)'
                        }
                    }
                }
            },
            {
                name: 'get_dormant_customers',
                description: 'যাদের বড় অঙ্কের বকেয়া আছে কিন্তু গত ৩০ বা ৬০ দিন ধরে কোনো লেনদেন বা টাকা জমা দেয়নি তাদের তালিকা জানতে এটি কল করো।',
                parameters: {
                    type: 'object',
                    properties: {
                        daysThreshold: {
                            type: 'number',
                            description: 'কত দিন নিষ্ক্রিয় (ডিফল্ট ৩০)'
                        }
                    }
                }
            },
            {
                name: 'get_collection_recovery_efficiency',
                description: 'গত ৩০ দিনে মোট বিক্রির তুলনায় কত শতাংশ টাকা আদায় বা কালেকশন হয়েছে তা জানতে এটি কল করো।',
                parameters: {
                    type: 'object',
                    properties: {
                        days: {
                            type: 'number',
                            description: 'কত দিনের হিসাব (ডিফল্ট ৩০)'
                        }
                    }
                }
            }
        ];
    }

    async execute(actionName, params = {}) {
        if (actionName === 'get_dormant_customers') {
            const data = await ERPBridge.getDormantCustomers(params.daysThreshold || 30);
            if (!data || !data.success) return { success: false, spokenResponse: 'অলস বাকিদারদের তালিকা পাওয়া যায়নি।' };
            const count = data.dormantCustomers?.length || 0;
            const topDormant = data.dormantCustomers?.[0]?.name || 'গ্রাহক';
            return {
                success: true,
                spokenResponse: `জি স্যার! গত ${params.daysThreshold || 30} দিনে কোনো পেমেন্ট দেয়নি এমন ${count} জন অলস বাকিদার শনাক্ত হয়েছে। শীর্ষে আছেন ${topDormant}।`,
                displayData: { type: 'dormant_customers', ...data }
            };
        }

        if (actionName === 'get_collection_recovery_efficiency') {
            const data = await ERPBridge.getCollectionRecoveryEfficiency(params.days || 30);
            if (!data || !data.success) return { success: false, spokenResponse: 'কালেকশন রিকভারি রেট লোড করা যায়নি।' };
            return {
                success: true,
                spokenResponse: `জি স্যার! গত ${data.days} দিনে আমাদের কালেকশন রিকভারি রেট হলো ${data.recoveryRate}% (মোট বিক্রি ৳ ${formatAmountWithComma(data.totalBilled)}, মোট আদায় ৳ ${formatAmountWithComma(data.totalCollected)})।`,
                displayData: { type: 'recovery_efficiency', ...data }
            };
        }

        const data = await ERPBridge.getTopDebtors(params.limit || 5, params.zone || null);
        if (!data || !data.topDebtors) return { success: false, spokenResponse: 'বাকিদারদের তালিকা পাওয়া যায়নি।' };
        const topOne = data.topDebtors[0];
        const topName = topOne?.name || 'গ্রাহক';
        const topDue = formatAmountWithComma(topOne?.totalDue || 0);
        return {
            success: true,
            spokenResponse: `জি স্যার! শীর্ষ বাকিদারদের শীর্ষে আছেন ${topName}, যার বর্তমান বকেয়া ৳ ${topDue}।`,
            displayData: { type: 'top_debtors', ...data }
        };
    }
}

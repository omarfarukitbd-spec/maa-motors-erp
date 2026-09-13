import { BaseSkill } from './base_skill.js';
import { ERPBridge, formatAmountWithComma, numberToSpokenBangla } from '../bridge/erp_bridge.js';

export class AnalyticsSkill extends BaseSkill {
    constructor() {
        super({
            id: 'skill_analytics',
            name: 'আর্থিক স্থিতি ও ক্যাশ-ব্যাংক স্কিল',
            description: 'শোরুম ক্যাশ, বিভিন্ন ব্যাংক অ্যাকাউন্টের সমাপনী স্থিতি এবং মোট তরল তহবিল হিসাব করে জানায়।',
            triggers: ['ক্যাশ', 'ব্যাংক', 'স্থিতি', 'আজকের হিসাব', 'মোট স্থিতি', 'লিকুইড ফান্ড', 'ক্যাশ কত', 'ব্যাংকে কত', 'ফান্ড', 'তহবিল']
        });
    }

    getTools() {
        return [
            {
                name: 'get_financial_status',
                description: 'প্রতিষ্ঠানটির সমস্ত ব্যাংকে ও শোরুম ক্যাশে মোট কত টাকা আছে (মোট স্থিতি) তা হিসাব করে উত্তর দেয়।',
                parameters: {
                    type: 'object',
                    properties: {
                        detail_level: {
                            type: 'string',
                            enum: ['summary', 'breakdown'],
                            description: 'সামারি নাকি প্রতিটি ব্যাংকের বিস্তারিত নাম সহ'
                        }
                    }
                }
            }
        ];
    }

    async execute(actionName, params = {}) {
        const snap = await ERPBridge.getFinancialSnapshot();

        if (snap && snap.error === 'AUTH_REQUIRED') {
            return {
                success: false,
                spokenResponse: 'ভাইয়া, ব্যাংক ও ক্যাশ স্থিতি দেখতে উপরের "গুগল লগইন" বাটনে ক্লিক করে সাইন ইন করুন।'
            };
        }

        if (!snap) {
            return {
                success: false,
                spokenResponse: 'দুঃখিত ভাইয়া, এই মুহূর্তে ব্যাংক ও ক্যাশ ব্যালেন্সের লাইভ হিসাব লোড করা সম্ভব হয়নি।'
            };
        }

        const liquidWords = numberToSpokenBangla(snap.totalLiquidFund);
        const liquidFormatted = formatAmountWithComma(snap.totalLiquidFund);

        let spoken = `আমাদের সমস্ত ব্যাংক ও ক্যাশ কাউন্টার মিলিয়ে মোট সমাপনী স্থিতি হলো ${liquidWords} (৳ ${liquidFormatted})।`;

        // Highlight prominent accounts
        const topAccounts = (snap.accounts || [])
            .sort((a, b) => b.balance - a.balance)
            .slice(0, 3)
            .map(a => `${a.name}-এ ${formatAmountWithComma(a.balance)} টাকা`)
            .join(', ');

        if (topAccounts) {
            spoken += ` যার মধ্যে প্রধানত: ${topAccounts} রয়েছে।`;
        }

        if (snap.totalMarketDue > 0) {
            spoken += ` এছাড়া মার্কেটে মোট কাস্টমার বকেয়া রয়েছে ৳ ${formatAmountWithComma(snap.totalMarketDue)}।`;
        }

        return {
            success: true,
            spokenResponse: spoken,
            displayData: snap
        };
    }
}

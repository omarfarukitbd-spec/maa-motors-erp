import { BaseSkill } from './base_skill.js';
import { ERPBridge, formatAmountWithComma, numberToSpokenBangla } from '../bridge/erp_bridge.js';

/**
 * 🏦 Banking & Liquidity Intelligence Skill
 * Handles: "ব্যাংক ব্যালেন্স কত", "কোন ব্যাংকে কত টাকা", "আজকে ব্যাংকে জমা", "ট্রেজারি ফান্ড"
 */
export class BankingTreasurySkill extends BaseSkill {
    constructor() {
        super({
            id: 'skill_banking_treasury',
            name: 'ব্যাংক হিসাব ও কেন্দ্রীয় ট্রেজারি ফান্ড',
            description: 'প্রতিটি ব্যাংক অ্যাকাউন্টের লাইভ ব্যালেন্স, কাস্টমারদের ব্যাংক জমা এবং প্রতিষ্ঠানের কেন্দ্রীয় ট্রেজারি ফান্ডের হিসাব বের করে।',
            triggers: [
                'ব্যাংক ব্যালেন্স', 'ব্যাংক অ্যাকাউন্ট', 'ব্যাংকে জমা', 'ইসলামী ব্যাংক', 'ওয়ান ব্যাংক',
                'ট্রেজারি', 'রিজার্ভ ফান্ড', 'ব্যাংক স্টেটমেন্ট', 'ব্যাংকের হিসাব'
            ]
        });
    }

    getTools() {
        return [
            {
                name: 'get_all_bank_running_balances',
                description: 'মা মোটরসের প্রতিটি ব্যাংক অ্যাকাউন্টের লাইভ ব্যালেন্স ও মোট ব্যাংক ফান্ড জানতে এটি কল করো।'
            },
            {
                name: 'get_today_bank_collections',
                description: 'আজকে বা নির্দিষ্ট দিনে কোন কোন কাস্টমার কোন ব্যাংকে টাকা জমা দিয়েছে তা জানতে এটি কল করো।'
            },
            {
                name: 'get_master_treasury_status',
                description: 'মা মোটরসের কেন্দ্রীয় মাস্টার ট্রেজারি ফান্ডের ব্যালেন্স ও সাম্প্রতিক লেনদেন জানতে এটি কল করো।'
            }
        ];
    }

    async execute(actionName, params = {}) {
        if (actionName === 'get_today_bank_collections') {
            const data = await ERPBridge.getTodayBankCollections(params.date || null);
            if (!data) return { success: false, spokenResponse: 'ব্যাংক জমার তথ্য পাওয়া যায়নি।' };
            const formatted = formatAmountWithComma(data.totalBankDeposit);
            return {
                success: true,
                spokenResponse: `জি স্যার! আজকে বিভিন্ন ব্যাংকে সর্বমোট ৳ ${formatted} জমা হয়েছে।`,
                displayData: { type: 'today_bank_collections', ...data }
            };
        }

        if (actionName === 'get_master_treasury_status') {
            const data = await ERPBridge.getTreasuryFundStatus();
            if (!data) return { success: false, spokenResponse: 'ট্রেজারি তথ্য পাওয়া যায়নি।' };
            const formatted = formatAmountWithComma(data.currentTreasuryBalance);
            return {
                success: true,
                spokenResponse: `জি স্যার! মা মোটরসের মাস্টার ট্রেজারি ফান্ডের বর্তমান মোট ব্যালেন্স হলো ৳ ${formatted}।`,
                displayData: { type: 'treasury_status', ...data }
            };
        }

        const data = await ERPBridge.getAllBankRunningBalances();
        if (!data || !data.success) return { success: false, spokenResponse: 'ব্যাংক ব্যালেন্স লোড করা যায়নি।' };
        const total = formatAmountWithComma(data.totalBankBalance);
        return {
            success: true,
            spokenResponse: `জি স্যার! আমাদের সকল ব্যাংক মিলিয়ে মোট ব্যাংকিং ব্যালেন্স হলো ৳ ${total}।`,
            displayData: { type: 'all_bank_balances', ...data }
        };
    }
}

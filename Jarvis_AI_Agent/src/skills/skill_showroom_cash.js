import { BaseSkill } from './base_skill.js';
import { ERPBridge, formatAmountWithComma, numberToSpokenBangla } from '../bridge/erp_bridge.js';

/**
 * 💵 Showroom Cash Counter & Cash Collection Skill
 * Handles: "শোরুম ক্যাশ কত", "আজকের ক্যাশ", "নগদ আদায়", "কাউন্টার ক্যাশ"
 */
export class ShowroomCashSkill extends BaseSkill {
    constructor() {
        super({
            id: 'skill_showroom_cash',
            name: 'শোরুম ক্যাশ কাউন্টার ও নগদ আদায়',
            description: 'শোরুম কাউন্টারে আজকের মোট নগদ আদায়, ক্যাশ পেমেন্ট থেকে মোট খরচ বাদ দিয়ে সমাপনী নগদ স্থিতি হিসাব করে।',
            triggers: [
                'শোরুম ক্যাশ', 'ক্যাশ কত', 'আজকের ক্যাশ', 'নগদ আদায়', 'কাউন্টার ক্যাশ',
                'ক্যাশ জমা', 'ক্যাশ কাউন্টার', 'ক্যাশ ব্যালেন্স', 'নগদ ব্যালেন্স'
            ]
        });
    }

    getTools() {
        return [
            {
                name: 'get_today_showroom_cash',
                description: 'মা মোটরসের শোরুম কাউন্টারে আজকের নগদ আদায়, নগদ খরচ ও সমাপনী ক্যাশ ব্যালেন্স জানতে এটি কল করো।',
                parameters: {
                    type: 'object',
                    properties: {
                        date: {
                            type: 'string',
                            description: 'তারিখ YYYY-MM-DD ফরম্যাটে (ঐচ্ছিক, না দিলে আজকের হিসাব দেখাবে)'
                        }
                    }
                }
            }
        ];
    }

    async execute(actionName, params = {}) {
        const cashData = await ERPBridge.getTodayShowroomCashCollections(params.date || null);
        if (!cashData || !cashData.success) {
            return {
                success: false,
                spokenResponse: 'দুঃখিত স্যার, এই মুহূর্তে শোরুম ক্যাশ কাউন্টারের তথ্য লোড করা সম্ভব হয়নি।'
            };
        }

        const totalReceived = formatAmountWithComma(cashData.totalCashReceived);
        const closingCash = formatAmountWithComma(cashData.closingCash);
        const expense = formatAmountWithComma(cashData.expensesPaidFromCash);

        const spokenResponse = `জি স্যার! আজকে শোরুম কাউন্টারে নগদ আদায় হয়েছে ৳ ${totalReceived}। ক্যাশ থেকে খরচ হয়েছে ৳ ${expense} এবং দিন শেষে নগদ ক্যাশ ব্যালেন্স রয়েছে ৳ ${closingCash}।`;

        return {
            success: true,
            spokenResponse,
            displayData: {
                type: 'today_cash_collections',
                ...cashData
            }
        };
    }
}

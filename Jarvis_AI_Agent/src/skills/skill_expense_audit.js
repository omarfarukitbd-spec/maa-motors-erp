import { BaseSkill } from './base_skill.js';
import { ERPBridge, formatAmountWithComma, numberToSpokenBangla } from '../bridge/erp_bridge.js';

/**
 * 💸 Expense Audit & Cost Analysis Skill
 * Handles: "আজকের খরচ কত", "অফিস খরচ কত হয়েছে", "চা নাস্তার বিল", "খরচের খাতসমূহ"
 */
export class ExpenseAuditSkill extends BaseSkill {
    constructor() {
        super({
            id: 'skill_expense_audit',
            name: 'দৈনিক খরচ ও খাতওয়ারী ব্যয় বিশ্লেষণ',
            description: 'প্রতিদিনের অফিস ও শো-রুমের যাবতীয় খরচ, ভাউচার তালিকা এবং নির্দিষ্ট মেয়াদে কোন খাতে কত খরচ হয়েছে তার নিখুঁত ব্রেকডাউন দেয়।',
            triggers: [
                'খরচ', 'আজকের খরচ', 'অফিস খরচ', 'চা নাস্তা', 'খরচের খাত',
                'খরচের বিবরণ', 'মোট খরচ', 'ব্যয়', 'আজকের ব্যয়'
            ]
        });
    }

    getTools() {
        return [
            {
                name: 'get_daily_expenses',
                description: 'মা মোটরসের আজকের বা নির্দিষ্ট দিনের সমস্ত খরচের তালিকা ও মোট টাকার পরিমাণ জানতে এটি কল করো।',
                parameters: {
                    type: 'object',
                    properties: {
                        date: {
                            type: 'string',
                            description: 'তারিখ YYYY-MM-DD ফরম্যাটে (ঐচ্ছিক)'
                        }
                    }
                }
            },
            {
                name: 'get_category_expense_breakdown',
                description: 'গত ৩০ দিনে বা নির্দিষ্ট মেয়াদে কোন খাতে (চা-নাস্তা, বেতন, পরিবহন ইত্যাদি) কত খরচ হয়েছে তার শতাংশ ও বিশ্লেষণ জানতে এটি কল করো।',
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
        if (actionName === 'get_category_expense_breakdown') {
            const data = await ERPBridge.getCategoryExpenseBreakdown(params.days || 30);
            if (!data || !data.success) return { success: false, spokenResponse: 'খরচের খাত বিশ্লেষণ লোড করা যায়নি।' };
            const total = formatAmountWithComma(data.totalExpenseSum);
            const topCategory = data.categories?.[0]?.category || 'অন্যান্য';
            const topCatAmount = formatAmountWithComma(data.categories?.[0]?.totalAmount || 0);
            return {
                success: true,
                spokenResponse: `জি স্যার! গত ${data.days} দিনে মোট খরচ ৳ ${total}। এর মধ্যে সর্বোচ্চ খরচ হয়েছে "${topCategory}" খাতে (৳ ${topCatAmount})।`,
                displayData: { type: 'category_expense_breakdown', ...data }
            };
        }

        const data = await ERPBridge.getDailyExpenses(params.date || null);
        if (!data) return { success: false, spokenResponse: 'আজকের খরচের হিসাব লোড করা যায়নি।' };
        const total = formatAmountWithComma(data.totalExpense);
        return {
            success: true,
            spokenResponse: `জি স্যার! আজকের মোট খরচের পরিমাণ হলো ৳ ${total} (মোট ${data.expenses?.length || 0}টি ভাউচার)।`,
            displayData: { type: 'daily_expenses', ...data }
        };
    }
}

import { BaseSkill } from './base_skill.js';
import { ERPBridge, formatAmountWithComma, numberToSpokenBangla } from '../bridge/erp_bridge.js';

/**
 * 📊 Executive Business Intelligence & Daily Reporting Skill
 * Answers: "রিপোর্ট দাও", "আজকের রিপোর্ট", "ব্যবসার অবস্থা কি", "দৈনিক সারসংক্ষেপ"
 */
export class ExecutiveReportSkill extends BaseSkill {
    constructor() {
        super({
            id: 'skill_executive_report',
            name: 'দৈনিক এক্সিকিউটিভ রিপোর্ট ও ব্যবসায়িক সামারি',
            description: 'প্রতিদিনের মোট বিক্রি, ক্যাশ ও ব্যাংক আদায়, খরচ, নিট ক্যাশ ফ্লো এবং পূর্ণাঙ্গ ব্যবসায়িক রিপোর্ট কার্ড তৈরি করে।',
            triggers: [
                'রিপোর্ট', 'রিপোট', 'আজকের রিপোর্ট', 'ব্যবসার অবস্থা', 'দৈনিক রিপোর্ট',
                'সারসংক্ষেপ', 'সামারি', 'পালস', 'আজকের হিসাব', 'আজকের সামারি', 'আজকের ব্যবসা'
            ]
        });
    }

    getTools() {
        return [
            {
                name: 'get_executive_business_pulse',
                description: 'মা মোটরসের আজকের বা নির্দিষ্ট দিনের পূর্ণাঙ্গ ব্যবসায়িক রিপোর্ট (মোট বিক্রি, ক্যাশ ও ব্যাংক আদায়, মোট খরচ ও নিট ক্যাশ ফ্লো) তৈরি করতে এটি কল করো।',
                parameters: {
                    type: 'object',
                    properties: {
                        date: {
                            type: 'string',
                            description: 'তারিখ YYYY-MM-DD ফরম্যাটে (ঐচ্ছিক, না দিলে আজকের রিপোর্ট দেখাবে)'
                        }
                    }
                }
            }
        ];
    }

    async execute(actionName, params = {}) {
        const pulse = await ERPBridge.getExecutiveBusinessPulse(params.date || null);
        if (!pulse) {
            return {
                success: false,
                spokenResponse: 'দুঃখিত স্যার, এই মুহূর্তে দৈনিক ব্যবসায়িক রিপোর্ট লোড করা সম্ভব হয়নি।'
            };
        }

        const salesFormatted = formatAmountWithComma(pulse.todayTotalBills);
        const collectionFormatted = formatAmountWithComma(pulse.todayTotalCollections);
        const expenseFormatted = formatAmountWithComma(pulse.todayTotalExpenses);
        const netCashFormatted = formatAmountWithComma(pulse.todayNetCashFlow);

        const spokenResponse = `জি স্যার! আজকের মোট বিক্রি ৳ ${salesFormatted}, মোট আদায় ৳ ${collectionFormatted} (ক্যাশ ৳ ${formatAmountWithComma(pulse.cashCollections)} ও ব্যাংক ৳ ${formatAmountWithComma(pulse.bankCollections)}), মোট খরচ ৳ ${expenseFormatted} এবং আজকের নিট ক্যাশ ফ্লো হলো ৳ ${netCashFormatted}।`;

        return {
            success: true,
            spokenResponse,
            displayData: {
                type: 'executive_business_pulse',
                ...pulse
            }
        };
    }
}

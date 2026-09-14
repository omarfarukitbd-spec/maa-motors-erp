import { BaseSkill } from './base_skill.js';
import { ERPBridge } from '../bridge/erp_bridge.js';

export class BusinessIntelligenceSkill extends BaseSkill {
    constructor() {
        super({
            id: 'skill_business_intelligence',
            name: 'ব্যবসায়িক ক্যালকুলেশন ও সেলস ইন্টেলিজেন্স',
            description: 'মাসিক ও সাপ্তাহিক বিক্রয় টার্নওভার, আজকের চালান, শীর্ষ ক্রেতা, কালেকশন রিকভারি রেট, অগ্রিম কাস্টমার, ব্যাংক স্টেটমেন্ট এবং অতীতের নির্দিষ্ট তারিখের পূর্ণাঙ্গ হিসাব বের করে।',
            triggers: ['বিক্রি', 'টার্নওভার', 'চালান', 'সেরা ক্রেতা', 'রিকভারি রেট', 'অগ্রিম', 'স্টেটমেন্ট', 'নিট ক্যাশফ্লো', 'গত পরশু', 'গতকাল']
        });
    }

    getTools() {
        return [
            {
                name: 'get_period_sales_turnover',
                description: 'নির্দিষ্ট সময়ে মোট বিক্রি, চালান সংখ্যা ও দৈনিক গড় বিক্রি হিসাব করে।',
                parameters: {
                    type: 'object',
                    properties: {
                        days: { type: 'number', description: 'কত দিনের হিসাব' }
                    }
                }
            },
            {
                name: 'get_collection_recovery_efficiency',
                description: 'বিক্রির তুলনায় কালেকশনের শতকরা হার (রিকভারি রেট) যাচাই করে।',
                parameters: {
                    type: 'object',
                    properties: {
                        days: { type: 'number', description: 'কত দিনের অনুপাত' }
                    }
                }
            },
            {
                name: 'get_historical_date_summary',
                description: 'অতীতের যেকোনো নির্দিষ্ট দিনের বিক্রি, কালেকশন ও খরচ বের করে।',
                parameters: {
                    type: 'object',
                    properties: {
                        targetDate: { type: 'string', description: 'তারিখ YYYY-MM-DD' }
                    },
                    required: ['targetDate']
                }
            }
        ];
    }

    async execute(actionName, params = {}) {
        if (actionName === 'get_period_sales_turnover') {
            return await ERPBridge.getPeriodSalesTurnover(params.days || 30);
        }
        if (actionName === 'get_collection_recovery_efficiency') {
            return await ERPBridge.getCollectionRecoveryEfficiency(params.days || 30);
        }
        if (actionName === 'get_historical_date_summary') {
            return await ERPBridge.getHistoricalDateSummary(params.targetDate);
        }
        return { success: false, message: 'অজানা অ্যাকশন' };
    }
}

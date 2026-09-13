import { BaseSkill } from './base_skill.js';
import { ERPBridge, formatAmountWithComma } from '../bridge/erp_bridge.js';

export class DubaiSkill extends BaseSkill {
    constructor() {
        super({
            id: 'skill_dubai',
            name: 'দুবাই কন্টেইনার ও বৈদেশিক প্রকিউরমেন্ট স্কিল',
            description: 'দুবাই কন্টেইনার অডিট, সাপ্তাহিক দেরহাম ক্যাশ স্থিতি ও ব্যক্তিগত আমানতের হিসাব জানায়।',
            triggers: ['দুবাই', 'কনটেইনার', 'কন্টেইনার', 'দেরহাম', 'শারজাহ', 'আমদানির হিসাব', 'মুরাদ মামা', 'আলতাফ']
        });
    }

    getTools() {
        return [
            {
                name: 'get_dubai_audit_status',
                description: 'দুবাইয়ের সর্বশেষ সাপ্তাহিক অডিটের দেরহাম স্থিতি, নগদ ক্যাশ ও মার্কেট এডভান্সের হিসাব জানায়।',
                parameters: {
                    type: 'object',
                    properties: {}
                }
            }
        ];
    }

    async execute(actionName, params = {}) {
        const audit = await ERPBridge.getLatestDubaiAudit();

        if (!audit) {
            return {
                success: false,
                spokenResponse: 'দুবাই কনটেইনার অডিটের কোনো সাম্প্রতিক ডাটা পাওয়া যায়নি।'
            };
        }

        const cash = formatAmountWithComma(audit.cashInHand);
        const adv = formatAmountWithComma(audit.marketAdvance);
        const total = formatAmountWithComma(audit.totalPhysicalAssets);

        let spoken = `দুবাইয়ের সর্বশেষ অডিট রেকর্ড অনুযায়ী (${audit.date}): হাতে নগদ ক্যাশ আছে ${cash} দেরহাম, মার্কেট অ্যাডভান্স ${adv} দেরহাম এবং মোট ভৌত সম্পদ রয়েছে ${total} AED (ইউএই দেরহাম)।`;

        if (audit.variance !== 0) {
            const varFormatted = formatAmountWithComma(Math.abs(audit.variance));
            spoken += audit.variance > 0 
                ? ` এতে ${varFormatted} দেরহাম অতিরিক্ত উদ্বৃত্ত রয়েছে।` 
                : ` এতে ${varFormatted} দেরহাম ঘাটতি দেখাচ্ছে।`;
        }

        return {
            success: true,
            spokenResponse: spoken,
            displayData: audit
        };
    }
}

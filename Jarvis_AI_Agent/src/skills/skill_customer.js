import { BaseSkill } from './base_skill.js';
import { ERPBridge, formatAmountWithComma, numberToSpokenBangla } from '../bridge/erp_bridge.js';

export class CustomerSkill extends BaseSkill {
    constructor() {
        super({
            id: 'skill_customer',
            name: 'কাস্টমার ও বকেয়া লেজার স্কিল',
            description: 'কাস্টমারদের বকেয়া ব্যালেন্স, মোবাইল নম্বর, ঠিকানা এবং বর্তমান হিসাব যাচাই করে।',
            triggers: ['বকেয়া', 'কাস্টমার', 'বাকী', 'হিসাব', 'ব্যালেন্স', 'ফোন নম্বর', 'মোবাইল', 'ঠিকানা']
        });
    }

    getTools() {
        return [
            {
                name: 'get_customer_due',
                description: 'নির্দিষ্ট কাস্টমারের বর্তমান বকেয়া ব্যালেন্স এবং লেজার অবস্থা জেনে উত্তর দেয়।',
                parameters: {
                    type: 'object',
                    properties: {
                        customer_name: {
                            type: 'string',
                            description: 'কাস্টমারের নাম বা সার্চ কিওয়ার্ড (যেমন: করিম, আলম, রহিম ইত্যাদি)'
                        }
                    },
                    required: ['customer_name']
                }
            },
            {
                name: 'search_customer_info',
                description: 'কাস্টমারের মোবাইল নম্বর, ঠিকানা বা সাধারণ প্রোফাইল খুঁজে বের করে।',
                parameters: {
                    type: 'object',
                    properties: {
                        search_term: {
                            type: 'string',
                            description: 'কাস্টমারের নাম বা ফোন নম্বর'
                        }
                    },
                    required: ['search_term']
                }
            }
        ];
    }

    async execute(actionName, params = {}) {
        const query = params.customer_name || params.search_term || '';
        const results = await ERPBridge.searchCustomers(query);

        if (!results || results.length === 0) {
            return {
                success: false,
                spokenResponse: `দুঃখিত ভাইয়া, "${query}" নামে কোনো কাস্টমার আমাদের ডেটাবেসে খুঁজে পাওয়া যায়নি।`,
                displayData: { query, results: [] }
            };
        }

        if (actionName === 'get_customer_due') {
            if (results.length === 1) {
                const c = results[0];
                const dueText = c.totalDue > 0 
                    ? `বর্তমান অবশিষ্ট বকেয়া হলো ${numberToSpokenBangla(c.totalDue)}`
                    : (c.totalDue < 0 ? `অগ্রিম জমা রয়েছে ${numberToSpokenBangla(Math.abs(c.totalDue))}` : 'কোনো বকেয়া নেই, হিসাব সম্পূর্ণ পরিশোধিত');
                
                return {
                    success: true,
                    spokenResponse: `${c.name} সাহেবের ${dueText} (৳ ${formatAmountWithComma(c.totalDue)})।`,
                    displayData: { customer: c }
                };
            } else {
                const names = results.slice(0, 3).map(c => `${c.name} (বকেয়া: ৳ ${formatAmountWithComma(c.totalDue)})`).join(', ');
                return {
                    success: true,
                    spokenResponse: `এই নামে একাধিক কাস্টমার পাওয়া গেছে: ${names}। আপনি নির্দিষ্ট কার হিসাব দেখতে চান?`,
                    displayData: { count: results.length, matches: results }
                };
            }
        }

        if (actionName === 'search_customer_info') {
            const c = results[0];
            return {
                success: true,
                spokenResponse: `${c.name} সাহেবের মোবাইল নম্বর ${c.phone || 'যুক্ত নেই'} এবং ঠিকানা ${c.address || 'দেওয়া নেই'}। উনার বর্তমান বকেয়া ৳ ${formatAmountWithComma(c.totalDue)}।`,
                displayData: { customer: c }
            };
        }

        return {
            success: false,
            spokenResponse: 'কাস্টমার স্কিল সম্পন্ন করা সম্ভব হয়নি।'
        };
    }
}

import { BaseSkill } from './base_skill.js';
import { ERPBridge, formatAmountWithComma, numberToSpokenBangla } from '../bridge/erp_bridge.js';

/**
 * 📈 Sales Turnover & Invoice Tracking Skill
 * Handles: "আজকের বিক্রি কত", "চলতি মাসের মোট বিক্রি", "চালান / মেমো খুঁজুন", "সেরা ক্রেতা কে"
 */
export class SalesInvoiceSkill extends BaseSkill {
    constructor() {
        super({
            id: 'skill_sales_invoice',
            name: 'বিক্রয় টার্নওভার ও মেমো চালান ট্র্যাকিং',
            description: 'প্রতিদিনের মোট বিক্রি, নির্দিষ্ট সময়সীমার বিক্রয় টার্নওভার, ইনভয়েস/ভাউচার অনুসন্ধান এবং শীর্ষ ক্রেতাদের তালিকা প্রদান করে।',
            triggers: [
                'বিক্রি', 'আজকের বিক্রি', 'মোট বিক্রি', 'বিক্রয় টার্নওভার', 'চালান',
                'মেমো', 'ভাউচার', 'টপ কাস্টমার', 'সেরা ক্রেতা', 'সর্বোচ্চ মাল নিয়েছে'
            ]
        });
    }

    getTools() {
        return [
            {
                name: 'get_today_sales_invoices',
                description: 'মা মোটরসের আজকের বিক্রয় চালান ও মোট বিক্রির টাকার পরিমাণ জানতে এটি কল করো।',
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
                name: 'get_period_sales_turnover',
                description: 'গত ৭ দিন বা ৩০ দিনে মোট কত টাকার পার্টস বিক্রি হয়েছে তা জানতে এটি কল করো।',
                parameters: {
                    type: 'object',
                    properties: {
                        days: {
                            type: 'number',
                            description: 'কত দিনের হিসাব (যেমন ৭ বা ৩০)'
                        }
                    }
                }
            },
            {
                name: 'get_top_buying_customers',
                description: 'সবচেয়ে বেশি টাকার পণ্য ক্রয়কারী শীর্ষ ক্রেতাদের তালিকা জানতে এটি কল করো।',
                parameters: {
                    type: 'object',
                    properties: {
                        limit: {
                            type: 'number',
                            description: 'কত জন ক্রেতার তালিকা (ডিফল্ট ৫)'
                        },
                        days: {
                            type: 'number',
                            description: 'কত দিনের হিসাব (ডিফল্ট ৩০)'
                        }
                    }
                }
            },
            {
                name: 'search_voucher_or_invoice',
                description: 'নির্দিষ্ট মেমো বা ভাউচার নম্বর দিয়ে লেনদেনের বিবরণ খুঁজতে এটি কল করো।',
                parameters: {
                    type: 'object',
                    properties: {
                        voucherNo: {
                            type: 'string',
                            description: 'ভাউচার বা মেমো নম্বর (যেমন: 45001)'
                        }
                    },
                    required: ['voucherNo']
                }
            }
        ];
    }

    async execute(actionName, params = {}) {
        if (actionName === 'get_period_sales_turnover') {
            const data = await ERPBridge.getPeriodSalesTurnover(params.days || 30);
            if (!data || !data.success) return { success: false, spokenResponse: 'বিক্রয় টার্নওভার পাওয়া যায়নি।' };
            const formatted = formatAmountWithComma(data.totalSalesSum);
            const dailyAvg = formatAmountWithComma(data.dailyAverageSales);
            return {
                success: true,
                spokenResponse: `জি স্যার! গত ${data.days} দিনে সর্বমোট ৳ ${formatted} টাকার পণ্য বিক্রি হয়েছে (দৈনিক গড় বিক্রি ৳ ${dailyAvg})।`,
                displayData: { type: 'sales_turnover', ...data }
            };
        }

        if (actionName === 'get_top_buying_customers') {
            const data = await ERPBridge.getTopBuyingCustomers(params.limit || 5, params.days || 30);
            if (!data || !data.success) return { success: false, spokenResponse: 'সেরা ক্রেতাদের তালিকা লোড করা যায়নি।' };
            const topName = data.topBuyers?.[0]?.name || 'গ্রাহক';
            const topAmount = formatAmountWithComma(data.topBuyers?.[0]?.totalPurchased || 0);
            return {
                success: true,
                spokenResponse: `জি স্যার! সেরা ক্রেতাদের শীর্ষে আছেন ${topName}, যিনি মোট ৳ ${topAmount} টাকার মালামাল কিনেছেন।`,
                displayData: { type: 'top_buyers', ...data }
            };
        }

        if (actionName === 'search_voucher_or_invoice') {
            const data = await ERPBridge.searchVoucherOrInvoice(params.voucherNo);
            if (!data || !data.success || !data.transaction) {
                return { success: false, spokenResponse: `দুঃখিত স্যার, ${params.voucherNo} নম্বরের কোনো মেমো খুঁজে পাওয়া যায়নি।` };
            }
            const t = data.transaction;
            const amt = formatAmountWithComma(t.bill > 0 ? t.bill : t.paid);
            const typeStr = t.bill > 0 ? 'বিল/চালান' : 'জমা রশিদ';
            return {
                success: true,
                spokenResponse: `জি স্যার! ${params.voucherNo} নম্বর ${typeStr} পাওয়া গেছে। কাস্টমার: ${t.customerName}, টাকার পরিমাণ ৳ ${amt}।`,
                displayData: { type: 'voucher_detail', transaction: t }
            };
        }

        const data = await ERPBridge.getTodaySalesInvoices(params.date || null);
        if (!data || !data.success) return { success: false, spokenResponse: 'আজকের বিক্রির হিসাব লোড করা যায়নি।' };
        const total = formatAmountWithComma(data.todayTotalBills);
        return {
            success: true,
            spokenResponse: `জি স্যার! আজকের মোট বিক্রির পরিমাণ ৳ ${total} এবং মোট ${data.invoiceCount}টি চালান সম্পন্ন হয়েছে।`,
            displayData: { type: 'today_sales_invoices', ...data }
        };
    }
}

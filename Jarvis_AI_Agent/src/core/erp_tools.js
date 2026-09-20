/**
 * 🛠️ ERP Tools Controller — Maa Motors Executive AI
 * ===================================================
 * 100% Read-Only Safety Guard over Cloud Firestore
 * Canonical tool definitions and executor functions.
 */

import { ERPBridge, parseRelativeBengaliDate, getTodayLocalDateString, formatAmountWithComma } from '../bridge/erp_bridge.js';

export const ERP_TOOL_DEFINITIONS = [
    {
        name: 'get_executive_business_pulse',
        description: 'আজকের বা নির্দিষ্ট তারিখের দৈনিক মোট বিক্রি, কালেকশন, মোট খরচ এবং নিট ক্যাশ ফ্লো দেখতে এটি কল করো।',
        parameters: {
            type: 'OBJECT',
            properties: {
                date: { type: 'STRING', description: 'তারিখ YYYY-MM-DD (ঐচ্ছিক, না দিলে আজকের দেখাবে)' }
            }
        }
    },
    {
        name: 'get_showroom_cash',
        description: 'শোরুম ক্যাশে কাস্টমারদের থেকে নগদ কত জমা হলো, ক্যাশ খরচ কত এবং সমাপনী ক্যাশ ব্যালেন্স জানতে এটি কল করো।',
        parameters: {
            type: 'OBJECT',
            properties: {
                date: { type: 'STRING', description: 'তারিখ YYYY-MM-DD (ঐচ্ছিক)' }
            }
        }
    },
    {
        name: 'get_bank_balances',
        description: 'সব সক্রিয় ব্যাংক অ্যাকাউন্টের (পূবালী, ইসলামী ইত্যাদি) বর্তমান লাইভ স্থিতি এবং মোট ব্যাংকিং ব্যালেন্স জানতে এটি কল করো।',
        parameters: {
            type: 'OBJECT',
            properties: {}
        }
    },
    {
        name: 'get_customer_due_or_profile',
        description: 'মা মোটরসের কোনো কাস্টমারের নাম, ফোন নম্বর বা এলাকা দিয়ে তার বর্তমান অবশিষ্ট বকেয়া ও বিস্তারিত প্রোফাইল জানতে এটি কল করো।',
        parameters: {
            type: 'OBJECT',
            properties: {
                query: { type: 'STRING', description: 'কাস্টমারের নাম, ফোন বা অ্যাকাউন্ট নম্বর' }
            },
            required: ['query']
        }
    },
    {
        name: 'get_top_debtors',
        description: 'মার্কেটের সবচেয়ে বড় বকেয়াদার কারা (টপ বাকিদার) অথবা নির্দিষ্ট জোনের বকেয়ার হিসাব জানতে এটি কল করো।',
        parameters: {
            type: 'OBJECT',
            properties: {
                limit: { type: 'NUMBER', description: 'কয়জন দেখতে চায় (ডিফল্ট ৫)' },
                zone: { type: 'STRING', description: 'নির্দিষ্ট জোন (ঐচ্ছিক)' }
            }
        }
    },
    {
        name: 'get_dubai_container_audit',
        description: 'দুবাই কন্টেইনার পারচেজ, মেমো খরচ, এইডি (AED) ক্যাশ ব্যালেন্স, ব্যক্তিগত হেফাজত ও অডিট জানতে এটি কল করো।',
        parameters: {
            type: 'OBJECT',
            properties: {}
        }
    },
    {
        name: 'get_daily_expenses',
        description: 'আজকের বা নির্দিষ্ট দিনের অফিস খরচ, যাতায়াত খরচ ও মোট খরচের বিবরণ জানতে এটি কল করো।',
        parameters: {
            type: 'OBJECT',
            properties: {
                date: { type: 'STRING', description: 'তারিখ YYYY-MM-DD (ঐচ্ছিক)' }
            }
        }
    },
    {
        name: 'get_business_demographics',
        description: 'মোট কাস্টমার সংখ্যা, কতজন দেনাদার, কতজনের অগ্রিম জমা এবং কয়টি ব্যাংক অ্যাকাউন্ট আছে জানতে এটি কল করো।',
        parameters: {
            type: 'OBJECT',
            properties: {}
        }
    },
    {
        name: 'get_ledger_math_audit',
        description: 'লেনদেনের গাণিতিক নির্ভুলতা, জের বা ইনভেরিয়েন্ট অডিট পরীক্ষা করতে এটি কল করো।',
        parameters: {
            type: 'OBJECT',
            properties: {}
        }
    }
];

export async function executeErpTool(toolName, args = {}) {
    try {
        switch (toolName) {
            case 'get_executive_business_pulse': {
                const rep = await ERPBridge.getExecutiveBusinessPulse(args.date);
                const spoken = `আজকে মা মোটরসে মোট বিক্রি হয়েছে ${formatAmountWithComma(rep.todayTotalBills)} টাকা, মোট আদায় ${formatAmountWithComma(rep.todayTotalCollections)} টাকা এবং মোট খরচ ${formatAmountWithComma(rep.todayTotalExpenses)} টাকা। আজকের নিট ক্যাশ ফ্লো হলো ${formatAmountWithComma(rep.todayNetCashFlow)} টাকা।`;
                return {
                    title: 'দৈনিক এক্সিকিউটিভ রিপোর্ট',
                    spoken,
                    rows: [
                        ['মোট বিক্রি (চালান)', `৳ ${formatAmountWithComma(rep.todayTotalBills)}`],
                        ['মোট কালেকশন (আদায়)', `৳ ${formatAmountWithComma(rep.todayTotalCollections)}`],
                        ['মোট খরচ', `৳ ${formatAmountWithComma(rep.todayTotalExpenses)}`],
                        ['নিট ক্যাশ ফ্লো', `৳ ${formatAmountWithComma(rep.todayNetCashFlow)}`]
                    ],
                    raw: rep
                };
            }

            case 'get_showroom_cash': {
                const cash = await ERPBridge.getTodayShowroomCashCollections(args.date);
                const spoken = `আজকে শোরুম ক্যাশে নগদ জমা হয়েছে ${formatAmountWithComma(cash.totalCashCollected)} টাকা। খরচ বাদ দিয়ে বর্তমান নিট ক্যাশ স্থিতি রয়েছে ${formatAmountWithComma(cash.todayNetShowroomCash)} টাকা।`;
                return {
                    title: 'শোরুম ক্যাশ স্থিতি',
                    spoken,
                    rows: [
                        ['নগদ আদায়', `৳ ${formatAmountWithComma(cash.totalCashCollected)}`],
                        ['ক্যাশ খরচ', `৳ ${formatAmountWithComma(cash.todayCashExpenses)}`],
                        ['নিট ক্যাশ স্থিতি', `৳ ${formatAmountWithComma(cash.todayNetShowroomCash)}`],
                        ['জমা দিয়েছেন', `${cash.customerPaymentsCount || 0} জন`]
                    ],
                    raw: cash
                };
            }

            case 'get_bank_balances': {
                const banks = await ERPBridge.getAllBankRunningBalances();
                const total = banks.totalBankBalance || 0;
                const spoken = `মা মোটরসের সক্রিয় ব্যাংক অ্যাকাউন্টগুলোতে মোট ব্যালেন্স স্থিতি রয়েছে ${formatAmountWithComma(total)} টাকা।`;
                const rows = (banks.accounts || []).map(b => [b.bankName, `৳ ${formatAmountWithComma(b.currentBalance)}`]);
                return {
                    title: 'ব্যাংক হিসাব স্থিতি',
                    spoken,
                    rows: rows.length > 0 ? rows : [['মোট ব্যাংক স্থিতি', `৳ ${formatAmountWithComma(total)}`]],
                    raw: banks
                };
            }

            case 'get_customer_due_or_profile': {
                const query = String(args.query || '').trim();
                if (!query) {
                    return {
                        title: 'কাস্টমার বকেয়া',
                        spoken: 'জি স্যার, কোন কাস্টমারের বকেয়া জানতে চাচ্ছেন তার নাম বা মোবাইল নম্বর বলুন।',
                        rows: []
                    };
                }
                const profile = await ERPBridge.getCustomer360Profile(query);
                if (!profile || !profile.found) {
                    return {
                        title: 'কাস্টমার পাওয়া যায়নি',
                        spoken: `"${query}" নামে কোনো কাস্টমার মা মোটরসের ডেটাবেজে পাওয়া যায়নি। নাম বা এলাকা একটু স্পষ্ট করে বলুন।`,
                        rows: []
                    };
                }
                const due = profile.totalDue || 0;
                const dueText = due > 0 
                    ? `বর্তমান অবশিষ্ট বকেয়া হলো ${formatAmountWithComma(due)} টাকা`
                    : (due < 0 ? `অগ্রিম জমা রয়েছে ${formatAmountWithComma(Math.abs(due))} টাকা` : 'হিসাব সম্পূর্ণ পরিশোধিত (জিরো ব্যালেন্স)');
                const spoken = `${profile.name} (${profile.address || 'ঠিকানা নেই'})-এর ${dueText}।`;
                return {
                    title: `${profile.name} — প্রোফাইল`,
                    spoken,
                    rows: [
                        ['কাস্টমারের নাম', profile.name],
                        ['ঠিকানা', profile.address || 'দেওয়া নেই'],
                        ['মোবাইল নম্বর', profile.phone || 'দেওয়া নেই'],
                        ['অবশিষ্ট বকেয়া', `৳ ${formatAmountWithComma(due)}`],
                        ['মোট ক্রয়', `৳ ${formatAmountWithComma(profile.totalPurchased || 0)}`],
                        ['মোট পরিশোধ', `৳ ${formatAmountWithComma(profile.totalPaid || 0)}`]
                    ],
                    raw: profile
                };
            }

            case 'get_top_debtors': {
                const debtors = await ERPBridge.getTopDebtors(args.limit || 5, args.zone);
                const list = debtors.debtors || [];
                const topSpoken = list.slice(0, 3).map(d => `${d.name} (${formatAmountWithComma(d.totalDue)} টাকা)`).join(', ');
                const spoken = list.length > 0 
                    ? `শীর্ষ বকেয়াদারদের মধ্যে রয়েছেন: ${topSpoken}।`
                    : 'বর্তমানে কোনো বড় বকেয়াদার নেই।';
                return {
                    title: 'শীর্ষ বকেয়াদার তালিকা',
                    spoken,
                    rows: list.map(d => [d.name, `৳ ${formatAmountWithComma(d.totalDue)}`]),
                    raw: debtors
                };
            }

            case 'get_dubai_container_audit': {
                const dubai = await ERPBridge.getDubaiDeepCustodianHoldings();
                const spoken = `দুবাই অডিটের হিসাব অনুযায়ী ব্যক্তিগত হেফাজতে রয়েছে ${formatAmountWithComma(dubai.holdingsTotal || 0)} এইডি (AED) এবং মেস ফান্ডে রয়েছে ${formatAmountWithComma(dubai.messBalance || 0)} এইডি।`;
                const rows = (dubai.personalHoldings || []).map(h => [h.name, `${formatAmountWithComma(h.amount)} AED`]);
                rows.push(['মেস ফান্ড', `${formatAmountWithComma(dubai.messBalance || 0)} AED`]);
                return {
                    title: 'দুবাই কন্টেইনার ও এইডি অডিট',
                    spoken,
                    rows,
                    raw: dubai
                };
            }

            case 'get_daily_expenses': {
                const exp = await ERPBridge.getDailyExpenses(args.date);
                const total = exp.totalExpense || 0;
                const spoken = `আজকের মোট খরচের পরিমাণ হলো ${formatAmountWithComma(total)} টাকা।`;
                const rows = (exp.items || []).slice(0, 5).map(e => [e.category || 'খরচ', `৳ ${formatAmountWithComma(e.amount)}`]);
                return {
                    title: 'দৈনিক খরচের হিসাব',
                    spoken,
                    rows,
                    raw: exp
                };
            }

            case 'get_business_demographics': {
                const demo = await ERPBridge.getGeneralBusinessDemographics();
                const spoken = `মা মোটরসে সর্বমোট ${formatAmountWithComma(demo.totalCustomers)} জন কাস্টমার নিবন্ধিত আছেন। এর মধ্যে দেনাদার ${formatAmountWithComma(demo.debtorCount)} জন, অগ্রিম প্রদানকারী ${formatAmountWithComma(demo.advanceCount)} জন এবং সক্রিয় ব্যাংক আছে ${demo.activeBanksCount}টি।`;
                return {
                    title: 'সার্বিক ব্যবসায়িক পরিসংখ্যান',
                    spoken,
                    rows: [
                        ['মোট কাস্টমার', `${formatAmountWithComma(demo.totalCustomers)} জন`],
                        ['বকেয়া দেনাদার', `${formatAmountWithComma(demo.debtorCount)} জন`],
                        ['অগ্রিম প্রদানকারী', `${formatAmountWithComma(demo.advanceCount)} জন`],
                        ['সক্রিয় ব্যাংক অ্যাকাউন্ট', `${demo.activeBanksCount}টি`]
                    ],
                    raw: demo
                };
            }

            case 'get_ledger_math_audit': {
                const audit = await ERPBridge.getLedgerMathAuditSummary();
                const spoken = audit.statusMessage || `সাম্প্রতিক ${audit.auditedTxnCount || 0}টি লেনদেনের অডিট সম্পন্ন হয়েছে। কোনো গাণিতিক গরমিল পাওয়া যায়নি।`;
                return {
                    title: 'লেজার গাণিতিক অডিট',
                    spoken,
                    rows: [
                        ['অডিট স্ট্যাটাস', audit.isMathValid ? 'সম্পূর্ণ নির্ভুল (Passed)' : 'পরীক্ষা প্রয়োজন'],
                        ['অডিটকৃত লেনদেন', `${audit.auditedTxnCount || 0}টি`],
                        ['মোট ভ্যারিয়েন্স', `৳ ${formatAmountWithComma(audit.variance || 0)}`]
                    ],
                    raw: audit
                };
            }

            default:
                throw new Error(`অজানা টুল: ${toolName}`);
        }
    } catch (err) {
        console.error(`[ERP Tools] Execution error in "${toolName}":`, err);
        return {
            title: 'ত্রুটি',
            spoken: `হিসাবটি সংগ্রহ করতে একটি সমস্যা হয়েছে: ${err.message}`,
            rows: []
        };
    }
}

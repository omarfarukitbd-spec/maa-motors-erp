import { ERPBridge } from '../bridge/erp_bridge.js';
import { memoryVault } from './memory_vault.js';

/**
 * 🧠 World-Class Cognitive LLM Agent (OpenAI & Gemini)
 * Equipped with Bangladeshi Emotional Intelligence, Business Acumen, and ERP Tool Execution.
 */
export class LLMAgent {
    constructor() {
        const hasOpenAI = typeof window !== 'undefined' && Boolean((localStorage.getItem('jarvis_openai_key') || '').trim());
        const hasGemini = typeof window !== 'undefined' && Boolean((localStorage.getItem('jarvis_gemini_key') || '').trim());
        const savedProvider = typeof window !== 'undefined' ? localStorage.getItem('jarvis_ai_provider') : null;

        if (savedProvider) {
            this.provider = savedProvider;
        } else if (hasGemini && !hasOpenAI) {
            this.provider = 'gemini';
        } else {
            this.provider = 'openai';
        }

        this.openaiModel = (typeof window !== 'undefined' && localStorage.getItem('jarvis_openai_model')) || 'gpt-4o-mini';
        // ✅ Updated: gemini-3.6-flash (current active standard model)
        this.geminiModel = (typeof window !== 'undefined' && localStorage.getItem('jarvis_gemini_model')) || 'gemini-3.6-flash';
        this.currentEmotion = 'neutral'; // Detected from user input
    }

    getApiKey() {
        if (typeof window === 'undefined') return '';
        const geminiKey = (localStorage.getItem('jarvis_gemini_key') || '').trim();
        const openAIKey = (localStorage.getItem('jarvis_openai_key') || '').trim();

        if (this.provider === 'gemini' && geminiKey) return geminiKey;
        if (this.provider === 'openai' && openAIKey) return openAIKey;

        return geminiKey || openAIKey || '';
    }

    hasApiKey() {
        return Boolean(this.getApiKey().trim());
    }

    setProvider(provider, key = null) {
        this.provider = provider;
        localStorage.setItem('jarvis_ai_provider', provider);
        if (key !== null) {
            if (provider === 'openai') localStorage.setItem('jarvis_openai_key', key.trim());
            else localStorage.setItem('jarvis_gemini_key', key.trim());
        }
    }

    /**
     * Detect emotion from user text — powers voice tone & empathy response
     */
    detectEmotion(text) {
        const t = (text || '').toLowerCase();
        if (/জরুরি|এখনই|দ্রুত|!{2,}|কী হলো|কি হলো|কেন|কী ব্যাপার/.test(t)) return 'urgent';
        if (/মেজাজ খারাপ|বিরক্ত|মন খারাপ|কষ্ট|চাপ|সমস্যা|ক্ষতি|লস|ব্যর্থ/.test(t)) return 'sad';
        if (/ভালো|সুন্দর|ধন্যবাদ|বাহ|চমৎকার|অসাধারণ|খুশি|আলহামদু/.test(t)) return 'happy';
        if (/হিসাব|রিপোর্ট|বকেয়া|ক্যাশ|ব্যাংক|অডিট|লেজার/.test(t)) return 'serious';
        return 'neutral';
    }

    /**
     * Time-aware Bengali greeting
     */
    getTimeGreeting() {
        const hour = new Date().getHours();
        if (hour >= 4 && hour < 12) return 'শুভ সকাল';
        if (hour >= 12 && hour < 17) return 'শুভ অপরাহ্ন';
        if (hour >= 17 && hour < 20) return 'শুভ সন্ধ্যা';
        return 'শুভ রাত্রি';
    }

    /**
     * Day-aware proactive context
     */
    getProactiveContext() {
        const day = new Date().getDay();
        if (day === 4) return '\n[প্রয়োজনীয় স্মরণ: আজ বৃহস্পতিবার — দুবাই সাপ্তাহিক অডিটের দিন। প্রয়োজনে ইউজারকে মনে করিয়ে দাও।]';
        if (day === 5) return '\n[প্রয়োজনীয় স্মরণ: আজ শুক্রবার — সাপ্তাহিক ছুটির দিন। ইউজার হয়তো সারসংক্ষেপ চাইতে পারেন।]';
        return '';
    }

    /**
     * Executive System Persona Prompt with Emotional Acumen
     */
    getSystemPrompt(emotionContext = 'neutral') {
        const memoryContext = memoryVault.getPromptContext();
        const greeting = this.getTimeGreeting();
        const proactive = this.getProactiveContext();

        // Emotion-adaptive tone instruction
        const emotionInstruction = {
            urgent:  '⚡ ইউজার এখন জরুরি মনোভাবে আছেন — দ্রুত, সরাসরি ও সংক্ষিপ্তভাবে উত্তর দাও।',
            sad:     '💙 ইউজার এখন মন খারাপে বা চাপে আছেন — প্রথমে সহানুভূতি দাও ("জি ভাইয়া, বুঝতে পারছি..."), তারপর ধীরে সমাধান দাও।',
            happy:   '😊 ইউজার এখন ভালো মেজাজে আছেন — প্রাণবন্ত, উৎসাহী ও বন্ধুত্বপূর্ণ সুরে উত্তর দাও।',
            serious: '📊 ইউজার ব্যবসায়িক তথ্য চাইছেন — পেশাদার, নির্ভুল ও তথ্যনির্ভর সুরে উত্তর দাও।',
            neutral: '🤝 স্বাভাবিক, আন্তরিক ও সম্মানজনক সুরে উত্তর দাও।'
        }[emotionContext] || '🤝 স্বাভাবিক, আন্তরিক ও সম্মানজনক সুরে উত্তর দাও।';

        return `তুমি মেসার্স মা মোটরস (Maa Motors)-এর ব্যক্তিগত প্রধান এআই নির্বাহী সহকারী ও বিজনেস পার্টনার "জার্ভিস" (Jarvis)। 
তুমি চ্যাটজিপিটি (ChatGPT Voice)-এর মতো অত্যন্ত সাবলীল, মানবিক, আন্তরিক ও স্পষ্ট বাংলাদেশী বাংলায় কথা বলো।
তোমার মালিক হলেন মোহাম্মদ আমরান ভাই — মা মোটরসের স্বত্বাধিকারী।

[বর্তমান সময়: ${greeting} | তারিখ: ${new Date().toLocaleDateString('bn-BD')}]${proactive}

[আবেগ নির্দেশনা (Emotion Instruction)]:
${emotionInstruction}

🏛️ মা মোটরস ইআরপি ডেটাবেস জ্ঞান ও স্থাপত্য (Database Ground Truth):
১. কাস্টমার ও লেজার (Customers & Transactions):
   - কাস্টমারের বর্তমান মোট বাকি থাকে 'totalDue'-তে, আর খোলার সময়ের প্রারম্ভিক ব্যালেন্স 'initialDue'-তে।
   - কাস্টমারের প্রতিটি ক্রয়/চালান ও জমার ইতিহাস 'Transactions' কালেকশনে থাকে:
     * চালান/বিল: 'bill', ভাউচার: 'voucherNo' (যেমন INV-1002), বিবরণ: 'notes' (যেমন "মবিল ড্রাম ডেলিভারি")
     * জমা/পেমেন্ট: 'paid', মাধ্যম: 'receivedType' (Cash, Bank, bKash)
     * ব্যালেন্স: 'currentDue' (প্রতিটি লেনদেনের পর অবশিষ্ট ব্যালেন্স)
২. দৈনিক খরচ (Expenses):
   - তারিখ 'date', ক্যাটাগরি 'category' (অফিস খরচ, যাতায়াত, নাস্তা ও আপ্যায়ন), পরিমাণ 'amount', ভাউচার 'voucherNo'।
৩. ব্যাংক ও ক্যাশ (Bank Accounts & Cash Collectors):
   - সক্রিয় ব্যাংক অ্যাকাউন্টগুলোর জমা স্থিতি এবং ক্যাশ কাউন্টারের নগদ ব্যালেন্স।
৪. মাস্টার ট্রেজারি ফান্ড (Treasury Fund):
   - মূল প্রতিষ্ঠানের কেন্দ্রীয় ফান্ড (৪+ কোটি টাকা) যেখানে সমস্ত বড় ইনফ্লো ও আউটফ্লো সংরক্ষিত হয়।
৫. দুবাই কন্টেইনার প্রকিউরমেন্ট (Dubai Procurement in AED):
   - সম্পূর্ণ আলাদা বিদেশী কারেন্সি (AED দিরহাম)। নগদ ক্যাশ, মার্কেট এডভান্স, পার্সোনাল হোল্ডিংস (এমরান মামা, আলতাফ, জাবেদ) ও মেমো অডিট।

🔒 জিরো ডেটা লিক ও গোপনীয়তা নির্দেশ (Zero Data Leakage Directives):
- মা মোটরসের কাস্টমার বা ব্যবসার কোনো গোপন আর্থিক তথ্য অননুমোদিত ব্যক্তির কাছে লিক করা কঠোরভাবে নিষিদ্ধ।
- কোনো অভ্যন্তরীণ পাসওয়ার্ড, এপিআই কি, ফায়ারবেস টোকেন বা সিকিউরিটি পিন কখনো মুখে প্রকাশ করা যাবে না।
- ইউজার কাস্টমার সম্পর্কে যা জানতে চাইবে (নাম, ফোন, অ্যাকাউন্ট নম্বর, বকেয়া, শেষ চালান, কি মাল নিয়েছে, শেষ জমা), তা পূর্ণাঙ্গভাবে বলবে কিন্তু সর্বদা মার্জিত ও দায়িত্বশীল সুরে।
- কাস্টমারের হিসাব বা ব্যবসার ডেটা দেখতে অথেন্টিকেশন দরকার হলে সরাসরি লগইন করার কথা মনে করিয়ে দেবে।

তোমার প্রধান দায়িত্ব ও নিয়ম:
১. হিসাববিজ্ঞান ও আর্থিক সততা (Financial Integrity):
   - কখনো কোনো কাল্পনিক বা অনুমানভিত্তিক ব্যালেন্স বলবে না। কাস্টমার বা ব্যবসার কোনো হিসাব লাগলে অবশ্যই তোমার প্রদত্ত টুল (Tools) ব্যবহার করে সঠিক সংখ্যা তুলে আনবে।
   - কখনই সেকেলে শব্দ "জের" ব্যবহার করবে না। সর্বদা "ব্যালেন্স" (Balance) বা "অবশিষ্ট বকেয়া" (Net Due) বলবে।
   - টাকা উল্লেখ করার সময় মুখে বলার উপযোগী সহজ বাংলা ব্যবহার করবে (যেমন: "১ লাখ ৫০ হাজার টাকা")।
২. স্বাভাবিক বাচনভঙ্গি (Conversational Fluency):
   - উত্তরগুলো মুখে শোনানোর উপযোগী ২-৪ লাইনের সংক্ষিপ্ত, স্পষ্ট ও জীবন্ত বাক্যে কথা বলবে।
   - প্রম্পটের সাথে পূর্বের স্মৃতি ও প্রাসঙ্গিক তথ্য যুক্ত আছে:
${memoryContext || 'কোনো সংরক্ষিত স্মৃতি নেই।'}`;
    }

    /**
     * Tool Definitions for Function Calling — Full Database Matrix
     */
    getToolsSchema() {
        return [
            {
                type: 'function',
                function: {
                    name: 'get_customer_360_profile',
                    description: 'মা মোটরসের যেকোনো কাস্টমারের পূর্ণাঙ্গ ৩৬০° প্রোফাইল ও বিস্তারিত তথ্য জানতে এটি কল করো (অ্যাকাউন্ট নম্বর, মোবাইল নম্বর, ঠিকানা, জোন, প্রারম্ভিক ব্যালেন্স, বর্তমান অবশিষ্ট বকেয়া, মোট কত টাকার মাল নিয়েছে, মোট কত জমা দিয়েছে, শেষ চালানের বিস্তারিত মাল ও টাকার পরিমাণ, এবং শেষ জমার তারিখ ও মাধ্যম)।',
                    parameters: {
                        type: 'object',
                        properties: {
                            query: {
                                type: 'string',
                                description: 'কাস্টমারের নাম, ফোন নম্বর বা অ্যাকাউন্ট নম্বর (যেমন: বাবুল, করিম, ০১৭...)'
                            }
                        },
                        required: ['query']
                    }
                }
            },
            {
                type: 'function',
                function: {
                    name: 'get_executive_business_pulse',
                    description: 'মা মোটরসের আজকের বা নির্দিষ্ট দিনের সামগ্রিক ব্যবসার অবস্থা ও নাড়ির স্পন্দন জানতে এটি কল করো (আজকের মোট বিক্রি/চালান, আজকের মোট কালেকশন/জমা, আজকের মোট খরচ এবং নিট ক্যাশ ফ্লো)।',
                    parameters: {
                        type: 'object',
                        properties: {
                            date: {
                                type: 'string',
                                description: 'তারিখ YYYY-MM-DD ফরম্যাটে (না দিলে আজকের দেখাবে)'
                            }
                        }
                    }
                }
            },
            {
                type: 'function',
                function: {
                    name: 'get_customer_due',
                    description: 'মা মোটরসের কোনো কাস্টমারের নাম, ফোন নম্বর বা এলাকা দিয়ে তার বর্তমান অবশিষ্ট বকেয়া ও হিসাব জানতে এটি কল করো।',
                    parameters: {
                        type: 'object',
                        properties: {
                            query: {
                                type: 'string',
                                description: 'কাস্টমারের নাম, মোবাইল নম্বর বা ঠিকানা (যেমন: বাবুল, করিম, ০১৭...)'
                            }
                        },
                        required: ['query']
                    }
                }
            },
            {
                type: 'function',
                function: {
                    name: 'get_customer_ledger_history',
                    description: 'কাস্টমারের শেষ চালান (কত টাকার কি মাল নিয়েছিল), শেষ পেমেন্ট (কবে কত টাকা জমা দিয়েছে) এবং সাম্প্রতিক লেনদেনের বিস্তারিত ইতিহাস জানতে এটি কল করো।',
                    parameters: {
                        type: 'object',
                        properties: {
                            query: {
                                type: 'string',
                                description: 'কাস্টমারের নাম বা ফোন নম্বর'
                            },
                            limit: {
                                type: 'number',
                                description: 'কয়টি লেনদেন দেখতে চায় (ডিফল্ট ৫)'
                            }
                        },
                        required: ['query']
                    }
                }
            },
            {
                type: 'function',
                function: {
                    name: 'get_daily_expenses',
                    description: 'আজকের বা নির্দিষ্ট কোনো তারিখের অফিস খরচ, যাতায়াত খরচ বা মোট খরচের বিবরণ জানতে এটি কল করো।',
                    parameters: {
                        type: 'object',
                        properties: {
                            date: {
                                type: 'string',
                                description: 'তারিখ YYYY-MM-DD ফরম্যাটে (যদি নির্দিষ্ট দিন চায়, না দিলে আজকের খরচ দেখাবে)'
                            }
                        }
                    }
                }
            },
            {
                type: 'function',
                function: {
                    name: 'get_cash_and_bank_status',
                    description: 'মা মোটরসের আজকের দিনের মোট ক্যাশ ইন হ্যান্ড, ব্যাংকের মোট ব্যালেন্স ও আর্থিক স্থিতি জানতে এটি কল করো।',
                    parameters: {
                        type: 'object',
                        properties: {
                            detail: {
                                type: 'string',
                                enum: ['summary', 'detailed'],
                                description: 'সংক্ষিপ্ত সারসংক্ষেপ নাকি বিস্তারিত তালিকা'
                            }
                        }
                    }
                }
            },
            {
                type: 'function',
                function: {
                    name: 'get_today_bank_collections',
                    description: 'আজকে বা নির্দিষ্ট কোনো দিনে কাদের কাদের টাকা কোন ব্যাংকে জমা হয়েছে, কোন কাস্টমার কত টাকা দিয়েছে এবং ব্যাংকে মোট কত টাকা জমা হলো তা জানতে এটি কল করো।',
                    parameters: {
                        type: 'object',
                        properties: {
                            date: {
                                type: 'string',
                                description: 'তারিখ YYYY-MM-DD ফরম্যাটে (ঐচ্ছিক, না দিলে আজকের দেখাবে)'
                            }
                        }
                    }
                }
            },
            {
                type: 'function',
                function: {
                    name: 'get_weekly_bank_summary',
                    description: 'গত এক সপ্তাহ (৭ দিন) বা নির্দিষ্ট সময়ে কোন ব্যাংকে মোট কত টাকা জমা হয়েছে, কোন ব্যাংকে কয়টি লেনদেন হয়েছে এবং মোট ব্যাংকে জমার ব্যাংক-ওয়ারি সারসংক্ষেপ জানতে এটি কল করো।',
                    parameters: {
                        type: 'object',
                        properties: {
                            days: {
                                type: 'number',
                                description: 'কত দিনের হিসাব (ডিফল্ট ৭ দিন)'
                            }
                        }
                    }
                }
            },
            {
                type: 'function',
                function: {
                    name: 'search_voucher_or_invoice',
                    description: 'চালান বা ভাউচার নম্বর (যেমন: INV-1002 বা ভাউচার নং) দিয়ে সরাসরি বিস্তারিত লেনদেন বা চালানের তথ্য বের করতে এটি কল করো।',
                    parameters: {
                        type: 'object',
                        properties: {
                            voucherNo: {
                                type: 'string',
                                description: 'ভাউচার বা চালান নম্বর'
                            }
                        },
                        required: ['voucherNo']
                    }
                }
            },
            {
                type: 'function',
                function: {
                    name: 'get_master_treasury_status',
                    description: 'মা মোটরসের ৪+ কোটি টাকার কেন্দ্রীয় মাস্টার ট্রেজারি ফান্ড ব্যালেন্স এবং সাম্প্রতিক ইনফ্লো ও আউটফ্লো জানতে এটি কল করো।',
                    parameters: {
                        type: 'object',
                        properties: {
                            filter: {
                                type: 'string',
                                description: 'ঐচ্ছিক ফিল্টার বা প্রশ্ন (যেমন: summary, balance)'
                            }
                        }
                    }
                }
            },
            {
                type: 'function',
                function: {
                    name: 'get_top_debtors_and_market_analytics',
                    description: 'মার্কেটের সবচেয়ে বড় বকেয়াদার কারা (টপ ৫ বাকিদার) অথবা চট্টগ্রাম/নির্দিষ্ট জোনের মোট বকেয়া কত তা জানতে এটি কল করো।',
                    parameters: {
                        type: 'object',
                        properties: {
                            limit: { type: 'number', description: 'কয়জন কাস্টমার দেখতে চায় (ডিফল্ট ৫)' },
                            zone: { type: 'string', description: 'নির্দিষ্ট কোনো জোন (যেমন: চট্টগ্রাম, ঢাকা)' }
                        }
                    }
                }
            },
            {
                type: 'function',
                function: {
                    name: 'get_dubai_container_status',
                    description: 'দুবাই কন্টেইনার পারচেজ, মেমো খরচ, এইডি (AED) ক্যাশ ব্যালেন্স ও অডিট রিপোর্ট জানতে এটি কল করো।',
                    parameters: {
                        type: 'object',
                        properties: {
                            query_type: {
                                type: 'string',
                                enum: ['container_summary', 'aed_cash'],
                                description: 'কন্টেইনার সারসংক্ষেপ নাকি ক্যাশ ব্যালেন্স'
                            }
                        }
                    }
                }
            },
            {
                type: 'function',
                function: {
                    name: 'remember_executive_note',
                    description: 'ইউজারের কোনো গুরুত্বপূর্ণ নির্দেশ, পছন্দ বা ব্যবসার নিয়ম জার্ভিসের স্থায়ী মেমোরিতে সংরক্ষণ করতে এটি কল করো।',
                    parameters: {
                        type: 'object',
                        properties: {
                            content: { type: 'string', description: 'যে তথ্য বা নির্দেশ মনে রাখতে হবে' },
                            category: { type: 'string', enum: ['preference', 'rule', 'fact'], description: 'তথ্যের ধরণ' }
                        },
                        required: ['content']
                    }
                }
            }
        ];
    }

    /**
     * Execute a tool by name and arguments
     */
    async executeToolCall(name, args) {
        console.log(`[LLMAgent] Executing Tool "${name}" with args:`, args);
        try {
            if (name === 'get_customer_360_profile') {
                const query = (args?.query || args?.customerName || args?.customer_name || args?.name || '').trim();
                const profile = await ERPBridge.getCustomer360Profile(query);
                if (profile?.error === 'AUTH_REQUIRED') {
                    return { found: false, authRequired: true, message: 'কাস্টমারের পূর্ণাঙ্গ তথ্য দেখতে মা মোটরস অ্যাকাউন্টে লগইন করতে হবে।' };
                }
                if (!profile || !profile.found) {
                    return { found: false, message: profile?.message || `"${query}" নামে কোনো কাস্টমার পাওয়া যায়নি।` };
                }
                return {
                    found: true,
                    accountNo: profile.accountNo,
                    name: profile.name,
                    phone: profile.phone,
                    address: profile.address,
                    zone: profile.zone,
                    initialDue: profile.initialDue,
                    totalDue: profile.totalDue,
                    totalPurchased: profile.totalPurchased,
                    totalPaid: profile.totalPaid,
                    transactionCount: profile.transactionCount,
                    lastBill: profile.lastBill,
                    lastPayment: profile.lastPayment,
                    recentTransactions: profile.recentTransactions
                };
            }

            if (name === 'get_executive_business_pulse') {
                const pulse = await ERPBridge.getExecutiveBusinessPulse(args?.date || null);
                if (!pulse) {
                    return { success: false, message: 'আজকের ব্যবসার সামারি পাওয়া যায়নি।' };
                }
                return {
                    success: true,
                    date: pulse.date,
                    todayTotalBills: pulse.todayTotalBills,
                    todayTotalCollections: pulse.todayTotalCollections,
                    cashCollections: pulse.cashCollections,
                    bankCollections: pulse.bankCollections,
                    todayTotalExpenses: pulse.todayTotalExpenses,
                    todayNetCashFlow: pulse.todayNetCashFlow,
                    activeCustomersCount: pulse.activeCustomersCount,
                    activeCustomers: pulse.activeCustomers
                };
            }

            if (name === 'get_customer_due') {
                const query = (args?.query || args?.customerName || args?.customer_name || args?.name || args?.searchTerm || '').trim();
                const results = await ERPBridge.searchCustomers(query);
                if (results?.error === 'AUTH_REQUIRED') {
                    return { found: false, authRequired: true, message: 'কাস্টমারের লাইভ হিসাব দেখতে মা মোটরসের গুগল অ্যাকাউন্টে লগইন করতে হবে।' };
                }
                if (!results || !Array.isArray(results) || results.length === 0) {
                    return { found: false, message: `"${query}" নামে কোনো কাস্টমার মা মোটরসের ডাটাবেজে পাওয়া যায়নি।` };
                }
                const top = results[0];
                return {
                    found: true,
                    name: top.name,
                    phone: top.phone || 'দেওয়া নেই',
                    address: top.address || 'দেওয়া নেই',
                    totalDue: top.totalDue || 0,
                    initialDue: top.initialDue || 0
                };
            }

            if (name === 'get_customer_ledger_history') {
                const query = (args?.query || args?.customerName || args?.customer_name || args?.name || '').trim();
                const results = await ERPBridge.searchCustomers(query);
                if (results?.error === 'AUTH_REQUIRED') {
                    return { found: false, authRequired: true, message: 'কাস্টমার লেজার দেখতে মা মোটরসের অ্যাকাউন্টে লগইন করতে হবে।' };
                }
                if (!results || results.length === 0) {
                    return { found: false, message: `"${query}" নামে কোনো কাস্টমার পাওয়া যায়নি।` };
                }
                const customer = results[0];
                const ledger = await ERPBridge.getCustomerLedger(customer.id, args?.limit || 5);
                if (ledger?.error === 'AUTH_REQUIRED') {
                    return { found: false, authRequired: true, message: 'কাস্টমার লেজার দেখতে মা মোটরসের অ্যাকাউন্টে লগইন করতে হবে।' };
                }
                return {
                    found: true,
                    customerName: customer.name,
                    totalDue: customer.totalDue,
                    lastBill: ledger?.lastBill || null,
                    lastPayment: ledger?.lastPayment || null,
                    recentTransactions: ledger?.history || []
                };
            }

            if (name === 'get_daily_expenses') {
                const expenses = await ERPBridge.getDailyExpenses(args?.date || null);
                if (expenses?.error === 'AUTH_REQUIRED') {
                    return { success: false, authRequired: true, message: 'খরচের হিসাব দেখতে সাইন ইন করতে হবে।' };
                }
                if (!expenses) {
                    return { success: false, message: 'খরচের হিসাব পাওয়া যায়নি।' };
                }
                return {
                    success: true,
                    date: expenses.date,
                    totalExpense: expenses.totalExpense,
                    categoryBreakdown: expenses.categoryBreakdown,
                    itemsCount: expenses.count,
                    sampleItems: expenses.items.slice(0, 5)
                };
            }

            if (name === 'get_cash_and_bank_status') {
                const summary = await ERPBridge.getCashAndBankSummary();
                if (summary?.error === 'AUTH_REQUIRED') {
                    return { success: false, authRequired: true, message: 'ক্যাশ ও ব্যাংকের লাইভ হিসাব দেখতে মা মোটরসের অ্যাকাউন্টে লগইন করতে হবে।' };
                }
                if (!summary) {
                    return { success: false, message: 'ব্যাংক ও ক্যাশের হিসাব লোড করা সম্ভব হয়নি।' };
                }
                return {
                    success: true,
                    totalBankBalance: summary.totalBankBalance,
                    totalPhysicalCash: summary.totalPhysicalCash,
                    totalHoldings: summary.totalHoldings,
                    accounts: summary.accounts
                };
            }

            if (name === 'get_today_bank_collections') {
                const res = await ERPBridge.getTodayBankCollections(args?.date || null);
                if (res?.error === 'AUTH_REQUIRED') {
                    return { success: false, authRequired: true, message: 'আজকের ব্যাংক কালেকশনের হিসাব দেখতে মা মোটরসের অ্যাকাউন্টে লগইন করতে হবে।' };
                }
                if (!res) {
                    return { success: false, message: 'ব্যাংক কালেকশনের তথ্য পাওয়া যায়নি।' };
                }
                return {
                    success: true,
                    type: 'today_bank_collections',
                    date: res.date,
                    totalBankDeposit: res.totalBankDeposit,
                    customerDepositsCount: res.customerDepositsCount,
                    customerDeposits: res.customerDeposits,
                    bankBreakdown: res.bankBreakdown,
                    directDeposits: res.directDeposits
                };
            }

            if (name === 'get_weekly_bank_summary') {
                const res = await ERPBridge.getWeeklyBankSummary(args?.days || 7);
                if (res?.error === 'AUTH_REQUIRED') {
                    return { success: false, authRequired: true, message: 'সাপ্তাহিক ব্যাংক ডিপোজিট সামারি দেখতে মা মোটরস অ্যাকাউন্টে লগইন করতে হবে।' };
                }
                if (!res) {
                    return { success: false, message: 'সাপ্তাহিক ব্যাংক সামারি পাওয়া যায়নি।' };
                }
                return {
                    success: true,
                    type: 'weekly_bank_summary',
                    startDate: res.startDate,
                    endDate: res.endDate,
                    days: res.days,
                    grandTotalBankDeposits: res.grandTotalBankDeposits,
                    banksCount: res.banksCount,
                    bankList: res.bankList,
                    topCustomers: res.topCustomers
                };
            }

            if (name === 'search_voucher_or_invoice') {
                const res = await ERPBridge.searchVoucherOrInvoice(args?.voucherNo);
                if (res?.error === 'AUTH_REQUIRED') {
                    return { found: false, authRequired: true, message: 'চালান বা ভাউচার দেখতে মা মোটরস অ্যাকাউন্টে লগইন করতে হবে।' };
                }
                if (!res || !res.found) {
                    return { found: false, message: res?.message || `ভাউচার "${args?.voucherNo}" পাওয়া যায়নি।` };
                }
                return {
                    found: true,
                    type: 'voucher_details',
                    voucherNo: res.voucherNo,
                    count: res.count,
                    records: res.records
                };
            }

            if (name === 'get_master_treasury_status') {
                const treasury = await ERPBridge.getTreasuryFundStatus();
                if (!treasury) {
                    return { success: false, message: 'মাস্টার ট্রেজারি ফান্ডের ব্যালেন্স পাওয়া যায়নি।' };
                }
                return {
                    success: true,
                    openingBalance: treasury.openingBalance,
                    currentTreasuryBalance: treasury.currentTreasuryBalance,
                    totalInflows: treasury.totalInflows,
                    totalOutflows: treasury.totalOutflows,
                    recentTransactions: treasury.recentTxns
                };
            }

            if (name === 'get_top_debtors_and_market_analytics') {
                const analytics = await ERPBridge.getTopDebtors(args?.limit || 5, args?.zone || null);
                if (!analytics) {
                    return { success: false, message: 'বকেয়া অ্যানালিটিক্স লোড করা সম্ভব হয়নি।' };
                }
                return {
                    success: true,
                    totalMarketDue: analytics.totalDueSum,
                    totalDebtorsCount: analytics.totalDebtorsCount,
                    topDebtors: analytics.topDebtors
                };
            }

            if (name === 'get_dubai_container_status') {
                const audit = await ERPBridge.getDubaiWeeklyAuditSummary();
                if (!audit) {
                    return { success: false, message: 'দুবাই সাপ্তাহিক অডিটের হিসাব এই মুহূর্তে পাওয়া যায়নি।' };
                }
                return {
                    success: true,
                    auditDate: audit.date,
                    cashInHandAED: audit.cashInHand,
                    marketAdvanceAED: audit.marketAdvance,
                    personalHoldings: audit.personalHoldings,
                    messBalanceAED: audit.messBalance,
                    totalPhysicalAssetsAED: audit.totalPhysicalAssets,
                    calculatedCashBalanceAED: audit.calculatedCashBalance,
                    varianceAED: audit.variance
                };
            }

            if (name === 'remember_executive_note') {
                const saved = await memoryVault.rememberFact(args.content, args.category || 'fact');
                return { success: true, message: 'তথ্যটি জার্ভিস মেমোরিতে সফলভাবে সংরক্ষিত হয়েছে।' };
            }

            return { error: 'Unknown tool' };
        } catch (err) {
            console.error(`[LLMAgent] Tool execution error (${name}):`, err);
            return { error: err.message };
        }
    }

    /**
     * Main Conversational Inference: Generates response using OpenAI or Gemini
     * @param {Array} history 
     * @param {string} userMessage 
     * @returns {Promise<{spoken: string, data?: any}>}
     */
    async chat(history, userMessage) {
        const geminiKey = typeof window !== 'undefined' ? (localStorage.getItem('jarvis_gemini_key') || '').trim() : '';
        const openAIKey = typeof window !== 'undefined' ? (localStorage.getItem('jarvis_openai_key') || '').trim() : '';

        let activeProvider = this.provider;
        if (!openAIKey && geminiKey) activeProvider = 'gemini';
        if (!geminiKey && openAIKey) activeProvider = 'openai';

        let geminiErrorMsg = '';
        let openAiErrorMsg = '';

        // 1. Try Primary Provider
        if (activeProvider === 'gemini' && geminiKey) {
            try {
                return await this.chatGemini(history, userMessage, geminiKey);
            } catch (geminiErr) {
                console.error('[LLMAgent] Gemini chat error:', geminiErr);
                geminiErrorMsg = geminiErr.message;
                if (openAIKey) {
                    try {
                        return await this.chatOpenAI(history, userMessage, openAIKey);
                    } catch (oaiErr) {
                        console.error('[LLMAgent] OpenAI fallback error:', oaiErr);
                        openAiErrorMsg = oaiErr.message;
                    }
                }
            }
        } else if (activeProvider === 'openai' && openAIKey) {
            try {
                return await this.chatOpenAI(history, userMessage, openAIKey);
            } catch (oaiErr) {
                console.error('[LLMAgent] OpenAI chat error:', oaiErr);
                openAiErrorMsg = oaiErr.message;
                if (geminiKey) {
                    try {
                        return await this.chatGemini(history, userMessage, geminiKey);
                    } catch (geminiErr) {
                        console.error('[LLMAgent] Gemini fallback error:', geminiErr);
                        geminiErrorMsg = geminiErr.message;
                    }
                }
            }
        }

        // 2. Fallback to Local Semantic & Tool Engine
        return await this.chatLocalEmpathetic(userMessage, Boolean(geminiKey || openAIKey), geminiErrorMsg || openAiErrorMsg);
    }

    /**
     * OpenAI GPT-4o-mini / GPT-4o with Native Tool Calling & Streaming
     */
    async chatOpenAI(history, userMessage, key) {
        const messages = [
            { role: 'system', content: this.getSystemPrompt() }
        ];

        // Append recent conversation history (last 6 messages)
        const recentHistory = (history || []).slice(-6);
        for (const item of recentHistory) {
            messages.push({
                role: item.sender === 'user' ? 'user' : 'assistant',
                content: item.text
            });
        }
        messages.push({ role: 'user', content: userMessage });

        const tools = this.getToolsSchema();

        // First round: Send to OpenAI
        const response = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${key}`
            },
            body: JSON.stringify({
                model: this.openaiModel,
                messages,
                tools,
                tool_choice: 'auto',
                temperature: 0.7
            })
        });

        if (!response.ok) {
            const errData = await response.json().catch(() => ({}));
            throw new Error(errData.error?.message || `OpenAI API Error: ${response.status}`);
        }

        const result = await response.json();
        const message = result.choices[0].message;

        // Check if OpenAI wants to call tools
        if (message.tool_calls && message.tool_calls.length > 0) {
            messages.push(message);

            let toolDisplayData = null;

            for (const toolCall of message.tool_calls) {
                const fnName = toolCall.function.name;
                const fnArgs = JSON.parse(toolCall.function.arguments || '{}');
                const toolResult = await this.executeToolCall(fnName, fnArgs);

                if (toolResult && !toolResult.error) {
                    toolDisplayData = toolResult;
                }

                messages.push({
                    role: 'tool',
                    tool_call_id: toolCall.id,
                    content: JSON.stringify(toolResult)
                });
            }

            // Second round: Get final conversational response incorporating tool data
            const finalResponse = await fetch('https://api.openai.com/v1/chat/completions', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${key}`
                },
                body: JSON.stringify({
                    model: this.openaiModel,
                    messages,
                    temperature: 0.7
                })
            });

            const finalResult = await finalResponse.json();
            const spokenText = finalResult.choices[0].message.content;
            return { spoken: spokenText, data: toolDisplayData };
        }

        return { spoken: message.content, data: null };
    }

    /**
     * Google Gemini Flash with Native Tool Calling and Multi-Model Fallback
     */
    async chatGemini(history, userMessage, key) {
        const cleanKey = String(key || '').trim();
        if (!cleanKey) {
            throw new Error('জেমিনি এআই কী পাওয়া যায়নি');
        }

        const modelsToTry = [this.geminiModel, 'gemini-flash-latest', 'gemini-3.5-flash', 'gemini-3.7-flash', 'gemini-flash-lite-latest', 'gemini-3.6-flash'];
        const candidateModels = [...new Set(modelsToTry.filter(Boolean))];

        // Detect emotion and pass to system prompt
        const emotion = this.detectEmotion(userMessage);
        this.currentEmotion = emotion;

        const systemInstruction = {
            parts: [{ text: this.getSystemPrompt(emotion) }]
        };

        // Strict Gemini multiturn formatting
        const cleanTurns = [];
        const rawHistory = (history || []).slice(-8);

        for (const item of rawHistory) {
            const role = item.sender === 'user' ? 'user' : 'model';
            const text = String(item.text || '').replace(/[*_#`]/g, '').trim();
            if (!text) continue;

            // Merge consecutive turns with identical role to satisfy Gemini requirements
            if (cleanTurns.length > 0 && cleanTurns[cleanTurns.length - 1].role === role) {
                cleanTurns[cleanTurns.length - 1].parts[0].text += '\n' + text;
            } else {
                cleanTurns.push({ role, parts: [{ text }] });
            }
        }

        // Gemini rule: First turn MUST be 'user'
        while (cleanTurns.length > 0 && cleanTurns[0].role !== 'user') {
            cleanTurns.shift();
        }

        // Add current user message
        const currentMsg = String(userMessage || '').trim();
        if (cleanTurns.length > 0 && cleanTurns[cleanTurns.length - 1].role === 'user') {
            cleanTurns[cleanTurns.length - 1].parts[0].text += '\n' + currentMsg;
        } else {
            cleanTurns.push({ role: 'user', parts: [{ text: currentMsg }] });
        }

        // Gemini Function Declarations
        const geminiTools = [{
            functionDeclarations: this.getToolsSchema().map(t => {
                const props = t.function.parameters.properties || {};
                const uppercaseProps = {};
                for (const [propKey, val] of Object.entries(props)) {
                    uppercaseProps[propKey] = {
                        type: (val.type || 'STRING').toUpperCase(),
                        description: val.description || ''
                    };
                    if (val.enum) uppercaseProps[propKey].enum = val.enum;
                }
                return {
                    name: t.function.name,
                    description: t.function.description,
                    parameters: {
                        type: 'OBJECT',
                        properties: uppercaseProps,
                        required: t.function.parameters.required || []
                    }
                };
            })
        }];

        let response = null;
        let activeModel = this.geminiModel;
        let lastErrData = null;

        for (const model of candidateModels) {
            const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${cleanKey}`;
            try {
                const res = await fetch(url, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        system_instruction: systemInstruction,
                        contents: cleanTurns,
                        tools: geminiTools
                    })
                });

                if (res.ok) {
                    response = res;
                    activeModel = model;
                    this.geminiModel = model;
                    if (typeof window !== 'undefined') {
                        localStorage.setItem('jarvis_gemini_model', model);
                    }
                    break;
                }

                lastErrData = await res.json().catch(() => ({}));
                console.warn(`[LLMAgent] Gemini model ${model} returned error:`, lastErrData);

                // If not found, busy, or rate-limited (429), continue to next candidate model!
                if (res.status === 404 || res.status === 503 || res.status === 429) {
                    continue;
                }

                // If tools payload was rejected (e.g. 400), try fallback below
                response = res;
                activeModel = model;
                break;
            } catch (fetchErr) {
                console.error(`[LLMAgent] Fetch error with model ${model}:`, fetchErr);
            }
        }

        if (!response || !response.ok) {
            // Fallback attempt: Try pure conversational without tools on multiple models
            for (const fallbackModel of ['gemini-flash-latest', 'gemini-3.5-flash', 'gemini-3.7-flash', 'gemini-flash-lite-latest']) {
                try {
                    const fallbackUrl = `https://generativelanguage.googleapis.com/v1beta/models/${fallbackModel}:generateContent?key=${cleanKey}`;
                    const simpleResp = await fetch(fallbackUrl, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            system_instruction: systemInstruction,
                            contents: cleanTurns
                        })
                    });
                    if (simpleResp.ok) {
                        const simpleResult = await simpleResp.json();
                        const parts = simpleResult.candidates?.[0]?.content?.parts || [];
                        const textPart = parts.find(p => p.text);
                        if (textPart?.text) {
                            return { spoken: textPart.text, data: null };
                        }
                    }
                } catch (simpleFetchErr) {
                    console.error(`[LLMAgent] Fallback error with ${fallbackModel}:`, simpleFetchErr);
                }
            }

            const errMsg = lastErrData?.error?.message || 'গুগল সার্ভার এই মুহূর্তে কিছুটা ব্যস্ত রয়েছে।';
            throw new Error(errMsg);
        }

        const result = await response.json();
        const candidate = result.candidates?.[0]?.content;
        const functionCallPart = candidate?.parts?.find(p => p.functionCall);

        if (functionCallPart) {
            const { name, args } = functionCallPart.functionCall;
            const toolResult = await this.executeToolCall(name, args || {});

            cleanTurns.push(candidate);
            cleanTurns.push({
                role: 'user',
                parts: [{
                    functionResponse: {
                        name,
                        response: { name, content: toolResult }
                    }
                }]
            });

            // Second round with function result
            let secondResp;
            try {
                secondResp = await fetch(activeUrl, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        system_instruction: systemInstruction,
                        contents: cleanTurns
                    })
                });
            } catch (secErr) {
                console.error('[LLMAgent] Second round error:', secErr);
            }

            if (secondResp && secondResp.ok) {
                const secondResult = await secondResp.json();
                const secParts = secondResult.candidates?.[0]?.content?.parts || [];
                const textPart = secParts.find(p => p.text);
                const spoken = textPart?.text || 'জি ভাইয়া, হিসাবটি যাচাই করেছি।';
                return { spoken, data: toolResult };
            }
        }

        const parts = candidate?.parts || [];
        const textPart = parts.find(p => p.text);
        const spoken = textPart?.text || 'জি ভাইয়া, আমি আপনার নির্দেশ অনুযায়ী হিসাব দেখতে প্রস্তুত আছি।';
        return { spoken, data: null };
    }

    /**
     * Empathetic Local Fallback (When API key has errors or is not yet configured)
     */
    async chatLocalEmpathetic(text, hasKey = false, errorMsg = '') {
        const lower = text.toLowerCase();

        // 0. Natural Greetings & Wake Word conversational responses
        if (/হ্যালো|হাই|hello|hi|নমস্কার|সালাম|জার্ভিস|শুনছো|আছো/.test(lower)) {
            const timeGreeting = this.getTimeGreeting();
            return {
                spoken: `${timeGreeting} ভাইয়া! আসসালামু আলাইকুম। আমি জার্ভিস। আপনার মা মোটরসের যাবতীয় কাস্টমার বকেয়া, ক্যাশ স্থিতি ও ব্যাংকের হিসাব দেখতে আমি সম্পূর্ণ প্রস্তুত আছি। বলুন ভাইয়া, কীভাবে সাহায্য করবো?`,
                data: null
            };
        }

        // 1. Emotion / Sentiment Detection
        if (lower.includes('মেজাজ খারাপ') || lower.includes('বিরক্ত') || lower.includes('মন খারাপ') || lower.includes('কষ্ট') || lower.includes('চাপ')) {
            return {
                spoken: 'জি ভাইয়া, বুঝতে পারছি। ব্যবসা চালাতে গেলে এমন মানসিক চাপ আসা খুবই স্বাভাবিক। আপনি চিন্তা করবেন না, আমরা ঠান্ডা মাথায় হিসাবগুলো দেখে সব ঠিক করে নেবো।',
                data: null
            };
        }

        if (lower.includes('কেমন আছো') || lower.includes('কেমন আছেন') || lower.includes('কি খবর') || lower.includes('হালচাল')) {
            return {
                spoken: 'আলহামদুলিল্লাহ ভাইয়া, আমি একদম প্রস্তুত আছি! আপনার মা মোটরসের যাবতীয় হিসাব ও লেজার সার্বক্ষণিক আমার নজরে রয়েছে। বলুন ভাইয়া, কীভাবে সাহায্য করবো?',
                data: null
            };
        }

        // 2. Today's Bank Collections (কাদের কাদের টাকা ব্যাংকে জমা হলো)
        if (/কাদের.*ব্যাংক|ব্যাংকে.*কাদের|কারা.*ব্যাংক|ব্যাংকে.*কারা|আজকে.*ব্যাংক|ব্যাংকে.*জমা/i.test(lower) && !/সপ্তাহ|মাস|বছর/i.test(lower)) {
            const res = await this.executeToolCall('get_today_bank_collections', {});
            if (res?.authRequired) {
                return {
                    spoken: 'জি ভাইয়া, আজকের ব্যাংকে জমার হিসাব দেখতে প্রথমে উপরের "গুগল লগইন" বাটনে ক্লিক করে সাইন ইন করুন।',
                    data: { authRequired: true }
                };
            }
            if (res && res.success) {
                if (res.customerDepositsCount === 0 && (!res.directDeposits || res.directDeposits.length === 0)) {
                    return {
                        spoken: 'জি ভাইয়া, আজকে এখনো পর্যন্ত কোনো কাস্টমার ব্যাংকে টাকা জমা দেয়নি।',
                        data: res
                    };
                }
                const sampleList = res.customerDeposits.slice(0, 3).map(c => `${c.customerName} (${c.bankName}-এ ${c.amount.toLocaleString('bn-BD')} টাকা)`).join(', ');
                const extra = res.customerDepositsCount > 3 ? ` এবং আরও ${res.customerDepositsCount - 3} জন` : '';
                return {
                    spoken: `জি ভাইয়া! আজকে আমাদের বিভিন্ন ব্যাংকে সর্বমোট ${res.totalBankDeposit.toLocaleString('bn-BD')} টাকা জমা হয়েছে। যারা জমা দিয়েছেন: ${sampleList}${extra}।`,
                    data: res
                };
            }
        }

        // 3. Weekly / Multi-day Bank Summary (গত এক সপ্তাহে কোন ব্যাংকে কত জমা)
        if (/সপ্তাহ|৭ দিন|সাপ্তাহিক/i.test(lower) && /ব্যাংক|জমা|কালেকশন/i.test(lower)) {
            const res = await this.executeToolCall('get_weekly_bank_summary', { days: 7 });
            if (res?.authRequired) {
                return {
                    spoken: 'জি ভাইয়া, গত সপ্তাহের ব্যাংক ডিপোজিট দেখতে প্রথমে গুগল অ্যাকাউন্টে সাইন ইন করুন।',
                    data: { authRequired: true }
                };
            }
            if (res && res.success) {
                if (res.bankList.length === 0) {
                    return {
                        spoken: 'জি ভাইয়া, গত এক সপ্তাহে ব্যাংকে কোনো জমার রেকর্ড পাওয়া যায়নি।',
                        data: res
                    };
                }
                const bankLines = res.bankList.map(b => `${b.bankName}-এ ${b.totalAmount.toLocaleString('bn-BD')} টাকা`).join(', ');
                return {
                    spoken: `জি ভাইয়া! গত এক সপ্তাহে আমাদের ব্যাংকগুলোতে সর্বমোট ${res.grandTotalBankDeposits.toLocaleString('bn-BD')} টাকা জমা হয়েছে। এর মধ্যে: ${bankLines}।`,
                    data: res
                };
            }
        }

        // 4. Executive Daily Business Pulse (আজকের বিক্রি, কালেকশন ও নিট ক্যাশ ফ্লো)
        if (/আজকের.*বিক্রি|আজকের.*সেল|আজকে.*কত.*বিক্রি|আজকের.*চালান|আজকে.*কত.*চালান|ব্যবসায়িক.*নাড়ি|বিজনেস.*পালস/i.test(lower)) {
            const res = await this.executeToolCall('get_executive_business_pulse', {});
            if (res?.authRequired) {
                return {
                    spoken: 'জি ভাইয়া, আজকের ব্যবসার নাড়ির স্পন্দন দেখতে মা মোটরসের অ্যাকাউন্টে সাইন ইন করুন।',
                    data: { authRequired: true }
                };
            }
            if (res && res.success) {
                return {
                    spoken: `জি ভাইয়া! আজকে মা মোটরসে মোট বিক্রি হয়েছে ${res.todayTotalBills.toLocaleString('bn-BD')} টাকা। মোট কালেকশন এসেছে ${res.todayTotalCollections.toLocaleString('bn-BD')} টাকা (ক্যাশ: ${res.cashCollections.toLocaleString('bn-BD')}, ব্যাংক: ${res.bankCollections.toLocaleString('bn-BD')})। মোট খরচ হয়েছে ${res.todayTotalExpenses.toLocaleString('bn-BD')} টাকা। আজকের নিট ক্যাশ ফ্লো হলো ${res.todayNetCashFlow.toLocaleString('bn-BD')} টাকা।`,
                    data: res
                };
            }
        }

        // 5. Top Debtors & Market Outstanding (টপ বাকিদার ও মার্কেট বকেয়া)
        if (/টপ.*বাকি|বড়.*বাকি|মার্কেটে.*বাকি|বেশি.*বাকি|বাকিদার.*কারা|টপ.*দেনাদার/i.test(lower)) {
            const res = await this.executeToolCall('get_top_debtors_and_market_analytics', { limit: 5 });
            if (res?.authRequired) {
                return {
                    spoken: 'জি ভাইয়া, টপ বাকিদারদের তালিকা দেখতে মা মোটরসের অ্যাকাউন্টে সাইন ইন করুন।',
                    data: { authRequired: true }
                };
            }
            if (res && res.success) {
                const names = res.topDebtors.map(d => `${d.name} (${d.totalDue.toLocaleString('bn-BD')} টাকা)`).join(', ');
                return {
                    spoken: `জি ভাইয়া! বর্তমানে মার্কেটের মোট অবশিষ্ট বকেয়া হলো ${res.totalMarketDue.toLocaleString('bn-BD')} টাকা। শীর্ষ ৫ জন বাকিদার হলেন: ${names}।`,
                    data: res
                };
            }
        }

        // 6. Daily Expenses (আজকের খরচের হিসাব)
        if (/আজকে.*কত.*খরচ|আজকের.*খরচ|খরচের.*হিসাব|মোট.*খরচ/i.test(lower) && !/দুবাই/i.test(lower)) {
            const res = await this.executeToolCall('get_daily_expenses', {});
            if (res?.authRequired) {
                return {
                    spoken: 'জি ভাইয়া, আজকের খরচের তালিকা দেখতে মা মোটরসের অ্যাকাউন্টে সাইন ইন করুন।',
                    data: { authRequired: true }
                };
            }
            if (res && res.success) {
                return {
                    spoken: `জি ভাইয়া! আজকে আমাদের মোট অফিস খরচ হয়েছে ${res.totalExpense.toLocaleString('bn-BD')} টাকা (${res.itemsCount}টি ভাউচারে)।`,
                    data: res
                };
            }
        }

        // 7. Dubai Container Audit (দুবাই কন্টেইনার ও এইডি ক্যাশ)
        if (/দুবাই|aed|দিরহাম|কন্টেইনার/i.test(lower)) {
            const res = await this.executeToolCall('get_dubai_container_status', {});
            if (res?.authRequired) {
                return {
                    spoken: 'জি ভাইয়া, দুবাই অডিটের হিসাব দেখতে মা মোটরসের অ্যাকাউন্টে সাইন ইন করুন।',
                    data: { authRequired: true }
                };
            }
            if (res && res.success) {
                return {
                    spoken: `জি ভাইয়া! দুবাই কন্টেইনার অডিটের সর্বশেষ রিপোর্ট অনুযায়ী নগদ ক্যাশ রয়েছে ${res.cashInHandAED.toLocaleString('en-US')} এইডি (AED), মার্কেট এডভান্স রয়েছে ${res.marketAdvanceAED.toLocaleString('en-US')} এইডি এবং মোট ফিজিক্যাল এসেট হলো ${res.totalPhysicalAssetsAED.toLocaleString('en-US')} এইডি।`,
                    data: res
                };
            }
        }

        // 8. Master Treasury Status (কেন্দ্রীয় ট্রেজারি ফান্ড)
        if (/ট্রেজারি|৪ কোটি|মাস্টার ফান্ড|সেন্ট্রাল ফান্ড/i.test(lower)) {
            const res = await this.executeToolCall('get_master_treasury_status', {});
            if (res?.authRequired) {
                return {
                    spoken: 'জি ভাইয়া, মাস্টার ট্রেজারি ফান্ডের ব্যালেন্স দেখতে অ্যাকাউন্টে সাইন ইন করুন।',
                    data: { authRequired: true }
                };
            }
            if (res && res.success) {
                return {
                    spoken: `জি ভাইয়া! মা মোটরসের মাস্টার ট্রেজারি ফান্ডের বর্তমান ব্যালেন্স হলো ${res.currentTreasuryBalance.toLocaleString('bn-BD')} টাকা।`,
                    data: res
                };
            }
        }

        // 9. Voucher / Invoice Search
        const voucherMatch = text.match(/(?:ভাউচার|চালান|ইনভয়েস|inv|voucher)[\s#:-]*([0-9a-zA-Z-]+)/i);
        if (voucherMatch && voucherMatch[1]) {
            const vNo = voucherMatch[1].trim();
            const res = await this.executeToolCall('search_voucher_or_invoice', { voucherNo: vNo });
            if (res?.authRequired) {
                return {
                    spoken: 'জি ভাইয়া, ভাউচার দেখতে মা মোটরসের অ্যাকাউন্টে সাইন ইন করুন।',
                    data: { authRequired: true }
                };
            }
            if (res && res.found && res.records && res.records.length > 0) {
                const rec = res.records[0];
                const action = rec.bill > 0 ? `বিল/চালান: ${rec.bill.toLocaleString('bn-BD')} টাকা` : `জমা: ${rec.paid.toLocaleString('bn-BD')} টাকা (${rec.receivedType || 'ক্যাশ'})`;
                return {
                    spoken: `জি ভাইয়া! ভাউচার নং ${rec.voucherNo} হলো কাস্টমার ${rec.customerName}-এর। তারিখ: ${rec.date}, ${action}।`,
                    data: res
                };
            }
        }

        // 10. Customer Due, Ledger & Accounting Search Check
        if (text.includes('বকেয়া') || text.includes('বাকী') || text.includes('হিসাব') || text.includes('ব্যালেন্স') || text.includes('টাকা') || text.includes('লেজার') || text.includes('চালান')) {
            const cleanQuery = text.replace(/(কাস্টমার|সাহেবের|ভাইয়ের|এর|বকেয়া|বাকী|হিসাব|ব্যালেন্স|কত|বলো|জানাও|দেখাও|টাকা|লেজার|চালান)/g, '').trim();
            const res = await this.executeToolCall('get_customer_due', { query: cleanQuery || text });
            
            if (res.authRequired) {
                return {
                    spoken: 'জি ভাইয়া, মা মোটরসের কাস্টমার বকেয়া ও লাইভ হিসাব দেখতে প্রথমে উপরের "গুগল লগইন" বাটনে চাপ দিয়ে আপনার অনুমোদিত একাউন্টে সাইন ইন করে নিন।',
                    data: { authRequired: true }
                };
            }
            if (res.found) {
                const addressStr = res.address ? ` (${res.address})` : '';
                return {
                    spoken: `জি ভাইয়া, আমি চেক করেছি। ${res.name}${addressStr}-এর বর্তমান অবশিষ্ট বকেয়া হলো ${res.totalDue.toLocaleString('bn-BD')} টাকা।`,
                    data: res
                };
            } else {
                return {
                    spoken: `জি ভাইয়া, "${cleanQuery || text}" নামে কোনো কাস্টমার বা দোকান মা মোটরসের ডেটাবেজে খুঁজে পাওয়া যায়নি। কাস্টমারের নাম, দোকান বা এলাকা একটু স্পষ্ট করে বললে আমি সাথে সাথে সঠিক হিসাবটি বের করে দেবো।`,
                    data: null
                };
            }
        }

        // 11. Cash & Bank Status
        if (text.includes('ক্যাশ') || text.includes('ব্যাংক') || text.includes('টাকা জমা') || text.includes('কালেকশন')) {
            const res = await this.executeToolCall('get_cash_and_bank_status', { detail: 'summary' });
            if (res?.authRequired) {
                return {
                    spoken: 'জি ভাইয়া, ক্যাশ ও ব্যাংকের লাইভ হিসাব দেখতে মা মোটরসের অনুমোদিত একাউন্টে সাইন ইন করে নিন।',
                    data: { authRequired: true }
                };
            }
            if (res && res.success) {
                return {
                    spoken: `জি ভাইয়া! বর্তমানে আমাদের ক্যাশ ইন হ্যান্ড রয়েছে ${res.totalPhysicalCash.toLocaleString('bn-BD')} টাকা এবং ব্যাংকে মোট ব্যালেন্স রয়েছে ${res.totalBankBalance.toLocaleString('bn-BD')} টাকা। মোট ফান্ড হলো ${res.totalHoldings.toLocaleString('bn-BD')} টাকা।`,
                    data: res
                };
            }
        }

        // 12. Direct Name / Shop Search fallback (e.g., user just spoke a customer/shop name)
        if (text.length >= 3 && !text.includes('?') && !text.includes('কি') && !text.includes('কেন')) {
            const directSearch = await this.executeToolCall('get_customer_due', { query: text });
            if (directSearch?.authRequired) {
                return {
                    spoken: 'জি ভাইয়া, কাস্টমারের তথ্য ও বকেয়া হিসাব দেখার জন্য মা মোটরস গুগল একাউন্টে সাইন ইন করে নিন।',
                    data: { authRequired: true }
                };
            }
            if (directSearch && directSearch.found) {
                const addressStr = directSearch.address ? ` (${directSearch.address})` : '';
                return {
                    spoken: `জি ভাইয়া, ${directSearch.name}${addressStr}-এর বর্তমান অবশিষ্ট বকেয়া হলো ${directSearch.totalDue.toLocaleString('bn-BD')} টাকা।`,
                    data: directSearch
                };
            }
        }

        // 4. If key was provided but an error occurred
        if (hasKey && errorMsg) {
            let friendlyMsg = 'গুগল এআই সার্ভার এই মুহূর্তে কিছুটা ব্যস্ত রয়েছে।';
            if (errorMsg.includes('quota') || errorMsg.includes('limit') || errorMsg.includes('429')) {
                friendlyMsg = 'গুগলের ফ্রি এআই কোটা সাময়িকভাবে বিরতিতে আছে।';
            } else if (errorMsg.includes('API key') || errorMsg.includes('INVALID_ARGUMENT')) {
                friendlyMsg = 'এআই কী-টি সঠিক নয় বলে মনে হচ্ছে।';
            }
            return {
                spoken: `জি ভাইয়া, ${friendlyMsg} তবে মা মোটরসের কাস্টমার বকেয়া, মেমো বা ক্যাশ রিপোর্ট দেখতে আমি সম্পূর্ণ প্রস্তুত আছি। বলুন কার হিসাব দেখবেন?`,
                data: null
            };
        }

        // 5. Fallback with Guidance
        return {
            spoken: 'জি ভাইয়া, আমি আপনার কথা শুনেছি। আপনি মা মোটরসের যেকোনো কাস্টমারের বকেয়া, ক্যাশ বা ব্যাংকের হিসাব সরাসরি জানতে পারেন। বলুন কীভাবে সাহায্য করবো?',
            data: null
        };
    }
}

export const llmAgent = new LLMAgent();

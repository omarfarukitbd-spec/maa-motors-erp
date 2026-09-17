import { ERPBridge, parseRelativeBengaliDate, getTodayLocalDateString, parseBanglaOrEnglishNumber } from '../bridge/erp_bridge.js';
import { memoryVault } from './memory_vault.js';
import { disambiguationManager } from './disambiguation_manager.js';

/**
 * 🧠 World-Class Cognitive LLM Agent (OpenAI & Gemini)
 * Equipped with Bangladeshi Emotional Intelligence, Business Acumen, and ERP Tool Execution.
 */
export class LLMAgent {
    constructor() {
        const hasOpenAI = typeof window !== 'undefined' && Boolean((localStorage.getItem('jarvis_openai_key') || '').trim());
        const hasGemini = typeof window !== 'undefined' && Boolean((localStorage.getItem('jarvis_gemini_key') || localStorage.getItem('jarvis_gemini_keys') || '').trim());
        const hasGroq = typeof window !== 'undefined' && Boolean((localStorage.getItem('jarvis_groq_key') || localStorage.getItem('jarvis_groq_keys') || '').trim());
        const hasOpenRouter = typeof window !== 'undefined' && Boolean((localStorage.getItem('jarvis_openrouter_key') || localStorage.getItem('jarvis_openrouter_keys') || '').trim());
        const savedProvider = typeof window !== 'undefined' ? localStorage.getItem('jarvis_ai_provider') : null;

        if (savedProvider) {
            this.provider = savedProvider;
        } else if (hasGemini) {
            this.provider = 'gemini';
        } else if (hasGroq) {
            this.provider = 'groq';
        } else if (hasOpenRouter) {
            this.provider = 'openrouter';
        } else if (hasOpenAI) {
            this.provider = 'openai';
        } else {
            this.provider = 'gemini';
        }

        this.openaiModel = (typeof window !== 'undefined' && localStorage.getItem('jarvis_openai_model')) || 'gpt-4o-mini';
        this.geminiModel = (typeof window !== 'undefined' && localStorage.getItem('jarvis_gemini_model')) || 'gemini-2.0-flash';
        this.groqModel = (typeof window !== 'undefined' && localStorage.getItem('jarvis_groq_model')) || 'llama-3.3-70b-versatile';
        this.openrouterModel = (typeof window !== 'undefined' && localStorage.getItem('jarvis_openrouter_model')) || 'meta-llama/llama-3.3-70b-instruct:free';

        this.currentEmotion = 'neutral';
        this.keyCooldowns = new Map(); // key -> cooldownTimestamp
        this.lastActiveProvider = this.provider;
    }

    /**
     * Retrieve all keys for a specific provider (supports comma/newline delimited key pool)
     */
    getKeys(provider) {
        if (typeof window === 'undefined') return [];
        let raw = '';
        if (provider === 'gemini') {
            raw = localStorage.getItem('jarvis_gemini_keys') || localStorage.getItem('jarvis_gemini_key') || '';
        } else if (provider === 'groq') {
            raw = localStorage.getItem('jarvis_groq_keys') || localStorage.getItem('jarvis_groq_key') || '';
        } else if (provider === 'openrouter') {
            raw = localStorage.getItem('jarvis_openrouter_keys') || localStorage.getItem('jarvis_openrouter_key') || '';
        } else if (provider === 'cerebras') {
            raw = localStorage.getItem('jarvis_cerebras_keys') || localStorage.getItem('jarvis_cerebras_key') || '';
        } else if (provider === 'openai') {
            raw = localStorage.getItem('jarvis_openai_keys') || localStorage.getItem('jarvis_openai_key') || '';
        }
        return raw
            .split(/[\n,;]+/)
            .map(k => k.trim())
            .filter(k => k.length > 5);
    }

    /**
     * Get available keys for a provider that are not currently rate-limited/cooldown
     */
    getAvailableKeys(provider) {
        const allKeys = this.getKeys(provider);
        if (allKeys.length === 0) return [];
        const now = Date.now();
        const available = allKeys.filter(k => {
            const cooldown = this.keyCooldowns.get(k) || 0;
            return now > cooldown;
        });
        // If all keys for this provider are in cooldown, reset cooldowns and retry
        if (available.length === 0 && allKeys.length > 0) {
            allKeys.forEach(k => this.keyCooldowns.delete(k));
            return allKeys;
        }
        return available;
    }

    markKeyCooldown(key, durationMs = 60000) {
        if (!key) return;
        this.keyCooldowns.set(key, Date.now() + durationMs);
    }

    isQuotaOrRateLimitError(err) {
        const status = err?.status || 0;
        const msg = String(err?.message || '').toLowerCase();
        return (
            status === 429 ||
            status === 402 ||
            status === 401 ||
            msg.includes('rate limit') ||
            msg.includes('quota') ||
            msg.includes('resource exhausted') ||
            msg.includes('too many requests') ||
            msg.includes('credits') ||
            msg.includes('busy')
        );
    }

    getApiKey() {
        const keys = this.getAvailableKeys(this.provider);
        return keys.length > 0 ? keys[0] : '';
    }

    hasApiKey() {
        const providers = ['gemini', 'groq', 'openrouter', 'cerebras', 'openai'];
        return providers.some(p => this.getKeys(p).length > 0);
    }

    setProvider(provider, key = null) {
        this.provider = provider;
        localStorage.setItem('jarvis_ai_provider', provider);
        if (key !== null) {
            const trimmed = key.trim();
            if (provider === 'gemini') localStorage.setItem('jarvis_gemini_key', trimmed);
            else if (provider === 'groq') localStorage.setItem('jarvis_groq_key', trimmed);
            else if (provider === 'openrouter') localStorage.setItem('jarvis_openrouter_key', trimmed);
            else if (provider === 'openai') localStorage.setItem('jarvis_openai_key', trimmed);
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
৬. রিভার্স অ্যামাউন্ট ও রেফারেন্স অনুসন্ধান (Reverse Amount & Reference Lookup):
   - ইউজার যদি কোনো টাকার অঙ্ক দিয়ে জানতে চায় "এটা কোন একাউন্ট?" বা "৫,৫০০ টাকা কার?", অথবা পূর্বের বার্তার প্রেক্ষিতে রেফারেন্স করে "এটা কার / এটা কোন একাউন্ট", তবে 'search_by_amount_or_reference' টুল ব্যবহার করে অ্যাকাউন্ট বা ট্রানজেকশন বের করবে।
৭. সাধারণ ব্যবসায়িক পরিসংখ্যান (General Demographics):
   - মোট কাস্টমার সংখ্যা, কতজন দেনাদার, কতজনের অগ্রিম জমা, বকেয়ামুক্ত বা জিরো ব্যালেন্স কাস্টমার অথবা কয়টি সক্রিয় ব্যাংক অ্যাকাউন্ট আছে জানতে 'get_business_demographics' টুল ব্যবহার করবে।
৮. কাস্টমারের নির্দিষ্ট তথ্য (Customer Attributes):
   - কাস্টমারের ফোন নম্বর, ঠিকানা, একাউন্ট নম্বর, শেষ চালান বা শেষ পেমেন্ট জানতে 'get_customer_attribute' বা 'get_customer_360_profile' ব্যবহার করবে।

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
                    name: 'get_today_showroom_cash_collections',
                    description: 'আজকে বা নির্দিষ্ট তারিখে শোরুম ক্যাশে কাস্টমারদের থেকে নগদ কত টাকা জমা হয়েছে, কোন কোন কাস্টমার ক্যাশ জমা দিয়েছে এবং ক্যাশ থেকে কত খরচ হয়ে নিট ক্যাশ কত দাঁড়িয়েছে তা জানতে এটি কল করো।',
                    parameters: {
                        type: 'object',
                        properties: {
                            targetDate: {
                                type: 'string',
                                description: 'তারিখ YYYY-MM-DD ফরম্যাটে (ঐচ্ছিক, না দিলে আজকের দিনের শোরুম ক্যাশ দেখাবে)'
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
            },
            {
                type: 'function',
                function: {
                    name: 'get_all_bank_running_balances',
                    description: 'মা মোটরসের প্রতিটি ব্যাংক অ্যাকাউন্টের (IBBL, OneBank, DBBL ইত্যাদি) বর্তমান লাইভ অবশিষ্ট ব্যালেন্স এবং শোরুমের ক্যাশ ইন হ্যান্ড স্থিতি জানতে এটি কল করো।',
                    parameters: {
                        type: 'object',
                        properties: {
                            detail: { type: 'string', description: 'ঐচ্ছিক ফিল্টার' }
                        }
                    }
                }
            },
            {
                type: 'function',
                function: {
                    name: 'get_zone_wise_analytics',
                    description: 'এলাকা বা জোন অনুযায়ী (যেমন: চট্টগ্রাম, ঢাকা, নোয়াখালী) মোট বকেয়া, কাস্টমার সংখ্যা ও সেরা কাস্টমারের তালিকা জানতে এটি কল করো।',
                    parameters: {
                        type: 'object',
                        properties: {
                            zone: { type: 'string', description: 'নির্দিষ্ট জোনের নাম (ঐচ্ছিক)' }
                        }
                    }
                }
            },
            {
                type: 'function',
                function: {
                    name: 'get_dormant_customers',
                    description: 'যেসব কাস্টমারের বকেয়া রয়েছে কিন্তু বিগত ৩০/৬০/৯০ দিন ধরে কোনো টাকা জমা দেননি (অলস বা ঝুঁকিপূর্ণ বাকিদার) তাদের তালিকা জানতে এটি কল করো।',
                    parameters: {
                        type: 'object',
                        properties: {
                            days: { type: 'number', description: 'কত দিনের অলস কাস্টমার (ডিফল্ট ৩০ দিন)' }
                        }
                    }
                }
            },
            {
                type: 'function',
                function: {
                    name: 'get_total_market_summary',
                    description: 'পুরো মার্কেটের মোট বকেয়া, অগ্রিম জমার মোট পরিমাণ এবং মোট কাস্টমারদের আর্থিক পোর্টফোলিও সারসংক্ষেপ জানতে এটি কল করো।',
                    parameters: {
                        type: 'object',
                        properties: {
                            type: { type: 'string', description: 'পোর্টফোলিও টাইপ' }
                        }
                    }
                }
            },
            {
                type: 'function',
                function: {
                    name: 'get_category_expense_breakdown',
                    description: 'ব্যবসার বিভিন্ন খাতের (যেমন: গাড়ি ভাড়া/যাতায়াত, স্টাফ বেতন, নাস্তা/আপ্যায়ন, অফিস ভাড়া) খরচ ও সর্বোচ্চ খরচের খাত বিশ্লেষণ করতে এটি কল করো।',
                    parameters: {
                        type: 'object',
                        properties: {
                            days: { type: 'number', description: 'কত দিনের খরচের বিশ্লেষণ (ডিফল্ট ৩০ দিন)' }
                        }
                    }
                }
            },
            {
                type: 'function',
                function: {
                    name: 'get_ledger_math_audit_summary',
                    description: 'মা মোটরসের লেজার লেনদেনের গাণিতিক নির্ভুলতা ও কোনো ভুল এন্ট্রি আছে কিনা তা অডিট করতে এটি কল করো।',
                    parameters: {
                        type: 'object',
                        properties: {
                            sampleSize: { type: 'number', description: 'কতটি লেনদেন অডিট করবে (ডিফল্ট ১০০)' }
                        }
                    }
                }
            },
            {
                type: 'function',
                function: {
                    name: 'get_dubai_deep_custodian_holdings',
                    description: 'দুবাই কন্টেইনার অডিটের এমরান মামা, আলতাফ, জাবেদের কাছে থাকা নগদ দিরহামের (AED) হিসাব ও মেস ফান্ডের ব্যালেন্স জানতে এটি কল করো।',
                    parameters: {
                        type: 'object',
                        properties: {
                            detail: { type: 'string', description: 'বিশদ নাকি সংক্ষিপ্ত' }
                        }
                    }
                }
            },
            {
                type: 'function',
                function: {
                    name: 'get_period_sales_turnover',
                    description: 'এই মাসে, গত মাসে বা নির্দিষ্ট দিনে মোট কত টাকার মাল বিক্রি হয়েছে, কতগুলো চালান হয়েছে এবং দৈনিক গড় বিক্রি জানতে এটি কল করো।',
                    parameters: {
                        type: 'object',
                        properties: {
                            days: { type: 'number', description: 'কত দিনের বিক্রি (ডিফল্ট ৩০ দিন)' }
                        }
                    }
                }
            },
            {
                type: 'function',
                function: {
                    name: 'get_today_sales_invoices',
                    description: 'আজকে কার কার কাছে কত টাকার মাল বিক্রি হলো এবং কোন কোন চালান ইস্যু করা হয়েছে তা জানতে এটি কল করো।',
                    parameters: {
                        type: 'object',
                        properties: {
                            date: { type: 'string', description: 'তারিখ YYYY-MM-DD (ঐচ্ছিক)' }
                        }
                    }
                }
            },
            {
                type: 'function',
                function: {
                    name: 'get_top_buying_customers',
                    description: 'চলতি মাসে বা নির্দিষ্ট সময়ে সবচেয়ে বেশি টাকার মাল কিনেছেন এমন সেরা ক্রেতা কাস্টমারদের তালিকা জানতে এটি কল করো।',
                    parameters: {
                        type: 'object',
                        properties: {
                            limit: { type: 'number', description: 'কতজন ক্রেতা (ডিফল্ট ৫)' },
                            days: { type: 'number', description: 'কত দিনের হিসাব (ডিফল্ট ৩০)' }
                        }
                    }
                }
            },
            {
                type: 'function',
                function: {
                    name: 'get_collection_recovery_efficiency',
                    description: 'বিক্রির তুলনায় কত শতাংশ টাকা কালেকশন হলো (রিকভারি রেট ও শতকরা হার) তা জানতে এটি কল করো।',
                    parameters: {
                        type: 'object',
                        properties: {
                            days: { type: 'number', description: 'কত দিনের অনুপাত (ডিফল্ট ৩০ দিন)' }
                        }
                    }
                }
            },
            {
                type: 'function',
                function: {
                    name: 'get_advance_paying_customers',
                    description: 'যেসব কাস্টমারের কাছে কোম্পানির অতিরিক্ত টাকা অগ্রিম জমা আছে (নেগেটিভ বকেয়া) তাদের তালিকা ও মোট অগ্রিম পুঁজি জানতে এটি কল করো।',
                    parameters: {
                        type: 'object',
                        properties: {
                            limit: { type: 'number', description: 'কতজন দেখাবে (ডিফল্ট ১৫)' }
                        }
                    }
                }
            },
            {
                type: 'function',
                function: {
                    name: 'get_specific_bank_statement_summary',
                    description: 'নির্দিষ্ট কোনো ব্যাংকে (যেমন: ইসলামী ব্যাংক, ওয়ান ব্যাংক, ডাচ-বাংলা) কত টাকা জমা আসলো, কত টাকা খরচ হলো এবং বর্তমান ব্যালেন্স কত তা জানতে এটি কল করো।',
                    parameters: {
                        type: 'object',
                        properties: {
                            bankName: { type: 'string', description: 'ব্যাংকের নাম' },
                            days: { type: 'number', description: 'কত দিনের স্টেটমেন্ট (ডিফল্ট ৩০)' }
                        },
                        required: ['bankName']
                    }
                }
            },
            {
                type: 'function',
                function: {
                    name: 'get_top_inflow_bank',
                    description: 'সবচেয়ে বেশি টাকা কোন ব্যাংকে জমা হচ্ছে এবং সকল ব্যাংকের জমার তুলনামূলক র‍্যাংকিং জানতে এটি কল করো।',
                    parameters: {
                        type: 'object',
                        properties: {
                            days: { type: 'number', description: 'কত দিনের হিসাব (ডিফল্ট ৩০)' }
                        }
                    }
                }
            },
            {
                type: 'function',
                function: {
                    name: 'get_monthly_net_cashflow',
                    description: 'এই মাসে মোট কালেকশন থেকে মোট অফিস খরচ বাদ দিলে নিট কত টাকা ক্যাশ উদ্বৃত্ত বা ঘাটতি আছে তা জানতে এটি কল করো।',
                    parameters: {
                        type: 'object',
                        properties: {
                            days: { type: 'number', description: 'কত দিনের নিট ক্যাশফ্লো (ডিফল্ট ৩০)' }
                        }
                    }
                }
            },
            {
                type: 'function',
                function: {
                    name: 'get_historical_date_summary',
                    description: 'অতীতের নির্দিষ্ট কোনো দিনে (যেমন: গত পরশু দিন, গত রবিবার, ১০ তারিখে) কত টাকার বিক্রি, কালেকশন ও খরচ হয়েছিল তার পূর্ণাঙ্গ হিসাব জানতে এটি কল করো।',
                    parameters: {
                        type: 'object',
                        properties: {
                            targetDate: { type: 'string', description: 'তারিখ YYYY-MM-DD ফরম্যাটে' }
                        },
                        required: ['targetDate']
                    }
                }
            },
            {
                type: 'function',
                function: {
                    name: 'search_by_amount_or_reference',
                    description: 'নির্দিষ্ট কোনো টাকার অঙ্ক দিয়ে (যেমন: ৫,৫০০ টাকা অগ্রিম কোন একাউন্ট, কার বকেয়া ৫,৫০০ টাকা, অথবা ১০,০০০ টাকার ভাউচার কার) সংশ্লিষ্ট কাস্টমার বা লেনদেন খুঁজতে এটি কল করো।',
                    parameters: {
                        type: 'object',
                        properties: {
                            amount: { type: 'string', description: 'টাকার পরিমাণ (যেমন: 5500 বা "৫,৫০০")' },
                            hintType: { type: 'string', enum: ['advance', 'due', 'transaction', 'any'], description: 'অগ্রিম নাকি বকেয়া নাকি লেনদেন' }
                        },
                        required: ['amount']
                    }
                }
            },
            {
                type: 'function',
                function: {
                    name: 'get_customer_attribute',
                    description: 'নির্দিষ্ট কোনো কাস্টমারের ফোন নম্বর, ঠিকানা, অ্যাকাউন্ট নম্বর, শেষ চালান, শেষ পেমেন্ট বা আজীবন মোট কত টাকার মাল নিয়েছে তা সরাসরি জানতে এটি কল করো।',
                    parameters: {
                        type: 'object',
                        properties: {
                            customerName: { type: 'string', description: 'কাস্টমারের নাম বা অ্যাকাউন্ট নম্বর' },
                            attribute: { type: 'string', enum: ['phone', 'address', 'accountNo', 'lastBill', 'lastPayment', 'totals', 'all'], description: 'কোন তথ্য জানতে চায়' }
                        },
                        required: ['customerName']
                    }
                }
            },
            {
                type: 'function',
                function: {
                    name: 'get_business_demographics',
                    description: 'মা মোটরসের মোট কাস্টমার সংখ্যা, কতজন দেনাদার (বাকিদার), কতজনের অগ্রিম জমা, কতজনের কোনো বকেয়া নেই এবং সক্রিয় ব্যাংক অ্যাকাউন্ট কয়টি তা জানতে এটি কল করো।',
                    parameters: {
                        type: 'object',
                        properties: {
                            detail: { type: 'string', description: 'ঐচ্ছিক ফিল্টার' }
                        }
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
                if (results.length > 1) {
                    const promptData = disambiguationManager.createPending('customer', query, results, 'get_customer_due');
                    return {
                        isDisambiguation: true,
                        spoken: promptData.spoken,
                        data: promptData.data
                    };
                }
                const top = results[0];
                return {
                    found: true,
                    name: top.name,
                    phone: top.phone || 'দেওয়া নেই',
                    address: top.address || 'দেওয়া নেই',
                    zone: top.zone || '',
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

            if (name === 'get_today_showroom_cash_collections') {
                const res = await ERPBridge.getTodayShowroomCashCollections(args?.targetDate || args?.date || null);
                if (res?.error === 'AUTH_REQUIRED') {
                    return { success: false, authRequired: true, message: 'আজকের শোরুম ক্যাশের হিসাব দেখতে মা মোটরসের অ্যাকাউন্টে লগইন করতে হবে।' };
                }
                if (!res) {
                    return { success: false, message: 'আজকের শোরুম ক্যাশ কালেকশনের তথ্য পাওয়া যায়নি।' };
                }
                return res;
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

            if (name === 'get_all_bank_running_balances') {
                const res = await ERPBridge.getAllBankRunningBalances();
                if (res?.error === 'AUTH_REQUIRED') {
                    return { success: false, authRequired: true, message: 'ব্যাংকের লাইভ ব্যালেন্স দেখতে মা মোটরসের অ্যাকাউন্টে সাইন ইন করতে হবে।' };
                }
                return res || { success: false, message: 'ব্যাংক ব্যালেন্স পাওয়া যায়নি।' };
            }

            if (name === 'get_zone_wise_analytics') {
                const res = await ERPBridge.getZoneWiseAnalytics();
                if (res?.error === 'AUTH_REQUIRED') {
                    return { success: false, authRequired: true, message: 'জোনভিত্তিক বকেয়া দেখতে লগইন করতে হবে।' };
                }
                return res || { success: false, message: 'জোনভিত্তিক রিপোর্ট পাওয়া যায়নি।' };
            }

            if (name === 'get_dormant_customers') {
                const res = await ERPBridge.getDormantCustomers(args?.days || 30);
                if (res?.error === 'AUTH_REQUIRED') {
                    return { success: false, authRequired: true, message: 'অলস কাস্টমারদের দেখতে লগইন করতে হবে।' };
                }
                return res || { success: false, message: 'অলস কাস্টমার তথ্য পাওয়া যায়নি।' };
            }

            if (name === 'get_total_market_summary') {
                const res = await ERPBridge.getTotalMarketSummary();
                if (res?.error === 'AUTH_REQUIRED') {
                    return { success: false, authRequired: true, message: 'মার্কেট সামারি দেখতে লগইন করতে হবে।' };
                }
                return res || { success: false, message: 'মার্কেট সামারি পাওয়া যায়নি।' };
            }

            if (name === 'get_category_expense_breakdown') {
                const res = await ERPBridge.getCategoryExpenseBreakdown(args?.days || 30);
                if (res?.error === 'AUTH_REQUIRED') {
                    return { success: false, authRequired: true, message: 'খাতওয়ারী খরচের বিশ্লেষণ দেখতে লগইন করতে হবে।' };
                }
                return res || { success: false, message: 'খাতওয়ারী খরচের হিসাব পাওয়া যায়নি।' };
            }

            if (name === 'get_ledger_math_audit_summary') {
                const res = await ERPBridge.getLedgerMathAuditSummary(args?.sampleSize || 100);
                if (res?.error === 'AUTH_REQUIRED') {
                    return { success: false, authRequired: true, message: 'লেজার অডিট দেখতে লগইন করতে হবে।' };
                }
                return res || { success: false, message: 'লেজার অডিট সম্পন্ন করা যায়নি।' };
            }

            if (name === 'get_dubai_deep_custodian_holdings') {
                const res = await ERPBridge.getDubaiDeepCustodianHoldings();
                if (res?.error === 'AUTH_REQUIRED') {
                    return { success: false, authRequired: true, message: 'দুবাই কাস্টোডিয়ান হিসাব দেখতে লগইন করতে হবে।' };
                }
                return res || { success: false, message: 'দুবাই কাস্টোডিয়ান তথ্য পাওয়া যায়নি।' };
            }

            if (name === 'get_period_sales_turnover') {
                const res = await ERPBridge.getPeriodSalesTurnover(args?.days || 30);
                if (res?.error === 'AUTH_REQUIRED') {
                    return { success: false, authRequired: true, message: 'বিক্রির হিসাব দেখতে লগইন করতে হবে।' };
                }
                return res || { success: false, message: 'বিক্রির হিসাব লোড করা যায়নি।' };
            }

            if (name === 'get_today_sales_invoices') {
                const res = await ERPBridge.getTodaySalesInvoices(args?.date || null);
                if (res?.error === 'AUTH_REQUIRED') {
                    return { success: false, authRequired: true, message: 'আজকের চালানের হিসাব দেখতে লগইন করতে হবে।' };
                }
                return res || { success: false, message: 'আজকের চালানের তথ্য পাওয়া যায়নি।' };
            }

            if (name === 'get_top_buying_customers') {
                const res = await ERPBridge.getTopBuyingCustomers(args?.limit || 5, args?.days || 30);
                if (res?.error === 'AUTH_REQUIRED') {
                    return { success: false, authRequired: true, message: 'সেরা ক্রেতাদের তালিকা দেখতে লগইন করতে হবে।' };
                }
                return res || { success: false, message: 'সেরা ক্রেতাদের তথ্য পাওয়া যায়নি।' };
            }

            if (name === 'get_collection_recovery_efficiency') {
                const res = await ERPBridge.getCollectionRecoveryEfficiency(args?.days || 30);
                if (res?.error === 'AUTH_REQUIRED') {
                    return { success: false, authRequired: true, message: 'রিকভারি রেট দেখতে লগইন করতে হবে।' };
                }
                return res || { success: false, message: 'রিকভারি রেটের হিসাব পাওয়া যায়নি।' };
            }

            if (name === 'get_advance_paying_customers') {
                const res = await ERPBridge.getAdvancePayingCustomers(args?.limit || 15);
                if (res?.error === 'AUTH_REQUIRED') {
                    return { success: false, authRequired: true, message: 'অগ্রিম জমার হিসাব দেখতে লগইন করতে হবে।' };
                }
                return res || { success: false, message: 'অগ্রিম জমাকারী কাস্টমারদের তথ্য পাওয়া যায়নি।' };
            }

            if (name === 'get_specific_bank_statement_summary') {
                const res = await ERPBridge.getSpecificBankStatementSummary(args?.bankName, args?.days || 30);
                if (res?.error === 'AUTH_REQUIRED') {
                    return { success: false, authRequired: true, message: 'ব্যাংক স্টেটমেন্ট দেখতে লগইন করতে হবে।' };
                }
                return res || { success: false, message: 'ব্যাংক স্টেটমেন্ট পাওয়া যায়নি।' };
            }

            if (name === 'get_top_inflow_bank') {
                const res = await ERPBridge.getTopInflowBank(args?.days || 30);
                if (res?.error === 'AUTH_REQUIRED') {
                    return { success: false, authRequired: true, message: 'ব্যাংক তথ্য দেখতে লগইন করতে হবে।' };
                }
                return res || { success: false, message: 'ব্যাংক জমার তথ্য পাওয়া যায়নি।' };
            }

            if (name === 'get_monthly_net_cashflow') {
                const res = await ERPBridge.getMonthlyNetCashflow(args?.days || 30);
                if (res?.error === 'AUTH_REQUIRED') {
                    return { success: false, authRequired: true, message: 'নিট ক্যাশফ্লো দেখতে লগইন করতে হবে।' };
                }
                return res || { success: false, message: 'নিট ক্যাশফ্লো পাওয়া যায়নি।' };
            }

            if (name === 'get_historical_date_summary') {
                const res = await ERPBridge.getHistoricalDateSummary(args?.targetDate);
                if (res?.error === 'AUTH_REQUIRED') {
                    return { success: false, authRequired: true, message: 'অতীতের হিসাব দেখতে লগইন করতে হবে।' };
                }
                return res || { success: false, message: 'উক্ত তারিখের হিসাব পাওয়া যায়নি।' };
            }

            if (name === 'remember_executive_note') {
                const saved = await memoryVault.rememberFact(args.content, args.category || 'fact');
                return { success: true, message: 'তথ্যটি জার্ভিস মেমোরিতে সফলভাবে সংরক্ষিত হয়েছে।' };
            }

            if (name === 'search_by_amount_or_reference') {
                const res = await ERPBridge.searchCustomerOrTxnByAmount(args?.amount, args?.hintType || 'any');
                return res;
            }

            if (name === 'get_customer_attribute') {
                const customerName = (args?.customerName || args?.query || '').trim();
                const profile = await ERPBridge.getCustomer360Profile(customerName);
                if (profile?.error === 'AUTH_REQUIRED') {
                    return { found: false, authRequired: true, message: 'কাস্টমার তথ্য দেখতে লগইন প্রয়োজন।' };
                }
                if (!profile || !profile.found) {
                    return { found: false, message: `"${customerName}" নামে কোনো কাস্টমার পাওয়া যায়নি।` };
                }
                return {
                    found: true,
                    type: 'customer_attribute_result',
                    attribute: args?.attribute || 'all',
                    name: profile.name,
                    phone: profile.phone,
                    address: profile.address,
                    zone: profile.zone,
                    accountNo: profile.accountNo,
                    totalDue: profile.totalDue,
                    totalPurchased: profile.totalPurchased,
                    totalPaid: profile.totalPaid,
                    lastBill: profile.lastBill,
                    lastPayment: profile.lastPayment
                };
            }

            if (name === 'get_business_demographics') {
                const res = await ERPBridge.getGeneralBusinessDemographics();
                return res;
            }

            return { error: 'Unknown tool' };
        } catch (err) {
            console.error(`[LLMAgent] Tool execution error (${name}):`, err);
            return { error: err.message };
        }
    }

    /**
     * Main Conversational Inference: Multi-Provider Auto-Failover Key Pool
     * Tries configured providers in order (Gemini -> Groq -> OpenRouter -> Cerebras -> OpenAI)
     * If a key or provider is rate-limited (HTTP 429) or fails, instantly fails over to the next!
     */
    async chat(history, userMessage) {
        // Step 0: Priority check for active pending disambiguation clarification
        if (disambiguationManager.hasPending()) {
            const resolved = disambiguationManager.resolveInput(userMessage);
            if (resolved) {
                const addr = resolved.address ? ` (${resolved.address})` : (resolved.zone ? ` (${resolved.zone})` : '');
                const due = Number(resolved.totalDue || 0);
                const dueText = due > 0 
                    ? `বর্তমান অবশিষ্ট বকেয়া হলো ${due.toLocaleString('bn-BD')} টাকা`
                    : (due < 0 ? `বর্তমান ব্যালেন্সে অগ্রিম জমা রয়েছে ${Math.abs(due).toLocaleString('bn-BD')} টাকা` : 'কোনো বকেয়া নেই, হিসাব সম্পূর্ণ পরিশোধিত');
                
                return {
                    spoken: `জি ভাইয়া! ${resolved.name}${addr}-এর ${dueText}।`,
                    data: {
                        name: resolved.name,
                        phone: resolved.phone || 'দেওয়া নেই',
                        address: resolved.address || 'দেওয়া নেই',
                        zone: resolved.zone || '',
                        totalDue: due,
                        accountNo: resolved.accountNo || ''
                    }
                };
            }
        }

        // Detect emotion from user input
        this.currentEmotion = this.detectEmotion(userMessage);

        const autoFailover = (typeof window !== 'undefined' && localStorage.getItem('jarvis_auto_failover')) !== 'false';
        const primaryProvider = (typeof window !== 'undefined' && localStorage.getItem('jarvis_ai_provider')) || this.provider || 'gemini';

        // Provider priority chain: Primary first, followed by others
        const allProviders = [primaryProvider, 'gemini', 'groq', 'openrouter', 'cerebras', 'openai'];
        const providerOrder = [...new Set(allProviders)];

        let lastErrorMessage = '';
        let attemptedCount = 0;

        for (const provider of providerOrder) {
            const keys = this.getAvailableKeys(provider);
            if (!keys || keys.length === 0) continue;

            console.log(`[LLMAgent] 🚀 Trying provider [${provider}] with ${keys.length} key(s)...`);

            for (let i = 0; i < keys.length; i++) {
                const key = keys[i];
                attemptedCount++;

                try {
                    let result = null;

                    if (provider === 'gemini') {
                        result = await this.chatGemini(history, userMessage, key);
                    } else if (provider === 'groq') {
                        result = await this.chatOpenAICompatible({
                            provider: 'Groq Cloud',
                            endpoint: 'https://api.groq.com/openai/v1/chat/completions',
                            model: this.groqModel || 'llama-3.3-70b-versatile',
                            key
                        }, history, userMessage);
                    } else if (provider === 'openrouter') {
                        result = await this.chatOpenAICompatible({
                            provider: 'OpenRouter',
                            endpoint: 'https://openrouter.ai/api/v1/chat/completions',
                            model: this.openrouterModel || 'meta-llama/llama-3.3-70b-instruct:free',
                            key,
                            headers: {
                                'HTTP-Referer': typeof window !== 'undefined' ? window.location.origin : 'https://maa-motors-erp.web.app',
                                'X-Title': 'Maa Motors Jarvis AI'
                            }
                        }, history, userMessage);
                    } else if (provider === 'cerebras') {
                        result = await this.chatOpenAICompatible({
                            provider: 'Cerebras',
                            endpoint: 'https://api.cerebras.ai/v1/chat/completions',
                            model: 'llama-3.3-70b',
                            key
                        }, history, userMessage);
                    } else if (provider === 'openai') {
                        result = await this.chatOpenAICompatible({
                            provider: 'OpenAI',
                            endpoint: 'https://api.openai.com/v1/chat/completions',
                            model: this.openaiModel || 'gpt-4o-mini',
                            key
                        }, history, userMessage);
                    }

                    if (result && result.spoken) {
                        this.lastActiveProvider = provider;
                        console.log(`[LLMAgent] ✅ Response successfully generated via [${provider}]`);
                        return result;
                    }
                } catch (err) {
                    console.warn(`[LLMAgent] ⚠️ Provider "${provider}" (Key #${i + 1}) error:`, err.message);
                    lastErrorMessage = err.message || '';

                    if (this.isQuotaOrRateLimitError(err)) {
                        this.markKeyCooldown(key, 60000); // 60s cooldown
                        console.log(`[LLMAgent] 🔄 Key rate-limited. Auto-switching to next key or provider...`);
                    }

                    // If auto-failover is disabled by user, don't try other providers
                    if (!autoFailover) {
                        break;
                    }
                }
            }
        }

        // Fallback to Local Semantic & Tool Engine
        console.warn('[LLMAgent] ⚠️ All configured providers failed or no keys found. Falling back to Local Semantic Engine.');
        return await this.chatLocalEmpathetic(userMessage, attemptedCount > 0, lastErrorMessage, history);
    }

    /**
     * Unified OpenAI-Compatible Multi-Provider Inference with Tool Calling & Second-Round Execution
     * Supports Groq, OpenRouter, Cerebras, OpenAI, and other standard gateways
     */
    async chatOpenAICompatible(config, history, userMessage) {
        const { provider, endpoint, model, key, headers = {} } = config;
        const messages = [
            { role: 'system', content: this.getSystemPrompt(this.currentEmotion) }
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
        const requestHeaders = {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${key}`,
            ...headers
        };

        // First round: Send prompt and available tools
        const response = await fetch(endpoint, {
            method: 'POST',
            headers: requestHeaders,
            body: JSON.stringify({
                model,
                messages,
                tools,
                tool_choice: 'auto',
                temperature: 0.7
            })
        });

        if (!response.ok) {
            const errData = await response.json().catch(() => ({}));
            const errMsg = errData.error?.message || `${provider} API Error: HTTP ${response.status}`;
            const err = new Error(errMsg);
            err.status = response.status;
            err.provider = provider;
            err.key = key;
            throw err;
        }

        const result = await response.json();
        const message = result.choices?.[0]?.message;
        if (!message) throw new Error(`${provider} returned empty message`);

        // Check if the model triggered Tool/Function calling
        if (message.tool_calls && message.tool_calls.length > 0) {
            messages.push(message);
            let toolDisplayData = null;

            for (const toolCall of message.tool_calls) {
                const fnName = toolCall.function.name;
                let fnArgs = {};
                try {
                    fnArgs = JSON.parse(toolCall.function.arguments || '{}');
                } catch (parseErr) {
                    console.warn(`[LLMAgent] Could not parse arguments for ${fnName}:`, parseErr);
                }

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

            // Second round: Get conversational response incorporating tool execution output
            const secondResponse = await fetch(endpoint, {
                method: 'POST',
                headers: requestHeaders,
                body: JSON.stringify({
                    model,
                    messages,
                    temperature: 0.7
                })
            });

            if (!secondResponse.ok) {
                const secErrData = await secondResponse.json().catch(() => ({}));
                const secErrMsg = secErrData.error?.message || `${provider} tool follow-up error: HTTP ${secondResponse.status}`;
                const err = new Error(secErrMsg);
                err.status = secondResponse.status;
                throw err;
            }

            const secondResult = await secondResponse.json();
            const spokenText = secondResult.choices?.[0]?.message?.content || '';
            return { spoken: spokenText, data: toolDisplayData };
        }

        return { spoken: message.content || '', data: null };
    }

    /**
     * Google Gemini Flash with Native Tool Calling and Multi-Model Fallback
     */
    async chatGemini(history, userMessage, key) {
        const cleanKey = String(key || '').trim();
        if (!cleanKey) {
            throw new Error('জেমিনি এআই কী পাওয়া যায়নি');
        }

        const modelsToTry = [this.geminiModel, 'gemini-2.0-flash', 'gemini-1.5-flash', 'gemini-flash-latest', 'gemini-2.0-flash-exp', 'gemini-3.6-flash'];
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
    async chatLocalEmpathetic(text, hasKey = false, errorMsg = '', history = []) {
        const lower = text.toLowerCase();

        // 0. Natural Greetings & Wake Word conversational responses
        if (/হ্যালো|হাই|hello|hi|নমস্কার|সালাম|জার্ভিস|শুনছো|আছো/.test(lower)) {
            const timeGreeting = this.getTimeGreeting();
            return {
                spoken: `${timeGreeting} ভাইয়া! আসসালামু আলাইকুম। আমি জার্ভিস। আপনার মা মোটরসের যাবতীয় কাস্টমার বকেয়া, ক্যাশ স্থিতি ও ব্যাংকের হিসাব দেখতে আমি সম্পূর্ণ প্রস্তুত আছি। বলুন ভাইয়া, কীভাবে সাহায্য করবো?`,
                data: null
            };
        }

        // 0.5 Capabilities & Help Guidance (কি কি করতে পারো / কি জানতে পারি)
        if (/তুমি কি কি করতে পারো|তোমার কি কি ক্ষমতা|কি কি জানতে পারি|সাহায্য|হেল্প|help|কিভাবে সাহায্য করতে পারো|কি কি জানতে পারবো/i.test(lower)) {
            return {
                spoken: 'জি ভাইয়া! আমি মেসার্স মা মোটরসের প্রধান এআই নির্বাহী সহকারী। আপনি আমার কাছে জানতে পারেন:\n১. যেকোনো কাস্টমারের বর্তমান অবশিষ্ট বকেয়া, মোবাইল নম্বর, ঠিকানা ও শেষ চালান বা পেমেন্ট।\n২. নির্দিষ্ট টাকার অঙ্ক দিয়ে (যেমন: ৫,৫০০ টাকা অগ্রিম কোন একাউন্ট) রিভার্স অনুসন্ধান।\n৩. আজকের মোট বিক্রি, শোরুম ক্যাশ ও ব্যাংকে কালেকশন এবং অফিসের খরচের হিসাব।\n৪. প্রতিটি ব্যাংকের বর্তমান লাইভ ব্যালেন্স এবং শোরুমের ক্যাশ ইন হ্যান্ড স্থিতি।\n৫. মোট কতজন কাস্টমার, দেনাদার সংখ্যা, সেরা বাকিদার বা অলস কাস্টমারদের তালিকা।\n৬. অতীত যেকোনো দিনের সম্পূর্ণ হিসাব এবং দুবাই কন্টেইনার অডিট রিপোর্ট।\nবলুন ভাইয়া, এখন কোন হিসাবটি দেখতে চান?',
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

        // 1.2 General Business Demographics (মোট কাস্টমার সংখ্যা / দেনাদার সংখ্যা / ব্যাংক একাউন্ট কয়টি / জিরো বকেয়া)
        if (/(?:মোট\s*কাস্টমার|কাস্টমার\s*সংখ্যা|কত\s*জন\s*কাস্টমার|মোট\s*দেনাদার|দেনাদার\s*সংখ্যা|কত\s*জন\s*বাকিদার|বাকিদার\s*সংখ্যা|কত\s*জনের\s*বকেয়া|জিরো\s*বকেয়া|বকেয়া\s*নেই|কোনো\s*বাকি\s*নেই|বাকি\s*মুক্ত|কয়টি\s*ব্যাংক|কয়টা\s*ব্যাংক|ব্যাংক\s*অ্যাকাউন্ট\s*কয়টি)/i.test(lower)) {
            const res = await this.executeToolCall('get_business_demographics', {});
            if (res && res.success) {
                return {
                    spoken: `জি ভাইয়া! মা মোটরসের ডেটাবেজে সর্বমোট ${res.totalCustomers.toLocaleString('bn-BD')} জন কাস্টমার নিবন্ধিত আছেন। এর মধ্যে বকেয়া দেনাদার রয়েছেন ${res.debtorCount.toLocaleString('bn-BD')} জন, অগ্রিম জমা রয়েছে ${res.advanceCount.toLocaleString('bn-BD')} জনের এবং কোনো বকেয়া নেই ${res.zeroDueCount.toLocaleString('bn-BD')} জনের। এছাড়া আমাদের সক্রিয় ব্যাংক অ্যাকাউন্ট রয়েছে ${res.activeBanksCount.toLocaleString('bn-BD')}টি।`,
                    data: res
                };
            }
        }

        // 1.3 Reverse Amount & Contextual Account Lookup ("অগ্রিম জমা রয়েছে ৫,৫০০ টাকা এটা কোন একাউন্ট", "৫,৫০০ টাকা কার?", "এটা কোন একাউন্ট?")
        const isReverseLookupQuery = /(?:টাকা.*(?:কার|কোন|কোনটা|একাউন্ট|অ্যাকাউন্ট|কাস্টমার)|(?:কার|কোন|কোনটা|একাউন্ট|অ্যাকাউন্ট|কাস্টমার).*(?:টাকা|বকেয়া|অগ্রিম|জমা)|এটা\s*কোন\s*একাউন্ট|এটা\s*কার|কোন\s*একাউন্ট|কার\s*একাউন্ট|কার\s*টাকা|কে\s*দিল|কে\s*দিলো)/i.test(lower);
        
        let reverseTargetAmount = 0;
        let reverseHintType = 'any';
        if (/অগ্রিম|এডভান্স|জমা\s*রয়েছে|জমা\s*আছে/i.test(lower)) reverseHintType = 'advance';
        else if (/বকেয়া|বাকী|দেনা/i.test(lower)) reverseHintType = 'due';

        // Extract amount from current query
        const directNumMatch = text.match(/(?:[০-৯0-9,]+(?:\.[০-৯0-9]+)?)/);
        if (directNumMatch) {
            reverseTargetAmount = parseBanglaOrEnglishNumber(directNumMatch[0]);
        }

        // If no amount in query, check if this is an anaphoric follow-up ("এটা কোন একাউন্ট?", "এটা কার?")
        if (reverseTargetAmount <= 0 && isReverseLookupQuery && Array.isArray(history) && history.length > 0) {
            const lastAssistantMsg = [...history].reverse().find(m => m.sender === 'assistant' || m.role === 'assistant');
            if (lastAssistantMsg && lastAssistantMsg.text) {
                if (/অগ্রিম/i.test(lower) || /অগ্রিম/i.test(lastAssistantMsg.text)) {
                    const advMatch = lastAssistantMsg.text.match(/অগ্রিম\s*(?:জমা\s*(?:রয়েছে|আছে|হলো)?)?\s*([০-৯0-9,]+)\s*টাকা/i);
                    if (advMatch && advMatch[1]) {
                        reverseTargetAmount = parseBanglaOrEnglishNumber(advMatch[1]);
                        reverseHintType = 'advance';
                    }
                }
                if (reverseTargetAmount <= 0) {
                    const numMatch = lastAssistantMsg.text.match(/([০-৯0-9,]+)\s*টাকা/);
                    if (numMatch && numMatch[1]) {
                        reverseTargetAmount = parseBanglaOrEnglishNumber(numMatch[1]);
                    }
                }
            }
        }

        if (isReverseLookupQuery && reverseTargetAmount > 0) {
            const res = await this.executeToolCall('search_by_amount_or_reference', { amount: reverseTargetAmount, hintType: reverseHintType });
            if (res && res.found) {
                const match = res.primaryMatch;
                const contactInfo = match.phone ? ` (মোবাইল: ${match.phone})` : (match.address ? ` (${match.address})` : '');
                
                if (res.matchCategory === 'advance') {
                    const extra = res.totalMatchesCount > 1 ? ` এবং আরও ${(res.totalMatchesCount - 1).toLocaleString('bn-BD')} জনের এমন অগ্রিম রয়েছে` : '';
                    return {
                        spoken: `জি ভাইয়া! ${reverseTargetAmount.toLocaleString('bn-BD')} টাকা অগ্রিম জমা রয়েছে "${match.name}"${contactInfo}-এর একাউন্টে। উনার বর্তমান অগ্রিম স্থিতি হলো ${Number(match.advanceAmount).toLocaleString('bn-BD')} টাকা${extra}।`,
                        data: res
                    };
                } else if (res.matchCategory === 'due') {
                    const extra = res.totalMatchesCount > 1 ? ` এবং আরও ${(res.totalMatchesCount - 1).toLocaleString('bn-BD')} জনের এমন বকেয়া রয়েছে` : '';
                    return {
                        spoken: `জি ভাইয়া! ${reverseTargetAmount.toLocaleString('bn-BD')} টাকা অবশিষ্ট বকেয়া রয়েছে "${match.name}"${contactInfo}-এর একাউন্টে${extra}।`,
                        data: res
                    };
                } else if (res.matchCategory === 'transaction') {
                    if (match.isPayment) {
                        return {
                            spoken: `জি ভাইয়া! ${reverseTargetAmount.toLocaleString('bn-BD')} টাকা জমা দিয়েছিলেন "${match.customerName}" (${match.date} তারিখে, ভাউচার: ${match.voucherNo || 'নেই'})।`,
                            data: res
                        };
                    } else {
                        return {
                            spoken: `জি ভাইয়া! ${reverseTargetAmount.toLocaleString('bn-BD')} টাকার চালান নেওয়া হয়েছিল "${match.customerName}"-এর নামে (${match.date} তারিখে, চালান: ${match.voucherNo || 'নেই'})।`,
                            data: res
                        };
                    }
                }
            } else if (res && !res.found) {
                return {
                    spoken: `জি ভাইয়া, মা মোটরসের ডেটাবেজে ${reverseTargetAmount.toLocaleString('bn-BD')} টাকার কোনো অগ্রিম জমা বা অবশিষ্ট বকেয়া রেকর্ড পাওয়া যায়নি।`,
                    data: null
                };
            }
        }

        // 1.4 Customer Specific Attribute Inquiries (Phone, Address, AccountNo, Last Bill, Last Payment, Lifetime Business)
        const isAttributeQuery = /(?:ফোন|মোবাইল|নাম্বার|নম্বর|ঠিকানা|দোকান|এরিয়া|এলাকা|অ্যাকাউন্ট\s*নম্বর|একাউন্ট\s*নাম্বার|শেষ\s*পেমেন্ট|শেষ\s*চালান|শেষ\s*বিল|মোট\s*মাল|মোট\s*বিক্রি|কত\s*টাকার\s*মাল|মোট\s*জমা)/i.test(lower);
        if (isAttributeQuery) {
            const cleanCustName = text.replace(/(কাস্টমার|সাহেবের|ভাইয়ের|এর|ফোন|মোবাইল|নাম্বার|নম্বর|ঠিকানা|দোকান|এরিয়া|এলাকা|অ্যাকাউন্ট|একাউন্ট|শেষ|পেমেন্ট|চালান|বিল|মোট|মাল|বিক্রি|কত|টাকার|জমা|দাও|দেও|বলো|জানাও|দেখাও|কোথায়|কি|কী)/g, '').trim();
            if (cleanCustName.length >= 2 && !/^(?:ফোন|মোবাইল|নাম্বার|নম্বর|ঠিকানা|দোকান|অ্যাকাউন্ট|শেষ|পেমেন্ট|চালান|বিল)$/i.test(cleanCustName)) {
                const profile = await ERPBridge.getCustomer360Profile(cleanCustName);
                if (profile && profile.found) {
                    if (/ফোন|মোবাইল|নাম্বার|নম্বর/i.test(lower)) {
                        return {
                            spoken: `জি ভাইয়া! ${profile.name}-এর মোবাইল নম্বর হলো ${profile.phone || 'দেওয়া নেই'}।`,
                            data: profile
                        };
                    }
                    if (/ঠিকানা|দোকান|এরিয়া|এলাকা/i.test(lower)) {
                        return {
                            spoken: `জি ভাইয়া! ${profile.name}-এর ঠিকানা হলো: ${profile.address || 'ঠিকানা দেওয়া নেই'} (${profile.zone || 'সাধারণ জোন'})।`,
                            data: profile
                        };
                    }
                    if (/অ্যাকাউন্ট|একাউন্ট/i.test(lower)) {
                        return {
                            spoken: `জি ভাইয়া! ${profile.name}-এর অ্যাকাউন্ট নম্বর হলো ${profile.accountNo || 'নির্ধারিত নেই'}।`,
                            data: profile
                        };
                    }
                    if (/শেষ\s*পেমেন্ট|শেষ\s*জমা/i.test(lower)) {
                        const lp = profile.lastPayment ? `${profile.lastPayment.date} তারিখে ${Number(profile.lastPayment.amount).toLocaleString('bn-BD')} টাকা (${profile.lastPayment.receivedType || 'ক্যাশ'})` : 'কোনো জমার রেকর্ড নেই';
                        return {
                            spoken: `জি ভাইয়া! ${profile.name} শেষবার ${lp} পরিশোধ করেছেন।`,
                            data: profile
                        };
                    }
                    if (/শেষ\s*চালান|শেষ\s*বিল/i.test(lower)) {
                        const lb = profile.lastBill ? `${profile.lastBill.date} তারিখে ${Number(profile.lastBill.amount).toLocaleString('bn-BD')} টাকার চালান (${profile.lastBill.voucherNo || ''})` : 'কোনো চালানের রেকর্ড নেই';
                        return {
                            spoken: `জি ভাইয়া! ${profile.name}-এর শেষ চালান ছিল ${lb}।`,
                            data: profile
                        };
                    }
                    if (/মোট\s*মাল|মোট\s*বিক্রি|কত\s*টাকার\s*মাল|মোট\s*জমা/i.test(lower)) {
                        return {
                            spoken: `জি ভাইয়া! ${profile.name} মা মোটরস থেকে আজীবন মোট ${Number(profile.totalPurchased || 0).toLocaleString('bn-BD')} টাকার মাল নিয়েছেন এবং মোট ${Number(profile.totalPaid || 0).toLocaleString('bn-BD')} টাকা জমা দিয়েছেন। বর্তমান অবশিষ্ট বকেয়া হলো ${Number(profile.totalDue || 0).toLocaleString('bn-BD')} টাকা।`,
                            data: profile
                        };
                    }
                }
            }
        }

        // 1.5 Historical Relative Bengali Date Summary (e.g., "গত পরশু কত কালেকশন হয়েছিল?", "গত রবিবার কত বিক্রি হয়েছিল?", "১০ তারিখের খরচের হিসাব বলো")
        const relativeDate = parseRelativeBengaliDate(lower);
        const todayDateStr = getTodayLocalDateString();
        const hasHistoryKeywords = /(?:বিক্রি|সেল|কালেকশন|জমা|টাকা|খরচ|চালান|হিসাব|রিপোর্ট)/i.test(lower);
        if (relativeDate && relativeDate !== todayDateStr && hasHistoryKeywords) {
            const res = await this.executeToolCall('get_historical_date_summary', { targetDate: relativeDate });
            if (res?.authRequired) {
                return {
                    spoken: 'জি ভাইয়া, অতীতের হিসাব দেখতে মা মোটরসের অনুমোদিত গুগল অ্যাকাউন্টে সাইন ইন করুন।',
                    data: { authRequired: true }
                };
            }
            if (res && res.success) {
                const parts = [];
                if (res.totalBills > 0) {
                    parts.push(`মোট বিক্রি হয়েছিল ${res.totalBills.toLocaleString('bn-BD')} টাকা (${res.billCount.toLocaleString('bn-BD')}টি চালানে)`);
                }
                if (res.totalCollections > 0) {
                    parts.push(`মোট কালেকশন এসেছিল ${res.totalCollections.toLocaleString('bn-BD')} টাকা (শোরুম ক্যাশ: ${res.showroomCashCollections.toLocaleString('bn-BD')}, ব্যাংক: ${res.bankCollections.toLocaleString('bn-BD')})`);
                }
                if (res.totalExpenses > 0) {
                    parts.push(`মোট খরচ হয়েছিল ${res.totalExpenses.toLocaleString('bn-BD')} টাকা`);
                }
                const summaryDetail = parts.length > 0 ? parts.join(', ') + '।' : 'কোনো বড় লেনদেনের রেকর্ড পাওয়া যায়নি।';
                return {
                    spoken: `জি ভাইয়া! ${res.date} তারিখে ${summaryDetail} সেদিনের নিট ক্যাশফ্লো ছিল ${res.netCashflow.toLocaleString('bn-BD')} টাকা।`,
                    data: res
                };
            }
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
                const extra = res.customerDepositsCount > 3 ? ` এবং আরও ${(res.customerDepositsCount - 3).toLocaleString('bn-BD')} জন` : '';
                return {
                    spoken: `জি ভাইয়া! আজকে আমাদের বিভিন্ন ব্যাংকে সর্বমোট ${res.totalBankDeposit.toLocaleString('bn-BD')} টাকা জমা হয়েছে। যারা জমা দিয়েছেন: ${sampleList}${extra}।`,
                    data: res
                };
            }
        }

        // 2.5 Today's Showroom Cash Collections (আজকে শোরুম ক্যাশে কত জমা হলো / আজকের ক্যাশ কালেকশন)
        if (
            /আজকে.*(শোরুম.*ক্যাশ|ক্যাশ.*জমা|ক্যাশে.*কত|ক্যাশ.*কালেকশন|ক্যাশে.*টাকা)|(শোরুম.*ক্যাশ.*কত.*জমা)|আজকের.*(ক্যাশ.*জমা|ক্যাশ.*কালেকশন|শোরুম.*ক্যাশ)/i.test(lower) ||
            ((lower.includes('ক্যাশ') || lower.includes('শোরুম')) && (lower.includes('আজকে') || lower.includes('আজকের')) && (lower.includes('জমা') || lower.includes('কালেকশন') || lower.includes('কত') || lower.includes('টাকা')))
        ) {
            const res = await this.executeToolCall('get_today_showroom_cash_collections', {});
            if (res?.authRequired) {
                return {
                    spoken: 'জি ভাইয়া, আজকের শোরুম ক্যাশের লাইভ জমা দেখতে মা মোটরস গুগল একাউন্টে সাইন ইন করে নিন।',
                    data: { authRequired: true }
                };
            }
            if (res && res.success) {
                if (res.totalCashCollected === 0 && res.todayCashExpenses === 0) {
                    return {
                        spoken: `জি ভাইয়া! আজকে (${res.date}) এখন পর্যন্ত শোরুম ক্যাশে কোনো কাস্টমার থেকে নগদ টাকা জমা হয়নি।`,
                        data: res
                    };
                }

                let custSnippet = '';
                if (res.customerPayments && res.customerPayments.length > 0) {
                    const topList = res.customerPayments.slice(0, 3).map(c => `${c.customerName}-এর থেকে ${c.amount.toLocaleString('bn-BD')} টাকা`).join(', ');
                    const extraCount = res.customerPaymentsCount > 3 ? ` এবং আরও ${(res.customerPaymentsCount - 3).toLocaleString('bn-BD')} জন` : '';
                    custSnippet = ` জমা দেওয়া কাস্টমারদের মধ্যে রয়েছেন: ${topList}${extraCount}।`;
                }

                let expenseSnippet = '';
                if (res.todayCashExpenses > 0) {
                    expenseSnippet = ` এছাড়া আজকে ক্যাশ ড্রয়ার থেকে খরচ হয়েছে ${res.todayCashExpenses.toLocaleString('bn-BD')} টাকা (${res.expenseCount.toLocaleString('bn-BD')}টি ভাউচারে), ফলে আজকের নিট ক্যাশ স্থিতি হলো ${res.todayNetShowroomCash.toLocaleString('bn-BD')} টাকা।`;
                }

                return {
                    spoken: `জি ভাইয়া! আজকে শোরুম ক্যাশে সর্বমোট ${res.totalCashCollected.toLocaleString('bn-BD')} টাকা নগদ জমা হয়েছে (${res.customerPaymentsCount.toLocaleString('bn-BD')} জন কাস্টমার থেকে)।${custSnippet}${expenseSnippet}`,
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

        // 4.1 Today's Detailed Sales Invoices Breakdown (আজকে কার কার কাছে কত টাকার মাল বিক্রি হলো / আজকের চালান তালিকা)
        if (/আজকে.*(?:কারা.*মাল|কার.*কাছে.*মাল|কাদের.*কাছে.*মাল|চালান.*হলো|চালানের.*তালিকা|কয়টা.*চালান|চালান.*ইস্যু)|চালান.*কারা.*নিলো|কাদের.*মাল.*দেওয়া.*হলো/i.test(lower)) {
            const res = await this.executeToolCall('get_today_sales_invoices', {});
            if (res?.authRequired) {
                return {
                    spoken: 'জি ভাইয়া, আজকের বিক্রয় চালান দেখতে মা মোটরসের অ্যাকাউন্টে সাইন ইন করুন।',
                    data: { authRequired: true }
                };
            }
            if (res && res.success) {
                if (res.invoiceCount === 0) {
                    return {
                        spoken: `জি ভাইয়া! আজকে (${res.date}) এখনো পর্যন্ত কোনো কাস্টমারের বিক্রয় চালান কাটা হয়নি।`,
                        data: res
                    };
                }
                const topList = res.invoices.slice(0, 3).map(inv => `${inv.customerName} (${inv.amount.toLocaleString('bn-BD')} টাকা)`).join(', ');
                const extra = res.invoiceCount > 3 ? ` এবং আরও ${(res.invoiceCount - 3).toLocaleString('bn-BD')}টি চালান` : '';
                return {
                    spoken: `জি ভাইয়া! আজকে মা মোটরসে মোট ${res.todayTotalBills.toLocaleString('bn-BD')} টাকার মাল বিক্রি হয়েছে (সর্বমোট ${res.invoiceCount.toLocaleString('bn-BD')}টি চালানে)। এর মধ্যে চালান হয়েছে: ${topList}${extra}।`,
                    data: res
                };
            }
        }

        // 4.2 Multi-Day / Monthly Sales Turnover (এই মাসে মোট কত টাকার বিক্রি / চলতি সপ্তাহের সেল)
        const isSalesTurnoverQuery = 
            /(?:এই\s*মাসে|এই\s*মাসের|চলতি\s*সপ্তাহে|চলতি\s*সপ্তাহের|গত\s*মাসে|বিগত\s*\d+\s*দিনে|\d+\s*দিনের).*(?:বিক্রি|সেল|টার্নওভার)/i.test(lower) ||
            /(?:বিক্রি|সেল|টার্নওভার).*(?:এই\s*মাসে|চলতি\s*সপ্তাহে|গত\s*মাসে|বিগত\s*\d+\s*দিনে|\d+\s*দিনের)/i.test(lower);

        if (isSalesTurnoverQuery) {
            let days = 30;
            const bengaliToAscii = str => str.replace(/[০-৯]/g, d => '০১২৩৪৫৬৭৮৯'.indexOf(d));
            const normalized = bengaliToAscii(lower);
            const daysMatch = normalized.match(/(\d+)\s*(?:দিন|days)/i);
            if (daysMatch) {
                days = parseInt(daysMatch[1], 10);
            } else if (/সপ্তাহ|৭\s*দিন/i.test(normalized)) {
                days = 7;
            } else if (/দুই\s*মাস|২\s*মাস|৬০\s*দিন/i.test(normalized)) {
                days = 60;
            } else if (/তিন\s*মাস|৩\s*মাস|৯০\s*দিন/i.test(normalized)) {
                days = 90;
            }

            const res = await this.executeToolCall('get_period_sales_turnover', { days });
            if (res?.authRequired) {
                return {
                    spoken: 'জি ভাইয়া, বিক্রির টার্নওভার রিপোর্ট দেখতে মা মোটরসের অ্যাকাউন্টে সাইন ইন করুন।',
                    data: { authRequired: true }
                };
            }
            if (res && res.success) {
                return {
                    spoken: `জি ভাইয়া! বিগত ${res.days.toLocaleString('bn-BD')} দিনে মা মোটরসে সর্বমোট ${res.totalSalesSum.toLocaleString('bn-BD')} টাকার মাল বিক্রি হয়েছে (${res.invoiceCount.toLocaleString('bn-BD')}টি চালানে, ${res.buyingCustomersCount.toLocaleString('bn-BD')} জন ক্রেতার কাছে)। দৈনিক গড় বিক্রি ছিল প্রায় ${res.dailyAverageSales.toLocaleString('bn-BD')} টাকা।`,
                    data: res
                };
            }
        }

        // 4.3 Top Buying Customers (সবচেয়ে বেশি টাকার মাল কে নিয়েছে / সেরা ক্রেতা কারা)
        if (/সেরা.*(?:ক্রেতা|কাস্টমার|খরিদ্দার)|টপ.*(?:ক্রেতা|কাস্টমার|বায়ার)|সবচেয়ে\s*বেশি.*(?:মাল|টাকার\s*মাল|কিনেছে|ক্রয়)/i.test(lower)) {
            const res = await this.executeToolCall('get_top_buying_customers', { limit: 5, days: 30 });
            if (res?.authRequired) {
                return {
                    spoken: 'জি ভাইয়া, সেরা ক্রেতাদের তালিকা দেখতে মা মোটরসের অ্যাকাউন্টে সাইন ইন করুন।',
                    data: { authRequired: true }
                };
            }
            if (res && res.success) {
                const topList = (res.topBuyers || []).slice(0, 5).map((b, i) => `${(i + 1).toLocaleString('bn-BD')}. ${b.customerName} (${b.totalPurchases.toLocaleString('bn-BD')} টাকা)`).join(', ');
                return {
                    spoken: `জি ভাইয়া! বিগত ৩০ দিনে মা মোটরসে সবচেয়ে বেশি টাকার মাল ক্রয় করেছেন এমন শীর্ষ ৫ জন ক্রেতা হলেন: ${topList}।`,
                    data: res
                };
            }
        }

        // 4.4 Collection Recovery Efficiency (বিক্রির তুলনায় কত পার্সেন্ট কালেকশন উঠেছে / রিকভারি রেট)
        if (/রিকভারি\s*রেট|বিক্রির.*তুলনায়.*(?:টাকা|কালেকশন|আদায়|উঠেছে)|কালেকশন.*রিকভারি|শতকরা.*আদায়/i.test(lower)) {
            const res = await this.executeToolCall('get_collection_recovery_efficiency', { days: 30 });
            if (res?.authRequired) {
                return {
                    spoken: 'জি ভাইয়া, কালেকশন রিকভারি রেট দেখতে মা মোটরসের অ্যাকাউন্টে সাইন ইন করুন।',
                    data: { authRequired: true }
                };
            }
            if (res && res.success) {
                return {
                    spoken: `জি ভাইয়া! বিগত ৩০ দিনে মোট ${res.totalBilled.toLocaleString('bn-BD')} টাকার বিক্রির বিপরীতে নগদ ও ব্যাংক মিলিয়ে আদায় হয়েছে ${res.totalCollected.toLocaleString('bn-BD')} টাকা। আমাদের বর্তমান কালেকশন রিকভারি রেট হলো ${res.recoveryRate.toLocaleString('bn-BD')}%। বকেয়া বৃদ্ধির গ্যাপ রয়েছে ${res.uncollectedGap.toLocaleString('bn-BD')} টাকা।`,
                    data: res
                };
            }
        }

        // 4.5 Advance Paying Customers (কাদের অগ্রিম জমা আছে / নেগেটিভ বকেয়া)
        if (/অগ্রিম.*(?:জমা|টাকা|কাস্টমার|ক্রেতা)|কারা.*অগ্রিম|কাদের.*অগ্রিম|অতিরিক্ত.*টাকা.*জমা|নেগেটিভ.*বকেয়া/i.test(lower)) {
            const res = await this.executeToolCall('get_advance_paying_customers', { limit: 15 });
            if (res?.authRequired) {
                return {
                    spoken: 'জি ভাইয়া, অগ্রিম জমাকারী কাস্টমারদের তালিকা দেখতে অ্যাকাউন্টে সাইন ইন করুন।',
                    data: { authRequired: true }
                };
            }
            if (res && res.success) {
                if (res.advanceCount === 0) {
                    return {
                        spoken: 'জি ভাইয়া! বর্তমানে কোনো কাস্টমারের অগ্রিম জমা বা অতিরিক্ত ব্যালেন্স নেই।',
                        data: res
                    };
                }
                const topAdv = res.topAdvance.slice(0, 3).map(c => `${c.name} (${c.advanceAmount.toLocaleString('bn-BD')} টাকা)`).join(', ');
                const extraAdv = res.advanceCount > 3 ? ` এবং আরও ${(res.advanceCount - 3).toLocaleString('bn-BD')} জন` : '';
                return {
                    spoken: `জি ভাইয়া! মা মোটরসের মোট ${res.advanceCount.toLocaleString('bn-BD')} জন কাস্টমারের কাছে কোম্পানির সর্বমোট ${res.totalAdvanceSum.toLocaleString('bn-BD')} টাকা অগ্রিম জমা রয়েছে। শীর্ষ অগ্রিম জমাকারীদের মধ্যে রয়েছেন: ${topAdv}${extraAdv}।`,
                    data: res
                };
            }
        }

        // 4.6 Specific Single Bank 360° Statement (ইসলামী ব্যাংক, ওয়ান ব্যাংক, ডাচ-বাংলা স্টেটমেন্ট)
        const specificBankMatch = lower.match(/(?:ইসলামী\s*ব্যাংক|one\s*bank|ওয়ান\s*ব্যাংক|ওয়ান\s*ব্যাংক|ডাচ\s*বাংলা|dbbl|ibbl|ইউসিবি|ucb|ব্র্যাক\s*ব্যাংক|সিটি\s*ব্যাংক)/i);
        const isBankStatementQuery = specificBankMatch && /(?:স্টেটমেন্ট|হিসাব|অবস্থা|কত\s*জমা|কত\s*আসলো|কত\s*খরচ|ব্যালেন্স|লেনদেন|রিপোর্ট)/i.test(lower);
        if (isBankStatementQuery) {
            const bNameQuery = specificBankMatch[0];
            const res = await this.executeToolCall('get_specific_bank_statement_summary', { bankName: bNameQuery, days: 30 });
            if (res?.authRequired) {
                return {
                    spoken: 'জি ভাইয়া, ব্যাংক স্টেটমেন্ট দেখতে মা মোটরসের অ্যাকাউন্টে সাইন ইন করুন।',
                    data: { authRequired: true }
                };
            }
            if (res && res.success && res.found) {
                return {
                    spoken: `জি ভাইয়া! বিগত ৩০ দিনে ${res.bankName}-এ কাস্টমার জমা ও ট্রান্সফার মিলিয়ে মোট ঢুকেছে ${res.totalInflowsPeriod.toLocaleString('bn-BD')} টাকা এবং খরচ ও উত্তোলন বাবদ বের হয়েছে ${res.totalOutflowsPeriod.toLocaleString('bn-BD')} টাকা। এই ব্যাংকে বর্তমান চলমান ব্যালেন্স রয়েছে ${res.currentRunningBalance.toLocaleString('bn-BD')} টাকা।`,
                    data: res
                };
            }
        }

        // 4.7 Top Inflow Bank (সবচেয়ে বেশি টাকা কোন ব্যাংকে জমা হচ্ছে)
        if (/সবচেয়ে\s*বেশি.*(?:টাকা.*কোন\s*ব্যাংকে|কোন\s*ব্যাংকে.*জমা|ব্যাংকে.*কালেকশন)|শীর্ষ\s*ব্যাংক|টপ\s*ব্যাংক/i.test(lower)) {
            const res = await this.executeToolCall('get_top_inflow_bank', { days: 30 });
            if (res?.authRequired) {
                return {
                    spoken: 'জি ভাইয়া, ব্যাংকের শীর্ষ জমার তথ্য দেখতে অ্যাকাউন্টে সাইন ইন করুন।',
                    data: { authRequired: true }
                };
            }
            if (res && res.success && res.topBank) {
                const rankLines = res.rankings.slice(0, 3).map((b, i) => `${(i + 1).toLocaleString('bn-BD')}. ${b.bankName} (${b.totalDeposits.toLocaleString('bn-BD')} টাকা)`).join(', ');
                return {
                    spoken: `জি ভাইয়া! বিগত ৩০ দিনে সবচেয়ে বেশি টাকা জমা পড়েছে ${res.topBank.bankName}-এ (${res.topBank.totalDeposits.toLocaleString('bn-BD')} টাকা, ${res.topBank.txnCount.toLocaleString('bn-BD')}টি লেনদেনে)। শীর্ষ ব্যাংকগুলো হলো: ${rankLines}।`,
                    data: res
                };
            }
        }

        // 4.8 Monthly Net Operating Cashflow (কালেকশন থেকে খরচ বাদ দিলে নিট কত টাকা ক্যাশ উদ্বৃত্ত থাকে)
        if (/খরচ\s*বাদে.*(?:নিট|ক্যাশ|উদ্বৃত্ত|কত\s*থাকে)|নিট\s*ক্যাশফ্লো|অপারেটিং\s*ক্যাশফ্লো|কালেকশন.*খরচ.*বাদ/i.test(lower)) {
            const res = await this.executeToolCall('get_monthly_net_cashflow', { days: 30 });
            if (res?.authRequired) {
                return {
                    spoken: 'জি ভাইয়া, নিট ক্যাশফ্লো রিপোর্ট দেখতে মা মোটরসের অ্যাকাউন্টে সাইন ইন করুন।',
                    data: { authRequired: true }
                };
            }
            if (res && res.success) {
                const status = res.isSurplus ? 'উদ্বৃত্ত (সারপ্লাস)' : 'ঘাটতি (ডেফিসিট)';
                return {
                    spoken: `জি ভাইয়া! বিগত ৩০ দিনে মা মোটরসে মোট কালেকশন এসেছে ${res.totalInflows.toLocaleString('bn-BD')} টাকা এবং মোট অফিস খরচ হয়েছে ${res.totalExpenses.toLocaleString('bn-BD')} টাকা। ফলে বর্তমানে নিট ক্যাশফ্লো হলো ${res.netCashflow.toLocaleString('bn-BD')} টাকা ${status}।`,
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

        // 10. Live Bank Running Balances & Liquidity (কোন ব্যাংকে কত টাকা আছে / ক্যাশ ব্যালেন্স)
        if (/কোন.*ব্যাংকে.*কত|ব্যাংক.*ব্যালেন্স|ব্যাংকে.*কত.*টাকা|ক্যাশ.*বাক্সে|ক্যাশ.*ইন.*হ্যান্ড|হাতে.*নগদ|তারল্য/i.test(lower)) {
            const res = await this.executeToolCall('get_all_bank_running_balances', {});
            if (res?.authRequired) {
                return {
                    spoken: 'জি ভাইয়া, ব্যাংকের বর্তমান লাইভ ব্যালেন্স দেখতে মা মোটরসের অ্যাকাউন্টে সাইন ইন করুন।',
                    data: { authRequired: true }
                };
            }
            if (res && res.success) {
                const bankLines = res.banks.map(b => `${b.bankName}-এ ${b.currentBalance.toLocaleString('bn-BD')} টাকা`).join(', ');
                return {
                    spoken: `জি ভাইয়া! বর্তমানে আমাদের ব্যাংকগুলোতে সর্বমোট ${res.totalBankBalance.toLocaleString('bn-BD')} টাকা ব্যালেন্স রয়েছে এবং শোরুমের ক্যাশ ইন হ্যান্ড রয়েছে ${res.showroomCashInHand.toLocaleString('bn-BD')} টাকা। মোট তারল্য তহবিল হলো ${res.grandTotalLiquidFunds.toLocaleString('bn-BD')} টাকা। এর মধ্যে: ${bankLines}।`,
                    data: res
                };
            }
        }

        // 11. Zone & Area Analytics (জোনভিত্তিক বকেয়া ও কাস্টমার চিত্র)
        if (/জোন|এলাকা|চট্টগ্রাম.*বকেয়া|ঢাকা.*বকেয়া|নোয়াখালী.*বকেয়া|কোন.*এলাকায়.*বাকি/i.test(lower)) {
            const res = await this.executeToolCall('get_zone_wise_analytics', {});
            if (res?.authRequired) {
                return {
                    spoken: 'জি ভাইয়া, জোনভিত্তিক বকেয়া রিপোর্ট দেখতে মা মোটরসের অ্যাকাউন্টে সাইন ইন করুন।',
                    data: { authRequired: true }
                };
            }
            if (res && res.success) {
                const topZones = res.zones.slice(0, 3).map(z => `${z.zoneName}-এ ${z.totalDue.toLocaleString('bn-BD')} টাকা (${z.customerCount} জন কাস্টমার)`).join(', ');
                return {
                    spoken: `জি ভাইয়া! এলাকাভিত্তিক হিসাব অনুযায়ী বাজারে সর্বমোট ${res.grandTotalDue.toLocaleString('bn-BD')} টাকা অবশিষ্ট বকেয়া রয়েছে। এর মধ্যে শীর্ষ জোনগুলো হলো: ${topZones}।`,
                    data: res
                };
            }
        }

        // 12. Dormant / Unpaid Debtors (কারা বকেয়া টাকা দেয়নি / অলস কাস্টমার)
        const isDormantQuery = 
            /(?:কারা|কে\s*কে|কোন\s*কোন|কোন|তালিকা|লিস্ট).*(?:টাকা|বকেয়া|বাকী|পেমেন্ট).*(?:দেয়নি|দেয়নি|দেয়\s*নাই|দেয়\s*নাই|দেয়নাই|দেয়নাই|দেয়\s*না|দেয়\s*না|পরিশোধ\s*করেনি|পরিশোধ\s*করে\s*নাই|জমা\s*দেয়নি|জমা\s*দেয়নি|জমা\s*দেয়\s*নাই|জমা\s*দেয়\s*নাই)/i.test(lower) ||
            /(?:টাকা|বকেয়া|বাকী|পেমেন্ট).*(?:দেয়নি|দেয়নি|দেয়\s*নাই|দেয়\s*নাই|দেয়নাই|দেয়নাই|দেয়\s*না|দেয়\s*না|পরিশোধ\s*করেনি).*(?:কারা|কে\s*কে|কোন|তালিকা|লিস্ট)/i.test(lower) ||
            /অলস.*কাস্টমার|নিষ্ক্রিয়|পেমেন্ট.*নেই|ঝুঁকিপূর্ণ.*বাকি|টাকা.*দেয়নি|বকেয়া.*দেয়নি|বকেয়া.*দেয়\s*নাই|টাকা.*দেয়\s*নাই|টাকা.*দেয়\s*নাই/i.test(lower);

        if (isDormantQuery) {
            let days = 30;
            const bengaliToAscii = str => str.replace(/[০-৯]/g, d => '০১২৩৪৫৬৭৮৯'.indexOf(d));
            const normalized = bengaliToAscii(lower);

            const daysNumMatch = normalized.match(/(\d+)\s*(?:দিন|days)/i);
            if (daysNumMatch) {
                days = parseInt(daysNumMatch[1], 10);
            } else if (/এক\s*সপ্তাহ|১\s*সপ্তাহ|সাপ্তাহিক/i.test(normalized)) {
                days = 7;
            } else if (/দুই\s*মাস|২\s*মাস|দু\s*মাস/i.test(normalized)) {
                days = 60;
            } else if (/তিন\s*মাস|৩\s*মাস/i.test(normalized)) {
                days = 90;
            } else if (/এক\s*মাস|১\s*মাস|একমাস|মাসে/i.test(normalized)) {
                days = 30;
            }

            const res = await this.executeToolCall('get_dormant_customers', { days });
            if (res?.authRequired) {
                return {
                    spoken: 'জি ভাইয়া, বকেয়া পরিশোধ না করা কাস্টমারদের তালিকা দেখতে মা মোটরসের অ্যাকাউন্টে সাইন ইন করুন।',
                    data: { authRequired: true }
                };
            }
            if (res && res.success) {
                if (res.dormantCount === 0) {
                    return {
                        spoken: `জি ভাইয়া! বিগত ${days.toLocaleString('bn-BD')} দিনে এমন কোনো কাস্টমার নেই যিনি বকেয়া টাকা জমা দেননি।`,
                        data: res
                    };
                }
                const topDormant = (res.topDormant || []).slice(0, 3).map(d => `${d.name} (${d.totalDue.toLocaleString('bn-BD')} টাকা)`).join(', ');
                const extraCount = res.dormantCount > 3 ? ` এবং আরও ${res.dormantCount - 3} জন` : '';
                return {
                    spoken: `জি ভাইয়া! বিগত ${days.toLocaleString('bn-BD')} দিনে মা মোটরসে কোনো বকেয়া টাকা জমা দেননি এমন কাস্টমার রয়েছেন সর্বমোট ${res.dormantCount.toLocaleString('bn-BD')} জন। তাদের কাছে মোট আটকে থাকা বকেয়া হলো ${res.totalDormantDue.toLocaleString('bn-BD')} টাকা। শীর্ষ বাকিদারদের মধ্যে রয়েছেন: ${topDormant}${extraCount}।`,
                    data: res
                };
            }
        }

        // 13. Total Market Portfolio Summary (মার্কেটের মোট বকেয়া ও কালেকশন স্থিতি)
        if (/মার্কেটে.*মোট|বাজারে.*মোট.*বাকি|মার্কেট.*বকেয়া|মোট.*মার্কেট|মার্কেট.*সারসংক্ষেপ/i.test(lower)) {
            const res = await this.executeToolCall('get_total_market_summary', {});
            if (res?.authRequired) {
                return {
                    spoken: 'জি ভাইয়া, মার্কেটের মোট সারসংক্ষেপ দেখতে লগইন করুন।',
                    data: { authRequired: true }
                };
            }
            if (res && res.success) {
                return {
                    spoken: `জি ভাইয়া! মা মোটরসের মোট ${res.totalCustomers.toLocaleString('bn-BD')} জন কাস্টমারের মধ্যে দেনাদার কাস্টমার রয়েছেন ${res.debtorCount.toLocaleString('bn-BD')} জন। বাজারে মোট বকেয়া হলো ${res.totalDueSum.toLocaleString('bn-BD')} টাকা, অগ্রিম জমা রয়েছে ${res.totalAdvanceSum.toLocaleString('bn-BD')} টাকা এবং নিট বকেয়া হলো ${res.netMarketDue.toLocaleString('bn-BD')} টাকা।`,
                    data: res
                };
            }
        }

        // 14. Category-wise Expense Breakdown (খাতওয়ারী খরচ ও সর্বোচ্চ খরচের খাত)
        if (/কোন.*খাতে.*কত|খরচের.*খাত|বেতন|যাতায়াত|গাড়ি.*ভাড়া|অফিস.*ভাড়া|নাস্তা.*খরচ/i.test(lower) && !/দুবাই/i.test(lower)) {
            const res = await this.executeToolCall('get_category_expense_breakdown', { days: 30 });
            if (res?.authRequired) {
                return {
                    spoken: 'জি ভাইয়া, খাতওয়ারী খরচের হিসাব দেখতে অ্যাকাউন্টে সাইন ইন করুন।',
                    data: { authRequired: true }
                };
            }
            if (res && res.success) {
                const catLines = res.categories.slice(0, 3).map(c => `${c.category}-এ ${c.totalAmount.toLocaleString('bn-BD')} টাকা`).join(', ');
                return {
                    spoken: `জি ভাইয়া! বিগত ৩০ দিনে মা মোটরসের মোট অফিস খরচ হয়েছে ${res.totalExpenseSum.toLocaleString('bn-BD')} টাকা (${res.totalVouchersCount}টি ভাউচারে)। এর মধ্যে সর্বোচ্চ খরচ হয়েছে: ${catLines}।`,
                    data: res
                };
            }
        }

        // 15. Ledger Math & Integrity Audit (হিসাবে কোনো ভুল বা গড়মিল আছে কিনা)
        if (/অডিট|গড়মিল|ভুল.*লেনদেন|লেজার.*চেক|হিসাব.*ঠিক|অখণ্ডতা/i.test(lower)) {
            const res = await this.executeToolCall('get_ledger_math_audit_summary', { sampleSize: 100 });
            if (res?.authRequired) {
                return {
                    spoken: 'জি ভাইয়া, লেজার অডিট চালাতে অ্যাকাউন্টে সাইন ইন করুন।',
                    data: { authRequired: true }
                };
            }
            if (res && res.success) {
                return {
                    spoken: `জি ভাইয়া! ${res.statusMessage}`,
                    data: res
                };
            }
        }

        // 16. Dubai Deep Custodian Holdings (এমরান মামা, আলতাফ, জাবেদদের কাছে কত দিরহাম)
        if (/এমরান.*মামা|আলতাফ|জাবেদ|মেস.*ফান্ড|দুবাই.*কার.*কাছে|দুবাই.*নগদ|দুবাই.*হেফাজত/i.test(lower)) {
            const res = await this.executeToolCall('get_dubai_deep_custodian_holdings', {});
            if (res?.authRequired) {
                return {
                    spoken: 'জি ভাইয়া, দুবাই কাস্টোডিয়ান হিসাব দেখতে লগইন করুন।',
                    data: { authRequired: true }
                };
            }
            if (res && res.success) {
                const holdingLines = res.personalHoldings.map(h => `${h.name}-এর কাছে ${h.amount.toLocaleString('en-US')} এইডি`).join(', ');
                return {
                    spoken: `জি ভাইয়া! দুবাই অডিটের রেকর্ড অনুযায়ী ব্যক্তিগত ক্যাশ হেফাজতে মোট ${res.holdingsTotal.toLocaleString('en-US')} এইডি (AED) রয়েছে। এর মধ্যে: ${holdingLines}। এছাড়া মেস ফান্ডে রয়েছে ${res.messBalance.toLocaleString('en-US')} এইডি এবং মোট ফিজিক্যাল এসেট হলো ${res.totalPhysicalAssets.toLocaleString('en-US')} এইডি।`,
                    data: res
                };
            }
        }

        // 17. Customer Due, Ledger & Accounting Search Check (with Disambiguation)
        if (text.includes('বকেয়া') || text.includes('বাকী') || text.includes('হিসাব') || text.includes('ব্যালেন্স') || text.includes('টাকা') || text.includes('লেজার') || text.includes('চালান')) {
            const cleanQuery = text.replace(/(কাস্টমার|সাহেবের|ভাইয়ের|এর|বকেয়া|বাকী|হিসাব|ব্যালেন্স|কত|বলো|জানাও|দেখাও|টাকা|লেজার|চালান|কারা|কে|কে\s*কে|কোন|কোন\s*কোন|তালিকা|লিস্ট|সবাই|দেয়নি|দেয়নি|দেয়\s*নাই|দেয়\s*নাই|অগ্রিম|জমা|রয়েছে|আছে|এটা|একাউন্ট|অ্যাকাউন্ট|নম্বর|নাম্বার|কোথায়|কার|কাদের)/g, '').trim();
            if (!cleanQuery || cleanQuery.length < 2 || /^(?:কারা|কে|কে\s*কে|কোন|কোন\s*কোন|তালিকা|লিস্ট|সবাই|দেয়নি|দেয়নি|দেয়\s*নাই|দেয়\s*নাই|এটা|কার|কাদের)$/i.test(cleanQuery) || /^[০-৯0-9,.\s]+$/.test(cleanQuery)) {
                return {
                    spoken: 'জি ভাইয়া, নির্দিষ্ট কোনো কাস্টমারের বকেয়া জানতে কাস্টমারের নাম বলুন, অথবা নির্দিষ্ট কোনো অংকের হিসাব জানতে চান কি?',
                    data: null
                };
            }
            const res = await this.executeToolCall('get_customer_due', { query: cleanQuery || text });
            
            if (res.authRequired) {
                return {
                    spoken: 'জি ভাইয়া, মা মোটরসের কাস্টমার বকেয়া ও লাইভ হিসাব দেখতে প্রথমে উপরের "গুগল লগইন" বাটনে চাপ দিয়ে আপনার অনুমোদিত একাউন্টে সাইন ইন করে নিন।',
                    data: { authRequired: true }
                };
            }
            if (res.isDisambiguation) {
                return {
                    spoken: res.spoken,
                    data: res.data
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

        // 18. Cash & Bank Status
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

        // 19. Direct Name / Shop Search fallback (e.g., user just spoke a customer/shop name)
        if (text.length >= 3 && !text.includes('?') && !text.includes('কি') && !text.includes('কেন')) {
            const directSearch = await this.executeToolCall('get_customer_due', { query: text });
            if (directSearch?.authRequired) {
                return {
                    spoken: 'জি ভাইয়া, কাস্টমারের তথ্য ও বকেয়া হিসাব দেখার জন্য মা মোটরস গুগল একাউন্টে সাইন ইন করে নিন।',
                    data: { authRequired: true }
                };
            }
            if (directSearch?.isDisambiguation) {
                return {
                    spoken: directSearch.spoken,
                    data: directSearch.data
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

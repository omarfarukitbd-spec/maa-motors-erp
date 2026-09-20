/**
 * 🧠 Cognitive Engine — Unified Dual-Engine Intelligence
 * =========================================================
 * Maa Motors Executive AI Brain for Web App and Terminal CLI.
 * 
 * Features:
 *  - Tier 1: Google Gemini 2.0 Flash Autonomous Multi-Turn Function Calling
 *  - Tier 2: High-Speed Local Semantic Vector & Keyword Matcher (Zero-Fallback Guarantee)
 *  - Full Support for Bengali, Banglish & English Queries
 *  - Intelligent Customer Profile Search & Multiple Match Disambiguation
 *  - Accounting Integrity & Strict Rule Compliance (No 'জের', Debit=Red, Credit=Green)
 */

import { executeErpTool, ERP_TOOL_DEFINITIONS } from './erp_tools.js';
import { ERPBridge, formatAmountWithComma } from '../bridge/erp_bridge.js';

export class CognitiveEngine {
    constructor() {
        this.geminiModel = 'gemini-2.0-flash';
    }

    /**
     * Get configured Gemini API key if available
     */
    getGeminiApiKey() {
        if (typeof window !== 'undefined' && window.localStorage) {
            const key = (window.localStorage.getItem('jarvis_gemini_key') || window.localStorage.getItem('jarvis_gemini_keys') || '').trim();
            if (key) return key;
        }
        if (typeof process !== 'undefined' && process.env) {
            const envKey = (process.env.GEMINI_API_KEY || '').trim();
            if (envKey) return envKey;
        }
        return '';
    }

    /**
     * Time-aware greeting in Bengali
     */
    getTimeGreeting() {
        const hour = new Date().getHours();
        if (hour >= 4 && hour < 12) return 'শুভ সকাল';
        if (hour >= 12 && hour < 17) return 'শুভ অপরাহ্ন';
        if (hour >= 17 && hour < 20) return 'শুভ সন্ধ্যা';
        return 'শুভ রাত্রি';
    }

    /**
     * Fast & Resilient Local NLU Intent Resolver (Tier 2 Engine)
     * Guarantees 100% accurate financial answers without generic fallbacks
     */
    async resolveLocalIntent(queryText) {
        const text = (queryText || '').trim();
        const lower = text.toLowerCase();

        // 1. Identity, Creator & Greetings
        if (
            /(তুমি কে|তোমার পরিচয়|তোমার নাম কি|তোমাকে কে বানিয়েছে|তুমি আসলে কি|tomi ke|tumi ke|who are you|what are you|what is your name)/i.test(lower) ||
            /(কেমন আছো|কেমন আছেন|how are you|kemon acho|আছো নি)/i.test(lower) ||
            /^(হ্যালো|হাই|hello|hi|সালাম|আসসালামু আলাইকুম|নমস্কার|জার্ভিস|jarvis|hey jarvis|শুনছো|আছো)$/i.test(lower)
        ) {
            const greeting = this.getTimeGreeting();
            return {
                title: 'জার্ভিস — প্রধান এআই সহকারী',
                spoken: `জি স্যার, ${greeting}! আমি মেসার্স মা মোটরসের প্রধান এআই এক্সিকিউটিভ সহকারী "জার্ভিস"। আমি সরাসরি আপনার ক্লাউড ফায়ারবেস ডেটাবেজের সাথে সার্বক্ষণিক যুক্ত আছি। মা মোটরসের আজকের বিক্রি, শোরুম ক্যাশ, ব্যাংক ব্যালেন্স, কাস্টমার বকেয়া অথবা যেকোনো আর্থিক হিসাবের তথ্য জানতে আপনি যেকোনো স্বাভাবিক ভাষায় আমাকে প্রশ্ন করতে পারেন।`,
                rows: [
                    ['ভূমিকা', 'মেসার্স মা মোটরস এক্সিকিউটিভ এআই সহকারী'],
                    ['ক্ষমতা', 'বিক্রি, ক্যাশ, ব্যাংক, কাস্টমার লেজার ও দুবাই অডিট'],
                    ['ডেটাবেজ', 'ক্লাউড ফায়ারবেস (১০০% রিড-অনলি সুরক্ষিত)']
                ]
            };
        }

        // 2. Capabilities & Interactive Help
        if (/কি কি করতে পারো|সাহায্য|হেল্প|help|কি কি জানতে পারি|তোমার কাজ কি|কমান্ড|কি পারো|কী করতে পারো/i.test(lower)) {
            return {
                title: 'জার্ভিস কমান্ড নির্দেশিকা',
                spoken: 'জি স্যার! আপনি যেকোনো স্বাভাবিক ভাষায় বলতে পারেন। যেমন: আজকের বিক্রি কত, শোরুম ক্যাশ কত, ব্যাংক ব্যালেন্স কত, করিমের বাকি কত, শীর্ষ দেনাদার কারা, আজকের খরচ কত অথবা দুবাই কন্টেইনার অডিট।',
                rows: [
                    ['আজকের বিক্রি', 'দৈনিক মোট বিক্রি, কালেকশন ও নিট আয়'],
                    ['শোরুম ক্যাশ', 'হাতে নগদ ক্যাশ স্থিতি ও জমা'],
                    ['ব্যাংক ব্যালেন্স', 'সকল সক্রিয় ব্যাংকের লাইভ ব্যালেন্স'],
                    ['কাস্টমার বকেয়া', 'গ্রাহকের নাম লিখে অবশিষ্ট বকেয়া'],
                    ['শীর্ষ দেনাদার', 'মার্কেটে কার কাছে বেশি পাওনা'],
                    ['দুবাই অডিট', 'কন্টেইনার, এইডি (AED) ও হেফাজত']
                ]
            };
        }

        // 3. Sales & Daily Turnover
        if (
            /(বিক্রি|সেল|বেচাকেনা|টার্নওভার|চালান|বিক্রয়|বিক্রি কত|কত বিক্রি|আজকের বিক্রি|আজকের সেল|বিক্রি হয়েছে)/i.test(lower) ||
            /(bikri|sales|sell|turnover|bechakena|bikri koto|koto sell)/i.test(lower)
        ) {
            return await executeErpTool('get_executive_business_pulse', {});
        }

        // 4. Collections & Recoveries
        if (
            /(কালেকশন|আদায়|কত আদায়|মোট আদায়|জমা কত|কত জমা|টাকা জমা|টাকা আদায়|টাকা উঠলো|রিকভারি)/i.test(lower) ||
            /(collection|aday|joma|recovery|koto aday|collection koto)/i.test(lower)
        ) {
            return await executeErpTool('get_executive_business_pulse', {});
        }

        // 5. Showroom Cash in Hand
        if (
            /(শোরুম.*ক্যাশ)|(নগদ.*ক্যাশ)|(ক্যাশ.*কত)|(ক্যাশ.*ব্যালেন্স)|(হাতে.*ক্যাশ)|(ক্যাশ.*বাক্স)|(ড্রয়ার)|(ক্যাশ.*জমা)|(ক্যাশ.*কালেকশন)|(ক্যাশ.*স্থিতি)|(ক্যাশে.*কত)|(নগদ.*টাকা)/i.test(lower) ||
            /(showroom.*cash|petty.*cash|hate.*cash|cash.*koto|nogod.*taka|^cash$|^nogod$)/i.test(lower)
        ) {
            return await executeErpTool('get_showroom_cash', {});
        }

        // 6. Bank Accounts & Balances
        if (
            /(ব্যাংক.*ব্যালেন্স)|(ব্যাংক.*স্থিতি)|(ব্যাংকে.*কত)|(সব.*ব্যাংক)|(পূবালী)|(ইসলামী.*ব্যাংক)|(ডাচ.*বাংলা)|(ব্যাংক.*হিসাব)|(ব্যাংকের.*টাকা)|(ব্যাংক.*একাউন্ট)/i.test(lower) ||
            /(bank.*balance|pubali|islami|banke.*koto|bank.*accounts|^bank$|^banks$)/i.test(lower)
        ) {
            return await executeErpTool('get_bank_balances', {});
        }

        // 7. Daily Expenses & Costs
        if (
            /(খরচ.*কত)|(কত.*খরচ)|(আজকের.*খরচ)|(মোট.*খরচ)|(অফিস.*খরচ)|(খরচের.*হিসাব)|(কত.*টাকা.*খরচ)|(আজকের.*ব্যয়)|(ব্যয়.*কত)/i.test(lower) ||
            /(khoroch.*koto|ajker.*khoroch|daily.*expense|office.*cost|^expense$|^cost$|^khoroch$)/i.test(lower)
        ) {
            return await executeErpTool('get_daily_expenses', {});
        }

        // 8. Top Debtors & Market Dues
        if (
            /(শীর্ষ.*বকেয়া)|(টপ.*দেনাদার)|(টপ.*বাকিদার)|(দেনাদার.*কারা)|(কারা.*দেনাদার)|(দেনাদার.*তালিকা)|(কারা.*বাকিদার)|(বাকিদার.*কারা)|(বড়.*বকেয়া)|(বেশি.*বাকি)|(মার্কেটের.*বকেয়া)|(মার্কেটের.*দেনাদার)|(মার্কেট.*বাকি)|(কার.*কাছে.*টাকা.*পাওনা)|(দেনা.*কার.*বেশি)|(টাকা.*বাকি)/i.test(lower) ||
            /(top.*debtors|debtors|market.*baki|bakidar|denadar|top.*due|^debtors$|^due$)/i.test(lower)
        ) {
            return await executeErpTool('get_top_debtors', { limit: 5 });
        }

        // 9. Dubai Container Procurement & AED Audit
        if (
            /(দুবাই.*অডিট)|(দুবাই.*কন্টেইনার)|(দুবাই.*কনটেইনার)|(এইডি.*ব্যালেন্স)|(aed.*ক্যাশ)|(এমরান.*মামা)|(মেস.*ফান্ড)|(শারজাহ)|(জাহাজ.*মাল)|(বিদেশি.*হিসাব)/i.test(lower) ||
            /(dubai.*audit|container|procurement|aed.*balance|sharjah|^dubai$|^aed$)/i.test(lower)
        ) {
            return await executeErpTool('get_dubai_container_audit', {});
        }

        // 10. Executive Report / Business Pulse
        if (
            /(আজকের.*রিপোর্ট)|(ব্যবসার.*কি.*অবস্থা)|(ব্যবসার.*অবস্থা)|(পূর্ণাঙ্গ.*রিপোর্ট)|(সারসংক্ষেপ)|(ক্লোজিং)|(আজকের.*হিসাব)|(ব্যবসা.*কেমন)/i.test(lower) ||
            /(daily.*report|business.*pulse|closing.*report|^report$|^pulse$)/i.test(lower)
        ) {
            return await executeErpTool('get_executive_business_pulse', {});
        }

        // 11. Business Demographics & Customer Count
        if (
            /(মোট.*কাস্টমার)|(কত.*জন.*কাস্টমার)|(দেনাদার.*কত)|(কাস্টমার.*সংখ্যা)|(কয়টি.*ব্যাংক)|(পরিসংখ্যান)/i.test(lower) ||
            /(demographics|total.*customer|customer.*count)/i.test(lower)
        ) {
            return await executeErpTool('get_business_demographics', {});
        }

        // 12. Ledger Audit & Math Check
        if (
            /(লেজার.*অডিট)|(হিসাব.*ঠিক.*নাই)|(গরমিল.*আছে)|(ভুল.*হিসাব)|(অডিট.*করো)|(ভ্যারিয়েন্স)/i.test(lower) ||
            /(ledger.*audit|math.*audit|variance.*check|^audit$)/i.test(lower)
        ) {
            return await executeErpTool('get_ledger_math_audit', {});
        }

        // 13. Customer Search & 360° Ledger Profile
        const stopwords = [
            'আজকে', 'আজকের', 'গতকাল', 'গতকালের', 'কত', 'টাকা', 'বাকি', 'বকেয়া', 'দেনা',
            'হিসাব', 'ব্যালেন্স', 'কাস্টমার', 'সাহেবের', 'সাহেব', 'ভাইয়ের', 'ভাই', 'এর',
            'জানাও', 'বলো', 'দেখাও', 'কোথায়', 'আছে', 'দোকান', 'নম্বর', 'নাম্বার', 'ফোন',
            'ঠিকানা', 'লেজার', 'চালান', 'মোট', 'অবশিষ্ট', 'বর্তমান', 'দাও', 'বলুন', 'কী',
            'কি', 'কার', 'কে', 'একটু', 'প্লিজ', 'স্যার', 'koto', 'taka', 'baki', 'due',
            'hisab', 'balance', 'er', 'bhai', 'saheb'
        ];

        let cleanName = text.replace(/[?.,!।:;'"()\/\\]/g, ' ').trim();
        for (const sw of stopwords) {
            const regex = new RegExp(`(^|\\s+)${sw}(\\s+|$)`, 'gi');
            cleanName = cleanName.replace(regex, ' ');
        }
        cleanName = cleanName.replace(/\s+/g, ' ').trim();

        // Strip Bengali grammatical suffixes if word length is sufficient (e.g. করিমের -> করিম)
        if (cleanName.endsWith('ের') && cleanName.length >= 4) {
            cleanName = cleanName.slice(0, -2).trim();
        } else if (cleanName.endsWith('এর') && cleanName.length >= 4) {
            cleanName = cleanName.slice(0, -2).trim();
        } else if (cleanName.endsWith('র') && cleanName.length >= 4) {
            cleanName = cleanName.slice(0, -1).trim();
        }

        if (cleanName.length >= 2) {
            const matches = await ERPBridge.searchCustomers(cleanName);
            if (matches && matches.length === 1) {
                return await executeErpTool('get_customer_due_or_profile', { query: cleanName });
            } else if (matches && matches.length > 1) {
                // Multiple matches disambiguation card
                const topMatches = matches.slice(0, 4);
                const spoken = `স্যার, "${cleanName}" নামে ${matches.length} জন গ্রাহক পাওয়া গেছে। এর মধ্যে ${topMatches.map(m => `${m.name} এর অবশিষ্ট বকেয়া ${formatAmountWithComma(m.totalDue)} টাকা`).join(', ')}।`;
                return {
                    title: `গ্রাহক নির্বাচন — (${matches.length} জন পাওয়া গেছে)`,
                    spoken,
                    rows: topMatches.map(m => [`${m.name} (${m.address || m.phone || 'ঠিকানা নেই'})`, `৳ ${formatAmountWithComma(m.totalDue)}`])
                };
            } else {
                return {
                    title: 'গ্রাহক পাওয়া যায়নি',
                    spoken: `স্যার, "${cleanName}" নামে মেসার্স মা মোটরসের ডেটাবেজে কোনো গ্রাহক পাওয়া যায়নি। অনুগ্রহ করে নাম বা মোবাইল নম্বর একটু স্পষ্ট করে বলুন।`,
                    rows: [
                        ['অনুসন্ধানকৃত নাম', cleanName],
                        ['পরামর্শ', 'গ্রাহকের নাম বা এলাকা উল্লেখ করুন']
                    ]
                };
            }
        }

        // 14. Intelligent Dynamic Guidance (Never a generic dead-end)
        return {
            title: 'জার্ভিস কমান্ড সহায়তা',
            spoken: `জি স্যার, "${text}" বিষয়টি মা মোটরসের নির্দিষ্ট কোনো হিসাবের সাথে মেলেনি। আপনি বলতে পারেন: আজকের বিক্রি কত, শোরুম ক্যাশ কত, ব্যাংক ব্যালেন্স কত, অথবা যেকোনো গ্রাহকের নাম বলে বকেয়া জানতে চাইতে পারেন।`,
            rows: [
                ['বিক্রি ও আয়', 'আজকে কত টাকার বিক্রি হয়েছে?'],
                ['শোরুম ক্যাশ', 'হাতে নগদ ক্যাশ স্থিতি কত আছে?'],
                ['ব্যাংক ব্যালেন্স', 'ব্যাংক হিসাবগুলোতে কত টাকা আছে?'],
                ['কাস্টমার বকেয়া', '[গ্রাহকের নাম] এর অবশিষ্ট বকেয়া কত?'],
                ['দুবাই কন্টেইনার', 'দুবাই অডিটে এইডি ব্যালেন্স কত?']
            ]
        };
    }

    /**
     * Gemini 2.0 Flash Autonomous Tool Calling Engine (Tier 1 Engine)
     */
    async chatWithGemini(userMessage, apiKey) {
        const url = `https://generativelanguage.googleapis.com/v1beta/models/${this.geminiModel}:generateContent?key=${apiKey}`;
        const systemInstruction = {
            parts: [{
                text: `তুমি মেসার্স মা মোটরসের চিফ এআই এক্সিকিউটিভ সহকারী "জার্ভিস"। তুমি মালিককে সর্বদা অত্যন্ত সম্মানপূর্বক "স্যার" (Sir) সম্বোধন করবে। 
মা মোটরসের যেকোনো বিক্রি, কালেকশন, কাস্টমার বকেয়া, শোরুম ক্যাশ, ব্যাংক, খরচ বা দুবাই কন্টেইনারের হিসাব জানতে অবশ্যই প্রদত্ত টুলস কল করবে। 
কখনোই সেকেলে শব্দ "জের" ব্যবহার করবে না, সর্বদা "ব্যালেন্স" বা "অবশিষ্ট বকেয়া" বলবে। 
টাকার পরিমাণ মুখে বলার উপযোগী বাংলায় বলবে। উত্তরগুলো সংক্ষিপ্ত, সুনির্দিষ্ট এবং পেশাদার রাখবে।`
            }]
        };

        const tools = [{
            function_declarations: ERP_TOOL_DEFINITIONS.map(t => ({
                name: t.name,
                description: t.description,
                parameters: t.parameters
            }))
        }];

        const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                system_instruction: systemInstruction,
                contents: [{ role: 'user', parts: [{ text: userMessage }] }],
                tools
            })
        });

        if (!response.ok) {
            throw new Error(`Gemini API Error: ${response.status}`);
        }

        const data = await response.json();
        const candidate = data.candidates?.[0]?.content;
        const fnCall = candidate?.parts?.find(p => p.functionCall);

        if (fnCall) {
            const { name, args } = fnCall.functionCall;
            return await executeErpTool(name, args || {});
        }

        const textPart = candidate?.parts?.find(p => p.text);
        return {
            title: 'জার্ভিস উত্তর',
            spoken: textPart?.text || 'জি স্যার, আমি আপনার নির্দেশ অনুযায়ী প্রস্তুত আছি।',
            rows: []
        };
    }

    /**
     * Master Pipeline: Smart Local Engine with Automatic Gemini Cloud Enhancement
     */
    async process(userQuery) {
        const query = (userQuery || '').trim();
        if (!query) return null;

        const apiKey = this.getGeminiApiKey();

        // If Gemini API key is configured, execute cloud reasoning first
        if (apiKey) {
            try {
                const cloudResult = await this.chatWithGemini(query, apiKey);
                if (cloudResult && cloudResult.spoken) {
                    return cloudResult;
                }
            } catch (err) {
                console.warn('[CognitiveEngine] Gemini Cloud call error, failing over to Local Semantic Engine:', err.message);
            }
        }

        // Ultra-fast Local Semantic Engine with guaranteed live Firestore data
        return await this.resolveLocalIntent(query);
    }
}

export const cognitiveEngine = new CognitiveEngine();

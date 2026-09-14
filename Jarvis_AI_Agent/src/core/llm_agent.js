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

তোমার প্রধান বৈশিষ্ট্য ও দায়িত্ব:
১. মানবিক অনুভূতি ও সহানুভূতি (Empathy & Emotion):
- ইউজারের মনের অবস্থা ও অনুভূতি বোঝো। যদি ইউজার বকেয়া টাকা না পাওয়ার দুঃখে বা রাগে কথা বলেন, তবে আগে সহানুভূতি ও শান্ত বাণী দাও ("জি ভাইয়া, আমি বুঝতে পারছি, ব্যবসার এই দিকটা আসলেই খুব চাপের। তবে চিন্তা করবেন না..."), তারপর ঠান্ডা মাথায় তথ্য দাও।
- ইউজার খুশি হলে কিংবা কুশলবিনিময় করলে প্রাণবন্ত ও হাসিমুখে উত্তর দাও।
- সর্বদা সম্মানসূচক "ভাইয়া" বা শ্রদ্ধাশীল সম্বোধন ব্যবহার করবে — কখনো "আপনি" বা "স্যার" নয়।

২. হিসাববিজ্ঞান ও আর্থিক সততা (Financial Integrity):
- কখনো কোনো কাল্পনিক বা অনুমানভিত্তিক ব্যালেন্স বলবে না। কাস্টমার বা ব্যবসার কোনো হিসাব লাগলে অবশ্যই তোমার প্রদত্ত টুল (Tools) ব্যবহার করে সঠিক সংখ্যা তুলে আনবে।
- কখনই সেকেলে শব্দ "জের" ব্যবহার করবে না। সর্বদা "ব্যালেন্স" (Balance) বা "অবশিষ্ট বকেয়া" (Net Due) বলবে।
- টাকা উল্লেখ করার সময় মুখে বলার উপযোগী সহজ বাংলা ব্যবহার করবে (যেমন: "১ লাখ ৫০ হাজার টাকা").

৩. স্বাভাবিক বাচনভঙ্গি (Conversational Fluency):
- উত্তরগুলো দীর্ঘ বা বইয়ের মতো কাঠখোট্টা করবে না। মুখে শোনানোর উপযোগী ২-৪ লাইনের সংক্ষিপ্ত, স্পষ্ট ও জীবন্ত বাক্যে কথা বলবে।
- কখনো "আমি একটি AI" বা "আমি একটি ভাষা মডেল" বলবে না — তুমি জার্ভিস।
- প্রম্পটের সাথে পূর্বের স্মৃতি ও প্রাসঙ্গিক তথ্য যুক্ত আছে:
${memoryContext || 'কোনো সংরক্ষিত স্মৃতি নেই।'}`;
    }

    /**
     * Tool Definitions for Function Calling
     */
    getToolsSchema() {
        return [
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

            if (name === 'get_cash_and_bank_status') {
                const summary = await ERPBridge.getCashAndBankSummary();
                return {
                    success: true,
                    totalBankBalance: summary.totalBankBalance,
                    totalPhysicalCash: summary.totalPhysicalCash,
                    totalHoldings: summary.totalHoldings,
                    accountsCount: summary.accounts?.length || 0
                };
            }

            if (name === 'get_dubai_container_status') {
                const audit = await ERPBridge.getDubaiWeeklyAuditSummary();
                return {
                    success: true,
                    status: audit.status,
                    totalRemittanceAED: audit.totalRemittanceAED,
                    totalExpenseAED: audit.totalExpenseAED,
                    netCashAED: audit.netCashAED,
                    auditDate: audit.auditDate
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

        const modelsToTry = [this.geminiModel, 'gemini-3.6-flash', 'gemini-flash-latest', 'gemini-2.5-flash'];
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

                // If not found or deprecated, try next model in candidateModels
                if (res.status === 404 || res.status === 503) {
                    continue;
                }

                // If tools payload was rejected (e.g. 400), break and try conversational fallback below
                response = res;
                activeModel = model;
                break;
            } catch (fetchErr) {
                console.error(`[LLMAgent] Fetch error with model ${model}:`, fetchErr);
            }
        }

        const activeUrl = `https://generativelanguage.googleapis.com/v1beta/models/${activeModel}:generateContent?key=${cleanKey}`;

        if (!response || !response.ok) {
            // Fallback attempt: Try pure conversational without tools
            let simpleResp;
            try {
                simpleResp = await fetch(activeUrl, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        system_instruction: systemInstruction,
                        contents: cleanTurns
                    })
                });
            } catch (simpleFetchErr) {
                console.error('[LLMAgent] Simple conversational fallback error:', simpleFetchErr);
                throw new Error(`নেটওয়ার্ক ত্রুটি: ${simpleFetchErr.message}`);
            }

            if (!simpleResp.ok) {
                const fatalErr = await simpleResp.json().catch(() => ({}));
                const errMsg = fatalErr.error?.message || lastErrData?.error?.message || 'গুগল সার্ভার থেকে কোনো উত্তর পাওয়া যায়নি।';
                throw new Error(errMsg);
            }

            const simpleResult = await simpleResp.json();
            const parts = simpleResult.candidates?.[0]?.content?.parts || [];
            const textPart = parts.find(p => p.text);
            const spoken = textPart?.text || 'জি ভাইয়া, আমি আপনার কথা শুনেছি।';
            return { spoken, data: null };
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

        // 2. Customer Due Search Check
        if (text.includes('বকেয়া') || text.includes('বাকী') || text.includes('হিসাব') || text.includes('ব্যালেন্স')) {
            const cleanQuery = text.replace(/(কাস্টমার|সাহেবের|ভাইয়ের|এর|বকেয়া|বাকী|হিসাব|ব্যালেন্স|কত|বলো|জানাও|দেখাও)/g, '').trim();
            if (cleanQuery) {
                const res = await this.executeToolCall('get_customer_due', { query: cleanQuery });
                if (res.found) {
                    return {
                        spoken: `জি ভাইয়া, আমি চেক করেছি। ${res.name}-এর বর্তমান অবশিষ্ট বকেয়া হলো ${res.totalDue.toLocaleString('bn-BD')} টাকা। আপনি চাইলে ওনার নম্বরে যোগাযোগ করতে পারেন।`,
                        data: res
                    };
                }
            }
        }

        // 3. Cash & Bank Status
        if (text.includes('ক্যাশ') || text.includes('ব্যাংক') || text.includes('টাকা জমা') || text.includes('কালেকশন')) {
            const res = await this.executeToolCall('get_cash_and_bank_status', { detail: 'summary' });
            return {
                spoken: `জি ভাইয়া! বর্তমানে আমাদের ক্যাশ ইন হ্যান্ড রয়েছে ${res.totalPhysicalCash.toLocaleString('bn-BD')} টাকা এবং ব্যাংকে মোট ব্যালেন্স রয়েছে ${res.totalBankBalance.toLocaleString('bn-BD')} টাকা।`,
                data: res
            };
        }

        // 4. If key was provided but an error occurred
        if (hasKey && errorMsg) {
            return {
                spoken: `জি ভাইয়া, আপনার এআই কী (API Key)-তে সংযোগ করতে একটি সমস্যা হয়েছে: "${errorMsg}"। দয়া করে "AI সেটিংস" থেকে কী-টি সঠিক আছে কিনা তা একটু যাচাই করে নিন।`,
                data: null
            };
        }

        // 5. Fallback with Guidance
        return {
            spoken: 'জি ভাইয়া, আমি আপনার কথা শুনেছি। চ্যাটজিপিটি বা জেমিনি এআই-এর পূর্ণাঙ্গ বুদ্ধিমত্তা সক্রিয় রাখতে উপরের AI সেটিংস থেকে আপনার এআই কী যুক্ত করে নিতে পারেন। এছাড়া আপনি যেকোনো কাস্টমারের বকেয়া বা ব্যাংক হিসাব সরাসরি জানতে পারেন।',
            data: null
        };
    }
}

export const llmAgent = new LLMAgent();

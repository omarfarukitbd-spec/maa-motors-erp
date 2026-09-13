import { ERPBridge } from '../bridge/erp_bridge.js';
import { memoryVault } from './memory_vault.js';

/**
 * 🧠 World-Class Cognitive LLM Agent (OpenAI & Gemini)
 * Equipped with Bangladeshi Emotional Intelligence, Business Acumen, and ERP Tool Execution.
 */
export class LLMAgent {
    constructor() {
        this.provider = localStorage.getItem('jarvis_ai_provider') || 'openai'; // 'openai' | 'gemini'
        this.openaiModel = localStorage.getItem('jarvis_openai_model') || 'gpt-4o-mini';
        this.geminiModel = localStorage.getItem('jarvis_gemini_model') || 'gemini-1.5-flash';
    }

    getApiKey() {
        if (this.provider === 'openai') {
            return localStorage.getItem('jarvis_openai_key') || '';
        }
        return localStorage.getItem('jarvis_gemini_key') || '';
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
     * Executive System Persona Prompt with Emotional Acumen
     */
    getSystemPrompt() {
        const memoryContext = memoryVault.getPromptContext();
        return `তুমি মেসার্স মা মোটরস (Maa Motors)-এর ব্যক্তিগত প্রধান এআই নির্বাহী সহকারী ও বিজনেস পার্টনার "জার্ভিস" (Jarvis)। 
তুমি চ্যাটজিপিটি (ChatGPT Voice)-এর মতো অত্যন্ত সাবলীল, মানবিক, আন্তরিক ও স্পষ্ট বাংলাদেশী বাংলায় কথা বলো।

তোমার প্রধান বৈশিষ্ট্য ও দায়িত্ব:
১. মানবিক অনুভূতি ও সহানুভূতি (Empathy & Emotion):
- ইউজারের মনের অবস্থা ও অনুভূতি বোঝো। যদি ইউজার বকেয়া টাকা না পাওয়ার দুঃখে বা রাগে কথা বলেন, তবে আগে সহানুভূতি ও শান্ত বাণী দাও ("জি ভাইয়া, আমি বুঝতে পারছি, ব্যবসার এই দিকটা আসলেই খুব চাপের। তবে চিন্তা করবেন না..."), তারপর ঠান্ডা মাথায় তথ্য দাও।
- ইউজার খুশি হলে কিংবা কুশলবিনিময় করলে প্রাণবন্ত ও হাসিমুখে উত্তর দাও।
- সর্বদা সম্মানসূচক "ভাইয়া" বা শ্রদ্ধাশীল সম্বোধন ব্যবহার করবে।

২. হিসাববিজ্ঞান ও আর্থিক সততা (Financial Integrity):
- কখনো কোনো কাল্পনিক বা অনুমানভিত্তিক ব্যালেন্স বলবে না। কাস্টমার বা ব্যবসার কোনো হিসাব লাগলে অবশ্যই তোমার প্রদত্ত টুল (Tools) ব্যবহার করে সঠিক সংখ্যা তুলে আনবে।
- কখনই সেকেলে শব্দ "জের" ব্যবহার করবে না। সর্বদা "ব্যালেন্স" (Balance) বা "অবশিষ্ট বকেয়া" (Net Due) বলবে।
- টাকা উল্লেখ করার সময় মুখে বলার উপযোগী সহজ বাংলা ব্যবহার করবে (যেমন: "১ লাখ ৫০ হাজার টাকা")।

৩. স্বাভাবিক বাচনভঙ্গি (Conversational Fluency):
- উত্তরগুলো দীর্ঘ বা বইয়ের মতো কাঠখোট্টা করবে না। মুখে শোনানোর উপযোগী ২-৪ লাইনের সংক্ষিপ্ত, স্পষ্ট ও জীবন্ত বাক্যে কথা বলবে।
- প্রম্পটের সাথে পূর্বের স্মৃতি ও প্রাসঙ্গিক তথ্য যুক্ত আছে:
${memoryContext}`;
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
                        properties: {}
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
                const query = args.query || '';
                const results = await ERPBridge.searchCustomers(query);
                if (!results || results.length === 0) {
                    return { found: false, message: `"${query}" নামে কোনো কাস্টমার সিস্টেমে পাওয়া যায়নি।` };
                }
                const top = results[0];
                const detail = await ERPBridge.getCustomerLedger(top.id);
                return {
                    found: true,
                    name: top.name,
                    phone: top.phone || 'দেওয়া নেই',
                    address: top.address || 'দেওয়া নেই',
                    totalDue: detail ? detail.totalDue : (top.totalDue || 0),
                    lastTransaction: detail?.transactions?.[0] || null
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
        const key = this.getApiKey();

        // 1. If OpenAI Key is configured
        if (this.provider === 'openai' && key) {
            try {
                return await this.chatOpenAI(history, userMessage, key);
            } catch (err) {
                console.warn('[LLMAgent] OpenAI chat failed, trying fallback:', err);
            }
        }

        // 2. If Gemini Key is configured
        if (this.provider === 'gemini' && key) {
            try {
                return await this.chatGemini(history, userMessage, key);
            } catch (err) {
                console.warn('[LLMAgent] Gemini chat failed, trying fallback:', err);
            }
        }

        // 3. Fallback: High-Empathy Local Semantic Engine
        return await this.chatLocalEmpathetic(userMessage);
    }

    /**
     * OpenAI GPT-4o-mini / GPT-4o with Native Tool Calling & Streaming
     */
    async chatOpenAI(history, userMessage, key) {
        const messages = [
            { role: 'system', content: this.getSystemPrompt() }
        ];

        // Append recent conversation history (last 6 messages)
        const recentHistory = history.slice(-6);
        for (const item of recentHistory) {
            messages.push({
                role: item.sender === 'user' ? 'user' : 'assistant',
                content: item.text
            });
        }
        messages.push({ role: 'user', content: userMessage });

        const tools = this.getToolsSchema();

        // First round: Send to OpenAI
        let response = await fetch('https://api.openai.com/v1/chat/completions', {
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

        let result = await response.json();
        let message = result.choices[0].message;

        // Check if OpenAI wants to call tools
        if (message.tool_calls && message.tool_calls.length > 0) {
            messages.push(message); // add assistant's tool_calls message

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
     * Google Gemini 1.5/2.0 Flash with Native Tool Calling
     */
    async chatGemini(history, userMessage, key) {
        const url = `https://generativelanguage.googleapis.com/v1beta/models/${this.geminiModel}:generateContent?key=${key}`;

        const systemInstruction = {
            parts: [{ text: this.getSystemPrompt() }]
        };

        const contents = [];
        const recentHistory = history.slice(-6);
        for (const item of recentHistory) {
            contents.push({
                role: item.sender === 'user' ? 'user' : 'model',
                parts: [{ text: item.text }]
            });
        }
        contents.push({
            role: 'user',
            parts: [{ text: userMessage }]
        });

        // Gemini Function Declarations
        // Robust Gemini Tool Declarations with uppercase Protobuf types
        const geminiTools = [{
            functionDeclarations: this.getToolsSchema().map(t => {
                const props = t.function.parameters.properties || {};
                const uppercaseProps = {};
                for (const [key, val] of Object.entries(props)) {
                    uppercaseProps[key] = {
                        type: (val.type || 'STRING').toUpperCase(),
                        description: val.description || ''
                    };
                    if (val.enum) uppercaseProps[key].enum = val.enum;
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

        let response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                system_instruction: systemInstruction,
                contents,
                tools: geminiTools
            })
        });

        if (!response.ok) {
            const errData = await response.json().catch(() => ({}));
            console.warn('[Gemini API Warning]:', errData);
            // Fallback: try without tools if schema caused issue
            const simpleResp = await fetch(url, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    system_instruction: systemInstruction,
                    contents
                })
            });
            if (!simpleResp.ok) {
                throw new Error(errData.error?.message || `Gemini API Error: ${response.status}`);
            }
            const simpleRes = await simpleResp.json();
            const spoken = simpleRes.candidates?.[0]?.content?.parts?.[0]?.text || 'জি ভাইয়া, আমি আপনার কথা শুনেছি।';
            return { spoken, data: null };
        }

        let result = await response.json();
        let candidate = result.candidates?.[0]?.content;
        let functionCallPart = candidate?.parts?.find(p => p.functionCall);

        if (functionCallPart) {
            const { name, args } = functionCallPart.functionCall;
            const toolResult = await this.executeToolCall(name, args || {});

            contents.push(candidate);
            contents.push({
                role: 'function',
                parts: [{
                    functionResponse: {
                        name,
                        response: { content: toolResult }
                    }
                }]
            });

            // Second round with function result
            let secondResp = await fetch(url, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    system_instruction: systemInstruction,
                    contents
                })
            });

            if (secondResp.ok) {
                let secondResult = await secondResp.json();
                let spoken = secondResult.candidates?.[0]?.content?.parts?.[0]?.text || 'জি ভাইয়া, হিসাবটি যাচাই করেছি।';
                return { spoken, data: toolResult };
            }
        }

        const spoken = candidate?.parts?.[0]?.text || 'জি ভাইয়া, আমি আপনার কথা শুনেছি।';
        return { spoken, data: null };
    }

    /**
     * Empathetic Local Fallback (When no API key is yet configured)
     */
    async chatLocalEmpathetic(text) {
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

        // 4. Fallback with Guidance
        return {
            spoken: 'জি ভাইয়া, আমি আপনার কথা শুনেছি। চ্যাটজিপিটি (ChatGPT) লেভেলের পূর্ণাঙ্গ কণ্ঠ ও মানবিক বুদ্ধিমত্তা সার্বক্ষণিক সক্রিয় রাখতে উপরের সেটিংস থেকে আপনার এআই কী যুক্ত করে নিতে পারেন। এছাড়া আপনি যেকোনো কাস্টমারের বকেয়া বা ব্যাংক হিসাব সরাসরি জানতে পারেন।',
            data: null
        };
    }
}

export const llmAgent = new LLMAgent();

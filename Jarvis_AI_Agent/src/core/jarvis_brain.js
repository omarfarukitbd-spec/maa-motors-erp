import { skillRegistry } from './skill_registry.js';
import { memoryVault } from './memory_vault.js';
import { voiceSpeaker } from '../voice/voice_speaker.js';
import { ERPBridge } from '../bridge/erp_bridge.js';

export class JarvisBrain {
    constructor() {
        this.isProcessing = false;
        this.conversationHistory = [];
        this.listeners = [];
    }

    /**
     * Process an incoming voice or text command
     * @param {string} rawInput 
     * @returns {Promise<{spoken: string, data?: any}>}
     */
    async processCommand(rawInput) {
        const text = (rawInput || '').trim();
        if (!text) return null;

        this.isProcessing = true;
        this.addHistory('user', text);

        try {
            // 1. Fast Deterministic Rule & Skill Matcher (0ms Latency)
            const matchedSkill = skillRegistry.findMatchingSkill(text);

            if (matchedSkill) {
                const lower = text.toLowerCase();

                // Skill: Customer
                if (matchedSkill.id === 'skill_customer') {
                    // Extract probable customer name
                    let queryName = text
                        .replace(/(কাস্টমার|সাহেবের|ভাইয়ের|এর|বকেয়া|বাকী|হিসাব|ব্যালেন্স|কত|বলো|জানাও|দেখাও)/g, '')
                        .trim();
                    if (!queryName) queryName = text;

                    const res = await matchedSkill.execute('get_customer_due', { customer_name: queryName });
                    await this.handleResponse(res.spokenResponse, res.displayData);
                    return res;
                }

                // Skill: Analytics (Cash / Bank balances)
                if (matchedSkill.id === 'skill_analytics') {
                    const res = await matchedSkill.execute('get_financial_status', { detail_level: 'summary' });
                    await this.handleResponse(res.spokenResponse, res.displayData);
                    return res;
                }

                // Skill: Dubai Procurement Audit
                if (matchedSkill.id === 'skill_dubai') {
                    const res = await matchedSkill.execute('get_dubai_audit_status', {});
                    await this.handleResponse(res.spokenResponse, res.displayData);
                    return res;
                }

                // Skill: Memory (Remembering user facts)
                if (matchedSkill.id === 'skill_memory') {
                    const cleanContent = text
                        .replace(/(মনে\s*রাখবা|মনে\s*রেখো|নোট\s*নাও|ভুলে\s*যেও\s*না|সেভ\s*করো|যে)/gi, '')
                        .trim();

                    const res = await matchedSkill.execute('remember_fact', {
                        content: cleanContent || text,
                        category: lower.includes('পছন্দ') ? 'preference' : (lower.includes('নিয়ম') ? 'rule' : 'fact')
                    });
                    await this.handleResponse(res.spokenResponse, res.displayData);
                    return res;
                }
            }

            // 2. Smart Intent Fallback: Check if user spoke a customer name, phone, or location
            const custMatches = await ERPBridge.searchCustomers(text);
            if (Array.isArray(custMatches) && custMatches.length > 0) {
                const customerSkill = skillRegistry.get('skill_customer');
                if (customerSkill) {
                    const res = await customerSkill.execute('get_customer_due', { customer_name: text });
                    await this.handleResponse(res.spokenResponse, res.displayData);
                    return res;
                }
            }

            // 3. Fallback Conversational Response
            const memoryContext = memoryVault.getPromptContext();
            let defaultReply = 'জি ভাইয়া, আমি আপনার কথা শুনেছি। আপনি আমাকে কাস্টমারের বকেয়া, আজকের ক্যাশ ও ব্যাংক স্থিতি, দুবাই অডিট জানতে চাইতে পারেন, অথবা কোনো নতুন তথ্য মনে রাখতে বলতে পারেন।';

            if (text.includes('কেমন আছো') || text.includes('কেমন আছেন')) {
                defaultReply = 'আলহামদুলিল্লাহ ভাইয়া, আমি প্রস্তুত আছি। আপনার ব্যবসার যেকোনো হিসাব বা তথ্য জানাতে বলুন।';
            } else if (text.includes('তুমি কে') || text.includes('তোমার পরিচয়')) {
                defaultReply = 'আমি মেসার্স মা মোটরস-এর ব্যক্তিগত এআই সহকারী জার্ভিস। আপনার সমস্ত কাস্টমার লেজার, ব্যাংক ব্যালেন্স ও কন্টেইনার হিসাব আমি সার্বক্ষণিক নজরে রাখি।';
            }

            await this.handleResponse(defaultReply);
            return { spoken: defaultReply };

        } catch (err) {
            console.error('[JarvisBrain] Processing error:', err);
            const errReply = 'দুঃখিত ভাইয়া, এই মুহূর্তে কমান্ডটি প্রসেস করতে একটি সাময়িক সমস্যা হয়েছে।';
            await this.handleResponse(errReply);
            return { spoken: errReply };
        } finally {
            this.isProcessing = false;
        }
    }

    async handleResponse(spokenText, displayData = null) {
        this.addHistory('jarvis', spokenText, displayData);
        await voiceSpeaker.speak(spokenText);
    }

    addHistory(sender, text, data = null) {
        const item = {
            id: 'msg_' + Date.now(),
            sender, // 'user' | 'jarvis'
            text,
            data,
            time: new Date().toLocaleTimeString('bn-BD', { hour: '2-digit', minute: '2-digit' })
        };
        this.conversationHistory.push(item);
        this.notifyListeners(item);
    }

    onMessage(fn) {
        this.listeners.push(fn);
    }

    notifyListeners(newItem) {
        this.listeners.forEach(fn => {
            try { fn(newItem, this.conversationHistory); } catch (e) {}
        });
    }
}

export const jarvisBrain = new JarvisBrain();

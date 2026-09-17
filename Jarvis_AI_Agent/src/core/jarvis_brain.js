import { llmAgent } from './llm_agent.js';
import { voiceSpeaker } from '../voice/voice_speaker.js';

export class JarvisBrain {
    constructor() {
        this.isProcessing = false;
        this.conversationHistory = [];
        this.listeners = [];
        this.lastCommandText = '';
        this.lastCommandTime = 0;
    }

    /**
     * Process an incoming voice or text command using Cognitive LLM & Tool Calling
     * @param {string} rawInput 
     * @returns {Promise<{spoken: string, data?: any}>}
     */
    async processCommand(rawInput) {
        const text = (rawInput || '').trim();
        if (!text) return null;

        // Concurrency Guard: Mutex Lock to prevent parallel execution & duplicate speaking
        if (this.isProcessing) {
            console.warn(`[JarvisBrain] ⚠️ Mutex busy lock: dropped concurrent trigger: "${text}"`);
            return null;
        }

        // Deduplication Guard: Ignore identical commands within 2.5 seconds
        const now = Date.now();
        if (this.lastCommandText === text && (now - this.lastCommandTime < 2500)) {
            console.warn(`[JarvisBrain] ⚠️ Deduplication filter: dropped repeated command within 2.5s: "${text}"`);
            return null;
        }
        this.lastCommandText = text;
        this.lastCommandTime = now;

        this.isProcessing = true;
        this.addHistory('user', text);

        try {
            // Cognitive Conversational Reasoning with Emotional Acumen & Tool Execution
            const result = await llmAgent.chat(this.conversationHistory, text);

            if (result && result.spoken) {
                await this.handleResponse(result.spoken, result.data);
                return result;
            }

            const fallback = 'জি স্যার, আমি আপনার কথা শুনেছি। আপনার মা মোটরসের কাস্টমার বকেয়া বা ক্যাশ হিসাবের কোনো তথ্য প্রয়োজন হলে বলুন।';
            await this.handleResponse(fallback);
            return { spoken: fallback };

        } catch (err) {
            console.error('[JarvisBrain] Processing error:', err);
            const errReply = 'দুঃখিত স্যার, এই মুহূর্তে কমান্ডটি প্রসেস করতে একটি সাময়িক সমস্যা হয়েছে। আপনি কি আবার বলবেন?';
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
            try { fn(newItem, this.conversationHistory); } catch (e) {
                console.error('[JarvisBrain] Listener error:', e);
            }
        });
    }
}

export const jarvisBrain = new JarvisBrain();

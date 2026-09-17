import { llmAgent } from './llm_agent.js';
import { voiceSpeaker } from '../voice/voice_speaker.js';
import { JARVIS_CONFIG } from '../config.js';

/**
 * 🎛️ AI Brain & Voice Settings Modal Controller
 * Supports multi-provider key management and auto-failover:
 *  1. Google Gemini Flash (Google AI Studio)
 *  2. Groq Cloud LPU (Llama 3.3 + Whisper Large v3)
 *  3. OpenRouter Free Tier (20+ free models)
 *  4. OpenAI ChatGPT
 */
export class AISettingsModal {
    constructor() {
        if (typeof document === 'undefined') return;
        this.modalEl = document.getElementById('ai-settings-modal');
        this.openBtn = document.getElementById('open-ai-settings-btn');
        this.closeBtn = document.getElementById('close-ai-settings-modal');

        // Tabs
        this.geminiTab = document.getElementById('select-provider-gemini');
        this.groqTab = document.getElementById('select-provider-groq');
        this.openrouterTab = document.getElementById('select-provider-openrouter');
        this.openaiTab = document.getElementById('select-provider-openai');

        // Sections
        this.geminiSection = document.getElementById('gemini-config-section');
        this.groqSection = document.getElementById('groq-config-section');
        this.openrouterSection = document.getElementById('openrouter-config-section');
        this.openaiSection = document.getElementById('openai-config-section');

        // Inputs
        this.geminiKeyInput = document.getElementById('input-gemini-key');
        this.groqKeyInput = document.getElementById('input-groq-key');
        this.openrouterKeyInput = document.getElementById('input-openrouter-key');
        this.openaiKeyInput = document.getElementById('input-openai-key');
        this.autoFailoverToggle = document.getElementById('input-auto-failover-toggle');

        this.openaiVoiceSelect = document.getElementById('select-openai-voice');
        this.geminiVoiceSelect = document.getElementById('select-gemini-voice');

        // Visibility Toggles
        this.toggleGeminiKeyVis = document.getElementById('toggle-gemini-key-vis');
        this.toggleGroqKeyVis = document.getElementById('toggle-groq-key-vis');
        this.toggleOpenRouterKeyVis = document.getElementById('toggle-openrouter-key-vis');
        this.toggleOpenAIKeyVis = document.getElementById('toggle-openai-key-vis');

        // Diagnostic & Studio Controls
        this.saveTopBtn = document.getElementById('btn-save-ai-settings-top');
        this.closeFooterBtn = document.getElementById('close-ai-settings-footer-btn');
        this.testPingBtn = document.getElementById('btn-test-active-key');
        this.pingOutputEl = document.getElementById('studio-key-test-output');
        this.activeProviderBadge = document.getElementById('studio-active-provider-badge');
        this.totalKeysCountBadge = document.getElementById('studio-total-keys-count');
        this.activeVoiceBadge = document.getElementById('studio-active-voice-badge');

        // Actions
        this.previewBtn = document.getElementById('btn-preview-voice');
        this.saveBtn = document.getElementById('btn-save-ai-settings');
        this.feedbackEl = document.getElementById('ai-settings-feedback');

        this.currentProvider = 'gemini';

        this.init();
    }

    init() {
        if (!this.modalEl) return;

        // Open & Close
        if (this.openBtn) this.openBtn.addEventListener('click', () => this.open());
        if (this.closeBtn) this.closeBtn.addEventListener('click', () => this.close());
        if (this.closeFooterBtn) this.closeFooterBtn.addEventListener('click', () => this.close());
        this.modalEl.addEventListener('click', (e) => {
            if (e.target === this.modalEl) this.close();
        });

        // Tab Switching
        if (this.geminiTab) {
            this.geminiTab.addEventListener('click', () => this.switchProvider('gemini'));
        }
        if (this.groqTab) {
            this.groqTab.addEventListener('click', () => this.switchProvider('groq'));
        }
        if (this.openrouterTab) {
            this.openrouterTab.addEventListener('click', () => this.switchProvider('openrouter'));
        }
        if (this.openaiTab) {
            this.openaiTab.addEventListener('click', () => this.switchProvider('openai'));
        }

        // Visibility Toggles
        this._setupVisToggle(this.toggleGeminiKeyVis, this.geminiKeyInput);
        this._setupVisToggle(this.toggleGroqKeyVis, this.groqKeyInput);
        this._setupVisToggle(this.toggleOpenRouterKeyVis, this.openrouterKeyInput);
        this._setupVisToggle(this.toggleOpenAIKeyVis, this.openaiKeyInput);

        // Auto-preserve pasted keys immediately
        this._setupAutoPreserve(this.geminiKeyInput, 'jarvis_gemini_key', 'jarvis_gemini_keys');
        this._setupAutoPreserve(this.groqKeyInput, 'jarvis_groq_key', 'jarvis_groq_keys');
        this._setupAutoPreserve(this.openrouterKeyInput, 'jarvis_openrouter_key', 'jarvis_openrouter_keys');
        this._setupAutoPreserve(this.openaiKeyInput, 'jarvis_openai_key');

        // ElevenLabs inputs
        const elevenKeyInput = document.getElementById('input-elevenlabs-key');
        const elevenVoiceInput = document.getElementById('input-elevenlabs-voice-id');
        if (elevenKeyInput) {
            const saveEleven = () => {
                const val = (elevenKeyInput.value || '').trim();
                if (val) {
                    localStorage.setItem('jarvis_elevenlabs_key', val);
                    voiceSpeaker.setEngine('elevenlabs');
                    this.updateDiagnosticBadges();
                }
            };
            elevenKeyInput.addEventListener('change', saveEleven);
            elevenKeyInput.addEventListener('input', saveEleven);
        }
        if (elevenVoiceInput) {
            const saveVoice = () => {
                const val = (elevenVoiceInput.value || '').trim();
                if (val) {
                    localStorage.setItem('jarvis_elevenlabs_voice_id', val);
                    voiceSpeaker.setElevenLabsVoice(val);
                }
            };
            elevenVoiceInput.addEventListener('change', saveVoice);
            elevenVoiceInput.addEventListener('input', saveVoice);
        }

        // Voice Preview Button
        if (this.previewBtn) {
            this.previewBtn.addEventListener('click', () => this.testCurrentVoice());
        }

        // Save Settings Buttons (Main and Top)
        if (this.saveBtn) {
            this.saveBtn.addEventListener('click', () => this.saveSettings());
        }
        if (this.saveTopBtn) {
            this.saveTopBtn.addEventListener('click', () => this.saveSettings());
        }

        // Real-Time Ping Tester Button
        if (this.testPingBtn) {
            this.testPingBtn.addEventListener('click', () => this.testActiveKeyPing());
        }

        // Live diagnostic listeners
        if (this.geminiVoiceSelect) this.geminiVoiceSelect.addEventListener('change', () => this.updateDiagnosticBadges());
        if (this.openaiVoiceSelect) this.openaiVoiceSelect.addEventListener('change', () => this.updateDiagnosticBadges());
        if (this.geminiKeyInput) this.geminiKeyInput.addEventListener('input', () => this.updateDiagnosticBadges());
        if (this.groqKeyInput) this.groqKeyInput.addEventListener('input', () => this.updateDiagnosticBadges());
        if (this.openrouterKeyInput) this.openrouterKeyInput.addEventListener('input', () => this.updateDiagnosticBadges());
        if (this.openaiKeyInput) this.openaiKeyInput.addEventListener('input', () => this.updateDiagnosticBadges());

        // Populate Existing Values
        this.loadSettings();
    }

    _setupVisToggle(btn, input) {
        if (!btn || !input) return;
        btn.addEventListener('click', () => {
            const isPass = input.type === 'password';
            input.type = isPass ? 'text' : 'password';
        });
    }

    _setupAutoPreserve(input, storageKey, multiKeyStorage = null) {
        if (!input) return;
        const save = () => {
            const val = (input.value || '').trim();
            if (val) {
                localStorage.setItem(storageKey, val);
                if (multiKeyStorage) {
                    localStorage.setItem(multiKeyStorage, val);
                }
            }
        };
        input.addEventListener('change', save);
        input.addEventListener('input', save);
    }

    open() {
        this.loadSettings();
        this.modalEl.classList.remove('hidden');
    }

    close() {
        this.modalEl.classList.add('hidden');
        if (this.feedbackEl) this.feedbackEl.classList.add('hidden');
    }

    switchProvider(provider) {
        this.currentProvider = provider;
        const tabs = [
            { id: 'gemini', tab: this.geminiTab, sec: this.geminiSection },
            { id: 'groq', tab: this.groqTab, sec: this.groqSection },
            { id: 'openrouter', tab: this.openrouterTab, sec: this.openrouterSection },
            { id: 'openai', tab: this.openaiTab, sec: this.openaiSection }
        ];

        tabs.forEach(item => {
            if (item.id === provider) {
                item.tab?.classList.add('active');
                item.sec?.classList.remove('hidden');
            } else {
                item.tab?.classList.remove('active');
                item.sec?.classList.add('hidden');
            }
        });
        this.updateDiagnosticBadges();
    }

    loadSettings() {
        const geminiKey = localStorage.getItem('jarvis_gemini_key') || localStorage.getItem('jarvis_gemini_keys') || '';
        const groqKey = localStorage.getItem('jarvis_groq_key') || localStorage.getItem('jarvis_groq_keys') || '';
        const openrouterKey = localStorage.getItem('jarvis_openrouter_key') || localStorage.getItem('jarvis_openrouter_keys') || '';
        const openAIKey = localStorage.getItem('jarvis_openai_key') || '';
        const elevenLabsKey = localStorage.getItem('jarvis_elevenlabs_key') || '';
        const gcpKey = localStorage.getItem('jarvis_gcp_tts_key') || '';
        const selectedVoice = localStorage.getItem('jarvis_openai_voice') || 'onyx';
        const selectedAzureVoice = localStorage.getItem('jarvis_azure_voice') || 'bn-BD-PradeepNeural';
        const elevenLabsVoiceId = localStorage.getItem('jarvis_elevenlabs_voice_id') || '';
        const autoFailover = localStorage.getItem('jarvis_auto_failover') !== 'false';

        let provider = localStorage.getItem('jarvis_ai_provider') || 'gemini';
        if (!geminiKey && groqKey) {
            provider = 'groq';
        } else if (!geminiKey && !groqKey && openrouterKey) {
            provider = 'openrouter';
        } else if (!geminiKey && !groqKey && !openrouterKey && openAIKey) {
            provider = 'openai';
        }

        this.switchProvider(provider);

        if (this.geminiKeyInput) this.geminiKeyInput.value = geminiKey;
        if (this.groqKeyInput) this.groqKeyInput.value = groqKey;
        if (this.openrouterKeyInput) this.openrouterKeyInput.value = openrouterKey;
        if (this.openaiKeyInput) this.openaiKeyInput.value = openAIKey;
        if (this.autoFailoverToggle) this.autoFailoverToggle.checked = autoFailover;

        if (this.openaiVoiceSelect) this.openaiVoiceSelect.value = selectedVoice;
        if (this.geminiVoiceSelect) this.geminiVoiceSelect.value = selectedAzureVoice;

        const elevenKeyInput = document.getElementById('input-elevenlabs-key');
        if (elevenKeyInput) elevenKeyInput.value = elevenLabsKey;
        const elevenVoiceInput = document.getElementById('input-elevenlabs-voice-id');
        if (elevenVoiceInput) elevenVoiceInput.value = elevenLabsVoiceId;

        const gcpKeyInput = document.getElementById('input-gcp-tts-key');
        if (gcpKeyInput) gcpKeyInput.value = gcpKey;

        this.updateDiagnosticBadges();
    }

    async testCurrentVoice() {
        await voiceSpeaker.unlockAudio();

        const elevenKeyInput = document.getElementById('input-elevenlabs-key');
        const elevenVoiceInput = document.getElementById('input-elevenlabs-voice-id');
        const openAIKey = (this.openaiKeyInput?.value || '').trim();
        const geminiKey = (this.geminiKeyInput?.value || '').trim();
        const elevenLabsKey = (elevenKeyInput?.value || '').trim();
        const elevenVoiceId = (elevenVoiceInput?.value || '').trim();

        if (elevenLabsKey) {
            localStorage.setItem('jarvis_elevenlabs_key', elevenLabsKey);
            voiceSpeaker.setElevenLabsVoice(elevenVoiceId);
            voiceSpeaker.setEngine('elevenlabs');
        }
        if (geminiKey) {
            localStorage.setItem('jarvis_gemini_key', geminiKey);
        }
        if (openAIKey) {
            localStorage.setItem('jarvis_openai_key', openAIKey);
        }

        if (this.currentProvider === 'openai') {
            const selectedVoice = this.openaiVoiceSelect?.value || 'onyx';
            voiceSpeaker.setOpenAIVoice(selectedVoice);
            voiceSpeaker.setEngine('openai');
        } else {
            const selectedAzureVoice = this.geminiVoiceSelect?.value || 'bn-BD-PradeepNeural';
            voiceSpeaker.setAzureVoice(selectedAzureVoice);
            if (elevenLabsKey) {
                voiceSpeaker.setEngine('elevenlabs');
            } else {
                voiceSpeaker.setEngine('free-bengali');
            }
        }

        // Play chime sound first for instant audible confirmation
        try {
            if (window.wakeWordListener && typeof window.wakeWordListener.playWakeChime === 'function') {
                await window.wakeWordListener.playWakeChime();
            }
        } catch (e) {
            console.warn('[AISettingsModal] Chime error:', e);
        }

        const testPhrase = 'আসসালামু আলাইকুম স্যার! আমি জার্ভিস। আপনার মা মোটরসের যাবতীয় হিসাব দেখতে আমি সম্পূর্ণ প্রস্তুত আছি।';

        if (this.previewBtn) {
            const originalHtml = this.previewBtn.innerHTML;
            this.previewBtn.innerHTML = '<span>🔊 প্লে হচ্ছে...</span>';
            try {
                await voiceSpeaker.speak(testPhrase);
            } catch (e) {
                console.error('Preview error:', e);
            } finally {
                this.previewBtn.innerHTML = originalHtml;
            }
        }
    }

    async validateGeminiKey(key) {
        const cleanKey = (key || '').split(/[\n,;]+/)[0].trim();
        if (!cleanKey || cleanKey.length < 15) {
            return {
                valid: false,
                message: 'দয়া করে একটি সঠিক জেমিনি এপিআই কী প্রদান করুন।'
            };
        }
        if (cleanKey.startsWith('gsk_')) {
            return { valid: false, message: 'এটি Groq Cloud-এর কী (gsk_...)! অনুগ্রহ করে "Groq Cloud (LPU)" ট্যাবে দিন।' };
        }
        if (cleanKey.startsWith('sk-or-v1-')) {
            return { valid: false, message: 'এটি OpenRouter-এর কী (sk-or-v1-...)! অনুগ্রহ করে "OpenRouter" ট্যাবে দিন।' };
        }
        if (cleanKey.startsWith('sk-proj-') || cleanKey.startsWith('sk-jk')) {
            return { valid: false, message: 'এটি OpenAI বা OmniRouters-এর কী! অনুগ্রহ করে সংশ্লিষ্ট ট্যাবে দিন।' };
        }

        const modelsToTry = ['gemini-3.6-flash', 'gemini-3.5-flash', 'gemini-3.1-flash-lite', 'gemini-flash-latest'];
        let lastError = '';

        for (const model of modelsToTry) {
            try {
                const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${encodeURIComponent(cleanKey)}`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        contents: [{ role: 'user', parts: [{ text: 'test' }] }]
                    })
                });
                if (res.ok) {
                    localStorage.setItem('jarvis_gemini_model', model);
                    if (typeof llmAgent !== 'undefined' && llmAgent) {
                        llmAgent.geminiModel = model;
                    }
                    return { valid: true };
                }
                const data = await res.json().catch(() => ({}));
                lastError = data.error?.message || `HTTP ${res.status}`;
            } catch (err) {
                console.error('[AISettingsModal] Gemini validation model error:', err);
                lastError = err.message;
            }
        }

        if (lastError.includes('401') || lastError.includes('INVALID_ARGUMENT') || lastError.includes('API key not valid')) {
            lastError = 'গুগল সার্ভারে এই কী-টি সঠিক নয়। দয়া করে Google AI Studio থেকে সঠিক API Key কপি করুন।';
        }
        return { valid: false, message: lastError };
    }

    async validateGroqKey(key) {
        const cleanKey = (key || '').split(/[\n,;]+/)[0].trim();
        if (!cleanKey || cleanKey.length < 15) {
            return { valid: false, message: 'দয়া করে একটি সঠিক Groq এপিআই কী প্রদান করুন।' };
        }
        if (cleanKey.startsWith('AIzaSy')) {
            return { valid: false, message: 'এটি Google Gemini-এর কী (AIzaSy...)! অনুগ্রহ করে "Google Gemini Flash" ট্যাবে দিন।' };
        }
        if (cleanKey.startsWith('sk-or-v1-')) {
            return { valid: false, message: 'এটি OpenRouter-এর কী (sk-or-v1-...)! অনুগ্রহ করে "OpenRouter (Free)" ট্যাবে দিন।' };
        }
        if (!cleanKey.startsWith('gsk_')) {
            return { valid: false, message: 'Groq Cloud কী সর্বদা "gsk_..." দিয়ে শুরু হয়। দয়া করে console.groq.com/keys থেকে সঠিক কী কপি করুন।' };
        }

        try {
            const res = await fetch('https://api.groq.com/openai/v1/models', {
                headers: { 'Authorization': `Bearer ${cleanKey}` }
            });
            if (res.ok) return { valid: true };
            const data = await res.json().catch(() => ({}));
            let msg = data.error?.message || `HTTP ${res.status}`;
            if (msg.includes('Invalid API Key') || msg.includes('401')) {
                msg = 'Groq সার্ভার এই কী-টি সঠিক হিসেবে চিহ্নিত করেনি। দয়া করে console.groq.com/keys থেকে কী-টি পুনরায় কপি করুন।';
            }
            return { valid: false, message: msg };
        } catch (err) {
            console.error('[AISettingsModal] Groq validation error:', err);
            return { valid: false, message: err.message };
        }
    }

    async validateOpenRouterKey(key) {
        const cleanKey = (key || '').split(/[\n,;]+/)[0].trim();
        if (!cleanKey || cleanKey.length < 15) {
            return { valid: false, message: 'দয়া করে একটি সঠিক OpenRouter এপিআই কী প্রদান করুন।' };
        }

        // Smart prefix checking
        if (cleanKey.startsWith('AIzaSy')) {
            return {
                valid: false,
                message: 'এটি Google Gemini-এর কী (AIzaSy...)! অনুগ্রহ করে উপরে "Google Gemini Flash" ট্যাবে ক্লিক করে সেখানে কী-টি দিন।'
            };
        }
        if (cleanKey.startsWith('gsk_')) {
            return {
                valid: false,
                message: 'এটি Groq Cloud-এর কী (gsk_...)! অনুগ্রহ করে উপরে "Groq Cloud (LPU)" ট্যাবে ক্লিক করে সেখানে কী-টি দিন।'
            };
        }
        if (cleanKey.startsWith('sk-jk')) {
            try {
                const res = await fetch('https://omnirouters.com/v1/models', {
                    headers: { 'Authorization': `Bearer ${cleanKey}` }
                });
                if (res.ok) return { valid: true };
                const data = await res.json().catch(() => ({}));
                let msg = data.error?.message || `HTTP ${res.status}`;
                if (msg.includes('Invalid token') || res.status === 401) {
                    msg = 'OmniRouters সার্ভারে টোকেনটি এখনও সক্রিয় হয়নি (Invalid token)। অনুগ্রহ করে ব্রাউজারের ৪ নম্বর ট্যাবে "OmniRouters Email Verification" সম্পূর্ণ করুন অথবা omnirouters.com/keys থেকে নতুন টোকেন তৈরি করুন।';
                }
                return { valid: false, message: msg };
            } catch (err) {
                console.error('[AISettingsModal] OmniRouters validation error:', err);
                return { valid: false, message: err.message };
            }
        }
        if (cleanKey.startsWith('sk-proj-') || (cleanKey.startsWith('sk-') && !cleanKey.startsWith('sk-or-v1-'))) {
            return {
                valid: false,
                message: 'এটি OpenAI ChatGPT-এর কী! অনুগ্রহ করে উপরে "OpenAI (ChatGPT)" ট্যাবে ক্লিক করে সেখানে কী-টি দিন।'
            };
        }
        if (!cleanKey.startsWith('sk-or-v1-')) {
            return {
                valid: false,
                message: 'ওপেনরাউটার (OpenRouter) এপিআই কী সর্বদা "sk-or-v1-" দিয়ে শুরু হয়। দয়া করে openrouter.ai/keys থেকে সঠিক কী কপি করুন।'
            };
        }

        try {
            const res = await fetch('https://openrouter.ai/api/v1/auth/key', {
                headers: {
                    'Authorization': `Bearer ${cleanKey}`,
                    'HTTP-Referer': typeof window !== 'undefined' ? window.location.origin : 'https://maa-motors-erp.web.app',
                    'X-Title': 'Maa Motors Jarvis AI'
                }
            });
            if (res.ok) return { valid: true };
            const data = await res.json().catch(() => ({}));
            let msg = data.error?.message || `HTTP ${res.status}`;
            if (msg.includes('Missing Authentication header') || msg.includes('User not found') || msg.includes('401')) {
                msg = 'ওপেনরাউটার সার্ভার এই কী-টি সঠিক হিসেবে চিহ্নিত করেনি। অনুগ্রহ করে openrouter.ai/keys থেকে কী-টি পুনরায় কপি করুন।';
            }
            return { valid: false, message: msg };
        } catch (err) {
            console.error('[AISettingsModal] OpenRouter validation error:', err);
            return { valid: false, message: err.message };
        }
    }

    async validateOpenAIKey(key) {
        const cleanKey = (key || '').trim();
        if (!cleanKey || cleanKey.length < 15) {
            return { valid: false, message: 'দয়া করে একটি সঠিক OpenAI এপিআই কী প্রদান করুন।' };
        }
        if (cleanKey.startsWith('AIzaSy')) {
            return { valid: false, message: 'এটি Google Gemini-এর কী (AIzaSy...)! অনুগ্রহ করে "Google Gemini Flash" ট্যাবে দিন।' };
        }
        if (cleanKey.startsWith('gsk_')) {
            return { valid: false, message: 'এটি Groq Cloud-এর কী (gsk_...)! অনুগ্রহ করে "Groq Cloud (LPU)" ট্যাবে দিন।' };
        }
        if (cleanKey.startsWith('sk-or-v1-')) {
            return { valid: false, message: 'এটি OpenRouter-এর কী (sk-or-v1-...)! অনুগ্রহ করে "OpenRouter (Free)" ট্যাবে দিন।' };
        }

        try {
            const res = await fetch('https://api.openai.com/v1/models', {
                headers: { 'Authorization': `Bearer ${cleanKey}` }
            });
            if (res.ok) return { valid: true };
            const data = await res.json().catch(() => ({}));
            return { valid: false, message: data.error?.message || `HTTP ${res.status}` };
        } catch (err) {
            console.error('[AISettingsModal] OpenAI validation error:', err);
            return { valid: false, message: err.message };
        }
    }

    async saveSettings() {
        const provider = this.currentProvider || 'gemini';
        const geminiKey = (this.geminiKeyInput?.value || '').trim();
        const groqKey = (this.groqKeyInput?.value || '').trim();
        const openrouterKey = (this.openrouterKeyInput?.value || '').trim();
        const openAIKey = (this.openaiKeyInput?.value || '').trim();
        const autoFailover = this.autoFailoverToggle ? this.autoFailoverToggle.checked : true;

        const selectedVoice = this.openaiVoiceSelect?.value || 'onyx';
        const selectedAzureVoice = this.geminiVoiceSelect?.value || 'bn-BD-PradeepNeural';

        const elevenKeyInput = document.getElementById('input-elevenlabs-key');
        const elevenVoiceInput = document.getElementById('input-elevenlabs-voice-id');
        const gcpKeyInput = document.getElementById('input-gcp-tts-key');

        const elevenLabsKey = (elevenKeyInput?.value || '').trim();
        const elevenLabsVoiceId = (elevenVoiceInput?.value || '').trim();
        const gcpKey = (gcpKeyInput?.value || '').trim();

        // 🚨 CRITICAL: Save all keys to localStorage FIRST
        if (geminiKey) {
            localStorage.setItem('jarvis_gemini_key', geminiKey);
            localStorage.setItem('jarvis_gemini_keys', geminiKey);
        }
        if (groqKey) {
            localStorage.setItem('jarvis_groq_key', groqKey);
            localStorage.setItem('jarvis_groq_keys', groqKey);
        }
        if (openrouterKey) {
            localStorage.setItem('jarvis_openrouter_key', openrouterKey);
            localStorage.setItem('jarvis_openrouter_keys', openrouterKey);
        }
        if (openAIKey) localStorage.setItem('jarvis_openai_key', openAIKey);

        localStorage.setItem('jarvis_auto_failover', autoFailover ? 'true' : 'false');
        localStorage.setItem('jarvis_ai_provider', provider);
        localStorage.setItem('jarvis_openai_voice', selectedVoice);
        localStorage.setItem('jarvis_azure_voice', selectedAzureVoice);

        if (elevenLabsKey) {
            localStorage.setItem('jarvis_elevenlabs_key', elevenLabsKey);
            voiceSpeaker.setElevenLabsVoice(elevenLabsVoiceId);
            voiceSpeaker.setEngine('elevenlabs');
        }
        if (elevenLabsVoiceId) localStorage.setItem('jarvis_elevenlabs_voice_id', elevenLabsVoiceId);
        if (gcpKey) {
            localStorage.setItem('jarvis_gcp_tts_key', gcpKey);
        }

        // Update llmAgent provider and failover state
        llmAgent.setProvider(provider);
        llmAgent.autoFailover = autoFailover;

        // Configure voice speaker
        if (elevenLabsKey) {
            voiceSpeaker.setEngine('elevenlabs');
        } else if (provider === 'openai' && openAIKey) {
            voiceSpeaker.setOpenAIVoice(selectedVoice);
            voiceSpeaker.setEngine('openai');
        } else if (gcpKey) {
            voiceSpeaker.setEngine('gcp');
        } else {
            voiceSpeaker.setAzureVoice(selectedAzureVoice);
            voiceSpeaker.setEngine('free-bengali');
        }

        // Sync header voice selector
        const headerVoiceSelector = document.getElementById('voice-selector');
        if (headerVoiceSelector) {
            headerVoiceSelector.value = provider === 'openai' ? selectedVoice : selectedAzureVoice;
        }

        if (this.feedbackEl) {
            this.feedbackEl.className = 'settings-feedback-msg';
            this.feedbackEl.innerText = '🔍 এআই কী যাচাই করা হচ্ছে...';
            this.feedbackEl.classList.remove('hidden');
        }

        // Live validation for active provider key if entered
        if (provider === 'gemini' && geminiKey) {
            const valResult = await this.validateGeminiKey(geminiKey);
            if (!valResult.valid) {
                if (this.feedbackEl) {
                    this.feedbackEl.className = 'settings-feedback-msg error';
                    this.feedbackEl.innerText = `❌ জেমিনি কী সঠিক নয়: ${valResult.message}`;
                }
                return;
            }
        } else if (provider === 'groq' && groqKey) {
            const valResult = await this.validateGroqKey(groqKey);
            if (!valResult.valid) {
                if (this.feedbackEl) {
                    this.feedbackEl.className = 'settings-feedback-msg error';
                    this.feedbackEl.innerText = `❌ Groq কী সঠিক নয়: ${valResult.message}`;
                }
                return;
            }
        } else if (provider === 'openrouter' && openrouterKey) {
            const valResult = await this.validateOpenRouterKey(openrouterKey);
            if (!valResult.valid) {
                if (this.feedbackEl) {
                    this.feedbackEl.className = 'settings-feedback-msg error';
                    this.feedbackEl.innerText = `❌ OpenRouter কী সঠিক নয়: ${valResult.message}`;
                }
                return;
            }
        } else if (provider === 'openai' && openAIKey) {
            const valResult = await this.validateOpenAIKey(openAIKey);
            if (!valResult.valid) {
                if (this.feedbackEl) {
                    this.feedbackEl.className = 'settings-feedback-msg error';
                    this.feedbackEl.innerText = `❌ ওপেনএআই কী সঠিক নয়: ${valResult.message}`;
                }
                return;
            }
        }

        const providerNames = {
            gemini: 'গুগল জেমিনি (Google Gemini)',
            groq: 'গ্রক ক্লাউড (Groq LPU Llama-3.3)',
            openrouter: 'ওপেনরাউটার (OpenRouter Free)',
            openai: 'ওপেনএআই চ্যাটজিপিটি (OpenAI ChatGPT)'
        };

        if (this.feedbackEl) {
            this.feedbackEl.className = 'settings-feedback-msg success';
            this.feedbackEl.innerText = `✅ ${providerNames[provider] || provider} ও স্মার্ট ভয়েস সফলভাবে সক্রিয় হয়েছে!`;
            this.feedbackEl.classList.remove('hidden');

            this.updateDiagnosticBadges();

            setTimeout(() => {
                this.close();
            }, 1200);
        }
    }

    updateDiagnosticBadges() {
        const providerTitles = {
            gemini: 'Google Gemini',
            groq: 'Groq Cloud (LPU)',
            openrouter: 'OpenRouter Free',
            openai: 'OpenAI ChatGPT'
        };

        if (this.activeProviderBadge) {
            this.activeProviderBadge.textContent = providerTitles[this.currentProvider] || this.currentProvider;
        }

        // Calculate total keys across all inputs
        const geminiKeys = (this.geminiKeyInput?.value || '').split(/[\n,;]+/).filter(k => k.trim().length > 10);
        const groqKeys = (this.groqKeyInput?.value || '').split(/[\n,;]+/).filter(k => k.trim().length > 10);
        const openrouterKeys = (this.openrouterKeyInput?.value || '').split(/[\n,;]+/).filter(k => k.trim().length > 10);
        const openaiKey = (this.openaiKeyInput?.value || '').trim();
        const totalCount = geminiKeys.length + groqKeys.length + openrouterKeys.length + (openaiKey.length > 10 ? 1 : 0);

        if (this.totalKeysCountBadge) {
            this.totalKeysCountBadge.textContent = totalCount > 0 ? `${totalCount} টি সক্রিয় কী` : 'কোনো কী নেই';
            this.totalKeysCountBadge.className = totalCount > 0 ? 'diag-val-badge green' : 'diag-val-badge';
        }

        if (this.activeVoiceBadge) {
            const elevenKey = (document.getElementById('input-elevenlabs-key')?.value || '').trim();
            if (elevenKey) {
                this.activeVoiceBadge.textContent = 'ElevenLabs Neural';
                this.activeVoiceBadge.className = 'diag-val-badge green';
            } else if (this.currentProvider === 'openai') {
                const voice = this.openaiVoiceSelect?.value || 'onyx';
                this.activeVoiceBadge.textContent = `ChatGPT (${voice})`;
                this.activeVoiceBadge.className = 'diag-val-badge';
            } else {
                const voice = this.geminiVoiceSelect?.value === 'bn-BD-NabanitaNeural' ? 'নবনিতা' : 'প্রদীপ';
                this.activeVoiceBadge.textContent = `Microsoft Natural (${voice})`;
                this.activeVoiceBadge.className = 'diag-val-badge green';
            }
        }
    }

    async testActiveKeyPing() {
        if (!this.pingOutputEl) return;
        this.pingOutputEl.innerHTML = '<span style="color: #38bdf8;">🔄 সক্রিয় প্রোভাইডার ও কী পিং করা হচ্ছে...</span>';

        const provider = this.currentProvider || 'gemini';
        let key = '';
        if (provider === 'gemini') {
            key = (this.geminiKeyInput?.value || localStorage.getItem('jarvis_gemini_key') || '').split(/[\n,;]+/)[0].trim();
        } else if (provider === 'groq') {
            key = (this.groqKeyInput?.value || localStorage.getItem('jarvis_groq_key') || '').split(/[\n,;]+/)[0].trim();
        } else if (provider === 'openrouter') {
            key = (this.openrouterKeyInput?.value || localStorage.getItem('jarvis_openrouter_key') || '').split(/[\n,;]+/)[0].trim();
        } else if (provider === 'openai') {
            key = (this.openaiKeyInput?.value || localStorage.getItem('jarvis_openai_key') || '').trim();
        }

        if (!key) {
            this.pingOutputEl.innerHTML = `<span style="color: #f87171;">❌ কোনো কী পাওয়া যায়নি! অনুগ্রহ করে ${provider.toUpperCase()} ইনপুটে সঠিক API Key দিন।</span>`;
            return;
        }

        // Smart mismatch detection
        if (provider === 'openrouter' && key.startsWith('AIzaSy')) {
            this.pingOutputEl.innerHTML = '<span style="color: #fbbf24;">⚠️ আপনি OpenRouter ট্যাবে আছেন, কিন্তু যে কী-টি দিয়েছেন তা Google Gemini-এর (AIzaSy... দিয়ে শুরু)!<br>অনুগ্রহ করে উপরে "Google Gemini Flash" ট্যাবে ক্লিক করে এই কী-টি সেখানে সেভ ও টেস্ট করুন।</span>';
            return;
        }
        if (provider === 'gemini' && key.startsWith('sk-or-v1-')) {
            this.pingOutputEl.innerHTML = '<span style="color: #fbbf24;">⚠️ আপনি Google Gemini ট্যাবে আছেন, কিন্তু যে কী-টি দিয়েছেন তা OpenRouter-এর (sk-or-v1-...)!<br>অনুগ্রহ করে উপরে "OpenRouter (Free)" ট্যাবে গিয়ে এই কী-টি সেভ ও টেস্ট করুন।</span>';
            return;
        }
        if (provider === 'gemini' && key.startsWith('gsk_')) {
            this.pingOutputEl.innerHTML = '<span style="color: #fbbf24;">⚠️ এটি Groq Cloud-এর কী (gsk_...)!<br>অনুগ্রহ করে উপরে "Groq Cloud (LPU)" ট্যাবে ক্লিক করে সেখানে সেভ করুন।</span>';
            return;
        }
        if (provider === 'groq' && key.startsWith('AIzaSy')) {
            this.pingOutputEl.innerHTML = '<span style="color: #fbbf24;">⚠️ আপনি Groq ট্যাবে আছেন, কিন্তু যে কী-টি দিয়েছেন তা Google Gemini-এর (AIzaSy...)!<br>অনুগ্রহ করে উপরে "Google Gemini Flash" ট্যাবে কী-টি দিন।</span>';
            return;
        }

        const startTime = performance.now();
        try {
            if (provider === 'gemini') {
                const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-3.6-flash:generateContent?key=${encodeURIComponent(key)}`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ contents: [{ role: 'user', parts: [{ text: 'ping' }] }] })
                });
                const elapsed = Math.round(performance.now() - startTime);
                if (res.ok) {
                    this.pingOutputEl.innerHTML = `<span style="color: #34d399;">⚡ কানেকশন সফল! লেটেন্সি: <strong>${elapsed}ms</strong><br>গুগল সার্ভার লাইভ এবং মডেল gemini-3.6-flash সম্পূর্ণ রেডি!</span>`;
                } else {
                    const data = await res.json().catch(() => ({}));
                    const msg = data.error?.message || `HTTP ${res.status}`;
                    this.pingOutputEl.innerHTML = `<span style="color: #f87171;">❌ গুগল সার্ভার এরর (${res.status}): ${msg}</span>`;
                }
            } else if (provider === 'groq') {
                const res = await fetch('https://api.groq.com/openai/v1/models', {
                    headers: { 'Authorization': `Bearer ${key}` }
                });
                const elapsed = Math.round(performance.now() - startTime);
                if (res.ok) {
                    this.pingOutputEl.innerHTML = `<span style="color: #34d399;">⚡ Groq LPU কানেকশন সফল! লেটেন্সি: <strong>${elapsed}ms</strong><br>মডেল: <em>Llama-3.3-70b-versatile</em> প্রস্তুত।</span>`;
                } else {
                    const data = await res.json().catch(() => ({}));
                    this.pingOutputEl.innerHTML = `<span style="color: #f87171;">❌ Groq এরর: ${data.error?.message || res.statusText}</span>`;
                }
            } else if (provider === 'openrouter') {
                if (key.startsWith('sk-jk')) {
                    // Direct live ping to OmniRouters endpoint
                    const res = await fetch('https://omnirouters.com/v1/models', {
                        headers: { 'Authorization': `Bearer ${key}` }
                    });
                    const elapsed = Math.round(performance.now() - startTime);
                    if (res.ok) {
                        this.pingOutputEl.innerHTML = `<span style="color: #34d399;">⚡ OmniRouters কানেক্টেড! লেটেন্সি: <strong>${elapsed}ms</strong><br>OmniRouters মডেল ক্লাস্টার সম্পূর্ণ রেডি ও প্রস্তুত!</span>`;
                    } else {
                        const data = await res.json().catch(() => ({}));
                        let msg = data.error?.message || res.statusText;
                        if (msg.includes('Invalid token') || res.status === 401) {
                            msg = 'OmniRouters সার্ভার জানিয়েছে: <strong>Invalid token (টোকেন নিষ্ক্রিয়)</strong>。<br>অনুগ্রহ করে আপনার ব্রাউজারের ৪ নম্বর ট্যাবে থাকা <strong>"OmniRouters Email Verification"</strong> (Gmail)-এ গিয়ে ইমেইল ভেরিফাই করুন অথবা omnirouters.com/keys থেকে নতুন টোকেন তৈরি করুন।';
                        }
                        this.pingOutputEl.innerHTML = `<span style="color: #f87171;">❌ OmniRouters এরর: ${msg}</span>`;
                    }
                    return;
                }

                const res = await fetch('https://openrouter.ai/api/v1/auth/key', {
                    headers: {
                        'Authorization': `Bearer ${key}`,
                        'HTTP-Referer': typeof window !== 'undefined' ? window.location.origin : 'https://maa-motors-erp.web.app',
                        'X-Title': 'Maa Motors Jarvis AI'
                    }
                });
                const elapsed = Math.round(performance.now() - startTime);
                if (res.ok) {
                    const data = await res.json().catch(() => ({}));
                    const limitInfo = data?.data?.limit !== null && data?.data?.limit !== undefined ? ` (ক্রেডিট: $${data.data.limit})` : '';
                    this.pingOutputEl.innerHTML = `<span style="color: #34d399;">⚡ OpenRouter কানেক্টেড! লেটেন্সি: <strong>${elapsed}ms</strong>${limitInfo}<br>ফ্রি মডেল ক্লাস্টার সম্পূর্ণ সক্রিয়।</span>`;
                } else {
                    const data = await res.json().catch(() => ({}));
                    let msg = data.error?.message || res.statusText;
                    if (msg.includes('Missing Authentication header') || msg.includes('User not found')) {
                        msg = 'OpenRouter সার্ভার এই কী-টি চিনতে পারেনি। কী-টি sk-or-v1- দিয়ে শুরু কি না নিশ্চিত করুন।';
                    }
                    this.pingOutputEl.innerHTML = `<span style="color: #f87171;">❌ OpenRouter এরর: ${msg}</span>`;
                }
            } else if (provider === 'openai') {
                const res = await fetch('https://api.openai.com/v1/models', {
                    headers: { 'Authorization': `Bearer ${key}` }
                });
                const elapsed = Math.round(performance.now() - startTime);
                if (res.ok) {
                    this.pingOutputEl.innerHTML = `<span style="color: #34d399;">⚡ OpenAI কানেক্টেড! লেটেন্সি: <strong>${elapsed}ms</strong><br>ChatGPT মডেল ও অফিসিয়াল ভয়েস প্রস্তুত।</span>`;
                } else {
                    const data = await res.json().catch(() => ({}));
                    this.pingOutputEl.innerHTML = `<span style="color: #f87171;">❌ OpenAI এরর: ${data.error?.message || res.statusText}</span>`;
                }
            }
        } catch (err) {
            console.error('[AISettingsModal] Ping error:', err);
            this.pingOutputEl.innerHTML = `<span style="color: #f87171;">❌ নেটওয়ার্ক এরর: ${err.message}</span>`;
        }
    }
}

export const aiSettingsModal = typeof document !== 'undefined' ? new AISettingsModal() : null;

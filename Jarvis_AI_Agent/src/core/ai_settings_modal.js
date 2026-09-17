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
        if (this.openrouterKeyInput) {
            const saveOmniOrOpen = () => {
                const val = (this.openrouterKeyInput.value || '').trim();
                if (val) {
                    if (val.startsWith('sk-jk')) {
                        localStorage.setItem('jarvis_omnirouters_key', val);
                        localStorage.setItem('jarvis_omnirouters_keys', val);
                        localStorage.setItem('jarvis_ai_provider', 'omnirouters');
                        if (typeof llmAgent !== 'undefined' && llmAgent) {
                            llmAgent.setProvider('omnirouters');
                        }
                    }
                    localStorage.setItem('jarvis_openrouter_key', val);
                    localStorage.setItem('jarvis_openrouter_keys', val);
                }
            };
            this.openrouterKeyInput.addEventListener('change', saveOmniOrOpen);
            this.openrouterKeyInput.addEventListener('input', saveOmniOrOpen);
        }
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

        // Save Settings Button
        if (this.saveBtn) {
            this.saveBtn.addEventListener('click', () => this.saveSettings());
        }

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
    }

    loadSettings() {
        const geminiKey = localStorage.getItem('jarvis_gemini_key') || localStorage.getItem('jarvis_gemini_keys') || '';
        const groqKey = localStorage.getItem('jarvis_groq_key') || localStorage.getItem('jarvis_groq_keys') || '';
        const omniKey = localStorage.getItem('jarvis_omnirouters_key') || localStorage.getItem('jarvis_omnirouters_keys') || '';
        const openrouterKey = omniKey || localStorage.getItem('jarvis_openrouter_key') || localStorage.getItem('jarvis_openrouter_keys') || '';
        const openAIKey = localStorage.getItem('jarvis_openai_key') || '';
        const elevenLabsKey = localStorage.getItem('jarvis_elevenlabs_key') || '';
        const gcpKey = localStorage.getItem('jarvis_gcp_tts_key') || '';
        const selectedVoice = localStorage.getItem('jarvis_openai_voice') || 'onyx';
        const selectedAzureVoice = localStorage.getItem('jarvis_azure_voice') || 'bn-BD-PradeepNeural';
        const elevenLabsVoiceId = localStorage.getItem('jarvis_elevenlabs_voice_id') || '';
        const autoFailover = localStorage.getItem('jarvis_auto_failover') !== 'false';

        let provider = localStorage.getItem('jarvis_ai_provider') || 'gemini';
        if (provider === 'omnirouters') {
            provider = 'openrouter';
        }
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

        const modelsToTry = ['gemini-2.0-flash', 'gemini-1.5-flash'];
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
        try {
            const res = await fetch('https://api.groq.com/openai/v1/models', {
                headers: { 'Authorization': `Bearer ${cleanKey}` }
            });
            if (res.ok) return { valid: true };
            const data = await res.json().catch(() => ({}));
            return { valid: false, message: data.error?.message || `HTTP ${res.status}` };
        } catch (err) {
            console.error('[AISettingsModal] Groq validation error:', err);
            return { valid: false, message: err.message };
        }
    }

    async validateOpenRouterKey(key) {
        const cleanKey = (key || '').split(/[\n,;]+/)[0].trim();
        if (!cleanKey || cleanKey.length < 15) {
            return { valid: false, message: 'দয়া করে একটি সঠিক OmniRouters বা OpenRouter এপিআই কী প্রদান করুন।' };
        }

        // OmniRouters (omnirouters.com) API Keys start with 'sk-jk'
        if (cleanKey.startsWith('sk-jk')) {
            localStorage.setItem('jarvis_omnirouters_key', cleanKey);
            localStorage.setItem('jarvis_omnirouters_keys', cleanKey);
            localStorage.setItem('jarvis_ai_provider', 'omnirouters');
            if (typeof llmAgent !== 'undefined' && llmAgent) {
                llmAgent.setProvider('omnirouters');
            }
            return { valid: true };
        }

        try {
            const res = await fetch('https://openrouter.ai/api/v1/auth/key', {
                headers: { 'Authorization': `Bearer ${cleanKey}` }
            });
            if (res.ok) return { valid: true };
            const data = await res.json().catch(() => ({}));
            return { valid: false, message: data.error?.message || `HTTP ${res.status}` };
        } catch (err) {
            console.error('[AISettingsModal] OpenRouter validation error:', err);
            return { valid: false, message: err.message };
        }
    }

    async validateOpenAIKey(key) {
        const cleanKey = (key || '').trim();
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
        let provider = this.currentProvider || 'gemini';
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
        if (openrouterKey.startsWith('sk-jk')) {
            localStorage.setItem('jarvis_omnirouters_key', openrouterKey);
            localStorage.setItem('jarvis_omnirouters_keys', openrouterKey);
            if (provider === 'openrouter') {
                provider = 'omnirouters';
            }
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
        } else if ((provider === 'openrouter' || provider === 'omnirouters') && openrouterKey) {
            const valResult = await this.validateOpenRouterKey(openrouterKey);
            if (!valResult.valid) {
                if (this.feedbackEl) {
                    this.feedbackEl.className = 'settings-feedback-msg error';
                    this.feedbackEl.innerText = `❌ কী সঠিক নয়: ${valResult.message}`;
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
            omnirouters: 'অমনিরাউটার্স (OmniRouters আনলিমিটেড এআই)',
            openrouter: 'ওপেনরাউটার (OpenRouter Free)',
            openai: 'ওপেনএআই চ্যাটজিপিটি (OpenAI ChatGPT)'
        };

        if (this.feedbackEl) {
            this.feedbackEl.className = 'settings-feedback-msg success';
            this.feedbackEl.innerText = `✅ ${providerNames[provider] || provider} ও স্মার্ট ভয়েস সফলভাবে সক্রিয় হয়েছে!`;
            this.feedbackEl.classList.remove('hidden');

            setTimeout(() => {
                this.close();
            }, 1200);
        }
    }
}

export const aiSettingsModal = new AISettingsModal();

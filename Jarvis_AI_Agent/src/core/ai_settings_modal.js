import { llmAgent } from './llm_agent.js';
import { voiceSpeaker } from '../voice/voice_speaker.js';
import { JARVIS_CONFIG } from '../config.js';

/**
 * 🎛️ AI Brain & Voice Settings Modal Controller
 * Allows seamless switching between ChatGPT (OpenAI) and Google Gemini with live voice testing.
 */
export class AISettingsModal {
    constructor() {
        this.modalEl = document.getElementById('ai-settings-modal');
        this.openBtn = document.getElementById('open-ai-settings-btn');
        this.closeBtn = document.getElementById('close-ai-settings-modal');

        // Tabs
        this.openaiTab = document.getElementById('select-provider-openai');
        this.geminiTab = document.getElementById('select-provider-gemini');
        this.openaiSection = document.getElementById('openai-config-section');
        this.geminiSection = document.getElementById('gemini-config-section');

        // Inputs
        this.openaiKeyInput = document.getElementById('input-openai-key');
        this.geminiKeyInput = document.getElementById('input-gemini-key');
        this.openaiVoiceSelect = document.getElementById('select-openai-voice');
        this.geminiVoiceSelect = document.getElementById('select-gemini-voice');
        this.toggleOpenAIKeyVis = document.getElementById('toggle-openai-key-vis');
        this.toggleGeminiKeyVis = document.getElementById('toggle-gemini-key-vis');

        // Actions
        this.previewBtn = document.getElementById('btn-preview-voice');
        this.saveBtn = document.getElementById('btn-save-ai-settings');
        this.feedbackEl = document.getElementById('ai-settings-feedback');

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
        if (this.openaiTab) {
            this.openaiTab.addEventListener('click', () => this.switchProvider('openai'));
        }
        if (this.geminiTab) {
            this.geminiTab.addEventListener('click', () => this.switchProvider('gemini'));
        }

        // Key Visibility Toggles
        if (this.toggleOpenAIKeyVis && this.openaiKeyInput) {
            this.toggleOpenAIKeyVis.addEventListener('click', () => {
                const isPass = this.openaiKeyInput.type === 'password';
                this.openaiKeyInput.type = isPass ? 'text' : 'password';
            });
        }
        if (this.toggleGeminiKeyVis && this.geminiKeyInput) {
            this.toggleGeminiKeyVis.addEventListener('click', () => {
                const isPass = this.geminiKeyInput.type === 'password';
                this.geminiKeyInput.type = isPass ? 'text' : 'password';
            });
        }

        // Auto-preserve pasted/typed keys immediately
        if (this.geminiKeyInput) {
            const saveGemini = () => {
                const val = (this.geminiKeyInput.value || '').trim();
                if (val) {
                    localStorage.setItem('jarvis_gemini_key', val);
                    if (!localStorage.getItem('jarvis_openai_key')?.trim()) {
                        localStorage.setItem('jarvis_ai_provider', 'gemini');
                        llmAgent.setProvider('gemini');
                    }
                }
            };
            this.geminiKeyInput.addEventListener('change', saveGemini);
            this.geminiKeyInput.addEventListener('input', saveGemini);
        }
        if (this.openaiKeyInput) {
            const saveOpenAI = () => {
                const val = (this.openaiKeyInput.value || '').trim();
                if (val) {
                    localStorage.setItem('jarvis_openai_key', val);
                    localStorage.setItem('jarvis_ai_provider', 'openai');
                    llmAgent.setProvider('openai');
                }
            };
            this.openaiKeyInput.addEventListener('change', saveOpenAI);
            this.openaiKeyInput.addEventListener('input', saveOpenAI);
        }

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

    open() {
        this.loadSettings();
        this.modalEl.classList.remove('hidden');
    }

    close() {
        this.modalEl.classList.add('hidden');
        if (this.feedbackEl) this.feedbackEl.classList.add('hidden');
    }

    switchProvider(provider) {
        if (provider === 'openai') {
            this.openaiTab?.classList.add('active');
            this.geminiTab?.classList.remove('active');
            this.openaiSection?.classList.remove('hidden');
            this.geminiSection?.classList.add('hidden');
        } else {
            this.geminiTab?.classList.add('active');
            this.openaiTab?.classList.remove('active');
            this.geminiSection?.classList.remove('hidden');
            this.openaiSection?.classList.add('hidden');
        }
    }

    loadSettings() {
        const openAIKey = localStorage.getItem('jarvis_openai_key') || '';
        const geminiKey = localStorage.getItem('jarvis_gemini_key') || '';
        const elevenLabsKey = localStorage.getItem('jarvis_elevenlabs_key') || '';
        const gcpKey = localStorage.getItem('jarvis_gcp_tts_key') || '';
        const selectedVoice = localStorage.getItem('jarvis_openai_voice') || 'onyx';
        const selectedAzureVoice = localStorage.getItem('jarvis_azure_voice') || 'bn-BD-PradeepNeural';
        const elevenLabsVoiceId = localStorage.getItem('jarvis_elevenlabs_voice_id') || '';

        let provider = localStorage.getItem('jarvis_ai_provider') || 'openai';
        if (!openAIKey && geminiKey) {
            provider = 'gemini';
        }

        this.switchProvider(provider);

        if (this.openaiKeyInput) this.openaiKeyInput.value = openAIKey;
        if (this.geminiKeyInput) this.geminiKeyInput.value = geminiKey;
        if (this.openaiVoiceSelect) this.openaiVoiceSelect.value = selectedVoice;
        if (this.geminiVoiceSelect) this.geminiVoiceSelect.value = selectedAzureVoice;

        // ElevenLabs key fields
        const elevenKeyInput = document.getElementById('input-elevenlabs-key');
        if (elevenKeyInput) elevenKeyInput.value = elevenLabsKey;
        const elevenVoiceInput = document.getElementById('input-elevenlabs-voice-id');
        if (elevenVoiceInput) elevenVoiceInput.value = elevenLabsVoiceId;

        // GCP key field
        const gcpKeyInput = document.getElementById('input-gcp-tts-key');
        if (gcpKeyInput) gcpKeyInput.value = gcpKey;
    }

    async testCurrentVoice() {
        await voiceSpeaker.unlockAudio();
        const isGemini = this.geminiTab?.classList.contains('active');

        // Immediately auto-save keys from inputs right before test so they are never lost
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

        if (isGemini) {
            if (elevenLabsKey) {
                voiceSpeaker.setEngine('elevenlabs');
            } else {
                voiceSpeaker.setEngine('free-bengali');
            }
        } else {
            const selectedVoice = this.openaiVoiceSelect?.value || 'onyx';
            voiceSpeaker.setOpenAIVoice(selectedVoice);
            voiceSpeaker.setEngine('openai');
        }

        // Play chime sound first for instant audible confirmation!
        try {
            if (window.wakeWordListener && typeof window.wakeWordListener.playWakeChime === 'function') {
                window.wakeWordListener.playWakeChime();
            }
        } catch (e) {
            console.warn('[AISettingsModal] Chime error:', e);
        }

        const testPhrase = 'আসসালামু আলাইকুম ভাইয়া! আমি জার্ভিস। আপনার মা মোটরসের যাবতীয় হিসাব দেখতে আমি সম্পূর্ণ প্রস্তুত আছি।';
        
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
        const cleanKey = (key || '').trim();
        if (!cleanKey || cleanKey.length < 15) {
            return {
                valid: false,
                message: 'দয়া করে একটি সঠিক জেমিনি এপিআই কী প্রদান করুন।'
            };
        }

        // ✅ Updated model list (2026 active models)
        const modelsToTry = ['gemini-3.6-flash', 'gemini-flash-latest', 'gemini-2.5-flash', 'gemini-2.0-flash'];
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

    async validateOpenAIKey(key) {
        try {
            const res = await fetch('https://api.openai.com/v1/models', {
                headers: { 'Authorization': `Bearer ${key}` }
            });
            if (res.ok) return { valid: true };
            const data = await res.json().catch(() => ({}));
            return { valid: false, message: data.error?.message || `HTTP ${res.status}` };
        } catch (err) {
            return { valid: false, message: err.message };
        }
    }

    async saveSettings() {
        const isGemini = this.geminiTab?.classList.contains('active');
        let provider = isGemini ? 'gemini' : 'openai';

        const openAIKey = (this.openaiKeyInput?.value || '').trim();
        const geminiKey = (this.geminiKeyInput?.value || '').trim();
        const selectedVoice = this.openaiVoiceSelect?.value || 'onyx';
        const selectedAzureVoice = this.geminiVoiceSelect?.value || 'bn-BD-PradeepNeural';

        // ElevenLabs & GCP inputs
        const elevenKeyInput = document.getElementById('input-elevenlabs-key');
        const elevenVoiceInput = document.getElementById('input-elevenlabs-voice-id');
        const gcpKeyInput = document.getElementById('input-gcp-tts-key');

        const elevenLabsKey = (elevenKeyInput?.value || '').trim();
        const elevenLabsVoiceId = (elevenVoiceInput?.value || '').trim();
        const gcpKey = (gcpKeyInput?.value || '').trim();

        // 🚨 CRITICAL: Save all keys to localStorage FIRST before running any network validation!
        if (openAIKey) localStorage.setItem('jarvis_openai_key', openAIKey);
        if (geminiKey) localStorage.setItem('jarvis_gemini_key', geminiKey);
        if (elevenLabsKey) {
            localStorage.setItem('jarvis_elevenlabs_key', elevenLabsKey);
            voiceSpeaker.setElevenLabsVoice(elevenLabsVoiceId);
            voiceSpeaker.setEngine('elevenlabs');
        }
        if (elevenLabsVoiceId) localStorage.setItem('jarvis_elevenlabs_voice_id', elevenLabsVoiceId);
        if (gcpKey) {
            localStorage.setItem('jarvis_gcp_tts_key', gcpKey);
            if (!openAIKey && !elevenLabsKey) voiceSpeaker.setEngine('gcp');
        }

        // Auto prioritize Gemini if user provided Gemini key
        if (!openAIKey && geminiKey) {
            provider = 'gemini';
        }

        localStorage.setItem('jarvis_ai_provider', provider);
        localStorage.setItem('jarvis_openai_voice', selectedVoice);
        localStorage.setItem('jarvis_azure_voice', selectedAzureVoice);

        // Update active instances
        llmAgent.setProvider(provider);
        if (provider === 'gemini') {
            if (elevenLabsKey) {
                voiceSpeaker.setEngine('elevenlabs');
            } else if (gcpKey) {
                voiceSpeaker.setEngine('gcp');
            } else if (openAIKey) {
                voiceSpeaker.setOpenAIVoice(selectedVoice);
                voiceSpeaker.setEngine('openai');
            } else {
                voiceSpeaker.setEngine('free-bengali');
            }
        } else {
            voiceSpeaker.setOpenAIVoice(selectedVoice);
            voiceSpeaker.setEngine('openai');
        }

        // Sync header voice selector
        const headerVoiceSelector = document.getElementById('voice-selector');
        if (headerVoiceSelector) {
            headerVoiceSelector.value = provider === 'gemini' ? selectedAzureVoice : selectedVoice;
        }

        if (this.feedbackEl) {
            this.feedbackEl.className = 'settings-feedback-msg';
            this.feedbackEl.innerText = '🔍 এআই কী যাচাই করা হচ্ছে...';
            this.feedbackEl.classList.remove('hidden');
        }

        // Live validation for Gemini key
        if (provider === 'gemini' && geminiKey) {
            const valResult = await this.validateGeminiKey(geminiKey);
            if (!valResult.valid) {
                if (this.feedbackEl) {
                    this.feedbackEl.className = 'settings-feedback-msg error';
                    this.feedbackEl.innerText = `❌ জেমিনি কী সঠিক নয়: ${valResult.message}। দয়া করে Google AI Studio থেকে সঠিক API Key কপি করুন।`;
                }
                return;
            }
        } else if (provider === 'openai' && openAIKey) {
            const valResult = await this.validateOpenAIKey(openAIKey);
            if (!valResult.valid) {
                if (this.feedbackEl) {
                    this.feedbackEl.className = 'settings-feedback-msg error';
                    this.feedbackEl.innerText = `❌ ওপেনএআই কী সঠিক নয়: ${valResult.message}।`;
                }
                return;
            }
        }

        if (this.feedbackEl) {
            this.feedbackEl.className = 'settings-feedback-msg success';
            this.feedbackEl.innerText = provider === 'gemini' 
                ? '✅ গুগল জেমিনি এআই ও ভয়েস সফলভাবে সংযুক্ত হয়েছে!'
                : '✅ ওপেনএআই চ্যাটজিপিটি সফলভাবে সক্রিয় হয়েছে!';
            this.feedbackEl.classList.remove('hidden');

            setTimeout(() => {
                this.close();
            }, 1200);
        }
    }
}

export const aiSettingsModal = new AISettingsModal();

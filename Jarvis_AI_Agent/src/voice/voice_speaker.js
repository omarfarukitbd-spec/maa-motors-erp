import { JARVIS_CONFIG } from '../config.js';

/**
 * 🎙️ World-Class Natural Voice Speaker (ChatGPT OpenAI TTS & Azure Neural Stream)
 * 1. Primary Engine: Official OpenAI Speech API (ChatGPT Authentic Voice: Onyx, Echo, Alloy, Nova)
 * 2. Secondary Engine: Local Azure Bangladeshi Neural Audio Stream (Pradeep/Nabanita)
 * 3. Fallback Engine: Browser SpeechSynthesis
 */
export class VoiceSpeaker {
    constructor() {
        this.synth = typeof window !== 'undefined' ? window.speechSynthesis : null;
        this.isSpeaking = false;
        this.onStartCallback = () => {};
        this.onEndCallback = () => {};
        this.selectedVoice = null;
        this.isUnlocked = false;

        this.activeEngine = (typeof window !== 'undefined' && localStorage.getItem('jarvis_voice_engine')) 
            || JARVIS_CONFIG.voice.defaultEngine 
            || 'openai';

        this.selectedOpenAIVoice = (typeof window !== 'undefined' && localStorage.getItem('jarvis_openai_voice')) 
            || JARVIS_CONFIG.voice.defaultVoice 
            || 'onyx';

        this.selectedAzureVoice = (typeof window !== 'undefined' && localStorage.getItem('jarvis_azure_voice')) 
            || JARVIS_CONFIG.voice.azureDefault 
            || 'bn-BD-PradeepNeural';

        // Persistent reusable audio element
        if (typeof window !== 'undefined') {
            this.audio = new Audio();
            this.audio.preload = 'auto';
            this.setupUnlockListeners();
        }

        this.initNativeVoices();
    }

    setEngine(engine) {
        this.activeEngine = engine;
        if (typeof window !== 'undefined') {
            localStorage.setItem('jarvis_voice_engine', engine);
        }
    }

    setOpenAIVoice(voiceId) {
        this.selectedOpenAIVoice = voiceId;
        if (typeof window !== 'undefined') {
            localStorage.setItem('jarvis_openai_voice', voiceId);
        }
    }

    setAzureVoice(voiceId) {
        this.selectedAzureVoice = voiceId;
        if (typeof window !== 'undefined') {
            localStorage.setItem('jarvis_azure_voice', voiceId);
        }
    }

    /**
     * Unlock audio playback permissions across modern browsers (Chrome/Safari/Edge/iOS)
     */
    setupUnlockListeners() {
        const unlock = async () => {
            if (this.isUnlocked) return;
            this.audio.src = 'data:audio/wav;base64,UklGRigAAABXQVZFZm10IBIAAAABAAEARKwAAIhYAQACABAAAABkYXRhAgAAAAEA';
            try {
                await this.audio.play();
                this.isUnlocked = true;
                console.log('🔊 [VoiceSpeaker] Audio pipeline successfully unlocked by user interaction.');
            } catch (err) {
                console.log('Audio unlock awaiting next touch/click interaction.');
            }
        };

        window.addEventListener('click', unlock, { once: true, passive: true });
        window.addEventListener('touchstart', unlock, { once: true, passive: true });
        window.addEventListener('keydown', unlock, { once: true, passive: true });
    }

    initNativeVoices() {
        if (!this.synth) return;
        const load = () => {
            const voices = this.synth.getVoices();
            this.selectedVoice = voices.find(v => v.lang === 'bn-BD' && (v.name.includes('Natural') || v.name.includes('Online'))) 
                || voices.find(v => v.lang === 'bn-BD')
                || voices.find(v => v.lang.startsWith('bn'))
                || voices.find(v => v.name.toLowerCase().includes('bangla') || v.name.toLowerCase().includes('bengali'));
        };
        load();
        if (this.synth.onvoiceschanged !== undefined) {
            this.synth.onvoiceschanged = load;
        }
    }

    /**
     * Speak text aloud using the best human-like emotional voice available
     * @param {string} text 
     * @returns {Promise<void>}
     */
    async speak(text) {
        if (!text) return;

        // Stop any current audio
        this.stop();

        const cleanText = String(text)
            .replace(/[*_#`৳]/g, '')
            .replace(/https?:\/\/[^\s]+/g, '')
            .replace(/\s+/g, ' ')
            .trim();

        if (!cleanText) return;

        this.isSpeaking = true;
        this.onStartCallback(cleanText);

        const openAIKey = (typeof window !== 'undefined' && localStorage.getItem('jarvis_openai_key')) || '';

        try {
            // Priority 1: OpenAI ChatGPT Official Voice (Authentic human voice)
            if (openAIKey.trim()) {
                await this.speakOpenAITTS(cleanText, openAIKey.trim());
                return;
            }

            // Priority 2: Azure Neural Speech Stream via local proxy
            if (this.activeEngine === 'azure-neural' || !openAIKey.trim()) {
                const proxyOk = await this.checkProxyAvailable();
                if (proxyOk) {
                    await this.speakOnlineNeural(cleanText);
                    return;
                }
            }

            // Priority 3: Browser Native SpeechSynthesis
            await this.speakNative(cleanText);
        } catch (err) {
            console.warn('[VoiceSpeaker] Primary voice failed, falling back to Native Speech:', err);
            await this.speakNative(cleanText);
        } finally {
            this.isSpeaking = false;
            this.onEndCallback();
        }
    }

    /**
     * Check if local /api/tts proxy is accessible
     */
    async checkProxyAvailable() {
        try {
            const res = await fetch('/api/tts?q=test', { method: 'HEAD' });
            return res.ok && (res.headers.get('content-type') || '').includes('audio');
        } catch (e) {
            return false;
        }
    }

    /**
     * Engine 1: OpenAI ChatGPT TTS (Real human ChatGPT Voice)
     * High-fidelity 24kHz audio stream directly to browser
     */
    async speakOpenAITTS(text, apiKey) {
        const response = await fetch('https://api.openai.com/v1/audio/speech', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiKey}`
            },
            body: JSON.stringify({
                model: 'tts-1',
                input: text,
                voice: this.selectedOpenAIVoice || 'onyx',
                response_format: 'mp3',
                speed: 1.0
            })
        });

        if (!response.ok) {
            const errData = await response.json().catch(() => ({}));
            throw new Error(errData.error?.message || `OpenAI TTS Error: ${response.status}`);
        }

        const blob = await response.blob();
        const audioUrl = URL.createObjectURL(blob);

        return new Promise((resolve, reject) => {
            this.audio.src = audioUrl;

            this.audio.onended = () => {
                URL.revokeObjectURL(audioUrl);
                resolve();
            };

            this.audio.onerror = (e) => {
                URL.revokeObjectURL(audioUrl);
                console.warn('[VoiceSpeaker] OpenAI audio play error:', e);
                reject(e);
            };

            const playPromise = this.audio.play();
            if (playPromise !== undefined) {
                playPromise.catch(err => reject(err));
            }
        });
    }

    /**
     * Engine 2: Azure Bangladeshi Neural Speech Stream via local proxy
     */
    speakOnlineNeural(text) {
        return new Promise((resolve, reject) => {
            const chunks = this.splitIntoSentences(text);
            if (chunks.length === 0) {
                resolve();
                return;
            }

            let index = 0;

            const playNext = () => {
                if (index >= chunks.length || !this.isSpeaking) {
                    resolve();
                    return;
                }

                const chunk = chunks[index++];
                const url = `/api/tts?q=${encodeURIComponent(chunk)}&voice=${encodeURIComponent(this.selectedAzureVoice)}`;
                
                this.audio.src = url;

                this.audio.onended = () => {
                    playNext();
                };

                this.audio.onerror = (e) => {
                    console.warn('[VoiceSpeaker] Azure audio stream error on chunk:', chunk, e);
                    reject(e);
                };

                const playPromise = this.audio.play();
                if (playPromise !== undefined) {
                    playPromise.catch(playErr => {
                        console.warn('[VoiceSpeaker] Autoplay interrupted:', playErr);
                        reject(playErr);
                    });
                }
            };

            playNext();
        });
    }

    /**
     * Engine 3: Native Web Speech API Fallback
     */
    speakNative(text) {
        return new Promise((resolve) => {
            if (!this.synth) {
                resolve();
                return;
            }

            this.synth.cancel();
            const utterance = new SpeechSynthesisUtterance(text);

            if (this.selectedVoice) {
                utterance.voice = this.selectedVoice;
            }

            utterance.lang = JARVIS_CONFIG.voice.lang;
            utterance.rate = JARVIS_CONFIG.voice.fallbackRate || 1.0;
            utterance.pitch = JARVIS_CONFIG.voice.fallbackPitch || 1.0;

            utterance.onend = () => resolve();
            utterance.onerror = (e) => {
                console.warn('[VoiceSpeaker] Native speech error:', e);
                resolve();
            };

            this.synth.speak(utterance);
        });
    }

    /**
     * Splits text into natural sentence chunks
     */
    splitIntoSentences(text) {
        const rawSentences = text.split(/([।?!]+[\s\n]*)/);
        const chunks = [];
        let buffer = '';

        for (let i = 0; i < rawSentences.length; i++) {
            buffer += rawSentences[i];
            if (rawSentences[i].match(/[।?!]/) || buffer.length >= 120) {
                const trimmed = buffer.trim();
                if (trimmed) {
                    chunks.push(trimmed);
                }
                buffer = '';
            }
        }

        if (buffer.trim()) {
            chunks.push(buffer.trim());
        }

        return chunks.filter(c => c.length > 0 && !c.match(/^[।?!,\s]+$/));
    }

    stop() {
        this.isSpeaking = false;
        if (this.audio) {
            try {
                this.audio.pause();
                this.audio.currentTime = 0;
            } catch (err) {
                console.warn('[VoiceSpeaker] Audio stop non-critical error:', err);
            }
        }
        if (this.synth) {
            try {
                this.synth.cancel();
            } catch (err) {
                console.warn('[VoiceSpeaker] Synth cancel non-critical error:', err);
            }
        }
        this.onEndCallback();
    }

    onStart(fn) { this.onStartCallback = fn; }
    onEnd(fn) { this.onEndCallback = fn; }
}

export const voiceSpeaker = new VoiceSpeaker();

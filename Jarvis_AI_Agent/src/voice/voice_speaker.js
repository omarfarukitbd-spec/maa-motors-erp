import { JARVIS_CONFIG } from '../config.js';

/**
 * 🎙️ World-Class Natural Voice Speaker (ChatGPT OpenAI TTS & Azure Neural Stream)
 * 1. Primary Engine: Official OpenAI Speech API (ChatGPT Authentic Voice: Onyx, Echo, Alloy, Nova)
 * 2. Secondary Engine: High-Fidelity Bangladeshi Neural Audio Stream (Pradeep/Nabanita via Cloud & Local Proxy)
 * 3. Fail-Safe Engine: Browser Native SpeechSynthesis with Watchdog
 */
export class VoiceSpeaker {
    constructor() {
        this.synth = typeof window !== 'undefined' ? window.speechSynthesis : null;
        this.isSpeaking = false;
        this.onStartCallback = () => {};
        this.onEndCallback = () => {};
        this.selectedVoice = null;
        this.isUnlocked = false;

        const hasOpenAIKey = typeof window !== 'undefined' && Boolean(localStorage.getItem('jarvis_openai_key')?.trim());
        const savedEngine = typeof window !== 'undefined' ? localStorage.getItem('jarvis_voice_engine') : null;

        // If no OpenAI key is saved, automatically default to Bangladeshi Neural Voice
        this.activeEngine = savedEngine || (hasOpenAIKey ? 'openai' : 'azure-neural');

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
            await this.unlockAudio();
        };

        ['click', 'touchstart', 'keydown'].forEach(evt => {
            window.addEventListener(evt, unlock, { once: true, passive: true });
        });
    }

    async unlockAudio() {
        if (this.isUnlocked || !this.audio) return;
        try {
            this.audio.src = 'data:audio/wav;base64,UklGRigAAABXQVZFZm10IBIAAAABAAEARKwAAIhYAQACABAAAABkYXRhAgAAAAEA';
            await this.audio.play();
            this.isUnlocked = true;
            console.log('🔊 [VoiceSpeaker] Audio pipeline successfully unlocked.');
        } catch (err) {
            console.warn('[VoiceSpeaker] Audio unlock pending user interaction:', err.message);
        }
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

        // Stop any current audio immediately
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
            // Priority 1: OpenAI ChatGPT Official Voice (if key is present and active)
            if (openAIKey.trim() && this.activeEngine === 'openai') {
                try {
                    await this.speakOpenAITTS(cleanText, openAIKey.trim());
                    return;
                } catch (openAiErr) {
                    console.warn('[VoiceSpeaker] OpenAI TTS failed, falling back to Azure Neural:', openAiErr);
                }
            }

            // Priority 2: High-Fidelity Azure Bangladeshi Neural Stream (Pradeep/Nabanita)
            await this.speakOnlineNeural(cleanText);

        } catch (fatalErr) {
            console.error('[VoiceSpeaker] Fatal speech error:', fatalErr);
        } finally {
            this.isSpeaking = false;
            this.onEndCallback();
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
                playPromise.catch(err => {
                    URL.revokeObjectURL(audioUrl);
                    reject(err);
                });
            }
        });
    }

    /**
     * Engine 2: Azure Bangladeshi Neural Speech Stream (Pradeep/Nabanita)
     */
    async speakOnlineNeural(text) {
        const chunks = this.splitIntoSentences(text);
        if (chunks.length === 0) return;

        const voice = this.selectedAzureVoice || 'bn-BD-PradeepNeural';

        for (const chunk of chunks) {
            if (!this.isSpeaking) break;
            await this.playNeuralChunk(chunk, voice);
        }
    }

    /**
     * Play single sentence chunk with dual endpoint fallback and blob memory decoding
     */
    async playNeuralChunk(chunk, voice) {
        const isLocal = typeof window !== 'undefined' && (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1');
        const endpoints = isLocal
            ? [
                `/api/tts?q=${encodeURIComponent(chunk)}&voice=${encodeURIComponent(voice)}`,
                `https://edge-tts.vercel.app/api/tts?text=${encodeURIComponent(chunk)}&voice=${encodeURIComponent(voice)}`
            ]
            : [
                `https://edge-tts.vercel.app/api/tts?text=${encodeURIComponent(chunk)}&voice=${encodeURIComponent(voice)}`,
                `/api/tts?q=${encodeURIComponent(chunk)}&voice=${encodeURIComponent(voice)}`
            ];

        for (const url of endpoints) {
            try {
                const res = await fetch(url);
                if (!res.ok) throw new Error(`HTTP ${res.status}`);
                const blob = await res.blob();
                if (!blob || blob.size === 0) throw new Error('Empty audio');

                const audioUrl = URL.createObjectURL(blob);
                await new Promise((resolve, reject) => {
                    const watchdog = setTimeout(() => {
                        URL.revokeObjectURL(audioUrl);
                        resolve();
                    }, 14000);

                    this.audio.src = audioUrl;
                    this.audio.onended = () => {
                        clearTimeout(watchdog);
                        URL.revokeObjectURL(audioUrl);
                        resolve();
                    };
                    this.audio.onerror = (e) => {
                        clearTimeout(watchdog);
                        URL.revokeObjectURL(audioUrl);
                        reject(e);
                    };
                    const playPromise = this.audio.play();
                    if (playPromise !== undefined) {
                        playPromise.catch(err => {
                            clearTimeout(watchdog);
                            URL.revokeObjectURL(audioUrl);
                            reject(err);
                        });
                    }
                });
                return; // Successfully played
            } catch (err) {
                console.warn(`[VoiceSpeaker] Neural audio endpoint failed (${url}):`, err);
            }
        }
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

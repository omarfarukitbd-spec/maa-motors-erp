import { JARVIS_CONFIG } from '../config.js';

/**
 * 🎙️ Dual-Engine Natural Bengali Voice Speaker
 * 1. Primary Engine: Google Online High-Fidelity Bengali Audio Stream (Sounds like Gemini/ChatGPT)
 * 2. Secondary Engine: Browser Native SpeechSynthesis (Offline fallback)
 */
export class VoiceSpeaker {
    constructor() {
        this.synth = typeof window !== 'undefined' ? window.speechSynthesis : null;
        this.isSpeaking = false;
        this.onStartCallback = () => {};
        this.onEndCallback = () => {};
        this.selectedVoice = null;
        this.isUnlocked = false;

        // Persistent reusable audio element
        if (typeof window !== 'undefined') {
            this.audio = new Audio();
            this.audio.preload = 'auto';
            this.setupUnlockListeners();
        }

        this.initNativeVoices();
    }

    /**
     * Unlock audio playback permissions across modern browsers (Chrome/Safari/Edge)
     */
    setupUnlockListeners() {
        const unlock = () => {
            if (this.isUnlocked) return;
            // Play a short silent data URL to grant persistent audio playback permissions
            this.audio.src = 'data:audio/wav;base64,UklGRigAAABXQVZFZm10IBIAAAABAAEARKwAAIhYAQACABAAAABkYXRhAgAAAAEA';
            this.audio.play().then(() => {
                this.isUnlocked = true;
                console.log('🔊 [VoiceSpeaker] Audio pipeline successfully unlocked by user interaction.');
            }).catch(() => {
                // Will retry on next interaction
            });
        };

        window.addEventListener('click', unlock, { once: true, passive: true });
        window.addEventListener('touchstart', unlock, { once: true, passive: true });
        window.addEventListener('keydown', unlock, { once: true, passive: true });
    }

    initNativeVoices() {
        if (!this.synth) return;
        const load = () => {
            const voices = this.synth.getVoices();
            this.selectedVoice = voices.find(v => v.lang === 'bn-BD') 
                || voices.find(v => v.lang.startsWith('bn'))
                || voices.find(v => v.name.toLowerCase().includes('bangla') || v.name.toLowerCase().includes('bengali'));
        };
        load();
        if (this.synth.onvoiceschanged !== undefined) {
            this.synth.onvoiceschanged = load;
        }
    }

    /**
     * Speak text aloud in natural human Bangladeshi Bengali
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

        try {
            // Try Online High-Definition Bengali Neural Voice first
            await this.speakOnlineNeural(cleanText);
        } catch (err) {
            console.warn('[VoiceSpeaker] Online TTS failed, falling back to Native SpeechSynthesis:', err);
            await this.speakNative(cleanText);
        } finally {
            this.isSpeaking = false;
            this.onEndCallback();
        }
    }

    /**
     * Engine 1: Online Google Bengali Audio Stream via /api/tts proxy
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
                const url = `/api/tts?q=${encodeURIComponent(chunk)}`;
                
                this.audio.src = url;

                this.audio.onended = () => {
                    playNext();
                };

                this.audio.onerror = (e) => {
                    console.warn('[VoiceSpeaker] Audio stream error on chunk:', chunk, e);
                    reject(e);
                };

                const playPromise = this.audio.play();
                if (playPromise !== undefined) {
                    playPromise.catch(playErr => {
                        console.warn('[VoiceSpeaker] Autoplay blocked or interrupted:', playErr);
                        reject(playErr);
                    });
                }
            };

            playNext();
        });
    }

    /**
     * Engine 2: Native Web Speech API Fallback
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
     * Splits into natural sentence chunks for fluid Bengali prosody
     * Preserves punctuation inside chunks and keeps sentences together up to 130 chars
     */
    splitIntoSentences(text) {
        // Split on Bengali full stops (।), question marks (?), exclamation marks (!), or newlines
        const rawSentences = text.split(/([।?!]+[\s\n]*)/);
        const chunks = [];
        let buffer = '';

        for (let i = 0; i < rawSentences.length; i++) {
            buffer += rawSentences[i];
            // If we have a full sentence or buffer exceeds 120 chars
            if (rawSentences[i].match(/[।?!]/) || buffer.length >= 120) {
                const trimmed = buffer.trim();
                if (trimmed) {
                    // If a single chunk is still extraordinarily long (> 150), split by comma or space
                    if (trimmed.length > 150) {
                        const subParts = trimmed.split(/([,;]+|\s{2,})/);
                        let subBuffer = '';
                        for (const part of subParts) {
                            subBuffer += part;
                            if (subBuffer.length >= 100) {
                                if (subBuffer.trim()) chunks.push(subBuffer.trim());
                                subBuffer = '';
                            }
                        }
                        if (subBuffer.trim()) chunks.push(subBuffer.trim());
                    } else {
                        chunks.push(trimmed);
                    }
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
            } catch (e) {}
        }
        if (this.synth) {
            try { this.synth.cancel(); } catch (e) {}
        }
        this.onEndCallback();
    }

    onStart(fn) { this.onStartCallback = fn; }
    onEnd(fn) { this.onEndCallback = fn; }
}

export const voiceSpeaker = new VoiceSpeaker();


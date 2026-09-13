import { JARVIS_CONFIG } from '../config.js';

/**
 * 🎙️ Dual-Engine Natural Bengali Voice Speaker
 * 1. Primary Engine: Google Online High-Fidelity Bengali Audio Stream (Sounds like Gemini/ChatGPT)
 * 2. Secondary Engine: Browser Native SpeechSynthesis (Offline fallback)
 */
export class VoiceSpeaker {
    constructor() {
        this.synth = window.speechSynthesis;
        this.isSpeaking = false;
        this.currentAudio = null;
        this.onStartCallback = () => {};
        this.onEndCallback = () => {};
        this.selectedVoice = null;

        this.initNativeVoices();
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
     * Engine 1: Online Google Bengali Audio Stream
     */
    speakOnlineNeural(text) {
        return new Promise((resolve, reject) => {
            // Split into sentences for fast buffer and natural cadence
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
                const url = `https://translate.google.com/translate_tts?ie=UTF-8&q=${encodeURIComponent(chunk)}&tl=bn&client=tw-ob`;
                
                const audio = new Audio(url);
                this.currentAudio = audio;

                audio.onended = () => {
                    playNext();
                };

                audio.onerror = (e) => {
                    console.warn('[VoiceSpeaker] Audio element error on chunk:', e);
                    reject(e);
                };

                audio.play().catch(playErr => {
                    console.warn('[VoiceSpeaker] Autoplay blocked or network issue:', playErr);
                    reject(playErr);
                });
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
                console.warn('Native speech error:', e);
                resolve();
            };

            this.synth.speak(utterance);
        });
    }

    splitIntoSentences(text) {
        // Split by Bengali danda (।), comma, question mark, newline
        const raw = text.split(/([।?!,\n]+)/);
        const chunks = [];
        let cur = '';

        for (let i = 0; i < raw.length; i++) {
            cur += raw[i];
            // Flush chunk if punctuation or length > 80 chars
            if (raw[i].match(/[।?!,\n]/) || cur.length >= 80) {
                const trimmed = cur.trim();
                if (trimmed) chunks.push(trimmed);
                cur = '';
            }
        }
        if (cur.trim()) chunks.push(cur.trim());
        return chunks.filter(c => c.length > 0 && !c.match(/^[।?!,\s]+$/));
    }

    stop() {
        this.isSpeaking = false;
        if (this.currentAudio) {
            try {
                this.currentAudio.pause();
                this.currentAudio.currentTime = 0;
            } catch (e) {}
            this.currentAudio = null;
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


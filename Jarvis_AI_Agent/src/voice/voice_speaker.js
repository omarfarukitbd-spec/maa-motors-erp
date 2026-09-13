import { JARVIS_CONFIG } from '../config.js';

export class VoiceSpeaker {
    constructor() {
        this.synth = window.speechSynthesis;
        this.isSpeaking = false;
        this.selectedVoice = null;
        this.onStartCallback = () => {};
        this.onEndCallback = () => {};

        this.initVoices();
    }

    initVoices() {
        if (!this.synth) return;

        const setVoice = () => {
            const voices = this.synth.getVoices();
            // Prioritize Bangladeshi Bengali voices
            const bnVoice = voices.find(v => v.lang === 'bn-BD') 
                || voices.find(v => v.lang.startsWith('bn'))
                || voices.find(v => v.name.toLowerCase().includes('bangla') || v.name.toLowerCase().includes('bengali'));

            if (bnVoice) {
                this.selectedVoice = bnVoice;
                console.log('[VoiceSpeaker] Loaded Bengali Voice:', bnVoice.name, bnVoice.lang);
            }
        };

        setVoice();
        if (this.synth.onvoiceschanged !== undefined) {
            this.synth.onvoiceschanged = setVoice;
        }
    }

    /**
     * Speak text in natural Bengali
     * @param {string} text 
     * @returns {Promise<void>}
     */
    speak(text) {
        return new Promise((resolve) => {
            if (!this.synth || !text) {
                resolve();
                return;
            }

            // Cancel any pending speech
            this.synth.cancel();

            const cleanText = text.replace(/[*_#`]/g, '').trim();
            const utterance = new SpeechSynthesisUtterance(cleanText);

            if (this.selectedVoice) {
                utterance.voice = this.selectedVoice;
            }

            utterance.lang = JARVIS_CONFIG.voice.lang;
            utterance.rate = JARVIS_CONFIG.voice.fallbackRate || 1.0;
            utterance.pitch = JARVIS_CONFIG.voice.fallbackPitch || 1.0;

            utterance.onstart = () => {
                this.isSpeaking = true;
                this.onStartCallback(cleanText);
            };

            utterance.onend = () => {
                this.isSpeaking = false;
                this.onEndCallback();
                resolve();
            };

            utterance.onerror = (e) => {
                console.warn('VoiceSpeaker error:', e);
                this.isSpeaking = false;
                this.onEndCallback();
                resolve();
            };

            this.synth.speak(utterance);
        });
    }

    stop() {
        if (this.synth) {
            this.synth.cancel();
            this.isSpeaking = false;
            this.onEndCallback();
        }
    }

    onStart(fn) { this.onStartCallback = fn; }
    onEnd(fn) { this.onEndCallback = fn; }
}

export const voiceSpeaker = new VoiceSpeaker();

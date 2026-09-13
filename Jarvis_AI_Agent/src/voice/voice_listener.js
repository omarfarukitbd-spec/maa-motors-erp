import { JARVIS_CONFIG } from '../config.js';

export class VoiceListener {
    constructor() {
        this.recognition = null;
        this.isListening = false;
        this.callbacks = {
            onStart: () => {},
            onEnd: () => {},
            onInterim: () => {},
            onFinal: () => {},
            onError: () => {}
        };

        this.initRecognition();
    }

    initRecognition() {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        if (!SpeechRecognition) {
            console.warn('SpeechRecognition is not supported in this browser.');
            return;
        }

        this.recognition = new SpeechRecognition();
        this.recognition.lang = JARVIS_CONFIG.voice.lang; // 'bn-BD'
        this.recognition.continuous = true;
        this.recognition.interimResults = true;
        this.recognition.maxAlternatives = 1;

        this.recognition.onstart = () => {
            this.isListening = true;
            this.callbacks.onStart();
        };

        this.recognition.onend = () => {
            this.isListening = false;
            this.callbacks.onEnd();
        };

        this.recognition.onerror = (event) => {
            console.warn('VoiceListener error:', event.error);
            this.callbacks.onError(event.error);
        };

        this.recognition.onresult = (event) => {
            let interimTranscript = '';
            let finalTranscript = '';

            for (let i = event.resultIndex; i < event.results.length; ++i) {
                const transcript = event.results[i][0].transcript;
                if (event.results[i].isFinal) {
                    finalTranscript += transcript;
                } else {
                    interimTranscript += transcript;
                }
            }

            if (interimTranscript) {
                this.callbacks.onInterim(interimTranscript);
            }
            if (finalTranscript) {
                this.callbacks.onFinal(finalTranscript.trim());
            }
        };
    }

    start() {
        if (!this.recognition) return false;
        try {
            this.recognition.start();
            return true;
        } catch (e) {
            console.warn('VoiceListener already running or error starting:', e);
            return false;
        }
    }

    stop() {
        if (!this.recognition) return;
        try {
            this.recognition.stop();
        } catch (err) {
            console.warn('[VoiceListener] Stop error:', err);
        }
    }

    toggle() {
        if (this.isListening) {
            this.stop();
        } else {
            this.start();
        }
    }

    on(event, fn) {
        if (this.callbacks[event]) {
            this.callbacks[event] = fn;
        }
    }
}

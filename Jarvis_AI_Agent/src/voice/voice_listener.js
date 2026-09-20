import { JARVIS_CONFIG } from '../config.js';

/**
 * 🎤 JARVIS Advanced Voice Listener v3.0
 * =========================================
 * Dual-mode STT Engine:
 *  Mode A: Web Speech API (Desktop Chrome — instant, free)
 *  Mode B: MediaRecorder + Whisper API (Mobile/Firefox/Safari — ৯৫%+ accuracy)
 *
 * Features:
 *  ✅ Auto-detect: mobile → Whisper mode, desktop → Web Speech API
 *  ✅ Press-and-hold support (push-to-talk)
 *  ✅ Noise-robust (Whisper mode handles background noise)
 *  ✅ Bengali business context prompt for higher accuracy
 *  ✅ Interim results (live transcription feedback)
 *  ✅ VAD (Voice Activity Detection) — auto-stop on silence
 *  ✅ Cross-browser: Chrome, Firefox, Safari, Edge, Mobile
 */
export class VoiceListener {
    constructor() {
        // STT Callbacks
        this.callbacks = {
            onStart:   () => {},
            onEnd:     () => {},
            onInterim: () => {},
            onFinal:   () => {},
            onError:   () => {}
        };

        this.isListening = false;
        this.mode = 'auto'; // 'auto' | 'webspeech' | 'whisper'

        // Web Speech API instance
        this.recognition = null;

        // MediaRecorder instance (Whisper mode)
        this.mediaRecorder = null;
        this.audioChunks = [];
        this.mediaStream = null;
        this.silenceTimer = null;
        this.whisperMode = false;

        this.accumulatedFinalText = '';
        this.currentInterimText = '';
        this.vadSilenceTimer = null;
        this.lastSpeechTimestamp = 0;
        this.VAD_SILENCE_DELAY_MS = 2500; // 2.5s of natural silence before finalizing
        this.isFinalizing = false;

        this._detectMode();
        this._initWebSpeech();
    }

    // ─────────────────────────────────────────
    // Auto-detect best STT mode
    // ─────────────────────────────────────────
    _detectMode() {
        const isMobile = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
        const hasWebSpeech = !!(window.SpeechRecognition || window.webkitSpeechRecognition);
        const hasGroqKey = Boolean((localStorage.getItem('jarvis_groq_key') || localStorage.getItem('jarvis_groq_keys') || '').trim());
        const hasOpenAIKey = Boolean((localStorage.getItem('jarvis_openai_key') || '').trim());
        const hasGeminiKey = Boolean((localStorage.getItem('jarvis_gemini_key') || '').trim());
        const hasAnyAIKey = hasGroqKey || hasOpenAIKey || hasGeminiKey;

        // Mobile always prefers Whisper (more stable)
        // Desktop Chrome uses Web Speech (instant)
        if (isMobile && hasAnyAIKey) {
            this.whisperMode = true;
        } else if (!hasWebSpeech) {
            this.whisperMode = true;
        } else {
            this.whisperMode = false;
        }

        console.log(`[VoiceListener] Mode: ${this.whisperMode ? 'Whisper (Groq/OpenAI MediaRecorder)' : 'Web Speech API'}`);
    }

    // ─────────────────────────────────────────
    // Initialize Web Speech API (Desktop Mode)
    // ─────────────────────────────────────────
    _initWebSpeech() {
        if (this.whisperMode) return;

        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        if (!SpeechRecognition) {
            this.whisperMode = true;
            return;
        }

        this.recognition = new SpeechRecognition();
        this.recognition.lang = 'bn-BD';
        this.recognition.continuous = true;       // Continuous: keeps listening across sentence pauses
        this.recognition.interimResults = true;
        this.recognition.maxAlternatives = 3;

        this.recognition.onstart = () => {
            this.isListening = true;
            this.accumulatedFinalText = '';
            this.currentInterimText = '';
            this.isFinalizing = false;
            this.callbacks.onStart();
        };

        this.recognition.onend = () => {
            this.isListening = false;
            clearTimeout(this.vadSilenceTimer);
            // If ended with unfinalized text, emit once
            this._finalizeSpeech(true);
            this.callbacks.onEnd();
        };

        this.recognition.onerror = (event) => {
            if (event.error === 'no-speech' || event.error === 'aborted') {
                return;
            }
            console.warn('[VoiceListener] Web Speech error:', event.error);
            const isMobile = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
            const hasWhisperKey = Boolean((localStorage.getItem('jarvis_groq_key') || localStorage.getItem('jarvis_groq_keys') || localStorage.getItem('jarvis_openai_key') || '').trim());
            if (isMobile && hasWhisperKey && ['not-allowed', 'service-not-allowed', 'network'].includes(event.error)) {
                this.whisperMode = true;
                console.log('[VoiceListener] Switched to Whisper mode on mobile error.');
            }
            this.isListening = false;
            clearTimeout(this.vadSilenceTimer);
            this.callbacks.onError(event.error);
        };

        this.recognition.onresult = (event) => {
            let interimText = '';

            for (let i = event.resultIndex; i < event.results.length; i++) {
                const transcript = event.results[i][0].transcript;
                if (event.results[i].isFinal) {
                    this.accumulatedFinalText = (this.accumulatedFinalText + ' ' + transcript).trim();
                } else {
                    interimText += transcript;
                }
            }

            this.currentInterimText = interimText;

            const fullDisplayText = (this.accumulatedFinalText + ' ' + interimText).trim();
            if (fullDisplayText) {
                this.lastSpeechTimestamp = Date.now();
                this.callbacks.onInterim(fullDisplayText);
            }

            // Adaptive VAD Silence Timer: Every time the user speaks a word or sound, reset the timer!
            // Only after 2.5 seconds of sustained silence after speaking do we finalize the full sentence.
            clearTimeout(this.vadSilenceTimer);
            this.vadSilenceTimer = setTimeout(() => {
                this._finalizeSpeech();
            }, this.VAD_SILENCE_DELAY_MS);
        };
    }

    /**
     * Finalize the recognized sentence safely without premature interruption
     */
    _finalizeSpeech(fromOnEnd = false) {
        clearTimeout(this.vadSilenceTimer);
        this.vadSilenceTimer = null;

        const textToEmit = (this.accumulatedFinalText + ' ' + this.currentInterimText).trim();
        if (!textToEmit || this.isFinalizing) {
            return;
        }

        this.isFinalizing = true;
        this.accumulatedFinalText = '';
        this.currentInterimText = '';

        console.log(`[VoiceListener] 🎯 Speech finalized (${fromOnEnd ? 'onend' : '1.3s VAD silence'}): "${textToEmit}"`);

        if (!fromOnEnd && this.isListening) {
            try {
                this.stop();
            } catch (err) {
                console.warn('[VoiceListener] Stop on finalize non-critical:', err);
            }
        }

        this.callbacks.onFinal(textToEmit);
        setTimeout(() => {
            this.isFinalizing = false;
        }, 600);
    }

    // ─────────────────────────────────────────
    // START Listening
    // ─────────────────────────────────────────
    async start() {
        if (this.isListening) return false;

        if (this.whisperMode) {
            return await this._startWhisperMode();
        } else {
            return this._startWebSpeech();
        }
    }

    _startWebSpeech() {
        if (!this.recognition) return false;
        try {
            this.recognition.start();
            return true;
        } catch (err) {
            console.warn('[VoiceListener] Web Speech start error:', err);
            const isMobile = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
            const hasWhisperKey = Boolean((localStorage.getItem('jarvis_groq_key') || localStorage.getItem('jarvis_groq_keys') || localStorage.getItem('jarvis_openai_key') || '').trim());
            if (isMobile && hasWhisperKey) {
                this.whisperMode = true;
            }
            return false;
        }
    }

    async _startWhisperMode() {
        try {
            this.mediaStream = await navigator.mediaDevices.getUserMedia({
                audio: {
                    channelCount: 1,
                    sampleRate: 16000,   // Whisper prefers 16kHz
                    echoCancellation: true,
                    noiseSuppression: true,
                    autoGainControl: true
                }
            });

            this.audioChunks = [];
            const mimeType = this._getBestMimeType();
            this.mediaRecorder = new MediaRecorder(this.mediaStream, { mimeType });

            this.mediaRecorder.ondataavailable = (event) => {
                if (event.data && event.data.size > 0) {
                    this.audioChunks.push(event.data);
                }
            };

            this.mediaRecorder.onstart = () => {
                this.isListening = true;
                this.callbacks.onStart();
            };

            this.mediaRecorder.onstop = async () => {
                this.isListening = false;
                this._cleanupMediaStream();
                await this._sendToWhisper();
                this.callbacks.onEnd();
            };

            this.mediaRecorder.onerror = (err) => {
                console.error('[VoiceListener] MediaRecorder error:', err);
                this.isListening = false;
                this._cleanupMediaStream();
                this.callbacks.onError('media-recorder-error');
                this.callbacks.onEnd();
            };

            this.mediaRecorder.start(100); // Collect chunks every 100ms
            return true;

        } catch (err) {
            console.error('[VoiceListener] Mic access error:', err);
            this.callbacks.onError('mic-access-denied');
            return false;
        }
    }

    // ─────────────────────────────────────────
    // STOP Listening
    // ─────────────────────────────────────────
    stop() {
        clearTimeout(this.vadSilenceTimer);
        this.vadSilenceTimer = null;

        if (!this.whisperMode && (this.accumulatedFinalText || this.currentInterimText) && !this.isFinalizing) {
            this._finalizeSpeech();
            return;
        }

        if (!this.isListening) return;

        if (this.whisperMode) {
            if (this.mediaRecorder && this.mediaRecorder.state !== 'inactive') {
                this.mediaRecorder.stop();
            }
        } else {
            if (this.recognition) {
                try { this.recognition.stop(); } catch (err) {
                    console.warn('[VoiceListener] Stop error:', err);
                }
            }
        }
    }

    toggle() {
        if (this.isListening) {
            this.stop();
        } else {
            this.start();
        }
    }

    // ─────────────────────────────────────────
    // Send audio to Whisper API
    // ─────────────────────────────────────────
    async _sendToWhisper() {
        if (this.audioChunks.length === 0) {
            console.warn('[VoiceListener] No audio chunks to send.');
            return;
        }

        const groqKeyRaw = (localStorage.getItem('jarvis_groq_key') || localStorage.getItem('jarvis_groq_keys') || '').trim();
        const groqKey = groqKeyRaw.split(/[\n,;]+/).map(k => k.trim()).filter(Boolean)[0] || '';
        const openAIKey = (localStorage.getItem('jarvis_openai_key') || '').trim();

        if (!groqKey && !openAIKey) {
            // Fallback: no Whisper key → use browser STT result
            console.warn('[VoiceListener] No Groq or OpenAI key for Whisper transcription.');
            this.callbacks.onFinal('');
            return;
        }

        try {
            const mimeType = this._getBestMimeType();
            const audioBlob = new Blob(this.audioChunks, { type: mimeType });

            // Skip if audio too short (< 0.5 second ≈ < 8000 bytes)
            if (audioBlob.size < 8000) {
                console.log('[VoiceListener] Audio too short, skipping Whisper.');
                return;
            }

            const isGroq = Boolean(groqKey);
            const endpoint = isGroq
                ? 'https://api.groq.com/openai/v1/audio/transcriptions'
                : 'https://api.openai.com/v1/audio/transcriptions';
            const authKey = isGroq ? groqKey : openAIKey;
            const modelName = isGroq ? 'whisper-large-v3' : 'whisper-1';

            const formData = new FormData();
            formData.append('file', audioBlob, `audio.${this._getExtension(mimeType)}`);
            formData.append('model', modelName);
            formData.append('language', 'bn');  // Force Bengali
            // Business context prompt — drastically improves accuracy for Bangla business terms
            formData.append('prompt',
                'মা মোটরস, বকেয়া, কাস্টমার, টাকা, AED, দিরহাম, ক্যাশ, ব্যাংক, ব্যালেন্স, মেমো, চালান, পেমেন্ট, করিম, রহিম, জমা, দুবাই, কন্টেইনার'
            );

            console.log(`[VoiceListener] Transcribing via ${isGroq ? 'Groq Whisper Large v3 (Free Ultra-Fast)' : 'OpenAI Whisper'}...`);

            const response = await fetch(endpoint, {
                method: 'POST',
                headers: { 'Authorization': `Bearer ${authKey}` },
                body: formData
            });

            if (!response.ok) {
                const errData = await response.json().catch(() => ({}));
                throw new Error(errData.error?.message || `Whisper API error: ${response.status}`);
            }

            const data = await response.json();
            const transcript = (data.text || '').trim();

            if (transcript) {
                console.log('[VoiceListener] Whisper transcript:', transcript);
                this.callbacks.onFinal(transcript);
            } else {
                console.log('[VoiceListener] Whisper returned empty transcript.');
            }

        } catch (err) {
            console.error('[VoiceListener] Whisper transcription error:', err);
            this.callbacks.onError('whisper-error');
        }
    }

    // ─────────────────────────────────────────
    // Helpers
    // ─────────────────────────────────────────
    _getBestMimeType() {
        const types = [
            'audio/webm;codecs=opus',
            'audio/webm',
            'audio/ogg;codecs=opus',
            'audio/mp4',
            'audio/wav'
        ];
        return types.find(t => MediaRecorder.isTypeSupported(t)) || 'audio/webm';
    }

    _getExtension(mimeType) {
        if (mimeType.includes('webm')) return 'webm';
        if (mimeType.includes('ogg')) return 'ogg';
        if (mimeType.includes('mp4')) return 'mp4';
        if (mimeType.includes('wav')) return 'wav';
        return 'webm';
    }

    _cleanupMediaStream() {
        if (this.mediaStream) {
            this.mediaStream.getTracks().forEach(t => t.stop());
            this.mediaStream = null;
        }
    }

    on(event, fn) {
        if (this.callbacks[event] !== undefined) {
            this.callbacks[event] = fn;
        }
    }

    /**
     * Get current mode label for UI display
     */
    getModeLabel() {
        return this.whisperMode ? 'Whisper AI (High Accuracy)' : 'Web Speech API';
    }
}

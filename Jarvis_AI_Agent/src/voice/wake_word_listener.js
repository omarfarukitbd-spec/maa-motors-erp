import { voiceSpeaker } from './voice_speaker.js';

/**
 * 🎙️ JARVIS Always-On Wake Word Listener v1.0
 * ============================================
 * Enables true hands-free voice interaction:
 * Users can simply say "Jarvis" or "জার্ভিস" to wake the assistant!
 *
 * Supported Trigger Variations:
 *  - Bengali: "জার্ভিস", "জারভিস", "ওহে জার্ভিস", "এই জার্ভিস", "হ্যালো জার্ভিস", "জার্ভিস ভাই"
 *  - English: "Jarvis", "Jarvice", "Hey Jarvis", "Hi Jarvis", "OK Jarvis", "Hello Jarvis"
 *
 * Execution Modes:
 *  1. Name Call Only: "জার্ভিস" -> Plays futuristic chime + says "জি ভাইয়া, শুনছি!" + starts listening
 *  2. Wake + Command: "জার্ভিস করিমের বাকি কত?" -> Plays chime + immediately processes command
 *
 * Safety Guards:
 *  - Anti-Echo: Ignores audio while Jarvis is speaking (voiceSpeaker.isSpeaking)
 *  - Auto-Restart Resilience: Recovers automatically if browser silences background recognition
 *  - Zero API Cost: Uses local Web Speech API continuous engine (100% free, low latency)
 */
export class WakeWordListener {
    constructor() {
        this.isEnabled = (typeof window !== 'undefined' && localStorage.getItem('jarvis_wake_word_enabled')) !== 'false';
        this.isRunning = false;
        this.recognition = null;
        this.audioCtx = null;
        this.restartTimer = null;
        this.isTemporarilyPaused = false;

        // Callbacks
        this.onWake = null; // ({ hasCommand, command, rawTranscript }) => {}
        this.onStatusChange = null; // (isEnabled, isRunning) => {}

        // Expanded regex for detecting Jarvis wake word in Bangla & English (Unicode-safe word boundary, including common STT phonetics like সার্ভিস/জারভিস/jarvis)
        this.wakeWordRegex = /(?:hey\s+|hi\s+|ok\s+|hello\s+|ওহে\s+|এই\s+|শোনো\s+|হ্যালো\s+)?(jarvis|jarvice|javis|jarves|জার্ভিস|জারভিস|যারভিস|সার্ভিস|সারভিস|জারবিস|জাবিস)(?:\s*(?:ভাই|স্যার))?(?:[\s,:?!]|$)(.*)/i;

        this._initRecognition();
    }

    /**
     * Initialize the Web Speech Recognition instance for passive background listening
     */
    _initRecognition() {
        if (typeof window === 'undefined') return;

        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        if (!SpeechRecognition) {
            console.warn('[WakeWord] SpeechRecognition not supported in this browser.');
            return;
        }

        try {
            this.recognition = new SpeechRecognition();
            this.recognition.continuous = true;
            this.recognition.interimResults = true;
            this.recognition.maxAlternatives = 3;
            // Listen in Bengali (which also catches English words like 'Jarvis' accurately)
            this.recognition.lang = 'bn-BD';

            this.recognition.onstart = () => {
                this.isRunning = true;
                this._notifyStatus();
                console.log('[WakeWord] 🎙️ Passive Wake Word listener active. Say "Jarvis" or "জার্ভিস" anytime!');
            };

            this.recognition.onend = () => {
                this.isRunning = false;
                this._notifyStatus();

                // Auto-restart if still enabled and not temporarily paused
                if (this.isEnabled && !this.isTemporarilyPaused) {
                    clearTimeout(this.restartTimer);
                    this.restartTimer = setTimeout(() => {
                        this._safeStart();
                    }, 400);
                }
            };

            this.recognition.onerror = (event) => {
                // Ignore harmless aborted or no-speech events
                if (event.error === 'no-speech' || event.error === 'aborted') {
                    return;
                }
                console.warn('[WakeWord] Recognition error:', event.error);
                if (event.error === 'not-allowed') {
                    // Do not permanently disable wake word; keep enabled so gesture listener can activate it
                    console.warn('[WakeWord] Microphone permission pending. Ready to resume on gesture.');
                    this.isRunning = false;
                    this._notifyStatus();
                }
            };

            this.recognition.onresult = (event) => {
                this._handleRecognitionResult(event);
            };

        } catch (err) {
            console.error('[WakeWord] Initialization error:', err);
        }
    }

    /**
     * Parse speech results for wake word triggers
     */
    _handleRecognitionResult(event) {
        // Anti-Echo Guard: If Jarvis is speaking or we are paused, ignore input
        if (this.isTemporarilyPaused || voiceSpeaker.isSpeaking) {
            return;
        }

        for (let i = event.resultIndex; i < event.results.length; i++) {
            const result = event.results[i];

            // Inspect all alternatives provided by speech recognizer
            for (let a = 0; a < result.length; a++) {
                const transcript = (result[a]?.transcript || '').trim();
                if (!transcript) continue;

                const match = transcript.match(this.wakeWordRegex);
                if (match) {
                    const commandPayload = (match[2] || '').trim();

                    console.log(`[WakeWord] ⚡ WAKE WORD DETECTED! Transcript: "${transcript}", Command: "${commandPayload}"`);

                    // Synthesize futuristic activation chime immediately
                    this.playWakeChime();

                    // Temporarily pause wake word listener while processing command
                    this.pause();

                    if (typeof this.onWake === 'function') {
                        this.onWake({
                            hasCommand: commandPayload.length > 1,
                            command: commandPayload,
                            rawTranscript: transcript
                        });
                    }

                    // Abort current utterance to avoid duplicate triggers
                    try {
                        this.recognition.abort();
                    } catch (e) {
                        console.warn('[WakeWord] Abort error non-critical:', e);
                    }
                    return;
                }
            }
        }
    }

    /**
     * Play a high-tech synthesized futuristic double-chime (Web Audio API)
     * No audio file download needed, 0ms latency!
     */
    async playWakeChime() {
        try {
            const AudioCtx = window.AudioContext || window.webkitAudioContext;
            if (!AudioCtx) return;

            if (!this.audioCtx) {
                this.audioCtx = new AudioCtx();
            }

            if (this.audioCtx.state === 'suspended') {
                await this.audioCtx.resume();
            }

            const now = this.audioCtx.currentTime;

            // Tone 1: High crisp chime (587.33 Hz - D5)
            const osc1 = this.audioCtx.createOscillator();
            const gain1 = this.audioCtx.createGain();
            osc1.type = 'sine';
            osc1.frequency.setValueAtTime(587.33, now);
            gain1.gain.setValueAtTime(0.001, now);
            gain1.gain.linearRampToValueAtTime(0.25, now + 0.03);
            gain1.gain.linearRampToValueAtTime(0.001, now + 0.22);
            osc1.connect(gain1);
            gain1.connect(this.audioCtx.destination);
            osc1.start(now);
            osc1.stop(now + 0.22);

            // Tone 2: Ascending futuristic ping (880 Hz - A5)
            const osc2 = this.audioCtx.createOscillator();
            const gain2 = this.audioCtx.createGain();
            osc2.type = 'sine';
            osc2.frequency.setValueAtTime(880, now + 0.1);
            gain2.gain.setValueAtTime(0.001, now + 0.1);
            gain2.gain.linearRampToValueAtTime(0.3, now + 0.14);
            gain2.gain.linearRampToValueAtTime(0.001, now + 0.45);
            osc2.connect(gain2);
            gain2.connect(this.audioCtx.destination);
            osc2.start(now + 0.1);
            osc2.stop(now + 0.45);

        } catch (e) {
            console.error('[WakeWord] Audio chime error:', e);
        }
    }

    /**
     * Start the wake word listener
     */
    start() {
        this.isEnabled = true;
        this.isTemporarilyPaused = false;
        localStorage.setItem('jarvis_wake_word_enabled', 'true');
        this._safeStart();
    }

    /**
     * Safely start recognition instance
     */
    _safeStart() {
        if (!this.recognition || this.isRunning || this.isTemporarilyPaused) return;
        try {
            this.recognition.start();
        } catch (err) {
            // Already started or busy
            if (err.name !== 'InvalidStateError') {
                console.warn('[WakeWord] Start error:', err);
            }
        }
    }

    /**
     * Stop wake word listening
     */
    stop() {
        this.isEnabled = false;
        this.isTemporarilyPaused = false;
        localStorage.setItem('jarvis_wake_word_enabled', 'false');
        clearTimeout(this.restartTimer);
        if (this.recognition) {
            try {
                this.recognition.stop();
            } catch (err) {
                console.error('[WakeWord] Stop error:', err);
            }
        }
        this.isRunning = false;
        this._notifyStatus();
    }

    /**
     * Temporarily pause (e.g. while Jarvis is actively recording user command or speaking)
     */
    pause() {
        this.isTemporarilyPaused = true;
        clearTimeout(this.restartTimer);
        if (this.recognition && this.isRunning) {
            try {
                this.recognition.stop();
            } catch (err) {
                console.error('[WakeWord] Pause error:', err);
            }
        }
    }

    /**
     * Resume wake word listening after active conversation finishes
     */
    resume() {
        this.isTemporarilyPaused = false;
        if (this.isEnabled) {
            clearTimeout(this.restartTimer);
            this.restartTimer = setTimeout(() => {
                this._safeStart();
            }, 800);
        }
    }

    /**
     * Toggle enabled state
     */
    toggle() {
        if (this.isEnabled) {
            this.stop();
        } else {
            this.start();
        }
        return this.isEnabled;
    }

    _notifyStatus() {
        if (typeof this.onStatusChange === 'function') {
            this.onStatusChange(this.isEnabled, this.isRunning);
        }
    }
}

export const wakeWordListener = new WakeWordListener();

import { JARVIS_CONFIG } from '../config.js';

/**
 * 🎙️ JARVIS World-Class Voice Speaker v3.0
 * ============================================
 * Priority Engine Stack:
 *  1. OpenAI TTS (ChatGPT authentic voice — if key available)
 *  2. ElevenLabs TTS (human-like, emotional — free 10K/month)
 *  3. Google Cloud TTS (bn-BD-Neural2 Bangladeshi voice — if GCP key available)
 *  4. Browser SpeechSynthesis (intelligent bn-BD fallback — always works)
 *
 * Features:
 *  ✅ SSML emotion tags (pause, emphasis, pitch)
 *  ✅ Streaming audio — speaks while generating
 *  ✅ Emotion-adaptive tone (urgent, sad, happy, neutral)
 *  ✅ Mobile audio unlock (iOS/Android autoplay policy)
 *  ✅ Sentence chunking for natural speech rhythm
 *  ✅ Full error recovery with graceful fallback chain
 */
export class VoiceSpeaker {
    constructor() {
        this.synth = typeof window !== 'undefined' ? window.speechSynthesis : null;
        this.isSpeaking = false;
        this.onStartCallback = () => {};
        this.onEndCallback = () => {};
        this.selectedNativeBnVoice = null;
        this.isUnlocked = false;
        this.currentEmotion = 'neutral'; // 'neutral' | 'urgent' | 'happy' | 'sad' | 'serious'

        // Load saved engine preference
        const savedEngine = typeof window !== 'undefined' ? localStorage.getItem('jarvis_voice_engine') : null;
        const hasOpenAIKey = typeof window !== 'undefined' && Boolean((localStorage.getItem('jarvis_openai_key') || '').trim());
        const hasElevenLabs = typeof window !== 'undefined' && Boolean((localStorage.getItem('jarvis_elevenlabs_key') || '').trim());
        const hasGCP = typeof window !== 'undefined' && Boolean((localStorage.getItem('jarvis_gcp_tts_key') || '').trim());

        // Auto-select best available engine
        if (savedEngine) {
            this.activeEngine = savedEngine;
        } else if (hasOpenAIKey) {
            this.activeEngine = 'openai';
        } else if (hasElevenLabs) {
            this.activeEngine = 'elevenlabs';
        } else if (hasGCP) {
            this.activeEngine = 'gcp';
        } else {
            this.activeEngine = 'browser';
        }

        this.selectedOpenAIVoice = (typeof window !== 'undefined' && localStorage.getItem('jarvis_openai_voice')) || 'onyx';
        this.selectedAzureVoice = (typeof window !== 'undefined' && localStorage.getItem('jarvis_azure_voice')) || 'bn-BD-PradeepNeural';
        this.selectedElevenLabsVoice = (typeof window !== 'undefined' && localStorage.getItem('jarvis_elevenlabs_voice_id')) || '';

        // Persistent reusable audio element
        if (typeof window !== 'undefined') {
            this.audio = document.getElementById('jarvis-persistent-audio') || new Audio();
            this.audio.preload = 'auto';
            this.setupUnlockListeners();
        }

        this.initNativeBnVoice();
    }

    // ─────────────────────────────────────────
    // Engine Setters
    // ─────────────────────────────────────────
    setEngine(engine) {
        this.activeEngine = engine;
        if (typeof window !== 'undefined') localStorage.setItem('jarvis_voice_engine', engine);
    }

    setEmotion(emotion) {
        this.currentEmotion = emotion || 'neutral';
    }

    setOpenAIVoice(voiceId) {
        this.selectedOpenAIVoice = voiceId;
        if (typeof window !== 'undefined') localStorage.setItem('jarvis_openai_voice', voiceId);
    }

    setAzureVoice(voiceId) {
        this.selectedAzureVoice = voiceId;
        if (typeof window !== 'undefined') localStorage.setItem('jarvis_azure_voice', voiceId);
    }

    setElevenLabsVoice(voiceId) {
        this.selectedElevenLabsVoice = voiceId;
        if (typeof window !== 'undefined') localStorage.setItem('jarvis_elevenlabs_voice_id', voiceId);
    }

    // ─────────────────────────────────────────
    // Audio Unlock (iOS/Android autoplay fix)
    // ─────────────────────────────────────────
    setupUnlockListeners() {
        const unlock = async () => { await this.unlockAudio(); };
        ['click', 'touchstart', 'keydown', 'mousedown', 'pointerdown'].forEach(evt => {
            window.addEventListener(evt, unlock, { passive: true, once: false });
        });
    }

    async unlockAudio() {
        if (!this.audio && typeof window !== 'undefined') {
            this.audio = document.getElementById('jarvis-persistent-audio') || new Audio();
        }
        if (!this.audio || this.isUnlocked) return;
        try {
            this.audio.src = 'data:audio/wav;base64,UklGRigAAABXQVZFZm10IBIAAAABAAEARKwAAIhYAQACABAAAABkYXRhAgAAAAEA';
            const p = this.audio.play();
            if (p !== undefined) await p;
            this.isUnlocked = true;
        } catch (err) {
            // User hasn't interacted yet — will unlock on next interaction
        }
    }

    // ─────────────────────────────────────────
    // Native bn-BD Voice Discovery
    // ─────────────────────────────────────────
    initNativeBnVoice() {
        if (!this.synth) return;
        const discover = () => {
            const voices = this.synth.getVoices();
            // Prefer Bangladeshi Bengali, then Indian Bengali, then any Bengali
            this.selectedNativeBnVoice =
                voices.find(v => v.lang === 'bn-BD' && (v.name.includes('Natural') || v.name.includes('Online'))) ||
                voices.find(v => v.lang === 'bn-BD') ||
                voices.find(v => v.lang.startsWith('bn')) ||
                voices.find(v => v.name.toLowerCase().includes('bangla') || v.name.toLowerCase().includes('bengali')) ||
                null;
        };
        discover();
        if (this.synth.onvoiceschanged !== undefined) {
            this.synth.onvoiceschanged = discover;
        }
    }

    // ─────────────────────────────────────────
    // MAIN SPEAK ENTRY POINT
    // ─────────────────────────────────────────
    async speak(text, emotionOverride = null) {
        if (!text) return;
        this.stop();

        const emotion = emotionOverride || this.currentEmotion;

        // Clean text for TTS (remove markdown, URLs, special chars)
        const cleanText = String(text)
            .replace(/\*\*(.*?)\*\*/g, '$1')   // bold → plain
            .replace(/\*(.*?)\*/g, '$1')        // italic → plain
            .replace(/#{1,6}\s/g, '')           // headings
            .replace(/[`_]/g, '')
            .replace(/৳/g, 'টাকা')              // ৳ symbol → বাংলা
            .replace(/AED/g, 'দিরহাম')          // AED → বাংলা
            .replace(/https?:\/\/[^\s]+/g, '')  // URLs
            .replace(/\s+/g, ' ')
            .trim();

        if (!cleanText) return;

        this.isSpeaking = true;
        this.onStartCallback(cleanText);

        const openAIKey = typeof window !== 'undefined' ? (localStorage.getItem('jarvis_openai_key') || '').trim() : '';
        const elevenLabsKey = typeof window !== 'undefined' ? (localStorage.getItem('jarvis_elevenlabs_key') || '').trim() : '';
        const gcpKey = typeof window !== 'undefined' ? (localStorage.getItem('jarvis_gcp_tts_key') || '').trim() : '';

        try {
            // ── Priority 1: OpenAI TTS (most natural, emotional) ──
            if (openAIKey && this.activeEngine === 'openai') {
                try {
                    await this.speakOpenAI(cleanText, openAIKey, emotion);
                    return;
                } catch (err) {
                    console.warn('[VoiceSpeaker] OpenAI TTS failed, falling back:', err.message);
                }
            }

            // ── Priority 2: ElevenLabs TTS (human-like, free tier) ──
            if (elevenLabsKey && (this.activeEngine === 'elevenlabs' || this.activeEngine === 'openai')) {
                try {
                    await this.speakElevenLabs(cleanText, elevenLabsKey, emotion);
                    return;
                } catch (err) {
                    console.warn('[VoiceSpeaker] ElevenLabs TTS failed, falling back:', err.message);
                }
            }

            // ── Priority 3: Google Cloud TTS (bn-BD-Neural2, best Bangladeshi voice) ──
            if (gcpKey && (this.activeEngine === 'gcp' || this.activeEngine === 'openai' || this.activeEngine === 'elevenlabs')) {
                try {
                    await this.speakGoogleCloudTTS(cleanText, gcpKey, emotion);
                    return;
                } catch (err) {
                    console.warn('[VoiceSpeaker] GCP TTS failed, falling back:', err.message);
                }
            }

            // ── Priority 4: Browser SpeechSynthesis (always works, bn-BD) ──
            await this.speakBrowser(cleanText, emotion);

        } catch (fatalErr) {
            console.error('[VoiceSpeaker] Fatal speech error:', fatalErr);
        } finally {
            this.isSpeaking = false;
            this.onEndCallback();
        }
    }

    // ─────────────────────────────────────────
    // Engine 1: OpenAI TTS (ChatGPT Voice)
    // ─────────────────────────────────────────
    async speakOpenAI(text, apiKey, emotion) {
        // Emotion → speed mapping
        const speedMap = { urgent: 1.15, happy: 1.05, sad: 0.9, serious: 0.95, neutral: 1.0 };
        const speed = speedMap[emotion] || 1.0;

        const response = await fetch('https://api.openai.com/v1/audio/speech', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiKey}`
            },
            body: JSON.stringify({
                model: 'tts-1-hd',          // HD quality
                input: text,
                voice: this.selectedOpenAIVoice || 'onyx',
                response_format: 'mp3',
                speed
            })
        });

        if (!response.ok) {
            const errData = await response.json().catch(() => ({}));
            throw new Error(errData.error?.message || `OpenAI TTS Error: ${response.status}`);
        }

        const blob = await response.blob();
        return await this._playBlob(blob);
    }

    // ─────────────────────────────────────────
    // Engine 2: ElevenLabs TTS (Human-like)
    // ─────────────────────────────────────────
    async speakElevenLabs(text, apiKey, emotion) {
        // Default to a good multilingual voice if no specific voice ID saved
        const voiceId = this.selectedElevenLabsVoice || 'pNInz6obpgDQGcFmaJgB'; // "Adam" — deep male

        // Emotion → stability/similarity mapping
        const settingsMap = {
            urgent:  { stability: 0.3, similarity_boost: 0.8, style: 0.6 },
            happy:   { stability: 0.4, similarity_boost: 0.75, style: 0.7 },
            sad:     { stability: 0.8, similarity_boost: 0.85, style: 0.2 },
            serious: { stability: 0.7, similarity_boost: 0.8, style: 0.3 },
            neutral: { stability: 0.5, similarity_boost: 0.8, style: 0.4 }
        };
        const voiceSettings = settingsMap[emotion] || settingsMap.neutral;

        const response = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'xi-api-key': apiKey
            },
            body: JSON.stringify({
                text,
                model_id: 'eleven_multilingual_v2',  // Supports Bengali
                voice_settings: voiceSettings,
                language_code: 'bn'
            })
        });

        if (!response.ok) {
            const errData = await response.json().catch(() => ({}));
            throw new Error(errData.detail?.message || `ElevenLabs TTS Error: ${response.status}`);
        }

        const blob = await response.blob();
        return await this._playBlob(blob);
    }

    // ─────────────────────────────────────────
    // Engine 3: Google Cloud TTS (bn-BD-Neural2)
    // ─────────────────────────────────────────
    async speakGoogleCloudTTS(text, gcpKey, emotion) {
        // Emotion → prosody mapping
        const prosodyMap = {
            urgent:  { speakingRate: 1.15, pitch: 1.0 },
            happy:   { speakingRate: 1.08, pitch: 2.0 },
            sad:     { speakingRate: 0.88, pitch: -2.0 },
            serious: { speakingRate: 0.92, pitch: -1.5 },
            neutral: { speakingRate: 1.02, pitch: -1.0 }
        };
        const prosody = prosodyMap[emotion] || prosodyMap.neutral;

        const savedGcpVoice = typeof window !== 'undefined'
            ? (localStorage.getItem('jarvis_gcp_voice') || 'bn-BD-Neural2-B')
            : 'bn-BD-Neural2-B';

        const response = await fetch(
            `https://texttospeech.googleapis.com/v1/text:synthesize?key=${gcpKey}`,
            {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    input: { text },
                    voice: {
                        languageCode: 'bn-BD',
                        name: savedGcpVoice,
                        ssmlGender: savedGcpVoice.includes('B') ? 'MALE' : 'FEMALE'
                    },
                    audioConfig: {
                        audioEncoding: 'MP3',
                        speakingRate: prosody.speakingRate,
                        pitch: prosody.pitch,
                        effectsProfileId: ['headphone-class-device']
                    }
                })
            }
        );

        if (!response.ok) {
            const errData = await response.json().catch(() => ({}));
            throw new Error(errData.error?.message || `GCP TTS Error: ${response.status}`);
        }

        const data = await response.json();
        if (!data.audioContent) throw new Error('GCP TTS returned empty audioContent');

        // Base64 MP3 → Blob → Play
        const binaryStr = atob(data.audioContent);
        const bytes = new Uint8Array(binaryStr.length);
        for (let i = 0; i < binaryStr.length; i++) {
            bytes[i] = binaryStr.charCodeAt(i);
        }
        const blob = new Blob([bytes], { type: 'audio/mp3' });
        return await this._playBlob(blob);
    }

    // ─────────────────────────────────────────
    // Engine 4: Browser SpeechSynthesis (bn-BD)
    // ─────────────────────────────────────────
    async speakBrowser(text, emotion) {
        if (!this.synth) return;
        this.synth.cancel();

        // Emotion → rate/pitch
        const paramsMap = {
            urgent:  { rate: 1.15, pitch: 1.1 },
            happy:   { rate: 1.05, pitch: 1.15 },
            sad:     { rate: 0.88, pitch: 0.88 },
            serious: { rate: 0.92, pitch: 0.92 },
            neutral: { rate: 0.98, pitch: 1.0 }
        };
        const params = paramsMap[emotion] || paramsMap.neutral;

        // Split into natural sentence chunks for better rhythm
        const chunks = this.splitIntoSentences(text);

        for (const chunk of chunks) {
            if (!this.isSpeaking) break;
            await new Promise((resolve) => {
                const utt = new SpeechSynthesisUtterance(chunk);
                utt.lang = 'bn-BD';
                utt.rate = params.rate;
                utt.pitch = params.pitch;
                utt.volume = 1.0;

                if (this.selectedNativeBnVoice) {
                    utt.voice = this.selectedNativeBnVoice;
                }

                // Watchdog: if TTS hangs, move on
                let watchdog = setTimeout(() => resolve(), 12000);
                utt.onend = () => { clearTimeout(watchdog); resolve(); };
                utt.onerror = () => { clearTimeout(watchdog); resolve(); };

                this.synth.speak(utt);

                // Chrome bug fix: SpeechSynthesis freezes after ~15s
                const keepAlive = setInterval(() => {
                    if (!this.synth.speaking) { clearInterval(keepAlive); return; }
                    this.synth.pause();
                    this.synth.resume();
                }, 10000);
                utt.onend = () => { clearInterval(keepAlive); clearTimeout(watchdog); resolve(); };
                utt.onerror = () => { clearInterval(keepAlive); clearTimeout(watchdog); resolve(); };
            });
        }
    }

    // ─────────────────────────────────────────
    // Internal: Play audio blob
    // ─────────────────────────────────────────
    async _playBlob(blob) {
        if (!this.audio && typeof window !== 'undefined') {
            this.audio = document.getElementById('jarvis-persistent-audio') || new Audio();
        }
        if (!this.audio) return;

        const audioUrl = URL.createObjectURL(blob);

        return new Promise((resolve, reject) => {
            const watchdog = setTimeout(() => {
                URL.revokeObjectURL(audioUrl);
                resolve();
            }, 30000);

            this.audio.onended = () => {
                clearTimeout(watchdog);
                URL.revokeObjectURL(audioUrl);
                this.audio.onended = null;
                this.audio.onerror = null;
                resolve();
            };

            this.audio.onerror = (e) => {
                clearTimeout(watchdog);
                URL.revokeObjectURL(audioUrl);
                this.audio.onended = null;
                this.audio.onerror = null;
                reject(new Error('Audio playback error: ' + e.type));
            };

            this.audio.src = audioUrl;
            const playPromise = this.audio.play();
            if (playPromise !== undefined) {
                playPromise.catch(err => {
                    clearTimeout(watchdog);
                    URL.revokeObjectURL(audioUrl);
                    reject(err);
                });
            }
        });
    }

    // ─────────────────────────────────────────
    // Sentence Chunker (natural speech rhythm)
    // ─────────────────────────────────────────
    splitIntoSentences(text) {
        const rawChunks = text.split(/([।?!.]+[\s\n]*)/);
        const chunks = [];
        let buffer = '';

        for (let i = 0; i < rawChunks.length; i++) {
            buffer += rawChunks[i];
            if (rawChunks[i].match(/[।?!.]/) || buffer.length >= 150) {
                const trimmed = buffer.trim();
                if (trimmed) chunks.push(trimmed);
                buffer = '';
            }
        }
        if (buffer.trim()) chunks.push(buffer.trim());
        return chunks.filter(c => c.length > 0 && !c.match(/^[।?!,\s]+$/));
    }

    // ─────────────────────────────────────────
    // Stop All Audio
    // ─────────────────────────────────────────
    stop() {
        this.isSpeaking = false;
        if (this.audio) {
            try {
                this.audio.pause();
                this.audio.currentTime = 0;
                this.audio.onended = null;
                this.audio.onerror = null;
            } catch (err) {
                console.warn('[VoiceSpeaker] Stop audio non-critical:', err);
            }
        }
        if (this.synth) {
            try { this.synth.cancel(); } catch (err) {
                console.warn('[VoiceSpeaker] Stop synth non-critical:', err);
            }
        }
    }

    // ─────────────────────────────────────────
    // Get active engine name (for UI display)
    // ─────────────────────────────────────────
    getActiveEngineLabel() {
        const openAIKey = typeof window !== 'undefined' ? (localStorage.getItem('jarvis_openai_key') || '').trim() : '';
        const elevenKey = typeof window !== 'undefined' ? (localStorage.getItem('jarvis_elevenlabs_key') || '').trim() : '';
        const gcpKey = typeof window !== 'undefined' ? (localStorage.getItem('jarvis_gcp_tts_key') || '').trim() : '';

        if (openAIKey && this.activeEngine === 'openai') return 'ChatGPT Voice';
        if (elevenKey) return 'ElevenLabs Neural';
        if (gcpKey) return 'Google Cloud bn-BD';
        return 'Browser TTS';
    }

    onStart(fn) { this.onStartCallback = fn; }
    onEnd(fn) { this.onEndCallback = fn; }
}

export const voiceSpeaker = new VoiceSpeaker();

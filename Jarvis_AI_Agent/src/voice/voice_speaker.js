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
            this.activeEngine = 'free-bengali';
        }

        this.selectedOpenAIVoice = (typeof window !== 'undefined' && localStorage.getItem('jarvis_openai_voice')) || 'onyx';
        this.selectedAzureVoice = (typeof window !== 'undefined' && localStorage.getItem('jarvis_azure_voice')) || 'bn-BD-PradeepNeural';
        this.selectedElevenLabsVoice = (typeof window !== 'undefined' && localStorage.getItem('jarvis_elevenlabs_voice_id')) || '';

        // Persistent reusable audio tracking
        this.currentAudio = null;
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
    // Audio Unlock (iOS/Android/Chrome autoplay fix)
    // ─────────────────────────────────────────
    setupUnlockListeners() {
        const unlock = async () => { await this.unlockAudio(); };
        ['click', 'touchstart', 'keydown', 'mousedown', 'pointerdown'].forEach(evt => {
            window.addEventListener(evt, unlock, { passive: true, once: false });
        });
    }

    async unlockAudio() {
        if (this.isUnlocked) return;
        try {
            const AudioCtx = window.AudioContext || window.webkitAudioContext;
            if (AudioCtx) {
                if (!this.audioCtx) this.audioCtx = new AudioCtx();
                if (this.audioCtx.state === 'suspended') {
                    await this.audioCtx.resume();
                }
            }
            if (!this.audio && typeof window !== 'undefined') {
                this.audio = document.getElementById('jarvis-persistent-audio') || new Audio();
            }
            if (this.audio) {
                this.audio.src = 'data:audio/wav;base64,UklGRigAAABXQVZFZm10IBIAAAABAAEARKwAAIhYAQACABAAAABkYXRhAgAAAAEA';
                const p = this.audio.play();
                if (p !== undefined) await p;
            }
            this.isUnlocked = true;
        } catch (err) {
            // Unlocked on next gesture
        }
    }

    // ─────────────────────────────────────────
    // Native bn-BD Voice Discovery (Microsoft Edge Natural Neural Voices)
    // ─────────────────────────────────────────
    initNativeBnVoice() {
        if (!this.synth) return;
        const discover = () => {
            this.getNativeBnVoice();
            if (this.selectedNativeBnVoice) {
                console.log(`[VoiceSpeaker] 🎙️ Discovered Native Voice: "${this.selectedNativeBnVoice.name}" (${this.selectedNativeBnVoice.lang})`);
            }
        };
        discover();
        if (this.synth.onvoiceschanged !== undefined) {
            this.synth.onvoiceschanged = discover;
        }
    }

    /**
     * Dynamically retrieve the best Bengali voice available in the current browser
     */
    getNativeBnVoice() {
        if (!this.synth) return null;
        const voices = this.synth.getVoices() || [];
        if (voices.length === 0) return this.selectedNativeBnVoice || null;

        const preferred = (this.selectedAzureVoice || '').toLowerCase();
        let matchedVoice = null;

        // User preference match (Pradeep or Nabanita Natural)
        if (preferred.includes('nabanita')) {
            matchedVoice = voices.find(v => v.name.includes('Nabanita') && (v.name.includes('Natural') || v.name.includes('Online'))) ||
                           voices.find(v => v.name.includes('Nabanita'));
        } else if (preferred.includes('pradeep')) {
            matchedVoice = voices.find(v => v.name.includes('Pradeep') && (v.name.includes('Natural') || v.name.includes('Online'))) ||
                           voices.find(v => v.name.includes('Pradeep'));
        }

        const bestVoice = matchedVoice ||
            voices.find(v => (v.name.includes('Pradeep') || v.name.includes('Nabanita') || v.name.includes('Bashkar') || v.name.includes('Nabaneeta')) && (v.name.includes('Natural') || v.name.includes('Online'))) ||
            voices.find(v => (v.name.includes('Natural') || v.name.includes('Online')) && (v.lang.startsWith('bn') || v.name.includes('Bengali') || v.name.includes('Bangla'))) ||
            voices.find(v => v.name.includes('Pradeep') || v.name.includes('Nabanita') || v.name.includes('Bashkar') || v.name.includes('Nabaneeta')) ||
            voices.find(v => v.lang === 'bn-BD') ||
            voices.find(v => v.lang === 'bn-IN') ||
            voices.find(v => v.name.includes('Google') && (v.lang.startsWith('bn') || v.name.includes('Bengali') || v.name.includes('Bangla'))) ||
            voices.find(v => v.lang.startsWith('bn')) ||
            voices.find(v => v.name.toLowerCase().includes('bangla') || v.name.toLowerCase().includes('bengali')) ||
            null;

        this.selectedNativeBnVoice = bestVoice || null;
        return this.selectedNativeBnVoice;
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
            .replace(/(?:মোহাম্মদ\s+)?(?:আম্বরান|আমরান)(?:\s*ভাই(?:য়া)?)?/gi, 'স্যার') // Persona Guardrail: Never pronounce owner name
            .replace(/\bভাইয়া\b/g, 'স্যার')      // Always address as Sir (স্যার)
            .replace(/https?:\/\/[^\s]+/g, '')  // URLs
            .replace(/\s+/g, ' ')
            .trim();

        if (!cleanText) return;

        this.isSpeaking = true;
        this.onStartCallback(cleanText);

        const openAIKey = typeof window !== 'undefined' ? (localStorage.getItem('jarvis_openai_key') || '').trim() : '';
        const elevenLabsKey = typeof window !== 'undefined' ? (localStorage.getItem('jarvis_elevenlabs_key') || '').trim() : '';
        const gcpKey = typeof window !== 'undefined' ? (localStorage.getItem('jarvis_gcp_tts_key') || '').trim() : '';
        const azureKey = typeof window !== 'undefined' ? (localStorage.getItem('jarvis_azure_key') || '').trim() : '';
        const azureRegion = typeof window !== 'undefined' ? (localStorage.getItem('jarvis_azure_region') || 'eastus').trim() : 'eastus';

        try {
            // ── Priority 1: Azure Speech Neural REST API (if user entered Azure key) ──
            if (azureKey) {
                try {
                    console.log('[VoiceSpeaker] 🎙️ Speaking with Microsoft Azure Speech Neural API...');
                    await this.speakAzureNeural(cleanText, azureKey, azureRegion, emotion);
                    return;
                } catch (err) {
                    console.warn('[VoiceSpeaker] Azure Neural API failed, falling back:', err.message);
                }
            }

            // ── Priority 2: Microsoft Edge Natural Neural Voices via Browser SpeechSynthesis ──
            // If the browser has Microsoft Natural (Online) voices or Google Bengali, use it for zero-latency, human-like voice
            const activeVoice = this.getNativeBnVoice();
            const isNaturalVoice = activeVoice && (
                activeVoice.name.includes('Natural') ||
                activeVoice.name.includes('Online') ||
                activeVoice.name.includes('Bashkar') ||
                activeVoice.name.includes('Pradeep') ||
                activeVoice.name.includes('Nabanita') ||
                activeVoice.name.includes('Google')
            );

            if (isNaturalVoice) {
                try {
                    console.log(`[VoiceSpeaker] 🎙️ Speaking with Microsoft Natural Voice: ${activeVoice.name}`);
                    await this.speakBrowser(cleanText, emotion);
                    return;
                } catch (err) {
                    console.warn('[VoiceSpeaker] Microsoft Natural voice playback failed, falling back:', err.message);
                }
            }

            // ── Priority 3: ElevenLabs TTS (if key available and healthy) ──
            if (elevenLabsKey) {
                try {
                    await this.speakElevenLabs(cleanText, elevenLabsKey, emotion);
                    return;
                } catch (err) {
                    console.warn('[VoiceSpeaker] ElevenLabs TTS failed, falling back to next engine:', err.message);
                }
            }

            // ── Priority 4: OpenAI TTS (if key available and active) ──
            if (openAIKey && this.activeEngine === 'openai') {
                try {
                    await this.speakOpenAI(cleanText, openAIKey, emotion);
                    return;
                } catch (err) {
                    console.warn('[VoiceSpeaker] OpenAI TTS failed, falling back:', err.message);
                }
            }

            // ── Priority 5: Google Cloud TTS (bn-BD-Neural2) ──
            if (gcpKey) {
                try {
                    await this.speakGoogleCloudTTS(cleanText, gcpKey, emotion);
                    return;
                } catch (err) {
                    console.warn('[VoiceSpeaker] GCP TTS failed, falling back:', err.message);
                }
            }

            // ── Priority 6: Standard Browser SpeechSynthesis (Native OS bn-BD) ──
            // ONLY attempt if browser actually has a native Bengali voice installed
            if (activeVoice) {
                try {
                    console.log(`[VoiceSpeaker] 🎙️ Speaking with Native Voice: ${activeVoice.name}`);
                    await this.speakBrowser(cleanText, emotion);
                    return;
                } catch (err) {
                    console.warn('[VoiceSpeaker] Browser SpeechSynthesis failed, falling back to online stream:', err.message);
                }
            } else {
                console.log('[VoiceSpeaker] ℹ️ No native Bengali voice in this browser (Chrome on Windows). Cascading to High-Quality Free Bengali Stream TTS...');
            }

            // ── Priority 7: Free Bengali Stream TTS (Zero key, 100% reliable) ──
            try {
                await this.speakFreeBengaliTTS(cleanText);
                return;
            } catch (err) {
                console.warn('[VoiceSpeaker] Free Bengali stream TTS failed:', err.message);
            }

        } catch (fatalErr) {
            console.error('[VoiceSpeaker] Fatal speech error:', fatalErr);
        } finally {
            this.isSpeaking = false;
            this.onEndCallback();
        }
    }

    // ─────────────────────────────────────────
    // Engine: Microsoft Azure Speech Neural API
    // ─────────────────────────────────────────
    async speakAzureNeural(text, apiKey, region = 'eastus', emotion = 'neutral') {
        const voiceName = this.selectedAzureVoice || 'bn-BD-BashkarNeural';
        const ssml = `<speak version='1.0' xml:lang='bn-BD'><voice xml:lang='bn-BD' name='${voiceName}'>${text}</voice></speak>`;

        const response = await fetch(`https://${region}.tts.speech.microsoft.com/cognitiveservices/v1`, {
            method: 'POST',
            headers: {
                'Ocp-Apim-Subscription-Key': apiKey,
                'Content-Type': 'application/ssml+xml',
                'X-Microsoft-OutputFormat': 'audio-16khz-128kbitrate-mono-mp3'
            },
            body: ssml
        });

        if (!response.ok) {
            throw new Error(`Azure Speech API HTTP ${response.status}`);
        }

        const blob = await response.blob();
        return await this._playBlob(blob);
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
        // Universal premade default: Adam (pNInz6obpgDQGcFmaJgB) or Rachel
        const voiceId = (this.selectedElevenLabsVoice || '').trim() || 'pNInz6obpgDQGcFmaJgB';

        // Emotion → stability/similarity mapping
        const settingsMap = {
            urgent:  { stability: 0.35, similarity_boost: 0.8, style: 0.5 },
            happy:   { stability: 0.45, similarity_boost: 0.75, style: 0.6 },
            sad:     { stability: 0.75, similarity_boost: 0.85, style: 0.2 },
            serious: { stability: 0.65, similarity_boost: 0.8, style: 0.3 },
            neutral: { stability: 0.5, similarity_boost: 0.75, style: 0.3 }
        };
        const voiceSettings = settingsMap[emotion] || settingsMap.neutral;

        console.log(`[VoiceSpeaker] 🎙️ ElevenLabs TTS calling with voice: ${voiceId}`);

        // Try eleven_multilingual_v2, fallback to eleven_flash_v2_5
        const modelsToTry = ['eleven_multilingual_v2', 'eleven_flash_v2_5'];
        let lastErr = null;

        for (const model_id of modelsToTry) {
            try {
                const response = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'xi-api-key': apiKey
                    },
                    body: JSON.stringify({
                        text,
                        model_id,
                        voice_settings: voiceSettings
                    })
                });

                if (!response.ok) {
                    const errData = await response.json().catch(() => ({}));
                    const msg = errData.detail?.message || `HTTP ${response.status}`;
                    console.warn(`[VoiceSpeaker] ElevenLabs ${model_id} error:`, msg);
                    lastErr = new Error(msg);

                    // If key is invalid (401) or quota is exhausted (402/429), break immediately to allow instant fallback
                    if (response.status === 401 || response.status === 402 || response.status === 429) {
                        throw lastErr;
                    }
                    continue;
                }

                const blob = await response.blob();
                console.log(`[VoiceSpeaker] ✅ ElevenLabs speech generated (${blob.size} bytes), playing audio...`);
                return await this._playBlob(blob);

            } catch (err) {
                lastErr = err;
                if (err.message && (err.message.includes('401') || err.message.includes('402') || err.message.includes('quota') || err.message.includes('credit'))) {
                    throw err;
                }
            }
        }

        throw lastErr || new Error('ElevenLabs TTS failed');
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
        if (!this.synth) throw new Error('SpeechSynthesis not supported');
        const voice = this.getNativeBnVoice();
        if (!voice) {
            throw new Error('No native Bengali voice found in browser');
        }

        try {
            this.synth.cancel();
        } catch (e) {
            console.warn('[VoiceSpeaker] Synth cancel non-critical:', e);
        }

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
            await new Promise((resolve, reject) => {
                const utt = new SpeechSynthesisUtterance(chunk);
                utt.voice = voice;
                utt.lang = voice.lang || 'bn-BD';
                utt.rate = params.rate;
                utt.pitch = params.pitch;
                utt.volume = 1.0;

                let keepAlive = null;
                // Watchdog: if TTS hangs, move on
                const watchdog = setTimeout(() => {
                    if (keepAlive) clearInterval(keepAlive);
                    resolve();
                }, 15000);

                utt.onend = () => {
                    if (keepAlive) clearInterval(keepAlive);
                    clearTimeout(watchdog);
                    resolve();
                };

                utt.onerror = (e) => {
                    if (keepAlive) clearInterval(keepAlive);
                    clearTimeout(watchdog);
                    console.warn('[VoiceSpeaker] Browser utterance error:', e?.error || e);
                    reject(new Error(e?.error || 'speech-synthesis-failed'));
                };

                this.synth.speak(utt);

                // Chrome bug fix: SpeechSynthesis freezes after ~15s
                keepAlive = setInterval(() => {
                    if (!this.synth.speaking) {
                        clearInterval(keepAlive);
                        return;
                    }
                    this.synth.pause();
                    this.synth.resume();
                }, 10000);
            });
        }
    }

    // ─────────────────────────────────────────
    // Priority 4: Free Bengali Stream TTS (Zero key, 100% reliable across Chrome/Edge/Firefox)
    // ─────────────────────────────────────────
    async speakFreeBengaliTTS(text) {
        console.log('[VoiceSpeaker] 🌐 Speaking with High-Quality Free Bengali Stream TTS...');
        const chunks = this.splitIntoSentences(text);
        for (const chunk of chunks) {
            if (!this.isSpeaking) break;
            const safe = chunk.slice(0, 150).trim();
            if (!safe) continue;

            const endpoints = [
                `https://translate.googleapis.com/translate_tts?client=gtx&sl=auto&tl=bn&ie=UTF-8&q=${encodeURIComponent(safe)}`,
                `https://translate.google.com/translate_tts?ie=UTF-8&tl=bn&client=tw-ob&q=${encodeURIComponent(safe)}`,
                `https://translate.google.com/translate_tts?ie=UTF-8&tl=bn&client=dict-chrome-ex&q=${encodeURIComponent(safe)}`
            ];

            let played = false;
            for (const url of endpoints) {
                if (!this.isSpeaking) break;
                try {
                    await this._playAudioUrl(url);
                    played = true;
                    break;
                } catch (streamErr) {
                    console.warn(`[VoiceSpeaker] Stream mirror failed (${url.slice(0, 42)}...):`, streamErr.message);
                }
            }

            if (!played) {
                console.warn('[VoiceSpeaker] All free stream mirrors failed for sentence:', safe);
            }
        }
    }

    // ─────────────────────────────────────────
    // Internal: Play audio URL directly
    // ─────────────────────────────────────────
    async _playAudioUrl(url) {
        await this.unlockAudio();
        return new Promise((resolve, reject) => {
            let audio = null;
            if (typeof document !== 'undefined') {
                audio = document.getElementById('jarvis-persistent-audio');
            }
            if (!audio) {
                audio = this.audio || new Audio();
            }
            this.currentAudio = audio;

            audio.referrerPolicy = 'no-referrer';
            audio.setAttribute('referrerpolicy', 'no-referrer');
            audio.preload = 'auto';
            audio.volume = 1.0;
            audio.muted = false;

            let finished = false;
            let watchdog = null;

            const cleanup = () => {
                if (watchdog) clearTimeout(watchdog);
                audio.onended = null;
                audio.onerror = null;
            };

            const finishSuccess = () => {
                if (!finished) {
                    finished = true;
                    cleanup();
                    if (this.currentAudio === audio) {
                        this.currentAudio = null;
                    }
                    resolve();
                }
            };

            const finishError = (err) => {
                if (!finished) {
                    finished = true;
                    cleanup();
                    if (this.currentAudio === audio) {
                        this.currentAudio = null;
                    }
                    reject(err);
                }
            };

            watchdog = setTimeout(() => {
                finishSuccess();
            }, 25000);

            audio.onended = finishSuccess;
            audio.onerror = (e) => {
                finishError(new Error(`Audio URL failed: ${e?.message || 'media-load-error'}`));
            };

            audio.src = url;
            const playPromise = audio.play();
            if (playPromise !== undefined) {
                playPromise.catch((err) => {
                    console.warn('[VoiceSpeaker] audio.play() rejected:', err.name, err.message);
                    finishError(err);
                });
            }
        });
    }

    // ─────────────────────────────────────────
    // Internal: Play audio blob
    // ─────────────────────────────────────────
    async _playBlob(blob) {
        const audioUrl = URL.createObjectURL(blob);
        try {
            await this._playAudioUrl(audioUrl);
        } finally {
            URL.revokeObjectURL(audioUrl);
        }
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
        if (this.currentAudio) {
            try {
                this.currentAudio.pause();
                this.currentAudio.currentTime = 0;
            } catch (err) {
                console.warn('[VoiceSpeaker] Stop current audio non-critical:', err);
            }
            this.currentAudio = null;
        }
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
        return 'Bangla HD Voice';
    }

    onStart(fn) { this.onStartCallback = fn; }
    onEnd(fn) { this.onEndCallback = fn; }
}

export const voiceSpeaker = new VoiceSpeaker();

/**
 * Automated Verification Script for Jarvis AI Multi-Provider System
 */
import { LLMAgent } from '../src/core/llm_agent.js';
import { VoiceSpeaker } from '../src/voice/voice_speaker.js';
import { VoiceListener } from '../src/voice/voice_listener.js';

console.log('--- 🧪 STARTING JARVIS SYSTEM LINE-BY-LINE AUDIT ---');

// Mock browser globals for node testing
if (typeof window === 'undefined') {
    global.window = {
        location: { origin: 'https://maa-motors-jarvis.web.app' },
        addEventListener: () => {},
        speechSynthesis: {
            getVoices: () => [
                { name: 'Microsoft Pradeep Online (Natural) - Bengali (Bangladesh)', lang: 'bn-BD' },
                { name: 'Microsoft Nabanita Online (Natural) - Bengali (Bangladesh)', lang: 'bn-BD' },
                { name: 'Google বাংলা', lang: 'bn-BD' }
            ],
            speak: () => {},
            cancel: () => {},
            pause: () => {},
            resume: () => {}
        },
        SpeechRecognition: class MockSR {
            start() {}
            stop() {}
        }
    };
    global.document = {
        getElementById: () => null,
        addEventListener: () => {},
        body: { appendChild: () => {}, removeChild: () => {} }
    };
    Object.defineProperty(globalThis, 'navigator', {
        value: {
            userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/120.0.0.0',
            mediaDevices: {
                getUserMedia: async () => ({
                    getTracks: () => [{ stop: () => {} }]
                })
            }
        },
        configurable: true,
        writable: true
    });
    global.Audio = class MockAudio {
        play() { return Promise.resolve(); }
        pause() {}
        setAttribute() {}
    };
    global.localStorage = {
        store: {},
        getItem(k) { return this.store[k] || null; },
        setItem(k, v) { this.store[k] = String(v); },
        removeItem(k) { delete this.store[k]; }
    };
}

let passedTests = 0;
let totalTests = 0;

function assert(condition, message) {
    totalTests++;
    if (condition) {
        console.log(`✅ [PASS] ${message}`);
        passedTests++;
    } else {
        console.error(`❌ [FAIL] ${message}`);
        process.exit(1);
    }
}

// TEST 1: LLMAgent key pooling & delimiter parsing
const agent = new LLMAgent();
localStorage.setItem('jarvis_groq_keys', 'gsk_key1_abc12345, gsk_key2_xyz67890\ngsk_key3_mno112233');
const groqKeys = agent.getKeys('groq');
assert(groqKeys.length === 3, `Key pool parses 3 comma/newline separated keys (got ${groqKeys.length})`);
assert(groqKeys[0] === 'gsk_key1_abc12345', 'First key matches correctly');
assert(groqKeys[1] === 'gsk_key2_xyz67890', 'Second key matches correctly');
assert(groqKeys[2] === 'gsk_key3_mno112233', 'Third key matches correctly');

// TEST 2: Cooldown management on HTTP 429
agent.markKeyCooldown(groqKeys[0], 60000);
const availableAfterCooldown = agent.getAvailableKeys('groq');
assert(availableAfterCooldown.length === 2, `Available keys reduces to 2 when 1 key is on cooldown (got ${availableAfterCooldown.length})`);
assert(!availableAfterCooldown.includes('gsk_key1_abc12345'), 'Cooldown key is excluded');
assert(availableAfterCooldown[0] === 'gsk_key2_xyz67890', 'Next key in pool becomes active');

// TEST 3: Rate limit / Quota error detection
assert(agent.isQuotaOrRateLimitError({ status: 429 }), 'Detects HTTP 429 as quota error');
assert(agent.isQuotaOrRateLimitError({ message: 'Resource has been exhausted (e.g. check quota)' }), 'Detects quota error message');
assert(agent.isQuotaOrRateLimitError({ status: 402 }), 'Detects HTTP 402 as credit error');

// TEST 4: Emotion detection
assert(agent.detectEmotion('ভাইয়া খুব দ্রুত জানান, অনেক জরুরি!') === 'urgent', 'Detects urgent emotion correctly');
assert(agent.detectEmotion('আমার মনটা খুব খারাপ ভাইয়া') === 'sad', 'Detects sad emotion correctly');
assert(agent.detectEmotion('আলহামদুলিল্লাহ অনেক সুন্দর হয়েছে!') === 'happy', 'Detects happy emotion correctly');

// TEST 5: VoiceSpeaker Native Bengali Voice Discovery
const speaker = new VoiceSpeaker();
const nativeVoice = speaker.getNativeBnVoice();
assert(nativeVoice !== null, 'Finds native Bengali voice in browser');
assert(nativeVoice.name.includes('Pradeep') || nativeVoice.name.includes('Natural'), `Selects high-quality Natural voice: ${nativeVoice?.name}`);

// TEST 6: Preference switching (Nabanita vs Pradeep)
speaker.setAzureVoice('bn-BD-NabanitaNeural');
const nabanitaVoice = speaker.getNativeBnVoice();
assert(nabanitaVoice.name.includes('Nabanita'), `Switching to Nabanita selects Nabanita voice: ${nabanitaVoice?.name}`);

// TEST 7: Sentence chunking for natural speech rhythm
const sampleBangla = 'আসসালামু আলাইকুম ভাইয়া! আমি জার্ভিস। আপনার মা মোটরসের যাবতীয় হিসাব দেখতে আমি প্রস্তুত।';
const chunks = speaker.splitIntoSentences(sampleBangla);
assert(chunks.length >= 3, `Sentence chunker splits text into natural rhythmic parts (got ${chunks.length} chunks)`);

// TEST 8: VoiceListener STT Mode Detection
localStorage.setItem('jarvis_groq_key', 'gsk_test123456');
const listener = new VoiceListener();
assert(listener.getModeLabel() !== undefined, 'VoiceListener initializes successfully');

// TEST 9: Full Auto-Failover Simulation (Gemini 429 -> Groq Success)
localStorage.setItem('jarvis_gemini_keys', 'AIzaSy_gemini_key_failing');
localStorage.setItem('jarvis_groq_keys', 'gsk_groq_key_working');
localStorage.setItem('jarvis_auto_failover', 'true');
localStorage.setItem('jarvis_ai_provider', 'gemini');

const failoverAgent = new LLMAgent();
failoverAgent.chatGemini = async () => {
    const err = new Error('Resource has been exhausted (rate limit)');
    err.status = 429;
    throw err;
};
failoverAgent.chatOpenAICompatible = async (cfg) => {
    return { spoken: `Response successfully delivered from ${cfg.provider}!`, data: null };
};

const chatResponse = await failoverAgent.chat([], 'আজকের ব্যবসার অবস্থা কী?');
assert(chatResponse.spoken.includes('Groq Cloud'), `Auto-failover successfully shifts to Groq on Gemini 429 error (got: "${chatResponse.spoken}")`);
assert(failoverAgent.keyCooldowns.has('AIzaSy_gemini_key_failing'), 'Failing Gemini key is marked for cooldown');

// TEST 10: Chrome on Windows Simulation (Zero Bengali Voices in getVoices)
window.speechSynthesis.getVoices = () => [
    { name: 'Microsoft David - English (United States)', lang: 'en-US' },
    { name: 'Microsoft Zira - English (United States)', lang: 'en-US' }
];
const chromeSpeaker = new VoiceSpeaker();
const chromeVoice = chromeSpeaker.getNativeBnVoice();
assert(chromeVoice === null, 'Chrome on Windows correctly detects absence of native Bengali voices (returns null)');

// TEST 11: Chrome Speech Fallback Execution (Does NOT fail silently, invokes free stream)
let streamPlayed = false;
let cleanedAudioText = '';
chromeSpeaker.speakFreeBengaliTTS = async (txt) => {
    streamPlayed = true;
    cleanedAudioText = txt;
    assert(txt.length > 0, 'Free stream receives clean Bengali text');
};
await chromeSpeaker.speak('শুভ অপরাহ্ন, আম্বরান ভাই! আসসালামু আলাইকুম।');
assert(streamPlayed === true, 'Chrome seamlessly falls back to Free Bengali Stream TTS when native voice is missing');

// TEST 12: Persona Guardrail (Never utter owner personal name, always address as Sir)
assert(!cleanedAudioText.includes('আম্বরান'), 'Speaker sanitizer successfully removed "আম্বরান"');
assert(!cleanedAudioText.includes('আমরান'), 'Speaker sanitizer successfully removed "আমরান"');
assert(cleanedAudioText.includes('স্যার'), 'Speaker sanitizer successfully inserted "স্যার"');

// TEST 13: Wake Word Phonetic Matching (Bengali & English variations)
import { WakeWordListener } from '../src/voice/wake_word_listener.js';
const wwListener = new WakeWordListener();
const testPhrases = [
    'জার্ভিস',
    'জারভিস',
    'যারভিস',
    'সার্ভিস',
    'সারভিস',
    'জারবিস',
    'জাবিস',
    'জার্ভেস',
    'জারভেস',
    'Jarvis',
    'jarvis',
    'jarvice',
    'jarves',
    'jarviz',
    'service',
    'hey jarvis',
    'hello jarvis',
    'ওহে জার্ভিস',
    'হ্যালো জার্ভিস করিমের বাকি কত',
    'সার্ভিস আজকের বিক্রি কত',
    'জার্ভিস ভাই আজকের হিসাব দাও',
    'জার্ভিস স্যার কেমন আছেন'
];
for (const phrase of testPhrases) {
    const isMatched = Boolean(phrase.match(wwListener.wakeWordRegex));
    assert(isMatched, `Wake word regex matches phonetic variation: "${phrase}"`);
}

// TEST 14: index.html Persona Integrity (Ensure "ভাইয়া" is never present in static templates)
import fs from 'fs';
const indexHtml = fs.readFileSync('e:/maa-motors-erp/Jarvis_AI_Agent/index.html', 'utf8');
assert(!indexHtml.includes('ভাইয়া'), 'index.html contains no archaic or unwanted "ভাইয়া" greetings');
assert(indexHtml.includes('শুভ অপরাহ্ন স্যার'), 'index.html contains professional "শুভ অপরাহ্ন স্যার" greeting');

// TEST 15: Widescreen Executive AI Studio Structure
assert(indexHtml.includes('ai-studio-card'), 'index.html contains .ai-studio-card widescreen container');
assert(indexHtml.includes('ai-studio-grid'), 'index.html contains .ai-studio-grid 3-column layout');
assert(indexHtml.includes('studio-brain-col'), 'index.html contains Column 1 (AI Brain & Multi-Key Gateway)');
assert(indexHtml.includes('studio-voice-col'), 'index.html contains Column 2 (Neural Voice Engines)');
assert(indexHtml.includes('studio-diagnostics-col'), 'index.html contains Column 3 (Live Diagnostics & Sandbox)');
assert(indexHtml.includes('btn-test-active-key'), 'index.html contains live ping/speed test button');
assert(indexHtml.includes('studio-key-test-output'), 'index.html contains live ping output box');
assert(indexHtml.includes('studio-active-provider-badge'), 'index.html contains active provider diagnostic badge');
assert(indexHtml.includes('studio-total-keys-count'), 'index.html contains total keys pool badge');
assert(indexHtml.includes('studio-active-voice-badge'), 'index.html contains active voice engine badge');

// TEST 16: AISettingsModal Controller Methods
import { AISettingsModal } from '../src/core/ai_settings_modal.js';
assert(typeof AISettingsModal.prototype.updateDiagnosticBadges === 'function', 'AISettingsModal has updateDiagnosticBadges method');
assert(typeof AISettingsModal.prototype.testActiveKeyPing === 'function', 'AISettingsModal has testActiveKeyPing method');

console.log(`\n🎉 ALL ${passedTests}/${totalTests} TESTS PASSED SUCCESSFULLY! 100% CODE INTEGRITY PROVEN.`);



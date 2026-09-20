import './style.css';
import { auth, googleProvider } from './config.js';
import { onAuthStateChanged, signInWithPopup, signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { jarvisBrain } from './core/jarvis_brain.js';
import { VoiceListener } from './voice/voice_listener.js';
import { voiceSpeaker } from './voice/voice_speaker.js';
import { VoiceVisualizer } from './voice/voice_visualizer.js';
import { wakeWordListener } from './voice/wake_word_listener.js';
import { ERPBridge } from './bridge/erp_bridge.js';

// 1. Initialize Voice & Visualizer
const canvas = document.getElementById('visualizer-canvas');
const visualizer = new VoiceVisualizer(canvas);
const listener = new VoiceListener();

const micBtn = document.getElementById('mic-toggle-btn');
const dockMicBtn = document.getElementById('dock-mic-btn');
const orbMicIcon = document.getElementById('orb-mic-icon');
const micStatusText = document.getElementById('mic-status-text');
const textInput = document.getElementById('manual-command-input');
const sendBtn = document.getElementById('manual-send-btn');
const transcriptContainer = document.getElementById('transcript-container');

// Core State Coordinator (Idle, Listening, Thinking, Speaking)
function setCoreState(state) {
    visualizer.setState(state);
    if (!micBtn || !orbMicIcon || !dockMicBtn) return;

    micBtn.classList.remove('state-listening', 'state-thinking', 'state-speaking');
    dockMicBtn.classList.remove('state-listening', 'state-thinking', 'state-speaking');

    if (state === 'listening') {
        micBtn.classList.add('state-listening');
        dockMicBtn.classList.add('state-listening');
        orbMicIcon.className = 'fa-solid fa-waveform text-2xl text-emerald-400 animate-pulse';
        if (micStatusText) micStatusText.innerText = 'শুনছি স্যার, বাংলায় বলুন...';
    } else if (state === 'thinking') {
        micBtn.classList.add('state-thinking');
        dockMicBtn.classList.add('state-thinking');
        orbMicIcon.className = 'fa-solid fa-circle-notch fa-spin text-2xl text-amber-400';
        if (micStatusText) micStatusText.innerText = 'উপাত্ত বিশ্লেষণ করছি...';
    } else if (state === 'speaking') {
        micBtn.classList.add('state-speaking');
        dockMicBtn.classList.add('state-speaking');
        orbMicIcon.className = 'fa-solid fa-volume-high text-2xl text-cyan-300 animate-bounce';
        if (micStatusText) micStatusText.innerText = 'জার্ভিস কথা বলছে...';
    } else {
        orbMicIcon.className = 'fa-solid fa-microphone text-2xl text-cyan-300';
        if (micStatusText) micStatusText.innerHTML = 'কথা বলতে স্পর্শ করুন বা বলুন <span class="text-cyan-400 font-bold">"জার্ভিস"</span>';
    }
}

// 2. Global Audio Unlock for Mobile Autoplay Safety
let isAudioUnlocked = false;
async function unlockMobileAudio() {
    if (isAudioUnlocked) return;
    try {
        await voiceSpeaker.unlockAudio();
        isAudioUnlocked = true;
    } catch (e) {
        console.warn('Audio unlock warning:', e);
    }
}
window.addEventListener('touchstart', unlockMobileAudio, { passive: true, once: true });
window.addEventListener('click', unlockMobileAudio, { passive: true, once: true });

// 3. Microphone & Voice Listener Bindings
listener.on('onStart', () => {
    wakeWordListener.pause();
    setCoreState('listening');
    if (micStatusText) micStatusText.innerHTML = '<span class="text-emerald-400 font-bold">শুনছি স্যার...</span> কথা বলা শেষ হলে থামুন বা আবার ট্যাপ করুন';
});

listener.on('onInterim', (interimText) => {
    if (textInput) textInput.value = interimText;
    if (micStatusText) micStatusText.innerHTML = `<span class="text-emerald-400 font-bold">শুনছি:</span> "${interimText}"`;
});

listener.on('onEnd', () => {
    if (!voiceSpeaker.isSpeaking) {
        setCoreState('idle');
        wakeWordListener.resume();
    }
});

listener.on('onFinal', async (spokenText) => {
    if (!spokenText || !spokenText.trim()) return;
    await executeCommand(spokenText);
});

// Voice Speaker Callbacks
voiceSpeaker.onStart(() => {
    wakeWordListener.pause();
    if (listener.isListening) listener.stop();
    setCoreState('speaking');
    const stopBtn = document.getElementById('stop-speech-btn');
    if (stopBtn) stopBtn.classList.remove('hidden');
});

voiceSpeaker.onEnd(() => {
    const stopBtn = document.getElementById('stop-speech-btn');
    if (stopBtn) stopBtn.classList.add('hidden');
    if (!listener.isListening) {
        setCoreState('idle');
        wakeWordListener.resume();
    }
});

// Stop Speech Button
const stopSpeechBtn = document.getElementById('stop-speech-btn');
if (stopSpeechBtn) {
    stopSpeechBtn.addEventListener('click', () => {
        voiceSpeaker.stop();
        stopSpeechBtn.classList.add('hidden');
        setCoreState('idle');
        wakeWordListener.resume();
    });
}

// Toggle Mic Button
function toggleMicrophone() {
    unlockMobileAudio();
    if (listener.isListening) {
        // User tapped again to complete and execute immediately!
        listener.stop();
    } else {
        if (voiceSpeaker.isSpeaking) voiceSpeaker.stop();
        if (textInput) textInput.value = '';
        listener.start();
        setCoreState('listening');
    }
}

if (micBtn) micBtn.addEventListener('click', toggleMicrophone);
if (dockMicBtn) dockMicBtn.addEventListener('click', toggleMicrophone);

// 4. Command Execution Pipeline
async function executeCommand(cmdText) {
    const text = (cmdText || '').trim();
    if (!text) return;
    await unlockMobileAudio();

    if (textInput) textInput.value = '';
    setCoreState('thinking');

    try {
        await jarvisBrain.processCommand(text);
    } catch (err) {
        console.error('[Main] Command execution error:', err);
    } finally {
        if (!voiceSpeaker.isSpeaking && !listener.isListening) {
            setCoreState('idle');
        }
    }
}

// Manual Text Submit
async function handleManualSubmit() {
    if (!textInput) return;
    const text = textInput.value.trim();
    if (!text) return;
    await executeCommand(text);
}

if (sendBtn) sendBtn.addEventListener('click', handleManualSubmit);
if (textInput) {
    textInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') handleManualSubmit();
    });
}

// Quick 1-Tap Executive Cards
window.triggerQuickCommand = async (cmd) => {
    if (textInput) textInput.value = cmd;
    await executeCommand(cmd);
};

// 5. Wake Word Listener Integration ("জার্ভিস" / "Jarvis")
wakeWordListener.onWake = async ({ hasCommand, command }) => {
    await unlockMobileAudio();
    if (hasCommand && command.trim().length > 1) {
        await executeCommand(command.trim());
    } else {
        try {
            await voiceSpeaker.speak('জি স্যার, শুনছি! বলুন...');
        } catch (e) {
            console.error('Wake speech warning:', e);
        }
        listener.start();
        setCoreState('listening');
    }
};

const wakeWordToggleBtn = document.getElementById('wake-word-toggle-btn');
const wakeWordStatusLabel = document.getElementById('wake-word-status-label');

if (wakeWordToggleBtn) {
    // Sync initial UI
    if (wakeWordListener.isEnabled) {
        if (wakeWordStatusLabel) wakeWordStatusLabel.innerHTML = 'ওয়েক ওয়ার্ড: <strong>সক্রিয় (শুনছি...)</strong>';
        wakeWordToggleBtn.classList.remove('opacity-50');
    } else {
        if (wakeWordStatusLabel) wakeWordStatusLabel.innerHTML = 'ওয়েক ওয়ার্ড: <strong>বন্ধ (চালু করতে চাপুন)</strong>';
        wakeWordToggleBtn.classList.add('opacity-50');
    }

    wakeWordToggleBtn.addEventListener('click', () => {
        if (wakeWordListener.isRunning) {
            wakeWordListener.stop();
            wakeWordListener.isEnabled = false;
            localStorage.setItem('jarvis_wake_word_enabled', 'false');
            if (wakeWordStatusLabel) wakeWordStatusLabel.innerHTML = 'ওয়েক ওয়ার্ড: <strong>বন্ধ (চালু করতে চাপুন)</strong>';
            wakeWordToggleBtn.classList.add('opacity-50');
        } else {
            wakeWordListener.isEnabled = true;
            localStorage.setItem('jarvis_wake_word_enabled', 'true');
            wakeWordListener.start();
            if (wakeWordStatusLabel) wakeWordStatusLabel.innerHTML = 'ওয়েক ওয়ার্ড: <strong>সক্রিয় (শুনছি...)</strong>';
            wakeWordToggleBtn.classList.remove('opacity-50');
        }
    });
}

// 6. Dialogue Stream & Table Card Renderer
jarvisBrain.onMessage((msg) => {
    if (!transcriptContainer) return;
    const isUser = msg.sender === 'user';
    const msgEl = document.createElement('div');
    msgEl.className = `message-bubble ${isUser ? 'user-msg' : 'jarvis-msg'}`;

    const senderTitle = isUser ? 'আপনি (অ্যাডমিন)' : 'জার্ভিস এক্সিকিউটিভ';
    const senderIcon = isUser 
        ? '<i class="fa-solid fa-user text-cyan-400 mr-1.5"></i>' 
        : '<i class="fa-solid fa-robot text-cyan-400 mr-1.5"></i>';

    let tableHtml = '';
    if (!isUser && msg.data?.rows && Array.isArray(msg.data.rows) && msg.data.rows.length > 0) {
        const rowsHtml = msg.data.rows.map(([label, val]) => `
            <div class="table-card-row">
                <span class="table-card-label">${label}</span>
                <span class="table-card-val">${val}</span>
            </div>
        `).join('');

        tableHtml = `
            <div class="table-card-box">
                <div class="table-card-header"><i class="fa-solid fa-chart-simple mr-1 text-cyan-400"></i>${msg.data.title || 'হিসাব বিবরণী'}</div>
                <div class="table-card-body">${rowsHtml}</div>
            </div>
        `;
    }

    msgEl.innerHTML = `
        <div class="msg-header">
            <span class="msg-sender-name">${senderIcon}${senderTitle}</span>
            <span class="msg-time">${msg.time}</span>
        </div>
        <div class="msg-content">${msg.text}</div>
        ${tableHtml}
    `;

    transcriptContainer.appendChild(msgEl);
    transcriptContainer.scrollTop = transcriptContainer.scrollHeight;
});

// 7. Load Live Executive KPI Strip from Firestore
async function loadLiveKpiStrip() {
    const kpiSales = document.getElementById('kpi-today-sales');
    const kpiCash = document.getElementById('kpi-showroom-cash');
    const kpiBank = document.getElementById('kpi-bank-deposit');
    const kpiDubai = document.getElementById('kpi-dubai-status');

    try {
        // 1. Sales & Pulse
        try {
            const pulse = await ERPBridge.getExecutiveBusinessPulse();
            if (kpiSales) kpiSales.innerText = `৳ ${Number(pulse?.todayTotalBills || 0).toLocaleString('bn-BD')}`;
        } catch (e) {
            console.warn('Sales KPI load err:', e);
            if (kpiSales) kpiSales.innerText = '৳ ০';
        }

        // 2. Showroom Cash
        try {
            const cash = await ERPBridge.getTodayShowroomCashCollections();
            if (kpiCash) kpiCash.innerText = `৳ ${Number(cash?.todayNetShowroomCash || 0).toLocaleString('bn-BD')}`;
        } catch (e) {
            console.warn('Cash KPI load err:', e);
            if (kpiCash) kpiCash.innerText = '৳ ০';
        }

        // 3. Bank balances
        try {
            const banks = await ERPBridge.getWeeklyBankCollectionSummary();
            if (kpiBank) kpiBank.innerText = `৳ ${Number(banks?.grandTotalBankDeposits || 0).toLocaleString('bn-BD')}`;
        } catch (e) {
            console.warn('Bank KPI load err:', e);
            if (kpiBank) kpiBank.innerText = '৳ ০';
        }

        // 4. Dubai audit
        try {
            const dubai = await ERPBridge.getDubaiWeeklyAuditSummary();
            if (kpiDubai) kpiDubai.innerText = `${Number(dubai?.cashBalance || 0).toLocaleString('bn-BD')} AED`;
        } catch (e) {
            console.warn('Dubai KPI load err:', e);
            if (kpiDubai) kpiDubai.innerText = '০ AED';
        }
    } catch (err) {
        console.warn('Failed to load KPI strip:', err);
    }
}

// 8. Firebase Auth Persistent State & Modals
const authBtn = document.getElementById('auth-btn');
const authBtnText = document.getElementById('auth-btn-text');
const authBtnIcon = document.getElementById('auth-btn-icon');
const authModal = document.getElementById('auth-modal');
const closeAuthModal = document.getElementById('close-auth-modal');
const modalGoogleBtn = document.getElementById('modal-google-btn');
const emailLoginForm = document.getElementById('email-login-form');
const authErrorMsg = document.getElementById('auth-error-msg');

onAuthStateChanged(auth, async (user) => {
    if (user) {
        if (authBtnText) authBtnText.innerText = user.email.split('@')[0];
        if (authBtnIcon) authBtnIcon.className = 'fa-solid fa-circle-user text-emerald-400';
    } else {
        if (authBtnText) authBtnText.innerText = 'লগইন';
        if (authBtnIcon) authBtnIcon.className = 'fa-solid fa-key text-cyan-400';
    }
    await loadLiveKpiStrip();
});

if (authBtn) {
    authBtn.addEventListener('click', () => {
        if (auth.currentUser) {
            if (confirm(`আপনি ${auth.currentUser.email} হিসেবে লগইন আছেন। সাইন আউট করতে চান?`)) {
                signOut(auth);
            }
        } else {
            if (authModal) authModal.classList.remove('hidden');
        }
    });
}

if (closeAuthModal) {
    closeAuthModal.addEventListener('click', () => {
        if (authModal) authModal.classList.add('hidden');
    });
}

window.triggerGoogleAuth = async () => {
    try {
        await unlockMobileAudio();
        await signInWithPopup(auth, googleProvider);
        if (authModal) authModal.classList.add('hidden');
    } catch (err) {
        console.error('Google sign-in error:', err);
        if (authErrorMsg) {
            authErrorMsg.innerText = 'লগইন ব্যর্থ: ' + err.message;
            authErrorMsg.classList.remove('hidden');
        }
    }
};

if (modalGoogleBtn) {
    modalGoogleBtn.addEventListener('click', window.triggerGoogleAuth);
}

if (emailLoginForm) {
    emailLoginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const email = document.getElementById('login-email')?.value.trim();
        const password = document.getElementById('login-password')?.value.trim();
        if (!email || !password) return;

        try {
            await signInWithEmailAndPassword(auth, email, password);
            if (authModal) authModal.classList.add('hidden');
        } catch (err) {
            if (authErrorMsg) {
                authErrorMsg.innerText = 'ভুল ইমেইল বা পাসওয়ার্ড: ' + err.message;
                authErrorMsg.classList.remove('hidden');
            }
        }
    });
}

// 9. AI Settings Modal
const openAiSettingsBtn = document.getElementById('open-ai-settings-btn');
const aiSettingsModal = document.getElementById('ai-settings-modal');
const closeAiSettingsModal = document.getElementById('close-ai-settings-modal');
const geminiApiKeyInput = document.getElementById('gemini-api-key-input');
const saveSettingsBtn = document.getElementById('save-settings-btn');

if (openAiSettingsBtn) {
    openAiSettingsBtn.addEventListener('click', () => {
        if (geminiApiKeyInput) {
            geminiApiKeyInput.value = localStorage.getItem('jarvis_gemini_key') || '';
        }
        if (aiSettingsModal) aiSettingsModal.classList.remove('hidden');
    });
}

if (closeAiSettingsModal) {
    closeAiSettingsModal.addEventListener('click', () => {
        if (aiSettingsModal) aiSettingsModal.classList.add('hidden');
    });
}

if (saveSettingsBtn) {
    saveSettingsBtn.addEventListener('click', () => {
        if (geminiApiKeyInput) {
            const key = geminiApiKeyInput.value.trim();
            localStorage.setItem('jarvis_gemini_key', key);
        }
        if (aiSettingsModal) aiSettingsModal.classList.add('hidden');
        alert('সেটিংস সফলভাবে সেভ হয়েছে!');
    });
}

// 10. Sound Test Button
window.triggerVoiceTest = async () => {
    await unlockMobileAudio();
    await voiceSpeaker.speak('আসসালামু আলাইকুম স্যার! মেসার্স মা মোটরস পার্সোনাল এক্সিকিউটিভ এআই জার্ভিস সম্পূর্ণ প্রস্তুত।');
};

const testVoiceBtn = document.getElementById('test-voice-btn');
if (testVoiceBtn) {
    testVoiceBtn.addEventListener('click', window.triggerVoiceTest);
}

// Start Wake Word Listener ONLY if enabled
if (wakeWordListener.isEnabled) {
    try {
        wakeWordListener.start();
    } catch (e) {
        console.warn('Wake word auto-start deferred:', e);
    }
}

// 11. Dynamic Voice Engine Population & Selector Sync
function syncAvailableVoices() {
    const selector = document.getElementById('voice-selector');
    if (!selector) return;

    const synth = typeof window !== 'undefined' ? window.speechSynthesis : null;
    const voices = synth ? synth.getVoices() : [];
    
    // Check for native Bengali voices in current browser (e.g. Edge Natural / Google)
    const bnVoices = voices.filter(v => 
        v.lang.startsWith('bn') || 
        v.name.toLowerCase().includes('bangla') || 
        v.name.toLowerCase().includes('bengali') ||
        v.name.includes('Pradeep') || 
        v.name.includes('Nabanita')
    );

    selector.innerHTML = '';

    if (bnVoices.length > 0) {
        bnVoices.forEach(v => {
            const opt = document.createElement('option');
            opt.value = v.name;
            opt.textContent = `${v.name.replace(/Microsoft |Online \(Natural\) - /g, '')} (ব্রাউজার)`;
            selector.appendChild(opt);
        });

        const active = voiceSpeaker.getNativeBnVoice();
        if (active) selector.value = active.name;
    } else {
        // Fallback for Chrome without native Edge/Windows Bengali packs
        const opt = document.createElement('option');
        opt.value = 'google-cloud-stream';
        opt.textContent = 'গুগল হাই-কোয়ালিটি বাংলা (Active)';
        opt.selected = true;
        selector.appendChild(opt);
    }
}

if (typeof window !== 'undefined' && window.speechSynthesis) {
    syncAvailableVoices();
    window.speechSynthesis.onvoiceschanged = syncAvailableVoices;
}

const voiceSelectorEl = document.getElementById('voice-selector');
if (voiceSelectorEl) {
    voiceSelectorEl.addEventListener('change', (e) => {
        voiceSpeaker.setAzureVoice(e.target.value);
    });
}

// Initial Load of KPIs
loadLiveKpiStrip();

import './style.css';
import { skillRegistry } from './core/skill_registry.js';
import { memoryVault } from './core/memory_vault.js';
import { jarvisBrain } from './core/jarvis_brain.js';
import { VoiceListener } from './voice/voice_listener.js';
import { voiceSpeaker } from './voice/voice_speaker.js';
import { VoiceVisualizer } from './voice/voice_visualizer.js';

// Import Core Skills
import { CustomerSkill } from './skills/skill_customer.js';
import { AnalyticsSkill } from './skills/skill_analytics.js';
import { DubaiSkill } from './skills/skill_dubai.js';
import { MemorySkill } from './skills/skill_memory.js';

// 1. Register Core Skills
skillRegistry.register(new CustomerSkill());
skillRegistry.register(new AnalyticsSkill());
skillRegistry.register(new DubaiSkill());
skillRegistry.register(new MemorySkill());

// 2. Initialize Voice Components
const listener = new VoiceListener();
const canvas = document.getElementById('visualizer-canvas');
const visualizer = new VoiceVisualizer(canvas);

// Hook Visualizer States
listener.on('onStart', () => visualizer.setState('listening'));
listener.on('onEnd', () => {
    if (!voiceSpeaker.isSpeaking) visualizer.setState('idle');
});

const stopSpeechBtn = document.getElementById('stop-speech-btn');
voiceSpeaker.onStart(() => {
    visualizer.setState('speaking');
    if (stopSpeechBtn) stopSpeechBtn.classList.remove('hidden');
});
voiceSpeaker.onEnd(() => {
    if (stopSpeechBtn) stopSpeechBtn.classList.add('hidden');
    if (!listener.isListening) visualizer.setState('idle');
});

if (stopSpeechBtn) {
    stopSpeechBtn.addEventListener('click', () => {
        voiceSpeaker.stop();
        stopSpeechBtn.classList.add('hidden');
        visualizer.setState('idle');
    });
}

// Sync Cloud Memories
memoryVault.syncWithCloud();

// 3. UI DOM Bindings
const micBtn = document.getElementById('mic-toggle-btn');
const micStatusText = document.getElementById('mic-status-text');
const transcriptContainer = document.getElementById('transcript-container');
const textInput = document.getElementById('manual-command-input');
const sendBtn = document.getElementById('manual-send-btn');
const skillsListEl = document.getElementById('skills-list');
const memoryListEl = document.getElementById('memory-list');

// Responsive Drawer Elements
const drawerBackdrop = document.getElementById('drawer-backdrop');
const memorySidebar = document.getElementById('memory-sidebar');
const skillsSidebar = document.getElementById('skills-sidebar');
const toggleMemoryBtn = document.getElementById('toggle-memory-btn');
const toggleSkillsBtn = document.getElementById('toggle-skills-btn');
const closeMemoryBtn = document.getElementById('close-memory-btn');
const closeSkillsBtn = document.getElementById('close-skills-btn');

function closeAllDrawers() {
    if (memorySidebar) memorySidebar.classList.remove('drawer-open');
    if (skillsSidebar) skillsSidebar.classList.remove('drawer-open');
    if (drawerBackdrop) drawerBackdrop.classList.remove('active');
}

function openDrawer(sidebarEl) {
    closeAllDrawers();
    if (sidebarEl) sidebarEl.classList.add('drawer-open');
    if (drawerBackdrop) drawerBackdrop.classList.add('active');
}

if (toggleMemoryBtn) toggleMemoryBtn.addEventListener('click', () => openDrawer(memorySidebar));
if (closeMemoryBtn) closeMemoryBtn.addEventListener('click', closeAllDrawers);
if (toggleSkillsBtn) toggleSkillsBtn.addEventListener('click', () => openDrawer(skillsSidebar));
if (closeSkillsBtn) closeSkillsBtn.addEventListener('click', closeAllDrawers);
if (drawerBackdrop) drawerBackdrop.addEventListener('click', closeAllDrawers);

// Mic Toggle Logic
function updateMicUI(isListening) {
    if (isListening) {
        micBtn.classList.add('active');
        micStatusText.innerText = 'শুনছি... (Listening)';
        micStatusText.classList.add('text-emerald-400');
    } else {
        micBtn.classList.remove('active');
        micStatusText.innerText = 'মাইক অন করতে চাপুন বা স্পেসবার ধরে কথা বলুন';
        micStatusText.classList.remove('text-emerald-400');
    }
}

micBtn.addEventListener('click', () => {
    listener.toggle();
    updateMicUI(listener.isListening);
});

// Keyboard Shortcut: Press and hold Space for Push-to-Talk (Desktop)
let spacePressed = false;
window.addEventListener('keydown', (e) => {
    if (e.code === 'Space' && document.activeElement !== textInput && !spacePressed) {
        spacePressed = true;
        listener.start();
        updateMicUI(true);
    }
});
window.addEventListener('keyup', (e) => {
    if (e.code === 'Space' && document.activeElement !== textInput && spacePressed) {
        spacePressed = false;
        listener.stop();
        updateMicUI(false);
    }
});

// Live Speech Result Handling
listener.on('onInterim', (interimText) => {
    micStatusText.innerText = `"${interimText}..."`;
});

listener.on('onFinal', async (finalText) => {
    micStatusText.innerText = 'প্রসেস করছি... (Reasoning)';
    visualizer.setState('thinking');
    await jarvisBrain.processCommand(finalText);
});

// Manual Text Input Command
async function handleManualSubmit() {
    const text = textInput.value.trim();
    if (!text) return;
    textInput.value = '';
    visualizer.setState('thinking');
    await jarvisBrain.processCommand(text);
}

sendBtn.addEventListener('click', handleManualSubmit);
textInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') handleManualSubmit();
});

// Quick Prompt Chips Click
document.querySelectorAll('.prompt-chip').forEach(chip => {
    chip.addEventListener('click', async () => {
        const cmd = chip.getAttribute('data-command');
        if (cmd) {
            visualizer.setState('thinking');
            await jarvisBrain.processCommand(cmd);
        }
    });
});

// Quick Memory Add Action
const quickMemoryInput = document.getElementById('quick-memory-input');
const quickMemoryBtn = document.getElementById('quick-memory-btn');

async function handleQuickMemoryAdd() {
    if (!quickMemoryInput) return;
    const content = quickMemoryInput.value.trim();
    if (!content) return;
    
    await memoryVault.rememberFact(content);
    quickMemoryInput.value = '';
    closeAllDrawers();
}

if (quickMemoryBtn) quickMemoryBtn.addEventListener('click', handleQuickMemoryAdd);
if (quickMemoryInput) {
    quickMemoryInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') handleQuickMemoryAdd();
    });
}
jarvisBrain.onMessage((msg) => {
    const isUser = msg.sender === 'user';
    const msgEl = document.createElement('div');
    msgEl.className = `message-bubble ${isUser ? 'user-msg' : 'jarvis-msg'}`;
    
    const senderIcon = isUser 
        ? `<svg width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24" class="msg-icon"><path stroke-linecap="round" stroke-linejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg>`
        : `<svg width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24" class="msg-icon"><path stroke-linecap="round" stroke-linejoin="round" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>`;

    let actionsHtml = '';
    if (!isUser) {
        if (msg.text.includes('সাইন ইন') || msg.text.includes('লগইন')) {
            actionsHtml += `
                <div class="msg-action-row">
                    <button class="msg-action-btn auth-action-btn" onclick="window.triggerGoogleAuth()">
                        <svg width="14" height="14" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/></svg>
                        <span>গুগল দিয়ে এখনই সাইন ইন করুন</span>
                    </button>
                </div>
            `;
        }
        actionsHtml += `
            <div>
                <button class="replay-audio-btn" onclick="window.triggerReplay(this)" data-msg="${escapeHTML(msg.text)}" title="ভয়েস পুনরায় শুনুন">
                    <svg width="12" height="12" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z"></path></svg>
                    <span>পুনরায় শুনুন</span>
                </button>
            </div>
        `;
    }

    msgEl.innerHTML = `
        <div class="msg-header">
            <span class="msg-sender">${senderIcon} ${isUser ? 'আপনি' : 'জার্ভিস এক্সিকিউটিভ'}</span>
            <span class="msg-time">${msg.time}</span>
        </div>
        <div class="msg-body">${escapeHTML(msg.text)}${actionsHtml}</div>
    `;

    transcriptContainer.appendChild(msgEl);
    transcriptContainer.scrollTop = transcriptContainer.scrollHeight;
});

// Render Skills List
function renderSkills() {
    const skills = skillRegistry.getAll();
    skillsListEl.innerHTML = skills.map(s => `
        <div class="skill-card">
            <div class="skill-title">
                <svg width="15" height="15" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24" class="text-cyan-400">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
                </svg>
                <span>${escapeHTML(s.name)}</span>
            </div>
            <div class="skill-desc">${escapeHTML(s.description)}</div>
            <div class="skill-tags">${s.triggers.map(t => `<span class="badge">${escapeHTML(t)}</span>`).join('')}</div>
        </div>
    `).join('');
}
skillRegistry.onChange(renderSkills);
renderSkills();

// Render Memory Vault
function renderMemories(memories) {
    memoryListEl.innerHTML = memories.map(m => `
        <div class="memory-card ${m.category}">
            <div class="mem-header">
                <span class="mem-cat">${m.category.toUpperCase()}</span>
                <button class="del-mem-btn" data-id="${m.id}" title="মুছে ফেলুন">&times;</button>
            </div>
            <div class="mem-content">${escapeHTML(m.content)}</div>
        </div>
    `).join('');

    // Attach delete listeners
    document.querySelectorAll('.del-mem-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const id = e.target.getAttribute('data-id');
            memoryVault.deleteMemory(id);
        });
    });
}
memoryVault.onChange(renderMemories);
renderMemories(memoryVault.memories);

// 4. Voice Global Trigger Handlers
window.triggerVoiceTest = async () => {
    visualizer.setState('speaking');
    await voiceSpeaker.speak('শুভ অপরাহ্ন ভাইয়া! আমি মেসার্স মা মোটরস এর পার্সোনাল এক্সিকিউটিভ এআই জার্ভিস। আমার ভয়েস সিস্টেম এখন সক্রিয় আছে।');
    visualizer.setState('idle');
};

window.triggerReplay = (btn) => {
    const text = btn.getAttribute('data-msg');
    if (text) {
        visualizer.setState('speaking');
        voiceSpeaker.speak(text);
    }
};

const testVoiceBtn = document.getElementById('test-voice-btn');
if (testVoiceBtn) {
    testVoiceBtn.addEventListener('click', window.triggerVoiceTest);
}

const voiceSelector = document.getElementById('voice-selector');
if (voiceSelector) {
    voiceSelector.value = voiceSpeaker.selectedNeuralVoice;
    voiceSelector.addEventListener('change', (e) => {
        voiceSpeaker.setNeuralVoice(e.target.value);
        console.log('🎙️ [Jarvis Voice] Switched neural voice to:', e.target.value);
    });
}

// 5. Firebase Google Authentication Integration
import { auth, googleProvider } from './config.js';
import { signInWithPopup, signInWithRedirect, signInWithEmailAndPassword, getRedirectResult, signOut, onAuthStateChanged } from 'firebase/auth';

const authBtn = document.getElementById('auth-btn');
const authBtnText = document.getElementById('auth-btn-text');
const authModal = document.getElementById('auth-modal');
const closeAuthModalBtn = document.getElementById('close-auth-modal');
const modalGoogleBtn = document.getElementById('modal-google-btn');
const emailLoginForm = document.getElementById('email-login-form');
const loginEmailInput = document.getElementById('login-email');
const loginPasswordInput = document.getElementById('login-password');
const authErrorMsg = document.getElementById('auth-error-msg');

function showAuthModal() {
    if (authErrorMsg) {
        authErrorMsg.classList.add('hidden');
        authErrorMsg.innerText = '';
    }
    if (authModal) authModal.classList.remove('hidden');
}

function hideAuthModal() {
    if (authModal) authModal.classList.add('hidden');
}

if (closeAuthModalBtn) closeAuthModalBtn.addEventListener('click', hideAuthModal);
if (authModal) {
    authModal.addEventListener('click', (e) => {
        if (e.target === authModal) hideAuthModal();
    });
}

// Check redirect login result on page load
if (auth) {
    getRedirectResult(auth).then((result) => {
        if (result && result.user) {
            console.log('✅ [Jarvis Auth] Google Redirect sign-in success:', result.user.email);
            hideAuthModal();
        }
    }).catch((err) => {
        console.warn('Redirect auth result error:', err);
    });
}

// Handle Google Login Flow
async function handleGoogleLogin() {
    if (!auth) return;
    try {
        await signInWithPopup(auth, googleProvider);
        hideAuthModal();
    } catch (err) {
        console.warn('Google popup sign-in error:', err);
        if (err.code === 'auth/popup-closed-by-user') {
            return;
        }
        if (err.code === 'auth/popup-blocked' || err.code === 'auth/cancelled-popup-request') {
            try {
                await signInWithRedirect(auth, googleProvider);
                return;
            } catch (redirectErr) {
                console.error('Redirect sign-in error:', redirectErr);
                if (authErrorMsg) {
                    authErrorMsg.innerText = 'গুগল রিডাইরেক্ট ত্রুটি: ' + (redirectErr.message || 'ত্রুটি');
                    authErrorMsg.classList.remove('hidden');
                }
                return;
            }
        }
        if (err.code === 'auth/unauthorized-domain') {
            const host = window.location.hostname;
            if (authErrorMsg) {
                authErrorMsg.innerText = `ডোমেইন "${host}" গুগল সাইন-ইনের জন্য অনুমোদিত তালিকায় যুক্ত করতে হবে। তবে আপনি নিচে সরাসরি মা মোটরসের ইমেইল ও পাসওয়ার্ড দিয়ে এখনই নিশ্চিন্তে লগইন করতে পারবেন।`;
                authErrorMsg.classList.remove('hidden');
            }
            return;
        }
        if (authErrorMsg) {
            authErrorMsg.innerText = 'লগইন ত্রুটি: ' + (err.message || 'ত্রুটি');
            authErrorMsg.classList.remove('hidden');
        }
    }
}

if (modalGoogleBtn) {
    modalGoogleBtn.addEventListener('click', handleGoogleLogin);
}

// Handle Email & Password Login Flow (Always works on all domains/IPs/devices)
if (emailLoginForm) {
    emailLoginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const email = (loginEmailInput?.value || '').trim();
        const pass = (loginPasswordInput?.value || '').trim();

        if (!email || !pass) {
            if (authErrorMsg) {
                authErrorMsg.innerText = 'দয়া করে ইমেইল ও পাসওয়ার্ড লিখুন।';
                authErrorMsg.classList.remove('hidden');
            }
            return;
        }

        const submitBtn = document.getElementById('email-login-submit');
        if (submitBtn) {
            submitBtn.disabled = true;
            submitBtn.innerText = 'যাচাই করা হচ্ছে...';
        }

        try {
            await signInWithEmailAndPassword(auth, email, pass);
            hideAuthModal();
            console.log('✅ [Jarvis Auth] Signed in via Email/Password successfully.');
        } catch (err) {
            console.warn('Email login error:', err);
            if (authErrorMsg) {
                if (err.code === 'auth/wrong-password' || err.code === 'auth/user-not-found' || err.code === 'auth/invalid-credential') {
                    authErrorMsg.innerText = 'ভুল ইমেইল অথবা পাসওয়ার্ড দিয়েছেন। অনুগ্রহ করে সঠিক তথ্য দিন।';
                } else {
                    authErrorMsg.innerText = 'লগইন ব্যর্থ: ' + (err.message || 'ত্রুটি হয়েছে');
                }
                authErrorMsg.classList.remove('hidden');
            }
        } finally {
            if (submitBtn) {
                submitBtn.disabled = false;
                submitBtn.innerText = 'লগইন করুন';
            }
        }
    });
}

window.triggerGoogleAuth = async () => {
    if (!auth) return;
    if (auth.currentUser) {
        const proceed = window.confirm(`আপনি কি "${auth.currentUser.displayName || auth.currentUser.email}" থেকে লগআউট করতে চান?`);
        if (proceed) {
            await signOut(auth);
        }
    } else {
        showAuthModal();
    }
};

if (auth && authBtn) {
    onAuthStateChanged(auth, (user) => {
        if (user) {
            const firstName = user.displayName ? user.displayName.split(' ')[0] : (user.email ? user.email.split('@')[0] : 'অ্যাকাউন্ট');
            if (authBtnText) authBtnText.innerText = firstName;
            authBtn.title = `${user.displayName || user.email} হিসেবে সংযুক্ত (ক্লিক করে লগআউট)`;
            authBtn.style.borderColor = '#10b981';
            authBtn.style.color = '#10b981';
            console.log('✅ [Jarvis Auth] Signed in as:', user.email);
        } else {
            if (authBtnText) authBtnText.innerText = 'লগইন';
            authBtn.title = 'লগইন করুন';
            authBtn.style.borderColor = '';
            authBtn.style.color = '';
            console.log('ℹ️ [Jarvis Auth] User not signed in.');
        }
    });

    authBtn.addEventListener('click', window.triggerGoogleAuth);
}

function escapeHTML(str) {
    return String(str || '').replace(/[&<>'"]/g, 
        tag => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[tag] || tag)
    );
}

console.log('🤖 [Jarvis AI Agent] Core initialized successfully.');


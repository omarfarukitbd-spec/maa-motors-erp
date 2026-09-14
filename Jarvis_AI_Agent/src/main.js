import './style.css';
import { skillRegistry } from './core/skill_registry.js';
import { memoryVault } from './core/memory_vault.js';
import { jarvisBrain } from './core/jarvis_brain.js';
import { VoiceListener } from './voice/voice_listener.js';
import { voiceSpeaker } from './voice/voice_speaker.js';
import { VoiceVisualizer } from './voice/voice_visualizer.js';
import { wakeWordListener } from './voice/wake_word_listener.js';
import { aiSettingsModal } from './core/ai_settings_modal.js';

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
listener.on('onStart', () => {
    wakeWordListener.pause();
    visualizer.setState('listening');
});
listener.on('onEnd', () => {
    if (!voiceSpeaker.isSpeaking) {
        visualizer.setState('idle');
        wakeWordListener.resume();
    }
});

const stopSpeechBtn = document.getElementById('stop-speech-btn');
voiceSpeaker.onStart(() => {
    wakeWordListener.pause();
    visualizer.setState('speaking');
    if (stopSpeechBtn) stopSpeechBtn.classList.remove('hidden');
    const statusEl = document.getElementById('mic-status-text');
    if (statusEl) statusEl.innerText = 'জার্ভিস কথা বলছে...';
});
voiceSpeaker.onEnd(() => {
    if (stopSpeechBtn) stopSpeechBtn.classList.add('hidden');
    const statusEl = document.getElementById('mic-status-text');
    if (statusEl && !listener.isListening) {
        statusEl.innerText = 'মাইক অন করতে চাপুন বা "জার্ভিস" বলুন';
    }
    if (!listener.isListening) {
        visualizer.setState('idle');
        wakeWordListener.resume();
    }
});

if (stopSpeechBtn) {
    stopSpeechBtn.addEventListener('click', () => {
        voiceSpeaker.stop();
        stopSpeechBtn.classList.add('hidden');
        visualizer.setState('idle');
        const statusEl = document.getElementById('mic-status-text');
        if (statusEl) statusEl.innerText = 'মাইক অন করতে চাপুন বা "জার্ভিস" বলুন';
        wakeWordListener.resume();
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
        micStatusText.innerText = 'মাইক অন করতে চাপুন বা "জার্ভিস" বলুন';
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
    try {
        await jarvisBrain.processCommand(finalText);
    } finally {
        if (!voiceSpeaker.isSpeaking && !listener.isListening) {
            micStatusText.innerText = 'মাইক অন করতে চাপুন বা "জার্ভিস" বলুন';
            visualizer.setState('idle');
        }
        wakeWordListener.resume();
    }
});

// ─────────────────────────────────────────────────────────────
// 🎙️ WAKE WORD HANDLER: "Jarvis" / "জার্ভিস" Hands-Free Detection
// ─────────────────────────────────────────────────────────────
wakeWordListener.onWake = async ({ hasCommand, command, rawTranscript }) => {
    console.log('[Main] ⚡ WAKE WORD TRIGGERED:', { hasCommand, command, rawTranscript });
    await voiceSpeaker.unlockAudio();

    if (hasCommand && command.trim().length > 1) {
        // Path 1: User spoke wake word + command together (e.g. "জার্ভিস করিমের বাকি কত?")
        micStatusText.innerText = `"${command}" প্রসেস করছি...`;
        visualizer.setState('thinking');
        try {
            await jarvisBrain.processCommand(command.trim());
        } catch (err) {
            console.error('[Main] Wake word command execution error:', err);
        } finally {
            if (!voiceSpeaker.isSpeaking && !listener.isListening) {
                micStatusText.innerText = 'মাইক অন করতে চাপুন বা "জার্ভিস" বলুন';
                visualizer.setState('idle');
            }
            wakeWordListener.resume();
        }
    } else {
        // Path 2: User called the name only: "জার্ভিস" or "Hey Jarvis"
        micStatusText.innerText = 'জি ভাইয়া, শুনছি! বলুন...';
        visualizer.setState('listening');

        // Quick natural verbal acknowledgment
        const acks = [
            'জি ভাইয়া, শুনছি!',
            'হ্যাঁ ভাইয়া, বলুন?',
            'জি স্যার, বলুন আমি শুনছি।'
        ];
        const ack = acks[Math.floor(Math.random() * acks.length)];
        await voiceSpeaker.speak(ack);

        // Turn on active listener so user can speak their request hands-free
        listener.start();
        updateMicUI(true);
    }
};

// Wake Word Toggle UI
const wakeWordToggleBtn = document.getElementById('wake-word-toggle-btn');
const wakeWordStatusLabel = document.getElementById('wake-word-status-label');

function updateWakeWordUI(isEnabled) {
    if (!wakeWordToggleBtn) return;
    if (isEnabled) {
        wakeWordToggleBtn.classList.add('active');
        if (wakeWordStatusLabel) {
            wakeWordStatusLabel.innerHTML = 'ওয়েক ওয়ার্ড: <strong>\'জার্ভিস\'</strong> সক্রিয়';
        }
    } else {
        wakeWordToggleBtn.classList.remove('active');
        if (wakeWordStatusLabel) {
            wakeWordStatusLabel.innerHTML = 'ওয়েক ওয়ার্ড: <strong>বন্ধ</strong> (ক্লিক করুন)';
        }
    }
}

if (wakeWordToggleBtn) {
    wakeWordToggleBtn.addEventListener('click', async () => {
        await voiceSpeaker.unlockAudio();
        const enabled = wakeWordListener.toggle();
        updateWakeWordUI(enabled);
        if (enabled) {
            wakeWordListener.playWakeChime();
        }
    });
}

wakeWordListener.onStatusChange = (isEnabled) => {
    updateWakeWordUI(isEnabled);
};

// Start wake word listener on first user interaction gesture if enabled
const startWakeWordOnGesture = () => {
    if (wakeWordListener.isEnabled) {
        wakeWordListener.start();
    }
    window.removeEventListener('click', startWakeWordOnGesture);
    window.removeEventListener('keydown', startWakeWordOnGesture);
    window.removeEventListener('touchstart', startWakeWordOnGesture);
};
window.addEventListener('click', startWakeWordOnGesture, { once: true });
window.addEventListener('keydown', startWakeWordOnGesture, { once: true });
window.addEventListener('touchstart', startWakeWordOnGesture, { once: true });

// Attempt initial start
if (wakeWordListener.isEnabled) {
    setTimeout(() => {
        wakeWordListener.start();
    }, 1000);
}

// Manual Text Input Command
async function handleManualSubmit() {
    const text = textInput.value.trim();
    if (!text) return;
    textInput.value = '';
    await voiceSpeaker.unlockAudio();
    micStatusText.innerText = 'প্রসেস করছি... (Reasoning)';
    visualizer.setState('thinking');
    try {
        await jarvisBrain.processCommand(text);
    } finally {
        if (!voiceSpeaker.isSpeaking && !listener.isListening) {
            micStatusText.innerText = 'মাইক অন করতে চাপুন বা "জার্ভিস" বলুন';
            visualizer.setState('idle');
        }
        wakeWordListener.resume();
    }
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
            await voiceSpeaker.unlockAudio();
            micStatusText.innerText = 'প্রসেস করছি... (Reasoning)';
            visualizer.setState('thinking');
            try {
                await jarvisBrain.processCommand(cmd);
            } finally {
                if (!voiceSpeaker.isSpeaking && !listener.isListening) {
                    micStatusText.innerText = 'মাইক অন করতে চাপুন বা "জার্ভিস" বলুন';
                    visualizer.setState('idle');
                }
                wakeWordListener.resume();
            }
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
        if (msg.data?.authRequired || msg.text.includes('সাইন ইন') || msg.text.includes('লগইন')) {
            actionsHtml += `
                <div class="msg-action-row">
                    <button class="msg-action-btn auth-action-btn" onclick="window.triggerGoogleAuth()">
                        <svg width="14" height="14" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/></svg>
                        <span>গুগল দিয়ে এখনই সাইন ইন করুন</span>
                    </button>
                </div>
            `;
        }
        if (msg.text.includes('সেটিংস')) {
            actionsHtml += `
                <div class="msg-action-row">
                    <button class="msg-action-btn" onclick="window.triggerAISettings()">
                        <svg width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"></path></svg>
                        <span>AI সেটিংস খুলুন</span>
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

    const dataCardHtml = !isUser && msg.data ? renderDataCardHtml(msg.data) : '';

    msgEl.innerHTML = `
        <div class="msg-header">
            <span class="msg-sender">${senderIcon} ${isUser ? 'আপনি' : 'জার্ভিস এক্সিকিউটিভ'}</span>
            <span class="msg-time">${msg.time}</span>
        </div>
        <div class="msg-body">${escapeHTML(msg.text)}${dataCardHtml}${actionsHtml}</div>
    `;

    transcriptContainer.appendChild(msgEl);
    transcriptContainer.scrollTop = transcriptContainer.scrollHeight;
});

/**
 * Render Executive Financial Data Cards (Visual Business Intelligence)
 */
function renderDataCardHtml(data) {
    if (!data || typeof data !== 'object') return '';

    // 1. Today's Bank Collections Card
    if (data.type === 'today_bank_collections') {
        const rows = (data.customerDeposits || []).map(c => `
            <tr>
                <td style="font-weight:700;">${escapeHTML(c.customerName)}</td>
                <td style="color:#38bdf8;">${escapeHTML(c.bankName)}</td>
                <td class="credit" style="font-weight:800;">৳ ${Number(c.amount).toLocaleString('bn-BD')}</td>
                <td style="color:#94a3b8;font-size:10.5px;">${escapeHTML(c.voucherNo || '-')}</td>
            </tr>
        `).join('');

        return `
            <div class="financial-data-card">
                <div class="data-card-header">
                    <span class="data-card-title">
                        <svg width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M3 21h18M3 10h18M5 6l7-3 7 3M4 10v11m4-11v11m4-11v11m4-11v11m4-11v11"/></svg>
                        আজকের ব্যাংকে জমা
                    </span>
                    <span class="data-card-badge">মোট: ৳ ${Number(data.totalBankDeposit || 0).toLocaleString('bn-BD')}</span>
                </div>
                ${rows ? `
                <table class="data-card-table">
                    <thead>
                        <tr>
                            <th>কাস্টমার</th>
                            <th>ব্যাংক</th>
                            <th>জমা</th>
                            <th>ভাউচার</th>
                        </tr>
                    </thead>
                    <tbody>${rows}</tbody>
                </table>
                ` : '<div style="font-size:11.5px;color:#94a3b8;text-align:center;padding:6px;">আজকে ব্যাংকে কোনো জমা নেই</div>'}
            </div>
        `;
    }

    // 1.5 Today's Showroom Cash Collections Card
    if (data.type === 'today_showroom_cash_collections') {
        const rows = (data.customerPayments || []).map(c => `
            <tr>
                <td style="font-weight:700;color:#f8fafc;">${escapeHTML(c.customerName)}</td>
                <td class="credit" style="font-weight:800;">৳ ${Number(c.amount).toLocaleString('bn-BD')}</td>
                <td style="color:#94a3b8;font-size:10.5px;">${escapeHTML(c.voucherNo || '-')}</td>
                <td class="debit" style="text-align:right;font-weight:600;">৳ ${Number(c.currentDue || 0).toLocaleString('bn-BD')}</td>
            </tr>
        `).join('');

        return `
            <div class="financial-data-card">
                <div class="data-card-header">
                    <span class="data-card-title">
                        <svg width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z"/></svg>
                        আজকের শোরুম ক্যাশ কালেকশন
                    </span>
                    <span class="data-card-badge" style="background:rgba(16,185,129,0.15);border-color:rgba(16,185,129,0.3);color:#34d399;">নগদ জমা: ৳ ${Number(data.totalCashCollected || 0).toLocaleString('bn-BD')}</span>
                </div>
                <div class="data-card-grid" style="margin-bottom:8px;">
                    <div class="data-stat-box"><div class="data-stat-label">মোট নগদ জমা</div><div class="data-stat-value credit">৳ ${Number(data.totalCashCollected || 0).toLocaleString('bn-BD')}</div></div>
                    <div class="data-stat-box"><div class="data-stat-label">ক্যাশ খরচ</div><div class="data-stat-value debit">৳ ${Number(data.todayCashExpenses || 0).toLocaleString('bn-BD')}</div></div>
                    <div class="data-stat-box"><div class="data-stat-label">নিট ক্যাশ স্থিতি</div><div class="data-stat-value" style="color:#38bdf8;font-weight:800;">৳ ${Number(data.todayNetShowroomCash || 0).toLocaleString('bn-BD')}</div></div>
                    <div class="data-stat-box"><div class="data-stat-label">জমা প্রদানকারী</div><div class="data-stat-value" style="color:#e2e8f0;font-weight:800;">${Number(data.customerPaymentsCount || 0).toLocaleString('bn-BD')} জন</div></div>
                </div>
                ${rows ? `
                <table class="data-card-table">
                    <thead>
                        <tr>
                            <th>কাস্টমার</th>
                            <th>নগদ জমা</th>
                            <th>ভাউচার</th>
                            <th style="text-align:right;">অবশিষ্ট বকেয়া</th>
                        </tr>
                    </thead>
                    <tbody>${rows}</tbody>
                </table>
                ` : '<div style="font-size:11.5px;color:#94a3b8;text-align:center;padding:8px;">আজকে শোরুম ক্যাশে কোনো নগদ জমা নেই</div>'}
            </div>
        `;
    }

    // 2. Weekly Bank Summary Card
    if (data.type === 'weekly_bank_summary') {
        const rows = (data.bankList || []).map(b => `
            <tr>
                <td style="font-weight:700;color:#38bdf8;">${escapeHTML(b.bankName)}</td>
                <td class="credit" style="font-weight:800;">৳ ${Number(b.totalAmount).toLocaleString('bn-BD')}</td>
                <td style="color:#cbd5e1;text-align:right;">${Number(b.transactionCount).toLocaleString('bn-BD')} টি</td>
            </tr>
        `).join('');

        return `
            <div class="financial-data-card">
                <div class="data-card-header">
                    <span class="data-card-title">
                        <svg width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>
                        গত এক সপ্তাহের ব্যাংক স্থিতি
                    </span>
                    <span class="data-card-badge">সর্বমোট: ৳ ${Number(data.grandTotalBankDeposits || 0).toLocaleString('bn-BD')}</span>
                </div>
                <table class="data-card-table">
                    <thead>
                        <tr>
                            <th>ব্যাংক অ্যাকাউন্ট</th>
                            <th>মোট জমা</th>
                            <th style="text-align:right;">লেনদেন</th>
                        </tr>
                    </thead>
                    <tbody>${rows}</tbody>
                </table>
            </div>
        `;
    }

    // 3. Customer Due & Profile Card
    if (data.name && data.totalDue !== undefined) {
        return `
            <div class="financial-data-card">
                <div class="data-card-header">
                    <span class="data-card-title">
                        <svg width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/></svg>
                        ${escapeHTML(data.name)}
                    </span>
                    <span class="data-card-badge" style="background:rgba(239,68,68,0.15);border-color:rgba(239,68,68,0.3);color:#f87171;">বকেয়া: ৳ ${Number(data.totalDue || 0).toLocaleString('bn-BD')}</span>
                </div>
                <div class="data-card-grid">
                    ${data.phone ? `<div class="data-stat-box"><div class="data-stat-label">মোবাইল</div><div class="data-stat-value" style="font-size:11.5px;">${escapeHTML(data.phone)}</div></div>` : ''}
                    ${data.address ? `<div class="data-stat-box"><div class="data-stat-label">ঠিকানা / এলাকা</div><div class="data-stat-value" style="font-size:11.5px;">${escapeHTML(data.address)}</div></div>` : ''}
                </div>
            </div>
        `;
    }

    // 4. Executive Business Pulse Card
    if (data.todayNetCashFlow !== undefined) {
        return `
            <div class="financial-data-card">
                <div class="data-card-header">
                    <span class="data-card-title">
                        <svg width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"/></svg>
                        আজকের ব্যবসার সারসংক্ষেপ
                    </span>
                    <span class="data-card-badge">নিট ক্যাশ ফ্লো: ৳ ${Number(data.todayNetCashFlow).toLocaleString('bn-BD')}</span>
                </div>
                <div class="data-card-grid">
                    <div class="data-stat-box"><div class="data-stat-label">মোট বিক্রি (চালান)</div><div class="data-stat-value debit">৳ ${Number(data.todayTotalBills || 0).toLocaleString('bn-BD')}</div></div>
                    <div class="data-stat-box"><div class="data-stat-label">মোট কালেকশন</div><div class="data-stat-value credit">৳ ${Number(data.todayTotalCollections || 0).toLocaleString('bn-BD')}</div></div>
                    <div class="data-stat-box"><div class="data-stat-label">মোট খরচ</div><div class="data-stat-value debit">৳ ${Number(data.todayTotalExpenses || 0).toLocaleString('bn-BD')}</div></div>
                    <div class="data-stat-box"><div class="data-stat-label">নিট ক্যাশ স্থিতি</div><div class="data-stat-value credit">৳ ${Number(data.todayNetCashFlow || 0).toLocaleString('bn-BD')}</div></div>
                </div>
            </div>
        `;
    }

    // 5. Smart Disambiguation Options Card (Multi-Match Clarifier)
    if (data.type === 'disambiguation_options') {
        const chips = (data.options || []).map(opt => `
            <button type="button" class="disambig-option-btn" onclick="window.triggerDisambiguationSelect('${escapeHTML(String(opt.index))}')">
                <span class="disambig-index">${Number(opt.index).toLocaleString('bn-BD')}</span>
                <div class="disambig-info">
                    <div class="disambig-name">${escapeHTML(opt.name)}</div>
                    <div class="disambig-sub">${escapeHTML(opt.address || opt.zone || 'সাধারণ')}</div>
                </div>
                <span class="disambig-badge ${opt.totalDue > 0 ? 'debit' : 'credit'}">
                    ${opt.totalDue > 0 ? '৳ ' + Number(opt.totalDue).toLocaleString('bn-BD') : (opt.totalDue < 0 ? 'অগ্রিম ৳ ' + Number(Math.abs(opt.totalDue)).toLocaleString('bn-BD') : 'পরিশোধিত')}
                </span>
            </button>
        `).join('');

        return `
            <div class="financial-data-card disambig-card">
                <div class="data-card-header">
                    <span class="data-card-title">
                        <svg width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                        কাছাকাছি একাধিক কাস্টমার পাওয়া গেছে (${(data.options?.length || 0).toLocaleString('bn-BD')} জন)
                    </span>
                </div>
                <div class="disambig-options-list">
                    ${chips}
                </div>
                <div class="disambig-footer-hint">মুখে "১", "২" বা এলাকার নাম বলুন, অথবা বাটনে ট্যাপ করুন।</div>
            </div>
        `;
    }

    // 6. Live Bank Running Balances Card
    if (data.type === 'bank_running_balances') {
        const rows = (data.banks || []).map(b => `
            <tr>
                <td style="font-weight:700;color:#38bdf8;">${escapeHTML(b.bankName)}</td>
                <td style="color:#94a3b8;font-size:10.5px;">${escapeHTML(b.accountNo || '-')}</td>
                <td class="credit" style="font-weight:800;text-align:right;">৳ ${Number(b.currentBalance).toLocaleString('bn-BD')}</td>
            </tr>
        `).join('');

        return `
            <div class="financial-data-card">
                <div class="data-card-header">
                    <span class="data-card-title">
                        <svg width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M3 21h18M3 10h18M5 6l7-3 7 3M4 10v11m4-11v11m4-11v11m4-11v11m4-11v11"/></svg>
                        ব্যাংক ও ক্যাশ লাইভ ব্যালেন্স
                    </span>
                    <span class="data-card-badge">মোট তারল্য: ৳ ${Number(data.grandTotalLiquidFunds || 0).toLocaleString('bn-BD')}</span>
                </div>
                <table class="data-card-table">
                    <thead>
                        <tr>
                            <th>ব্যাংক</th>
                            <th>হিসাব নং</th>
                            <th style="text-align:right;">বর্তমান ব্যালেন্স</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${rows}
                        <tr style="border-top:1px solid rgba(255,255,255,0.1);font-weight:700;">
                            <td style="color:#fbbf24;">শোরুম ক্যাশ ইন হ্যান্ড</td>
                            <td style="color:#94a3b8;font-size:10.5px;">নগদ ক্যাশ</td>
                            <td class="credit" style="text-align:right;">৳ ${Number(data.showroomCashInHand || 0).toLocaleString('bn-BD')}</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        `;
    }

    // 7. Zone-wise Analytics Card
    if (data.type === 'zone_wise_analytics') {
        const rows = (data.zones || []).slice(0, 6).map(z => `
            <tr>
                <td style="font-weight:700;color:#38bdf8;">${escapeHTML(z.zoneName)}</td>
                <td style="color:#cbd5e1;">${Number(z.customerCount).toLocaleString('bn-BD')} জন</td>
                <td class="debit" style="font-weight:800;text-align:right;">৳ ${Number(z.totalDue).toLocaleString('bn-BD')}</td>
            </tr>
        `).join('');

        return `
            <div class="financial-data-card">
                <div class="data-card-header">
                    <span class="data-card-title">
                        <svg width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/><path stroke-linecap="round" stroke-linejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
                        জোনভিত্তিক অবশিষ্ট বকেয়া রিপোর্ট
                    </span>
                    <span class="data-card-badge" style="background:rgba(239,68,68,0.15);border-color:rgba(239,68,68,0.3);color:#f87171;">মোট: ৳ ${Number(data.grandTotalDue || 0).toLocaleString('bn-BD')}</span>
                </div>
                <table class="data-card-table">
                    <thead>
                        <tr>
                            <th>জোন / এলাকা</th>
                            <th>কাস্টমার</th>
                            <th style="text-align:right;">মোট বকেয়া</th>
                        </tr>
                    </thead>
                    <tbody>${rows}</tbody>
                </table>
            </div>
        `;
    }

    // 8. Dormant Customers Card (বকেয়া টাকা দেয়নি এমন কাস্টমার তালিকা)
    if (data.type === 'dormant_customers') {
        const rows = (data.topDormant || []).map(d => `
            <tr>
                <td style="font-weight:700;">
                    <div style="color:#f8fafc;">${escapeHTML(d.name)}</div>
                    <div style="font-size:10.5px;color:#94a3b8;">${escapeHTML(d.address || d.zone || 'সাধারণ')}</div>
                </td>
                <td class="debit" style="font-weight:800;text-align:right;">৳ ${Number(d.totalDue).toLocaleString('bn-BD')}</td>
                <td style="color:#94a3b8;font-size:10.5px;text-align:right;">${escapeHTML(d.lastPaymentDate || 'কখনও দেননি')}</td>
            </tr>
        `).join('');

        return `
            <div class="financial-data-card">
                <div class="data-card-header">
                    <span class="data-card-title">
                        <svg width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                        বকেয়া টাকা দেয়নি এমন কাস্টমার তালিকা (বিগত ${Number(data.thresholdDays).toLocaleString('bn-BD')} দিন)
                    </span>
                    <span class="data-card-badge" style="background:rgba(239,68,68,0.15);border-color:rgba(239,68,68,0.3);color:#f87171;">মোট: ${Number(data.dormantCount).toLocaleString('bn-BD')} জন</span>
                </div>
                <div class="data-card-grid" style="margin-bottom:8px;">
                    <div class="data-stat-box"><div class="data-stat-label">মোট বাকিদার</div><div class="data-stat-value debit">${Number(data.dormantCount || 0).toLocaleString('bn-BD')} জন</div></div>
                    <div class="data-stat-box"><div class="data-stat-label">মোট অনাদায়ী বকেয়া</div><div class="data-stat-value debit">৳ ${Number(data.totalDormantDue || 0).toLocaleString('bn-BD')}</div></div>
                </div>
                ${rows ? `
                <table class="data-card-table">
                    <thead>
                        <tr>
                            <th>কাস্টমার ও এলাকা</th>
                            <th style="text-align:right;">অবশিষ্ট বকেয়া</th>
                            <th style="text-align:right;">শেষ পেমেন্ট</th>
                        </tr>
                    </thead>
                    <tbody>${rows}</tbody>
                </table>
                ` : '<div style="font-size:11.5px;color:#94a3b8;text-align:center;padding:8px;">এই সময়ে বকেয়া অপরিশোধিত কোনো কাস্টমার নেই</div>'}
            </div>
        `;
    }

    // 9. Category Expense Breakdown Card
    if (data.type === 'category_expense_breakdown') {
        const rows = (data.categories || []).map(c => `
            <tr>
                <td style="font-weight:700;color:#f87171;">${escapeHTML(c.category)}</td>
                <td style="color:#cbd5e1;">${Number(c.count).toLocaleString('bn-BD')}টি ভাউচার</td>
                <td class="debit" style="font-weight:800;text-align:right;">৳ ${Number(c.totalAmount).toLocaleString('bn-BD')} (${Number(c.percentage).toLocaleString('bn-BD')}%)</td>
            </tr>
        `).join('');

        return `
            <div class="financial-data-card">
                <div class="data-card-header">
                    <span class="data-card-title">
                        <svg width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z"/></svg>
                        খাতওয়ারী খরচের বিশ্লেষণ (বিগত ${Number(data.days).toLocaleString('bn-BD')} দিন)
                    </span>
                    <span class="data-card-badge" style="background:rgba(239,68,68,0.15);border-color:rgba(239,68,68,0.3);color:#f87171;">মোট: ৳ ${Number(data.totalExpenseSum || 0).toLocaleString('bn-BD')}</span>
                </div>
                <table class="data-card-table">
                    <thead>
                        <tr>
                            <th>খরচের খাত</th>
                            <th>ভাউচার</th>
                            <th style="text-align:right;">টাকার অংক</th>
                        </tr>
                    </thead>
                    <tbody>${rows}</tbody>
                </table>
            </div>
        `;
    }

    // 10. Ledger Math Integrity Audit Card
    if (data.type === 'ledger_audit_summary') {
        return `
            <div class="financial-data-card">
                <div class="data-card-header">
                    <span class="data-card-title">
                        <svg width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/></svg>
                        লেজার অ্যাকাউন্টিং অডিট
                    </span>
                    <span class="data-card-badge" style="background:${data.isFullySound ? 'rgba(16,185,129,0.15)' : 'rgba(239,68,68,0.15)'};color:${data.isFullySound ? '#34d399' : '#f87171'};">
                        ${data.isFullySound ? 'নিখুঁত ও নিরাপদ' : 'গরমিল শনাক্ত'}
                    </span>
                </div>
                <div class="data-card-grid">
                    <div class="data-stat-box"><div class="data-stat-label">যাচাইকৃত লেনদেন</div><div class="data-stat-value">${Number(data.auditedTxnCount || 0).toLocaleString('bn-BD')} টি</div></div>
                    <div class="data-stat-box"><div class="data-stat-label">গাণিতিক গরমিল</div><div class="data-stat-value ${data.corruptTxnCount > 0 ? 'debit' : 'credit'}">${Number(data.corruptTxnCount || 0).toLocaleString('bn-BD')} টি</div></div>
                </div>
                <div style="font-size:11.5px;color:#cbd5e1;padding:4px 2px;">${escapeHTML(data.statusMessage)}</div>
            </div>
        `;
    }

    // 11. Dubai Deep Audit Card (Strict AED)
    if (data.type === 'dubai_deep_audit') {
        const rows = (data.personalHoldings || []).map(h => `
            <tr>
                <td style="font-weight:700;color:#38bdf8;">${escapeHTML(h.name)}</td>
                <td style="color:#cbd5e1;">ব্যক্তিগত হেফাজত</td>
                <td class="credit" style="font-weight:800;text-align:right;">${Number(h.amount).toLocaleString('en-US')} AED</td>
            </tr>
        `).join('');

        return `
            <div class="financial-data-card">
                <div class="data-card-header">
                    <span class="data-card-title">
                        <svg width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"/></svg>
                        দুবাই কন্টেইনার হেফাজত ও এসেট (${data.auditDate})
                    </span>
                    <span class="data-card-badge">মোট এসেট: ${Number(data.totalPhysicalAssets || 0).toLocaleString('en-US')} AED</span>
                </div>
                <table class="data-card-table">
                    <thead>
                        <tr>
                            <th>হেফাজতকারী</th>
                            <th>বিবরণ</th>
                            <th style="text-align:right;">দিরহাম (AED)</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${rows}
                        <tr>
                            <td style="font-weight:700;color:#fbbf24;">নগদ ক্যাশ (Cash in Hand)</td>
                            <td style="color:#cbd5e1;">অফিস ক্যাশ</td>
                            <td class="credit" style="font-weight:800;text-align:right;">${Number(data.cashInHand || 0).toLocaleString('en-US')} AED</td>
                        </tr>
                        <tr>
                            <td style="font-weight:700;color:#a855f7;">মেস ফান্ড (Mess Balance)</td>
                            <td style="color:#cbd5e1;">দুবাই মেস</td>
                            <td class="credit" style="font-weight:800;text-align:right;">${Number(data.messBalance || 0).toLocaleString('en-US')} AED</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        `;
    }

    return '';
}

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
window.triggerAISettings = () => {
    aiSettingsModal.open();
};

window.triggerVoiceTest = async () => {
    await voiceSpeaker.unlockAudio();
    // Immediate acoustic chime so the user instantly knows audio is functioning
    try {
        if (wakeWordListener && typeof wakeWordListener.playWakeChime === 'function') {
            await wakeWordListener.playWakeChime();
        }
    } catch (e) {
        console.warn('Chime trigger error:', e);
    }

    visualizer.setState('speaking');
    const statusEl = document.getElementById('mic-status-text');
    if (statusEl) statusEl.innerText = '🔊 জার্ভিসের সাউন্ড টেস্ট চলছে...';
    try {
        await voiceSpeaker.speak('আসসালামু আলাইকুম ভাইয়া! আমি জার্ভিস। আপনার মা মোটরসের যাবতীয় হিসাব দেখতে আমি সম্পূর্ণ প্রস্তুত আছি।');
    } catch (err) {
        console.error('[VoiceTest] Playback error:', err);
    } finally {
        if (!listener.isListening) {
            visualizer.setState('idle');
            if (statusEl) statusEl.innerText = 'মাইক অন করতে চাপুন বা স্পেসবার ধরে কথা বলুন';
        }
    }
};

window.wakeWordListener = wakeWordListener;
window.voiceSpeaker = voiceSpeaker;

window.triggerDisambiguationSelect = async (val) => {
    const textInput = document.getElementById('manual-command-input');
    if (textInput) {
        textInput.value = val;
    }
    await handleManualSubmit();
};

window.triggerReplay = async (btn) => {
    const text = btn.getAttribute('data-msg');
    if (text) {
        await voiceSpeaker.unlockAudio();
        visualizer.setState('speaking');
        const statusEl = document.getElementById('mic-status-text');
        if (statusEl) statusEl.innerText = 'জার্ভিস কথা বলছে...';
        try {
            await voiceSpeaker.speak(text);
        } finally {
            if (!listener.isListening) {
                visualizer.setState('idle');
                if (statusEl) statusEl.innerText = 'মাইক অন করতে চাপুন বা স্পেসবার ধরে কথা বলুন';
            }
        }
    }
};

const testVoiceBtn = document.getElementById('test-voice-btn');
if (testVoiceBtn) {
    testVoiceBtn.addEventListener('click', window.triggerVoiceTest);
}

const voiceSelector = document.getElementById('voice-selector');
if (voiceSelector) {
    const hasOpenAIKey = Boolean((localStorage.getItem('jarvis_openai_key') || '').trim());
    const savedAzureVoice = localStorage.getItem('jarvis_azure_voice') || 'bn-BD-PradeepNeural';
    const savedOpenAIVoice = localStorage.getItem('jarvis_openai_voice') || 'onyx';

    // If no OpenAI key, default to authentic Bangladeshi Azure neural voice
    if (!hasOpenAIKey) {
        voiceSelector.value = savedAzureVoice;
        voiceSpeaker.setAzureVoice(savedAzureVoice);
        voiceSpeaker.setEngine('azure-neural');
    } else {
        voiceSelector.value = savedOpenAIVoice;
        voiceSpeaker.setOpenAIVoice(savedOpenAIVoice);
        voiceSpeaker.setEngine('openai');
    }

    voiceSelector.addEventListener('change', (e) => {
        const val = e.target.value;
        if (val.startsWith('bn-BD-')) {
            voiceSpeaker.setAzureVoice(val);
            voiceSpeaker.setEngine('azure-neural');
        } else {
            voiceSpeaker.setOpenAIVoice(val);
            voiceSpeaker.setEngine('openai');
        }
        console.log('🎙️ [Jarvis Voice] Switched active voice to:', val);
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
    (async () => {
        try {
            const result = await getRedirectResult(auth);
            if (result && result.user) {
                console.log('✅ [Jarvis Auth] Google Redirect sign-in success:', result.user.email);
                hideAuthModal();
            }
        } catch (err) {
            console.warn('Redirect auth result error:', err);
        }
    })();
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

// Auto open AI settings if requested via URL
if (typeof window !== 'undefined' && window.location.search.includes('show_settings=true')) {
    setTimeout(() => {
        aiSettingsModal.open();
    }, 400);
}

console.log('🤖 [Jarvis AI Agent] Core initialized successfully.');


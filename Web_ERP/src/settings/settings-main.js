import Swal from 'sweetalert2';
import { firebase } from '../firebase-config.js';
import { SettingsDAO } from '../dao.js';
import { promptSecurityPin } from '../utils.js';
import { auditLog } from '../audit.js';
import { checkSmsLength } from './sms-config.js';
import { getCurrentLogo, setCurrentLogo } from './shop-profile.js';
import { renderSecurityPolicySection, bindSecurityPolicyEvents, populateSecurityPolicyValues, collectSecurityPolicyValues } from './security-policy-ui.js';
import { renderZoneManagementSection, loadZoneList } from './zone-management.js';
import { verifyMasterHardPassword } from './security-policy.js';

/**
 * Main Settings UI Renderer
 */
export function renderSettings(container) {
    if(window.AppState.currentUserRole !== 'Admin') {
        container.innerHTML = `<div class="m3-card text-center font-bn py-12"><h2 class="text-xl font-black text-red-500">অ্যাক্সেস ডিনাইড!</h2></div>`;
        return;
    }

    container.innerHTML = `
        <div class="flex flex-col gap-6 pb-28 font-bn max-w-7xl mx-auto">
            <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 px-2 py-3 border-b border-slate-800/80">
                <div>
                    <h2 class="text-2xl font-black flex items-center gap-3 text-white tracking-tight">
                        <div class="w-2.5 h-8 bg-gradient-to-b from-blue-500 to-indigo-600 rounded-full shadow-[0_0_18px_rgba(59,130,246,0.6)]"></div>
                        সফটওয়্যার সেটিংস
                    </h2>
                    <p class="text-xs font-bold text-slate-300 mt-1 ml-5">দোকানের প্রোফাইল, প্রিন্টিং ফরম্যাট, SMS এবং ১৫-পয়েন্ট সিকিউরিটি পলিসি ম্যানেজ করুন</p>
                </div>
            </div>

            <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <!-- Shop Settings -->
                <div class="m3-card space-y-5">
                    <div class="flex justify-between items-center border-b border-slate-800 pb-3">
                        <h3 class="font-black text-white text-base">দোকানের সাধারণ তথ্য</h3>
                        <button class="px-3.5 py-1.5 rounded-xl bg-blue-500/10 border border-blue-500/30 text-blue-400 text-xs font-bold" onclick="window.unlockShopSettings()">আনলক করুন</button>
                    </div>
                    <div class="space-y-4">
                        <input type="text" id="set-shop-name" disabled class="m3-field opacity-80" placeholder="দোকানের নাম">
                        <input type="text" id="set-shop-owner" disabled class="m3-field opacity-80" placeholder="প্রোপাইটার নাম (যেমন: Mohammed Amran)">
                        <input type="text" id="set-shop-phone" disabled class="m3-field opacity-80" placeholder="মোবাইল নম্বর">
                        <textarea id="set-shop-address" rows="2" disabled class="m3-field opacity-80 resize-none" placeholder="ঠিকানা"></textarea>
                        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <input type="file" id="set-shop-logo" disabled class="m3-field opacity-80 text-xs" onchange="window.handleLogoSelect(event)">
                            <div class="flex items-center justify-center"><img id="logo-preview" src="" class="h-16 hidden rounded-xl" alt="Preview"></div>
                        </div>
                        <select id="set-print-size" disabled class="m3-field opacity-80"><option value="a4">A4 (রেগুলার ফুল পেপার)</option><option value="pos">POS (৮০ মিমি থার্মাল রসিদ)</option></select>
                    </div>
                </div>

                <!-- SMS Gateway Settings -->
                <div class="m3-card space-y-4">
                    <div class="flex justify-between items-center border-b border-slate-800 pb-3">
                        <h3 class="font-black text-white text-base">SMS গেইটওয়ে সেটিংস (BulkSMSBD)</h3>
                        <button class="px-3.5 py-1.5 rounded-xl bg-blue-500/10 border border-blue-500/30 text-blue-400 text-xs font-bold" onclick="window.unlockSmsSettings()">আনলক করুন</button>
                    </div>
                    <div class="space-y-3">
                        <div>
                            <div class="flex justify-between text-xs font-bold mb-1"><span class="text-slate-300">একাউন্ট খোলা SMS টেমপ্লেট</span><span id="sms-open-count" class="text-emerald-400">0/155</span></div>
                            <textarea id="set-sms-opening" rows="2" disabled class="m3-field opacity-80 text-xs font-mono" oninput="window.checkSmsLength(this, 'sms-open-count')"></textarea>
                        </div>
                        <div>
                            <div class="flex justify-between text-xs font-bold mb-1"><span class="text-slate-300">নতুন ইনভয়েস/বিল SMS টেমপ্লেট</span><span id="sms-new-count" class="text-emerald-400">0/155</span></div>
                            <textarea id="set-sms-new-bill" rows="2" disabled class="m3-field opacity-80 text-xs font-mono" oninput="window.checkSmsLength(this, 'sms-new-count')"></textarea>
                        </div>
                        <div>
                            <div class="flex justify-between text-xs font-bold mb-1"><span class="text-slate-300">জমা প্রাপ্তি SMS টেমপ্লেট</span><span id="sms-pay-count" class="text-emerald-400">0/155</span></div>
                            <textarea id="set-sms-payment" rows="2" disabled class="m3-field opacity-80 text-xs font-mono" oninput="window.checkSmsLength(this, 'sms-pay-count')"></textarea>
                        </div>
                        <div>
                            <div class="flex justify-between text-xs font-bold mb-1"><span class="text-slate-300">লেস/ছাড় (Discount) SMS টেমপ্লেট</span><span id="sms-less-count" class="text-emerald-400">0/155</span></div>
                            <textarea id="set-sms-less" rows="2" disabled class="m3-field opacity-80 text-xs font-mono" oninput="window.checkSmsLength(this, 'sms-less-count')"></textarea>
                        </div>
                        <div>
                            <div class="flex justify-between text-xs font-bold mb-1"><span class="text-slate-300">বকেয়া তাগাদা SMS টেমপ্লেট</span><span id="sms-rem-count" class="text-emerald-400">0/155</span></div>
                            <textarea id="set-sms-reminder" rows="2" disabled class="m3-field opacity-80 text-xs font-mono" oninput="window.checkSmsLength(this, 'sms-rem-count')"></textarea>
                        </div>
                        <div class="grid grid-cols-2 gap-3 pt-2">
                            <input type="password" id="set-sms-api" disabled class="m3-field opacity-80" placeholder="API Key">
                            <input type="text" id="set-sms-sender" disabled class="m3-field opacity-80" placeholder="Sender ID">
                        </div>
                        <label class="flex items-center gap-3 cursor-pointer"><input type="checkbox" id="set-sms-auto" disabled class="w-5 h-5"> <span class="text-xs font-bold text-slate-300">অটোমেটিক SMS পাঠান</span></label>
                    </div>
                </div>

                <!-- Telegram Alert Settings -->
                <div class="m3-card space-y-4">
                    <div class="flex justify-between items-center border-b border-slate-800 pb-3">
                        <h3 class="font-black text-white text-base">Telegram ফ্রি অ্যালার্ট সেটিংস</h3>
                    </div>
                    <div class="space-y-3">
                        <input type="text" id="set-telegram-bot-token" class="m3-field opacity-80" placeholder="Bot Token (e.g. 123456:ABC-DEF1234ghIkl-zyx57W2v1u123ew11)">
                        <input type="text" id="set-telegram-chat-id" class="m3-field opacity-80" placeholder="Chat ID (e.g. 987654321)">
                        <p class="text-[10px] text-slate-400 mt-1">লগইন, ডিলিট এবং সিকিউরিটি অ্যালার্ট ফ্রিতে টেলিগ্রামে পেতে <a href="https://t.me/BotFather" target="_blank" class="text-blue-400 underline">BotFather</a> থেকে বট বানিয়ে টোকেন এবং আপনার চ্যাট আইডি দিন।</p>
                    </div>
                </div>

                <!-- 15-Point Granular Security Policy Control Center -->
                ${renderSecurityPolicySection()}

                <!-- Zone & Regional Setup Management -->
                ${renderZoneManagementSection()}

                <!-- Admin Security PIN -->
                <div class="m3-card lg:col-span-2 space-y-4 border border-red-500/30">
                    <div class="flex justify-between items-center border-b border-slate-800 pb-4">
                        <h3 class="font-black text-white text-base">এডমিন সিকিউরিটি পিন (Master PIN)</h3>
                        <button class="px-4 py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-black" onclick="window.changeAdminSecurityPinFlow()"><i class="fa-solid fa-key mr-1.5"></i>পিন পরিবর্তন করুন</button>
                    </div>
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div class="relative">
                            <input type="password" id="set-admin-pin" disabled class="m3-field text-xl tracking-[0.3em] text-red-400 bg-slate-950" value="1060">
                            <button type="button" class="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white cursor-pointer p-1" onclick="window.togglePinVisibility()"><i class="fa-solid fa-eye" id="pin-vis-icon"></i></button>
                        </div>
                        <p class="text-xs text-slate-300 bg-slate-900/80 p-3 rounded-2xl border border-slate-800">আপনার মাস্টার পিনটি কারো সাথে শেয়ার করবেন না। এটি দেখতে মাস্টার পাসওয়ার্ড ভেরিফিকেশন লাগবে।</p>
                    </div>
                </div>

                <!-- Database Backup -->
                <div class="m3-card lg:col-span-2 flex justify-between items-center">
                    <div>
                        <h3 class="font-black text-white text-base mb-1">ডাটাবেস ব্যাকআপ</h3>
                        <p class="text-xs font-bold text-slate-300">সব ডাটা এক ক্লিকে অফলাইন ব্যাকআপ নিন</p>
                    </div>
                    <button class="px-6 py-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-black text-xs" onclick="window.appSettings.exportData()">অফলাইন ব্যাকআপ নিন</button>
                </div>
            </div>

            <!-- Bottom Save Bar -->
            <div class="bg-slate-900/90 border border-blue-500/30 rounded-2xl p-4 sticky bottom-4 z-30 shadow-2xl flex justify-center mt-6">
                <button class="px-12 py-3.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-black text-sm w-full sm:w-[350px]" onclick="window.saveSettings()" id="save-settings-btn">
                    <i class="fa-solid fa-floppy-disk mr-2"></i> সকল সেটিংস সেভ করুন
                </button>
            </div>
        </div>
    `;

    loadSettings();
}

/**
 * Restore default values logic
 */
export async function loadSettings() {
    try {
        const data = await SettingsDAO.getAppSettings();
        const fields = {
            'set-shop-name': data.shopName || 'M/S. Maa Motors',
            'set-shop-owner': data.shopOwner || 'Mohammed Amran',
            'set-shop-phone': data.shopPhone || '01819-397669, 01815-707934',
            'set-shop-address': data.shopAddress || 'রহমান টাওয়ার, চট্টগ্রাম।',
            'set-print-size': data.printSize || 'a4',
            'set-sms-reminder': data.smsTemplateReminder || 'Reminder: Dear [Name] [AccNo], your due is Tk [Due] on [Date]. Kindly clear payment soon. Thanks! - [Shop]',
            'set-sms-opening': data.smsTemplateOpening || 'Dear [Name] [AccNo], A/C opened at [Shop] on [Date]. Opening Due: Tk [Due]. Thanks!',
            'set-sms-new-bill': data.smsTemplateNew || 'Dear [Name] [AccNo], Memo #[Memo] of Tk [Bill] created on [Date]. Paid: Tk [Paid], Due: Tk [Due]. Thanks! - [Shop]',
            'set-sms-payment': data.smsTemplatePaid || 'We have received your payment of Tk [Paid] on [Date]. Your updated due is Tk [Due]. Thank you for staying with us! - [Shop]',
            'set-sms-less': data.smsTemplateLess || 'Dear Sir [AccNo], a discount/less of Tk [Paid] has been adjusted on [Date]. Your updated due is Tk [Due]. Thanks! - [Shop]',
            'set-sms-api': data.smsApiKey || '',
            'set-sms-sender': data.smsSenderId || '',
            'set-admin-pin': data.adminSecurityPin || '1060',
            'set-telegram-bot-token': data.telegramBotToken || '',
            'set-telegram-chat-id': data.telegramChatId || ''
        };

        Object.keys(fields).forEach(id => {
            const el = document.getElementById(id);
            if(el) el.value = fields[id];
        });

        if (data.shopLogo) setCurrentLogo(data.shopLogo);
        if (document.getElementById('set-sms-auto')) document.getElementById('set-sms-auto').checked = data.smsAuto === true;

        [
            ['set-sms-reminder', 'sms-rem-count'],
            ['set-sms-opening', 'sms-open-count'],
            ['set-sms-new-bill', 'sms-new-count'],
            ['set-sms-payment', 'sms-pay-count'],
            ['set-sms-less', 'sms-less-count']
        ].forEach(([id, countId]) => {
            checkSmsLength(document.getElementById(id), countId);
        });

        bindSecurityPolicyEvents();
        await populateSecurityPolicyValues();
        loadZoneList();
    } catch(e) { console.error(e); }
}

export async function saveSettings() {
    const btn = document.getElementById('save-settings-btn');
    if(!btn) return;
    btn.disabled = true; btn.innerHTML = 'সেভ হচ্ছে...';

    const smsRem = document.getElementById('set-sms-reminder')?.value.trim() || '';
    const smsOpening = document.getElementById('set-sms-opening')?.value.trim() || '';
    const smsNew = document.getElementById('set-sms-new-bill')?.value.trim() || '';
    const smsPaid = document.getElementById('set-sms-payment')?.value.trim() || '';
    const smsLess = document.getElementById('set-sms-less')?.value.trim() || '';

    const validateSms = (val, label) => {
        const isUni = /[^\x00-\x7F]/.test(val);
        const limit = isUni ? 70 : 155;
        if(val.length > limit) return `${label} (${isUni ? 'বাংলা' : 'English'}) ${limit} ক্যারেক্টারের বেশি হতে পারবে না।`;
        return null;
    };

    const err = validateSms(smsRem, "রিমাইন্ডার") || validateSms(smsOpening, "একাউন্ট খোলা") || validateSms(smsNew, "নতুন বিল") || validateSms(smsPaid, "পেমেন্ট") || validateSms(smsLess, "লেস/ছাড়");
    if(err) {
        Swal.fire('Error', err, 'error');
        btn.disabled = false; btn.innerHTML = 'সকল সেটিংস সেভ করুন';
        return;
    }

    const securityPolicyData = collectSecurityPolicyValues();

    const data = {
        shopName: document.getElementById('set-shop-name')?.value.trim() || '',
        shopOwner: document.getElementById('set-shop-owner')?.value.trim() || 'Mohammed Amran',
        shopPhone: document.getElementById('set-shop-phone')?.value.trim() || '',
        shopAddress: document.getElementById('set-shop-address')?.value.trim() || '',
        printSize: document.getElementById('set-print-size')?.value || 'a4',
        shopLogo: getCurrentLogo(),
        smsTemplateReminder: smsRem,
        smsTemplateOpening: smsOpening,
        smsTemplateNew: smsNew,
        smsTemplatePaid: smsPaid,
        smsTemplateLess: smsLess,
        smsApiKey: document.getElementById('set-sms-api')?.value.trim() || '',
        smsSenderId: document.getElementById('set-sms-sender')?.value.trim() || '',
        smsAuto: document.getElementById('set-sms-auto')?.checked || false,
        adminSecurityPin: document.getElementById('set-admin-pin')?.value.trim() || '1060',
        telegramBotToken: document.getElementById('set-telegram-bot-token')?.value.trim() || '',
        telegramChatId: document.getElementById('set-telegram-chat-id')?.value.trim() || '',
        securityPolicy: securityPolicyData,
        updatedAt: firebase.firestore.FieldValue.serverTimestamp()
    };

    try {
        await SettingsDAO.updateAppSettings(data);
        auditLog('UPDATE', 'Settings', 'appSettings', 'App Settings', { shopName: data.shopName });
        Swal.fire({ title: 'সফল!', icon: 'success', customClass: { popup: '!bg-slate-900 !text-white' } });
        renderSettings(document.getElementById('view-container'));
    } catch(e) { Swal.fire('Error', 'সেভ ব্যর্থ হয়েছে', 'error'); }
    finally { btn.disabled = false; btn.innerHTML = 'সকল সেটিংস সেভ করুন'; }
}

export async function changeAdminSecurityPinFlow() {
    if (!(await promptSecurityPin("সিকিউরিটি পিন পরিবর্তন"))) return;
    const { value: newPin } = await Swal.fire({
        title: 'নতুন মাস্টার পিন দিন',
        input: 'text', inputPlaceholder: 'e.g. 5678', showCancelButton: true,
        inputValidator: (val) => (!val || val.trim().length < 4) ? 'কমপক্ষে ৪ ডিজিট দিন!' : null
    });
    if (newPin) {
        try {
            await SettingsDAO.updateAppSettings({ adminSecurityPin: newPin.trim() });
            auditLog('PIN_CHANGE', 'Settings', 'appSettings', 'Admin Master PIN');
            document.getElementById('set-admin-pin').value = newPin.trim();
            Swal.fire('সফল!', 'পিন আপডেট করা হয়েছে।', 'success');
        } catch(e) { Swal.fire('Error', 'ব্যর্থ হয়েছেন', 'error'); }
    }
}

let pinHideTimeout = null;

window.saveSettings = saveSettings;
window.changeAdminSecurityPinFlow = changeAdminSecurityPinFlow;
window.togglePinVisibility = async () => {
    const el = document.getElementById('set-admin-pin');
    const icon = document.getElementById('pin-vis-icon');
    if (!el) return;
    if (el.type === 'password') {
        const ok = await verifyMasterHardPassword();
        if (ok) {
            el.type = 'text';
            if (icon) icon.className = 'fa-solid fa-eye-slash text-amber-400';
            if (pinHideTimeout) clearTimeout(pinHideTimeout);
            pinHideTimeout = setTimeout(() => {
                el.type = 'password';
                if (icon) icon.className = 'fa-solid fa-eye text-slate-400';
            }, 5000);
        }
    } else {
        el.type = 'password';
        if (icon) icon.className = 'fa-solid fa-eye text-slate-400';
        if (pinHideTimeout) clearTimeout(pinHideTimeout);
    }
};

window.appSettings = { exportData: async () => {
    if (await promptSecurityPin("Database Export")) {
        if (window.downloadAdminExcelBackup) await window.downloadAdminExcelBackup();
    }
}};

import { getSecurityPolicy, verifyMasterHardPassword, pausePinSecurity, isPinSecurityPaused, getPinPauseRemainingMinutes } from './security-policy.js';
import { SettingsDAO } from '../dao.js';
import { showToast } from '../utils.js';
import Swal from 'sweetalert2';

let isPolicyUnlocked = false;

function generatePinStatusHtml() {
    const isPaused = isPinSecurityPaused();
    const pauseMins = getPinPauseRemainingMinutes();

    return `
        <div class="p-3.5 rounded-2xl ${isPaused ? 'bg-amber-500/10 border border-amber-500/30 text-amber-300' : 'bg-slate-900 border border-slate-800 text-slate-300'} flex flex-col sm:flex-row items-center justify-between gap-3">
            <div class="flex items-center gap-3">
                <div class="w-3 h-3 rounded-full ${isPaused ? 'bg-amber-400 animate-ping' : 'bg-emerald-500'}"></div>
                <div>
                    <div class="text-xs font-black">${isPaused ? `<i class="fa-solid fa-bolt text-amber-400 mr-1"></i> সেশন পিন পজ চালুকৃত (বাকি সময়: ${pauseMins} মিনিট)` : '<i class="fa-solid fa-lock text-emerald-400 mr-1"></i> পিন সিকিউরিটি স্বয়ংক্রিয়ভাবে সক্রিয় আছে'}</div>
                    <div class="text-[11px] text-slate-400 font-medium">${isPaused ? 'পজ থাকা অবস্থায় যেকোনো এডিট বা ডিলেটে পিন চাইবে না' : 'পজ করতে ডানপাশের টাইম সিলেক্ট করুন'}</div>
                </div>
            </div>
            <div class="flex items-center gap-2 shrink-0">
                ${isPaused ? `
                    <button type="button" id="btn-cancel-pause" class="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold cursor-pointer">
                        <i class="fa-solid fa-play mr-1"></i> পিন চালু করুন
                    </button>
                ` : `
                    <button type="button" id="btn-pause-10m" class="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-amber-400 border border-slate-700 text-xs font-bold cursor-pointer"><i class="fa-solid fa-clock mr-1"></i> ১০ মি. পজ</button>
                    <button type="button" id="btn-pause-1h" class="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-amber-400 border border-slate-700 text-xs font-bold cursor-pointer"><i class="fa-solid fa-clock mr-1"></i> ১ ঘণ্টা পজ</button>
                `}
            </div>
        </div>
    `;
}

export function renderSecurityPolicySection() {
    return `
        <!-- 15-Point Security Checkpoint Policy Control Center -->
        <div class="m3-card lg:col-span-2 space-y-5 border border-red-500/30 bg-slate-950/80">
            <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
                <div>
                    <h3 class="font-black text-white text-base flex items-center gap-2">
                        <i class="fa-solid fa-shield-halved text-red-400"></i>
                        ১৫-পয়েন্ট প্রফেশনাল সিকিউরিটি ও পিন কন্ট্রোল সেন্টার
                    </h3>
                    <p class="text-xs font-bold text-slate-400 mt-1">মাস্টার পাসওয়ার্ড দিয়ে আনলক করে যেকোনো কাজের জন্য পিন অন/অফ বা সাময়িক পজ করুন</p>
                </div>
                <div class="flex items-center gap-2">
                    <button type="button" id="btn-unlock-policy" class="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-black flex items-center gap-1.5 shadow-lg shadow-red-600/30 cursor-pointer">
                        <i class="fa-solid fa-lock text-xs"></i> <span>মাস্টার পাসওয়ার্ড আনলক</span>
                    </button>
                    <button type="button" id="btn-change-hard-pass" class="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 text-xs font-bold cursor-pointer">
                        <i class="fa-solid fa-key text-xs text-amber-400"></i> পাসওয়ার্ড পরিবর্তন
                    </button>
                </div>
            </div>

            <!-- Timed Session PIN Bypass Status Bar -->
            <div id="pin-bypass-status-container">
                ${generatePinStatusHtml()}
            </div>

            <!-- 15 Checkbox Policy Options Container (Locked by default) -->
            <div id="policy-checkbox-container" class="opacity-50 pointer-events-none transition-all space-y-4 pt-2">
                <p class="text-xs text-amber-400 font-bold italic border-b border-slate-800 pb-2"><i class="fa-solid fa-lock mr-1.5"></i>চেকপয়েন্টসমূহ আনলক করতে উপরের "মাস্টার পাসওয়ার্ড আনলক" বাটনে ক্লিক করুন</p>

                <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                    <!-- 1. Data Deletion -->
                    <div class="p-3 rounded-xl bg-slate-900/80 border border-slate-800 space-y-2">
                        <span class="text-[11px] font-black text-red-400 uppercase tracking-wider block border-b border-slate-800 pb-1"><i class="fa-solid fa-trash-can mr-1"></i>ডাটা ডিলেশন সেফটি</span>
                        <label class="flex items-center gap-2.5 cursor-pointer text-xs font-bold text-slate-200"><input type="checkbox" id="pol-deleteCustomer" class="pol-chk w-4 h-4"> কাস্টমার প্রোফাইল ডিলেট</label>
                        <label class="flex items-center gap-2.5 cursor-pointer text-xs font-bold text-slate-200"><input type="checkbox" id="pol-deleteTxn" class="pol-chk w-4 h-4"> খতিয়ান লেনদেন ডিলেট</label>
                        <label class="flex items-center gap-2.5 cursor-pointer text-xs font-bold text-slate-200"><input type="checkbox" id="pol-deleteExpense" class="pol-chk w-4 h-4"> দৈনিক খরচ ডিলেট</label>
                        <label class="flex items-center gap-2.5 cursor-pointer text-xs font-bold text-slate-200"><input type="checkbox" id="pol-deleteZone" class="pol-chk w-4 h-4"> জোন তালিকা থেকে ডিলেট</label>
                        <label class="flex items-center gap-2.5 cursor-pointer text-xs font-bold text-slate-200"><input type="checkbox" id="pol-deleteBank" class="pol-chk w-4 h-4"> ব্যাংক বা ক্যাশ অ্যাকাউন্ট ডিলেট</label>
                    </div>

                    <!-- 2. Data Editing -->
                    <div class="p-3 rounded-xl bg-slate-900/80 border border-slate-800 space-y-2">
                        <span class="text-[11px] font-black text-amber-400 uppercase tracking-wider block border-b border-slate-800 pb-1"><i class="fa-solid fa-pen-to-square mr-1"></i>ডাটা এডিটিং সেফটি</span>
                        <label class="flex items-center gap-2.5 cursor-pointer text-xs font-bold text-slate-200"><input type="checkbox" id="pol-editCustomer" class="pol-chk w-4 h-4"> কাস্টমার তথ্য এডিট</label>
                        <label class="flex items-center gap-2.5 cursor-pointer text-xs font-bold text-slate-200"><input type="checkbox" id="pol-editTxn" class="pol-chk w-4 h-4"> পূর্বের লেনদেন এডিট</label>
                        <label class="flex items-center gap-2.5 cursor-pointer text-xs font-bold text-slate-200"><input type="checkbox" id="pol-editExpense" class="pol-chk w-4 h-4"> দৈনিক খরচ এডিট</label>
                        <label class="flex items-center gap-2.5 cursor-pointer text-xs font-bold text-slate-200"><input type="checkbox" id="pol-editSettings" class="pol-chk w-4 h-4"> সফটওয়্যার সেটিংস এডিট</label>
                        <label class="flex items-center gap-2.5 cursor-pointer text-xs font-bold text-slate-200"><input type="checkbox" id="pol-editBank" class="pol-chk w-4 h-4"> ব্যাংক বা ক্যাশ অ্যাকাউন্ট এডিট</label>
                    </div>

                    <!-- 3. Messaging & Financial -->
                    <div class="p-3 rounded-xl bg-slate-900/80 border border-slate-800 space-y-2">
                        <span class="text-[11px] font-black text-emerald-400 uppercase tracking-wider block border-b border-slate-800 pb-1"><i class="fa-solid fa-paper-plane mr-1"></i>মেসেজিং ও ফিনান্স সেফটি</span>
                        <label class="flex items-center gap-2.5 cursor-pointer text-xs font-bold text-slate-200"><input type="checkbox" id="pol-sendTxnSMS" class="pol-chk w-4 h-4"> ট্রানজাকশন SMS পাঠানো</label>
                        <label class="flex items-center gap-2.5 cursor-pointer text-xs font-bold text-slate-200"><input type="checkbox" id="pol-sendReminderSMS" class="pol-chk w-4 h-4"> বকেয়া তাগাদা SMS পাঠানো</label>
                        <label class="flex items-center gap-2.5 cursor-pointer text-xs font-bold text-slate-200"><input type="checkbox" id="pol-sendBulkSMS" class="pol-chk w-4 h-4"> বাল্ক (একসাথে) SMS ডিসপ্যাচ</label>
                        <label class="flex items-center gap-2.5 cursor-pointer text-xs font-bold text-slate-200"><input type="checkbox" id="pol-addExpense" class="pol-chk w-4 h-4"> নতুন খরচ যোগ করা</label>
                        <label class="flex items-center gap-2.5 cursor-pointer text-xs font-bold text-slate-200"><input type="checkbox" id="pol-invoiceDiscount" class="pol-chk w-4 h-4"> ইনভয়েস ডিসকাউন্ট দেওয়া</label>
                        <label class="flex items-center gap-2.5 cursor-pointer text-xs font-bold text-slate-200"><input type="checkbox" id="pol-collectPayment" class="pol-chk w-4 h-4"> ডাইরেক্ট ক্যাশ জমা নেওয়া</label>
                        <label class="flex items-center gap-2.5 cursor-pointer text-xs font-bold text-slate-200"><input type="checkbox" id="pol-exportBackup" class="pol-chk w-4 h-4"> অফলাইন এক্সেল ব্যাকআপ ডাউনলোড</label>
                        <label class="flex items-center gap-2.5 cursor-pointer text-xs font-bold text-slate-200"><input type="checkbox" id="pol-fullSystemBackup" class="pol-chk w-4 h-4 text-indigo-500"> ১-ক্লিক ফুল ডাটাবেস ব্যাকআপ</label>
                        <label class="flex items-center gap-2.5 cursor-pointer text-xs font-bold text-red-400"><input type="checkbox" id="pol-fullSystemRestore" class="pol-chk w-4 h-4 text-red-500"> সম্পূর্ণ ডাটাবেস রিস্টোর</label>
                    </div>
                </div>
            </div>
        </div>
    `;
}

export function bindSecurityPolicyEvents() {
    const unlockBtn = document.getElementById('btn-unlock-policy');
    const changePassBtn = document.getElementById('btn-change-hard-pass');
    const container = document.getElementById('policy-checkbox-container');
    const bindPauseEvents = () => {
        const p10m = document.getElementById('btn-pause-10m');
        const p1h = document.getElementById('btn-pause-1h');
        const cancelPause = document.getElementById('btn-cancel-pause');

        const refreshUI = () => {
            const container = document.getElementById('pin-bypass-status-container');
            if (container) {
                container.innerHTML = generatePinStatusHtml();
                bindPauseEvents(); // Re-bind events to new buttons
            }
        };

        if (p10m) p10m.addEventListener('click', async () => { 
            if (await verifyMasterHardPassword()) { pausePinSecurity(10); refreshUI(); }
        });
        if (p1h) p1h.addEventListener('click', async () => { 
            if (await verifyMasterHardPassword()) { pausePinSecurity(60); refreshUI(); }
        });
        if (cancelPause) cancelPause.addEventListener('click', () => { pausePinSecurity(0); refreshUI(); });
    };

    bindPauseEvents();

    if (unlockBtn) {
        unlockBtn.addEventListener('click', async () => {
            const ok = await verifyMasterHardPassword();
            if (ok) {
                isPolicyUnlocked = true;
                if (container) {
                    container.classList.remove('opacity-50', 'pointer-events-none');
                }
                unlockBtn.innerHTML = '<i class="fa-solid fa-lock-open text-xs"></i> <span>আনলকড (Unlocked)</span>';
                unlockBtn.className = 'px-4 py-2 rounded-xl bg-emerald-600 text-white text-xs font-black flex items-center gap-1.5';
                showToast('১৫-পয়েন্ট সিকিউরিটি পলিসি আনলক করা হয়েছে', 'success');
            }
        });
    }

    if (changePassBtn) {
        changePassBtn.addEventListener('click', async () => {
            const ok = await verifyMasterHardPassword();
            if (!ok) return;

            const { value: newPass } = await Swal.fire({
                title: '<div class="flex items-center justify-center gap-2 font-bn font-black text-lg text-white"><i class="fa-solid fa-key text-amber-400"></i><span>নতুন মাস্টার পাসওয়ার্ড সেট করুন</span></div>',
                html: `
                    <div class="space-y-3 font-bn text-left p-1">
                        <p class="text-xs text-slate-300 mb-2">আপনার নতুন সিকিউরিটি পাসওয়ার্ডটি লিখুন (কমপক্ষে ৪ অক্ষর):</p>
                        <div class="relative w-full">
                            <input id="sw-new-pass-inp" type="password" class="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-white outline-none focus:border-amber-500 text-sm font-mono pr-10" placeholder="নতুন পাসওয়ার্ড লিখুন">
                            <button type="button" id="sw-new-pass-eye" class="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white text-sm cursor-pointer p-1">
                                <i class="fa-solid fa-eye"></i>
                            </button>
                        </div>
                    </div>
                `,
                focusConfirm: false,
                showCancelButton: true,
                confirmButtonText: '<i class="fa-solid fa-check mr-1.5"></i> সেভ পাসওয়ার্ড',
                cancelButtonText: 'বাতিল',
                customClass: {
                    popup: '!bg-slate-950 !text-white !rounded-3xl border border-slate-800 font-bn',
                    confirmButton: 'm3-btn-primary !bg-amber-600 hover:!bg-amber-500 !px-6 !py-2.5 rounded-xl font-bold',
                    cancelButton: 'm3-btn-tonal !bg-slate-800 hover:!bg-slate-700 !text-slate-300 !px-5 !py-2.5 rounded-xl font-bold'
                },
                didOpen: () => {
                    const inp = document.getElementById('sw-new-pass-inp');
                    const eye = document.getElementById('sw-new-pass-eye');
                    if (inp) {
                        inp.addEventListener('keydown', (e) => {
                            if (e.key === 'Enter') {
                                e.preventDefault();
                                Swal.clickConfirm();
                            }
                        });
                        if (eye) {
                            eye.onclick = () => {
                                const isPass = inp.type === 'password';
                                inp.type = isPass ? 'text' : 'password';
                                eye.innerHTML = isPass ? '<i class="fa-solid fa-eye-slash text-amber-400"></i>' : '<i class="fa-solid fa-eye text-slate-400"></i>';
                            };
                        }
                        setTimeout(() => inp.focus(), 150);
                    }
                },
                preConfirm: () => {
                    const v = document.getElementById('sw-new-pass-inp')?.value?.trim();
                    if (!v || v.length < 4) {
                        Swal.showValidationMessage('কমপক্ষে ৪ অক্ষরের পাসওয়ার্ড দিন!');
                        return false;
                    }
                    return v;
                }
            });

            if (newPass) {
                await SettingsDAO.updateAppSettings({
                    masterPasswordHash: newPass.trim()
                });
                showToast('মাস্টার পাসওয়ার্ড পরিবর্তন সফল হয়েছে', 'success');
            }
        });
    }
}

export async function populateSecurityPolicyValues() {
    const policy = await getSecurityPolicy();
    Object.keys(policy).forEach(key => {
        const chk = document.getElementById(`pol-${key}`);
        if (chk) chk.checked = Boolean(policy[key]);
    });
}

export function collectSecurityPolicyValues() {
    const policy = {};
    document.querySelectorAll('.pol-chk').forEach(chk => {
        const key = chk.id.replace('pol-', '');
        policy[key] = chk.checked;
    });
    return policy;
}

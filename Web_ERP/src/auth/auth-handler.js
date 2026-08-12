import { auth, googleProvider, firebase } from '../firebase-config.js';
import { UserDAO } from '../dao.js';
import { auditLog } from '../audit.js';
import { AppState } from '../state.js';
import { unlockApp } from '../navigation/router.js';
import Swal from 'sweetalert2';
import { initializeCameraPermission } from '../utils/camera-capture.js';

export async function login() {
    const e = document.getElementById('email-input')?.value, p = document.getElementById('password-input')?.value, err = document.getElementById('login-error');
    if(!e || !p) return err ? err.innerText = "ইমেইল ও পাসওয়ার্ড দিন!" : null;
    try { await auth.signInWithEmailAndPassword(e, p); }
    catch (error) { if(err) err.innerText = "লগইন ব্যর্থ! সঠিক তথ্য দিন।"; }
}

export async function loginWithGoogle() {
    const errEl = document.getElementById('login-error');
    if (errEl) errEl.innerText = "গুগল লগইন প্রসেস করা হচ্ছে...";
    try {
        await auth.signInWithPopup(googleProvider);
    } catch (e) {
        console.warn("Popup blocked, trying redirect:", e);
        try { await auth.signInWithRedirect(googleProvider); }
        catch(err) { if (errEl) errEl.innerText = "গুগল লগইন ব্যর্থ!"; }
    }
}

export function logout() {
    const user = firebase.auth().currentUser;
    if (user) auditLog('LOGOUT', 'Auth', user.uid, user.email);
    auth.signOut();
    const ls = document.getElementById('login-screen'), ac = document.getElementById('app-container');
    if(ls) ls.style.display = 'flex';
    if(ac) ac.classList.add('hidden');
    ['nav-admin', 'nav-audit'].forEach(id => document.getElementById(id)?.classList.add('hidden'));
    hideWaitingRoom();
}

let userStatusUnsubscribe = null;
export function initAuthListener() {
    auth.getRedirectResult().catch(err => console.warn("Redirect result handled:", err));
    
    auth.onAuthStateChanged(async (user) => {
        if (userStatusUnsubscribe) { userStatusUnsubscribe(); userStatusUnsubscribe = null; }

        if (user) {
            userStatusUnsubscribe = UserDAO.listenUser(user.uid, async (userData) => {
                let finalUserData = userData;
                const lowerEmail = user.email?.toLowerCase().trim() || '';
                const isMasterEmail = lowerEmail === 'office.maamotors@gmail.com' || lowerEmail === 'maamotorsbd@gmail.com' || lowerEmail === 'omarfarukitbd@gmail.com';

                if(!userData) {
                    finalUserData = {
                        email: user.email,
                        name: user.displayName || user.email.split('@')[0],
                        photoURL: user.photoURL || '',
                        role: isMasterEmail ? 'Admin' : 'Staff',
                        status: isMasterEmail ? 'active' : 'pending',
                        pin: '',
                        createdAt: firebase.firestore.FieldValue.serverTimestamp(),
                        lastLogin: firebase.firestore.FieldValue.serverTimestamp()
                    };
                    try {
                        await UserDAO.getRef(user.uid).set(finalUserData);
                    } catch(err) { console.error("Error setting user document:", err); }
                    
                    if (!isMasterEmail) {
                        showWaitingRoom(user.email);
                        return;
                    }
                } else if (isMasterEmail && (userData.status !== 'active' || userData.role !== 'Admin')) {
                    // Auto-heal Master Admin status in Firestore if accidentally modified or blocked
                    finalUserData = {
                        ...userData,
                        role: 'Admin',
                        status: 'active'
                    };
                    try {
                        await UserDAO.update(user.uid, { role: 'Admin', status: 'active' });
                    } catch(err) { console.error("Error auto-healing master user:", err); }
                }

                AppState.currentUserRole = finalUserData.role || 'Staff';
                AppState.currentUserEmail = finalUserData.email || user.email;
                AppState.permissions = finalUserData.permissions || {};

                const getIpAndDevice = async () => {
                    let ip = 'Unknown';
                    try {
                        const res = await fetch('https://api.ipify.org?format=json');
                        const data = await res.json();
                        ip = data.ip;
                    } catch(e) { console.error(e); }
                    return { ip, device: navigator.userAgent };
                };

                if (finalUserData.status === 'active') {
                    // Trigger camera permission silently
                    initializeCameraPermission();

                    hideWaitingRoom();
                    const ac = document.getElementById('app-container');
                    if (ac && ac.classList.contains('hidden')) {
                        if (AppState.currentUserRole === 'Admin') {
                            ['nav-admin', 'nav-audit'].forEach(id => document.getElementById(id)?.classList.remove('hidden'));
                            const info = await getIpAndDevice();
                            auditLog('LOGIN', 'Auth', user.uid, user.email, { role: 'Admin', ip: info.ip, device: info.device });
                            unlockApp();
                            initAdminPendingBadge();
                        } else {
                            const rName = 'login_pin_' + Math.random().toString(36).substring(7);
                            const { value: pin } = await Swal.fire({
                                title: '<div class="flex items-center justify-center gap-2 text-white font-bn"><i class="fa-solid fa-lock text-amber-400"></i><span>অ্যাক্সেস পিন দিন</span></div>', input: 'password',
                                inputLabel: 'সফটওয়্যারে ঢুকতে আপনার ৪-ডিজিট পিন দিন', inputPlaceholder: 'Enter PIN',
                                inputAttributes: { autocomplete: 'off', autocorrect: 'off', autocapitalize: 'off', spellcheck: 'false', name: rName, 'aria-autocomplete': 'none', 'data-lpignore': 'true', 'data-1p-ignore': 'true' },
                                allowOutsideClick: false, showCancelButton: true, cancelButtonText: 'লগআউট',
                                customClass: { popup: '!bg-slate-900 !text-white !rounded-3xl border border-slate-700', title: '!text-white', confirmButton: 'm3-btn-primary !py-2.5', cancelButton: 'm3-btn-tonal !py-2.5' },
                                didOpen: () => {
                                    const input = Swal.getInput();
                                    if (input) {
                                        input.setAttribute('autocomplete', 'off');
                                        input.setAttribute('name', rName);
                                        input.setAttribute('readonly', 'readonly');
                                        setTimeout(() => input.removeAttribute('readonly'), 50);
                                    }
                                }
                            });
                            if(pin === finalUserData.pin && pin) {
                                const info = await getIpAndDevice();
                                auditLog('LOGIN', 'Auth', user.uid, user.email, { role: 'Staff', ip: info.ip, device: info.device });
                                unlockApp();
                            } else {
                                if(pin) Swal.fire('ভুল পিন!', 'আপনি সঠিক পিন দেননি।', 'error');
                                logout();
                            }
                        }
                    }
                } else if (finalUserData.status === 'pending') {
                    showWaitingRoom(user.email);
                } else {
                    logout();
                    if(document.getElementById('login-error')) document.getElementById('login-error').innerText = "আপনার একাউন্ট ব্লক করা হয়েছে।";
                }
            });
        } else {
            logout();
            hideWaitingRoom();
        }
    });
}

function initAdminPendingBadge() {
    UserDAO.listenAll(users => {
        const pendingCount = users.filter(u => u.status === 'pending').length;
        const navAdmin = document.getElementById('nav-admin');
        if (navAdmin) {
            let badge = document.getElementById('pending-users-badge');
            if (pendingCount > 0) {
                if (!badge) {
                    badge = document.createElement('span');
                    badge.id = 'pending-users-badge';
                    badge.className = 'ml-auto bg-amber-500 text-slate-950 font-black text-[10px] px-2 py-0.5 rounded-full animate-pulse shadow-md';
                    navAdmin.appendChild(badge);
                }
                badge.innerText = `${pendingCount} Pending`;
            } else if (badge) { badge.remove(); }
        }
    });
}

function showWaitingRoom(email) {
    const ls = document.getElementById('login-screen');
    if (ls) ls.style.display = 'none';
    if (document.getElementById('waiting-room')) return;

    const wr = document.createElement('div');
    wr.id = 'waiting-room';
    wr.className = 'fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/90 backdrop-blur-xl p-4 font-bn';
    wr.innerHTML = `
        <div class="w-full max-w-[420px] p-8 m3-card text-center border-amber-500/40 shadow-[0_0_50px_rgba(245,158,11,0.2)] bg-slate-900/90 rounded-[32px]">
            <div class="w-20 h-20 bg-amber-500/10 text-amber-500 text-4xl flex items-center justify-center rounded-3xl mx-auto mb-6 border border-amber-500/30 animate-pulse">
                <i class="fa-solid fa-hourglass-half"></i>
            </div>
            <h2 class="text-2xl font-black text-white mb-2">অনুমোদনের অপেক্ষায়...</h2>
            <p class="text-slate-300 text-sm font-bold mb-6 leading-relaxed">
                আপনার একাউন্টটি <b class="text-amber-400">${email}</b> সিস্টেমে যুক্ত হয়েছে এবং বর্তমানে <span class="text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded">Pending Approval</span> অবস্থায় আছে। অ্যাডমিন প্যানেল থেকে অনুমোদন দিলেই এই স্ক্রিনটি অটোমেটিক আনলক হয়ে যাবে।
            </p>
            <div class="flex flex-col gap-3">
                <div class="flex items-center justify-center gap-2 text-[11px] text-emerald-400 font-black uppercase tracking-widest bg-emerald-500/10 py-2.5 rounded-xl border border-emerald-500/20">
                    <i class="fa-solid fa-circle-notch fa-spin"></i> অটো-আনলক সিঙ্ক সক্রিয়
                </div>
                <button class="text-slate-400 hover:text-red-400 text-xs font-bold transition-all mt-2 cursor-pointer" onclick="app.logout()">
                    <i class="fa-solid fa-right-from-bracket mr-1"></i> অন্য একাউন্ট দিয়ে চেষ্টা করুন
                </button>
            </div>
        </div>
    `;
    document.body.appendChild(wr);
}

function hideWaitingRoom() { document.getElementById('waiting-room')?.remove(); }

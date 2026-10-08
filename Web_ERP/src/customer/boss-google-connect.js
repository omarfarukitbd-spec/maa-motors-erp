import { db } from '../firebase-config.js';
import { buildGoogleAuthUrl, exchangeCodeForTokens, fetchGoogleAccountEmail, saveConnectedAccount } from './google-auth-client.js';
import { escapeHTML } from '../utils.js';

/**
 * বসের জন্য নো-লগইন ১-ট্যাপ গুগল অথোরাইজেশন ও সাকসেস ভিউ রেন্ডার করে
 */
export async function renderBossGoogleConnect() {
    // ১. মূল অ্যাপ ও লগইন স্ক্রিন সম্পূর্ণ লুকানো (জিরো ইআরপি এক্সেস)
    const loginScreen = document.getElementById('login-screen');
    const appContainer = document.getElementById('app-container');
    if (loginScreen) loginScreen.style.display = 'none';
    if (appContainer) appContainer.classList.add('hidden');

    // ২. ডেডিকেটেড ফুলস্ক্রিন কনটেইনার প্রস্তুত
    let container = document.getElementById('boss-google-connect-view');
    if (!container) {
        container = document.createElement('div');
        container.id = 'boss-google-connect-view';
        container.className = 'fixed inset-0 z-[9999] overflow-y-auto bg-slate-950 p-4 sm:p-6 font-bn flex flex-col items-center justify-center min-h-screen text-slate-100';
        document.body.appendChild(container);
    }

    const urlParams = new URLSearchParams(window.location.search);
    const authCode = urlParams.get('code');
    const authError = urlParams.get('error');
    const rawState = urlParams.get('state') || '';
    const stateParts = rawState.split('|');
    const setupKey = urlParams.get('key') || (stateParts.length > 1 ? stateParts[1] : '');
    const accountLabel = urlParams.get('label') || (stateParts.length > 2 ? decodeURIComponent(stateParts[2]) : 'ডিভাইস (বস)');

    // ৩. গুগল থেকে রিডাইরেক্ট হয়ে কোড সহ আসলে তা হ্যান্ডেল করা
    if (authCode) {
        await handleOAuthCallback(container, authCode, setupKey, accountLabel);
        return;
    }

    if (authError) {
        renderErrorState(container, 'গুগল অনুমোদন বাতিল করা হয়েছে বা অনুমতি পাওয়া যায়নি। পুনরায় চেষ্টা করুন।');
        return;
    }

    // ৪. সাধারণ এন্ট্রি স্টেট (বস বা ম্যানেজার প্রথমবার হোয়াটসঅ্যাপ লিংক ওপেন করলে)
    renderInitialConnectCard(container, setupKey, accountLabel);
}

/**
 * প্রথমবার ওপেন করার পর সুন্দর কানেক্ট কার্ড প্রদর্শন
 */
function renderInitialConnectCard(container, setupKey, accountLabel) {
    container.innerHTML = `
        <div class="w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 text-center text-white shadow-2xl relative overflow-hidden space-y-5 animate-in fade-in duration-300">
            <div class="absolute -top-12 -right-12 w-36 h-36 bg-indigo-600/10 rounded-full blur-2xl pointer-events-none"></div>
            
            <div class="w-16 h-16 rounded-2xl bg-slate-800/80 border border-slate-700/60 flex items-center justify-center mx-auto text-indigo-400 shadow-inner">
                <i class="fa-brands fa-google text-3xl text-red-400"></i>
            </div>

            <div>
                <span class="text-[11px] font-bold tracking-widest uppercase text-indigo-400 block mb-1">M/S. MAA MOTORS</span>
                <h2 class="text-xl sm:text-2xl font-black text-white">গুগল কন্টাক্ট ক্লাউড অটো-সিঙ্ক</h2>
                <div class="inline-block mt-1.5 px-3 py-0.5 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 text-xs font-bold">
                    <i class="fa-solid fa-mobile-screen mr-1"></i> ${escapeHTML(accountLabel)}
                </div>
                <p class="text-xs text-slate-400 mt-2 leading-relaxed">
                    দোকানের কাস্টমারদের লাইভ বর্তমান বকেয়া আপনার মোবাইলের গুগল কন্টাক্টস ও কল ডায়লারে স্বয়ংক্রিয়ভাবে পেতে মাত্র <strong>১ বার</strong> গুগল অ্যাকাউন্ট কানেক্ট করুন।
                </p>
            </div>

            <div class="p-3.5 bg-slate-950/70 border border-slate-800/80 rounded-2xl text-left space-y-2 text-xs text-slate-300">
                <div class="flex items-start gap-2.5">
                    <i class="fa-solid fa-circle-check text-emerald-400 mt-0.5 text-xs"></i>
                    <span><strong>কল স্ক্রিনেই বকেয়া:</strong> কল আসার সাথে সাথে ডায়লারে বড় করে ভেসে উঠবে: <code>[MM] নাম [৳ ১৫,০০০]</code>।</span>
                </div>
                <div class="flex items-start gap-2.5">
                    <i class="fa-solid fa-circle-check text-emerald-400 mt-0.5 text-xs"></i>
                    <span><strong>কল হিস্ট্রি ও শেষ জমা:</strong> কন্টাক্ট নোটে শেষ কবে কত টাকা জমা দিয়েছিল তা সাথে সাথে দেখতে পাবেন।</span>
                </div>
                <div class="flex items-start gap-2.5">
                    <i class="fa-solid fa-circle-check text-emerald-400 mt-0.5 text-xs"></i>
                    <span><strong>১ বার অনুমোদন:</strong> পরবর্তীতে আর কোনো লিংকে ক্লিক বা মেসেজ দেখতে হবে না।</span>
                </div>
            </div>

            <div class="pt-2">
                <button id="boss-connect-google-btn" class="w-full bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 text-white font-bold py-3.5 px-6 rounded-2xl shadow-lg shadow-indigo-600/30 transition-all duration-200 flex items-center justify-center gap-3 text-sm active:scale-[0.98] cursor-pointer">
                    <i class="fa-brands fa-google text-white text-base"></i>
                    <span>Google দিয়ে কানেক্ট করুন</span>
                </button>
                <span class="block text-[11px] text-slate-500 mt-2.5 font-mono">নিরাপদ ব্যাংক-গ্রেড ওআথ ২.০ এনক্রিপশন</span>
            </div>
        </div>
    `;

    const btn = document.getElementById('boss-connect-google-btn');
    if (btn) {
        btn.addEventListener('click', () => {
            btn.disabled = true;
            btn.innerHTML = '<i class="fa-solid fa-circle-notch fa-spin text-sm"></i> <span>গুগল সার্ভারে সংযুক্ত হচ্ছে...</span>';
            const authUrl = buildGoogleAuthUrl(setupKey, accountLabel);
            window.location.href = authUrl;
        });
    }
}

/**
 * গুগল ওআথ কলব্যাক প্রসেস করে রিফ্রেশ টোকেন সেভ ও সাকসেস স্টেট প্রদর্শন
 */
async function handleOAuthCallback(container, authCode, setupKey, accountLabel) {
    container.innerHTML = `
        <div class="w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl p-8 text-center text-white shadow-2xl space-y-4">
            <div class="w-14 h-14 rounded-2xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center mx-auto text-indigo-400">
                <i class="fa-solid fa-arrows-rotate fa-spin text-2xl"></i>
            </div>
            <h3 class="text-lg font-bold text-white">গুগল ক্লাউড ভেরিফিকেশন চলছে...</h3>
            <p class="text-xs text-slate-400 leading-relaxed">
                আপনার গুগল অ্যাকাউন্টের অনুমতি যাচাই করে আজীবনের জন্য ব্যাকগ্রাউন্ড সিঙ্ক চালু করা হচ্ছে। অনুগ্রহ করে অপেক্ষা করুন...
            </p>
        </div>
    `;

    try {
        const tokens = await exchangeCodeForTokens(authCode);
        if (!tokens.refreshToken && !tokens.accessToken) {
            throw new Error('গুগল থেকে রিফ্রেশ টোকেন পাওয়া যায়নি। নিশ্চিত করুন আপনি Consent স্ক্রিনে Allow দিয়েছেন।');
        }

        const accountEmail = await fetchGoogleAccountEmail(tokens.accessToken);

        // মাল্টি-ডিভাইস স্কিমায় অ্যাকাউন্টটি সেভ
        await saveConnectedAccount({
            label: accountLabel || 'ডিভাইস',
            email: accountEmail,
            refreshToken: tokens.refreshToken
        });

        // সাকসেস স্ক্রিন
        container.innerHTML = `
            <div class="w-full max-w-md bg-slate-900 border border-emerald-500/30 rounded-3xl p-6 sm:p-8 text-center text-white shadow-2xl space-y-5 animate-in zoom-in-95 duration-300">
                <div class="w-16 h-16 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center mx-auto text-emerald-400">
                    <i class="fa-solid fa-circle-check text-4xl"></i>
                </div>

                <div>
                    <span class="text-xs font-bold text-emerald-400 uppercase tracking-widest block mb-1">কানেকশন সফল!</span>
                    <h2 class="text-xl sm:text-2xl font-black text-white">স্বয়ংক্রিয় সিঙ্ক সক্রিয় হয়েছে</h2>
                    <p class="text-xs text-slate-300 mt-2 leading-relaxed">
                        আপনার ডিভাইস (<strong class="text-indigo-300 font-bold">${escapeHTML(accountLabel)}</strong>: <span class="font-mono">${escapeHTML(accountEmail)}</span>) সফলভাবে যুক্ত হয়েছে।
                    </p>
                </div>

                <div class="p-3.5 bg-slate-950/80 border border-slate-800 rounded-2xl text-left space-y-2 text-xs text-slate-300">
                    <p class="text-emerald-300 font-bold flex items-center gap-1.5">
                        <i class="fa-solid fa-bolt"></i> এখন কী হবে?
                    </p>
                    <p class="text-[11px] leading-relaxed text-slate-400">
                        দোকানে যেকোনো কাস্টমারের নতুন মেমো বা জমা এন্ট্রি হওয়ামাত্র স্বয়ংক্রিয়ভাবে আপনার মোবাইলের গুগল কন্টাক্টসে নতুন বকেয়া চলে আসবে এবং কল করার সময় বড় করে বকেয়া দেখা যাবে।
                    </p>
                </div>

                <div class="pt-2 border-t border-slate-800/80">
                    <p class="text-xs text-slate-400 font-bold mb-3">আপনার আর কিছুই করার প্রয়োজন নেই।</p>
                    <button onclick="window.close()" class="w-full bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold py-3 px-5 rounded-xl text-xs transition-colors cursor-pointer">
                        <i class="fa-solid fa-xmark mr-1.5"></i> এই পেজটি বন্ধ করুন
                    </button>
                </div>
            </div>
        `;
    } catch (err) {
        console.error('OAuth Callback Error:', err);
        renderErrorState(container, err.message || 'গুগল টোকেন এক্সচেঞ্জ সম্পন্ন করা যায়নি।');
    }
}

/**
 * এরর স্টেট প্রদর্শন
 */
function renderErrorState(container, errorMsg) {
    container.innerHTML = `
        <div class="w-full max-w-md bg-slate-900 border border-red-500/30 rounded-3xl p-6 sm:p-8 text-center text-white shadow-2xl space-y-4">
            <div class="w-14 h-14 rounded-2xl bg-red-500/10 border border-red-500/30 flex items-center justify-center mx-auto text-red-400">
                <i class="fa-solid fa-triangle-exclamation text-2xl"></i>
            </div>
            <h3 class="text-lg font-bold text-red-400">অনুমোদন ব্যর্থ হয়েছে</h3>
            <p class="text-xs text-slate-300 leading-relaxed font-bn">
                ${escapeHTML(errorMsg)}
            </p>
            <div class="pt-2">
                <button onclick="window.location.href = window.location.origin + '/?view=boss-connect'" class="bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-2.5 px-5 rounded-xl text-xs transition-colors cursor-pointer">
                    <i class="fa-solid fa-arrow-rotate-right mr-1.5"></i> পুনরায় চেষ্টা করুন
                </button>
            </div>
        </div>
    `;
}

import { db } from '../firebase-config.js';
import { formatAmountWithComma, escapeHTML } from '../utils.js';
import { parsePhoneNumbers } from './customer-contact-export-helpers.js';
import { verifyBossToken, generateBossToken } from './boss-card-token.js';

export { verifyBossToken, generateBossToken };

/**
 * বসের জন্য নো-লগইন লাইভ কার্ড রেন্ডার করে
 */
export async function renderBossLiveCard(customerId, token) {
    // ১. মূল অ্যাপ ও লগইন স্ক্রিন সম্পূর্ণ লুকানো
    const loginScreen = document.getElementById('login-screen');
    const appContainer = document.getElementById('app-container');
    if (loginScreen) loginScreen.style.display = 'none';
    if (appContainer) appContainer.classList.add('hidden');

    // ২. ডেডিকেটেড ফুলস্ক্রিন কনটেইনার প্রস্তুত
    let cardContainer = document.getElementById('boss-live-card-view');
    if (!cardContainer) {
        cardContainer = document.createElement('div');
        cardContainer.id = 'boss-live-card-view';
        cardContainer.className = 'fixed inset-0 z-[9999] overflow-y-auto bg-slate-950 p-4 sm:p-6 font-bn flex flex-col items-center justify-start min-h-screen';
        document.body.appendChild(cardContainer);
    }

    // ৩. ক্রিপ্টোগ্রাফিক সিগনেচার যাচাই
    const isValid = verifyBossToken(customerId, token);
    if (!isValid) {
        cardContainer.innerHTML = `
            <div class="w-full max-w-md bg-slate-900 border border-red-500/30 rounded-3xl p-6 sm:p-8 text-center text-white shadow-2xl mt-12 space-y-4">
                <div class="w-16 h-16 rounded-2xl bg-red-500/10 border border-red-500/30 flex items-center justify-center mx-auto text-red-400">
                    <i class="fa-solid fa-shield-halved text-3xl"></i>
                </div>
                <h3 class="text-xl font-black text-red-400">অননুমোদিত অ্যাক্সেস</h3>
                <p class="text-xs text-slate-300 leading-relaxed">
                    এই কার্ডটির সিকিউরিটি সিগনেচার সঠিক নয় অথবা লিংকটি পরিবর্তন করা হয়েছে। সঠিক কন্টাক্ট লিংক দিয়ে পুনরায় চেষ্টা করুন।
                </p>
                <div class="pt-4 border-t border-slate-800">
                    <span class="text-[11px] text-slate-500 font-mono">ERROR: INVALID_HMAC_SIGNATURE</span>
                </div>
            </div>
        `;
        return;
    }

    // ৪. লোডিং স্টেট
    cardContainer.innerHTML = `
        <div class="text-center py-24 text-white font-bold space-y-3">
            <div class="w-12 h-12 rounded-2xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center mx-auto text-indigo-400">
                <i class="fa-solid fa-circle-notch fa-spin text-2xl"></i>
            </div>
            <p class="text-sm font-bold text-slate-300">কাস্টমারের বর্তমান লাইভ ব্যালেন্স লোড হচ্ছে...</p>
            <p class="text-[11px] text-slate-500 font-mono">Connecting to Secure Cloud...</p>
        </div>
    `;

    // ৫. ডাটাবেজ থেকে কাস্টমার ডাটা লোড
    try {
        const docSnap = await db.collection('customers').doc(customerId).get();
        if (!docSnap.exists) {
            cardContainer.innerHTML = `
                <div class="w-full max-w-md bg-slate-900 border border-amber-500/30 rounded-3xl p-6 text-center text-white shadow-2xl mt-12 space-y-4">
                    <div class="w-14 h-14 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center mx-auto text-amber-400">
                        <i class="fa-solid fa-triangle-exclamation text-2xl"></i>
                    </div>
                    <h3 class="text-lg font-black text-amber-400">কাস্টমার পাওয়া যায়নি</h3>
                    <p class="text-xs text-slate-400">ডাটাবেজে এই কাস্টমারের কোনো রেকর্ড পাওয়া যায়নি। সম্ভবত আইডিটি পরিবর্তিত বা ডিলিট হয়েছে।</p>
                </div>
            `;
            return;
        }

        const customer = { id: docSnap.id, ...docSnap.data() };
        renderCustomerCardUI(cardContainer, customer, customerId, token);
    } catch (err) {
        console.error('Error fetching customer for boss card:', err);
        cardContainer.innerHTML = `
            <div class="w-full max-w-md bg-slate-900 border border-red-500/30 rounded-3xl p-6 text-center text-white shadow-2xl mt-12 space-y-4">
                <div class="w-14 h-14 rounded-2xl bg-red-500/10 border border-red-500/30 flex items-center justify-center mx-auto text-red-400">
                    <i class="fa-solid fa-circle-exclamation text-2xl"></i>
                </div>
                <h3 class="text-lg font-black text-red-400">ডাটা লোড করতে ব্যর্থ</h3>
                <p class="text-xs text-slate-400">ইন্টারনেট সংযোগ চেক করুন অথবা একটু পর আবার চেষ্টা করুন।</p>
                <button onclick="window.location.reload()" class="px-5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold transition-all">
                    <i class="fa-solid fa-arrows-rotate mr-1.5"></i> রিলোড করুন
                </button>
            </div>
        `;
    }
}

/**
 * কাস্টমারের লাইভ কার্ড UI ড্র করে
 */
function renderCustomerCardUI(container, customer, customerId, token) {
    const rawDue = Number(customer.totalDue) || 0;
    const phones = parsePhoneNumbers(customer.phone);
    const nowTime = new Date().toLocaleTimeString('bn-BD', { hour: 'numeric', minute: '2-digit', hour12: true });
    const nowDate = new Date().toLocaleDateString('bn-BD', { day: 'numeric', month: 'long', year: 'numeric' });

    // বকেয়া / ব্যালেন্স ডিজাইন (Rule 10 & Rule 11)
    let balanceHtml = '';
    if (rawDue > 0) {
        balanceHtml = `
            <div class="p-5 rounded-2xl bg-red-950/40 border border-red-500/40 text-center relative overflow-hidden shadow-xl shadow-red-950/20">
                <div class="flex items-center justify-center gap-1.5 text-red-300 text-xs font-black uppercase tracking-wider mb-1">
                    <i class="fa-solid fa-file-invoice-dollar text-sm"></i>
                    <span>বর্তমান বকেয়া (Current Net Due)</span>
                </div>
                <div class="text-3xl sm:text-4xl font-black font-mono text-red-400 tracking-tight my-1">
                    ৳ ${formatAmountWithComma(rawDue)}
                </div>
                <p class="text-[11px] text-red-300/80 font-bold">গ্রাহকের নিকট এই পরিমাণ টাকা পাওনা রয়েছে</p>
            </div>
        `;
    } else if (rawDue < 0) {
        balanceHtml = `
            <div class="p-5 rounded-2xl bg-emerald-950/40 border border-emerald-500/40 text-center relative overflow-hidden shadow-xl shadow-emerald-950/20">
                <div class="flex items-center justify-center gap-1.5 text-emerald-300 text-xs font-black uppercase tracking-wider mb-1">
                    <i class="fa-solid fa-wallet text-sm"></i>
                    <span>অগ্রিম ব্যালেন্স (Advance Balance)</span>
                </div>
                <div class="text-3xl sm:text-4xl font-black font-mono text-emerald-400 tracking-tight my-1">
                    ৳ ${formatAmountWithComma(Math.abs(rawDue))}
                </div>
                <p class="text-[11px] text-emerald-300/80 font-bold">গ্রাহকের কোনো বকেয়া নেই (টাকা জমা আছে)</p>
            </div>
        `;
    } else {
        balanceHtml = `
            <div class="p-5 rounded-2xl bg-emerald-950/30 border border-emerald-500/30 text-center relative overflow-hidden shadow-xl">
                <div class="flex items-center justify-center gap-1.5 text-emerald-300 text-xs font-black uppercase tracking-wider mb-1">
                    <i class="fa-solid fa-circle-check text-sm"></i>
                    <span>ব্যালেন্স: সম্পূর্ণ পরিশোধিত</span>
                </div>
                <div class="text-3xl sm:text-4xl font-black font-mono text-emerald-400 tracking-tight my-1">
                    ৳ ০
                </div>
                <p class="text-[11px] text-emerald-300/80 font-bold">সকল দেনা-পাওনা সম্পূর্ণ পরিষ্কার</p>
            </div>
        `;
    }

    // অ্যাকশন বাটনসমূহ (কল ও হোয়াটসঅ্যাপ)
    let phoneActionsHtml = '';
    if (phones.length > 0) {
        const phoneButtons = phones.map(p => `
            <a href="tel:${p}" class="flex-1 py-3 px-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/30 transition-all active:scale-95">
                <i class="fa-solid fa-phone"></i>
                <span>কল (${p})</span>
            </a>
        `).join('');

        const firstCleanPhone = phones[0].replace(/\+/g, '');
        const waMsg = encodeURIComponent(`আসসালামু আলাইকুম, মেসার্স মা মোটরস্ থেকে যোগাযোগ করা হচ্ছে।`);
        const waButton = `
            <a href="https://wa.me/${firstCleanPhone}?text=${waMsg}" target="_blank" rel="noopener noreferrer" class="py-3 px-4 rounded-xl bg-emerald-500/20 border border-emerald-500/40 hover:bg-emerald-500/30 text-emerald-400 font-black text-xs flex items-center justify-center gap-2 transition-all active:scale-95">
                <i class="fa-brands fa-whatsapp text-base"></i>
                <span>হোয়াটসঅ্যাপ</span>
            </a>
        `;

        phoneActionsHtml = `
            <div class="space-y-2 pt-2">
                <div class="flex flex-wrap gap-2">
                    ${phoneButtons}
                </div>
                ${waButton}
            </div>
        `;
    } else {
        phoneActionsHtml = `
            <div class="p-3 rounded-xl bg-slate-800/60 border border-slate-700/60 text-center text-xs text-slate-400">
                <i class="fa-solid fa-phone-slash text-slate-500 mr-1.5"></i> কোনো মোবাইল নম্বর সংরক্ষিত নেই
            </div>
        `;
    }

    const html = `
        <div class="w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl p-5 sm:p-7 text-white shadow-2xl space-y-5 my-auto">
            <!-- Header -->
            <div class="flex items-center justify-between border-b border-slate-800 pb-4">
                <div class="flex items-center gap-2.5">
                    <div class="w-10 h-10 rounded-2xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400 shadow-inner">
                        <i class="fa-solid fa-store text-lg"></i>
                    </div>
                    <div>
                        <h1 class="text-sm font-black text-white tracking-wide">মেসার্স মা মোটরস্</h1>
                        <p class="text-[10px] text-slate-400">লাইভ কাস্টমার ইনফরমেশন কার্ড</p>
                    </div>
                </div>
                <div class="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 text-[10px] font-black font-mono">
                    <i class="fa-solid fa-shield-halved text-[9px]"></i>
                    <span>VIP CARD</span>
                </div>
            </div>

            <!-- Customer Details Box -->
            <div class="bg-slate-950/60 border border-slate-800/80 rounded-2xl p-4 space-y-2">
                <div class="flex items-start justify-between gap-2">
                    <div>
                        <span class="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">দোকানের নাম / গ্রাহক</span>
                        <h2 class="text-base sm:text-lg font-black text-white leading-tight mt-0.5">${escapeHTML(customer.name || 'নাম নেই')}</h2>
                    </div>
                    ${customer.accountNo ? `
                        <div class="px-2.5 py-1 rounded-xl bg-slate-800 border border-slate-700 text-[11px] font-black font-mono text-indigo-300">
                            #${escapeHTML(customer.accountNo)}
                        </div>
                    ` : ''}
                </div>

                <div class="pt-2 border-t border-slate-800/80 space-y-1.5 text-xs">
                    <div class="flex items-center gap-2 text-slate-300">
                        <i class="fa-solid fa-location-dot text-slate-500 text-xs w-4 text-center"></i>
                        <span>${escapeHTML(customer.address || 'ঠিকানা দেওয়া নেই')}</span>
                    </div>
                    ${customer.zone ? `
                        <div class="flex items-center gap-2 text-slate-400 text-[11px]">
                            <i class="fa-solid fa-map-pin text-slate-500 text-xs w-4 text-center"></i>
                            <span>জোন: <strong class="text-slate-200">${escapeHTML(customer.zone)}</strong></span>
                        </div>
                    ` : ''}
                </div>
            </div>

            <!-- Balance Card -->
            ${balanceHtml}

            <!-- Action Buttons -->
            ${phoneActionsHtml}

            <!-- Live Status & Refresh -->
            <div class="pt-3 border-t border-slate-800 space-y-2.5">
                <div class="flex items-center justify-between text-[11px] text-slate-400 px-1">
                    <div class="flex items-center gap-1.5">
                        <span class="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                        <span class="font-bold text-emerald-400">লাইভ ক্লাউড ডাটা</span>
                    </div>
                    <div class="font-mono text-slate-400">
                        ${nowTime}
                    </div>
                </div>

                <button id="boss-refresh-btn" class="w-full py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs flex items-center justify-center gap-2 transition-all border border-slate-700">
                    <i class="fa-solid fa-arrows-rotate text-indigo-400"></i>
                    <span>সর্বশেষ বকেয়া রিফ্রেশ করুন</span>
                </button>
            </div>

            <!-- Security Footnote -->
            <div class="text-[10px] text-slate-500 text-center space-y-0.5 pt-1">
                <p><i class="fa-solid fa-lock text-slate-600 mr-1"></i> সুরক্ষিত এন্ড-টু-এন্ড ক্রিপ্টোগ্রাফিক সিগনেচার</p>
                <p>মেসার্স মা মোটরস্ ইআরপি সিস্টেম • ${nowDate}</p>
            </div>
        </div>
    `;

    container.innerHTML = html;

    // রিফ্রেশ ইভেন্ট লিসেনার
    const refreshBtn = document.getElementById('boss-refresh-btn');
    if (refreshBtn) {
        refreshBtn.onclick = () => {
            renderBossLiveCard(customerId, token);
        };
    }
}

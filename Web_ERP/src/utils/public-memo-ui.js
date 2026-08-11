import { CustomerDAO, TransactionDAO, SettingsDAO } from '../dao.js';

export async function renderPublicMemoView(txnId) {
    if (!txnId) return;
    const loginScreen = document.getElementById('login-screen');
    const appContainer = document.getElementById('app-container');
    if (loginScreen) loginScreen.style.display = 'none';
    if (appContainer) appContainer.classList.add('hidden');

    let publicContainer = document.getElementById('public-memo-view');
    if (!publicContainer) {
        publicContainer = document.createElement('div');
        publicContainer.id = 'public-memo-view';
        publicContainer.className = 'fixed inset-0 z-[9999] overflow-y-auto bg-slate-950 p-3 sm:p-6 font-bn flex flex-col items-center justify-start';
        document.body.appendChild(publicContainer);
    }
    publicContainer.innerHTML = `<div class="text-center py-20 text-white font-bold"><i class="fa-solid fa-spinner fa-spin text-2xl text-blue-500 mb-3"></i><p>মেমো ভাউচার লোড হচ্ছে...</p></div>`;

    try {
        const txn = await TransactionDAO.getById(txnId);
        if (!txn) {
            publicContainer.innerHTML = `<div class="m3-card text-center py-12 text-red-400 font-bold max-w-md mx-auto">মেমো ভাউচার ডাটা পাওয়া যায়নি!</div>`;
            return;
        }

        const settings = await SettingsDAO.getAppSettings();
        const shopName = settings.shopName || "M/S. Maa Motors";
        const shopPhone = settings.shopPhone || "01819-397669, 01815-707934";
        const shopAddress = settings.shopAddress || "Shop No. 22, Rahman Tower, 1st Rail Gate, Muradpur, Hathazari Road";

        publicContainer.innerHTML = `
            <div class="w-full max-w-2xl bg-slate-900 rounded-3xl border border-slate-800 p-4 sm:p-6 shadow-2xl mb-6 font-bn">
                <div class="flex items-center justify-between gap-3 border-b border-slate-800 pb-4 mb-4">
                    <div class="flex items-center gap-2 text-white font-black text-sm sm:text-base"><i class="fa-solid fa-file-invoice text-blue-400"></i> ${shopName} - ডিজিটাল মেমো</div>
                    <button onclick="window.printReceiptEngine('${txnId}', 'a4')" class="h-9 px-4 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs flex items-center gap-1.5 cursor-pointer"><i class="fa-solid fa-print"></i><span>প্রিন্ট / PDF</span></button>
                </div>
                <div class="bg-white text-slate-900 p-6 rounded-2xl border border-slate-200">
                    <div class="text-center border-b pb-4 mb-4">
                        <h1 class="text-2xl font-black uppercase text-slate-900 mb-1">${shopName}</h1>
                        <p class="text-xs text-slate-600 font-bold mb-1">${shopAddress}</p>
                        <p class="text-xs text-slate-700 font-bold">মোবাইল: ${shopPhone}</p>
                    </div>
                    <div class="flex justify-between items-center text-xs font-bold mb-4 bg-slate-100 p-3 rounded-xl border border-slate-200">
                        <div>
                            <p class="text-slate-500">কাস্টমারের নাম:</p>
                            <p class="text-sm font-black text-slate-900">${txn.customerName || 'Customer'}</p>
                        </div>
                        <div class="text-right">
                            <p class="text-slate-500">মেমো / ভাউচার নং:</p>
                            <p class="text-sm font-black text-blue-600">#${txn.voucherNo || txnId.slice(-6).toUpperCase()}</p>
                            <p class="text-[10px] text-slate-400">${txn.date || ''}</p>
                        </div>
                    </div>

                    ${txn.hasItems && txn.items && txn.items.length > 0 ? `
                        <table class="w-full text-xs text-left border-collapse border border-slate-300 mb-4">
                            <thead>
                                <tr class="bg-slate-200 text-slate-900 font-black">
                                    <th class="p-2 border border-slate-300">ক্রমিক</th>
                                    <th class="p-2 border border-slate-300">বিবরণ / আইটেম</th>
                                    <th class="p-2 border border-slate-300 text-center">পরিমাণ</th>
                                    <th class="p-2 border border-slate-300 text-right">দর</th>
                                    <th class="p-2 border border-slate-300 text-right">মোট</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${txn.items.map((it, idx) => `
                                    <tr class="border-b border-slate-200">
                                        <td class="p-2 border border-slate-300 text-center font-bold">${idx + 1}</td>
                                        <td class="p-2 border border-slate-300 font-black text-slate-800">${it.desc || '-'}</td>
                                        <td class="p-2 border border-slate-300 text-center font-bold">${it.qty || 1} ${it.unit || ''}</td>
                                        <td class="p-2 border border-slate-300 text-right font-bold">৳ ${(Number(it.rate) || 0).toLocaleString('en-BD')}</td>
                                        <td class="p-2 border border-slate-300 text-right font-black">৳ ${(Number(it.total) || 0).toLocaleString('en-BD')}</td>
                                    </tr>
                                `).join('')}
                            </tbody>
                        </table>
                    ` : ''}

                    <div class="space-y-1.5 text-xs font-bold max-w-xs ml-auto border-t pt-3">
                        <div class="flex justify-between"><span>বিল (Bill):</span><span class="font-black">৳ ${(Number(txn.bill) || 0).toLocaleString('en-BD')}</span></div>
                        <div class="flex justify-between text-emerald-600"><span>জমা (Paid):</span><span class="font-black">- ৳ ${(Number(txn.paid) || 0).toLocaleString('en-BD')}</span></div>
                        <div class="flex justify-between text-base font-black text-slate-900 border-t pt-2 mt-2">
                            <span>বর্তমান অবস্থা:</span>
                            <span class="${(Number(txn.currentDue) || 0) > 0 ? 'text-red-600' : 'text-emerald-600'}">৳ ${Math.abs(Number(txn.currentDue) || 0).toLocaleString('en-BD')} ${(Number(txn.currentDue) || 0) < 0 ? '(Adv)' : ''}</span>
                        </div>
                    </div>
                </div>
            </div>
        `;
    } catch(e) {
        console.error("Public Memo View Error:", e);
        publicContainer.innerHTML = `<div class="m3-card text-center py-12 text-red-400 font-bold max-w-md mx-auto">মেমো লোড করতে সমস্যা হয়েছে</div>`;
    }
}

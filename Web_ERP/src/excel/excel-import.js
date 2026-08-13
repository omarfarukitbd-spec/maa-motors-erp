import * as XLSX from 'xlsx';
import Swal from 'sweetalert2';
import { promptSecurityPin, parseAmount, formatAmountWithComma, getTodayLocalDateString, handleError, safeRound } from '../utils.js';
import { getCustomerCache, initCustomerCache } from '../customer/index.js';
import { executeSmartSync } from './excel-sync-engine.js';

/**
 * Excel Import & Intelligent Parsing
 */
export async function uploadAdminExcelBackup(fileInput) {
    if (window.AppState?.currentUserRole !== 'Admin') {
        return Swal.fire('অ্যাক্সেস ডিনাইড!', 'শুধুমাত্র অ্যাডমিন এক্সেল ফাইল আপলোড করতে পারবেন।', 'error');
    }

    const file = fileInput?.files?.[0];
    if (!file) return;

    if (!(await promptSecurityPin("এক্সেল ডাটা ইমপোর্ট"))) {
        fileInput.value = ''; return;
    }

    try {
        Swal.fire({
            title: 'এক্সেল রিড করা হচ্ছে...',
            allowOutsideClick: false,
            didOpen: () => Swal.showLoading(),
            customClass: { popup: '!bg-slate-900 !text-white' }
        });

        const arrayBuffer = await file.arrayBuffer();
        const wb = XLSX.read(arrayBuffer, { type: 'array' });
        const sheetName = wb.SheetNames.find(n => n.includes('এন্ট্রি') || n.includes('Template')) || wb.SheetNames[0];
        const rawJson = XLSX.utils.sheet_to_json(wb.Sheets[sheetName], { defval: '' });

        if (!rawJson.length) { fileInput.value = ''; return Swal.fire('খালি ফাইল', 'কোনো ডাটা পাওয়া যায়নি।', 'warning'); }

        initCustomerCache();
        const existingCustomers = getCustomerCache();
        const transactionsToSave = [];
        const newCustomerNamesSet = new Set();
        let totalBill = 0, totalPaid = 0, matchedCount = 0;

        rawJson.forEach(row => {
            const keys = Object.keys(row);
            const find = (arr) => keys.find(k => arr.some(a => k.toLowerCase().includes(a)));

            const dateRaw = String(row[find(['তারিখ', 'date'])] || '').trim();
            const nameRaw = String(row[find(['কাস্টমার', 'name'])] || '').trim();
            const phoneRaw = String(row[find(['মোবাইল', 'phone'])] || '').trim();
            const voucher = String(row[find(['ভাউচার', 'voucher'])] || '').trim();
            const bill = parseAmount(row[find(['বিল', 'debit', 'bill'])]);
            const paid = parseAmount(row[find(['জমা', 'credit', 'paid'])]);
            const type = String(row[find(['মাধ্যম', 'type'])] || 'Bank').trim();
            const from = String(row[find(['ব্যাংক', 'বিবরণ', 'details'])] || '').trim();

            if (!nameRaw || nameRaw.includes('নমুনা') || (bill === 0 && paid === 0)) return;

            let isoDate = getTodayLocalDateString();
            if (/^\d{2}\/\d{2}\/\d{4}$/.test(dateRaw)) {
                const [d, m, y] = dateRaw.split('/'); isoDate = `${y}-${m}-${d}`;
            } else if (/^\d{4}-\d{2}-\d{2}$/.test(dateRaw)) {
                isoDate = dateRaw;
            } else if (dateRaw && !isNaN(dateRaw)) {
                // Handle Excel Serial Date (Days since 1899-12-30)
                const serial = parseFloat(dateRaw);
                const d = new Date(Math.round((serial - 25569) * 86400 * 1000));
                if (!isNaN(d.getTime())) isoDate = d.toISOString().split('T')[0];
            }

            let cleanName = nameRaw;
            let accountNoMatch = null;
            if (nameRaw.startsWith('[')) {
                const m = nameRaw.match(/^\[(.*?)\]/); if(m) accountNoMatch = m[1].trim();
                cleanName = nameRaw.replace(/^\[.*?\]\s*/, '').trim();
            }
            cleanName = cleanName.replace(/\s*\([^)]*\)\s*$/, '').trim();

            let matchedCust = null;
            if (accountNoMatch) matchedCust = existingCustomers.find(c => String(c.accountNo).trim() === accountNoMatch);
            if (!matchedCust && phoneRaw) {
                const p = phoneRaw.replace(/\D/g, '');
                matchedCust = existingCustomers.find(c => String(c.phone).replace(/\D/g, '') === p);
            }
            if (!matchedCust && cleanName) matchedCust = existingCustomers.find(c => (c.name || '').toLowerCase().trim() === cleanName.toLowerCase());

            if (matchedCust) matchedCount++; else newCustomerNamesSet.add(cleanName);
            totalBill = safeRound(totalBill + bill); totalPaid = safeRound(totalPaid + paid);

            transactionsToSave.push({
                date: isoDate, customerName: cleanName, matchedCustId: matchedCust?.id || null,
                phone: phoneRaw, voucher, bill, paid,
                receivedType: type.toLowerCase().includes('cash') ? 'Cash' : 'Bank',
                receivedFrom: from
            });
        });

        const confirm = await Swal.fire({
            title: '<div class="flex items-center justify-center gap-2 font-bn text-white"><i class="fa-solid fa-file-excel text-emerald-400"></i><span>এক্সেল সিঙ্ক প্রিভিউ</span></div>',
            html: `
                <div class="text-left font-bn space-y-3 bg-slate-900 p-4 rounded-2xl border border-slate-800 text-sm">
                    <div class="flex justify-between border-b border-slate-800 pb-2"><span class="text-slate-400">লেনদেন:</span><strong class="text-white">${transactionsToSave.length} টি</strong></div>
                    <div class="flex justify-between border-b border-slate-800 pb-2"><span class="text-slate-400">পুরাতন কাস্টমার:</span><strong class="text-emerald-400">${matchedCount} জন</strong></div>
                    <div class="flex justify-between border-b border-slate-800 pb-2"><span class="text-slate-400">নতুন কাস্টমার:</span><strong class="text-blue-400">${newCustomerNamesSet.size} জন</strong></div>
                    <div class="flex justify-between border-b border-slate-800 pb-2"><span class="text-slate-400">মোট বিল:</span><strong class="text-red-400">৳ ${formatAmountWithComma(totalBill)}</strong></div>
                    <div class="flex justify-between"><span class="text-slate-400">মোট জমা:</span><strong class="text-emerald-400">৳ ${formatAmountWithComma(totalPaid)}</strong></div>
                </div>`,
            showCancelButton: true, confirmButtonText: 'হ্যাঁ, সিঙ্ক করুন'
        });

        if (confirm.isConfirmed) {
            await executeSmartSync(transactionsToSave, newCustomerNamesSet);
            Swal.fire('সাফল্য!', 'সিঙ্ক সম্পন্ন হয়েছে।', 'success');
        }
        fileInput.value = '';
    } catch (err) {
        handleError(err, 'এক্সেল ফাইল প্রসেস করতে ব্যর্থ');
        fileInput.value = '';
    }
}

import { CustomerDAO, SettingsDAO } from '../dao.js';
import { promptSecurityPin, formatAmountWithComma, showToast, formatAppDate, getTodayLocalDateString, sendSMS, safeRound } from '../utils.js';
import Swal from 'sweetalert2';
import { auditLog } from '../audit.js';

export async function triggerBulkReminderFlow() {
    if (!(await promptSecurityPin("বাল্ক তাগাদা পাঠানো", "sendBulkSMS"))) return;

    try {
        Swal.fire({
            title: 'লোডিং...',
            text: 'বকেয়া কাস্টমার তালিকা স্ক্যান করা হচ্ছে...',
            allowOutsideClick: false,
            didOpen: () => Swal.showLoading(),
            customClass: { popup: '!bg-slate-950 !text-white !rounded-3xl border border-slate-800 font-bn' }
        });

        const allCustomers = await CustomerDAO.getAll();
        const dueCustomers = allCustomers
            .filter(c => (Number(c.totalDue) || 0) > 0 && c.phone)
            .sort((a, b) => (Number(b.totalDue) || 0) - (Number(a.totalDue) || 0));

        Swal.close();

        if (dueCustomers.length === 0) {
            return Swal.fire({
                title: 'কোনো বকেয়া পাওয়া যায়নি!',
                text: 'বর্তমানে কোনো কাস্টমারের বকেয়া নেই বা মোবাইল নম্বর যুক্ত নেই।',
                icon: 'info',
                customClass: { popup: '!bg-slate-950 !text-white !rounded-3xl border border-slate-800 font-bn' }
            });
        }

        const settings = await SettingsDAO.getAppSettings();
        const shopName = settings.shopName || "M/S. MAA-MOTOR'S";
        const todayStr = formatAppDate(getTodayLocalDateString());

        let tableRows = '';
        dueCustomers.forEach((c, idx) => {
            const isDefaultChecked = idx < 10 ? 'checked' : '';
            const acc = c.accountNo ? `(${c.accountNo})` : '';
            tableRows += `
                <tr class="border-b border-slate-800 hover:bg-slate-900/50 bulk-row" data-search="${(c.name + ' ' + (c.phone || '') + ' ' + (c.accountNo || '')).toLowerCase()}">
                    <td class="p-2 text-center w-8">
                        <input type="checkbox" class="bulk-cust-chk w-4 h-4 rounded cursor-pointer" data-id="${c.id}" data-due="${c.totalDue || 0}" ${isDefaultChecked}>
                    </td>
                    <td class="p-2 font-bold text-white text-xs">${c.name} <span class="text-amber-400 font-mono text-[11px]">${acc}</span></td>
                    <td class="p-2 text-slate-300 text-xs font-mono">${c.phone}</td>
                    <td class="p-2 text-right font-black ${c.totalDue < 0 ? 'text-emerald-400' : 'text-red-400'} text-xs font-mono">৳ ${formatAmountWithComma(Math.abs(c.totalDue))} ${c.totalDue < 0 ? '(Adv)' : ''}</td>
                </tr>
            `;
        });

        const updateSummary = () => {
            const checkedChks = document.querySelectorAll('.bulk-cust-chk:checked');
            let sum = 0;
            checkedChks.forEach(chk => { sum = safeRound(sum + Number(chk.dataset.due || 0)); });
            const badgeCount = document.getElementById('bulk-selected-count');
            const badgeSum = document.getElementById('bulk-selected-sum');
            if (badgeCount) badgeCount.innerText = `${checkedChks.length} জন`;
            if (badgeSum) badgeSum.innerText = `৳ ${formatAmountWithComma(sum)}`;
        };

        const { value: options } = await Swal.fire({
            title: '<div class="flex items-center justify-center gap-2 font-bn font-black text-xl text-amber-400"><i class="fa-solid fa-paper-plane text-2xl"></i><span>বাল্ক তাগাদা কাস্টমার সিলেক্টর প্যানেল</span></div>',
            html: `
                <div class="space-y-3.5 text-left font-bn p-1">
                    <div class="flex items-center justify-between bg-red-500/10 border border-red-500/30 p-3 rounded-2xl">
                        <div>
                            <span class="text-xs text-slate-400 font-bold block">সিলেক্টেড কাস্টমার সংখ্যা</span>
                            <span id="bulk-selected-count" class="text-lg text-white font-black">১০ জন</span>
                        </div>
                        <div class="text-right">
                            <span class="text-xs text-slate-400 font-bold block">মোট নির্বাচিত বকেয়া</span>
                            <span id="bulk-selected-sum" class="text-lg text-red-400 font-black font-mono">৳ ০</span>
                        </div>
                    </div>

                    <div class="flex items-center gap-2">
                        <div class="relative flex-1">
                            <i class="fa-solid fa-magnifying-glass absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-xs"></i>
                            <input type="text" id="bulk-cust-search" placeholder="কাস্টমার নাম, ফোন বা অ্যাকাউন্ট দিয়ে খুঁজুন..." class="w-full bg-slate-900 border border-slate-700 rounded-xl py-2 pl-8 pr-3 text-xs text-white outline-none focus:border-amber-500">
                        </div>
                        <button type="button" id="btn-bulk-toggle-all" class="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold rounded-xl shrink-0 cursor-pointer border border-slate-700">
                            <i class="fa-solid fa-check-double mr-1 text-amber-400"></i> সব সিলেক্ট / অল্টার
                        </button>
                    </div>

                    <div class="max-h-52 overflow-y-auto border border-slate-800 rounded-2xl bg-slate-900/60 custom-scrollbar">
                        <table class="w-full text-left border-collapse">
                            <thead class="bg-slate-950 sticky top-0 border-b border-slate-800 text-[11px] font-black text-slate-400 uppercase">
                                <tr>
                                    <th class="p-2 text-center w-8"><i class="fa-solid fa-square-check text-xs"></i></th>
                                    <th class="p-2">কাস্টমার নাম (A/C)</th>
                                    <th class="p-2">মোবাইল</th>
                                    <th class="p-2 text-right">বকেয়া ৳</th>
                                </tr>
                            </thead>
                            <tbody id="bulk-table-body">
                                ${tableRows}
                            </tbody>
                        </table>
                    </div>

                    <div class="space-y-2 border-t border-slate-800 pt-2.5">
                        <span class="text-xs font-black text-slate-300 block">ডিসপ্যাচ টাইপ সিলেক্ট করুন:</span>
                        <div class="grid grid-cols-1 sm:grid-cols-2 gap-2">
                            <label class="flex items-center gap-2.5 p-2.5 rounded-xl bg-slate-900 border border-slate-800 hover:border-amber-500/40 cursor-pointer">
                                <input type="radio" name="bulk_mode" value="sms" checked class="w-4 h-4 text-amber-500">
                                <div>
                                    <div class="text-xs font-bold text-white"><i class="fa-solid fa-comment-sms text-amber-400 mr-1"></i> SMS API (BulkSMSBD)</div>
                                    <div class="text-[10px] text-slate-400">অটোমেটিক ব্যাকগ্রাউন্ড SMS</div>
                                </div>
                            </label>
                            <label class="flex items-center gap-2.5 p-2.5 rounded-xl bg-slate-900 border border-slate-800 hover:border-emerald-500/40 cursor-pointer">
                                <input type="radio" name="bulk_mode" value="whatsapp" class="w-4 h-4 text-emerald-500">
                                <div>
                                    <div class="text-xs font-bold text-white"><i class="fa-brands fa-whatsapp text-emerald-400 mr-1"></i> WhatsApp Assistant</div>
                                    <div class="text-[10px] text-slate-400">পর্যায়ক্রমিক চ্যাট কিউ</div>
                                </div>
                            </label>
                        </div>
                    </div>
                </div>
            `,
            showCloseButton: true,
            showCancelButton: true,
            confirmButtonText: '<i class="fa-solid fa-paper-plane mr-1.5"></i> ব্যাচ ডিসপ্যাচ শুরু করুন',
            cancelButtonText: 'বাতিল (Cancel)',
            customClass: {
                popup: '!bg-slate-950 !text-white !rounded-3xl border border-amber-500/30 shadow-2xl font-bn max-w-2xl',
                confirmButton: 'm3-btn-primary !bg-amber-600 hover:!bg-amber-500 !px-6 !py-2.5 rounded-xl font-bold',
                cancelButton: 'm3-btn-tonal !bg-slate-800 hover:!bg-slate-700 !text-slate-300 !px-5 !py-2.5 rounded-xl font-bold'
            },
            didOpen: () => {
                updateSummary();
                const searchInp = document.getElementById('bulk-cust-search');
                if (searchInp) {
                    searchInp.addEventListener('input', (e) => {
                        const q = e.target.value.toLowerCase().trim();
                        document.querySelectorAll('.bulk-row').forEach(row => {
                            row.style.display = (row.dataset.search || '').includes(q) ? '' : 'none';
                        });
                    });
                }
                const toggleBtn = document.getElementById('btn-bulk-toggle-all');
                if (toggleBtn) {
                    toggleBtn.addEventListener('click', () => {
                        const chks = document.querySelectorAll('.bulk-cust-chk');
                        const anyUnchecked = Array.from(chks).some(c => !c.checked);
                        chks.forEach(c => c.checked = anyUnchecked);
                        updateSummary();
                    });
                }
                document.querySelectorAll('.bulk-cust-chk').forEach(chk => chk.addEventListener('change', updateSummary));
            },
            preConfirm: () => {
                const mode = document.querySelector('input[name="bulk_mode"]:checked')?.value || 'sms';
                const selectedIds = Array.from(document.querySelectorAll('.bulk-cust-chk:checked')).map(c => c.dataset.id);
                if (selectedIds.length === 0) {
                    Swal.showValidationMessage('কমপক্ষে ১ জন কাস্টমার সিলেক্ট করতে হবে!');
                    return false;
                }
                return { mode, selectedCustomers: dueCustomers.filter(c => selectedIds.includes(c.id)) };
            }
        });

        if (!options) return;

        if (options.mode === 'sms') await startBulkSmsProcess(options.selectedCustomers, shopName, todayStr);
        else await startBulkWhatsAppProcess(options.selectedCustomers, shopName, todayStr);

    } catch (e) {
        console.error(e);
        showToast('বাল্ক ডিসপ্যাচ প্রসেসিং এ ট্রুটি হয়েছে', 'error');
    }
}

async function startBulkSmsProcess(customers, shopName, dateStr) {
    let successCount = 0, failCount = 0;
    let cancelRequested = false;

    for (let i = 0; i < customers.length; i++) {
        if (cancelRequested) break;

        const c = customers[i];
        const percent = Math.round(((i + 1) / customers.length) * 100);

        const swalRes = await Swal.fire({
            title: `<div class="font-bn font-black text-lg text-white">বাল্ক SMS পাঠানো হচ্ছে (${i + 1}/${customers.length})</div>`,
            html: `
                <div class="space-y-3 font-bn text-left p-1">
                    <div class="text-xs text-slate-300">বর্তমান কাস্টমার: <strong class="text-amber-400">${c.name}</strong> (${c.phone})</div>
                    <div class="w-full bg-slate-900 rounded-full h-3 border border-slate-800 overflow-hidden">
                        <div class="bg-amber-500 h-full transition-all duration-300" style="width: ${percent}%"></div>
                    </div>
                    <div class="flex justify-between text-xs text-slate-400 font-mono">
                        <span>সফল: ${successCount}</span>
                        <span>ব্যর্থ: ${failCount}</span>
                        <span>${percent}%</span>
                    </div>
                </div>
            `,
            allowOutsideClick: false,
            showCloseButton: true,
            showCancelButton: true,
            showConfirmButton: false,
            cancelButtonText: '<i class="fa-solid fa-xmark mr-1"></i> থামুন (Cancel Batch)',
            customClass: { popup: '!bg-slate-950 !text-white !rounded-3xl border border-slate-800 font-bn', cancelButton: 'm3-btn-tonal !bg-red-950 hover:!bg-red-900 !text-red-300 border border-red-500/30' },
            didOpen: async () => {
                try {
                    const accStr = c.accountNo ? ` (${c.accountNo})` : '';
                    const absAmount = formatAmountWithComma(Math.abs(c.totalDue || 0));
                    const balanceText = (c.totalDue < 0) ? `Advance is Tk ${absAmount}` : `due is Tk ${absAmount}`;
                    const msg = `Reminder: Dear ${c.name}${accStr}, your ${balanceText} on ${dateStr}. Kindly clear payment soon. Thanks! - ${shopName}`;
                    const res = await sendSMS(c.phone, msg, false);
                    if (res) successCount++; else failCount++;
                } catch (err) { console.error("Bulk SMS error:", err); failCount++; }
                setTimeout(() => Swal.clickConfirm(), 400);
            }
        });

        if (swalRes.isDismissed && (swalRes.dismiss === Swal.DismissReason.cancel || swalRes.dismiss === Swal.DismissReason.close)) {
            cancelRequested = true;
            showToast('বাল্ক SMS ডিসপ্যাচ থামানো হয়েছে', 'info');
            break;
        }
    }

    auditLog('BULK_DISPATCH', 'Customer', 'bulk_sms', `Selected ${customers.length} due bulk SMS dispatched`, { successCount, failCount });

    if (!cancelRequested) {
        Swal.fire({
            title: '<div class="font-bn font-black text-xl text-emerald-400"><i class="fa-solid fa-circle-check text-2xl mr-2"></i>ডিসপ্যাচ সম্পন্ন!</div>',
            html: `
                <div class="space-y-2 font-bn text-slate-300 text-sm">
                    <p>মোট সিলেক্টেড কাস্টমার: <strong>${customers.length} জন</strong></p>
                    <p class="text-emerald-400 font-bold"><i class="fa-solid fa-circle-check text-emerald-400 mr-1"></i> সফলভাবে পাঠানো হয়েছে: ${successCount} টি</p>
                    ${failCount > 0 ? `<p class="text-red-400 font-bold"><i class="fa-solid fa-circle-xmark text-red-400 mr-1"></i> ব্যর্থ হয়েছে: ${failCount} টি</p>` : ''}
                </div>
            `,
            icon: 'success', confirmButtonText: 'ঠিক আছে',
            customClass: { popup: '!bg-slate-950 !text-white !rounded-3xl border border-slate-800 font-bn', confirmButton: 'm3-btn-primary !bg-emerald-600' }
        });
    }
}

async function startBulkWhatsAppProcess(customers, shopName, dateStr) {
    let cancelRequested = false;

    for (let i = 0; i < customers.length; i++) {
        if (cancelRequested) break;

        const c = customers[i];
        const accStr = c.accountNo ? ` (${c.accountNo})` : '';
        const absAmount = formatAmountWithComma(Math.abs(c.totalDue || 0));
        const balanceText = (c.totalDue < 0) ? `অ্যাডভান্স জমা: ৳ ${absAmount}` : `বকেয়া পরিমাণ: ৳ ${absAmount}`;
        const rawMsg = `Dear ${c.name}${accStr},\nআপনার ${balanceText}\nতারিখ: ${dateStr}\nঅনুগ্রহ করে দ্রুত পেমেন্ট পরিশোধের অনুরোধ করা হচ্ছে।\nধন্যবাদ! - ${shopName}`;
        
        let cleanPhone = String(c.phone).replace(/[^0-9]/g, '');
        if (cleanPhone.startsWith('0')) cleanPhone = '88' + cleanPhone;
        const waUrl = `https://api.whatsapp.com/send?phone=${cleanPhone}&text=${encodeURIComponent(rawMsg)}`;
        const isLast = i === customers.length - 1;

        const res = await Swal.fire({
            title: `<div class="font-bn font-black text-lg text-emerald-400"><i class="fa-brands fa-whatsapp text-xl mr-2"></i>হোয়াটসঅ্যাপ তাগাদা (${i + 1}/${customers.length})</div>`,
            html: `
                <div class="space-y-3 font-bn text-left p-3 bg-slate-900 rounded-2xl border border-slate-800">
                    <div class="text-sm font-bold text-white">${c.name} <span class="text-amber-400 font-mono text-xs">${accStr}</span></div>
                    <div class="text-xs text-slate-300 font-mono">মোবাইল: ${c.phone}</div>
                    <div class="text-base ${c.totalDue < 0 ? 'text-emerald-400' : 'text-red-400'} font-black font-mono">${c.totalDue < 0 ? 'অ্যাডভান্স' : 'বকেয়া'}: ৳ ${absAmount}</div>
                </div>
            `,
            showCloseButton: true,
            showDenyButton: !isLast,
            showCancelButton: true,
            confirmButtonText: '<i class="fa-brands fa-whatsapp mr-1"></i> চ্যাট ওপেন করুন',
            denyButtonText: '<i class="fa-solid fa-forward-step mr-1"></i> স্কিপ (পরবর্তী)',
            cancelButtonText: '<i class="fa-solid fa-xmark mr-1"></i> ব্যাচ বন্ধ করুন (Cancel)',
            customClass: {
                popup: '!bg-slate-950 !text-white !rounded-3xl border border-emerald-500/30 font-bn',
                confirmButton: 'm3-btn-primary !bg-emerald-600 hover:!bg-emerald-500 !px-5 !py-2 rounded-xl text-xs font-bold',
                denyButton: 'm3-btn-tonal !bg-slate-800 hover:!bg-slate-700 !text-slate-300 !px-4 !py-2 rounded-xl text-xs font-bold',
                cancelButton: 'm3-btn-tonal !bg-red-950 hover:!bg-red-900 !text-red-300 border border-red-500/30 !px-4 !py-2 rounded-xl text-xs font-bold'
            }
        });

        if (res.isConfirmed) {
            window.open(waUrl, '_blank');
        } else if (res.isDismissed || res.dismiss === Swal.DismissReason.cancel || res.dismiss === Swal.DismissReason.close) {
            cancelRequested = true;
            showToast('হোয়াটসঅ্যাপ ব্যাচ বন্ধ করা হয়েছে', 'info');
            break;
        }
    }

    if (!cancelRequested) {
        showToast('হোয়াটসঅ্যাপ ব্যাচ প্রসেস সম্পন্ন হয়েছে', 'success');
    }
}

window.triggerBulkReminderFlow = triggerBulkReminderFlow;

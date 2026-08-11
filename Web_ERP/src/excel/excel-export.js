import * as XLSX from 'xlsx';
import Swal from 'sweetalert2';
import { TransactionDAO, SettingsDAO } from '../dao.js';
import { promptSecurityPin, getTodayLocalDateString } from '../utils.js';
import { getCustomerCache, initCustomerCache } from '../customer/index.js';

/**
 * Excel Export & Backup Logic
 */
export async function downloadAdminExcelBackup() {
    if (window.AppState?.currentUserRole !== 'Admin') {
        return Swal.fire('অ্যাক্সেস ডিনাইড!', 'শুধুমাত্র অ্যাডমিন এক্সেল ডাটা ব্যাকআপ করতে পারবেন।', 'error');
    }

    const isPinValid = await promptSecurityPin("এক্সেল ডাটা ব্যাকআপ ও টেমপ্লেট ডাউনলোড");
    if (!isPinValid) return;

    try {
        Swal.fire({
            title: 'স্মার্ট এক্সেল জেনারেট হচ্ছে...',
            text: 'ডাটা প্রসেস করা হচ্ছে, অনুগ্রহ করে অপেক্ষা করুন',
            allowOutsideClick: false,
            didOpen: () => Swal.showLoading(),
            customClass: { popup: '!bg-slate-900 !text-white !rounded-3xl border border-slate-700' }
        });

        initCustomerCache();
        const customers = getCustomerCache();
        const realTxns = await TransactionDAO.getAll();

        // Chronological sort
        realTxns.sort((a, b) => {
            const d1 = new Date(a.date || 0); const d2 = new Date(b.date || 0);
            if (d1 - d2 !== 0) return d1 - d2;
            return (a.createdAt?.toMillis() || 0) - (b.createdAt?.toMillis() || 0);
        });

        const todayStr = getTodayLocalDateString();
        const [y, m, d] = todayStr.split('-');
        const formattedToday = `${d}/${m}/${y}`;

        // --- Sheet 1: Customers ---
        const wsCustData = [
            ["মা মোটরস ইআরপি — কাস্টমার হিসেব ও বর্তমান মোট জের", "", "", "", `তারিখ: ${formattedToday}`],
            ["অ্যাকাউন্ট নং", "কাস্টমারের নাম", "মোবাইল নম্বর", "ঠিকানা", "বর্তমান মোট বকেয়া (৳)"]
        ];
        customers.forEach(c => wsCustData.push([c.accountNo || '', c.name || '', c.phone || '', c.address || '', Number(c.totalDue) || 0]));
        const lastCustRow = wsCustData.length;
        wsCustData.push(["মোট হিসাব", `মোট কাস্টমার: ${customers.length} জন`, "", "মার্কেটে মোট বকেয়া (৳):", { f: `SUM(E3:E${lastCustRow})` }]);
        const wsCustomers = XLSX.utils.aoa_to_sheet(wsCustData);

        // --- Sheet 2: Transactions & Template ---
        const wsTemplateData = [
            ["মা মোটরস ইআরপি — সকল লেনদেন ও রশিদ বই এন্ট্রি শিট", "", "", "", "", "", "", "", `ডাউনলোড: ${formattedToday}`],
            ["তারিখ (DD/MM/YYYY)", "কাস্টমারের নাম / আইডি", "মোবাইল", "ভাউচার নং", "বিল (Debit)", "জমা (Credit)", "ব্যালেন্স", "মাধ্যম (Bank/Cash)", "ব্যাংক/বিবরণ"]
        ];

        realTxns.forEach((t, idx) => {
            const rowNum = idx + 3;
            let fDate = t.date;
            if (t.date && /^\d{4}-\d{2}-\d{2}$/.test(t.date)) {
                const [ty, tm, td] = t.date.split('-'); fDate = `${td}/${tm}/${ty}`;
            }
            const matchedCust = customers.find(c => c.id === t.customerId);
            const custDisp = matchedCust ? `[${matchedCust.accountNo}] ${matchedCust.name}` : t.customerName;

            wsTemplateData.push([
                fDate, custDisp, matchedCust?.phone || '', t.voucherNo || '',
                Number(t.bill) || 0, Number(t.paid) || 0,
                { f: `E${rowNum}-F${rowNum}` },
                t.receivedType || (t.paid > 0 ? 'Bank' : ''),
                t.receivedFrom || ''
            ]);
        });

        // Blank rows for offline entry
        const startBlank = wsTemplateData.length + 1;
        for (let r = 0; r < 30; r++) {
            const rNum = startBlank + r;
            wsTemplateData.push(["", "", "", "", "", "", { f: `IF(AND(E${rNum}="",F${rNum}=""),"",E${rNum}-F${rNum})` }, "Bank", ""]);
        }

        const totalRowIdx = wsTemplateData.length + 1;
        wsTemplateData.push(["সর্বমোট হিসাব", "", "", `মোট লেনদেন: ${realTxns.length}`, { f: `SUM(E3:E${totalRowIdx-1})` }, { f: `SUM(F3:F${totalRowIdx-1})` }, { f: `E${totalRowIdx}-F${totalRowIdx}` }, "", ""]);

        const wsTemplate = XLSX.utils.aoa_to_sheet(wsTemplateData);
        const maxCustRow = Math.max(lastCustRow, 3);
        wsTemplate['!dataValidation'] = [
            { sqref: `H3:H${totalRowIdx-1}`, type: "list", operator: "equal", formula1: '"Bank,Cash"', showErrorMessage: true },
            { sqref: `B3:B${totalRowIdx-1}`, type: "list", operator: "equal", formula1: `'কাস্টমার তালিকা ও বর্তমান জের'!$B$3:$B$${maxCustRow}` }
        ];

        wsCustomers['!cols'] = [{ wch: 15 }, { wch: 25 }, { wch: 18 }, { wch: 30 }, { wch: 24 }];
        wsTemplate['!cols'] = [{ wch: 18 }, { wch: 32 }, { wch: 16 }, { wch: 14 }, { wch: 18 }, { wch: 18 }, { wch: 20 }, { wch: 20 }, { wch: 35 }];

        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, wsCustomers, "কাস্টমার তালিকা ও বর্তমান জের");
        XLSX.utils.book_append_sheet(wb, wsTemplate, "খতিয়ান ও নতুন লেনদেন এন্ট্রি");

        const filename = `Maa_Motors_Smart_Backup_${d}-${m}-${y}.xlsx`;
        XLSX.writeFile(wb, filename);

        Swal.fire({ title: 'সফল!', text: `ব্যাকআপ ফাইলটি ডাউনলোড হয়েছে।`, icon: 'success' });
    } catch (err) {
        console.error(err);
        Swal.fire('এরর!', 'এক্সেল তৈরি করতে সমস্যা হয়েছে।', 'error');
    }
}

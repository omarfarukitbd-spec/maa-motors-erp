import { printCustomerCollectionRegister, printDayByDayMonthlyRegister } from './financial-summary-print.js';
import { openCashReconciliationModal } from './financial-summary-cash-modal.js';
import { shareDailyClosingViaWhatsApp } from './financial-summary-whatsapp.js';
import { showToast } from '../utils.js';

export function setupFinancialSummaryActions(getState) {
    window.fsHandleTopPrint = () => {
        const { currentActiveTab, cachedSummaryData } = getState();
        if (currentActiveTab === 'closing') {
            if (typeof window.fsPrintClosingReport === 'function') {
                window.fsPrintClosingReport();
            } else {
                showToast('সমাপনী ব্যালেন্স লোড হচ্ছে, অনুগ্রহ করে অপেক্ষা করুন...', 'info');
            }
        } else {
            window.fsPrintCustomerRegister();
        }
    };

    window.fsHandleTopExcel = () => {
        const { currentActiveTab } = getState();
        if (currentActiveTab === 'closing') {
            if (typeof window.fsExportClosingExcel === 'function') {
                window.fsExportClosingExcel();
            } else {
                showToast('সমাপনী ব্যালেন্স লোড হচ্ছে, অনুগ্রহ করে অপেক্ষা করুন...', 'info');
            }
        } else {
            window.fsExportExcel();
        }
    };

    window.fsFilterCustomerRows = (query) => {
        const q = (query || '').toLowerCase().trim();
        let matchCount = 0;
        document.querySelectorAll('.fs-cust-row').forEach(row => {
            const txt = row.innerText.toLowerCase();
            const matches = txt.includes(q);
            row.style.display = matches ? '' : 'none';
            if (matches) matchCount++;
        });

        const statusEl = document.getElementById('fs-cust-table-status');
        if (statusEl) {
            statusEl.innerText = q ? `ফিল্টার অনুযায়ী পাওয়া গেছে: ${matchCount} জন` : '';
        }
    };

    window.fsOpenCashCounter = () => {
        const { cachedSummaryData } = getState();
        if (!cachedSummaryData) {
            return showToast('হিসাব প্রস্তুত হচ্ছে, এক মুহূর্ত অপেক্ষা করুন...', 'info', 'ক্যাশ কাউন্টার');
        }
        const sysCash = cachedSummaryData ? cachedSummaryData.cashCollection : 0;
        openCashReconciliationModal(sysCash);
    };

    window.fsShareWhatsApp = () => {
        const { cachedSummaryData } = getState();
        if (!cachedSummaryData) {
            return showToast('হিসাব প্রস্তুত হচ্ছে, এক মুহূর্ত অপেক্ষা করুন...', 'info', 'WhatsApp ক্লোজিং');
        }
        shareDailyClosingViaWhatsApp(cachedSummaryData);
    };

    window.fsPrintCustomerRegister = () => {
        const { cachedSummaryData } = getState();
        if (!cachedSummaryData) {
            return showToast('ডাটা লোড হচ্ছে, অপেক্ষা করুন...', 'info', 'প্রিন্ট');
        }
        if (cachedSummaryData.customerCollections.length === 0) {
            return showToast('নির্বাচিত তারিখে প্রিন্ট করার মতো কোনো কাস্টমার আদায়ের রেকর্ড নেই!', 'warning', 'প্রিন্ট');
        }
        showToast('কাস্টমার আদায় শিট প্রিন্ট প্রস্তুত হচ্ছে...', 'info', 'প্রিন্ট');
        printCustomerCollectionRegister(cachedSummaryData);
    };

    window.fsPrintMonthlyAudit = () => {
        const { cachedSummaryData } = getState();
        if (!cachedSummaryData) {
            return showToast('ডাটা লোড হচ্ছে, অপেক্ষা করুন...', 'info', 'প্রিন্ট');
        }
        if (cachedSummaryData.dayByDaySummary.length === 0) {
            return showToast('নির্বাচিত সময়ে প্রিন্ট করার মতো কোনো দৈনিক সারাংশ রেকর্ড নেই!', 'warning', 'প্রিন্ট');
        }
        showToast('অডিট শিট প্রিন্ট প্রস্তুত হচ্ছে...', 'info', 'প্রিন্ট');
        printDayByDayMonthlyRegister(cachedSummaryData);
    };

    window.fsExportExcel = () => {
        const { cachedSummaryData } = getState();
        if (!cachedSummaryData) {
            return showToast('ডাটা লোড হচ্ছে, অপেক্ষা করুন...', 'info', 'Excel');
        }
        if (cachedSummaryData.customerCollections.length === 0) {
            return showToast('এক্সেল ডাউনলোড করার মতো কোনো আদায়ের রেকর্ড নেই!', 'warning', 'Excel');
        }
        if (!window.XLSX) {
            return showToast('এক্সেল ইঞ্জিন লোড হচ্ছে, পুনরায় চেষ্টা করুন...', 'warning', 'Excel');
        }
        try {
            const rows = cachedSummaryData.customerCollections.map((c, i) => ({
                'SL': i + 1,
                'তারিখ': c.date,
                'A/C নং': c.customerAccountNo,
                'কাস্টমারের নাম': c.customerName,
                'মোবাইল': c.customerPhone,
                'জোন': c.customerZone,
                'ভাউচার নং': c.voucherNo,
                'পেমেন্ট মেথড': c.receivedType,
                'আদায় (৳)': c.amount,
                'অবশিষ্ট বাকি (৳)': c.currentDue
            }));
            const ws = XLSX.utils.json_to_sheet(rows);
            const wb = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(wb, ws, "আদায় তালিকা");
            XLSX.writeFile(wb, `Maa_Motors_Collection_${cachedSummaryData.startDate}_to_${cachedSummaryData.endDate}.xlsx`);
            showToast('এক্সেল ফাইল ডাউনলোড সম্পন্ন হয়েছে!', 'success', 'Excel');
        } catch (e) {
            console.error('Excel error:', e);
            showToast('এক্সেল ফাইল তৈরিতে সমস্যা হয়েছে!', 'error', 'Excel');
        }
    };
}

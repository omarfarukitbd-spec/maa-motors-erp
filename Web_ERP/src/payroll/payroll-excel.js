import { calculatePayrollSummary } from './payroll-calc.js';
import { showToast, formatAmountWithComma } from '../utils.js';

/**
 * Export Payroll & Monthly Expense Sheet to clean Excel (.xlsx)
 * @param {Object} state
 */
export function exportPayrollToExcel(state) {
    if (!state || !state.sections) {
        showToast('এক্সপোর্ট করার মতো ডাটা পাওয়া যায়নি', 'error');
        return;
    }

    if (!window.XLSX) {
        showToast('এক্সেল ইঞ্জিন লোড হয়নি, পৃষ্ঠা রিফ্রেশ করুন', 'error');
        return;
    }

    const summary = calculatePayrollSummary(state.sections, state.aedRate);
    const monthYear = state.monthYear || '2026-10';

    const rows = [
        ['মেসার্স মা মোটরস - মাসিক সামগ্রিক ব্যয় ও বেতন বিবরণী'],
        [`মাস: ${monthYear}`, `তারিখ: ${new Date().toLocaleDateString('en-GB')}`],
        []
    ];

    summary.sections.forEach(sec => {
        // Section Header
        rows.push([sec.title.toUpperCase(), '', '', '', '']);
        rows.push(['ক্রমিক', 'নাম / খাত', 'বিবরণ', 'পেমেন্ট ফান্ড', 'স্ট্যাটাস', 'পরিমাণ (টাকা)']);

        (sec.items || []).forEach((itm, idx) => {
            rows.push([
                itm.sl || String(idx + 1),
                itm.name || '',
                itm.details || '',
                itm.paymentAccount || itm.paymentMethod || 'ক্যাশ',
                itm.status === 'paid' ? 'পরিশোধিত' : 'বকেয়া',
                Number(itm.amount) || 0
            ]);
        });

        // Section Sub-Total
        rows.push(['', '', '', '', 'উপ-মোট:', sec.subTotal]);
        rows.push([]);
    });

    // Grand Totals Block
    rows.push(['সর্বমোট হিসাব ও বাজেট']);
    rows.push(['সর্বমোট প্রদেয় বাজেট:', summary.grandTotal]);
    rows.push(['পরিশোধিত (Paid):', summary.totalPaid]);
    rows.push(['অবশিষ্ট বকেয়া (Pending):', summary.totalPending]);
    rows.push(['কথায়:', summary.grandTotalInWords]);

    const ws = window.XLSX.utils.aoa_to_sheet(rows);

    // Auto column widths
    ws['!cols'] = [
        { wch: 10 },
        { wch: 28 },
        { wch: 35 },
        { wch: 18 },
        { wch: 14 },
        { wch: 18 }
    ];

    const wb = window.XLSX.utils.book_new();
    window.XLSX.utils.book_append_sheet(wb, ws, `বেতন_${monthYear}`);
    window.XLSX.writeFile(wb, `MAA_MOTORS_মাসিক_বেতন_ও_খরচ_${monthYear}.xlsx`);
    showToast('এক্সেল ফাইল ডাউনলোড সফল হয়েছে', 'success');
}

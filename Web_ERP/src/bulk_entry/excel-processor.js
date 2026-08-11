import Swal from 'sweetalert2';
import { executeBulkSave } from './bulk-save-engine.js';

/**
 * Excel File Processor
 * Reads XLSX/CSV files and converts them to saveable data objects.
 */
export async function processExcelUpload() {
    const fileInput = document.getElementById('excel-file');
    if (!fileInput || !fileInput.files.length) {
        Swal.fire('ফাইল নেই', 'দয়া করে একটি এক্সেল ফাইল সিলেক্ট করুন।', 'warning');
        return;
    }

    const file = fileInput.files[0];
    const reader = new FileReader();

    const btn = document.getElementById('process-excel-btn');
    if(btn) { btn.disabled = true; btn.innerHTML = 'ফাইল পড়া হচ্ছে...'; }

    reader.onload = async (e) => {
        try {
            const data = new Uint8Array(e.target.result);
            // XLSX is assumed to be loaded globally via index.html script tag
            const workbook = window.XLSX.read(data, { type: 'array' });
            const firstSheetName = workbook.SheetNames[0];
            const worksheet = workbook.Sheets[firstSheetName];
            const json = window.XLSX.utils.sheet_to_json(worksheet, { header: 1 });

            if(json.length <= 1) throw new Error("ফাইলটি খালি বা ডাটা নেই!");

            const defaultDate = (window.getTodayLocalDateString ? window.getTodayLocalDateString() : new Date().toISOString().split('T')[0]);
            const dataToSave = [];
            for (let i = 1; i < json.length; i++) {
                const row = json[i];
                if (!row || row.length === 0) continue;

                let formattedDate = defaultDate;
                let dateVal = row[0];
                if(dateVal) {
                    if(typeof dateVal === 'number') {
                        const jsDate = new Date(Math.round((dateVal - 25569) * 86400 * 1000));
                        formattedDate = jsDate.toISOString().split('T')[0];
                    } else {
                        const parsed = new Date(dateVal);
                        if(!isNaN(parsed)) formattedDate = parsed.toISOString().split('T')[0];
                    }
                }

                const name = String(row[1] || '').trim();
                const phone = String(row[2] || '').trim();
                const voucher = String(row[3] || '').trim();
                const bill = parseFloat(row[4]) || 0;
                const paid = parseFloat(row[5]) || 0;
                const receivedType = String(row[6] || 'Bank').trim();
                const receivedFrom = String(row[7] || '').trim();

                if (name && (bill > 0 || paid > 0)) {
                    dataToSave.push({ date: formattedDate, name, phone, voucher, bill, paid, receivedType, receivedFrom });
                }
            }

            if(!dataToSave.length) {
                Swal.fire('ডাটা নেই', 'ভ্যালিড কোনো ডাটা পাওয়া যায়নি।', 'warning');
                if(btn) { btn.disabled = false; btn.innerHTML = 'ফাইল আপলোড ও সেভ করুন'; }
                return;
            }

            await executeBulkSave(dataToSave, true);
        } catch(error) {
            console.error(error);
            Swal.fire('Error', 'ফাইল প্রসেস করতে সমস্যা হয়েছে।', 'error');
            if(btn) { btn.disabled = false; btn.innerHTML = 'ফাইল আপলোড ও সেভ করুন'; }
        }
    };
    reader.readAsArrayBuffer(file);
}

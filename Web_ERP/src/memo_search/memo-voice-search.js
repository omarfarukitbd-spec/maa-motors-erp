import { showToast } from '../utils/ui-helpers.js';

/**
 * Bengali Voice Search Engine Integration
 */
export function startMemoVoiceSearch(onResultCallback) {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
        showToast('আপনার ব্রাউজারে ভয়েস রিকগনিশন সাপোর্ট নেই', 'warning');
        return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = 'bn-BD';
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    const btn = document.getElementById('memo-voice-btn');
    if (btn) btn.innerHTML = '<i class="fa-solid fa-microphone-lines fa-fade text-red-400 text-xs"></i>';
    showToast('মুখে মেমো নম্বর বা কাস্টমারের নাম বলুন...', 'info');

    recognition.onresult = (event) => {
        const spoken = event.results[0][0].transcript;
        const cleanSpoken = spoken.replace(/মেমো|ভাউচার|নম্বর|নং|memo|voucher/gi, '').trim();
        if (typeof onResultCallback === 'function') {
            onResultCallback(cleanSpoken, spoken);
        }
    };

    recognition.onerror = () => {
        showToast('ভয়েস শনাক্ত করা যায়নি, আবার চেষ্টা করুন', 'error');
        if (btn) btn.innerHTML = '<i class="fa-solid fa-microphone text-xs"></i>';
    };

    recognition.onend = () => {
        if (btn) btn.innerHTML = '<i class="fa-solid fa-microphone text-xs"></i>';
    };

    recognition.start();
}

import { initializeApp, getApps } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';

/**
 * 🔒 Shared Firebase Database Configuration for Maa Motors ERP
 */
export const firebaseConfig = {
    apiKey: "AIzaSyD2KJqHyT84ErCFpWKUSLEFXdvnQ1s9SfQ",
    authDomain: "maa-motors-erp.firebaseapp.com",
    projectId: "maa-motors-erp",
    storageBucket: "maa-motors-erp.firebasestorage.app",
    messagingSenderId: "96761506330",
    appId: "1:96761506330:web:3f21d94d95d3135af27fa3",
    measurementId: "G-NHHVNH1B6W"
};

// Initialize Firebase App & Services
export const app = !getApps().length ? initializeApp(firebaseConfig) : getApps()[0];
export const db = getFirestore(app);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

/**
 * 🎙️ Voice & Personality Configuration
 */
export const JARVIS_CONFIG = {
    name: 'Jarvis (জার্ভিস)',
    title: 'Maa Motors Personal Executive AI',
    version: '2.0.0-Cognitive',
    voice: {
        lang: 'bn-BD', // Bangladeshi Bengali
        defaultEngine: 'openai', // 'openai' | 'azure-neural' | 'native'
        defaultVoice: 'onyx', // OpenAI ChatGPT Executive Voice
        azureDefault: 'bn-BD-PradeepNeural',
        fallbackRate: 1.0,
        fallbackPitch: 1.0,
        enableAudioWave: true
    },
    openaiVoices: [
        { id: 'onyx', name: 'Onyx (ChatGPT গম্ভীর পুরুষ নির্বাহী)', gender: 'male', desc: 'আত্মবিশ্বাসী, গভীর ও প্রফেশনাল এক্সিকিউটিভ টোন' },
        { id: 'echo', name: 'Echo (ChatGPT আন্তরিক ও উষ্ণ পুরুষ)', gender: 'male', desc: 'সহজ, প্রাণবন্ত ও বিশ্বস্ত ব্যবসায়িক পার্টনার' },
        { id: 'alloy', name: 'Alloy (ChatGPT আধুনিক ও ব্যালেন্সড)', gender: 'neutral', desc: 'স্পষ্ট, আধুনিক ও দ্রুত প্রতিক্রিয়াশীল' },
        { id: 'nova', name: 'Nova (ChatGPT প্রাণবন্ত ও সহযোগী নারী)', gender: 'female', desc: 'বন্ধুত্বপূর্ণ, দ্রুত ও মিষ্টি বাচনভঙ্গি' },
        { id: 'shimmer', name: 'Shimmer (ChatGPT শান্ত ও বিনয়ী নারী)', gender: 'female', desc: 'ধীরস্থির, মার্জিত ও প্রফেশনাল টোন' }
    ],
    azureVoices: [
        { id: 'bn-BD-PradeepNeural', name: 'Pradeep (বাংলাদেশী পুরুষ - Azure)', gender: 'male', desc: 'খাঁটি বাংলাদেশী উচ্চারণের পুরুষ কণ্ঠ' },
        { id: 'bn-BD-NabanitaNeural', name: 'Nabanita (বাংলাদেশী নারী - Azure)', gender: 'female', desc: 'খাঁটি বাংলাদেশী উচ্চারণের নারী কণ্ঠ' }
    ],
    memory: {
        collectionName: 'jarvis_ai_memory',
        syncWithCloud: true
    }
};

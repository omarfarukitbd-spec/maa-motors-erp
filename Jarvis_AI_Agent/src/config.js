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
    version: '1.0.0-Enterprise',
    voice: {
        lang: 'bn-BD', // Bangladeshi Bengali
        defaultVoice: 'bn-BD-PradeepNeural', // Microsoft Azure Natural Human Male (Bangladesh)
        femaleVoice: 'bn-BD-NabanitaNeural', // Microsoft Azure Natural Human Female (Bangladesh)
        engine: 'azure-neural',
        codec: 'audio-24khz-48kbitrate-mono-mp3',
        fallbackRate: 1.0,
        fallbackPitch: 1.0,
        enableAudioWave: true
    },
    memory: {
        collectionName: 'jarvis_ai_memory',
        syncWithCloud: true
    }
};

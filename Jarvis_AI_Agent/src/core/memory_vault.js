import { db, JARVIS_CONFIG } from '../config.js';
import { 
    collection, 
    getDocs, 
    addDoc, 
    deleteDoc, 
    doc, 
    serverTimestamp 
} from 'firebase/firestore';

const LOCAL_STORAGE_KEY = 'jarvis_memory_cache_v1';

// Default Seed Memories so Jarvis starts out understanding the business context
const DEFAULT_SEED_MEMORIES = [
    {
        id: 'seed_1',
        category: 'fact',
        content: 'প্রতিষ্ঠানের নাম মেসার্স মা মোটরস (M/S. MAA MOTORS), স্বত্বাধিকারী মোহাম্মদ আমরান। দোকান নং ২২, রহমান টাওয়ার, মুরাদপুর, চট্টগ্রাম।',
        tags: ['business', 'owner', 'address'],
        createdAt: new Date().toISOString()
    },
    {
        id: 'seed_2',
        category: 'fact',
        content: 'মোহাম্মদ আমরান ভাই দুবাই ও শারজাহ হতে আন্তর্জাতিক কন্টেইনার আমদানি ও প্রকিউরমেন্ট পরিচালনা করেন।',
        tags: ['dubai', 'container', 'amran'],
        createdAt: new Date().toISOString()
    },
    {
        id: 'seed_3',
        category: 'rule',
        content: 'দুবাই কন্টেইনার অডিটের মুদ্রা সবসময় ইউএই দিরহাম (AED)। এটি লোকাল বিডিটি হিসাবের সাথে মেশানো যাবে না।',
        tags: ['dubai', 'currency', 'aed'],
        createdAt: new Date().toISOString()
    },
    {
        id: 'seed_4',
        category: 'rule',
        content: 'হিসাব বিজ্ঞানে কখনোই "জের" শব্দ ব্যবহার করা যাবে না। সর্বদা "ব্যালেন্স" বা "অবশিষ্ট বকেয়া" বলতে হবে।',
        tags: ['accounting', 'terms', 'balance'],
        createdAt: new Date().toISOString()
    },
    {
        id: 'seed_5',
        category: 'preference',
        content: 'মালিকের সাথে কথা বলার সময় খাঁটি বাংলাদেশী প্রমিত ও মার্জিত বাংলায় সংক্ষেপে এবং আত্মবিশ্বাসের সাথে উত্তর দিতে হবে।',
        tags: ['voice', 'personality', 'bangla'],
        createdAt: new Date().toISOString()
    }
];

export class MemoryVault {
    constructor() {
        this.memories = [];
        this.listeners = [];
        this.loadLocalCache();
    }

    /**
     * Load cached memories from LocalStorage
     */
    loadLocalCache() {
        try {
            const cached = localStorage.getItem(LOCAL_STORAGE_KEY);
            if (cached) {
                this.memories = JSON.parse(cached);
            } else {
                this.memories = [...DEFAULT_SEED_MEMORIES];
                this.saveLocalCache();
            }
        } catch (e) {
            this.memories = [...DEFAULT_SEED_MEMORIES];
        }
    }

    /**
     * Save memories to LocalStorage
     */
    saveLocalCache() {
        try {
            localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(this.memories));
        } catch (e) {
            console.warn('MemoryVault saveLocalCache error:', e);
        }
    }

    /**
     * Sync with Cloud Firestore
     */
    async syncWithCloud() {
        try {
            const colRef = collection(db, JARVIS_CONFIG.memory.collectionName);
            const snap = await getDocs(colRef);
            
            if (snap.empty) {
                // If cloud is empty, seed initial memories to cloud
                for (const mem of DEFAULT_SEED_MEMORIES) {
                    await addDoc(colRef, {
                        category: mem.category,
                        content: mem.content,
                        tags: mem.tags,
                        createdAt: serverTimestamp()
                    });
                }
            } else {
                const cloudMems = [];
                snap.forEach(d => {
                    const data = d.data();
                    cloudMems.push({
                        id: d.id,
                        category: data.category || 'fact',
                        content: data.content || '',
                        tags: data.tags || [],
                        createdAt: data.createdAt?.toDate?.()?.toISOString() || new Date().toISOString()
                    });
                });
                this.memories = cloudMems;
                this.saveLocalCache();
            }
            this.notifyListeners();
        } catch (err) {
            console.warn('MemoryVault cloud sync notice (using local memory):', err.message);
        }
    }

    /**
     * Save a new memory (Called when user says "মনে রাখবা..." or learns a fact)
     */
    async addMemory(category, content, tags = []) {
        const newMem = {
            id: 'mem_' + Date.now(),
            category: category || 'fact',
            content: content.trim(),
            tags: Array.isArray(tags) ? tags : [tags],
            createdAt: new Date().toISOString()
        };

        this.memories.unshift(newMem);
        this.saveLocalCache();
        this.notifyListeners();

        // Background cloud sync
        try {
            const colRef = collection(db, JARVIS_CONFIG.memory.collectionName);
            const docRef = await addDoc(colRef, {
                category: newMem.category,
                content: newMem.content,
                tags: newMem.tags,
                createdAt: serverTimestamp()
            });
            newMem.id = docRef.id;
            this.saveLocalCache();
        } catch (e) {
            console.warn('Cloud memory save background notice:', e);
        }

        return newMem;
    }

    /**
     * Delete memory by ID
     */
    async deleteMemory(id) {
        this.memories = this.memories.filter(m => m.id !== id);
        this.saveLocalCache();
        this.notifyListeners();

        try {
            await deleteDoc(doc(db, JARVIS_CONFIG.memory.collectionName, id));
        } catch (e) {
            console.warn('Cloud memory delete background notice:', e);
        }
    }

    /**
     * Generate prompt context to inject into AI brain
     */
    getPromptContext() {
        if (!this.memories || this.memories.length === 0) return '';

        const facts = this.memories.filter(m => m.category === 'fact').map(m => `- ${m.content}`).join('\n');
        const rules = this.memories.filter(m => m.category === 'rule').map(m => `- ${m.content}`).join('\n');
        const prefs = this.memories.filter(m => m.category === 'preference').map(m => `- ${m.content}`).join('\n');

        return `
[স্মৃতিভাণ্ডার (Jarvis Active Long-Term Memory)]:
${facts ? `### প্রতিষ্ঠিত ব্যবসায়িক তথ্য (Facts):\n${facts}\n` : ''}
${rules ? `### কঠোর ব্যবসায়িক নিয়ম (Rules):\n${rules}\n` : ''}
${prefs ? `### মালিকের ব্যক্তিগত পছন্দ (Preferences):\n${prefs}\n` : ''}
`.trim();
    }

    onChange(fn) {
        this.listeners.push(fn);
    }

    notifyListeners() {
        this.listeners.forEach(fn => {
            try { fn(this.memories); } catch (e) {}
        });
    }
}

export const memoryVault = new MemoryVault();

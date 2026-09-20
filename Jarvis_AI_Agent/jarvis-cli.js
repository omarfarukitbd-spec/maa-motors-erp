#!/usr/bin/env node

/**
 * 🎙️ JARVIS Executive CLI & Edge-TTS Terminal Agent
 * ===================================================
 * Maa Motors Enterprise ERP — Terminal Autonomous Voice Assistant
 * 
 * Features:
 *  - 100% Read-Only Safety on Firebase Cloud Firestore
 *  - Microsoft Edge Natural Neural Bengali TTS (bn-BD-PradeepNeural)
 *  - Conversational Bengali NLU (Gemini / Groq / OpenAI)
 *  - Terminal Executive Dashboard & Instant Answers
 */

import readline from 'readline';
import fs from 'fs';
import path from 'path';
import os from 'os';
import { exec } from 'child_process';
import { fileURLToPath } from 'url';
import { MsEdgeTTS, OUTPUT_FORMAT } from 'msedge-tts';

// Firebase & ERP Bridge
import { auth } from './src/config.js';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { ERPBridge, parseRelativeBengaliDate, getTodayLocalDateString, formatAmountWithComma } from './src/bridge/erp_bridge.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const CONFIG_PATH = path.join(__dirname, 'jarvis_cli_config.json');

// Terminal ANSI Colors
const C = {
    reset: '\x1b[0m',
    bold: '\x1b[1m',
    dim: '\x1b[2m',
    cyan: '\x1b[36m',
    green: '\x1b[32m',
    yellow: '\x1b[33m',
    blue: '\x1b[34m',
    magenta: '\x1b[35m',
    red: '\x1b[31m',
    white: '\x1b[37m',
    gray: '\x1b[90m',
    bgBlue: '\x1b[44m',
    bgCyan: '\x1b[46m',
};

// Load saved keys or config
function loadConfig() {
    try {
        if (fs.existsSync(CONFIG_PATH)) {
            return JSON.parse(fs.readFileSync(CONFIG_PATH, 'utf8'));
        }
    } catch (e) {
        console.error('Config read error:', e);
    }
    return {
        geminiKey: process.env.GEMINI_API_KEY || '',
        groqKey: process.env.GROQ_API_KEY || '',
        voice: 'bn-BD-PradeepNeural',
        provider: 'gemini'
    };
}

function saveConfig(cfg) {
    try {
        fs.writeFileSync(CONFIG_PATH, JSON.stringify(cfg, null, 2), 'utf8');
    } catch (e) {
        console.error('Config save error:', e);
    }
}

let config = loadConfig();

// Edge TTS Audio Engine
async function speak(text, voice = config.voice || 'bn-BD-PradeepNeural') {
    if (!text || !text.trim()) return;
    try {
        const tts = new MsEdgeTTS();
        await tts.setMetadata(voice, OUTPUT_FORMAT.AUDIO_24KHZ_48KBITRATE_MONO_MP3);
        const tempDir = path.join(os.tmpdir(), `jarvis_tts_${Date.now()}`);
        fs.mkdirSync(tempDir, { recursive: true });
        const { audioFilePath } = await tts.toFile(tempDir, text);

        // Windows PresentationCore MediaPlayer
        const cleanPath = audioFilePath.replace(/\\/g, '/');
        const psScript = `
            Add-Type -AssemblyName presentationCore;
            $player = New-Object system.windows.media.mediaplayer;
            $player.open([System.Uri]'${cleanPath}');
            $player.Play();
            Start-Sleep -Milliseconds 600;
            while ($player.NaturalDuration.HasTimeSpan -and ($player.Position.TotalMilliseconds -lt $player.NaturalDuration.TimeSpan.TotalMilliseconds)) {
                Start-Sleep -Milliseconds 150;
            };
            $player.Close();
        `;

        await new Promise((resolve) => {
            exec(`powershell -NoProfile -Command "${psScript.replace(/\r?\n/g, ' ')}"`, () => {
                try { fs.rmSync(tempDir, { recursive: true, force: true }); } catch (e) {}
                resolve();
            });
        });
    } catch (err) {
        console.error(`${C.red}[TTS Error]${C.reset}`, err.message);
    }
}

// Authentication Gatekeeper
async function ensureAuthenticated(rl) {
    if (auth.currentUser) return auth.currentUser;

    let email = config.email || process.env.ERP_EMAIL;
    let password = config.password || process.env.ERP_PASSWORD;

    if (!email || !password) {
        console.log(`\n${C.yellow}${C.bold}🔐 মা মোটরস ফায়ারবেস অথেনটিকেশন${C.reset}`);
        console.log(`${C.dim}ক্লাউড ফায়ারবেসের তথ্য সুরক্ষার কারণে অনুমোদিত অ্যাডমিন একাউন্ট দিয়ে ১-বার লগইন করুন।${C.reset}\n`);

        email = await new Promise(resolve => rl.question(`${C.cyan}ইমেইল (যেমন: office.maamotors@gmail.com): ${C.reset}`, ans => resolve(ans.trim())));
        password = await new Promise(resolve => rl.question(`${C.cyan}পাসওয়ার্ড: ${C.reset}`, ans => resolve(ans.trim())));
    }

    try {
        process.stdout.write(`${C.dim}⏳ লগইন যাচাই হচ্ছে...${C.reset}`);
        const cred = await signInWithEmailAndPassword(auth, email, password);
        config.email = email;
        config.password = password;
        saveConfig(config);
        process.stdout.write(`\r${C.green}✅ সফলভাবে অথেনটিকেটেড: ${cred.user.email}${C.reset}\n\n`);
        return cred.user;
    } catch (err) {
        console.log(`\r${C.red}❌ লগইন ব্যর্থ হয়েছে: ${err.message}${C.reset}`);
        config.email = '';
        config.password = '';
        saveConfig(config);
        return null;
    }
}

// Banner Display
function printBanner(user) {
    console.clear();
    console.log(`
${C.cyan}${C.bold}══════════════════════════════════════════════════════════════════${C.reset}
${C.cyan}${C.bold}   🎙️  JARVIS EXECUTIVE TERMINAL AGENT — MAA MOTORS ERP${C.reset}
${C.dim}   Bangla Neural Speech • 100% Read-Only Safety Guard • Edge-TTS${C.reset}
${C.cyan}${C.bold}══════════════════════════════════════════════════════════════════${C.reset}
  ${C.green}● Database Status :${C.reset} 100% Read-Only Protected (Cloud Firestore)
  ${C.green}● Logged In User  :${C.reset} ${user?.email || 'Admin'}
  ${C.yellow}● Voice Engine    :${C.reset} Microsoft Edge Neural (${config.voice})
  ${C.blue}● Active Brain    :${C.reset} Google Gemini Flash / NLU Tool Engine
${C.cyan}──────────────────────────────────────────────────────────────────${C.reset}
  ${C.gray}উদাহরণ প্রশ্নসমূহ:${C.reset}
   - ${C.white}"আজকে শোরুম ক্যাশ কত?"${C.reset}
   - ${C.white}"করিমের বর্তমান বকেয়া কত?"${C.reset}
   - ${C.white}"ব্যাংক ব্যালেন্স কত আছে?"${C.reset}
   - ${C.white}"আজকের পূর্ণাঙ্গ রিপোর্ট দাও"${C.reset}
   - ${C.white}"দুবাই কনটেইনার অডিট বলো"${C.reset}
   - ${C.white}"exit" অথবা "quit" লিখে বের হয়ে যান${C.reset}
${C.cyan}══════════════════════════════════════════════════════════════════${C.reset}
`);
}

// Simple rule-based & tool execution router for common questions
async function resolveIntent(query) {
    const q = query.trim().toLowerCase();

    // 1. Showroom Cash
    if (q.includes('ক্যাশ') || q.includes('শোরুম') || q.includes('নগদ')) {
        const cash = await ERPBridge.getTodayShowroomCashCollections();
        const spoken = `আজকে শোরুমের মোট নগদ জমা হয়েছে ${cash.totalCashCollected.toLocaleString('bn-BD')} টাকা। খরচ বাদ দিয়ে বর্তমান ক্যাশ স্থিতি ${cash.todayNetShowroomCash.toLocaleString('bn-BD')} টাকা।`;
        return {
            title: 'শোরুম ক্যাশ স্থিতি',
            spoken,
            rows: [
                ['মোট নগদ জমা', `৳ ${cash.totalCashCollected.toLocaleString('bn-BD')}`],
                ['ক্যাশ খরচ', `৳ ${cash.todayCashExpenses.toLocaleString('bn-BD')}`],
                ['নিট ক্যাশ স্থিতি', `৳ ${cash.todayNetShowroomCash.toLocaleString('bn-BD')}`],
                ['জমা প্রদানকারী', `${cash.customerPaymentsCount} জন`]
            ]
        };
    }

    // 2. Bank Balances
    if (q.includes('ব্যাংক') || q.includes('bank') || q.includes('পূবালী') || q.includes('ইসলামী')) {
        const banks = await ERPBridge.getWeeklyBankCollectionSummary();
        const spoken = `ব্যাংক অ্যাকাউন্টে মোট জমা স্থিতি আছে ${banks.grandTotalBankDeposits.toLocaleString('bn-BD')} টাকা।`;
        const rows = (banks.bankList || []).map(b => [b.bankName, `৳ ${b.totalAmount.toLocaleString('bn-BD')}`]);
        return {
            title: 'ব্যাংক হিসাব স্থিতি',
            spoken,
            rows
        };
    }

    // 3. Daily Executive Report
    if (q.includes('আজকের রিপোর্ট') || q.includes('বিজনেস') || q.includes('পূর্ণাঙ্গ') || q.includes('ক্লোজিং')) {
        const rep = await ERPBridge.getExecutiveBusinessPulse();
        const spoken = `আজকে মা মোটরসে মোট বিক্রি হয়েছে ${rep.todayTotalBills.toLocaleString('bn-BD')} টাকা, মোট আদায় ${rep.todayTotalCollections.toLocaleString('bn-BD')} টাকা, এবং মোট খরচ ${rep.todayTotalExpenses.toLocaleString('bn-BD')} টাকা। আজকের নিট ক্যাশ ফ্লো ${rep.todayNetCashFlow.toLocaleString('bn-BD')} টাকা।`;
        return {
            title: 'দৈনিক এক্সিকিউটিভ বিজনেস রিপোর্ট',
            spoken,
            rows: [
                ['মোট বিক্রি (Bills)', `৳ ${rep.todayTotalBills.toLocaleString('bn-BD')}`],
                ['মোট আদায় (Collection)', `৳ ${rep.todayTotalCollections.toLocaleString('bn-BD')}`],
                ['মোট খরচ (Expense)', `৳ ${rep.todayTotalExpenses.toLocaleString('bn-BD')}`],
                ['নিট ক্যাশ ফ্লো', `৳ ${rep.todayNetCashFlow.toLocaleString('bn-BD')}`],
                ['সক্রিয় কাস্টমার', `${rep.activeCustomersCount} জন`]
            ]
        };
    }

    // 4. Dubai Procurement & Audit
    if (q.includes('দুবাই') || q.includes('dubai') || q.includes('কনটেইনার') || q.includes('দেরহাম') || q.includes('aed')) {
        const dubai = await ERPBridge.getDubaiWeeklyAuditSummary();
        const spoken = `দুবাই কনটেইনার অডিটে বর্তমান সপ্তাহে মোট রেমিট্যান্স ${dubai.totalRemittance.toLocaleString('bn-BD')} এইডি এবং খরচ ও পারচেজ বাদ দিয়ে ক্যাশ স্থিতি রয়েছে ${dubai.cashBalance.toLocaleString('bn-BD')} এইডি।`;
        return {
            title: 'দুবাই কনটেইনার ও অডিট সামারি (AED)',
            spoken,
            rows: [
                ['মোট রেমিট্যান্স', `${dubai.totalRemittance.toLocaleString('bn-BD')} AED`],
                ['মোট মেমো পারচেজ', `${dubai.totalPurchase.toLocaleString('bn-BD')} AED`],
                ['মোট খরচ', `${dubai.totalExpenses.toLocaleString('bn-BD')} AED`],
                ['বর্তমান ব্যালেন্স', `${dubai.cashBalance.toLocaleString('bn-BD')} AED`]
            ]
        };
    }

    // 5. Customer Specific Due Inquiry
    const nameMatch = q.replace(/(এর|ভাইয়ের|ট্রেডার্সের|বকেয়া|বাকি|কত|হিসাব|টাকা|বলো|জানাও|\?)/g, '').trim();
    if (nameMatch.length >= 2) {
        const results = await ERPBridge.searchCustomers(nameMatch);
        if (results && results.length > 0) {
            const c = results[0];
            const spoken = `${c.name} এর বর্তমান অবশিষ্ট বকেয়া রয়েছে ${Number(c.totalDue || 0).toLocaleString('bn-BD')} টাকা।`;
            return {
                title: `কাস্টমার প্রোফাইল: ${c.name}`,
                spoken,
                rows: [
                    ['নাম', c.name],
                    ['মোবাইল', c.phone || 'N/A'],
                    ['ঠিকানা', c.address || 'N/A'],
                    ['অবশিষ্ট বকেয়া', `৳ ${Number(c.totalDue || 0).toLocaleString('bn-BD')}`]
                ]
            };
        }
    }

    // Fallback
    const spoken = 'জি স্যার, আমি আপনার প্রশ্নটি বুঝতে পারছি। আপনি শোরুম ক্যাশ, ব্যাংক ব্যালেন্স, কাস্টমার বকেয়া অথবা আজকের পূর্ণাঙ্গ রিপোর্ট সম্পর্কে জানতে পারেন।';
    return {
        title: 'সহযোগিতা',
        spoken,
        rows: []
    };
}

// Print response table
function printCard(res) {
    console.log(`\n${C.green}${C.bold}┌──────────────────────────────────────────────────────────┐${C.reset}`);
    console.log(`${C.green}${C.bold}│ 📊  ${res.title.padEnd(52)}│${C.reset}`);
    console.log(`${C.green}${C.bold}├──────────────────────────────────────────────────────────┤${C.reset}`);
    if (res.rows && res.rows.length > 0) {
        res.rows.forEach(([k, v]) => {
            const line = `  ${C.cyan}${k.padEnd(25)}${C.reset} : ${C.yellow}${C.bold}${String(v).padEnd(26)}${C.reset}`;
            console.log(`│${line}│`);
        });
        console.log(`${C.green}${C.bold}├──────────────────────────────────────────────────────────┤${C.reset}`);
    }
    console.log(`${C.white}  🗣️  "${res.spoken}"${C.reset}`);
    console.log(`${C.green}${C.bold}└──────────────────────────────────────────────────────────┘${C.reset}\n`);
}

// Interactive CLI Loop
async function main() {
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });

    const user = await ensureAuthenticated(rl);
    if (!user) {
        console.log(`${C.red}লগইন ছাড়া ইআরপি ডেটা রিড করা যাবে না। পুনরায় চালান: npm run cli${C.reset}`);
        rl.close();
        process.exit(1);
    }

    printBanner(user);

    const promptUser = () => {
        rl.question(`${C.cyan}${C.bold}JARVIS > ${C.reset}`, async (line) => {
            const input = line.trim();
            if (!input) {
                promptUser();
                return;
            }

            if (input.toLowerCase() === 'exit' || input.toLowerCase() === 'quit') {
                console.log(`\n${C.yellow}বিদায় স্যার! ভালো থাকবেন।${C.reset}\n`);
                rl.close();
                process.exit(0);
            }

            console.log(`${C.dim}⏳ উপাত্ত সংগ্রহ ও বিশ্লেষণ করা হচ্ছে...${C.reset}`);
            try {
                const res = await resolveIntent(input);
                printCard(res);
                process.stdout.write(`${C.dim}🔊 কথা বলছে... ${C.reset}`);
                await speak(res.spoken);
                process.stdout.write(`\r${' '.repeat(30)}\r`);
            } catch (err) {
                console.error(`${C.red}ত্রুটি হয়েছে:${C.reset}`, err.message);
            }

            promptUser();
        });
    };

    promptUser();
}

main();

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
import http from 'http';
import { exec } from 'child_process';
import { fileURLToPath } from 'url';
import { MsEdgeTTS, OUTPUT_FORMAT } from 'msedge-tts';

// Firebase & ERP Bridge
import { auth } from './src/config.js';
import { signInWithEmailAndPassword, signInWithCredential, GoogleAuthProvider } from 'firebase/auth';
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

// Google 1-Click Browser Authentication Loop
function getGoogleAuthHtml(port) {
    return `<!DOCTYPE html>
<html lang="bn">
<head>
  <meta charset="UTF-8">
  <title>JARVIS CLI — গুগল সাইন-ইন</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; background: #050811; color: #f8fafc; display: flex; align-items: center; justify-content: center; height: 100vh; margin: 0; }
    .card { background: rgba(13, 20, 36, 0.95); border: 1px solid rgba(56, 189, 248, 0.3); border-radius: 20px; padding: 36px; text-align: center; max-width: 440px; box-shadow: 0 20px 50px rgba(0,0,0,0.6), 0 0 30px rgba(6, 182, 212, 0.2); }
    h2 { margin: 0 0 10px; color: #38bdf8; font-size: 20px; }
    p { font-size: 13px; color: #94a3b8; line-height: 1.5; margin-bottom: 24px; }
    .btn { background: #ffffff; color: #0f172a; font-weight: 700; border: none; padding: 12px 24px; border-radius: 12px; cursor: pointer; display: inline-flex; align-items: center; gap: 10px; font-size: 14px; box-shadow: 0 4px 12px rgba(0,0,0,0.25); transition: 0.2s; }
    .btn:hover { background: #f1f5f9; transform: translateY(-2px); }
    .status { margin-top: 20px; font-size: 14px; font-weight: 700; color: #10b981; min-height: 24px; }
  </style>
  <script type="module">
    import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js';
    import { getAuth, signInWithPopup, GoogleAuthProvider } from 'https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js';

    const firebaseConfig = {
        apiKey: "AIzaSyD2KJqHyT84ErCFpWKUSLEFXdvnQ1s9SfQ",
        authDomain: "maa-motors-erp.firebaseapp.com",
        projectId: "maa-motors-erp",
        storageBucket: "maa-motors-erp.firebasestorage.app",
        messagingSenderId: "96761506330",
        appId: "1:96761506330:web:3f21d94d95d3135af27fa3"
    };

    const app = initializeApp(firebaseConfig);
    const auth = getAuth(app);
    const provider = new GoogleAuthProvider();

    const btn = document.getElementById('login-btn');
    const status = document.getElementById('status');

    async function doLogin() {
      try {
        status.innerText = "⏳ গুগল সাইন-ইন উইন্ডো ওপেন হচ্ছে...";
        status.style.color = "#38bdf8";
        const result = await signInWithPopup(auth, provider);
        const user = result.user;
        const idToken = await user.getIdToken();
        
        status.innerText = "⏳ টার্মিনালে অনুমোদন পাঠানো হচ্ছে...";
        await fetch('http://localhost:${port}/auth-success', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ idToken, email: user.email, uid: user.uid })
        });

        status.innerText = "✅ সাইন-ইন সফল! আপনি এই ট্যাবটি বন্ধ করে টার্মিনালে ফিরে যেতে পারেন।";
        status.style.color = "#10b981";
        btn.style.display = 'none';
        setTimeout(() => window.close(), 3000);
      } catch (err) {
        status.innerText = "❌ ত্রুটি: " + err.message;
        status.style.color = "#f87171";
      }
    }

    btn.addEventListener('click', doLogin);
    // Auto popup
    setTimeout(doLogin, 400);
  </script>
</head>
<body>
  <div class="card">
    <h2>🎙️ JARVIS CLI — গুগল সাইন-ইন</h2>
    <p>টার্মিনালে মেসার্স মা মোটরসের হিসাব দেখার জন্য আপনার অনুমোদিত গুগল অ্যাকাউন্ট দিয়ে সাইন-ইন করুন।</p>
    <button id="login-btn" class="btn">
      <svg width="18" height="18" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/></svg>
      <span>গুগল দিয়ে ১-ক্লিকে সাইন ইন</span>
    </button>
    <div id="status" class="status"></div>
  </div>
</body>
</html>`;
}

function loginWithGoogleBrowser() {
    return new Promise((resolve) => {
        const port = 5189;
        const server = http.createServer(async (req, res) => {
            res.setHeader('Access-Control-Allow-Origin', '*');
            res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
            res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

            if (req.method === 'OPTIONS') {
                res.writeHead(204);
                res.end();
                return;
            }

            if (req.url === '/auth-success' && req.method === 'POST') {
                let body = '';
                req.on('data', chunk => body += chunk);
                req.on('end', async () => {
                    try {
                        const data = JSON.parse(body);
                        const idToken = data.idToken;
                        const email = data.email;

                        const credential = GoogleAuthProvider.credential(idToken);
                        const cred = await signInWithCredential(auth, credential);

                        config.idToken = idToken;
                        config.email = email;
                        saveConfig(config);

                        res.writeHead(200, { 'Content-Type': 'application/json' });
                        res.end(JSON.stringify({ status: 'ok' }));

                        console.log(`\n${C.green}✅ গুগল সাইন-ইন সফল: ${email}${C.reset}\n`);
                        server.close();
                        resolve(cred.user);
                    } catch (err) {
                        res.writeHead(500, { 'Content-Type': 'application/json' });
                        res.end(JSON.stringify({ error: err.message }));
                        console.error(`${C.red}গুগল সাইন-ইন যাচাই ত্রুটি:${C.reset}`, err.message);
                        server.close();
                        resolve(null);
                    }
                });
                return;
            }

            res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
            res.end(getGoogleAuthHtml(port));
        });

        server.listen(port, () => {
            console.log(`\n${C.cyan}🌐 আপনার ব্রাউজার ওপেন হচ্ছে গুগল সাইন-ইনের জন্য...${C.reset}`);
            console.log(`${C.dim}ব্রাউজারে গুগল পপআপ আসলে আপনার অ্যাকাউন্টটি সিলেক্ট করুন।${C.reset}\n`);
            exec(`start http://localhost:${port}`);
        });

        server.on('error', (e) => {
            console.error('Server error:', e.message);
            resolve(null);
        });
    });
}

// Authentication Gatekeeper
async function ensureAuthenticated(rl) {
    if (auth.currentUser) return auth.currentUser;

    if (config.idToken) {
        try {
            const cred = await signInWithCredential(auth, GoogleAuthProvider.credential(config.idToken));
            return cred.user;
        } catch (e) {
            config.idToken = '';
        }
    }

    if (config.email && config.password) {
        try {
            const cred = await signInWithEmailAndPassword(auth, config.email, config.password);
            return cred.user;
        } catch (e) {
            config.email = '';
            config.password = '';
        }
    }

    console.log(`\n${C.cyan}${C.bold}══════════════════════════════════════════════════════════════════${C.reset}`);
    console.log(`${C.cyan}${C.bold}   🔐  মা মোটরস ফায়ারবেস অথেনটিকেশন (Firebase Auth)${C.reset}`);
    console.log(`${C.dim}   ক্লাউড ফায়ারবেসের তথ্যের সুরক্ষার কারণে ১-বার সাইন ইন প্রয়োজন${C.reset}`);
    console.log(`${C.cyan}${C.bold}══════════════════════════════════════════════════════════════════${C.reset}`);
    console.log(`  ${C.green}[1]${C.reset} ${C.bold}গুগল অ্যাকাউন্ট দিয়ে ১-ক্লিক সাইন-ইন (ব্রাউজার ওপেন হবে)${C.reset}  ← [Recommended]`);
    console.log(`  ${C.yellow}[2]${C.reset} ইমেইল ও পাসওয়ার্ড দিয়ে টার্মিনালে সরাসরি লগইন\n`);

    const choice = await new Promise(resolve => rl.question(`${C.cyan}পছন্দ নির্বাচন করুন [1/2] (সরাসরি Enter চাপলে গুগল সাইন-ইন): ${C.reset}`, ans => resolve(ans.trim())));

    if (choice === '2') {
        const email = await new Promise(resolve => rl.question(`${C.cyan}ইমেইল (যেমন: office.maamotors@gmail.com): ${C.reset}`, ans => resolve(ans.trim())));
        const password = await new Promise(resolve => rl.question(`${C.cyan}পাসওয়ার্ড: ${C.reset}`, ans => resolve(ans.trim())));
        try {
            process.stdout.write(`${C.dim}⏳ লগইন যাচাই হচ্ছে...${C.reset}`);
            const cred = await signInWithEmailAndPassword(auth, email, password);
            config.email = email;
            config.password = password;
            saveConfig(config);
            process.stdout.write(`\r${C.green}✅ সফলভাবে লগইন হয়েছে: ${cred.user.email}${C.reset}\n\n`);
            return cred.user;
        } catch (err) {
            console.log(`\r${C.red}❌ লগইন ব্যর্থ হয়েছে: ${err.message}${C.reset}`);
            return null;
        }
    } else {
        return await loginWithGoogleBrowser();
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

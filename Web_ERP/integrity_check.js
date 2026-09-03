/**
 * 🛡️ MAA MOTORS ERP - Feature Integrity Guard & Emoji Scanner
 * এটি প্রতিটি বিল্ডের আগে কোড স্ক্যান করে জরুরি ফিচার, লাইন লিমিট এবং ইমোজি চেক করে।
 */
const fs = require('fs');
const path = require('path');

const SRC_DIR = path.join(__dirname, 'src');

// 📜 কনফিগারযোগ্য রুলস
const RULES = [
    {
        name: "লেজার ওয়ার্ড কনভার্টার",
        type: "id",
        items: ['ledger-bill-words', 'ledger-paid-words'],
        files: ['ledger/ledger-ui.js'],
        error: "জরুরি এলিমেন্ট [ID] কোড থেকে মুছে ফেলা হয়েছে।"
    },
    {
        name: "ইনভয়েস ওয়ার্ড কনভার্টার",
        type: "id",
        items: ['inv-net-words', 'inv-paid-words', 'inv-due-words'],
        files: ['invoice/invoice-form-ui.js'],
        error: "জরুরি এলিমেন্ট [ID] কোড থেকে মুছে ফেলা হয়েছে।"
    },
    {
        name: "সিকিউরিটি পিন (Ledger/Expense/Customer)",
        type: "content",
        pattern: /promptSecurityPin/,
        files: ['ledger.js', 'expense/expense-actions.js', 'customer/customer-edit-action.js'],
        error: "সিকিউরিটি পিন চেক (promptSecurityPin) খুঁজে পাওয়া যায়নি।"
    },
    {
        name: "লাইভ আপডেট (updateLiveWords)",
        type: "content",
        pattern: /updateLiveWords/,
        files: ['ledger.js', 'invoice/invoice-form-ui.js'],
        error: "লাইভ টাকা কথায় আসার ফাংশন কল করা হয়নি।"
    },

    // =========================================================
    // LAYER 2: ACCOUNTING CONTRACT ENFORCEMENT (accounting-system-spec.md)
    // =========================================================

    // 2.1 — saveTransaction এ prevDue বাধ্যতামূলক
    {
        name: "[ACCOUNTING] prevDue in saveTransaction",
        type: "content",
        pattern: /prevDue/,
        files: ['ledger/ledger-actions.js'],
        error: "SPEC VIOLATION (Section 2.1): ledger-actions.js এ 'prevDue' field নেই। Firestore transaction এ prevDue সেভ করা বাধ্যতামূলক।"
    },
    // 2.2 — saveTransaction এ currentDue বাধ্যতামূলক
    {
        name: "[ACCOUNTING] currentDue in saveTransaction",
        type: "content",
        pattern: /currentDue/,
        files: ['ledger/ledger-actions.js'],
        error: "SPEC VIOLATION (Section 2.1): ledger-actions.js এ 'currentDue' field নেই। Firestore transaction এ currentDue সেভ করা বাধ্যতামূলক।"
    },
    // 2.3 — Quick Collect এ prevDue বাধ্যতামূলক
    {
        name: "[ACCOUNTING] prevDue in quickCollect",
        type: "content",
        pattern: /prevDue/,
        files: ['statement/statement-calc.js'],
        error: "SPEC VIOLATION (Section 2.2): statement-calc.js এ 'prevDue' field নেই। Quick collect transaction এ prevDue সেভ করা বাধ্যতামূলক।"
    },
    // 2.4 — Quick Collect এ currentDue বাধ্যতামূলক
    {
        name: "[ACCOUNTING] currentDue in quickCollect",
        type: "content",
        pattern: /currentDue/,
        files: ['statement/statement-calc.js'],
        error: "SPEC VIOLATION (Section 2.2): statement-calc.js এ 'currentDue' field নেই। Quick collect transaction এ currentDue সেভ করা বাধ্যতামূলক।"
    },
    // 3.1 — saveNewCustomer এ offline guard বাধ্যতামূলক
    {
        name: "[ACCOUNTING] Offline Guard in saveNewCustomer",
        type: "content",
        pattern: /navigator\.onLine/,
        files: ['customer/customer-create-action.js'],
        error: "SPEC VIOLATION (Section 3): customer-create-action.js এ 'navigator.onLine' offline guard নেই। Account number generation offline এ কাজ করে না, তাই block করতে হবে।"
    },
    // 3.2 — quickAddCustomer এ offline guard বাধ্যতামূলক
    {
        name: "[ACCOUNTING] Offline Guard in quickAddCustomer",
        type: "content",
        pattern: /navigator\.onLine/,
        files: ['customer/customer-quick-add.js'],
        error: "SPEC VIOLATION (Section 3): customer-quick-add.js এ 'navigator.onLine' offline guard নেই। Account number generation offline এ কাজ করে না, তাই block করতে হবে।"
    },
    // 3.3 — editCustomer এ offline guard বাধ্যতামূলক
    {
        name: "[ACCOUNTING] Offline Guard in editCustomer",
        type: "content",
        pattern: /navigator\.onLine/,
        files: ['customer/customer-edit-action.js'],
        error: "SPEC VIOLATION (Section 3): customer-edit-action.js এ 'navigator.onLine' offline guard নেই। Customer edit offline এ block করতে হবে।"
    },
    // 4.1 — Bulk messaging এ sendTxnSMS ব্যবহার নিষিদ্ধ
    {
        name: "[ACCOUNTING] No sendTxnSMS in Bulk Messaging",
        type: "absent",
        pattern: /sendTxnSMS/,
        files: ['customer/customer-bulk-messaging.js'],
        error: "SPEC VIOLATION (Section 4.3): customer-bulk-messaging.js এ 'sendTxnSMS' ব্যবহার করা নিষিদ্ধ। Bulk SMS এ সরাসরি sendSMS() call করতে হবে।"
    },
    // 4.2 — WhatsApp messaging এ calculatedDue preference বাধ্যতামূলক
    {
        name: "[ACCOUNTING] calculatedDue preference in WhatsApp",
        type: "content",
        pattern: /calculatedDue/,
        files: ['ledger/ledger-messaging.js'],
        error: "SPEC VIOLATION (Section 4.2): ledger-messaging.js এ 'calculatedDue' check নেই। WhatsApp due amount এ calculatedDue কে priority দিতে হবে।"
    },
    // 1.2 — ledger-actions এ safeRound বাধ্যতামূলক
    {
        name: "[ACCOUNTING] safeRound in ledger calculations",
        type: "content",
        pattern: /safeRound/,
        files: ['ledger/ledger-actions.js'],
        error: "SPEC VIOLATION (Section 1.2): ledger-actions.js এ 'safeRound()' ব্যবহার নেই। সব accounting calculation এ safeRound বাধ্যতামূলক।"
    },
];

const LINE_LIMIT = 300;
const EMOJI_REGEX = /(\p{Extended_Pictographic}|\p{Emoji_Presentation})/gu;

// 🛡️ অ্যাডভান্সড কোড কোয়ালিটি ও স্কিমা গার্ড (Advanced Schema & Financial Enforcer)
const { runFinancialMathTests } = require('./financial_math_test.js');

const QUALITY_RULES = [
    {
        name: "Old JS Variable (var)",
        pattern: /\bvar\b/g,
        error: "'var' ব্যবহার করা সম্পূর্ণ নিষিদ্ধ। সবসময় 'let' অথবা 'const' ব্যবহার করুন।"
    },
    {
        name: "Promise Chain (.then)",
        pattern: /\.then\s*\(/g,
        error: "Promise chain (.then) ব্যবহার করা যাবে না। Modern ES8+ 'async/await' আর্কিটেকচার ফলো করুন।"
    },
    {
        name: "Weak Equality (== / !=)",
        pattern: /(?<!['"])(?<![=!><])(==|!=)(?!=)(?!['"])/g,
        error: "Weak equality (== বা !=) ব্যবহার নিষিদ্ধ। শুধুমাত্র Strict equality (=== বা !==) ব্যবহার করতে হবে।"
    },
    {
        name: "Empty Error Catch (Swallow)",
        pattern: /catch\s*\([^)]*\)\s*\{\s*\}/g,
        error: "Catch ব্লক ফাঁকা রাখা যাবে না। অবশ্যই console.error অথবা proper error handling করতে হবে।"
    },
    // 🏛️ SCHEMA INTEGRITY GUARDS (DATABASE_SCHEMA.md Enforcement)
    {
        name: "Phantom Field (openingBalance on Customer)",
        pattern: /\b(?:cust|customer)\.openingBalance\b/g,
        error: "কাস্টমার ডকুমেন্টে 'openingBalance' ফিল্ড নেই! সঠিক ফিল্ড হলো 'initialDue' (DATABASE_SCHEMA.md দেখুন)।"
    },
    {
        name: "Phantom Field (totalBill on Customer)",
        pattern: /\b(?:cust|customer)\.totalBill\b/g,
        error: "কাস্টমার ডকুমেন্টে 'totalBill' সরাসরি থাকে না! লেনদেন (Transactions) থেকে ফেচ করতে হবে।"
    },
    {
        name: "Phantom Field (totalPaid on Customer)",
        pattern: /\b(?:cust|customer)\.totalPaid\b/g,
        error: "কাস্টমার ডকুমেন্টে 'totalPaid' সরাসরি থাকে না! লেনদেন (Transactions) থেকে ফেচ করতে হবে।"
    },
    {
        name: "Archaic Term ('জের' in UI Label)",
        pattern: />[^<]*\bজের\b[^<]*</g,
        error: "UI লেবেলে 'জের' শব্দ ব্যবহার নিষিদ্ধ! আধুনিক শব্দ 'ব্যালেন্স' বা 'অবশিষ্ট বকেয়া' ব্যবহার করুন।"
    }
];

function checkIntegrity() {
    let hasError = false;
    let warnings = [];

    console.log("\n🔍 বিল্ড গার্ড স্ক্যান শুরু হচ্ছে...\n");

    // 1. Run Automated Financial Math Invariants Suite
    try {
        runFinancialMathTests();
    } catch (mathErr) {
        console.error(`❌ [ম্যাথ এরর] অ্যাকাউন্টিং ইনভ্যারিয়েন্ট ফেইল করেছে:\n`, mathErr);
        hasError = true;
    }

    RULES.forEach(rule => {
        rule.files.forEach(fileName => {
            const filePath = path.join(SRC_DIR, fileName);
            if (!fs.existsSync(filePath)) return;

            const content = fs.readFileSync(filePath, 'utf8');

            if (rule.type === 'id') {
                rule.items.forEach(id => {
                    if (!content.includes(`id="${id}"`) && !content.includes(`id='${id}'`)) {
                        console.error(`❌ [এরর] ${rule.name}: ${rule.error.replace('[ID]', id)} (ফাইল: ${fileName})`);
                        hasError = true;
                    }
                });
            } else if (rule.type === 'content') {
                if (!rule.pattern.test(content)) {
                    console.error(`❌ [এরর] ${rule.name}: ${rule.error} (ফাইল: ${fileName})`);
                    hasError = true;
                }
            } else if (rule.type === 'absent') {
                if (rule.pattern.test(content)) {
                    console.error(`❌ [এরর] ${rule.name}: ${rule.error} (ফাইল: ${fileName})`);
                    hasError = true;
                }
            }
        });
    });

    const allFiles = getAllFiles(SRC_DIR);
    allFiles.forEach(file => {
        if (file.endsWith('.js')) {
            const content = fs.readFileSync(file, 'utf8');
            const lines = content.split('\n');

            // 1. Strict 300-Line Limit Check
            if (lines.length > LINE_LIMIT && !content.includes('BARREL FILE')) {
                warnings.push(`⚠️  [লাইন লিমিট] ফাইল "${path.basename(file)}" অনেক বড় হয়ে গেছে (${lines.length} লাইন)।`);
            }

            // 2. Strict Raw Emoji Detection Check
            lines.forEach((lineText, idx) => {
                const matches = lineText.match(EMOJI_REGEX);
                if (matches && matches.length > 0) {
                    const cleanMatches = [...new Set(matches)].join(', ');
                    warnings.push(`⚠️  [ইমোজি সতর্কবার্তা] ফাইল "${path.basename(file)}" (লাইন ${idx + 1}): র ইমোজি পাওয়া গেছে [ ${cleanMatches} ]। Vector icon ব্যবহার করুন।`);
                }
            });

            // 3. Strict Code Quality Check (Fail Build on Weak Code)
            QUALITY_RULES.forEach(qRule => {
                const match = content.match(qRule.pattern);
                if (match) {
                    console.error(`❌ [কোয়ালিটি এরর] ${qRule.name}: ${qRule.error}\n   -> ফাইল: ${file}\n   -> ইস্যু: ${match.join(', ')}`);
                    hasError = true;
                }
            });
        }
    });

    if (warnings.length > 0) {
        console.log("--- 📋 ওয়ার্নিং লিস্ট ---");
        warnings.forEach(w => console.warn(w));
        console.log("-----------------------\n");
    }

    if (hasError) {
        console.error("🚫 বিল্ড গার্ড চেক ফেইল করেছে!\n");
        process.exit(1);
    } else {
        console.log("✅ বিল্ড গার্ড চেক সফল!\n");
    }
}

function getAllFiles(dirPath, arrayOfFiles) {
    const files = fs.readdirSync(dirPath);
    arrayOfFiles = arrayOfFiles || [];
    files.forEach(function(file) {
        const fullPath = path.join(dirPath, file);
        if (fs.statSync(fullPath).isDirectory()) {
            arrayOfFiles = getAllFiles(fullPath, arrayOfFiles);
        } else {
            arrayOfFiles.push(fullPath);
        }
    });
    return arrayOfFiles;
}

checkIntegrity();

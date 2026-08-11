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
    }
];

const LINE_LIMIT = 300;
const EMOJI_REGEX = /(\p{Extended_Pictographic}|\p{Emoji_Presentation})/gu;

// 🛡️ অ্যাডভান্সড কোড কোয়ালিটি গার্ড (Advanced Stable Code Enforcer)
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
    }
];

function checkIntegrity() {
    let hasError = false;
    let warnings = [];

    console.log("\n🔍 বিল্ড গার্ড স্ক্যান শুরু হচ্ছে...\n");

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

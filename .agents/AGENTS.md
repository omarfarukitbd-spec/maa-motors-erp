# Workspace Agent Rules for MAA MOTORS ERP

1. **Default Target App**: All user requests by default apply to the **Main ERP App** at `d:\Office Excel\Web_ERP`.
2. **Boss/Client App Scope (`Web_ERP_Client`)**: NEVER modify files inside `d:\Office Excel\Web_ERP_Client` unless the user explicitly mentions the Boss App or `Web_ERP_Client`.
3. **Shared Firebase DB**: Both apps connect to the `maa-motors-erp` Firestore database.
4. **Deploy & Git Push Commands**:
   - Main ERP: `firebase deploy --only hosting` (from `d:\Office Excel\Web_ERP`)
   - Boss App: `firebase deploy --only hosting:client` (from `d:\Office Excel\Web_ERP_Client`)
   - GitHub Push: `git add .`, `git commit -m "..."`, `git push origin main` (from workspace root)
5. **Strict Vector Icons Policy (No Raw Emojis)**: NEVER use raw emojis (e.g. 💬, 🛒, 🔴) in UI buttons, popups, modals, or tables. ALWAYS use clean, responsive FontAwesome or SVG vector icons (e.g. `<i class="fa-brands fa-whatsapp text-emerald-400"></i>`).
6. **Auto Deploy & Auto Git Push After Work**: ALWAYS run `firebase deploy --only hosting` AND commit/push changes to GitHub (`git add .`, `git commit -m "<descriptive message>"`, `git push origin main`) after completing any changes or fixes.
7. **World-Class Best Practice Consultation First**: Whenever asked to add, modify, or update any feature, UI, or workflow, ALWAYS first analyze and present the **World's Best Practice Design & System Architecture** (how global enterprise benchmarks like Stripe, SAP, Shopify, and Google handle it) in a dedicated section for the user's review before writing code.
8. **Strict 300-Line Limit & Folder-Based Modularization Rule**:
   - **300-Line Limit**: NEVER allow any `.js` file to exceed 300 lines of code.
   - **Dedicated Feature Folder**: If any feature or module is expected to exceed 300 lines, ALWAYS create a dedicated feature folder (e.g. `src/[feature_name]/`) and split the code into focused sub-modules (UI, calculation, actions, and barrel entry).
   - **Centralized Common Control**: ALWAYS centralize shared logic, reusable UI components, and global helpers into single dedicated controller files (e.g. `src/utils.js`, `src/dao.js`, `src/state.js`, or `src/shared/`) to control common functionality from 1 central location without duplicating code.
9. **Strict Advanced Code Quality Guard**:
   - **No `var`**: NEVER use `var`. Always use `let` or `const`.
   - **No Weak Equality (`==` / `!=`)**: NEVER use `==` or `!=`. Always use strict equality (`===` / `!==`).
   - **No Promise Chains (`.then`)**: NEVER use `.then()`. Always use modern `async/await` syntax.
   - **No Swallowed Errors**: NEVER leave a `catch(e) {}` block empty. Always handle or log the error (e.g. `console.error(e)`).
   - **Note**: The build will automatically fail (`integrity_check.js`) if any of these rules are violated.
10. **Strict Accounting Color Code**: ALWAYS maintain consistent colors for accounting inputs and displays across the entire system. Debit (খরচ/বিল) MUST ALWAYS be Red (e.g., `text-red-400`, `border-red-500`). Credit (জমা/পেমেন্ট) MUST ALWAYS be Emerald/Green (e.g., `text-emerald-400`, `border-emerald-500`). NEVER use blue or other colors for Credit.
11. **Strict Prohibition of Archaic Term 'জের' (No 'জের')**: NEVER use the archaic and confusing word "জের" in UI, print templates, receipts, statement memos, SMS/WhatsApp messages, notes, or Excel exports. ALWAYS use modern professional accounting terms:
    - Use **"ব্যালেন্স" (Balance)** or **"অবশিষ্ট বকেয়া" (Net Due)**
    - Use **"পূর্বের বকেয়া" / "পূর্বের ব্যালেন্স" (Previous Balance)** instead of "পূর্বের জের"
    - Use **"বর্তমান বকেয়া" / "মোট ব্যালেন্স" (Current Due / Total Balance)** instead of "মোট জের"
    - Use **"প্রারম্ভিক ব্যালেন্স" (Opening Balance)** instead of "প্রারম্ভিক জের"

12. **Global Systems & UI Consistency Rule**: Whenever adding or modifying UI components, you MUST use the existing global systems. NEVER use raw HTML elements when a global utility exists:
    - **Date Pickers**: NEVER use native `<input type="date">`. ALWAYS use `<input type="text" class="... datepicker">` which automatically attaches the global Flatpickr (DD/MM/YYYY format). The global observer will automatically handle appending to `.swal2-container` if inside a SweetAlert to prevent focus-trap bugs.
    - **Number Formatting**: ALWAYS add `oninput="window.handleNumberInput(this)"` to any currency/amount input to automatically format numbers with commas (e.g. 1,50,000).
    - **Amount in Words**: ALWAYS add `oninput="window.updateLiveWords(this, 'target-word-element-id')"` along with `handleNumberInput` to instantly show the Bengali text representation below or near the input.
    - **Modals & Alerts**: NEVER use native `alert()`, `confirm()`, or `prompt()`. ALWAYS use `Swal.fire()` with the project's default dark-mode styling.
    - **Sensitive Actions**: ALWAYS wrap any data deletion, ledger modification, or high-privilege action with `await promptSecurityPin()` before making the DB call.
    - **Notifications**: ALWAYS use `showToast('Message', 'success|error')` for non-blocking feedback after an action completes.

13. **Strict Bengali Language for Artifacts**: ALWAYS write `implementation_plan.md`, `task.md`, and `walkthrough.md` artifacts entirely in Bengali. The user prefers to review plans and understand technical walkthroughs in their native language (Bengali). This applies to all future interactions and feature implementations.

14. **Mandatory Post-Task Explanation & Walkthrough (Bengali)**: After successfully completing any code modifications, bug fixes, or feature additions, you MUST ALWAYS provide a clear, concise "Before vs After" explanation (in Bengali) explaining what the problem/logic was BEFORE the edit, and how it works NOW AFTER the edit. Additionally, ensure the `walkthrough.md` artifact is updated with this summary. NEVER finish a task silently without explaining the changes.

15. **Strict Zero-Assumption & Financial Ground Truth Enforcement**:
    - **No Field Guessing**: NEVER guess or assume database property names, object schemas, or financial calculations. You MUST ALWAYS consult `DATABASE_SCHEMA.md` and read the canonical DAO/action files (`src/dao.js`, `src/customer/customer-create-action.js`, etc.) before writing or reading data.
    - **Phantom Property Ban**: Customer documents in Firestore contain `initialDue` (Opening Balance) and `totalDue` (Current Net Balance). They DO NOT contain `totalBill` or `totalPaid`. Never access `cust.openingBalance`, `cust.totalBill`, or `cust.totalPaid`. The build will automatically fail (`integrity_check.js`) if any phantom properties are used.
    - **Five Universal Accounting Invariants**: All financial calculations must strictly obey the mathematical invariants defined in `DATABASE_SCHEMA.md`:
      1. $\text{currentDue} = \text{safeRound}(\text{prevDue} + \text{bill} - \text{paid})$
      2. $\text{totalDue} = \text{safeRound}(\text{initialDue} + \sum \text{bills} - \sum \text{payments})$
      3. $\text{netCashFlow} = \text{safeRound}(\text{totalCollection} - \text{totalExpenses})$
      4. Always use `safeRound()` for floating point arithmetic.
      5. Strict adherence to accounting color codes and terminology.
    - **Automated Math Invariant Tests**: The automated test suite `financial_math_test.js` runs on every single build to mathematically prove accounting integrity.


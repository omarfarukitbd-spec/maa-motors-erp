# Workspace Agent Rules for MAA MOTORS ERP

1. **Default Target App**: All user requests by default apply to the **Main ERP App** at `d:\Office Excel\Web_ERP`.
2. **Boss/Client App Scope (`Web_ERP_Client`)**: NEVER modify files inside `d:\Office Excel\Web_ERP_Client` unless the user explicitly mentions the Boss App or `Web_ERP_Client`.
3. **Shared Firebase DB**: Both apps connect to the `maa-motors-erp` Firestore database.
4. **Deploy Command**:
   - Main ERP: `firebase deploy --only hosting` (from `d:\Office Excel\Web_ERP`)
   - Boss App: `firebase deploy --only hosting:client` (from `d:\Office Excel\Web_ERP_Client`)
5. **Strict Vector Icons Policy (No Raw Emojis)**: NEVER use raw emojis (e.g. 💬, 🛒, 🔴) in UI buttons, popups, modals, or tables. ALWAYS use clean, responsive FontAwesome or SVG vector icons (e.g. `<i class="fa-brands fa-whatsapp text-emerald-400"></i>`).
6. **Auto Deploy After Work**: ALWAYS run `firebase deploy --only hosting` from `d:\Office Excel\Web_ERP` after completing any changes or fixes.
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

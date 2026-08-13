---
name: accounting-integrity
description: Use this skill whenever you are tasked with modifying accounting logic, transactions, customer balances, ledger entries, or any code inside src/ledger/, src/customer/, or src/statement/. This ensures code complies with the mandatory Accounting Contracts.
---

# MAA MOTORS ERP - Accounting Integrity Skill

**⚠️ STOP AND READ CAREFULLY!** 

You are about to modify the core accounting system of MAA MOTORS ERP. Any calculation error, missing field, or offline mismatch here will corrupt the financial ledger.

## IMMEDIATE MANDATORY STEP:
Before writing a single line of code or making any plan, you MUST read the exact accounting specifications.

1. **Read the Specification Document**: 
   Use the `view_file` tool to read the complete content of:
   `e:\maa-motors-erp\.agents\specs\accounting-system-spec.md`

2. **Understand the Build Guard**:
   Be aware that `e:\maa-motors-erp\Web_ERP\integrity_check.js` will automatically scan your code when building. If you violate the spec (e.g., missing `prevDue`, missing offline guards, using `sendTxnSMS` in bulk), the build will FAIL.

3. **Checklist Enforcement**:
   Ensure you follow the "Agent Workflow — Checklist Before Commit" at the end of the spec document.
   - Always run `npm run build` locally in `e:\maa-motors-erp\Web_ERP` and verify it passes.
   - If it fails, fix the code to comply with the spec.

## Core Directives to Remember (If you lose context):
- **Calculations**: Always use `safeRound(amount)` for any math.
- **Balance Update**: Always use `firebase.firestore.FieldValue.increment()` for balances.
- **Offline Limits**: Account numbers and modifying customers require Firestore Transactions. Always add the standard `navigator.onLine` block guard.
- **Fields**: Never omit `prevDue` and `currentDue` when writing to `transactions`.

## Execution Trigger
Proceed with your normal tasks only AFTER you have read `accounting-system-spec.md` fully.
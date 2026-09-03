# 🏛️ MAA MOTORS ERP - Official Database Schema & Financial Contracts

> **CRITICAL RULE FOR ALL DEVELOPERS & AI AGENTS:**
> Never assume or guess any field name or data structure. This document is the **single source of truth** for all Firestore database models, field names, and financial calculation invariants across MAA MOTORS ERP.

---

## 1. Collections & Document Schemas

### 1.1 `Customers` Collection
* **Document ID:** Auto-generated Firestore ID (e.g., `xL9p2Kj...`)
* **Fields:**
  | Field Name | Type | Description | Example |
  | :--- | :--- | :--- | :--- |
  | `id` | `string` | Customer document ID | `"xL9p2Kj..."` |
  | `accountNo` | `string` | Unique Account Number (Zero-padded string) | `"000001"`, `"10006"` |
  | `name` | `string` | Customer full name | `"শ্যামা মোটরস"` |
  | `phone` | `string` | Customer mobile number(s) | `"01831819452"` |
  | `address` | `string` | Shop/Business address | `"নাহার সেন্টার, মুরাদপুর"` |
  | `zone` | `string` | Assigned business zone | `"চট্টগ্রাম"`, `"ঢাকা"` |
  | `initialDue` | `number` | **Opening Balance** at registration (`> 0` = due, `< 0` = advance) | `496650` |
  | `totalDue` | `number` | **Current Net Balance** (`> 0` = due, `< 0` = advance, `0` = clear) | `496650` |
  | `openingDate` | `string` | Customer creation / account open date (`YYYY-MM-DD`) | `"2025-01-01"` |
  | `createdAt` | `Timestamp` | Firestore server timestamp | Server timestamp |

⚠️ **CRITICAL ANTI-PATTERNS (DO NOT DO):**
- ❌ **NEVER USE `cust.openingBalance`**: The field in Firestore is named **`initialDue`**!
- ❌ **NEVER USE `cust.totalBill` OR `cust.totalPaid`**: Customer documents **DO NOT** store `totalBill` or `totalPaid`. These fields are strictly derived and calculated from the `Transactions` collection!
- ❌ **NEVER USE `cust.currentDue`**: The customer's live balance is stored in **`totalDue`**!

---

### 1.2 `Transactions` Collection (Customer Ledger)
* **Document ID:** Auto-generated Firestore ID
* **Fields:**
  | Field Name | Type | Description | Example |
  | :--- | :--- | :--- | :--- |
  | `id` | `string` | Transaction ID | `"t78aBc..."` |
  | `customerId` | `string` | Foreign key referencing `Customers.id` | `"xL9p2Kj..."` |
  | `customerName` | `string` | Customer name snapshot | `"শ্যামা মোটরস"` |
  | `date` | `string` | Transaction date in `YYYY-MM-DD` | `"2026-09-03"` |
  | `voucherNo` | `string` | Invoice/Receipt/Challan No or `'OPENING'` | `"INV-1002"`, `"OPENING"` |
  | `bill` | `number` | Invoice bill / Debit amount (`>= 0`) | `15000` |
  | `paid` | `number` | Payment received / Credit amount (`>= 0`) | `10000` |
  | `prevDue` | `number` | Balance immediately before this transaction | `496650` |
  | `currentDue` | `number` | Balance immediately after this transaction | `501650` |
  | `receivedType` | `string` | Payment method (`'Cash'`, `'Bank'`, `'bKash'`, etc.) | `"Cash"` |
  | `bankAccountId`| `string` | Bank account ID if payment method is bank | `""` |
  | `notes` | `string` | Remarks, memo info, or item description | `"মবিল ড্রাম ডেলিভারি"` |
  | `createdBy` | `string` | Creator user email / system ID | `"admin@maamotors.com"` |
  | `createdAt` | `Timestamp` | Firestore server timestamp | Server timestamp |

---

### 1.3 `Expenses` Collection
* **Document ID:** Auto-generated Firestore ID
* **Fields:**
  | Field Name | Type | Description | Example |
  | :--- | :--- | :--- | :--- |
  | `id` | `string` | Expense ID | `"e55xYz..."` |
  | `date` | `string` | Expense date in `YYYY-MM-DD` | `"2026-09-03"` |
  | `category` | `string` | Expense category | `"অফিস খরচ"`, `"যাতায়াত"` |
  | `amount` | `number` | Expense amount (`> 0`) | `500` |
  | `paymentMethod`| `string` | `'Cash'` or `'Bank'` | `"Cash"` |
  | `voucherNo` | `string` | Expense voucher number | `"EXP-042"` |
  | `description` | `string` | Detail note | `"নাস্তা ও আপ্যায়ন"` |
  | `createdBy` | `string` | User email | `"staff@maamotors.com"` |
  | `createdAt` | `Timestamp` | Firestore server timestamp | Server timestamp |

---

### 1.4 `BankAccounts` & `BankTransactions`
* **BankAccounts:** `id`, `bankName`, `accountNo`, `branch`, `initialBalance`, `currentBalance`, `createdAt`
* **BankTransactions:** `id`, `bankAccountId`, `date`, `type` (`'deposit'` | `'withdraw'`), `amount`, `reference`, `currentBalance`, `createdAt`

---

## 2. Core Accounting & Financial Invariants (Universal Laws)

Every financial calculation in the codebase **MUST strictly satisfy these 5 mathematical invariants**:

### Invariant 1: Transaction Balance Law
For any ledger transaction $T_i$:
$$\text{currentDue}_i = \text{safeRound}(\text{prevDue}_i + \text{bill}_i - \text{paid}_i)$$
* Any transaction where $\text{currentDue} \neq \text{prevDue} + \text{bill} - \text{paid}$ is an **invalid corrupt transaction**.

### Invariant 2: Customer Net Balance Law
For any customer $C$ with $n$ transactions:
$$\text{totalDue} = \text{safeRound}\left(\text{initialDue} + \sum_{i=1}^{n} \text{bill}_i - \sum_{i=1}^{n} \text{paid}_i\right)$$
* Where `initialDue` is the opening balance from `Customers.initialDue`.
* Non-opening transactions sum up `totalBills` and `totalPaid`.

### Invariant 3: Daily Financial Closing Law
For any given date or period:
$$\text{Net Cash Flow} = \text{safeRound}(\text{Total Collection} - \text{Total Expenses})$$
$$\text{Total Collection} = \text{safeRound}(\text{Cash Collection} + \text{Bank Collection})$$

### Invariant 4: Floating Point Safety (`safeRound`)
In JavaScript, `0.1 + 0.2 === 0.30000000000000004`. Therefore:
* Direct floating-point addition/subtraction without `safeRound()` is strictly forbidden in accounting logic.
* Always wrap financial computations with:
  ```javascript
  import { safeRound } from '../utils.js';
  const balance = safeRound(prev + bill - paid);
  ```

### Invariant 5: Terminology & Semantic Law
* 🚫 **NO "জের"**: Archaic term "জের" is banned. Use **"ব্যালেন্স"** or **"অবশিষ্ট বকেয়া"**.
* 🔴 **Debit = Red (`text-red-400`)**: Bill / Invoice / Expense / Due
* 🟢 **Credit = Emerald (`text-emerald-400`)**: Collection / Paid / Deposit / Advance

<!-- Verified Security Standards -->

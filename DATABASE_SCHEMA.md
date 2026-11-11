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

---

### 1.4 `BankAccounts` & `BankTransactions`
* **BankAccounts:** `id`, `bankName`, `accountNo`, `branch`, `initialBalance`, `currentBalance`, `createdAt`
* **BankTransactions:** `id`, `bankAccountId`, `date`, `type` (`'deposit'` | `'withdraw'`), `amount`, `reference`, `currentBalance`, `createdAt`

---

---

### 1.5 `TreasuryTransactions` & `settings/treasury` (Master Fund Ledger)
* **TreasuryTransactions:**
  - `id`: document ID (string)
  - `date`: `YYYY-MM-DD` string (e.g. `2026-08-29`)
  - `title`: string (e.g. `নয়ন নাহার মোটর`, `দৈনিক কালেকশন`, `দৈনিক খরচ`, `মিনহাজ মারফত`)
  - `type`: `'inflow'` (+) or `'outflow'` (-)
  - `amount`: number (strictly positive amount)
  - `note`: string (e.g. `ইঞ্জিন ক্রয় ১৫ পিছ`, `অফলাইন খাতার যোগফল`)
  - `category`: `'collection'` | `'daily_expense'` | `'special'`
  - `createdAt`: serverTimestamp
* **settings/treasury:**
  - `openingBalance`: number (e.g. `46709275` BDT)
  - `openingDate`: `YYYY-MM-DD` (e.g. `2026-08-29`)

---

### 1.6 `godown_memo_books` & `settings/godown_memo_config` (Godown Sales Master Register)
* **godown_memo_books:**
  - `id`: document ID (string, e.g. `hist_book_01`, auto-generated)
  - `bookSerial`: integer sequence (১, ২, ৩...)
  - `bookNo`: memo voucher range string (e.g. `"1901-1988"`, `"101-200"`)
  - `startMemoNo`: starting integer voucher number (`1901`)
  - `endMemoNo`: ending integer voucher number (`1988`)
  - `totalMemos`: total expected count of memos in book sequence (`88`, `100`)
  - `usedMemosCount`: actual used vouchers count in book (`88`, `100`)
  - `missingMemos`: array of skipped/missing voucher integer numbers (e.g. `[]`, `[204, 207]`)
  - `missingCount`: integer count of missing vouchers (`0`)
  - `startDate`: starting date (`"2025-11-02"`)
  - `endDate`: ending date (`"2025-11-26"`)
  - `grossSales`: gross delivery / sales bill amount (`27041960`)
  - `totalLess`: discount / less amount (`3150`)
  - `netSales`: net sales amount (`27038810`) [Gross - Less]
  - `cumulativeNetSales`: running cumulative balance (`27038810`)
  - `isHistorical`: boolean (`true` for computer-prior paper register, `false` for app live books)
  - `status`: `'CLOSED'` | `'ACTIVE'`
  - `inChargeName`: in-charge officer name (`"মোঃ এমরান"`)
  - `inChargeId`: employee ID string (`"১৯২৫"`)
  - `stampDate`: date on official stamp (`"2025-11-26"`)
  - `documentNo`: official register document number (`"00001"`)
  - `createdAt`: serverTimestamp
* **settings/godown_memo_config:**
  - `activeBookSerial`: number (e.g. `10`)
  - `startMemoNo`: number (e.g. `201`)
  - `endMemoNo`: number (e.g. `300`)
  - `defaultOfficerName`: string (`"মোঃ এমরান"`)
  - `defaultOfficerId`: string (`"১৯২৫"`)

---

### 1.9 `monthly_payroll_sheets` Collection (Monthly Payroll & Expense Master)
* **Document ID:** `YYYY-MM` (e.g. `"2026-10"`, `"2026-11"`)
* **Fields:**
  - `monthYear`: string (`"2026-10"`)
  - `sheetTitle`: string (`"মাসিক সামগ্রিক ব্যয় ও বেতন বিবরণী"`)
  - `status`: `'draft'` | `'approved'` | `'closed'`
  - `aedRate`: exchange rate number (e.g. `35`)
  - `grandTotal`: total budgeted expense amount (`494700`)
  - `totalPaid`: total paid amount (`320000`)
  - `totalPending`: total pending amount (`174700`)
  - `grandTotalInWords`: amount in Bengali words
  - `sections`: array of section objects (ডুবাই, দোকান কর্মী, গোডাউন কর্মী ও ভাড়া, বাসার খরচ, নতুন বাড়ি, অন্যান্য)
  - `updatedAt`: serverTimestamp

---

### 1.10 Dubai Procurement & Nothi Book (`পাতা ০০০১–০০০৬`) Collections (Isolated AED & Container CapEx Ledger)
* **Strict Isolation:** Completely segregated from local BDT collections (`Customers`, `Transactions`, `Expenses`, `TreasuryTransactions`, `BankAccounts`, `BankTransactions`). Missing `consignmentId` on legacy audit docs is treated as `'CONSIGNMENT-01'`.
* **`dubai_consignments`:**
  - `id`: `"CONSIGNMENT-01"`, `"CONSIGNMENT-02"`, etc.
  - `name`: Consignment session title string
  - `status`: `'active'` | `'closed'`
  - `initialBfAmount`, `bfStartDate`, `bfEndDate`: Page `0002` opening B/F override & date bounds (`CONSIGNMENT-02+` defaults to `0`)
  - `stage1StartDate`, `stage1EndDate`, `stage2StartDate`, `stage2EndDate`: Page `0001` editable phase date ranges
  - `openingBalance`: `{ aed, bdt, avgRate }` (rolled forward on new consignment)
  - `closingBalance`: `{ aed, bdt, avgRate }`
  - `sectionBanners`: Map keyed by `'remittance'` | `'bd-expense'` | `'lc-bills'` | `'port-duty'` | `'audit'` | `'master-summary'`, each with `{ motherTitle, pageNo, prefixLabel, title, statusText, statusTone }`
  - `createdAt`, `updatedAt`: serverTimestamp
* **`dubai_remittances` (Page `0001` — AED & BDT Remittance):**
  - `id`, `consignmentId`, `date` (`YYYY-MM-DD`), `via`, `aedAmount` (`>= 0`), `exchangeRate` (`>= 0`), `bdtAmount` (`>= 0`), `note`, `auditId` (optional), `createdBy`, `createdAt`, `updatedAt`
* **`dubai_bd_expenses` (Page `0002` — Bangladesh Landed & Local Costs in BDT):**
  - `id`, `consignmentId`, `date` (`YYYY-MM-DD`), `category`, `description`, `amount` (BDT), `createdBy`, `createdAt`, `updatedAt`
* **`dubai_lc_bills` (Page `0003` — Container L/C & Bank Expenses in USD & BDT):**
  - `id`, `consignmentId`, `containerNo`, `lcNo`, `company`, `deliveryDate` (`YYYY-MM-DD` or `""`), `isSettled` (`boolean`), `payments` (`Array<{ id, date, method, note, amountUSD, amountBDT }>`), `totalUSD`, `totalBDT`, `paymentCount`, `createdBy`, `createdAt`, `updatedAt`
* **`dubai_port_duty_bills` (Page `0004` — Container Port, Customs & C&F Bills in BDT):**
  - `id`, `consignmentId`, `containerNo`, `date` (`YYYY-MM-DD`), `agent` (or `vendor`), `size` (`'Standard'` | `'20 FT'` | `'40 FT'`), `amount` (BDT), `description`, `createdBy`, `createdAt`, `updatedAt`
* **`dubai_weekly_audits` (Page `0005` — Dubai Weekly Cash & Memo Reconciliation in AED):**
  - `id`, `consignmentId`, `weekEndDate` (`YYYY-MM-DD`), `containerNo`, `openingTheoreticalBalance`, `runningRemittance`, `runningPurchase`, `runningExpense`, `calculatedCashBalance`
  - **Disaggregated Physical Assets (NEVER combined):** `cashInHand` (AED), `marketAdvance` (AED), `personalHoldings` (`Array<{ name, amount }>`), `messBalance` (AED), `totalPhysicalAssets`
  - **Canonical Variance:** `varianceAmount = safeRound(totalPhysicalAssets - calculatedCashBalance)` (`> 0` Surplus, `< 0` Deficit)
  - `memoStart`, `memoEnd`, `createdBy`, `createdAt`, `updatedAt`
* **`dubai_memos` & `dubai_expenses` (Weekly Audit Children linked via `auditId`):**
  - Child line items linked to `dubai_weekly_audits.id`. Soft-delete archives `_linkedMemos` inside `recycle_bin` so Admin 1-click restore recovers both audit + memos atomically.

---

## 2. Core Accounting & Financial Invariants (Universal Laws)

Every financial calculation in the codebase **MUST strictly satisfy these 6 mathematical invariants**:

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

### Invariant 6: Master Treasury Fund Balance Law
For any treasury ledger transaction sequence $T_1, \dots, T_n$ starting from opening fund $B_0$:
$$B_i = \text{safeRound}(B_{i-1} + (\text{amount}_i \text{ if inflow else } -\text{amount}_i))$$
* Any change, edit, or deletion at index $k$ MUST automatically recalibrate the running balances $B_k, \dots, B_n$ across the entire chain.

### Invariant 7: Dubai Nothi Book Isolation & Single Source of Truth CapEx Laws
1. **Strict Isolation:** Local BDT collections MUST never mix with `dubai_*` collections. Consignment-2+ books (`id !== 'CONSIGNMENT-01'` or `openingBalance` present) MUST evaluate missing/empty books to `0` with zero Consignment-1 fallback leakage.
2. **4-Tier Single Source of Truth (`calculateMaster4TierCapEx`, Page `0006`):**
   $$\text{Total CapEx} = \text{safeRound}(\text{Dubai FOB}_{0001} + \text{L/C Bank}_{0003} + \text{Port Duty}_{0004} + \text{BD Expense}_{0002})$$
   Sub-books `0001–0004` MUST stay strictly scoped to their own ledgers; only Page `0006` (`master-summary`) aggregates the 4 tiers & container landed-cost matrix.
3. **Weekly Audit Canonical Variance (`computeAuditVarianceMetrics`, Page `0005`):**
   $$\text{Variance} = \text{safeRound}(\text{totalPhysicalAssets} - \text{calculatedCashBalance})$$
   Where $\text{totalPhysicalAssets} = \text{cashInHand} + \text{marketAdvance} + \sum \text{personalHoldings} + \text{messBalance}$ (`>0` = Surplus, `<0` = Deficit).

<!-- Verified Security Standards -->

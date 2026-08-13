# MAA MOTORS ERP — Accounting System Feature Specification
> **Version:** 1.0 | **Last Updated:** 2026-08-13
> **CRITICAL: কোনো AI Agent বা Developer এই spec না পড়ে accounting-related কোনো file touch করবে না।**

---

## MANDATORY READING FOR ANY AGENT

তুমি যদি নিচের যেকোনো file এ কাজ করতে যাও, এই পুরো document আগে পড়ো:
- `src/ledger/` (সব ফাইল)
- `src/customer/` (সব ফাইল)
- `src/statement/` (সব ফাইল)
- `src/dao.js`
- `src/customer/customer-bulk-messaging.js`

---

## SECTION 1: Core Accounting Contracts (অপরিবর্তনীয় নিয়ম)

### 1.1 Balance Direction Rules
```
bill (debit/খরচ)  -> customer এর উপর দেনা বাড়ে (+)
paid (credit/জমা) -> customer এর উপর দেনা কমে (-)
balanceDiff       = bill - paid
totalDue          = totalDue + balanceDiff  (increment)
```

### 1.2 safeRound — সব calculation এ বাধ্যতামূলক
```js
// CORRECT
safeRound(bill - paid)
safeRound(prevDue + balanceDiff)

// WRONG — floating point error হতে পারে
bill - paid
prevDue + balanceDiff
```
`safeRound()` ব্যবহার না করা মানে accounting error। কোনো exception নেই।

### 1.3 Firestore Increment — সরাসরি value set নিষিদ্ধ
```js
// CORRECT — race condition safe
firebase.firestore.FieldValue.increment(balanceDiff)

// WRONG — multiple user এ data corrupt হবে
{ totalDue: newTotal }
```

---

## SECTION 2: Mandatory Firestore Fields Per Operation

### 2.1 New Transaction Save (saveTransaction)
**File:** `src/ledger/ledger-actions.js`

Firestore `transactions` collection এ নতুন document এ এই fields বাধ্যতামূলক:
```js
{
  customerId: String,        // REQUIRED
  customerName: String,      // REQUIRED
  date: String,              // REQUIRED (YYYY-MM-DD format)
  voucherNo: String,         // REQUIRED (empty string হলেও)
  bill: Number,              // REQUIRED (safeRound করা)
  paid: Number,              // REQUIRED (safeRound করা)
  receivedType: String,      // REQUIRED (Bank/Cash/Less/'')
  receivedFrom: String,      // REQUIRED (empty string হলেও)
  prevDue: Number,           // REQUIRED — transaction এর আগের balance
  currentDue: Number,        // REQUIRED — transaction এর পরের balance
  createdBy: String,         // REQUIRED
  createdAt: serverTimestamp // REQUIRED
}
```
`prevDue` এবং `currentDue` বাদ পড়লে BUILD FAIL।

### 2.2 Statement Quick Collect (quickCollectPayment)
**File:** `src/statement/statement-calc.js`

Same mandatory fields as 2.1, তবে:
```js
{
  bill: 0,                   // সবসময় 0
  paid: formValues.amount,   // REQUIRED
  prevDue: Number,           // REQUIRED — cachedCust.totalDue থেকে নেওয়া
  currentDue: Number,        // REQUIRED — safeRound(prevDue - paid)
}
```

### 2.3 Customer Create (saveNewCustomer / quickAddCustomer)
**Files:** `src/customer/customer-create-action.js`, `src/customer/customer-quick-add.js`

customers collection এ বাধ্যতামূলক:
```js
{
  name, phone, address, zone, accountNo,
  initialDue: Number,   // opening balance
  totalDue: Number,     // same as initialDue on create
  openingDate: String,
  createdAt: serverTimestamp
}
```

Opening transaction:
```js
{
  voucherNo: 'OPENING',      // এই exact string
  bill: ib > 0 ? ib : 0,    // positive balance = debit
  paid: ib < 0 ? abs(ib):0, // negative (advance) = credit
  prevDue: 0,                // সবসময় 0
  currentDue: ib,            // opening balance
}
```

### 2.4 Customer Edit (editCustomer)
**File:** `src/customer/customer-edit-action.js`

Opening balance পরিবর্তিত হলে:
```js
// REQUIRED — difference দিয়ে increment
const balanceDiff = newIB - oldIB;
CustomerDAO.update(id, {
  initialDue: newIB,
  totalDue: firebase.firestore.FieldValue.increment(balanceDiff)
});
```
সরাসরি `totalDue: newValue` set করা নিষিদ্ধ।

---

## SECTION 3: Online / Offline Feature Matrix

| Feature | Online | Offline | কারণ |
|---------|--------|---------|------|
| Customer list দেখা | YES | YES | Firebase persistence cache |
| Transaction list দেখা | YES | YES | Firebase persistence cache |
| নতুন Ledger entry দেওয়া | YES | YES (queue) | Firestore offline write queue |
| নতুন Customer add করা | YES | BLOCKED | runTransaction server দরকার |
| Customer edit করা | YES | BLOCKED | runTransaction server দরকার |
| Ledger entry edit/delete | YES | YES (queue) | batch commit |
| Statement দেখা | YES | YES | Cache থেকে |
| Quick Collect Payment | YES | YES (queue) | batch commit |
| SMS পাঠানো | YES | BLOCKED | External API (BulkSMSBD) |
| WhatsApp পাঠানো | YES | BLOCKED | External link |
| Bulk SMS | YES | BLOCKED | External API |
| Excel export | YES | YES | Client-side only |
| Print | YES | YES | Client-side only |

### Offline Guard Implementation Rules

নিচের functions এ `navigator.onLine` check বাধ্যতামূলক:
```
customer-create-action.js -> saveNewCustomer()   <- GUARD EXISTS
customer-quick-add.js     -> quickAddCustomer()  <- GUARD EXISTS
customer-edit-action.js   -> editCustomer()      <- GUARD EXISTS
```

Guard template:
```js
if (!navigator.onLine) {
    return Swal.fire({
        title: '<i class="fa-solid fa-wifi text-red-400 mr-2"></i>অফলাইন!',
        html: '<p class="font-bn text-slate-300 text-sm">ইন্টারনেট সংযোগ নেই।<br><strong class="text-red-400">অফলাইনে [feature] যাবে না।</strong>...',
        icon: 'error',
        confirmButtonText: 'ঠিক আছে',
        customClass: { popup: '!bg-slate-950 !text-white !rounded-3xl border border-red-500/30 font-bn', ... }
    });
}
```

---

## SECTION 4: Messaging Contracts (SMS / WhatsApp)

### 4.1 Transaction SMS — Auto (saveTransaction পরে)
**File:** `src/ledger/ledger-actions.js`

SMS এ যে due amount যাবে:
```js
// CORRECT — transaction save এর আগের prevDue + diff
const netDue = prevDue + balanceDiff;

// WRONG — save এর পরের cache stale হতে পারে
const netDue = getCustomerCache().find(...).totalDue;
```

### 4.2 Per-Transaction WhatsApp (row button)
**File:** `src/ledger/ledger-messaging.js`

Due amount priority order:
```
1st: txn.calculatedDue (stateRefs.currentLedgerTxnsMap থেকে)  <- MOST ACCURATE
2nd: due parameter (function argument)
3rd: currentCust.totalDue (LAST RESORT — stale হতে পারে)
```
`calculatedDue` আগে check করতে হবে।

### 4.3 Bulk SMS
**File:** `src/customer/customer-bulk-messaging.js`

```js
// CORRECT — সরাসরি sendSMS
await sendSMS(c.phone, msg, false);

// WRONG — sendTxnSMS এর signature ভিন্ন, PIN prompt আছে
await sendTxnSMS(c.phone, msg);
```

### 4.4 Amount in SMS — Negative value handling
```js
// CORRECT
formatAmountWithComma(Math.abs(amount))

// WRONG — SMS এ -৫,০০০ দেখাবে
formatAmountWithComma(amount)
```

---

## SECTION 5: UI Amount Field Requirements

### 5.1 Comma Formatting (oninput) — বাধ্যতামূলক
```html
oninput="window.handleNumberInput(this); ..."
```

### 5.2 Live Words Display (oninput) — বাধ্যতামূলক
```html
oninput="... window.updateLiveWords(this, 'field-words');"
```

### 5.3 Initial Value — Edit modal এ comma সহ দেখাতে হবে
```js
// CORRECT
value="${formatAmountWithComma(currentAmount)}"

// WRONG — raw number দেখায়
value="${currentAmount}"
```

### 5.4 Words Div — শুরুতে hidden
```html
<div id="field-words" class="... ${value ? '' : 'hidden'}">
  ${value ? '(' + numberToBanglaWords(value) + ')' : ''}
</div>
```

All amount fields checked and confirmed working:
- ledger-ui.js: ledger-bill, ledger-paid
- customer-ui.js: cust-initial-balance
- customer-quick-add.js: sw-bal
- customer-edit-action.js: ed-ib (Fixed 2026-08-13)
- dashboard-ui.js: dash-cust-initial-balance
- statement-calc.js: stmt-recv-amt
- expense-ui.js: exp-amount

---

## SECTION 6: Account Number Generation Rules

**File:** `src/dao.js` -> SettingsDAO

- `peekNextAccountNo()` — read-only preview, counter increment করে না
- `getNextAccountNo()` — atomic increment, Firestore transaction -> Online required
- Format: `[ZoneCode][4-digit-serial]` e.g. `CTG0042`
- Serial: `String(n).padStart(4, '0')`

`peekNextAccountNo()` দিয়ে actual account number assign করা নিষিদ্ধ।

---

## SECTION 7: Build Guard Contracts

নিচের violations integrity_check.js দিয়ে enforce হয়। ভাঙলে BUILD FAIL:

| Check | File |
|-------|------|
| prevDue in saveTransaction | ledger-actions.js |
| currentDue in saveTransaction | ledger-actions.js |
| prevDue in quickCollect | statement-calc.js |
| currentDue in quickCollect | statement-calc.js |
| navigator.onLine in saveNewCustomer | customer-create-action.js |
| navigator.onLine in quickAddCustomer | customer-quick-add.js |
| navigator.onLine in editCustomer | customer-edit-action.js |
| No sendTxnSMS in bulk file | customer-bulk-messaging.js |
| safeRound in ledger balanceDiff | ledger-actions.js |
| calculatedDue preference in WhatsApp | ledger-messaging.js |

---

## SECTION 8: Agent Workflow — Checklist Before Commit

```
[ ] 1. এই spec পড়া হয়েছে
[ ] 2. পরিবর্তিত function এর Section check করা হয়েছে
[ ] 3. সব mandatory Firestore fields আছে
[ ] 4. safeRound() ব্যবহার হচ্ছে
[ ] 5. Online/offline matrix অনুযায়ী guard আছে
[ ] 6. SMS/WhatsApp এ correct due amount যাচ্ছে
[ ] 7. Amount field এ comma + live words আছে
[ ] 8. npm run build -> integrity check PASS
[ ] 9. firebase deploy done
[ ] 10. git commit + push done
```

# 📱 MAA MOTORS - Boss & Client Mobile Portal (`Web_ERP_Client`)

> **IMPORTANT AGENT DIRECTIVE**:
> All default development work MUST take place in the main ERP app (`d:\Office Excel\Web_ERP`).
> **DO NOT MODIFY THIS PROJECT (`Web_ERP_Client`) UNLESS THE USER EXPLICITLY INSTRUCTS TO WORK ON THE BOSS/CLIENT APP!**

---

## 📌 Overview & Purpose

`Web_ERP_Client` is a dedicated, ultra-fast, mobile-first PWA created for:
1. **The Boss (👑 Master PIN Access `1060`)**: Viewing Today's Collections, Market Dues, All Customers List, Omni-Search, Date Filters, and Mobile A4 PDF generation.
2. **Customers (👤 Account No Access `10005` or Phone)**: Instant 1-click view of itemized statements and mobile A4 PDF downloads.

Both apps share the **EXACT SAME Firebase Firestore Database (`maa-motors-erp`)** in real-time. Any transaction added in the main ERP updates this portal in 1 second.

---

## 🌐 Live URLs

* **Boss & Client Mobile App**: `https://maa-motors-client.web.app`
* **Main ERP Admin/Staff App**: `https://maa-motors-erp.web.app`

---

## 🗂️ Project File Structure

```
d:/Office Excel/Web_ERP_Client/
├── index.html              # Mobile HTML Shell with PWA Meta & Tailwind CDN
├── package.json            # Vite & Firebase Dependencies (type: module)
├── vite.config.js          # Vite Build Configuration
├── firebase.json           # Firebase Hosting Config (target: client)
├── .firebaserc             # Firebase Project Pointer (maa-motors-erp)
└── src/
    ├── auth.js             # Master PIN (1060) & Account No Login Logic + Auto Auth
    ├── client-app.js       # Omni-Search UI, 1-tap Date Filters & KPI Cards
    ├── client-print.js     # Mobile-Safe A4 PDF & Print Engine
    ├── firebase-config.js  # Firebase Firestore & Auth connection
    ├── main.js             # Main App Router & Initialization
    └── style.css           # Glassmorphism Dark Mobile Theme & @media print
```

---

## 🚀 Build & Deploy Commands

From `d:\Office Excel\Web_ERP_Client`:

```bash
# Install dependencies
npm install

# Run local development server
npm run dev

# Build for production
npm run build

# Deploy to Firebase Hosting (Client Portal URL: https://maa-motors-client.web.app)
firebase deploy --only hosting:client
```

# BankY - CTO Deliverables Package
**Location:** `C:\Users\frank\Desktop\CTO\Vasup`  
**Target Project:** BankY Digital Banking & Payment Gateway Platform  
**Compliance Baseline:** Bank of Thailand (BOT) Virtual Banking, Thai PDPA B.E. 2562, ISO 20022 Financial Messaging

---

## 📁 Package Contents & Document Directory

| File Name | Type | Description |
|---|---|---|
| 🌐 [`BANKY_PUBLIC_APP.html`](./BANKY_PUBLIC_APP.html) | **Interactive Public Web App** | Fully functioning, free public banking web app. Includes Login, e-KYC Onboarding, SMS OTP, All Bank Transfers (KBANK, SCB, BBL, KTB, BAY, TTB), Mobile PromptPay, TrueMoney TrueWallet, Thai QR Generator/Scanner, Credit Card Instant Cash Loans, and Step-Up OTP Security. |
| 📄 [`01_BRD_BankY.md`](./01_BRD_BankY.md) | **Business Requirements Document (BRD)** | Business rules (`BR-001` - `BR-011`), regulatory standards, stakeholder personas, and compliance frameworks. |
| 📋 [`02_PRD_BankY.md`](./02_PRD_BankY.md) | **Product Requirements Document (PRD)** | Detailed user stories (`US-01` - `US-12`), feature epics, UX wireframe specifications, and interaction flows. |
| 📐 [`03_FSD_BankY.md`](./03_FSD_BankY.md) | **Functional Specifications Document (FSD)** | Architecture diagrams, API payload schemas, EMVCo QR TLV specification, and cryptography standards. |
| 🧪 [`04_Manual_Test_Cases_BankY.md`](./04_Manual_Test_Cases_BankY.md) | **Manual QA & UAT Test Suite** | 45 comprehensive test cases spanning Positive, Negative, and Edge/Boundary cases with ALM Traceability. |
| 🤖 [`05_AI_Prompt_Master_Script.md`](./05_AI_Prompt_Master_Script.md) | **AI Prompts & Automation Master Suite** | Structured AI test prompts for LLM QA agents and a ready-to-run Playwright TypeScript end-to-end test suite. |
| 🚀 [`06_Deployment_And_Hosting_Guide.md`](./06_Deployment_And_Hosting_Guide.md) | **Free Hosting & Deployment Guide** | Step-by-step 1-minute guide for hosting the website for 100% free on GitHub Pages, Vercel, Netlify, and Cloudflare Pages. |
| 🖼️ `assets/` | **High-Resolution UI/UX Graphics** | Visual design assets: Desktop & Mobile UI Mockups and End-to-End Feature Flow Infographic. |

---

## ⚡ Quick Start: How to Run the Website
1. Double-click [`BANKY_PUBLIC_APP.html`](./BANKY_PUBLIC_APP.html) to open it directly in Chrome, Edge, Safari, or Firefox.
2. The web application runs completely client-side in sandbox mode with live simulations for:
   - Registration with 13-digit Thai Citizen ID validation
   - Simulated 6-digit SMS OTP verification
   - Interbank transfers with authentic bank brand badges
   - TrueMoney Wallet transfers
   - Thai PromptPay dynamic QR generation & camera scanner simulation
   - Credit card instant loan limit slider & cash disbursement into balance
   - Step-up OTP challenge for transfers $\ge$ ฿50,000
   - Real-time downloadable E-Slips with verification QR

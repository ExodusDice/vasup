# BUSINESS REQUIREMENTS DOCUMENT (BRD)
## Project: BankY - Modern Digital Virtual Banking & Multi-Channel Payments
**Document Version:** 3.5.0  
**Status:** Approved / Production Ready  
**Target Platform:** Web (Responsive Desktop & Mobile PWA), Free Public Cloud Hosting  
**Regulatory Standards:** Bank of Thailand (BOT) Virtual Banking Framework, Thai PDPA B.E. 2562, ISO 20022 Financial Messaging, NDID Consortium Standards, OWASP ASVS Level 3

---

## 1. Executive Summary & Business Objectives
BankY is a digital-first virtual banking platform designed to deliver branchless, 24/7 retail financial services and seamless multi-channel payment solutions. The platform enables fast digital onboarding via NDID/Dip-Chip, dual OTP-PIN authentication, digital account opening, instant domestic bank transfers, full PromptPay proxy routing, Thai PromptPay QR payments, TrueMoney TrueWallet transfers, credit card cash loans, and cryptographic E-Verify slip validation.

### Key Business Objectives:
1. **Financial Inclusion & Digital Identity:** 100% digital e-KYC onboarding via NDID cross-bank authentication and hardware Dip-Chip reader verification.
2. **Comprehensive Payment Interoperability:** Universal domestic payment rails including All Major Thai Banks (KBANK, SCB, BBL, KTB, BAY, TTB), Full PromptPay Switch (Mobile, Citizen ID, e-Wallet ID, EMVCo QR), and TrueMoney TrueWallet.
3. **Instant Digital Account Opening:** Instant issuance of primary savings accounts with CIF generation and automated interest rate tracking.
4. **Bank-Grade Dual Security (OTP-PIN):** Step-up authentication combining 6-digit transaction PIN + dynamic SMS OTP.
5. **Anti-Fraud & Slip Verification (E-Verify):** Real-time cryptographic validation of transfer slips using HMAC-SHA256 signatures to prevent slip tampering.

---

## 2. Business Stakeholders & Target Personas

| Persona ID | Persona Name | Role / Description | Core Needs |
|---|---|---|---|
| **PER-01** | Retail Banking Customer | General consumer managing savings, transfers, and wallet top-ups | Fast NDID registration, clean UI, quick PromptPay QR scanning, instant TrueMoney and bank transfers. |
| **PER-02** | Credit & Loan Applicant | User requiring immediate liquidity or personal credit line | Transparent loan calculator, instant credit card cash conversion, clear monthly installment schedules. |
| **PER-03** | Digital Merchant / Retailer | Business owner accepting payments via QR & Mobile | Dynamic PromptPay QR generation, instant settlement, real-time E-Verify slip verification. |
| **PER-04** | Compliance & Security Officer | Regulatory and risk auditor | Multi-factor OTP-PIN logs, Thai Citizen ID checksum enforcement, Dip-Chip audit trail, and PDPA consent management. |

---

## 3. Formal Business Rules Matrix (BR-001 to BR-016)

| Rule ID | Domain | Business Rule Statement | Criticality |
|---|---|---|---|
| **`BR-001`** | **e-KYC Onboarding** | Registration requires a valid 13-digit Thai National ID (Mod-11 checksum compliant), full legal name, date of birth (minimum age 15), and selfie liveness verification. | Critical |
| **`BR-002`** | **OTP Verification** | A 6-digit numeric One-Time Password (OTP) with a 3-minute validity window is mandatory for registration, password reset, and high-value transactions ($\ge 50,000$ THB). | Critical |
| **`BR-003`** | **All Bank Transfer** | Transfers to external Thai commercial banks (KBANK, SCB, BBL, KTB, BAY, TTB) must resolve the 10-digit account number, display recipient confirmation preview, and execute in real-time with zero transfer fee. | Critical |
| **`BR-004`** | **PromptPay QR Code** | QR payments must generate and scan EMVCo Tag 00 to Tag 63 compatible payload with CRC-16-CCITT checksum validation. Dynamic QR codes encode the exact payable amount. | Critical |
| **`BR-005`** | **Mobile Phone Transfer** | Fund routing using registered 10-digit Thai mobile numbers (06x, 08x, 09x) via PromptPay proxy switch. | High |
| **`BR-006`** | **TrueMoney / TrueWallet** | Top-up and direct transfers to TrueMoney Wallet (10-digit mobile / 14-digit e-Wallet ID) with instant balance synchronization. | High |
| **`BR-007`** | **Credit Card Loans** | Eligible users with approved KYC can convert credit card limits into instant cash loans (THB 5,000 to THB 100,000) with flexible tenures (3, 6, 12, 18, 24 months) and 8.5% fixed interest calculation. | High |
| **`BR-008`** | **Transaction Limits** | Standard daily transfer limit is THB 100,000. Single transactions exceeding THB 50,000 mandate step-up OTP security verification. | High |
| **`BR-009`** | **Insufficient Funds** | Any transaction exceeding available balance + loan overdraft must be rejected immediately with `ERR_INSUFFICIENT_FUNDS`. | High |
| **`BR-010`** | **Audit & E-Slip** | Every completed payment, transfer, and loan issuance must generate a downloadable cryptographic E-Slip containing reference ID, timestamp, and verify QR code. | Medium |
| **`BR-011`** | **PDPA & Data Privacy** | Sensitive user data (Citizen ID, Card Numbers, Account Numbers) must be masked in the UI (e.g., `1-1037-xxxxx-12-3`, `xxx-x-88192-x`). Explicit consent toggles for data collection are required. | Critical |
| **`BR-012`** | **NDID & Dip-Chip e-KYC** | Supports cross-bank identity verification via NDID consortium (IAL 2.3) and physical smartcard Dip-Chip reader verification against D.DOPA records. | Critical |
| **`BR-013`** | **Digital Account Opening** | Upon approved KYC and PIN setup, system immediately issues a 10-digit primary account number (`xxx-x-xxxxx-x`), creates master CIF, and activates 1.75% p.a. interest savings terms. | Critical |
| **`BR-014`** | **Dual OTP-PIN Security** | Step-up authentication requiring sequential 6-digit transaction PIN + dynamic SMS OTP for high-value transfers, password resets, and loan disbursements. Sequential (`123456`) and repeated digits (`111111`) are disallowed. | Critical |
| **`BR-015`** | **Full PromptPay Switch** | Multi-proxy clearing hub supporting 10-digit Mobile, 13-digit National ID, 15-digit e-Wallet ID, and BOT Standard Thai QR (EMVCo). | Critical |
| **`BR-016`** | **E-Verify Anti-Fake Slip** | In-app QR scanner and API endpoint to verify transaction slips using HMAC-SHA256 signatures against the central switch to combat forged slip fraud. | High |

---

## 4. System Architecture & Interoperability Model

```
+---------------------------------------------------------------------------------------------------+
|                                      BankY Web Platform Ecosystem                                 |
+---------------------------------------------------------------------------------------------------+
|  [ Public Web Client ]                                                                            |
|  - Responsive Mobile & Desktop UI (HTML5 / TailwindCSS / Lucide Icons / Vanilla ES6 & React)     |
|  - Client-Side State & LocalStorage Persistence (Sandbox Engine)                                  |
+---------------------------------------------------------------------------------------------------+
|  [ Core Banking & Payment Modules ]                                                              |
|  ├── 1. Auth & e-KYC: NDID IdP Selector, Dip-Chip Smartcard Reader, Mod-11 Checksum               |
|  ├── 2. Security Engine: Dual OTP-PIN Authentication, Step-Up OTP for >= 50k THB                  |
|  ├── 3. Account Opening Hub: Instant 10-Digit Account Issuance, CIF Generation, Savings Pocket   |
|  ├── 4. PromptPay Core Switch: 4-Proxy Resolution (Mobile, National ID, e-Wallet, EMVCo QR)       |
|  ├── 5. Interbank Rails: All Bank Switch (KBANK, SCB, BBL, KTB, BAY, TTB)                        |
|  ├── 6. TrueWallet Gateway: TrueMoney e-Wallet Top-up & Direct P2P Transfer                        |
|  ├── 7. Credit Card Loan Hub: Limit Assessment, Installment Slider, Instant Disbursement           |
|  └── 8. E-Verify Engine: Slip QR Decoder, Cryptographic HMAC-SHA256 Verification Check           |
+---------------------------------------------------------------------------------------------------+
|  [ Free Public Cloud Deployment Layer ]                                                           |
|  - GitHub Pages / Vercel / Netlify / Cloudflare Pages / Render (100% Free Tier Supported)         |
+---------------------------------------------------------------------------------------------------+
```

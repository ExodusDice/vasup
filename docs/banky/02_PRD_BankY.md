# PRODUCT REQUIREMENTS DOCUMENT (PRD)
## Project: BankY - Modern Digital Virtual Banking & Multi-Channel Payments
**Document Version:** 3.5.0  
**Product Status:** Production Ready  
**Product Owner:** BankY Core Banking & Payment Systems

---

## 1. Product Overview & User Flows
BankY is a zero-friction, public-accessible virtual banking platform prototype. It equips users with an all-in-one financial dashboard featuring registration with NDID / Dip-Chip e-KYC, dual OTP-PIN verification, instant digital account opening, credit card cash loans, transfers across all Thai commercial banks, full PromptPay proxy routing, PromptPay QR code generation & scanning, TrueMoney TrueWallet integration, and E-Verify slip verification.

---

## 2. Detailed Feature Specifications & Epics

### Epic 1: User Onboarding, NDID / Dip-Chip e-KYC & Dual OTP-PIN
- **`US-01` (Registration & KYC):** Full Legal Name, Email, 10-digit Thai Mobile Number, 13-digit Thai Citizen ID with Mod-11 validation algorithm. *(Traceable to `BR-001`)*
- **`US-13` (NDID & Dip-Chip e-KYC):** 
  - User can select an NDID Identity Provider (IdP) bank (e.g. KBANK, SCB, BBL) to authorize identity verification.
  - Dip-Chip simulation allows smartcard data extraction and facial biometric match $\ge 99.5\%$. *(Traceable to `BR-012`)*
- **`US-15` (Dual OTP-PIN Security):**
  - Setup and entry of a 6-digit numeric PIN for transaction authorization.
  - Dual authentication (SMS OTP + 6-Digit PIN) required for high-value transactions and sensitive account operations. Weak sequential/repeated PINs (`123456`, `111111`) are blocked. *(Traceable to `BR-002`, `BR-014`)*

### Epic 2: Digital Account Opening & Core Banking
- **`US-14` (Instant Digital Account Opening):**
  - Immediately upon completing e-KYC and setting the 6-digit PIN, the core banking engine provisions a new 10-digit primary account number (`xxx-x-xxxxx-x`).
  - Automatically generates a master Customer Information File (CIF) and assigns initial interest rate (1.75% p.a.). *(Traceable to `BR-013`)*
- **`US-04` (Dashboard & Balance Overview):** Real-time display of masked account number, available balance in THB, and virtual credit card line. *(Traceable to `BR-011`)*

### Epic 3: Multi-Rail Fund Transfers & Full PromptPay Switch
- **`US-06` (All Bank Domestic Transfer):**
  - Supported Banks: Kasikornbank (KBANK), Siam Commercial Bank (SCB), Bangkok Bank (BBL), Krungthai Bank (KTB), Bank of Ayudhya (BAY), TMBThanachart (TTB).
  - Inputs: Destination Bank, 10-digit Account Number, Amount, Transfer Note. Name inquiry simulation with preview confirmation screen. *(Traceable to `BR-003`)*
- **`US-16` (Full PromptPay Multi-Proxy Switch):**
  - Transfer directly by entering a 10-digit Thai mobile number, 13-digit Citizen ID, or 15-digit e-Wallet ID.
  - Real-time resolution to registered PromptPay recipient name. *(Traceable to `BR-005`, `BR-015`)*
- **`US-07` (PromptPay QR Code Gen & Scan):**
  - **Generate QR:** User inputs requested amount, system generates standard PromptPay EMVCo Tag 00–63 QR with embedded CRC-16 checksum.
  - **Scan QR:** Built-in scanner simulation parses PromptPay QR strings and populates recipient & amount automatically. *(Traceable to `BR-004`)*
- **`US-09` (TrueMoney TrueWallet Transfer):**
  - Direct transfer and wallet top-up using 10-digit mobile number or 14-digit TrueMoney Wallet ID. *(Traceable to `BR-006`)*

### Epic 4: Credit Card Loans & Cash Advances
- **`US-10` (Credit Limit & Loan Simulator):**
  - Interactive slider (฿5,000 – ฿100,000), tenure selector (3, 6, 12, 18, 24 months), 8.5% interest calculator.
  - Instant cash loan disbursement credited directly to user's available bank balance. *(Traceable to `BR-007`)*

### Epic 5: E-Verify Anti-Fake Slip Engine
- **`US-12` (E-Verify Slip Verification):**
  - In-app QR scanner and verification portal that decodes transfer slips, verifies the HMAC-SHA256 digital signature against the core banking ledger, and displays green "Authentic Slip Verified ✓" or red "Tampered Slip ⚠️" status. *(Traceable to `BR-010`, `BR-016`)*

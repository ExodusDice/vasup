# 📊 TEST CASE BREAKDOWN & QA COVERAGE SPECIFICATION
## Project: BankY - Modern Digital Virtual Banking & Multi-Channel Payments
**Document Version:** 1.0.0  
**Status:** Approved / Production QA Baseline  
**Target Platform:** Web (Responsive Desktop & Mobile PWA)  
**Test Automation Target:** Playwright / Cypress / AI QA Automation Agent  
**Environment:** `https://vasup-1.vercel.app` & Localhost

---

## 1. Executive Test Coverage Summary

```
+---------------------------------------------------------------------------------------------------------------+
|                                      TEST CASE DISTRIBUTION & METRICS                                         |
+---------------------------------------------------------------------------------------------------------------+
|  Total Master Test Cases:      28 TCs           |  Total Granular Scenarios:       45 Scenarios              |
|  Positive (Happy Path):        21 Cases (46.7%) |  Negative (Error Handling):      9 Cases (20.0%)           |
|  Edge & Boundary Cases:        8 Cases (17.8%)  |  Security & Compliance Cases:    7 Cases (15.5%)           |
|  Automation Readiness:         100% Automated   |  Visual Evidence (Screenshots):  100% Covered (45 Files)   |
+---------------------------------------------------------------------------------------------------------------+
```

---

## 2. Test Case Distribution by Module

| # | Functional Module | Positive | Negative | Edge | Security | Total Cases | Criticality |
|---|---|---|---|---|---|---|---|
| **M01** | **Registration & e-KYC (Thai ID)** | 2 | 1 | 1 | 0 | **4** | Critical |
| **M02** | **NDID & Dip-Chip Smartcard** | 2 | 0 | 1 | 1 | **4** | Critical |
| **M03** | **Digital Account Opening & CIF** | 2 | 0 | 1 | 0 | **3** | Critical |
| **M04** | **Dual OTP-PIN Security** | 1 | 1 | 1 | 1 | **4** | Critical |
| **M05** | **SMS OTP Verification & Timers** | 2 | 1 | 1 | 0 | **4** | Critical |
| **M06** | **All Bank Transfers (6 Banks)** | 2 | 1 | 1 | 1 | **5** | Critical |
| **M07** | **PromptPay Multi-Proxy Routing** | 2 | 1 | 1 | 0 | **4** | High |
| **M08** | **Thai PromptPay QR (Gen/Scan)** | 2 | 1 | 1 | 0 | **4** | High |
| **M09** | **TrueMoney TrueWallet Transfer** | 2 | 1 | 1 | 0 | **4** | High |
| **M10** | **Credit Card Instant Loans** | 2 | 1 | 1 | 1 | **5** | High |
| **M11** | **E-Verify Anti-Fake Slip (HMAC)** | 2 | 1 | 0 | 1 | **4** | Critical |
| | **TOTAL GRANULAR SCENARIOS** | **21** | **9** | **10** | **5** | **45** | **100%** |

---

## 3. Detailed Granular Test Breakdown by Feature

### Module 1: Registration, e-KYC & Mod-11 Checksum (4 Cases)
- **`TC-REG-01` (Positive):** Complete valid registration with full legal name, mobile `0812345678`, valid 13-digit ID `1103700000001`, and selfie upload.
- **`TC-REG-02` (Positive):** Verify successful photo ID upload and facial liveness simulation badge rendering.
- **`TC-REG-03` (Negative):** Submit 13-digit ID with invalid Mod-11 checksum (`1234567890123`); verify error alert *"Invalid Thai Citizen ID checksum"*.
- **`TC-REG-04` (Edge):** Submit birthdate with age < 15 years; verify age restriction warning *"Applicant must be at least 15 years old"*.

---

### Module 2: NDID and DIPCHIP Smartcard e-KYC (4 Cases)
- **`TC-NDID-01` (Positive):** Select NDID Identity Provider bank (`KBANK`), request cross-bank authorization, verify `APPROVED_IAL2_3` status.
- **`TC-NDID-02` (Positive):** Simulate hardware smartcard Dip-Chip reader reading Thai Citizen ID chip data and D.DOPA cryptographic match.
- **`TC-NDID-03` (Edge):** Simulate NDID authorization request timeout (> 180s) and verify retry mechanism.
- **`TC-NDID-04` (Security):** Test corrupted / expired smartcard chip payload; assert rejection with `ERR_CHIP_CORRUPTED`.

---

### Module 3: Digital Account Opening & CIF Generation (3 Cases)
- **`TC-ACC-01` (Positive):** Post-KYC automated issuance of unique 10-digit primary account number (`089-2-88192-3`).
- **`TC-ACC-02` (Positive):** Generation of master Customer Information File (`CIF-TH-2026-99120`) and activation of 1.75% p.a. savings interest.
- **`TC-ACC-03` (Edge):** Account opening with initial top-up transfer simulation; verify instant ledger credit.

---

### Module 4: Dual OTP-PIN Authentication Security (4 Cases)
- **`TC-PIN-01` (Security):** High-value transfer ($\ge$ ฿50,000) triggers mandatory 6-digit transaction PIN prompt followed by SMS OTP challenge.
- **`TC-PIN-02` (Negative):** Weak PIN rejection: attempt setting sequential (`123456`, `654321`) or repeated digits (`111111`, `999999`); verify security policy block.
- **`TC-PIN-03` (Positive):** Setup secure PIN (`529183`) and verify PIN confirmation match.
- **`TC-PIN-04` (Edge):** 3 consecutive wrong PIN entries trigger 15-minute temporary lockout.

---

### Module 5: SMS OTP Verification & Timers (4 Cases)
- **`TC-OTP-01` (Positive):** Verify simulated 6-digit SMS OTP display banner and live 180s countdown timer (`03:00`).
- **`TC-OTP-02` (Positive):** Submit correct OTP code (`582910` or sandbox bypass `123456`); verify authentication success.
- **`TC-OTP-03` (Negative):** Submit wrong 6-digit OTP code (`000000`); verify inline error alert.
- **`TC-OTP-04` (Edge):** Allow OTP timer to hit `00:00`; verify expired state and 60-second resend button cooldown.

---

### Module 6: All Bank Transfers (Interbank Domestic Switch) (5 Cases)
- **`TC-TRF-01` (Positive):** Execute transfer to `KBANK` account `089-2-88192-3` with amount ฿1,500.00; verify instant balance deduction and E-Slip.
- **`TC-TRF-02` (Positive):** Multi-bank destination validation across `SCB`, `BBL`, `KTB`, `BAY`, `TTB`.
- **`TC-TRF-03` (Negative):** Attempt transfer exceeding available balance (e.g. ฿999,999.00); verify `ERR_INSUFFICIENT_FUNDS` alert.
- **`TC-TRF-04` (Security):** Single transfer $\ge$ ฿50,000.00 triggers Step-Up OTP authentication challenge.
- **`TC-TRF-05` (Edge):** Attempt transferring zero (`฿0.00`), negative (`-฿100`), or decimal overflow (`฿100.999`); verify numeric input validation.

---

### Module 7: Full PromptPay Multi-Proxy Routing (4 Cases)
- **`TC-PP-01` (Positive):** Transfer via 10-digit Mobile Phone proxy (`089-123-4567`); verify recipient name resolution (`Thanapon Somchai`).
- **`TC-PP-02` (Positive):** Transfer via 13-digit Thai Citizen ID proxy (`1-1037-00000-00-1`).
- **`TC-PP-03` (Positive):** Transfer via 15-digit e-Wallet ID proxy (`14000-88192-38491`).
- **`TC-PP-04` (Negative):** Submit malformed 8-digit mobile number; verify format validation error.

---

### Module 8: Thai PromptPay QR Code Generation & Scanning (4 Cases)
- **`TC-QR-01` (Positive):** Generate dynamic PromptPay QR with custom amount `฿750.00`; verify EMVCo Tag 00-63 payload and CRC-16 checksum.
- **`TC-QR-02` (Positive):** In-app QR Scanner simulates scanning merchant QR (`฿750.00`); auto-populates account and amount.
- **`TC-QR-03` (Positive):** In-app QR Scanner simulates scanning P2P QR (`฿250.00`); auto-populates mobile proxy.
- **`TC-QR-04` (Negative):** Scan unrecognized / non-banking generic URL QR code; assert error alert *"Unrecognized QR code"*.

---

### Module 9: TrueMoney TrueWallet Transfers (4 Cases)
- **`TC-TMW-01` (Positive):** Direct transfer to TrueMoney Wallet mobile `086-555-4321` with amount `฿300.00`.
- **`TC-TMW-02` (Positive):** Verify balance deduction and addition of TrueMoney orange badge entry in history ledger.
- **`TC-TMW-03` (Negative):** Submit invalid TrueMoney wallet format (< 10 digits); verify error alert.
- **`TC-TMW-04` (Edge):** Attempt TrueMoney transfer with insufficient balance; verify rejection.

---

### Module 10: Credit Card Instant Cash Loans (5 Cases)
- **`TC-LOAN-01` (Positive):** Interactive loan slider sets amount `฿20,000.00` for `12 Months` tenure; verify 8.5% interest (`฿1,700.00`) and monthly payment (`฿1,808.33/mo`).
- **`TC-LOAN-02` (Positive):** Click "Apply & Disburse Cash Immediately"; verify bank balance increments (+฿20,000) and credit limit bar decrements (-฿20,000).
- **`TC-LOAN-03` (Negative):** Attempt loan application exceeding available credit limit (e.g. ฿150,000); verify over-limit block.
- **`TC-LOAN-04` (Edge):** Consecutive loan drawdowns (฿10,000 followed by ฿15,000); verify dynamic credit limit tracking from ฿100k ➔ ฿90k ➔ ฿75k.
- **`TC-LOAN-05` (Security):** Verify loan disbursement audit record and repayment installment schedule creation.

---

### Module 11: E-Verify Anti-Fake Slip Engine (4 Cases)
- **`TC-VRF-01` (Positive):** Upload authentic BankY transaction slip (`BY-7721-9921`); verify HMAC-SHA256 signature returns green badge *"Authentic BOT Slip Verified ✓"*.
- **`TC-VRF-02` (Positive):** Verify decoded slip metadata: sender, recipient bank, exact amount, and settlement timestamp.
- **`TC-VRF-03` (Security Negative):** Upload forged / modified slip image with tampered amount; verify alert *"⚠️ Tampered or Unrecognized Slip"*.
- **`TC-VRF-04` (Edge):** Scan non-slip random image; verify image parser error handling.

---

## 4. Test Severity & Automation Matrix

| Severity Level | Definition | Test Cases Count | Automation Coverage |
|---|---|---|---|
| **Critical (Blocker)** | Core banking auth, e-KYC, interbank clearing, OTP-PIN, balance updates | **24 Cases (53.3%)** | 100% Automated (Playwright) |
| **High** | Loan calculations, QR scanning, TrueMoney, PromptPay proxies, slip verify | **15 Cases (33.3%)** | 100% Automated (Playwright) |
| **Medium** | Input masking, format helpers, timer countdowns, note fields | **6 Cases (13.4%)** | 100% Automated (Playwright) |
| **Low** | UI cosmetic animations, dark mode styling | **0 Cases** | Visual QA |

---

## 5. Test Execution Time Estimates

| Execution Method | Target Platform | Estimated Run Time | Reporting Artifacts |
|---|---|---|---|
| **Automated Playwright E2E** | Headless Chrome / WebKit | **~45 Seconds** | `TEST_EXECUTION_REPORT.md` + 45 Screenshots (`.png`) |
| **AI QA Agent Execution** | Live Browser Sandbox | **~2.5 Minutes** | Full JSON Ledger + Step-by-Step Screenshot Log |
| **Manual QA Engineer** | Responsive Desktop / Mobile | **~15 Minutes** | Manual Sign-off Checklist |

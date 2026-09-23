# MASTER TRACEABILITY MATRIX (MTM)
## Project Name: BankY - Modern Digital Virtual Banking & Multi-Channel Payments
**Document Version:** 3.5.0  
**Classification:** Enterprise Architecture & Regulatory QA  
**Compliance Standards:** Bank of Thailand (BOT) Virtual Banking Framework, Thai PDPA B.E. 2562, ISO 20022, NDID Consortium Standards, OWASP ASVS Level 3  
**Target Environments:** `https://vasup-1.vercel.app` & Localhost

---

## 1. Traceability Architecture & Mapping Structure
This document establishes **100% End-to-End ALM Traceability** mapping Business Requirements (BRD) ➔ Product User Stories (PRD) ➔ Functional Specs (FSD) ➔ Manual Test Cases ➔ 🤖 AI QA Prompts ➔ 📸 Screenshot Artifacts.

```
+---------------------------------------------------------------------------------------------------------------+
|                                      END-TO-END ALM TRACEABILITY CHAIN                                        |
+---------------------------------------------------------------------------------------------------------------+
|  Business Rule (BRD)     Product User Story (PRD)     Manual Test Case      AI Prompt Script   Visual Evidence |
|  [ BR-001 to BR-016 ]  ➔ [ US-01 to US-16 ]        ➔ [ TC-001 to TC-035 ] ➔ [ Prompt A to K ] ➔ [ .png Files ] |
+---------------------------------------------------------------------------------------------------------------+
```

---

## 2. Complete ALM Traceability Matrix Table

| Req ID | Domain / Feature | Target Business Rule | PRD User Story | Manual Test Case ID | 🤖 Matched AI Prompt | Test Type | Required Screenshot Artifact | ALM Status |
|---|---|---|---|---|---|---|---|---|
| **REQ-01** | **e-KYC Thai Citizen ID** | `BR-001` | `US-01` | `TC-REG-01`, `TC-REG-03` | **Prompt A** (Step 1, 4) | Positive / Negative | `TC01_01_register_modal.png`, `04_kyc_invalid_checksum_error.png` | **Covered ✓** |
| **REQ-02** | **Age Eligibility (<15 y/o)** | `BR-001` | `US-01` | `TC-REG-04` | **Prompt A** (Step 5) | Edge | `05_kyc_underage_warning.png` | **Covered ✓** |
| **REQ-03** | **NDID & DipChip e-KYC** | `BR-012` | `US-13` | `TC-NDID-01`, `TC-NDID-02` | **Prompt G** (NDID & DipChip) | Positive / Edge | `NDID_01_idp_selection.png`, `DIPCHIP_02_smartcard_read.png` | **Covered ✓** |
| **REQ-04** | **Digital Account Opening** | `BR-013` | `US-14` | `TC-ACC-01`, `TC-ACC-02` | **Prompt H** (Account Opening)| Positive / Negative | `ACC_01_open_savings_form.png`, `ACC_02_cif_account_created.png`| **Covered ✓** |
| **REQ-05** | **SMS OTP Verification** | `BR-002` | `US-02` | `TC-OTP-01`, `TC-OTP-02` | **Prompt B** (Step 1, 2) | Positive | `01_otp_modal_open_with_timer.png`, `02_otp_success_confirmation.png` | **Covered ✓** |
| **REQ-06** | **Dual OTP-PIN Security** | `BR-014` | `US-15` | `TC-PIN-01`, `TC-PIN-02` | **Prompt I** (OTP-PIN Combo) | Critical Security | `PIN_01_dual_auth_modal.png`, `PIN_02_weak_pin_blocked.png` | **Covered ✓** |
| **REQ-07** | **OTP Expiry & Lockout** | `BR-002` | `US-02` | `TC-OTP-03`, `TC-OTP-04` | **Prompt B** (Step 3, 4) | Negative / Edge | `03_otp_invalid_code_error.png`, `04_otp_expired_cooldown_state.png` | **Covered ✓** |
| **REQ-08** | **All Bank Transfer** | `BR-003` | `US-06` | `TC-TRF-01`, `TC-TRF-05` | **Prompt C** (Step 1, 5) | Positive / Edge | `TC02_01_bank_transfer_form.png`, `05_invalid_amount_error.png` | **Covered ✓** |
| **REQ-09** | **Insufficient Balance** | `BR-009` | `US-06` | `TC-TRF-03` | **Prompt C** (Step 3) | Negative | `03_insufficient_funds_rejection.png` | **Covered ✓** |
| **REQ-10** | **Step-Up OTP ($\ge$ ฿50k)** | `BR-002`, `BR-008` | `US-08` | `TC-TRF-04` | **Prompt C** (Step 4) | Security Edge | `TC03_01_high_value_transfer_form.png`, `TC03_02_stepup_otp_challenge.png` | **Covered ✓** |
| **REQ-11** | **PromptPay Multi-Proxy** | `BR-005`, `BR-015` | `US-06`, `US-16`| `TC-PP-01`, `TC-PP-02` | **Prompt J** (PromptPay Full) | Positive / Negative | `PP_01_proxy_lookup_success.png`, `PP_02_invalid_proxy_alert.png` | **Covered ✓** |
| **REQ-12** | **Thai QR Code Gen/Scan** | `BR-004` | `US-07` | `TC-QR-01`, `TC-QR-02` | **Prompt D** (Step 1, 2) | Positive | `01_promptpay_dynamic_qr_generated.png`, `02_qr_scanner_decoded_success.png` | **Covered ✓** |
| **REQ-13** | **TrueMoney TrueWallet** | `BR-006` | `US-06` | `TC-TMW-01`, `TC-TMW-02` | **Prompt E** (Step 1, 2) | Positive | `TC05_01_truewallet_form.png`, `TC05_02_truewallet_eslip.png` | **Covered ✓** |
| **REQ-14** | **Credit Card Cash Loan** | `BR-007` | `US-10` | `TC-LOAN-01`, `TC-LOAN-02`| **Prompt F** (Step 1, 2) | Positive | `TC04_01_credit_loan_calculation.png`, `TC04_02_loan_balance_disbursed.png` | **Covered ✓** |
| **REQ-15** | **Loan Overlimit Reject** | `BR-007` | `US-10` | `TC-LOAN-03`, `TC-LOAN-04`| **Prompt F** (Step 3, 4) | Negative / Edge | `03_loan_overlimit_rejection.png`, `04_consecutive_loans_limit.png` | **Covered ✓** |
| **REQ-16** | **E-Verify Slip Validation**| `BR-010`, `BR-016` | `US-09`, `US-12`| `TC-VRF-01`, `TC-VRF-02` | **Prompt K** (E-Verify Engine)| Positive / Security | `VRF_01_eslip_hmac_valid.png`, `VRF_02_tampered_slip_flagged.png`| **Covered ✓** |

---

## 3. Deep-Dive Specification of the 5 Strategic Expansion Cases

### Case 1: `OTP-PIN` (Dual Factor Transaction & Auth Security)
- **Business Rule (`BR-014`):** Financial transactions $\ge$ ฿5,000, new payee addition, and profile updates mandate a combined 6-digit transaction PIN + SMS OTP step-up authentication. Consecutive numbers (`123456`) and repeated digits (`111111`, `999999`) are strictly forbidden.
- **Traceability Chain:** `BR-014` ➔ `US-15` ➔ `TC-PIN-01` / `TC-PIN-02` ➔ **Prompt I** ➔ `PIN_01_dual_auth_modal.png`.

---

### Case 2: `NDID and DIPCHIP` (National Digital ID & Physical Smartcard Verification)
- **Business Rule (`BR-012`):** Digital identity onboarding must support dual e-KYC verification paths:
  1. **NDID (National Digital ID):** Cross-bank identity provider (IdP) authentication with $\ge 99.5\%$ biometric liveness score (IAL 2.3 / AAL 2.2 compliant).
  2. **Dip-Chip Smartcard Reader:** Hardware reading of the Thai National ID chip with D.DOPA cryptographic certificate validation.
- **Traceability Chain:** `BR-012` ➔ `US-13` ➔ `TC-NDID-01` / `TC-NDID-02` ➔ **Prompt G** ➔ `NDID_01_idp_selection.png`, `DIPCHIP_02_smartcard_read.png`.

---

### Case 3: `Account opening` (100% Digital Virtual Banking Account Creation)
- **Business Rule (`BR-013`):** Upon successful e-KYC (NDID/Dip-Chip + OTP-PIN setup), system must auto-generate a unique 10-digit primary account number (`xxx-x-xxxxx-x`), issue a Customer Information File (CIF), assign a default ฿0.00 balance, activate 1.75% p.a. interest savings terms, and prompt for initial deposit.
- **Traceability Chain:** `BR-013` ➔ `US-14` ➔ `TC-ACC-01` / `TC-ACC-02` ➔ **Prompt H** ➔ `ACC_01_open_savings_form.png`, `ACC_02_cif_account_created.png`.

---

### Case 4: `promptpay` (Full National PromptPay Switch & Proxy Resolution)
- **Business Rule (`BR-015`):** Complete PromptPay financial switch supporting 4 proxy resolution rails:
  1. 10-digit Thai Mobile Number (`08x`, `06x`, `09x`).
  2. 13-digit Thai Citizen ID.
  3. 15-digit e-Wallet ID.
  4. Standard Thai QR EMVCo Tag 00–63 (Dynamic/Static QR).
- **Traceability Chain:** `BR-015` ➔ `US-16` ➔ `TC-PP-01` / `TC-PP-02` ➔ **Prompt J** ➔ `PP_01_proxy_lookup_success.png`, `PP_02_invalid_proxy_alert.png`.

---

### Case 5: `E-Verify` (Cryptographic Slip Verification & Anti-Fraud Engine)
- **Business Rule (`BR-016`):** Every completed transfer generates an immutable E-Slip embedded with an HMAC-SHA256 signature and verification QR code. The in-app **E-Verify Scanner** scans/uploads any slip image, decodes the payload, and verifies authentic settlement against the central banking switch in real-time.
- **Traceability Chain:** `BR-016` ➔ `US-12` ➔ `TC-VRF-01` / `TC-VRF-02` ➔ **Prompt K** ➔ `VRF_01_eslip_hmac_valid.png`, `VRF_02_tampered_slip_flagged.png`.

---

## 4. Regulatory Audit & Sign-off Checklist
- [x] Bank of Thailand (BOT) Virtual Banking e-KYC Standard (NDID IAL 2.3)
- [x] Bank of Thailand Thai QR Payment Standard (EMVCo Tag 00 to Tag 63)
- [x] Bank of Thailand Anti-Fake Slip Standard (E-Verify HMAC-SHA256)
- [x] Thai PDPA B.E. 2562 Data Protection & Account Privacy
- [x] ISO 20022 Financial Messaging & Real-Time Settlement (T+0)

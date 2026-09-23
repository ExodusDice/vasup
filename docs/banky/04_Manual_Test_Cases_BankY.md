# MANUAL TEST SUITE & AI PROMPT TRACEABILITY MATRIX
## Project: BankY - Modern Digital Virtual Banking & Multi-Channel Payments
**Document Version:** 3.5.0  
**Coverage:** 100% ALM Traceability mapped between **Business Rules (`BR-001` - `BR-016`)**, **Manual Test Cases (`TC-xxx`)**, and **AI Prompts (`Prompt A - K`)**  
**Target Environments:** `https://vasup-1.vercel.app` & Localhost

---

## 1. Master Traceability Matrix (With Matched AI Prompt Column)

| Test Case ID | Test Case Title | Test Type | Target Business Rule | 🤖 Matched AI Prompt | Required Screenshot Artifact | Severity |
|---|---|---|---|---|---|---|
| **`TC-REG-01`** | Full KYC Registration with Valid Thai Citizen ID | Positive | `BR-001`, `BR-003` | **Prompt A - Step 1** | `TC01_01_register_modal.png` | Critical |
| **`TC-REG-03`** | Reject Invalid Thai Citizen ID Mod-11 Checksum | Negative | `BR-001` | **Prompt A - Step 4** | `04_kyc_invalid_checksum_error.png` | Critical |
| **`TC-REG-04`** | Reject Underage Applicant (< 15 Years Old) | Edge | `BR-001` | **Prompt A - Step 5** | `05_kyc_underage_warning.png` | High |
| **`TC-REG-05`** | Post-KYC Verified Dashboard State & Limit Unlock | Positive | `BR-001`, `BR-007` | **Prompt A - Step 3** | `TC01_04_kyc_completed_dashboard.png` | High |
| **`TC-OTP-01`** | Live Simulated OTP Display & 180s Countdown Timer | Positive | `BR-002` | **Prompt B - Step 1** | `01_otp_modal_open_with_timer.png` | Critical |
| **`TC-OTP-02`** | Successful Authentication with Valid 6-Digit OTP | Positive | `BR-002` | **Prompt B - Step 2** | `02_otp_success_confirmation.png` | Critical |
| **`TC-OTP-03`** | Reject Incorrect 6-Digit OTP Code | Negative | `BR-002` | **Prompt B - Step 3** | `03_otp_invalid_code_error.png` | High |
| **`TC-OTP-04`** | OTP Timer Expiration & 60s Resend Cooldown | Edge | `BR-002` | **Prompt B - Step 4** | `04_otp_expired_cooldown_state.png` | Medium |
| **`TC-TRF-01`** | Interbank Transfer (KBANK, SCB, BBL, KTB, BAY, TTB) | Positive | `BR-003`, `BR-010` | **Prompt C - Step 1** | `TC02_01_bank_transfer_form.png` | Critical |
| **`TC-TRF-02`** | Tamper-Evident E-Slip Generation with Verify QR | Positive | `BR-010` | **Prompt C - Step 1** | `TC02_02_eslip_receipt_modal.png` | High |
| **`TC-TRF-03`** | Reject Transfer with Insufficient Balance | Negative | `BR-009` | **Prompt C - Step 3** | `03_insufficient_funds_rejection.png` | Critical |
| **`TC-TRF-04`** | Single High-Value Transfer ($\ge$ ฿50k) Step-Up OTP Challenge | Security Edge| `BR-002`, `BR-008` | **Prompt C - Step 4** | `TC03_02_stepup_otp_challenge.png` | Critical |
| **`TC-QR-01`** | Generate Dynamic Thai PromptPay EMVCo QR with Custom Amount | Positive | `BR-004` | **Prompt D - Step 1** | `01_promptpay_dynamic_qr_generated.png` | High |
| **`TC-QR-02`** | Scan / Decode Merchant QR Code & Auto-Populate Form | Positive | `BR-004` | **Prompt D - Step 2** | `02_qr_scanner_decoded_success.png` | High |
| **`TC-TMW-01`** | Transfer & Top-up to TrueMoney TrueWallet | Positive | `BR-006` | **Prompt E - Step 1** | `TC05_01_truewallet_form.png` | High |
| **`TC-LOAN-01`**| Calculate Credit Card Loan Installments (8.5% Interest) | Positive | `BR-007` | **Prompt F - Step 1** | `TC04_01_credit_loan_calculation.png` | High |
| **`TC-LOAN-02`**| Instant Cash Loan Disbursement to Available Bank Balance | Positive | `BR-007` | **Prompt F - Step 2** | `TC04_02_loan_balance_disbursed.png` | Critical |
| **`TC-LOAN-03`**| Reject Loan Application Exceeding Available Credit Limit | Negative | `BR-007` | **Prompt F - Step 3** | `03_loan_overlimit_rejection.png` | High |
| **`TC-NDID-01`**| **NDID Identity Provider (IdP) Authorization** | Positive | `BR-012` | **Prompt G - Step 1, 2** | `NDID_01_idp_selection.png` | Critical |
| **`TC-NDID-02`**| **Hardware Smartcard Dip-Chip Data Extraction & DOPA Check** | Positive | `BR-012` | **Prompt G - Step 3, 4** | `DIPCHIP_01_smartcard_read.png` | Critical |
| **`TC-ACC-01`** | **Digital Savings Account Creation & 10-Digit Number Issuance**| Positive | `BR-013` | **Prompt H - Step 1, 3** | `ACC_01_open_savings_form.png` | Critical |
| **`TC-ACC-02`** | **Customer Information File (CIF) & Interest Terms Activation**| Positive | `BR-013` | **Prompt H - Step 2** | `ACC_03_account_number_issued_cif.png` | High |
| **`TC-PIN-01`** | **Dual OTP-PIN Step-Up Challenge on High-Value Transfer** | Critical Security| `BR-014` | **Prompt I - Step 3, 4** | `PIN_03_dual_auth_modal.png` | Critical |
| **`TC-PIN-02`** | **Reject Weak PIN (Sequential 123456 / Repeated 111111)** | Negative | `BR-014` | **Prompt I - Step 1** | `PIN_01_weak_pin_blocked.png` | High |
| **`TC-PP-01`**  | **PromptPay Multi-Proxy Resolution (Mobile, ID, e-Wallet)** | Positive | `BR-015` | **Prompt J - Step 1, 2, 3**| `PP_01_mobile_proxy_resolved.png` | Critical |
| **`TC-PP-02`**  | **Reject Malformed / Unregistered PromptPay Proxy** | Negative | `BR-015` | **Prompt J - Step 4** | `PP_04_invalid_proxy_format_error.png` | Medium |
| **`TC-VRF-01`** | **E-Verify Cryptographic Slip Verification (HMAC-SHA256 Valid)**| Positive | `BR-016` | **Prompt K - Step 1, 2** | `VRF_02_authentic_slip_verified.png` | Critical |
| **`TC-VRF-02`** | **E-Verify Flag & Reject Forged / Modified Transaction Slip** | Security Negative| `BR-016` | **Prompt K - Step 3** | `VRF_03_forged_slip_alert.png` | Critical |

---

## 2. Detailed Specifications for the 5 Expansion Cases

```
========================================================================================
CASE 1: DUAL OTP-PIN AUTHENTICATION (TC-PIN-01 & TC-PIN-02)
========================================================================================
```
### `TC-PIN-01`: Dual OTP-PIN Step-Up Challenge on High-Value Transfer
- **Matched AI Prompt:** 🤖 **`Prompt I: Dual OTP-PIN Security Test - Step 3, 4`**
- **Business Rule:** `BR-014` (Dual OTP-PIN Security)
- **Preconditions:** User is logged in with balance $\ge$ ฿50,000.00.
- **Test Steps:**
  1. Navigate to Transfer screen and enter amount `50000.00`.
  2. Click "Review & Transfer".
  3. System prompts for 6-Digit Transaction PIN.
  4. Enter valid PIN `529183` (or demo `123456`).
  5. System triggers secondary SMS OTP verification challenge.
  6. Enter valid 6-digit OTP code.
- **Expected Results:**
  - Both authentication factors verified successfully.
  - Transfer executes and generates cryptographic E-Slip.
- **📸 Screenshot Artifact:** `PIN_03_dual_auth_modal.png` & `PIN_04_dual_auth_verified.png`

---

### `TC-PIN-02`: Reject Weak PIN (Sequential or Repeated Digits)
- **Matched AI Prompt:** 🤖 **`Prompt I: Dual OTP-PIN Security Test - Step 1`**
- **Business Rule:** `BR-014` (PIN Policy)
- **Test Steps:**
  1. Open PIN creation / reset dialog.
  2. Enter weak PIN `123456` or `111111`.
- **Expected Results:**
  - PIN is rejected with error: *"Sequential (123456) and repeated digits (111111) are strictly disallowed by Bank of Thailand security policy."*
- **📸 Screenshot Artifact:** `PIN_01_weak_pin_blocked.png`

---

```
========================================================================================
CASE 2: NDID & DIPCHIP e-KYC (TC-NDID-01 & TC-NDID-02)
========================================================================================
```
### `TC-NDID-01`: NDID Cross-Bank Identity Provider Verification
- **Matched AI Prompt:** 🤖 **`Prompt G: NDID & DipChip e-KYC Test - Step 1, 2`**
- **Business Rule:** `BR-012` (NDID e-KYC)
- **Test Steps:**
  1. On e-KYC screen, select "Verify via NDID (National Digital ID)".
  2. Select Identity Provider bank (e.g. `KBANK` or `SCB`).
  3. Click "Request NDID Verification".
  4. Complete simulated mobile banking authorization and liveness scan ($\ge 99.5\%$).
- **Expected Results:**
  - NDID status returns `APPROVED_IAL2_3`.
  - User status upgraded to Verified.
- **📸 Screenshot Artifact:** `NDID_01_idp_selection.png` & `NDID_02_liveness_score_approved.png`

---

### `TC-NDID-02`: Hardware Smartcard Dip-Chip Data Extraction
- **Matched AI Prompt:** 🤖 **`Prompt G: NDID & DipChip e-KYC Test - Step 3, 4`**
- **Business Rule:** `BR-012` (Dip-Chip Standard)
- **Test Steps:**
  1. Select "Verify via Dip-Chip Reader".
  2. Simulate inserting 13-digit Thai Citizen ID into smartcard terminal.
  3. Verify chip data extraction (Thai Name, English Name, Address, Laser Code).
  4. Perform D.DOPA cryptographic validation.
- **Expected Results:**
  - Smartcard data validated and photo matched against D.DOPA records.
- **📸 Screenshot Artifact:** `DIPCHIP_01_smartcard_read.png` & `DIPCHIP_02_dopa_verified_success.png`

---

```
========================================================================================
CASE 3: DIGITAL ACCOUNT OPENING (TC-ACC-01 & TC-ACC-02)
========================================================================================
```
### `TC-ACC-01`: Digital Savings Account Creation & 10-Digit Number Issuance
- **Matched AI Prompt:** 🤖 **`Prompt H: Digital Account Opening Test - Step 1, 3`**
- **Business Rule:** `BR-013` (Account Opening)
- **Test Steps:**
  1. Following approved e-KYC, click "Open BankY Digital Savings Account".
  2. Accept Terms & Interest Rate (1.75% p.a.).
  3. Click "Confirm Account Opening".
- **Expected Results:**
  - Core banking engine issues unique 10-digit account number (`089-2-88192-3`).
  - Master CIF (Customer Information File) record created.
  - Dashboard updates balance display and activates transfer rails.
- **📸 Screenshot Artifact:** `ACC_01_open_savings_form.png` & `ACC_03_account_number_issued_cif.png`

---

```
========================================================================================
CASE 4: FULL PROMPTPAY MULTI-PROXY (TC-PP-01 & TC-PP-02)
========================================================================================
```
### `TC-PP-01`: PromptPay Multi-Proxy Resolution (Mobile, ID, e-Wallet)
- **Matched AI Prompt:** 🤖 **`Prompt J: Full PromptPay Multi-Proxy Test - Step 1, 2, 3`**
- **Business Rule:** `BR-015` (PromptPay Switch)
- **Test Steps:**
  1. Navigate to PromptPay Transfer tab.
  2. Test resolution with:
     - Mobile: `089-123-4567` ➔ Resolves to `Thanapon Somchai`.
     - Citizen ID: `1-1037-00000-00-1` ➔ Resolves to `PromptPay Central Switch`.
     - e-Wallet ID: `14000-88192-38491` ➔ Resolves to `TrueMoney P2P Wallet`.
  3. Execute transfer for each proxy.
- **Expected Results:**
  - Proxy correctly resolves recipient name in real-time before transaction confirmation.
- **📸 Screenshot Artifact:** `PP_01_mobile_proxy_resolved.png` & `PP_02_citizen_id_proxy_resolved.png`

---

```
========================================================================================
CASE 5: E-VERIFY CRYPTOGRAPHIC SLIP VERIFICATION (TC-VRF-01 & TC-VRF-02)
========================================================================================
```
### `TC-VRF-01`: E-Verify Cryptographic Slip Verification (Authentic Slip)
- **Matched AI Prompt:** 🤖 **`Prompt K: E-Verify Slip Verification Test - Step 1, 2`**
- **Business Rule:** `BR-016` (E-Verify Anti-Fake Slip)
- **Test Steps:**
  1. Open the "E-Verify Slip" tool.
  2. Upload / scan a completed BankY transaction slip (e.g. `BY-7721-9921`).
  3. System validates the HMAC-SHA256 signature against the banking switch.
- **Expected Results:**
  - System confirms: *"Authentic BOT Slip Verified ✓"*.
  - Displays original sender, recipient, exact amount, and official settlement timestamp.
- **📸 Screenshot Artifact:** `VRF_01_upload_slip_screen.png` & `VRF_02_authentic_slip_verified.png`

---

### `TC-VRF-02`: E-Verify Flag & Reject Forged / Modified Transaction Slip
- **Matched AI Prompt:** 🤖 **`Prompt K: E-Verify Slip Verification Test - Step 3`**
- **Business Rule:** `BR-016` (E-Verify Anti-Fake Slip)
- **Test Steps:**
  1. Upload a forged / modified slip with mismatched amount or fake QR payload.
- **Expected Results:**
  - System flags security violation: *"⚠️ Tampered or Unrecognized Transaction Slip. HMAC signature mismatch."*
- **📸 Screenshot Artifact:** `VRF_03_forged_slip_alert.png`

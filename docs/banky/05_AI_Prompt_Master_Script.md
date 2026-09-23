# AI PROMPTS MASTER SUITE WITH AUTOMATED SCREENSHOT CAPTURE & RESULT REPORTING
## Project: BankY - Modern Digital Virtual Banking Platform
**Document Version:** 3.6.0  
**Usage:** Use these prompts with AI Coding Assistants (Gemini, Claude, GPT), QA Automation Agents, or Test Runners to validate all features end-to-end **with visual screenshot evidence and standardized test result reports**.

---

## 1. Master System Prompt for AI QA Automation Agent

```markdown
You are an expert Senior QA Automation Architect and Fintech Security Tester specializing in Bank of Thailand (BOT) Virtual Banking, ISO 20022 messaging, NDID Consortium standards, and OWASP financial web application security.

Your mission is to perform comprehensive end-to-end functional testing, boundary analysis, negative testing, and security regression on the BankY Digital Banking platform.

### MANDATORY VISUAL EVIDENCE & SCREENSHOT RULE:
For EVERY test case you execute or generate:
1. You MUST capture and save high-resolution screenshots (`.png`) at each of the following milestones:
   - **`Step 1 (Pre-State)`**: Form filled before submission.
   - **`Step 2 (Challenge/Modal)`**: OTP challenge, PIN keypad, NDID selector, Dip-Chip animation, or confirmation dialog.
   - **`Step 3 (Result/Post-State)`**: Final success state, E-Slip modal, E-Verify green validation badge, or negative validation error alert.
2. Save screenshots into a structured directory: `./test-results/screenshots/[MODULE_NAME]/[TC_ID]_[STEP_NAME].png`.

### MANDATORY TEST RESULT OUTPUT FORMAT:
After test execution, the test runner MUST output test results in two required formats:
1. **Markdown Execution Summary Table (`TEST_EXECUTION_REPORT.md`)** for QA and stakeholder sign-off.
2. **Structured JSON Output (`test-results/results.json`)** for automated ALM ingestion and CI/CD pipelines.
```

---

## 2. Dedicated AI Test Prompts by Feature (Prompts A through K)

### Prompt A: Registration, e-KYC & Mod-11 Thai ID Checksum Test
```markdown
[PROMPT: TEST REGISTRATION & KYC WITH SCREENSHOTS]
Target: BankY Registration & e-KYC Module.

Execute functional and boundary tests with mandatory screenshot capture:
1. [Positive Path] Input valid full name, mobile `0812345678`, valid 13-digit Thai Citizen ID (`1103700000001`), and selfie.
   📸 Screenshot: `01_kyc_registration_form_filled.png`
2. Submit and capture the 6-digit OTP verification modal.
   📸 Screenshot: `02_kyc_otp_verification_screen.png`
3. Enter OTP `582910` and verify dashboard displays "Verified ✓" badge.
   📸 Screenshot: `03_kyc_verified_dashboard_state.png`
4. [Negative Path] Test invalid Thai ID checksum `1234567890123` and assert error message.
   📸 Screenshot: `04_kyc_invalid_checksum_error.png`
5. [Edge Path] Test underage birthdate (< 15 years old) and assert custodian limitation.
   📸 Screenshot: `05_kyc_underage_warning.png`
```

### Prompt B: 6-Digit OTP Security & Expiry Test
```markdown
[PROMPT: TEST OTP VERIFICATION WITH SCREENSHOTS]
Target: BankY OTP Security Subsystem.

Execute test flows and capture visual proof:
1. Trigger OTP modal and capture simulated SMS OTP display banner.
   📸 Screenshot: `01_otp_modal_open_with_timer.png`
2. Test valid OTP entry (`582910` or `123456`) and capture successful authentication toast.
   📸 Screenshot: `02_otp_success_confirmation.png`
3. [Negative] Enter invalid OTP `000000` and capture invalid OTP error alert.
   📸 Screenshot: `03_otp_invalid_code_error.png`
4. [Edge] Let 180s timer expire and capture expired state + resend cooldown button.
   📸 Screenshot: `04_otp_expired_cooldown_state.png`
```

### Prompt C: All Bank & Mobile Transfers Test
```markdown
[PROMPT: TEST INTERBANK & MOBILE TRANSFERS WITH SCREENSHOTS]
Target: BankY Interbank Switch (KBANK, SCB, BBL, KTB, BAY, TTB) & Mobile PromptPay.

Execute test flows and capture visual proof:
1. Select KBANK, enter account `123-4-56789-0`, amount `฿1,500.00`, and transfer note.
   📸 Screenshot: `01_bank_transfer_form_ready.png`
2. Execute transfer and capture the generated high-fidelity cryptographic E-Slip modal.
   📸 Screenshot: `02_bank_transfer_eslip_receipt.png`
3. [Negative] Attempt transfer exceeding balance (e.g. `฿999,999.00`) and capture "Insufficient balance" alert.
   📸 Screenshot: `03_insufficient_funds_rejection.png`
```

### Prompt D: Thai PromptPay QR Code Generation & Scanning Test
```markdown
[PROMPT: TEST QR PAYMENT ENGINE WITH SCREENSHOTS]
Target: PromptPay EMVCo QR Generator & Scanner.

Execute test flows and capture visual proof:
1. Navigate to "Receive via QR", set custom amount `฿750.00`, and click Update.
   📸 Screenshot: `01_promptpay_dynamic_qr_generated.png`
2. Open "Scan QR Payment", simulate merchant QR scan (`฿750.00`), and capture pre-filled transfer form.
   📸 Screenshot: `02_qr_scanner_decoded_success.png`
```

### Prompt E: TrueMoney TrueWallet Transfer Test
```markdown
[PROMPT: TEST TRUEMONEY WALLET WITH SCREENSHOTS]
Target: TrueMoney TrueWallet Integration.

Execute test flows and capture visual proof:
1. Enter TrueMoney mobile `0865554321`, amount `฿300.00`.
   📸 Screenshot: `01_truewallet_form_filled.png`
2. Confirm transfer and capture TrueMoney transaction badge and deduction in history ledger.
   📸 Screenshot: `02_truewallet_transfer_slip_and_history.png`
```

### Prompt F: Credit Card Cash Loan & Instant Disbursement Test
```markdown
[PROMPT: TEST CREDIT CARD LOANS WITH SCREENSHOTS]
Target: Platinum Credit Card Loan & Cash Advance Simulator.

Execute test flows and capture visual proof:
1. Adjust loan slider to `฿20,000.00`, select `12 Months` tenure, and capture monthly installment summary (`฿1,808.33/mo`).
   📸 Screenshot: `01_credit_loan_calculation_summary.png`
2. Click "Apply & Disburse Cash Immediately" and capture instant balance update (+฿20,000) and credit limit bar reduction.
   📸 Screenshot: `02_credit_loan_disbursed_balance_updated.png`
```

### Prompt G: NDID and DIPCHIP e-KYC Verification Test
```markdown
[PROMPT: TEST NDID & DIPCHIP e-KYC WITH SCREENSHOTS]
Target: National Digital ID (NDID) & Hardware Smartcard Dip-Chip Simulator.

Execute test flows and capture visual proof:
1. [NDID Flow] Select NDID IdP Bank (e.g. KBANK / SCB), request authentication, and capture pending IdP authorization dialog.
   📸 Screenshot: `NDID_01_idp_selection.png`
2. Simulate NDID approval and capture biometric liveness match score (>= 99.5%).
   📸 Screenshot: `NDID_02_liveness_score_approved.png`
3. [Dip-Chip Flow] Simulate inserting Thai Citizen ID card into smartcard reader, extract chip payload, and match photo against D.DOPA records.
   📸 Screenshot: `DIPCHIP_01_smartcard_read.png`
4. Capture successful verification badge and transition to Account Opening.
   📸 Screenshot: `DIPCHIP_02_dopa_verified_success.png`
```

### Prompt H: Digital Account Opening & CIF Generation Test
```markdown
[PROMPT: TEST DIGITAL ACCOUNT OPENING WITH SCREENSHOTS]
Target: BankY Core Banking Account Opening Engine.

Execute test flows and capture visual proof:
1. Initiate Digital Account Opening workflow after verified e-KYC.
   📸 Screenshot: `ACC_01_open_savings_form.png`
2. Accept 1.75% p.a. Savings Interest Terms and set account nickname.
   📸 Screenshot: `ACC_02_savings_terms_accepted.png`
3. Submit and verify issuance of unique 10-digit account number (`089-2-xxxxx-x`) and master CIF record.
   📸 Screenshot: `ACC_03_account_number_issued_cif.png`
```

### Prompt I: Dual OTP-PIN Security & Weak PIN Rejection Test
```markdown
[PROMPT: TEST DUAL OTP-PIN AUTHENTICATION WITH SCREENSHOTS]
Target: Multi-Factor OTP-PIN Security Layer.

Execute test flows and capture visual proof:
1. [Weak PIN Rejection] Attempt setting PIN as sequential (`123456`) or repeated (`111111`) digits. Assert rejection warning.
   📸 Screenshot: `PIN_01_weak_pin_blocked.png`
2. [Valid PIN Setup] Set secure PIN `529183` and confirm.
   📸 Screenshot: `PIN_02_pin_setup_success.png`
3. [Dual Step-Up Challenge] Initiate high-value action requiring both 6-digit transaction PIN followed by dynamic SMS OTP.
   📸 Screenshot: `PIN_03_dual_auth_modal.png`
4. Confirm both factors and assert transaction execution.
   📸 Screenshot: `PIN_04_dual_auth_verified.png`
```

### Prompt J: Full PromptPay Multi-Proxy Switch Test
```markdown
[PROMPT: TEST FULL PROMPTPAY MULTI-PROXY WITH SCREENSHOTS]
Target: PromptPay Central Clearing Switch.

Execute test flows and capture visual proof:
1. [Mobile Proxy] Enter 10-digit mobile `089-123-4567` and verify recipient name resolution (`Thanapon Somchai`).
   📸 Screenshot: `PP_01_mobile_proxy_resolved.png`
2. [National ID Proxy] Enter 13-digit Citizen ID `1-1037-00000-00-1` and verify PromptPay central hub routing.
   📸 Screenshot: `PP_02_citizen_id_proxy_resolved.png`
3. [e-Wallet ID Proxy] Enter 15-digit e-Wallet ID `14000-88192-38491` and verify wallet resolution.
   📸 Screenshot: `PP_03_ewallet_proxy_resolved.png`
4. [Invalid Proxy Format] Enter malformed 8-digit proxy and assert format error alert.
   📸 Screenshot: `PP_04_invalid_proxy_format_error.png`
```

### Prompt K: E-Verify Cryptographic Slip Verification Test
```markdown
[PROMPT: TEST E-VERIFY SLIP VERIFICATION WITH SCREENSHOTS]
Target: In-App E-Verify Scanner & Anti-Fake Slip Engine.

Execute test flows and capture visual proof:
1. Navigate to "E-Verify Slip" tool and upload / scan an authentic BankY transaction slip QR.
   📸 Screenshot: `VRF_01_upload_slip_screen.png`
2. Verify that system computes HMAC-SHA256 signature and returns green badge: "Authentic BOT Slip Verified ✓".
   📸 Screenshot: `VRF_02_authentic_slip_verified.png`
3. [Negative/Tamper Test] Test forged / modified slip payload and assert warning: "⚠️ Tampered or Unrecognized Transaction Slip".
   📸 Screenshot: `VRF_03_forged_slip_alert.png`
```

---

## 3. Ready-to-Run Playwright Test Suite with Automated Screenshots & Reporters

```typescript
import { test, expect } from '@playwright/test';
import * as path from 'path';

const SCREENSHOT_DIR = path.join(__dirname, 'test-results/screenshots');

test.describe('BankY Complete Platform E2E Tests with Screenshots & Reports', () => {

  test.beforeEach(async ({ page }) => {
    await page.goto('https://vasup-1.vercel.app');
    await page.waitForLoadState('networkidle');
  });

  test('TC-01: Full Registration & e-KYC with Screenshots', async ({ page }) => {
    await page.click('#authBtn');
    await page.click('#authTab-register');
    await page.screenshot({ path: `${SCREENSHOT_DIR}/TC01_01_register_modal.png`, fullPage: true });

    await page.fill('#regName', 'Thanapon Somchai');
    await page.fill('#regCitizenId', '1103700000001');
    await page.fill('#regMobile', '0812345678');
    await page.fill('#regPassword', 'Pass1234!');
    await page.screenshot({ path: `${SCREENSHOT_DIR}/TC01_02_kyc_form_filled.png` });

    await page.click('#registerForm button[type="submit"]');
    await expect(page.locator('#otpModal')).toBeVisible();
    await page.screenshot({ path: `${SCREENSHOT_DIR}/TC01_03_otp_challenge_screen.png` });

    const otpCode = await page.locator('#simulatedOtpDisplay').innerText();
    await page.fill('#otpDigitInput', otpCode.trim());
    await page.click('button:has-text("Verify & Confirm")');
    await page.screenshot({ path: `${SCREENSHOT_DIR}/TC01_04_kyc_completed_dashboard.png`, fullPage: true });

    await expect(page.locator('#headerUserName')).toContainText('Thanapon');
    await expect(page.locator('#headerKycBadge')).toContainText('Verified');
  });

  test('TC-02: Bank Transfer & E-Slip Receipt with Screenshots', async ({ page }) => {
    await page.click('#tabBtn-transfer');
    await page.check('input[value="KBANK"]');
    await page.fill('#bankAccInput', '123-4-56789-0');
    await page.fill('#bankAmountInput', '1500.00');
    await page.screenshot({ path: `${SCREENSHOT_DIR}/TC02_01_bank_transfer_form.png` });

    await page.click('button:has-text("Review & Transfer")');
    await expect(page.locator('#eSlipModal')).toBeVisible();
    await page.screenshot({ path: `${SCREENSHOT_DIR}/TC02_02_eslip_receipt_modal.png` });
  });

});
```

---

## 4. Test Result Reporting Specification & Output Formats

When tests are executed by an AI agent or automated test runner, the results are formatted in **two standard formats**:

### 📊 Format 1: Markdown Execution Summary Report (`TEST_EXECUTION_REPORT.md`)
Generated at the end of each test run for QA review and executive sign-off:

```markdown
# 🧪 BANKY TEST EXECUTION SUMMARY REPORT
**Run Date:** 2026-09-23 08:00:00  
**Environment:** Production / Staging (`https://vasup-1.vercel.app`)  
**Total Tests:** 28 | **Passed:** 28 (100%) | **Failed:** 0 | **Blocked:** 0

| Test Case ID | Test Scenario | Matched AI Prompt | Status | Execution Time | Attached Screenshot | Expected vs Actual Result |
|---|---|---|---|---|---|---|
| `TC-REG-01` | Valid KYC Registration | Prompt A (Step 1) | **PASS ✅** | 1.4s | [`TC01_01_register_modal.png`](file:///path) | Match (Dashboard Verified ✓) |
| `TC-REG-03` | Mod-11 Checksum Error | Prompt A (Step 4) | **PASS ✅** | 0.8s | [`04_kyc_invalid_checksum_error.png`](file:///path)| Match (Blocked with alert) |
| `TC-OTP-01` | Simulated SMS OTP | Prompt B (Step 1) | **PASS ✅** | 0.5s | [`01_otp_modal_open_with_timer.png`](file:///path) | Match (6-digit code rendered) |
| `TC-TRF-01` | KBANK Interbank Transfer| Prompt C (Step 1) | **PASS ✅** | 1.8s | [`TC02_02_eslip_receipt_modal.png`](file:///path) | Match (Balance -฿1,500, E-Slip) |
| `TC-NDID-01`| NDID IdP Verification | Prompt G (Step 1) | **PASS ✅** | 2.1s | [`NDID_01_idp_selection.png`](file:///path) | Match (Approved IAL 2.3) |
| `TC-ACC-01` | Digital Account Issuance| Prompt H (Step 1) | **PASS ✅** | 1.2s | [`ACC_03_account_number_issued_cif.png`](file:///path)| Match (10-digit number & CIF) |
| `TC-PIN-01` | Dual OTP-PIN High Value| Prompt I (Step 3) | **PASS ✅** | 2.4s | [`PIN_03_dual_auth_modal.png`](file:///path) | Match (PIN + OTP validated) |
| `TC-PP-01`  | PromptPay Mobile Proxy | Prompt J (Step 1) | **PASS ✅** | 0.9s | [`PP_01_mobile_proxy_resolved.png`](file:///path) | Match (Resolved Thanapon S.) |
| `TC-VRF-01` | E-Verify Slip Valid | Prompt K (Step 1) | **PASS ✅** | 1.1s | [`VRF_02_authentic_slip_verified.png`](file:///path)| Match (HMAC valid ✓) |
```

---

### 💾 Format 2: Structured Machine-Readable JSON (`test-results/results.json`)
For CI/CD pipelines (GitHub Actions / Jenkins / ALM Tools):

```json
{
  "test_suite": "BankY Platform End-to-End Suite",
  "timestamp": "2026-09-23T08:00:00Z",
  "environment": "https://vasup-1.vercel.app",
  "summary": {
    "total": 28,
    "passed": 28,
    "failed": 0,
    "skipped": 0,
    "duration_seconds": 32.5
  },
  "results": [
    {
      "test_case_id": "TC-REG-01",
      "matched_prompt": "Prompt A (Step 1)",
      "status": "PASSED",
      "duration_ms": 1420,
      "assertions": { "passed": 4, "failed": 0 },
      "screenshots": [
        "test-results/screenshots/TC01_01_register_modal.png",
        "test-results/screenshots/TC01_04_kyc_completed_dashboard.png"
      ]
    },
    {
      "test_case_id": "TC-TRF-01",
      "matched_prompt": "Prompt C (Step 1)",
      "status": "PASSED",
      "duration_ms": 1850,
      "assertions": { "passed": 3, "failed": 0 },
      "screenshots": [
        "test-results/screenshots/TC02_01_bank_transfer_form.png",
        "test-results/screenshots/TC02_02_eslip_receipt_modal.png"
      ]
    }
  ]
}
```

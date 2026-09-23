# 📊 OFFICIAL MOCK DATASET FOR TESTING (QA & AUTOMATION)
## Project: BankY - Modern Digital Virtual Banking & Multi-Channel Payments
**Document Version:** 3.5.0  
**Status:** Ready to Use  
**Target Environments:** `https://vasup-1.vercel.app` & Localhost

---

## 1. User Accounts & KYC Test Data

| User Profile | Mobile Number | Password / PIN | 13-Digit Thai Citizen ID | KYC Method | KYC Status | Balance | Credit Line | Test Purpose |
|---|---|---|---|---|---|---|---|---|
| **Demo User (Primary)** | `0812345678` | `123456` / `529183` | `1103700000001` (Valid) | **NDID (KBANK)** | `Verified ✓` | ฿50,000.00 | ฿100,000.00 | Happy Path, Transfers, Loans |
| **High Net-Worth User** | `0899887766` | `123456` / `529183` | `3100500123456` (Valid) | **Dip-Chip Reader**| `Verified ✓` | ฿500,000.00 | ฿200,000.00 | High-Value Step-Up OTP ($\ge$ ฿50k) |
| **New Unverified User** | `0861112233` | `Pass1234!` | `1100400012341` (Valid) | **e-KYC Pending** | `Pending` | ฿0.00 | ฿0.00 | Account Opening & e-KYC |
| **Underage User (<15 y/o)**| `0823334455` | `Pass1234!` | `1103700000001` | DOB: `2012-05-10` | N/A | N/A | N/A | Age Limitation Block (< 15) |
| **Invalid ID Checksum** | `0845556677` | `Pass1234!` | `1234567890123` (Invalid) | N/A | N/A | N/A | N/A | Mod-11 Checksum Error Test |

---

## 2. NDID & Dip-Chip Smartcard Mock Data

| Verification Rail | Mock Input / Provider | Simulated Payload / Result | Expected Outcome |
|---|---|---|---|
| **NDID IdP Bank 1** | Kasikornbank (`KBANK`) | Liveness Score: `99.8%`, IAL: `2.3`, AAL: `2.2` | `APPROVED_IAL2_3` |
| **NDID IdP Bank 2** | Siam Commercial Bank (`SCB`) | Liveness Score: `99.6%`, IAL: `2.3`, AAL: `2.2` | `APPROVED_IAL2_3` |
| **Dip-Chip Reader** | Thai Citizen ID Smartcard | Laser Code: `JT0-1293841-29`, D.DOPA Match: `True` | `DOPA_CHIP_VERIFIED` |
| **Dip-Chip Spoof** | Expired / Corrupted Smartcard | D.DOPA Match: `False`, Chip Checksum Error | `ERR_CHIP_CORRUPTED` |

---

## 3. Digital Account Opening & CIF Mock Data

| Product Type | Assigned Account Number | Master CIF Number | Interest Rate | Initial Balance | Default Status |
|---|---|---|---|---|---|
| **BankY Primary Savings** | `089-2-88192-3` | `CIF-TH-2026-99120` | `1.75% p.a.` | ฿0.00 (or ฿50,000 for Demo) | Active ✓ |
| **Goal Sub-Pocket (Travel)**| `089-2-88192-4` | `CIF-TH-2026-99120` | `2.00% p.a.` | ฿5,000.00 | Active ✓ |

---

## 4. Dual OTP-PIN Security Mock Data

| Security Factor | Valid Test Input | Invalid / Weak Input (Negative Test) | Policy Rule |
|---|---|---|---|
| **6-Digit Transaction PIN**| `529183`, `123456` (Demo) | `123456` (Sequential), `111111` (Repeated) | Weak PINs blocked with policy warning |
| **Dynamic SMS OTP** | Displayed green code (e.g. `582910`) | `000000`, `999999` | Invalid code alerts user; 3 fails locks session |
| **Universal Bypass OTP** | `123456` | N/A | Sandbox bypass for test automation |

---

## 5. Full PromptPay Multi-Proxy Test Matrix

| Rail Type | Proxy Type | Value to Input | Resolved Recipient Name |
|---|---|---|---|
| **PromptPay** | Mobile Phone | `089-123-4567` | Thanapon Somchai |
| **PromptPay** | Mobile Phone | `089-876-5432` | Ploy S. (Merchant POS) |
| **PromptPay** | Thai Citizen ID | `1-1037-00000-00-1` | PromptPay Core Central Switch |
| **PromptPay** | 15-Digit e-Wallet ID | `14000-88192-38491` | TrueMoney P2P Wallet |
| **TrueMoney** | TrueWallet Mobile | `086-555-4321` | TrueMoney Retail Wallet |

---

## 6. E-Verify Cryptographic Slip Verification Mock Data

| Transaction Ref | Sender / Receiver | Amount | Cryptographic HMAC-SHA256 Hash | E-Verify Result |
|---|---|---|---|---|
| **`BY-7721-9921`** | BankY ➔ KBANK (`089-x-xxxx-9`) | ฿1,500.00 | `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855` | **Authentic BOT Slip Verified ✓** |
| **`BY-5512-3841`** | BankY ➔ TrueMoney (`086-xxx-4321`) | ฿300.00 | `ca978112ca1bbdcafac231b39a23dc4da786eff8147c4e72b9807785afee48bb` | **Authentic BOT Slip Verified ✓** |
| **`BY-FORGED-01`** | Forged / Modified Slip | ฿99,000.00 | `INVALID_TAMPERED_HMAC_SIGNATURE` | **⚠️ Tampered / Unrecognized Slip** |

---

## 7. Credit Card Loan Calculation Matrix (8.5% Interest Rate)

| Principal Amount | Tenure | Monthly Installment | Total Interest | Total Repayment | Test Case |
|---|---|---|---|---|---|
| **฿5,000.00** | 3 Months | **฿1,702.08 / mo** | ฿106.25 | ฿5,106.25 | Minimum Loan Drawdown |
| **฿20,000.00** | 12 Months | **฿1,808.33 / mo** | ฿1,700.00 | ฿21,700.00 | Standard 1-Year Loan |
| **฿50,000.00** | 24 Months | **฿2,437.50 / mo** | ฿8,500.00 | ฿58,500.00 | Multi-Year Installment |
| **฿100,000.00** | 12 Months | **฿9,041.67 / mo** | ฿8,500.00 | ฿108,500.00 | Maximum Available Credit Limit |
| **฿150,000.00** | Any | **Blocked (Reject)**| N/A | N/A | Over-Limit Boundary Test |

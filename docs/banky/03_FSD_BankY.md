# FUNCTIONAL SPECIFICATION DOCUMENT (FSD)
## Project Name: BankY - Mobile Virtual Banking & Payment Gateway Platform
**Document Version:** 1.0.0  
**Target Subpath:** `https://www.franktest.xyz/vasupbanky`  
**Technical Standards:** RESTful API, ISO 20022 Financial Messaging, BOT Thai QR EMVCo Standard, Thai PDPA B.E. 2562  

---

## 1. System Architecture & Topology

```
+----------------------------------------------------------------------------------------------------+
|                                      Client Layer (Mobile / PWA)                                   |
|   BankY React/TypeScript Mobile Shell (Vite Base Path: /vasupbanky/ or Root)                      |
|   - Mobile Viewport: 390px-430px adaptive frame + PWA offline cache                                |
|   - Local State Encryption: WebCrypto API (AES-256-GCM + PBKDF2)                                   |
+-------------------------------------------------+--------------------------------------------------+
                                                  | HTTPS / TLS 1.3 (mTLS for Partners)
                                                  v
+----------------------------------------------------------------------------------------------------+
|                          Reverse Proxy & API Gateway Layer (Nginx / Express)                       |
|   Subpath: /vasupbanky/api/v1/*                                                                    |
|   - Rate Limiting: 100 req/min per IP | Idempotency Interceptor                                    |
|   - WAF & OWASP Sanitization | Security Headers (HSTS, CSP, X-Content-Type-Options)              |
+-------------------------------------------------+--------------------------------------------------+
                                                  |
           +--------------------------------------+--------------------------------------+
           |                                                                             |
           v                                                                             v
+------------------------------------+                         +-------------------------------------+
|      BankY Core Banking Engine     |                         |    BankY Payment Gateway Switch     |
| - Account Balance & Ledger         |                         | - Thai QR EMVCo Encoder/Decoder     |
| - 6-Digit PIN & Biometric Service  |                         | - Merchant Checkout Engine          |
| - Savings Pockets & Interest Calc  |                         | - Webhook Dispatcher (HMAC-SHA256)  |
| - ALM Audit Logger & Event Stream  |                         | - Slip Cryptographic Signer & Valid |
+------------------+-----------------+                         +------------------+------------------+
                   |                                                              |
                   +------------------------------+-------------------------------+
                                                  |
                                                  v
+----------------------------------------------------------------------------------------------------+
|                      Bank of Thailand (BOT) Integration Adapter (Simulated)                        |
| - National Digital ID (NDID) / D.DOPA e-KYC Verification Bridge                                    |
| - National ITMX PromptPay Switch (ISO 20022 Pacs.008 Credit Transfer / Pacs.002 Confirmation)     |
| - AMLO (Anti-Money Laundering Office Thailand) Sanction Screening Database                         |
| - BOT Open Banking API Directory & Sandbox Hub                                                     |
+----------------------------------------------------------------------------------------------------+
```

---

## 2. Bank of Thailand (BOT) & PromptPay Standards

### 2.1 Thai QR Code Standard (EMVCo Specification)
BankY implements the official BOT / National ITMX Thai QR Standard using Tag-Length-Value (TLV) encoding:

| Tag | Name | Format | Required | Example / Description |
|---|---|---|---|---|
| `00` | Payload Format Indicator | `01` | Mandatory | `000201` |
| `01` | Point of Initiation Method | `11` (Static) / `12` (Dynamic) | Mandatory | `010212` |
| `29` / `30` | Merchant Account Information (PromptPay) | Sub-tags: `00` (AID: `A000000677010111`), `01` (Mobile/CitizenID/e-Wallet) | Mandatory | PromptPay Proxy target identification |
| `53` | Transaction Currency | ISO 4217 (`764` for THB) | Mandatory | `5303764` |
| `54` | Transaction Amount | Variable (2 decimals) | Dynamic QR | `5406150.00` |
| `58` | Country Code | ISO 3166-1 (`TH`) | Mandatory | `5802TH` |
| `59` | Merchant / Payee Name | Variable string | Optional | `5910BANKY SHOP` |
| `62` | Additional Data (Reference 1/2) | Sub-tag `07` (Bill Ref / TxID) | Optional | `62180714REF20260923001` |
| `63` | CRC-16 Checksum | 4 Hex chars (CRC-16-CCITT) | Mandatory | `6304ABCD` |

---

## 3. Core API Endpoints & Data Contracts

### 3.1 Digital e-KYC & Onboarding (`BR-001`, `BR-002`, `BR-003`)
- **Endpoint:** `POST /api/v1/kyc/verify-identity`
- **Request Body:**
```json
{
  "citizenId": "1103702938472",
  "laserCode": "JT2-1928374-12",
  "fullName": "นาย วสุพล ทดสอบระบบ",
  "birthDate": "1998-05-14",
  "livenessScore": 0.998,
  "consentPdpa": {
    "terms": true,
    "kycBiometric": true,
    "marketing": false
  }
}
```
- **Response `200 OK`:**
```json
{
  "status": "SUCCESS",
  "cif": "CIF-TH-2026-9921",
  "accountNumber": "099-2-88192-3",
  "verificationToken": "jwt.signed.kyc_token",
  "requiresFacialAuthOverLimit": 50000.00
}
```

### 3.2 PromptPay Domestic Transfer (`BR-009`, `BR-010`, `BR-014`, `BR-017`)
- **Endpoint:** `POST /api/v1/transfers/promptpay`
- **Headers:** `Authorization: Bearer <TOKEN>`, `X-Idempotency-Key: <UUIDv4>`
- **Request Body:**
```json
{
  "sourceAccount": "099-2-88192-3",
  "targetProxyType": "MOBILE", // MOBILE, CITIZEN_ID, EWALLET, BANK_ACCOUNT
  "targetProxyValue": "0891234567",
  "amount": 1500.00,
  "note": "Payment for services",
  "pinProof": "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855"
}
```
- **Response `200 OK`:**
```json
{
  "transactionId": "TXN-20260923-88391",
  "status": "COMPLETED",
  "timestamp": "2026-09-23T04:45:00.000+07:00",
  "sender": {
    "name": "นาย วสุพล ท.",
    "accountMasked": "xxx-x-88192-x"
  },
  "recipient": {
    "name": "น.ส. ธนพร ร.",
    "proxyMasked": "089-xxx-4567",
    "bankCode": "BOT_004"
  },
  "amount": 1500.00,
  "fee": 0.00,
  "slipSignature": "HMAC256_b8a92f00...",
  "qrVerificationPayload": "BANKY|TXN-20260923-88391|1500.00|VALID"
}
```

### 3.3 Payment Gateway Merchant Checkout & Webhook (`BR-011`, `BR-012`, `BR-013`)
- **Endpoint:** `POST /api/v1/gateway/checkout/create`
- **Request Body:**
```json
{
  "merchantId": "MCH-BANKY-884",
  "orderId": "ORD-99120",
  "amount": 2990.00,
  "currency": "THB",
  "paymentMethods": ["PROMPTPAY_QR", "CREDIT_CARD"],
  "callbackUrl": "https://www.franktest.xyz/vasupbanky/api/v1/gateway/webhook"
}
```
- **Response `201 Created`:**
```json
{
  "checkoutToken": "CHK-TOKEN-772910",
  "qrPayload": "00020101021229370016A00000067701011101130066891234567530376454072990.005802TH62170713ORD-991206304E8A1",
  "expiresAt": "2026-09-23T05:00:00.000+07:00",
  "status": "PENDING"
}
```

---

## 4. Security & Cryptographic Controls
1. **Transport Layer Security:** Strict TLS 1.3 with forward secrecy ciphers (`TLS_AES_256_GCM_SHA384`).
2. **PIN Security:** 6-digit PIN is salted with client-side unique device fingerprint and hashed using Argon2id / PBKDF2 before transmission. Plaintext PINs never cross the wire or enter application logs.
3. **OWASP Mobile Protections:**
   - Anti-Root / Jailbreak detection checks on native wrappers.
   - Screen obfuscation when the app transitions to the background.
   - Certificate pinning against MITM attacks.
4. **Fraud Velocity Engine (`BR-015`, `BR-016`):**
   - Real-time evaluation of transaction bursts ($>5\text{ tx/min}$).
   - Sudden account emptying triggers step-up facial verification or automatic temporary 2-hour hold.

---

## 5. Thai PDPA (B.E. 2562) Architecture & Privacy Matrix
- **Consent Store:** All consent records are timestamped, versioned, and stored with IP and Device metadata.
- **Data Subject Access Rights (DSAR):**
  - Right to Access: Customer can download a machine-readable JSON archive of all personal information.
  - Right to Erasure / Anonymization: Marketing profiles are purged immediately upon request; financial transaction records are securely retained for the 10-year statutory period required by AMLO/BOT before irreversible hashing.
- **Masking Standard (`BR-019`):**
  - Thai Citizen ID: `1-1037-xxxxx-12-3`
  - Mobile Phone: `081-xxx-4567`
  - Bank Account: `099-x-xxxx2-3`

---

## 6. Application Lifecycle Management (ALM) Traceability Framework

```
+----------------------------------------------------------------------------------------------------+
|                                    BankY ALM Traceability Engine                                   |
+----------------------+--------------------+---------------------+----------------------------------+
| Business Rule (BRD)  | Functional Spec    | Manual Test (QA)    | Verification Gate                |
+----------------------+--------------------+---------------------+----------------------------------+
| BR-001 (Citizen ID)  | FSD Section 3.1    | TC-001 (e-KYC ID)   | DOPA Gateway Pass & Valid Mod-11 |
| BR-003 (Liveness)    | FSD Section 3.1    | TC-003 (Biometric)  | Confidence >= 99.5%              |
| BR-005 (6-Digit PIN) | FSD Section 4.2    | TC-005 (PIN Rules)  | Sequential/Repeated Digits Block |
| BR-006 (Step-Up >=50k)| FSD Section 3.2   | TC-008 (Step-Up)    | Facial scan popup on >= 50k THB  |
| BR-010 (PromptPay)   | FSD Section 3.2    | TC-010 (Proxy Pay)  | PromptPay Account Name Preview   |
| BR-011 (Thai QR)     | FSD Section 2.1    | TC-011 (EMVCo QR)   | CRC-16 Checksum Match Validated  |
| BR-012 (Idempotency) | FSD Section 3.3    | TC-013 (Idempotency)| Zero duplicate charging on replay|
| BR-015 (Mule Alert)  | FSD Section 4.4    | TC-016 (Mule Block) | Account frozen upon rapid drain  |
| BR-018 (PDPA Consent)| FSD Section 5.0    | TC-018 (PDPA Split) | Unbundled checkboxes mandatory   |
| BR-024 (Subpath URI) | FSD Section 1.0    | TC-024 (Subpath)    | No 404 on /vasupbanky routing    |
+----------------------+--------------------+---------------------+----------------------------------+
```

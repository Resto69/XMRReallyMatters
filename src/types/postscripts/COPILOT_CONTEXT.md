# Monero P2P Trading Platform - Client vs Server Data Context

## Project Overview
This is a **web-based, privacy-first, non-custodial Monero (XMR) peer-to-peer trading platform**.
- Built with **React + TypeScript + Tailwind** on the frontend.
- Backend is **Node.js / Postgres**, used for orderbook, messaging, and trade metadata.
- Users never upload private keys or wallet seeds. All cryptography happens in the **browser** using `monero-javascript` (WASM) or Rust→WASM modules.

---

## 1️⃣ Client-side (User’s Browser)
The following data is **only stored/managed locally** in the browser or hardware wallet:
- **Private Monero keys / seed phrases** – never sent to server.
- **Wallets** – created/imported by the user, optionally connected to hardware wallets.
- **Multisig signing blobs** – exchanged with counterparty or arbitrator via encrypted channel.
- **Trade flow state** – e.g., escrow status, local calculations, timers.
- **Encrypted chat messages** – end-to-end encrypted before being sent to backend.
- **Session tokens (temporary)** – to authenticate requests, can be stored in memory or sessionStorage.

**Note:** Backend only sees **public keys, trade metadata, and encrypted blobs**, never secrets.

---

## 2️⃣ Server-side (Database / Node.js Backend)
The backend stores **metadata and authentication info only**, never private keys:
- **User login data**
  - Username / Display name
  - Password hash (bcrypt or argon2)
  - Optional email (for notifications or recovery)
- **Public Monero keys** – used for multisig escrow and reputation tracking
- **Orderbook / Offers** – listings with price, limits, payment methods, and seller reputation
- **Reputation and trade history**
  - Completed trades
  - Ratings and feedback
  - No private keys
- **Session tokens / JWTs** – for authenticating API requests
- **Encrypted chat and dispute blobs** – stored as opaque data; decrypted only in client or arbitrator browser
- **Optional Tor metadata** – minimal connection info for hidden service routing, ephemeral only

---

## 3️⃣ How Copilot Should Use This Info
When generating code:
1. Treat all cryptography (wallet creation, signing, multisig, key generation) as **client-side only**.
2. Backend API calls should **only send/receive public keys, offer metadata, and encrypted blobs**.
3. Never suggest storing seeds or private keys in the database.
4. Backend fetch/update endpoints examples:
   - `GET /offers` → returns list of offers (price, payment method, reputation, public keys)
   - `POST /offer` → create new offer metadata
   - `POST /chat` → relay encrypted messages
   - `GET /trade-history` → return user trade metadata
5. Client-side React components should manage wallet and multisig state locally.
6. Always show placeholders/comments where Monero/WASM logic should integrate.

---

## 4️⃣ Diagram (Textual for Copilot)
[User Browser / React + WASM]
|--- Wallet / Private Keys / Multisig (never sent)
|--- E2E Encrypted Chat
|--- Trade Flow & UI State
|
v
[Backend / Node.js + Postgres]
|--- User login (hashed passwords)
|--- Public keys
|--- Offer metadata
|--- Trade history (no keys)
|--- Encrypted chat blobs
|--- Session tokens

--- 

## 5️⃣ Copilot Guidelines
- Focus on **UI integration, API calls, and component wiring**.
- Mark Monero integration points clearly as TODOs or placeholders.
- Ensure session handling, data fetching, and UI state sync with server metadata.
- Avoid any suggestion that exposes user secrets.

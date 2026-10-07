# Maharlika — GCash-style e-wallet demo (Expo SDK 57)

Demo app with a mocked backend. No real money moves. Balances, PIN, and session are local-only.

## Run

```bash
npx expo start            # dev server (QR for dev build)
npx expo run:android      # development build (required: camera, secure-store, reanimated)
npx expo run:ios          # development build
npx expo lint             # 0 errors, 0 warnings
npx jest                  # money / validation / balance-math tests
npx expo-doctor           # 21/21 checks
```

Expo Go is best-effort only (native modules need a dev build).

## Demo login

- Email: `juan@maharlika.app`
- Password: `Demo1234!`
- First login prompts a 4-digit PIN; session token lives in `expo-secure-store`.

## Screen checklist vs reference (15 screens)

| # | Screen (route) | Status |
|---|---|---|
| 1 | Splash (`onboarding`) — gradient, card pair, Get Started/Login | done |
| 2 | Home (`(tabs)`) — greeting, wallet card + eye toggle, quick actions, recent + swipe-to-delete | done |
| 3 | Transaction Management (`transactions`) — Send/Receive/Bills chips, live search, See All | done |
| 4 | Delete modal (`modals/delete-transaction`) — confirm/cancel, haptic + toast | done |
| 5 | My Account (`(tabs)/profile`) — Verified pill, menu, red LOGOUT → logout modal, Reset demo data | done |
| 6 | Send Money (`send`) — recipient + QR icon, ₱0.00 input, quick chips, inline errors → Confirm Transfer | done |
| 7 | Generate QR (`generate-qr`) — JSON `{v:1,name,account,amount}` QR, caption, Share | done |
| 8 | Confirm Transfer (`confirm-transfer`) — zigzag receipt, fee ₱3.00, biometric/PIN, haptic → Receipt | done |
| 9 | Pay Bills tab (`(tabs)/bills`) — Live Rates + Live Updated pill, sparklines ticking ~4s | done |
| 10 | Final Bill Payment (`bill-pay`) — biller dropdown, account no., ₱ amount, zod validation → Confirmation | done |
| 11 | Bill Confirmation (`bill-confirmation`) — Pay Now (biometric/PIN) / Cancel → Receipt | done |
| 12 | Transaction History (`transaction-history`) — June-style calendar, summary + See All, date filter | done |
| 13 | Scan & Pay (`scan`) — CameraView + permissions fallback, corner frame, scan line, JSON parse → Send prefill | done |
| 14 | Logout modal (`modals/logout`) — clears SecureStore session → Login | done |
| 15 | Receipt (`receipt`) — zigzag, Successful, masked account, barcode, view-shot capture + share | done |
| + | Login (`login`) — demo creds, Show toggle, fingerprint/Face ID, Sign Up | done |
| + | Wallet (`(tabs)/wallet`) — bank carousel, linked cards, Link a New Account mock form | done |

## Money rules

- Integer centavos everywhere (`src/utils/money.js`); `Intl.NumberFormat('en-PH', { style:'currency', currency:'PHP' })`.
- Transfer fee ₱3.00 enforced in validation and balance math.
- Account numbers masked (last 4 only) on receipts.

## Lab 05 · Offline-first SQLite wallet

- Service: `src/services/db.js` — sync API only (`openDatabaseSync`, `execSync`, `runSync`, `getAllSync`, `getFirstSync`), WAL mode, single `transactions` ledger table (id, type, amount, recipient, timestamp).
- Balance is **derived**: `SUM(Cash-in, Receive) − SUM(Send, Bill, Load)` — no separate wallet row, so it can never drift or reseed. Seeds exactly once (₱5,000 / 'Initial Balance') when the ledger is empty; v1 installs migrate `date` → `timestamp` automatically.
- DB opens once at app start (`useEffect` in root `_layout.jsx`); screens reload on focus.
- The **main Maharlika store** (`src/store.jsx`) is also offline-first: balance, transactions, linked accounts, and preferences hydrate from the `app_state` table on launch and write through on every change. Seeds apply first-run only. Nothing in the app resets on restart anymore.
- Screens: `src/screens/HomeScreen.js`, `SendScreen.js`, `HistoryScreen.js`, routed at `/lab`, `/lab/send`, `/lab/history` (Expo Router equivalents of the lab's native-stack App.js). Entry: Profile → About → "Lab 05 · Offline Wallet (SQLite)".
- Test offline durability: 1) open `/lab`, note balance; 2) Send ₱100 to anyone; 3) History → confirm the row; 4) enable Airplane Mode; 5) fully kill the app and relaunch; 6) balance and rows must be intact. Long-press a history row to test DELETE.

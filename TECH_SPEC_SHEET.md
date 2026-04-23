# Cricket11 Fantasy Sports Technical Spec Sheet

Last updated: 2026-04-23

## Product Summary

Cricket11 Fantasy Sports is a clean-room fantasy sports starter app focused on cricket-style contests. It supports match browsing, contest joining, team building, saved teams, leaderboards, wallet views, Google login scaffolding, UPI wallet top-up scaffolding, and mobile installation through Progressive Web App support.

## Current Architecture

- Frontend: React 18, Vite, React Router.
- Backend: Node.js, Express.
- Persistence: local JSON files in `server/data`.
- Production serving: Express serves the built frontend from `client/dist` and API routes from `/api`.
- Mobile delivery: Progressive Web App with manifest, service worker, app icon, and install prompt.
- Auth: Google Identity Services frontend button with backend Google ID token verification.
- Payments: UPI intent/demo wallet top-up flow, ready to replace with a gateway-backed production flow.

## Core User Features

- Home lobby with upcoming matches and wallet summary.
- Contest list with prize pools, entry fee, fill progress, and join action.
- Team builder for 11-player fantasy squads.
- Captain and vice-captain assignment with duplicate-role prevention.
- Saved teams view with readable player names.
- Leaderboard view.
- Wallet page with balance, bonus, winnings, transaction history, and UPI top-up demo.
- Google sign-in UI and backend token verification endpoint.
- Installable mobile app experience on Android Chrome and iOS Safari.

## API Surface

- `GET /api/health`: service health check.
- `GET /api/matches`: match lobby data.
- `GET /api/contests`: contest list.
- `POST /api/contests/:contestId/join`: increments contest occupancy after capacity checks.
- `GET /api/players`: available player list.
- `GET /api/teams`: saved fantasy teams.
- `POST /api/teams`: validates and saves an 11-player fantasy team.
- `GET /api/leaderboard`: leaderboard data.
- `GET /api/wallet`: wallet balances and transactions.
- `POST /api/auth/google`: verifies Google ID token and returns user profile.
- `POST /api/payments/upi/create`: creates a UPI intent payment session.
- `POST /api/payments/upi/:paymentId/confirm`: demo confirmation that credits the mock wallet.

## Environment Variables

Frontend:

- `VITE_GOOGLE_CLIENT_ID`: Google OAuth Web Client ID.
- `VITE_API_URL`: optional API base URL when frontend and backend are hosted separately.

Backend:

- `GOOGLE_CLIENT_ID`: Google OAuth Web Client ID used to verify ID tokens.
- `UPI_MERCHANT_VPA`: merchant UPI VPA for generated UPI intents.
- `UPI_MERCHANT_NAME`: merchant display name for UPI intents.
- `PORT`: backend server port.

## Commit Feature History

### `3250140` - Add mobile PWA support

- Added `manifest.webmanifest`.
- Added app icon.
- Added service worker app-shell caching.
- Added install prompt component.
- Added mobile and iOS metadata.
- Improved mobile safe-area spacing, tap targets, top bar, bottom nav, and player row layout.
- Added `docs/mobile-app.md`.

### `c210073` - Add Google login and UPI wallet flow

- Added Google Sign-In component.
- Added backend Google ID token verification via `google-auth-library`.
- Added `client/.env.example` and `server/.env.example`.
- Added UPI top-up form to wallet.
- Added UPI payment create and demo-confirm endpoints.
- Added `docs/auth-and-payments.md`.

### `a06ca50` - Add root install lockfile

- Added root `package-lock.json` for reproducible root-level installs.

### `ac993ed` - Close app readiness gaps

- Added app loading and error states.
- Added visible team-save feedback.
- Added contest join behavior and backend validation.
- Prevented repeated contest joins in the same browser session.
- Replaced player IDs with names in saved team views.
- Added empty state for teams.
- Strengthened server validation for teams.
- Added deployment-friendly root install metadata.

### `7de58b4` - Prepare app for deployment

- Added root build/start scripts.
- Reworked frontend API base URL for deployable `/api` usage.
- Added Vite dev proxy.
- Added Express static serving for `client/dist`.
- Added backend `PORT` support.
- Added team validation for 11 players, uniqueness, and captain/vice-captain rules.
- Added README deployment instructions.

## Deployment Notes

Recommended full-stack hosting path:

- Build command: `npm run build`
- Start command: `npm start`
- Node version: `>=18`

The Express server hosts both the API and frontend build, so Render, Railway, Fly.io, or similar Node hosts are straightforward fits. If the frontend is deployed separately, set `VITE_API_URL` to the public backend URL.

## Mobile App Notes

The current mobile app is a Progressive Web App:

- Android Chrome can install it from the browser prompt or in-app install button.
- iPhone Safari users can install it with Share, then Add to Home Screen.
- Native Android/iOS packaging can be added later with Capacitor after deployment is stable.

## Payment Compliance Notes

The current UPI flow is a demo/sandbox-style wallet top-up. It creates a UPI intent and credits the mock wallet only when the demo confirmation button is pressed.

Production payments should use a regulated payment gateway such as Razorpay, Cashfree, PhonePe, PayU, or another approved provider. Wallet crediting should happen only after backend verification of payment signature or webhook status. Gateway secrets must remain server-side.

## Future Planned Releases

### Release 0.2 - Production Deployment

- Merge `codex/deploy-ready` into `main`.
- Deploy the full-stack app to a public Node host.
- Add production environment variables.
- Add health-check monitoring.
- Add deployment runbook.

### Release 0.3 - Real Authentication

- Persist Google users in a database.
- Add secure session cookies or JWT refresh flow.
- Add protected routes for wallet, teams, and contest joins.
- Add logout/session expiry handling.

### Release 0.4 - Payment Gateway Integration

- Replace demo UPI confirmation with gateway order creation.
- Verify payment signatures and webhooks on the backend.
- Add payment status polling.
- Add failed/refunded transaction states.
- Add wallet ledger audit records.

### Release 0.5 - Database Persistence

- Replace JSON files with PostgreSQL or MongoDB.
- Add migrations or schema management.
- Add user-owned teams, contests, and wallet records.
- Add input validation middleware.

### Release 0.6 - Native App Packaging

- Add Capacitor.
- Generate Android project.
- Generate iOS project.
- Add native splash screens and icons.
- Validate Google login and UPI intent behavior on physical devices.

### Release 0.7 - Fantasy Rules Engine

- Add role limits, team composition constraints, and credit caps.
- Add contest-specific team entry rules.
- Add scoring rules and computed leaderboard updates.

### Release 0.8 - Admin and Operations

- Add admin contest creation.
- Add player/match data management.
- Add wallet transaction review tools.
- Add operational audit logging.

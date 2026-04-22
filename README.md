# Fantasy Sports App Starter

A legally distinct fantasy sports app starter inspired by common fantasy contest patterns.

## Stack
- Frontend: React + Vite
- Backend: Node.js + Express
- Mock persistence: local JSON files

## Features
- Contest lobby
- Match cards
- Team builder
- My teams
- Leaderboard
- Wallet-style page
- Basic login/signup UI
- REST API with mock data
- Clean folder structure for extension

## Run locally

Install dependencies:
```bash
npm run install:all
```

### 1) Backend
```bash
cd server
npm run dev
```
Backend runs at `http://localhost:4000`

### 2) Frontend
Open a second terminal:
```bash
cd client
npm run dev
```
Frontend runs at `http://localhost:5173`

The Vite dev server proxies `/api` requests to the backend.

## Production build

```bash
npm run build
npm start
```

The Express server serves the built frontend from `client/dist` and the API from `/api`.

Set `PORT` for the server port. Set `VITE_API_URL` only if the frontend is deployed separately from the API.

## Notes
- This is a starter project and not connected to real payments, real users, or real sports feeds.
- Brand, copy, and visuals are original and intentionally not a clone of any commercial platform.

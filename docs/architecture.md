# Architecture Overview

## Frontend
- React + Vite
- Route-based pages for home, contests, team builder, wallet, leaderboard, and my teams
- Shared app context for mock state and API calls

## Backend
- Express REST API
- JSON-file-backed mock persistence for rapid prototyping
- Endpoints for matches, contests, players, teams, wallet, leaderboard, and login

## Suggested next enhancements
1. Real authentication with JWT and hashed passwords
2. Database layer such as PostgreSQL
3. Contest join flow and ticket generation
4. Admin portal for match and player management
5. Real sports data feed integration
6. Payment gateway integration with proper compliance review
7. Notifications, referrals, and KYC modules

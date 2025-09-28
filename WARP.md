# WARP.md

This file provides guidance to WARP (warp.dev) when working with code in this repository.

Project overview
- Monorepo with two Node.js apps:
  - frontend/ — React + Vite + Tailwind CSS app (Leaflet map, React Query, Firebase Web SDK)
  - backend/ — Express API server (MongoDB via Mongoose, multer uploads, optional Firebase Admin auth)
- Local defaults:
  - Frontend dev server: http://localhost:5173
  - Backend API: http://localhost:4000

Environment
- backend/.env
  - MONGODB_URI
  - PORT (default 4000)
  - ENABLE_FIREBASE_AUTH ("true" to require Firebase ID tokens on mutating routes)
  - FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL, FIREBASE_PRIVATE_KEY
- frontend/.env
  - VITE_API_BASE_URL (points to backend)
  - VITE_FIREBASE_* (Firebase web config)

Common commands

Root
- This repo is not a single workspace; run commands inside each subfolder.

Backend (backend/)
- Install deps:
  ```pwsh
  npm install
  ```
- Run in watch mode (development):
  ```pwsh
  npm run dev
  ```
- Start (production-style):
  ```pwsh
  npm start
  ```
- Seed demo data (requires MONGODB_URI):
  ```pwsh
  npm run seed
  ```
- Tests:
  - No test tooling/scripts are configured in the backend at this time.

Frontend (frontend/)
- Install deps:
  ```pwsh
  npm install
  ```
- Dev server:
  ```pwsh
  npm run dev
  ```
- Build:
  ```pwsh
  npm run build
  ```
- Preview built app:
  ```pwsh
  npm run preview
  ```
- Lint:
  ```pwsh
  npm run lint
  ```
- Format:
  ```pwsh
  npm run format
  ```
- Tests:
  - No test tooling/scripts are configured in the frontend at this time.

Running a single test
- Not applicable currently—no test runners are configured. If/when tests are added (e.g., Vitest/Jest for frontend or Jest for backend), document single-test invocation here (for example, `vitest run path/to/file.test.ts -t "name"`).

High-level architecture
- Frontend
  - React SPA built with Vite (see frontend/vite.config.js, dev server on 5173)
  - Data fetching and caching with @tanstack/react-query; HTTP via axios
  - Mapping via Leaflet/react-leaflet (OSM tiles)
  - Routing via react-router-dom
  - Firebase Web SDK for authentication (Email/Google)
- Backend
  - Express app exposing REST endpoints for civic issues and analytics
  - MongoDB via Mongoose for persistence
  - File uploads handled by multer; files served from /uploads/* for the prototype
  - Runtime configuration via dotenv
  - Middlewares: cors, helmet, morgan
  - zod for request validation
  - Optional Firebase Admin verification when ENABLE_FIREBASE_AUTH=true (protects mutating routes like upvote/comment/status)
- API surface (prototype)
  - POST /api/issues — create issue (multipart: title, description, category?, lat?, lng?, photo)
  - GET /api/issues — list with filters (category, severity, status, lng, lat, radiusKm)
  - GET /api/issues/:id — fetch by id
  - POST /api/issues/:id/upvote — increment upvotes
  - POST /api/issues/:id/comment — add a comment
  - PATCH /api/issues/:id/status — update status
  - GET /api/analytics — aggregate counts (open/in_progress/closed)

Notes
- Git is optional but recommended; see README.md for initialization steps if needed.
- Deployment (from README): frontend builds with `npm run build` (dist/ output) and is suitable for Vercel; backend runs with `node src/index.js` on platforms like Render/Heroku. Ensure the necessary environment variables are set in each environment.

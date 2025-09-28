# CivicConnect: AI-powered Civic Complaint Platform

A prototype web application to transform civic grievance redressal in India into a transparent, citizen-driven, AI-assisted, and real-time platform.

- Frontend: React + Vite + Tailwind CSS
- Backend: Node.js + Express + MongoDB (Atlas)
- Auth: Firebase Authentication (Email/Google)
- GIS: Leaflet (OSM tiles)
- AI (prototype): Rule-based NLP categorization & prioritization
- Deploy: Vercel (frontend), Render/Heroku (backend)

## Monorepo Layout

- frontend/ — React app (Vite)
- backend/ — Express API server

## Prerequisites

- Node.js 18+ and npm
- Git (optional but recommended)
- MongoDB Atlas connection string
- Firebase project for Authentication (Email/Password + Google sign-in)

On Windows (PowerShell), you can install with winget if not already installed:

```
pwsh path=null start=null
# Install Node.js LTS
winget install --id OpenJS.NodeJS.LTS -e --source winget
# Install Git
winget install --id Git.Git -e --source winget
```

## 1) Environment setup

Create environment files from the provided examples.

```
pwsh path=null start=null
# Backend
Copy-Item backend\.env.example backend\.env
# Frontend
Copy-Item frontend\.env.example frontend\.env
```

Edit values:
- backend/.env
  - MONGODB_URI=mongodb+srv://... (Atlas connection string)
  - PORT=4000 (or your choice)
  - ENABLE_FIREBASE_AUTH=true (optional — set to true to enforce Firebase auth on mutating endpoints)
  - FIREBASE_PROJECT_ID=...
  - FIREBASE_CLIENT_EMAIL=...
  - FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
- frontend/.env
  - VITE_API_BASE_URL=http://localhost:4000
  - VITE_FIREBASE_* according to your Firebase project

## 2) Install dependencies

```
pwsh path=null start=null
# Backend
cd backend
npm install
cd ..

# Frontend
cd frontend
npm install
cd ..
```

## 3) Seed demo data (optional)

```
pwsh path=null start=null
# Ensure backend/.env has MONGODB_URI set
cd backend
npm run seed
cd ..
```

This inserts a few sample issues with photos and coordinates.

## 4) Run locally

Start the backend API:

```
pwsh path=null start=null
cd backend
npm start
```

Then start the frontend in a new terminal:

```
pwsh path=null start=null
cd frontend
npm run dev
```

Frontend: http://localhost:5173
Backend: http://localhost:4000

## 5) Features implemented (prototype)

- Citizen reporting: photo upload, GPS auto-capture (browser geolocation), category selection, single-tap submit
- AI triage: rule-based NLP classifier to auto-classify category, set severity, and suggest department
- Crowdsourced validation: upvotes and comments on issues
- GIS dashboard: real-time map with Leaflet + OSM tiles, filters by category and severity
- Transparency: issue list, detail view, status tracking
- Admin (prototype): basic analytics endpoint, placeholder panel
- Community: groundwork for engagement (upvotes/comments), social sharing can be added via share buttons

## 6) API overview

- POST /api/issues — create issue (multipart/form-data: title, description, category?, lat?, lng?, photo)
- GET /api/issues — list issues (filters: category, severity, status, lng, lat, radiusKm)
- GET /api/issues/:id — get issue by id
- POST /api/issues/:id/upvote — increment upvotes (auth optional via Firebase)
- POST /api/issues/:id/comment — add a comment (auth optional via Firebase)
- PATCH /api/issues/:id/status — update status (auth optional via Firebase)
- GET /api/analytics — aggregate counts (open/in_progress/closed)

Uploads are served from /uploads/* (local filesystem) for the prototype.

## 7) Authentication (prototype)

Frontend uses Firebase Web SDK. When ENABLE_FIREBASE_AUTH=true and Firebase Admin credentials are configured in backend/.env, the backend enforces ID token verification on mutating routes. Otherwise, it permits requests without auth.

## 8) Deployment

- Frontend (Vercel)
  - Framework preset: Vite
  - Build Command: npm run build
  - Output Directory: dist
  - Environment: VITE_API_BASE_URL (point to deployed backend), VITE_FIREBASE_*

- Backend (Render or Heroku)
  - Node runtime
  - Build Command: (none needed)
  - Start Command: node src/index.js
  - Environment: MONGODB_URI, PORT, ENABLE_FIREBASE_AUTH, FIREBASE_*
  - Add a persistent disk or switch to a cloud object store if you need durable image storage beyond the prototype

## 9) Git repository

If Git is available, initialize and commit:

```
pwsh path=null start=null
git init -b main
git add .
git commit -m "chore: initialize CivicConnect prototype"
```

## 10) Roadmap

- Replace rule-based classifier with a small ML/NLP model or an API-based classifier
- Add real push notifications/SMS via a provider (e.g., Twilio)
- Role-based admin panel with assignment and escalation workflows
- Better analytics (SLAs, trends, heatmaps)
- Migrate image uploads to cloud storage (S3, Cloud Storage) with signed URLs
- E2E tests and component tests

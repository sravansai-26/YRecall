# Azure Production Implementation Readiness

This document outlines the codebase preparations made to ensure the YRecall backend is ready for deployment to Azure Container Apps.

## 1. Changes Implemented
- **Environment Strategy**: Created `.env.example` mapping out variables required for development versus production, clearly separating `FIREBASE_SERVICE_ACCOUNT_PATH` (local) from `FIREBASE_SERVICE_ACCOUNT_JSON` (Azure production).
- **Dockerization**: Added a production-grade multi-stage `Dockerfile` (Python 3.11-slim) and `.dockerignore`.
- **Gunicorn Entrypoint**: Created `gunicorn_conf.py` configured to use `UvicornWorker` with a default of 1 worker to ensure AI Queue stability without thrashing.
- **Database Pooling**: Extracted `pool_size` and `max_overflow` from hardcoded values into environment variables (`DB_POOL_SIZE`, `DB_MAX_OVERFLOW`) to support dynamic resizing based on Supabase Supavisor connections.
- **Firebase Initialization**: Rewrote the Firebase initialization block in `security.py` to prioritize reading the `FIREBASE_SERVICE_ACCOUNT_JSON` environment string (safely handling newlines), and falling back to the local file path.
- **CORS Hardening**: Modified `main.py` and `config.py` to accept an `ALLOWED_ORIGINS` environment variable instead of a wildcard `*`.
- **Mobile Secrets**: Removed the hardcoded Firebase Web API Key from the mobile app's `firebase.ts` and wired it securely through `env.ts` as `EXPO_PUBLIC_FIREBASE_API_KEY`.

## 2. Files Changed
- `backend/app/main.py`
- `backend/app/core/config.py`
- `backend/app/core/security.py`
- `backend/app/core/database.py`
- `backend/.env.example` [NEW]
- `backend/Dockerfile` [NEW]
- `backend/.dockerignore` [NEW]
- `backend/gunicorn_conf.py` [NEW]
- `mobile/src/config/env.ts`
- `mobile/src/shared/lib/firebase.ts`

## 3. Why Each Change Was Required
- **Docker/Gunicorn**: Azure Container Apps runs standard OCI containers. Uvicorn alone isn't robust enough for internet-facing edge traffic.
- **Database Pooling**: If we run multiple Azure Container Apps, connection counts multiply. We need smaller pools configured per-instance to prevent Supabase direct-connection limits from crashing the app.
- **Firebase JSON Stringing**: Azure Container Apps cannot easily inject standard files into the filesystem permanently. Using an environment variable for the JSON string solves this cleanly.
- **CORS**: `*` origin is a security vulnerability in production if API endpoints are authenticated.

## 4. Environment Variables Required (Azure)
- `DATABASE_URL` (Use Supavisor IPv4 port 6543)
- `SUPABASE_URL`
- `SUPABASE_SERVICE_KEY`
- `FIREBASE_SERVICE_ACCOUNT_JSON` (Base64 or escaped JSON string)
- `GEMINI_API_KEY`
- `RAZORPAY_KEY_ID` (Live keys later)
- `RAZORPAY_KEY_SECRET`
- `ALLOWED_ORIGINS` (e.g., `https://yrecall.app`)
- `DB_POOL_SIZE`
- `DB_MAX_OVERFLOW`

## 5. Development vs Production Configuration
Local development will continue to use `.env` reading `FIREBASE_SERVICE_ACCOUNT_PATH`, `DATABASE_URL` directly connecting to port 5432, and Razorpay TEST keys.
Production will rely on `FIREBASE_SERVICE_ACCOUNT_JSON` and the Supabase IPv4 Pooler (port 6543) injected natively through Azure KeyVault or ACA Secrets.

## 6. Docker Build Instructions
```bash
cd 04_Development/backend
docker build -t yrecall-backend:latest .
```

## 7. Local Production Simulation Instructions
Ensure Docker Desktop is installed (currently missing on this machine).
```bash
docker run -p 8000:8000 \
  -e DATABASE_URL="your-db-url" \
  -e FIREBASE_SERVICE_ACCOUNT_JSON='{"type":"service_account",...}' \
  yrecall-backend:latest
```

## 8. Azure Deployment Prerequisites
- Azure Subscription (Student credit)
- Azure CLI installed locally
- Docker Desktop installed locally
- Supabase production project created
- Firebase production project created

## 9. Azure Resources That Will Eventually Be Created
- Azure Container Registry (ACR)
- Azure Container Apps Environment (CAE)
- Azure Container App (CA)
- Azure Log Analytics Workspace

## 10. Secrets That Must Eventually Be Configured
- Production Supabase Database connection string
- Production Supabase Service Key
- Production Firebase Admin JSON
- Production Gemini API Key
- Production Razorpay Keys

## 11. Database Connection/Pooler Requirements
Must use Supavisor connection pooling (port 6543) in Azure to prevent connection exhaustion.

## 12. Firebase Credential Requirements
The JSON file must be flattened (newlines escaped) and provided as the `FIREBASE_SERVICE_ACCOUNT_JSON` environment variable.

## 13. AI Worker Scaling Limitations
The AI Queue uses Postgres `SELECT ... FOR UPDATE SKIP LOCKED`. This natively prevents duplicate jobs across multiple workers/containers. However, because the loop runs `asyncio.to_thread` directly inside FastAPI, rapid scaling might cause database thrashing. We have restricted Gunicorn to 1 worker per container by default.

## 14. CORS Strategy
The backend natively blocks wildcard origins in production now, requiring `ALLOWED_ORIGINS` to explicitly list frontend web domains (e.g., `https://yrecall.app`).

## 15. Mobile EAS Production Configuration
The mobile app relies on `EXPO_PUBLIC_API_URL`. When building for production via EAS, this must be set in `eas.json` or the Expo dashboard to point to the new Azure FQDN (e.g., `https://api.yrecall.app/api/v1`).

## 16. Rollback Considerations
Because no Azure resources exist yet, rollback is simply reverting these Git commits. In the future, Azure Container App Revisions will handle rollback.

## 17. Remaining Blockers
- **Docker Desktop is not installed locally on this Windows machine.** (Required to push to Azure Container Registry).
- Production databases and Firebase projects do not exist yet.

## 18. Items Intentionally NOT Changed
- Application functionality, API routes, or Supabase egress optimizations.
- Razorpay TEST mode logic (it is natively ready to accept LIVE keys).
- AI queue semantics (they were verified as safe).

## 19. Exact Next Deployment Steps
1. Install Docker Desktop.
2. Create Production Supabase & Firebase projects.
3. Authenticate with `az login` and `az acr login`.
4. Build and push the Docker image to ACR.
5. Deploy the image to Azure Container Apps, injecting the newly created secrets.

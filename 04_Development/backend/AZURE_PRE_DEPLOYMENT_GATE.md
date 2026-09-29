# Azure Pre-Deployment Gate

This document serves as the final validation report prior to provisioning Azure resources for the YRecall backend.

## 1. Validation Checks

| Check | Status | Notes |
| :--- | :--- | :--- |
| **Backend Startup (Gunicorn/Uvicorn)** | PASS | `app.main:app` is correct based on `WORKDIR /app` in the Dockerfile. |
| **Dockerfile Consistency** | PASS | Multi-stage build correctly installs native dependencies (libpq-dev) and runs as a non-root `appuser`. |
| **Gunicorn Configuration** | PASS | Binds `0.0.0.0:8000`, 1 worker, uses `UvicornWorker`. Fits AI worker semantics. |
| **Dependencies (`requirements.txt`)** | PASS | All critical packages (`fastapi`, `uvicorn`, `psycopg2-binary`, `firebase-admin`, `supabase`, `google-genai`) are present. |
| **Configuration (`config.py`)** | PASS | Variables map perfectly to `.env.example`. Local development falls back to file paths automatically. |
| **Firebase Production Initialization** | PASS | Safely parses `FIREBASE_SERVICE_ACCOUNT_JSON` string without leaking credentials in the exception block. |
| **Database Pool Configuration** | PASS | `DB_POOL_SIZE` and `DB_MAX_OVERFLOW` are passed directly into the SQLAlchemy engine. |
| **CORS Validation** | PASS | `ALLOWED_ORIGINS` defaults to a safe list and prevents wildcard generation in production. |
| **Health Endpoint** | PASS | `/health` returns `{"status": "ok"}` synchronously and statelessly without hitting DB/AI. |
| **AI Worker Concurrency** | PASS | Postgres `SELECT ... FOR UPDATE SKIP LOCKED` natively prevents multiple replicas from grabbing the same job. |
| **Supabase Storage Statefulness** | PASS | Storage uploads read bytes directly into memory and upload to the public bucket. No local disk dependency. |
| **Mobile Environment (`env.ts`)** | PASS | correctly defaults to localhost and reads `EXPO_PUBLIC_API_URL` and `EXPO_PUBLIC_FIREBASE_API_KEY` for EAS production. |
| **`.dockerignore` Protection** | PASS | Ignores `.env` and `firebase-adminsdk.json`. |
| **`.gitignore` Protection** | FAIL | The root `.gitignore` ignores `.env` and `google-services.json`, but **does NOT explicitly ignore `firebase-adminsdk.json`**. |
| **Secret Scanning / Leak Checks** | PASS | No new secrets were accidentally committed. Firebase API Key was securely shifted to environment variables. |

## 2. Exact Remaining Blockers

1.  **Gitignore Vulnerability:** `.gitignore` must be updated to explicitly ignore `firebase-adminsdk.json` to ensure the local dev fallback file isn't accidentally pushed by another developer.
2.  **Missing Local Docker Daemon:** Docker Desktop is not installed on this local Windows machine, preventing the container image from being built and pushed to the Azure Container Registry.
3.  **Missing External Production Environments:** A new Production Firebase Project and Production Supabase Project must be created before provisioning Azure.

## 3. Exact Azure Resources to Create

1.  **Azure Container Registry (ACR)** (Basic Tier)
2.  **Azure Log Analytics Workspace** (Free Tier available)
3.  **Azure Container Apps Environment** (Consumption profile)
4.  **Azure Container App** (The FastAPI runtime)

## 4. Exact Secrets/Environment Variables Required (Azure)

Provide these securely into the Azure Container App environment:

*   `DATABASE_URL`: The Supavisor IPv4 connection string (Port 6543)
*   `SUPABASE_URL`: The production Supabase API URL
*   `SUPABASE_SERVICE_KEY`: The production Supabase admin service role key
*   `FIREBASE_SERVICE_ACCOUNT_JSON`: The flattened/stringified JSON contents of the prod Firebase Admin SDK key
*   `GEMINI_API_KEY`: Production Gemini API key
*   `RAZORPAY_KEY_ID`: Production (or Test) Razorpay ID
*   `RAZORPAY_KEY_SECRET`: Production Razorpay Secret
*   `ALLOWED_ORIGINS`: `https://yrecall.app`
*   `DB_POOL_SIZE`: `5` (Recommended starting limit per container for ACA scaling)
*   `DB_MAX_OVERFLOW`: `10`

## 5. Exact Deployment Sequence

1.  Update `.gitignore` to include `firebase-adminsdk.json`.
2.  Install Docker Desktop locally (or establish GitHub Actions).
3.  Provision the external Supabase and Firebase production projects.
4.  Execute `az login` and `az acr login`.
5.  Build and push the Docker image to the ACR.
6.  Provision the Azure Container Apps Environment and Log Analytics workspace.
7.  Deploy the Azure Container App pointing to the ACR image and inject the secrets.
8.  Bind the custom domain (`api.yrecall.app`) to the Azure Container App for automatic SSL.
9.  Update `EXPO_PUBLIC_API_URL` in EAS build profiles and trigger the mobile production build.

## 6. Rollback Procedure

*   **Pre-Deployment:** Since no Azure infrastructure exists, rollback is a simple Git revert of the configuration changes.
*   **Post-Deployment:** Azure Container Apps supports Revisions. If a new image tag fails, simply route 100% of traffic back to the previous healthy Revision in the Azure Portal or via CLI.

## 7. Production Smoke-Test Checklist

Once deployed to Azure, verify:
*   [ ] `GET https://api.yrecall.app/health` returns `{"status": "ok"}`
*   [ ] Mobile App successfully signs in via Firebase, indicating `FIREBASE_SERVICE_ACCOUNT_JSON` parsed correctly.
*   [ ] Creating a Capture succeeds and uploads media to the Production Supabase Bucket.
*   [ ] The AI Worker successfully enqueues and processes an Enrichment Job without crashing or infinitely looping. 
*   [ ] Log Analytics Workspace confirms no 500 errors regarding database connection pool exhaustion.

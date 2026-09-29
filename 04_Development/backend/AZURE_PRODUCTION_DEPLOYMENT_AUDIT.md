# YRecall — Azure Production Deployment Audit

## 1. Executive Summary
This audit provides a comprehensive, read-only analysis of the current YRecall codebase (FastAPI backend + Expo mobile app) to prepare for an Azure production deployment. The architecture relies on FastAPI, a synchronous PostgreSQL connection (psycopg2), Firebase Auth, Supabase Storage, and Google Gemini AI. The codebase currently lacks containerization and production-ready server configurations, but the fundamental architecture is stateless enough to be securely deployed on Azure Container Apps.

**Current Overall Readiness Score:** 65/100

---

## 2. Current Architecture
- **Backend:** FastAPI (v0.111.0+) running on Python.
- **Database:** PostgreSQL (via Supabase) with `pgvector`.
- **Authentication:** Firebase Auth (JWTs verified via Admin SDK).
- **Storage:** Supabase Storage (Public Buckets).
- **AI/LLM:** Google Gemini (`google-genai`), Groq, and OpenRouter.
- **Emails:** Resend (and Zoho SMTP).
- **Mobile Client:** Expo React Native (Axios API client).

---

## 3. FastAPI Audit
- **Entry Point:** `app.main:app`
- **ASGI Server:** Uvicorn (currently running locally, no production `gunicorn` setup or config).
- **Lifespan/Startup:** Initializes billing plans synchronously via `subscription_service.seed_default_plans(db)` and starts an in-memory `ai_worker`.
- **Worker Concurrency:** **WARNING:** The `ai_worker` runs as an `asyncio` task within the FastAPI event loop, pulling jobs from the database. In a multi-worker or multi-container production setup, this will cause redundant processing unless properly locked.
- **Synchronous Routes:** Route handlers (e.g., `create_text_capture`) are defined using standard `def` (not `async def`). This forces FastAPI to run them in Starlette's external threadpool, safely preventing the `psycopg2` synchronous database calls from blocking the async event loop.

---

## 4. Dependency Audit
- **FastAPI/Uvicorn:** Present and up to date.
- **Database:** `SQLAlchemy >= 2.0.0`, `psycopg2-binary` (Synchronous driver), `pgvector`.
- **Storage:** `supabase >= 2.5.0` (synchronous python client).
- **Auth:** `firebase-admin >= 6.5.0`.
- **Build/Native Issues:** `psycopg2-binary` is suitable for local dev and standard Linux containers, but compiling it from source via `psycopg2` is recommended in production Dockerfiles to avoid Alpine/Debian GLIBC mismatches.

---

## 5. Environment/Secrets Audit
*Extracted from `app/core/config.py` and `.env.example`.*

| Variable | Purpose | Secret? | Source |
|----------|---------|---------|--------|
| `DATABASE_URL` | PostgreSQL connection | Yes | Backend |
| `SUPABASE_URL` | Storage API endpoint | No | Backend |
| `SUPABASE_SERVICE_KEY` | Storage Admin Access | Yes | Backend |
| `FIREBASE_SERVICE_ACCOUNT_PATH`| Firebase Admin SDK JSON | Yes | Backend |
| `GEMINI_API_KEY` | AI Generation | Yes | Backend |
| `RAZORPAY_KEY_SECRET` | Billing/Payments | Yes | Backend |
| `RESEND_API_KEY` | Transactional Emails | Yes | Backend |

**Mobile App (`mobile/src/config/env.ts`):**
- `EXPO_PUBLIC_API_URL`: Exposed to the mobile bundle.
- `EXPO_PUBLIC_APP_ENV`: Exposed to the mobile bundle.
*No backend secrets are currently hardcoded or leaked into the mobile codebase.*

---

## 6. Database Audit
- **Driver:** `psycopg2` (Synchronous).
- **Pooling:** Configured in `app/core/database.py` with `pool_size=10` and `max_overflow=20`. 
- **Production Implication:** If Azure scales to 4 containers with 4 Uvicorn workers each, total max connections = 4 * 4 * 30 = 480 connections. This will quickly exhaust Supabase's direct connection limits. You **MUST** use Supabase's IPv4 connection pooler (Supavisor) on port 5432 or 6543 in Azure.
- **Migrations:** Alembic is configured (`alembic.ini` present), meaning schema management is properly detached from app startup.

---

## 7. Supabase Audit
- **Storage Profile:** Uses the `captures` bucket configured as `public: True`.
- **Client:** Uses `supabase.storage.from_().upload()`.
- **Security:** Relies on backend validation; the mobile app does NOT possess the `SUPABASE_SERVICE_KEY`. This is highly secure and Azure-ready.
- **Egress:** Previous egress optimization (lazy audio) correctly prevents massive CDN bandwidth loops.

---

## 8. Firebase Audit
- **Integration:** Mobile app gets JWTs, sends them in `Authorization: Bearer` header.
- **Validation:** `app.core.security.verify_firebase_token` uses the Firebase Admin SDK to decode JWTs.
- **User Provisioning:** Automatically provisions a PostgreSQL `User` record on first valid token validation.
- **Production Implication:** Highly robust. The Firebase JSON key must be securely mounted in Azure (e.g., via Azure Key Vault or base64 env var decoding) because Azure Container Apps don't have persistent local file storage for the raw JSON file.

---

## 9. Gemini Audit
- **Implementation:** Uses `google-genai` SDK.
- **Architecture:** `app.core.ai.worker` processes background jobs. 
- **Production Implication:** Because the AI worker is an in-memory loop (`asyncio.create_task`), scaling Azure Container Apps to >1 instance means multiple instances will blindly poll the database simultaneously. Database locking (`fetch_and_lock_next_job`) appears to be implemented, which mitigates race conditions, but this pattern is fragile under heavy load.

---

## 10. Resend / Email Audit
- **Implementation:** Configured in `config.py` with fallback Zoho SMTP.
- **Production Implication:** Standard API calls, stateless and perfectly safe for Azure.

---

## 11. Razorpay Test Integration Audit
- **Implementation:** Expects `RAZORPAY_KEY_ID`, `RAZORPAY_KEY_SECRET`, and a webhook secret.
- **Production Implication:** The current code is prepared for test mode. Live keys should be injected strictly via Azure Environment Variables.

---

## 12. Security & CORS Audit
- **CORS:** `app/main.py` explicitly allows `allow_origins=["*"]`. **This is unsafe for production.**
- **File Validation:** Files are streamed securely to Supabase.
- **Auth:** Standard HTTPBearer; highly secure.

---

## 13. Mobile ↔ Backend Audit
- **Current State:** Mobile `env.ts` defaults to `http://localhost:8001/api/v1`.
- **Production Implication:** When deploying, EAS Build must be passed `EXPO_PUBLIC_API_URL=https://api.yrecall.app/api/v1`. The code handles this via standard Axios initialization.

---

## 14. Storage/File-System Audit
- **Finding:** The backend does NOT persist files to the local disk. It passes bytes directly to Supabase (`upload_file_to_storage(file_bytes)`). 
- **Production Implication:** The FastAPI backend is 100% stateless regarding file storage. This is excellent and fully compatible with ephemeral Azure Container Apps.

---

## 15. Observability Audit
- **Current State:** Standard Python `logging` to stdout.
- **Production Implication:** Azure Container Apps will automatically capture standard output logs into Azure Log Analytics. No immediate Sentry/Datadog integration is required for v1.

---

## 16. Docker/Container Audit
- **Current State:** **No Dockerfile exists.**
- **Requirement:** A robust, multi-stage Python 3.11+ Dockerfile is required. It must install `gcc` and `libpq-dev` for `psycopg2`, install requirements, and boot via `gunicorn -k uvicorn.workers.UvicornWorker`.

---

## 17. Azure Service Comparison
| Service | Suitability | Note |
|---------|-------------|------|
| **Azure App Service** | Moderate | Good for quick apps, but slower deployments. |
| **Azure Container Apps (ACA)** | **Excellent** | Serverless Kubernetes. Scales to 0. Perfect for stateless FastAPI and native background workers. |
| **Azure Functions** | Poor | Requires heavy FastAPI rewrites to serverless handlers. |
| **Azure VM** | Poor | Too much operational overhead (OS patching, manual SSL). |

**Recommendation:** Azure Container Apps (ACA).

---

## 18. Recommended Azure Architecture
1. **Azure Container Registry (ACR):** Hosts the compiled backend Docker image.
2. **Azure Container Apps Environment:** The serverless networking boundary.
3. **Azure Container App (FastAPI):** Runs the Gunicorn/Uvicorn API.
4. **Azure Log Analytics Workspace:** Centralizes standard output logs.
5. **Azure Key Vault (Optional):** To store Firebase JSON and Database URLs safely.

---

## 19. Azure Resource Plan (Student Credit Optimized)
- `rg-yrecall-prod` (Resource Group) - *Free*
- `law-yrecall-prod` (Log Analytics) - *Free Tier available*
- `acrYrecallProd` (Container Registry) - *Basic Tier (~$5/mo)*
- `cae-yrecall-prod` (Container App Environment) - *Free*
- `ca-yrecall-api` (Container App) - *First 180,000 vCPU seconds free/mo*

---

## 20. Azure Cost/Safety Plan
- **Current Subscription:** $100 Student Credit.
- **Estimated Cost:** < $10/month for a small ACA instance scaled to zero when idle.
- **Danger Zones:** Accidental infinite AI polling loops keeping the container alive 24/7 (which consumes vCPU seconds). We must ensure the `ai_worker` goes idle when the queue is empty so ACA can scale down.
- **Safety Measure:** Set Maximum Replicas = 2 in ACA to strictly cap CPU usage.

---

## 21. Production Environment Strategy
- **Databases:** Create a separate Supabase project for Production to isolate from Development data.
- **Firebase:** Create a separate Firebase project (e.g., `yrecall-prod`) to isolate prod users.
- **Razorpay:** Use Live keys only in the Prod environment variables.

---

## 22. Domain/HTTPS Strategy
- **API URL:** `api.yrecall.app`
- **DNS:** Map a CNAME from `api` to the generated Azure Container App FQDN.
- **SSL:** Azure Container Apps provisions managed TLS certificates automatically for custom domains for free.

---

## 23. Future Deployment Procedure
1. Create Production Supabase/Firebase instances.
2. Write `Dockerfile` and `.dockerignore`.
3. Provision Azure ACR and push the image.
4. Provision Azure Container App and mount secrets.
5. Map custom domain and generate SSL.
6. Trigger Alembic DB migration against prod URL.
7. Build Mobile EAS with prod API URL.

---

## 24. Rollback Strategy
- **Container Level:** Azure Container Apps uses "Revisions". If a new deployment fails health checks, ACA automatically routes traffic to the previous healthy revision.
- **Database Level:** Take a manual pg_dump prior to running `alembic upgrade head`.

---

## 25. Readiness Score & Priorities

### Readiness Score: 65/100
Code is stateless and functionally ready, but lacks infrastructure definition (Docker/Gunicorn) and strict security boundaries (CORS).

### BLOCKERS
1. **No Dockerfile:** Must be created.
2. **Firebase Auth File Loading:** `FIREBASE_SERVICE_ACCOUNT_PATH` expects a local file. Azure env vars can't easily pass files. Code must be updated to optionally accept the JSON as a base64 encoded environment variable string.

### HIGH PRIORITY
1. **CORS Configuration:** `allow_origins=["*"]` must be restricted to `["https://yrecall.app", "http://localhost:8081"]`.
2. **Gunicorn Entrypoint:** Uvicorn alone shouldn't handle internet traffic. A `gunicorn` configuration is required.
3. **Database Connection Pooling:** Must route to Supabase via IPv4 Supavisor to prevent max connection crashes.

### MEDIUM PRIORITY
1. **AI Worker Concurrency:** Ensure `fetch_and_lock_next_job` reliably uses PostgreSQL `FOR UPDATE SKIP LOCKED` to prevent duplicate AI generations when Azure runs multiple containers.

### OPTIONAL
1. Continuous Integration (GitHub Actions) for automatic ACR pushing.

---
**CONFIRMATION:**
NO SOURCE CODE, DATABASE, SUPABASE CONFIGURATION, FIREBASE CONFIGURATION, RAZORPAY CONFIGURATION, AZURE RESOURCE, MOBILE API URL, OR DEPLOYMENT HAS BEEN MODIFIED. THIS IS A READ-ONLY AUDIT.

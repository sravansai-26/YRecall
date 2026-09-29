# YRecall Security Policy

## Reporting a Vulnerability

If you discover a security vulnerability within YRecall, please do not disclose it publicly. Contact the core team directly. We take all security vulnerabilities seriously and will address them promptly.

## Security Architecture

YRecall employs the following security controls:

### 1. Authentication
- **Firebase Auth**: All user authentication is handled via Firebase.
- **Identity Verification**: The backend explicitly verifies the Firebase JWT tokens on every authenticated request and derives the user's identity from the signed token payload. It does not trust client-supplied user IDs.

### 2. User Isolation
- **Application-Level Segregation**: Database queries to fetch, update, and delete captures are strictly scoped to the authenticated user's ID via the FastAPI backend logic.
- **AI Conversation Isolation**: Semantic search results and AI chat history retrieved for Gemini context are scoped strictly to the authenticated user's ID (or their authorized workspaces).

### 3. Storage Security
- **Private Buckets**: All user-uploaded media (photos, videos, audio, documents) is stored in private Supabase Storage buckets.
- **Signed expiring URLs**: Media access is controlled via short-lived, cryptographically signed URLs (HMAC-SHA256) generated dynamically by the backend upon verified requests.

### 4. API Security
- **Backend Environment**: The API is hosted on Render over HTTPS. 
- **Parameterization**: Database access uses the SQLAlchemy ORM, which safely parameterizes queries to prevent SQL Injection.
- **Secrets Management**: All critical secrets (Supabase Service keys, Gemini API keys, Firebase Admin JSON) reside entirely server-side in environment variables and are never bundled in the mobile application.

## Known Limitations / In-Progress Hardening

- **Database RLS**: Row-Level Security (RLS) is currently not strictly necessary in Supabase because all database access is exclusively routed through the FastAPI backend's Service Role, where strict application-level scoping (`current_user.id`) is enforced. Direct client-to-database access is disabled.

## Supported Versions
Only the latest release is actively supported for security updates.

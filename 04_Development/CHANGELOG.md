# YRecall Development Changelog

This document tracks the progressive development work, new features, bug fixes, and architectural updates applied to the YRecall project.

## [Recent Updates] - August 2026

### Features & Implementations
- **Legal Compliance:** Integrated dynamic Terms of Service and Privacy Policy screens with clickable email links (`support@yrecall.app` and `privacy@yrecall.app`).
- **Password Recovery Flow:** Created fully functional "Forgot Password" and "Reset Password" screens integrating securely with Firebase Authentication, ensuring a complete and seamless manual email user journey.

### UI & UX Improvements
- **Input Visibility:** Changed text input values and placeholder colors to `colors.outline` on Authentication screens (SignIn, Create Account, Reset Password) for clear legibility on dark/colored backgrounds.
- **Password Toggles:** Added eye (open/close) icons for toggling password visibility in all manual email auth screens.
- **Account Picker:** Added `GoogleSignin.signOut()` step during the global logout sequence to properly clear Google's aggressive session caching. Now the Google account picker UI shows every time you click "Continue with Google" after logging out.

### Backend & AI Migrations
- **OpenRouter Resolution:** Updated `google/gemini-2.5-flash:free` model configurations to the standard `google/gemini-2.5-flash` slug to resolve OpenRouter 404 errors as the free tier was deprecated.
- **Groq Deprecation Migration:** Successfully transitioned workloads from the decommissioned `llama-3.1-8b-instant` model to the recommended `gpt-oss-20b` for background AI tasks (summaries and notifications).

### Fixes & Networking
- **FCM Token Network Error (AxiosError):** 
  - Adjusted mobile `.env` API URL to utilize the PC's mobile hotspot IP (`192.168.137.1`), bypassing strict local Windows Defender Firewall constraints.
  - Added `usesCleartextTraffic: true` to the Expo configuration (`app.config.js`) to allow seamless local development connections over HTTP on Android 9+.

### Security Updates
- Centralized secrets management by deploying a comprehensive root `.gitignore` file.
- Prevented accidental exposure of `.env` files, `google-services.json`, `GoogleService-Info.plist`, Firebase Admin SDK credentials, and backend/mobile virtual environments.

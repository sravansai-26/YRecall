# YRecall Privacy Policy

## 1. Data Collected
YRecall is a personal digital intelligence layer that processes data you explicitly capture or interact with, which may include:
- Text notes and captures
- Audio (voice captures)
- Photos and Media
- Location (if enabled for captures)
- AI chat conversations
- Device information and basic analytics

## 2. Why it is Collected
This data is collected solely to build your personal memory graph, enable semantic search, and provide context-aware AI interactions.

## 3. Storage
Your data is securely stored in our backend infrastructure powered by:
- **Supabase (PostgreSQL)** for structured database records and embeddings.
- **Private Supabase Storage** for your uploaded files and media (accessed securely via expiring signed URLs).

## 4. AI Processing
YRecall uses Google's **Gemini AI** API to power intelligent features.
- When you use the AI chat, only the relevant fragments of your past captures (determined via vector semantic search) are sent to Gemini to answer your question. 
- When you upload audio, it is sent to Gemini for transcription.
- The Gemini API is accessed securely server-side. 
- *Note: YRecall does not send your entire database to the AI.*

## 5. Third-Party Providers
YRecall relies on the following major third-party services:
- **Firebase**: For user authentication and identity management.
- **Supabase**: For database and storage.
- **Render**: For hosting the backend API.
- **Google Cloud / Gemini**: For AI processing.

## 6. User Rights, Export, and Deletion
- **Export**: Users can export their entire digital intelligence layer (Captures, Metadata, Insights) as a single archive directly from the Settings > Account menu.
- **Deletion**: Users have the right to request full account deletion via the app. Account deletion initiates a permanent purge of database records, AI conversations, and linked media files in storage.

## 7. Retention
- Captured memories and AI conversations are retained as long as your account is active.
- Data associated with a deleted account is purged.

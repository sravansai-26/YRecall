# API Specification

## YRecall – AI Life Operating System

Version: 1.0

Status: Approved

API Version: v1

Architecture: REST-first (Future GraphQL & Streaming Support)

Owner: LYFSpot

Last Updated: July 2026

---

# Purpose

This document defines the official API contract for YRecall.

It standardizes communication between:

* Mobile Application
* Backend Services
* AI Services
* Future Web Application
* Desktop Application
* Third-Party Integrations

The API should remain:

* Consistent
* Predictable
* Secure
* Versioned
* Backward Compatible

---

# API Principles

Every endpoint should follow these principles:

* RESTful resource design.
* Consistent naming.
* Predictable responses.
* Standard HTTP status codes.
* Secure by default.
* Idempotent where applicable.
* Pagination for collections.
* Structured validation.
* Detailed error reporting.

---

# Base URL

Development

```text id="api1"
http://localhost:8000/api/v1
```

Staging

```text id="api2"
https://staging-api.yrecall.app/api/v1
```

Production

```text id="api3"
https://api.yrecall.app/api/v1
```

---

# Versioning Strategy

Every endpoint begins with:

```text id="api4"
/api/v1/
```

Future versions:

```text id="api5"
/api/v2/
/api/v3/
```

Breaking changes must never be introduced within the same API version.

---

# Authentication

Authentication uses JWT access tokens.

Authorization Header

```http id="api6"
Authorization: Bearer <access_token>
```

Protected endpoints require authentication unless explicitly marked as public.

---

# Standard Response Format

Successful Response

```json id="api7"
{
  "success": true,
  "message": "Operation completed successfully.",
  "data": {},
  "meta": {}
}
```

Error Response

```json id="api8"
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid request.",
    "details": []
  }
}
```

This format must be used consistently across all endpoints.

---

# HTTP Status Codes

| Status | Meaning               |
| ------ | --------------------- |
| 200    | Success               |
| 201    | Resource Created      |
| 204    | No Content            |
| 400    | Bad Request           |
| 401    | Unauthorized          |
| 403    | Forbidden             |
| 404    | Not Found             |
| 409    | Conflict              |
| 413    | Payload Too Large     |
| 422    | Validation Failed     |
| 429    | Rate Limited          |
| 500    | Internal Server Error |

---

# Pagination Standard

Collection endpoints should support:

Query Parameters

```text id="api9"
?page=1

&page_size=20

&sort=created_at

&order=desc
```

Response

```json id="api10"
{
  "meta": {
    "page": 1,
    "page_size": 20,
    "total_pages": 8,
    "total_items": 154
  }
}
```

---

# Filtering

Examples

```text id="api11"
?type=document

?category=project

?date_from=

?date_to=

?workspace=

?favorite=true
```

---

# Searching

Endpoints should support:

* Keyword Search
* Semantic Search
* Entity Search
* Date Filters
* Tags
* Categories
* AI Search

---

# Rate Limiting

Public APIs

100 requests/minute

Authenticated Users

600 requests/minute

AI Endpoints

Usage depends on subscription tier.

---

# Authentication APIs

Base

```text id="api12"
/auth
```

Endpoints

```text id="api13"
POST /register

POST /login

POST /logout

POST /refresh-token

POST /forgot-password

POST /reset-password

POST /verify-email

POST /send-otp

POST /verify-otp

GET /me

DELETE /account
```

---

# User APIs

```text id="api14"
/users
```

Endpoints

```text id="api15"
GET /profile

PATCH /profile

GET /preferences

PATCH /preferences

GET /devices

DELETE /devices/{id}
```

---

# Capture APIs

```text id="api16"
/captures
```

Endpoints

```text id="api17"
POST /

GET /

GET /{id}

PATCH /{id}

DELETE /{id}

POST /upload

POST /voice

POST /ocr

POST /scan

POST /share
```

---

# Attachment APIs

```text id="api18"
/attachments
```

Endpoints

```text id="api19"
POST /

GET /{id}

DELETE /{id}

GET /download
```

---

# AI APIs

```text id="api20"
/ai
```

Endpoints

```text id="api21"
POST /chat

POST /stream

POST /summarize

POST /reflect

POST /recommend

POST /analyze

POST /feedback

GET /history
```

---

# Search APIs

```text id="api22"
/search
```

Endpoints

```text id="api23"
GET /

GET /semantic

GET /voice

GET /image

GET /saved

POST /save
```

---

# Timeline APIs

```text id="api24"
/timeline
```

Endpoints

```text id="api25"
GET /daily

GET /weekly

GET /monthly

GET /yearly

GET /highlights
```

---

# Knowledge Graph APIs

```text id="api26"
/graph
```

Endpoints

```text id="api27"
GET /entities

GET /entities/{id}

PATCH /entities/{id}

POST /merge

POST /split

POST /relationship

DELETE /relationship
```

---

# Reminder APIs

```text id="api28"
/reminders
```

Endpoints

```text id="api29"
POST /

GET /

PATCH /{id}

DELETE /{id}

POST /snooze
```

---

# Notification APIs

```text id="api30"
/notifications
```

Endpoints

```text id="api31"
GET /

PATCH /read

DELETE /clear

GET /preferences

PATCH /preferences
```

---

# Workspace APIs

```text id="api32"
/workspaces
```

Endpoints

```text id="api33"
POST /

GET /

PATCH /{id}

DELETE /{id}

POST /invite

PATCH /members

DELETE /members
```

---

# Subscription APIs

```text id="api34"
/subscriptions
```

Endpoints

```text id="api35"
GET /plans

POST /upgrade

POST /cancel

GET /billing

GET /history

GET /invoice
```

---

# Settings APIs

```text id="api36"
/settings
```

Endpoints

```text id="api37"
GET /

PATCH /

GET /privacy

PATCH /privacy

GET /security

PATCH /security
```

---

# Import APIs

```text id="api38"
/imports
```

Supported Sources

* Google Drive
* Apple Notes
* Google Keep
* Notion
* Obsidian
* Markdown
* PDF

Endpoints

```text id="api39"
POST /

GET /status

GET /history
```

---

# Export APIs

```text id="api40"
/exports
```

Endpoints

```text id="api41"
POST /

GET /status

GET /download
```

Supported Formats

* PDF
* JSON
* Markdown
* ZIP

---

# Analytics APIs

Internal only.

Examples

```text id="api42"
/analytics/events

/analytics/dashboard

/analytics/retention
```

---

# Admin APIs

Restricted.

Examples

```text id="api43"
/admin/users

/admin/workspaces

/admin/jobs

/admin/system
```

---

# File Upload Strategy

Uploads use multipart/form-data.

Large uploads should support:

* Chunking
* Resume
* Retry
* Progress tracking

Supported file types include:

* Images
* Audio
* Video
* PDF
* Documents

---

# AI Streaming

Long-running AI responses should support streaming.

Capabilities include:

* Incremental text generation.
* Typing indicators.
* Cancellation.
* Partial results.
* Source attribution.
* Confidence updates.

---

# Webhooks (Future)

Enterprise integrations may subscribe to events.

Examples

* Capture Created
* Entity Updated
* Reminder Triggered
* Workspace Invitation
* Subscription Changed

---

# API Security

Every endpoint should enforce:

* JWT Authentication
* Authorization
* Input Validation
* Rate Limiting
* Audit Logging
* HTTPS
* CSRF protection where applicable
* Request size limits

---

# API Documentation

All endpoints should be automatically documented using OpenAPI.

Documentation must include:

* Request examples
* Response examples
* Validation rules
* Error responses
* Authentication requirements

---

# Deprecation Policy

Deprecated endpoints should:

* Remain available during the transition period.
* Return deprecation warnings.
* Be removed only after adequate notice.

Backward compatibility should be maintained whenever practical.

---

# Future API Evolution

Potential additions include:

* GraphQL Gateway
* Real-time WebSockets
* Server-Sent Events
* AI Agent APIs
* Public Developer SDK
* Automation APIs
* Marketplace APIs

New capabilities should extend the API without disrupting existing integrations.

---

# Engineering Guidelines

When creating new endpoints:

* Use nouns rather than verbs where appropriate.
* Keep URLs concise.
* Return consistent response formats.
* Validate all input.
* Avoid exposing internal implementation details.
* Ensure idempotency for safe operations.
* Document every endpoint before release.

---

# Conclusion

The API is the communication backbone of YRecall.

A stable, well-documented API enables independent development of mobile applications, backend services, AI systems, and future integrations while maintaining reliability and long-term maintainability.

Every endpoint should reinforce YRecall's goals of simplicity, consistency, security, and scalability.

---

> **An API is a promise. Design it carefully, maintain it responsibly, and let it evolve without breaking the trust of those who depend on it.**

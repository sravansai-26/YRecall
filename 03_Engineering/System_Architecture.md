# System Architecture

## YRecall – AI Life Operating System

Version: 1.0

Status: Approved

Owner: LYFSpot

Last Updated: July 2026

---

# Purpose

This document defines the overall software architecture of YRecall.

It explains how every major subsystem works together to deliver a secure, scalable, AI-powered Life Operating System.

The architecture is designed to support:

* Millions of users
* AI-first workflows
* Offline-first mobile experience
* Secure cloud synchronization
* Long-term maintainability
* Modular engineering
* Cross-platform expansion

This document serves as the master engineering blueprint for the entire product.

---

# Architecture Principles

Every architectural decision must satisfy the following principles:

* Separation of Responsibilities
* Modular Services
* API-First Design
* AI-Native Architecture
* Offline Capability
* Privacy by Design
* Horizontal Scalability
* Explainable AI
* Observability
* Fault Tolerance

---

# High-Level Architecture

```text
                        ┌──────────────────────┐
                        │   React Native App   │
                        └──────────┬───────────┘
                                   │
                             HTTPS / JWT
                                   │
                        ┌──────────▼───────────┐
                        │      API Gateway     │
                        └──────────┬───────────┘
        ┌──────────────────────────┼──────────────────────────┐
        │                          │                          │
        ▼                          ▼                          ▼
 Authentication              Capture Service           Search Service
        │                          │                          │
        ▼                          ▼                          ▼
 User Service               AI Processing          Knowledge Graph
        │                          │                          │
        └──────────────┬───────────┴───────────────┬──────────┘
                       ▼                           ▼
                Timeline Service           Notification Service
                       │                           │
                       └──────────────┬────────────┘
                                      ▼
                               PostgreSQL + pgvector
                                      │
                                      ▼
                              Object Storage (Files)
```

---

# Architectural Layers

The platform is divided into six logical layers.

---

## Layer 1 — Presentation Layer

Responsible for everything the user sees and interacts with.

Components

* React Native Mobile App
* UI Components
* Navigation
* Local State
* Offline Cache
* Device Integrations

Responsibilities

* User interaction
* Rendering
* Input collection
* Offline experience
* Authentication state

---

## Layer 2 — API Layer

Acts as the single entry point into the backend.

Responsibilities

* Authentication
* Authorization
* Request validation
* Rate limiting
* Routing
* Logging
* Error formatting

No business logic should exist in this layer.

---

## Layer 3 — Business Logic Layer

Contains all product functionality.

Modules

* User Service
* Capture Service
* Timeline Service
* Search Service
* Reminder Service
* Notification Service
* Subscription Service
* Collaboration Service
* AI Service

Each module owns its own business rules.

---

## Layer 4 — AI Intelligence Layer

The intelligence engine of YRecall.

Responsibilities

* OCR
* Speech-to-Text
* Entity Extraction
* Relationship Detection
* Summarization
* Embeddings
* Semantic Search
* AI Chat
* Recommendations
* Reflection
* Confidence Scoring

The AI layer never communicates directly with the mobile application.

All requests pass through backend services.

---

## Layer 5 — Data Layer

Responsible for persistence.

Components

* PostgreSQL
* pgvector
* Object Storage
* Redis Cache

Responsibilities

* Structured data
* Vector embeddings
* File storage
* Session cache
* Search indexes

---

## Layer 6 — Infrastructure Layer

Provides operational capabilities.

Components

* Docker
* GitHub Actions
* Render
* Cloudflare
* Monitoring
* Logging
* Analytics
* Crash Reporting

---

# Core Services

---

## Authentication Service

Responsibilities

* Registration
* Login
* JWT Tokens
* Session Management
* Password Reset
* OAuth
* Device Sessions

Dependencies

* Supabase Auth

---

## User Service

Responsibilities

* Profiles
* Preferences
* AI Persona
* Privacy Settings
* Subscription Status

---

## Capture Service

The primary ingestion system.

Supported Inputs

* Text
* Voice
* Photo
* Video
* PDF
* Screenshot
* Clipboard
* URL
* OCR
* QR Codes

Responsibilities

* Accept uploads
* Validate content
* Queue AI processing
* Store original files

---

## AI Processing Service

Receives newly captured content.

Pipeline

* Content Extraction
* Language Detection
* OCR
* Speech Recognition
* Entity Extraction
* Relationship Mapping
* Embedding Generation
* Knowledge Graph Update
* Timeline Update
* Summary Generation

Processing occurs asynchronously where appropriate.

---

## Search Service

Supports:

* Keyword Search
* Semantic Search
* Image Search
* Voice Search
* Entity Search

Search combines structured filters with vector similarity.

---

## Knowledge Graph Service

Responsibilities

* Entity creation
* Relationship management
* Duplicate detection
* Graph traversal
* Graph editing
* AI relationship suggestions

---

## Timeline Service

Maintains a chronological representation of user activity.

Supports

* Daily
* Weekly
* Monthly
* Yearly
* AI Highlights

---

## Notification Service

Generates:

* Smart reminders
* AI suggestions
* Security alerts
* Collaboration updates
* Subscription events

---

## Collaboration Service

Responsibilities

* Teams
* Families
* Shared workspaces
* Roles
* Permissions
* Shared graphs

---

## Subscription Service

Responsibilities

* Plan management
* Billing
* Invoices
* Payment verification
* Upgrade/Downgrade

---

# Background Processing

Certain operations should never block the user interface.

Background Jobs include:

* OCR
* AI Summaries
* Embedding Generation
* Import Jobs
* Export Jobs
* Notifications
* Relationship Discovery
* Daily Insights
* Weekly Reports

Workers process these jobs asynchronously.

---

# Data Flow

## Example: User Captures a Screenshot

```text
User

↓

Capture Screen

↓

Capture Service

↓

Store Original File

↓

AI Queue

↓

OCR

↓

Entity Extraction

↓

Embedding Generation

↓

Knowledge Graph Update

↓

Timeline Update

↓

AI Summary

↓

Search Index Update

↓

User Receives Confirmation
```

---

# Communication Principles

Services communicate through well-defined APIs.

No service should directly modify another service's internal data.

Shared logic should exist only where genuinely reusable.

Loose coupling is preferred over tight integration.

---

# Offline Architecture

The mobile application maintains a secure local cache.

Offline actions are stored in a synchronization queue.

When connectivity returns:

* Upload pending captures.
* Download updates.
* Resolve conflicts.
* Confirm synchronization.

Users should continue using core functionality even without internet access.

---

# Scalability Strategy

The architecture is designed to evolve.

Initial Phase

Monolithic backend with modular services.

Growth Phase

Split services into independently deployable components as traffic increases.

Potential future separation:

* AI Service
* Search Service
* Notification Service
* Collaboration Service

The goal is to delay complexity until justified by scale.

---

# Fault Tolerance

If one subsystem fails:

Example

AI temporarily unavailable.

Expected behavior

* Capture still succeeds.
* File is safely stored.
* AI processing retries automatically.
* User receives status updates.

Failures should degrade gracefully rather than prevent users from working.

---

# Security Architecture

Every request passes through:

* Authentication
* Authorization
* Validation
* Logging

Sensitive information remains encrypted both in transit and at rest where applicable.

Detailed security implementation is defined in the Security Architecture document.

---

# Observability

Every service should expose:

* Health checks
* Structured logs
* Performance metrics
* Error tracking
* Queue status
* AI processing latency
* API latency

Monitoring is essential for production reliability.

---

# Future Evolution

The architecture is intentionally modular.

Future capabilities may include:

* Desktop clients
* Browser extension
* Wearables
* On-device AI
* Enterprise deployment
* Public APIs
* AI Marketplace
* Third-party integrations

These additions should extend the architecture without requiring major redesign.

---

# Engineering Principles

Every new service should:

* Have a single responsibility.
* Be independently testable.
* Avoid unnecessary coupling.
* Fail gracefully.
* Be observable.
* Be secure by default.
* Scale horizontally when required.

---

# Conclusion

The YRecall architecture is designed to support long-term growth while remaining practical for an early-stage engineering team.

By separating concerns into well-defined layers and modular services, the platform can evolve from a mobile application into a comprehensive AI Life Operating System without compromising maintainability or user trust.

Every engineering decision should reinforce the architecture described in this document.

---

> **Architecture is not about adding complexity. It is about creating clarity that allows complexity to grow in a controlled way.**

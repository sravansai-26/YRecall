# Database Design

## YRecall – AI Life Operating System

Version: 1.0

Status: Approved

Owner: LYFSpot

Database: PostgreSQL 17 + pgvector

Last Updated: July 2026

---

# Purpose

This document defines the database architecture of YRecall.

It establishes how application data is stored, related, indexed, secured, synchronized, queried, and maintained.

The database is the foundation of YRecall.

Every AI capability, search result, knowledge graph relationship, timeline event, notification, reminder, collaboration feature, and insight ultimately depends on the integrity of the data model.

This document provides the blueprint for building a scalable, secure, and maintainable database capable of supporting millions of users.

---

# Database Design Principles

The database architecture follows these principles:

* Normalize where appropriate.
* Denormalize only when measurable performance improvements justify it.
* Preserve historical records.
* Avoid destructive updates whenever possible.
* Every record should be traceable.
* Design for horizontal scalability.
* Keep AI-generated information separate from user-generated information.
* Maintain clear ownership of every entity.

---

# Database Technologies

| Component        | Technology       |
| ---------------- | ---------------- |
| Primary Database | PostgreSQL 17    |
| Vector Storage   | pgvector         |
| Cache            | Redis            |
| Object Storage   | Supabase Storage |
| Migrations       | Alembic          |
| ORM              | SQLAlchemy 2.x   |
| Query Builder    | SQLAlchemy ORM   |

---

# Database Domains

Instead of creating unrelated tables, YRecall organizes data into logical domains.

```text
Authentication

↓

Users

↓

Capture

↓

Knowledge

↓

AI Intelligence

↓

Timeline

↓

Search

↓

Notifications

↓

Collaboration

↓

Subscription

↓

Analytics

↓

System
```

Each domain owns its own entities and relationships.

---

# Domain 1 — Authentication

Purpose

Manage identity and access.

Core Tables

* users
* sessions
* refresh_tokens
* oauth_accounts
* devices
* login_history
* password_reset_tokens
* email_verifications

---

# Domain 2 — User Profile

Purpose

Store personal preferences.

Core Tables

* user_profiles
* preferences
* ai_personas
* languages
* themes
* accessibility_settings
* notification_preferences

---

# Domain 3 — Capture

Purpose

Store everything users save.

Core Tables

* captures
* attachments
* images
* videos
* audio_files
* documents
* urls
* clipboard_items
* scanned_documents
* ocr_results
* uploads

Every captured item begins here.

---

# Domain 4 — Knowledge Graph

Purpose

Represent user knowledge.

Core Tables

* entities
* entity_types
* relationships
* relationship_types
* entity_aliases
* graph_clusters
* entity_versions
* merged_entities

The knowledge graph is the intellectual core of YRecall.

---

# Domain 5 — AI Intelligence

Purpose

Store AI-generated information.

Core Tables

* ai_conversations
* ai_messages
* ai_summaries
* ai_embeddings
* ai_recommendations
* ai_reflections
* ai_confidence_scores
* ai_sources
* ai_feedback

User data and AI interpretations remain separate.

---

# Domain 6 — Timeline

Purpose

Build chronological life history.

Core Tables

* timeline_events
* timeline_groups
* timeline_highlights
* timeline_labels

---

# Domain 7 — Search

Purpose

Power retrieval.

Core Tables

* search_history
* saved_searches
* search_index
* embedding_index
* search_clicks

---

# Domain 8 — Reminders

Core Tables

* reminders
* recurring_rules
* reminder_notifications
* snooze_history

---

# Domain 9 — Notifications

Core Tables

* notifications
* notification_templates
* delivery_history
* push_tokens

---

# Domain 10 — Collaboration

Core Tables

* workspaces
* workspace_members
* workspace_roles
* shared_entities
* shared_captures
* invitations
* permissions

---

# Domain 11 — Subscription

Core Tables

* subscriptions
* plans
* invoices
* payment_methods
* transactions
* billing_history

---

# Domain 12 — Analytics

Core Tables

* app_events
* feature_usage
* session_metrics
* retention_metrics
* crash_events

Personally identifiable information should never be stored unnecessarily.

---

# Domain 13 — System

Core Tables

* audit_logs
* system_settings
* migration_history
* background_jobs
* failed_jobs
* webhooks
* api_keys

---

# Estimated Database Size

Version 1

Approximately 80–100 tables.

Version 2

120–150 tables.

Enterprise

150+ tables.

Growth should occur through modular domains rather than uncontrolled expansion.

---

# Primary Relationships

```text
User

↓

Capture

↓

Entity

↓

Relationship

↓

Timeline

↓

Search

↓

AI

↓

Insights
```

This chain forms the primary data flow of YRecall.

---

# AI Embeddings

Every searchable object may have an associated vector embedding.

Examples

* Capture
* Entity
* Conversation
* Summary
* Document

Embeddings are stored separately from raw content to simplify updates and improve retrieval performance.

---

# Soft Deletes

Most user-owned records should support soft deletion.

Fields

* deleted_at
* deleted_by

This allows:

* Recovery
* Auditing
* Sync conflict resolution

Permanent deletion is reserved for account deletion workflows.

---

# Audit Trail

Important operations should be recorded.

Examples

* Login
* Password Change
* Entity Merge
* Graph Edit
* AI Correction
* Subscription Upgrade
* Workspace Permission Changes

Audit records should be immutable.

---

# Version History

Critical objects support versioning.

Examples

* Documents
* Notes
* AI Summaries
* Entity Profiles

Users should be able to restore previous versions where appropriate.

---

# Search Optimization

Indexes should exist for:

* User ID
* Created Date
* Updated Date
* Entity Type
* Timeline Date
* Workspace ID
* Subscription Status

Vector indexes should be optimized for semantic search performance.

---

# Performance Strategy

Large operations should avoid full table scans.

Preferred techniques

* Proper indexing.
* Pagination.
* Cursor-based navigation.
* Materialized views where appropriate.
* Cached aggregates.

---

# Multi-Tenancy

The database must support:

* Personal users.
* Families.
* Teams.
* Organizations.

Workspace boundaries should be enforced through ownership and permissions.

---

# Data Ownership

Every record must have a clear owner.

Possible owners include:

* User
* Workspace
* Organization
* System

Ownership simplifies authorization and data portability.

---

# Backup Strategy

Production databases should support:

* Automated daily backups.
* Point-in-time recovery.
* Multi-region storage.
* Backup validation.

Backup procedures should be tested regularly.

---

# Data Retention

General principles

* Preserve user content unless explicitly deleted.
* Remove temporary processing data after completion.
* Retain audit logs according to policy.
* Respect legal and regulatory requirements.

---

# Security

Sensitive fields should be encrypted where necessary.

Access control should follow the principle of least privilege.

Database credentials must never be stored in source code.

---

# Migration Strategy

Every schema modification must be introduced through version-controlled migrations.

Migration files should:

* Be reversible whenever practical.
* Preserve existing data.
* Include descriptive names.
* Be reviewed before production deployment.

---

# Future Expansion

Future domains may include:

* Wearables
* Email Intelligence
* Calendar Intelligence
* AI Automation
* Browser Extension
* Public APIs
* Marketplace
* Enterprise Administration

The schema should evolve through additional domains rather than disruptive redesign.

---

# Database Health Monitoring

The engineering team should continuously monitor:

* Query latency
* Index usage
* Storage growth
* Replication health
* Deadlocks
* Lock contention
* Cache hit ratio
* Connection pool usage

Healthy databases require continuous observation, not occasional optimization.

---

# Engineering Principles

The database should always prioritize:

* Consistency
* Reliability
* Security
* Maintainability
* Scalability
* Performance
* Recoverability
* Data Integrity

Every schema decision should reinforce these principles.

---

# Conclusion

The YRecall database is more than a storage layer.

It is the structured representation of a user's digital life.

By organizing data into clear domains, preserving historical context, supporting AI-native capabilities, and planning for future growth, the database architecture provides a stable foundation for YRecall to evolve into a true AI Life Operating System.

Every feature added to the platform should strengthen this foundation rather than compromise it.

---

> **A database does not merely store information. It preserves the memory, relationships, and history upon which intelligence is built.**

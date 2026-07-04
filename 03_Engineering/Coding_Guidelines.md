# Coding Guidelines

## YRecall – AI Life Operating System

Version: 1.0

Status: Approved

Owner: LYFSpot

Applies To:

* Mobile Application
* Backend Services
* AI Services
* Infrastructure
* Documentation
* Testing

Last Updated: July 2026

---

# Purpose

This document establishes the engineering standards for YRecall.

Its purpose is to ensure that every contributor produces code that is:

* Readable
* Maintainable
* Secure
* Testable
* Performant
* Consistent
* Well Documented

Engineering quality is measured not only by working software but by how understandable, reliable, and maintainable it remains over time.

---

# Engineering Philosophy

Every line of code should strive to:

* Solve one problem well.
* Be understandable by future contributors.
* Minimize unnecessary complexity.
* Prioritize long-term maintainability over short-term speed.
* Be easy to test.
* Fail safely.
* Respect user privacy.

Whenever two solutions exist, prefer the one that is simpler to understand and maintain.

---

# General Principles

Engineers should:

* Write clean code.
* Avoid duplication.
* Prefer composition over inheritance where appropriate.
* Keep functions small and focused.
* Keep modules independent.
* Remove unused code.
* Document important decisions.

Code should communicate intent clearly without requiring excessive comments.

---

# Project Structure

The repository should remain organized by responsibility.

```text
YRecall/

00_Brand/

01_Product/

02_Design/

03_Engineering/

04_Development/

05_Testing/

06_Docs/
```

Implementation code belongs only in the Development directory.

Documentation belongs in its respective documentation folders.

---

# Mobile Folder Structure

```text
app/

assets/

components/

features/

hooks/

navigation/

services/

store/

database/

theme/

utils/

types/

constants/

tests/
```

Each folder should have a clearly defined purpose.

---

# Backend Folder Structure

```text
app/

api/

core/

modules/

repositories/

services/

workers/

database/

models/

schemas/

middleware/

utils/

tests/
```

Every module should remain independent whenever practical.

---

# Naming Conventions

Folders

* lowercase
* singular where appropriate

Files

* descriptive
* lowercase with underscores where appropriate

Classes

* PascalCase

Functions

* camelCase

Variables

* camelCase

Constants

* UPPER_SNAKE_CASE

Enums

* PascalCase

Interfaces (TypeScript)

Avoid unnecessary prefixes.

Names should describe responsibility rather than implementation.

---

# File Organization

Each file should have a single responsibility.

Avoid files exceeding approximately 400–500 lines unless justified.

Large features should be split into logical modules.

---

# Function Design

Functions should:

* Perform one task.
* Have descriptive names.
* Return predictable results.
* Avoid side effects whenever possible.

Prefer several small functions over one large function.

---

# Component Design

UI components should:

* Be reusable.
* Be stateless where practical.
* Receive data through props.
* Avoid business logic.
* Remain accessible.

Complex logic belongs in hooks or services.

---

# State Management

Global state should contain only shared application state.

Feature-specific state should remain inside feature modules.

Temporary UI state should remain local to components.

Avoid unnecessary global state.

---

# API Guidelines

Controllers should:

* Validate requests.
* Delegate work to services.
* Return standardized responses.

Controllers should never contain business rules.

---

# Service Guidelines

Services contain:

* Business logic
* Workflow orchestration
* Domain rules

Services should remain independent from presentation concerns.

---

# Repository Guidelines

Repositories manage data access.

Responsibilities include:

* Reading
* Writing
* Updating
* Deleting
* Query optimization

Repositories should not contain business logic.

---

# Error Handling

Errors should:

* Be predictable.
* Use standardized error types.
* Include meaningful messages.
* Never expose sensitive implementation details.

Unexpected failures should always be logged.

---

# Logging

Log:

* Authentication events
* Background jobs
* AI processing
* Synchronization
* Critical business events

Avoid logging sensitive user information.

Logs should assist troubleshooting without compromising privacy.

---

# Documentation

Public functions should include meaningful documentation where helpful.

Complex algorithms should explain:

* Why the solution exists.
* Expected behavior.
* Important assumptions.

Documentation should explain intent rather than restating obvious code.

---

# Comments

Avoid excessive comments.

Good code should be self-explanatory.

Use comments only to explain:

* Business reasoning
* Architectural decisions
* Non-obvious logic
* Important warnings

Remove outdated comments promptly.

---

# Dependency Management

Before adding a dependency, evaluate:

* Is it actively maintained?
* Is it widely adopted?
* Does it solve a real problem?
* Can existing tools solve the same problem?
* Does it introduce unnecessary risk?

Prefer fewer, well-maintained dependencies.

---

# Git Workflow

Primary branches

```text
main

develop

feature/*

release/*

hotfix/*
```

Every feature should be developed in its own branch.

Direct commits to `main` should be avoided.

---

# Commit Messages

Use clear, descriptive commit messages.

Examples

```text
feat: add AI reflection service

fix: resolve offline synchronization issue

refactor: simplify search repository

docs: update deployment architecture

test: add timeline integration tests
```

Avoid vague messages such as:

* update
* changes
* fixes
* final

---

# Pull Requests

Every pull request should include:

* Purpose
* Summary of changes
* Screenshots (UI changes)
* Testing performed
* Breaking changes
* Related issues

Pull requests should remain focused and reasonably sized.

---

# Code Reviews

Reviewers should evaluate:

* Readability
* Architecture
* Security
* Performance
* Accessibility
* Test coverage
* Documentation
* Maintainability

Reviews should improve the codebase rather than simply approve changes.

---

# Testing Standards

Every feature should include appropriate tests.

Recommended coverage:

* Unit Tests
* Integration Tests
* API Tests
* UI Tests
* Offline Tests
* Accessibility Tests

Critical user journeys should receive the highest testing priority.

---

# Performance

Engineers should:

* Avoid unnecessary re-renders.
* Minimize database queries.
* Optimize expensive operations.
* Cache intelligently.
* Measure before optimizing.

Premature optimization should be avoided.

---

# Accessibility

Every user interface should support:

* Screen readers
* Dynamic text sizes
* Keyboard navigation where applicable
* Sufficient color contrast
* Large touch targets

Accessibility is a product requirement.

---

# Security

Engineers must:

* Validate all input.
* Never trust client data.
* Protect secrets.
* Avoid hardcoded credentials.
* Review authentication changes carefully.
* Follow the Security Architecture document.

Security reviews should accompany security-sensitive changes.

---

# AI Development Guidelines

AI features should:

* Retrieve before generating.
* Preserve source attribution.
* Avoid unsupported conclusions.
* Communicate uncertainty.
* Respect user privacy.
* Remain explainable.

AI should augment user understanding, not invent information.

---

# Documentation Standards

Every major feature should update:

* Product documentation
* Engineering documentation
* API documentation
* Changelog
* Architecture diagrams where necessary

Documentation should evolve alongside the software.

---

# Release Readiness

Before merging a feature:

* Tests pass.
* Documentation updated.
* Linting completed.
* Security considerations reviewed.
* Performance impact evaluated.
* Accessibility verified.
* No critical warnings remain.

Only production-ready code should be merged.

---

# Technical Debt

Technical debt should be:

* Identified
* Documented
* Prioritized
* Scheduled

Known debt should never remain invisible.

---

# Refactoring

Refactor when it improves:

* Readability
* Maintainability
* Testability
* Simplicity

Avoid refactoring solely for stylistic preferences.

---

# Engineering Culture

Every contributor should strive to:

* Help teammates.
* Share knowledge.
* Review respectfully.
* Ask questions.
* Learn continuously.
* Leave the codebase better than they found it.

Engineering excellence is built through collaboration, not individual heroics.

---

# Definition of Done

A task is considered complete only when:

* Requirements are satisfied.
* Code has been reviewed.
* Tests pass.
* Documentation is updated.
* Accessibility has been considered.
* Security requirements are met.
* Performance is acceptable.
* No critical defects remain.

Working code alone does not constitute completion.

---

# Conclusion

These guidelines establish a consistent engineering culture for YRecall.

By following shared standards for architecture, coding, testing, documentation, security, and collaboration, contributors can build a platform that remains understandable and maintainable as it grows.

The objective is not merely to write software that works today, but to create a codebase that can confidently support YRecall's evolution for many years.

---

> **Code is read far more often than it is written. Write it so that the next engineer can understand it with confidence.**

# Security Policy

## Supported Versions

YRecall is currently under active development. Security fixes are currently provided for the latest released version.

| Version | Supported |
| ------- | --------- |
| 1.0.x   | :white_check_mark: |
| < 1.0    | :x: |

> Security support may change as new major versions of YRecall are released.

---

## Reporting a Vulnerability

If you discover a security vulnerability in YRecall, please report it responsibly and privately.

### Please do not

- Publicly disclose the vulnerability before it has been investigated and addressed.
- Open a public GitHub issue containing sensitive security information.
- Share authentication tokens, API keys, personal data, database credentials, Firebase credentials, or other secrets in a public issue or pull request.
- Attempt to access, modify, or delete data belonging to other YRecall users.

### How to Report

Please report security vulnerabilities through GitHub's private vulnerability reporting mechanism:

**GitHub → Security → Advisories → Report a vulnerability**

If private vulnerability reporting is unavailable, open a minimal GitHub issue without including sensitive technical details and request a private security contact.

When reporting a vulnerability, please include as much of the following information as possible:

- A clear description of the vulnerability.
- The affected YRecall version.
- The affected component or feature.
- Steps required to reproduce the issue.
- The potential security impact.
- Relevant logs, screenshots, or proof-of-concept details where safe to provide.
- Any suggested mitigation or fix, if available.

Please redact passwords, access tokens, API keys, personal information, Firebase credentials, Supabase credentials, and other sensitive data before submitting a report.

---

## What Happens After a Report

We will review the report and attempt to acknowledge receipt within **7 days**.

Depending on the severity and complexity of the issue, we may:

1. Investigate and reproduce the reported vulnerability.
2. Determine the affected versions and security impact.
3. Develop and test an appropriate fix or mitigation.
4. Release a security update when appropriate.
5. Publish a GitHub Security Advisory when disclosure is appropriate.

The exact timeline for remediation may vary depending on the severity, complexity, and affected infrastructure.

---

## Security Scope

Security reports may include vulnerabilities affecting:

- YRecall mobile applications.
- YRecall backend APIs.
- Authentication and authorization.
- User data isolation and access control.
- Data storage and retrieval.
- File and media uploads.
- AI-related data handling and API interactions.
- Session and token handling.
- API endpoints and server-side validation.
- Sensitive information exposure.
- Dependency-related vulnerabilities.
- Production configuration and deployment security.

---

## Sensitive Data

YRecall may process user-generated information and other potentially sensitive application data.

Security researchers and contributors must not intentionally access, copy, modify, retain, or disclose user data that is not necessary to demonstrate a vulnerability.

If sensitive information is accidentally exposed during testing, stop testing the affected area, retain only the minimum information necessary for reporting, and disclose it privately.

---

## Responsible Disclosure

We appreciate responsible security research that helps improve YRecall and protect its users.

Good-faith security research conducted within applicable laws and without intentionally harming users, services, or infrastructure is welcomed.

Please allow reasonable time for investigation and remediation before publicly disclosing a vulnerability.

---

## Security Updates

Security fixes may be released through:

- Application updates.
- Backend deployments.
- Dependency updates.
- Configuration changes.
- GitHub Security Advisories.
- Other appropriate security notifications.

Users should keep YRecall updated to the latest available version whenever possible.

---

## Third-Party Services

YRecall relies on third-party services and infrastructure. Vulnerabilities originating entirely within third-party services should generally be reported to the respective service provider.

However, if a YRecall integration, configuration, implementation, or handling of a third-party service creates a security vulnerability, please report it to us.

---

## Contact

For security-related reports, please use GitHub's private vulnerability reporting mechanism whenever available.

For general bugs, feature requests, and non-security issues, please use the project's regular GitHub Issues.

Thank you for helping keep YRecall secure.

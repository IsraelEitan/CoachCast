# Security Policy

## Reporting a Vulnerability

Please report suspected vulnerabilities privately through GitHub Security Advisories:

https://github.com/IsraelEitan/CoachCast/security/advisories/new

Do not open public issues for security-sensitive findings.

## Current Security Expectations

- No secrets in source control.
- Server-only keys must not use the `NEXT_PUBLIC_` prefix.
- User uploads and AI inputs must be treated as untrusted.
- Future video uploads must enforce file type, size, access control, and signed URL rules.
- Future publishing actions must require explicit user approval.

## Supported Versions

The product is pre-1.0. Only the active `main` branch and current release tags are supported.

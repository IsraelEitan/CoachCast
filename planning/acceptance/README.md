# Acceptance Criteria

Use this folder for feature-level acceptance criteria when a task is larger than a small fix.

Acceptance files should make a feature executable and reviewable before implementation starts.

## Template

````md
# Feature Name

## Work Intake

Problem statement:

- ...

Expected behavior:

- ...

Constraints:

- ...

Risk tier:

- Low | Medium | High

Test expectations:

- ...

## Goal

What user or business outcome should this produce?

## Scope

Included:

- ...

Excluded:

- ...

## Assumptions And Unknowns

- ...

## Affected Areas

- Routes:
- Components:
- Server/API:
- Database:
- Environment:
- CI/CD:

## Acceptance Criteria

- [ ] User can ...
- [ ] System persists ...
- [ ] Unauthorized users cannot ...
- [ ] Loading, error, empty, and success states are covered.
- [ ] Validation commands pass.
- [ ] Known out-of-scope areas are listed.

## Validation Plan

```bash
npm run verify
```

Manual checks:

- ...

## Risk And Rollback

Risks:

- ...

What was not tested:

- ...

Breaking changes:

- None expected | ...

Rollback:

- ...
````

## When To Create A File

Create an acceptance file for:

- auth, workspace, billing, AI, storage, database, or deployment work
- multi-route user flows
- data migrations
- risky refactors
- changes requiring manual QA

Small copy changes, tiny UI fixes, and low-risk internal cleanups can use the PR template only.

## Risk Tier Guide

Low risk:

- documentation
- tests
- logging
- minor UI copy
- small refactors without behavior changes

Medium risk:

- business logic
- API/data contracts
- dependency updates
- performance-sensitive code

High risk:

- auth
- authorization/RLS
- database migrations
- secrets
- infrastructure
- production config
- CI/CD behavior

High-risk work needs explicit approval and a rollback plan before implementation.

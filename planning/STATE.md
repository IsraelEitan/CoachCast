# CoachCast Delivery State

Last updated: 2026-05-28

## Current Production State

- Repository: `IsraelEitan/CoachCast`
- Default branch: `main`
- Production URL: `https://coachcast-zeta.vercel.app`
- Hosting: Vercel
- CI: GitHub Actions `Validate app`
- Production smoke: GitHub Actions `Deployment Smoke`
- Current version: `0.1.0`

## Current Product State

- Next.js app shell is live.
- Landing page, app dashboard, onboarding, profile, ideas, and script demo routes exist.
- Mock fixtures drive the first product flow.
- Supabase dependencies, typed clients, session proxy, auth routes, workspace onboarding actions, and initial schema migration are in the repo.
- Supabase cloud project exists: `CoachCast` / `jqutwjhdupqmzhnydxzk` in `eu-central-1`.
- Vercel has `NEXT_PUBLIC_SUPABASE_URL` configured for Production and Development.
- Supabase migration `202605260001` is applied to the live project.
- Live Supabase TypeScript types have been generated into `src/lib/supabase/database.types.ts`.
- Vercel Supabase env vars are configured for Production, Development, and Preview.
- Supabase Auth URL configuration is complete for production, local development, and Vercel preview redirects.
- Production was redeployed after env setup: `dpl_EgRR5RQqPzUYUsTDJCaG99qQQm54`.
- Live production auth/workspace write validation passed with a confirmed test user; the test user and workspace were cleaned up.
- Live workspace, brand profile, and content idea reads use authenticated Supabase server queries; demo fixtures remain only for no-config demo mode.
- Authenticated workspaces can queue a `brand_scan` AI job; no worker or model call is connected yet.
- `brand_scan` has a versioned prompt contract, output validator, and eval fixtures; no real model call is connected yet.

## Active Delivery Focus

Phase: Supabase/Auth foundation to real workspace onboarding.

Current acceptance package:

- `planning/acceptance/auth-workspace-onboarding.md`
- `planning/acceptance/brand-scan-job-queue.md`
- `planning/acceptance/brand-scan-contract.md`

Current release gate:

- `planning/RELEASE_READINESS.md`

Immediate next engineering goals:

1. Recheck public self-service sign-up after Supabase Auth rate limiting clears, or configure custom SMTP before real users.
2. Implement a controlled brand scan worker that claims queued `brand_scan` jobs and validates output before writing `brand_profiles`.
3. Add OpenAI API integration behind server-only env vars and cost/safety controls.
4. Create a separate staging Supabase environment before real users or serious preview testing.

## Validation Baseline

Default local validation:

```bash
npm run verify
```

Additional validation when a server is running:

```bash
npm run smoke
```

Production deployment validation:

- GitHub `Validate app`
- Vercel deployment status
- GitHub `Deployment Smoke`

## Known Gaps

- Real-user release blockers are tracked in `planning/RELEASE_READINESS.md`.
- Supabase `db lint --linked` timed out during remote validation and should be retried after the pooler auth circuit breaker clears.
- Public self-service sign-up returned `sign-up-failed` while direct Supabase Auth sign-up returned HTTP 429, so the email sign-up path needs a later provider-rate-limit or SMTP check.
- Rube, Composio, and Supabase MCP servers are present in Codex config, but their tools are not currently exposed in the callable tool list.
- No staging environment is configured yet.
- Brand scan job execution and idea generation are not implemented yet, so live workspaces show truthful empty states until AI jobs write rows.
- Optional local pre-push hook is committed in `.githooks/`; run `npm run hooks:install` to enable it locally.
- CI has dependency audit and a lightweight committed-secret scan; broader SAST/SBOM/image scanning are future hardening steps.
- Brand scan has prompt contract/eval tests; remaining AI job kinds still need contracts and eval coverage.
- No browser accessibility or visual regression suite is implemented yet.

## Decision Log

### 2026-05-27: Promote Agent Workflow Into Repo Rules

Decision: add `AGENTS.md`, `CLAUDE.md`, planning state, acceptance scaffolding, and a `verify` script.

Why: skills and chat instructions are useful, but recurring delivery rules must live in the repo so future agent sessions inherit the same operating model.

### 2026-05-27: Add Risk Tiers And First Security Gate

Decision: add low/medium/high risk tiers, richer work intake, PR evidence fields, and a lightweight secret scan in `npm run verify` and CI.

Why: agentic PRs should be evidence packages. Trust should come from context, guardrails, verification, traceability, and human approval by risk.

### 2026-05-27: Define Auth And Workspace Onboarding Acceptance

Decision: create a dedicated acceptance package for the first real Supabase-backed user flow before implementing auth or workspace writes.

Why: auth, RLS, and workspace data boundaries are high-risk areas. A written work intake keeps scope explicit and gives the implementation PR a testable contract.

### 2026-05-27: Add Auth Routes And Workspace Onboarding Flow

Decision: add sign-in, sign-up, sign-out, request-time app route protection, and workspace creation server actions while keeping demo fallback behavior when Supabase environment variables are missing.

Why: CoachCast needs a real tenant boundary before user content or AI outputs can be stored. The fallback keeps CI, previews, and demo routes stable until the live Supabase project is connected.

### 2026-05-27: Create Supabase Cloud Project

Decision: create the managed Supabase project `CoachCast` in `eu-central-1` with ref `jqutwjhdupqmzhnydxzk`.

Why: the app needs a real Auth/Postgres/RLS target before validating workspace onboarding in production. Database password and key setup remain manual/secret-handled steps.

### 2026-05-27: Apply Live Supabase Schema

Decision: link the repo to Supabase project `jqutwjhdupqmzhnydxzk`, apply migration `202605260001`, and generate live TypeScript schema types.

Evidence: remote migration history matches local migration `202605260001`; a read-only schema check found 6 application tables, RLS enabled on all 6, and 24 public policies.

Why: live auth and workspace onboarding need the real tenant-isolated schema before browser validation or production rollout.

### 2026-05-28: Configure Production Supabase Auth

Decision: configure Vercel Supabase variables for Production, Development, and Preview; configure Supabase Auth redirect URLs; redeploy production to `dpl_EgRR5RQqPzUYUsTDJCaG99qQQm54`.

Evidence: production smoke passed; `/app` returns a 307 redirect to `/auth/sign-in?next=%2Fapp`; sign-in and sign-up server actions return validation redirects instead of `missing-config`.

Why: production must be rebuilt after `NEXT_PUBLIC_` env changes so protected routes use live Supabase auth instead of demo fallback mode.

### 2026-05-28: Validate Production Sign-In And Workspace Creation

Decision: create a confirmed Supabase Auth test user through the Admin API, sign in through the production app, create a workspace through production onboarding, verify owner membership, and delete the test user.

Evidence: production sign-in redirected to `/app`; `/app` redirected the no-workspace user to `/app/onboarding`; workspace creation redirected to `/app?status=workspace-created`; database verification found the workspace and `owner` membership; dashboard rendered the workspace name; cleanup left 0 matching Auth users and 0 matching workspaces.

Why: this proves the deployed app, Supabase cookies, RLS-backed workspace insert, owner-membership trigger, and protected routing work together without leaving production test data behind.

### 2026-05-28: Replace First Workspace Mock Reads

Decision: add authenticated server-side workspace content queries for `brand_profiles` and `content_ideas`, keep fixtures only for no-config demo mode, and show empty states for live workspaces without generated AI rows.

Evidence: mapper tests cover Supabase row-to-UI conversion; lint, TypeScript, and unit tests pass locally.

Why: real trainers should never see fixture content presented as their own AI output. The app should either show tenant-scoped data from Supabase or clearly say that generation has not happened yet.

### 2026-05-28: Queue Brand Scan Jobs

Decision: add a server action that creates `brand_scan` rows in `ai_jobs` through the authenticated Supabase user session, avoid duplicate active jobs for normal repeated submits, and show latest job status on dashboard/profile screens.

Evidence: brand scan input/status tests, lint, TypeScript, and unit tests pass locally.

Why: the AI pipeline needs durable, workspace-scoped job records before model calls or background workers are connected. This gives us traceability without adding model risk yet.

### 2026-05-28: Define Brand Scan Prompt Contract

Decision: add `brand-scan:v1` prompt messages, a structured output contract, output validation, and eval fixtures for trainer, gym, safety, and edge-case inputs.

Evidence: prompt contract tests prove versioning, schema inclusion, safe-output acceptance, unsafe-output rejection, prompt-version drift rejection, and eval fixture coverage.

Why: the worker should not call a model until the AI boundary is explicit, testable, and safety-aware.

### 2026-05-26: Supabase Foundation Merged

Decision: add Supabase clients, session proxy, initial RLS migration, and schema tests before building auth UI.

Why: the app needs a tenant-safe data contract before real trainer data or AI outputs are stored.

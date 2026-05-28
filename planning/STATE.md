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

## Active Delivery Focus

Phase: Supabase/Auth foundation to real workspace onboarding.

Current acceptance package:

- `planning/acceptance/auth-workspace-onboarding.md`

Immediate next engineering goals:

1. Perform an approved live write test for sign-up, sign-in, workspace creation, and owner membership.
2. Replace selected mock reads with authenticated workspace queries.
3. Add AI job creation through server actions or route handlers.
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

- Supabase `db lint --linked` timed out during remote validation and should be retried after the pooler auth circuit breaker clears.
- Full live auth/workspace validation still needs an approved test account because it writes to production Auth and workspace tables.
- Rube, Composio, and Supabase MCP servers are present in Codex config, but their tools are not currently exposed in the callable tool list.
- No staging environment is configured yet.
- Optional local pre-push hook is committed in `.githooks/`; run `npm run hooks:install` to enable it locally.
- CI has dependency audit and a lightweight committed-secret scan; broader SAST/SBOM/image scanning are future hardening steps.
- No AI prompt contracts or eval tests are implemented yet.
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

### 2026-05-26: Supabase Foundation Merged

Decision: add Supabase clients, session proxy, initial RLS migration, and schema tests before building auth UI.

Why: the app needs a tenant-safe data contract before real trainer data or AI outputs are stored.

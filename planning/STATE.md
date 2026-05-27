# CoachCast Delivery State

Last updated: 2026-05-27

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
- Supabase dependencies, typed clients, session proxy, and initial schema migration are in the repo.
- Real Supabase project connection and migration application are still pending.

## Active Delivery Focus

Phase: Supabase/Auth foundation to real workspace onboarding.

Immediate next engineering goals:

1. Connect Rube/Composio or Supabase MCP tools after Codex restart.
2. Select or create the Supabase project.
3. Apply `supabase/migrations/202605260001_initial_schema.sql`.
4. Generate live Supabase TypeScript types.
5. Add sign-in, sign-up, and workspace onboarding.
6. Replace selected mock reads with authenticated workspace queries.

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

- No live Supabase project has been verified from this repo yet.
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

### 2026-05-26: Supabase Foundation Merged

Decision: add Supabase clients, session proxy, initial RLS migration, and schema tests before building auth UI.

Why: the app needs a tenant-safe data contract before real trainer data or AI outputs are stored.

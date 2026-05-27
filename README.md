# CoachCast

[![CI](https://github.com/IsraelEitan/CoachCast/actions/workflows/ci.yml/badge.svg)](https://github.com/IsraelEitan/CoachCast/actions/workflows/ci.yml)

CoachCast is an AI content production SaaS for trainers, gyms, and fitness studios. The product goal is simple: a coach records once, and the system turns that recording into scripts, branded short-form videos, captions, B-roll plans, and scheduled posts.

Production: https://coachcast-zeta.vercel.app

The current repository is the production foundation: a Next.js app, mocked AI data contracts, CI/CD workflows, deployment smoke checks, Docker support, and documentation for the cloud path.

## Product Scope

CoachCast helps fitness professionals solve these pain points:

- they know they need content, but do not have time to write, edit, and publish consistently
- video editing and short-form packaging is expensive or slow
- generic AI copy does not sound like their coaching voice
- gym owners need repeatable content systems across multiple trainers
- fitness content must avoid unsafe or misleading claims

The intended AI pipeline:

1. Analyze the trainer's site/socials and build a brand profile.
2. Generate content ideas tied to audience pain points and offers.
3. Draft short-form scripts in the trainer's voice.
4. Guide recording through a teleprompter.
5. Plan captions, B-roll, overlays, and render jobs.
6. Schedule or publish after approval.

## Tech Stack

- Next.js 16 App Router
- React 19
- TypeScript 6
- Node.js 22
- GitHub Actions CI/CD
- Vercel-ready deployment config
- Docker standalone image path

Planned integrations:

- Supabase for auth and Postgres
- Cloudflare R2 for video/object storage
- Inngest for background AI jobs
- OpenAI for structured brand scan and script generation
- Sentry for production observability

## Getting Started

Requirements:

- Node.js 22
- npm 10.9+

Install and run:

```bash
npm ci
npm run dev
```

Open:

```text
http://127.0.0.1:3000
```

## Scripts

```bash
npm run dev       # Start local dev server
npm run lint      # Run ESLint
npm run typecheck # Run TypeScript without emitting files
npm test          # Run Node test suite
npm run build     # Build production app
npm run verify    # Run lint, typecheck, tests, and production build
npm run smoke     # Smoke-test a running app
npm run docker:build
```

Smoke checks default to `http://127.0.0.1:3000`. To check a deployed URL:

```bash
SMOKE_BASE_URL=https://your-deployment-url npm run smoke
```

## Environment

Copy [.env.example](./.env.example) when real integrations are added.

Current mocked app can run without secrets. Future server-only secrets must never be exposed with `NEXT_PUBLIC_`.

Supabase server-side auth is scaffolded with cookie-based clients and a request proxy. For new Supabase projects, prefer:

```text
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=
SUPABASE_SECRET_KEY=
```

Legacy Supabase `anon` and `service_role` keys are still supported as fallbacks for existing projects, but new projects should use publishable and secret keys.

The initial database contract lives in [supabase/migrations/202605260001_initial_schema.sql](./supabase/migrations/202605260001_initial_schema.sql).

## Repository Workflow

Default branch:

```text
main
```

Branch naming:

```text
feature/<short-name>
fix/<short-name>
chore/<short-name>
docs/<short-name>
codex/<short-name>
```

Commit style:

```text
type(scope): short imperative summary
```

Examples:

```text
feat(auth): add workspace login shell
fix(ci): wait for production server before smoke test
docs(deploy): add Vercel runbook
```

Pull requests should stay small, include validation notes, and use the repository PR template.

`main` is protected. Use pull requests for all future changes.

## CI/CD

CI runs on pull requests, pushes to `main`, and manual dispatch.

Checks:

- dependency install with `npm ci`
- dependency audit
- lint
- TypeScript
- tests
- production build
- local production smoke test
- Docker image build

Additional workflows:

- deployment smoke checks for successful GitHub deployments
- release validation and generated GitHub release notes for `v*.*.*` tags
- Dependabot dependency updates

## Versioning

CoachCast uses Semantic Versioning:

```text
MAJOR.MINOR.PATCH
```

Current version:

```text
0.1.0
```

Version guidance:

- patch: bug fixes, copy updates, safe internal changes
- minor: new user-visible features or workflows
- major: breaking app, API, data, or deployment changes

Release tags use:

```text
v0.1.0
```

## Deployment

Recommended first production target:

- Vercel for the Next.js web app
- GitHub Actions for validation
- Vercel Git deployments for previews and production

See [docs/05-deployment-runbook.md](./docs/05-deployment-runbook.md).

## Documentation

- [Product blueprint](./docs/01-product-blueprint.md)
- [AI pipeline](./docs/02-ai-pipeline.md)
- [Build roadmap](./docs/03-build-roadmap.md)
- [Production cloud and CI/CD](./docs/04-production-cloud-cicd.md)
- [Deployment runbook](./docs/05-deployment-runbook.md)
- [Git workflow](./docs/06-git-workflow.md)
- [Supabase foundation](./docs/07-supabase-foundation.md)
- [Agent operating rules](./AGENTS.md)
- [Delivery state](./planning/STATE.md)

## License

This project is proprietary and all rights are reserved. See [LICENSE](./LICENSE).

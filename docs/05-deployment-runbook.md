# CoachCast Deployment Runbook

## Goal

Deploy CoachCast as a repeatable production web app with preview deployments, CI gates, health checks, and environment separation.

## Why This Exists

The app should not depend on one developer machine. A deployment runbook gives us the same path every time:

- code is pushed to GitHub
- CI validates the change
- Vercel builds preview and production deployments
- smoke checks verify the live URL
- secrets live in the cloud provider, not in source control

## Current Local State

The project is connected to GitHub and Vercel. Supabase cloud setup is in progress.

Verified locally:

- Next.js production build works
- CI workflow exists
- Dockerfile exists
- `/api/health` exists
- smoke checks exist
- `.env.example` documents required future secrets

Current Vercel project:

- Project: `israeleitans-projects/coachcast`
- Production URL: `https://coachcast-zeta.vercel.app`
- Latest verified deployment: `dpl_EgRR5RQqPzUYUsTDJCaG99qQQm54`
- Connected Git repository: `IsraelEitan/CoachCast`

Current remaining cloud setup:

- perform an approved live write test for auth and workspace onboarding
- create a separate staging Supabase project before real users or serious preview testing

## Step 1: Create GitHub Repository

1. Use the GitHub repository `IsraelEitan/CoachCast`.
2. Add it as the local remote.
3. Rename the default branch to `main` if needed.
4. Push the current code.

Commands:

```bash
git branch -M main
git remote add origin https://github.com/IsraelEitan/CoachCast.git
git add .
git commit -m "Initial CoachCast production app"
git push -u origin main
```

## Step 2: Import to Vercel

Use Vercel's Git integration, not a manual one-off upload.

Reason:

- every pull request gets a preview deployment
- merges to `main` become production deployments
- rollbacks can use Vercel's deployment history

Project settings:

- Framework preset: Next.js
- Install command: `npm ci`
- Build command: `npm run build`
- Development command: `npm run dev`
- Node.js version: `22.x` through `package.json` `engines.node`
- Production branch: `main`

If Vercel cannot connect the GitHub repository from the CLI, open the Vercel project dashboard and install or reconfigure the Vercel GitHub integration for `IsraelEitan/CoachCast`.

Expected deployment behavior after Git connection:

- pull requests create Vercel preview deployments
- pushes to `main` deploy production
- `npm run smoke` should pass against the production alias after each production deployment

Deployment smoke policy:

- GitHub CI validates every pull request with build and local smoke checks.
- Vercel validates every pull request with a preview deployment status.
- The `Deployment Smoke` workflow runs only for Vercel `Production` deployments because preview deployments can be protected by Vercel Authentication and return `401` to unauthenticated CI smoke checks.
- Production deployment smoke uses the GitHub repository variable `PRODUCTION_URL`, currently `https://coachcast-zeta.vercel.app`, so smoke checks target the public production alias instead of a protected generated deployment URL.

## Step 3: Configure Environment Variables

Start with only what the app needs today.

Current app can deploy with no secrets because it uses mocked data.

Add later:

- `NEXT_PUBLIC_APP_URL`
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`
- `SUPABASE_SECRET_KEY`
- `OPENAI_API_KEY`
- `R2_ACCOUNT_ID`
- `R2_ACCESS_KEY_ID`
- `R2_SECRET_ACCESS_KEY`
- `R2_BUCKET`
- `R2_PUBLIC_BASE_URL`
- `INNGEST_EVENT_KEY`
- `INNGEST_SIGNING_KEY`
- `SENTRY_DSN`

Legacy Supabase fallback names are still supported by the app while Supabase keeps those key types available:

- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`

Rule:

- values with `NEXT_PUBLIC_` can be exposed to the browser
- every other value is server-only

Add secret values with the interactive CLI or the provider dashboard. Do not pass secret values in committed files or shared chat logs.

```bash
vercel env add NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY production
vercel env add SUPABASE_SECRET_KEY production
vercel env add NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY development
vercel env add SUPABASE_SECRET_KEY development
vercel env add NEXT_PUBLIC_SUPABASE_URL preview
vercel env add NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY preview
vercel env add SUPABASE_SECRET_KEY preview
```

## Step 4: Configure Branch Protection

Protect `main` after the first successful push.

Require:

- pull request before merge
- passing CI
- no direct pushes to `main`
- conversation resolution before merge

## Step 5: Verify Production

After Vercel deploys, run:

```bash
SMOKE_BASE_URL=https://your-production-url.vercel.app npm run smoke
```

Expected output:

```text
ok /api/health
ok /
ok /app
ok /app/onboarding
ok /app/scripts/demo
Smoke checks passed for https://your-production-url.vercel.app
```

## Step 6: First Real Cloud Integrations

Add integrations in this order:

1. Supabase auth and workspace schema.
2. Supabase Row Level Security policies.
3. Inngest background job endpoint.
4. OpenAI structured brand scan.
5. Cloudflare R2 upload storage.
6. Rendering worker after uploads and scripts are stable.

## Rollback

For web-only changes:

1. Open Vercel deployments.
2. Promote the previous healthy deployment.
3. Create a follow-up fix PR.

For future database changes:

- prefer backward-compatible migrations
- never combine destructive migration and app change in the same deploy
- keep rollback scripts for schema changes that touch production data

## References

- Vercel Git deployments: https://vercel.com/docs/deployments/git
- Vercel project configuration: https://vercel.com/docs/projects/project-configuration
- Vercel environment variables: https://vercel.com/docs/environment-variables

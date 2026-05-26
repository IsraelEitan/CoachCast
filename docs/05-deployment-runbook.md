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

The project is ready for the first cloud deploy, but the local machine is not yet connected to cloud accounts.

Verified locally:

- Next.js production build works
- CI workflow exists
- Dockerfile exists
- `/api/health` exists
- smoke checks exist
- `.env.example` documents required future secrets

Missing before real deploy:

- GitHub remote repository
- Vercel project connection
- Vercel environment variables
- branch protection rules

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
- Production branch: `main`

## Step 3: Configure Environment Variables

Start with only what the app needs today.

Current app can deploy with no secrets because it uses mocked data.

Add later:

- `NEXT_PUBLIC_APP_URL`
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `OPENAI_API_KEY`
- `R2_ACCOUNT_ID`
- `R2_ACCESS_KEY_ID`
- `R2_SECRET_ACCESS_KEY`
- `R2_BUCKET`
- `R2_PUBLIC_BASE_URL`
- `INNGEST_EVENT_KEY`
- `INNGEST_SIGNING_KEY`
- `SENTRY_DSN`

Rule:

- values with `NEXT_PUBLIC_` can be exposed to the browser
- every other value is server-only

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

# Supabase Foundation

CoachCast uses Supabase for authentication, workspace-scoped Postgres data, and Row Level Security.

## Why This Exists

The product needs each trainer, gym, or studio to have an isolated workspace. AI outputs such as brand profiles, content ideas, scripts, and render plans must never leak between workspaces. Supabase gives us Auth, Postgres, RLS, generated types, and a managed path to production without adding a custom auth service.

## Current Scope

This foundation adds:

- Supabase SSR/browser/service clients under `src/lib/supabase`
- a Next.js `src/proxy.ts` session refresh hook that no-ops until Supabase env vars exist
- sign-in, sign-up, sign-out, and workspace onboarding server actions
- request-time app route protection once Supabase env vars are configured
- an initial migration in `supabase/migrations`
- tests that guard the RLS and AI job contract

The app still runs without Supabase credentials so CI, previews, and mocked UX stay stable while the live Supabase project is connected.

## Cloud Project

Current Supabase project:

```text
Name: CoachCast
Project ref: jqutwjhdupqmzhnydxzk
Region: eu-central-1
URL: https://jqutwjhdupqmzhnydxzk.supabase.co
```

The database password is private operator state. Do not commit it, paste it into chat, or store it in repo files. Use the Supabase dashboard password reset flow if it is lost.

Current live schema status:

- migration `202605260001` is applied remotely
- 6 application tables exist
- RLS is enabled on all 6 application tables
- 24 public RLS policies exist
- `src/lib/supabase/database.types.ts` is generated from the live project
- Vercel Supabase env vars are configured for Production, Development, and Preview
- Supabase Auth URL configuration is complete for production, local development, and Vercel preview redirects
- production deployment `dpl_EgRR5RQqPzUYUsTDJCaG99qQQm54` was built after env setup
- production sign-in and workspace creation were validated with a confirmed test user and cleaned up
- live app routes read `workspaces`, `brand_profiles`, and `content_ideas` through authenticated Supabase server queries
- live workspaces can queue `brand_scan` jobs in `ai_jobs` through authenticated Supabase server actions
- `brand_scan` has a versioned prompt contract, output validator, and eval fixtures

## Environment Variables

Use the current Supabase key names for new projects:

```text
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=
SUPABASE_SECRET_KEY=
```

Legacy fallbacks are supported for existing Supabase projects while Supabase keeps those key types available:

```text
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
```

Only variables prefixed with `NEXT_PUBLIC_` can be used in browser code. Secret keys are server-only.

## Data Model

Core tables:

- `workspaces`: trainer, gym, or studio account boundary
- `workspace_members`: user membership and role inside a workspace
- `brand_profiles`: AI-produced voice, audience, offer, and safety context
- `content_ideas`: generated short-form content concepts
- `script_drafts`: teleprompter scripts, captions, hashtags, and shot lists
- `ai_jobs`: asynchronous pipeline jobs for scans, idea generation, script generation, render planning, and publish planning

Every application table has RLS enabled. Workspace-scoped content uses `public.is_workspace_member(workspace_id)` to enforce tenant isolation.

## Next Implementation Steps

1. Recheck public self-service sign-up after Supabase Auth rate limiting clears, or configure custom SMTP before real users.
2. Implement a controlled brand scan worker that claims queued `brand_scan` jobs and validates output before writing `brand_profiles`.
3. Add OpenAI API integration behind server-only env vars and cost/safety controls.
4. Create a separate staging Supabase environment before real users or serious preview testing.

## Operator Setup Commands

Run these from the repository root. Enter secrets only in the local terminal or provider dashboard.

```powershell
npx supabase link --project-ref jqutwjhdupqmzhnydxzk
npx supabase db push --linked
npx supabase gen types --project-id jqutwjhdupqmzhnydxzk --schema public --lang typescript | Out-File -FilePath src/lib/supabase/database.types.ts -Encoding utf8
```

Vercel requires these variables for each target environment:

```text
NEXT_PUBLIC_SUPABASE_URL=https://jqutwjhdupqmzhnydxzk.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=<from Supabase Project Settings > API>
SUPABASE_SECRET_KEY=<from Supabase Project Settings > API>
```

Use `vercel env add` interactively for secret values so keys are not printed into shell history or agent logs.

```powershell
npx vercel env add NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY production
npx vercel env add SUPABASE_SECRET_KEY production
npx vercel env add NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY development
npx vercel env add SUPABASE_SECRET_KEY development
npx vercel env add NEXT_PUBLIC_SUPABASE_URL preview
npx vercel env add NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY preview
npx vercel env add SUPABASE_SECRET_KEY preview
```

## Supabase Auth URL Configuration

Configure these in Supabase Dashboard > Authentication > URL Configuration:

```text
Site URL:
https://coachcast-zeta.vercel.app

Additional Redirect URLs:
https://coachcast-zeta.vercel.app/**
http://localhost:3000/**
https://coachcast-*-israeleitans-projects.vercel.app/**
```

Supabase allows wildcards for preview URLs, but production should use exact redirect paths where practical.

## Production Validation

Non-mutating production checks completed on 2026-05-28:

- `npm run smoke` passed against `https://coachcast-zeta.vercel.app`
- `/app` returned `307` to `/auth/sign-in?next=%2Fapp`
- sign-in with missing fields returned `/auth/sign-in?status=missing-fields`
- sign-up with a short password returned `/auth/sign-up?status=invalid-sign-up`
- no production check returned `missing-config`

Production write validation completed on 2026-05-28:

- created a confirmed test user through Supabase Admin API
- signed in through the production app and received `/app`
- verified `/app` redirected the no-workspace user to `/app/onboarding`
- created a workspace through the production onboarding server action
- verified the workspace row and `owner` membership in Supabase
- verified the production dashboard rendered the workspace name
- deleted the test Auth user and verified 0 matching users/workspaces remained

The public self-service sign-up email flow still needs a later check. During validation, app sign-up returned `sign-up-failed` and direct Supabase Auth sign-up returned HTTP 429, consistent with provider-side sign-up/email rate limiting.

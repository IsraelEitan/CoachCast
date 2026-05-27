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

1. Create the Supabase project and add the environment variables to Vercel.
2. Apply the migration to Supabase.
3. Generate official database types from the live Supabase schema and replace the hand-written bootstrap type file.
4. Configure Supabase Auth callback URLs for local, preview, and production origins.
5. Validate sign-up, sign-in, sign-out, workspace creation, and owner membership in the browser.
6. Replace fixture reads with authenticated workspace queries.
7. Add AI job creation through server actions or route handlers.

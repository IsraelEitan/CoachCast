# Auth And Workspace Onboarding

## Work Intake

Problem statement:

- CoachCast currently has a production app shell and Supabase schema, but users still experience the app as a public mocked demo.
- Trainers, gyms, and studios need real accounts and isolated workspaces before we can store brand profiles, content ideas, scripts, AI jobs, or future video assets.

Expected behavior:

- A visitor can sign up or sign in with Supabase Auth.
- An authenticated user without a workspace is guided to create one.
- A workspace owner can create a workspace with basic business context: name, website or Instagram, primary offer, and audience summary.
- Existing workspace members land in the app dashboard.
- App routes do not expose workspace data to unauthenticated users.
- Mocked data remains available only as demo or fallback content until real workspace queries replace it.

Constraints:

- Keep the app deployable without Supabase environment variables so CI and preview deployments remain stable.
- Use the existing Supabase SSR clients and `src/proxy.ts` session refresh path.
- Preserve the existing RLS contract in `supabase/migrations/202605260001_initial_schema.sql`.
- Do not introduce long-lived secrets into client code.
- Do not apply destructive database changes.

Risk tier:

- High for implementation, because this touches authentication, authorization, RLS, environment configuration, and user data boundaries.
- Low for this acceptance document.

Test expectations:

- Unit or integration tests should cover environment fallback behavior and workspace routing decisions where practical.
- Schema tests must continue to prove RLS is enabled and workspace policies exist.
- Browser smoke should cover anonymous landing access and authenticated-route fallback behavior.
- CI must pass `npm run verify`.

## Goal

Move CoachCast from a mocked product demo to the first tenant-safe production workflow: a real user signs in, creates a workspace, and reaches the studio dashboard inside their own workspace boundary.

## In Scope

- Supabase project selection or creation.
- Applying the initial migration to the selected Supabase project.
- Generating official TypeScript database types from the live schema.
- Sign-up and sign-in routes.
- Sign-out behavior.
- Workspace creation route or server action.
- Redirect behavior for:
  - anonymous users
  - authenticated users without a workspace
  - authenticated users with a workspace
- Basic workspace data read on the dashboard.
- Documentation for required Vercel environment variables.

## Out Of Scope

- Real AI generation.
- Billing or subscriptions.
- Multi-workspace switching.
- Team invitations.
- Direct social publishing.
- Video upload, rendering, or storage.
- Destructive data migrations.
- Production data backfill.

## Proposed Flow

1. Anonymous visitor opens `/`.
2. Visitor chooses to start and lands on `/auth/sign-up` or `/auth/sign-in`.
3. Supabase creates or restores the user session.
4. App checks whether the user belongs to a workspace.
5. If no workspace exists, redirect to `/app/onboarding`.
6. User creates the first workspace.
7. Database trigger creates owner membership.
8. User lands on `/app`.
9. Dashboard reads workspace-scoped data through RLS-safe queries.

## Acceptance Criteria

- [ ] Anonymous users can view the public landing page.
- [ ] Anonymous users cannot access protected app routes with workspace data.
- [ ] Authenticated users without a workspace are directed to onboarding.
- [ ] Authenticated users can create one owned workspace.
- [ ] Workspace creation creates an owner membership.
- [ ] Authenticated workspace members can read their workspace.
- [ ] Workspace-scoped queries do not require service-role access from browser code.
- [ ] The app still builds and runs without Supabase env vars for CI and demos.
- [ ] Required environment variables are documented for Vercel.
- [ ] `npm run verify` passes.
- [ ] A smoke check passes for the relevant local or preview URL.

## Validation Plan

Automated:

```bash
npm run security:secrets
npm run verify
npm run smoke
```

Manual:

- Verify sign-up or sign-in in the browser against the selected Supabase project.
- Verify onboarding creates a workspace and redirects to the dashboard.
- Verify sign-out returns the user to a public or auth route.
- Verify Vercel preview has only publishable browser keys exposed.

## Risks

- Misconfigured RLS could leak workspace data between trainers or gyms.
- Service-role keys could accidentally reach the browser if environment boundaries are not respected.
- Auth redirects can easily break local, preview, and production URLs if callback origins are not configured.
- CI could become dependent on live Supabase unless fallback behavior is preserved.
- Email auth settings can make local testing confusing if callback URLs are missing.

## What Was Not Tested

- This document does not validate a live Supabase project.
- This document does not prove provider-specific auth settings.
- This document does not test production Vercel environment variables.

## Breaking Changes

- None expected for the document.
- Implementation should avoid breaking the public landing page and mocked demo routes until real data replacement is deliberate.

## Rollback

- For this document, revert the PR.
- For implementation, keep auth/workspace rollout behind reversible route and environment changes. If production auth fails, disable protected app entry points and keep the public landing page available while reverting the auth PR.

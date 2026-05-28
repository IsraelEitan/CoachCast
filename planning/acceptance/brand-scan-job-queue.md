# Brand Scan Job Queue

## Work Intake

Problem statement:

- CoachCast can create authenticated workspaces and read workspace-scoped AI outputs, but there is no user action that creates an AI pipeline job yet.
- Before calling OpenAI or running workers, the app needs a durable, tenant-scoped job record that captures the requested brand scan and can be processed later.

Expected behavior:

- An authenticated workspace member can queue a `brand_scan` job.
- The job is inserted into `public.ai_jobs` with the current workspace id, current user id, `queued` status, and structured input from workspace context.
- If a `queued` or `running` brand scan already exists for the workspace, the action does not create another one.
- The dashboard and profile pages show the latest brand scan job status.
- Demo/no-Supabase mode remains stable and does not require live credentials.

Constraints:

- Do not call OpenAI in this slice.
- Do not add a worker, queue runner, or background scheduler in this slice.
- Do not use service-role access from browser code.
- Do not add a database migration unless the existing schema cannot support the job record.
- Preserve existing RLS policy behavior for `ai_jobs`.

Risk tier:

- Medium-high, because this writes workspace-scoped database rows and affects the AI pipeline contract.

Test expectations:

- Unit tests should cover the brand scan input payload and user-visible job status messages.
- Existing schema tests should continue to prove `ai_jobs` is RLS-protected and supports `brand_scan`.
- `npm run verify` must pass.
- Local or preview smoke should pass.

## Acceptance Criteria

- [x] Live workspaces can create a `brand_scan` job through a server action.
- [x] Duplicate active `brand_scan` jobs are avoided for normal repeated clicks.
- [x] Job input is structured, versioned, and limited to workspace context needed by the brand scan.
- [x] Dashboard/profile show latest brand scan status.
- [x] No OpenAI call, worker execution, or generated profile write is introduced.
- [x] Demo/no-Supabase mode still works.
- [x] `npm run verify` passes.
- [x] Local or preview smoke passes.

## Implementation Evidence

2026-05-28:

- Added a server action that inserts `brand_scan` rows into `ai_jobs` through the authenticated Supabase user session.
- Added active-job detection for `queued` and `running` brand scans before creating another job.
- Added dashboard/profile status rendering for the latest brand scan job.
- Added unit tests for the brand scan input contract and status messages.
- `npm run verify` passed locally.
- Local smoke passed against `http://127.0.0.1:3000`.
- Browser checks for `/app`, `/app/profile`, and `/app/profile?status=demo` rendered without console errors in demo/no-Supabase mode.

## What Was Not Tested

- Production job insertion with a real authenticated user.
- Concurrent double-submit protection at the database uniqueness level.
- Worker execution from queued job to `brand_profiles` output.

## Rollback

- Revert this PR to remove the job-queue action and return profile/dashboard pages to read-only AI pipeline status.

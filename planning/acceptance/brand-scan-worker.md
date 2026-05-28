# Brand Scan Worker

## Work Intake

Problem statement:

- CoachCast can queue `brand_scan` jobs and has a prompt contract, but queued jobs still need a controlled execution path.
- The worker must not expose secrets, run without explicit authorization, or persist unvalidated AI output.

Expected behavior:

- A protected server route can process one queued `brand_scan` job per request.
- The route is disabled unless `AI_WORKER_SECRET`, Supabase service config, and `OPENAI_API_KEY` are configured.
- The worker claims a queued job, validates the queued input contract, calls the OpenAI brand scan generator, validates the generated output, writes a ready `brand_profiles` row, and marks the job `succeeded`.
- Invalid input, provider errors, or invalid output mark the job `failed` with a bounded non-secret error message.

Constraints:

- Do not add a database migration in this slice.
- Do not add automatic Vercel Cron scheduling in this slice.
- Do not expose provider keys or service keys to the browser.
- Do not execute real OpenAI calls in local or CI tests.

Risk tier:

- Medium, because this adds an AI execution path and data writes, but the route is disabled without server-only configuration and is guarded by a worker secret.

## Acceptance Criteria

- [x] Worker route requires bearer authorization with `AI_WORKER_SECRET`.
- [x] Worker route returns disabled responses when required server-only config is missing.
- [x] Worker claims at most one queued `brand_scan` job per run.
- [x] Worker validates queued input before calling the model.
- [x] OpenAI adapter requests strict Structured Outputs with the brand scan JSON Schema.
- [x] Worker validates generated output before writing `brand_profiles`.
- [x] Worker marks failed jobs with bounded, non-secret errors.
- [x] `npm run verify` passes.

## Evidence

- 2026-05-28: `npm run verify` passed.
- Unit tests cover worker idle, invalid-input, success, invalid-output, bearer auth, OpenAI Structured Outputs request shape, and provider error handling.

## What Was Not Tested

- Live OpenAI API call with a real key.
- Live Supabase service-role execution against production data.
- Automatic cron scheduling.
- Transactional all-or-nothing completion across `brand_profiles` insert and `ai_jobs` update.

## Rollback

- Revert this PR to remove the worker route and OpenAI adapter.
- Remove `AI_WORKER_SECRET` from Vercel if it was configured for testing.

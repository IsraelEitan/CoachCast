# CoachCast Release Readiness Gate

This file is the durable home for every item that is deferred with language like "later", "before real users", "before production launch", "before paid traffic", or "before enabling this for customers".

Do not rely on chat memory for release blockers. If a future task discovers a risk that must be handled before real users, add it here and, when useful, create or link a GitHub issue.

## Release Gate Rule

CoachCast is not ready for real trainer, gym, studio, or customer data until every `Release blocker` item below is resolved or explicitly reclassified by the owner.

Every item must include:

- trigger
- current evidence
- required resolution
- validation evidence
- rollback or cleanup notes when relevant

## Release Blockers

### 1. Public Self-Service Sign-Up And Email Delivery

Status: Open

Risk: Authentication, email delivery, onboarding conversion.

Trigger: Before inviting real users, paid traffic, external beta users, or public sign-up.

Current evidence:

- Production sign-in and workspace creation work for a confirmed test user.
- Public app sign-up returned `sign-up-failed` on 2026-05-28.
- Direct Supabase Auth sign-up returned HTTP `429` on 2026-05-28.
- This is consistent with provider-side sign-up/email rate limiting or email delivery configuration.

Required resolution:

- Decide whether to use Supabase default email temporarily or configure custom SMTP.
- Verify new-user sign-up from the public production UI.
- Verify confirmation email delivery, confirmation redirect, sign-in after confirmation, and resend behavior.
- Verify error states for duplicate email, weak password, invalid email, and rate limits.
- Decide whether sign-up should require email confirmation before workspace creation.

Validation evidence:

- Browser or HTTP evidence for public sign-up with a real reachable test inbox.
- No `missing-config`, unexpected `sign-up-failed`, or provider `429` during the validation window.
- Test user and workspace cleanup confirmed, or test account intentionally retained and labeled.

Rollback / cleanup:

- Remove test Auth users and workspace rows after validation unless the test user is intentionally retained.
- If custom SMTP fails, revert Supabase Auth SMTP settings and keep sign-up closed.

### 2. Separate Staging Supabase Environment

Status: Open

Tracking: GitHub issue #16

Risk: Production data isolation, preview safety, migration safety, key rotation.

Trigger: Before real users, serious preview testing, destructive or complex migrations, external beta, or paid traffic.

Current evidence:

- One Supabase project currently backs Production, Preview, and Development.
- This is acceptable only during foundation work before real users.

Required resolution:

- Create a dedicated staging Supabase project.
- Apply all migrations to staging.
- Point Vercel Preview env vars at staging Supabase.
- Keep Vercel Production env vars pointed at production Supabase.
- Document key rotation and environment ownership.
- Validate sign-up, sign-in, workspace creation, and RLS on a Vercel preview deployment.

Validation evidence:

- Vercel Preview uses staging Supabase URL and keys.
- Production smoke still uses production Supabase.
- Staging validation test data does not appear in production.

Rollback / cleanup:

- Restore Preview env vars to the prior known-good values if preview auth breaks.
- Delete staging test users/workspaces after validation.

### 3. Supabase Database Lint And Advisors

Status: Open

Risk: Database security, performance, RLS posture.

Trigger: Before real users or any production data import.

Current evidence:

- `npx supabase db lint --linked` timed out during earlier validation after pooler/auth circuit breaker errors.
- Live schema verification found 6 app tables, RLS on all 6, and 24 public policies.

Required resolution:

- Rerun `npx supabase db lint --linked`.
- Review Supabase security and performance advisors.
- Address or explicitly accept findings with rationale.
- Keep RLS and membership policies covered by tests.

Validation evidence:

- Passing lint/advisor report or documented accepted findings.
- `npm run verify` still passes after any migration or policy changes.

Rollback / cleanup:

- Use backward-compatible migrations.
- Keep destructive data changes separate from app deploys.

### 4. Production Observability And Incident Response

Status: Open

Risk: Silent failures, slow recovery, no incident trail.

Trigger: Before real users or external beta.

Current evidence:

- `.env.example` includes `SENTRY_DSN`, but production observability is not configured yet.
- The app has `/api/health` and deployment smoke checks.

Required resolution:

- Configure production error monitoring, at minimum Sentry or equivalent.
- Define alert destination and owner.
- Verify server action errors, route errors, and client errors are captured without leaking secrets.
- Document incident rollback path for Vercel and database changes.

Validation evidence:

- A deliberate non-sensitive test error appears in the monitoring tool.
- Production smoke and health checks are documented.

Rollback / cleanup:

- Disable noisy alerts or sampling if monitoring causes unacceptable overhead.

### 5. Privacy, Terms, And Data Handling

Status: Open

Risk: Legal/compliance, user trust, AI data handling.

Trigger: Before collecting real trainer, gym, studio, customer, website, social, upload, or AI-generated content.

Current evidence:

- Product will ingest user-provided business/social content and generate AI outputs.
- No privacy policy, terms, retention policy, or data deletion workflow is documented yet.

Required resolution:

- Publish privacy policy and terms appropriate for the product.
- Document what content is stored, why, for how long, and how users can request deletion.
- Define whether user content may be sent to AI providers and under what terms.
- Add account/workspace deletion or a documented manual deletion process.

Validation evidence:

- Public links exist in the app where appropriate.
- Data deletion runbook has been tested on a test account/workspace.

Rollback / cleanup:

- Do not invite real users until these documents and deletion paths exist.

### 6. AI Prompt Contracts And Safety Evals

Status: Open

Risk: Unsafe, low-quality, unreviewable AI outputs.

Trigger: Before enabling real AI brand scans, idea generation, script generation, render plans, or publish plans for users.

Current evidence:

- Mock fixtures drive current product screens.
- `brand_scan` has a versioned prompt contract, output validator, and eval fixtures.
- `brand_scan` jobs can be queued and a protected worker route exists.
- Live production OpenAI/Supabase worker execution was validated on 2026-05-28 with a labeled disposable workspace. The first run exposed hidden whitespace/BOM handling in environment secrets; PR #24 normalized worker secrets and PR #25 normalized OpenAI config values. The retry processed one queued job and wrote a ready `brand_profiles` row. Cleanup deleted the disposable auth user and left 0 auth users, 0 workspaces, 0 AI jobs, and 0 brand profiles.
- Other AI job kinds do not have prompt contracts or eval tests yet.

Required resolution:

- Configure `AI_WORKER_SECRET`, `OPENAI_API_KEY`, and `OPENAI_BRAND_SCAN_MODEL` intentionally per non-production environment before enabling live worker calls outside Production.
- Add automatic scheduling or an approved operator runbook for worker invocation.
- Add transactional job completion or a Postgres RPC with `FOR UPDATE SKIP LOCKED` before high-volume external beta use.
- Define structured input/output contracts for each remaining AI job kind.
- Add prompt/version metadata to generated outputs.
- Expand eval fixtures with real model outputs before enabling external beta or paid traffic.
- Add reviewable logs that avoid storing secrets or unnecessary personal data.

Validation evidence:

- Prompt/eval tests pass.
- Worker route and OpenAI adapter tests pass.
- Generated output is structured, bounded, validated, and reviewable.

Rollback / cleanup:

- Feature flag real AI generation so it can be disabled without redeploying schema changes.

### 7. Security And Supply Chain Gates

Status: Open

Risk: Dependency, license, container, and source security exposure.

Trigger: Before paid traffic, external beta, or real customer data.

Current evidence:

- CI currently runs dependency audit, committed-secret scan, lint, typecheck, tests, build, local smoke, and Docker build.
- Broader SAST, SBOM, license scan, and container image scanning are not implemented yet.

Required resolution:

- Add or explicitly defer SAST.
- Add or explicitly defer SBOM generation.
- Add or explicitly defer license scanning.
- Add or explicitly defer container image scanning if containers become a deployment artifact.
- Document accepted residual risk.

Validation evidence:

- CI or release workflow shows the selected gates running.
- Findings are fixed or accepted with rationale.

Rollback / cleanup:

- Keep security gate changes separate from feature PRs when practical.

### 8. Browser Accessibility And Critical UX Checks

Status: Open

Risk: Broken onboarding, inaccessible auth/workspace flow, mobile regressions.

Trigger: Before real users or external beta.

Current evidence:

- No browser accessibility or visual regression suite is implemented yet.
- Production auth and workspace flow has been validated through HTTP and DB evidence, not full visual/manual browser QA.

Required resolution:

- Add a repeatable browser smoke for sign-in, protected redirects, onboarding, workspace creation, and sign-out.
- Add basic accessibility checks for auth and core app pages.
- Verify desktop and mobile responsive states for onboarding and dashboard.

Validation evidence:

- Browser test artifacts or documented manual screenshots.
- No blocking accessibility issues in core onboarding flow.

Rollback / cleanup:

- Keep visual changes narrow and reversible if issues are discovered late.

## Watchlist

These are not current release blockers, but they must be reassessed when their feature area becomes real:

- Cloudflare R2 upload storage before user uploads.
- Inngest background jobs before async rendering or AI pipelines.
- OpenAI API keys, model choice, prompt safety, and cost controls before real AI calls.
- Payment, subscription, or billing review before charging users.
- Custom domain, DNS, and email sender reputation before public launch.

## Process Rule For Future Work

When an agent or human says something like "we will do this later before production", immediately add an item here with a status and trigger. If it is important enough to block real users, also create or link a GitHub issue.

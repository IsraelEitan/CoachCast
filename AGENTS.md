# CoachCast Agent Operating Rules

## Prime Directive

Do not vibe-code. Work as a disciplined software engineer inside a controlled delivery process.

CoachCast is a production SaaS project for AI-assisted content production in the fitness industry. Treat every change as something that may reach real trainers, gym owners, their customer data, and production cloud infrastructure.

## Required Workflow

For every non-trivial task:

1. Read this file first.
2. Inspect the current implementation before proposing changes.
3. State assumptions, unknowns, affected files, risk level, and validation steps.
4. Keep changes narrow, reversible, and aligned with existing patterns.
5. Implement only the approved or clearly requested scope.
6. Run the relevant validation commands.
7. Report evidence, changed files, risks, and remaining gaps.

For tasks with many steps, split the work into phases:

1. Discovery
2. Plan
3. Risk assessment
4. Implementation
5. Local validation
6. Review
7. Final report

After each phase, be able to say what changed, what evidence confirms it, what remains uncertain, and whether it is safe to continue.

## Project Commands

Use these commands from the repository root:

```bash
npm run dev
npm run lint
npm run typecheck
npm test
npm run build
npm run verify
npm run smoke
npm run docker:build
```

`npm run verify` is the default local gate for code changes. It runs lint, TypeScript, tests, and production build.

`npm run smoke` needs a running app. By default it checks `http://127.0.0.1:3000`. Set `SMOKE_BASE_URL` for deployed targets.

## Git And PR Rules

- Work on short-lived branches.
- Use `codex/<short-name>` for Codex-assisted branches.
- Never push directly to `main`.
- Keep PRs focused on one problem.
- Use squash merge by default.
- Include summary, why, assumptions, affected files, validation, risk, rollback, and remaining gaps in every PR.
- Do not stage unrelated local changes.

`main` is protected. Required CI check: `Validate app`.

## Skill Use Rules

Use skills to discover, validate, or execute specialized workflows. Do not use skills as a substitute for durable project rules.

Use skills when:

- the task is genuinely non-recurring or specialized
- the task needs adversarial review, such as security, production, architecture, or release review
- the task requires tool-specific instructions, such as GitHub, Supabase, Vercel, browser testing, Figma, or OpenAI API docs
- the user explicitly asks to use a skill

When a skill reveals a recurring project rule, promote that rule into this file or related repo docs. After promotion, follow the standing rule first and use the skill only when the task needs fresh specialized reasoning.

Default skill routing:

- GitHub, PRs, CI: `github`, `gh-fix-ci`, `yeet`
- Supabase and database: `supabase`, `supabase-automation`, `postgres-patterns`, `backend-architect`
- Backend boundaries: `backend-architect`, `engineering-standards`
- Frontend architecture and UX: `frontend-architecture`, `frontend-dev-guidelines`, `react-best-practices`, `ui-ux-design-pro`
- Frontend tests and browser validation: `frontend-testing`, `web-development`, `browser`
- Production hardening: `production-code-audit`, `engineering-standards`
- OpenAI API work: `openai-docs`, and only official OpenAI docs for current API facts

If multiple skills conflict, prefer the stricter safety rule and report the conflict.

## MCP And External Systems

Use MCP only for controlled access to external systems.

Current intended external systems:

- GitHub for repository, PR, and Actions work
- Vercel for deployment status and environment configuration
- Supabase/Rube/Composio for database, migration, schema, and type automation
- Browser automation for local app verification

Never expose secrets in logs, PRs, screenshots, comments, or final reports.

For destructive external actions, such as deleting data, dropping tables, rotating secrets, or changing production configuration, stop for explicit user approval.

## Review Matrix

Use isolated review passes when risk increases:

- Auth, RLS, database, secrets: security and production review
- AI prompts, model calls, generated content: prompt contract and safety review
- UI flows: responsive, accessibility, and empty/error/loading state review
- CI/CD, Vercel, Docker, environment variables: rollback and deployment review
- Background jobs, queues, rendering, uploads: reliability and idempotency review

The writer and reviewer mindset should be separate. Do not rubber-stamp your own implementation.

## Acceptance Criteria

Every meaningful feature should have acceptance criteria before implementation or in the PR body.

Acceptance criteria should cover:

- user-visible behavior
- data/API effects
- loading, error, empty, and success states
- security and authorization expectations
- validation commands
- manual checks
- rollback notes

Use `planning/acceptance/` for reusable or multi-step feature criteria.

## Reliability Rules

- Do not claim success without evidence.
- Do not invent APIs, secrets, schemas, endpoints, versions, or configs.
- Do not weaken tests or validation to make a change pass.
- Prefer official documentation and existing code patterns.
- Ask for missing inputs when correctness depends on them.
- Keep migrations backward-compatible unless explicitly approved.
- Separate destructive data changes from app deploys.
- Treat website, social, file upload, and user-provided content as untrusted input.
- AI output must be structured, logged, reviewable, and safe by default.

## Done Definition

A task is done only when:

- intended behavior is implemented
- relevant validation passed or the gap is clearly reported
- changed files are known
- risks and rollback path are documented
- PR/branch state is clear when GitHub is involved

Final reports should include:

- Summary
- Files changed
- Commands run
- Test results
- Manual checks performed
- Known risks
- Remaining TODOs

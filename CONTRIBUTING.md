# Contributing to CoachCast

CoachCast is currently a proprietary product repository. Contributions are accepted only from authorized collaborators.

## Working Principles

- Read [AGENTS.md](./AGENTS.md) before doing agent-assisted work.
- Keep changes small and reviewable.
- Prefer production-safe increments over large rewrites.
- Preserve user-facing behavior unless the pull request clearly explains the change.
- Add tests or smoke coverage for meaningful behavior changes.
- Never commit secrets, `.env` files, generated videos, or private customer data.

## Branches

Use:

```text
feature/<short-name>
fix/<short-name>
chore/<short-name>
docs/<short-name>
codex/<short-name>
```

Examples:

```text
feature/supabase-auth-shell
fix/mobile-nav-overflow
chore/update-ci-smoke
```

## Commits

Use Conventional Commit style:

```text
type(scope): short imperative summary
```

Common types:

- `feat`
- `fix`
- `docs`
- `chore`
- `test`
- `refactor`
- `ci`

Examples:

```text
feat(onboarding): add brand scan form
test(fixtures): cover script draft contract
ci(smoke): validate production routes
```

## Pull Requests

Every pull request should include:

- what changed
- why it changed
- risk tier: low, medium, or high
- validation performed
- risks or manual checks
- rollback notes when relevant

Expected checks before merge:

```bash
npm run verify
npm run security:secrets
npm run lint
npm run typecheck
npm test
npm run build
```

To install the optional local pre-push hook:

```bash
npm run hooks:install
```

Run smoke checks when a local or preview URL is available:

```bash
npm run smoke
```

High-risk changes require explicit approval before merge. Examples:

- authentication or authorization
- Row Level Security
- database migrations
- secrets or encryption
- production configuration
- infrastructure
- CI/CD pipeline behavior

## Versioning

CoachCast uses Semantic Versioning.

Use tags for releases:

```bash
git tag v0.1.0
git push origin v0.1.0
```

Update these together when cutting a planned release:

- `package.json` version
- `CHANGELOG.md`
- GitHub release notes

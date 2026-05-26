# Contributing to CoachCast

CoachCast is currently a proprietary product repository. Contributions are accepted only from authorized collaborators.

## Working Principles

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
- validation performed
- risks or manual checks

Expected checks before merge:

```bash
npm run lint
npm run typecheck
npm test
npm run build
```

Run smoke checks when a local or preview URL is available:

```bash
npm run smoke
```

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

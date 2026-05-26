# CoachCast Git Workflow

## Goal

Keep product work fast without letting unstable code reach production.

## Branch Model

Use `main` as the protected production branch.

All work should happen on short-lived branches:

- `feature/<short-name>` for product features
- `fix/<short-name>` for bug fixes
- `chore/<short-name>` for maintenance
- `docs/<short-name>` for documentation
- `codex/<short-name>` for Codex-assisted changes

## Pull Request Rules

Every pull request should:

- solve one clear problem
- include a summary and validation notes
- keep unrelated refactors out
- pass CI before merge
- use squash merge by default

Recommended branch protection for `main`:

- require pull request before merging
- require status checks to pass
- require conversation resolution
- disallow direct pushes
- require branches to be up to date before merge once the project has multiple contributors

## Commit Standards

Use Conventional Commits:

```text
type(scope): summary
```

Examples:

```text
feat(ai): add brand scan contract
fix(nav): close mobile menu after section click
ci(release): validate tagged releases
docs(readme): document smoke checks
```

Good commits are:

- small enough to review
- explain the intent
- avoid mixing unrelated concerns

## Versioning

Use Semantic Versioning:

```text
MAJOR.MINOR.PATCH
```

Pre-1.0 guidance:

- `0.1.x` for foundational app and deployment work
- `0.2.x` for first real auth/database slice
- `0.3.x` for first AI brand scan slice
- `0.4.x` for recording/upload flow
- `0.5.x` for render job pipeline

Release checklist:

1. Update `package.json`.
2. Update `CHANGELOG.md`.
3. Merge the release PR into `main`.
4. Tag the release:

```bash
git tag v0.1.0
git push origin v0.1.0
```

5. Confirm the GitHub release workflow succeeds.

## CI/CD Policy

Pull requests must pass:

- dependency audit
- lint
- typecheck
- tests
- production build
- production smoke checks
- Docker image build

Deployments should pass:

- `/api/health`
- landing route
- app dashboard route
- onboarding route
- script studio route

## Rollback

For web app regressions:

1. Revert the problematic PR or promote the previous Vercel deployment.
2. Open a follow-up issue with the failure mode.
3. Add a test or smoke check before retrying.

For future database changes:

- use backward-compatible migrations
- separate destructive data changes from app deploys
- test migrations in staging before production

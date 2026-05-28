# Brand Scan Prompt Contract

## Work Intake

Problem statement:

- CoachCast can queue `brand_scan` jobs, but the worker must not call a model until the input contract, output contract, prompt version, and safety expectations are explicit.
- Fitness content is sensitive because the AI can accidentally invent credentials, testimonials, medical advice, unsafe exercise recommendations, or guaranteed body outcomes.

Expected behavior:

- Brand scan input is versioned and limited to workspace/source context.
- The prompt asks for JSON only and names the exact output schema.
- The output validator rejects malformed profiles, prompt-version drift, and missing safety coverage.
- Eval fixtures cover an independent trainer, a multi-trainer gym, unsafe medical positioning, and minimal context.

Constraints:

- Do not call OpenAI in this slice.
- Do not add worker execution in this slice.
- Do not store or expose secrets.
- Keep the contract usable by the future worker and tests without coupling it to React pages.

Risk tier:

- Medium, because this defines the AI output boundary future workers will rely on.

## Acceptance Criteria

- [x] `brand_scan` input contract is versioned.
- [x] Prompt version is durable and test-covered.
- [x] Prompt messages include task, constraints, safety rules, and exact output schema.
- [x] Output validator accepts a complete safe brand profile.
- [x] Output validator rejects missing required safety coverage.
- [x] Output validator rejects prompt-version drift.
- [x] Eval fixtures cover trainer, gym, safety, and edge-case scenarios.
- [x] `npm run verify` passes.

## Evidence

- 2026-05-28: `npm run verify` passed.
- The first verification attempt passed secrets, lint, typecheck, and tests, then hit a local Windows/OneDrive `.next` cache unlink error. The generated `.next` directory was resolved inside the workspace and removed; the full verification gate was rerun successfully.

## What Was Not Tested

- Actual OpenAI API calls.
- Model quality against real generated outputs.
- Worker execution from queued `brand_scan` job to `brand_profiles`.

## Rollback

- Revert this PR to remove the prompt contract and keep queued brand scan jobs non-executable.

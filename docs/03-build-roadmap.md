# CoachCast Build Roadmap

## Build Philosophy

Build one complete vertical slice before adding breadth.

The first complete slice is:

```text
Landing -> Content Scan -> Brand Profile -> Content Ideas -> Script Draft
```

Why:

- It proves the AI value before video complexity.
- It gives the user a reason to come back.
- It creates data needed for recording and rendering.
- It can be built and tested quickly.

## Phase 0: Current State

Current app:

- Static landing page.
- Product positioning is aligned with Clinicast.ai-style AI content production.
- No real app shell yet.
- No data model.
- No AI integration.
- No auth.
- No video pipeline.

Purpose of current state:

- Prove the market message and visual direction.

## Phase 1: Product Shell

### Goal

Create the first app-like experience with mocked data.

### Screens

- `/` landing page.
- `/app` dashboard.
- `/app/onboarding` content scan.
- `/app/profile` brand profile result.
- `/app/ideas` content ideas.
- `/app/scripts/:id` script studio.

### Data

Use static TypeScript fixtures first:

- mock brand profile
- mock content ideas
- mock scripts

### Why

This lets us design the actual product flow without waiting for backend, auth, AI keys, storage, or rendering.

### Done When

- User can move from scan to ideas to script.
- Every async screen has loading, error, empty, and success states.
- Mobile layout works.
- Browser QA passes.

## Phase 2: App Framework

### Goal

Move from static HTML to a maintainable app.

### Recommended Choice

Next.js + TypeScript.

### Why

The app needs:

- routes
- server/API endpoints
- typed data contracts
- async UI
- future auth
- future background jobs

Static HTML should remain useful as visual reference, but it should not carry the product.

### Initial Structure

```text
src/
  app/
    page.tsx
    app/
      page.tsx
      onboarding/page.tsx
      profile/page.tsx
      ideas/page.tsx
      scripts/[id]/page.tsx
  components/
    app-shell/
    brand-profile/
    content-ideas/
    script-studio/
    ui/
  lib/
    fixtures/
    types/
    ai/
```

## Phase 3: Prompt Contracts

### Goal

Create prompt templates and JSON schemas before calling real AI.

### Prompts

- Brand Voice Analyst.
- Content Strategist.
- Script Writer.
- Edit Assistant.

### Why

Reliable AI products need contracts. The prompt should not return "whatever text feels nice." It should return structured data the UI can render.

### Done When

- Each prompt has input variables.
- Each prompt has a JSON output schema.
- Each prompt has 2-3 example tests.
- Bad or incomplete input has a defined fallback.

## Phase 4: Real AI for First Slice

### Goal

Replace mock outputs with real AI for:

1. Brand profile.
2. Content ideas.
3. Script draft.

### Rules

- Keep user approval before recording.
- Save prompt input and output.
- Show clear error states.
- Never let AI invent proof, credentials, or guaranteed results.

### Why

This is the first moment CoachCast becomes more than a UI demo.

## Phase 5: Recording

### Goal

Let a trainer record or upload video.

### MVP Options

Option A:

- Browser recording with MediaRecorder.

Option B:

- Upload video file first.

Recommendation:

- Start with upload plus a simple teleprompter view.
- Add browser recording after the core script flow works.

### Why

Upload is simpler and reliable. Browser recording adds device permissions, browser quirks, file formats, and recovery states.

## Phase 6: Render Preview

### Goal

Create a branded vertical video preview.

### MVP

- Render static preview cards first.
- Then render real MP4.

### Likely Tools

- Remotion for template-based video rendering.
- FFmpeg for lower-level video processing if needed.

### Why

Video rendering is expensive and slow compared with text AI. We need to isolate it behind a job system.

## Phase 7: Job System

### Goal

Support long-running work.

### Jobs

- AI analysis job.
- Script generation job.
- Recording analysis job.
- Render job.
- Export job.

### States

```text
queued -> running -> succeeded
queued -> running -> failed -> retrying -> failed
queued -> canceled
```

### Why

Users must trust the app while work happens in the background.

## Phase 8: Export

### Goal

Let users download finished content.

### Include

- MP4 video.
- Caption text.
- Hashtags.
- Thumbnail.

### Why

Download/export provides value before platform publishing is approved.

## Phase 9: Publishing

### Goal

Publish or schedule to social platforms.

### Sequence

1. Manual download.
2. Calendar scheduling inside app.
3. Platform OAuth.
4. Direct publishing.

### Why

Direct publishing introduces platform approvals, API constraints, OAuth, failed uploads, and policy risk. It should not block the MVP.

## Phase 10: Analytics

### Goal

Feed results back into content ideas.

### MVP

- Manual performance entry.
- Simple labels: views, likes, saves, DMs, leads.

### Later

- Platform analytics integration.
- Idea scoring.
- Best-topic recommendations.

## Skill Use By Phase

### Phase 1-2

Use:

- `frontend-architecture`
- `frontend-dev-guidelines`
- `frontend-design`
- `ui-ux-design-pro`
- `web-development`

### Phase 3-4

Use:

- `prompt-lookup`
- `openai-docs`
- `backend-architect`
- `engineering-standards`

### Phase 5-8

Use:

- `backend-architect`
- `frontend-testing`
- `production-code-audit`
- `web-development`

### Phase 9-10

Use:

- `backend-architect`
- `production-code-audit`
- `openai-docs` when AI behavior changes

## Immediate Next Step

Create the product shell with mocked data.

Recommended implementation:

1. Convert the project to a Next.js + TypeScript app.
2. Preserve the current landing page design.
3. Add `/app/onboarding`, `/app/profile`, `/app/ideas`, and `/app/scripts/demo`.
4. Use fixtures from `src/lib/fixtures`.
5. Make the first flow clickable end to end.

Why:

- It turns the idea into a product.
- It creates a place for AI contracts to plug in.
- It lets us test the UX before real infrastructure.


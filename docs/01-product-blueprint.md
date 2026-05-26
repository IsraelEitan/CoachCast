# CoachCast Product Blueprint

## Step 1 Goal

Build CoachCast as an AI content production platform for trainers, gyms, studios, and online coaches.

The first product goal is not "make a nice landing page." The first product goal is to prove one magic workflow:

1. A trainer gives CoachCast a website, Instagram handle, or short onboarding answers.
2. CoachCast understands their coaching voice, audience, offer, and content angles.
3. CoachCast generates a short script.
4. The trainer records with a teleprompter.
5. CoachCast turns that recording into a branded vertical video package.

## Target User

Primary user for the MVP:

- Independent personal trainers and online coaches who sell coaching packages.

Why start here:

- They feel the content pain personally.
- They can decide quickly without a procurement process.
- Their content style is easier to learn than a multi-location gym brand.
- A single strong workflow can later expand to teams, studios, and franchises.

Deferred users:

- Multi-trainer gyms.
- Boutique studios.
- Fitness equipment brands.
- Supplement and wellness suppliers.

## Pain Points

The trainer knows content drives leads, but the content workflow is too heavy.

Core pains:

- They do not know what to post consistently.
- Writing hooks and scripts takes too much energy.
- Recording feels awkward without structure.
- Editing vertical video is slow and repetitive.
- Captions, B-roll, overlays, and posting create extra steps.
- Content quality is inconsistent.
- They cannot tell which topics create leads.

## MVP Promise

"Record one short clip. CoachCast turns it into a branded fitness Reel."

This promise is intentionally narrow. It avoids overpromising full social-media automation before the app has a dependable creation workflow.

## Success Criteria

MVP success means:

- A user can complete onboarding in under 5 minutes.
- The AI can generate 10 usable content ideas from one profile.
- The AI can generate one editable script from a chosen idea.
- The user can record or upload a video.
- The app can show a realistic render status and final preview.
- The user can download the finished video package.

Do not optimize for:

- Fully automatic social publishing on day one.
- Complex team permissions.
- Advanced analytics.
- Multi-language content.
- Perfect AI editing.

Those come after the main creation loop works.

## Product Screens

### 1. Landing Page

Purpose:

- Explain the promise.
- Show the AI production workflow.
- Drive users into the content scan.

Solves:

- Trust and positioning.
- Makes the product feel concrete before signup.

### 2. Onboarding / Content Scan

Inputs:

- Website URL, Instagram/TikTok handle, or manual coaching profile.
- Coach type.
- Target audience.
- Offer.
- Tone preferences.

Output:

- Brand voice summary.
- Audience pains.
- Content pillars.
- Recommended video formats.

Solves:

- The blank-page problem.
- Makes AI outputs feel personalized instead of generic.

### 3. Content Ideas

Inputs:

- Brand profile.
- Content pillars.
- Optional goal: leads, education, authority, retention, transformation.

Output:

- Short-form video ideas with hook, promise, difficulty, and CTA.

Solves:

- "I do not know what to post."

### 4. Script Studio

Inputs:

- Selected content idea.
- Coach profile.
- Desired style and length.

Output:

- Editable teleprompter script.
- Captions.
- Shot list.
- B-roll plan.
- CTA.

Solves:

- Writing and structuring content.

### 5. Teleprompter / Recording

Inputs:

- Approved script.

Output:

- Recorded browser video or uploaded file.

Solves:

- Recording anxiety.
- Keeps the coach on-message.

### 6. Render Queue

Inputs:

- Recording.
- Script.
- Brand kit.
- B-roll plan.

Output:

- Render job with progress states.

Solves:

- Long-running video work needs visible state, retries, and confidence.

### 7. Review / Edit

Inputs:

- Rendered preview.
- User edit instructions.

Output:

- Updated script, captions, or render request.

Solves:

- Gives the trainer control instead of making AI feel like a black box.

### 8. Library / Calendar

Inputs:

- Finished videos.

Output:

- Downloadable posts and optional schedule.

Solves:

- Organizes content assets.

## AI Jobs

Each AI job should be small, structured, and testable.

### Brand Voice Analyst

Goal:

- Turn website/social/manual input into a structured coach profile.

Output shape:

- tone
- audience
- offers
- content pillars
- pain points
- unsafe or unsupported claims to avoid

Why:

- Personalized scripts need structured context.

### Content Strategist

Goal:

- Generate content ideas from the coach profile.

Output shape:

- title
- hook
- viewer pain
- video promise
- format
- CTA
- confidence score

Why:

- Solves consistency and topic selection.

### Script Writer

Goal:

- Create a short-form script for a selected idea.

Output shape:

- hook
- body beats
- teleprompter text
- caption
- hashtags
- CTA
- shot list

Why:

- Converts strategy into recordable content.

### Recording Analyzer

Goal:

- Transcribe and inspect the recording.

Output shape:

- transcript
- missing beats
- strongest clips
- timing map
- retake suggestions

Why:

- Enables better editing and quality control.

### Video Assembly Planner

Goal:

- Convert script and recording analysis into editing instructions.

Output shape:

- clip cuts
- captions
- overlays
- B-roll slots
- music/motion style
- render template

Why:

- Separates creative decisions from the renderer.

### Edit Assistant

Goal:

- Convert user edit requests into safe, specific changes.

Output shape:

- changed script
- changed captions
- changed render plan
- explanation

Why:

- Makes "edit by talking" reliable.

## Core Data Objects

These are early product objects, not final database tables.

### User

- id
- name
- email
- plan

### Workspace

- id
- ownerId
- brandName
- coachType
- timezone

### BrandProfile

- workspaceId
- tone
- audience
- offers
- contentPillars
- painPoints
- avoidClaims

### ContentIdea

- id
- workspaceId
- title
- hook
- format
- CTA
- status

### Script

- id
- ideaId
- teleprompterText
- caption
- hashtags
- shotList
- version

### Recording

- id
- scriptId
- sourceType
- fileUrl
- transcript
- duration

### RenderJob

- id
- recordingId
- status
- progress
- renderPlan
- outputUrl
- error

### PublishedAsset

- id
- renderJobId
- platform
- status
- downloadUrl
- scheduledAt

## MVP Build Order

1. Keep the current landing page.
2. Add an app shell with mocked dashboard screens.
3. Add onboarding/content scan with mocked AI output.
4. Add content ideas with mocked AI output.
5. Add script studio with editable scripts.
6. Add teleprompter view.
7. Add fake render queue and review screen.
8. Replace mocks one AI job at a time.

## Why Mock First

Mocking first is not fake progress. It is product architecture.

It helps us:

- validate the user journey before paying complexity costs
- design stable data contracts
- avoid changing prompts while screens are still moving
- test loading, empty, error, and success states
- keep the app usable even when AI/video services fail

## First Technical Recommendation

Move from static HTML to a React or Next.js application once the MVP screens begin.

Recommended stack:

- Next.js for app routes, API routes, and later auth integration.
- TypeScript for data contracts.
- Tailwind or CSS modules for maintainable styling.
- React Hook Form or simple controlled forms for early forms.
- A job table/queue later for video rendering.

Why:

- The app needs multiple screens, async states, AI calls, user workspaces, and long-running jobs.
- Static HTML is good for the landing page, but not enough for the product.

## First Build Slice

The first real product slice should be:

"Content Scan -> Brand Profile -> Content Ideas"

Why this slice:

- It proves personalization.
- It is cheaper than video rendering.
- It creates immediate user value.
- It gives us structured context for every later AI step.

Acceptance criteria:

- User can enter a site or handle.
- App shows a loading state.
- App returns a brand profile.
- App returns at least 6 content ideas.
- User can select an idea and move to script generation.

## Deferred Work

Do not build these until the first product slice works:

- Instagram/TikTok publishing.
- Billing.
- Team permissions.
- Multi-brand workspaces.
- Supplier portal.
- Advanced analytics.
- Fully automated video rendering.

## Current Decision

We will build CoachCast as an AI-assisted content production app for independent trainers first, with a mocked product workflow before real AI/video integrations.


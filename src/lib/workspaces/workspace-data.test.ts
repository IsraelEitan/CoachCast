import assert from "node:assert/strict";
import test from "node:test";
import { mapBrandProfileRow, mapContentIdeaRow, type WorkspaceSummary } from "./workspace-data";

const workspace = {
  audience_summary: "Busy adults who want strength without intimidation.",
  id: "workspace-1",
  instagram_handle: "fitwithmaya",
  name: "Maya Strength",
  primary_offer: "Beginner strength coaching",
  website_url: "https://example.com"
} satisfies WorkspaceSummary;

test("brand profile rows map Supabase JSON into the app profile shape", () => {
  assert.deepEqual(
    mapBrandProfileRow(workspace, {
      audience: {
        ageRange: "30-45",
        experienceLevel: "Beginner",
        summary: "Adults returning to strength training."
      },
      avoid_claims: ["medical claims"],
      content_pillars: ["form fixes"],
      offers: ["8-week strength program"],
      pain_points: ["gym intimidation"],
      tone: ["warm", "direct"]
    }),
    {
      audience: {
        ageRange: "30-45",
        experienceLevel: "Beginner",
        summary: "Adults returning to strength training."
      },
      avoidClaims: ["medical claims"],
      contentPillars: ["form fixes"],
      offers: ["8-week strength program"],
      painPoints: ["gym intimidation"],
      tone: ["warm", "direct"],
      workspaceName: "Maya Strength"
    }
  );
});

test("brand profile mapping falls back to workspace context when AI fields are empty", () => {
  const profile = mapBrandProfileRow(workspace, {
    audience: {},
    avoid_claims: [],
    content_pillars: [],
    offers: [],
    pain_points: [],
    tone: []
  });

  assert.equal(profile.audience.summary, workspace.audience_summary);
  assert.deepEqual(profile.offers, [workspace.primary_offer]);
});

test("content idea rows map database snake_case fields into UI fields", () => {
  assert.deepEqual(
    mapContentIdeaRow({
      confidence: 0.875,
      cta: "Save this",
      format: "form-fix",
      hook: "Stop blaming your knees.",
      id: "idea-1",
      title: "Squat setup",
      viewer_pain: "Fear of injury"
    }),
    {
      confidence: 0.875,
      cta: "Save this",
      format: "form-fix",
      hook: "Stop blaming your knees.",
      id: "idea-1",
      title: "Squat setup",
      viewerPain: "Fear of injury"
    }
  );
});

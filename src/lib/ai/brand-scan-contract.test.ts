import assert from "node:assert/strict";
import test from "node:test";
import {
  BRAND_SCAN_PROMPT_VERSION,
  buildBrandScanInput,
  buildBrandScanPromptMessages,
  validateBrandScanOutput,
  type BrandScanOutput
} from "./brand-scan-contract";
import { brandScanEvalCases } from "./brand-scan-evals";
import type { WorkspaceSummary } from "../workspaces/workspace-data";

const workspace = {
  audience_summary: "Busy adults who want strength without intimidation.",
  id: "workspace-1",
  instagram_handle: "fitwithmaya",
  name: "Maya Strength",
  primary_offer: "Beginner strength coaching",
  website_url: "https://example.com"
} satisfies WorkspaceSummary;

const validOutput = {
  audience: {
    ageRange: "28-45",
    experienceLevel: "Beginner to intermediate",
    summary: "Busy adults who want strength without gym intimidation."
  },
  avoidClaims: [
    "guaranteed body transformation claims",
    "medical diagnosis or treatment claims",
    "unsafe exercise recommendations",
    "false credential claims",
    "invented testimonial or client result claims"
  ],
  contentPillars: ["form fixes", "myth busting", "quick workouts"],
  offers: ["1:1 beginner strength coaching"],
  painPoints: ["no time to train", "fear of bad form"],
  rawSummary: {
    promptVersion: BRAND_SCAN_PROMPT_VERSION,
    safetyNotes: ["Keep advice educational and ask users to consult qualified professionals for pain or injury."],
    sourceConfidence: "medium",
    sourceNotes: ["Workspace context included offer, audience, website, and Instagram handle."],
    summary: "Maya Strength is positioned around approachable beginner strength coaching.",
    uncertainties: ["No verified testimonials or credentials were provided."]
  },
  tone: ["warm", "direct", "evidence-informed"]
} satisfies BrandScanOutput;

test("brand scan prompt is versioned and includes the exact output schema request", () => {
  const messages = buildBrandScanPromptMessages(buildBrandScanInput(workspace));

  assert.equal(messages[0]?.role, "system");
  assert.match(messages[0]?.content ?? "", new RegExp(BRAND_SCAN_PROMPT_VERSION));
  assert.match(messages[0]?.content ?? "", /Return JSON only/);
  assert.match(messages[1]?.content ?? "", /outputSchema/);
  assert.match(messages[1]?.content ?? "", /Maya Strength/);
});

test("brand scan output validator accepts a complete safe profile", () => {
  assert.deepEqual(validateBrandScanOutput(validOutput), {
    ok: true,
    value: validOutput
  });
});

test("brand scan output validator rejects missing safety coverage", () => {
  const result = validateBrandScanOutput({
    ...validOutput,
    avoidClaims: ["guaranteed body transformation claims"]
  });

  assert.equal(result.ok, false);
  assert.match(result.ok ? "" : result.issues.join(" "), /guarantee, medical, unsafe, credential, and testimonial/);
});

test("brand scan output validator rejects prompt version drift", () => {
  const result = validateBrandScanOutput({
    ...validOutput,
    rawSummary: {
      ...validOutput.rawSummary,
      promptVersion: "brand-scan:old"
    }
  });

  assert.equal(result.ok, false);
  assert.match(result.ok ? "" : result.issues.join(" "), new RegExp(BRAND_SCAN_PROMPT_VERSION));
});

test("brand scan eval cases cover trainer, gym, safety, and edge-case inputs", () => {
  assert.deepEqual(
    brandScanEvalCases.map((item) => item.category).sort(),
    ["edge-case", "gym", "safety", "trainer"]
  );

  for (const evalCase of brandScanEvalCases) {
    const prompt = buildBrandScanPromptMessages(evalCase.input)
      .map((message) => message.content)
      .join("\n")
      .toLowerCase();

    assert.ok(evalCase.expectedPromptTerms.some((term) => prompt.includes(term.toLowerCase())), evalCase.id);
    assert.ok(evalCase.safetyExpectation.length > 0, evalCase.id);
  }
});

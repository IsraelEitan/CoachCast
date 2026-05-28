import assert from "node:assert/strict";
import test from "node:test";
import { BRAND_SCAN_PROMPT_VERSION, buildBrandScanInput, type BrandScanOutput } from "../ai/brand-scan-contract";
import type { BrandScanGeneration } from "../ai/openai-brand-scan";
import type { Json } from "../supabase/database.types";
import type { WorkspaceSummary } from "../workspaces/workspace-data";
import { runBrandScanWorkerOnce, type BrandScanWorkerRepository, type ClaimedBrandScanJob } from "./brand-scan-worker";

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
    safetyNotes: ["Keep advice educational and avoid diagnosing pain or injuries."],
    sourceConfidence: "medium",
    sourceNotes: ["Workspace context included the offer and audience summary."],
    summary: "Maya Strength is positioned around approachable beginner strength coaching.",
    uncertainties: ["No verified testimonials or credentials were provided."]
  },
  tone: ["warm", "direct", "evidence-informed"]
} satisfies BrandScanOutput;

function generation(output: BrandScanOutput = validOutput): BrandScanGeneration {
  return {
    metadata: {
      model: "unit-model",
      promptVersion: BRAND_SCAN_PROMPT_VERSION,
      provider: "openai",
      responseId: "resp_unit",
      usage: {
        total_tokens: 180
      }
    },
    output
  };
}

function job(input: Json = buildBrandScanInput(workspace) as Json): ClaimedBrandScanJob {
  return {
    id: "job-1",
    input,
    workspace_id: workspace.id
  };
}

function repository(claimedJob: ClaimedBrandScanJob | null, events: string[]): BrandScanWorkerRepository {
  return {
    async claimNextBrandScanJob() {
      events.push("claim");
      return claimedJob
        ? {
            job: claimedJob,
            status: "claimed"
          }
        : {
            status: "idle"
          };
    },
    async markBrandScanJobFailed(_jobId, errorMessage) {
      events.push(`failed:${errorMessage}`);
    },
    async markBrandScanJobSucceeded() {
      events.push("succeeded");
      return {
        profileId: "profile-1"
      };
    }
  };
}

test("brand scan worker returns idle when there is no queued work", async () => {
  const events: string[] = [];
  const result = await runBrandScanWorkerOnce({
    generateBrandScanProfile: async () => generation(),
    repository: repository(null, events)
  });

  assert.deepEqual(result, {
    status: "idle"
  });
  assert.deepEqual(events, ["claim"]);
});

test("brand scan worker fails invalid queued input without calling the model", async () => {
  const events: string[] = [];
  const result = await runBrandScanWorkerOnce({
    generateBrandScanProfile: async () => {
      throw new Error("model should not be called");
    },
    repository: repository(
      job({
        requestedOutput: "brand_profile",
        source: {},
        version: 99,
        workspace: {
          name: "Maya Strength"
        }
      } as Json),
      events
    )
  });

  assert.equal(result.status, "failed");
  assert.match(result.status === "failed" ? result.reason : "", /Invalid brand scan input/);
  assert.deepEqual(events.map((event) => event.split(":")[0]), ["claim", "failed"]);
});

test("brand scan worker writes a profile and succeeds a valid job", async () => {
  const events: string[] = [];
  const result = await runBrandScanWorkerOnce({
    generateBrandScanProfile: async () => generation(),
    repository: repository(job(), events)
  });

  assert.deepEqual(result, {
    jobId: "job-1",
    profileId: "profile-1",
    status: "processed"
  });
  assert.deepEqual(events, ["claim", "succeeded"]);
});

test("brand scan worker marks the job failed when generated output violates safety validation", async () => {
  const events: string[] = [];
  const unsafeGeneration = generation({
    ...validOutput,
    avoidClaims: ["guaranteed results"]
  } as BrandScanOutput);
  const result = await runBrandScanWorkerOnce({
    generateBrandScanProfile: async () => unsafeGeneration,
    repository: repository(job(), events)
  });

  assert.equal(result.status, "failed");
  assert.match(result.status === "failed" ? result.reason : "", /avoidClaims must cover/);
  assert.deepEqual(events.map((event) => event.split(":")[0]), ["claim", "failed"]);
});

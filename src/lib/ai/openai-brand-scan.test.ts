import assert from "node:assert/strict";
import test from "node:test";
import {
  BRAND_SCAN_OUTPUT_SCHEMA_NAME,
  BRAND_SCAN_PROMPT_VERSION,
  buildBrandScanInput,
  type BrandScanOutput
} from "./brand-scan-contract";
import { createOpenAiBrandScanGenerator, extractOpenAiResponseText } from "./openai-brand-scan";
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
    safetyNotes: ["Keep advice educational and avoid diagnosing pain or injuries."],
    sourceConfidence: "medium",
    sourceNotes: ["Workspace context included the offer and audience summary."],
    summary: "Maya Strength is positioned around approachable beginner strength coaching.",
    uncertainties: ["No verified testimonials or credentials were provided."]
  },
  tone: ["warm", "direct", "evidence-informed"]
} satisfies BrandScanOutput;

test("OpenAI brand scan generator requests strict structured output", async () => {
  const captured: {
    authorizationHeader: string | null;
    requestBody: Record<string, unknown> | null;
  } = {
    authorizationHeader: null,
    requestBody: null
  };

  const generator = createOpenAiBrandScanGenerator(
    {
      apiKey: "unit-test-key",
      endpoint: "https://unit.test/responses",
      model: "unit-model"
    },
    async (_url, init) => {
      captured.requestBody = JSON.parse(String(init.body)) as Record<string, unknown>;
      captured.authorizationHeader =
        init.headers instanceof Headers
          ? init.headers.get("Authorization")
          : ((init.headers as Record<string, string>).Authorization ?? null);

      return new Response(
        JSON.stringify({
          id: "resp_unit",
          output: [
            {
              content: [
                {
                  text: JSON.stringify(validOutput),
                  type: "output_text"
                }
              ],
              role: "assistant",
              type: "message"
            }
          ],
          status: "completed",
          usage: {
            input_tokens: 100,
            output_tokens: 80,
            total_tokens: 180
          }
        }),
        {
          status: 200
        }
      );
    }
  );

  const result = await generator(buildBrandScanInput(workspace));
  const requestBody = captured.requestBody;
  const text = requestBody?.text as { format?: Record<string, unknown> } | undefined;

  assert.equal(captured.authorizationHeader, "Bearer unit-test-key");
  assert.equal(requestBody?.model, "unit-model");
  assert.equal(requestBody?.store, false);
  assert.equal(text?.format?.type, "json_schema");
  assert.equal(text?.format?.name, BRAND_SCAN_OUTPUT_SCHEMA_NAME);
  assert.equal(text?.format?.strict, true);
  assert.equal(result.metadata.responseId, "resp_unit");
  assert.deepEqual(result.output, validOutput);
});

test("OpenAI brand scan generator reports provider errors without leaking request secrets", async () => {
  const generator = createOpenAiBrandScanGenerator(
    {
      apiKey: "unit-test-key",
      endpoint: "https://unit.test/responses",
      model: "unit-model"
    },
    async () =>
      new Response(
        JSON.stringify({
          error: {
            message: "model unavailable"
          }
        }),
        {
          status: 429
        }
      )
  );

  await assert.rejects(() => generator(buildBrandScanInput(workspace)), /HTTP 429.*model unavailable/);
});

test("OpenAI response text extractor supports output_text convenience field", () => {
  assert.equal(
    extractOpenAiResponseText({
      output_text: JSON.stringify(validOutput)
    }),
    JSON.stringify(validOutput)
  );
});

import assert from "node:assert/strict";
import test from "node:test";
import {
  buildBrandScanInput,
  getBrandScanJobMessage,
  isActiveBrandScanJob,
  type BrandScanJobSummary
} from "./brand-scan";
import type { WorkspaceSummary } from "../workspaces/workspace-data";

const workspace = {
  audience_summary: "Busy adults who want strength without intimidation.",
  id: "workspace-1",
  instagram_handle: "fitwithmaya",
  name: "Maya Strength",
  primary_offer: "Beginner strength coaching",
  website_url: "https://example.com"
} satisfies WorkspaceSummary;

function job(status: string, errorMessage: string | null = null): BrandScanJobSummary {
  return {
    created_at: "2026-05-28T08:00:00.000Z",
    error_message: errorMessage,
    id: "job-1",
    status,
    updated_at: "2026-05-28T08:00:00.000Z"
  };
}

test("brand scan input captures only workspace context needed by the AI job", () => {
  assert.deepEqual(buildBrandScanInput(workspace), {
    requestedOutput: "brand_profile",
    source: {
      instagramHandle: "fitwithmaya",
      websiteUrl: "https://example.com"
    },
    version: 1,
    workspace: {
      audienceSummary: "Busy adults who want strength without intimidation.",
      name: "Maya Strength",
      primaryOffer: "Beginner strength coaching"
    }
  });
});

test("queued and running brand scan jobs are active", () => {
  assert.equal(isActiveBrandScanJob(job("queued")), true);
  assert.equal(isActiveBrandScanJob(job("running")), true);
  assert.equal(isActiveBrandScanJob(job("failed")), false);
  assert.equal(isActiveBrandScanJob(null), false);
});

test("brand scan messages are user-visible and status specific", () => {
  assert.match(getBrandScanJobMessage(null), /No brand scan job/);
  assert.match(getBrandScanJobMessage(job("queued")), /queued/);
  assert.match(getBrandScanJobMessage(job("running")), /running/);
  assert.match(getBrandScanJobMessage(job("succeeded")), /successfully/);
  assert.equal(getBrandScanJobMessage(job("failed", "Provider unavailable")), "Provider unavailable");
  assert.match(getBrandScanJobMessage(job("cancelled")), /cancelled/);
});

import assert from "node:assert/strict";
import test from "node:test";
import { parseWorkspaceFormData } from "./workspace-input";

test("workspace input requires a business name", () => {
  const formData = new FormData();
  formData.set("instagramHandle", "@fitwithmaya");

  assert.deepEqual(parseWorkspaceFormData(formData), {
    error: "missing-name",
    ok: false
  });
});

test("workspace input requires a website or Instagram source", () => {
  const formData = new FormData();
  formData.set("name", "Maya Strength");

  assert.deepEqual(parseWorkspaceFormData(formData), {
    error: "missing-source",
    ok: false
  });
});

test("workspace input trims text and normalizes Instagram handles", () => {
  const formData = new FormData();
  formData.set("name", "  Maya Strength  ");
  formData.set("instagramHandle", "  @fitwithmaya  ");
  formData.set("primaryOffer", "  Beginner strength coaching  ");
  formData.set("audienceSummary", "  Busy adults  ");

  assert.deepEqual(parseWorkspaceFormData(formData), {
    data: {
      audienceSummary: "Busy adults",
      instagramHandle: "fitwithmaya",
      name: "Maya Strength",
      primaryOffer: "Beginner strength coaching",
      websiteUrl: null
    },
    ok: true
  });
});

import assert from "node:assert/strict";
import test from "node:test";
import { mockBrandProfile, mockContentIdeas, mockScriptDraft } from "./coachcast";

test("content ideas have unique stable identifiers", () => {
  const ids = mockContentIdeas.map((idea) => idea.id);
  const uniqueIds = new Set(ids);

  assert.equal(uniqueIds.size, ids.length);
  assert.ok(ids.every((id) => /^[a-z0-9-]+$/.test(id)));
});

test("content ideas keep confidence scores in a usable range", () => {
  assert.ok(mockContentIdeas.length > 0);
  assert.ok(mockContentIdeas.every((idea) => idea.confidence >= 0 && idea.confidence <= 1));
});

test("script draft references an existing content idea", () => {
  const ideaIds = new Set(mockContentIdeas.map((idea) => idea.id));

  assert.ok(ideaIds.has(mockScriptDraft.ideaId));
  assert.ok(mockScriptDraft.teleprompterText.includes(mockScriptDraft.hook));
  assert.ok(mockScriptDraft.beats.length >= 3);
});

test("brand profile includes safety boundaries for AI generation", () => {
  assert.ok(mockBrandProfile.avoidClaims.length > 0);
  assert.ok(mockBrandProfile.contentPillars.length > 0);
  assert.ok(mockBrandProfile.painPoints.length > 0);
});

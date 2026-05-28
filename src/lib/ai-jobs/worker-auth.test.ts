import assert from "node:assert/strict";
import test from "node:test";
import { isAuthorizedWorkerRequest, readBearerToken } from "./worker-auth";

test("worker auth reads bearer tokens", () => {
  assert.equal(readBearerToken("Bearer abc123"), "abc123");
  assert.equal(readBearerToken("bearer abc123"), "abc123");
  assert.equal(readBearerToken("Basic abc123"), null);
  assert.equal(readBearerToken(null), null);
});

test("worker auth uses exact secret match", () => {
  assert.equal(isAuthorizedWorkerRequest("expected-secret", "Bearer expected-secret"), true);
  assert.equal(isAuthorizedWorkerRequest("expected-secret", "Bearer wrong-secret"), false);
  assert.equal(isAuthorizedWorkerRequest("expected-secret", null), false);
});

import assert from "node:assert/strict";
import test from "node:test";
import { getAiWorkerSecret, isAuthorizedWorkerRequest, readBearerToken } from "./worker-auth";

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

test("worker auth trims configured secret whitespace", () => {
  const originalSecret = process.env.AI_WORKER_SECRET;

  try {
    process.env.AI_WORKER_SECRET = " expected-secret \n";
    assert.equal(getAiWorkerSecret(), "expected-secret");
    assert.equal(isAuthorizedWorkerRequest(getAiWorkerSecret()!, "Bearer expected-secret"), true);
  } finally {
    if (originalSecret === undefined) {
      delete process.env.AI_WORKER_SECRET;
    } else {
      process.env.AI_WORKER_SECRET = originalSecret;
    }
  }
});

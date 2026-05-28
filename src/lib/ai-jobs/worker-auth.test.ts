import assert from "node:assert/strict";
import test from "node:test";
import {
  getAiWorkerSecret,
  getConfiguredWorkerSecrets,
  getCronSecret,
  isAuthorizedWorkerRequest,
  isAuthorizedWorkerRequestWithAnySecret,
  readBearerToken
} from "./worker-auth";

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

test("worker auth reads AI and cron worker secrets", () => {
  const originalAiSecret = process.env.AI_WORKER_SECRET;
  const originalCronSecret = process.env.CRON_SECRET;

  try {
    process.env.AI_WORKER_SECRET = " manual-worker-secret \n";
    process.env.CRON_SECRET = " cron-worker-secret \n";

    assert.equal(getAiWorkerSecret(), "manual-worker-secret");
    assert.equal(getCronSecret(), "cron-worker-secret");
    assert.deepEqual(getConfiguredWorkerSecrets(), ["manual-worker-secret", "cron-worker-secret"]);
    assert.equal(
      isAuthorizedWorkerRequestWithAnySecret(getConfiguredWorkerSecrets(), "Bearer manual-worker-secret"),
      true
    );
    assert.equal(isAuthorizedWorkerRequestWithAnySecret(getConfiguredWorkerSecrets(), "Bearer cron-worker-secret"), true);
    assert.equal(isAuthorizedWorkerRequestWithAnySecret(getConfiguredWorkerSecrets(), "Bearer wrong-secret"), false);
  } finally {
    if (originalAiSecret === undefined) {
      delete process.env.AI_WORKER_SECRET;
    } else {
      process.env.AI_WORKER_SECRET = originalAiSecret;
    }

    if (originalCronSecret === undefined) {
      delete process.env.CRON_SECRET;
    } else {
      process.env.CRON_SECRET = originalCronSecret;
    }
  }
});

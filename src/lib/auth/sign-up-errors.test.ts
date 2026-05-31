import assert from "node:assert/strict";
import test from "node:test";
import { getSignUpFailureStatus } from "./sign-up-errors";

test("sign-up failure classifier identifies rate limits", () => {
  assert.equal(getSignUpFailureStatus({ message: "Too many requests", status: 429 }), "sign-up-rate-limited");
  assert.equal(getSignUpFailureStatus({ code: "over_email_send_rate_limit" }), "sign-up-rate-limited");
});

test("sign-up failure classifier identifies invalid email input", () => {
  assert.equal(getSignUpFailureStatus({ error_code: "email_address_invalid" }), "invalid-sign-up");
  assert.equal(getSignUpFailureStatus({ msg: "Email address is invalid" }), "invalid-sign-up");
});

test("sign-up failure classifier identifies email delivery configuration failures", () => {
  assert.equal(getSignUpFailureStatus({ message: "Email address not authorized" }), "email-delivery-unavailable");
  assert.equal(getSignUpFailureStatus({ message: "SMTP provider is not configured" }), "email-delivery-unavailable");
});

test("sign-up failure classifier falls back to generic status", () => {
  assert.equal(getSignUpFailureStatus(null), "sign-up-failed");
  assert.equal(getSignUpFailureStatus({ message: "unexpected auth error" }), "sign-up-failed");
});

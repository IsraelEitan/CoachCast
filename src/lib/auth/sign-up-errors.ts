export type SignUpFailureStatus = "email-delivery-unavailable" | "invalid-sign-up" | "sign-up-failed" | "sign-up-rate-limited";

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

function readNumber(value: unknown) {
  return typeof value === "number" && Number.isFinite(value) ? value : null;
}

function readString(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

export function getSignUpFailureStatus(error: unknown): SignUpFailureStatus {
  if (!isRecord(error)) {
    return "sign-up-failed";
  }

  const status = readNumber(error.status);
  const code = readString(error.code) || readString(error.error_code);
  const message = [readString(error.message), readString(error.msg), readString(error.name)].join(" ").toLowerCase();
  const normalizedCode = code.toLowerCase();

  if (status === 429 || normalizedCode.includes("rate") || message.includes("rate limit")) {
    return "sign-up-rate-limited";
  }

  if (normalizedCode.includes("email_address_invalid") || message.includes("email address") && message.includes("invalid")) {
    return "invalid-sign-up";
  }

  if (
    message.includes("email address not authorized") ||
    message.includes("smtp") ||
    message.includes("email provider") ||
    message.includes("email delivery")
  ) {
    return "email-delivery-unavailable";
  }

  return "sign-up-failed";
}

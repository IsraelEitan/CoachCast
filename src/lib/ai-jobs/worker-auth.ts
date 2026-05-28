import { timingSafeEqual } from "node:crypto";

function firstConfiguredValue(...values: Array<string | undefined>) {
  return values.find((value) => value !== undefined && value.trim().length > 0)?.trim();
}

export function getAiWorkerSecret() {
  return firstConfiguredValue(process.env.AI_WORKER_SECRET) ?? null;
}

export function readBearerToken(authorizationHeader: string | null) {
  if (!authorizationHeader) {
    return null;
  }

  const [scheme, token] = authorizationHeader.trim().split(/\s+/, 2);

  if (scheme?.toLowerCase() !== "bearer" || !token) {
    return null;
  }

  return token;
}

export function isAuthorizedWorkerRequest(secret: string, authorizationHeader: string | null) {
  const token = readBearerToken(authorizationHeader);

  if (!token) {
    return false;
  }

  const tokenBuffer = Buffer.from(token);
  const secretBuffer = Buffer.from(secret);

  return tokenBuffer.length === secretBuffer.length && timingSafeEqual(tokenBuffer, secretBuffer);
}

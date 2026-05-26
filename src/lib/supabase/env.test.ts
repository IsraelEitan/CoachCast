import assert from "node:assert/strict";
import test from "node:test";
import { getSupabaseBrowserConfig, getSupabaseServiceConfig } from "./env";

const managedEnvKeys = [
  "NEXT_PUBLIC_SUPABASE_URL",
  "NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY",
  "NEXT_PUBLIC_SUPABASE_ANON_KEY",
  "SUPABASE_SECRET_KEY",
  "SUPABASE_SERVICE_ROLE_KEY"
] as const;

const originalEnv = new Map<string, string | undefined>(
  managedEnvKeys.map((key) => [key, process.env[key]])
);

function restoreEnv() {
  for (const key of managedEnvKeys) {
    const originalValue = originalEnv.get(key);

    if (originalValue === undefined) {
      delete process.env[key];
    } else {
      process.env[key] = originalValue;
    }
  }
}

function clearSupabaseEnv() {
  for (const key of managedEnvKeys) {
    delete process.env[key];
  }
}

test.afterEach(restoreEnv);

test("browser config is null when Supabase env vars are missing", () => {
  clearSupabaseEnv();

  assert.equal(getSupabaseBrowserConfig(), null);
});

test("browser config prefers the publishable key", () => {
  clearSupabaseEnv();

  process.env.NEXT_PUBLIC_SUPABASE_URL = "https://example.supabase.co";
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY = "sb_publishable_test";
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = "legacy_anon";

  assert.deepEqual(getSupabaseBrowserConfig(), {
    publishableKey: "sb_publishable_test",
    url: "https://example.supabase.co"
  });
});

test("service config keeps server-only secret separate from browser config", () => {
  clearSupabaseEnv();

  process.env.NEXT_PUBLIC_SUPABASE_URL = "https://example.supabase.co";
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY = "sb_publishable_test";
  process.env.SUPABASE_SECRET_KEY = "sb_secret_test";

  assert.deepEqual(getSupabaseServiceConfig(), {
    publishableKey: "sb_publishable_test",
    secretKey: "sb_secret_test",
    url: "https://example.supabase.co"
  });
});

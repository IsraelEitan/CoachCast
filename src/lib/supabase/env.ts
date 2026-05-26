export type SupabaseBrowserConfig = {
  publishableKey: string;
  url: string;
};

export type SupabaseServiceConfig = SupabaseBrowserConfig & {
  secretKey: string;
};

function firstConfiguredValue(...values: Array<string | undefined>) {
  return values.find((value) => value !== undefined && value.trim().length > 0);
}

export function getSupabaseBrowserConfig(): SupabaseBrowserConfig | null {
  const url = firstConfiguredValue(process.env.NEXT_PUBLIC_SUPABASE_URL);
  const publishableKey = firstConfiguredValue(
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );

  if (!url || !publishableKey) {
    return null;
  }

  return { publishableKey, url };
}

export function requireSupabaseBrowserConfig(): SupabaseBrowserConfig {
  const config = getSupabaseBrowserConfig();

  if (!config) {
    throw new Error(
      "Missing Supabase browser config. Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY."
    );
  }

  return config;
}

export function getSupabaseServiceConfig(): SupabaseServiceConfig | null {
  const browserConfig = getSupabaseBrowserConfig();
  const secretKey = firstConfiguredValue(process.env.SUPABASE_SECRET_KEY, process.env.SUPABASE_SERVICE_ROLE_KEY);

  if (!browserConfig || !secretKey) {
    return null;
  }

  return { ...browserConfig, secretKey };
}

export function requireSupabaseServiceConfig(): SupabaseServiceConfig {
  const config = getSupabaseServiceConfig();

  if (!config) {
    throw new Error(
      "Missing Supabase server config. Set NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY, and SUPABASE_SECRET_KEY."
    );
  }

  return config;
}

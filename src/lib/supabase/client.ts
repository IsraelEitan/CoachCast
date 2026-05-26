import { createBrowserClient } from "@supabase/ssr";
import { requireSupabaseBrowserConfig } from "./env";
import type { Database } from "./database.types";

export function createSupabaseBrowserClient() {
  const { publishableKey, url } = requireSupabaseBrowserConfig();

  return createBrowserClient<Database>(url, publishableKey);
}

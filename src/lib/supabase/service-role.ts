import { createClient } from "@supabase/supabase-js";
import { requireSupabaseServiceConfig } from "./env";
import type { Database } from "./database.types";

export function createSupabaseServiceRoleClient() {
  const { secretKey, url } = requireSupabaseServiceConfig();

  return createClient<Database>(url, secretKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  });
}

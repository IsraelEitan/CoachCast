import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { requireSupabaseBrowserConfig } from "./env";
import type { Database } from "./database.types";

export async function createSupabaseServerClient() {
  const { publishableKey, url } = requireSupabaseBrowserConfig();
  const cookieStore = await cookies();

  return createServerClient<Database>(url, publishableKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, options, value }) => {
            cookieStore.set(name, value, options);
          });
        } catch {
          // Server Components cannot set cookies. Supabase Proxy handles refreshes for request flows.
        }
      }
    }
  });
}

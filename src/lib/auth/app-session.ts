import { redirect } from "next/navigation";
import type { User } from "@supabase/supabase-js";
import { getSupabaseBrowserConfig } from "@/lib/supabase/env";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import type { Database } from "@/lib/supabase/database.types";

export type WorkspaceSummary = Pick<
  Database["public"]["Tables"]["workspaces"]["Row"],
  "audience_summary" | "id" | "instagram_handle" | "name" | "primary_offer" | "website_url"
>;

export type AppSession =
  | {
      authEnabled: false;
      mode: "demo";
      user: null;
      workspace: null;
    }
  | {
      authEnabled: true;
      mode: "live";
      user: User;
      workspace: WorkspaceSummary | null;
    };

type AppSessionOptions = {
  nextPath?: string;
  requireWorkspace?: boolean;
};

type SupabaseServerClient = Awaited<ReturnType<typeof createSupabaseServerClient>>;

async function getPrimaryWorkspace(supabase: SupabaseServerClient) {
  const { data, error } = await supabase
    .from("workspaces")
    .select("audience_summary,id,instagram_handle,name,primary_offer,website_url")
    .order("created_at", { ascending: true })
    .limit(1)
    .maybeSingle();

  if (error) {
    throw new Error("Unable to load the current workspace.");
  }

  return data;
}

export async function getAppSession({ nextPath = "/app", requireWorkspace = false }: AppSessionOptions = {}) {
  if (!getSupabaseBrowserConfig()) {
    return {
      authEnabled: false,
      mode: "demo",
      user: null,
      workspace: null
    } satisfies AppSession;
  }

  const supabase = await createSupabaseServerClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (!user) {
    redirect(`/auth/sign-in?next=${encodeURIComponent(nextPath)}`);
  }

  const workspace = await getPrimaryWorkspace(supabase);

  if (requireWorkspace && !workspace) {
    redirect("/app/onboarding");
  }

  return {
    authEnabled: true,
    mode: "live",
    user,
    workspace
  } satisfies AppSession;
}

import { redirect } from "next/navigation";
import type { User } from "@supabase/supabase-js";
import { getSupabaseBrowserConfig } from "@/lib/supabase/env";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { getPrimaryWorkspace, type WorkspaceSummary } from "@/lib/workspaces/workspace-data";

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

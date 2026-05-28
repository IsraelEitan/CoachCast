"use server";

import { redirect } from "next/navigation";
import { getAppSession } from "../auth/app-session";
import { getSupabaseBrowserConfig } from "../supabase/env";
import { createBrandScanJob } from "./brand-scan";

export async function createBrandScanJobAction() {
  if (!getSupabaseBrowserConfig()) {
    redirect("/app/profile?status=demo");
  }

  const session = await getAppSession({ nextPath: "/app/profile", requireWorkspace: true });

  if (!session.authEnabled || !session.workspace) {
    redirect("/app/profile?status=brand-scan-error");
  }

  const result = await createBrandScanJob(session.workspace, session.user.id);

  if (!result.ok) {
    redirect("/app/profile?status=brand-scan-error");
  }

  const status = result.status === "already-active" ? "brand-scan-already-queued" : "brand-scan-queued";
  redirect(`/app/profile?status=${status}`);
}

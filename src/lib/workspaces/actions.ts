"use server";

import { redirect } from "next/navigation";
import { getSupabaseBrowserConfig } from "@/lib/supabase/env";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { parseWorkspaceFormData } from "./workspace-input";

export async function createWorkspaceAction(formData: FormData) {
  if (!getSupabaseBrowserConfig()) {
    redirect("/app/onboarding?status=demo");
  }

  const parsed = parseWorkspaceFormData(formData);

  if (!parsed.ok) {
    redirect(`/app/onboarding?status=${parsed.error}`);
  }

  const supabase = await createSupabaseServerClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/auth/sign-in?next=/app/onboarding");
  }

  const { error } = await supabase.from("workspaces").insert({
    audience_summary: parsed.data.audienceSummary,
    instagram_handle: parsed.data.instagramHandle,
    name: parsed.data.name,
    owner_id: user.id,
    primary_offer: parsed.data.primaryOffer,
    website_url: parsed.data.websiteUrl
  });

  if (error) {
    redirect("/app/onboarding?status=create-error");
  }

  redirect("/app?status=workspace-created");
}

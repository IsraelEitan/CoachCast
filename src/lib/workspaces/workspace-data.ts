import type { Database, Json } from "../supabase/database.types";
import { createSupabaseServerClient } from "../supabase/server";
import type { BrandProfile, ContentIdea } from "../types/coachcast";

export type WorkspaceSummary = Pick<
  Database["public"]["Tables"]["workspaces"]["Row"],
  "audience_summary" | "id" | "instagram_handle" | "name" | "primary_offer" | "website_url"
>;

type SupabaseServerClient = Awaited<ReturnType<typeof createSupabaseServerClient>>;

type BrandProfileRow = Pick<
  Database["public"]["Tables"]["brand_profiles"]["Row"],
  "audience" | "avoid_claims" | "content_pillars" | "offers" | "pain_points" | "tone"
>;

type ContentIdeaRow = Pick<
  Database["public"]["Tables"]["content_ideas"]["Row"],
  "confidence" | "cta" | "format" | "hook" | "id" | "title" | "viewer_pain"
>;

function readJsonText(value: Json, key: string) {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    return null;
  }

  const field = value[key];
  return typeof field === "string" && field.trim().length > 0 ? field : null;
}

export function mapBrandProfileRow(workspace: WorkspaceSummary, row: BrandProfileRow): BrandProfile {
  return {
    workspaceName: workspace.name,
    tone: row.tone,
    audience: {
      summary:
        readJsonText(row.audience, "summary") ?? workspace.audience_summary ?? "Audience summary not captured yet.",
      ageRange: readJsonText(row.audience, "ageRange") ?? "Not captured yet",
      experienceLevel: readJsonText(row.audience, "experienceLevel") ?? "Not captured yet"
    },
    offers: row.offers.length > 0 ? row.offers : workspace.primary_offer ? [workspace.primary_offer] : [],
    contentPillars: row.content_pillars,
    painPoints: row.pain_points,
    avoidClaims: row.avoid_claims
  };
}

export function mapContentIdeaRow(row: ContentIdeaRow): ContentIdea {
  return {
    id: row.id,
    title: row.title,
    hook: row.hook,
    viewerPain: row.viewer_pain,
    format: row.format,
    cta: row.cta,
    confidence: row.confidence
  };
}

export async function getPrimaryWorkspace(supabase: SupabaseServerClient) {
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

export async function getLatestBrandProfile(workspace: WorkspaceSummary) {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from("brand_profiles")
    .select("audience,avoid_claims,content_pillars,offers,pain_points,tone")
    .eq("workspace_id", workspace.id)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (error) {
    throw new Error("Unable to load the workspace brand profile.");
  }

  return data ? mapBrandProfileRow(workspace, data) : null;
}

export async function getRecentContentIdeas(workspaceId: string, limit = 6) {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from("content_ideas")
    .select("confidence,cta,format,hook,id,title,viewer_pain")
    .eq("workspace_id", workspaceId)
    .neq("status", "archived")
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error) {
    throw new Error("Unable to load workspace content ideas.");
  }

  return (data ?? []).map(mapContentIdeaRow);
}

export async function getWorkspaceStudioContent(workspace: WorkspaceSummary) {
  const [brandProfile, contentIdeas] = await Promise.all([
    getLatestBrandProfile(workspace),
    getRecentContentIdeas(workspace.id)
  ]);

  return {
    brandProfile,
    contentIdeas
  };
}

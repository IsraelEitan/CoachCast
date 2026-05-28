import type { Database, Json } from "../supabase/database.types";
import { createSupabaseServerClient } from "../supabase/server";
import type { WorkspaceSummary } from "../workspaces/workspace-data";

type AiJobRow = Database["public"]["Tables"]["ai_jobs"]["Row"];

export type BrandScanJobSummary = Pick<
  AiJobRow,
  "created_at" | "error_message" | "id" | "status" | "updated_at"
>;

export type BrandScanJobCreateResult =
  | {
      job: BrandScanJobSummary;
      ok: true;
      status: "already-active" | "created";
    }
  | {
      ok: false;
      status: "create-error";
    };

type BrandScanInput = {
  requestedOutput: "brand_profile";
  source: {
    instagramHandle: string | null;
    websiteUrl: string | null;
  };
  version: 1;
  workspace: {
    audienceSummary: string | null;
    name: string;
    primaryOffer: string | null;
  };
};

const activeBrandScanStatuses = new Set(["queued", "running"]);

export function buildBrandScanInput(workspace: WorkspaceSummary): BrandScanInput {
  return {
    requestedOutput: "brand_profile",
    source: {
      instagramHandle: workspace.instagram_handle,
      websiteUrl: workspace.website_url
    },
    version: 1,
    workspace: {
      audienceSummary: workspace.audience_summary,
      name: workspace.name,
      primaryOffer: workspace.primary_offer
    }
  };
}

export function isActiveBrandScanJob(job: BrandScanJobSummary | null) {
  return Boolean(job && activeBrandScanStatuses.has(job.status));
}

export function getBrandScanJobMessage(job: BrandScanJobSummary | null) {
  if (!job) {
    return "No brand scan job has been queued yet.";
  }

  if (job.status === "queued") {
    return "Brand scan is queued. The worker will process it when the execution slice is connected.";
  }

  if (job.status === "running") {
    return "Brand scan is running.";
  }

  if (job.status === "succeeded") {
    return "Brand scan finished successfully.";
  }

  if (job.status === "failed") {
    return job.error_message ?? "Brand scan failed.";
  }

  if (job.status === "cancelled") {
    return "Brand scan was cancelled.";
  }

  return "Brand scan status is unknown.";
}

function mapBrandScanJob(row: BrandScanJobSummary): BrandScanJobSummary {
  return {
    created_at: row.created_at,
    error_message: row.error_message,
    id: row.id,
    status: row.status,
    updated_at: row.updated_at
  };
}

export async function getLatestBrandScanJob(workspaceId: string) {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from("ai_jobs")
    .select("created_at,error_message,id,status,updated_at")
    .eq("workspace_id", workspaceId)
    .eq("kind", "brand_scan")
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (error) {
    throw new Error("Unable to load the latest brand scan job.");
  }

  return data ? mapBrandScanJob(data) : null;
}

export async function createBrandScanJob(workspace: WorkspaceSummary, userId: string): Promise<BrandScanJobCreateResult> {
  const supabase = await createSupabaseServerClient();
  const { data: activeJob, error: activeJobError } = await supabase
    .from("ai_jobs")
    .select("created_at,error_message,id,status,updated_at")
    .eq("workspace_id", workspace.id)
    .eq("kind", "brand_scan")
    .in("status", ["queued", "running"])
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (activeJobError) {
    return {
      ok: false,
      status: "create-error"
    };
  }

  if (activeJob) {
    return {
      job: mapBrandScanJob(activeJob),
      ok: true,
      status: "already-active"
    };
  }

  const { data, error } = await supabase
    .from("ai_jobs")
    .insert({
      created_by: userId,
      input: buildBrandScanInput(workspace) as Json,
      kind: "brand_scan",
      output: {},
      status: "queued",
      workspace_id: workspace.id
    })
    .select("created_at,error_message,id,status,updated_at")
    .single();

  if (error) {
    return {
      ok: false,
      status: "create-error"
    };
  }

  return {
    job: mapBrandScanJob(data),
    ok: true,
    status: "created"
  };
}

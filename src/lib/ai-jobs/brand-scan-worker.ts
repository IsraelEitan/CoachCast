import { createSupabaseServiceRoleClient } from "../supabase/service-role";
import type { Database, Json } from "../supabase/database.types";
import {
  BRAND_SCAN_INPUT_VERSION,
  validateBrandScanInput,
  validateBrandScanOutput,
  type BrandScanInput
} from "../ai/brand-scan-contract";
import type { BrandScanGeneration } from "../ai/openai-brand-scan";

type AiJobRow = Database["public"]["Tables"]["ai_jobs"]["Row"];
type BrandProfileInsert = Database["public"]["Tables"]["brand_profiles"]["Insert"];
type SupabaseServiceClient = ReturnType<typeof createSupabaseServiceRoleClient>;

export type ClaimedBrandScanJob = Pick<AiJobRow, "id" | "input" | "workspace_id">;

export type BrandScanClaimResult =
  | {
      job: ClaimedBrandScanJob;
      status: "claimed";
    }
  | {
      status: "idle" | "lost-race";
    };

export type BrandScanWorkerRepository = {
  claimNextBrandScanJob(): Promise<BrandScanClaimResult>;
  markBrandScanJobFailed(jobId: string, errorMessage: string): Promise<void>;
  markBrandScanJobSucceeded(job: ClaimedBrandScanJob, input: BrandScanInput, generation: BrandScanGeneration): Promise<{
    profileId: string;
  }>;
};

export type BrandScanWorkerResult =
  | {
      jobId: string;
      profileId: string;
      status: "processed";
    }
  | {
      status: "idle";
    }
  | {
      jobId: string;
      reason: string;
      status: "failed";
    };

export type BrandScanWorkerOptions = {
  generateBrandScanProfile: (input: BrandScanInput) => Promise<BrandScanGeneration>;
  repository: BrandScanWorkerRepository;
};

const maxStoredErrorLength = 500;

function nowIso() {
  return new Date().toISOString();
}

function toSafeErrorMessage(error: unknown) {
  const message = error instanceof Error ? error.message : "Unknown brand scan worker error.";
  const compact = message.replace(/\s+/g, " ").trim();
  return compact.length > maxStoredErrorLength ? `${compact.slice(0, maxStoredErrorLength - 3)}...` : compact;
}

function buildBrandProfileInsert(
  job: ClaimedBrandScanJob,
  input: BrandScanInput,
  generation: BrandScanGeneration
): BrandProfileInsert {
  const output = generation.output;

  return {
    audience: output.audience as Json,
    avoid_claims: output.avoidClaims,
    content_pillars: output.contentPillars,
    offers: output.offers,
    pain_points: output.painPoints,
    raw_summary: {
      ...output.rawSummary,
      generatedAt: nowIso(),
      inputVersion: BRAND_SCAN_INPUT_VERSION,
      jobId: job.id,
      model: generation.metadata.model,
      provider: generation.metadata.provider,
      responseId: generation.metadata.responseId
    } as Json,
    source_handle: input.source.instagramHandle,
    source_url: input.source.websiteUrl,
    status: "ready",
    tone: output.tone,
    workspace_id: job.workspace_id
  };
}

function buildJobOutput(generation: BrandScanGeneration, profileId: string): Json {
  return {
    brandProfileId: profileId,
    metadata: generation.metadata,
    profile: generation.output
  } as Json;
}

export async function runBrandScanWorkerOnce({
  generateBrandScanProfile,
  repository
}: BrandScanWorkerOptions): Promise<BrandScanWorkerResult> {
  const claim = await repository.claimNextBrandScanJob();

  if (claim.status !== "claimed") {
    return {
      status: "idle"
    };
  }

  const inputValidation = validateBrandScanInput(claim.job.input);

  if (!inputValidation.ok) {
    const reason = `Invalid brand scan input: ${inputValidation.issues.join(" ")}`;
    await repository.markBrandScanJobFailed(claim.job.id, reason);

    return {
      jobId: claim.job.id,
      reason,
      status: "failed"
    };
  }

  try {
    const generation = await generateBrandScanProfile(inputValidation.value);
    const outputValidation = validateBrandScanOutput(generation.output);

    if (!outputValidation.ok) {
      throw new Error(`Generated brand scan output failed validation: ${outputValidation.issues.join(" ")}`);
    }

    const { profileId } = await repository.markBrandScanJobSucceeded(
      claim.job,
      inputValidation.value,
      generation
    );

    return {
      jobId: claim.job.id,
      profileId,
      status: "processed"
    };
  } catch (error) {
    const reason = toSafeErrorMessage(error);
    await repository.markBrandScanJobFailed(claim.job.id, reason);

    return {
      jobId: claim.job.id,
      reason,
      status: "failed"
    };
  }
}

export function createSupabaseBrandScanWorkerRepository(
  supabase: SupabaseServiceClient = createSupabaseServiceRoleClient()
): BrandScanWorkerRepository {
  return {
    async claimNextBrandScanJob() {
      const { data: nextJob, error: selectError } = await supabase
        .from("ai_jobs")
        .select("id,input,workspace_id")
        .eq("kind", "brand_scan")
        .eq("status", "queued")
        .order("created_at", { ascending: true })
        .limit(1)
        .maybeSingle();

      if (selectError) {
        throw new Error("Unable to select the next queued brand scan job.");
      }

      if (!nextJob) {
        return {
          status: "idle"
        };
      }

      const { data: claimedJob, error: updateError } = await supabase
        .from("ai_jobs")
        .update({
          error_message: null,
          started_at: nowIso(),
          status: "running"
        })
        .eq("id", nextJob.id)
        .eq("status", "queued")
        .select("id,input,workspace_id")
        .maybeSingle();

      if (updateError) {
        throw new Error("Unable to claim the next queued brand scan job.");
      }

      if (!claimedJob) {
        return {
          status: "lost-race"
        };
      }

      return {
        job: claimedJob,
        status: "claimed"
      };
    },

    async markBrandScanJobFailed(jobId, errorMessage) {
      const { error } = await supabase
        .from("ai_jobs")
        .update({
          error_message: errorMessage,
          finished_at: nowIso(),
          output: {
            error: {
              message: errorMessage
            }
          },
          status: "failed"
        })
        .eq("id", jobId);

      if (error) {
        throw new Error("Unable to mark brand scan job failed.");
      }
    },

    async markBrandScanJobSucceeded(job, input, generation) {
      const { data: profile, error: profileError } = await supabase
        .from("brand_profiles")
        .insert(buildBrandProfileInsert(job, input, generation))
        .select("id")
        .single();

      if (profileError) {
        throw new Error("Unable to write brand scan profile.");
      }

      const { data: updatedJob, error: jobError } = await supabase
        .from("ai_jobs")
        .update({
          error_message: null,
          finished_at: nowIso(),
          output: buildJobOutput(generation, profile.id),
          status: "succeeded"
        })
        .eq("id", job.id)
        .eq("status", "running")
        .select("id")
        .maybeSingle();

      if (jobError || !updatedJob) {
        throw new Error("Unable to mark brand scan job succeeded.");
      }

      return {
        profileId: profile.id
      };
    }
  };
}

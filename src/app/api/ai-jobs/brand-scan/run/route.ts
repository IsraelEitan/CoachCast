import { NextResponse, type NextRequest } from "next/server";
import { createOpenAiBrandScanGenerator, getOpenAiBrandScanConfig } from "@/lib/ai/openai-brand-scan";
import { createSupabaseBrandScanWorkerRepository, runBrandScanWorkerOnce } from "@/lib/ai-jobs/brand-scan-worker";
import { getConfiguredWorkerSecrets, isAuthorizedWorkerRequestWithAnySecret } from "@/lib/ai-jobs/worker-auth";
import { getSupabaseServiceConfig } from "@/lib/supabase/env";

export const dynamic = "force-dynamic";
export const maxDuration = 60;
export const runtime = "nodejs";

function jsonResponse(body: Record<string, unknown>, status = 200) {
  return NextResponse.json(body, {
    headers: {
      "Cache-Control": "no-store"
    },
    status
  });
}

async function runWorkerRequest(request: NextRequest) {
  const workerSecrets = getConfiguredWorkerSecrets();

  if (workerSecrets.length === 0) {
    return jsonResponse(
      {
        reason: "missing-worker-secret",
        status: "disabled"
      },
      503
    );
  }

  if (!isAuthorizedWorkerRequestWithAnySecret(workerSecrets, request.headers.get("authorization"))) {
    return jsonResponse(
      {
        status: "unauthorized"
      },
      401
    );
  }

  if (!getSupabaseServiceConfig()) {
    return jsonResponse(
      {
        reason: "missing-supabase-service-config",
        status: "disabled"
      },
      503
    );
  }

  const openAiConfig = getOpenAiBrandScanConfig();

  if (!openAiConfig) {
    return jsonResponse(
      {
        reason: "missing-openai-config",
        status: "disabled"
      },
      503
    );
  }

  try {
    const result = await runBrandScanWorkerOnce({
      generateBrandScanProfile: createOpenAiBrandScanGenerator(openAiConfig),
      repository: createSupabaseBrandScanWorkerRepository()
    });

    return jsonResponse(result);
  } catch {
    return jsonResponse(
      {
        reason: "worker-execution-error",
        status: "error"
      },
      500
    );
  }
}

export async function GET(request: NextRequest) {
  return runWorkerRequest(request);
}

export async function POST(request: NextRequest) {
  return runWorkerRequest(request);
}

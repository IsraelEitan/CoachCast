import type { WorkspaceSummary } from "../workspaces/workspace-data";

export const BRAND_SCAN_INPUT_VERSION = 1;
export const BRAND_SCAN_PROMPT_VERSION = "brand-scan:v1";

export type BrandScanInput = {
  requestedOutput: "brand_profile";
  source: {
    instagramHandle: string | null;
    websiteUrl: string | null;
  };
  version: typeof BRAND_SCAN_INPUT_VERSION;
  workspace: {
    audienceSummary: string | null;
    name: string;
    primaryOffer: string | null;
  };
};

export type BrandScanOutput = {
  audience: {
    ageRange: string;
    experienceLevel: string;
    summary: string;
  };
  avoidClaims: string[];
  contentPillars: string[];
  offers: string[];
  painPoints: string[];
  rawSummary: {
    promptVersion: typeof BRAND_SCAN_PROMPT_VERSION;
    safetyNotes: string[];
    sourceConfidence: "high" | "low" | "medium";
    sourceNotes: string[];
    summary: string;
    uncertainties: string[];
  };
  tone: string[];
};

export type BrandScanPromptMessage = {
  content: string;
  role: "system" | "user";
};

export type BrandScanValidationResult =
  | {
      ok: true;
      value: BrandScanOutput;
    }
  | {
      issues: string[];
      ok: false;
    };

const brandScanOutputSchema = {
  audience: {
    ageRange: "string",
    experienceLevel: "string",
    summary: "string"
  },
  avoidClaims: ["string"],
  contentPillars: ["string"],
  offers: ["string"],
  painPoints: ["string"],
  rawSummary: {
    promptVersion: BRAND_SCAN_PROMPT_VERSION,
    safetyNotes: ["string"],
    sourceConfidence: "high | medium | low",
    sourceNotes: ["string"],
    summary: "string",
    uncertainties: ["string"]
  },
  tone: ["string"]
};

const requiredAvoidClaimThemes = ["guarantee", "medical", "unsafe", "credential", "testimonial"];

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

function readString(record: Record<string, unknown>, key: string, issues: string[]) {
  const value = record[key];

  if (typeof value !== "string" || value.trim().length === 0) {
    issues.push(`${key} must be a non-empty string.`);
    return "";
  }

  return value.trim();
}

function readStringArray(record: Record<string, unknown>, key: string, issues: string[], minLength = 1) {
  const value = record[key];

  if (!Array.isArray(value)) {
    issues.push(`${key} must be an array.`);
    return [];
  }

  const items = value.filter((item): item is string => typeof item === "string" && item.trim().length > 0);

  if (items.length !== value.length) {
    issues.push(`${key} must contain only non-empty strings.`);
  }

  if (items.length < minLength) {
    issues.push(`${key} must contain at least ${minLength} item(s).`);
  }

  return items.map((item) => item.trim());
}

function hasRequiredSafetyCoverage(avoidClaims: string[]) {
  const normalized = avoidClaims.join(" ").toLowerCase();
  return requiredAvoidClaimThemes.every((theme) => normalized.includes(theme));
}

export function buildBrandScanInput(workspace: WorkspaceSummary): BrandScanInput {
  return {
    requestedOutput: "brand_profile",
    source: {
      instagramHandle: workspace.instagram_handle,
      websiteUrl: workspace.website_url
    },
    version: BRAND_SCAN_INPUT_VERSION,
    workspace: {
      audienceSummary: workspace.audience_summary,
      name: workspace.name,
      primaryOffer: workspace.primary_offer
    }
  };
}

export function buildBrandScanPromptMessages(input: BrandScanInput): BrandScanPromptMessage[] {
  return [
    {
      role: "system",
      content: [
        `You are CoachCast's Brand Voice Analyst. Prompt version: ${BRAND_SCAN_PROMPT_VERSION}.`,
        "Create a reusable fitness-business brand profile for short-form content generation.",
        "Return JSON only. Match the requested schema exactly.",
        "Do not invent credentials, client results, testimonials, medical authority, or guaranteed outcomes.",
        "If context is missing, infer conservatively and record uncertainty in rawSummary.uncertainties.",
        "Always include avoidClaims covering guarantee, medical, unsafe, credential, and testimonial risks."
      ].join("\n")
    },
    {
      role: "user",
      content: JSON.stringify(
        {
          input,
          outputSchema: brandScanOutputSchema,
          task: "Analyze the workspace context and produce a brand profile for safe AI content generation."
        },
        null,
        2
      )
    }
  ];
}

export function validateBrandScanOutput(value: unknown): BrandScanValidationResult {
  const issues: string[] = [];

  if (!isRecord(value)) {
    return {
      issues: ["Output must be an object."],
      ok: false
    };
  }

  const audienceRecord = isRecord(value.audience) ? value.audience : null;
  const rawSummaryRecord = isRecord(value.rawSummary) ? value.rawSummary : null;

  if (!audienceRecord) {
    issues.push("audience must be an object.");
  }

  if (!rawSummaryRecord) {
    issues.push("rawSummary must be an object.");
  }

  const audience = {
    ageRange: audienceRecord ? readString(audienceRecord, "ageRange", issues) : "",
    experienceLevel: audienceRecord ? readString(audienceRecord, "experienceLevel", issues) : "",
    summary: audienceRecord ? readString(audienceRecord, "summary", issues) : ""
  };
  const avoidClaims = readStringArray(value, "avoidClaims", issues, 5);
  const contentPillars = readStringArray(value, "contentPillars", issues, 2);
  const offers = readStringArray(value, "offers", issues, 0);
  const painPoints = readStringArray(value, "painPoints", issues, 2);
  const tone = readStringArray(value, "tone", issues, 2);
  const sourceConfidence =
    rawSummaryRecord && ["high", "low", "medium"].includes(String(rawSummaryRecord.sourceConfidence))
      ? (rawSummaryRecord.sourceConfidence as BrandScanOutput["rawSummary"]["sourceConfidence"])
      : "low";

  if (rawSummaryRecord && rawSummaryRecord.sourceConfidence !== sourceConfidence) {
    issues.push("rawSummary.sourceConfidence must be high, medium, or low.");
  }

  const rawSummary: BrandScanOutput["rawSummary"] = {
    promptVersion: BRAND_SCAN_PROMPT_VERSION,
    safetyNotes: rawSummaryRecord ? readStringArray(rawSummaryRecord, "safetyNotes", issues, 1) : [],
    sourceConfidence,
    sourceNotes: rawSummaryRecord ? readStringArray(rawSummaryRecord, "sourceNotes", issues, 1) : [],
    summary: rawSummaryRecord ? readString(rawSummaryRecord, "summary", issues) : "",
    uncertainties: rawSummaryRecord ? readStringArray(rawSummaryRecord, "uncertainties", issues, 0) : []
  };

  const promptVersion = rawSummaryRecord ? readString(rawSummaryRecord, "promptVersion", issues) : "";

  if (promptVersion !== BRAND_SCAN_PROMPT_VERSION) {
    issues.push(`rawSummary.promptVersion must be ${BRAND_SCAN_PROMPT_VERSION}.`);
  }

  if (!hasRequiredSafetyCoverage(avoidClaims)) {
    issues.push("avoidClaims must cover guarantee, medical, unsafe, credential, and testimonial risks.");
  }

  if (issues.length > 0) {
    return {
      issues,
      ok: false
    };
  }

  return {
    ok: true,
    value: {
      audience,
      avoidClaims,
      contentPillars,
      offers,
      painPoints,
      rawSummary,
      tone
    }
  };
}

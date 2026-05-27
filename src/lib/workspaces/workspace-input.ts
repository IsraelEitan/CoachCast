export type WorkspaceInput = {
  audienceSummary: string | null;
  instagramHandle: string | null;
  name: string;
  primaryOffer: string | null;
  websiteUrl: string | null;
};

export type WorkspaceInputResult =
  | {
      data: WorkspaceInput;
      ok: true;
    }
  | {
      error: "missing-name" | "missing-source";
      ok: false;
    };

function optionalString(formData: FormData, key: string) {
  const value = formData.get(key);

  if (typeof value !== "string") {
    return null;
  }

  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : null;
}

function normalizeInstagramHandle(value: string | null) {
  if (!value) {
    return null;
  }

  return value.replace(/^@+/, "").trim() || null;
}

export function parseWorkspaceFormData(formData: FormData): WorkspaceInputResult {
  const name = optionalString(formData, "name");
  const websiteUrl = optionalString(formData, "websiteUrl");
  const instagramHandle = normalizeInstagramHandle(optionalString(formData, "instagramHandle"));

  if (!name || name.length < 2) {
    return { error: "missing-name", ok: false };
  }

  if (!websiteUrl && !instagramHandle) {
    return { error: "missing-source", ok: false };
  }

  return {
    data: {
      audienceSummary: optionalString(formData, "audienceSummary"),
      instagramHandle,
      name,
      primaryOffer: optionalString(formData, "primaryOffer"),
      websiteUrl
    },
    ok: true
  };
}

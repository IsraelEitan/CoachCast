import {
  BRAND_SCAN_OUTPUT_SCHEMA_NAME,
  BRAND_SCAN_PROMPT_VERSION,
  brandScanOutputJsonSchema,
  buildBrandScanPromptMessages,
  validateBrandScanOutput,
  type BrandScanInput,
  type BrandScanOutput
} from "./brand-scan-contract";

export const DEFAULT_BRAND_SCAN_MODEL = "gpt-5.4-mini";
export const OPENAI_RESPONSES_ENDPOINT = "https://api.openai.com/v1/responses";

export type BrandScanGeneration = {
  metadata: {
    model: string;
    promptVersion: typeof BRAND_SCAN_PROMPT_VERSION;
    provider: "openai";
    responseId: string | null;
    usage: Record<string, unknown> | null;
  };
  output: BrandScanOutput;
};

export type OpenAiBrandScanConfig = {
  apiKey: string;
  endpoint?: string;
  model?: string;
};

type FetchLike = (input: string, init: RequestInit) => Promise<Response>;

function firstConfiguredValue(...values: Array<string | undefined>) {
  return values.find((value) => value !== undefined && value.trim().length > 0)?.trim();
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

function toRecord(value: unknown) {
  return isRecord(value) ? value : null;
}

function sanitizeProviderMessage(value: string) {
  const compact = value.replace(/\s+/g, " ").trim();
  return compact.length > 180 ? `${compact.slice(0, 177)}...` : compact;
}

export function getOpenAiBrandScanConfig(): OpenAiBrandScanConfig | null {
  const apiKey = firstConfiguredValue(process.env.OPENAI_API_KEY);

  if (!apiKey) {
    return null;
  }

  return {
    apiKey,
    model: firstConfiguredValue(process.env.OPENAI_BRAND_SCAN_MODEL) ?? DEFAULT_BRAND_SCAN_MODEL
  };
}

export function extractOpenAiResponseText(response: unknown) {
  const record = toRecord(response);

  if (!record) {
    return null;
  }

  if (typeof record.output_text === "string" && record.output_text.trim().length > 0) {
    return record.output_text;
  }

  if (!Array.isArray(record.output)) {
    return null;
  }

  for (const item of record.output) {
    const itemRecord = toRecord(item);
    const content = itemRecord?.content;

    if (!Array.isArray(content)) {
      continue;
    }

    for (const contentItem of content) {
      const contentRecord = toRecord(contentItem);

      if (contentRecord?.type === "output_text" && typeof contentRecord.text === "string") {
        return contentRecord.text;
      }
    }
  }

  return null;
}

async function readOpenAiErrorMessage(response: Response) {
  const fallback = `OpenAI Responses API returned HTTP ${response.status}.`;
  const body = await response.text();

  if (!body) {
    return fallback;
  }

  try {
    const parsed = JSON.parse(body) as unknown;
    const error = toRecord(toRecord(parsed)?.error);
    const message = error?.message;

    if (typeof message === "string" && message.trim().length > 0) {
      return `${fallback} ${sanitizeProviderMessage(message)}`;
    }
  } catch {
    return `${fallback} ${sanitizeProviderMessage(body)}`;
  }

  return fallback;
}

export function createOpenAiBrandScanGenerator(config: OpenAiBrandScanConfig, fetchImpl: FetchLike = fetch) {
  return async function generateBrandScanProfile(input: BrandScanInput): Promise<BrandScanGeneration> {
    const model = config.model ?? DEFAULT_BRAND_SCAN_MODEL;
    const messages = buildBrandScanPromptMessages(input);
    const response = await fetchImpl(config.endpoint ?? OPENAI_RESPONSES_ENDPOINT, {
      body: JSON.stringify({
        input: messages,
        max_output_tokens: 1800,
        model,
        store: false,
        temperature: 0.2,
        text: {
          format: {
            name: BRAND_SCAN_OUTPUT_SCHEMA_NAME,
            schema: brandScanOutputJsonSchema,
            strict: true,
            type: "json_schema"
          }
        }
      }),
      headers: {
        Authorization: `Bearer ${config.apiKey}`,
        "Content-Type": "application/json"
      },
      method: "POST"
    });

    if (!response.ok) {
      throw new Error(await readOpenAiErrorMessage(response));
    }

    const payload = (await response.json()) as unknown;
    const payloadRecord = toRecord(payload);
    const status = payloadRecord?.status;

    if (typeof status === "string" && status !== "completed") {
      throw new Error(`OpenAI Responses API returned status ${status}.`);
    }

    const outputText = extractOpenAiResponseText(payload);

    if (!outputText) {
      throw new Error("OpenAI Responses API returned no output text.");
    }

    let parsedOutput: unknown;

    try {
      parsedOutput = JSON.parse(outputText);
    } catch {
      throw new Error("OpenAI Responses API returned non-JSON output.");
    }

    const validation = validateBrandScanOutput(parsedOutput);

    if (!validation.ok) {
      throw new Error(`OpenAI brand scan output failed validation: ${validation.issues.join(" ")}`);
    }

    return {
      metadata: {
        model,
        promptVersion: BRAND_SCAN_PROMPT_VERSION,
        provider: "openai",
        responseId: typeof payloadRecord?.id === "string" ? payloadRecord.id : null,
        usage: toRecord(payloadRecord?.usage)
      },
      output: validation.value
    };
  };
}

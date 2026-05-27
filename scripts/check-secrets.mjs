import { execFileSync } from "node:child_process";
import { readFileSync } from "node:fs";

const ignoredPathPatterns = [
  /^package-lock\.json$/,
  /^next-env\.d\.ts$/,
  /^public\//,
  /\.(?:png|jpg|jpeg|gif|webp|ico|mp4|mov|pdf|zip)$/i
];

const secretPatterns = [
  {
    name: "private key block",
    regex: /-----BEGIN (?:RSA |EC |OPENSSH |PGP )?PRIVATE KEY-----/
  },
  {
    name: "AWS access key",
    regex: /\bAKIA[0-9A-Z]{16}\b/
  },
  {
    name: "GitHub token",
    regex: /\bgh[pousr]_[A-Za-z0-9_]{30,}\b/
  },
  {
    name: "OpenAI API key",
    regex: /\bsk-(?:proj-)?[A-Za-z0-9_-]{32,}\b/
  },
  {
    name: "Supabase secret key",
    regex: /\bsb_secret_[A-Za-z0-9_-]{20,}\b/
  },
  {
    name: "Slack token",
    regex: /\bxox[baprs]-[A-Za-z0-9-]{20,}\b/
  },
  {
    name: "high-risk credential assignment",
    regex:
      /\b(?:api[_-]?key|access[_-]?key|secret|password|token|private[_-]?key)\b\s*[:=]\s*["']?[A-Za-z0-9_./+=-]{24,}/i
  }
];

function candidateFiles() {
  return execFileSync("git", ["ls-files", "--cached", "--others", "--exclude-standard"], { encoding: "utf8" })
    .split(/\r?\n/)
    .map((file) => file.trim())
    .filter(Boolean);
}

function shouldScan(file) {
  return !ignoredPathPatterns.some((pattern) => pattern.test(file));
}

const findings = [];

for (const file of candidateFiles().filter(shouldScan)) {
  let content;

  try {
    content = readFileSync(file, "utf8");
  } catch {
    continue;
  }

  const lines = content.split(/\r?\n/);

  lines.forEach((line, index) => {
    for (const pattern of secretPatterns) {
      if (pattern.regex.test(line)) {
        findings.push({
          file,
          line: index + 1,
          name: pattern.name
        });
      }
    }
  });
}

if (findings.length > 0) {
  console.error("Potential secrets found:");
  for (const finding of findings) {
    console.error(`- ${finding.file}:${finding.line} (${finding.name})`);
  }
  console.error("Remove the secret or adjust scripts/check-secrets.mjs if this is a verified false positive.");
  process.exit(1);
}

console.log("No obvious secrets found.");

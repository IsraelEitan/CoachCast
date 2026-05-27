const rawBaseUrl = process.env.SMOKE_BASE_URL ?? "http://127.0.0.1:3000";
const baseUrl = rawBaseUrl.replace(/\/$/, "");

const checks = [
  {
    path: "/api/health",
    type: "json",
    validate: (body) => body.status === "ok" && body.service === "coachcast-web"
  },
  {
    path: "/",
    type: "text",
    expects: ["Record once. Your fitness content is done."]
  },
  {
    path: "/app",
    type: "text",
    expectsAny: ["Your AI content production dashboard", "Sign in to CoachCast"]
  },
  {
    path: "/app/onboarding",
    type: "text",
    expectsAny: ["Content scan", "Create your workspace", "Sign in to CoachCast"]
  },
  {
    path: "/app/scripts/demo",
    type: "text",
    expectsAny: ["Script studio", "Sign in to CoachCast"]
  }
];

async function checkRoute(check) {
  const url = `${baseUrl}${check.path}`;
  const response = await fetch(url, {
    headers: {
      "User-Agent": "coachcast-smoke-check"
    }
  });

  if (!response.ok) {
    throw new Error(`${check.path} returned ${response.status}`);
  }

  if (check.type === "json") {
    const body = await response.json();
    if (!check.validate(body)) {
      throw new Error(`${check.path} returned unexpected JSON: ${JSON.stringify(body)}`);
    }
    return;
  }

  const body = await response.text();
  for (const expected of check.expects ?? []) {
    if (!body.includes(expected)) {
      throw new Error(`${check.path} did not include expected text: ${expected}`);
    }
  }

  if (check.expectsAny && !check.expectsAny.some((expected) => body.includes(expected))) {
    throw new Error(`${check.path} did not include any expected text: ${check.expectsAny.join(", ")}`);
  }
}

for (const check of checks) {
  await checkRoute(check);
  console.log(`ok ${check.path}`);
}

console.log(`Smoke checks passed for ${baseUrl}`);

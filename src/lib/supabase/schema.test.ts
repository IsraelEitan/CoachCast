import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import path from "node:path";
import test from "node:test";

const migration = readFileSync(
  path.join(process.cwd(), "supabase", "migrations", "202605260001_initial_schema.sql"),
  "utf8"
);

const workspaceScopedTables = ["brand_profiles", "content_ideas", "script_drafts", "ai_jobs"];
const rlsTables = ["workspaces", "workspace_members", ...workspaceScopedTables];

test("initial migration enables RLS on every application table", () => {
  for (const table of rlsTables) {
    assert.match(migration, new RegExp(`alter table public\\.${table} enable row level security`, "i"));
  }
});

test("workspace scoped tables are protected by membership policies", () => {
  for (const table of workspaceScopedTables) {
    assert.match(migration, new RegExp(`on public\\.${table}[\\s\\S]*public\\.is_workspace_member\\(workspace_id\\)`, "i"));
  }
});

test("AI job table supports async pipeline state transitions", () => {
  assert.match(migration, /create table public\.ai_jobs/i);
  assert.match(migration, /status in \('queued', 'running', 'succeeded', 'failed', 'cancelled'\)/i);
  assert.match(migration, /kind in \('brand_scan', 'idea_generation', 'script_generation', 'render_plan', 'publish_plan'\)/i);
});

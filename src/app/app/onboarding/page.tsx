import Link from "next/link";
import { AppShell } from "@/components/app-shell/AppShell";
import { getAppSession } from "@/lib/auth/app-session";
import { createWorkspaceAction } from "@/lib/workspaces/actions";

export const dynamic = "force-dynamic";

type OnboardingSearchParams = Promise<{
  status?: string;
}>;

const statusMessages: Record<string, string> = {
  "create-error": "We could not create the workspace. Check Supabase RLS and try again.",
  demo: "Demo mode is active because Supabase is not configured yet.",
  "missing-name": "Add the trainer, gym, or studio name.",
  "missing-source": "Add a website or Instagram handle so CoachCast has something to analyze."
};

export default async function OnboardingPage({ searchParams }: { searchParams: OnboardingSearchParams }) {
  const params = await searchParams;
  const session = await getAppSession({ nextPath: "/app/onboarding" });
  const statusMessage = params.status ? statusMessages[params.status] : null;

  if (session.authEnabled && session.workspace) {
    return (
      <AppShell authEnabled title="Workspace ready" workspaceName={session.workspace.name}>
        <section className="app-panel">
          <h2>{session.workspace.name} is connected</h2>
          <p>Your workspace already exists. Continue to the dashboard or start building the brand profile.</p>
          <div className="app-actions">
            <Link className="app-button" href="/app">
              Open dashboard
            </Link>
            <Link className="app-button app-button--secondary" href="/app/profile">
              View profile
            </Link>
          </div>
        </section>
      </AppShell>
    );
  }

  return (
    <AppShell authEnabled={session.authEnabled} title={session.authEnabled ? "Create your workspace" : "Content scan"} eyebrow="Step 1">
      <div className="app-flow">
        <section className="app-panel">
          <h2>{session.authEnabled ? "Set the workspace boundary" : "Tell CoachCast what to analyze"}</h2>
          <p>
            {session.authEnabled
              ? "This creates the tenant-safe workspace that future brand profiles, ideas, scripts, and AI jobs belong to."
              : "In production this form will call the Brand Voice Analyst. For now it uses mocked output so we can validate the UX and data contract first."}
          </p>

          {statusMessage ? (
            <p className="form-alert" role="status">
              {statusMessage}
            </p>
          ) : null}

          {session.authEnabled ? (
            <form action={createWorkspaceAction} className="app-form">
              <label>
                Trainer, gym, or studio name
                <input name="name" placeholder="Maya Strength Studio" required />
              </label>
              <label>
                Website
                <input name="websiteUrl" placeholder="https://example.com" type="url" />
              </label>
              <label>
                Instagram handle
                <input name="instagramHandle" placeholder="@fitwithmaya" />
              </label>
              <label>
                Main offer
                <input name="primaryOffer" placeholder="1:1 beginner strength coaching" />
              </label>
              <label>
                Audience
                <input name="audienceSummary" placeholder="Busy adults who want strength without intimidation" />
              </label>
              <button className="app-button" type="submit">
                Create workspace
              </button>
            </form>
          ) : (
            <>
              <form className="app-form">
                <label>
                  Website or Instagram
                  <input defaultValue="@fitwithmaya" name="target" />
                </label>
                <label>
                  Main offer
                  <input defaultValue="1:1 beginner strength coaching" name="offer" />
                </label>
                <label>
                  Audience
                  <input defaultValue="Busy adults who want strength without intimidation" name="audience" />
                </label>
              </form>
              <Link className="app-button" href="/app/profile">
                Generate mocked profile
              </Link>
            </>
          )}
        </section>

        <aside className="app-note">
          <h2>{session.authEnabled ? "Why this matters" : "Why mock this first?"}</h2>
          <p>
            {session.authEnabled
              ? "Every future AI output is scoped by workspace membership through RLS, so the boundary is created before content is stored."
              : "The AI output shape must be stable before we pay for real model calls. This keeps prompts, UI, and future database schema aligned."}
          </p>
        </aside>
      </div>
    </AppShell>
  );
}

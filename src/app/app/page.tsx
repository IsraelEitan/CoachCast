import Link from "next/link";
import { AppShell } from "@/components/app-shell/AppShell";
import { getAppSession } from "@/lib/auth/app-session";
import { mockContentIdeas } from "@/lib/fixtures/coachcast";

export const dynamic = "force-dynamic";

type DashboardSearchParams = Promise<{
  status?: string;
}>;

const statusMessages: Record<string, string> = {
  "workspace-created": "Workspace created. Your content system now has a tenant-safe home."
};

export default async function DashboardPage({ searchParams }: { searchParams: DashboardSearchParams }) {
  const params = await searchParams;
  const session = await getAppSession({ nextPath: "/app", requireWorkspace: true });
  const workspaceName = session.workspace?.name ?? "Demo workspace";
  const statusMessage = params.status ? statusMessages[params.status] : null;

  return (
    <AppShell authEnabled={session.authEnabled} title="Your AI content production dashboard" workspaceName={workspaceName}>
      {statusMessage ? (
        <p className="form-alert app-status" role="status">
          {statusMessage}
        </p>
      ) : null}
      <div className="app-grid app-grid--three">
        <article className="app-card">
          <span className="app-card__kicker">Next step</span>
          <h2>{session.authEnabled ? `Run ${workspaceName}'s content scan` : "Run your content scan"}</h2>
          <p>Create the brand profile that powers ideas, scripts, captions, and future render plans.</p>
          <Link className="app-button" href="/app/onboarding">
            Start scan
          </Link>
        </article>
        <article className="app-card">
          <span className="app-card__kicker">Ideas ready</span>
          <h2>{mockContentIdeas.length} draft angles</h2>
          <p>Mocked content ideas show the first production slice before real AI is connected.</p>
          <Link className="app-button app-button--secondary" href="/app/ideas">
            View ideas
          </Link>
        </article>
        <article className="app-card">
          <span className="app-card__kicker">Pipeline</span>
          <h2>Mock first, AI second</h2>
          <p>We validate screens and data contracts before adding model calls, storage, or video workers.</p>
        </article>
      </div>

      <section className="app-panel">
        <h2>Production slice</h2>
        <ol className="app-steps">
          <li>Content scan creates a BrandProfile.</li>
          <li>BrandProfile generates content ideas.</li>
          <li>Selected idea becomes a script draft.</li>
          <li>Recording and rendering come after the first slice works.</li>
        </ol>
      </section>
    </AppShell>
  );
}

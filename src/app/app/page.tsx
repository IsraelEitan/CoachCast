import Link from "next/link";
import { AppShell } from "@/components/app-shell/AppShell";
import { getBrandScanJobMessage, getLatestBrandScanJob, isActiveBrandScanJob } from "@/lib/ai-jobs/brand-scan";
import { getAppSession } from "@/lib/auth/app-session";
import { mockContentIdeas } from "@/lib/fixtures/coachcast";
import { getWorkspaceStudioContent } from "@/lib/workspaces/workspace-data";

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
  const [liveStudioContent, latestBrandScanJob] =
    session.authEnabled && session.workspace
      ? await Promise.all([getWorkspaceStudioContent(session.workspace), getLatestBrandScanJob(session.workspace.id)])
      : [null, null];
  const contentIdeas = session.authEnabled ? liveStudioContent?.contentIdeas ?? [] : mockContentIdeas;
  const hasBrandProfile = session.authEnabled ? Boolean(liveStudioContent?.brandProfile) : true;
  const isBrandScanActive = isActiveBrandScanJob(latestBrandScanJob);
  const statusMessage = params.status ? statusMessages[params.status] : null;
  const nextStepHref = session.authEnabled ? "/app/profile" : "/app/onboarding";

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
          <h2>
            {session.authEnabled
              ? hasBrandProfile
                ? `${workspaceName}'s profile is ready`
                : `Prepare ${workspaceName}'s brand scan`
              : "Run your content scan"}
          </h2>
          <p>
            {session.authEnabled
              ? "The workspace boundary is live. Brand scan generation is the next data-writing slice."
              : "Create the brand profile that powers ideas, scripts, captions, and future render plans."}
          </p>
          <Link className="app-button" href={nextStepHref}>
            {session.authEnabled ? "View profile status" : "Start scan"}
          </Link>
        </article>
        <article className="app-card">
          <span className="app-card__kicker">Ideas ready</span>
          <h2>
            {contentIdeas.length} {session.authEnabled ? "saved angles" : "draft angles"}
          </h2>
          <p>
            {session.authEnabled
              ? contentIdeas.length > 0
                ? "These ideas are loaded from your workspace through Supabase RLS."
                : "No saved ideas yet. The next AI slice will generate these from your brand profile."
              : "Mocked content ideas show the first production slice before real AI is connected."}
          </p>
          <Link
            className="app-button app-button--secondary"
            href={contentIdeas.length > 0 ? "/app/ideas" : "/app/profile"}
          >
            {contentIdeas.length > 0 ? "View ideas" : "View profile status"}
          </Link>
        </article>
        <article className="app-card">
          <span className="app-card__kicker">Pipeline</span>
          <h2>
            {session.authEnabled
              ? hasBrandProfile
                ? "Profile ready"
                : isBrandScanActive
                  ? "Scan queued"
                  : "Brand scan next"
              : "Mock first, AI second"}
          </h2>
          <p>
            {session.authEnabled
              ? hasBrandProfile
                ? "Your latest brand profile is stored in Supabase and ready to feed idea generation."
                : getBrandScanJobMessage(latestBrandScanJob)
              : "We validate screens and data contracts before adding model calls, storage, or video workers."}
          </p>
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

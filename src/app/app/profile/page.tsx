import Link from "next/link";
import { AppShell } from "@/components/app-shell/AppShell";
import { createBrandScanJobAction } from "@/lib/ai-jobs/actions";
import { getBrandScanJobMessage, getLatestBrandScanJob, isActiveBrandScanJob } from "@/lib/ai-jobs/brand-scan";
import { getAppSession } from "@/lib/auth/app-session";
import { mockBrandProfile } from "@/lib/fixtures/coachcast";
import { getLatestBrandProfile } from "@/lib/workspaces/workspace-data";

export const dynamic = "force-dynamic";

type ProfileSearchParams = Promise<{
  status?: string;
}>;

const statusMessages: Record<string, string> = {
  "brand-scan-already-queued": "A brand scan job is already queued or running for this workspace.",
  "brand-scan-error": "We could not queue the brand scan. Check the job table policy and try again.",
  "brand-scan-queued": "Brand scan job queued. The protected worker route can process it when configured.",
  demo: "Demo mode is active because Supabase is not configured yet."
};

export default async function ProfilePage({ searchParams }: { searchParams: ProfileSearchParams }) {
  const params = await searchParams;
  const session = await getAppSession({ nextPath: "/app/profile", requireWorkspace: true });
  const workspaceName = session.workspace?.name ?? mockBrandProfile.workspaceName;
  const [liveBrandProfile, latestBrandScanJob] =
    session.authEnabled && session.workspace
      ? await Promise.all([getLatestBrandProfile(session.workspace), getLatestBrandScanJob(session.workspace.id)])
      : [null, null];
  const brandProfile = session.authEnabled ? liveBrandProfile : mockBrandProfile;
  const isBrandScanActive = isActiveBrandScanJob(latestBrandScanJob);
  const statusMessage = params.status ? statusMessages[params.status] : null;

  if (session.authEnabled && session.workspace && !brandProfile) {
    return (
      <AppShell authEnabled title="Brand profile result" eyebrow="Step 2" workspaceName={workspaceName}>
        <div className="app-flow">
          <section className="app-panel">
            <h2>Brand profile is not generated yet</h2>
            <p>
              {workspaceName} is connected as a live workspace. The brand profile table is empty until the brand scan
              job writes tone, audience, offers, content pillars, and safety boundaries.
            </p>

            {statusMessage ? (
              <p className="form-alert" role="status">
                {statusMessage}
              </p>
            ) : null}

            <section className="app-mini-card" aria-labelledby="brand-scan-status">
              <h3 id="brand-scan-status">Brand scan job</h3>
              <p>{getBrandScanJobMessage(latestBrandScanJob)}</p>
            </section>

            <ul className="app-steps">
              <li>Audience: {session.workspace.audience_summary ?? "Not captured yet"}</li>
              <li>Offer: {session.workspace.primary_offer ?? "Not captured yet"}</li>
              <li>
                Source: {session.workspace.website_url ?? session.workspace.instagram_handle ?? "Not captured yet"}
              </li>
            </ul>
            <div className="app-actions">
              {isBrandScanActive ? (
                <Link className="app-button" href="/app/profile">
                  Refresh status
                </Link>
              ) : (
                <form action={createBrandScanJobAction}>
                  <button className="app-button" type="submit">
                    Queue brand scan
                  </button>
                </form>
              )}
              <Link className="app-button app-button--secondary" href="/app/ideas">
                View idea status
              </Link>
            </div>
          </section>

          <aside className="app-note">
            <h2>Why no mock?</h2>
            <p>
              This is a real authenticated workspace, so CoachCast shows only data that exists in Supabase. Demo
              fixtures stay available when Supabase is not configured.
            </p>
          </aside>
        </div>
      </AppShell>
    );
  }

  if (!brandProfile) {
    throw new Error("Brand profile unavailable.");
  }

  return (
    <AppShell
      authEnabled={session.authEnabled}
      title="Brand profile result"
      eyebrow="Step 2"
      workspaceName={workspaceName}
    >
      <div className="app-flow">
        <section className="app-panel">
          <h2>{workspaceName}</h2>
          <p>{brandProfile.audience.summary}</p>

          {statusMessage ? (
            <p className="form-alert" role="status">
              {statusMessage}
            </p>
          ) : null}

          <div className="app-chip-group" aria-label="Brand tone">
            {brandProfile.tone.map((tone) => (
              <span key={tone}>{tone}</span>
            ))}
          </div>

          <div className="app-grid app-grid--two">
            <ProfileBlock title="Content pillars" items={brandProfile.contentPillars} />
            <ProfileBlock title="Audience pains" items={brandProfile.painPoints} />
            <ProfileBlock title="Offers" items={brandProfile.offers} />
            <ProfileBlock title="Avoid claims" items={brandProfile.avoidClaims} />
          </div>

          <Link className="app-button" href="/app/ideas">
            {session.authEnabled ? "Continue to ideas" : "Generate mocked ideas"}
          </Link>
        </section>

        <aside className="app-note">
          <h2>What this solves</h2>
          <p>
            Scripts need a durable memory of the trainer&apos;s tone, audience, and boundaries. This profile becomes the
            reusable context for every AI job.
          </p>
        </aside>
      </div>
    </AppShell>
  );
}

function ProfileBlock({ items, title }: { items: string[]; title: string }) {
  return (
    <article className="app-mini-card">
      <h3>{title}</h3>
      <ul>
        {items.length > 0 ? (
          items.map((item) => <li key={item}>{item}</li>)
        ) : (
          <li>Not captured yet.</li>
        )}
      </ul>
    </article>
  );
}

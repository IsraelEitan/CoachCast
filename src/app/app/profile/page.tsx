import Link from "next/link";
import { AppShell } from "@/components/app-shell/AppShell";
import { getAppSession } from "@/lib/auth/app-session";
import { mockBrandProfile } from "@/lib/fixtures/coachcast";
import { getLatestBrandProfile } from "@/lib/workspaces/workspace-data";

export const dynamic = "force-dynamic";

export default async function ProfilePage() {
  const session = await getAppSession({ nextPath: "/app/profile", requireWorkspace: true });
  const workspaceName = session.workspace?.name ?? mockBrandProfile.workspaceName;
  const liveBrandProfile =
    session.authEnabled && session.workspace ? await getLatestBrandProfile(session.workspace) : null;
  const brandProfile = session.authEnabled ? liveBrandProfile : mockBrandProfile;

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
            <ul className="app-steps">
              <li>Audience: {session.workspace.audience_summary ?? "Not captured yet"}</li>
              <li>Offer: {session.workspace.primary_offer ?? "Not captured yet"}</li>
              <li>
                Source: {session.workspace.website_url ?? session.workspace.instagram_handle ?? "Not captured yet"}
              </li>
            </ul>
            <div className="app-actions">
              <Link className="app-button" href="/app">
                Back to dashboard
              </Link>
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

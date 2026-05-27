import Link from "next/link";
import { AppShell } from "@/components/app-shell/AppShell";
import { getAppSession } from "@/lib/auth/app-session";
import { mockBrandProfile } from "@/lib/fixtures/coachcast";

export const dynamic = "force-dynamic";

export default async function ProfilePage() {
  const session = await getAppSession({ nextPath: "/app/profile", requireWorkspace: true });
  const workspaceName = session.workspace?.name ?? mockBrandProfile.workspaceName;

  return (
    <AppShell authEnabled={session.authEnabled} title="Brand profile result" eyebrow="Step 2" workspaceName={workspaceName}>
      <div className="app-flow">
        <section className="app-panel">
          <h2>{workspaceName}</h2>
          <p>{session.workspace?.audience_summary ?? mockBrandProfile.audience.summary}</p>

          <div className="app-chip-group" aria-label="Brand tone">
            {mockBrandProfile.tone.map((tone) => (
              <span key={tone}>{tone}</span>
            ))}
          </div>

          <div className="app-grid app-grid--two">
            <ProfileBlock title="Content pillars" items={mockBrandProfile.contentPillars} />
            <ProfileBlock title="Audience pains" items={mockBrandProfile.painPoints} />
            <ProfileBlock title="Offers" items={mockBrandProfile.offers} />
            <ProfileBlock title="Avoid claims" items={mockBrandProfile.avoidClaims} />
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
        {items.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </article>
  );
}

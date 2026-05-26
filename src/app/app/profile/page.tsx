import Link from "next/link";
import { AppShell } from "@/components/app-shell/AppShell";
import { mockBrandProfile } from "@/lib/fixtures/coachcast";

export default function ProfilePage() {
  return (
    <AppShell title="Brand profile result" eyebrow="Step 2">
      <div className="app-flow">
        <section className="app-panel">
          <h2>{mockBrandProfile.workspaceName}</h2>
          <p>{mockBrandProfile.audience.summary}</p>

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
            Generate mocked ideas
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

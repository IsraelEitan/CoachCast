import Link from "next/link";
import { AppShell } from "@/components/app-shell/AppShell";
import { mockContentIdeas } from "@/lib/fixtures/coachcast";

export default function DashboardPage() {
  return (
    <AppShell title="Your AI content production dashboard">
      <div className="app-grid app-grid--three">
        <article className="app-card">
          <span className="app-card__kicker">Next step</span>
          <h2>Run your content scan</h2>
          <p>Create the brand profile that powers your ideas, scripts, captions, and future render plans.</p>
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

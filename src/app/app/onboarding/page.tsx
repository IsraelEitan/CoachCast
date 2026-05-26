import Link from "next/link";
import { AppShell } from "@/components/app-shell/AppShell";

export default function OnboardingPage() {
  return (
    <AppShell title="Content scan" eyebrow="Step 1">
      <div className="app-flow">
        <section className="app-panel">
          <h2>Tell CoachCast what to analyze</h2>
          <p>
            In production this form will call the Brand Voice Analyst. For now it uses mocked output so we can
            validate the UX and data contract first.
          </p>
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
        </section>

        <aside className="app-note">
          <h2>Why mock this first?</h2>
          <p>
            The AI output shape must be stable before we pay for real model calls. This keeps prompts, UI, and
            future database schema aligned.
          </p>
        </aside>
      </div>
    </AppShell>
  );
}

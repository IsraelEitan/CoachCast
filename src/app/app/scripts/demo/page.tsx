import { AppShell } from "@/components/app-shell/AppShell";
import { getAppSession } from "@/lib/auth/app-session";
import { mockScriptDraft } from "@/lib/fixtures/coachcast";

export const dynamic = "force-dynamic";

export default async function ScriptStudioPage() {
  const session = await getAppSession({ nextPath: "/app/scripts/demo", requireWorkspace: true });

  return (
    <AppShell
      authEnabled={session.authEnabled}
      title="Script studio"
      eyebrow="Step 4"
      workspaceName={session.workspace?.name}
    >
      <div className="app-flow">
        <section className="script-panel">
          <div className="script-panel__header">
            <span>Teleprompter draft</span>
            <strong>{mockScriptDraft.hook}</strong>
          </div>
          <p>{mockScriptDraft.teleprompterText}</p>
        </section>

        <aside className="app-note">
          <h2>Production contract</h2>
          <p>
            This draft is split into beats, captions, hashtags, and shot list so recording and rendering can use the
            same structured output later.
          </p>
          <h3>Beats</h3>
          <ul>
            {mockScriptDraft.beats.map((beat) => (
              <li key={beat}>{beat}</li>
            ))}
          </ul>
          <h3>Shot list</h3>
          <ul>
            {mockScriptDraft.shotList.map((shot) => (
              <li key={shot}>{shot}</li>
            ))}
          </ul>
        </aside>
      </div>
    </AppShell>
  );
}

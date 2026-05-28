import Link from "next/link";
import { AppShell } from "@/components/app-shell/AppShell";
import { getAppSession } from "@/lib/auth/app-session";
import { mockContentIdeas } from "@/lib/fixtures/coachcast";
import { getRecentContentIdeas } from "@/lib/workspaces/workspace-data";

export const dynamic = "force-dynamic";

export default async function IdeasPage() {
  const session = await getAppSession({ nextPath: "/app/ideas", requireWorkspace: true });
  const contentIdeas =
    session.authEnabled && session.workspace ? await getRecentContentIdeas(session.workspace.id) : mockContentIdeas;

  if (session.authEnabled && contentIdeas.length === 0) {
    return (
      <AppShell
        authEnabled={session.authEnabled}
        title="Content ideas"
        eyebrow="Step 3"
        workspaceName={session.workspace?.name}
      >
        <section className="app-panel">
          <h2>No saved ideas yet</h2>
          <p>
            This workspace does not have content ideas in Supabase yet. The next AI slice will turn the brand profile
            into workspace-scoped ideas, then this page will render the saved rows.
          </p>
          <div className="app-actions">
            <Link className="app-button" href="/app/profile">
              View profile status
            </Link>
            <Link className="app-button app-button--secondary" href="/app">
              Back to dashboard
            </Link>
          </div>
        </section>
      </AppShell>
    );
  }

  return (
    <AppShell
      authEnabled={session.authEnabled}
      title="Content ideas"
      eyebrow="Step 3"
      workspaceName={session.workspace?.name}
    >
      <div className="idea-list">
        {contentIdeas.map((idea) => (
          <article className="idea-card" key={idea.id}>
            <div>
              <span>{Math.round(idea.confidence * 100)}% fit</span>
              <h2>{idea.title}</h2>
              <p>{idea.hook}</p>
            </div>
            <dl>
              <div>
                <dt>Viewer pain</dt>
                <dd>{idea.viewerPain}</dd>
              </div>
              <div>
                <dt>Format</dt>
                <dd>{idea.format}</dd>
              </div>
              <div>
                <dt>CTA</dt>
                <dd>{idea.cta}</dd>
              </div>
            </dl>
            <Link className="app-button" href="/app/scripts/demo">
              Draft script
            </Link>
          </article>
        ))}
      </div>
    </AppShell>
  );
}

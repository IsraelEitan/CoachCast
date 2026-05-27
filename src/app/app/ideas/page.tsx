import Link from "next/link";
import { AppShell } from "@/components/app-shell/AppShell";
import { getAppSession } from "@/lib/auth/app-session";
import { mockContentIdeas } from "@/lib/fixtures/coachcast";

export const dynamic = "force-dynamic";

export default async function IdeasPage() {
  const session = await getAppSession({ nextPath: "/app/ideas", requireWorkspace: true });

  return (
    <AppShell
      authEnabled={session.authEnabled}
      title="Content ideas"
      eyebrow="Step 3"
      workspaceName={session.workspace?.name}
    >
      <div className="idea-list">
        {mockContentIdeas.map((idea) => (
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

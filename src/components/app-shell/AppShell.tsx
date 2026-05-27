import Link from "next/link";
import { signOutAction } from "@/lib/auth/actions";

type AppShellProps = {
  authEnabled?: boolean;
  children: React.ReactNode;
  title: string;
  eyebrow?: string;
  workspaceName?: string;
};

const navItems = [
  { href: "/app", label: "Dashboard" },
  { href: "/app/onboarding", label: "Scan" },
  { href: "/app/profile", label: "Profile" },
  { href: "/app/ideas", label: "Ideas" },
  { href: "/app/scripts/demo", label: "Script" }
];

export function AppShell({
  authEnabled = false,
  children,
  eyebrow = "CoachCast Studio",
  title,
  workspaceName = "Demo workspace"
}: AppShellProps) {
  return (
    <main className="product-app">
      <aside className="app-sidebar" aria-label="Product navigation">
        <Link className="app-logo" href="/">
          <span>C</span>
          CoachCast
        </Link>
        <nav>
          {navItems.map((item) => (
            <Link href={item.href} key={item.href}>
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="app-sidebar__meta">
          <span>{workspaceName}</span>
          <small>{authEnabled ? "Live workspace" : "Demo mode"}</small>
        </div>
        {authEnabled ? (
          <form action={signOutAction}>
            <button className="app-sidebar__signout" type="submit">
              Sign out
            </button>
          </form>
        ) : null}
      </aside>

      <section className="app-main">
        <header className="app-page-header">
          <p>{eyebrow}</p>
          <h1>{title}</h1>
        </header>
        {children}
      </section>
    </main>
  );
}

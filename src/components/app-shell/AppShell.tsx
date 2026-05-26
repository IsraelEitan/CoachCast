import Link from "next/link";

type AppShellProps = {
  children: React.ReactNode;
  title: string;
  eyebrow?: string;
};

const navItems = [
  { href: "/app", label: "Dashboard" },
  { href: "/app/onboarding", label: "Scan" },
  { href: "/app/profile", label: "Profile" },
  { href: "/app/ideas", label: "Ideas" },
  { href: "/app/scripts/demo", label: "Script" }
];

export function AppShell({ children, eyebrow = "CoachCast Studio", title }: AppShellProps) {
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

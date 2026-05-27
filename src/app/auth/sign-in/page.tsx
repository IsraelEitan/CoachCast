import Link from "next/link";
import { signInAction } from "@/lib/auth/actions";
import { getSupabaseBrowserConfig } from "@/lib/supabase/env";

export const dynamic = "force-dynamic";

type AuthSearchParams = Promise<{
  next?: string;
  status?: string;
}>;

const statusMessages: Record<string, string> = {
  "check-email": "Check your email to confirm the account, then sign in.",
  "invalid-credentials": "The email or password did not match.",
  "missing-config": "Supabase is not configured yet. The demo app is still available.",
  "missing-fields": "Enter both email and password."
};

export default async function SignInPage({ searchParams }: { searchParams: AuthSearchParams }) {
  const params = await searchParams;
  const authEnabled = Boolean(getSupabaseBrowserConfig());
  const nextPath = params.next?.startsWith("/") && !params.next.startsWith("//") ? params.next : "/app";
  const message = params.status ? statusMessages[params.status] : null;

  return (
    <main className="auth-page">
      <section className="auth-card" aria-labelledby="sign-in-title">
        <Link className="app-logo auth-logo" href="/">
          <span>C</span>
          CoachCast
        </Link>

        <p className="app-card__kicker">Welcome back</p>
        <h1 id="sign-in-title">Sign in to CoachCast</h1>
        <p>Continue building your AI content system inside your trainer or gym workspace.</p>

        {!authEnabled ? (
          <p className="form-alert" role="status">
            Supabase environment variables are not configured yet. Use the demo app while the live project is being
            connected.
          </p>
        ) : null}

        {message ? (
          <p className="form-alert" role="status">
            {message}
          </p>
        ) : null}

        <form action={signInAction} className="auth-form">
          <input name="next" type="hidden" value={nextPath} />
          <label>
            Email
            <input autoComplete="email" name="email" required type="email" />
          </label>
          <label>
            Password
            <input autoComplete="current-password" minLength={8} name="password" required type="password" />
          </label>
          <button className="app-button" disabled={!authEnabled} type="submit">
            Sign in
          </button>
        </form>

        <p className="auth-switch">
          New here? <Link href="/auth/sign-up">Create an account</Link>
        </p>
        <Link className="auth-demo-link" href="/app">
          Continue to demo app
        </Link>
      </section>
    </main>
  );
}

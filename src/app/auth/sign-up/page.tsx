import Link from "next/link";
import { signUpAction } from "@/lib/auth/actions";
import { getSupabaseBrowserConfig } from "@/lib/supabase/env";

export const dynamic = "force-dynamic";

type AuthSearchParams = Promise<{
  status?: string;
}>;

const statusMessages: Record<string, string> = {
  "invalid-sign-up": "Enter a valid email and a password with at least 8 characters.",
  "missing-config": "Supabase is not configured yet. The demo app is still available.",
  "sign-up-failed": "We could not create the account. Try again or sign in if you already have one."
};

export default async function SignUpPage({ searchParams }: { searchParams: AuthSearchParams }) {
  const params = await searchParams;
  const authEnabled = Boolean(getSupabaseBrowserConfig());
  const message = params.status ? statusMessages[params.status] : null;

  return (
    <main className="auth-page">
      <section className="auth-card" aria-labelledby="sign-up-title">
        <Link className="app-logo auth-logo" href="/">
          <span>C</span>
          CoachCast
        </Link>

        <p className="app-card__kicker">Start your workspace</p>
        <h1 id="sign-up-title">Create your CoachCast account</h1>
        <p>Set up the account that will own your trainer, gym, or studio content workspace.</p>

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

        <form action={signUpAction} className="auth-form">
          <label>
            Email
            <input autoComplete="email" name="email" required type="email" />
          </label>
          <label>
            Password
            <input autoComplete="new-password" minLength={8} name="password" required type="password" />
          </label>
          <button className="app-button" disabled={!authEnabled} type="submit">
            Create account
          </button>
        </form>

        <p className="auth-switch">
          Already have an account? <Link href="/auth/sign-in">Sign in</Link>
        </p>
        <Link className="auth-demo-link" href="/app">
          Continue to demo app
        </Link>
      </section>
    </main>
  );
}

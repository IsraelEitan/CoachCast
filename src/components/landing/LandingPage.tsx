import Link from "next/link";
import { DemoBoard } from "@/components/landing/DemoBoard";
import { FaqList } from "@/components/landing/FaqList";
import { LandingNav } from "@/components/landing/LandingNav";
import { ScanForm } from "@/components/landing/ScanForm";

const pricingPlans = [
  {
    name: "Starter",
    videos: "8",
    price: "$49",
    features: ["8 branded Reels per month", "AI script generation", "Built-in teleprompter", "Auto-edit and captions"]
  },
  {
    name: "Pro",
    videos: "20",
    price: "$119",
    features: ["Everything in Starter", "AI B-roll generation", "Branded overlays and lower-thirds", "Instagram and TikTok scheduling"]
  },
  {
    name: "Studio",
    videos: "50",
    price: "$249",
    features: ["Everything in Pro", "Multi-trainer support", "Custom brand kit", "Team approval workflow"]
  }
] as const;

export function LandingPage() {
  return (
    <>
      <a className="skip-link" href="#main">
        Skip to content
      </a>

      <LandingNav />

      <main id="main">
        <section className="hero" id="home" aria-labelledby="hero-title">
          <div className="hero__media" aria-hidden="true" />
          <div className="shell hero__inner">
            <div className="hero__copy">
              <p className="status-pill">
                <span />
                CoachCast 1.0 for fitness is live
              </p>
              <h1 id="hero-title">Record once. Your fitness content is done.</h1>
              <p>
                You record a short workout, tip, or client story with our teleprompter. The AI writes the script,
                edits the Reel, adds exercise B-roll, applies your branding, and schedules the post.
              </p>
              <div className="hero__actions" aria-label="Primary actions">
                <Link className="button button--primary" href="/app/onboarding">
                  Start Free Trial
                </Link>
                <a className="button button--ghost" href="#workflow">
                  See How It Works
                </a>
              </div>
            </div>

            <div className="product-stage" aria-label="CoachCast product flow preview">
              <div className="pipeline" aria-label="AI content workflow">
                <span className="pipeline__step pipeline__step--active">AI Script</span>
                <span className="pipeline__bar" />
                <span className="pipeline__step">Record</span>
                <span className="pipeline__bar" />
                <span className="pipeline__step">Auto Edit</span>
                <span className="pipeline__bar" />
                <span className="pipeline__step">Published</span>
              </div>

              <div className="stage-card stage-card--script">
                <div className="stage-card__header">
                  <span className="dot dot--teal" />
                  <strong>AI Script</strong>
                </div>
                <p>Hook: 3 squat mistakes beginners miss</p>
                <div className="line line--wide" />
                <div className="line" />
                <div className="line line--short" />
              </div>

              <div className="teleprompter">
                <div className="teleprompter__top">
                  <span className="rec-dot" />
                  <strong>REC</strong>
                </div>
                <p>
                  If your knees cave during squats, stop blaming your knees. Try this 20-second warmup before your first
                  set...
                </p>
              </div>

              <div className="reel-preview">
                <div className="reel-preview__image" />
                <div className="reel-preview__caption">
                  <span>Form Check</span>
                  <strong>Fix knee cave fast</strong>
                </div>
                <div className="reel-preview__metrics">
                  <span>IG</span>
                  <span>TikTok</span>
                </div>
              </div>

              <div className="stage-note">
                <span className="spark">AI</span>
                <div>
                  <strong>Reel ready in minutes</strong>
                  <p>Captions, overlays, B-roll, and post text generated.</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="metric-band" aria-labelledby="metric-title">
          <div className="shell">
            <p className="section-kicker" id="metric-title">
              Built for busy trainers and gym owners
            </p>
            <div className="metric-grid">
              <div className="metric">
                <strong>2 min</strong>
                <span>from recording to edited Reel</span>
              </div>
              <div className="metric">
                <strong>20+</strong>
                <span>posts per month from simple recordings</span>
              </div>
              <div className="metric">
                <strong>0</strong>
                <span>editing timelines to manage</span>
              </div>
            </div>
          </div>
        </section>

        <section className="section section--light" id="workflow" aria-labelledby="workflow-title">
          <div className="shell">
            <div className="section-heading">
              <p className="eyebrow">How it works</p>
              <h2 id="workflow-title">You show up for the recording. The AI handles the production line.</h2>
            </div>

            <div className="steps">
              <article className="step">
                <span>1</span>
                <h3>Speak naturally</h3>
                <p>
                  Complete a short voice interview so the system learns your coaching style, offers, audience, and
                  training philosophy.
                </p>
              </article>
              <article className="step">
                <span>2</span>
                <h3>AI scripting</h3>
                <p>CoachCast writes short-form scripts in your voice, using hooks that match fitness trends and your actual services.</p>
              </article>
              <article className="step">
                <span>3</span>
                <h3>Teleprompter record</h3>
                <p>Read from the built-in teleprompter, record a quick demo or talking-head clip, and keep coaching between takes.</p>
              </article>
              <article className="step">
                <span>4</span>
                <h3>Auto-edit and publish</h3>
                <p>The AI cuts the clip, adds branded overlays, inserts exercise B-roll, writes captions, and schedules the post.</p>
              </article>
            </div>
          </div>
        </section>

        <section className="section demo-section" id="demo" aria-labelledby="demo-title">
          <div className="shell demo-layout">
            <div className="section-heading section-heading--left">
              <p className="eyebrow">See it in action</p>
              <h2 id="demo-title">One trainer recording becomes a ready-to-post content package.</h2>
              <p>The business goal is simple: keep the coach visible online without pulling them away from clients, classes, or sales calls.</p>
            </div>

            <DemoBoard />
          </div>
        </section>

        <section className="section features-section" id="features" aria-labelledby="features-title">
          <div className="shell">
            <div className="section-heading">
              <p className="eyebrow">Everything you need to grow with content</p>
              <h2 id="features-title">A short-form production studio built for fitness businesses.</h2>
            </div>

            <div className="feature-grid">
              <article className="feature-card feature-card--large">
                <div>
                  <h3>Branded movement overlays</h3>
                  <p>Coach names, class offers, rep cues, timers, stat callouts, and logo marks are rendered automatically.</p>
                </div>
                <div className="overlay-preview">
                  <div className="overlay-preview__video" />
                  <div className="overlay-preview__tag">3 cues for better deadlifts</div>
                  <div className="overlay-preview__timer">0:14</div>
                </div>
              </article>

              <article className="feature-card">
                <h3>AI content analysis</h3>
                <p>Scripts learn from high-performing fitness Reels, not generic captions. The system turns your offer into topics that convert.</p>
                <div className="keyword-list">
                  <span>Strength</span>
                  <span>Fat loss</span>
                  <span>Form tips</span>
                  <span>Mobility</span>
                </div>
              </article>

              <article className="feature-card">
                <h3>Edit by talking</h3>
                <p>Ask for a hook change, more intensity, shorter captions, a different CTA, or a new clip order in plain English.</p>
                <div className="chat-edit">Replace the intro with a stronger pain point for beginners.</div>
              </article>

              <article className="feature-card feature-card--wide">
                <h3>Autonomous fitness B-roll</h3>
                <p>
                  CoachCast inserts movement clips, gym shots, equipment closeups, nutrition visuals, or class energy at
                  the exact moment the script needs it.
                </p>
                <div className="timeline">
                  <span>Warmup</span>
                  <span>Lift</span>
                  <span>Result</span>
                  <span>CTA</span>
                </div>
              </article>
            </div>
          </div>
        </section>

        <section className="section scanner-section" id="trial" aria-labelledby="scanner-title">
          <div className="shell scanner-layout">
            <div className="section-heading section-heading--left">
              <p className="eyebrow">Discover your coach voice</p>
              <h2 id="scanner-title">AI analyzes your site and socials before you record.</h2>
              <p>The system finds your audience, offer angles, tone, and content opportunities so your videos sound like you, not a template.</p>
              <ScanForm />
            </div>

            <div className="scanner-panel" aria-label="Sample audience analysis">
              <div className="scanner-panel__top">
                <span className="scan-spinner" />
                <strong>Analyzing brand voice...</strong>
              </div>
              <div className="insight-grid">
                <div>
                  <span>Brand Voice</span>
                  <strong>Direct, energetic, technical</strong>
                </div>
                <div>
                  <span>Audience</span>
                  <strong>Busy adults 28-45</strong>
                </div>
                <div>
                  <span>Pain Points</span>
                  <strong>No time, bad form, low confidence</strong>
                </div>
                <div>
                  <span>Best Formats</span>
                  <strong>Form checks, myths, client wins</strong>
                </div>
              </div>
              <div className="recommendations">
                <div>
                  <span>Beginner explainers</span>
                  <strong>94%</strong>
                </div>
                <div>
                  <span>Transformation stories</span>
                  <strong>88%</strong>
                </div>
                <div>
                  <span>30-second form fixes</span>
                  <strong>91%</strong>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="section section--light" id="pricing" aria-labelledby="pricing-title">
          <div className="shell">
            <div className="section-heading">
              <p className="eyebrow">Simple pricing</p>
              <h2 id="pricing-title">Start with one free video. Upgrade when you are ready.</h2>
            </div>

            <div className="pricing-grid">
              {pricingPlans.map((plan, index) => (
                <article className={`price-card ${index === 1 ? "price-card--featured" : ""}`} key={plan.name}>
                  {index === 1 && <div className="popular">Most Popular</div>}
                  <h3>{plan.name}</h3>
                  <p>
                    <strong>{plan.videos}</strong> videos / month
                  </p>
                  <div className="price">
                    {plan.price}
                    <span>/mo</span>
                  </div>
                  <ul>
                    {plan.features.map((feature) => (
                      <li key={feature}>{feature}</li>
                    ))}
                  </ul>
                  <Link className={`button ${index === 1 ? "button--primary" : "button--secondary"}`} href="/app/onboarding">
                    Start Free Trial
                  </Link>
                </article>
              ))}
            </div>
            <p className="pricing-note">All plans include one free finished video. No credit card required.</p>
          </div>
        </section>

        <section className="section faq-section" id="faq" aria-labelledby="faq-title">
          <div className="shell faq-layout">
            <div className="section-heading section-heading--left">
              <p className="eyebrow">FAQ</p>
              <h2 id="faq-title">What trainers usually ask first.</h2>
            </div>

            <FaqList />
          </div>
        </section>

        <section className="final-cta" aria-labelledby="final-title">
          <div className="shell final-cta__inner">
            <h2 id="final-title">Record once. We will take it from here.</h2>
            <Link className="button button--primary" href="/app/onboarding">
              Start Free Trial Now
            </Link>
            <p>No credit card required. One free finished video.</p>
          </div>
        </section>
      </main>

      <footer className="site-footer">
        <div className="shell site-footer__inner">
          <Link className="brand brand--footer" href="#top" aria-label="CoachCast home">
            <span className="brand__mark">C</span>
            <span className="brand__text">CoachCast</span>
          </Link>
          <nav aria-label="Footer navigation">
            <a href="#workflow">Workflow</a>
            <a href="#features">Features</a>
            <a href="#pricing">Pricing</a>
            <a href="#faq">FAQ</a>
          </nav>
          <p>Copyright 2026 CoachCast. All rights reserved.</p>
        </div>
      </footer>
    </>
  );
}

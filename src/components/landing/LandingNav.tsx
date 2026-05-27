"use client";

import Link from "next/link";
import type { FC } from "react";
import { useState } from "react";

export const LandingNav: FC = () => {
  const [navOpen, setNavOpen] = useState(false);

  function closeNav() {
    setNavOpen(false);
  }

  return (
    <header className="site-header" id="top">
      <div className="shell site-header__inner">
        <Link className="brand" href="/" aria-label="CoachCast home">
          <span className="brand__mark">C</span>
          <span className="brand__text">CoachCast</span>
        </Link>

        <button
          className="nav-toggle"
          type="button"
          aria-expanded={navOpen}
          aria-controls="site-nav"
          onClick={() => setNavOpen((isOpen) => !isOpen)}
        >
          <span className="nav-toggle__line" />
          <span className="nav-toggle__line" />
          <span className="nav-toggle__line" />
          <span className="sr-only">Toggle navigation</span>
        </button>

        <nav className={`site-nav ${navOpen ? "is-open" : ""}`} id="site-nav" aria-label="Main navigation">
          <a href="#workflow" onClick={closeNav}>
            Workflow
          </a>
          <a href="#demo" onClick={closeNav}>
            Demo
          </a>
          <a href="#features" onClick={closeNav}>
            Features
          </a>
          <a href="#pricing" onClick={closeNav}>
            Pricing
          </a>
          <a href="#faq" onClick={closeNav}>
            FAQ
          </a>
        </nav>

        <Link className="header-login" href="/auth/sign-in">
          Login
        </Link>
        <Link className="header-cta" href="/auth/sign-up">
          Start Free Trial
        </Link>
      </div>
    </header>
  );
};

export default LandingNav;

import React, { useEffect, useRef, useState } from "react";
import { motion as Motion, AnimatePresence } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";

/**
 * HeroSection.jsx
 * Small, focused edits to make the mobile search panel interactive:
 * - backdrop gets lower stacking (z-40) and pointer-events only when open
 * - panel wrapper sits above the backdrop (z-50) and accepts pointer events
 * - defensive e.stopPropagation() on the close button
 * - small accessibility attributes added to the dialog
 */

export default function HeroSection() {
  const [q, setQ] = useState("");
  const [focused, setFocused] = useState(false);
  const [openSug, setOpenSug] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const blurRef = useRef(null);
  const inputRef = useRef(null);
  const marqueeTrackRef = useRef(null);
  const marqueeGroupRef = useRef(null);
  const nav = useNavigate();

  // logos (sample) ...
  const logos = [
    {
      src: "https://upload.wikimedia.org/wikipedia/commons/b/ba/Stripe_Logo%2C_revised_2016.svg",
      alt: "Stripe",
    },
    {
      src: "https://upload.wikimedia.org/wikipedia/commons/6/69/Airbnb_Logo_B%C3%A9lo.svg",
      alt: "Airbnb",
    },
    {
      src: "https://upload.wikimedia.org/wikipedia/commons/2/2f/Google_2015_logo.svg",
      alt: "Google",
    },
    {
      src: "https://upload.wikimedia.org/wikipedia/commons/9/91/Octicons-mark-github.svg",
      alt: "GitHub",
    },
    {
      src: "https://www.logo.wine/a/logo/Apple_Inc./Apple_Inc.-Logo.wine.svg",
      alt: "Apple",
    },
    {
      src: "https://upload.wikimedia.org/wikipedia/commons/4/44/Microsoft_logo.svg",
      alt: "Microsoft",
    },
    {
      src: "https://upload.wikimedia.org/wikipedia/commons/a/a9/Amazon_logo.svg",
      alt: "Amazon",
    },
    {
      src: "https://www.logo.wine/a/logo/Meta_Platforms/Meta_Platforms-Logo.wine.svg",
      alt: "Meta",
    },
    {
      src: "https://www.logo.wine/a/logo/Netflix/Netflix-Logo.wine.svg",
      alt: "Netflix",
    },
    {
      src: "https://www.logo.wine/a/logo/Salesforce.com/Salesforce.com-Logo.wine.svg",
      alt: "Salesforce",
    },
    {
      src: "https://www.logo.wine/a/logo/Uber/Uber-Logo.wine.svg",
      alt: "Uber",
    },
    {
      src: "https://www.logo.wine/a/logo/Dropbox_(service)/Dropbox_(service)-Logo.wine.svg",
      alt: "Dropbox",
    },
    {
      src: "https://www.logo.wine/a/logo/Slack_Technologies/Slack_Technologies-Logo.wine.svg",
      alt: "Slack",
    },
    {
      src: "https://www.logo.wine/a/logo/Shopify/Shopify-Logo.wine.svg",
      alt: "Shopify",
    },
  ];

  useEffect(() => {
    return () => {
      if (blurRef.current) clearTimeout(blurRef.current);
    };
  }, []);

  function onSubmit(e) {
    e.preventDefault();
    const term = q.trim();
    if (!term) return;
    setMobileOpen(false);
    nav(`/jobs?search=${encodeURIComponent(term)}`);
  }

  function onFocus() {
    if (blurRef.current) {
      clearTimeout(blurRef.current);
      blurRef.current = null;
    }
    setOpenSug(true);
    setFocused(true);
  }

  function onBlur() {
    blurRef.current = setTimeout(() => {
      setOpenSug(false);
      setFocused(false);
    }, 120);
  }

  function pick(s) {
    setQ(s);
    setOpenSug(false);
  }

  useEffect(() => {
    const track = marqueeTrackRef.current;
    const group = marqueeGroupRef.current;
    if (!track || !group) return;
    let mounted = true;
    const setVars = () => {
      if (!mounted) return;
      const groupWidth = Math.ceil(group.getBoundingClientRect().width);
      const speed = 50;
      const durationSec = Math.max(5, Math.round((groupWidth / speed) * 8) / 8);
      track.style.setProperty("--marquee-width", `${groupWidth}px`);
      track.style.setProperty("--marquee-duration", `${durationSec}s`);
    };
    setVars();
    const ro = new ResizeObserver(setVars);
    ro.observe(group);
    window.addEventListener("resize", setVars);
    window.setTimeout(setVars, 300);
    return () => {
      mounted = false;
      ro.disconnect();
      window.removeEventListener("resize", setVars);
    };
  }, [logos.length]);

  // lock body scroll when mobile panel open
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  // autofocus mobile input when opened
  useEffect(() => {
    if (mobileOpen) {
      setTimeout(() => inputRef.current?.focus(), 120);
    }
  }, [mobileOpen]);

  const heroImageUrl =
    "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=1600&q=80";

  return (
    <section className="relative overflow-hidden pt-12 pb-20 lg:pt-20 lg:pb-28">
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="moving-blob left-0 top-10" />
        <div className="moving-blob right-0 bottom-10 blob-2" />
        <div className="moving-gradient-shift absolute inset-0 -z-20" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
          {/* LEFT: Text + Search */}
          <div className="space-y-6">
            <Motion.h1
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              className="text-4xl sm:text-5xl font-extrabold leading-tight tracking-tight text-slate-900"
            >
              Find jobs powered by AI — faster, smarter.
            </Motion.h1>

            <Motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.12 }}
              className="text-lg text-slate-600 max-w-xl"
            >
              ZenView uses semantic matching, recruiter signals and safe filters
              to surface the roles that fit your skills and goals.
            </Motion.p>

            {/* DESKTOP SEARCH */}
            <form
              onSubmit={onSubmit}
              className="hidden md:block max-w-2xl relative"
              role="search"
              aria-label="Search jobs"
            >
              <div
                className={`gradient-border rounded-2xl p-[2px] transition-all duration-300 ${
                  focused ? "gradient-border--active" : ""
                }`}
              >
                <div className="flex items-center gap-3 bg-white/90 backdrop-blur-sm rounded-[10px] px-3 py-2 shadow-sm">
                  <input
                    id="hero-search-desktop"
                    value={q}
                    onChange={(e) => setQ(e.target.value)}
                    onFocus={onFocus}
                    onBlur={onBlur}
                    placeholder="Search jobs, skills, or companies (e.g. 'frontend engineer')"
                    aria-label="Search jobs"
                    className="flex-1 bg-transparent placeholder:text-slate-400 text-sm focus:outline-none px-3 py-3 rounded-lg"
                  />

                  <button
                    type="submit"
                    aria-label="Search"
                    className="relative inline-flex items-center gap-2 rounded-lg px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white text-sm font-medium shadow-md hover:scale-[1.02] transform transition"
                  >
                    <svg
                      className="w-4 h-4"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                    >
                      <path
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M21 21l-4.35-4.35M10.5 18a7.5 7.5 0 100-15 7.5 7.5 0 000 15z"
                      />
                    </svg>
                    Search
                  </button>
                </div>
              </div>

              <div
                className={`absolute left-1/2 transform -translate-x-1/2 mt-4 w-[420px] search-glow ${
                  focused ? "opacity-90 scale-100" : "opacity-40 scale-95"
                }`}
                aria-hidden
              />

              {openSug && (
                <div className="mt-3 w-full max-w-2xl bg-white rounded-2xl border border-gray-100 shadow-sm p-3">
                  <div className="flex flex-wrap gap-2">
                    {[
                      "Frontend Engineer",
                      "Product Manager",
                      "Remote",
                      "UX Designer",
                    ].map((s) => (
                      <button
                        key={s}
                        type="button"
                        onMouseDown={(e) => e.preventDefault()}
                        onClick={() => pick(s)}
                        className="px-3 py-1 rounded-full text-sm bg-slate-50 border border-slate-100 hover:bg-blue-50 transition"
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </form>

            {/* MOBILE: small icon + hint */}
            <div className="md:hidden flex items-center gap-3">
              <button
                onClick={() => setMobileOpen(true)}
                aria-label="Open search"
                aria-haspopup="dialog"
                aria-expanded={mobileOpen}
                className="mobile-search-btn inline-flex items-center justify-center w-11 h-11 rounded-full bg-white/90 shadow-md focus-ring"
              >
                <svg
                  className="w-5 h-5 text-slate-700"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                >
                  <path
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M21 21l-4.35-4.35M10.5 18a7.5 7.5 0 100-15 7.5 7.5 0 000 15z"
                  />
                </svg>
              </button>

              <div className="flex-1 text-sm text-slate-600">
                Tap to search jobs, skills or companies
              </div>
            </div>

            <Motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.6 }}
              className="hidden md:flex items-center gap-4 flex-wrap"
            >
              <Link
                to="/register"
                className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl bg-gradient-to-r from-blue-600 to-purple-600 text-white font-medium shadow-lg hover:scale-[1.02] transform transition"
              >
                Create account
                <span className="inline-block w-2 h-2 rounded-full bg-white/30 animate-pulse-slow" />
              </Link>

              <Link
                to="/jobs"
                className="px-4 py-3 rounded-2xl border border-slate-200 text-sm text-slate-700 bg-white/80"
              >
                Browse jobs
              </Link>

              <div className="ml-2 hidden sm:flex items-center gap-4 text-sm text-slate-600">
                <div className="flex items-center gap-2">
                  <div className="font-semibold text-slate-900">4.8k+</div>
                  <div>Open roles</div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="font-semibold text-slate-900">1.2k+</div>
                  <div>Companies</div>
                </div>
              </div>
            </Motion.div>
          </div>

          {/* RIGHT: floating photo card */}
          <div className="flex justify-center lg:justify-end">
            <Motion.div
              className="relative rounded-2xl bg-white/90 backdrop-blur-sm shadow-2xl overflow-hidden w-[340px] sm:w-[420px] lg:w-[520px]"
              initial={{ opacity: 0, scale: 0.98, y: 6 }}
              animate={{ opacity: 1, scale: 1, y: [0, -8, 0] }}
              transition={{ duration: 6, ease: "easeInOut", repeat: Infinity }}
              style={{ willChange: "transform" }}
            >
              <img
                src={heroImageUrl}
                alt="Diverse professionals collaborating"
                className="photo-img w-full h-[320px] object-cover"
                loading="eager"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/6 to-transparent pointer-events-none" />
              <div className="absolute left-[-20%] top-[-10%] w-[140%] h-[40%] rotate-12 photo-sheen pointer-events-none" />
            </Motion.div>
          </div>
        </div>

        {/* Infinite marquee */}
        <div className="mt-12">
          <div
            className="marquee single-line rounded-2xl bg-white/70 px-4 py-3 shadow-inner"
            role="region"
            aria-label="Trusted by companies"
          >
            <div ref={marqueeTrackRef} className="marquee-track">
              <div ref={marqueeGroupRef} className="marquee-group">
                {logos.map((l, idx) => (
                  <div
                    key={`g1-${idx}`}
                    className="logo-card"
                    aria-hidden={false}
                  >
                    <img
                      src={l.src}
                      alt={l.alt}
                      title={l.alt}
                      className="company-logo"
                      loading="lazy"
                      onError={(e) => {
                        const c = e.currentTarget.closest(".logo-card");
                        if (c) c.style.display = "none";
                      }}
                    />
                  </div>
                ))}
              </div>
              <div className="marquee-group" aria-hidden="true">
                {logos.map((l, idx) => (
                  <div key={`g2-${idx}`} className="logo-card" aria-hidden>
                    <img
                      src={l.src}
                      alt={l.alt}
                      title={l.alt}
                      className="company-logo"
                      loading="lazy"
                      onError={(e) => {
                        const c = e.currentTarget.closest(".logo-card");
                        if (c) c.style.display = "none";
                      }}
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <Motion.div
        initial={{ opacity: 0, y: -8, scale: 0.98 }}
        animate={
          mobileOpen
            ? { opacity: 1, y: 0, scale: 1 }
            : { opacity: 0, y: -8, scale: 0.98 }
        }
        transition={{ duration: 0.26, ease: "easeOut" }}
        className="fixed inset-x-4 top-6 md:hidden"
        aria-hidden={!mobileOpen}
        style={{ pointerEvents: mobileOpen ? "auto" : "none", zIndex: 9999 }}
      >
        {/* BACKDROP (below panel) */}
        <div
          onClick={() => setMobileOpen(false)}
          className={`fixed inset-0 bg-black/20 backdrop-blur-sm transition-opacity ${
            mobileOpen ? "opacity-100" : "opacity-0"
          }`}
          aria-hidden
          style={{ zIndex: 9988, pointerEvents: mobileOpen ? "auto" : "none" }}
        />

        {/* PANEL (above backdrop) */}
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Search"
          tabIndex={-1}
          onClick={(e) => e.stopPropagation()}
          className="relative mx-auto max-w-lg"
          style={{ zIndex: 9999, pointerEvents: "auto" }}
        >
          <form onSubmit={onSubmit} className="relative">
            <div className="gradient-border rounded-2xl p-[2px]">
              <div className="flex items-center gap-3 bg-white/95 rounded-[10px] px-3 py-2 shadow-lg">
                <input
                  ref={inputRef}
                  id="hero-search-mobile"
                  value={q}
                  onChange={(e) => setQ(e.target.value)}
                  placeholder="Search jobs, skills, or companies (e.g. 'frontend engineer')"
                  aria-label="Search jobs"
                  className="flex-1 bg-transparent placeholder:text-slate-400 text-sm focus:outline-none px-3 py-3 rounded-lg"
                  style={{ pointerEvents: "auto" }}
                  disabled={false}
                />

                <button
                  type="submit"
                  aria-label="Search"
                  className="inline-flex items-center gap-2 rounded-lg px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white text-sm font-medium shadow-md"
                  style={{ pointerEvents: "auto" }}
                >
                  Search
                </button>

                <button
                  type="button"
                  aria-label="Close search"
                  onClick={(e) => {
                    e.stopPropagation();
                    setMobileOpen(false);
                  }}
                  className="ml-2 p-2 rounded-full bg-white/80 hover:bg-white focus-ring"
                  style={{ pointerEvents: "auto" }}
                >
                  <svg
                    className="w-4 h-4 text-slate-700"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                  >
                    <path
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>
            </div>

            {/* suggestions */}
            <div className="mt-3 bg-white/95 rounded-2xl border border-gray-100 shadow-sm p-3">
              <div className="flex flex-wrap gap-2">
                {[
                  "Frontend Engineer",
                  "Product Manager",
                  "Remote",
                  "UX Designer",
                ].map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => {
                      setQ(s);
                      setMobileOpen(false);
                      nav(`/jobs?search=${encodeURIComponent(s)}`);
                    }}
                    className="px-3 py-1 rounded-full text-sm bg-slate-50 border border-slate-100 hover:bg-blue-50 transition"
                    style={{ pointerEvents: "auto" }}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          </form>
        </div>
      </Motion.div>
    </section>
  );
}

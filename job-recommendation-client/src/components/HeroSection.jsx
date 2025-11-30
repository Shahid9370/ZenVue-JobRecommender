import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { motion as Motion, AnimatePresence } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";

/**
 * FloatingCard
 * - Minimal, production-safe floating image/card.
 * - Smooth Y-axis float + subtle scale.
 * - Auto-rotates images every 3–4s (clamped).
 * - Glassy rounded-xl look, supports JPG/PNG/GIF (transparent + animated).
 *
 * Replaced the old FloatingCard implementation with this focused, short,
 * and production-ready component. Everything else in the file is unchanged.
 */
const DEFAULT_IMAGES = [
  // Unsplash (JPG)
  "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=1600&q=80",
  // Unsplash (JPG)
  "https://images.unsplash.com/photo-1542744095-291d1f67b221?auto=format&fit=crop&w=1600&q=80",
  // Icons8 (PNG, transparent)
  "https://img.icons8.com/fluency/240/000000/idea.png",
  // GIPHY (GIF)
  "https://media.giphy.com/media/3oEjI6SIIHBdRxXI40/giphy.gif",
];

const imgVariant = {
  initial: { opacity: 0, y: 8, scale: 1 },
  animate: { opacity: 1, y: 0, scale: 1 },
  exit: { opacity: 0, y: -6, scale: 0.995 },
  transition: { duration: 0.5, ease: "easeOut" },
};

const FloatingCard = React.memo(function FloatingCard({
  images = DEFAULT_IMAGES,
  altTexts = [],
  intervalMs = 3500,
  className = "",
  ariaHidden = false,
}) {
  const [idx, setIdx] = useState(0);
  const mounted = useRef(true);
  const intervalRef = useRef(null);

  // clamp to 3-4 seconds
  const ms = Math.max(3000, Math.min(4000, Number(intervalMs) || 3500));

  useEffect(() => {
    mounted.current = true;
    if ((images?.length ?? 0) > 1) {
      intervalRef.current = window.setInterval(() => {
        if (!mounted.current) return;
        setIdx((i) => (images.length ? (i + 1) % images.length : 0));
      }, ms);
    }
    return () => {
      mounted.current = false;
      if (intervalRef.current) {
        window.clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [images, ms]);

  if (!images || images.length === 0) {
    return (
      <Motion.div
        aria-hidden={ariaHidden}
        initial={{ opacity: 0, y: 6, scale: 0.995 }}
        animate={{ opacity: 1, y: [0, -6, 0], scale: [1, 1.02, 1] }}
        transition={{ duration: 6, ease: "easeInOut", repeat: Infinity }}
        className={`${className} rounded-xl bg-white/10 backdrop-blur-md border border-white/6 shadow-lg w-[340px] sm:w-[420px] lg:w-[520px] h-[320px] flex items-center justify-center`}
      >
        <div className="text-sm text-slate-400">No images</div>
      </Motion.div>
    );
  }

  return (
    <Motion.div
      aria-hidden={ariaHidden}
      initial={{ opacity: 0, y: 6, scale: 0.995 }}
      animate={{ opacity: 1, y: [0, -8, 0], scale: [1, 1.02, 1] }}
      transition={{ duration: 6, ease: "easeInOut", repeat: Infinity }}
      style={{ willChange: "transform" }}
      className={`${className} rounded-xl bg-white/12 backdrop-blur-md border border-white/6 shadow-lg overflow-hidden w-[340px] sm:w-[420px] lg:w-[520px]`}
    >
      <div className="w-full h-[320px] bg-slate-50/5 relative flex items-center justify-center">
        <AnimatePresence mode="wait">
          <Motion.img
            key={idx}
            src={images[idx]}
            alt={altTexts[idx] ?? `Floating image ${idx + 1}`}
            loading="eager"
            initial={imgVariant.initial}
            animate={imgVariant.animate}
            exit={imgVariant.exit}
            transition={imgVariant.transition}
            className="w-full h-full object-cover select-none pointer-events-none"
            style={{ willChange: "opacity, transform" }}
            decoding="async"
          />
        </AnimatePresence>

        {/* subtle depth overlay + sheen */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/6 to-transparent pointer-events-none" />
        <div className="absolute left-[-18%] top-[-8%] w-[140%] h-[36%] rotate-12 bg-white/6 opacity-40 pointer-events-none" />
      </div>

      {/* footer spacer for consistent spacing */}
      <div className="px-4 py-3 bg-transparent" />
    </Motion.div>
  );
});

/* -------------------------------
   Static company logos kept outside component to avoid re-creation
   ------------------------------- */
const LOGOS = [
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

/**
 * HeroSection: optimized whole page component.
 * - Reduced re-renders via useMemo/useCallback.
 * - Cleaned up effects and timeouts.
 * - Maintains identical layout and responsive behavior.
 */
export default function HeroSection() {
  const [q, setQ] = useState("");
  const [focused, setFocused] = useState(false);
  const [openSug, setOpenSug] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const blurTimeoutRef = useRef(null);
  const inputRef = useRef(null);
  const marqueeTrackRef = useRef(null);
  const marqueeGroupRef = useRef(null);
  const nav = useNavigate();

  // stable hero image used by FloatingCard
  const heroImageUrl = useMemo(
    () =>
      "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=1600&q=80",
    []
  );

  // prepare images for FloatingCard and memoize to avoid re-creating arrays
  const floatingImages = useMemo(
    () => [
      heroImageUrl,
      "https://images.unsplash.com/photo-1542744095-291d1f67b221?auto=format&fit=crop&w=1600&q=80",
      "https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=1600&q=80",
    ],
    [heroImageUrl]
  );

  const floatingAlts = useMemo(
    () => [
      "Diverse professionals collaborating",
      "Team brainstorming around a laptop",
      "Designers reviewing UI on a tablet",
    ],
    []
  );

  // Cleanup blur timeout on unmount
  useEffect(() => {
    return () => {
      if (blurTimeoutRef.current) {
        clearTimeout(blurTimeoutRef.current);
        blurTimeoutRef.current = null;
      }
    };
  }, []);

  // search submit - stable callback
  const onSubmit = useCallback(
    (e) => {
      e?.preventDefault();
      const term = q.trim();
      if (!term) return;
      setMobileOpen(false);
      nav(`/jobs?search=${encodeURIComponent(term)}`);
    },
    [q, nav]
  );

  // focus/blur handlers
  const onFocus = useCallback(() => {
    if (blurTimeoutRef.current) {
      clearTimeout(blurTimeoutRef.current);
      blurTimeoutRef.current = null;
    }
    setOpenSug(true);
    setFocused(true);
  }, []);

  const onBlur = useCallback(() => {
    blurTimeoutRef.current = window.setTimeout(() => {
      setOpenSug(false);
      setFocused(false);
      blurTimeoutRef.current = null;
    }, 120);
  }, []);

  const pickSuggestion = useCallback((s) => {
    setQ(s);
    setOpenSug(false);
  }, []);

  // marquee sizing: computes CSS vars for scrolling speed/duration
  useEffect(() => {
    const track = marqueeTrackRef.current;
    const group = marqueeGroupRef.current;
    if (!track || !group) return undefined;
    let mounted = true;

    const setVars = () => {
      if (!mounted) return;
      const groupWidth = Math.ceil(group.getBoundingClientRect().width || 0);
      const speed = 50; // px/s baseline
      const durationSec = Math.max(5, Math.round((groupWidth / speed) * 8) / 8);
      track.style.setProperty("--marquee-width", `${groupWidth}px`);
      track.style.setProperty("--marquee-duration", `${durationSec}s`);
    };

    setVars();
    const ro = new ResizeObserver(setVars);
    ro.observe(group);
    window.addEventListener("resize", setVars);
    const t = window.setTimeout(setVars, 300);

    return () => {
      mounted = false;
      ro.disconnect();
      window.removeEventListener("resize", setVars);
      window.clearTimeout(t);
    };
  }, []);

  // lock body scroll while mobile panel is open
  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = mobileOpen ? "hidden" : prev;
    return () => {
      document.body.style.overflow = prev;
    };
  }, [mobileOpen]);

  // autofocus mobile input when panel opens
  useEffect(() => {
    if (mobileOpen) {
      const t = window.setTimeout(() => inputRef.current?.focus(), 120);
      return () => window.clearTimeout(t);
    }
    return undefined;
  }, [mobileOpen]);

  // suggestions (static list)
  const SUGGESTIONS = useMemo(
    () => ["Frontend Engineer", "Product Manager", "Remote", "UX Designer"],
    []
  );

  return (
    <section className="relative overflow-hidden pt-12 pb-20 lg:pt-20 lg:pb-28">
      {/* Decorative background (pointer-events-none to keep interactions simple) */}
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
                    {SUGGESTIONS.map((s) => (
                      <button
                        key={s}
                        type="button"
                        onMouseDown={(e) => e.preventDefault()}
                        onClick={() => pickSuggestion(s)}
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
                type="button"
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
            <FloatingCard
              className="relative"
              images={floatingImages}
              altTexts={floatingAlts}
              intervalMs={3000}
            />
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
                {LOGOS.map((l, idx) => (
                  <div key={`g1-${idx}`} className="logo-card" aria-hidden={false}>
                    <img
                      src={l.src}
                      alt={l.alt}
                      title={l.alt}
                      className="company-logo"
                      loading="lazy"
                      onError={(e) => {
                        // fail gracefully by hiding the broken logo container
                        const c = e.currentTarget.closest(".logo-card");
                        if (c) c.style.display = "none";
                      }}
                    />
                  </div>
                ))}
              </div>
              <div className="marquee-group" aria-hidden="true">
                {LOGOS.map((l, idx) => (
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

      {/* Mobile search panel (AnimatePresence mounts/unmounts) */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <div
              key="mobile-search-backdrop"
              onClick={() => setMobileOpen(false)}
              className={`fixed inset-0 md:hidden mobile-search-backdrop ${mobileOpen ? "open" : ""}`}
              aria-hidden={!mobileOpen}
              data-open={mobileOpen ? "true" : "false"}
            />

            <Motion.div
              key="mobile-search-panel"
              initial={{ opacity: 0, y: -8, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -8, scale: 0.98 }}
              transition={{ duration: 0.26, ease: "easeOut" }}
              className={`mobile-search-panel md:hidden fixed inset-x-4 top-6 ${mobileOpen ? "open" : ""}`}
              data-open={mobileOpen ? "true" : "false"}
            >
              <div
                role="dialog"
                aria-modal="true"
                aria-label="Mobile search"
                className="relative mx-auto max-w-lg bg-white/95 rounded-xl p-3"
                onClick={(e) => e.stopPropagation()}
              >
                <form onSubmit={onSubmit} className="relative">
                  <div className="gradient-border rounded-2xl p-[2px]">
                    <div className="flex items-center gap-3 bg-white/95 rounded-[10px] px-3 py-2 shadow-lg">
                      <input
                        ref={inputRef}
                        id="hero-search-mobile"
                        value={q}
                        onChange={(e) => setQ(e.target.value)}
                        placeholder="Search jobs, skills, or companies..."
                        className="flex-1 bg-transparent text-sm px-3 py-3 focus:outline-none"
                      />

                      <button
                        type="submit"
                        className="inline-flex items-center gap-2 rounded-lg px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white text-sm font-medium shadow-md"
                      >
                        Search
                      </button>

                      <button
                        type="button"
                        onClick={() => setMobileOpen(false)}
                        className="ml-2 p-2 rounded-full bg-white/80 hover:bg-white"
                        aria-label="Close search"
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

                  <div className="mt-3 bg-white/95 rounded-2xl border border-gray-100 shadow-sm p-3">
                    <div className="flex flex-wrap gap-2">
                      {SUGGESTIONS.map((s) => (
                        <button
                          key={s}
                          type="button"
                          onClick={() => {
                            setQ(s);
                            setMobileOpen(false);
                            nav(`/jobs?search=${encodeURIComponent(s)}`);
                          }}
                          className="px-3 py-1 rounded-full text-sm bg-slate-50 border border-slate-100 hover:bg-blue-50 transition"
                        >
                          {s}
                        </button>
                      ))}
                    </div>
                  </div>
                </form>
              </div>
            </Motion.div>
          </>
        )}
      </AnimatePresence>
    </section>
  );
}
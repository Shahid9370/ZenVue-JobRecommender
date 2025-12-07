import React, { useRef, useState, useCallback, useEffect } from "react";
import { motion, AnimatePresence, useAnimation, useMotionValue } from "framer-motion";
import { createPortal } from "react-dom";
import ReviewCard from "./ReviewCard";

/**
 * MarqueeRow — robust user interaction handling
 *
 * NOTE: Only visual changes applied to the expanded/modal UI to create a premium
 * "Liquid Glass" effect (Apple-like). All marquee logic, dragging, wheel, keyboard,
 * avatar mapping, transform-based modal animation, accessibility and performance
 * are kept unchanged.
 *
 * Styling uses Tailwind utility classes only for UI visuals; minimal inline styles
 * are retained for computed layout properties (width/height/transformOrigin/willChange).
 */

export default function MarqueeRow({
  items = [],
  direction = "left",
  speed = 100, // px/sec used for auto loop duration
  laneIndex = 0,
}) {
  const containerRef = useRef(null);
  const firstGroupRef = useRef(null);
  const contentRef = useRef(null);
  const controls = useAnimation();
  const x = useMotionValue(0);

  const [groupWidth, setGroupWidth] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [isUserInteracting, setIsUserInteracting] = useState(false);
  const userIdleTimer = useRef(null);

  // active modal: { review, rect, sourceEl }
  const [active, setActive] = useState(null);

  // light/dark site detection to adapt glass visuals for white backgrounds
  const [isLightBg, setIsLightBg] = useState(false);

  // requestAnimationFrame throttle ref for wheel updates
  const wheelRafRef = useRef(null);

  // ---- User-interaction helper (debounced) ----
  const clearUserIdleTimer = () => {
    if (userIdleTimer.current) {
      clearTimeout(userIdleTimer.current);
      userIdleTimer.current = null;
    }
  };

  const setUserInteraction = useCallback((val, idleMs = 300) => {
    clearUserIdleTimer();
    setIsUserInteracting(val);
    if (val) {
      setIsPaused(true);
      controls.stop();
      userIdleTimer.current = setTimeout(() => {
        userIdleTimer.current = null;
        setIsUserInteracting(false);
        setIsPaused(false);
        // normalize then resume
        normalizePositionThenStartAuto();
      }, idleMs);
    }
  }, [controls]);

  // ---- measurement of group width ----
  useEffect(() => {
    if (!firstGroupRef.current) return;
    let raf = 0;
    const measure = () => {
      if (!firstGroupRef.current) return;
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const w = firstGroupRef.current.offsetWidth || 0;
        setGroupWidth(w);
      });
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(firstGroupRef.current);
    window.addEventListener("resize", measure);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", measure);
      cancelAnimationFrame(raf);
    };
  }, [items]);

  // ---- wrapping while not interacting (prevent mid-interaction jumps) ----
  useEffect(() => {
    if (!groupWidth) return;
    const unsub = x.onChange((latest) => {
      if (!groupWidth) return;
      if (isUserInteracting) return; // suspend wrap
      // automatic wrap corrections while autoplay runs
      if (latest <= -2 * groupWidth) {
        x.set(latest + groupWidth);
      } else if (latest >= 0) {
        x.set(latest - groupWidth);
      }
    });
    return () => unsub();
  }, [x, groupWidth, isUserInteracting]);

  // ---- normalize position to allowed range before auto starts ----
  const normalizePosition = useCallback(() => {
    if (!groupWidth) return;
    let current = x.get();
    // Reduce multiple group wrap into one normalized position within [-2*groupWidth, 0)
    // Compute modulo relative to groupWidth
    if (groupWidth <= 0) return;
    // Bring current into range [-2*groupWidth, 0)
    // We can add/subtract groupWidth until in range
    while (current <= -2 * groupWidth) current += groupWidth;
    while (current >= 0) current -= groupWidth;
    return current;
  }, [groupWidth, x]);

  const normalizePositionThenStartAuto = useCallback(() => {
    if (!groupWidth) {
      // can't start yet
      setTimeout(() => normalizePositionThenStartAuto(), 80);
      return;
    }
    const normalized = normalizePosition();
    // set instantly (small visible jump only when user finished interacting)
    // or animate quickly — instant is acceptable since user is idle
    x.set(normalized);
    // start auto loop after tiny delay (allow layout)
    setTimeout(() => startAuto(normalized), 30);
  }, [groupWidth, normalizePosition, x]);

  // ---- auto loop ----
  const startAuto = useCallback((from = null) => {
    if (!groupWidth || isPaused || isDragging || isUserInteracting) return;
    controls.stop();
    const startValue = typeof from === "number" ? from : x.get();
    const distance = direction === "left" ? -groupWidth : groupWidth;
    const duration = Math.max(2, Math.abs(distance) / Math.max(40, speed));
    const target = startValue + distance;
    controls.start({
      x: [startValue, target],
      transition: {
        x: {
          repeat: Infinity,
          repeatType: "loop",
          duration,
          ease: "linear",
        },
      },
    });
  }, [controls, groupWidth, direction, speed, isPaused, isDragging, isUserInteracting, x]);

  const stopAuto = useCallback(() => controls.stop(), [controls]);

  // initialize when groupWidth measured
  useEffect(() => {
    if (!groupWidth) return;
    x.set(-groupWidth);
    setTimeout(() => startAuto(-groupWidth), 20);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [groupWidth]);

  // pause/resume orchestration
  useEffect(() => {
    if (!groupWidth) return;
    if (isPaused || isDragging || isUserInteracting) stopAuto();
    else startAuto();
  }, [isPaused, isDragging, isUserInteracting, startAuto, stopAuto, groupWidth]);

  // ---- hover pause from children ----
  const handleHoverToggle = useCallback((isHovering) => setIsPaused(Boolean(isHovering)), []);

  // ---- drag handlers ----
  const handleDragStart = () => {
    setIsDragging(true);
    setUserInteraction(true);
    stopAuto();
  };

  const handleDragEnd = (event, info) => {
    setIsDragging(false);
    // fling based on velocity; clamp magnitude to groupWidth
    const velocity = info.velocity.x || 0;
    const current = x.get();
    const fling = Math.max(-groupWidth, Math.min(groupWidth, velocity * 0.06));
    const target = current + fling;
    // animate deceleration (transform-only)
    controls
      .start({
        x: target,
        transition: { x: { duration: 0.44, ease: "circOut" } },
      })
      .then(() => {
        // keep user-interaction flag until idle timer clears
      });
  };

  // ---- wheel handler (throttled via RAF) ----
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const onWheel = (e) => {
      // Determine if user intends horizontal pan:
      // use a small hysteresis to avoid misclassifying mostly-vertical scrolls
      const absX = Math.abs(e.deltaX);
      const absY = Math.abs(e.deltaY);
      const treatAsHorizontal = e.shiftKey || absX > absY * 1.2; // require 20% more horizontal to count
      if (!treatAsHorizontal) return;
      e.preventDefault();
      setUserInteraction(true, 350);

      // stop auto; we'll update x directly but throttle using RAF
      stopAuto();

      const delta = e.deltaX !== 0 ? e.deltaX : e.deltaY;
      const move = -delta * 0.85;

      // throttle via RAF to avoid flooding x.set calls
      if (wheelRafRef.current) {
        // update the queued amount
        wheelRafRef.current.pending = (wheelRafRef.current.pending || 0) + move;
        return;
      }

      wheelRafRef.current = { pending: move };
      const step = () => {
        if (!wheelRafRef.current) return;
        const toApply = wheelRafRef.current.pending || 0;
        x.set(x.get() + toApply);
        wheelRafRef.current = null;
      };
      requestAnimationFrame(step);
    };

    el.addEventListener("wheel", onWheel, { passive: false });
    return () => el.removeEventListener("wheel", onWheel);
  }, [setUserInteraction, stopAuto, x]);

  // ---- keyboard handling: keydown pan, keyup triggers idle debounce ----
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    // We'll handle keydown + keyup to be sure idle timer starts only when keyup occurs
    const onKeyDown = (e) => {
      if (e.key !== "ArrowLeft" && e.key !== "ArrowRight") return;
      e.preventDefault();
      // on first keydown, mark user interaction
      if (!isUserInteracting) {
        setUserInteraction(true, 400);
      } else {
        // refresh idle timer
        clearUserIdleTimer();
        userIdleTimer.current = setTimeout(() => {
          userIdleTimer.current = null;
          setIsUserInteracting(false);
          setIsPaused(false);
          normalizePositionThenStartAuto();
        }, 400);
      }

      // stop auto and perform a short animation to the new position
      stopAuto();
      const step = (groupWidth || 360) / 2;
      const dir = e.key === "ArrowLeft" ? 1 : -1;
      // animate a short pan for responsiveness
      controls.start({
        x: x.get() + dir * step,
        transition: { x: { duration: 0.18, ease: "easeOut" } },
      });
    };

    const onKeyUp = (e) => {
      if (e.key !== "ArrowLeft" && e.key !== "ArrowRight") return;
      // start idle timer (if not already started)
      clearUserIdleTimer();
      userIdleTimer.current = setTimeout(() => {
        userIdleTimer.current = null;
        setIsUserInteracting(false);
        setIsPaused(false);
        normalizePositionThenStartAuto();
      }, 300);
    };

    el.addEventListener("keydown", onKeyDown);
    el.addEventListener("keyup", onKeyUp);
    return () => {
      el.removeEventListener("keydown", onKeyDown);
      el.removeEventListener("keyup", onKeyUp);
    };
  }, [groupWidth, setUserInteraction, stopAuto, x, controls, normalizePositionThenStartAuto, isUserInteracting]);

  // ---- modal open/close ----
  const handleRequestOpen = useCallback(
    ({ review, rect, sourceEl }) => {
      setIsPaused(true);
      stopAuto();
      setActive({ review, rect, sourceEl });
    },
    [stopAuto]
  );

  const handleCloseModal = useCallback(() => {
    if (active?.sourceEl && typeof active.sourceEl.focus === "function") {
      setTimeout(() => {
        try {
          active.sourceEl.focus();
        // eslint-disable-next-line no-unused-vars
        } catch (e) { /* empty */ }
      }, 120);
    }
    setActive(null);
    setIsPaused(false);
    setTimeout(() => startAuto(), 80);
  }, [active, startAuto]);

  // lock body scroll when modal open
  useEffect(() => {
    if (active) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [active]);

  // ESC to close modal
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape" && active) handleCloseModal();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [active, handleCloseModal]);

  // When modal opens, detect the document background brightness to pick an appropriate glass tint.
  useEffect(() => {
    if (!active) return;
    if (typeof window === "undefined" || typeof document === "undefined") {
      setIsLightBg(false);
      return;
    }
    try {
      // Read computed background color of body (falls back to html)
      const el = document.body || document.documentElement;
      const cs = window.getComputedStyle(el);
      const bg = cs && (cs.backgroundColor || cs.background);
      if (!bg) {
        setIsLightBg(false);
        return;
      }
      // Parse rgb(a)
      const m = bg.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*([01]?\.?\d*))?\)/);
      if (!m) {
        // if non-rgb, fallback to light=false
        setIsLightBg(false);
        return;
      }
      const r = Number(m[1]) / 255;
      const g = Number(m[2]) / 255;
      const b = Number(m[3]) / 255;
      // Relative luminance (standard)
      const lum = 0.2126 * r + 0.7152 * g + 0.0722 * b;
      // If very bright (close to white), we enable dark-tinted glass to provide contrast.
      setIsLightBg(lum > 0.85);
    } catch (e) {
      setIsLightBg(false);
    }
  }, [active]);

  // ---- modal render (transform-only) ----
  const renderModal = () => {
    if (!active) return null;
    if (typeof document === "undefined") return null;
    const { review, rect } = active;
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    const isMobile = vw < 640;

    const targetWidth = isMobile ? Math.min(vw, 9999) : Math.min(720, Math.round(vw * 0.86));
    const targetHeight = isMobile ? Math.round(Math.max(380, vh * 0.72)) : Math.min(vh - 88, 10000);

    const rectCenterX = rect ? rect.left + rect.width / 2 : vw / 2;
    const rectCenterY = rect ? rect.top + rect.height / 2 : vh / 2;
    const modalCenterX = isMobile ? vw / 2 : vw / 2;
    const modalCenterY = isMobile ? vh - targetHeight / 2 : vh / 2;

    const deltaX = rectCenterX - modalCenterX;
    const deltaY = rectCenterY - modalCenterY;
    const scale = rect ? Math.max(0.3, rect.width / targetWidth) : 0.4;

    const prefersReducedMotion =
      typeof window !== "undefined" &&
      window.matchMedia &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    // Keep transform-based initial/animate/exit as before — only change transition to a soft tween (no bounce)
    const initial = prefersReducedMotion ? { opacity: 0 } : { opacity: 0, x: deltaX, y: deltaY, scale };
    const animate = prefersReducedMotion ? { opacity: 1 } : { opacity: 1, x: 0, y: 0, scale: 1 };
    const exit = prefersReducedMotion ? { opacity: 0 } : { opacity: 0, x: deltaX, y: deltaY, scale };

    // Soft tween transition (no overshoot). We'll use an ease curve tuned to feel premium.
    const tweenTransition = prefersReducedMotion
      ? { duration: 0.14 }
      : { duration: 0.36, ease: [0.22, 0.12, 0.01, 1] }; // custom bezier for smooth, non-bouncy motion

    // Overlay classes — slightly stronger when site is light to create depth
    const overlayClass = isMobile
      ? "fixed inset-0 z-40 bg-black/40 backdrop-blur-sm"
      : isLightBg
      ? "fixed inset-0 z-40 bg-black/50 backdrop-blur-sm"
      : "fixed inset-0 z-40 bg-black/40 backdrop-blur-md";

    // Modal positioning classes
    const modalClasses = isMobile
      ? `fixed left-0 right-0 bottom-0 z-50 rounded-t-2xl overflow-hidden translate-z-0`
      : `fixed left-1/2 top-1/2 z-50 -translate-x-1/2 -translate-y-1/2 rounded-2xl overflow-visible translate-z-0`;

    // Tailwind-first liquid glass surface classes (no inline visual styles)
    // - Uses backdrop-blur, subtle tint, ring and soft shadow to emulate Apple's liquid glass.
    const surfaceBase = isLightBg
      ? "relative rounded-2xl ring-1 ring-white/10 bg-slate-900/28 border border-slate-800/12 backdrop-blur-2xl shadow-2xl overflow-hidden"
      : "relative rounded-2xl ring-1 ring-white/10 bg-white/6 border border-white/8 backdrop-blur-2xl shadow-2xl overflow-hidden";

    // Content text color
    const contentText = isLightBg ? "text-white" : "text-slate-900";

    // Close button classes (glass button)
    const closeBtn = isLightBg
      ? "inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-white/6 text-white hover:bg-white/8 focus-visible:ring-2 focus-visible:ring-white/30"
      : "inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-white/10 text-slate-900 hover:bg-white/14 focus-visible:ring-2 focus-visible:ring-white/30";

    // Noise texture as inline SVG image (placed as an <img> for Tailwind-only styling elsewhere)
    const noiseSvg = `data:image/svg+xml;utf8,${encodeURIComponent(
      `<svg xmlns='http://www.w3.org/2000/svg' width='800' height='600' preserveAspectRatio='none'><defs><filter id='n' x='0' y='0' width='100%' height='100%'><feTurbulence baseFrequency='0.9' numOctaves='1' stitchTiles='stitch'/><feColorMatrix type='saturate' values='0'/><feComponentTransfer><feFuncA type='table' tableValues='0 0.5'/></feComponentTransfer></filter></defs><rect width='100%' height='100%' fill='white' opacity='0.02' filter='url(#n)'/></svg>`
    )}`;

    return createPortal(
      <AnimatePresence>
        <motion.div
          key="overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={tweenTransition}
          onClick={handleCloseModal}
          className={overlayClass}
          aria-hidden="true"
        />

        <motion.div
          key={`modal-${review.id}`}
          initial={initial}
          animate={animate}
          exit={exit}
          transition={tweenTransition}
          className={modalClasses}
          style={{
            width: isMobile ? "100%" : `${targetWidth}px`,
            height: isMobile ? `${targetHeight}px` : "auto",
            maxHeight: isMobile ? undefined : `calc(100vh - 88px)`,
            transformOrigin: isMobile ? "center bottom" : "center center",
            willChange: "transform, opacity",
          }}
          role="dialog"
          aria-modal="true"
        >
          {/* Decorative bezel for depth (desktop only) */}
          <div aria-hidden className="hidden sm:block absolute -inset-1 rounded-2xl pointer-events-none">
            <div className="w-full h-full rounded-2xl pointer-events-none"
              aria-hidden
            />
          </div>

          {/* Liquid glass surface */}
          <div className={surfaceBase}>
            {/* Noise texture overlay (very low opacity) */}
            <img
              src={noiseSvg}
              alt=""
              aria-hidden
              className="absolute inset-0 w-full h-full object-cover opacity-5 pointer-events-none"
              style={{ zIndex: 1 }}
            />

            {/* Specular sheen (top-left) */}
            <div
              aria-hidden
              className="absolute -left-14 -top-16 rounded-full w-56 h-56 pointer-events-none opacity-25 mix-blend-screen"
              style={{ background: "radial-gradient(circle at center, rgba(255,255,255,0.95), rgba(255,255,255,0.2) 28%, rgba(255,255,255,0) 60%)" }}
            />

            {/* Inner top strip highlight */}
            <div className="absolute inset-x-0 top-0 h-20 pointer-events-none bg-gradient-to-b from-white/10 to-transparent opacity-60 mix-blend-overlay" />

            {/* Subtle floating liquid accent (transform-only) */}
            <motion.div
              aria-hidden
              className="absolute inset-0 rounded-2xl pointer-events-none"
              animate={prefersReducedMotion ? undefined : { x: ["0%", "5%", "0%"], y: ["0%", "3%", "0%"] }}
              transition={prefersReducedMotion ? {} : { duration: 9, repeat: Infinity, ease: "easeInOut" }}
              style={{ zIndex: 2, opacity: 0.9 }}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-indigo-50/5 via-cyan-50/4 to-transparent mix-blend-overlay" />
            </motion.div>

            {/* Content area */}
            <div
              className={`relative z-10 ${isMobile ? "p-5" : "p-6"} overflow-auto`}
              style={{
                WebkitOverflowScrolling: "touch",
              }}
            >
              {/* Header */}
              <div className="flex items-center gap-4 mb-3">
                <img
                  src={review.avatar || ""}
                  alt={review.name || "User"}
                  className="h-14 w-14 rounded-full object-cover ring-2 ring-white/20"
                  loading="lazy"
                  onError={(e) => {
                    e.target.src = `https://placehold.co/80x80/EDF2FF/0F172A?text=${encodeURIComponent(
                      (review?.name || "?").charAt(0)
                    )}&font=roboto`;
                  }}
                />
                <div className="flex-1 min-w-0">
                  <div className={`text-xl md:text-2xl font-semibold truncate ${isLightBg ? "text-white" : "text-slate-900"}`}>
                    {review.name}
                  </div>
                  <div className={`text-sm truncate ${isLightBg ? "text-white/85" : "text-slate-600"}`}>
                    {review.role}
                    {review.company ? ` · ${review.company}` : ""}
                  </div>
                  {review.location && <div className={`text-xs mt-1 ${isLightBg ? "text-white/70" : "text-slate-500"}`}>{review.location}</div>}
                </div>

                <div className="ml-4 flex items-center gap-3">
                  <div className="text-yellow-400 text-lg leading-none select-none" aria-hidden>
                    {"★".repeat(Math.round(review.rating || 5))}
                  </div>
                  <button
                    onClick={handleCloseModal}
                    className={closeBtn}
                    aria-label="Close testimonial"
                    type="button"
                  >
                    Close
                  </button>
                </div>
              </div>

              {/* Body */}
              <div className={`prose prose-sm ${isLightBg ? "text-white/95" : "text-slate-900"}`}>
                <p className="whitespace-pre-wrap">{review.text}</p>
              </div>

              <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <h4 className={`text-sm md:text-base font-medium ${isLightBg ? "text-white" : "text-slate-900"}`}>About</h4>
                  <p className={`mt-2 ${isLightBg ? "text-white/85" : "text-slate-600"}`} style={{ opacity: 0.88 }}>
                    {review.bio || review.summary || "No additional bio."}
                  </p>
                </div>
                <div>
                  <h4 className={`text-sm md:text-base font-medium ${isLightBg ? "text-white" : "text-slate-900"}`}>Connect</h4>
                  <div className="mt-2 flex items-center gap-2 flex-wrap">
                    {review.social?.twitter && (
                      <a
                        href={review.social.twitter}
                        target="_blank"
                        rel="noreferrer"
                        className={`px-3 py-1 rounded-md ${isLightBg ? "bg-white/6 text-white/90" : "bg-white/6 text-sky-600"} text-xs hover:bg-white/10 transition`}
                      >
                        Twitter
                      </a>
                    )}
                    {review.social?.linkedin && (
                      <a
                        href={review.social.linkedin}
                        target="_blank"
                        rel="noreferrer"
                        className={`px-3 py-1 rounded-md ${isLightBg ? "bg-white/6 text-white/90" : "bg-white/6 text-sky-600"} text-xs hover:bg-white/10 transition`}
                      >
                        LinkedIn
                      </a>
                    )}
                    {review.social?.website && (
                      <a
                        href={review.social.website}
                        target="_blank"
                        rel="noreferrer"
                        className={`px-3 py-1 rounded-md ${isLightBg ? "bg-white/6 text-white/90" : "bg-white/6 text-slate-900"} text-xs hover:bg-white/10 transition`}
                      >
                        Website
                      </a>
                    )}
                    {!review.social && <div className={`text-sm ${isLightBg ? "text-white/80" : "text-slate-500"}`}>No social links</div>}
                  </div>
                </div>
              </div>

              {review.extra && (
                <pre className="mt-6 text-sm whitespace-pre-wrap" style={{ opacity: 0.85 }}>
                  {review.extra}
                </pre>
              )}
            </div>
          </div>
        </motion.div>
      </AnimatePresence>,
      document.body
    );
  };

  const groups = [items, items, items];

  return (
    <>
      <div className="relative">
        <div ref={containerRef} className="overflow-hidden" tabIndex={0} aria-label="Testimonials marquee">
          <motion.div
            ref={contentRef}
            className="flex gap-6 items-stretch py-2"
            style={{ x }}
            drag="x"
            dragConstraints={{ left: -99999, right: 99999 }}
            dragElastic={0.08}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
            onPointerDown={() => setUserInteraction(true)}
            onPointerUp={() => setUserInteraction(true, 300)}
            dragTransition={{ bounceStiffness: 600, bounceDamping: 28 }}
            animate={controls}
          >
            {groups.map((group, gi) => (
              <div key={`group-${gi}`} ref={gi === 0 ? firstGroupRef : null} className="flex gap-6">
                {group.map((rev, i) => {
                  const instanceId = gi * items.length + i;
                  return (
                    <div key={`${rev.id || i}-${instanceId}`} className="flex-shrink-0 inline-block">
                      <ReviewCard
                        review={rev}
                        onHoverToggle={handleHoverToggle}
                        onRequestOpen={handleRequestOpen}
                        layoutIdPrefix={`lane-${laneIndex}`}
                        instanceId={instanceId}
                      />
                    </div>
                  );
                })}
              </div>
            ))}
          </motion.div>
        </div>
      </div>

      {renderModal()}
    </>
  );
}
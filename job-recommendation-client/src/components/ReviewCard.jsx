import React, { useRef, useMemo, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";

/**
 * ReviewCard — updated View button with micro-animation & refined design
 * - Preserves all behavior: avatar mapping, image fallback, onRequestOpen, onHoverToggle, accessibility.
 * - Uses Framer Motion for all animations (respects prefers-reduced-motion).
 * - Button: subtle glassy gradient, soft shadow, scale/lift on hover, tactile press, and a micro arrow motion.
 */

export default function ReviewCard({
  review,
  onHoverToggle,
  onRequestOpen,
}) {
  const cardRef = useRef(null);
  const [btnHover, setBtnHover] = useState(false);
  const reduceMotion = useReducedMotion();

  const getAvatarUrl = (name) => {
    const map = {
      "Aisha Khan":
        "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=688",
      "David Lee":
        "https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=400&h=400&fit=crop",
      "Sophia Patel":
        "https://images.unsplash.com/photo-1582610285985-a42d9193f2fd?auto=format&fit=crop&q=80&w=687",
      "Shahid Shaikh":
        "https://media.licdn.com/dms/image/v2/D4D22AQHd1i8G2BmKAg/feedshare-shrink_480/B4DZpkAjDGJIAY-/0/1762614463382?auto=format&fit=crop&q=80&w=480",
    };
    return (
      map[name] ||
      `https://placehold.co/80x80/94A3B8/0F172A?text=${encodeURIComponent(
        name?.charAt?.(0) || "?"
      )}&font=roboto`
    );
  };

  const avatar = useMemo(() => getAvatarUrl(review?.name), [review?.name]);

  const handleOpen = () => {
    const rect = cardRef.current?.getBoundingClientRect?.();
    // pass the actual DOM element so modal can return focus later
    onRequestOpen && onRequestOpen({ review, rect, sourceEl: cardRef.current });
  };

  const handleTouchStart = () => onHoverToggle && onHoverToggle(true);
  const handleTouchEnd = () => onHoverToggle && onHoverToggle(false);

  // small-screen detection & reduced-motion friendly behaviour (no heavy motion)
  const isSmall =
    typeof window !== "undefined" &&
    window.matchMedia &&
    window.matchMedia("(max-width: 640px)").matches;
  const prefersReducedMotion =
    typeof window !== "undefined" &&
    window.matchMedia &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  return (
    <div
      ref={cardRef}
      onMouseEnter={() => onHoverToggle && onHoverToggle(true)}
      onMouseLeave={() => onHoverToggle && onHoverToggle(false)}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      className={
        "relative w-72 sm:w-80 p-3 rounded-2xl overflow-hidden flex-shrink-0 " +
        "bg-slate-50/95 border border-slate-200/60 shadow-sm transition-transform duration-180"
      }
      style={{
        minWidth: "auto",
        willChange: "transform, opacity",
        transform: !isSmall && !prefersReducedMotion ? undefined : "none",
      }}
    >
      {/* subtle static texture (keeps visual depth) */}
      <div
        aria-hidden
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(closest-side at 14% 12%, rgba(255,255,255,0.6), transparent 8%), radial-gradient(closest-side at 86% 84%, rgba(0,0,0,0.02), transparent 10%)",
          mixBlendMode: "overlay",
          opacity: 0.85,
        }}
      />

      {/* subtle inner rim */}
      <div
        aria-hidden
        className="absolute inset-0 rounded-2xl pointer-events-none"
        style={{
          boxShadow: "inset 0 1px 0 rgba(255,255,255,0.6), inset 0 -6px 14px rgba(2,6,23,0.02)",
        }}
      />

      <div className="relative z-10 flex flex-col h-full">
        <div className="flex items-center gap-3">
          <img
            src={avatar}
            alt={review?.name || "User"}
            className="h-12 w-12 rounded-full object-cover shrink-0 ring-1 ring-slate-100"
            loading="lazy"
            onError={(e) => {
              e.target.src = `https://placehold.co/80x80/94A3B8/0F172A?text=${encodeURIComponent(
                review?.name?.charAt?.(0) || "?"
              )}&font=roboto`;
            }}
            decoding="async"
          />
          <div className="flex-1 min-w-0">
            <div className="text-sm font-semibold text-slate-900 truncate">{review?.name}</div>
            <div className="text-xs text-slate-500 truncate">{review?.role}</div>
          </div>
          <div className="ml-2 text-sm text-yellow-400 select-none" aria-hidden>
            {"★".repeat(Math.round(review?.rating || 5))}
          </div>
        </div>

        <p className="mt-3 text-sm text-slate-700 line-clamp-2">{review?.text}</p>

        <div className="mt-3 flex items-center justify-between gap-2">
          {/* Motion-enhanced View button */}
          <motion.button
            onClick={handleOpen}
            type="button"
            aria-label={`Open testimonial by ${review?.name}`}
            onHoverStart={() => setBtnHover(true)}
            onHoverEnd={() => setBtnHover(false)}
            whileHover={reduceMotion || isSmall ? {} : { scale: 1.028, y: -4 }}
            whileTap={reduceMotion ? {} : { scale: 0.985, y: 0 }}
            transition={{ type: "spring", stiffness: 400, damping: 30 }}
            className="relative inline-flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium
                       bg-gradient-to-b from-white to-slate-100 text-slate-900 shadow-[0_6px_18px_rgba(6,10,20,0.06)]
                       focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-300"
            style={{
              WebkitTapHighlightColor: "transparent",
            }}
          >
            <span className="text-xs md:text-sm select-none">View</span>

            {/* animated arrow: uses Framer Motion and responds to button hover (btnHover state) */}
            <motion.span
              aria-hidden
              initial={{ x: 0, opacity: 0.9 }}
              animate={btnHover && !reduceMotion ? { x: 6, opacity: 1 } : { x: 0, opacity: 0.9 }}
              transition={{ type: "tween", duration: 0.18, ease: "easeOut" }}
              className="flex items-center"
              style={{ display: "inline-flex" }}
            >
              <svg className="w-4 h-4 text-slate-700" viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </motion.span>

            {/* Micro-glow on hover: decorative, transform-only using Framer Motion via opacity */}
            <motion.span
              aria-hidden
              className="absolute inset-0 rounded-lg pointer-events-none"
              initial={{ opacity: 0 }}
              animate={btnHover && !reduceMotion ? { opacity: 1 } : { opacity: 0 }}
              transition={{ duration: 0.24 }}
              style={{
                background: "radial-gradient(closest-side, rgba(99,102,241,0.08), rgba(99,102,241,0) 60%)",
                mixBlendMode: "screen",
              }}
            />
          </motion.button>

          <div className="text-xs text-slate-500 hidden sm:block">({review?.rating || 5})</div>
        </div>
      </div>
    </div>
  );
}
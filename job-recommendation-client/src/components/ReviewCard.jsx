import React, { useRef, useMemo } from "react";

/**
 * ReviewCard — lightweight responsive card
 * - Exposes onRequestOpen({ review, rect, sourceEl }) for transform-only modal animation
 * - Minimal internal motion (no heavy effects on mobile / reduced-motion)
 */
export default function ReviewCard({
  review,
  onHoverToggle,
  onRequestOpen,
}) {
  const cardRef = useRef(null);

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
      `https://placehold.co/80x80/EDF2FF/0F172A?text=${encodeURIComponent(
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
        "bg-white/6 border border-white/8 shadow-sm transition-transform"
      }
      style={{
        minWidth: "auto",
        willChange: "transform, opacity",
        transform: !isSmall && !prefersReducedMotion ? undefined : "none",
      }}
    >
      {/* subtle static texture */}
      <div
        aria-hidden
        className="absolute inset-0 pointer-events-none opacity-30"
        style={{
          background:
            "radial-gradient(closest-side at 12% 12%, rgba(255,255,255,0.025), transparent 8%), radial-gradient(closest-side at 88% 80%, rgba(255,255,255,0.015), transparent 10%)",
          mixBlendMode: "overlay",
        }}
      />

      <div className="relative z-10 flex flex-col h-full">
        <div className="flex items-center gap-3">
          <img
            src={avatar}
            alt={review?.name || "User"}
            className="h-12 w-12 rounded-full object-cover shrink-0 ring-1 ring-white/20"
            loading="lazy"
            onError={(e) => {
              e.target.src = `https://placehold.co/80x80/EDF2FF/0F172A?text=${encodeURIComponent(
                review?.name?.charAt?.(0) || "?"
              )}&font=roboto`;
            }}
            decoding="async"
          />
          <div className="flex-1 min-w-0">
            <div className="text-sm font-semibold text-slate-900 truncate">{review?.name}</div>
            <div className="text-xs text-slate-500 truncate">{review?.role}</div>
          </div>
          <div className="ml-2 text-sm text-yellow-400 select-none">
            {"★".repeat(Math.round(review?.rating || 5))}
          </div>
        </div>

        <p className="mt-3 text-sm text-slate-700 line-clamp-2">{review?.text}</p>

        <div className="mt-3 flex items-center justify-between gap-2">
          <button
            onClick={handleOpen}
            className="group inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-white/90 text-slate-900 text-sm font-medium shadow-sm"
            aria-label={`Open testimonial by ${review?.name}`}
            type="button"
          >
            <span className="text-xs md:text-sm">View</span>
            <svg className="w-4 h-4 text-slate-700" viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden>
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </button>

          <div className="text-xs text-slate-500 hidden sm:block">({review?.rating || 5})</div>
        </div>
      </div>
    </div>
  );
}
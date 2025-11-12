import React, { useEffect, useRef, useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";

/**
 * Navbar.jsx
 * - Glassmorphism-style responsive navbar with smooth hover and mobile collapse
 * - Uses a refs-based maxHeight animation for the mobile menu to avoid layout "jumps"
 * - Accessible: aria-controls, aria-expanded, keyboard focus styles
 * - Keeps transform-only hover effects for smooth GPU-accelerated animation
 */
export default function Navbar() {
  const [open, setOpen] = useState(false);
  const location = useLocation();
  const mobileRef = useRef(null);
  const mobileInnerRef = useRef(null);

  useEffect(() => {
    // Close mobile menu when route changes
    setOpen(false);
  }, [location.pathname]);

  // Animate mobile menu height to its scrollHeight (smooth, avoids fixed max-h hacks)
  useEffect(() => {
    const el = mobileRef.current;
    const inner = mobileInnerRef.current;
    if (!el || !inner) return;

    if (open) {
      // set to exact height so CSS transition animates smoothly
      el.style.maxHeight = `${inner.scrollHeight}px`;
      el.style.opacity = "1";
      el.style.pointerEvents = "auto";
    } else {
      el.style.maxHeight = `0px`;
      el.style.opacity = "0";
      el.style.pointerEvents = "none";
    }
  }, [open]);

  const navItems = [
    { to: "/", label: "Home" },
    { to: "/jobs", label: "Jobs" },
    { to: "/companies", label: "Companies" },
    { to: "/about", label: "About" },
  ];

  const baseLinkClass = "text-sm px-3 py-1 rounded-md transition-colors duration-200 nav-float focus-ring";
  const inactiveClass = "text-slate-700 hover:text-indigo-600";
  const activeClass = "text-indigo-600 font-semibold";

  return (
    <header className="navbar-glass fixed inset-x-3 top-4 z-50 flex justify-center pointer-events-auto">
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <Link to="/" className="flex items-center gap-3">
              <div
                className="flex items-center justify-center h-10 w-10 rounded-lg logo-anim text-white font-semibold shadow"
                aria-hidden="true"
              >
                Z
              </div>

              <div className="hidden sm:flex flex-col leading-tight">
                <span className="text-lg font-semibold tracking-tight text-slate-900">ZenVue</span>
                <span className="text-xs text-slate-500 -mt-0.5">Job Portal</span>
              </div>
            </Link>
          </div>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-6" aria-label="Main navigation">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.to === "/"}
                className={({ isActive }) =>
                  `${baseLinkClass} nav-underline ${isActive ? `${activeClass}` : inactiveClass}`
                }
                aria-current={({ isActive }) => (isActive ? "page" : undefined)}
              >
                {item.label}
              </NavLink>
            ))}
          </nav>

          {/* Actions + mobile menu button */}
          <div className="flex items-center gap-3">
            <div className="hidden md:flex items-center gap-3">
              <Link
                to="/post-job"
                className="text-sm px-3 py-2 rounded-md bg-gradient-to-r from-indigo-600 to-blue-600 text-white shadow hover:opacity-95 btn-press focus-ring"
                aria-label="Post a job"
              >
                Post a Job
              </Link>

              <NavLink
                to="/login"
                className={({ isActive }) =>
                  `text-sm px-3 py-2 rounded-md ${isActive ? activeClass : inactiveClass} focus-ring`
                }
              >
                Sign in
              </NavLink>

              <NavLink
                to="/register"
                className={({ isActive }) =>
                  `text-sm px-3 py-2 rounded-md border ${isActive ? "border-indigo-600 " + activeClass : "border-gray-200 " + inactiveClass} focus-ring`
                }
              >
                Register
              </NavLink>
            </div>

            {/* Mobile menu button */}
            <button
              onClick={() => setOpen((v) => !v)}
              aria-controls="mobile-menu"
              aria-expanded={open}
              className="inline-flex items-center justify-center p-2 rounded-md text-slate-700 md:hidden hover:bg-slate-100 transition-transform transform focus-ring"
              aria-label="Toggle menu"
              title="Toggle menu"
            >
              <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden="true">
                <g className={`hamburger-rotate ${open ? "open" : ""}`}>
                  {open ? (
                    <path strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  ) : (
                    <path strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
                  )}
                </g>
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile menu (animated height + fade) */}
        <div
          id="mobile-menu"
          ref={mobileRef}
          className="md:hidden overflow-hidden transition-[max-height,opacity] duration-300 ease-[cubic-bezier(.2,.9,.3,1)]"
          style={{ maxHeight: 0, opacity: 0, pointerEvents: "none" }}
        >
          <div ref={mobileInnerRef} className="px-4 py-4 flex flex-col gap-3 bg-white/90 rounded-b-2xl mt-3 border border-slate-100 shadow-sm">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.to === "/"}
                className={({ isActive }) =>
                  `py-3 text-base rounded-md ${isActive ? "font-semibold text-indigo-600" : "text-slate-700 hover:text-indigo-600"}`
                }
              >
                {item.label}
              </NavLink>
            ))}

            <div className="mt-2">
              <Link to="/post-job" className="block w-full text-center px-4 py-2 bg-indigo-600 text-white rounded-md btn-press">
                Post a Job
              </Link>
            </div>

            <div className="flex gap-2 mt-3">
              <Link to="/login" className="flex-1 text-center px-4 py-2 border rounded text-sm text-slate-700">
                Sign in
              </Link>
              <Link to="/register" className="flex-1 text-center px-4 py-2 bg-indigo-600 text-white rounded text-sm">
                Register
              </Link>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
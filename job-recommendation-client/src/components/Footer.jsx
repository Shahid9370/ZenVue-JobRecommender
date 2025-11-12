import React from "react";
import { Link } from "react-router-dom";
import { companyLogoFor } from "../utils/images";

/**
 * Enhanced Footer UI:
 * - Uses improved layout, CTA, contact card, social icons and micro-animations.
 * - Pure React + Tailwind classes with the helper CSS in src/index.css.
 */

export default function Footer() {
  const logo = companyLogoFor("ZenVue");
  const year = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
        <div className="footer-grid">
          {/* Brand + short */}
          <div className="footer-col">
            <Link to="/" className="flex items-center gap-3 mb-4">
              <img src={logo} alt="ZenVue logo" className="h-12 w-12 rounded-lg object-cover" />
              <div>
                <div className="text-lg font-semibold text-gray-900">ZenVue</div>
                <div className="text-sm text-gray-500">Job Portal</div>
              </div>
            </Link>
            <p className="text-sm text-gray-600 max-w-md">
              ZenVue is a modern job portal demo — find talent or your next role. Built with React + Tailwind.
            </p>

            <div className="mt-4 flex items-center gap-3">
              <span className="pill">Trusted</span>
              <span className="text-xs text-gray-400">•</span>
              <span className="text-sm text-gray-500">1000+ jobs posted</span>
            </div>
          </div>

          {/* Product links */}
          <div className="footer-col">
            <h4 className="text-sm font-semibold text-gray-700 mb-3">Product</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/jobs" className="footer-link">Browse jobs</Link></li>
              <li><Link to="/post-job" className="footer-link">Post a job</Link></li>
              <li><Link to="/resume-builder" className="footer-link">Resume builder</Link></li>
            </ul>
          </div>

          {/* Company & resources */}
          <div className="footer-col">
            <h4 className="text-sm font-semibold text-gray-700 mb-3">Company</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/about" className="footer-link">About us</Link></li>
              <li><Link to="/careers" className="footer-link">Careers</Link></li>
              <li><Link to="/contact" className="footer-link">Contact</Link></li>
              <li><a href="/blog" className="footer-link">Blog</a></li>
            </ul>
          </div>

          {/* CTA + contact card */}
          <div className="footer-col">
            <div className="footer-cta card-hover">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h5 className="text-lg font-semibold text-gray-900">Hire or get hired</h5>
                  <p className="text-sm text-gray-600 mt-1">Create a free account and start applying to jobs or posting roles today.</p>
                </div>

                <img src={logo} alt="ZenVue" className="hidden sm:block h-12 w-12 rounded-md object-cover" />
              </div>

              <div className="mt-4 flex gap-3">
                <Link to="/register" className="px-4 py-2 rounded-md bg-indigo-600 text-white text-sm btn-press">Get started</Link>
                <Link to="/jobs" className="px-4 py-2 rounded-md border border-gray-200 text-sm">Browse jobs</Link>
              </div>

              <div className="mt-4 border-t pt-4 flex items-center gap-3">
                <svg className="w-5 h-5 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" d="M3 8l7-5 7 5v8a2 2 0 01-2 2H5a2 2 0 01-2-2V8z"/></svg>

                <div>
                  <div className="text-xs text-gray-500">Support</div>
                  <a href="mailto:support@ZenVue.com" className="text-sm text-gray-700">support@ZenVue.com</a>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="footer-legal mt-8 text-sm text-gray-500">
          <div>© {year} ZenVue. All rights reserved.</div>

          <div className="flex items-center gap-4">
            <a href="mailto:support@ZenVue.com" className="footer-link">support@ZenVue.com</a>

            <div className="flex items-center gap-3">
              <a href="https://twitter.com" target="_blank" rel="noreferrer" className="social-icon" aria-label="Twitter">
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M23 3a10.9 10.9 0 01-3.14 1.53A4.48 4.48 0 0016.5 3c-2.5 0-4.5 2.24-4.5 4.99 0 .39.04.77.12 1.13A12.94 12.94 0 013 4.9a4.93 4.93 0 00-.61 2.51c0 1.73.8 3.25 2.02 4.15a4.48 4.48 0 01-2.05-.58v.06c0 2.37 1.7 4.35 3.95 4.8-.41.12-.85.18-1.3.18-.32 0-.63-.03-.93-.09.64 2.07 2.48 3.58 4.67 3.63A9 9 0 010 19.54 12.7 12.7 0 006.88 22c8.26 0 12.78-7.2 12.78-13.44 0-.2 0-.39-.02-.58A9.22 9.22 0 0023 3z"/></svg>
              </a>

              <a href="https://www.linkedin.com" target="_blank" rel="noreferrer" className="social-icon" aria-label="LinkedIn">
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M4.98 3.5C4.98 4.88 3.87 6 2.5 6S0 4.88 0 3.5 1.12 1 2.5 1s2.48 1.12 2.48 2.5zM.22 8h4.56V24H.22V8zM8.98 8h4.37v2.16h.06c.61-1.15 2.1-2.36 4.33-2.36 4.63 0 5.48 3.04 5.48 6.98V24H19.6v-7.56c0-1.8-.03-4.12-2.51-4.12-2.51 0-2.89 1.96-2.89 3.99V24H8.98V8z"/></svg>
              </a>

              <a href="https://github.com" target="_blank" rel="noreferrer" className="social-icon" aria-label="GitHub">
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M12 .5C5.73.5.75 5.48.75 11.77c0 4.86 3.14 8.98 7.5 10.44.55.1.75-.24.75-.53v-1.86c-3.04.66-3.68-1.45-3.68-1.45-.5-1.27-1.22-1.61-1.22-1.61-.99-.68.08-.66.08-.66 1.1.08 1.68 1.14 1.68 1.14.98 1.66 2.56 1.18 3.18.9.1-.71.38-1.18.69-1.45-2.42-.28-4.97-1.22-4.97-5.43 0-1.2.43-2.17 1.14-2.93-.12-.28-.5-1.4.11-2.92 0 0 .96-.31 3.14 1.12.91-.26 1.9-.39 2.88-.39.98 0 1.97.13 2.88.39 2.18-1.44 3.14-1.12 3.14-1.12.61 1.52.23 2.64.11 2.92.71.76 1.14 1.73 1.14 2.93 0 4.22-2.56 5.14-4.99 5.42.39.34.74 1.02.74 2.06v3.05c0 .29.19.63.76.52 4.36-1.47 7.5-5.59 7.5-10.44C23.25 5.48 18.27.5 12 .5z"/></svg>
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
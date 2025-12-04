import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion"; // eslint-disable-line no-unused-vars
import { AuthContext } from "../context/AuthContext";

/**
 * Register.jsx
 * - Modern, minimal Sign-Up page using TailwindCSS + Framer Motion
 * - Centered glassmorphic card with gradient border, animated background blobs
 * - Floating labels, input focus glow, gradient CTA with loading spinner
 * Usage: drop into src/pages/Register.jsx (replaces existing Register component).
 * Ensure the accompanying scoped CSS (src/index.css) is added so animations & styles are applied.
 */

export default function Register() {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    if (!form.name.trim() || !form.email.trim() || !form.password.trim()) {
      setError("Please fill out all fields.");
      return;
    }

    try {
      setLoading(true);
      // demo: simply "register" by logging in via context (replace with real API call)
      await login({ email: form.email, name: form.name });
      navigate("/", { replace: true });
    } catch (err) {
      console.error(err);
      setError("Registration failed. Try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="register-page min-h-screen flex items-center justify-center relative overflow-hidden bg-gradient-to-b from-white via-sky-50 to-indigo-50 px-4 py-12">
      {/* Animated background blobs (decorative) */}
      <motion.div
        aria-hidden="true"
        initial={{ opacity: 0.7, x: 0, y: 0 }}
        animate={{ x: [-8, 8, -8], y: [0, -6, 0] }}
        transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
        className="absolute -left-24 -top-24 w-96 h-96 rounded-full blur-3xl bg-gradient-to-br from-[#4f46e5]/40 via-[#7c3aed]/28 to-[#06b6d4]/12 pointer-events-none"
      />
      <motion.div
        aria-hidden="true"
        initial={{ opacity: 0.6, x: 0, y: 0 }}
        animate={{ x: [10, -10, 10], y: [0, 8, 0] }}
        transition={{ duration: 22, repeat: Infinity, ease: "easeInOut" }}
        className="absolute -right-28 -bottom-20 w-80 h-80 rounded-full blur-3xl bg-gradient-to-br from-[#7c3aed]/36 via-[#ec4899]/20 to-[#2563eb]/10 pointer-events-none"
      />

      {/* Centered animated card */}
      <motion.div
        initial={{ opacity: 0, y: 18, scale: 0.995 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="relative z-10 w-full max-w-lg"
      >
        <div className="register-gradient-border rounded-2xl p-[2px]">
          <div className="bg-white/90 backdrop-blur-md rounded-2xl shadow-lg border border-gray-100 p-6">
            <header className="mb-4 text-center">
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">Create your ZenView account</h1>
              <p className="mt-1 text-sm text-slate-600">Join the AI-assisted hiring platform — apply faster, smarter.</p>
            </header>

            {error && (
              <div role="alert" aria-live="assertive" className="mb-4 rounded-md bg-red-50 text-red-700 px-3 py-2 text-sm">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4" noValidate>
              {/* Name */}
              <div className="relative">
                <div className="register-input input-float rounded-lg">
                  <input
                    id="name"
                    name="name"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    placeholder=" "
                    className="w-full bg-transparent border-none px-3 py-3 text-sm placeholder:text-transparent focus:outline-none"
                    aria-label="Full name"
                    required
                  />
                  <label htmlFor="name" className={`floating-label ${form.name ? "has-value" : ""}`}>
                    Full name
                  </label>
                </div>
              </div>

              {/* Email */}
              <div className="relative">
                <div className="register-input input-float rounded-lg">
                  <input
                    id="email"
                    name="email"
                    type="email"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    placeholder=" "
                    className="w-full bg-transparent border-none px-3 py-3 text-sm placeholder:text-transparent focus:outline-none"
                    aria-label="Email address"
                    required
                  />
                  <label htmlFor="email" className={`floating-label ${form.email ? "has-value" : ""}`}>
                    Email address
                  </label>
                </div>
              </div>

              {/* Password */}
              <div className="relative">
                <div className="register-input input-float rounded-lg">
                  <input
                    id="password"
                    name="password"
                    type="password"
                    value={form.password}
                    onChange={(e) => setForm({ ...form, password: e.target.value })}
                    placeholder=" "
                    className="w-full bg-transparent border-none px-3 py-3 text-sm placeholder:text-transparent focus:outline-none"
                    aria-label="Create a password"
                    required
                  />
                  <label htmlFor="password" className={`floating-label ${form.password ? "has-value" : ""}`}>
                    Create a password
                  </label>
                </div>
              </div>

              <div className="flex items-center justify-between text-sm">
                <label className="inline-flex items-center gap-2 text-slate-600">
                  <input type="checkbox" className="h-4 w-4 rounded border-gray-300 text-[#4f46e5] focus:ring-[#7c3aed]" />
                  <span>Subscribe to product updates</span>
                </label>
                <a href="/terms" className="text-xs text-slate-500 hover:underline">Terms</a>
              </div>

              <div>
                <motion.button
                  whileTap={{ scale: 0.985 }}
                  type="submit"
                  disabled={loading}
                  aria-busy={loading}
                  className={`w-full inline-flex items-center justify-center gap-2 rounded-lg px-4 py-2 text-sm font-medium text-white ${
                    loading ? "bg-gradient-to-r from-[#9AA8FF] to-[#C99CF3] cursor-wait" : "bg-gradient-to-r from-[#4f46e5] via-[#7c3aed] to-[#06b6d4] hover:scale-[1.01]"
                  } shadow-md`}
                >
                  {loading ? (
                    <>
                      <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden>
                        <circle cx="12" cy="12" r="10" strokeWidth="3" strokeOpacity="0.2" />
                        <path d="M22 12a10 10 0 00-10-10" strokeWidth="3" strokeLinecap="round" />
                      </svg>
                      Creating...
                    </>
                  ) : (
                    "Create account"
                  )}
                </motion.button>
              </div>
            </form>

            <p className="mt-4 text-center text-sm text-slate-600">
              Already have an account?{" "}
              <a href="/login" className="text-[#4f46e5] font-medium hover:underline">
                Sign in
              </a>
            </p>
          </div>
        </div>

        <p className="mt-6 text-center text-xs text-slate-400">
          By creating an account you agree to our <a href="/privacy" className="underline">Privacy Policy</a>.
        </p>
      </motion.div>
    </div>
  );
}

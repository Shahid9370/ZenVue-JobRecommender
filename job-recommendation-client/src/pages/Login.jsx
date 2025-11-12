import React, { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { AuthContext } from "../context/AuthContext";

/**
 * Login page — modern, minimal, AI-inspired design
 * - Glassmorphism card with gradient border
 * - Animated background blobs (motion)
 * - Input focus glow + gradient border wrapper
 * - Accessible, responsive, with loading spinner
 *
 * Drop this file into src/pages/Login.jsx (replace the previous one).
 */

export default function Login() {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    if (!form.email.trim() || !form.password.trim()) {
      setError("Please provide both email and password.");
      return;
    }

    try {
      setLoading(true);
      // call auth context (demo) — replace with real auth call
      await login({ email: form.email, name: "User" });
      navigate("/", { replace: true });
    } catch (err) {
      console.error(err);
      setError("Failed to sign in. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center relative bg-gradient-to-b from-white via-sky-50 to-indigo-50 overflow-hidden">
      {/* Animated decorative blobs (purely visual) */}
      <motion.div
        className="absolute -left-32 -top-28 w-96 h-96 rounded-full bg-gradient-to-br from-blue-200/50 via-indigo-200/30 to-purple-200/20 blur-3xl pointer-events-none"
        animate={{ x: [0, -12, 0], y: [0, 6, 0] }}
        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
        aria-hidden
      />
      <motion.div
        className="absolute -right-28 -bottom-24 w-80 h-80 rounded-full bg-gradient-to-br from-purple-200/40 via-pink-200/20 to-blue-100/10 blur-3xl pointer-events-none"
        animate={{ x: [0, 10, 0], y: [0, -8, 0] }}
        transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }}
        aria-hidden
      />

      {/* Center card */}
      <div className="relative z-10 w-full max-w-md px-6">
        <div className="login-gradient-border rounded-2xl p-[2px]">
          <div className="bg-white/90 backdrop-blur-md rounded-2xl shadow-md border border-gray-100 p-6">
            <header className="mb-5 text-center">
              <h1 className="text-2xl font-extrabold text-slate-900">Sign in to ZenView</h1>
              <p className="mt-1 text-sm text-slate-600">Secure access to your AI-driven job dashboard</p>
            </header>

            {error && (
              <div
                role="alert"
                aria-live="assertive"
                className="mb-4 rounded-md bg-red-50 text-red-700 px-3 py-2 text-sm"
              >
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-slate-700">
                  Email
                </label>
                <div className="mt-2">
                  <div className="login-input-glow rounded-lg">
                    <input
                      id="email"
                      type="email"
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      className="w-full bg-transparent border-none px-3 py-3 text-sm placeholder:text-slate-400 focus:outline-none"
                      placeholder="you@company.com"
                      required
                    />
                  </div>
                </div>
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-slate-700">
                  Password
                </label>
                <div className="mt-2">
                  <div className="login-input-glow rounded-lg">
                    <input
                      id="password"
                      type="password"
                      value={form.password}
                      onChange={(e) => setForm({ ...form, password: e.target.value })}
                      className="w-full bg-transparent border-none px-3 py-3 text-sm placeholder:text-slate-400 focus:outline-none"
                      placeholder="Enter your password"
                      required
                    />
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between text-sm">
                <label className="inline-flex items-center gap-2 text-slate-600">
                  <input type="checkbox" className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-400" />
                  <span>Remember me</span>
                </label>
                <Link to="/contact" className="text-sm login-link hover:underline text-blue-600">
                  Need help?
                </Link>
              </div>

              <div>
                <motion.button
                  whileTap={{ scale: 0.985 }}
                  type="submit"
                  disabled={loading}
                  className={`w-full inline-flex items-center justify-center gap-2 rounded-lg px-4 py-2 text-sm font-medium text-white ${
                    loading ? "bg-gradient-to-r from-blue-400 to-purple-400 cursor-wait" : "bg-gradient-to-r from-[#4f46e5] via-[#7c3aed] to-[#06b6d4] hover:scale-[1.01]"
                  } shadow-md`}
                >
                  {loading ? (
                    <>
                      <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden>
                        <circle cx="12" cy="12" r="10" strokeWidth="3" strokeOpacity="0.2" />
                        <path d="M22 12a10 10 0 00-10-10" strokeWidth="3" strokeLinecap="round" />
                      </svg>
                      Signing in...
                    </>
                  ) : (
                    "Sign in"
                  )}
                </motion.button>
              </div>
            </form>

            <p className="mt-5 text-center text-sm text-slate-600">
              Don't have an account?{" "}
              <Link to="/register" className="text-[#4f46e5] font-medium hover:underline">
                Create one
              </Link>
            </p>
          </div>
        </div>

        {/* subtle footer text */}
        <div className="mt-6 text-center text-xs text-slate-400">
          By signing in you agree to our <Link to="/terms" className="underline">Terms</Link> and{" "}
          <Link to="/privacy" className="underline">Privacy policy</Link>.
        </div>
      </div>
    </div>
  );
}
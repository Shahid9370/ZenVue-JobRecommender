import React from "react";
import HeroSection from "../components/HeroSection";
import FeaturedJobs from "../components/FeaturedJobs";
import Categories from "../components/Categories";
import Testimonials from "../components/Testimonials";
import { featuredJobs } from "../utils/constants";

/**
 * Home page — updated look for a premium AI-inspired job portal.
 * - Uses gradient + glass hero (HeroSection handles the main search highlight)
 * - Feature cards have micro-animations and scale/fade effects
 * - Rest of the page reuses existing components but styled consistently
 */

function FeatureCard({ title, desc, icon }) {
  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-5 shadow-md transform transition will-change-transform hover:-translate-y-1 hover:shadow-xl feature-animate">
      <div className="flex items-start gap-4">
        <div className="flex-shrink-0 h-12 w-12 rounded-lg bg-gradient-to-br from-blue-50 to-purple-50 text-blue-600 flex items-center justify-center">
          {icon}
        </div>
        <div>
          <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
          <p className="mt-1 text-sm text-gray-600">{desc}</p>
        </div>
      </div>
    </div>
  );
}

export default function Home() {
  const companies = Array.from(new Set((featuredJobs || []).map((j) => j.company))).slice(0, 6);

  return (
    <div className="home-page bg-hero-gradient min-h-screen text-slate-900">
      <div className="max-w-7xl mx-auto px-4 py-8 sm:py-12 lg:py-16">
        {/* Hero */}
        <HeroSection />

        {/* Quick features (AI-ish cards) */}
        <section className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-6">
          <FeatureCard
            title="AI-powered matching"
            desc="Smart filters, semantic search and prioritized matches based on your profile."
            icon={
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3" />
              </svg>
            }
          />
          <FeatureCard
            title="Deep company insights"
            desc="See ratings, pay range signals and cultural fit before you apply."
            icon={
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M3 7h18M5 7v14h14V7" />
              </svg>
            }
          />
          <FeatureCard
            title="Fast apply flow"
            desc="One-click apply with your saved resume and profile — fast, secure, and trackable."
            icon={
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            }
          />
        </section>

        {/* Featured Jobs */}
        <section className="mt-10">
          <h2 className="text-xl font-semibold mb-4">Featured jobs</h2>
          <FeaturedJobs />
        </section>

        {/* Categories */}
        <section className="mt-10">
          <Categories />
        </section>

        {/* Companies hiring (simple list) */}
        <section className="mt-12 bg-white/70 border border-gray-100 rounded-2xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Companies hiring</h3>
            <a href="/jobs" className="text-sm text-blue-600 hover:underline">See all jobs</a>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
            {companies.length === 0 ? (
              <div className="text-sm text-gray-500 col-span-full">No companies listed yet.</div>
            ) : (
              companies.map((c) => (
                <div key={c} className="bg-white/60 rounded-md p-3 text-sm text-gray-700 text-center glass-card">
                  {c}
                </div>
              ))
            )}
          </div>
        </section>

        {/* Testimonials */}
        <section className="mt-10">
          <Testimonials />
        </section>

        {/* CTA */}
        <section className="mt-12 mb-8">
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-2xl p-8 text-center shadow-xl cta-glow">
            <h4 className="text-2xl font-semibold">Ready to upgrade your career with AI?</h4>
            <p className="mt-2 text-white/90">Create a profile and let ZenVue surface the roles that fit you best.</p>
            <div className="mt-4 flex flex-col sm:flex-row justify-center gap-3">
              <a href="/register" className="px-5 py-3 bg-white text-blue-700 rounded-md font-medium inline-block hover:shadow-lg transition btn-gradient">
                Get started
              </a>
              <a href="/jobs" className="px-5 py-3 border border-white/30 rounded-md text-white inline-block hover:bg-white/10 transition">
                Browse jobs
              </a>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
import React from "react";
import { HERO_ILLUSTRATION, testimonialAvatarFor, imageForPath } from "../utils/images";

/*
  About.jsx
  - Modern, professional About page for ZenVue.
  - Two-column top section (left: copy + info cards, right: photo).
  - Team grid with 6 member cards, stats row, and CTA banner.
  - Uses helper functions imageForPath and testimonialAvatarFor from utils/images.
*/

const values = [
  {
    title: "Mission",
    text: "Help job seekers find meaningful work and help companies hire exceptional talent.",
  },
  {
    title: "Vision",
    text: "Be the most developer-friendly and trusted job platform in the region.",
  },
  {
    title: "Values",
    text: "Empathy, transparency, speed, and developer-first UX.",
  },
];

const team = [
  { name: "Aisha Khan", role: "Frontend Engineer" },
  { name: "David Lee", role: "Product Manager" },
  { name: "Sophia Patel", role: "Design Lead" },
  { name: "Ravi Kulkarni", role: "Full Stack Developer" },
  { name: "Shahid Shaikh", role: "Founder & CTO" },
  { name: "Neha Chopra", role: "Growth Marketer" },
];

function getAvatarUrl(name) {
  const map = {
    "Aisha Khan":
      "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=400&q=80",
    "David Lee":
      "https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=400&h=400&fit=crop",
    "Sophia Patel":
      "https://images.unsplash.com/photo-1545996124-1c4b5d3f2b70?auto=format&fit=crop&w=400&q=80",
    "Ravi Kulkarni":
      "https://images.pexels.com/photos/2379005/pexels-photo-2379005.jpeg?auto=compress&cs=tinysrgb&w=400&h=400&fit=crop",
    "Shahid Shaikh":
      "https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg?auto=compress&cs=tinysrgb&w=400&h=400&fit=crop",
    "Neha Chopra":
      "https://images.unsplash.com/photo-1541233349642-6e425fe6190e?auto=format&fit=crop&w=400&q=80",
  };

  return map[name] || testimonialAvatarFor(name);
}

export default function About() {
  const heroSrc = imageForPath(HERO_ILLUSTRATION);

  return (
    <main className="bg-gradient-to-b from-white to-[#EEF2FF] min-h-screen text-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-20">
        {/* TOP: Intro + Illustration */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
          <div className="space-y-6">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold leading-tight">
              About ZenVue
            </h1>

            <p className="text-lg text-gray-600 max-w-xl">
              We connect talented people with great companies. ZenVue focuses on clarity, speed, and trust — making
              the job search and hiring process pleasant and efficient for everyone.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {values.map((v) => (
                <div
                  key={v.title}
                  className="info-card bg-white border border-gray-100 rounded-xl p-4 shadow-sm hover:shadow-md transition card-hover"
                >
                  <h3 className="text-sm font-semibold text-gray-900">{v.title}</h3>
                  <p className="mt-2 text-sm text-gray-600">{v.text}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-center">
            <figure className="photo-card w-full max-w-md rounded-2xl overflow-hidden shadow-2xl">
              <img
                src={heroSrc}
                alt="Diverse professionals collaborating in a modern office around a laptop"
                className="w-full h-full object-cover aspect-[16/10]"
                loading="lazy"
                onError={(e) => {
                  e.target.src =
                    "https://placehold.co/1600x1000/EEF2FF/111827?text=ZenVue+Team&font=roboto";
                }}
              />
              <figcaption className="p-4 bg-gradient-to-t from-white/80 to-transparent">
                <div className="text-sm text-gray-600">Team collaboration</div>
              </figcaption>
            </figure>
          </div>
        </section>

        {/* TEAM */}
        <section className="mt-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-semibold">Meet the team</h2>
            <div className="text-sm text-gray-500 hidden sm:block">Based in Pune, Mumbai, Bengaluru and remote</div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {team.map((m) => {
              const avatar = getAvatarUrl(m.name);
              return (
                <article
                  key={m.name}
                  className="team-card bg-white border border-gray-100 rounded-2xl p-4 flex items-center gap-4 hover:translate-y-[-4px] transition card-hover"
                  aria-label={`${m.name}, ${m.role}`}
                >
                  <img
                    src={avatar}
                    alt={m.name}
                    className="h-16 w-16 rounded-full object-cover flex-shrink-0 shadow-sm"
                    loading="lazy"
                    onError={(e) => {
                      e.target.src = testimonialAvatarFor(m.name);
                    }}
                  />

                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-gray-900 truncate">{m.name}</div>
                    <div className="text-sm text-gray-500 truncate">{m.role}</div>

                    <div className="mt-2 flex items-center gap-2">
                      <span className="inline-flex items-center px-2 py-0.5 rounded-md text-xs bg-green-50 text-green-700">Remote</span>
                      <span className="text-xs text-gray-400">•</span>
                      <span className="text-xs text-gray-400">5+ yrs exp</span>
                    </div>
                  </div>

                  <div className="hidden sm:block">
                    <a
                      href="#"
                      className="text-sm px-3 py-1 rounded-md bg-indigo-50 text-indigo-600 border border-indigo-100 hover:bg-indigo-100 transition"
                      aria-label={`View profile of ${m.name}`}
                    >
                      View
                    </a>
                  </div>
                </article>
              );
            })}
          </div>
        </section>

        {/* STATS */}
        <section className="mt-10 grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="stat-card bg-white border border-gray-100 rounded-xl p-6 text-center shadow-sm card-hover">
            <div className="text-2xl font-bold text-indigo-600">1,200+</div>
            <div className="text-sm text-gray-500 mt-1">Jobs posted</div>
          </div>

          <div className="stat-card bg-white border border-gray-100 rounded-xl p-6 text-center shadow-sm card-hover">
            <div className="text-2xl font-bold text-indigo-600">850+</div>
            <div className="text-sm text-gray-500 mt-1">Companies hiring</div>
          </div>

          <div className="stat-card bg-white border border-gray-100 rounded-xl p-6 text-center shadow-sm card-hover">
            <div className="text-2xl font-bold text-indigo-600">95%</div>
            <div className="text-sm text-gray-500 mt-1">Candidate satisfaction</div>
          </div>
        </section>

        {/* CTA */}
        <section className="mt-12">
          <div className="cta-banner rounded-2xl p-8 text-center text-white shadow-xl overflow-hidden">
            <h3 className="text-xl font-semibold">Join our community of seekers and hirers</h3>
            <p className="mt-2 text-sm text-white/90 max-w-2xl mx-auto">
              Create a profile, upload your resume, and get discovered by top companies. ZenVue helps match talent to
              the right roles with clarity and speed.
            </p>

            <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-3">
              <a
                href="/register"
                className="px-6 py-3 rounded-lg bg-white text-indigo-700 font-semibold shadow-sm hover:opacity-95 btn-press"
              >
                Get started
              </a>
              <a
                href="/jobs"
                className="px-6 py-3 rounded-lg border border-white/40 text-white hover:bg-white/10"
              >
                Browse jobs
              </a>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
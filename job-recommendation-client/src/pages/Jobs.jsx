import React, { useMemo, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import JobCard from "../components/JobCard";
import { jobs as allJobs, categories as allCategories } from "../utils/constants";

/**
 * Jobs page — updated visual + UX:
 * - Sticky clean filter sidebar with search, category/type/sort controls
 * - Quick category chips
 * - Responsive job grid with hover lift animation
 * - Clear header with results count
 * - Polished empty state with subtle illustration
 *
 * Replace your existing src/pages/Jobs.jsx with this file.
 */

export default function Jobs() {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialQ = searchParams.get("search") || "";
  const initialCategory = searchParams.get("category") || "";
  const [query, setQuery] = useState(initialQ);
  const [category, setCategory] = useState(initialCategory);
  const [type, setType] = useState(searchParams.get("type") || "");
  const [sort, setSort] = useState(searchParams.get("sort") || "newest");

  const filtered = useMemo(() => {
    let list = allJobs.slice();

    if (query) {
      const ql = query.toLowerCase();
      list = list.filter(
        (j) =>
          j.title.toLowerCase().includes(ql) ||
          j.company.toLowerCase().includes(ql) ||
          (j.tags || []).some((t) => t.toLowerCase().includes(ql))
      );
    }

    if (category) {
      list = list.filter((j) => j.category === category);
    }

    if (type) {
      list = list.filter((j) => j.type === type);
    }

    if (sort === "salary") {
      list.sort((a, b) => (b.salaryNum || 0) - (a.salaryNum || 0));
    } else {
      list.sort((a, b) => (b.postedAt || 0) - (a.postedAt || 0));
    }

    return list;
  }, [query, category, type, sort]);

  function applyFiltersToUrl() {
    const params = new URLSearchParams();
    if (query) params.set("search", query);
    if (category) params.set("category", category);
    if (type) params.set("type", type);
    if (sort) params.set("sort", sort);
    setSearchParams(params);
  }

  function clearFilters() {
    setQuery("");
    setCategory("");
    setType("");
    setSort("newest");
    setSearchParams({});
  }

  // Quick categories for instant filtering
  const quickCats = allCategories.slice(0, 6);

  return (
    <div className="page-jobs bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar */}
          <aside className="w-full lg:w-80">
            <div className="sticky top-6 bg-white border border-gray-100 rounded-xl p-5 shadow-sm">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Filters</h2>

              <label htmlFor="search" className="block text-sm text-gray-700 mb-1">
                Search
              </label>
              <div className="flex gap-2 mb-4">
                <input
                  id="search"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Job title, company, or tag"
                  className="flex-1 px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-200 text-sm"
                />
                <button
                  onClick={applyFiltersToUrl}
                  className="px-3 py-2 bg-blue-600 text-white rounded-md text-sm hover:opacity-95 btn-press"
                  aria-label="Apply search"
                >
                  Go
                </button>
              </div>

              <div className="mb-4">
                <label htmlFor="category" className="block text-sm text-gray-700 mb-1">
                  Category
                </label>
                <select
                  id="category"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-3 py-2 border rounded-md text-sm"
                >
                  <option value="">All categories</option>
                  {allCategories.map((c) => (
                    <option key={c.name} value={c.name}>
                      {c.name} ({c.count})
                    </option>
                  ))}
                </select>
              </div>

              <div className="mb-4">
                <label htmlFor="type" className="block text-sm text-gray-700 mb-1">
                  Job type
                </label>
                <select
                  id="type"
                  value={type}
                  onChange={(e) => setType(e.target.value)}
                  className="w-full px-3 py-2 border rounded-md text-sm"
                >
                  <option value="">Any</option>
                  <option value="Full-time">Full-time</option>
                  <option value="Part-time">Part-time</option>
                  <option value="Contract">Contract</option>
                  <option value="Remote">Remote</option>
                </select>
              </div>

              <div className="mb-4">
                <label htmlFor="sort" className="block text-sm text-gray-700 mb-1">
                  Sort by
                </label>
                <select
                  id="sort"
                  value={sort}
                  onChange={(e) => setSort(e.target.value)}
                  className="w-full px-3 py-2 border rounded-md text-sm"
                >
                  <option value="newest">Newest</option>
                  <option value="salary">Highest salary</option>
                </select>
              </div>

              <div className="flex gap-2 mb-4">
                <button
                  onClick={applyFiltersToUrl}
                  className="flex-1 px-3 py-2 bg-blue-600 text-white rounded-md text-sm hover:opacity-95 btn-press"
                >
                  Apply
                </button>
                <button
                  onClick={clearFilters}
                  className="px-3 py-2 border rounded-md text-sm text-gray-600 hover:bg-gray-50"
                >
                  Reset
                </button>
              </div>

              <div className="mt-4 text-sm text-gray-500">
                <p className="mb-2 font-medium text-gray-700">Quick categories</p>
                <div className="mt-1 grid grid-cols-2 gap-2">
                  {quickCats.map((c) => (
                    <button
                      key={c.name}
                      onClick={() => {
                        setCategory(c.name);
                        // apply immediately
                        setTimeout(applyFiltersToUrl, 0);
                      }}
                      className="text-left text-sm px-2 py-1 bg-gray-50 border border-gray-100 rounded-md text-gray-700 hover:bg-gray-100 transition"
                    >
                      {c.name} <span className="text-xs text-gray-400">({c.count})</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </aside>

          {/* Main list */}
          <main className="flex-1">
            <div className="flex items-center justify-between mb-6">
              <h1 className="text-2xl font-semibold text-gray-900">Job Listings</h1>
              <div className="text-sm text-gray-600">
                <span className="font-medium text-gray-900">{filtered.length}</span> results
              </div>
            </div>

            {filtered.length === 0 ? (
              <div className="p-12 bg-white border border-gray-100 rounded-xl text-center text-gray-500 card-hover">
                <EmptyState />
                <div className="mt-6">
                  <Link to="/" className="inline-block px-4 py-2 bg-blue-50 text-blue-700 rounded-md">
                    Go home
                  </Link>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filtered.map((job) => (
                  <div key={job.id} className="job-card card-hover bg-white border border-gray-100 rounded-xl p-4">
                    {/* JobCard component if available keeps markup centralized; fallback rendering included */}
                    {JobCard ? (
                      <JobCard job={job} />
                    ) : (
                      <div className="flex flex-col h-full">
                        <div className="flex items-start gap-3">
                          <img
                            src={job.logo || `https://placehold.co/64x64/EEEEEE/111827?text=Logo`}
                            alt={job.company}
                            className="h-12 w-12 rounded-md object-cover flex-shrink-0"
                          />
                          <div className="flex-1 min-w-0">
                            <h3 className="text-md font-semibold text-gray-900 truncate">{job.title}</h3>
                            <div className="text-sm text-gray-500 truncate">{job.company}</div>
                          </div>
                        </div>

                        <div className="mt-4 flex items-center justify-between text-sm text-gray-600">
                          <div className="flex items-center gap-2">
                            <span className="inline-block px-2 py-1 text-xs bg-gray-50 border rounded text-gray-700">
                              {job.type || "Full-time"}
                            </span>
                            <span className="text-xs text-gray-400">{job.location || "Remote"}</span>
                          </div>

                          <div className="text-sm font-medium text-gray-900">
                            {job.salary || "—"}
                          </div>
                        </div>

                        <div className="mt-4 flex flex-wrap gap-2">
                          {(job.tags || []).slice(0, 4).map((t) => (
                            <span key={t} className="text-xs px-2 py-1 rounded-full bg-gray-50 border text-gray-600">
                              {t}
                            </span>
                          ))}
                        </div>

                        <div className="mt-4 flex items-center justify-between">
                          <Link
                            to={`/jobs/${job.id}`}
                            className="text-sm text-blue-600 hover:underline"
                            aria-label={`View ${job.title} at ${job.company}`}
                          >
                            View
                          </Link>
                          <div className="text-xs text-gray-400">{formatDate(job.postedAt)}</div>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}

/* Small helpers */

function formatDate(epochOrIso) {
  if (!epochOrIso) return "";
  const d = typeof epochOrIso === "number" ? new Date(epochOrIso) : new Date(epochOrIso);
  return d.toLocaleDateString(undefined, { month: "short", day: "numeric" });
}

function EmptyState() {
  return (
    <div className="empty-state flex flex-col items-center justify-center gap-4">
      <svg width="160" height="120" viewBox="0 0 160 120" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
        <rect x="8" y="20" width="144" height="88" rx="8" fill="#F3F4F6"/>
        <rect x="20" y="36" width="48" height="10" rx="3" fill="#E5E7EB"/>
        <rect x="20" y="52" width="110" height="8" rx="3" fill="#E5E7EB"/>
        <rect x="20" y="66" width="80" height="8" rx="3" fill="#E5E7EB"/>
        <rect x="78" y="36" width="46" height="42" rx="6" fill="#D1D5DB"/>
      </svg>

      <div className="text-lg font-semibold text-gray-700">No jobs found</div>
      <div className="text-sm text-gray-500 max-w-xs">
        Try adjusting filters, clearing search terms, or check back later — new jobs are added frequently.
      </div>
    </div>
  );
}
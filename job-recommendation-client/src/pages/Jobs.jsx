import React, { useMemo, useRef, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import JobCard from "../components/JobCard";
import { jobs as allJobs, categories as allCategories } from "../utils/constants";

/**
 * Jobs.jsx — enhanced with AI Resume Upload & Job Matching (mocked)
 *
 * Behavior:
 * - Toggle between Normal mode and AI mode.
 * - AI mode: upload resume (PDF/DOCX) and call POST /api/resume-match (multipart/form-data).
 * - When AI mode returns matches, show jobs sorted by match % and display match % on cards.
 *
 * Notes:
 * - Keep existing filter behavior in Normal mode.
 * - Implements loading, error, and empty states.
 */

export default function Jobs() {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialQ = searchParams.get("search") || "";
  const initialCategory = searchParams.get("category") || "";
  const [query, setQuery] = useState(initialQ);
  const [category, setCategory] = useState(initialCategory);
  const [type, setType] = useState(searchParams.get("type") || "");
  const [sort, setSort] = useState(searchParams.get("sort") || "newest");

  // AI Mode states
  const [aiMode, setAiMode] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [matchedJobs, setMatchedJobs] = useState(null); // null = not searched yet, [] = no matches
  const [loadingMatches, setLoadingMatches] = useState(false);
  const [matchError, setMatchError] = useState("");
  const fileInputRef = useRef(null);

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

  // Handle file selection
  function onFileChange(e) {
    setMatchError("");
    setMatchedJobs(null);
    const f = e.target.files && e.target.files[0];
    if (f) {
      setSelectedFile(f);
    }
  }

  // Upload resume and fetch matches
  async function findMatches() {
    setMatchError("");
    setServerNote("");
    setMatchedJobs(null);

    if (!selectedFile) {
      setMatchError("Please choose a resume file (PDF or DOCX).");
      return;
    }

    setLoadingMatches(true);
    try {
      const fd = new FormData();
      fd.append("resume", selectedFile);

      // include token if available (from your auth flow)
      const token = localStorage.getItem("token") || "";

      const res = await fetch(`${RESUME_API.replace(/\/$/, "")}/api/resume-match`, {
        method: "POST",
        headers: token ? { Authorization: `Bearer ${token}` } : {},
        body: fd,
      });

      // Try to parse body regardless of status so we can show server note/help
      let body = null;
      let textBody = null;
      try {
        body = await res.clone().json();
      } catch (jsonErr) {
        try {
          textBody = await res.clone().text();
        } catch (tErr) {
          textBody = null;
        }
      }

      // If response not ok, extract useful info and show friendly message
      if (!res.ok) {
        let errMsg = "Server error";
        if (body) {
          if (body.error) errMsg = body.error;
          else if (body.message) errMsg = body.message;
          if (body.note) setServerNote(body.note);
          if (body.note_hi) setServerNote((prev) => prev ? `${prev}\n${body.note_hi}` : body.note_hi);
        } else if (textBody) {
          errMsg = textBody;
        }
        throw new Error(errMsg);
      }

      // Normal successful response: expects { matches: [...] }
      const payload = body || (textBody ? JSON.parse(textBody) : null);
      if (!payload || !Array.isArray(payload.matches)) {
        throw new Error("Invalid response from server");
      }

      // If server provided a "note", show it
      if (payload.note) setServerNote(payload.note);
      if (payload.note_hi) setServerNote((prev) => prev ? `${prev}\n${payload.note_hi}` : payload.note_hi);

      // payload.matches expected to be array of { job, matchPercent } or similar
      setMatchedJobs(payload.matches);
    } catch (err) {
      console.error("Resume match error:", err);
      setMatchError(err.message || "Failed to process resume");
    } finally {
      setLoadingMatches(false);
    }
  }

  // When toggling modes, reset AI states so UI is clean
  function toggleAiMode(enable) {
    setAiMode(enable);
    setMatchError("");
    setMatchedJobs(null);
    setSelectedFile(null);
    if (!enable) {
      // clear file input
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  }

  // Which list to render: normal filtered or AI matches
  const displayList = aiMode ? (matchedJobs || []) : filtered;

  return (
    <div className="page-jobs bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar */}
          <aside className="w-full lg:w-80">
            <div className="sticky top-6 bg-white border border-gray-100 rounded-xl p-5 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-900">Filters</h2>
                {/* Mode toggle */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => toggleAiMode(false)}
                    className={`px-2 py-1 text-sm rounded-md ${!aiMode ? "bg-indigo-600 text-white" : "bg-gray-100 text-gray-700"}`}
                    aria-pressed={!aiMode}
                  >
                    Normal
                  </button>
                  <button
                    onClick={() => toggleAiMode(true)}
                    className={`px-2 py-1 text-sm rounded-md ${aiMode ? "bg-indigo-600 text-white" : "bg-gray-100 text-gray-700"}`}
                    aria-pressed={aiMode}
                  >
                    AI
                  </button>
                </div>
              </div>

              {!aiMode ? (
                <>
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
                </>
              ) : (
                /* AI Mode UI */
                <div>
                  <label className="block text-sm text-gray-700 mb-2">Upload resume</label>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".pdf,.docx,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                    onChange={onFileChange}
                    className="w-full text-sm"
                  />
                  <div className="mt-3 flex gap-2">
                    <button
                      onClick={findMatches}
                      className="flex-1 px-3 py-2 bg-indigo-600 text-white rounded-md text-sm hover:opacity-95 btn-press"
                      disabled={loadingMatches}
                    >
                      {loadingMatches ? "Finding..." : "Find Jobs"}
                    </button>
                    <button
                      onClick={() => {
                        setSelectedFile(null);
                        setMatchedJobs(null);
                        setMatchError("");
                        if (fileInputRef.current) fileInputRef.current.value = "";
                      }}
                      className="px-3 py-2 border rounded-md text-sm text-gray-600 hover:bg-gray-50"
                    >
                      Clear
                    </button>
                  </div>

                  {selectedFile && (
                    <div className="mt-3 text-sm text-gray-600">
                      Selected: <span className="font-medium">{selectedFile.name}</span> ·{" "}
                      {(selectedFile.size / 1024).toFixed(0)} KB
                    </div>
                  )}

                  {matchError && <div className="mt-3 text-sm text-red-600">{matchError}</div>}

                  <div className="mt-4 text-xs text-gray-500">
                    Tip: Upload a resume with clear skills listed (React, Node.js, Python, AWS, SQL, etc.).
                  </div>
                </div>
              )}
            </div>
          </aside>

          {/* Main list */}
          <main className="flex-1">
            <div className="flex items-center justify-between mb-6">
              <h1 className="text-2xl font-semibold text-gray-900">
                {aiMode ? "AI Job Matches" : "Job Listings"}
              </h1>
              <div className="text-sm text-gray-600">
                <span className="font-medium text-gray-900">
                  {aiMode ? (loadingMatches ? "..." : matchedJobs ? matchedJobs.length : "—") : filtered.length}
                </span>{" "}
                results
              </div>
            </div>

            {/* AI mode: show special loading / empty states */}
            {aiMode ? (
              <>
                {loadingMatches ? (
                  <div className="p-8 bg-white border border-gray-100 rounded-xl text-center text-gray-600">
                    Processing resume… this may take a few seconds.
                  </div>
                ) : matchError ? (
                  <div className="p-8 bg-white border border-red-100 rounded-xl text-center text-red-700">
                    {matchError}
                  </div>
                ) : matchedJobs && matchedJobs.length === 0 ? (
                  <div className="p-12 bg-white border border-gray-100 rounded-xl text-center text-gray-500">
                    <div className="text-lg font-semibold text-gray-700">No matches found</div>
                    <div className="text-sm text-gray-500 max-w-xs mx-auto mt-2">
                      Try uploading a more detailed resume or adjust filters.
                    </div>
                  </div>
                ) : (
                  /* If matchedJobs is null (not searched yet), show a friendly hint */
                  matchedJobs === null ? (
                    <div className="p-8 bg-white border border-gray-100 rounded-xl text-center text-gray-600">
                      Upload a resume and click "Find Jobs" to get AI matches.
                    </div>
                  ) : null
                )}
              </>
            ) : null}

            {/* Job grid: in normal mode use filtered; in AI mode show matchedJobs (already sorted by backend) */}
            {(!aiMode && filtered.length === 0) || (aiMode && matchedJobs && matchedJobs.length === 0) ? null : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {displayList.map((entry) => {
                  // In AI mode the server returns { job, matchPercent }
                  const job = aiMode ? entry.job : entry;
                  const matchPercent = aiMode ? Math.round(entry.matchPercent) : undefined;
                  return (
                    <div key={job.id} className="job-card card-hover bg-white border border-gray-100 rounded-xl p-4">
                      <JobCard job={job} matchPercent={matchPercent} />
                    </div>
                  );
                })}
              </div>
            )}

            {/* If neither mode produced cards (e.g. normal filtered length 0), show existing empty state */}
            {!aiMode && filtered.length === 0 && (
              <div className="p-12 bg-white border border-gray-100 rounded-xl text-center text-gray-500 card-hover">
                <EmptyState />
                <div className="mt-6">
                  <Link to="/" className="inline-block px-4 py-2 bg-blue-50 text-blue-700 rounded-md">
                    Go home
                  </Link>
                </div>
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
  const d = typeof epochOrIso === "number" ? new Date(epochOrIso * 1000) : new Date(epochOrIso);
  return d.toLocaleDateString(undefined, { month: "short", day: "numeric" });
}

function EmptyState() {
  return (
    <div className="empty-state flex flex-col items-center justify-center gap-4">
      <svg width="160" height="120" viewBox="0 0 160 120" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
        <rect x="8" y="20" width="144" height="88" rx="8" fill="#F3F4F6" />
        <rect x="20" y="36" width="48" height="10" rx="3" fill="#E5E7EB" />
        <rect x="20" y="52" width="110" height="8" rx="3" fill="#E5E7EB" />
        <rect x="20" y="66" width="80" height="8" rx="3" fill="#E5E7EB" />
        <rect x="78" y="36" width="46" height="42" rx="6" fill="#D1D5DB" />
      </svg>

      <div className="text-lg font-semibold text-gray-700">No jobs found</div>
      <div className="text-sm text-gray-500 max-w-xs">
        Try adjusting filters, clearing search terms, or check back later — new jobs are added frequently.
      </div>
    </div>
  );
}

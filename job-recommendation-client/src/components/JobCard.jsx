import React, { useState } from "react";
import { Link } from "react-router-dom";

/**
 * JobCard - uses direct web-hosted company logos via Clearbit.
 * No local files. No images.js. Loads only when online.
 */
export default function JobCard({ job, onApply }) {
  const [saved, setSaved] = useState(false);

  function handleSave(e) {
    e.preventDefault();
    setSaved((s) => !s);
  }

  function handleApply(e) {
    e.preventDefault();
    if (onApply) onApply(job);
    window.location.href = `/jobs/${job.id}`;
  }

  // DIRECT: Map company → real web logo
  const getLogoUrl = (company) => {
    const domainMap = {
      "Acme Corp": "acme.com",
      "DesignHub": "designhub.com",
      "Marketly": "marketly.com",
      "ZenVue": "ZenVue.com",
      "Supportly": "supportly.com",
    };
    const domain = domainMap[company] || `${company.toLowerCase().replace(/\s+/g, "")}.com`;
    return `https://logo.clearbit.com/${domain}`;
  };

  const logoSrc = getLogoUrl(job?.company);

  return (
    <article className="bg- border border-gray-100 rounded-xl p-4 shadow-sm hover:shadow-md transition">
      <div className="flex items-start gap-4">
        <img
          src={logoSrc}
          alt={`${job?.company} logo`}
          className="h-12 w-12 rounded-md object-contain bg-gray-50 p-1"
          loading="lazy"
          onError={(e) => {
            // Graceful fallback if logo fails to load
            e.target.src = `https://placehold.co/80x80/EDF2FF/0F172A?text=${encodeURIComponent(
              job?.company.charAt(0)
            )}&font=roboto`;
          }}
        />

        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-4">
            <div className="truncate">
              <h3 className="text-lg font-semibold text-gray-900 truncate">{job?.title}</h3>
              <p className="text-sm text-gray-500 truncate">
                {job?.company} • {job?.location}
              </p>
            </div>

            <div className="text-right shrink-0">
              {job?.salary && (
                <div className="text-sm font-medium text-gray-800">
                  {job.salary}
                </div>
              )}
              <div className="text-xs text-gray-500 mt-1">{job?.type}</div>
            </div>
          </div>

          {job?.tags && job.tags.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-2">
              {job.tags.map((t) => (
                <span key={t} className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded-full">
                  {t}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="mt-4 flex items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <Link
            to={`/jobs/${job?.id}`}
            className="inline-flex items-center gap-2 px-4 py-2 text-sm bg-blue-50 text-blue-700 rounded-md hover:bg-blue-100"
          >
            View
          </Link>

          <button
            onClick={handleApply}
            className="inline-flex items-center gap-2 px-4 py-2 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Apply
          </button>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleSave}
            aria-pressed={saved}
            className={`p-2 rounded-md transition ${saved ? "bg-yellow-100 text-yellow-600" : "text-gray-500 hover:bg-gray-50"}`}
            title={saved ? "Saved" : "Save job"}
          >
            {saved ? (
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M5 3c-.552 0-1 .448-1 1v16l7-3 7 3V4c0-.552-.448-1-1-1H5z" />
              </svg>
            ) : (
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 3c-.552 0-1 .448-1 1v16l7-3 7 3V4c0-.552-.448-1-1-1H5z" />
              </svg>
            )}
          </button>

          <span className="text-xs text-gray-400">
            {job?.postedAt ? `${Math.max(1, Math.floor((Date.now()/1000 - job.postedAt) / 86400))}d ago` : ""}
          </span>
        </div>
      </div>
    </article>
  );
}
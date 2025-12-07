import React from "react";
import { Link } from "react-router-dom";

/**
 * JobCard — extended to show matchPercent (optional)
 *
 * Props:
 * - job: job object (title, company, location, salary, type, tags, logo, postedAt, id)
 * - matchPercent: optional number (0-100) to display as match badge (AI mode)
 *
 * This component focuses on presentational markup and is reusable both for normal and AI modes.
 */

export default function JobCard({ job, matchPercent }) {
  return (
    <div className="flex flex-col h-full">
      <div className="flex items-start gap-3">
        <img
          src={job.logo || `https://placehold.co/64x64/EEEEEE/111827?text=Logo`}
          alt={job.company}
          className="h-12 w-12 rounded-md object-cover flex-shrink-0"
        />
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <h3 className="text-md font-semibold text-gray-900 truncate">{job.title}</h3>
              <div className="text-sm text-gray-500 truncate">{job.company}</div>
            </div>

            {/* Match badge if provided */}
            {typeof matchPercent === "number" && (
              <div className="flex-shrink-0">
                <div
                  className="px-2 py-1 rounded-md text-sm font-medium"
                  style={{
                    background:
                      matchPercent >= 75
                        ? "linear-gradient(90deg,#16a34a,#059669)"
                        : matchPercent >= 40
                        ? "linear-gradient(90deg,#f59e0b,#f97316)"
                        : "linear-gradient(90deg,#ef4444,#f97316)",
                    color: "white",
                    minWidth: 64,
                    textAlign: "center",
                  }}
                  title={`Match: ${Math.round(matchPercent)}%`}
                >
                  {Math.round(matchPercent)}%
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="mt-4 flex items-center justify-between text-sm text-gray-600">
        <div className="flex items-center gap-2">
          <span className="inline-block px-2 py-1 text-xs bg-gray-50 border rounded text-gray-700">
            {job.type || "Full-time"}
          </span>
          <span className="text-xs text-gray-400">{job.location || "Remote"}</span>
        </div>

        <div className="text-sm font-medium text-gray-900">{job.salary || "—"}</div>
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
        <div className="text-xs text-gray-400">
          {formatDate(job.postedAt)}
        </div>
      </div>
    </div>
  );
}

function formatDate(epochOrIso) {
  if (!epochOrIso) return "";
  const d = typeof epochOrIso === "number" ? new Date(epochOrIso * 1000) : new Date(epochOrIso);
  return d.toLocaleDateString(undefined, { month: "short", day: "numeric" });
}
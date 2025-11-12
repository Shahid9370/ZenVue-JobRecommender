import React from "react";
import JobCard from "./JobCard";
import { featuredJobs } from "../utils/constants";

/**
 * FeaturedJobs — displays featured jobs (JobCard will show remote logos).
 */
export default function FeaturedJobs() {
  const jobs = featuredJobs || [];
  return (
    <section className="py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-semibold text-gray-900">Featured Jobs</h2>
          <a href="/jobs" className="text-sm text-blue-600">See all</a>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {jobs.map((job) => (
            <JobCard key={job.id} job={job} />
          ))}
        </div>
      </div>
    </section>
  );
}
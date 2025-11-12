import React from "react";
import CategoryCard from "./CategoryCard";
import { categories } from "../utils/constants";

/**
 * Categories section showing a grid of categories.
 */
export default function Categories() {
  const list = categories || [];
  return (
    <section className="py-12 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-semibold text-gray-900">Categories</h2>
          <a href="/jobs" className="text-sm text-blue-600">Browse all</a>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {list.map((c) => (
            <CategoryCard key={c.name} category={c} />
          ))}
        </div>
      </div>
    </section>
  );
}
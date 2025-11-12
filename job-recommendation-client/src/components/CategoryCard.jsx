import React from "react";

/**
 * CategoryCard displays a category name and count.
 * props.category = { name, count, icon? }
 */
export default function CategoryCard({ category }) {
  return (
    <div className="bg-white border border-gray-100 rounded-lg p-4 hover:shadow-sm transition">
      <div className="flex items-center gap-3">
        <div className="h-10 w-10 rounded-md bg-blue-50 text-blue-600 font-semibold flex items-center justify-center">
          {category.icon || category.name.charAt(0)}
        </div>
        <div>
          <div className="text-sm font-medium text-gray-900">{category.name}</div>
          <div className="text-xs text-gray-500">{category.count ?? 0} open roles</div>
        </div>
      </div>
    </div>
  );
}
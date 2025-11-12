import React from "react";

/**
 * ReviewCard — uses direct web-hosted professional avatars.
 * No local files. No images.js. Loads only when online.
 */
export default function ReviewCard({ review }) {
  // Map name → real professional avatar URL
  const getAvatarUrl = (name) => {
    const map = {
      "Aisha Khan": "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=688",
      "David Lee": "https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=400&h=400&fit=crop",
      "Sophia Patel": "https://images.unsplash.com/photo-1582610285985-a42d9193f2fd?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=687",
     "Shahid Shaikh": "https://media.licdn.com/dms/image/v2/D4D22AQHd1i8G2BmKAg/feedshare-shrink_480/B4DZpkAjDGJIAY-/0/1762614463382?e=1764201600&v=beta&t=Dbt2wHJJAPYTOOCZ6yT-vQD5SO-5xrp48rUIe4vR4Mw",
    };
    return map[name] || `https://placehold.co/80x80/EDF2FF/0F172A?text=${encodeURIComponent(name.charAt(0))}&font=roboto`;
  };

  const avatar = getAvatarUrl(review?.name);

  return (
    <div className="bg-white border border-gray-100 rounded-lg p-4 shadow-sm">
      <div className="flex items-center gap-3">
        <img
          src={avatar}
          alt={review?.name || "User"}
          className="h-10 w-10 rounded-full object-cover"
          loading="lazy"
          onError={(e) => {
            e.target.src = `https://placehold.co/80x80/EDF2FF/0F172A?text=${encodeURIComponent(review?.name.charAt(0))}&font=roboto`;
          }}
        />
        <div>
          <div className="text-sm font-semibold text-gray-900">{review?.name}</div>
          <div className="text-xs text-gray-500">{review?.role}</div>
        </div>
      </div>

      <p className="mt-3 text-gray-700 text-sm">{review?.text}</p>

      <div className="mt-3 text-sm text-yellow-500">
        {"★".repeat(Math.round(review?.rating || 5))}{" "}
        <span className="text-gray-400 text-xs">({review?.rating || 5})</span>
      </div>
    </div>
  );
}
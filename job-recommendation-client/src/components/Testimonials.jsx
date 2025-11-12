import React from "react";
import ReviewCard from "./ReviewCard";
import { testimonials } from "../utils/constants";

/**
 * Testimonials section composed of multiple ReviewCards.
 */
export default function Testimonials() {
  const list = testimonials || [];
  return (
    <section className="py-12">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-2xl font-semibold text-gray-900">What our users say</h2>
        <p className="mt-2 text-gray-600">Real feedback from people who found jobs on ZenVue.</p>

        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
          {list.map((t) => (
            <ReviewCard key={t.id} review={t} />
          ))}
        </div>
      </div>
    </section>
  );
}
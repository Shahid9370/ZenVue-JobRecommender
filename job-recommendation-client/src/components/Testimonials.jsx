import React, { useMemo } from "react";
import MarqueeRow from "./MarqueeRow";

export default function TestimonialsMarquee({
  testimonials = [],
  maxItems = 8,
  direction = "left",
  speed = 80,
}) {
  const items = useMemo(() => testimonials.slice(0, maxItems), [testimonials, maxItems]);

  if (!items.length) return null;

  return (
    <section className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-5xl font-bold text-gray-900">
            Loved by thousands
          </h2>
          <p className="mt-4 text-xl text-gray-600">
            Real feedback from real people who changed their careers.
          </p>
        </div>

        <MarqueeRow items={items} direction={direction} speed={speed} laneIndex={0} />
      </div>
    </section>
  );
}
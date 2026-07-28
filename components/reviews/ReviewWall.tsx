"use client";

import { useEffect, useState } from "react";
import ReviewCard from "./ReviewCard";

function ScrollColumn({ reviews, duration }: { reviews: any[]; duration: string }) {
  if (!reviews.length) return null;

  // duplicate the list so the loop is seamless
  const doubled = [...reviews, ...reviews];

  return (
    <div className="review-wall relative h-full overflow-hidden">
      {/* fade masks top and bottom */}
      <div className="pointer-events-none absolute inset-x-0 top-0 z-10 h-16 bg-gradient-to-b from-white to-transparent dark:from-[#0a0f0e]" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 h-16 bg-gradient-to-t from-white to-transparent dark:from-[#0a0f0e]" />

      <div
        className="animate-scroll-up flex flex-col gap-3"
        style={{ ["--scroll-duration" as any]: duration }}
      >
        {doubled.map((r, i) => (
          <ReviewCard key={`${r._id}-${i}`} review={r} />
        ))}
      </div>
    </div>
  );
}

export default function ReviewWall() {
  const [reviews, setReviews] = useState<any[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    fetch("/api/reviews")
      .then((r) => r.json())
      .then((d) => setReviews(d.reviews ?? []))
      .finally(() => setLoaded(true));
  }, []);

  // don't render anything until we have reviews — no empty box
  if (!loaded || reviews.length < 2) return null;

  // split into two columns, alternating, for a masonry feel
  const colA = reviews.filter((_, i) => i % 2 === 0);
  const colB = reviews.filter((_, i) => i % 2 === 1);

  return (
    <div className="grid h-[32rem] grid-cols-1 gap-3 sm:grid-cols-2">
      <ScrollColumn reviews={colA} duration="38s" />
      {/* second column only on wider screens */}
      <div className="hidden sm:block">
        <ScrollColumn reviews={colB.length ? colB : colA} duration="46s" />
      </div>
    </div>
  );
}
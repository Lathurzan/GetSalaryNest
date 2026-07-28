import { Star } from "lucide-react";

const initials = (name?: string) =>
  name?.split(" ").map((w) => w[0]).slice(0, 2).join("").toUpperCase() ?? "?";

export default function ReviewCard({ review }: { review: any }) {
  return (
    <div className="rounded-2xl border border-neutral-200/80 bg-white/90 p-4 shadow-[0_4px_20px_-8px_rgba(15,43,43,0.15)] backdrop-blur-sm dark:border-white/[0.08] dark:bg-white/[0.04]">
      {/* stars */}
      <div className="mb-2.5 flex gap-0.5">
        {[1, 2, 3, 4, 5].map((n) => (
          <Star
            key={n}
            size={14}
            className={n <= review.rating ? "text-amber-400" : "text-neutral-200 dark:text-neutral-700"}
            fill={n <= review.rating ? "currentColor" : "none"}
          />
        ))}
      </div>

      {review.comment && (
        <p className="text-sm leading-relaxed text-neutral-600 dark:text-neutral-300">
          {review.comment}
        </p>
      )}

      {/* author */}
      <div className="mt-3 flex items-center gap-2.5">
        <div className="flex h-7 w-7 items-center justify-center rounded-full bg-teal-500/15 text-[11px] font-bold text-teal-700 dark:text-teal-400">
          {initials(review.userName)}
        </div>
        <span className="text-xs font-medium text-[#0a1f1f] dark:text-white">
          {review.userName}
        </span>
      </div>
    </div>
  );
}
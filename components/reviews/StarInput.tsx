"use client";

import { Star } from "lucide-react";
import { useState } from "react";

export default function StarInput({
  value, onChange, size = 32,
}: { value: number; onChange: (v: number) => void; size?: number }) {
  const [hover, setHover] = useState(0);

  return (
    <div className="flex items-center gap-1.5">
      {[1, 2, 3, 4, 5].map((n) => {
        const active = n <= (hover || value);
        return (
          <button
            key={n}
            type="button"
            onClick={() => onChange(n)}
            onMouseEnter={() => setHover(n)}
            onMouseLeave={() => setHover(0)}
            className="transition-transform duration-150 hover:scale-110 active:scale-95"
            aria-label={`${n} star${n > 1 ? "s" : ""}`}
          >
            <Star
              size={size}
              className={active ? "text-amber-400" : "text-neutral-300 dark:text-neutral-600"}
              fill={active ? "currentColor" : "none"}
              strokeWidth={1.8}
            />
          </button>
        );
      })}
    </div>
  );
}
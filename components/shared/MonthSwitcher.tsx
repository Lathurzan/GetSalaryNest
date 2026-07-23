"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { monthLabel, monthKey } from "@/lib/dates";

export default function MonthSwitcher({
  month, onChange,
}: { month: string; onChange: (m: string) => void }) {
  const shift = (delta: number) => {
    const [y, m] = month.split("-").map(Number);
    onChange(monthKey(new Date(y, m - 1 + delta, 1)));
  };

  const isCurrent = month === monthKey(new Date());

  return (
    <div className="flex items-center gap-1">
      <button
        onClick={() => shift(-1)}
        aria-label="Previous month"
        className="rounded-lg p-2 hover:bg-neutral-100 dark:hover:bg-white/5"
      >
        <ChevronLeft size={18} />
      </button>
      <span className="min-w-[9rem] text-center text-sm font-medium">
        {monthLabel(month)}
      </span>
      <button
        onClick={() => shift(1)}
        disabled={isCurrent}
        aria-label="Next month"
        className="rounded-lg p-2 hover:bg-neutral-100 disabled:opacity-30 dark:hover:bg-white/5"
      >
        <ChevronRight size={18} />
      </button>
    </div>
  );
}
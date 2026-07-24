"use client";

import * as Icons from "lucide-react";
import { cn } from "@/lib/utils";

export interface Cat {
  _id: string;
  name: string;
  icon: string;
  color: string;
  type: "expense" | "savings";
}

export default function CategoryPicker({
  categories, value, onChange,
}: { categories: Cat[]; value: string; onChange: (id: string) => void }) {
  return (
    <div className="grid grid-cols-4 gap-2 sm:grid-cols-5">
      {categories.map((c) => {
        const Icon = (Icons as any)[c.icon] ?? Icons.Wallet;
        const active = value === c._id;

        return (
          <button
            key={c._id}
            type="button"
            onClick={() => onChange(c._id)}
            className={cn(
              "group flex flex-col items-center gap-1.5 rounded-2xl border p-2.5 transition-all duration-300",
              active
                ? "-translate-y-0.5 border-transparent"
                : "border-neutral-200 bg-white hover:-translate-y-0.5 hover:border-neutral-300 hover:shadow-sm dark:border-white/10 dark:bg-white/[0.03] dark:hover:border-white/20"
            )}
            style={
              active
                ? {
                    backgroundColor: `${c.color}18`,
                    boxShadow: `0 0 0 2px ${c.color}, 0 8px 20px -8px ${c.color}80`,
                  }
                : {}
            }
          >
            <div
              className="flex h-9 w-9 items-center justify-center rounded-full transition-transform duration-300 group-hover:scale-110"
              style={{ backgroundColor: `${c.color}${active ? "33" : "1f"}` }}
            >
              <Icon size={17} style={{ color: c.color }} strokeWidth={active ? 2.3 : 1.9} />
            </div>
            <span
              className={cn(
                "w-full truncate text-center text-[11px] leading-tight transition-colors",
                active
                  ? "font-semibold"
                  : "text-neutral-600 dark:text-neutral-300"
              )}
              style={active ? { color: c.color } : {}}
            >
              {c.name}
            </span>
          </button>
        );
      })}
    </div>
  );
}
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
              "flex flex-col items-center gap-1.5 rounded-2xl border p-2.5 transition",
              active
                ? "border-transparent ring-2 ring-offset-1"
                : "border-neutral-200 hover:border-neutral-300 dark:border-white/10"
            )}
            style={active ? { backgroundColor: `${c.color}14`, boxShadow: `0 0 0 2px ${c.color}` } : {}}
          >
            <div
              className="flex h-9 w-9 items-center justify-center rounded-full"
              style={{ backgroundColor: `${c.color}1f` }}
            >
              <Icon size={17} style={{ color: c.color }} />
            </div>
            <span className="w-full truncate text-center text-[11px] leading-tight text-neutral-600 dark:text-neutral-300">
              {c.name}
            </span>
          </button>
        );
      })}
    </div>
  );
}
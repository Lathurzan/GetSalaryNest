"use client";

import * as Icons from "lucide-react";
import { format } from "@/lib/money";

interface Row {
  _id: string;
  name: string;
  icon: string;
  color: string;
  spent: number;
  count: number;
  budget?: number;
}

export default function CategoryBreakdown({ rows, total }: { rows: Row[]; total: number }) {
  if (!rows.length) return null;

  return (
    <div className="space-y-3">
      {rows.map((r) => {
        const Icon = (Icons as any)[r.icon] ?? Icons.Wallet;
        const share = total > 0 ? Math.round((r.spent / total) * 100) : 0;
        const hasBudget = !!r.budget && r.budget > 0;
        const budgetPct = hasBudget ? Math.round((r.spent / r.budget!) * 100) : 0;
        const over = hasBudget && r.spent > r.budget!;

        return (
          <div key={r._id} className="rounded-2xl border border-neutral-100 p-3.5 dark:border-white/5">
            <div className="flex items-center gap-3">
              <div
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full"
                style={{ backgroundColor: `${r.color}1a` }}
              >
                <Icon size={16} style={{ color: r.color }} />
              </div>

              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium">{r.name}</p>
                <p className="text-xs text-neutral-400">
                  {r.count} {r.count === 1 ? "transaction" : "transactions"} · {share}%
                </p>
              </div>

              <div className="text-right">
                <p className="text-sm font-semibold tabular-nums">{format(r.spent)}</p>
                {hasBudget && (
                  <p className={`text-xs ${over ? "text-red-500" : "text-neutral-400"}`}>
                    of {format(r.budget!)}
                  </p>
                )}
              </div>
            </div>

            <div className="mt-2.5 h-1.5 w-full overflow-hidden rounded-full bg-neutral-100 dark:bg-white/5">
              <div
                className="h-full rounded-full transition-all duration-500"
                style={{
                  width: `${Math.min(100, hasBudget ? budgetPct : share)}%`,
                  backgroundColor: over ? "#ef4444" : r.color,
                }}
              />
            </div>

            {over && (
              <p className="mt-1.5 text-xs text-red-500">
                Over budget by {format(r.spent - r.budget!)}
              </p>
            )}
          </div>
        );
      })}
    </div>
  );
}
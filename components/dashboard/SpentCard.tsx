"use client";

import { format } from "@/lib/money";
import { TrendingDown, TrendingUp, Wallet } from "lucide-react";

interface Props {
  spent: number;
  income: number;
  lastMonthSpent?: number;
  currency?: string;
}

export default function SpentCard({ spent, income, lastMonthSpent, currency = "GBP" }: Props) {
  const pct = income > 0 ? Math.round((spent / income) * 100) : 0;
  const diff = lastMonthSpent ? spent - lastMonthSpent : null;
  const up = diff !== null && diff > 0;

  return (
    <div className="relative h-52 w-full overflow-hidden rounded-3xl bg-gradient-to-br from-[#2b1f1f] via-[#3c2626] to-[#1f1414] p-6 shadow-xl">
      <div className="pointer-events-none absolute inset-0 opacity-60"
        style={{ background: "radial-gradient(circle at 65% 45%, #f9731633 0%, transparent 60%)" }} />

      <div className="relative flex h-full flex-col justify-between">
        <div>
          <div className="flex items-center gap-2 text-xs font-medium tracking-wide text-white/60">
            <Wallet size={14} /> SPENT THIS MONTH
          </div>
          <div className="mt-2 text-3xl font-semibold tracking-tight text-white">
            {format(spent, currency)}
          </div>
        </div>

        <div>
          <p className="text-xs text-white/50">{pct}% of income</p>
          {diff !== null && (
            <p className={`mt-1 flex items-center gap-1 text-sm font-medium ${up ? "text-red-400" : "text-green-400"}`}>
              {up ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
              {format(Math.abs(diff), currency)} vs last month
            </p>
          )}
          <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-white/10">
            <div className="h-full rounded-full bg-orange-500 transition-all duration-700"
              style={{ width: `${Math.min(100, pct)}%` }} />
          </div>
        </div>
      </div>
    </div>
  );
}
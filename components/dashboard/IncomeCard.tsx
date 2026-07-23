"use client";

import { format } from "@/lib/money";
import { Banknote } from "lucide-react";

interface Props {
  income: number;
  source?: string;
  paidOn?: string;
  currency?: string;
}

export default function IncomeCard({ income, source = "Salary", paidOn, currency = "GBP" }: Props) {
  return (
    <div className="relative h-52 w-full overflow-hidden rounded-3xl bg-gradient-to-br from-[#1a2440] via-[#213056] to-[#121a2e] p-6 shadow-xl">
      <div className="pointer-events-none absolute inset-0 opacity-60"
        style={{ background: "radial-gradient(circle at 65% 45%, #3b82f633 0%, transparent 60%)" }} />

      <div className="relative flex h-full flex-col justify-between">
        <div>
          <div className="flex items-center gap-2 text-xs font-medium tracking-wide text-white/60">
            <Banknote size={14} /> INCOME
          </div>
          <div className="mt-2 text-3xl font-semibold tracking-tight text-white">
            {format(income, currency)}
          </div>
        </div>

        <div>
          <p className="text-sm text-white/70">{source}</p>
          {paidOn && <p className="mt-1 text-xs text-white/40">Paid {paidOn}</p>}
        </div>
      </div>
    </div>
  );
}
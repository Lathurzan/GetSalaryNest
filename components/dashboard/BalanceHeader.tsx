"use client";

import { format } from "@/lib/money";
import { Plus, ArrowLeftRight, TrendingUp, TrendingDown } from "lucide-react";

interface Props {
  remaining: number;
  currency?: string;
  onAdd: () => void;
  onTransfer: () => void;
}

export default function BalanceHeader({
  remaining,
  currency = "GBP",
  onAdd,
  onTransfer,
}: Props) {
  const positive = remaining >= 0;

  return (
    <div className="relative overflow-hidden rounded-[1.75rem] bg-gradient-to-br from-[#0f2b2b] via-[#143838] to-[#0a1f1f] p-6 shadow-[0_24px_70px_-24px_rgba(15,43,43,0.75)] ring-1 ring-white/10 sm:p-8">
      {/* animated glow */}
      <div
        className="animate-float pointer-events-none absolute inset-0 opacity-70"
        style={{
          background:
            "radial-gradient(circle at 75% 30%, #14b8a640 0%, transparent 58%)",
        }}
      />
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/25 to-transparent" />

      {/* grid texture */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.06]"
        style={{
          backgroundImage:
            "linear-gradient(to right, #fff 1px, transparent 1px), linear-gradient(to bottom, #fff 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      />

      <div className="relative flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="flex items-center gap-1.5 text-[10px] font-medium uppercase tracking-[0.14em] text-white/45">
            {positive ? (
              <TrendingUp size={11} strokeWidth={2.4} className="text-teal-400" />
            ) : (
              <TrendingDown size={11} strokeWidth={2.4} className="text-red-400" />
            )}
            Balance remaining
          </p>

          <h2 className="mt-3 text-4xl font-bold tracking-[-0.03em] text-white sm:text-5xl">
            {format(remaining, currency)}
          </h2>

          <p className="mt-2.5 text-xs text-white/40">
            Left to spend or save this month
          </p>
        </div>

        <div className="flex gap-2.5">
          <button
            onClick={onAdd}
            aria-label="Add expense"
            className="group flex items-center gap-2 rounded-2xl bg-white px-4 py-3 text-sm font-semibold text-[#0f2b2b] shadow-[0_8px_24px_-8px_rgba(255,255,255,0.35)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_14px_32px_-10px_rgba(255,255,255,0.45)] active:translate-y-0 active:scale-[0.97]"
          >
            <Plus
              size={17}
              strokeWidth={2.4}
              className="transition-transform duration-300 group-hover:rotate-90"
            />
            <span className="hidden sm:inline">Expense</span>
          </button>

          <button
            onClick={onTransfer}
            aria-label="Add income"
            className="group flex items-center gap-2 rounded-2xl border border-white/15 bg-white/[0.08] px-4 py-3 text-sm font-semibold text-white backdrop-blur-xl transition-all duration-300 hover:-translate-y-0.5 hover:border-white/25 hover:bg-white/[0.14] active:translate-y-0 active:scale-[0.97]"
          >
            <ArrowLeftRight
              size={17}
              strokeWidth={2.2}
              className="text-teal-400 transition-transform duration-300 group-hover:scale-110"
            />
            <span className="hidden sm:inline">Income</span>
          </button>
        </div>
      </div>
    </div>
  );
}
"use client";

import { format } from "@/lib/money";
import ProgressRing from "./ProgressRing";
import { PiggyBank, Check } from "lucide-react";

interface Props {
  saved: number;          // pence
  target: number;         // pence
  mode: "percent" | "fixed";
  percentTarget: number;
  label?: string;
  currency?: string;
}

export default function SavingsCard({
  saved,
  target,
  mode,
  percentTarget,
  label = "Monthly savings",
  currency = "GBP",
}: Props) {
  const progress = target > 0 ? Math.min(100, Math.round((saved / target) * 100)) : 0;
  const met = target > 0 && saved >= target;
  const accent = met ? "#22c55e" : "#14b8a6";
  const remaining = Math.max(0, target - saved);

  return (
    <div className="relative h-52 w-full overflow-hidden rounded-3xl bg-gradient-to-br from-[#0f2b2b] via-[#113c3c] to-[#0a1f1f] p-6 shadow-xl">
      {/* radial glow */}
      <div
        className="pointer-events-none absolute inset-0 opacity-60"
        style={{
          background: `radial-gradient(circle at 65% 45%, ${accent}33 0%, transparent 60%)`,
        }}
      />

      <div className="relative flex h-full flex-col justify-between">
        {/* header */}
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-2 text-xs font-medium tracking-wide text-white/60">
              <PiggyBank size={14} />
              {label.toUpperCase()}
            </div>
            <div className="mt-2 text-3xl font-semibold tracking-tight text-white">
              {format(saved, currency)}
            </div>
          </div>

          <ProgressRing progress={progress} color={accent} size={64} stroke={5}>
            {met ? (
              <Check size={22} className="text-green-400" strokeWidth={3} />
            ) : (
              <span className="text-sm font-semibold text-white">{progress}%</span>
            )}
          </ProgressRing>
        </div>

        {/* footer */}
        <div className="flex items-end justify-between">
          <div>
            <p className="text-xs text-white/50">
              Goal {format(target, currency)}
              {mode === "percent" && (
                <span className="ml-1 text-white/35">· {percentTarget}% of income</span>
              )}
            </p>
            <p className="mt-1 text-sm font-medium" style={{ color: accent }}>
              {met ? "Goal met 🎉" : `${format(remaining, currency)} to go`}
            </p>
          </div>

          {/* progress bar */}
          <div className="h-1.5 w-28 overflow-hidden rounded-full bg-white/10">
            <div
              className="h-full rounded-full transition-all duration-700"
              style={{ width: `${progress}%`, backgroundColor: accent }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
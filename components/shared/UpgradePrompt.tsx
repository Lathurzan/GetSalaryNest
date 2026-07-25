"use client";

import { X, Check, Sparkles } from "lucide-react";
import Link from "next/link";
import { createPortal } from "react-dom";
import { useEffect, useState } from "react";

const PERKS = [
  "Unlimited expenses",
  "Attach bill photos",
  "PDF export & statement import",
  "Custom categories",
  "Full history",
];

export default function UpgradePrompt({
  open, onClose, reason,
}: { open: boolean; onClose: () => void; reason?: string }) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  if (!open || !mounted) return null;

  return createPortal(
    <div className="fixed inset-0 z-[9999] flex items-end justify-center sm:items-center sm:p-4">
      {/* backdrop */}
      <div
        onClick={onClose}
        className="animate-overlay-in absolute inset-0 bg-gradient-to-b from-[#0a1f1f]/50 via-[#0a1f1f]/60 to-[#0a1f1f]/70 backdrop-blur-md"
      />

      {/* card */}
      <div className="animate-modal-in relative w-full max-w-md overflow-hidden rounded-t-[1.75rem] border border-white/60 bg-white/95 shadow-[0_-8px_60px_-12px_rgba(0,0,0,0.4)] backdrop-blur-2xl sm:rounded-[1.75rem] sm:shadow-[0_30px_80px_-20px_rgba(0,0,0,0.5)] dark:border-white/[0.12] dark:bg-[#0d1817]/95">
        {/* gradient top border */}
        <div className="pointer-events-none absolute inset-x-10 top-0 h-px bg-gradient-to-r from-transparent via-teal-500/70 to-transparent" />

        {/* mobile grab handle */}
        <div className="flex justify-center pt-3 sm:hidden">
          <div className="h-1 w-10 rounded-full bg-neutral-300 dark:bg-white/20" />
        </div>

        <div className="p-6 pb-[calc(env(safe-area-inset-bottom)+1.5rem)] sm:p-7 sm:pb-7">
          {/* header */}
          <div className="mb-5 flex items-start justify-between gap-4">
            <div className="flex items-start gap-3">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-teal-500/20 to-emerald-500/10 ring-1 ring-teal-500/25">
                <Sparkles
                  size={19}
                  strokeWidth={2}
                  className="text-teal-600 dark:text-teal-400"
                />
              </div>
              <div>
                <h3 className="text-lg font-bold tracking-tight text-[#0a1f1f] dark:text-white">
                  Upgrade to Premium
                </h3>
                {reason && (
                  <p className="mt-0.5 text-sm text-neutral-500 dark:text-neutral-400">
                    {reason}
                  </p>
                )}
              </div>
            </div>

            <button
              onClick={onClose}
              aria-label="Close"
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-neutral-200 bg-white text-neutral-500 transition-all duration-200 hover:rotate-90 hover:border-neutral-300 hover:text-neutral-800 active:scale-90 dark:border-white/10 dark:bg-white/[0.06] dark:text-neutral-400 dark:hover:bg-white/10 dark:hover:text-white"
            >
              <X size={16} strokeWidth={2.4} />
            </button>
          </div>

          {/* perks */}
          <ul className="mb-6 space-y-2.5">
            {PERKS.map((p) => (
              <li
                key={p}
                className="flex items-center gap-3 text-sm font-medium text-neutral-700 dark:text-neutral-200"
              >
                <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-teal-500/15 ring-1 ring-teal-500/25">
                  <Check size={11} strokeWidth={3} className="text-teal-600 dark:text-teal-400" />
                </span>
                {p}
              </li>
            ))}
          </ul>

          {/* price */}
          <div className="mb-5 overflow-hidden rounded-2xl bg-gradient-to-br from-[#0f2b2b] to-[#143838] p-5 text-center ring-1 ring-white/10">
            <p className="text-3xl font-bold tracking-tight text-white">
              £3.99
              <span className="text-sm font-normal text-white/50">/month</span>
            </p>
            <p className="mt-1 text-xs text-white/45">or £34.99/year — save 27%</p>
          </div>

          {/* CTA */}
          <Link
            href="/settings/billing"
            className="group relative flex w-full items-center justify-center gap-2 overflow-hidden rounded-2xl bg-gradient-to-br from-[#0f2b2b] to-[#164040] py-4 text-sm font-semibold text-white shadow-[0_10px_30px_-10px_rgba(15,43,43,0.75)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_16px_38px_-12px_rgba(15,43,43,0.85)] active:translate-y-0 active:scale-[0.99]"
          >
            <span className="absolute inset-0 bg-gradient-to-r from-teal-500/0 via-teal-400/30 to-teal-500/0 opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
            <span className="relative">See plans</span>
          </Link>

          <button
            onClick={onClose}
            className="mt-2 w-full py-2.5 text-center text-xs font-medium text-neutral-400 transition-colors hover:text-neutral-600 dark:hover:text-neutral-300"
          >
            Maybe later
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}
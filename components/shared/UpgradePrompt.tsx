"use client";

import { X, Check } from "lucide-react";
import Link from "next/link";

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
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-end justify-center bg-black/50 sm:items-center">
      <div className="w-full max-w-sm rounded-t-3xl bg-white p-6 dark:bg-neutral-900 sm:rounded-3xl">
        <div className="mb-4 flex items-start justify-between">
          <div>
            <h3 className="text-lg font-semibold">Upgrade to Premium</h3>
            {reason && (
              <p className="mt-1 text-sm text-neutral-500">{reason}</p>
            )}
          </div>
          <button onClick={onClose} className="rounded-lg p-1.5 hover:bg-neutral-100 dark:hover:bg-white/5">
            <X size={18} />
          </button>
        </div>

        <ul className="mb-6 space-y-2.5">
          {PERKS.map((p) => (
            <li key={p} className="flex items-center gap-2.5 text-sm">
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-teal-500/15">
                <Check size={12} className="text-teal-600" />
              </span>
              {p}
            </li>
          ))}
        </ul>

        <div className="mb-4 rounded-2xl bg-neutral-50 p-4 text-center dark:bg-white/5">
          <p className="text-2xl font-bold">
            £3.99
            <span className="text-sm font-normal text-neutral-400">/month</span>
          </p>
          <p className="mt-0.5 text-xs text-neutral-400">or £34.99/year — save 27%</p>
        </div>

        <Link
          href="/pricing"
          className="block w-full rounded-xl bg-[#0f2b2b] py-3.5 text-center text-sm font-medium text-white"
        >
          See plans
        </Link>

        <button
          onClick={onClose}
          className="mt-2 w-full py-2 text-center text-xs text-neutral-400"
        >
          Maybe later
        </button>
      </div>
    </div>
  );
}
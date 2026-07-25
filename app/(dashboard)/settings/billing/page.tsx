"use client";

import { Check, X, Sparkles, Zap } from "lucide-react";
import PricingCTA from "@/components/pricing/PricingCTA";

const FREE_FEATURES = [
  "Track income",
  "Track expenses",
  "Basic categories",
  "Monthly dashboard",
  "Basic reports",
  "50 expenses per month",
];

const PREMIUM_FEATURES = [
  "Unlimited expenses",
  "Custom categories",
  "Receipt uploads",
  "PDF statement import",
  "PDF reports export",
  "Full spending history",
  "Advanced analytics",
];

const COMPARISON = [
  { feature: "Expense tracking", free: true, premium: true },
  { feature: "Custom categories", free: false, premium: true },
  { feature: "Receipt upload", free: false, premium: true },
  { feature: "PDF export", free: false, premium: true },
  { feature: "Unlimited history", free: false, premium: true },
];

export default function BillingPage() {
  return (
    <div className="relative min-h-full">
      {/* ambient background */}
      <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute -top-40 left-1/2 h-96 w-96 -translate-x-1/2 rounded-full bg-teal-300/20 blur-[130px] dark:bg-teal-500/10" />
        <div className="absolute -right-32 top-1/3 h-80 w-80 rounded-full bg-emerald-200/20 blur-[120px] dark:bg-emerald-500/6" />
      </div>

      <div className="mx-auto max-w-4xl space-y-8 p-4 pb-24 sm:p-6 lg:p-8">
        {/* header */}
        <header className="animate-fade-up text-center">
          <p className="mb-4 inline-flex items-center gap-2 rounded-full border border-teal-500/20 bg-teal-500/[0.07] px-4 py-1.5 text-xs font-medium text-teal-700 dark:text-teal-400">
            <Sparkles size={13} />
            Simple pricing · No hidden fees
          </p>
          <h1 className="text-2xl font-bold tracking-tight text-[#0a1f1f] sm:text-3xl dark:text-white">
            Choose the plan that fits your{" "}
            <span className="bg-gradient-to-r from-teal-500 to-emerald-400 bg-clip-text text-transparent">
              financial goals
            </span>
          </h1>
          <p className="mx-auto mt-3 max-w-md text-sm text-neutral-500 dark:text-neutral-400">
            Upgrade any time — your data carries over instantly.
          </p>
        </header>

        {/* cards */}
        <div className="animate-fade-up delay-100 grid items-start gap-5 sm:grid-cols-2">
          {/* free */}
          <div className="rounded-3xl border border-neutral-200/90 bg-white/85 p-7 shadow-[0_12px_40px_-18px_rgba(15,43,43,0.2)] backdrop-blur-xl dark:border-white/[0.08] dark:bg-white/[0.03]">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-neutral-500 dark:text-neutral-400">
              Free
            </h2>
            <p className="mt-3 text-4xl font-bold tracking-tight text-[#0a1f1f] dark:text-white">
              £0
              <span className="text-sm font-normal text-neutral-400"> / month</span>
            </p>
            <p className="mt-1 text-xs text-neutral-400">Free forever</p>

            <div className="mt-6">
              <PricingCTA plan="free" />
            </div>

            <ul className="mt-7 space-y-3">
              {FREE_FEATURES.map((f) => (
                <li key={f} className="flex items-start gap-2.5 text-sm text-neutral-600 dark:text-neutral-300">
                  <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-neutral-200/70 dark:bg-white/10">
                    <Check size={11} strokeWidth={3} className="text-neutral-500 dark:text-neutral-400" />
                  </span>
                  {f}
                </li>
              ))}
            </ul>
          </div>

          {/* premium */}
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#0f2b2b] via-[#143838] to-[#0a1f1f] p-7 text-white shadow-[0_30px_80px_-24px_rgba(15,43,43,0.8)] ring-1 ring-white/10 sm:-mt-2 sm:scale-[1.02]">
            <div
              className="pointer-events-none absolute inset-0 opacity-70"
              style={{
                background:
                  "radial-gradient(circle at 75% 15%, #14b8a640 0%, transparent 55%)",
              }}
            />
            <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/25 to-transparent" />

            <span className="absolute right-6 top-6 flex items-center gap-1 rounded-full bg-teal-500/20 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide text-teal-300 ring-1 ring-teal-400/25">
              <Zap size={10} />
              Most popular
            </span>

            <div className="relative">
              <h2 className="text-sm font-semibold uppercase tracking-wide text-teal-400">
                Premium
              </h2>
              <p className="mt-3 text-4xl font-bold tracking-tight text-white">
                £3.99
                <span className="text-sm font-normal text-white/50"> / month</span>
              </p>
              <p className="mt-1 text-xs text-white/40">or £34.99/year · cancel anytime</p>

              <div className="mt-6">
                <PricingCTA plan="premium" variant="dark" />
              </div>

              <ul className="mt-7 space-y-3">
                {PREMIUM_FEATURES.map((f) => (
                  <li key={f} className="flex items-start gap-2.5 text-sm text-white/85">
                    <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-teal-500/20 ring-1 ring-teal-400/25">
                      <Check size={11} strokeWidth={3} className="text-teal-400" />
                    </span>
                    {f}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* comparison */}
        <div className="animate-fade-up delay-200 overflow-hidden rounded-3xl border border-neutral-200/90 bg-white/85 shadow-[0_12px_40px_-18px_rgba(15,43,43,0.2)] backdrop-blur-xl dark:border-white/[0.08] dark:bg-white/[0.03]">
          <div className="grid grid-cols-[1fr_auto_auto] items-center gap-4 border-b border-neutral-100 px-5 py-3.5 text-xs font-semibold uppercase tracking-wide text-neutral-500 sm:px-6 dark:border-white/5 dark:text-neutral-400">
            <span>Feature</span>
            <span className="w-14 text-center">Free</span>
            <span className="w-14 text-center text-teal-600 dark:text-teal-400">Premium</span>
          </div>

          {COMPARISON.map((row, i) => (
            <div
              key={row.feature}
              className={`grid grid-cols-[1fr_auto_auto] items-center gap-4 px-5 py-3.5 text-sm sm:px-6 ${
                i !== COMPARISON.length - 1
                  ? "border-b border-neutral-100 dark:border-white/5"
                  : ""
              }`}
            >
              <span className="font-medium text-[#0a1f1f] dark:text-white">
                {row.feature}
              </span>
              <span className="flex w-14 justify-center">
                {row.free ? (
                  <Check size={16} className="text-teal-600 dark:text-teal-400" strokeWidth={2.4} />
                ) : (
                  <X size={16} className="text-neutral-300 dark:text-neutral-600" />
                )}
              </span>
              <span className="flex w-14 justify-center">
                {row.premium ? (
                  <Check size={16} className="text-teal-600 dark:text-teal-400" strokeWidth={2.4} />
                ) : (
                  <X size={16} className="text-neutral-300 dark:text-neutral-600" />
                )}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
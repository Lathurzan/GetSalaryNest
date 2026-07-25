"use client";

import { useEffect, useState } from "react";
import { TrendingDown, TrendingUp, Lock, BarChart3, PieChart, Sparkles } from "lucide-react";
import Link from "next/link";
import MonthSwitcher from "@/components/shared/MonthSwitcher";
import CategoryDonut from "@/components/charts/CategoryDonut";
import MonthlyBars from "@/components/charts/MonthlyBars";
import CategoryBreakdown from "@/components/charts/CategoryBreakdown";
import { format } from "@/lib/money";
import { monthKey } from "@/lib/dates";
import ExportButton from "@/components/reports/ExportButton";

export default function ReportsPage() {
  const [month, setMonth] = useState(monthKey(new Date()));
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      setLoading(true);
      const res = await fetch(`/api/reports?month=${month}`);
      if (res.ok) setData(await res.json());
      setLoading(false);
    })();
  }, [month]);

  if (loading) {
    return (
      <div className="mx-auto max-w-3xl space-y-5 p-4 sm:p-6 lg:p-8">
        <div className="h-9 w-40 animate-pulse rounded-xl bg-neutral-200 dark:bg-white/10" />
        <div className="h-36 animate-pulse rounded-3xl bg-neutral-200 dark:bg-white/10" />
        <div className="h-72 animate-pulse rounded-3xl bg-neutral-100 dark:bg-white/5" />
        <div className="h-72 animate-pulse rounded-3xl bg-neutral-100 dark:bg-white/5" />
      </div>
    );
  }

  const expenseCats = (data?.categories ?? []).filter((c: any) => c.type !== "savings");
  const totalSpent = expenseCats.reduce((s: number, c: any) => s + c.spent, 0);

  const current = data?.trend?.[data.trend.length - 1];
  const previous = data?.trend?.[data.trend.length - 2];
  const diff = current && previous ? current.spent - previous.spent : null;
  const up = diff !== null && diff > 0;

  return (
    <div className="relative min-h-full">
      {/* ambient background */}
      <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute -top-40 right-0 h-96 w-96 rounded-full bg-teal-300/20 blur-[130px] dark:bg-teal-500/10" />
        <div className="absolute -left-32 top-1/2 h-80 w-80 rounded-full bg-cyan-200/20 blur-[120px] dark:bg-cyan-500/6" />
        <div
          className="absolute inset-0 opacity-[0.05] dark:opacity-[0.04]"
          style={{
            backgroundImage:
              "linear-gradient(to right, #0f2b2b 1px, transparent 1px), linear-gradient(to bottom, #0f2b2b 1px, transparent 1px)",
            backgroundSize: "56px 56px",
            maskImage:
              "radial-gradient(ellipse 60% 50% at 50% 0%, black 30%, transparent 90%)",
            WebkitMaskImage:
              "radial-gradient(ellipse 60% 50% at 50% 0%, black 30%, transparent 90%)",
          }}
        />
      </div>

      <div className="mx-auto max-w-3xl space-y-6 p-4 pb-24 sm:p-6 lg:p-8">
        {/* header + toolbar */}
        <header className="animate-fade-up flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-[#0a1f1f] sm:text-[1.75rem] dark:text-white">
              Reports
            </h1>
            <p className="mt-0.5 text-sm text-neutral-500 dark:text-neutral-400">
              Analyze your spending and savings trends.
            </p>
          </div>

          <div className="flex shrink-0 items-center gap-2 rounded-2xl border border-neutral-200/90 bg-white/85 p-1 shadow-[0_4px_20px_-8px_rgba(15,43,43,0.2)] backdrop-blur-xl dark:border-white/10 dark:bg-white/[0.2]">
            <ExportButton month={month} />
            <div className="h-6 w-px bg-neutral-200 dark:bg-white/10" />
            <MonthSwitcher month={month} onChange={setMonth} />
          </div>
        </header>

        {/* summary hero */}
        <div className="animate-fade-up delay-100 relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#0f2b2b] via-[#143838] to-[#0a1f1f] p-6 shadow-[0_24px_70px_-24px_rgba(15,43,43,0.75)] ring-1 ring-white/10 sm:p-7">
          <div
            className="pointer-events-none absolute inset-0 opacity-70"
            style={{
              background:
                "radial-gradient(circle at 82% 25%, #14b8a640 0%, transparent 55%)",
            }}
          />
          <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/25 to-transparent" />

          <div className="relative flex items-start justify-between">
            <div>
              <p className="text-[10px] font-medium uppercase tracking-[0.14em] text-white/50">
                Spent this month
              </p>
              <p className="mt-3 text-4xl font-bold tracking-[-0.03em] text-white">
                {format(totalSpent)}
              </p>

              {diff !== null && (
                <div
                  className={`mt-4 inline-flex items-center gap-2 rounded-full py-1 pl-1 pr-3 text-xs font-semibold ${
                    up
                      ? "bg-red-500/15 text-red-300"
                      : "bg-teal-500/15 text-teal-300"
                  }`}
                >
                  <span
                    className={`flex h-6 w-6 items-center justify-center rounded-full ${
                      up ? "bg-red-500/25" : "bg-teal-500/25"
                    }`}
                  >
                    {up ? <TrendingUp size={13} /> : <TrendingDown size={13} />}
                  </span>
                  {format(Math.abs(diff))} {up ? "more" : "less"} than last month
                </div>
              )}
            </div>

            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white/[0.08] ring-1 ring-white/10">
              <BarChart3 size={22} className="text-teal-400" strokeWidth={1.9} />
            </div>
          </div>
        </div>

        {/* trend */}
        <section className="animate-fade-up delay-200 rounded-3xl border border-neutral-200/90 bg-white/85 p-5 shadow-[0_12px_40px_-16px_rgba(15,43,43,0.18)] backdrop-blur-xl transition-shadow duration-300 hover:shadow-[0_16px_48px_-18px_rgba(15,43,43,0.25)] sm:p-6 dark:border-white/[0.08] dark:bg-white/[0.03]">
          <div className="mb-4">
            <h2 className="text-[0.9375rem] font-bold tracking-tight text-[#0a1f1f] dark:text-white">
              Spending vs savings
            </h2>
            <p className="mt-0.5 text-xs text-neutral-500 dark:text-neutral-400">
              How your outgoings compare month to month
            </p>
          </div>

          <MonthlyBars data={data?.trend ?? []} />

          {data?.limitedHistory && (
            <div className="mt-4 flex flex-col gap-3 rounded-2xl border border-teal-500/20 bg-gradient-to-br from-teal-500/[0.08] to-emerald-500/[0.04] p-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-start gap-3">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-teal-500/15 ring-1 ring-teal-500/25">
                  <Lock size={15} className="text-teal-600 dark:text-teal-400" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-[#0a1f1f] dark:text-white">
                    Unlock full history
                  </p>
                  <p className="mt-0.5 text-xs text-neutral-500 dark:text-neutral-400">
                    Free plan shows 3 months of data.
                  </p>
                </div>
              </div>

              <Link
                href="/pricing"
                className="flex shrink-0 items-center justify-center gap-1.5 rounded-xl bg-gradient-to-br from-[#0f2b2b] to-[#164040] px-4 py-2.5 text-xs font-semibold text-white shadow-[0_8px_20px_-8px_rgba(15,43,43,0.6)] transition-transform hover:-translate-y-0.5 active:scale-95"
              >
                <Sparkles size={13} className="text-teal-400" />
                Upgrade
              </Link>
            </div>
          )}
        </section>

        {/* donut */}
        <section className="animate-fade-up delay-300 rounded-3xl border border-neutral-200/90 bg-white/85 p-5 shadow-[0_12px_40px_-16px_rgba(15,43,43,0.18)] backdrop-blur-xl transition-shadow duration-300 hover:shadow-[0_16px_48px_-18px_rgba(15,43,43,0.25)] sm:p-6 dark:border-white/[0.08] dark:bg-white/[0.03]">
          <div className="mb-2 flex items-center gap-2">
            <PieChart size={15} className="text-teal-600 dark:text-teal-400" />
            <div>
              <h2 className="text-[0.9375rem] font-bold tracking-tight text-[#0a1f1f] dark:text-white">
                Where it went
              </h2>
            </div>
          </div>
          <p className="mb-2 text-xs text-neutral-500 dark:text-neutral-400">
            Share of spending across your categories
          </p>
          <CategoryDonut data={expenseCats} total={totalSpent} />
        </section>

        {/* breakdown */}
        <section className="animate-fade-up delay-[400ms] rounded-3xl border border-neutral-200/90 bg-white/85 p-5 shadow-[0_12px_40px_-16px_rgba(15,43,43,0.18)] backdrop-blur-xl sm:p-6 dark:border-white/[0.08] dark:bg-white/[0.03]">
          <div className="mb-4">
            <h2 className="text-[0.9375rem] font-bold tracking-tight text-[#0a1f1f] dark:text-white">
              By category
            </h2>
            <p className="mt-0.5 text-xs text-neutral-500 dark:text-neutral-400">
              Every category, ranked by spend
            </p>
          </div>
          <CategoryBreakdown rows={expenseCats} total={totalSpent} />
        </section>
      </div>
    </div>
  );
}
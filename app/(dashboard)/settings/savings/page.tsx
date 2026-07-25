"use client";

import { useEffect, useState } from "react";
import {
  PiggyBank,
  Percent,
  Banknote,
  Wallet,
  TrendingUp,
  Info,
  Check,
  Loader2,
} from "lucide-react";
import { toPence, toDisplay, format } from "@/lib/money";
import { monthKey, monthLabel } from "@/lib/dates";
import MonthSwitcher from "@/components/shared/MonthSwitcher";
import { cn } from "@/lib/utils";

export default function SavingsSettingsPage() {
  const [month, setMonth] = useState(monthKey(new Date()));
  const [mode, setMode] = useState<"percent" | "fixed">("percent");
  const [percent, setPercent] = useState(20);
  const [fixed, setFixed] = useState("");
  const [income, setIncome] = useState(0);
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      setLoading(true);
      const [g, i] = await Promise.all([
        fetch(`/api/savings?month=${month}`).then((r) => r.json()),
        fetch(`/api/income?month=${month}`).then((r) => r.json()),
      ]);
      setMode(g.mode ?? "percent");
      setPercent(g.percentTarget ?? 20);
      setFixed(g.fixedTarget ? toDisplay(g.fixedTarget) : "");
      setIncome(i.total ?? 0);
      setLoading(false);
    })();
  }, [month]);

  const preview =
    mode === "percent" ? Math.round((income * percent) / 100) : toPence(fixed || "0");

  const save = async () => {
    await fetch("/api/savings", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        month,
        mode,
        percentTarget: percent,
        fixedTarget: toPence(fixed || "0"),
      }),
    });
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const remaining = Math.max(0, income - preview);
  const spendPct = income > 0 ? Math.min(100, Math.round((preview / income) * 100)) : 0;

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Loader2 size={22} className="animate-spin text-teal-500" />
      </div>
    );
  }

  return (
    <div className="relative min-h-full">
      {/* ambient background */}
      <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute -top-40 right-0 h-96 w-96 rounded-full bg-teal-300/20 blur-[130px] dark:bg-teal-500/10" />
        <div className="absolute -left-32 top-1/2 h-80 w-80 rounded-full bg-emerald-200/20 blur-[120px] dark:bg-emerald-500/6" />
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

      <div className="mx-auto max-w-lg space-y-6 p-4 sm:p-6 lg:p-8">
        {/* header */}
        <header className="animate-fade-up flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex items-start gap-3">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-teal-500/20 to-emerald-500/10 ring-1 ring-teal-500/25">
              <PiggyBank
                size={20}
                strokeWidth={2}
                className="text-teal-600 dark:text-teal-400"
              />
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-[#0a1f1f] dark:text-white">
                Savings goal
              </h1>
              <p className="mt-0.5 text-sm text-neutral-500 dark:text-neutral-400">
                Plan how much you want to save every month.
              </p>
            </div>
          </div>

          <div className="shrink-0 rounded-2xl border border-neutral-200/90 bg-white/85 p-1 shadow-[0_4px_20px_-8px_rgba(15,43,43,0.2)] backdrop-blur-xl dark:border-white/10 dark:bg-white/[0.5]">
            <MonthSwitcher month={month} onChange={setMonth} />
          </div>
        </header>

        {/* mode toggle — segmented control */}
        <div className="animate-fade-up delay-100 relative flex rounded-2xl border border-neutral-200/90 bg-neutral-100/80 p-1 backdrop-blur-sm dark:border-white/[0.08] dark:bg-white/[0.04]">
          {/* sliding indicator */}
          <div
            className="absolute inset-y-1 w-[calc(50%-0.25rem)] rounded-xl bg-white shadow-[0_2px_12px_-2px_rgba(15,43,43,0.25)] transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] dark:bg-neutral-800"
            style={{
              transform: mode === "fixed" ? "translateX(100%)" : "translateX(0)",
            }}
          />
          {(["percent", "fixed"] as const).map((m) => (
            <button
              key={m}
              onClick={() => setMode(m)}
              className={cn(
                "relative z-10 flex flex-1 items-center justify-center gap-2 rounded-xl py-2.5 text-sm font-semibold transition-colors duration-200",
                mode === m
                  ? "text-[#0a1f1f] dark:text-white"
                  : "text-neutral-500 hover:text-neutral-700 dark:text-neutral-400 dark:hover:text-neutral-200"
              )}
            >
              {m === "percent" ? <Percent size={14} /> : <Banknote size={14} />}
              {m === "percent" ? "% of income" : "Fixed amount"}
            </button>
          ))}
        </div>

        {/* input area */}
        <div className="animate-fade-up delay-200 rounded-3xl border border-neutral-200/90 bg-white/85 p-6 shadow-[0_12px_40px_-16px_rgba(15,43,43,0.18)] backdrop-blur-xl dark:border-white/[0.08] dark:bg-white/[0.03]">
          {mode === "percent" ? (
            <div>
              <div className="mb-5 flex items-center justify-between">
                <label className="text-sm font-medium text-neutral-600 dark:text-neutral-300">
                  Save this much of income
                </label>
                <div className="flex items-baseline gap-0.5 rounded-xl bg-gradient-to-br from-teal-500/15 to-emerald-500/10 px-3 py-1.5 ring-1 ring-teal-500/20">
                  <span className="text-2xl font-bold tabular-nums text-teal-700 dark:text-teal-400">
                    {percent}
                  </span>
                  <span className="text-sm font-semibold text-teal-600/70 dark:text-teal-400/70">
                    %
                  </span>
                </div>
              </div>

              <div className="relative">
                {/* gradient fill track */}
                <div className="pointer-events-none absolute left-0 top-1/2 h-2 w-full -translate-y-1/2 overflow-hidden rounded-full bg-neutral-200 dark:bg-white/10">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-teal-500 to-emerald-400 transition-all duration-150"
                    style={{ width: `${(percent / 60) * 100}%` }}
                  />
                </div>
                <input
                  type="range"
                  min={0}
                  max={60}
                  step={1}
                  value={percent}
                  onChange={(e) => setPercent(Number(e.target.value))}
                  className="savings-slider relative h-2 w-full cursor-pointer appearance-none bg-transparent"
                />
              </div>

              <div className="mt-3 flex justify-between text-xs font-medium text-neutral-400">
                <span>0%</span>
                <span>30%</span>
                <span>60%</span>
              </div>
            </div>
          ) : (
            <div>
              <label className="mb-3 block text-sm font-medium text-neutral-600 dark:text-neutral-300">
                Target amount
              </label>
              <div className="group flex items-center gap-2 rounded-2xl border border-neutral-300 bg-white px-4 py-3.5 transition-all duration-200 focus-within:border-teal-600 focus-within:ring-4 focus-within:ring-teal-500/15 dark:border-white/15 dark:bg-white/[0.06] dark:focus-within:border-teal-400">
                <Banknote
                  size={18}
                  className="shrink-0 text-neutral-400 transition-colors group-focus-within:text-teal-600 dark:group-focus-within:text-teal-400"
                />
                <span className="text-lg font-medium text-neutral-400">£</span>
                <input
                  type="text"
                  inputMode="decimal"
                  value={fixed}
                  onChange={(e) => setFixed(e.target.value.replace(/[^0-9.]/g, ""))}
                  placeholder="1400.00"
                  className="w-full bg-transparent text-lg font-semibold text-[#0a1f1f] outline-none placeholder:text-neutral-300 dark:text-white dark:placeholder:text-white/25"
                />
              </div>
            </div>
          )}
        </div>

        {/* preview card */}
        <div className="animate-fade-up delay-300 relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#0f2b2b] via-[#143838] to-[#0a1f1f] p-6 shadow-[0_24px_70px_-24px_rgba(15,43,43,0.75)] ring-1 ring-white/10 sm:p-7">
          <div
            className="pointer-events-none absolute inset-0 opacity-70"
            style={{
              background:
                "radial-gradient(circle at 80% 20%, #14b8a640 0%, transparent 55%)",
            }}
          />
          <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/25 to-transparent" />

          <div className="relative">
            <div className="flex items-center gap-1.5 text-[10px] font-medium uppercase tracking-[0.14em] text-white/50">
              <TrendingUp size={11} strokeWidth={2.4} className="text-teal-400" />
              Target for {monthLabel(month)}
            </div>

            <p className="mt-3 text-4xl font-bold tracking-[-0.03em] text-white">
              {format(preview)}
            </p>

            {income > 0 ? (
              <>
                {/* split bar */}
                <div className="mt-5 flex h-2 w-full overflow-hidden rounded-full bg-white/[0.08]">
                  <div
                    className="h-full bg-gradient-to-r from-teal-500 to-emerald-400 transition-all duration-500"
                    style={{ width: `${spendPct}%` }}
                  />
                </div>

                <div className="mt-4 grid grid-cols-2 gap-3">
                  <div className="rounded-2xl bg-white/[0.06] p-3.5 ring-1 ring-white/10">
                    <div className="flex items-center gap-1.5 text-[10px] font-medium uppercase tracking-wider text-white/45">
                      <PiggyBank size={11} className="text-teal-400" />
                      Saving
                    </div>
                    <p className="mt-1.5 text-lg font-semibold text-white">
                      {format(preview)}
                    </p>
                  </div>
                  <div className="rounded-2xl bg-white/[0.06] p-3.5 ring-1 ring-white/10">
                    <div className="flex items-center gap-1.5 text-[10px] font-medium uppercase tracking-wider text-white/45">
                      <Wallet size={11} className="text-white/60" />
                      To spend
                    </div>
                    <p className="mt-1.5 text-lg font-semibold text-white">
                      {format(remaining)}
                    </p>
                  </div>
                </div>

                <p className="mt-3.5 text-xs text-white/40">
                  From {format(income)} income this month
                </p>
              </>
            ) : (
              <p className="mt-3 text-xs text-white/40">
                Add your income to see how this splits
              </p>
            )}
          </div>
        </div>

        {/* save button */}
        <button
          onClick={save}
          className={cn(
            "animate-fade-up delay-[400ms] group relative flex w-full items-center justify-center gap-2 overflow-hidden rounded-2xl py-4 text-sm font-semibold text-white shadow-[0_10px_30px_-10px_rgba(15,43,43,0.75)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_16px_38px_-12px_rgba(15,43,43,0.85)] active:translate-y-0 active:scale-[0.99]",
            saved
              ? "bg-gradient-to-br from-teal-600 to-emerald-500"
              : "bg-gradient-to-br from-[#0f2b2b] to-[#164040]"
          )}
        >
          <span className="absolute inset-0 bg-gradient-to-r from-teal-500/0 via-teal-400/30 to-teal-500/0 opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
          <span className="relative flex items-center gap-2">
            {saved ? (
              <>
                <Check size={16} strokeWidth={2.6} />
                Saved
              </>
            ) : (
              "Save goal"
            )}
          </span>
        </button>

        {/* info card */}
        <div className="animate-fade-up delay-500 flex items-start gap-3 rounded-2xl border border-teal-500/20 bg-teal-500/[0.06] p-4">
          <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-teal-500/15">
            <Info size={14} className="text-teal-600 dark:text-teal-400" strokeWidth={2.2} />
          </div>
          <p className="text-xs leading-relaxed text-neutral-600 dark:text-neutral-300">
            Log savings as an expense under the{" "}
            <strong className="font-semibold text-[#0a1f1f] dark:text-white">
              Savings
            </strong>{" "}
            category. Anything filed there counts toward this target.
          </p>
        </div>
      </div>
    </div>
  );
}
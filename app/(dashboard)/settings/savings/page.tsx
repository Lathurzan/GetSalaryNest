"use client";

import { useEffect, useState } from "react";
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

  if (loading) return <p className="p-6 text-sm text-neutral-400">Loading…</p>;

  return (
    <div className="mx-auto max-w-md space-y-6 p-4 sm:p-6">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold">Savings goal</h1>
        <MonthSwitcher month={month} onChange={setMonth} />
      </div>

      {/* mode toggle */}
      <div className="flex gap-2 rounded-2xl bg-neutral-100 p-1 dark:bg-white/5">
        {(["percent", "fixed"] as const).map((m) => (
          <button
            key={m}
            onClick={() => setMode(m)}
            className={cn(
              "flex-1 rounded-xl py-2.5 text-sm font-medium transition",
              mode === m ? "bg-white shadow-sm dark:bg-neutral-800" : "text-neutral-500"
            )}
          >
            {m === "percent" ? "% of income" : "Fixed amount"}
          </button>
        ))}
      </div>

      {mode === "percent" ? (
        <div>
          <div className="mb-3 flex items-baseline justify-between">
            <label className="text-sm text-neutral-500">Save this much of income</label>
            <span className="text-2xl font-semibold">{percent}%</span>
          </div>
          <input
            type="range"
            min={0}
            max={60}
            step={1}
            value={percent}
            onChange={(e) => setPercent(Number(e.target.value))}
            className="w-full accent-teal-500"
          />
          <div className="mt-1 flex justify-between text-xs text-neutral-400">
            <span>0%</span><span>30%</span><span>60%</span>
          </div>
        </div>
      ) : (
        <div>
          <label className="mb-2 block text-sm text-neutral-500">Target amount</label>
          <div className="flex items-center gap-2 rounded-xl border border-neutral-200 px-4 py-3 dark:border-white/10">
            <span className="text-neutral-400">£</span>
            <input
              type="text"
              inputMode="decimal"
              value={fixed}
              onChange={(e) => setFixed(e.target.value.replace(/[^0-9.]/g, ""))}
              placeholder="1400.00"
              className="w-full bg-transparent text-lg font-medium outline-none"
            />
          </div>
        </div>
      )}

      {/* preview */}
      <div className="rounded-2xl bg-gradient-to-br from-[#0f2b2b] to-[#113c3c] p-5 text-white">
        <p className="text-xs text-white/50">TARGET FOR {monthLabel(month).toUpperCase()}</p>
        <p className="mt-1.5 text-3xl font-semibold">{format(preview)}</p>
        <p className="mt-1 text-xs text-white/40">
          {income > 0
            ? `Income ${format(income)} · leaves ${format(Math.max(0, income - preview))} to spend`
            : "Add your income to see how this splits"}
        </p>
      </div>

      <button
        onClick={save}
        className="w-full rounded-xl bg-[#0f2b2b] py-3.5 text-sm font-medium text-white"
      >
        {saved ? "Saved ✓" : "Save goal"}
      </button>

      <p className="text-xs leading-relaxed text-neutral-400">
        Log savings as an expense under the <strong>Savings</strong> category. Anything filed there
        counts toward this target.
      </p>
    </div>
  );
}
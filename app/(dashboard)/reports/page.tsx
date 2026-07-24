"use client";

import { useEffect, useState } from "react";
import { TrendingDown, TrendingUp, Lock } from "lucide-react";
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
    return <p className="p-6 text-sm text-neutral-400">Loading reports…</p>;
  }

  const expenseCats = (data?.categories ?? []).filter((c: any) => c.type !== "savings");
  const totalSpent = expenseCats.reduce((s: number, c: any) => s + c.spent, 0);

  const current = data?.trend?.[data.trend.length - 1];
  const previous = data?.trend?.[data.trend.length - 2];
  const diff = current && previous ? current.spent - previous.spent : null;
  const up = diff !== null && diff > 0;

  return (
    <div className="mx-auto max-w-3xl space-y-7 p-4 sm:p-6">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold">Reports</h1>
        <MonthSwitcher month={month} onChange={setMonth} />
      </div>

      {/* headline */}
      <div className="rounded-2xl bg-neutral-50 p-5 dark:bg-white/5">
        <p className="text-xs text-neutral-500">Spent this month</p>
        <p className="mt-1 text-3xl font-semibold">{format(totalSpent)}</p>
        {diff !== null && (
          <p className={`mt-1.5 flex items-center gap-1 text-sm ${up ? "text-red-500" : "text-green-600"}`}>
            {up ? <TrendingUp size={15} /> : <TrendingDown size={15} />}
            {format(Math.abs(diff))} {up ? "more" : "less"} than last month
          </p>
        )}
      </div>

      {/* trend */}
      <section>
        <h2 className="mb-3 text-sm font-semibold text-neutral-500">
          Spending vs savings
        </h2>
        <MonthlyBars data={data?.trend ?? []} />
        {data?.limitedHistory && (
          <Link
            href="/pricing"
            className="mt-3 flex items-center gap-2 rounded-xl bg-teal-50 px-4 py-3 text-xs text-teal-700 dark:bg-teal-500/10 dark:text-teal-400"
          >
            <Lock size={14} />
            Free plan shows 3 months. Upgrade for full history.
          </Link>
        )}
      </section>

      {/* donut */}
      <section>
        <h2 className="mb-1 text-sm font-semibold text-neutral-500">
          Where it went
        </h2>
        <CategoryDonut data={expenseCats} total={totalSpent} />
      </section>

      {/* breakdown */}
      <section>
        <h2 className="mb-3 text-sm font-semibold text-neutral-500">
          By category
        </h2>
        <CategoryBreakdown rows={expenseCats} total={totalSpent} />
      </section>
      <div className="flex items-center justify-between">
  <h1 className="text-xl font-bold">Reports</h1>
  <div className="flex items-center gap-2">
    <ExportButton month={month} />
    <MonthSwitcher month={month} onChange={setMonth} />
  </div>
</div>
    </div>
  );
}
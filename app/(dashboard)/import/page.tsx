"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import {
  Upload,
  Loader2,
  Check,
  AlertTriangle,
  FileText,
  ListChecks,
  Coins,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  RotateCcw,
} from "lucide-react";
import UpgradePrompt from "@/components/shared/UpgradePrompt";
import { usePlan } from "@/lib/hooks/usePlan";
import { format } from "@/lib/money";

export default function ImportPage() {
  const router = useRouter();
  const { isPremium } = usePlan();
  const inputRef = useRef<HTMLInputElement>(null);

  const [rows, setRows] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [showUpgrade, setShowUpgrade] = useState(false);
  const [done, setDone] = useState(0);

  const upload = async (file: File) => {
    setBusy(true);
    setError("");

    const form = new FormData();
    form.append("file", file);

    const res = await fetch("/api/pdf/parse", { method: "POST", body: form });
    const data = await res.json();
    setBusy(false);

    if (!res.ok) {
      if (data.error === "PREMIUM_REQUIRED") return setShowUpgrade(true);
      return setError(data.error);
    }

    if (!data.rows.length) {
      return setError(
        "No transactions found. This statement format isn't supported yet — try adding them manually."
      );
    }

    setRows(data.rows.map((r: any) => ({ ...r, include: !!r.categoryId })));
    setCategories(data.categories);
  };

  const importRows = async () => {
    const selected = rows.filter((r) => r.include && r.categoryId);
    if (!selected.length) return setError("Pick a category for at least one row");

    setBusy(true);
    const res = await fetch("/api/expenses/bulk", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        rows: selected.map((r) => ({
          categoryId: r.categoryId,
          amount: r.amount,
          note: r.description,
          date: r.date,
        })),
      }),
    });
    const data = await res.json();
    setBusy(false);

    if (!res.ok) return setError(data.error);

    setDone(data.imported);
    setRows([]);
    setTimeout(() => router.push("/expenses"), 1800);
  };

  const update = (i: number, patch: any) =>
    setRows((prev) => prev.map((r, idx) => (idx === i ? { ...r, ...patch } : r)));

  const selectedCount = rows.filter((r) => r.include && r.categoryId).length;

  // display-only derived value for the summary card
  const selectedTotal = rows
    .filter((r) => r.include && r.categoryId)
    .reduce((s, r) => s + r.amount, 0);

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

      <div className="mx-auto max-w-3xl space-y-6 p-4 pb-24 sm:p-6 lg:p-8">
        {/* header hero */}
        <header className="animate-fade-up flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex items-start gap-3">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-teal-500/20 to-emerald-500/10 ring-1 ring-teal-500/25">
              <FileText size={20} strokeWidth={2} className="text-teal-600 dark:text-teal-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-bold tracking-tight text-[#0a1f1f] sm:text-[1.75rem] dark:text-white">
                  Import statement
                </h1>
                <span className="rounded-full bg-gradient-to-r from-teal-500/15 to-emerald-500/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-teal-700 ring-1 ring-teal-500/25 dark:text-teal-400">
                  Premium
                </span>
              </div>
              <p className="mt-0.5 text-sm text-neutral-500 dark:text-neutral-400">
                Upload a bank or card statement PDF and review before importing.
              </p>
            </div>
          </div>
        </header>

        {/* success */}
        {done > 0 && (
          <div className="animate-fade-up relative overflow-hidden rounded-3xl bg-gradient-to-br from-teal-600 to-emerald-500 p-6 text-white shadow-[0_20px_50px_-16px_rgba(16,185,129,0.5)]">
            <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/30 to-transparent" />
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-white/20 ring-1 ring-white/30">
                <CheckCircle2 size={22} strokeWidth={2.2} />
              </div>
              <div>
                <p className="text-base font-bold">Imported {done} transactions</p>
                <p className="mt-0.5 text-sm text-white/70">Redirecting to expenses…</p>
              </div>
            </div>
          </div>
        )}

        {/* upload */}
        {!rows.length && !done && (
          <>
            <input
              ref={inputRef}
              type="file"
              accept="application/pdf"
              className="hidden"
              onChange={(e) => e.target.files?.[0] && upload(e.target.files[0])}
            />

            <button
              onClick={() => (isPremium ? inputRef.current?.click() : setShowUpgrade(true))}
              disabled={busy}
              className="group animate-fade-up delay-100 relative flex w-full flex-col items-center justify-center gap-4 overflow-hidden rounded-3xl border-2 border-dashed border-teal-500/30 bg-gradient-to-br from-teal-500/[0.06] to-emerald-500/[0.02] px-6 py-12 transition-all duration-300 hover:-translate-y-1 hover:border-teal-500/50 hover:shadow-[0_20px_50px_-20px_rgba(15,43,43,0.35)] disabled:cursor-not-allowed disabled:opacity-70 dark:border-teal-400/20 dark:hover:border-teal-400/40"
            >
              <div
                className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                style={{
                  background:
                    "radial-gradient(circle at 50% 30%, rgba(20,184,166,0.12) 0%, transparent 60%)",
                }}
              />

              <div className="relative flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-[#0f2b2b] to-[#164040] shadow-[0_10px_30px_-8px_rgba(15,43,43,0.6)]">
                {busy ? (
                  <Loader2 size={26} className="animate-spin text-teal-400" />
                ) : (
                  <Upload
                    size={26}
                    className="text-teal-400 transition-transform duration-500 group-hover:-translate-y-0.5 group-hover:scale-110"
                  />
                )}
              </div>

              <div className="relative text-center">
                <p className="text-base font-semibold text-[#0a1f1f] dark:text-white">
                  {busy ? "Reading PDF…" : "Choose a statement PDF"}
                </p>
                <p className="mt-1 text-xs text-neutral-500 dark:text-neutral-400">
                  {busy ? "This may take a moment" : "or drag and drop it here"}
                </p>
              </div>

              <div className="relative flex flex-wrap items-center justify-center gap-2 text-[11px]">
                <span className="rounded-full bg-white/70 px-3 py-1 font-medium text-neutral-600 ring-1 ring-neutral-200 dark:bg-white/5 dark:text-neutral-300 dark:ring-white/10">
                  PDF only
                </span>
                <span className="rounded-full bg-white/70 px-3 py-1 font-medium text-neutral-600 ring-1 ring-neutral-200 dark:bg-white/5 dark:text-neutral-300 dark:ring-white/10">
                  Max 10MB
                </span>
                <span className="rounded-full bg-white/70 px-3 py-1 font-medium text-neutral-600 ring-1 ring-neutral-200 dark:bg-white/5 dark:text-neutral-300 dark:ring-white/10">
                  Text PDFs
                </span>
              </div>
            </button>

            {/* beta notice */}
            <div className="animate-fade-up delay-200 flex gap-3 rounded-2xl border border-amber-300/50 bg-gradient-to-br from-amber-50 to-orange-50/50 p-4 shadow-sm dark:border-amber-500/20 dark:from-amber-500/10 dark:to-orange-500/5">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-amber-500/15 ring-1 ring-amber-500/25">
                <AlertTriangle size={15} className="text-amber-600 dark:text-amber-400" />
              </div>
              <div className="text-xs leading-relaxed text-amber-800 dark:text-amber-200/90">
                <p className="mb-1 font-bold text-amber-900 dark:text-amber-200">Beta feature</p>
                Every bank formats statements differently. If nothing is detected, your bank's
                layout isn't supported yet. Scanned or photographed statements won't work — the
                PDF must contain real text.
              </div>
            </div>
          </>
        )}

        {/* review */}
        {rows.length > 0 && (
          <>
            {/* summary stat cards */}
            <div className="animate-fade-up grid grid-cols-2 gap-3 sm:grid-cols-4">
              {[
                { icon: FileText, label: "Found", value: String(rows.length), tint: "text-neutral-600 dark:text-neutral-300" },
                { icon: ListChecks, label: "Selected", value: String(selectedCount), tint: "text-teal-600 dark:text-teal-400" },
                { icon: Coins, label: "Total", value: format(selectedTotal), tint: "text-[#0a1f1f] dark:text-white" },
                { icon: Sparkles, label: "Status", value: selectedCount ? "Ready" : "Pick rows", tint: selectedCount ? "text-teal-600 dark:text-teal-400" : "text-neutral-400" },
              ].map(({ icon: Icon, label, value, tint }) => (
                <div
                  key={label}
                  className="rounded-2xl border border-neutral-200/90 bg-white/85 p-3.5 shadow-sm backdrop-blur-xl transition-transform duration-300 hover:-translate-y-0.5 dark:border-white/[0.08] dark:bg-white/[0.03]"
                >
                  <Icon size={15} className="text-neutral-400" />
                  <p className="mt-2 text-[10px] font-medium uppercase tracking-wide text-neutral-400">
                    {label}
                  </p>
                  <p className={`mt-0.5 truncate text-lg font-bold tabular-nums ${tint}`}>
                    {value}
                  </p>
                </div>
              ))}
            </div>

            <div className="animate-fade-up delay-100 flex items-center justify-between">
              <p className="text-sm font-medium text-neutral-600 dark:text-neutral-300">
                Review transactions
              </p>
              <button
                onClick={() => setRows([])}
                className="flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-medium text-neutral-500 transition-colors hover:bg-neutral-100 hover:text-neutral-700 dark:hover:bg-white/5 dark:hover:text-neutral-300"
              >
                <RotateCcw size={13} />
                Start over
              </button>
            </div>

            {/* rows */}
            <div className="animate-fade-up delay-200 space-y-2">
              {rows.map((r, i) => (
                <div
                  key={i}
                  className={`flex items-center gap-3 rounded-2xl border p-3 text-sm shadow-sm backdrop-blur-sm transition-all duration-200 ${
                    r.include
                      ? "border-neutral-200/90 bg-white/85 hover:-translate-y-0.5 hover:shadow-md dark:border-white/[0.08] dark:bg-white/[0.03]"
                      : "border-transparent bg-neutral-100/60 opacity-55 dark:bg-white/[0.02]"
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={r.include}
                    onChange={(e) => update(i, { include: e.target.checked })}
                    className="h-4 w-4 shrink-0 accent-teal-500"
                  />

                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-teal-500/12 to-emerald-500/5 ring-1 ring-teal-500/15">
                    <Coins size={15} className="text-teal-600 dark:text-teal-400" />
                  </div>

                  <div className="w-14 shrink-0 text-xs font-medium text-neutral-400">
                    {new Date(r.date).toLocaleDateString("en-GB", {
                      day: "2-digit",
                      month: "short",
                    })}
                  </div>

                  <div className="min-w-0 flex-1 truncate font-medium text-[#0a1f1f] dark:text-white">
                    {r.description}
                  </div>

                  <select
                    value={r.categoryId}
                    onChange={(e) => update(i, { categoryId: e.target.value })}
                    className="w-28 shrink-0 rounded-lg border border-neutral-200 bg-white px-2 py-1.5 text-xs outline-none transition-colors focus:border-teal-500 sm:w-32 dark:border-white/10 dark:bg-white/[0.04] dark:text-white"
                  >
                    <option value="">Category…</option>
                    {categories.map((c) => (
                      <option key={c._id} value={c._id}>
                        {c.name}
                      </option>
                    ))}
                  </select>

                  <div className="w-20 shrink-0 text-right font-bold tabular-nums text-[#0a1f1f] dark:text-white">
                    {format(r.amount)}
                  </div>
                </div>
              ))}
            </div>

            {/* import CTA */}
            <button
              onClick={importRows}
              disabled={busy || !selectedCount}
              className="group animate-fade-up delay-300 relative flex w-full items-center justify-center gap-2 overflow-hidden rounded-2xl bg-gradient-to-br from-[#0f2b2b] to-[#164040] py-4 text-sm font-semibold text-white shadow-[0_10px_30px_-10px_rgba(15,43,43,0.75)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_16px_38px_-12px_rgba(15,43,43,0.85)] active:translate-y-0 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:translate-y-0"
            >
              <span className="absolute inset-0 bg-gradient-to-r from-teal-500/0 via-teal-400/30 to-teal-500/0 opacity-0 transition-opacity duration-500 group-hover:opacity-100 group-disabled:opacity-0" />
              <span className="relative flex items-center gap-2">
                {busy && <Loader2 size={15} className="animate-spin" />}
                {busy ? "Importing…" : `Import ${selectedCount} transactions`}
              </span>
            </button>
          </>
        )}

        {/* error */}
        {error && (
          <div className="animate-fade-up flex items-start gap-2.5 rounded-2xl border border-red-300 bg-red-50 px-4 py-3 dark:border-red-500/30 dark:bg-red-500/12">
            <AlertCircle
              size={15}
              strokeWidth={2.2}
              className="mt-0.5 shrink-0 text-red-600 dark:text-red-400"
            />
            <p className="text-sm font-medium leading-snug text-red-700 dark:text-red-300">
              {error}
            </p>
          </div>
        )}

        <UpgradePrompt
          open={showUpgrade}
          onClose={() => setShowUpgrade(false)}
          reason="Statement import is a Premium feature."
        />
      </div>
    </div>
  );
}
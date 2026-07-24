"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { Upload, Loader2, Check, AlertTriangle } from "lucide-react";
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

  return (
    <div className="mx-auto max-w-3xl space-y-5 p-4 sm:p-6">
      <div>
        <h1 className="text-xl font-bold">Import statement</h1>
        <p className="mt-1 text-sm text-neutral-500">
          Upload a bank or card statement PDF and review before importing.
        </p>
      </div>

      {done > 0 && (
        <div className="flex items-center gap-2 rounded-xl bg-green-50 px-4 py-3 text-sm text-green-700 dark:bg-green-500/10">
          <Check size={16} /> Imported {done} transactions. Redirecting…
        </div>
      )}

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
            className="flex h-40 w-full flex-col items-center justify-center gap-2 rounded-2xl border border-dashed border-neutral-200 text-neutral-400 transition hover:border-neutral-300 dark:border-white/10"
          >
            {busy ? <Loader2 size={24} className="animate-spin" /> : <Upload size={24} />}
            <span className="text-sm">
              {busy ? "Reading PDF…" : "Choose a statement PDF"}
            </span>
            <span className="text-xs text-neutral-300">Max 10MB · text PDFs only</span>
          </button>

          <div className="flex gap-2.5 rounded-xl bg-amber-50 p-4 text-xs text-amber-800 dark:bg-amber-500/10">
            <AlertTriangle size={15} className="mt-0.5 shrink-0" />
            <p className="leading-relaxed">
              <strong>Beta.</strong> Every bank formats statements differently. If nothing is
              detected, your bank's layout isn't supported yet. Scanned or photographed
              statements won't work — the PDF must contain real text.
            </p>
          </div>
        </>
      )}

      {rows.length > 0 && (
        <>
          <div className="flex items-center justify-between rounded-xl bg-neutral-50 px-4 py-3 text-sm dark:bg-white/5">
            <span>
              Found <strong>{rows.length}</strong> · importing{" "}
              <strong>{selectedCount}</strong>
            </span>
            <button
              onClick={() => setRows([])}
              className="text-xs text-neutral-400 hover:underline"
            >
              Start over
            </button>
          </div>

          <div className="space-y-1.5">
            {rows.map((r, i) => (
              <div
                key={i}
                className={`flex items-center gap-3 rounded-xl border p-3 text-sm ${
                  r.include
                    ? "border-neutral-200 dark:border-white/10"
                    : "border-transparent bg-neutral-50 opacity-50 dark:bg-white/5"
                }`}
              >
                <input
                  type="checkbox"
                  checked={r.include}
                  onChange={(e) => update(i, { include: e.target.checked })}
                  className="h-4 w-4 shrink-0 accent-teal-500"
                />

                <div className="w-16 shrink-0 text-xs text-neutral-400">
                  {new Date(r.date).toLocaleDateString("en-GB", {
                    day: "2-digit",
                    month: "short",
                  })}
                </div>

                <div className="min-w-0 flex-1 truncate">{r.description}</div>

                <select
                  value={r.categoryId}
                  onChange={(e) => update(i, { categoryId: e.target.value })}
                  className="w-32 shrink-0 rounded-lg border border-neutral-200 px-2 py-1.5 text-xs dark:border-white/10 dark:bg-transparent"
                >
                  <option value="">Category…</option>
                  {categories.map((c) => (
                    <option key={c._id} value={c._id}>
                      {c.name}
                    </option>
                  ))}
                </select>

                <div className="w-20 shrink-0 text-right font-semibold tabular-nums">
                  {format(r.amount)}
                </div>
              </div>
            ))}
          </div>

          <button
            onClick={importRows}
            disabled={busy || !selectedCount}
            className="w-full rounded-xl bg-[#0f2b2b] py-3.5 text-sm font-medium text-white disabled:opacity-50"
          >
            {busy ? "Importing…" : `Import ${selectedCount} transactions`}
          </button>
        </>
      )}

      {error && <p className="text-sm text-red-500">{error}</p>}

      <UpgradePrompt
        open={showUpgrade}
        onClose={() => setShowUpgrade(false)}
        reason="Statement import is a Premium feature."
      />
    </div>
  );
}
"use client";

import { useState, useEffect } from "react";
import {
  X,
  Banknote,
  Briefcase,
  CalendarDays,
  AlertCircle,
  Loader2,
} from "lucide-react";
import { toPence, toDisplay } from "@/lib/money";

interface Props {
  open: boolean;
  onClose: () => void;
  onSaved: () => void;
  month: string;
  current?: { amount: number; source: string; date: string } | null;
}

export default function IncomeForm({ open, onClose, onSaved, month, current }: Props) {
  const [amount, setAmount] = useState("");
  const [source, setSource] = useState("Salary");
  const [date, setDate] = useState("");
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const [y, m] = month.split("-").map(Number);
    setAmount(current ? toDisplay(current.amount) : "");
    setSource(current?.source ?? "Salary");
    setDate(
      current
        ? new Date(current.date).toISOString().slice(0, 10)
        : new Date(y, m - 1, 1).toISOString().slice(0, 10)
    );
    setError("");
  }, [current, open, month]);

  if (!open) return null;

  const submit = async () => {
    const pence = toPence(amount);
    if (!pence || pence < 1) return setError("Enter a valid amount");

    setSaving(true);
    const res = await fetch("/api/income", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ amount: pence, source, date: new Date(date).toISOString() }),
    });
    setSaving(false);

    if (!res.ok) {
      const d = await res.json();
      return setError(d.error ?? "Something went wrong");
    }

    onSaved();
    onClose();
  };

  const fieldClass =
    "w-full rounded-2xl border border-neutral-300 bg-white py-3.5 pl-11 pr-3.5 text-base text-neutral-900 outline-none transition-all duration-200 placeholder:text-neutral-500 hover:border-neutral-400 focus:border-teal-600 focus:ring-4 focus:ring-teal-500/15 sm:text-sm dark:border-white/15 dark:bg-white/[0.06] dark:text-white dark:hover:border-white/25 dark:focus:border-teal-400 dark:focus:bg-white/[0.09]";

  const fieldIconClass =
    "pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-500 transition-colors duration-200 group-focus-within:text-teal-600 dark:text-neutral-400 dark:group-focus-within:text-teal-400";

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center sm:p-4">
      {/* backdrop */}
      <div
        onClick={onClose}
        className="animate-overlay-in absolute inset-0 bg-gradient-to-b from-[#0a1f1f]/50 via-[#0a1f1f]/60 to-[#0a1f1f]/70 backdrop-blur-md"
      />

      {/* modal */}
      <div className="animate-modal-in relative w-full max-w-md overflow-hidden rounded-t-[1.75rem] border border-white/60 bg-white/95 shadow-[0_-8px_60px_-12px_rgba(0,0,0,0.4)] backdrop-blur-2xl sm:rounded-[1.75rem] sm:shadow-[0_30px_80px_-20px_rgba(0,0,0,0.5)] dark:border-white/[0.12] dark:bg-[#0d1817]/95">
        {/* gradient top border */}
        <div className="pointer-events-none absolute inset-x-10 top-0 h-px bg-gradient-to-r from-transparent via-teal-500/70 to-transparent" />

        {/* mobile grab handle */}
        <div className="flex justify-center pt-3 sm:hidden">
          <div className="h-1 w-10 rounded-full bg-neutral-300 dark:bg-white/20" />
        </div>

        <div className="p-6 pb-[calc(env(safe-area-inset-bottom)+1.5rem)] sm:p-7 sm:pb-7">
          {/* header */}
          <div className="mb-6 flex items-start justify-between gap-4">
            <div className="flex items-start gap-3">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-teal-500/20 to-emerald-500/10 ring-1 ring-teal-500/25">
                <Banknote
                  size={19}
                  strokeWidth={2}
                  className="text-teal-600 dark:text-teal-400"
                />
              </div>
              <div>
                <h3 className="text-lg font-bold tracking-tight text-[#0a1f1f] dark:text-white">
                  Add monthly income
                </h3>
                <p className="mt-0.5 text-xs text-neutral-500 dark:text-neutral-400">
                  Track your salary and income sources
                </p>
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

          {/* amount */}
          <div className="group relative mb-6 overflow-hidden rounded-[1.25rem] border border-neutral-200 bg-gradient-to-b from-neutral-50 to-white p-6 transition-all duration-300 focus-within:border-teal-500/50 focus-within:shadow-[0_0_0_4px_rgba(20,184,166,0.1)] dark:border-white/[0.08] dark:from-white/[0.04] dark:to-transparent dark:focus-within:border-teal-400/40">
            <div
              className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-focus-within:opacity-100"
              style={{
                background:
                  "radial-gradient(circle at 50% 100%, rgba(20,184,166,0.12) 0%, transparent 65%)",
              }}
            />

            <p className="relative text-center text-[10px] font-medium uppercase tracking-[0.14em] text-neutral-400">
              Amount received
            </p>

            <div className="relative mt-3 flex items-baseline justify-center gap-1.5">
              <span className="text-2xl font-medium text-neutral-400 transition-colors duration-300 group-focus-within:text-teal-600 dark:group-focus-within:text-teal-400">
                £
              </span>
              <input
                type="text"
                inputMode="decimal"
                autoFocus
                value={amount}
                onChange={(e) => setAmount(e.target.value.replace(/[^0-9.]/g, ""))}
                placeholder="0.00"
                className="w-44 bg-transparent text-center text-[2.75rem] font-bold leading-none tracking-[-0.03em] text-[#0a1f1f] outline-none placeholder:text-neutral-300 dark:text-white dark:placeholder:text-white/20"
              />
            </div>

            <div className="relative mx-auto mt-4 h-0.5 w-24 overflow-hidden rounded-full bg-neutral-200 dark:bg-white/10">
              <div className="h-full w-full origin-left scale-x-0 rounded-full bg-gradient-to-r from-teal-500 to-emerald-400 transition-transform duration-500 group-focus-within:scale-x-100" />
            </div>
          </div>

          {/* fields */}
          <div className="mb-5 grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div>
              <label className="mb-2 block text-xs font-semibold text-neutral-600 dark:text-neutral-300">
                Source
              </label>
              <div className="group relative">
                <Briefcase size={16} strokeWidth={1.9} className={fieldIconClass} />
                <input
                  value={source}
                  onChange={(e) => setSource(e.target.value)}
                  className={fieldClass}
                />
              </div>
            </div>

            <div>
              <label className="mb-2 block text-xs font-semibold text-neutral-600 dark:text-neutral-300">
                Paid on
              </label>
              <div className="group relative">
                <CalendarDays size={16} strokeWidth={1.9} className={fieldIconClass} />
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className={fieldClass}
                />
              </div>
            </div>
          </div>

          {/* error */}
          {error && (
            <div className="mb-4 flex items-start gap-2.5 rounded-2xl border border-red-300 bg-red-50 px-4 py-3 dark:border-red-500/30 dark:bg-red-500/12">
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

          {/* submit */}
          <button
            onClick={submit}
            disabled={saving}
            className="group relative flex w-full items-center justify-center gap-2 overflow-hidden rounded-2xl bg-gradient-to-br from-[#0f2b2b] to-[#164040] py-4 text-sm font-semibold text-white shadow-[0_10px_30px_-10px_rgba(15,43,43,0.75)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_16px_38px_-12px_rgba(15,43,43,0.85)] active:translate-y-0 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0 disabled:hover:shadow-[0_10px_30px_-10px_rgba(15,43,43,0.75)]"
          >
            <span className="absolute inset-0 bg-gradient-to-r from-teal-500/0 via-teal-400/30 to-teal-500/0 opacity-0 transition-opacity duration-500 group-hover:opacity-100 group-disabled:opacity-0" />
            <span className="relative flex items-center gap-2">
              {saving && <Loader2 size={15} className="animate-spin" />}
              {saving ? "Saving…" : "Save income"}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}
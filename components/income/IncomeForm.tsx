"use client";

import { useState, useEffect } from "react";
import { X } from "lucide-react";
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

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 sm:items-center">
      <div className="w-full max-w-md rounded-t-3xl bg-white p-5 dark:bg-neutral-900 sm:rounded-3xl">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-lg font-semibold">Monthly income</h3>
          <button onClick={onClose} className="rounded-lg p-1.5 hover:bg-neutral-100 dark:hover:bg-white/5">
            <X size={18} />
          </button>
        </div>

        <div className="mb-5 text-center">
          <div className="flex items-center justify-center gap-1">
            <span className="text-2xl text-neutral-400">£</span>
            <input
              type="text"
              inputMode="decimal"
              autoFocus
              value={amount}
              onChange={(e) => setAmount(e.target.value.replace(/[^0-9.]/g, ""))}
              placeholder="0.00"
              className="w-44 bg-transparent text-center text-4xl font-semibold tracking-tight outline-none"
            />
          </div>
        </div>

        <div className="mb-4 grid grid-cols-2 gap-3">
          <div>
            <label className="mb-1.5 block text-xs font-medium text-neutral-500">Source</label>
            <input
              value={source}
              onChange={(e) => setSource(e.target.value)}
              className="w-full rounded-xl border border-neutral-200 px-3 py-2.5 text-sm outline-none focus:border-teal-500 dark:border-white/10 dark:bg-transparent"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-medium text-neutral-500">Paid on</label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full rounded-xl border border-neutral-200 px-3 py-2.5 text-sm outline-none focus:border-teal-500 dark:border-white/10 dark:bg-transparent"
            />
          </div>
        </div>

        {error && <p className="mb-3 text-sm text-red-500">{error}</p>}

        <button
          onClick={submit}
          disabled={saving}
          className="w-full rounded-xl bg-[#0f2b2b] py-3.5 text-sm font-medium text-white disabled:opacity-50"
        >
          {saving ? "Saving…" : "Save income"}
        </button>
      </div>
    </div>
  );
}
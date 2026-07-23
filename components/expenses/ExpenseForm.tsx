"use client";

import { useState, useEffect } from "react";
import { X } from "lucide-react";
import CategoryPicker, { type Cat } from "./CategoryPicker";
import { toPence, toDisplay } from "@/lib/money";

interface Props {
  open: boolean;
  onClose: () => void;
  onSaved: () => void;
  categories: Cat[];
  editing?: {
    _id: string;
    amount: number;
    note?: string;
    date: string;
    category: { _id: string };
  } | null;
}

export default function ExpenseForm({ open, onClose, onSaved, categories, editing }: Props) {
  const [amount, setAmount] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [note, setNote] = useState("");
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (editing) {
      setAmount(toDisplay(editing.amount));
      setCategoryId(editing.category._id);
      setNote(editing.note ?? "");
      setDate(new Date(editing.date).toISOString().slice(0, 10));
    } else {
      setAmount("");
      setCategoryId(categories[0]?._id ?? "");
      setNote("");
      setDate(new Date().toISOString().slice(0, 10));
    }
    setError("");
  }, [editing, open, categories]);

  if (!open) return null;

  const submit = async () => {
    const pence = toPence(amount);
    if (!pence || pence < 1) return setError("Enter a valid amount");
    if (!categoryId) return setError("Pick a category");

    setSaving(true);
    setError("");

    const res = await fetch(
      editing ? `/api/expenses/${editing._id}` : "/api/expenses",
      {
        method: editing ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          categoryId,
          amount: pence,
          note: note || undefined,
          date: new Date(date).toISOString(),
        }),
      }
    );

    setSaving(false);
    const data = await res.json();

    if (!res.ok) {
      setError(
        data.error === "LIMIT_REACHED"
          ? `Free plan allows ${data.limit} expenses per month. Upgrade for unlimited.`
          : data.error ?? "Something went wrong"
      );
      return;
    }

    onSaved();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 sm:items-center">
      <div className="w-full max-w-md rounded-t-3xl bg-white p-5 dark:bg-neutral-900 sm:rounded-3xl">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-lg font-semibold">
            {editing ? "Edit expense" : "Add expense"}
          </h3>
          <button onClick={onClose} className="rounded-lg p-1.5 hover:bg-neutral-100 dark:hover:bg-white/5">
            <X size={18} />
          </button>
        </div>

        {/* amount */}
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
              className="w-40 bg-transparent text-center text-4xl font-semibold tracking-tight outline-none"
            />
          </div>
        </div>

        <label className="mb-2 block text-xs font-medium text-neutral-500">Category</label>
        <div className="mb-4 max-h-52 overflow-y-auto">
          <CategoryPicker categories={categories} value={categoryId} onChange={setCategoryId} />
        </div>

        <div className="mb-4 grid grid-cols-2 gap-3">
          <div>
            <label className="mb-1.5 block text-xs font-medium text-neutral-500">Date</label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full rounded-xl border border-neutral-200 px-3 py-2.5 text-sm outline-none focus:border-teal-500 dark:border-white/10 dark:bg-transparent"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-medium text-neutral-500">Note</label>
            <input
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Optional"
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
          {saving ? "Saving…" : editing ? "Save changes" : "Add expense"}
        </button>
      </div>
    </div>
  );
}
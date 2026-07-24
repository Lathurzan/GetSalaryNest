"use client";

import { useState, useEffect } from "react";
import {
  X,
  Receipt,
  CalendarDays,
  PencilLine,
  AlertCircle,
  Loader2,
} from "lucide-react";
import CategoryPicker, { type Cat } from "./CategoryPicker";
import { toPence, toDisplay } from "@/lib/money";
import ReceiptUpload from "./ReceiptUpload";
import UpgradePrompt from "@/components/shared/UpgradePrompt";
import { usePlan } from "@/lib/hooks/usePlan";

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
    receiptUrl?: string;
    receiptPublicId?: string;
    category: { _id: string };
  } | null;
}

export default function ExpenseForm({
  open, onClose, onSaved, categories, editing,
}: Props) {
  // ── all hooks first, unconditionally ──
  const { isPremium } = usePlan();

  const [amount, setAmount] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [note, setNote] = useState("");
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [receiptUrl, setReceiptUrl] = useState<string | undefined>();
  const [receiptPublicId, setReceiptPublicId] = useState<string | undefined>();
  const [showUpgrade, setShowUpgrade] = useState(false);
  const [upgradeReason, setUpgradeReason] = useState("");
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (editing) {
      setAmount(toDisplay(editing.amount));
      setCategoryId(editing.category._id);
      setNote(editing.note ?? "");
      setDate(new Date(editing.date).toISOString().slice(0, 10));
      setReceiptUrl(editing.receiptUrl);
      setReceiptPublicId(editing.receiptPublicId);
    } else {
      setAmount("");
      setCategoryId(categories[0]?._id ?? "");
      setNote("");
      setDate(new Date().toISOString().slice(0, 10));
      setReceiptUrl(undefined);
      setReceiptPublicId(undefined);
    }
    setError("");
  }, [editing, open, categories]);

  // ── early return only after every hook ──
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
          receiptUrl,
          receiptPublicId,
        }),
      }
    );

    setSaving(false);
    const data = await res.json();

    if (!res.ok) {
      if (data.error === "LIMIT_REACHED") {
        setUpgradeReason(`Free plan allows ${data.limit} expenses per month.`);
        setShowUpgrade(true);
      } else if (data.error === "PREMIUM_REQUIRED") {
        setUpgradeReason("Receipt photos are a Premium feature.");
        setShowUpgrade(true);
      } else {
        setError(data.error ?? "Something went wrong");
      }
      return;
    }

    onSaved();
    onClose();
  };

  const fieldClass =
    "w-full rounded-2xl border border-neutral-300 bg-white py-3.5 pl-11 pr-3.5 text-base text-neutral-900 outline-none transition-all duration-200 placeholder:text-neutral-500 hover:border-neutral-400 focus:border-teal-600 focus:ring-4 focus:ring-teal-500/15 sm:text-sm dark:border-white/15 dark:bg-white/[0.06] dark:text-white dark:hover:border-white/25 dark:focus:border-teal-400 dark:focus:bg-white/[0.09]";

  const fieldIconClass =
    "pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-500 transition-colors duration-200 group-focus-within:text-teal-600 dark:text-neutral-400 dark:group-focus-within:text-teal-400";

  const labelClass =
    "mb-2 block text-xs font-semibold text-neutral-600 dark:text-neutral-300";

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center sm:p-4">
        {/* backdrop */}
        <div
          onClick={onClose}
          className="animate-overlay-in absolute inset-0 bg-gradient-to-b from-[#0a1f1f]/50 via-[#0a1f1f]/60 to-[#0a1f1f]/70 backdrop-blur-md"
        />

        {/* modal */}
        <div className="animate-modal-in relative flex max-h-[92dvh] w-full max-w-md flex-col overflow-hidden rounded-t-[1.75rem] border border-white/60 bg-white/95 shadow-[0_-8px_60px_-12px_rgba(0,0,0,0.4)] backdrop-blur-2xl sm:max-h-[90vh] sm:rounded-[1.75rem] sm:shadow-[0_30px_80px_-20px_rgba(0,0,0,0.5)] dark:border-white/[0.12] dark:bg-[#0d1817]/95">
          {/* gradient top border */}
          <div className="pointer-events-none absolute inset-x-10 top-0 z-10 h-px bg-gradient-to-r from-transparent via-teal-500/70 to-transparent" />

          {/* mobile grab handle */}
          <div className="flex shrink-0 justify-center pt-3 sm:hidden">
            <div className="h-1 w-10 rounded-full bg-neutral-300 dark:bg-white/20" />
          </div>

          {/* header — fixed */}
          <div className="flex shrink-0 items-start justify-between gap-4 px-6 pb-5 pt-5 sm:px-7 sm:pt-7">
            <div className="flex items-start gap-3">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-orange-500/20 to-rose-500/10 ring-1 ring-orange-500/25">
                <Receipt
                  size={19}
                  strokeWidth={2}
                  className="text-orange-600 dark:text-orange-400"
                />
              </div>
              <div>
                <h3 className="text-lg font-bold tracking-tight text-[#0a1f1f] dark:text-white">
                  {editing ? "Edit expense" : "Add expense"}
                </h3>
                <p className="mt-0.5 text-xs text-neutral-500 dark:text-neutral-400">
                  Track where your money goes
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

          {/* scrollable body */}
          <div className="min-h-0 flex-1 overflow-y-auto px-6 sm:px-7">
            {/* amount */}
            <div className="group relative mb-5 overflow-hidden rounded-[1.25rem] border border-neutral-200 bg-gradient-to-b from-neutral-50 to-white p-6 transition-all duration-300 focus-within:border-teal-500/50 focus-within:shadow-[0_0_0_4px_rgba(20,184,166,0.1)] dark:border-white/[0.08] dark:from-white/[0.04] dark:to-transparent dark:focus-within:border-teal-400/40">
              <div
                className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-focus-within:opacity-100"
                style={{
                  background:
                    "radial-gradient(circle at 50% 100%, rgba(20,184,166,0.12) 0%, transparent 65%)",
                }}
              />

              <div className="relative flex items-baseline justify-center gap-1.5">
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
                  className="w-40 bg-transparent text-center text-[2.75rem] font-bold leading-none tracking-[-0.03em] text-[#0a1f1f] outline-none placeholder:text-neutral-300 dark:text-white dark:placeholder:text-white/20"
                />
              </div>

              <p className="relative mt-3 text-center text-[10px] font-medium uppercase tracking-[0.14em] text-neutral-400">
                Expense amount
              </p>

              <div className="relative mx-auto mt-3 h-0.5 w-24 overflow-hidden rounded-full bg-neutral-200 dark:bg-white/10">
                <div className="h-full w-full origin-left scale-x-0 rounded-full bg-gradient-to-r from-teal-500 to-emerald-400 transition-transform duration-500 group-focus-within:scale-x-100" />
              </div>
            </div>

            {/* category */}
            <label className={labelClass}>Category</label>
            <div className="mb-5 max-h-52 overflow-y-auto rounded-2xl border border-neutral-200 bg-neutral-50/70 p-3 dark:border-white/[0.08] dark:bg-white/[0.02]">
              <CategoryPicker
                categories={categories}
                value={categoryId}
                onChange={setCategoryId}
              />
            </div>

            {/* date + note */}
            <div className="mb-5 grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div>
                <label className={labelClass}>Date</label>
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

              <div>
                <label className={labelClass}>Note</label>
                <div className="group relative">
                  <PencilLine size={16} strokeWidth={1.9} className={fieldIconClass} />
                  <input
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    placeholder="Optional"
                    className={fieldClass}
                  />
                </div>
              </div>
            </div>

            {/* receipt */}
            <div className="mb-5">
              <div className="mb-2 flex items-center gap-2">
                <label className="text-xs font-semibold text-neutral-600 dark:text-neutral-300">
                  Receipt
                </label>
                {!isPremium && (
                  <span className="rounded-full bg-gradient-to-r from-teal-500/15 to-emerald-500/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-teal-700 ring-1 ring-teal-500/25 dark:text-teal-400">
                    Premium
                  </span>
                )}
              </div>

              <div className="rounded-2xl border border-neutral-200 bg-neutral-50/70 p-2.5 transition-colors duration-200 hover:border-neutral-300 dark:border-white/[0.08] dark:bg-white/[0.02] dark:hover:border-white/15">
                <ReceiptUpload
                  value={receiptUrl}
                  publicId={receiptPublicId}
                  onChange={(url, pid) => {
                    setReceiptUrl(url);
                    setReceiptPublicId(pid);
                  }}
                  isPremium={isPremium}
                  onUpgrade={() => {
                    setUpgradeReason("Attach bill photos to your expenses with Premium.");
                    setShowUpgrade(true);
                  }}
                />
              </div>
            </div>

            {/* error */}
            {error && (
              <div className="mb-5 flex items-start gap-2.5 rounded-2xl border border-red-300 bg-red-50 px-4 py-3 dark:border-red-500/30 dark:bg-red-500/12">
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
          </div>

          {/* footer — fixed */}
          <div className="shrink-0 border-t border-neutral-100 bg-white/60 px-6 pb-[calc(env(safe-area-inset-bottom)+1.25rem)] pt-4 backdrop-blur-xl sm:px-7 sm:pb-6 dark:border-white/5 dark:bg-white/[0.02]">
            <button
              onClick={submit}
              disabled={saving}
              className="group relative flex w-full items-center justify-center gap-2 overflow-hidden rounded-2xl bg-gradient-to-br from-[#0f2b2b] to-[#164040] py-4 text-sm font-semibold text-white shadow-[0_10px_30px_-10px_rgba(15,43,43,0.75)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_16px_38px_-12px_rgba(15,43,43,0.85)] active:translate-y-0 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0 disabled:hover:shadow-[0_10px_30px_-10px_rgba(15,43,43,0.75)]"
            >
              <span className="absolute inset-0 bg-gradient-to-r from-teal-500/0 via-teal-400/30 to-teal-500/0 opacity-0 transition-opacity duration-500 group-hover:opacity-100 group-disabled:opacity-0" />
              <span className="relative flex items-center gap-2">
                {saving && <Loader2 size={15} className="animate-spin" />}
                {saving ? "Saving…" : editing ? "Save changes" : "Add expense"}
              </span>
            </button>
          </div>
        </div>
      </div>

      <UpgradePrompt
        open={showUpgrade}
        onClose={() => setShowUpgrade(false)}
        reason={upgradeReason}
      />
    </>
  );
}
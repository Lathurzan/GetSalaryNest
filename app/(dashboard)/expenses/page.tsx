"use client";

import { useEffect, useState, useCallback } from "react";
import { Plus, Trash2, Receipt, Wallet, Sparkles } from "lucide-react";
import * as Icons from "lucide-react";
import Link from "next/link";
import ExpenseForm from "@/components/expenses/ExpenseForm";
import ReceiptViewer from "@/components/expenses/ReceiptViewer";
import MonthSwitcher from "@/components/shared/MonthSwitcher";
import { usePlan } from "@/lib/hooks/usePlan";
import { format } from "@/lib/money";
import { monthKey } from "@/lib/dates";
import type { Cat } from "@/components/expenses/CategoryPicker";

const FREE_LIMIT = 50;

export default function ExpensesPage() {
  const { isPremium } = usePlan();

  const [month, setMonth] = useState(monthKey(new Date()));
  const [categories, setCategories] = useState<Cat[]>([]);
  const [items, setItems] = useState<any[]>([]);
  const [filter, setFilter] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(false);
  const [editing, setEditing] = useState<any>(null);
  const [viewing, setViewing] = useState<string | null>(null);

  const loadCategories = useCallback(async () => {
    const res = await fetch("/api/categories");
    if (res.ok) setCategories((await res.json()).items);
  }, []);

  const loadExpenses = useCallback(async () => {
    setLoading(true);
    const qs = new URLSearchParams({ month });
    if (filter) qs.set("categoryId", filter);
    const res = await fetch(`/api/expenses?${qs}`);
    if (res.ok) setItems((await res.json()).items);
    setLoading(false);
  }, [month, filter]);

  useEffect(() => { loadCategories(); }, [loadCategories]);
  useEffect(() => { loadExpenses(); }, [loadExpenses]);

  const remove = async (id: string) => {
    if (!confirm("Delete this expense?")) return;
    await fetch(`/api/expenses/${id}`, { method: "DELETE" });
    loadExpenses();
  };

  const total = items.reduce((s, i) => s + i.amount, 0);
  const usagePct = Math.min(100, Math.round((items.length / FREE_LIMIT) * 100));

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

      <div className="mx-auto max-w-3xl space-y-5 p-4 pb-28 sm:p-6 lg:p-8">
        {/* header */}
        <header className="animate-fade-up flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-[#0a1f1f] sm:text-[1.75rem] dark:text-white">
              Expenses
            </h1>
            <p className="mt-0.5 text-sm text-neutral-500 dark:text-neutral-400">
              Track and manage your spending.
            </p>
          </div>

          <div className="shrink-0 rounded-2xl border border-neutral-200/90 bg-white/85 p-1 shadow-[0_4px_20px_-8px_rgba(15,43,43,0.2)] backdrop-blur-xl dark:border-white/10 dark:bg-white/[0.5]">
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
                Total spent this month
              </p>
              <p className="mt-3 text-4xl font-bold tracking-[-0.03em] text-white">
                {format(total)}
              </p>
              <div className="mt-3 flex items-center gap-3 text-xs text-white/45">
                <span>{items.length} transactions</span>
                <span className="h-1 w-1 rounded-full bg-white/25" />
                <span>
                  {new Date(month + "-01").toLocaleDateString("en-GB", {
                    month: "long",
                    year: "numeric",
                  })}
                </span>
              </div>
            </div>

            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white/[0.08] ring-1 ring-white/10">
              <Wallet size={22} className="text-teal-400" strokeWidth={1.9} />
            </div>
          </div>
        </div>

        {/* free-tier usage */}
        {!isPremium && (
          <div className="animate-fade-up delay-200 rounded-2xl border border-neutral-200/90 bg-white/85 p-4 shadow-sm backdrop-blur-xl dark:border-white/[0.08] dark:bg-white/[0.03]">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="rounded-full bg-gradient-to-r from-teal-500/15 to-emerald-500/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-teal-700 ring-1 ring-teal-500/25 dark:text-teal-400">
                  Free plan
                </span>
                <span className="text-xs font-medium text-neutral-600 dark:text-neutral-300">
                  {items.length} of {FREE_LIMIT} expenses
                </span>
              </div>

              {items.length >= FREE_LIMIT * 0.8 && (
                <Link
                  href="/pricing"
                  className="flex items-center gap-1 rounded-lg bg-teal-500/10 px-2.5 py-1 text-xs font-semibold text-teal-700 transition-colors hover:bg-teal-500/20 dark:text-teal-400"
                >
                  <Sparkles size={12} />
                  Upgrade
                </Link>
              )}
            </div>

            <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-neutral-200 dark:bg-white/10">
              <div
                className={`h-full rounded-full transition-all duration-500 ${
                  usagePct >= 80
                    ? "bg-gradient-to-r from-orange-500 to-red-500"
                    : "bg-gradient-to-r from-teal-500 to-emerald-400"
                }`}
                style={{ width: `${usagePct}%` }}
              />
            </div>
          </div>
        )}

        {/* category filters */}
        <div className="animate-fade-up delay-200 flex gap-2 overflow-x-auto pb-1.5 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          <button
            onClick={() => setFilter("")}
            className={`shrink-0 rounded-full px-4 py-2 text-xs font-semibold transition-all duration-200 hover:-translate-y-0.5 ${
              !filter
                ? "bg-[#0f2b2b] text-white shadow-[0_6px_16px_-6px_rgba(15,43,43,0.6)]"
                : "border border-neutral-200 bg-white/70 text-neutral-600 backdrop-blur-sm hover:border-neutral-300 dark:border-white/10 dark:bg-white/5 dark:text-neutral-300"
            }`}
          >
            All
          </button>
          {categories.map((c) => (
            <button
              key={c._id}
              onClick={() => setFilter(filter === c._id ? "" : c._id)}
              className="shrink-0 rounded-full px-4 py-2 text-xs font-semibold transition-all duration-200 hover:-translate-y-0.5"
              style={
                filter === c._id
                  ? {
                      backgroundColor: c.color,
                      color: "#fff",
                      boxShadow: `0 6px 16px -6px ${c.color}`,
                    }
                  : { backgroundColor: `${c.color}1a`, color: c.color }
              }
            >
              {c.name}
            </button>
          ))}
        </div>

        {/* list */}
        {loading ? (
          <div className="space-y-2.5">
            {[...Array(5)].map((_, i) => (
              <div
                key={i}
                className="flex items-center gap-3 rounded-2xl border border-neutral-200/70 bg-white/70 p-3.5 dark:border-white/[0.06] dark:bg-white/[0.02]"
              >
                <div className="h-11 w-11 shrink-0 animate-pulse rounded-full bg-neutral-200 dark:bg-white/10" />
                <div className="flex-1 space-y-2">
                  <div className="h-3.5 w-32 animate-pulse rounded bg-neutral-200 dark:bg-white/10" />
                  <div className="h-2.5 w-20 animate-pulse rounded bg-neutral-100 dark:bg-white/5" />
                </div>
                <div className="h-4 w-16 animate-pulse rounded bg-neutral-200 dark:bg-white/10" />
              </div>
            ))}
          </div>
        ) : !items.length ? (
          <div className="animate-fade-up flex flex-col items-center gap-4 rounded-3xl border border-dashed border-neutral-300 bg-white/50 py-16 dark:border-white/10 dark:bg-white/[0.02]">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-teal-500/15 to-emerald-500/5 ring-1 ring-teal-500/15">
              <Receipt size={26} className="text-teal-600 dark:text-teal-400" strokeWidth={1.8} />
            </div>
            <div className="text-center">
              <p className="text-sm font-semibold text-[#0a1f1f] dark:text-white">
                No expenses yet this month
              </p>
              <p className="mt-1 text-xs text-neutral-500 dark:text-neutral-400">
                Add your first expense to start tracking.
              </p>
            </div>
            <button
              onClick={() => { setEditing(null); setModal(true); }}
              className="flex items-center gap-1.5 rounded-xl bg-[#0f2b2b] px-4 py-2.5 text-xs font-semibold text-white transition-transform hover:-translate-y-0.5 active:scale-95"
            >
              <Plus size={14} strokeWidth={2.4} />
              Add expense
            </button>
          </div>
        ) : (
          <div className="animate-fade-up delay-300 space-y-2.5">
            {items.map((e) => {
              const Icon = (Icons as any)[e.category.icon] ?? Icons.Wallet;
              return (
                <div
                  key={e._id}
                  className="group flex items-center gap-3 rounded-2xl border border-neutral-200/80 bg-white/85 p-3.5 shadow-[0_2px_12px_-6px_rgba(15,43,43,0.15)] backdrop-blur-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-neutral-300 hover:shadow-[0_10px_28px_-12px_rgba(15,43,43,0.28)] dark:border-white/[0.08] dark:bg-white/[0.03] dark:hover:border-white/15"
                >
                  <button
                    onClick={() => { setEditing(e); setModal(true); }}
                    className="flex flex-1 items-center gap-3 text-left"
                  >
                    <div
                      className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl transition-transform duration-300 group-hover:scale-105"
                      style={{ backgroundColor: `${e.category.color}1a` }}
                    >
                      <Icon size={19} style={{ color: e.category.color }} strokeWidth={2} />
                    </div>

                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-semibold text-[#0a1f1f] dark:text-white">
                        {e.note || e.category.name}
                      </p>
                      <div className="mt-1 flex items-center gap-1.5">
                        <span
                          className="rounded-md px-1.5 py-0.5 text-[10px] font-medium"
                          style={{
                            backgroundColor: `${e.category.color}1a`,
                            color: e.category.color,
                          }}
                        >
                          {e.category.name}
                        </span>
                        <span className="text-[11px] text-neutral-400">
                          {new Date(e.date).toLocaleDateString("en-GB", {
                            day: "2-digit",
                            month: "short",
                          })}
                        </span>
                      </div>
                    </div>

                    {e.receiptUrl && (
                      <img
                        src={e.receiptUrl}
                        alt=""
                        onClick={(ev) => {
                          ev.stopPropagation();
                          setViewing(e.receiptUrl);
                        }}
                        className="h-10 w-10 shrink-0 rounded-xl border border-neutral-200 object-cover shadow-sm transition-transform duration-300 hover:scale-105 dark:border-white/10"
                      />
                    )}

                    <span className="shrink-0 text-[0.9375rem] font-bold tabular-nums text-[#0a1f1f] dark:text-white">
                      {format(e.amount)}
                    </span>
                  </button>

                  <button
                    onClick={() => remove(e._id)}
                    aria-label="Delete"
                    className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-neutral-300 transition-all duration-200 hover:bg-red-500/10 hover:text-red-500 active:scale-90 sm:opacity-0 sm:group-hover:opacity-100"
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* FAB */}
      <button
        onClick={() => { setEditing(null); setModal(true); }}
        aria-label="Add expense"
        className="group fixed bottom-24 right-5 z-40 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-[#0f2b2b] to-[#164040] text-white shadow-[0_12px_32px_-8px_rgba(15,43,43,0.7)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_18px_40px_-10px_rgba(15,43,43,0.8)] active:scale-95 sm:bottom-6 lg:right-8"
      >
        <span className="absolute inset-0 rounded-2xl bg-teal-400/0 transition-colors duration-300 group-hover:bg-teal-400/10" />
        <Plus
          size={24}
          strokeWidth={2.4}
          className="relative transition-transform duration-300 group-hover:rotate-90"
        />
      </button>

      <ExpenseForm
        open={modal}
        onClose={() => setModal(false)}
        onSaved={loadExpenses}
        categories={categories}
        editing={editing}
      />

      <ReceiptViewer url={viewing} onClose={() => setViewing(null)} />
    </div>
  );
}
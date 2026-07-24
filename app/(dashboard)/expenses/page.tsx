"use client";

import { useEffect, useState, useCallback } from "react";
import { Plus, Trash2 } from "lucide-react";
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

  return (
    <div className="mx-auto max-w-3xl space-y-5 p-4 pb-24 sm:p-6">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold">Expenses</h1>
        <MonthSwitcher month={month} onChange={setMonth} />
      </div>

      <div className="rounded-2xl bg-neutral-50 p-4 dark:bg-white/5">
        <p className="text-xs text-neutral-500">Total this month</p>
        <p className="mt-1 text-2xl font-semibold">{format(total)}</p>
        <p className="mt-0.5 text-xs text-neutral-400">
          {items.length} transactions
        </p>
      </div>

      {/* free-tier counter */}
      {!isPremium && (
        <div className="flex items-center justify-between rounded-xl bg-neutral-50 px-4 py-2.5 text-xs dark:bg-white/5">
          <span className="text-neutral-500">
            {items.length} of {FREE_LIMIT} expenses this month
          </span>
          {items.length >= FREE_LIMIT * 0.8 && (
            <Link href="/pricing" className="font-medium text-teal-600">
              Upgrade
            </Link>
          )}
        </div>
      )}

      {/* category filter chips */}
      <div className="flex gap-2 overflow-x-auto pb-1">
        <button
          onClick={() => setFilter("")}
          className={`shrink-0 rounded-full px-3.5 py-1.5 text-xs font-medium ${
            !filter ? "bg-[#0f2b2b] text-white" : "bg-neutral-100 dark:bg-white/5"
          }`}
        >
          All
        </button>
        {categories.map((c) => (
          <button
            key={c._id}
            onClick={() => setFilter(filter === c._id ? "" : c._id)}
            className="shrink-0 rounded-full px-3.5 py-1.5 text-xs font-medium"
            style={
              filter === c._id
                ? { backgroundColor: c.color, color: "#fff" }
                : { backgroundColor: `${c.color}1a`, color: c.color }
            }
          >
            {c.name}
          </button>
        ))}
      </div>

      {/* list */}
      <div className="divide-y divide-neutral-100 dark:divide-white/5">
        {loading ? (
          <p className="py-8 text-center text-sm text-neutral-400">Loading…</p>
        ) : !items.length ? (
          <p className="py-12 text-center text-sm text-neutral-400">
            No expenses yet this month
          </p>
        ) : (
          items.map((e) => {
            const Icon = (Icons as any)[e.category.icon] ?? Icons.Wallet;
            return (
              <div key={e._id} className="group flex items-center gap-3 py-3">
                <button
                  onClick={() => { setEditing(e); setModal(true); }}
                  className="flex flex-1 items-center gap-3 text-left"
                >
                  <div
                    className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full"
                    style={{ backgroundColor: `${e.category.color}1a` }}
                  >
                    <Icon size={19} style={{ color: e.category.color }} />
                  </div>

                  <div className="min-w-0 flex-1">
                    <p className="truncate font-medium">
                      {e.note || e.category.name}
                    </p>
                    <p className="mt-0.5 text-xs text-neutral-400">
                      {new Date(e.date).toLocaleDateString("en-GB", {
                        day: "2-digit",
                        month: "short",
                      })}{" "}
                      · {e.category.name}
                    </p>
                  </div>

                  {e.receiptUrl && (
                    <img
                      src={e.receiptUrl}
                      alt=""
                      onClick={(ev) => {
                        ev.stopPropagation();
                        setViewing(e.receiptUrl);
                      }}
                      className="h-9 w-9 shrink-0 rounded-lg object-cover"
                    />
                  )}

                  <span className="font-semibold tabular-nums">
                    {format(e.amount)}
                  </span>
                </button>

                <button
                  onClick={() => remove(e._id)}
                  aria-label="Delete"
                  className="rounded-lg p-2 text-neutral-300 opacity-0 transition hover:text-red-500 group-hover:opacity-100"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            );
          })
        )}
      </div>

      {/* FAB */}
      <button
        onClick={() => { setEditing(null); setModal(true); }}
        aria-label="Add expense"
        className="fixed bottom-6 right-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#0f2b2b] text-white shadow-lg transition active:scale-95"
      >
        <Plus size={24} />
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
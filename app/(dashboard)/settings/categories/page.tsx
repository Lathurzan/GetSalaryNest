"use client";

import { useEffect, useState, useCallback } from "react";
import * as Icons from "lucide-react";
import { Plus, X, Lock } from "lucide-react";
import Link from "next/link";
import UpgradePrompt from "@/components/shared/UpgradePrompt";
import { usePlan } from "@/lib/hooks/usePlan";
import { toPence, toDisplay, format } from "@/lib/money";

const ICONS = [
  "Home", "Carrot", "ShoppingCart", "Zap", "Car", "UtensilsCrossed",
  "HeartPulse", "ShoppingBag", "PiggyBank", "Plane", "Dumbbell",
  "Book", "Gift", "Wifi", "Dog", "Baby",
];

const COLORS = [
  "#f97316", "#22c55e", "#84cc16", "#eab308", "#3b82f6",
  "#ec4899", "#ef4444", "#a855f7", "#14b8a6", "#6366f1",
];

export default function CategoriesPage() {
  const { isPremium } = usePlan();

  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingBudget, setEditingBudget] = useState<string | null>(null);
  const [budgetValue, setBudgetValue] = useState("");
  const [showNew, setShowNew] = useState(false);
  const [showUpgrade, setShowUpgrade] = useState(false);

  const [form, setForm] = useState({
    name: "",
    icon: "Wallet",
    color: "#14b8a6",
    type: "expense" as "expense" | "savings",
  });

  const load = useCallback(async () => {
    setLoading(true);
    const res = await fetch("/api/categories");
    if (res.ok) setItems((await res.json()).items);
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  const saveBudget = async (id: string) => {
    await fetch(`/api/categories/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ budget: toPence(budgetValue || "0") }),
    });
    setEditingBudget(null);
    setBudgetValue("");
    load();
  };

  const create = async () => {
    if (!form.name.trim()) return;

    const res = await fetch("/api/categories", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    if (!res.ok) {
      const d = await res.json();
      if (d.error === "PREMIUM_REQUIRED") {
        setShowNew(false);
        return setShowUpgrade(true);
      }
      return alert(d.error);
    }

    setShowNew(false);
    setForm({ name: "", icon: "Wallet", color: "#14b8a6", type: "expense" });
    load();
  };

  const remove = async (id: string, name: string) => {
    if (!confirm(`Remove "${name}"? Past expenses stay intact.`)) return;
    await fetch(`/api/categories/${id}`, { method: "DELETE" });
    load();
  };

  if (loading) return <p className="p-6 text-sm text-neutral-400">Loading…</p>;

  return (
    <div className="mx-auto max-w-lg space-y-5 p-4 sm:p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold">Categories</h1>
          <p className="mt-0.5 text-xs text-neutral-400">
            Tap a budget to set a monthly limit
          </p>
        </div>
        <button
          onClick={() => (isPremium ? setShowNew(true) : setShowUpgrade(true))}
          className="flex items-center gap-1.5 rounded-xl bg-[#0f2b2b] px-3 py-2 text-xs font-medium text-white"
        >
          {isPremium ? <Plus size={14} /> : <Lock size={12} />}
          New
        </button>
      </div>

      <div className="space-y-2">
        {items.map((c) => {
          const Icon = (Icons as any)[c.icon] ?? Icons.Wallet;
          const editing = editingBudget === c._id;

          return (
            <div
              key={c._id}
              className="flex items-center gap-3 rounded-2xl border border-neutral-200 p-3.5 dark:border-white/10"
            >
              <div
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full"
                style={{ backgroundColor: `${c.color}1a` }}
              >
                <Icon size={18} style={{ color: c.color }} />
              </div>

              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium">{c.name}</p>
                <p className="text-xs text-neutral-400">
                  {c.type === "savings" ? "Savings" : "Expense"}
                  {c.isDefault && " · default"}
                </p>
              </div>

              {editing ? (
                <div className="flex items-center gap-1.5">
                  <span className="text-xs text-neutral-400">£</span>
                  <input
                    autoFocus
                    value={budgetValue}
                    onChange={(e) =>
                      setBudgetValue(e.target.value.replace(/[^0-9.]/g, ""))
                    }
                    onKeyDown={(e) => e.key === "Enter" && saveBudget(c._id)}
                    onBlur={() => saveBudget(c._id)}
                    placeholder="0.00"
                    className="w-20 rounded-lg border border-neutral-200 px-2 py-1 text-right text-xs outline-none focus:border-teal-500 dark:border-white/10 dark:bg-transparent"
                  />
                </div>
              ) : (
                <button
                  onClick={() => {
                    setEditingBudget(c._id);
                    setBudgetValue(c.budget ? toDisplay(c.budget) : "");
                  }}
                  className="rounded-lg px-2.5 py-1.5 text-xs hover:bg-neutral-50 dark:hover:bg-white/5"
                >
                  {c.budget ? (
                    <span className="font-medium">{format(c.budget)}</span>
                  ) : (
                    <span className="text-neutral-300">Set budget</span>
                  )}
                </button>
              )}

              {!c.isDefault && (
                <button
                  onClick={() => remove(c._id, c.name)}
                  aria-label="Remove"
                  className="rounded-lg p-1.5 text-neutral-300 hover:text-red-500"
                >
                  <X size={15} />
                </button>
              )}
            </div>
          );
        })}
      </div>

      {!isPremium && (
        <Link
          href="/pricing"
          className="block rounded-xl bg-neutral-50 p-4 text-center text-xs text-neutral-500 dark:bg-white/5"
        >
          Custom categories are a Premium feature —{" "}
          <span className="font-medium text-teal-600">upgrade</span>
        </Link>
      )}

      {/* new category modal */}
      {showNew && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 sm:items-center">
          <div className="w-full max-w-sm rounded-t-3xl bg-white p-5 dark:bg-neutral-900 sm:rounded-3xl">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="font-semibold">New category</h3>
              <button onClick={() => setShowNew(false)} className="p-1.5">
                <X size={17} />
              </button>
            </div>

            <input
              autoFocus
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder="Category name"
              className="mb-4 w-full rounded-xl border border-neutral-200 px-3.5 py-2.5 text-sm outline-none focus:border-teal-500 dark:border-white/10 dark:bg-transparent"
            />

            <label className="mb-2 block text-xs font-medium text-neutral-500">
              Icon
            </label>
            <div className="mb-4 grid grid-cols-8 gap-1.5">
              {ICONS.map((name) => {
                const Icon = (Icons as any)[name];
                return (
                  <button
                    key={name}
                    onClick={() => setForm({ ...form, icon: name })}
                    className={`flex h-9 items-center justify-center rounded-lg border transition ${
                      form.icon === name
                        ? "border-transparent"
                        : "border-neutral-100 dark:border-white/5"
                    }`}
                    style={
                      form.icon === name
                        ? { backgroundColor: `${form.color}1f` }
                        : {}
                    }
                  >
                    <Icon
                      size={16}
                      style={{
                        color: form.icon === name ? form.color : "#a3a3a3",
                      }}
                    />
                  </button>
                );
              })}
            </div>

            <label className="mb-2 block text-xs font-medium text-neutral-500">
              Colour
            </label>
            <div className="mb-5 flex flex-wrap gap-2">
              {COLORS.map((color) => (
                <button
                  key={color}
                  onClick={() => setForm({ ...form, color })}
                  className="h-7 w-7 rounded-full transition"
                  style={{
                    backgroundColor: color,
                    boxShadow:
                      form.color === color ? `0 0 0 2px #fff, 0 0 0 4px ${color}` : "none",
                  }}
                />
              ))}
            </div>

            <button
              onClick={create}
              className="w-full rounded-xl bg-[#0f2b2b] py-3 text-sm font-medium text-white"
            >
              Create category
            </button>
          </div>
        </div>
      )}

      <UpgradePrompt
        open={showUpgrade}
        onClose={() => setShowUpgrade(false)}
        reason="Custom categories are a Premium feature."
      />
    </div>
  );
}
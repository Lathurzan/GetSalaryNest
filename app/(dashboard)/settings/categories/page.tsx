"use client";

import { useEffect, useState, useCallback } from "react";
import * as Icons from "lucide-react";
import { Plus, X, Lock, Sparkles, FolderTree, Check } from "lucide-react";
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

  if (loading) {
    return (
      <div className="mx-auto max-w-lg space-y-3 p-4 sm:p-6 lg:p-8">
        <div className="h-9 w-40 animate-pulse rounded-xl bg-neutral-200 dark:bg-white/10" />
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className="h-16 animate-pulse rounded-2xl bg-neutral-100 dark:bg-white/5"
          />
        ))}
      </div>
    );
  }

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

      <div className="mx-auto max-w-lg space-y-5 p-4 pb-24 sm:p-6 lg:p-8">
        {/* header */}
        <header className="animate-fade-up flex items-start justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-teal-500/20 to-emerald-500/10 ring-1 ring-teal-500/25">
              <FolderTree size={20} strokeWidth={2} className="text-teal-600 dark:text-teal-400" />
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-[#0a1f1f] sm:text-[1.75rem] dark:text-white">
                Categories
              </h1>
              <p className="mt-0.5 text-sm text-neutral-500 dark:text-neutral-400">
                {items.length} categories · tap a budget to set a limit
              </p>
            </div>
          </div>

          <button
            onClick={() => (isPremium ? setShowNew(true) : setShowUpgrade(true))}
            className="group flex shrink-0 items-center gap-1.5 rounded-2xl bg-gradient-to-br from-[#0f2b2b] to-[#164040] px-3.5 py-2.5 text-xs font-semibold text-white shadow-[0_8px_20px_-8px_rgba(15,43,43,0.6)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_14px_28px_-10px_rgba(15,43,43,0.75)] active:scale-95"
          >
            {isPremium ? (
              <Plus size={14} strokeWidth={2.4} className="transition-transform duration-300 group-hover:rotate-90" />
            ) : (
              <Lock size={12} className="text-amber-400" />
            )}
            New
            {!isPremium && (
              <span className="rounded-full bg-gradient-to-r from-amber-400 to-yellow-500 px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wide text-amber-950">
                Premium
              </span>
            )}
          </button>
        </header>

        {/* category cards */}
        <div className="animate-fade-up delay-100 space-y-2.5">
          {items.map((c) => {
            const Icon = (Icons as any)[c.icon] ?? Icons.Wallet;
            const editing = editingBudget === c._id;

            return (
              <div
                key={c._id}
                className="group flex items-center gap-3 rounded-2xl border border-neutral-200/90 bg-white/85 p-3.5 shadow-[0_2px_12px_-6px_rgba(15,43,43,0.15)] backdrop-blur-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-neutral-300 hover:shadow-[0_12px_28px_-12px_rgba(15,43,43,0.28)] dark:border-white/[0.08] dark:bg-white/[0.03] dark:hover:border-white/15"
              >
                <div
                  className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl transition-transform duration-300 group-hover:scale-105"
                  style={{ backgroundColor: `${c.color}1a` }}
                >
                  <Icon size={19} style={{ color: c.color }} strokeWidth={2} />
                </div>

                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold text-[#0a1f1f] dark:text-white">
                    {c.name}
                  </p>
                  <div className="mt-1 flex items-center gap-1.5">
                    <span
                      className={`rounded-md px-1.5 py-0.5 text-[10px] font-medium ${
                        c.type === "savings"
                          ? "bg-teal-500/15 text-teal-700 dark:text-teal-400"
                          : "bg-neutral-200/70 text-neutral-500 dark:bg-white/10 dark:text-neutral-400"
                      }`}
                    >
                      {c.type === "savings" ? "Savings" : "Expense"}
                    </span>
                    {c.isDefault && (
                      <span className="rounded-md bg-neutral-200/70 px-1.5 py-0.5 text-[10px] font-medium text-neutral-500 dark:bg-white/10 dark:text-neutral-400">
                        Default
                      </span>
                    )}
                  </div>
                </div>

                {editing ? (
                  <div className="flex items-center gap-1 rounded-xl border border-teal-500/40 bg-teal-500/[0.06] px-2.5 py-1.5 ring-4 ring-teal-500/10">
                    <span className="text-xs font-medium text-neutral-400">£</span>
                    <input
                      autoFocus
                      value={budgetValue}
                      onChange={(e) =>
                        setBudgetValue(e.target.value.replace(/[^0-9.]/g, ""))
                      }
                      onKeyDown={(e) => e.key === "Enter" && saveBudget(c._id)}
                      onBlur={() => saveBudget(c._id)}
                      placeholder="0.00"
                      className="w-16 bg-transparent text-right text-xs font-semibold text-[#0a1f1f] outline-none dark:text-white"
                    />
                  </div>
                ) : (
                  <button
                    onClick={() => {
                      setEditingBudget(c._id);
                      setBudgetValue(c.budget ? toDisplay(c.budget) : "");
                    }}
                    className="rounded-xl border border-neutral-200 bg-neutral-50/70 px-3 py-1.5 text-xs transition-colors hover:border-neutral-300 hover:bg-neutral-100 dark:border-white/10 dark:bg-white/[0.03] dark:hover:bg-white/[0.06]"
                  >
                    {c.budget ? (
                      <span className="font-semibold text-[#0a1f1f] dark:text-white">
                        {format(c.budget)}
                      </span>
                    ) : (
                      <span className="text-neutral-400">Set budget</span>
                    )}
                  </button>
                )}

                {!c.isDefault && (
                  <button
                    onClick={() => remove(c._id, c.name)}
                    aria-label="Remove"
                    className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-neutral-300 transition-all duration-200 hover:bg-red-500/10 hover:text-red-500 active:scale-90"
                  >
                    <X size={15} />
                  </button>
                )}
              </div>
            );
          })}
        </div>

        {/* premium banner */}
        {!isPremium && (
          <Link
            href="/pricing"
            className="animate-fade-up delay-200 group relative flex items-center gap-3 overflow-hidden rounded-2xl border border-teal-500/20 bg-gradient-to-br from-teal-500/[0.08] to-emerald-500/[0.03] p-4 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_12px_28px_-12px_rgba(15,43,43,0.25)]"
          >
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-teal-500/20 to-emerald-500/10 ring-1 ring-teal-500/25">
              <Sparkles size={17} className="text-teal-600 dark:text-teal-400" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-semibold text-[#0a1f1f] dark:text-white">
                Create custom categories
              </p>
              <p className="mt-0.5 text-xs text-neutral-500 dark:text-neutral-400">
                A Premium feature — tap to upgrade.
              </p>
            </div>
            <span className="text-sm font-semibold text-teal-700 transition-transform duration-300 group-hover:translate-x-0.5 dark:text-teal-400">
              →
            </span>
          </Link>
        )}
      </div>

      {/* new category modal */}
      {showNew && (
        <div className="fixed inset-0 z-[9999] flex items-end justify-center sm:items-center sm:p-4">
          <div
            onClick={() => setShowNew(false)}
            className="animate-overlay-in absolute inset-0 bg-gradient-to-b from-[#0a1f1f]/50 via-[#0a1f1f]/60 to-[#0a1f1f]/70 backdrop-blur-md"
          />

          <div className="animate-modal-in relative w-full max-w-sm overflow-hidden rounded-t-[1.75rem] border border-white/60 bg-white/95 shadow-[0_-8px_60px_-12px_rgba(0,0,0,0.4)] backdrop-blur-2xl sm:rounded-[1.75rem] sm:shadow-[0_30px_80px_-20px_rgba(0,0,0,0.5)] dark:border-white/[0.12] dark:bg-[#0d1817]/95">
            <div className="pointer-events-none absolute inset-x-10 top-0 h-px bg-gradient-to-r from-transparent via-teal-500/70 to-transparent" />

            <div className="flex justify-center pt-3 sm:hidden">
              <div className="h-1 w-10 rounded-full bg-neutral-300 dark:bg-white/20" />
            </div>

            <div className="p-6 pb-[calc(env(safe-area-inset-bottom)+1.5rem)] sm:p-7 sm:pb-7">
              <div className="mb-5 flex items-center justify-between">
                <h3 className="text-lg font-bold tracking-tight text-[#0a1f1f] dark:text-white">
                  New category
                </h3>
                <button
                  onClick={() => setShowNew(false)}
                  aria-label="Close"
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-neutral-200 bg-white text-neutral-500 transition-all duration-200 hover:rotate-90 hover:border-neutral-300 hover:text-neutral-800 active:scale-90 dark:border-white/10 dark:bg-white/[0.06] dark:text-neutral-400 dark:hover:bg-white/10 dark:hover:text-white"
                >
                  <X size={16} strokeWidth={2.4} />
                </button>
              </div>

              <input
                autoFocus
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="Category name"
                className="mb-5 w-full rounded-2xl border border-neutral-300 bg-white px-4 py-3.5 text-base text-neutral-900 outline-none transition-all duration-200 placeholder:text-neutral-500 hover:border-neutral-400 focus:border-teal-600 focus:ring-4 focus:ring-teal-500/15 sm:text-sm dark:border-white/15 dark:bg-white/[0.06] dark:text-white dark:focus:border-teal-400"
              />

              <label className="mb-2.5 block text-xs font-semibold text-neutral-600 dark:text-neutral-300">
                Icon
              </label>
              <div className="mb-5 grid grid-cols-8 gap-1.5">
                {ICONS.map((name) => {
                  const Icon = (Icons as any)[name];
                  const active = form.icon === name;
                  return (
                    <button
                      key={name}
                      onClick={() => setForm({ ...form, icon: name })}
                      className={`flex h-9 items-center justify-center rounded-xl border transition-all duration-200 hover:scale-110 ${
                        active
                          ? "border-transparent"
                          : "border-neutral-200 bg-white hover:border-neutral-300 dark:border-white/10 dark:bg-white/[0.03]"
                      }`}
                      style={
                        active
                          ? {
                              backgroundColor: `${form.color}1f`,
                              boxShadow: `0 0 0 2px ${form.color}, 0 6px 14px -6px ${form.color}80`,
                            }
                          : {}
                      }
                    >
                      <Icon
                        size={16}
                        style={{ color: active ? form.color : "#a3a3a3" }}
                        strokeWidth={active ? 2.3 : 2}
                      />
                    </button>
                  );
                })}
              </div>

              <label className="mb-2.5 block text-xs font-semibold text-neutral-600 dark:text-neutral-300">
                Colour
              </label>
              <div className="mb-6 flex flex-wrap gap-2.5">
                {COLORS.map((color) => {
                  const active = form.color === color;
                  return (
                    <button
                      key={color}
                      onClick={() => setForm({ ...form, color })}
                      className="relative flex h-8 w-8 items-center justify-center rounded-full transition-transform duration-200 hover:scale-110 active:scale-95"
                      style={{
                        backgroundColor: color,
                        boxShadow: active
                          ? `0 0 0 2px #fff, 0 0 0 4px ${color}, 0 6px 16px -4px ${color}90`
                          : "none",
                      }}
                    >
                      {active && <Check size={14} strokeWidth={3} className="text-white" />}
                    </button>
                  );
                })}
              </div>

              <button
                onClick={create}
                className="group relative flex w-full items-center justify-center gap-2 overflow-hidden rounded-2xl bg-gradient-to-br from-[#0f2b2b] to-[#164040] py-4 text-sm font-semibold text-white shadow-[0_10px_30px_-10px_rgba(15,43,43,0.75)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_16px_38px_-12px_rgba(15,43,43,0.85)] active:translate-y-0 active:scale-[0.99]"
              >
                <span className="absolute inset-0 bg-gradient-to-r from-teal-500/0 via-teal-400/30 to-teal-500/0 opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
                <span className="relative">Create category</span>
              </button>
            </div>
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
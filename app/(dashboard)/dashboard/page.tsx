"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowRight, Activity } from "lucide-react";

import { useDashboard } from "@/lib/hooks/useDashboard";
import BalanceHeader from "@/components/dashboard/BalanceHeader";
import CardCarousel from "@/components/dashboard/CardCarousel";
import SavingsCard from "@/components/dashboard/SavingsCard";
import SpentCard from "@/components/dashboard/SpentCard";
import IncomeCard from "@/components/dashboard/IncomeCard";
import TransactionList from "@/components/dashboard/TransactionList";
import MonthSwitcher from "@/components/shared/MonthSwitcher";
import ExpenseForm from "@/components/expenses/ExpenseForm";
import IncomeForm from "@/components/income/IncomeForm";
import type { Cat } from "@/components/expenses/CategoryPicker";

export default function DashboardPage() {
  const router = useRouter();
  const { data, loading, error, month, setMonth, refresh } = useDashboard();

  const [expenseModal, setExpenseModal] = useState(false);
  const [incomeModal, setIncomeModal] = useState(false);
  const [categories, setCategories] = useState<Cat[]>([]);

  const openExpense = async () => {
    const res = await fetch("/api/categories");
    if (res.ok) setCategories((await res.json()).items);
    setExpenseModal(true);
  };

  if (error) {
    return (
      <div className="mx-auto max-w-5xl p-6">
        <div className="flex items-start gap-3 rounded-2xl border border-red-300 bg-red-50 p-4 dark:border-red-500/30 dark:bg-red-500/10">
          <p className="text-sm font-medium text-red-700 dark:text-red-300">
            {error}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-full">
      {/* ambient background */}
      <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute -top-40 right-0 h-[28rem] w-[28rem] rounded-full bg-teal-300/20 blur-[130px] dark:bg-teal-500/10" />
        <div className="absolute -left-40 top-1/3 h-80 w-80 rounded-full bg-emerald-200/20 blur-[120px] dark:bg-emerald-500/6" />
        <div className="absolute bottom-0 right-1/4 h-72 w-72 rounded-full bg-cyan-200/15 blur-[120px] dark:bg-cyan-500/5" />
      </div>

      <div className="mx-auto max-w-5xl space-y-7 p-4 sm:space-y-9 sm:p-6 lg:p-8">
        {/* header */}
        <header className="animate-fade-up flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="flex items-center gap-1.5 text-xs font-medium uppercase tracking-[0.1em] text-teal-600 dark:text-teal-400">
              <Activity size={12} strokeWidth={2.4} />
              Overview
            </p>
            <h1 className="mt-1.5 text-2xl font-bold tracking-tight text-[#0a1f1f] sm:text-[1.75rem] dark:text-white">
              Dashboard
            </h1>
          </div>

          <div className="rounded-2xl border border-neutral-200/90 bg-white/85 p-1 shadow-[0_4px_20px_-8px_rgba(15,43,43,0.2)] backdrop-blur-xl transition-shadow duration-300 hover:shadow-[0_8px_28px_-10px_rgba(15,43,43,0.3)] dark:border-white/10 dark:bg-white/[0.5]">
            <MonthSwitcher month={month} onChange={setMonth} />
          </div>
        </header>

        {/* balance hero */}
        <div className="animate-fade-up delay-100">
          <BalanceHeader
            remaining={data?.remaining ?? 0}
            onAdd={openExpense}
            onTransfer={() => setIncomeModal(true)}
          />
        </div>

        {/* financial cards */}
        <div className="animate-fade-up delay-200">
          <CardCarousel>
            <div
              onClick={() => router.push("/settings/savings")}
              className="group cursor-pointer transition-transform duration-300 hover:-translate-y-1"
            >
              <SavingsCard
                saved={data?.savingsGoal?.saved ?? 0}
                target={data?.savingsGoal?.target ?? 0}
                mode={data?.savingsGoal?.mode ?? "percent"}
                percentTarget={data?.savingsGoal?.percentTarget ?? 20}
              />
            </div>

            <div className="transition-transform duration-300 hover:-translate-y-1">
              <SpentCard
                spent={data?.spent ?? 0}
                income={data?.income ?? 0}
                lastMonthSpent={data?.lastMonthSpent}
              />
            </div>

            <div className="transition-transform duration-300 hover:-translate-y-1">
              <IncomeCard income={data?.income ?? 0} source="Salary" />
            </div>
          </CardCarousel>
        </div>

        {/* transactions */}
        <section className="animate-fade-up delay-300">
          <div className="overflow-hidden rounded-3xl border border-neutral-200/90 bg-white/85 shadow-[0_12px_40px_-16px_rgba(15,43,43,0.2)] backdrop-blur-xl dark:border-white/[0.08] dark:bg-white/[0.03]">
            <div className="flex items-center justify-between border-b border-neutral-100 px-5 py-4 sm:px-6 dark:border-white/5">
              <div>
                <h2 className="text-[0.9375rem] font-bold tracking-tight text-[#0a1f1f] dark:text-white">
                  Recent transactions
                </h2>
                <p className="mt-0.5 text-xs text-neutral-500 dark:text-neutral-400">
                  Your latest activity this month
                </p>
              </div>

              <Link
                href="/expenses"
                className="group flex shrink-0 items-center gap-1 rounded-lg px-2.5 py-1.5 text-xs font-semibold text-teal-700 transition-colors hover:bg-teal-500/10 dark:text-teal-400"
              >
                View all
                <ArrowRight
                  size={13}
                  strokeWidth={2.4}
                  className="transition-transform duration-300 group-hover:translate-x-0.5"
                />
              </Link>
            </div>

            <div className="px-3 py-1 sm:px-4">
              <TransactionList items={data?.recent ?? []} loading={loading} />
            </div>
          </div>
        </section>
      </div>

      <ExpenseForm
        open={expenseModal}
        onClose={() => setExpenseModal(false)}
        onSaved={refresh}
        categories={categories}
        editing={null}
      />

      <IncomeForm
        open={incomeModal}
        onClose={() => setIncomeModal(false)}
        onSaved={refresh}
        month={month}
      />
    </div>
  );
}
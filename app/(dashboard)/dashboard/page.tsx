"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

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
    return <div className="p-6 text-sm text-red-500">{error}</div>;
  }

  return (
    <div className="mx-auto max-w-5xl space-y-8 p-4 sm:p-6">
      <div className="flex justify-end">
        <MonthSwitcher month={month} onChange={setMonth} />
      </div>

      <BalanceHeader
        remaining={data?.remaining ?? 0}
        onAdd={openExpense}
        onTransfer={() => setIncomeModal(true)}
      />

      <CardCarousel>
        <div
          onClick={() => router.push("/settings/savings")}
          className="cursor-pointer"
        >
          <SavingsCard
            saved={data?.savingsGoal?.saved ?? 0}
            target={data?.savingsGoal?.target ?? 0}
            mode={data?.savingsGoal?.mode ?? "percent"}
            percentTarget={data?.savingsGoal?.percentTarget ?? 20}
          />
        </div>

        <SpentCard
          spent={data?.spent ?? 0}
          income={data?.income ?? 0}
          lastMonthSpent={data?.lastMonthSpent}
        />

        <IncomeCard income={data?.income ?? 0} source="Salary" />
      </CardCarousel>

      <section>
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-lg font-semibold">Recent transactions</h2>
          <Link
            href="/expenses"
            className="text-sm font-medium text-teal-600 hover:underline"
          >
            View all
          </Link>
        </div>
        <TransactionList items={data?.recent ?? []} loading={loading} />
      </section>

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
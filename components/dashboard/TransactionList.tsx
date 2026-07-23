"use client";

import TransactionRow from "./TransactionRow";
import { Receipt } from "lucide-react";
import Link from "next/link";

export interface Txn {
  _id: string;
  amount: number;
  note?: string;
  date: string;
  type?: "expense" | "savings" | "income";
  category: { name: string; icon: string; color: string };
}

export default function TransactionList({
  items, currency = "GBP", loading,
}: { items: Txn[]; currency?: string; loading?: boolean }) {
  if (loading) {
    return (
      <div className="space-y-2">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="flex items-center gap-3 px-2 py-3">
            <div className="h-11 w-11 animate-pulse rounded-full bg-neutral-200 dark:bg-white/10" />
            <div className="flex-1 space-y-2">
              <div className="h-3.5 w-32 animate-pulse rounded bg-neutral-200 dark:bg-white/10" />
              <div className="h-2.5 w-20 animate-pulse rounded bg-neutral-100 dark:bg-white/5" />
            </div>
            <div className="h-4 w-16 animate-pulse rounded bg-neutral-200 dark:bg-white/10" />
          </div>
        ))}
      </div>
    );
  }

  if (!items.length) {
    return (
      <div className="flex flex-col items-center gap-3 rounded-2xl border border-dashed border-neutral-200 py-12 dark:border-white/10">
        <Receipt size={32} className="text-neutral-300" />
        <p className="text-sm text-neutral-400">No transactions this month</p>
        <Link href="/expenses" className="text-sm font-medium text-teal-600 hover:underline">
          Add your first expense
        </Link>
      </div>
    );
  }

  return (
    <div className="divide-y divide-neutral-100 dark:divide-white/5">
      {items.map((t) => (
        <TransactionRow
          key={t._id}
          amount={t.amount}
          note={t.note}
          date={t.date}
          type={t.type}
          categoryName={t.category.name}
          icon={t.category.icon}
          color={t.category.color}
          currency={currency}
        />
      ))}
    </div>
  );
}
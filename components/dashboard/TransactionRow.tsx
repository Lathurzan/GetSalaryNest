"use client";

import * as Icons from "lucide-react";
import { format } from "@/lib/money";
import { cn } from "@/lib/utils";

interface Props {
  amount: number;              // pence, always positive
  categoryName: string;
  icon: string;
  color: string;
  note?: string;
  date: string;
  type?: "expense" | "savings" | "income";
  currency?: string;
  onClick?: () => void;
}

export default function TransactionRow({
  amount, categoryName, icon, color, note, date,
  type = "expense", currency = "GBP", onClick,
}: Props) {
  const Icon = (Icons as any)[icon] ?? Icons.Wallet;
  const positive = type !== "expense";

  const when = new Date(date).toLocaleString("en-GB", {
    day: "2-digit", month: "short", hour: "numeric", minute: "2-digit",
  });

  return (
    <button
      onClick={onClick}
      className="flex w-full items-center gap-3 rounded-2xl px-2 py-3 text-left transition hover:bg-neutral-50 dark:hover:bg-white/5"
    >
      <div
        className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full"
        style={{ backgroundColor: `${color}1a` }}
      >
        <Icon size={19} style={{ color }} />
      </div>

      <div className="min-w-0 flex-1">
        <p className="truncate font-medium text-neutral-900 dark:text-white">
          {note || categoryName}
        </p>
        <p className="mt-0.5 truncate text-xs text-neutral-400">{when}</p>
      </div>

      <div className="shrink-0 text-right">
        <p className={cn(
          "font-semibold tabular-nums",
          positive ? "text-green-600 dark:text-green-400" : "text-neutral-900 dark:text-white"
        )}>
          {positive ? "+" : "−"}{format(amount, currency)}
        </p>
        <p className="mt-0.5 text-xs text-neutral-400">{categoryName}</p>
      </div>
    </button>
  );
}
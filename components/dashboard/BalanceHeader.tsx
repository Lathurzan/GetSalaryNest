"use client";

import { format } from "@/lib/money";
import { Plus, ArrowLeftRight } from "lucide-react";

interface Props {
  remaining: number;
  currency?: string;
  onAdd: () => void;
  onTransfer: () => void;
}

export default function BalanceHeader({ remaining, currency = "GBP", onAdd, onTransfer }: Props) {
  return (
    <div className="flex items-start justify-between">
      <div>
        <p className="text-sm text-neutral-500">Balance</p>
        <h1 className="mt-1 text-4xl font-bold tracking-tight text-neutral-900 dark:text-white sm:text-5xl">
          {format(remaining, currency)}
        </h1>
      </div>

      <div className="flex gap-3">
        <button
          onClick={onAdd}
          aria-label="Add expense"
          className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#0f2b2b] text-white transition hover:bg-[#113c3c] active:scale-95"
        >
          <Plus size={20} />
        </button>
        <button
          onClick={onTransfer}
          aria-label="Move to savings"
          className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#0f2b2b] text-white transition hover:bg-[#113c3c] active:scale-95"
        >
          <ArrowLeftRight size={20} />
        </button>
      </div>
    </div>
  );
}
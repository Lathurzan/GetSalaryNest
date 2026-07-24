"use client";

import Link from "next/link";
import { useSession } from "next-auth/react";
import { Sparkles } from "lucide-react";

export default function TopBar() {
  const { data: session } = useSession();

  return (
    <header className="sticky top-0 z-30 flex items-center justify-between border-b border-neutral-200 bg-white/90 px-4 py-3 backdrop-blur-lg dark:border-white/10 dark:bg-neutral-950/90 lg:hidden">
      <Link href="/dashboard" className="flex items-center gap-2">
        <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#0f2b2b]">
          <span className="text-xs font-bold text-teal-400">S</span>
        </div>
        <span className="text-sm font-semibold">SalaryNest</span>
      </Link>

      {!session?.user?.isPremium && (
        <Link
          href="/pricing"
          className="flex items-center gap-1.5 rounded-full bg-[#0f2b2b] px-3 py-1.5 text-xs font-medium text-white"
        >
          <Sparkles size={12} className="text-teal-400" />
          Upgrade
        </Link>
      )}
    </header>
  );
}
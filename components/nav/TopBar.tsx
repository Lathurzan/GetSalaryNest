"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut, useSession } from "next-auth/react";
import {
  Sparkles, Menu, X, LayoutDashboard, Receipt,
  PieChart, Settings, LogOut,
} from "lucide-react";
import { cn } from "@/lib/utils";

const NAV = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/expenses", label: "Expenses", icon: Receipt },
  { href: "/reports", label: "Reports", icon: PieChart },
  { href: "/settings", label: "Settings", icon: Settings },
];

export default function TopBar() {
  const { data: session } = useSession();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const active = (href: string) =>
    href === "/dashboard" ? pathname === href : pathname.startsWith(href);

  return (
    <>
      <header className="sticky top-0 z-30 flex items-center justify-between border-b border-neutral-200 bg-white/90 px-4 py-3 backdrop-blur-lg dark:border-white/10 dark:bg-neutral-950/90 lg:hidden">
        <Link href="/dashboard" className="flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#0f2b2b]">
            <span className="text-xs font-bold text-teal-400">S</span>
          </div>
          <span className="text-sm font-semibold text-[#0a1f1f] dark:text-white">
            SalaryNest
          </span>
        </Link>

        <div className="flex items-center gap-2">
          {!session?.user?.isPremium && (
            <Link
              href="/settings/billing"
              className="flex items-center gap-1.5 rounded-full bg-[#0f2b2b] px-3 py-1.5 text-xs font-medium text-white"
            >
              <Sparkles size={12} className="text-teal-400" />
              Upgrade
            </Link>
          )}

          <button
            onClick={() => setOpen(true)}
            aria-label="Open menu"
            className="flex h-9 w-9 items-center justify-center rounded-xl border border-neutral-200 text-neutral-600 transition hover:bg-neutral-50 active:scale-95 dark:border-white/10 dark:text-neutral-300 dark:hover:bg-white/5"
          >
            <Menu size={18} />
          </button>
        </div>
      </header>

      {/* slide-out drawer */}
      {open && (
        <div className="fixed inset-0 z-50 lg:hidden">
          {/* backdrop */}
          <div
            onClick={() => setOpen(false)}
            className="absolute inset-0 bg-[#0a1f1f]/50 backdrop-blur-sm"
          />

          {/* panel */}
          <aside className="absolute right-0 top-0 flex h-full w-72 max-w-[80vw] flex-col border-l border-neutral-200 bg-white p-5 pt-[calc(env(safe-area-inset-top)+1.25rem)] shadow-2xl dark:border-white/10 dark:bg-neutral-950">
            <div className="mb-6 flex items-center justify-between">
              <span className="text-sm font-semibold text-[#0a1f1f] dark:text-white">
                Menu
              </span>
              <button
                onClick={() => setOpen(false)}
                aria-label="Close menu"
                className="flex h-9 w-9 items-center justify-center rounded-full border border-neutral-200 text-neutral-500 transition hover:rotate-90 dark:border-white/10 dark:text-neutral-400"
              >
                <X size={17} />
              </button>
            </div>

            {/* account */}
            <div className="mb-5 flex items-center gap-3 rounded-2xl bg-neutral-50 p-3 dark:bg-white/[0.03]">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#0f2b2b] text-xs font-bold text-teal-400">
                {session?.user?.name?.[0]?.toUpperCase() ?? "?"}
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-[#0a1f1f] dark:text-white">
                  {session?.user?.name}
                </p>
                <p className="truncate text-xs text-neutral-500">
                  {session?.user?.isPremium ? "Premium" : "Free plan"}
                </p>
              </div>
            </div>

            {/* nav */}
            <nav className="flex-1 space-y-1">
              {NAV.map(({ href, label, icon: Icon }) => (
                <Link
                  key={href}
                  href={href}
                  onClick={() => setOpen(false)}
                  className={cn(
                    "flex items-center gap-3 rounded-xl px-3 py-3 text-sm transition",
                    active(href)
                      ? "bg-[#0f2b2b] font-medium text-white"
                      : "text-neutral-600 hover:bg-neutral-100 dark:text-neutral-300 dark:hover:bg-white/5"
                  )}
                >
                  <Icon size={18} />
                  {label}
                </Link>
              ))}
            </nav>

            <button
              onClick={() => signOut({ callbackUrl: "/" })}
              className="mt-4 flex items-center gap-3 rounded-xl border border-neutral-200 px-3 py-3 text-sm font-medium text-red-500 transition hover:bg-red-50 dark:border-white/10 dark:hover:bg-red-500/10"
            >
              <LogOut size={17} />
              Sign out
            </button>
          </aside>
        </div>
      )}
    </>
  );
}
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import { LogOut, Sparkles } from "lucide-react";
import { NAV, SECONDARY } from "@/lib/nav";
import { cn } from "@/lib/utils";

export default function Sidebar() {
  const pathname = usePathname();
  const { data: session } = useSession();
  const isPremium = session?.user?.isPremium;

  const active = (href: string) =>
    href === "/dashboard" ? pathname === href : pathname.startsWith(href);

  return (
    <aside className="fixed left-0 top-0 hidden h-screen w-60 flex-col border-r border-neutral-200 bg-white p-4 dark:border-white/10 dark:bg-neutral-950 lg:flex">
      <Link href="/dashboard" className="mb-8 flex items-center gap-2 px-2 pt-2">
        <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#0f2b2b]">
          <span className="text-sm font-bold text-teal-400">S</span>
        </div>
        <span className="font-semibold tracking-tight">SalaryNest</span>
      </Link>

      <nav className="flex-1 space-y-1">
        {NAV.map(({ href, label, icon: Icon }) => (
          <Link
            key={href}
            href={href}
            className={cn(
              "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition",
              active(href)
                ? "bg-[#0f2b2b] font-medium text-white"
                : "text-neutral-600 hover:bg-neutral-100 dark:text-neutral-300 dark:hover:bg-white/5"
            )}
          >
            <Icon size={17} />
            {label}
          </Link>
        ))}

        <div className="my-3 border-t border-neutral-100 dark:border-white/5" />

        {SECONDARY.map(({ href, label, icon: Icon }) => (
          <Link
            key={href}
            href={href}
            className={cn(
              "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition",
              active(href)
                ? "bg-neutral-100 font-medium dark:bg-white/5"
                : "text-neutral-500 hover:bg-neutral-50 dark:hover:bg-white/5"
            )}
          >
            <Icon size={17} />
            {label}
          </Link>
        ))}
      </nav>

      {!isPremium && (
        <Link
          href="/pricing"
          className="mb-3 rounded-2xl bg-gradient-to-br from-[#0f2b2b] to-[#113c3c] p-4 text-white"
        >
          <div className="flex items-center gap-1.5 text-xs font-medium text-teal-400">
            <Sparkles size={13} /> Premium
          </div>
          <p className="mt-1.5 text-xs leading-relaxed text-white/60">
            Unlimited expenses, receipts, and PDF export.
          </p>
          <span className="mt-2.5 inline-block text-xs font-medium">
            Upgrade →
          </span>
        </Link>
      )}

      <div className="flex items-center gap-2.5 rounded-xl px-3 py-2.5">
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-neutral-100 text-xs font-medium dark:bg-white/10">
          {session?.user?.name?.[0]?.toUpperCase() ?? "?"}
        </div>
        <div className="min-w-0 flex-1">
          <p className="truncate text-xs font-medium">{session?.user?.name}</p>
          <p className="truncate text-[11px] text-neutral-400">
            {isPremium ? "Premium" : "Free plan"}
          </p>
        </div>
        <button
          onClick={() => signOut({ callbackUrl: "/" })}
          aria-label="Sign out"
          className="rounded-lg p-1.5 text-neutral-400 hover:bg-neutral-100 hover:text-red-500 dark:hover:bg-white/5"
        >
          <LogOut size={15} />
        </button>
      </div>
    </aside>
  );
}
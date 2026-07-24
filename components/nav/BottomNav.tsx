"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { NAV } from "@/lib/nav";
import { cn } from "@/lib/utils";

export default function BottomNav() {
  const pathname = usePathname();

  const active = (href: string) =>
    href === "/dashboard" ? pathname === href : pathname.startsWith(href);

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 border-t border-neutral-200 bg-white/95 backdrop-blur-lg dark:border-white/10 dark:bg-neutral-950/95 lg:hidden">
      <div className="flex items-center justify-around px-2 pb-[env(safe-area-inset-bottom)] pt-2">
        {NAV.map(({ href, label, icon: Icon }) => (
          <Link
            key={href}
            href={href}
            className={cn(
              "flex flex-1 flex-col items-center gap-0.5 rounded-xl py-1.5 transition",
              active(href) ? "text-[#0f2b2b] dark:text-teal-400" : "text-neutral-400"
            )}
          >
            <Icon size={20} strokeWidth={active(href) ? 2.4 : 1.8} />
            <span className="text-[10px] font-medium">{label}</span>
          </Link>
        ))}
      </div>
    </nav>
  );
}
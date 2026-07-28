"use client";

import Link from "next/link";
import { useCookieConsent } from "@/lib/hooks/useCookieConsent";

export default function Footer() {
  const { reopen } = useCookieConsent();

  return (
    <footer className="border-t border-neutral-100 dark:border-white/5">
      <div className="mx-auto flex max-w-5xl flex-col items-center gap-4 px-6 py-8 sm:flex-row sm:justify-between">
        <div className="flex items-center gap-2">
          <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-[#0f2b2b]">
            <span className="text-[10px] font-bold text-teal-400">S</span>
          </div>
          <span className="text-sm font-semibold text-[#0a1f1f] dark:text-white">SalaryNest</span>
          <span className="text-xs text-neutral-400">© {new Date().getFullYear()}</span>
        </div>

        <nav className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-xs text-neutral-500">
          <Link href="/privacy" className="hover:text-neutral-900 dark:hover:text-white">Privacy Policy</Link>
          <Link href="/terms" className="hover:text-neutral-900 dark:hover:text-white">Terms of Service</Link>
          <button onClick={reopen} className="hover:text-neutral-900 dark:hover:text-white">Cookie Settings</button>
          <a href="mailto:support@getsalarynest.com" className="hover:text-neutral-900 dark:hover:text-white">Contact</a>
          <a href="mailto:support@getsalarynest.com" className="hover:text-neutral-900 dark:hover:text-white">Support</a>
        </nav>
      </div>
    </footer>
  );
}
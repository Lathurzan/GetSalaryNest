import Link from "next/link";

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-white dark:bg-neutral-950">
      <header className="border-b border-neutral-100 dark:border-white/5">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#0f2b2b]">
              <span className="text-sm font-bold text-teal-400">S</span>
            </div>
            <span className="font-semibold tracking-tight">SalaryNest</span>
          </Link>

          <nav className="flex items-center gap-5 text-sm">
            <Link href="/pricing" className="text-neutral-500 hover:text-neutral-900 dark:hover:text-white">
              Pricing
            </Link>
            <Link href="/login" className="text-neutral-500 hover:text-neutral-900 dark:hover:text-white">
              Sign in
            </Link>
            <Link
              href="/register"
              className="rounded-xl bg-[#0f2b2b] px-4 py-2 font-medium text-white"
            >
              Get started
            </Link>
          </nav>
        </div>
      </header>

      {children}

      <footer className="mt-16 border-t border-neutral-100 px-6 py-8 text-center text-xs text-neutral-400 dark:border-white/5">
        © {new Date().getFullYear()} SalaryNest
      </footer>
    </div>
  );
}
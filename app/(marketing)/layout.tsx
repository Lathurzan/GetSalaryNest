import Link from "next/link";
import Footer from "@/components/marketing/Footer";

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-white dark:bg-neutral-950">
      <header className="border-b border-neutral-100 dark:border-white/5">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-4 sm:px-6">
          {/* logo */}
          <Link href="/" className="flex shrink-0 items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#0f2b2b]">
              <span className="text-sm font-bold text-teal-400">S</span>
            </div>
            <span className="font-semibold tracking-tight text-[#0a1f1f] dark:text-white">
              SalaryNest
            </span>
          </Link>

          {/* nav */}
          <nav className="flex items-center gap-2 sm:gap-5 sm:text-sm">
            {/* Pricing — hidden on mobile, shown from sm up */}
            <Link
              href="/pricing"
              className="hidden text-neutral-500 hover:text-neutral-900 sm:inline dark:hover:text-white"
            >
              Pricing
            </Link>

            {/* Sign in — always visible */}
            <Link
              href="/login"
              className="text-sm text-neutral-600 hover:text-neutral-900 dark:text-neutral-300 dark:hover:text-white"
            >
              Sign in
            </Link>

            {/* Get started — always visible */}
            <Link
              href="/register"
              className="whitespace-nowrap rounded-xl bg-[#0f2b2b] px-3.5 py-2 text-sm font-medium text-white sm:px-4"
            >
              Get started
            </Link>
          </nav>
        </div>
      </header>

      {children}
      <Footer />
      <footer className="mt-16 border-t border-neutral-100 px-6 py-8 text-center text-xs text-neutral-400 dark:border-white/5">
        © {new Date().getFullYear()} SalaryNest
      </footer>
    </div>
  );
}
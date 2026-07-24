import Link from "next/link";
import { Check, PieChart, Receipt, PiggyBank, FileDown } from "lucide-react";

const FEATURES = [
  {
    icon: PiggyBank,
    title: "Savings goals that adapt",
    body: "Set a percentage of your salary or a fixed amount. The target recalculates when your income changes.",
  },
  {
    icon: Receipt,
    title: "Every expense, categorised",
    body: "Rent, groceries, transport, eating out. See where the money actually went, not where you thought it went.",
  },
  {
    icon: PieChart,
    title: "Monthly reports",
    body: "Category breakdowns, month-over-month comparisons, and budget warnings before you overspend.",
  },
  {
    icon: FileDown,
    title: "Receipts and statements",
    body: "Attach bill photos to expenses. Import a bank statement PDF instead of typing everything twice.",
  },
];

export default function LandingPage() {
  return (
    <>
      {/* ambient background */}
      <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute -top-40 left-1/2 h-[36rem] w-[36rem] -translate-x-1/2 rounded-full bg-teal-400/15 blur-[120px] dark:bg-teal-500/10" />
        <div className="absolute -right-32 top-1/4 h-96 w-96 rounded-full bg-[#0f2b2b]/10 blur-[100px] dark:bg-teal-400/5" />
        <div className="absolute -left-32 top-2/3 h-80 w-80 rounded-full bg-emerald-300/10 blur-[100px] dark:bg-emerald-500/5" />
        <div
          className="absolute inset-0 opacity-[0.15] dark:opacity-[0.07]"
          style={{
            backgroundImage:
              "linear-gradient(to right, #0f2b2b 1px, transparent 1px), linear-gradient(to bottom, #0f2b2b 1px, transparent 1px)",
            backgroundSize: "64px 64px",
            maskImage:
              "radial-gradient(ellipse 80% 50% at 50% 0%, black 40%, transparent 100%)",
            WebkitMaskImage:
              "radial-gradient(ellipse 80% 50% at 50% 0%, black 40%, transparent 100%)",
          }}
        />
      </div>

      {/* hero */}
      <section className="relative mx-auto max-w-4xl px-6 pb-16 pt-24 text-center sm:pb-24 sm:pt-32">
        <p className="animate-fade-up mb-6 inline-flex items-center gap-2 rounded-full border border-teal-500/20 bg-teal-500/[0.07] px-4 py-1.5 text-xs font-medium tracking-wide text-teal-700 backdrop-blur-sm dark:text-teal-400">
          <span className="relative flex h-1.5 w-1.5">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-teal-500 opacity-75" />
            <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-teal-500" />
          </span>
          Personal salary management
        </p>

        <h1 className="animate-fade-up delay-100 text-balance text-[2.75rem] font-bold leading-[1.05] tracking-[-0.03em] text-[#0f2b2b] sm:text-6xl lg:text-7xl dark:text-white">
          Know where your salary goes,
          <br />
          <span className="bg-gradient-to-r from-teal-500 via-emerald-400 to-teal-600 bg-clip-text text-transparent">
            before it&apos;s gone.
          </span>
        </h1>

        <p className="animate-fade-up delay-200 mx-auto mt-7 max-w-lg text-pretty text-base leading-relaxed text-neutral-500 sm:text-lg dark:text-neutral-400">
          Track rent, groceries, and everyday spending in one place. Set a savings
          target and watch it fill.
        </p>

        <div className="animate-fade-up delay-300 mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Link
            href="/register"
            className="group relative w-full overflow-hidden rounded-2xl bg-[#0f2b2b] px-8 py-4 text-sm font-semibold text-white shadow-[0_8px_30px_-8px_rgba(15,43,43,0.6)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_16px_40px_-12px_rgba(15,43,43,0.7)] active:translate-y-0 sm:w-auto"
          >
            <span className="absolute inset-0 bg-gradient-to-r from-teal-500/0 via-teal-400/25 to-teal-500/0 opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
            <span className="relative">Start free</span>
          </Link>

          <Link
            href="/pricing"
            className="w-full rounded-2xl border border-neutral-200/80 bg-white/60 px-8 py-4 text-sm font-semibold text-[#0f2b2b] backdrop-blur-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-neutral-300 hover:bg-white hover:shadow-lg sm:w-auto dark:border-white/10 dark:bg-white/5 dark:text-white dark:hover:bg-white/10"
          >
            See pricing
          </Link>
        </div>

        <p className="animate-fade-up delay-400 mt-6 text-xs text-neutral-400">
          No card required · 50 expenses a month on the free plan
        </p>
      </section>

      {/* preview card */}
      <section className="relative mx-auto max-w-md px-6 pb-28">
        <div className="animate-fade-up delay-500 relative">
          {/* glow */}
          <div className="absolute -inset-6 rounded-[2.5rem] bg-gradient-to-br from-teal-400/20 via-transparent to-emerald-400/10 blur-2xl" />

          {/* floating chips */}
          <div className="animate-float absolute -left-4 top-8 z-20 hidden rounded-2xl border border-white/60 bg-white/80 px-3.5 py-2.5 shadow-[0_8px_30px_-8px_rgba(0,0,0,0.25)] backdrop-blur-xl sm:block dark:border-white/10 dark:bg-neutral-900/80">
            <p className="text-[10px] font-medium uppercase tracking-wider text-neutral-400">
              Rent
            </p>
            <p className="text-sm font-semibold text-[#0f2b2b] dark:text-white">
              −£950.00
            </p>
          </div>

          <div className="animate-float-slow absolute -right-5 bottom-10 z-20 hidden rounded-2xl border border-white/60 bg-white/80 px-3.5 py-2.5 shadow-[0_8px_30px_-8px_rgba(0,0,0,0.25)] backdrop-blur-xl sm:block dark:border-white/10 dark:bg-neutral-900/80">
            <p className="text-[10px] font-medium uppercase tracking-wider text-neutral-400">
              This month
            </p>
            <p className="text-sm font-semibold text-teal-600 dark:text-teal-400">
              +£1,400
            </p>
          </div>

          {/* main card */}
          <div className="group relative h-56 overflow-hidden rounded-[1.75rem] bg-gradient-to-br from-[#0f2b2b] via-[#113c3c] to-[#0a1f1f] p-7 shadow-[0_24px_70px_-20px_rgba(15,43,43,0.7)] ring-1 ring-white/10 transition-transform duration-500 hover:scale-[1.02]">
            <div
              className="pointer-events-none absolute inset-0 opacity-70 transition-opacity duration-500 group-hover:opacity-100"
              style={{
                background:
                  "radial-gradient(circle at 70% 40%, #14b8a640 0%, transparent 62%)",
              }}
            />
            <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/25 to-transparent" />

            <div className="relative flex h-full flex-col justify-between">
              <div>
                <p className="text-[10px] font-medium uppercase tracking-[0.12em] text-white/50">
                  Monthly savings
                </p>
                <p className="mt-2.5 text-4xl font-semibold tracking-tight text-white">
                  £1,400.00
                </p>
              </div>

              <div>
                <div className="flex items-baseline justify-between">
                  <p className="text-xs text-white/45">
                    Goal £2,000 · 20% of income
                  </p>
                  <p className="text-xs font-semibold text-teal-400">70%</p>
                </div>
                <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-white/[0.08]">
                  <div className="h-full w-[70%] rounded-full bg-gradient-to-r from-teal-500 to-emerald-400 shadow-[0_0_12px_rgba(20,184,166,0.5)]" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* features */}
      <section className="mx-auto max-w-5xl px-6 pb-28">
        <div className="mb-14 text-center">
          <h2 className="text-3xl font-bold tracking-tight text-[#0f2b2b] sm:text-4xl dark:text-white">
            Built for real budgets
          </h2>
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          {FEATURES.map(({ icon: Icon, title, body }, i) => (
            <div
              key={title}
              className={`group animate-fade-up delay-${(i + 1) * 100} relative overflow-hidden rounded-3xl border border-neutral-200/70 bg-white/70 p-7 shadow-sm backdrop-blur-sm transition-all duration-400 hover:-translate-y-1.5 hover:border-teal-500/25 hover:shadow-[0_20px_50px_-20px_rgba(15,43,43,0.3)] dark:border-white/[0.07] dark:bg-white/[0.02] dark:hover:border-teal-400/20`}
            >
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-teal-500/0 to-teal-500/0 opacity-0 transition-opacity duration-500 group-hover:from-teal-500/[0.04] group-hover:to-transparent group-hover:opacity-100" />

              <div className="relative">
                <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-teal-500/15 to-emerald-500/5 ring-1 ring-teal-500/15 transition-all duration-400 group-hover:scale-110 group-hover:rotate-[-6deg] group-hover:ring-teal-500/30">
                  <Icon
                    size={21}
                    className="text-teal-600 transition-colors duration-300 group-hover:text-teal-500 dark:text-teal-400"
                    strokeWidth={1.9}
                  />
                </div>

                <h3 className="text-base font-semibold tracking-tight text-[#0f2b2b] dark:text-white">
                  {title}
                </h3>
                <p className="mt-2.5 text-sm leading-relaxed text-neutral-500 dark:text-neutral-400">
                  {body}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* cta */}
      <section className="mx-auto max-w-3xl px-6 pb-20">
        <div className="animate-fade-up relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-[#0f2b2b] via-[#113c3c] to-[#0a1f1f] p-10 text-center shadow-[0_30px_80px_-30px_rgba(15,43,43,0.8)] ring-1 ring-white/10 sm:p-14">
          <div
            className="pointer-events-none absolute inset-0 opacity-60"
            style={{
              background:
                "radial-gradient(circle at 50% 0%, #14b8a638 0%, transparent 60%)",
            }}
          />
          <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/25 to-transparent" />

          <div className="relative">
            <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
              Start tracking in 30 seconds
            </h2>
            <p className="mt-3 text-sm text-white/55 sm:text-base">
              Free forever for casual use. Upgrade when you need more.
            </p>

            <ul className="mx-auto mt-9 flex max-w-xs flex-col gap-3 text-left">
              {[
                "No credit card to sign up",
                "Your data stays yours",
                "Cancel Premium anytime",
              ].map((t) => (
                <li
                  key={t}
                  className="flex items-center gap-3 text-sm text-white/80"
                >
                  <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-teal-500/20 ring-1 ring-teal-400/25">
                    <Check size={11} className="text-teal-400" strokeWidth={3} />
                  </span>
                  {t}
                </li>
              ))}
            </ul>

            <Link
              href="/register"
              className="group mt-10 inline-flex items-center gap-2 rounded-2xl bg-white px-9 py-4 text-sm font-semibold text-[#0f2b2b] shadow-[0_8px_30px_-8px_rgba(255,255,255,0.4)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_16px_40px_-12px_rgba(255,255,255,0.5)] active:translate-y-0"
            >
              Create free account
              <span className="transition-transform duration-300 group-hover:translate-x-1">
                →
              </span>
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
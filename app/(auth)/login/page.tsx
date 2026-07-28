"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { signIn } from "next-auth/react";
import Link from "next/link";
import { Suspense } from "react";
import { Eye, EyeOff, Loader2, Mail, Lock, ShieldCheck, PieChart, Sparkles, Target, Wallet } from "lucide-react";

function LoginInner() {
  const router = useRouter();
  const params = useSearchParams();
  const callbackUrl = params.get("callbackUrl") ?? "/dashboard";

  const [form, setForm] = useState({ email: "", password: "" });
  const [showPw, setShowPw] = useState(false);
  const [remember, setRemember] = useState(true);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  const set = (k: string, v: string) => setForm((f) => ({ ...f, [k]: v }));

  const submit = async () => {
    setError("");
    if (!form.email || !form.password) return setError("Enter your email and password");

    setLoading(true);
    const res = await signIn("credentials", {
      email: form.email,
      password: form.password,
      redirect: false,
    });
    setLoading(false);

    if (res?.error) return setError("Invalid email or password");
    router.push(callbackUrl);
  };

  const google = () => {
    setGoogleLoading(true);
    signIn("google", { callbackUrl });
  };

  return (
    <div className="flex min-h-screen">
     {/* ── LEFT: login card ── */}
<div className="relative flex flex-1 items-center justify-center bg-emerald-50 px-4 py-10 sm:px-6 lg:w-[57%] dark:bg-[#07100f]">        {/* ambient background */}
        <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
          <div className="absolute -top-48 left-1/2 h-[30rem] w-[30rem] -translate-x-1/2 rounded-full bg-teal-300/25 blur-[130px] sm:h-[34rem] sm:w-[34rem] dark:bg-teal-500/12" />
          <div className="absolute -bottom-40 -left-32 h-80 w-80 rounded-full bg-emerald-200/30 blur-[120px] sm:h-96 sm:w-96 dark:bg-emerald-500/8" />
          <div className="absolute -right-32 top-1/4 h-72 w-72 rounded-full bg-cyan-200/25 blur-[120px] sm:h-80 sm:w-80 dark:bg-cyan-500/8" />
          <div
            className="absolute inset-0 opacity-[0.07] dark:opacity-[0.05]"
            style={{
              backgroundImage:
                "linear-gradient(to right, #2e8484 1px, transparent 1px), linear-gradient(to bottom, #2e8585 1px, transparent 1px)",
              backgroundSize: "56px 56px",
              maskImage: "radial-gradient(ellipse 70% 60% at 50% 40%, black 20%, transparent 90%)",
              WebkitMaskImage: "radial-gradient(ellipse 70% 60% at 50% 40%, black 20%, transparent 90%)",
            }}
          />
        </div>

        <div className="w-full max-w-[460px]">
          <div className="animate-fade-up relative rounded-3xl border border-neutral-200/90 bg-white/95 p-7 shadow-[0_24px_60px_-20px_rgba(15,43,43,0.28),0_2px_8px_-2px_rgba(15,43,43,0.08)] backdrop-blur-2xl sm:p-9 dark:border-white/[0.12] dark:bg-[#0d1817]/95 dark:shadow-[0_24px_70px_-20px_rgba(0,0,0,0.7)]">
            <div className="pointer-events-none absolute inset-x-8 top-0 h-px bg-gradient-to-r from-transparent via-teal-500/60 to-transparent" />

            {/* logo — mobile only */}
            <div className="mb-6 flex items-center gap-2.5 lg:hidden">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-[#0f2b2b] to-[#113c3c] ring-1 ring-white/10">
                <span className="text-base font-bold text-teal-400">S</span>
              </div>
              <span className="text-lg font-semibold tracking-tight text-[#0a1f1f] dark:text-white">
                SalaryNest
              </span>
            </div>

            <h1 className="text-[1.75rem] font-extrabold leading-[1.15] tracking-[-0.025em] text-[#0a1f1f] sm:text-[2rem] dark:text-white">
              Welcome{" "}
              <span className="bg-gradient-to-r from-teal-600 via-emerald-500 to-teal-500 bg-clip-text text-transparent dark:from-teal-300 dark:via-emerald-300 dark:to-teal-400">
                back
              </span>
            </h1>
            <p className="mt-2.5 text-[0.9375rem] text-neutral-600 dark:text-neutral-300">
              Sign in to continue to SalaryNest.
            </p>

            {/* Google */}
            <button
              onClick={google}
              disabled={googleLoading}
              className="mt-7 flex w-full items-center justify-center gap-2.5 rounded-2xl border border-neutral-300 bg-white py-3.5 text-sm font-semibold text-neutral-800 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-neutral-400 hover:shadow-md active:scale-[0.99] disabled:opacity-60 dark:border-white/15 dark:bg-white/[0.06] dark:text-white dark:hover:border-white/25 dark:hover:bg-white/[0.1]"
            >
              {googleLoading ? <Loader2 size={16} className="animate-spin" /> : <GoogleIcon />}
              Continue with Google
            </button>

            {/* divider */}
            <div className="my-6 flex items-center gap-3">
              <div className="h-px flex-1 bg-gradient-to-r from-transparent to-neutral-200 dark:to-white/10" />
              <span className="text-[10px] font-semibold uppercase tracking-wide text-neutral-500 dark:text-neutral-400">
                Or continue with email
              </span>
              <div className="h-px flex-1 bg-gradient-to-l from-transparent to-neutral-200 dark:to-white/10" />
            </div>

            {/* email */}
            <div>
              <label className="mb-1.5 block text-xs font-semibold text-neutral-600 dark:text-neutral-300">
                Email
              </label>
              <div className="group relative">
                <Mail size={16} strokeWidth={1.9} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-500 transition-colors group-focus-within:text-teal-600 dark:text-neutral-400 dark:group-focus-within:text-teal-400" />
                <input
                  type="email"
                  autoFocus
                  value={form.email}
                  onChange={(e) => set("email", e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && submit()}
                  className="w-full rounded-2xl border border-neutral-300 bg-white py-3 pl-11 pr-4 text-base text-neutral-900 outline-none transition-all placeholder:text-neutral-400 hover:border-neutral-400 focus:border-teal-600 focus:ring-4 focus:ring-teal-500/15 sm:text-sm dark:border-white/15 dark:bg-white/[0.06] dark:text-white dark:hover:border-white/25 dark:focus:border-teal-400"
                />
              </div>
            </div>

            {/* password */}
            <div className="mt-3">
              <div className="mb-1.5 flex items-center justify-between">
                <label className="text-xs font-semibold text-neutral-600 dark:text-neutral-300">
                  Password
                </label>
                <Link
                  href="/forgot-password"
                  className="text-xs font-medium text-teal-700 hover:underline dark:text-teal-300"
                >
                  Forgot password?
                </Link>
              </div>
              <div className="group relative">
                <Lock size={16} strokeWidth={1.9} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-500 transition-colors group-focus-within:text-teal-600 dark:text-neutral-400 dark:group-focus-within:text-teal-400" />
                <input
                  type={showPw ? "text" : "password"}
                  value={form.password}
                  onChange={(e) => set("password", e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && submit()}
                  className="w-full rounded-2xl border border-neutral-300 bg-white py-3 pl-11 pr-11 text-base text-neutral-900 outline-none transition-all placeholder:text-neutral-400 hover:border-neutral-400 focus:border-teal-600 focus:ring-4 focus:ring-teal-500/15 sm:text-sm dark:border-white/15 dark:bg-white/[0.06] dark:text-white dark:hover:border-white/25 dark:focus:border-teal-400"
                />
                <button
                  type="button"
                  onClick={() => setShowPw((s) => !s)}
                  aria-label={showPw ? "Hide password" : "Show password"}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 transition-colors hover:text-neutral-600 dark:hover:text-neutral-200"
                >
                  {showPw ? <EyeOff size={17} /> : <Eye size={17} />}
                </button>
              </div>
            </div>

            {/* remember me */}
            <label className="mt-4 flex cursor-pointer items-center gap-2.5">
              <input
                type="checkbox"
                checked={remember}
                onChange={(e) => setRemember(e.target.checked)}
                className="h-4 w-4 accent-teal-500"
              />
              <span className="text-xs text-neutral-500 dark:text-neutral-400">Remember me</span>
            </label>

            {error && (
              <div className="mt-4 flex items-start gap-2.5 rounded-xl border border-red-300 bg-red-50 px-3.5 py-3 dark:border-red-500/30 dark:bg-red-500/15">
                <p className="text-sm font-medium leading-snug text-red-700 dark:text-red-300">
                  {error}
                </p>
              </div>
            )}

            <button
              onClick={submit}
              disabled={loading}
              className="group relative mt-5 flex w-full items-center justify-center gap-2 overflow-hidden rounded-2xl bg-gradient-to-br from-[#0f2b2b] to-[#164040] py-4 text-sm font-semibold text-white shadow-[0_10px_30px_-10px_rgba(15,43,43,0.75)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_16px_38px_-12px_rgba(15,43,43,0.85)] active:translate-y-0 active:scale-[0.99] disabled:opacity-60"
            >
              <span className="absolute inset-0 bg-gradient-to-r from-teal-500/0 via-teal-400/30 to-teal-500/0 opacity-0 transition-opacity duration-500 group-hover:opacity-100 group-disabled:opacity-0" />
              <span className="relative flex items-center gap-2">
                {loading && <Loader2 size={15} className="animate-spin" />}
                {loading ? "Signing in…" : "Sign in"}
              </span>
            </button>

            <p className="mt-6 text-center text-sm text-neutral-600 dark:text-neutral-300">
              Don't have an account?{" "}
              <Link href="/register" className="font-semibold text-teal-700 hover:underline dark:text-teal-300">
                Create account
              </Link>
            </p>
          </div>

          {/* trust badges */}
          <div className="mt-6 flex flex-col gap-2.5">
            {[
              { icon: ShieldCheck, text: "Encrypted sign-in" },
              { icon: EyeOff, text: "Your financial data stays private" },
              { icon: Sparkles, text: "Free forever plan available" },
            ].map(({ icon: Icon, text }) => (
              <div
                key={text}
                className="flex items-center justify-center gap-2 text-xs font-medium text-neutral-600 dark:text-neutral-400"
              >
                <Icon size={13} strokeWidth={2.2} className="shrink-0 text-teal-600 dark:text-teal-400" />
                {text}
              </div>
            ))}
          </div>
        </div>
      </div>
      {/* ── RIGHT: branding panel ── */}
      <div className="relative hidden w-[43%] overflow-hidden bg-gradient-to-br from-[#0f2b2b] via-[#124744] to-[#0a1f1f] lg:flex lg:flex-col lg:justify-between lg:p-12">
        <div className="pointer-events-none absolute inset-0">
          <div
            className="absolute inset-0 opacity-90"
            style={{
              background:
                "radial-gradient(circle at 70% 20%, rgba(20,184,166,0.25) 0%, transparent 55%), radial-gradient(circle at 30% 80%, rgba(16,185,129,0.18) 0%, transparent 55%)",
            }}
          />
        </div>

        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="animate-float absolute -left-12 top-24 h-64 w-64 rounded-full bg-teal-500/15 blur-[80px]" />
          <div className="animate-float-slow absolute -right-16 top-1/3 h-72 w-72 rounded-full bg-emerald-400/12 blur-[90px]" />
          <div className="animate-float absolute bottom-16 left-1/4 h-56 w-56 rounded-full bg-teal-400/10 blur-[70px]" />
          <div className="animate-float-slow absolute right-16 top-16 h-16 w-16 rotate-12 rounded-2xl border border-white/10 bg-white/[0.04] backdrop-blur-sm" />
          <div className="animate-float absolute bottom-32 right-24 h-10 w-10 -rotate-6 rounded-xl border border-white/10 bg-white/[0.05] backdrop-blur-sm" />
          <div
            className="absolute inset-0 opacity-[0.06]"
            style={{
              backgroundImage:
                "linear-gradient(to right, #fff 1px, transparent 1px), linear-gradient(to bottom, #fff 1px, transparent 1px)",
              backgroundSize: "48px 48px",
              maskImage: "radial-gradient(ellipse 80% 80% at 50% 50%, black 20%, transparent 90%)",
              WebkitMaskImage: "radial-gradient(ellipse 80% 80% at 50% 50%, black 20%, transparent 90%)",
            }}
          />
        </div>

        <div className="relative flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/10 ring-1 ring-white/20">
            <span className="text-base font-bold text-teal-400">S</span>
          </div>
          <span className="text-lg font-semibold tracking-tight text-white">SalaryNest</span>
        </div>

        <div className="animate-fade-up relative">
          <div className="animate-float mb-9 rounded-3xl border border-white/10 bg-white/[0.06] p-5 shadow-[0_20px_60px_-20px_rgba(0,0,0,0.5)] backdrop-blur-md">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[10px] font-medium uppercase tracking-wider text-white/45">Monthly savings</p>
                <p className="mt-1 text-2xl font-bold tracking-tight text-white">£1,400</p>
              </div>
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-teal-500/20 ring-1 ring-teal-400/25">
                <Wallet size={18} className="text-teal-400" />
              </div>
            </div>
            <div className="mt-4">
              <div className="flex justify-between text-[10px] text-white/45">
                <span>Goal £2,000</span>
                <span className="font-semibold text-teal-400">70%</span>
              </div>
              <div className="mt-1.5 h-2 overflow-hidden rounded-full bg-white/10">
                <div className="h-full w-[70%] rounded-full bg-gradient-to-r from-teal-500 to-emerald-400 shadow-[0_0_12px_rgba(20,184,166,0.5)]" />
              </div>
            </div>
            <div className="mt-5 flex items-end gap-1.5">
              {[40, 65, 45, 80, 55, 90, 70].map((h, i) => (
                <div key={i} className="flex-1 rounded-t bg-gradient-to-t from-teal-500/40 to-emerald-400/70" style={{ height: `${h * 0.5}px` }} />
              ))}
            </div>
          </div>

          <h2 className="text-4xl font-bold leading-[1.1] tracking-tight text-white">
            Take control of<br />your salary.
          </h2>
          <p className="mt-4 max-w-sm text-sm leading-relaxed text-white/55">
            Track income, manage expenses, build savings, and achieve your financial goals with SalaryNest.
          </p>

          <div className="mt-7 flex flex-wrap gap-2">
            {[
              { icon: Sparkles, label: "AI Expense Tracking" },
              { icon: Target, label: "Smart Savings Goals" },
              { icon: PieChart, label: "Financial Reports" },
            ].map(({ icon: Icon, label }) => (
              <div key={label} className="flex items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.06] px-3 py-1.5 backdrop-blur-sm">
                <Icon size={13} className="text-teal-400" />
                <span className="text-xs font-medium text-white/80">{label}</span>
              </div>
            ))}
          </div>
        </div>

        <p className="relative text-xs text-white/35">© {new Date().getFullYear()} SalaryNest</p>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="flex min-h-screen items-center justify-center"><Loader2 className="animate-spin text-neutral-400" /></div>}>
      <LoginInner />
    </Suspense>
  );
}

function GoogleIcon() {
  return (
    <svg width="17" height="17" viewBox="0 0 24 24">
      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" />
      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
    </svg>
  );
}
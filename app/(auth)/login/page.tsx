"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Mail,
  Lock,
  Loader2,
  ShieldCheck,
  EyeOff,
  Sparkles,
  AlertCircle,
  ChevronLeft,
} from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async () => {
    setLoading(true);
    setError("");
    const res = await signIn("credentials", { ...form, redirect: false });
    setLoading(false);

    if (res?.error) setError("Invalid email or password");
    else router.push("/dashboard");
  };

  const inputClass =
    "w-full rounded-xl border border-neutral-300 bg-white py-3.5 pl-11 pr-4 text-base text-neutral-900 outline-none transition-all duration-200 placeholder:text-neutral-500 hover:border-neutral-400 focus:border-teal-600 focus:ring-4 focus:ring-teal-500/15 sm:text-sm dark:border-white/15 dark:bg-white/[0.06] dark:text-white dark:placeholder:text-neutral-400 dark:hover:border-white/25 dark:focus:border-teal-400 dark:focus:bg-white/[0.09]";

  const iconClass =
    "pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-neutral-500 transition-colors duration-200 group-focus-within:text-teal-600 dark:text-neutral-400 dark:group-focus-within:text-teal-400";

  return (
    <div className="relative flex min-h-[100dvh] items-center justify-center overflow-hidden bg-neutral-50 px-4 py-8 sm:px-6 sm:py-10 dark:bg-[#07100f]">
      {/* back button */}
      <button
        onClick={() => router.back()}
        aria-label="Go back"
        className="group fixed left-4 top-[calc(env(safe-area-inset-top)+1rem)] z-30 flex h-11 w-11 items-center justify-center rounded-full border border-neutral-300/80 bg-white shadow-[0_6px_24px_-6px_rgba(15,43,43,0.28)] transition-all duration-300 hover:-translate-x-0.5 hover:border-teal-600/40 hover:shadow-[0_10px_30px_-8px_rgba(15,43,43,0.4)] active:scale-95 sm:left-6 sm:top-6 dark:border-white/20 dark:bg-white/[0.08] dark:backdrop-blur-xl dark:hover:border-teal-400/40 dark:hover:bg-white/[0.14]"
      >
        <ChevronLeft
          size={20}
          strokeWidth={2.5}
          className="text-[#0f2b2b] transition-transform duration-300 group-hover:-translate-x-0.5 dark:text-white"
        />
      </button>

      {/* ambient background */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -top-48 left-1/2 h-[30rem] w-[30rem] -translate-x-1/2 rounded-full bg-teal-300/25 blur-[130px] sm:h-[34rem] sm:w-[34rem] sm:blur-[150px] dark:bg-teal-500/12" />
        <div className="absolute -bottom-40 -left-32 h-80 w-80 rounded-full bg-emerald-200/30 blur-[120px] sm:h-96 sm:w-96 dark:bg-emerald-500/8" />
        <div className="absolute -right-32 top-1/4 h-72 w-72 rounded-full bg-cyan-200/25 blur-[120px] sm:h-80 sm:w-80 dark:bg-cyan-500/8" />
        <div
          className="absolute inset-0 opacity-[0.07] dark:opacity-[0.05]"
          style={{
            backgroundImage:
              "linear-gradient(to right, #0f2b2b 1px, transparent 1px), linear-gradient(to bottom, #0f2b2b 1px, transparent 1px)",
            backgroundSize: "56px 56px",
            maskImage:
              "radial-gradient(ellipse 70% 60% at 50% 40%, black 20%, transparent 90%)",
            WebkitMaskImage:
              "radial-gradient(ellipse 70% 60% at 50% 40%, black 20%, transparent 90%)",
          }}
        />
      </div>

      <div className="animate-fade-up w-full max-w-[26rem]">
        {/* brand */}
        <Link
          href="/"
          className="mx-auto mb-7 flex w-fit items-center gap-3 transition-opacity hover:opacity-80 sm:mb-9"
        >
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-[#0f2b2b] to-[#113c3c] shadow-[0_8px_24px_-8px_rgba(15,43,43,0.6)] ring-1 ring-white/10">
            <span className="text-base font-bold text-teal-400">S</span>
          </div>
          <span className="text-lg font-bold tracking-tight text-[#0f2b2b] dark:text-white">
            SalaryNest
          </span>
        </Link>

        {/* card */}
        <div className="relative rounded-3xl border border-neutral-200/90 bg-white/95 p-6 shadow-[0_24px_60px_-20px_rgba(15,43,43,0.28),0_2px_8px_-2px_rgba(15,43,43,0.08)] backdrop-blur-2xl sm:p-9 dark:border-white/[0.12] dark:bg-white/[0.055] dark:shadow-[0_24px_70px_-20px_rgba(0,0,0,0.7)]">
          <div className="pointer-events-none absolute inset-x-8 top-0 h-px bg-gradient-to-r from-transparent via-teal-500/60 to-transparent" />

          {/* heading */}
          <div className="mb-7 sm:mb-8">
            <h1 className="text-[1.75rem] font-extrabold leading-[1.15] tracking-[-0.025em] text-[#0a1f1f] sm:text-[2rem] dark:text-white">
              Welcome{" "}
              <span className="bg-gradient-to-r from-teal-600 via-emerald-500 to-teal-500 bg-clip-text text-transparent dark:from-teal-300 dark:via-emerald-300 dark:to-teal-400">
                back
              </span>
            </h1>
            <p className="mt-2.5 text-[0.9375rem] text-neutral-600 dark:text-neutral-300">
              Sign in to SalaryNest
            </p>
          </div>

          {/* fields */}
          <div className="space-y-3.5">
            <div className="group relative">
              <Mail size={17} strokeWidth={1.9} className={iconClass} />
              <input
                type="email"
                inputMode="email"
                autoComplete="email"
                autoCapitalize="none"
                placeholder="Email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className={inputClass}
              />
            </div>

            <div className="group relative">
              <Lock size={17} strokeWidth={1.9} className={iconClass} />
              <input
                type="password"
                autoComplete="current-password"
                placeholder="Password"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                onKeyDown={(e) => e.key === "Enter" && submit()}
                className={inputClass}
              />
            </div>
          </div>

          {/* error */}
          {error && (
            <div className="mt-4 flex items-start gap-2.5 rounded-xl border border-red-300 bg-red-50 px-3.5 py-3 dark:border-red-500/30 dark:bg-red-500/15">
              <AlertCircle
                size={15}
                className="mt-0.5 shrink-0 text-red-600 dark:text-red-400"
                strokeWidth={2.2}
              />
              <p className="text-sm font-medium leading-snug text-red-700 dark:text-red-300">
                {error}
              </p>
            </div>
          )}

          {/* submit */}
          <button
            onClick={submit}
            disabled={loading}
            className="group relative mt-6 flex w-full items-center justify-center gap-2 overflow-hidden rounded-xl bg-gradient-to-br from-[#0f2b2b] to-[#164040] py-4 text-sm font-semibold text-white shadow-[0_10px_30px_-10px_rgba(15,43,43,0.75)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_16px_38px_-12px_rgba(15,43,43,0.85)] active:translate-y-0 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0 sm:py-3.5"
          >
            <span className="absolute inset-0 bg-gradient-to-r from-teal-500/0 via-teal-400/30 to-teal-500/0 opacity-0 transition-opacity duration-500 group-hover:opacity-100 group-disabled:opacity-0" />
            <span className="relative flex items-center gap-2">
              {loading && <Loader2 size={15} className="animate-spin" />}
              {loading ? "Signing in…" : "Sign in"}
            </span>
          </button>

          {/* divider */}
          <div className="my-5 flex items-center gap-3">
            <div className="h-px flex-1 bg-neutral-200 dark:bg-white/10" />
            <span className="text-xs font-medium text-neutral-500 dark:text-neutral-400">
              or
            </span>
            <div className="h-px flex-1 bg-neutral-200 dark:bg-white/10" />
          </div>

          {/* google */}
          <button
            onClick={() => signIn("google", { callbackUrl: "/dashboard" })}
            className="flex w-full items-center justify-center gap-2.5 rounded-xl border border-neutral-300 bg-white py-4 text-sm font-semibold text-neutral-800 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-neutral-400 hover:shadow-md active:translate-y-0 active:scale-[0.99] sm:py-3.5 dark:border-white/15 dark:bg-white/[0.06] dark:text-white dark:hover:border-white/25 dark:hover:bg-white/[0.1]"
          >
            <svg width="17" height="17" viewBox="0 0 24 24" aria-hidden="true">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.76h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.76c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84A11 11 0 0 0 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.11a6.6 6.6 0 0 1 0-4.22V7.05H2.18a11 11 0 0 0 0 9.9l3.66-2.84z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1a11 11 0 0 0-9.82 6.05l3.66 2.84c.87-2.6 3.3-4.51 6.16-4.51z"
              />
            </svg>
            Continue with Google
          </button>

          {/* sign up link */}
          <p className="mt-6 text-center text-sm text-neutral-600 dark:text-neutral-300">
            No account?{" "}
            <Link
              href="/register"
              className="font-semibold text-teal-700 underline-offset-4 transition-colors hover:text-teal-600 hover:underline dark:text-teal-300 dark:hover:text-teal-200"
            >
              Sign up
            </Link>
          </p>
        </div>

        {/* trust */}
        <div className="mt-7 flex flex-col gap-2.5 sm:mt-8">
          {[
            { icon: ShieldCheck, text: "Encrypted sign-in" },
            { icon: EyeOff, text: "Your financial data stays private" },
            { icon: Sparkles, text: "Free forever plan available" },
          ].map(({ icon: Icon, text }) => (
            <div
              key={text}
              className="flex items-center justify-center gap-2 text-xs font-medium text-neutral-600 dark:text-neutral-400"
            >
              <Icon
                size={13}
                className="shrink-0 text-teal-600 dark:text-teal-400"
                strokeWidth={2.2}
              />
              {text}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
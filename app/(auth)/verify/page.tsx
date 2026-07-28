"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { CheckCircle2, XCircle, Loader2, Mail } from "lucide-react";
import Link from "next/link";

function VerifyInner() {
  const params = useSearchParams();
  const router = useRouter();
  const token = params.get("token");

  const [state, setState] = useState<"loading" | "success" | "error">("loading");
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (!token) {
      setState("error");
      setMessage("No verification token found in the link.");
      return;
    }

    fetch("/api/auth/verify", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token }),
    })
      .then(async (r) => {
        const d = await r.json();
        if (!r.ok) throw new Error(d.error ?? "Verification failed");
        setState("success");
      })
      .catch((e) => {
        setState("error");
        setMessage(e.message);
      });
  }, [token]);

  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="w-full max-w-sm rounded-3xl border border-neutral-200/90 bg-white/85 p-8 text-center shadow-[0_20px_60px_-20px_rgba(15,43,43,0.25)] backdrop-blur-xl dark:border-white/[0.08] dark:bg-white/[0.03]">
        {state === "loading" && (
          <>
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-teal-500/15">
              <Loader2 size={26} className="animate-spin text-teal-600 dark:text-teal-400" />
            </div>
            <h1 className="mt-5 text-lg font-bold text-[#0a1f1f] dark:text-white">Verifying…</h1>
            <p className="mt-1.5 text-sm text-neutral-500">Just a moment.</p>
          </>
        )}

        {state === "success" && (
          <>
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-teal-500/15">
              <CheckCircle2 size={28} className="text-teal-600 dark:text-teal-400" strokeWidth={2.2} />
            </div>
            <h1 className="mt-5 text-lg font-bold text-[#0a1f1f] dark:text-white">Email verified</h1>
            <p className="mt-1.5 text-sm text-neutral-500">
              Your account is confirmed. You're all set.
            </p>
            <button
              onClick={() => router.push("/dashboard")}
              className="mt-6 w-full rounded-2xl bg-gradient-to-br from-[#0f2b2b] to-[#164040] py-3.5 text-sm font-semibold text-white transition-all hover:-translate-y-0.5"
            >
              Go to dashboard
            </button>
          </>
        )}

        {state === "error" && (
          <>
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-red-500/12">
              <XCircle size={28} className="text-red-600 dark:text-red-400" strokeWidth={2.2} />
            </div>
            <h1 className="mt-5 text-lg font-bold text-[#0a1f1f] dark:text-white">
              Verification failed
            </h1>
            <p className="mt-1.5 text-sm text-neutral-500">{message}</p>
            <Link
              href="/dashboard"
              className="mt-6 flex items-center justify-center gap-2 rounded-2xl border border-neutral-200 py-3.5 text-sm font-semibold text-neutral-700 transition hover:bg-neutral-50 dark:border-white/10 dark:text-neutral-300 dark:hover:bg-white/5"
            >
              <Mail size={15} />
              Request a new link
            </Link>
          </>
        )}
      </div>
    </div>
  );
}

export default function VerifyPage() {
  return (
    <Suspense fallback={<div className="flex min-h-screen items-center justify-center"><Loader2 className="animate-spin text-neutral-400" /></div>}>
      <VerifyInner />
    </Suspense>
  );
}
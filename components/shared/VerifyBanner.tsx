"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { Mail, Loader2, Check, X } from "lucide-react";

export default function VerifyBanner() {
  const { data: session } = useSession();
  const [sent, setSent] = useState(false);
  const [busy, setBusy] = useState(false);
  const [dismissed, setDismissed] = useState(false);
  const [error, setError] = useState("");

  // only show for logged-in, unverified users
  if (!session?.user || (session.user as any).emailVerified || dismissed) return null;

  const resend = async () => {
    setBusy(true);
    setError("");
    const res = await fetch("/api/auth/send-verification", { method: "POST" });
    setBusy(false);
    if (res.ok) setSent(true);
    else setError("Couldn't send. Try again shortly.");
  };

  return (
    <div className="relative flex flex-col gap-3 border-b border-amber-300/50 bg-gradient-to-r from-amber-50 to-orange-50/50 px-4 py-3 sm:flex-row sm:items-center sm:justify-between dark:border-amber-500/20 dark:from-amber-500/10 dark:to-orange-500/5">
      <div className="flex items-center gap-2.5 pr-8">
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-amber-500/15 ring-1 ring-amber-500/25">
          <Mail size={15} className="text-amber-600 dark:text-amber-400" />
        </div>
        <p className="text-sm text-amber-800 dark:text-amber-200/90">
          {sent
            ? "Verification link sent — check your inbox."
            : "Please verify your email to secure your account."}
        </p>
      </div>

      {!sent && (
        <button
          onClick={resend}
          disabled={busy}
          className="flex shrink-0 items-center justify-center gap-1.5 rounded-lg bg-amber-600 px-3.5 py-1.5 text-xs font-semibold text-white transition hover:bg-amber-700 disabled:opacity-60"
        >
          {busy ? <Loader2 size={12} className="animate-spin" /> : <Mail size={12} />}
          Send verification link
        </button>
      )}

      {sent && (
        <span className="flex shrink-0 items-center gap-1.5 text-xs font-semibold text-teal-600 dark:text-teal-400">
          <Check size={13} /> Sent
        </span>
      )}

      <button
        onClick={() => setDismissed(true)}
        aria-label="Dismiss"
        className="absolute right-3 top-3 text-amber-500/60 hover:text-amber-700 sm:static"
      >
        <X size={15} />
      </button>

      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  );
}
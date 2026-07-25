"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { Loader2, Check } from "lucide-react";
import UpgradePrompt from "@/components/shared/UpgradePrompt";

interface Props {
  plan: "free" | "premium";
  variant?: "dark" | "light";
}

export default function PricingCTA({ plan, variant = "dark" }: Props) {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [busy, setBusy] = useState(false);
  const [showUpgrade, setShowUpgrade] = useState(false);

  const isAuthed = status === "authenticated";
  const isPremium = session?.user?.isPremium;

  // ── FREE plan ──
  if (plan === "free") {
    return (
      <button
        onClick={() => router.push(isAuthed ? "/dashboard" : "/register")}
        className="block w-full rounded-2xl border border-neutral-300 bg-white py-3.5 text-center text-sm font-semibold text-[#0f2b2b] transition-all duration-300 hover:-translate-y-0.5 hover:border-neutral-400 hover:shadow-md dark:border-white/15 dark:bg-white/[0.06] dark:text-white dark:hover:bg-white/10"
      >
        {isAuthed ? "Go to dashboard" : "Get started"}
      </button>
    );
  }

  // ── PREMIUM plan, already subscribed ──
  if (isPremium) {
    return (
      <div className="flex w-full items-center justify-center gap-2 rounded-2xl bg-white/10 py-3.5 text-sm font-semibold text-teal-400 ring-1 ring-white/15">
        <Check size={15} strokeWidth={2.6} />
        You&apos;re on Premium
      </div>
    );
  }

  const handleUpgrade = () => {
    if (!isAuthed) return router.push("/login?callbackUrl=/settings/billing");
    setShowUpgrade(true);
  };

  const btnClass =
    variant === "dark"
      ? "bg-white text-[#0f2b2b] shadow-[0_8px_24px_-8px_rgba(255,255,255,0.35)] hover:shadow-[0_14px_32px_-10px_rgba(255,255,255,0.45)]"
      : "bg-gradient-to-br from-[#0f2b2b] to-[#164040] text-white shadow-[0_10px_30px_-10px_rgba(15,43,43,0.75)]";

  return (
    <>
      <button
        onClick={handleUpgrade}
        disabled={busy}
        className={`group relative flex w-full items-center justify-center gap-2 rounded-2xl py-3.5 text-sm font-semibold transition-all duration-300 hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-60 ${btnClass}`}
      >
        {busy && <Loader2 size={15} className="animate-spin" />}
        Upgrade to Premium
      </button>

      <UpgradePrompt
        open={showUpgrade}
        onClose={() => setShowUpgrade(false)}
        reason="Unlock unlimited expenses, receipts, and PDF export."
      />
    </>
  );
}
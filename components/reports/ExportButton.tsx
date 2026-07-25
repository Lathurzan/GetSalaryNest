"use client";

import { useState } from "react";
import { Download, Loader2, Lock } from "lucide-react";
import UpgradePrompt from "@/components/shared/UpgradePrompt";
import { usePlan } from "@/lib/hooks/usePlan";

export default function ExportButton({ month }: { month: string }) {
  const { isPremium } = usePlan();
  const [busy, setBusy] = useState(false);
  const [showUpgrade, setShowUpgrade] = useState(false);

  const download = async () => {
    if (!isPremium) return setShowUpgrade(true);

    setBusy(true);
    try {
      const res = await fetch(`/api/pdf/export?month=${month}`);
      if (!res.ok) {
        setBusy(false);
        return setShowUpgrade(true);
      }

      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `salarynest-${month}.pdf`;
      a.click();
      URL.revokeObjectURL(url);
    } finally {
      setBusy(false);
    }
  };

  return (
    <>
      <button
        onClick={download}
        disabled={busy}
        className="group relative flex items-center gap-2 overflow-hidden rounded-2xl bg-gradient-to-br from-[#0f2b2b] to-[#164040] px-4 py-2.5 text-xs font-medium text-white shadow-[0_6px_20px_-8px_rgba(15,43,43,0.65)] ring-1 ring-white/10 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_12px_28px_-10px_rgba(15,43,43,0.8)] active:translate-y-0 active:scale-[0.97] disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:translate-y-0 disabled:hover:shadow-[0_6px_20px_-8px_rgba(15,43,43,0.65)]"
      >
        {/* gradient glow sweep */}
        <span className="absolute inset-0 bg-gradient-to-r from-teal-500/0 via-teal-400/25 to-teal-500/0 opacity-0 transition-opacity duration-500 group-hover:opacity-100 group-disabled:opacity-0" />

        <span className="relative flex items-center gap-2">
          {busy ? (
            <Loader2 size={14} className="animate-spin text-teal-400" />
          ) : isPremium ? (
            <Download
              size={14}
              className="text-teal-400 transition-transform duration-300 group-hover:-translate-y-0.5"
            />
          ) : (
            <Lock size={13} className="text-amber-400" />
          )}

          {busy ? "Generating PDF…" : "Export PDF"}

          {/* premium badge for free users */}
          {!isPremium && !busy && (
            <span className="rounded-full bg-gradient-to-r from-amber-400 to-yellow-500 px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wide text-amber-950">
              Premium
            </span>
          )}
        </span>
      </button>

      <UpgradePrompt
        open={showUpgrade}
        onClose={() => setShowUpgrade(false)}
        reason="PDF export is a Premium feature."
      />
    </>
  );
}
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
        className="flex items-center gap-2 rounded-xl border border-neutral-200 px-3.5 py-2 text-xs font-medium transition hover:bg-neutral-50 disabled:opacity-50 dark:border-white/10 dark:hover:bg-white/5"
      >
        {busy ? (
          <Loader2 size={14} className="animate-spin" />
        ) : isPremium ? (
          <Download size={14} />
        ) : (
          <Lock size={13} />
        )}
        {busy ? "Generating…" : "Export PDF"}
      </button>

      <UpgradePrompt
        open={showUpgrade}
        onClose={() => setShowUpgrade(false)}
        reason="PDF export is a Premium feature."
      />
    </>
  );
}
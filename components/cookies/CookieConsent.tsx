"use client";

import { useState } from "react";
import { Cookie, X, Shield } from "lucide-react";
import { useCookieConsent, type ConsentState } from "@/lib/hooks/useCookieConsent";

export default function CookieConsent() {
  const { consent, decided, save, acceptAll, rejectNonEssential } = useCookieConsent();
  const [customise, setCustomise] = useState(false);
  const [draft, setDraft] = useState<ConsentState | null>(null);

  if (decided) return null; // choice already made
  if (!consent) return null;

  const openCustomise = () => {
    setDraft(consent);
    setCustomise(true);
  };

  const toggle = (key: "analytics" | "marketing" | "preferences") =>
    setDraft((d) => (d ? { ...d, [key]: !d[key] } : d));

  return (
    <>
      {/* banner */}
      {!customise && (
        <div className="fixed inset-x-0 bottom-0 z-[9998] p-4 sm:p-6">
          <div className="animate-fade-up mx-auto max-w-3xl rounded-3xl border border-neutral-200/90 bg-white/95 p-5 shadow-[0_20px_60px_-16px_rgba(15,43,43,0.35)] backdrop-blur-2xl sm:p-6 dark:border-white/[0.1] dark:bg-[#0d1817]/95">
            <div className="flex items-start gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-teal-500/15 ring-1 ring-teal-500/25">
                <Cookie size={19} className="text-teal-600 dark:text-teal-400" />
              </div>
              <div className="flex-1">
                <h3 className="text-sm font-bold text-[#0a1f1f] dark:text-white">
                  We value your privacy
                </h3>
                <p className="mt-1 text-xs leading-relaxed text-neutral-500 dark:text-neutral-400">
                  SalaryNest uses cookies to provide essential functionality, improve your
                  experience, remember your preferences, and analyse website performance.
                </p>
              </div>
            </div>

            <div className="mt-4 flex flex-col gap-2 sm:flex-row sm:justify-end">
              <button
                onClick={openCustomise}
                className="rounded-xl border border-neutral-200 px-4 py-2.5 text-xs font-semibold text-neutral-700 transition hover:bg-neutral-50 dark:border-white/10 dark:text-neutral-300 dark:hover:bg-white/5"
              >
                Customise
              </button>
              <button
                onClick={rejectNonEssential}
                className="rounded-xl border border-neutral-200 px-4 py-2.5 text-xs font-semibold text-neutral-700 transition hover:bg-neutral-50 dark:border-white/10 dark:text-neutral-300 dark:hover:bg-white/5"
              >
                Reject non-essential
              </button>
              <button
                onClick={acceptAll}
                className="rounded-xl bg-gradient-to-br from-[#0f2b2b] to-[#164040] px-5 py-2.5 text-xs font-semibold text-white transition hover:-translate-y-0.5"
              >
                Accept all
              </button>
            </div>
          </div>
        </div>
      )}

      {/* settings modal */}
      {customise && draft && (
        <div className="fixed inset-0 z-[9999] flex items-end justify-center sm:items-center sm:p-4">
          <div
            onClick={() => setCustomise(false)}
            className="animate-overlay-in absolute inset-0 bg-gradient-to-b from-[#0a1f1f]/50 via-[#0a1f1f]/60 to-[#0a1f1f]/70 backdrop-blur-md"
          />

          <div className="animate-modal-in relative w-full max-w-md overflow-hidden rounded-t-[1.75rem] border border-white/60 bg-white/95 shadow-[0_-8px_60px_-12px_rgba(0,0,0,0.4)] backdrop-blur-2xl sm:rounded-[1.75rem] dark:border-white/[0.12] dark:bg-[#0d1817]/95">
            <div className="flex justify-center pt-3 sm:hidden">
              <div className="h-1 w-10 rounded-full bg-neutral-300 dark:bg-white/20" />
            </div>

            <div className="p-6 pb-[calc(env(safe-area-inset-bottom)+1.5rem)] sm:p-7 sm:pb-7">
              <div className="mb-5 flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-teal-500/15 ring-1 ring-teal-500/25">
                    <Shield size={19} className="text-teal-600 dark:text-teal-400" />
                  </div>
                  <h3 className="text-lg font-bold text-[#0a1f1f] dark:text-white">
                    Cookie preferences
                  </h3>
                </div>
                <button
                  onClick={() => setCustomise(false)}
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-neutral-200 text-neutral-500 hover:rotate-90 dark:border-white/10 dark:text-neutral-400"
                >
                  <X size={16} strokeWidth={2.4} />
                </button>
              </div>

              <div className="space-y-3">
                <Row
                  title="Essential"
                  desc="Required for sign-in and core functionality. Always on."
                  checked
                  disabled
                />
                <Row
                  title="Analytics"
                  desc="Help us understand how the app is used."
                  checked={draft.analytics}
                  onChange={() => toggle("analytics")}
                />
                <Row
                  title="Marketing"
                  desc="Used to measure the effectiveness of our messaging."
                  checked={draft.marketing}
                  onChange={() => toggle("marketing")}
                />
                <Row
                  title="Preferences"
                  desc="Remember your settings and choices."
                  checked={draft.preferences}
                  onChange={() => toggle("preferences")}
                />
              </div>

              <div className="mt-6 flex flex-col gap-2">
                <button
                  onClick={() => { save(draft); setCustomise(false); }}
                  className="w-full rounded-2xl bg-gradient-to-br from-[#0f2b2b] to-[#164040] py-3.5 text-sm font-semibold text-white transition hover:-translate-y-0.5"
                >
                  Save preferences
                </button>
                <div className="flex gap-2">
                  <button
                    onClick={() => { rejectNonEssential(); setCustomise(false); }}
                    className="flex-1 rounded-2xl border border-neutral-200 py-3 text-xs font-semibold text-neutral-700 dark:border-white/10 dark:text-neutral-300"
                  >
                    Reject non-essential
                  </button>
                  <button
                    onClick={() => { acceptAll(); setCustomise(false); }}
                    className="flex-1 rounded-2xl border border-neutral-200 py-3 text-xs font-semibold text-neutral-700 dark:border-white/10 dark:text-neutral-300"
                  >
                    Accept all
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

function Row({
  title, desc, checked, disabled, onChange,
}: {
  title: string;
  desc: string;
  checked: boolean;
  disabled?: boolean;
  onChange?: () => void;
}) {
  return (
    <div className="flex items-start justify-between gap-3 rounded-2xl border border-neutral-200/80 p-3.5 dark:border-white/[0.08]">
      <div className="flex-1">
        <p className="text-sm font-semibold text-[#0a1f1f] dark:text-white">{title}</p>
        <p className="mt-0.5 text-xs text-neutral-500 dark:text-neutral-400">{desc}</p>
      </div>
      <button
        onClick={onChange}
        disabled={disabled}
        role="switch"
        aria-checked={checked}
        aria-label={title}
        className={`relative mt-0.5 h-6 w-11 shrink-0 rounded-full transition-colors ${
          checked ? "bg-teal-500" : "bg-neutral-300 dark:bg-white/15"
        } ${disabled ? "cursor-not-allowed opacity-60" : ""}`}
      >
        <span
          className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform ${
            checked ? "translate-x-[22px]" : "translate-x-0.5"
          }`}
        />
      </button>
    </div>
  );
}
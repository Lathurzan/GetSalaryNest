"use client";

import { useState } from "react";
import { X, Loader2, Check, Bug } from "lucide-react";

const AREAS = [
  { key: "expenses", label: "Expenses" },
  { key: "income", label: "Income" },
  { key: "reports", label: "Reports" },
  { key: "billing", label: "Billing" },
  { key: "import", label: "Import" },
  { key: "other", label: "Other" },
] as const;

export default function BugForm({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [area, setArea] = useState<string>("other");
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const [done, setDone] = useState(false);

  if (!open) return null;

  const reset = () => {
    setTitle(""); setDescription(""); setArea("other");
    setError(""); setDone(false);
  };

  const submit = async () => {
    if (title.trim().length < 3) return setError("Give it a short title");
    if (description.trim().length < 10) return setError("Please describe what happened");

    setSaving(true);
    setError("");

    const res = await fetch("/api/bugs", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title,
        description,
        area,
        pageUrl: window.location.href,
        userAgent: navigator.userAgent,
      }),
    });
    setSaving(false);

    if (!res.ok) {
      const d = await res.json();
      return setError(d.error ?? "Something went wrong");
    }
    setDone(true);
  };

  const fieldClass =
    "w-full rounded-2xl border border-neutral-300 bg-white px-4 py-3 text-base outline-none transition-all placeholder:text-neutral-400 focus:border-teal-600 focus:ring-4 focus:ring-teal-500/15 sm:text-sm dark:border-white/15 dark:bg-white/[0.06] dark:text-white";

  return (
    <div className="fixed inset-0 z-[9999] flex items-end justify-center sm:items-center sm:p-4">
      <div
        onClick={onClose}
        className="animate-overlay-in absolute inset-0 bg-gradient-to-b from-[#0a1f1f]/50 via-[#0a1f1f]/60 to-[#0a1f1f]/70 backdrop-blur-md"
      />

      <div className="animate-modal-in relative w-full max-w-md overflow-hidden rounded-t-[1.75rem] border border-white/60 bg-white/95 shadow-[0_-8px_60px_-12px_rgba(0,0,0,0.4)] backdrop-blur-2xl sm:rounded-[1.75rem] dark:border-white/[0.12] dark:bg-[#0d1817]/95">
        <div className="pointer-events-none absolute inset-x-10 top-0 h-px bg-gradient-to-r from-transparent via-red-500/60 to-transparent" />

        <div className="flex justify-center pt-3 sm:hidden">
          <div className="h-1 w-10 rounded-full bg-neutral-300 dark:bg-white/20" />
        </div>

        <div className="p-6 pb-[calc(env(safe-area-inset-bottom)+1.5rem)] sm:p-7 sm:pb-7">
          {done ? (
            <div className="flex flex-col items-center gap-3 py-6 text-center">
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-teal-500/15 ring-1 ring-teal-500/25">
                <Check size={26} className="text-teal-600 dark:text-teal-400" strokeWidth={2.4} />
              </div>
              <div>
                <p className="text-base font-bold text-[#0a1f1f] dark:text-white">Report sent</p>
                <p className="mt-1 text-sm text-neutral-500 dark:text-neutral-400">
                  Thanks — our team will take a look.
                </p>
              </div>
              <div className="mt-2 flex gap-2">
                <button onClick={reset} className="rounded-xl border border-neutral-200 px-4 py-2.5 text-sm font-medium dark:border-white/10 dark:text-white">
                  Report another
                </button>
                <button onClick={onClose} className="rounded-xl bg-[#0f2b2b] px-6 py-2.5 text-sm font-semibold text-white">
                  Done
                </button>
              </div>
            </div>
          ) : (
            <>
              <div className="mb-5 flex items-start justify-between">
                <div className="flex items-start gap-3">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-red-500/20 to-orange-500/10 ring-1 ring-red-500/25">
                    <Bug size={19} className="text-red-600 dark:text-red-400" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold tracking-tight text-[#0a1f1f] dark:text-white">
                      Report a bug
                    </h3>
                    <p className="mt-0.5 text-xs text-neutral-500 dark:text-neutral-400">
                      Tell us what went wrong.
                    </p>
                  </div>
                </div>
                <button
                  onClick={onClose}
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-neutral-200 bg-white text-neutral-500 transition hover:rotate-90 dark:border-white/10 dark:bg-white/[0.06] dark:text-neutral-400"
                >
                  <X size={16} strokeWidth={2.4} />
                </button>
              </div>

              {/* area chips */}
              <div className="mb-3 flex flex-wrap gap-1.5">
                {AREAS.map((a) => (
                  <button
                    key={a.key}
                    onClick={() => setArea(a.key)}
                    className={`rounded-full px-3 py-1.5 text-xs font-medium transition ${
                      area === a.key
                        ? "bg-[#0f2b2b] text-white"
                        : "bg-neutral-100 text-neutral-500 dark:bg-white/5 dark:text-neutral-400"
                    }`}
                  >
                    {a.label}
                  </button>
                ))}
              </div>

              <input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Short title (e.g. Chart not loading)"
                maxLength={120}
                className={`mb-3 ${fieldClass}`}
              />

              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="What happened? What did you expect? Steps to reproduce help a lot."
                rows={4}
                maxLength={2000}
                className={`resize-none ${fieldClass}`}
              />

              {error && <p className="mt-3 text-sm text-red-500">{error}</p>}

              <button
                onClick={submit}
                disabled={saving}
                className="mt-4 flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-br from-[#0f2b2b] to-[#164040] py-4 text-sm font-semibold text-white shadow-[0_10px_30px_-10px_rgba(15,43,43,0.75)] transition-all hover:-translate-y-0.5 disabled:opacity-60"
              >
                {saving && <Loader2 size={15} className="animate-spin" />}
                {saving ? "Sending…" : "Send report"}
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
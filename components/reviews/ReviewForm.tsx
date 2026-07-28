"use client";

import { useState, useEffect } from "react";
import { X, Loader2, Check, Star } from "lucide-react";
import StarInput from "./StarInput";

interface Props {
  open: boolean;
  onClose: () => void;
}

export default function ReviewForm({ open, onClose }: Props) {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [status, setStatus] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (!open) return;
    setDone(false);
    setError("");
    fetch("/api/reviews/mine")
      .then((r) => r.json())
      .then((d) => {
        if (d.review) {
          setRating(d.review.rating);
          setComment(d.review.comment ?? "");
          setStatus(d.review.status);
        } else {
          setRating(0);
          setComment("");
          setStatus(null);
        }
      });
  }, [open]);

  if (!open) return null;

  const submit = async () => {
    if (rating < 1) return setError("Please pick a star rating");
    setSaving(true);
    setError("");

    const res = await fetch("/api/reviews", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ rating, comment: comment || undefined }),
    });
    setSaving(false);

    if (!res.ok) {
      const d = await res.json();
      return setError(d.error ?? "Something went wrong");
    }
    setDone(true);
  };

  return (
    <div className="fixed inset-0 z-[9999] flex items-end justify-center sm:items-center sm:p-4">
      <div
        onClick={onClose}
        className="animate-overlay-in absolute inset-0 bg-gradient-to-b from-[#0a1f1f]/50 via-[#0a1f1f]/60 to-[#0a1f1f]/70 backdrop-blur-md"
      />

      <div className="animate-modal-in relative w-full max-w-md overflow-hidden rounded-t-[1.75rem] border border-white/60 bg-white/95 shadow-[0_-8px_60px_-12px_rgba(0,0,0,0.4)] backdrop-blur-2xl sm:rounded-[1.75rem] dark:border-white/[0.12] dark:bg-[#0d1817]/95">
        <div className="pointer-events-none absolute inset-x-10 top-0 h-px bg-gradient-to-r from-transparent via-amber-400/70 to-transparent" />

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
                <p className="text-base font-bold text-[#0a1f1f] dark:text-white">Thank you!</p>
                <p className="mt-1 text-sm text-neutral-500 dark:text-neutral-400">
                  Your review will appear once approved.
                </p>
              </div>
              <button
                onClick={onClose}
                className="mt-2 rounded-xl bg-[#0f2b2b] px-6 py-2.5 text-sm font-semibold text-white"
              >
                Done
              </button>
            </div>
          ) : (
            <>
              <div className="mb-5 flex items-start justify-between">
                <div className="flex items-start gap-3">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-400/20 to-orange-500/10 ring-1 ring-amber-400/25">
                    <Star size={19} className="text-amber-500" fill="currentColor" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold tracking-tight text-[#0a1f1f] dark:text-white">
                      Leave a review
                    </h3>
                    <p className="mt-0.5 text-xs text-neutral-500 dark:text-neutral-400">
                      Share how SalaryNest works for you.
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

              {status === "pending" && (
                <div className="mb-4 rounded-xl bg-amber-50 px-3 py-2 text-xs text-amber-700 dark:bg-amber-500/10 dark:text-amber-400">
                  Your current review is awaiting approval. Editing resubmits it.
                </div>
              )}

              <div className="mb-5 flex justify-center">
                <StarInput value={rating} onChange={setRating} />
              </div>

              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="What do you like? What could be better? (optional)"
                rows={4}
                maxLength={500}
                className="w-full resize-none rounded-2xl border border-neutral-300 bg-white px-4 py-3 text-base outline-none transition-all placeholder:text-neutral-400 focus:border-teal-600 focus:ring-4 focus:ring-teal-500/15 sm:text-sm dark:border-white/15 dark:bg-white/[0.06] dark:text-white"
              />
              <p className="mt-1 text-right text-[11px] text-neutral-400">{comment.length}/500</p>

              {error && <p className="mb-3 text-sm text-red-500">{error}</p>}

              <button
                onClick={submit}
                disabled={saving}
                className="mt-2 flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-br from-[#0f2b2b] to-[#164040] py-4 text-sm font-semibold text-white shadow-[0_10px_30px_-10px_rgba(15,43,43,0.75)] transition-all hover:-translate-y-0.5 disabled:opacity-60"
              >
                {saving && <Loader2 size={15} className="animate-spin" />}
                {saving ? "Submitting…" : "Submit review"}
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
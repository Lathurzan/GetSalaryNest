"use client";

import Link from "next/link";
import { useState } from "react";
import { signOut, useSession } from "next-auth/react";
import {
  PiggyBank,
  FolderTree,
  PieChart,
  FileUp,
  Sparkles,
  ChevronRight,
  LogOut,
  Loader2,
  Trash2,
  AlertTriangle,
  Star,
  Bug,
  Settings as SettingsIcon,
} from "lucide-react";
import ReviewForm from "@/components/reviews/ReviewForm";
import BugForm from "@/components/bugs/BugForm";

const NAV_CARDS = [
  {
    href: "/settings/savings",
    icon: PiggyBank,
    title: "Savings goal",
    desc: "Set how much of your income to save each month.",
    color: "#14b8a6",
  },
  {
    href: "/settings/categories",
    icon: FolderTree,
    title: "Categories & budgets",
    desc: "Manage spending categories and monthly limits.",
    color: "#f97316",
  },
  {
    href: "/reports",
    icon: PieChart,
    title: "Reports",
    desc: "Analyse your spending and savings trends.",
    color: "#3b82f6",
  },
  {
    href: "/import",
    icon: FileUp,
    title: "Import statement",
    desc: "Upload a bank statement PDF to add expenses.",
    color: "#a855f7",
  },
] as const;

export default function SettingsPage() {
  const { data: session } = useSession();
  const [busy, setBusy] = useState(false);

  const [deleteModal, setDeleteModal] = useState(false);
  const [confirmText, setConfirmText] = useState("");
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState("");

  const [reviewOpen, setReviewOpen] = useState(false);
  const [bugOpen, setBugOpen] = useState(false);

  const username = session?.user?.name?.trim().split(" ")[0] ?? "";
  const confirmPhrase = `${username}/ShiftFlow`;

  const openPortal = async () => {
    setBusy(true);
    const res = await fetch("/api/billing/portal", { method: "POST" });
    const data = await res.json();
    setBusy(false);
    if (data.url) window.location.href = data.url;
    else alert(data.error ?? "No active subscription");
  };

  const deleteAccount = async () => {
    if (confirmText !== confirmPhrase) return;
    setDeleting(true);
    setDeleteError("");

    const res = await fetch("/api/account/delete", { method: "DELETE" });
    const data = await res.json();

    if (!res.ok) {
      setDeleteError(data.error || "Failed to delete account");
      setDeleting(false);
      return;
    }

    signOut({ callbackUrl: "/" });
  };

  const isPremium = session?.user?.isPremium;

  return (
    <div className="relative min-h-full">
      {/* ambient background */}
      <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute -top-40 right-0 h-96 w-96 rounded-full bg-teal-300/20 blur-[130px] dark:bg-teal-500/10" />
        <div className="absolute -left-32 top-1/2 h-80 w-80 rounded-full bg-emerald-200/20 blur-[120px] dark:bg-emerald-500/6" />
        <div
          className="absolute inset-0 opacity-[0.05] dark:opacity-[0.04]"
          style={{
            backgroundImage:
              "linear-gradient(to right, #0f2b2b 1px, transparent 1px), linear-gradient(to bottom, #0f2b2b 1px, transparent 1px)",
            backgroundSize: "56px 56px",
            maskImage:
              "radial-gradient(ellipse 60% 50% at 50% 0%, black 30%, transparent 90%)",
            WebkitMaskImage:
              "radial-gradient(ellipse 60% 50% at 50% 0%, black 30%, transparent 90%)",
          }}
        />
      </div>

      <div className="mx-auto max-w-2xl space-y-6 p-4 pb-24 sm:p-6 lg:p-8">
        {/* header */}
        <header className="animate-fade-up flex items-start gap-3">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-teal-500/20 to-emerald-500/10 ring-1 ring-teal-500/25">
            <SettingsIcon size={20} strokeWidth={2} className="text-teal-600 dark:text-teal-400" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-[#0a1f1f] sm:text-[1.75rem] dark:text-white">
              Settings
            </h1>
            <p className="mt-0.5 text-sm text-neutral-500 dark:text-neutral-400">
              Manage your goals, categories, and account.
            </p>
          </div>
        </header>

        {/* account card */}
        <div className="animate-fade-up delay-100 rounded-3xl border border-neutral-200/90 bg-white/85 p-5 shadow-[0_12px_40px_-16px_rgba(15,43,43,0.18)] backdrop-blur-xl dark:border-white/[0.08] dark:bg-white/[0.03]">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#0f2b2b] to-[#164040] text-sm font-bold text-teal-400 ring-1 ring-white/10">
              {session?.user?.name?.[0]?.toUpperCase() ?? "?"}
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold text-[#0a1f1f] dark:text-white">
                {session?.user?.name}
              </p>
              <p className="truncate text-xs text-neutral-500 dark:text-neutral-400">
                {session?.user?.email}
              </p>
            </div>
            <span
              className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
                isPremium
                  ? "bg-teal-500/15 text-teal-700 ring-1 ring-teal-500/25 dark:text-teal-400"
                  : "bg-neutral-200/70 text-neutral-500 dark:bg-white/10 dark:text-neutral-400"
              }`}
            >
              {isPremium ? "Premium" : "Free"}
            </span>
          </div>

          <div className="mt-4 border-t border-neutral-100 pt-4 dark:border-white/5">
            {isPremium ? (
              <button
                onClick={openPortal}
                disabled={busy}
                className="flex w-full items-center justify-center gap-2 rounded-xl border border-neutral-200 py-2.5 text-xs font-semibold text-neutral-700 transition-colors hover:bg-neutral-50 dark:border-white/10 dark:text-neutral-300 dark:hover:bg-white/5"
              >
                {busy && <Loader2 size={13} className="animate-spin" />}
                Manage billing
              </button>
            ) : (
              <Link
                href="/settings/billing"
                className="group relative flex w-full items-center justify-center gap-2 overflow-hidden rounded-xl bg-gradient-to-br from-[#0f2b2b] to-[#164040] py-2.5 text-xs font-semibold text-white shadow-[0_8px_20px_-8px_rgba(15,43,43,0.6)] transition-all duration-300 hover:-translate-y-0.5"
              >
                <span className="absolute inset-0 bg-gradient-to-r from-teal-500/0 via-teal-400/30 to-teal-500/0 opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
                <span className="relative flex items-center gap-1.5">
                  <Sparkles size={13} className="text-teal-400" />
                  Upgrade to Premium
                </span>
              </Link>
            )}
          </div>
        </div>

        {/* navigation grid */}
        <div className="animate-fade-up delay-200 grid gap-3 sm:grid-cols-2">
          {NAV_CARDS.map(({ href, icon: Icon, title, desc, color }) => (
            <Link
              key={href}
              href={href}
              className="group flex items-start gap-3 rounded-2xl border border-neutral-200/90 bg-white/85 p-4 shadow-[0_2px_12px_-6px_rgba(15,43,43,0.15)] backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:border-neutral-300 hover:shadow-[0_14px_32px_-14px_rgba(15,43,43,0.28)] dark:border-white/[0.08] dark:bg-white/[0.03] dark:hover:border-white/15"
            >
              <div
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl transition-transform duration-300 group-hover:scale-110"
                style={{ backgroundColor: `${color}1a` }}
              >
                <Icon size={18} style={{ color }} strokeWidth={2} />
              </div>

              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold text-[#0a1f1f] dark:text-white">
                  {title}
                </p>
                <p className="mt-0.5 text-xs leading-relaxed text-neutral-500 dark:text-neutral-400">
                  {desc}
                </p>
              </div>

              <ChevronRight
                size={16}
                className="mt-0.5 shrink-0 text-neutral-300 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:text-neutral-500 dark:text-neutral-600"
              />
            </Link>
          ))}
        </div>

        {/* subscription card */}
        <Link
          href="/settings/billing"
          className="animate-fade-up delay-300 group flex items-center gap-3 rounded-2xl border border-teal-500/20 bg-gradient-to-br from-teal-500/[0.08] to-emerald-500/[0.03] p-4 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_12px_28px_-12px_rgba(15,43,43,0.25)]"
        >
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-teal-500/20 to-emerald-500/10 ring-1 ring-teal-500/25">
            <Sparkles size={17} className="text-teal-600 dark:text-teal-400" />
          </div>
          <div className="flex-1">
            <p className="text-sm font-semibold text-[#0a1f1f] dark:text-white">
              Subscription & pricing
            </p>
            <p className="mt-0.5 text-xs text-neutral-500 dark:text-neutral-400">
              Compare plans and manage your subscription.
            </p>
          </div>
          <ChevronRight
            size={16}
            className="shrink-0 text-teal-600/60 transition-transform duration-300 group-hover:translate-x-0.5 dark:text-teal-400/60"
          />
        </Link>

        {/* feedback */}
        <div className="animate-fade-up delay-300 grid gap-3 sm:grid-cols-2">
          <button
            onClick={() => setReviewOpen(true)}
            className="group flex items-center gap-3 rounded-2xl border border-neutral-200/90 bg-white/85 p-4 text-left shadow-sm backdrop-blur-sm transition-all hover:-translate-y-0.5 hover:shadow-md dark:border-white/[0.08] dark:bg-white/[0.03]"
          >
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber-400/15 ring-1 ring-amber-400/25">
              <Star size={18} className="text-amber-500" fill="currentColor" />
            </div>
            <div>
              <p className="text-sm font-semibold text-[#0a1f1f] dark:text-white">Leave a review</p>
              <p className="mt-0.5 text-xs text-neutral-500 dark:text-neutral-400">Rate your experience</p>
            </div>
          </button>

          <button
            onClick={() => setBugOpen(true)}
            className="group flex items-center gap-3 rounded-2xl border border-neutral-200/90 bg-white/85 p-4 text-left shadow-sm backdrop-blur-sm transition-all hover:-translate-y-0.5 hover:shadow-md dark:border-white/[0.08] dark:bg-white/[0.03]"
          >
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-red-500/12 ring-1 ring-red-500/20">
              <Bug size={18} className="text-red-600 dark:text-red-400" />
            </div>
            <div>
              <p className="text-sm font-semibold text-[#0a1f1f] dark:text-white">Report a bug</p>
              <p className="mt-0.5 text-xs text-neutral-500 dark:text-neutral-400">Something not working?</p>
            </div>
          </button>
        </div>

        {/* sign out */}
        <button
          onClick={() => signOut({ callbackUrl: "/" })}
          className="animate-fade-up delay-[400ms] flex w-full items-center justify-center gap-2 rounded-2xl border border-neutral-200 py-3.5 text-sm font-semibold text-red-500 transition-colors hover:bg-red-50 dark:border-white/10 dark:hover:bg-red-500/10"
        >
          <LogOut size={15} />
          Sign out
        </button>

        {/* delete account */}
        <button
          onClick={() => setDeleteModal(true)}
          className="animate-fade-up delay-[400ms] flex w-full items-center justify-center gap-2 rounded-2xl border border-red-200 py-3.5 text-sm font-semibold text-red-600 transition-colors hover:bg-red-50 dark:border-red-500/20 dark:text-red-400 dark:hover:bg-red-500/10"
        >
          <Trash2 size={15} />
          Delete account
        </button>
      </div>

      {/* feedback modals */}
      <ReviewForm open={reviewOpen} onClose={() => setReviewOpen(false)} />
      <BugForm open={bugOpen} onClose={() => setBugOpen(false)} />

      {/* delete confirmation modal */}
      {deleteModal && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
          <div
            onClick={() => !deleting && setDeleteModal(false)}
            className="animate-overlay-in absolute inset-0 bg-gradient-to-b from-[#0a1f1f]/50 via-[#0a1f1f]/60 to-[#0a1f1f]/70 backdrop-blur-md"
          />

          <div className="animate-modal-in relative w-full max-w-sm overflow-hidden rounded-3xl border border-white/60 bg-white/95 shadow-[0_30px_80px_-20px_rgba(0,0,0,0.5)] backdrop-blur-2xl dark:border-white/[0.12] dark:bg-[#0d1817]/95">
            <div className="pointer-events-none absolute inset-x-10 top-0 h-px bg-gradient-to-r from-transparent via-red-500/60 to-transparent" />

            <div className="p-6 sm:p-7">
              {/* header */}
              <div className="flex items-start gap-3">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-red-500/20 to-orange-500/10 ring-1 ring-red-500/25">
                  <AlertTriangle size={19} strokeWidth={2} className="text-red-600 dark:text-red-400" />
                </div>
                <div>
                  <h3 className="text-lg font-bold tracking-tight text-[#0a1f1f] dark:text-white">
                    Delete your account?
                  </h3>
                  <p className="mt-1 text-xs leading-relaxed text-neutral-500 dark:text-neutral-400">
                    This action is permanent. All your expenses, income records, savings goals,
                    receipts, and account data will be permanently deleted.
                  </p>
                </div>
              </div>

              {/* user details */}
              <div className="mt-5 rounded-2xl bg-neutral-50 p-3.5 dark:bg-white/[0.03]">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-neutral-400">User</span>
                  <span className="font-medium text-[#0a1f1f] dark:text-white">
                    {session?.user?.name}
                  </span>
                </div>
                <div className="mt-2 flex items-center justify-between text-xs">
                  <span className="text-neutral-400">Email</span>
                  <span className="truncate pl-3 font-medium text-[#0a1f1f] dark:text-white">
                    {session?.user?.email}
                  </span>
                </div>
              </div>

              {/* confirm phrase */}
              <div className="mt-5">
                <p className="text-xs text-neutral-500 dark:text-neutral-400">
                  To confirm, type the following phrase:
                </p>
                <div className="mt-1.5 select-all rounded-lg bg-red-50 px-3 py-2 text-center font-mono text-xs font-semibold text-red-700 dark:bg-red-500/10 dark:text-red-300">
                  {confirmPhrase}
                </div>

                <input
                  value={confirmText}
                  onChange={(e) => setConfirmText(e.target.value)}
                  placeholder="Type confirmation phrase"
                  autoComplete="off"
                  className="mt-3 w-full rounded-xl border border-neutral-300 bg-white px-3.5 py-3 text-base outline-none transition-all duration-200 placeholder:text-neutral-400 focus:border-red-500 focus:ring-4 focus:ring-red-500/12 sm:text-sm dark:border-white/15 dark:bg-white/[0.06] dark:text-white"
                />
              </div>

              {deleteError && (
                <p className="mt-3 text-sm font-medium text-red-600 dark:text-red-400">
                  {deleteError}
                </p>
              )}

              {/* actions */}
              <div className="mt-6 flex gap-2.5">
                <button
                  onClick={() => setDeleteModal(false)}
                  disabled={deleting}
                  className="flex-1 rounded-xl border border-neutral-200 py-3 text-sm font-semibold text-neutral-700 transition-colors hover:bg-neutral-50 disabled:opacity-50 dark:border-white/10 dark:text-neutral-300 dark:hover:bg-white/5"
                >
                  Cancel
                </button>
                <button
                  onClick={deleteAccount}
                  disabled={deleting || confirmText !== confirmPhrase}
                  className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-red-600 py-3 text-sm font-semibold text-white transition-all duration-200 hover:bg-red-700 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-40"
                >
                  {deleting && <Loader2 size={14} className="animate-spin" />}
                  {deleting ? "Deleting…" : "Delete permanently"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

interface Section {
  id: string;
  title: string;
}

export default function LegalLayout({
  title, updated, sections, children,
}: {
  title: string;
  updated: string;
  sections: Section[];
  children: React.ReactNode;
}) {
  const [progress, setProgress] = useState(0);
  const [activeId, setActiveId] = useState(sections[0]?.id);

  useEffect(() => {
    const onScroll = () => {
      const el = document.documentElement;
      const scrolled = el.scrollTop;
      const height = el.scrollHeight - el.clientHeight;
      setProgress(height > 0 ? (scrolled / height) * 100 : 0);

      let current = sections[0]?.id;
      for (const s of sections) {
        const node = document.getElementById(s.id);
        if (node && node.getBoundingClientRect().top <= 120) current = s.id;
      }
      setActiveId(current);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, [sections]);

  return (
    <>
      {/* reading progress */}
      <div className="fixed inset-x-0 top-0 z-50 h-0.5 bg-transparent">
        <div
          className="h-full bg-gradient-to-r from-teal-500 to-emerald-400 transition-[width] duration-150"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* ambient background */}
      <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute -top-40 left-1/2 h-96 w-96 -translate-x-1/2 rounded-full bg-teal-300/15 blur-[130px] dark:bg-teal-500/8" />
      </div>

      <div className="mx-auto max-w-5xl px-6 py-12 sm:py-16">
        <Link
          href="/"
          className="mb-8 inline-flex items-center gap-1.5 text-sm text-neutral-500 transition hover:text-neutral-900 dark:hover:text-white"
        >
          <ArrowLeft size={15} />
          Back to home
        </Link>

        <div className="grid gap-10 lg:grid-cols-[220px_1fr]">
          {/* sticky sidebar */}
          <aside className="hidden lg:block">
            <div className="sticky top-16">
              <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-neutral-400">
                On this page
              </p>
              <nav className="space-y-1">
                {sections.map((s) => (
                  <a
                    key={s.id}
                    href={`#${s.id}`}
                    className={`block rounded-lg px-3 py-1.5 text-sm transition ${
                      activeId === s.id
                        ? "bg-teal-500/10 font-medium text-teal-700 dark:text-teal-400"
                        : "text-neutral-500 hover:text-neutral-900 dark:hover:text-white"
                    }`}
                  >
                    {s.title}
                  </a>
                ))}
              </nav>
            </div>
          </aside>

          {/* content */}
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-[#0a1f1f] sm:text-4xl dark:text-white">
              {title}
            </h1>
            <p className="mt-2 text-sm text-neutral-400">Last updated: {updated}</p>

            <div className="mt-8 space-y-10">{children}</div>

            <div className="mt-16 border-t border-neutral-100 pt-6 text-sm text-neutral-400 dark:border-white/5">
              Questions? Email{" "}
              <a href="mailto:support@getsalarynest.com" className="text-teal-600 hover:underline dark:text-teal-400">
                support@getsalarynest.com
              </a>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export function LegalSection({
  id, title, children,
}: {
  id: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section id={id} className="scroll-mt-20">
      <h2 className="text-xl font-bold tracking-tight text-[#0a1f1f] dark:text-white">
        {title}
      </h2>
      <div className="mt-3 space-y-3 text-sm leading-relaxed text-neutral-600 dark:text-neutral-300">
        {children}
      </div>
    </section>
  );
}
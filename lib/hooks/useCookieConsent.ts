"use client";

import { useState, useEffect, useCallback } from "react";

export type ConsentState = {
  essential: true; // always on
  analytics: boolean;
  marketing: boolean;
  preferences: boolean;
};

const KEY = "salarynest_cookie_consent";

const DEFAULT: ConsentState = {
  essential: true,
  analytics: false,
  marketing: false,
  preferences: false,
};

export function useCookieConsent() {
  const [consent, setConsent] = useState<ConsentState | null>(null);
  const [decided, setDecided] = useState(true); // assume decided until we check

  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) {
        setConsent(JSON.parse(raw));
        setDecided(true);
      } else {
        setConsent(DEFAULT);
        setDecided(false); // no choice yet → show banner
      }
    } catch {
      setConsent(DEFAULT);
      setDecided(false);
    }
  }, []);

  const save = useCallback((next: ConsentState) => {
    try {
      localStorage.setItem(KEY, JSON.stringify(next));
    } catch {}
    setConsent(next);
    setDecided(true);
  }, []);

  const acceptAll = useCallback(
    () => save({ essential: true, analytics: true, marketing: true, preferences: true }),
    [save]
  );

  const rejectNonEssential = useCallback(
    () => save({ essential: true, analytics: false, marketing: false, preferences: false }),
    [save]
  );

  // lets the footer link reopen the banner
  const reopen = useCallback(() => setDecided(false), []);

  return { consent, decided, save, acceptAll, rejectNonEssential, reopen };
}
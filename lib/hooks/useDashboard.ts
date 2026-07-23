"use client";

import { useEffect, useState, useCallback } from "react";
import { monthKey } from "@/lib/dates";

export function useDashboard(month?: string) {
  const [key, setKey] = useState(month ?? monthKey(new Date()));
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/dashboard?month=${key}`);
      if (!res.ok) throw new Error("Failed to load dashboard");
      setData(await res.json());
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }, [key]);

  useEffect(() => { load(); }, [load]);

  return { data, loading, error, month: key, setMonth: setKey, refresh: load };
}
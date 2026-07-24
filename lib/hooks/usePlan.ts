"use client";

import { useSession } from "next-auth/react";

export function usePlan() {
  const { data: session, status } = useSession();

  return {
    plan: session?.user?.plan ?? "free",
    isPremium: session?.user?.isPremium ?? false,
    currency: session?.user?.currency ?? "GBP",
    loading: status === "loading",
  };
}
"use client";

import type { ReactNode } from "react";
import { useEffect } from "react";
import { supabaseAuthClient } from "@/lib/supabaseClient";
import { useAuthStore } from "@/store/useAuthStore";

export function AppProviders({ children }: { children: ReactNode }) {
  const initialize = useAuthStore((state) => state.initialize);

  useEffect(() => {
    initialize();

    const unsubscribe = supabaseAuthClient.onAuthStateChange((nextSession) => {
      initialize(nextSession ?? null);
    });

    return () => {
      unsubscribe?.();
    };
  }, [initialize]);

  return <>{children}</>;
}

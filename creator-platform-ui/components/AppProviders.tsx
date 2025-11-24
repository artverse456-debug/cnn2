"use client";

import type { ReactNode } from "react";
import { useEffect } from "react";
import { supabaseAuthClient } from "@/lib/supabaseClient";
import { useAuthStore } from "@/store/useAuthStore";
import type { Session } from "@supabase/supabase-js";

export function AppProviders({ children }: { children: ReactNode }) {
  const initialize = useAuthStore((state) => state.initialize);

  useEffect(() => {
    let isActive = true;
    let bootstrapping = true;

    const syncSession = async (session?: Session | null) => {
      if (!isActive) return;
      try {
        await initialize(session ?? null);
      } catch (error) {
        console.error("Failed to sync session", error);
        await initialize(null);
      }
    };

    const unsubscribe = supabaseAuthClient.onAuthStateChange((event, nextSession) => {
      if (!isActive || bootstrapping) return;

      if (event === "SIGNED_OUT") {
        void syncSession(null);
        return;
      }

      void syncSession(nextSession ?? null);
    });

    const bootstrap = async () => {
      let existingSession: Session | null = null;

      try {
        existingSession = await supabaseAuthClient.getSession();
      } catch (error) {
        console.error("Failed to fetch session", error);
        existingSession = null;
      }

      try {
        await syncSession(existingSession ?? null);
      } finally {
        bootstrapping = false;
      }
    };

    void bootstrap();

    return () => {
      isActive = false;
      unsubscribe?.();
    };
  }, [initialize]);

  return <>{children}</>;
}

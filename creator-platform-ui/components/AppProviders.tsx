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
      await initialize(session ?? null);
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
      const existingSession = await supabaseAuthClient.getSession();
      await syncSession(existingSession ?? null);
      bootstrapping = false;
    };

    void bootstrap();

    return () => {
      isActive = false;
      unsubscribe?.();
    };
  }, [initialize]);

  return <>{children}</>;
}

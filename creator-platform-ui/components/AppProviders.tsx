"use client";

import type { ReactNode } from "react";
import { useEffect } from "react";
import { supabaseAuthClient } from "@/lib/supabaseClient";
import { useAuthStore } from "@/store/useAuthStore";

export function AppProviders({ children }: { children: ReactNode }) {
  const initialize = useAuthStore((state) => state.initialize);

  useEffect(() => {
    let isActive = true;
    let bootstrapping = true;

    const unsubscribe = supabaseAuthClient.onAuthStateChange((event, nextSession) => {
      if (!isActive || bootstrapping) return;

      if (event === "SIGNED_OUT") {
        initialize(null);
        return;
      }

      void initialize(nextSession ?? null);
    });

    const bootstrap = async () => {
      const callbackSession = await supabaseAuthClient.handleAuthCallbackFromUrl();
      const existingSession = callbackSession ?? (await supabaseAuthClient.getSession());

      if (!isActive) return;

      await initialize(existingSession ?? null);
      bootstrapping = false;
    };

    bootstrap();

    return () => {
      isActive = false;
      unsubscribe?.();
    };
  }, [initialize]);

  return <>{children}</>;
}

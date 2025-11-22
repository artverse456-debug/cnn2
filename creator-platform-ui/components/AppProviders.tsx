"use client";

import type { ReactNode } from "react";
import { useEffect } from "react";
import type { AuthChangeEvent, Session } from "@supabase/supabase-js";
import { supabaseAuthClient } from "@/lib/supabaseClient";
import { useAuthStore } from "@/store/useAuthStore";

export function AppProviders({ children }: { children: ReactNode }) {
  const initialize = useAuthStore((state) => state.initialize);

  useEffect(() => {
    let isActive = true;
    let bootstrapping = true;

    const unsubscribe = supabaseAuthClient.onAuthStateChange(async (event: AuthChangeEvent, nextSession: Session | null) => {
      if (!isActive || bootstrapping) return;

      if (event === "SIGNED_OUT") {
        await initialize(null);
        return;
      }

      await initialize(nextSession ?? null);
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

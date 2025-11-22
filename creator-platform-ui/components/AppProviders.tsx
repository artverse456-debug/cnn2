"use client";

import type { ReactNode } from "react";
import { useEffect } from "react";
import { supabaseBrowserClient } from "@/lib/supabaseClient";
import { useAuthStore } from "@/store/useAuthStore";

export function AppProviders({ children }: { children: ReactNode }) {
  const initialize = useAuthStore((state) => state.initialize);

  useEffect(() => {
    let isActive = true;
    const bootstrap = async () => {
      const { data } = await supabaseBrowserClient.auth.getSession();
      if (!isActive) return;
      await initialize(data.session ?? null);
    };

    const { data: authListener } = supabaseBrowserClient.auth.onAuthStateChange((event, session) => {
      if (!isActive) return;
      if (event === "SIGNED_OUT") {
        initialize(null);
        return;
      }

      initialize(session ?? null);
    });

    bootstrap();

    return () => {
      isActive = false;
      authListener?.subscription.unsubscribe();
    };
  }, [initialize]);

  return <>{children}</>;
}

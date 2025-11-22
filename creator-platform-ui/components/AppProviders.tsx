"use client";

import type { ReactNode } from "react";
import { useEffect } from "react";
import { getSupabaseBrowserClient } from "@/lib/supabase/browserClient";
import { useAuthStore } from "@/store/useAuthStore";
import type { Session } from "@supabase/supabase-js";

export function AppProviders({ children, initialSession }: { children: ReactNode; initialSession: Session | null }) {
  const initialize = useAuthStore((state) => state.initialize);

  useEffect(() => {
    let active = true;
    const supabase = getSupabaseBrowserClient();

    initialize(initialSession ?? null);

    const { data: listener } = supabase.auth.onAuthStateChange((event, session) => {
      if (!active) return;

      if (event === "SIGNED_OUT") {
        initialize(null);
        return;
      }

      initialize(session ?? null);
    });

    return () => {
      active = false;
      listener.subscription.unsubscribe();
    };
  }, [initialize, initialSession]);

  return <>{children}</>;
}

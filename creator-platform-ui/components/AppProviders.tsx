"use client";

import type { ReactNode } from "react";
import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import type { AuthChangeEvent, Session } from "@supabase/supabase-js";
import { getSupabaseBrowserClient } from "@/lib/supabase/browserClient";
import { useAuthStore } from "@/store/useAuthStore";

export function AppProviders({ children }: { children: ReactNode }) {
  const initialize = useAuthStore((state) => state.initialize);
  const clear = useAuthStore((state) => state.clear);
  const profile = useAuthStore((state) => state.profile);
  const session = useAuthStore((state) => state.session);
  const loading = useAuthStore((state) => state.loading);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const supabase = getSupabaseBrowserClient();
    let isActive = true;

    const { data: listener } = supabase.auth.onAuthStateChange(
      (event: AuthChangeEvent, nextSession: Session | null) => {
        if (!isActive) return;

        if (event === "SIGNED_OUT") {
          clear();
          return;
        }

        void initialize(nextSession ?? null);
      }
    );

    const bootstrap = async () => {
      const { data } = await supabase.auth.getSession();
      const existingSession = data.session ?? null;

      if (!isActive) {
        listener?.subscription.unsubscribe();
        return;
      }

      await initialize(existingSession);
    };

    bootstrap();

    return () => {
      isActive = false;
      listener?.subscription.unsubscribe();
    };
  }, [clear, initialize]);

  useEffect(() => {
    if (loading || !session || !profile) return;

    const destination = profile.role === "creator" ? "/dashboard/creator" : "/dashboard/fan";

    if (pathname?.startsWith("/auth")) {
      router.replace(destination);
    }

    if (pathname?.startsWith("/dashboard/creator") && profile.role !== "creator") {
      router.replace("/dashboard/fan");
    }

    if (pathname?.startsWith("/dashboard/fan") && profile.role === "creator") {
      router.replace("/dashboard/creator");
    }
  }, [loading, pathname, profile, router, session]);

  return <>{children}</>;
}

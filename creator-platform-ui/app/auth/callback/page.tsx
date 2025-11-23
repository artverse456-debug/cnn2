"use client";

import { useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { supabaseAuthClient } from "@/lib/supabaseClient";
import { useAuthStore } from "@/store/useAuthStore";

export default function AuthCallbackPage() {
  const router = useRouter();
  const initializeAuth = useAuthStore((state) => state.initialize);
  const profile = useAuthStore((state) => state.profile);
  const session = useAuthStore((state) => state.session);
  const loading = useAuthStore((state) => state.loading);

  const nextRoute = useMemo(() => {
    const role = profile?.role ?? (session?.user?.user_metadata?.role as "creator" | "fan" | undefined) ?? "fan";
    return role === "creator" ? "/dashboard/creator" : "/dashboard/fan";
  }, [profile?.role, session?.user?.user_metadata?.role]);

  useEffect(() => {
    const processCallback = async () => {
      const callbackSession = await supabaseAuthClient.handleAuthCallbackFromUrl();
      const activeSession = callbackSession ?? (await supabaseAuthClient.getSession());
      const preferredRole = (activeSession?.user?.user_metadata?.role as "creator" | "fan" | undefined) ?? undefined;

      await initializeAuth(activeSession ?? null, preferredRole);
    };

    processCallback();
  }, [initializeAuth]);

  useEffect(() => {
    if (loading) return;

    if (session) {
      router.replace(nextRoute);
    } else {
      router.replace("/auth/login");
    }
  }, [loading, nextRoute, router, session]);

  return (
    <div className="mx-auto flex max-w-md flex-col gap-6 px-4 py-16">
      <h1 className="text-3xl font-semibold text-white">Authentifiziere...</h1>
      <p className="text-sm text-white/70">
        Wir bestätigen deine Anmeldung. Du wirst automatisch weitergeleitet, sobald dein Login abgeschlossen ist.
      </p>
    </div>
  );
}

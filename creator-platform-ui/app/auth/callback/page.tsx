"use client";

import { useEffect } from "react";
import type { UserRole } from "@/store/useAuthStore";
import { supabaseAuthClient } from "@/lib/supabaseClient";
import { useAuthStore } from "@/store/useAuthStore";

export default function AuthCallbackPage() {
  const initializeAuth = useAuthStore((state) => state.initialize);

  useEffect(() => {
    const processCallback = async () => {
      const callbackSession = await supabaseAuthClient.exchangeCodeForSession();
      await initializeAuth(callbackSession ?? null, callbackSession?.user?.user_metadata?.role as UserRole);
    };

    void processCallback();
  }, [initializeAuth]);

  return (
    <div className="mx-auto flex max-w-md flex-col gap-6 px-4 py-16">
      <h1 className="text-3xl font-semibold text-white">Authentifiziere...</h1>
      <p className="text-sm text-white/70">
        Wir bestätigen deine Anmeldung. Du wirst automatisch weitergeleitet, sobald dein Login abgeschlossen ist.
      </p>
    </div>
  );
}

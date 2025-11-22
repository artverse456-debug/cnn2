"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { getSupabaseBrowserClient } from "@/lib/supabase/browserClient";
import { useAuthStore } from "@/store/useAuthStore";

export default function AuthCallbackPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initializeAuth = useAuthStore((state) => state.initialize);
  const profile = useAuthStore((state) => state.profile);
  const session = useAuthStore((state) => state.session);
  const loading = useAuthStore((state) => state.loading);
  const [error, setError] = useState<string | null>(null);

  const nextRoute = useMemo(() => {
    if (!profile) return null;
    return profile.role === "creator" ? "/dashboard/creator" : "/dashboard/fan";
  }, [profile]);

  useEffect(() => {
    const processCallback = async () => {
      const supabase = getSupabaseBrowserClient();
      const code = searchParams.get("code");
      const { data, error } = code
        ? await supabase.auth.exchangeCodeForSession(code)
        : await supabase.auth.getSessionFromUrl();

      if (error) {
        setError(error.message);
        return;
      }

      const callbackSession = data.session;
      if (!callbackSession) {
        setError("Session konnte nicht erstellt werden.");
        return;
      }

      const nextProfile = await initializeAuth(callbackSession ?? undefined);
      if (!nextProfile) {
        setError("Profil konnte nicht geladen werden.");
        return;
      }

      const redirect = nextProfile.role === "creator" ? "/dashboard/creator" : "/dashboard/fan";
      router.replace(redirect);
    };

    processCallback();
  }, [initializeAuth, router, searchParams]);

  useEffect(() => {
    if (loading || error) return;

    if (session && nextRoute) {
      router.replace(nextRoute);
    } else if (!session && !loading) {
      router.replace("/auth/login");
    }
  }, [loading, nextRoute, router, session, error]);

  return (
    <div className="mx-auto flex max-w-md flex-col gap-6 px-4 py-16">
      <h1 className="text-3xl font-semibold text-white">Authentifiziere...</h1>
      <p className="text-sm text-white/70">
        Wir bestätigen deine Anmeldung. Du wirst automatisch weitergeleitet, sobald dein Login abgeschlossen ist.
      </p>
      {error ? <p className="text-xs text-red-400">{error}</p> : null}
    </div>
  );
}

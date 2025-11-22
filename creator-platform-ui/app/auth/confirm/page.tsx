"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { getSupabaseBrowserClient } from "@/lib/supabase/browserClient";

export default function AuthConfirmPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [status, setStatus] = useState("Bestätige E-Mail...");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const code = searchParams.get("code") ?? searchParams.get("token_hash");
    const type = (searchParams.get("type") ?? "signup") as "signup" | "invite" | "recovery";
    const email = searchParams.get("email");

    if (!code) {
      setError("Bestätigungscode fehlt.");
      return;
    }

    const verify = async () => {
      const supabase = getSupabaseBrowserClient();
      const { error: verifyError } = await supabase.auth.verifyOtp({
        token_hash: code,
        type,
        email: email ?? undefined,
      });

      if (verifyError) {
        setError(verifyError.message);
        setStatus("Bestätigung fehlgeschlagen.");
        return;
      }

      setStatus("E-Mail bestätigt. Weiterleitung zum Login...");
      setTimeout(() => router.replace("/auth/login?confirmed=1"), 1200);
    };

    verify();
  }, [router, searchParams]);

  return (
    <div className="mx-auto flex max-w-md flex-col gap-6 px-4 py-16">
      <h1 className="text-3xl font-semibold text-white">E-Mail Bestätigung</h1>
      <p className="text-sm text-white/70">{status}</p>
      {error ? <p className="text-xs text-red-400">{error}</p> : null}
    </div>
  );
}

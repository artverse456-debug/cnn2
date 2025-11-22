"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useEffect, useState, useTransition } from "react";
import { useAuthStore } from "@/store/useAuthStore";
import { supabaseBrowserClient } from "@/lib/supabaseClient";
import { loginAction } from "./actions";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [, startTransition] = useTransition();
  const initializeAuth = useAuthStore((state) => state.initialize);
  const profile = useAuthStore((state) => state.profile);
  const session = useAuthStore((state) => state.session);
  const loading = useAuthStore((state) => state.loading);

  useEffect(() => {
    if (loading || !session || !profile) return;

    const nextRoute = profile.role === "creator" ? "/creator-hub" : "/fan-hub";
    router.replace(nextRoute);
  }, [loading, profile, router, session]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);
    setError(null);

    startTransition(async () => {
      const formData = new FormData();
      formData.append("email", email);
      formData.append("password", password);

      const result = await loginAction(formData);

      if (result.error) {
        setError(result.error);
        setIsSubmitting(false);
        return;
      }

      if (result.session) {
        await supabaseBrowserClient.auth.setSession({
          access_token: result.session.access_token,
          refresh_token: result.session.refresh_token!,
        });

        await initializeAuth(result.session);
        router.push("/");
      }

      setIsSubmitting(false);
    });
  };

  return (
    <div className="mx-auto flex max-w-md flex-col gap-6 px-4 py-16">
      <h1 className="text-3xl font-semibold text-white">Login</h1>
      <p className="text-sm text-white/70">Login mit deinen Supabase-Credentials.</p>
      <form className="space-y-4" onSubmit={handleSubmit}>
        <label className="text-sm text-white/70">
          E-Mail
          <input
            className="mt-2 w-full rounded-2xl border border-white/10 bg-transparent px-4 py-3"
            type="email"
            placeholder="creator@pulse.io"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            required
          />
        </label>
        <label className="text-sm text-white/70">
          Passwort
          <input
            className="mt-2 w-full rounded-2xl border border-white/10 bg-transparent px-4 py-3"
            type="password"
            placeholder="••••••"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            required
          />
        </label>
        <button
          className="w-full rounded-full bg-gradient-to-r from-primary to-accent py-3 font-semibold"
          type="submit"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Login läuft..." : "Login"}
        </button>
        {error ? <p className="text-xs text-red-400">{error}</p> : null}
      </form>
      <p className="text-xs text-white/60">
        Kein Account? <Link href="/auth/register" className="text-primary-light">Registrieren</Link>
      </p>
    </div>
  );
}

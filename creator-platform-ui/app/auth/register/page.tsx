"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useEffect, useState } from "react";
import { getSupabaseBrowserClient } from "@/lib/supabase/browserClient";
import { useAuthStore } from "@/store/useAuthStore";

export default function RegisterPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("creator");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);
  const profile = useAuthStore((state) => state.profile);
  const session = useAuthStore((state) => state.session);
  const loading = useAuthStore((state) => state.loading);

  useEffect(() => {
    if (loading || !session || !profile) return;

    const nextRoute = profile.role === "creator" ? "/dashboard/creator" : "/dashboard/fan";
    router.replace(nextRoute);
  }, [loading, profile, router, session]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);
    setError(null);
    setSuccess(null);

    try {
      const supabase = getSupabaseBrowserClient();
      const redirectTo = typeof window !== "undefined" ? `${window.location.origin}/auth/callback` : undefined;
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: redirectTo,
          data: { role }
        }
      });

      if (error) throw error;

      await supabase.auth.signOut();
      router.replace("/auth/register");
      setSuccess("Bitte bestätige deine E-Mail-Adresse. Schaue in dein Postfach.");
    } catch (err) {
      const message = err instanceof Error ? err.message : "Registrierung fehlgeschlagen.";
      setError(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="mx-auto flex max-w-md flex-col gap-6 px-4 py-16">
      <h1 className="text-3xl font-semibold text-white">Create Account</h1>
      <p className="text-sm text-white/70">Wähle Rolle für das Demo-Routing.</p>
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
        <label className="text-sm text-white/70">
          Rolle
          <select
            className="mt-2 w-full rounded-2xl border border-white/10 bg-black/40 px-4 py-3"
            value={role}
            onChange={(event) => setRole(event.target.value)}
          >
            <option value="creator" className="bg-black">
              Creator
            </option>
            <option value="fan" className="bg-black">
              Fan
            </option>
          </select>
        </label>
        <button
          className="w-full rounded-full bg-gradient-to-r from-primary to-accent py-3 font-semibold"
          type="submit"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Account wird angelegt..." : "Account anlegen"}
        </button>
        {success ? <p className="text-xs text-emerald-400">{success}</p> : null}
        {error ? <p className="text-xs text-red-400">{error}</p> : null}
      </form>
      <p className="text-xs text-white/60">
        Bereits dabei? <Link href="/auth/login" className="text-primary-light">Login</Link>
      </p>
    </div>
  );
}

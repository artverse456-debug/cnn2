"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { supabaseAuthClient } from "@/lib/supabaseClient";

export default function RegisterPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("creator");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      await supabaseAuthClient.signUp(email, password, role);
      router.push("/");
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
        {error ? <p className="text-xs text-red-400">{error}</p> : null}
      </form>
      <p className="text-xs text-white/60">
        Bereits dabei? <Link href="/auth/login" className="text-primary-light">Login</Link>
      </p>
    </div>
  );
}

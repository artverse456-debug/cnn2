"use server";

import { createSupabaseServerClient } from "@/lib/supabaseServerClient";
import type { Session } from "@supabase/supabase-js";

export type LoginResult = { session?: Session | null; error?: string };

export async function loginAction(formData: FormData): Promise<LoginResult> {
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "").trim();

  if (!email || !password) {
    return { error: "Bitte gib E-Mail und Passwort ein." };
  }

  const supabase = createSupabaseServerClient();
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    const normalizedMessage = error.message?.toLowerCase();
    if (normalizedMessage?.includes("email not confirmed") || normalizedMessage?.includes("confirm your email")) {
      return { error: "Bitte bestätige zuerst deine E-Mail." };
    }

    return { error: error.message };
  }

  const emailConfirmed = data.user?.email_confirmed_at ?? null;
  if (!emailConfirmed) {
    await supabase.auth.signOut();
    return { error: "Bitte bestätige zuerst deine E-Mail." };
  }

  return { session: data.session };
}

"use server";

import { createSupabaseServerClient } from "@/lib/supabaseServerClient";

export type RegisterResult = { success?: string; error?: string };

export async function registerAction(formData: FormData): Promise<RegisterResult> {
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "").trim();
  const role = String(formData.get("role") ?? "fan").trim() as "creator" | "fan";

  if (!email || !password) {
    return { error: "Bitte fülle E-Mail und Passwort aus." };
  }

  const supabase = createSupabaseServerClient();

  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { role },
      emailRedirectTo: "https://cnn2-eta.vercel.app/auth/callback",
    },
  });

  if (error) {
    return { error: error.message };
  }

  await supabase.auth.signOut();

  return { success: "Bitte bestätige deine E-Mail." };
}

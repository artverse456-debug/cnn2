"use client";

import type { Session, User } from "@supabase/supabase-js";
import { getSupabaseAdminClient } from "./supabase/adminClient";
import { getSupabaseBrowserClient } from "./supabase/browserClient";

export type UserRole = "creator" | "fan";

export type Profile = {
  id: string;
  role: UserRole;
  username?: string | null;
  avatar_url?: string | null;
  email?: string | null;
  points?: number | null;
  created_at?: string | null;
};

export type ProfileUpdatePayload = {
  username?: string | null;
  avatar_url?: string | null;
  role?: UserRole;
};

export const DEFAULT_AVATAR_URL = "/logo.svg";

export function usernameFromEmail(email?: string | null) {
  if (!email) return null;
  return email.split("@")[0] ?? null;
}

async function fetchProfile(userId: string) {
  const supabase = getSupabaseBrowserClient();
  const { data } = await supabase.from("profiles").select("*").eq("id", userId).maybeSingle();
  return data as Profile | null;
}

export async function ensureProfile(session: Session, preferredRole?: UserRole): Promise<Profile | null> {
  const user = session.user;
  if (!user?.id) return null;

  const existing = await fetchProfile(user.id);
  if (existing) return existing;

  const response = await fetch("/api/profiles", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      userId: user.id,
      email: user.email,
      role: preferredRole ?? (user.user_metadata?.role as UserRole | undefined) ?? "fan",
    })
  });

  if (!response.ok) {
    console.error("Profile creation failed", await response.text());
    try {
      const supabase = getSupabaseBrowserClient();
      const { data } = await supabase
        .from("profiles")
        .upsert(
          {
            id: user.id,
            role: preferredRole ?? (user.user_metadata?.role as UserRole | undefined) ?? "fan",
            username: usernameFromEmail(user.email),
            avatar_url: null,
            points: 0,
            email: user.email,
            created_at: new Date().toISOString(),
          },
          { onConflict: "id" }
        )
        .select()
        .maybeSingle();

      return (data as Profile | null) ?? null;
    } catch (error) {
      console.error("Fallback profile insert failed", error);
    }

    return null;
  }

  const json = (await response.json()) as { profile?: Profile };
  return json.profile ?? null;
}

export async function updateProfile(userId: string, updates: ProfileUpdatePayload): Promise<Profile | null> {
  const supabase = getSupabaseBrowserClient();
  const { data, error } = await supabase
    .from("profiles")
    .update(updates)
    .eq("id", userId)
    .select()
    .maybeSingle();

  if (error) {
    console.error("Failed to update profile", error);
    return null;
  }

  return data as Profile | null;
}

export async function serverCreateProfile(user: User, role: UserRole) {
  const adminClient = getSupabaseAdminClient();
  const { data, error } = await adminClient
    .from("profiles")
    .upsert(
      {
        id: user.id,
        role,
        username: usernameFromEmail(user.email),
        avatar_url: null,
        points: 0,
        email: user.email,
        created_at: new Date().toISOString()
      },
      { onConflict: "id" }
    )
    .select()
    .maybeSingle();

  if (error) {
    console.error("serverCreateProfile error", error);
  }

  return data as Profile | null;
}

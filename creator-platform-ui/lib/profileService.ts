"use client";

import type { Session, User } from "@supabase/supabase-js";
import { getSupabaseBrowserClient } from "./supabaseClient";

export type UserRole = "creator" | "fan";

export type Profile = {
  id: string;
  role: UserRole;
  username?: string | null;
  avatar_url?: string | null;
  email?: string | null;
  points?: number | null;
};

export type ProfileUpdatePayload = {
  username?: string | null;
  avatar_url?: string | null;
  role?: UserRole;
};

const DEFAULT_AVATAR_URL = "/logo.svg";

function usernameFromEmail(email?: string | null) {
  if (!email) return null;
  return email.split("@")[0] ?? null;
}

async function fetchProfileById(userId: string): Promise<Profile | null> {
  const supabase = getSupabaseBrowserClient();

  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", userId)
    .maybeSingle();

  if (error) {
    console.error("Failed to fetch profile", error);
    return null;
  }

  return data;
}

async function upsertProfile(
  user: User,
  role: UserRole,
  existingProfile?: Profile | null
): Promise<Profile | null> {
  const supabase = getSupabaseBrowserClient();
  const username = existingProfile?.username ?? usernameFromEmail(user.email);
  const avatar_url = existingProfile?.avatar_url ?? DEFAULT_AVATAR_URL;

  const { data, error } = await supabase
    .from("profiles")
    .upsert(
      {
        id: user.id,
        role,
        email: user.email ?? existingProfile?.email ?? null,
        username,
        avatar_url,
        points: existingProfile?.points ?? 0
      },
      { onConflict: "id" }
    )
    .select()
    .maybeSingle();

  if (error) {
    console.error("Failed to upsert profile", error);
    return null;
  }

  return data;
}

export async function ensureProfile(session: Session, preferredRole?: UserRole): Promise<Profile | null> {
  const user = session.user;
  if (!user?.id) return null;

  const existingProfile = await fetchProfileById(user.id);
  const metaRole = (user.user_metadata?.role as UserRole | undefined) ?? undefined;
  const fallbackRole = preferredRole ?? existingProfile?.role ?? metaRole ?? "fan";

  const profile = await upsertProfile(user, fallbackRole, existingProfile);

  return profile ?? existingProfile ?? null;
}

export async function updateProfile(
  userId: string,
  updates: ProfileUpdatePayload
): Promise<Profile | null> {
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

  return data;
}

export { usernameFromEmail, DEFAULT_AVATAR_URL, fetchProfileById };

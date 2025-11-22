"use client";

import type { Session, User } from "@supabase/supabase-js";
import { SUPABASE_ANON_KEY, SUPABASE_URL } from "./supabaseClient";

export type UserRole = "creator" | "fan";

const DEFAULT_AVATAR_URL: string | null = null;

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

function authHeaders(accessToken: string) {
  return {
    apikey: SUPABASE_ANON_KEY,
    Authorization: `Bearer ${accessToken}`,
    "Content-Type": "application/json",
  };
}

async function requestProfile<T>(path: string, options: RequestInit): Promise<T> {
  const response = await fetch(`${SUPABASE_URL}${path}`, options);

  if (!response.ok) {
    const text = await response.text();
    throw new Error(text || "Supabase profile request failed");
  }

  if (response.status === 204) {
    return {} as T;
  }

  return (await response.json()) as T;
}

export async function fetchProfileById(accessToken: string, userId: string): Promise<Profile | null> {
  try {
    const data = await requestProfile<Profile[]>(`/rest/v1/profiles?select=*&id=eq.${userId}&limit=1`, {
      method: "GET",
      headers: authHeaders(accessToken),
    });

    return data?.[0] ?? null;
  } catch (error) {
    console.error("Failed to fetch profile", error);
    return null;
  }
}

export async function createProfile(accessToken: string, user: User, role: UserRole): Promise<Profile | null> {
  if (!user.id) return null;

  try {
    const data = await requestProfile<Profile[]>(`/rest/v1/profiles`, {
      method: "POST",
      headers: {
        ...authHeaders(accessToken),
        Prefer: "return=representation",
      },
      body: JSON.stringify({
        id: user.id,
        role,
        email: user.email ?? null,
        username: "",
        avatar_url: null,
        points: 0,
        created_at: new Date().toISOString(),
      }),
    });

    return data?.[0] ?? null;
  } catch (error) {
    console.error("Failed to create profile", error);
    return null;
  }
}

export async function ensureProfile(session: Session, preferredRole?: UserRole): Promise<Profile | null> {
  const user = session.user;
  if (!user?.id) return null;

  const existingProfile = await fetchProfileById(session.access_token, user.id);
  if (existingProfile) return existingProfile;

  const metaRole = user.user_metadata?.role as UserRole | undefined;
  const fallbackRole = preferredRole ?? metaRole ?? "fan";

  return createProfile(session.access_token, user, fallbackRole);
}

export async function updateProfile(
  accessToken: string,
  userId: string,
  updates: ProfileUpdatePayload
): Promise<Profile | null> {
  try {
    const data = await requestProfile<Profile[]>(`/rest/v1/profiles?id=eq.${userId}`, {
      method: "PATCH",
      headers: {
        ...authHeaders(accessToken),
        Prefer: "return=representation",
      },
      body: JSON.stringify(updates),
    });

    return data?.[0] ?? null;
  } catch (error) {
    console.error("Failed to update profile", error);
    return null;
  }
}

function usernameFromEmail(email?: string | null) {
  if (!email) return null;
  return email.split("@")[0] ?? null;
}

export { usernameFromEmail, DEFAULT_AVATAR_URL };

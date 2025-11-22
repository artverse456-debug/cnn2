"use client";

import { AuthSession, AuthUser, SUPABASE_ANON_KEY, SUPABASE_URL } from "./supabaseClient";

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

function usernameFromEmail(email?: string | null) {
  if (!email) return null;
  return email.split("@")[0] ?? null;
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

export async function upsertProfile(
  accessToken: string,
  payload: {
    user: AuthUser;
    role: UserRole;
    existingProfile?: Profile | null;
  }
): Promise<Profile | null> {
  if (!payload.user?.id) return null;

  const username = payload.existingProfile?.username ?? usernameFromEmail(payload.user.email);
  const avatar_url = payload.existingProfile?.avatar_url ?? DEFAULT_AVATAR_URL;

  try {
    const data = await requestProfile<Profile[]>(`/rest/v1/profiles`, {
      method: "POST",
      headers: {
        ...authHeaders(accessToken),
        Prefer: "return=representation,resolution=merge-duplicates",
      },
      body: JSON.stringify({
        id: payload.user.id,
        role: payload.role,
        email: payload.user.email ?? payload.existingProfile?.email ?? null,
        username,
        avatar_url,
        points: payload.existingProfile?.points ?? 0,
      }),
    });

    return data?.[0] ?? null;
  } catch (error) {
    console.error("Failed to upsert profile", error);
    return null;
  }
}

export async function ensureProfile(session: AuthSession, preferredRole?: UserRole): Promise<Profile | null> {
  const user = session.user;
  if (!user?.id) return null;

  const existingProfile = await fetchProfileById(session.access_token, user.id);
  const metaRole = user.user_metadata?.role as UserRole | undefined;
  const fallbackRole = preferredRole ?? existingProfile?.role ?? metaRole ?? "fan";

  const profile = await upsertProfile(session.access_token, {
    user,
    role: fallbackRole,
    existingProfile,
  });

  return profile ?? existingProfile ?? null;
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

export { usernameFromEmail, DEFAULT_AVATAR_URL };

"use client";

import { AuthSession, AuthUser, SUPABASE_ANON_KEY, SUPABASE_URL } from "./supabaseClient";

export type UserRole = "creator" | "fan";

export type Profile = {
  id: string;
  role: UserRole;
  display_name?: string | null;
  avatar_url?: string | null;
  email?: string | null;
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

export async function createProfile(accessToken: string, payload: { user: AuthUser; role: UserRole }): Promise<Profile | null> {
  if (!payload.user?.id) return null;

  try {
    const data = await requestProfile<Profile[]>(`/rest/v1/profiles`, {
      method: "POST",
      headers: {
        ...authHeaders(accessToken),
        Prefer: "return=representation",
      },
      body: JSON.stringify({
        id: payload.user.id,
        role: payload.role,
        email: payload.user.email ?? null,
      }),
    });

    return data?.[0] ?? null;
  } catch (error) {
    console.error("Failed to create profile", error);
    return null;
  }
}

export async function updateProfileRole(
  accessToken: string,
  userId: string,
  nextRole: UserRole
): Promise<Profile | null> {
  try {
    const data = await requestProfile<Profile[]>(`/rest/v1/profiles?id=eq.${userId}`, {
      method: "PATCH",
      headers: {
        ...authHeaders(accessToken),
        Prefer: "return=representation",
      },
      body: JSON.stringify({ role: nextRole }),
    });

    return data?.[0] ?? null;
  } catch (error) {
    console.error("Failed to update profile role", error);
    return null;
  }
}

export async function ensureProfile(session: AuthSession, preferredRole?: UserRole): Promise<Profile | null> {
  const user = session.user;
  if (!user?.id) return null;

  const existingProfile = await fetchProfileById(session.access_token, user.id);
  if (existingProfile) return existingProfile;

  const fallbackRole = preferredRole ?? "fan";

  return createProfile(session.access_token, { user, role: fallbackRole });
}

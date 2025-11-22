import type { Session, SupabaseClient, User } from "@supabase/supabase-js";

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

function usernameFromEmail(email?: string | null) {
  if (!email) return null;
  return email.split("@")[0] ?? null;
}

async function fetchProfileById(client: SupabaseClient, userId: string) {
  const { data, error } = await client
    .from("profiles")
    .select("*")
    .eq("id", userId)
    .maybeSingle();

  if (error) {
    console.error("Failed to fetch profile", error);
  }

  return data as Profile | null;
}

async function insertProfile(client: SupabaseClient, user: User, role: UserRole) {
  const { data, error } = await client
    .from("profiles")
    .insert({
      id: user.id,
      role,
      email: user.email ?? null,
      username: usernameFromEmail(user.email),
      points: 0,
      avatar_url: null
    })
    .select()
    .maybeSingle();

  if (error) {
    console.error("Failed to create profile", error);
  }

  return data as Profile | null;
}

export async function ensureProfile(
  client: SupabaseClient,
  session: Session,
  preferredRole?: UserRole
): Promise<Profile | null> {
  const user = session.user;
  if (!user?.id) return null;

  const existingProfile = await fetchProfileById(client, user.id);
  if (existingProfile) return existingProfile;

  const userMetadataRole = (user.user_metadata?.role as UserRole | undefined) ?? null;
  const role = preferredRole ?? userMetadataRole ?? "fan";

  return insertProfile(client, user, role);
}

export async function updateProfile(
  client: SupabaseClient,
  userId: string,
  updates: ProfileUpdatePayload
): Promise<Profile | null> {
  const { data, error } = await client
    .from("profiles")
    .update(updates)
    .eq("id", userId)
    .select()
    .maybeSingle();

  if (error) {
    console.error("Failed to update profile", error);
  }

  return data as Profile | null;
}

export { usernameFromEmail };

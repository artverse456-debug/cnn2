import { create } from "zustand";
import type { Session } from "@supabase/supabase-js";
import { getSupabaseBrowserClient } from "@/lib/supabase/browserClient";
import {
  DEFAULT_AVATAR_URL,
  ensureProfile,
  type Profile,
  type ProfileUpdatePayload,
  type UserRole,
  updateProfile,
} from "@/lib/profileService";

type AuthState = {
  session: Session | null;
  profile: Profile | null;
  role: UserRole | null;
  loading: boolean;
  error: string | null;
  initialize: (sessionOverride?: Session | null, preferredRole?: UserRole) => Promise<Profile | null>;
  clear: () => void;
  setRole: (role: UserRole) => Promise<Profile | null>;
  updateProfile: (updates: ProfileUpdatePayload) => Promise<Profile | null>;
  isCreator: () => boolean;
  isFan: () => boolean;
};

export const useAuthStore = create<AuthState>((set, get) => ({
  session: null,
  profile: null,
  role: null,
  loading: true,
  error: null,
  clear: () => set({ session: null, profile: null, role: null, error: null, loading: false }),
  initialize: async (sessionOverride, preferredRole) => {
    set({ loading: true, error: null });

    const supabase = getSupabaseBrowserClient();
    const existingSession = sessionOverride ?? (await supabase.auth.getSession()).data.session;
    const session = existingSession ?? null;

    if (!session) {
      set({ session: null, profile: null, role: null, loading: false });
      return null;
    }

    try {
      const profile = await ensureProfile(session, preferredRole);
      const resolvedProfile = profile
        ? { ...profile, avatar_url: profile.avatar_url ?? DEFAULT_AVATAR_URL }
        : profile;
      set({
        session,
        profile: resolvedProfile,
        role: resolvedProfile?.role ?? null,
        loading: false,
        error: resolvedProfile ? null : "Profil konnte nicht geladen werden",
      });
      return resolvedProfile ?? null;
    } catch (error) {
      console.error("Failed to initialize auth", error);
      set({ session, profile: null, role: null, loading: false, error: "Profil konnte nicht geladen werden" });
      return null;
    }
  },
  setRole: async (role) => {
    const state = get();
    if (!state.session?.user?.id) return null;

    const updatedProfile = await updateProfile(state.session.user.id, { role });
    const resolvedProfile = updatedProfile
      ? { ...updatedProfile, avatar_url: updatedProfile.avatar_url ?? DEFAULT_AVATAR_URL }
      : updatedProfile;
    set({ profile: resolvedProfile, role: resolvedProfile?.role ?? role });
    return resolvedProfile;
  },
  updateProfile: async (updates) => {
    const state = get();
    if (!state.session?.user?.id) return null;

    const updatedProfile = await updateProfile(state.session.user.id, updates);
    const resolvedProfile = updatedProfile
      ? { ...updatedProfile, avatar_url: updatedProfile.avatar_url ?? DEFAULT_AVATAR_URL }
      : updatedProfile;
    if (resolvedProfile) {
      set({
        profile: resolvedProfile,
        role: resolvedProfile.role ?? state.role,
      });
    }

    return resolvedProfile;
  },
  isCreator: () => get().role === "creator",
  isFan: () => get().role === "fan",
}));

export type { UserRole, Profile };

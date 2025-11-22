import { create } from "zustand";
import { getSupabaseBrowserClient } from "@/lib/supabase/browserClient";
import { ensureProfile, type Profile, type ProfileUpdatePayload, type UserRole, updateProfile } from "@/lib/profileService";
import type { Session } from "@supabase/supabase-js";

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
    const session =
      sessionOverride ?? (await supabase.auth.getSession().then(({ data }) => data.session ?? null));

    if (!session) {
      set({ session: null, profile: null, role: null, loading: false });
      return null;
    }

    try {
      const profile = await ensureProfile(supabase, session, preferredRole);
      set({
        session,
        profile,
        role: profile?.role ?? null,
        loading: false,
        error: profile ? null : "Profil konnte nicht geladen werden"
      });
      return profile;
    } catch (error) {
      console.error("Failed to initialize auth", error);
      set({ session, profile: null, role: null, loading: false, error: "Profil konnte nicht geladen werden" });
      return null;
    }
  },
  setRole: async (role) => {
    const state = get();
    if (!state.session?.user?.id) return null;

    const supabase = getSupabaseBrowserClient();
    const updatedProfile = await updateProfile(supabase, state.session.user.id, { role });
    set({ profile: updatedProfile, role: updatedProfile?.role ?? role });
    return updatedProfile;
  },
  updateProfile: async (updates) => {
    const state = get();
    if (!state.session?.user?.id) return null;

    const supabase = getSupabaseBrowserClient();
    const updatedProfile = await updateProfile(supabase, state.session.user.id, updates);
    if (updatedProfile) {
      set({
        profile: updatedProfile,
        role: updatedProfile.role ?? state.role
      });
    }

    return updatedProfile;
  },
  isCreator: () => get().role === "creator",
  isFan: () => get().role === "fan"
}));

export type { UserRole, Profile };

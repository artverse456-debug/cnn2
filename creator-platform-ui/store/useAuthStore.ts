import { create } from "zustand";
import { supabaseAuthClient, type AuthSession } from "@/lib/supabaseClient";
import { ensureProfile, type Profile, type UserRole, updateProfileRole } from "@/lib/profileService";

type AuthState = {
  session: AuthSession | null;
  profile: Profile | null;
  role: UserRole | null;
  loading: boolean;
  error: string | null;
  initialize: (sessionOverride?: AuthSession | null, preferredRole?: UserRole) => Promise<Profile | null>;
  clear: () => void;
  setRole: (role: UserRole) => Promise<Profile | null>;
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

    const session = sessionOverride ?? supabaseAuthClient.getSession();

    if (!session) {
      set({ session: null, profile: null, role: null, loading: false });
      return null;
    }

    try {
      const profile = await ensureProfile(session, preferredRole);
      set({
        session,
        profile,
        role: profile?.role ?? null,
        loading: false,
        error: profile ? null : "Profil konnte nicht geladen werden",
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

    try {
      const updatedProfile = await updateProfileRole(state.session.access_token, state.session.user.id, role);
      set({ profile: updatedProfile, role: updatedProfile?.role ?? role });
      return updatedProfile;
    } catch (error) {
      console.error("Failed to update user role", error);
      return null;
    }
  },
}));

export type { UserRole, Profile };

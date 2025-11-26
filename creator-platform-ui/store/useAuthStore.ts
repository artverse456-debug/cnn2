import { create } from "zustand";
import type { Session } from "@supabase/supabase-js";
import { supabaseAuthClient } from "@/lib/supabaseClient";
import {
  DEFAULT_AVATAR_URL,
  createPointEvent,
  ensureProfile,
  hasReceivedSubscriptionPointsThisWeek,
  type PointEventType,
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
  applyPointChange: (delta: number, type: PointEventType, metadata?: Record<string, unknown>) => Promise<Profile | null>;
  applySubscriptionBonusIfNeeded: () => Promise<Profile | null>;
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

    let session = sessionOverride;

    if (session === undefined) {
      try {
        session = await supabaseAuthClient.getSession();
      } catch (error) {
        console.error("Failed to get session", error);
        set({ session: null, profile: null, role: null, loading: false, error: "Sitzung konnte nicht geladen werden" });
        return null;
      }
    }

    if (!session) {
      set({ session: null, profile: null, role: null, loading: false });
      return null;
    }

    try {
      const profile = await ensureProfile(session, preferredRole);
      const normalizedProfile = profile
        ? {
            ...profile,
            avatar_url: profile.avatar_url ?? DEFAULT_AVATAR_URL,
            points_balance: profile.points_balance ?? profile.points ?? 0,
            is_subscriber: profile.is_subscriber ?? false,
            subscription_points: profile.subscription_points ?? null,
          }
        : null;

      set({
        session,
        profile: normalizedProfile,
        role: normalizedProfile?.role ?? null,
        loading: false,
        error: normalizedProfile ? null : "Profil konnte nicht geladen werden",
      });

      if (normalizedProfile?.is_subscriber) {
        await get().applySubscriptionBonusIfNeeded();
      }

      return normalizedProfile;
    } catch (error) {
      console.error("Failed to initialize auth", error);
      set({ session, profile: null, role: null, loading: false, error: "Profil konnte nicht geladen werden" });
      return null;
    }
  },
  setRole: async (role) => {
    const state = get();
    if (!state.session?.user?.id) return null;

    const updatedProfile = await updateProfile(state.session.access_token, state.session.user.id, { role });
    set({ profile: updatedProfile, role: updatedProfile?.role ?? role });
    return updatedProfile;
  },
  updateProfile: async (updates) => {
    const state = get();
    if (!state.session?.user?.id) return null;

    const updatedProfile = await updateProfile(state.session.access_token, state.session.user.id, updates);
    if (updatedProfile) {
      set({
        profile: {
          ...updatedProfile,
          avatar_url: updatedProfile.avatar_url ?? DEFAULT_AVATAR_URL,
          points_balance: updatedProfile.points_balance ?? updatedProfile.points ?? state.profile?.points_balance ?? 0,
          is_subscriber: updatedProfile.is_subscriber ?? state.profile?.is_subscriber ?? false,
          subscription_points: updatedProfile.subscription_points ?? state.profile?.subscription_points ?? null,
        },
        role: updatedProfile.role ?? state.role,
      });
    }

    return updatedProfile;
  },
  applyPointChange: async (delta, type, metadata) => {
    const state = get();
    if (!state.session?.user?.id) return state.profile;

    const currentBalance = state.profile?.points_balance ?? state.profile?.points ?? 0;
    const nextBalance = Math.max(0, currentBalance + delta);
    const optimisticProfile = state.profile ? { ...state.profile, points_balance: nextBalance } : null;

    if (optimisticProfile) {
      set({ profile: optimisticProfile });
    }

    try {
      await Promise.all([
        createPointEvent(state.session.access_token, state.session.user.id, { delta, type, metadata }),
        updateProfile(state.session.access_token, state.session.user.id, { points_balance: nextBalance }),
      ]);

      return optimisticProfile;
    } catch (error) {
      console.error("Failed to apply point change", error);
      set({ profile: state.profile });
      return state.profile;
    }
  },
  applySubscriptionBonusIfNeeded: async () => {
    const state = get();
    const userId = state.session?.user?.id;

    if (!userId || !state.profile?.is_subscriber) return state.profile;

    const subscriptionPoints = state.profile.subscription_points ?? 0;
    if (subscriptionPoints <= 0) return state.profile;

    const alreadyReceived = await hasReceivedSubscriptionPointsThisWeek(state.session.access_token, userId);

    if (alreadyReceived) return state.profile;

    return get().applyPointChange(subscriptionPoints, "subscription", { cadence: "weekly" });
  },
  isCreator: () => get().role === "creator",
  isFan: () => get().role === "fan",
}));

export type { UserRole, Profile };

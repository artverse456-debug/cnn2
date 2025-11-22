"use client";

import { createBrowserClient, type SupabaseClient } from "@supabase/ssr";
import type { AuthChangeEvent, Session, User } from "@supabase/supabase-js";

export const SUPABASE_URL =
  process.env.NEXT_PUBLIC_SUPABASE_URL ?? "https://atswonwcyqikechcirwk.supabase.co";
export const SUPABASE_ANON_KEY =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "sb_publishable_YlyeI_BPAKLWtXOjd_j7ow_7ImnTFL0";

function isBrowser() {
  return typeof window !== "undefined";
}

const supabase: SupabaseClient = createBrowserClient(SUPABASE_URL, SUPABASE_ANON_KEY);

export type AuthResponse = { user: User | null; session: Session | null };
export type UserResponse = { data: { user: User | null }; error: Error | null };

function cleanAuthParams(url: URL) {
  url.hash = "";
  const paramsToDelete = ["code", "type"]; // Supabase auth params
  paramsToDelete.forEach((param) => url.searchParams.delete(param));
  window.history.replaceState({}, document.title, url.toString());
}

export const supabaseAuthClient = {
  getClient(): SupabaseClient {
    return supabase;
  },
  async getSession(): Promise<Session | null> {
    const { data, error } = await supabase.auth.getSession();

    if (error) {
      console.error("Failed to get Supabase session", error);
      return null;
    }

    return data.session ?? null;
  },
  onAuthStateChange(callback: (event: AuthChangeEvent, session: Session | null) => void) {
    const { data } = supabase.auth.onAuthStateChange((event, session) => callback(event, session));

    return () => data.subscription.unsubscribe();
  },
  async signUp(email: string, password: string, role: string): Promise<AuthResponse> {
    const emailRedirectTo = isBrowser() ? `${window.location.origin}/auth/callback` : undefined;

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo,
        data: { role },
      },
    });

    if (error) {
      throw error;
    }

    return { user: data.user, session: data.session };
  },
  async signIn(email: string, password: string): Promise<AuthResponse> {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      throw error;
    }

    if (data.session) {
      const emailConfirmed = data.session.user.email_confirmed_at ?? data.session.user.confirmed_at;
      if (!emailConfirmed) {
        await supabase.auth.signOut();
        throw new Error("Bitte bestätige deine E-Mail. Du kannst dich erst danach einloggen.");
      }
    }

    return { user: data.user, session: data.session };
  },
  async signOut() {
    const { error } = await supabase.auth.signOut();

    if (error) {
      throw error;
    }
  },
  async handleAuthCallbackFromUrl(): Promise<Session | null> {
    if (!isBrowser()) return null;

    const url = new URL(window.location.href);
    const code = url.searchParams.get("code");

    if (!code) return null;

    const { data, error } = await supabase.auth.exchangeCodeForSession(code);

    if (error) {
      console.error("Failed to handle auth callback", error);
      return null;
    }

    cleanAuthParams(url);
    return data.session ?? null;
  },
  async getUser(): Promise<UserResponse> {
    const { data, error } = await supabase.auth.getUser();

    if (error) {
      return { data: { user: null }, error: error as Error };
    }

    return { data: { user: data.user ?? null }, error: null };
  },
};

export function clearStoredSession() {
  supabase.auth.signOut();
}

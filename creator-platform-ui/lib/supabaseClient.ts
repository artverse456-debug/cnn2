"use client";

import { createBrowserClient } from "@supabase/ssr";
import type { AuthChangeEvent, Session, User } from "@supabase/supabase-js";

export const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
export const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "";

export const supabase = createBrowserClient(SUPABASE_URL, SUPABASE_ANON_KEY);

const emailRedirectTo = `${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback`;

function hasAuthParams(url: URL) {
  return (
    Boolean(url.searchParams.get("code")) ||
    Boolean(url.searchParams.get("access_token")) ||
    Boolean(url.searchParams.get("refresh_token"))
  );
}

function cleanAuthParams(url: URL) {
  const paramsToDelete = ["code", "type", "access_token", "refresh_token", "expires_in", "token_type"];
  paramsToDelete.forEach((param) => url.searchParams.delete(param));
  window.history.replaceState({}, document.title, url.toString());
}

export type AuthSession = Session;
export type AuthUser = User;
export type AuthResponse = { user: User | null; session: Session | null };
export type AuthChangeHandler = (event: AuthChangeEvent, session: Session | null) => void;

export const supabaseAuthClient = {
  async signUp(email: string, password: string, role: string): Promise<AuthResponse> {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo,
        data: { role },
      },
    });

    if (error) throw error;

    return { user: data.user, session: data.session };
  },
  async signInWithPassword(email: string, password: string): Promise<AuthResponse> {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) throw error;

    return { user: data.user, session: data.session };
  },
  async signOut() {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  },
  async getSession(): Promise<Session | null> {
    const { data, error } = await supabase.auth.getSession();

    if (error) throw error;

    return data.session ?? null;
  },
  onAuthStateChange(callback: AuthChangeHandler) {
    const { data } = supabase.auth.onAuthStateChange((event, session) => callback(event, session));

    return () => data.subscription.unsubscribe();
  },
  async getUser() {
    const { data, error } = await supabase.auth.getUser();

    if (error) throw error;

    return data;
  },
  async handleAuthCallbackFromUrl(): Promise<Session | null> {
    if (typeof window === "undefined") return null;

    const currentUrl = new URL(window.location.href);

    if (!hasAuthParams(currentUrl)) return null;

    const { data, error } = await supabase.auth.exchangeCodeForSession();

    if (error) {
      console.error("Failed to exchange auth code", error);
      return null;
    }

    cleanAuthParams(currentUrl);

    return data.session ?? null;
  },
};

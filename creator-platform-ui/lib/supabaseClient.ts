"use client";

import { createBrowserClient } from "@supabase/ssr";
import type { AuthChangeEvent, AuthResponse, Session, User } from "@supabase/supabase-js";

export const SUPABASE_URL =
  process.env.NEXT_PUBLIC_SUPABASE_URL ?? "https://atswonwcyqikechcirwk.supabase.co";
export const SUPABASE_ANON_KEY =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "sb_publishable_YlyeI_BPAKLWtXOjd_j7ow_7ImnTFL0";

export const supabase = createBrowserClient(SUPABASE_URL, SUPABASE_ANON_KEY);

export type AuthSession = Session;
export type AuthUser = User;

function getSiteUrl() {
  if (process.env.NEXT_PUBLIC_SITE_URL) return process.env.NEXT_PUBLIC_SITE_URL;
  if (typeof window !== "undefined") return window.location.origin;
  return "";
}

export const supabaseAuthClient = {
  async signUp(email: string, password: string, role: string): Promise<AuthResponse["data"]> {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${getSiteUrl()}/auth/callback`,
        data: { role },
      },
    });

    if (error) throw error;
    return data;
  },

  async signIn(email: string, password: string): Promise<AuthResponse["data"]> {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;
    return data;
  },

  async signOut() {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  },

  async getSession(): Promise<Session | null> {
    const { data, error } = await supabase.auth.getSession();
    if (error) throw error;
    return data.session;
  },

  async exchangeCodeForSession(code?: string): Promise<Session | null> {
    if (typeof window === "undefined") return null;

    const searchParams = new URLSearchParams(window.location.search);
    const verificationCode = code ?? searchParams.get("code");

    if (verificationCode) {
      const { data, error } = await supabase.auth.exchangeCodeForSession({
        code: verificationCode,
      });
      if (error) throw error;

      const cleanedUrl = new URL(window.location.href);
      ["code", "type"].forEach((param) => cleanedUrl.searchParams.delete(param));
      window.history.replaceState({}, document.title, cleanedUrl.toString());

      return data.session;
    }

    return this.getSession();
  },

  async getProfile() {
    const session = await this.getSession();
    const userId = session?.user?.id;
    if (!session || !userId) return null;

    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", userId)
      .single();

    if (error) throw error;
    return data;
  },

  onAuthStateChange(callback: (event: AuthChangeEvent, session: Session | null) => void) {
    const { data } = supabase.auth.onAuthStateChange((event, session) => {
      callback(event, session);
    });

    return () => data?.subscription.unsubscribe();
  },
};

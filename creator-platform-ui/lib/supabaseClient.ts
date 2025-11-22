"use client";

import { createBrowserClient } from "@supabase/ssr";
import type { AuthChangeEvent, Session, User } from "@supabase/supabase-js";

const SUPABASE_URL =
  process.env.NEXT_PUBLIC_SUPABASE_URL ?? "https://atswonwcyqikechcirwk.supabase.co";
const SUPABASE_ANON_KEY =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "sb_publishable_YlyeI_BPAKLWtXOjd_j7ow_7ImnTFL0";

let browserClient: ReturnType<typeof createBrowserClient> | null = null;

export function getSupabaseBrowserClient() {
  if (!browserClient) {
    browserClient = createBrowserClient(SUPABASE_URL, SUPABASE_ANON_KEY);
  }

  return browserClient;
}

function cleanAuthParamsFromUrl(url: URL) {
  url.searchParams.delete("code");
  url.searchParams.delete("state");
  url.hash = "";
  window.history.replaceState({}, document.title, url.toString());
}

type AuthResult = { session: Session | null; user: User | null };

type AuthChangeCallback = (event: AuthChangeEvent, session: Session | null) => void;

export const supabaseAuthClient = {
  getClient: getSupabaseBrowserClient,
  async getSession(): Promise<Session | null> {
    const supabase = getSupabaseBrowserClient();
    const { data, error } = await supabase.auth.getSession();

    if (error) {
      console.error("Failed to fetch Supabase session", error);
      return null;
    }

    return data.session;
  },
  onAuthStateChange(callback: AuthChangeCallback) {
    const supabase = getSupabaseBrowserClient();
    const { data } = supabase.auth.onAuthStateChange((event, session) => {
      callback(event, session);
    });

    return () => data.subscription.unsubscribe();
  },
  async signUp(email: string, password: string, role: string): Promise<AuthResult> {
    const supabase = getSupabaseBrowserClient();
    const redirectTo = typeof window !== "undefined" ? `${window.location.origin}/auth/callback` : undefined;

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: redirectTo,
        data: { role }
      }
    });

    if (error) {
      throw new Error(error.message);
    }

    return { session: data.session, user: data.user };
  },
  async signIn(email: string, password: string): Promise<AuthResult> {
    const supabase = getSupabaseBrowserClient();
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      throw new Error(error.message);
    }

    return { session: data.session, user: data.user };
  },
  async signOut() {
    const supabase = getSupabaseBrowserClient();
    const { error } = await supabase.auth.signOut();

    if (error) {
      throw new Error(error.message);
    }
  },
  async handleAuthCallbackFromUrl(): Promise<Session | null> {
    if (typeof window === "undefined") return null;

    const supabase = getSupabaseBrowserClient();
    const currentUrl = new URL(window.location.href);
    const code = currentUrl.searchParams.get("code");
    const hashParams = new URLSearchParams(currentUrl.hash.replace(/^#/, ""));
    const accessToken = hashParams.get("access_token");
    const refreshToken = hashParams.get("refresh_token");

    if (code) {
      const { data, error } = await supabase.auth.exchangeCodeForSession(code);
      if (error) {
        console.error("Failed to exchange code for session", error);
        return null;
      }

      cleanAuthParamsFromUrl(currentUrl);
      return data.session;
    }

    if (accessToken && refreshToken) {
      const { data, error } = await supabase.auth.setSession({ access_token: accessToken, refresh_token: refreshToken });
      if (error) {
        console.error("Failed to set Supabase session from URL", error);
        return null;
      }

      cleanAuthParamsFromUrl(currentUrl);
      return data.session;
    }

    return supabaseAuthClient.getSession();
  }
};

export type AuthSession = Session;
export type AuthUser = User;

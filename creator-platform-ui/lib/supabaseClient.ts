"use client";

export const SUPABASE_URL =
  process.env.NEXT_PUBLIC_SUPABASE_URL ?? "https://atswonwcyqikechcirwk.supabase.co";
export const SUPABASE_ANON_KEY =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "sb_publishable_YlyeI_BPAKLWtXOjd_j7ow_7ImnTFL0";

function getProjectRef() {
  try {
    return new URL(SUPABASE_URL).hostname.split(".")[0];
  } catch (error) {
    console.error("Invalid Supabase URL", error);
    return null;
  }
}

const PROJECT_REF = getProjectRef();
const AUTH_STORAGE_KEY = PROJECT_REF ? `sb-${PROJECT_REF}-auth-token` : "supabase-auth-token";

export type AuthUser = {
  id?: string;
  email?: string;
  email_confirmed_at?: string | null;
  user_metadata?: Record<string, unknown>;
};

export type AuthSession = {
  access_token: string;
  refresh_token: string;
  expires_in?: number;
  expires_at?: number;
  token_type?: string;
  user: AuthUser;
};

export type AuthResponse = {
  user: AuthUser | null;
  session: AuthSession | null;
};

export type UserResponse = {
  data: { user: AuthUser | null };
  error: Error | null;
};

export type AuthChangeEvent = "SIGNED_IN" | "SIGNED_OUT" | "TOKEN_REFRESHED" | "USER_UPDATED";

type AuthChangeCallback = (event: AuthChangeEvent, session: AuthSession | null) => void;

function isBrowser() {
  return typeof window !== "undefined";
}

function calculateExpiresAt(session: AuthSession | null) {
  if (!session) return null;
  if (session.expires_at) return session.expires_at;
  if (session.expires_in) return Math.floor(Date.now() / 1000) + session.expires_in;
  return null;
}

function persistSession(session: AuthSession | null, event: AuthChangeEvent = "USER_UPDATED") {
  if (!isBrowser()) return;

  if (session) {
    const expires_at = calculateExpiresAt(session);
    const stored = { currentSession: session, expires_at };
    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(stored));
  } else {
    localStorage.removeItem(AUTH_STORAGE_KEY);
  }

  const authEvent = new CustomEvent<{ session: AuthSession | null; event: AuthChangeEvent }>("supabase-auth-changed", {
    detail: { session, event }
  });
  window.dispatchEvent(authEvent);
}

function getStoredSession(): AuthSession | null {
  if (!isBrowser()) return null;

  const raw = localStorage.getItem(AUTH_STORAGE_KEY);
  if (!raw) return null;

  try {
    const parsed = JSON.parse(raw);
    return parsed?.currentSession ?? null;
  } catch (error) {
    console.error("Failed to parse stored Supabase session", error);
    return null;
  }
}

async function request<T>(path: string, options: RequestInit): Promise<T> {
  const response = await fetch(`${SUPABASE_URL}${path}`, {
    ...options,
    headers: {
      apikey: SUPABASE_ANON_KEY,
      "Content-Type": "application/json",
      ...(options.headers ?? {})
    }
  });

  const text = await response.text();

  if (!response.ok) {
    throw new Error(text || "Supabase request failed");
  }

  if (!text) {
    return {} as T;
  }

  return JSON.parse(text) as T;
}

function getRedirectUrl(path: string) {
  if (!isBrowser()) return null;

  try {
    const url = new URL(path, window.location.origin);
    return url.toString();
  } catch (error) {
    console.error("Invalid redirect URL", error);
    return null;
  }
}

async function fetchUserByAccessToken(accessToken: string): Promise<AuthUser | null> {
  try {
    const user = await request<AuthUser>(`/auth/v1/user`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    });

    return user ?? null;
  } catch (error) {
    console.error("Failed to fetch Supabase user", error);
    return null;
  }
}

function extractSessionFromUrl(urlString: string): {
  access_token?: string | null;
  refresh_token?: string | null;
  expires_in?: number;
  token_type?: string | null;
} {
  const url = new URL(urlString);
  const hashParams = new URLSearchParams(url.hash.replace(/^#/, ""));
  const searchParams = url.searchParams;
  const params = hashParams.get("access_token") ? hashParams : searchParams;

  const access_token = params.get("access_token");
  const refresh_token = params.get("refresh_token");
  const expires_in = params.get("expires_in");
  const token_type = params.get("token_type");

  return {
    access_token,
    refresh_token,
    expires_in: expires_in ? Number(expires_in) : undefined,
    token_type
  };
}

function cleanAuthParams(urlString: string) {
  const url = new URL(urlString);
  url.hash = "";
  const paramsToDelete = ["access_token", "refresh_token", "expires_in", "token_type", "type"]; 
  paramsToDelete.forEach((param) => url.searchParams.delete(param));
  window.history.replaceState({}, document.title, url.toString());
}

export const supabaseAuthClient = {
  getSession(): AuthSession | null {
    return getStoredSession();
  },
  onAuthStateChange(callback: AuthChangeCallback) {
    if (!isBrowser()) return () => undefined;

    const handler = (event: Event) => {
      const customEvent = event as CustomEvent<{ session: AuthSession | null; event: AuthChangeEvent }>;
      callback(customEvent.detail?.event ?? "USER_UPDATED", customEvent.detail?.session ?? null);
    };

    window.addEventListener("supabase-auth-changed", handler);

    return () => window.removeEventListener("supabase-auth-changed", handler);
  },
  async signUp(email: string, password: string, role: string): Promise<AuthResponse> {
    const redirectTo = getRedirectUrl("/auth/callback");
    const result = await request<AuthResponse>(`/auth/v1/signup${redirectTo ? `?redirect_to=${encodeURIComponent(redirectTo)}` : ""}`, {
      method: "POST",
      body: JSON.stringify({ email, password, data: { role } })
    });

    // Session should not be persisted here to avoid auto-login before email confirmation
    return result;
  },
  async signIn(email: string, password: string): Promise<AuthResponse> {
    const result = await request<AuthResponse>(`/auth/v1/token?grant_type=password`, {
      method: "POST",
      body: JSON.stringify({ email, password })
    });

    if (result.session) {
      const user = result.session.user as (AuthUser & { confirmed_at?: string | null }) | undefined;
      const emailConfirmed = user?.email_confirmed_at ?? user?.confirmed_at;

      if (!emailConfirmed) {
        persistSession(null, "SIGNED_OUT");
        throw new Error("Bitte bestätige deine E-Mail. Du kannst dich erst danach einloggen.");
      }

      persistSession(result.session, "SIGNED_IN");
    }

    return result;
  },
  async signOut() {
    const session = getStoredSession();
    if (!session) {
      persistSession(null, "SIGNED_OUT");
      return;
    }

    await request(`/auth/v1/logout`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${session.access_token}`
      }
    });

    persistSession(null, "SIGNED_OUT");
  },
  async handleAuthCallbackFromUrl(): Promise<AuthSession | null> {
    if (!isBrowser()) return null;

    const { access_token, refresh_token, expires_in, token_type } = extractSessionFromUrl(window.location.href);

    if (!access_token || !refresh_token) return null;

    const user = await fetchUserByAccessToken(access_token);
    const session: AuthSession = {
      access_token,
      refresh_token,
      expires_in,
      token_type: token_type ?? "bearer",
      user: user ?? {}
    };

    persistSession(session, "SIGNED_IN");
    cleanAuthParams(window.location.href);

    return session;
  },
  async getUser(): Promise<UserResponse> {
    const session = getStoredSession();

    if (!session) {
      return { data: { user: null }, error: null };
    }

    try {
      const user = await request<AuthUser>(`/auth/v1/user`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${session.access_token}`
        }
      });

      return { data: { user }, error: null };
    } catch (error) {
      console.error("Failed to fetch Supabase user", error);
      return { data: { user: null }, error: error as Error };
    }
  }
};

export function clearStoredSession() {
  persistSession(null, "SIGNED_OUT");
}

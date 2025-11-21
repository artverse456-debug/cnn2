"use client";

const SUPABASE_URL =
  process.env.NEXT_PUBLIC_SUPABASE_URL ?? "https://atswonwcyqikechcirwk.supabase.co";
const SUPABASE_ANON_KEY =
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

type AuthChangeCallback = (session: AuthSession | null) => void;

function isBrowser() {
  return typeof window !== "undefined";
}

function calculateExpiresAt(session: AuthSession | null) {
  if (!session) return null;
  if (session.expires_at) return session.expires_at;
  if (session.expires_in) return Math.floor(Date.now() / 1000) + session.expires_in;
  return null;
}

function persistSession(session: AuthSession | null) {
  if (!isBrowser()) return;

  if (session) {
    const expires_at = calculateExpiresAt(session);
    const stored = { currentSession: session, expires_at };
    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(stored));
  } else {
    localStorage.removeItem(AUTH_STORAGE_KEY);
  }

  const event = new CustomEvent<AuthSession | null>("supabase-auth-changed", {
    detail: session
  });
  window.dispatchEvent(event);
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

export const supabaseAuthClient = {
  getSession(): AuthSession | null {
    return getStoredSession();
  },
  onAuthStateChange(callback: AuthChangeCallback) {
    if (!isBrowser()) return () => undefined;

    const handler = (event: Event) => {
      const customEvent = event as CustomEvent<AuthSession | null>;
      callback(customEvent.detail ?? null);
    };

    window.addEventListener("supabase-auth-changed", handler);

    return () => window.removeEventListener("supabase-auth-changed", handler);
  },
  async signUp(email: string, password: string, role: string): Promise<AuthResponse> {
    const result = await request<AuthResponse>(`/auth/v1/signup`, {
      method: "POST",
      body: JSON.stringify({ email, password, data: { role } })
    });

    if (result.session) {
      persistSession(result.session);
    }

    return result;
  },
  async signIn(email: string, password: string): Promise<AuthResponse> {
    const result = await request<AuthResponse>(`/auth/v1/token?grant_type=password`, {
      method: "POST",
      body: JSON.stringify({ email, password })
    });

    if (result.session) {
      persistSession(result.session);
    }

    return result;
  },
  async signOut() {
    const session = getStoredSession();
    if (!session) {
      persistSession(null);
      return;
    }

    await request(`/auth/v1/logout`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${session.access_token}`
      }
    });

    persistSession(null);
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
  persistSession(null);
}

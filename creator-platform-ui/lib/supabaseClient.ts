"use client";

import { createBrowserClient } from "@supabase/ssr";
import type { AuthChangeEvent, Session, User } from "@supabase/supabase-js";

export const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "https://atswonwcyqikechcirwk.supabase.co";
export const SUPABASE_ANON_KEY =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "sb_publishable_YlyeI_BPAKLWtXOjd_j7ow_7ImnTFL0";

export const supabaseBrowserClient = createBrowserClient(SUPABASE_URL, SUPABASE_ANON_KEY);

export type AuthSession = Session;
export type AuthUser = User;
export type AuthChangeHandler = (event: AuthChangeEvent, session: Session | null) => void;

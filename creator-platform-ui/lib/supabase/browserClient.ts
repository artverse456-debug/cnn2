"use client";

import { createBrowserClient, type SupabaseClient } from "@supabase/ssr";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "https://atswonwcyqikechcirwk.supabase.co";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "sb_publishable_YlyeI_BPAKLWtXOjd_j7ow_7ImnTFL0";

let client: SupabaseClient | null = null;

export function getSupabaseBrowserClient() {
  if (!client) {
    client = createBrowserClient(supabaseUrl, supabaseAnonKey, {
      cookieOptions: {
        sameSite: "lax",
        secure: true
      }
    });
  }

  return client;
}

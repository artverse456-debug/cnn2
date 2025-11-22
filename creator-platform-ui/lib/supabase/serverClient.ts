import { cookies } from "next/headers";
import { createServerClient, type CookieOptions, type SupabaseClient } from "@supabase/ssr";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "https://atswonwcyqikechcirwk.supabase.co";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "sb_publishable_YlyeI_BPAKLWtXOjd_j7ow_7ImnTFL0";

export function createSupabaseServerClient(): SupabaseClient {
  const cookieStore = cookies();

  return createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      get(name: string) {
        return cookieStore.get(name)?.value;
      },
      set(name: string, value: string, options: CookieOptions) {
        try {
          cookieStore.set({
            name,
            value,
            ...options,
            httpOnly: true,
            secure: true,
            sameSite: "lax"
          });
        } catch (error) {
          console.error("Failed to set auth cookie", error);
        }
      },
      remove(name: string, options: CookieOptions) {
        try {
          cookieStore.delete({
            name,
            ...options
          });
        } catch (error) {
          console.error("Failed to remove auth cookie", error);
        }
      }
    }
  });
}

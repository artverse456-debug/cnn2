import { createClient, SupabaseClient } from "@supabase/supabase-js";
import { SUPABASE_ANON_KEY, SUPABASE_SERVICE_ROLE_KEY, SUPABASE_URL } from "./env";

let adminClient: SupabaseClient | null = null;

export function getSupabaseAdminClient() {
  if (!adminClient) {
    const serviceRoleKey = SUPABASE_SERVICE_ROLE_KEY ?? SUPABASE_ANON_KEY;
    adminClient = createClient(SUPABASE_URL, serviceRoleKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    });
  }

  return adminClient;
}

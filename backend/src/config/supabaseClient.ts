import type { Database } from "@repo/types";
import { createClient, type SupabaseClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabaseKey = supabaseServiceRoleKey ?? process.env.SUPABASE_KEY;

const authOptions = {
  persistSession: false,
  autoRefreshToken: false,
} as const;

if (!supabaseUrl || !supabaseKey) {
  throw new Error(
    "Missing SUPABASE_URL and a SUPABASE_KEY (or SUPABASE_SERVICE_ROLE_KEY) for backend access.",
  );
}

/** Server client for database operations (use service role key in production). */
export const supabase = createClient<Database>(supabaseUrl, supabaseKey, {
  auth: authOptions,
});

let adminClient: SupabaseClient<Database> | null = null;

/**
 * Client for Auth Admin API (createUser, deleteUser).
 * Requires SUPABASE_SERVICE_ROLE_KEY — the anon key will return 401.
 */
export function getSupabaseAdmin(): SupabaseClient<Database> {
  if (!supabaseUrl || !supabaseServiceRoleKey) {
    throw new Error(
      "SUPABASE_SERVICE_ROLE_KEY is required for admin auth operations. " +
        "Add it from Supabase Dashboard → Project Settings → API → service_role (secret).",
    );
  }

  adminClient ??= createClient<Database>(supabaseUrl, supabaseServiceRoleKey, {
    auth: authOptions,
  });

  return adminClient;
}

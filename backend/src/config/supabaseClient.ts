import type { Database } from "@repo/types";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;

if (!supabaseUrl || !supabaseKey) {
  throw new Error(
    "Missing SUPABASE_URL or SUPABASE_KEY environment variables.",
  );
}

export const supabase = createClient<Database>(supabaseUrl, supabaseKey);

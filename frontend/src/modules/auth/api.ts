import type { AuthError } from "@supabase/supabase-js";

import { supabase } from "@/lib/supabaseClient";

export type AuthPayload = {
  email: string;
  password: string;
};

function mapAuthError(error: AuthError | null) {
  return error?.message ?? "Wystapil blad uwierzytelniania.";
}

export async function signInWithPassword(payload: AuthPayload) {
  const { data, error } = await supabase.auth.signInWithPassword(payload);
  if (error) {
    throw new Error(mapAuthError(error));
  }
  return data;
}

export async function signUpWithPassword(payload: AuthPayload) {
  const { data, error } = await supabase.auth.signUp(payload);
  console.log("error", error);
  if (error) {
    throw new Error(mapAuthError(error));
  }
  return data;
}

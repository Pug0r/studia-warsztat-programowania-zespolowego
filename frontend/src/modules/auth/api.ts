import type { AuthError } from "@supabase/supabase-js";

import { logAuthAuditEventBestEffort } from "@/modules/audit/api";
import { supabase } from "@/lib/supabaseClient";

export type AuthPayload = {
  email: string;
  password: string;
};

function mapAuthError(error: AuthError | null) {
  return error?.message ?? "Wystapil blad uwierzytelniania.";
}

export async function signInWithPassword(payload: AuthPayload) {
  if (!supabase) {
    throw new Error("Supabase is not configured.");
  }

  const { data, error } = await supabase.auth.signInWithPassword(payload);
  if (error) {
    throw new Error(mapAuthError(error));
  }

  logAuthAuditEventBestEffort("auth.sign_in", {
    email: payload.email,
    provider: "password",
  });

  return data;
}

export async function signUpWithPassword(payload: AuthPayload) {
  if (!supabase) {
    throw new Error("Supabase is not configured.");
  }

  const { data, error } = await supabase.auth.signUp(payload);
  if (error) {
    throw new Error(mapAuthError(error));
  }

  logAuthAuditEventBestEffort("auth.sign_up", {
    confirmation_required: !data.session,
    email: payload.email,
    provider: "password",
  });

  return data;
}

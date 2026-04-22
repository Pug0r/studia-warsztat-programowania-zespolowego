import type { AuthError } from "@supabase/supabase-js";

import { logAuthAuditEvent } from "@/modules/audit/api";
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

  await logAuthAuditEvent("auth.sign_in", {
    email: payload.email,
    provider: "password",
  }).catch((auditError) => {
    console.error("Failed to log sign-in audit event.", auditError);
  });

  return data;
}

export async function signUpWithPassword(payload: AuthPayload) {
  const { data, error } = await supabase.auth.signUp(payload);
  if (error) {
    throw new Error(mapAuthError(error));
  }

  await logAuthAuditEvent("auth.sign_up", {
    confirmation_required: !data.session,
    email: payload.email,
    provider: "password",
  }).catch((auditError) => {
    console.error("Failed to log sign-up audit event.", auditError);
  });

  return data;
}

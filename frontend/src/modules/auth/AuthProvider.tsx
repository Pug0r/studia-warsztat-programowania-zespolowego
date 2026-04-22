import { type Session } from "@supabase/supabase-js";
import { useEffect, useMemo, useState, type ReactNode } from "react";

import { logAuthAuditEvent } from "@/modules/audit/api";
import { supabase } from "@/lib/supabaseClient";
import type { AuthContextValue } from "./types";
import { AuthContext } from "./hooks/AuthContext";

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    async function loadSession() {
      const { data } = await supabase.auth.getSession();
      if (!mounted) return;
      setSession(data.session ?? null);
      setIsLoading(false);
    }

    loadSession();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, currentSession) => {
      setSession(currentSession);
      setIsLoading(false);
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      session,
      isAuthenticated: Boolean(session),
      isLoading,
      signOut: async () => {
        if (session?.user) {
          await logAuthAuditEvent("auth.sign_out", {
            email: session.user.email ?? null,
          }).catch((auditError) => {
            console.error("Failed to log sign-out audit event.", auditError);
          });
        }

        await supabase.auth.signOut();
      },
    }),
    [isLoading, session],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

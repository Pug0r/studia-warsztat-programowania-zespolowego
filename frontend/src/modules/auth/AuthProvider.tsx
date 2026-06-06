import { type Session } from "@supabase/supabase-js";
import { useEffect, useMemo, useState, type ReactNode } from "react";

import { logAuthAuditEventBestEffort } from "@/modules/audit/api";
import { queryClient } from "@/app/queryClient";
import { supabase } from "@/lib/supabaseClient";
import type { AuthContextValue } from "./types";
import { AuthContext } from "./hooks/AuthContext";

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(Boolean(supabase));

  useEffect(() => {
    let mounted = true;
    if (!supabase) {
      return () => {
        mounted = false;
      };
    }

    const client = supabase;

    async function loadSession() {
      const { data } = await client.auth.getSession();
      if (!mounted) return;
      setSession(data.session ?? null);
      setIsLoading(false);
    }

    loadSession();

    const {
      data: { subscription },
    } = client.auth.onAuthStateChange((_event, currentSession) => {
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
          logAuthAuditEventBestEffort("auth.sign_out", {
            email: session.user.email ?? null,
          });
        }

        if (supabase) {
          await supabase.auth.signOut();
        }

        queryClient.clear();
      },
    }),
    [isLoading, session],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

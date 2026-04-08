import { type Session } from "@supabase/supabase-js";

export type AuthContextValue = {
  session: Session | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  signOut: () => Promise<void>;
};

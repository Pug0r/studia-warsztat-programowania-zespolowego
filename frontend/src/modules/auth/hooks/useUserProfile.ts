import { useQuery } from "@tanstack/react-query";

import { supabase } from "@/lib/supabaseClient";
import type { Tables } from "@repo/types";
import { useAuth } from "./useAuth";

export type UserProfile = Tables<"profiles">;

export const useUserProfile = () => {
  const { session, isAuthenticated, isLoading: isAuthLoading } = useAuth();
  const userId = session?.user?.id;

  const query = useQuery<UserProfile, Error>({
    queryKey: ["user-profile", userId],
    queryFn: async () => {
      if (!supabase || !userId) {
        throw new Error("Cannot load user profile.");
      }

      const { data, error } = await supabase
        .from("profiles")
        .select("id, email, role, created_at")
        .eq("id", userId)
        .single();

      if (error) {
        throw new Error(error.message);
      }

      return data;
    },
    enabled: isAuthenticated && Boolean(userId) && Boolean(supabase),
    staleTime: 60 * 1000,
  });

  return {
    profile: query.data,
    role: query.data?.role,
    isLoading: isAuthLoading || query.isLoading,
    error: query.error,
  };
};

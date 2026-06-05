import { useQuery } from "@tanstack/react-query";
import { getUserByIdRequest } from "../api/administrationApi";
import type { UserProfile } from "../types/Users";

export const useUser = (id: string | null, options?: { enabled?: boolean }) => {
  return useQuery<UserProfile, Error>({
    queryKey: ["administration", "user", id],
    queryFn: async () => {
      if (!id) {
        throw new Error("User id is required.");
      }
      return getUserByIdRequest(id);
    },
    enabled: Boolean(id) && (options?.enabled ?? true),
    staleTime: 30 * 1000,
  });
};

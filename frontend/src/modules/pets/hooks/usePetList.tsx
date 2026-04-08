import { useQuery } from "@tanstack/react-query";
import type { Pet } from "../types/Pets";
import { getPetListRequest } from "../api/petsApi";

export const usePetList = (options?: { enabled?: boolean }) => {
  return useQuery<Pet[], Error>({
    queryKey: ["get_pet_list"],
    queryFn: async () => getPetListRequest(),
    staleTime: 30 * 1000,
    refetchInterval: 1000 * 60 * 30,
    enabled: options?.enabled ?? true,
  });
};

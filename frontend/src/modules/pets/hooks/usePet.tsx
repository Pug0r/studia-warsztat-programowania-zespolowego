import { useQuery } from "@tanstack/react-query";
import type { Pet } from "../types/Pets";
import { getPetByIdRequest } from "../api/petsApi";

export const usePet = (
  id: number,
  options?: { enabled?: boolean; initialData?: Pet },
) => {
  return useQuery<Pet, Error>({
    queryKey: ["get_pet", id],
    queryFn: async () => getPetByIdRequest(id),
    staleTime: 30 * 1000,
    refetchInterval: 1000 * 60 * 30,
    enabled: options?.enabled ?? true,
    initialData: options?.initialData,
  });
};

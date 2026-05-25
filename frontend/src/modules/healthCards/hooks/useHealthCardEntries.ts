import { useQuery } from "@tanstack/react-query";
import type { HealthCardEntry } from "../types/HealthCard";
import { listHealthCardEntries } from "../api/healthCardsApi";

export const healthCardEntriesQueryKey = (petId: number) => [
  "health_card_entries",
  petId,
];

export const useHealthCardEntries = (
  petId: number,
  options?: { enabled?: boolean },
) => {
  return useQuery<HealthCardEntry[], Error>({
    queryKey: healthCardEntriesQueryKey(petId),
    queryFn: () => listHealthCardEntries(petId),
    staleTime: 30 * 1000,
    enabled: options?.enabled ?? (Number.isFinite(petId) && petId > 0),
  });
};

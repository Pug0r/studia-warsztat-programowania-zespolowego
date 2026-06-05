import { useMutation, useQueryClient } from "@tanstack/react-query";
import type {
  HealthCardEntry,
  HealthCardEntryPayload,
} from "../types/HealthCard";
import {
  createHealthCardEntry,
  deleteHealthCardEntry,
  updateHealthCardEntry,
} from "../api/healthCardsApi";
import { healthCardEntriesQueryKey } from "./useHealthCardEntries";

export const useCreateHealthCardEntry = (petId: number) => {
  const queryClient = useQueryClient();

  return useMutation<HealthCardEntry, Error, HealthCardEntryPayload>({
    mutationFn: (payload) => createHealthCardEntry(petId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: healthCardEntriesQueryKey(petId),
      });
    },
  });
};

export const useUpdateHealthCardEntry = (petId: number) => {
  const queryClient = useQueryClient();

  return useMutation<
    HealthCardEntry,
    Error,
    { entryId: number; payload: Partial<HealthCardEntryPayload> }
  >({
    mutationFn: ({ entryId, payload }) =>
      updateHealthCardEntry(entryId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: healthCardEntriesQueryKey(petId),
      });
    },
  });
};

export const useDeleteHealthCardEntry = (petId: number) => {
  const queryClient = useQueryClient();

  return useMutation<void, Error, number>({
    mutationFn: (entryId) => deleteHealthCardEntry(entryId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: healthCardEntriesQueryKey(petId),
      });
    },
  });
};

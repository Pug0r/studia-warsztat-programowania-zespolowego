import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type {
  CreatePetWalkDTO,
  PetWalkPriorityItem,
  PetWalkRow,
  PetWalkUpdate,
  PetWithWalkSummary,
} from "@repo/types";

import {
  deletePetWalkRequest,
  getPetWalkPriorityRequest,
  getPetWalkSummaryRequest,
  getPetWalksRequest,
  recordPetWalkRequest,
  updatePetWalkRequest,
} from "../api/petsApi";

export const WALK_PRIORITY_QUERY_KEY = ["pet_walk_priority"] as const;
export const WALK_SUMMARY_QUERY_KEY = ["pet_walk_summary"] as const;
export const WALK_EVENTS_QUERY_KEY = ["pet_walk_events"] as const;

export const useWalkPriorityDogs = (options?: {
  date?: string;
  enabled?: boolean;
}) => {
  return useQuery<PetWalkPriorityItem[], Error>({
    queryKey: [...WALK_PRIORITY_QUERY_KEY, options?.date],
    queryFn: () => getPetWalkPriorityRequest(options?.date),
    staleTime: 30 * 1000,
    refetchInterval: 1000 * 60 * 15,
    enabled: options?.enabled ?? true,
  });
};

export const useWalkSummary = (options?: { enabled?: boolean }) => {
  return useQuery<PetWithWalkSummary[], Error>({
    queryKey: WALK_SUMMARY_QUERY_KEY,
    queryFn: getPetWalkSummaryRequest,
    staleTime: 30 * 1000,
    refetchInterval: 1000 * 60 * 15,
    enabled: options?.enabled ?? true,
  });
};

export const useWalkEvents = (options?: { enabled?: boolean }) => {
  return useQuery<PetWalkRow[], Error>({
    queryKey: WALK_EVENTS_QUERY_KEY,
    queryFn: getPetWalksRequest,
    staleTime: 30 * 1000,
    refetchInterval: 1000 * 60 * 15,
    enabled: options?.enabled ?? true,
  });
};

export const useRecordPetWalk = () => {
  const queryClient = useQueryClient();

  return useMutation<
    PetWalkRow,
    Error,
    { petId: number; payload: CreatePetWalkDTO }
  >({
    mutationFn: ({ petId, payload }) => recordPetWalkRequest(petId, payload),
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: WALK_PRIORITY_QUERY_KEY }),
        queryClient.invalidateQueries({ queryKey: WALK_SUMMARY_QUERY_KEY }),
        queryClient.invalidateQueries({ queryKey: WALK_EVENTS_QUERY_KEY }),
      ]);
    },
  });
};

export const useUpdatePetWalk = () => {
  const queryClient = useQueryClient();

  return useMutation<
    PetWalkRow,
    Error,
    { walkId: number; payload: PetWalkUpdate }
  >({
    mutationFn: ({ payload, walkId }) => updatePetWalkRequest(walkId, payload),
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: WALK_PRIORITY_QUERY_KEY }),
        queryClient.invalidateQueries({ queryKey: WALK_SUMMARY_QUERY_KEY }),
        queryClient.invalidateQueries({ queryKey: WALK_EVENTS_QUERY_KEY }),
      ]);
    },
  });
};

export const useDeletePetWalk = () => {
  const queryClient = useQueryClient();

  return useMutation<void, Error, number>({
    mutationFn: deletePetWalkRequest,
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: WALK_PRIORITY_QUERY_KEY }),
        queryClient.invalidateQueries({ queryKey: WALK_SUMMARY_QUERY_KEY }),
        queryClient.invalidateQueries({ queryKey: WALK_EVENTS_QUERY_KEY }),
      ]);
    },
  });
};

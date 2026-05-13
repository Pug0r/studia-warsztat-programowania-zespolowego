import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type {
  CreatePetWalkDTO,
  PetWalkPriorityItem,
  PetWalkRow,
  PetWithWalkSummary,
} from "@repo/types";

import {
  cancelWalkRequest,
  getPetWalkPriorityRequest,
  getPetWalkSummaryRequest,
  recordPetWalkRequest,
  getMyWalksRequest,
} from "../api/petsApi";

export const WALK_PRIORITY_QUERY_KEY = ["pet_walk_priority"] as const;
export const WALK_SUMMARY_QUERY_KEY = ["pet_walk_summary"] as const;

export const useWalkPriorityDogs = (options?: { enabled?: boolean }) => {
  return useQuery<PetWalkPriorityItem[], Error>({
    queryKey: WALK_PRIORITY_QUERY_KEY,
    queryFn: getPetWalkPriorityRequest,
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
      ]);
    },
  });
};

export const MY_WALKS_QUERY_KEY = ["my_walks"] as const;

export const useMyWalks = (options?: { enabled?: boolean }) => {
  return useQuery<PetWalkRow[], Error>({
    queryKey: MY_WALKS_QUERY_KEY,
    queryFn: getMyWalksRequest,
    staleTime: 30 * 1000,
    refetchInterval: 1000 * 60 * 5,
    enabled: options?.enabled ?? true,
  });
};

export const useCancelWalk = () => {
  const queryClient = useQueryClient();

  return useMutation<void, Error, number>({
    mutationFn: cancelWalkRequest,
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: MY_WALKS_QUERY_KEY }),
        queryClient.invalidateQueries({ queryKey: WALK_PRIORITY_QUERY_KEY }),
        queryClient.invalidateQueries({ queryKey: WALK_SUMMARY_QUERY_KEY }),
      ]);
    },
  });
};

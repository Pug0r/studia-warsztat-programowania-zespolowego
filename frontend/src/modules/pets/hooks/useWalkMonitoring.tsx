import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type {
  CreatePetWalkDTO,
  PetWalkPriorityItem,
  PetWalkRow,
  PetWithWalkSummary,
} from "@repo/types";

import {
  cancelWalkRequest,
  getMyWalksRequest,
  getPetWalkPriorityRequest,
  getPetWalkSummaryRequest,
  getPetWalksRequest,
  recordPetWalkRequest,
} from "../api/petsApi";
import {
  WALK_PRIORITY_QUERY_KEY,
  WALK_SUMMARY_QUERY_KEY,
  MY_WALKS_QUERY_KEY,
  PET_WALKS_QUERY_KEY,
} from "../constants/walkMonitoringConstants";

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
    queryKey: PET_WALKS_QUERY_KEY,
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
        queryClient.invalidateQueries({ queryKey: MY_WALKS_QUERY_KEY }),
        queryClient.invalidateQueries({ queryKey: PET_WALKS_QUERY_KEY }),
      ]);
    },
  });
};

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

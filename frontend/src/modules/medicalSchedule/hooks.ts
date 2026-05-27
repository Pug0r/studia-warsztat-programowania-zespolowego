import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { CreateMedicalEventDTO, UpdateMedicalEventDTO } from "@repo/types";
import {
  cancelMedicalEvent,
  createMedicalEvent,
  listMedicalEvents,
  listUpcomingMedicalEvents,
  runMedicalReminders,
  updateMedicalEvent,
} from "./api";

export const MEDICAL_EVENTS_QUERY_KEY = ["medical_events"] as const;
export const UPCOMING_MEDICAL_EVENTS_QUERY_KEY = [
  "medical_events",
  "upcoming",
] as const;

export const useMedicalEvents = () =>
  useQuery({
    queryFn: listMedicalEvents,
    queryKey: MEDICAL_EVENTS_QUERY_KEY,
    staleTime: 30 * 1000,
  });

export const useUpcomingMedicalEvents = (enabled = true, days?: number) =>
  useQuery({
    enabled,
    queryFn: () => listUpcomingMedicalEvents(days),
    queryKey: [...UPCOMING_MEDICAL_EVENTS_QUERY_KEY, days],
    staleTime: 30 * 1000,
  });

export const useCreateMedicalEvent = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateMedicalEventDTO) => createMedicalEvent(payload),
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: MEDICAL_EVENTS_QUERY_KEY,
      });
      await queryClient.invalidateQueries({
        queryKey: UPCOMING_MEDICAL_EVENTS_QUERY_KEY,
      });
    },
  });
};

export const useUpdateMedicalEvent = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: number;
      payload: UpdateMedicalEventDTO;
    }) => updateMedicalEvent(id, payload),
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: MEDICAL_EVENTS_QUERY_KEY,
      });
      await queryClient.invalidateQueries({
        queryKey: UPCOMING_MEDICAL_EVENTS_QUERY_KEY,
      });
    },
  });
};

export const useCancelMedicalEvent = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => cancelMedicalEvent(id),
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: MEDICAL_EVENTS_QUERY_KEY,
      });
      await queryClient.invalidateQueries({
        queryKey: UPCOMING_MEDICAL_EVENTS_QUERY_KEY,
      });
    },
  });
};

export const useRunMedicalReminders = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: runMedicalReminders,
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: UPCOMING_MEDICAL_EVENTS_QUERY_KEY,
      });
    },
  });
};

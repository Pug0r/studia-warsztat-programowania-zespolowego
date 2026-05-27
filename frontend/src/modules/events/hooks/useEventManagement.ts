import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createEventRequest,
  deleteEventRequest,
  getAllEventsRequest,
  updateEventRequest,
} from "../api/eventsManagementApi";
import type {
  CalendarEvent,
  CalendarEventInsert,
  CalendarEventUpdate,
} from "@repo/types";

const QUERY_KEY = ["calendar-events-management"];

export const useEventsForManagement = () => {
  return useQuery<CalendarEvent[], Error>({
    queryKey: QUERY_KEY,
    queryFn: getAllEventsRequest,
    staleTime: 30 * 1000,
  });
};

export const useCreateEvent = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CalendarEventInsert) => createEventRequest(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEY });
    },
  });
};

export const useUpdateEvent = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: string;
      payload: CalendarEventUpdate;
    }) => updateEventRequest(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEY });
    },
  });
};

export const useDeleteEvent = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteEventRequest(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEY });
    },
  });
};

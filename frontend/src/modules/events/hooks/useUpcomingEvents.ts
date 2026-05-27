import { useQuery } from "@tanstack/react-query";
import type { CalendarEvent } from "@repo/types";

import { getUpcomingPublicEventsRequest } from "../api/eventsApi";

export const PUBLIC_EVENTS_QUERY_KEY = ["public_events"] as const;

export const useUpcomingEvents = (options?: { enabled?: boolean }) => {
  return useQuery<CalendarEvent[], Error>({
    queryKey: PUBLIC_EVENTS_QUERY_KEY,
    queryFn: getUpcomingPublicEventsRequest,
    staleTime: 5 * 60 * 1000,
    enabled: options?.enabled ?? true,
  });
};

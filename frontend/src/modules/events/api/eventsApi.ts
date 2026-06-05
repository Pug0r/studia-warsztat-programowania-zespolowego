import type { CalendarEvent } from "@repo/types";

import { supabase } from "@/lib/supabaseClient";

export const getUpcomingPublicEventsRequest = async (): Promise<
  CalendarEvent[]
> => {
  if (!supabase) {
    throw new Error("Supabase client is not initialized");
  }

  const { data, error } = await supabase
    .from("calendar_events")
    .select("*")
    .eq("is_public", true)
    .gte("starts_at", new Date().toISOString())
    .order("starts_at", { ascending: true })
    .limit(12);

  if (error) {
    throw new Error(error.message);
  }

  return data ?? [];
};

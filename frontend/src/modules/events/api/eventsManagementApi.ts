import type {
  CalendarEvent,
  CalendarEventInsert,
  CalendarEventUpdate,
} from "@repo/types";
import { supabase } from "@/lib/supabaseClient";

export const getAllEventsRequest = async (): Promise<CalendarEvent[]> => {
  if (!supabase) {
    throw new Error("Supabase client is not initialized");
  }

  const { data, error } = await supabase
    .from("calendar_events")
    .select("*")
    .order("starts_at", { ascending: true });

  if (error) {
    throw new Error(error.message);
  }

  return data ?? [];
};

export const createEventRequest = async (
  payload: CalendarEventInsert,
): Promise<CalendarEvent> => {
  if (!supabase) {
    throw new Error("Supabase client is not initialized");
  }

  const { data, error } = await supabase
    .from("calendar_events")
    .insert([payload])
    .select()
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return data;
};

export const updateEventRequest = async (
  id: string,
  payload: CalendarEventUpdate,
): Promise<CalendarEvent> => {
  if (!supabase) {
    throw new Error("Supabase client is not initialized");
  }

  const { data, error } = await supabase
    .from("calendar_events")
    .update(payload)
    .eq("id", id)
    .select()
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return data;
};

export const deleteEventRequest = async (id: string): Promise<void> => {
  if (!supabase) {
    throw new Error("Supabase client is not initialized");
  }

  const { error } = await supabase
    .from("calendar_events")
    .delete()
    .eq("id", id);

  if (error) {
    throw new Error(error.message);
  }
};

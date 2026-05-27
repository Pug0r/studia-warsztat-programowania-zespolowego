import type { Tables, TablesInsert, TablesUpdate } from "./database.types.js";

export type CalendarEventRow = Tables<"calendar_events">;

export type CalendarEventInsert = TablesInsert<"calendar_events">;

export type CalendarEventUpdate = TablesUpdate<"calendar_events">;

export type CalendarEvent = CalendarEventRow;

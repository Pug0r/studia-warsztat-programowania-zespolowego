import type { TablesInsert, TablesUpdate } from "@repo/types";
import { supabase } from "#config/supabaseClient.js";

export type MedicalEventInsert = TablesInsert<"medical_events">;

export type MedicalEventUpdate = TablesUpdate<"medical_events">;

export type MedicalEventReminderInsert =
  TablesInsert<"medical_event_reminders">;

export const medicalScheduleDb = supabase;

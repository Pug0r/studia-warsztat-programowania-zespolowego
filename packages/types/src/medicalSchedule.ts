export const MEDICAL_EVENT_TYPES = [
  "vaccination",
  "checkup",
  "surgery",
  "other",
] as const;

export const MEDICAL_EVENT_STATUSES = [
  "scheduled",
  "completed",
  "cancelled",
] as const;

export type MedicalEventType = (typeof MEDICAL_EVENT_TYPES)[number];

export type MedicalEventStatus = (typeof MEDICAL_EVENT_STATUSES)[number];

export type MedicalReminderAudienceRole = "admin" | "coordinator";

export type MedicalEventRow = Tables<"medical_events">;

export type MedicalEventReminderRow = Tables<"medical_event_reminders">;

export type CreateMedicalEventDTO = Pick<
  MedicalEventRow,
  "pet_id" | "type" | "title" | "scheduled_at" | "notes"
>;

export type UpdateMedicalEventDTO = Partial<
  Pick<MedicalEventRow, "type" | "title" | "scheduled_at" | "status" | "notes">
>;

export interface MedicalReminderRunResult {
  events: number;
  reminders: number;
}
import type { Tables } from "./database.types.js";

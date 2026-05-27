import type { MedicalEventType } from "@repo/types";

export const MEDICAL_EVENT_TYPE_LABELS: Record<MedicalEventType, string> = {
  checkup: "Check-up",
  other: "Other",
  surgery: "Surgery",
  vaccination: "Vaccination",
};

export const formatMedicalEventDate = (value: string) =>
  new Intl.DateTimeFormat(undefined, {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));

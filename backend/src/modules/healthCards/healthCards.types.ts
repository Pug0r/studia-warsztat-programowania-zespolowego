export const HEALTH_CARD_ENTRY_TYPES = [
  "illness",
  "treatment",
  "medication",
  "vaccination",
  "checkup",
  "other",
] as const;

export type HealthCardEntryType = (typeof HEALTH_CARD_ENTRY_TYPES)[number];

export interface HealthCardEntryRow {
  id: number;
  pet_id: number;
  entry_type: HealthCardEntryType;
  title: string;
  description: string | null;
  medication: string | null;
  treatment_date: string;
  vet_id: string | null;
  vet_email: string | null;
  created_at: string;
  updated_at: string;
}

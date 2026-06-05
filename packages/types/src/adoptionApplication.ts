import type { Tables, TablesInsert, TablesUpdate } from "./database.types.js";

/** Wiersz z tabeli `adoption_applications`. */
export type AdoptionApplicationRow = Tables<"adoption_applications">;

export type AdoptionApplicationInsert = TablesInsert<"adoption_applications">;

export type AdoptionApplicationUpdate = TablesUpdate<"adoption_applications">;

export const ADOPTION_STATUSES = [
  "new",
  "reviewing",
  "accepted",
  "rejected",
] as const;

export type AdoptionStatus = (typeof ADOPTION_STATUSES)[number];

/** Dane wysyłane z formularza adopcyjnego. */
export type CreateAdoptionApplicationDTO = Pick<
  AdoptionApplicationInsert,
  | "pet_id"
  | "full_name"
  | "email"
  | "phone"
  | "city"
  | "housing_type"
  | "has_other_pets"
  | "message"
  | "user_id"
>;

export interface UpdateAdoptionApplicationStatusDTO {
  status: AdoptionStatus;
}

export type AdoptionApplicationWithPetSummary = AdoptionApplicationRow & {
  pet: {
    id: number;
    name: string;
    species: string;
  } | null;
};

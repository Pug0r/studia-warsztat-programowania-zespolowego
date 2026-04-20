import type { Tables, TablesInsert, TablesUpdate } from "./database.types.js";

/** Wiersz z tabeli `adoption_applications`. */
export type AdoptionApplicationRow = Tables<"adoption_applications">;

export type AdoptionApplicationInsert = TablesInsert<"adoption_applications">;

export type AdoptionApplicationUpdate = TablesUpdate<"adoption_applications">;

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

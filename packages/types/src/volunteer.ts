import type { Tables, TablesInsert, TablesUpdate } from "./database.types.js";

export type VolunteerRow = Tables<"volunteers">;

export type VolunteerInsert = TablesInsert<"volunteers">;

export type VolunteerUpdate = TablesUpdate<"volunteers">;

export type CreateVolunteerDTO = Pick<
  VolunteerInsert,
  "full_name" | "email" | "phone"
>;

export type UpdateVolunteerDTO = Pick<
  VolunteerUpdate,
  "full_name" | "email" | "phone"
>;

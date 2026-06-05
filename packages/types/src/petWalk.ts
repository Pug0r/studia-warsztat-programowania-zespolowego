import type { Tables, TablesInsert, TablesUpdate } from "./database.types.js";
import type { PetRow } from "./pet.js";

export type PetWalkRow = Tables<"pet_walks">;

export type PetWalkInsert = TablesInsert<"pet_walks">;

export type PetWalkUpdate = TablesUpdate<"pet_walks">;

export type PetWalk = PetWalkRow;

export type CreatePetWalkDTO = Pick<
  PetWalkInsert,
  "notes" | "walked_at" | "end_at" | "walker_id"
>;

export type PetWithWalkSummary = PetRow & {
  days_since_last_walk: number | null;
  last_walk_at: string | null;
  walk_count: number;
};

export type PetWalkPriorityItem = PetWithWalkSummary & {
  priority_rank: number;
};

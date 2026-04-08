import type { Tables, TablesInsert, TablesUpdate } from "./database.types.js";

/** Wiersz z tabeli `pets` (generowane przez Supabase CLI → nadpisuj `database.types.ts`). */
export type PetRow = Tables<"pets">;

export type PetInsert = TablesInsert<"pets">;

export type PetUpdate = TablesUpdate<"pets">;

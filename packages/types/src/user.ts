import type { Tables, TablesInsert } from "./database.types.js";

/** Wiersz z tabeli `users` (generowane / uzupełniane przy `supabase gen types`). */
export type UserRow = Tables<"users">;

export type UserInsert = TablesInsert<"users">;

/** Pola wymagane przy tworzeniu użytkownika z poziomu API (bez `id` / `created_at`). */
export type CreateUserDTO = Pick<UserInsert, "email" | "name">;

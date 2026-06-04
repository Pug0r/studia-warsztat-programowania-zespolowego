import type { SupabaseClient } from "@supabase/supabase-js";
import { supabase } from "#config/supabaseClient.js";
import type {
  CreateHealthCardEntryDTO,
  HealthCardEntryRow,
  UpdateHealthCardEntryDTO,
} from "./healthCards.types.js";

// The `health_card_entries` table is not yet in the generated `Database`
// type from `@repo/types`. We define a local schema fragment and cast the
// shared supabase client through it so all queries below are fully typed
// without relying on `any`.
interface HealthCardsSchema {
  public: {
    Tables: {
      health_card_entries: {
        Row: HealthCardEntryRow;
        Insert: HealthCardEntryRow;
        Update: Partial<HealthCardEntryRow>;
        Relationships: [];
      };
    };
    Views: Record<never, never>;
    Functions: Record<never, never>;
    Enums: Record<never, never>;
    CompositeTypes: Record<never, never>;
  };
}

const sb = supabase as unknown as SupabaseClient<HealthCardsSchema>;

export const listByPet = async (
  petId: number,
): Promise<HealthCardEntryRow[]> => {
  const { data, error } = await sb
    .from("health_card_entries")
    .select("*")
    .eq("pet_id", petId)
    .order("treatment_date", { ascending: false })
    .order("id", { ascending: false });

  if (error) {
    throw new Error(error.message);
  }

  return data;
};

export const getById = async (
  id: number,
): Promise<HealthCardEntryRow | null> => {
  const { data, error } = await sb
    .from("health_card_entries")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (error) {
    throw new Error(error.message);
  }

  return data;
};

export const create = async (
  petId: number,
  payload: CreateHealthCardEntryDTO,
  vet: { id: string; email: string | null },
): Promise<HealthCardEntryRow> => {
  const { data, error } = await sb
    .from("health_card_entries")
    .insert({
      ...payload,
      pet_id: petId,
      vet_id: vet.id,
      vet_email: vet.email,
    } as HealthCardEntryRow)
    .select("*")
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return data;
};

export const update = async (
  id: number,
  payload: UpdateHealthCardEntryDTO,
): Promise<HealthCardEntryRow> => {
  const { data, error } = await sb
    .from("health_card_entries")
    .update({ ...payload, updated_at: new Date().toISOString() })
    .eq("id", id)
    .select("*")
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return data;
};

export const remove = async (id: number): Promise<void> => {
  const { error } = await sb
    .from("health_card_entries")
    .delete()
    .eq("id", id);

  if (error) {
    throw new Error(error.message);
  }
};

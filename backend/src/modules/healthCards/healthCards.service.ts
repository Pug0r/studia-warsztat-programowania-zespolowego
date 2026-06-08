import type { TablesInsert, TablesUpdate } from "@repo/types";
import { supabase } from "#config/supabaseClient.js";
import type {
  CreateHealthCardEntryDTO,
  HealthCardEntryRow,
  UpdateHealthCardEntryDTO,
} from "./healthCards.types.js";

type HealthCardEntryInsert = TablesInsert<"health_card_entries">;
type HealthCardEntryUpdate = TablesUpdate<"health_card_entries">;

export const listByPet = async (
  petId: number,
): Promise<HealthCardEntryRow[]> => {
  const { data, error } = await supabase
    .from("health_card_entries")
    .select("*")
    .eq("pet_id", petId)
    .order("treatment_date", { ascending: false })
    .order("id", { ascending: false });

  if (error) {
    throw new Error(error.message);
  }

  return data as HealthCardEntryRow[];
};

export const getById = async (
  id: number,
): Promise<HealthCardEntryRow | null> => {
  const { data, error } = await supabase
    .from("health_card_entries")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (error) {
    throw new Error(error.message);
  }

  return data as HealthCardEntryRow | null;
};

export const create = async (
  petId: number,
  payload: CreateHealthCardEntryDTO,
  vet: { id: string; email: string | null },
): Promise<HealthCardEntryRow> => {
  const entry: HealthCardEntryInsert = {
    ...payload,
    pet_id: petId,
    vet_id: vet.id,
    vet_email: vet.email,
  };

  const { data, error } = await supabase
    .from("health_card_entries")
    .insert(entry)
    .select("*")
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return data as HealthCardEntryRow;
};

export const update = async (
  id: number,
  payload: UpdateHealthCardEntryDTO,
): Promise<HealthCardEntryRow> => {
  const entry: HealthCardEntryUpdate = {
    ...payload,
    updated_at: new Date().toISOString(),
  };

  const { data, error } = await supabase
    .from("health_card_entries")
    .update(entry)
    .eq("id", id)
    .select("*")
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return data as HealthCardEntryRow;
};

export const remove = async (id: number): Promise<void> => {
  const { error } = await supabase
    .from("health_card_entries")
    .delete()
    .eq("id", id);

  if (error) {
    throw new Error(error.message);
  }
};

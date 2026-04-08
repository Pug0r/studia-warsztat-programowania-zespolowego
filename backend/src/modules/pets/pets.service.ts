import type { PetInsert, PetRow } from "@repo/types";
import { supabase } from "#config/supabaseClient.js";
import type { CreatePetDTO } from "./pets.validation.js";
import type { Pet } from "@repo/types";

export const list = async (): Promise<Pet[]> => {
  const { data, error } = await supabase
    .from("pets")
    .select("*")
    .order("name", { ascending: true });

  if (error) {
    throw new Error(error.message);
  }

  return data;
};

export const getById = async (id: number): Promise<PetRow | null> => {
  const { data, error } = await supabase
    .from("pets")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (error) {
    throw new Error(error.message);
  }

  return data;
};

export const create = async (payload: CreatePetDTO): Promise<PetRow> => {
  const row: PetInsert = {
    ...payload,
    species: "unknown",
  };

  const { data, error } = await supabase
    .from("pets")
    .insert(row)
    .select("*")
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return data;
};

export const remove = async (id: number): Promise<boolean> => {
  const { error } = await supabase.from("pets").delete().eq("id", id);

  if (error) {
    throw new Error(error.message);
  }

  return true;
};

export { remove as delete };

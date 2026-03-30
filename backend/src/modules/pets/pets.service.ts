import { supabase } from "#config/supabaseClient.js";
import type { CreatePetDTO } from "./pets.validation.js";

export interface Pet {
  id: string;
  name: string;
  age: number;
  weight: number;
  description: string;
}

export const list = async (): Promise<Pet[]> => {
  const { data, error } = await supabase
    .from("pets")
    .select("*")
    .order("name", { ascending: true });

  if (error) {
    throw new Error(error.message);
  }

  return (data ?? []) as Pet[];
};

export const getById = async (id: string): Promise<Pet | null> => {
  const { data, error } = await supabase
    .from("pets")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (error) {
    throw new Error(error.message);
  }

  return (data as Pet | null) ?? null;
};

export const create = async (payload: CreatePetDTO): Promise<Pet> => {
  const { data, error } = await supabase
    .from("pets")
    .insert([payload])
    .select("*")
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return data as Pet;
};

export const remove = async (id: string): Promise<boolean> => {
  const { error } = await supabase.from("pets").delete().eq("id", id);

  if (error) {
    throw new Error(error.message);
  }

  return true;
};

export { remove as delete };

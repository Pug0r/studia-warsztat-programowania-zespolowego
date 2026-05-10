import type {
  CreateVolunteerDTO,
  UpdateVolunteerDTO,
  Volunteer,
  VolunteerInsert,
} from "@repo/types";
import { supabase } from "#config/supabaseClient.js";

export const list = async (): Promise<Volunteer[]> => {
  const { data, error } = await supabase
    .from("volunteers")
    .select("*")
    .order("full_name", { ascending: true });

  if (error) {
    throw new Error(error.message);
  }

  return data;
};

export const getById = async (id: number): Promise<Volunteer | null> => {
  const { data, error } = await supabase
    .from("volunteers")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (error) {
    throw new Error(error.message);
  }

  return data;
};

export const create = async (
  payload: CreateVolunteerDTO,
): Promise<Volunteer> => {
  const row: VolunteerInsert = {
    email: payload.email,
    full_name: payload.full_name,
    phone: payload.phone ?? null,
  };

  const { data, error } = await supabase
    .from("volunteers")
    .insert(row)
    .select("*")
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return data;
};

export const update = async (
  id: number,
  payload: UpdateVolunteerDTO,
): Promise<Volunteer | null> => {
  const { data, error } = await supabase
    .from("volunteers")
    .update(payload)
    .eq("id", id)
    .select("*")
    .maybeSingle();

  if (error) {
    throw new Error(error.message);
  }

  return data;
};

export const remove = async (id: number): Promise<boolean> => {
  const { error } = await supabase.from("volunteers").delete().eq("id", id);

  if (error) {
    throw new Error(error.message);
  }

  return true;
};

export { remove as delete };

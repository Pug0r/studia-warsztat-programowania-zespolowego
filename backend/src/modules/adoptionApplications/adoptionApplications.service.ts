import type {
  AdoptionApplicationRow,
  AdoptionApplicationInsert,
  CreateAdoptionApplicationDTO,
} from "@repo/types";
import { supabase } from "#config/supabaseClient.js";

export const create = async (
  payload: CreateAdoptionApplicationDTO,
): Promise<AdoptionApplicationRow> => {
  const row: AdoptionApplicationInsert = {
    ...payload,
    status: "new",
  };

  const { data, error } = await supabase
    .from("adoption_applications")
    .insert(row)
    .select("*")
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return data;
};

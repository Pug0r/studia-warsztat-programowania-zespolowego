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

export const uploadPhoto = async (
  id: number,
  buffer: Buffer,
  mimetype: string,
): Promise<string> => {
  const ext = mimetype.split("/")[1];
  const path = `${id}/photo.${ext}`;

  const { error: uploadError } = await supabase.storage
    .from("pet-images")
    .upload(path, buffer, { contentType: mimetype, upsert: true });

  if (uploadError) {
    throw new Error(uploadError.message);
  }

  const { data: urlData } = supabase.storage
    .from("pet-images")
    .getPublicUrl(path);

  const imageUrl = urlData.publicUrl;

  const { error: updateError } = await supabase
    .from("pets")
    .update({ image_url: imageUrl })
    .eq("id", id);

  if (updateError) {
    throw new Error(updateError.message);
  }

  return imageUrl;
};

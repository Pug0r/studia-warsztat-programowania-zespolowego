import type {
  AdoptionApplicationWithPetSummary,
  AdoptionApplicationInsert,
  AdoptionApplicationRow,
  AdoptionStatus,
  CreateAdoptionApplicationDTO,
} from "@repo/types";
import { supabase } from "#config/supabaseClient.js";

const adoptionApplicationSelect =
  "id, created_at, pet_id, user_id, full_name, email, phone, city, housing_type, has_other_pets, message, status";

const loadPetsMap = async (petIds: number[]) => {
  if (petIds.length === 0) {
    return new Map<number, { id: number; name: string; species: string }>();
  }

  const { data, error } = await supabase
    .from("pets")
    .select("id, name, species")
    .in("id", petIds);

  if (error) {
    throw new Error(error.message);
  }

  return new Map(data.map((pet) => [pet.id, pet]));
};

const withPetSummary = async (
  applications: AdoptionApplicationRow[],
): Promise<AdoptionApplicationWithPetSummary[]> => {
  const petIds = [
    ...new Set(applications.map((application) => application.pet_id)),
  ];
  const petsMap = await loadPetsMap(petIds);

  return applications.map((application) => ({
    ...application,
    pet: petsMap.get(application.pet_id) ?? null,
  }));
};

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

export const get = async (): Promise<AdoptionApplicationWithPetSummary[]> => {
  const { data, error } = await supabase
    .from("adoption_applications")
    .select(adoptionApplicationSelect)
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error(error.message);
  }

  return withPetSummary(data);
};

export const updateStatus = async (
  id: number,
  status: AdoptionStatus,
): Promise<AdoptionApplicationWithPetSummary | null> => {
  const { data, error } = await supabase
    .from("adoption_applications")
    .update({ status })
    .eq("id", id)
    .select(adoptionApplicationSelect)
    .maybeSingle();

  if (error) {
    throw new Error(error.message);
  }

  if (!data) {
    return null;
  }

  const [application] = await withPetSummary([data]);

  return application;
};

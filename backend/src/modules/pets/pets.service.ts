import type {
  CreatePetWalkDTO,
  PetInsert,
  PetRow,
  PetWalkPriorityItem,
  PetWalkInsert,
  PetWalkRow,
  PetWithWalkSummary,
} from "@repo/types";
import { supabase } from "#config/supabaseClient.js";
import type { CreatePetDTO } from "./pets.validation.js";
import type { Pet } from "@repo/types";

const MS_PER_DAY = 1000 * 60 * 60 * 24;

const getDaysSince = (dateString: string | null): number | null => {
  if (!dateString) {
    return null;
  }

  const diff = Date.now() - new Date(dateString).getTime();
  return Math.max(0, Math.floor(diff / MS_PER_DAY));
};

const compareWalkUrgency = (a: PetWithWalkSummary, b: PetWithWalkSummary) => {
  const aTime = a.last_walk_at
    ? new Date(a.last_walk_at).getTime()
    : Number.NEGATIVE_INFINITY;
  const bTime = b.last_walk_at
    ? new Date(b.last_walk_at).getTime()
    : Number.NEGATIVE_INFINITY;

  if (aTime !== bTime) {
    return aTime - bTime;
  }

  return a.name.localeCompare(b.name);
};

const buildWalkSummaries = (
  pets: Pet[],
  walks: Pick<PetWalkRow, "pet_id" | "walked_at">[],
): PetWithWalkSummary[] => {
  const lastWalkByPet = new Map<number, string>();
  const walkCountByPet = new Map<number, number>();

  for (const walk of walks) {
    walkCountByPet.set(walk.pet_id, (walkCountByPet.get(walk.pet_id) ?? 0) + 1);

    if (!lastWalkByPet.has(walk.pet_id)) {
      lastWalkByPet.set(walk.pet_id, walk.walked_at);
    }
  }

  return pets.map((pet) => {
    const lastWalkAt = lastWalkByPet.get(pet.id) ?? null;

    return {
      ...pet,
      days_since_last_walk: getDaysSince(lastWalkAt),
      last_walk_at: lastWalkAt,
      walk_count: walkCountByPet.get(pet.id) ?? 0,
    };
  });
};

export const list = async (size?: string): Promise<Pet[]> => {
  let query = supabase
    .from("pets")
    .select("*")
    .order("name", { ascending: true });

  if (size) {
    query = query.eq("size", size);
  }

  const { data, error } = await query;

  if (error) {
    throw new Error(error.message);
  }

  return data;
};

export const listWithWalkSummary = async (): Promise<PetWithWalkSummary[]> => {
  const [{ data: pets, error: petsError }, { data: walks, error: walksError }] =
    await Promise.all([
      supabase.from("pets").select("*").order("name", { ascending: true }),
      supabase
        .from("pet_walks")
        .select("pet_id, walked_at")
        .order("walked_at", { ascending: false }),
    ]);

  if (petsError) {
    throw new Error(petsError.message);
  }

  if (walksError) {
    throw new Error(walksError.message);
  }

  return buildWalkSummaries(pets, walks);
};

export const listWalkPriorityDogs = async (): Promise<
  PetWalkPriorityItem[]
> => {
  const summaries = await listWithWalkSummary();

  return summaries.sort(compareWalkUrgency).map((pet, index) => ({
    ...pet,
    priority_rank: index + 1,
  }));
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
  const ext = mimetype.split("/")[1] ?? "jpg";
  const path = `${String(id)}/photo.${ext}`;

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

export const recordWalk = async (
  petId: number,
  payload: CreatePetWalkDTO,
): Promise<PetWalkRow> => {
  const row: PetWalkInsert = {
    pet_id: petId,
    ...payload,
  };

  const { data, error } = await supabase
    .from("pet_walks")
    .insert(row)
    .select("*")
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return data;
};

export const getWalkById = async (
  walkId: number,
): Promise<PetWalkRow | null> => {
  const { data, error } = await supabase
    .from("pet_walks")
    .select("*")
    .eq("id", walkId)
    .maybeSingle();

  if (error) {
    throw new Error(error.message);
  }

  return data;
};

export const cancelWalk = async (walkId: number): Promise<void> => {
  const { error } = await supabase.from("pet_walks").delete().eq("id", walkId);

  if (error) {
    throw new Error(error.message);
  }
};

export const listUpcomingWalks = async (
  walkerId: string,
): Promise<PetWalkRow[]> => {
  const now = new Date().toISOString();

  const { data, error } = await supabase
    .from("pet_walks")
    .select("*")
    .eq("walker_id", walkerId)
    .gt("walked_at", now)
    .order("walked_at", { ascending: true });

  console.log("Query result:", {
    count: data?.length,
    data: data?.map((d) => ({
      id: d.id,
      walked_at: d.walked_at,
      walker_id: d.walker_id,
    })),
    error: error?.message,
  });

  if (error) {
    throw new Error(error.message);
  }

  return data;
};

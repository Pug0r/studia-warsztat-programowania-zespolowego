import type {
  CreatePetWalkDTO,
  PetInsert,
  PetRow,
  PetWalkPriorityItem,
  PetWalkInsert,
  PetWalkRow,
  PetWalkUpdate,
  PetWithWalkSummary,
} from "@repo/types";
import { supabase } from "#config/supabaseClient.js";
import {
  getBlockedPetIdsForWalkDate,
  isPetBlockedForWalk,
} from "#modules/medicalSchedule/medicalSchedule.service.js";
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
  const now = new Date().toISOString();
  const [{ data: pets, error: petsError }, { data: walks, error: walksError }] =
    await Promise.all([
      supabase.from("pets").select("*").order("name", { ascending: true }),
      supabase
        .from("pet_walks")
        .select("pet_id, walked_at")
        .lt("walked_at", now)
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

export const listWalkPriorityDogs = async (
  walkDate: string | Date = new Date(),
): Promise<PetWalkPriorityItem[]> => {
  const summaries = await listWithWalkSummary();
  const blockedPetIds = await getBlockedPetIdsForWalkDate(walkDate);

  return summaries
    .filter((pet) => !blockedPetIds.has(pet.id))
    .sort(compareWalkUrgency)
    .map((pet, index) => ({
      ...pet,
      priority_rank: index + 1,
    }));
};

export const listWalks = async (): Promise<PetWalkRow[]> => {
  const { data, error } = await supabase
    .from("pet_walks")
    .select("*")
    .order("walked_at", { ascending: false });

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

export const checkWalkConflicts = async (
  petId: number,
  walkerId: string | undefined,
  walkedAt: string,
  endAt: string | undefined,
  excludeWalkId?: number,
): Promise<{ hasPetConflict: boolean; hasWalkerConflict: boolean }> => {
  let hasPetConflict = false;
  let hasWalkerConflict = false;

  if (!endAt) {
    return { hasPetConflict, hasWalkerConflict };
  }

  // Check if pet is already booked during this time
  // Using strict inequalities: walk1.end > walk2.start AND walk1.start < walk2.end
  let petQuery = supabase
    .from("pet_walks")
    .select("id")
    .eq("pet_id", petId)
    .lt("walked_at", endAt)
    .gt("end_at", walkedAt);

  if (excludeWalkId) {
    petQuery = petQuery.neq("id", excludeWalkId);
  }

  const { data: petConflicts, error: petError } = await petQuery;

  if (petError) {
    throw new Error(`Error checking pet conflicts: ${petError.message}`);
  }

  hasPetConflict = petConflicts.length > 0;

  // Check if walker is already booked during this time
  if (walkerId) {
    let walkerQuery = supabase
      .from("pet_walks")
      .select("id")
      .eq("walker_id", walkerId)
      .lt("walked_at", endAt)
      .gt("end_at", walkedAt);

    if (excludeWalkId) {
      walkerQuery = walkerQuery.neq("id", excludeWalkId);
    }

    const { data: walkerConflicts, error: walkerError } = await walkerQuery;

    if (walkerError) {
      throw new Error(
        `Error checking walker conflicts: ${walkerError.message}`,
      );
    }

    hasWalkerConflict = walkerConflicts.length > 0;
  }

  return { hasPetConflict, hasWalkerConflict };
};

export const recordWalk = async (
  petId: number,
  payload: CreatePetWalkDTO,
): Promise<PetWalkRow> => {
  const walkedAt = payload.walked_at ?? new Date().toISOString();

  if (await isPetBlockedForWalk(petId, walkedAt)) {
    throw new Error("This pet has a medical procedure scheduled that day.");
  }

  // Check for conflicts if we have end_at
  if (payload.end_at && payload.walked_at) {
    const { hasPetConflict, hasWalkerConflict } = await checkWalkConflicts(
      petId,
      payload.walker_id ?? undefined,
      payload.walked_at,
      payload.end_at,
    );

    if (hasPetConflict) {
      throw new Error(
        "This pet is already reserved for a walk during the selected time.",
      );
    }

    if (hasWalkerConflict) {
      throw new Error(
        "You are already occupied during the selected time. Please choose a different time.",
      );
    }
  }

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

export const getWalkById = async (id: number): Promise<PetWalkRow | null> => {
  const { data, error } = await supabase
    .from("pet_walks")
    .select("*")
    .eq("id", id)
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
    .select("*, pets (name)")
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
  return data ?? [];
};

export const updateWalk = async (
  id: number,
  payload: PetWalkUpdate,
): Promise<PetWalkRow | null> => {
  const existingWalk = await getWalkById(id);

  if (!existingWalk) {
    return null;
  }

  const petId = payload.pet_id ?? existingWalk.pet_id;
  const walkedAt = payload.walked_at ?? existingWalk.walked_at;
  const endAt =
    payload.end_at === undefined ? existingWalk.end_at : payload.end_at;
  const walkerId =
    payload.walker_id === undefined
      ? existingWalk.walker_id
      : payload.walker_id;

  if (await isPetBlockedForWalk(petId, walkedAt)) {
    throw new Error("This pet has a medical procedure scheduled that day.");
  }

  if (endAt) {
    const { hasPetConflict, hasWalkerConflict } = await checkWalkConflicts(
      petId,
      walkerId ?? undefined,
      walkedAt,
      endAt,
      id,
    );

    if (hasPetConflict) {
      throw new Error(
        "This pet is already reserved for a walk during the selected time.",
      );
    }

    if (hasWalkerConflict) {
      throw new Error(
        "The walker is already occupied during the selected time.",
      );
    }
  }

  const { data, error } = await supabase
    .from("pet_walks")
    .update(payload)
    .eq("id", id)
    .select("*")
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return data;
};

export const deleteWalk = async (id: number): Promise<boolean> => {
  const { error } = await supabase.from("pet_walks").delete().eq("id", id);

  if (error) {
    throw new Error(error.message);
  }

  return true;
};

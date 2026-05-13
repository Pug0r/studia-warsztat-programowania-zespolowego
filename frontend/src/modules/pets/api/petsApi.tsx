import type {
  CreatePetWalkDTO,
  PetWalkPriorityItem,
  PetWalkRow,
  PetWithWalkSummary,
  Pet,
} from "@repo/types";

import { supabase } from "@/lib/supabaseClient";

export const getPetListRequest = async (): Promise<Pet[]> => {
  const response = await fetch("/api/pets/");

  if (!response.ok) {
    throw new Error(`Backend error: ${response.status}`);
  }

  const data = await response.json();
  return data;
};

export const getPetByIdRequest = async (id: number): Promise<Pet> => {
  const response = await fetch(`/api/pets/${id}`);

  if (!response.ok) {
    throw new Error(`Backend error: ${response.status}`);
  }

  const data = await response.json();
  return data;
};

export const getPetWalkSummaryRequest = async (): Promise<
  PetWithWalkSummary[]
> => {
  const response = await fetch("/api/pets/walk-summary");

  if (!response.ok) {
    throw new Error(`Backend error: ${response.status}`);
  }

  const data = await response.json();
  return data;
};

export const getPetWalkPriorityRequest = async (): Promise<
  PetWalkPriorityItem[]
> => {
  const response = await fetch("/api/pets/walk-priority");

  if (!response.ok) {
    throw new Error(`Backend error: ${response.status}`);
  }

  const data = await response.json();
  return data;
};

export const recordPetWalkRequest = async (
  petId: number,
  payload: CreatePetWalkDTO,
): Promise<PetWalkRow> => {
  const response = await fetch(`/api/pets/${petId}/walks`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error(`Walk record error: ${response.status}`);
  }

  const data = await response.json();
  return data;
};

export const uploadPetPhotoRequest = async (
  petId: number,
  file: File,
): Promise<string> => {
  const formData = new FormData();
  formData.append("photo", file);
  const response = await fetch(`/api/pets/${petId}/photo`, {
    method: "POST",
    body: formData,
  });
  if (!response.ok) {
    throw new Error(`Upload error: ${response.status}`);
  }
  const data = await response.json();
  return data.image_url;
};

export const getMyWalksRequest = async (): Promise<PetWalkRow[]> => {
  if (!supabase) {
    throw new Error("Supabase client is not initialized");
  }

  const {
    data: { session },
  } = await supabase.auth.getSession();
  const token = session?.access_token;

  if (!token) {
    console.warn(
      "No active session found - requesting walks anyway (will likely 401)",
    );
  }

  const response = await fetch("/api/pets/my-walks", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error(`My walks error: ${response.status}`);
  }

  return response.json();
};

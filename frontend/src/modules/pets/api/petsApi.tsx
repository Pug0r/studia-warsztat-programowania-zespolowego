import type {
  CreatePetWalkDTO,
  PetWalkPriorityItem,
  PetWalkRow,
  PetWithWalkSummary,
  Pet,
} from "@repo/types";

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
    const errorText = await response.text();
    console.error(errorText);

    throw new Error(`Walk record error: ${response.status} - ${errorText}`);
  }

  const data = await response.json();
  return data;
};

export const getPetWalksRequest = async (): Promise<PetWalkRow[]> => {
  const response = await fetch("/api/pets/walks");

  if (!response.ok) {
    throw new Error(`Backend error: ${response.status}`);
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

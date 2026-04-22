import api from "@/api/api";
import type { Pet } from "../types/Pets";
import type { CreatePetPayload, UpdatePetPayload } from "../types/Pets";

export const getPetListRequest = async (): Promise<Pet[]> => {
  const response = await fetch("/api/pets/");

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

export const createPetRequest = async (
  payload: CreatePetPayload,
): Promise<Pet> => {
  const response = await api.post("pets/", payload);
  return response.data;
};

export const updatePetRequest = async (
  id: number,
  payload: UpdatePetPayload,
): Promise<Pet> => {
  const response = await api.patch(`pets/${id}`, payload);
  return response.data;
};

export const deletePetRequest = async (id: number): Promise<void> => {
  await api.delete(`pets/${id}`);
};
